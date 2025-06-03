export interface MedSpaTemplate {
  id: string
  name: string
  description: string
  category: 'luxury' | 'modern' | 'medical' | 'wellness'
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
  wellness: {
    name: 'Wellness & Rejuvenation',
    description: 'Holistic wellness approach with calming aesthetics',
    category: 'wellness' as const,
    features: [
      'Serene hero with nature imagery',
      'Wellness journey timeline',
      'Treatment packages display',
      'Mindfulness and self-care focus',
      'Client transformation stories',
      'Virtual consultation options'
    ],
    colorScheme: {
      primary: '#059669',
      secondary: '#10B981',
      accent: '#F0FDF4'
    }
  }
}

// Import template files
import luxuryTemplate from './medspa/luxury-template'
import modernTemplate from './medspa/modern-template'
import wellnessTemplate from './medspa/wellness-template'

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
  },
  {
    id: 'wellness',
    ...TEMPLATE_CONFIGS.wellness,
    ...wellnessTemplate
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
  const { name, formatted_address, rating, photos } = medSpaData
  
  let prompt = `Using the "${template.name}" template style, create a professional medical spa landing page for ${name}.`
  
  if (formatted_address) {
    prompt += ` This business is located at ${formatted_address}.`
  }
  
  prompt += `\n\nTEMPLATE STYLE: ${template.description}\n`
  prompt += `FEATURES TO INCLUDE:\n${template.features.map(feature => `• ${feature}`).join('\n')}\n`
  
  prompt += `\nCOLOR SCHEME:\n`
  prompt += `• Primary: ${template.colorScheme.primary}\n`
  prompt += `• Secondary: ${template.colorScheme.secondary}\n`
  prompt += `• Accent: ${template.colorScheme.accent}\n`
  
  prompt += `\nBUSINESS INFORMATION:\n`
  prompt += `• Business Name: ${name} (use this exact name)\n`
  
  if (rating) {
    prompt += `• Google Rating: ${rating} stars\n`
  }
  
  if (photos?.length > 0) {
    prompt += `• Photos: ${photos.length} actual business photos available\n`
  }
  
  prompt += `\nIMPORTANT: Follow the ${template.name} template style closely while customizing all content for ${name}. Make it feel like a real business website, not a template demo.`
  
  return prompt
} 