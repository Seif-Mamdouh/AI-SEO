import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

interface SEOAnalysisItem {
  name: string
  status: 'passed' | 'failed' | 'warning'
  score: number
  description: string
  recommendation?: string
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
  services: {
    name: string
    description?: string
  }[]
  structure: {
    hasNavigation: boolean
    hasFooter: boolean
    hasContactForm: boolean
    hasBookingForm: boolean
  }
  seoAnalysis: {
    overallScore: number
    totalChecks: number
    passedChecks: number
    headlines: SEOAnalysisItem[]
    metadata: SEOAnalysisItem[]
    technicalSEO: SEOAnalysisItem[]
  }
  screenshot?: string // base64 encoded image
  error?: string
}

// Med spa related keywords for analysis
const MED_SPA_KEYWORDS = [
  'botox', 'filler', 'laser', 'facial', 'med spa', 'medical spa', 'aesthetics', 'beauty', 'skin care',
  'dermal filler', 'chemical peel', 'microneedling', 'coolsculpting', 'laser hair removal',
  'hydrafacial', 'lip filler', 'wrinkle', 'anti-aging', 'cosmetic', 'treatment', 'injection',
  'rejuvenation', 'skin tightening', 'body contouring'
]

const LOCATION_KEYWORDS = [
  'near me', 'local', 'city', 'area', 'location', 'address', 'neighborhood', 'town', 'region'
]

