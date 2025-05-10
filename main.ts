import { StreamLanguage } from "@codemirror/language";
import { Prec } from "@codemirror/state";
import { Plugin } from "obsidian";

export default class FixCallout extends Plugin {
    async onload() {
        this.registerEditorExtension(Prec.high(fixedHyperMD()));
    }
}

function fixedHyperMD() {
    // @ts-ignore
    const hyperMode = CodeMirror.getMode({}, { name: "hypermd" });
    return StreamLanguage.define({
        ...hyperMode,
        token(stream: CodeMirror.StringStream, state: any) {
            // There is a ```, oh I'm entering or exiting a codeblock
            if (state.quote && stream.match(/^```/)) {
                state.__iscode = !state.__iscode;
                return null;
            }
            // If I'm in a codeblock, ignore '<', so it's not parsed as HTML
            if (state.quote && state.__iscode && stream.match(/^</)) {
                return "bad-<";
            }
            // Obsidian built-in parser takes care of the rest
            return hyperMode.token(stream, state);
        },
        copyState(state: any) {
            return {
                __iscode: state.__iscode,
                ...hyperMode.copyState!(state) as any
            }
        }
    } as any);
}
