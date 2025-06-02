import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

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
  screenshot?: string // base64 encoded image
  error?: string
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  console.log('🌐 Website Parse API called at:', new Date().toISOString())
  
  try {
    const body = await request.json()
    const { url } = body

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
        structure,
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
      structure: {
        hasNavigation: false,
        hasFooter: false,
        hasContactForm: false,
        hasBookingForm: false
      },
      error: `Parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    } as WebsiteParseResult)
  }
} 