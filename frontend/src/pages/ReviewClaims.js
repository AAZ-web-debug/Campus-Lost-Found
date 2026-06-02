import React, {
  useEffect,
  useState
} from "react";

import "./reviewclaims.css";

function ReviewClaims() {

  const [claims, setClaims] =
    useState([]);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {

    const token =
      localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5000/api/claims",
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    const data =
      await res.json();

    setClaims(
  data.filter(
    (claim) =>
      claim.status === "pending"
  )
);
  };

  const approveClaim = async (
    id
  ) => {

    const token =
      localStorage.getItem("token");

    await fetch(
      `http://localhost:5000/api/claims/${id}/approve`,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    fetchClaims();
  };

  const rejectClaim = async (
    id
  ) => {

    const token =
      localStorage.getItem("token");

    await fetch(
      `http://localhost:5000/api/claims/${id}/reject`,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    fetchClaims();
  };

  return (
    <div className="review-container">

      <h1>
        Claim Requests
      </h1>

      <div className="claims-grid">

        {claims.map((claim) => (

          <div
            className="claim-card"
            key={claim.id}
          >

            <h2>
              {claim.title}
            </h2>

            <p>
              <b>Category:</b>
              {" "}
              {claim.category}
            </p>

            <p>
              <b>Claimant:</b>
              {" "}
              {claim.claimer_id}
            </p>

            <p>
              <b>Reason:</b>
              {" "}
              {claim.claim_reason}
            </p>

            <p>
              <b>Identifier:</b>
              {" "}
              {
                claim.identifier_description
              }
            </p>

            <p>
              <b>Lost Location:</b>
              {" "}
              {claim.lost_location}
            </p>

            <p>
              <b>Lost Date:</b>
              {" "}
              {claim.lost_date}
            </p>

            <p>
              <b>Additional Proof:</b>
              {" "}
              {
                claim.additional_proof
              }
            </p>

            <hr />

            <p>
              <b>
                Hidden Verification:
              </b>
            </p>

            <p>
              {
                claim.verification_detail
              }
            </p>

            <div className="actions">

              <button
                className="approve-btn"
                onClick={() => {

                  if (
                    window.confirm(
                      "Approve this claim?"
                    )
                  ) {
                    approveClaim(
                      claim.id
                    );
                  }

                }}
              >
                Approve
              </button>

              <button
                className="reject-btn"
                onClick={() => {

                if (
                  window.confirm(
                    "Reject this claim?"
                  )
                ) {
                  rejectClaim(
                    claim.id
                  );
                }

              }}
              >
                Reject
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default ReviewClaims;