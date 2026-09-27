import React, {
  useEffect,
  useState
} from "react";

import "./admin.css";
import BackButton from "../components/BackButton";
import ConfirmModal from "../components/ConfirmModal";

const formatStatus = (value) => {
  if (!value) return "";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

function AdminPage() {

  const [stats, setStats] =
    useState(null);

  const [users, setUsers] =
    useState([]);

  const [items, setItems] =
    useState([]);

  const [claims, setClaims] =
    useState([]);

  const [accessDenied, setAccessDenied] =
    useState(false);

    const [confirmAction, setConfirmAction] = useState(null);

  const token =
    localStorage.getItem(
      "token"
    );

  useEffect(() => {

    fetchStats();
    fetchUsers();
    fetchItems();
    fetchClaims();

  }, []);

  const fetchStats = () => {

    fetch(
      "http://localhost:5000/api/admin/stats",
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((data) => {

        if (data.error) {

          setAccessDenied(true);
          return;

        }

        setStats(data);

      });

  };

  const fetchUsers = () => {

    fetch(
      "http://localhost:5000/api/admin/users",
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((data) => {

        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setUsers([]);
        }

      });

  };

  const fetchItems = () => {

    fetch(
      "http://localhost:5000/api/admin/items",
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((data) => {

        if (Array.isArray(data)) {
          setItems(data);
        } else {
          setItems([]);
        }

      });

  };

  const fetchClaims = () => {

    fetch(
      "http://localhost:5000/api/admin/claims",
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((data) => {

        if (Array.isArray(data)) {
          setClaims(data);
        } else {
          setClaims([]);
        }

      });

  };

  const deleteItem = (id) => {
  setConfirmAction({
    type: "item",
    id
  });
};

  const deleteUser = (id) => {
  setConfirmAction({
    type: "user",
    id
  });
};

const handleConfirmDelete = async () => {
  if (!confirmAction) {
    return;
  }

  const {
    type,
    id
  } = confirmAction;

  setConfirmAction(null);

  const endpoint =
    type === "user"
      ? `/api/admin/users/${id}`
      : `/api/admin/items/${id}`;

  try {

    const res = await fetch(
      `http://localhost:5000${endpoint}`,
      {
        method: "DELETE",

        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.error ||
        "Failed to delete"
      );
    }

    if (type === "user") {
      fetchUsers();
    } else {
      fetchItems();
    }

    fetchStats();

  } catch (err) {

    console.error(
      "Delete error:",
      err
    );

    alert(
      err.message ||
      "Failed to delete"
    );
  }
};

  if (accessDenied) {

    return (
      <div className="admin-page">

        <BackButton fallback="/dashboard" />

        <h1>
          ⛔ Access Denied
        </h1>

        <p>
          You do not have permission
          to access the Admin Panel.
        </p>

      </div>
    );

  }

  if (!stats) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="admin-page">

      <BackButton fallback="/dashboard" />

      <h1>
        👑 Admin Panel
      </h1>

      <div className="admin-grid">

        <div className="admin-card">
          <h2>{stats.totalUsers}</h2>
          <p>Users</p>
        </div>

        <div className="admin-card">
          <h2>{stats.totalItems}</h2>
          <p>Items</p>
        </div>

        <div className="admin-card">
          <h2>{stats.pendingClaims}</h2>
          <p>Pending Claims</p>
        </div>

        <div className="admin-card">
          <h2>{stats.returnedItems}</h2>
          <p>Returned Items</p>
        </div>

      </div>

      <h2 className="admin-section-title">
        Users
      </h2>

      <div className="admin-table">

        {users.map((user) => (

          <div
            className="admin-row"
            key={user.id}
          >

            <span>
              {user.user_id}
            </span>

            <span
              className={
                user.role === "admin"
                  ? "admin-badge"
                  : "user-badge"
              }
            >
              {formatStatus(user.role)}
            </span>

            {user.role !== "admin" && (

              <button
                className="delete-btn"
                onClick={() =>
                  deleteUser(user.id)
                }
              >
                Delete
              </button>

            )}

          </div>

        ))}

      </div>

      <h2 className="admin-section-title">
        Items
      </h2>

      <div className="admin-table">

        {items.map((item) => (

          <div
            className="admin-row"
            key={item.id}
          >

            <span>
              {item.title}
            </span>

            <span>
              {formatStatus(item.status)}
            </span>

            <button
              className="delete-btn"
              onClick={() =>
                deleteItem(item.id)
              }
            >
              Delete
            </button>

          </div>

        ))}

      </div>

      <h2 className="admin-section-title">
        Claims
      </h2>

      <div className="admin-table">

        {claims.map((claim) => (

          <div
            className="admin-row"
            key={claim.id}
          >

            <span>
              {claim.title}
            </span>

            <span>
              {claim.claimer_id}
            </span>

            <span>
              {formatStatus(claim.status)}
            </span>

          </div>

        ))}

      </div>

      <ConfirmModal
  open={!!confirmAction}

  title={
    confirmAction?.type === "user"
      ? "Delete User?"
      : "Delete Item?"
  }

  message={
    confirmAction?.type === "user"
      ? "Are you sure you want to permanently delete this user?"
      : "Are you sure you want to permanently delete this item?"
  }

  confirmText="Delete"
  cancelText="Cancel"

  onConfirm={handleConfirmDelete}

  onCancel={() =>
    setConfirmAction(null)
  }
/>

    </div>
  );
}

export default AdminPage;