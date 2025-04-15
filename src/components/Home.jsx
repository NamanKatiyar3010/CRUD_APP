import Pagination from "./Pagination";
import Table from "./Table";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import {
  fetchUsers,
  resetUsersLoaded,
  upDateUserStatus,
  deleteUser,
} from "../slices/userSlice";
import PopupBox from "../PopupBox";

const Home = () => {
  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [statusRetryData, setStatusRetryData] = useState(null); // { id, status, attempts }

  const {
    users: data,
    totalUsers: totalData,
    loading,
    error,
    isUsersLoaded,
  } = useSelector((state) => state.users);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const limit = Math.min(Number(searchParams.get("limit")) || 10, 50);
  const page = searchParams.get("page") || 1;
  const searchText = searchParams.get("search") || "";

  useEffect(() => {
    if (
      location.pathname === "/" &&
      !searchText &&
      searchParams.has("search")
    ) {
      const updatedParams = new URLSearchParams(searchParams);
      updatedParams.delete("search");
      setSearchParams(updatedParams);
    }
  }, [location.pathname, searchText, searchParams, setSearchParams]);

  useEffect(() => {
    dispatch(resetUsersLoaded());
  }, [page, limit, searchText, dispatch]);

  useEffect(() => {
    const isPageOne = Number(page) === 1;
    const shouldFetch = !isUsersLoaded || (!isPageOne && data.length === 0);

    if (shouldFetch) {
      dispatch(fetchUsers({ page, limit, search: searchText }));
    }
  }, [dispatch, page, limit, searchText, isUsersLoaded, data.length]);

  const filteredData = data?.filter((item) => item?.name?.trim() !== "") || [];
  const totalPages = Math.ceil(totalData / parseInt(limit));

  const handleChange = (id) => {
    navigate(`/user/${id}`);
  };

  const handleStatusToggle = async (id, status) => {
    const actionResult = await dispatch(upDateUserStatus({ id, status }));

    if (upDateUserStatus.rejected.match(actionResult)) {
      // First failure, show retry popup
      setStatusRetryData({ id, status, attempts: 1 });
    }
  };

  const confirmStatusRetry = async () => {
    if (!statusRetryData) return;

    const { id, status, attempts } = statusRetryData;
    const actionResult = await dispatch(upDateUserStatus({ id, status }));

    if (upDateUserStatus.rejected.match(actionResult)) {
      if (attempts + 1 < 3) {
        setStatusRetryData({ id, status, attempts: attempts + 1 });
      } else {
        alert("Max retry attempts reached.");
        setStatusRetryData(null);
      }
    } else {
      setStatusRetryData(null); // success
    }
  };

  const cancelStatusRetry = () => {
    setStatusRetryData(null);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setPopUpOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await dispatch(deleteUser(deleteId));
        dispatch(fetchUsers({ page, limit, search: searchText }));
      } catch (error) {
        alert("Failed to delete user. Please try again.");
      } finally {
        setDeleteId(null);
        setPopUpOpen(false);
      }
    }
  };

  const handleUpdate = async (id) => {
    navigate(`/users/${id}`);
  };

  const headers = [
    { name: "Sno" },
    { name: "Name" },
    { name: "Email" },
    { name: "Status" },
    { name: "Actions" },
  ];

  const updatedData = filteredData.map((obj, index) => ({
    sNo: {
      text: (parseInt(page) - 1) * parseInt(limit) + index + 1,
      onclick: true,
      id: obj._id,
    },
    name: { text: obj.name },
    email: { text: obj.email },
    status: {
      isStatusButton: true,
      checked: obj.status,
      id: obj._id,
    },
    actions: {
      isActions: true,
      id: obj._id,
    },
  }));

  return (
    <div style={{ padding: "1rem" }}>
      {error ? (
        <div style={{ color: "red", marginBottom: "1rem" }}>
          <h3>⚠️ Failed to load data</h3>
          <p>{error.message || "An unexpected error occurred."}</p>
        </div>
      ) : loading ? (
        <p>Loading...</p>
      ) : filteredData.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#888" }}>
          <h3>😕 No data found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <Table
            headers={headers}
            loading={loading}
            data={updatedData}
            onUserClick={handleChange}
            onStatusToggle={handleStatusToggle}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
          <Pagination
            num={totalPages}
            setSearchParams={setSearchParams}
            searchParams={searchParams}
            limit={limit}
            loading={loading}
          />
        </>
      )}

      {/* 🧾 Delete Confirmation Popup */}
      <PopupBox
        isOpen={isPopUpOpen}
        onClose={() => setPopUpOpen(false)}
        title="Confirm Deletion"
        footer={
          <>
            <button onClick={() => setPopUpOpen(false)}>Cancel</button>
            <button onClick={confirmDelete}>Delete</button>
          </>
        }
      >
        <p>Are you sure you want to delete this user?</p>
      </PopupBox>
      <PopupBox
        isOpen={!!statusRetryData}
        onClose={cancelStatusRetry}
        title="Status Update Failed"
        footer={
          <>
            <button onClick={cancelStatusRetry}>Cancel</button>
            <button onClick={confirmStatusRetry}>Retry</button>
          </>
        }
      >
        <p>Failed to update status. Do you want to retry?</p>
        <p>Attempt {statusRetryData?.attempts} of 3</p>
      </PopupBox>
    </div>
  );
};

export default Home;
