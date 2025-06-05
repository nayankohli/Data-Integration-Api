const request = require('supertest');
const app = require('./index');

describe('Data Ingestion API', () => {
    it('should ingest data and return an ID', async () => {
        const res = await request(app)
            .post('/ingest')
            .send({ ids: [1, 2, 3, 4, 5], priority: 'MEDIUM' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('ingestion_id');
    });

    it('should return status for a valid ingestion_id', async () => {
        const ingestRes = await request(app)
            .post('/ingest')
            .send({ ids: [6, 7, 8], priority: 'HIGH' });

        const ingestionId = ingestRes.body.ingestion_id;
        const statusRes = await request(app).get(`/status/${ingestionId}`);
        expect(statusRes.statusCode).toBe(200);
        expect(statusRes.body).toHaveProperty('status');
    });
});
