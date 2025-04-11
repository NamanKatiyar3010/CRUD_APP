import { useState, useEffect } from 'react';
import { useAppContext } from '../GlobalContext/AppContent';

const ApiCall = (url, method,dependency ) => {
  const [result, setResult] = useState([]);
  // const {result , setResult} = useAppContext();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, { method });
        const resul = await response.json();
        setResult(resul); 
      } catch (err) {
        setLoading(false);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (url) fetchData();
  }, dependency || []);

  return { result, loading, error };
};

export default ApiCall;
