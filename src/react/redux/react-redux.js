import { bindActionCreators } from 'redux';
import { connect, useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { createAction } from '@reduxjs/toolkit';

/**
 * mapStateToProps
 * @returns
 */
const mapStateToProps = (state, ownProps) => ({
    count: state.count
});

/**
 * mapDispatchToProps
 * @returns
 */
// 方法一：
function Counter({ count, dispatch }) {
    // dispatch函数是通过prop注入进来
    return (
        <div>
            <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
            <span>{count}</span>
            <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
        </div>
    );
}
// ! connect第二个参数为空时，会自动注入dispatch函数
// connect方法包装组件
connect()(Counter);
// which is equivalent with
connect(null, null)(Counter);
// or
connect(mapStateToProps /** no second argument */)(Counter);

// 方法二：
function Counter({ count, dispatch }) {
    // dispatch函数是通过prop注入进来
    return (
        <div>
            <button onClick={() => dispatch(increment())}>-</button>
            <span>{count}</span>
            <button onClick={() => dispatch(decrement())}>+</button>
        </div>
    );
}
function Counter({ count, increment, decrement }) {
    // increment，decrement函数是通过mapDispatchToProps注入进来
    return (
        <div>
            <button onClick={() => increment()}>-</button>
            <span>{count}</span>
            <button onClick={() => decrement()}>+</button>
        </div>
    );
}

const increment = createAction('INCREMENT');
const decrement = createAction('DECREMENT');
const mapDispatchToProps = (dispatch, ownProps) => {
    // ! 手动注入dispatch函数
    return {
        increment: () => dispatch(increment()),
        decrement: () => dispatch(decrement()),
        dispatch
    };
};
function mapDispatchToProps(dispatch, ownProps) {
    return {
        dispatch,
        ...bindActionCreators({ increment, decrement }, dispatch)
    };
}
// connect方法包装组件
connect(null, mapDispatchToProps)(Counter);
connect(mapStateToProps, mapDispatchToProps)(Counter);

// 方法三：
// 把多个state或prop聚合成一个具有缓存的useSelector
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
    return <div>{count}</div>;
};
