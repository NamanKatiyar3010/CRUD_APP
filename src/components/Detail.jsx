import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../GlobalContext/AppContent";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: globalData } = useAppContext();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const localUser = globalData?.find((u) => u._id === id);

    if (localUser) {
      setUser(localUser);
      setLoading(false);
    } else {
      fetch(`https://crud-vip.vercel.app/api/users/${id}`)
        .then((res) => res.json())
        .then((res) => {
          if (res?.data) setUser(res.data);
          else throw new Error("User not found");
        })
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    }
  }, [id, globalData]);

  if (loading) return <p>Loading user data...</p>;

  if (error)
    return (
      <div style={{ color: "red" }}>
        <h3>⚠️ Error loading user</h3>
        <p>{error.message || "Something went wrong"}</p>
        <button onClick={() => navigate("/")}>Back</button>
      </div>
    );

  if (!user)
    return (
      <div>
        <p>No user data found.</p>
        <button onClick={() => navigate("/")}>Back</button>
      </div>
    );

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        padding: "20px",
        maxWidth: "900px",
        margin: "auto",
        alignItems: "flex-start",
      }}
    >
      <div style={{ flex: "1 1 250px", textAlign: "center" }}>
        {user.image ? (
          <img
            src={user.image}
            alt="User"
            style={{
              width: "100%",
              maxWidth: "250px",
              height: "auto",
              borderRadius: "10px",
              objectFit: "cover",
            }}
          />
        ) : (
          <p>No profile image available.</p>
        )}
      </div>

      <div style={{ flex: "2 1 400px" }}>
        <h2>User Details</h2>
        <hr />
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Location:</strong> {user.location}</p>
        <p><strong>About:</strong> {user.about}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span style={{ color: user.status ? "green" : "red" }}>
            {user.status ? " Active" : " Inactive"}
          </span>
        </p>

        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "10px 20px",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            ⬅ Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Detail;
