const priorityQueue = require('./priorityQueue');
const store = require('./store');

function processBatch({ ingestion_id, batch }) {
    store.updateBatchStatus(ingestion_id, batch.batch_id, 'triggered');

    setTimeout(() => {
        store.updateBatchStatus(ingestion_id, batch.batch_id, 'completed');
        console.log(`Processed batch: ${batch.batch_id}`);
    }, 3000);
}

function start() {
    setInterval(() => {
        if (!priorityQueue.isEmpty()) {
            const { job } = priorityQueue.dequeue();
            processBatch(job);
        }
    }, 5000); 
}

module.exports = { start };
