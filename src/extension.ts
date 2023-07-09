import * as vscode from "vscode";
import { DebugMessage } from "./from_turbo_console_log/debug-message";
import { JSDebugMessage } from "./from_turbo_console_log/debug-message/js";
import { LineCodeProcessing } from "./from_turbo_console_log/line-code-processing";
import { JSLineCodeProcessing } from "./from_turbo_console_log/line-code-processing/js";
import { DebugMessageLine } from "./from_turbo_console_log/debug-message/DebugMessageLine";
import { JSDebugMessageLine } from "./from_turbo_console_log/debug-message/js/JSDebugMessageLine";
import { MyFuncs } from "./mine/my_funcs";

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "one-console-log" is now active!');

	const jsLineCodeProcessing: LineCodeProcessing = new JSLineCodeProcessing();
	const debugMessageLine: DebugMessageLine = new JSDebugMessageLine(
		jsLineCodeProcessing,
	);
	const jsDebugMessage: DebugMessage = new JSDebugMessage(jsLineCodeProcessing, debugMessageLine);

	let disposable = vscode.commands.registerCommand("one-console-log.addLogs", () => {
		MyFuncs.onAddLogs(jsDebugMessage)
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
