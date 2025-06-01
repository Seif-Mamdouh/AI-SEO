'use client'

import { Search, TrendingUp, AlertCircle, Users, ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

export const dynamic = 'force-dynamic'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedMedspa, setSelectedMedspa] = useState<any>(null)
  const [competitorAnalysis, setCompetitorAnalysis] = useState<any[]>([])
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

  const getMyReport = () => {
    if (selectedMedspa) {
      // Trigger report generation
      console.log('Generating report for:', selectedMedspa.name)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <span className="text-xl font-semibold text-gray-900">MedSpaGPT</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
        <div className="w-full max-w-2xl text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Whats your med spa&apos;s name?
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              I&apos;ll scan your site in seconds and make sure you&apos;re beating your competitors.
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full max-w-lg mx-auto" ref={searchRef}>
            {/* Main Search Input with Suggestions */}
            <div className="relative">
              <input
                type="text"
                placeholder="Find your med spa or clinic (e.g., 'Glow Med Spa NYC' or 'med spa in Los Angeles')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => searchSuggestions.length > 0 && setShowSuggestions(true)}
                className="w-full px-6 py-4 text-lg bg-gray-100 border-0 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all duration-200 placeholder-gray-500"
              />
              <button 
                onClick={handleSearch}
                disabled={isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black rounded-xl flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Search className="w-5 h-5 text-white" />
                )}
              </button>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 z-10 max-h-80 overflow-y-auto">
                  {searchSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 first:rounded-t-2xl last:rounded-b-2xl"
                    >
                      <div className="font-medium text-gray-900">{suggestion.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{suggestion.formatted_address}</div>
                      {suggestion.rating && (
                        <div className="flex items-center mt-2">
                          <span className="text-yellow-500 text-sm">★</span>
                          <span className="ml-1 text-sm text-gray-700">{suggestion.rating}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

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
          <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
            <button className="inline-flex items-center space-x-3 px-6 py-3 bg-green-100 hover:bg-green-200 rounded-full transition-colors group">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="text-green-800 font-medium">Hows my Google SEO?</span>
            </button>

            <button className="inline-flex items-center space-x-3 px-6 py-3 bg-orange-100 hover:bg-orange-200 rounded-full transition-colors group">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-orange-800 font-medium">Whats broken on my site?</span>
            </button>

            <button className="inline-flex items-center space-x-3 px-6 py-3 bg-yellow-100 hover:bg-yellow-200 rounded-full transition-colors group">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="text-yellow-800 font-medium">Whos beating me and how?</span>
            </button>
          </div>

          {/* Competitive Analysis Section */}
          {selectedMedspa && (
            <div className="w-full max-w-4xl mx-auto mt-12 space-y-6">
              {/* Compare Section */}
              <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-6 h-6 text-gray-700" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Compare yourself with your local competition
                    </h2>
                  </div>
                  <button
                    onClick={getMyReport}
                    className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium flex items-center space-x-2"
                  >
                    <span>Get my report</span>
                    <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                  </button>
                </div>

                <div className="text-center">
                  <input
                    type="text"
                    value={selectedMedspa.name}
                    readOnly
                    className="w-full max-w-md px-4 py-3 text-center bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium"
                  />
                </div>
              </div>

              {/* Competitor Analysis Results */}
              {competitorAnalysis.length > 0 && (
                <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Who&apos;s beating you on Google</h3>
                  
                  {/* Analysis Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {competitorAnalysis.filter(c => (c.rating || 0) > (selectedMedspa.rating || 0)).length}
                      </div>
                      <div className="text-sm text-blue-700">Competitors ahead</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {competitorAnalysis.length > 0 
                          ? (competitorAnalysis.reduce((sum, comp) => sum + (comp.rating || 0), 0) / competitorAnalysis.length).toFixed(1)
                          : '0'
                        }
                      </div>
                      <div className="text-sm text-green-700">Average competitor rating</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        #{competitorAnalysis.filter(c => (c.rating || 0) > (selectedMedspa.rating || 0)).length + 1}
                      </div>
                      <div className="text-sm text-orange-700">Your position</div>
                    </div>
                  </div>

                  {/* Competitor List */}
                  <div className="space-y-3">
                    {competitorAnalysis.map((competitor, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{competitor.name}</h4>
                              <p className="text-sm text-gray-600">{competitor.formatted_address}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          {competitor.rating && (
                            <div className="flex items-center">
                              <span className="text-yellow-500">★</span>
                              <span className="ml-1 font-medium">{competitor.rating}</span>
                              <span className="text-sm text-gray-500 ml-1">
                                ({competitor.user_ratings_total || 0})
                              </span>
                            </div>
                          )}
                          {competitor.website && (
                            <a 
                              href={competitor.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Website
                            </a>
                          )}
                          <div className={`text-sm px-2 py-1 rounded ${
                            (competitor.rating || 0) > (selectedMedspa.rating || 0)
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {(competitor.rating || 0) > (selectedMedspa.rating || 0) ? 'Ahead' : 'Behind'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

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
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
