//import { createRectangles } from "./rectangle-module";
//import { SamsaFont, SamsaGlyph, SamsaInstance, SamsaBuffer, SAMSAGLOBAL } from "./samsa-core";
//import { SamsaFont, SamsaGlyph, SamsaInstance, SamsaBuffer, SAMSAGLOBAL } from "samsa-core";
// const samsa = require ("samsa-core");
// const SamsaBuffer = samsa.SamsaBuffer;
// const SamsaFont = samsa.SamsaFont;
// const SamsaGlyph = samsa.SamsaGlyph;
// const SamsaInstance = samsa.SamsaInstance;
// const SAMSAGLOBAL = samsa.SAMSAGLOBAL

const { SamsaFont, SamsaGlyph, SamsaInstance, SamsaBuffer, SAMSAGLOBAL } = require ("samsa-core");

// Code in this file has access to the *figma document* via the figma global object.
// Browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// https://www.figma.com/plugin-docs/plugin-quickstart-guide/
// Each time you start VS Code, do:
// 1. Hit Ctrl-Shift-B in Windows, or Command-Shift-B for Mac.
// 2. Select watch-tsconfig.json

// Webpack and bundling
// https://www.figma.com/plugin-docs/libraries-and-bundling/

//let f = new SamsaFont();

// const GLOBAL = {
//   samsaFont: null,
// };

const GLOBAL:any = {
	figmaNode: null,
}

// This shows the HTML page in "ui.html".
const options = {
	width: 300,
	height: 500,
	title: "COLRv1 fonts",
}
figma.showUI(__html__, options);
const sceneNodes: SceneNode[] = []; // these are used in the "zoom to fit" step // TODO: if the UI is persistent, we need to reconsider how we zoom to fit each time

let font:any= <any>{}; // skip type checking

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {


	// One way of distinguishing between different types of messages sent from
	// your HTML page is to use an object with a "type" property like this.

	switch (msg.type) {

		case 'create-rectangles': {
			const nodes: SceneNode[] = [];
			// for (let i = 0; i < msg.count; i++) {
			//   const rect = figma.createRectangle();
			//   rect.x = i * 150;
			//   rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
			//   figma.currentPage.appendChild(rect);
			//   nodes.push(rect);
			// }
			figma.currentPage.selection = nodes;
			//figma.viewport.scrollAndZoomIntoView(nodes);

			break;
		}

		case "fetch-font": {
			const temp: number = msg ?? 0;
			console.log(temp);

			console.log("fetch-font");
			console.log("here we are");
			console.log(msg);

			fetch(msg.url)
			.then(response => {
				console.log("Loaded response: ", response);
				return response.arrayBuffer();
			})
			.then(arrayBuffer => {
				console.log("Loaded bytes: ", arrayBuffer.byteLength);
				const options = {
					fontFace: msg.url,
					allGlyphs: true,
					allTVTs: true,
				};

				font = new SamsaFont(new SamsaBuffer(arrayBuffer), options);

				console.log("Font loaded");
				console.log(font);

				if (font.fvar) {
					font.fvar.axes.forEach((axis:any) => {
						axis.name = font.names[axis.axisNameID];
					});
				}

				if (font.CPAL) {
					font.CPAL.hexColors = {}; // must use an object here... (sparse arrays in JSON are HUGE!)
					font.CPAL.palettes.forEach((palette:any) => {
						palette.colors.forEach((color:number) => {
							font.CPAL.hexColors[color] = font.hexColorFromU32(color);
						});
					});
				}

				// signal to the UI that we’ve got the font, by sending its names, fvar, CPAL
				figma.ui.postMessage({type: "names", fvar: font.names});
				figma.ui.postMessage({type: "fvar", fvar: font.fvar});
				figma.ui.postMessage({type: "CPAL", CPAL: font.CPAL});

			});
		}

		case "render": {

			// get svg from text, font, size, axisSettings, palette
			// console.log ("RENDER");
			// console.log (msg);
			const tuple = font.tupleFromFvs(msg.options.fvs);
			const instance:typeof SamsaInstance = new SamsaInstance(font, tuple);
			if (!msg.options.text)
				msg.options.text = "hello";
			const layout:any = instance.glyphLayoutFromString(msg.options.text);
			const fontSize:number = msg.options.fontSize;
			const upem:number = font.head.unitsPerEm;
			const colorU32:number = 0x000000ff;
			const context:any = {
				font: font,
				instance: instance,
				paths: {},
				gradients: {},
				color: colorU32,
				paletteId: msg.options.paletteId ?? 0,
			};

			// set the text as SVG
			let innerSVGComposition = "";
			layout.forEach((layoutItem:any) => {
				const glyph = font.glyphs[layoutItem.id];
				const iglyph = glyph.instantiate(instance);
				let thisSVG = iglyph.svg(context); // gets the best possible COLR glyph, with monochrome fallback
				thisSVG = `<g transform="translate(${layoutItem.ax} 0)" fill="${font.hexColorFromU32(colorU32)}">` + thisSVG + "</g>";
				innerSVGComposition += thisSVG;
			});
			const defs = Object.values(context.paths).join("") + Object.values(context.gradients).join("");
			const svgPreamble = `<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="2000" viewBox="0 0 2000 2000">`;
			const svgPostamble = `</svg>`;
			const scale = fontSize/upem;
			const gPreamble = `<g transform="scale(${scale} ${-scale}) translate(0 ${-upem})">`;
			const gPostamble = `</g>`;

			// this is where it comes together
			const svgString = svgPreamble + (defs ? `<defs>${defs}</defs>` : "") + gPreamble + innerSVGComposition + gPostamble + svgPostamble; // build and insert final SVG


			if (GLOBAL.figmaNode)
				GLOBAL.figmaNode.remove();

			let node = figma.createNodeFromSvg(svgString); // convert SVG to node and add it to the page
			GLOBAL.figmaNode = node;

			//node.setPluginData("samsa-render", msg); // this seems only to take string data
			sceneNodes.push(node);
			//figma.currentPage.selection = sceneNodes;
			//figma.viewport.scrollAndZoomIntoView(sceneNodes);




			/*
			// add the node to the canvas
			let node = figma.createNodeFromSvg(svgString); // convert SVG to node and add it to the page

			// LATER, we can try this
			// set metadata on the node
			// also set the plugin that made it
			// also set the date
			node.setPluginData("font", font.names[6]); // PostScript name
			node.setPluginData("fontSize", msg.fontSize.toString());
			node.setPluginData("text", msg.text);
			node.setPluginData("fontVariationSettings", "");

			// zoom to fit
			sceneNodes.push(node);
			figma.currentPage.selection = sceneNodes;
			figma.viewport.scrollAndZoomIntoView(sceneNodes);

			// TEST: add a new element to the UI by sending a message
			figma.ui.postMessage({type: "AddAxis", tag: "wght"});
			*/

			break;
		}

		case "palette-edit": {
			if (font.CPAL) {
				const paletteId:number = parseInt(msg.paletteId);
				const entryId:number = parseInt(msg.entryId);
				const palette:any = font.CPAL.palettes[paletteId];
				if (palette && palette.colors[entryId] !== undefined) {
					palette.colors[entryId] = font.u32FromHexColor(msg.color);
					//console.log(`updated palette ${paletteId} entry ${entryId} to ${msg.color} as ${color}`);
				}
			}
			break;
		}

		case "cancel": {
			figma.closePlugin();
			break;
		}
	}

};


