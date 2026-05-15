import { describe, it, expect } from 'vitest';
import { toKebabCase, isValidPackageName, validateAndNormalizeName } from '../src/utils/names';

describe('toKebabCase', () => {
  it('converts spaces to hyphens', () => {
    expect(toKebabCase('My Cool App')).toBe('my-cool-app');
  });

  it('lowercases the string', () => {
    expect(toKebabCase('MyApp')).toBe('myapp');
  });

  it('collapses multiple spaces', () => {
    expect(toKebabCase('my  app')).toBe('my-app');
  });

  it('strips special characters', () => {
    expect(toKebabCase('my@app!')).toBe('myapp');
  });

  it('trims leading and trailing whitespace', () => {
    expect(toKebabCase('  my-app  ')).toBe('my-app');
  });

  it('collapses consecutive hyphens', () => {
    expect(toKebabCase('my--app')).toBe('my-app');
  });

  it('returns empty string for blank input', () => {
    expect(toKebabCase('   ')).toBe('');
  });
});

describe('isValidPackageName', () => {
  it('accepts a simple kebab-case name', () => {
    expect(isValidPackageName('my-app')).toBe(true);
  });

  it('accepts a name with numbers', () => {
    expect(isValidPackageName('app2')).toBe(true);
  });

  it('rejects uppercase', () => {
    expect(isValidPackageName('MyApp')).toBe(false);
  });

  it('rejects names starting with a dot', () => {
    expect(isValidPackageName('.hidden')).toBe(false);
  });

  it('rejects names starting with an underscore', () => {
    expect(isValidPackageName('_private')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidPackageName('')).toBe(false);
  });

  it('rejects names longer than 214 characters', () => {
    expect(isValidPackageName('a'.repeat(215))).toBe(false);
  });
});

describe('validateAndNormalizeName', () => {
  it('returns valid: true for a clean name', () => {
    const result = validateAndNormalizeName('my-app');
    expect(result.valid).toBe(true);
    expect(result.normalized).toBe('my-app');
    expect(result.warnings).toHaveLength(0);
  });

  it('normalizes a name with spaces and adds a warning', () => {
    const result = validateAndNormalizeName('My Cool App');
    expect(result.valid).toBe(true);
    expect(result.normalized).toBe('my-cool-app');
    expect(result.warnings.some(w => w.includes('normalized'))).toBe(true);
  });

  it('returns valid: false for empty input', () => {
    const result = validateAndNormalizeName('');
    expect(result.valid).toBe(false);
    expect(result.normalized).toBe('');
  });

  it('returns valid: false for whitespace-only input', () => {
    const result = validateAndNormalizeName('   ');
    expect(result.valid).toBe(false);
  });
});
