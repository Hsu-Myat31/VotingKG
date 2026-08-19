
import { Link } from "react-router-dom";
import "./Welcome.css";

import logo from "./img/logo.png";
import backgroundImage from "./img/images.jpg";

const particles = Array.from({ length: 70 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  duration: `${4 + ((index * 17) % 7)}s`,
  delay: `${((index * 13) % 50) / 10}s`,
  opacity: 0.25 + ((index * 29) % 70) / 100,
  size: `${3 + ((index * 11) % 4)}px`,
}));

function Welcome() {
  

  return (
    <main
      className="welcome-screen"
      style={{ "--welcome-background": `url(${backgroundImage})` }}
    >
      <div className="welcome-particles" aria-hidden="true">
        {particles.map((particle) => (
          <span
            className="welcome-particle"
            key={particle.id}
            style={{
              left: particle.left,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              animationDuration: particle.duration,
              animationDelay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="welcome-overlay" aria-hidden="true" />

      <section className="welcome-card">
        <span className="welcome-corner welcome-corner-top-left" />
        <span className="welcome-corner welcome-corner-top-right" />
        <span className="welcome-corner welcome-corner-bottom-left" />
        <span className="welcome-corner welcome-corner-bottom-right" />

        <div className="welcome-logo-wrapper">
          <img
            src={logo}
            className="welcome-logo"
            alt="Mandalay Technological University logo"
          />
        </div>

        <p className="welcome-university-name">
          MANDALAY TECHNOLOGICAL UNIVERSITY
        </p>

        <h1 className="welcome-main-title">FRESHERS&apos;</h1>
        <h2 className="welcome-subtitle">Welcome Voting</h2>

        <p className="welcome-year">MMXXVI • 2026</p>

        <p className="welcome-tagline">
          Your Vote • Your Voice • Your Legacy
        </p>

        <button>
          <Link to="/" className="welcome-vote-button">
            Vote Now
          </Link>
        </button>

        <p className="welcome-quote">
          &quot;Every Vote Celebrates Excellence.&quot;
        </p>
      </section>
    </main>
  );
}

export default Welcome;