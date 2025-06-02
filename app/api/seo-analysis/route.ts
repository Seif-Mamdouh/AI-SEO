import { NextRequest, NextResponse } from 'next/server'

interface Review {
  author_name: string
  author_url?: string
  language?: string
  profile_photo_url?: string
  rating: number
  relative_time_description: string
  text?: string
  time: number
}

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
  reviews?: Review[]
  photos?: Photo[]
}

interface Photo {
  height: number
  html_attributions: string[]
  photo_reference: string
  width: number
  name?: string
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

interface WebsiteParseResult {
  url: string
  title?: string
  description?: string
  keywords?: string
  headings: {
    h1: string[]
    h2: string[]
    h3: string[]
  }
  images: {
    src: string
    alt: string
  }[]
  links: {
    href: string
    text: string
  }[]
  socialLinks: {
    platform: string
    url: string
  }[]
  contactInfo: {
    email?: string
    phone?: string
  }
  structure: {
    hasNavigation: boolean
    hasFooter: boolean
    hasContactForm: boolean
    hasBookingForm: boolean
  }
  screenshot?: string
  error?: string
}

interface CompetitorWithSEO extends PlaceDetails {
  distance_miles?: number
  pagespeed_data?: PageSpeedResult
  website_data?: WebsiteParseResult
  seo_rank?: number
}

// PERFORMANCE OPTIMIZATION: Add simple in-memory cache with TTL
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

function getCachedData(key: string): any | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data
  }
  cache.delete(key)
  return null
}

