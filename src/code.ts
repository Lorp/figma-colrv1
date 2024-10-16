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
const { fonts } = require("./fonts.js"); // list of fonts, some embedded as base64
const { emojiMetadata } = require("./emoji_ordering.js"); // emoji definitions and ordering
const { SamsaFont, SamsaGlyph, SamsaInstance, SamsaBuffer, SAMSAGLOBAL } = require ("samsa-core");
const BufferWrapper = require("buffer");
const BufferPolyfill = BufferWrapper.Buffer;
const brotliDecompressFunction = require("../node_modules/brotli/decompress");

// create fontList, a simplified list of fonts for UI (no URLs or data URLs)
const fontList:{ name: string, attributes: string[], website: string, priority: any }[] = [];
fonts.forEach((font:any) => {
	fontList.push({
		name: font.name,
		attributes: font.attributes,
		website: font.website,
		priority: font.priority || 0,
	});
});


// GLOBAL object
// - TODO: include font, fontList, defaults
const GLOBAL:any = {
	figmaNodeId: null,
};

// show the HTML page in "ui.html"
figma.showUI(__uiFiles__.main, { width: 354, height: 644-40, title: "COLRv1 Emoji & Fonts" }); // spec is 354x644 (40 is height of title bar)


// this is the main font object: you can only have one font at a time
let font:any = <any>{};

// get current text color
const textNodeTest:any = figma.createText();
const textColor:object = textNodeTest.type == "SOLID" ? textNodeTest.fills[0].color : { r: 0, g: 0, b: 0 };
textNodeTest.remove();

// set up defaults, send init message to UI
const defaults = {
	textColor: textColor,
};

// initial messages to UI
figma.ui.postMessage({type: "init", defaults: defaults});
figma.ui.postMessage({type: "font-list", fontList: fontList});
figma.ui.postMessage({type: "emoji-ordering", emojiMetadata: emojiMetadata});


// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {

	switch (msg.type) {

		case "ping": {
			figma.ui.postMessage({type: "pong", id: msg.id});
			break;
		}

		case "font-upload": {
			// de-base64 the font file
			let binary = BufferPolyfill.from(msg.fontData, "base64");
			const options:any = {
				fontFace: "DragDrop",
				allGlyphs: true,
				allTVTs: true,
			};

			setupFontFromArrayBuffer(binary.buffer, {excludes: []}, options); // binary.buffer is the Buffer’s underlying ArrayBuffer

			break;
		}

		case "fetch-emojis": {

			const emojiSVGs: {[key: string]: string} = {}; // we return an object of SVGs indexed by the string that invokes the emoji (the UI already knows about the arrangement of emojis)
			
			// we return an object of SVGs indexed by string
			let emojiIndex:number = 0;
			const instance = font.instance(); // no axis settings for now, so we get the default instance


			// the request is for specific emojis
			if (msg.emojiStrings && Array.isArray(msg.emojiStrings)) {
				msg.emojiStrings.forEach((emojiString:string) => {

					// find the relevant emojiChar
					let foundEmojiChar:boolean = false;
					for (const group in emojiMetadata) {
						const emojiGroup = emojiMetadata[group].emoji;
						for (const e in emojiGroup) {
							const emojiChar = emojiGroup[e];					
							const str = String.fromCodePoint(...emojiChar.base);
							if (str === emojiString) {
								const strings:string[] = [];
								if (msg.getBases)
									strings.push(emojiString);
								if (msg.getAlternates)
									emojiChar.alternates.forEach((alternate:any) => strings.push(String.fromCodePoint(...alternate))) // get the alternate strings as well
								strings.forEach(str => emojiSVGs[str] = instance.renderText({text: str, fontSize: 24, format: "svg"})); // render all the strings to svg, store the svg strings in the emojiSVGs object
								figma.ui.postMessage({type: "emoji-svgs", emojiStrings: true, svgs: emojiSVGs }); // send the SVG strings back to the frontend
								foundEmojiChar = true;
								break;
							}
						}
						if (foundEmojiChar)
							break;
					}

					if (!foundEmojiChar) {
						console.log("emoji not found: ", emojiString);
					}
				});
			}

			// the request is for emojis by group, possibly with nonzero startIndex
			else if (msg.emojiType !== undefined) {
				const startTime = Date.now();
				const startIndex:number = msg.startIndex || 0;
				const count:number = msg.count || 1000; // 1000 is sanity check

				for (let i:number = startIndex; i < startIndex + count && i < emojiMetadata[msg.emojiType].emoji.length; i++) {
					const emojiChar:any = emojiMetadata[msg.emojiType].emoji[i];
					const str: string = String.fromCodePoint(...emojiChar.base);
					const strings:string[] = [str];
					if (msg.getAlternates)
						emojiChar.alternates.forEach((alternate:any) => strings.push(String.fromCodePoint(...alternate))) // get the alternate strings as well
					strings.forEach(str => emojiSVGs[str] = instance.renderText({text: str, fontSize: 24, format: "svg"})); // render all the strings to svg, store the svg strings in the emojiSVGs object
				}

				const endTime = Date.now();
				figma.ui.postMessage({type: "emoji-svgs", emojiType: msg.emojiType, svgs: emojiSVGs, startIndex: startIndex});
			}

			break;
		}

		case "fetch-font-by-name": {
			const foundFont = fonts.find((font:any) => font.name === msg.name);
			if (foundFont?.url) {
				fetch(foundFont.url)
				.then(response => {
					return response.arrayBuffer();
				})
				.then(arrayBuffer => {
					const options = {
						fontFace: msg.name,
						allGlyphs: true,
						allTVTs: true,
					};
	
					//fontSetupFromArrayBuffer(arrayBuffer)
	
					// load the font, decompress it if necessary
					const fingerprint = new DataView(arrayBuffer, 0, 4).getUint32(0);
					let fontBuffer;

					if (fingerprint === SAMSAGLOBAL.fingerprints.WOFF2) { // does the fingerprint indicate WOFF2?
						fontBuffer = new SamsaBuffer(arrayBuffer).decodeWOFF2({ // if woff2, convert to ttf here
							bufferObject: BufferPolyfill, // Samsa doesn’t know about Buffer, so we pass it in
							brotliDecompress: brotliDecompressFunction, // Samsa doesn’t know about Brotli, so we pass it in the decompress function
							ignoreInstructions: true,
							ignoreChecksums: true,
						});
						// TODO: check it really is a TTF!
					}
					else {
						fontBuffer = new SamsaBuffer(arrayBuffer);
					}
	
					// make a SamsaFont object from the uncompressed ttf
					// - font is a global variable (TODO: have it as GLOBAL.font?)
					font = new SamsaFont(fontBuffer, options);
					
					// signal to the UI that we’ve got the font, by sending its names, fvar, CPAL
					// - TODO: send these all as one message?
					figma.ui.postMessage({type: "font-fetched"});
	
					// variable font?
					if (font.fvar && font.fvar.axisCount) {
						font.fvar.axes.forEach((axis:any) => {
							axis.name = font.names[axis.axisNameID];
						});
						figma.ui.postMessage({type: "fvar", fvar: { instances: font.fvar.instances, axes: font.fvar.axes}});	
					}
	
					// color font?
					if (font.CPAL && (!msg.excludes || !msg.excludes.includes("CPAL"))) { // we might not need CPAL at the front end
						font.CPAL.hexColors = {}; // must use an object here... (sparse arrays in JSON are HUGE!)
						font.CPAL.palettes.forEach((palette:any) => {
							palette.colors.forEach((color:number) => {
								font.CPAL.hexColors[color] = font.hexColorFromU32(color);
							});
						});
						figma.ui.postMessage({type: "CPAL", CPAL: { colors: font.CPAL.colors, palettes: font.CPAL.palettes, hexColors: font.CPAL.hexColors}});
					}
	
					// the UI can do what it wants now
					figma.ui.postMessage({ type: "font-data-delivered", fontFamily: msg.name });
				});

			}
			break;
		}

		case "render": {

			// get svg from text, font, size, axisSettings, palette
			const instance:typeof SamsaInstance = font.instance(msg.options.fvs);
			let svgString = instance.renderText({
				text: msg.options.text,
				fontSize: msg.options.fontSize,
				paletteId: msg.options.paletteId ?? 0,
				format: "svg",
			});

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
			node = figma.createNodeFromSvg(svgString); // convert SVG to node and add it to the page
			if (relativeTransform) {
				node.relativeTransform = relativeTransform;
			}

			// store node id so we can remove it later
			GLOBAL.figmaNodeId = node.id;

			// set node metadata
			node.setPluginData("creator", "Figma-COLRv1-plugin-LORP");
			node.setPluginData("dateCreated", new Date().toISOString());
			node.setPluginData("font", font.names[6]); // PostScript name
			node.setPluginData("fontSize", msg.options.fontSize.toString());
			node.setPluginData("text", msg.options.text);
			node.setPluginData("tuple", `[${instance.tuple.join()}]`);

			// inform UI that rendering is complete
			figma.ui.postMessage({type: "render-complete"});

			break;
		}

		case "palette-edit": {
			if (font.CPAL) {
				const paletteId:number = parseInt(msg.paletteId);
				const entryId:number = parseInt(msg.entryId);
				const palette:any = font.CPAL.palettes[paletteId];
				if (palette && palette.colors[entryId] !== undefined) {
					palette.colors[entryId] = font.u32FromHexColor(msg.color);
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


function setupFontFromArrayBuffer(arrayBuffer:any, msg:any, options:any) {

	// load the font, decompress it if necessary
	const fingerprint = new DataView(arrayBuffer, 0, 4).getUint32(0);
	let fontBuffer;
	if (fingerprint === SAMSAGLOBAL.fingerprints.WOFF2) { // does the fingerprint indicate WOFF2?
		fontBuffer = new SamsaBuffer(arrayBuffer).decodeWOFF2({ // if woff2, convert to ttf here
			bufferObject: BufferPolyfill, // Samsa doesn’t know about Buffer, so we pass it in
			brotliDecompress: brotliDecompressFunction, // Samsa doesn’t know about Brotli, so we pass it in the decompress function
			ignoreInstructions: true,
			ignoreChecksums: true,
		});
		// TODO: check it really is a TTF!
	}
	else {
		fontBuffer = new SamsaBuffer(arrayBuffer);
	}

	// make a SamsaFont object from the uncompressed ttf
	// - font is a global variable (TODO: have it as GLOBAL.font?)
	font = new SamsaFont(fontBuffer, options);
	if (font && font.tables["glyf"]) {
	
		// signal to the UI that we’ve got the font, by sending its names, fvar, CPAL
		// - TODO: send these all as one message?
		figma.ui.postMessage({type: "font-fetched"});
	
		// variable font?
		if (font.fvar && font.fvar.axisCount) {
			font.fvar.axes.forEach((axis:any) => {
				axis.name = font.names[axis.axisNameID];
			});
			figma.ui.postMessage({type: "fvar", fvar: { instances: font.fvar.instances, axes: font.fvar.axes}});	
		}
	
		// color font?
		if (font.CPAL && (!msg.excludes || !msg.excludes.includes("CPAL"))) { // we might not need CPAL at the front end
			font.CPAL.hexColors = {}; // must use an object here... (sparse arrays in JSON are HUGE!)
			font.CPAL.palettes.forEach((palette:any) => {
				palette.colors.forEach((color:number) => {
					font.CPAL.hexColors[color] = font.hexColorFromU32(color);
				});
			});
			figma.ui.postMessage({type: "CPAL", CPAL: { colors: font.CPAL.colors, palettes: font.CPAL.palettes, hexColors: font.CPAL.hexColors}});
		}
	
		figma.ui.postMessage({type: "font-data-delivered"});	
	}
	else {
		figma.ui.postMessage({type: "error", message: "Invalid font"});	
	}
}
