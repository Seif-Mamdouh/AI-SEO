'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Search, 
  MapPin, 
  Globe, 
  Zap, 
  TrendingUp, 
  CheckCircle,
  Loader2,
  Clock
} from 'lucide-react'

interface AnalysisStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  status: 'pending' | 'active' | 'completed' | 'error'
  duration?: number
}

export default function AnalyzingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [selectedMedspa, setSelectedMedspa] = useState<any>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const analysisSteps: AnalysisStep[] = [
    {
      id: 'medspa-details',
      title: 'Getting Med Spa Details',
      description: 'Fetching location and business information',
      icon: <Search className="w-5 h-5" />,
      status: 'pending',
      duration: 3
    },
    {
      id: 'find-competitors',
      title: 'Finding Competitors',
      description: 'Scanning 10-mile radius for competing med spas',
      icon: <MapPin className="w-5 h-5" />,
      status: 'pending',
      duration: 5
    },
    {
      id: 'competitor-details',
      title: 'Analyzing Competitors',
      description: 'Gathering detailed competitor information',
      icon: <Globe className="w-5 h-5" />,
      status: 'pending',
      duration: 8
    },
    {
      id: 'pagespeed-analysis',
      title: 'Running PageSpeed Tests',
      description: 'Testing website performance and SEO scores',
      icon: <Zap className="w-5 h-5" />,
      status: 'pending',
      duration: 60
    },
    {
      id: 'calculate-rankings',
      title: 'Calculating Rankings',
      description: 'Computing competitive analysis and recommendations',
      icon: <TrendingUp className="w-5 h-5" />,
      status: 'pending',
      duration: 3
    }
  ]

  const [steps, setSteps] = useState(analysisSteps)

  useEffect(() => {
    // Get selected med spa from localStorage
    const storedMedspa = localStorage.getItem('analyzingMedspa')
    if (storedMedspa) {
      setSelectedMedspa(JSON.parse(storedMedspa))
    } else {
      router.push('/')
      return
    }

    // Start the analysis process
    startAnalysis()
  }, [router])

  // Timer for elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const startAnalysis = async () => {
    const selectedMedspaData = JSON.parse(localStorage.getItem('analyzingMedspa') || '{}')
    
    try {
      // Simulate the analysis process with realistic timing
      for (let i = 0; i < steps.length; i++) {
        // Update current step to active
        setCurrentStep(i)
        setSteps(prev => prev.map((step, index) => ({
          ...step,
          status: index === i ? 'active' : index < i ? 'completed' : 'pending'
        })))

        // Simulate step duration with progress updates
        const stepDuration = steps[i].duration! * 1000
        const progressInterval = stepDuration / 20 // 20 updates per step
        
        for (let j = 0; j <= 20; j++) {
          await new Promise(resolve => setTimeout(resolve, progressInterval))
          const stepProgress = (i + (j / 20)) / steps.length * 100
          setProgress(stepProgress)
        }

        // Mark step as completed
        setSteps(prev => prev.map((step, index) => ({
          ...step,
          status: index === i ? 'completed' : index < i ? 'completed' : 'pending'
        })))
      }

      // Start actual API call after visual simulation
      const response = await fetch('/api/seo-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          selectedMedspa: selectedMedspaData
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Store results and navigate to results page
        localStorage.setItem('seoAnalysisResults', JSON.stringify(data))
        localStorage.removeItem('analyzingMedspa')
        
        setProgress(100)
        
        // Brief delay before navigation
        setTimeout(() => {
          router.push('/results')
        }, 1000)
      } else {
        console.error('Analysis failed')
        // Handle error - could redirect back or show error state
        router.push('/')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      router.push('/')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50'
      case 'active':
        return 'text-blue-600 bg-blue-50'
      case 'error':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-400 bg-gray-50'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8 text-white" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Analyzing SEO Performance
          </h1>
          
          {selectedMedspa && (
            <p className="text-lg text-gray-600 mb-2">
              {selectedMedspa.name}
            </p>
          )}
          
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Elapsed: {formatTime(elapsedTime)}</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div>
              Progress: {Math.round(progress)}%
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Analysis Steps */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`flex items-center p-6 rounded-2xl border transition-all duration-300 ${
                step.status === 'active' 
                  ? 'bg-blue-50 border-blue-200 shadow-md' 
                  : step.status === 'completed'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-white border-gray-200'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-4 flex-1">
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${getStepStatusColor(step.status)}`}
                  initial={{ scale: 0.8 }}
                  animate={{ 
                    scale: step.status === 'active' ? [1, 1.1, 1] : 1,
                    rotate: step.status === 'active' ? [0, 360] : 0
                  }}
                  transition={{ 
                    scale: { duration: 1, repeat: step.status === 'active' ? Infinity : 0 },
                    rotate: { duration: 2, repeat: step.status === 'active' ? Infinity : 0, ease: "linear" }
                  }}
                >
                  {step.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.icon
                  )}
                </motion.div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {step.status === 'active' && (
                  <motion.div
                    className="flex space-x-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-blue-500 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                      />
                    ))}
                  </motion.div>
                )}
                
                {step.status === 'completed' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Info */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              What we&apos;re analyzing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <div className="font-medium text-gray-900">Competitors</div>
                <div>Med spas within 10 miles</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Performance</div>
                <div>PageSpeed & Core Web Vitals</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">SEO Factors</div>
                <div>Technical SEO & Rankings</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 