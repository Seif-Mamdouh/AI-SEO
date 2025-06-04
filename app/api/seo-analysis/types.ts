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
  height: number
  html_attributions: string[]
  photo_reference: string
  width: number
  name?: string
}

export interface PlaceDetails {
  place_id: string
  name: string
  formatted_address: string
  rating?: number
  user_ratings_total?: number
  website?: string
  phone?: string
  geometry?: {
    location: {
      lat: number
      lng: number
    }
  }
  reviews?: Review[]
  photos?: Photo[]
}

export interface PageSpeedResult {
  url: string
  performance_score?: number
  accessibility_score?: number
  best_practices_score?: number
  seo_score?: number
  loading_experience?: string
  largest_contentful_paint?: number
  first_input_delay?: number
  cumulative_layout_shift?: number
  error?: string
}

export interface WebsiteParseResult {
  url: string
  title?: string
  description?: string
  keywords?: string
  headings: {
    h1: string[]
    h2: string[]
    h3: string[]
  }
  images: {
    src: string
    alt: string
  }[]
  links: {
    href: string
    text: string
  }[]
  socialLinks: {
    platform: string
    url: string
  }[]
  contactInfo: {
    email?: string
    phone?: string
  }
  structure: {
    hasNavigation: boolean
    hasFooter: boolean
    hasContactForm: boolean
    hasBookingForm: boolean
  }
  screenshot?: string
  error?: string
}

export interface CompetitorWithSEO extends PlaceDetails {
  distance_miles?: number
  pagespeed_data?: PageSpeedResult
  website_data?: WebsiteParseResult
  seo_rank?: number
}

export interface SEOAnalysisRequest {
  selectedMedspa: PlaceDetails
  generate_llm_report?: boolean
}

export interface SEOAnalysisResult {
  competitors: CompetitorWithSEO[]
  yourPosition: number
  averagePerformanceScore: number
  averageSEOScore: number
  topPerformer: CompetitorWithSEO | null
}