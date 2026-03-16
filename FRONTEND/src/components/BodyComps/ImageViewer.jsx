import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageViewer({ images, initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Keyboard navigation (Esc to close, Arrows to navigate)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Run once on mount

  const handleNext = (e) => {
    if (e) e.stopPropagation(); // Prevent closing when clicking the button
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  if (!images || images.length === 0) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 sm:p-8"
      onClick={onClose} // Clicking the dark background closes the viewer
    >
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
      >
        <X size={28} />
      </button>

      {/* Main Image Container */}
      <div 
        className="relative w-full max-w-6xl h-full max-h-[85vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()} // Prevent clicking the image itself from closing the modal
      >
        {/* object-contain is the magic class here. It prevents cropping! */}
        <img 
          src={images[currentIndex]} 
          alt={`Full resolution view ${currentIndex + 1}`} 
          className="max-w-full max-h-full object-contain rounded-md select-none drop-shadow-2xl"
        />

        {/* Navigation Controls (Only if > 1 image) */}
        {images.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute left-0 sm:-left-12 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all"
            >
              <ChevronLeft size={32} />
            </button>

            <button 
              onClick={handleNext}
              className="absolute right-0 sm:-right-12 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all"
            >
              <ChevronRight size={32} />
            </button>

            {/* Counter */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white/60 font-medium tracking-widest text-sm bg-black/40 px-4 py-1.5 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}