import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import "./Girl.css";

// Put these images in the same img folder as this JSX file.
import logo from "./img/logo1.png";
import kaungImage from "./img/queen.png";
import zinImage from "./img/queen.png";
import ethanImage from "./img/queen.png";

const STORAGE_KEY = "univote_candidate_titles_2026";

const candidates = [
  {
    id: "kaung-thit-htun",
    name: "Hsu Thitsar Han",
    number: "01",
    age: "19",
    major: "CEIT",
    city: "Mandalay",
    image: kaungImage,
  },
  {
    id: "zin-lin-htet",
    name: "Sandar Htun",
    number: "02",
    age: "21",
    major: "Architecture",
    city: "Yangon",
    image: zinImage,
  },
  {
    id: "ethan-cole",
    name: "Ethan Cole",
    number: "03",
    age: "20",
    major: "Civil",
    city: "Taunggyi",
    image: ethanImage,
  },
];

const categories = ["queen", "style", "popular"];

function readSavedVotes() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && typeof saved === "object"
      ? saved
      : { boys: {}, girls: {} };
  } catch {
    return { boys: {}, girls: {} };
  }
}

function Icon({ name }) {
  const paths = {
    home: <path d="M3 11.5 12 4l9 7.5V21h-6v-6H9v6H3z" />,
    person: <><circle cx="12" cy="7" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7h.01" /></>,
    back: <path d="m15 18-6-6 6-6" />,
  };

  return (
    <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function Sparkles({ burst }) {
  if (!burst) return null;

  const symbols = ["✦", "✧", "⋆", "✶"];

  return (
    <span className="sparkle-layer" aria-hidden="true">
      {Array.from({ length: 10 }, (_, index) => {
        const angle = (Math.PI * 2 * index) / 10;
        const distance = 34 + (index % 3) * 8;
        const style = {
          "--x": `${Math.cos(angle) * distance}px`,
          "--y": `${Math.sin(angle) * distance}px`,
          "--r": `${index * 23 - 55}deg`,
          animationDelay: `${(index % 4) * 18}ms`,
        };

        return (
          <span className="vote-sparkle" style={style} key={index}>
            {symbols[index % symbols.length]}
          </span>
        );
      })}
    </span>
  );
}

function Girl() {
  const navigate = useNavigate();
  const [selections, setSelections] = useState(() => readSavedVotes().boys || {});
  const [activeSparkle, setActiveSparkle] = useState({ key: "", id: 0 });
  const sparkleTimer = useRef(null);
  const sparkleCounter = useRef(0);

  useEffect(() => () => window.clearTimeout(sparkleTimer.current), []);

  const selectCategory = (candidateId, category) => {
    const allVotes = readSavedVotes();
    const currentBoys = { ...(allVotes.boys || {}) };

    // If clicking the title they already have, unselect it (toggle off)
    if (currentBoys[candidateId] === category) {
      delete currentBoys[candidateId];
    } else {
      // 1. Remove this selected category (e.g. "king") from ANY other person who currently has it
      Object.keys(currentBoys).forEach((id) => {
        if (currentBoys[id] === category) {
          delete currentBoys[id];
        }
      });

      // 2. Assign the category to the newly selected candidate
      currentBoys[candidateId] = category;
    }

    const updatedVotes = { ...allVotes, boys: currentBoys, girls: allVotes.girls || {} };

    // Save to LocalStorage and update state
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedVotes));
    setSelections(currentBoys);
  };
  const showSparkles = (candidateId, category) => {
    sparkleCounter.current += 1;

    setActiveSparkle({
      key: candidateId + "-" + category,
      id: sparkleCounter.current,
    });

    window.clearTimeout(sparkleTimer.current);
    sparkleTimer.current = window.setTimeout(() => {
      setActiveSparkle({ key: "", id: sparkleCounter.current });
    }, 850);
  };

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-logo">
          <img src={logo} className="logo" alt="University logo" />
        </div>

        <div className="header-title">
          <h3>FRESHERS&apos; WELCOME VOTING 2026</h3>
        </div>

        <button className="header-back" type="button" aria-label="Go back" onClick={goBack}>
          <Icon name="back" />
        </button>
      </header>

      <main className="page-content">
        <section className="page-heading">
          <h1>Boy Candidates</h1>
          <p>For each competitor, choose only one category: Queen, Style or Popular.</p>
        </section>

        <section className="candidates-grid">
          {candidates.map((candidate) => (
            <article className="candidate-card" key={candidate.id}>
              <div className="candidate-image-box">
                <img src={candidate.image} alt={candidate.name} className="candidate-image" />
              </div>

              <h2 className="candidate-name">{candidate.name}</h2>

              <div className="candidate-info-grid">
                <div className="candidate-info-box"><span>No.</span><strong>{candidate.number}</strong></div>
                <div className="candidate-info-box"><span>Age</span><strong>{candidate.age}</strong></div>
                <div className="candidate-info-box"><span>Major</span><strong>{candidate.major}</strong></div>
                <div className="candidate-info-box"><span>City</span><strong>{candidate.city}</strong></div>
              </div>

              <div className="category-vote-group" role="radiogroup" aria-label={`Choose one category for ${candidate.name}`}>
                {categories.map((category) => {
                  const sparkleKey = candidate.id + "-" + category;
                  const isSparkling = activeSparkle.key === sparkleKey;
                  const isSelected = selections[candidate.id] === category;

                  return (
                    <button
                      type="button"
                      className={`category-tile ${isSelected ? "selected" : ""} ${
                        isSparkling ? "twinkle-pop" : ""
                      }`}
                      key={category}
                      aria-pressed={isSelected}
                      onClick={() => {
                        selectCategory(candidate.id, category);
                        showSparkles(candidate.id, category);
                      }}
                    >
                      {category}
                      {isSparkling && (
                        <Sparkles key={activeSparkle.id} burst={true} />
                      )}
                    </button>
                  );
                })}
              </div>
            </article>
          ))}
        </section>
      </main>

      <Navbar />
    
    </div>
  );
}
export default Girl;