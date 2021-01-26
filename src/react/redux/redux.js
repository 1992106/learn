import { createStore, combineReducers } from 'redux';

const ADD_TODO = 'ADD_TODO';
const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';

// 创建action
function addTodo(text) {
    return {
        type: ADD_TODO,
        payload: text
    };
}
function increment(number) {
    return {
        type: INCREMENT,
        payload: number
    };
}
function decrement(number) {
    return {
        type: DECREMENT,
        payload: number
    };
}
// 创建reducer
function todos(state = [], action) {
    switch (action.type) {
        case ADD_TODO:
            return [...state, action.payload];
        default:
            return state;
    }
}
function counter(state = 0, action) {
    switch (action.type) {
        case INCREMENT:
            return state + action.payload;
        case DECREMENT:
            return state - action.payload;
        default:
            return state;
    }
}
// 合并多个reducer
const reducer = combineReducers({
    todos,
    counter
});
const store = createStore(reducer);
store.dispatch(addTodo('test'));
store.dispatch(increment(1));
store.dispatch(decrement(1));
