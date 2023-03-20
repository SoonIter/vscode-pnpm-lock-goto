import { describe, expect, it } from 'vitest';
import { isDependenciesLine, isExactDependenciesLine, isLockfile, parseDepLine } from './reg';

describe('reg', () => {
  it('isLockfile', () => {
    isLockfile('pnpm-lock.yaml');
    isLockfile('pnpm-lock.main.yaml');
    isLockfile('pnpm-lock.a!b!c.yaml');
  });
  it('isExactDependenciesLine', () => {
    expect(isExactDependenciesLine('  debug: 4.3.4  ')).toBe(true);
    expect(isExactDependenciesLine('  debug: ~4.3.4  ')).toBe(false);
    expect(isExactDependenciesLine('  debug: ^4.3.4  ')).toBe(false);
    expect(isExactDependenciesLine(' \'@commitlint/config-conventional\': 17.4.4 ')).toBe(true);
    expect(isExactDependenciesLine(' \'@commitlint/config-conventional\': ^17.4.4 ')).toBe(false);
    expect(isExactDependenciesLine(' \'@commitlint/config-conventional\': ~17.4.4 ')).toBe(false);
  });
  it('isDependenciesLine', () => {
    expect(isDependenciesLine('  debug: 4.3.4  ')).toBe(true);
    expect(isDependenciesLine('  debug: ~4.3.4  ')).toBe(true);
    expect(isDependenciesLine('  debug: ^4.3.4  ')).toBe(true);
    expect(isDependenciesLine(' \'@commitlint/config-conventional\': 17.4.4 ')).toBe(true);
    expect(isDependenciesLine(' \'@commitlint/config-conventional\': ^17.4.4 ')).toBe(true);
    expect(isDependenciesLine(' \'@commitlint/config-conventional\': ~17.4.4 ')).toBe(true);
  });
  it('parseDepLine', () => {
    expect(parseDepLine('  debug: 4.3.4  ')).toMatchInlineSnapshot(`
      {
        "name": "debug",
        "version": "4.3.4",
      }
    `);
    expect(parseDepLine('  debug: ^4.3.4  ')).toMatchInlineSnapshot(`
      {
        "name": "debug",
        "version": "^4.3.4",
      }
    `);
    expect(parseDepLine('  debug: ~4.3.4  ')).toMatchInlineSnapshot(`
      {
        "name": "debug",
        "version": "~4.3.4",
      }
    `);
    expect(parseDepLine('  js-yaml: 4.1.0  ')).toMatchInlineSnapshot(`
      {
        "name": "js-yaml",
        "version": "4.1.0",
      }
    `);
    expect(parseDepLine('  js-yaml: ^4.1.0  ')).toMatchInlineSnapshot(`
      {
        "name": "js-yaml",
        "version": "^4.1.0",
      }
    `);
    expect(parseDepLine('  js-yaml: ~4.1.0  ')).toMatchInlineSnapshot(`
      {
        "name": "js-yaml",
        "version": "~4.1.0",
      }
    `);
    expect(parseDepLine(' \'@commitlint/config-conventional\': 17.4.4 ')).toMatchInlineSnapshot(`
      {
        "name": "@commitlint/config-conventional",
        "version": "17.4.4",
      }
    `);
    expect(parseDepLine(' \'@commitlint/config-conventional\': ^17.4.4 ')).toMatchInlineSnapshot(`
      {
        "name": "@commitlint/config-conventional",
        "version": "^17.4.4",
      }
    `);
    expect(parseDepLine(' \'@commitlint/config-conventional\': ~17.4.4 ')).toMatchInlineSnapshot(`
      {
        "name": "@commitlint/config-conventional",
        "version": "~17.4.4",
      }
    `);
  });
});
