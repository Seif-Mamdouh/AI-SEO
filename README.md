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

# MedSpa Search GPT

A Next.js application that helps users find and analyze medical spas using Google Places API. Users can search for med spas by name and get detailed information including ratings, reviews, and website links.

## Features

- **Smart Med Spa Search**: Uses Google Places API to find medical spas, aesthetic clinics, and dermatology practices
- **Detailed Results**: Shows ratings, reviews, contact information, and website links
- **Real-time Search**: Interactive search with loading states and instant results
- **Responsive Design**: Beautiful, modern UI built with Tailwind CSS

## Demo

Search for any med spa name and get comprehensive results with business details and SEO insights.

## Setup

### Prerequisites

1. **Google Places API Key**: You'll need a Google Cloud Project with Places API enabled
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the "Places API" and "Places API (New)"
   - Create credentials (API Key)
   - Restrict the API key to your domain/IP for security

### Installation

1. **Clone and Install Dependencies**

```bash
git clone <your-repo-url>
cd scan-med-spas
pnpm install
```

2. **Environment Variables**

Copy the environment example file:

```bash
cp env.example .env.local
```

Then open `.env.local` and add your Google Places API key:

```bash
GOOGLE_PLACES_API_KEY=your_actual_google_places_api_key_here
```

3. **Run the Development Server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## How to Use

1. **Search for Med Spas**: Enter a med spa name in the search box
2. **View Results**: Browse through the search results showing nearby medical spas
3. **Get Details**: Click on website links to visit the med spa's official site
4. **Analyze Competitors**: Use the suggestion buttons to analyze SEO performance

## API Endpoints

- `POST /api/search-medspas` - Search for medical spas using Google Places API

## Tech Stack

- **Framework**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: Google Places API
- **Deployment**: Vercel

## Deployment

Deploy with [Vercel](https://vercel.com/new):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Remember to add your `GOOGLE_PLACES_API_KEY` environment variable in your Vercel project settings.
