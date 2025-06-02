import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { vercel } from '@ai-sdk/vercel'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  console.log('🚀 Website generation request started at:', new Date().toISOString())
  
  try {
    const { prompt, medSpaData } = await request.json()
    
    console.log('📝 Received prompt length:', prompt?.length || 0)
    console.log('🏥 Med spa data received:', !!medSpaData)
    
    if (medSpaData) {
      console.log('🎯 Med spa context detailed analysis:', {
        name: medSpaData.name,
        hasImages: !!medSpaData.photos?.length,
        imageCount: medSpaData.photos?.length || 0,
        hasWebsiteData: !!medSpaData.website_data,
        hasPerformanceData: !!medSpaData.pagespeed_data,
        allKeys: Object.keys(medSpaData),
        photosData: medSpaData.photos,
        websiteData: medSpaData.website_data,
        pagespeedData: medSpaData.pagespeed_data
      })
    }

    if (!prompt) {
      console.error('❌ No prompt provided')
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    if (!process.env.VERCEL_API_KEY) {
      console.error('❌ V0 API key not configured')
      return NextResponse.json({ error: 'V0 API key not configured' }, { status: 500 })
    }

    console.log('🤖 Starting V0 generation...')
    
    // Generate website using V0 with enhanced context
    const websiteResult = await generateWebsiteWithV0(prompt, medSpaData)
    
    const duration = Date.now() - startTime
    console.log('✅ Website generation completed in:', duration + 'ms')
    console.log('📊 Generated code sizes:', {
      html: websiteResult.html?.length || 0,
      css: websiteResult.css?.length || 0,
      js: websiteResult.js?.length || 0
    })

    return NextResponse.json(websiteResult)
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

async function generateWebsiteWithV0(prompt: string, medSpaData?: any) {
  try {
    console.log('🎨 Preparing enhanced prompt for V0...')
    
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
- Make it feel like a real business website, not a template

Generate a complete, production-ready React component now:`

    console.log('📡 Making V0 API request...')
    
    const { text: response } = await generateText({
      model: vercel('v0-1.0-md', {
        apiKey: process.env.VERCEL_API_KEY,
      }),
      prompt: `${systemPrompt}\n\nUser Request: ${prompt}`,
    })

    console.log('📨 V0 response received')

    if (!response) {
      console.error('❌ No response content from OpenAI')
      throw new Error('No response generated from V0')
    }

    console.log('📝 Response length:', response.length)

    // Parse the response to extract React component, styles, and types
    const reactMatch = response.match(/REACT_COMPONENT:\s*([\s\S]*?)(?=STYLES:|TYPES:|$)/i)
    const stylesMatch = response.match(/STYLES:\s*([\s\S]*?)(?=REACT_COMPONENT:|TYPES:|$)/i)
    const typesMatch = response.match(/TYPES:\s*([\s\S]*?)(?=REACT_COMPONENT:|STYLES:|$)/i)

    let reactComponent = ''
    let styles = ''
    let types = ''

    if (reactMatch) {
      reactComponent = reactMatch[1].trim()
    } else {
      console.log('⚠️ No REACT_COMPONENT section found, using entire response as component')
      // If no structured format, treat the entire response as React component
      reactComponent = cleanCodeResponse(response)
    }

    if (stylesMatch) {
      styles = stylesMatch[1].trim()
    }

    if (typesMatch) {
      types = typesMatch[1].trim()
    }

    console.log('✅ Successfully parsed response sections:', {
      hasReactComponent: !!reactComponent,
      hasStyles: !!styles,
      hasTypes: !!types,
      componentLength: reactComponent.length
    })

    // If we still don't have a component, use fallback
    if (!reactComponent || reactComponent.length < 100) {
      console.log('⚠️ Component too short or missing, generating fallback')
      return generateFallbackReactComponent(medSpaData)
    }

    // Create a complete Next.js page component
    const completeReactCode = `'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

${types}

${reactComponent}

export default function MedSpaLandingPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">${medSpaData?.name || 'Premium Medical Spa'}</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#services" className="text-gray-500 hover:text-gray-900">Services</a>
              <a href="#about" className="text-gray-500 hover:text-gray-900">About</a>
              <a href="#contact" className="text-gray-500 hover:text-gray-900">Contact</a>
            </nav>
            <Button onClick={() => setIsBookingOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              Book Consultation
            </Button>
          </div>
        </div>
      </header>
      {/* Rest of component... */}
    </div>
  )
}
`

    // Generate HTML preview for iframe
    const htmlPreview = generateFallbackReactComponent(medSpaData).html
    
    return {
      html: completeReactCode,
      css: styles,
      js: '', // React components don't need separate JS
      preview: htmlPreview,
      type: 'react'
    }

  } catch (error) {
    console.error('💥 V0 generation error:', error)
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    })
    throw new Error('Failed to generate website with V0: ' + (error instanceof Error ? error.message : 'Unknown error'))
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

function generateFallbackReactComponent(medSpaData?: any) {
  const businessName = medSpaData?.name || 'Premium Medical Spa'
  const address = medSpaData?.formatted_address || 'Your Location'
  const phone = medSpaData?.phone || '(555) 123-4567'
  const rating = medSpaData?.rating || 4.8

  // Create Google Places photo URLs for fallback component
  const medSpaImages = medSpaData?.photos || []
  const imageUrls = medSpaImages.map((photo: any, index: number) => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY || 'DEMO_KEY'}`
  })

  // Generate hero image and gallery images
  const heroImage = imageUrls[0] || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  const galleryImages = imageUrls.slice(0, 6) // Use up to 6 real images

  // Generate actual HTML for preview
  const htmlPreview = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${businessName} - Premium Medical Spa</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          .star-rating { color: #fbbf24; }
          .hero-bg {
            background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${heroImage}');
            background-size: cover;
            background-position: center;
          }
        </style>
    </head>
    <body class="bg-white">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b border-gray-200">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-6">
                    <div class="flex items-center">
                        <h1 class="text-2xl font-bold text-gray-900">${businessName}</h1>
                    </div>
                    <nav class="hidden md:flex space-x-8">
                        <a href="#services" class="text-gray-500 hover:text-gray-900">Services</a>
                        <a href="#about" class="text-gray-500 hover:text-gray-900">About</a>
                        <a href="#gallery" class="text-gray-500 hover:text-gray-900">Gallery</a>
                        <a href="#contact" class="text-gray-500 hover:text-gray-900">Contact</a>
                    </nav>
                    <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                        Book Consultation
                    </button>
                </div>
            </div>
        </header>

        <!-- Hero Section with Real Business Image -->
        <section class="hero-bg py-32 text-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <h2 class="text-4xl font-extrabold sm:text-5xl md:text-6xl">
                        Welcome to <span class="text-blue-400">${businessName}</span>
                    </h2>
                    <p class="mt-3 max-w-md mx-auto text-base text-gray-200 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        Experience premium medical spa treatments in a luxury environment. Our certified professionals deliver exceptional results.
                    </p>
                    <div class="mt-8">
                        <button class="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-lg transition-colors">
                            Book Your Treatment
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Services Section -->
        <section id="services" class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <h2 class="text-3xl font-extrabold text-gray-900">Our Premium Services</h2>
                    <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                        Professional treatments delivered by licensed medical professionals at ${businessName}
                    </p>
                </div>
                <div class="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        ${imageUrls[1] ? `<img src="${imageUrls[1]}" alt="${businessName} Botox Treatment" class="w-full h-40 object-cover rounded-lg mb-4">` : ''}
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Botox & Fillers</h3>
                        <p class="text-sm text-gray-600 mb-4">Anti-aging injections for natural results</p>
                        <p class="text-gray-600 mb-4">Professional cosmetic injections to reduce fine lines and restore volume.</p>
                        <div class="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">From $299</div>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        ${imageUrls[2] ? `<img src="${imageUrls[2]}" alt="${businessName} Laser Treatment" class="w-full h-40 object-cover rounded-lg mb-4">` : ''}
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Laser Treatments</h3>
                        <p class="text-sm text-gray-600 mb-4">Advanced laser therapy for skin rejuvenation</p>
                        <p class="text-gray-600 mb-4">State-of-the-art laser technology for hair removal, skin resurfacing, and more.</p>
                        <div class="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">From $199</div>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        ${imageUrls[3] ? `<img src="${imageUrls[3]}" alt="${businessName} HydraFacial" class="w-full h-40 object-cover rounded-lg mb-4">` : ''}
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">HydraFacial</h3>
                        <p class="text-sm text-gray-600 mb-4">Deep cleansing and hydrating facial treatment</p>
                        <p class="text-gray-600 mb-4">Multi-step treatment for cleaner, more beautiful skin with no downtime.</p>
                        <div class="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">From $149</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Gallery Section with Real Business Images -->
        ${galleryImages.length > 0 ? `
        <section id="gallery" class="py-16 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <h2 class="text-3xl font-extrabold text-gray-900">Our Facility</h2>
                    <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                        Take a look inside ${businessName}
                    </p>
                </div>
                <div class="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${galleryImages.map((imageUrl: string, index: number) => `
                        <div class="relative overflow-hidden rounded-lg shadow-lg">
                            <img src="${imageUrl}" alt="${businessName} Facility Photo ${index + 1}" class="w-full h-64 object-cover hover:scale-105 transition-transform duration-300">
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
        ` : ''}

        <!-- Testimonials -->
        <section class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <h2 class="text-3xl font-extrabold text-gray-900">What Our Clients Say</h2>
                    <div class="mt-6 flex justify-center items-center">
                        <div class="flex star-rating text-2xl">
                            ★★★★★
                        </div>
                        <span class="ml-2 text-gray-600">${rating} stars from ${medSpaData?.user_ratings_total || 'over 100'} reviews on Google</span>
                    </div>
                    <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div class="bg-gray-50 p-6 rounded-lg">
                            <p class="text-gray-600 italic">"Amazing results at ${businessName}! The staff is professional and the facility is beautiful."</p>
                            <p class="mt-4 font-semibold text-gray-900">- Sarah M.</p>
                        </div>
                        <div class="bg-gray-50 p-6 rounded-lg">
                            <p class="text-gray-600 italic">"Best med spa experience I've ever had. ${businessName} is incredible!"</p>
                            <p class="mt-4 font-semibold text-gray-900">- Jennifer L.</p>
                        </div>
                        <div class="bg-gray-50 p-6 rounded-lg">
                            <p class="text-gray-600 italic">"Professional service and fantastic results at ${businessName}. Will definitely return."</p>
                            <p class="mt-4 font-semibold text-gray-900">- Maria R.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="py-16 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <h2 class="text-3xl font-extrabold text-gray-900">Visit ${businessName}</h2>
                    <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="bg-white p-6 rounded-lg shadow-sm">
                            <h3 class="text-lg font-medium text-gray-900">Location & Contact</h3>
                            <p class="mt-2 text-gray-600">${address}</p>
                            <p class="mt-2 text-gray-600">${phone}</p>
                            <p class="mt-2 text-blue-600">Google Rating: ${rating} ⭐</p>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow-sm">
                            <h3 class="text-lg font-medium text-gray-900">Hours</h3>
                            <p class="mt-2 text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                            <p class="text-gray-600">Saturday: 9:00 AM - 4:00 PM</p>
                            <p class="text-gray-600">Sunday: Closed</p>
                        </div>
                    </div>
                    <div class="mt-8">
                        <button class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg">
                            Schedule Consultation at ${businessName}
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-gray-900 text-white py-8">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <h3 class="text-xl font-bold">${businessName}</h3>
                    <p class="mt-2 text-gray-400">Premium Medical Spa Services</p>
                    <p class="mt-2 text-gray-400">${address}</p>
                    <p class="text-gray-400">${phone}</p>
                    <p class="mt-2 text-gray-400">Rated ${rating} ⭐ on Google</p>
                </div>
            </div>
        </footer>

        <script>
            // Simple smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
        </script>
    </body>
    </html>
  `

  const reactComponent = `function MedSpaLandingPage() {
  const [isBookingOpen, setIsBookingOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">${businessName}</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#services" className="text-gray-500 hover:text-gray-900">Services</a>
              <a href="#about" className="text-gray-500 hover:text-gray-900">About</a>
              <a href="#contact" className="text-gray-500 hover:text-gray-900">Contact</a>
            </nav>
            <Button onClick={() => setIsBookingOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              Book Consultation
            </Button>
          </div>
        </div>
      </header>
      {/* Rest of component... */}
    </div>
  )
}`

  return {
    html: htmlPreview,
    css: '',
    js: '',
    preview: htmlPreview,
    type: 'html'
  }
}