import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./claim.css";
import { useToast } from "../components/Toast";
import BackButton from "../components/BackButton";

function ClaimPage() {

  const { id } = useParams();
  const navigate = useNavigate();
  const {
  success,
  error
} = useToast();

  const [claimReason, setClaimReason] =
    useState("");

  const [
    identifierDescription,
    setIdentifierDescription
  ] = useState("");

  const [lostLocation, setLostLocation] =
    useState("");

  const [lostDate, setLostDate] =
    useState("");

  const [
    additionalProof,
    setAdditionalProof
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async () => {

    const token =
      localStorage.getItem("token");

    try {

      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/claims",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({
            item_id: id,
            claim_reason:
              claimReason,
            identifier_description:
              identifierDescription,
            lost_location:
              lostLocation,
            lost_date:
              lostDate,
            additional_proof:
              additionalProof
          })
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error
        );
      }

      success(
  "Your ownership claim has been submitted for review."
);

      navigate("/loser");

    } catch (err) {

      error(err.message);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="claim-container">

      <BackButton fallback="/loser" />

      <div className="claim-card">

        <h1>
          Claim Item
        </h1>

        <textarea
          placeholder="Why is this item yours?"
          value={claimReason}
          onChange={(e) =>
            setClaimReason(
              e.target.value
            )
          }
        />

        <textarea
          placeholder="Describe a unique identifying feature"
          value={
            identifierDescription
          }
          onChange={(e) =>
            setIdentifierDescription(
              e.target.value
            )
          }
        />

        <input
          type="text"
          placeholder="Where did you lose it?"
          value={lostLocation}
          onChange={(e) =>
            setLostLocation(
              e.target.value
            )
          }
        />

        <input
          type="date"
          value={lostDate}
          onChange={(e) =>
            setLostDate(
              e.target.value
            )
          }
        />

        <textarea
          placeholder="Additional proof"
          value={additionalProof}
          onChange={(e) =>
            setAdditionalProof(
              e.target.value
            )
          }
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
        >
          {
            loading
            ? "Submitting..."
            : "Submit Claim"
          }
        </button>

      </div>

    </div>
  );
}

export default ClaimPage;