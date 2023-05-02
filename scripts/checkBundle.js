import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import fse from 'fs-extra';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const json = await fse.readJson(join(__dirname, '../package.json'));
  if (Object.keys(json.dependencies ?? {}).length > 0) {
    console.error('ERROR: you need bundle all the dependencies, so all dependencies need to be installed to devDependencies');
    process.exit(1);
  }
}
main();
