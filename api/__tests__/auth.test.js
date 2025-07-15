// /api/__tests__/auth.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import app from '../index.js';
import User from '../models/user.model.js';

const testUser = {
  username: 'testuser',
  email: 'testuser@test.com',
  password: 'claveSegura123',
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL_TEST);
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  const hashedPassword = bcrypt.hashSync(testUser.password, 10);
  await User.create({
    username: testUser.username,
    email: testUser.email,
    password: hashedPassword,
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('POST /api/auth/signin', () => {
  test('debería iniciar sesión exitosamente con credenciales válidas', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', testUser.email);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  test('debería fallar si el email está mal', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email: 'noexiste@test.com', password: testUser.password });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', expect.stringContaining('Usuario no encontrado'));
  });

  test('debería fallar si la contraseña es incorrecta', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email: testUser.email, password: 'passwordIncorrecta' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', expect.stringContaining('Contrasena invalida'));
  });

  test('debería fallar si faltan campos en la petición', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({});  // body vacío

    expect(res.statusCode).toBe(400);

    // Verificamos que venga el array de errores
    expect(res.body).toHaveProperty('errors');
    expect(Array.isArray(res.body.errors)).toBe(true);

    // Y que contenga los mensajes que tu middleware valida
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Debe ser un email válido' }),
        expect.objectContaining({ message: 'La contraseña es obligatoria' }),
      ])
    );

    // Y opcionalmente, que success sea false
    expect(res.body).toHaveProperty('success', false);
  });


});