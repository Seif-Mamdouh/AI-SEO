export interface MedSpaTemplate {
  id: string
  name: string
  description: string
  category: 'luxury' | 'modern' | 'wellness'
  html: string
  css: string
  js?: string
  features: string[]
  colorScheme: {
    primary: string
    secondary: string
    accent: string
  }
}

// Template configurations
const TEMPLATE_CONFIGS = {
  luxury: {
    name: 'Luxury Medical Spa',
    description: 'High-end medical spa with premium aesthetics',
    category: 'luxury' as const,
    features: [
      'Elegant hero section with video background',
      'Premium service showcase',
      'Client testimonials carousel',
      'Appointment booking system',
      'Before/after gallery',
      'Staff profiles section'
    ],
    colorScheme: {
      primary: '#2C1810',
      secondary: '#D4AF37',
      accent: '#F8F6F0'
    }
  },
  modern: {
    name: 'Modern Medical Center',
    description: 'Clean, contemporary design focused on professionalism',
    category: 'modern' as const,
    features: [
      'Minimalist hero with clear CTA',
      'Service grid with icons',
      'Statistics and achievements',
      'Online consultation booking',
      'Team credentials display',
      'Technology showcase'
    ],
    colorScheme: {
      primary: '#1E3A8A',
      secondary: '#3B82F6',
      accent: '#F1F5F9'
    }
  },
  elegant: {
    name: 'Elegant Beauty Center',
    description: 'Sophisticated rose-themed design with elegant aesthetics',
    category: 'elegant' as const,
    features: [
      'Beautiful rose gradient hero section',
      'Elegant service showcase cards',
      'Client testimonials with ratings',
      'Contact information display',
      'Results gallery section',
      'Professional about section'
    ],
    colorScheme: {
      primary: '#F43F5E',
      secondary: '#EC4899',
      accent: '#FDF2F8'
    }
  }
}

// Import template files
import luxuryTemplate from './medspa/luxury-template'
import modernTemplate from './medspa/modern-template'
import template1 from './medspa/template1'

const TEMPLATES: MedSpaTemplate[] = [
  {
    id: 'luxury',
    ...TEMPLATE_CONFIGS.luxury,
    ...luxuryTemplate
  },
  {
    id: 'modern',
    ...TEMPLATE_CONFIGS.modern,
    ...modernTemplate
  }
]

/**
 * Get a random med spa template
 */
export function getRandomTemplate(): MedSpaTemplate {
  const randomIndex = Math.floor(Math.random() * TEMPLATES.length)
  return TEMPLATES[randomIndex]
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): MedSpaTemplate | null {
  return TEMPLATES.find(template => template.id === id) || null
}

/**
 * Get all available templates
 */
export function getAllTemplates(): MedSpaTemplate[] {
  return TEMPLATES
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: MedSpaTemplate['category']): MedSpaTemplate[] {
  return TEMPLATES.filter(template => template.category === category)
}

/**
 * Generate contextual prompt with template
 */
export function generateTemplatePrompt(template: MedSpaTemplate, medSpaData: any): string {
  const { name, formatted_address, rating, photos, website_data, pagespeed_data } = medSpaData
  
  // Generate comprehensive integration prompt
  let prompt = `EXACT TEMPLATE INTEGRATION FOR ${name}
  
🎨 SELECTED TEMPLATE: "${template.name}" (${template.category})
Template Description: ${template.description}

🏢 REAL BUSINESS DATA INTEGRATION:
Business Name: ${name}
Location: ${formatted_address || 'Not specified'}
Google Rating: ${rating || 'Not specified'} stars (${medSpaData.user_ratings_total || 0} reviews)
Phone: ${medSpaData.phone || medSpaData.formatted_phone_number || 'Not specified'}

📸 REAL BUSINESS PHOTOS: ${photos?.length || 0} available
${photos?.length > 0 ? `- These are actual Google Places photos of ${name}
- Use [HERO_IMAGE], [GALLERY_IMAGE_1], [GALLERY_IMAGE_2], [GALLERY_IMAGE_3] placeholders
- Photos will be automatically integrated with real URLs` : '- No photos available, will use template defaults'}

🌐 CURRENT WEBSITE ANALYSIS:
${website_data?.title ? `Current Title: "${website_data.title}"` : 'No current website title'}
${website_data?.description ? `Current Description: "${website_data.description}"` : 'No current description'}
${website_data?.contactInfo?.email ? `Email: ${website_data.contactInfo.email}` : 'No email found'}
${website_data?.contactInfo?.hours ? `Hours: ${website_data.contactInfo.hours}` : 'No hours specified'}

⚡ PERFORMANCE IMPROVEMENTS:
${pagespeed_data?.seo_score ? `Current SEO Score: ${pagespeed_data.seo_score}/100 (will improve to 95+)` : 'SEO optimization will be applied'}
${pagespeed_data?.performance_score ? `Current Performance: ${pagespeed_data.performance_score}/100 (will be optimized)` : 'Performance optimization will be applied'}

🎯 TEMPLATE FEATURES TO IMPLEMENT:
${template.features.map(feature => `• ${feature}`).join('\n')}

🎨 COLOR SCHEME:
Primary: ${template.colorScheme.primary}
Secondary: ${template.colorScheme.secondary}
Accent: ${template.colorScheme.accent}

💎 INTEGRATION STRATEGY:
1. Use EXACT template HTML structure and styling
2. Replace ALL template variables with real ${name} data
3. Integrate ${photos?.length || 0} real business photos using Google Places URLs
4. Apply ${template.category} template aesthetic with business-specific content
5. Include performance improvements and SEO optimization messaging
6. Make it feel like the official ${name} website, not a template demo

📍 LOCATION-SPECIFIC CONTENT:
${formatted_address ? `- Reference ${name}'s location at ${formatted_address}` : ''}
${formatted_address ? `- Include local area serving references` : ''}
- Use [CITY], [STATE], [ZIP_CODE] placeholders for location data

🔗 GOOGLE INTEGRATION:
- Place ID: ${medSpaData.place_id || 'Not available'}
- Google Maps integration available: ${medSpaData.place_id ? 'Yes' : 'No'}
- Use [GOOGLE_MAPS_URL] for location links

FINAL OUTPUT: Complete ${template.name} template with all real ${name} business data integrated seamlessly.`

  return prompt
} 