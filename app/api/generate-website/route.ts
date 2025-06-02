import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { vercel } from '@ai-sdk/vercel'

// PERFORMANCE OPTIMIZATION: Simple in-memory cache for generated websites
const websiteCache = new Map<string, { data: any; timestamp: number; ttl: number }>()

function getCachedWebsite(key: string): any | null {
  const cached = websiteCache.get(key)
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data
  }
  websiteCache.delete(key)
  return null
}

function setCachedWebsite(key: string, data: any, ttlMinutes: number = 30): void {
  websiteCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMinutes * 60 * 1000
  })
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  console.log('🚀 Website generation request started at:', new Date().toISOString())
  
  let body: any
  try {
    body = await request.json()
    const { prompt, medSpaData } = body
    
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

    // PERFORMANCE OPTIMIZATION: Check cache first based on business name and prompt hash
    const businessName = medSpaData?.name || 'Medical Spa'
    const promptHash = hashString(prompt.substring(0, 100)) // Simple hash of first 100 chars
    const cacheKey = `website_${businessName}_${promptHash}`
    
    const cachedWebsite = getCachedWebsite(cacheKey)
    if (cachedWebsite) {
      console.log('⚡ Returning cached website generation result')
      return NextResponse.json(cachedWebsite)
    }

    console.log('🤖 Starting V0 generation...')
    
    // Generate website using V0 with simplified context
    const websiteResult = await generateWebsiteWithV0(prompt, medSpaData)
    
    const duration = Date.now() - startTime
    console.log('✅ Website generation completed in:', duration + 'ms')
    console.log('📊 Generated code sizes:', {
      html: websiteResult.html?.length || 0,
      css: websiteResult.css?.length || 0,
      js: websiteResult.js?.length || 0
    })

    // PERFORMANCE OPTIMIZATION: Cache successful results
    setCachedWebsite(cacheKey, websiteResult, 30) // Cache for 30 minutes

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

// Simple hash function for caching
function hashString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

async function generateWebsiteWithV0(prompt: string, medSpaData?: any) {
  try {
    console.log('🎨 Preparing optimized prompt for V0...')
    
    const businessName = medSpaData?.name || 'Premium Medical Spa'
    const address = medSpaData?.formatted_address || 'Professional Location'
    const phone = medSpaData?.phone || medSpaData?.formatted_phone_number || '(555) 123-4567'
    const rating = medSpaData?.rating || 4.8

    // PERFORMANCE OPTIMIZATION: Simplified and focused prompt
    const optimizedPrompt = `Create a modern medical spa website for "${businessName}".

Business Details:
- Name: ${businessName}
- Location: ${address}
- Phone: ${phone}
- Rating: ${rating} stars

Requirements:
- Modern, responsive design using Next.js and Tailwind CSS
- Hero section with business name and value proposition
- Services section (Botox, dermal fillers, laser treatments, facials)
- About section highlighting expertise
- Contact section with phone and address
- Professional color scheme (blues, whites, clean)
- Mobile-first responsive design
- Call-to-action buttons for booking

Create a single React component with inline Tailwind styling. Keep it clean and professional.`

    console.log('📡 Making V0 API request...')
    console.log('📊 Request details:', {
      promptLength: optimizedPrompt.length,
      modelUsed: 'v0-1.0-md',
      businessName: businessName
    })
    
    // PERFORMANCE OPTIMIZATION: Add timeout with AbortController
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 120000) // 2 minute timeout
    
    const { text: response } = await generateText({
      model: vercel('v0-1.0-md'),
      prompt: optimizedPrompt,
      abortSignal: controller.signal
    })

    clearTimeout(timeoutId)

    console.log('📨 V0 response received')

    if (!response) {
      console.error('❌ No response content from V0')
      throw new Error('No response generated from V0')
    }

    console.log('📝 Response length:', response.length)

    // Clean the response and prepare for preview
    const cleanedResponse = cleanCodeResponse(response)
    
    // PERFORMANCE OPTIMIZATION: Generate simpler HTML preview
    const htmlPreview = generateSimplePreview(medSpaData)
    
    console.log('🎉 V0 generation completed successfully!')
    
    return {
      html: cleanedResponse,
      css: '',
      js: '',
      preview: htmlPreview,
      type: 'react'
    }

  } catch (error) {
    console.error('💥 V0 generation error:', error)
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Website generation timed out - please try again')
    }
    
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

// PERFORMANCE OPTIMIZATION: Simplified preview generation
function generateSimplePreview(medSpaData?: any) {
  const businessName = medSpaData?.name || 'Premium Medical Spa'
  const address = medSpaData?.formatted_address || 'Your Location'
  const phone = medSpaData?.phone || '(555) 123-4567'
  const rating = medSpaData?.rating || 4.8

  // PERFORMANCE OPTIMIZATION: Use placeholder images instead of fetching real photos
  const heroImage = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'

  // Generate simplified HTML for preview
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
                        <a href="#contact" class="text-gray-500 hover:text-gray-900">Contact</a>
                    </nav>
                    <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                        Book Consultation
                    </button>
                </div>
            </div>
        </header>

        <!-- Hero Section -->
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
                        <div class="flex items-center justify-center space-x-2 mb-6">
                            <span class="text-yellow-400 text-2xl">★★★★★</span>
                            <span class="text-lg font-medium">${rating}/5 Rating</span>
                        </div>
                        <button class="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
                            Book Your Consultation
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Services Section -->
        <section class="py-20 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Our Premium Services
                    </h2>
                    <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                        Professional medical spa treatments designed to enhance your natural beauty
                    </p>
                </div>

                <div class="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div class="bg-white p-6 rounded-lg shadow-md text-center">
                        <div class="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                            <span class="text-blue-600 text-2xl">💉</span>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Botox</h3>
                        <p class="text-gray-600">Smooth away wrinkles and fine lines with expert Botox treatments</p>
                    </div>
                    
                    <div class="bg-white p-6 rounded-lg shadow-md text-center">
                        <div class="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                            <span class="text-blue-600 text-2xl">✨</span>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Dermal Fillers</h3>
                        <p class="text-gray-600">Restore volume and enhance facial contours naturally</p>
                    </div>
                    
                    <div class="bg-white p-6 rounded-lg shadow-md text-center">
                        <div class="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                            <span class="text-blue-600 text-2xl">🔥</span>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Laser Treatments</h3>
                        <p class="text-gray-600">Advanced laser therapy for skin rejuvenation and hair removal</p>
                    </div>
                    
                    <div class="bg-white p-6 rounded-lg shadow-md text-center">
                        <div class="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                            <span class="text-blue-600 text-2xl">🧴</span>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">HydraFacials</h3>
                        <p class="text-gray-600">Deep cleansing and hydrating facial treatments for glowing skin</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                        <h2 class="text-3xl font-extrabold text-gray-900 mb-8">
                            Visit Our Spa
                        </h2>
                        <div class="space-y-6">
                            <div class="flex items-start space-x-4">
                                <div class="w-6 h-6 text-blue-600 mt-1">📍</div>
                                <div>
                                    <h3 class="font-semibold text-gray-900">Address</h3>
                                    <p class="text-gray-600">${address}</p>
                                </div>
                            </div>
                            <div class="flex items-start space-x-4">
                                <div class="w-6 h-6 text-blue-600 mt-1">📞</div>
                                <div>
                                    <h3 class="font-semibold text-gray-900">Phone</h3>
                                    <p class="text-gray-600">${phone}</p>
                                </div>
                            </div>
                            <div class="flex items-start space-x-4">
                                <div class="w-6 h-6 text-blue-600 mt-1">⭐</div>
                                <div>
                                    <h3 class="font-semibold text-gray-900">Rating</h3>
                                    <p class="text-gray-600">${rating}/5 stars from satisfied clients</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-blue-50 p-8 rounded-lg">
                        <h3 class="text-2xl font-bold text-gray-900 mb-6">Book Your Consultation</h3>
                        <p class="text-gray-600 mb-8">Ready to start your beauty journey? Contact us today to schedule your personalized consultation.</p>
                        <button class="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors">
                            Schedule Appointment
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </body>
    </html>`

  return htmlPreview
}