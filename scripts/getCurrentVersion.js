import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import fse from 'fs-extra';

const __dirname = fileURLToPath(import.meta.url);

const { readJSON } = fse;

export async function getCurrentVersion() {
  const packageJson = await readJSON(join(__dirname, '../../package.json'));
  console.log(`${packageJson.version}`);
  return packageJson.version;
}
