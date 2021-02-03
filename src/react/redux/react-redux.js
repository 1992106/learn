import { bindActionCreators } from 'redux';
import { connect, useSelector, useDispatch } from 'react-redux';
import { createAction, createSelector } from '@reduxjs/toolkit';

/**
 * !!! connect 使用connect函数连接组件(2种用法)
 * @returns
 */
// 方法一：只使用mapStateToProps方法注入state
const mapStateToProps = (state, ownProps) => ({
  count: state.count
});
function Counter({ count, dispatch }) {
  // dispatch函数是通过prop注入进来
  return (
    <div>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>-</button>
      <span>{count}</span>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>+</button>
    </div>
  );
}
// ! connect方法包装组件时, connect第二个参数为空时，会自动注入dispatch函数
connect()(Counter);
connect(null, null)(Counter);
// or
connect(mapStateToProps /** no second argument */)(Counter);

// 方法二：使用mapStateToProps方法注入state,使用mapStateToProps方法注入dispatch
const mapStateToProps = (state, ownProps) => ({
  count: state.count
});
const increment = createAction('INCREMENT');
const decrement = createAction('DECREMENT');
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    increment: () => dispatch(increment()),
    decrement: () => dispatch(decrement()),
    dispatch // 如果组件需要dispatch, 可以手动注入dispatch函数
  };
};
function mapDispatchToProps(dispatch, ownProps) {
  return {
    dispatch, // 如果组件需要dispatch, 可以手动注入dispatch函数
    ...bindActionCreators({ increment, decrement }, dispatch)
    // bindActionCreators把一个value为不同action creator的对象，转成拥有同名key的对象。同时使用dispatch对每个action creator进行包装，以便可以直接调用它们。
  };
}
function Counter({ count, increment, decrement, dispatch }) {
  // increment，decrement函数是通过mapDispatchToProps注入进来; 直接使用,不需要通过dispatch派发
  // dispatch是通过mapDispatchToProps手动注入进来
  return (
    <div>
      <button onClick={() => increment()}>-</button> // 直接使用increment
      <span>{count}</span>
      <button onClick={() => decrement()}>+</button> // 直接使用decrement
    </div>
  );
}
// ! connect方法包装组件时, connect第二个参数为mapDispatchToProps函数时，会自动注入mapDispatchToProps函数返回值, 比如increment, decrement, dispatch
// ! 通过mapDispatchToProps注入的increment, decrement可以直接使用,不需要通过dispatch派发(必须使用mapDispatchToProps注入才可以直接使用)
connect(null, mapDispatchToProps)(Counter);
connect(mapStateToProps, mapDispatchToProps)(Counter);

/**
 * !!! 使用useSelector()和useDispatch() Hook来替代connect()
 */
// 方法三：
// 把多个state或prop或Selector聚合成一个具有缓存的useSelector
const selectCount = createSelector(
  (state) => state.count,
  (_, newNuber) => newNuber,
  (count, newNuber) => count + newNuber
);
export const CounterComponent = () => {
  // 获取state中的count
  const count = useSelector((state) => state.count);
  // 复杂的用法
  const count = useSelector((state) => selectCount(state, 10));
  const dispatch = useDispatch();
  return (
    <div>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>-</button>
      <span>{count}</span>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>+</button>
    </div>
  );
};