function setCachedData(key: string, data: any, ttlMinutes: number = 10): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMinutes * 60 * 1000
  })
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  console.log('🚀 SEO Analysis API called at:', new Date().toISOString())
  
  let body: any
  try {
    body = await request.json()
    const { selectedMedspa, generate_llm_report = false } = body
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

    // PERFORMANCE OPTIMIZATION: Check cache first
    const cacheKey = `seo_analysis_${selectedMedspa.place_id}`
    const cachedResult = getCachedData(cacheKey)
    if (cachedResult) {
      console.log('⚡ Returning cached SEO analysis result')
      return NextResponse.json(cachedResult)
    }

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

    // PERFORMANCE OPTIMIZATION: Reduced radius and limit competitors
    console.log('🔍 Step 2: Finding nearby competitors...')
    const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=beauty_salon|spa&key=${googleApiKey}` // Reduced to 3 miles
    
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

    // PERFORMANCE OPTIMIZATION: Limit and filter competitors more aggressively
    let competitors = nearbyData.results || []
    
    // Filter out the selected med spa and places without basic info
    competitors = competitors.filter((place: any) => 
      place.place_id !== selectedMedspa.place_id && 
      place.rating && 
      place.user_ratings_total &&
      place.user_ratings_total >= 5 // Only include places with some reviews
    )

    // PERFORMANCE OPTIMIZATION: Limit to top 10 competitors by rating
    competitors = competitors
      .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 10) // Reduced from 20+ to 10

    console.log(`📊 Processing ${competitors.length} filtered competitors...`)

    // Step 3: PERFORMANCE OPTIMIZATION - Parallel processing with batching
    console.log('⚡ Step 3: Processing competitors in parallel...')
    
    const BATCH_SIZE = 3 // Process in smaller batches to avoid rate limits
    const competitorsWithSEO: CompetitorWithSEO[] = []
    
    for (let i = 0; i < competitors.length; i += BATCH_SIZE) {
      const batch = competitors.slice(i, i + BATCH_SIZE)
      console.log(`⚡ Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(competitors.length/BATCH_SIZE)}`)
      
      const batchResults = await Promise.allSettled(
        batch.map(async (competitor: any) => {
          try {
            // Get detailed info for competitor
            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${competitor.place_id}&fields=name,formatted_address,rating,user_ratings_total,website,formatted_phone_number,geometry&key=${googleApiKey}`
            
            const detailsResponse = await fetch(detailsUrl)
            const detailsData = await detailsResponse.json()
            
            if (!detailsResponse.ok || !detailsData.result) {
              console.log(`⚠️ Failed to get details for competitor: ${competitor.name}`)
              return null
            }

            const competitorDetails = detailsData.result
            
            // Calculate distance
            const distance = calculateDistance(
              lat, lng,
              competitorDetails.geometry?.location?.lat || 0,
              competitorDetails.geometry?.location?.lng || 0
            )

            const competitorWithDistance: CompetitorWithSEO = {
              ...competitorDetails,
              distance_miles: distance
            }

            // PERFORMANCE OPTIMIZATION: Only analyze websites for top competitors
            if (competitorDetails.website && distance <= 3) { // Only within 3 miles
              try {
                // Fast PageSpeed analysis only
                const pageSpeedData = await analyzePageSpeedFast(competitorDetails.website, pageSpeedApiKey)
                competitorWithDistance.pagespeed_data = pageSpeedData
              } catch (error) {
                console.log(`⚠️ PageSpeed analysis failed for ${competitorDetails.name}:`, error)
                competitorWithDistance.pagespeed_data = { url: competitorDetails.website, error: 'Analysis failed' }
              }
            }

            return competitorWithDistance
          } catch (error) {
            console.log(`❌ Error processing competitor ${competitor.name}:`, error)
            return null
          }
        })
      )

      // Add successful results to the list
      batchResults.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          competitorsWithSEO.push(result.value)
        }
      })

      // PERFORMANCE OPTIMIZATION: Add delay between batches to respect rate limits
      if (i + BATCH_SIZE < competitors.length) {
        await new Promise(resolve => setTimeout(resolve, 200)) // 200ms delay
      }
    }

    // Step 4: Analyze selected med spa website
    console.log('🏥 Step 4: Analyzing your med spa...')
    let selectedMedSpaAnalysis: { pageSpeed?: PageSpeedResult, websiteData?: WebsiteParseResult } = {}
    
    if (medSpaDetails.website) {
      try {
        console.log('🌐 Analyzing your website performance...')
        const pageSpeedData = await analyzePageSpeedFast(medSpaDetails.website, pageSpeedApiKey)
        selectedMedSpaAnalysis.pageSpeed = pageSpeedData
      } catch (error) {
        console.log('⚠️ PageSpeed analysis failed for your med spa:', error)
        selectedMedSpaAnalysis.pageSpeed = { url: medSpaDetails.website, error: 'Analysis failed' }
      }
    } else {
      console.log('ℹ️ No website found for your med spa')
    }

    const { pageSpeed: selectedMedSpaPageSpeed } = selectedMedSpaAnalysis || {}

    console.log(`✅ All analysis completed`)

    // Step 5: Calculate SEO rankings
    console.log('📊 Step 5: Calculating SEO rankings...')
    const seoAnalysis = calculateSEORankings(competitorsWithSEO, selectedMedSpaPageSpeed)
    console.log(`📊 SEO analysis complete. Your position: #${seoAnalysis.yourPosition}`)

    const totalTime = Date.now() - startTime
    console.log(`🎉 SEO Analysis completed successfully in ${totalTime}ms`)

    const responseData = {
      selectedMedspa: {
        ...medSpaDetails,
        pagespeed_data: selectedMedSpaPageSpeed,
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
        recommendations: generateSEORecommendations(seoAnalysis, selectedMedSpaPageSpeed)
      }
    }

    // Step 6: Generate LLM analysis report ONLY if explicitly requested
    let llmReport = null
    if (generate_llm_report) {
      try {
        console.log('🤖 Generating LLM SEO analysis report...')
        const llmResponse = await fetch(`${request.url.replace('/seo-analysis', '/llm-seo-analysis')}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seoData: responseData })
        })

        if (llmResponse.ok) {
          const llmData = await llmResponse.json()
          if (llmData.success) {
            llmReport = llmData.report
            console.log('✅ LLM report generated successfully')
          }
        }
      } catch (error) {
        console.log('⚠️ LLM report generation failed:', error)
      }
    }

    const finalResponse = {
      ...responseData,
      ...(llmReport && { llm_report: llmReport })
    }

    // PERFORMANCE OPTIMIZATION: Cache the result for 10 minutes
    setCachedData(cacheKey, finalResponse, 10)

    return NextResponse.json(finalResponse)

  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error('❌ SEO Analysis error after', totalTime, 'ms:', error)
    
    return NextResponse.json({
      error: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      selectedMedspa: body?.selectedMedspa || null
    }, { status: 500 })
  }
}

// PERFORMANCE OPTIMIZATION: Faster PageSpeed analysis with fewer metrics
async function analyzePageSpeedFast(url: string, apiKey: string): Promise<PageSpeedResult> {
  try {
    const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '')
    const fullUrl = cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`
    
    // Only analyze essential metrics for performance
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(fullUrl)}&key=${apiKey}&strategy=mobile&category=performance&category=seo`
    
    // Use AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
    
    const response = await fetch(apiUrl, { 
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error(`PageSpeed API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      url: fullUrl,
      performance_score: data.lighthouseResult?.categories?.performance?.score ? Math.round(data.lighthouseResult.categories.performance.score * 100) : undefined,
      seo_score: data.lighthouseResult?.categories?.seo?.score ? Math.round(data.lighthouseResult.categories.seo.score * 100) : undefined,
      loading_experience: data.loadingExperience?.overall_category || 'Unknown',
      largest_contentful_paint: data.lighthouseResult?.audits?.['largest-contentful-paint']?.numericValue,
      cumulative_layout_shift: data.lighthouseResult?.audits?.['cumulative-layout-shift']?.numericValue
    }
  } catch (error) {
    console.error('PageSpeed analysis error:', error)
    return {
      url,
      error: error instanceof Error ? error.message : 'Analysis failed'
    }
  }
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959 // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return Math.round(R * c * 10) / 10 // Round to 1 decimal place
}

