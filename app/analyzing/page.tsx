'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Check,
  Loader2,
  MapPin,
  Globe,
  Star,
  Search,
  Mail,
  Clock
} from 'lucide-react'

interface AnalysisStep {
  id: string
  title: string
  status: 'pending' | 'active' | 'completed'
  duration: number
}

interface Competitor {
  id: string
  name: string
  lat: number
  lng: number
  rating?: number
  address?: string
}

export default function AnalyzingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(45) // Total estimated time
  const [selectedMedspa, setSelectedMedspa] = useState<any>(null)
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [showEmailModal, setShowEmailModal] = useState(false)
  const router = useRouter()

  const analysisSteps: AnalysisStep[] = [
    {
      id: 'medspa-competitors',
      title: `${selectedMedspa?.name || 'Med spa'} & competitors`,
      status: 'pending',
      duration: 5
    },
    {
      id: 'google-profile',
      title: 'Google business profile',
      status: 'pending',
      duration: 8
    },
    {
      id: 'review-sentiment',
      title: 'Google review sentiment',
      status: 'pending',
      duration: 12
    },
    {
      id: 'photo-quality',
      title: 'Photo quality and quantity',
      status: 'pending',
      duration: 8
    },
    {
      id: 'website-analysis',
      title: selectedMedspa?.website || 'Website analysis',
      status: 'pending',
      duration: 8
    },
    {
      id: 'mobile-experience',
      title: 'Mobile experience',
      status: 'pending',
      duration: 4
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

  // Simulate adding competitors as they're discovered
  const addCompetitor = (competitor: Competitor) => {
    setCompetitors(prev => [...prev, competitor])
  }

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

        // If it's the competitors step, simulate adding competitors
        if (i === 0) {
          // Simulate discovering competitors over time
          const mockCompetitors = [
            { id: '1', name: 'Competitor 1', lat: selectedMedspaData.geometry?.location?.lat + 0.01 || 40.7128, lng: selectedMedspaData.geometry?.location?.lng + 0.01 || -74.0060, rating: 4.2 },
            { id: '2', name: 'Competitor 2', lat: selectedMedspaData.geometry?.location?.lat - 0.01 || 40.7028, lng: selectedMedspaData.geometry?.location?.lng + 0.02 || -74.0040, rating: 4.5 },
            { id: '3', name: 'Competitor 3', lat: selectedMedspaData.geometry?.location?.lat + 0.02 || 40.7228, lng: selectedMedspaData.geometry?.location?.lng - 0.01 || -74.0080, rating: 3.9 }
          ]

          for (let j = 0; j < mockCompetitors.length; j++) {
            setTimeout(() => {
              addCompetitor(mockCompetitors[j])
            }, (j + 1) * 2000) // Add each competitor after 2 seconds
          }
        }

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
    return `${secs} second${secs !== 1 ? 's' : ''}`
  }

  const handleEmailReport = () => {
    setShowEmailModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Left Sidebar - Analysis Progress */}
        <div className="w-80 bg-white shadow-sm border-r border-gray-200 flex flex-col">
          <div className="p-6 flex-1">
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
          </div>

          {/* Bottom Status and Actions */}
          <div className="p-6 border-t border-gray-200">
            {/* Status Bar */}
            <motion.div 
              className="p-3 bg-gray-50 rounded-lg mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running... {formatTime(timeRemaining)} remaining</span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => router.push('/results')}
                className="w-full text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Can&apos;t wait for the results?
              </button>
              <button
                onClick={handleEmailReport}
                className="w-full text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Email me report
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Map */}
        <div className="flex-1 relative">
          {/* Search Bar */}
          <div className="absolute top-4 left-4 right-4 z-10">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="flex items-center space-x-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={selectedMedspa?.name || ''}
                  readOnly
                  className="flex-1 text-sm text-gray-900 bg-transparent border-none outline-none"
                  placeholder="Search location..."
                />
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden">
            {/* Simulated Map Background */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" className="text-blue-200">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Map Areas (simulated) */}
            <div className="absolute inset-0">
              {/* Blue areas (water) */}
              <div className="absolute top-0 left-0 w-1/3 h-full bg-blue-200 opacity-60 transform -skew-x-12"></div>
              <div className="absolute bottom-0 right-0 w-1/4 h-2/3 bg-blue-200 opacity-60 transform skew-y-12"></div>
              
              {/* Green areas (parks) */}
              <div className="absolute top-1/4 left-1/3 w-16 h-20 bg-green-200 opacity-80 rounded-lg transform rotate-12"></div>
              <div className="absolute top-1/2 right-1/4 w-20 h-16 bg-green-200 opacity-80 rounded-lg transform -rotate-45"></div>
              <div className="absolute bottom-1/3 left-1/2 w-24 h-12 bg-green-200 opacity-80 rounded-lg"></div>
              
              {/* More scattered green areas */}
              <div className="absolute top-3/4 right-1/3 w-12 h-16 bg-green-200 opacity-80 rounded-lg transform rotate-45"></div>
              <div className="absolute top-1/6 right-1/2 w-14 h-14 bg-green-200 opacity-80 rounded-lg transform -rotate-12"></div>
            </div>

            {/* Main Med Spa Pin */}
            {selectedMedspa && (
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
                initial={{ scale: 0, y: -50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="bg-black text-white p-2 rounded-full shadow-lg">
                  <MapPin className="w-6 h-6" />
                </div>
              </motion.div>
            )}

            {/* Competitor Pins */}
            <AnimatePresence>
              {competitors.map((competitor, index) => (
                <motion.div
                  key={competitor.id}
                  className="absolute z-10"
                  style={{
                    left: `${50 + (competitor.lng - (selectedMedspa?.geometry?.location?.lng || -74.0060)) * 1000}%`,
                    top: `${50 - (competitor.lat - (selectedMedspa?.geometry?.location?.lat || 40.7128)) * 1000}%`
                  }}
                  initial={{ scale: 0, y: -50 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0, y: -50 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20,
                    delay: index * 0.2 
                  }}
                >
                  <div className="relative group">
                    <div className="bg-red-500 text-white p-2 rounded-full shadow-lg cursor-pointer transform hover:scale-110 transition-transform">
                      <MapPin className="w-5 h-5" />
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Competitor
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Google Maps Attribution */}
            <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-white px-2 py-1 rounded">
              Map data ©2025 Google
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Email Report
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                We&apos;ll send you the complete analysis report once it&apos;s ready.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowEmailModal(false)
                      // Handle email submission
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send Report
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 