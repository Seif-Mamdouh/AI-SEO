'use client'

import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface SEOAnalysisItem {
  name: string
  status: 'passed' | 'failed' | 'warning'
  score: number
  description: string
  recommendation?: string
}

interface SEOAnalysisData {
  overallScore: number
  totalChecks: number
  passedChecks: number
  headlines: SEOAnalysisItem[]
  metadata: SEOAnalysisItem[]
  technicalSEO: SEOAnalysisItem[]
}

interface DetailedSEOAnalysisProps {
  seoData: SEOAnalysisData
  businessName: string
}

export default function DetailedSEOAnalysis({ seoData, businessName }: DetailedSEOAnalysisProps) {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    headlines: true,
    metadata: true,
    technicalSEO: false
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const getStatusIcon = (status: 'passed' | 'failed' | 'warning') => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusBg = (status: 'passed' | 'failed' | 'warning') => {
    switch (status) {
      case 'passed':
        return 'bg-green-50 border-green-200'
      case 'failed':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
    }
  }

  const calculateSectionScore = (items: SEOAnalysisItem[]) => {
    if (items.length === 0) return 0
    const totalScore = items.reduce((sum, item) => sum + item.score, 0)
    return Math.round(totalScore / items.length)
  }

  const renderSEOSection = (title: string, items: SEOAnalysisItem[], sectionKey: string) => {
    const sectionScore = calculateSectionScore(items)
    const passedItems = items.filter(item => item.status === 'passed').length

    return (
      <motion.div 
        className="bg-white rounded-lg border border-gray-200 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div 
          className="p-4 bg-gray-50 border-b border-gray-200 cursor-pointer flex items-center justify-between hover:bg-gray-100 transition-colors"
          onClick={() => toggleSection(sectionKey)}
        >
          <div className="flex items-center space-x-3">
            {expandedSections[sectionKey] ? (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            )}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {passedItems}/{items.length}
              </span>
              <div className={`w-12 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                sectionScore >= 80 ? 'bg-green-100 text-green-800' :
                sectionScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {sectionScore}
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{ height: expandedSections[sectionKey] ? 'auto' : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="p-4 space-y-3">
            {items.map((item, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-lg border ${getStatusBg(item.status)}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-start space-x-3">
                  {getStatusIcon(item.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <span className="text-sm font-medium text-gray-700">{item.score}/100</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    {item.recommendation && (
                      <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                        <p className="text-sm text-blue-800">
                          <strong>Recommendation:</strong> {item.recommendation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Score Header */}
      <motion.div 
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            SEO Analysis for {businessName}
          </h2>
          <div className="flex items-center justify-center space-x-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${
                seoData.overallScore >= 80 ? 'text-green-600' :
                seoData.overallScore >= 60 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {seoData.overallScore}
              </div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-700">
                {seoData.passedChecks}/{seoData.totalChecks}
              </div>
              <div className="text-sm text-gray-600">Checks Passed</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  seoData.overallScore >= 80 ? 'bg-green-500' :
                  seoData.overallScore >= 60 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${seoData.overallScore}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {seoData.overallScore >= 80 ? 'Excellent SEO performance!' :
               seoData.overallScore >= 60 ? 'Good SEO with room for improvement' :
               'Significant SEO improvements needed'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* SEO Analysis Sections */}
      <div className="space-y-4">
        {seoData.headlines.length > 0 && renderSEOSection('Headlines (H1)', seoData.headlines, 'headlines')}
        {seoData.metadata.length > 0 && renderSEOSection('Metadata', seoData.metadata, 'metadata')}
        {seoData.technicalSEO.length > 0 && renderSEOSection('Technical SEO', seoData.technicalSEO, 'technicalSEO')}
      </div>

      {/* Quick Fixes */}
      <motion.div 
        className="bg-white rounded-lg border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Quick Wins</h3>
        <div className="space-y-2">
          {[...seoData.headlines, ...seoData.metadata, ...seoData.technicalSEO]
            .filter(item => item.status === 'failed' && item.recommendation)
            .slice(0, 3)
            .map((item, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-orange-500 mt-1">•</span>
                <span className="text-sm text-gray-700">{item.recommendation}</span>
              </div>
            ))}
        </div>
      </motion.div>
    </div>
  )
} 