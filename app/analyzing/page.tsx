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
  Clock,
  AlertTriangle
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
  const [timeRemaining, setTimeRemaining] = useState(15) // Total estimated time (reduced for testing)
  const [selectedMedspa, setSelectedMedspa] = useState<any>(null)
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showBusinessProfile, setShowBusinessProfile] = useState(false)
  const [allStepsCompleted, setAllStepsCompleted] = useState(false)
  const router = useRouter()

  const analysisSteps: AnalysisStep[] = [
    {
      id: 'medspa-competitors',
      title: `${selectedMedspa?.name || 'Med spa'} & competitors`,
      status: 'pending',
      duration: 2
    },
    {
      id: 'google-profile',
      title: 'Google business profile',
      status: 'pending',
      duration: 3
    },
    {
      id: 'review-sentiment',
      title: 'Google review sentiment',
      status: 'pending',
      duration: 2
    },
    {
      id: 'photo-quality',
      title: 'Photo quality and quantity',
      status: 'pending',
      duration: 2
    },
    {
      id: 'website-analysis',
      title: selectedMedspa?.website || 'Website analysis',
      status: 'pending',
      duration: 2
    },
    {
      id: 'mobile-experience',
      title: 'Mobile experience',
      status: 'pending',
      duration: 2
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
      for (let i = 0; i < analysisSteps.length; i++) {
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
            }, (j + 1) * 1000) // Add each competitor after 1 second
          }
        }

        // If it's the Google business profile step, show the business profile card
        if (i === 1) {
          setTimeout(() => {
            setShowBusinessProfile(true)
          }, 1000) // Show business profile after 1 second
        }

        // Wait for step duration
        await new Promise(resolve => setTimeout(resolve, analysisSteps[i].duration * 1000))

        // Mark step as completed
        setSteps(prev => prev.map((step, index) => ({
          ...step,
          status: index <= i ? 'completed' : 'pending'
        })))

        // Hide business profile when step is completed
        if (i === 1) {
          setShowBusinessProfile(false)
        }
      }

      // All steps completed - show large business profile instead of proceeding to API
      console.log('All steps completed! Setting allStepsCompleted to true')
      setAllStepsCompleted(true)
      return

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

          {/* Small Business Profile Card (during scanning) */}
          <AnimatePresence>
            {showBusinessProfile && selectedMedspa && !allStepsCompleted && (
              <motion.div
                className="absolute bottom-4 left-4 z-20"
                initial={{ opacity: 0, y: 100, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 100, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-80">
                  <div className="flex space-x-3">
                    {/* Business Image */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-gray-600" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Business Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                        {selectedMedspa.name}
                      </h3>
                      
                      {/* Rating */}
                      <div className="flex items-center space-x-1 mb-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= Math.floor(selectedMedspa.rating || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600 ml-1">
                          {selectedMedspa.rating || '4.7'}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          Business
                        </span>
                        <span className="text-xs text-gray-600">•</span>
                        <span className="text-xs text-gray-600">$$$</span>
                      </div>
                      
                      {/* Business Description (only show if available) */}
                      {selectedMedspa.editorial_summary?.overview || selectedMedspa.description ? (
                        <div className="text-xs text-gray-600 mb-1">
                          {selectedMedspa.editorial_summary?.overview || selectedMedspa.description}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  
                  {/* Map Preview */}
                  <div className="mt-3 h-20 bg-gray-100 rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                      {/* Simulated street layout */}
                      <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-2 left-2 right-2 h-px bg-gray-300"></div>
                        <div className="absolute top-8 left-2 right-2 h-px bg-gray-300"></div>
                        <div className="absolute top-2 left-8 bottom-2 w-px bg-gray-300"></div>
                        <div className="absolute top-2 right-8 bottom-2 w-px bg-gray-300"></div>
                      </div>
                      
                      {/* Pin */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-red-500 text-white p-1 rounded-full shadow-sm">
                          <MapPin className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Map Container */}
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden">
            {allStepsCompleted && selectedMedspa ? (
              /* Large Business Profile View */
              <div className="w-full h-full bg-white flex items-center justify-center p-8">
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 w-full max-w-2xl">
                  <div className="flex space-x-6">
                    {/* Business Image */}
                    <div className="flex-shrink-0">
                      <div className="w-48 h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <div className="text-center">
                            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <div className="text-xs text-gray-500">Business Photo</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Business Details */}
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {selectedMedspa.name}
                      </h2>
                      
                      {/* Rating */}
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= Math.floor(selectedMedspa.rating || 4.5)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-700 font-medium">
                          {selectedMedspa.rating || '4.5'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {selectedMedspa.types?.[0]?.replace(/_/g, ' ') || 'Business'}
                        </span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-600">$$$</span>
                      </div>
                      
                      {/* Warning/Status */}
                      <div className="flex items-center space-x-2 mb-4">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-orange-600">
                          No description found
                        </span>
                      </div>
                      
                      {/* Business Description (if available) */}
                      {selectedMedspa.editorial_summary?.overview || selectedMedspa.description ? (
                        <div className="text-sm text-gray-600 mb-4">
                          {selectedMedspa.editorial_summary?.overview || selectedMedspa.description}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  
                  {/* Large Map Preview */}
                  <div className="mt-6 h-40 bg-gray-100 rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                      {/* Simulated street layout */}
                      <div className="absolute inset-0 opacity-40">
                        <div className="absolute top-4 left-4 right-4 h-px bg-gray-400"></div>
                        <div className="absolute top-12 left-4 right-4 h-px bg-gray-400"></div>
                        <div className="absolute top-20 left-4 right-4 h-px bg-gray-400"></div>
                        <div className="absolute top-28 left-4 right-4 h-px bg-gray-400"></div>
                        <div className="absolute top-4 left-12 bottom-4 w-px bg-gray-400"></div>
                        <div className="absolute top-4 left-24 bottom-4 w-px bg-gray-400"></div>
                        <div className="absolute top-4 right-12 bottom-4 w-px bg-gray-400"></div>
                        <div className="absolute top-4 right-24 bottom-4 w-px bg-gray-400"></div>
                      </div>
                      
                      {/* Street labels */}
                      <div className="absolute top-2 left-16 text-xs text-gray-600 font-medium">41st St</div>
                      <div className="absolute top-14 left-16 text-xs text-gray-600 font-medium">40th St</div>
                      <div className="absolute top-26 left-16 text-xs text-gray-600 font-medium">39th St</div>
                      <div className="absolute top-6 left-2 text-xs text-gray-600 font-medium transform -rotate-90 origin-left">9th Ave</div>
                      <div className="absolute top-6 left-20 text-xs text-gray-600 font-medium transform -rotate-90 origin-left">8th Ave</div>
                      
                      {/* Pin */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-red-500 text-white p-2 rounded-full shadow-lg">
                          <MapPin className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Regular Map View During Scanning */
              <>
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
              </>
            )}
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