import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RelatedContent {
  image: string;
  title: string;
  url: string;
}

interface HorizontalScrollableCardsProps {
  content: RelatedContent[];
  isDarkMode?: boolean;
}

export const HorizontalScrollableCards = ({
  content,
  isDarkMode = false,
}: HorizontalScrollableCardsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  if (content.length === 0) return null;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -280, // Card width + gap
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 280, // Card width + gap
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const handleCardClick = (url: string) => {
    window.open(url, "_blank", "noopener noreferrer");
  };

  return (
    <div className="mt-6 relative">
      <div className="relative px-2">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl backdrop-blur-lg border border-white/20"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            }}
          >
            <ChevronLeft size={18} className="text-white" />
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl backdrop-blur-lg border border-white/20"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            }}
          >
            <ChevronRight size={18} className="text-white" />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-12"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          } as React.CSSProperties}
        >
          {content.map((item, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(item.url)}
              className={`flex-shrink-0 w-72 cursor-pointer group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                isDarkMode
                  ? "bg-gray-800 border-gray-600 hover:border-blue-500"
                  : "bg-white border-gray-200 hover:border-blue-300"
              } border rounded-xl overflow-hidden shadow-lg hover:shadow-blue-200/50`}
            >
              {/* Image */}
              <div className="relative w-full h-44 overflow-hidden">
                <img
                  src={
                    item.image ||
                    "https://hutechsolutions.com/wp-content/uploads/2024/08/hutech-logo-1.svg"
                  }
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  style={{ borderRadius: "12px 12px 0 0" }}
                />
                {/* Modern overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300" />
                {/* Hover indicator */}
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <div className="p-5">
                <h3
                  className={`font-semibold text-sm leading-snug group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {item.title}
                </h3>
                {/* Modern indicator line */}
                <div className="mt-3 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
