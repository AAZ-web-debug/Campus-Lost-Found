import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/auth';
import { useToast } from '../components/Toast';
import BackButton from '../components/BackButton';
import './myclaims.css';

const API_BASE = 'http://localhost:5000';

function MyClaims() {
  const navigate = useNavigate();
  const { error } = useToast();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_BASE}/api/my-claims`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to load your claims');
      }

      const data = await res.json();
      setClaims(data);
    } catch (err) {
      error(err.message || 'Failed to load your claims');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    fetchClaims();
  }, [navigate, fetchClaims]);

  const getStatusInfo = (status) => {
    if (status === 'approved') {
      return {
        className: 'claim-status approved',
        icon: '✓',
        label: 'Approved',
        description: 'Your claim was approved by the finder.'
      };
    }

    if (status === 'rejected') {
      return {
        className: 'claim-status rejected',
        icon: '×',
        label: 'Rejected',
        description: 'Your claim was not approved by the finder.'
      };
    }

    return {
      className: 'claim-status pending',
      icon: '◷',
      label: 'Pending',
      description: 'Your claim is waiting for the finder to review it.'
    };
  };

  return (
    <div className="my-claims-page">
      <div className="my-claims-shell">

        <BackButton fallback="/dashboard" />

        <header className="my-claims-header">
          <div>
            <span className="page-eyebrow">CLAIM TRACKER</span>

            <h1>My Claims</h1>

            <p>
              Track the status of items you have claimed.
            </p>
          </div>
        </header>

        {loading ? (
          <div className="my-claims-state">
            <div className="state-spinner" />

            <p>Loading your claims...</p>
          </div>
        ) : claims.length === 0 ? (
          <div className="my-claims-state empty">

            <div className="state-icon">
              📋
            </div>

            <h2>No Claims Yet</h2>

            <p>
              You have not submitted any ownership claims.
            </p>

            <button
              className="browse-button"
              onClick={() => navigate('/loser')}
            >
              Browse Found Items
            </button>

          </div>
        ) : (
          <div className="claims-list">

            {claims.map((claim) => {

              const status = getStatusInfo(claim.status);

              return (
                <article
                  className="my-claim-card"
                  key={claim.id}
                >

                  <div className="claim-card-main">

                    <div className="claim-item-icon">
                      📦
                    </div>

                    <div className="claim-item-info">

                      <div className="claim-title-row">

                        <h2>
                          {claim.title}
                        </h2>

                        <span className={status.className}>

                          <span className="status-icon">
                            {status.icon}
                          </span>

                          {status.label}

                        </span>

                      </div>

                      <div className="claim-meta">

                        <span>
                          {claim.category}
                        </span>

                        <span>
                          •
                        </span>

                        <span>
                          📍 {claim.location}
                        </span>

                      </div>

                      <p className="claim-description">
                        {status.description}
                      </p>

                      <small className="claim-date">
                        Submitted{' '}
                        {new Date(
                          claim.created_at
                        ).toLocaleDateString()}
                      </small>

                    </div>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}

export default MyClaims;