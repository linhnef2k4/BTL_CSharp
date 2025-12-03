import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Thiết lập timer để update value sau khoảng delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear timer nếu value thay đổi trước khi hết thời gian delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;