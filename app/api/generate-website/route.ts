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
        selectedTemplate: selectedTemplate.name
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
    console.log('🎨 Using exact template format instead of AI generation...')
    
    // If we have a selected template, use its EXACT HTML code
    if (selectedTemplate && selectedTemplate.html) {
      console.log('✅ Using exact template HTML:', selectedTemplate.name)
      
      // Replace template variables with actual business data
      let templateHtml = selectedTemplate.html
      let templateCss = selectedTemplate.css || ''
      
      const templateVariables = {
        '[BUSINESS_NAME]': medSpaData?.name || 'Premium Medical Spa',
        '[PHONE_NUMBER]': medSpaData?.phone || medSpaData?.formatted_phone_number || '(555) 123-4567',
        '[RATING]': (medSpaData?.rating || 4.8).toString(),
        '[REVIEW_COUNT]': (medSpaData?.user_ratings_total || 100).toString(),
        '[FULL_ADDRESS]': medSpaData?.formatted_address || 'Professional Location',
        '[CITY]': (medSpaData?.formatted_address || 'Your City').split(',')[1]?.trim() || 'Your City',
        '[EMAIL]': `info@${(medSpaData?.name || 'business').toLowerCase().replace(/\s+/g, '')}.com`
      }

      // Replace all template variables in HTML
      Object.entries(templateVariables).forEach(([variable, value]) => {
        const regex = new RegExp(variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
        templateHtml = templateHtml.replace(regex, value)
        templateCss = templateCss.replace(regex, value)
      })

      // Return the exact template code with business data inserted
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

  // If we have a template with HTML, use it EXACTLY
  if (selectedTemplate && selectedTemplate.html) {
    console.log('🎨 Using exact template HTML in fallback:', selectedTemplate.name)
    
    // Replace template variables with actual business data
    let templateHtml = selectedTemplate.html
    let templateCss = selectedTemplate.css || ''
    
    const templateVariables = {
      '[BUSINESS_NAME]': businessName,
      '[PHONE_NUMBER]': phone,
      '[RATING]': rating.toString(),
      '[REVIEW_COUNT]': (medSpaData?.user_ratings_total || 100).toString(),
      '[FULL_ADDRESS]': address,
      '[CITY]': address.split(',')[1]?.trim() || 'Your City',
      '[EMAIL]': `info@${businessName.toLowerCase().replace(/\s+/g, '')}.com`
    }

    // Replace all template variables in HTML and CSS
    Object.entries(templateVariables).forEach(([variable, value]) => {
      const regex = new RegExp(variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
      templateHtml = templateHtml.replace(regex, value)
      templateCss = templateCss.replace(regex, value)
    })

    // Return the exact template code with business data
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