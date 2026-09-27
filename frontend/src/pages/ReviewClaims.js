import React, {
  useEffect,
  useState
} from "react";

import "./reviewclaims.css";

import { useToast } from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";
import BackButton from "../components/BackButton";
import ApproveClaimModal from "../components/ApproveClaimModal";


function ReviewClaims() {

  const [claims, setClaims] =
    useState([]);

  const [confirmAction, setConfirmAction] =
    useState(null);

  const [approveClaimId, setApproveClaimId] =
    useState(null);

  const [approving, setApproving] =
    useState(false);

  const {
    success,
    error
  } = useToast();


  useEffect(() => {
    fetchClaims();
  }, []);


  const fetchClaims = async () => {

    try {

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

      if (!res.ok) {
        throw new Error(
          data.error ||
          "Failed to load claims"
        );
      }

      setClaims(
        data.filter(
          (claim) =>
            claim.status === "pending"
        )
      );

    } catch (err) {

      error(
        err.message ||
        "Failed to load claim requests"
      );

    }
  };


  const approveClaim = async (
    id,
    contactDetails
  ) => {

    try {

      setApproving(true);

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/claims/${id}/approve`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify(
            contactDetails
          )
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
          "Failed to approve claim"
        );
      }

      setApproveClaimId(null);

      success(
        "Claim approved and contact details shared with the claimant."
      );

      fetchClaims();

    } catch (err) {

      error(
        err.message ||
        "Failed to approve claim"
      );

    } finally {

      setApproving(false);

    }

  };


  const rejectClaim = async (id) => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/claims/${id}/reject`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
          "Failed to reject claim"
        );
      }

      success(
        "The claim has been rejected."
      );

      fetchClaims();

    } catch (err) {

      error(
        err.message ||
        "Failed to reject claim"
      );

    }

  };


  const handleApprove = (id) => {

    setApproveClaimId(id);

  };


  const handleReject = (id) => {

    setConfirmAction({
      type: "reject",
      id
    });

  };


  const handleConfirm = async () => {

    if (!confirmAction) {
      return;
    }

    const {
      type,
      id
    } = confirmAction;

    setConfirmAction(null);

    if (type === "reject") {

      await rejectClaim(id);

    }

  };


  return (
    <div className="review-container">

      <BackButton fallback="/dashboard" />

      <h1>
        Claim Requests
      </h1>


      <div className="claims-grid">

        {claims.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              📭
            </div>

            <h2>
              No Pending Claims
            </h2>

            <p>
              There are currently no claim
              requests waiting for review.
            </p>

          </div>

        ) : (

          claims.map((claim) => (

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
                {claim.identifier_description}
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
                {claim.additional_proof}
              </p>


              <hr />


              <p>
                <b>
                  Hidden Verification:
                </b>
              </p>


              <p>
                {claim.verification_detail}
              </p>


              <div className="actions">

                <button
                  className="approve-btn"
                  onClick={() =>
                    handleApprove(
                      claim.id
                    )
                  }
                >
                  Approve
                </button>


                <button
                  className="reject-btn"
                  onClick={() =>
                    handleReject(
                      claim.id
                    )
                  }
                >
                  Reject
                </button>

              </div>

            </div>

          ))

        )}

      </div>


      {/* APPROVE CLAIM MODAL */}

      <ApproveClaimModal
        open={approveClaimId !== null}

        loading={approving}

        onConfirm={(contactDetails) =>
          approveClaim(
            approveClaimId,
            contactDetails
          )
        }

        onCancel={() =>
          setApproveClaimId(null)
        }
      />


      {/* REJECT CONFIRMATION MODAL */}

      <ConfirmModal
        open={!!confirmAction}

        title="Reject Claim?"

        message="Are you sure you want to reject this ownership claim?"

        confirmText="Reject Claim"

        cancelText="Cancel"

        onConfirm={
          handleConfirm
        }

        onCancel={() =>
          setConfirmAction(null)
        }
      />

    </div>
  );
}


export default ReviewClaims;