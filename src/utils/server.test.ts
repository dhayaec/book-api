import { startServer } from '../server';
import { Server } from 'net';
import axios from 'axios';
import { AddressInfo } from 'ws';

let server: Server;
describe('server', () => {
  beforeAll(async () => {
    server = await startServer();
  });

  afterAll(() => {
    server.close();
  });

  it('should start', async () => {
    const { port } = server.address() as AddressInfo;
    const { status } = await axios.get('http://localhost:' + port + '/ping');
    expect(status).toEqual(200);
  });
});
