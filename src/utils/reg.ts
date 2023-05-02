import type * as vscode from 'vscode';
import { logger } from '@pnpm/logger';
import { refToRelative_v5, refToRelative_v6 } from '../lockfile/refToRelative';
import { exit } from '../logger/logger';
import { getLockfileVersion } from '../lockfile';

export const lineReg = /\s*([\w\-\@\.\^\~\'\"\/]+)\s*:\s*(\S+)\s*/;

/**
 * @example isDependenciesLine(`'@commitlint/cli': ^17.4.4`) // true
 * */
export const isDependenciesLine = (text: string): boolean => {
  return lineReg.test(text) && !text.startsWith('dev') && !text.startsWith('hasBin');
};

export const exactLineReg = /\s*([\w\-\@\.\^\~\'\"\/]+)\s*:\s*([\w@\-_\.'\/]+)/;
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
  if (!name || !version || ['version', 'name', 'engines', 'resolutions', 'requiresBuild', 'dev', 'optional'].includes(name)) {
    exit('not a right DepLine');
  }
  name = name.replaceAll('"', '').replaceAll('\'', '').replaceAll(' ', '');
  return { name, version };
};

/**
 *
 * @param name normalize-path
 * @param version 3.0.0
 * @returns
 * /normalize-path/3.0.0:
 * /normalize-path/@3.0.0:
 */
export const dependencyPath = (name: string, version: string, isLockfileV6: boolean) => {
  return isLockfileV6 ? refToRelative_v6(version, name) : refToRelative_v5(version, name);
};

export const createAnchorPosition = (lineText: string, document: vscode.TextDocument) => {
  const { name, version } = parseDepLine(lineText);

  const isLockfileV6 = getLockfileVersion(document) >= 6.0;

  const relativePath = dependencyPath(name, version, isLockfileV6);

  if (!relativePath) {
    return;
  }
  logger.debug({ name, relativePath });

  return document.positionAt(document.getText().indexOf(`${relativePath}:`));
};
