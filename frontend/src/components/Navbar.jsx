import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();

  // Dynamically set the active state based on the current route
  const isActive = (path) =>
    location.pathname === path ? "active" : "";

  return (
    <nav className="navbar">
      <Link to="/" className={`nav-item ${isActive("/")}`}>
        <i className="fa-solid fa-house"></i>
        <span>Home</span>
      </Link>

      <Link to="/Boy" className={`nav-item ${isActive("/boy")}`}>
        <i className="fa-solid fa-user"></i>
        <span>Boy</span>
      </Link>

      <Link to="/Girl" className={`nav-item ${isActive("/girl")}`}>
        <i className="fa-solid fa-user"></i>
        <span>Girl</span>
      </Link>

      <Link
        to="/Result"
        className={`nav-item ${isActive("/result")}`}
      >
        <i className="fa-solid fa-chart-simple"></i>
        <span>Result</span>
      </Link>

      <Link
        to="/About"
        className={`nav-item ${isActive("/about")}`}
      >
        <i className="fa-solid fa-circle-info"></i>
        <span>About</span>
      </Link>
    </nav>
  );
}

export default Navbar;