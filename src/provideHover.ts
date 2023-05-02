import * as vscode from 'vscode';
import { PnpmLockfile } from './lockfile';
import { refToRelative_v5 } from './lockfile/refToRelative';
import { logger } from '~/logger/logger';
import {
  isDependenciesLine,
  isExactDependenciesLine,
  isLockfile,
  parseDepLine,
} from '~/utils/reg';

async function provideHover(
  document: vscode.TextDocument,
  position: vscode.Position,
  token: vscode.CancellationToken,
) {
  logger.info({ message: 'start', prefix: 'provideHover' });
  const fileName = document.fileName;

  if (!isLockfile(fileName)) {
    return;
  }

  const line = document.lineAt(position.line);
  const lineText = line.text;
  if (!isDependenciesLine(lineText)) {
    return;
  }
  if (!isExactDependenciesLine(lineText)) {
    return;
  }

  const { name, version } = parseDepLine(lineText);
  if (['version', 'name', 'engines', 'resolutions', 'requiresBuild', 'dev', 'optional'].includes(name)) {
    return;
  }

  const lockfile = await PnpmLockfile.getInstance(document);

  const relativePath = refToRelative_v5(version, name);
  if (!relativePath) {
    return;
  }
  console.log(relativePath);
  const hoverRange = new vscode.Range(
    new vscode.Position(line.lineNumber, line.firstNonWhitespaceCharacterIndex),
    new vscode.Position(line.lineNumber, line.range.end.character),
  );

  const projectSnapshot = lockfile.lockfile?.packages?.[relativePath];
  if (!projectSnapshot) {
    return;
  }

  return new vscode.Hover(`${JSON.stringify(projectSnapshot)}`, hoverRange);
}

export { provideHover };
