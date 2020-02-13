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
    const obj = { a: { b: { c: 1 } } };

    const value = getOrDefault(obj, 'a.b.c');

    const expectedValue = 1;
    expect(value).toBe(expectedValue);
  });

  it('given the object only, should return a new function that accepts the remaining parameters', () => {
    const obj = { a: { b: { c: 1 } } };
    const objGetOrDefault = getOrDefault(obj);
    const defaultValue = 2;

    const valueFromPath = objGetOrDefault('a.b.c');
    const valueFromDefault = objGetOrDefault('a.b.d', defaultValue);

    const expectedValue = 1;
    expect(valueFromPath).toBe(expectedValue);
    expect(valueFromDefault).toBe(defaultValue);
  });
});