// Common med spa services for detection
const MED_SPA_SERVICES = [
  { name: 'Botox', keywords: ['botox', 'botulinum toxin', 'anti-wrinkle injection'] },
  { name: 'Dermal Fillers', keywords: ['filler', 'dermal filler', 'lip filler', 'cheek filler', 'injectable'] },
  { name: 'Laser Hair Removal', keywords: ['laser hair', 'hair removal', 'laser treatment for hair'] },
  { name: 'Chemical Peels', keywords: ['chemical peel', 'skin peel', 'facial peel'] },
  { name: 'Microdermabrasion', keywords: ['microdermabrasion', 'skin resurfacing'] },
  { name: 'Microneedling', keywords: ['microneedling', 'collagen induction therapy', 'skin needling'] },
  { name: 'HydraFacial', keywords: ['hydrafacial', 'hydra facial', 'hydradermabrasion'] },
  { name: 'CoolSculpting', keywords: ['coolsculpting', 'fat freezing', 'cryolipolysis'] },
  { name: 'Body Contouring', keywords: ['body contouring', 'body sculpting', 'fat reduction'] },
  { name: 'Skin Rejuvenation', keywords: ['skin rejuvenation', 'skin revitalization', 'anti-aging treatment'] },
  { name: 'Laser Skin Resurfacing', keywords: ['laser resurfacing', 'skin resurfacing', 'laser treatment skin'] },
  { name: 'IPL Therapy', keywords: ['ipl', 'intense pulsed light', 'photofacial'] },
  { name: 'RF Skin Tightening', keywords: ['rf skin', 'radiofrequency', 'skin tightening', 'thermage'] },
  { name: 'Vampire Facial', keywords: ['vampire facial', 'prp facial', 'platelet-rich plasma'] },
  { name: 'Thread Lift', keywords: ['thread lift', 'pdo threads', 'non-surgical facelift'] }
]

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  console.log('🌐 Website Parse API called at:', new Date().toISOString())
  
  try {
    const body = await request.json()
    const { url, businessLocation, businessName } = body

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Clean and validate URL
    const cleanUrl = url.startsWith('http') ? url : `https://${url}`
    console.log(`🔍 Parsing website: ${cleanUrl}`)

    try {
      // Fetch HTML content directly
      console.log('📱 Fetching website content...')
      const response = await fetch(cleanUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        // Add timeout
        signal: AbortSignal.timeout(10000)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const htmlContent = await response.text()

      // Parse HTML with Cheerio
      console.log('🔍 Parsing HTML content...')
      const $ = cheerio.load(htmlContent)

      // Extract meta information
      const title = $('title').text() || $('meta[property="og:title"]').attr('content') || ''
      const description = $('meta[name="description"]').attr('content') || 
                         $('meta[property="og:description"]').attr('content') || ''
      const keywords = $('meta[name="keywords"]').attr('content') || ''

      // Extract headings
      const headings = {
        h1: $('h1').map((i, el) => $(el).text().trim()).get(),
        h2: $('h2').map((i, el) => $(el).text().trim()).get(),
        h3: $('h3').map((i, el) => $(el).text().trim()).get()
      }

      // Extract images
      const images = $('img').map((i, el) => ({
        src: $(el).attr('src') || '',
        alt: $(el).attr('alt') || ''
      })).get().filter(img => img.src)

      // Extract links
      const links = $('a[href]').map((i, el) => ({
        href: $(el).attr('href') || '',
        text: $(el).text().trim()
      })).get().filter(link => link.href && link.text)

      // Extract social media links
      const socialPlatforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok']
      const socialLinks = links.filter(link => 
        socialPlatforms.some(platform => 
          link.href.toLowerCase().includes(platform) || 
          link.text.toLowerCase().includes(platform)
        )
      ).map(link => {
        const platform = socialPlatforms.find(p => 
          link.href.toLowerCase().includes(p) || 
          link.text.toLowerCase().includes(p)
        )
        return {
          platform: platform || 'unknown',
          url: link.href
        }
      })

      // Extract contact information
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
      const phoneRegex = /(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g
      
      const pageText = $('body').text()
      const emails = pageText.match(emailRegex) || []
      const phones = pageText.match(phoneRegex) || []

      const contactInfo = {
        email: emails[0] || undefined,
        phone: phones[0] || undefined
      }

      // Analyze website structure
      const structure = {
        hasNavigation: $('nav, .nav, .navbar, .navigation').length > 0,
        hasFooter: $('footer, .footer').length > 0,
        hasContactForm: $('form').filter((i, el) => {
          const formText = $(el).text().toLowerCase()
          return formText.includes('contact') || formText.includes('email') || formText.includes('message')
        }).length > 0,
        hasBookingForm: $('form, .booking, .appointment, .schedule').filter((i, el) => {
          const formText = $(el).text().toLowerCase()
          return formText.includes('book') || formText.includes('appointment') || formText.includes('schedule')
        }).length > 0
      }

      // Extract services from the website
      const services = extractMedSpaServices($)
      console.log('🔍 Extracted med spa services:', {
        count: services.length,
        services: services.map(s => ({ name: s.name, hasDescription: !!s.description }))
      })

      // Perform comprehensive SEO analysis
      const seoAnalysis = performSEOAnalysis($, {
        title,
        description,
        keywords,
        headings,
        images,
        businessLocation,
        businessName
      })

      const result: WebsiteParseResult = {
        url: cleanUrl,
        title,
        description,
        keywords,
        headings,
        images: images.slice(0, 10), // Limit to first 10 images
        links: links.slice(0, 20), // Limit to first 20 links
        socialLinks,
        contactInfo,
        services,
        structure,
        seoAnalysis,
        // Note: Screenshots disabled for now to avoid bundling issues
        screenshot: undefined
      }

      const totalTime = Date.now() - startTime
      console.log(`✅ Website parsing completed in ${totalTime}ms`)

      return NextResponse.json(result)

    } catch (fetchError) {
      console.error('❌ Website fetch/parse error:', fetchError)
      throw fetchError
    }

  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error('❌ Website parsing error after', totalTime, 'ms:', error)
    
    return NextResponse.json({
      url: '',
      headings: { h1: [], h2: [], h3: [] },
      images: [],
      links: [],
      socialLinks: [],
      contactInfo: {},
      services: [],
      structure: {
        hasNavigation: false,
        hasFooter: false,
        hasContactForm: false,
        hasBookingForm: false
      },
      seoAnalysis: {
        overallScore: 0,
        totalChecks: 0,
        passedChecks: 0,
        headlines: [],
        metadata: [],
        technicalSEO: []
      },
      error: `Parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    } as WebsiteParseResult)
  }
}

function performSEOAnalysis($: any, data: {
  title: string
  description: string
  keywords: string
  headings: any
  images: any[]
  businessLocation?: string
  businessName?: string
}) {
  const headlines: SEOAnalysisItem[] = []
  const metadata: SEOAnalysisItem[] = []
  const technicalSEO: SEOAnalysisItem[] = []

  // Extract location info from business data
  const locationInfo = extractLocationInfo(data.businessLocation || '')
  
  // HEADLINE ANALYSIS
  
  // Check if H1 exists
  const h1Analysis = analyzeH1Tags(data.headings.h1)
  headlines.push({
    name: 'Exists',
    status: h1Analysis.exists ? 'passed' : 'failed',
    score: h1Analysis.exists ? 100 : 0,
    description: h1Analysis.exists ? 'Page has H1 heading tag' : 'Missing H1 heading tag',
    recommendation: h1Analysis.exists ? undefined : 'Add an H1 tag to clearly define the main topic of your page'
  })

  // Check if H1 includes service area
  const h1ServiceArea = checkServiceAreaInContent(data.headings.h1.join(' '), locationInfo)
  headlines.push({
    name: 'Includes the service area',
    status: h1ServiceArea.found ? 'passed' : 'failed',
    score: h1ServiceArea.found ? 100 : 0,
    description: h1ServiceArea.found 
      ? `H1 mentions location: ${h1ServiceArea.foundTerms.join(', ')}` 
      : 'H1 heading does not mention your service area',
    recommendation: h1ServiceArea.found ? undefined : 'Include your city/location in the H1 to improve local SEO'
  })

  // Check if H1 includes relevant keywords
  const h1Keywords = checkMedSpaKeywords(data.headings.h1.join(' '))
  headlines.push({
    name: 'Includes relevant keywords',
    status: h1Keywords.found ? 'passed' : 'failed',
    score: h1Keywords.found ? 100 : 0,
    description: h1Keywords.found 
      ? `H1 includes relevant terms: ${h1Keywords.foundTerms.join(', ')}` 
      : 'H1 heading lacks relevant med spa keywords',
    recommendation: h1Keywords.found ? undefined : 'Include relevant med spa services (botox, facial, laser, etc.) in your H1'
  })

  // METADATA ANALYSIS

  // Check images have alt tags
  const altTagAnalysis = analyzeImageAltTags(data.images)
  metadata.push({
    name: 'Images have "alt tags"',
    status: altTagAnalysis.status,
    score: altTagAnalysis.score,
    description: altTagAnalysis.description,
    recommendation: altTagAnalysis.recommendation
  })

  // Check meta description length
  const descriptionAnalysis = analyzeMetaDescription(data.description)
  metadata.push({
    name: 'Description length',
    status: descriptionAnalysis.status,
    score: descriptionAnalysis.score,
    description: descriptionAnalysis.description,
    recommendation: descriptionAnalysis.recommendation
  })

  // Check if description includes service area
  const descServiceArea = checkServiceAreaInContent(data.description, locationInfo)
  metadata.push({
    name: 'Description includes the service area',
    status: descServiceArea.found ? 'passed' : 'failed',
    score: descServiceArea.found ? 100 : 0,
    description: descServiceArea.found 
      ? `Meta description mentions location: ${descServiceArea.foundTerms.join(', ')}`
      : 'Meta description does not mention your service area',
    recommendation: descServiceArea.found ? undefined : 'Include your city/location in the meta description for better local search visibility'
  })

  // Check if description includes relevant keywords
  const descKeywords = checkMedSpaKeywords(data.description)
  metadata.push({
    name: 'Description includes relevant keywords',
    status: descKeywords.found ? 'passed' : 'failed',
    score: descKeywords.found ? 100 : 0,
    description: descKeywords.found 
      ? `Meta description includes: ${descKeywords.foundTerms.join(', ')}`
      : 'Meta description lacks relevant med spa keywords',
    recommendation: descKeywords.found ? undefined : 'Include key services and treatments in your meta description'
  })

  // Check if page title matches business name (if provided)
  if (data.businessName) {
    const titleMatchesName = checkBusinessNameInTitle(data.title, data.businessName)
    metadata.push({
      name: 'Page title matches Google Business Profile',
      status: titleMatchesName.matches ? 'passed' : 'warning',
      score: titleMatchesName.matches ? 100 : 70,
      description: titleMatchesName.description,
      recommendation: titleMatchesName.recommendation
    })
  }

  // Check if page title includes service area
  const titleServiceArea = checkServiceAreaInContent(data.title, locationInfo)
  metadata.push({
    name: 'Page title includes the service area',
    status: titleServiceArea.found ? 'passed' : 'failed',
    score: titleServiceArea.found ? 100 : 0,
    description: titleServiceArea.found 
      ? `Page title mentions location: ${titleServiceArea.foundTerms.join(', ')}`
      : 'Page title does not mention your service area',
    recommendation: titleServiceArea.found ? undefined : 'Include your city/location in the page title for better local SEO'
  })

  // Check if page title includes relevant keywords
  const titleKeywords = checkMedSpaKeywords(data.title)
  metadata.push({
    name: 'Page title includes a relevant keyword',
    status: titleKeywords.found ? 'passed' : 'failed',
    score: titleKeywords.found ? 100 : 0,
    description: titleKeywords.found 
      ? `Page title includes: ${titleKeywords.foundTerms.join(', ')}`
      : 'Page title lacks relevant med spa keywords',
    recommendation: titleKeywords.found ? undefined : 'Include primary services or "med spa" in your page title'
  })

  // Calculate overall scores
  const allChecks = [...headlines, ...metadata, ...technicalSEO]
  const totalChecks = allChecks.length
  const passedChecks = allChecks.filter(check => check.status === 'passed').length
  const overallScore = totalChecks > 0 ? Math.round((allChecks.reduce((sum, check) => sum + check.score, 0) / totalChecks)) : 0

  return {
    overallScore,
    totalChecks,
    passedChecks,
    headlines,
    metadata,
    technicalSEO
  }
}

// Helper functions for SEO analysis

function extractLocationInfo(businessLocation: string) {
  if (!businessLocation) return { city: '', state: '', areas: [] }
  
  const parts = businessLocation.split(',').map(part => part.trim())
  return {
    city: parts[0] || '',
    state: parts[1] || '',
    areas: parts
  }
}

function analyzeH1Tags(h1Tags: string[]) {
  return {
    exists: h1Tags.length > 0,
    count: h1Tags.length,
    content: h1Tags
  }
}

function checkServiceAreaInContent(content: string, locationInfo: any) {
  const contentLower = content.toLowerCase()
  const foundTerms: string[] = []
  
  // Check for specific location terms
  if (locationInfo.city && contentLower.includes(locationInfo.city.toLowerCase())) {
    foundTerms.push(locationInfo.city)
  }
  if (locationInfo.state && contentLower.includes(locationInfo.state.toLowerCase())) {
    foundTerms.push(locationInfo.state)
  }
  
  // Check for general location keywords
  const locationKeywordsFound = LOCATION_KEYWORDS.filter(keyword => 
    contentLower.includes(keyword.toLowerCase())
  )
  foundTerms.push(...locationKeywordsFound)
  
  return {
    found: foundTerms.length > 0,
    foundTerms: Array.from(new Set(foundTerms)) // Remove duplicates - fixed for TypeScript
  }
}

function checkMedSpaKeywords(content: string) {
  const contentLower = content.toLowerCase()
  const foundTerms = MED_SPA_KEYWORDS.filter(keyword => 
    contentLower.includes(keyword.toLowerCase())
  )
  
  return {
    found: foundTerms.length > 0,
    foundTerms
  }
}

function analyzeImageAltTags(images: any[]) {
  if (images.length === 0) {
    return {
      status: 'warning' as const,
      score: 50,
      description: 'No images found on the page',
      recommendation: 'Add relevant images with descriptive alt tags'
    }
  }
  
  const imagesWithAlt = images.filter(img => img.alt && img.alt.trim().length > 0)
  const percentage = Math.round((imagesWithAlt.length / images.length) * 100)
  
  if (percentage === 100) {
    return {
      status: 'passed' as const,
      score: 100,
      description: `All ${images.length} images have alt tags`,
      recommendation: undefined
    }
  } else if (percentage >= 80) {
    return {
      status: 'warning' as const,
      score: 80,
      description: `${imagesWithAlt.length} of ${images.length} images have alt tags (${percentage}%)`,
      recommendation: 'Add alt tags to remaining images for better accessibility and SEO'
    }
  } else {
    return {
      status: 'failed' as const,
      score: percentage,
      description: `Only ${imagesWithAlt.length} of ${images.length} images have alt tags (${percentage}%)`,
      recommendation: 'Add descriptive alt tags to all images describing the content and including relevant keywords'
    }
  }
}

function analyzeMetaDescription(description: string) {
  if (!description || description.trim().length === 0) {
    return {
      status: 'failed' as const,
      score: 0,
      description: 'Missing meta description',
      recommendation: 'Add a meta description between 120-160 characters describing your med spa services'
    }
  }
  
  const length = description.length
  
  if (length >= 120 && length <= 160) {
    return {
      status: 'passed' as const,
      score: 100,
      description: `Meta description length is optimal (${length} characters)`,
      recommendation: undefined
    }
  } else if (length < 120) {
    return {
      status: 'warning' as const,
      score: 70,
      description: `Meta description is too short (${length} characters)`,
      recommendation: 'Expand your meta description to 120-160 characters for better search visibility'
    }
  } else {
    return {
      status: 'warning' as const,
      score: 70,
      description: `Meta description is too long (${length} characters)`,
      recommendation: 'Shorten your meta description to 120-160 characters to avoid truncation in search results'
    }
  }
}

function checkBusinessNameInTitle(title: string, businessName: string) {
  const titleLower = title.toLowerCase()
  const businessLower = businessName.toLowerCase()
  
  // Check for exact match or partial match
  const exactMatch = titleLower.includes(businessLower)
  const businessWords = businessName.split(/\s+/).filter(word => word.length > 2)
  const partialMatch = businessWords.some(word => titleLower.includes(word.toLowerCase()))
  
  if (exactMatch) {
    return {
      matches: true,
      description: 'Page title includes your business name',
      recommendation: undefined
    }
  } else if (partialMatch) {
    return {
      matches: false,
      description: 'Page title partially matches your business name',
      recommendation: 'Include your full business name in the page title for brand consistency'
    }
  } else {
    return {
      matches: false,
      description: 'Page title does not include your business name',
      recommendation: 'Add your business name to the page title to match your Google Business Profile'
    }
  }
}

// Function to extract med spa services from the website
function extractMedSpaServices($: any) {
  console.log('🏥 Starting med spa services extraction...')
  const services: { name: string; description?: string }[] = []
  const pageText = $('body').text().toLowerCase()
  
  // First approach: Look for known service terms throughout the page
  console.log('👉 Approach 1: Looking for known med spa services')
  let knownServicesFound = 0
  
  MED_SPA_SERVICES.forEach(service => {
    // Check if any keywords for this service appear on the page
    const found = service.keywords.some(keyword => pageText.includes(keyword.toLowerCase()))
    
    if (found) {
      knownServicesFound++
      console.log(`   Found service: ${service.name}`)
      // Look for this service in sections/elements to find a description
      let description = ''
      
      // Try to find a paragraph that mentions this service
      $('p').each((i: number, el: any) => {
        const text = $(el).text().toLowerCase()
        if (service.keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
          description = $(el).text().trim()
          return false // Break the loop once found
        }
      })
      
      // Check if we've already added this service
      const existing = services.find(s => 
        s.name.toLowerCase() === service.name.toLowerCase() ||
        s.name.toLowerCase().includes(service.name.toLowerCase())
      )
      
      if (!existing) {
        services.push({
          name: service.name,
          description: description || undefined
        })
      }
    }
  })
  console.log(` Found ${knownServicesFound} known med spa services`)
  
  // Approach 2: Look for service cards or sections with specific classes
  console.log('👉 Approach 2: Looking for service cards or sections with specific classes')
  const serviceElements = $('.service, .treatment, [class*="service"], [class*="treatment"]')
  console.log(`   Found ${serviceElements.length} potential service elements`)
  
  serviceElements.each((i: number, el: any) => {
    const title = $(el).find('h3, h4, .title, .heading, strong').first().text().trim()
    const desc = $(el).find('p, .description').first().text().trim()
    
    
    if (title && title.length > 0) {
      console.log(`Found service from element: "${title}"`)
      services.push({
        name: title,
        description: desc || undefined
      })
    }
  })
  
  // Remove duplicates by name (case insensitive)
  const uniqueServices: { name: string; description?: string }[] = []
  const serviceNames = new Set<string>()
  
  services.forEach(service => {
    const nameLower = service.name.toLowerCase()
    if (!serviceNames.has(nameLower)) {
      serviceNames.add(nameLower)
      uniqueServices.push(service)
    }
  })
  
  console.log(`🏆 Total services extracted: ${services.length}, unique services: ${uniqueServices.length}`)
  return uniqueServices
} 