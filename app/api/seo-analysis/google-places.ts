import { NextResponse } from 'next/server'
import { PlaceDetails, CompetitorWithSEO } from './types'

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10 // Round to 1 decimal place
}

export async function getMedSpaDetails(selectedMedspa: PlaceDetails, googleApiKey: string): Promise<PlaceDetails | NextResponse> {
  if (!selectedMedspa.place_id) {
    return NextResponse.json(
      { error: 'No place ID found for med spa' },
      { status: 500 }
    )
  }

  console.log('📍 Step 1: Getting med spa details...')
  
  if (!selectedMedspa.geometry?.location) {
    console.log('🔍 Need to fetch coordinates for med spa')
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${selectedMedspa.place_id}&fields=name,formatted_address,rating,user_ratings_total,website,formatted_phone_number,geometry,reviews,photos&key=${googleApiKey}`
    
    console.log('🌐 Calling Google Places Details API...')
    const detailsResponse = await fetch(detailsUrl)
    const detailsData = await detailsResponse.json()
    console.log('📊 Places Details response status:', detailsResponse.status)
    console.log('🔍 Google Places API Debug:', {
      url: detailsUrl,
      responseStatus: detailsResponse.status,
      hasResult: !!detailsData.result,
      resultKeys: detailsData.result ? Object.keys(detailsData.result) : null,
      reviews: detailsData.result?.reviews,
      reviewsLength: detailsData.result?.reviews?.length || 0,
      rating: detailsData.result?.rating,
      userRatingsTotal: detailsData.result?.user_ratings_total,
      fullResponse: detailsData
    })

    if (!detailsResponse.ok || !detailsData.result) {
      console.log('❌ Failed to get med spa details:', detailsData.error_message || 'Unknown error')
      return NextResponse.json(
        { error: 'Failed to get med spa details' },
        { status: 500 }
      )
    }

    const medSpaDetails = detailsData.result
    console.log('✅ Got med spa details with coordinates:', medSpaDetails.geometry?.location)
    console.log('🔍 Med Spa Details Debug:', {
      name: medSpaDetails.name,
      rating: medSpaDetails.rating,
      userRatingsTotal: medSpaDetails.user_ratings_total,
      hasReviews: !!medSpaDetails.reviews,
      reviewsCount: medSpaDetails.reviews?.length || 0,
      hasPhotos: !!medSpaDetails.photos,
      photosCount: medSpaDetails.photos?.length || 0,
      photos: medSpaDetails.photos
    })
    return medSpaDetails
  } else {
    console.log('✅ Using existing coordinates:', selectedMedspa.geometry?.location)
    return selectedMedspa
  }
}

export async function findNearbyCompetitors(selectedMedspa: PlaceDetails, googleApiKey: string): Promise<any[] | NextResponse> {
  if (!selectedMedspa.geometry?.location) {
    return NextResponse.json(
      { error: 'No coordinates found for med spa' },
      { status: 500 }
    )
  }

  const lat = selectedMedspa.geometry?.location.lat
  const lng = selectedMedspa.geometry?.location.lng

  console.log('🔍 Step 2: Finding nearby competitors...')
  const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=8047&type=beauty_salon|spa&key=${googleApiKey}`
  
  console.log('🌐 Calling Google Places Nearby API...')
  const nearbyResponse = await fetch(nearbyUrl)
  const nearbyData = await nearbyResponse.json()
  console.log('📊 Found places:', nearbyData.results?.length || 0)

  if (!nearbyResponse.ok) {
    console.error('❌ Places Nearby API error:', nearbyData)
    return NextResponse.json(
      { error: 'Failed to find nearby competitors' },
      { status: 500 }
    )
  }

  const competitors = nearbyData.results?.filter((place: any) => {
    const name = place.name.toLowerCase()
    const types = place.types || []
    
    if (place.place_id === selectedMedspa.place_id) {
      return false
    }
    
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
  }).slice(0, 5) || []

  console.log(`🏢 Filtered to ${competitors.length} relevant competitors`)
  return competitors
}

export async function getDetailedCompetitors(competitors: any[], lat: number, lng: number, googleApiKey: string): Promise<CompetitorWithSEO[]> {
  console.log('📍 Step 3: Getting detailed competitor information in parallel...')
  
  const detailedCompetitors: CompetitorWithSEO[] = await Promise.all(
    competitors.map(async (competitor: any, index: number): Promise<CompetitorWithSEO> => {
      console.log(`🔍 Processing competitor ${index + 1}/${competitors.length}: ${competitor.name}`)
      try {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${competitor.place_id}&fields=name,formatted_address,rating,user_ratings_total,website,formatted_phone_number,geometry&key=${googleApiKey}`
        
        const detailsResponse = await fetch(detailsUrl)
        const detailsData = await detailsResponse.json()

        const details = detailsResponse.ok && detailsData.result ? detailsData.result : competitor

        const distance = calculateDistance(
          lat, lng,
          details.geometry?.location?.lat || competitor.geometry?.location?.lat,
          details.geometry?.location?.lng || competitor.geometry?.location?.lng
        )

        const result = {
          place_id: details.place_id,
          name: details.name,
          formatted_address: details.formatted_address,
          rating: details.rating,
          user_ratings_total: details.user_ratings_total,
          website: details.website,
          phone: details.formatted_phone_number,
          geometry: details.geometry,
          distance_miles: distance
        }

        console.log(`✅ Competitor ${index + 1} processed: ${result.name} (${result.distance_miles} miles, website: ${!!result.website})`)
        return result
      } catch (error) {
        console.error(`❌ Error fetching competitor ${index + 1} details:`, error)
        return {
          place_id: competitor.place_id,
          name: competitor.name,
          formatted_address: competitor.formatted_address,
          rating: competitor.rating,
          user_ratings_total: competitor.user_ratings_total,
          distance_miles: calculateDistance(
            lat, lng,
            competitor.geometry?.location?.lat,
            competitor.geometry?.location?.lng
          )
        }
      }
    })
  )

  console.log(`🌐 Found ${detailedCompetitors.filter((competitor: CompetitorWithSEO) => competitor.website).length} competitors with websites`)
  return detailedCompetitors
}