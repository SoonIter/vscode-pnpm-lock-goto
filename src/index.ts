import * as vscode from 'vscode';
import type { ExtensionContext } from 'vscode';
import { provideHover } from './provideHover';
import { provideDefinition } from './provideDefinition';
import { logger } from '~/logger/logger';

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

export { activate, deactivate };
