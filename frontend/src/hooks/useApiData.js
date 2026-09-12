import { useCallback, useEffect, useState } from "react";

/**
 * Generic data-fetching hook.
 * fetcher: async () => data
 * demoFallback: data to use (flagged as demo) if the live request fails
 */
export function useApiData(fetcher, deps = [], demoFallback = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDemo, setIsDemo] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetcher();
      const payload = res?.data?.data ?? res?.data ?? res;
      setData(payload);
      setIsDemo(false);
    } catch (err) {
      setError(err);
      if (demoFallback !== null) {
        setData(demoFallback);
        setIsDemo(true);
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  return { data, loading, error, isDemo, refetch: load };
}
