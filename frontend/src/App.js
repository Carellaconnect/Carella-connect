import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import Footer from "./components/Footer";
import Home from "./pages/Home"; 
import axios from "axios";
import Login from "./pages/Login";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/")
      .then(response => setMessage(response.data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <Router>
        <div style={{ textAlign: "center", marginTop: "0px" }}> 
        <Routes>
        <Route path="/" element={<Home />} />  {/* Home Page */}
        <Route path="/login" element={<Login />} />  {/* login Page */}
        </Routes>
        <p>{message}</p>
        <Footer />
      </div>
    </Router>
    
  );
}

export default App;
