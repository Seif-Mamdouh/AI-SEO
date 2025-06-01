'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Check,
  Loader2,
  MapPin,
  Globe,
  Zap,
  TrendingUp,
  Search
} from 'lucide-react'

interface AnalysisStep {
  id: string
  title: string
  status: 'pending' | 'active' | 'completed'
  duration: number
}

export default function AnalyzingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(79) // Total estimated time
  const [selectedMedspa, setSelectedMedspa] = useState<any>(null)
  const router = useRouter()

  const analysisSteps: AnalysisStep[] = [
    {
      id: 'medspa-details',
      title: 'Med spa details & location',
      status: 'pending',
      duration: 3
    },
    {
      id: 'competitors',
      title: 'Local competitors within 10 miles',
      status: 'pending',
      duration: 8
    },
    {
      id: 'websites',
      title: 'Competitor website analysis',
      status: 'pending',
      duration: 12
    },
    {
      id: 'pagespeed',
      title: 'PageSpeed & performance testing',
      status: 'pending',
      duration: 45
    },
    {
      id: 'seo-scores',
      title: 'SEO ranking calculations',
      status: 'pending',
      duration: 8
    },
    {
      id: 'recommendations',
      title: 'Generating recommendations',
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

  // Timer for time remaining
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeRemaining])

  const startAnalysis = async () => {
    const selectedMedspaData = JSON.parse(localStorage.getItem('analyzingMedspa') || '{}')
    
    try {
      // Simulate the analysis process step by step
      for (let i = 0; i < steps.length; i++) {
        // Set current step as active
        setSteps(prev => prev.map((step, index) => ({
          ...step,
          status: index === i ? 'active' : index < i ? 'completed' : 'pending'
        })))
        setCurrentStep(i)

        // Wait for step duration
        await new Promise(resolve => setTimeout(resolve, steps[i].duration * 1000))

        // Mark step as completed
        setSteps(prev => prev.map((step, index) => ({
          ...step,
          status: index <= i ? 'completed' : 'pending'
        })))
      }

      // Start actual API call
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
        
        setTimeout(() => {
          router.push('/results')
        }, 1000)
      } else {
        console.error('Analysis failed')
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
    return `${mins} minute${mins !== 1 ? 's' : ''} ${secs} second${secs !== 1 ? 's' : ''}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Analysis Progress */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              Scanning...
            </h1>
            
            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex-shrink-0">
                    {step.status === 'completed' ? (
                      <motion.div
                        className="w-5 h-5 bg-black rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    ) : step.status === 'active' ? (
                      <motion.div
                        className="w-5 h-5 flex items-center justify-center"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="w-4 h-4 text-blue-600" />
                      </motion.div>
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                    )}
                  </div>
                  
                  <span className={`text-sm ${
                    step.status === 'completed' 
                      ? 'text-gray-900 font-medium' 
                      : step.status === 'active'
                      ? 'text-blue-600 font-medium'
                      : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Status Bar */}
            <motion.div 
              className="mt-8 p-4 bg-gray-50 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running... {formatTime(timeRemaining)} remaining</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Med Spa Info & Preview */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            {selectedMedspa ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Analyzing: {selectedMedspa.name}
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Location</div>
                      <div className="text-sm text-gray-600">
                        {selectedMedspa.formatted_address}
                      </div>
                    </div>
                  </div>

                  {selectedMedspa.rating && (
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                        <span className="text-yellow-500 text-sm">★</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Current Rating</div>
                        <div className="text-sm text-gray-600">
                          {selectedMedspa.rating} stars ({selectedMedspa.user_ratings_total || 0} reviews)
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedMedspa.website && (
                    <div className="flex items-start space-x-3">
                      <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Website</div>
                        <div className="text-sm text-blue-600 hover:text-blue-800">
                          <a href={selectedMedspa.website} target="_blank" rel="noopener noreferrer">
                            {selectedMedspa.website}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">
                    What we&apos;re checking:
                  </h3>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Competitors within 10-mile radius</li>
                    <li>• Website performance & speed</li>
                    <li>• SEO technical factors</li>
                    <li>• Local search rankings</li>
                    <li>• Competitive positioning</li>
                  </ul>
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading med spa details...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 