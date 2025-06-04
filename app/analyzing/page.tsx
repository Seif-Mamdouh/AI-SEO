'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, TrendingUp, Globe, Zap, Users, CheckCircle, Brain, AlertCircle } from 'lucide-react'
import WebsiteAnalysis from './components/WebsiteAnalysis'

interface MedSpa {
  place_id: string
  name: string
  formatted_address: string
  rating?: number
  user_ratings_total?: number
  website?: string
  phone?: string
}

interface AnalysisStep {
  id: string
  title: string
  description: string
  icon: any
  status: 'pending' | 'active' | 'completed' | 'error'
  progress?: number
}

export default function AnalyzingPage() {
  const [selectedMedspa, setSelectedMedspa] = useState<MedSpa | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([
    {
      id: 'competitors',
      title: 'Finding Competitors',
      description: 'Discovering local medical spas nearby',
      icon: Users,
      status: 'pending'
    },
    {
      id: 'websites',
      title: 'Analyzing Websites',
      description: 'Checking performance and SEO metrics',
      icon: Globe,
      status: 'pending'
    },
    {
      id: 'performance',
      title: 'Performance Testing',
      description: 'Running Google PageSpeed insights',
      icon: Zap,
      status: 'pending'
    },
    {
      id: 'ranking',
      title: 'SEO Ranking',
      description: 'Calculating competitive positioning',
      icon: TrendingUp,
      status: 'pending'
    },
    {
      id: 'ai-analysis',
      title: 'AI Deep Analysis',
      description: 'Generating comprehensive insights',
      icon: Brain,
      status: 'pending'
    }
  ])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [partialResults, setPartialResults] = useState<any>(null)
  const router = useRouter()

  const updateStepStatus = (stepId: string, status: AnalysisStep['status'], progress?: number) => {
    setAnalysisSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, progress }
        : step
    ))
  }

  const startAnalysis = useCallback(async () => {
    if (!selectedMedspa) return

    setIsAnalyzing(true)
    setError(null)

    try {
      console.log('🚀 Starting optimized SEO analysis for:', selectedMedspa.name)

      // Step 1: Finding Competitors (faster)
      updateStepStatus('competitors', 'active')
      await new Promise(resolve => setTimeout(resolve, 500)) // Reduced from 1000ms
      updateStepStatus('competitors', 'completed')

      // Step 2: Website Analysis (faster)
      updateStepStatus('websites', 'active')
      await new Promise(resolve => setTimeout(resolve, 800)) // Reduced from 1500ms
      updateStepStatus('websites', 'completed')

      // Step 3: Performance Testing (faster)
      updateStepStatus('performance', 'active')
      await new Promise(resolve => setTimeout(resolve, 1000)) // Reduced from 2000ms
      updateStepStatus('performance', 'completed')

      // Step 4: SEO Ranking
      updateStepStatus('ranking', 'active')
      await new Promise(resolve => setTimeout(resolve, 500))
      updateStepStatus('ranking', 'completed')

      // Step 5: AI Deep Analysis
      updateStepStatus('ai-analysis', 'active')

      // Make the actual API call (includes AI analysis)
      console.log('📡 Calling SEO analysis API with AI insights...')
      const response = await fetch('/api/seo-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          selectedMedspa,
          generate_llm_report: true  // Always include AI analysis
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ SEO analysis completed successfully')
        
        updateStepStatus('ai-analysis', 'completed')

        // Store results and navigate to results page
        localStorage.setItem('seoAnalysisResults', JSON.stringify(data))
        
        // Show completion for a moment before redirecting
        setTimeout(() => {
          router.push('/results')
        }, 800)
      } else {
        console.error('❌ SEO analysis failed')
        const errorData = await response.json()
        setError(errorData.error || 'Analysis failed')
        updateStepStatus('ai-analysis', 'error')
      }
    } catch (error) {
      console.error('💥 Analysis error:', error)
      setError('Failed to analyze. Please try again.')
      setAnalysisSteps(prev => prev.map(step => 
        step.status === 'active' ? { ...step, status: 'error' } : step
      ))
    } finally {
      setIsAnalyzing(false)
    }
  }, [selectedMedspa, router])

  useEffect(() => {
    // Get selected med spa from localStorage
    const storedMedspa = localStorage.getItem('analyzingMedspa')
    if (storedMedspa) {
      setSelectedMedspa(JSON.parse(storedMedspa))
    } else {
      // If no med spa data, redirect back
      router.push('/')
    }
  }, [router])

  useEffect(() => {
    if (selectedMedspa && !isAnalyzing) {
      startAnalysis()
    }
  }, [selectedMedspa, isAnalyzing, startAnalysis])

  const retryAnalysis = () => {
    setError(null)
    setAnalysisSteps(prev => prev.map(step => ({ ...step, status: 'pending' })))
    startAnalysis()
  }

  const goBack = () => {
    router.push('/')
  }

  const getStepIcon = (step: AnalysisStep) => {
    const IconComponent = step.icon
    return <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
  }

  const getStepStatusIcon = (status: AnalysisStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'active':
        return (
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        )
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <div className="w-5 h-5 bg-gray-300 rounded-full" />
    }
  }

  if (!selectedMedspa) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <motion.div 
        className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={goBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">SEO Analysis</h1>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 max-w-xs truncate">
              {selectedMedspa.name}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Panel - Analysis Progress */}
          <motion.div
            className="space-y-6 order-2 xl:order-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Business Info Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-gray-100">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Analyzing</h2>
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-lg flex-shrink-0">
                  {selectedMedspa.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{selectedMedspa.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 sm:line-clamp-none">{selectedMedspa.formatted_address}</p>
                  {selectedMedspa.rating && (
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-500 text-sm">★</span>
                      <span className="ml-1 text-sm text-gray-700">{selectedMedspa.rating}</span>
                      {selectedMedspa.user_ratings_total && (
                        <span className="ml-1 text-xs text-gray-500">
                          ({selectedMedspa.user_ratings_total} reviews)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Analysis Options */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Options</h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start sm:items-center justify-between p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0">
                    <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 text-sm sm:text-base">Fast Analysis</div>
                      <div className="text-xs sm:text-sm text-gray-600 line-clamp-2">Basic SEO metrics & competitor comparison</div>
                    </div>
                  </div>
                  <div className="text-green-600 font-medium text-sm ml-2 flex-shrink-0">✓ Included</div>
                </div>

                <div className="flex items-start sm:items-center justify-between p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0">
                    <Brain className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 flex flex-col sm:flex-row sm:items-center sm:space-x-2 text-sm sm:text-base">
                        <span>AI Deep Analysis</span>
                        
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 line-clamp-2">Detailed insights & actionable recommendations</div>
                    </div>
                  </div>
                  <div className="text-green-600 font-medium text-sm ml-2 flex-shrink-0">✓ Included</div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs sm:text-sm text-green-700">
                    <strong>Comprehensive Analysis:</strong> Both fast metrics and AI-powered insights are included for the most complete SEO analysis.
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Steps */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Analysis Progress</h3>
              
              <div className="space-y-3 sm:space-y-4">
                {analysisSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className={`flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl transition-all duration-300 ${
                      step.status === 'active' 
                        ? 'bg-blue-50 border border-blue-200' 
                        : step.status === 'completed'
                        ? 'bg-green-50 border border-green-200'
                        : step.status === 'error'
                        ? 'bg-red-50 border border-red-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      step.status === 'active'
                        ? 'bg-blue-500 text-white'
                        : step.status === 'completed'
                        ? 'bg-green-500 text-white'
                        : step.status === 'error'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {getStepIcon(step)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{step.title}</h4>
                        <div className="ml-2 flex-shrink-0">
                          {getStepStatusIcon(step.status)}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{step.description}</p>
                      
                      {step.status === 'active' && (
                        <motion.div 
                          className="w-full bg-gray-200 rounded-full h-1 mt-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <motion.div 
                            className="bg-blue-500 h-1 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h3 className="font-semibold text-red-800 mb-2 text-sm sm:text-base">Analysis Failed</h3>
                  <p className="text-red-700 text-sm mb-4">{error}</p>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={retryAnalysis}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Try Again
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Panel - Website Analysis */}
          <motion.div
            className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden order-1 xl:order-2 max-h-[70vh] xl:max-h-[calc(100vh-180px)]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="h-full overflow-auto">
              <WebsiteAnalysis selectedMedspa={selectedMedspa} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 