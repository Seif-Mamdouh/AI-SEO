import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  console.log('🚀 Website generation request started at:', new Date().toISOString())
  
  try {
    const { prompt, medSpaData } = await request.json()
    
    console.log('📝 Received prompt length:', prompt?.length || 0)
    console.log('🏥 Med spa data received:', !!medSpaData)
    
    if (medSpaData) {
      console.log('🎯 Med spa context:', {
        name: medSpaData.name,
        hasImages: !!medSpaData.photos?.length,
        imageCount: medSpaData.photos?.length || 0,
        hasWebsiteData: !!medSpaData.website_data,
        hasPerformanceData: !!medSpaData.pagespeed_data
      })
    }

    if (!prompt) {
      console.error('❌ No prompt provided')
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OpenAI API key not configured')
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    console.log('🤖 Starting OpenAI generation...')
    
    // Generate website using OpenAI with enhanced context
    const websiteResult = await generateWebsiteWithOpenAI(prompt, medSpaData)
    
    const duration = Date.now() - startTime
    console.log('✅ Website generation completed in:', duration + 'ms')
    console.log('📊 Generated code sizes:', {
      html: websiteResult.html?.length || 0,
      css: websiteResult.css?.length || 0,
      js: websiteResult.js?.length || 0
    })

    return NextResponse.json(websiteResult)
  } catch (error) {
    const duration = Date.now() - startTime
    console.error('💥 Website generation error after', duration + 'ms:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate website' },
      { status: 500 }
    )
  }
}

async function generateWebsiteWithOpenAI(prompt: string, medSpaData?: any) {
  try {
    console.log('🎨 Preparing enhanced system prompt with React/SHADCN...')
    
    // Extract images from med spa data
    const medSpaImages = medSpaData?.photos || []
    console.log('🖼️ Available images:', medSpaImages.length)
    
    // Create image context for AI
    let imageContext = ''
    if (medSpaImages.length > 0) {
      imageContext = `\n\nAVAILABLE BUSINESS IMAGES TO USE:
${medSpaImages.map((photo: any, index: number) => 
  `${index + 1}. ${photo.photo_reference} - Use this URL: https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=YOUR_API_KEY`
).join('\n')}

IMPORTANT: Use these REAL business images instead of placeholders. These are actual photos of the business.`
    }

    const systemPrompt = `You are an expert React developer and medical spa marketing specialist. Create a complete, ACTUAL landing page for the specific medical spa business provided.

CRITICAL INSTRUCTIONS:
- This is NOT a template or demo - create a REAL landing page for the actual business
- Use ALL the specific business information provided (name, location, photos, contact details)
- Generate actual content specific to this med spa, not placeholder text
- Include real business information throughout the entire page
- Make it feel like a legitimate business website, not a template

TECHNICAL REQUIREMENTS:
- Generate COMPLETE React components using Next.js 13+ App Router
- Use SHADCN/UI components (Button, Card, Badge, Input, Textarea, etc.)
- Use Tailwind CSS for styling with modern design patterns
- Include TypeScript interfaces where appropriate
- Make it fully responsive with mobile-first design
- Use React hooks (useState, useEffect) for interactivity
- Include proper SEO meta tags and schema markup for the specific business
- Implement smooth animations with Framer Motion
- Add form validation and error handling

SHADCN COMPONENTS TO USE:
- Button, Card, CardContent, CardDescription, CardHeader, CardTitle
- Badge, Input, Textarea, Label, Separator
- Sheet, Dialog, Tabs, TabsContent, TabsList, TabsTrigger
- Avatar, AvatarFallback, AvatarImage
- Alert, AlertDescription, AlertTitle

STRUCTURE YOUR RESPONSE EXACTLY AS:
REACT_COMPONENT:
[Complete React component code]

STYLES:
[Additional Tailwind classes or custom CSS if needed]

TYPES:
[TypeScript interfaces and types]

CONTENT REQUIREMENTS FOR THE ACTUAL BUSINESS:
- Use the EXACT business name provided throughout the page
- Include the ACTUAL address and location information
- Use REAL contact information (phone, email) if provided
- Reference the ACTUAL Google rating and reviews
- Create content that feels authentic to this specific business
- Include location-specific references (neighborhood, city landmarks, etc.)
- Write compelling copy that feels like it was written FOR this specific med spa

LANDING PAGE SECTIONS TO INCLUDE:
1. Hero Section: Business name, compelling headline about their services, location
2. About Section: Professional description of the specific med spa
3. Services Section: Premium medical spa services with realistic pricing
4. Gallery Section: Use the actual business photos provided
5. Testimonials: Reference their actual Google rating and create realistic testimonials
6. Location & Contact: Real address, phone, business hours
7. Booking Section: Appointment scheduling with the business name
8. Footer: Complete business information

MEDICAL SPA CONTENT FOCUS:
- Premium services: Botox, Dermal Fillers, Laser Treatments, Chemical Peels, Hydrafacials, Microneedling
- Professional certifications and licensed practitioners
- Before/after galleries showcasing results
- Patient testimonials reflecting their actual rating
- Online booking system branded with their business name
- Special offers and package deals
- Safety protocols and medical-grade equipment
- Actual location information and contact details

${imageContext}

BUSINESS-SPECIFIC REQUIREMENTS:
- Every mention should use the actual business name, not "MedSpa" or generic terms
- Include specific location references (the actual city/neighborhood they're in)
- Reference their actual Google rating in testimonials
- Use real contact information throughout
- Make it feel like this business actually owns and operates this website

Generate a production-ready React component that looks like it was professionally built FOR this specific medical spa business.`

    console.log('📡 Making OpenAI API request...')
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    })

    console.log('📨 OpenAI response received')
    console.log('🔢 Tokens used:', completion.usage)

    const response = completion.choices[0]?.message?.content

    if (!response) {
      console.error('❌ No response content from OpenAI')
      throw new Error('No response generated from OpenAI')
    }

    console.log('📝 Response length:', response.length)

    // Parse the response to extract React component, styles, and types
    const reactMatch = response.match(/REACT_COMPONENT:\s*([\s\S]*?)(?=STYLES:|TYPES:|$)/i)
    const stylesMatch = response.match(/STYLES:\s*([\s\S]*?)(?=REACT_COMPONENT:|TYPES:|$)/i)
    const typesMatch = response.match(/TYPES:\s*([\s\S]*?)(?=REACT_COMPONENT:|STYLES:|$)/i)

    if (!reactMatch) {
      console.error('❌ Could not extract React component from response')
      console.log('📄 Response preview:', response.substring(0, 500) + '...')
      throw new Error('Could not extract React component from OpenAI response')
    }

    const reactComponent = reactMatch[1].trim()
    const styles = stylesMatch ? stylesMatch[1].trim() : ''
    const types = typesMatch ? typesMatch[1].trim() : ''

    console.log('✅ Successfully parsed response sections:', {
      hasReactComponent: !!reactComponent,
      hasStyles: !!styles,
      hasTypes: !!types,
      componentLength: reactComponent.length
    })

    // Create a complete Next.js page component
    const completeReactCode = `'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

${types}

${reactComponent}

export default MedSpaLandingPage`

    return {
      html: completeReactCode,
      css: styles,
      js: '', // React components don't need separate JS
      preview: completeReactCode,
      type: 'react'
    }

  } catch (error) {
    console.error('💥 OpenAI generation error:', error)
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    })
    throw new Error('Failed to generate website with AI: ' + (error instanceof Error ? error.message : 'Unknown error'))
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