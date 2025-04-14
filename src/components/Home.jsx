import Pagination from "./Pagination";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import Table from "./Table";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUsers } from "../slices/userSlice";

const Home = () => {
  const { users: data, totalUsers: totalData, loading, error, isUsersLoaded } = useSelector(
    (state) => state.users
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const limit = searchParams.get("limit") || "5";
  const page = searchParams.get("page") || "1";
  const searchText = searchParams.get("search") || "";

  const fromAddUser = location.state?.fromAddUser;

  useEffect(() => {
    if (
      location.pathname === "/" &&
      !searchText &&
      searchParams.has("search")
    ) {
      searchParams.delete("search");
      setSearchParams(searchParams);
    }
  }, [location, searchParams, searchText, setSearchParams]);

  useEffect(() => {
    if (!isUsersLoaded || fromAddUser) {
      dispatch(fetchUsers({ page, limit, search: searchText }));
    }
  }, [dispatch, page, limit, searchText, fromAddUser, isUsersLoaded]);

  const filteredData = data?.filter((item) => item?.name?.trim() !== "") || [];
  const totalPages = Math.ceil(totalData / parseInt(limit));

  const handleChange = (id) => {
    navigate(`/user/${id}`);
  };

  const headers = [
    { name: "Sno" },
    { name: "Name" },
    { name: "Email" },
    { name: "Status" },
  ];

  const updatedData = filteredData?.map((obj, index) => ({
    sNo: {
      text: (parseInt(page) - 1) * parseInt(limit) + index + 1,
      onclick: true,
      id: obj._id,
    },
    name: { text: obj.name },
    email: { text: obj.email },
    status: obj.status ? "active" : "inactive",
  }));

  return (
    <div style={{ padding: "1rem" }}>
      {error ? (
        <div style={{ color: "red", marginBottom: "1rem" }}>
          <h3>⚠️ Failed to load data</h3>
          <p>{error.message || "An unexpected error occurred."}</p>
        </div>
      ) : (
        <>
          <Table
            headers={headers}
            loading={loading}
            data={updatedData}
            onUserClick={handleChange}
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
