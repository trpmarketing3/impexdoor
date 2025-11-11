'use client';

import Header from "../components/Header";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import Image from "next/image";

export default function Channel() {
  // Sample YouTube video IDs - replace with actual channel videos
  const videos = [
    { id: "dQw4w9WgXcQ", title: "Export Trade Tips - Getting Started", description: "Learn the basics of export trade" },
    { id: "jNQXAC9IVRw", title: "Global Buyer Verification Process", description: "How we verify global buyers" },
    { id: "9bZkp7q19f0", title: "International Trade Best Practices", description: "Best practices for international trade" },
    { id: "kJQP7kiw5Fk", title: "Finding Verified Buyers Worldwide", description: "Tips on finding verified buyers" },
    { id: "L_jWHffIx5E", title: "Export Documentation Guide", description: "Complete guide to export documentation" },
    { id: "fJ9rUzIMcZQ", title: "Success Stories from Our Clients", description: "Real success stories from our partners" }
  ];

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Navigation />

      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-800">
              Videos
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Watch our latest videos and tutorials on global trade
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {videos.map((video) => (
              <div key={video.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative pb-[56.25%] h-0 overflow-hidden">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">{video.title}</h3>
                  <p className="text-sm text-gray-600">{video.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="https://www.youtube.com/@exporttrademart"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Subscribe to Our Videos
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
