'use client';

import Link from "next/link";
import Image from "next/image";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { useState, useEffect, useMemo, FormEvent } from "react";
import { contactConfig } from "../config/contact";

interface Buyer {
  id: string;
  title: string;
  buyer_from: string | null;
  quantity: string | null;
  destination: string | null;
  payment_terms: string | null;
  looking_suppliers_from: string | null;
  description: string | null;
  category: string;
  created_at: string;
}

export default function Home() {
  // Contact form state
  const [contactLoading, setContactLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Contact form submit handler
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      contact: String(formData.get("contact") ?? "").trim(),
      subject: String(formData.get("subject") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setError("Please fill in your name, email, and message.");
      setSuccess(null);
      return;
    }

    setContactLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/contact-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result?.message ?? "Something went wrong. Please try again.");
        return;
      }

      setSuccess(result?.message ?? "Thank you! Our team will contact you shortly.");
      form.reset();
    } catch (submitError) {
      setError("Network error. Please try again in a moment.");
    } finally {
      setContactLoading(false);
    }
  };

  // Auto-playing slides
  const slides = [
    "/images/slide1.jpg",
    "/images/slide2.jpg",
    "/images/slide3.jpg",
    "/images/slide4.jpg"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);

  // Responsive slides to show
  useEffect(() => {
    const updateSlidesToShow = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1); // Mobile: 1 slide
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(1); // Tablet: 2 slides
      } else {
        setSlidesToShow(1); // Desktop: 3 slides
      }
    };

    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);
    return () => window.removeEventListener('resize', updateSlidesToShow);
  }, []);

  // Calculate max index based on slides to show
  const maxIndex = useMemo(() => {
    return Math.max(0, slides.length - slidesToShow);
  }, [slides.length, slidesToShow]);

  // Reset current index when slidesToShow changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [slidesToShow]);

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      if (prev >= maxIndex) {
        return 0; // Loop back to start
      }
      return prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      if (prev <= 0) {
        return maxIndex; // Loop to end
      }
      return prev - 1;
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= maxIndex) {
          return 0; // Loop back to start
        }
        return prev + 1;
      });
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(timer);
  }, [maxIndex]);

  // Buyers data state
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial cards to show: 6 on desktop, 4 on mobile
  const initialCardsDesktop = 6;
  const initialCardsMobile = 4;

  // Fetch buyers data from API
  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/buyers-data?activeOnly=true&perPage=100');
        const result = await response.json();
        if (result.success && result.data) {
          setBuyers(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch buyers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuyers();
  }, []);

  return (
    <main className="min-h-screen">
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
      <Header />
      <Navigation />

      {/* Multi-Slide Carousel Section */}
      <section className="relative w-full bg-gray-100 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-lg">
            {/* Carousel Container */}
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`
              }}
            >
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 px-2 sm:px-3 flex items-center justify-center"
                  style={{
                    width: `${100 / slidesToShow}%`
                  }}
                >
                  <div className="relative w-full lg:max-w-[800px] xl:max-w-[800px] mx-auto rounded-lg overflow-hidden shadow-lg">
                    {/* Desktop: Constrained width to prevent cropping, Mobile/Tablet: Full width with fixed height */}
                    <div className="relative w-full h-[250px] sm:h-[350px] md:h-[250px] lg:h-[300px] xl:h-[550px] rounded-lg overflow-hidden bg-gray-100">
                      <div 
                        className="absolute inset-0 bg-contain bg-center bg-no-repeat" 
                        style={{ backgroundImage: `url(${slide})` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows - Hidden on mobile, only show on desktop */}
            {maxIndex > 0 && (
              <>
                <button
                  onClick={prevSlide}
                  className="hidden md:block absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg transition-all backdrop-blur-sm"
                  aria-label="Previous slides"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="hidden md:block absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg transition-all backdrop-blur-sm"
                  aria-label="Next slides"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Navigation - Show all slides */}
          {/* <div className="mt-6 flex gap-2 sm:gap-3 justify-center overflow-x-auto pb-2 px-2">
            {slides.map((slide, index) => {
              const isActive = index >= currentIndex && index < currentIndex + slidesToShow;
              return (
                <button
                  key={index}
                  onClick={() => {
                    // Calculate the best starting index to show this slide
                    const targetIndex = Math.max(0, Math.min(index, maxIndex));
                    goToSlide(targetIndex);
                  }}
                  className={`flex-shrink-0 relative w-16 h-12 sm:w-20 sm:h-16 md:w-24 md:h-20 lg:w-28 lg:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    isActive
                      ? 'border-blue-500 ring-2 ring-blue-300 scale-105 shadow-lg'
                      : 'border-gray-300 hover:border-gray-400 opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                  aria-label={`View slide ${index + 1}`}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center" 
                    style={{ backgroundImage: `url(${slide})` }}
                  ></div>
                </button>
              );
            })}
          </div> */}
        </div>
      </section>




      {/* Find Verified Global Buyers Data Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a237e] mb-2">
              Find Verified Global Buyers Data
            </h2>
            <div className="w-20 h-1 bg-[#00bcd4] mx-auto"></div>
          </div>

          {/* Mobile: Vertical cards (4 cards) */}
          <div className="md:hidden">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading buyers data...</p>
              </div>
            ) : buyers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No buyers data available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 mb-6">
                {buyers.slice(0, initialCardsMobile).map((buyer) => {
                return (
                <div
                  key={buyer.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-500 border border-gray-200 overflow-hidden flex-shrink-0 h-full"
                >
                {/* Card Header */}
                <div className="p-4 pb-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-semibold text-green-600">VERIFIED</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start gap-2 mb-3">
                    <div className="text-2xl">🏳️</div>
                    <h3 className="text-base font-bold text-blue-700 leading-tight flex-1">
                      {buyer.title}
                    </h3>
                  </div>

                  {buyer.buyer_from && (
                    <p className="text-sm font-semibold text-gray-800 mb-3">
                      Buyer From {buyer.buyer_from}
                    </p>
                  )}

                  <div className="space-y-2 mb-4 flex-1">
                    {buyer.quantity && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span><strong>Quantity:</strong> {buyer.quantity}</span>
                      </div>
                    )}
                    {buyer.destination && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span><strong>Destination:</strong> {buyer.destination}</span>
                      </div>
                    )}
                    {buyer.payment_terms && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span><strong>Payment:</strong> {buyer.payment_terms}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Buyer Of {buyer.category}</span>
                  </div>

                  <Link href="/contact" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Inquire Now</span>
                  </Link>
                </div>
              </div>
              );
              })}
              </div>
            )}
          </div>

          {/* Desktop: Horizontal cards - 2 cards per row, 6 cards total (3 rows) */}
          <div className="hidden md:block pb-4 mb-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading buyers data...</p>
              </div>
            ) : buyers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No buyers data available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-8 max-w-6xl mx-auto">
                {buyers.slice(0, initialCardsDesktop).map((buyer) => {
                  return (
                  <div
                    key={buyer.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-500 border border-gray-200 overflow-hidden w-full flex flex-col"
                  >
                    {/* Card Header */}
                    <div className="p-4 pb-3 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs font-semibold text-green-600">VERIFIED</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body - Horizontal Layout */}
                    <div className="p-4 flex-1 flex flex-row gap-6">
                      {/* Left Column */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-start gap-2 mb-3">
                          <div className="text-2xl">🏳️</div>
                          <h3 className="text-base font-bold text-blue-700 leading-tight flex-1">
                            {buyer.title}
                          </h3>
                        </div>

                        {buyer.buyer_from && (
                          <p className="text-sm font-semibold text-gray-800 mb-3">
                            Buyer From {buyer.buyer_from}
                          </p>
                        )}

                        {buyer.description && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-1">Product Description</h4>
                            <p className="text-xs text-gray-600">{buyer.description}</p>
                          </div>
                        )}
                      </div>

                      {/* Right Column */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex flex-col gap-2 mb-4">
                          {buyer.quantity && (
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span><strong>Quantity Required:</strong> {buyer.quantity}</span>
                            </div>
                          )}
                          {buyer.destination && (
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span><strong>Destination:</strong> {buyer.destination}</span>
                            </div>
                          )}
                          {buyer.payment_terms && (
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span><strong>Payment Terms:</strong> {buyer.payment_terms}</span>
                            </div>
                          )}
                          {buyer.looking_suppliers_from && (
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span><strong>Looking for suppliers from:</strong> {buyer.looking_suppliers_from}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Buyer Of {buyer.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="p-4 pt-0">
                      <Link href="/contact" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>Inquire Now</span>
                      </Link>
                    </div>
                  </div>
                );
                })}
              </div>
            )}
          </div>

          {/* Show All Button - Only show if there are more buyers than displayed */}
          {!loading && buyers.length > Math.max(initialCardsDesktop, initialCardsMobile) && (
            <div className="text-center mt-8">
              <Link
                href="/buyers"
                className="inline-block bg-[#00bcd4] hover:bg-[#00acc1] text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Show All Buyers
              </Link>
            </div>
          )}
        </div>
      </section>

  {/* Product Categories Section */}
  <section className="py-10 sm:py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Our Solutions
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto px-2">
              Explore our comprehensive range of product categories for global buyers
            </p>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {/* Fruits and Vegetables */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
              <div className="relative h-48 sm:h-56 md:h-64">
                <Image
                  src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80"
                  alt="Fruits and Vegetables"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-base md:text-lg lg:text-xl mb-1">
                    Fruits and Vegetables
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Fresh and high-quality fruits and vegetables for global export markets
                </p>
              </div>
            </div>

            {/* Readymade Garments */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
              <div className="relative h-48 sm:h-56 md:h-64">
                <Image
                  src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80"
                  alt="Readymade Garments"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-base md:text-lg lg:text-xl mb-1">
                    Readymade Garments
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Premium ready-made garments and apparel for international buyers
                </p>
              </div>
            </div>

            {/* Gems and Jewellery */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
              <div className="relative h-48 sm:h-56 md:h-64">
                <Image
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80"
                  alt="Gems and Jewellery"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-base md:text-lg lg:text-xl mb-1">
                    Gems and Jewellery
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Exquisite gems and fine jewellery for export to global markets
                </p>
              </div>
            </div>

            {/* Chemical Products */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
              <div className="relative h-48 sm:h-56 md:h-64">
                <Image
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80"
                  alt="Chemical Products"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-base md:text-lg lg:text-xl mb-1">
                    Chemical Products
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  High-grade chemical products and compounds for industrial use
                </p>
              </div>
            </div>

            {/* Pharmaceutical Products */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
              <div className="relative h-48 sm:h-56 md:h-64">
                <Image
                  src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&q=80"
                  alt="Pharmaceutical Products"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-base md:text-lg lg:text-xl mb-1">
                    Pharmaceutical Products
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Pharmaceutical products meeting international quality standards
                </p>
              </div>
            </div>

            {/* Organic Products */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
              <div className="relative h-48 sm:h-56 md:h-64">
                <Image
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80"
                  alt="Organic Products"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-base md:text-lg lg:text-xl mb-1">
                    Organic Products
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Certified organic products for health-conscious global consumers
                </p>
              </div>
            </div>

            {/* Engineering Products */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
              <div className="relative h-48 sm:h-56 md:h-64">
                <Image
                  src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80"
                  alt="Engineering Products"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-base md:text-lg lg:text-xl mb-1">
                    Engineering Products
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Precision engineering products and machinery components
                </p>
              </div>
            </div>

            {/* Plastic Products */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
              <div className="relative h-48 sm:h-56 md:h-64">
                <Image
                  src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80"
                  alt="Plastic Products"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-base md:text-lg lg:text-xl mb-1">
                    Plastic Products
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  High-quality plastic products and packaging solutions
                </p>
              </div>
            </div>

            {/* Spices Products */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
              <div className="relative h-48 sm:h-56 md:h-64">
                <Image
                  src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80"
                  alt="Spices Products"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-base md:text-lg lg:text-xl mb-1">
                    Spices Products
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Premium spices and condiments for global culinary markets
                </p>
              </div>
            </div>

            {/* Textile Products */}
            <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
              <div className="relative h-48 sm:h-56 md:h-64">
                <Image
                  src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80"
                  alt="Textile Products"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-base md:text-lg lg:text-xl mb-1">
                    Textile Products
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Fine textiles and fabric products for international fashion industry
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

  {/* Additional Content Sections */}
  <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 md:mb-4">
              Why Choose IMPEX DOOR LLP ? 
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              We specialize in facilitating seamless international trade operations with expertise, reliability, and global reach.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <div className="text-4xl md:text-5xl mb-3 md:mb-4">🌍</div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">Global Network</h3>
              <p className="text-sm md:text-base text-gray-600">
                Extensive international connections to help your business expand across borders with confidence.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <div className="text-4xl md:text-5xl mb-3 md:mb-4">⚡</div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">Fast & Efficient</h3>
              <p className="text-sm md:text-base text-gray-600">
                Streamlined processes and expert handling to ensure your shipments move quickly and safely.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow sm:col-span-2 lg:col-span-1">
              <div className="text-4xl md:text-5xl mb-3 md:mb-4">🤝</div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">Trusted Partnership</h3>
              <p className="text-sm md:text-base text-gray-600">
                Google Premier Partner certification ensures you&apos;re working with industry-leading experts.
              </p>
            </div>
          </div>
        </div>
      </section>

         {/* Contact Form Section */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-b from-[#1a237e] via-[#283593] to-[#1a237e] overflow-hidden">
        {/* Background with stars */}
        <div className="absolute inset-0 opacity-30">
          {[10, 25, 45, 60, 75, 85, 15, 35, 55, 70, 20, 40, 65, 80, 30, 50, 90, 12, 38, 72].map((left, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${left}%`,
                top: `${(i * 5) % 100}%`,
                animationDelay: `${(i * 0.3) % 2}s`,
                animationDuration: `${1 + (i % 3) * 0.3}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 uppercase">
                REQUEST A CALL BACK
              </h2>
              <div className="w-20 h-1 bg-[#00bcd4] mb-8"></div>
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00bcd4]"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00bcd4]"
                      required
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="tel"
                      name="contact"
                      placeholder="Phone"
                      className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00bcd4]"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00bcd4]"
                    />
                  </div>
                </div>
                <div>
                  <textarea
                    name="message"
                    placeholder="Message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00bcd4] resize-none"
                    required
                  ></textarea>
                </div>
                {error ? (
                  <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {error}
                  </p>
                ) : null}
                {success ? (
                  <p className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
                    {success}
                  </p>
                ) : null}
                <button
                  type="submit"
                  disabled={contactLoading}
                  className="w-full sm:w-auto px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {contactLoading ? "Submitting..." : "Submit Now"}
                </button>
              </form>
            </div>

            {/* Rotating Globe */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative w-96 h-96">
                <div className="absolute inset-0 animate-spin-slow">
                  <Image
                    src="/images/globe.png"
                    alt="Global Network"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

  

      <Footer />
    </main>
  );
}
