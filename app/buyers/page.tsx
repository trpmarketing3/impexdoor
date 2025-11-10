'use client';

import Link from "next/link";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { useState, useMemo } from "react";

export default function Buyers() {
  // Buyers data - same as home page
  const allBuyers = [
    {
      id: 1,
      verified: true,
      date: "Nov-04-25",
      country: "Singapore",
      countryCode: "SG",
      title: "Wanted : Scrap Like Copper Scrap",
      buyerFrom: "Singapore, Singapore, Singapore",
      quantity: "200 - 500 Metric Tons",
      destination: "India",
      paymentTerms: "L/C Or T/T",
      supplierOrigin: "Worldwide",
      description: "Please provide a quotation to the following requirement from importer",
      category: "Metal Scraps",
      subCategory: "Copper Scrap"
    },
    {
      id: 2,
      verified: true,
      date: "Nov-03-25",
      country: "USA",
      countryCode: "US",
      title: "Wanted : Premium Cotton Fabric",
      buyerFrom: "New York, USA",
      quantity: "1000 - 2000 Yards",
      destination: "Bangladesh",
      paymentTerms: "T/T Advance",
      supplierOrigin: "Asia",
      description: "Looking for high-quality cotton fabric for manufacturing",
      category: "Textiles",
      subCategory: "Cotton Fabric"
    },
    {
      id: 3,
      verified: true,
      date: "Nov-02-25",
      country: "Germany",
      countryCode: "DE",
      title: "Wanted : Industrial Machinery Parts",
      buyerFrom: "Berlin, Germany",
      quantity: "50 - 100 Units",
      destination: "Germany",
      paymentTerms: "L/C at Sight",
      supplierOrigin: "Worldwide",
      description: "Require industrial machinery parts for manufacturing unit",
      category: "Machinery",
      subCategory: "Industrial Parts"
    },
    {
      id: 4,
      verified: true,
      date: "Nov-01-25",
      country: "Japan",
      countryCode: "JP",
      title: "Wanted : Organic Green Tea",
      buyerFrom: "Tokyo, Japan",
      quantity: "500 - 1000 Kg",
      destination: "Japan",
      paymentTerms: "L/C 30 Days",
      supplierOrigin: "India, China, Sri Lanka",
      description: "Seeking premium quality organic green tea",
      category: "Food & Beverages",
      subCategory: "Tea"
    },
    {
      id: 5,
      verified: true,
      date: "Oct-31-25",
      country: "UAE",
      countryCode: "AE",
      title: "Wanted : Crude Oil",
      buyerFrom: "Dubai, UAE",
      quantity: "10000 - 20000 Barrels",
      destination: "UAE",
      paymentTerms: "T/T or L/C",
      supplierOrigin: "Middle East, Africa",
      description: "Regular requirement for crude oil supply",
      category: "Oil & Gas",
      subCategory: "Crude Oil"
    },
    {
      id: 6,
      verified: true,
      date: "Oct-30-25",
      country: "UK",
      countryCode: "GB",
      title: "Wanted : Handmade Carpets",
      buyerFrom: "London, UK",
      quantity: "200 - 500 Pieces",
      destination: "UK",
      paymentTerms: "T/T 50% Advance",
      supplierOrigin: "India, Pakistan, Iran",
      description: "Premium handmade carpets for retail business",
      category: "Home Decor",
      subCategory: "Carpets"
    },
    {
      id: 7,
      verified: true,
      date: "Oct-29-25",
      country: "Australia",
      countryCode: "AU",
      title: "Wanted : Fresh Fruits",
      buyerFrom: "Sydney, Australia",
      quantity: "5000 - 10000 Kg",
      destination: "Australia",
      paymentTerms: "T/T Net 30",
      supplierOrigin: "Asia, South America",
      description: "Regular import of fresh seasonal fruits",
      category: "Agriculture",
      subCategory: "Fruits"
    },
    {
      id: 8,
      verified: true,
      date: "Oct-28-25",
      country: "Canada",
      countryCode: "CA",
      title: "Wanted : Timber & Wood Products",
      buyerFrom: "Toronto, Canada",
      quantity: "1000 - 2000 Cubic Meters",
      destination: "Canada",
      paymentTerms: "L/C or T/T",
      supplierOrigin: "North America, Europe",
      description: "Sustainable timber and wood products required",
      category: "Forestry",
      subCategory: "Timber"
    },
    {
      id: 9,
      verified: true,
      date: "Oct-27-25",
      country: "France",
      countryCode: "FR",
      title: "Wanted : Wine & Spirits",
      buyerFrom: "Paris, France",
      quantity: "500 - 1000 Bottles",
      destination: "France",
      paymentTerms: "L/C at Sight",
      supplierOrigin: "Europe, South America",
      description: "Premium wine and spirits for distribution",
      category: "Beverages",
      subCategory: "Wine & Spirits"
    },
    {
      id: 10,
      verified: true,
      date: "Oct-26-25",
      country: "Italy",
      countryCode: "IT",
      title: "Wanted : Luxury Leather Goods",
      buyerFrom: "Milan, Italy",
      quantity: "100 - 500 Pieces",
      destination: "Italy",
      paymentTerms: "T/T 30% Advance",
      supplierOrigin: "Europe, Asia",
      description: "High-end leather goods for fashion industry",
      category: "Fashion",
      subCategory: "Leather Goods"
    },
    {
      id: 11,
      verified: true,
      date: "Oct-25-25",
      country: "Spain",
      countryCode: "ES",
      title: "Wanted : Olive Oil",
      buyerFrom: "Madrid, Spain",
      quantity: "2000 - 5000 Liters",
      destination: "Spain",
      paymentTerms: "L/C 60 Days",
      supplierOrigin: "Mediterranean, Europe",
      description: "Extra virgin olive oil for retail",
      category: "Food & Beverages",
      subCategory: "Olive Oil"
    },
    {
      id: 12,
      verified: true,
      date: "Oct-24-25",
      country: "Netherlands",
      countryCode: "NL",
      title: "Wanted : Tulip Bulbs",
      buyerFrom: "Amsterdam, Netherlands",
      quantity: "10000 - 20000 Bulbs",
      destination: "Netherlands",
      paymentTerms: "T/T Net 45",
      supplierOrigin: "Europe, Asia",
      description: "Quality tulip bulbs for horticulture",
      category: "Agriculture",
      subCategory: "Flowers"
    }
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter buyers based on search query
  const filteredBuyers = useMemo(() => {
    if (!searchQuery.trim()) {
      return allBuyers;
    }
    const query = searchQuery.toLowerCase();
    return allBuyers.filter(buyer =>
      buyer.title.toLowerCase().includes(query) ||
      buyer.category.toLowerCase().includes(query) ||
      buyer.subCategory.toLowerCase().includes(query) ||
      buyer.buyerFrom.toLowerCase().includes(query) ||
      buyer.country.toLowerCase().includes(query) ||
      buyer.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredBuyers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBuyers = filteredBuyers.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />

      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a237e] mb-2">
              Find Verified Global Buyers Data
            </h1>
            <div className="w-20 h-1 bg-[#00bcd4] mx-auto mb-6"></div>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by product, category, country, or description..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-3 pl-12 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00bcd4] focus:border-transparent text-gray-900"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchQuery && (
                <p className="text-sm text-gray-600 mt-2">
                  Found {filteredBuyers.length} result{filteredBuyers.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

          {/* Buyers Grid */}
          {currentBuyers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
                {currentBuyers.map((buyer) => (
                  <div
                    key={buyer.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col"
                  >
                    {/* Card Header */}
                    <div className="p-4 pb-3 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        {buyer.verified && (
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs font-semibold text-green-600">VERIFIED</span>
                          </div>
                        )}
                        <span className="text-xs text-gray-500">{buyer.date}</span>
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

                      <p className="text-sm font-semibold text-gray-800 mb-3">
                        Buyer From {buyer.buyerFrom}
                      </p>

                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-1">Product Description</h4>
                        <p className="text-xs text-gray-600 mb-3">{buyer.description}</p>
                      </div>

                      <div className="flex flex-col gap-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span><strong>Quantity:</strong> {buyer.quantity}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span><strong>Destination:</strong> {buyer.destination}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span><strong>Payment Terms:</strong> {buyer.paymentTerms}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span><strong>Suppliers from:</strong> {buyer.supplierOrigin}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Buyer Of {buyer.category}</span>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">{buyer.subCategory}</span>
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
                ))}
              </div>

              {/* Pagination - Only show if more than 10 items */}
              {filteredBuyers.length > itemsPerPage && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        currentPage === page
                          ? 'bg-[#00bcd4] text-white border-[#00bcd4]'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No buyers found matching your search criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="mt-4 text-[#00bcd4] hover:text-[#00acc1] underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

