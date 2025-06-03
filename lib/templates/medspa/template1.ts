const template1 = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[BUSINESS_NAME] - Premium Medical Spa</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Rose Theme Styles */
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
        
        /* Hero image background */
        .hero-bg {
            background-image: linear-gradient(rgba(244, 63, 94, 0.1), rgba(236, 72, 153, 0.1)), url('[HERO_IMAGE]');
            background-size: cover;
            background-position: center;
        }
        
        /* Animation classes */
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
        
        /* Custom button styles */
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
    </style>
</head>
<body class="flex flex-col min-h-screen bg-white">

    <!-- Header -->
    <header class="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
        <div class="container flex h-16 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
            <div class="flex items-center space-x-2">
                <div class="h-8 w-8 rounded-full bg-gradient-to-r from-rose-400 to-pink-500"></div>
                <span class="text-xl font-bold text-gray-900">[BUSINESS_NAME]</span>
            </div>
            <nav class="hidden md:flex items-center space-x-8">
                <a href="#services" class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Services</a>
                <a href="#about" class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">About</a>
                <a href="#gallery" class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Gallery</a>
                <a href="#contact" class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
            </nav>
            <div class="flex items-center space-x-4">
                <div class="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <span>[PHONE_NUMBER]</span>
                </div>
                <button class="rose-button">Book Now</button>
            </div>
        </div>
    </header>

    <main class="flex-1">
        <!-- Hero Section -->
        <section class="relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-pink-50 hero-bg">
            <div class="container px-4 py-16 md:py-24 lg:py-32 max-w-7xl mx-auto">
                <div class="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
                    <div class="space-y-6">
                        <div class="space-y-4">
                            <span class="inline-block bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-medium">
                                ✨ Award-Winning Med Spa
                            </span>
                            <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                                Reveal Your
                                <span class="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
                                    Natural Beauty
                                </span>
                            </h1>
                            <p class="text-lg text-gray-600 max-w-2xl">
                                Experience premium aesthetic treatments at [BUSINESS_NAME] with our board-certified professionals. From anti-aging solutions to body contouring, we help you look and feel your absolute best.
                            </p>
                        </div>
                        <div class="flex flex-col sm:flex-row gap-4">
                            <button class="rose-button text-lg px-8 py-4">Schedule Consultation</button>
                            <button class="px-8 py-4 border border-gray-300 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors">View Services</button>
                        </div>
                        <div class="flex items-center space-x-6 pt-4">
                            <div class="flex items-center space-x-1">
                                <div class="flex">
                                    <span class="text-yellow-400">★★★★★</span>
                                </div>
                                <span class="text-sm text-gray-600 ml-2">[RATING]/5 ([REVIEW_COUNT]+ reviews)</span>
                            </div>
                        </div>
                    </div>
                    <div class="relative">
                        <div class="w-full h-96 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
                            <img src="[GALLERY_IMAGE_1]" alt="[BUSINESS_NAME] Treatment Room" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                            <div class="text-center hidden">
                                <div class="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                                    <svg class="h-12 w-12 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                                    </svg>
                                </div>
                                <h3 class="text-xl font-bold text-gray-900 mb-2">Premium Care</h3>
                                <p class="text-gray-600">Board-certified professionals</p>
                            </div>
                        </div>
                        <div class="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                            <div class="flex items-center space-x-3">
                                <div class="h-12 w-12 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 flex items-center justify-center">
                                    <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-900">Board Certified</p>
                                    <p class="text-sm text-gray-600">Licensed Professionals</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Services Section -->
        <section id="services" class="py-16 md:py-24">
            <div class="container px-4 md:px-6 max-w-7xl mx-auto">
                <div class="text-center space-y-4 mb-12">
                    <span class="inline-block bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-medium">Our Services</span>
                    <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Premium Aesthetic Treatments
                    </h2>
                    <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover our comprehensive range of advanced treatments at [BUSINESS_NAME] designed to enhance your natural beauty and boost your confidence.
                    </p>
                </div>
                <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    [SERVICES_PLACEHOLDER]
                </div>
            </div>
        </section>

        <!-- About Section -->
        <section id="about" class="py-16 md:py-24 bg-gray-50">
            <div class="container px-4 md:px-6 max-w-7xl mx-auto">
                <div class="grid gap-12 lg:grid-cols-2 items-center">
                    <div class="space-y-6">
                        <div class="space-y-4">
                            <span class="inline-block bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-medium">
                                About [BUSINESS_NAME]
                            </span>
                            <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Excellence in Aesthetic Medicine
                            </h2>
                            <p class="text-lg text-gray-600">
                                With over 15 years of experience, our team at [BUSINESS_NAME] of board-certified professionals is dedicated to providing the highest quality aesthetic treatments in a luxurious, comfortable environment.
                            </p>
                        </div>
                        <div class="grid gap-4 sm:grid-cols-2">
                            <div class="flex items-center space-x-3">
                                <div class="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                                    <svg class="h-5 w-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-900">10,000+</p>
                                    <p class="text-sm text-gray-600">Happy Clients</p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-3">
                                <div class="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                                    <svg class="h-5 w-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-900">15+</p>
                                    <p class="text-sm text-gray-600">Years Experience</p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-3">
                                <div class="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                                    <svg class="h-5 w-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-900">100%</p>
                                    <p class="text-sm text-gray-600">Licensed & Certified</p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-3">
                                <div class="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                                    <svg class="h-5 w-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-900">[RATING]/5</p>
                                    <p class="text-sm text-gray-600">Client Rating</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="relative">
                        <div class="w-full h-80 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl shadow-xl flex items-center justify-center overflow-hidden">
                            <img src="[GALLERY_IMAGE_2]" alt="[BUSINESS_NAME] Facility" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                            <div class="text-center hidden">
                                <div class="w-32 h-32 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                                    <svg class="h-16 w-16 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                                    </svg>
                                </div>
                                <h3 class="text-2xl font-bold text-gray-900 mb-2">[BUSINESS_NAME]</h3>
                                <p class="text-gray-600">Premium Medical Spa</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Gallery Section -->
        <section id="gallery" class="py-16 md:py-24">
            <div class="container px-4 md:px-6 max-w-7xl mx-auto">
                <div class="text-center space-y-4 mb-12">
                    <span class="inline-block bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-medium">Results Gallery</span>
                    <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Real Results, Real Confidence
                    </h2>
                    <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                        See the amazing transformations our clients have achieved at [BUSINESS_NAME] with our expert treatments.
                    </p>
                </div>
                <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div class="relative group overflow-hidden rounded-lg hover-elegant">
                        <div class="w-full h-64 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center overflow-hidden">
                            <img src="[GALLERY_IMAGE_1]" alt="[BUSINESS_NAME] Treatment Results" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                            <div class="text-4xl">✨</div>
                        </div>
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <button class="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium">View Details</button>
                        </div>
                    </div>
                    <div class="relative group overflow-hidden rounded-lg hover-elegant">
                        <div class="w-full h-64 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center overflow-hidden">
                            <img src="[GALLERY_IMAGE_2]" alt="[BUSINESS_NAME] Treatment Results" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                            <div class="text-4xl">✨</div>
                        </div>
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <button class="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium">View Details</button>
                        </div>
                    </div>
                    <div class="relative group overflow-hidden rounded-lg hover-elegant">
                        <div class="w-full h-64 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center overflow-hidden">
                            <img src="[GALLERY_IMAGE_3]" alt="[BUSINESS_NAME] Treatment Results" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                            <div class="text-4xl">✨</div>
                        </div>
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <button class="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium">View Details</button>
                        </div>
                    </div>
                    <div class="relative group overflow-hidden rounded-lg hover-elegant">
                        <div class="w-full h-64 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center overflow-hidden">
                            <img src="[TREATMENT_IMAGE]" alt="[BUSINESS_NAME] Treatment Results" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                            <div class="text-4xl">✨</div>
                        </div>
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <button class="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-medium">View Details</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Testimonials Section -->
        <section class="py-16 md:py-24 bg-gray-50">
            <div class="container px-4 md:px-6 max-w-7xl mx-auto">
                <div class="text-center space-y-4 mb-12">
                    <span class="inline-block bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-medium">Client Reviews</span>
                    <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">What Our Clients Say</h2>
                </div>
                <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div class="bg-white p-6 rounded-xl shadow-md hover-elegant">
                        <div class="space-y-4">
                            <div class="flex">
                                <span class="text-yellow-400">★★★★★</span>
                            </div>
                            <p class="text-gray-600 italic">"The results at [BUSINESS_NAME] exceeded my expectations! The staff is incredibly professional and made me feel comfortable throughout the entire process."</p>
                            <div class="border-t pt-4">
                                <p class="font-semibold text-gray-900">Sarah Johnson</p>
                                <p class="text-sm text-gray-600">Botox & Fillers</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-md hover-elegant">
                        <div class="space-y-4">
                            <div class="flex">
                                <span class="text-yellow-400">★★★★★</span>
                            </div>
                            <p class="text-gray-600 italic">"Finally found a permanent solution to unwanted hair at [BUSINESS_NAME]. The treatment was virtually painless and the results are amazing."</p>
                            <div class="border-t pt-4">
                                <p class="font-semibold text-gray-900">Michael Chen</p>
                                <p class="text-sm text-gray-600">Laser Hair Removal</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-md hover-elegant">
                        <div class="space-y-4">
                            <div class="flex">
                                <span class="text-yellow-400">★★★★★</span>
                            </div>
                            <p class="text-gray-600 italic">"My skin has never looked better! The HydraFacial at [BUSINESS_NAME] gave me an instant glow that lasted for weeks. Highly recommend!"</p>
                            <div class="border-t pt-4">
                                <p class="font-semibold text-gray-900">Emily Rodriguez</p>
                                <p class="text-sm text-gray-600">HydraFacial</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="py-16 md:py-24">
            <div class="container px-4 md:px-6 max-w-7xl mx-auto">
                <div class="max-w-2xl mx-auto">
                    <div class="space-y-6">
                        <div class="space-y-4 text-center">
                            <span class="inline-block bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-medium">Contact Us</span>
                            <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Ready to Begin Your Journey?
                            </h2>
                            <p class="text-lg text-gray-600">
                                Reach out to [BUSINESS_NAME] today and discover how we can help you achieve your aesthetic goals.
                            </p>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <div class="flex items-center space-x-3">
                                <div class="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                                    <svg class="h-5 w-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-900">[PHONE_NUMBER]</p>
                                    <p class="text-sm text-gray-600">Call or text us</p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-3">
                                <div class="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                                    <svg class="h-5 w-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-900">[EMAIL]</p>
                                    <p class="text-sm text-gray-600">Email us anytime</p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-3">
                                <div class="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                                    <svg class="h-5 w-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-900">[FULL_ADDRESS]</p>
                                    <p class="text-sm text-gray-600">Visit our location</p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-3">
                                <div class="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                                    <svg class="h-5 w-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-900">[BUSINESS_HOURS]</p>
                                    <p class="text-sm text-gray-600">Our operating hours</p>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-center mt-8">
                            <button class="rose-button text-lg px-8 py-4">Call Us Today</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white">
        <div class="container px-4 py-12 md:px-6 max-w-7xl mx-auto">
            <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                <div class="space-y-4">
                    <div class="flex items-center space-x-2">
                        <div class="h-8 w-8 rounded-full bg-gradient-to-r from-rose-400 to-pink-500"></div>
                        <span class="text-xl font-bold">[BUSINESS_NAME]</span>
                    </div>
                    <p class="text-gray-400">
                        Premium aesthetic treatments with board-certified professionals in a luxurious environment.
                    </p>
                </div>
                <div class="space-y-4">
                    <h4 class="text-lg font-semibold">Services</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#" class="hover:text-white transition-colors">Botox & Fillers</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Laser Hair Removal</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">HydraFacial</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">CoolSculpting</a></li>
                    </ul>
                </div>
                <div class="space-y-4">
                    <h4 class="text-lg font-semibold">Company</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="#" class="hover:text-white transition-colors">About Us</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Our Team</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Reviews</a></li>
                        <li><a href="#" class="hover:text-white transition-colors">Careers</a></li>
                    </ul>
                </div>
                <div class="space-y-4">
                    <h4 class="text-lg font-semibold">Contact</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li>[PHONE_NUMBER]</li>
                        <li>[EMAIL]</li>
                        <li>[FULL_ADDRESS]</li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
                <p class="text-gray-400 text-sm">© 2024 [BUSINESS_NAME]. All rights reserved.</p>
                <div class="flex space-x-6 mt-4 sm:mt-0">
                    <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
                    <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>

    <script>
        // Simple smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    </script>

</body>
</html>`,
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