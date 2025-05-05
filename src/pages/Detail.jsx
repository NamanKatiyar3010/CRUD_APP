import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserStore } from "../zustand/userStore";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchSingleUser, clearSingleUser, singleUser, loading, error } =
    useUserStore();

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current && id) {
      fetchSingleUser(id);
      hasFetched.current = true;
    }
    return () => {
      clearSingleUser();
    };
  }, [clearSingleUser, fetchSingleUser, id]);

  useEffect(() => {
    if (singleUser?.name) {
      document.title = `CRUD - ${singleUser.name}`;
    }
    return () => {
      document.title = "CRUD";
    };
  }, [singleUser]);

  if (loading)
    return (
      <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
        <svg
          className="text-gray-300 animate-spin"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
        >
          <path
            d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-900"
          ></path>
        </svg>
      </div>
    );

  if (error)
    return (
      <div className="text-red-600 text-center p-6">
        <h3 className="text-2xl font-semibold">⚠️ Error loading user</h3>
        <p className="mb-4">No User Found!</p>
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
        {user.image && user.image !== "undefined" ? (
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
