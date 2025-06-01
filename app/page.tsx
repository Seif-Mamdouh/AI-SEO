'use client'

import { Search, TrendingUp, AlertCircle, Users, ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const dynamic = 'force-dynamic'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedMedspa, setSelectedMedspa] = useState<any>(null)
  const [competitorAnalysis, setCompetitorAnalysis] = useState<any[]>([])
  const [seoAnalysis, setSeoAnalysis] = useState<any>(null)
  const [isLoadingSEO, setIsLoadingSEO] = useState(false)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log('Geolocation error:', error)
        }
      )
    }
  }, [])

  // Handle clicks outside search suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Fetch search suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 2) {
        try {
          const requestBody: any = { query: searchQuery }
          
          if (userLocation) {
            requestBody.userLocation = userLocation
          }

          const response = await fetch('/api/search-medspas', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          })

          if (response.ok) {
            const data = await response.json()
            setSearchSuggestions(data.results?.slice(0, 6) || [])
            setShowSuggestions(true)
          }
        } catch (error) {
          console.error('Error fetching suggestions:', error)
        }
      } else {
        setSearchSuggestions([])
        setShowSuggestions(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery, userLocation])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setShowSuggestions(false)
    
    try {
      const requestBody: any = { query: searchQuery }
      
      if (userLocation) {
        requestBody.userLocation = userLocation
      }

      const response = await fetch('/api/search-medspas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.results || [])
      } else {
        console.error('Search failed')
      }
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = async (suggestion: any) => {
    setSelectedMedspa(suggestion)
    setSearchQuery(suggestion.name)
    setShowSuggestions(false)
    
    // Fetch competitor analysis
    await fetchCompetitorAnalysis(suggestion)
  }

  const fetchCompetitorAnalysis = async (medspa: any) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/competitor-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          medspa: medspa,
          location: medspa.formatted_address || 'nearby'
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setCompetitorAnalysis(data.competitors || [])
      }
    } catch (error) {
      console.error('Error fetching competitor analysis:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const getMyReport = async () => {
    if (selectedMedspa) {
      setIsLoadingSEO(true)
      try {
        console.log('Generating SEO report for:', selectedMedspa.name)
        
        const response = await fetch('/api/seo-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            selectedMedspa: selectedMedspa
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setSeoAnalysis(data)
          console.log('SEO Analysis completed:', data)
        } else {
          console.error('SEO analysis failed')
          // You might want to show an error message to the user
        }
      } catch (error) {
        console.error('Error generating SEO report:', error)
        // You might want to show an error message to the user
      } finally {
        setIsLoadingSEO(false)
      }
    }
  }

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const searchInputVariants = {
    initial: { scale: 1 },
    focus: { scale: 1.02 },
    tap: { scale: 0.98 }
  }

  const suggestionVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.2 }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between px-6 py-4"
        {...fadeInUp}
      >
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <motion.div 
            className="w-8 h-8 bg-black rounded-full flex items-center justify-center"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </motion.div>
          <span className="text-xl font-semibold text-gray-900">MedSpaGPT</span>
        </motion.div>
      </motion.div>

      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
        <div className="w-full max-w-2xl text-center space-y-8">
          {/* Main Heading */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Whats your med spa&apos;s name?
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-600 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              I&apos;ll scan your site in seconds and make sure you&apos;re beating your competitors.
            </motion.p>
          </motion.div>

          {/* Search Input */}
          <motion.div 
            className="w-full max-w-lg mx-auto" 
            ref={searchRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {/* Main Search Input with Suggestions */}
            <div className="relative">
              <motion.input
                type="text"
                placeholder="Find your med spa or clinic (e.g., 'Glow Med Spa NYC' or 'med spa in Los Angeles')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => searchSuggestions.length > 0 && setShowSuggestions(true)}
                className="w-full px-6 py-4 text-lg bg-gray-100 border-0 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all duration-200 placeholder-gray-500"
                variants={searchInputVariants}
                whileFocus="focus"
                whileTap="tap"
                initial="initial"
                animate="initial"
              />
              <motion.button 
                onClick={handleSearch}
                disabled={isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black rounded-xl flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div 
                      key="loading"
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360, opacity: 1 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      initial={{ opacity: 0 }}
                      exit={{ opacity: 0 }}
                    />
                  ) : (
                    <motion.div
                      key="search"
                      initial={{ opacity: 0, rotate: -45 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 45 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Search className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Search Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && searchSuggestions.length > 0 && (
                  <motion.div 
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 z-10 max-h-80 overflow-y-auto"
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <motion.div
                      variants={staggerContainer}
                      initial="initial"
                      animate="animate"
                    >
                      {searchSuggestions.map((suggestion, index) => (
                        <motion.div
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 first:rounded-t-2xl last:rounded-b-2xl"
                          variants={suggestionVariants}
                          whileHover={{ x: 4, backgroundColor: "#f9fafb" }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <motion.div 
                            className="font-medium text-gray-900"
                            layoutId={`suggestion-${index}`}
                          >
                            {suggestion.name}
                          </motion.div>
                          <div className="text-sm text-gray-600 mt-1">{suggestion.formatted_address}</div>
                          {suggestion.rating && (
                            <motion.div 
                              className="flex items-center mt-2"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.1 }}
                            >
                              <span className="text-yellow-500 text-sm">★</span>
                              <span className="ml-1 text-sm text-gray-700">{suggestion.rating}</span>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="w-full max-w-4xl mx-auto mt-8 space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">Found Med Spas:</h2>
              <div className="grid gap-6">
                {searchResults.map((place, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{place.name}</h3>
                        <p className="text-gray-600 mb-3 flex items-start">
                          <span className="text-gray-400 mr-2">📍</span>
                          {place.formatted_address}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          {place.rating && (
                            <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                              <span className="text-yellow-500 mr-1">★</span>
                              <span className="font-medium text-gray-700">{place.rating}</span>
                              {place.user_ratings_total && (
                                <span className="ml-1 text-gray-500 text-sm">({place.user_ratings_total} reviews)</span>
                              )}
                            </div>
                          )}
                          
                          {place.phone && (
                            <div className="flex items-center text-gray-600">
                              <span className="mr-2">📞</span>
                              <span className="text-sm">{place.phone}</span>
                            </div>
                          )}
                        </div>

                        {place.opening_hours?.weekday_text && (
                          <div className="mb-4">
                            <details className="group">
                              <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 flex items-center">
                                <span className="mr-2">🕒</span>
                                Hours
                                <span className="ml-1 group-open:rotate-180 transition-transform">▼</span>
                              </summary>
                              <div className="mt-2 ml-6 text-sm text-gray-600 space-y-1">
                                {place.opening_hours.weekday_text.slice(0, 3).map((hours: string, idx: number) => (
                                  <div key={idx}>{hours}</div>
                                ))}
                                {place.opening_hours.weekday_text.length > 3 && (
                                  <div className="text-gray-500">+{place.opening_hours.weekday_text.length - 3} more...</div>
                                )}
                              </div>
                            </details>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0 md:ml-4">
                        {place.website && (
                          <a 
                            href={place.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            Visit Website
                          </a>
                        )}
                        <button className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                          Analyze SEO
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {searchResults.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No med spas found. Try a different search term.</p>
                </div>
              )}
            </div>
          )}

          {/* Suggestion Buttons */}
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-4 pt-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.button 
              className="inline-flex items-center space-x-3 px-6 py-3 bg-green-100 hover:bg-green-200 rounded-full transition-colors group"
              variants={fadeInUp}
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: "#dcfce7",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div 
                className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <TrendingUp className="w-4 h-4 text-white" />
              </motion.div>
              <span className="text-green-800 font-medium">Hows my Google SEO?</span>
            </motion.button>

            <motion.button 
              className="inline-flex items-center space-x-3 px-6 py-3 bg-orange-100 hover:bg-orange-200 rounded-full transition-colors group"
              variants={fadeInUp}
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: "#fed7aa",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div 
                className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <AlertCircle className="w-4 h-4 text-white" />
              </motion.div>
              <span className="text-orange-800 font-medium">Whats broken on my site?</span>
            </motion.button>

            <motion.button 
              className="inline-flex items-center space-x-3 px-6 py-3 bg-yellow-100 hover:bg-yellow-200 rounded-full transition-colors group"
              variants={fadeInUp}
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: "#fef3c7",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div 
                className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Users className="w-4 h-4 text-white" />
              </motion.div>
              <span className="text-yellow-800 font-medium">Whos beating me and how?</span>
            </motion.button>
          </motion.div>

          {/* Competitive Analysis Section */}
          <AnimatePresence>
            {selectedMedspa && (
              <motion.div 
                className="w-full max-w-4xl mx-auto mt-12 space-y-6"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
              >
                {/* Compare Section */}
                <motion.div 
                  className="bg-white rounded-2xl p-8 shadow-md border border-gray-100"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  whileHover={{ y: -2, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                >
                  <motion.div 
                    className="flex items-center justify-between mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <TrendingUp className="w-6 h-6 text-gray-700" />
                      </motion.div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Compare yourself with your local competition
                      </h2>
                    </div>
                    <motion.button
                      onClick={getMyReport}
                      disabled={isLoadingSEO}
                      className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50"
                      whileHover={{ scale: isLoadingSEO ? 1 : 1.05, backgroundColor: isLoadingSEO ? "#000000" : "#374151" }}
                      whileTap={{ scale: isLoadingSEO ? 1 : 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <span>{isLoadingSEO ? 'Analyzing SEO...' : 'Get my report'}</span>
                      <motion.div
                        animate={{ 
                          x: isLoadingSEO ? 0 : [0, 4, 0],
                          rotate: isLoadingSEO ? 360 : 0
                        }}
                        transition={{ 
                          x: { duration: 1.5, repeat: isLoadingSEO ? 0 : Infinity },
                          rotate: { duration: 1, repeat: isLoadingSEO ? Infinity : 0, ease: "linear" }
                        }}
                      >
                        {isLoadingSEO ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                        )}
                      </motion.div>
                    </motion.button>
                  </motion.div>

                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <motion.input
                      type="text"
                      value={selectedMedspa.name}
                      readOnly
                      className="w-full max-w-md px-4 py-3 text-center bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium"
                      whileFocus={{ scale: 1.02, borderColor: "#3b82f6" }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>
                </motion.div>

                {/* Competitor Analysis Results */}
                <AnimatePresence>
                  {competitorAnalysis.length > 0 && (
                    <motion.div 
                      className="bg-white rounded-2xl p-8 shadow-md border border-gray-100"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <motion.h3 
                        className="text-lg font-semibold text-gray-900 mb-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                      >
                        Who&apos;s beating you on Google
                      </motion.h3>
                      
                      {/* Analysis Summary */}
                      <motion.div 
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                      >
                        <motion.div 
                          className="bg-blue-50 p-4 rounded-lg text-center"
                          variants={fadeInUp}
                          whileHover={{ scale: 1.05, y: -2 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <motion.div 
                            className="text-2xl font-bold text-blue-600"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                          >
                            {competitorAnalysis.filter(c => (c.rating || 0) > (selectedMedspa.rating || 0)).length}
                          </motion.div>
                          <div className="text-sm text-blue-700">Competitors ahead</div>
                        </motion.div>
                        <motion.div 
                          className="bg-green-50 p-4 rounded-lg text-center"
                          variants={fadeInUp}
                          whileHover={{ scale: 1.05, y: -2 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <motion.div 
                            className="text-2xl font-bold text-green-600"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
                          >
                            {competitorAnalysis.length > 0 
                              ? (competitorAnalysis.reduce((sum, comp) => sum + (comp.rating || 0), 0) / competitorAnalysis.length).toFixed(1)
                              : '0'
                            }
                          </motion.div>
                          <div className="text-sm text-green-700">Average competitor rating</div>
                        </motion.div>
                        <motion.div 
                          className="bg-orange-50 p-4 rounded-lg text-center"
                          variants={fadeInUp}
                          whileHover={{ scale: 1.05, y: -2 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <motion.div 
                            className="text-2xl font-bold text-orange-600"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.7 }}
                          >
                            #{competitorAnalysis.filter(c => (c.rating || 0) > (selectedMedspa.rating || 0)).length + 1}
                          </motion.div>
                          <div className="text-sm text-orange-700">Your position</div>
                        </motion.div>
                      </motion.div>

                      {/* Competitor List */}
                      <motion.div 
                        className="space-y-3"
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                      >
                        {competitorAnalysis.map((competitor, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            variants={{
                              initial: { opacity: 0, x: -50 },
                              animate: { opacity: 1, x: 0 }
                            }}
                            whileHover={{ 
                              x: 4, 
                              backgroundColor: "#f3f4f6",
                              transition: { duration: 0.2 }
                            }}
                            transition={{ 
                              type: "spring", 
                              stiffness: 300, 
                              damping: 20,
                              delay: index * 0.1 + 0.4
                            }}
                          >
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <motion.div 
                                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600"
                                  whileHover={{ scale: 1.1, backgroundColor: "#e5e7eb" }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                  {index + 1}
                                </motion.div>
                                <div>
                                  <h4 className="font-medium text-gray-900">{competitor.name}</h4>
                                  <p className="text-sm text-gray-600">{competitor.formatted_address}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-6">
                              {competitor.rating && (
                                <motion.div 
                                  className="flex items-center"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.1 + 0.6 }}
                                >
                                  <span className="text-yellow-500">★</span>
                                  <span className="ml-1 font-medium">{competitor.rating}</span>
                                  <span className="text-sm text-gray-500 ml-1">
                                    ({competitor.user_ratings_total || 0})
                                  </span>
                                </motion.div>
                              )}
                              {competitor.website && (
                                <motion.a 
                                  href={competitor.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Website
                                </motion.a>
                              )}
                              <motion.div 
                                className={`text-sm px-2 py-1 rounded ${
                                  (competitor.rating || 0) > (selectedMedspa.rating || 0)
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-green-100 text-green-700'
                                }`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 + 0.7 }}
                                whileHover={{ scale: 1.05 }}
                              >
                                {(competitor.rating || 0) > (selectedMedspa.rating || 0) ? 'Ahead' : 'Behind'}
                              </motion.div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>

                      {/* Action Items */}
                      <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                        <h4 className="font-semibold text-blue-900 mb-3">Improvement Opportunities</h4>
                        <ul className="space-y-2 text-sm text-blue-800">
                          {(selectedMedspa.rating || 0) < 4.5 && (
                            <li>• Focus on improving customer satisfaction to increase your rating</li>
                          )}
                          {(selectedMedspa.user_ratings_total || 0) < 50 && (
                            <li>• Encourage more customers to leave reviews</li>
                          )}
                          {!selectedMedspa.website && (
                            <li>• Create a professional website to improve online presence</li>
                          )}
                          <li>• Optimize your Google Business Profile with photos and regular updates</li>
                          <li>• Consider local SEO strategies to improve visibility</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* SEO Analysis Results */}
                <AnimatePresence>
                  {seoAnalysis && (
                    <motion.div 
                      className="bg-white rounded-2xl p-8 shadow-md border border-gray-100"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <motion.h3 
                        className="text-lg font-semibold text-gray-900 mb-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                      >
                        🚀 SEO Performance Analysis
                      </motion.h3>
                      
                      {/* SEO Summary */}
                      <motion.div 
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                      >
                        <motion.div 
                          className="bg-purple-50 p-4 rounded-lg text-center"
                          variants={fadeInUp}
                          whileHover={{ scale: 1.05, y: -2 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <motion.div 
                            className="text-2xl font-bold text-purple-600"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                          >
                            #{seoAnalysis.analysis.yourSEOPosition}
                          </motion.div>
                          <div className="text-sm text-purple-700">Your SEO position</div>
                        </motion.div>
                        <motion.div 
                          className="bg-blue-50 p-4 rounded-lg text-center"
                          variants={fadeInUp}
                          whileHover={{ scale: 1.05, y: -2 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <motion.div 
                            className="text-2xl font-bold text-blue-600"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
                          >
                            {seoAnalysis.selectedMedspa.pagespeed_data?.performance_score || 'N/A'}
                          </motion.div>
                          <div className="text-sm text-blue-700">Performance score</div>
                        </motion.div>
                        <motion.div 
                          className="bg-green-50 p-4 rounded-lg text-center"
                          variants={fadeInUp}
                          whileHover={{ scale: 1.05, y: -2 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <motion.div 
                            className="text-2xl font-bold text-green-600"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.7 }}
                          >
                            {seoAnalysis.selectedMedspa.pagespeed_data?.seo_score || 'N/A'}
                          </motion.div>
                          <div className="text-sm text-green-700">SEO score</div>
                        </motion.div>
                        <motion.div 
                          className="bg-orange-50 p-4 rounded-lg text-center"
                          variants={fadeInUp}
                          whileHover={{ scale: 1.05, y: -2 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <motion.div 
                            className="text-2xl font-bold text-orange-600"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.8 }}
                          >
                            {seoAnalysis.analysis.competitorsWithWebsites}
                          </motion.div>
                          <div className="text-sm text-orange-700">Competitors analyzed</div>
                        </motion.div>
                      </motion.div>

                      {/* Competitor SEO Rankings */}
                      {seoAnalysis.competitors.length > 0 && (
                        <motion.div 
                          className="space-y-3 mb-8"
                          variants={staggerContainer}
                          initial="initial"
                          animate="animate"
                        >
                          <h4 className="font-semibold text-gray-900 mb-4">🏆 SEO Rankings vs Competitors</h4>
                          {seoAnalysis.competitors.map((competitor: any, index: number) => (
                            <motion.div
                              key={index}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                              variants={{
                                initial: { opacity: 0, x: -50 },
                                animate: { opacity: 1, x: 0 }
                              }}
                              whileHover={{ 
                                x: 4, 
                                backgroundColor: "#f3f4f6",
                                transition: { duration: 0.2 }
                              }}
                              transition={{ 
                                type: "spring", 
                                stiffness: 300, 
                                damping: 20,
                                delay: index * 0.1 + 0.5
                              }}
                            >
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <motion.div 
                                    className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-medium text-purple-600"
                                    whileHover={{ scale: 1.1, backgroundColor: "#e9d5ff" }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  >
                                    {index + 1}
                                  </motion.div>
                                  <div>
                                    <h5 className="font-medium text-gray-900">{competitor.name}</h5>
                                    <p className="text-sm text-gray-600">{competitor.distance_miles} miles away</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                {competitor.pagespeed_data && !competitor.pagespeed_data.error ? (
                                  <>
                                    <div className="text-center">
                                      <div className="text-sm font-medium">{competitor.pagespeed_data.performance_score}</div>
                                      <div className="text-xs text-gray-500">Performance</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-sm font-medium">{competitor.pagespeed_data.seo_score}</div>
                                      <div className="text-xs text-gray-500">SEO</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-lg font-bold text-purple-600">{competitor.seo_rank}</div>
                                      <div className="text-xs text-gray-500">Overall</div>
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-sm text-gray-500">No website</div>
                                )}
                                {competitor.website && (
                                  <motion.a 
                                    href={competitor.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    🔗
                                  </motion.a>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      {/* SEO Recommendations */}
                      {seoAnalysis.analysis.recommendations.length > 0 && (
                        <motion.div 
                          className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.7 }}
                        >
                          <h4 className="font-semibold text-purple-900 mb-3">💡 SEO Improvement Recommendations</h4>
                          <ul className="space-y-2 text-sm text-purple-800">
                            {seoAnalysis.analysis.recommendations.map((rec: string, index: number) => (
                              <motion.li 
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                              >
                                • {rec}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}

                      {/* Technical Details */}
                      {seoAnalysis.selectedMedspa.pagespeed_data && !seoAnalysis.selectedMedspa.pagespeed_data.error && (
                        <motion.div 
                          className="mt-6 p-6 bg-gray-50 rounded-xl"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.9 }}
                        >
                          <h4 className="font-semibold text-gray-900 mb-3">🔧 Technical Performance Details</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-gray-600">Performance</div>
                              <div className="font-medium text-lg">{seoAnalysis.selectedMedspa.pagespeed_data.performance_score}/100</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Accessibility</div>
                              <div className="font-medium text-lg">{seoAnalysis.selectedMedspa.pagespeed_data.accessibility_score || 'N/A'}/100</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Best Practices</div>
                              <div className="font-medium text-lg">{seoAnalysis.selectedMedspa.pagespeed_data.best_practices_score || 'N/A'}/100</div>
                            </div>
                            <div>
                              <div className="text-gray-600">SEO Score</div>
                              <div className="font-medium text-lg">{seoAnalysis.selectedMedspa.pagespeed_data.seo_score}/100</div>
                            </div>
                          </div>
                          {seoAnalysis.selectedMedspa.pagespeed_data.largest_contentful_paint && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="text-xs text-gray-600 mb-2">Core Web Vitals:</div>
                              <div className="text-sm">
                                <span className="font-medium">LCP:</span> {(seoAnalysis.selectedMedspa.pagespeed_data.largest_contentful_paint / 1000).toFixed(2)}s
                                {seoAnalysis.selectedMedspa.pagespeed_data.cumulative_layout_shift && (
                                  <span className="ml-4"><span className="font-medium">CLS:</span> {seoAnalysis.selectedMedspa.pagespeed_data.cumulative_layout_shift.toFixed(3)}</span>
                                )}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}
