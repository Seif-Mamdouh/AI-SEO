export interface AnalysisStep {
  id: string
  title: string
  status: 'pending' | 'active' | 'completed'
  duration: number
}

export interface Competitor {
  id: string
  name: string
  lat: number
  lng: number
  rating?: number
  address?: string
}

export interface Review {
  author_name: string
  author_url?: string
  language?: string
  profile_photo_url?: string
  rating: number
  relative_time_description: string
  text?: string
  time: number
}

export interface Photo {
  photo_reference?: string  
  name?: string           
}

export interface MedSpa {
  place_id: string
  name: string
  formatted_address: string
  rating?: number
  user_ratings_total?: number
  website?: string
  phone?: string
  types?: string[] 
  geometry?: {
    location: {
      lat: number
      lng: number
    }
  }
  reviews?: Review[]
  photos?: Photo[]
}

// Utility function to generate photo URLs for both old and new Google Places API
export const getPhotoUrl = (photo: Photo, maxWidth: number = 400): string | null => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  
  console.log('🔑 API Key Debug:', {
    googlePlacesKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY ? 'Present' : 'Missing',
    googleMapsKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing',
    finalApiKey: apiKey ? 'Present' : 'Missing'
  })
  
  if (!apiKey) {
    console.log('❌ No API key found! Add NEXT_PUBLIC_GOOGLE_PLACES_API_KEY to your .env.local file')
    return null
  }
  
  // New Places API v1 format (preferred)
  if (photo.name) {
    const url = `https://places.googleapis.com/v1/${photo.name}/media?key=${apiKey}&maxWidthPx=${maxWidth}`
    console.log('📍 Generated New API URL:', url)
    return url
  }
  
  // Old API format (fallback)
  if (photo.photo_reference) {
    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photo.photo_reference}&key=${apiKey}`
    console.log('📍 Generated Old API URL:', url)
    return url
  }
  
  console.log('❌ No photo.name or photo.photo_reference found:', photo)
  return null
} 