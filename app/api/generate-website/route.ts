import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

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

    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OpenAI API key not configured')
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    console.log('🤖 Starting OpenAI generation...')
    
    // Generate website using OpenAI with enhanced context
    const websiteResult = await generateWebsiteWithOpenAI(prompt, medSpaData)
    
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

async function generateWebsiteWithOpenAI(prompt: string, medSpaData?: any) {
  try {
    console.log('🎨 Preparing enhanced system prompt with React/SHADCN...')
    
    // Extract images from med spa data
    const medSpaImages = medSpaData?.photos || []
    console.log('🖼️ Available images:', medSpaImages.length)
    
    // Create image context for AI
    let imageContext = ''
    if (medSpaImages.length > 0) {
      imageContext = `\n\nAVAILABLE BUSINESS IMAGES TO USE:
${medSpaImages.map((photo: any, index: number) => 
  `${index + 1}. ${photo.photo_reference} - Use this URL: https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=YOUR_API_KEY`
).join('\n')}

IMPORTANT: Use these REAL business images instead of placeholders. These are actual photos of the business.`
    }

    const systemPrompt = `You are a React developer. Create a complete landing page React component.

CRITICAL: You MUST respond EXACTLY in this format:

REACT_COMPONENT:
[Complete React component code here]

STYLES:
[Any additional CSS styles if needed]

TYPES:
[TypeScript interfaces if needed]

DO NOT include any other text, explanations, or markdown. Just provide the code in the exact format above.

Requirements:
- Create a landing page for: ${medSpaData?.name || 'Medical Spa'}
- Use Next.js 13+ with TypeScript
- Use SHADCN/UI components (Button, Card, Badge, Input, Textarea, etc.)
- Use Tailwind CSS for styling
- Make it responsive and professional
- Include hero section, services, testimonials, contact form
- Use the business name "${medSpaData?.name}" throughout
${medSpaData?.formatted_address ? `- Include address: ${medSpaData.formatted_address}` : ''}
${medSpaData?.phone ? `- Include phone: ${medSpaData.phone}` : ''}
${medSpaData?.rating ? `- Reference ${medSpaData.rating} star rating` : ''}

${imageContext}

Generate a complete, functional React component now:`

    console.log('📡 Making OpenAI API request...')
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    })

    console.log('📨 OpenAI response received')
    console.log('🔢 Tokens used:', completion.usage)

    const response = completion.choices[0]?.message?.content

    if (!response) {
      console.error('❌ No response content from OpenAI')
      throw new Error('No response generated from OpenAI')
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

export default MedSpaLandingPage`

    return {
      html: completeReactCode,
      css: styles,
      js: '', // React components don't need separate JS
      preview: completeReactCode,
      type: 'react'
    }

  } catch (error) {
    console.error('💥 OpenAI generation error:', error)
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    })
    throw new Error('Failed to generate website with AI: ' + (error instanceof Error ? error.message : 'Unknown error'))
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
                        <a href="#contact" class="text-gray-500 hover:text-gray-900">Contact</a>
                    </nav>
                    <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                        Book Consultation
                    </button>
                </div>
            </div>
        </header>

        <!-- Hero Section -->
        <section class="bg-gradient-to-r from-blue-50 to-purple-50 py-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                        Welcome to <span class="text-blue-600">${businessName}</span>
                    </h2>
                    <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        Experience premium medical spa treatments in a luxury environment. Our certified professionals deliver exceptional results.
                    </p>
                    <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                        <div class="rounded-md shadow">
                            <button class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                                Book Your Treatment
                            </button>
                        </div>
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
                        Professional treatments delivered by licensed medical professionals
                    </p>
                </div>
                <div class="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Botox & Fillers</h3>
                        <p class="text-sm text-gray-600 mb-4">Anti-aging injections for natural results</p>
                        <p class="text-gray-600 mb-4">Professional cosmetic injections to reduce fine lines and restore volume.</p>
                        <div class="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">From $299</div>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Laser Treatments</h3>
                        <p class="text-sm text-gray-600 mb-4">Advanced laser therapy for skin rejuvenation</p>
                        <p class="text-gray-600 mb-4">State-of-the-art laser technology for hair removal, skin resurfacing, and more.</p>
                        <div class="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">From $199</div>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">HydraFacial</h3>
                        <p class="text-sm text-gray-600 mb-4">Deep cleansing and hydrating facial treatment</p>
                        <p class="text-gray-600 mb-4">Multi-step treatment for cleaner, more beautiful skin with no downtime.</p>
                        <div class="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">From $149</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Testimonials -->
        <section class="py-16 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <h2 class="text-3xl font-extrabold text-gray-900">What Our Clients Say</h2>
                    <div class="mt-6 flex justify-center items-center">
                        <div class="flex star-rating">
                            ★★★★★
                        </div>
                        <span class="ml-2 text-gray-600">${rating} stars from ${medSpaData?.user_ratings_total || 'over 100'} reviews</span>
                    </div>
                    <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div class="bg-white p-6 rounded-lg shadow-sm">
                            <p class="text-gray-600 italic">"Amazing results! The staff is professional and the facility is beautiful."</p>
                            <p class="mt-4 font-semibold text-gray-900">- Sarah M.</p>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow-sm">
                            <p class="text-gray-600 italic">"Best med spa experience I've ever had. Highly recommend!"</p>
                            <p class="mt-4 font-semibold text-gray-900">- Jennifer L.</p>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow-sm">
                            <p class="text-gray-600 italic">"Professional service and fantastic results. Will definitely return."</p>
                            <p class="mt-4 font-semibold text-gray-900">- Maria R.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <h2 class="text-3xl font-extrabold text-gray-900">Visit ${businessName}</h2>
                    <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 class="text-lg font-medium text-gray-900">Location</h3>
                            <p class="mt-2 text-gray-600">${address}</p>
                            <p class="mt-2 text-gray-600">${phone}</p>
                        </div>
                        <div>
                            <h3 class="text-lg font-medium text-gray-900">Hours</h3>
                            <p class="mt-2 text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                            <p class="text-gray-600">Saturday: 9:00 AM - 4:00 PM</p>
                            <p class="text-gray-600">Sunday: Closed</p>
                        </div>
                    </div>
                    <div class="mt-8">
                        <button class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg">
                            Schedule Consultation
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
                </div>
            </div>
        </footer>
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