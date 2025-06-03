const template1 = {
  html: `'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin, Star, Clock, Shield, Award, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Template1() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-rose-400 to-pink-500"></div>
            <span className="text-xl font-bold text-gray-900">[BUSINESS_NAME]</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#services" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Services
            </Link>
            <Link href="#about" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link href="#gallery" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Gallery
            </Link>
            <Link href="#contact" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>[PHONE_NUMBER]</span>
            </div>
            <Button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700">
              Book Now
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-pink-50">
          <div className="container px-4 py-16 md:py-24 lg:py-32">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Badge variant="secondary" className="bg-rose-100 text-rose-700 hover:bg-rose-200">
                    ✨ Award-Winning Med Spa
                  </Badge>
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                    Reveal Your
                    <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
                      {" "}
                      Natural Beauty
                    </span>
                  </h1>
                  <p className="text-lg text-gray-600 max-w-2xl">
                    Experience premium aesthetic treatments with our board-certified professionals. From anti-aging
                    solutions to body contouring, we help you look and feel your absolute best.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
                  >
                    Schedule Consultation
                  </Button>
                  <Button size="lg" variant="outline" className="border-gray-300">
                    View Services
                  </Button>
                </div>
                <div className="flex items-center space-x-6 pt-4">
                  <div className="flex items-center space-x-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">[RATING]/5 ([REVIEW_COUNT]+ reviews)</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl shadow-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                      <Award className="h-12 w-12 text-rose-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Care</h3>
                    <p className="text-gray-600">Board-certified professionals</p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 flex items-center justify-center">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Board Certified</p>
                      <p className="text-sm text-gray-600">Licensed Professionals</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <Badge variant="secondary" className="bg-rose-100 text-rose-700">
                Our Services
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Premium Aesthetic Treatments
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our comprehensive range of advanced treatments designed to enhance your natural beauty and
                boost your confidence.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Botox & Fillers",
                  description:
                    "Smooth wrinkles and restore volume with FDA-approved injectables administered by certified professionals.",
                  price: "Starting at $299",
                  image: "botox injection treatment close up",
                },
                {
                  title: "Laser Hair Removal",
                  description:
                    "Permanent hair reduction using state-of-the-art laser technology for smooth, hair-free skin.",
                  price: "Starting at $199",
                  image: "laser hair removal treatment session",
                },
                {
                  title: "HydraFacial",
                  description:
                    "Deep cleansing, exfoliation, and hydration treatment for instantly glowing, healthy skin.",
                  price: "Starting at $179",
                  image: "hydrafacial treatment glowing skin",
                },
                {
                  title: "CoolSculpting",
                  description:
                    "Non-invasive fat reduction technology to contour your body without surgery or downtime.",
                  price: "Starting at $699",
                  image: "coolsculpting body contouring treatment",
                },
                {
                  title: "Chemical Peels",
                  description: "Rejuvenate your skin with customized peels to address acne, aging, and pigmentation.",
                  price: "Starting at $149",
                  image: "chemical peel facial treatment",
                },
                {
                  title: "Microneedling",
                  description: "Stimulate collagen production for improved skin texture, tone, and reduced scarring.",
                  price: "Starting at $249",
                  image: "microneedling skin treatment procedure",
                },
              ].map((service, index) => (
                <Card key={index} className="group hover:shadow-lg transition-shadow duration-300">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <div className="w-full h-48 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                      <div className="text-4xl">💎</div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                        <Badge variant="secondary" className="bg-rose-100 text-rose-700">
                          {service.price}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{service.description}</p>
                      <Button variant="outline" className="w-full group-hover:bg-rose-50 group-hover:border-rose-200">
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Badge variant="secondary" className="bg-rose-100 text-rose-700">
                    About [BUSINESS_NAME]
                  </Badge>
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Excellence in Aesthetic Medicine
                  </h2>
                  <p className="text-lg text-gray-600">
                    With over 15 years of experience, our team of board-certified professionals is dedicated to
                    providing the highest quality aesthetic treatments in a luxurious, comfortable environment.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-rose-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">10,000+</p>
                      <p className="text-sm text-gray-600">Happy Clients</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                      <Award className="h-5 w-5 text-rose-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">15+</p>
                      <p className="text-sm text-gray-600">Years Experience</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-rose-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">100%</p>
                      <p className="text-sm text-gray-600">Licensed & Certified</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                      <Star className="h-5 w-5 text-rose-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">[RATING]/5</p>
                      <p className="text-sm text-gray-600">Client Rating</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="w-full h-80 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl shadow-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                      <Award className="h-16 w-16 text-rose-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">[BUSINESS_NAME]</h3>
                    <p className="text-gray-600">Premium Medical Spa</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <Badge variant="secondary" className="bg-rose-100 text-rose-700">
                Results Gallery
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Real Results, Real Confidence
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                See the amazing transformations our clients have achieved with our expert treatments.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                "before after botox treatment results",
                "laser hair removal smooth skin results",
                "hydrafacial glowing skin transformation",
                "coolsculpting body contouring results",
                "chemical peel skin improvement",
                "microneedling acne scar treatment",
                "dermal filler lip enhancement",
                "anti-aging facial treatment results",
              ].map((query, index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg">
                  <div className="w-full h-64 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <div className="text-4xl">✨</div>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button variant="secondary" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <Badge variant="secondary" className="bg-rose-100 text-rose-700">
                Client Reviews
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">What Our Clients Say</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Sarah Johnson",
                  treatment: "Botox & Fillers",
                  review:
                    "The results exceeded my expectations! The staff is incredibly professional and made me feel comfortable throughout the entire process.",
                  rating: 5,
                },
                {
                  name: "Michael Chen",
                  treatment: "Laser Hair Removal",
                  review:
                    "Finally found a permanent solution to unwanted hair. The treatment was virtually painless and the results are amazing.",
                  rating: 5,
                },
                {
                  name: "Emily Rodriguez",
                  treatment: "HydraFacial",
                  review:
                    "My skin has never looked better! The HydraFacial gave me an instant glow that lasted for weeks. Highly recommend!",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <Card key={index} className="bg-white">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-600 italic">"{testimonial.review}"</p>
                      <div className="border-t pt-4">
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-600">{testimonial.treatment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="max-w-2xl mx-auto">
              <div className="space-y-6">
                <div className="space-y-4 text-center">
                  <Badge variant="secondary" className="bg-rose-100 text-rose-700">
                    Contact Us
                  </Badge>
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Ready to Begin Your Journey?
                  </h2>
                  <p className="text-lg text-gray-600">
                    Reach out to us today and discover how we can help you achieve your aesthetic goals.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-rose-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">[PHONE_NUMBER]</p>
                      <p className="text-sm text-gray-600">Call or text us</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-rose-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">info@[BUSINESS_NAME].com</p>
                      <p className="text-sm text-gray-600">Email us anytime</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-rose-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">[FULL_ADDRESS]</p>
                      <p className="text-sm text-gray-600">Visit our location</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-rose-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Mon-Fri: 9AM-7PM</p>
                      <p className="text-sm text-gray-600">Sat: 9AM-5PM, Sun: Closed</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center mt-8">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
                  >
                    Call Us Today
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container px-4 py-12 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-rose-400 to-pink-500"></div>
                <span className="text-xl font-bold">[BUSINESS_NAME]</span>
              </div>
              <p className="text-gray-400">
                Premium aesthetic treatments with board-certified professionals in a luxurious environment.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Botox & Fillers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Laser Hair Removal
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    HydraFacial
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    CoolSculpting
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Our Team
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Reviews
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>[PHONE_NUMBER]</li>
                <li>info@[BUSINESS_NAME].com</li>
                <li>[FULL_ADDRESS]</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 [BUSINESS_NAME]. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}`,
  css: `/* Rose Theme Styles */
.rose-gradient {
  background: linear-gradient(135deg, #F43F5E 0%, #EC4899 50%, #FDF2F8 100%);
}

.rose-shadow {
  box-shadow: 0 20px 40px rgba(244, 63, 94, 0.1);
}

.rose-border {
  border: 2px solid #F43F5E;
}

.rose-text-gradient {
  background: linear-gradient(135deg, #F43F5E, #EC4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Elegant Animation Classes */
.fade-in-elegant {
  animation: fadeInElegant 1s ease-out;
}

@keyframes fadeInElegant {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hover-elegant {
  transition: all 0.3s ease;
}

.hover-elegant:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(244, 63, 94, 0.15);
}

/* Premium Rose Button Styles */
.rose-button {
  background: linear-gradient(135deg, #F43F5E, #EC4899);
  color: white;
  font-weight: 600;
  padding: 12px 28px;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.rose-button:hover {
  background: linear-gradient(135deg, #E11D48, #DB2777);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(244, 63, 94, 0.3);
}

/* Card Hover Effects */
.rose-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(244, 63, 94, 0.1);
  transition: all 0.3s ease;
  border-radius: 12px;
}

.rose-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 32px rgba(244, 63, 94, 0.15);
  border-color: rgba(244, 63, 94, 0.3);
}

/* Professional Typography */
.elegant-heading {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.elegant-text {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
}

/* Badge Styling */
.rose-badge {
  background: linear-gradient(135deg, #FDF2F8, #FCE7F3);
  color: #BE185D;
  border: 1px solid #F43F5E;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
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
  box-shadow: 0 20px 40px rgba(244, 63, 94, 0.12);
  border-color: rgba(244, 63, 94, 0.2);
}

/* Statistics Animation */
.stat-number {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #F43F5E, #EC4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}`
}

export default template1
