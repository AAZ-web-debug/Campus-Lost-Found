import React, { useState } from "react";
import "./finder.css";

function FinderMode() {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    const token = localStorage.getItem("token");

    if (!description || !image) {
      alert("Fill all fields");
      return;
    }

    if (!token) {
      alert("Login first");
      return;
    }

    const formData = new FormData();
    formData.append("address", description);
    formData.append("image", image);

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/items", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      alert("Uploaded successfully");

      setDescription("");
      setImage(null);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="finder-container">
      <h1>🔍 Finder Mode</h1>

      <div className="finder-card">
        <textarea
          placeholder="Where did you find it?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload Item"}
        </button>
      </div>
    </div>
  );
}

export default FinderMode;