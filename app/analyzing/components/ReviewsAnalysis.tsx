'use client'

import { motion } from 'framer-motion'
import { Star, MessageSquare } from 'lucide-react'
import { MedSpa, Review } from './types'

interface ReviewsAnalysisProps {
  selectedMedspa: MedSpa | null
  reviews: Review[]
}

export default function ReviewsAnalysis({ selectedMedspa, reviews }: ReviewsAnalysisProps) {
  // Add debugging logs
  console.log('🔍 ReviewsAnalysis Component Debug:', {
    selectedMedspaName: selectedMedspa?.name,
    selectedMedspaRating: selectedMedspa?.rating,
    selectedMedspaReviewCount: selectedMedspa?.user_ratings_total,
    reviewsArrayLength: reviews.length,
    reviewsArray: reviews,
    selectedMedspaFull: selectedMedspa
  })

  const calculateSentiment = (reviews: Review[]) => {
    if (reviews.length === 0) return 0
    const positiveReviews = reviews.filter(review => review.rating >= 4).length
    return Math.round((positiveReviews / reviews.length) * 100)
  }

  const getAverageRating = (reviews: Review[]) => {
    if (reviews.length === 0) return selectedMedspa?.rating || 0
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    return (totalRating / reviews.length).toFixed(1)
  }

  return (
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
              <div className="text-3xl font-bold text-gray-900">
                {getAverageRating(reviews)}
              </div>
              <div className="text-sm text-gray-500">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {selectedMedspa?.user_ratings_total || reviews.length}
              </div>
              <div className="text-sm text-gray-500">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {calculateSentiment(reviews)}%
              </div>
              <div className="text-sm text-gray-500">Positive Sentiment</div>
            </div>
          </div>
        </div>

        {/* Reviews Content */}
        {reviews.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Reviews ({reviews.length} available)
            </h3>
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg p-4 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-gray-600">
                      {review.author_name ? review.author_name[0].toUpperCase() : '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900 truncate">
                        {review.author_name || 'Anonymous'}
                      </span>
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
                      <span className="text-xs text-gray-500">
                        {review.relative_time_description || 'Recently'}
                      </span>
                    </div>
                    {review.text && (
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {review.text}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Reviews Available</h3>
            <p className="text-gray-500 mb-6">
              No reviews were found for {selectedMedspa?.name}. This could mean:
            </p>
            <ul className="text-sm text-gray-500 space-y-2 max-w-md mx-auto">
              <li>• The business is new and hasn&apos;t received reviews yet</li>
              <li>• Reviews are not publicly accessible through the API</li>
              <li>• The Google Business Profile may need optimization</li>
            </ul>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <h4 className="font-medium text-blue-800 mb-2">💡 Recommendation</h4>
              <p className="text-sm text-blue-700">
                Encourage customers to leave Google reviews to improve online visibility and credibility.
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
} 