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
}

// Dynamic React component preview
function DynamicReactPreview({ code }: { code: string }) {
  const [htmlContent, setHtmlContent] = useState<string>('')
  
  useEffect(() => {
    console.log('🖼️ DynamicReactPreview received code:', {
      length: code.length,
      hasDoctype: code.includes('<!DOCTYPE html>'),
      preview: code.substring(0, 200) + '...'
    })
    
    // Always use the provided code as HTML content
    if (code && code.length > 0) {
      if (code.includes('<!DOCTYPE html>')) {
        // Full HTML document - use as is
        setHtmlContent(code)
      } else {
        // Try to wrap the code in basic HTML for display
        setHtmlContent(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>React Component Preview</title>
              <script src="https://cdn.tailwindcss.com"></script>
              <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
              <style>
                body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
                .bg-gradient-to-r { background: linear-gradient(to right, #ec4899, #8b5cf6); }
                .text-transparent.bg-clip-text { -webkit-background-clip: text; background-clip: text; }
                .backdrop-blur-xl { backdrop-filter: blur(24px); }
                
                /* Add template styles for proper preview */
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
              </style>
          </head>
          <body>
              ${code}
          </body>
          </html>
        `)
      }
    } else {
      // Fallback for empty/no content
      setHtmlContent(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Preview Loading</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
            <div style="padding: 2rem; text-align: center; background: #f8fafc; min-height: 400px; display: flex; align-items: center; justify-content: center;">
                <div>
                    <h2 style="color: #dc2626; margin-bottom: 1rem;">No Preview Available</h2>
                    <p style="color: #6b7280;">Generate a website to see the preview here.</p>
                </div>
            </div>
        </body>
        </html>
      `)
    }
  }, [code])
  
  return (
    <iframe
      srcDoc={htmlContent}
      className="w-full min-h-[800px] border-0"
      title="Website Preview"
      sandbox="allow-scripts allow-same-origin"
      style={{ backgroundColor: '#f8fafc' }}
    />
  )
}

export default function AIBuilder() {
  const [prompt, setPrompt] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedWebsite, setGeneratedWebsite] = useState<GeneratedWebsite | null>(null)
  const [activeTab, setActiveTab] = useState<'preview' | 'react' | 'css' | 'types'>('preview')
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationStep, setGenerationStep] = useState('')
  const [medSpaContext, setMedSpaContext] = useState<any>(null)
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('default')

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
    if (!prompt.trim()) {
      setError('Please enter a prompt to guide the AI generation.')
      return
    }

    try {
      setIsGenerating(true)
      setGenerationProgress(0)
      setGenerationStep('Analyzing your requirements...')
      setError(null)

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
        { progress: 25, step: 'Generating React components...' },
        { progress: 50, step: 'Adding SHADCN/UI elements...' },
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
        ...(medSpaContext && { medSpaData: medSpaContext }),
        templateName: selectedTemplate
      }

      console.log('📡 Making API request with data:', {
        promptLength: prompt.length,
        hasMedSpaData: !!medSpaContext,
        imageCount: medSpaContext?.photos?.length || 0,
        template: selectedTemplate
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

  const TemplateSelector = () => (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Select a Template</h3>
        <div className="text-sm text-gray-500">Choose a starting point for your design</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedTemplate === 'default' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
          onClick={() => setSelectedTemplate('default')}
        >
          <div className="aspect-video bg-gradient-to-r from-rose-100 to-purple-100 rounded-md mb-3 flex items-center justify-center">
            <span className="font-medium text-rose-600">Luxury Template</span>
          </div>
          <h4 className="font-medium">Modern Luxury</h4>
          <p className="text-sm text-gray-500 mt-1">Elegant, premium design with luxury aesthetics</p>
        </div>
        
        {/* Add more template options here as they become available */}
      </div>
    </div>
  )

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
                  AI will create an actual business landing page using real data: business name, location, 
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

                <TemplateSelector />

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