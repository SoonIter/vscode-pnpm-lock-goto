import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import fse from 'fs-extra';
const __dirname = fileURLToPath(import.meta.url);

async function main() {
  const json = await fse.readJson(join(__dirname, '../../package.json'));
  const { name: packageName } = json;
  fse.writeFile(join(__dirname, `../../.changeset/${Math.random()}.md`), `---
"${packageName}": patch
---
  
${process.env.HUSKY_GIT_PARAMS}`, 'utf-8');
}
main();
