import React, {
  useEffect,
  useState
} from "react";

import "./admin.css";

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

  const deleteItem = async (id) => {

    if (
      !window.confirm(
        "Delete this item?"
      )
    ) {
      return;
    }

    await fetch(
      `http://localhost:5000/api/admin/items/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    fetchItems();
    fetchStats();

  };

  const deleteUser = async (id) => {

    if (
      !window.confirm(
        "Delete this user?"
      )
    ) {
      return;
    }

    await fetch(
      `http://localhost:5000/api/admin/users/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    fetchUsers();
    fetchStats();

  };

  if (accessDenied) {

    return (
      <div className="admin-page">

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
              {user.role}
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
              {item.status}
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
              {claim.status}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}

export default AdminPage;