import { getOrDefault } from '../getOrDefault';

describe('getOrDefault(:object, :key, :defaultValue?)', () => {
  it('if the key exists, should return the value', () => {
    const obj = { a: 1, b: 2 };
    const expectedValue = 1;
    const actualValue = getOrDefault(obj, 'a', 2);
    expect(actualValue).toBe(expectedValue);
  });

  it("if the key doesn't exist, should return the default value", () => {
    const obj = {};
    const defaultValue = 1;
    const actualValue = getOrDefault(obj, 'a', defaultValue);
    expect(actualValue).toBe(defaultValue);
  });

  it('can return the value mapped to an object path', () => {
    /* Make this object read-only to demonstrate that typings still work */
    const obj = { a: { b: { c: 1 } } } as const;

    const value = getOrDefault(obj, 'a.b.c');

    const expectedValue = 1;
    expect(value).toBe(expectedValue);
  });

  it("if the object path doesn't exist and no default value is specified, should return undefined", () => {
    const obj = { a: { b: { c: 1 } } };

    const value = getOrDefault(obj, 'a.b.d');

    const expectedValue = undefined;
    expect(value).toBe(expectedValue);
  });
});
