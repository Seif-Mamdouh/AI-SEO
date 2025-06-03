import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getRandomTemplate, generateTemplatePrompt, type MedSpaTemplate } from '@/lib/templates'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  console.log('🚀 Website generation request started at:', new Date().toISOString())
  
  try {
    const { prompt, medSpaData } = await request.json()
    
    console.log('📝 Received prompt length:', prompt?.length || 0)
    console.log('🏥 Med spa data received:', !!medSpaData)
    
    // Select template and generate contextual prompt if med spa data is available
    let selectedTemplate: MedSpaTemplate | null = null
    let enhancedPrompt = prompt
    
    if (medSpaData) {
      selectedTemplate = getRandomTemplate()
      enhancedPrompt = generateTemplatePrompt(selectedTemplate, medSpaData)
      
      console.log('🎨 Template selected:', {
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        templateCategory: selectedTemplate.category,
        colorScheme: selectedTemplate.colorScheme
      })
      
      console.log('🎯 Med spa context detailed analysis:', {
        name: medSpaData.name,
        hasImages: !!medSpaData.photos?.length,
        imageCount: medSpaData.photos?.length || 0,
        hasWebsiteData: !!medSpaData.website_data,
        hasPerformanceData: !!medSpaData.pagespeed_data,
        allKeys: Object.keys(medSpaData),
        photosData: medSpaData.photos,
        websiteData: medSpaData.website_data,
        pagespeedData: medSpaData.pagespeed_data,
        selectedTemplate: selectedTemplate.name,
        businessDetails: {
          formattedAddress: medSpaData.formatted_address,
          phone: medSpaData.phone || medSpaData.formatted_phone_number,
          rating: medSpaData.rating,
          reviewCount: medSpaData.user_ratings_total,
          placeId: medSpaData.place_id
        }
      })
    }

    if (!enhancedPrompt) {
      console.error('❌ No prompt provided')
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OpenAI API key not configured')
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    console.log('🤖 Starting OpenAI generation with template integration...')
    
    // Generate website using OpenAI with enhanced context and template
    const websiteResult = await generateWebsiteWithOpenAI(enhancedPrompt, medSpaData, selectedTemplate)
    
    const duration = Date.now() - startTime
    console.log('✅ Website generation completed in:', duration + 'ms')
    console.log('📊 Generated code sizes:', {
      html: websiteResult.html?.length || 0,
      css: websiteResult.css?.length || 0,
      js: websiteResult.js?.length || 0,
      template: selectedTemplate?.name || 'none'
    })

    // Include template information in response
    const finalResult = {
      ...websiteResult,
      template: selectedTemplate ? {
        id: selectedTemplate.id,
        name: selectedTemplate.name,
        category: selectedTemplate.category,
        colorScheme: selectedTemplate.colorScheme
      } : null
    }

    return NextResponse.json(finalResult)
  } catch (error) {
    const duration = Date.now() - startTime
    console.error('💥 Website generation error after', duration + 'ms:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate website' },
      { status: 500 }
    )
  }
}

