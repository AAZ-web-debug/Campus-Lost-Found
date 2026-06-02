import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loser.css";

function LoserMode() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedImage, setSelectedImage] =
  useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5000/api/items",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setItems(data);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      (item.title || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      category === "All"
        ? true
        : item.category === category;

    return (
      matchesSearch &&
      matchesCategory
    );
  });

  return (
    <div className="loser-container">

      <div className="loser-header">
        <h1>📦 Browse Found Items</h1>
        <p>
          Search campus-wide found belongings
        </p>
      </div>

      <div className="filters">

        <input
          type="text"
          placeholder="Search item..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          <option>All</option>
          <option>Electronics</option>
          <option>ID Card</option>
          <option>Keys</option>
          <option>Bag</option>
          <option>Documents</option>
          <option>Water Bottle</option>
          <option>Other</option>
        </select>

      </div>

      <div className="items-grid">

        {filteredItems.length === 0 && (
          <div className="empty-state">
            No matching items found.
          </div>
        )}

        {filteredItems.map((item) => (
          
          <div
            className="item-card"
            key={item.id}
          >

            {item.image_path && (
              <img
                src={`http://localhost:5000${item.image_path}`}
                alt="item"
                className="item-image"
                onClick={() =>
                  setSelectedImage(
                    `http://localhost:5000${item.image_path}`
                  )
                }
              />
            )}

            <div className="item-category">
              {item.category}
            </div>

            <h2>
              {item.title}
            </h2>

            <p className="description">
              {item.description}
            </p>

            <p className="location">
              📍 {item.location}
            </p>

            <button
              className="claim-btn"
              onClick={() =>
                navigate(`/claim/${item.id}`)
              }
            >
              Claim Item
            </button>

          </div>

        ))}

      </div>

    {selectedImage && (
  <div
    className="image-modal"
    onClick={() =>
      setSelectedImage(null)
    }
  >
    <img
      src={selectedImage}
      alt="preview"
      className="modal-image"
    />
  </div>
)}
    </div>
  );
}

export default LoserMode;