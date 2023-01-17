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

// https://blog.csdn.net/weixin_46837985/article/details/126258582
// 1、大量数据渲染
// 比如对十万条数据进行渲染，主要由以下几种方法：
// requestAnimationFrame用法
//需要插入的容器
let ul = document.getElementById('container');
// 插入十万条数据
let total = 100000;
// 一次插入 20 条
let once = 20;
//总页数
let page = total / once;
//每条记录的索引
let index = 0;
//循环加载数据
function loop(curTotal, curIndex) {
  if (curTotal <= 0) {
    return false;
  }
  //每页多少条
  let pageCount = Math.min(curTotal, once);
  window.requestAnimationFrame(function () {
    for (let i = 0; i < pageCount; i++) {
      let li = document.createElement('li');
      li.innerText = curIndex + i + ' : ' + ~~(Math.random() * total);
      ul.appendChild(li);
    }
    loop(curTotal - pageCount, curIndex + pageCount);
  });
}
loop(total, index);

//需要插入的容器
let ul = document.getElementById('container');
// 插入十万条数据
let total = 100000;
// 一次插入 20 条
let once = 20;
//总页数
let page = total / once;
//每条记录的索引
let index = 0;
//循环加载数据
function loop(curTotal, curIndex) {
  if (curTotal <= 0) {
    return false;
  }
  //每页多少条
  let pageCount = Math.min(curTotal, once);
  setTimeout(() => {
    for (let i = 0; i < pageCount; i++) {
      let li = document.createElement('li');
      li.innerText = curIndex + i + ' : ' + ~~(Math.random() * total);
      ul.appendChild(li);
    }
    loop(curTotal - pageCount, curIndex + pageCount);
  }, 0);
}
loop(total, index);

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
