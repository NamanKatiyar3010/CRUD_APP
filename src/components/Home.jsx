import Pagination from "./Pagination";
import Table from "./Table";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { fetchUsers, resetUsersLoaded, upDateUserStatus } from "../slices/userSlice";

const Home = () => {
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
    if (location.pathname === "/" && !searchText && searchParams.has("search")) {
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

    const shouldFetch =
      !isUsersLoaded || (!isPageOne && data.length === 0);

    if (shouldFetch) {
      dispatch(fetchUsers({ page, limit, search: searchText }));
    }
  }, [dispatch, page, limit, searchText, isUsersLoaded, data.length]);

  const filteredData = data?.filter((item) => item?.name?.trim() !== "") || [];
  const totalPages = Math.ceil(totalData / parseInt(limit));

  const handleChange = (id) => {
    navigate(`/user/${id}`);
  };

  const handleStatusToggle= (id,status)=>{
    console.log('button clicked', id , status);
    dispatch(upDateUserStatus({id,status}));
    
  }
  const headers = [
    { name: "Sno" },
    { name: "Name" },
    { name: "Email" },
    { name: "Status" },
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
    </div>
  );
};

export default Home;
