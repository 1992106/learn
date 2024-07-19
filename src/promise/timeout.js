import { sleep } from './utils';

// 请求超时
function timeoutPromise(requestFn, delay) {
  return Promise.race([requestFn(), sleep(delay)]);
}

// 自定义实现Promise.race
function timeoutPromise(requestFn, delay) {
  const promises = [requestFn(), sleep(delay)];
  return new Promise((resolve, reject) => {
    for (const promise of promises) {
      promise.then(res => resolve(res)).catch(error => reject(error));
    }
  });
}

function timeout(delay, message) {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error(message)), delay);
  });
}

function fetchWithTimeout(url, timeoutDelay) {
  const timeoutPromise = timeout(timeoutDelay, '请求超时');
  const fetchPromise = fetch(url);

  return Promise.race([timeoutPromise, fetchPromise])
    .then(response => {
      // 如果是fetchPromise获得的结果，则继续处理response
      return response.json();
    })
    .catch(error => {
      // 如果是timeoutPromise获得的结果，则抛出错误
      throw error;
    });
}

// 使用示例
fetchWithTimeout('https://api.example.com/data', 3000)
  .then(data => console.log(data))
  .catch(error => console.error(error.message));
