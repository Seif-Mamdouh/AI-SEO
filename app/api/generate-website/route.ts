import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    // Generate website using OpenAI
    const websiteResult = await generateWebsiteWithOpenAI(prompt)

    return NextResponse.json(websiteResult)
  } catch (error) {
    console.error('Website generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate website' },
      { status: 500 }
    )
  }
}

async function generateWebsiteWithOpenAI(prompt: string) {
  try {
    const systemPrompt = `You are an expert web developer and medical spa marketing specialist. Create a complete, modern website with HTML, CSS, and JavaScript.

IMPORTANT REQUIREMENTS:
- Generate COMPLETE, functional code that can be immediately deployed
- Use modern CSS with gradients, animations, and responsive design
- Include interactive JavaScript for smooth scrolling, form handling, and animations
- Make it mobile-responsive with proper viewport meta tags
- Include proper SEO meta tags, schema markup for local business
- Use medical spa industry best practices for conversion optimization
- Include compelling call-to-actions and trust signals
- Make the design premium and professional for medical spa clientele

STRUCTURE YOUR RESPONSE EXACTLY AS:
HTML:
[Complete HTML code here]

CSS:
[Complete CSS code here]

JAVASCRIPT:
[Complete JavaScript code here]

Focus on:
- High-converting hero sections with clear value propositions
- Service showcases with pricing and benefits
- Before/after galleries (use placeholder images with proper descriptions)
- Patient testimonials and reviews
- Clear contact information and appointment booking
- Trust signals (certifications, years of experience, etc.)
- Local SEO optimization
- Fast loading and mobile-first design
- Accessibility and user experience best practices

If the prompt mentions specific business details (name, location, contact info, current performance issues), incorporate ALL of them naturally into the website design and content.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error('No response generated from OpenAI')
    }

    // Parse the response to extract HTML, CSS, and JavaScript
    const htmlMatch = response.match(/HTML:\s*([\s\S]*?)(?=CSS:|JAVASCRIPT:|$)/i)
    const cssMatch = response.match(/CSS:\s*([\s\S]*?)(?=HTML:|JAVASCRIPT:|$)/i)
    const jsMatch = response.match(/JAVASCRIPT:\s*([\s\S]*?)(?=HTML:|CSS:|$)/i)

    if (!htmlMatch) {
      throw new Error('Could not extract HTML from OpenAI response')
    }

    const html = htmlMatch[1].trim()
    const css = cssMatch ? cssMatch[1].trim() : ''
    const js = jsMatch ? jsMatch[1].trim() : ''

    // Create a complete HTML document
    const completeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Medical Spa Website</title>
    <style>
${css}
    </style>
</head>
<body>
${html}
    <script>
${js}
    </script>
</body>
</html>`

    return {
      html: completeHtml,
      css,
      js,
      preview: completeHtml
    }

  } catch (error) {
    console.error('OpenAI generation error:', error)
    throw new Error('Failed to generate website with AI')
  }
}

function cleanCodeResponse(code: string): string {
  // Remove markdown code blocks if present
  return code
    .replace(/^```[\w]*\n/, '')
    .replace(/\n```$/, '')
    .replace(/^```/, '')
    .replace(/```$/, '')
    .trim()
}

function generateFallbackWebsite(prompt: string) {
  // Simple fallback template if OpenAI fails
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Generated Website</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; line-height: 1.6;">
        <header style="background: #2563eb; color: white; padding: 2rem 0; text-align: center;">
            <h1 style="margin: 0; font-size: 2.5rem;">Welcome</h1>
            <p style="margin: 0.5rem 0 0 0; font-size: 1.2rem;">AI Generated Website</p>
        </header>
        
        <main style="max-width: 1200px; margin: 0 auto; padding: 2rem;">
            <section style="text-align: center; margin-bottom: 3rem;">
                <h2 style="font-size: 2rem; margin-bottom: 1rem; color: #1f2937;">About Us</h2>
                <p style="font-size: 1.1rem; color: #6b7280; max-width: 600px; margin: 0 auto;">
                    This website was generated based on your requirements. We're here to provide excellent service and meet your needs.
                </p>
            </section>
            
            <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 3rem;">
                <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <h3 style="color: #1f2937; margin-bottom: 1rem;">Service 1</h3>
                    <p style="color: #6b7280;">Professional service tailored to your needs.</p>
                </div>
                <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <h3 style="color: #1f2937; margin-bottom: 1rem;">Service 2</h3>
                    <p style="color: #6b7280;">Expert solutions for your business.</p>
                </div>
                <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <h3 style="color: #1f2937; margin-bottom: 1rem;">Service 3</h3>
                    <p style="color: #6b7280;">Quality results you can trust.</p>
                </div>
            </section>
            
            <section style="background: #f9fafb; padding: 2rem; border-radius: 0.5rem; text-align: center;">
                <h2 style="color: #1f2937; margin-bottom: 1rem;">Get In Touch</h2>
                <p style="color: #6b7280; margin-bottom: 2rem;">Ready to get started? Contact us today!</p>
                <button style="background: #2563eb; color: white; padding: 0.75rem 2rem; border: none; border-radius: 0.375rem; font-size: 1rem; cursor: pointer;">
                    Contact Us
                </button>
            </section>
        </main>
        
        <footer style="background: #1f2937; color: white; text-align: center; padding: 2rem 0; margin-top: 3rem;">
            <p>&copy; 2024 AI Generated Website. All rights reserved.</p>
        </footer>
    </body>
    </html>
  `

  const css = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    
    button:hover {
      background: #1d4ed8 !important;
      transform: translateY(-1px);
    }
    
    @media (max-width: 768px) {
      main {
        padding: 1rem !important;
      }
      
      h1 {
        font-size: 2rem !important;
      }
      
      section {
        grid-template-columns: 1fr !important;
      }
    }
  `

  const js = `
    document.addEventListener('DOMContentLoaded', function() {
      // Add smooth scrolling
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
      
      // Add button interactions
      document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
          alert('Thank you for your interest! This is a demo website.');
        });
        
        button.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
          this.style.transform = 'translateY(0)';
        });
      });
    });
  `

  return { html, css, js }
} 