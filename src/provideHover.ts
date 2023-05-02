import * as vscode from 'vscode';
import { refToRelative_v5 } from './lockfile/refToRelative';
import { PnpmLockfile } from './lockfile';
import { logger } from '~/logger/logger';
import {
  dependencyPath,
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

  const relativePath_v5 = refToRelative_v5(version, name);
  if (!relativePath_v5) {
    return;
  }

  logger.info({ prefix: 'definition', message: relativePath_v5 });

  const hoverRange = new vscode.Range(
    new vscode.Position(line.lineNumber, line.firstNonWhitespaceCharacterIndex),
    new vscode.Position(line.lineNumber, line.range.end.character),
  );

  const lockfile = await PnpmLockfile.getInstance(document);
  const packageSnapshot = lockfile.lockfile?.packages?.[relativePath_v5];
  if (!packageSnapshot) {
    return;
  }
  const relativePath = dependencyPath(name, version, lockfile.lockfileVersion >= 6);

  const hoverContent = new vscode.MarkdownString(`#### ${relativePath}`);

  return new vscode.Hover(hoverContent, hoverRange);
}

export { provideHover };
