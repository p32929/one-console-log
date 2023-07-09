import * as vscode from "vscode";
import { DebugMessage } from "./debug-message";
import { DebugMessageLine } from "./debug-message/DebugMessageLine";
import { JSDebugMessage } from "./debug-message/js";
import { JSDebugMessageLine } from "./debug-message/js/JSDebugMessageLine";
import { LineCodeProcessing } from "./line-code-processing";
import { JSLineCodeProcessing } from "./line-code-processing/js";
import { MyFuncs } from "../mine/my_funcs";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "one-console-log" is now active!');

  const jsLineCodeProcessing: LineCodeProcessing = new JSLineCodeProcessing();
  const debugMessageLine: DebugMessageLine = new JSDebugMessageLine(
    jsLineCodeProcessing,
  );
  const jsDebugMessage: DebugMessage = new JSDebugMessage(
    jsLineCodeProcessing,
    debugMessageLine,
  );

  let disposable = vscode.commands.registerCommand("one-console-log.addLogs", () => {
    MyFuncs.onAddLogs(jsDebugMessage)
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
