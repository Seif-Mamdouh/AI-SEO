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
  const businessName = "{{BUSINESS_NAME}}"
  const businessPhone = "{{BUSINESS_PHONE}}"
  const businessRating = "{{BUSINESS_RATING}}"
  const businessAddress = "{{BUSINESS_ADDRESS}}"
  const heroImage = "/placeholder.svg"
  const aboutImage = "/placeholder.svg"
  const galleryImage = "/placeholder.svg"

  const services = [
    {
      title: "{{SERVICE_TITLE_1}}",
      description: "{{SERVICE_DESCRIPTION_1}}",
      price: "{{SERVICE_PRICE_1}}",
      icon: <Sparkles className="w-8 h-8" />,
      features: ["{{SERVICE_FEATURE_1_1}}", "{{SERVICE_FEATURE_1_2}}", "{{SERVICE_FEATURE_1_3}}", "{{SERVICE_FEATURE_1_4}}"],
      technology: "{{SERVICE_TECHNOLOGY_1}}",
      results: "{{SERVICE_RESULTS_1}}",
      image: galleryImage,
      premium: true,
    },
    {
      title: "{{SERVICE_TITLE_2}}",
      description: "{{SERVICE_DESCRIPTION_2}}",
      price: "{{SERVICE_PRICE_2}}",
      icon: <Gem className="w-8 h-8" />,
      features: ["{{SERVICE_FEATURE_2_1}}", "{{SERVICE_FEATURE_2_2}}", "{{SERVICE_FEATURE_2_3}}", "{{SERVICE_FEATURE_2_4}}"],
      technology: "{{SERVICE_TECHNOLOGY_2}}",
      results: "{{SERVICE_RESULTS_2}}",
      image: galleryImage,
      premium: true,
    },
    {
      title: "{{SERVICE_TITLE_3}}",
      description: "{{SERVICE_DESCRIPTION_3}}",
      price: "{{SERVICE_PRICE_3}}",
      icon: <Crown className="w-8 h-8" />,
      features: ["{{SERVICE_FEATURE_3_1}}", "{{SERVICE_FEATURE_3_2}}", "{{SERVICE_FEATURE_3_3}}", "{{SERVICE_FEATURE_3_4}}"],
      technology: "{{SERVICE_TECHNOLOGY_3}}",
      results: "{{SERVICE_RESULTS_3}}",
      image: galleryImage,
      premium: false,
    }
  ]

  const stats = [
    { number: "{{STAT_NUMBER_1}}", label: "{{STAT_LABEL_1}}", icon: <Crown className="w-6 h-6" /> },
    { number: "{{STAT_NUMBER_2}}", label: "{{STAT_LABEL_2}}", icon: <Award className="w-6 h-6" /> },
    { number: "{{STAT_NUMBER_3}}", label: "{{STAT_LABEL_3}}", icon: <Star className="w-6 h-6" /> },
    { number: "{{STAT_NUMBER_4}}", label: "{{STAT_LABEL_4}}", icon: <Gem className="w-6 h-6" /> },
  ]

  const testimonials = [
    {
      name: "{{TESTIMONIAL_NAME_1}}",
      role: "{{TESTIMONIAL_ROLE_1}}",
      rating: 5,
      text: "{{TESTIMONIAL_TEXT_1}}",
      treatment: "{{TESTIMONIAL_TREATMENT_1}}",
      result: "{{TESTIMONIAL_RESULT_1}}",
      verified: true,
    },
    {
      name: "{{TESTIMONIAL_NAME_2}}",
      role: "{{TESTIMONIAL_ROLE_2}}",
      rating: 5,
      text: "{{TESTIMONIAL_TEXT_2}}",
      treatment: "{{TESTIMONIAL_TREATMENT_2}}",
      result: "{{TESTIMONIAL_RESULT_2}}",
      verified: true,
    },
    {
      name: "{{TESTIMONIAL_NAME_3}}",
      role: "{{TESTIMONIAL_ROLE_3}}",
      rating: 5,
      text: "{{TESTIMONIAL_TEXT_3}}",
      treatment: "{{TESTIMONIAL_TREATMENT_3}}",
      result: "{{TESTIMONIAL_RESULT_3}}",
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

      {/* About Section */}
      <section id="about" className="py-20 md:py-32 bg-gradient-to-br from-white to-rose-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6">
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-rose-100 to-purple-100 text-rose-700 px-6 py-3"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Excellence Redefined
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                  The Pinnacle of
                  <span className="bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent block">
                    Aesthetic Excellence
                  </span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  For over two decades, {businessName} has redefined luxury in aesthetic medicine. Our master aestheticians,
                  state-of-the-art technology, and unwavering commitment to perfection create an experience that
                  transcends traditional beauty treatments.
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex items-center space-x-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-rose-100">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-rose-400 to-purple-600 flex items-center justify-center">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-2xl">25,000+</p>
                    <p className="text-sm text-gray-600">Elite Transformations</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-rose-100">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-rose-400 to-purple-600 flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-2xl">20+</p>
                    <p className="text-sm text-gray-600">Years of Mastery</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-rose-100">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-rose-400 to-purple-600 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-2xl">100%</p>
                    <p className="text-sm text-gray-600">Master Certified</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-rose-100">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-rose-400 to-purple-600 flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-2xl">{businessRating}</p>
                    <p className="text-sm text-gray-600">Google Rating</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Image
                src={aboutImage}
                alt={`${businessName} - Luxury med spa excellence`}
                width={700}
                height={600}
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -top-8 -left-8 bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 rounded-2xl shadow-xl">
                <div className="flex items-center space-x-2 text-white">
                  <Crown className="h-6 w-6" />
                  <span className="font-bold text-lg">Elite Status</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 md:py-32 bg-gradient-to-br from-gray-50 to-purple-50">
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
              <Sparkles className="w-4 h-4 mr-2" />
              Transformation Gallery
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              Extraordinary
              <span className="bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent block">
                Transformations
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Witness the artistry of our master aestheticians through these remarkable before and after
              transformations at {businessName}.
            </p>
          </motion.div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <motion.div
                key={index}
                className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Image
                  src={galleryImage}
                  alt={`${businessName} - Transformation ${index}`}
                  width={350}
                  height={350}
                  className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                  <Button variant="secondary" size="sm" className="bg-white/90 backdrop-blur-sm hover:bg-white">
                    <Sparkles className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
                <div className="absolute top-4 right-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Premium Result
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-white to-rose-50">
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
              <Crown className="w-4 h-4 mr-2" />
              Elite Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              What Our Elite
              <span className="bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent block">
                Clients Say
              </span>
            </h2>
            <div className="flex items-center justify-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 fill-rose-500 text-rose-500" />
              ))}
              <span className="text-2xl font-bold text-gray-900 ml-4">{businessRating} / 5.0</span>
            </div>
            <p className="text-lg text-gray-600">Based on verified luxury client reviews</p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white/95 backdrop-blur-sm border-rose-100 hover:shadow-2xl transition-all duration-500 h-full rounded-2xl overflow-hidden">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-rose-500 text-rose-500" />
                          ))}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                          <Badge className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700">
                            <Crown className="w-3 h-3 mr-1" />
                            VIP
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-700 text-lg italic leading-relaxed">"{testimonial.text}"</p>
                      <div className="border-t border-rose-100 pt-6">
                        <p className="font-bold text-gray-900 text-lg">{testimonial.name}</p>
                        <p className="text-sm text-rose-600 font-medium">{testimonial.role}</p>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-sm text-purple-600 font-medium">{testimonial.treatment}</span>
                          <span className="text-xs text-gray-500">{testimonial.result}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 md:py-32 bg-gradient-to-br from-gray-900 via-purple-900 to-rose-900 text-white"
      >
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center space-y-6 mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-white/20 text-white border-white/30 px-6 py-3">
                <Calendar className="w-4 h-4 mr-2" />
                Elite Consultation
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold">
                Begin Your Luxury
                <span className="bg-gradient-to-r from-rose-300 to-purple-300 bg-clip-text text-transparent block">
                  Transformation
                </span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Experience the pinnacle of luxury aesthetic medicine at {businessName}. Schedule your private consultation with our
                master aestheticians today.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h3 className="text-2xl font-bold mb-8">Elite Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-rose-400 to-purple-600 flex items-center justify-center">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{businessPhone}</p>
                      <p className="text-sm text-gray-300">VIP Concierge Line</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-rose-400 to-purple-600 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">info@{businessName.toLowerCase().replace(/\s+/g, '')}.com</p>
                      <p className="text-sm text-gray-300">Luxury Consultations</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-rose-400 to-purple-600 flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{businessAddress}</p>
                      <p className="text-sm text-gray-300">Luxury Location</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-rose-400 to-purple-600 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">Mon-Fri: 9AM-8PM</p>
                      <p className="text-sm text-gray-300">Sat: 9AM-6PM, Sun: By Appointment</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-rose-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl border border-white/20">
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <Crown className="w-5 h-5 mr-2 text-yellow-400" />
                    Luxury Excellence
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-3">
                      <Award className="w-4 h-4 text-rose-300" />
                      <span>Master-certified aesthetic professionals</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Gem className="w-4 h-4 text-rose-300" />
                      <span>Premium Swiss and German technology</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="w-4 h-4 text-rose-300" />
                      <span>Comprehensive luxury consultations</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="text-center mb-8">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white px-12 py-8 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Elite Consultation
                  </Button>
                  <p className="text-sm text-gray-300 mt-4">
                    Complimentary luxury consultation with master aesthetician
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container px-4 py-16 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Crown className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
                    {businessName}
                  </h3>
                  <p className="text-sm text-rose-400">Elite Aesthetic Center</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The pinnacle of luxury aesthetic medicine, delivering transformative results through master
                craftsmanship and cutting-edge technology.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-rose-400">Signature Treatments</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-rose-400 transition-colors flex items-center">
                    <Sparkles className="w-3 h-3 mr-2" />
                    {services[0].title}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-rose-400 transition-colors flex items-center">
                    <Gem className="w-3 h-3 mr-2" />
                    {services[1].title}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-rose-400 transition-colors flex items-center">
                    <Crown className="w-3 h-3 mr-2" />
                    {services[2].title}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-rose-400">Excellence</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-rose-400 transition-colors">
                    Master Aestheticians
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-rose-400 transition-colors">
                    Luxury Experience
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-rose-400 transition-colors">
                    Elite Reviews
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-rose-400 transition-colors">
                    VIP Membership
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-rose-400">Elite Contact</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-rose-400" />
                  {businessPhone}
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-rose-400" />
                  info@{businessName.toLowerCase().replace(/\s+/g, '')}.com
                </li>
                <li className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 text-rose-400 mt-1" />
                  <span>
                    {businessAddress}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} {businessName} Elite Aesthetic Center. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <Link href="#" className="text-gray-400 hover:text-rose-400 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-rose-400 transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-rose-400 transition-colors text-sm">
                VIP Membership
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 