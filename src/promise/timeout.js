import { sleep } from "./utils";

// 请求超时
function timeoutPromise(requestFn,timeout){
  return Promise.race([requestFn,sleep(timeout)]);
}

// 自定义实现Promise.race
function timeoutPromise(requestFn,timeout){
  const promises = [requestFn(),sleep(timeout)];
  return new Promise((resolve,reject) => {
    for(const promise of promises){
      promise.then(res => resolve(res)).catch(error => reject(error));
    }
  })
}
