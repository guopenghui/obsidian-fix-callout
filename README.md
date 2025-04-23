## Fix Callout Error

Currently, using the `<` symbol in a callout code block will disrupt the parsing of the entire note.

This plugin is a simple solution with only [32 lines of code](https://github.com/guopenghui/obsidian-fix-callout/blob/master/main.ts).

Core logic is here:

````ts
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
    } as any);
}
````

## Effect

![Effect](https://raw.githubusercontent.com/guopenghui/obsidian-fix-callout/master/public/show.gif)
