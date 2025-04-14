import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleUser, clearSingleUser } from "../slices/userSlice";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { singleUser, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    if (id) dispatch(fetchSingleUser(id));

    return () => {
      dispatch(clearSingleUser());
    };
  }, [id, dispatch]);

  if (loading) return <p>Loading user data...</p>;

  if (error)
    return (
      <div style={{ color: "red" }}>
        <h3>⚠️ Error loading user</h3>
        <p>{error}</p>
        <button onClick={() => navigate("/")}>Back</button>
      </div>
    );

  if (!singleUser)
    return (
      <div>
        <p>No user data found.</p>
        <button onClick={() => navigate("/")}>Back</button>
      </div>
    );

  const user = singleUser;

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
