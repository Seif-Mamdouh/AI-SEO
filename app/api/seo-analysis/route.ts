import { NextRequest, NextResponse } from 'next/server'
import { PlaceDetails, CompetitorWithSEO, PageSpeedResult } from './types'
import { calculateDistance } from './google-places'
import { calculateSEORankings, generateSEORecommendations } from './seo-calculations'
import { analyzePageSpeedWithRetry } from './pagespeed'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  console.log('🚀 SEO Analysis API called at:', new Date().toISOString())
  
  try {
    const body = await request.json()
    const { selectedMedspa } = body
    console.log('📍 Selected MedSpa:', selectedMedspa?.name, selectedMedspa?.place_id)

    if (!selectedMedspa) {
      console.log('❌ No selected medspa provided')
      return NextResponse.json(
        { error: 'Selected med spa information is required' },
        { status: 400 }
      )
    }

    const googleApiKey = process.env.GOOGLE_PLACES_API_KEY
    const pageSpeedApiKey = process.env.PAGESPEED_INSIGHTS_API_KEY

    if (!googleApiKey) {
      console.log('❌ Google Places API key not configured')
      return NextResponse.json(
        { error: 'Google Places API key not configured' },
        { status: 500 }
      )
    }

    if (!pageSpeedApiKey) {
      console.log('❌ PageSpeed Insights API key not configured')
      return NextResponse.json(
        { error: 'PageSpeed Insights API key not configured' },
        { status: 500 }
      )
    }

    console.log('✅ API keys validated')

    // Step 1: Get detailed info for selected med spa including coordinates
    console.log('📍 Step 1: Getting med spa details...')
    let medSpaDetails: PlaceDetails
    
    if (!selectedMedspa.geometry?.location) {
      console.log('🔍 Need to fetch coordinates for med spa')
      // Get place details if we don't have coordinates
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${selectedMedspa.place_id}&fields=name,formatted_address,rating,user_ratings_total,website,formatted_phone_number,geometry,reviews,photos&key=${googleApiKey}`
      
      console.log('🌐 Calling Google Places Details API...')
      const detailsResponse = await fetch(detailsUrl)
      const detailsData = await detailsResponse.json()
      console.log('📊 Places Details response status:', detailsResponse.status)
      console.log('🔍 Google Places API Debug:', {
        url: detailsUrl,
        responseStatus: detailsResponse.status,
        hasResult: !!detailsData.result,
        resultKeys: detailsData.result ? Object.keys(detailsData.result) : null,
        reviews: detailsData.result?.reviews,
        reviewsLength: detailsData.result?.reviews?.length || 0,
        rating: detailsData.result?.rating,
        userRatingsTotal: detailsData.result?.user_ratings_total,
        fullResponse: detailsData
      })

      if (!detailsResponse.ok || !detailsData.result) {
        console.log('❌ Failed to get med spa details:', detailsData.error_message || 'Unknown error')
        return NextResponse.json(
          { error: 'Failed to get med spa details' },
          { status: 500 }
        )
      }

      medSpaDetails = detailsData.result
      console.log('✅ Got med spa details with coordinates:', medSpaDetails.geometry?.location)
      console.log('🔍 Med Spa Details Debug:', {
        name: medSpaDetails.name,
        rating: medSpaDetails.rating,
        userRatingsTotal: medSpaDetails.user_ratings_total,
        hasReviews: !!medSpaDetails.reviews,
        reviewsCount: medSpaDetails.reviews?.length || 0,
        hasPhotos: !!medSpaDetails.photos,
        photosCount: medSpaDetails.photos?.length || 0,
        photos: medSpaDetails.photos
      })
    } else {
      medSpaDetails = selectedMedspa
      console.log('✅ Using existing coordinates:', medSpaDetails.geometry?.location)
    }

    const { lat, lng } = medSpaDetails.geometry!.location
    console.log(`🗺️ Med spa location: ${lat}, ${lng}`)

    // Step 2: Find nearby competitors within 10 miles (OPTIMIZED: Reduced radius and limit results)
    console.log('🔍 Step 2: Finding nearby competitors...')
    const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=8047&type=beauty_salon|spa&key=${googleApiKey}` // Reduced to 5 miles
    
    console.log('🌐 Calling Google Places Nearby API...')
    const nearbyResponse = await fetch(nearbyUrl)
    const nearbyData = await nearbyResponse.json()
    console.log('📊 Found places:', nearbyData.results?.length || 0)

    if (!nearbyResponse.ok) {
      console.error('❌ Places Nearby API error:', nearbyData)
      return NextResponse.json(
        { error: 'Failed to find nearby competitors' },
        { status: 500 }
      )
    }

    // Filter for medical spas and aesthetic clinics, exclude the selected one (OPTIMIZED: Limit to top 5)
    const competitors = nearbyData.results?.filter((place: any) => {
      const name = place.name.toLowerCase()
      const types = place.types || []
      
      // Exclude the selected medspa itself
      if (place.place_id === selectedMedspa.place_id) {
        return false
      }
      
      // Focus on medical spas and aesthetic clinics
      return (
        name.includes('med spa') ||
        name.includes('medical spa') ||
        name.includes('aesthetic') ||
        name.includes('dermatology') ||
        name.includes('cosmetic') ||
        name.includes('laser') ||
        name.includes('botox') ||
        name.includes('filler') ||
        types.includes('spa') ||
        types.includes('health') ||
        types.includes('beauty_salon')
      )
    }).slice(0, 5) || [] // OPTIMIZED: Limit to 5 competitors

    console.log(`🏢 Filtered to ${competitors.length} relevant competitors`)

    // Remove parallel execution for competitor analysis and PageSpeed analysis
    const detailedCompetitors: CompetitorWithSEO[] = []
    for (const competitor of competitors) {
      console.log(`🔍 Processing competitor: ${competitor.name}`)
      try {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${competitor.place_id}&fields=name,formatted_address,rating,user_ratings_total,website,formatted_phone_number,geometry&key=${googleApiKey}`
        const detailsResponse = await fetch(detailsUrl)
        const detailsData = await detailsResponse.json()
        const details = detailsResponse.ok && detailsData.result ? detailsData.result : competitor
        const distance = calculateDistance(
          lat, lng,
          details.geometry?.location?.lat || competitor.geometry?.location?.lat,
          details.geometry?.location?.lng || competitor.geometry?.location?.lng
        )
        const result = {
          place_id: details.place_id,
          name: details.name,
          formatted_address: details.formatted_address,
          rating: details.rating,
          user_ratings_total: details.user_ratings_total,
          website: details.website,
          phone: details.formatted_phone_number,
          geometry: details.geometry,
          distance_miles: distance
        }
        console.log(`✅ Competitor processed: ${result.name} (${result.distance_miles} miles, website: ${!!result.website})`)
        detailedCompetitors.push(result)
      } catch (error) {
        console.error(`❌ Error fetching competitor details:`, error)
        detailedCompetitors.push({
          place_id: competitor.place_id,
          name: competitor.name,
          formatted_address: competitor.formatted_address,
          rating: competitor.rating,
          user_ratings_total: competitor.user_ratings_total,
          distance_miles: calculateDistance(
            lat, lng,
            competitor.geometry?.location?.lat,
            competitor.geometry?.location?.lng
          )
        })
      }
    }

    const competitorsWithWebsites = detailedCompetitors.filter((competitor: CompetitorWithSEO) => competitor.website)
    console.log(`🌐 Found ${competitorsWithWebsites.length} competitors with websites`)

    // Sequential execution for PageSpeed analysis
    console.log('⚡ Running PageSpeed analysis sequentially...')
    let selectedMedSpaPageSpeed = null
    let selectedMedSpaWebsiteData = null

    if (medSpaDetails.website) {
      console.log('🔍 Analyzing PageSpeed for selected med spa...')
      selectedMedSpaPageSpeed = await analyzePageSpeedWithRetry(medSpaDetails.website, pageSpeedApiKey)
      
      console.log('🔍 Parsing website data for selected med spa...')
      try {
        const websiteResponse = await fetch(`${request.nextUrl.origin}/api/website-parse`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            url: medSpaDetails.website,
            businessLocation: medSpaDetails.formatted_address,
            businessName: medSpaDetails.name
          })
        })
        selectedMedSpaWebsiteData = await websiteResponse.json()
      } catch (error) {
        console.error('❌ Website parsing failed:', error)
        selectedMedSpaWebsiteData = {
          url: medSpaDetails.website,
          headings: { h1: [], h2: [], h3: [] },
          images: [], links: [], socialLinks: [], contactInfo: {},
          structure: { hasNavigation: false, hasFooter: false, hasContactForm: false, hasBookingForm: false },
          seoAnalysis: { overallScore: 0, totalChecks: 0, passedChecks: 0, headlines: [], metadata: [], technicalSEO: [] },
          error: 'Website parsing failed'
        }
      }
    }

    // Remove PageSpeed analysis for competitors
    const competitorsWithSEO = detailedCompetitors.map(competitor => ({ ...competitor }))

    console.log(`✅ All analysis completed without competitor PageSpeed analysis`)

    // Step 5: Calculate SEO rankings
    console.log('📊 Step 5: Calculating SEO rankings...')
    const seoAnalysis = calculateSEORankings(competitorsWithSEO, selectedMedSpaPageSpeed || undefined)
    console.log(`📊 SEO analysis complete. Your position: #${seoAnalysis.yourPosition}`)

    const totalTime = Date.now() - startTime
    console.log(`🎉 SEO Analysis completed successfully in ${totalTime}ms`)

    const responseData = {
      selectedMedspa: {
        ...medSpaDetails,
        pagespeed_data: selectedMedSpaPageSpeed || undefined,
        website_data: selectedMedSpaWebsiteData || undefined,
        reviews: medSpaDetails.reviews || []
      },
      competitors: seoAnalysis.competitors,
      analysis: {
        totalCompetitors: competitorsWithSEO.length,
        competitorsWithWebsites: competitorsWithSEO.filter((c: CompetitorWithSEO) => c.website).length,
        yourSEOPosition: seoAnalysis.yourPosition,
        averagePerformanceScore: seoAnalysis.averagePerformanceScore,
        averageSEOScore: seoAnalysis.averageSEOScore,
        topPerformer: seoAnalysis.topPerformer,
        recommendations: generateSEORecommendations(seoAnalysis, selectedMedSpaPageSpeed || undefined)
      }
    }

    // Remove LLM functionality
    console.log(`🎉 Complete SEO Analysis finished in ${totalTime}ms`)

    return NextResponse.json(responseData)

  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error('💥 SEO analysis API error after', totalTime, 'ms:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
