'use client'

import { motion } from 'framer-motion'
import { MapPin, Star, AlertTriangle } from 'lucide-react'
import Image from 'next/image'
import { MedSpa, getPhotoUrl } from './types'

interface BusinessProfileCardProps {
  selectedMedspa: MedSpa | null
}

export default function BusinessProfileCard({ selectedMedspa }: BusinessProfileCardProps) {
  if (!selectedMedspa) return null

  // Debug logging
  console.log('🖼️ BusinessProfileCard Debug:', {
    medSpaName: selectedMedspa.name,
    hasPhotos: !!selectedMedspa.photos,
    photosLength: selectedMedspa.photos?.length || 0,
    photos: selectedMedspa.photos,
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing',
    apiKey2: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY ? 'Present' : 'Missing'
  })

  // Get the first available photo for the business
  const getBusinessPhoto = () => {
    if (selectedMedspa.photos && selectedMedspa.photos.length > 0) {
      // Use the first photo as the main business photo
      const photo = selectedMedspa.photos[0]
      const photoUrl = getPhotoUrl(photo, 400)
      
      console.log('📸 Photo URL Generation:', {
        photo,
        generatedUrl: photoUrl,
        hasName: !!photo.name,
        hasPhotoReference: !!photo.photo_reference
      })
      
      return photoUrl
    }
    console.log('❌ No photos available for business')
    return null
  }

  const businessPhotoUrl = getBusinessPhoto()

  return (
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
              {businessPhotoUrl ? (
                <Image
                  src={businessPhotoUrl}
                  alt={`${selectedMedspa.name} business photo`}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <div class="text-center">
                            <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <div class="text-xs text-gray-500">Business Photo</div>
                          </div>
                        </div>
                      `;
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <div className="text-xs text-gray-500">No Business Photo</div>
                  </div>
                </div>
              )}
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
                {!businessPhotoUrl ? 'No business photos found' : 'No description found'}
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
  )
} 