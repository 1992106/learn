// http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_two_async_operations.html
// （1）异步的Action Creator返回了一个函数，而普通的Action Creator默认返回一个对象。

// （2）异步的Action Creator的参数是派发里面同步Action的参数，它返回函数的参数是Redux中dispatch和getState两个方法。普通的Action Creator的参数是Action的内容。

// （3）在返回的函数之中，先发出一个 同步Action，表示操作开始。

// （4）异步操作结束之后，再发出一个 同步Action，表示操作结束。

// 所以：一个异步Action包含两个（开始/结束）或三个(开始/请求成功/请求失败)同步Action
// store.dispatch方法正常情况下，参数只能是对象，不能是函数
// redux-thunk中间件，改造store.dispatch，使得后者可以接受函数作为参数

// 创建异步action（createAsyncThunk写法）
const getRoutes = createAsyncThunk('routes/getRoutes', async (params, { dispatch, getState }) => {
  const { data } = await request({
    query: GET_ROUTERS
  });
  return data?.routers || [];
});
dispatch(getRoutes());

// 创建异步action（原始写法）
const getRoutes = params => async (dispatch, getState) => {
  dispatch({ type: 'getRoutes.pending', payload: '' });
  try {
    const { data } = await request({
      query: GET_ROUTERS
    });
    dispatch({ type: 'getRouters.fulfilled', payload: data?.routers || [] });
  } catch (e) {
    dispatch({ type: 'getRoutes.rejected', payload: '' });
  }
};
dispatch(getRoutes());

// redux-thunk中间件
const fetchPosts = postTitle => (dispatch, getState) => {
  dispatch(requestPosts(postTitle));
  return fetch(`/some/API/${postTitle}.json`)
    .then(response => response.json())
    .then(json => dispatch(receivePosts(postTitle, json)));
};

// 使用方法一
store.dispatch(fetchPosts('reactjs'));
// 使用方法二
store.dispatch(fetchPosts('reactjs')).then(() => console.log(store.getState()));

// redux-promise 中间件
const fetchPosts = (dispatch, postTitle) =>
  new Promise(function (resolve, reject) {
    dispatch(requestPosts(postTitle));
    return fetch(`/some/API/${postTitle}.json`).then(response => ({
      type: 'FETCH_POSTS',
      payload: response.json()
    }));
  });
