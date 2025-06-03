'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { 
  Sparkles, 
  Code, 
  Eye, 
  Download, 
  Copy, 
  Play, 
  Settings, 
  Palette, 
  Layout,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  Save,
  Upload,
  FileCode,
  Globe,
  CheckCircle
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'

interface GeneratedWebsite {
  html: string
  css: string
  js: string
  preview?: string
  type?: string
  template?: {
    id: string
    name: string
    category: string
    colorScheme: {
      primary: string
      secondary: string
      accent: string
    }
  }
}

// Dynamic React component preview
function DynamicReactPreview({ code }: { code: string }) {
  const [renderContent, setRenderContent] = useState<JSX.Element | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    console.log('🖼️ DynamicReactPreview received code:', {
      length: code.length,
      hasDoctype: code.includes('<!DOCTYPE html>'),
      isReactComponent: code.includes('export default function'),
      preview: code.substring(0, 200) + '...'
    })
    
    if (!code || code.length === 0) {
      setRenderContent(
        <div className="flex items-center justify-center min-h-[400px] bg-gray-50">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-600 mb-2">No Preview Available</h2>
            <p className="text-gray-500">Generate a website to see the preview here.</p>
          </div>
        </div>
      )
      return
    }

    // If it's a full HTML document, render it in an iframe
    if (code.includes('<!DOCTYPE html>')) {
      setRenderContent(
        <iframe
          srcDoc={code}
          className="w-full min-h-[500px] border-0"
          title="Website Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      )
      return
    }

    // If it's React component code, try to render it
    if (code.includes('export default function') || code.includes('export default')) {
      try {
        // Create a safe React component renderer
        // For now, we'll create a styled preview that looks like the component would render
        const previewElement = (
          <div className="w-full min-h-[500px] bg-white">
            {/* Try to extract and render the React component */}
            <ReactComponentRenderer code={code} />
          </div>
        )
        setRenderContent(previewElement)
        setError(null)
      } catch (err) {
        console.error('Error rendering React component:', err)
        setError('Failed to render the React component')
        setRenderContent(
          <div className="flex items-center justify-center min-h-[400px] bg-red-50">
            <div className="text-center">
              <h2 className="text-xl font-bold text-red-600 mb-2">Render Error</h2>
              <p className="text-red-500">Failed to render the React component</p>
              <p className="text-sm text-red-400 mt-2">Check the REACT tab for the code</p>
            </div>
          </div>
        )
      }
    } else {
      // Fallback for unknown content
      setRenderContent(
        <div className="flex items-center justify-center min-h-[400px] bg-gray-50">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-600 mb-2">Preview Unavailable</h2>
            <p className="text-gray-500">Switch to REACT tab to view the code</p>
          </div>
        </div>
      )
    }
  }, [code])
  
  return <div className="w-full">{renderContent}</div>
}

