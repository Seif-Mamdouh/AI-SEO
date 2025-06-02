'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  AnalysisProgressSidebar,
  AnalysisStepContent,
  AnalysisStep,
  Competitor,
  Review,
  MedSpa
} from './components'

export default function AnalyzingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(8) // Reduced time since API runs in parallel with animations
  const [selectedMedspa, setSelectedMedspa] = useState<MedSpa | null>(null)
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
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
      const parsedMedspa = JSON.parse(storedMedspa)
      console.log('🏪 Med Spa Data from localStorage:', {
        name: parsedMedspa.name,
        hasPhotos: !!parsedMedspa.photos,
        photosLength: parsedMedspa.photos?.length || 0,
        photos: parsedMedspa.photos,
        fullData: parsedMedspa
      })
      setSelectedMedspa(parsedMedspa)
    } else {
      console.log('❌ No med spa data found in localStorage')
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
      // Start the API call immediately in parallel with visual animations
      const apiCallPromise = fetch('/api/seo-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          selectedMedspa: selectedMedspaData
        }),
      })

      // Start visual animations in parallel
      const visualAnimationsPromise = (async () => {
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

          // If it's the review sentiment step, set reviews data
          if (i === 2) {
            setTimeout(() => {
              // Extract reviews from selectedMedspa data if available
              if (selectedMedspaData.reviews && selectedMedspaData.reviews.length > 0) {
                setReviews(selectedMedspaData.reviews)
                console.log('✅ Using real reviews data:', selectedMedspaData.reviews.length)
              }
            }, 500) // Set reviews after 0.5 seconds
          }

          // Wait for step duration
          await new Promise(resolve => setTimeout(resolve, analysisSteps[i].duration * 1000))

          // Mark step as completed
          setSteps(prev => prev.map((step, index) => ({
            ...step,
            status: index <= i ? 'completed' : 'pending'
          })))
        }

        // All visual steps completed
        console.log('All visual steps completed! Generating report...')
        setAllStepsCompleted(true)
      })()

      // Wait for both API call and visual animations to complete
      const [apiResult] = await Promise.all([apiCallPromise, visualAnimationsPromise])
      
      console.log('✅ Analysis complete!')
      
      if (apiResult.ok) {
        const data = await apiResult.json()
        console.log('📊 Analysis API Response:', {
          hasSelectedMedspa: !!data.selectedMedspa,
          selectedMedspaPhotos: data.selectedMedspa?.photos?.length || 0,
          selectedMedspaData: data.selectedMedspa,
          fullResponse: data
        })
        
        // Store the results including reviews data
        localStorage.setItem('analysisResults', JSON.stringify(data))
        
        // Update selectedMedspa with reviews data for the visual components
        if (data.selectedMedspa?.reviews) {
          const updatedMedspaData = {
            ...selectedMedspaData,
            reviews: data.selectedMedspa.reviews
          }
          localStorage.setItem('analyzingMedspa', JSON.stringify(updatedMedspaData))
          setSelectedMedspa(updatedMedspaData)
          setReviews(data.selectedMedspa.reviews)
          console.log('✅ Updated med spa data with reviews:', data.selectedMedspa.reviews.length)
        }
        
        // Redirect to results after a short delay
        setTimeout(() => {
          router.push('/results')
        }, 2000)
      } else {
        console.error('❌ Analysis failed')
        // Handle error - maybe redirect to error page or show error message
      }
    } catch (error) {
      console.error('Analysis error:', error)
      router.push('/')
    }
  }

  const handleNavigateToResults = () => {
    router.push('/results')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <AnalysisProgressSidebar
          steps={steps}
          timeRemaining={timeRemaining}
          allStepsCompleted={allStepsCompleted}
          onNavigateToResults={handleNavigateToResults}
        />

        <AnalysisStepContent
          currentStep={currentStep}
          selectedMedspa={selectedMedspa}
          competitors={competitors}
          reviews={reviews}
        />
      </div>
    </div>
  )
} 