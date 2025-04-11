import { useState, useEffect } from "react";
import Pagination from "./Pagination";
import { useSearchParams, useNavigate } from "react-router-dom";
import Table from "./Table";
import ApiCall from "./ApiCall";
import { useAppContext } from "../GlobalContext/AppContent";

const Home = () => {
  const {data,setData} = useAppContext();
  const navigate = useNavigate();
  // const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const limit = searchParams.get("limit") || "10";
  const page = searchParams.get("page") || "1";
  const searchText = searchParams.get("search") || '';

  const url = `https://crud-vip.vercel.app/api/users?limit=${limit}&page=${page}&search=${searchText}`;
  const {  result,loading, error } = ApiCall(url, "GET", [page, searchText]);

  console.log(result);
  useEffect(() => {
    if (result && result?.data) {
      setTotalData(result?.totalData);
      setData(result?.data.filter((item) => item.name.trim() !== ""));
    }
  }, [result]);

  const totalPages = Math.ceil(totalData / limit);

  const handleChange = (id) => {
    navigate(`/user/${id}`);
  };

  const headers = [
    { name: "Sno" },
    { name: "Name" },
    { name: "Email" },
    { name: "Status" },
  ];

  const updatedData = data?.map((obj, index) => ({
    sNo: {
      text: (parseInt(page) - 1) * parseInt(limit) + index + 1,
      onclick: true,
      id: obj._id,
    },
    name: { text: obj.name },
    email: obj.email,
    status: obj.status ? "active" : "inactive",
  }));

  return (
    <div style={{ padding: "1rem" }}>
      {error ? (
        <div style={{ color: "red", marginBottom: "1rem" }}>
          <h3> Failed to load data</h3>
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
