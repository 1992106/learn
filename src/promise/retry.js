// 重试函数
const retry = (fn, delay, times) => {
  return new Promise((resolve, reject) => {
    const attempt = () => {
      fn().then(
        res => {
          resolve(res);
        },
        err => {
          if (times === 0) {
            reject(err);
          } else {
            times--;
            setTimeout(attempt, delay);
          }
        }
      );
    };
    attempt();
  });
};

// 请求失败时，重新调用
export async function retry(
  fn,
  count = 3, // 重试次数
  timeout = 5000 // 重试的延迟
) {
  let tryCount = 1;
  let timeId

  const exec = async () => {
    const res = await fn().catch((err) => {
      if (tryCount > count) {
        throw err;
      } else {
        return null;
      }
    });
    if (timeId) clearTimeout(timeId);
    if (res) {
      return res;
    } else {
      if (timeout) {
        await new Promise((resolve) => {
          timeId = setTimeout(() => {
            resolve();
          }, timeout);
        });
      }
      // 递归 + 尾调用
      return exec();
    }
  };
  return exec();
}
