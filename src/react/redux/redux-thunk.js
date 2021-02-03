// （1）异步的Action Creator返回了一个函数，而普通的Action Creator默认返回一个对象。

// （2）异步的Action Creator的参数是派发里面同步Action的参数，它返回的函数的参数是dispatch和getState这两个 Redux 方法。普通的Action Creator的参数是 Action 的内容。

// （3）在返回的函数之中，先发出一个 同步Action，表示操作开始。

// （4）异步操作结束之后，再发出一个 同步Action，表示操作结束。

// 所以：一个异步Action包含两个（开始/结束）或三个(开始/请求成功/请求失败)同步Action
// store.dispatch方法正常情况下，参数只能是对象，不能是函数
// redux-thunk中间件，改造store.dispatch，使得后者可以接受函数作为参数
