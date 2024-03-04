import { useCallback, useLayoutEffect, useState } from "react";

export type TUseAsyncResult<T> = [T | null, boolean, Error | null, () => void];

export const useAsync = <T>(
  func: () => (T | Promise<T>),
  deps: any[] = []
): TUseAsyncResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [obj, setObject] = useState({});

  const reload = useCallback(() => {
    setObject({});
  }, []);

  useLayoutEffect(() => {
    setData(null);
    setLoading(true);
    setError(null);

    Promise.resolve()
      .then(func)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [obj, ...deps]);

  return [
    data,
    loading,
    error,
    reload,
  ];
};