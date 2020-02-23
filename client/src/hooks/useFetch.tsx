import { useState, useEffect } from 'react';
import http from 'utils/httpInstance';

interface memStoreTypes {
  [x: string]: string;
}
const memStore: memStoreTypes = {};

const useFetch = (url: string, props: { cache?: boolean } = {}) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [shouldRefetch, reFetch] = useState({});

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
        if (props.cache) memStore[url] = res.data;
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setError(err);
      }
    };

    if (memStore[url]) {
      setIsLoading(false);
      setData(memStore[url]);
    } else {
      getData();
    }
  }, [url, shouldRefetch]);

  return [data, isLoading, error, reFetch];
};

export default useFetch;
