const modernTemplate = {
  html: `'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Star, Phone, MapPin, Clock, ArrowRight, Users, TrendingUp, 
  Award, Microscope, Calendar, CheckCircle, Zap, Target 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ModernMedicalCenterLandingPage() {
  const [activeService, setActiveService] = useState(0)

  const services = [
    {
      title: 'Advanced Dermatology',
      description: 'State-of-the-art dermatological treatments and procedures',
      price: 'Starting at $299',
      icon: <Microscope className="w-8 h-8" />,
      features: ['Medical Botox', 'Dermal Fillers', 'Laser Therapy', 'Skin Analysis'],
      technology: 'FDA-approved technology',
      results: '95% patient satisfaction'
    },
    {
      title: 'Laser Medicine',
      description: 'Precision laser treatments for optimal results',
      price: 'Starting at $399',
      icon: <Zap className="w-8 h-8" />,
      features: ['CO2 Laser', 'IPL Therapy', 'Laser Hair Removal', 'Scar Treatment'],
      technology: 'Latest laser systems',
      results: '90% first-session improvement'
    },
    {
      title: 'Injectable Treatments',
      description: 'Expert administration of premium injectables',
      price: 'Starting at $499',
      icon: <Target className="w-8 h-8" />,
      features: ['Botox', 'Juvederm', 'Restylane', 'Sculptra'],
      technology: 'Medical-grade products',
      results: 'Natural-looking outcomes'
    },
    {
      title: 'Skin Rejuvenation',
      description: 'Comprehensive skin restoration and maintenance',
      price: 'Starting at $199',
      icon: <TrendingUp className="w-8 h-8" />,
      features: ['Chemical Peels', 'Microneedling', 'HydraFacial', 'LED Therapy'],
      technology: 'Clinical-grade treatments',
      results: 'Visible improvement in 2 weeks'
    }
  ]

  const stats = [
    { number: '5,000+', label: 'Patients Treated', icon: <Users className="w-6 h-6" /> },
    { number: '15+', label: 'Years Experience', icon: <Award className="w-6 h-6" /> },
    { number: '98%', label: 'Success Rate', icon: <TrendingUp className="w-6 h-6" /> },
    { number: '4.9', label: 'Star Rating', icon: <Star className="w-6 h-6" /> }
  ]

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Verified Patient',
      rating: 5,
      text: 'The most professional medical facility I have experienced. Their technology and expertise are unmatched.',
      treatment: 'Laser Resurfacing',
      result: '6 months ago'
    },
    {
      name: 'Mark Thompson',
      role: 'Verified Patient',
      rating: 5,
      text: 'Exceptional results from my Botox treatment. The medical team explained every step of the process.',
      treatment: 'Injectable Treatments',
      result: '3 months ago'
    },
    {
      name: 'Lisa Chen',
      role: 'Verified Patient',
      rating: 5,
      text: 'Professional, clean, and results-oriented. I would not go anywhere else for my aesthetic treatments.',
      treatment: 'Dermatology',
      result: '8 months ago'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Microscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">[BUSINESS_NAME]</h1>
                <p className="text-sm text-blue-600 font-medium">Medical Aesthetics Center</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors">Services</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
              <div className="flex items-center space-x-2 text-gray-700">
                <Phone className="w-4 h-4" />
                <span className="text-sm">[PHONE_NUMBER]</span>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Book Consultation
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200 px-4 py-2">
                🏥 Board-Certified Medical Professionals
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Advanced Medical
                <span className="text-blue-600 block">Aesthetics</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Experience precision medicine with our state-of-the-art treatments and 
                board-certified medical team at [BUSINESS_NAME]. Excellence in every procedure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Consultation
                </Button>
                <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4">
                  View Procedures
                </Button>
              </div>
              
              {/* Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={stat.label} className="text-center p-4 bg-white rounded-lg shadow-sm border border-blue-100">
                    <div className="flex justify-center mb-2 text-blue-600">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    ✓ FDA Approved
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="w-32 h-32 bg-white rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <Microscope className="w-16 h-16 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Advanced Technology
                  </h3>
                  <p className="text-gray-700 mb-6">
                    Latest medical equipment and FDA-approved treatments for optimal results
                  </p>
                  <div className="flex justify-center space-x-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">[RATING]</div>
                      <div className="text-sm text-gray-600">Google Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">[REVIEW_COUNT]</div>
                      <div className="text-sm text-gray-600">Reviews</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Medical Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive medical aesthetic treatments using advanced technology 
              and proven medical protocols
            </p>
          </div>

          <Tabs defaultValue="0" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
              {services.map((service, index) => (
                <TabsTrigger 
                  key={index} 
                  value={index.toString()}
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <div className="flex items-center space-x-2">
                    {service.icon}
                    <span className="hidden lg:inline">{service.title}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {services.map((service, index) => (
              <TabsContent key={index} value={index.toString()}>
                <Card className="bg-white border-blue-200">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="text-blue-600">{service.icon}</div>
                          <h3 className="text-3xl font-bold text-gray-900">{service.title}</h3>
                        </div>
                        <p className="text-lg text-gray-600 mb-6">{service.description}</p>
                        
                        <div className="space-y-4 mb-6">
                          <h4 className="text-lg font-semibold text-gray-900">Treatment Options:</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {service.features.map((feature, i) => (
                              <div key={i} className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-4 mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-gray-900">Technology:</span>
                            <Badge className="bg-blue-100 text-blue-700">{service.technology}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-900">Results:</span>
                            <span className="text-green-600 font-medium">{service.results}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-blue-600">{service.price}</p>
                            <p className="text-sm text-gray-500">Consultation required for precise pricing</p>
                          </div>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            Book Consultation
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-8 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                            {service.icon}
                          </div>
                          <h4 className="text-xl font-bold text-gray-900 mb-2">
                            Professional Treatment
                          </h4>
                          <p className="text-gray-700">
                            Administered by board-certified medical professionals using the latest technology
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Patient Results
            </h2>
            <div className="flex items-center justify-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-blue-600 text-blue-600" />
              ))}
              <span className="text-xl font-semibold text-gray-900 ml-2">[RATING] / 5.0</span>
            </div>
            <p className="text-lg text-gray-600">Based on [REVIEW_COUNT] verified patient reviews</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-gray-50 border-blue-100 hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-blue-600 text-blue-600" />
                        ))}
                      </div>
                      <Badge className="bg-green-100 text-green-700">Verified</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                    <div className="border-t border-blue-100 pt-4">
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-blue-600 font-medium">{testimonial.treatment}</span>
                        <span className="text-xs text-gray-500">{testimonial.result}</span>
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
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Schedule Your Consultation
              </h2>
              <p className="text-xl text-blue-100">
                Connect with our medical team to discuss your aesthetic goals
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-6">Medical Center Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-blue-300" />
                    <span>[FULL_ADDRESS]</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-blue-300" />
                    <span>[PHONE_NUMBER]</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-blue-300" />
                    <span>Monday-Friday: 8AM-6PM, Saturday: 9AM-4PM</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-4">Medical Excellence</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-blue-300" />
                      <span>Board-certified physicians and medical staff</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Microscope className="w-5 h-5 text-blue-300" />
                      <span>FDA-approved medical equipment and treatments</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-300" />
                      <span>Comprehensive medical consultations</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Card className="bg-white text-gray-900">
                <CardHeader>
                  <CardTitle className="text-2xl">Book Medical Consultation</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input 
                        placeholder="Full Name" 
                        className="border-blue-200 focus:border-blue-600"
                      />
                      <Input 
                        placeholder="Phone Number" 
                        className="border-blue-200 focus:border-blue-600"
                      />
                    </div>
                    <Input 
                      placeholder="Email Address" 
                      type="email"
                      className="border-blue-200 focus:border-blue-600"
                    />
                    <select className="w-full p-3 border border-blue-200 rounded-lg focus:border-blue-600 focus:outline-none">
                      <option>Select Treatment Interest</option>
                      <option>Advanced Dermatology</option>
                      <option>Laser Medicine</option>
                      <option>Injectable Treatments</option>
                      <option>Skin Rejuvenation</option>
                      <option>General Consultation</option>
                    </select>
                    <Textarea 
                      placeholder="Medical history, current concerns, and treatment goals"
                      className="border-blue-200 focus:border-blue-600"
                      rows={4}
                    />
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg">
                      Request Medical Consultation
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      All consultations are conducted by licensed medical professionals
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <Microscope className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">[BUSINESS_NAME]</h3>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Advanced medical aesthetics center providing board-certified medical treatments 
                with state-of-the-art technology and personalized patient care.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <span className="text-white font-bold text-sm">f</span>
                </div>
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <span className="text-white font-bold text-sm">i</span>
                </div>
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <span className="text-white font-bold text-sm">t</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Medical Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Dermatology</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Laser Medicine</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Injectable Treatments</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Skin Rejuvenation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-3 text-gray-400">
                <p>[FULL_ADDRESS]</p>
                <p>[PHONE_NUMBER]</p>
                <p>medical@[BUSINESS_NAME].com</p>
                <p className="text-sm">© 2024 [BUSINESS_NAME] Medical Center. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}`,
  css: `/* Modern Medical Center Styles */
.modern-gradient {
  background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 50%, #F1F5F9 100%);
}

.modern-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.1);
  transition: all 0.3s ease;
}

.modern-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
}

.modern-button {
  background: linear-gradient(135deg, #1E3A8A, #3B82F6);
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.modern-button:hover {
  background: linear-gradient(135deg, #1E40AF, #2563EB);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3);
}

/* Professional Typography */
.medical-heading {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.medical-text {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
}

/* Animation Classes */
.slide-in-left {
  animation: slideInLeft 0.8s ease-out;
}

.slide-in-right {
  animation: slideInRight 0.8s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Medical Professional Styling */
.medical-badge {
  background: linear-gradient(135deg, #DBEAFE, #BFDBFE);
  color: #1E40AF;
  border: 1px solid #3B82F6;
  font-weight: 600;
}

.stats-card {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  transition: all 0.3s ease;
}

.stats-card:hover {
  border-color: #3B82F6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

/* Tab Styling */
.medical-tabs .tab-trigger {
  transition: all 0.3s ease;
  font-weight: 500;
}

.medical-tabs .tab-trigger[data-state="active"] {
  background: #1E3A8A;
  color: white;
}

/* Form Styling */
.medical-form input,
.medical-form textarea,
.medical-form select {
  border: 2px solid #E5E7EB;
  transition: border-color 0.3s ease;
}

.medical-form input:focus,
.medical-form textarea:focus,
.medical-form select:focus {
  border-color: #3B82F6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}`
}

export default modernTemplate 