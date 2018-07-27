import { startServer } from './server';
import { Server } from 'net';
import axios from 'axios';

let server: Server;
describe('server', () => {
  beforeAll(async () => {
    server = await startServer();
  });

  afterAll(() => {
    server.close();
  });

  it('should start', async () => {
    const { status, data } = await axios.get(
      'http://localhost:' + 4001 + '/ping'
    );
    expect(status).toEqual(200);
    expect(data).toEqual({ message: 'pong' });
  });
});
