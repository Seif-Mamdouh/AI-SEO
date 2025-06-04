import { NextResponse } from 'next/server'
import { PlaceDetails } from './types'

export function validateRequest(selectedMedspa: any): NextResponse | null {
  if (!selectedMedspa) {
    console.log('❌ No selected medspa provided')
    return NextResponse.json(
      { error: 'Selected med spa information is required' },
      { status: 400 }
    )
  }
  return null
}

export function validateApiKeys(): { googleApiKey: string; pageSpeedApiKey: string } | NextResponse {
  const googleApiKey = process.env.GOOGLE_PLACES_API_KEY
  const pageSpeedApiKey = process.env.PAGESPEED_INSIGHTS_API_KEY

  if (!googleApiKey) {
    console.log('❌ Google Places API key not configured')
    return NextResponse.json(
      { error: 'Google Places API key not configured' },
      { status: 500 }
    )
  }

  if (!pageSpeedApiKey) {
    console.log('❌ PageSpeed Insights API key not configured')
    return NextResponse.json(
      { error: 'PageSpeed Insights API key not configured' },
      { status: 500 }
    )
  }

  console.log('✅ API keys validated')
  return { googleApiKey, pageSpeedApiKey }
}