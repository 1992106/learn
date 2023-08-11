import { useEffect, useRef, useState } from 'react';

type noop = () => void;

export const useThrottleFn = (fn: noop, ms = 30, deps: any[] = []) => {
  const previous = useRef(0);
  const [time, setTime] = useState(ms);

  useEffect(() => {
    const now = Date.now();
    if (now - previous.current > time) {
      fn();
      previous.current = now;
    }
  }, deps);

  const cancel = () => {
    setTime(0);
  };

  return [cancel];
};

export const useThrottleFn = (fn: noop, ms = 30, deps: any[] = []) => {
  const timeout = useRef<any>();

  useEffect(() => {
    if (!timeout.current) {
      timeout.current = setTimeout(() => {
        fn();
        cancel();
      }, ms);
    }
  }, deps);

  const cancel = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
  };

  return [cancel];
};

// const Demo = () => {
//   const [val, setVal] = useState('');
//   const [throttleValue, setThrottleValue] = useState('');

//   const [cancel] = useThrottleFn(
//     () => {
//       setThrottleValue(val);
//     },
//     2000,
//     [val]
//   );

//   return (
//     <div>
//       <input
//         type="text"
//         value={val}
//         placeholder="Throttle input"
//         onChange={({ currentTarget }) => {
//           setState('Waiting for typing to stop...');
//           setVal(currentTarget.value);
//         }}
//       />
//       <div>
//         Throttle value: {throttleValue}
//         <button onClick={cancel}>Cancel debounce</button>
//       </div>
//     </div>
//   );
// };
