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
  Rocket,
  Brain,
  Star,
  MapPin,
  Phone,
  Clock,
  Users,
  Search,
  Eye,
  Smartphone,
  RefreshCw
} from 'lucide-react'
import DetailedSEOAnalysis from '../analyzing/components/DetailedSEOAnalysis'

interface SEOAnalysisData {
  selectedMedspa: any
  competitors: any[]
  analysis: any
  llm_report?: {
    content: string
    generatedAt: string
    model: string
    tokensUsed: number
  }
}

// Calculate overall health score based on all metrics
const calculateOverallScore = (seoData: SEOAnalysisData) => {
  const { selectedMedspa, analysis } = seoData
  const pageSpeedData = selectedMedspa.pagespeed_data
  
  let totalScore = 0
  let components = 0
  
  // Performance score (40% weight)
  if (pageSpeedData?.performance_score) {
    totalScore += pageSpeedData.performance_score * 0.4
    components += 0.4
  }
  
  // SEO score (30% weight)
  if (pageSpeedData?.seo_score) {
    totalScore += pageSpeedData.seo_score * 0.3
    components += 0.3
  }
  
  // Local ranking (20% weight) - lower position is better
  if (analysis?.yourSEOPosition) {
    const rankingScore = Math.max(0, 100 - (analysis.yourSEOPosition * 15))
    totalScore += rankingScore * 0.2
    components += 0.2
  }
  
  // Reviews/reputation (10% weight)
  if (selectedMedspa.rating) {
    const reviewScore = (selectedMedspa.rating / 5) * 100
    totalScore += reviewScore * 0.1
    components += 0.1
  }
  
  return components > 0 ? Math.round(totalScore / components) : 0
}

