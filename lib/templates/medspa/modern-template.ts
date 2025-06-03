const modernTemplate = {
  html: `"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
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

export default function Component() {
  const [activeService, setActiveService] = useState(0)

  const services = [
    {
      title: "Platinum Botox & Fillers",
      description:
        "Premium anti-aging treatments with the world's finest injectables, administered by master aestheticians.",
      price: "Starting at $599",
      icon: <Sparkles className="w-8 h-8" />,
      features: ["Premium Botox", "Luxury Fillers", "Diamond Lift", "Platinum Touch"],
      technology: "Swiss Precision Technology",
      results: "99% client satisfaction",
      image: "luxury botox treatment premium spa",
      premium: true,
    },
    {
      title: "Diamond Laser Treatments",
      description: "State-of-the-art laser technology for flawless skin transformation and permanent hair removal.",
      price: "Starting at $399",
      icon: <Gem className="w-8 h-8" />,
      features: ["Diamond Laser", "Crystal Clear IPL", "Platinum Hair Removal", "Gold Standard Resurfacing"],
      technology: "Medical-Grade Lasers",
      results: "95% first-session improvement",
      image: "diamond laser treatment luxury medical spa",
      premium: true,
    },
    {
      title: "Royal HydraFacial",
      description: "The ultimate luxury facial experience with premium serums and diamond-tip exfoliation.",
      price: "Starting at $299",
      icon: <Crown className="w-8 h-8" />,
      features: ["Diamond Exfoliation", "Platinum Serums", "Gold Infusion", "Crystal Hydration"],
      technology: "Luxury HydraFacial MD",
      results: "Instant luminous glow",
      image: "royal hydrafacial luxury spa treatment",
      premium: false,
    },
    {
      title: "Elite CoolSculpting",
      description: "Premium body contouring with the latest CoolSculpting Elite technology for sculpted perfection.",
      price: "Starting at $999",
      icon: <Zap className="w-8 h-8" />,
      features: ["CoolSculpting Elite", "Dual Applicators", "Precision Contouring", "VIP Recovery"],
      technology: "CoolSculpting Elite System",
      results: "25% fat reduction per session",
      image: "elite coolsculpting luxury body contouring",
      premium: true,
    },
    {
      title: "Platinum Chemical Peels",
      description: "Luxury chemical peels using premium formulations for dramatic skin transformation.",
      price: "Starting at $249",
      icon: <Target className="w-8 h-8" />,
      features: ["Medical-Grade Peels", "Custom Formulations", "Luxury Aftercare", "Premium Recovery"],
      technology: "Swiss Skincare Technology",
      results: "Visible results in 7 days",
      image: "platinum chemical peel luxury treatment",
      premium: false,
    },
    {
      title: "Gold Microneedling",
      description: "Advanced microneedling with 24k gold-infused serums for ultimate skin rejuvenation.",
      price: "Starting at $399",
      icon: <Crown className="w-8 h-8" />,
      features: ["24k Gold Infusion", "Medical Microneedling", "Luxury Serums", "Premium Recovery"],
      technology: "Gold-Standard RF Technology",
      results: "Dramatic texture improvement",
      image: "gold microneedling luxury skin treatment",
      premium: true,
    },
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
      text: "Absolutely exquisite experience. The level of luxury and professionalism exceeded my highest expectations. My skin has never looked more radiant.",
      treatment: "Platinum Botox & Diamond Laser",
      result: "3 months ago",
      verified: true,
    },
    {
      name: "Alexander Rothschild",
      role: "Elite Member",
      rating: 5,
      text: "The epitome of luxury medical aesthetics. Every detail is perfected, from the ambiance to the results. Truly world-class.",
      treatment: "Elite CoolSculpting",
      result: "6 months ago",
      verified: true,
    },
    {
      name: "Isabella Montclair",
      role: "Platinum Client",
      rating: 5,
      text: "An oasis of luxury and expertise. The Royal HydraFacial is pure indulgence with incredible results. I wouldn't go anywhere else.",
      treatment: "Royal HydraFacial & Gold Microneedling",
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
                [BUSINESS_NAME]
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
              <span className="font-medium">[PHONE_NUMBER]</span>
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
                    Experience the pinnacle of luxury aesthetic medicine at [BUSINESS_NAME]. Our world-class treatments and master
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
                  <div className="w-full h-[700px] bg-gradient-to-br from-rose-100 to-purple-100 rounded-3xl shadow-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-white rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                        <Crown className="w-16 h-16 text-rose-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Luxury Experience</h3>
                      <p className="text-gray-600">Elite Aesthetic Center</p>
                    </div>
                  </div>
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
                      <span className="font-bold text-lg">[RATING]</span>
                    </div>
                  </div>
                </div>
              </motion.div>
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
                  Experience the pinnacle of luxury aesthetic medicine at [BUSINESS_NAME]. Schedule your private consultation with our
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
                        <p className="font-semibold text-lg">[PHONE_NUMBER]</p>
                        <p className="text-sm text-gray-300">VIP Concierge Line</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-rose-400 to-purple-600 flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">[FULL_ADDRESS]</p>
                        <p className="text-sm text-gray-300">Luxury Medical Center</p>
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
                      Luxury Excellence at [BUSINESS_NAME]
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
                      className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white px-12 py-4 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Schedule Elite Consultation
                    </Button>
                    <p className="text-sm text-gray-300 mt-4">
                      Complimentary luxury consultation with master aesthetician at [BUSINESS_NAME]
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
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
                    [BUSINESS_NAME]
                  </h3>
                  <p className="text-sm text-rose-400">Elite Aesthetic Center</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The pinnacle of luxury aesthetic medicine at [BUSINESS_NAME], delivering transformative results through master
                craftsmanship and cutting-edge technology.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-rose-400">Signature Treatments</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-rose-400 transition-colors flex items-center">
                    <Sparkles className="w-3 h-3 mr-2" />
                    Platinum Botox & Fillers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-rose-400 transition-colors flex items-center">
                    <Gem className="w-3 h-3 mr-2" />
                    Diamond Laser Treatments
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-rose-400 transition-colors flex items-center">
                    <Crown className="w-3 h-3 mr-2" />
                    Royal HydraFacial
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-rose-400 transition-colors flex items-center">
                    <Zap className="w-3 h-3 mr-2" />
                    Elite CoolSculpting
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
                  [PHONE_NUMBER]
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-rose-400" />
                  info@[BUSINESS_NAME].com
                </li>
                <li className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 text-rose-400 mt-1" />
                  <span>[FULL_ADDRESS]</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 [BUSINESS_NAME] Elite Aesthetic Center. All rights reserved.
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
}`,
  css: `/* Luxury Rose/Pink/Purple Styles */
.luxury-gradient {
  background: linear-gradient(135deg, #F43F5E 0%, #EC4899 50%, #A855F7 100%);
}

.luxury-shadow {
  box-shadow: 0 20px 40px rgba(244, 63, 94, 0.15);
}

.luxury-border {
  border: 2px solid #F43F5E;
}

.luxury-text-gradient {
  background: linear-gradient(135deg, #F43F5E, #EC4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Premium Animation Classes */
.fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(244, 63, 94, 0.2);
}

/* Elite Button Styles */
.luxury-button {
  background: linear-gradient(135deg, #F43F5E, #EC4899, #A855F7);
  color: white;
  font-weight: bold;
  padding: 12px 24px;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(244, 63, 94, 0.3);
}

.luxury-button:hover {
  background: linear-gradient(135deg, #E11D48, #DB2777, #9333EA);
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(244, 63, 94, 0.4);
}

/* Luxury Card Effects */
.luxury-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(244, 63, 94, 0.1);
  transition: all 0.3s ease;
  border-radius: 16px;
}

.luxury-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 48px rgba(244, 63, 94, 0.15);
  border-color: rgba(244, 63, 94, 0.3);
}

/* Crown and Premium Elements */
.crown-accent {
  color: #FBBF24;
  filter: drop-shadow(0 2px 4px rgba(251, 191, 36, 0.3));
}

.gem-accent {
  color: #A855F7;
  filter: drop-shadow(0 2px 4px rgba(168, 85, 247, 0.3));
}

/* Responsive Design Enhancements */
@media (max-width: 768px) {
  .luxury-card {
    margin-bottom: 1.5rem;
  }
  
  .luxury-button {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}

/* Smooth Scrolling */
html {
  scroll-behavior: smooth;
}

/* Elite Navigation Backdrop */
.nav-backdrop {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

/* Premium Service Cards */
.service-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s ease;
  border: 1px solid #FDF2F8;
}

.service-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 24px 48px rgba(244, 63, 94, 0.12);
  border-color: rgba(244, 63, 94, 0.2);
}

/* Luxury Testimonial Cards */
.testimonial-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
  border: 1px solid #FDF2F8;
}

.testimonial-card:hover {
  box-shadow: 0 16px 32px rgba(244, 63, 94, 0.1);
  transform: translateY(-6px);
}

/* Elite Badge Styling */
.elite-badge {
  background: linear-gradient(135deg, #FEF3C7, #FDE68A);
  color: #92400E;
  border: 1px solid #F59E0B;
  font-weight: 600;
}

/* Premium Stats Cards */
.stats-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(244, 63, 94, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

.stats-card:hover {
  border-color: rgba(244, 63, 94, 0.3);
  box-shadow: 0 8px 24px rgba(244, 63, 94, 0.15);
  transform: translateY(-4px);
}

/* Luxury Footer Styling */
.luxury-footer {
  background: linear-gradient(135deg, #111827, #374151);
}

/* Elite Contact Section */
.contact-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.contact-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}`
}

export default modernTemplate 