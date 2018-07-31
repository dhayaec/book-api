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

faker.seed(Date.now() + 2);
const email = faker.internet.email();
const password = faker.internet.password();

let userId: string;
beforeAll(async () => {
  const user = await User.create({
    email,
    password,
    confirmed: true
  }).save();
  userId = user.id;
});

describe('logout', () => {
  test('multiple sessions', async () => {
    // computer 1
    const sess1 = new TestClient(process.env.TEST_HOST as string);
    // computer 2
    const sess2 = new TestClient(process.env.TEST_HOST as string);

    await sess1.login(email, password);
    await sess2.login(email, password);
    expect(await sess1.me()).toEqual(await sess2.me());
    await sess1.logout();
    expect(await sess1.me()).toEqual(await sess2.me());
  });

  test('single session', async () => {
    const client = new TestClient(process.env.TEST_HOST as string);

    await client.login(email, password);

    const response = await client.me();

    expect(response.data).toEqual({
      me: {
        id: userId,
        email
      }
    });

    await client.logout();

    const response2 = await client.me();

    expect(response2.data.me).toBeNull();
  });
});
