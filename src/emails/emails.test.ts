import { renderEmail } from './emails';

describe('email', () => {
  describe('renderEmail', () => {
    it('should correctly render message based on arguments', () => {
      const random = Math.random().toString();
      const email = renderEmail({
        subject: random,
        message: 'message' + random
      });
      expect(email).toContain(random);
      expect(email).toContain('message' + random);
    });
  });
});
