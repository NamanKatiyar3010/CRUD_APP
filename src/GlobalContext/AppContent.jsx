import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState();

  return (
    <AppContext.Provider
      value={{
        data,
        setData,
        totalData,
        setTotalData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
