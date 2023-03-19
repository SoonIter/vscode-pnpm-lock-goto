import type * as vscode from 'vscode';
const wordReg = /[\w@\-\.\^~'\/]+/;
const lineReg = /(\s+[\w@\-\.\^~'\/]+)\s?:\s?(\s+[\w@\-\.\^~'\/]+)/;

export const isDependenciesLine = (text: string) => {
  return lineReg.test(text) && !text.startsWith('dev') && !text.startsWith('hasBin');
};

export const parse = (text: string) => {
  const [_, name, version] = lineReg.exec(text)!;
  return { name, version };
};

export const toStoreName = (name: string, version: string) => {
  return `/${name.replaceAll('"', '').replaceAll('\'', '')}/${version}`.replaceAll(' ', '');
};
export const createAnchor = (lineText: string, document: vscode.TextDocument) => {
  const { name, version } = parse(lineText);
  const storeName = toStoreName(name, version);
  console.log(document.getText().indexOf(storeName));
  return document.positionAt(document.getText().indexOf(storeName));
};
