import { useState, useEffect, useRef } from 'react';

export const usePolling = (pollingFn, isPolling, interval = 2000, maxRetries = 5) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);
  const retryCountRef = useRef(0);
  const currentRequestId = useRef(0);

  useEffect(() => {
    if (!isPolling) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    let isMounted = true;

    const executePoll = async () => {
      currentRequestId.current += 1;
      const requestId = currentRequestId.current;

      try {
        const result = await pollingFn();
        if (isMounted && requestId === currentRequestId.current) {
          setData(result);
          setError(null);
          retryCountRef.current = 0; // reset on success
        }
      } catch (err) {
        if (isMounted && requestId === currentRequestId.current) {
          setError(err);
          retryCountRef.current += 1;
        }
      } finally {
        if (isMounted && isPolling && requestId === currentRequestId.current) {
          if (retryCountRef.current < maxRetries) {
            timerRef.current = setTimeout(executePoll, interval);
          } else {
            if (isMounted) setError(new Error('Max polling retries reached.'));
          }
        }
      }
    };

    executePoll();

    return () => {
      isMounted = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [pollingFn, isPolling, interval, maxRetries]);

  return { data, error };
};
