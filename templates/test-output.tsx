"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Phone,
  Mail,
  MapPin,
  Star,
  Clock,
  Shield,
  Award,
  Sparkles,
  Crown,
  Gem,
  Zap,
  Target,
  CheckCircle,
  ArrowRight,
  Calendar,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// This is a template for a luxury med spa website
// It will be populated with actual business data

export default function MedSpaTemplate() {
  const [activeService, setActiveService] = useState(0)

  // This data will be replaced with actual business data
  const businessName = "Luxe Aesthetics & Wellness"
  const businessPhone = "(555) 987-6543"
  const businessRating = "4.9"
  const heroImage = "/placeholder.svg"
  const aboutImage = "/placeholder.svg"
  const galleryImage = "/placeholder.svg"

  const services = [
    {
      title: "Botox & Fillers",
      description: "Premium anti-aging injectables administered by expert aestheticians.",
      price: "Starting at $199",
      icon: <Sparkles className="w-8 h-8" />,
      features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
      technology: "Premium Technology",
      results: "95% satisfaction rate",
      image: galleryImage,
      premium: true,
    },
    {
      title: "Laser Treatments",
      description: "Advanced laser technology for skin rejuvenation and hair removal.",
      price: "Starting at $299",
      icon: <Gem className="w-8 h-8" />,
      features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
      technology: "Premium Technology",
      results: "95% satisfaction rate",
      image: galleryImage,
      premium: true,
    },
    {
      title: "HydraFacial Elite",
      description: "Luxurious facial treatment with premium serums and deep cleansing.",
      price: "Starting at $399",
      icon: <Crown className="w-8 h-8" />,
      features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
      technology: "Premium Technology",
      results: "95% satisfaction rate",
      image: galleryImage,
      premium: false,
    }
  ]

  const stats = [
    { number: "15,000+", label: "Elite Clients", icon: <Crown className="w-6 h-6" /> },
    { number: "20+", label: "Years Excellence", icon: <Award className="w-6 h-6" /> },
    { number: "99%", label: "Satisfaction Rate", icon: <Star className="w-6 h-6" /> },
    { number: "5.0", label: "Luxury Rating", icon: <Gem className="w-6 h-6" /> },
  ]

  const testimonials = [
    {
      name: "Victoria Sterling",
      role: "VIP Client",
      rating: 5,
      text: "Absolutely exquisite experience. The level of luxury and professionalism exceeded my highest expectations.",
      treatment: "Premium Treatment",
      result: "3 months ago",
      verified: true,
    },
    {
      name: "Alexander Rothschild",
      role: "Elite Member",
      rating: 5,
      text: "The epitome of luxury medical aesthetics. Every detail is perfected, from the ambiance to the results.",
      treatment: "Elite Service",
      result: "6 months ago",
      verified: true,
    },
    {
      name: "Isabella Montclair",
      role: "Platinum Client",
      rating: 5,
      text: "An oasis of luxury and expertise. The treatments are pure indulgence with incredible results.",
      treatment: "Premium Package",
      result: "2 months ago",
      verified: true,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50">
      {/* Luxury Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 shadow-lg">
        <div className="container flex h-20 items-center justify-between px-4 md:px-6">
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Crown className="h-7 w-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                {businessName}
              </span>
              <p className="text-sm text-rose-600 font-medium">Elite Aesthetic Center</p>
            </div>
          </motion.div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#services" className="text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors">
              Treatments
            </Link>
            <Link href="#about" className="text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors">
              Excellence
            </Link>
            <Link href="#gallery" className="text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors">
              Gallery
            </Link>
            <Link href="#contact" className="text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-700">
              <Phone className="h-4 w-4 text-rose-600" />
              <span className="font-medium">{businessPhone}</span>
            </div>
            <Button className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Calendar className="w-4 h-4 mr-2" />
              Book Elite Consultation
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Luxury Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-purple-50 py-20 md:py-32">
          <div className="absolute inset-0 bg-cover bg-center opacity-5" style={{ backgroundImage: `url(${heroImage})` }}></div>
          <div className="container px-4 relative">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="space-y-6">
                  <Badge className="bg-gradient-to-r from-rose-100 to-purple-100 text-rose-700 border-rose-200 px-6 py-3 text-sm font-medium">
                    <Crown className="w-4 h-4 mr-2" />
                    Award-Winning Luxury Med Spa
                  </Badge>
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-tight">
                    Elevate Your
                    <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 bg-clip-text text-transparent block">
                      Natural Elegance
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                    Experience the pinnacle of luxury aesthetic medicine. Our world-class treatments and master
                    aestheticians deliver transformative results in an atmosphere of unparalleled sophistication.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Begin Your Journey
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-rose-300 text-rose-600 hover:bg-rose-50 px-8 py-4 text-lg hover:border-rose-400 transition-all duration-300"
                  >
                    Explore Treatments
                  </Button>
                </div>

                {/* Luxury Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-rose-100 hover:shadow-xl transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <div className="flex justify-center mb-3 text-rose-600">{stat.icon}</div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative">
                  <Image
                    src={heroImage}
                    alt={`${businessName} - Luxury med spa interior`}
                    width={600}
                    height={700}
                    className="rounded-3xl shadow-2xl"
                  />
                  <div className="absolute -bottom-8 -left-8 bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-rose-100">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <Award className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">Elite Certified</p>
                        <p className="text-sm text-gray-600">Master Aestheticians</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-6 -right-6 bg-gradient-to-br from-rose-500 to-purple-600 p-4 rounded-2xl shadow-xl">
                    <div className="flex items-center space-x-2 text-white">
                      <Star className="h-5 w-5 fill-current" />
                      <span className="font-bold text-lg">{businessRating}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Luxury Services Section */}
        <section id="services" className="py-20 md:py-32 bg-gradient-to-br from-gray-50 to-rose-50">
          <div className="container px-4 md:px-6">
            <motion.div
              className="text-center space-y-6 mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-rose-100 to-purple-100 text-rose-700 px-6 py-3"
              >
                <Gem className="w-4 h-4 mr-2" />
                Signature Treatments
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
                Luxury Aesthetic
                <span className="bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent block">
                  Experiences
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Indulge in our curated collection of premium treatments, each designed to deliver exceptional results
                while providing an unmatched luxury experience.
              </p>
            </motion.div>

            <Tabs defaultValue="0" className="w-full">
              <TabsList className="mb-6 bg-gray-100 p-1 rounded-lg">
                {services.map((service, index) => (
                  <TabsTrigger 
                    key={index} 
                    value={index.toString()}
                    className="px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    {service.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {services.map((service, index) => (
                <TabsContent key={index} value={index.toString()}>
                  <Card className="bg-white/95 backdrop-blur-sm border-rose-100 shadow-2xl rounded-3xl overflow-hidden">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="p-8 lg:p-12 space-y-6">
                          <div className="flex items-center space-x-4 mb-6">
                            <div className="text-rose-600 p-3 bg-rose-100 rounded-2xl">{service.icon}</div>
                            <div>
                              <h3 className="text-3xl font-bold text-gray-900">{service.title}</h3>
                              {service.premium && (
                                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white mt-2">
                                  <Crown className="w-3 h-3 mr-1" />
                                  Premium
                                </Badge>
                              )}
                            </div>
                          </div>

                          <p className="text-lg text-gray-600 leading-relaxed">{service.description}</p>

                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-900">Signature Features:</h4>
                            <div className="grid grid-cols-2 gap-3">
                              {service.features.map((feature, i) => (
                                <div key={i} className="flex items-center space-x-2">
                                  <CheckCircle className="w-4 h-4 text-rose-500" />
                                  <span className="text-gray-700 font-medium">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-rose-50 to-purple-50 rounded-2xl p-6 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-gray-900">Technology:</span>
                              <Badge className="bg-gradient-to-r from-rose-100 to-purple-100 text-rose-700">
                                {service.technology}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-gray-900">Results:</span>
                              <span className="text-green-600 font-semibold">{service.results}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-6">
                            <div>
                              <p className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                                {service.price}
                              </p>
                              <p className="text-sm text-gray-500">Personalized consultation included</p>
                            </div>
                            <Button className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                              Reserve Treatment
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </div>

                        <div className="relative bg-gradient-to-br from-rose-100 to-purple-100 flex items-center justify-center p-8">
                          <Image
                            src={service.image}
                            alt={service.title}
                            width={500}
                            height={400}
                            className="rounded-2xl shadow-xl"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
      </main>
    </div>
  )
} 