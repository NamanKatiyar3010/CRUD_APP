import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // const [search, setSearch] = useState("");
  // const [page, setPage] = useState(1);
  // const [limit, setLimit] = useState(10);
  // const [loading,setLoading] = useState(false);
  const [data, setData] = useState();
  // const [error, setError] = useState(null)

  return (
    <AppContext.Provider
      value={{
        data,
        setData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use context
export const useAppContext = () => useContext(AppContext);
