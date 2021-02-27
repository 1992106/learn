import { createAction, createReducer, configureStore, createSlice } from '@reduxjs/toolkit';
import { createStore, combineReducers } from 'redux';

// 例子一
//  创建action（以下用法效果一样；第二个参数用来自定义payload值）
const addTodo = createAction('ADD_TODO'); // 语法糖
const addTodo = createAction('ADD_TODO', function prepare(value) {
  return { payload: value };
}); // 完整写法
// 创建reducer
const todos = createReducer([], {
  [addTodo]: (state, action) => {
    const todo = action.payload;
    return [...state, todo];
  }
});
const todos = createReducer([], (builder) => {
  builder.addCase(addTodo, (state, action) => {
    const todo = action.payload;
    return [...state, todo];
  });
});

// 例子二
// 创建action
const increment = createAction('INCREMENT');
const decrement = createAction('DECREMENT');
// 创建reducer
const counter = createReducer(0, {
  [increment]: (state, action) => state + action.payload,
  [decrement]: (state, action) => state - action.payload
});
const counter = createReducer(0, (builder) => {
  builder
    .addCase(increment, (state, action) => {
      return state + action.payload;
    })
    .addCase(decrement, (state, action) => {
      return state - action.payload;
    });
});

// ! configureStore内部会自动调用combineReducers
const store = configureStore({
  reducer: {
    todos,
    counter
  }
});
store.dispatch(addTodo('test'));
store.dispatch(increment(1));
store.dispatch(decrement(1));

// createSlice创建
// !（第一个用法是第二个用法的语法糖，和下面用法效果一样；第二个参数用来自定义payload值）
// 例子一
const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo(state, action) {
      state.push(action.preload);
    }
  }
});
const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: {
      reducer: (state, action) => {
        state.push(action.payload);
      },
      prepare: (value) => {
        return { payload: value };
      }
    }
  }
});
// 例子二
const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment: (state, action) => state + action.preload,
    decrement: (state, action) => state - action.payload
  }
});
const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment(state, action) {
      return state + action.payload;
    },
    decrement(state, action) {
      return state - action.payload;
    }
  }
});
// exports const { increment, decrement } = counterSlice.actions
// ! 合并多个reducer
const reducer = combineReducers({
  todos: todosSlice.reducer,
  counter: counterSlice.reducer
});
const store = createStore(reducer);
store.dispatch(addTodo('test'));
store.dispatch(increment(1));
store.dispatch(decrement(1));
