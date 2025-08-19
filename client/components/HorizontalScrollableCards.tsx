import { useState } from "react";
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
  const [currentPage, setCurrentPage] = useState(0);
  
  if (content.length === 0) return null;

  // Calculate how many cards can fit per page (responsive)
  const getCardsPerPage = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width >= 1200) return 4; // Large screens
      if (width >= 900) return 3;  // Medium screens
      if (width >= 600) return 2;  // Small screens
      return 1; // Mobile
    }
    return 3; // Default fallback
  };

  const cardsPerPage = getCardsPerPage();
  const totalPages = Math.ceil(content.length / cardsPerPage);
  const startIndex = currentPage * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentCards = content.slice(startIndex, endIndex);

  const goToPrevious = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const handleCardClick = (url: string) => {
    window.open(url, "_blank", "noopener noreferrer");
  };

  return (
    <div className="mt-6 relative">
      <div className="relative">
        {/* Left Arrow - only show if more than one page */}
        {totalPages > 1 && (
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl backdrop-blur-lg border border-white/20"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            }}
          >
            <ChevronLeft size={18} className="text-white" />
          </button>
        )}

        {/* Right Arrow - only show if more than one page */}
        {totalPages > 1 && (
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl backdrop-blur-lg border border-white/20"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            }}
          >
            <ChevronRight size={18} className="text-white" />
          </button>
        )}

        {/* Grid Container */}
        <div className={`${totalPages > 1 ? 'px-12' : 'px-2'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentCards.map((item, index) => (
              <div
                key={startIndex + index}
                onClick={() => handleCardClick(item.url)}
                className={`cursor-pointer group transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
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

        {/* Page Indicators - only show if more than one page */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentPage
                    ? "bg-blue-500 w-6"
                    : isDarkMode
                    ? "bg-gray-600 hover:bg-gray-500"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
