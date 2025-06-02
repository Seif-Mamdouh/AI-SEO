'use client'

import { motion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'
import { AnalysisStep } from './types'

interface AnalysisProgressSidebarProps {
  steps: AnalysisStep[]
  timeRemaining: number
  allStepsCompleted: boolean
  onNavigateToResults: () => void
}

export default function AnalysisProgressSidebar({ 
  steps, 
  timeRemaining, 
  allStepsCompleted, 
  onNavigateToResults
}: AnalysisProgressSidebarProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${secs} second${secs !== 1 ? 's' : ''}`
  }

  return (
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
            <span>
              {allStepsCompleted 
                ? 'Generating report...' 
                : `Running... ${formatTime(timeRemaining)} remaining`
              }
            </span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={onNavigateToResults}
            className="w-full text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Can&apos;t wait for the results?
          </button>
        </div>
      </div>
    </div>
  )
} 