import { useState, useEffect } from 'react';
import http from 'utils/httpInstance';
import { AxiosRequestConfig } from 'axios';

interface memStoreTypes {
  [x: string]: string;
}
const memStore: memStoreTypes = {};

const useFetch = (
  url: string,
  props: { cache?: boolean } = {},
  axiosOptions: AxiosRequestConfig = {}
) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [shouldRefetch, reFetch] = useState({});

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        let httpConfig: AxiosRequestConfig = {
          method: 'GET',
          url: url,
          ...axiosOptions
        };
        let res = await http(httpConfig);
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
