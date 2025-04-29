import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchSingleUser, clearSingleUser } from "../slices/userSlice";
import { useUserStore } from "./zustand/userStore";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const {fetchSingleUser,clearSingleUser,singleUser,loading,error} = useUserStore();

  // const { singleUser, loading, error } = useSelector((state) => state.users);
  // console.log(singleUser ? "Single user" : "null");

  useEffect(() => {
    if (id) fetchSingleUser(id);

    return () => {
      clearSingleUser();
    };
  }, [id]);

  useEffect(() => {
    if (singleUser?.name) {
      document.title = `CRUD - ${singleUser.name}`;
    }
    return () => {
      document.title = "CRUD";
    };
  }, [singleUser]);

  if (loading)
    return <p className="text-center text-lg mt-8">Loading user data...</p>;

  if (error)
    return (
      <div className="text-red-600 text-center p-6">
        <h3 className="text-2xl font-semibold">⚠️ Error loading user</h3>
        <p className="mb-4">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          ⬅ Back
        </button>
      </div>
    );

  if (!singleUser)
    return (
      <div className="text-center p-6">
        <p className="text-lg mb-4">No user data found.</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          ⬅ Back
        </button>
      </div>
    );

  const user = singleUser;

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-wrap gap-6 items-start">
      {/* Image Section */}
      <div className="flex-1 min-w-[250px] text-center">
        {user.image && user.image!=="undefined"? (
          <img
            src={user.image}
            alt="User"
            className="w-full max-w-xs h-auto rounded-lg object-cover mx-auto"
          />
        ) : (
          <p className="text-gray-500">No profile image available.</p>
        )}
      </div>

      {/* Details Section */}
      <div className="flex-1 min-w-[300px]">
        <h2 className="text-2xl font-bold mb-2">User Details</h2>
        <hr className="mb-4" />
        <p className="mb-2">
          <span className="font-semibold">Name:</span> {user.name}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Phone:</span> {user.phone}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Location:</span> {user.location}
        </p>
        <p className="mb-2">
          <span className="font-semibold">About:</span> {user.about}
        </p>
        <p className="mb-4">
          <span className="font-semibold">Status:</span>{" "}
          <span className={user.status ? "text-green-600" : "text-red-600"}>
            {user.status ? "Active" : "Inactive"}
          </span>
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          ⬅ Back
        </button>
      </div>
    </div>
  );
};

export default Detail;
