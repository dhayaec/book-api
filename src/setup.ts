import { AddressInfo, Server } from 'net';
import { startServer } from './server';
let app: Server;
export const setup = async () => {
  beforeAll(async () => {
    app = await startServer();
    const { port } = app.address() as AddressInfo;
    process.env.TEST_HOST = `http://127.0.0.1:${port}`;
  });
  afterAll(async () => {
    app.close();
  });
};
