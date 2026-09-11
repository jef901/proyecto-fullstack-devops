const request = require('supertest');
const app = require('./server');

test('Deberia responder con codigo 200 y el mensaje de estado en la raiz', async () => {
  const res = await request(app).get('/');
  expect(res.statusCode).toEqual(200);
  expect(res.body).toHaveProperty('mensaje');
  expect(res.body.mensaje).toBe('API de DevOps con PostgreSQL activa!');
});
