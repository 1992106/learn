class RequestLimit {
    constructor() {
        this.blockQueue = [];
        this.currentIndex = 0;
    }

    async limit(fn, num) {
        if (!fn) {
            throw new Error('fn is required.');
        }
        if (Object.prototype.toString.call(fn) !== '[object Function]') {
            throw new Error('fn must be a function.');
        }
        if (this.currentIndex >= (num || 5)) {
            await new Promise((resolve) => this.blockQueue.push(resolve)); // 在 request 里判断如果当前请求数大于设置的 limit 程序进入阻塞状态
        }
        return this._handleLimit(fn); // 在 request 请求里如果当前请求数小于设置的 limit，处理传入的请求
    }

    async _handleLimit(fn) {
        this.currentIndex++; // 在处理传入的请求开始时要对当前请求数做加 1 操作
        try {
            return await fn();
        } catch (err) {
            return Promise.reject(err);
        } finally {
            this.currentIndex--; // 在处理传入的请求完成时要对当前请求数做减 1 操作
            if (this.blockQueue.length) {
                this.blockQueue[0](); // 在处理传入的请求完成时判断如果阻塞队列有值，将最先进入到阻塞队列的请求从 Pending 变为 Fulfilled 这样就会开始处理传入的请求
                this.blockQueue.shift();
            }
        }
    }
}

export default RequestLimit;
