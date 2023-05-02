import { refToRelative } from '@pnpm/dependency-path';

function refToRelative_v6(
  reference: string,
  pkgName: string,
): string | null {
  if (reference.startsWith('link:')) {
    return null;
  }
  if (reference.startsWith('file:')) {
    return reference;
  }
  if (!reference.includes('/') || !reference.replace(/(\([^)]+\))+$/, '').includes('/')) {
    return `/${pkgName}@${reference}`;
  }
  return reference;
}

export { refToRelative as refToRelative_v5, refToRelative_v6 };
