import * as vscode from 'vscode';
import type { ExtensionContext } from 'vscode';
import { Lockfile } from './lockfile';
import { logger } from '~/utils/logger';
import {
  createAnchorPosition,
  isDependenciesLine,
  isExactDependenciesLine,
  isLockfile,
  parseDepLine,
  toStoreName,
} from '~/utils/reg';

function activate(context: ExtensionContext) {
  logger.info({ prefix: 'activate', message: 'trigger' });
  // 注册鼠标悬停提示
  context.subscriptions.push(
    vscode.languages.registerHoverProvider('yaml', {
      provideHover,
    }),
  );

  // 注册如何实现跳转到定义，第一个参数表示仅对yaml文件生效
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider('yaml', {
      provideDefinition,
    }),
  );
}

function deactivate() {}

function provideHover(
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

  const { name, version } = parseDepLine(lineText);
  const lockfile = Lockfile.getInstance(document);

  const storeName = toStoreName(name, version, lockfile.lockfileVersion >= 6);
  const hoverRange = new vscode.Range(
    new vscode.Position(line.lineNumber, line.firstNonWhitespaceCharacterIndex),
    new vscode.Position(line.lineNumber, line.range.end.character),
  );

  return new vscode.Hover(`${storeName}`, hoverRange);
}

function provideDefinition(
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
  return new vscode.Location(document.uri, definitionPosition);
}

export { activate, deactivate };
