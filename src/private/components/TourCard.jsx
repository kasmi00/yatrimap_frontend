import React, { useState } from "react";
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const TourCards = ({ headline, destinations }) => {
  const [startIndex, setStartIndex] = useState(0);
  const navigate = useNavigate();
  const itemsPerPage = 4;
  const endIndex = startIndex + itemsPerPage;

  const handlePrev = () => {
    setStartIndex(Math.max(startIndex - itemsPerPage, 0));
  };

  const handleNext = () => {
    setStartIndex(
      Math.min(startIndex + itemsPerPage, destinations.length - itemsPerPage)
    );
  };

  const gotoTourPackagesDetails = (id) => {
    navigate(`/tourpackagesdetails/${id}`);
  };

  return (
    <div className="w-full py-4 bg-gradient-to-b from-white to-gray-50">
      <div className="pl-8 max-w-full mx-auto px-4">
        <div className="relative">
          {startIndex > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 z-10 transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
            {Array.isArray(destinations) && destinations.length > 0 ? (
              destinations.slice(startIndex, endIndex).map((destination) => (
                <div
                  key={destination._id}
                  className=" relative w-[320px] h-[300px] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  onClick={() => gotoTourPackagesDetails(destination._id)}
                >
                  <div className="aspect-w-4 aspect-h-2 w-full h-full">
                    <img
                      src={
                        "http://localhost:3000/destinations_image/" +
                        destination.image || "https://via.placeholder.com/150"
                      }
                      alt={destination.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-black/40">
                    <h2 className="m-0 text-white text-lg">
                      {destination.title}
                    </h2>
                    <p className="text-sm text-white fon-bold truncate overflow-hidden text-ellipsis whitespace-nowrap">
                      $ {destination.price}
                    </p>
                  </div>
                  </div>
                  
                  {/* Duration badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-white rounded-full px-3 py-1 shadow-md flex items-center">
                      <Clock className="w-4 h-4 text-red-600 mr-1" />
                      <span className="text-sm font-medium">{destination.duration}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-8">
                <p className="text-gray-500 text-lg">No destinations available.</p>
              </div>
            )}
          </div>

          {endIndex < destinations.length && (
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 z-10 transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourCards;