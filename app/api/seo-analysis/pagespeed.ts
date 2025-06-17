import { PageSpeedResult, CompetitorWithSEO, PlaceDetails } from './types'

export async function analyzePageSpeedFast(url: string, apiKey: string): Promise<PageSpeedResult> {
  const startTime = Date.now()
  console.log(`⚡ Starting FAST PageSpeed analysis for: ${url}`)
  
  try {
    let cleanUrl = url.startsWith('http') ? url : `https://${url}`
    
    try {
      const urlObj = new URL(cleanUrl)
      urlObj.searchParams.delete('utm_source')
      urlObj.searchParams.delete('utm_medium')
      urlObj.searchParams.delete('utm_campaign')
      urlObj.searchParams.delete('utm_content')
      urlObj.searchParams.delete('utm_term')
      urlObj.hash = ''
      
      if (urlObj.pathname.includes('locator') || urlObj.pathname.includes('locations')) {
        cleanUrl = `${urlObj.origin}`
      } else {
        cleanUrl = urlObj.toString()
      }
    } catch (urlError) {
      console.log(`⚠️ URL parsing failed, using original: ${cleanUrl}`)
    }
    
    console.log(`🔗 Cleaned URL: ${cleanUrl}`)
    
    const pageSpeedUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(cleanUrl)}&strategy=mobile&category=performance&category=seo&key=${apiKey}`
    
    console.log(`🌐 Calling Fast PageSpeed Insights API...`)
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000)
    
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

export async function analyzePageSpeedWithRetry(url: string, apiKey: string, maxRetries: number = 2): Promise<PageSpeedResult> {
  let lastError: any = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 PageSpeed analysis attempt ${attempt}/${maxRetries} for: ${url}`)
      const result = await analyzePageSpeedFast(url, apiKey)
      
      if (!result.error || !result.error.includes('timed out')) {
        return result
      }
      
      lastError = result.error
      
      if (attempt === maxRetries) {
        return result
      }
      
      const delay = attempt * 2000
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

