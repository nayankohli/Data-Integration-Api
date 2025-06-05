class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    enqueue(priority, job) {
        this.queue.push({ priority, job, timestamp: Date.now() });
        this.queue.sort((a, b) => a.priority - b.priority || a.timestamp - b.timestamp);
    }

    dequeue() {
        return this.queue.shift();
    }

    isEmpty() {
        return this.queue.length === 0;
    }
}

module.exports = new PriorityQueue();
