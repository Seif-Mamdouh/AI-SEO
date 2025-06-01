import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, location, userLocation } = body

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

    // Build search query with location
    let searchQuery = `${query} med spa OR medical spa OR aesthetic clinic`
    if (location && location.trim()) {
      searchQuery += ` in ${location}`
    }
    
    // Use Google Places Text Search API
    let placesUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&type=spa&key=${googleApiKey}`
    
    // Add location bias if user location is available
    if (userLocation && userLocation.lat && userLocation.lng) {
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