import * as vscode from 'vscode';
import { getYamlBlockRange } from './utils/getYamlBlockRange';
import { logger } from '~/logger/logger';
import {
  createAnchorPosition,
  isExactDependenciesLine,
  isLockfile,
} from '~/utils/reg';

async function provideDefinition(
  document: vscode.TextDocument,
  position: vscode.Position,
  token: vscode.CancellationToken,
) {
  logger.info({ prefix: 'provideDefinition', message: 'start' });
  const fileName = document.fileName;
  const line = document.lineAt(position.line);
  const lineText = line.text;

  if (!isLockfile(fileName)) {
    return;
  }
  if (!isExactDependenciesLine(lineText)) {
    return;
  }

  const definitionPosition = createAnchorPosition(lineText, document);
  if (!definitionPosition) {
    return;
  }
  const targetLine = document.lineAt(definitionPosition.line);
  return [{
    originSelectionRange: new vscode.Range(new vscode.Position(line.lineNumber, line.firstNonWhitespaceCharacterIndex), line.range.end),
    targetUri: document.uri,
    targetRange: getYamlBlockRange(targetLine, document),
  }] as vscode.LocationLink[];
}

export { provideDefinition };
