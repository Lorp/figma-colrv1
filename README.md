# figma-colrv1

Figma plugin to support COLRv1 fonts including variable fonts.

## Installation

1. Download the repo.
2. In Figma, either:
  * Click the Resources button, click the Plugins tab, then the + button. Click “Import plugin from manifest…” then select the manifest.json file from the repo.
  * From the main “F” menu, select Plugins, Development, “Import plugin from manifest…” then select the manifest.json file from the repo.

## Usage

Click the Resources button, then click the Run button by the “figma-colrv1” plugin.

## Notes

It uses the [Samsa](https://github.com/Lorp/samsa) library, version 2, to parse the COLRv1 font data and render the glyphs as SVG. Samsa Version 2 can be tried in the browser using [RenderStack](https://lorp.github.io/renderstack/).

## Development

Be familiar with [Figma: Plugin Quickstart Guide](https://www.figma.com/plugin-docs/plugin-quickstart-guide/).

This plugin uses TypeScript and NPM, two standard tools in creating JavaScript applications.

Open the project folder in Visual Studio Code.

Compile TypeScript to JavaScript: Run the "Terminal > Run Build Task..." menu item,
    then select "npm: watch". You will have to do this again every time
    you reopen Visual Studio Code.
