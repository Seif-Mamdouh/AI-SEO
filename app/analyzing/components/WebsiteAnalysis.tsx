'use client'

import { motion } from 'framer-motion'
import { MedSpa } from './types'

interface WebsiteAnalysisProps {
  selectedMedspa: MedSpa | null
}

export default function WebsiteAnalysis({ selectedMedspa }: WebsiteAnalysisProps) {
  return (
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
  )
} 