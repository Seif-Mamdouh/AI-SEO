'use client'

import MapView from './MapView'
import BusinessProfileCard from './BusinessProfileCard'
import ReviewsAnalysis from './ReviewsAnalysis'
import PhotoAnalysis from './PhotoAnalysis'
import WebsiteAnalysis from './WebsiteAnalysis'
import SearchBar from './SearchBar'
import { MedSpa, Competitor, Review } from './types'

interface AnalysisStepContentProps {
  currentStep: number
  selectedMedspa: MedSpa | null
  competitors: Competitor[]
  reviews: Review[]
}

export default function AnalysisStepContent({ 
  currentStep, 
  selectedMedspa, 
  competitors, 
  reviews 
}: AnalysisStepContentProps) {
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <MapView selectedMedspa={selectedMedspa} competitors={competitors} />
      case 1:
        return <BusinessProfileCard selectedMedspa={selectedMedspa} />
      case 2:
        return <ReviewsAnalysis selectedMedspa={selectedMedspa} reviews={reviews} />
      case 3:
        return <PhotoAnalysis selectedMedspa={selectedMedspa} />
      case 4:
        return <WebsiteAnalysis selectedMedspa={selectedMedspa} />
      default:
        return <MapView selectedMedspa={selectedMedspa} competitors={competitors} />
    }
  }

  return (
    <div className="flex-1 relative">
      <SearchBar selectedMedspa={selectedMedspa} />
      
      {/* Dynamic Content Container */}
      <div className="w-full h-full relative overflow-hidden">
        {renderStepContent()}
      </div>
    </div>
  )
} 