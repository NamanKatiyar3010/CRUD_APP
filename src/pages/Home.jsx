import Pagination from "../components/Pagination";
import Table from "../components/Table";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";

import PopupBox from "../components/PopupBox";
import { Toaster, toast } from "react-hot-toast";
import { useUserStore } from "../zustand/userStore";
const Home = () => {
  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  const {
    users: data,
    totalUsers: totalData,
    loading,
    isUsersLoaded,
    resetUsersLoaded,
    fetchUsers,
    deleteUser,
    updateUserStatus,
    totalUsers
  } = useUserStore();

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const limit = Math.min(Number(searchParams.get("limit")) || 10, 50);
  const page = searchParams.get("page") || 1;
  const searchText = searchParams.get("search") || "";

  useEffect(() => {
    resetUsersLoaded();
  }, [page, limit, searchText, resetUsersLoaded]);

  useEffect(() => {
    const isPageOne = Number(page) === 1;
    const shouldFetch = !isUsersLoaded || (!isPageOne && data.length === 0);

    if (shouldFetch) {
      fetchUsers({ page, limit, search: searchText });
      console.log("fetching data");
    }
  }, [page, limit, searchText, isUsersLoaded, data.length, fetchUsers]);

  const filteredData = data?.filter((item) => item?.name?.trim() !== "");
  const totalPages = Math.ceil(totalData / parseInt(limit));

  const handleChange = (id) => {
    navigate(`/user/${id}`);
  };

  const handleStatusToggle = async (id, status) => {
    // const actionResult = await dispatch(upDateUserStatus({ id, status }));
    // setStatusUpdateId(id);
    try {
      await updateUserStatus(id, status);

    } catch (err) {
      // setStatusUpdateId(null);
      // console.error(err);
    }
  };


  const handleDelete = (id) => {
    setDeleteId(id);
    setPopUpOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteUser(deleteId,navigate,location);
      } catch (err) {
        toast.error("Failed to delete user. Please try again.");
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
    <div className="p-4">
      <Toaster position="top-right" />
      {loading ? (
        <div className="text-center">
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : data?.length === 0 ? (
        <div className="text-center p-8 text-gray-500">
          <h3>😕 No data found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <Table
              headers={headers}
              loading={loading}
              data={updatedData}
              onUserClick={handleChange}
              onStatusToggle={handleStatusToggle}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              // statusUpdateId={statusUpdateId}
            />
          </div>
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
        footerLeft={
          <button
            onClick={() => setPopUpOpen(false)}
            className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
          >
            Cancel
          </button>
        }
        footerRight={
          <button
            onClick={confirmDelete}
            className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </button>
        }
      >
        <p className="text-gray-600 dark:text-gray-300">
          Are you sure you want to delete this item? This action cannot be
          undone.
        </p>
      </PopupBox>

      {/* <PopupBox
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
      </PopupBox> */}
    </div>
  );
};

export default Home;
