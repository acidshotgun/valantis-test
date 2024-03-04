import { useMemo } from "react";

export const useClass = <T, A extends any[]>(
  needClass: new (...args: A) => T,
  ...args: A
) => useMemo(() => new needClass(...args), []);