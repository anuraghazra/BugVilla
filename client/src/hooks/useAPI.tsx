import { useState, useCallback } from 'react';
import http from 'utils/httpInstance';

const useAPI = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const callAPI = useCallback((httpConfig: any, callback: any) => {
    setLoading(true);
    setError(null);
    return http(httpConfig)
      .then(res => {
        setLoading(false);
        setResponse(res.data);
        console.log(res);
        // fix error handling
        // callback to manipulate data
        callback(res);
      })
      .catch((err: any) => {
        setError(err.response.data.error);
        setLoading(false);
      });
  }, []);

  return { loading, error, callAPI };
};

export default useAPI;
