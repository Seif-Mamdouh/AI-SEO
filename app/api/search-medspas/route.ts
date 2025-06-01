import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, userLocation } = body

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      )
    }

    const googleApiKey = process.env.GOOGLE_PLACES_API_KEY

    if (!googleApiKey) {
      return NextResponse.json(
        { error: 'Google Places API key not configured' },
        { status: 500 }
      )
    }

    // Parse the query to extract potential location information
    const parseSearchQuery = (searchQuery: string) => {
      const locationKeywords = ['in', 'at', 'near', 'around']
      const commonCities = ['nyc', 'la', 'sf', 'miami', 'chicago', 'houston', 'dallas', 'atlanta', 'boston', 'seattle']
      const stateAbbreviations = ['ny', 'ca', 'fl', 'tx', 'il', 'ga', 'ma', 'wa', 'az', 'nv', 'co', 'nc', 'sc']
      
      let medSpaName = searchQuery
      let location = ''
      
      // Check for location keywords
      for (const keyword of locationKeywords) {
        const keywordIndex = searchQuery.toLowerCase().indexOf(` ${keyword} `)
        if (keywordIndex !== -1) {
          medSpaName = searchQuery.substring(0, keywordIndex).trim()
          location = searchQuery.substring(keywordIndex + keyword.length + 2).trim()
          break
        }
      }
      
      // Check for city/state patterns if no keyword found
      if (!location) {
        const words = searchQuery.toLowerCase().split(' ')
        const lastWord = words[words.length - 1]
        const secondLastWord = words.length > 1 ? words[words.length - 2] : ''
        
        // Check if ends with state abbreviation or common city
        if (stateAbbreviations.includes(lastWord) || commonCities.includes(lastWord)) {
          if (stateAbbreviations.includes(lastWord) && secondLastWord) {
            // Format: "City, ST"
            location = `${secondLastWord} ${lastWord}`
            medSpaName = words.slice(0, -2).join(' ').trim()
          } else {
            // Single city name
            location = lastWord
            medSpaName = words.slice(0, -1).join(' ').trim()
          }
        }
      }
      
      return { medSpaName: medSpaName || searchQuery, location }
    }

    const { medSpaName, location } = parseSearchQuery(query)
    
    // Build search query
    let searchQuery = `${medSpaName} med spa OR medical spa OR aesthetic clinic`
    if (location) {
      searchQuery += ` in ${location}`
    }
    
    // Use Google Places Text Search API
    let placesUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&type=spa&key=${googleApiKey}`
    
    // Add location bias if user location is available and no location was parsed
    if (userLocation && userLocation.lat && userLocation.lng && !location) {
      placesUrl += `&location=${userLocation.lat},${userLocation.lng}&radius=50000`
    }

    const placesResponse = await fetch(placesUrl)
    const placesData = await placesResponse.json()

    if (!placesResponse.ok) {
      console.error('Google Places API error:', placesData)
      return NextResponse.json(
        { error: 'Failed to search places' },
        { status: 500 }
      )
    }

    // Filter results to focus on medical spas and aesthetic clinics
    const filteredResults = placesData.results?.filter((place: any) => {
      const name = place.name.toLowerCase()
      const types = place.types || []
      
      return (
        name.includes('med spa') ||
        name.includes('medical spa') ||
        name.includes('aesthetic') ||
        name.includes('dermatology') ||
        name.includes('cosmetic') ||
        name.includes('laser') ||
        name.includes('botox') ||
        name.includes('filler') ||
        types.includes('spa') ||
        types.includes('health') ||
        types.includes('beauty_salon')
      )
    }) || []

    // Get detailed information for each place
    const detailedResults = await Promise.all(
      filteredResults.slice(0, 5).map(async (place: any) => {
        try {
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,rating,user_ratings_total,website,formatted_phone_number,opening_hours&key=${googleApiKey}`
          
          const detailsResponse = await fetch(detailsUrl)
          const detailsData = await detailsResponse.json()

          if (detailsResponse.ok && detailsData.result) {
            return {
              place_id: place.place_id,
              name: detailsData.result.name,
              formatted_address: detailsData.result.formatted_address,
              rating: detailsData.result.rating,
              user_ratings_total: detailsData.result.user_ratings_total,
              website: detailsData.result.website,
              phone: detailsData.result.formatted_phone_number,
              opening_hours: detailsData.result.opening_hours,
            }
          }
          
          return {
            place_id: place.place_id,
            name: place.name,
            formatted_address: place.formatted_address,
            rating: place.rating,
            user_ratings_total: place.user_ratings_total,
          }
        } catch (error) {
          console.error('Error fetching place details:', error)
          return {
            place_id: place.place_id,
            name: place.name,
            formatted_address: place.formatted_address,
            rating: place.rating,
            user_ratings_total: place.user_ratings_total,
          }
        }
      })
    )

    return NextResponse.json({
      results: detailedResults,
      total: filteredResults.length,
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 