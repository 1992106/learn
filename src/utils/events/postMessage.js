// 创景一；iframe
// https://github.com/2018Cool/message-bus/tree/main

// https://blog.csdn.net/weixin_56295520/article/details/131953358

// 在 https://parent.example.com 上【父窗体创建跨域iframe并发送信息】
// 发送消息
iframe.contentWindow.postMessage('Request DOM manipulation', 'https://child.example.com');
// 接收消息
window.addEventListener(
  'message',
  function (event) {
    // Reject all messages except ones from https://child.example.com
    if (event.origin !== 'https://child.example.com') return;

    // Filter success messages
    if (event.data === 'succeeded') {
      // 业务代码 TODO:
    }
  },
  false
);

// 在 https://child.example.com 上【子窗体接收信息并处理】
// 发送消息
window.parent.postMessage({}, 'https://parent.example.com');
// 接收消息
window.addEventListener(
  'message',
  event => {
    // Reject all messages except ones from https://parent.example.com
    if (event.origin !== 'https://parent.example.com') return;

    // 业务代码 TODO:

    // 发送消息【在'message'事件内发送消息】
    event.source.postMessage('succeeded', event.origin);
  },
  false
);

// 场景四：window.open
const myWindow = window.open('b.example.com');
// 在 https://a.example.com 上【a窗体接收信息并处理】
// 发送消息
myWindow.postMessage('Request DOM manipulation', 'https://b.example.com');
// 接收消息
window.addEventListener(
  'message',
  function (event) {
    // Reject all messages except ones from https://b.example.com
    if (event.origin !== 'https://b.example.com') return;

    // Filter success messages
    if (event.data === 'succeeded') {
      // 业务代码 TODO:
    }
  },
  false
);

// 在 https://b.example.com 上【b窗体接收信息并处理】
// 发送消息
window.opener.postMessage({}, 'https://a.example.com');
// 接收消息
window.addEventListener(
  'message',
  event => {
    // Reject all messages except ones from https://a.example.com
    if (event.origin !== 'https://a.example.com') return;

    // 业务代码 TODO:

    // 发送消息【在'message'事件内发送消息】
    event.source.postMessage('succeeded', event.origin);
  },
  false
);

// 创景三：WebWorker
// main.js（主线程）
if (window.Worker) {
  const myWorker = new Worker('/worker.js'); // 创建worker

  myWorker.addEventListener('message', e => {
    // 接收消息
    console.log(e.data); // Greeting from Worker.js，worker线程发送的消息
  });

  // 这种写法也可以
  // myWorker.onmessage = e => { // 接收消息
  //    console.log(e.data);
  // };

  myWorker.postMessage('Greeting from Main.js'); // 向 worker 线程发送消息，对应 worker 线程中的 e.data
}

// worker.js（worker线程）
self.addEventListener('message', e => {
  // 接收到消息
  console.log(e.data); // Greeting from Main.js，主线程发送的消息
  self.postMessage('Greeting from Worker.js'); // 向主线程发送消息
});

// 创景四：SharedWorker
// main.js（主线程）
const mySharedWorker = new SharedWorker('./sharedWorker.js');

mySharedWorker.port.start(); // 开启端口

mySharedWorker.port.postMessage([1, 2]); // 发送消息

mySharedWorker.port.addEventListener('message', msg => {
  console.log(msg.data);
});

// sharedWorker.js（sharedWorker线程）
self.addEventListener('connect', e => {
  const port = e.ports[0];

  port.onmessage = e => {
    const workerResult = `Result: ${e.data[0] * e.data[1]}`;
    port.postMessage(workerResult);
  };
});
