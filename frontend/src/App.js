import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import Footer from "./components/Footer";
import Navigation from './pages/Navigation';
import Home from "./pages/Home"; 
import axios from "axios";
import Login from "./pages/Login";
import Admin from './pages/Admin';
import Doctor from "./pages/Doctor";
import Patient from "./pages/Patient";
import Register from "./pages/Register";
import AppointmentAvailability from "./pages/AppointmentAvailability";
import UpdateAppointment from "./pages/UpdateAppointment";
import BookAppointment from "./pages/BookAppointment";
import VirtualHealthResources from "./pages/VirtualHealthResources";
import ProfilePage from "./pages/Profile";
import HealthSupportPage from "./pages/HealthAndSupport";




function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/")
      .then(response => setMessage(response.data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <Router>
        <div style={{ textAlign: "center", margin: "0px", padding:"0px"}}> 
        <Routes>
        <Route path="/" element={<Home />} />  {/* Home Page */}
        <Route path="/home" element={<Home />} />  {/* Home Page */}
        <Route path="/login" element={<Login />} />  {/* login Page */}
        <Route path="/register" element={<Register />} />  {/* registration Page */}
        <Route path="/admin-dashboard" element={<Admin />} />
        <Route path="/doctor-dashboard" element={<Doctor />} />
        <Route path="/patient-dashboard" element={<Patient />} />
        <Route path="/appointment-availability" element={<AppointmentAvailability />} />
        <Route path="/update-appointment" element={<UpdateAppointment />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/virtual-health-resources" element={<VirtualHealthResources/>}  />
        <Route path="/profile-page" element={<ProfilePage/>}  />
        <Route path="/health-and-support" element={<HealthSupportPage/>}/>
        </Routes>
        
        <Footer />
      </div>
    </Router>
    
  );
}

export default App;
