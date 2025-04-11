import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiCall from "./ApiCall";
import { useAppContext } from "../GlobalContext/AppContent";

const Detail = () => {
  // const {result, setResult} = useAppContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const url = `https://crud-vip.vercel.app/api/users/${id}`;

  const {  result,loading, error } = ApiCall(url, "GET");
  const data = result?.data;

  if (loading) return <p>Loading user data...</p>;

  if (error)
    return (
      <div style={{ color: "red" }}>
        <h3>⚠️ Error loading user</h3>
        <p>{error.message || "Something went wrong"}</p>
        <button onClick={() => navigate("/")}>Back</button>
      </div>
    );

  if (!data)
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
        {data.image ? (
          <img
            src={data.image}
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
        <p>
          <strong> Name:</strong> {data.name}
        </p>
        <p>
          <strong> Email:</strong> {data.email}
        </p>
        <p>
          <strong> Phone:</strong> {data.phone}
        </p>
        <p>
          <strong> Location:</strong> {data.location}
        </p>
        <p>
          <strong> About:</strong> {data.about}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span style={{ color: data.status ? "green" : "red" }}>
            {data.status ? " Active" : " Inactive"}
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