async function generateWebsiteWithOpenAI(prompt: string, medSpaData?: any, selectedTemplate?: MedSpaTemplate | null) {
  try {
    console.log('🎨 Using EXACT template code with direct variable replacement')
    
    // If we have a selected template, use its EXACT HTML code
    if (selectedTemplate && selectedTemplate.html) {
      console.log('✅ Using 100% exact template:', selectedTemplate.name)
      
      // Generate Google Places photo URLs for real business images
      const businessPhotos = medSpaData?.photos || []
      const photoUrls = businessPhotos.map((photo: any, index: number) => {
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
      })
      
      console.log('📸 Generated photo URLs:', {
        photoCount: photoUrls.length,
        sampleUrls: photoUrls.slice(0, 3),
        allPhotoReferences: businessPhotos.map((p: any) => p.photo_reference)
      })
      
      // Get EXACT template HTML and CSS - preserve ALL original code
      let templateHtml = selectedTemplate.html
      let templateCss = selectedTemplate.css || ''
      
      // Extract additional business insights
      const websiteData = medSpaData?.website_data || {}
      const performanceData = medSpaData?.pagespeed_data || {}
      const seoData = medSpaData?.seo_data || {}
      
      // Extract services from SEO data if available
      let scrapedServices: any[] = []
      if (seoData?.services && Array.isArray(seoData.services)) {
        scrapedServices = seoData.services
        console.log('✅ Found scraped services:', scrapedServices)
      } else if (websiteData?.pageContent?.services) {
        scrapedServices = websiteData.pageContent.services
        console.log('✅ Found services in website content:', scrapedServices)
      }
      
      // Default services if none found
      if (!scrapedServices || scrapedServices.length === 0) {
        scrapedServices = [
          { name: 'Botox & Fillers', price: 'From $299', description: 'Premium anti-aging treatments' },
          { name: 'Laser Treatments', price: 'From $199', description: 'Advanced laser therapy' },
          { name: 'HydraFacial', price: 'From $149', description: 'Deep cleansing facial treatment' },
          { name: 'Body Contouring', price: 'From $399', description: 'Non-invasive fat reduction' }
        ]
        console.log('ℹ️ Using default services (no services found in scraped data)')
      }
      
      // Generate service HTML based on scraped services for template insertion
      const servicesHtml = generateServicesHtml(scrapedServices, selectedTemplate.id)
      
      // Enhanced template variables with real client data
      const templateVariables = {
        '[BUSINESS_NAME]': medSpaData?.name || 'Premium Medical Spa',
        '[PHONE_NUMBER]': medSpaData?.phone || medSpaData?.formatted_phone_number || '(555) 123-4567',
        '[RATING]': (medSpaData?.rating || 4.8).toString(),
        '[REVIEW_COUNT]': (medSpaData?.user_ratings_total || 100).toString(),
        '[FULL_ADDRESS]': medSpaData?.formatted_address || 'Professional Location',
        '[CITY]': (medSpaData?.formatted_address || 'Your City').split(',')[1]?.trim() || 'Your City',
        '[EMAIL]': websiteData?.contactInfo?.email || `info@${(medSpaData?.name || 'business').toLowerCase().replace(/\s+/g, '')}.com`,
        
        // Real business photos integration
        '[HERO_IMAGE]': photoUrls[0] || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f',
        '[GALLERY_IMAGE_1]': photoUrls[1] || photoUrls[0] || '',
        '[GALLERY_IMAGE_2]': photoUrls[2] || photoUrls[1] || '',
        '[GALLERY_IMAGE_3]': photoUrls[3] || photoUrls[2] || '',
        '[FACILITY_IMAGE]': photoUrls[0] || '',
        '[TREATMENT_IMAGE]': photoUrls[1] || photoUrls[0] || '',
        
        // Website data integration
        '[CURRENT_WEBSITE_TITLE]': websiteData?.title || `${medSpaData?.name} - Medical Spa`,
        '[CURRENT_DESCRIPTION]': websiteData?.description || 'Premium Medical Spa Services',
        '[BUSINESS_HOURS]': websiteData?.contactInfo?.hours || 'Mon-Fri: 9AM-6PM, Sat: 9AM-4PM',
        
        // Performance improvement messaging
        '[SEO_IMPROVEMENT]': performanceData?.seo_score ? 
          `Improved from ${performanceData.seo_score}/100 to 95+ SEO score` : 
          'SEO optimized for maximum visibility',
        '[PERFORMANCE_IMPROVEMENT]': performanceData?.performance_score ? 
          `Faster loading than your current ${performanceData.performance_score}/100 score` : 
          'Lightning-fast performance',
          
        // Location-specific content
        '[STATE]': (medSpaData?.formatted_address || '').split(',').slice(-2, -1)[0]?.trim() || 'Your State',
        '[ZIP_CODE]': (medSpaData?.formatted_address || '').match(/\d{5}(-\d{4})?/)?.[0] || '',
        
        // Google Places insights
        '[PLACE_ID]': medSpaData?.place_id || '',
        '[GOOGLE_MAPS_URL]': medSpaData?.place_id ? 
          `https://www.google.com/maps/place/?q=place_id:${medSpaData.place_id}` : 
          '#',
          
        // Services integration
        '[SERVICES_PLACEHOLDER]': servicesHtml,
      }

      console.log('🔄 Replacing template variables with actual business data:', {
        businessName: templateVariables['[BUSINESS_NAME]'],
        phoneNumber: templateVariables['[PHONE_NUMBER]'],
        address: templateVariables['[FULL_ADDRESS]'],
        rating: templateVariables['[RATING]'],
        photoCount: photoUrls.length,
        servicesCount: scrapedServices.length
      })

      // Replace all template variables in HTML and CSS - PRESERVE ALL OTHER CODE
      Object.entries(templateVariables).forEach(([variable, value]) => {
        const regex = new RegExp(variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
        templateHtml = templateHtml.replace(regex, value)
        templateCss = templateCss.replace(regex, value)
      })

      console.log('✅ Template integration complete - returning 100% unmodified template structure with data substitution:', {
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        templateCategory: selectedTemplate.category,
        htmlLength: templateHtml.length,
        cssLength: templateCss.length,
        photosIntegrated: photoUrls.length,
        businessDataIntegrated: true,
        servicesIntegrated: scrapedServices.length
      })

      // Return the EXACT template code with only business data inserted via variable replacement
      return {
        html: templateHtml,
        css: templateCss,
        js: '',
        template: {
          id: selectedTemplate.id,
          name: selectedTemplate.name,
          used: true
        }
      }
    }

    // Fallback: If no template, use AI generation (but this shouldn't happen with med spa data)
    console.log('⚠️ No template available, falling back to AI generation...')
    
    // Extract images from med spa data and create proper Google Places URLs
    const medSpaImages = medSpaData?.photos || []
    console.log('🖼️ Available images:', medSpaImages.length)
    
    // Create proper Google Places photo URLs
    const imageUrls = medSpaImages.map((photo: any, index: number) => {
      // Use a working Google Places photo URL (you might need to replace with your API key)
      const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY || 'DEMO_KEY'}`
      return {
        url: photoUrl,
        reference: photo.photo_reference,
        index: index + 1
      }
    })
    
    // Create enhanced image context for AI
    let imageContext = ''
    if (imageUrls.length > 0) {
      imageContext = `\n\nREAL BUSINESS IMAGES TO USE IN THE WEBSITE:
${imageUrls.map((img: { url: string; reference: string; index: number }) => 
  `Image ${img.index}: ${img.url}
   - This is a real photo of ${medSpaData?.name || 'the business'}
   - Use this exact URL in img src attributes
   - Perfect for: hero section, gallery, about section, or service showcases`
).join('\n\n')}

CRITICAL IMAGE REQUIREMENTS:
- You MUST use these real business photos instead of placeholder images
- Use the exact URLs provided above in your img tags
- These photos show the actual business, treatments, and facilities
- Integrate them naturally throughout the website (hero, gallery, services, about)
- Add proper alt text describing what's shown in each business photo
- Make images responsive with proper CSS classes

Example usage:
<img src="${imageUrls[0]?.url}" alt="${medSpaData?.name || 'Medical Spa'} - Professional Treatment Room" className="w-full h-64 object-cover rounded-lg" />
`
    }

    const systemPrompt = `You are a React developer creating a professional medical spa landing page.

CRITICAL: You MUST respond EXACTLY in this format:

REACT_COMPONENT:
[Complete React component code here]

STYLES:
[Any additional CSS styles if needed]

TYPES:
[TypeScript interfaces if needed]

DO NOT include any other text, explanations, or markdown. Just provide the code in the exact format above.

BUSINESS INFORMATION:
- Business Name: ${medSpaData?.name || 'Premium Medical Spa'} (use this exact name)
- Address: ${medSpaData?.formatted_address || 'Professional Location'}
- Phone: ${medSpaData?.phone || medSpaData?.formatted_phone_number || '(555) 123-4567'}
- Rating: ${medSpaData?.rating || 4.8} stars (${medSpaData?.user_ratings_total || 'many'} reviews)

TECHNICAL REQUIREMENTS:
- Create a complete Next.js 13+ React component with TypeScript
- Use SHADCN/UI components (Button, Card, Badge, Input, Textarea, Dialog, etc.)
- Use Tailwind CSS for all styling
- Make it fully responsive (mobile, tablet, desktop)
- Include these sections: Hero, Services, About, Gallery, Testimonials, Contact
- Add smooth animations and professional design
- Use the business information provided above throughout

${imageContext}

CONTENT REQUIREMENTS:
- Write as if you're the official ${medSpaData?.name || 'Medical Spa'} website
- Include realistic medical spa services (Botox, fillers, laser treatments, facials, etc.)
- Add professional pricing and service descriptions
- Include booking/consultation CTAs
- Reference the Google rating and location throughout
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: 4000,
      temperature: 0.7
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    console.log('🤖 OpenAI response received, length:', response.length)

    // Parse the structured response
    const reactMatch = response.match(/REACT_COMPONENT:\s*([\s\S]*?)(?=\n\n(?:STYLES|TYPES)|$)/i)
    const stylesMatch = response.match(/STYLES:\s*([\s\S]*?)(?=\n\n(?:TYPES|REACT_COMPONENT)|$)/i)
    const typesMatch = response.match(/TYPES:\s*([\s\S]*?)(?=\n\n(?:STYLES|REACT_COMPONENT)|$)/i)

    const htmlCode = reactMatch ? cleanCodeResponse(reactMatch[1]) : ''
    const cssCode = stylesMatch ? cleanCodeResponse(stylesMatch[1]) : ''
    const jsCode = typesMatch ? cleanCodeResponse(typesMatch[1]) : ''

    if (!htmlCode) {
      console.warn('⚠️ No HTML code found in response, using fallback')
      return generateTemplateBasedFallback(medSpaData, selectedTemplate)
    }

    console.log('✅ Successfully parsed OpenAI response')
    return {
      html: htmlCode,
      css: cssCode,
      js: jsCode
    }

  } catch (error) {
    console.error('💥 Error in generateWebsiteWithOpenAI:', error)
    console.log('🔄 Falling back to template-based generation')
    return generateTemplateBasedFallback(medSpaData, selectedTemplate)
  }
}

function cleanCodeResponse(code: string): string {
  // Remove markdown code blocks if present
  return code
    .replace(/^```[\w]*\n/g, '')
    .replace(/\n```$/g, '')
    .replace(/^```/g, '')
    .replace(/```$/g, '')
    .trim()
}

function generateTemplateBasedFallback(medSpaData?: any, selectedTemplate?: MedSpaTemplate | null) {
  const businessName = medSpaData?.name || 'Premium Medical Spa'
  const address = medSpaData?.formatted_address || 'Your Location'
  const phone = medSpaData?.phone || '(555) 123-4567'
  const rating = medSpaData?.rating || 4.8

  // If we have a template with HTML, use it EXACTLY - same as primary function
  if (selectedTemplate && selectedTemplate.html) {
    console.log('🎨 Using exact template HTML in fallback with direct variable replacements')
    
    // Just do direct string replacement of variables - no modifications to the template
    let templateHtml = selectedTemplate.html
    let templateCss = selectedTemplate.css || ''
    
    const templateVariables = {
      '[BUSINESS_NAME]': businessName,
      '[PHONE_NUMBER]': phone,
      '[RATING]': rating.toString(),
      '[REVIEW_COUNT]': (medSpaData?.user_ratings_total || 100).toString(),
      '[FULL_ADDRESS]': address,
      '[CITY]': address.split(',')[1]?.trim() || 'Your City',
      '[EMAIL]': `info@${businessName.toLowerCase().replace(/\s+/g, '')}.com`,
      '[HERO_IMAGE]': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f',
      '[GALLERY_IMAGE_1]': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d',
      '[GALLERY_IMAGE_2]': 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53',
      '[GALLERY_IMAGE_3]': 'https://images.unsplash.com/photo-1556760544-74068565f05c',
      '[STATE]': address.split(',').slice(-2, -1)[0]?.trim() || 'Your State',
      '[ZIP_CODE]': address.match(/\d{5}(-\d{4})?/)?.[0] || '',
    }

    // Replace all template variables
    Object.entries(templateVariables).forEach(([variable, value]) => {
      const regex = new RegExp(variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
      templateHtml = templateHtml.replace(regex, value)
      templateCss = templateCss.replace(regex, value)
    })

    // Return the exact template code
    return {
      html: templateHtml,
      css: templateCss,
      js: '',
      template: {
        id: selectedTemplate.id,
        name: selectedTemplate.name,
        used: true
      }
    }
  }

  // If no template available, generate basic fallback (shouldn't happen with med spa data)
  console.log('⚠️ No template available, generating basic fallback')
  
  const basicHtml = `"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, MapPin, Star, Calendar } from "lucide-react"

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">${businessName}</h1>
          <Button className="bg-blue-600 text-white">
            <Calendar className="w-4 h-4 mr-2" />
            Book Consultation
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to ${businessName}
            </h2>
            <p className="text-xl text-gray-600 mb-6">Premium Medical Spa Services</p>
            <div className="flex justify-center items-center mb-8">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-2 text-gray-600">${rating} stars on Google</span>
            </div>
            <Button className="bg-blue-600 text-white px-8 py-3">
              Book Your Treatment
            </Button>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">Our Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-2">Botox & Fillers</h4>
                  <p className="text-gray-600 mb-4">Professional anti-aging treatments</p>
                  <div className="text-blue-600 font-medium">From $299</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-2">Laser Treatments</h4>
                  <p className="text-gray-600 mb-4">Advanced laser therapy</p>
                  <div className="text-blue-600 font-medium">From $199</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-2">HydraFacial</h4>
                  <p className="text-gray-600 mb-4">Deep cleansing facial treatment</p>
                  <div className="text-blue-600 font-medium">From $149</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold mb-8">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-600 mr-2" />
                <span>${phone}</span>
              </div>
              <div className="flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                <span>${address}</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}`

  return {
    html: basicHtml,
    css: '',
    js: '',
    template: {
      id: 'fallback',
      name: 'Basic Fallback',
      used: true
    }
  }
}

/**
 * Generate HTML for services based on template type
 */
function generateServicesHtml(services: any[], templateId: string): string {
  // Format services based on template type
  switch (templateId) {
    case 'luxury':
      return services.map((service: any, index: number) => `
        <motion.div
          key="${service.name || `Service ${index + 1}`}"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: ${index * 0.1} }}
          className="relative"
        >
          <Card className="h-full bg-white border-gray-200 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
            ${index === 0 ? `<div className="absolute top-4 right-4 z-10">
              <Badge className="bg-purple-500 text-white">Most Popular</Badge>
            </div>` : ''}
            <CardContent className="p-6">
              <div className="text-4xl mb-4">${getServiceIcon(service.name)}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">${service.name}</h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">${service.description || 'Premium treatment with exceptional results'}</p>
              <div className="space-y-2 mb-6">
                ${getServiceFeatures(service.name).map((feature: string) => `
                  <div className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" />
                    ${feature}
                  </div>
                `).join('')}
              </div>
              <div className="mt-auto">
                <p className="text-lg font-bold text-purple-600 mb-4">${service.price || 'Starting at $199'}</p>
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white group-hover:bg-purple-500 group-hover:text-white transition-all">
                  Learn More
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      `).join('')
      
    case 'modern':
      return services.map((service: any, index: number) => `
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-2xl mb-4 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white">
              ${getServiceIcon(service.name)}
            </div>
            <h4 className="text-xl font-bold mb-3 text-rose-600">${service.name}</h4>
            <p className="text-gray-600 mb-4">${service.description || 'Professional treatment with premium results'}</p>
            <div className="text-lg font-semibold text-pink-600">${service.price || 'From $199'}</div>
          </div>
          <button class="w-full py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white">
            Learn More
          </button>
        </div>
      `).join('')
      
    case 'elegant':
    default:
      return services.map((service: any, index: number) => `
        <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 mb-4">
            ${getServiceIcon(service.name)}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">${service.name}</h3>
          <p className="text-gray-600 mb-4">${service.description || 'Professional treatment with premium results'}</p>
          <div className="flex items-center justify-between">
            <span className="text-pink-600 font-semibold">${service.price || 'From $199'}</span>
            <button className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-700 transition-colors">
              Book Now
            </button>
          </div>
        </div>
      `).join('')
  }
}

/**
 * Get appropriate icon for a service
 */
function getServiceIcon(serviceName: string): string {
  const serviceLower = serviceName.toLowerCase()
  
  if (serviceLower.includes('botox') || serviceLower.includes('filler') || serviceLower.includes('inject')) {
    return '💉'
  } else if (serviceLower.includes('laser') || serviceLower.includes('hair') || serviceLower.includes('removal')) {
    return '✨'
  } else if (serviceLower.includes('facial') || serviceLower.includes('hydra') || serviceLower.includes('face')) {
    return '💧'
  } else if (serviceLower.includes('body') || serviceLower.includes('contour') || serviceLower.includes('sculpt')) {
    return '🔄'
  } else if (serviceLower.includes('skin') || serviceLower.includes('peel') || serviceLower.includes('dermabrasion')) {
    return '✨'
  } else if (serviceLower.includes('massage') || serviceLower.includes('therapy')) {
    return '👐'
  } else {
    return '🌟'
  }
}

/**
 * Get features for a service
 */
function getServiceFeatures(serviceName: string): string[] {
  const serviceLower = serviceName.toLowerCase()
  
  if (serviceLower.includes('botox') || serviceLower.includes('filler') || serviceLower.includes('inject')) {
    return ['Wrinkle Reduction', 'FDA-approved', 'Natural Results', 'Quick Procedure']
  } else if (serviceLower.includes('laser') || serviceLower.includes('hair') || serviceLower.includes('removal')) {
    return ['Advanced Technology', 'All Skin Types', 'Permanent Results', 'Minimal Discomfort']
  } else if (serviceLower.includes('facial') || serviceLower.includes('hydra') || serviceLower.includes('face')) {
    return ['Deep Cleansing', 'Hydration', 'Anti-aging', 'Customized Treatment']
  } else if (serviceLower.includes('body') || serviceLower.includes('contour') || serviceLower.includes('sculpt')) {
    return ['Non-invasive', 'Fat Reduction', 'Muscle Toning', 'No Downtime']
  } else if (serviceLower.includes('skin') || serviceLower.includes('peel') || serviceLower.includes('dermabrasion')) {
    return ['Skin Renewal', 'Exfoliation', 'Even Tone', 'Reduce Fine Lines']
  } else {
    return ['Premium Service', 'Expert Specialists', 'Proven Results', 'Luxury Experience']
  }
}