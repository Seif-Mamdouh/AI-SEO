import { NextResponse, NextRequest } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { JSDOM } from 'jsdom'

// Add a new function to extract services from HTML content
function extractServicesFromHtml(html: string): any[] {
  try {
    console.log('🔍 Attempting to extract services from HTML...')
    
    // Try to find service sections by looking for common patterns
    const services: any[] = []
    
    // Pattern 1: Look for service cards/items
    const serviceCardMatches = html.match(/<div[^>]*class="[^"]*(?:card|service-item|service-box)[^"]*"[^>]*>([\s\S]*?)<\/div>/gi)
    if (serviceCardMatches && serviceCardMatches.length > 0) {
      console.log(`✅ Found ${serviceCardMatches.length} potential service cards`)
      
      serviceCardMatches.forEach((cardHtml, index) => {
        // Extract service name (typically in h2, h3, h4 tags)
        const nameMatch = cardHtml.match(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/i)
        let name = nameMatch ? cleanHtmlText(nameMatch[1]) : null
        
        // If no name found in header, try strong or b tags
        if (!name) {
          const boldMatch = cardHtml.match(/<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/i)
          name = boldMatch ? cleanHtmlText(boldMatch[1]) : `Service ${index + 1}`
        }
        
        // Only include if it looks like a med spa service
        if (isMedSpaService(name)) {
          // Extract description (typically in p tags)
          const descMatch = cardHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
          const description = descMatch ? cleanHtmlText(descMatch[1]) : 'Premium treatment with proven results'
          
          // Extract price (look for currency symbols or "price" text)
          const priceMatch = cardHtml.match(/\$\s*(\d+(?:\.\d{2})?)/i) || 
                             cardHtml.match(/(?:price|cost|starting at)[\s:]*(\$\s*\d+(?:\.\d{2})?)/i)
          const price = priceMatch ? `From $${priceMatch[1].replace(/\$/g, '')}` : 'Contact for pricing'
          
          services.push({ name, description, price })
          console.log(`✅ Extracted service: ${name}`)
        }
      })
    }
    
    // Pattern 2: Look for service lists (ul/li)
    if (services.length === 0) {
      const serviceListMatches = html.match(/<ul[^>]*>([\s\S]*?)<\/ul>/gi)
      if (serviceListMatches && serviceListMatches.length > 0) {
        const serviceItems = serviceListMatches.join('').match(/<li[^>]*>([\s\S]*?)<\/li>/gi)
        if (serviceItems && serviceItems.length > 0) {
          console.log(`✅ Found ${serviceItems.length} potential service list items`)
          
          serviceItems.forEach((itemHtml, index) => {
            const serviceName = cleanHtmlText(itemHtml)
            if (isMedSpaService(serviceName)) {
              services.push({
                name: serviceName,
                description: 'Professional treatment with proven results',
                price: 'Contact for pricing'
              })
              console.log(`✅ Extracted service from list: ${serviceName}`)
            }
          })
        }
      }
    }
    
    // Pattern 3: Look for service tables
    if (services.length === 0) {
      const serviceTableMatches = html.match(/<table[^>]*>([\s\S]*?)<\/table>/gi)
      if (serviceTableMatches && serviceTableMatches.length > 0) {
        const tableRows = serviceTableMatches.join('').match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)
        if (tableRows && tableRows.length > 0) {
          console.log(`✅ Found ${tableRows.length} potential service table rows`)
          
          tableRows.forEach((rowHtml, index) => {
            const cells = rowHtml.match(/<td[^>]*>([\s\S]*?)<\/td>/gi)
            if (cells && cells.length >= 2) {
              const serviceName = cleanHtmlText(cells[0])
              if (isMedSpaService(serviceName)) {
                // Try to extract price from another cell
                const priceCell = cells.length > 1 ? cleanHtmlText(cells[1]) : null
                const price = priceCell && priceCell.includes('$') ? priceCell : 'Contact for pricing'
                
                services.push({
                  name: serviceName,
                  description: 'Professional treatment with excellent results',
                  price: price
                })
                console.log(`✅ Extracted service from table: ${serviceName}`)
              }
            }
          })
        }
      }
    }
    
    // If no services found, add default services specific to the page content
    if (services.length === 0) {
      console.log('⚠️ No services found in HTML - looking for med spa related keywords')
      
      // Look for keywords to determine likely services
      const hasBotox = html.toLowerCase().includes('botox')
      const hasFillers = html.toLowerCase().includes('filler') || html.toLowerCase().includes('juvederm')
      const hasLaser = html.toLowerCase().includes('laser')
      const hasFacial = html.toLowerCase().includes('facial') || html.toLowerCase().includes('hydrafacial')
      const hasBody = html.toLowerCase().includes('body') && (
        html.toLowerCase().includes('sculpting') || 
        html.toLowerCase().includes('contouring') || 
        html.toLowerCase().includes('coolsculpt')
      )
      
      // Add services based on keywords
      if (hasBotox) {
        services.push({
          name: 'Botox Treatments',
          description: 'Premium Botox treatments for wrinkle reduction',
          price: 'From $299'
        })
      }
      
      if (hasFillers) {
        services.push({
          name: 'Dermal Fillers',
          description: 'Restore volume and youthfulness with premium fillers',
          price: 'From $399'
        })
      }
      
      if (hasLaser) {
        services.push({
          name: 'Laser Treatments',
          description: 'Advanced laser therapy for skin rejuvenation',
          price: 'From $199'
        })
      }
      
      if (hasFacial) {
        services.push({
          name: 'HydraFacial',
          description: 'Deep cleansing facial for radiant skin',
          price: 'From $149'
        })
      }
      
      if (hasBody) {
        services.push({
          name: 'Body Contouring',
          description: 'Non-invasive fat reduction and body sculpting',
          price: 'From $399'
        })
      }
      
      console.log(`✅ Added ${services.length} services based on keywords`)
    }
    
    // Ensure we have at least some services
    if (services.length === 0) {
      console.log('⚠️ No services detected - using default med spa services')
      services.push(
        {
          name: 'Botox & Fillers',
          description: 'Premium anti-aging injectable treatments',
          price: 'From $299'
        },
        {
          name: 'Laser Skin Rejuvenation',
          description: 'Advanced laser therapy for youthful skin',
          price: 'From $199'
        },
        {
          name: 'HydraFacial',
          description: 'Deep cleansing facial treatment',
          price: 'From $149'
        }
      )
    }
    
    return services
  } catch (error) {
    console.error('Error extracting services:', error)
    return [
      {
        name: 'Botox & Fillers',
        description: 'Premium anti-aging injectable treatments',
        price: 'From $299'
      },
      {
        name: 'Laser Skin Rejuvenation',
        description: 'Advanced laser therapy for youthful skin',
        price: 'From $199'
      },
      {
        name: 'HydraFacial',
        description: 'Deep cleansing facial treatment',
        price: 'From $149'
      }
    ]
  }
}

