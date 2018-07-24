import { add, multiply } from '.';

describe('utils', () => {
  describe('add', () => {
    it('should add two numbers', () => {
      expect(add()).toEqual(0);
      expect(add(5, 5)).toEqual(10);
    });
  });

  describe('multiply', () => {
    it('should multiply numbers', () => {
      expect(multiply(5, 5)).toEqual(25);
      expect(multiply(5)).toEqual(5);
      expect(multiply(5, 5, 5)).toEqual(125);
    });
  });
});
