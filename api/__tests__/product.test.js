import mongoose from 'mongoose';
import request from 'supertest';
import app from '../index.js';
import Product from '../models/product.model.js';
import { createAndLoginUser } from '../utils/authTestUtils.js';
// import { ExpressValidator } from 'express-validator';

beforeAll(async () => {
    // Conectamos a la DB de test
    await mongoose.connect(process.env.MONGO_URL_TEST);
});

afterAll(async () => {
    // Cerramos conexión al final
    await mongoose.disconnect();
});

beforeEach(async () => {
    // Sembramos dos productos con los campos requeridos
    await Product.insertMany([
        {
            name: 'Producto A',
            slug: 'producto-a',
            description: 'Descripción A',
            price: 10,
            category: 'Categoría 1',
            size: 'M',
            stock: 5,
            color: 'Rojo',
        },
        {
            name: 'Producto B',
            slug: 'producto-b',
            description: 'Descripción B',
            price: 20,
            category: 'Categoría 2',
            size: 'L',
            stock: 3,
            color: 'Azul',
        },
    ]);
});

afterEach(async () => {
    // Limpiamos la colección
    await Product.deleteMany({});
});

describe('GET /api/products', () => {
    test('debería retornar status 200 y un array de productos', async () => {
        const res = await request(app).get('/api/products');

        // Chequeos básicos
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(2);

        // Verificamos que al menos uno de los productos sembrados esté presente
        const productoA = res.body.find(p => p.slug === 'producto-a');
        expect(productoA).toMatchObject({
            name: 'Producto A',
            price: 10,
            category: 'Categoría 1',
        });

        const productoB = res.body.find(p => p.slug === 'producto-b');
        expect(productoB).toMatchObject({
            name: 'Producto B',
            price: 20,
            category: 'Categoría 2',
        });
    });
});

describe('POST /api/products', () => {
    const newProduct = {
        name: 'Remera Azul',
        description: 'Remera de algodon',
        price: 1000,
        category: 'ropa',
        size: 'XL',
        stock: 4,
        color: 'Negro',
    };

    let adminCookie;

    beforeAll(async () => {
        adminCookie = await createAndLoginUser({
            email: 'admin@test.com',
            password: 'adminPassword123',
            isAdmin: true
        });
    });


    test('deberia registrar un producto exitosamente', async () => {
        const res = await request(app)
            .post('/api/products/')
            .set('Cookie', adminCookie)
            .send(newProduct);

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('Producto creado exitosamente'),
            expect(res.body.product).toMatchObject({
                name: 'Remera Azul',
                description: 'Remera de algodon',
                price: 1000,
                category: 'ropa',
                size: 'XL',
                stock: 4,
                color: 'Negro',
            });
    });

    test('deberia fallar si faltan campos', async () => {
        const res = await request(app)
            .post('/api/products/')
            .set('Cookie', adminCookie)
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('errors')
        expect(Array.isArray(res.body.errors)).toBe(true);
        expect(res.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ message: 'El nombre del producto es obligatorio' }),
                expect.objectContaining({ message: 'El precio es obligatorio' }),
                expect.objectContaining({ message: 'El precio debe ser un número mayor a 0' }),
                expect.objectContaining({ message: 'La categoría es obligatoria' }),
                expect.objectContaining({ message: 'El stock del producto es obligatorio' }),
                expect.objectContaining({ message: 'El stock debe ser un número entero mayor a 0' }),
            ])
        );
        expect(res.body).toHaveProperty('success', false);
    });
});