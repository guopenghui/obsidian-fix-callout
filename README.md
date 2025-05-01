# Fix Callout

Currently, using the `<` symbol in a callout codeblock will disrupt the parsing of the entire note.

This plugin is a simple solution with only a few dozen lines of code.

Core logic is here: [(main.ts) function fixedHyperMD](https://github.com/guopenghui/obsidian-fix-callout/blob/ef4397e7eeeb1ea5363012ee64401bba7883e248/main.ts#L12)

## Effect

<img width="400" src="https://raw.githubusercontent.com/guopenghui/obsidian-fix-callout/master/public/show.gif">

## More explanations

Let's first take a look at the situation when there is no leading symbol (specifically referring to the `>` symbol below).

In the main text, it is processed following the syntax rules. Subsequent content is placed within this unclosed syntax, thus affecting the subsequent rendering.

<img width="300" src="https://github.com/user-attachments/assets/8ce8edca-d394-4fb5-ad30-1adbba778308">

In the codeblock, it is exempted and only treated as content, not as syntax.

<img width="600" src="https://github.com/user-attachments/assets/f62f06a3-54a4-48b0-b608-fae0a03af077">

By comparing the performance with and without the leading symbol, it can be found that after the leading symbol, characters that should have been exempted are still recognized as syntax.

<img width="600" src="https://github.com/user-attachments/assets/0c7c97d0-6eec-4d9e-b162-573dc21cb8f3">

These errors are only related to the leading symbol. Therefore, whether it is a fix for the callout or quote, the essence is the same.
