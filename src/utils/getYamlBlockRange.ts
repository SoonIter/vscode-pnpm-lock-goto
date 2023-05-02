import * as vscode from 'vscode';

function getYamlBlockRange(startLine: vscode.TextLine, document: vscode.TextDocument) {
  const { lineNumber, firstNonWhitespaceCharacterIndex } = startLine;
  const whiteBlockNum = firstNonWhitespaceCharacterIndex;
  const startPosition = new vscode.Position(lineNumber, firstNonWhitespaceCharacterIndex);

  let currLineNum = lineNumber + 1;
  while (currLineNum < document.lineCount) {
    const currLine = document.lineAt(currLineNum);
    if (currLine.firstNonWhitespaceCharacterIndex <= whiteBlockNum) {
      break;
    }
    currLineNum++;
  }
  const endLine = document.lineAt(currLineNum);
  return new vscode.Range(startPosition, endLine.range.end);
}

export { getYamlBlockRange };
