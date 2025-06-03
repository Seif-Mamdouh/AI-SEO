import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  console.log('🚀 Website generation request started at:', new Date().toISOString())
  
  try {
    const { prompt, medSpaData, templateName = 'default' } = await request.json()
    
    console.log('📝 Received prompt length:', prompt?.length || 0)
    console.log('🏥 Med spa data received:', !!medSpaData)
    console.log('🎨 Template requested:', templateName)
    
    if (medSpaData) {
      console.log('🎯 Med spa context detailed analysis:', {
        name: medSpaData.name,
        hasImages: !!medSpaData.photos?.length,
        imageCount: medSpaData.photos?.length || 0,
        hasWebsiteData: !!medSpaData.website_data,
        hasPerformanceData: !!medSpaData.pagespeed_data,
        allKeys: Object.keys(medSpaData),
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

    console.log('🎨 Starting template-based website generation...')
    
    // Log sections being included in template
    const templateSections = ['Header', 'Hero', 'Services', 'About', 'Gallery', 'Testimonials', 'Contact', 'Footer']
    console.log('📋 Template sections being generated:', templateSections.join(' → '))
    
    // Generate website using templates with enhanced context
    const websiteResult = await generateWebsiteWithOpenAI(prompt, medSpaData, templateName)
    
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

async function getWebsiteTemplate(templateName = 'default') {
  try {
    // Template paths
    const templatesDir = path.join(process.cwd(), 'templates', 'websites')
    const templatePath = path.join(templatesDir, `${templateName}.tsx`)
    
    // Default to base template if the requested one doesn't exist
    if (!fs.existsSync(templatePath)) {
      console.log(`⚠️ Template ${templateName} not found, using default`)
      return fs.readFileSync(path.join(templatesDir, 'default.tsx'), 'utf8')
    }
    
    return fs.readFileSync(templatePath, 'utf8')
  } catch (error) {
    console.error('❌ Error loading template:', error)
    // Return a basic template if file can't be loaded
    return `
      export default function MedSpaLandingPage() {
        return (
          <div className="min-h-screen bg-white">
            <h1>Medical Spa Template</h1>
            <p>This is a fallback template.</p>
          </div>
        )
      }
    `
  }
}

function customizeTemplate(template: string, medSpaData: any, imageUrls: any[]) {
  // Basic replacements for business details
  let customized = template
    .replace(/\{\{BUSINESS_NAME\}\}/g, medSpaData?.name || 'Premium Medical Spa')
    .replace(/\{\{BUSINESS_ADDRESS\}\}/g, medSpaData?.formatted_address || 'Professional Location')
    .replace(/\{\{BUSINESS_PHONE\}\}/g, medSpaData?.phone || medSpaData?.formatted_phone_number || '(555) 123-4567')
    .replace(/\{\{BUSINESS_RATING\}\}/g, medSpaData?.rating?.toString() || '4.8')
    .replace(/\{\{BUSINESS_REVIEWS\}\}/g, medSpaData?.user_ratings_total?.toString() || 'many')
  
  // Handle services if available
  if (medSpaData?.website_data?.services && medSpaData.website_data.services.length > 0) {
    // Get the list of services
    const services = medSpaData.website_data.services
    
    // Fill in service data from the parsed website
    for (let i = 0; i < Math.min(services.length, 3); i++) {
      const service = services[i]
      customized = customized
        .replace(new RegExp(`\\{\\{SERVICE_TITLE_${i+1}\\}\\}`, 'g'), service.name || `Premium Service ${i+1}`)
        .replace(new RegExp(`\\{\\{SERVICE_DESCRIPTION_${i+1}\\}\\}`, 'g'), service.description || `Professional luxury service for elite clients.`)
        .replace(new RegExp(`\\{\\{SERVICE_PRICE_${i+1}\\}\\}`, 'g'), `Starting at $${199 + (i * 100)}`)
        .replace(new RegExp(`\\{\\{SERVICE_TECHNOLOGY_${i+1}\\}\\}`, 'g'), `Premium Technology`)
        .replace(new RegExp(`\\{\\{SERVICE_RESULTS_${i+1}\\}\\}`, 'g'), `95% satisfaction rate`)
        
      // Set default features
      for (let j = 1; j <= 4; j++) {
        customized = customized.replace(
          new RegExp(`\\{\\{SERVICE_FEATURE_${i+1}_${j}\\}\\}`, 'g'), 
          `Feature ${j}`
        )
      }
    }
  }
  
  // Set default values for any remaining service templates
  for (let i = 1; i <= 3; i++) {
    customized = customized
      .replace(new RegExp(`\\{\\{SERVICE_TITLE_${i}\\}\\}`, 'g'), `Premium Service ${i}`)
      .replace(new RegExp(`\\{\\{SERVICE_DESCRIPTION_${i}\\}\\}`, 'g'), `Professional luxury service for elite clients.`)
      .replace(new RegExp(`\\{\\{SERVICE_PRICE_${i}\\}\\}`, 'g'), `Starting at $${199 + (i * 100)}`)
      .replace(new RegExp(`\\{\\{SERVICE_TECHNOLOGY_${i}\\}\\}`, 'g'), `Premium Technology`)
      .replace(new RegExp(`\\{\\{SERVICE_RESULTS_${i}\\}\\}`, 'g'), `95% satisfaction rate`)
      
    // Set default features
    for (let j = 1; j <= 4; j++) {
      customized = customized.replace(
        new RegExp(`\\{\\{SERVICE_FEATURE_${i}_${j}\\}\\}`, 'g'), 
        `Feature ${j}`
      )
    }
  }
  
  // Update image references in the code
  if (imageUrls && imageUrls.length > 0) {
    const heroImageUrl = imageUrls[0]?.url || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    const galleryImageUrl = imageUrls[Math.min(1, imageUrls.length - 1)]?.url || heroImageUrl
    const aboutImageUrl = imageUrls[Math.min(2, imageUrls.length - 1)]?.url || heroImageUrl
    
    // Replace placeholder images with real URLs
    customized = customized.replace(/const heroImage = "\/placeholder\.svg"/g, `const heroImage = "${heroImageUrl}"`)
    customized = customized.replace(/const galleryImage = "\/placeholder\.svg"/g, `const galleryImage = "${galleryImageUrl}"`)
    customized = customized.replace(/const aboutImage = "\/placeholder\.svg"/g, `const aboutImage = "${aboutImageUrl}"`)
  }
  
  // Set default values for stats
  const statDefaults = [
    { number: "15,000+", label: "Elite Clients" },
    { number: "20+", label: "Years Excellence" },
    { number: "99%", label: "Satisfaction Rate" },
    { number: "5.0", label: "Luxury Rating" }
  ]
  
  for (let i = 1; i <= 4; i++) {
    customized = customized
      .replace(new RegExp(`\\{\\{STAT_NUMBER_${i}\\}\\}`, 'g'), statDefaults[i-1].number)
      .replace(new RegExp(`\\{\\{STAT_LABEL_${i}\\}\\}`, 'g'), statDefaults[i-1].label)
  }
  
  // Set default values for testimonials
  const testimonialDefaults = [
    {
      name: "Victoria Sterling",
      role: "VIP Client",
      text: "Absolutely exquisite experience. The level of luxury and professionalism exceeded my highest expectations.",
      treatment: "Premium Treatment",
      result: "3 months ago"
    },
    {
      name: "Alexander Rothschild",
      role: "Elite Member",
      text: "The epitome of luxury medical aesthetics. Every detail is perfected, from the ambiance to the results.",
      treatment: "Elite Service",
      result: "6 months ago"
    },
    {
      name: "Isabella Montclair",
      role: "Platinum Client",
      text: "An oasis of luxury and expertise. The treatments are pure indulgence with incredible results.",
      treatment: "Premium Package",
      result: "2 months ago"
    }
  ]
  
  for (let i = 1; i <= 3; i++) {
    customized = customized
      .replace(new RegExp(`\\{\\{TESTIMONIAL_NAME_${i}\\}\\}`, 'g'), testimonialDefaults[i-1].name)
      .replace(new RegExp(`\\{\\{TESTIMONIAL_ROLE_${i}\\}\\}`, 'g'), testimonialDefaults[i-1].role)
      .replace(new RegExp(`\\{\\{TESTIMONIAL_TEXT_${i}\\}\\}`, 'g'), testimonialDefaults[i-1].text)
      .replace(new RegExp(`\\{\\{TESTIMONIAL_TREATMENT_${i}\\}\\}`, 'g'), testimonialDefaults[i-1].treatment)
      .replace(new RegExp(`\\{\\{TESTIMONIAL_RESULT_${i}\\}\\}`, 'g'), testimonialDefaults[i-1].result)
  }
  
  return customized
}

async function generateWebsiteWithOpenAI(prompt: string, medSpaData?: any, templateName = 'default') {
  try {
    console.log('🎨 Using template-based approach for website generation...')
    
    // Extract images from med spa data and create proper Google Places URLs
    const medSpaImages = medSpaData?.photos || []
    console.log('🖼️ Available images:', medSpaImages.length)
    
    // Create proper Google Places photo URLs
    const imageUrls = medSpaImages.map((photo: any, index: number) => {
      // Use a working Google Places photo URL
      const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY || 'DEMO_KEY'}`
      return {
        url: photoUrl,
        reference: photo.photo_reference,
        index: index + 1
      }
    })
    
    // Get the template
    const templateCode = await getWebsiteTemplate(templateName)
    console.log('📝 Retrieved template, size:', templateCode.length)
    
    // Customize the template with business data
    const customizedCode = customizeTemplate(templateCode, medSpaData, imageUrls)
    console.log('✅ Template customization complete')
    
    // Create simplified CSS for preview
    const css = `
      /* Template styles for luxury med spa */
      .hero-gradient {
        background: linear-gradient(135deg, #fdf2f8, #f5f3ff);
      }
      .premium-badge {
        background: linear-gradient(90deg, #f59e0b, #db2777);
      }
      .service-card {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
      }
      .service-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      }
      .testimonial-card {
        border-radius: 1rem;
        background: rgba(255, 255, 255, 0.9);
      }
    `
    
    // Create type definitions for TypeScript
    const types = `
      interface Service {
        title: string;
        description: string;
        price: string;
        icon: React.ReactNode;
        features: string[];
        technology: string;
        results: string;
        image: string;
        premium: boolean;
      }
      
      interface Stat {
        number: string;
        label: string;
        icon: React.ReactNode;
      }
      
      interface Testimonial {
        name: string;
        role: string;
        rating: number;
        text: string;
        treatment: string;
        result: string;
        verified: boolean;
      }
    `
    
    // Create an HTML preview that shows the component would render
    const htmlPreview = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${medSpaData?.name || 'Luxury Med Spa'} - Template Preview</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <style>
          ${css}
          body { font-family: 'Inter', sans-serif; }
          .bg-gradient-to-r { background: linear-gradient(to right, #ec4899, #8b5cf6); }
          .text-transparent.bg-clip-text { -webkit-background-clip: text; background-clip: text; }
          .backdrop-blur-xl { backdrop-filter: blur(24px); }
        </style>
      </head>
      <body>
        <div class="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50">
          <!-- Header -->
          <header class="sticky top-0 z-50 w-full border-b bg-white/95 shadow-lg">
            <div class="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
              <div class="flex items-center space-x-3">
                <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-7 w-7 text-white"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="m5 16 3 4"/><path d="m19 16-3 4"/></svg>
                </div>
                <div>
                  <span class="text-2xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                    ${medSpaData?.name || 'Luxury Med Spa'}
                  </span>
                  <p class="text-sm text-rose-600 font-medium">Elite Aesthetic Center</p>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <div class="hidden sm:flex items-center space-x-2 text-sm text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-rose-600"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span class="font-medium">${medSpaData?.phone || medSpaData?.formatted_phone_number || '(555) 123-4567'}</span>
            </div>
                <button class="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white shadow-lg px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              Book Consultation
                </button>
          </div>
        </div>
      </header>

          <main class="flex-1">
            <!-- Hero Section -->
            <section class="relative py-20 md:py-32">
              <div class="container mx-auto px-4 relative">
                <div class="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
                  <div class="space-y-8">
                    <div class="space-y-6">
                      <div class="inline-block bg-gradient-to-r from-rose-100 to-purple-100 text-rose-700 border-rose-200 px-6 py-3 text-sm font-medium rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 inline-block mr-2"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="m5 16 3 4"/><path d="m19 16-3 4"/></svg>
                        Award-Winning Luxury Med Spa
                      </div>
                      <h1 class="text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                        Elevate Your
                        <span class="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 bg-clip-text text-transparent block">
                          Natural Elegance
                        </span>
                      </h1>
                      <p class="text-xl text-gray-600 max-w-2xl leading-relaxed">
                        Experience the pinnacle of luxury aesthetic medicine at ${medSpaData?.name || 'our med spa'}. Our world-class treatments and master
                        aestheticians deliver transformative results in an atmosphere of unparalleled sophistication.
                      </p>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-4">
                      <button class="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white px-8 py-4 text-lg shadow-xl rounded-lg font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 inline-block mr-2"><path d="M12 3a6 6 0 0 0-6 6c0 7 6 11 6 11s6-4 6-11a6 6 0 0 0-6-6z"></path><circle cx="12" cy="9" r="2"></circle></svg>
                        Begin Your Journey
                      </button>
                      <button class="border-2 border-rose-300 text-rose-600 hover:bg-rose-50 px-8 py-4 text-lg hover:border-rose-400 transition-all duration-300 rounded-lg font-medium">
                        Explore Treatments
                      </button>
                    </div>
    </div>
                  <div class="relative">
                    <div class="relative">
                      ${medSpaImages.length > 0 
                        ? `<img src="${imageUrls[0].url}" alt="${medSpaData?.name || 'Luxury Med Spa'}" class="rounded-3xl shadow-2xl w-full h-auto">`
                        : `<div class="rounded-3xl shadow-2xl bg-gradient-to-br from-rose-100 to-purple-100 w-full h-[500px] flex items-center justify-center"><span class="text-rose-600 font-medium text-xl">Luxury Med Spa Interior</span></div>`
                      }
                      <div class="absolute -bottom-8 -left-8 bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-rose-100">
                        <div class="flex items-center space-x-4">
                          <div class="h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-white"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
                          </div>
                          <div>
                            <p class="font-bold text-gray-900 text-lg">Elite Certified</p>
                            <p class="text-sm text-gray-600">Master Aestheticians</p>
                          </div>
                        </div>
                      </div>
                      <div class="absolute -top-6 -right-6 bg-gradient-to-br from-rose-500 to-purple-600 p-4 rounded-2xl shadow-xl">
                        <div class="flex items-center space-x-2 text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 fill-current"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                          <span class="font-bold text-lg">${medSpaData?.rating || '4.9'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Services Section -->
            <section class="py-16 bg-gradient-to-br from-gray-50 to-rose-50">
              <div class="container mx-auto px-4">
                <div class="text-center mb-10">
                  <h2 class="text-3xl font-bold text-gray-900">Our Premium Services</h2>
                  <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
                    Professional treatments delivered by licensed medical professionals at ${medSpaData?.name || 'our med spa'}
                  </p>
                </div>
                <div class="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                  ${medSpaData?.website_data?.services && medSpaData.website_data.services.length > 0 ? 
                    medSpaData.website_data.services.slice(0, 3).map((service: any, index: number) => `
                      <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        ${medSpaImages[index+1] ? `<img src="${imageUrls[index+1].url}" alt="${service.name}" class="w-full h-40 object-cover rounded-lg mb-4">` : ''}
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">${service.name || `Premium Service ${index+1}`}</h3>
                        <p class="text-sm text-gray-600 mb-4">${service.description || 'Professional treatment for elite results'}</p>
                        <div class="inline-block bg-gradient-to-r from-rose-100 to-purple-100 text-rose-700 px-3 py-1 rounded-full">From $${199 + (index * 100)}</div>
                      </div>
                    `).join('') : 
                    `
                      <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        ${medSpaImages[1] ? `<img src="${imageUrls[1].url}" alt="Premium Treatment" class="w-full h-40 object-cover rounded-lg mb-4">` : ''}
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Premium Facial</h3>
                        <p class="text-sm text-gray-600 mb-4">Luxury facial treatment for radiant skin</p>
                        <div class="inline-block bg-gradient-to-r from-rose-100 to-purple-100 text-rose-700 px-3 py-1 rounded-full">From $199</div>
                      </div>
                      <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        ${medSpaImages[2] ? `<img src="${imageUrls[2].url}" alt="Botox Treatment" class="w-full h-40 object-cover rounded-lg mb-4">` : ''}
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Botox & Fillers</h3>
                        <p class="text-sm text-gray-600 mb-4">Anti-aging injections for natural results</p>
                        <div class="inline-block bg-gradient-to-r from-rose-100 to-purple-100 text-rose-700 px-3 py-1 rounded-full">From $299</div>
                      </div>
                      <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        ${medSpaImages[3] ? `<img src="${imageUrls[3].url}" alt="Laser Treatment" class="w-full h-40 object-cover rounded-lg mb-4">` : ''}
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Laser Treatments</h3>
                        <p class="text-sm text-gray-600 mb-4">Advanced technology for skin rejuvenation</p>
                        <div class="inline-block bg-gradient-to-r from-rose-100 to-purple-100 text-rose-700 px-3 py-1 rounded-full">From $399</div>
                      </div>
                    `
                  }
                </div>
              </div>
            </section>

            <!-- About Section -->
            <section class="py-16 bg-white">
              <div class="container mx-auto px-4">
                <div class="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
                  <div>
                    <h2 class="text-3xl font-bold text-gray-900">About ${medSpaData?.name || 'Our Med Spa'}</h2>
                    <p class="mt-4 text-lg text-gray-600">
                      Our team of certified medical professionals brings years of experience in aesthetic medicine. 
                      We're committed to providing safe, effective treatments in a comfortable, luxurious environment.
                    </p>
                    <div class="mt-8 grid grid-cols-2 gap-6">
                      <div class="text-center">
                        <div class="text-3xl font-bold text-rose-600">20+</div>
                        <div class="text-sm text-gray-500">Years Experience</div>
                      </div>
                      <div class="text-center">
                        <div class="text-3xl font-bold text-rose-600">5,000+</div>
                        <div class="text-sm text-gray-500">Happy Clients</div>
                      </div>
                      <div class="text-center">
                        <div class="text-3xl font-bold text-rose-600">100%</div>
                        <div class="text-sm text-gray-500">Licensed Professionals</div>
                      </div>
                      <div class="text-center">
                        <div class="text-3xl font-bold text-rose-600">${medSpaData?.rating || '4.9'}</div>
                        <div class="text-sm text-gray-500">Google Rating</div>
                      </div>
                    </div>
                  </div>
                  <div class="mt-10 lg:mt-0">
                    ${medSpaImages.length > 1 
                      ? `<img src="${imageUrls[1].url}" alt="${medSpaData?.name || 'Our Med Spa'} About" class="w-full rounded-lg shadow-lg">`
                      : `<div class="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                           <span class="text-gray-500">Professional Team at ${medSpaData?.name || 'Our Med Spa'}</span>
                         </div>`
                    }
                  </div>
                </div>
              </div>
            </section>

            <!-- Gallery Section -->
            ${medSpaImages.length > 2 ? `
            <section class="py-16 bg-gray-50">
              <div class="container mx-auto px-4">
                <div class="text-center">
                  <h2 class="text-3xl font-bold text-gray-900">Our Facility</h2>
                  <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                    Take a look inside ${medSpaData?.name || 'our med spa'}
                  </p>
                </div>
                <div class="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  ${imageUrls.slice(0, 6).map((imageUrl: any, index: number) => `
                    <div class="relative overflow-hidden rounded-lg shadow-lg">
                      <img src="${imageUrl.url}" alt="${medSpaData?.name || 'Our Med Spa'} Facility Photo ${index + 1}" class="w-full h-64 object-cover hover:scale-105 transition-transform duration-300">
                    </div>
                  `).join('')}
                </div>
              </div>
            </section>
            ` : ''}

            <!-- Testimonials -->
            <section class="py-16 bg-white">
              <div class="container mx-auto px-4">
                <div class="text-center">
                  <h2 class="text-3xl font-bold text-gray-900">What Our Clients Say</h2>
                  <div class="mt-6 flex justify-center items-center">
                    <div class="flex text-yellow-400 text-2xl">★★★★★</div>
                    <span class="ml-2 text-gray-600">${medSpaData?.rating || '4.9'} stars from ${medSpaData?.user_ratings_total || 'over 100'} reviews on Google</span>
                  </div>
                  <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="bg-gray-50 p-6 rounded-lg">
                      <p class="text-gray-600 italic">"Amazing results at ${medSpaData?.name || 'this med spa'}! The staff is professional and the facility is beautiful."</p>
                      <p class="mt-4 font-semibold text-gray-900">- Sarah M.</p>
                    </div>
                    <div class="bg-gray-50 p-6 rounded-lg">
                      <p class="text-gray-600 italic">"Best med spa experience I've ever had. ${medSpaData?.name || 'This place'} is incredible!"</p>
                      <p class="mt-4 font-semibold text-gray-900">- Jennifer L.</p>
                    </div>
                    <div class="bg-gray-50 p-6 rounded-lg">
                      <p class="text-gray-600 italic">"Professional service and fantastic results at ${medSpaData?.name || 'this med spa'}. Will definitely return."</p>
                      <p class="mt-4 font-semibold text-gray-900">- Maria R.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Contact Section -->
            <section class="py-16 bg-gray-50">
              <div class="container mx-auto px-4">
                <div class="text-center">
                  <h2 class="text-3xl font-bold text-gray-900">Visit ${medSpaData?.name || 'Our Med Spa'}</h2>
                  <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                      <h3 class="text-lg font-medium text-gray-900">Location & Contact</h3>
                      <p class="mt-2 text-gray-600">${medSpaData?.formatted_address || 'Professional Location'}</p>
                      <p class="mt-2 text-gray-600">${medSpaData?.phone || medSpaData?.formatted_phone_number || '(555) 123-4567'}</p>
                      <p class="mt-2 text-rose-600">Google Rating: ${medSpaData?.rating || '4.9'} ⭐</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                      <h3 class="text-lg font-medium text-gray-900">Hours</h3>
                      <p class="mt-2 text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p class="text-gray-600">Saturday: 9:00 AM - 4:00 PM</p>
                      <p class="text-gray-600">Sunday: Closed</p>
                    </div>
                  </div>
                  <div class="mt-8">
                    <button class="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium text-lg">
                      Schedule Consultation at ${medSpaData?.name || 'Our Med Spa'}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </main>

          <!-- Footer -->
          <footer class="bg-gray-900 text-white py-8">
            <div class="container mx-auto px-4">
              <div class="text-center">
                <h3 class="text-xl font-bold">${medSpaData?.name || 'Premium Med Spa'}</h3>
                <p class="mt-2 text-gray-400">Premium Medical Spa Services</p>
                <p class="mt-2 text-gray-400">${medSpaData?.formatted_address || 'Professional Location'}</p>
                <p class="text-gray-400">${medSpaData?.phone || medSpaData?.formatted_phone_number || '(555) 123-4567'}</p>
                <p class="mt-2 text-gray-400">Rated ${medSpaData?.rating || '4.9'} ⭐ on Google</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
      </html>
    `
    
    return {
      html: customizedCode,
      css: css,
      js: types,
      preview: htmlPreview,
      type: 'react'
    }
  } catch (error) {
    console.error('❌ Template generation error:', error)
    return generateFallbackReactComponent(medSpaData)
  }
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

  // Log sections being included
  const sections = ['Header', 'Hero', 'Services', 'About', 'Testimonials', 'Contact', 'Footer']
  if (galleryImages.length > 0) {
    sections.splice(4, 0, 'Gallery') // Insert Gallery before Testimonials
  }
  console.log('📋 Website sections being generated:', sections.join(' → '))

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
                        ${imageUrls[1] ? `<img src="${imageUrls[1]}" alt="${businessName} ${medSpaData?.name}" class="w-full h-40 object-cover rounded-lg mb-4">` : ''}
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

        <!-- About Section -->
        <section id="about" class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
                    <div>
                        <h2 class="text-3xl font-extrabold text-gray-900">
                            About ${businessName}
                        </h2>
                        <p class="mt-4 text-lg text-gray-600">
                            Our team of certified medical professionals brings years of experience in aesthetic medicine. 
                            We're committed to providing safe, effective treatments in a comfortable, luxurious environment.
                        </p>
                        <div class="mt-8 grid grid-cols-2 gap-6">
                            <div class="text-center">
                                <div class="text-3xl font-bold text-blue-600">20+</div>
                                <div class="text-sm text-gray-500">Years Experience</div>
                            </div>
                            <div class="text-center">
                                <div class="text-3xl font-bold text-blue-600">5,000+</div>
                                <div class="text-sm text-gray-500">Happy Clients</div>
                            </div>
                            <div class="text-center">
                                <div class="text-3xl font-bold text-blue-600">100%</div>
                                <div class="text-sm text-gray-500">Licensed Professionals</div>
                            </div>
                            <div class="text-center">
                                <div class="text-3xl font-bold text-blue-600">${rating}</div>
                                <div class="text-sm text-gray-500">Google Rating</div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-10 lg:mt-0">
                        ${imageUrls[4] ? `<img src="${imageUrls[4]}" alt="${businessName} About" class="w-full rounded-lg shadow-lg">` : 
                          `<div class="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                             <span class="text-gray-500">Professional Team at ${businessName}</span>
                           </div>`}
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

    </body>
    </html>
  `

  return {
    html: htmlPreview,
    css: '',
    js: '',
    preview: htmlPreview,
    type: 'html'
  }
}