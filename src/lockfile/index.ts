import type * as vscode from 'vscode';
import { lineReg } from '../utils/reg';
import { exit } from '../utils/logger';

class Lockfile {
  document: vscode.TextDocument;
  constructor(document: vscode.TextDocument) {
    this.document = document;
  }

  static instance: Lockfile;
  static getInstance(document: vscode.TextDocument) {
    if (!this.instance || this.instance.document.getText().length !== document.getText().length) {
      this.instance = new Lockfile(document);
    }
    return this.instance;
  }

  get lockfileVersion(): string {
    const firstLineText = this.document.lineAt(0).text;
    const [_, key, value] = lineReg.exec(firstLineText)!;
    if (key === undefined || value === undefined) {
      exit('not a right line');
    }
    return '5.4';
  }
}

export { Lockfile };
