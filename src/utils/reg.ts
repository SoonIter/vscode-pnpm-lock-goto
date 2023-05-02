import type * as vscode from 'vscode';
import { exit } from './logger';

export const lineReg = /\s*([\w\-\@\.\^\~\'\"\/]+)\s*:\s*(\S+)\s*/;
// '@commitlint/cli': ^17.4.4
export const isDependenciesLine = (text: string): boolean => {
  return lineReg.test(text) && !text.startsWith('dev') && !text.startsWith('hasBin');
};

export const exactLineReg = /\s*([\w\-\@\.\^\~\'\"\/]+)\s*:\s*([\w@\-_\.'\/]+)/;
// semver: 5.7.1
// '@antfu/eslint-config': 0.37.0_j4766f7ecgqbon3u7zlxn5zszu
/**
 * @example
 * isExactDependenciesLine(`semver: 5.7.1`); // true
 * isExactDependenciesLine(`'@antfu/eslint-config': 0.37.0_j4766f7ecgqbon3u7zlxn5zszu`); // true
 */
export const isExactDependenciesLine = (text: string): boolean => {
  return exactLineReg.test(text) && !text.startsWith('dev') && !text.startsWith('hasBin');
};

export const isLockfile = (fileName: string): boolean => {
  if (/pnpm-lock/.test(fileName)) {
    return true;
  }
  return false;
};

/**
 *
 * @param exactDepsLineText path-key: 4.0.0
 * @returns
 */
export const parseDepLine = (exactDepsLineText: string): { name: string; version: string } => {
  let [_, name, version] = lineReg.exec(exactDepsLineText)!;
  if (!name || !version) {
    exit('not a right DepLine');
  }
  name = name.replaceAll('"', '').replaceAll('\'', '');
  return { name, version };
};

/**
 *
 * @param name normalize-path
 * @param version 3.0.0
 * @returns /normalize-path/3.0.0:
 */
export const toStoreName = (name: string, version: string) => {
  return `/${name}/${version}`.replaceAll(' ', '');
};

export const createAnchorPosition = (lineText: string, document: vscode.TextDocument) => {
  const { name, version } = parseDepLine(lineText);

  const storeName = toStoreName(name, version);

  return document.positionAt(document.getText().indexOf(storeName));
};
