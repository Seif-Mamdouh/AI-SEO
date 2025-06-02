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
    // Generate HTML
    const htmlCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert web developer. Generate clean, modern, responsive HTML code based on the user's requirements. 

IMPORTANT GUIDELINES:
- Create a complete, professional website with semantic HTML5
- Use inline styles for all styling (no external CSS references)
- Make it fully responsive with mobile-first design
- Include proper navigation, sections, and footer
- Use modern design principles with good spacing and typography
- Include placeholder content that's relevant to the business type
- Make sure all elements are properly structured and accessible
- Use professional color schemes and layouts
- Include interactive elements like forms, buttons, etc.
- Add proper meta tags in the head section
- Make it production-ready and visually appealing

Return ONLY the HTML code without any explanations or markdown formatting.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.7
    })

    // Generate CSS
    const cssCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system", 
          content: `You are an expert CSS developer. Generate clean, modern CSS code that complements the website described in the prompt.

IMPORTANT GUIDELINES:
- Create modern, responsive CSS with mobile-first approach
- Use CSS Grid and Flexbox for layouts
- Include smooth transitions and hover effects
- Use modern CSS features like custom properties (CSS variables)
- Ensure great typography and spacing
- Include responsive breakpoints for mobile, tablet, and desktop
- Use professional color schemes with good contrast
- Add subtle animations and micro-interactions
- Make it visually appealing and user-friendly
- Include CSS reset/normalize styles

Return ONLY the CSS code without any explanations or markdown formatting.`
        },
        {
          role: "user",
          content: `Generate CSS for: ${prompt}`
        }
      ],
      max_tokens: 3000,
      temperature: 0.7
    })

    // Generate JavaScript
    const jsCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert JavaScript developer. Generate clean, modern JavaScript code to enhance the website's functionality.

IMPORTANT GUIDELINES:
- Write vanilla JavaScript (no external libraries)
- Add interactive functionality like form handling, smooth scrolling, animations
- Include proper event listeners and DOM manipulation
- Add mobile-friendly touch interactions
- Implement form validation where applicable
- Add loading states and user feedback
- Include error handling for better user experience
- Use modern ES6+ syntax
- Make it performant and lightweight
- Add accessibility enhancements

Return ONLY the JavaScript code without any explanations or markdown formatting.`
        },
        {
          role: "user", 
          content: `Generate JavaScript for: ${prompt}`
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    })

    const html = htmlCompletion.choices[0]?.message?.content?.trim() || ''
    const css = cssCompletion.choices[0]?.message?.content?.trim() || ''
    const js = jsCompletion.choices[0]?.message?.content?.trim() || ''

    // Clean up the responses to remove any markdown formatting
    const cleanHtml = cleanCodeResponse(html)
    const cleanCss = cleanCodeResponse(css)
    const cleanJs = cleanCodeResponse(js)

    return {
      html: cleanHtml,
      css: cleanCss,
      js: cleanJs
    }

  } catch (error) {
    console.error('OpenAI API error:', error)
    // Fallback to a basic template if OpenAI fails
    return generateFallbackWebsite(prompt)
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