import { BrowserRouter, Routes, Route,useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";


import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Welcome from "./pages/Welcome";
import Boy from "./pages/Boy";
import Girl from "./pages/Girl";
import About from "./pages/About";



function AppContent() {
    const location = useLocation();

  // Welcome page "/" မှာပဲ Navbar ကိုဖျောက်မယ်
  const showNavbar = location.pathname !== "/welcome";
    return (
        <>

           

            <Routes>
                

                <Route path="/" element={<Home />} />
                <Route path="/boy" element={<Boy />} />
                <Route path="/girl" element={<Girl />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/welcome" element={<Welcome />} />

            </Routes>

           {showNavbar && <Navbar />} 

        </>
    );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;