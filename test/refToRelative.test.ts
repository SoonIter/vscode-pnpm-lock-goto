import { describe, expect, it } from 'vitest';
import { refToRelative_v5, refToRelative_v6 } from '../src/lockfile/refToRelative';

describe('refToRelative', () => {
  it('name: version', () => {
    expect(refToRelative_v5('1.0.0', 'foo')).toMatchInlineSnapshot('"/foo/1.0.0"');
    expect(refToRelative_v5('1.1.1', 'foo')).toMatchInlineSnapshot('"/foo/1.1.1"');
    expect(
      refToRelative_v5('1.1.1', '@pnpm/logger'),
    ).toMatchInlineSnapshot('"/@pnpm/logger/1.1.1"');
  });
  it('name: version_v6', () => {
    expect(refToRelative_v6('1.0.0', 'foo')).toMatchInlineSnapshot('"/foo@1.0.0"');
    expect(refToRelative_v6('1.1.1', 'foo')).toMatchInlineSnapshot('"/foo@1.1.1"');
    expect(
      refToRelative_v6('1.1.1', '@pnpm/logger'),
    ).toMatchInlineSnapshot('"/@pnpm/logger@1.1.1"');
  });
});
