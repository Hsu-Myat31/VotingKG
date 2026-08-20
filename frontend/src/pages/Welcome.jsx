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
  /*
   * Check all form fields before allowing Vote Now
   * No useNavigate() required.
   */
  const handleVoteClick = (e) => {
    const form = document.getElementById("welcome-voting-form");

    if (!form.checkValidity()) {
      e.preventDefault();
      form.reportValidity();
    }
  };

  return (
    <main
      className="welcome-screen"
      style={{ "--welcome-background": `url(${backgroundImage})` }}
    >
      {/* Floating gold particles */}
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

        {/* Decorative corners */}
        <span className="welcome-corner welcome-corner-top-left" />
        <span className="welcome-corner welcome-corner-top-right" />
        <span className="welcome-corner welcome-corner-bottom-left" />
        <span className="welcome-corner welcome-corner-bottom-right" />

        {/* Logo */}
        <div className="welcome-logo-wrapper">
          <img
            src={logo}
            className="welcome-logo"
            alt="Mandalay Technological University logo"
          />
        </div>

        {/* University Name */}
        <p className="welcome-university-name">
          MANDALAY TECHNOLOGICAL UNIVERSITY
        </p>

        {/* Title */}
        <h1 className="welcome-main-title">
          FRESHERS&apos;
        </h1>

        <h2 className="welcome-subtitle">
          Welcome Voting
        </h2>

        {/* Year */}
        <p className="welcome-year">
          MMXXVI • 2026
        </p>

        {/* Tagline */}
        <p className="welcome-tagline">
          Your Vote • Your Voice • Your Legacy
        </p>

        {/* ================= FORM ================= */}
        <form
          id="welcome-voting-form"
          className="welcome-form"
        >

          {/* Username */}
          <div className="welcome-form-group">
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              autoComplete="username"
              required
            />
          </div>

          {/* Major */}
          <div className="welcome-form-group">
            <label htmlFor="major">
              Major
            </label>

            <input
              id="major"
              name="major"
              type="text"
              placeholder="Enter your major"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="welcome-form-group">
            <label htmlFor="phoneNumber">
              PhoneNumber
            </label>

            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="Enter your phone number"
              autoComplete="tel"
              required
            />
          </div>

         

        </form>

        <Link
  to="/"
  className="welcome-vote-button"
  onClick={(e) => {
    const form = document.getElementById("welcome-voting-form");

    if (!form.checkValidity()) {
      e.preventDefault();
      form.reportValidity();
    }
  }}
>
  Vote Now
</Link>

        {/* Quote */}
        <p className="welcome-quote">
          &quot;Every Vote Celebrates Excellence.&quot;
        </p>

      </section>
    </main>
  );
}

export default Welcome;