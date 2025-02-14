import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
// import Header from "./components/Header";
// import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./Home"; 
import Login from './Login'; // Import Login component
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/")
      .then(response => setMessage(response.data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <Router> { }
      <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Routes>
          <Route path="/" element={<Home />} />  {/* Home Page */}
          <Route path="/Login" element={<Login />} /> {/* Login page route */}
        </Routes>
        <p>{message}</p>
        
      </div>
    </Router>
  );
}

export default App;
