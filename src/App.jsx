import axios from "axios";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddAccommodation from "./admin/addAccommodation";
import AddDestination from "./admin/addDestination";
import UploadTourPackage from "./admin/addtourpackages";
import AdminBookingList from "./admin/bookinglist";
import EditDestination from "./admin/editdestination";
import EditTourPackage from "./admin/edittourpackages";
import AddGuide from "./admin/guide/addGuide";
import EditGuide from "./admin/guide/editguide";
import GuideList from "./admin/guide/guidelist";
import TourPackageView from "./admin/tourpackage_view";
import UserList from "./admin/userlist";
import "./App.css";
import BucketListScreen from "./private/components/bucket_listScreen";
import Booking from "./private/pages/bookingscreen";
import DestinationDetails from "./private/pages/destinationDetails";
import Destinations from "./private/pages/destinations";
import HomePage from "./private/pages/HomePage";
import BookingList from "./private/pages/userbookingList";
import LoginScreen from "./public/Login";
import SplashPage from "./public/publicHomeScreen";
import RegisterPage from "./public/Register";
import TourPackages from "./private/components/TourPackages";
import TourPackageDetails from "./private/pages/tourPackagesDetails";
import AdminDestinationList from "./admin/adminDestinationList";
import AdminDashboard from "./admin/Dashboard";
import ForgetPassword from "./private/Auth/forgetPassword";
import ResetPassword from "./private/Auth/resetPassword";
import TourPackageslist from "./private/pages/tourpackageslist";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route>
            <Route path="/home" element={<HomePage />} />
            <Route path="/" element={<SplashPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/bookingList" element={<BookingList />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/bucket-list" element={<BucketListScreen />} />
            <Route path="/destinationdetails/:id" element={<DestinationDetails />}/>
            <Route path="/tourpackages" element={<TourPackages />}/>
            <Route path="/tourpackagesdetails/:id" element={<TourPackageDetails />}/>
            <Route path="/forgotpassword" element={<ForgetPassword />} />
            <Route path="/resetpassword/:id" element={<ResetPassword />} />
            <Route path="/tourpackagelist" element={<TourPackageslist />} />
            //===========Admin Routes============//
            <Route path="/add" element={<AddDestination />} />
            <Route path="/addguide" element={<AddGuide />} />
            <Route path="/guide" element={<GuideList />} />
            <Route path="/admin" element={<AdminDashboard/>} />
            <Route path="/admindestinationlist" element={<AdminDestinationList />} />
            <Route path="/admintourpackages" element={<TourPackageView />} />
            <Route path="/userlist" element={<UserList />} />
            <Route path="/editguide" element={<EditGuide />} />
            <Route path="/uploadpackages" element={<UploadTourPackage />} />
            <Route path="/addAccommodation" element={<AddAccommodation />} />
            <Route path="/editDestination/:id" element={<EditDestination />} />
            <Route path="/editPackages/:id" element={<EditTourPackage />} />
            <Route path="/bookingAdmin" element={<AdminBookingList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