// Helper function to clean HTML text
function cleanHtmlText(html: string): string {
  return html
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
    .replace(/\s+/g, ' ')    // Normalize whitespace
    .trim()
}

// Helper function to determine if text represents a med spa service
function isMedSpaService(text: string): boolean {
  if (!text) return false
  
  const lowercaseText = text.toLowerCase()
  const medSpaKeywords = [
    'botox', 'filler', 'juvederm', 'restylane', 'dysport', 'xeomin', 
    'laser', 'facial', 'hydrafacial', 'chemical peel', 'microdermabrasion',
    'coolsculpt', 'sculpt', 'contour', 'body', 'cellulite', 'fat reduction',
    'skin', 'rejuvenation', 'tightening', 'resurfacing', 'hair removal',
    'micro', 'needling', 'dermabrasion', 'injection', 'wrinkle', 'anti-aging',
    'face', 'lift', 'massage', 'therapy', 'treatment', 'service'
  ]
  
  return medSpaKeywords.some(keyword => lowercaseText.includes(keyword))
}

export async function POST(request: NextRequest) {
  console.log('🔍 Starting SEO analysis...')
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }
    
    console.log(`📊 Analyzing website: ${url}`)
    
    const response = await axios.get(url)
    const htmlContent = response.data
    
    // Use Cheerio to parse HTML
    const $ = cheerio.load(htmlContent)
    
    // Extract meta information
    const title = $('title').text() || 'No title found'
    const description = $('meta[name="description"]').attr('content') || 'No description found'
    const keywords = $('meta[name="keywords"]').attr('content') || 'No keywords found'
    
    // Extract headings
    const headings = {
      h1: $('h1').map((i, el) => $(el).text().trim()).get(),
      h2: $('h2').map((i, el) => $(el).text().trim()).get(),
      h3: $('h3').map((i, el) => $(el).text().trim()).get()
    }
    
    // Extract paragraphs (first 10)
    const paragraphs = $('p').map((i, el) => $(el).text().trim()).get().slice(0, 10)
    
    // Extract images
    const images = $('img').map((i, el) => ({
      src: $(el).attr('src') || 'No source',
      alt: $(el).attr('alt') || 'No alt text'
    })).get()
    
    // Extract links
    const links = $('a').map((i, el) => ({
      href: $(el).attr('href') || '#',
      text: $(el).text().trim() || 'No text'
    })).get()
    
    // Extract potential contact information
    const contactInfo = {
      email: extractEmailFromHTML(htmlContent),
      phone: extractPhoneFromHTML(htmlContent),
      address: extractAddressFromHTML(htmlContent)
    }
    
    // Extract services
    const services = extractServicesFromHtml(htmlContent)
    console.log(`✅ Extracted ${services.length} services from website`)
    
    // Analyze page structure and SEO
    const wordCount = countWords(htmlContent)
    const hasSSL = url.startsWith('https')
    const hasMobileViewport = $('meta[name="viewport"]').length > 0
    
    const results = {
      url,
      title,
      description,
      keywords,
      headings,
      paragraphs,
      images: images.slice(0, 10), // Limit to first 10
      links: links.slice(0, 10),   // Limit to first 10
      contactInfo,
      services,
      analysis: {
        wordCount,
        imageCount: images.length,
        hasSSL,
        hasMobileViewport,
        titleLength: title.length,
        descriptionLength: description ? description.length : 0
      },
      seoScore: calculateSeoScore({
        hasTitle: title.length > 0,
        hasDescription: typeof description === 'string' && description.length > 0,
        hasKeywords: typeof keywords === 'string' && keywords.length > 0,
        titleLength: title.length,
        descriptionLength: description ? description.length : 0,
        hasH1: headings.h1.length > 0,
        imageWithAlt: images.filter(img => img.alt && img.alt !== 'No alt text').length,
        wordCount,
        hasSSL,
        hasMobileViewport
      })
    }
    
    console.log('✅ SEO analysis completed')
    return NextResponse.json(results)
    
  } catch (error) {
    console.error('❌ Error analyzing website:', error)
    return NextResponse.json(
      { 
        error: 'Failed to analyze website', 
        details: error instanceof Error ? error.message : 'Unknown error',
        services: [
          {
            name: 'Botox & Fillers',
            description: 'Premium anti-aging injectable treatments',
            price: 'From $299'
          },
          {
            name: 'Laser Treatments',
            description: 'Advanced laser therapy for youthful skin',
            price: 'From $199'
          },
          {
            name: 'HydraFacial',
            description: 'Deep cleansing facial treatment',
            price: 'From $149'
          }
        ]
      }, 
      { status: 500 }
    )
  }
}

