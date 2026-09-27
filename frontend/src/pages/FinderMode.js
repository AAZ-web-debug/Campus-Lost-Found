import React, { useEffect, useState } from "react";
import "./finder.css";
import { useToast } from "../components/Toast";
import BackButton from "../components/BackButton";

function FinderMode() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [verificationDetail, setVerificationDetail] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const [imagePreview, setImagePreview] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);

  const {
    success,
    error,
    warning
  } = useToast();

  /* =================================
     CLEAN UP PREVIEW URL
  ================================= */

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  /* =================================
     IMAGE SELECTION
  ================================= */

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    /* IMAGE TYPE VALIDATION */

    if (!file.type.startsWith("image/")) {
      warning("Please select a valid image file.");

      e.target.value = "";
      return;
    }

    /* IMAGE SIZE VALIDATION
       Maximum: 5 MB
    */

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      warning("Image size must be less than 5 MB.");

      e.target.value = "";
      return;
    }

    /* CLEAN PREVIOUS PREVIEW */

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);

    setShowImagePreview(false);
  };

  /* =================================
     UPLOAD
  ================================= */

  const handleUpload = async () => {
    const token =
      localStorage.getItem("token");

    /* REQUIRED FIELD VALIDATION */

    if (
      !title.trim() ||
      !category ||
      !description.trim() ||
      !verificationDetail.trim() ||
      !location.trim() ||
      !image
    ) {
      warning(
        "Please complete every field and select an image before uploading."
      );

      return;
    }

    /* IMAGE VALIDATION */

    if (!image.type.startsWith("image/")) {
      warning(
        "Please select a valid image file."
      );

      return;
    }

    const maxSize =
      5 * 1024 * 1024;

    if (image.size > maxSize) {
      warning(
        "Image size must be less than 5 MB."
      );

      return;
    }

    const formData =
      new FormData();

    formData.append(
      "title",
      title.trim()
    );

    formData.append(
      "category",
      category
    );

    formData.append(
      "description",
      description.trim()
    );

    formData.append(
      "verification_detail",
      verificationDetail.trim()
    );

    formData.append(
      "location",
      location.trim()
    );

    /* IMAGE IS ALWAYS INCLUDED */

    formData.append(
      "image",
      image
    );

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/items",
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`
          },

          body: formData
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
          "Upload failed"
        );
      }

      /* SUCCESS */

      success(
        "Your found item has been added to the platform."
      );

      /* RESET FORM */

      setTitle("");
      setCategory("");
      setDescription("");
      setVerificationDetail("");
      setLocation("");
      setImage(null);

      setShowImagePreview(false);

      if (imagePreview) {
        URL.revokeObjectURL(
          imagePreview
        );
      }

      setImagePreview(null);

      /* RESET FILE INPUT */

      const fileInput =
        document.getElementById(
          "finder-image"
        );

      if (fileInput) {
        fileInput.value = "";
      }

    } catch (err) {
      error(
        err.message ||
        "Failed to upload item."
      );

    } finally {
      setLoading(false);
    }
  };

  /* =================================
     RENDER
  ================================= */

  return (
    <div className="finder-container">

      <BackButton
        fallback="/dashboard"
      />

      {/* =================================
          HEADER
      ================================= */}

      <div className="finder-header">

        <h1>
          🔍 Report Found Item
        </h1>

        <p>
          Help someone get their belongings back.
        </p>

      </div>

      {/* =================================
          FORM
      ================================= */}

      <div className="finder-card">

        {/* ITEM TITLE */}

        <input
          type="text"
          placeholder="Item Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        {/* CATEGORY */}

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

        {/* DESCRIPTION */}

        <textarea
          placeholder="Item Description"
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
        />

        {/* VERIFICATION DETAIL */}

        <textarea
          className="verification-box"
          placeholder={`Hidden Verification Detail (NOT visible publicly)
Example:
• Name starts with A
• Wallpaper is blue Lamborghini
• Has Avengers sticker`}
          value={verificationDetail}
          onChange={(e) =>
            setVerificationDetail(
              e.target.value
            )
          }
        />

        {/* LOCATION */}

        <input
          type="text"
          placeholder="Location Found"
          value={location}
          onChange={(e) =>
            setLocation(
              e.target.value
            )
          }
        />

        {/* =================================
            IMAGE UPLOAD
        ================================= */}

        <div className="finder-image-upload">

          <label
            htmlFor="finder-image"
            className="finder-file-label"
          >
            Choose Image
          </label>

          <input
            id="finder-image"
            type="file"
            accept="image/*"
            className="finder-file-input"
            onChange={handleImageChange}
            required
          />

          {/* PREVIEW BUTTON ONLY AFTER IMAGE
              HAS BEEN SELECTED */}

          {image && (
            <button
              type="button"
              className="finder-preview-button"
              onClick={() =>
                setShowImagePreview(true)
              }
            >
              👁 Preview Image
            </button>
          )}

        </div>

        {/* =================================
            UPLOAD BUTTON
        ================================= */}

        <button
          type="button"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading
            ? "Uploading..."
            : "Upload Item"}
        </button>

      </div>

      {/* =================================
          FULLSCREEN IMAGE PREVIEW
      ================================= */}

      {showImagePreview &&
        imagePreview && (

          <div
            className="finder-image-modal"
            onClick={() =>
              setShowImagePreview(false)
            }
          >

            <button
              type="button"
              className="finder-image-modal-close"
              onClick={() =>
                setShowImagePreview(false)
              }
              aria-label="Close image preview"
            >
              ×
            </button>

            <img
              src={imagePreview}
              alt="Full size preview of selected found item"
              onClick={(e) =>
                e.stopPropagation()
              }
            />

          </div>

        )}

    </div>
  );
}

export default FinderMode;