// Component to actually render React code
function ReactComponentRenderer({ code }: { code: string }) {
  const [renderedComponent, setRenderedComponent] = useState<JSX.Element | null>(null)
  
  useEffect(() => {
    try {
      // For safety and since we can't execute arbitrary code in the browser,
      // we'll create a visual representation based on the template structure
      
      // Extract key information from the code
      const businessName = extractBusinessData(code, 'business_name') || 'Medical Spa'
      const phoneNumber = extractBusinessData(code, 'phone') || '(555) 123-4567'
      const rating = extractBusinessData(code, 'rating') || '4.8'
      const address = extractBusinessData(code, 'address') || 'Professional Location'
      
      // Determine template type based on code content
      let templateType = detectTemplateType(code)
      
      // Create a visual representation
      const component = (
        <div className="min-h-screen bg-white overflow-hidden">
          {/* Header */}
          <header className={`${getHeaderClasses(templateType)} shadow-sm border-b`}>
            <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                {templateType === 'luxury' && <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white">👑</div>}
                {templateType === 'modern' && <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center text-white">💎</div>}
                {templateType === 'elegant' && <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center text-white">✨</div>}
                <h1 className={`text-2xl font-bold ${getTextClasses(templateType)}`}>
                  {businessName}
                </h1>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <nav className="flex space-x-6">
                  <a href="#" className="text-gray-600 hover:text-gray-900">Services</a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
                </nav>
                <button className={`${getButtonClasses(templateType)} px-6 py-2 text-white rounded-lg font-medium`}>
                  Book Consultation
                </button>
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <section className={`${getHeroClasses(templateType)} py-20`}>
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h2 className="text-5xl font-bold text-white mb-6">
                Welcome to {businessName}
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Premium Medical Spa Services for Ultimate Beauty and Wellness
              </p>
              <div className="flex justify-center items-center mb-8">
                <span className="text-yellow-400 text-2xl">★★★★★</span>
                <span className="ml-2 text-white">{rating} stars on Google</span>
              </div>
              <button className={`${getButtonClasses(templateType)} px-8 py-4 text-white rounded-lg font-medium text-lg`}>
                Begin Your Journey
              </button>
            </div>
          </section>

          {/* Services Section */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <h3 className={`text-3xl font-bold text-center mb-12 ${getTextClasses(templateType)}`}>
                Our Premium Services
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {['Botox & Fillers', 'Laser Treatments', 'HydraFacial'].map((service, index) => (
                  <div key={service} className="bg-white p-6 rounded-xl shadow-lg border hover:shadow-xl transition-shadow">
                    <div className={`w-12 h-12 ${getServiceIconClasses(templateType)} rounded-lg flex items-center justify-center mb-4`}>
                      {index === 0 && '💉'}
                      {index === 1 && '✨'}
                      {index === 2 && '💧'}
                    </div>
                    <h4 className="text-xl font-semibold mb-3">{service}</h4>
                    <p className="text-gray-600 mb-4">Professional {service.toLowerCase()} treatments</p>
                    <div className={`${getAccentClasses(templateType)} text-sm px-3 py-1 rounded-full inline-block`}>
                      From ${index === 0 ? '$299' : index === 1 ? '$199' : '$149'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className={`py-16 ${getContactClasses(templateType)}`}>
            <div className="max-w-7xl mx-auto px-4 text-center">
              <h3 className="text-3xl font-bold text-white mb-8">Contact Us</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <div className="flex items-center justify-center space-x-3 text-white">
                    <span>📞</span>
                    <span className="font-medium">{phoneNumber}</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <div className="flex items-center justify-center space-x-3 text-white">
                    <span>📍</span>
                    <span className="font-medium text-sm">{address}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )
      
      setRenderedComponent(component)
    } catch (error) {
      console.error('Error creating component preview:', error)
      setRenderedComponent(
        <div className="flex items-center justify-center min-h-[400px] bg-gray-50">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-600 mb-2">Preview Error</h2>
            <p className="text-gray-500">Unable to render component preview</p>
          </div>
        </div>
      )
    }
  }, [code])
  
  return renderedComponent
}

// Helper functions for styling based on template type
function extractBusinessData(code: string, field: string): string | null {
  console.log('🔍 Extracting business data for:', field, 'from', code.length, 'characters')
  
  if (field === 'business_name') {
    // Look for actual business name in the generated code
    // Pattern 1: Look for business name in JSX text content
    const jsxTextMatches = code.match(/>\s*([^<>{}\[\]]+(?:esthetics?|spa|medical|beauty|wellness|center)[^<>{}\[\]]*)\s*</gi)
    if (jsxTextMatches) {
      for (const match of jsxTextMatches) {
        const cleanText = match.replace(/[><]/g, '').trim()
        if (cleanText && !cleanText.includes('Medical Spa') && !cleanText.includes('Premium') && cleanText.length > 2) {
          console.log('✅ Found business name in JSX text:', cleanText)
          return cleanText
        }
      }
    }
    
    // Pattern 2: Look for specific business names
    const specificNameMatch = code.match(/O2\s+esthetics/i)
    if (specificNameMatch) {
      console.log('✅ Found specific business name:', specificNameMatch[0])
      return specificNameMatch[0]
    }
    
    // Pattern 3: Look in string literals
    const stringMatches = code.match(/['"`]([^'"`]*(?:esthetics?|spa|aesthetics?|beauty|wellness|medical center)[^'"`]*)['"`]/gi)
    if (stringMatches) {
      for (const match of stringMatches) {
        const cleanName = match.replace(/['"`]/g, '').trim()
        if (cleanName && !cleanName.includes('Premium Medical Spa') && !cleanName.includes('Medical Spa') && cleanName !== 'Medical Spa') {
          console.log('✅ Found business name in string:', cleanName)
          return cleanName
        }
      }
    }
  }
  
  if (field === 'phone') {
    // Look for phone numbers in the generated code
    const phoneMatches = code.match(/['"`]?(\(\d{3}\)\s*\d{3}-\d{4}|\d{3}-\d{3}-\d{4}|\(\d{3}\)\s*\d{7})['"`]?/g)
    if (phoneMatches) {
      for (const match of phoneMatches) {
        const cleanPhone = match.replace(/['"`]/g, '').trim()
        if (cleanPhone && !cleanPhone.includes('555-123-4567') && !cleanPhone.includes('(555) 123-4567')) {
          console.log('✅ Found real phone number:', cleanPhone)
          return cleanPhone
        }
      }
    }
  }
  
  if (field === 'rating') {
    // Look for rating values in the code
    const ratingMatches = code.match(/(\d+\.?\d*)\s*(?:stars?|rating)/gi)
    if (ratingMatches) {
      for (const match of ratingMatches) {
        const ratingValue = match.match(/(\d+\.?\d*)/)?.[1]
        if (ratingValue && parseFloat(ratingValue) !== 4.8 && parseFloat(ratingValue) > 0) {
          console.log('✅ Found real rating:', ratingValue)
          return ratingValue
        }
      }
    }
  }
  
  if (field === 'address') {
    // Look for real addresses in the code
    const addressPatterns = [
      // Full addresses with street number, name, city, state
      /['"`]([^'"`]*\b\d+\s+[A-Za-z\s]+(?:St|Street|Ave|Avenue|Rd|Road|Blvd|Boulevard|Dr|Drive|Lane|Ln|Way|Ct|Court)\b[^'"`]*(?:,\s*[A-Za-z\s]+)*(?:,\s*[A-Z]{2})?\s*\d{5}?[^'"`]*)['"`]/gi,
      // Simpler address patterns
      /['"`]([^'"`]*\b\d+[^'"`]*(?:St|Street|Ave|Avenue|Rd|Road|Blvd|Boulevard|Dr|Drive)[^'"`]*)['"`]/gi
    ]
    
    for (const pattern of addressPatterns) {
      const matches = code.match(pattern)
      if (matches) {
        for (const match of matches) {
          const cleanAddress = match.replace(/['"`]/g, '').trim()
          if (cleanAddress && !cleanAddress.includes('Professional Location') && !cleanAddress.includes('Your Location') && cleanAddress.length > 10) {
            console.log('✅ Found real address:', cleanAddress)
            return cleanAddress
          }
        }
      }
    }
  }
  
  console.log('❌ Could not extract real', field, 'from generated code')
  return null
}

function getHeaderClasses(type: string): string {
  switch (type) {
    case 'luxury': return 'bg-white'
    case 'modern': return 'bg-white'
    case 'elegant': return 'bg-white'
    default: return 'bg-white'
  }
}

function getTextClasses(type: string): string {
  switch (type) {
    case 'luxury': return 'text-purple-600'
    case 'modern': return 'text-rose-600'
    case 'elegant': return 'text-pink-600'
    default: return 'text-blue-600'
  }
}

function getButtonClasses(type: string): string {
  switch (type) {
    case 'luxury': return 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700'
    case 'modern': return 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700'
    case 'elegant': return 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700'
    default: return 'bg-blue-600 hover:bg-blue-700'
  }
}

function getHeroClasses(type: string): string {
  switch (type) {
    case 'luxury': return 'bg-gradient-to-br from-purple-900 via-violet-900 to-purple-800'
    case 'modern': return 'bg-gradient-to-br from-gray-900 via-rose-900 to-pink-900'
    case 'elegant': return 'bg-gradient-to-br from-pink-900 via-rose-900 to-pink-800'
    default: return 'bg-gradient-to-br from-blue-900 to-blue-800'
  }
}

function getServiceIconClasses(type: string): string {
  switch (type) {
    case 'luxury': return 'bg-purple-100 text-purple-600'
    case 'modern': return 'bg-rose-100 text-rose-600'
    case 'elegant': return 'bg-pink-100 text-pink-600'
    default: return 'bg-blue-100 text-blue-600'
  }
}

function getAccentClasses(type: string): string {
  switch (type) {
    case 'luxury': return 'bg-purple-100 text-purple-800'
    case 'modern': return 'bg-rose-100 text-rose-800'
    case 'elegant': return 'bg-pink-100 text-pink-800'
    default: return 'bg-blue-100 text-blue-800'
  }
}

function getContactClasses(type: string): string {
  switch (type) {
    case 'luxury': return 'bg-gradient-to-br from-purple-900 to-violet-900'
    case 'modern': return 'bg-gradient-to-br from-gray-900 to-rose-900'
    case 'elegant': return 'bg-gradient-to-br from-pink-900 to-rose-900'
    default: return 'bg-gradient-to-br from-blue-900 to-blue-800'
  }
}

// Detect template type from React component code
function detectTemplateType(code: string): 'luxury' | 'modern' | 'elegant' {
  console.log('🎨 Detecting template type from generated code...')
  
  // Count occurrences of template-specific indicators
  const luxuryIndicators = (code.match(/Crown|luxury|Luxury|purple-600|#8B5CF6|#7C3AED|violet/gi) || []).length
  const modernIndicators = (code.match(/Elite|Diamond|Platinum|Gem|rose-500|pink-500|#F43F5E|#EC4899|#A855F7/gi) || []).length
  const elegantIndicators = (code.match(/elegant|Elegant|rose|pink|#F43F5E/gi) || []).length
  
  console.log('Template indicators found:', { luxury: luxuryIndicators, modern: modernIndicators, elegant: elegantIndicators })
  
  if (luxuryIndicators > modernIndicators && luxuryIndicators > elegantIndicators) {
    console.log('✅ Detected luxury template based on indicators')
    return 'luxury'
  }
  
  if (modernIndicators > luxuryIndicators && modernIndicators > elegantIndicators) {
    console.log('✅ Detected modern template based on indicators')
    return 'modern'
  }
  
  if (elegantIndicators > luxuryIndicators && elegantIndicators > modernIndicators) {
    console.log('✅ Detected elegant template based on indicators')
    return 'elegant'
  }
  
  // Default based on most common words if tie
  if (code.includes('Elite') || code.includes('Diamond') || code.includes('Platinum')) {
    console.log('✅ Defaulting to modern template based on Elite/Diamond/Platinum keywords')
    return 'modern'
  }
  
  console.log('✅ Defaulting to modern template')
  return 'modern'
}

export default function AIBuilder() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedWebsite, setGeneratedWebsite] = useState<GeneratedWebsite | null>(null)
  const [activeTab, setActiveTab] = useState<'preview' | 'react' | 'css' | 'types'>('preview')
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationStep, setGenerationStep] = useState('')
  const [medSpaContext, setMedSpaContext] = useState<any>(null)
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  const templates = [
    {
      name: 'Med Spa Landing',
      description: 'Professional medical spa with booking system',
      prompt: 'Create a modern medical spa landing page with hero section, services grid (facial treatments, botox, laser therapy), testimonials, and online booking form. Use blue and white color scheme with professional typography.',
      preview: '/templates/medspa.jpg'
    },
    {
      name: 'Business Portfolio',
      description: 'Professional business portfolio site',
      prompt: 'Build a clean business portfolio website with services, team section, case studies, and contact form. Modern minimalist design.',
      preview: '/templates/business.jpg'
    },
    {
      name: 'E-commerce Store',
      description: 'Product showcase with shopping features',
      prompt: 'Create an e-commerce product page with image gallery, product details, reviews, and add to cart functionality. Modern shopping design.',
      preview: '/templates/ecommerce.jpg'
    }
  ]

  useEffect(() => {
    // Check if we're viewing a pre-generated website
    const isViewing = searchParams.get('view') === 'true'
    if (isViewing) {
      const generatedData = localStorage.getItem('generatedWebsiteData')
      if (generatedData) {
        console.log('🔍 Loading pre-generated website data')
        const websiteData = JSON.parse(generatedData)
        setGeneratedWebsite(websiteData)
        setActiveTab('preview')
        // Clear the data to prevent confusion
        localStorage.removeItem('generatedWebsiteData')
        return
      }
    }

    // Check if we have med spa context data
    const hasContext = searchParams.get('context') === 'medspa'
    if (hasContext) {
      const contextData = localStorage.getItem('medSpaContextData')
      console.log('🔍 AI Builder context check:', {
        hasContextParam: hasContext,
        hasStoredData: !!contextData,
        storedDataLength: contextData?.length || 0
      })
      
      if (contextData) {
        const medSpaData = JSON.parse(contextData)
        console.log('📊 Loaded med spa context data:', {
          name: medSpaData.name,
          hasPhotos: !!medSpaData.photos,
          photosLength: medSpaData.photos?.length || 0,
          photos: medSpaData.photos,
          keys: Object.keys(medSpaData),
          fullData: medSpaData
        })
        
        setMedSpaContext(medSpaData)
        
        // Generate contextual prompt based on med spa data
        const contextualPrompt = generateContextualPrompt(medSpaData)
        setPrompt(contextualPrompt)
      } else {
        console.log('❌ No med spa context data found in localStorage')
      }
    } else {
      console.log('ℹ️ No medspa context parameter found')
    }
  }, [searchParams])

  const generateContextualPrompt = (medSpaData: any) => {
    const { name, address, rating, website_data, pagespeed_data, photos, formatted_address, phone } = medSpaData
    
    console.log('🎨 Generating contextual prompt for:', name)
    console.log('📸 Available photos:', photos?.length || 0)
    
    let prompt = `Create a professional, conversion-optimized landing page for ${name}, a medical spa business`
    
    if (formatted_address || address) {
      const location = formatted_address || address
      prompt += ` located at ${location}`
      
      // Extract city for location-specific content
      const cityMatch = location.match(/,\s*([^,]+),\s*[A-Z]{2}/)
      const city = cityMatch ? cityMatch[1].trim() : ''
      if (city) {
        prompt += `. This is a real business serving the ${city} area`
      }
    }
    
    prompt += `.\n\nIMPORTANT: This must be a REAL landing page for the actual business "${name}", not a template or demo.\n\n`
    
    prompt += `BUSINESS INFORMATION TO USE:\n`
    
    // Add business details
    if (rating) {
      prompt += `• Business Name: ${name} (use this exact name throughout)\n`
      prompt += `• Google Rating: ${rating} stars (${medSpaData.user_ratings_total || 'many'} reviews)\n`
    }
    
    if (formatted_address || address) {
      prompt += `• Address: ${formatted_address || address} (use this exact address)\n`
    }
    
    if (phone || medSpaData.formatted_phone_number) {
      prompt += `• Phone: ${phone || medSpaData.formatted_phone_number}\n`
    }
    
    // Add photo information
    if (photos && photos.length > 0) {
      prompt += `• Photos: ${photos.length} actual business photos available (use these real images)\n`
      prompt += `• Image URLs: Use Google Places API photo references provided\n`
    }
    
    // Add website analysis context
    if (website_data) {
      if (website_data.title) {
        prompt += `• Current Website Title: "${website_data.title}"\n`
      }
      if (website_data.description) {
        prompt += `• Current Description: "${website_data.description}"\n`
      }
      if (website_data.contactInfo?.phone) {
        prompt += `• Contact Phone: ${website_data.contactInfo.phone}\n`
      }
      if (website_data.contactInfo?.email) {
        prompt += `• Contact Email: ${website_data.contactInfo.email}\n`
      }
    }
    
    // Add performance context
    if (pagespeed_data && !pagespeed_data.error) {
      prompt += `\nCURRENT WEBSITE PERFORMANCE TO IMPROVE:\n`
      if (pagespeed_data.seo_score < 80) {
        prompt += `• Current SEO score: ${pagespeed_data.seo_score}/100 - new site should achieve 90+\n`
      }
      if (pagespeed_data.performance_score < 80) {
        prompt += `• Current performance score: ${pagespeed_data.performance_score}/100 - new site should load faster\n`
      }
    }
    
    prompt += `\nLANDING PAGE REQUIREMENTS:\n`
    prompt += `• Hero Section: "${name}" prominently displayed with compelling medical spa messaging\n`
    prompt += `• Services: Premium medical spa treatments (Botox, fillers, laser treatments, facials, etc.)\n`
    prompt += `• About: Professional description specifically about ${name}\n`
    prompt += `• Gallery: Use the ${photos?.length || 0} actual business photos provided\n`
    prompt += `• Testimonials: Reference the ${rating}-star Google rating and create realistic reviews\n`
    prompt += `• Contact: Use the exact address and phone number provided\n`
    prompt += `• Booking: Appointment scheduling specifically for ${name}\n`
    prompt += `• Footer: Complete ${name} business information\n`
    
    prompt += `\nCONTENT GUIDELINES:\n`
    prompt += `• Every heading and section should reference "${name}" by name\n`
    prompt += `• Write content as if you're the ${name} marketing team\n`
    prompt += `• Include location-specific references to make it feel local\n`
    prompt += `• Use professional medical spa language and terminology\n`
    prompt += `• Include realistic pricing for premium medical spa services\n`
    prompt += `• Make it feel like a real business website, not a template\n`
    
    if (photos && photos.length > 0) {
      prompt += `\nIMAGE INTEGRATION:\n`
      prompt += `• Use the ${photos.length} real photos of ${name} throughout the page\n`
      prompt += `• These are actual business photos that should be integrated naturally\n`
      prompt += `• Use them in hero section, gallery, about section, etc.\n`
    }
    
    prompt += `\nRemember: This is a real business landing page for "${name}" - make it feel authentic and professional, as if ${name} hired you to build their website.`
    
    console.log('✅ Generated contextual prompt length:', prompt.length)
    return prompt
  }

  const generateWebsite = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setGenerationProgress(0)
    setGenerationStep('Analyzing your requirements...')
    setError(null)

    try {
      console.log('🚀 Starting website generation...')
      console.log('📝 Prompt length:', prompt.length)
      
      if (medSpaContext) {
        console.log('🎯 Using med spa context:', {
          name: medSpaContext.name,
          hasPhotos: !!medSpaContext.photos?.length,
          photoCount: medSpaContext.photos?.length || 0
        })
      }

      // Simulate progress updates
      const progressUpdates = [
        { progress: 10, step: 'Understanding your vision...' },
        { progress: 25, step: medSpaContext ? 'Selecting optimal template...' : 'Generating React components...' },
        { progress: 50, step: medSpaContext ? 'Generating React components with template...' : 'Adding SHADCN/UI elements...' },
        { progress: 75, step: 'Integrating business images...' },
        { progress: 90, step: 'Finalizing website...' },
      ]

      let currentUpdateIndex = 0
      const progressInterval = setInterval(() => {
        if (currentUpdateIndex < progressUpdates.length) {
          const update = progressUpdates[currentUpdateIndex]
          setGenerationProgress(update.progress)
          setGenerationStep(update.step)
          currentUpdateIndex++
        }
      }, 1000)

      // Make actual API call to generate website
      const requestBody = {
        prompt,
        ...(medSpaContext && { medSpaData: medSpaContext })
      }

      console.log('📡 Making API request with data:', {
        promptLength: prompt.length,
        hasMedSpaData: !!medSpaContext,
        imageCount: medSpaContext?.photos?.length || 0
      })

      const response = await fetch('/api/generate-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ API Error:', errorData)
        throw new Error(errorData.error || 'Failed to generate website')
      }

      const result = await response.json()
      console.log('✅ Website generated successfully:', {
        hasHtml: !!result.html,
        hasCss: !!result.css,
        hasPreview: !!result.preview,
        type: result.type,
        htmlLength: result.html?.length || 0,
        previewLength: result.preview?.length || 0,
        previewStart: result.preview?.substring(0, 100) || 'No preview'
      })
      
      setGenerationProgress(100)
      setGenerationStep('Website ready!')
      
      setTimeout(() => {
        setGeneratedWebsite(result)
        setActiveTab('preview')
        setIsGenerating(false)
      }, 500)

    } catch (error) {
      console.error('💥 Generation failed:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate website')
      setGenerationStep('Generation failed')
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadWebsite = () => {
    if (!generatedWebsite) return

    if (generatedWebsite.type === 'react') {
      // Download React component files
      downloadFile(generatedWebsite.html, 'MedSpaLandingPage.tsx')
      if (generatedWebsite.css) {
        downloadFile(generatedWebsite.css, 'globals.css')
      }
      if (generatedWebsite.js) {
        downloadFile(generatedWebsite.js, 'types.ts')
      }
      
      // Create a README with setup instructions
      const readme = `# AI Generated Med Spa Landing Page

## Setup Instructions

1. Install dependencies:
\`\`\`bash
pnpm add framer-motion lucide-react
pnpm add @shadcn/ui
\`\`\`

2. Set up SHADCN/UI:
\`\`\`bash
npx shadcn-ui@latest init
\`\`\`

3. Add required SHADCN components:
\`\`\`bash
npx shadcn-ui@latest add button card badge input textarea label separator dialog tabs avatar alert
\`\`\`

4. Copy the generated files:
   - \`MedSpaLandingPage.tsx\` - Main React component
   - \`globals.css\` - Global styles (if any)
   - \`types.ts\` - TypeScript interfaces (if any)

5. Import and use the component in your Next.js app:
\`\`\`tsx
import MedSpaLandingPage from './components/MedSpaLandingPage'

export default function Home() {
  return <MedSpaLandingPage />
}
\`\`\`

## Features
- Modern React components with TypeScript
- SHADCN/UI component library
- Tailwind CSS styling
- Framer Motion animations
- Mobile-responsive design
- SEO optimized
- Medical spa industry best practices
`
      downloadFile(readme, 'README.md')
    } else {
      // Legacy HTML download
      const completeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Generated Website</title>
    <style>
${generatedWebsite.css}
    </style>
</head>
<body>
${generatedWebsite.html}
    <script>
${generatedWebsite.js}
    </script>
</body>
</html>`

      downloadFile(completeHtml, 'website.html')
      downloadFile(generatedWebsite.css, 'styles.css')
      downloadFile(generatedWebsite.js, 'script.js')
    }
  }

  const getViewportClass = () => {
    switch (viewport) {
      case 'mobile': return 'max-w-sm'
      case 'tablet': return 'max-w-2xl'
      default: return 'w-full'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <motion.div 
        className="bg-white shadow-sm border-b border-gray-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  MedSpa GPT Builder
                </h1>
                <p className="text-sm text-gray-600">AI-powered website generator</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Build your landing page in 60 seconds
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Context Banner - appears when using med spa data */}
      {medSpaContext && (
        <motion.div 
          className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-200"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-green-900">
                  🎯 Building Real Website for {medSpaContext.name}
                </h3>
                <p className="text-sm text-green-700">
                  AI will randomly select a professional template and create an actual business landing page using real data: business name, location, 
                  {medSpaContext.photos?.length > 0 && ` ${medSpaContext.photos.length} actual Google Places photos,`} contact info, 
                  and performance insights. This will be a professional website specifically for {medSpaContext.name}.
                </p>
                {medSpaContext.photos?.length > 0 && (
                  <div className="mt-2 flex items-center space-x-2">
                    <div className="flex -space-x-1">
                      {medSpaContext.photos.slice(0, 3).map((photo: any, index: number) => (
                        <div 
                          key={index}
                          className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-medium"
                        >
                          📷
                        </div>
                      ))}
                      {medSpaContext.photos.length > 3 && (
                        <div className="w-8 h-8 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-medium">
                          +{medSpaContext.photos.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-green-600 font-medium">
                      Real business photos will be integrated into hero, gallery, and service sections
                    </span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-900">
                  Current SEO Score: {medSpaContext.pagespeed_data?.seo_score || 'N/A'}
                </div>
                <div className="text-xs text-green-600">
                  Target: 90+ with new website
                </div>
                {medSpaContext.photos?.length > 0 && (
                  <div className="text-xs text-green-600 mt-1">
                    Using {medSpaContext.photos.length} Google Places images
                  </div>
                )}
                <div className="text-xs text-green-600 mt-1">
                  🎨 Template: Will be randomly selected
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Template Selection Banner - appears when website is generated with template */}
      {generatedWebsite?.template && (
        <motion.div 
          className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-purple-900">
                  🎨 Template Applied: {generatedWebsite.template.name}
                </h3>
                <p className="text-sm text-purple-700">
                  Category: {generatedWebsite.template.category.charAt(0).toUpperCase() + generatedWebsite.template.category.slice(1)} • 
                  AI randomly selected this template design for optimal aesthetic appeal and conversion optimization.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-purple-600 font-medium">Color Scheme:</span>
                  <div className="flex space-x-1">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300" 
                      style={{ backgroundColor: generatedWebsite.template.colorScheme.primary }}
                      title="Primary Color"
                    ></div>
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300" 
                      style={{ backgroundColor: generatedWebsite.template.colorScheme.secondary }}
                      title="Secondary Color"
                    ></div>
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300" 
                      style={{ backgroundColor: generatedWebsite.template.colorScheme.accent }}
                      title="Accent Color"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!generatedWebsite ? (
          /* Initial Interface */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Hero Section */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Code className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Build Your Website with AI
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Get it done in one click. Improve your website with AI in 35 seconds.
                  Describe your vision and watch it come to life.
                </p>
              </motion.div>

              {/* Quick Templates */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start Templates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {templates.map((template, index) => (
                    <motion.button
                      key={template.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPrompt(template.prompt)}
                      className="p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all text-left group"
                    >
                      <div className="w-full h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-3 flex items-center justify-center">
                        <Layout className="w-8 h-8 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                        {template.name}
                      </h4>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* AI Prompt Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
              >
                <div className="mb-6">
                  <label className="block text-lg font-semibold text-gray-900 mb-2">
                    Describe Your Website
                  </label>
                  <p className="text-gray-600 mb-4">
                    Tell us what kind of website you want to build. Be as specific as possible.
                  </p>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Example: Create a modern medical spa website with a hero section showcasing treatments, a services grid with pricing, customer testimonials, and an online booking form. Use a clean blue and white color scheme with professional typography and high-quality imagery."
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    disabled={isGenerating}
                  />
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <button
                  onClick={generateWebsite}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Generate Website</span>
                    </>
                  )}
                </button>

                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6"
                  >
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{generationStep}</span>
                        <span className="text-sm text-gray-500">{generationProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${generationProgress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* Generated Website Interface */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full"
          >
            {/* Code Editor Header */}
            <div className="bg-white rounded-t-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">AI Generated Website</span>
                  </div>

                  {/* Tabs */}
                  <div className="flex space-x-1">
                    {(['preview', 'react', 'css', 'types'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-3 py-1 text-sm font-medium rounded ${
                          activeTab === tab
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {tab === 'react' ? 'REACT' : tab.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Viewport Controls */}
                  {activeTab === 'preview' && (
                    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                      {(['desktop', 'tablet', 'mobile'] as const).map((view) => (
                        <button
                          key={view}
                          onClick={() => setViewport(view)}
                          className={`p-2 rounded ${
                            viewport === view ? 'bg-white shadow-sm' : ''
                          }`}
                        >
                          {view === 'desktop' && <Monitor className="w-4 h-4" />}
                          {view === 'tablet' && <Tablet className="w-4 h-4" />}
                          {view === 'mobile' && <Smartphone className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <button
                    onClick={() => {
                      const content = 
                        activeTab === 'react' ? generatedWebsite.html :
                        activeTab === 'css' ? generatedWebsite.css :
                        activeTab === 'types' ? (generatedWebsite.js || '') :
                        generatedWebsite.html
                      copyToClipboard(content)
                    }}
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={downloadWebsite}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-1"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={() => {
                      setGeneratedWebsite(null)
                      setPrompt('')
                      setError(null)
                    }}
                    className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    New Website
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="bg-gray-50 border-x border-b border-gray-200 rounded-b-lg min-h-[600px]">
              <AnimatePresence mode="wait">
                {activeTab === 'preview' && (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6 h-full"
                  >
                    <div className={`mx-auto bg-white rounded-lg shadow-lg overflow-hidden ${getViewportClass()}`}>
                      <div className="w-full min-h-[500px]">
                        <DynamicReactPreview code={generatedWebsite.preview || generatedWebsite.html} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab !== 'preview' && (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full"
                  >
                    <SyntaxHighlighter
                      language={
                        activeTab === 'react' ? 'jsx' :
                        activeTab === 'css' ? 'css' :
                        activeTab === 'types' ? 'typescript' : 'javascript'
                      }
                      style={tomorrow}
                      customStyle={{
                        backgroundColor: '#1e1e1e',
                        padding: '1.5rem',
                        borderRadius: '0',
                        overflow: 'auto',
                        height: '100%',
                        fontSize: '14px',
                        lineHeight: '1.5',
                      }}
                      showLineNumbers={true}
                      wrapLines={true}
                    >
                      {activeTab === 'react' ? generatedWebsite.html :
                       activeTab === 'css' ? generatedWebsite.css :
                       activeTab === 'types' ? (generatedWebsite.js || '// TypeScript interfaces will appear here') :
                       generatedWebsite.html}
                    </SyntaxHighlighter>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
} 