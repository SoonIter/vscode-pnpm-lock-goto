import simpleGit from 'simple-git';
import { getCurrentVersion } from './getCurrentVersion.js';

export async function pushTags(currentVersion) {
  await simpleGit().addTag(`v${currentVersion}`).pushTags();
}

async function main() {
  const currentVersion = await getCurrentVersion();
  pushTags(currentVersion);
}

main();