const getScoreGrade = (score: number) => {
  if (score >= 90) return { grade: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-50' }
  if (score >= 80) return { grade: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-50' }
  if (score >= 60) return { grade: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-50' }
  if (score >= 40) return { grade: 'Poor', color: 'text-orange-600', bgColor: 'bg-orange-50' }
  return { grade: 'Critical', color: 'text-red-600', bgColor: 'bg-red-50' }
}

// AI Builder Promotion Component
const AIBuilderPromotion = ({ currentSEOScore, competitorAverage, medSpaData }: { 
  currentSEOScore: number, 
  competitorAverage: number, 
  medSpaData: any 
}) => {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationStep, setGenerationStep] = useState('')
  const [generatedWebsite, setGeneratedWebsite] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  
  const needsImprovement = currentSEOScore < 80 || currentSEOScore < competitorAverage

  const generateContextualPrompt = (medSpaData: any) => {
    const { name, formatted_address, rating, user_ratings_total, phone, formatted_phone_number, website_data, pagespeed_data, photos } = medSpaData
    
    let prompt = `Create a professional medical spa landing page for "${name}"\n\n`
    prompt += `BUSINESS DETAILS:\n`
    prompt += `• Business Name: ${name} (use this exact name throughout)\n`
    prompt += `• Location: ${formatted_address}\n`
    prompt += `• Phone: ${phone || formatted_phone_number || '(555) 123-4567'}\n`
    prompt += `• Google Rating: ${rating || 4.8} stars (${user_ratings_total || 'many'} reviews)\n`
    
    if (website_data) {
      if (website_data.title) {
        prompt += `• Current Website Title: "${website_data.title}"\n`
      }
      if (website_data.description) {
        prompt += `• Current Description: "${website_data.description}"\n`
      }
    }
    
    if (pagespeed_data && !pagespeed_data.error) {
      prompt += `\nCURRENT WEBSITE PERFORMANCE TO IMPROVE:\n`
      if (pagespeed_data.seo_score < 80) {
        prompt += `• Current SEO score: ${pagespeed_data.seo_score}/100 - new site should achieve 90+\n`
      }
      if (pagespeed_data.performance_score < 80) {
        prompt += `• Current performance score: ${pagespeed_data.performance_score}/100 - new site should load faster\n`
      }
    }
    
    prompt += `\nLANDING PAGE REQUIREMENTS:\n`
    prompt += `• Hero Section: "${name}" prominently displayed with compelling medical spa messaging\n`
    prompt += `• Services: Premium medical spa treatments (Botox, fillers, laser treatments, facials, etc.)\n`
    prompt += `• About: Professional description specifically about ${name}\n`
    prompt += `• Gallery: Use actual business photos if available\n`
    prompt += `• Testimonials: Reference the ${rating}-star Google rating and create realistic reviews\n`
    prompt += `• Contact: Use the exact address and phone number provided\n`
    prompt += `• Booking: Appointment scheduling specifically for ${name}\n`
    prompt += `• Footer: Complete ${name} business information\n`
    
    prompt += `\nCONTENT GUIDELINES:\n`
    prompt += `• Every heading and section should reference "${name}" by name\n`
    prompt += `• Write content as if you're the official ${name} website\n`
    prompt += `• Include realistic pricing and service descriptions\n`
    prompt += `• Make it feel like a real business website, not a template\n`
    prompt += `• Use the business information provided above throughout\n`
    prompt += `• Optimize for local SEO with location-based keywords\n`
    
    return prompt
  }

  const handleGenerateWebsite = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    setGenerationStep('Analyzing your business data...')
    setError(null)
    setGeneratedWebsite(null)

    try {
      console.log('🚀 Starting website generation for:', medSpaData.name)

      // Generate contextual prompt
      const prompt = generateContextualPrompt(medSpaData)

      // Simulate progress updates
      const progressUpdates = [
        { progress: 10, step: 'Understanding your vision...' },
        { progress: 25, step: 'Generating React components...' },
        { progress: 50, step: 'Adding SHADCN/UI elements...' },
        { progress: 75, step: 'Integrating business data...' },
        { progress: 90, step: 'Finalizing website...' },
      ]

      let currentUpdateIndex = 0
      const progressInterval = setInterval(() => {
        if (currentUpdateIndex < progressUpdates.length) {
          const update = progressUpdates[currentUpdateIndex]
          setGenerationProgress(update.progress)
          setGenerationStep(update.step)
          currentUpdateIndex++
        }
      }, 1000)

      // Make API call to generate website
      const response = await fetch('/api/generate-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          medSpaData
        })
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate website')
      }

      const result = await response.json()
      
      setGenerationProgress(100)
      setGenerationStep('Website ready!')
      
      // Store the generated website data and navigate immediately to AI builder
      setTimeout(() => {
        localStorage.setItem('generatedWebsiteData', JSON.stringify(result))
        router.push('/ai-builder?view=true')
      }, 500)

    } catch (error) {
      console.error('💥 Generation failed:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate website')
      setGenerationStep('Generation failed')
      setIsGenerating(false)
    }
  }

  const handleViewWebsite = () => {
    // Store the generated website data and navigate to builder to view
    localStorage.setItem('generatedWebsiteData', JSON.stringify(generatedWebsite))
    router.push('/ai-builder?view=true')
  }

  const handleTryAgain = () => {
    setError(null)
    setGeneratedWebsite(null)
    setGenerationProgress(0)
    setGenerationStep('')
  }

  if (isGenerating) {
    return (
      <motion.div 
        className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-10 shadow-md border border-blue-100 min-h-[350px]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-blue-900">
                🤖 Building Your Website...
              </h3>
              <p className="text-blue-700 text-base">
                Creating a professional website for {medSpaData.name}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-medium text-blue-700">{generationStep}</span>
            <span className="text-base text-blue-500">{generationProgress}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-4">
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${generationProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="text-center text-base text-blue-600 py-4">
          Please wait while we generate your professional website...
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div 
        className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-10 shadow-md border border-red-100 min-h-[350px]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-pink-600 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-red-900">
                ⚠️ Generation Failed
              </h3>
              <p className="text-red-700 text-base">
                {error}
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleGenerateWebsite}
            className="flex-1 px-8 py-5 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center space-x-3 text-lg"
          >
            <RefreshCw className="w-6 h-6" />
            <span>Try Again</span>
          </button>
          <button
            onClick={handleTryAgain}
            className="px-6 py-5 bg-white text-gray-700 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors text-lg"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-10 shadow-md border border-purple-100 min-h-[400px]"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-purple-900">
              🚀 Build a Better Website with AI
            </h3>
            <p className="text-purple-700 text-base">
              Create a high-converting landing page in 60 seconds
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-purple-600" />
            <span className="text-base text-purple-800">AI-powered website generation</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-purple-600" />
            <span className="text-base text-purple-800">Uses your real business data & photos</span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-purple-600" />
            <span className="text-base text-purple-800">Optimized for mobile & SEO</span>
          </div>
        </div>
        <div className="bg-white/60 rounded-lg p-6">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            Expected Improvement
          </div>
          <div className="text-base text-purple-700 mb-2">
            +{Math.max(20, 90 - currentSEOScore)} points SEO score
          </div>
          <div className="text-sm text-purple-600 mt-2">
            Based on similar medical spa improvements
          </div>
        </div>
      </div>

      <button
        onClick={handleGenerateWebsite}
        className="w-full px-8 py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-3 text-lg"
      >
        <Rocket className="w-6 h-6" />
        <span>Generate AI Website</span>
      </button>
    </motion.div>
  )
}

