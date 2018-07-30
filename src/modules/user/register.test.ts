import * as faker from 'faker';
import { Server } from 'net';
import { Connection } from 'typeorm';
import { dbTest } from '../../connection';
import { User } from '../../entity/User';
import { startServer } from '../../server';
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough
} from '../../utils/messages';
import { TestClient } from '../../utils/TestClient';

let server: Server;
beforeAll(async () => {
  server = await startServer();
});

afterAll(async () => {
  await server.close();
});

faker.seed(Date.now() + 5);
const email = faker.internet.email();
const password = faker.internet.password();

const client = new TestClient(process.env.TEST_HOST as string);

let conn: Connection;
beforeAll(async () => {
  conn = await dbTest();
});
afterAll(async () => {
  await conn.close();
});

describe('Register user', async () => {
  it('check for duplicate emails', async () => {
    // make sure we can register a user
    const response = await client.register(email, password);
    expect(response.data).toEqual({ register: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    const response2 = await client.register(email, password);
    expect(response2.data.register).toHaveLength(1);
    expect(response2.data.register[0]).toEqual({
      path: 'email',
      message: duplicateEmail
    });
  });

  it('check bad email', async () => {
    const response3 = await client.register('b', password);
    expect(response3.data).toEqual({
      register: [
        {
          path: 'email',
          message: emailNotLongEnough
        },
        {
          path: 'email',
          message: invalidEmail
        }
      ]
    });
  });

  it('check bad password', async () => {
    // catch bad password
    const response4 = await client.register(faker.internet.email(), 'ad');
    expect(response4.data).toEqual({
      register: [
        {
          path: 'password',
          message: passwordNotLongEnough
        }
      ]
    });
  });

  it('check bad password and bad email', async () => {
    const response5 = await client.register('df', 'ad');
    expect(response5.data).toEqual({
      register: [
        {
          path: 'email',
          message: emailNotLongEnough
        },
        {
          path: 'email',
          message: invalidEmail
        },
        {
          path: 'password',
          message: passwordNotLongEnough
        }
      ]
    });
  });
});
