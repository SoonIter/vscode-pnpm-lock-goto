import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import simpleGit from 'simple-git';
import fse from 'fs-extra';
const __dirname = fileURLToPath(import.meta.url);

const { readJSON } = fse;

async function getCurrentVersion() {
  console.log(__dirname);
  const packageJson = await readJSON(join(__dirname, '../../package.json'));
  console.log(`${packageJson.version}`);
  return packageJson.version;
}

async function main() {
  const currentVersion = await getCurrentVersion();
  await simpleGit().addTag(`v${currentVersion}`).pushTags();
}

main();
