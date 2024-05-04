import * as vscode from 'vscode';
import { DebugMessage } from "../from_turbo_console_log/debug-message";
import { getTabSize } from '../from_turbo_console_log/utilities';

export class MyFuncs {
    static async onAddLogs(jsDebugMessage: DebugMessage) {
        const editor: vscode.TextEditor | undefined =
            vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const tabSize: number | string = getTabSize(editor.options.tabSize);
        const document: vscode.TextDocument = editor.document;

        const uniqueVarMaker: any = {}
        const lineNumbers: number[] = []

        for (let index = 0; index < editor.selections.length; index++) {
            const selection: vscode.Selection = editor.selections[index];
            let wordUnderCursor = '';
            const rangeUnderCursor: vscode.Range | undefined =
                document.getWordRangeAtPosition(selection.active);
            // if rangeUnderCursor is undefined, `document.getText(undefined)` will return the entire file.
            if (rangeUnderCursor) {
                wordUnderCursor = document.getText(rangeUnderCursor);
            }
            const selectedVar: string =
                document.getText(selection) || wordUnderCursor;
            const lineOfSelectedVar: number = selection.active.line;

            lineNumbers.push(lineOfSelectedVar)
            uniqueVarMaker[selectedVar] = selectedVar
        }

        const selectedVarNames = Object.keys(uniqueVarMaker).filter((item) => item !== '')

        const lastSelectedLineNumber = Math.max(...lineNumbers)
        await editor.edit((editBuilder) => {
            jsDebugMessage.fayMsg(
                editBuilder,
                document,
                selectedVarNames,
                lastSelectedLineNumber,
                tabSize,
            );
        });

    }

    static getLogText = (obj: {
        fileName: string,
        funcThatEncloseTheVar: string,
        classThatEncloseTheVar: string,
        selectedVarNames: string[],
    }) => {
        const { classThatEncloseTheVar, fileName, funcThatEncloseTheVar, selectedVarNames } = obj
        let finalText = ""

        if (fileName) {
            finalText += `${fileName} :: `
        }

        if (classThatEncloseTheVar) {
            finalText += `${classThatEncloseTheVar} :: `
        }

        if (funcThatEncloseTheVar) {
            finalText += `${funcThatEncloseTheVar} :: `
        }

        if (selectedVarNames.length > 0) {
            for (var i = 0; i < selectedVarNames.length; i++) {
                // finalText += `${selectedVarNames[i]} -> $\{${selectedVarNames[i]}\} ${i === selectedVarNames.length - 1 ? `` : `, `}`
                finalText += `\`${selectedVarNames[i]} -> \`, ${selectedVarNames[i]} ${i === selectedVarNames.length - 1 ? `` : `, `}`
            }
        }

        return `console.log(\`${finalText}\`)`
    }
}