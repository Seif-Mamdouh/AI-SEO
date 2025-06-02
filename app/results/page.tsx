'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  TrendingUp, 
  Award, 
  Globe, 
  Zap, 
  Target, 
  ArrowLeft, 
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Sparkles,
  Code,
  Rocket
} from 'lucide-react'

interface SEOAnalysisData {
  selectedMedspa: any
  competitors: any[]
  analysis: any
}

// AI Builder Promotion Component
const AIBuilderPromotion = ({ currentSEOScore, competitorAverage, medSpaData }: { 
  currentSEOScore: number, 
  competitorAverage: number, 
  medSpaData: any 
}) => {
  const router = useRouter()
  
  const needsImprovement = currentSEOScore < 80 || currentSEOScore < competitorAverage

  const handleRebuildWebsite = () => {
    // Store the med spa data for the AI builder
    localStorage.setItem('medSpaContextData', JSON.stringify(medSpaData))
    router.push('/ai-builder?context=medspa')
  }

  return (
    <motion.div 
      className={`rounded-2xl p-8 shadow-md border ${
        needsImprovement 
          ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200' 
          : 'bg-gradient-to-br from-green-50 to-blue-50 border-green-200'
      }`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.45 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-3">
          <motion.div 
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              needsImprovement ? 'bg-orange-500' : 'bg-green-500'
            }`}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className={`text-xl font-bold ${
              needsImprovement ? 'text-orange-900' : 'text-green-900'
            }`}>
              {needsImprovement ? '🚀 Rebuild Your Landing Page' : '✨ Optimize Your Website'}
            </h3>
            <p className={`text-sm ${
              needsImprovement ? 'text-orange-700' : 'text-green-700'
            }`}>
              {needsImprovement 
                ? 'AI-powered website to outrank your competitors' 
                : 'Create an even better performing website'}
            </p>
          </div>
        </div>
        <motion.div 
          className="text-right"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
        >
          <div className={`text-2xl font-bold ${
            needsImprovement ? 'text-orange-600' : 'text-green-600'
          }`}>
            {needsImprovement ? `+${Math.max(20, 90 - currentSEOScore)}` : '+10'}
          </div>
          <div className={`text-xs ${
            needsImprovement ? 'text-orange-500' : 'text-green-500'
          }`}>
            Potential SEO boost
          </div>
        </motion.div>
      </div>

      <div className="space-y-4 mb-6">
        {needsImprovement ? (
          <>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <span className="text-sm text-orange-800">
                <strong>Performance Issues:</strong> Your site scores {currentSEOScore}/100 vs competitor average of {competitorAverage}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <span className="text-sm text-orange-800">
                <strong>AI Solution:</strong> Generate a modern, SEO-optimized website in 60 seconds
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
              <span className="text-sm text-orange-800">
                <strong>Results:</strong> Faster loading, better mobile experience, higher Google rankings
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-green-800">
                <strong>Good Performance:</strong> Your site is competitive but can be optimized further
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-green-800">
                <strong>AI Enhancement:</strong> Create an even faster, more converting website
              </span>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <motion.button
          onClick={handleRebuildWebsite}
          className={`px-6 py-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
            needsImprovement 
              ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700' 
              : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Rocket className="w-5 h-5" />
          <span>{needsImprovement ? 'Rebuild with AI' : 'Optimize with AI'}</span>
        </motion.button>
        
        <motion.div 
          className="flex items-center justify-center space-x-2 text-sm text-gray-600 bg-white/50 rounded-xl px-4 py-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Code className="w-4 h-4" />
          <span>✨ AI generates HTML, CSS & JS</span>
        </motion.div>
      </div>

      <div className={`text-xs text-center ${
        needsImprovement ? 'text-orange-600' : 'text-green-600'
      }`}>
        {needsImprovement 
          ? '⚡ Average improvement: 40+ SEO score points in competitors who rebuilt'
          : '🎯 Small optimizations can lead to significant ranking improvements'
        }
      </div>
    </motion.div>
  )
}

