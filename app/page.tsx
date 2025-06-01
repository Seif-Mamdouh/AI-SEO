import { Search, TrendingUp, AlertCircle, Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <span className="text-xl font-semibold text-gray-900">MedSpaGPT</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
        <div className="w-full max-w-2xl text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Whats your med spa&apos;s name?
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              I&apos;ll scan your site in seconds and make sure you&apos;re beating your competitors.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Find your med spa or clinic"
              className="w-full px-6 py-4 text-lg bg-gray-100 border-0 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all duration-200 placeholder-gray-500"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black rounded-xl flex items-center justify-center hover:bg-gray-800 transition-colors">
              <Search className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Suggestion Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
            <button className="inline-flex items-center space-x-3 px-6 py-3 bg-green-100 hover:bg-green-200 rounded-full transition-colors group">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="text-green-800 font-medium">Hows my Google SEO?</span>
            </button>

            <button className="inline-flex items-center space-x-3 px-6 py-3 bg-orange-100 hover:bg-orange-200 rounded-full transition-colors group">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-orange-800 font-medium">Whats broken on my site?</span>
            </button>

            <button className="inline-flex items-center space-x-3 px-6 py-3 bg-yellow-100 hover:bg-yellow-200 rounded-full transition-colors group">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="text-yellow-800 font-medium">Whos beating me and how?</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
