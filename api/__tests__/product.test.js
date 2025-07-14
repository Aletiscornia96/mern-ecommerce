import app from '../index.js';
import supertest from 'supertest';

describe('GET /products', () => {
    test('debería retornar status 200 y array de productos', async () => {x``
        const res = await request(app).get('/products');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
