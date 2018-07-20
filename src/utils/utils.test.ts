import { add } from '.';

describe('utils', () => {
  describe('add', () => {
    it('should add two numbers', () => {
      expect(add()).toEqual(0);
      expect(add(5, 5)).toEqual(10);
    });
  });
});
