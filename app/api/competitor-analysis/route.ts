import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { medspa, location } = body

    if (!medspa) {
      return NextResponse.json(
        { error: 'Medspa information is required' },
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

    // Extract location from the selected medspa's address
    const medSpaLocation = medspa.formatted_address || location
    
    // Search for nearby competitors
    const competitorQuery = `medical spa OR med spa OR aesthetic clinic OR dermatology near ${medSpaLocation}`
    
    const placesUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(competitorQuery)}&type=spa&key=${googleApiKey}`

    const placesResponse = await fetch(placesUrl)
    const placesData = await placesResponse.json()

    if (!placesResponse.ok) {
      console.error('Google Places API error:', placesData)
      return NextResponse.json(
        { error: 'Failed to search competitors' },
        { status: 500 }
      )
    }

    // Filter out the selected medspa and focus on competitors
    const competitors = placesData.results?.filter((place: any) => {
      const name = place.name.toLowerCase()
      const selectedName = medspa.name.toLowerCase()
      const types = place.types || []
      
      // Exclude the selected medspa itself
      if (name === selectedName || place.place_id === medspa.place_id) {
        return false
      }
      
      // Focus on medical spas and aesthetic clinics
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

    // Sort by rating (higher ratings first) and limit to top 8
    const sortedCompetitors = competitors
      .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 8)

    // Get detailed information for top competitors
    const detailedCompetitors = await Promise.all(
      sortedCompetitors.map(async (competitor: any, index: number) => {
        try {
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${competitor.place_id}&fields=name,formatted_address,rating,user_ratings_total,website,formatted_phone_number&key=${googleApiKey}`
          
          const detailsResponse = await fetch(detailsUrl)
          const detailsData = await detailsResponse.json()

          if (detailsResponse.ok && detailsData.result) {
            return {
              place_id: competitor.place_id,
              name: detailsData.result.name,
              formatted_address: detailsData.result.formatted_address,
              rating: detailsData.result.rating,
              user_ratings_total: detailsData.result.user_ratings_total,
              website: detailsData.result.website,
              phone: detailsData.result.formatted_phone_number,
              position: index + 1,
              competitiveScore: calculateCompetitiveScore(detailsData.result, medspa)
            }
          }
          
          return {
            place_id: competitor.place_id,
            name: competitor.name,
            formatted_address: competitor.formatted_address,
            rating: competitor.rating,
            user_ratings_total: competitor.user_ratings_total,
            position: index + 1,
            competitiveScore: calculateCompetitiveScore(competitor, medspa)
          }
        } catch (error) {
          console.error('Error fetching competitor details:', error)
          return {
            place_id: competitor.place_id,
            name: competitor.name,
            formatted_address: competitor.formatted_address,
            rating: competitor.rating,
            user_ratings_total: competitor.user_ratings_total,
            position: index + 1,
            competitiveScore: 0
          }
        }
      })
    )

    return NextResponse.json({
      competitors: detailedCompetitors,
      selectedMedspa: medspa,
      analysisMetrics: {
        averageRating: detailedCompetitors.reduce((sum: number, comp: any) => sum + (comp.rating || 0), 0) / detailedCompetitors.length,
        totalCompetitors: detailedCompetitors.length,
        yourPosition: determinePosition(medspa, detailedCompetitors)
      }
    })

  } catch (error) {
    console.error('Competitor analysis API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function calculateCompetitiveScore(competitor: any, selectedMedspa: any): number {
  let score = 0
  
  // Rating score (40% weight)
  const rating = competitor.rating || 0
  const selectedRating = selectedMedspa.rating || 0
  score += (rating / 5) * 40
  
  // Review count score (30% weight)
  const reviewCount = competitor.user_ratings_total || 0
  const selectedReviewCount = selectedMedspa.user_ratings_total || 0
  const reviewScore = Math.min(reviewCount / Math.max(selectedReviewCount, 100), 1)
  score += reviewScore * 30
  
  // Website presence (20% weight)
  if (competitor.website) {
    score += 20
  }
  
  // Name optimization (10% weight)
  const name = competitor.name?.toLowerCase() || ''
  if (name.includes('med spa') || name.includes('medical spa') || name.includes('aesthetic')) {
    score += 10
  }
  
  return Math.round(score)
}

function determinePosition(selectedMedspa: any, competitors: any[]): number {
  const selectedRating = selectedMedspa.rating || 0
  const betterCompetitors = competitors.filter(comp => (comp.rating || 0) > selectedRating)
  return betterCompetitors.length + 1
} 