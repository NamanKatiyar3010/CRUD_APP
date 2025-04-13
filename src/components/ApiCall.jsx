import { useEffect, useState } from "react";
import { useAppContext } from "../GlobalContext/AppContent";

const ApiCall = (url, method = "GET", dependency = [], shouldFetch = true) => {
  const { setData, setTotalData } = useAppContext();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [totalData, setTotalData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!shouldFetch) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(url, { method });
        const result = await response.json();

        if (!response.ok) throw new Error(result.message || "API call failed");

        if (result?.data) {
          setData(result.data);
        }

        if (result?.totalData !== undefined) {
          setTotalData(result.totalData);
        }

      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (url) fetchData();
  }, dependency); 

  return { loading, error };
};

export default ApiCall