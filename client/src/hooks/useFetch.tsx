import { useState, useEffect } from 'react';
import http from 'utils/httpInstance';

const useFetch = (url: string) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        let res = await http({
          method: 'GET',
          url: url
        });
        setIsLoading(false);
        setData(res.data);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setError(err);
      }
    };

    getData();
  }, [url]);

  return { data, isLoading, error };
};

export default useFetch;
