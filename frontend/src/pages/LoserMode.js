import React, { useEffect, useState } from "react";
import "./loser.css";

function LoserMode() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/items", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch items");
      }

      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="loser-container">
      <h1>📦 Lost Items</h1>

      <div className="items-grid">
        {items.length === 0 ? (
          <p>No items found</p>
        ) : (
          items.map((item) => (
            <div className="item-card" key={item.id}>
              <h2>Found Item</h2>
              <p><b>Location:</b> {item.address}</p>

              {item.image_path && (
                <img
                  src={`http://localhost:5000${item.image_path}`}
                  alt="item"
                  style={{ width: "100%", marginTop: "10px" }}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LoserMode;