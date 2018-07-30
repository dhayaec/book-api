import axios from 'axios';
import { Server } from 'net';
import { startServer } from './server';

let server: Server;
beforeAll(async () => {
  server = await startServer();
});

afterAll(() => {
  server.close();
});

describe('server', () => {
  it('should start', async () => {
    const { status, data } = await axios.get(
      'http://localhost:' + 4001 + '/ping'
    );
    expect(status).toEqual(200);
    expect(data).toEqual({ message: 'pong' });
  });
});
