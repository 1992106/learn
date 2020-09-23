// 延迟函数
function sleep(delay) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), delay);
    });
}

// 重试函数
function retry(fn, num, delay) {
    return new Promise((resolve, reject) => {
        function attempt() {
            fn()
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    if (num === 0) {
                        reject(err);
                    } else {
                        // eslint-disable-next-line no-param-reassign
                        num--;
                        setTimeout(() => attempt(), delay);
                    }
                });
        }
        attempt();
    });
}

export { sleep, retry };
