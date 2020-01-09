import { useState, useCallback } from 'react';

const useInput = () => {
  const [value, setValue] = useState<string>('');
  const handleInput = useCallback((e: any) => {
    setValue(e.target.value);
  }, []);
  const reset = () => {
    setValue('');
  };

  return [value, handleInput, reset];
};

export default useInput;
