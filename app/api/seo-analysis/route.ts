import { NextRequest, NextResponse } from 'next/server'

interface PlaceDetails {
  place_id: string
  name: string
  formatted_address: string
  rating?: number
  user_ratings_total?: number
  website?: string
  phone?: string
  geometry?: {
    location: {
      lat: number
      lng: number
    }
  }
}

interface PageSpeedResult {
  url: string
  performance_score?: number
  accessibility_score?: number
  best_practices_score?: number
  seo_score?: number
  loading_experience?: string
  largest_contentful_paint?: number
  first_input_delay?: number
  cumulative_layout_shift?: number
  error?: string
}

interface CompetitorWithSEO extends PlaceDetails {
  distance_miles?: number
  pagespeed_data?: PageSpeedResult
  seo_rank?: number
}

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
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${selectedMedspa.place_id}&fields=name,formatted_address,rating,user_ratings_total,website,formatted_phone_number,geometry&key=${googleApiKey}`
      
      console.log('🌐 Calling Google Places Details API...')
      const detailsResponse = await fetch(detailsUrl)
      const detailsData = await detailsResponse.json()
      console.log('📊 Places Details response status:', detailsResponse.status)

      if (!detailsResponse.ok || !detailsData.result) {
        console.log('❌ Failed to get med spa details:', detailsData.error_message || 'Unknown error')
        return NextResponse.json(
          { error: 'Failed to get med spa details' },
          { status: 500 }
        )
      }

      medSpaDetails = detailsData.result
      console.log('✅ Got med spa details with coordinates:', medSpaDetails.geometry?.location)
    } else {
      medSpaDetails = selectedMedspa
      console.log('✅ Using existing coordinates:', medSpaDetails.geometry?.location)
    }

    const { lat, lng } = medSpaDetails.geometry!.location
    console.log(`🗺️ Med spa location: ${lat}, ${lng}`)

    // Step 2: Find nearby competitors within 10 miles (16093 meters)
    console.log('🔍 Step 2: Finding nearby competitors...')
    const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=16093&type=beauty_salon|spa&key=${googleApiKey}`
    
    console.log('🌐 Calling Google Places Nearby API...')
    const nearbyResponse = await fetch(nearbyUrl)
    const nearbyData = await nearbyResponse.json()
    console.log('📊 Places Nearby response status:', nearbyResponse.status)
    console.log('📊 Found places:', nearbyData.results?.length || 0)

    if (!nearbyResponse.ok) {
      console.error('❌ Places Nearby API error:', nearbyData)
      return NextResponse.json(
        { error: 'Failed to find nearby competitors' },
        { status: 500 }
      )
    }

    // Filter for medical spas and aesthetic clinics, exclude the selected one
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
    }) || []

    console.log(`🏢 Filtered to ${competitors.length} relevant competitors`)
    const competitorNames = competitors.slice(0, 8).map((c: any) => c.name)
    console.log('🏢 Top competitors:', competitorNames)

    // Step 3: Get detailed information for competitors and calculate distances
    console.log('📍 Step 3: Getting detailed competitor information...')
    const detailedCompetitors: CompetitorWithSEO[] = await Promise.all(
      competitors.slice(0, 8).map(async (competitor: any, index: number): Promise<CompetitorWithSEO> => {
        console.log(`🔍 Processing competitor ${index + 1}/${Math.min(competitors.length, 8)}: ${competitor.name}`)
        try {
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${competitor.place_id}&fields=name,formatted_address,rating,user_ratings_total,website,formatted_phone_number,geometry&key=${googleApiKey}`
          
          const detailsResponse = await fetch(detailsUrl)
          const detailsData = await detailsResponse.json()

          const details = detailsResponse.ok && detailsData.result ? detailsData.result : competitor

          // Calculate distance
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

          console.log(`✅ Competitor ${index + 1} processed: ${result.name} (${result.distance_miles} miles, website: ${!!result.website})`)
          return result
        } catch (error) {
          console.error(`❌ Error fetching competitor ${index + 1} details:`, error)
          return {
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
          }
        }
      })
    )

    const competitorsWithWebsites = detailedCompetitors.filter((competitor: CompetitorWithSEO) => competitor.website)
    console.log(`🌐 Found ${competitorsWithWebsites.length} competitors with websites`)

    // Step 4: Run PageSpeed Insights analysis for competitors with websites
    console.log('⚡ Step 4: Running PageSpeed analysis for competitors...')
    const competitorsWithSEO: CompetitorWithSEO[] = await Promise.all(
      detailedCompetitors.map(async (competitor, index): Promise<CompetitorWithSEO> => {
        if (competitor.website) {
          console.log(`⚡ Analyzing PageSpeed for ${competitor.name}: ${competitor.website}`)
          try {
            const pagespeedData = await analyzePageSpeed(competitor.website, pageSpeedApiKey)
            console.log(`✅ PageSpeed analysis completed for ${competitor.name}: ${pagespeedData.error ? 'FAILED' : 'SUCCESS'}`)
            return {
              ...competitor,
              pagespeed_data: pagespeedData
            }
          } catch (error) {
            console.error(`❌ PageSpeed analysis failed for ${competitor.name}:`, error)
            return {
              ...competitor,
              pagespeed_data: {
                url: competitor.website,
                error: 'Analysis failed'
              }
            }
          }
        } else {
          console.log(`⏭️ Skipping PageSpeed for ${competitor.name} (no website)`)
          return competitor
        }
      })
    )

    // Step 5: Analyze selected med spa if it has a website
    console.log('⚡ Step 5: Analyzing selected med spa PageSpeed...')
    let selectedMedSpaPageSpeed: PageSpeedResult | undefined
    if (medSpaDetails.website) {
      console.log(`⚡ Analyzing PageSpeed for selected med spa: ${medSpaDetails.website}`)
      try {
        selectedMedSpaPageSpeed = await analyzePageSpeed(medSpaDetails.website, pageSpeedApiKey)
        console.log(`✅ PageSpeed analysis completed for selected med spa: ${selectedMedSpaPageSpeed.error ? 'FAILED' : 'SUCCESS'}`)
      } catch (error) {
        console.error('❌ PageSpeed analysis failed for selected med spa:', error)
        selectedMedSpaPageSpeed = {
          url: medSpaDetails.website,
          error: 'Analysis failed'
        }
      }
    } else {
      console.log('⏭️ Selected med spa has no website, skipping PageSpeed analysis')
    }

    // Step 6: Calculate SEO rankings and competitive analysis
    console.log('📊 Step 6: Calculating SEO rankings...')
    const seoAnalysis = calculateSEORankings(competitorsWithSEO, selectedMedSpaPageSpeed)
    console.log(`📊 SEO analysis complete. Your position: #${seoAnalysis.yourPosition}`)

    const totalTime = Date.now() - startTime
    console.log(`🎉 SEO Analysis completed successfully in ${totalTime}ms`)

    return NextResponse.json({
      selectedMedspa: {
        ...medSpaDetails,
        pagespeed_data: selectedMedSpaPageSpeed
      },
      competitors: seoAnalysis.competitors,
      analysis: {
        totalCompetitors: competitorsWithSEO.length,
        competitorsWithWebsites: competitorsWithSEO.filter((c: CompetitorWithSEO) => c.website).length,
        yourSEOPosition: seoAnalysis.yourPosition,
        averagePerformanceScore: seoAnalysis.averagePerformanceScore,
        averageSEOScore: seoAnalysis.averageSEOScore,
        topPerformer: seoAnalysis.topPerformer,
        recommendations: generateSEORecommendations(seoAnalysis, selectedMedSpaPageSpeed)
      }
    })

  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error('💥 SEO analysis API error after', totalTime, 'ms:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function analyzePageSpeed(url: string, apiKey: string): Promise<PageSpeedResult> {
  const startTime = Date.now()
  console.log(`⚡ Starting PageSpeed analysis for: ${url}`)
  
  try {
    // Clean and validate URL
    const cleanUrl = url.startsWith('http') ? url : `https://${url}`
    console.log(`🔗 Cleaned URL: ${cleanUrl}`)
    
    const pageSpeedUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(cleanUrl)}&strategy=mobile&category=performance&category=accessibility&category=best-practices&category=seo&key=${apiKey}`
    
    console.log(`🌐 Calling PageSpeed Insights API...`)
    const response = await fetch(pageSpeedUrl, {
      timeout: 30000 // 30 second timeout
    } as any)
    
    const responseTime = Date.now() - startTime
    console.log(`📊 PageSpeed API response received in ${responseTime}ms, status: ${response.status}`)
    
    const data = await response.json()
    
    if (!response.ok) {
      console.log(`❌ PageSpeed API error: ${data.error?.message || 'Unknown error'}`)
      return {
        url: cleanUrl,
        error: data.error?.message || 'PageSpeed analysis failed'
      }
    }

    const lighthouse = data.lighthouseResult
    const categories = lighthouse?.categories || {}
    const audits = lighthouse?.audits || {}

    const result = {
      url: cleanUrl,
      performance_score: categories.performance?.score ? Math.round(categories.performance.score * 100) : undefined,
      accessibility_score: categories.accessibility?.score ? Math.round(categories.accessibility.score * 100) : undefined,
      best_practices_score: categories['best-practices']?.score ? Math.round(categories['best-practices'].score * 100) : undefined,
      seo_score: categories.seo?.score ? Math.round(categories.seo.score * 100) : undefined,
      loading_experience: data.loadingExperience?.overall_category,
      largest_contentful_paint: audits['largest-contentful-paint']?.numericValue,
      first_input_delay: audits['max-potential-fid']?.numericValue,
      cumulative_layout_shift: audits['cumulative-layout-shift']?.numericValue
    }

    const totalTime = Date.now() - startTime
    console.log(`✅ PageSpeed analysis completed in ${totalTime}ms. Scores: P:${result.performance_score} S:${result.seo_score} A:${result.accessibility_score}`)
    
    return result
  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error(`❌ PageSpeed analysis failed after ${totalTime}ms:`, error)
    return {
      url,
      error: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10 // Round to 1 decimal place
}

function calculateSEORankings(competitors: CompetitorWithSEO[], selectedPageSpeed?: PageSpeedResult) {
  // Sort competitors by overall SEO score (combination of performance and SEO scores)
  const rankedCompetitors = competitors
    .filter(c => c.pagespeed_data && !c.pagespeed_data.error)
    .map(competitor => {
      const pagespeed = competitor.pagespeed_data!
      const overallScore = calculateOverallSEOScore(pagespeed)
      return {
        ...competitor,
        seo_rank: overallScore
      }
    })
    .sort((a, b) => (b.seo_rank || 0) - (a.seo_rank || 0))

  const yourScore = selectedPageSpeed ? calculateOverallSEOScore(selectedPageSpeed) : 0
  const yourPosition = rankedCompetitors.filter(c => (c.seo_rank || 0) > yourScore).length + 1

  const performanceScores = rankedCompetitors
    .map(c => c.pagespeed_data?.performance_score)
    .filter(score => score !== undefined) as number[]
  
  const seoScores = rankedCompetitors
    .map(c => c.pagespeed_data?.seo_score)
    .filter(score => score !== undefined) as number[]

  return {
    competitors: rankedCompetitors,
    yourPosition,
    averagePerformanceScore: performanceScores.length > 0 
      ? Math.round(performanceScores.reduce((a, b) => a + b, 0) / performanceScores.length)
      : 0,
    averageSEOScore: seoScores.length > 0 
      ? Math.round(seoScores.reduce((a, b) => a + b, 0) / seoScores.length)
      : 0,
    topPerformer: rankedCompetitors[0] || null
  }
}

function calculateOverallSEOScore(pagespeed: PageSpeedResult): number {
  const performance = pagespeed.performance_score || 0
  const seo = pagespeed.seo_score || 0
  const accessibility = pagespeed.accessibility_score || 0
  const bestPractices = pagespeed.best_practices_score || 0
  
  // Weighted average: Performance 40%, SEO 30%, Accessibility 20%, Best Practices 10%
  return Math.round((performance * 0.4) + (seo * 0.3) + (accessibility * 0.2) + (bestPractices * 0.1))
}

function generateSEORecommendations(analysis: any, selectedPageSpeed?: PageSpeedResult): string[] {
  const recommendations: string[] = []

  if (!selectedPageSpeed) {
    recommendations.push("Add a website to your Google Business Profile to compete effectively")
    return recommendations
  }

  if (selectedPageSpeed.error) {
    recommendations.push("Fix website accessibility issues to enable proper SEO analysis")
    return recommendations
  }

  const performance = selectedPageSpeed.performance_score || 0
  const seo = selectedPageSpeed.seo_score || 0
  const accessibility = selectedPageSpeed.accessibility_score || 0

  if (performance < 50) {
    recommendations.push("Critical: Improve website loading speed - your performance score is significantly below average")
  } else if (performance < 75) {
    recommendations.push("Optimize website performance to match top competitors")
  }

  if (seo < 80) {
    recommendations.push("Improve on-page SEO elements (meta tags, headings, structured data)")
  }

  if (accessibility < 70) {
    recommendations.push("Enhance website accessibility to improve user experience and SEO")
  }

  if (analysis.yourPosition > 3) {
    recommendations.push("Focus on technical SEO improvements to outrank local competitors")
  }

  if (selectedPageSpeed.largest_contentful_paint && selectedPageSpeed.largest_contentful_paint > 2500) {
    recommendations.push("Optimize largest contentful paint (reduce image sizes, improve hosting)")
  }

  return recommendations
} 