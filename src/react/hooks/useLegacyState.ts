import { useCallback, useState } from 'react'

export const useLegacyState = <T,>(defaultState: T) => {
  let [state, setState] = useState(defaultState);

  const setLegacyState = (nextState: Partial<T>) => {
    let newState = { ...state, ...nextState };
    setState(newState);
  };

  return [state, setLegacyState];
};
