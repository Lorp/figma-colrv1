// Code in this file has access to the *figma document* via the figma global object.
// Browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// https://www.figma.com/plugin-docs/plugin-quickstart-guide/
// Each time you start VS Code, do:
// 1. Hit Ctrl-Shift-B in Windows, or Command-Shift-B for Mac.
// 2. Select watch-tsconfig.json

// Webpack and bundling
// https://www.figma.com/plugin-docs/libraries-and-bundling/



const { fontList } = require("./fontlist.js"); // get list of fonts
const { emojiMetadata } = require("./emoji_15_0_ordering.js"); // get emoji definitions, originally source is https://github.com/googlefonts/emoji-metadata/blob/main/emoji_15_0_ordering.json
const { SamsaFont, SamsaGlyph, SamsaInstance, SamsaBuffer, SAMSAGLOBAL } = require ("samsa-core");

// brotli (this works!)
const buffer = require("buffer");
const brotliDecompressFunction = require("../node_modules/brotli/decompress");


// GLOBAL object
const GLOBAL:any = {
	figmaNodeId: null,
};

// show the HTML page in "ui.html"
figma.showUI(__uiFiles__.main, { width: 314, height: 600, title: "COLRv1 fonts" });


// this is the main font object: you can only have one font at a time
let font:any= <any>{};

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

		case "font-upload": {
			console.log("font-upload message received");

			// de-base64 the font file

			let binary = buffer.Buffer.from(msg.fontData, "base64");
			//let binary = buffer.Buffer.from(msg.fontData, "utf8");

			//let binaryString = atob(msg.fontData);
			console.log("is this an arrayBuffer?")
			//console.log(binary)
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
			emojiMetadata[msg.emojiType].emoji.forEach((emojiChar:any) => {
				const instance = font.instance(); // no axis settings for now, so we get the default instance
				const str: string = String.fromCodePoint(...emojiChar.base);
				const strings:string[] = [str];
				emojiChar.alternates.forEach((alternate:any) => strings.push(String.fromCodePoint(...alternate))) // get the alternate strings as well
				strings.forEach(str => emojiSVGs[str] = instance.renderText({text: str, fontSize: 24, format: "svg"})); // render all the strings to svg, store the svg strings in the emojiSVGs object
			});

			// send the emoji svgs back to UI using message type "emoji-svgs"
			figma.ui.postMessage({type: "emoji-svgs", emojiType: msg.emojiType, svgs: emojiSVGs });
			break;
		}

		case "fetch-font": {

			fetch(msg.url)
			.then(response => {
				console.log("Loaded response: ", response);
				return response.arrayBuffer();
			})
			.then(arrayBuffer => {
				console.log(`File loaded (${arrayBuffer.byteLength} bytes)`);
				const options = {
					fontFace: msg.url,
					allGlyphs: true,
					allTVTs: true,
				};

				//fontSetupFromArrayBuffer(arrayBuffer)

				// load the font, decompress it if necessary
				const fingerprint = new DataView(arrayBuffer, 0, 4).getUint32(0);
				let fontBuffer;
				if (fingerprint === SAMSAGLOBAL.fingerprints.WOFF2) { // does the fingerprint indicate WOFF2?
					console.log("WOFF2 font detected");
					fontBuffer = new SamsaBuffer(arrayBuffer).decodeWOFF2({ // if woff2, convert to ttf here
						bufferObject: buffer.Buffer, // Samsa doesn’t know about Buffer, so we pass it in
						brotliDecompress: brotliDecompressFunction, // Samsa doesn’t know about Brotli, so we pass it in the decompress function
						ignoreInstructions: true,
						ignoreChecksums: true,
					});
					console.log(`WOFF2 font decompressed to TTF (${fontBuffer.byteLength} bytes)`);
					// TODO: check it really is a TTF!
				}
				else {
					fontBuffer = new SamsaBuffer(arrayBuffer);
				}

				// make a SamsaFont object from the uncompressed ttf
				// - font is a global variable (TODO: have it as GLOBAL.font?)
				font = new SamsaFont(fontBuffer, options);
				console.log("TTF font loaded");
				
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
			});
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
		console.log("WOFF2 font detected");
		fontBuffer = new SamsaBuffer(arrayBuffer).decodeWOFF2({ // if woff2, convert to ttf here
			bufferObject: buffer.Buffer, // Samsa doesn’t know about Buffer, so we pass it in
			brotliDecompress: brotliDecompressFunction, // Samsa doesn’t know about Brotli, so we pass it in the decompress function
			ignoreInstructions: true,
			ignoreChecksums: true,
		});
		console.log(`WOFF2 font decompressed to TTF (${fontBuffer.byteLength} bytes)`);
		// TODO: check it really is a TTF!
	}
	else {
		fontBuffer = new SamsaBuffer(arrayBuffer);
	}

	// make a SamsaFont object from the uncompressed ttf
	// - font is a global variable (TODO: have it as GLOBAL.font?)
	font = new SamsaFont(fontBuffer, options);
	console.log("TTF font loaded");
	
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
