'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { MedSpa, Review } from './types'

interface ReviewsAnalysisProps {
  selectedMedspa: MedSpa | null
  reviews: Review[]
}

export default function ReviewsAnalysis({ selectedMedspa, reviews }: ReviewsAnalysisProps) {
  // Default mock reviews if no real reviews are available
  const defaultReviews: Review[] = [
    { 
      author_name: "Sarah M.", 
      rating: 5, 
      text: "Amazing service! The staff was incredibly professional and the results exceeded my expectations.", 
      relative_time_description: "2 days ago",
      time: Date.now()
    },
    { 
      author_name: "Mike R.", 
      rating: 4, 
      text: "Great experience overall. Clean facility and knowledgeable staff. Will definitely come back.", 
      relative_time_description: "1 week ago",
      time: Date.now()
    },
    { 
      author_name: "Emily K.", 
      rating: 5, 
      text: "Best med spa in the area! Love the treatments and the atmosphere is so relaxing.", 
      relative_time_description: "2 weeks ago",
      time: Date.now()
    },
    { 
      author_name: "David L.", 
      rating: 3, 
      text: "Good service but the wait time was longer than expected. Staff was friendly though.", 
      relative_time_description: "3 weeks ago",
      time: Date.now()
    }
  ]

  const displayReviews = reviews.length > 0 ? reviews : defaultReviews

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
                {selectedMedspa?.rating?.toFixed(1) || '0.0'}
              </div>
              <div className="text-sm text-gray-500">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {selectedMedspa?.user_ratings_total || reviews.length || 0}
              </div>
              <div className="text-sm text-gray-500">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {displayReviews.length > 0 
                  ? `${Math.round((displayReviews.filter(r => r.rating >= 4).length / displayReviews.length) * 100)}%`
                  : '76%'
                }
              </div>
              <div className="text-sm text-gray-500">Positive Sentiment</div>
            </div>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="space-y-4">
          {displayReviews.map((review, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg p-4 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">{review.author_name[0]}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{review.author_name}</span>
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
                    <span className="text-xs text-gray-500">{review.relative_time_description}</span>
                  </div>
                  <p className="text-sm text-gray-600">{review.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
} 