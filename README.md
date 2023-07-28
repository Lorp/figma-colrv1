# figma-colrv1

Figma plugin to support COLRv1 fonts including variable fonts.

It uses the [Samsa](https://github.com/Lorp/samsa) library, version 2, to parse the COLRv1 font data and render the glyphs as SVG. Version 2 can be tried in the browser using [RenderStack](https://lorp.github.io/renderstack/).

## Development

*From original Figma template README.md:*

Below are the steps to get your plugin running. You can also find instructions at:

  https://www.figma.com/plugin-docs/plugin-quickstart-guide/

This plugin uses Typescript and NPM, two standard tools in creating JavaScript applications.

1. Download Visual Studio Code if you haven't already: https://code.visualstudio.com/.
2. Open this directory in Visual Studio Code.
3. Compile TypeScript to JavaScript: Run the "Terminal > Run Build Task..." menu item,
    then select "npm: watch". You will have to do this again every time
    you reopen Visual Studio Code.

That's it! Visual Studio Code will regenerate the JavaScript file every time you save.
