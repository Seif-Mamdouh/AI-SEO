export interface MedSpaTemplate {
  id: string
  name: string
  description: string
  category: 'luxury' | 'modern' | 'elegant' | 'wellness'
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
  },
  {
    id: 'elegant',
    ...TEMPLATE_CONFIGS.elegant,
    ...template1
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
  // Since we're using the exact template HTML, this function now just provides context info
  // The actual template application happens in the API route
  const { name, formatted_address, rating, photos } = medSpaData
  
  return `Using exact template: "${template.name}" (${template.category}) for ${name || 'Medical Spa'}.
Template features: ${template.features.join(', ')}.
Business data will be automatically inserted into template variables.
Location: ${formatted_address || 'Not specified'}
Rating: ${rating || 'Not specified'}
Photos available: ${photos?.length || 0}`
} 