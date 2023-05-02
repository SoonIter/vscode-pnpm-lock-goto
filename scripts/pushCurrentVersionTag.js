import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import simpleGit from 'simple-git';
import fse from 'fs-extra';

const __dirname = dirname(fileURLToPath(import.meta.url));

const { readJSON } = fse;

export async function getCurrentVersion() {
  const packageJson = await readJSON(join(__dirname, '../package.json'));
  return packageJson.version;
}

export async function pushTags(currentVersion) {
  const tagName = `v${currentVersion}`;
  await simpleGit().addTag(tagName).pushTags();

  execSync(`echo "tag=${tagName}" >> $GITHUB_OUTPUT`, { encoding: 'utf-8', env: process.env, stdio: 'inherit' });
}

async function main() {
  const currentVersion = await getCurrentVersion();
  console.log(`currentVersion is ${currentVersion}`);
  execSync(`echo "version=${currentVersion}" >> $GITHUB_OUTPUT`, { encoding: 'utf-8', env: process.env, stdio: 'inherit' });
  pushTags(currentVersion);
}

main();
