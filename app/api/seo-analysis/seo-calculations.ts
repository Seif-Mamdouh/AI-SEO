import { CompetitorWithSEO, PageSpeedResult, SEOAnalysisResult } from './types'

export function calculateOverallSEOScore(pagespeed: PageSpeedResult): number {
  const performance = pagespeed.performance_score || 0
  const seo = pagespeed.seo_score || 0
  
  return Math.round((performance * 0.6) + (seo * 0.4))
}

export function calculateSEORankings(competitors: CompetitorWithSEO[], selectedPageSpeed?: PageSpeedResult): SEOAnalysisResult {
  const rankedCompetitors = competitors
    .filter(c => c.pagespeed_data && !c.pagespeed_data.error)
    .map(competitor => {
      const pagespeed = competitor.pagespeed_data!
      const overallScore = calculateOverallSEOScore(pagespeed)
      return {
        ...competitor,
        seo_rank: overallScore
      }
    })
    .sort((a, b) => (b.seo_rank || 0) - (a.seo_rank || 0))

  const yourScore = selectedPageSpeed ? calculateOverallSEOScore(selectedPageSpeed) : 0
  const yourPosition = rankedCompetitors.filter(c => (c.seo_rank || 0) > yourScore).length + 1

  const performanceScores = rankedCompetitors
    .map(c => c.pagespeed_data?.performance_score)
    .filter(score => score !== undefined) as number[]
  
  const seoScores = rankedCompetitors
    .map(c => c.pagespeed_data?.seo_score)
    .filter(score => score !== undefined) as number[]

  return {
    competitors: rankedCompetitors,
    yourPosition,
    averagePerformanceScore: performanceScores.length > 0 
      ? Math.round(performanceScores.reduce((a, b) => a + b, 0) / performanceScores.length)
      : 0,
    averageSEOScore: seoScores.length > 0 
      ? Math.round(seoScores.reduce((a, b) => a + b, 0) / seoScores.length)
      : 0,
    topPerformer: rankedCompetitors[0] || null
  }
}

export function generateSEORecommendations(analysis: SEOAnalysisResult, selectedPageSpeed?: PageSpeedResult): string[] {
  const recommendations: string[] = []

  if (!selectedPageSpeed) {
    recommendations.push("Add a website to your Google Business Profile to compete effectively")
    return recommendations
  }

  if (selectedPageSpeed.error) {
    recommendations.push("Fix website accessibility issues to enable proper SEO analysis")
    return recommendations
  }

  const performance = selectedPageSpeed.performance_score || 0
  const seo = selectedPageSpeed.seo_score || 0

  if (performance < 50) {
    recommendations.push("Critical: Improve website loading speed - your performance score is significantly below average")
  } else if (performance < 80) {
    recommendations.push("Average: Website performance is average, consider improvements.")
  }

  if (seo < 80) {
    recommendations.push("Improve on-page SEO elements (meta tags, headings, structured data)")
  }

  if (analysis.yourPosition > 3) {
    recommendations.push("Focus on technical SEO improvements to outrank local competitors")
  }

  if (selectedPageSpeed.largest_contentful_paint && selectedPageSpeed.largest_contentful_paint > 2500) {
    recommendations.push("Optimize largest contentful paint (reduce image sizes, improve hosting)")
  }

  return recommendations
}