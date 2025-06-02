'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { MedSpa, getPhotoUrl } from './types'

interface PhotoAnalysisProps {
  selectedMedspa: MedSpa | null
}

export default function PhotoAnalysis({ selectedMedspa }: PhotoAnalysisProps) {
  // Debug logging
  console.log('📷 PhotoAnalysis Debug:', {
    medSpaName: selectedMedspa?.name,
    hasPhotos: !!selectedMedspa?.photos,
    photosLength: selectedMedspa?.photos?.length || 0,
    allPhotos: selectedMedspa?.photos,
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing',
    apiKey2: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY ? 'Present' : 'Missing'
  })

  return (
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
              <div className="text-3xl font-bold text-gray-900">
                {selectedMedspa?.photos?.length || 0}
              </div>
              <div className="text-sm text-gray-500">Total Photos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">C+</div>
              <div className="text-sm text-gray-500">Quality Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {(selectedMedspa?.photos?.length || 0) < 10 ? 'Low' : 'Good'}
              </div>
              <div className="text-sm text-gray-500">Quantity Rating</div>
            </div>
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-3 gap-4">
          {selectedMedspa?.photos?.slice(0, 9).map((photo, index: number) => {
            const photoUrl = getPhotoUrl(photo, 400)
            
            return (
              <motion.div
                key={index}
                className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt={`${selectedMedspa.name} photo ${index + 1}`}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                            <div class="text-center">
                              <svg class="w-8 h-8 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              <div class="text-xs text-gray-600">Photo ${index + 1}</div>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-8 h-8 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div className="text-xs text-gray-600">Photo {index + 1}</div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Recommendations */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-2">Recommendations</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            {(selectedMedspa?.photos?.length || 0) < 5 && (
              <li>• Add more photos - you only have {selectedMedspa?.photos?.length || 0} photos</li>
            )}
            <li>• Add high-quality exterior photos</li>
            <li>• Include photos of treatment rooms</li>
            <li>• Add before/after photos (with consent)</li>
            <li>• Include staff photos for personal touch</li>
            {(selectedMedspa?.photos?.length || 0) >= 10 && (
              <li>• Great photo quantity! Focus on improving quality</li>
            )}
          </ul>
        </div>
      </div>
    </motion.div>
  )
} 