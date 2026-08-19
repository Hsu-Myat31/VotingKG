import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import logo from "./img/logo1.png";
import "./About.css";

function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <header className="about-header">
        <div className="about-header-logo">
          <img src={logo} alt="University logo" />
        </div>

        <div className="about-header-title">
          <h3>FRESHERS&apos; WELCOME VOTING 2026</h3>
        </div>

        <button
          type="button"
          className="about-back-button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
        </button>
      </header>

      <main className="about-content">
        <section className="about-heading">
          <div className="about-script">Freshers&apos; Welcome</div>
          <h1>About Voting</h1>
          <p>
            A celebration of confidence, talent, friendship and university
            spirit.
          </p>
        </section>

        <section className="about-cards" aria-label="Voting information">
          <article className="about-card">
            <i className="fa-solid fa-star" aria-hidden="true"></i>
            <h2>Our Event</h2>
            <p>
              The Freshers&apos; Welcome Voting 2026 event gives students a fun
              way to support their favorite King and Queen candidates.
            </p>
          </article>

          <article className="about-card">
            <i className="fa-solid fa-check-double" aria-hidden="true"></i>
            <h2>Voting Rules</h2>
            <p>
              Choose one King candidate and one Queen candidate. You may update
              your selection before voting closes.
            </p>
          </article>

          <article className="about-card">
            <i className="fa-solid fa-envelope" aria-hidden="true"></i>
            <h2>Contact</h2>
            <p>
              For questions, contact the Freshers&apos; Welcome Committee or
              your student event coordinator.
            </p>
          </article>
        </section>

        <section className="about-thank-you">
          
          <h2>Thank You for Participating</h2>
          <p>Let your favorite candidates shine at Freshers&apos; Welcome 2026.</p>
        </section>
      </main>

      <Navbar />
    </div>
  );
}

export default About;