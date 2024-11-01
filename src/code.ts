// Code in this file has access to the *figma document* via the figma global object.
// Browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// https://www.figma.com/plugin-docs/plugin-quickstart-guide/
// Each time you start VS Code, do:
// 1. Hit Ctrl-Shift-B in Windows, or Command-Shift-B for Mac.
// 2. Select watch-tsconfig.json

// Webpack and bundling
// https://www.figma.com/plugin-docs/libraries-and-bundling/


const { CONFIG } = require("./config.js");


// GLOBAL object
// - TODO: include font, fontList, defaults
const GLOBAL:any = {
	figmaNodeId: null,
};

// show the HTML page in "ui.html"
figma.showUI(__uiFiles__.main, { width: 354, height: 644-40, title: "COLRv1 Emoji & Fonts" }); // spec is 354x644 (40 is height of title bar)


// get current text color
const textNodeTest:any = figma.createText();
const textColor:object = textNodeTest.type == "SOLID" ? textNodeTest.fills[0].color : { r: 0, g: 0, b: 0 };
textNodeTest.remove();

// initial messages to UI
figma.ui.postMessage({type: "init"});


// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {

	switch (msg.type) {

		case "ping": {
			figma.ui.postMessage({type: "pong", id: msg.id});
			break;
		}

		case "render": {

			if (msg.svg) {
				// the svg is supplied by the frontend
				let node:any = null; // tried node:BaseNode|null = null but that didn’t work, thanks TypeScript!
				let relativeTransform:Transform|null = null;
				if (GLOBAL.figmaNodeId !== null) {
					node = figma.getNodeById(GLOBAL.figmaNodeId);
					if (node !== null) {
						relativeTransform = node.relativeTransform;
						node.remove();
					}
					else {
						GLOBAL.figmaNodeId = null;
					}
				}
	
				node = figma.createNodeFromSvg(msg.svg); // convert SVG to node and add it to the page
				if (relativeTransform) {
					node.relativeTransform = relativeTransform;
				}
	
				// store node id so we can remove it later
				GLOBAL.figmaNodeId = node.id;
	
				// set node metadata
				node.setPluginData("creator", "Figma-COLRv1-plugin-LORP");
				node.setPluginData("dateCreated", new Date().toISOString());
				if (!msg.svg) {
					node.setPluginData("font", font.names[6]); // PostScript name
					node.setPluginData("fontSize", msg.options.fontSize.toString());
					node.setPluginData("text", msg.options.text);
					node.setPluginData("tuple", `[${instance.userTuple.join()}]`);
				}
	
				// inform UI that rendering is complete
				figma.ui.postMessage({type: "render-complete"});
			}


			break;
		}

		case "cancel": {
			figma.closePlugin();
			break;
		}
	}

};
