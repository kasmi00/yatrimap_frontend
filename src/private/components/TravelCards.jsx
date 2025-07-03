import axios from "axios";
import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TravelCards = ({ headline, destinations }) => {
  const [BucketList, setBucketlist] = useState([]);
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

  const gotoDestinationDetails = (id) => {
    navigate(`/destinationdetails/${id}`);
  };

  const toggleBucketList = async (destination) => {
    try {
      const isAlreadyInBucketList = BucketList.some(
        (item) => item._id === destination._id
      );

      if (isAlreadyInBucketList) {
        setBucketlist(
          BucketList.filter((item) => item._id !== destination._id)
        );
      } else {
        setBucketlist([...BucketList, destination]);
        await axios.post("http://localhost:3000/api/bucket-list/", destination);
      }
    } catch (error) {
      console.error("Failed to update bucketlist", error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full bg-white/5">
      <div className="flex items-center justify-center mb-12 w-full rounded-[20px]">
        {/* Pagination buttons */}
        <div className="flex items-center space-x-4">
          {startIndex > 0 && (
            <button
              onClick={handlePrev}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-black/3"
            >
              <img
                src="/src/images/left-chevron.png"
                alt="Previous"
                className="w-6 h-6"
              />
            </button>
          )}
          <div className="flex flex-wrap justify-between gap-8">
            {Array.isArray(destinations) && destinations.length > 0 ? (
              destinations.slice(startIndex, endIndex).map((destination) => (
                <div
                  key={destination._id}
                  className="relative w-[320px] h-[300px] rounded-[12px] overflow-hidden
                  shadow-md hover:transform hover:scale-105 hover:shadow-lg
                  transition-transform duration-300 cursor-pointer"
                >
                  <img
                    src={
                      "http://localhost:3000/destinations_image/" +
                        destination.image || "https://via.placeholder.com/150"
                    }
                    alt={destination.title}
                    className="w-full h-full object-cover"
                    onClick={() => gotoDestinationDetails(destination._id)}
                  />
                  {/* Favorite button */}
                  <FaHeart
                    className={`absolute top-4 right-4 cursor-pointer text-2xl ${
                      BucketList.some((item) => item._id === destination._id)
                        ? "text-red-600"
                        : "text-gray-700 hover:text-red-600"
                    }`}
                    onClick={() => toggleBucketList(destination)}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-black/40">
                    <h2 className="m-0 text-white text-lg">
                      {destination.title}
                    </h2>
                    {/* <p className="text-sm text-white truncate overflow-hidden text-ellipsis whitespace-nowrap">
                      {destination.description}
                    </p> */}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No destinations available.</p>
            )}
          </div>
          {endIndex < destinations.length && (
            <button
              onClick={handleNext}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-black/3"
            >
              <img
                src="/src/images/chevron.png"
                alt="Next"
                className="w-6 h-6"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelCards;
