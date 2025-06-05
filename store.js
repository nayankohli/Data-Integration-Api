const { v4: uuidv4 } = require('uuid');

const PRIORITY_MAP = { HIGH: 1, MEDIUM: 2, LOW: 3 };
const store = {
    ingestions: {},
    createIngestion(id, ids, priority) {
        const batches = [];
        for (let i = 0; i < ids.length; i += 3) {
            batches.push({
                batch_id: uuidv4(),
                ids: ids.slice(i, i + 3),
                status: 'yet_to_start'
            });
        }
        this.ingestions[id] = { ingestion_id: id, status: 'yet_to_start', priority, batches, created_at: Date.now() };

        const priorityLevel = PRIORITY_MAP[priority];
        batches.forEach((batch) => {
            require('./priorityQueue').enqueue(priorityLevel, { ingestion_id: id, batch });
        });
    },

    getIngestionStatus(id) {
        const ingestion = this.ingestions[id];
        if (!ingestion) return null;

        const statuses = ingestion.batches.map(b => b.status);
        if (statuses.every(s => s === 'yet_to_start')) ingestion.status = 'yet_to_start';
        else if (statuses.every(s => s === 'completed')) ingestion.status = 'completed';
        else ingestion.status = 'triggered';

        return ingestion;
    },

    updateBatchStatus(ingestion_id, batch_id, status) {
        const ingestion = this.ingestions[ingestion_id];
        if (!ingestion) return;

        const batch = ingestion.batches.find(b => b.batch_id === batch_id);
        if (batch) batch.status = status;
    }
};

module.exports = store;
