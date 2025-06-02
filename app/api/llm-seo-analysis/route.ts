import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

interface SEOAnalysisData {
  selectedMedspa: any
  competitors: any[]
  analysis: any
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  console.log('🤖 LLM SEO Analysis API called at:', new Date().toISOString())
  
  try {
    const body = await request.json()
    const { seoData }: { seoData: SEOAnalysisData } = body

    if (!seoData) {
      return NextResponse.json(
        { error: 'SEO analysis data is required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OpenAI API key not configured')
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    console.log('🔍 Analyzing SEO data for:', seoData.selectedMedspa.name)
    console.log('📊 Data includes:', {
      hasPagespeedData: !!seoData.selectedMedspa.pagespeed_data,
      hasWebsiteData: !!seoData.selectedMedspa.website_data,
      competitorCount: seoData.competitors.length,
      hasAnalysis: !!seoData.analysis
    })

    // Generate comprehensive SEO analysis report
    const llmReport = await generateSEOAnalysisReport(seoData)
    
    const duration = Date.now() - startTime
    console.log('✅ LLM SEO analysis completed in:', duration + 'ms')

    return NextResponse.json({
      success: true,
      report: llmReport,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error('❌ LLM SEO analysis error after', totalTime, 'ms:', error)
    
    return NextResponse.json({
      error: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      success: false
    }, { status: 500 })
  }
}

async function generateSEOAnalysisReport(seoData: SEOAnalysisData) {
  const { selectedMedspa, competitors, analysis } = seoData
  
  // Prepare structured data for the LLM
  const competitorsWithWebsites = competitors.filter(c => c.website && c.pagespeed_data && !c.pagespeed_data.error)
  const medSpaPageSpeed = selectedMedspa.pagespeed_data
  const medSpaWebsite = selectedMedspa.website_data
  
  // Create detailed prompt with all the SEO data
  const prompt = `You are an expert SEO consultant analyzing a medical spa's digital presence. Generate a comprehensive, professional SEO analysis report based on the following data:

**BUSINESS BEING ANALYZED:**
Business Name: ${selectedMedspa.name}
Address: ${selectedMedspa.formatted_address}
Google Rating: ${selectedMedspa.rating}/5 (${selectedMedspa.user_ratings_total || 0} reviews)
Website: ${selectedMedspa.website || 'No website listed'}
Phone: ${selectedMedspa.formatted_phone_number || 'Not available'}

**CURRENT SEO PERFORMANCE:**
${medSpaPageSpeed && !medSpaPageSpeed.error ? `
Performance Score: ${medSpaPageSpeed.performance_score}/100
SEO Score: ${medSpaPageSpeed.seo_score}/100
Accessibility Score: ${medSpaPageSpeed.accessibility_score || 'N/A'}/100
Best Practices Score: ${medSpaPageSpeed.best_practices_score || 'N/A'}/100
Loading Experience: ${medSpaPageSpeed.loading_experience || 'Unknown'}
Largest Contentful Paint: ${medSpaPageSpeed.largest_contentful_paint ? (medSpaPageSpeed.largest_contentful_paint / 1000).toFixed(2) + 's' : 'N/A'}
Cumulative Layout Shift: ${medSpaPageSpeed.cumulative_layout_shift || 'N/A'}
` : 'No performance data available (likely no website)'}

**WEBSITE CONTENT ANALYSIS:**
${medSpaWebsite && !medSpaWebsite.error ? `
Page Title: ${medSpaWebsite.title || 'Missing'}
Meta Description: ${medSpaWebsite.description || 'Missing'}
H1 Headings: ${medSpaWebsite.headings?.h1?.length || 0} found
H2 Headings: ${medSpaWebsite.headings?.h2?.length || 0} found
Images: ${medSpaWebsite.images?.length || 0} found
Internal Links: ${medSpaWebsite.links?.length || 0} found
Social Media Links: ${medSpaWebsite.socialLinks?.length || 0} found
Contact Info Found: Email: ${medSpaWebsite.contactInfo?.email ? 'Yes' : 'No'}, Phone: ${medSpaWebsite.contactInfo?.phone ? 'Yes' : 'No'}
Website Structure:
- Navigation: ${medSpaWebsite.structure?.hasNavigation ? 'Yes' : 'No'}
- Footer: ${medSpaWebsite.structure?.hasFooter ? 'Yes' : 'No'}
- Contact Form: ${medSpaWebsite.structure?.hasContactForm ? 'Yes' : 'No'}
- Booking Form: ${medSpaWebsite.structure?.hasBookingForm ? 'Yes' : 'No'}
` : 'No website content data available'}

**COMPETITIVE ANALYSIS:**
Your Current SEO Position: #${analysis.yourSEOPosition} out of ${analysis.totalCompetitors} local competitors
Competitors with Websites: ${analysis.competitorsWithWebsites}/${analysis.totalCompetitors}
Average Competitor Performance Score: ${analysis.averagePerformanceScore}/100
Average Competitor SEO Score: ${analysis.averageSEOScore}/100

**TOP COMPETITORS ANALYSIS:**
${competitorsWithWebsites.slice(0, 5).map((comp, index) => `
${index + 1}. ${comp.name}
   - Distance: ${comp.distance_miles} miles away
   - Google Rating: ${comp.rating}/5 (${comp.user_ratings_total || 0} reviews)
   - Performance Score: ${comp.pagespeed_data.performance_score}/100
   - SEO Score: ${comp.pagespeed_data.seo_score}/100
   - Overall SEO Rank: ${comp.seo_rank}
   - Website: ${comp.website}
`).join('\n')}

**CURRENT RECOMMENDATIONS:**
${analysis.recommendations?.map((rec: string) => `- ${rec}`).join('\n') || 'No specific recommendations generated'}

**REPORT REQUIREMENTS:**
Generate a comprehensive, professional SEO analysis report with the following sections:

1. **Executive Summary** (2-3 sentences)
2. **Current Digital Position** (strengths and weaknesses)
3. **Competitive Landscape Analysis** (how you compare to competitors)
4. **Technical SEO Audit** (performance issues and opportunities)
5. **Content & User Experience Analysis** (if website exists)
6. **Priority Action Items** (specific, actionable recommendations ranked by impact)
7. **Expected Impact** (potential improvements from implementing recommendations)

**WRITING STYLE:**
- Professional but conversational tone
- Use specific numbers and data points
- Focus on actionable insights
- Highlight urgent issues vs. long-term improvements
- Medical spa industry context and terminology
- Clear priority ranking for recommendations

Format the response as clean, structured text with clear headings and bullet points where appropriate. Focus on being helpful and specific rather than generic.`

  try {
    console.log('🤖 Sending SEO data to OpenAI for analysis...')
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert SEO consultant specializing in medical spa and healthcare marketing. You provide detailed, actionable SEO analysis reports with specific recommendations based on comprehensive data analysis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    })

    const report = completion.choices[0]?.message?.content

    if (!report) {
      throw new Error('No report generated by OpenAI')
    }

    console.log('✅ LLM analysis report generated successfully')
    console.log('📊 Report length:', report.length, 'characters')

    return {
      content: report,
      generatedAt: new Date().toISOString(),
      model: "gpt-4",
      tokensUsed: completion.usage?.total_tokens || 0
    }

  } catch (error) {
    console.error('❌ OpenAI API error:', error)
    throw new Error(`Failed to generate LLM analysis: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
} 