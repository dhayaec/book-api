import * as faker from 'faker';
import { Server } from 'net';
import { Connection } from 'typeorm';
import { dbTest } from '../../connection';
import { User } from '../../entity/User';
import { startServer } from '../../server';
import { confirmEmailError, invalidLogin } from '../../utils/messages';
import { TestClient } from '../../utils/TestClient';

faker.seed(Date.now() + 1);
const email = faker.internet.email();
const password = faker.internet.password();

const client = new TestClient(process.env.TEST_HOST as string);

let server: Server;
beforeAll(async () => {
  server = await startServer();
});

afterAll(() => {
  server.close();
});

let conn: Connection;

beforeAll(async () => {
  conn = await dbTest(true);
});

afterAll(async () => {
  await conn.close();
});

const loginExpectError = async (e: string, p: string, errMsg: string) => {
  const response = await client.login(e, p);

  expect(response.data).toEqual({
    login: [
      {
        path: 'email',
        message: errMsg
      }
    ]
  });
};

describe('login', () => {
  it('email not found send back error', async () => {
    await loginExpectError(
      faker.internet.email(),
      faker.internet.password(),
      invalidLogin
    );
  });

  it('email not confirmed', async () => {
    await client.register(email, password);

    await loginExpectError(email, password, confirmEmailError);

    await User.update({ email }, { confirmed: true });

    await loginExpectError(email, faker.internet.password(), invalidLogin);

    const response = await client.login(email, password);

    expect(response.data).toEqual({ login: null });
  });
});
