import { useState, useEffect } from "react";
import { Star } from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Testimonial() {
  const [testimonials, setTestimonials] = useState([]);
  async function fetchTestimonials() {
    try {
      const res = await fetch(`${API_BASE_URL}/testimonials`, {
        method: "GET",
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setTestimonials(data.data);
      } else {
        console.error("Data testimonials tidak sesuai format:", data);
      }
    } catch (error) {
      console.error("Gagal memuat testimonials:", error);
    }
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide);

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [totalSlides]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  console.log("testimonials", testimonials);
  return (
    // <div className="py-16 px-4 bg-gradient-to-b from-white to-blue-50 bg-opacity-50">
    <div className="py-16 px-4 bg-blue-50">
      <div className="p-10 md:p-12 w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-pulse">
            <Star className="w-4 h-4" />
            <span>Testimoni</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black mb-4">
            Mereka Udah Buktiin Sendiri
          </h2>
          <p className="text-gray-600 text-base max-w-2xl mx-auto">
            Kualitas bukan cuma janji. Ini pengalaman nyata dari mereka yang
            udah coba layanan kami.
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => {
                const slideStart = slideIndex * itemsPerSlide;
                const slideEnd = slideStart + itemsPerSlide;
                const slideTestimonials = testimonials.slice(
                  slideStart,
                  slideEnd
                );

                return (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid md:grid-cols-3 gap-3 p-2">
                      {slideTestimonials.map((testimonials) => (
                        <div
                          key={testimonials._id}
                          className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                        >
                          {/* Quote */}
                          <div className="mb-6">
                            <p className="text-gray-700 leading-relaxed text-sm">
                              {`"${testimonials.review}"`}
                            </p>
                          </div>

                          {/* Author Info */}
                          <div className="flex items-center">
                            <div
                              className={`w-10 h-10 rounded-full bg-[#74c1ff] text-[#005fad]  flex items-center justify-center font-semibold text-sm mr-3 flex-shrink-0`}
                            >
                              {testimonials.userId.name
                                .split(" ")
                                .map((word) => word.charAt(0).toUpperCase())
                                .join("")}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-sm">
                                {testimonials.userId.name}
                              </h4>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-10"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-10"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center items-center space-x-3 mt-8">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-200 ${
                index === currentIndex
                  ? "w-8 h-3 bg-blue-600 rounded-full"
                  : "w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-6 max-w-md mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-blue-600 h-1 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
