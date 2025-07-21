import mongoose from 'mongoose';
import request from 'supertest';
import app from '../index.js';
import User from '../models/user.model.js';
import Category from '../models/category.model.js';
import { createAndLoginUser } from '../utils/authTestUtils.js';

let adminCookie;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL_TEST);
  await User.deleteMany({});
  // Crea y hace log de admin
  adminCookie = await createAndLoginUser({
    email: 'admin@test.com',
    password: 'adminPassword123',
    isAdmin: true
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  // Limpiamos categorías antes de cada test
  await Category.deleteMany({});
});

describe('POST /api/categories', () => {
  const newCategory = {
    name: 'Remeras',
    description: 'Categoría de remeras para hombre y mujer'
  };

  test('debería crear una categoría exitosamente (201)', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Cookie', adminCookie)
      .send(newCategory);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Categoría creada exitosamente');
    expect(res.body.category).toMatchObject(newCategory);
    expect(res.body.category).toHaveProperty('_id');
  });

  test('debería fallar si falta el nombre (400)', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Cookie', adminCookie)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: 'El nombre de la categoría es obligatorio y debe tener al menos 3 caracteres'
        })
      ])
    );
  });

  test('debería fallar si el nombre es muy corto (400)', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Cookie', adminCookie)
      .send({ name: 'ab' });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors[0].message).toMatch(/obligatorio y debe tener al menos 3 caracteres/i);
  });

  test('debería fallar por nombre duplicado (409)', async () => {
    // Insertamos una categoría previa
    await Category.create({ name: newCategory.name, description: '' });

    const res = await request(app)
      .post('/api/categories')
      .set('Cookie', adminCookie)
      .send(newCategory);

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.errors[0].message).toBe('Ya existe una categoría con ese nombre');
  });

  test('debería retornar 403 si no es admin', async () => {
    const res = await request(app)
      .post('/api/categories')
      .send(newCategory);

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/acceso solo para administradores/i);
  });
});

