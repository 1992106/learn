class RequestLimit {
    constructor(limit) {
        this.limit = Number(limit) || 2;
        this.blockQueue = [];
        this.currentIndex = 0;
    }

    async request(req) {
        if (!req) {
            throw new Error('req is required.');
        }
        if (Object.prototype.toString.call(req) !== '[object Function]') {
            throw new Error('req must be a function');
        }
        if (this.currentIndex >= this.limit) {
            await new Promise((resolve) => this.blockQueue.push(resolve));
        }
        return this._handleRequest(req);
    }

    async _handleRequest(req) {
        this.currentIndex++;
        try {
            return await req();
        } catch (err) {
            return Promise.reject(err);
        } finally {
            this.currentIndex--;
            if (this.blockQueue.length) {
                this.blockQueue[0]();
                this.blockQueue.shift();
            }
        }
    }
}

export default RequestLimit;
