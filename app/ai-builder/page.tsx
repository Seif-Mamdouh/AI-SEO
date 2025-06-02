'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
}

export default function AIBuilder() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedWebsite, setGeneratedWebsite] = useState<GeneratedWebsite | null>(null)
  const [activeTab, setActiveTab] = useState<'preview' | 'html' | 'css' | 'js'>('preview')
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
      name: 'Restaurant Website',
      description: 'Elegant restaurant with menu and reservations',
      prompt: 'Design an elegant restaurant website with hero image, menu showcase, chef info, and reservation system. Use warm colors and food photography.',
      preview: '/templates/restaurant.jpg'
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
    // Check if we have med spa context data
    const hasContext = searchParams.get('context') === 'medspa'
    if (hasContext) {
      const contextData = localStorage.getItem('medSpaContextData')
      if (contextData) {
        const medSpaData = JSON.parse(contextData)
        setMedSpaContext(medSpaData)
        
        // Generate contextual prompt based on med spa data
        const contextualPrompt = generateContextualPrompt(medSpaData)
        setPrompt(contextualPrompt)
      }
    }
  }, [searchParams])

  const generateContextualPrompt = (medSpaData: any) => {
    const { name, address, rating, website_data, pagespeed_data } = medSpaData
    
    let prompt = `Create a modern, SEO-optimized landing page for ${name}, a medical spa`
    
    if (address) {
      prompt += ` located in ${address}`
    }
    
    prompt += `. Here's the context about the business:\n\n`
    
    // Add business details
    if (rating) {
      prompt += `• Current Google rating: ${rating} stars\n`
    }
    
    // Add website analysis context
    if (website_data) {
      if (website_data.title) {
        prompt += `• Current website title: "${website_data.title}"\n`
      }
      if (website_data.description) {
        prompt += `• Current description: "${website_data.description}"\n`
      }
      if (website_data.contactInfo?.phone) {
        prompt += `• Phone: ${website_data.contactInfo.phone}\n`
      }
      if (website_data.contactInfo?.email) {
        prompt += `• Email: ${website_data.contactInfo.email}\n`
      }
    }
    
    // Add performance context
    if (pagespeed_data && !pagespeed_data.error) {
      prompt += `\nCurrent website performance issues to address:\n`
      if (pagespeed_data.seo_score < 80) {
        prompt += `• SEO score is ${pagespeed_data.seo_score}/100 - needs improvement\n`
      }
      if (pagespeed_data.performance_score < 80) {
        prompt += `• Performance score is ${pagespeed_data.performance_score}/100 - needs optimization\n`
      }
    }
    
    prompt += `\nCreate a high-converting landing page that:\n`
    prompt += `• Features premium medical spa services (Botox, fillers, laser treatments, facials)\n`
    prompt += `• Has a strong hero section with clear call-to-action\n`
    prompt += `• Includes before/after galleries and testimonials\n`
    prompt += `• Has an appointment booking section\n`
    prompt += `• Is mobile-responsive and fast-loading\n`
    prompt += `• Uses modern design with medical spa aesthetic\n`
    prompt += `• Includes contact information and location details\n`
    prompt += `• Has proper SEO optimization to outrank competitors`
    
    return prompt
  }

  const generateWebsite = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setGenerationProgress(0)
    setGenerationStep('Analyzing your requirements...')
    setError(null)

    try {
      // Simulate progress updates
      const progressUpdates = [
        { progress: 10, step: 'Understanding your vision...' },
        { progress: 25, step: 'Generating HTML structure...' },
        { progress: 50, step: 'Creating CSS styles...' },
        { progress: 75, step: 'Adding JavaScript functionality...' },
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
      const response = await fetch('/api/generate-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate website')
      }

      const result = await response.json()
      
      setGenerationProgress(100)
      setGenerationStep('Website ready!')
      
      setTimeout(() => {
        setGeneratedWebsite(result)
        setActiveTab('preview')
        setIsGenerating(false)
      }, 500)

    } catch (error) {
      console.error('Generation failed:', error)
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

    // Create a complete HTML file with embedded CSS and JS
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
                  🎯 Using {medSpaContext.name} Analysis Data
                </h3>
                <p className="text-sm text-green-700">
                  AI will create a personalized landing page using your business information, location, 
                  current website analysis, and performance insights to maximize SEO results.
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-900">
                  Current SEO Score: {medSpaContext.pagespeed_data?.seo_score || 'N/A'}
                </div>
                <div className="text-xs text-green-600">
                  Target: 90+ with new website
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
                    {(['preview', 'html', 'css', 'js'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1 text-sm font-medium rounded ${
                          activeTab === tab
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {tab.toUpperCase()}
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
                    onClick={() => copyToClipboard(
                      activeTab === 'html' ? generatedWebsite.html :
                      activeTab === 'css' ? generatedWebsite.css :
                      activeTab === 'js' ? generatedWebsite.js : ''
                    )}
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
                      <div 
                        className="w-full min-h-[500px]"
                        dangerouslySetInnerHTML={{ __html: generatedWebsite.html }}
                      />
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
                    <pre className="p-6 text-sm font-mono bg-gray-900 text-green-400 h-full overflow-auto">
                      <code>
                        {activeTab === 'html' ? generatedWebsite.html :
                         activeTab === 'css' ? generatedWebsite.css :
                         generatedWebsite.js}
                      </code>
                    </pre>
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