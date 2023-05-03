//每个tick执行逻辑如下：
// ...->上一个宏任务 -> 微任务(下一个宏任务前的所有微任务) -> 渲染任务(requestAnimationFrame) -> 下一个宏任务 ->...

let lastTime = 0;
window.requestAnimationFrame =
  window.requestAnimationFrame ||
  function (callback) {
    const startTime = Date.now();
    const timestamp = Math.max(0, 1000 / 60 - (startTime - lastTime));

    lastTime = startTime + timestamp;

    return setTimeout(function () {
      callback(lastTime);
    }, timestamp);
  };

window.cancelAnimationFrame =
  window.cancelAnimationFrame ||
  function (id) {
    clearTimeout(id);
  };

// 1、大量数据渲染
// 比如对十万条数据进行渲染，主要由以下几种方法：
// requestAnimationFrame用法
// 插入十万条数据
const total = 100000;
// 一次插入的数据
const once = 20;
// 插入数据需要的次数
const loopCount = Math.ceil(total / once);
let countOfRender = 0;
const ul = document.querySelector('ul');
// 添加数据的方法
function add() {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < once; i++) {
    const li = document.createElement('li');
    li.innerText = Math.floor(Math.random() * total);
    fragment.appendChild(li);
  }
  ul.appendChild(fragment);
  countOfRender += 1;
  loop();
}

function loop() {
  if (countOfRender < loopCount) {
    // requestAnimationFrame
    window.requestAnimationFrame(add);
    // setTimeout(add, 0);
  }
}
loop();

// https://blog.csdn.net/weixin_46837985/article/details/126258582
// 2、监听 scroll 函数
// 页面滚动事件（scroll）的监听函数，就很适合用这个 api，推迟到下一次重新渲染。

$(window).on('scroll', function () {
  window.requestAnimationFrame(scrollHandler);
});

// 平滑滚动到页面顶部
const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  }
};

scrollToTop();
