const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const PriorityQueue = require('./priorityQueue');
const store = require('./store');
const worker = require('./worker');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.post('/ingest', (req, res) => {
    const { ids, priority } = req.body;
    if (!ids || !Array.isArray(ids) || !priority) {
        return res.status(400).json({ error: 'Invalid input format' });
    }

    const ingestionId = uuidv4();
    store.createIngestion(ingestionId, ids, priority);
    return res.status(200).json({ ingestion_id: ingestionId });
});

app.get('/status/:ingestionId', (req, res) => {
    const ingestionId = req.params.ingestionId;
    const status = store.getIngestionStatus(ingestionId);
    if (!status) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(status);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    worker.start();
});
