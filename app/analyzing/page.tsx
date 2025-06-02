'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, TrendingUp, Globe, Zap, Users, CheckCircle, Brain } from 'lucide-react'
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
      description: 'Discovering local medical spas and aesthetic clinics',
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
      id: 'llm-analysis',
      title: 'AI Analysis',
      description: 'Generating comprehensive SEO report with AI',
      icon: Brain,
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
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
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
      console.log('🚀 Starting comprehensive SEO analysis for:', selectedMedspa.name)

      // Step 1: Finding Competitors
      updateStepStatus('competitors', 'active')
      await new Promise(resolve => setTimeout(resolve, 1000))
      updateStepStatus('competitors', 'completed')

      // Step 2: Website Analysis
      updateStepStatus('websites', 'active')
      await new Promise(resolve => setTimeout(resolve, 1500))
      updateStepStatus('websites', 'completed')

      // Step 3: Performance Testing
      updateStepStatus('performance', 'active')
      await new Promise(resolve => setTimeout(resolve, 2000))
      updateStepStatus('performance', 'completed')

      // Step 4: AI Analysis
      updateStepStatus('llm-analysis', 'active')

      // Make the actual API call with LLM analysis enabled
      console.log('📡 Calling SEO analysis API with LLM enabled...')
      const response = await fetch('/api/seo-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          selectedMedspa,
          generate_llm_report: true  // Enable LLM analysis
        }),
      })

      updateStepStatus('llm-analysis', 'completed')

      if (response.ok) {
        const data = await response.json()
        console.log('✅ SEO analysis completed successfully')
        console.log('🤖 LLM report included:', !!data.llm_report)
        
        // Step 5: Final Ranking
        updateStepStatus('ranking', 'active')
        await new Promise(resolve => setTimeout(resolve, 1000))
        updateStepStatus('ranking', 'completed')

        // Store results and navigate to results page
        localStorage.setItem('seoAnalysisResults', JSON.stringify(data))
        
        // Wait a moment to show completion
        setTimeout(() => {
          router.push('/results')
        }, 1500)
      } else {
        console.error('❌ SEO analysis failed')
        const errorData = await response.json()
        setError(errorData.error || 'Analysis failed')
        updateStepStatus('llm-analysis', 'error')
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
        return <div className="w-5 h-5 bg-red-500 rounded-full" />
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
                            transition={{ duration: 2, repeat: Infinity }}
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
                  className="bg-red-50 border border-red-200 rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h3 className="font-semibold text-red-800 mb-2">Analysis Failed</h3>
                  <p className="text-red-700 text-sm mb-4">{error}</p>
                  <button
                    onClick={() => {
                      setError(null)
                      startAnalysis()
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Try Again
                  </button>
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