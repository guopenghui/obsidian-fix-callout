import { StreamLanguage } from "@codemirror/language";
import { Prec } from "@codemirror/state";
import { Plugin } from "obsidian";

export default class FixCallout extends Plugin {
    async onload() {
        this.registerEditorExtension(Prec.high(fixedHyperMD()));
    }
    onunload() {}
}

function fixedHyperMD() {
    // @ts-ignore
    const _hyperMode = CodeMirror.getMode({}, { name: "hypermd" });
    return StreamLanguage.define({
        ..._hyperMode,
        token(stream: CodeMirror.StringStream, state: any) {
            // If I'm in a '>' block
            if (state.quote) {
                // There is a ```, or I'm entering or exiting a codeblock
                if (stream.match(/^```/)) {
                    state.__iscode = !state.__iscode;
                    return null;
                }
                // If I'm in a codeblock
                if (state.__iscode) {
                    // ignore '<', so it's not parsed as HTML
                    if (stream.match(/^</)) return "bad-<";
                }

                // ignore '%%', so it's not parsed as a comment
                if (stream.match(/^%%/)) return "bad-%%";
            }
            // Obsidian built-in parser takes care of the rest
            return _hyperMode.token(stream, state);
        },
    } as any);
}
