import * as faker from 'faker';
import { Server } from 'net';
import { User } from '../../entity/User';
import { startServer } from '../../server';
import { TestClient } from '../../utils/TestClient';

let server: Server;
beforeAll(async () => {
  server = await startServer();
});

afterAll(async () => {
  await server.close();
});

let userId: string;
faker.seed(Date.now() + 3);
const email = faker.internet.email();
const password = faker.internet.password();

beforeAll(async () => {
  const user = await User.create({
    email,
    password,
    confirmed: true
  }).save();
  userId = user.id;
});

describe('me', () => {
  test('return null if no cookie', async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const response = await client.me();
    expect(response.data.me).toBeNull();
  });

  test('get current user', async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    await client.login(email, password);
    const response = await client.me();

    expect(response.data).toEqual({
      me: {
        id: userId,
        email
      }
    });
  });
});
