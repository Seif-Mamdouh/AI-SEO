const luxuryTemplate = {
  html: `'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Phone, MapPin, Clock, ChevronRight, Award, Shield, Heart, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function LuxuryMedSpaLandingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  })

  const services = [
    {
      title: 'Botox & Injectables',
      description: 'Expert anti-aging treatments with premium products',
      price: 'Starting at $399',
      icon: '💎',
      features: ['Botox', 'Dermal Fillers', 'Lip Enhancement', 'Wrinkle Reduction']
    },
    {
      title: 'Laser Treatments',
      description: 'Advanced laser technology for skin rejuvenation',
      price: 'Starting at $299',
      icon: '✨',
      features: ['Laser Resurfacing', 'Hair Removal', 'Pigmentation', 'Skin Tightening']
    },
    {
      title: 'Facial Treatments',
      description: 'Luxurious facials with premium skincare products',
      price: 'Starting at $199',
      icon: '🌟',
      features: ['HydraFacial', 'Chemical Peels', 'Microdermabrasion', 'LED Therapy']
    },
    {
      title: 'Body Contouring',
      description: 'Non-invasive body sculpting treatments',
      price: 'Starting at $599',
      icon: '💫',
      features: ['CoolSculpting', 'EMSculpt', 'Radiofrequency', 'Ultrasonic Therapy']
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      rating: 5,
      text: 'The most luxurious medical spa experience I have ever had. The staff is incredibly professional and the results exceeded my expectations.',
      treatment: 'Botox & Dermal Fillers'
    },
    {
      name: 'Jennifer Adams',
      rating: 5,
      text: 'I love coming here for my monthly treatments. The atmosphere is so calming and the technology is state-of-the-art.',
      treatment: 'Laser Resurfacing'
    },
    {
      name: 'Michelle Roberts',
      rating: 5,
      text: 'Amazing results from my CoolSculpting treatment. The team made me feel comfortable throughout the entire process.',
      treatment: 'Body Contouring'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="bg-stone-900 text-white shadow-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-stone-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-amber-400">[BUSINESS_NAME]</h1>
                <p className="text-sm text-gray-300">Luxury Medical Spa</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span className="text-sm">[PHONE_NUMBER]</span>
              </div>
              <Button className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-semibold">
                Book Consultation
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-stone-900 via-stone-800 to-amber-900 text-white py-20">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-6 bg-amber-500/20 text-amber-300 border-amber-400 px-4 py-2">
                ⭐ Rated #1 Medical Spa in [CITY]
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
                Luxury Meets Excellence
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
                Experience the pinnacle of medical aesthetics with our premium treatments 
                and world-class service at [BUSINESS_NAME]
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold px-8 py-4 text-lg">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Free Consultation
                </Button>
                <Button size="lg" variant="outline" className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-stone-900 px-8 py-4 text-lg">
                  View Gallery
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
              Premium Treatments
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Indulge in our signature treatments designed to enhance your natural beauty 
              with the latest in medical aesthetics technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full bg-gradient-to-b from-amber-50 to-white border-amber-200 hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4 text-center">{service.icon}</div>
                    <h3 className="text-xl font-bold text-stone-900 mb-3 text-center">{service.title}</h3>
                    <p className="text-gray-600 mb-4 text-center text-sm">{service.description}</p>
                    <div className="space-y-2 mb-4">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-center text-sm text-gray-700">
                          <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-amber-600 mb-3">{service.price}</p>
                      <Button className="w-full bg-stone-900 hover:bg-stone-800 text-amber-400 group-hover:scale-105 transition-transform">
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

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-stone-50 to-amber-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
              Client Transformations
            </h2>
            <div className="flex items-center justify-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xl font-semibold text-stone-900 ml-2">[RATING] Stars</span>
            </div>
            <p className="text-lg text-gray-600">Over [REVIEW_COUNT] 5-star reviews from our valued clients</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white border-amber-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                    <div className="border-t border-amber-100 pt-4">
                      <p className="font-semibold text-stone-900">{testimonial.name}</p>
                      <p className="text-sm text-amber-600">{testimonial.treatment}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-amber-400">
                Begin Your Transformation
              </h2>
              <p className="text-xl text-gray-300">
                Schedule your complimentary consultation with our expert team
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-amber-400">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-amber-400" />
                    <span>[FULL_ADDRESS]</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-amber-400" />
                    <span>[PHONE_NUMBER]</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-amber-400" />
                    <span>Mon-Fri: 9AM-7PM, Sat: 9AM-5PM</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-4 text-amber-400">Why Choose [BUSINESS_NAME]?</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-amber-400" />
                      <span>Board-certified physicians</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-amber-400" />
                      <span>State-of-the-art facility</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Heart className="w-5 h-5 text-amber-400" />
                      <span>Personalized treatment plans</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Card className="bg-white text-stone-900">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-6 text-stone-900">Book Your Consultation</h3>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input 
                        placeholder="Full Name" 
                        className="border-amber-200 focus:border-amber-400"
                      />
                      <Input 
                        placeholder="Phone Number" 
                        className="border-amber-200 focus:border-amber-400"
                      />
                    </div>
                    <Input 
                      placeholder="Email Address" 
                      type="email"
                      className="border-amber-200 focus:border-amber-400"
                    />
                    <select className="w-full p-3 border border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none">
                      <option>Select Treatment Interest</option>
                      <option>Botox & Injectables</option>
                      <option>Laser Treatments</option>
                      <option>Facial Treatments</option>
                      <option>Body Contouring</option>
                      <option>Consultation Only</option>
                    </select>
                    <Textarea 
                      placeholder="Tell us about your goals and any questions you have"
                      className="border-amber-200 focus:border-amber-400"
                      rows={4}
                    />
                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-3 text-lg">
                      Schedule Free Consultation
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-stone-900" />
                </div>
                <h3 className="text-xl font-bold text-amber-400">[BUSINESS_NAME]</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Luxury medical spa dedicated to enhancing your natural beauty with the latest 
                in aesthetic treatments and personalized care.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-stone-900 font-bold text-sm">f</span>
                </div>
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-stone-900 font-bold text-sm">i</span>
                </div>
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-stone-900 font-bold text-sm">t</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-amber-400">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-amber-400 transition-colors">Services</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Gallery</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Book Appointment</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-amber-400">Contact Info</h4>
              <div className="space-y-3 text-gray-400">
                <p>[FULL_ADDRESS]</p>
                <p>[PHONE_NUMBER]</p>
                <p>info@[BUSINESS_NAME].com</p>
                <p className="text-sm">© 2024 [BUSINESS_NAME]. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}`,
  css: `/* Custom Luxury Styles */
.luxury-gradient {
  background: linear-gradient(135deg, #2C1810 0%, #D4AF37 50%, #F8F6F0 100%);
}

.luxury-shadow {
  box-shadow: 0 20px 40px rgba(212, 175, 55, 0.1);
}

.luxury-border {
  border: 2px solid #D4AF37;
}

.luxury-text-gradient {
  background: linear-gradient(135deg, #D4AF37, #F8F6F0);
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
  transition: transform 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
}

/* Premium Button Styles */
.luxury-button {
  background: linear-gradient(135deg, #D4AF37, #FFD700);
  color: #2C1810;
  font-weight: bold;
  padding: 12px 24px;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.luxury-button:hover {
  background: linear-gradient(135deg, #B8941F, #D4AF37);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
}

/* Card Hover Effects */
.luxury-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 175, 55, 0.2);
  transition: all 0.3s ease;
}

.luxury-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(212, 175, 55, 0.2);
  border-color: #D4AF37;
}`
}

export default luxuryTemplate 