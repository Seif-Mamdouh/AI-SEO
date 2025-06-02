'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { MedSpa } from './types'
import { ExternalLink, Globe, Clock, Star, AlertTriangle, CheckCircle, XCircle, Eye, Link, Mail, Phone } from 'lucide-react'

interface WebsiteAnalysisProps {
  selectedMedspa: MedSpa | null
}

interface WebsiteData {
  pagespeed_data?: {
    url: string
    performance_score?: number
    accessibility_score?: number
    best_practices_score?: number
    seo_score?: number
    loading_experience?: string
    largest_contentful_paint?: number
    first_input_delay?: number
    cumulative_layout_shift?: number
    error?: string
  }
  website_data?: {
    url: string
    title?: string
    description?: string
    keywords?: string
    headings: {
      h1: string[]
      h2: string[]
      h3: string[]
    }
    images: Array<{
      src: string
      alt: string
    }>
    links: Array<{
      href: string
      text: string
    }>
    socialLinks: Array<{
      platform: string
      url: string
    }>
    contactInfo: {
      email?: string
      phone?: string
    }
    structure: {
      hasNavigation: boolean
      hasFooter: boolean
      hasContactForm: boolean
      hasBookingForm: boolean
    }
    screenshot?: string
    error?: string
  }
}

export default function WebsiteAnalysis({ selectedMedspa }: WebsiteAnalysisProps) {
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [parseProgress, setParseProgress] = useState(0)
  const [currentAction, setCurrentAction] = useState('Initializing...')
  const [iframeError, setIframeError] = useState(false)

  useEffect(() => {
    // Check if we already have analysis results
    const analysisResults = localStorage.getItem('analysisResults')
    if (analysisResults) {
      const data = JSON.parse(analysisResults)
      if (data.selectedMedspa?.website_data || data.selectedMedspa?.pagespeed_data) {
        setWebsiteData(data.selectedMedspa)
        setIsLoading(false)
        return
      }
    }

    // If no existing data and medspa has a website, start real-time parsing
    if (selectedMedspa?.website) {
      startWebsiteAnalysis()
    } else {
      setIsLoading(false)
    }
  }, [selectedMedspa])

  const startWebsiteAnalysis = async () => {
    if (!selectedMedspa?.website) return

    try {
      setParseProgress(10)
      setCurrentAction('Taking website screenshot...')

      setParseProgress(30)
      setCurrentAction('Parsing website content...')

      // Start website parsing
      const websiteParseResponse = await fetch('/api/website-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: selectedMedspa.website })
      })

      setParseProgress(70)
      setCurrentAction('Processing screenshot...')

      const websiteParseData = await websiteParseResponse.json()

      setParseProgress(90)
      setCurrentAction('Finalizing analysis...')

      // Update the data
      const updatedWebsiteData = {
        website_data: websiteParseData,
        // PageSpeed data will come from the main API call
        pagespeed_data: undefined
      }

      setWebsiteData(updatedWebsiteData)
      setParseProgress(100)
      setCurrentAction('Analysis complete!')
      
      setTimeout(() => {
        setIsLoading(false)
      }, 500)

    } catch (error) {
      console.error('Website analysis error:', error)
      setCurrentAction('Analysis failed')
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
  }

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-400'
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score?: number) => {
    if (!score) return 'bg-gray-50'
    if (score >= 90) return 'bg-green-50'
    if (score >= 70) return 'bg-yellow-50'
    return 'bg-red-50'
  }

  const getOverallGrade = (pageSpeedData?: any) => {
    if (!pageSpeedData || pageSpeedData.error) return 'N/A'
    const scores = [
      pageSpeedData.performance_score,
      pageSpeedData.seo_score,
      pageSpeedData.accessibility_score,
      pageSpeedData.best_practices_score
    ].filter(score => score !== undefined)
    
    if (scores.length === 0) return 'N/A'
    
    const average = scores.reduce((a, b) => a + b, 0) / scores.length
    if (average >= 90) return 'A'
    if (average >= 80) return 'B+'
    if (average >= 70) return 'B'
    if (average >= 60) return 'B-'
    if (average >= 50) return 'C+'
    if (average >= 40) return 'C'
    return 'D'
  }

  const formatLoadTime = (lcp?: number) => {
    if (!lcp) return 'N/A'
    return `${(lcp / 1000).toFixed(1)}s`
  }

  if (isLoading) {
    return (
      <motion.div
        className="w-full h-full bg-gray-50 p-8 overflow-y-auto flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center max-w-md">
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto relative">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div 
                className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"
                style={{
                  background: `conic-gradient(from 0deg, #2563eb ${parseProgress * 3.6}deg, transparent ${parseProgress * 3.6}deg)`
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Globe className="w-8 h-8 text-gray-400" />
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing Website</h3>
          <p className="text-gray-600 mb-4">{currentAction}</p>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <motion.div 
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${parseProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-sm text-gray-500">{parseProgress}% complete</p>
        </div>
      </motion.div>
    )
  }

  const pageSpeedData = websiteData?.pagespeed_data
  const websiteParseData = websiteData?.website_data
  const hasWebsite = selectedMedspa?.website

  if (!hasWebsite) {
    return (
      <motion.div
        className="w-full h-full bg-gray-50 p-8 overflow-y-auto"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Website Analysis</h2>
          
          <div className="bg-white rounded-lg p-8 text-center">
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Website Found</h3>
            <p className="text-gray-500 mb-6">
              {selectedMedspa?.name} doesn&apos;t appear to have a website listed in their Google Business Profile.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">🚀 Recommendation</h4>
              <p className="text-sm text-blue-700">
                Creating a professional website could significantly improve online visibility and customer acquisition.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

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
              <div className={`text-3xl font-bold ${getScoreColor(pageSpeedData?.performance_score)}`}>
                {formatLoadTime(pageSpeedData?.largest_contentful_paint)}
              </div>
              <div className="text-sm text-gray-500">Load Time</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(pageSpeedData?.seo_score)}`}>
                {pageSpeedData?.seo_score || 'N/A'}
              </div>
              <div className="text-sm text-gray-500">SEO Score</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(pageSpeedData?.performance_score)}`}>
                {getOverallGrade(pageSpeedData)}
              </div>
              <div className="text-sm text-gray-500">Overall Grade</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {websiteParseData?.images?.length || 0}
              </div>
              <div className="text-sm text-gray-500">Images</div>
            </div>
          </div>
        </div>

        {/* Website Screenshot */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="bg-gray-100 px-4 py-2 flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <div className="bg-white rounded px-3 py-1 text-xs text-gray-600 flex-1">
              {selectedMedspa?.website}
            </div>
            <a 
              href={selectedMedspa?.website?.startsWith('http') ? selectedMedspa.website : `https://${selectedMedspa?.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          
          <div className="relative bg-white">
            {!iframeError ? (
              <>
                <iframe
                  src={selectedMedspa?.website?.startsWith('http') ? selectedMedspa.website : `https://${selectedMedspa?.website}`}
                  className="w-full h-96 border-0 bg-white"
                  title={`${selectedMedspa?.name} website`}
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation"
                  loading="lazy"
                  onLoad={() => {
                    console.log('Website loaded successfully in iframe')
                  }}
                  onError={() => {
                    console.log('Iframe failed to load website')
                    setIframeError(true)
                  }}
                />
                {/* Subtle overlay for interaction prevention during analysis */}
                <div className="absolute inset-0 bg-transparent pointer-events-none hover:bg-blue-50 hover:bg-opacity-5 transition-colors duration-200"></div>
              </>
            ) : (
              <div className="h-96 bg-gradient-to-br from-blue-50 to-purple-50 p-8 flex items-center justify-center">
                <div className="text-center">
                  <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Website Preview Unavailable</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    The website cannot be displayed in an iframe, but it&apos;s still being analyzed.
                  </p>
                  
                  {/* Show website title and description if available */}
                  {websiteParseData?.title && (
                    <div className="bg-white rounded-lg p-4 max-w-md mx-auto shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-2">{websiteParseData.title}</h4>
                      {websiteParseData.description && (
                        <p className="text-sm text-gray-600">{websiteParseData.description}</p>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <a
                      href={selectedMedspa?.website?.startsWith('http') ? selectedMedspa.website : `https://${selectedMedspa?.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Website
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Website Structure Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Content Analysis */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Content Analysis</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Page Title</span>
                <span className="text-sm font-medium text-gray-900">
                  {websiteParseData?.title ? '✓' : '✗'} {websiteParseData?.title ? 'Found' : 'Missing'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Meta Description</span>
                <span className="text-sm font-medium text-gray-900">
                  {websiteParseData?.description ? '✓' : '✗'} {websiteParseData?.description ? 'Found' : 'Missing'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">H1 Headings</span>
                <span className="text-sm font-medium text-gray-900">
                  {websiteParseData?.headings?.h1?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Social Links</span>
                <span className="text-sm font-medium text-gray-900">
                  {websiteParseData?.socialLinks?.length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Website Features */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Website Features</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                {websiteParseData?.structure?.hasNavigation ? 
                  <CheckCircle className="w-4 h-4 text-green-600" /> : 
                  <XCircle className="w-4 h-4 text-red-600" />
                }
                <span className="text-sm text-gray-600">Navigation Menu</span>
              </div>
              <div className="flex items-center space-x-2">
                {websiteParseData?.structure?.hasFooter ? 
                  <CheckCircle className="w-4 h-4 text-green-600" /> : 
                  <XCircle className="w-4 h-4 text-red-600" />
                }
                <span className="text-sm text-gray-600">Footer Section</span>
              </div>
              <div className="flex items-center space-x-2">
                {websiteParseData?.structure?.hasContactForm ? 
                  <CheckCircle className="w-4 h-4 text-green-600" /> : 
                  <XCircle className="w-4 h-4 text-red-600" />
                }
                <span className="text-sm text-gray-600">Contact Form</span>
              </div>
              <div className="flex items-center space-x-2">
                {websiteParseData?.structure?.hasBookingForm ? 
                  <CheckCircle className="w-4 h-4 text-green-600" /> : 
                  <XCircle className="w-4 h-4 text-red-600" />
                }
                <span className="text-sm text-gray-600">Booking System</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Scores */}
        {pageSpeedData && (
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Performance Scores</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg ${getScoreBg(pageSpeedData?.performance_score)}`}>
                <div className={`text-2xl font-bold ${getScoreColor(pageSpeedData?.performance_score)}`}>
                  {pageSpeedData?.performance_score || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Performance</div>
              </div>
              <div className={`p-4 rounded-lg ${getScoreBg(pageSpeedData?.seo_score)}`}>
                <div className={`text-2xl font-bold ${getScoreColor(pageSpeedData?.seo_score)}`}>
                  {pageSpeedData?.seo_score || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">SEO</div>
              </div>
              <div className={`p-4 rounded-lg ${getScoreBg(pageSpeedData?.accessibility_score)}`}>
                <div className={`text-2xl font-bold ${getScoreColor(pageSpeedData?.accessibility_score)}`}>
                  {pageSpeedData?.accessibility_score || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Accessibility</div>
              </div>
              <div className={`p-4 rounded-lg ${getScoreBg(pageSpeedData?.best_practices_score)}`}>
                <div className={`text-2xl font-bold ${getScoreColor(pageSpeedData?.best_practices_score)}`}>
                  {pageSpeedData?.best_practices_score || 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Best Practices</div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Information */}
        {(websiteParseData?.contactInfo?.email || websiteParseData?.contactInfo?.phone) && (
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Contact Information Found</h3>
            <div className="space-y-2">
              {websiteParseData.contactInfo.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{websiteParseData.contactInfo.email}</span>
                </div>
              )}
              {websiteParseData.contactInfo.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{websiteParseData.contactInfo.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Issues and Recommendations */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-medium text-red-800 mb-2 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Issues Found
          </h3>
          <ul className="text-sm text-red-700 space-y-1">
            {pageSpeedData?.performance_score && pageSpeedData.performance_score < 70 && (
              <li>• Slow page load speed - consider optimizing images and reducing server response time</li>
            )}
            {!websiteParseData?.description && (
              <li>• Missing meta description - important for SEO and search results</li>
            )}
            {!websiteParseData?.structure?.hasContactForm && (
              <li>• No contact form found - consider adding one to improve lead generation</li>
            )}
            {!websiteParseData?.structure?.hasBookingForm && (
              <li>• No online booking system found - this could improve customer convenience</li>
            )}
            {(!websiteParseData?.socialLinks || websiteParseData.socialLinks.length === 0) && (
              <li>• No social media links found - consider adding links to your social profiles</li>
            )}
            {pageSpeedData?.seo_score && pageSpeedData.seo_score < 80 && (
              <li>• SEO score could be improved - consider technical SEO optimizations</li>
            )}
          </ul>
        </div>
      </div>
    </motion.div>
  )
} 