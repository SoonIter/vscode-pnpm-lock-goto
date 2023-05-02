import type * as vscode from 'vscode';
import type { Lockfile } from '@pnpm/lockfile-file';
import { readLockRaw } from '@pnpm/lockfile-file';
import { lineReg } from '../utils/reg';
import { exit } from '../logger/logger';

function getLockfileVersion(document: vscode.TextDocument): number {
  const firstLineText = document.lineAt(0).text;
  const [_, key, value] = lineReg.exec(firstLineText)!;
  if (key === undefined || value === undefined) {
    exit('not a right line');
  }
  return parseInt(value.replaceAll('\'', '').replaceAll('"', ''));
}
function parseLockfile(rawContent: string) {
  return readLockRaw(rawContent, { ignoreIncompatible: false });
}

class PnpmLockfile {
  document: vscode.TextDocument;
  lockfileVersion: number;
  lockfile: Lockfile | null = null;

  constructor(document: vscode.TextDocument) {
    this.document = document;
    this.lockfileVersion = getLockfileVersion(document);
  }

  static instance: PnpmLockfile;
  static async getInstance(document: vscode.TextDocument) {
    if (!this.instance || this.instance.document.getText().length !== document.getText().length) {
      this.instance = new PnpmLockfile(document);
      this.instance.lockfile = await parseLockfile(document.getText());
    }
    return this.instance;
  }
}

// getTree();
export { PnpmLockfile, getLockfileVersion };
