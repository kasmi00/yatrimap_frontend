import axios from "axios";
import { CheckSquare, Square } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AccommodationList = ({ onSelect, selectedAccommodation }) => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await axios.get(`/api/accommodation/destination/${id}`);
        setAccommodations(response.data);
      } catch (err) {
        setError("No accommodations available for this destination.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-full mx-auto p-4">
      {accommodations.length === 0 ? (
        <p>No accommodations available for this destination.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {accommodations.map((acc) => (
            <div key={acc._id} className="border p-4 rounded-lg shadow-lg flex">
              <img
                src={acc.image ? `http://localhost:3000/uploads/${acc.image}` : "https://via.placeholder.com/150"}
                alt={acc.title}
                className="w-1/4 h-40 object-cover rounded-lg"
              />
              <div className="w-3/4 ml-4 relative">
                <button
                  className="absolute top-2 right-2"
                  onClick={() => onSelect(acc._id)}
                >
                  {selectedAccommodation === acc._id ? <CheckSquare className="text-blue-500" /> : <Square />}
                </button>
                <h3 className="text-xl font-semibold">{acc.title}</h3>
                <p className="pr-6 text-gray-700 line-clamp-2">{acc.description}</p>
                <p className="pt-6 text-lg font-medium mt-2">Rs.{acc.price} per night</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccommodationList;
