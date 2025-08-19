import { Plus, Sparkles } from "lucide-react";

interface RecommendationsProps {
  recommendations: string[];
  onSelect: (question: string) => void;
  isDarkMode?: boolean;
}

export const Recommendations = ({
  recommendations,
  onSelect,
  isDarkMode = false,
}: RecommendationsProps) => {
  if (recommendations.length === 0) return null;

  return (
    <div className="mt-4">
      {/* Modern header */}
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} className="text-blue-500" />
        <h4
          className={`text-sm font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
        >
          Suggested Questions
        </h4>
      </div>

      <div
        className={`${isDarkMode ? "bg-gray-800/50 border-gray-600/50" : "bg-white/80 border-gray-200/50"} border rounded-xl shadow-lg backdrop-blur-sm overflow-hidden`}
      >
        {recommendations.map((recommendation, index) => (
          <button
            key={index}
            onClick={() => onSelect(recommendation)}
            className={`group w-full flex items-center justify-between px-5 py-4 text-left transition-all duration-300 hover:scale-[1.01] ${
              isDarkMode
                ? "hover:bg-gradient-to-r hover:from-blue-900/20 hover:to-purple-900/20 text-gray-100 hover:text-white"
                : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-gray-800 hover:text-blue-700"
            } ${index !== recommendations.length - 1 ? "border-b border-gray-200/30 dark:border-gray-600/30" : ""}`}
          >
            <span className="text-sm flex-1 pr-3 font-medium">
              {recommendation}
            </span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                <Plus size={14} className="text-white" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
