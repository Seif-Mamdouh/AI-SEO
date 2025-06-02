'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { MedSpa, Competitor } from './types'

interface MapViewProps {
  selectedMedspa: MedSpa | null
  competitors: Competitor[]
}

export default function MapView({ selectedMedspa, competitors }: MapViewProps) {
  return (
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
  )
} 