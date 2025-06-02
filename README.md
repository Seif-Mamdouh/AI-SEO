---
name: Vercel Postgres + Prisma Next.js Starter
slug: postgres-prisma
description: Simple Next.js template that uses Vercel Postgres as the database and Prisma as the ORM.
framework: Next.js
useCase: Starter
css: Tailwind
database: Vercel Postgres
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstorage%2Fpostgres-prisma&project-name=postgres-prisma&repository-name=postgres-prisma&demo-title=Vercel%20Postgres%20%2B%20Prisma%20Next.js%20Starter&demo-description=Simple%20Next.js%20template%20that%20uses%20Vercel%20Postgres%20as%20the%20database%20and%20Prisma%20as%20the%20ORM.&demo-url=https%3A%2F%2Fpostgres-prisma.vercel.app%2F&demo-image=https%3A%2F%2Fpostgres-prisma.vercel.app%2Fopengraph-image.png&stores=%5B%7B"type"%3A"postgres"%7D%5D
demoUrl: https://postgres-prisma.vercel.app/
relatedTemplates:
  - postgres-starter
  - postgres-kysely
  - postgres-sveltekit
---

# MedSpa Website Scanner & AI Builder

A Next.js application that scans and analyzes med spa websites for SEO performance, competitor analysis, and includes an AI-powered website builder.

## Features

- **Med Spa Search & Analysis**: Search for med spas, analyze their SEO performance, and compare with competitors
- **AI Website Builder**: Generate complete websites using OpenAI's GPT-4 based on text prompts
- **Competitor Analysis**: Real-time competitor comparison and SEO insights
- **Website Performance Analysis**: PageSpeed insights, accessibility scores, and technical SEO analysis
- **Interactive Code Editor**: Preview, edit, and download generated websites

## Prerequisites

- Node.js 18+ 
- npm/pnpm
- OpenAI API key

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd scan-med-spas
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory and add your OpenAI API key:
   
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   To get an OpenAI API key:
   - Go to [OpenAI API Platform](https://platform.openai.com/)
   - Sign up or log in to your account
   - Navigate to API Keys section
   - Create a new API key
   - Copy the key and add it to your `.env.local` file

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

## AI Website Builder Usage

1. Navigate to the AI Builder by clicking "AI Website Builder" in the header
2. Choose from quick start templates or write a custom prompt
3. Describe your website requirements in detail
4. Click "Generate Website" and wait for AI to create your site
5. Preview the generated website and switch between HTML, CSS, and JS views
6. Download the complete website files

### Example Prompts

- **Med Spa**: "Create a modern medical spa website with hero section, services grid featuring facial treatments ($120), botox ($350), laser therapy ($200), customer testimonials, and online booking form. Use blue and white color scheme."

- **Restaurant**: "Design an elegant Italian restaurant website with hero image, menu showcase, chef biography, and reservation system. Use warm colors and include pasta, pizza, and wine selections."

- **Business**: "Build a professional consulting company website with services overview, team profiles, case studies, and contact form. Modern minimalist design with corporate blue theme."

## API Endpoints

- `POST /api/search-medspas` - Search for med spas using Google Places API
- `POST /api/competitor-analysis` - Analyze competitors in the area
- `POST /api/website-parse` - Parse website content and structure
- `POST /api/generate-website` - Generate website using OpenAI (requires API key)

## Technologies Used

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS, Framer Motion
- **APIs**: OpenAI GPT-4, Google Places API, Google PageSpeed Insights
- **Analysis**: Puppeteer for website screenshots, Cheerio for content parsing

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for website generation | Yes (for AI builder) |
| `GOOGLE_PLACES_API_KEY` | Google Places API key | No (for med spa search) |
| `GOOGLE_PAGESPEED_API_KEY` | PageSpeed Insights API key | No (for performance analysis) |

## Features in Detail

### Med Spa Analysis
- Search local med spas using Google Places
- Analyze website performance and SEO
- Compare with competitors
- Generate improvement recommendations

### AI Website Builder
- **GPT-4 Integration**: Uses OpenAI's most advanced model
- **Complete Websites**: Generates HTML, CSS, and JavaScript
- **Professional Design**: Modern, responsive, and accessible
- **Industry-Specific**: Optimized for med spas, restaurants, businesses
- **Interactive Preview**: Live preview with mobile/tablet/desktop views
- **Code Export**: Download complete website files

### Performance Analysis
- PageSpeed Insights integration
- Core Web Vitals analysis
- SEO score analysis
- Accessibility evaluation
- Mobile-friendliness testing

## Development

The project structure:
```
├── app/
│   ├── page.tsx                    # Main search interface
│   ├── analyzing/                  # Analysis results page
│   ├── ai-builder/                 # AI website builder
│   └── api/
│       ├── search-medspas/         # Med spa search API
│       ├── competitor-analysis/    # Competitor analysis API
│       ├── website-parse/          # Website parsing API
│       └── generate-website/       # AI website generation API
├── components/                     # Reusable React components
├── lib/                           # Utility functions
└── public/                        # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check existing GitHub issues
- Create a new issue with detailed description
- Include steps to reproduce any bugs

---

**Note**: The AI website builder requires an OpenAI API key. API usage will incur costs based on OpenAI's pricing. Monitor your usage through the OpenAI dashboard.
