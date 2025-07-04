import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { useEffect, useState } from "react";

const CategoryBar = ({ onCategorySelect }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);
  const [categoryDestinations, setCategoryDestinations] = useState({});
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const categories = [
    { name: "Trekking", icon: "🥾" },
    { name: "HimalayanTreks", icon: "🏔️" },
    { name: "Lake and River", icon: "🌊" },
    { name: "Nature", icon: "🌿" },
    { name: "Camping", icon: "⛺" },
    { name: "Mountain Climbing", icon: "🧗‍♂️" },
    { name: "Spiritual", icon: "🙏" },
    { name: "Adventure Sports", icon: "🏄" }
  ];

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch destination data
  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/destination");
      const data = await response.json();

      const destinationsMap = categories.reduce((acc, category) => {
        acc[category.name] = 0;
        return acc;
      }, {});

      data.forEach(item => {
        if (destinationsMap[item.category] !== undefined) {
          destinationsMap[item.category]++;
        }
      });

      setCategoryDestinations(destinationsMap);

      const firstAvailableCategory = categories.find(cat => destinationsMap[cat.name] > 0)?.name || categories[0].name;
      setSelectedCategory(firstAvailableCategory);
      onCategorySelect(firstAvailableCategory);
    } catch (err) {
      setError("Failed to load destinations");
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (categoryDestinations[category] === 0) {
      onCategorySelect(null, "No destinations available in this category");
    } else {
      onCategorySelect(category);
    }
  };

  const handleNext = () => {
    const itemsPerPage = isMobile ? 3 : 6;
    if (visibleIndex + itemsPerPage < categories.length) {
      setVisibleIndex(visibleIndex + 1);
    }
  };

  const handlePrev = () => {
    if (visibleIndex > 0) {
      setVisibleIndex(visibleIndex - 1);
    }
  };

  const itemsPerPage = isMobile ? 3 : 6;
  const visibleCategories = categories.slice(visibleIndex, visibleIndex + itemsPerPage);

  if (error) {
    return (
      <div className="w-full p-4 bg-red-50 rounded-lg">
        <p className="text-red-500 text-center font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-gray-100 pt-6 pb-6 rounded-xl shadow-sm">
      <div className="max-w-full mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Tag className="mr-2 h-5 w-5 text-blue-600" />
            Explore Categories
          </h3>

          {/* Navigation Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={handlePrev}
              disabled={visibleIndex === 0}
              className={`h-8 w-8 flex items-center justify-center rounded-full 
                ${visibleIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white shadow-md hover:bg-blue-50 text-blue-600'}`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={visibleIndex + itemsPerPage >= categories.length}
              className={`h-8 w-8 flex items-center justify-center rounded-full 
                ${visibleIndex + itemsPerPage >= categories.length
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white shadow-md hover:bg-blue-50 text-blue-600'}`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Category Grid */}
        <div className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-6'} gap-3`}>
          {visibleCategories.map(({ name, icon }) => {
            const count = categoryDestinations[name] || 0;
            const isSelected = selectedCategory === name;

            return (
              <button
                key={name}
                onClick={() => handleCategoryClick(name)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300
                  ${isSelected
                    ? 'bg-blue-300 text-black shadow-lg transform scale-105'
                    : 'bg-white hover:bg-blue-50 hover:shadow hover:scale-105'}`}
              >
                <span className="text-2xl mb-1">{icon}</span>
                <span className="text-xs font-medium text-center line-clamp-1">{name}</span>

                {count > 0 && (
                  <span
                    className={`text-xs mt-1 px-2 py-1 rounded-full ${isSelected
                        ? 'bg-white text-blue-600'
                        : 'bg-blue-100 text-blue-800'
                      }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