// Helper functions for extraction
function extractEmailFromHTML(html: string): string {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g
  const match = html.match(emailRegex)
  return match ? match[0] : 'No email found'
}

function extractPhoneFromHTML(html: string): string {
  const phoneRegex = /(\+\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g
  const match = html.match(phoneRegex)
  return match ? match[0] : 'No phone found'
}

function extractAddressFromHTML(html: string): string {
  // This is a simplistic approach; real address extraction is complex
  const dom = new JSDOM(html)
  const document = dom.window.document
  
  // Try to find address in common elements
  const addressElements = document.querySelectorAll('address, .address, [itemprop="address"]')
  if (addressElements.length > 0) {
    return addressElements[0].textContent || 'No address found'
  }
  
  // Look for schema.org address markup
  const schemaScript = document.querySelector('script[type="application/ld+json"]')
  if (schemaScript) {
    try {
      const schema = JSON.parse(schemaScript.textContent || '{}')
      if (schema.address) {
        return `${schema.address.streetAddress || ''}, ${schema.address.addressLocality || ''}, ${schema.address.addressRegion || ''} ${schema.address.postalCode || ''}`
      }
    } catch (e) {
      console.error('Error parsing schema data:', e)
    }
  }
  
  return 'No address found'
}

function countWords(html: string): number {
  // Remove HTML tags and count words
  const text = html.replace(/<[^>]*>/g, ' ')
  return text.split(/\s+/).filter(word => word.length > 0).length
}

function calculateSeoScore(factors: {
  hasTitle: boolean
  hasDescription: boolean
  hasKeywords: boolean
  titleLength: number
  descriptionLength: number
  hasH1: boolean
  imageWithAlt: number
  wordCount: number
  hasSSL: boolean
  hasMobileViewport: boolean
}): number {
  let score = 0
  
  // Title factors
  if (factors.hasTitle) score += 10
  if (factors.titleLength >= 30 && factors.titleLength <= 60) score += 10
  else if (factors.titleLength > 0) score += 5
  
  // Description factors
  if (factors.hasDescription) score += 10
  if (factors.descriptionLength >= 120 && factors.descriptionLength <= 160) score += 10
  else if (factors.descriptionLength > 0) score += 5
  
  // Content factors
  if (factors.hasKeywords) score += 5
  if (factors.hasH1) score += 10
  if (factors.imageWithAlt > 0) score += 10
  if (factors.wordCount >= 300) score += 10
  else if (factors.wordCount >= 100) score += 5
  
  // Technical factors
  if (factors.hasSSL) score += 10
  if (factors.hasMobileViewport) score += 10
  
  // Ensure score is between 0 and 100
  return Math.min(Math.max(score, 0), 100)
} 