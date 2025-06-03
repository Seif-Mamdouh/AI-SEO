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

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  console.log('🚀 SEO Analysis API called at:', new Date().toISOString())
  
  try {
    const body = await request.json()
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

    // Step 3: Get detailed information for competitors in PARALLEL (OPTIMIZED)
    console.log('📍 Step 3: Getting detailed competitor information in parallel...')
    const detailedCompetitors: CompetitorWithSEO[] = await Promise.all(
      competitors.map(async (competitor: any, index: number): Promise<CompetitorWithSEO> => {
        console.log(`🔍 Processing competitor ${index + 1}/${competitors.length}: ${competitor.name}`)
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

    // Step 4: Run PageSpeed analysis in PARALLEL with faster timeouts (OPTIMIZED)
    console.log('⚡ Step 4: Running PageSpeed analysis in parallel...')
    
    // PARALLEL execution for both selected med spa and competitors
    const analysisPromises: Promise<any>[] = []
    
    // Add selected med spa analysis if it has a website
    if (medSpaDetails.website) {
      analysisPromises.push(
        Promise.all([
          analyzePageSpeedWithRetry(medSpaDetails.website, pageSpeedApiKey),
          fetch(`${request.nextUrl.origin}/api/website-parse`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              url: medSpaDetails.website,
              businessLocation: medSpaDetails.formatted_address,
              businessName: medSpaDetails.name
            })
          }).then(res => res.json()).catch(() => ({
            url: medSpaDetails.website,
            headings: { h1: [], h2: [], h3: [] },
            images: [], links: [], socialLinks: [], contactInfo: {},
            structure: { hasNavigation: false, hasFooter: false, hasContactForm: false, hasBookingForm: false },
            seoAnalysis: { overallScore: 0, totalChecks: 0, passedChecks: 0, headlines: [], metadata: [], technicalSEO: [] },
            error: 'Website parsing failed'
          }))
        ]).then(([pageSpeed, websiteData]) => ({ pageSpeed, websiteData }))
      )
    } else {
      analysisPromises.push(Promise.resolve({ pageSpeed: null, websiteData: null }))
    }

    // Add competitor analysis promises
    const competitorAnalysisPromise = Promise.all(
      detailedCompetitors.map(async (competitor): Promise<CompetitorWithSEO> => {
        if (competitor.website) {
          try {
            const pagespeedData = await analyzePageSpeedWithRetry(competitor.website, pageSpeedApiKey)
            return { ...competitor, pagespeed_data: pagespeedData }
          } catch (error) {
            console.error(`❌ PageSpeed analysis failed for ${competitor.name}:`, error)
            return { ...competitor, pagespeed_data: { url: competitor.website, error: 'Analysis failed' } }
          }
        } else {
          return competitor
        }
      })
    )

    // Execute all analysis in parallel
    const [selectedMedSpaAnalysis, competitorsWithSEO] = await Promise.all([
      analysisPromises[0],
      competitorAnalysisPromise
    ])

    const { pageSpeed: selectedMedSpaPageSpeed, websiteData: selectedMedSpaWebsiteData } = selectedMedSpaAnalysis || {}

    console.log(`✅ All analysis completed in parallel`)

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
        recommendations: generateSEORecommendations(seoAnalysis, selectedMedSpaPageSpeed)
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

// OPTIMIZED: Faster PageSpeed analysis with shorter timeout
async function analyzePageSpeedFast(url: string, apiKey: string): Promise<PageSpeedResult> {
  const startTime = Date.now()
  console.log(`⚡ Starting FAST PageSpeed analysis for: ${url}`)
  
  try {
    // Clean and validate URL - remove query parameters and fragments that cause issues
    let cleanUrl = url.startsWith('http') ? url : `https://${url}`
    
    // Remove problematic query parameters that cause timeouts
    try {
      const urlObj = new URL(cleanUrl)
      // Remove specific problematic parameters
      urlObj.searchParams.delete('utm_source')
      urlObj.searchParams.delete('utm_medium')
      urlObj.searchParams.delete('utm_campaign')
      urlObj.searchParams.delete('utm_content')
      urlObj.searchParams.delete('utm_term')
      urlObj.hash = '' // Remove fragment
      
      // For some URLs, just use the base domain + path
      if (urlObj.pathname.includes('locator') || urlObj.pathname.includes('locations')) {
        cleanUrl = `${urlObj.origin}`
      } else {
        cleanUrl = urlObj.toString()
      }
    } catch (urlError) {
      console.log(`⚠️ URL parsing failed, using original: ${cleanUrl}`)
    }
    
    console.log(`🔗 Cleaned URL: ${cleanUrl}`)
    
    // OPTIMIZED: Only get essential metrics to speed up analysis
    const pageSpeedUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(cleanUrl)}&strategy=mobile&category=performance&category=seo&key=${apiKey}`
    
    console.log(`🌐 Calling Fast PageSpeed Insights API...`)
    
    // INCREASED: Timeout from 15s to 30s for better success rate
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // Increased to 60 seconds
    
    const response = await fetch(pageSpeedUrl, {
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    const responseTime = Date.now() - startTime
    console.log(`📊 Fast PageSpeed API response received in ${responseTime}ms, status: ${response.status}`)
    
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
      seo_score: categories.seo?.score ? Math.round(categories.seo.score * 100) : undefined,
      // OPTIMIZED: Skip accessibility and best practices for speed
      largest_contentful_paint: audits['largest-contentful-paint']?.numericValue,
      cumulative_layout_shift: audits['cumulative-layout-shift']?.numericValue
    }

    const totalTime = Date.now() - startTime
    console.log(`✅ Fast PageSpeed analysis completed in ${totalTime}ms. Scores: P:${result.performance_score} S:${result.seo_score}`)
    
    return result
  } catch (error) {
    const totalTime = Date.now() - startTime
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`⏱️ PageSpeed analysis timed out after ${totalTime}ms for: ${url}`)
      return { url, error: 'Analysis timed out - site may be very slow or unresponsive' }
    }
    console.error(`❌ Fast PageSpeed analysis failed after ${totalTime}ms:`, error)
    return {
      url,
      error: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

// Retry wrapper for PageSpeed analysis
async function analyzePageSpeedWithRetry(url: string, apiKey: string, maxRetries: number = 2): Promise<PageSpeedResult> {
  let lastError: any = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 PageSpeed analysis attempt ${attempt}/${maxRetries} for: ${url}`)
      const result = await analyzePageSpeedFast(url, apiKey)
      
      // If successful or it's a legitimate error (not a timeout), return the result
      if (!result.error || !result.error.includes('timed out')) {
        return result
      }
      
      lastError = result.error
      
      // If it's the last attempt, return the error result
      if (attempt === maxRetries) {
        return result
      }
      
      // Wait before retry (exponential backoff)
      const delay = attempt * 2000 // 2s, 4s, etc.
      console.log(`⏳ Waiting ${delay}ms before retry...`)
      await new Promise(resolve => setTimeout(resolve, delay))
      
    } catch (error) {
      lastError = error
      console.error(`❌ Attempt ${attempt} failed:`, error)
      
      if (attempt === maxRetries) {
        return {
          url,
          error: `All ${maxRetries} attempts failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      }
    }
  }
  
  return {
    url,
    error: `All ${maxRetries} attempts failed: ${lastError}`
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
  
  // OPTIMIZED: Simplified calculation since we're not getting all scores
  return Math.round((performance * 0.6) + (seo * 0.4))
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

  if (performance < 50) {
    recommendations.push("Critical: Improve website loading speed - your performance score is significantly below average")
  } else if (performance < 75) {
    recommendations.push("Optimize website performance to match top competitors")
  }

  if (seo < 80) {
    recommendations.push("Improve on-page SEO elements (meta tags, headings, structured data)")
  }

  if (analysis.yourPosition > 3) {
    recommendations.push("Focus on technical SEO improvements to outrank local competitors")
  }

  if (selectedPageSpeed.largest_contentful_paint && selectedPageSpeed.largest_contentful_paint > 2500) {
    recommendations.push("Optimize largest contentful paint (reduce image sizes, improve hosting)")
  }

  return recommendations
}