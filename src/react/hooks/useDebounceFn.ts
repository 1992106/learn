import { useEffect, useRef } from 'react';

type noop = () => void;

export const useDebounceFn = (fn: noop, ms = 30, deps: any[] = []) => {
  const timeout = useRef<any>();

  useEffect(() => {
    timeout.current = setTimeout(() => {
      fn();
      cancel();
    }, ms);

    return cancel;
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
//   const [debouncedValue, setDebouncedValue] = useState('');

//   const [cancel] = useDebounceFn(
//     () => {
//       setDebouncedValue(val);
//     },
//     2000,
//     [val]
//   );

//   return (
//     <div>
//       <input
//         type="text"
//         value={val}
//         placeholder="Debounced input"
//         onChange={({ currentTarget }) => {
//           setState('Waiting for typing to stop...');
//           setVal(currentTarget.value);
//         }}
//       />
//       <div>
//         Debounced value: {debouncedValue}
//         <button onClick={cancel}>Cancel debounce</button>
//       </div>
//     </div>
//   );
// };
