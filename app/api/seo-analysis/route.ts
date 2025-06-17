import { NextRequest, NextResponse } from 'next/server'
import { CompetitorWithSEO } from './types'
import { getMedSpaDetails, findNearbyCompetitors, getDetailedCompetitors } from './google-places'
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
    const medSpaDetailsResult = await getMedSpaDetails(selectedMedspa, googleApiKey)
    if (medSpaDetailsResult instanceof NextResponse) {
      return medSpaDetailsResult
    }
    const medSpaDetails = medSpaDetailsResult

    const { lat, lng } = medSpaDetails.geometry!.location
    console.log(`🗺️ Med spa location: ${lat}, ${lng}`)

    // Step 2: Find nearby competitors
    const competitorsResult = await findNearbyCompetitors(medSpaDetails, googleApiKey)
    if (competitorsResult instanceof NextResponse) {
      return competitorsResult
    }
    const competitors = competitorsResult

    // Step 3: Get detailed info for each competitor
    const detailedCompetitors = await getDetailedCompetitors(competitors, lat, lng, googleApiKey)

    // Step 4: Analyze PageSpeed and website data for selected med spa
    console.log('⚡ Step 4: Running PageSpeed analysis sequentially...')
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
