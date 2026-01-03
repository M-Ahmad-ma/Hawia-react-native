import React, { createContext, useState, useEffect } from 'react';
import fetchList from '../api/index.js';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [data, setData] = useState({ status: '', data: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function refetch() {
    try {
      setLoading(true);
      const res = await fetchList('https://hawia.sa/api/list.php');
      setData(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refetch();
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, error, refetch }}>
      {children}
    </DataContext.Provider>
  );
}

export default DataContext;
