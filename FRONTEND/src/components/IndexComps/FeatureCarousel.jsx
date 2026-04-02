import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// The data array containing the images and write-ups
const featuresData = [
  {
    id: 1,
    title: "Student-Only Verification",
    description: "Sign up with your .edu.ng email or matriculation number. Every user is a verified, real student — no imposters, no scam accounts, no strangers.",
    // Replace these URLs with your actual local paths (e.g., '/images/verification.jpg')
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop" 
  },
  {
    id: 2,
    title: "Escrow Payment Protection",
    description: "Funds are held securely until delivery is confirmed. Your money never goes directly to a stranger — both sides are always protected.",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Verified Housing Section",
    description: "Find off-campus accommodation through vetted agents with a fixed, transparent ₦8,000 fee. No exploitation, no hidden charges, no surprises.",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Ratings & Dispute Resolution",
    description: "Build your campus reputation through honest reviews. If something goes wrong, our support team mediates fairly — you're never left without recourse.",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
  }
];

export default function FeatureCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);


  // The currently active feature
  const currentFeature = featuresData[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4">
      {/* Main Carousel Container */}
      <div className="relative w-full h-[450px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
        
        {/* Background Image with smooth transition */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
          style={{ backgroundImage: `url(${currentFeature.imageUrl})` }}
        ></div>

        {/* Dark Gradient Overlay (Ensures text is readable over any image) */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>

        {/* Left Arrow */}
        <button 
          onClick={() => currentIndex === 0 ? setCurrentIndex(featuresData.length - 1) : setCurrentIndex(currentIndex - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full text-white transition-all duration-200 z-20 opacity-100 lg:opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
          aria-label="Previous feature"
        >
          <ChevronLeft size={28} />
        </button>

        {/* Right Arrow */}
        <button 
          onClick={() => currentIndex === featuresData.length - 1 ? setCurrentIndex(0) : setCurrentIndex(currentIndex + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full text-white transition-all duration-200 z-20 opacity-100 lg:opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
          aria-label="Next feature"
        >
          <ChevronRight size={28} />
        </button>

        {/* Text Content Area (Positioned at the bottom) */}
        <div className="absolute bottom-0 left-0 w-full p-8 sm:p-12 z-10">
          <div className="max-w-2xl">
            
            {/* Title */}
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
              {currentFeature.title}
            </h3>
            
            {/* Description */}
            <p className="text-gray-200 text-lg sm:text-xl leading-relaxed">
              {currentFeature.description}
            </p>
          </div>
        </div>

        {/* Optional: Dot Indicators at the very bottom */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {featuresData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex === index ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}