export default function ResultsPage() {
  const [seoData, setSeoData] = useState<SEOAnalysisData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get data from localStorage
    const storedData = localStorage.getItem('seoAnalysisResults')
    if (storedData) {
      setSeoData(JSON.parse(storedData))
      setIsLoading(false)
    } else {
      // If no data, redirect back to home
      router.push('/')
    }
  }, [router])

  const goBack = () => {
    router.push('/')
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5" />
    if (score >= 60) return <AlertTriangle className="w-5 h-5" />
    return <XCircle className="w-5 h-5" />
  }

  const getPositionColor = (position: number) => {
    if (position <= 3) return 'text-green-600 bg-green-50'
    if (position <= 5) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!seoData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No SEO analysis data found</p>
          <button
            onClick={goBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const { selectedMedspa, competitors, analysis } = seoData
  const pageSpeedData = selectedMedspa.pagespeed_data

  // Calculate competitor average for AI builder component
  const competitorSEOScores = competitors
    .filter((comp: any) => comp.pagespeed_data && !comp.pagespeed_data.error)
    .map((comp: any) => comp.pagespeed_data.seo_score)
  const competitorAverage = competitorSEOScores.length > 0 
    ? Math.round(competitorSEOScores.reduce((a: number, b: number) => a + b, 0) / competitorSEOScores.length)
    : 70

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <motion.div 
        className="bg-white shadow-sm border-b border-gray-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={goBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">SEO Analysis Results</h1>
            </div>
            <div className="text-sm text-gray-500">
              {selectedMedspa.name}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* SEO Position */}
          <motion.div 
            className={`p-6 rounded-2xl ${getPositionColor(analysis.yourSEOPosition)}`}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center justify-between mb-2">
              <Award className="w-6 h-6" />
              <span className="text-2xl font-bold">#{analysis.yourSEOPosition}</span>
            </div>
            <h3 className="font-semibold">SEO Position</h3>
            <p className="text-sm opacity-75">vs local competitors</p>
          </motion.div>

          {/* Performance Score */}
          <motion.div 
            className={`p-6 rounded-2xl ${pageSpeedData?.performance_score ? getScoreColor(pageSpeedData.performance_score) : 'bg-gray-50 text-gray-600'}`}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-6 h-6" />
              <span className="text-2xl font-bold">{pageSpeedData?.performance_score || 'N/A'}</span>
            </div>
            <h3 className="font-semibold">Performance</h3>
            <p className="text-sm opacity-75">PageSpeed score</p>
          </motion.div>

          {/* SEO Score */}
          <motion.div 
            className={`p-6 rounded-2xl ${pageSpeedData?.seo_score ? getScoreColor(pageSpeedData.seo_score) : 'bg-gray-50 text-gray-600'}`}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center justify-between mb-2">
              <Target className="w-6 h-6" />
              <span className="text-2xl font-bold">{pageSpeedData?.seo_score || 'N/A'}</span>
            </div>
            <h3 className="font-semibold">SEO Score</h3>
            <p className="text-sm opacity-75">Technical SEO</p>
          </motion.div>

          {/* Competitors Analyzed */}
          <motion.div 
            className="p-6 rounded-2xl bg-purple-50 text-purple-600"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center justify-between mb-2">
              <Globe className="w-6 h-6" />
              <span className="text-2xl font-bold">{analysis.competitorsWithWebsites}</span>
            </div>
            <h3 className="font-semibold">Competitors</h3>
            <p className="text-sm opacity-75">with websites analyzed</p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Competitors Ranking */}
          <div className="lg:col-span-2 space-y-6">
            {/* Competitor Rankings */}
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-md border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-3" />
                SEO Competition Analysis
              </h2>
              
              <div className="space-y-4">
                {competitors.map((competitor: any, index: number) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{competitor.name}</h3>
                        <p className="text-sm text-gray-600">{competitor.distance_miles} miles away</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      {competitor.pagespeed_data && !competitor.pagespeed_data.error ? (
                        <>
                          <div className="text-center">
                            <div className={`text-lg font-bold ${getScoreColor(competitor.pagespeed_data.performance_score).split(' ')[0]}`}>
                              {competitor.pagespeed_data.performance_score}
                            </div>
                            <div className="text-xs text-gray-500">Performance</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-lg font-bold ${getScoreColor(competitor.pagespeed_data.seo_score).split(' ')[0]}`}>
                              {competitor.pagespeed_data.seo_score}
                            </div>
                            <div className="text-xs text-gray-500">SEO</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-purple-600">{competitor.seo_rank}</div>
                            <div className="text-xs text-gray-500">Overall</div>
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500">No website data</div>
                      )}
                      
                      {competitor.website && (
                        <a
                          href={competitor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Performance Details */}
            {pageSpeedData && !pageSpeedData.error && (
              <motion.div 
                className="bg-white rounded-2xl p-8 shadow-md border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Performance</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-full ${getScoreColor(pageSpeedData.performance_score)} mx-auto mb-2 flex items-center justify-center`}>
                      {getScoreIcon(pageSpeedData.performance_score)}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{pageSpeedData.performance_score}</div>
                    <div className="text-sm text-gray-600">Performance</div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-full ${getScoreColor(pageSpeedData.accessibility_score || 0)} mx-auto mb-2 flex items-center justify-center`}>
                      {getScoreIcon(pageSpeedData.accessibility_score || 0)}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{pageSpeedData.accessibility_score || 'N/A'}</div>
                    <div className="text-sm text-gray-600">Accessibility</div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-full ${getScoreColor(pageSpeedData.best_practices_score || 0)} mx-auto mb-2 flex items-center justify-center`}>
                      {getScoreIcon(pageSpeedData.best_practices_score || 0)}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{pageSpeedData.best_practices_score || 'N/A'}</div>
                    <div className="text-sm text-gray-600">Best Practices</div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-full ${getScoreColor(pageSpeedData.seo_score)} mx-auto mb-2 flex items-center justify-center`}>
                      {getScoreIcon(pageSpeedData.seo_score)}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{pageSpeedData.seo_score}</div>
                    <div className="text-sm text-gray-600">SEO</div>
                  </div>
                </div>

                {/* Core Web Vitals */}
                {pageSpeedData.largest_contentful_paint && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Core Web Vitals</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Largest Contentful Paint</div>
                        <div className="text-xl font-bold text-gray-900">
                          {(pageSpeedData.largest_contentful_paint / 1000).toFixed(2)}s
                        </div>
                      </div>
                      {pageSpeedData.cumulative_layout_shift && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">Cumulative Layout Shift</div>
                          <div className="text-xl font-bold text-gray-900">
                            {pageSpeedData.cumulative_layout_shift.toFixed(3)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* AI Builder Promotion - Strategic placement after performance data */}
            {pageSpeedData && !pageSpeedData.error && (
              <AIBuilderPromotion 
                currentSEOScore={pageSpeedData.seo_score || 0}
                competitorAverage={competitorAverage}
                medSpaData={selectedMedspa}
              />
            )}
          </div>

          {/* Right Column - Recommendations */}
          <div className="space-y-6">
            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <motion.div 
                className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-xl font-bold text-purple-900 mb-4">💡 Improvement Recommendations</h2>
                <div className="space-y-3">
                  {analysis.recommendations.map((rec: string, index: number) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-white/50 rounded-lg"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <p className="text-sm text-purple-800 leading-relaxed">{rec}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quick Stats */}
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Competitors Found</span>
                  <span className="font-semibold text-gray-900">{analysis.totalCompetitors}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Competitors with Websites</span>
                  <span className="font-semibold text-gray-900">{analysis.competitorsWithWebsites}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Performance Score</span>
                  <span className="font-semibold text-gray-900">{analysis.averagePerformanceScore}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average SEO Score</span>
                  <span className="font-semibold text-gray-900">{analysis.averageSEOScore}</span>
                </div>
                {analysis.topPerformer && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="text-sm text-gray-600 mb-1">Top SEO Performer</div>
                    <div className="font-semibold text-gray-900">{analysis.topPerformer.name}</div>
                    <div className="text-sm text-gray-500">Score: {analysis.topPerformer.seo_rank}</div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Action Button */}
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Ready to improve?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get a detailed action plan to outrank your competitors
              </p>
              <button
                onClick={goBack}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
              >
                Analyze Another Med Spa
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
} 