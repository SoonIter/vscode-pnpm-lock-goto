import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import fse from 'fs-extra';
import simpleGit from 'simple-git';

const __dirname = dirname(fileURLToPath(import.meta.url));
async function getCommitMsg() {
  const commitMsgPath = join(__dirname, '../.git/COMMIT_EDITMSG');
  const raw = (await fse.readFile(commitMsgPath, 'utf-8'));
  const firstNewLine = raw.indexOf('\n');
  if (firstNewLine === -1) {
    return raw;
  }
  else {
    return raw.slice(0, firstNewLine + 1);
  }
}

async function main() {
  const json = await fse.readJson(join(__dirname, '../package.json'));
  const { name: packageName } = json;
  const commitMsg = await getCommitMsg();
  console.log(commitMsg);

  if (!commitMsg) {
    console.error('ERROR: cannot read commit msg from $HUSKY_GIT_PARAMS');
    process.exit(1);
  }

  if (commitMsg.startsWith('chore(ci)')) {
    return;
  }

  const type = commitMsg.startsWith('feat') ? 'minor' : (commitMsg.startsWith('chore') || commitMsg.startsWith('fix')) ? 'patch' : 'none';
  const changesetFileName = `${Math.floor(Math.random() * 100000)}.md`;
  const changesetFilePath = join(__dirname, `../.changeset/${changesetFileName}`);

  await fse.writeFile(changesetFilePath, `---
"${packageName}": ${type}
---
  
${commitMsg}`, 'utf-8');
  await simpleGit().add([changesetFilePath]);
}
main();
