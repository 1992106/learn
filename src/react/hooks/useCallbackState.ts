import { useEffect, useState, useRef } from 'react';

function useCallbackState<S>(initialState: S | (() => S)) {
  const cbRef = useRef<Function>();
  const [data, setData] = useState(initialState);

  useEffect(() => {
    cbRef.current && cbRef.current(data);
  }, [data]);

  return [
    data,
    function (state: S, callback: Function) {
      cbRef.current = callback;
      setData(state);
    }
  ];
}
