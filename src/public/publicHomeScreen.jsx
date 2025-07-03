import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SplashPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); // State for carousel index
  const navigate = useNavigate();
  const currentimage = ["/src/images/image.png"];

  // Destinations data
  const destinations = [
    {
      id: 1,
      title: "ABC Basecamp Trek",
      image: "/src/images/pasupathi1.jpg"
    },
    {
      id: 2,
      title: "Langtang Valley Trek",
      image: "/src/images/slider4.png"
    },
    {
      id: 3,
      title: "Tsho Rolpa Lake",
      image: "/src/images/chitanNationalPark.png"
    },
    {
      id: 4,
      title: "Mustang Trek",
      image: "/src/images/Muktinath1.jpg"
    },
    {
      id: 5,
      title: "Trek to Mt. Everest",
      image: "/src/images/slider1.png"
    }
  ];

  // Featured properties data
  const Topdestination = [
    {
      id: 1,
      title: "Mt. Everest",
      image: "/src/images/slider1.png"
    },
    {
      id: 2,
      title: "Khumai Dada Trek",
      image: "/src/images/slider2.png"
    },
    {
      id: 3,
      title: "Mt.Kanchenjunga",
      image: "/src/images/Chitlang.png"
    },
    {
      id: 4,
      title: "Langtang Valley",
      image: "/src/images/slider4.png"
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const Logo = () => (
    <div className="flex items-start">
      <span
        className={`text-xl font-serif ${isScrolled ? "text-gray-600" : "text-gray-800"
          }`}
      >
        YatriMap
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-serif">
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-green-100 border-b border-gray-200" : "bg-gray-200"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-20">
            <Logo />
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/register")}
                className={`px-6 py-2 font-medium rounded-full ${isScrolled
                  ? "text-white-800 border border-blue-800 hover:bg-blue-500"
                  : "text-white-800 border border-green-600 hover:bg-green-400"
                  }`}
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate("/login")}
                className={`px-6 py-2 font-medium rounded-full ${isScrolled
                  ? "text-white-800 border border-blue-800 hover:bg-blue-500"
                  : "text-white-800 border border-green-600 hover:bg-green-400"
                  }`}
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative w-full h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${currentimage[0]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="container mx-auto px-4 py-12 relative z-10 h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
            <div className="space-y-6 text-white">
              <h1 className="text-4xl font-serif leading-tight">
                Travelers' Choice, Best of the Best
              </h1>
              <p className="text-lg font-serif mb-6">
                Among our top 1% of places, stays, and experiences—decided by
                you.
              </p>
              <button className="bg-black text-white px-6 py-2.5 rounded-lg hover:bg-blue-800 transition-colors">
                See the destinations
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Destinations Carousel */}
      <div className="pt-16">
        <div className="max-w-full mx-auto px-8 py-8">
          <div className="relative">
            <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
              {destinations.map((destination) => (
                <div key={destination.id} className="flex flex-col w-72">
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <img
                      src={destination.image}
                      alt={destination.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium">{destination.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ratings Section */}
      <div className="bg-green-100 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Rated "EXCELLENT" for a reason.</h2>
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-6 w-6 fill-current" />
            ))}
          </div>
          <p className="text-lg mb-8">
            We don't just list any destinaiton—we personally check to ensure your perfect trip.
          </p>
        </div>
      </div>

      {/* Peace of Mind Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Peace of mind guaranteed with every booking</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-14">
            {Topdestination.map((destination) => (
              <div key={destination.id} className="group cursor-pointer">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="mt-2 font-medium">{destination.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Expert Guides</h3>
              <p className="text-gray-600">
                Get personalized advice from certified travel experts, ensuring you have the best experience possible at each destination.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Seamless Booking</h3>
              <p className="text-gray-600">
                Book flights, accommodations, and activities in one place, with instant confirmation and 24/7 customer support.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Tailored Itineraries</h3>
              <p className="text-gray-600">
                Receive customized travel itineraries based on your interests, from relaxing beach vacations to adventurous treks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
