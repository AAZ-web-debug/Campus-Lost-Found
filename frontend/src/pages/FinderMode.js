import React, { useState } from "react";
import "./finder.css";

function FinderMode() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [verificationDetail, setVerificationDetail] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    const token = localStorage.getItem("token");

    if (
      !title ||
      !category ||
      !description ||
      !verificationDetail ||
      !location ||
      !image
    ) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    formData.append(
      "verification_detail",
      verificationDetail
    );
    formData.append("location", location);
    formData.append("image", image);

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/items",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Upload failed"
        );
      }

      alert("Item uploaded successfully");

      setTitle("");
      setCategory("");
      setDescription("");
      setVerificationDetail("");
      setLocation("");
      setImage(null);

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="finder-container">

      <div className="finder-header">
        <h1>🔍 Report Found Item</h1>
        <p>
          Help someone get their belongings back.
        </p>
      </div>

      <div className="finder-card">

        <input
          type="text"
          placeholder="Item Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          <option value="">
            Select Category
          </option>

          <option value="Electronics">
            Electronics
          </option>

          <option value="ID Card">
            ID Card
          </option>

          <option value="Keys">
            Keys
          </option>

          <option value="Bag">
            Bag
          </option>

          <option value="Documents">
            Documents
          </option>

          <option value="Water Bottle">
            Water Bottle
          </option>

          <option value="Other">
            Other
          </option>
        </select>

        <textarea
          placeholder="Item Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <textarea
          className="verification-box"
          placeholder="Hidden Verification Detail (NOT visible publicly)
Example:
• Name starts with A
• Wallpaper is blue Lamborghini
• Has Avengers sticker"
          value={verificationDetail}
          onChange={(e) =>
            setVerificationDetail(
              e.target.value
            )
          }
        />

        <input
          type="text"
          placeholder="Location Found"
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImage(e.target.files[0])
          }
        />

        {image && (
          <div className="image-preview">
            {image.name}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
        >
          {loading
            ? "Uploading..."
            : "Upload Item"}
        </button>

      </div>

    </div>
  );
}

export default FinderMode;