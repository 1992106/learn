//每个tick执行逻辑如下：
// ...->上一个宏任务 -> 微任务(下一个宏任务前的所有微任务) -> 渲染任务(requestAnimationFrame) -> 更新渲染(Update Rendering) -> 空闲任务(requestIdleCallback) -> 下一个宏任务 ->...
// https://github.com/behnammodi/polyfill/blob/master/window.polyfill.js

// https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback
// https://developer.mozilla.org/zh-CN/docs/Web/API/Background_Tasks_API#example
window.requestIdleCallback =
  window.requestIdleCallback ||
  function (handler) {
    const startTime = Date.now();

    return setTimeout(function () {
      handler({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - startTime));
        }
      });
    }, 1);
  };

window.cancelIdleCallback =
  window.cancelIdleCallback ||
  function (id) {
    clearTimeout(id);
  };

// 每个任务都超过一帧的时间 16ms, 需要把控制权交给浏览器
let taskQueue = [
  () => {
    console.log('task1 start');
    sleep(20);
    console.log('task1 end');
  },
  () => {
    console.log('task2 start');
    sleep(20);
    console.log('task2 end');
  },
  () => {
    console.log('task3 start');
    sleep(20);
    console.log('task3 end');
  }
];

let sleep = time => {
  let flag = true;
  const now = Date.now();
  while (flag) {
    if (Date.now() - now > time) {
      flag = false;
    }
  }
};

const workLoop = deadline => {
  console.log(`此帧的剩余时间 --> ${deadline.timeRemaining()} ms`);
  // 此帧剩余时间大于0
  while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && taskQueue.length > 0) {
    let task = taskQueue.shift();
    task();
    console.log(`还剩时间: ${deadline.timeRemaining()} ms`);
  }
  // 否则应该放弃执行任务控制权，把执行权交还给浏览器。
  if (taskQueue.length) {
    // 申请下一个时间片
    requestIdleCallback(workLoop);
  }
};

// 注册任务，告诉浏览器如果每一帧存在空闲时间，就可以执行注册的这个任务
requestIdleCallback(workLoop);
