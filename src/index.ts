import * as vscode from 'vscode';
import type { ExtensionContext } from 'vscode';
import { createAnchor, isDependenciesLine, parse, toStoreName } from './utils/reg';

export function activate(context: ExtensionContext) {
  console.log('activate');
  // 注册鼠标悬停提示
  context.subscriptions.push(
    vscode.languages.registerHoverProvider('yaml', {
      provideHover,
    }),
  );
  // 注册如何实现跳转到定义，第一个参数表示仅对json文件生效
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(['yaml'], {
      provideDefinition,
    }),
  );
  // context.subscriptions.push(
  //   vscode.languages.registerDocumentLinkProvider(['yaml'], {
  //     resolveDocumentLink(link, token) {

  //     },
  //   }),
  // );
}

export function deactivate() {}

function provideHover(
  document: vscode.TextDocument,
  position: vscode.Position,
  token: vscode.CancellationToken,
) {
  const fileName = document.fileName;
  console.log('--------------进入provideHover方法');
  if (!/pnpm-lock/.test(fileName)) {
    return;
  }

  const line = document.lineAt(position.line);
  const lineText = line.text;
  const { name, version } = parse(lineText);
  const storeName = toStoreName(name, version);
  if (!isDependenciesLine(lineText)) {
    return;
  }

  const range = new vscode.Range(new vscode.Position(line.lineNumber, line.firstNonWhitespaceCharacterIndex), new vscode.Position(line.lineNumber, line.range.end.character));

  console.log(range.start);

  if (/pnpm-lock/.test(fileName)) {
    return new vscode.Hover(
      `${storeName}`,
      range,
    );
  }
}

function provideDefinition(
  document: vscode.TextDocument,
  position: vscode.Position,
  token: vscode.CancellationToken,
) {
  const fileName = document.fileName;
  console.log('--------------provideDefinition');
  if (!/pnpm-lock/.test(fileName)) {
    return;
  }

  const line = document.lineAt(position.line);
  const lineText = line.text;
  if (!isDependenciesLine(lineText)) {
    return;
  }

  console.log('definition');

  // const line = document.lineAt(position);

  if (/pnpm-lock/.test(fileName)) {
    return new vscode.Location(
      document.uri,
      createAnchor(lineText, document),
    );
  }
}
