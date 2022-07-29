import { useRef, useEffect } from 'react';

// 获取上一次值
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  // useEffect 是副作用，所以会先执行 return ，然后在执行 useEffect
  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// const Counter = () => {
//   const [value, setValue] = React.useState(0);
//   const lastValue = usePrevious(value);

//   return (
//     <div>
//       <p>Current: { value } - Previous: { lastValue } </p>
//       <button onClick = {() => setValue(value + 1)}> Increment </button>
//     </div>
//   )
// }

// ReactDOM.render(<Counter />, document.getElementById('root'))
