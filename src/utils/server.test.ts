import { startServer } from '../server';

describe('server', () => {
  it('should start', async () => {
    try {
      await startServer();
    } catch (error) {
      console.log(error);
      expect(error).not.toThrow();
    }
  });
});
