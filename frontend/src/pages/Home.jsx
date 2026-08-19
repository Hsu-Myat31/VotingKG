
import { Link } from "react-router-dom";
import "./Home.css";
import { useNavigate } from "react-router-dom";


// Importing images from pages/img/
import logo1 from "./img/logo1.png";
import king from "./img/king.png";
import queen from "./img/queen.png";

function Home() {
    const navigate = useNavigate();
    
    return (
        <div className="app-container">
            <header className="header">
                <div className="header-logo">
                    <img src={logo1} className="logo" alt="University logo" />
                </div>
                <div className="header-title">
                    <h3>FRESHERS' WELCOME VOTING 2026</h3>
                </div>
                 <button
                    type="button"
                    className="home-back-button"
                    onClick={() => navigate("/welcome")}
                    aria-label="Back to welcome page"
                >
                    <svg
                        className="home-back-icon"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path d="M15 18 9 12l6-6" />
                    </svg>
                </button>
            </header>

            <main className="page-content home-page">
                <section className="hero-section">
                    <div className="hero-card">
                        <div className="crown">
                            <i className="fa-solid fa-crown"></i>
                        </div>
                        <div className="welcome-script">Welcome to</div>
                        <div className="main-title">FRESHERS' WELCOME</div>
                    </div>
                </section>

                <section className="tagline-section">
                    <div className="tagline-cursive">Vote for Your Favorites</div>
                    <div className="voting-text">
                        Cast Your Vote
                        <br />
                        2026
                    </div>
                    <p className="description-cursive">
                        Choose your favorite candidate for King &amp; Queen.
                        <br />
                        Every vote matters to make them shine in the university's welcome event.
                    </p>
                </section>

                <section className="cards-container">
                    <Link to="/boy" className="category-card">
                        <img src={king} className="logo-kq" alt="Vote for King" />
                        <span>Vote for Your Choice</span>
                    </Link>
                    <Link to="/girl" className="category-card">
                        <img src={queen} className="logo-kq" alt="Vote for Queen" />
                        <span>Vote for Your Choice</span>
                    </Link>
                </section>
            </main>

            <nav className="navbar">
                <Link to="/" className="nav-item active">
                    <i className="fa-solid fa-house"></i>
                    <span>Home</span>
                </Link>
                <Link to="/boy" className="nav-item">
                    <i className="fa-solid fa-user"></i>
                    <span>Boy</span>
                </Link>
                <Link to="/girl" className="nav-item">
                    <i className="fa-solid fa-user"></i>
                    <span>Girl</span>
                </Link>
                <Link to="/result" className="nav-item">
                    <i className="fa-solid fa-chart-simple"></i>
                    <span>Result</span>
                </Link>
                <Link to="/about" className="nav-item">
                    <i className="fa-solid fa-circle-info"></i>
                    <span>About</span>
                </Link>
            </nav>
        </div>
    );
}

export default Home;