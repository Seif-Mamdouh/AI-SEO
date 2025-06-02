'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
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
    }
  ])
  const [includeLLMAnalysis, setIncludeLLMAnalysis] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [partialResults, setPartialResults] = useState<any>(null)
  const router = useRouter()

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
  }, [selectedMedspa])

  const updateStepStatus = (stepId: string, status: AnalysisStep['status'], progress?: number) => {
    setAnalysisSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, progress }
        : step
    ))
  }

  const startAnalysis = async () => {
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

      // Make the actual API call (OPTIMIZED: No LLM by default)
      console.log('📡 Calling optimized SEO analysis API...')
      const response = await fetch('/api/seo-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          selectedMedspa,
          generate_llm_report: includeLLMAnalysis  // Only generate if requested
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ SEO analysis completed successfully')
        console.log('🤖 LLM report included:', !!data.llm_report)
        
        updateStepStatus('ranking', 'completed')

        // Store results and navigate to results page
        localStorage.setItem('seoAnalysisResults', JSON.stringify(data))
        
        // Show completion for a moment before redirecting
        setTimeout(() => {
          router.push('/results')
        }, 800) // Reduced from 1500ms
      } else {
        console.error('❌ SEO analysis failed')
        const errorData = await response.json()
        setError(errorData.error || 'Analysis failed')
        updateStepStatus('ranking', 'error')
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
  }

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
    return <IconComponent className="w-6 h-6" />
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
        className="bg-white shadow-sm border-b border-gray-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={goBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">SEO Analysis</h1>
            </div>
            <div className="text-sm text-gray-500">
              {selectedMedspa.name}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
          {/* Left Panel - Analysis Progress */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Business Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Analyzing</h2>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {selectedMedspa.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{selectedMedspa.name}</h3>
                  <p className="text-gray-600 text-sm">{selectedMedspa.formatted_address}</p>
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
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Options</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">Fast Analysis</div>
                      <div className="text-sm text-gray-600">Basic SEO metrics & competitor comparison</div>
                    </div>
                  </div>
                  <div className="text-green-600 font-medium">✓ Included</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-3">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-900 flex items-center space-x-2">
                        <span>AI Deep Analysis</span>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Recommended</span>
                      </div>
                      <div className="text-sm text-gray-600">Detailed insights & actionable recommendations (+30-60s)</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeLLMAnalysis}
                      onChange={(e) => setIncludeLLMAnalysis(e.target.checked)}
                      disabled={isAnalyzing}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div className="text-xs text-green-700">
                    <strong>Recommended:</strong> AI analysis provides personalized insights and specific recommendations to outrank your competitors.
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Steps */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Analysis Progress</h3>
              
              <div className="space-y-4">
                {analysisSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
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
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
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
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{step.title}</h4>
                        {getStepStatusIcon(step.status)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      
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

                {/* LLM Analysis Step (conditional) */}
                {includeLLMAnalysis && (
                  <motion.div
                    className="flex items-center space-x-4 p-4 rounded-xl bg-purple-50 border border-purple-200"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-500 text-white">
                      <Brain className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">AI Deep Analysis</h4>
                      <p className="text-sm text-gray-600 mt-1">Generating comprehensive insights</p>
                    </div>
                    <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="bg-red-50 border border-red-200 rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h3 className="font-semibold text-red-800 mb-2">Analysis Failed</h3>
                  <p className="text-red-700 text-sm mb-4">{error}</p>
                  <div className="flex space-x-3">
                    <button
                      onClick={retryAnalysis}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => {
                        setIncludeLLMAnalysis(false)
                        retryAnalysis()
                      }}
                      className="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm"
                    >
                      Try Without AI Analysis
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Panel - Website Analysis */}
          <motion.div
            className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <WebsiteAnalysis selectedMedspa={selectedMedspa} />
          </motion.div>
        </div>
      </div>
    </div>
  )
} 