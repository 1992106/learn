// ! redux-thunk中间件-通过action返回一个函数
// 一个异步Action包含两个（开始/结束）或三个(开始/请求成功/请求失败)同步Action
// store.dispatch方法正常情况下，参数只能是对象，不能是函数
// redux-thunk中间件，改造store.dispatch，使得后者可以接受函数作为参数

const fetchPosts = postTitle => (dispatch, getState) => {
  dispatch({ type: 'requestStart' });
  return fetch(`/some/API/${postTitle}.json`)
    .then(response => response.json())
    .then(json => dispatch({ type: 'receiveEnd', payload: json }));
};
// （1）fetchPosts返回了一个函数，而普通的 Action Creator 默认返回一个对象。
// （2）返回的函数的参数是dispatch和getState这两个 Redux 方法，普通的 Action Creator 的参数是 Action 的内容。
// （3）在返回的函数之中，先发出一个 Action（requestPosts(postTitle)），表示操作开始。
// （4）异步操作结束之后，再发出一个 Action（receivePosts(postTitle, json)），表示操作结束。

// 使用方法一
store.dispatch(fetchPosts('reactjs'));
// 使用方法二
store.dispatch(fetchPosts('reactjs')).then(() => console.log(store.getState()));

// ! redux-promise 中间件
// https://github.com/redux-utilities/redux-promise

// ! redux-saga 中间件
// https://github.com/redux-saga/redux-saga
