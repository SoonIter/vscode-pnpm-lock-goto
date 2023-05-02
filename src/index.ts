import * as vscode from 'vscode';
import type { ExtensionContext } from 'vscode';
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
  logger.log('activate');
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
  logger.log('provideHover');
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
  const storeName = toStoreName(name, version);
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
  logger.log('provideDefinition');
  const fileName = document.fileName;
  const line = document.lineAt(position.line);
  const lineText = line.text;

  if (!isLockfile(fileName)) {
    return;
  }
  if (!isExactDependenciesLine(lineText)) {
    return;
  }

  return new vscode.Location(document.uri, createAnchorPosition(lineText, document));
}

export { activate, deactivate };
