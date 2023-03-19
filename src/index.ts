import { window } from 'vscode'

export function activate() {
  window.showInformationMessage('Hello')

  console.log('hello')
}

export function deactivate() {}
