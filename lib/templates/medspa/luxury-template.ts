const luxuryTemplate = {
  html: `"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Star,
  Phone,
  ChevronRight,
  Award,
  Shield,
  Heart,
  Sparkles,
  Calendar,
  Menu,
  X,
  ArrowRight,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ModernMedSpaTemplate() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  })

  const services = [
    {
      title: "Botox & Injectables",
      description: "Expert anti-aging treatments with premium FDA-approved products for natural-looking results",
      price: "Starting at $399",
      icon: "💎",
      features: ["Botox Cosmetic", "Dermal Fillers", "Lip Enhancement", "Wrinkle Reduction"],
      popular: true,
    },
    {
      title: "Laser Treatments",
      description: "Advanced laser technology for comprehensive skin rejuvenation and hair removal",
      price: "Starting at $299",
      icon: "✨",
      features: ["Laser Resurfacing", "IPL Photofacial", "Laser Hair Removal", "Skin Tightening"],
    },
    {
      title: "Facial Treatments",
      description: "Luxurious medical-grade facials with cutting-edge skincare technology",
      price: "Starting at $199",
      icon: "🌟",
      features: ["HydraFacial MD", "Chemical Peels", "Microneedling", "LED Light Therapy"],
    },
    {
      title: "Body Contouring",
      description: "Non-invasive body sculpting treatments for targeted fat reduction",
      price: "Starting at $599",
      icon: "💫",
      features: ["CoolSculpting Elite", "EMSculpt Neo", "Radiofrequency", "Ultrasonic Cavitation"],
    },
  ]

  const testimonials = [
    {
      name: "Sarah Mitchell",
      rating: 5,
      text: "The most professional and luxurious medical spa experience. The results exceeded my expectations and the staff made me feel completely comfortable.",
      treatment: "Botox & Dermal Fillers",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Jennifer Adams",
      rating: 5,
      text: "I love the modern facility and state-of-the-art technology. My skin has never looked better after my laser treatments.",
      treatment: "Laser Resurfacing",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Michelle Roberts",
      rating: 5,
      text: "Amazing results from CoolSculpting! The team was knowledgeable and made the entire process comfortable and effective.",
      treatment: "Body Contouring",
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  const stats = [
    { number: "10,000+", label: "Happy Clients" },
    { number: "15+", label: "Years Experience" },
    { number: "50+", label: "Treatment Options" },
    { number: "98%", label: "Satisfaction Rate" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">[BUSINESS_NAME]</h1>
                <p className="text-xs text-gray-500">Premium Aesthetics</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#services" className="text-gray-700 hover:text-purple-500 transition-colors">
                Services
              </a>
              <a href="#about" className="text-gray-700 hover:text-purple-500 transition-colors">
                About
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-purple-500 transition-colors">
                Reviews
              </a>
              <a href="#contact" className="text-gray-700 hover:text-purple-500 transition-colors">
                Contact
              </a>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>[PHONE_NUMBER]</span>
              </div>
              <Button className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white">
                Book Now
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:hidden mt-4 pb-4 border-t border-gray-100"
            >
              <div className="flex flex-col space-y-4 pt-4">
                <a href="#services" className="text-gray-700 hover:text-purple-500 transition-colors">
                  Services
                </a>
                <a href="#about" className="text-gray-700 hover:text-purple-500 transition-colors">
                  About
                </a>
                <a href="#testimonials" className="text-gray-700 hover:text-purple-500 transition-colors">
                  Reviews
                </a>
                <a href="#contact" className="text-gray-700 hover:text-purple-500 transition-colors">
                  Contact
                </a>
                <Button className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white w-full">
                  Book Consultation
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-violet-50 to-white"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <Badge className="mb-6 bg-purple-100 text-purple-700 border-purple-200 px-4 py-2 text-sm font-medium">
                ⭐ #1 Rated Medical Spa in [CITY]
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Reveal Your
                <span className="block bg-gradient-to-r from-purple-500 to-violet-500 bg-clip-text text-transparent">
                  Natural Beauty
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Experience premium medical aesthetics with personalized treatments designed to enhance your confidence
                and natural radiance at [BUSINESS_NAME].
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white px-8 py-4"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Free Consultation
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4"
                >
                  View Treatments
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
              <div className="mt-8 flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">[RATING]/5 stars ([REVIEW_COUNT]+ reviews)</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="w-full h-[600px] bg-gradient-to-br from-purple-100 to-violet-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-white rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                      <Sparkles className="w-16 h-16 text-purple-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Care</h3>
                    <p className="text-gray-600">State-of-the-art facility</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full border-2 border-white flex items-center justify-center text-white font-medium"
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">2,500+ Happy Clients</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Premium Treatments</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our comprehensive range of medical aesthetic treatments, each designed with precision and care to
              help you achieve your beauty goals at [BUSINESS_NAME].
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <Card className="h-full bg-white border-gray-200 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                  {service.popular && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-purple-500 text-white">Most Popular</Badge>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{service.description}</p>
                    <div className="space-y-2 mb-6">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <div className="mt-auto">
                      <p className="text-lg font-bold text-purple-600 mb-4">{service.price}</p>
                      <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white group-hover:bg-purple-500 group-hover:text-white transition-all">
                        Learn More
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose [BUSINESS_NAME]?</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We combine medical expertise with luxury service to deliver exceptional results in a comfortable,
                state-of-the-art environment located at [FULL_ADDRESS].
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Board-Certified Physicians</h3>
                    <p className="text-gray-600">
                      Our team consists of experienced, board-certified medical professionals.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Technology</h3>
                    <p className="text-gray-600">
                      We use the latest FDA-approved equipment and techniques for optimal results.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Care</h3>
                    <p className="text-gray-600">Every treatment plan is customized to your unique needs and goals.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="w-full h-[300px] bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl shadow-lg flex items-center justify-center">
                  <div className="text-center">
                    <Award className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                    <p className="font-semibold text-gray-900">Treatment Room</p>
                  </div>
                </div>
                <div className="w-full h-[300px] bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl shadow-lg mt-8 flex items-center justify-center">
                  <div className="text-center">
                    <Heart className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                    <p className="font-semibold text-gray-900">Consultation Room</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Client Success Stories</h2>
            <div className="flex items-center justify-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-xl font-semibold text-gray-900 ml-2">[RATING]/5 Stars</span>
            </div>
            <p className="text-lg text-gray-600">Based on [REVIEW_COUNT]+ verified reviews</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-purple-600">{testimonial.treatment}</p>
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
      <section id="contact" className="py-20 bg-purple-600 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Ready to Begin Your Transformation?</h2>
            <p className="text-xl text-purple-100">Schedule your complimentary consultation with our expert team at [BUSINESS_NAME]</p>
          </div>
          <div className="max-w-md mx-auto text-center">
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center space-x-3">
                <Phone className="w-5 h-5" />
                <span className="text-lg">[PHONE_NUMBER]</span>
              </div>
              <p className="text-purple-100">[FULL_ADDRESS]</p>
            </div>
            <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Free Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">[BUSINESS_NAME]</h3>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Premium medical spa dedicated to enhancing your natural beauty with the latest in aesthetic treatments
                and personalized care.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <span className="text-white font-bold text-sm">f</span>
                </div>
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <span className="text-white font-bold text-sm">ig</span>
                </div>
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <span className="text-white font-bold text-sm">tw</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#services" className="hover:text-purple-400 transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-purple-400 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="hover:text-purple-400 transition-colors">
                    Reviews
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-purple-400 transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Before & After
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-3 text-gray-400">
                <p>[FULL_ADDRESS]</p>
                <p>[PHONE_NUMBER]</p>
                <p>info@[BUSINESS_NAME].com</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 [BUSINESS_NAME]. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  )
}`,
  css: `/* Custom Purple/Violet Luxury Styles */
.luxury-gradient {
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%);
}

.luxury-shadow {
  box-shadow: 0 20px 40px rgba(139, 92, 246, 0.15);
}

.luxury-border {
  border: 2px solid #8B5CF6;
}

.luxury-text-gradient {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Animation Classes */
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
  box-shadow: 0 20px 40px rgba(139, 92, 246, 0.2);
}

/* Premium Button Styles */
.luxury-button {
  background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  color: white;
  font-weight: bold;
  padding: 12px 24px;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.luxury-button:hover {
  background: linear-gradient(135deg, #7C3AED, #6D28D9);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
}

/* Card Hover Effects */
.luxury-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(139, 92, 246, 0.1);
  transition: all 0.3s ease;
  border-radius: 12px;
}

.luxury-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.3);
}

/* Responsive Design Enhancements */
@media (max-width: 768px) {
  .luxury-card {
    margin-bottom: 1rem;
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

/* Navigation Backdrop */
.nav-backdrop {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Service Card Enhancements */
.service-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #F1F5F9;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(139, 92, 246, 0.12);
  border-color: rgba(139, 92, 246, 0.2);
}

/* Testimonial Card Styling */
.testimonial-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  border: 1px solid #E5E7EB;
}

.testimonial-card:hover {
  box-shadow: 0 12px 24px rgba(139, 92, 246, 0.1);
  transform: translateY(-4px);
}`
}

export default luxuryTemplate 