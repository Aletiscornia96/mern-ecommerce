import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';
import User from '../models/user.model.js';

beforeAll(async () => {
  // Conectarse a la base de datos de pruebas
  await mongoose.connect(process.env.MONGO_URL_TEST); // usá una URI diferente si tenés entorno de test
});

afterAll(async () => {
  // Cerrar conexión después de las pruebas
  await mongoose.connection.close();
});

describe('POST /api/auth/signin', () => {
  const testUser = {
    username: 'testuser',
    email: 'testuser@test.com',
    password: 'claveSegura123',
  };

  beforeEach(async () => {
    // Crear usuario de prueba (registrarlo manualmente usando el controller)
    const hashedPassword = await testUser.password; // en producción, usá bcryptjs para encriptar
    await User.create({
      username: testUser.username,
      email: testUser.email,
      password: hashedPassword,
    });
  });

  afterEach(async () => {
    // Limpiar usuarios después de cada test
    await User.deleteMany({});
  });

  test('debería iniciar sesión exitosamente con credenciales válidas', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', testUser.email);
    expect(res.headers['set-cookie']).toBeDefined(); // Verifica que la cookie se haya establecido
  });

  test('debería fallar si el email está mal', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email: 'noexiste@test.com', password: testUser.password });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toContain('Usuario no encontrado');
  });

  test('debería fallar si la contraseña es incorrecta', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email: testUser.email, password: 'passwordIncorrecta' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('Contrasena invalida');
  });

  test('debería fallar si faltan campos en la petición', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email: '', password: '' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('Todos los campos son requeridos');
  });
});
