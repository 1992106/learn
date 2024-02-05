// https://mp.weixin.qq.com/s/cMx-j-CA6GuGKBIb-3YW5A

const onReadyFn = () => {
  let readyResolve = null;
  const readyPromise = new Promise(resolve => {
    // 把 resolve 保存起来
    readyResolve = resolve;
  });
  const onReady = cb => {
    readyPromise.then(() => {
      // resolve 执行完才会走 then
      // 才会执行回调函数
      cb();
    });
  };

  return {
    onReady,
    readyResolve
  };
};
