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

// 插入十万条数据
const total = 100000;
// 一次插入20条，如果觉得性能不好就减少
const once = 20;
// 渲染数据总共需要几次
const loopCount = total / once;
let countOfRender = 0;
let ul = document.querySelector('ul');

function render() {
  // 优化性能，插入不会造成回流
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < once; i++) {
    const li = document.createElement('li');
    li.innerText = String(Math.floor(Math.random() * total));
    fragment.appendChild(li);
  }
  ul.appendChild(fragment);
  countOfRender += 1;
  if (countOfRender < loopCount) {
    window.requestAnimationFrame(render);
  }
}

window.requestAnimationFrame(render);
