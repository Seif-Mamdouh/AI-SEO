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
  const [timeRemaining, setTimeRemaining] = useState(13) // Total estimated time (reduced after removing mobile step)
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

          // Add competitors with proper timing within the step duration
          for (let j = 0; j < mockCompetitors.length; j++) {
            setTimeout(() => {
              addCompetitor(mockCompetitors[j])
              // Mark all competitors as added when the last one is added
              if (j === mockCompetitors.length - 1) {
                console.log('All competitors added to map')
              }
            }, (j + 1) * 500) // Add each competitor after 0.5 seconds (last one at 1.5s)
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

        {/* Right Side - Dynamic Content Based on Current Step */}
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

          {/* Dynamic Content Container */}
          <div className="w-full h-full relative overflow-hidden">
            {/* Step 0: Med spa & competitors - Show Map */}
            {currentStep === 0 && (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative">
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
            )}

            {/* Step 1: Google business profile - Show Business Profile Card */}
            {currentStep === 1 && selectedMedspa && (
              <motion.div
                className="w-full h-full bg-white flex items-center justify-center p-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
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
                      
                      {/* Pin */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-red-500 text-white p-2 rounded-full shadow-lg">
                          <MapPin className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Google review sentiment - Show Reviews */}
            {currentStep === 2 && (
              <motion.div
                className="w-full h-full bg-gray-50 p-8 overflow-y-auto"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Google Reviews Analysis</h2>
                  
                  {/* Review Stats */}
                  <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">4.3</div>
                        <div className="text-sm text-gray-500">Average Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">127</div>
                        <div className="text-sm text-gray-500">Total Reviews</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">76%</div>
                        <div className="text-sm text-gray-500">Positive Sentiment</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Reviews */}
                  <div className="space-y-4">
                    {[
                      { name: "Sarah M.", rating: 5, text: "Amazing service! The staff was incredibly professional and the results exceeded my expectations.", time: "2 days ago" },
                      { name: "Mike R.", rating: 4, text: "Great experience overall. Clean facility and knowledgeable staff. Will definitely come back.", time: "1 week ago" },
                      { name: "Emily K.", rating: 5, text: "Best med spa in the area! Love the treatments and the atmosphere is so relaxing.", time: "2 weeks ago" },
                      { name: "David L.", rating: 3, text: "Good service but the wait time was longer than expected. Staff was friendly though.", time: "3 weeks ago" }
                    ].map((review, index) => (
                      <motion.div
                        key={index}
                        className="bg-white rounded-lg p-4 shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">{review.name[0]}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-900">{review.name}</span>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-3 h-3 ${
                                      star <= review.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">{review.time}</span>
                            </div>
                            <p className="text-sm text-gray-600">{review.text}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Photo quality and quantity - Show Photos */}
            {currentStep === 3 && (
              <motion.div
                className="w-full h-full bg-gray-50 p-8 overflow-y-auto"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Photo Analysis</h2>
                  
                  {/* Photo Stats */}
                  <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">23</div>
                        <div className="text-sm text-gray-500">Total Photos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600">C+</div>
                        <div className="text-sm text-gray-500">Quality Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-600">Low</div>
                        <div className="text-sm text-gray-500">Quantity Rating</div>
                      </div>
                    </div>
                  </div>

                  {/* Photo Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((photo, index) => (
                      <motion.div
                        key={index}
                        className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                          <div className="text-center">
                            <MapPin className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                            <div className="text-xs text-gray-600">Photo {photo}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Recommendations */}
                  <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-medium text-yellow-800 mb-2">Recommendations</h3>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Add more high-quality exterior photos</li>
                      <li>• Include photos of treatment rooms</li>
                      <li>• Add before/after photos (with consent)</li>
                      <li>• Include staff photos for personal touch</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Website analysis - Show Website Preview */}
            {currentStep === 4 && (
              <motion.div
                className="w-full h-full bg-gray-50 p-8 overflow-y-auto"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Website Analysis</h2>
                  
                  {/* Website Stats */}
                  <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                    <div className="grid grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-600">2.3s</div>
                        <div className="text-sm text-gray-500">Load Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600">68</div>
                        <div className="text-sm text-gray-500">SEO Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">92</div>
                        <div className="text-sm text-gray-500">Mobile Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-600">B-</div>
                        <div className="text-sm text-gray-500">Overall Grade</div>
                      </div>
                    </div>
                  </div>

                  {/* Website Screenshot Mockup */}
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="bg-white rounded px-3 py-1 text-xs text-gray-600 flex-1">
                        {selectedMedspa?.website || 'helloskinfmedspa.com'}
                      </div>
                    </div>
                    <div className="h-96 bg-gradient-to-br from-blue-50 to-purple-50 p-8">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-800 mb-4">{selectedMedspa?.name}</div>
                        <div className="text-lg text-gray-600 mb-8">Premium Medical Spa Services</div>
                        
                        {/* Mock Navigation */}
                        <div className="flex justify-center space-x-8 mb-8">
                          <div className="text-sm text-gray-700">Services</div>
                          <div className="text-sm text-gray-700">About</div>
                          <div className="text-sm text-gray-700">Contact</div>
                          <div className="text-sm text-gray-700">Book Now</div>
                        </div>
                        
                        {/* Mock Content */}
                        <div className="grid grid-cols-3 gap-4">
                          {[1, 2, 3].map((item) => (
                            <div key={item} className="bg-white rounded-lg p-4 shadow-sm">
                              <div className="w-full h-20 bg-gray-200 rounded mb-3"></div>
                              <div className="h-4 bg-gray-200 rounded mb-2"></div>
                              <div className="h-3 bg-gray-100 rounded"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Issues */}
                  <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-medium text-red-800 mb-2">Issues Found</h3>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Slow page load speed (2.3s)</li>
                      <li>• Missing meta descriptions on 3 pages</li>
                      <li>• No Google Analytics tracking</li>
                      <li>• Missing contact schema markup</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
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