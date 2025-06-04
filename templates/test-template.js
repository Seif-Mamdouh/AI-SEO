const fs = require('fs');
const path = require('path');

// Mock function to simulate getWebsiteTemplate
function getWebsiteTemplate(templateName = 'default') {
  try {
    const templatesDir = path.join(__dirname, 'websites');
    const templatePath = path.join(templatesDir, `${templateName}.tsx`);
    
    if (!fs.existsSync(templatePath)) {
      console.log(`⚠️ Template ${templateName} not found, using default`);
      return fs.readFileSync(path.join(templatesDir, 'default.tsx'), 'utf8');
    }
    
    return fs.readFileSync(templatePath, 'utf8');
  } catch (error) {
    console.error('❌ Error loading template:', error);
    return `
      export default function MedSpaLandingPage() {
        return (
          <div className="min-h-screen bg-white">
            <h1>Medical Spa Template</h1>
            <p>This is a fallback template.</p>
          </div>
        )
      }
    `;
  }
}

// Mock function to simulate customizeTemplate
function customizeTemplate(template, medSpaData, imageUrls) {
  // Basic replacements for business details
  let customized = template
    .replace(/\{\{BUSINESS_NAME\}\}/g, medSpaData?.name || 'Premium Medical Spa')
    .replace(/\{\{BUSINESS_ADDRESS\}\}/g, medSpaData?.formatted_address || 'Professional Location')
    .replace(/\{\{BUSINESS_PHONE\}\}/g, medSpaData?.phone || medSpaData?.formatted_phone_number || '(555) 123-4567')
    .replace(/\{\{BUSINESS_RATING\}\}/g, medSpaData?.rating?.toString() || '4.8')
    .replace(/\{\{BUSINESS_REVIEWS\}\}/g, medSpaData?.user_ratings_total?.toString() || 'many');
  
  // Handle services if available
  if (medSpaData?.website_data?.services && medSpaData.website_data.services.length > 0) {
    // Get the list of services
    const services = medSpaData.website_data.services;
    
    // Fill in service data from the parsed website
    for (let i = 0; i < Math.min(services.length, 3); i++) {
      const service = services[i];
      customized = customized
        .replace(new RegExp(`\\{\\{SERVICE_TITLE_${i+1}\\}\\}`, 'g'), service.name || `Premium Service ${i+1}`)
        .replace(new RegExp(`\\{\\{SERVICE_DESCRIPTION_${i+1}\\}\\}`, 'g'), service.description || `Professional luxury service for elite clients.`)
        .replace(new RegExp(`\\{\\{SERVICE_PRICE_${i+1}\\}\\}`, 'g'), `Starting at $${199 + (i * 100)}`)
        .replace(new RegExp(`\\{\\{SERVICE_TECHNOLOGY_${i+1}\\}\\}`, 'g'), `Premium Technology`)
        .replace(new RegExp(`\\{\\{SERVICE_RESULTS_${i+1}\\}\\}`, 'g'), `95% satisfaction rate`);
        
      // Set default features
      for (let j = 1; j <= 4; j++) {
        customized = customized.replace(
          new RegExp(`\\{\\{SERVICE_FEATURE_${i+1}_${j}\\}\\}`, 'g'), 
          `Feature ${j}`
        );
      }
    }
  }
  
  // Set default values for any remaining service templates
  for (let i = 1; i <= 3; i++) {
    customized = customized
      .replace(new RegExp(`\\{\\{SERVICE_TITLE_${i}\\}\\}`, 'g'), `Premium Service ${i}`)
      .replace(new RegExp(`\\{\\{SERVICE_DESCRIPTION_${i}\\}\\}`, 'g'), `Professional luxury service for elite clients.`)
      .replace(new RegExp(`\\{\\{SERVICE_PRICE_${i}\\}\\}`, 'g'), `Starting at $${199 + (i * 100)}`)
      .replace(new RegExp(`\\{\\{SERVICE_TECHNOLOGY_${i}\\}\\}`, 'g'), `Premium Technology`)
      .replace(new RegExp(`\\{\\{SERVICE_RESULTS_${i}\\}\\}`, 'g'), `95% satisfaction rate`);
      
    // Set default features
    for (let j = 1; j <= 4; j++) {
      customized = customized.replace(
        new RegExp(`\\{\\{SERVICE_FEATURE_${i}_${j}\\}\\}`, 'g'), 
        `Feature ${j}`
      );
    }
  }
  
  // Set default values for stats
  const statDefaults = [
    { number: "15,000+", label: "Elite Clients" },
    { number: "20+", label: "Years Excellence" },
    { number: "99%", label: "Satisfaction Rate" },
    { number: "5.0", label: "Luxury Rating" }
  ];
  
  for (let i = 1; i <= 4; i++) {
    customized = customized
      .replace(new RegExp(`\\{\\{STAT_NUMBER_${i}\\}\\}`, 'g'), statDefaults[i-1].number)
      .replace(new RegExp(`\\{\\{STAT_LABEL_${i}\\}\\}`, 'g'), statDefaults[i-1].label);
  }
  
  // Set default values for testimonials
  const testimonialDefaults = [
    {
      name: "Victoria Sterling",
      role: "VIP Client",
      text: "Absolutely exquisite experience. The level of luxury and professionalism exceeded my highest expectations.",
      treatment: "Premium Treatment",
      result: "3 months ago"
    },
    {
      name: "Alexander Rothschild",
      role: "Elite Member",
      text: "The epitome of luxury medical aesthetics. Every detail is perfected, from the ambiance to the results.",
      treatment: "Elite Service",
      result: "6 months ago"
    },
    {
      name: "Isabella Montclair",
      role: "Platinum Client",
      text: "An oasis of luxury and expertise. The treatments are pure indulgence with incredible results.",
      treatment: "Premium Package",
      result: "2 months ago"
    }
  ];
  
  for (let i = 1; i <= 3; i++) {
    customized = customized
      .replace(new RegExp(`\\{\\{TESTIMONIAL_NAME_${i}\\}\\}`, 'g'), testimonialDefaults[i-1].name)
      .replace(new RegExp(`\\{\\{TESTIMONIAL_ROLE_${i}\\}\\}`, 'g'), testimonialDefaults[i-1].role)
      .replace(new RegExp(`\\{\\{TESTIMONIAL_TEXT_${i}\\}\\}`, 'g'), testimonialDefaults[i-1].text)
      .replace(new RegExp(`\\{\\{TESTIMONIAL_TREATMENT_${i}\\}\\}`, 'g'), testimonialDefaults[i-1].treatment)
      .replace(new RegExp(`\\{\\{TESTIMONIAL_RESULT_${i}\\}\\}`, 'g'), testimonialDefaults[i-1].result);
  }
  
  // Handle images
  if (imageUrls && imageUrls.length > 0) {
    // Replace hero image
    customized = customized.replace(/\{\{HERO_IMAGE\}\}/g, imageUrls[0]?.url || '');
    
    // Replace gallery images with first image if available
    const galleryImage = imageUrls[Math.min(1, imageUrls.length - 1)]?.url || imageUrls[0]?.url || '';
    customized = customized.replace(/\{\{GALLERY_IMAGES\}\}/g, galleryImage);
    
    // About section image
    const aboutImage = imageUrls[Math.min(2, imageUrls.length - 1)]?.url || imageUrls[0]?.url || '';
    customized = customized.replace(/\{\{ABOUT_IMAGE\}\}/g, aboutImage);
  } else {
    // Placeholder images if none available
    customized = customized.replace(/\{\{HERO_IMAGE\}\}/g, 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
    customized = customized.replace(/\{\{ABOUT_IMAGE\}\}/g, 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
    customized = customized.replace(/\{\{GALLERY_IMAGES\}\}/g, 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
  }
  
  return customized;
}

// Mock data for testing
const mockMedSpaData = {
  name: "Luxe Aesthetics & Wellness",
  formatted_address: "123 Beauty Boulevard, Beverly Hills, CA 90210",
  phone: "(555) 987-6543",
  rating: 4.9,
  user_ratings_total: 342,
  website_data: {
    services: [
      {
        name: "Botox & Fillers",
        description: "Premium anti-aging injectables administered by expert aestheticians."
      },
      {
        name: "Laser Treatments",
        description: "Advanced laser technology for skin rejuvenation and hair removal."
      },
      {
        name: "HydraFacial Elite",
        description: "Luxurious facial treatment with premium serums and deep cleansing."
      }
    ]
  },
  photos: [
    { photo_reference: "photo_ref_1" },
    { photo_reference: "photo_ref_2" },
    { photo_reference: "photo_ref_3" }
  ]
};

// Mock image URLs
const mockImageUrls = [
  { 
    url: "https://example.com/image1.jpg",
    reference: "photo_ref_1",
    index: 1
  },
  { 
    url: "https://example.com/image2.jpg",
    reference: "photo_ref_2",
    index: 2
  },
  { 
    url: "https://example.com/image3.jpg",
    reference: "photo_ref_3",
    index: 3
  }
];

// Test the template generation
console.log("🧪 Testing template-based website generation...");

try {
  // Get template
  const templateCode = getWebsiteTemplate('default');
  console.log(`📝 Retrieved template, size: ${templateCode.length} characters`);
  
  // Customize template
  const customizedCode = customizeTemplate(templateCode, mockMedSpaData, mockImageUrls);
  console.log(`✅ Template customization complete, size: ${customizedCode.length} characters`);
  
  // Check if all placeholders were replaced
  const remainingPlaceholders = (customizedCode.match(/\{\{[A-Z_0-9]+\}\}/g) || []);
  if (remainingPlaceholders.length > 0) {
    console.log(`⚠️ Found ${remainingPlaceholders.length} unprocessed placeholders:`, remainingPlaceholders);
  } else {
    console.log('✅ All placeholders successfully replaced');
  }
  
  // Output a sample to verify it worked
  const sample = customizedCode.substring(0, 500) + '...';
  console.log('\n📋 Sample of generated code:');
  console.log(sample);
  
  // Write output to file for inspection
  const outputPath = path.join(__dirname, 'test-output.tsx');
  fs.writeFileSync(outputPath, customizedCode);
  console.log(`\n💾 Full output written to: ${outputPath}`);
} catch (error) {
  console.error('❌ Test failed:', error);
} 