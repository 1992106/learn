//每个tick执行逻辑如下：
// ...->上一个宏任务 -> 微任务(下一个宏任务前的所有微任务) -> 渲染任务(requestAnimationFrame) -> 更新渲染(Update Rendering) -> 空闲任务(requestIdleCallback) -> 下一个宏任务 ->...
// https://github.com/behnammodi/polyfill/blob/master/window.polyfill.js

// https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame
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

// https://segmentfault.com/a/1190000041415120
// https://github.com/chenqf/frontEndBlog/issues/15
// https://github.com/chenqf/frontEndBlog/issues/16
function plan() {
  // 插入十万条数据
  const total = 100000;
  // 一次插入的数据
  const once = 20;

  const ul = document.querySelector('ul');
  function loop(curTotal, curIndex) {
    if (curTotal <= 0) {
      return false;
    }

    const pageCount = Math.min(curTotal, once);

    // setTimeout(() => {
    //   const fragment = document.createDocumentFragment();
    //   for (let i = 0; i < pageCount; i++) {
    //     let li = document.createElement('li');
    //     li.innerHTML = curIndex + i;
    //     fragment.appendChild(li);
    //   }
    //   ul.appendChild(fragment);
    //   loop(curTotal - pageCount, curIndex + pageCount);
    // }, 0);

    requestAnimationFrame(() => {
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < pageCount; i++) {
        let li = document.createElement('li');
        li.innerHTML = curIndex + i;
        fragment.appendChild(li);
      }
      ul.appendChild(fragment);
      loop(curTotal - pageCount, curIndex + pageCount);
    }, 0);
  }
  loop(total, 0);
}

// https://mp.weixin.qq.com/s/oVJs4C-AvCK-phAcAQOCdw
// 分组分批分堆函数（一堆分10个）
function averageFn(data, once = 10) {
  let i = 0; // 1. 从第0个开始截取
  let result = []; // 2. 定义结果，结果是二维数组
  // 6. 当索引等于或者大于总长度时，即截取完毕
  while (i < data.length) {
    // 3. 从原始数组的第一项开始遍历
    result.push(data.slice(i, i + once)); // 4. 在原有十万条数据上，一次截取10个用于分堆
    i = i + once; // 5. 这10条数据截取完，再截取下十条数据，以此类推
  }
  return result; // 7. 最后把结果丢出去即可
}
let arr = [];
// setTimeout实现
function plan(data) {
  let twoDArr = averageFn(data);
  // for (let i = 0; i < twoDArr.length; i++) {
  //   // 相当于在很短的时间内创建许多个定时任务去处理
  //   setTimeout(() => {
  //     arr = [...arr, ...twoDArr[i]]; // 赋值渲染
  //   }, 1000 * i); // 17 * i // 注意设定的时间间隔... 17 = 1000 / 60
  // }
  const use2DArrItem = page => {
    if (page > twoDArr.length - 1) {
      console.log('每一项都获取完了');
      return;
    }
    setTimeout(() => {
      arr = [...arr, ...twoDArr[page]];
      page = page + 1;
      use2DArrItem(page);
    }, 0);
  };
  use2DArrItem(0);
}
// requestAnimationFrame实现
function plan(data) {
  // 1. 将大数据量分堆
  let twoDArr = averageFn(data);
  // 2. 定义一个函数，专门用来做赋值渲染（使用二维数组中的每一项）
  const use2DArrItem = page => {
    // 4. 从第一项，取到最后一项
    if (page > twoDArr.length - 1) {
      console.log('每一项都获取完了');
      return;
    }
    // 5. 使用请求动画帧的方式
    requestAnimationFrame(() => {
      // 6. 取出一项，就拼接一项（concat也行）
      arr = [...arr, ...twoDArr[page]];
      // 7. 这一项搞定，继续下一项
      page = page + 1;
      // 8. 直至完毕（递归调用，注意结束条件）
      use2DArrItem(page);
    });
  };
  // 3. 从二维数组中的第一项，第一堆开始获取并渲染（数组的第一项即索引为0）
  use2DArrItem(0);
}

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
