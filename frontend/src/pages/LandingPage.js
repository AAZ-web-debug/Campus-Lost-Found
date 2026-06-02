import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./landing.css";

function LandingPage() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    reported: 0,
    available: 0,
    returned: 0,
  });

  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentItems();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecentItems = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/public-items"
      );

      const data = await res.json();

      setRecentItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  const faqs = [
    {
      question: "How do I report a found item?",
      answer:
        "Go to Finder Mode, upload an image, and enter the location where you found the item."
    },
    {
      question: "Do I need an account?",
      answer:
        "Yes. Authentication helps track uploads and prevents misuse of the platform."
    },
    {
      question: "How can I recover my lost item?",
      answer:
        "Browse available found items and identify belongings that match your lost item."
    },
    {
      question: "Is the platform secure?",
      answer:
        "Yes. The system uses JWT authentication and protected user actions."
    }
  ];

  return (
    <div className="landing">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logo">
          🛡️ Campus Lost & Found
        </div>

        <div className="nav-links">

          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            Home
          </button>

          <button
            onClick={() =>
              document
                .querySelector(".features-section")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            Features
          </button>

          <button
            onClick={() =>
              document
                .querySelector(".faq-section")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            FAQ
          </button>

          <button
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="signup-btn"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </button>

        </div>

      </nav>

      {/* HERO */}

      <section className="hero">

        <div className="hero-left">

          <div className="hero-badge">
            Trusted Campus Recovery Platform
          </div>

          <h1>
            Campus Lost & Found
          </h1>

          <h2>
            Helping Students Recover What They've Lost.
          </h2>

          <p>
            Report found items, browse lost belongings,
            and reconnect owners with their valuables
            across campus.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => navigate("/loser")}
            >
              Browse Found Items
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>

          </div>

        </div>

        <div className="hero-right">

          <div className="floating-card card1">
            📱 Electronics
            <span>Recently Reported</span>
          </div>

          <div className="floating-card card2">
            🔑 Keys
            <span>Campus Wide</span>
          </div>

          <div className="floating-card card3">
            🪪 ID Cards
            <span>Student Recovery</span>
          </div>

          <div className="floating-card card4">
            🎒 Bags
            <span>Lost & Found</span>
          </div>

        </div>

      </section>

      {/* STATS */}

      <section className="stats-section">

        <div className="stat-card">
          <h3>{stats.reported}</h3>
          <p>Items Reported</p>
        </div>

        <div className="stat-card">
          <h3>{stats.available}</h3>
          <p>Available</p>
        </div>

        <div className="stat-card">
          <h3>{stats.returned}</h3>
          <p>Returned</p>
        </div>

      </section>

      {/* HOW IT WORKS */}

      <section className="how-section">

        <h2>How It Works</h2>

        <div className="steps">

          <div className="step-card">
            <span>🔍</span>
            <h3>Find Item</h3>
          </div>

          <div className="step-card">
            <span>📸</span>
            <h3>Upload Details</h3>
          </div>

          <div className="step-card">
            <span>🪪</span>
            <h3>Verify Owner</h3>
          </div>

          <div className="step-card">
            <span>🎉</span>
            <h3>Item Returned</h3>
          </div>

        </div>

      </section>

      {/* RECENT ITEMS */}

      <section className="recent-section">

        <h2>Recently Found Items</h2>

        <div className="recent-grid">

          {recentItems.length === 0 ? (

            <div className="recent-card">
              <h3>No Items Yet</h3>
              <p>
                Upload your first found item
              </p>
            </div>

          ) : (

            recentItems.map((item) => (

              <div
                className="recent-card"
                key={item.id}
              >

                <img
                  src={`http://localhost:5000${item.image_path}`}
                  alt="found item"
                  className="recent-item-image"
                />

                <h3>Found Item</h3>

                <p>
                  📍 {item.address}
                </p>

                <small>
                  {new Date(
                    item.created_at
                  ).toLocaleDateString()}
                </small>

              </div>

            ))

          )}

        </div>

      </section>

      {/* FEATURES */}

      <section className="features-section">

        <h2>
          Why Use Campus Lost & Found?
        </h2>

        <div className="features-grid">

          <div className="feature-card">
            <h3>📸 Upload Found Items</h3>
            <p>
              Quickly upload images and
              locations of found belongings.
            </p>
          </div>

          <div className="feature-card">
            <h3>🔍 Search Lost Items</h3>
            <p>
              Browse recently uploaded items
              and recover belongings faster.
            </p>
          </div>

          <div className="feature-card">
            <h3>🔒 Secure Authentication</h3>
            <p>
              JWT-protected user accounts
              and activity tracking.
            </p>
          </div>

        </div>

      </section>

      {/* FAQ */}

      <section className="faq-section">

        <h2>
          Frequently Asked Questions
        </h2>

        {faqs.map((faq, index) => (

          <div
            className="faq-card"
            key={index}
          >

            <h3>
              {faq.question}
            </h3>

            <p>
              {faq.answer}
            </p>

          </div>

        ))}

      </section>

      {/* CTA */}

      <section className="cta-section">

        <h2>
          Lost Something?
        </h2>

        <p>
          Start searching now and reconnect
          with your belongings.
        </p>

        <button
          className="primary-btn"
          onClick={() => navigate("/loser")}
        >
          Browse Items
        </button>

      </section>

      {/* FOOTER */}

      <footer className="footer">

        <h3>
          Campus Lost & Found
        </h3>

        <p>
          Helping students reconnect with
          their belongings across campus.
        </p>

        <p>
          © 2026 Campus Lost & Found
        </p>

      </footer>

    </div>
  );
}

export default LandingPage;