'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  CheckCircle,
  Circle,
  MapPin,
  Mail,
  Loader2,
  ArrowLeft
} from 'lucide-react'

interface ScanningStep {
  id: string
  label: string
  completed: boolean
  url?: string
}

interface Competitor {
  id: string
  name: string
  lat: number
  lng: number
  rating?: number
  status: 'plotting' | 'plotted'
}

export default function AnalyzingPage() {
  const [selectedMedspa, setSelectedMedspa] = useState<any>(null)
  const [competitorData, setCompetitorData] = useState<any[]>([])
  const [scanningSteps, setScanningSteps] = useState<ScanningStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
  const [secondsElapsed, setSecondsElapsed] = useState(0)
  const [competitorLocations, setCompetitorLocations] = useState<Competitor[]>([])
  const [currentlyPlotting, setCurrentlyPlotting] = useState<string | null>(null)
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false)
  const [cameraFocus, setCameraFocus] = useState({ x: 50, y: 50, zoom: 1 })
  const [showAllPins, setShowAllPins] = useState(false)
  const router = useRouter()

  // Initialize scanning steps based on selected med spa
  useEffect(() => {
    const storedMedspa = localStorage.getItem('analyzingMedspa')
    if (storedMedspa) {
      const medspa = JSON.parse(storedMedspa)
      setSelectedMedspa(medspa)
      
      // Initialize scanning steps with the med spa name
      setScanningSteps([
        { id: 'competitors', label: `${medspa.name} & competitors`, completed: false },
        { id: 'google-profile', label: 'Google business profile', completed: false },
        { id: 'google-reviews', label: 'Google review sentiment', completed: false },
        { id: 'photos', label: 'Photo quality and quantity', completed: false },
        { id: 'website', label: 'Website analysis', completed: false },
        { id: 'mobile', label: 'Mobile experience', completed: false }
      ])
    } else {
      router.push('/')
      return
    }
  }, [router])

  // Timer
  useEffect(() => {
    if (!isRunning) return

    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning])

  // Simulate scanning progress
  useEffect(() => {
    if (!selectedMedspa || scanningSteps.length === 0) return
    
    if (currentStep >= scanningSteps.length) {
      setIsRunning(false)
      performActualAnalysis()
      return
    }

    const timer = setTimeout(() => {
      setScanningSteps(prev => 
        prev.map((step, index) => 
          index === currentStep ? { ...step, completed: true } : step
        )
      )
      setCurrentStep(prev => prev + 1)
    }, Math.random() * 2000 + 1500) // Random between 1.5-3.5 seconds

    return () => clearTimeout(timer)
  }, [currentStep, scanningSteps.length, selectedMedspa])

  // Perform actual analysis API call
  const performActualAnalysis = async () => {
    try {
      const response = await fetch('/api/seo-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          selectedMedspa: selectedMedspa
        }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Set competitor data and plot on map
        if (data.competitors) {
          setCompetitorData(data.competitors)
          plotCompetitorsSequentially(data.competitors)
        }
        
        // Store results for potential future use
        localStorage.setItem('seoAnalysisResults', JSON.stringify(data))
        
        setTimeout(() => {
          setIsAnalysisComplete(true)
          setTimeout(() => {
            localStorage.removeItem('analyzingMedspa')
            router.push('/results')
          }, 2000)
        }, 3000)
      } else {
        console.error('Analysis failed')
        router.push('/')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      router.push('/')
    }
  }

  // Plot competitors on map progressively
  const plotCompetitorsSequentially = (competitors: any[]) => {
    const plotNextCompetitor = (index: number) => {
      if (index >= competitors.length) {
        // All competitors plotted, zoom out to show everything
        setTimeout(() => {
          setShowAllPins(true)
          zoomOutToShowAll()
        }, 1000)
        return
      }

      const competitor = competitors[index]
      setCurrentlyPlotting(competitor.name)
      
      // Calculate pin position
      const pinLat = competitor.geometry?.location?.lat || (40.7128 + Math.random() * 0.1 - 0.05)
      const pinLng = competitor.geometry?.location?.lng || (-74.0060 + Math.random() * 0.1 - 0.05)
      const pinX = 50 + (pinLng + 74.0060) * 1000
      const pinY = 50 - (pinLat - 40.7128) * 1000
      
      // Focus camera on the pin being plotted
      setCameraFocus({ 
        x: Math.max(10, Math.min(90, pinX)), 
        y: Math.max(10, Math.min(90, pinY)), 
        zoom: 1.5 
      })
      
      setTimeout(() => {
        setCompetitorLocations(prev => [...prev, {
          id: competitor.place_id || `competitor-${index}`,
          name: competitor.name,
          lat: pinLat,
          lng: pinLng,
          rating: competitor.rating,
          status: 'plotted'
        }])
        
        setCurrentlyPlotting(null)
        
        // Plot next competitor after a delay
        setTimeout(() => plotNextCompetitor(index + 1), 1500)
      }, 1500)
    }

    plotNextCompetitor(0)
  }

  // Zoom out to show all pins
  const zoomOutToShowAll = () => {
    setCameraFocus({ x: 50, y: 50, zoom: 0.8 })
  }

  const formatTime = (seconds: number) => {
    return `${Math.max(0, 60 - seconds)} seconds remaining`
  }

  const goBack = () => {
    localStorage.removeItem('analyzingMedspa')
    router.push('/')
  }

  if (!selectedMedspa) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading analysis...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-gray-50 p-6 flex flex-col">
        {/* Back Button */}
        <motion.button
          onClick={goBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          whileHover={{ x: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to search</span>
        </motion.button>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {isAnalysisComplete ? 'Analysis Complete!' : 'Scanning...'}
          </h2>
          
          <div className="space-y-4">
            {scanningSteps.map((step, index) => (
              <motion.div
                key={step.id}
                className="flex items-center space-x-3"
                initial={{ opacity: 0.5 }}
                animate={{ 
                  opacity: step.completed ? 1 : (index === currentStep ? 1 : 0.5) 
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ 
                    scale: step.completed ? 1 : (index === currentStep ? 1.1 : 0.8) 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                </motion.div>
                
                <div className="flex-1">
                  {step.url ? (
                    <a 
                      href={step.url} 
                      className="text-sm text-blue-600 hover:text-blue-800"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {step.label}
                    </a>
                  ) : (
                    <span className={`text-sm ${
                      step.completed 
                        ? 'text-gray-900' 
                        : index === currentStep 
                        ? 'text-gray-700 font-medium' 
                        : 'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                  )}
                </div>
                
                {index === currentStep && !step.completed && (
                  <motion.div
                    className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto space-y-4">
          {/* Running Status */}
          {!isAnalysisComplete && (
            <motion.div 
              className="flex items-center space-x-2 text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="w-2 h-2 bg-blue-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span>Running...</span>
            </motion.div>
          )}
          
          {/* Timer */}
          {!isAnalysisComplete && (
            <div className="text-sm text-gray-500">
              {formatTime(secondsElapsed)}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {!isAnalysisComplete && (
              <button 
                className="w-full text-left text-sm text-gray-600 hover:text-gray-800 transition-colors"
                onClick={() => {
                  setIsRunning(false)
                  performActualAnalysis()
                }}
              >
                Can&apos;t wait for the results?
              </button>
            )}
            <button className="w-full flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 transition-colors">
              <Mail className="w-4 h-4" />
              <span>Email me report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Map Area */}
      <div className="flex-1 relative">
        {/* Search Bar */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-white rounded-full shadow-lg px-6 py-3 min-w-96">
            <input
              type="text"
              value={selectedMedspa.name}
              readOnly
              className="w-full bg-transparent text-center text-gray-700 outline-none"
            />
          </div>
        </div>

        {/* Map Container */}
        <motion.div 
          className="w-full h-full bg-gradient-to-br from-blue-100 via-blue-50 to-green-50 relative overflow-hidden"
          animate={{
            scale: cameraFocus.zoom,
            x: `${(50 - cameraFocus.x) * cameraFocus.zoom}%`,
            y: `${(50 - cameraFocus.y) * cameraFocus.zoom}%`,
          }}
          transition={{ 
            duration: 1.5, 
            ease: "easeInOut",
            type: "tween"
          }}
        >
          {/* Simplified Map Background */}
          <div className="absolute inset-0">
            {/* Water bodies */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-200 opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-200 opacity-60"></div>
            
            {/* Land areas */}
            <div className="absolute inset-0 bg-green-100 opacity-30"></div>
            
            {/* Roads/paths */}
            <div className="absolute top-1/3 left-0 w-full h-0.5 bg-gray-300 opacity-50 rotate-12"></div>
            <div className="absolute top-2/3 left-0 w-full h-0.5 bg-gray-300 opacity-50 -rotate-6"></div>
            <div className="absolute left-1/3 top-0 h-full w-0.5 bg-gray-300 opacity-50 rotate-12"></div>
          </div>

          {/* Camera Focus Spotlight */}
          <AnimatePresence>
            {currentlyPlotting && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  background: `radial-gradient(circle at ${cameraFocus.x}% ${cameraFocus.y}%, 
                    transparent 0%, 
                    transparent 15%, 
                    rgba(59, 130, 246, 0.1) 25%, 
                    rgba(59, 130, 246, 0.05) 50%)`
                }}
              />
            )}
          </AnimatePresence>

          {/* Competitor Pins */}
          <AnimatePresence>
            {competitorLocations.map((competitor, index) => {
              const pinX = 50 + (competitor.lng + 74.0060) * 1000
              const pinY = 50 - (competitor.lat - 40.7128) * 1000
              const isCurrentFocus = Math.abs(cameraFocus.x - pinX) < 5 && Math.abs(cameraFocus.y - pinY) < 5 && cameraFocus.zoom > 1.2
              
              return (
                <motion.div
                  key={competitor.id}
                  className="absolute"
                  style={{
                    left: `${pinX}%`,
                    top: `${pinY}%`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: isCurrentFocus ? 1.3 : 1, 
                    opacity: 1 
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25,
                    delay: index * 0.2 
                  }}
                >
                  <div className="relative">
                    <motion.div
                      className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer relative"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      animate={isCurrentFocus ? {
                        boxShadow: [
                          "0 0 0 0 rgba(239, 68, 68, 0.4)",
                          "0 0 0 8px rgba(239, 68, 68, 0)",
                          "0 0 0 0 rgba(239, 68, 68, 0)"
                        ]
                      } : {}}
                      transition={isCurrentFocus ? { duration: 2, repeat: Infinity } : {}}
                    >
                      <MapPin className="w-4 h-4 text-white" />
                    </motion.div>
                    
                    {/* Competitor label */}
                    <motion.div
                      className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium shadow-md whitespace-nowrap"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: isCurrentFocus ? 1 : 0.8, 
                        y: 0,
                        scale: isCurrentFocus ? 1.1 : 1
                      }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="text-center">
                        <div className="font-medium">Competitor</div>
                        {competitor.rating && (
                          <div className="text-yellow-500">★ {competitor.rating}</div>
                        )}
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-white"></div>
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Main business location (center) */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="relative">
              <motion.div
                className="w-10 h-10 bg-black rounded-full flex items-center justify-center shadow-lg"
                animate={{ 
                  boxShadow: [
                    "0 0 0 0 rgba(0, 0, 0, 0.3)",
                    "0 0 0 10px rgba(0, 0, 0, 0)",
                    "0 0 0 0 rgba(0, 0, 0, 0)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </motion.div>
            </div>
          </motion.div>

          {/* Currently plotting indicator */}
          <AnimatePresence>
            {currentlyPlotting && (
              <motion.div
                className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 flex items-center space-x-2"
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-2 h-2 bg-red-500 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-sm font-medium">Plotting {currentlyPlotting}</span>
              </motion.div>
            )}
            
            {showAllPins && !isAnalysisComplete && (
              <motion.div
                className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 flex items-center space-x-2"
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-sm font-medium">Viewing all competitors</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analysis Complete Notification */}
          <AnimatePresence>
            {isAnalysisComplete && (
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-8 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analysis Complete!</h3>
                <p className="text-gray-600 mb-4">Redirecting to your results...</p>
                <motion.div
                  className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google Maps Attribution */}
          <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-white bg-opacity-70 px-2 py-1 rounded">
            ©2025 Google
          </div>
        </motion.div>
      </div>
    </div>
  )
} 