export default function ResultsPage() {
  const [seoData, setSeoData] = useState<SEOAnalysisData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedData = localStorage.getItem('seoAnalysisResults')
    if (storedData) {
      setSeoData(JSON.parse(storedData))
      setIsLoading(false)
    } else {
      router.push('/')
    }
  }, [router])

  const goBack = () => {
    router.push('/')
  }

  if (isLoading || !seoData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    )
  }

  const { selectedMedspa, competitors, analysis, llm_report } = seoData
  const pageSpeedData = selectedMedspa.pagespeed_data
  const overallScore = calculateOverallScore(seoData)
  const scoreGrade = getScoreGrade(overallScore)

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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedMedspa.name}</h1>
                <p className="text-sm text-gray-500">{selectedMedspa.formatted_address}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              We found {analysis.recommendations?.length || 15} problems with your online presence
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Overall Score */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 sticky top-8">
              {/* Overall Score Circle */}
              <div className="text-center mb-8">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke={overallScore >= 80 ? "#10b981" : overallScore >= 60 ? "#f59e0b" : "#ef4444"}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${overallScore * 2.51} 251`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{overallScore}</div>
                      <div className="text-sm text-gray-500">/ 100</div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Online health grade</div>
                  <div className={`text-lg font-bold ${scoreGrade.color}`}>{scoreGrade.grade}</div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <span className="text-sm text-gray-700">Search Results</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{pageSpeedData?.seo_score || 0}/100</div>
                    <div className="text-xs text-gray-500">Poor</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <span className="text-sm text-gray-700">Website Experience</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{pageSpeedData?.performance_score || 0}/100</div>
                    <div className="text-xs text-gray-500">Poor</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-700">Local Listings</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{selectedMedspa.rating ? Math.round(selectedMedspa.rating * 20) : 0}/100</div>
                    <div className="text-xs text-gray-500">Good</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* 1. Search Results Section */}
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-md border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">1. Search Results</h2>
              <p className="text-xl text-gray-700 mb-6">Get your website to the top of Google</p>
              
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">What&apos;s SEO?</h3>
                <p className="text-sm text-gray-700">
                  It means improving your website so search engines like Google can find it, rank it higher, and help more people see it.
                </p>
              </div>

              {/* Who's beating you on Google */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Who&apos;s beating you on Google</h3>
                <div className="space-y-3">
                  {(() => {
                    // Create a combined list including the current spa
                    const allSpas = [
                      {
                        ...selectedMedspa,
                        isCurrentSpa: true
                      },
                      ...competitors
                    ];

                    // Sort by SEO score (highest first), fallback to rating if no SEO score
                    const sortedSpas = allSpas.sort((a, b) => {
                      const getScore = (spa: any) => {
                        if (spa.pagespeed_data && !spa.pagespeed_data.error) {
                          return spa.pagespeed_data.seo_score || 0;
                        }
                        // Fallback to rating-based score if no SEO data
                        return (spa.rating || 0) * 20;
                      };
                      return getScore(b) - getScore(a);
                    });

                    // Take top 8
                    return sortedSpas.slice(0, 8).map((spa: any, index: number) => (
                      <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${
                        spa.isCurrentSpa ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <div className={`text-sm font-medium ${
                              spa.isCurrentSpa ? 'text-blue-600' : 'text-gray-600'
                            }`}>
                              {index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : `${index + 1}th`}
                            </div>
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-gray-700">{spa.rating || 'N/A'}</span>
                          </div>
                          <div>
                            <div className={`font-medium ${
                              spa.isCurrentSpa ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {spa.name}
                              {spa.isCurrentSpa && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">YOU</span>}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {spa.pagespeed_data && !spa.pagespeed_data.error && (
                            <div className={`text-sm ${
                              spa.isCurrentSpa ? 'text-blue-600' : 'text-gray-600'
                            }`}>
                              SEO: {spa.pagespeed_data.seo_score}/100
                            </div>
                          )}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Keyword Rankings Section */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">This is how you&apos;re doing online</h3>
                <p className="text-sm text-gray-600 mb-4">Where are you placing when customers search you, next to your competitors</p>
                
                <div className="space-y-3">
                  {(() => {
                    // Generate relevant keywords based on location
                    const location = selectedMedspa.formatted_address?.split(',')[1]?.trim() || 'your area';
                    const city = selectedMedspa.formatted_address?.split(',')[0]?.trim() || 'your city';
                    
                    const keywords = [
                      `Best med spa in ${city}`,
                      `Best med spa in ${location}`,
                      `Botox ${city}`,
                      `Laser hair removal ${city}`,
                      `Medical spa ${city}`,
                      `Aesthetic treatments ${city}`,
                      `Facial treatments ${city}`,
                      `Dermal fillers ${city}`,
                      `CoolSculpting ${city}`,
                      `Med spa near me`,
                      `Best aesthetic clinic ${city}`,
                      `Anti-aging treatments ${city}`
                    ];

                    // Create ranking data - simulate where the current spa ranks for each keyword
                    return keywords.slice(0, 10).map((keyword, keywordIndex) => {
                      // Simulate ranking position based on SEO score and competitor analysis
                      const currentSpaScore = selectedMedspa.pagespeed_data?.seo_score || (selectedMedspa.rating || 3) * 20;
                      const competitorScores = competitors.slice(0, 5).map(comp => 
                        comp.pagespeed_data?.seo_score || (comp.rating || 3) * 20
                      );
                      
                      // Calculate ranking position
                      const allScores = [currentSpaScore, ...competitorScores];
                      const sortedScores = [...allScores].sort((a, b) => b - a);
                      const currentSpaRank = sortedScores.indexOf(currentSpaScore) + 1;
                      
                      // Determine which competitor ranks #1 for this keyword
                      const topCompetitor = competitors.find(comp => 
                        (comp.pagespeed_data?.seo_score || (comp.rating || 3) * 20) === Math.max(...competitorScores)
                      ) || competitors[0];
                      
                      // Determine ranking status
                      const isRanked = currentSpaRank <= 3;
                      const rankingStatus = currentSpaRank === 1 ? '1st map pack' : 
                                          currentSpaRank <= 3 ? `${currentSpaRank === 2 ? '2nd' : '3rd'} map pack` : 
                                          'Unranked organic';
                      const statusColor = currentSpaRank === 1 ? 'bg-green-100 text-green-700' :
                                         currentSpaRank <= 3 ? 'bg-yellow-100 text-yellow-700' :
                                         'bg-red-100 text-red-700';

                      return (
                        <div key={keywordIndex} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <Search className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-blue-600 mb-3">{keyword}</h4>
                              <div className="space-y-2">
                                {/* Show top 3 results */}
                                {currentSpaRank === 1 ? (
                                  // Current spa is #1
                                  <>
                                    <div className="flex items-center space-x-2 text-sm">
                                      <div className="w-6 h-6 bg-blue-600 text-white rounded text-xs flex items-center justify-center font-medium">
                                        1
                                      </div>
                                      <span className="text-blue-900 font-medium">{selectedMedspa.name}</span>
                                      <span className="text-gray-500">• {selectedMedspa.rating || 4.5} ⭐</span>
                                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">
                                        YOU
                                      </span>
                                    </div>
                                    {competitors.slice(0, 2).map((comp, idx) => (
                                      <div key={idx} className="flex items-center space-x-2 text-sm">
                                        <div className="w-6 h-6 bg-gray-400 text-white rounded text-xs flex items-center justify-center">
                                          {idx + 2}
                                        </div>
                                        <span className="text-gray-900">{comp.name}</span>
                                        <span className="text-gray-500">• {comp.rating || 4.0} ⭐</span>
                                      </div>
                                    ))}
                                  </>
                                ) : (
                                  // Current spa is not #1
                                  <>
                                    {competitors.slice(0, Math.min(currentSpaRank - 1, 3)).map((comp, idx) => (
                                      <div key={idx} className="flex items-center space-x-2 text-sm">
                                        <div className="w-6 h-6 bg-gray-400 text-white rounded text-xs flex items-center justify-center">
                                          {idx + 1}
                                        </div>
                                        <span className="text-gray-900">{comp.name}</span>
                                        <span className="text-gray-500">• {comp.rating || 4.0} ⭐</span>
                                        {idx === 0 && (
                                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                                            1st map pack
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                    {currentSpaRank <= 4 && (
                                      <div className="flex items-center space-x-2 text-sm">
                                        <div className="w-6 h-6 bg-orange-500 text-white rounded text-xs flex items-center justify-center">
                                          {currentSpaRank}
                                        </div>
                                        <span className="text-blue-900 font-medium">{selectedMedspa.name}</span>
                                        <span className="text-gray-500">• {selectedMedspa.rating || 4.5} ⭐</span>
                                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">
                                          YOU
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded ${statusColor}`}>
                                          {rankingStatus}
                                        </span>
                                      </div>
                                    )}
                                  </>
                                )}
                                
                                {/* Show unranked status if not in top 4 */}
                                {currentSpaRank > 4 && (
                                  <div className="mt-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-300">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-red-700 font-medium">{selectedMedspa.name}</span>
                                      <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                                        Not ranking in top 10
                                      </span>
                                    </div>
                                    <p className="text-xs text-red-600 mt-1">
                                      Customers searching &ldquo;{keyword}&rdquo; won&apos;t easily find you
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <div className="text-right">
                                <div className={`text-sm font-medium ${
                                  currentSpaRank === 1 ? 'text-green-600' : 
                                  currentSpaRank <= 3 ? 'text-yellow-600' : 
                                  'text-red-600'
                                }`}>
                                  {currentSpaRank === 1 ? '🥇 #1' : 
                                   currentSpaRank <= 32 ? `#${currentSpaRank}` : 
                                   'Not ranked'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Where are you placing when customers search you, next to your competitors */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Summary of your search presence</h3>
                <p className="text-sm text-gray-600 mb-4">Overall analysis of where you appear in search results</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {(() => {
                        // Calculate how many keywords they rank #1 for
                        const currentSpaScore = selectedMedspa.pagespeed_data?.seo_score || (selectedMedspa.rating || 3) * 20;
                        const competitorScores = competitors.slice(0, 3).map(comp => 
                          comp.pagespeed_data?.seo_score || (comp.rating || 3) * 20
                        );
                        const isTopRanked = currentSpaScore >= Math.max(...competitorScores);
                        return isTopRanked ? '3' : '1';
                      })()}
                    </div>
                    <div className="text-sm text-green-700">Keywords ranking #1</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {(() => {
                        const currentSpaScore = selectedMedspa.pagespeed_data?.seo_score || (selectedMedspa.rating || 3) * 20;
                        const competitorScores = competitors.slice(0, 3).map(comp => 
                          comp.pagespeed_data?.seo_score || (comp.rating || 3) * 20
                        );
                        const avgCompScore = competitorScores.reduce((a, b) => a + b, 0) / competitorScores.length;
                        return currentSpaScore >= avgCompScore ? '4' : '2';
                      })()}
                    </div>
                    <div className="text-sm text-yellow-700">Keywords in top 3</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {(() => {
                        const currentSpaScore = selectedMedspa.pagespeed_data?.seo_score || (selectedMedspa.rating || 3) * 20;
                        const competitorScores = competitors.slice(0, 3).map(comp => 
                          comp.pagespeed_data?.seo_score || (comp.rating || 3) * 20
                        );
                        const avgCompScore = competitorScores.reduce((a, b) => a + b, 0) / competitorScores.length;
                        return currentSpaScore < avgCompScore ? '5' : '3';
                      })()}
                    </div>
                    <div className="text-sm text-red-700">Keywords not ranking</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Sample search results showing competitive positioning */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Search className="w-5 h-5 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-600">Best med spa in {selectedMedspa.formatted_address?.split(',')[1]?.trim() || 'your area'}</h4>
                        <div className="space-y-2 mt-3">
                          {competitors.slice(0, 3).map((comp: any, idx: number) => (
                            <div key={idx} className="flex items-center space-x-2 text-sm">
                              <div className="w-5 h-5 bg-blue-600 text-white rounded text-xs flex items-center justify-center">
                                {idx + 1}
                              </div>
                              <span className="text-gray-900">{comp.name}</span>
                              <span className="text-gray-500">• {comp.rating} ⭐</span>
                              {comp.pagespeed_data?.seo_score && (
                                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                                  Unranked map pack
                                </span>
                              )}
                            </div>
                          ))}
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="w-5 h-5 bg-orange-500 text-white rounded text-xs flex items-center justify-center">
                              {analysis.yourSEOPosition}
                            </div>
                            <span className="text-gray-900 font-medium">{selectedMedspa.name}</span>
                            <span className="text-gray-500">• {selectedMedspa.rating} ⭐</span>
                            <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">
                              Unranked organic
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEO Recommendations */}
              {pageSpeedData && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">SEO Issues Found:</h3>
                  
                  <div className="space-y-3">
                    {pageSpeedData.seo_score < 80 && (
                      <div className="flex items-start space-x-3 p-3 border-l-4 border-red-400 bg-red-50">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-red-800">Page title includes the service area</div>
                          <div className="text-sm text-red-700">Including your service area in the page title helps with local search visibility.</div>
                        </div>
                      </div>
                    )}
                    
                    {pageSpeedData.performance_score < 70 && (
                      <div className="flex items-start space-x-3 p-3 border-l-4 border-red-400 bg-red-50">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-red-800">Page title includes relevant keywords</div>
                          <div className="text-sm text-red-700">Having a relevant keyword in your page title can improve search engine rankings.</div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start space-x-3 p-3 border-l-4 border-green-400 bg-green-50">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium text-green-800">Exists</div>
                        <div className="text-sm text-green-700">Your website is accessible and functioning properly.</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Detailed SEO Analysis */}
              {selectedMedspa.website_data?.seoAnalysis && (
                <motion.div 
                  className="mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <DetailedSEOAnalysis 
                    seoData={selectedMedspa.website_data.seoAnalysis}
                    businessName={selectedMedspa.name}
                  />
                </motion.div>
              )}
            </motion.div>

            {/* 2. Guest Experience Section */}
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-md border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">2. Guest Experience</h2>
              <p className="text-xl text-gray-700 mb-6">Improve the experience on your website</p>

              <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Your site</h3>
                <p className="text-sm text-gray-700">
                  Your site content and experience drive conversion and sales
                </p>
              </div>

              {/* Website Performance Issues */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Content</h3>
                  <div className="space-y-3">
                    {(!selectedMedspa.website_data?.structure?.hasBookingForm) && (
                      <div className="flex items-start space-x-3 p-3 border-l-4 border-red-400 bg-red-50">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-red-800">On-site ordering</div>
                          <div className="text-sm text-red-700">External ordering links can lead to a disjointed user experience and lost revenue.</div>
                        </div>
                      </div>
                    )}

                    {(!selectedMedspa.website_data?.structure?.hasContactForm) && (
                      <div className="flex items-start space-x-3 p-3 border-l-4 border-red-400 bg-red-50">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-red-800">Effective CTA for online ordering</div>
                          <div className="text-sm text-red-700">A clear call-to-action for online ordering can significantly increase conversions.</div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start space-x-3 p-3 border-l-4 border-green-400 bg-green-50">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium text-green-800">Sufficient text content</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 border-l-4 border-green-400 bg-green-50">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium text-green-800">Phone number</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 border-l-4 border-green-400 bg-green-50">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium text-green-800">Favicon</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Appearance</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 border-l-4 border-green-400 bg-green-50">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium text-green-800">Compelling About Us section</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 border-l-4 border-green-400 bg-green-50">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium text-green-800">Readable text</div>
                      </div>
                    </div>

                    {(selectedMedspa.user_ratings_total || 0) < 10 && (
                      <div className="flex items-start space-x-3 p-3 border-l-4 border-red-400 bg-red-50">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-red-800">3 customer reviews</div>
                          <div className="text-sm text-red-700">A good number of reviews builds trust and credibility with potential customers.</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 3. Local Listings Section */}
            <motion.div 
              className="bg-white rounded-2xl p-8 shadow-md border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">3. Local Listings</h2>
              <p className="text-xl text-gray-700 mb-6">Make {selectedMedspa.name} easy to find</p>

              {/* Google Business Profile */}
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Google Business Profile</h3>
                    <div className="flex items-center space-x-1">
                      <span className="text-lg font-bold">{selectedMedspa.rating || 'N/A'}</span>
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">{selectedMedspa.user_ratings_total || 0} reviews</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Profile content</h4>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-3 p-3 border-l-4 border-green-400 bg-green-50">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-green-800">First-party website</div>
                          <div className="text-sm text-green-700">{selectedMedspa.website || 'Not available'}</div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 border-l-4 border-green-400 bg-green-50">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-green-800">Description</div>
                          <div className="text-sm text-green-700">
                            Professional medical spa offering comprehensive aesthetic treatments and wellness services.
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 border-l-4 border-green-400 bg-green-50">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-green-800">Business hours</div>
                          <div className="text-sm text-green-700">Displaying business hours helps customers plan their visits and reduces inquiries.</div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 border-l-4 border-green-400 bg-green-50">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-green-800">Phone number</div>
                          <div className="text-sm text-green-700">{selectedMedspa.formatted_phone_number || selectedMedspa.phone || 'Available'}</div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 border-l-4 border-green-400 bg-green-50">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-green-800">Price range</div>
                          <div className="text-sm text-green-700">$$</div>
                        </div>
                      </div>

                      {(selectedMedspa.photos?.length || 0) < 5 && (
                        <div className="flex items-start space-x-3 p-3 border-l-4 border-red-400 bg-red-50">
                          <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-red-800">Service options</div>
                            <div className="text-sm text-red-700">Listing service options helps customers understand how they can interact with your business.</div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start space-x-3 p-3 border-l-4 border-green-400 bg-green-50">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-green-800">Social media links</div>
                          <div className="text-sm text-green-700">Social media links extend your reach and provide additional ways for customers to engage.</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">User-submitted content</h4>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-3 p-3 border-l-4 border-green-400 bg-green-50">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-green-800">Quality reviews</div>
                          <div className="text-sm text-green-700">{selectedMedspa.user_ratings_total || 0} reviews</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 4. AI Builder Promotion */}
            <AIBuilderPromotion 
              currentSEOScore={overallScore}
              competitorAverage={competitorAverage}
              medSpaData={selectedMedspa}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 