function calculateSEORankings(competitors: CompetitorWithSEO[], selectedPageSpeed?: PageSpeedResult) {
  const competitorsWithScores = competitors.filter(c => 
    c.pagespeed_data && !c.pagespeed_data.error
  )

  // Calculate SEO scores for competitors
  competitorsWithScores.forEach(competitor => {
    const pagespeedData = competitor.pagespeed_data!
    competitor.seo_rank = calculateOverallSEOScore(pagespeedData)
  })

  // Calculate selected med spa's score
  const selectedScore = selectedPageSpeed ? calculateOverallSEOScore(selectedPageSpeed) : 0

  // Sort competitors by SEO score (highest first)
  const sortedCompetitors = competitorsWithScores.sort((a, b) => (b.seo_rank || 0) - (a.seo_rank || 0))

  // Find position of selected med spa
  let yourPosition = sortedCompetitors.length + 1
  for (let i = 0; i < sortedCompetitors.length; i++) {
    if (selectedScore > (sortedCompetitors[i].seo_rank || 0)) {
      yourPosition = i + 1
      break
    }
  }

  const performanceScores = competitorsWithScores.map(c => c.pagespeed_data?.performance_score || 0).filter(s => s > 0)
  const seoScores = competitorsWithScores.map(c => c.pagespeed_data?.seo_score || 0).filter(s => s > 0)

  return {
    competitors: sortedCompetitors,
    yourPosition,
    averagePerformanceScore: performanceScores.length > 0 ? Math.round(performanceScores.reduce((a, b) => a + b, 0) / performanceScores.length) : 0,
    averageSEOScore: seoScores.length > 0 ? Math.round(seoScores.reduce((a, b) => a + b, 0) / seoScores.length) : 0,
    topPerformer: sortedCompetitors[0] || null
  }
}

function calculateOverallSEOScore(pagespeed: PageSpeedResult): number {
  const scores = [
    pagespeed.performance_score || 0,
    pagespeed.seo_score || 0
  ].filter(score => score > 0)
  
  return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
}

function generateSEORecommendations(analysis: any, selectedPageSpeed?: PageSpeedResult): string[] {
  const recommendations: string[] = []
  
  if (!selectedPageSpeed || selectedPageSpeed.error) {
    recommendations.push("Create a professional website to establish online presence")
    recommendations.push("Set up Google Business Profile optimization")
    recommendations.push("Implement local SEO strategy")
    return recommendations
  }

  if ((selectedPageSpeed.performance_score || 0) < 70) {
    recommendations.push("Improve website loading speed - currently slower than competitors")
  }

  if ((selectedPageSpeed.seo_score || 0) < 80) {
    recommendations.push("Optimize page titles and meta descriptions for local search")
    recommendations.push("Add location-based keywords to content")
  }

  if (analysis.yourPosition > 3) {
    recommendations.push("Improve local search rankings - currently ranking lower than top competitors")
  }

  recommendations.push("Collect more customer reviews to improve local presence")
  
  return recommendations
} 