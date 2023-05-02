import type * as vscode from 'vscode';
import { lineReg } from '../utils/reg';
import { exit } from '../utils/logger';

function getLockfileVersion(document: vscode.TextDocument): string {
  const firstLineText = document.lineAt(0).text;
  const [_, key, value] = lineReg.exec(firstLineText)!;
  if (key === undefined || value === undefined) {
    exit('not a right line');
  }
  return value;
}

class Lockfile {
  document: vscode.TextDocument;
  lockfileVersion: number;
  constructor(document: vscode.TextDocument) {
    this.document = document;
    this.lockfileVersion = parseInt(getLockfileVersion(document).replaceAll('\'', '').replaceAll('"', ''));
  }

  static instance: Lockfile;
  static getInstance(document: vscode.TextDocument) {
    if (!this.instance || this.instance.document.getText().length !== document.getText().length) {
      this.instance = new Lockfile(document);
    }
    return this.instance;
  }
}

export { Lockfile };
