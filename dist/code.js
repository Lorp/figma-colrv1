/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/samsa-core/index.js":
/*!******************************************!*\
  !*** ./node_modules/samsa-core/index.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SAMSAGLOBAL: () => (/* reexport safe */ _src_samsa_core__WEBPACK_IMPORTED_MODULE_0__.SAMSAGLOBAL),
/* harmony export */   SamsaBuffer: () => (/* reexport safe */ _src_samsa_core__WEBPACK_IMPORTED_MODULE_0__.SamsaBuffer),
/* harmony export */   SamsaFont: () => (/* reexport safe */ _src_samsa_core__WEBPACK_IMPORTED_MODULE_0__.SamsaFont),
/* harmony export */   SamsaGlyph: () => (/* reexport safe */ _src_samsa_core__WEBPACK_IMPORTED_MODULE_0__.SamsaGlyph),
/* harmony export */   SamsaInstance: () => (/* reexport safe */ _src_samsa_core__WEBPACK_IMPORTED_MODULE_0__.SamsaInstance)
/* harmony export */ });
/* harmony import */ var _src_samsa_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/samsa-core */ "./node_modules/samsa-core/src/samsa-core.js");



/***/ }),

/***/ "./node_modules/samsa-core/src/samsa-core.js":
/*!***************************************************!*\
  !*** ./node_modules/samsa-core/src/samsa-core.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SAMSAGLOBAL: () => (/* binding */ SAMSAGLOBAL),
/* harmony export */   SamsaBuffer: () => (/* binding */ SamsaBuffer),
/* harmony export */   SamsaContext: () => (/* binding */ SamsaContext),
/* harmony export */   SamsaFont: () => (/* binding */ SamsaFont),
/* harmony export */   SamsaGlyph: () => (/* binding */ SamsaGlyph),
/* harmony export */   SamsaInstance: () => (/* binding */ SamsaInstance)
/* harmony export */ });

// samsa-core.js
// Version 2.0 alpha


// minify using uglifyjs: ~/node_modules/uglify-js/bin/uglifyjs samsa-core.js > samsa-core.min.js

/*

A note on variable naming. You may see a few of these:

const _runCount = buf.u16; // get the data from the buffer
const runCount = _runCount & 0x7FFF; // refine the data into a useable variable

The underscore prefix is intended to mean the initial version of the variable (_runCount) that needs to be refined into a useable variable (runCount). This way we can 
accurately reflect fields described in the spec, derive some data from flags, then use them under similar name for the purpose decribed by the name.

2023-07-27: All occurrences of "??" nullish coalescing operator have been replaced (as )it’s not supported by something in the Figma plugin build process). The ?? lines remain as comments above their replacements.

*/

// expose these to the client
const SAMSAGLOBAL = {
	version: "2.0.0",
	browser: typeof window !== "undefined",
	endianness: endianness(),
	littleendian: endianness("LE"),
	bigendian: endianness("BE"),
	stdGlyphNames: [".notdef",".null","nonmarkingreturn","space","exclam","quotedbl","numbersign","dollar","percent","ampersand","quotesingle","parenleft","parenright","asterisk","plus","comma","hyphen","period","slash","zero","one","two","three","four","five","six","seven","eight","nine","colon","semicolon","less","equal","greater","question","at","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","bracketleft","backslash","bracketright","asciicircum","underscore","grave","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","braceleft","bar","braceright","asciitilde","Adieresis","Aring","Ccedilla","Eacute","Ntilde","Odieresis","Udieresis","aacute","agrave","acircumflex","adieresis","atilde","aring","ccedilla","eacute","egrave","ecircumflex","edieresis","iacute","igrave","icircumflex","idieresis","ntilde","oacute","ograve","ocircumflex","odieresis","otilde","uacute","ugrave","ucircumflex","udieresis","dagger","degree","cent","sterling","section","bullet","paragraph","germandbls","registered","copyright","trademark","acute","dieresis","notequal","AE","Oslash","infinity","plusminus","lessequal","greaterequal","yen","mu","partialdiff","summation","product","pi","integral","ordfeminine","ordmasculine","Omega","ae","oslash","questiondown","exclamdown","logicalnot","radical","florin","approxequal","Delta","guillemotleft","guillemotright","ellipsis","nonbreakingspace","Agrave","Atilde","Otilde","OE","oe","endash","emdash","quotedblleft","quotedblright","quoteleft","quoteright","divide","lozenge","ydieresis","Ydieresis","fraction","currency","guilsinglleft","guilsinglright","fi","fl","daggerdbl","periodcentered","quotesinglbase","quotedblbase","perthousand","Acircumflex","Ecircumflex","Aacute","Edieresis","Egrave","Iacute","Icircumflex","Idieresis","Igrave","Oacute","Ocircumflex","apple","Ograve","Uacute","Ucircumflex","Ugrave","dotlessi","circumflex","tilde","macron","breve","dotaccent","ring","cedilla","hungarumlaut","ogonek","caron","Lslash","lslash","Scaron","scaron","Zcaron","zcaron","brokenbar","Eth","eth","Yacute","yacute","Thorn","thorn","minus","multiply","onesuperior","twosuperior","threesuperior","onehalf","onequarter","threequarters","franc","Gbreve","gbreve","Idotaccent","Scedilla","scedilla","Cacute","cacute","Ccaron","ccaron","dcroat"],
};

// format codes
const U4 = 0;
const U8 = 1;
const I8 = 2;
const U16 = 3;
const I16 = 4;
const U24 = 5;
const I24 = 6;
const U32 = 7;
const I32 = 8;
const U64 = 9;
const I64 = 10;
const F1616 = 11;
const F214 = 12;
const STR = 13;
const TAG = 14;
const CHAR = 15;

const FORMATS = {

	head: {
		version: [U16,2],
		fontRevision: [U16,2],
		checkSumAdjustment: U32,
		magicNumber: U32,
		flags: U16,
		unitsPerEm: U16,
		created: I64,
		modified: I64,
		xMin: I16,
		yMin: I16,
		xMax: I16,
		yMax: I16,
		macStyle: U16,
		lowestRecPPEM: U16,
		fontDirectionHint: I16,
		indexToLocFormat: I16,
		glyphDataFormat: I16,
	},

	hhea: {
		version: [U16,2],
		ascender: I16,
		descender: I16,
		lineGap: I16,
		advanceWidthMax: U16,
		minLeftSideBearing: I16,
		minRightSideBearing: I16,
		xMaxExtent: I16,
		caretSlopeRise: I16,
		caretSlopeRun: I16,
		caretOffset: I16,
		reserved: [I16,4],
		metricDataFormat: I16,
		numberOfHMetrics: U16,
	},

	vhea: {
		version: [U32],
		_IF_10: [["version", "==", 0x00010000], {
			ascent: I16,
			descent: I16,
			lineGap: I16,
		}],
		_IF_11: [["version", "==", 0x00011000], {
			vertTypoAscender: I16,
			vertTypoDescender: I16,
			vertTypoLineGap: I16,
		}],
		advanceHeightMax: I16,
		minTop: I16,
		minBottom: I16,
		yMaxExtent: I16,
		caretSlopeRise: I16,
		caretSlopeRun: I16,
		caretOffset: I16,
		reserved: [I16,4],
		metricDataFormat: I16,
		numOfLongVerMetrics: U16,
	},
	
	maxp: {
		version: F1616,
		numGlyphs: U16,
		_IF_: [["version", ">=", 1.0], {
			maxPoints: U16,
			maxContours: U16,
			maxCompositePoints: U16,
			maxCompositeContours: U16,
			maxZones: U16,
			maxTwilightPoints: U16,
			maxStorage: U16,
			maxFunctionDefs: U16,
			maxInstructionDefs: U16,
			maxStackElements: U16,
			maxSizeOfInstructions: U16,
			maxComponentElements: U16,
			maxComponentDepth: U16,
		}],
	},
	
	post: {
		version: F1616,
		italicAngle: F1616,
		underlinePosition: I16,
		underlineThickness: I16,
		isFixedPitch: U32,
		minMemType42: U32,
		maxMemType42: U32,
		minMemType1: U32,
		maxMemType1: U32,
		_IF_: [["version", "==", 2.0], {
			numGlyphs: U16,
			glyphNameIndex: [U16, "_ARG0_"],
		}],
		_IF_2: [["version", "==", 2.5], {
			numGlyphs: U16,
			offset: [I8, "numGlyphs"],
		}],
	},

	name: {
		version: U16,
		count: U16,
		storageOffset: U16,
	},

	cmap: {
		version: U16,
		numTables: U16,
	},
	
	"OS/2": {
		version: U16,
		xAvgCharWidth: U16,
		usWeightClass: U16,
		usWidthClass: U16,
		fsType: U16,
		ySubscriptXSize: U16,
		ySubscriptYSize: U16,
		ySubscriptXOffset: U16,
		ySubscriptYOffset: U16,
		ySuperscriptXSize: U16,
		ySuperscriptYSize: U16,
		ySuperscriptXOffset: U16,
		ySuperscriptYOffset: U16,
		yStrikeoutSize: U16,
		yStrikeoutPosition: U16,
		sFamilyClass: U16,
		panose: [U8,10],
		ulUnicodeRange1: U32,
		ulUnicodeRange2: U32,
		ulUnicodeRange3: U32,
		ulUnicodeRange4: U32,
		achVendID: TAG,
		fsSelection: U16,
		usFirstCharIndex: U16,
		usLastCharIndex: U16,
		sTypoAscender: U16,
		sTypoDescender: U16,
		sTypoLineGap: U16,
		usWinAscent: U16,
		usWinDescent: U16,
		_IF_: [["version", ">=", 1], {
			ulCodePageRange1: U32,
			ulCodePageRange2: U32,
		}],
		_IF_2: [["version", ">=", 2], {
			sxHeight: U16,
			sCapHeight: U16,
			usDefaultChar: U16,
			usBreakChar: U16,
			usMaxContext: U16,
		}],
		_IF_3: [["version", ">=", 5], {
			usLowerOpticalPointSize: U16,
			usUpperOpticalPointSize: U16,
		}],
	},

	fvar: {
		version: [U16,2],
		axesArrayOffset: U16,
		reserved: U16,
		axisCount: U16,
		axisSize: U16,
		instanceCount: U16,
		instanceSize: U16
	},

	gvar: {
		version: [U16,2],
		axisCount: U16,
		sharedTupleCount: U16,
		sharedTuplesOffset: U32,
		glyphCount: U16,
		flags: U16,
		glyphVariationDataArrayOffset: U32,
	},

	avar: {
		version: [U16,2],
		reserved: U16,
		axisCount: U16,
	},

	COLR: {
		version: U16,
		numBaseGlyphRecords: U16,
		baseGlyphRecordsOffset: U32,
		layerRecordsOffset: U32,
		numLayerRecords: U16,
		_IF_: [["version", "==", 1], {
			baseGlyphListOffset: U32,
			layerListOffset: U32,
			clipListOffset: U32,
			varIndexMapOffset: U32,
			itemVariationStoreOffset: U32,
		}],
	},

	CPAL: {
		version: U16,
		numPaletteEntries: U16,
		numPalettes: U16,
		numColorRecords: U16,
		colorRecordsArrayOffset: U32,
		colorRecordIndices: [U16,"numPalettes"],
		_IF_: [["version", "==", 1], {
			paletteTypesArrayOffset: U32,
			paletteLabelsArrayOffset: U32,
			paletteEntryLabelsArrayOffset: U32,
		}],
		// colorRecords[U32, "numColorRecords", "@colorRecordsArrayOffset"], // maybe this format
	},

	STAT: {
		version: [U16,2],
		designAxisSize: U16,
		designAxisCount: U16,
		designAxesOffset: U32,
		axisValueCount: U16,
		offsetToAxisValueOffsets: U32,
		elidedFallbackNameID: U16
	},

	MVAR: {
		version: [U16,2],
		reserved: U16,
		valueRecordSize: U16,
		valueRecordCount: U16,
		itemVariationStoreOffset: U16,
	},

	HVAR: {
		version: [U16,2],
		itemVariationStoreOffset: U32,
		advanceWidthMappingOffset: U32,
		lsbMappingOffset: U32,
		rsbMappingOffset: U32,
	},

	VVAR: {
		version: [U16,2],
		itemVariationStoreOffset: U32,
		advanceHeightMappingOffset: U32,
		tsbMappingOffset: U32,
		bsbMappingOffset: U32,
		vOrgMappingOffset: U32,
	},

	TableDirectory: {
		sfntVersion: U32,
		numTables: U16,
		searchRange: U16,
		entrySelector: U16,
		rangeShift: U16,
	},

	TableRecord: {
		tag: TAG,
		checkSum: U32,
		offset: U32,
		length: U32,
	},

	NameRecord: {
		platformID: U16,
		encodingID: U16,
		languageID: U16,
		nameID: U16,
		length: U16,
		stringOffset: U16,
	},
	
	EncodingRecord: {
		platformID: U16,
		encodingID: U16,
		subtableOffset: U32,
	},

	CharacterMap: {
		format: U16,
		_IF_: [["format", "<=", 6], {
			length: U16,
			language: U16,
		}],
		_IF_1: [["format", "==", 8], {
			reserved: U16,
			length: U32,
			language: U32,
		}],
		_IF_2: [["format", "==", 10], {
			reserved: U16,
			length: U32,
			language: U32,
		}],
		_IF_3: [["format", "==", 12], {
			reserved: U16,
			length: U32,
			language: U32,
		}],
		_IF_4: [["format", "==", 14], {
			length: U32,
		}],
	},
		
	GlyphHeader: {
		numberOfContours: I16,
		xMin: I16,
		yMin: I16,
		xMax: I16,
		yMax: I16,
	},

	VariationAxisRecord: {
		axisTag: TAG,
		minValue: F1616,
		defaultValue: F1616,
		maxValue: F1616,
		flags: U16,
		axisNameID: U16,
	},
	
	InstanceRecord: {
		subfamilyNameID: U16,
		flags: U16,
		coordinates: [F1616, "_ARG0_"],
		_IF_: [["_ARG1_", "==", true], {
			postScriptNameID: U16,
		}],
	},

	AxisRecord: {
		axisTag: TAG,
		axisNameID: U16,
		axisOrdering: U16,
	},

	AxisValueFormat: {
		format: U16,
		_IF_: [["format", "<", 4], {
			axisIndex: U16,
		}],
		_IF_4: [["format", "==", 4], {
			axisCount: U16,
		}],
		flags: U16,
		valueNameID: U16,
		_IF_1: [["format", "==", 1], {
			value: F1616,
		}],
		_IF_2: [["format", "==", 2], {
			value: F1616,
			rangeMinValue: F1616,
			rangeMaxValue: F1616,
		}],
		_IF_3: [["format", "==", 3], {
			value: F1616,
			linkedValue: F1616,
		}],
	},

	ItemVariationStoreHeader: {
		format: U16,
		regionListOffset: U32,
		itemVariationDataCount: U16,
		itemVariationDataOffsets: [U32, "itemVariationDataCount"],
	},

	ItemVariationData: {
		itemCount: U16,
		wordDeltaCount: U16,
		regionIndexCount: U16,
		regionIndexes: [U16, "regionIndexCount"],
	},
};

// gvar
const GVAR_SHARED_POINT_NUMBERS = 0x8000;
const GVAR_EMBEDDED_PEAK_TUPLE = 0x8000;
const GVAR_INTERMEDIATE_REGION = 0x4000;
const GVAR_PRIVATE_POINT_NUMBERS = 0x2000;
const DELTAS_ARE_ZERO = 0x80;
const DELTAS_ARE_WORDS = 0x40;
const DELTA_RUN_COUNT_MASK = 0x3f;

// COLRv1 composite modes
const COMPOSITE_CLEAR = 0;
const COMPOSITE_SRC = 1;
const COMPOSITE_DEST = 2;
const COMPOSITE_SRC_OVER = 3;
const COMPOSITE_DEST_OVER = 4;
const COMPOSITE_SRC_IN = 5;
const COMPOSITE_DEST_IN = 6;
const COMPOSITE_SRC_OUT = 7;
const COMPOSITE_DEST_OUT = 8;
const COMPOSITE_SRC_ATOP = 9;
const COMPOSITE_DEST_ATOP = 10;
const COMPOSITE_XOR = 11;
const COMPOSITE_PLUS = 12;
const COMPOSITE_SCREEN = 13;
const COMPOSITE_OVERLAY = 14;
const COMPOSITE_DARKEN = 15;
const COMPOSITE_LIGHTEN = 16;
const COMPOSITE_COLOR_DODGE = 17;
const COMPOSITE_COLOR_BURN = 18;
const COMPOSITE_HARD_LIGHT = 19;
const COMPOSITE_SOFT_LIGHT = 20;
const COMPOSITE_DIFFERENCE = 21;
const COMPOSITE_EXCLUSION = 22;
const COMPOSITE_MULTIPLY = 23;
const COMPOSITE_HSL_HUE = 24;
const COMPOSITE_HSL_SATURATION = 25;
const COMPOSITE_HSL_COLOR = 26;
const COMPOSITE_HSL_LUMINOSITY = 27;

// COLRv1 paint types (multiple formats have the same type)
const PAINT_LAYERS = 1;
const PAINT_SHAPE = 2;
const PAINT_TRANSFORM = 3;
const PAINT_COMPOSE = 4;

// there are 4 types of paint tables: PAINT_LAYERS, PAINT_TRANSFORM, PAINT_SHAPE, PAINT_COMPOSE
// all DAG leaves are PAINT_COMPOSE
const PAINT_TYPES = [
	0,
	PAINT_LAYERS,
	PAINT_COMPOSE,
	PAINT_COMPOSE,
	PAINT_COMPOSE,
	PAINT_COMPOSE,
	PAINT_COMPOSE,
	PAINT_COMPOSE,
	PAINT_COMPOSE,
	PAINT_COMPOSE,
	PAINT_SHAPE,
	PAINT_LAYERS,
	PAINT_TRANSFORM,
	PAINT_TRANSFORM,
	PAINT_TRANSFORM,
	PAINT_TRANSFORM,
	PAINT_TRANSFORM,
	PAINT_TRANSFORM,
	PAINT_TRANSFORM,
	PAINT_TRANSFORM,
	PAINT_TRANSFORM,
	PAINT_TRANSFORM,
	PAINT_TRANSFORM,
	PAINT_TRANSFORM,
	PAINT_TRANSFORM,
	PAINT_TRANSFORM,
	PAINT_TRANSFORM,
	PAINT_TRANSFORM,
	PAINT_TRANSFORM,
	PAINT_TRANSFORM,
	PAINT_TRANSFORM,
	PAINT_TRANSFORM,
	PAINT_COMPOSE,
];

const PAINT_VAR_OPERANDS = [0,0,1,1,6,6,6,6,4,4,0,0,6,6,2,2,2,2,4,4,1,1,3,3,1,1,3,3,2,2,4,4,0]; // the number of variable operands that each paint has, indexed by paint.format (prepended with a record for invalid paint.format 0) thus 33 items from 0 to 32

// COLRv1 gradient extend modes
const EXTEND_PAD = 0;
const EXTEND_REPEAT = 1;
const EXTEND_REFLECT = 2;


// table decoders are called *after* the first part has been decoded using the FORMATS[<tableTag>] definition
// - font is the SamsaFont object
// - buf is a SamsaBuffer object already set up to cover the table data only, initialized with the table's offset being p=0 and length = its length
// - return (none), but font.<tableTag> now contains more (possibly all) of the decoded table data
const TABLE_DECODERS = {

	"avar": (font, buf) => {
		// avar1 and avar2
		// https://learn.microsoft.com/en-us/typography/opentype/spec/avar
		// https://github.com/harfbuzz/boring-expansion-spec/blob/main/avar2.md
		font.avar.axisSegmentMaps = [];
		console.assert(font.avar.axisCount === font.fvar.axisCount || font.avar.axisCount === 0, `fvar.axisCount (${font.fvar.axisCount}) and avar.axisCount (${font.avar.axisCount}) must match, or else avar.axisCount must be 0`);
		for (let a=0; a<font.avar.axisCount; a++) {
			const positionMapCount = buf.u16;
			font.avar.axisSegmentMaps[a] = [];
			for (let p=0; p<positionMapCount; p++) {
				font.avar.axisSegmentMaps[a].push([ buf.f214, buf.f214 ]);
			}
		}

		// avar2 only
		if (font.avar.version[0] == 2) {
			font.avar.axisIndexMapOffset = buf.u32;
			font.avar.itemVariationStoreOffset = buf.u32; // we use this key, rather that in the spec, so that it will get picked up by the ItemVariationStore decoder along with those of MVAR, HVAR, etc.
			if (font.avar.axisIndexMapOffset) {
				buf.seek(font.avar.axisIndexMapOffset);
				font.avar.axisIndexMap = buf.decodeIndexMap();
			}
			// else we must use implicit mappings later			
		}
	},

	"cmap": (font, buf) => {
		// https://learn.microsoft.com/en-us/typography/opentype/spec/cmap
		const cmap = font.cmap;
		cmap.lookup = []; // the main cmap lookup table
		cmap.encodingRecords = [];

		// step thru the encodingRecords
		const validEncodings = [ 0 * 0x10000 + 3, 3 * 0x10000 + 1, 3 * 0x10000 + 10 ]; // we encode [0,3], [3,1] and [3,10] like this for easy searching
		buf.seek(4);
		for (let t=0; t < cmap.numTables; t++) {
			const encodingRecord = buf.decode(FORMATS.EncodingRecord);
			if (validEncodings.includes(encodingRecord.platformID * 0x10000 + encodingRecord.encodingID)) {
				cmap.encodingRecord = encodingRecord; // this will prefer the later ones, so [3,10] better than [3,1]
			}
			cmap.encodingRecords.push(encodingRecord);
		}
		
		// select the last encodingRecord we found that was valid for us [3,10] is better than [3,1] and [0,3]
		if (cmap.encodingRecord) {

			buf.seek(cmap.encodingRecord.subtableOffset);
			const characterMap = buf.decode(FORMATS.CharacterMap);

			// parse the format, then switch to format-specific parser
			// TODO: we’d save memory by zipping through the binary live...
			// These formats are decoded ready for quick lookup in SamsaFont.glyphIdFromUnicode()
			switch (characterMap.format) {

				case 0: {
					characterMap.mapping = [];
					for (let c=0; c<256; c++) {
						characterMap.mapping[c] = buf.u8;
					}
					break;
				}

				case 4: {
					const segCount = buf.u16 / 2;
					buf.seekr(6); // skip binary search params
					characterMap.segments = [];
					for (let s=0; s<segCount; s++)
						characterMap.segments[s] = {end: buf.u16};
					buf.seekr(2); // skip reservedPad
					for (let s=0; s<segCount; s++)
						characterMap.segments[s].start = buf.u16;
					for (let s=0; s<segCount; s++)
						characterMap.segments[s].idDelta = buf.u16;
					characterMap.idRangeOffsetOffset = buf.tell();
					for (let s=0; s<segCount; s++)
						characterMap.segments[s].idRangeOffset = buf.u16;
					break;
				}

				case 12: {
					const numGroups = buf.u32;
					characterMap.groups = [];
					for (let grp=0; grp<numGroups; grp++) {
						characterMap.groups.push({ start: buf.u32, end: buf.u32, glyphId: buf.u32 });
					}
					break;
				}

				default:
					console.log(`Warning: Not handling cmap format ${characterMap.format}`);
					break;
			}
			cmap.characterMap = characterMap;
		}
	},

	"COLR": (font, buf) => {
		// https://learn.microsoft.com/en-us/typography/opentype/spec/colr
		const colr = font.COLR;
		if (colr.version <= 1) {

			// COLRv0 offsets (it would be ok to look these up live with binary search)
			colr.baseGlyphRecords = [];
			if (colr.numBaseGlyphRecords) {
				buf.seek(colr.baseGlyphRecordsOffset);
				for (let i=0; i<colr.numBaseGlyphRecords; i++)  {
					const glyphID = buf.u16;
					colr.baseGlyphRecords[glyphID] = [buf.u16, buf.u16]; // firstLayerIndex, numLayers
				}
			}

			if (colr.version == 1) {

				// COLRv1 offsets (it would be ok to look these up live with binary search)
				if (colr.baseGlyphListOffset) {
					buf.seek(colr.baseGlyphListOffset);
					colr.numBaseGlyphPaintRecords = buf.u32;
					colr.baseGlyphPaintRecords = [];
					for (let i=0; i<colr.numBaseGlyphPaintRecords; i++)  {
						const glyphID = buf.u16;
						colr.baseGlyphPaintRecords[glyphID] = colr.baseGlyphListOffset + buf.u32;
					}
				}

				// COLRv1 layerList
				// - from the spec: "The LayerList is only used in conjunction with the BaseGlyphList and, specifically, with PaintColrLayers tables; it is not required if no color glyphs use a PaintColrLayers table. If not used, set layerListOffset to NULL"
				colr.layerList = [];
				if (colr.layerListOffset) {
					buf.seek(colr.layerListOffset);
					colr.numLayerListEntries = buf.u32;
					for (let lyr=0; lyr < colr.numLayerListEntries; lyr++)
						colr.layerList[lyr] = colr.layerListOffset + buf.u32;
				}

				// COLRv1 varIndexMap
				if (colr.varIndexMapOffset) {
					buf.seek(colr.varIndexMapOffset);
					colr.varIndexMap = buf.decodeIndexMap();
				}
			}
		}
	},

	"CPAL": (font, buf) => {
		// load CPAL table fully
		// https://learn.microsoft.com/en-us/typography/opentype/spec/cpal
		const cpal = font.CPAL;
		cpal.colors = [];
		cpal.palettes = [];
		cpal.paletteEntryLabels = [];

		// decode colorRecords
		buf.seek(cpal.colorRecordsArrayOffset);
		for (let c=0; c<cpal.numColorRecords; c++) {
			cpal.colors[c] = buf.u32; // [blue, green, red, alpha as u32]
		}

		// decode paletteEntryLabels
		if (cpal.paletteEntryLabelsArrayOffset) {
			buf.seek(cpal.paletteEntryLabelsArrayOffset);
			for (let pel=0; pel<cpal.numPaletteEntries; pel++) {
				const nameId = buf.u16;
				if (nameId !== 0xffff)
					cpal.paletteEntryLabels[pel] = font.names[nameId];
			}
		}

		// decode palettes: name, type, colors
		for (let pal=0; pal<cpal.numPalettes; pal++) {
			const palette = { name: "", type: 0, colors: [] };

			// name
			if (cpal.paletteLabelsArrayOffset) {
				buf.seek(cpal.paletteLabelsArrayOffset + 2 * pal);
				const nameId = buf.u16;
				if (nameId !== 0xffff) {
					palette.name = font.names[nameId];
				}
			}

			// type
			if (cpal.paletteTypesArrayOffset) {
				buf.seek(cpal.paletteTypesArrayOffset + 2 * pal);
				palette.type = buf.u16;
			}

			// colors
			for (let e=0; e<cpal.numPaletteEntries; e++) {
				palette.colors[e] = cpal.colors[cpal.colorRecordIndices[pal] + e];
			}

			cpal.palettes.push(palette);
		}
	},

	"fvar": (font, buf) => {
		// load fvar axes and instances
		// https://learn.microsoft.com/en-us/typography/opentype/spec/fvar
		const fvar = font.fvar;
		fvar.axes = [];
		buf.seek(fvar.axesArrayOffset);
		for (let a=0; a<fvar.axisCount; a++) {
			fvar.axes.push(buf.decode(FORMATS.VariationAxisRecord));
		}
		fvar.instances = [];
		const includePostScriptNameID = fvar.instanceSize == fvar.axisCount * 4 + 6; // instanceSize determins whether postScriptNameID is included
		for (let i=0; i<fvar.instanceCount; i++) {
			const instance = buf.decode(FORMATS.InstanceRecord, fvar.axisCount, includePostScriptNameID);
			instance.name = font.names[instance.subfamilyNameID];
			fvar.instances.push(instance);
		}
	},

	"gvar": (font, buf) => {
		// decode gvar’s sharedTuples array, so we can precalculate scalars (leave the rest for JIT)
		// https://learn.microsoft.com/en-us/typography/opentype/spec/gvar
		const gvar = font.gvar;
		buf.seek(gvar.sharedTuplesOffset);
		gvar.sharedTuples = [];
		for (let t=0; t < gvar.sharedTupleCount; t++) {
			const tuple = [];
			for (let a=0; a<gvar.axisCount; a++) {
				tuple.push(buf.f214); // these are the peaks, we have to create start and end
			}
			gvar.sharedTuples.push(tuple);
		}

		// // This is good, I think! But let’s try it only when we are happy with other stuff
		// // - we can also use getVariationScalar() (singular) or why not getVariationScalars() plural...?
		// this.gvar.sharedRegions = [];
		// buf.seek(this.tables["gvar"].offset + this.gvar.sharedTuplesOffset);
		// for (let t=0; t < this.gvar.sharedTupleCount; t++) {
		// 	const region = [];
		// 	for (let a=0; a<this.gvar.axisCount; a++) {
		// 		const peak = buf.f214; // only the peak is stored, we create start and end
		// 		if (peak < 0) {
		// 			start = -1;
		// 			end = 0;
		// 		}
		// 		else if (peak > 0) {
		// 			start = 0;
		// 			end = 1;
		// 		}
		// 		region.push([start, peak, end]);
		// 	}
		// 	this.gvar.sharedRegions.push(region);
		// }
		// Hmm, it’s not that great, actually, since it’s always peaks only at extremes; on instantiation we just need to calculate a scalar for each tuple

		// get tupleOffsets array (TODO: we could get these offsets JIT)
		buf.seek(20);
		gvar.tupleOffsets = [];
		for (let g=0; g <= font.maxp.numGlyphs; g++) { // <=
			gvar.tupleOffsets[g] = gvar.flags & 0x01 ? buf.u32 : buf.u16 * 2;
		}
	},

	"hmtx": (font, buf) => {
		// decode horizontal metrics
		// https://learn.microsoft.com/en-us/typography/opentype/spec/hmtx
		const numberOfHMetrics = font.hhea.numberOfHMetrics;
		const hmtx = font.hmtx = [];
		let g=0;
		while (g<numberOfHMetrics) {
			hmtx[g++] = buf.u16;
			buf.seekr(2); // skip over lsb, we only record advance width
		}
		while (g<font.maxp.numGlyphs) {
			hmtx[g++] = hmtx[numberOfHMetrics-1];
		}
	},

	"HVAR": (font, buf) => {
		// https://learn.microsoft.com/en-us/typography/opentype/spec/hvar
		buf.seek(font.HVAR.advanceWidthMappingOffset);
		font.HVAR.indexMap = buf.decodeIndexMap();
	},

	"MVAR": (font, buf) => {
		// decode MVAR value records
		// https://learn.microsoft.com/en-us/typography/opentype/spec/mvar
		font.MVAR.valueRecords = {};
		for (let v=0; v<font.MVAR.valueRecordCount; v++) {
			buf.seek(12 + v * font.MVAR.valueRecordSize); // we are dutifully using valueRecordSize to calculate offset, but it should always be 8 bytes
			font.MVAR.valueRecords[buf.tag] = [buf.u16, buf.u16]; // deltaSetOuterIndex, deltaSetInnerIndex
		}
	},

	"name": (font, buf) => {
		// decode name table strings
		// https://learn.microsoft.com/en-us/typography/opentype/spec/name
		const name = font.name; // font.name is the name table info directly
		font.names = []; // font.names is the names ready to use as UTF8 strings, indexed by nameID in the best platformID/encondingID/languageID match
		name.nameRecords = [];
		for (let r=0; r<name.count; r++) {
			name.nameRecords.push(buf.decode(FORMATS.NameRecord));
		}
		name.nameRecords.forEach(record => {
			buf.seek(name.storageOffset + record.stringOffset);
			record.string = buf.decodeNameString(record.length);
			if (record.platformID == 3 && record.encodingID == 1 && record.languageID == 0x0409) {
				font.names[record.nameID] = record.string; // only record 3, 1, 0x0409 for easy use
			}
		});
	},

	"vmtx": (font, buf) => {
		// decode vertical metrics
		// https://learn.microsoft.com/en-us/typography/opentype/spec/vmtx
		const numOfLongVerMetrics = font.vhea.numOfLongVerMetrics;
		const vmtx = font.vmtx = [];
		let g=0;
		while (g<numOfLongVerMetrics) {
			vmtx[g++] = buf.u16;
			buf.seekr(2); // skip over tsb, we only record advance height
		}
		while (g<font.maxp.numGlyphs) {
			vmtx[g++] = vmtx[numOfLongVerMetrics-1];
		}
	},
}

const SVG_PREAMBLE = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1000" height="1000">\n<defs></defs>\n`; // we’ll replace <defs></defs> later if necessary

// non-exported functions
function endianness (str) {
	const buf = new ArrayBuffer(2);
	const testArray = new Uint16Array(buf);
	const testDataView = new DataView(buf);
	testArray[0] = 0x1234; // LE or BE
	const result = testDataView.getUint16(0); // BE
	const endianness = result == 0x1234 ? "BE" : "LE";
	return str === undefined ? endianness : str == endianness;
}

function clamp (num, min, max) {
	if (num < min)
		num = min;
	else if (num > max)
		num = max;
	return num;
}

function inRange (num, min, max) {
	return num >= min && num <= max;
}

function validateTuple (tuple, axisCount) {
	if (!Array.isArray(tuple))
		return false;
	if (tuple.length != axisCount)
		return false;
	for (let a=0; a < axisCount; a++) {
		 if (typeof tuple[a] != "number" || !inRange(tuple[a], -1, 1))
			return false;
	}
	return true;
}

/*
// paint a fully decomposed COLRv1 glyph
function svgPaint (paint) {

	


}

// output a diagrammatic representation of a paint tree
function diagramPaint (paint) {

}

function processPaintSVG (paint, rendering) {

	// recurse until we arrive at a PaintSolid or PaintGradient
	// then construct the svg

	if (rendering.depth)
		rendering.depth++;
	else
		rendering.depth = 0;

	if (rendering.depth > 100) {
		console.log("rendering depth >100");
		console.log(paint);
		console.log(rendering);
		//process.exit();
	}

	switch (paint.type) {

		case PAINT_LAYERS: {
			for (let l=0; l < layers.length; l++) {
				processPaintSVG(paintNext, rendering);
			}
			break;
		}

		case PAINT_GLYPH: {

			processPaintSVG(paintNext, rendering);
		}

		case PAINT_TRANSFORM: {
			let str;
			switch (transform.type) {
				case "rotate": 
					str = `rotate(${transform.angle} ${transform.x} ${transform.y})`;
					break;
			}
			processPaintSVG(paintNext, rendering);
		}

		case PAINT_COMPOSITE: {
			processPaintSVG(paintNext, rendering);
		}

		case PAINT_FILL: {
			const svg = "";

			if (rendering.transform) {
				rendering.transform.split(" ") // this concatenates all the transforms, matrix, rotate, skew, translate
	
			}
	
			if (rendering.gradient) {
	
	
			}
			else { // rendering fill
	
	
			}
	
			return svg;
	
		}

	}
}

function finalizeSVG (svgElements, defs, transform, style) {

	let svgString = SVG_PREAMBLE;
	if (defs.length)
		svgString += "<defs>" + defs.join() + "</defs>";
	svgString +=  svgElements;
	svgString += "</g>";
	return svgString;
}

const PAINT_HANDLERS = {
	// handlers for text output
	text: (paint) => { console.log(paint); console.log("------------------------"); },


	// handlers for SVG output
	svg: [
		null, // 0 (does not exist)

		// 1: PaintColrLayers
		(paint, rendering) => {
			console.log("PaintColrLayers");
		},
		
		// 2: PaintSolid
		(paint, rendering) => {
			console.log("PaintSolid");
		},
		null, // 3: PaintVarSolid

		// 4: PaintLinearGradient
		(paint, rendering) => {
			console.log("PaintLinearGradient");
		},
		null, // 5: PaintVarLinearGradient

		// 6: PaintRadialGradient
		(paint, rendering) => {
			console.log("PaintRadialGradient");
		},
		null, // 7: PaintVarRadialGradient

		// 8: PaintSweepGradient
		(paint, rendering) => {
			console.log("PaintSweepGradient");
		},
		null, // 9: PaintVarSweepGradient

		// 10: PaintGlyph
		(paint, rendering) => {
			console.log("PaintGlyph");
		},

		// 11: PaintColrGlyph
		(paint, rendering) => {
			console.log("PaintColrGlyph");
		},

		// 12 : PaintTransform
		(paint, rendering) => {
			console.log("PaintSweepGradient");
		},
		null, // 13: PaintVarTransform

		// 14 : PaintTranslate
		(paint, rendering) => {
			console.log("PaintTranslate");
		},
		null, // 15: PaintVarTranslate

		// 16: PaintScale
		(paint, rendering) => {
			console.log("PaintScale");
		},
		null, // 17: PaintVarScale
		null, // 18: PaintScaleAroundCenter
		null, // 19: PaintVarScaleAroundCenter
		null, // 20: PaintScaleUniform
		null, // 21: PaintVarScaleUniform
		null, // 22: PaintScaleUniformAroundCenter
		null, // 23: PaintVarScaleUniformAroundCenter

		// 24: PaintRotate
		(paint, rendering) => {
			console.log("PaintRotate");
		},
		null, // 25: PaintVarRotate
		null, // 26: PaintRotateAroundCenter
		null, // 27: PaintVarRotateAroundCenter

		// 28: PaintSkew
		(paint, rendering) => {
			console.log("PaintSkew");
		},
		null, // 29: PaintVarSkew
		null, // 30: PaintSkewAroundCenter, PaintVarSkewAroundCenter
		null, // 31: PaintSkewAroundCenter, PaintVarSkewAroundCenter

		// 32: PaintComposite
		(paint, rendering) => {
			console.log("PaintComposite");
		},
	],


	// handlers for SVG output
	_svg: [
		null, // 0 (does not exist)

		// 1: PaintColrLayers
		(paint, rendering) => {
			console.log("PaintColrLayers");
		},
		
		// 2: PaintSolid
		(paint, rendering) => {
			console.log("PaintSolid");
		},
		null, // 3: PaintVarSolid

		// 4: PaintLinearGradient
		(paint, rendering) => {
			console.log("PaintLinearGradient");
		},
		null, // 5: PaintVarLinearGradient

		// 6: PaintRadialGradient
		(paint, rendering) => {
			console.log("PaintRadialGradient");
		},
		null, // 7: PaintVarRadialGradient

		// 8: PaintSweepGradient
		(paint, rendering) => {
			console.log("PaintSweepGradient");
		},
		null, // 9: PaintVarSweepGradient

		// 10: PaintGlyph
		(paint, rendering) => {
			console.log("PaintGlyph");
		},

		// 11: PaintColrGlyph
		(paint, rendering) => {
			console.log("PaintColrGlyph");
		},

		// 12 : PaintTransform
		(paint, rendering) => {
			console.log("PaintSweepGradient");
		},
		null, // 13: PaintVarTransform

		// 14 : PaintTranslate
		(paint, rendering) => {
			console.log("PaintTranslate");
		},
		null, // 15: PaintVarTranslate

		// 16: PaintScale
		(paint, rendering) => {
			console.log("PaintScale");
		},
		null, // 17: PaintVarScale
		null, // 18: PaintScaleAroundCenter
		null, // 19: PaintVarScaleAroundCenter
		null, // 20: PaintScaleUniform
		null, // 21: PaintVarScaleUniform
		null, // 22: PaintScaleUniformAroundCenter
		null, // 23: PaintVarScaleUniformAroundCenter

		// 24: PaintRotate
		(paint, rendering) => {
			console.log("PaintRotate");
		},
		null, // 25: PaintVarRotate
		null, // 26: PaintRotateAroundCenter
		null, // 27: PaintVarRotateAroundCenter

		// 28: PaintSkew
		(paint, rendering) => {
			console.log("PaintSkew");
		},
		null, // 29: PaintVarSkew
		null, // 30: PaintSkewAroundCenter, PaintVarSkewAroundCenter
		null, // 31: PaintSkewAroundCenter, PaintVarSkewAroundCenter

		// 32: PaintComposite
		(paint, rendering) => {
			console.log("PaintComposite");
		},
	],
};
Object.keys(PAINT_HANDLERS).forEach(key => {

	let lastNonNullHandler = null;
	for (let h=1; h<PAINT_HANDLERS[key].length; h++) { // skip the first entry, which is always null
		if (PAINT_HANDLERS[key][h]) {
			lastNonNullHandler = PAINT_HANDLERS[key][h];
		}
		else {
			PAINT_HANDLERS[key][h] = lastNonNullHandler;
		}	
	}
});
*/


// SamsaBuffer is a DataView subclass, constructed from an ArrayBuffer in exactly the same way as DataView
// - the main difference is that it keeps track of a memory pointer, which is incremented on read/write
// - we also keep track of a phase, which is used for nibble reads/writes
// - there are numerous decode/encode methods for converting complex data structures to and from binary
class SamsaBuffer extends DataView {
	
	constructor(buffer, byteOffset, byteLength) {
		super(buffer, byteOffset, byteLength);
		this.p = 0; // the memory pointer
		this.phase = false; // phase for nibbles

		this.getters = [];
		this.getters[U4] = () => this.u4;
		this.getters[U8] = () => this.u8;
		this.getters[I8] = () => this.i8;
		this.getters[U16] = () => this.u16;
		this.getters[I16] = () => this.i16;
		this.getters[U24] = () => this.u24;
		this.getters[I24] = () => this.i24;
		this.getters[U32] = () => this.u32;
		this.getters[I32] = () => this.i32;
		this.getters[U64] = () => this.u64;
		this.getters[I64] = () => this.i64;
		this.getters[F214] = () => this.f214;
		this.getters[F1616] = () => this.f1616;
		this.getters[TAG] = () => this.tag;
		this.getters[STR] = () => this.tag;

		this.setters = [];
		this.setters[U4] = n => this.u4 = n;
		this.setters[U8] = n => this.u8 = n;
		this.setters[I8] = n => this.i8 = n;
		this.setters[U16] = n => this.u16 = n;
		this.setters[I16] = n => this.i16 = n;
		this.setters[U24] = n => this.u24 = n;
		this.setters[I24] = n => this.i24 = n;
		this.setters[U32] = n => this.u32 = n;
		this.setters[I32] = n => this.i32 = n;
		this.setters[U64] = n => this.u64 = n;
		this.setters[I64] = n => this.i64 = n;
		this.setters[F214] = n => this.f214 = n;
		this.setters[F1616] = n => this.f1616 = n;
		this.setters[TAG] = n => this.tag = n;
		this.setters[STR] = n => this.tag = n;

		return this;
	}

	// get current position
	tell() {
		return this.p;
	}

	// seek to absolute position
	seek(p) {
		this.p = p;
	}

	// seek to relative position
	seekr(p) {
		this.p += p;
	}

	// validate offset
	seekValid(p) {
		return p >= 0 && p < this.byteLength;
	}

	// uint64, int64
	set u64(num) {
		this.setUint32(this.p, num >> 32);
		this.setUint32(this.p+4, num & 0xffffffff);
		this.p += 8;
	}

	get u64() {
		const ret = (this.getUint32(this.p) << 32) + this.getUint32(this.p+4);
		this.p += 8;
		return ret;
	}

	set i64(num) {
		this.setUint32(this.p, num >> 32);
		this.setUint32(this.p+4, num & 0xffffffff);
		this.p += 8;
	}

	get i64() {
		const ret = (this.getUint32(this.p) << 32) + this.getUint32(this.p+4);
		this.p += 8;
		return ret;
	}

	// uint32, int32, f16dot16
	set u32(num) {
		this.setUint32(this.p, num);
		this.p += 4;
	}

	get u32() {
		const ret = this.getUint32(this.p);
		this.p += 4;
		return ret;
	}

	set i32(num) {
		this.setInt32(this.p, num);
		this.p += 4;
	}

	get i32() {
		const ret = this.getInt32(this.p);
		this.p += 4;
		return ret;
	}

	set f1616(num) {
		this.setInt32(this.p, num * 0x10000);
		this.p += 4;
	}

	get f1616() {
		const ret = this.getInt32(this.p) / 0x10000;
		this.p += 4;
		return ret;
	}

	// uint24, int24
	set u24(num) {
		this.setUint16(this.p, num >> 8);
		this.setUint8(this.p+2, num & 0xff);
		this.p += 3;
	}

	get u24() {
		const ret = (this.getUint16(this.p) << 8) + this.getUint8(this.p+2);
		this.p += 3;
		return ret;
	}

	set i24(num) {
		this.setUint16(this.p, num >> 8);
		this.setUint8(this.p+2, num & 0xff);
		this.p += 3;
	}

	get i24() {
		const ret = (this.getInt16(this.p) * 256) + this.getUint8(this.p+2);
		this.p += 3;
		return ret;
	}

	// uint16, int16, f2dot14
	set u16(num) {
		this.setUint16(this.p, num);
		this.p += 2;
	}

	get u16() {
		const ret = this.getUint16(this.p);
		this.p += 2;
		return ret;
	}

	set u16_255(num) {
		const oneMoreByteCode1    = 255;
		const oneMoreByteCode2    = 254;
		const wordCode            = 253;
		const lowestUCode         = 253;
		if (num < 253) {
			this.u8 = num;
		}
		else if (num < 506) {
			this.u8 = oneMoreByteCode1;
			this.u8 = num - lowestUCode;
		}
		else if (num < 759) {
			this.u8 = oneMoreByteCode2;
			this.u8 = num - lowestUCode * 2;
		}
		else {
			this.u8 = wordCode;
			this.u16 = num;
		}
	}

	get u16_255() {
		// https://www.w3.org/TR/WOFF2/#glyf_table_format
		const oneMoreByteCode1    = 255;
		const oneMoreByteCode2    = 254;
		const wordCode            = 253;
		const lowestUCode         = 253;
		let value, value2;

		const code = this.u8;
		if (code == wordCode) {
			value = this.u8;
			value <<= 8;
			value |= this.u8;
		}
		else if (code == oneMoreByteCode1)  {
			value = this.u8 + lowestUCode;
		}
		else if (code == oneMoreByteCode2) {
			value = this.u8 + lowestUCode*2;
		}
		else {
			value = code;
		}
		return value;
		}

	set i16(num) {
		this.setInt16(this.p, num);
		this.p += 2;
	}

	get i16() {
		const ret = this.getInt16(this.p);
		this.p += 2;
		return ret;
	}

	set f214(num) {
		this.setInt16(this.p, num * 0x4000);
		this.p += 2;
	}

	get f214() {
		const ret = this.getInt16(this.p) / 0x4000;
		this.p += 2;
		return ret;
	}

	// uint8, int8
	set u8(num) {
		this.setUint8(this.p++, num);
	}

	get u8() {
		return this.getUint8(this.p++);
	}

	set i8(num) {
		this.setInt8(this.p++, num);
	}

	get i8() {
		return this.getInt8(this.p++);
	}

	// u4 (nibble)
	set u4(num) {
		// note that writing the high nibble does not zero the low nibble
		const byte = this.getUint8(this.p);
		if (this.phase) {
			this.setUint8(this.p++, (byte & 0xf0) | (num & 0x0f));
		}
		else {
			this.setUint8(this.p, (byte & 0x0f) | (num << 4));
		}
		this.phase = !this.phase;
	}

	get u4() {
		const byte = this.getUint8(this.p);
		this.phase = !this.phase;
		if (this.phase) {
			return (byte & 0xf0) >> 4;
		}
		else {
			this.p++;
			return byte & 0x0f;
		}
	}

	// tag
	set tag(str) {
		let length = 4;
		for (let i = 0; i < length; i++) {
			this.setUint8(this.p++, str.charCodeAt(i));
		}
	}

	get tag() {
		let ret = "";
		let length = 4;
		for (let i = 0; i < length; i++) {
			ret += String.fromCharCode(this.getUint8(this.p++));
		}
		return ret;
	}

	compare(condition) {
		const [a, comparison, b] = condition;
		switch (comparison) {
			case ">=": return a >= b;
			case "<=": return a <= b;
			case "==": return a == b;
			case "<": return a < b;
			case ">": return a > b;
			case "!=": return a != b;
		}
	}

	checkSum(offset=0, length, headTable) {
		if (length === undefined) {
			length = this.byteLength - offset;
		}
		const pSaved = this.tell();
		const mainLength = 4 * Math.floor(length/4);
		let sum = 0;
		this.seek(offset);

		// sum the entire table except any trailing bytes that are not a multiple of 4
		if (!headTable) {
			// this is not the head table :)
			while (this.p < offset + mainLength) {
				sum += this.u32;
				sum &= 0xffffffff;
				sum >>>= 0;
			}
		}
		else {
			// special handling for head table:  skip over the checksumAdjustment field
			while (this.p < offset + mainLength) {
				if (this.p - offset === 8) {
					this.p += 4;
				}
				else {
					sum += this.u32;
					sum &= 0xffffffff;
					sum >>>= 0;
				}
			}
		}

		// sum any trailing bytes
		while (this.p < offset + length) {
			const shift = (3 - (this.p - offset) % 4) * 8;
			sum += this.u8 << shift;
			sum >>>= 0;
		}

		sum &= 0xffffffff; // unnecessary?
		sum >>>= 0; // unnecessary?
		this.seek(pSaved);
		return sum;
	}

	decode(objType, arg0, arg1, arg2) { // TODO: test first for typeof objType[key] == "number" as it’s the most common
		const obj = {};
		Object.keys(objType).forEach(key => {
			if (key.startsWith("_IF_")) {
				// decode conditional block
				const condition = [...objType[key][0]];
				if (condition[0] == "_ARG0_")
					condition[0] = arg0;
				else if (condition[0] == "_ARG1_")
					condition[0] = arg1;
				else if (condition[0] == "_ARG2_")
					condition[0] = arg2;
				else
					condition[0] = obj[condition[0]];

				if (this.compare(condition)) {
					const obj_ = this.decode(objType[key][1]);
					Object.keys(obj_).forEach(key_ => {
						obj[key_] = obj_[key_];
					})
				}
			}
			else if (Array.isArray(objType[key])) {
				// decode array of similar values
				let count;
				if (Number.isInteger(objType[key][1]))
					count = objType[key][1];
				else if (objType[key][1] == "_ARG0_")
					count = arg0;
				else if (objType[key][1] == "_ARG1_")
					count = arg1;
				else if (objType[key][1] == "_ARG2_")
					count = arg2;
				else
					count = obj[objType[key][1]];

				obj[key] = [];
				for (let c=0; c<count; c++) {
					obj[key].push(this.getters[objType[key][0]]());
				}
			}
			else {
				// simple decode
				obj[key] = this.getters[objType[key]]();
			}
		});
		return obj;
	}

	encode(objType, obj, arg0, arg1, arg2) {
		Object.keys(objType).forEach(key => {
			if (key.startsWith("_IF_")) {
				// encode conditional block
				const condition = [...objType[key][0]];
				if (condition[0] == "_ARG0_")
					condition[0] = arg0;
				else if (condition[0] == "_ARG1_")
					condition[0] = arg1;
				else if (condition[0] == "_ARG2_")
					condition[0] = arg2;
				else
					condition[0] = obj[condition[0]];

				if (this.compare(condition)) {
					this.encode(objType[key][1], obj);
				}
			}
			else if (Array.isArray(objType[key])) {
				// encode array of similar values
				let count;
				if (Number.isInteger(objType[key][1]))
					count = objType[key][1];
				else if (objType[key][1] == "_ARG0_")
					count = arg0;
				else if (objType[key][1] == "_ARG1_")
					count = arg1;
				else if (objType[key][1] == "_ARG2_")
					count = arg2;
				else
					count = obj[objType[key][1]];

				for (let c=0; c<count; c++) {
					this.setters[objType[key][0]](obj[key][c]);
				}
			}
			else {
				// simple encode
				this.setters[objType[key]](obj[key]);
			}
		});
	}

	decodeArray (type, length) {
		const getter = this.getters[type];
		const array = [];
		for (let i=0; i<length; i++) {
			array.push(getter());
		}
		return array;
	}

	encodeArray (array, type, length) {
		if (length === undefined) {
			length = array.length;
		}
		const setter = this.setters[type];
		for (let i=0; i<length; i++) {
			setter(array[i]);
		}
	}

	decodeNameString(length) {
		// TODO: handle UTF-8 beyond 16 bits
		let str = "";
		for (let i=0; i<length; i+=2) {
			str += String.fromCharCode(this.u16);
		}
		return str;
	}

	encodeNameString(str) {
		// TODO: handle UTF-8 beyond 16 bits
		for (let c=0; c<str.length; c++) {
			this.u16 = str.charCodeAt(c);
		}
		// TODO: return bytelength? it may be different from str.length*2
	}

	decodeGlyph(options={}) {
		
		//const metrics = options.metrics ?? [0, 0, 0, 0];
		const metrics = options.metrics === undefined ? [0, 0, 0, 0] : options.metrics;
		const glyph = options.length ? new SamsaGlyph(this.decode(FORMATS.GlyphHeader)) : new SamsaGlyph();
		if (options.id)
			glyph.id = options.id;

		// set metrics from the font’s hmtx
		glyph.font = options.font;
		if (glyph.font.hmtx)	{
			metrics[1] = glyph.font.hmtx[glyph.id];
		}

		// simple glyph
		if (glyph.numberOfContours > 0) {

			glyph.endPts = [];

			// end points of each contour
			for (let c=0; c<glyph.numberOfContours; c++) {
				glyph.endPts.push(this.u16);
			}
			glyph.numPoints = glyph.endPts[glyph.numberOfContours -1] + 1;

			// instructions (skip)
			this.seekr(glyph.instructionLength = this.u16);

			// flags
			const flags = [];
			for (let pt=0; pt<glyph.numPoints; ) {
				let flag = this.u8;
				flags[pt++] = flag;
				if (flag & 0x08) {
					const repeat = this.u8;
					for (let r=0; r<repeat; r++) 
						flags[pt++] = flag;
				}
			}

			// points
			console.assert(flags.length === glyph.numPoints, "Error in glyph decoding: flags.length (%i) != glyph.numPoints (%i)", flags.length, glyph.numPoints);
			let x_=0, y_=0, x, y;
			flags.forEach((flag,f) => {
				// const mask = flag & 0x12;
				// x += (mask == 0x12 ? this.u8 : (mask == 0x02 ? -this.u8 : (mask == 0x00 ? this.i16 : 0)));
				// glyph.points[f] = [x, 0, flag & 0x01];

				switch (flag & 0x12) { // x
					case 0x00: x = x_ + this.i16; break;
					case 0x02: x = x_ - this.u8; break;
					case 0x10: x = x_; break;
					case 0x12: x = x_ + this.u8; break;
				}
				x_ = x;
				glyph.points[f] = [x, 0, flag & 0x01];
			});
			flags.forEach((flag,f) => {
				switch (flag & 0x24) { // y
					case 0x00: y = y_ + this.i16; break;
					case 0x04: y = y_ - this.u8; break;
					case 0x20: y = y_; break;
					case 0x24: y = y_ + this.u8; break;
				}
				y_ = y;
				glyph.points[f][1] = y;
			});
		}
		
		// composite glyph
		// - we DO add points for composite glyphs: one per component (they are the x and y offsets), and the 4 extra metrics points
		// - when we process these glyphs, we look at glyph.numberOfContours and glyph.points, but NOT glyph.numPoints
		else if (glyph.numberOfContours < 0) {

			glyph.components = [];
			let flag;

			do  {
				const component = {};
				flag = component.flags = this.u16;
				component.glyphId = this.u16;

				// offsets and matched points (ARGS_ARE_XY_VALUES, ARG_1_AND_2_ARE_WORDS)
				switch (flag & 0x0003) {
					case 0x0003: component.offset = [this.i16, this.i16]; break;
					case 0x0002: component.offset = [this.i8, this.i8]; break;
					case 0x0001: component.matchedPoints = [this.u16, this.u16]; break;
					case 0x0000: component.matchedPoints = [this.u8, this.u8]; break;
				}

				// this is cool, we store the offset as it was a point, then we can treat it as a point when acted on by the tvts
				// - I think we should push zeroes if matchedPoints
				if (component.offset) {
					glyph.points.push( [component.offset[0], component.offset[1], 0] );
				}
				else {
					glyph.points.push( [0,0,0] );
				}

				// transformation matrix (if component.transform is undefined, the matrix is [1, 0, 0, 1]): check bits 0x0008, 0x0040, 0x0080
				switch (flag & 0x00c8) {
					case 0x0008: const scale = this.f214; component.transform = [scale, 0, 0, scale]; break;
					case 0x0040: component.transform = [this.f214, 0, 0, this.f214]; break;
					case 0x0080: component.transform = [this.f214, this.f214, this.f214, this.f214]; break;
				}

				// store component
				glyph.components.push(component);

			} while (flag & 0x0020); // MORE_COMPONENTS

			// skip over composite instructions
			if (flag & 0x0100) { // WE_HAVE_INSTR
				this.seekr(glyph.instructionLength = this.u16);
			}

			// pretend these are points so they can be processed by variations
			glyph.numPoints = glyph.points.length; // no metrics points yet
		}

		// TODO: fix the metrics points
		// glyph.points[glyph.numPoints]   = [metrics[0] ?? 0,               0, 0]; // H: Left side bearing point
		// glyph.points[glyph.numPoints+1] = [metrics[1] ?? 0,               0, 0]; // H: Right side bearing point
		// glyph.points[glyph.numPoints+2] = [              0, metrics[2] ?? 0, 0]; // V: Top side bearing point
		// glyph.points[glyph.numPoints+3] = [              0, metrics[3] ?? 0, 0]; // V: Bottom side bearing point
		glyph.points[glyph.numPoints]   = [metrics[0] ? metrics[0] : 0,               0, 0]; // H: Left side bearing point
		glyph.points[glyph.numPoints+1] = [metrics[1] ? metrics[1] : 0,               0, 0]; // H: Right side bearing point
		glyph.points[glyph.numPoints+2] = [              0, metrics[2] ? metrics[2] : 0, 0]; // V: Top side bearing point
		glyph.points[glyph.numPoints+3] = [              0, metrics[3] ? metrics[3] : 0, 0]; // V: Bottom side bearing point
	
		return glyph;
	}

	encodeGlyph(glyph, options = {}) {
		// Encode a glyph into a SamsaBuffer
		//
		// glyph:
		// - a SamsaGlyph object
		//
		// options:
		// - bbox: true = recalculate the bounding box of the glyph (default), false = don’t recalculate
		// - compression: 0 = don’t compress (faster), 1 = compress the glyph (slower, default), 2 = WOFF2 compression (not implemented)
		// - metrics: integer array that receives the 4 metrics points after the main points (if absent, these are not written)
		// - overlapSimple: true = flag the first point of a simple glyph as overlapping (for Apple fonts), false = don’t flag (default)
		// - bigendian: true = the method is allowed to use Int16Array, UInt16Array, Int32Array, UInt32Array, etc. for speed
		// - getMaxCompiledSize: true = return the maximum size of the compiled glyph (no compilation)
		//
		// return value:
		// - size of the compiled glyph in bytes (without padding)
		// - maximum size of the compiled glyph in bytes (without padding) if options.getMaxCompiledSize

		// set default options
		if (options.compression === undefined)
			options.compression = 1; // standard TrueType compression
		if (options.bbox === undefined)
			options.bbox = true; // recalculate bounding box

		if (options.getMaxCompiledSize) {
			if (options.compression == 2) {
				if (glyph.numberOfContours > 0)
					return 
				else if (glyph.numberOfContours < 0)
					return 0;
				else
					return 0;				
			} else {
				if (glyph.numberOfContours > 0)
					return (5*2) + glyph.numberOfContours*2 + 2 + glyph.instructionLength + glyph.numPoints * (2+2+1);
				else if (glyph.numberOfContours < 0)
					return (5*2) + (4+4)*2 * glyph.components.length + 2 + glyph.instructionLength;
				else
					return 0;
			}
		}

		const points = glyph.points;
		const numPoints = glyph.numPoints;
		const tell = this.tell();
	
		// 1. SIMPLE glyph
		if (glyph.numberOfContours > 0) {
	
			let instructionLength = 0;
	
			// recalculate bbox
			if (options.bbox) {
				if (points && points[0]) {
					let xMin, xMax, yMin, yMax;
					[xMin,yMin] = [xMax,yMax] = points[0];
					for (pt=1; pt<numPoints; pt++) {
						const P = points[pt][0], Q = points[pt][1];
						if (P<xMin)
							xMin=P;
						else if (P>xMax)
							xMax=P;
						if (Q<yMin)
							yMin=Q;
						else if (Q>yMax)
							yMax=Q;
					}
					glyph.xMin = Math.floor(xMin); // rounding is in case the points are not integers, thanks to variations or transforms
					glyph.yMin = Math.floor(yMin);
					glyph.xMax = Math.ceil(xMax);
					glyph.yMax = Math.ceil(yMax);
					// TODO: consider that, if this glyph is from a non-default instance, these values will in general not be integers
				}
			}

			// compression: WOFF2 method
			if (options.compression == 2) {

				// docs
				// - https://www.w3.org/TR/WOFF2/#glyf_table_format

				// - here, we use the WOFF2 method to encode flags and coordinates:
				// - numberOfContours [U16]
				// - nPoints [U16][numberOfContours] (number of points in each contour)
				// - flags [U8][numPoints] (1 byte per point, numPoints is total number of points)
				// - points (coordinate data)


				// write numberOfContours
				this.u16 = glyph.numberOfContours;

				// write nPoints array
				let prevEndPt = 0;
				this.phase = false; // set up for nibbles
				for (let c=0; c<glyph.numberOfContours; c++) {
					const contourLength = glyph.endPts[c] - prevEndPt + 1;
					const clNibble = contourLength - 4;
					
					// this is a custom encoding to save space in the contourLengths array
					// write nibbles of contourLength - 4 (contourLength == 3 is rare; contourLength == 2, 1, 0 should not exist but we still handle them inefficiently)
					// - so we handle contours of length 4 to 18 (inclusive) in one nibble
					if (clNibble >= 0 && clNibble < 15) {
						this.u4 = clNibble;
					}
					else {
						this.u4 = 15; // declaration that we will write contourLength literally in 3 nibbles (must be < 4096)
						this.u4 = contourLength & 0x0f00 >> 8;
						this.u4 = contourLength & 0x00f0 >> 4;
						this.u4 = contourLength & 0x000f;
					}

					//this.u16_255 = contourLength; // write U16_255 compressed stream [U16_255 COMPRESSION OF endPts]
					//this.u16 = glyph.endPts[c] - prevEndPt + 1; // write U16 [NO COMPRESSION OF endPts]

					/*
					// get contourLengths stats
					if (contourLengths[contourLength] === undefined)
						contourLengths[contourLength] = 0;
					else 
						contourLengths[contourLength]++;
					*/

					prevEndPt = glyph.endPts[c];
				}

				// conclude nibbling
				if (this.phase) {
					this.u4 = 0;
					this.phase = false;
				}

				// allocate flags array
				const fArray = new Uint8Array(this.buffer, this.p, numPoints)
				this.seekr(numPoints)

				// write point coordinates
				let prevPt = [0,0,1]
				for (let pt=0; pt<glyph.numPoints; pt++) {
	
					const point = glyph.points[pt]
					let dx = point[0] - prevPt[0], dxa = Math.abs(dx)
					let dy = point[1] - prevPt[1], dya = Math.abs(dy)
					let flag
	
					// there are 5 types of dx/dy combo
					// 2 * 8 : 2-byte encodings where dx = 0 or dy = 0
					// 4 * 4 : 2-byte encodings 
					// 3 * 3 : 3-byte encodings
					// 4     : 4-byte encodings
					// 4     : 5-byte encodings
	
					// buckets 0..9: dx==0
					if (dxa == 0 && dya < 1280) {
						flag = 0
						flag += 2 * Math.floor(dya / 256)
						if (dy > 0)
							flag++
						this.u8 = dya % 256 // write coord data (1 byte)
					}
					// buckets 10..19: dy==0
					else if (dya == 0 && dxa < 1280) {
						flag = 10
						flag += 2 * Math.floor(dxa / 256)
						if (dx > 0)
							flag++	
						this.u8 = dxa % 256 // write coord data (1 byte)
					}
					// buckets 20..83: dx and dy are fairly short
					else if (dxa <= 64 && dya <= 64) { // we can use nibbles for dx and dy, so 1 byte
						flag = 20
						flag += 16 * Math.floor((dxa-1) / 16)
						flag += 4 * Math.floor((dya-1) / 16)
						if (dx > 0)
							flag++
						if (dy > 0)
							flag += 2
						let nibx = ((dxa-1) % 16)
						let niby = ((dya-1) % 16)
						this.u8 = (nibx << 4) | niby // write coord data (1 byte)
					}
					// buckets 84..119: dx and dy are not quite so short
					else if (dxa <= 768 && dya <= 768) { // we can use 1 byte for dx, 1 byte for dy
						flag = 84
						flag += 12 * Math.floor((dxa-1) / 256)
						flag += 4 * Math.floor((dya-1) / 256)
						if (dx > 0)
							flag++
						if (dy > 0)
							flag += 2
						this.u8 = (dxa-1) % 256 // write x coord data (1 byte)
						this.u8 = (dya-1) % 256 // write y coord data (1 byte)
					}
					// buckets 120..123
					else if (dxa < 4096 && dya < 4096) {
						flag = 120
						if (dx > 0)
							flag++
						if (dy > 0)
							flag += 2
						this.u16 = dxa << 4 | dya >> 8
						this.u8 = dya % 256
					}
					// buckets 124..127
					else {
						flag = 124
						if (dx > 0)
							flag++
						if (dy > 0)
							flag += 2
						this.u16 = dxa
						this.u16 = dya
					}
	
					// is the point off-curve? if so, set the flag’s most significant bit
					if (point[2] == 0)
						flag |= 0x80
					
					// write the flag into the flag array
					fArray[pt] = flag
	
					// update prevPt
					prevPt = point
				}
			}

			else {

				// options.compression != 2
				let pt;

				// new header with bbox
				this.encode(FORMATS.GlyphHeader, glyph);
		
				// endpoints
				glyph.endPts.forEach(endPt => {
					this.u16 = endPt;
				});
		
				// instructions (none for now)
				this.u16 = instructionLength;
				this.seekr(instructionLength);
		
				// write glyph points

				// compression: none
				if (options.compression == 0) {

					// write uncompressed glyph points (faster in memory and for SSD disks)
					let cx=0;
					let cy=0;

					if (options.bigendian) {
						// Int16Array method
						// - a bit faster, but does not work on LE platforms such as Mac M1
						const fArray = new Uint8Array(this, this.p);
						fArray[0] = points[0][2] & (options.overlapSimple ? 0x40 : 0x00); // first byte may have an overlap flag
						for (pt=1; pt<numPoints; pt++) {
							fArray[pt] = points[pt][2];
						}

						const pArray = new Int16Array(this, this.p + numPoints); // dangerous, since Int16Array uses platform byte order (M1 Mac does)
						for (pt=0; pt<numPoints; pt++) {
							const x = points[pt][0];
							pArray[pt] = x - cx;
							cx = x;
						}
						for (pt=0; pt<numPoints; pt++) {	
							const y = points[pt][1];
							pArray[numPoints+pt] = y - cy;
							cy = y;
						}
						this.seekr(numPoints*5);
					}
					else {
						// DataView method
						this.u8 = points[0][2] & (options.overlapSimple ? 0x40 : 0x00); // first byte may have an overlap flag
						for (pt=1; pt<numPoints; pt++) {
							this.u8 = points[pt][2]; // write 1 byte for flag
						}

						for (pt=0; pt<numPoints; pt++) {
							const x = points[pt][0]
							this.i16 = x - cx; // write 2 bytes for dx
							cx = x;
						}

						for (pt=0; pt<numPoints; pt++) {	
							const y = points[pt][1];
							this.i16 = y - cy; // write 2 bytes for dy
							cy = y;
						}
					}

				}

				// compression: standard TrueType compression
				else if (options.compression == 1) {

					// write compressed glyph points (slower)
					let cx=0, cy=0;
					const dx=[], dy=[], flags=[];
			
					for (pt=0; pt<numPoints; pt++) {
						const X = dx[pt] = Math.round(points[pt][0]) - cx;
						const Y = dy[pt] = Math.round(points[pt][1]) - cy;
						let f = points[pt][2] & 0xc1; // preserve bits 0 (on-curve), 6 (overlaps), 7 (reserved)
						if (X==0)
							f |= 0x10;
						else if (X >= -255 && X <= 255)
							f |= (X > 0 ? 0x12 : 0x02);
		
						if (Y==0)
							f |= 0x20;
						else if (Y >= -255 && Y <= 255)
							f |= (Y > 0 ? 0x24 : 0x04);
		
						flags[pt] = f;
						cx = points[pt][0];
						cy = points[pt][1];
					}
		
					// overlap signal for Apple
					if (options.overlapSimple)
						flags[0] |= 0x40;
		
					// write flags with RLE
					let rpt = 0;
					for (pt=0; pt<numPoints; pt++) {
						if (pt > 0 && rpt < 255 && flags[pt] == flags[pt-1]) {
							rpt++;
						}
						else {
							rpt = 0;
						}
		
						if (rpt<2) {
							this.u8 = flags[pt]; // write without compression (don’t compress 2 consecutive identical bytes)
						}
						else {
							const currentPos = this.tell();
							if (rpt==2) {
								this.seek(currentPos-2);
								this.u8 = flags[pt] | 0x08; // set repeat bit on the pre-previous flag byte
							}
							this.seek(currentPos-1);
							this.u8 = rpt; // write the number of repeats
						}
					}
		
					// write point coordinates
					for (pt=0; pt<numPoints; pt++) {
						if (dx[pt] == 0)
							continue;
						if (dx[pt] >= -255 && dx[pt] <= 255)
							this.u8 = (dx[pt]>0) ? dx[pt] : -dx[pt];
						else
							this.i16 = dx[pt];
					}
					for (pt=0; pt<numPoints; pt++) {
						if (dy[pt] == 0)
							continue;
						if (dy[pt] >= -255 && dy[pt] <= 255)
							this.u8 = (dy[pt]>0) ? dy[pt] : -dy[pt];
						else
							this.i16 = dy[pt];
					}
				}
			}

		} // simple glyph end
	
		// 2. COMPOSITE glyph
		else if (glyph.numberOfContours < 0) {

			// glyph header
			this.encode(FORMATS.GlyphHeader, glyph); // TODO: recalculate composite bbox (tricky in general, not bad for simple translations)
	
			// components
			for (let c=0; c<glyph.components.length; c++) {
				let component = glyph.components[c];
	
				// set up the flags
				let flags = 0;
				if (options.compression == 0) {
					flags |= 0x0001; // ARG_1_AND_2_ARE_WORDS
				}
				else {
					if (   (component.offset && (component.offset[0] < -128 || component.offset[0] > 127 || component.offset[1] < -128 || component.offset[1] > 127))
						|| (component.matchedPoints && (component.matchedPoints[0] > 255 || component.matchedPoints[1] > 255)) ) {
						flags |= 0x0001; // ARG_1_AND_2_ARE_WORDS
					}
				}

				if (component.offset) {
					flags |= 0x0002; // ARGS_ARE_XY_VALUES
				}
				if (c < glyph.components.length-1) {
					flags |= 0x0020; // MORE_COMPONENTS
				}
				if (component.flags & 0x0200) {
					flags |= 0x0200; // USE_MY_METRICS (copy from the original glyph)
				}
				// flag 0x0100 WE_HAVE_INSTRUCTIONS is set to zero

				// TODO: handle transforms
	
				// write this component
				this.u16 = flags;
				this.u16 = component.glyphId;
				if (flags & 0x0002) { // ARGS_ARE_XY_VALUES
					if (flags & 0x0001) { // ARG_1_AND_2_ARE_WORDS
						this.i16 = component.offset[0];
						this.i16 = component.offset[1];
					}
					else {
						this.i8 = component.offset[0];
						this.i8 = component.offset[1];
					}
				}
				else {
					if (flags & 0x0001) { // ARG_1_AND_2_ARE_WORDS
						this.u16 = component.matchedPoints[0];
						this.u16 = component.matchedPoints[1];
					}
					else {
						this.u8 = component.matchedPoints[0];
						this.u8 = component.matchedPoints[1];
					}
				}
			}
		} // composite glyph end
	
		// store metrics (for simple, composite and empty glyphs)
		if (options.metrics) {
			options.metrics[0] = points[numPoints+0][0]; // lsb point, usually 0
			options.metrics[1] = points[numPoints+1][0]; // advance point
			options.metrics[2] = points[numPoints+2][1]; // top metric, usually 0 in horizontal glyphs
			options.metrics[3] = points[numPoints+3][1]; // bottom metric, usually 0 in horizontal glyphs
		}
	
		return this.tell() - tell; // size of binary glyph in bytes

	}

	decodeItemVariationStore() {
		const ivsStart = this.tell();
		const ivs = this.decode(FORMATS.ItemVariationStoreHeader);
		this.seek(ivsStart + ivs.regionListOffset);

		ivs.axisCount = this.u16;
		ivs.regionCount = this.u16;
		ivs.regions = []; // get the regions

		for (let r=0; r<ivs.regionCount; r++) {
			const region = [];
			for (let a=0; a<ivs.axisCount; a++) {
				region[a] = [ this.f214, this.f214, this.f214 ];
			}
			ivs.regions.push(region);
		}

		// decode the ItemVariationDatas
		ivs.ivds = [];
		for (let d=0; d<ivs.itemVariationDataCount; d++) {
			this.seek(ivsStart + ivs.itemVariationDataOffsets[d]);
			const ivd = {
				itemCount: this.u16, // the number of items in each deltaSet
				regionIds: [],
				deltaSets: [],
			};
			let wordDeltaCount = this.u16;
			const regionCount = this.u16;
			const longWords = wordDeltaCount & 0x8000;
			wordDeltaCount &= 0x7fff; // fix the value for use
			console.assert(ivd.itemCount >0, "ivd.itemCount should be >0 but is 0");
			console.assert(wordDeltaCount <= regionCount, "wordDeltaCount should nicely be <= regionCount");
			console.assert(regionCount > 0, "regionCount should be >0 but is 0 (non fatal)", wordDeltaCount,  ivd);
			if (ivd.itemCount > 0 && regionCount > 0 && wordDeltaCount <= regionCount) { // skip bad IVDs (some old font builds have regionCount==0, but they seem harmless if skipped)
	
				// populate regionIndexes
				for (let r=0; r<regionCount; r++) {
					ivd.regionIds.push(this.u16);
				}

				// decode the deltaSets
				for (let d=0; d < ivd.itemCount; d++) {
					const deltaSet = [];
					let r=0;
					while (r < wordDeltaCount) { // don’t replace r with r++ here!
						deltaSet.push(longWords ? this.i32 : this.i16);
						r++;
					}
					while (r < regionCount) { // don’t replace r with r++ here!
						deltaSet.push(longWords ? this.i16 : this.i8);
						r++;
					}
					ivd.deltaSets.push(deltaSet);
				}
				ivs.ivds.push(ivd);
			}
		}
		return ivs;
	}

	// parser for variationIndexMap
	// - converts a compressed binary into an array of outer and inner values
	// - each element in the returned array is an array of 2 elements made of [outer, inner]
	// - deltaSetIndexMaps are always 0-based
	decodeIndexMap() {
		const indexMap = [];
		const format = this.u8;
		const entryFormat = this.u8;
		const mapCount = format === 0 ? this.u16 : this.u32;
		const itemSize = ((entryFormat & 0x30) >> 4) + 1;
		const innerBitCount = (entryFormat & 0x0f) + 1;
		const getters = [0, U8, U16, U24, U32];
		for (let m=0; m<mapCount; m++) {
			const entry = this.getters[getters[itemSize]](); // this.u8, this.u16, this.u24, this.u32
			const outer = entry >>> innerBitCount; // >>> avoids creating negative values (we want 0xffff, not -1)
			const inner = entry & ((1 << innerBitCount) - 1);
			indexMap.push([outer, inner]);
		}
		return indexMap;
	}

	// parse packed pointIds
	// - used in gvar and cvar tables
	// - https://learn.microsoft.com/en-us/typography/opentype/spec/otvarcommonformats#packed-point-numbers
	decodePointIds() {
		const POINTS_ARE_WORDS = 0x80;
		const POINT_RUN_COUNT_MASK = 0x7f;
		const pointIds = [];
		const _count = this.u8;
		const count = _count & POINTS_ARE_WORDS ? (_count & POINT_RUN_COUNT_MASK) * 0x0100 + this.u8 : _count;
		let pointId = 0;
		let c = 0;
		while (c < count) {
			const _runCount = this.u8;
			const runCount = (_runCount & POINT_RUN_COUNT_MASK) + 1;
			const getter = _runCount & POINTS_ARE_WORDS ? this.getters[U16] : this.getters[U8];
			for (let r=0; r < runCount; r++) {
				pointId += getter(); // convert delta ids into absolute ids
				pointIds.push(pointId);
			}
			c += runCount;
		}
		return pointIds;
	}

	// parse packed deltas
	// - used in gvar and cvar tables
	// - https://learn.microsoft.com/en-us/typography/opentype/spec/otvarcommonformats#packed-deltas
	decodeDeltas(count) {
		const deltas = [];
		let d = 0;
		while (d < count) {
			const _runCount = this.u8;
			const runCount = (_runCount & DELTA_RUN_COUNT_MASK) + 1;
			if (_runCount & DELTAS_ARE_ZERO) {
				for (let r=0; r < runCount; r++) {
					deltas[d++] = 0;
				}
			} else {
				const getter = _runCount & DELTAS_ARE_WORDS ? this.getters[I16] : this.getters[I8];
				for (let r=0; r < runCount; r++) {
					deltas[d++] = getter();
				}
			}
		}
		return deltas;
	}

	encodeDeltas(deltas) {
		// deltas are encoded in groups of size [1,64] (0xff & DELTA_RUN_COUNT_MASK + 1 = 64)
		// cost of switching to a new group and back is 2 bytes
		// cost of not switching to zeroes is 2 bytes per delta if we’re in words, 1 byte per delta if we’re in bytes
		// cost of not switching to bytes is 1 byte per delta
		// - ideally we’d like to skip runs of length 1, but let’s ignore that for now
		let d, r;
		const numBytes = [];
		deltas.forEach(delta => {
			numBytes.push((delta === 0) ? 0 : (inRange(delta, -128, 127)) ? 1 : 2);
		});

		// this algo creates a new run for each distinct numBytes section, even those of length 1
		const runs = [];
		d=0;
		r=0;
		while (d<deltas.length) {
			runs[r] = [numBytes[d], 0]; // we store directly 0 to mean 1 delta, 1 to mean 2 deltas, n to mean n+1 deltas, etc.
			let d_ = d+1;
			while (d_<deltas.length && numBytes[d_] == numBytes[d] && runs[r][1] < 63) {
				runs[r][1]++; // 63 = 0x3f is the max value we will store here, meaning 64 deltas in the run
				d_++;
			}
			d = d_;
			r++;
		}

		// write the runs
		d=0;
		runs.forEach(run => {
			const [numBytes, runCount] = run;
			const _runCount = runCount | (numBytes == 2 ? DELTAS_ARE_WORDS : 0) | (numBytes == 0 ? DELTAS_ARE_ZERO : 0);
			this.u8(_runCount); // this incorporates runCount (bits 0-5 and the flag bits 6 and 7)
			if (numBytes > 0) { // write nothing for zero deltas
				for (let i=0; i<=runCount; i++) { // <= 0 means 1 item, 1 means 2 items, etc.
					if (numBytes == 1)
						this.i8(deltas[d++]);
					else if (numBytes == 2)
						this.i16(deltas[d++]);
				}	
			}
		});
	}

	// decodeTvts()
	// - parse the tuple variation tables (tvts), also known as "delta sets with their tuples" for this glyph
	// - we only get here from a gvar or cvar table
	decodeTvts(glyph) {
	
		const tvts = [];
		const font = glyph.font;
		const gvar = font.gvar;
		const axisCount = font.fvar.axisCount;

		const offset = gvar.tupleOffsets[glyph.id];
		const nextOffset = gvar.tupleOffsets[glyph.id+1];

		// do we have tvt data?
		if (nextOffset - offset > 0) {
	
			// jump to the tvt data, record the offset
			this.seek(gvar.glyphVariationDataArrayOffset + offset);
			const tvtStart = this.tell();

			// get tvts header
			const _tupleCount = this.u16;
			const tupleCount = _tupleCount & 0x0FFF;
			const offsetToSerializedData = this.u16;

			// create all the tuples
			for (let t=0; t < tupleCount; t++) {
				const tvt = {
					serializedDataSize: this.u16,
					flags: this.u16, // tupleIndex in the spec
					numPoints: 0,
					sharedTupleId: -1,
					peak: [],
					start: [],
					end: [],
				};

				// move to a region representation, rather than peak, start, end arrays
				// either 
				// region = [[p0,p1,p2,p3],[s0,s1,s2,s3],[e0,e1,e2,e3]]; // fewer objects in general
				// or
				// region = [[p0,s0,e0],[p1,s1,e1],[p2,s2,e2],[p3,s3,e3]]; // more intuitive, and usually axisCount is max 3 or 4
				// also consider a single Int16Array

				const tupleIndex = tvt.flags & 0x0FFF;
				if (tvt.flags & GVAR_EMBEDDED_PEAK_TUPLE) {
					for (let a=0; a<axisCount; a++) {
						tvt.peak[a] = this.f214;
					}
				}
				else {
					tvt.sharedTupleId = tupleIndex;
					tvt.peak = gvar.sharedTuples[tupleIndex]; // set the whole peak array at once, TODO: it would be better if we thought in terms of regions, and assigned complete shared regions
				}

				if (tvt.flags & GVAR_INTERMEDIATE_REGION) {
					for (let a=0; a<axisCount; a++) {
						tvt.start[a] = this.f214;
					}
					for (let a=0; a<axisCount; a++) {
						tvt.end[a] = this.f214;
					}
				}

				// TODO: all these [a] indexes are ugly, think in terms of a region instead, each region having axisCount * [start,peak,end] arrays and optionally having a pre-made scalar
				// fixups
				// I think these are ok because "An intermediate-region tuple variation table additionally has start and end n-tuples".
				// In practice, we could remove this whole block for well-formed fonts, but the spec asks us to force any invalid tuples to null
				// The first "tvt.start[a] === undefined" block seems unnecessary
				for (let a=0; a<axisCount; a++) {
					if (tvt.start[a] === undefined) { // infer starts and ends from peaks: a shared peak *can* have "embedded" start and end tuples (see Bitter variable font)
						if (tvt.peak[a] > 0) {
							tvt.start[a] = 0;
							tvt.end[a] = 1;
						}
						else {
							tvt.start[a] = -1;
							tvt.end[a] = 0;
						}
					}
					else {
						if ((tvt.start[a] > tvt.end[a]) || (tvt.start[a] < 0 && tvt.end[a] > 0)) // force null if invalid
							tvt.start[a] = tvt.end[a] = tvt.peak[a] = 0;
					}
				}
				
				tvts.push(tvt); // store the tvt
			}

			// is our position ok?
			console.assert(this.tell() == tvtStart + offsetToSerializedData, "decodeTvts(): current offset is not ok (this.tell() != tvtStart + offsetToSerializedData)", this.tell(), tvtStart + offsetToSerializedData);

			// get pointIds and deltas from the serialized data
			this.seek(tvtStart + offsetToSerializedData); // jump to the serialized data explicitly		
			const sharedPointIds = _tupleCount & GVAR_SHARED_POINT_NUMBERS ? this.decodePointIds() : undefined; // get the shared pointIds
			for (let t=0; t < tupleCount; t++) { // go thru each tuple
				const tvt = tvts[t];
				const pointIds = tvt.flags & GVAR_PRIVATE_POINT_NUMBERS ? this.decodePointIds() : sharedPointIds; // use private point ids or use the shared point ids
				tvt.allPoints = pointIds.length == 0; // flag special case if all points are used, this triggers IUP!
				const tupleNumPoints = tvt.allPoints ? glyph.points.length : pointIds.length; // how many deltas do we need?
				const xDeltas = this.decodeDeltas(tupleNumPoints);
				const yDeltas = this.decodeDeltas(tupleNumPoints);
				tvt.deltas = [];
				if (tvt.allPoints) {
					for (let pt=0; pt < glyph.points.length; pt++) {
						tvt.deltas[pt] = [xDeltas[pt], yDeltas[pt]];
					}
				}
				else {
					for (let pt=0, pc=0; pt < glyph.points.length; pt++) {
						if (pt < pointIds[pc] || pc >= tupleNumPoints) {
							tvt.deltas[pt] = null; // these points will be moved by IUP
						}
						else {
							tvt.deltas[pt] = [xDeltas[pc], yDeltas[pc]]; // these points will be moved explicitly
							pc++;
						}
					}
					// after this, we no longer need pointIds, right? so it needn’t stick around as a property of the tvt (except for visualization)
				}
			}
		}
		return tvts;
	}

	decodePaint(context = {}) {

		// readOperands()
		// - this reads all the variable operands for a paint (we also use this for non-variable versions of the same paint)
		// - we look up the number of operands needed in PAINT_VAR_OPERANDS, so we can use the same function for all paint formats
		const readOperands = (type) => {
			const count = PAINT_VAR_OPERANDS[paint.format];
			for (let i=0; i<count; i++)
				operands.push(this.getters[type]());
		};
		
		// addVariations()
		// - adds the variation deltas to the operands
		// - the arrow function keeps "this" (the buffer) in scope
		const addVariations = (operands) => {
			const variationsEnabled = true;
			if (!variationsEnabled || paint.format % 2 == 0 || operands.length == 0) // variations enabled; only odd-numbered paint formats have variations; we need operands
				return;
			const varIndexBase = this.u32; // we must read this even if we don’t have an instance, otherwise reading gets out of sync
			if (varIndexBase == 0xffffffff || !context.instance) // no variations for this paint; we need an instance
				return;
			const deltas = context.instance.deltaSets["COLR"];
			for (let i=0; i<operands.length; i++) {
				const index = varIndexBase + i;
				const [outer, inner] = colr.varIndexMapOffset ? colr.varIndexMap[index] : [index >>> 16, index & 0xffff]; // explicit or implicit mapping
				if (outer != 0xffff && inner != 0xffff) {
					operands[i] += deltas[outer][inner];
				}
			}
		};

		// we decode colorLine here, rather than as a method of SamsaBuffer, in order to keep paint in scope and to be able to use addVariations()
		// - unlike other decodeX methods, it sets the data pointer according to the supplied argument, then restores it
		const decodeColorLine = (colorLineOffset) => {
			const tell = this.tell();
			this.seek(paint.offset + colorLineOffset);
			const colorLine = {
				extend: this.u8, // one of EXTEND_PAD (0), EXTEND_REPEAT (1), EXTEND_REFLECT (2)
				numStops: this.u16,
				colorStops: [],
			};
			const operands = [];
			for (let cst=0; cst<colorLine.numStops; cst++) {
				const colorStop = {};
				operands[0] = this.i16; // stopOffset
				colorStop.paletteIndex = this.u16;
				operands[1] = this.i16; // alpha
				addVariations(operands);
				colorStop.stopOffset = operands[0] / 16384;
				colorStop.alpha = operands[1] / 16384;
				colorLine.colorStops.push(colorStop);
			}
			this.seek(tell); // restore the data pointer
			return colorLine;
		};

		const colr = context.font.COLR;
		const paint = {
			offset: this.tell(),
			format: this.u8,
			children: [],
		};
		const operands = [];
		let tell;

		// keep track of paintIds we have used, to avoid infinite recursion
		// - we use an Array (not a Set or anything non-LIFO), since we need to push and pop at the beginning of each decodePaint()
		// - it’s only relevant to test whether the paintId has been used in the path from root to current node
		// - multiple children of the same parent may use the same paintId, for example to fill two shapes the same way
		// - paint.offset is suitable to identify each paint
		if (context.paintIds.includes(paint.offset)) {
			console.error(`decodePaint(): infinite recursion detected: paintId ${paint.offset} is already used in this DAG`);
			return paint; // return what we have found so far
		}
		else {
			context.paintIds.push(paint.offset); // push the paintId: we’ll pop it at the end of this run throught decodePaint(), so it works well for nested paints
		}

		switch (paint.format) {
			case 1: { // PaintColrLayers
				const numLayers = this.u8;
				const firstLayerIndex = this.u32;
				for (let lyr = 0; lyr < numLayers; lyr++) {
					this.seek(colr.layerList[firstLayerIndex + lyr]);
					paint.children.push(this.decodePaint(context)); // recursive
				}
				break;
			}

			case 2: case 3: { // PaintSolid
				paint.paletteIndex = this.u16;
				readOperands(I16);
				addVariations(operands);
				paint.alpha = operands[0] / 0x4000;
				break;
			}

			case 4: case 5: case 6: case 7: case 8: case 9: { // all gradient paints
				const colorLineOffset = this.u24;
				paint.colorLine = decodeColorLine(colorLineOffset);
				readOperands(I16);
				addVariations(operands);
				if (paint.format < 6) { // PaintLinearGradient, PaintVarLinearGradient
					paint.points = [ [operands[0], operands[1]], [operands[2], operands[3]], [operands[4], operands[5]] ];
				}
				else if (paint.format < 8) { // PaintRadialGradient, PaintVarRadialGradient
					paint.points = [ [operands[0], operands[1], operands[2]], [operands[3], operands[4], operands[5]] ];
				}
				else { // PaintSweepGradient, PaintVarSweepGradient
					paint.center = [operands[0], operands[1]];
					paint.startAngle = operands[2] / 0x4000 * 180;
					paint.endAngle = operands[3] / 0x4000 * 180;	
				}
				break;
			}

			case 10: { // PaintGlyph
				const nextOffset = this.u24;
				paint.glyphID = this.u16; // by assigning glyphid we get an actual shape to use
				this.seek(paint.offset + nextOffset);
				paint.children.push(this.decodePaint(context)); // recursive (but we should only get transforms, more Format 10 tables, and a fill from now on)
				break;
			}

			case 11: { // PaintColrGlyph
				const glyphID = this.u16;
				this.seek(colr.baseGlyphPaintRecords[glyphID]);
				paint.children.push(this.decodePaint(context)); // recursive
				break;
			}

			case 12: case 13: { // PaintTransform, PaintVarTransform
				const nextOffset = this.u24;
				const transformOffset = this.u24;
				tell = this.tell();
				this.seek(paint.offset + transformOffset);
				readOperands(I32);
				this.seek(tell);
				addVariations(operands);
				paint.matrix = [ operands[0]/0x10000, operands[1]/0x10000, operands[2]/0x10000, operands[3]/0x10000, operands[4]/0x10000, operands[5]/0x10000 ];
				this.seek(paint.offset + nextOffset);
				paint.children.push(this.decodePaint(context)); // recursive
				break;
			}

			case 14: case 15: { // PaintTranslate, PaintVarTranslate
				const nextOffset = this.u24;
				readOperands(I16);
				addVariations(operands);
				paint.translate = [ operands[0], operands[1] ];
				this.seek(paint.offset + nextOffset);
				paint.children.push(this.decodePaint(context)); // recursive
				break;
			}

			case 16: case 17: case 18: case 19: case 20: case 21: case 22: case 23: { // PaintScale and variant scaling formats
				const nextOffset = this.u24;
				readOperands(I16);
				addVariations(operands);
				let o = 0;
				paint.scale = [ operands[o++] ]; // scaleX
				if (paint.format >= 20)
					paint.scale.push(operands[o++]);  // scaleY
				if (paint.format == 18 || paint.format == 19 || paint.format == 22 || paint.format == 23)
					paint.center = [ operands[o++], operands[o++] ]; // centerX, centerY
				this.seek(paint.offset + nextOffset);
				paint.children.push(this.decodePaint(context)); // recursive	
				break;
			}

			case 24: case 25: case 26: case 27: { // PaintRotate, PaintVarRotate, PaintRotateAroundCenter, PaintVarRotateAroundCenter
				const nextOffset = this.u24;
				readOperands(I16);
				addVariations(operands);
				paint.rotate = operands[0]/0x4000 * 180; // we store 1/180 of the rotation angle as F214
				if (paint.format >= 26) {
					paint.center = [ operands[1], operands[2] ];
				}
				this.seek(paint.offset + nextOffset);
				paint.children.push(this.decodePaint(context)); // recursive	
				break;
			}

			case 28: case 29: case 30: case 31: { // PaintSkew, PaintVarSkew, PaintSkewAroundCenter, PaintVarSkewAroundCenter
				const nextOffset = this.u24;
				readOperands(I16);
				addVariations(operands);
				paint.skew = [ operands[0]/0x4000 * 180, operands[1]/0x4000 * 180 ]; // we store 1/180 of the rotation angle as F214
				if (paint.format >= 30) {
					paint.center = [ operands[1], operands[2] ];
				}
				this.seek(paint.offset + nextOffset);
				paint.children.push(this.decodePaint(context)); // recursive	
				break;
			}

			case 32: { // PaintComposite
				const sourcePaintOffset = this.u24;
				paint.compositeMode = this.u8;
				const backdropPaintOffset = this.u24;
				this.seek(paint.offset + sourcePaintOffset);
				paint.children.push(this.decodePaint(context));
				this.seek(paint.offset + backdropPaintOffset);
				paint.children.push(this.decodePaint(context));
				break;	
			}
			
			default: {
				console.error(`Unknown paint.format ${paint.format} (must be 1 <= paint.format <= 32)`)
				break;
			}
		}

		context.paintIds.pop(); // we pop the paintId we pushed at the beginning of this decodePaint(), but might reuse the same paintId in later paints in the same glyph
		return paint; // having recursed the whole paint tree, this is now a DAG
	}
}

//-------------------------------------------------------------------------------
// SamsaFont
// - let’s keep this pure, and leave fancy loading from URL or path to special purpose functions
// - buf: a SamsaBuffer containing the font (required)
// - options: various
// - TODO: at some point we need it to work without loading all the glyphs into memory, so they stay in a file, e.g. options.glyphsOnDemand = true
function SamsaFont(buf, options = {}) {

	console.log("SamsaFont!")

	this.buf = buf; // SamsaBuffer
	this.tables = {};
	this.tableList = [];
	this.glyphs = [];
	this.ItemVariationStores = {}; // keys will be "avar", "MVAR", "COLR", "CFF2", "HVAR", "VVAR"... they all get recalculated when a new instance is requested
	this.tableDecoders = TABLE_DECODERS; // we assign it here so we have access to it in code that imports the library

	// font header
	this.header = buf.decode(FORMATS.TableDirectory);

	// create table directory
	for (let t=0; t<this.header.numTables; t++) {
		const table = buf.decode(FORMATS.TableRecord);
		this.tableList.push(this.tables[table.tag] = table);
	}

	// load tables in the following order
	const requestTables = ["name","cmap","OS/2","maxp","head","hhea","hmtx","vhea","vmtx","post","fvar","gvar","avar","COLR","CPAL","MVAR","HVAR","VVAR","STAT","GDEF","GPOS","GSUB","BASE"];
	const requireTables = ["name","cmap","OS/2","maxp","head","hhea","hmtx","post"];

	requestTables.forEach(tag => {
		if (!this.tables[tag] && requireTables.includes(tag)) {
			console.assert(this.tables[tag], "ERROR: Missing required table: ", tag);
		}

		if (this.tables[tag]) {
			console.log("Loading table: ", tag);
			const tbuf = this.bufferFromTable(tag); // wouldn’t it be a good idea to store all these buffers as font.avar.buffer, font.COLR.buffer, etc. ?

			// decode first part of table
			if (FORMATS[tag]) {
				this[tag] = tbuf.decode(FORMATS[tag]);
			}

			// decode more of the table
			if (this.tableDecoders[tag]) {
				this.tableDecoders[tag](this, tbuf);
			}
		}
	});

	// load ItemVariationStores
	const ivsTags = ["avar", "MVAR", "HVAR", "VVAR", "COLR"];
	ivsTags.forEach(tag => {
		if (this[tag] && this[tag].itemVariationStoreOffset) { // if itemVariationStoreOffset == 0 (legitimate at least in avar), do nothing
			buf.seek(this.tables[tag].offset + this[tag].itemVariationStoreOffset);
			this[tag].itemVariationStore = this.ItemVariationStores[tag] = buf.decodeItemVariationStore();
			console.assert(this[tag].itemVariationStore.axisCount == this.fvar.axisCount, "axisCount mismatch in ItemVariationStore");
		}
	});

	// options.allGlyphs: load all glyphs
	if (options.allGlyphs) {
		let start, end;
		let offset = 0;
		//start = performance.now();
		// we should do this differently if the font is only lightly loaded, e.g. from a big file that we don’t want to load in full
		for (let g=0; g<this.maxp.numGlyphs; g++) {
			this.buf.seek(this.tables.loca.offset + (g+1) * (this.head.indexToLocFormat ? 4 : 2));
			const nextOffset = this.head.indexToLocFormat ? buf.u32 : buf.u16 * 2;
			buf.seek(this.tables.glyf.offset + offset);
			this.glyphs[g] = buf.decodeGlyph({id: g, font: this, length: nextOffset - offset});
			offset = nextOffset;
		}
		//end = performance.now();

		// options.allTVTs: load all TVTs?
		if (options.allTVTs && this.gvar) {
			const gvar = this.gvar;
			const gvarBuf = this.bufferFromTable("gvar");
			//start = performance.now();
			for (let g=0; g<this.maxp.numGlyphs; g++) {

				if (!this.glyphs[g].font)
					console.log(this.glyphs[g])

				if (gvar.tupleOffsets[g+1] > gvar.tupleOffsets[g]) { // do we have TVT data?
					gvarBuf.seek(gvar.glyphVariationDataArrayOffset + gvar.tupleOffsets[g]);
					this.glyphs[g].tvts = gvarBuf.decodeTvts(this.glyphs[g]);
				}
				else {
					this.glyphs[g].tvts = [];
				}
			}
			//end = performance.now();
			console.log(`${this.glyphs.length} TVTs loaded in ` + (end - start) + " ms");	
		}
	}
}

SamsaFont.prototype.validateChecksums = function () {
	const errors = [];
	font.tableList.forEach(table => {
		let actualSum = font.buf.checkSum(table.offset, table.length, table.tag == "head");
		if (table.checkSum !== actualSum) {
			errors.push([table.tag, table.table.checkSum, actualSum]);
		}
	});
	return errors;
}

SamsaFont.prototype.bufferFromTable = function (tag) {
	return new SamsaBuffer(this.buf.buffer, this.tables[tag].offset, this.tables[tag].length);
}

SamsaFont.prototype.itemVariationStoreInstantiate = function (ivs, tuple) {
	const scalars = this.getVariationScalars(ivs, tuple); // get the region scalars: we get this only ONCE per instance
	const interpolatedDeltas = []; // a 2d array made of (ivd.deltaSets.length) arrays of interpolated delta values
	ivs.ivds.forEach((ivd, i) => {
		interpolatedDeltas[i] = [];
		ivd.deltaSets.forEach(deltaSet => {
			let d = 0;
			deltaSet.forEach((delta, r) => d += scalars[ivd.regionIds[r]] * delta); // this is where the good stuff happens!
			interpolatedDeltas[i].push(d);
		});
	});
	return interpolatedDeltas; // 2d array of values that need to be added to the items they apply to
	// although delta values are always integers, the interpolated deltas will now be floating point (in general)
	// HMM, shouldn’t the list of deltas per item collapse to a single item?
	// THUS:

	/*
	const scalars = this.getVariationScalars(ivs, tuple); // get the region scalars: we get this only ONCE per instance
	const interpolatedDeltas = []; // a 2d array made of (ivd.deltaSets.length) arrays of interpolated delta values
	ivs.ivds.forEach((ivd, i) => {
		interpolatedDeltas[i] = 0;
		ivd.deltaSets.forEach(deltaSet => {
			let d = 0;
			deltaSet.forEach((delta, r) => d += scalars[ivd.regionIds[r]] * delta); // this is where the good stuff happens!
			interpolatedDeltas[i] += d;
			// could we do the above with a reduce? and maybe the enclosing thing in another reduce?
		});
	});
	return interpolatedDeltas; // 2d array of values that need to be added to the items they apply to

	// HMM, maybe not... the inner/outer thing is essential to keep
	*/


}

SamsaFont.prototype.getVariationScalar = function (region, axisCount=this.fvar.axisCount) {
	let S = 1; // S will end up in the range [0, 1]
	for (let a=0; a < axisCount; a++) {
		const [start, peak, end] = region[a]; // region[a] is a linearRegion
		if (peak !== 0) { // does the linearRegion participate in the calculation?
			const v = tuple[a]; // v is the a’th normalized axis value from the tuple
			if (v == 0) {
				S = 0;
				break; // zero scalar, which makes S=0, so quit loop (maybe this is more common than the v==peak case, so should be tested first)
			}
			else if (v !== peak) { // we could let the v==peak case fall through, but it’s common so worth testing first
				const vMstart = v - start, vMend = v - end; // precalculating these speeds things up a bit
				if (vMstart < 0 || vMend > 0) {
					S = 0;
					break; // zero scalar, which makes S=0, so quit loop (maybe this is more common than the v==peak case, so should be tested first)
				}
				else if (v < peak)
					S *= vMstart / (peak - start);
				else // if (v > peak) // because we already tested all other possibilities (including v==peak) we can remove this test and just have "else"
					S *= vMend / (peak - end);
			}
		}
	}
	return S;
}
	
// process ItemVariationStore to get scalars for an instance (including avar2)
// - the returned scalars[n] array contains a scalar for each region (therefore regions.length == scalars.length)
//SamsaFont.prototype.getVariationScalars = function (regions, tuple) {
SamsaFont.prototype.getVariationScalars = function (ivs, tuple) {
	const scalars = [];
	const regions = ivs.regions;
	regions.forEach(region => { // for each region...
		// ... go thru each of the axisCount linearRegions in the region
		let S = 1;
		for (let a=0; a < ivs.axisCount; a++) {
			const [start, peak, end] = region[a];
			if (peak !== 0) { // does the linearRegion participate in the calculation?
				const v = tuple[a]; // v is the a’th normalized axis value from the tuple
				if (v == 0) {
					S = 0;
					break; // zero scalar, which makes S=0, so quit loop (maybe this is more common than the v==peak case, so should be tested first)
				}
				else if (v !== peak) { // we could let the v==peak case fall through, but it’s common so worth testing first
					const vMstart = v - start, vMend = v - end; // precalculating these speeds things up a bit
					if (vMstart < 0 || vMend > 0) {
						S = 0;
						break; // zero scalar, which makes S=0, so quit loop (maybe this is more common than the v==peak case, so should be tested first)
					}
					else if (v < peak)
						S *= vMstart / (peak - start);
					else if (v > peak) // because we already tested all other possibilities (including v==peak) we could remove this test and just have "else"
						S *= vMend / (peak - end);
				}
			}
		}
		scalars.push(S);
	});
	return scalars;
}

SamsaFont.prototype.loadGlyphById = function (id) {
	this.buf.seek(this.tables.loca.offset + id * (this.head.indexToLocFormat ? 4 : 2));
	const offset = this.head.indexToLocFormat ? [buf.u32, buf.u32] : [buf.u16 * 2, buf.u16 * 2];
	buf.seek(this.tables.glyf.offset + offset);
	this.glyphs[g] = buf.decodeGlyph({id: id, font: this, length: offsets[1] - offsets[0]});
}

// SamsaFont.glyphIdFromUnicode() – returns glyphId for a given unicode code point
// uni: the code point
// return: the glyphId (0 if not found)
// Notes: Handles formats 1, 4, 12.
SamsaFont.prototype.glyphIdFromUnicode = function (uni) {

	const cmap = this.cmap;
	const characterMap = cmap.characterMap;
	const tbuf = this.bufferFromTable("cmap");
	let g=0;

	switch (characterMap.format) {

		case 1: {
			//g = characterMap.mapping(uni) ?? 0;
			g = characterMap.mapping(uni) ? characterMap.mapping(uni) : 0;
			break;
		}

		case 4: {
			// algo: https://learn.microsoft.com/en-us/typography/opentype/spec/cmap#format-4-segment-mapping-to-delta-values
			let s, segment;
			for (s=0; s<characterMap.segments.length; s++) { // this could be a binary search
				segment = characterMap.segments[s];
				if (uni >= segment.start && uni <= segment.end) {
					break;
				}
			}

			if (s < characterMap.segments.length - 1) {
				if (segment.idRangeOffset) {
					tbuf.seek(characterMap.idRangeOffsetOffset + s * 2 + segment.idRangeOffset + (uni - segment.start) * 2);
					g = tbuf.u16;
					if (g > 0)
						g += segment.idDelta;
				}
				else {
					g = uni + segment.idDelta;
				}								
				g %= 0x10000;
			}
			break;
		}

		case 12: {
			for (let grp=0; grp<characterMap.groups.length; grp++) {
				const group = characterMap.groups[grp];
				if (uni >= group.start && uni <= group.end) {
					g = group.glyphId + uni - group.start;
					break;
				}
			}
			break;
		}

		default:
			break;
	}

	return g;
}


// utility functions
// - these don’t use the font at all, but it’s a way to get them exported
SamsaFont.prototype.linearGradientFromThreePoints = function (points) {
	const
		p0x = points[0][0],
		p0y = points[0][1],
		p1x = points[1][0],
		p1y = points[1][1],
		p2x = points[2][0],
		p2y = points[2][1],
		d1x = p1x - p0x,
		d1y = p1y - p0y,
		d2x = p2x - p0x,
		d2y = p2y - p0y,
		dotProd = d1x*d2x + d1y*d2y,
		rotLengthSquared = d2x*d2x + d2y*d2y,
		magnitude = dotProd / rotLengthSquared,
		finalX = p1x - magnitude * d2x,
		finalY = p1y - magnitude * d2y;

	return [finalX, finalY];
}

SamsaFont.prototype.hexColorFromU32 = function (num) {
	let hex = ((((num & 0xff000000) >>> 16) | (num & 0x00ff0000) | ((num & 0x0000ff00) << 16) | num & 0x000000ff) >>> 0).toString(16).padStart(8, "0");
	if (hex.endsWith("ff"))
		hex = hex.substring(0, 6);
	if (hex[0] == hex[1] && hex[2] == hex[3] && hex[4] == hex[5] && (hex.length == 8 ? hex[6] == hex[7] : true))
		hex = hex[0] + hex[2] + hex[4] + (hex.length == 8 ? hex[6] : "");
	return "#" + hex;
}

SamsaFont.prototype.u32FromHexColor = function (hex, opacity=1) {
	if (hex[0] == "#") {
		hex = hex.substring(1);
	}
	if (hex.match(/^[0-9a-f]{3,8}$/i) && hex.length == 3 || hex.length == 4 || hex.length == 6 || hex.length == 8) {
		if (hex.length <= 4) {
			hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + (hex.length == 4 ? hex[3] + hex[3] : "");
		}
		if (hex.length == 6) {
			hex += (opacity * 255).toString(16).padStart(2,"0");
		}
		return parseInt(hex.substring(4,6), 16) * 0x1000000 + parseInt(hex.substring(2,4), 16) * 0x10000 + parseInt(hex.substring(0,2), 16) * 0x100 + parseInt(hex.substring(6,8), 16);
	}
	else {
		return 0x000000ff; // back to black
	}
}

// - glyphLayout: array 
// - return: SVG ready to use, probably with a transform and viewbox
SamsaInstance.prototype.svgFromGlyphLayout = function (glyphLayout) {

	glyphLayout.forEach(glyphInRun => {
		const [glyphId, translate] = glyphInRun;
	});
	return svg;
}


// take an array of glyphids, and return a sequence of glyphids with layout information
// - glyphIds: array of glyph ids
// - return: glyphLayout, an array of objects, where each object has a glyph and an absolute xy offset

// - note that we are neutral here regarding output format
// - shouldn’t it be SamsaInstance??
SamsaInstance.prototype.glyphLayoutFromGlyphRun = function (glyphIds) {

	// we can use hmtx, vmtx, HVAR, VVAR for this

	const glyphLayout = [];

	const horizontalAdvance = 777;
	const verticalAdvance = 777;

	// uhh... handle OpenType Layout tables here... GSUB, GPOS, GDEF...


	glyphIds.forEach(glyphId => {
		
		const layoutObj = {
			glyph: glyphId,
			advance: [horizontalAdvance, verticalAdvance],
		}

		glyphLayout.push(layoutObj);
	});
	
	return glyphLayout;
}


//////////////////////////////////
//  tupleFromFvs()
// - fvs is an object where axis tags are keys and axis values are values
// - returns: a tuple of length this.axisCount, with values normalized *without* avar mapping; this tuple is suitable to supply new SamsaInstance()
//////////////////////////////////
SamsaFont.prototype.tupleFromFvs = function (fvs) {

	let tuple = [];
	let valid = true;
	if (!this.fvar)
		return tuple;

	this.fvar.axes.forEach((axis,a) => {
		const val = (!fvs || fvs[axis.axisTag] === undefined) ? axis.defaultValue : 1 * fvs[axis.axisTag];
		let n; // normalized value
		if (val == axis.defaultValue)
			n = 0;
		else if (val > axis.defaultValue) {
			if (val > axis.maxValue) // by using > rather than >= here we ensure clamping works properly
				n = 1;
			else
				n = axis.maxValue==axis.defaultValue? 0 : (val - axis.defaultValue) / (axis.maxValue - axis.defaultValue);
		}
		else { // val < axis.defaultValue
			if (val < axis.minValue)
				n = -1;
			else
				n = axis.minValue==axis.defaultValue? 0 : (axis.defaultValue - val) / (axis.minValue - axis.defaultValue);
		}
		tuple[a] = n;
	});

	return valid ? tuple : Array(this.fvar.axisCount).fill(0);
}


//-------------------------------------------------------------------------------
// SamsaInstance
// - font is a SamsaFont
// - tuple is a final tuple, after processing by avar - NO IT’S NOT, IT’S THE ORIGINAL TUPLE
function SamsaInstance(font, userTuple, options={}) {

	//console.log("In SamsaInstance creating with ", userTuple);
	this.font = font;
	const {avar, gvar} = font; // destructure table data objects
	this.tuple = [...userTuple]; // any avar2 changes to tuple are preserved in the instance via this.tuple; maybe we should keep the untransformed tuple around for Samsa-style debugging etc.
	const tuple = this.tuple;
	this.glyphs = [];
	this.deltaSets = {}; // deltaSets from ItemVariationStore: keys are "MVAR", "COLR" etc. Note that each set of deltas corresponds to different types of default item.
	this.sharedScalars = []; // scalars for the sharedTuples are calculated just once per instance
	const buf = font.buf;
	const axisCount = font.fvar ? font.fvar.axisCount : 0;

	// validate tuple
	if (!validateTuple (tuple, axisCount)) {
		return undefined;
	}

	// round tuple to the nearest 1/16384 (ensures we get exactly 0, 1, -1 when we are off by a tiny amount)
	// - the spec: "Convert the final, normalized 16.16 coordinate value to 2.14 by this method: add 0x00000002, and sign-extend shift to the right by 2." https://learn.microsoft.com/en-us/typography/opentype/spec/otvaroverview#coordinate-scales-and-normalization
	for (let a=0; a<axisCount; a++) {
		tuple[a] = Math.round(tuple[a] * 16384) / 16384;
	}

	// avar mappings must come first! since all subsequent variation operation use the tuple remapped by avar
	// - the tuple supplied to the SamsaInstance() constructor is modified here (maybe it should be a copy)
	// - maybe encapsulate avar transform in a function
	if (avar) {

		// avar1
		// - transform tuple into avar-v1-mapped tuple, one axis at a time
		avar.axisSegmentMaps.forEach((map,a) => {
			let n = tuple[a];
			for (let m=0; m<map.length; m++) {
				if (map[m][0] >= n) {
					if (map[m][0] == n)
						n = map[m][1];
					else
						n = map[m-1][1] + (map[m][1] - map[m-1][1]) * ( ( n - map[m-1][0] ) / ( map[m][0] - map[m-1][0] ) );
					break;
				}
			}
			tuple[a] = n;
		});

		// avar2
		// - instantiate the avar2 ItemVariationStore
		if (avar.itemVariationStore) {

			// avar2 mappings
			const deltas = font.itemVariationStoreInstantiate(avar.itemVariationStore, tuple);
			
			// each entry in axisIndexMap defines how a particular axis gets influenced by the region scalars
			// - axisId is given by index in axisIndexMap
			// - note that some axes may not have avar2 transformations: they either have entry==[0xffff,0xffff] or their axisId is >= axisIndexMap.length
			// - index identifies the value in the 2d array interpolatedDeltas (the same indexing that identifies the ivd and the deltaSet within the ivd)
			// - we iterate through all axes, since it could be that this.avar.axisIndexMap.length < this.axisCount yet the last entry in this.axisCount is not 0xffff/0xffff, this must be repeated
			for (let a=0; a<axisCount; a++) {
				let outer, inner;
				if (avar.axisIndexMap) {
					[outer, inner] = avar.axisIndexMap[ Math.min(a, avar.axisIndexMap.length - 1) ]; // use the a’th entry or the last entry of axisIndexMap
				}
				else { // implicit axisIndexMap
					outer = a >> 16; // yes, I know this will always be 0
					inner = a & 0xffff; // yes, I know this will always be a
				}
				if (outer != 0xffff && inner != 0xffff) { // if this entry is non-null... (hmm, might be nicer to have created a sparse array in the first place, skipping nulls and thus avoiding this check)
					tuple[a] += Math.round(deltas[outer][inner]) / 0x4000; // add the interpolated delta to tuple[a]; note that the spec provides an integer method for rounding
					tuple[a] = clamp(tuple[a], -1, 1); // clamp the result to [-1,1]
				}
			}
		}
	}

	
	// instantiate the item variation stores
	// TODO: fix the logic of where this comes... it should probably happen only if(font.avar) rather than within if there are any ItemVariationStores
	// then instantiate the other item variation stores
	Object.keys(font.ItemVariationStores).forEach(key => {

		if (key != "avar") { // we already handled the avar2 ItemVariationStore, if it exists
			const deltaSets = font.itemVariationStoreInstantiate(font.ItemVariationStores[key], tuple); // does this need to stick around? no for MVAR, as we can get the new values
			
			// each ivs has its own way of mapping indices; the mapping can maybe be done JIT...
			switch (key) {
				case "MVAR" : {
					this.MVAR = {};
					Object.keys(font.MVAR.valueRecords).forEach(tag => { // would be slightly more efficient if we store font.MVAR.valueRecords as an array of arrays: [tag, outer, inner], then we can just .forEach() easily
						const [outer, inner] = font.MVAR.valueRecords[tag];
						this.MVAR[tag] = deltaSets[outer][inner]; // e.g. instance.MVAR["xhgt"] = deltaSets[1,15]; // yields delta to add to OS/2.sxHeight for this instance
					});
					break;
				}

				default: {
					this.deltaSets[key] = deltaSets;
					break;
				}
			}
			// note that some itemVariationStore tables (COLR, HVAR) might be large, and it would be better for just a portion to be instantiated on demand
		}
	});

	// calculate instance.sharedScalars (they’re derived from gvar’s shared tuples using the current user tuple)
	// - this caching should marginally speed things up
	// - we index by the same ids used within the per-glyph tvt data deeper in gvar
	// - note this calculation must come after avar calculation
	if (gvar) {
		gvar.sharedTuples.forEach(sharedTuple => {

			let S=1;
			for (let a=0; a<axisCount; a++) { // each element of sharedTuple is -1, 0 or 1 (it records peaks only, with implicit start and end
				if (sharedTuple[a] == 0) // no effect, peak = 0 means do nothing, in other words *= 1
					continue;
				else if (tuple[a] == 0 || sharedTuple[a] * tuple[a] < 0) { // 1) if any of the contributing axes are zero, the scalar is zero; 2) if their signs are different, the scalar is zero
					S = 0;
					break;
				}
				S *= tuple[a]; // the only option left: the simple tent means that the scalar for each axis is equal to the absolute axis value (we fix the sign of S later, after potentially multiple sign flips)
			}
			this.sharedScalars.push(S >= 0 ? S : -S); // fix the sign, then append to this instance’s sharedScalars array
			// TODO: we *can* use sharedScalars like this (they work as is in many fonts) but only in general if they are all non-intermediate, this have peak values -1, 0 or 1 (Bitter variable font violates this, for example)
			// - because the start and end are not local but embedded deep in gvar, we cannot assume they are always the same values (they may very well be, and in theory we could check for this)
			// - currently we are not using sharedScalars
		});
	}

	// instantiate glyphs?
	if (options.allGlyphs) {
		for (let g=0; g<font.numGlyphs; g++) {
			this.glyphs[g] = font.glyphs[g].instantiate(tuple);
		}
	}
	else if (options.glyphIds) {
		options.glyphIds.forEach(g => {
			this.glyphs[g] = font.glyphs[g].instantiate(tuple);
		});
	}
}


// SamsaInstance.glyphAdvance() - return the advance of a glyph
// - we need this method in SamsaInstance, not SamsaGlyph, because SamsaGlyph might not be loaded (and we don’t need to load it, because we have hmtx and HVAR)
// - if we have a variable font and HVAR is not present, we must load the glyph in order to know its variable advance
// - replace it with glyphMetrics() ?
// - maybe we can have a SamsaGlyph.glyphAdvance() method too, which calls this method with its own instance (if it has one).
SamsaInstance.prototype.glyphAdvance = function (glyphId) {
	const font = this.font;
	const advance = [0,0];
	const glyph = font.glyphs[glyphId];
	const iglyph = glyph.instantiate(this);
	// we do not need to decompose 

	if (iglyph) {
		// get the advance from SamsaGlyph
		const numPoints = iglyph.numPoints;
		advance[0] = iglyph.points[numPoints+1][0]; // horizontal advance
		advance[1] = iglyph.points[numPoints+2][1]; // vertical advance
	}
	else {
		// TODO: modify the advance using HVAR, VVAR
		// HVAR and VVAR should already be instantiated
		advance[0] = font.hmtx ? font.hmtx[glyphId] : 0;
		advance[1] = font.vmtx ? font.vmtx[glyphId] : 0;

		if (font.HVAR) {
			const [outer, inner] = font.HVAR.indexMap[glyphId];
			const deltas = font.ItemVariationStores["HVAR"];
			advance[0] += deltas[outer][inner];
		}
	}

	return advance;
}

// input: a string or an array of glyphIds
// - return: a GlyphRun object which is an array of objects, where each object has a glyph and an absolute xy offset
// Examples:
// instance.glyphLayoutFromString("hello") // gets the layout for the string "hello"
// instance.glyphLayoutFromString([234]) // gets the layout for glyph 234
// instance.glyphLayoutFromString([234,55]) // gets the layout for glyph 234 followed by glyph 55
// - a complete implementation would process OpenType Layout features
SamsaInstance.prototype.glyphLayoutFromString = function (input) {
	const font = this.font;
	const glyphLayout = []; // we return this
	let glyphRun = [];
	let x = 0, y = 0;

	// get a simple array of glyphIds (if input is a string, turn it into a simple array of glyphIds)
	if (typeof input == "string") {
		// step through the string in a UTF-16 aware way, that is cool with "🐎🌡️❤️🤯⌚️ΝχQ";
		[...input].forEach(ch => {
			glyphRun.push(font.glyphIdFromUnicode(ch.codePointAt(0)));
		})
	}
	else if (Array.isArray(input)) {
		glyphRun = input;
	}

	// should this already position each glyph absolutely? maybe, to be similar to harfbuzz... simpler for the final rendering

	glyphRun.forEach(glyphId => {

		const [dx, dy] = this.glyphAdvance(glyphId); // glyphAdvance() is responsible for decoding and instantiating the glyph if necessary
	
		// emit similar format to harfbuzz
		glyphLayout.push({
			id: glyphId,
			ax: x,
			ay: y,
			dx: dx,
			dy: dy,
		});

		x += dx; // horizontal advance
		y += dy; // vertical advance

	});

	// get the glyph ids for the characters in the string
	
	// process the glyphid sequence to get substitutions and positioning
	// - we can do this with:
	//   - harfbuzz.wasm
	//   - opentype.js
	//   - fontkit.js
	//   - basic metrics, no kerning (no subsitutions)
	//   - basis metrics, kern table (no subsitutions)

	return glyphLayout;
}


//-------------------------------------------------------------------------------
// SamsaGlyph
function SamsaGlyph (init={}) {

	this.id = init.id;
	this.name = init.name;
	this.font = init.font;
	this.numPoints = init.numPoints || 0;
	this.numberOfContours = init.numberOfContours || 0;
	this.instructionLength = 0;
	this.points = init.points || [];
	this.components = init.components || [];
	this.endPts = init.endPts || [];
	this.tvts = init.tvts || []; // undefined means not parsed; empty array means no tvts
	this.curveOrder = 2; 
	//this.curveOrder = init.curveOrder || (this.font ? this.font.curveOrder : undefined);
}


// SamsaGlyph.instantiate()
// - instantiates a glyph
// The first argument is either a SamsaInstance or a tuple
// - if it’s a SamsaInstance, then it takes that instance’s tuple and gets inserted into the glyphs array of the instance
// - if it’s a tuple, then it is a standalone glyph
SamsaGlyph.prototype.instantiate = function(arg, options={}) {

	const iglyph = new SamsaGlyph();
	const font = this.font;
	const axisCount = font.fvar ? font.fvar.axisCount : 0;
	const ignoreIUP = false;

	if (arg instanceof SamsaInstance) {
		arg.glyphs[this.id] = iglyph;
		iglyph.instance = arg;
		iglyph.tuple = arg.tuple;
	}
	else if (validateTuple (arg, axisCount)) {
		iglyph.tuple = tuple;
		// it’s a glyph without an instance... this feels dangerous, since we may need ItemVariationStore data that we are not yet calculating JIT
	}
	else {
		iglyph.tuple = Array(axisCount).fill(0);
	}

	iglyph.id = this.id;
	iglyph.name = this.name;
	iglyph.font = this.font;
	iglyph.numPoints = this.numPoints;
	iglyph.numberOfContours = this.numberOfContours;
	iglyph.instructionLength = this.instructionLength;
	iglyph.components = this.components;
	iglyph.endPts = this.endPts;
	iglyph.tvts = this.tvts;
	iglyph.curveOrder = this.curveOrder;
	iglyph.touched = []; // helpful for visualising variations
	iglyph.viz = {tvts: []}; // visualization data

	// instantiate points: copy the points of glyph into iglyph
	let p=this.points.length;
	while (--p >= 0) {
		const point = this.points[p];
		iglyph.points[p] = [point[0], point[1], point[2]]; // note that [...point] is slower :)
	}

	// go through each tvt (=tuple variation table) for this glyph
	this.tvts.forEach(tvt => {

		const scaledDeltas = [];
		const touched = [];
		let pt = this.points.length;
		let S;

		// initialize the scaledDeltas array to zero vectors
		while (--pt >= 0) {
			scaledDeltas[pt] = [0,0];
		}

		// sharedScalars are disabled for now
		if (true) {
			// go thru each axis, multiply a scalar S from individual scalars AS
			// - if the current designspace location is outside of this tvt’s tuple, we get S = 0 and nothing is done
			// - based on pseudocode from https://www.microsoft.com/typography/otspec/otvaroverview.htm
			S = 1
			for (let a=0; a<axisCount; a++) {
				const ua = iglyph.tuple[a];
				const [start, peak, end] = [tvt.start[a], tvt.peak[a], tvt.end[a]]; // TODO: store these as 3-element arrays
				if (peak != 0) {
					if (ua < start || ua > end) {
						S = 0;
						break;
					}
					else if (ua < peak)
						S *= (ua - start) / (peak - start);
					else if (ua > peak)
						S *= (end - ua) / (end - peak);
				}
			}
		}
		else {}


		// now we can move the points by S * delta
		// OPTIMIZE: it must be possible to optimize for the S==1 case, but attempts reduce speed...
		if (S != 0) {

			pt = this.points.length;
			while (--pt >= 0) {
				const delta = tvt.deltas[pt];				
				if (delta !== null && delta !== undefined) { // if not IUP
					touched[pt] = true; // touched[] is just for this tvt; newGlyph.touched[] is for all tvts (in case we want to show IUP in UI) 
					scaledDeltas[pt] = [S * delta[0], S * delta[1]];
				}
			}

			// IUP
			// - TODO: ignore this step for composites (even though it is safe because numberOfContours<0)
			// - OPTIMIZE: calculate IUP deltas when parsing, then a "deltas" variable can point either to the original deltas array or to a new scaled deltas array (hmm, rounding will be a bit different if IUP scaled deltas are always based on the 100% deltas)
			if (!tvt.allPoints && this.numberOfContours > 0 && touched.length > 0 && !ignoreIUP) { // it would be nice to check "touched.length < glyph.points.length" but that won’t work with sparse arrays, and must also think about phantom points

				// for each contour
				for (let c=0, startPt=0; c<this.numberOfContours; c++) {
				
					// OPTIMIZE: check here that the contour is actually touched
					const numPointsInContour = this.endPts[c]-startPt+1;
					let firstPrecPt = -1; // null value
					let precPt, follPt;
					for (let p=startPt; p!=firstPrecPt; ) {
						let pNext = (p-startPt+1)%numPointsInContour+startPt;
						if (touched[p] && !touched[pNext]) { // found a precPt
							// get precPt and follPt
							precPt = p;
							follPt = pNext;
							if (firstPrecPt == -1)
								firstPrecPt = precPt;
							do {
								follPt = (follPt-startPt+1) % numPointsInContour + startPt;
							} while (!touched[follPt]) // found the follPt

							// perform IUP for x(0), then for y(1)
							for (let xy=0; xy<=1; xy++) {

								// IUP spec: https://www.microsoft.com/typography/otspec/gvar.htm#IDUP
								const pA = this.points[precPt][xy];
								const pB = this.points[follPt][xy];
								const dA = scaledDeltas[precPt][xy];
								const dB = scaledDeltas[follPt][xy];

								for (let q=pNext, D, T, Q; q!=follPt; q= (q-startPt+1) % numPointsInContour + startPt) {
									Q = this.points[q][xy];
									if (pA == pB)
										D = dA == dB ? dA : 0;
									else {
										if (Q <= pA && Q <= pB)
											D = pA < pB ? dA : dB;
										else if (Q >= pA && Q >= pB)
											D = pA > pB ? dA : dB;
										else {
											T = (Q - pA) / (pB - pA); // safe for divide-by-zero
											D = (1-T) * dA + T * dB;
										}
									}
									scaledDeltas[q][xy] += D;
								}
							}
							p = follPt;
						}
						else if (pNext == startPt && firstPrecPt == -1) // failed to find a precPt, so abandon this contour
							break;
						else
							p = pNext;
					}
					startPt = this.endPts[c]+1;
				}
			} // if IUP

			// add the net deltas to the glyph
			// TODO: Try to avoid this step for points that were not moved
			// TODO: Understand whether rounding is definitely wrong here.
			// - https://docs.microsoft.com/en-us/typography/opentype/spec/otvaroverview
			iglyph.points.forEach((point, pt) => {
				point[0] += scaledDeltas[pt][0];
				point[1] += scaledDeltas[pt][1];
			});
		}

		// store S and scaledDeltas so we can use them in visualization
		// - maybe we should recalculate multiple AS values and 1 S value in the GUI so we don’t add load to samsa-core
		if (options.visualization) {
			iglyph.viz.tvts.push({
				S: S,
				scaledDeltas: scaledDeltas,
			});
		}

	}); // end of processing the tvts

	// recalculate bbox
	// - TODO: fix for composites and non-printing glyphs (even though the latter don’t record a bbox)
	// iglyph.recalculateBounds();

	// attach the instantiated glyph to the instance
	if (iglyph.instance)
		iglyph.instance.glyphs[this.id] = iglyph;

	return iglyph;
}


// decompose()
// - decompose a composite glyph into a new simple glyph
// - TODO: fix this for the new paradigms :)
//SamsaGlyph.prototype.decompose = function (tuple, params) {
//SamsaGlyph.prototype.decompose = function (instance, params) {
SamsaGlyph.prototype.decompose = function (params) {

	// "this" is either a glyph (without an instance) or an instantiated glyph (with an instance)

	const font = this.font;
	let simpleGlyph = new SamsaGlyph( {
		id: this.id,
		name: this.name,
		font: font,
		curveOrder: this.curveOrder,
		endPts: [],
	} );

	if (this.instance) {
		simpleGlyph.instance = this.instance;
	}

	let offset, transform, flags;
	if (params) {
		offset = params.offset;
		transform = params.transform;
		flags = params.flags;
	}

	// simple case
	if (this.numberOfContours >= 0) {

		if (!params) // optimization for case when there’s no offset and no transform (we can make this return "this" itself: the decomposition of a simple glyph is itself)
			return this;

		// append all the points (ignore phantom points)
		for (let pt=0; pt<this.numPoints; pt++) {

			// spec: https://docs.microsoft.com/en-us/typography/opentype/spec/glyf
			let point = [ this.points[pt][0], this.points[pt][1], this.points[pt][2] ]; // needs to be a deep copy, I think

			// offset before transform
			if (offset && (flags & 0x0800)) { // SCALED_COMPONENT_OFFSET
				point[0] += offset[0];
				point[1] += offset[1];
			}

			// transform matrix?
			if (transform) {
				let x = point[0], y = point[1];
				point[0] = x * transform[0] + y * transform[1];
				point[1] = x * transform[2] + y * transform[3];
			}

			// offset after transform
			if (offset && !(flags & 0x0800)) { // SCALED_COMPONENT_OFFSET
				point[0] += offset[0];
				point[1] += offset[1];
			}

			simpleGlyph.points.push(point);
		}

		// fix up simpleGlyph
		// TODO: can these point to the original objects?
		this.endPts.forEach(endPt => {
			simpleGlyph.endPts.push(endPt + simpleGlyph.numPoints);
		});
		simpleGlyph.numPoints += this.numPoints;
		simpleGlyph.numberOfContours += this.numberOfContours;
	}

	else {
		// step thru components, adding points to simpleGlyph
		this.components.forEach((component, c) => {

			// get gc, the component glyph, instantiate if necessary
			let gc;
			if (this.instance) {
				gc = this.instance.glyphs[component.glyphId]; // attempt to get the instanted glyph
				if (!gc) { // if it’s not already instantiated, instantiate it
					const gcDefault = font.glyphs[component.glyphId] || font.loadGlyphById(component.glyphId); // fetch from binary if not already loaded
					gc = gcDefault.instantiate(this.instance); // it still needs to be decomposed
				}
			}
			else {
				gc = font.glyphs[component.glyphId] || font.loadGlyphById(component.glyphId);
			}

			const matched = component.matchedPoints;
			const newTransform = component.transform;
			let newOffset = [ this.points[c][0], this.points[c][1] ];
			if (offset) {
				newOffset[0] += offset[0];
				newOffset[1] += offset[1];
			}

			// decompose!
			// - this is the recursive step
			let decomp = gc.decompose({
				offset: newOffset,
				transform: newTransform,
				flags: component.flags,
				matched: matched,
			});

			// get delta if this component is positioned with "matched points"
			let dx=0, dy=0;
			if (matched) {
				dx = simpleGlyph.points[matched[0]][0] - decomp.points[matched[1]][0];
				dy = simpleGlyph.points[matched[0]][1] - decomp.points[matched[1]][1];
			}

			// we now have the simple glyph "decomp": no offset or transform is needed (but we may need to match points using dx,dy)
			for (let p=0; p<decomp.numPoints; p++) {
				simpleGlyph.points.push([
					decomp.points[p][0] + dx,
					decomp.points[p][1] + dy,
					decomp.points[p][2]
				]);
			}

			// fix up simpleGlyph
			decomp.endPts.forEach(endPt => {
				simpleGlyph.endPts.push(endPt + simpleGlyph.numPoints);
			});
			simpleGlyph.numPoints += decomp.numPoints;
			simpleGlyph.numberOfContours += decomp.numberOfContours;
		});
	}


	// add the 4 phantom points
	simpleGlyph.points.push([0,0,0], [this.points[this.points.length-3][0],0,0], [0,0,0], [0,0,0]);

	// return the simple glyph
	return simpleGlyph;

}

// svgPath()
// - export glyph as a string suitable for the SVG <path> "d" attribute
SamsaGlyph.prototype.svgPath = function () {

	let contours = [];
	let contour, contourLen, pt, pt_, pt__, p, startPt;
	let path = "";

	switch (this.curveOrder) {

		// quadratic curves
		case 2:

			// LOOP 1: convert the glyph contours into an SVG-compatible contours array
			startPt = 0;
			this.endPts.forEach(endPt => {
				contourLen = endPt-startPt+1; // number of points in this contour
				contour = [];

				// insert on-curve points between any two consecutive off-curve points
				for (p=startPt; p<=endPt; p++) {
					pt = this.points[p];
					pt_ = this.points[(p-startPt+1)%contourLen+startPt];
					contour.push (pt);
					if (!(pt[2] & 0x01 || pt_[2] & 0x01)) // if we have 2 consecutive off-curve points...
						contour.push ( [ (pt[0]+pt_[0])/2, (pt[1]+pt_[1])/2, 1 ] ); // ...we insert the implied on-curve point
				}

				// ensure SVG contour starts with an on-curve point
				if (!(contour[0][2] & 0x01)) // is first point off-curve?
					contour.unshift(contour.pop()); // OPTIMIZE: unshift is slow, so maybe build two arrays, "actual" and "toAppend", where "actual" starts with an on-curve

				// append this contour
				contours.push(contour);

				startPt = endPt+1;
			});

			// LOOP 2: convert contours array to an actual SVG path
			// - we’ve already fixed things in loop 1 so there are never consecutive off-curve points
			contours.forEach(contour => {
				for (p=0; p<contour.length; p++) {
					pt = contour[p];
					if (p==0)
						path += `M${pt[0]} ${pt[1]}`;
					else {
						if (pt[2] & 0x01) { // on-curve point (consume 1 point)
							path += `L${pt[0]} ${pt[1]}`;
						}
						else { // off-curve point (consume 2 points)
							pt_ = contour[(++p) % contour.length]; // increments loop variable p
							path += `Q${pt[0]} ${pt[1]} ${pt_[0]} ${pt_[1]}`;
						}
					}
				}
				path += "Z";
			});

			break;

		// cubic curves
		// - EXPERIMENTAL!
		// - for use with ttf-cubic format, cff (when we implement cff), and glyf1
		case 3:
			startPt = 0;

			// loop through each contour
			this.endPts.forEach(endPt => {

				let firstOnPt;
				contourLen = endPt-startPt+1;

				// find this contour’s first on-curve point: it is either startPt, startPt+1 or startPt+2 (else the contour is invalid)
				if      (contourLen >= 1 && this.points[startPt][2] & 0x01)
					firstOnPt = 0;
				else if (contourLen >= 2 && this.points[startPt+1][2] & 0x01)
					firstOnPt = 1;
				else if (contourLen >= 3 && this.points[startPt+2][2] & 0x01)
					firstOnPt = 2;

				if (firstOnPt !== undefined) {

					// loop through all this contour’s points
					for (p=0; p<contourLen; p++) {

						pt = this.points[startPt + (p+firstOnPt) % contourLen];
						if (p==0)
							path += `M${pt[0]} ${pt[1]}`;
						else {
							if (pt[2] & 0x01) { // on-curve point (consume 1 point)
								path += `L${pt[0]} ${pt[1]}`;
							}
							else { // off-curve point (consume 3 points)
								pt_ = this.points[startPt + ((++p + firstOnPt) % contourLen)]; // increments loop variable p
								pt__ = this.points[startPt + ((++p + firstOnPt) % contourLen)]; // increments loop variable p
								path += `C${pt[0]} ${pt[1]} ${pt_[0]} ${pt_[1]} ${pt__[0]} ${pt__[1]}`;
							}
							if (p == (contourLen+firstOnPt-1) % contourLen)
								path += "Z";
						}
					}
				}

				startPt = endPt+1;
			});
			break;
	}

	return path;
};

// exportPath()
// - export glyph outline in arbitrary ways, according to the supplied SamsaContext
// - SamsaContext provides various functions, ctx.moveto(), ctx.lineto, ctx.quadto, etc.
SamsaGlyph.prototype.exportPath = function (ctx) {

	const contours = [];
	const glyph = this.numberOfContours < 0 ? this.decompose() : this;
	let contour, contourLen, pt, pt_, pt__, c, p, startPt;

	switch (this.curveOrder) {

		// quadratic curves
		case 2:

			// LOOP 1: convert the glyph contours into an SVG-compatible contours array
			startPt = 0;
			//this.endPts.forEach(endPt => {
			glyph.endPts.forEach(endPt => {
				
				contourLen = endPt-startPt+1; // number of points in this contour
				contour = [];

				// insert on-curve points between any two consecutive off-curve points
				for (p=startPt; p<=endPt; p++) {
					// pt = this.points[p];
					// pt_ = this.points[(p-startPt+1)%contourLen+startPt];
					pt = glyph.points[p];
					pt_ = glyph.points[(p-startPt+1)%contourLen+startPt];
					contour.push (pt);
					if (!(pt[2] & 0x01 || pt_[2] & 0x01)) // if we have 2 consecutive off-curve points...
						contour.push ( [ (pt[0]+pt_[0])/2, (pt[1]+pt_[1])/2, 1 ] ); // ...we insert the implied on-curve point
				}

				// ensure SVG contour starts with an on-curve point
				if (!(contour[0][2] & 0x01)) // is first point off-curve?
					contour.unshift(contour.pop()); // OPTIMIZE: unshift is slow, so maybe build two arrays, "actual" and "toAppend", where "actual" starts with an on-curve

				// append this contour
				contours.push(contour);
				startPt = endPt+1;
			});

			// LOOP 2: convert contours array to an actual SVG path
			// - we’ve already fixed things in loop 1 so there are never consecutive off-curve points
			contours.forEach(contour => {
				for (p=0; p<contour.length; p++) {
					pt = contour[p];
					if (p==0) {
						ctx.moveto(pt[0], pt[1]);
					}
					else {
						if (pt[2] & 0x01) { // on-curve point (consume 1 point)
							ctx.lineto(pt[0], pt[1]);
						}
						else { // off-curve point (consume 2 points)
							pt_ = contour[(++p) % contour.length]; // increments loop variable p
							ctx.quadto(pt[0], pt[1], pt_[0], pt_[1]);
						}
					}
				}
				ctx.closepath();
			});

			break;

		// cubic curves
		// - EXPERIMENTAL!
		// - for use with ttf-cubic format, cff (when we implement cff), and glyf1
		case 3:
			startPt = 0;

			// loop through each contour
			this.endPts.forEach(endPt => {

				let firstOnPt;
				contourLen = endPt-startPt+1;

				// find this contour’s first on-curve point: it is either startPt, startPt+1 or startPt+2 (else the contour is invalid)
				if      (contourLen >= 1 && this.points[startPt][2] & 0x01)
					firstOnPt = 0;
				else if (contourLen >= 2 && this.points[startPt+1][2] & 0x01)
					firstOnPt = 1;
				else if (contourLen >= 3 && this.points[startPt+2][2] & 0x01)
					firstOnPt = 2;

				if (firstOnPt !== undefined) {

					// loop through all this contour’s points
					for (p=0; p<contourLen; p++) {

						pt = this.points[startPt + (p+firstOnPt) % contourLen];
						if (p==0) {
							ctx.moveto(pt[0], pt[1]);
						}
						else {
							if (pt[2] & 0x01) { // on-curve point (consume 1 point)
								ctx.lineto(pt[0], pt[1]);
							}
							else { // off-curve point (consume 3 points)
								pt_ = this.points[startPt + ((++p + firstOnPt) % contourLen)]; // increments loop variable p
								pt__ = this.points[startPt + ((++p + firstOnPt) % contourLen)]; // increments loop variable p
								ctx.curveto(pt[0], pt[1], pt_[0], pt_[1], pt__[0], pt__[1]);
							}
							if (p == (contourLen+firstOnPt-1) % contourLen) {
								ctx.closepath();
							}
						}
					}
				}

				startPt = endPt+1;
			});
			break;
	}

	//return path;
};

// process paint tables for a glyph, producing a DAG (directed acyclic graph) of paint tables, that can be used to render the glyph or make a diagram of its paint structure
// - return false if there is no COLRv1 data for this glyph
// - consider returning COLRv0 data in the form of paint tables, so that only one colour "renderer" is needed
SamsaGlyph.prototype.paint = function (context={}) {
	const offset = this.findCOLR(1);

	if (!offset) {
		return false; // no COLRv1 data for this glyph
	}
	else {
		const font = this.font;
		const buf = font.bufferFromTable("COLR");
		const colr = font.COLR;
		const cpal = font.CPAL;
		const gradients = context.gradients;
		const palette = cpal.palettes[context.paletteId || 0];

		if (context.color === undefined) context.color = 0x000000ff;
		if (!context.rendering) context.rendering = {};
		if (!context.gradients) context.gradients = {};
		if (!context.font) context.font = font;
		if (!context.rendering) context.rendering = {};
		context.paintIds = []; // keep track of the paint IDs we’ve used (must be reset for each glyph): we 

		// fetch the DAG of paint tables recursively
		buf.seek(offset);
		const paint = buf.decodePaint(context); // recursive (offer a non-recursive option?)
		context.paintIds = null; // we no longer need this
		return paint;
	}
}


// paintSVG() renders a COLRv1 DAG (paint tree) recursively
// - paint (required) is the root of the DAG, or subroot when called recursively
// - context (required) contains:
//   .font, a reference to the SamsaFont object
//   .color, the foreground color being used in U32 format (optional, default is 0x000000ff)
//   .paths, object to cache the monochrome glyph outlines used in the text run, indexed by glyphId
//   .gradients, object to cache the gradients used, indexed by gradientId
// - the function does not make use of the SamsaGlyph object at all, it’s just convenient for export
// - the main switch statement selects between the 4 paint types; paint types group paint formats together, and are stored in PAINT_TYPES; PAINT_COMPOSE is the only non-recursive paint type (paint format=32 is a special case which needs to recurse 2 paint trees before the compose operation)
// - the result of a paintSVG() still needs to be wrapped in a <svg> element, and <defs> needs to be constructed from .paths and .gradients
SamsaGlyph.prototype.paintSVG = function (paint, context) {
	const font = context.font;
	const palette = font.CPAL.palettes[context.paletteId || 0];
	if (context.color === undefined)
		context.color = 0x000000ff; // black

	let svg = `<g>`;

	switch (PAINT_TYPES[paint.format]) {

		case PAINT_LAYERS: {
			paint.children.forEach(child => {
				svg += this.paintSVG(child, context);
			});
			break;
		}

		case PAINT_SHAPE: {
			if (!context.paths[paint.glyphID]) {
				const glyph = context.font.glyphs[paint.glyphID];
				const iglyph = glyph.instantiate(context.instance);
				const path = iglyph.svgGlyphMonochrome(0); // retrieve it if we don't already have it
				context.paths[paint.glyphID] = `<path id="g${paint.glyphID}" d="${path}"/>`;
			}
			context.lastGlyphId = paint.glyphID;
			svg += this.paintSVG(paint.children[0], context); // there’s only one child; this should be a fill or a gradient (or maybe another PAINT_SHAPE)
			break;
		}

		case PAINT_TRANSFORM: {
			const center = paint.center;
			let transform = "";
			if (paint.translate) {
				transform = `translate(${paint.translate[0]} ${paint.translate[1]})`;
			}
			else if (paint.matrix) {
				transform = `matrix(${paint.matrix.join(" ")})`;
			}
			else if (paint.rotate) {
				transform += `rotate(${-paint.rotate}` + (center ? ` ${center[0]} ${center[1]}` : "") +`)`; // flip sign of angle, and use the 3-argument form if there is a center
			}
			else {
				if (center) {
					transform += `translate(${center[0]} ${center[1]}) `;
				}
				if (paint.scale) {
					transform += `scale(${paint.scale[0]} ${paint.scale[1]})`;
				}
				else if (paint.skew) {
					transform += `skewX(${-paint.skew[0]})skewY(${-paint.skew[1]})`; // flip sign of angles
				}
				if (center) {
					transform += ` translate(${-center[0]} ${-center[1]})`;
				}
			}

			/*
			switch (paint.format - paint.format % 2) { // 12 and 13 -> 12, 14 and 15 -> 14, etc. (variation deltas have already been added)

				// these are more efficnently done by checking paint.skew etc. directly
				// if (paint.matrix) etc.

				case 12: { // PaintTransform
					transform = `matrix(${paint.matrix.join(" ")})`;
					break;
				}
				case 14: { // PaintTranslate
					transform = `translate(${paint.translate[0]} ${paint.translate[1]})`;
					break;
				}
				case 16: case 18: case 20: case 22: { // PaintScale
					if (paint.center) transform += `translate(${-paint.center[0]} ${-paint.center[1]})`;
					transform += `scale(${paint.scale.join(" ")})`;
					if (paint.center) transform += `translate(${paint.center[0]} ${paint.center[1]})`;
					break;
				}
				case 24: case 26: { // PaintRotate
					if (paint.center) transform += `translate(${-paint.center[0]} ${-paint.center[1]})`;
					transform += `rotate(${-paint.rotate})`; // flip sign of angle
					if (paint.center) transform += `translate(${paint.center[0]} ${paint.center[1]})`;
					break;
				}
				case 28: case 30: { // PaintSkew
					if (paint.center) transform += `translate(${-paint.center[0]} ${-paint.center[1]})`;
					transform += `skewX(${-paint.skew[0]})`; // flip sign of angle
					transform += `skewY(${-paint.skew[1]})`; // flip sign of angle
					if (paint.center) transform += `translate(${paint.center[0]} ${paint.center[1]})`;
					break;
				}
			}
			*/

			svg = `<g transform="${transform}">`; // rewrite <g> tag
			svg += this.paintSVG(paint.children[0], context); // there’s only one child
			break;
		}

		case PAINT_COMPOSE: {
			switch (paint.format) {
				case 2: case 3: { // PaintSolid
					const paletteIndex = paint.paletteIndex;
					const color = paletteIndex == 0xffff ? context.color : palette.colors[paletteIndex];
					svg += `<use x="0" y="0" href="#g${context.lastGlyphId}" fill="${font.hexColorFromU32(color)}" />`; // maybe update these x and y later
					break;
				}

				case 4: case 5: { // PaintLinearGradient
					if (!context.gradients[paint.offset]) { // we use paint.offset as gradientId

						// calculate the gradient line (p0x,p0y)..(finalX, finalY) from the 3 points by determining the projection vector via the dot product
						const
							p0x = paint.points[0][0],
							p0y = paint.points[0][1],
							p1x = paint.points[1][0],
							p1y = paint.points[1][1],
							p2x = paint.points[2][0],
							p2y = paint.points[2][1],
							d1x = p1x - p0x,
							d1y = p1y - p0y,
							d2x = p2x - p0x,
							d2y = p2y - p0y,
							dotProduct = d1x*d2x + d1y*d2y,
							rotLengthSquared = d2x*d2x + d2y*d2y,
							magnitude = dotProduct / rotLengthSquared,
							finalX = p1x - magnitude * d2x,
							finalY = p1y - magnitude * d2y;

						let gradient = `<linearGradient id="f${paint.offset}" gradientUnits="userSpaceOnUse" x1="${p0x}" y1="${p0y}" x2="${finalX}" y2="${finalY}">`; // paint.offset is gradientId
						paint.colorLine.colorStops.forEach(colorStop => {
							const paletteIndex = colorStop.paletteIndex;
							const color = paletteIndex == 0xffff ? context.color : palette.colors[paletteIndex];
							gradient += `<stop offset="${colorStop.stopOffset*100}%" stop-color="${font.hexColorFromU32(color)}"/>`;
						});
						gradient += `</linearGradient>`;
						context.gradients[paint.offset] = gradient; // paint.offset is gradientId
					}
					svg += `<use href="#g${context.lastGlyphId}" fill="url(#f${paint.offset})" />`; // we have x and y attributes available here, but we use the enclosing <g> instead
					// lastGlyphId is not satisfactory, since we may have several consecutive format 10 tables defining a clip path (in practice this seems uncommon)
					break;
				}

				case 6: case 7: { // PaintRadialGradient, PaintVarRadialGradient

					break;
				}

				case 8: case 9: { // PaintSweepGradient, PaintVarSweepGradient

					break;
				}

				case 32: { // PaintComposite

					const src = this.paintSVG(paint.children[0], context); // source
					const dest = this.paintSVG(paint.children[1], context); // destination
					const feMode = FECOMPOSITE_MODES[paint.compositeMode];
					const cssMode = CSS_MIX_BLEND_MODES[paint.compositeMode];

					//const mode = FECOMPOSITE_MODES[paint.compositeMode] || CSS_MIX_BLEND_MODES[paint.compositeMode];
					if (feMode) {
						svg = `<g mix-blend-mode="${feMode}">`;
						svg += src;
						svg += dest;
						svg += `</g>`;
					}
					else if (cssMode) {
						svg = `<g style="mix-blend-mode: ${cssMode};">`;
						svg += src;
						svg += dest;
						svg += `</g>`;
					}
					else {
						switch (paint.compositeMode) {
							case 0: {
								// do nothing
								break;
							}
							case 1: {
								// paint src
								svg += src;
								break;
							}
							case 2: {
								// paint dest
								svg += dest;
								break;
							}
						}
					}
					break;
				}
			}
			break;
		}
	}
	
	svg += "</g>";
	return svg;
}

SamsaGlyph.prototype.svgGlyphCOLRv1 = function (context={}) {
	const result = this.findCOLR(1); // might be undefined
	if (result) {
		const paintDag = this.paint(context);
		if (paintDag) {
			const svgResult = this.paintSVG(paintDag, context); // we could bring the paintSVG function inside here, but there seems little point
			return svgResult; // this is a <g> element ready to be inserted into an <svg>, but we must also remember to add the paths and gradients from the context
		}
		else {
			return false; // we didn’t find a COLRv1 glyph
		}
	}
}

SamsaGlyph.prototype.svgGlyphCOLRv0 = function (context={}) { // we need to poss the instance, right?
	const result = this.findCOLR(0); // might be undefined
	if (result) {
		const [firstLayerIndex, numLayers] = result;
		const font = this.font;
		const buf = font.bufferFromTable("COLR");
		const colr = font.COLR;
		const cpal = font.CPAL;
		//const defaultColor = context.color ?? 0x000000ff; // default color // allows 0x000000000 (a valid transparent color)
		const defaultColor = context.color === undefined ? 0x000000ff : context.color; // default color // allows 0x000000000 (a valid transparent color)
		const palette = cpal.palettes[context.paletteId || 0];
		let paths = "";
		for (let i=0; i<numLayers; i++) {
			buf.seek(colr.layerRecordsOffset + 4 * (firstLayerIndex + i));
			const glyphId = buf.u16;
			const paletteIndex = buf.u16;
			const layerGlyph = font.glyphs[glyphId];
			const iGlyph = layerGlyph.instantiate(context.instance);
			const dGlyph = iGlyph.decompose();
			if (dGlyph.numberOfContours > 0) {
				const layerColor = paletteIndex == 0xffff ? defaultColor : palette.colors[paletteIndex]; // TODO: omit fill if paletteIndex == 0xffff, and put it in the containing <g> element instead
				paths += `<path d="${dGlyph.svgPath()}" fill="${font.hexColorFromU32(layerColor)}"/>\n`; // TODO: precalculate the hex strings for the palettes? NO
			}
		}
		return paths;
	}
	else {
		return false; // we didn’t find a COLRv0 glyph
	}
}

function SamsaContext(options) {
	this.path = [];
	this.beginpath = options.beginpath;
	this.moveto = options.moveto;
	this.lineto = options.lineto;
	this.quadto = options.quadto;
	this.cubicto = options.cubicto;
	this.closepath = options.closepath;
	this.color = options.color;
	this.paletteId = options.paletteId;
	this.gradientId = options.gradientId;
	this.gradientPoints = options.gradientPoints;
	this.gradientStops = options.gradientStops;
	this.gradientType = options.gradientType;
	//this.popTransform = options.gradientTransform;
	this.ctx = options.ctx; // this is used for the actual HTML canvas context (ignored in SVG)
}


// SamsaGlyph.prototype.svgGlyphMonochrome = function () {

// 	// TODO: don’t return anything for empty glyphs, but take account of metrics
// 	return `<path d="${this.svgPath()}"/>`;

// }


SamsaGlyph.prototype.svgGlyphMonochrome = function (wrap=1) {

	// TODO: don’t return anything for empty glyphs, but take account of metrics

	//return `<path d="${this.svgPath()}"/>`;
	// this is SVG but we can do canvas too

	let ctx = new SamsaContext(DRAW_FUNCTIONS[CONTEXT_SVG]);
	this.exportPath(ctx); // complete the ctx.path string with the SVG representation of the glyph

	if (wrap)
		return `<path d="${ctx.path.join("")}"/>`;
	else
		return ctx.path.join("");

	// let ctxCanvas = new SamsaContext(DRAW_FUNCTIONS[CONTEXT_CANVAS]);
	// ctxCanvas.ctx = ctx;
	//ctxCanvas.ctx.fillStyle = "#ff0000";


	// return `<path d="${this.svgPath()}"/>`;

}


SamsaGlyph.prototype.canvasGlyphMonochrome = function (ctx) {
	let ctxSamsa = new SamsaContext(DRAW_FUNCTIONS[CONTEXT_CANVAS]);
	//ctxCanvas.ctx = ctx;
	this.exportPath(ctxSamsa); // now this.path contains multiple drawing commands

	//console.log(ctxCanvas.path);

	// fetch the drawing commands
	ctx.beginPath();

	ctxSamsa.path.forEach(cmd => {

		const op = cmd.pop();
		switch (op) {

			case "M":
				ctx.moveTo(...cmd);
				break;
			
			case "L":
				ctx.lineTo(...cmd);
				break;

			case "C":
				ctx.bezierCurveTo(...cmd);
				break;
			
			case "Q":
				ctx.quadraticCurveTo(...cmd);
				break;

			case "Z":
				ctx.closePath();
				break;
		}
	})
	ctx.fill();
}


SamsaGlyph.prototype.maxCOLR = function () {
	return this.findCOLR(1) ? 1 : this.findCOLR(0) ? 0 : undefined;
}

// does this glyph have a color glyph of the given COLR table version?
// - we could build this into the svgGlyphCOLRv1() and svgGlyphCOLRv0() methods but defining it separately makes it possible to test for presence efficiently
SamsaGlyph.prototype.findCOLR = function (version) {
	const font = this.font;
	const colr = font.COLR;
	if (colr) {
		let b=0;
		let glyphId;

		if (version == 1 && colr.version >= 1) {
			return colr.baseGlyphPaintRecords[this.id]; // returns offset to the paint record or undefined
		}
		else if (version == 0 && colr.version >= 0) {
			return colr.baseGlyphRecords[this.id]; // returns [firstLayerIndex, numLayers] or undefined
		}

		// if (version == 1 && colr.version >= 1) {
		// 	buf.seek(colr.baseGlyphListOffset);
		// 	const numBaseGlyphPaintRecords = buf.u32;
		// 	while (b++ < numBaseGlyphPaintRecords && (glyphId = buf.u16) < this.id) { // look for glyph id in BaseGlyphPaintRecords (TODO: binary search) hmm, why not prepopulate this?
		// 		buf.seekr(4);
		// 	}
		// 	if (glyphId == this.id)
		// 		return buf.tell()-2; // CHECK that -2 is correct to undo the u16 read
		// }

		// else if (version == 0 && colr.version >= 0) {
		// 	buf.seek(colr.baseGlyphRecordsOffset);
		// 	while (b++ < colr.numBaseGlyphRecords && (glyphId = buf.u16) < this.id) { // look for glyph id in baseGlyphRecords (TODO: binary search)
		// 		buf.seekr(4);
		// 	}
		// 	if (glyphId == this.id)
		// 		return buf.tell()-2;
		// }
	}
	return false;
}

// SamsaGlyph.svg()
// - we don’t want this method to supply a final svg... since we 
// - style supplies various parameters to style the resulting SVG
//     Styling is applied to the <g> element that contains the glyph.
//     Try { fill: "red" } or { fill: "red", transform: "translate(130,500) scale(0.5 -0.5)" }
//     Currently only supports class, fill, stroke, strokeWidth, transform.
//     Note that the transform property is assigned to the transform attribute, not the style attribute.
// - options.colr selects the *maximum* color format to use: 1=COLRv1, 0=COLRv0, -1=monochrome
// - options.paletteId selects a paletteId in the font
// - options.palette supplies a custom palette
//SamsaGlyph.prototype.svg = function (style={}, options={}) {
SamsaGlyph.prototype.svg = function (context={}) {

	const font = this.font;

	//console.log(`SVG-ing glyph ${this.id}, ${this.numPoints} points, ${this.numberOfContours} contours`);
	// TODO: add a comment containin the string and glyphids that this svg represents (maybe use class or id in the <g> ?)
	//let svgString = SVG_PREAMBLE;
	let svgString = "";
	// let extra = (style.class ? ` class="${style.class}"` : "")
	//           + (style.fill ? ` fill="${style.fill}"` : "")
	//           + (style.stroke ? ` stroke="${style.stroke}"` : "")
	//           + (style.strokeWidth ? ` stroke-width="${style.strokeWidth}"` : "");
	let extra = (context.class ? ` class="${context.class}"` : "")
	          + (context.fill ? ` fill="${context.fill}"` : "")
	          + (context.stroke ? ` stroke="${context.stroke}"` : "")
	          + (context.strokeWidth ? ` stroke-width="${context.strokeWidth}"` : "")
			  + (context.transform ? ` transform="${context.transform}"` : "");
	// TODO: check these style things don’t interfere with the COLRv1 styling (or maybe that’s ok)
	// TODO: completely ignore this stuff, as beyond scope of getting svg for a glyph; it should be the <g> (+ optional translate) and nothing else

	// TODO: remove this SVG wrapper so we can return multiple a glyph run in a single SVG
	// - or maybe have a look thru an array of glyphs and offsets calculated from simple metrics or OpenType layout
	svgString += `<g${extra}>\n`;
	svgString += `<!-- glyph ${this.id} -->\n`;
	
	// attempt COLRv1, then COLRv0, then monochrome for this glyph
	svgString += font.COLR ? this.svgGlyphCOLRv1(context) || this.svgGlyphCOLRv0(context) || this.svgGlyphMonochrome() : this.svgGlyphMonochrome(); // this the default auto mode // TODO: offer method to select a specific format
	// - we can provide some results info in the context
	//svgString += this.svgGlyphMonochrome(); // this the default auto mode // TODO: offer method to select a specific format

	svgString += `\n</g>`;
	return svgString; // shall we just leave it like this?
}



// custom processors
/*
function moveto_svg {

}

function moveto_canvas {

}

function lineto_canvas {

}

function quadto_canvas {

}

function cubicto_canvas {

}
*/


const RENDERER_SVG = 1;
const RENDERER_CANVAS = 2;

const R_MOVETO = 1;
const R_LINETO = 2;
const R_QUADTO = 3;
const R_CUBICTO = 4;
const R_ENDPATH = 5;
const R_LAYER = 6;
const R_PAINT = 7;
const R_MAX = 8;

const renderFuncs = [];
renderFuncs[RENDERER_SVG] = [];
renderFuncs[RENDERER_CANVAS] = [];

// renderFuncs[RENDERER_SVG][R_MOVETO] = (ctx, x, y) => {

// });

// renderFuncs.get(RENDERER_SVG)
// const renderFuncs[RENDERER_SVG] = new Map()

// {
// 	R_MOVETO: (ctx, x, y) => {

// 	}

// };


// WOW this is working 2023-06-22 02:25
const CONTEXT_SVG = 1;
const CONTEXT_CANVAS = 2;
const DRAW_FUNCTIONS = [];
DRAW_FUNCTIONS[CONTEXT_SVG] = {
	beginpath: function () {
		; // nothing to do
	},
	moveto: function (x, y) {
		this.path.push(`M${x} ${y}`);
	},
	lineto: function (x, y) {
		this.path.push(`L${x} ${y}`);
	},
	quadto: function (x1, y1, x, y) {
		this.path.push(`Q${x1} ${y1} ${x} ${y}`);
	},
	cubicto: function (x1, y1, x2, y2, x, y) {
		this.path.push(`C${x1} ${y1} ${x2} ${y2} ${x} ${y}`);
	},
	closepath: function () {
		this.path.push(`Z`);
	},
};
// DRAW_FUNCTIONS[CONTEXT_CANVAS] = {
// 	beginpath: function () {
// 		this.path.push(["B"]);
// 	},
// 	moveto: function (x, y) {
// 		this.path.push(["M", x, y]);
// 	},
// 	lineto: function (x, y) {
// 		this.path.push(["L", x, y]);
// 	},
// 	quadto: function (x1, y1, x, y) {
// 		this.path.push(["Q", x1, y1, x, y]);
// 		;
// 	},
// 	cubicto: function (x1, y1, x2, y2, x, y) {
// 		this.path.push(["C", x1, y1, x2, y2, x, y]);
// 	},
// 	closepath: function () {
// 		this.path.push(["F"]);
// 	},		
// };

DRAW_FUNCTIONS[CONTEXT_CANVAS] = {
	beginpath: function () {
		this.path.push(["B"]);
	},
	moveto: function (x, y) {
		this.path.push([x, y, "M"]);
	},
	lineto: function (x, y) {
		this.path.push([x, y, "L"]);
	},
	quadto: function (x1, y1, x, y) {
		this.path.push([x1, y1, x, y, "Q"]);
		;
	},
	cubicto: function (x1, y1, x2, y2, x, y) {
		this.path.push([x1, y1, x2, y2, x, y, "C"]);
	},
	closepath: function () {
		this.path.push(["F"]);
	},		
};


/*
const moveTo = [];

// SVG rendering functions
moveTo[RENDERER_SVG] = (ctx, x, y) => {
	return `M${x} ${y}`;
}
lineTo[RENDERER_SVG] = (ctx, x, y) => {
	return `L${x} ${y}`;
}
quadTo[RENDERER_SVG] = (ctx, x1, y1, x, y) => {
	return `Q${x1} ${y1} ${x} ${y}`;
}
cubicTo[RENDERER_SVG] = (ctx, x1, y1, x2, y2, x, y) => {
	return `C${x1} ${y1} ${x2} ${y2} ${x} ${y}`;
}
endPath[RENDERER_SVG] = (ctx) => {
	return `Z`;
}
paint[RENDERER_SVG] = (ctx, paint) => {
	return `COLRv1 a whole stack of stuff`;
}
layer[RENDERER_SVG] = (ctx, glyph, color) => {
	return `COLRv0 layer`;
}
palette[RENDERER_SVG] = (ctx, palette) => {
	return `CPAL palette`;
}

// canvas rendering functions
moveTo[RENDERER_CANVAS] = (ctx, x, y) => {
	return `m x y`;
}
lineTo[RENDERER_CANVAS] = (ctx, x, y) => {
	return `l x y`;
}
*/

/*
function SamsaContext (name) {
	this.name = name;
	switch (this.name) {

		case "svg":
			this.type = RENDERER_SVG;
			break;
	
		case "canvas":
			this.type = RENDERER_CANVAS;
			break;
	
		default:
			break;
	}

}
*/

/*
const RENDERERS = {
	svg: {
		moveto: moveto_canvas,
		lineto: moveto_canvas,
		quadto: quadto_canvas,
		cubicto: cubicto_canvas,
		endpath: endpath_canvas,
	}
}
*/


// - works in browser and node



/*


QUESTIONS

The child possibilities for a PaintGlyph seem problematic, see Filling Shapes https://learn.microsoft.com/en-us/typography/opentype/spec/colr#filling-shapes

So the simple idea is that any of the fill operations can be used, solid and gradient.

Finally there’s the statement:
"The child of a PaintGlyph table is not, however, limited to one of the basic fill formats. Rather, the child can be the 
root of a sub-graph that describes some graphic composition that is used as a fill. Another way to describe the relationship 
between a PaintGlyph table and its child sub-graph is that the glyph outline specified by the PaintGlyph table defines a 
bounds, or clip region, that is applied to the fill composition defined by the child sub-graph."

So the main idea this seems to support is to generate a clip region, being the intersection of all the shapes of a sequence of PaintGlyphs.

Ok so far, and doable using <defs> and <clipPath> in SVG.

But then there’s this:
"Note: Shapes can also be derived using PaintGlyph tables in combination with other tables, such as PaintTransform 
(see Transformations) or PaintComposite (see Compositing and blending)."

The problem is the wording "in combination with". It’s possible that this means those Paint tables may have been used only as *parents* of this 
PaintGlyph table. If so, that keeps things under control, but it is not clear. The phrase could include the possibility of PaintTransform and 
PaintComposite as children of PaintGlyph. PaintTransform is not a big problem: we’d need to transform the shape and presumably also any gradient 
fill. However, if we allow PaintComposite children, it interferes with PaintComposite’s ability to compose onto the canvas, since it would be used 
as a clip region instead.

For now, let’s assume a sequence of PaintGlyphs followed by a fill only. No PaintTransforms, no PaintComposites after a PaintGlyph.

# Spec suggestions

## cmap
* Clarify that multiple character mappings are not intended to be active at the same time. For example, it is not permisslble to set up a 
font to use some mappings via Format 4, then fallback to Format 13 for "last resort" glyphs. Similarly, Format 12 tables  must be complete,
and must not rely on Format 4 as fallback.

## vmtx
* Show the vMetrics field explicitly.

## COLRv1
* List the possibilities for a Paint path as a language-like tree, or maybe a kind of regex.

## gvar
* Make clear the sharedTuple array is all about peak tuples, with inferred start and end being -1, 0 and 1 as approptiate.
* Also note that the scalars derived from the sharedTuples may be calculated just once per instance.
* These two statements conflict "Note that intermediateRegion flag is independent of the embeddedPeakTuple flag..." "An intermediate-region
 tuple variation table additionally has start and end n-tuples ... these are always represented using embedded tuple records." The truth is if  
 INTERMEDIATE_REGION is set, then EMBEDDED_PEAK_TUPLE must also be set. We have a problem in that if we have an embedded peak tuple that is NOT
 an intermediate region, the setting of start and end is not defined. We assume it’s 



*/

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/code.ts ***!
  \*********************/

//import { createRectangles } from "./rectangle-module";
//import { SamsaFont, SamsaGlyph, SamsaInstance, SamsaBuffer, SAMSAGLOBAL } from "./samsa-core";
//import { SamsaFont, SamsaGlyph, SamsaInstance, SamsaBuffer, SAMSAGLOBAL } from "samsa-core";
// const samsa = require ("samsa-core");
// const SamsaBuffer = samsa.SamsaBuffer;
// const SamsaFont = samsa.SamsaFont;
// const SamsaGlyph = samsa.SamsaGlyph;
// const SamsaInstance = samsa.SamsaInstance;
// const SAMSAGLOBAL = samsa.SAMSAGLOBAL
const { SamsaFont, SamsaGlyph, SamsaInstance, SamsaBuffer, SAMSAGLOBAL } = __webpack_require__(/*! samsa-core */ "./node_modules/samsa-core/index.js");
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
const GLOBAL = {
    figmaNode: null,
};
// This shows the HTML page in "ui.html".
const options = {
    width: 300,
    height: 500,
    title: "COLRv1 fonts",
};
figma.showUI(__html__, options);
const sceneNodes = []; // these are used in the "zoom to fit" step // TODO: if the UI is persistent, we need to reconsider how we zoom to fit each time
let font = {}; // skip type checking
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    var _a;
    switch (msg.type) {
        case 'create-rectangles': {
            const nodes = [];
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
            const temp = msg !== null && msg !== void 0 ? msg : 0;
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
                    font.fvar.axes.forEach((axis) => {
                        axis.name = font.names[axis.axisNameID];
                    });
                }
                if (font.CPAL) {
                    font.CPAL.hexColors = {}; // must use an object here... (sparse arrays in JSON are HUGE!)
                    font.CPAL.palettes.forEach((palette) => {
                        palette.colors.forEach((color) => {
                            font.CPAL.hexColors[color] = font.hexColorFromU32(color);
                        });
                    });
                }
                // signal to the UI that we’ve got the font, by sending its names, fvar, CPAL
                figma.ui.postMessage({ type: "names", fvar: font.names });
                figma.ui.postMessage({ type: "fvar", fvar: font.fvar });
                figma.ui.postMessage({ type: "CPAL", CPAL: font.CPAL });
            });
        }
        case "render": {
            // get svg from text, font, size, axisSettings, palette
            // console.log ("RENDER");
            // console.log (msg);
            const tuple = font.tupleFromFvs(msg.options.fvs);
            const instance = new SamsaInstance(font, tuple);
            if (!msg.options.text)
                msg.options.text = "hello";
            const layout = instance.glyphLayoutFromString(msg.options.text);
            const fontSize = msg.options.fontSize;
            const upem = font.head.unitsPerEm;
            const colorU32 = 0x000000ff;
            const context = {
                font: font,
                instance: instance,
                paths: {},
                gradients: {},
                color: colorU32,
                paletteId: (_a = msg.options.paletteId) !== null && _a !== void 0 ? _a : 0,
            };
            // set the text as SVG
            let innerSVGComposition = "";
            layout.forEach((layoutItem) => {
                const glyph = font.glyphs[layoutItem.id];
                const iglyph = glyph.instantiate(instance);
                let thisSVG = iglyph.svg(context); // gets the best possible COLR glyph, with monochrome fallback
                thisSVG = `<g transform="translate(${layoutItem.ax} 0)" fill="${font.hexColorFromU32(colorU32)}">` + thisSVG + "</g>";
                innerSVGComposition += thisSVG;
            });
            const defs = Object.values(context.paths).join("") + Object.values(context.gradients).join("");
            const svgPreamble = `<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="2000" viewBox="0 0 2000 2000">`;
            const svgPostamble = `</svg>`;
            const scale = fontSize / upem;
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
                const paletteId = parseInt(msg.paletteId);
                const entryId = parseInt(msg.entryId);
                const palette = font.CPAL.palettes[paletteId];
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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQWdHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FuRjtBQUNiO0FBQ0E7OztBQUdBOztBQUVBOztBQUVBOztBQUVBLDJCQUEyQjtBQUMzQixxQ0FBcUM7O0FBRXJDO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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O0FBQ25FO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0Isb0JBQW9CLDBDQUEwQzs7O0FBR2xGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZSw4QkFBOEIsT0FBTztBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCxzQkFBc0I7O0FBRXRCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFlBQVk7QUFDOUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixZQUFZO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCO0FBQ3JCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7O0FBRUEscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQixTQUFTO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBa0IsU0FBUztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsVUFBVTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLFVBQVU7QUFDMUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixVQUFVO0FBQzFCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0IsY0FBYztBQUM5QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7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REFBcUQsZUFBZSxZQUFZLCtCQUErQjtBQUMvRztBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRCxPQUFPLEVBQUUsT0FBTyxnQkFBZ0IsTUFBTTtBQUMzRjtBQUNBO0FBQ0EsNkRBQTZELEtBQUssOEVBQThFO0FBQ2hKO0FBQ0E7QUFDQSwyREFBMkQ7QUFDM0Q7QUFDQSx1REFBdUQ7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJEQUEyRDs7QUFFM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBdUQ7QUFDdkQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0NBQWtDLDZCQUE2QjtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRCxXQUFXLFFBQVEsU0FBUyxLQUFLLFdBQVcsS0FBSyxNQUFNO0FBQzVHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmlnbWEtY29scnYxLy4vbm9kZV9tb2R1bGVzL3NhbXNhLWNvcmUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZmlnbWEtY29scnYxLy4vbm9kZV9tb2R1bGVzL3NhbXNhLWNvcmUvc3JjL3NhbXNhLWNvcmUuanMiLCJ3ZWJwYWNrOi8vZmlnbWEtY29scnYxL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2ZpZ21hLWNvbHJ2MS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZmlnbWEtY29scnYxL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZmlnbWEtY29scnYxL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZmlnbWEtY29scnYxLy4vc3JjL2NvZGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IHtTYW1zYUZvbnQsIFNhbXNhR2x5cGgsIFNhbXNhSW5zdGFuY2UsIFNhbXNhQnVmZmVyLCBTQU1TQUdMT0JBTH0gZnJvbSBcIi4vc3JjL3NhbXNhLWNvcmVcIjtcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gc2Ftc2EtY29yZS5qc1xuLy8gVmVyc2lvbiAyLjAgYWxwaGFcblxuXG4vLyBtaW5pZnkgdXNpbmcgdWdsaWZ5anM6IH4vbm9kZV9tb2R1bGVzL3VnbGlmeS1qcy9iaW4vdWdsaWZ5anMgc2Ftc2EtY29yZS5qcyA+IHNhbXNhLWNvcmUubWluLmpzXG5cbi8qXG5cbkEgbm90ZSBvbiB2YXJpYWJsZSBuYW1pbmcuIFlvdSBtYXkgc2VlIGEgZmV3IG9mIHRoZXNlOlxuXG5jb25zdCBfcnVuQ291bnQgPSBidWYudTE2OyAvLyBnZXQgdGhlIGRhdGEgZnJvbSB0aGUgYnVmZmVyXG5jb25zdCBydW5Db3VudCA9IF9ydW5Db3VudCAmIDB4N0ZGRjsgLy8gcmVmaW5lIHRoZSBkYXRhIGludG8gYSB1c2VhYmxlIHZhcmlhYmxlXG5cblRoZSB1bmRlcnNjb3JlIHByZWZpeCBpcyBpbnRlbmRlZCB0byBtZWFuIHRoZSBpbml0aWFsIHZlcnNpb24gb2YgdGhlIHZhcmlhYmxlIChfcnVuQ291bnQpIHRoYXQgbmVlZHMgdG8gYmUgcmVmaW5lZCBpbnRvIGEgdXNlYWJsZSB2YXJpYWJsZSAocnVuQ291bnQpLiBUaGlzIHdheSB3ZSBjYW4gXG5hY2N1cmF0ZWx5IHJlZmxlY3QgZmllbGRzIGRlc2NyaWJlZCBpbiB0aGUgc3BlYywgZGVyaXZlIHNvbWUgZGF0YSBmcm9tIGZsYWdzLCB0aGVuIHVzZSB0aGVtIHVuZGVyIHNpbWlsYXIgbmFtZSBmb3IgdGhlIHB1cnBvc2UgZGVjcmliZWQgYnkgdGhlIG5hbWUuXG5cbjIwMjMtMDctMjc6IEFsbCBvY2N1cnJlbmNlcyBvZiBcIj8/XCIgbnVsbGlzaCBjb2FsZXNjaW5nIG9wZXJhdG9yIGhhdmUgYmVlbiByZXBsYWNlZCAoYXMgKWl04oCZcyBub3Qgc3VwcG9ydGVkIGJ5IHNvbWV0aGluZyBpbiB0aGUgRmlnbWEgcGx1Z2luIGJ1aWxkIHByb2Nlc3MpLiBUaGUgPz8gbGluZXMgcmVtYWluIGFzIGNvbW1lbnRzIGFib3ZlIHRoZWlyIHJlcGxhY2VtZW50cy5cblxuKi9cblxuLy8gZXhwb3NlIHRoZXNlIHRvIHRoZSBjbGllbnRcbmNvbnN0IFNBTVNBR0xPQkFMID0ge1xuXHR2ZXJzaW9uOiBcIjIuMC4wXCIsXG5cdGJyb3dzZXI6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIsXG5cdGVuZGlhbm5lc3M6IGVuZGlhbm5lc3MoKSxcblx0bGl0dGxlZW5kaWFuOiBlbmRpYW5uZXNzKFwiTEVcIiksXG5cdGJpZ2VuZGlhbjogZW5kaWFubmVzcyhcIkJFXCIpLFxuXHRzdGRHbHlwaE5hbWVzOiBbXCIubm90ZGVmXCIsXCIubnVsbFwiLFwibm9ubWFya2luZ3JldHVyblwiLFwic3BhY2VcIixcImV4Y2xhbVwiLFwicXVvdGVkYmxcIixcIm51bWJlcnNpZ25cIixcImRvbGxhclwiLFwicGVyY2VudFwiLFwiYW1wZXJzYW5kXCIsXCJxdW90ZXNpbmdsZVwiLFwicGFyZW5sZWZ0XCIsXCJwYXJlbnJpZ2h0XCIsXCJhc3Rlcmlza1wiLFwicGx1c1wiLFwiY29tbWFcIixcImh5cGhlblwiLFwicGVyaW9kXCIsXCJzbGFzaFwiLFwiemVyb1wiLFwib25lXCIsXCJ0d29cIixcInRocmVlXCIsXCJmb3VyXCIsXCJmaXZlXCIsXCJzaXhcIixcInNldmVuXCIsXCJlaWdodFwiLFwibmluZVwiLFwiY29sb25cIixcInNlbWljb2xvblwiLFwibGVzc1wiLFwiZXF1YWxcIixcImdyZWF0ZXJcIixcInF1ZXN0aW9uXCIsXCJhdFwiLFwiQVwiLFwiQlwiLFwiQ1wiLFwiRFwiLFwiRVwiLFwiRlwiLFwiR1wiLFwiSFwiLFwiSVwiLFwiSlwiLFwiS1wiLFwiTFwiLFwiTVwiLFwiTlwiLFwiT1wiLFwiUFwiLFwiUVwiLFwiUlwiLFwiU1wiLFwiVFwiLFwiVVwiLFwiVlwiLFwiV1wiLFwiWFwiLFwiWVwiLFwiWlwiLFwiYnJhY2tldGxlZnRcIixcImJhY2tzbGFzaFwiLFwiYnJhY2tldHJpZ2h0XCIsXCJhc2NpaWNpcmN1bVwiLFwidW5kZXJzY29yZVwiLFwiZ3JhdmVcIixcImFcIixcImJcIixcImNcIixcImRcIixcImVcIixcImZcIixcImdcIixcImhcIixcImlcIixcImpcIixcImtcIixcImxcIixcIm1cIixcIm5cIixcIm9cIixcInBcIixcInFcIixcInJcIixcInNcIixcInRcIixcInVcIixcInZcIixcIndcIixcInhcIixcInlcIixcInpcIixcImJyYWNlbGVmdFwiLFwiYmFyXCIsXCJicmFjZXJpZ2h0XCIsXCJhc2NpaXRpbGRlXCIsXCJBZGllcmVzaXNcIixcIkFyaW5nXCIsXCJDY2VkaWxsYVwiLFwiRWFjdXRlXCIsXCJOdGlsZGVcIixcIk9kaWVyZXNpc1wiLFwiVWRpZXJlc2lzXCIsXCJhYWN1dGVcIixcImFncmF2ZVwiLFwiYWNpcmN1bWZsZXhcIixcImFkaWVyZXNpc1wiLFwiYXRpbGRlXCIsXCJhcmluZ1wiLFwiY2NlZGlsbGFcIixcImVhY3V0ZVwiLFwiZWdyYXZlXCIsXCJlY2lyY3VtZmxleFwiLFwiZWRpZXJlc2lzXCIsXCJpYWN1dGVcIixcImlncmF2ZVwiLFwiaWNpcmN1bWZsZXhcIixcImlkaWVyZXNpc1wiLFwibnRpbGRlXCIsXCJvYWN1dGVcIixcIm9ncmF2ZVwiLFwib2NpcmN1bWZsZXhcIixcIm9kaWVyZXNpc1wiLFwib3RpbGRlXCIsXCJ1YWN1dGVcIixcInVncmF2ZVwiLFwidWNpcmN1bWZsZXhcIixcInVkaWVyZXNpc1wiLFwiZGFnZ2VyXCIsXCJkZWdyZWVcIixcImNlbnRcIixcInN0ZXJsaW5nXCIsXCJzZWN0aW9uXCIsXCJidWxsZXRcIixcInBhcmFncmFwaFwiLFwiZ2VybWFuZGJsc1wiLFwicmVnaXN0ZXJlZFwiLFwiY29weXJpZ2h0XCIsXCJ0cmFkZW1hcmtcIixcImFjdXRlXCIsXCJkaWVyZXNpc1wiLFwibm90ZXF1YWxcIixcIkFFXCIsXCJPc2xhc2hcIixcImluZmluaXR5XCIsXCJwbHVzbWludXNcIixcImxlc3NlcXVhbFwiLFwiZ3JlYXRlcmVxdWFsXCIsXCJ5ZW5cIixcIm11XCIsXCJwYXJ0aWFsZGlmZlwiLFwic3VtbWF0aW9uXCIsXCJwcm9kdWN0XCIsXCJwaVwiLFwiaW50ZWdyYWxcIixcIm9yZGZlbWluaW5lXCIsXCJvcmRtYXNjdWxpbmVcIixcIk9tZWdhXCIsXCJhZVwiLFwib3NsYXNoXCIsXCJxdWVzdGlvbmRvd25cIixcImV4Y2xhbWRvd25cIixcImxvZ2ljYWxub3RcIixcInJhZGljYWxcIixcImZsb3JpblwiLFwiYXBwcm94ZXF1YWxcIixcIkRlbHRhXCIsXCJndWlsbGVtb3RsZWZ0XCIsXCJndWlsbGVtb3RyaWdodFwiLFwiZWxsaXBzaXNcIixcIm5vbmJyZWFraW5nc3BhY2VcIixcIkFncmF2ZVwiLFwiQXRpbGRlXCIsXCJPdGlsZGVcIixcIk9FXCIsXCJvZVwiLFwiZW5kYXNoXCIsXCJlbWRhc2hcIixcInF1b3RlZGJsbGVmdFwiLFwicXVvdGVkYmxyaWdodFwiLFwicXVvdGVsZWZ0XCIsXCJxdW90ZXJpZ2h0XCIsXCJkaXZpZGVcIixcImxvemVuZ2VcIixcInlkaWVyZXNpc1wiLFwiWWRpZXJlc2lzXCIsXCJmcmFjdGlvblwiLFwiY3VycmVuY3lcIixcImd1aWxzaW5nbGxlZnRcIixcImd1aWxzaW5nbHJpZ2h0XCIsXCJmaVwiLFwiZmxcIixcImRhZ2dlcmRibFwiLFwicGVyaW9kY2VudGVyZWRcIixcInF1b3Rlc2luZ2xiYXNlXCIsXCJxdW90ZWRibGJhc2VcIixcInBlcnRob3VzYW5kXCIsXCJBY2lyY3VtZmxleFwiLFwiRWNpcmN1bWZsZXhcIixcIkFhY3V0ZVwiLFwiRWRpZXJlc2lzXCIsXCJFZ3JhdmVcIixcIklhY3V0ZVwiLFwiSWNpcmN1bWZsZXhcIixcIklkaWVyZXNpc1wiLFwiSWdyYXZlXCIsXCJPYWN1dGVcIixcIk9jaXJjdW1mbGV4XCIsXCJhcHBsZVwiLFwiT2dyYXZlXCIsXCJVYWN1dGVcIixcIlVjaXJjdW1mbGV4XCIsXCJVZ3JhdmVcIixcImRvdGxlc3NpXCIsXCJjaXJjdW1mbGV4XCIsXCJ0aWxkZVwiLFwibWFjcm9uXCIsXCJicmV2ZVwiLFwiZG90YWNjZW50XCIsXCJyaW5nXCIsXCJjZWRpbGxhXCIsXCJodW5nYXJ1bWxhdXRcIixcIm9nb25la1wiLFwiY2Fyb25cIixcIkxzbGFzaFwiLFwibHNsYXNoXCIsXCJTY2Fyb25cIixcInNjYXJvblwiLFwiWmNhcm9uXCIsXCJ6Y2Fyb25cIixcImJyb2tlbmJhclwiLFwiRXRoXCIsXCJldGhcIixcIllhY3V0ZVwiLFwieWFjdXRlXCIsXCJUaG9yblwiLFwidGhvcm5cIixcIm1pbnVzXCIsXCJtdWx0aXBseVwiLFwib25lc3VwZXJpb3JcIixcInR3b3N1cGVyaW9yXCIsXCJ0aHJlZXN1cGVyaW9yXCIsXCJvbmVoYWxmXCIsXCJvbmVxdWFydGVyXCIsXCJ0aHJlZXF1YXJ0ZXJzXCIsXCJmcmFuY1wiLFwiR2JyZXZlXCIsXCJnYnJldmVcIixcIklkb3RhY2NlbnRcIixcIlNjZWRpbGxhXCIsXCJzY2VkaWxsYVwiLFwiQ2FjdXRlXCIsXCJjYWN1dGVcIixcIkNjYXJvblwiLFwiY2Nhcm9uXCIsXCJkY3JvYXRcIl0sXG59O1xuXG4vLyBmb3JtYXQgY29kZXNcbmNvbnN0IFU0ID0gMDtcbmNvbnN0IFU4ID0gMTtcbmNvbnN0IEk4ID0gMjtcbmNvbnN0IFUxNiA9IDM7XG5jb25zdCBJMTYgPSA0O1xuY29uc3QgVTI0ID0gNTtcbmNvbnN0IEkyNCA9IDY7XG5jb25zdCBVMzIgPSA3O1xuY29uc3QgSTMyID0gODtcbmNvbnN0IFU2NCA9IDk7XG5jb25zdCBJNjQgPSAxMDtcbmNvbnN0IEYxNjE2ID0gMTE7XG5jb25zdCBGMjE0ID0gMTI7XG5jb25zdCBTVFIgPSAxMztcbmNvbnN0IFRBRyA9IDE0O1xuY29uc3QgQ0hBUiA9IDE1O1xuXG5jb25zdCBGT1JNQVRTID0ge1xuXG5cdGhlYWQ6IHtcblx0XHR2ZXJzaW9uOiBbVTE2LDJdLFxuXHRcdGZvbnRSZXZpc2lvbjogW1UxNiwyXSxcblx0XHRjaGVja1N1bUFkanVzdG1lbnQ6IFUzMixcblx0XHRtYWdpY051bWJlcjogVTMyLFxuXHRcdGZsYWdzOiBVMTYsXG5cdFx0dW5pdHNQZXJFbTogVTE2LFxuXHRcdGNyZWF0ZWQ6IEk2NCxcblx0XHRtb2RpZmllZDogSTY0LFxuXHRcdHhNaW46IEkxNixcblx0XHR5TWluOiBJMTYsXG5cdFx0eE1heDogSTE2LFxuXHRcdHlNYXg6IEkxNixcblx0XHRtYWNTdHlsZTogVTE2LFxuXHRcdGxvd2VzdFJlY1BQRU06IFUxNixcblx0XHRmb250RGlyZWN0aW9uSGludDogSTE2LFxuXHRcdGluZGV4VG9Mb2NGb3JtYXQ6IEkxNixcblx0XHRnbHlwaERhdGFGb3JtYXQ6IEkxNixcblx0fSxcblxuXHRoaGVhOiB7XG5cdFx0dmVyc2lvbjogW1UxNiwyXSxcblx0XHRhc2NlbmRlcjogSTE2LFxuXHRcdGRlc2NlbmRlcjogSTE2LFxuXHRcdGxpbmVHYXA6IEkxNixcblx0XHRhZHZhbmNlV2lkdGhNYXg6IFUxNixcblx0XHRtaW5MZWZ0U2lkZUJlYXJpbmc6IEkxNixcblx0XHRtaW5SaWdodFNpZGVCZWFyaW5nOiBJMTYsXG5cdFx0eE1heEV4dGVudDogSTE2LFxuXHRcdGNhcmV0U2xvcGVSaXNlOiBJMTYsXG5cdFx0Y2FyZXRTbG9wZVJ1bjogSTE2LFxuXHRcdGNhcmV0T2Zmc2V0OiBJMTYsXG5cdFx0cmVzZXJ2ZWQ6IFtJMTYsNF0sXG5cdFx0bWV0cmljRGF0YUZvcm1hdDogSTE2LFxuXHRcdG51bWJlck9mSE1ldHJpY3M6IFUxNixcblx0fSxcblxuXHR2aGVhOiB7XG5cdFx0dmVyc2lvbjogW1UzMl0sXG5cdFx0X0lGXzEwOiBbW1widmVyc2lvblwiLCBcIj09XCIsIDB4MDAwMTAwMDBdLCB7XG5cdFx0XHRhc2NlbnQ6IEkxNixcblx0XHRcdGRlc2NlbnQ6IEkxNixcblx0XHRcdGxpbmVHYXA6IEkxNixcblx0XHR9XSxcblx0XHRfSUZfMTE6IFtbXCJ2ZXJzaW9uXCIsIFwiPT1cIiwgMHgwMDAxMTAwMF0sIHtcblx0XHRcdHZlcnRUeXBvQXNjZW5kZXI6IEkxNixcblx0XHRcdHZlcnRUeXBvRGVzY2VuZGVyOiBJMTYsXG5cdFx0XHR2ZXJ0VHlwb0xpbmVHYXA6IEkxNixcblx0XHR9XSxcblx0XHRhZHZhbmNlSGVpZ2h0TWF4OiBJMTYsXG5cdFx0bWluVG9wOiBJMTYsXG5cdFx0bWluQm90dG9tOiBJMTYsXG5cdFx0eU1heEV4dGVudDogSTE2LFxuXHRcdGNhcmV0U2xvcGVSaXNlOiBJMTYsXG5cdFx0Y2FyZXRTbG9wZVJ1bjogSTE2LFxuXHRcdGNhcmV0T2Zmc2V0OiBJMTYsXG5cdFx0cmVzZXJ2ZWQ6IFtJMTYsNF0sXG5cdFx0bWV0cmljRGF0YUZvcm1hdDogSTE2LFxuXHRcdG51bU9mTG9uZ1Zlck1ldHJpY3M6IFUxNixcblx0fSxcblx0XG5cdG1heHA6IHtcblx0XHR2ZXJzaW9uOiBGMTYxNixcblx0XHRudW1HbHlwaHM6IFUxNixcblx0XHRfSUZfOiBbW1widmVyc2lvblwiLCBcIj49XCIsIDEuMF0sIHtcblx0XHRcdG1heFBvaW50czogVTE2LFxuXHRcdFx0bWF4Q29udG91cnM6IFUxNixcblx0XHRcdG1heENvbXBvc2l0ZVBvaW50czogVTE2LFxuXHRcdFx0bWF4Q29tcG9zaXRlQ29udG91cnM6IFUxNixcblx0XHRcdG1heFpvbmVzOiBVMTYsXG5cdFx0XHRtYXhUd2lsaWdodFBvaW50czogVTE2LFxuXHRcdFx0bWF4U3RvcmFnZTogVTE2LFxuXHRcdFx0bWF4RnVuY3Rpb25EZWZzOiBVMTYsXG5cdFx0XHRtYXhJbnN0cnVjdGlvbkRlZnM6IFUxNixcblx0XHRcdG1heFN0YWNrRWxlbWVudHM6IFUxNixcblx0XHRcdG1heFNpemVPZkluc3RydWN0aW9uczogVTE2LFxuXHRcdFx0bWF4Q29tcG9uZW50RWxlbWVudHM6IFUxNixcblx0XHRcdG1heENvbXBvbmVudERlcHRoOiBVMTYsXG5cdFx0fV0sXG5cdH0sXG5cdFxuXHRwb3N0OiB7XG5cdFx0dmVyc2lvbjogRjE2MTYsXG5cdFx0aXRhbGljQW5nbGU6IEYxNjE2LFxuXHRcdHVuZGVybGluZVBvc2l0aW9uOiBJMTYsXG5cdFx0dW5kZXJsaW5lVGhpY2tuZXNzOiBJMTYsXG5cdFx0aXNGaXhlZFBpdGNoOiBVMzIsXG5cdFx0bWluTWVtVHlwZTQyOiBVMzIsXG5cdFx0bWF4TWVtVHlwZTQyOiBVMzIsXG5cdFx0bWluTWVtVHlwZTE6IFUzMixcblx0XHRtYXhNZW1UeXBlMTogVTMyLFxuXHRcdF9JRl86IFtbXCJ2ZXJzaW9uXCIsIFwiPT1cIiwgMi4wXSwge1xuXHRcdFx0bnVtR2x5cGhzOiBVMTYsXG5cdFx0XHRnbHlwaE5hbWVJbmRleDogW1UxNiwgXCJfQVJHMF9cIl0sXG5cdFx0fV0sXG5cdFx0X0lGXzI6IFtbXCJ2ZXJzaW9uXCIsIFwiPT1cIiwgMi41XSwge1xuXHRcdFx0bnVtR2x5cGhzOiBVMTYsXG5cdFx0XHRvZmZzZXQ6IFtJOCwgXCJudW1HbHlwaHNcIl0sXG5cdFx0fV0sXG5cdH0sXG5cblx0bmFtZToge1xuXHRcdHZlcnNpb246IFUxNixcblx0XHRjb3VudDogVTE2LFxuXHRcdHN0b3JhZ2VPZmZzZXQ6IFUxNixcblx0fSxcblxuXHRjbWFwOiB7XG5cdFx0dmVyc2lvbjogVTE2LFxuXHRcdG51bVRhYmxlczogVTE2LFxuXHR9LFxuXHRcblx0XCJPUy8yXCI6IHtcblx0XHR2ZXJzaW9uOiBVMTYsXG5cdFx0eEF2Z0NoYXJXaWR0aDogVTE2LFxuXHRcdHVzV2VpZ2h0Q2xhc3M6IFUxNixcblx0XHR1c1dpZHRoQ2xhc3M6IFUxNixcblx0XHRmc1R5cGU6IFUxNixcblx0XHR5U3Vic2NyaXB0WFNpemU6IFUxNixcblx0XHR5U3Vic2NyaXB0WVNpemU6IFUxNixcblx0XHR5U3Vic2NyaXB0WE9mZnNldDogVTE2LFxuXHRcdHlTdWJzY3JpcHRZT2Zmc2V0OiBVMTYsXG5cdFx0eVN1cGVyc2NyaXB0WFNpemU6IFUxNixcblx0XHR5U3VwZXJzY3JpcHRZU2l6ZTogVTE2LFxuXHRcdHlTdXBlcnNjcmlwdFhPZmZzZXQ6IFUxNixcblx0XHR5U3VwZXJzY3JpcHRZT2Zmc2V0OiBVMTYsXG5cdFx0eVN0cmlrZW91dFNpemU6IFUxNixcblx0XHR5U3RyaWtlb3V0UG9zaXRpb246IFUxNixcblx0XHRzRmFtaWx5Q2xhc3M6IFUxNixcblx0XHRwYW5vc2U6IFtVOCwxMF0sXG5cdFx0dWxVbmljb2RlUmFuZ2UxOiBVMzIsXG5cdFx0dWxVbmljb2RlUmFuZ2UyOiBVMzIsXG5cdFx0dWxVbmljb2RlUmFuZ2UzOiBVMzIsXG5cdFx0dWxVbmljb2RlUmFuZ2U0OiBVMzIsXG5cdFx0YWNoVmVuZElEOiBUQUcsXG5cdFx0ZnNTZWxlY3Rpb246IFUxNixcblx0XHR1c0ZpcnN0Q2hhckluZGV4OiBVMTYsXG5cdFx0dXNMYXN0Q2hhckluZGV4OiBVMTYsXG5cdFx0c1R5cG9Bc2NlbmRlcjogVTE2LFxuXHRcdHNUeXBvRGVzY2VuZGVyOiBVMTYsXG5cdFx0c1R5cG9MaW5lR2FwOiBVMTYsXG5cdFx0dXNXaW5Bc2NlbnQ6IFUxNixcblx0XHR1c1dpbkRlc2NlbnQ6IFUxNixcblx0XHRfSUZfOiBbW1widmVyc2lvblwiLCBcIj49XCIsIDFdLCB7XG5cdFx0XHR1bENvZGVQYWdlUmFuZ2UxOiBVMzIsXG5cdFx0XHR1bENvZGVQYWdlUmFuZ2UyOiBVMzIsXG5cdFx0fV0sXG5cdFx0X0lGXzI6IFtbXCJ2ZXJzaW9uXCIsIFwiPj1cIiwgMl0sIHtcblx0XHRcdHN4SGVpZ2h0OiBVMTYsXG5cdFx0XHRzQ2FwSGVpZ2h0OiBVMTYsXG5cdFx0XHR1c0RlZmF1bHRDaGFyOiBVMTYsXG5cdFx0XHR1c0JyZWFrQ2hhcjogVTE2LFxuXHRcdFx0dXNNYXhDb250ZXh0OiBVMTYsXG5cdFx0fV0sXG5cdFx0X0lGXzM6IFtbXCJ2ZXJzaW9uXCIsIFwiPj1cIiwgNV0sIHtcblx0XHRcdHVzTG93ZXJPcHRpY2FsUG9pbnRTaXplOiBVMTYsXG5cdFx0XHR1c1VwcGVyT3B0aWNhbFBvaW50U2l6ZTogVTE2LFxuXHRcdH1dLFxuXHR9LFxuXG5cdGZ2YXI6IHtcblx0XHR2ZXJzaW9uOiBbVTE2LDJdLFxuXHRcdGF4ZXNBcnJheU9mZnNldDogVTE2LFxuXHRcdHJlc2VydmVkOiBVMTYsXG5cdFx0YXhpc0NvdW50OiBVMTYsXG5cdFx0YXhpc1NpemU6IFUxNixcblx0XHRpbnN0YW5jZUNvdW50OiBVMTYsXG5cdFx0aW5zdGFuY2VTaXplOiBVMTZcblx0fSxcblxuXHRndmFyOiB7XG5cdFx0dmVyc2lvbjogW1UxNiwyXSxcblx0XHRheGlzQ291bnQ6IFUxNixcblx0XHRzaGFyZWRUdXBsZUNvdW50OiBVMTYsXG5cdFx0c2hhcmVkVHVwbGVzT2Zmc2V0OiBVMzIsXG5cdFx0Z2x5cGhDb3VudDogVTE2LFxuXHRcdGZsYWdzOiBVMTYsXG5cdFx0Z2x5cGhWYXJpYXRpb25EYXRhQXJyYXlPZmZzZXQ6IFUzMixcblx0fSxcblxuXHRhdmFyOiB7XG5cdFx0dmVyc2lvbjogW1UxNiwyXSxcblx0XHRyZXNlcnZlZDogVTE2LFxuXHRcdGF4aXNDb3VudDogVTE2LFxuXHR9LFxuXG5cdENPTFI6IHtcblx0XHR2ZXJzaW9uOiBVMTYsXG5cdFx0bnVtQmFzZUdseXBoUmVjb3JkczogVTE2LFxuXHRcdGJhc2VHbHlwaFJlY29yZHNPZmZzZXQ6IFUzMixcblx0XHRsYXllclJlY29yZHNPZmZzZXQ6IFUzMixcblx0XHRudW1MYXllclJlY29yZHM6IFUxNixcblx0XHRfSUZfOiBbW1widmVyc2lvblwiLCBcIj09XCIsIDFdLCB7XG5cdFx0XHRiYXNlR2x5cGhMaXN0T2Zmc2V0OiBVMzIsXG5cdFx0XHRsYXllckxpc3RPZmZzZXQ6IFUzMixcblx0XHRcdGNsaXBMaXN0T2Zmc2V0OiBVMzIsXG5cdFx0XHR2YXJJbmRleE1hcE9mZnNldDogVTMyLFxuXHRcdFx0aXRlbVZhcmlhdGlvblN0b3JlT2Zmc2V0OiBVMzIsXG5cdFx0fV0sXG5cdH0sXG5cblx0Q1BBTDoge1xuXHRcdHZlcnNpb246IFUxNixcblx0XHRudW1QYWxldHRlRW50cmllczogVTE2LFxuXHRcdG51bVBhbGV0dGVzOiBVMTYsXG5cdFx0bnVtQ29sb3JSZWNvcmRzOiBVMTYsXG5cdFx0Y29sb3JSZWNvcmRzQXJyYXlPZmZzZXQ6IFUzMixcblx0XHRjb2xvclJlY29yZEluZGljZXM6IFtVMTYsXCJudW1QYWxldHRlc1wiXSxcblx0XHRfSUZfOiBbW1widmVyc2lvblwiLCBcIj09XCIsIDFdLCB7XG5cdFx0XHRwYWxldHRlVHlwZXNBcnJheU9mZnNldDogVTMyLFxuXHRcdFx0cGFsZXR0ZUxhYmVsc0FycmF5T2Zmc2V0OiBVMzIsXG5cdFx0XHRwYWxldHRlRW50cnlMYWJlbHNBcnJheU9mZnNldDogVTMyLFxuXHRcdH1dLFxuXHRcdC8vIGNvbG9yUmVjb3Jkc1tVMzIsIFwibnVtQ29sb3JSZWNvcmRzXCIsIFwiQGNvbG9yUmVjb3Jkc0FycmF5T2Zmc2V0XCJdLCAvLyBtYXliZSB0aGlzIGZvcm1hdFxuXHR9LFxuXG5cdFNUQVQ6IHtcblx0XHR2ZXJzaW9uOiBbVTE2LDJdLFxuXHRcdGRlc2lnbkF4aXNTaXplOiBVMTYsXG5cdFx0ZGVzaWduQXhpc0NvdW50OiBVMTYsXG5cdFx0ZGVzaWduQXhlc09mZnNldDogVTMyLFxuXHRcdGF4aXNWYWx1ZUNvdW50OiBVMTYsXG5cdFx0b2Zmc2V0VG9BeGlzVmFsdWVPZmZzZXRzOiBVMzIsXG5cdFx0ZWxpZGVkRmFsbGJhY2tOYW1lSUQ6IFUxNlxuXHR9LFxuXG5cdE1WQVI6IHtcblx0XHR2ZXJzaW9uOiBbVTE2LDJdLFxuXHRcdHJlc2VydmVkOiBVMTYsXG5cdFx0dmFsdWVSZWNvcmRTaXplOiBVMTYsXG5cdFx0dmFsdWVSZWNvcmRDb3VudDogVTE2LFxuXHRcdGl0ZW1WYXJpYXRpb25TdG9yZU9mZnNldDogVTE2LFxuXHR9LFxuXG5cdEhWQVI6IHtcblx0XHR2ZXJzaW9uOiBbVTE2LDJdLFxuXHRcdGl0ZW1WYXJpYXRpb25TdG9yZU9mZnNldDogVTMyLFxuXHRcdGFkdmFuY2VXaWR0aE1hcHBpbmdPZmZzZXQ6IFUzMixcblx0XHRsc2JNYXBwaW5nT2Zmc2V0OiBVMzIsXG5cdFx0cnNiTWFwcGluZ09mZnNldDogVTMyLFxuXHR9LFxuXG5cdFZWQVI6IHtcblx0XHR2ZXJzaW9uOiBbVTE2LDJdLFxuXHRcdGl0ZW1WYXJpYXRpb25TdG9yZU9mZnNldDogVTMyLFxuXHRcdGFkdmFuY2VIZWlnaHRNYXBwaW5nT2Zmc2V0OiBVMzIsXG5cdFx0dHNiTWFwcGluZ09mZnNldDogVTMyLFxuXHRcdGJzYk1hcHBpbmdPZmZzZXQ6IFUzMixcblx0XHR2T3JnTWFwcGluZ09mZnNldDogVTMyLFxuXHR9LFxuXG5cdFRhYmxlRGlyZWN0b3J5OiB7XG5cdFx0c2ZudFZlcnNpb246IFUzMixcblx0XHRudW1UYWJsZXM6IFUxNixcblx0XHRzZWFyY2hSYW5nZTogVTE2LFxuXHRcdGVudHJ5U2VsZWN0b3I6IFUxNixcblx0XHRyYW5nZVNoaWZ0OiBVMTYsXG5cdH0sXG5cblx0VGFibGVSZWNvcmQ6IHtcblx0XHR0YWc6IFRBRyxcblx0XHRjaGVja1N1bTogVTMyLFxuXHRcdG9mZnNldDogVTMyLFxuXHRcdGxlbmd0aDogVTMyLFxuXHR9LFxuXG5cdE5hbWVSZWNvcmQ6IHtcblx0XHRwbGF0Zm9ybUlEOiBVMTYsXG5cdFx0ZW5jb2RpbmdJRDogVTE2LFxuXHRcdGxhbmd1YWdlSUQ6IFUxNixcblx0XHRuYW1lSUQ6IFUxNixcblx0XHRsZW5ndGg6IFUxNixcblx0XHRzdHJpbmdPZmZzZXQ6IFUxNixcblx0fSxcblx0XG5cdEVuY29kaW5nUmVjb3JkOiB7XG5cdFx0cGxhdGZvcm1JRDogVTE2LFxuXHRcdGVuY29kaW5nSUQ6IFUxNixcblx0XHRzdWJ0YWJsZU9mZnNldDogVTMyLFxuXHR9LFxuXG5cdENoYXJhY3Rlck1hcDoge1xuXHRcdGZvcm1hdDogVTE2LFxuXHRcdF9JRl86IFtbXCJmb3JtYXRcIiwgXCI8PVwiLCA2XSwge1xuXHRcdFx0bGVuZ3RoOiBVMTYsXG5cdFx0XHRsYW5ndWFnZTogVTE2LFxuXHRcdH1dLFxuXHRcdF9JRl8xOiBbW1wiZm9ybWF0XCIsIFwiPT1cIiwgOF0sIHtcblx0XHRcdHJlc2VydmVkOiBVMTYsXG5cdFx0XHRsZW5ndGg6IFUzMixcblx0XHRcdGxhbmd1YWdlOiBVMzIsXG5cdFx0fV0sXG5cdFx0X0lGXzI6IFtbXCJmb3JtYXRcIiwgXCI9PVwiLCAxMF0sIHtcblx0XHRcdHJlc2VydmVkOiBVMTYsXG5cdFx0XHRsZW5ndGg6IFUzMixcblx0XHRcdGxhbmd1YWdlOiBVMzIsXG5cdFx0fV0sXG5cdFx0X0lGXzM6IFtbXCJmb3JtYXRcIiwgXCI9PVwiLCAxMl0sIHtcblx0XHRcdHJlc2VydmVkOiBVMTYsXG5cdFx0XHRsZW5ndGg6IFUzMixcblx0XHRcdGxhbmd1YWdlOiBVMzIsXG5cdFx0fV0sXG5cdFx0X0lGXzQ6IFtbXCJmb3JtYXRcIiwgXCI9PVwiLCAxNF0sIHtcblx0XHRcdGxlbmd0aDogVTMyLFxuXHRcdH1dLFxuXHR9LFxuXHRcdFxuXHRHbHlwaEhlYWRlcjoge1xuXHRcdG51bWJlck9mQ29udG91cnM6IEkxNixcblx0XHR4TWluOiBJMTYsXG5cdFx0eU1pbjogSTE2LFxuXHRcdHhNYXg6IEkxNixcblx0XHR5TWF4OiBJMTYsXG5cdH0sXG5cblx0VmFyaWF0aW9uQXhpc1JlY29yZDoge1xuXHRcdGF4aXNUYWc6IFRBRyxcblx0XHRtaW5WYWx1ZTogRjE2MTYsXG5cdFx0ZGVmYXVsdFZhbHVlOiBGMTYxNixcblx0XHRtYXhWYWx1ZTogRjE2MTYsXG5cdFx0ZmxhZ3M6IFUxNixcblx0XHRheGlzTmFtZUlEOiBVMTYsXG5cdH0sXG5cdFxuXHRJbnN0YW5jZVJlY29yZDoge1xuXHRcdHN1YmZhbWlseU5hbWVJRDogVTE2LFxuXHRcdGZsYWdzOiBVMTYsXG5cdFx0Y29vcmRpbmF0ZXM6IFtGMTYxNiwgXCJfQVJHMF9cIl0sXG5cdFx0X0lGXzogW1tcIl9BUkcxX1wiLCBcIj09XCIsIHRydWVdLCB7XG5cdFx0XHRwb3N0U2NyaXB0TmFtZUlEOiBVMTYsXG5cdFx0fV0sXG5cdH0sXG5cblx0QXhpc1JlY29yZDoge1xuXHRcdGF4aXNUYWc6IFRBRyxcblx0XHRheGlzTmFtZUlEOiBVMTYsXG5cdFx0YXhpc09yZGVyaW5nOiBVMTYsXG5cdH0sXG5cblx0QXhpc1ZhbHVlRm9ybWF0OiB7XG5cdFx0Zm9ybWF0OiBVMTYsXG5cdFx0X0lGXzogW1tcImZvcm1hdFwiLCBcIjxcIiwgNF0sIHtcblx0XHRcdGF4aXNJbmRleDogVTE2LFxuXHRcdH1dLFxuXHRcdF9JRl80OiBbW1wiZm9ybWF0XCIsIFwiPT1cIiwgNF0sIHtcblx0XHRcdGF4aXNDb3VudDogVTE2LFxuXHRcdH1dLFxuXHRcdGZsYWdzOiBVMTYsXG5cdFx0dmFsdWVOYW1lSUQ6IFUxNixcblx0XHRfSUZfMTogW1tcImZvcm1hdFwiLCBcIj09XCIsIDFdLCB7XG5cdFx0XHR2YWx1ZTogRjE2MTYsXG5cdFx0fV0sXG5cdFx0X0lGXzI6IFtbXCJmb3JtYXRcIiwgXCI9PVwiLCAyXSwge1xuXHRcdFx0dmFsdWU6IEYxNjE2LFxuXHRcdFx0cmFuZ2VNaW5WYWx1ZTogRjE2MTYsXG5cdFx0XHRyYW5nZU1heFZhbHVlOiBGMTYxNixcblx0XHR9XSxcblx0XHRfSUZfMzogW1tcImZvcm1hdFwiLCBcIj09XCIsIDNdLCB7XG5cdFx0XHR2YWx1ZTogRjE2MTYsXG5cdFx0XHRsaW5rZWRWYWx1ZTogRjE2MTYsXG5cdFx0fV0sXG5cdH0sXG5cblx0SXRlbVZhcmlhdGlvblN0b3JlSGVhZGVyOiB7XG5cdFx0Zm9ybWF0OiBVMTYsXG5cdFx0cmVnaW9uTGlzdE9mZnNldDogVTMyLFxuXHRcdGl0ZW1WYXJpYXRpb25EYXRhQ291bnQ6IFUxNixcblx0XHRpdGVtVmFyaWF0aW9uRGF0YU9mZnNldHM6IFtVMzIsIFwiaXRlbVZhcmlhdGlvbkRhdGFDb3VudFwiXSxcblx0fSxcblxuXHRJdGVtVmFyaWF0aW9uRGF0YToge1xuXHRcdGl0ZW1Db3VudDogVTE2LFxuXHRcdHdvcmREZWx0YUNvdW50OiBVMTYsXG5cdFx0cmVnaW9uSW5kZXhDb3VudDogVTE2LFxuXHRcdHJlZ2lvbkluZGV4ZXM6IFtVMTYsIFwicmVnaW9uSW5kZXhDb3VudFwiXSxcblx0fSxcbn07XG5cbi8vIGd2YXJcbmNvbnN0IEdWQVJfU0hBUkVEX1BPSU5UX05VTUJFUlMgPSAweDgwMDA7XG5jb25zdCBHVkFSX0VNQkVEREVEX1BFQUtfVFVQTEUgPSAweDgwMDA7XG5jb25zdCBHVkFSX0lOVEVSTUVESUFURV9SRUdJT04gPSAweDQwMDA7XG5jb25zdCBHVkFSX1BSSVZBVEVfUE9JTlRfTlVNQkVSUyA9IDB4MjAwMDtcbmNvbnN0IERFTFRBU19BUkVfWkVSTyA9IDB4ODA7XG5jb25zdCBERUxUQVNfQVJFX1dPUkRTID0gMHg0MDtcbmNvbnN0IERFTFRBX1JVTl9DT1VOVF9NQVNLID0gMHgzZjtcblxuLy8gQ09MUnYxIGNvbXBvc2l0ZSBtb2Rlc1xuY29uc3QgQ09NUE9TSVRFX0NMRUFSID0gMDtcbmNvbnN0IENPTVBPU0lURV9TUkMgPSAxO1xuY29uc3QgQ09NUE9TSVRFX0RFU1QgPSAyO1xuY29uc3QgQ09NUE9TSVRFX1NSQ19PVkVSID0gMztcbmNvbnN0IENPTVBPU0lURV9ERVNUX09WRVIgPSA0O1xuY29uc3QgQ09NUE9TSVRFX1NSQ19JTiA9IDU7XG5jb25zdCBDT01QT1NJVEVfREVTVF9JTiA9IDY7XG5jb25zdCBDT01QT1NJVEVfU1JDX09VVCA9IDc7XG5jb25zdCBDT01QT1NJVEVfREVTVF9PVVQgPSA4O1xuY29uc3QgQ09NUE9TSVRFX1NSQ19BVE9QID0gOTtcbmNvbnN0IENPTVBPU0lURV9ERVNUX0FUT1AgPSAxMDtcbmNvbnN0IENPTVBPU0lURV9YT1IgPSAxMTtcbmNvbnN0IENPTVBPU0lURV9QTFVTID0gMTI7XG5jb25zdCBDT01QT1NJVEVfU0NSRUVOID0gMTM7XG5jb25zdCBDT01QT1NJVEVfT1ZFUkxBWSA9IDE0O1xuY29uc3QgQ09NUE9TSVRFX0RBUktFTiA9IDE1O1xuY29uc3QgQ09NUE9TSVRFX0xJR0hURU4gPSAxNjtcbmNvbnN0IENPTVBPU0lURV9DT0xPUl9ET0RHRSA9IDE3O1xuY29uc3QgQ09NUE9TSVRFX0NPTE9SX0JVUk4gPSAxODtcbmNvbnN0IENPTVBPU0lURV9IQVJEX0xJR0hUID0gMTk7XG5jb25zdCBDT01QT1NJVEVfU09GVF9MSUdIVCA9IDIwO1xuY29uc3QgQ09NUE9TSVRFX0RJRkZFUkVOQ0UgPSAyMTtcbmNvbnN0IENPTVBPU0lURV9FWENMVVNJT04gPSAyMjtcbmNvbnN0IENPTVBPU0lURV9NVUxUSVBMWSA9IDIzO1xuY29uc3QgQ09NUE9TSVRFX0hTTF9IVUUgPSAyNDtcbmNvbnN0IENPTVBPU0lURV9IU0xfU0FUVVJBVElPTiA9IDI1O1xuY29uc3QgQ09NUE9TSVRFX0hTTF9DT0xPUiA9IDI2O1xuY29uc3QgQ09NUE9TSVRFX0hTTF9MVU1JTk9TSVRZID0gMjc7XG5cbi8vIENPTFJ2MSBwYWludCB0eXBlcyAobXVsdGlwbGUgZm9ybWF0cyBoYXZlIHRoZSBzYW1lIHR5cGUpXG5jb25zdCBQQUlOVF9MQVlFUlMgPSAxO1xuY29uc3QgUEFJTlRfU0hBUEUgPSAyO1xuY29uc3QgUEFJTlRfVFJBTlNGT1JNID0gMztcbmNvbnN0IFBBSU5UX0NPTVBPU0UgPSA0O1xuXG4vLyB0aGVyZSBhcmUgNCB0eXBlcyBvZiBwYWludCB0YWJsZXM6IFBBSU5UX0xBWUVSUywgUEFJTlRfVFJBTlNGT1JNLCBQQUlOVF9TSEFQRSwgUEFJTlRfQ09NUE9TRVxuLy8gYWxsIERBRyBsZWF2ZXMgYXJlIFBBSU5UX0NPTVBPU0VcbmNvbnN0IFBBSU5UX1RZUEVTID0gW1xuXHQwLFxuXHRQQUlOVF9MQVlFUlMsXG5cdFBBSU5UX0NPTVBPU0UsXG5cdFBBSU5UX0NPTVBPU0UsXG5cdFBBSU5UX0NPTVBPU0UsXG5cdFBBSU5UX0NPTVBPU0UsXG5cdFBBSU5UX0NPTVBPU0UsXG5cdFBBSU5UX0NPTVBPU0UsXG5cdFBBSU5UX0NPTVBPU0UsXG5cdFBBSU5UX0NPTVBPU0UsXG5cdFBBSU5UX1NIQVBFLFxuXHRQQUlOVF9MQVlFUlMsXG5cdFBBSU5UX1RSQU5TRk9STSxcblx0UEFJTlRfVFJBTlNGT1JNLFxuXHRQQUlOVF9UUkFOU0ZPUk0sXG5cdFBBSU5UX1RSQU5TRk9STSxcblx0UEFJTlRfVFJBTlNGT1JNLFxuXHRQQUlOVF9UUkFOU0ZPUk0sXG5cdFBBSU5UX1RSQU5TRk9STSxcblx0UEFJTlRfVFJBTlNGT1JNLFxuXHRQQUlOVF9UUkFOU0ZPUk0sXG5cdFBBSU5UX1RSQU5TRk9STSxcblx0UEFJTlRfVFJBTlNGT1JNLFxuXHRQQUlOVF9UUkFOU0ZPUk0sXG5cdFBBSU5UX1RSQU5TRk9STSxcblx0UEFJTlRfVFJBTlNGT1JNLFxuXHRQQUlOVF9UUkFOU0ZPUk0sXG5cdFBBSU5UX1RSQU5TRk9STSxcblx0UEFJTlRfVFJBTlNGT1JNLFxuXHRQQUlOVF9UUkFOU0ZPUk0sXG5cdFBBSU5UX1RSQU5TRk9STSxcblx0UEFJTlRfVFJBTlNGT1JNLFxuXHRQQUlOVF9DT01QT1NFLFxuXTtcblxuY29uc3QgUEFJTlRfVkFSX09QRVJBTkRTID0gWzAsMCwxLDEsNiw2LDYsNiw0LDQsMCwwLDYsNiwyLDIsMiwyLDQsNCwxLDEsMywzLDEsMSwzLDMsMiwyLDQsNCwwXTsgLy8gdGhlIG51bWJlciBvZiB2YXJpYWJsZSBvcGVyYW5kcyB0aGF0IGVhY2ggcGFpbnQgaGFzLCBpbmRleGVkIGJ5IHBhaW50LmZvcm1hdCAocHJlcGVuZGVkIHdpdGggYSByZWNvcmQgZm9yIGludmFsaWQgcGFpbnQuZm9ybWF0IDApIHRodXMgMzMgaXRlbXMgZnJvbSAwIHRvIDMyXG5cbi8vIENPTFJ2MSBncmFkaWVudCBleHRlbmQgbW9kZXNcbmNvbnN0IEVYVEVORF9QQUQgPSAwO1xuY29uc3QgRVhURU5EX1JFUEVBVCA9IDE7XG5jb25zdCBFWFRFTkRfUkVGTEVDVCA9IDI7XG5cblxuLy8gdGFibGUgZGVjb2RlcnMgYXJlIGNhbGxlZCAqYWZ0ZXIqIHRoZSBmaXJzdCBwYXJ0IGhhcyBiZWVuIGRlY29kZWQgdXNpbmcgdGhlIEZPUk1BVFNbPHRhYmxlVGFnPl0gZGVmaW5pdGlvblxuLy8gLSBmb250IGlzIHRoZSBTYW1zYUZvbnQgb2JqZWN0XG4vLyAtIGJ1ZiBpcyBhIFNhbXNhQnVmZmVyIG9iamVjdCBhbHJlYWR5IHNldCB1cCB0byBjb3ZlciB0aGUgdGFibGUgZGF0YSBvbmx5LCBpbml0aWFsaXplZCB3aXRoIHRoZSB0YWJsZSdzIG9mZnNldCBiZWluZyBwPTAgYW5kIGxlbmd0aCA9IGl0cyBsZW5ndGhcbi8vIC0gcmV0dXJuIChub25lKSwgYnV0IGZvbnQuPHRhYmxlVGFnPiBub3cgY29udGFpbnMgbW9yZSAocG9zc2libHkgYWxsKSBvZiB0aGUgZGVjb2RlZCB0YWJsZSBkYXRhXG5jb25zdCBUQUJMRV9ERUNPREVSUyA9IHtcblxuXHRcImF2YXJcIjogKGZvbnQsIGJ1ZikgPT4ge1xuXHRcdC8vIGF2YXIxIGFuZCBhdmFyMlxuXHRcdC8vIGh0dHBzOi8vbGVhcm4ubWljcm9zb2Z0LmNvbS9lbi11cy90eXBvZ3JhcGh5L29wZW50eXBlL3NwZWMvYXZhclxuXHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9oYXJmYnV6ei9ib3JpbmctZXhwYW5zaW9uLXNwZWMvYmxvYi9tYWluL2F2YXIyLm1kXG5cdFx0Zm9udC5hdmFyLmF4aXNTZWdtZW50TWFwcyA9IFtdO1xuXHRcdGNvbnNvbGUuYXNzZXJ0KGZvbnQuYXZhci5heGlzQ291bnQgPT09IGZvbnQuZnZhci5heGlzQ291bnQgfHwgZm9udC5hdmFyLmF4aXNDb3VudCA9PT0gMCwgYGZ2YXIuYXhpc0NvdW50ICgke2ZvbnQuZnZhci5heGlzQ291bnR9KSBhbmQgYXZhci5heGlzQ291bnQgKCR7Zm9udC5hdmFyLmF4aXNDb3VudH0pIG11c3QgbWF0Y2gsIG9yIGVsc2UgYXZhci5heGlzQ291bnQgbXVzdCBiZSAwYCk7XG5cdFx0Zm9yIChsZXQgYT0wOyBhPGZvbnQuYXZhci5heGlzQ291bnQ7IGErKykge1xuXHRcdFx0Y29uc3QgcG9zaXRpb25NYXBDb3VudCA9IGJ1Zi51MTY7XG5cdFx0XHRmb250LmF2YXIuYXhpc1NlZ21lbnRNYXBzW2FdID0gW107XG5cdFx0XHRmb3IgKGxldCBwPTA7IHA8cG9zaXRpb25NYXBDb3VudDsgcCsrKSB7XG5cdFx0XHRcdGZvbnQuYXZhci5heGlzU2VnbWVudE1hcHNbYV0ucHVzaChbIGJ1Zi5mMjE0LCBidWYuZjIxNCBdKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBhdmFyMiBvbmx5XG5cdFx0aWYgKGZvbnQuYXZhci52ZXJzaW9uWzBdID09IDIpIHtcblx0XHRcdGZvbnQuYXZhci5heGlzSW5kZXhNYXBPZmZzZXQgPSBidWYudTMyO1xuXHRcdFx0Zm9udC5hdmFyLml0ZW1WYXJpYXRpb25TdG9yZU9mZnNldCA9IGJ1Zi51MzI7IC8vIHdlIHVzZSB0aGlzIGtleSwgcmF0aGVyIHRoYXQgaW4gdGhlIHNwZWMsIHNvIHRoYXQgaXQgd2lsbCBnZXQgcGlja2VkIHVwIGJ5IHRoZSBJdGVtVmFyaWF0aW9uU3RvcmUgZGVjb2RlciBhbG9uZyB3aXRoIHRob3NlIG9mIE1WQVIsIEhWQVIsIGV0Yy5cblx0XHRcdGlmIChmb250LmF2YXIuYXhpc0luZGV4TWFwT2Zmc2V0KSB7XG5cdFx0XHRcdGJ1Zi5zZWVrKGZvbnQuYXZhci5heGlzSW5kZXhNYXBPZmZzZXQpO1xuXHRcdFx0XHRmb250LmF2YXIuYXhpc0luZGV4TWFwID0gYnVmLmRlY29kZUluZGV4TWFwKCk7XG5cdFx0XHR9XG5cdFx0XHQvLyBlbHNlIHdlIG11c3QgdXNlIGltcGxpY2l0IG1hcHBpbmdzIGxhdGVyXHRcdFx0XG5cdFx0fVxuXHR9LFxuXG5cdFwiY21hcFwiOiAoZm9udCwgYnVmKSA9PiB7XG5cdFx0Ly8gaHR0cHM6Ly9sZWFybi5taWNyb3NvZnQuY29tL2VuLXVzL3R5cG9ncmFwaHkvb3BlbnR5cGUvc3BlYy9jbWFwXG5cdFx0Y29uc3QgY21hcCA9IGZvbnQuY21hcDtcblx0XHRjbWFwLmxvb2t1cCA9IFtdOyAvLyB0aGUgbWFpbiBjbWFwIGxvb2t1cCB0YWJsZVxuXHRcdGNtYXAuZW5jb2RpbmdSZWNvcmRzID0gW107XG5cblx0XHQvLyBzdGVwIHRocnUgdGhlIGVuY29kaW5nUmVjb3Jkc1xuXHRcdGNvbnN0IHZhbGlkRW5jb2RpbmdzID0gWyAwICogMHgxMDAwMCArIDMsIDMgKiAweDEwMDAwICsgMSwgMyAqIDB4MTAwMDAgKyAxMCBdOyAvLyB3ZSBlbmNvZGUgWzAsM10sIFszLDFdIGFuZCBbMywxMF0gbGlrZSB0aGlzIGZvciBlYXN5IHNlYXJjaGluZ1xuXHRcdGJ1Zi5zZWVrKDQpO1xuXHRcdGZvciAobGV0IHQ9MDsgdCA8IGNtYXAubnVtVGFibGVzOyB0KyspIHtcblx0XHRcdGNvbnN0IGVuY29kaW5nUmVjb3JkID0gYnVmLmRlY29kZShGT1JNQVRTLkVuY29kaW5nUmVjb3JkKTtcblx0XHRcdGlmICh2YWxpZEVuY29kaW5ncy5pbmNsdWRlcyhlbmNvZGluZ1JlY29yZC5wbGF0Zm9ybUlEICogMHgxMDAwMCArIGVuY29kaW5nUmVjb3JkLmVuY29kaW5nSUQpKSB7XG5cdFx0XHRcdGNtYXAuZW5jb2RpbmdSZWNvcmQgPSBlbmNvZGluZ1JlY29yZDsgLy8gdGhpcyB3aWxsIHByZWZlciB0aGUgbGF0ZXIgb25lcywgc28gWzMsMTBdIGJldHRlciB0aGFuIFszLDFdXG5cdFx0XHR9XG5cdFx0XHRjbWFwLmVuY29kaW5nUmVjb3Jkcy5wdXNoKGVuY29kaW5nUmVjb3JkKTtcblx0XHR9XG5cdFx0XG5cdFx0Ly8gc2VsZWN0IHRoZSBsYXN0IGVuY29kaW5nUmVjb3JkIHdlIGZvdW5kIHRoYXQgd2FzIHZhbGlkIGZvciB1cyBbMywxMF0gaXMgYmV0dGVyIHRoYW4gWzMsMV0gYW5kIFswLDNdXG5cdFx0aWYgKGNtYXAuZW5jb2RpbmdSZWNvcmQpIHtcblxuXHRcdFx0YnVmLnNlZWsoY21hcC5lbmNvZGluZ1JlY29yZC5zdWJ0YWJsZU9mZnNldCk7XG5cdFx0XHRjb25zdCBjaGFyYWN0ZXJNYXAgPSBidWYuZGVjb2RlKEZPUk1BVFMuQ2hhcmFjdGVyTWFwKTtcblxuXHRcdFx0Ly8gcGFyc2UgdGhlIGZvcm1hdCwgdGhlbiBzd2l0Y2ggdG8gZm9ybWF0LXNwZWNpZmljIHBhcnNlclxuXHRcdFx0Ly8gVE9ETzogd2XigJlkIHNhdmUgbWVtb3J5IGJ5IHppcHBpbmcgdGhyb3VnaCB0aGUgYmluYXJ5IGxpdmUuLi5cblx0XHRcdC8vIFRoZXNlIGZvcm1hdHMgYXJlIGRlY29kZWQgcmVhZHkgZm9yIHF1aWNrIGxvb2t1cCBpbiBTYW1zYUZvbnQuZ2x5cGhJZEZyb21Vbmljb2RlKClcblx0XHRcdHN3aXRjaCAoY2hhcmFjdGVyTWFwLmZvcm1hdCkge1xuXG5cdFx0XHRcdGNhc2UgMDoge1xuXHRcdFx0XHRcdGNoYXJhY3Rlck1hcC5tYXBwaW5nID0gW107XG5cdFx0XHRcdFx0Zm9yIChsZXQgYz0wOyBjPDI1NjsgYysrKSB7XG5cdFx0XHRcdFx0XHRjaGFyYWN0ZXJNYXAubWFwcGluZ1tjXSA9IGJ1Zi51ODtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjYXNlIDQ6IHtcblx0XHRcdFx0XHRjb25zdCBzZWdDb3VudCA9IGJ1Zi51MTYgLyAyO1xuXHRcdFx0XHRcdGJ1Zi5zZWVrcig2KTsgLy8gc2tpcCBiaW5hcnkgc2VhcmNoIHBhcmFtc1xuXHRcdFx0XHRcdGNoYXJhY3Rlck1hcC5zZWdtZW50cyA9IFtdO1xuXHRcdFx0XHRcdGZvciAobGV0IHM9MDsgczxzZWdDb3VudDsgcysrKVxuXHRcdFx0XHRcdFx0Y2hhcmFjdGVyTWFwLnNlZ21lbnRzW3NdID0ge2VuZDogYnVmLnUxNn07XG5cdFx0XHRcdFx0YnVmLnNlZWtyKDIpOyAvLyBza2lwIHJlc2VydmVkUGFkXG5cdFx0XHRcdFx0Zm9yIChsZXQgcz0wOyBzPHNlZ0NvdW50OyBzKyspXG5cdFx0XHRcdFx0XHRjaGFyYWN0ZXJNYXAuc2VnbWVudHNbc10uc3RhcnQgPSBidWYudTE2O1xuXHRcdFx0XHRcdGZvciAobGV0IHM9MDsgczxzZWdDb3VudDsgcysrKVxuXHRcdFx0XHRcdFx0Y2hhcmFjdGVyTWFwLnNlZ21lbnRzW3NdLmlkRGVsdGEgPSBidWYudTE2O1xuXHRcdFx0XHRcdGNoYXJhY3Rlck1hcC5pZFJhbmdlT2Zmc2V0T2Zmc2V0ID0gYnVmLnRlbGwoKTtcblx0XHRcdFx0XHRmb3IgKGxldCBzPTA7IHM8c2VnQ291bnQ7IHMrKylcblx0XHRcdFx0XHRcdGNoYXJhY3Rlck1hcC5zZWdtZW50c1tzXS5pZFJhbmdlT2Zmc2V0ID0gYnVmLnUxNjtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNhc2UgMTI6IHtcblx0XHRcdFx0XHRjb25zdCBudW1Hcm91cHMgPSBidWYudTMyO1xuXHRcdFx0XHRcdGNoYXJhY3Rlck1hcC5ncm91cHMgPSBbXTtcblx0XHRcdFx0XHRmb3IgKGxldCBncnA9MDsgZ3JwPG51bUdyb3VwczsgZ3JwKyspIHtcblx0XHRcdFx0XHRcdGNoYXJhY3Rlck1hcC5ncm91cHMucHVzaCh7IHN0YXJ0OiBidWYudTMyLCBlbmQ6IGJ1Zi51MzIsIGdseXBoSWQ6IGJ1Zi51MzIgfSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgV2FybmluZzogTm90IGhhbmRsaW5nIGNtYXAgZm9ybWF0ICR7Y2hhcmFjdGVyTWFwLmZvcm1hdH1gKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGNtYXAuY2hhcmFjdGVyTWFwID0gY2hhcmFjdGVyTWFwO1xuXHRcdH1cblx0fSxcblxuXHRcIkNPTFJcIjogKGZvbnQsIGJ1ZikgPT4ge1xuXHRcdC8vIGh0dHBzOi8vbGVhcm4ubWljcm9zb2Z0LmNvbS9lbi11cy90eXBvZ3JhcGh5L29wZW50eXBlL3NwZWMvY29sclxuXHRcdGNvbnN0IGNvbHIgPSBmb250LkNPTFI7XG5cdFx0aWYgKGNvbHIudmVyc2lvbiA8PSAxKSB7XG5cblx0XHRcdC8vIENPTFJ2MCBvZmZzZXRzIChpdCB3b3VsZCBiZSBvayB0byBsb29rIHRoZXNlIHVwIGxpdmUgd2l0aCBiaW5hcnkgc2VhcmNoKVxuXHRcdFx0Y29sci5iYXNlR2x5cGhSZWNvcmRzID0gW107XG5cdFx0XHRpZiAoY29sci5udW1CYXNlR2x5cGhSZWNvcmRzKSB7XG5cdFx0XHRcdGJ1Zi5zZWVrKGNvbHIuYmFzZUdseXBoUmVjb3Jkc09mZnNldCk7XG5cdFx0XHRcdGZvciAobGV0IGk9MDsgaTxjb2xyLm51bUJhc2VHbHlwaFJlY29yZHM7IGkrKykgIHtcblx0XHRcdFx0XHRjb25zdCBnbHlwaElEID0gYnVmLnUxNjtcblx0XHRcdFx0XHRjb2xyLmJhc2VHbHlwaFJlY29yZHNbZ2x5cGhJRF0gPSBbYnVmLnUxNiwgYnVmLnUxNl07IC8vIGZpcnN0TGF5ZXJJbmRleCwgbnVtTGF5ZXJzXG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKGNvbHIudmVyc2lvbiA9PSAxKSB7XG5cblx0XHRcdFx0Ly8gQ09MUnYxIG9mZnNldHMgKGl0IHdvdWxkIGJlIG9rIHRvIGxvb2sgdGhlc2UgdXAgbGl2ZSB3aXRoIGJpbmFyeSBzZWFyY2gpXG5cdFx0XHRcdGlmIChjb2xyLmJhc2VHbHlwaExpc3RPZmZzZXQpIHtcblx0XHRcdFx0XHRidWYuc2Vlayhjb2xyLmJhc2VHbHlwaExpc3RPZmZzZXQpO1xuXHRcdFx0XHRcdGNvbHIubnVtQmFzZUdseXBoUGFpbnRSZWNvcmRzID0gYnVmLnUzMjtcblx0XHRcdFx0XHRjb2xyLmJhc2VHbHlwaFBhaW50UmVjb3JkcyA9IFtdO1xuXHRcdFx0XHRcdGZvciAobGV0IGk9MDsgaTxjb2xyLm51bUJhc2VHbHlwaFBhaW50UmVjb3JkczsgaSsrKSAge1xuXHRcdFx0XHRcdFx0Y29uc3QgZ2x5cGhJRCA9IGJ1Zi51MTY7XG5cdFx0XHRcdFx0XHRjb2xyLmJhc2VHbHlwaFBhaW50UmVjb3Jkc1tnbHlwaElEXSA9IGNvbHIuYmFzZUdseXBoTGlzdE9mZnNldCArIGJ1Zi51MzI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQ09MUnYxIGxheWVyTGlzdFxuXHRcdFx0XHQvLyAtIGZyb20gdGhlIHNwZWM6IFwiVGhlIExheWVyTGlzdCBpcyBvbmx5IHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCB0aGUgQmFzZUdseXBoTGlzdCBhbmQsIHNwZWNpZmljYWxseSwgd2l0aCBQYWludENvbHJMYXllcnMgdGFibGVzOyBpdCBpcyBub3QgcmVxdWlyZWQgaWYgbm8gY29sb3IgZ2x5cGhzIHVzZSBhIFBhaW50Q29sckxheWVycyB0YWJsZS4gSWYgbm90IHVzZWQsIHNldCBsYXllckxpc3RPZmZzZXQgdG8gTlVMTFwiXG5cdFx0XHRcdGNvbHIubGF5ZXJMaXN0ID0gW107XG5cdFx0XHRcdGlmIChjb2xyLmxheWVyTGlzdE9mZnNldCkge1xuXHRcdFx0XHRcdGJ1Zi5zZWVrKGNvbHIubGF5ZXJMaXN0T2Zmc2V0KTtcblx0XHRcdFx0XHRjb2xyLm51bUxheWVyTGlzdEVudHJpZXMgPSBidWYudTMyO1xuXHRcdFx0XHRcdGZvciAobGV0IGx5cj0wOyBseXIgPCBjb2xyLm51bUxheWVyTGlzdEVudHJpZXM7IGx5cisrKVxuXHRcdFx0XHRcdFx0Y29sci5sYXllckxpc3RbbHlyXSA9IGNvbHIubGF5ZXJMaXN0T2Zmc2V0ICsgYnVmLnUzMjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIENPTFJ2MSB2YXJJbmRleE1hcFxuXHRcdFx0XHRpZiAoY29sci52YXJJbmRleE1hcE9mZnNldCkge1xuXHRcdFx0XHRcdGJ1Zi5zZWVrKGNvbHIudmFySW5kZXhNYXBPZmZzZXQpO1xuXHRcdFx0XHRcdGNvbHIudmFySW5kZXhNYXAgPSBidWYuZGVjb2RlSW5kZXhNYXAoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHRcIkNQQUxcIjogKGZvbnQsIGJ1ZikgPT4ge1xuXHRcdC8vIGxvYWQgQ1BBTCB0YWJsZSBmdWxseVxuXHRcdC8vIGh0dHBzOi8vbGVhcm4ubWljcm9zb2Z0LmNvbS9lbi11cy90eXBvZ3JhcGh5L29wZW50eXBlL3NwZWMvY3BhbFxuXHRcdGNvbnN0IGNwYWwgPSBmb250LkNQQUw7XG5cdFx0Y3BhbC5jb2xvcnMgPSBbXTtcblx0XHRjcGFsLnBhbGV0dGVzID0gW107XG5cdFx0Y3BhbC5wYWxldHRlRW50cnlMYWJlbHMgPSBbXTtcblxuXHRcdC8vIGRlY29kZSBjb2xvclJlY29yZHNcblx0XHRidWYuc2VlayhjcGFsLmNvbG9yUmVjb3Jkc0FycmF5T2Zmc2V0KTtcblx0XHRmb3IgKGxldCBjPTA7IGM8Y3BhbC5udW1Db2xvclJlY29yZHM7IGMrKykge1xuXHRcdFx0Y3BhbC5jb2xvcnNbY10gPSBidWYudTMyOyAvLyBbYmx1ZSwgZ3JlZW4sIHJlZCwgYWxwaGEgYXMgdTMyXVxuXHRcdH1cblxuXHRcdC8vIGRlY29kZSBwYWxldHRlRW50cnlMYWJlbHNcblx0XHRpZiAoY3BhbC5wYWxldHRlRW50cnlMYWJlbHNBcnJheU9mZnNldCkge1xuXHRcdFx0YnVmLnNlZWsoY3BhbC5wYWxldHRlRW50cnlMYWJlbHNBcnJheU9mZnNldCk7XG5cdFx0XHRmb3IgKGxldCBwZWw9MDsgcGVsPGNwYWwubnVtUGFsZXR0ZUVudHJpZXM7IHBlbCsrKSB7XG5cdFx0XHRcdGNvbnN0IG5hbWVJZCA9IGJ1Zi51MTY7XG5cdFx0XHRcdGlmIChuYW1lSWQgIT09IDB4ZmZmZilcblx0XHRcdFx0XHRjcGFsLnBhbGV0dGVFbnRyeUxhYmVsc1twZWxdID0gZm9udC5uYW1lc1tuYW1lSWRdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIGRlY29kZSBwYWxldHRlczogbmFtZSwgdHlwZSwgY29sb3JzXG5cdFx0Zm9yIChsZXQgcGFsPTA7IHBhbDxjcGFsLm51bVBhbGV0dGVzOyBwYWwrKykge1xuXHRcdFx0Y29uc3QgcGFsZXR0ZSA9IHsgbmFtZTogXCJcIiwgdHlwZTogMCwgY29sb3JzOiBbXSB9O1xuXG5cdFx0XHQvLyBuYW1lXG5cdFx0XHRpZiAoY3BhbC5wYWxldHRlTGFiZWxzQXJyYXlPZmZzZXQpIHtcblx0XHRcdFx0YnVmLnNlZWsoY3BhbC5wYWxldHRlTGFiZWxzQXJyYXlPZmZzZXQgKyAyICogcGFsKTtcblx0XHRcdFx0Y29uc3QgbmFtZUlkID0gYnVmLnUxNjtcblx0XHRcdFx0aWYgKG5hbWVJZCAhPT0gMHhmZmZmKSB7XG5cdFx0XHRcdFx0cGFsZXR0ZS5uYW1lID0gZm9udC5uYW1lc1tuYW1lSWRdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIHR5cGVcblx0XHRcdGlmIChjcGFsLnBhbGV0dGVUeXBlc0FycmF5T2Zmc2V0KSB7XG5cdFx0XHRcdGJ1Zi5zZWVrKGNwYWwucGFsZXR0ZVR5cGVzQXJyYXlPZmZzZXQgKyAyICogcGFsKTtcblx0XHRcdFx0cGFsZXR0ZS50eXBlID0gYnVmLnUxNjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gY29sb3JzXG5cdFx0XHRmb3IgKGxldCBlPTA7IGU8Y3BhbC5udW1QYWxldHRlRW50cmllczsgZSsrKSB7XG5cdFx0XHRcdHBhbGV0dGUuY29sb3JzW2VdID0gY3BhbC5jb2xvcnNbY3BhbC5jb2xvclJlY29yZEluZGljZXNbcGFsXSArIGVdO1xuXHRcdFx0fVxuXG5cdFx0XHRjcGFsLnBhbGV0dGVzLnB1c2gocGFsZXR0ZSk7XG5cdFx0fVxuXHR9LFxuXG5cdFwiZnZhclwiOiAoZm9udCwgYnVmKSA9PiB7XG5cdFx0Ly8gbG9hZCBmdmFyIGF4ZXMgYW5kIGluc3RhbmNlc1xuXHRcdC8vIGh0dHBzOi8vbGVhcm4ubWljcm9zb2Z0LmNvbS9lbi11cy90eXBvZ3JhcGh5L29wZW50eXBlL3NwZWMvZnZhclxuXHRcdGNvbnN0IGZ2YXIgPSBmb250LmZ2YXI7XG5cdFx0ZnZhci5heGVzID0gW107XG5cdFx0YnVmLnNlZWsoZnZhci5heGVzQXJyYXlPZmZzZXQpO1xuXHRcdGZvciAobGV0IGE9MDsgYTxmdmFyLmF4aXNDb3VudDsgYSsrKSB7XG5cdFx0XHRmdmFyLmF4ZXMucHVzaChidWYuZGVjb2RlKEZPUk1BVFMuVmFyaWF0aW9uQXhpc1JlY29yZCkpO1xuXHRcdH1cblx0XHRmdmFyLmluc3RhbmNlcyA9IFtdO1xuXHRcdGNvbnN0IGluY2x1ZGVQb3N0U2NyaXB0TmFtZUlEID0gZnZhci5pbnN0YW5jZVNpemUgPT0gZnZhci5heGlzQ291bnQgKiA0ICsgNjsgLy8gaW5zdGFuY2VTaXplIGRldGVybWlucyB3aGV0aGVyIHBvc3RTY3JpcHROYW1lSUQgaXMgaW5jbHVkZWRcblx0XHRmb3IgKGxldCBpPTA7IGk8ZnZhci5pbnN0YW5jZUNvdW50OyBpKyspIHtcblx0XHRcdGNvbnN0IGluc3RhbmNlID0gYnVmLmRlY29kZShGT1JNQVRTLkluc3RhbmNlUmVjb3JkLCBmdmFyLmF4aXNDb3VudCwgaW5jbHVkZVBvc3RTY3JpcHROYW1lSUQpO1xuXHRcdFx0aW5zdGFuY2UubmFtZSA9IGZvbnQubmFtZXNbaW5zdGFuY2Uuc3ViZmFtaWx5TmFtZUlEXTtcblx0XHRcdGZ2YXIuaW5zdGFuY2VzLnB1c2goaW5zdGFuY2UpO1xuXHRcdH1cblx0fSxcblxuXHRcImd2YXJcIjogKGZvbnQsIGJ1ZikgPT4ge1xuXHRcdC8vIGRlY29kZSBndmFy4oCZcyBzaGFyZWRUdXBsZXMgYXJyYXksIHNvIHdlIGNhbiBwcmVjYWxjdWxhdGUgc2NhbGFycyAobGVhdmUgdGhlIHJlc3QgZm9yIEpJVClcblx0XHQvLyBodHRwczovL2xlYXJuLm1pY3Jvc29mdC5jb20vZW4tdXMvdHlwb2dyYXBoeS9vcGVudHlwZS9zcGVjL2d2YXJcblx0XHRjb25zdCBndmFyID0gZm9udC5ndmFyO1xuXHRcdGJ1Zi5zZWVrKGd2YXIuc2hhcmVkVHVwbGVzT2Zmc2V0KTtcblx0XHRndmFyLnNoYXJlZFR1cGxlcyA9IFtdO1xuXHRcdGZvciAobGV0IHQ9MDsgdCA8IGd2YXIuc2hhcmVkVHVwbGVDb3VudDsgdCsrKSB7XG5cdFx0XHRjb25zdCB0dXBsZSA9IFtdO1xuXHRcdFx0Zm9yIChsZXQgYT0wOyBhPGd2YXIuYXhpc0NvdW50OyBhKyspIHtcblx0XHRcdFx0dHVwbGUucHVzaChidWYuZjIxNCk7IC8vIHRoZXNlIGFyZSB0aGUgcGVha3MsIHdlIGhhdmUgdG8gY3JlYXRlIHN0YXJ0IGFuZCBlbmRcblx0XHRcdH1cblx0XHRcdGd2YXIuc2hhcmVkVHVwbGVzLnB1c2godHVwbGUpO1xuXHRcdH1cblxuXHRcdC8vIC8vIFRoaXMgaXMgZ29vZCwgSSB0aGluayEgQnV0IGxldOKAmXMgdHJ5IGl0IG9ubHkgd2hlbiB3ZSBhcmUgaGFwcHkgd2l0aCBvdGhlciBzdHVmZlxuXHRcdC8vIC8vIC0gd2UgY2FuIGFsc28gdXNlIGdldFZhcmlhdGlvblNjYWxhcigpIChzaW5ndWxhcikgb3Igd2h5IG5vdCBnZXRWYXJpYXRpb25TY2FsYXJzKCkgcGx1cmFsLi4uP1xuXHRcdC8vIHRoaXMuZ3Zhci5zaGFyZWRSZWdpb25zID0gW107XG5cdFx0Ly8gYnVmLnNlZWsodGhpcy50YWJsZXNbXCJndmFyXCJdLm9mZnNldCArIHRoaXMuZ3Zhci5zaGFyZWRUdXBsZXNPZmZzZXQpO1xuXHRcdC8vIGZvciAobGV0IHQ9MDsgdCA8IHRoaXMuZ3Zhci5zaGFyZWRUdXBsZUNvdW50OyB0KyspIHtcblx0XHQvLyBcdGNvbnN0IHJlZ2lvbiA9IFtdO1xuXHRcdC8vIFx0Zm9yIChsZXQgYT0wOyBhPHRoaXMuZ3Zhci5heGlzQ291bnQ7IGErKykge1xuXHRcdC8vIFx0XHRjb25zdCBwZWFrID0gYnVmLmYyMTQ7IC8vIG9ubHkgdGhlIHBlYWsgaXMgc3RvcmVkLCB3ZSBjcmVhdGUgc3RhcnQgYW5kIGVuZFxuXHRcdC8vIFx0XHRpZiAocGVhayA8IDApIHtcblx0XHQvLyBcdFx0XHRzdGFydCA9IC0xO1xuXHRcdC8vIFx0XHRcdGVuZCA9IDA7XG5cdFx0Ly8gXHRcdH1cblx0XHQvLyBcdFx0ZWxzZSBpZiAocGVhayA+IDApIHtcblx0XHQvLyBcdFx0XHRzdGFydCA9IDA7XG5cdFx0Ly8gXHRcdFx0ZW5kID0gMTtcblx0XHQvLyBcdFx0fVxuXHRcdC8vIFx0XHRyZWdpb24ucHVzaChbc3RhcnQsIHBlYWssIGVuZF0pO1xuXHRcdC8vIFx0fVxuXHRcdC8vIFx0dGhpcy5ndmFyLnNoYXJlZFJlZ2lvbnMucHVzaChyZWdpb24pO1xuXHRcdC8vIH1cblx0XHQvLyBIbW0sIGl04oCZcyBub3QgdGhhdCBncmVhdCwgYWN0dWFsbHksIHNpbmNlIGl04oCZcyBhbHdheXMgcGVha3Mgb25seSBhdCBleHRyZW1lczsgb24gaW5zdGFudGlhdGlvbiB3ZSBqdXN0IG5lZWQgdG8gY2FsY3VsYXRlIGEgc2NhbGFyIGZvciBlYWNoIHR1cGxlXG5cblx0XHQvLyBnZXQgdHVwbGVPZmZzZXRzIGFycmF5IChUT0RPOiB3ZSBjb3VsZCBnZXQgdGhlc2Ugb2Zmc2V0cyBKSVQpXG5cdFx0YnVmLnNlZWsoMjApO1xuXHRcdGd2YXIudHVwbGVPZmZzZXRzID0gW107XG5cdFx0Zm9yIChsZXQgZz0wOyBnIDw9IGZvbnQubWF4cC5udW1HbHlwaHM7IGcrKykgeyAvLyA8PVxuXHRcdFx0Z3Zhci50dXBsZU9mZnNldHNbZ10gPSBndmFyLmZsYWdzICYgMHgwMSA/IGJ1Zi51MzIgOiBidWYudTE2ICogMjtcblx0XHR9XG5cdH0sXG5cblx0XCJobXR4XCI6IChmb250LCBidWYpID0+IHtcblx0XHQvLyBkZWNvZGUgaG9yaXpvbnRhbCBtZXRyaWNzXG5cdFx0Ly8gaHR0cHM6Ly9sZWFybi5taWNyb3NvZnQuY29tL2VuLXVzL3R5cG9ncmFwaHkvb3BlbnR5cGUvc3BlYy9obXR4XG5cdFx0Y29uc3QgbnVtYmVyT2ZITWV0cmljcyA9IGZvbnQuaGhlYS5udW1iZXJPZkhNZXRyaWNzO1xuXHRcdGNvbnN0IGhtdHggPSBmb250LmhtdHggPSBbXTtcblx0XHRsZXQgZz0wO1xuXHRcdHdoaWxlIChnPG51bWJlck9mSE1ldHJpY3MpIHtcblx0XHRcdGhtdHhbZysrXSA9IGJ1Zi51MTY7XG5cdFx0XHRidWYuc2Vla3IoMik7IC8vIHNraXAgb3ZlciBsc2IsIHdlIG9ubHkgcmVjb3JkIGFkdmFuY2Ugd2lkdGhcblx0XHR9XG5cdFx0d2hpbGUgKGc8Zm9udC5tYXhwLm51bUdseXBocykge1xuXHRcdFx0aG10eFtnKytdID0gaG10eFtudW1iZXJPZkhNZXRyaWNzLTFdO1xuXHRcdH1cblx0fSxcblxuXHRcIkhWQVJcIjogKGZvbnQsIGJ1ZikgPT4ge1xuXHRcdC8vIGh0dHBzOi8vbGVhcm4ubWljcm9zb2Z0LmNvbS9lbi11cy90eXBvZ3JhcGh5L29wZW50eXBlL3NwZWMvaHZhclxuXHRcdGJ1Zi5zZWVrKGZvbnQuSFZBUi5hZHZhbmNlV2lkdGhNYXBwaW5nT2Zmc2V0KTtcblx0XHRmb250LkhWQVIuaW5kZXhNYXAgPSBidWYuZGVjb2RlSW5kZXhNYXAoKTtcblx0fSxcblxuXHRcIk1WQVJcIjogKGZvbnQsIGJ1ZikgPT4ge1xuXHRcdC8vIGRlY29kZSBNVkFSIHZhbHVlIHJlY29yZHNcblx0XHQvLyBodHRwczovL2xlYXJuLm1pY3Jvc29mdC5jb20vZW4tdXMvdHlwb2dyYXBoeS9vcGVudHlwZS9zcGVjL212YXJcblx0XHRmb250Lk1WQVIudmFsdWVSZWNvcmRzID0ge307XG5cdFx0Zm9yIChsZXQgdj0wOyB2PGZvbnQuTVZBUi52YWx1ZVJlY29yZENvdW50OyB2KyspIHtcblx0XHRcdGJ1Zi5zZWVrKDEyICsgdiAqIGZvbnQuTVZBUi52YWx1ZVJlY29yZFNpemUpOyAvLyB3ZSBhcmUgZHV0aWZ1bGx5IHVzaW5nIHZhbHVlUmVjb3JkU2l6ZSB0byBjYWxjdWxhdGUgb2Zmc2V0LCBidXQgaXQgc2hvdWxkIGFsd2F5cyBiZSA4IGJ5dGVzXG5cdFx0XHRmb250Lk1WQVIudmFsdWVSZWNvcmRzW2J1Zi50YWddID0gW2J1Zi51MTYsIGJ1Zi51MTZdOyAvLyBkZWx0YVNldE91dGVySW5kZXgsIGRlbHRhU2V0SW5uZXJJbmRleFxuXHRcdH1cblx0fSxcblxuXHRcIm5hbWVcIjogKGZvbnQsIGJ1ZikgPT4ge1xuXHRcdC8vIGRlY29kZSBuYW1lIHRhYmxlIHN0cmluZ3Ncblx0XHQvLyBodHRwczovL2xlYXJuLm1pY3Jvc29mdC5jb20vZW4tdXMvdHlwb2dyYXBoeS9vcGVudHlwZS9zcGVjL25hbWVcblx0XHRjb25zdCBuYW1lID0gZm9udC5uYW1lOyAvLyBmb250Lm5hbWUgaXMgdGhlIG5hbWUgdGFibGUgaW5mbyBkaXJlY3RseVxuXHRcdGZvbnQubmFtZXMgPSBbXTsgLy8gZm9udC5uYW1lcyBpcyB0aGUgbmFtZXMgcmVhZHkgdG8gdXNlIGFzIFVURjggc3RyaW5ncywgaW5kZXhlZCBieSBuYW1lSUQgaW4gdGhlIGJlc3QgcGxhdGZvcm1JRC9lbmNvbmRpbmdJRC9sYW5ndWFnZUlEIG1hdGNoXG5cdFx0bmFtZS5uYW1lUmVjb3JkcyA9IFtdO1xuXHRcdGZvciAobGV0IHI9MDsgcjxuYW1lLmNvdW50OyByKyspIHtcblx0XHRcdG5hbWUubmFtZVJlY29yZHMucHVzaChidWYuZGVjb2RlKEZPUk1BVFMuTmFtZVJlY29yZCkpO1xuXHRcdH1cblx0XHRuYW1lLm5hbWVSZWNvcmRzLmZvckVhY2gocmVjb3JkID0+IHtcblx0XHRcdGJ1Zi5zZWVrKG5hbWUuc3RvcmFnZU9mZnNldCArIHJlY29yZC5zdHJpbmdPZmZzZXQpO1xuXHRcdFx0cmVjb3JkLnN0cmluZyA9IGJ1Zi5kZWNvZGVOYW1lU3RyaW5nKHJlY29yZC5sZW5ndGgpO1xuXHRcdFx0aWYgKHJlY29yZC5wbGF0Zm9ybUlEID09IDMgJiYgcmVjb3JkLmVuY29kaW5nSUQgPT0gMSAmJiByZWNvcmQubGFuZ3VhZ2VJRCA9PSAweDA0MDkpIHtcblx0XHRcdFx0Zm9udC5uYW1lc1tyZWNvcmQubmFtZUlEXSA9IHJlY29yZC5zdHJpbmc7IC8vIG9ubHkgcmVjb3JkIDMsIDEsIDB4MDQwOSBmb3IgZWFzeSB1c2Vcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHRcInZtdHhcIjogKGZvbnQsIGJ1ZikgPT4ge1xuXHRcdC8vIGRlY29kZSB2ZXJ0aWNhbCBtZXRyaWNzXG5cdFx0Ly8gaHR0cHM6Ly9sZWFybi5taWNyb3NvZnQuY29tL2VuLXVzL3R5cG9ncmFwaHkvb3BlbnR5cGUvc3BlYy92bXR4XG5cdFx0Y29uc3QgbnVtT2ZMb25nVmVyTWV0cmljcyA9IGZvbnQudmhlYS5udW1PZkxvbmdWZXJNZXRyaWNzO1xuXHRcdGNvbnN0IHZtdHggPSBmb250LnZtdHggPSBbXTtcblx0XHRsZXQgZz0wO1xuXHRcdHdoaWxlIChnPG51bU9mTG9uZ1Zlck1ldHJpY3MpIHtcblx0XHRcdHZtdHhbZysrXSA9IGJ1Zi51MTY7XG5cdFx0XHRidWYuc2Vla3IoMik7IC8vIHNraXAgb3ZlciB0c2IsIHdlIG9ubHkgcmVjb3JkIGFkdmFuY2UgaGVpZ2h0XG5cdFx0fVxuXHRcdHdoaWxlIChnPGZvbnQubWF4cC5udW1HbHlwaHMpIHtcblx0XHRcdHZtdHhbZysrXSA9IHZtdHhbbnVtT2ZMb25nVmVyTWV0cmljcy0xXTtcblx0XHR9XG5cdH0sXG59XG5cbmNvbnN0IFNWR19QUkVBTUJMRSA9IGA8c3ZnIHZlcnNpb249XCIxLjFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIxMDAwXCIgaGVpZ2h0PVwiMTAwMFwiPlxcbjxkZWZzPjwvZGVmcz5cXG5gOyAvLyB3ZeKAmWxsIHJlcGxhY2UgPGRlZnM+PC9kZWZzPiBsYXRlciBpZiBuZWNlc3NhcnlcblxuLy8gbm9uLWV4cG9ydGVkIGZ1bmN0aW9uc1xuZnVuY3Rpb24gZW5kaWFubmVzcyAoc3RyKSB7XG5cdGNvbnN0IGJ1ZiA9IG5ldyBBcnJheUJ1ZmZlcigyKTtcblx0Y29uc3QgdGVzdEFycmF5ID0gbmV3IFVpbnQxNkFycmF5KGJ1Zik7XG5cdGNvbnN0IHRlc3REYXRhVmlldyA9IG5ldyBEYXRhVmlldyhidWYpO1xuXHR0ZXN0QXJyYXlbMF0gPSAweDEyMzQ7IC8vIExFIG9yIEJFXG5cdGNvbnN0IHJlc3VsdCA9IHRlc3REYXRhVmlldy5nZXRVaW50MTYoMCk7IC8vIEJFXG5cdGNvbnN0IGVuZGlhbm5lc3MgPSByZXN1bHQgPT0gMHgxMjM0ID8gXCJCRVwiIDogXCJMRVwiO1xuXHRyZXR1cm4gc3RyID09PSB1bmRlZmluZWQgPyBlbmRpYW5uZXNzIDogc3RyID09IGVuZGlhbm5lc3M7XG59XG5cbmZ1bmN0aW9uIGNsYW1wIChudW0sIG1pbiwgbWF4KSB7XG5cdGlmIChudW0gPCBtaW4pXG5cdFx0bnVtID0gbWluO1xuXHRlbHNlIGlmIChudW0gPiBtYXgpXG5cdFx0bnVtID0gbWF4O1xuXHRyZXR1cm4gbnVtO1xufVxuXG5mdW5jdGlvbiBpblJhbmdlIChudW0sIG1pbiwgbWF4KSB7XG5cdHJldHVybiBudW0gPj0gbWluICYmIG51bSA8PSBtYXg7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlVHVwbGUgKHR1cGxlLCBheGlzQ291bnQpIHtcblx0aWYgKCFBcnJheS5pc0FycmF5KHR1cGxlKSlcblx0XHRyZXR1cm4gZmFsc2U7XG5cdGlmICh0dXBsZS5sZW5ndGggIT0gYXhpc0NvdW50KVxuXHRcdHJldHVybiBmYWxzZTtcblx0Zm9yIChsZXQgYT0wOyBhIDwgYXhpc0NvdW50OyBhKyspIHtcblx0XHQgaWYgKHR5cGVvZiB0dXBsZVthXSAhPSBcIm51bWJlclwiIHx8ICFpblJhbmdlKHR1cGxlW2FdLCAtMSwgMSkpXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0cmV0dXJuIHRydWU7XG59XG5cbi8qXG4vLyBwYWludCBhIGZ1bGx5IGRlY29tcG9zZWQgQ09MUnYxIGdseXBoXG5mdW5jdGlvbiBzdmdQYWludCAocGFpbnQpIHtcblxuXHRcblxuXG59XG5cbi8vIG91dHB1dCBhIGRpYWdyYW1tYXRpYyByZXByZXNlbnRhdGlvbiBvZiBhIHBhaW50IHRyZWVcbmZ1bmN0aW9uIGRpYWdyYW1QYWludCAocGFpbnQpIHtcblxufVxuXG5mdW5jdGlvbiBwcm9jZXNzUGFpbnRTVkcgKHBhaW50LCByZW5kZXJpbmcpIHtcblxuXHQvLyByZWN1cnNlIHVudGlsIHdlIGFycml2ZSBhdCBhIFBhaW50U29saWQgb3IgUGFpbnRHcmFkaWVudFxuXHQvLyB0aGVuIGNvbnN0cnVjdCB0aGUgc3ZnXG5cblx0aWYgKHJlbmRlcmluZy5kZXB0aClcblx0XHRyZW5kZXJpbmcuZGVwdGgrKztcblx0ZWxzZVxuXHRcdHJlbmRlcmluZy5kZXB0aCA9IDA7XG5cblx0aWYgKHJlbmRlcmluZy5kZXB0aCA+IDEwMCkge1xuXHRcdGNvbnNvbGUubG9nKFwicmVuZGVyaW5nIGRlcHRoID4xMDBcIik7XG5cdFx0Y29uc29sZS5sb2cocGFpbnQpO1xuXHRcdGNvbnNvbGUubG9nKHJlbmRlcmluZyk7XG5cdFx0Ly9wcm9jZXNzLmV4aXQoKTtcblx0fVxuXG5cdHN3aXRjaCAocGFpbnQudHlwZSkge1xuXG5cdFx0Y2FzZSBQQUlOVF9MQVlFUlM6IHtcblx0XHRcdGZvciAobGV0IGw9MDsgbCA8IGxheWVycy5sZW5ndGg7IGwrKykge1xuXHRcdFx0XHRwcm9jZXNzUGFpbnRTVkcocGFpbnROZXh0LCByZW5kZXJpbmcpO1xuXHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0Y2FzZSBQQUlOVF9HTFlQSDoge1xuXG5cdFx0XHRwcm9jZXNzUGFpbnRTVkcocGFpbnROZXh0LCByZW5kZXJpbmcpO1xuXHRcdH1cblxuXHRcdGNhc2UgUEFJTlRfVFJBTlNGT1JNOiB7XG5cdFx0XHRsZXQgc3RyO1xuXHRcdFx0c3dpdGNoICh0cmFuc2Zvcm0udHlwZSkge1xuXHRcdFx0XHRjYXNlIFwicm90YXRlXCI6IFxuXHRcdFx0XHRcdHN0ciA9IGByb3RhdGUoJHt0cmFuc2Zvcm0uYW5nbGV9ICR7dHJhbnNmb3JtLnh9ICR7dHJhbnNmb3JtLnl9KWA7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRwcm9jZXNzUGFpbnRTVkcocGFpbnROZXh0LCByZW5kZXJpbmcpO1xuXHRcdH1cblxuXHRcdGNhc2UgUEFJTlRfQ09NUE9TSVRFOiB7XG5cdFx0XHRwcm9jZXNzUGFpbnRTVkcocGFpbnROZXh0LCByZW5kZXJpbmcpO1xuXHRcdH1cblxuXHRcdGNhc2UgUEFJTlRfRklMTDoge1xuXHRcdFx0Y29uc3Qgc3ZnID0gXCJcIjtcblxuXHRcdFx0aWYgKHJlbmRlcmluZy50cmFuc2Zvcm0pIHtcblx0XHRcdFx0cmVuZGVyaW5nLnRyYW5zZm9ybS5zcGxpdChcIiBcIikgLy8gdGhpcyBjb25jYXRlbmF0ZXMgYWxsIHRoZSB0cmFuc2Zvcm1zLCBtYXRyaXgsIHJvdGF0ZSwgc2tldywgdHJhbnNsYXRlXG5cdFxuXHRcdFx0fVxuXHRcblx0XHRcdGlmIChyZW5kZXJpbmcuZ3JhZGllbnQpIHtcblx0XG5cdFxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7IC8vIHJlbmRlcmluZyBmaWxsXG5cdFxuXHRcblx0XHRcdH1cblx0XG5cdFx0XHRyZXR1cm4gc3ZnO1xuXHRcblx0XHR9XG5cblx0fVxufVxuXG5mdW5jdGlvbiBmaW5hbGl6ZVNWRyAoc3ZnRWxlbWVudHMsIGRlZnMsIHRyYW5zZm9ybSwgc3R5bGUpIHtcblxuXHRsZXQgc3ZnU3RyaW5nID0gU1ZHX1BSRUFNQkxFO1xuXHRpZiAoZGVmcy5sZW5ndGgpXG5cdFx0c3ZnU3RyaW5nICs9IFwiPGRlZnM+XCIgKyBkZWZzLmpvaW4oKSArIFwiPC9kZWZzPlwiO1xuXHRzdmdTdHJpbmcgKz0gIHN2Z0VsZW1lbnRzO1xuXHRzdmdTdHJpbmcgKz0gXCI8L2c+XCI7XG5cdHJldHVybiBzdmdTdHJpbmc7XG59XG5cbmNvbnN0IFBBSU5UX0hBTkRMRVJTID0ge1xuXHQvLyBoYW5kbGVycyBmb3IgdGV4dCBvdXRwdXRcblx0dGV4dDogKHBhaW50KSA9PiB7IGNvbnNvbGUubG9nKHBhaW50KTsgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7IH0sXG5cblxuXHQvLyBoYW5kbGVycyBmb3IgU1ZHIG91dHB1dFxuXHRzdmc6IFtcblx0XHRudWxsLCAvLyAwIChkb2VzIG5vdCBleGlzdClcblxuXHRcdC8vIDE6IFBhaW50Q29sckxheWVyc1xuXHRcdChwYWludCwgcmVuZGVyaW5nKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhaW50Q29sckxheWVyc1wiKTtcblx0XHR9LFxuXHRcdFxuXHRcdC8vIDI6IFBhaW50U29saWRcblx0XHQocGFpbnQsIHJlbmRlcmluZykgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coXCJQYWludFNvbGlkXCIpO1xuXHRcdH0sXG5cdFx0bnVsbCwgLy8gMzogUGFpbnRWYXJTb2xpZFxuXG5cdFx0Ly8gNDogUGFpbnRMaW5lYXJHcmFkaWVudFxuXHRcdChwYWludCwgcmVuZGVyaW5nKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhaW50TGluZWFyR3JhZGllbnRcIik7XG5cdFx0fSxcblx0XHRudWxsLCAvLyA1OiBQYWludFZhckxpbmVhckdyYWRpZW50XG5cblx0XHQvLyA2OiBQYWludFJhZGlhbEdyYWRpZW50XG5cdFx0KHBhaW50LCByZW5kZXJpbmcpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFpbnRSYWRpYWxHcmFkaWVudFwiKTtcblx0XHR9LFxuXHRcdG51bGwsIC8vIDc6IFBhaW50VmFyUmFkaWFsR3JhZGllbnRcblxuXHRcdC8vIDg6IFBhaW50U3dlZXBHcmFkaWVudFxuXHRcdChwYWludCwgcmVuZGVyaW5nKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhaW50U3dlZXBHcmFkaWVudFwiKTtcblx0XHR9LFxuXHRcdG51bGwsIC8vIDk6IFBhaW50VmFyU3dlZXBHcmFkaWVudFxuXG5cdFx0Ly8gMTA6IFBhaW50R2x5cGhcblx0XHQocGFpbnQsIHJlbmRlcmluZykgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coXCJQYWludEdseXBoXCIpO1xuXHRcdH0sXG5cblx0XHQvLyAxMTogUGFpbnRDb2xyR2x5cGhcblx0XHQocGFpbnQsIHJlbmRlcmluZykgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coXCJQYWludENvbHJHbHlwaFwiKTtcblx0XHR9LFxuXG5cdFx0Ly8gMTIgOiBQYWludFRyYW5zZm9ybVxuXHRcdChwYWludCwgcmVuZGVyaW5nKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhaW50U3dlZXBHcmFkaWVudFwiKTtcblx0XHR9LFxuXHRcdG51bGwsIC8vIDEzOiBQYWludFZhclRyYW5zZm9ybVxuXG5cdFx0Ly8gMTQgOiBQYWludFRyYW5zbGF0ZVxuXHRcdChwYWludCwgcmVuZGVyaW5nKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhaW50VHJhbnNsYXRlXCIpO1xuXHRcdH0sXG5cdFx0bnVsbCwgLy8gMTU6IFBhaW50VmFyVHJhbnNsYXRlXG5cblx0XHQvLyAxNjogUGFpbnRTY2FsZVxuXHRcdChwYWludCwgcmVuZGVyaW5nKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhaW50U2NhbGVcIik7XG5cdFx0fSxcblx0XHRudWxsLCAvLyAxNzogUGFpbnRWYXJTY2FsZVxuXHRcdG51bGwsIC8vIDE4OiBQYWludFNjYWxlQXJvdW5kQ2VudGVyXG5cdFx0bnVsbCwgLy8gMTk6IFBhaW50VmFyU2NhbGVBcm91bmRDZW50ZXJcblx0XHRudWxsLCAvLyAyMDogUGFpbnRTY2FsZVVuaWZvcm1cblx0XHRudWxsLCAvLyAyMTogUGFpbnRWYXJTY2FsZVVuaWZvcm1cblx0XHRudWxsLCAvLyAyMjogUGFpbnRTY2FsZVVuaWZvcm1Bcm91bmRDZW50ZXJcblx0XHRudWxsLCAvLyAyMzogUGFpbnRWYXJTY2FsZVVuaWZvcm1Bcm91bmRDZW50ZXJcblxuXHRcdC8vIDI0OiBQYWludFJvdGF0ZVxuXHRcdChwYWludCwgcmVuZGVyaW5nKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhaW50Um90YXRlXCIpO1xuXHRcdH0sXG5cdFx0bnVsbCwgLy8gMjU6IFBhaW50VmFyUm90YXRlXG5cdFx0bnVsbCwgLy8gMjY6IFBhaW50Um90YXRlQXJvdW5kQ2VudGVyXG5cdFx0bnVsbCwgLy8gMjc6IFBhaW50VmFyUm90YXRlQXJvdW5kQ2VudGVyXG5cblx0XHQvLyAyODogUGFpbnRTa2V3XG5cdFx0KHBhaW50LCByZW5kZXJpbmcpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFpbnRTa2V3XCIpO1xuXHRcdH0sXG5cdFx0bnVsbCwgLy8gMjk6IFBhaW50VmFyU2tld1xuXHRcdG51bGwsIC8vIDMwOiBQYWludFNrZXdBcm91bmRDZW50ZXIsIFBhaW50VmFyU2tld0Fyb3VuZENlbnRlclxuXHRcdG51bGwsIC8vIDMxOiBQYWludFNrZXdBcm91bmRDZW50ZXIsIFBhaW50VmFyU2tld0Fyb3VuZENlbnRlclxuXG5cdFx0Ly8gMzI6IFBhaW50Q29tcG9zaXRlXG5cdFx0KHBhaW50LCByZW5kZXJpbmcpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFpbnRDb21wb3NpdGVcIik7XG5cdFx0fSxcblx0XSxcblxuXG5cdC8vIGhhbmRsZXJzIGZvciBTVkcgb3V0cHV0XG5cdF9zdmc6IFtcblx0XHRudWxsLCAvLyAwIChkb2VzIG5vdCBleGlzdClcblxuXHRcdC8vIDE6IFBhaW50Q29sckxheWVyc1xuXHRcdChwYWludCwgcmVuZGVyaW5nKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhaW50Q29sckxheWVyc1wiKTtcblx0XHR9LFxuXHRcdFxuXHRcdC8vIDI6IFBhaW50U29saWRcblx0XHQocGFpbnQsIHJlbmRlcmluZykgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coXCJQYWludFNvbGlkXCIpO1xuXHRcdH0sXG5cdFx0bnVsbCwgLy8gMzogUGFpbnRWYXJTb2xpZFxuXG5cdFx0Ly8gNDogUGFpbnRMaW5lYXJHcmFkaWVudFxuXHRcdChwYWludCwgcmVuZGVyaW5nKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhaW50TGluZWFyR3JhZGllbnRcIik7XG5cdFx0fSxcblx0XHRudWxsLCAvLyA1OiBQYWludFZhckxpbmVhckdyYWRpZW50XG5cblx0XHQvLyA2OiBQYWludFJhZGlhbEdyYWRpZW50XG5cdFx0KHBhaW50LCByZW5kZXJpbmcpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFpbnRSYWRpYWxHcmFkaWVudFwiKTtcblx0XHR9LFxuXHRcdG51bGwsIC8vIDc6IFBhaW50VmFyUmFkaWFsR3JhZGllbnRcblxuXHRcdC8vIDg6IFBhaW50U3dlZXBHcmFkaWVudFxuXHRcdChwYWludCwgcmVuZGVyaW5nKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhaW50U3dlZXBHcmFkaWVudFwiKTtcblx0XHR9LFxuXHRcdG51bGwsIC8vIDk6IFBhaW50VmFyU3dlZXBHcmFkaWVudFxuXG5cdFx0Ly8gMTA6IFBhaW50R2x5cGhcblx0XHQocGFpbnQsIHJlbmRlcmluZykgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coXCJQYWludEdseXBoXCIpO1xuXHRcdH0sXG5cblx0XHQvLyAxMTogUGFpbnRDb2xyR2x5cGhcblx0XHQocGFpbnQsIHJlbmRlcmluZykgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coXCJQYWludENvbHJHbHlwaFwiKTtcblx0XHR9LFxuXG5cdFx0Ly8gMTIgOiBQYWludFRyYW5zZm9ybVxuXHRcdChwYWludCwgcmVuZGVyaW5nKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhaW50U3dlZXBHcmFkaWVudFwiKTtcblx0XHR9LFxuXHRcdG51bGwsIC8vIDEzOiBQYWludFZhclRyYW5zZm9ybVxuXG5cdFx0Ly8gMTQgOiBQYWludFRyYW5zbGF0ZVxuXHRcdChwYWludCwgcmVuZGVyaW5nKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhaW50VHJhbnNsYXRlXCIpO1xuXHRcdH0sXG5cdFx0bnVsbCwgLy8gMTU6IFBhaW50VmFyVHJhbnNsYXRlXG5cblx0XHQvLyAxNjogUGFpbnRTY2FsZVxuXHRcdChwYWludCwgcmVuZGVyaW5nKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhaW50U2NhbGVcIik7XG5cdFx0fSxcblx0XHRudWxsLCAvLyAxNzogUGFpbnRWYXJTY2FsZVxuXHRcdG51bGwsIC8vIDE4OiBQYWludFNjYWxlQXJvdW5kQ2VudGVyXG5cdFx0bnVsbCwgLy8gMTk6IFBhaW50VmFyU2NhbGVBcm91bmRDZW50ZXJcblx0XHRudWxsLCAvLyAyMDogUGFpbnRTY2FsZVVuaWZvcm1cblx0XHRudWxsLCAvLyAyMTogUGFpbnRWYXJTY2FsZVVuaWZvcm1cblx0XHRudWxsLCAvLyAyMjogUGFpbnRTY2FsZVVuaWZvcm1Bcm91bmRDZW50ZXJcblx0XHRudWxsLCAvLyAyMzogUGFpbnRWYXJTY2FsZVVuaWZvcm1Bcm91bmRDZW50ZXJcblxuXHRcdC8vIDI0OiBQYWludFJvdGF0ZVxuXHRcdChwYWludCwgcmVuZGVyaW5nKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhaW50Um90YXRlXCIpO1xuXHRcdH0sXG5cdFx0bnVsbCwgLy8gMjU6IFBhaW50VmFyUm90YXRlXG5cdFx0bnVsbCwgLy8gMjY6IFBhaW50Um90YXRlQXJvdW5kQ2VudGVyXG5cdFx0bnVsbCwgLy8gMjc6IFBhaW50VmFyUm90YXRlQXJvdW5kQ2VudGVyXG5cblx0XHQvLyAyODogUGFpbnRTa2V3XG5cdFx0KHBhaW50LCByZW5kZXJpbmcpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFpbnRTa2V3XCIpO1xuXHRcdH0sXG5cdFx0bnVsbCwgLy8gMjk6IFBhaW50VmFyU2tld1xuXHRcdG51bGwsIC8vIDMwOiBQYWludFNrZXdBcm91bmRDZW50ZXIsIFBhaW50VmFyU2tld0Fyb3VuZENlbnRlclxuXHRcdG51bGwsIC8vIDMxOiBQYWludFNrZXdBcm91bmRDZW50ZXIsIFBhaW50VmFyU2tld0Fyb3VuZENlbnRlclxuXG5cdFx0Ly8gMzI6IFBhaW50Q29tcG9zaXRlXG5cdFx0KHBhaW50LCByZW5kZXJpbmcpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFpbnRDb21wb3NpdGVcIik7XG5cdFx0fSxcblx0XSxcbn07XG5PYmplY3Qua2V5cyhQQUlOVF9IQU5ETEVSUykuZm9yRWFjaChrZXkgPT4ge1xuXG5cdGxldCBsYXN0Tm9uTnVsbEhhbmRsZXIgPSBudWxsO1xuXHRmb3IgKGxldCBoPTE7IGg8UEFJTlRfSEFORExFUlNba2V5XS5sZW5ndGg7IGgrKykgeyAvLyBza2lwIHRoZSBmaXJzdCBlbnRyeSwgd2hpY2ggaXMgYWx3YXlzIG51bGxcblx0XHRpZiAoUEFJTlRfSEFORExFUlNba2V5XVtoXSkge1xuXHRcdFx0bGFzdE5vbk51bGxIYW5kbGVyID0gUEFJTlRfSEFORExFUlNba2V5XVtoXTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRQQUlOVF9IQU5ETEVSU1trZXldW2hdID0gbGFzdE5vbk51bGxIYW5kbGVyO1xuXHRcdH1cdFxuXHR9XG59KTtcbiovXG5cblxuLy8gU2Ftc2FCdWZmZXIgaXMgYSBEYXRhVmlldyBzdWJjbGFzcywgY29uc3RydWN0ZWQgZnJvbSBhbiBBcnJheUJ1ZmZlciBpbiBleGFjdGx5IHRoZSBzYW1lIHdheSBhcyBEYXRhVmlld1xuLy8gLSB0aGUgbWFpbiBkaWZmZXJlbmNlIGlzIHRoYXQgaXQga2VlcHMgdHJhY2sgb2YgYSBtZW1vcnkgcG9pbnRlciwgd2hpY2ggaXMgaW5jcmVtZW50ZWQgb24gcmVhZC93cml0ZVxuLy8gLSB3ZSBhbHNvIGtlZXAgdHJhY2sgb2YgYSBwaGFzZSwgd2hpY2ggaXMgdXNlZCBmb3IgbmliYmxlIHJlYWRzL3dyaXRlc1xuLy8gLSB0aGVyZSBhcmUgbnVtZXJvdXMgZGVjb2RlL2VuY29kZSBtZXRob2RzIGZvciBjb252ZXJ0aW5nIGNvbXBsZXggZGF0YSBzdHJ1Y3R1cmVzIHRvIGFuZCBmcm9tIGJpbmFyeVxuY2xhc3MgU2Ftc2FCdWZmZXIgZXh0ZW5kcyBEYXRhVmlldyB7XG5cdFxuXHRjb25zdHJ1Y3RvcihidWZmZXIsIGJ5dGVPZmZzZXQsIGJ5dGVMZW5ndGgpIHtcblx0XHRzdXBlcihidWZmZXIsIGJ5dGVPZmZzZXQsIGJ5dGVMZW5ndGgpO1xuXHRcdHRoaXMucCA9IDA7IC8vIHRoZSBtZW1vcnkgcG9pbnRlclxuXHRcdHRoaXMucGhhc2UgPSBmYWxzZTsgLy8gcGhhc2UgZm9yIG5pYmJsZXNcblxuXHRcdHRoaXMuZ2V0dGVycyA9IFtdO1xuXHRcdHRoaXMuZ2V0dGVyc1tVNF0gPSAoKSA9PiB0aGlzLnU0O1xuXHRcdHRoaXMuZ2V0dGVyc1tVOF0gPSAoKSA9PiB0aGlzLnU4O1xuXHRcdHRoaXMuZ2V0dGVyc1tJOF0gPSAoKSA9PiB0aGlzLmk4O1xuXHRcdHRoaXMuZ2V0dGVyc1tVMTZdID0gKCkgPT4gdGhpcy51MTY7XG5cdFx0dGhpcy5nZXR0ZXJzW0kxNl0gPSAoKSA9PiB0aGlzLmkxNjtcblx0XHR0aGlzLmdldHRlcnNbVTI0XSA9ICgpID0+IHRoaXMudTI0O1xuXHRcdHRoaXMuZ2V0dGVyc1tJMjRdID0gKCkgPT4gdGhpcy5pMjQ7XG5cdFx0dGhpcy5nZXR0ZXJzW1UzMl0gPSAoKSA9PiB0aGlzLnUzMjtcblx0XHR0aGlzLmdldHRlcnNbSTMyXSA9ICgpID0+IHRoaXMuaTMyO1xuXHRcdHRoaXMuZ2V0dGVyc1tVNjRdID0gKCkgPT4gdGhpcy51NjQ7XG5cdFx0dGhpcy5nZXR0ZXJzW0k2NF0gPSAoKSA9PiB0aGlzLmk2NDtcblx0XHR0aGlzLmdldHRlcnNbRjIxNF0gPSAoKSA9PiB0aGlzLmYyMTQ7XG5cdFx0dGhpcy5nZXR0ZXJzW0YxNjE2XSA9ICgpID0+IHRoaXMuZjE2MTY7XG5cdFx0dGhpcy5nZXR0ZXJzW1RBR10gPSAoKSA9PiB0aGlzLnRhZztcblx0XHR0aGlzLmdldHRlcnNbU1RSXSA9ICgpID0+IHRoaXMudGFnO1xuXG5cdFx0dGhpcy5zZXR0ZXJzID0gW107XG5cdFx0dGhpcy5zZXR0ZXJzW1U0XSA9IG4gPT4gdGhpcy51NCA9IG47XG5cdFx0dGhpcy5zZXR0ZXJzW1U4XSA9IG4gPT4gdGhpcy51OCA9IG47XG5cdFx0dGhpcy5zZXR0ZXJzW0k4XSA9IG4gPT4gdGhpcy5pOCA9IG47XG5cdFx0dGhpcy5zZXR0ZXJzW1UxNl0gPSBuID0+IHRoaXMudTE2ID0gbjtcblx0XHR0aGlzLnNldHRlcnNbSTE2XSA9IG4gPT4gdGhpcy5pMTYgPSBuO1xuXHRcdHRoaXMuc2V0dGVyc1tVMjRdID0gbiA9PiB0aGlzLnUyNCA9IG47XG5cdFx0dGhpcy5zZXR0ZXJzW0kyNF0gPSBuID0+IHRoaXMuaTI0ID0gbjtcblx0XHR0aGlzLnNldHRlcnNbVTMyXSA9IG4gPT4gdGhpcy51MzIgPSBuO1xuXHRcdHRoaXMuc2V0dGVyc1tJMzJdID0gbiA9PiB0aGlzLmkzMiA9IG47XG5cdFx0dGhpcy5zZXR0ZXJzW1U2NF0gPSBuID0+IHRoaXMudTY0ID0gbjtcblx0XHR0aGlzLnNldHRlcnNbSTY0XSA9IG4gPT4gdGhpcy5pNjQgPSBuO1xuXHRcdHRoaXMuc2V0dGVyc1tGMjE0XSA9IG4gPT4gdGhpcy5mMjE0ID0gbjtcblx0XHR0aGlzLnNldHRlcnNbRjE2MTZdID0gbiA9PiB0aGlzLmYxNjE2ID0gbjtcblx0XHR0aGlzLnNldHRlcnNbVEFHXSA9IG4gPT4gdGhpcy50YWcgPSBuO1xuXHRcdHRoaXMuc2V0dGVyc1tTVFJdID0gbiA9PiB0aGlzLnRhZyA9IG47XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8vIGdldCBjdXJyZW50IHBvc2l0aW9uXG5cdHRlbGwoKSB7XG5cdFx0cmV0dXJuIHRoaXMucDtcblx0fVxuXG5cdC8vIHNlZWsgdG8gYWJzb2x1dGUgcG9zaXRpb25cblx0c2VlayhwKSB7XG5cdFx0dGhpcy5wID0gcDtcblx0fVxuXG5cdC8vIHNlZWsgdG8gcmVsYXRpdmUgcG9zaXRpb25cblx0c2Vla3IocCkge1xuXHRcdHRoaXMucCArPSBwO1xuXHR9XG5cblx0Ly8gdmFsaWRhdGUgb2Zmc2V0XG5cdHNlZWtWYWxpZChwKSB7XG5cdFx0cmV0dXJuIHAgPj0gMCAmJiBwIDwgdGhpcy5ieXRlTGVuZ3RoO1xuXHR9XG5cblx0Ly8gdWludDY0LCBpbnQ2NFxuXHRzZXQgdTY0KG51bSkge1xuXHRcdHRoaXMuc2V0VWludDMyKHRoaXMucCwgbnVtID4+IDMyKTtcblx0XHR0aGlzLnNldFVpbnQzMih0aGlzLnArNCwgbnVtICYgMHhmZmZmZmZmZik7XG5cdFx0dGhpcy5wICs9IDg7XG5cdH1cblxuXHRnZXQgdTY0KCkge1xuXHRcdGNvbnN0IHJldCA9ICh0aGlzLmdldFVpbnQzMih0aGlzLnApIDw8IDMyKSArIHRoaXMuZ2V0VWludDMyKHRoaXMucCs0KTtcblx0XHR0aGlzLnAgKz0gODtcblx0XHRyZXR1cm4gcmV0O1xuXHR9XG5cblx0c2V0IGk2NChudW0pIHtcblx0XHR0aGlzLnNldFVpbnQzMih0aGlzLnAsIG51bSA+PiAzMik7XG5cdFx0dGhpcy5zZXRVaW50MzIodGhpcy5wKzQsIG51bSAmIDB4ZmZmZmZmZmYpO1xuXHRcdHRoaXMucCArPSA4O1xuXHR9XG5cblx0Z2V0IGk2NCgpIHtcblx0XHRjb25zdCByZXQgPSAodGhpcy5nZXRVaW50MzIodGhpcy5wKSA8PCAzMikgKyB0aGlzLmdldFVpbnQzMih0aGlzLnArNCk7XG5cdFx0dGhpcy5wICs9IDg7XG5cdFx0cmV0dXJuIHJldDtcblx0fVxuXG5cdC8vIHVpbnQzMiwgaW50MzIsIGYxNmRvdDE2XG5cdHNldCB1MzIobnVtKSB7XG5cdFx0dGhpcy5zZXRVaW50MzIodGhpcy5wLCBudW0pO1xuXHRcdHRoaXMucCArPSA0O1xuXHR9XG5cblx0Z2V0IHUzMigpIHtcblx0XHRjb25zdCByZXQgPSB0aGlzLmdldFVpbnQzMih0aGlzLnApO1xuXHRcdHRoaXMucCArPSA0O1xuXHRcdHJldHVybiByZXQ7XG5cdH1cblxuXHRzZXQgaTMyKG51bSkge1xuXHRcdHRoaXMuc2V0SW50MzIodGhpcy5wLCBudW0pO1xuXHRcdHRoaXMucCArPSA0O1xuXHR9XG5cblx0Z2V0IGkzMigpIHtcblx0XHRjb25zdCByZXQgPSB0aGlzLmdldEludDMyKHRoaXMucCk7XG5cdFx0dGhpcy5wICs9IDQ7XG5cdFx0cmV0dXJuIHJldDtcblx0fVxuXG5cdHNldCBmMTYxNihudW0pIHtcblx0XHR0aGlzLnNldEludDMyKHRoaXMucCwgbnVtICogMHgxMDAwMCk7XG5cdFx0dGhpcy5wICs9IDQ7XG5cdH1cblxuXHRnZXQgZjE2MTYoKSB7XG5cdFx0Y29uc3QgcmV0ID0gdGhpcy5nZXRJbnQzMih0aGlzLnApIC8gMHgxMDAwMDtcblx0XHR0aGlzLnAgKz0gNDtcblx0XHRyZXR1cm4gcmV0O1xuXHR9XG5cblx0Ly8gdWludDI0LCBpbnQyNFxuXHRzZXQgdTI0KG51bSkge1xuXHRcdHRoaXMuc2V0VWludDE2KHRoaXMucCwgbnVtID4+IDgpO1xuXHRcdHRoaXMuc2V0VWludDgodGhpcy5wKzIsIG51bSAmIDB4ZmYpO1xuXHRcdHRoaXMucCArPSAzO1xuXHR9XG5cblx0Z2V0IHUyNCgpIHtcblx0XHRjb25zdCByZXQgPSAodGhpcy5nZXRVaW50MTYodGhpcy5wKSA8PCA4KSArIHRoaXMuZ2V0VWludDgodGhpcy5wKzIpO1xuXHRcdHRoaXMucCArPSAzO1xuXHRcdHJldHVybiByZXQ7XG5cdH1cblxuXHRzZXQgaTI0KG51bSkge1xuXHRcdHRoaXMuc2V0VWludDE2KHRoaXMucCwgbnVtID4+IDgpO1xuXHRcdHRoaXMuc2V0VWludDgodGhpcy5wKzIsIG51bSAmIDB4ZmYpO1xuXHRcdHRoaXMucCArPSAzO1xuXHR9XG5cblx0Z2V0IGkyNCgpIHtcblx0XHRjb25zdCByZXQgPSAodGhpcy5nZXRJbnQxNih0aGlzLnApICogMjU2KSArIHRoaXMuZ2V0VWludDgodGhpcy5wKzIpO1xuXHRcdHRoaXMucCArPSAzO1xuXHRcdHJldHVybiByZXQ7XG5cdH1cblxuXHQvLyB1aW50MTYsIGludDE2LCBmMmRvdDE0XG5cdHNldCB1MTYobnVtKSB7XG5cdFx0dGhpcy5zZXRVaW50MTYodGhpcy5wLCBudW0pO1xuXHRcdHRoaXMucCArPSAyO1xuXHR9XG5cblx0Z2V0IHUxNigpIHtcblx0XHRjb25zdCByZXQgPSB0aGlzLmdldFVpbnQxNih0aGlzLnApO1xuXHRcdHRoaXMucCArPSAyO1xuXHRcdHJldHVybiByZXQ7XG5cdH1cblxuXHRzZXQgdTE2XzI1NShudW0pIHtcblx0XHRjb25zdCBvbmVNb3JlQnl0ZUNvZGUxICAgID0gMjU1O1xuXHRcdGNvbnN0IG9uZU1vcmVCeXRlQ29kZTIgICAgPSAyNTQ7XG5cdFx0Y29uc3Qgd29yZENvZGUgICAgICAgICAgICA9IDI1Mztcblx0XHRjb25zdCBsb3dlc3RVQ29kZSAgICAgICAgID0gMjUzO1xuXHRcdGlmIChudW0gPCAyNTMpIHtcblx0XHRcdHRoaXMudTggPSBudW07XG5cdFx0fVxuXHRcdGVsc2UgaWYgKG51bSA8IDUwNikge1xuXHRcdFx0dGhpcy51OCA9IG9uZU1vcmVCeXRlQ29kZTE7XG5cdFx0XHR0aGlzLnU4ID0gbnVtIC0gbG93ZXN0VUNvZGU7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKG51bSA8IDc1OSkge1xuXHRcdFx0dGhpcy51OCA9IG9uZU1vcmVCeXRlQ29kZTI7XG5cdFx0XHR0aGlzLnU4ID0gbnVtIC0gbG93ZXN0VUNvZGUgKiAyO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoaXMudTggPSB3b3JkQ29kZTtcblx0XHRcdHRoaXMudTE2ID0gbnVtO1xuXHRcdH1cblx0fVxuXG5cdGdldCB1MTZfMjU1KCkge1xuXHRcdC8vIGh0dHBzOi8vd3d3LnczLm9yZy9UUi9XT0ZGMi8jZ2x5Zl90YWJsZV9mb3JtYXRcblx0XHRjb25zdCBvbmVNb3JlQnl0ZUNvZGUxICAgID0gMjU1O1xuXHRcdGNvbnN0IG9uZU1vcmVCeXRlQ29kZTIgICAgPSAyNTQ7XG5cdFx0Y29uc3Qgd29yZENvZGUgICAgICAgICAgICA9IDI1Mztcblx0XHRjb25zdCBsb3dlc3RVQ29kZSAgICAgICAgID0gMjUzO1xuXHRcdGxldCB2YWx1ZSwgdmFsdWUyO1xuXG5cdFx0Y29uc3QgY29kZSA9IHRoaXMudTg7XG5cdFx0aWYgKGNvZGUgPT0gd29yZENvZGUpIHtcblx0XHRcdHZhbHVlID0gdGhpcy51ODtcblx0XHRcdHZhbHVlIDw8PSA4O1xuXHRcdFx0dmFsdWUgfD0gdGhpcy51ODtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoY29kZSA9PSBvbmVNb3JlQnl0ZUNvZGUxKSAge1xuXHRcdFx0dmFsdWUgPSB0aGlzLnU4ICsgbG93ZXN0VUNvZGU7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGNvZGUgPT0gb25lTW9yZUJ5dGVDb2RlMikge1xuXHRcdFx0dmFsdWUgPSB0aGlzLnU4ICsgbG93ZXN0VUNvZGUqMjtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR2YWx1ZSA9IGNvZGU7XG5cdFx0fVxuXHRcdHJldHVybiB2YWx1ZTtcblx0XHR9XG5cblx0c2V0IGkxNihudW0pIHtcblx0XHR0aGlzLnNldEludDE2KHRoaXMucCwgbnVtKTtcblx0XHR0aGlzLnAgKz0gMjtcblx0fVxuXG5cdGdldCBpMTYoKSB7XG5cdFx0Y29uc3QgcmV0ID0gdGhpcy5nZXRJbnQxNih0aGlzLnApO1xuXHRcdHRoaXMucCArPSAyO1xuXHRcdHJldHVybiByZXQ7XG5cdH1cblxuXHRzZXQgZjIxNChudW0pIHtcblx0XHR0aGlzLnNldEludDE2KHRoaXMucCwgbnVtICogMHg0MDAwKTtcblx0XHR0aGlzLnAgKz0gMjtcblx0fVxuXG5cdGdldCBmMjE0KCkge1xuXHRcdGNvbnN0IHJldCA9IHRoaXMuZ2V0SW50MTYodGhpcy5wKSAvIDB4NDAwMDtcblx0XHR0aGlzLnAgKz0gMjtcblx0XHRyZXR1cm4gcmV0O1xuXHR9XG5cblx0Ly8gdWludDgsIGludDhcblx0c2V0IHU4KG51bSkge1xuXHRcdHRoaXMuc2V0VWludDgodGhpcy5wKyssIG51bSk7XG5cdH1cblxuXHRnZXQgdTgoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0VWludDgodGhpcy5wKyspO1xuXHR9XG5cblx0c2V0IGk4KG51bSkge1xuXHRcdHRoaXMuc2V0SW50OCh0aGlzLnArKywgbnVtKTtcblx0fVxuXG5cdGdldCBpOCgpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRJbnQ4KHRoaXMucCsrKTtcblx0fVxuXG5cdC8vIHU0IChuaWJibGUpXG5cdHNldCB1NChudW0pIHtcblx0XHQvLyBub3RlIHRoYXQgd3JpdGluZyB0aGUgaGlnaCBuaWJibGUgZG9lcyBub3QgemVybyB0aGUgbG93IG5pYmJsZVxuXHRcdGNvbnN0IGJ5dGUgPSB0aGlzLmdldFVpbnQ4KHRoaXMucCk7XG5cdFx0aWYgKHRoaXMucGhhc2UpIHtcblx0XHRcdHRoaXMuc2V0VWludDgodGhpcy5wKyssIChieXRlICYgMHhmMCkgfCAobnVtICYgMHgwZikpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoaXMuc2V0VWludDgodGhpcy5wLCAoYnl0ZSAmIDB4MGYpIHwgKG51bSA8PCA0KSk7XG5cdFx0fVxuXHRcdHRoaXMucGhhc2UgPSAhdGhpcy5waGFzZTtcblx0fVxuXG5cdGdldCB1NCgpIHtcblx0XHRjb25zdCBieXRlID0gdGhpcy5nZXRVaW50OCh0aGlzLnApO1xuXHRcdHRoaXMucGhhc2UgPSAhdGhpcy5waGFzZTtcblx0XHRpZiAodGhpcy5waGFzZSkge1xuXHRcdFx0cmV0dXJuIChieXRlICYgMHhmMCkgPj4gNDtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0aGlzLnArKztcblx0XHRcdHJldHVybiBieXRlICYgMHgwZjtcblx0XHR9XG5cdH1cblxuXHQvLyB0YWdcblx0c2V0IHRhZyhzdHIpIHtcblx0XHRsZXQgbGVuZ3RoID0gNDtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0XHR0aGlzLnNldFVpbnQ4KHRoaXMucCsrLCBzdHIuY2hhckNvZGVBdChpKSk7XG5cdFx0fVxuXHR9XG5cblx0Z2V0IHRhZygpIHtcblx0XHRsZXQgcmV0ID0gXCJcIjtcblx0XHRsZXQgbGVuZ3RoID0gNDtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0XHRyZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSh0aGlzLmdldFVpbnQ4KHRoaXMucCsrKSk7XG5cdFx0fVxuXHRcdHJldHVybiByZXQ7XG5cdH1cblxuXHRjb21wYXJlKGNvbmRpdGlvbikge1xuXHRcdGNvbnN0IFthLCBjb21wYXJpc29uLCBiXSA9IGNvbmRpdGlvbjtcblx0XHRzd2l0Y2ggKGNvbXBhcmlzb24pIHtcblx0XHRcdGNhc2UgXCI+PVwiOiByZXR1cm4gYSA+PSBiO1xuXHRcdFx0Y2FzZSBcIjw9XCI6IHJldHVybiBhIDw9IGI7XG5cdFx0XHRjYXNlIFwiPT1cIjogcmV0dXJuIGEgPT0gYjtcblx0XHRcdGNhc2UgXCI8XCI6IHJldHVybiBhIDwgYjtcblx0XHRcdGNhc2UgXCI+XCI6IHJldHVybiBhID4gYjtcblx0XHRcdGNhc2UgXCIhPVwiOiByZXR1cm4gYSAhPSBiO1xuXHRcdH1cblx0fVxuXG5cdGNoZWNrU3VtKG9mZnNldD0wLCBsZW5ndGgsIGhlYWRUYWJsZSkge1xuXHRcdGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0bGVuZ3RoID0gdGhpcy5ieXRlTGVuZ3RoIC0gb2Zmc2V0O1xuXHRcdH1cblx0XHRjb25zdCBwU2F2ZWQgPSB0aGlzLnRlbGwoKTtcblx0XHRjb25zdCBtYWluTGVuZ3RoID0gNCAqIE1hdGguZmxvb3IobGVuZ3RoLzQpO1xuXHRcdGxldCBzdW0gPSAwO1xuXHRcdHRoaXMuc2VlayhvZmZzZXQpO1xuXG5cdFx0Ly8gc3VtIHRoZSBlbnRpcmUgdGFibGUgZXhjZXB0IGFueSB0cmFpbGluZyBieXRlcyB0aGF0IGFyZSBub3QgYSBtdWx0aXBsZSBvZiA0XG5cdFx0aWYgKCFoZWFkVGFibGUpIHtcblx0XHRcdC8vIHRoaXMgaXMgbm90IHRoZSBoZWFkIHRhYmxlIDopXG5cdFx0XHR3aGlsZSAodGhpcy5wIDwgb2Zmc2V0ICsgbWFpbkxlbmd0aCkge1xuXHRcdFx0XHRzdW0gKz0gdGhpcy51MzI7XG5cdFx0XHRcdHN1bSAmPSAweGZmZmZmZmZmO1xuXHRcdFx0XHRzdW0gPj4+PSAwO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdC8vIHNwZWNpYWwgaGFuZGxpbmcgZm9yIGhlYWQgdGFibGU6ICBza2lwIG92ZXIgdGhlIGNoZWNrc3VtQWRqdXN0bWVudCBmaWVsZFxuXHRcdFx0d2hpbGUgKHRoaXMucCA8IG9mZnNldCArIG1haW5MZW5ndGgpIHtcblx0XHRcdFx0aWYgKHRoaXMucCAtIG9mZnNldCA9PT0gOCkge1xuXHRcdFx0XHRcdHRoaXMucCArPSA0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHN1bSArPSB0aGlzLnUzMjtcblx0XHRcdFx0XHRzdW0gJj0gMHhmZmZmZmZmZjtcblx0XHRcdFx0XHRzdW0gPj4+PSAwO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gc3VtIGFueSB0cmFpbGluZyBieXRlc1xuXHRcdHdoaWxlICh0aGlzLnAgPCBvZmZzZXQgKyBsZW5ndGgpIHtcblx0XHRcdGNvbnN0IHNoaWZ0ID0gKDMgLSAodGhpcy5wIC0gb2Zmc2V0KSAlIDQpICogODtcblx0XHRcdHN1bSArPSB0aGlzLnU4IDw8IHNoaWZ0O1xuXHRcdFx0c3VtID4+Pj0gMDtcblx0XHR9XG5cblx0XHRzdW0gJj0gMHhmZmZmZmZmZjsgLy8gdW5uZWNlc3Nhcnk/XG5cdFx0c3VtID4+Pj0gMDsgLy8gdW5uZWNlc3Nhcnk/XG5cdFx0dGhpcy5zZWVrKHBTYXZlZCk7XG5cdFx0cmV0dXJuIHN1bTtcblx0fVxuXG5cdGRlY29kZShvYmpUeXBlLCBhcmcwLCBhcmcxLCBhcmcyKSB7IC8vIFRPRE86IHRlc3QgZmlyc3QgZm9yIHR5cGVvZiBvYmpUeXBlW2tleV0gPT0gXCJudW1iZXJcIiBhcyBpdOKAmXMgdGhlIG1vc3QgY29tbW9uXG5cdFx0Y29uc3Qgb2JqID0ge307XG5cdFx0T2JqZWN0LmtleXMob2JqVHlwZSkuZm9yRWFjaChrZXkgPT4ge1xuXHRcdFx0aWYgKGtleS5zdGFydHNXaXRoKFwiX0lGX1wiKSkge1xuXHRcdFx0XHQvLyBkZWNvZGUgY29uZGl0aW9uYWwgYmxvY2tcblx0XHRcdFx0Y29uc3QgY29uZGl0aW9uID0gWy4uLm9ialR5cGVba2V5XVswXV07XG5cdFx0XHRcdGlmIChjb25kaXRpb25bMF0gPT0gXCJfQVJHMF9cIilcblx0XHRcdFx0XHRjb25kaXRpb25bMF0gPSBhcmcwO1xuXHRcdFx0XHRlbHNlIGlmIChjb25kaXRpb25bMF0gPT0gXCJfQVJHMV9cIilcblx0XHRcdFx0XHRjb25kaXRpb25bMF0gPSBhcmcxO1xuXHRcdFx0XHRlbHNlIGlmIChjb25kaXRpb25bMF0gPT0gXCJfQVJHMl9cIilcblx0XHRcdFx0XHRjb25kaXRpb25bMF0gPSBhcmcyO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0Y29uZGl0aW9uWzBdID0gb2JqW2NvbmRpdGlvblswXV07XG5cblx0XHRcdFx0aWYgKHRoaXMuY29tcGFyZShjb25kaXRpb24pKSB7XG5cdFx0XHRcdFx0Y29uc3Qgb2JqXyA9IHRoaXMuZGVjb2RlKG9ialR5cGVba2V5XVsxXSk7XG5cdFx0XHRcdFx0T2JqZWN0LmtleXMob2JqXykuZm9yRWFjaChrZXlfID0+IHtcblx0XHRcdFx0XHRcdG9ialtrZXlfXSA9IG9ial9ba2V5X107XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoQXJyYXkuaXNBcnJheShvYmpUeXBlW2tleV0pKSB7XG5cdFx0XHRcdC8vIGRlY29kZSBhcnJheSBvZiBzaW1pbGFyIHZhbHVlc1xuXHRcdFx0XHRsZXQgY291bnQ7XG5cdFx0XHRcdGlmIChOdW1iZXIuaXNJbnRlZ2VyKG9ialR5cGVba2V5XVsxXSkpXG5cdFx0XHRcdFx0Y291bnQgPSBvYmpUeXBlW2tleV1bMV07XG5cdFx0XHRcdGVsc2UgaWYgKG9ialR5cGVba2V5XVsxXSA9PSBcIl9BUkcwX1wiKVxuXHRcdFx0XHRcdGNvdW50ID0gYXJnMDtcblx0XHRcdFx0ZWxzZSBpZiAob2JqVHlwZVtrZXldWzFdID09IFwiX0FSRzFfXCIpXG5cdFx0XHRcdFx0Y291bnQgPSBhcmcxO1xuXHRcdFx0XHRlbHNlIGlmIChvYmpUeXBlW2tleV1bMV0gPT0gXCJfQVJHMl9cIilcblx0XHRcdFx0XHRjb3VudCA9IGFyZzI7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRjb3VudCA9IG9ialtvYmpUeXBlW2tleV1bMV1dO1xuXG5cdFx0XHRcdG9ialtrZXldID0gW107XG5cdFx0XHRcdGZvciAobGV0IGM9MDsgYzxjb3VudDsgYysrKSB7XG5cdFx0XHRcdFx0b2JqW2tleV0ucHVzaCh0aGlzLmdldHRlcnNbb2JqVHlwZVtrZXldWzBdXSgpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdC8vIHNpbXBsZSBkZWNvZGVcblx0XHRcdFx0b2JqW2tleV0gPSB0aGlzLmdldHRlcnNbb2JqVHlwZVtrZXldXSgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiBvYmo7XG5cdH1cblxuXHRlbmNvZGUob2JqVHlwZSwgb2JqLCBhcmcwLCBhcmcxLCBhcmcyKSB7XG5cdFx0T2JqZWN0LmtleXMob2JqVHlwZSkuZm9yRWFjaChrZXkgPT4ge1xuXHRcdFx0aWYgKGtleS5zdGFydHNXaXRoKFwiX0lGX1wiKSkge1xuXHRcdFx0XHQvLyBlbmNvZGUgY29uZGl0aW9uYWwgYmxvY2tcblx0XHRcdFx0Y29uc3QgY29uZGl0aW9uID0gWy4uLm9ialR5cGVba2V5XVswXV07XG5cdFx0XHRcdGlmIChjb25kaXRpb25bMF0gPT0gXCJfQVJHMF9cIilcblx0XHRcdFx0XHRjb25kaXRpb25bMF0gPSBhcmcwO1xuXHRcdFx0XHRlbHNlIGlmIChjb25kaXRpb25bMF0gPT0gXCJfQVJHMV9cIilcblx0XHRcdFx0XHRjb25kaXRpb25bMF0gPSBhcmcxO1xuXHRcdFx0XHRlbHNlIGlmIChjb25kaXRpb25bMF0gPT0gXCJfQVJHMl9cIilcblx0XHRcdFx0XHRjb25kaXRpb25bMF0gPSBhcmcyO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0Y29uZGl0aW9uWzBdID0gb2JqW2NvbmRpdGlvblswXV07XG5cblx0XHRcdFx0aWYgKHRoaXMuY29tcGFyZShjb25kaXRpb24pKSB7XG5cdFx0XHRcdFx0dGhpcy5lbmNvZGUob2JqVHlwZVtrZXldWzFdLCBvYmopO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChBcnJheS5pc0FycmF5KG9ialR5cGVba2V5XSkpIHtcblx0XHRcdFx0Ly8gZW5jb2RlIGFycmF5IG9mIHNpbWlsYXIgdmFsdWVzXG5cdFx0XHRcdGxldCBjb3VudDtcblx0XHRcdFx0aWYgKE51bWJlci5pc0ludGVnZXIob2JqVHlwZVtrZXldWzFdKSlcblx0XHRcdFx0XHRjb3VudCA9IG9ialR5cGVba2V5XVsxXTtcblx0XHRcdFx0ZWxzZSBpZiAob2JqVHlwZVtrZXldWzFdID09IFwiX0FSRzBfXCIpXG5cdFx0XHRcdFx0Y291bnQgPSBhcmcwO1xuXHRcdFx0XHRlbHNlIGlmIChvYmpUeXBlW2tleV1bMV0gPT0gXCJfQVJHMV9cIilcblx0XHRcdFx0XHRjb3VudCA9IGFyZzE7XG5cdFx0XHRcdGVsc2UgaWYgKG9ialR5cGVba2V5XVsxXSA9PSBcIl9BUkcyX1wiKVxuXHRcdFx0XHRcdGNvdW50ID0gYXJnMjtcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGNvdW50ID0gb2JqW29ialR5cGVba2V5XVsxXV07XG5cblx0XHRcdFx0Zm9yIChsZXQgYz0wOyBjPGNvdW50OyBjKyspIHtcblx0XHRcdFx0XHR0aGlzLnNldHRlcnNbb2JqVHlwZVtrZXldWzBdXShvYmpba2V5XVtjXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHQvLyBzaW1wbGUgZW5jb2RlXG5cdFx0XHRcdHRoaXMuc2V0dGVyc1tvYmpUeXBlW2tleV1dKG9ialtrZXldKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGRlY29kZUFycmF5ICh0eXBlLCBsZW5ndGgpIHtcblx0XHRjb25zdCBnZXR0ZXIgPSB0aGlzLmdldHRlcnNbdHlwZV07XG5cdFx0Y29uc3QgYXJyYXkgPSBbXTtcblx0XHRmb3IgKGxldCBpPTA7IGk8bGVuZ3RoOyBpKyspIHtcblx0XHRcdGFycmF5LnB1c2goZ2V0dGVyKCkpO1xuXHRcdH1cblx0XHRyZXR1cm4gYXJyYXk7XG5cdH1cblxuXHRlbmNvZGVBcnJheSAoYXJyYXksIHR5cGUsIGxlbmd0aCkge1xuXHRcdGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0bGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXHRcdH1cblx0XHRjb25zdCBzZXR0ZXIgPSB0aGlzLnNldHRlcnNbdHlwZV07XG5cdFx0Zm9yIChsZXQgaT0wOyBpPGxlbmd0aDsgaSsrKSB7XG5cdFx0XHRzZXR0ZXIoYXJyYXlbaV0pO1xuXHRcdH1cblx0fVxuXG5cdGRlY29kZU5hbWVTdHJpbmcobGVuZ3RoKSB7XG5cdFx0Ly8gVE9ETzogaGFuZGxlIFVURi04IGJleW9uZCAxNiBiaXRzXG5cdFx0bGV0IHN0ciA9IFwiXCI7XG5cdFx0Zm9yIChsZXQgaT0wOyBpPGxlbmd0aDsgaSs9Mikge1xuXHRcdFx0c3RyICs9IFN0cmluZy5mcm9tQ2hhckNvZGUodGhpcy51MTYpO1xuXHRcdH1cblx0XHRyZXR1cm4gc3RyO1xuXHR9XG5cblx0ZW5jb2RlTmFtZVN0cmluZyhzdHIpIHtcblx0XHQvLyBUT0RPOiBoYW5kbGUgVVRGLTggYmV5b25kIDE2IGJpdHNcblx0XHRmb3IgKGxldCBjPTA7IGM8c3RyLmxlbmd0aDsgYysrKSB7XG5cdFx0XHR0aGlzLnUxNiA9IHN0ci5jaGFyQ29kZUF0KGMpO1xuXHRcdH1cblx0XHQvLyBUT0RPOiByZXR1cm4gYnl0ZWxlbmd0aD8gaXQgbWF5IGJlIGRpZmZlcmVudCBmcm9tIHN0ci5sZW5ndGgqMlxuXHR9XG5cblx0ZGVjb2RlR2x5cGgob3B0aW9ucz17fSkge1xuXHRcdFxuXHRcdC8vY29uc3QgbWV0cmljcyA9IG9wdGlvbnMubWV0cmljcyA/PyBbMCwgMCwgMCwgMF07XG5cdFx0Y29uc3QgbWV0cmljcyA9IG9wdGlvbnMubWV0cmljcyA9PT0gdW5kZWZpbmVkID8gWzAsIDAsIDAsIDBdIDogb3B0aW9ucy5tZXRyaWNzO1xuXHRcdGNvbnN0IGdseXBoID0gb3B0aW9ucy5sZW5ndGggPyBuZXcgU2Ftc2FHbHlwaCh0aGlzLmRlY29kZShGT1JNQVRTLkdseXBoSGVhZGVyKSkgOiBuZXcgU2Ftc2FHbHlwaCgpO1xuXHRcdGlmIChvcHRpb25zLmlkKVxuXHRcdFx0Z2x5cGguaWQgPSBvcHRpb25zLmlkO1xuXG5cdFx0Ly8gc2V0IG1ldHJpY3MgZnJvbSB0aGUgZm9udOKAmXMgaG10eFxuXHRcdGdseXBoLmZvbnQgPSBvcHRpb25zLmZvbnQ7XG5cdFx0aWYgKGdseXBoLmZvbnQuaG10eClcdHtcblx0XHRcdG1ldHJpY3NbMV0gPSBnbHlwaC5mb250LmhtdHhbZ2x5cGguaWRdO1xuXHRcdH1cblxuXHRcdC8vIHNpbXBsZSBnbHlwaFxuXHRcdGlmIChnbHlwaC5udW1iZXJPZkNvbnRvdXJzID4gMCkge1xuXG5cdFx0XHRnbHlwaC5lbmRQdHMgPSBbXTtcblxuXHRcdFx0Ly8gZW5kIHBvaW50cyBvZiBlYWNoIGNvbnRvdXJcblx0XHRcdGZvciAobGV0IGM9MDsgYzxnbHlwaC5udW1iZXJPZkNvbnRvdXJzOyBjKyspIHtcblx0XHRcdFx0Z2x5cGguZW5kUHRzLnB1c2godGhpcy51MTYpO1xuXHRcdFx0fVxuXHRcdFx0Z2x5cGgubnVtUG9pbnRzID0gZ2x5cGguZW5kUHRzW2dseXBoLm51bWJlck9mQ29udG91cnMgLTFdICsgMTtcblxuXHRcdFx0Ly8gaW5zdHJ1Y3Rpb25zIChza2lwKVxuXHRcdFx0dGhpcy5zZWVrcihnbHlwaC5pbnN0cnVjdGlvbkxlbmd0aCA9IHRoaXMudTE2KTtcblxuXHRcdFx0Ly8gZmxhZ3Ncblx0XHRcdGNvbnN0IGZsYWdzID0gW107XG5cdFx0XHRmb3IgKGxldCBwdD0wOyBwdDxnbHlwaC5udW1Qb2ludHM7ICkge1xuXHRcdFx0XHRsZXQgZmxhZyA9IHRoaXMudTg7XG5cdFx0XHRcdGZsYWdzW3B0KytdID0gZmxhZztcblx0XHRcdFx0aWYgKGZsYWcgJiAweDA4KSB7XG5cdFx0XHRcdFx0Y29uc3QgcmVwZWF0ID0gdGhpcy51ODtcblx0XHRcdFx0XHRmb3IgKGxldCByPTA7IHI8cmVwZWF0OyByKyspIFxuXHRcdFx0XHRcdFx0ZmxhZ3NbcHQrK10gPSBmbGFnO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIHBvaW50c1xuXHRcdFx0Y29uc29sZS5hc3NlcnQoZmxhZ3MubGVuZ3RoID09PSBnbHlwaC5udW1Qb2ludHMsIFwiRXJyb3IgaW4gZ2x5cGggZGVjb2Rpbmc6IGZsYWdzLmxlbmd0aCAoJWkpICE9IGdseXBoLm51bVBvaW50cyAoJWkpXCIsIGZsYWdzLmxlbmd0aCwgZ2x5cGgubnVtUG9pbnRzKTtcblx0XHRcdGxldCB4Xz0wLCB5Xz0wLCB4LCB5O1xuXHRcdFx0ZmxhZ3MuZm9yRWFjaCgoZmxhZyxmKSA9PiB7XG5cdFx0XHRcdC8vIGNvbnN0IG1hc2sgPSBmbGFnICYgMHgxMjtcblx0XHRcdFx0Ly8geCArPSAobWFzayA9PSAweDEyID8gdGhpcy51OCA6IChtYXNrID09IDB4MDIgPyAtdGhpcy51OCA6IChtYXNrID09IDB4MDAgPyB0aGlzLmkxNiA6IDApKSk7XG5cdFx0XHRcdC8vIGdseXBoLnBvaW50c1tmXSA9IFt4LCAwLCBmbGFnICYgMHgwMV07XG5cblx0XHRcdFx0c3dpdGNoIChmbGFnICYgMHgxMikgeyAvLyB4XG5cdFx0XHRcdFx0Y2FzZSAweDAwOiB4ID0geF8gKyB0aGlzLmkxNjsgYnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAweDAyOiB4ID0geF8gLSB0aGlzLnU4OyBicmVhaztcblx0XHRcdFx0XHRjYXNlIDB4MTA6IHggPSB4XzsgYnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAweDEyOiB4ID0geF8gKyB0aGlzLnU4OyBicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHR4XyA9IHg7XG5cdFx0XHRcdGdseXBoLnBvaW50c1tmXSA9IFt4LCAwLCBmbGFnICYgMHgwMV07XG5cdFx0XHR9KTtcblx0XHRcdGZsYWdzLmZvckVhY2goKGZsYWcsZikgPT4ge1xuXHRcdFx0XHRzd2l0Y2ggKGZsYWcgJiAweDI0KSB7IC8vIHlcblx0XHRcdFx0XHRjYXNlIDB4MDA6IHkgPSB5XyArIHRoaXMuaTE2OyBicmVhaztcblx0XHRcdFx0XHRjYXNlIDB4MDQ6IHkgPSB5XyAtIHRoaXMudTg7IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMHgyMDogeSA9IHlfOyBicmVhaztcblx0XHRcdFx0XHRjYXNlIDB4MjQ6IHkgPSB5XyArIHRoaXMudTg7IGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHlfID0geTtcblx0XHRcdFx0Z2x5cGgucG9pbnRzW2ZdWzFdID0geTtcblx0XHRcdH0pO1xuXHRcdH1cblx0XHRcblx0XHQvLyBjb21wb3NpdGUgZ2x5cGhcblx0XHQvLyAtIHdlIERPIGFkZCBwb2ludHMgZm9yIGNvbXBvc2l0ZSBnbHlwaHM6IG9uZSBwZXIgY29tcG9uZW50ICh0aGV5IGFyZSB0aGUgeCBhbmQgeSBvZmZzZXRzKSwgYW5kIHRoZSA0IGV4dHJhIG1ldHJpY3MgcG9pbnRzXG5cdFx0Ly8gLSB3aGVuIHdlIHByb2Nlc3MgdGhlc2UgZ2x5cGhzLCB3ZSBsb29rIGF0IGdseXBoLm51bWJlck9mQ29udG91cnMgYW5kIGdseXBoLnBvaW50cywgYnV0IE5PVCBnbHlwaC5udW1Qb2ludHNcblx0XHRlbHNlIGlmIChnbHlwaC5udW1iZXJPZkNvbnRvdXJzIDwgMCkge1xuXG5cdFx0XHRnbHlwaC5jb21wb25lbnRzID0gW107XG5cdFx0XHRsZXQgZmxhZztcblxuXHRcdFx0ZG8gIHtcblx0XHRcdFx0Y29uc3QgY29tcG9uZW50ID0ge307XG5cdFx0XHRcdGZsYWcgPSBjb21wb25lbnQuZmxhZ3MgPSB0aGlzLnUxNjtcblx0XHRcdFx0Y29tcG9uZW50LmdseXBoSWQgPSB0aGlzLnUxNjtcblxuXHRcdFx0XHQvLyBvZmZzZXRzIGFuZCBtYXRjaGVkIHBvaW50cyAoQVJHU19BUkVfWFlfVkFMVUVTLCBBUkdfMV9BTkRfMl9BUkVfV09SRFMpXG5cdFx0XHRcdHN3aXRjaCAoZmxhZyAmIDB4MDAwMykge1xuXHRcdFx0XHRcdGNhc2UgMHgwMDAzOiBjb21wb25lbnQub2Zmc2V0ID0gW3RoaXMuaTE2LCB0aGlzLmkxNl07IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMHgwMDAyOiBjb21wb25lbnQub2Zmc2V0ID0gW3RoaXMuaTgsIHRoaXMuaThdOyBicmVhaztcblx0XHRcdFx0XHRjYXNlIDB4MDAwMTogY29tcG9uZW50Lm1hdGNoZWRQb2ludHMgPSBbdGhpcy51MTYsIHRoaXMudTE2XTsgYnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAweDAwMDA6IGNvbXBvbmVudC5tYXRjaGVkUG9pbnRzID0gW3RoaXMudTgsIHRoaXMudThdOyBicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIHRoaXMgaXMgY29vbCwgd2Ugc3RvcmUgdGhlIG9mZnNldCBhcyBpdCB3YXMgYSBwb2ludCwgdGhlbiB3ZSBjYW4gdHJlYXQgaXQgYXMgYSBwb2ludCB3aGVuIGFjdGVkIG9uIGJ5IHRoZSB0dnRzXG5cdFx0XHRcdC8vIC0gSSB0aGluayB3ZSBzaG91bGQgcHVzaCB6ZXJvZXMgaWYgbWF0Y2hlZFBvaW50c1xuXHRcdFx0XHRpZiAoY29tcG9uZW50Lm9mZnNldCkge1xuXHRcdFx0XHRcdGdseXBoLnBvaW50cy5wdXNoKCBbY29tcG9uZW50Lm9mZnNldFswXSwgY29tcG9uZW50Lm9mZnNldFsxXSwgMF0gKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRnbHlwaC5wb2ludHMucHVzaCggWzAsMCwwXSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gdHJhbnNmb3JtYXRpb24gbWF0cml4IChpZiBjb21wb25lbnQudHJhbnNmb3JtIGlzIHVuZGVmaW5lZCwgdGhlIG1hdHJpeCBpcyBbMSwgMCwgMCwgMV0pOiBjaGVjayBiaXRzIDB4MDAwOCwgMHgwMDQwLCAweDAwODBcblx0XHRcdFx0c3dpdGNoIChmbGFnICYgMHgwMGM4KSB7XG5cdFx0XHRcdFx0Y2FzZSAweDAwMDg6IGNvbnN0IHNjYWxlID0gdGhpcy5mMjE0OyBjb21wb25lbnQudHJhbnNmb3JtID0gW3NjYWxlLCAwLCAwLCBzY2FsZV07IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMHgwMDQwOiBjb21wb25lbnQudHJhbnNmb3JtID0gW3RoaXMuZjIxNCwgMCwgMCwgdGhpcy5mMjE0XTsgYnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAweDAwODA6IGNvbXBvbmVudC50cmFuc2Zvcm0gPSBbdGhpcy5mMjE0LCB0aGlzLmYyMTQsIHRoaXMuZjIxNCwgdGhpcy5mMjE0XTsgYnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBzdG9yZSBjb21wb25lbnRcblx0XHRcdFx0Z2x5cGguY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG5cblx0XHRcdH0gd2hpbGUgKGZsYWcgJiAweDAwMjApOyAvLyBNT1JFX0NPTVBPTkVOVFNcblxuXHRcdFx0Ly8gc2tpcCBvdmVyIGNvbXBvc2l0ZSBpbnN0cnVjdGlvbnNcblx0XHRcdGlmIChmbGFnICYgMHgwMTAwKSB7IC8vIFdFX0hBVkVfSU5TVFJcblx0XHRcdFx0dGhpcy5zZWVrcihnbHlwaC5pbnN0cnVjdGlvbkxlbmd0aCA9IHRoaXMudTE2KTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gcHJldGVuZCB0aGVzZSBhcmUgcG9pbnRzIHNvIHRoZXkgY2FuIGJlIHByb2Nlc3NlZCBieSB2YXJpYXRpb25zXG5cdFx0XHRnbHlwaC5udW1Qb2ludHMgPSBnbHlwaC5wb2ludHMubGVuZ3RoOyAvLyBubyBtZXRyaWNzIHBvaW50cyB5ZXRcblx0XHR9XG5cblx0XHQvLyBUT0RPOiBmaXggdGhlIG1ldHJpY3MgcG9pbnRzXG5cdFx0Ly8gZ2x5cGgucG9pbnRzW2dseXBoLm51bVBvaW50c10gICA9IFttZXRyaWNzWzBdID8/IDAsICAgICAgICAgICAgICAgMCwgMF07IC8vIEg6IExlZnQgc2lkZSBiZWFyaW5nIHBvaW50XG5cdFx0Ly8gZ2x5cGgucG9pbnRzW2dseXBoLm51bVBvaW50cysxXSA9IFttZXRyaWNzWzFdID8/IDAsICAgICAgICAgICAgICAgMCwgMF07IC8vIEg6IFJpZ2h0IHNpZGUgYmVhcmluZyBwb2ludFxuXHRcdC8vIGdseXBoLnBvaW50c1tnbHlwaC5udW1Qb2ludHMrMl0gPSBbICAgICAgICAgICAgICAwLCBtZXRyaWNzWzJdID8/IDAsIDBdOyAvLyBWOiBUb3Agc2lkZSBiZWFyaW5nIHBvaW50XG5cdFx0Ly8gZ2x5cGgucG9pbnRzW2dseXBoLm51bVBvaW50cyszXSA9IFsgICAgICAgICAgICAgIDAsIG1ldHJpY3NbM10gPz8gMCwgMF07IC8vIFY6IEJvdHRvbSBzaWRlIGJlYXJpbmcgcG9pbnRcblx0XHRnbHlwaC5wb2ludHNbZ2x5cGgubnVtUG9pbnRzXSAgID0gW21ldHJpY3NbMF0gPyBtZXRyaWNzWzBdIDogMCwgICAgICAgICAgICAgICAwLCAwXTsgLy8gSDogTGVmdCBzaWRlIGJlYXJpbmcgcG9pbnRcblx0XHRnbHlwaC5wb2ludHNbZ2x5cGgubnVtUG9pbnRzKzFdID0gW21ldHJpY3NbMV0gPyBtZXRyaWNzWzFdIDogMCwgICAgICAgICAgICAgICAwLCAwXTsgLy8gSDogUmlnaHQgc2lkZSBiZWFyaW5nIHBvaW50XG5cdFx0Z2x5cGgucG9pbnRzW2dseXBoLm51bVBvaW50cysyXSA9IFsgICAgICAgICAgICAgIDAsIG1ldHJpY3NbMl0gPyBtZXRyaWNzWzJdIDogMCwgMF07IC8vIFY6IFRvcCBzaWRlIGJlYXJpbmcgcG9pbnRcblx0XHRnbHlwaC5wb2ludHNbZ2x5cGgubnVtUG9pbnRzKzNdID0gWyAgICAgICAgICAgICAgMCwgbWV0cmljc1szXSA/IG1ldHJpY3NbM10gOiAwLCAwXTsgLy8gVjogQm90dG9tIHNpZGUgYmVhcmluZyBwb2ludFxuXHRcblx0XHRyZXR1cm4gZ2x5cGg7XG5cdH1cblxuXHRlbmNvZGVHbHlwaChnbHlwaCwgb3B0aW9ucyA9IHt9KSB7XG5cdFx0Ly8gRW5jb2RlIGEgZ2x5cGggaW50byBhIFNhbXNhQnVmZmVyXG5cdFx0Ly9cblx0XHQvLyBnbHlwaDpcblx0XHQvLyAtIGEgU2Ftc2FHbHlwaCBvYmplY3Rcblx0XHQvL1xuXHRcdC8vIG9wdGlvbnM6XG5cdFx0Ly8gLSBiYm94OiB0cnVlID0gcmVjYWxjdWxhdGUgdGhlIGJvdW5kaW5nIGJveCBvZiB0aGUgZ2x5cGggKGRlZmF1bHQpLCBmYWxzZSA9IGRvbuKAmXQgcmVjYWxjdWxhdGVcblx0XHQvLyAtIGNvbXByZXNzaW9uOiAwID0gZG9u4oCZdCBjb21wcmVzcyAoZmFzdGVyKSwgMSA9IGNvbXByZXNzIHRoZSBnbHlwaCAoc2xvd2VyLCBkZWZhdWx0KSwgMiA9IFdPRkYyIGNvbXByZXNzaW9uIChub3QgaW1wbGVtZW50ZWQpXG5cdFx0Ly8gLSBtZXRyaWNzOiBpbnRlZ2VyIGFycmF5IHRoYXQgcmVjZWl2ZXMgdGhlIDQgbWV0cmljcyBwb2ludHMgYWZ0ZXIgdGhlIG1haW4gcG9pbnRzIChpZiBhYnNlbnQsIHRoZXNlIGFyZSBub3Qgd3JpdHRlbilcblx0XHQvLyAtIG92ZXJsYXBTaW1wbGU6IHRydWUgPSBmbGFnIHRoZSBmaXJzdCBwb2ludCBvZiBhIHNpbXBsZSBnbHlwaCBhcyBvdmVybGFwcGluZyAoZm9yIEFwcGxlIGZvbnRzKSwgZmFsc2UgPSBkb27igJl0IGZsYWcgKGRlZmF1bHQpXG5cdFx0Ly8gLSBiaWdlbmRpYW46IHRydWUgPSB0aGUgbWV0aG9kIGlzIGFsbG93ZWQgdG8gdXNlIEludDE2QXJyYXksIFVJbnQxNkFycmF5LCBJbnQzMkFycmF5LCBVSW50MzJBcnJheSwgZXRjLiBmb3Igc3BlZWRcblx0XHQvLyAtIGdldE1heENvbXBpbGVkU2l6ZTogdHJ1ZSA9IHJldHVybiB0aGUgbWF4aW11bSBzaXplIG9mIHRoZSBjb21waWxlZCBnbHlwaCAobm8gY29tcGlsYXRpb24pXG5cdFx0Ly9cblx0XHQvLyByZXR1cm4gdmFsdWU6XG5cdFx0Ly8gLSBzaXplIG9mIHRoZSBjb21waWxlZCBnbHlwaCBpbiBieXRlcyAod2l0aG91dCBwYWRkaW5nKVxuXHRcdC8vIC0gbWF4aW11bSBzaXplIG9mIHRoZSBjb21waWxlZCBnbHlwaCBpbiBieXRlcyAod2l0aG91dCBwYWRkaW5nKSBpZiBvcHRpb25zLmdldE1heENvbXBpbGVkU2l6ZVxuXG5cdFx0Ly8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuXHRcdGlmIChvcHRpb25zLmNvbXByZXNzaW9uID09PSB1bmRlZmluZWQpXG5cdFx0XHRvcHRpb25zLmNvbXByZXNzaW9uID0gMTsgLy8gc3RhbmRhcmQgVHJ1ZVR5cGUgY29tcHJlc3Npb25cblx0XHRpZiAob3B0aW9ucy5iYm94ID09PSB1bmRlZmluZWQpXG5cdFx0XHRvcHRpb25zLmJib3ggPSB0cnVlOyAvLyByZWNhbGN1bGF0ZSBib3VuZGluZyBib3hcblxuXHRcdGlmIChvcHRpb25zLmdldE1heENvbXBpbGVkU2l6ZSkge1xuXHRcdFx0aWYgKG9wdGlvbnMuY29tcHJlc3Npb24gPT0gMikge1xuXHRcdFx0XHRpZiAoZ2x5cGgubnVtYmVyT2ZDb250b3VycyA+IDApXG5cdFx0XHRcdFx0cmV0dXJuIFxuXHRcdFx0XHRlbHNlIGlmIChnbHlwaC5udW1iZXJPZkNvbnRvdXJzIDwgMClcblx0XHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHJldHVybiAwO1x0XHRcdFx0XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoZ2x5cGgubnVtYmVyT2ZDb250b3VycyA+IDApXG5cdFx0XHRcdFx0cmV0dXJuICg1KjIpICsgZ2x5cGgubnVtYmVyT2ZDb250b3VycyoyICsgMiArIGdseXBoLmluc3RydWN0aW9uTGVuZ3RoICsgZ2x5cGgubnVtUG9pbnRzICogKDIrMisxKTtcblx0XHRcdFx0ZWxzZSBpZiAoZ2x5cGgubnVtYmVyT2ZDb250b3VycyA8IDApXG5cdFx0XHRcdFx0cmV0dXJuICg1KjIpICsgKDQrNCkqMiAqIGdseXBoLmNvbXBvbmVudHMubGVuZ3RoICsgMiArIGdseXBoLmluc3RydWN0aW9uTGVuZ3RoO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Y29uc3QgcG9pbnRzID0gZ2x5cGgucG9pbnRzO1xuXHRcdGNvbnN0IG51bVBvaW50cyA9IGdseXBoLm51bVBvaW50cztcblx0XHRjb25zdCB0ZWxsID0gdGhpcy50ZWxsKCk7XG5cdFxuXHRcdC8vIDEuIFNJTVBMRSBnbHlwaFxuXHRcdGlmIChnbHlwaC5udW1iZXJPZkNvbnRvdXJzID4gMCkge1xuXHRcblx0XHRcdGxldCBpbnN0cnVjdGlvbkxlbmd0aCA9IDA7XG5cdFxuXHRcdFx0Ly8gcmVjYWxjdWxhdGUgYmJveFxuXHRcdFx0aWYgKG9wdGlvbnMuYmJveCkge1xuXHRcdFx0XHRpZiAocG9pbnRzICYmIHBvaW50c1swXSkge1xuXHRcdFx0XHRcdGxldCB4TWluLCB4TWF4LCB5TWluLCB5TWF4O1xuXHRcdFx0XHRcdFt4TWluLHlNaW5dID0gW3hNYXgseU1heF0gPSBwb2ludHNbMF07XG5cdFx0XHRcdFx0Zm9yIChwdD0xOyBwdDxudW1Qb2ludHM7IHB0KyspIHtcblx0XHRcdFx0XHRcdGNvbnN0IFAgPSBwb2ludHNbcHRdWzBdLCBRID0gcG9pbnRzW3B0XVsxXTtcblx0XHRcdFx0XHRcdGlmIChQPHhNaW4pXG5cdFx0XHRcdFx0XHRcdHhNaW49UDtcblx0XHRcdFx0XHRcdGVsc2UgaWYgKFA+eE1heClcblx0XHRcdFx0XHRcdFx0eE1heD1QO1xuXHRcdFx0XHRcdFx0aWYgKFE8eU1pbilcblx0XHRcdFx0XHRcdFx0eU1pbj1RO1xuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoUT55TWF4KVxuXHRcdFx0XHRcdFx0XHR5TWF4PVE7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGdseXBoLnhNaW4gPSBNYXRoLmZsb29yKHhNaW4pOyAvLyByb3VuZGluZyBpcyBpbiBjYXNlIHRoZSBwb2ludHMgYXJlIG5vdCBpbnRlZ2VycywgdGhhbmtzIHRvIHZhcmlhdGlvbnMgb3IgdHJhbnNmb3Jtc1xuXHRcdFx0XHRcdGdseXBoLnlNaW4gPSBNYXRoLmZsb29yKHlNaW4pO1xuXHRcdFx0XHRcdGdseXBoLnhNYXggPSBNYXRoLmNlaWwoeE1heCk7XG5cdFx0XHRcdFx0Z2x5cGgueU1heCA9IE1hdGguY2VpbCh5TWF4KTtcblx0XHRcdFx0XHQvLyBUT0RPOiBjb25zaWRlciB0aGF0LCBpZiB0aGlzIGdseXBoIGlzIGZyb20gYSBub24tZGVmYXVsdCBpbnN0YW5jZSwgdGhlc2UgdmFsdWVzIHdpbGwgaW4gZ2VuZXJhbCBub3QgYmUgaW50ZWdlcnNcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBjb21wcmVzc2lvbjogV09GRjIgbWV0aG9kXG5cdFx0XHRpZiAob3B0aW9ucy5jb21wcmVzc2lvbiA9PSAyKSB7XG5cblx0XHRcdFx0Ly8gZG9jc1xuXHRcdFx0XHQvLyAtIGh0dHBzOi8vd3d3LnczLm9yZy9UUi9XT0ZGMi8jZ2x5Zl90YWJsZV9mb3JtYXRcblxuXHRcdFx0XHQvLyAtIGhlcmUsIHdlIHVzZSB0aGUgV09GRjIgbWV0aG9kIHRvIGVuY29kZSBmbGFncyBhbmQgY29vcmRpbmF0ZXM6XG5cdFx0XHRcdC8vIC0gbnVtYmVyT2ZDb250b3VycyBbVTE2XVxuXHRcdFx0XHQvLyAtIG5Qb2ludHMgW1UxNl1bbnVtYmVyT2ZDb250b3Vyc10gKG51bWJlciBvZiBwb2ludHMgaW4gZWFjaCBjb250b3VyKVxuXHRcdFx0XHQvLyAtIGZsYWdzIFtVOF1bbnVtUG9pbnRzXSAoMSBieXRlIHBlciBwb2ludCwgbnVtUG9pbnRzIGlzIHRvdGFsIG51bWJlciBvZiBwb2ludHMpXG5cdFx0XHRcdC8vIC0gcG9pbnRzIChjb29yZGluYXRlIGRhdGEpXG5cblxuXHRcdFx0XHQvLyB3cml0ZSBudW1iZXJPZkNvbnRvdXJzXG5cdFx0XHRcdHRoaXMudTE2ID0gZ2x5cGgubnVtYmVyT2ZDb250b3VycztcblxuXHRcdFx0XHQvLyB3cml0ZSBuUG9pbnRzIGFycmF5XG5cdFx0XHRcdGxldCBwcmV2RW5kUHQgPSAwO1xuXHRcdFx0XHR0aGlzLnBoYXNlID0gZmFsc2U7IC8vIHNldCB1cCBmb3IgbmliYmxlc1xuXHRcdFx0XHRmb3IgKGxldCBjPTA7IGM8Z2x5cGgubnVtYmVyT2ZDb250b3VyczsgYysrKSB7XG5cdFx0XHRcdFx0Y29uc3QgY29udG91ckxlbmd0aCA9IGdseXBoLmVuZFB0c1tjXSAtIHByZXZFbmRQdCArIDE7XG5cdFx0XHRcdFx0Y29uc3QgY2xOaWJibGUgPSBjb250b3VyTGVuZ3RoIC0gNDtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHQvLyB0aGlzIGlzIGEgY3VzdG9tIGVuY29kaW5nIHRvIHNhdmUgc3BhY2UgaW4gdGhlIGNvbnRvdXJMZW5ndGhzIGFycmF5XG5cdFx0XHRcdFx0Ly8gd3JpdGUgbmliYmxlcyBvZiBjb250b3VyTGVuZ3RoIC0gNCAoY29udG91ckxlbmd0aCA9PSAzIGlzIHJhcmU7IGNvbnRvdXJMZW5ndGggPT0gMiwgMSwgMCBzaG91bGQgbm90IGV4aXN0IGJ1dCB3ZSBzdGlsbCBoYW5kbGUgdGhlbSBpbmVmZmljaWVudGx5KVxuXHRcdFx0XHRcdC8vIC0gc28gd2UgaGFuZGxlIGNvbnRvdXJzIG9mIGxlbmd0aCA0IHRvIDE4IChpbmNsdXNpdmUpIGluIG9uZSBuaWJibGVcblx0XHRcdFx0XHRpZiAoY2xOaWJibGUgPj0gMCAmJiBjbE5pYmJsZSA8IDE1KSB7XG5cdFx0XHRcdFx0XHR0aGlzLnU0ID0gY2xOaWJibGU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhpcy51NCA9IDE1OyAvLyBkZWNsYXJhdGlvbiB0aGF0IHdlIHdpbGwgd3JpdGUgY29udG91ckxlbmd0aCBsaXRlcmFsbHkgaW4gMyBuaWJibGVzIChtdXN0IGJlIDwgNDA5Nilcblx0XHRcdFx0XHRcdHRoaXMudTQgPSBjb250b3VyTGVuZ3RoICYgMHgwZjAwID4+IDg7XG5cdFx0XHRcdFx0XHR0aGlzLnU0ID0gY29udG91ckxlbmd0aCAmIDB4MDBmMCA+PiA0O1xuXHRcdFx0XHRcdFx0dGhpcy51NCA9IGNvbnRvdXJMZW5ndGggJiAweDAwMGY7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly90aGlzLnUxNl8yNTUgPSBjb250b3VyTGVuZ3RoOyAvLyB3cml0ZSBVMTZfMjU1IGNvbXByZXNzZWQgc3RyZWFtIFtVMTZfMjU1IENPTVBSRVNTSU9OIE9GIGVuZFB0c11cblx0XHRcdFx0XHQvL3RoaXMudTE2ID0gZ2x5cGguZW5kUHRzW2NdIC0gcHJldkVuZFB0ICsgMTsgLy8gd3JpdGUgVTE2IFtOTyBDT01QUkVTU0lPTiBPRiBlbmRQdHNdXG5cblx0XHRcdFx0XHQvKlxuXHRcdFx0XHRcdC8vIGdldCBjb250b3VyTGVuZ3RocyBzdGF0c1xuXHRcdFx0XHRcdGlmIChjb250b3VyTGVuZ3Roc1tjb250b3VyTGVuZ3RoXSA9PT0gdW5kZWZpbmVkKVxuXHRcdFx0XHRcdFx0Y29udG91ckxlbmd0aHNbY29udG91ckxlbmd0aF0gPSAwO1xuXHRcdFx0XHRcdGVsc2UgXG5cdFx0XHRcdFx0XHRjb250b3VyTGVuZ3Roc1tjb250b3VyTGVuZ3RoXSsrO1xuXHRcdFx0XHRcdCovXG5cblx0XHRcdFx0XHRwcmV2RW5kUHQgPSBnbHlwaC5lbmRQdHNbY107XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBjb25jbHVkZSBuaWJibGluZ1xuXHRcdFx0XHRpZiAodGhpcy5waGFzZSkge1xuXHRcdFx0XHRcdHRoaXMudTQgPSAwO1xuXHRcdFx0XHRcdHRoaXMucGhhc2UgPSBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGFsbG9jYXRlIGZsYWdzIGFycmF5XG5cdFx0XHRcdGNvbnN0IGZBcnJheSA9IG5ldyBVaW50OEFycmF5KHRoaXMuYnVmZmVyLCB0aGlzLnAsIG51bVBvaW50cylcblx0XHRcdFx0dGhpcy5zZWVrcihudW1Qb2ludHMpXG5cblx0XHRcdFx0Ly8gd3JpdGUgcG9pbnQgY29vcmRpbmF0ZXNcblx0XHRcdFx0bGV0IHByZXZQdCA9IFswLDAsMV1cblx0XHRcdFx0Zm9yIChsZXQgcHQ9MDsgcHQ8Z2x5cGgubnVtUG9pbnRzOyBwdCsrKSB7XG5cdFxuXHRcdFx0XHRcdGNvbnN0IHBvaW50ID0gZ2x5cGgucG9pbnRzW3B0XVxuXHRcdFx0XHRcdGxldCBkeCA9IHBvaW50WzBdIC0gcHJldlB0WzBdLCBkeGEgPSBNYXRoLmFicyhkeClcblx0XHRcdFx0XHRsZXQgZHkgPSBwb2ludFsxXSAtIHByZXZQdFsxXSwgZHlhID0gTWF0aC5hYnMoZHkpXG5cdFx0XHRcdFx0bGV0IGZsYWdcblx0XG5cdFx0XHRcdFx0Ly8gdGhlcmUgYXJlIDUgdHlwZXMgb2YgZHgvZHkgY29tYm9cblx0XHRcdFx0XHQvLyAyICogOCA6IDItYnl0ZSBlbmNvZGluZ3Mgd2hlcmUgZHggPSAwIG9yIGR5ID0gMFxuXHRcdFx0XHRcdC8vIDQgKiA0IDogMi1ieXRlIGVuY29kaW5ncyBcblx0XHRcdFx0XHQvLyAzICogMyA6IDMtYnl0ZSBlbmNvZGluZ3Ncblx0XHRcdFx0XHQvLyA0ICAgICA6IDQtYnl0ZSBlbmNvZGluZ3Ncblx0XHRcdFx0XHQvLyA0ICAgICA6IDUtYnl0ZSBlbmNvZGluZ3Ncblx0XG5cdFx0XHRcdFx0Ly8gYnVja2V0cyAwLi45OiBkeD09MFxuXHRcdFx0XHRcdGlmIChkeGEgPT0gMCAmJiBkeWEgPCAxMjgwKSB7XG5cdFx0XHRcdFx0XHRmbGFnID0gMFxuXHRcdFx0XHRcdFx0ZmxhZyArPSAyICogTWF0aC5mbG9vcihkeWEgLyAyNTYpXG5cdFx0XHRcdFx0XHRpZiAoZHkgPiAwKVxuXHRcdFx0XHRcdFx0XHRmbGFnKytcblx0XHRcdFx0XHRcdHRoaXMudTggPSBkeWEgJSAyNTYgLy8gd3JpdGUgY29vcmQgZGF0YSAoMSBieXRlKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvLyBidWNrZXRzIDEwLi4xOTogZHk9PTBcblx0XHRcdFx0XHRlbHNlIGlmIChkeWEgPT0gMCAmJiBkeGEgPCAxMjgwKSB7XG5cdFx0XHRcdFx0XHRmbGFnID0gMTBcblx0XHRcdFx0XHRcdGZsYWcgKz0gMiAqIE1hdGguZmxvb3IoZHhhIC8gMjU2KVxuXHRcdFx0XHRcdFx0aWYgKGR4ID4gMClcblx0XHRcdFx0XHRcdFx0ZmxhZysrXHRcblx0XHRcdFx0XHRcdHRoaXMudTggPSBkeGEgJSAyNTYgLy8gd3JpdGUgY29vcmQgZGF0YSAoMSBieXRlKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvLyBidWNrZXRzIDIwLi44MzogZHggYW5kIGR5IGFyZSBmYWlybHkgc2hvcnRcblx0XHRcdFx0XHRlbHNlIGlmIChkeGEgPD0gNjQgJiYgZHlhIDw9IDY0KSB7IC8vIHdlIGNhbiB1c2UgbmliYmxlcyBmb3IgZHggYW5kIGR5LCBzbyAxIGJ5dGVcblx0XHRcdFx0XHRcdGZsYWcgPSAyMFxuXHRcdFx0XHRcdFx0ZmxhZyArPSAxNiAqIE1hdGguZmxvb3IoKGR4YS0xKSAvIDE2KVxuXHRcdFx0XHRcdFx0ZmxhZyArPSA0ICogTWF0aC5mbG9vcigoZHlhLTEpIC8gMTYpXG5cdFx0XHRcdFx0XHRpZiAoZHggPiAwKVxuXHRcdFx0XHRcdFx0XHRmbGFnKytcblx0XHRcdFx0XHRcdGlmIChkeSA+IDApXG5cdFx0XHRcdFx0XHRcdGZsYWcgKz0gMlxuXHRcdFx0XHRcdFx0bGV0IG5pYnggPSAoKGR4YS0xKSAlIDE2KVxuXHRcdFx0XHRcdFx0bGV0IG5pYnkgPSAoKGR5YS0xKSAlIDE2KVxuXHRcdFx0XHRcdFx0dGhpcy51OCA9IChuaWJ4IDw8IDQpIHwgbmlieSAvLyB3cml0ZSBjb29yZCBkYXRhICgxIGJ5dGUpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIGJ1Y2tldHMgODQuLjExOTogZHggYW5kIGR5IGFyZSBub3QgcXVpdGUgc28gc2hvcnRcblx0XHRcdFx0XHRlbHNlIGlmIChkeGEgPD0gNzY4ICYmIGR5YSA8PSA3NjgpIHsgLy8gd2UgY2FuIHVzZSAxIGJ5dGUgZm9yIGR4LCAxIGJ5dGUgZm9yIGR5XG5cdFx0XHRcdFx0XHRmbGFnID0gODRcblx0XHRcdFx0XHRcdGZsYWcgKz0gMTIgKiBNYXRoLmZsb29yKChkeGEtMSkgLyAyNTYpXG5cdFx0XHRcdFx0XHRmbGFnICs9IDQgKiBNYXRoLmZsb29yKChkeWEtMSkgLyAyNTYpXG5cdFx0XHRcdFx0XHRpZiAoZHggPiAwKVxuXHRcdFx0XHRcdFx0XHRmbGFnKytcblx0XHRcdFx0XHRcdGlmIChkeSA+IDApXG5cdFx0XHRcdFx0XHRcdGZsYWcgKz0gMlxuXHRcdFx0XHRcdFx0dGhpcy51OCA9IChkeGEtMSkgJSAyNTYgLy8gd3JpdGUgeCBjb29yZCBkYXRhICgxIGJ5dGUpXG5cdFx0XHRcdFx0XHR0aGlzLnU4ID0gKGR5YS0xKSAlIDI1NiAvLyB3cml0ZSB5IGNvb3JkIGRhdGEgKDEgYnl0ZSlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gYnVja2V0cyAxMjAuLjEyM1xuXHRcdFx0XHRcdGVsc2UgaWYgKGR4YSA8IDQwOTYgJiYgZHlhIDwgNDA5Nikge1xuXHRcdFx0XHRcdFx0ZmxhZyA9IDEyMFxuXHRcdFx0XHRcdFx0aWYgKGR4ID4gMClcblx0XHRcdFx0XHRcdFx0ZmxhZysrXG5cdFx0XHRcdFx0XHRpZiAoZHkgPiAwKVxuXHRcdFx0XHRcdFx0XHRmbGFnICs9IDJcblx0XHRcdFx0XHRcdHRoaXMudTE2ID0gZHhhIDw8IDQgfCBkeWEgPj4gOFxuXHRcdFx0XHRcdFx0dGhpcy51OCA9IGR5YSAlIDI1NlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvLyBidWNrZXRzIDEyNC4uMTI3XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRmbGFnID0gMTI0XG5cdFx0XHRcdFx0XHRpZiAoZHggPiAwKVxuXHRcdFx0XHRcdFx0XHRmbGFnKytcblx0XHRcdFx0XHRcdGlmIChkeSA+IDApXG5cdFx0XHRcdFx0XHRcdGZsYWcgKz0gMlxuXHRcdFx0XHRcdFx0dGhpcy51MTYgPSBkeGFcblx0XHRcdFx0XHRcdHRoaXMudTE2ID0gZHlhXG5cdFx0XHRcdFx0fVxuXHRcblx0XHRcdFx0XHQvLyBpcyB0aGUgcG9pbnQgb2ZmLWN1cnZlPyBpZiBzbywgc2V0IHRoZSBmbGFn4oCZcyBtb3N0IHNpZ25pZmljYW50IGJpdFxuXHRcdFx0XHRcdGlmIChwb2ludFsyXSA9PSAwKVxuXHRcdFx0XHRcdFx0ZmxhZyB8PSAweDgwXG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Ly8gd3JpdGUgdGhlIGZsYWcgaW50byB0aGUgZmxhZyBhcnJheVxuXHRcdFx0XHRcdGZBcnJheVtwdF0gPSBmbGFnXG5cdFxuXHRcdFx0XHRcdC8vIHVwZGF0ZSBwcmV2UHRcblx0XHRcdFx0XHRwcmV2UHQgPSBwb2ludFxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGVsc2Uge1xuXG5cdFx0XHRcdC8vIG9wdGlvbnMuY29tcHJlc3Npb24gIT0gMlxuXHRcdFx0XHRsZXQgcHQ7XG5cblx0XHRcdFx0Ly8gbmV3IGhlYWRlciB3aXRoIGJib3hcblx0XHRcdFx0dGhpcy5lbmNvZGUoRk9STUFUUy5HbHlwaEhlYWRlciwgZ2x5cGgpO1xuXHRcdFxuXHRcdFx0XHQvLyBlbmRwb2ludHNcblx0XHRcdFx0Z2x5cGguZW5kUHRzLmZvckVhY2goZW5kUHQgPT4ge1xuXHRcdFx0XHRcdHRoaXMudTE2ID0gZW5kUHQ7XG5cdFx0XHRcdH0pO1xuXHRcdFxuXHRcdFx0XHQvLyBpbnN0cnVjdGlvbnMgKG5vbmUgZm9yIG5vdylcblx0XHRcdFx0dGhpcy51MTYgPSBpbnN0cnVjdGlvbkxlbmd0aDtcblx0XHRcdFx0dGhpcy5zZWVrcihpbnN0cnVjdGlvbkxlbmd0aCk7XG5cdFx0XG5cdFx0XHRcdC8vIHdyaXRlIGdseXBoIHBvaW50c1xuXG5cdFx0XHRcdC8vIGNvbXByZXNzaW9uOiBub25lXG5cdFx0XHRcdGlmIChvcHRpb25zLmNvbXByZXNzaW9uID09IDApIHtcblxuXHRcdFx0XHRcdC8vIHdyaXRlIHVuY29tcHJlc3NlZCBnbHlwaCBwb2ludHMgKGZhc3RlciBpbiBtZW1vcnkgYW5kIGZvciBTU0QgZGlza3MpXG5cdFx0XHRcdFx0bGV0IGN4PTA7XG5cdFx0XHRcdFx0bGV0IGN5PTA7XG5cblx0XHRcdFx0XHRpZiAob3B0aW9ucy5iaWdlbmRpYW4pIHtcblx0XHRcdFx0XHRcdC8vIEludDE2QXJyYXkgbWV0aG9kXG5cdFx0XHRcdFx0XHQvLyAtIGEgYml0IGZhc3RlciwgYnV0IGRvZXMgbm90IHdvcmsgb24gTEUgcGxhdGZvcm1zIHN1Y2ggYXMgTWFjIE0xXG5cdFx0XHRcdFx0XHRjb25zdCBmQXJyYXkgPSBuZXcgVWludDhBcnJheSh0aGlzLCB0aGlzLnApO1xuXHRcdFx0XHRcdFx0ZkFycmF5WzBdID0gcG9pbnRzWzBdWzJdICYgKG9wdGlvbnMub3ZlcmxhcFNpbXBsZSA/IDB4NDAgOiAweDAwKTsgLy8gZmlyc3QgYnl0ZSBtYXkgaGF2ZSBhbiBvdmVybGFwIGZsYWdcblx0XHRcdFx0XHRcdGZvciAocHQ9MTsgcHQ8bnVtUG9pbnRzOyBwdCsrKSB7XG5cdFx0XHRcdFx0XHRcdGZBcnJheVtwdF0gPSBwb2ludHNbcHRdWzJdO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRjb25zdCBwQXJyYXkgPSBuZXcgSW50MTZBcnJheSh0aGlzLCB0aGlzLnAgKyBudW1Qb2ludHMpOyAvLyBkYW5nZXJvdXMsIHNpbmNlIEludDE2QXJyYXkgdXNlcyBwbGF0Zm9ybSBieXRlIG9yZGVyIChNMSBNYWMgZG9lcylcblx0XHRcdFx0XHRcdGZvciAocHQ9MDsgcHQ8bnVtUG9pbnRzOyBwdCsrKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHggPSBwb2ludHNbcHRdWzBdO1xuXHRcdFx0XHRcdFx0XHRwQXJyYXlbcHRdID0geCAtIGN4O1xuXHRcdFx0XHRcdFx0XHRjeCA9IHg7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRmb3IgKHB0PTA7IHB0PG51bVBvaW50czsgcHQrKykge1x0XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHkgPSBwb2ludHNbcHRdWzFdO1xuXHRcdFx0XHRcdFx0XHRwQXJyYXlbbnVtUG9pbnRzK3B0XSA9IHkgLSBjeTtcblx0XHRcdFx0XHRcdFx0Y3kgPSB5O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dGhpcy5zZWVrcihudW1Qb2ludHMqNSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0Ly8gRGF0YVZpZXcgbWV0aG9kXG5cdFx0XHRcdFx0XHR0aGlzLnU4ID0gcG9pbnRzWzBdWzJdICYgKG9wdGlvbnMub3ZlcmxhcFNpbXBsZSA/IDB4NDAgOiAweDAwKTsgLy8gZmlyc3QgYnl0ZSBtYXkgaGF2ZSBhbiBvdmVybGFwIGZsYWdcblx0XHRcdFx0XHRcdGZvciAocHQ9MTsgcHQ8bnVtUG9pbnRzOyBwdCsrKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMudTggPSBwb2ludHNbcHRdWzJdOyAvLyB3cml0ZSAxIGJ5dGUgZm9yIGZsYWdcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Zm9yIChwdD0wOyBwdDxudW1Qb2ludHM7IHB0KyspIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgeCA9IHBvaW50c1twdF1bMF1cblx0XHRcdFx0XHRcdFx0dGhpcy5pMTYgPSB4IC0gY3g7IC8vIHdyaXRlIDIgYnl0ZXMgZm9yIGR4XG5cdFx0XHRcdFx0XHRcdGN4ID0geDtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Zm9yIChwdD0wOyBwdDxudW1Qb2ludHM7IHB0KyspIHtcdFxuXHRcdFx0XHRcdFx0XHRjb25zdCB5ID0gcG9pbnRzW3B0XVsxXTtcblx0XHRcdFx0XHRcdFx0dGhpcy5pMTYgPSB5IC0gY3k7IC8vIHdyaXRlIDIgYnl0ZXMgZm9yIGR5XG5cdFx0XHRcdFx0XHRcdGN5ID0geTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGNvbXByZXNzaW9uOiBzdGFuZGFyZCBUcnVlVHlwZSBjb21wcmVzc2lvblxuXHRcdFx0XHRlbHNlIGlmIChvcHRpb25zLmNvbXByZXNzaW9uID09IDEpIHtcblxuXHRcdFx0XHRcdC8vIHdyaXRlIGNvbXByZXNzZWQgZ2x5cGggcG9pbnRzIChzbG93ZXIpXG5cdFx0XHRcdFx0bGV0IGN4PTAsIGN5PTA7XG5cdFx0XHRcdFx0Y29uc3QgZHg9W10sIGR5PVtdLCBmbGFncz1bXTtcblx0XHRcdFxuXHRcdFx0XHRcdGZvciAocHQ9MDsgcHQ8bnVtUG9pbnRzOyBwdCsrKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBYID0gZHhbcHRdID0gTWF0aC5yb3VuZChwb2ludHNbcHRdWzBdKSAtIGN4O1xuXHRcdFx0XHRcdFx0Y29uc3QgWSA9IGR5W3B0XSA9IE1hdGgucm91bmQocG9pbnRzW3B0XVsxXSkgLSBjeTtcblx0XHRcdFx0XHRcdGxldCBmID0gcG9pbnRzW3B0XVsyXSAmIDB4YzE7IC8vIHByZXNlcnZlIGJpdHMgMCAob24tY3VydmUpLCA2IChvdmVybGFwcyksIDcgKHJlc2VydmVkKVxuXHRcdFx0XHRcdFx0aWYgKFg9PTApXG5cdFx0XHRcdFx0XHRcdGYgfD0gMHgxMDtcblx0XHRcdFx0XHRcdGVsc2UgaWYgKFggPj0gLTI1NSAmJiBYIDw9IDI1NSlcblx0XHRcdFx0XHRcdFx0ZiB8PSAoWCA+IDAgPyAweDEyIDogMHgwMik7XG5cdFx0XG5cdFx0XHRcdFx0XHRpZiAoWT09MClcblx0XHRcdFx0XHRcdFx0ZiB8PSAweDIwO1xuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoWSA+PSAtMjU1ICYmIFkgPD0gMjU1KVxuXHRcdFx0XHRcdFx0XHRmIHw9IChZID4gMCA/IDB4MjQgOiAweDA0KTtcblx0XHRcblx0XHRcdFx0XHRcdGZsYWdzW3B0XSA9IGY7XG5cdFx0XHRcdFx0XHRjeCA9IHBvaW50c1twdF1bMF07XG5cdFx0XHRcdFx0XHRjeSA9IHBvaW50c1twdF1bMV07XG5cdFx0XHRcdFx0fVxuXHRcdFxuXHRcdFx0XHRcdC8vIG92ZXJsYXAgc2lnbmFsIGZvciBBcHBsZVxuXHRcdFx0XHRcdGlmIChvcHRpb25zLm92ZXJsYXBTaW1wbGUpXG5cdFx0XHRcdFx0XHRmbGFnc1swXSB8PSAweDQwO1xuXHRcdFxuXHRcdFx0XHRcdC8vIHdyaXRlIGZsYWdzIHdpdGggUkxFXG5cdFx0XHRcdFx0bGV0IHJwdCA9IDA7XG5cdFx0XHRcdFx0Zm9yIChwdD0wOyBwdDxudW1Qb2ludHM7IHB0KyspIHtcblx0XHRcdFx0XHRcdGlmIChwdCA+IDAgJiYgcnB0IDwgMjU1ICYmIGZsYWdzW3B0XSA9PSBmbGFnc1twdC0xXSkge1xuXHRcdFx0XHRcdFx0XHRycHQrKztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRycHQgPSAwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFxuXHRcdFx0XHRcdFx0aWYgKHJwdDwyKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMudTggPSBmbGFnc1twdF07IC8vIHdyaXRlIHdpdGhvdXQgY29tcHJlc3Npb24gKGRvbuKAmXQgY29tcHJlc3MgMiBjb25zZWN1dGl2ZSBpZGVudGljYWwgYnl0ZXMpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgY3VycmVudFBvcyA9IHRoaXMudGVsbCgpO1xuXHRcdFx0XHRcdFx0XHRpZiAocnB0PT0yKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5zZWVrKGN1cnJlbnRQb3MtMik7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy51OCA9IGZsYWdzW3B0XSB8IDB4MDg7IC8vIHNldCByZXBlYXQgYml0IG9uIHRoZSBwcmUtcHJldmlvdXMgZmxhZyBieXRlXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0dGhpcy5zZWVrKGN1cnJlbnRQb3MtMSk7XG5cdFx0XHRcdFx0XHRcdHRoaXMudTggPSBycHQ7IC8vIHdyaXRlIHRoZSBudW1iZXIgb2YgcmVwZWF0c1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcblx0XHRcdFx0XHQvLyB3cml0ZSBwb2ludCBjb29yZGluYXRlc1xuXHRcdFx0XHRcdGZvciAocHQ9MDsgcHQ8bnVtUG9pbnRzOyBwdCsrKSB7XG5cdFx0XHRcdFx0XHRpZiAoZHhbcHRdID09IDApXG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0aWYgKGR4W3B0XSA+PSAtMjU1ICYmIGR4W3B0XSA8PSAyNTUpXG5cdFx0XHRcdFx0XHRcdHRoaXMudTggPSAoZHhbcHRdPjApID8gZHhbcHRdIDogLWR4W3B0XTtcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0dGhpcy5pMTYgPSBkeFtwdF07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGZvciAocHQ9MDsgcHQ8bnVtUG9pbnRzOyBwdCsrKSB7XG5cdFx0XHRcdFx0XHRpZiAoZHlbcHRdID09IDApXG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0aWYgKGR5W3B0XSA+PSAtMjU1ICYmIGR5W3B0XSA8PSAyNTUpXG5cdFx0XHRcdFx0XHRcdHRoaXMudTggPSAoZHlbcHRdPjApID8gZHlbcHRdIDogLWR5W3B0XTtcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0dGhpcy5pMTYgPSBkeVtwdF07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHR9IC8vIHNpbXBsZSBnbHlwaCBlbmRcblx0XG5cdFx0Ly8gMi4gQ09NUE9TSVRFIGdseXBoXG5cdFx0ZWxzZSBpZiAoZ2x5cGgubnVtYmVyT2ZDb250b3VycyA8IDApIHtcblxuXHRcdFx0Ly8gZ2x5cGggaGVhZGVyXG5cdFx0XHR0aGlzLmVuY29kZShGT1JNQVRTLkdseXBoSGVhZGVyLCBnbHlwaCk7IC8vIFRPRE86IHJlY2FsY3VsYXRlIGNvbXBvc2l0ZSBiYm94ICh0cmlja3kgaW4gZ2VuZXJhbCwgbm90IGJhZCBmb3Igc2ltcGxlIHRyYW5zbGF0aW9ucylcblx0XG5cdFx0XHQvLyBjb21wb25lbnRzXG5cdFx0XHRmb3IgKGxldCBjPTA7IGM8Z2x5cGguY29tcG9uZW50cy5sZW5ndGg7IGMrKykge1xuXHRcdFx0XHRsZXQgY29tcG9uZW50ID0gZ2x5cGguY29tcG9uZW50c1tjXTtcblx0XG5cdFx0XHRcdC8vIHNldCB1cCB0aGUgZmxhZ3Ncblx0XHRcdFx0bGV0IGZsYWdzID0gMDtcblx0XHRcdFx0aWYgKG9wdGlvbnMuY29tcHJlc3Npb24gPT0gMCkge1xuXHRcdFx0XHRcdGZsYWdzIHw9IDB4MDAwMTsgLy8gQVJHXzFfQU5EXzJfQVJFX1dPUkRTXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0aWYgKCAgIChjb21wb25lbnQub2Zmc2V0ICYmIChjb21wb25lbnQub2Zmc2V0WzBdIDwgLTEyOCB8fCBjb21wb25lbnQub2Zmc2V0WzBdID4gMTI3IHx8IGNvbXBvbmVudC5vZmZzZXRbMV0gPCAtMTI4IHx8IGNvbXBvbmVudC5vZmZzZXRbMV0gPiAxMjcpKVxuXHRcdFx0XHRcdFx0fHwgKGNvbXBvbmVudC5tYXRjaGVkUG9pbnRzICYmIChjb21wb25lbnQubWF0Y2hlZFBvaW50c1swXSA+IDI1NSB8fCBjb21wb25lbnQubWF0Y2hlZFBvaW50c1sxXSA+IDI1NSkpICkge1xuXHRcdFx0XHRcdFx0ZmxhZ3MgfD0gMHgwMDAxOyAvLyBBUkdfMV9BTkRfMl9BUkVfV09SRFNcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoY29tcG9uZW50Lm9mZnNldCkge1xuXHRcdFx0XHRcdGZsYWdzIHw9IDB4MDAwMjsgLy8gQVJHU19BUkVfWFlfVkFMVUVTXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGMgPCBnbHlwaC5jb21wb25lbnRzLmxlbmd0aC0xKSB7XG5cdFx0XHRcdFx0ZmxhZ3MgfD0gMHgwMDIwOyAvLyBNT1JFX0NPTVBPTkVOVFNcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY29tcG9uZW50LmZsYWdzICYgMHgwMjAwKSB7XG5cdFx0XHRcdFx0ZmxhZ3MgfD0gMHgwMjAwOyAvLyBVU0VfTVlfTUVUUklDUyAoY29weSBmcm9tIHRoZSBvcmlnaW5hbCBnbHlwaClcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBmbGFnIDB4MDEwMCBXRV9IQVZFX0lOU1RSVUNUSU9OUyBpcyBzZXQgdG8gemVyb1xuXG5cdFx0XHRcdC8vIFRPRE86IGhhbmRsZSB0cmFuc2Zvcm1zXG5cdFxuXHRcdFx0XHQvLyB3cml0ZSB0aGlzIGNvbXBvbmVudFxuXHRcdFx0XHR0aGlzLnUxNiA9IGZsYWdzO1xuXHRcdFx0XHR0aGlzLnUxNiA9IGNvbXBvbmVudC5nbHlwaElkO1xuXHRcdFx0XHRpZiAoZmxhZ3MgJiAweDAwMDIpIHsgLy8gQVJHU19BUkVfWFlfVkFMVUVTXG5cdFx0XHRcdFx0aWYgKGZsYWdzICYgMHgwMDAxKSB7IC8vIEFSR18xX0FORF8yX0FSRV9XT1JEU1xuXHRcdFx0XHRcdFx0dGhpcy5pMTYgPSBjb21wb25lbnQub2Zmc2V0WzBdO1xuXHRcdFx0XHRcdFx0dGhpcy5pMTYgPSBjb21wb25lbnQub2Zmc2V0WzFdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMuaTggPSBjb21wb25lbnQub2Zmc2V0WzBdO1xuXHRcdFx0XHRcdFx0dGhpcy5pOCA9IGNvbXBvbmVudC5vZmZzZXRbMV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGlmIChmbGFncyAmIDB4MDAwMSkgeyAvLyBBUkdfMV9BTkRfMl9BUkVfV09SRFNcblx0XHRcdFx0XHRcdHRoaXMudTE2ID0gY29tcG9uZW50Lm1hdGNoZWRQb2ludHNbMF07XG5cdFx0XHRcdFx0XHR0aGlzLnUxNiA9IGNvbXBvbmVudC5tYXRjaGVkUG9pbnRzWzFdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMudTggPSBjb21wb25lbnQubWF0Y2hlZFBvaW50c1swXTtcblx0XHRcdFx0XHRcdHRoaXMudTggPSBjb21wb25lbnQubWF0Y2hlZFBvaW50c1sxXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IC8vIGNvbXBvc2l0ZSBnbHlwaCBlbmRcblx0XG5cdFx0Ly8gc3RvcmUgbWV0cmljcyAoZm9yIHNpbXBsZSwgY29tcG9zaXRlIGFuZCBlbXB0eSBnbHlwaHMpXG5cdFx0aWYgKG9wdGlvbnMubWV0cmljcykge1xuXHRcdFx0b3B0aW9ucy5tZXRyaWNzWzBdID0gcG9pbnRzW251bVBvaW50cyswXVswXTsgLy8gbHNiIHBvaW50LCB1c3VhbGx5IDBcblx0XHRcdG9wdGlvbnMubWV0cmljc1sxXSA9IHBvaW50c1tudW1Qb2ludHMrMV1bMF07IC8vIGFkdmFuY2UgcG9pbnRcblx0XHRcdG9wdGlvbnMubWV0cmljc1syXSA9IHBvaW50c1tudW1Qb2ludHMrMl1bMV07IC8vIHRvcCBtZXRyaWMsIHVzdWFsbHkgMCBpbiBob3Jpem9udGFsIGdseXBoc1xuXHRcdFx0b3B0aW9ucy5tZXRyaWNzWzNdID0gcG9pbnRzW251bVBvaW50cyszXVsxXTsgLy8gYm90dG9tIG1ldHJpYywgdXN1YWxseSAwIGluIGhvcml6b250YWwgZ2x5cGhzXG5cdFx0fVxuXHRcblx0XHRyZXR1cm4gdGhpcy50ZWxsKCkgLSB0ZWxsOyAvLyBzaXplIG9mIGJpbmFyeSBnbHlwaCBpbiBieXRlc1xuXG5cdH1cblxuXHRkZWNvZGVJdGVtVmFyaWF0aW9uU3RvcmUoKSB7XG5cdFx0Y29uc3QgaXZzU3RhcnQgPSB0aGlzLnRlbGwoKTtcblx0XHRjb25zdCBpdnMgPSB0aGlzLmRlY29kZShGT1JNQVRTLkl0ZW1WYXJpYXRpb25TdG9yZUhlYWRlcik7XG5cdFx0dGhpcy5zZWVrKGl2c1N0YXJ0ICsgaXZzLnJlZ2lvbkxpc3RPZmZzZXQpO1xuXG5cdFx0aXZzLmF4aXNDb3VudCA9IHRoaXMudTE2O1xuXHRcdGl2cy5yZWdpb25Db3VudCA9IHRoaXMudTE2O1xuXHRcdGl2cy5yZWdpb25zID0gW107IC8vIGdldCB0aGUgcmVnaW9uc1xuXG5cdFx0Zm9yIChsZXQgcj0wOyByPGl2cy5yZWdpb25Db3VudDsgcisrKSB7XG5cdFx0XHRjb25zdCByZWdpb24gPSBbXTtcblx0XHRcdGZvciAobGV0IGE9MDsgYTxpdnMuYXhpc0NvdW50OyBhKyspIHtcblx0XHRcdFx0cmVnaW9uW2FdID0gWyB0aGlzLmYyMTQsIHRoaXMuZjIxNCwgdGhpcy5mMjE0IF07XG5cdFx0XHR9XG5cdFx0XHRpdnMucmVnaW9ucy5wdXNoKHJlZ2lvbik7XG5cdFx0fVxuXG5cdFx0Ly8gZGVjb2RlIHRoZSBJdGVtVmFyaWF0aW9uRGF0YXNcblx0XHRpdnMuaXZkcyA9IFtdO1xuXHRcdGZvciAobGV0IGQ9MDsgZDxpdnMuaXRlbVZhcmlhdGlvbkRhdGFDb3VudDsgZCsrKSB7XG5cdFx0XHR0aGlzLnNlZWsoaXZzU3RhcnQgKyBpdnMuaXRlbVZhcmlhdGlvbkRhdGFPZmZzZXRzW2RdKTtcblx0XHRcdGNvbnN0IGl2ZCA9IHtcblx0XHRcdFx0aXRlbUNvdW50OiB0aGlzLnUxNiwgLy8gdGhlIG51bWJlciBvZiBpdGVtcyBpbiBlYWNoIGRlbHRhU2V0XG5cdFx0XHRcdHJlZ2lvbklkczogW10sXG5cdFx0XHRcdGRlbHRhU2V0czogW10sXG5cdFx0XHR9O1xuXHRcdFx0bGV0IHdvcmREZWx0YUNvdW50ID0gdGhpcy51MTY7XG5cdFx0XHRjb25zdCByZWdpb25Db3VudCA9IHRoaXMudTE2O1xuXHRcdFx0Y29uc3QgbG9uZ1dvcmRzID0gd29yZERlbHRhQ291bnQgJiAweDgwMDA7XG5cdFx0XHR3b3JkRGVsdGFDb3VudCAmPSAweDdmZmY7IC8vIGZpeCB0aGUgdmFsdWUgZm9yIHVzZVxuXHRcdFx0Y29uc29sZS5hc3NlcnQoaXZkLml0ZW1Db3VudCA+MCwgXCJpdmQuaXRlbUNvdW50IHNob3VsZCBiZSA+MCBidXQgaXMgMFwiKTtcblx0XHRcdGNvbnNvbGUuYXNzZXJ0KHdvcmREZWx0YUNvdW50IDw9IHJlZ2lvbkNvdW50LCBcIndvcmREZWx0YUNvdW50IHNob3VsZCBuaWNlbHkgYmUgPD0gcmVnaW9uQ291bnRcIik7XG5cdFx0XHRjb25zb2xlLmFzc2VydChyZWdpb25Db3VudCA+IDAsIFwicmVnaW9uQ291bnQgc2hvdWxkIGJlID4wIGJ1dCBpcyAwIChub24gZmF0YWwpXCIsIHdvcmREZWx0YUNvdW50LCAgaXZkKTtcblx0XHRcdGlmIChpdmQuaXRlbUNvdW50ID4gMCAmJiByZWdpb25Db3VudCA+IDAgJiYgd29yZERlbHRhQ291bnQgPD0gcmVnaW9uQ291bnQpIHsgLy8gc2tpcCBiYWQgSVZEcyAoc29tZSBvbGQgZm9udCBidWlsZHMgaGF2ZSByZWdpb25Db3VudD09MCwgYnV0IHRoZXkgc2VlbSBoYXJtbGVzcyBpZiBza2lwcGVkKVxuXHRcblx0XHRcdFx0Ly8gcG9wdWxhdGUgcmVnaW9uSW5kZXhlc1xuXHRcdFx0XHRmb3IgKGxldCByPTA7IHI8cmVnaW9uQ291bnQ7IHIrKykge1xuXHRcdFx0XHRcdGl2ZC5yZWdpb25JZHMucHVzaCh0aGlzLnUxNik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBkZWNvZGUgdGhlIGRlbHRhU2V0c1xuXHRcdFx0XHRmb3IgKGxldCBkPTA7IGQgPCBpdmQuaXRlbUNvdW50OyBkKyspIHtcblx0XHRcdFx0XHRjb25zdCBkZWx0YVNldCA9IFtdO1xuXHRcdFx0XHRcdGxldCByPTA7XG5cdFx0XHRcdFx0d2hpbGUgKHIgPCB3b3JkRGVsdGFDb3VudCkgeyAvLyBkb27igJl0IHJlcGxhY2UgciB3aXRoIHIrKyBoZXJlIVxuXHRcdFx0XHRcdFx0ZGVsdGFTZXQucHVzaChsb25nV29yZHMgPyB0aGlzLmkzMiA6IHRoaXMuaTE2KTtcblx0XHRcdFx0XHRcdHIrKztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0d2hpbGUgKHIgPCByZWdpb25Db3VudCkgeyAvLyBkb27igJl0IHJlcGxhY2UgciB3aXRoIHIrKyBoZXJlIVxuXHRcdFx0XHRcdFx0ZGVsdGFTZXQucHVzaChsb25nV29yZHMgPyB0aGlzLmkxNiA6IHRoaXMuaTgpO1xuXHRcdFx0XHRcdFx0cisrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpdmQuZGVsdGFTZXRzLnB1c2goZGVsdGFTZXQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGl2cy5pdmRzLnB1c2goaXZkKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGl2cztcblx0fVxuXG5cdC8vIHBhcnNlciBmb3IgdmFyaWF0aW9uSW5kZXhNYXBcblx0Ly8gLSBjb252ZXJ0cyBhIGNvbXByZXNzZWQgYmluYXJ5IGludG8gYW4gYXJyYXkgb2Ygb3V0ZXIgYW5kIGlubmVyIHZhbHVlc1xuXHQvLyAtIGVhY2ggZWxlbWVudCBpbiB0aGUgcmV0dXJuZWQgYXJyYXkgaXMgYW4gYXJyYXkgb2YgMiBlbGVtZW50cyBtYWRlIG9mIFtvdXRlciwgaW5uZXJdXG5cdC8vIC0gZGVsdGFTZXRJbmRleE1hcHMgYXJlIGFsd2F5cyAwLWJhc2VkXG5cdGRlY29kZUluZGV4TWFwKCkge1xuXHRcdGNvbnN0IGluZGV4TWFwID0gW107XG5cdFx0Y29uc3QgZm9ybWF0ID0gdGhpcy51ODtcblx0XHRjb25zdCBlbnRyeUZvcm1hdCA9IHRoaXMudTg7XG5cdFx0Y29uc3QgbWFwQ291bnQgPSBmb3JtYXQgPT09IDAgPyB0aGlzLnUxNiA6IHRoaXMudTMyO1xuXHRcdGNvbnN0IGl0ZW1TaXplID0gKChlbnRyeUZvcm1hdCAmIDB4MzApID4+IDQpICsgMTtcblx0XHRjb25zdCBpbm5lckJpdENvdW50ID0gKGVudHJ5Rm9ybWF0ICYgMHgwZikgKyAxO1xuXHRcdGNvbnN0IGdldHRlcnMgPSBbMCwgVTgsIFUxNiwgVTI0LCBVMzJdO1xuXHRcdGZvciAobGV0IG09MDsgbTxtYXBDb3VudDsgbSsrKSB7XG5cdFx0XHRjb25zdCBlbnRyeSA9IHRoaXMuZ2V0dGVyc1tnZXR0ZXJzW2l0ZW1TaXplXV0oKTsgLy8gdGhpcy51OCwgdGhpcy51MTYsIHRoaXMudTI0LCB0aGlzLnUzMlxuXHRcdFx0Y29uc3Qgb3V0ZXIgPSBlbnRyeSA+Pj4gaW5uZXJCaXRDb3VudDsgLy8gPj4+IGF2b2lkcyBjcmVhdGluZyBuZWdhdGl2ZSB2YWx1ZXMgKHdlIHdhbnQgMHhmZmZmLCBub3QgLTEpXG5cdFx0XHRjb25zdCBpbm5lciA9IGVudHJ5ICYgKCgxIDw8IGlubmVyQml0Q291bnQpIC0gMSk7XG5cdFx0XHRpbmRleE1hcC5wdXNoKFtvdXRlciwgaW5uZXJdKTtcblx0XHR9XG5cdFx0cmV0dXJuIGluZGV4TWFwO1xuXHR9XG5cblx0Ly8gcGFyc2UgcGFja2VkIHBvaW50SWRzXG5cdC8vIC0gdXNlZCBpbiBndmFyIGFuZCBjdmFyIHRhYmxlc1xuXHQvLyAtIGh0dHBzOi8vbGVhcm4ubWljcm9zb2Z0LmNvbS9lbi11cy90eXBvZ3JhcGh5L29wZW50eXBlL3NwZWMvb3R2YXJjb21tb25mb3JtYXRzI3BhY2tlZC1wb2ludC1udW1iZXJzXG5cdGRlY29kZVBvaW50SWRzKCkge1xuXHRcdGNvbnN0IFBPSU5UU19BUkVfV09SRFMgPSAweDgwO1xuXHRcdGNvbnN0IFBPSU5UX1JVTl9DT1VOVF9NQVNLID0gMHg3Zjtcblx0XHRjb25zdCBwb2ludElkcyA9IFtdO1xuXHRcdGNvbnN0IF9jb3VudCA9IHRoaXMudTg7XG5cdFx0Y29uc3QgY291bnQgPSBfY291bnQgJiBQT0lOVFNfQVJFX1dPUkRTID8gKF9jb3VudCAmIFBPSU5UX1JVTl9DT1VOVF9NQVNLKSAqIDB4MDEwMCArIHRoaXMudTggOiBfY291bnQ7XG5cdFx0bGV0IHBvaW50SWQgPSAwO1xuXHRcdGxldCBjID0gMDtcblx0XHR3aGlsZSAoYyA8IGNvdW50KSB7XG5cdFx0XHRjb25zdCBfcnVuQ291bnQgPSB0aGlzLnU4O1xuXHRcdFx0Y29uc3QgcnVuQ291bnQgPSAoX3J1bkNvdW50ICYgUE9JTlRfUlVOX0NPVU5UX01BU0spICsgMTtcblx0XHRcdGNvbnN0IGdldHRlciA9IF9ydW5Db3VudCAmIFBPSU5UU19BUkVfV09SRFMgPyB0aGlzLmdldHRlcnNbVTE2XSA6IHRoaXMuZ2V0dGVyc1tVOF07XG5cdFx0XHRmb3IgKGxldCByPTA7IHIgPCBydW5Db3VudDsgcisrKSB7XG5cdFx0XHRcdHBvaW50SWQgKz0gZ2V0dGVyKCk7IC8vIGNvbnZlcnQgZGVsdGEgaWRzIGludG8gYWJzb2x1dGUgaWRzXG5cdFx0XHRcdHBvaW50SWRzLnB1c2gocG9pbnRJZCk7XG5cdFx0XHR9XG5cdFx0XHRjICs9IHJ1bkNvdW50O1xuXHRcdH1cblx0XHRyZXR1cm4gcG9pbnRJZHM7XG5cdH1cblxuXHQvLyBwYXJzZSBwYWNrZWQgZGVsdGFzXG5cdC8vIC0gdXNlZCBpbiBndmFyIGFuZCBjdmFyIHRhYmxlc1xuXHQvLyAtIGh0dHBzOi8vbGVhcm4ubWljcm9zb2Z0LmNvbS9lbi11cy90eXBvZ3JhcGh5L29wZW50eXBlL3NwZWMvb3R2YXJjb21tb25mb3JtYXRzI3BhY2tlZC1kZWx0YXNcblx0ZGVjb2RlRGVsdGFzKGNvdW50KSB7XG5cdFx0Y29uc3QgZGVsdGFzID0gW107XG5cdFx0bGV0IGQgPSAwO1xuXHRcdHdoaWxlIChkIDwgY291bnQpIHtcblx0XHRcdGNvbnN0IF9ydW5Db3VudCA9IHRoaXMudTg7XG5cdFx0XHRjb25zdCBydW5Db3VudCA9IChfcnVuQ291bnQgJiBERUxUQV9SVU5fQ09VTlRfTUFTSykgKyAxO1xuXHRcdFx0aWYgKF9ydW5Db3VudCAmIERFTFRBU19BUkVfWkVSTykge1xuXHRcdFx0XHRmb3IgKGxldCByPTA7IHIgPCBydW5Db3VudDsgcisrKSB7XG5cdFx0XHRcdFx0ZGVsdGFzW2QrK10gPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBnZXR0ZXIgPSBfcnVuQ291bnQgJiBERUxUQVNfQVJFX1dPUkRTID8gdGhpcy5nZXR0ZXJzW0kxNl0gOiB0aGlzLmdldHRlcnNbSThdO1xuXHRcdFx0XHRmb3IgKGxldCByPTA7IHIgPCBydW5Db3VudDsgcisrKSB7XG5cdFx0XHRcdFx0ZGVsdGFzW2QrK10gPSBnZXR0ZXIoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gZGVsdGFzO1xuXHR9XG5cblx0ZW5jb2RlRGVsdGFzKGRlbHRhcykge1xuXHRcdC8vIGRlbHRhcyBhcmUgZW5jb2RlZCBpbiBncm91cHMgb2Ygc2l6ZSBbMSw2NF0gKDB4ZmYgJiBERUxUQV9SVU5fQ09VTlRfTUFTSyArIDEgPSA2NClcblx0XHQvLyBjb3N0IG9mIHN3aXRjaGluZyB0byBhIG5ldyBncm91cCBhbmQgYmFjayBpcyAyIGJ5dGVzXG5cdFx0Ly8gY29zdCBvZiBub3Qgc3dpdGNoaW5nIHRvIHplcm9lcyBpcyAyIGJ5dGVzIHBlciBkZWx0YSBpZiB3ZeKAmXJlIGluIHdvcmRzLCAxIGJ5dGUgcGVyIGRlbHRhIGlmIHdl4oCZcmUgaW4gYnl0ZXNcblx0XHQvLyBjb3N0IG9mIG5vdCBzd2l0Y2hpbmcgdG8gYnl0ZXMgaXMgMSBieXRlIHBlciBkZWx0YVxuXHRcdC8vIC0gaWRlYWxseSB3ZeKAmWQgbGlrZSB0byBza2lwIHJ1bnMgb2YgbGVuZ3RoIDEsIGJ1dCBsZXTigJlzIGlnbm9yZSB0aGF0IGZvciBub3dcblx0XHRsZXQgZCwgcjtcblx0XHRjb25zdCBudW1CeXRlcyA9IFtdO1xuXHRcdGRlbHRhcy5mb3JFYWNoKGRlbHRhID0+IHtcblx0XHRcdG51bUJ5dGVzLnB1c2goKGRlbHRhID09PSAwKSA/IDAgOiAoaW5SYW5nZShkZWx0YSwgLTEyOCwgMTI3KSkgPyAxIDogMik7XG5cdFx0fSk7XG5cblx0XHQvLyB0aGlzIGFsZ28gY3JlYXRlcyBhIG5ldyBydW4gZm9yIGVhY2ggZGlzdGluY3QgbnVtQnl0ZXMgc2VjdGlvbiwgZXZlbiB0aG9zZSBvZiBsZW5ndGggMVxuXHRcdGNvbnN0IHJ1bnMgPSBbXTtcblx0XHRkPTA7XG5cdFx0cj0wO1xuXHRcdHdoaWxlIChkPGRlbHRhcy5sZW5ndGgpIHtcblx0XHRcdHJ1bnNbcl0gPSBbbnVtQnl0ZXNbZF0sIDBdOyAvLyB3ZSBzdG9yZSBkaXJlY3RseSAwIHRvIG1lYW4gMSBkZWx0YSwgMSB0byBtZWFuIDIgZGVsdGFzLCBuIHRvIG1lYW4gbisxIGRlbHRhcywgZXRjLlxuXHRcdFx0bGV0IGRfID0gZCsxO1xuXHRcdFx0d2hpbGUgKGRfPGRlbHRhcy5sZW5ndGggJiYgbnVtQnl0ZXNbZF9dID09IG51bUJ5dGVzW2RdICYmIHJ1bnNbcl1bMV0gPCA2Mykge1xuXHRcdFx0XHRydW5zW3JdWzFdKys7IC8vIDYzID0gMHgzZiBpcyB0aGUgbWF4IHZhbHVlIHdlIHdpbGwgc3RvcmUgaGVyZSwgbWVhbmluZyA2NCBkZWx0YXMgaW4gdGhlIHJ1blxuXHRcdFx0XHRkXysrO1xuXHRcdFx0fVxuXHRcdFx0ZCA9IGRfO1xuXHRcdFx0cisrO1xuXHRcdH1cblxuXHRcdC8vIHdyaXRlIHRoZSBydW5zXG5cdFx0ZD0wO1xuXHRcdHJ1bnMuZm9yRWFjaChydW4gPT4ge1xuXHRcdFx0Y29uc3QgW251bUJ5dGVzLCBydW5Db3VudF0gPSBydW47XG5cdFx0XHRjb25zdCBfcnVuQ291bnQgPSBydW5Db3VudCB8IChudW1CeXRlcyA9PSAyID8gREVMVEFTX0FSRV9XT1JEUyA6IDApIHwgKG51bUJ5dGVzID09IDAgPyBERUxUQVNfQVJFX1pFUk8gOiAwKTtcblx0XHRcdHRoaXMudTgoX3J1bkNvdW50KTsgLy8gdGhpcyBpbmNvcnBvcmF0ZXMgcnVuQ291bnQgKGJpdHMgMC01IGFuZCB0aGUgZmxhZyBiaXRzIDYgYW5kIDcpXG5cdFx0XHRpZiAobnVtQnl0ZXMgPiAwKSB7IC8vIHdyaXRlIG5vdGhpbmcgZm9yIHplcm8gZGVsdGFzXG5cdFx0XHRcdGZvciAobGV0IGk9MDsgaTw9cnVuQ291bnQ7IGkrKykgeyAvLyA8PSAwIG1lYW5zIDEgaXRlbSwgMSBtZWFucyAyIGl0ZW1zLCBldGMuXG5cdFx0XHRcdFx0aWYgKG51bUJ5dGVzID09IDEpXG5cdFx0XHRcdFx0XHR0aGlzLmk4KGRlbHRhc1tkKytdKTtcblx0XHRcdFx0XHRlbHNlIGlmIChudW1CeXRlcyA9PSAyKVxuXHRcdFx0XHRcdFx0dGhpcy5pMTYoZGVsdGFzW2QrK10pO1xuXHRcdFx0XHR9XHRcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdC8vIGRlY29kZVR2dHMoKVxuXHQvLyAtIHBhcnNlIHRoZSB0dXBsZSB2YXJpYXRpb24gdGFibGVzICh0dnRzKSwgYWxzbyBrbm93biBhcyBcImRlbHRhIHNldHMgd2l0aCB0aGVpciB0dXBsZXNcIiBmb3IgdGhpcyBnbHlwaFxuXHQvLyAtIHdlIG9ubHkgZ2V0IGhlcmUgZnJvbSBhIGd2YXIgb3IgY3ZhciB0YWJsZVxuXHRkZWNvZGVUdnRzKGdseXBoKSB7XG5cdFxuXHRcdGNvbnN0IHR2dHMgPSBbXTtcblx0XHRjb25zdCBmb250ID0gZ2x5cGguZm9udDtcblx0XHRjb25zdCBndmFyID0gZm9udC5ndmFyO1xuXHRcdGNvbnN0IGF4aXNDb3VudCA9IGZvbnQuZnZhci5heGlzQ291bnQ7XG5cblx0XHRjb25zdCBvZmZzZXQgPSBndmFyLnR1cGxlT2Zmc2V0c1tnbHlwaC5pZF07XG5cdFx0Y29uc3QgbmV4dE9mZnNldCA9IGd2YXIudHVwbGVPZmZzZXRzW2dseXBoLmlkKzFdO1xuXG5cdFx0Ly8gZG8gd2UgaGF2ZSB0dnQgZGF0YT9cblx0XHRpZiAobmV4dE9mZnNldCAtIG9mZnNldCA+IDApIHtcblx0XG5cdFx0XHQvLyBqdW1wIHRvIHRoZSB0dnQgZGF0YSwgcmVjb3JkIHRoZSBvZmZzZXRcblx0XHRcdHRoaXMuc2VlayhndmFyLmdseXBoVmFyaWF0aW9uRGF0YUFycmF5T2Zmc2V0ICsgb2Zmc2V0KTtcblx0XHRcdGNvbnN0IHR2dFN0YXJ0ID0gdGhpcy50ZWxsKCk7XG5cblx0XHRcdC8vIGdldCB0dnRzIGhlYWRlclxuXHRcdFx0Y29uc3QgX3R1cGxlQ291bnQgPSB0aGlzLnUxNjtcblx0XHRcdGNvbnN0IHR1cGxlQ291bnQgPSBfdHVwbGVDb3VudCAmIDB4MEZGRjtcblx0XHRcdGNvbnN0IG9mZnNldFRvU2VyaWFsaXplZERhdGEgPSB0aGlzLnUxNjtcblxuXHRcdFx0Ly8gY3JlYXRlIGFsbCB0aGUgdHVwbGVzXG5cdFx0XHRmb3IgKGxldCB0PTA7IHQgPCB0dXBsZUNvdW50OyB0KyspIHtcblx0XHRcdFx0Y29uc3QgdHZ0ID0ge1xuXHRcdFx0XHRcdHNlcmlhbGl6ZWREYXRhU2l6ZTogdGhpcy51MTYsXG5cdFx0XHRcdFx0ZmxhZ3M6IHRoaXMudTE2LCAvLyB0dXBsZUluZGV4IGluIHRoZSBzcGVjXG5cdFx0XHRcdFx0bnVtUG9pbnRzOiAwLFxuXHRcdFx0XHRcdHNoYXJlZFR1cGxlSWQ6IC0xLFxuXHRcdFx0XHRcdHBlYWs6IFtdLFxuXHRcdFx0XHRcdHN0YXJ0OiBbXSxcblx0XHRcdFx0XHRlbmQ6IFtdLFxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdC8vIG1vdmUgdG8gYSByZWdpb24gcmVwcmVzZW50YXRpb24sIHJhdGhlciB0aGFuIHBlYWssIHN0YXJ0LCBlbmQgYXJyYXlzXG5cdFx0XHRcdC8vIGVpdGhlciBcblx0XHRcdFx0Ly8gcmVnaW9uID0gW1twMCxwMSxwMixwM10sW3MwLHMxLHMyLHMzXSxbZTAsZTEsZTIsZTNdXTsgLy8gZmV3ZXIgb2JqZWN0cyBpbiBnZW5lcmFsXG5cdFx0XHRcdC8vIG9yXG5cdFx0XHRcdC8vIHJlZ2lvbiA9IFtbcDAsczAsZTBdLFtwMSxzMSxlMV0sW3AyLHMyLGUyXSxbcDMsczMsZTNdXTsgLy8gbW9yZSBpbnR1aXRpdmUsIGFuZCB1c3VhbGx5IGF4aXNDb3VudCBpcyBtYXggMyBvciA0XG5cdFx0XHRcdC8vIGFsc28gY29uc2lkZXIgYSBzaW5nbGUgSW50MTZBcnJheVxuXG5cdFx0XHRcdGNvbnN0IHR1cGxlSW5kZXggPSB0dnQuZmxhZ3MgJiAweDBGRkY7XG5cdFx0XHRcdGlmICh0dnQuZmxhZ3MgJiBHVkFSX0VNQkVEREVEX1BFQUtfVFVQTEUpIHtcblx0XHRcdFx0XHRmb3IgKGxldCBhPTA7IGE8YXhpc0NvdW50OyBhKyspIHtcblx0XHRcdFx0XHRcdHR2dC5wZWFrW2FdID0gdGhpcy5mMjE0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0dnQuc2hhcmVkVHVwbGVJZCA9IHR1cGxlSW5kZXg7XG5cdFx0XHRcdFx0dHZ0LnBlYWsgPSBndmFyLnNoYXJlZFR1cGxlc1t0dXBsZUluZGV4XTsgLy8gc2V0IHRoZSB3aG9sZSBwZWFrIGFycmF5IGF0IG9uY2UsIFRPRE86IGl0IHdvdWxkIGJlIGJldHRlciBpZiB3ZSB0aG91Z2h0IGluIHRlcm1zIG9mIHJlZ2lvbnMsIGFuZCBhc3NpZ25lZCBjb21wbGV0ZSBzaGFyZWQgcmVnaW9uc1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHR2dC5mbGFncyAmIEdWQVJfSU5URVJNRURJQVRFX1JFR0lPTikge1xuXHRcdFx0XHRcdGZvciAobGV0IGE9MDsgYTxheGlzQ291bnQ7IGErKykge1xuXHRcdFx0XHRcdFx0dHZ0LnN0YXJ0W2FdID0gdGhpcy5mMjE0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRmb3IgKGxldCBhPTA7IGE8YXhpc0NvdW50OyBhKyspIHtcblx0XHRcdFx0XHRcdHR2dC5lbmRbYV0gPSB0aGlzLmYyMTQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gVE9ETzogYWxsIHRoZXNlIFthXSBpbmRleGVzIGFyZSB1Z2x5LCB0aGluayBpbiB0ZXJtcyBvZiBhIHJlZ2lvbiBpbnN0ZWFkLCBlYWNoIHJlZ2lvbiBoYXZpbmcgYXhpc0NvdW50ICogW3N0YXJ0LHBlYWssZW5kXSBhcnJheXMgYW5kIG9wdGlvbmFsbHkgaGF2aW5nIGEgcHJlLW1hZGUgc2NhbGFyXG5cdFx0XHRcdC8vIGZpeHVwc1xuXHRcdFx0XHQvLyBJIHRoaW5rIHRoZXNlIGFyZSBvayBiZWNhdXNlIFwiQW4gaW50ZXJtZWRpYXRlLXJlZ2lvbiB0dXBsZSB2YXJpYXRpb24gdGFibGUgYWRkaXRpb25hbGx5IGhhcyBzdGFydCBhbmQgZW5kIG4tdHVwbGVzXCIuXG5cdFx0XHRcdC8vIEluIHByYWN0aWNlLCB3ZSBjb3VsZCByZW1vdmUgdGhpcyB3aG9sZSBibG9jayBmb3Igd2VsbC1mb3JtZWQgZm9udHMsIGJ1dCB0aGUgc3BlYyBhc2tzIHVzIHRvIGZvcmNlIGFueSBpbnZhbGlkIHR1cGxlcyB0byBudWxsXG5cdFx0XHRcdC8vIFRoZSBmaXJzdCBcInR2dC5zdGFydFthXSA9PT0gdW5kZWZpbmVkXCIgYmxvY2sgc2VlbXMgdW5uZWNlc3Nhcnlcblx0XHRcdFx0Zm9yIChsZXQgYT0wOyBhPGF4aXNDb3VudDsgYSsrKSB7XG5cdFx0XHRcdFx0aWYgKHR2dC5zdGFydFthXSA9PT0gdW5kZWZpbmVkKSB7IC8vIGluZmVyIHN0YXJ0cyBhbmQgZW5kcyBmcm9tIHBlYWtzOiBhIHNoYXJlZCBwZWFrICpjYW4qIGhhdmUgXCJlbWJlZGRlZFwiIHN0YXJ0IGFuZCBlbmQgdHVwbGVzIChzZWUgQml0dGVyIHZhcmlhYmxlIGZvbnQpXG5cdFx0XHRcdFx0XHRpZiAodHZ0LnBlYWtbYV0gPiAwKSB7XG5cdFx0XHRcdFx0XHRcdHR2dC5zdGFydFthXSA9IDA7XG5cdFx0XHRcdFx0XHRcdHR2dC5lbmRbYV0gPSAxO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHR2dC5zdGFydFthXSA9IC0xO1xuXHRcdFx0XHRcdFx0XHR0dnQuZW5kW2FdID0gMDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAoKHR2dC5zdGFydFthXSA+IHR2dC5lbmRbYV0pIHx8ICh0dnQuc3RhcnRbYV0gPCAwICYmIHR2dC5lbmRbYV0gPiAwKSkgLy8gZm9yY2UgbnVsbCBpZiBpbnZhbGlkXG5cdFx0XHRcdFx0XHRcdHR2dC5zdGFydFthXSA9IHR2dC5lbmRbYV0gPSB0dnQucGVha1thXSA9IDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHR0dnRzLnB1c2godHZ0KTsgLy8gc3RvcmUgdGhlIHR2dFxuXHRcdFx0fVxuXG5cdFx0XHQvLyBpcyBvdXIgcG9zaXRpb24gb2s/XG5cdFx0XHRjb25zb2xlLmFzc2VydCh0aGlzLnRlbGwoKSA9PSB0dnRTdGFydCArIG9mZnNldFRvU2VyaWFsaXplZERhdGEsIFwiZGVjb2RlVHZ0cygpOiBjdXJyZW50IG9mZnNldCBpcyBub3Qgb2sgKHRoaXMudGVsbCgpICE9IHR2dFN0YXJ0ICsgb2Zmc2V0VG9TZXJpYWxpemVkRGF0YSlcIiwgdGhpcy50ZWxsKCksIHR2dFN0YXJ0ICsgb2Zmc2V0VG9TZXJpYWxpemVkRGF0YSk7XG5cblx0XHRcdC8vIGdldCBwb2ludElkcyBhbmQgZGVsdGFzIGZyb20gdGhlIHNlcmlhbGl6ZWQgZGF0YVxuXHRcdFx0dGhpcy5zZWVrKHR2dFN0YXJ0ICsgb2Zmc2V0VG9TZXJpYWxpemVkRGF0YSk7IC8vIGp1bXAgdG8gdGhlIHNlcmlhbGl6ZWQgZGF0YSBleHBsaWNpdGx5XHRcdFxuXHRcdFx0Y29uc3Qgc2hhcmVkUG9pbnRJZHMgPSBfdHVwbGVDb3VudCAmIEdWQVJfU0hBUkVEX1BPSU5UX05VTUJFUlMgPyB0aGlzLmRlY29kZVBvaW50SWRzKCkgOiB1bmRlZmluZWQ7IC8vIGdldCB0aGUgc2hhcmVkIHBvaW50SWRzXG5cdFx0XHRmb3IgKGxldCB0PTA7IHQgPCB0dXBsZUNvdW50OyB0KyspIHsgLy8gZ28gdGhydSBlYWNoIHR1cGxlXG5cdFx0XHRcdGNvbnN0IHR2dCA9IHR2dHNbdF07XG5cdFx0XHRcdGNvbnN0IHBvaW50SWRzID0gdHZ0LmZsYWdzICYgR1ZBUl9QUklWQVRFX1BPSU5UX05VTUJFUlMgPyB0aGlzLmRlY29kZVBvaW50SWRzKCkgOiBzaGFyZWRQb2ludElkczsgLy8gdXNlIHByaXZhdGUgcG9pbnQgaWRzIG9yIHVzZSB0aGUgc2hhcmVkIHBvaW50IGlkc1xuXHRcdFx0XHR0dnQuYWxsUG9pbnRzID0gcG9pbnRJZHMubGVuZ3RoID09IDA7IC8vIGZsYWcgc3BlY2lhbCBjYXNlIGlmIGFsbCBwb2ludHMgYXJlIHVzZWQsIHRoaXMgdHJpZ2dlcnMgSVVQIVxuXHRcdFx0XHRjb25zdCB0dXBsZU51bVBvaW50cyA9IHR2dC5hbGxQb2ludHMgPyBnbHlwaC5wb2ludHMubGVuZ3RoIDogcG9pbnRJZHMubGVuZ3RoOyAvLyBob3cgbWFueSBkZWx0YXMgZG8gd2UgbmVlZD9cblx0XHRcdFx0Y29uc3QgeERlbHRhcyA9IHRoaXMuZGVjb2RlRGVsdGFzKHR1cGxlTnVtUG9pbnRzKTtcblx0XHRcdFx0Y29uc3QgeURlbHRhcyA9IHRoaXMuZGVjb2RlRGVsdGFzKHR1cGxlTnVtUG9pbnRzKTtcblx0XHRcdFx0dHZ0LmRlbHRhcyA9IFtdO1xuXHRcdFx0XHRpZiAodHZ0LmFsbFBvaW50cykge1xuXHRcdFx0XHRcdGZvciAobGV0IHB0PTA7IHB0IDwgZ2x5cGgucG9pbnRzLmxlbmd0aDsgcHQrKykge1xuXHRcdFx0XHRcdFx0dHZ0LmRlbHRhc1twdF0gPSBbeERlbHRhc1twdF0sIHlEZWx0YXNbcHRdXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0Zm9yIChsZXQgcHQ9MCwgcGM9MDsgcHQgPCBnbHlwaC5wb2ludHMubGVuZ3RoOyBwdCsrKSB7XG5cdFx0XHRcdFx0XHRpZiAocHQgPCBwb2ludElkc1twY10gfHwgcGMgPj0gdHVwbGVOdW1Qb2ludHMpIHtcblx0XHRcdFx0XHRcdFx0dHZ0LmRlbHRhc1twdF0gPSBudWxsOyAvLyB0aGVzZSBwb2ludHMgd2lsbCBiZSBtb3ZlZCBieSBJVVBcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHR0dnQuZGVsdGFzW3B0XSA9IFt4RGVsdGFzW3BjXSwgeURlbHRhc1twY11dOyAvLyB0aGVzZSBwb2ludHMgd2lsbCBiZSBtb3ZlZCBleHBsaWNpdGx5XG5cdFx0XHRcdFx0XHRcdHBjKys7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIGFmdGVyIHRoaXMsIHdlIG5vIGxvbmdlciBuZWVkIHBvaW50SWRzLCByaWdodD8gc28gaXQgbmVlZG7igJl0IHN0aWNrIGFyb3VuZCBhcyBhIHByb3BlcnR5IG9mIHRoZSB0dnQgKGV4Y2VwdCBmb3IgdmlzdWFsaXphdGlvbilcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gdHZ0cztcblx0fVxuXG5cdGRlY29kZVBhaW50KGNvbnRleHQgPSB7fSkge1xuXG5cdFx0Ly8gcmVhZE9wZXJhbmRzKClcblx0XHQvLyAtIHRoaXMgcmVhZHMgYWxsIHRoZSB2YXJpYWJsZSBvcGVyYW5kcyBmb3IgYSBwYWludCAod2UgYWxzbyB1c2UgdGhpcyBmb3Igbm9uLXZhcmlhYmxlIHZlcnNpb25zIG9mIHRoZSBzYW1lIHBhaW50KVxuXHRcdC8vIC0gd2UgbG9vayB1cCB0aGUgbnVtYmVyIG9mIG9wZXJhbmRzIG5lZWRlZCBpbiBQQUlOVF9WQVJfT1BFUkFORFMsIHNvIHdlIGNhbiB1c2UgdGhlIHNhbWUgZnVuY3Rpb24gZm9yIGFsbCBwYWludCBmb3JtYXRzXG5cdFx0Y29uc3QgcmVhZE9wZXJhbmRzID0gKHR5cGUpID0+IHtcblx0XHRcdGNvbnN0IGNvdW50ID0gUEFJTlRfVkFSX09QRVJBTkRTW3BhaW50LmZvcm1hdF07XG5cdFx0XHRmb3IgKGxldCBpPTA7IGk8Y291bnQ7IGkrKylcblx0XHRcdFx0b3BlcmFuZHMucHVzaCh0aGlzLmdldHRlcnNbdHlwZV0oKSk7XG5cdFx0fTtcblx0XHRcblx0XHQvLyBhZGRWYXJpYXRpb25zKClcblx0XHQvLyAtIGFkZHMgdGhlIHZhcmlhdGlvbiBkZWx0YXMgdG8gdGhlIG9wZXJhbmRzXG5cdFx0Ly8gLSB0aGUgYXJyb3cgZnVuY3Rpb24ga2VlcHMgXCJ0aGlzXCIgKHRoZSBidWZmZXIpIGluIHNjb3BlXG5cdFx0Y29uc3QgYWRkVmFyaWF0aW9ucyA9IChvcGVyYW5kcykgPT4ge1xuXHRcdFx0Y29uc3QgdmFyaWF0aW9uc0VuYWJsZWQgPSB0cnVlO1xuXHRcdFx0aWYgKCF2YXJpYXRpb25zRW5hYmxlZCB8fCBwYWludC5mb3JtYXQgJSAyID09IDAgfHwgb3BlcmFuZHMubGVuZ3RoID09IDApIC8vIHZhcmlhdGlvbnMgZW5hYmxlZDsgb25seSBvZGQtbnVtYmVyZWQgcGFpbnQgZm9ybWF0cyBoYXZlIHZhcmlhdGlvbnM7IHdlIG5lZWQgb3BlcmFuZHNcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0Y29uc3QgdmFySW5kZXhCYXNlID0gdGhpcy51MzI7IC8vIHdlIG11c3QgcmVhZCB0aGlzIGV2ZW4gaWYgd2UgZG9u4oCZdCBoYXZlIGFuIGluc3RhbmNlLCBvdGhlcndpc2UgcmVhZGluZyBnZXRzIG91dCBvZiBzeW5jXG5cdFx0XHRpZiAodmFySW5kZXhCYXNlID09IDB4ZmZmZmZmZmYgfHwgIWNvbnRleHQuaW5zdGFuY2UpIC8vIG5vIHZhcmlhdGlvbnMgZm9yIHRoaXMgcGFpbnQ7IHdlIG5lZWQgYW4gaW5zdGFuY2Vcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0Y29uc3QgZGVsdGFzID0gY29udGV4dC5pbnN0YW5jZS5kZWx0YVNldHNbXCJDT0xSXCJdO1xuXHRcdFx0Zm9yIChsZXQgaT0wOyBpPG9wZXJhbmRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGNvbnN0IGluZGV4ID0gdmFySW5kZXhCYXNlICsgaTtcblx0XHRcdFx0Y29uc3QgW291dGVyLCBpbm5lcl0gPSBjb2xyLnZhckluZGV4TWFwT2Zmc2V0ID8gY29sci52YXJJbmRleE1hcFtpbmRleF0gOiBbaW5kZXggPj4+IDE2LCBpbmRleCAmIDB4ZmZmZl07IC8vIGV4cGxpY2l0IG9yIGltcGxpY2l0IG1hcHBpbmdcblx0XHRcdFx0aWYgKG91dGVyICE9IDB4ZmZmZiAmJiBpbm5lciAhPSAweGZmZmYpIHtcblx0XHRcdFx0XHRvcGVyYW5kc1tpXSArPSBkZWx0YXNbb3V0ZXJdW2lubmVyXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHQvLyB3ZSBkZWNvZGUgY29sb3JMaW5lIGhlcmUsIHJhdGhlciB0aGFuIGFzIGEgbWV0aG9kIG9mIFNhbXNhQnVmZmVyLCBpbiBvcmRlciB0byBrZWVwIHBhaW50IGluIHNjb3BlIGFuZCB0byBiZSBhYmxlIHRvIHVzZSBhZGRWYXJpYXRpb25zKClcblx0XHQvLyAtIHVubGlrZSBvdGhlciBkZWNvZGVYIG1ldGhvZHMsIGl0IHNldHMgdGhlIGRhdGEgcG9pbnRlciBhY2NvcmRpbmcgdG8gdGhlIHN1cHBsaWVkIGFyZ3VtZW50LCB0aGVuIHJlc3RvcmVzIGl0XG5cdFx0Y29uc3QgZGVjb2RlQ29sb3JMaW5lID0gKGNvbG9yTGluZU9mZnNldCkgPT4ge1xuXHRcdFx0Y29uc3QgdGVsbCA9IHRoaXMudGVsbCgpO1xuXHRcdFx0dGhpcy5zZWVrKHBhaW50Lm9mZnNldCArIGNvbG9yTGluZU9mZnNldCk7XG5cdFx0XHRjb25zdCBjb2xvckxpbmUgPSB7XG5cdFx0XHRcdGV4dGVuZDogdGhpcy51OCwgLy8gb25lIG9mIEVYVEVORF9QQUQgKDApLCBFWFRFTkRfUkVQRUFUICgxKSwgRVhURU5EX1JFRkxFQ1QgKDIpXG5cdFx0XHRcdG51bVN0b3BzOiB0aGlzLnUxNixcblx0XHRcdFx0Y29sb3JTdG9wczogW10sXG5cdFx0XHR9O1xuXHRcdFx0Y29uc3Qgb3BlcmFuZHMgPSBbXTtcblx0XHRcdGZvciAobGV0IGNzdD0wOyBjc3Q8Y29sb3JMaW5lLm51bVN0b3BzOyBjc3QrKykge1xuXHRcdFx0XHRjb25zdCBjb2xvclN0b3AgPSB7fTtcblx0XHRcdFx0b3BlcmFuZHNbMF0gPSB0aGlzLmkxNjsgLy8gc3RvcE9mZnNldFxuXHRcdFx0XHRjb2xvclN0b3AucGFsZXR0ZUluZGV4ID0gdGhpcy51MTY7XG5cdFx0XHRcdG9wZXJhbmRzWzFdID0gdGhpcy5pMTY7IC8vIGFscGhhXG5cdFx0XHRcdGFkZFZhcmlhdGlvbnMob3BlcmFuZHMpO1xuXHRcdFx0XHRjb2xvclN0b3Auc3RvcE9mZnNldCA9IG9wZXJhbmRzWzBdIC8gMTYzODQ7XG5cdFx0XHRcdGNvbG9yU3RvcC5hbHBoYSA9IG9wZXJhbmRzWzFdIC8gMTYzODQ7XG5cdFx0XHRcdGNvbG9yTGluZS5jb2xvclN0b3BzLnB1c2goY29sb3JTdG9wKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuc2Vlayh0ZWxsKTsgLy8gcmVzdG9yZSB0aGUgZGF0YSBwb2ludGVyXG5cdFx0XHRyZXR1cm4gY29sb3JMaW5lO1xuXHRcdH07XG5cblx0XHRjb25zdCBjb2xyID0gY29udGV4dC5mb250LkNPTFI7XG5cdFx0Y29uc3QgcGFpbnQgPSB7XG5cdFx0XHRvZmZzZXQ6IHRoaXMudGVsbCgpLFxuXHRcdFx0Zm9ybWF0OiB0aGlzLnU4LFxuXHRcdFx0Y2hpbGRyZW46IFtdLFxuXHRcdH07XG5cdFx0Y29uc3Qgb3BlcmFuZHMgPSBbXTtcblx0XHRsZXQgdGVsbDtcblxuXHRcdC8vIGtlZXAgdHJhY2sgb2YgcGFpbnRJZHMgd2UgaGF2ZSB1c2VkLCB0byBhdm9pZCBpbmZpbml0ZSByZWN1cnNpb25cblx0XHQvLyAtIHdlIHVzZSBhbiBBcnJheSAobm90IGEgU2V0IG9yIGFueXRoaW5nIG5vbi1MSUZPKSwgc2luY2Ugd2UgbmVlZCB0byBwdXNoIGFuZCBwb3AgYXQgdGhlIGJlZ2lubmluZyBvZiBlYWNoIGRlY29kZVBhaW50KClcblx0XHQvLyAtIGl04oCZcyBvbmx5IHJlbGV2YW50IHRvIHRlc3Qgd2hldGhlciB0aGUgcGFpbnRJZCBoYXMgYmVlbiB1c2VkIGluIHRoZSBwYXRoIGZyb20gcm9vdCB0byBjdXJyZW50IG5vZGVcblx0XHQvLyAtIG11bHRpcGxlIGNoaWxkcmVuIG9mIHRoZSBzYW1lIHBhcmVudCBtYXkgdXNlIHRoZSBzYW1lIHBhaW50SWQsIGZvciBleGFtcGxlIHRvIGZpbGwgdHdvIHNoYXBlcyB0aGUgc2FtZSB3YXlcblx0XHQvLyAtIHBhaW50Lm9mZnNldCBpcyBzdWl0YWJsZSB0byBpZGVudGlmeSBlYWNoIHBhaW50XG5cdFx0aWYgKGNvbnRleHQucGFpbnRJZHMuaW5jbHVkZXMocGFpbnQub2Zmc2V0KSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgZGVjb2RlUGFpbnQoKTogaW5maW5pdGUgcmVjdXJzaW9uIGRldGVjdGVkOiBwYWludElkICR7cGFpbnQub2Zmc2V0fSBpcyBhbHJlYWR5IHVzZWQgaW4gdGhpcyBEQUdgKTtcblx0XHRcdHJldHVybiBwYWludDsgLy8gcmV0dXJuIHdoYXQgd2UgaGF2ZSBmb3VuZCBzbyBmYXJcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRjb250ZXh0LnBhaW50SWRzLnB1c2gocGFpbnQub2Zmc2V0KTsgLy8gcHVzaCB0aGUgcGFpbnRJZDogd2XigJlsbCBwb3AgaXQgYXQgdGhlIGVuZCBvZiB0aGlzIHJ1biB0aHJvdWdodCBkZWNvZGVQYWludCgpLCBzbyBpdCB3b3JrcyB3ZWxsIGZvciBuZXN0ZWQgcGFpbnRzXG5cdFx0fVxuXG5cdFx0c3dpdGNoIChwYWludC5mb3JtYXQpIHtcblx0XHRcdGNhc2UgMTogeyAvLyBQYWludENvbHJMYXllcnNcblx0XHRcdFx0Y29uc3QgbnVtTGF5ZXJzID0gdGhpcy51ODtcblx0XHRcdFx0Y29uc3QgZmlyc3RMYXllckluZGV4ID0gdGhpcy51MzI7XG5cdFx0XHRcdGZvciAobGV0IGx5ciA9IDA7IGx5ciA8IG51bUxheWVyczsgbHlyKyspIHtcblx0XHRcdFx0XHR0aGlzLnNlZWsoY29sci5sYXllckxpc3RbZmlyc3RMYXllckluZGV4ICsgbHlyXSk7XG5cdFx0XHRcdFx0cGFpbnQuY2hpbGRyZW4ucHVzaCh0aGlzLmRlY29kZVBhaW50KGNvbnRleHQpKTsgLy8gcmVjdXJzaXZlXG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGNhc2UgMjogY2FzZSAzOiB7IC8vIFBhaW50U29saWRcblx0XHRcdFx0cGFpbnQucGFsZXR0ZUluZGV4ID0gdGhpcy51MTY7XG5cdFx0XHRcdHJlYWRPcGVyYW5kcyhJMTYpO1xuXHRcdFx0XHRhZGRWYXJpYXRpb25zKG9wZXJhbmRzKTtcblx0XHRcdFx0cGFpbnQuYWxwaGEgPSBvcGVyYW5kc1swXSAvIDB4NDAwMDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGNhc2UgNDogY2FzZSA1OiBjYXNlIDY6IGNhc2UgNzogY2FzZSA4OiBjYXNlIDk6IHsgLy8gYWxsIGdyYWRpZW50IHBhaW50c1xuXHRcdFx0XHRjb25zdCBjb2xvckxpbmVPZmZzZXQgPSB0aGlzLnUyNDtcblx0XHRcdFx0cGFpbnQuY29sb3JMaW5lID0gZGVjb2RlQ29sb3JMaW5lKGNvbG9yTGluZU9mZnNldCk7XG5cdFx0XHRcdHJlYWRPcGVyYW5kcyhJMTYpO1xuXHRcdFx0XHRhZGRWYXJpYXRpb25zKG9wZXJhbmRzKTtcblx0XHRcdFx0aWYgKHBhaW50LmZvcm1hdCA8IDYpIHsgLy8gUGFpbnRMaW5lYXJHcmFkaWVudCwgUGFpbnRWYXJMaW5lYXJHcmFkaWVudFxuXHRcdFx0XHRcdHBhaW50LnBvaW50cyA9IFsgW29wZXJhbmRzWzBdLCBvcGVyYW5kc1sxXV0sIFtvcGVyYW5kc1syXSwgb3BlcmFuZHNbM11dLCBbb3BlcmFuZHNbNF0sIG9wZXJhbmRzWzVdXSBdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKHBhaW50LmZvcm1hdCA8IDgpIHsgLy8gUGFpbnRSYWRpYWxHcmFkaWVudCwgUGFpbnRWYXJSYWRpYWxHcmFkaWVudFxuXHRcdFx0XHRcdHBhaW50LnBvaW50cyA9IFsgW29wZXJhbmRzWzBdLCBvcGVyYW5kc1sxXSwgb3BlcmFuZHNbMl1dLCBbb3BlcmFuZHNbM10sIG9wZXJhbmRzWzRdLCBvcGVyYW5kc1s1XV0gXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHsgLy8gUGFpbnRTd2VlcEdyYWRpZW50LCBQYWludFZhclN3ZWVwR3JhZGllbnRcblx0XHRcdFx0XHRwYWludC5jZW50ZXIgPSBbb3BlcmFuZHNbMF0sIG9wZXJhbmRzWzFdXTtcblx0XHRcdFx0XHRwYWludC5zdGFydEFuZ2xlID0gb3BlcmFuZHNbMl0gLyAweDQwMDAgKiAxODA7XG5cdFx0XHRcdFx0cGFpbnQuZW5kQW5nbGUgPSBvcGVyYW5kc1szXSAvIDB4NDAwMCAqIDE4MDtcdFxuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRjYXNlIDEwOiB7IC8vIFBhaW50R2x5cGhcblx0XHRcdFx0Y29uc3QgbmV4dE9mZnNldCA9IHRoaXMudTI0O1xuXHRcdFx0XHRwYWludC5nbHlwaElEID0gdGhpcy51MTY7IC8vIGJ5IGFzc2lnbmluZyBnbHlwaGlkIHdlIGdldCBhbiBhY3R1YWwgc2hhcGUgdG8gdXNlXG5cdFx0XHRcdHRoaXMuc2VlayhwYWludC5vZmZzZXQgKyBuZXh0T2Zmc2V0KTtcblx0XHRcdFx0cGFpbnQuY2hpbGRyZW4ucHVzaCh0aGlzLmRlY29kZVBhaW50KGNvbnRleHQpKTsgLy8gcmVjdXJzaXZlIChidXQgd2Ugc2hvdWxkIG9ubHkgZ2V0IHRyYW5zZm9ybXMsIG1vcmUgRm9ybWF0IDEwIHRhYmxlcywgYW5kIGEgZmlsbCBmcm9tIG5vdyBvbilcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGNhc2UgMTE6IHsgLy8gUGFpbnRDb2xyR2x5cGhcblx0XHRcdFx0Y29uc3QgZ2x5cGhJRCA9IHRoaXMudTE2O1xuXHRcdFx0XHR0aGlzLnNlZWsoY29sci5iYXNlR2x5cGhQYWludFJlY29yZHNbZ2x5cGhJRF0pO1xuXHRcdFx0XHRwYWludC5jaGlsZHJlbi5wdXNoKHRoaXMuZGVjb2RlUGFpbnQoY29udGV4dCkpOyAvLyByZWN1cnNpdmVcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGNhc2UgMTI6IGNhc2UgMTM6IHsgLy8gUGFpbnRUcmFuc2Zvcm0sIFBhaW50VmFyVHJhbnNmb3JtXG5cdFx0XHRcdGNvbnN0IG5leHRPZmZzZXQgPSB0aGlzLnUyNDtcblx0XHRcdFx0Y29uc3QgdHJhbnNmb3JtT2Zmc2V0ID0gdGhpcy51MjQ7XG5cdFx0XHRcdHRlbGwgPSB0aGlzLnRlbGwoKTtcblx0XHRcdFx0dGhpcy5zZWVrKHBhaW50Lm9mZnNldCArIHRyYW5zZm9ybU9mZnNldCk7XG5cdFx0XHRcdHJlYWRPcGVyYW5kcyhJMzIpO1xuXHRcdFx0XHR0aGlzLnNlZWsodGVsbCk7XG5cdFx0XHRcdGFkZFZhcmlhdGlvbnMob3BlcmFuZHMpO1xuXHRcdFx0XHRwYWludC5tYXRyaXggPSBbIG9wZXJhbmRzWzBdLzB4MTAwMDAsIG9wZXJhbmRzWzFdLzB4MTAwMDAsIG9wZXJhbmRzWzJdLzB4MTAwMDAsIG9wZXJhbmRzWzNdLzB4MTAwMDAsIG9wZXJhbmRzWzRdLzB4MTAwMDAsIG9wZXJhbmRzWzVdLzB4MTAwMDAgXTtcblx0XHRcdFx0dGhpcy5zZWVrKHBhaW50Lm9mZnNldCArIG5leHRPZmZzZXQpO1xuXHRcdFx0XHRwYWludC5jaGlsZHJlbi5wdXNoKHRoaXMuZGVjb2RlUGFpbnQoY29udGV4dCkpOyAvLyByZWN1cnNpdmVcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGNhc2UgMTQ6IGNhc2UgMTU6IHsgLy8gUGFpbnRUcmFuc2xhdGUsIFBhaW50VmFyVHJhbnNsYXRlXG5cdFx0XHRcdGNvbnN0IG5leHRPZmZzZXQgPSB0aGlzLnUyNDtcblx0XHRcdFx0cmVhZE9wZXJhbmRzKEkxNik7XG5cdFx0XHRcdGFkZFZhcmlhdGlvbnMob3BlcmFuZHMpO1xuXHRcdFx0XHRwYWludC50cmFuc2xhdGUgPSBbIG9wZXJhbmRzWzBdLCBvcGVyYW5kc1sxXSBdO1xuXHRcdFx0XHR0aGlzLnNlZWsocGFpbnQub2Zmc2V0ICsgbmV4dE9mZnNldCk7XG5cdFx0XHRcdHBhaW50LmNoaWxkcmVuLnB1c2godGhpcy5kZWNvZGVQYWludChjb250ZXh0KSk7IC8vIHJlY3Vyc2l2ZVxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0Y2FzZSAxNjogY2FzZSAxNzogY2FzZSAxODogY2FzZSAxOTogY2FzZSAyMDogY2FzZSAyMTogY2FzZSAyMjogY2FzZSAyMzogeyAvLyBQYWludFNjYWxlIGFuZCB2YXJpYW50IHNjYWxpbmcgZm9ybWF0c1xuXHRcdFx0XHRjb25zdCBuZXh0T2Zmc2V0ID0gdGhpcy51MjQ7XG5cdFx0XHRcdHJlYWRPcGVyYW5kcyhJMTYpO1xuXHRcdFx0XHRhZGRWYXJpYXRpb25zKG9wZXJhbmRzKTtcblx0XHRcdFx0bGV0IG8gPSAwO1xuXHRcdFx0XHRwYWludC5zY2FsZSA9IFsgb3BlcmFuZHNbbysrXSBdOyAvLyBzY2FsZVhcblx0XHRcdFx0aWYgKHBhaW50LmZvcm1hdCA+PSAyMClcblx0XHRcdFx0XHRwYWludC5zY2FsZS5wdXNoKG9wZXJhbmRzW28rK10pOyAgLy8gc2NhbGVZXG5cdFx0XHRcdGlmIChwYWludC5mb3JtYXQgPT0gMTggfHwgcGFpbnQuZm9ybWF0ID09IDE5IHx8IHBhaW50LmZvcm1hdCA9PSAyMiB8fCBwYWludC5mb3JtYXQgPT0gMjMpXG5cdFx0XHRcdFx0cGFpbnQuY2VudGVyID0gWyBvcGVyYW5kc1tvKytdLCBvcGVyYW5kc1tvKytdIF07IC8vIGNlbnRlclgsIGNlbnRlcllcblx0XHRcdFx0dGhpcy5zZWVrKHBhaW50Lm9mZnNldCArIG5leHRPZmZzZXQpO1xuXHRcdFx0XHRwYWludC5jaGlsZHJlbi5wdXNoKHRoaXMuZGVjb2RlUGFpbnQoY29udGV4dCkpOyAvLyByZWN1cnNpdmVcdFxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0Y2FzZSAyNDogY2FzZSAyNTogY2FzZSAyNjogY2FzZSAyNzogeyAvLyBQYWludFJvdGF0ZSwgUGFpbnRWYXJSb3RhdGUsIFBhaW50Um90YXRlQXJvdW5kQ2VudGVyLCBQYWludFZhclJvdGF0ZUFyb3VuZENlbnRlclxuXHRcdFx0XHRjb25zdCBuZXh0T2Zmc2V0ID0gdGhpcy51MjQ7XG5cdFx0XHRcdHJlYWRPcGVyYW5kcyhJMTYpO1xuXHRcdFx0XHRhZGRWYXJpYXRpb25zKG9wZXJhbmRzKTtcblx0XHRcdFx0cGFpbnQucm90YXRlID0gb3BlcmFuZHNbMF0vMHg0MDAwICogMTgwOyAvLyB3ZSBzdG9yZSAxLzE4MCBvZiB0aGUgcm90YXRpb24gYW5nbGUgYXMgRjIxNFxuXHRcdFx0XHRpZiAocGFpbnQuZm9ybWF0ID49IDI2KSB7XG5cdFx0XHRcdFx0cGFpbnQuY2VudGVyID0gWyBvcGVyYW5kc1sxXSwgb3BlcmFuZHNbMl0gXTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLnNlZWsocGFpbnQub2Zmc2V0ICsgbmV4dE9mZnNldCk7XG5cdFx0XHRcdHBhaW50LmNoaWxkcmVuLnB1c2godGhpcy5kZWNvZGVQYWludChjb250ZXh0KSk7IC8vIHJlY3Vyc2l2ZVx0XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRjYXNlIDI4OiBjYXNlIDI5OiBjYXNlIDMwOiBjYXNlIDMxOiB7IC8vIFBhaW50U2tldywgUGFpbnRWYXJTa2V3LCBQYWludFNrZXdBcm91bmRDZW50ZXIsIFBhaW50VmFyU2tld0Fyb3VuZENlbnRlclxuXHRcdFx0XHRjb25zdCBuZXh0T2Zmc2V0ID0gdGhpcy51MjQ7XG5cdFx0XHRcdHJlYWRPcGVyYW5kcyhJMTYpO1xuXHRcdFx0XHRhZGRWYXJpYXRpb25zKG9wZXJhbmRzKTtcblx0XHRcdFx0cGFpbnQuc2tldyA9IFsgb3BlcmFuZHNbMF0vMHg0MDAwICogMTgwLCBvcGVyYW5kc1sxXS8weDQwMDAgKiAxODAgXTsgLy8gd2Ugc3RvcmUgMS8xODAgb2YgdGhlIHJvdGF0aW9uIGFuZ2xlIGFzIEYyMTRcblx0XHRcdFx0aWYgKHBhaW50LmZvcm1hdCA+PSAzMCkge1xuXHRcdFx0XHRcdHBhaW50LmNlbnRlciA9IFsgb3BlcmFuZHNbMV0sIG9wZXJhbmRzWzJdIF07XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5zZWVrKHBhaW50Lm9mZnNldCArIG5leHRPZmZzZXQpO1xuXHRcdFx0XHRwYWludC5jaGlsZHJlbi5wdXNoKHRoaXMuZGVjb2RlUGFpbnQoY29udGV4dCkpOyAvLyByZWN1cnNpdmVcdFxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0Y2FzZSAzMjogeyAvLyBQYWludENvbXBvc2l0ZVxuXHRcdFx0XHRjb25zdCBzb3VyY2VQYWludE9mZnNldCA9IHRoaXMudTI0O1xuXHRcdFx0XHRwYWludC5jb21wb3NpdGVNb2RlID0gdGhpcy51ODtcblx0XHRcdFx0Y29uc3QgYmFja2Ryb3BQYWludE9mZnNldCA9IHRoaXMudTI0O1xuXHRcdFx0XHR0aGlzLnNlZWsocGFpbnQub2Zmc2V0ICsgc291cmNlUGFpbnRPZmZzZXQpO1xuXHRcdFx0XHRwYWludC5jaGlsZHJlbi5wdXNoKHRoaXMuZGVjb2RlUGFpbnQoY29udGV4dCkpO1xuXHRcdFx0XHR0aGlzLnNlZWsocGFpbnQub2Zmc2V0ICsgYmFja2Ryb3BQYWludE9mZnNldCk7XG5cdFx0XHRcdHBhaW50LmNoaWxkcmVuLnB1c2godGhpcy5kZWNvZGVQYWludChjb250ZXh0KSk7XG5cdFx0XHRcdGJyZWFrO1x0XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGRlZmF1bHQ6IHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihgVW5rbm93biBwYWludC5mb3JtYXQgJHtwYWludC5mb3JtYXR9IChtdXN0IGJlIDEgPD0gcGFpbnQuZm9ybWF0IDw9IDMyKWApXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGNvbnRleHQucGFpbnRJZHMucG9wKCk7IC8vIHdlIHBvcCB0aGUgcGFpbnRJZCB3ZSBwdXNoZWQgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGlzIGRlY29kZVBhaW50KCksIGJ1dCBtaWdodCByZXVzZSB0aGUgc2FtZSBwYWludElkIGluIGxhdGVyIHBhaW50cyBpbiB0aGUgc2FtZSBnbHlwaFxuXHRcdHJldHVybiBwYWludDsgLy8gaGF2aW5nIHJlY3Vyc2VkIHRoZSB3aG9sZSBwYWludCB0cmVlLCB0aGlzIGlzIG5vdyBhIERBR1xuXHR9XG59XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gU2Ftc2FGb250XG4vLyAtIGxldOKAmXMga2VlcCB0aGlzIHB1cmUsIGFuZCBsZWF2ZSBmYW5jeSBsb2FkaW5nIGZyb20gVVJMIG9yIHBhdGggdG8gc3BlY2lhbCBwdXJwb3NlIGZ1bmN0aW9uc1xuLy8gLSBidWY6IGEgU2Ftc2FCdWZmZXIgY29udGFpbmluZyB0aGUgZm9udCAocmVxdWlyZWQpXG4vLyAtIG9wdGlvbnM6IHZhcmlvdXNcbi8vIC0gVE9ETzogYXQgc29tZSBwb2ludCB3ZSBuZWVkIGl0IHRvIHdvcmsgd2l0aG91dCBsb2FkaW5nIGFsbCB0aGUgZ2x5cGhzIGludG8gbWVtb3J5LCBzbyB0aGV5IHN0YXkgaW4gYSBmaWxlLCBlLmcuIG9wdGlvbnMuZ2x5cGhzT25EZW1hbmQgPSB0cnVlXG5mdW5jdGlvbiBTYW1zYUZvbnQoYnVmLCBvcHRpb25zID0ge30pIHtcblxuXHRjb25zb2xlLmxvZyhcIlNhbXNhRm9udCFcIilcblxuXHR0aGlzLmJ1ZiA9IGJ1ZjsgLy8gU2Ftc2FCdWZmZXJcblx0dGhpcy50YWJsZXMgPSB7fTtcblx0dGhpcy50YWJsZUxpc3QgPSBbXTtcblx0dGhpcy5nbHlwaHMgPSBbXTtcblx0dGhpcy5JdGVtVmFyaWF0aW9uU3RvcmVzID0ge307IC8vIGtleXMgd2lsbCBiZSBcImF2YXJcIiwgXCJNVkFSXCIsIFwiQ09MUlwiLCBcIkNGRjJcIiwgXCJIVkFSXCIsIFwiVlZBUlwiLi4uIHRoZXkgYWxsIGdldCByZWNhbGN1bGF0ZWQgd2hlbiBhIG5ldyBpbnN0YW5jZSBpcyByZXF1ZXN0ZWRcblx0dGhpcy50YWJsZURlY29kZXJzID0gVEFCTEVfREVDT0RFUlM7IC8vIHdlIGFzc2lnbiBpdCBoZXJlIHNvIHdlIGhhdmUgYWNjZXNzIHRvIGl0IGluIGNvZGUgdGhhdCBpbXBvcnRzIHRoZSBsaWJyYXJ5XG5cblx0Ly8gZm9udCBoZWFkZXJcblx0dGhpcy5oZWFkZXIgPSBidWYuZGVjb2RlKEZPUk1BVFMuVGFibGVEaXJlY3RvcnkpO1xuXG5cdC8vIGNyZWF0ZSB0YWJsZSBkaXJlY3Rvcnlcblx0Zm9yIChsZXQgdD0wOyB0PHRoaXMuaGVhZGVyLm51bVRhYmxlczsgdCsrKSB7XG5cdFx0Y29uc3QgdGFibGUgPSBidWYuZGVjb2RlKEZPUk1BVFMuVGFibGVSZWNvcmQpO1xuXHRcdHRoaXMudGFibGVMaXN0LnB1c2godGhpcy50YWJsZXNbdGFibGUudGFnXSA9IHRhYmxlKTtcblx0fVxuXG5cdC8vIGxvYWQgdGFibGVzIGluIHRoZSBmb2xsb3dpbmcgb3JkZXJcblx0Y29uc3QgcmVxdWVzdFRhYmxlcyA9IFtcIm5hbWVcIixcImNtYXBcIixcIk9TLzJcIixcIm1heHBcIixcImhlYWRcIixcImhoZWFcIixcImhtdHhcIixcInZoZWFcIixcInZtdHhcIixcInBvc3RcIixcImZ2YXJcIixcImd2YXJcIixcImF2YXJcIixcIkNPTFJcIixcIkNQQUxcIixcIk1WQVJcIixcIkhWQVJcIixcIlZWQVJcIixcIlNUQVRcIixcIkdERUZcIixcIkdQT1NcIixcIkdTVUJcIixcIkJBU0VcIl07XG5cdGNvbnN0IHJlcXVpcmVUYWJsZXMgPSBbXCJuYW1lXCIsXCJjbWFwXCIsXCJPUy8yXCIsXCJtYXhwXCIsXCJoZWFkXCIsXCJoaGVhXCIsXCJobXR4XCIsXCJwb3N0XCJdO1xuXG5cdHJlcXVlc3RUYWJsZXMuZm9yRWFjaCh0YWcgPT4ge1xuXHRcdGlmICghdGhpcy50YWJsZXNbdGFnXSAmJiByZXF1aXJlVGFibGVzLmluY2x1ZGVzKHRhZykpIHtcblx0XHRcdGNvbnNvbGUuYXNzZXJ0KHRoaXMudGFibGVzW3RhZ10sIFwiRVJST1I6IE1pc3NpbmcgcmVxdWlyZWQgdGFibGU6IFwiLCB0YWcpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnRhYmxlc1t0YWddKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIkxvYWRpbmcgdGFibGU6IFwiLCB0YWcpO1xuXHRcdFx0Y29uc3QgdGJ1ZiA9IHRoaXMuYnVmZmVyRnJvbVRhYmxlKHRhZyk7IC8vIHdvdWxkbuKAmXQgaXQgYmUgYSBnb29kIGlkZWEgdG8gc3RvcmUgYWxsIHRoZXNlIGJ1ZmZlcnMgYXMgZm9udC5hdmFyLmJ1ZmZlciwgZm9udC5DT0xSLmJ1ZmZlciwgZXRjLiA/XG5cblx0XHRcdC8vIGRlY29kZSBmaXJzdCBwYXJ0IG9mIHRhYmxlXG5cdFx0XHRpZiAoRk9STUFUU1t0YWddKSB7XG5cdFx0XHRcdHRoaXNbdGFnXSA9IHRidWYuZGVjb2RlKEZPUk1BVFNbdGFnXSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGRlY29kZSBtb3JlIG9mIHRoZSB0YWJsZVxuXHRcdFx0aWYgKHRoaXMudGFibGVEZWNvZGVyc1t0YWddKSB7XG5cdFx0XHRcdHRoaXMudGFibGVEZWNvZGVyc1t0YWddKHRoaXMsIHRidWYpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0Ly8gbG9hZCBJdGVtVmFyaWF0aW9uU3RvcmVzXG5cdGNvbnN0IGl2c1RhZ3MgPSBbXCJhdmFyXCIsIFwiTVZBUlwiLCBcIkhWQVJcIiwgXCJWVkFSXCIsIFwiQ09MUlwiXTtcblx0aXZzVGFncy5mb3JFYWNoKHRhZyA9PiB7XG5cdFx0aWYgKHRoaXNbdGFnXSAmJiB0aGlzW3RhZ10uaXRlbVZhcmlhdGlvblN0b3JlT2Zmc2V0KSB7IC8vIGlmIGl0ZW1WYXJpYXRpb25TdG9yZU9mZnNldCA9PSAwIChsZWdpdGltYXRlIGF0IGxlYXN0IGluIGF2YXIpLCBkbyBub3RoaW5nXG5cdFx0XHRidWYuc2Vlayh0aGlzLnRhYmxlc1t0YWddLm9mZnNldCArIHRoaXNbdGFnXS5pdGVtVmFyaWF0aW9uU3RvcmVPZmZzZXQpO1xuXHRcdFx0dGhpc1t0YWddLml0ZW1WYXJpYXRpb25TdG9yZSA9IHRoaXMuSXRlbVZhcmlhdGlvblN0b3Jlc1t0YWddID0gYnVmLmRlY29kZUl0ZW1WYXJpYXRpb25TdG9yZSgpO1xuXHRcdFx0Y29uc29sZS5hc3NlcnQodGhpc1t0YWddLml0ZW1WYXJpYXRpb25TdG9yZS5heGlzQ291bnQgPT0gdGhpcy5mdmFyLmF4aXNDb3VudCwgXCJheGlzQ291bnQgbWlzbWF0Y2ggaW4gSXRlbVZhcmlhdGlvblN0b3JlXCIpO1xuXHRcdH1cblx0fSk7XG5cblx0Ly8gb3B0aW9ucy5hbGxHbHlwaHM6IGxvYWQgYWxsIGdseXBoc1xuXHRpZiAob3B0aW9ucy5hbGxHbHlwaHMpIHtcblx0XHRsZXQgc3RhcnQsIGVuZDtcblx0XHRsZXQgb2Zmc2V0ID0gMDtcblx0XHQvL3N0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cdFx0Ly8gd2Ugc2hvdWxkIGRvIHRoaXMgZGlmZmVyZW50bHkgaWYgdGhlIGZvbnQgaXMgb25seSBsaWdodGx5IGxvYWRlZCwgZS5nLiBmcm9tIGEgYmlnIGZpbGUgdGhhdCB3ZSBkb27igJl0IHdhbnQgdG8gbG9hZCBpbiBmdWxsXG5cdFx0Zm9yIChsZXQgZz0wOyBnPHRoaXMubWF4cC5udW1HbHlwaHM7IGcrKykge1xuXHRcdFx0dGhpcy5idWYuc2Vlayh0aGlzLnRhYmxlcy5sb2NhLm9mZnNldCArIChnKzEpICogKHRoaXMuaGVhZC5pbmRleFRvTG9jRm9ybWF0ID8gNCA6IDIpKTtcblx0XHRcdGNvbnN0IG5leHRPZmZzZXQgPSB0aGlzLmhlYWQuaW5kZXhUb0xvY0Zvcm1hdCA/IGJ1Zi51MzIgOiBidWYudTE2ICogMjtcblx0XHRcdGJ1Zi5zZWVrKHRoaXMudGFibGVzLmdseWYub2Zmc2V0ICsgb2Zmc2V0KTtcblx0XHRcdHRoaXMuZ2x5cGhzW2ddID0gYnVmLmRlY29kZUdseXBoKHtpZDogZywgZm9udDogdGhpcywgbGVuZ3RoOiBuZXh0T2Zmc2V0IC0gb2Zmc2V0fSk7XG5cdFx0XHRvZmZzZXQgPSBuZXh0T2Zmc2V0O1xuXHRcdH1cblx0XHQvL2VuZCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG5cdFx0Ly8gb3B0aW9ucy5hbGxUVlRzOiBsb2FkIGFsbCBUVlRzP1xuXHRcdGlmIChvcHRpb25zLmFsbFRWVHMgJiYgdGhpcy5ndmFyKSB7XG5cdFx0XHRjb25zdCBndmFyID0gdGhpcy5ndmFyO1xuXHRcdFx0Y29uc3QgZ3ZhckJ1ZiA9IHRoaXMuYnVmZmVyRnJvbVRhYmxlKFwiZ3ZhclwiKTtcblx0XHRcdC8vc3RhcnQgPSBwZXJmb3JtYW5jZS5ub3coKTtcblx0XHRcdGZvciAobGV0IGc9MDsgZzx0aGlzLm1heHAubnVtR2x5cGhzOyBnKyspIHtcblxuXHRcdFx0XHRpZiAoIXRoaXMuZ2x5cGhzW2ddLmZvbnQpXG5cdFx0XHRcdFx0Y29uc29sZS5sb2codGhpcy5nbHlwaHNbZ10pXG5cblx0XHRcdFx0aWYgKGd2YXIudHVwbGVPZmZzZXRzW2crMV0gPiBndmFyLnR1cGxlT2Zmc2V0c1tnXSkgeyAvLyBkbyB3ZSBoYXZlIFRWVCBkYXRhP1xuXHRcdFx0XHRcdGd2YXJCdWYuc2VlayhndmFyLmdseXBoVmFyaWF0aW9uRGF0YUFycmF5T2Zmc2V0ICsgZ3Zhci50dXBsZU9mZnNldHNbZ10pO1xuXHRcdFx0XHRcdHRoaXMuZ2x5cGhzW2ddLnR2dHMgPSBndmFyQnVmLmRlY29kZVR2dHModGhpcy5nbHlwaHNbZ10pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuZ2x5cGhzW2ddLnR2dHMgPSBbXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly9lbmQgPSBwZXJmb3JtYW5jZS5ub3coKTtcblx0XHRcdGNvbnNvbGUubG9nKGAke3RoaXMuZ2x5cGhzLmxlbmd0aH0gVFZUcyBsb2FkZWQgaW4gYCArIChlbmQgLSBzdGFydCkgKyBcIiBtc1wiKTtcdFxuXHRcdH1cblx0fVxufVxuXG5TYW1zYUZvbnQucHJvdG90eXBlLnZhbGlkYXRlQ2hlY2tzdW1zID0gZnVuY3Rpb24gKCkge1xuXHRjb25zdCBlcnJvcnMgPSBbXTtcblx0Zm9udC50YWJsZUxpc3QuZm9yRWFjaCh0YWJsZSA9PiB7XG5cdFx0bGV0IGFjdHVhbFN1bSA9IGZvbnQuYnVmLmNoZWNrU3VtKHRhYmxlLm9mZnNldCwgdGFibGUubGVuZ3RoLCB0YWJsZS50YWcgPT0gXCJoZWFkXCIpO1xuXHRcdGlmICh0YWJsZS5jaGVja1N1bSAhPT0gYWN0dWFsU3VtKSB7XG5cdFx0XHRlcnJvcnMucHVzaChbdGFibGUudGFnLCB0YWJsZS50YWJsZS5jaGVja1N1bSwgYWN0dWFsU3VtXSk7XG5cdFx0fVxuXHR9KTtcblx0cmV0dXJuIGVycm9ycztcbn1cblxuU2Ftc2FGb250LnByb3RvdHlwZS5idWZmZXJGcm9tVGFibGUgPSBmdW5jdGlvbiAodGFnKSB7XG5cdHJldHVybiBuZXcgU2Ftc2FCdWZmZXIodGhpcy5idWYuYnVmZmVyLCB0aGlzLnRhYmxlc1t0YWddLm9mZnNldCwgdGhpcy50YWJsZXNbdGFnXS5sZW5ndGgpO1xufVxuXG5TYW1zYUZvbnQucHJvdG90eXBlLml0ZW1WYXJpYXRpb25TdG9yZUluc3RhbnRpYXRlID0gZnVuY3Rpb24gKGl2cywgdHVwbGUpIHtcblx0Y29uc3Qgc2NhbGFycyA9IHRoaXMuZ2V0VmFyaWF0aW9uU2NhbGFycyhpdnMsIHR1cGxlKTsgLy8gZ2V0IHRoZSByZWdpb24gc2NhbGFyczogd2UgZ2V0IHRoaXMgb25seSBPTkNFIHBlciBpbnN0YW5jZVxuXHRjb25zdCBpbnRlcnBvbGF0ZWREZWx0YXMgPSBbXTsgLy8gYSAyZCBhcnJheSBtYWRlIG9mIChpdmQuZGVsdGFTZXRzLmxlbmd0aCkgYXJyYXlzIG9mIGludGVycG9sYXRlZCBkZWx0YSB2YWx1ZXNcblx0aXZzLml2ZHMuZm9yRWFjaCgoaXZkLCBpKSA9PiB7XG5cdFx0aW50ZXJwb2xhdGVkRGVsdGFzW2ldID0gW107XG5cdFx0aXZkLmRlbHRhU2V0cy5mb3JFYWNoKGRlbHRhU2V0ID0+IHtcblx0XHRcdGxldCBkID0gMDtcblx0XHRcdGRlbHRhU2V0LmZvckVhY2goKGRlbHRhLCByKSA9PiBkICs9IHNjYWxhcnNbaXZkLnJlZ2lvbklkc1tyXV0gKiBkZWx0YSk7IC8vIHRoaXMgaXMgd2hlcmUgdGhlIGdvb2Qgc3R1ZmYgaGFwcGVucyFcblx0XHRcdGludGVycG9sYXRlZERlbHRhc1tpXS5wdXNoKGQpO1xuXHRcdH0pO1xuXHR9KTtcblx0cmV0dXJuIGludGVycG9sYXRlZERlbHRhczsgLy8gMmQgYXJyYXkgb2YgdmFsdWVzIHRoYXQgbmVlZCB0byBiZSBhZGRlZCB0byB0aGUgaXRlbXMgdGhleSBhcHBseSB0b1xuXHQvLyBhbHRob3VnaCBkZWx0YSB2YWx1ZXMgYXJlIGFsd2F5cyBpbnRlZ2VycywgdGhlIGludGVycG9sYXRlZCBkZWx0YXMgd2lsbCBub3cgYmUgZmxvYXRpbmcgcG9pbnQgKGluIGdlbmVyYWwpXG5cdC8vIEhNTSwgc2hvdWxkbuKAmXQgdGhlIGxpc3Qgb2YgZGVsdGFzIHBlciBpdGVtIGNvbGxhcHNlIHRvIGEgc2luZ2xlIGl0ZW0/XG5cdC8vIFRIVVM6XG5cblx0Lypcblx0Y29uc3Qgc2NhbGFycyA9IHRoaXMuZ2V0VmFyaWF0aW9uU2NhbGFycyhpdnMsIHR1cGxlKTsgLy8gZ2V0IHRoZSByZWdpb24gc2NhbGFyczogd2UgZ2V0IHRoaXMgb25seSBPTkNFIHBlciBpbnN0YW5jZVxuXHRjb25zdCBpbnRlcnBvbGF0ZWREZWx0YXMgPSBbXTsgLy8gYSAyZCBhcnJheSBtYWRlIG9mIChpdmQuZGVsdGFTZXRzLmxlbmd0aCkgYXJyYXlzIG9mIGludGVycG9sYXRlZCBkZWx0YSB2YWx1ZXNcblx0aXZzLml2ZHMuZm9yRWFjaCgoaXZkLCBpKSA9PiB7XG5cdFx0aW50ZXJwb2xhdGVkRGVsdGFzW2ldID0gMDtcblx0XHRpdmQuZGVsdGFTZXRzLmZvckVhY2goZGVsdGFTZXQgPT4ge1xuXHRcdFx0bGV0IGQgPSAwO1xuXHRcdFx0ZGVsdGFTZXQuZm9yRWFjaCgoZGVsdGEsIHIpID0+IGQgKz0gc2NhbGFyc1tpdmQucmVnaW9uSWRzW3JdXSAqIGRlbHRhKTsgLy8gdGhpcyBpcyB3aGVyZSB0aGUgZ29vZCBzdHVmZiBoYXBwZW5zIVxuXHRcdFx0aW50ZXJwb2xhdGVkRGVsdGFzW2ldICs9IGQ7XG5cdFx0XHQvLyBjb3VsZCB3ZSBkbyB0aGUgYWJvdmUgd2l0aCBhIHJlZHVjZT8gYW5kIG1heWJlIHRoZSBlbmNsb3NpbmcgdGhpbmcgaW4gYW5vdGhlciByZWR1Y2U/XG5cdFx0fSk7XG5cdH0pO1xuXHRyZXR1cm4gaW50ZXJwb2xhdGVkRGVsdGFzOyAvLyAyZCBhcnJheSBvZiB2YWx1ZXMgdGhhdCBuZWVkIHRvIGJlIGFkZGVkIHRvIHRoZSBpdGVtcyB0aGV5IGFwcGx5IHRvXG5cblx0Ly8gSE1NLCBtYXliZSBub3QuLi4gdGhlIGlubmVyL291dGVyIHRoaW5nIGlzIGVzc2VudGlhbCB0byBrZWVwXG5cdCovXG5cblxufVxuXG5TYW1zYUZvbnQucHJvdG90eXBlLmdldFZhcmlhdGlvblNjYWxhciA9IGZ1bmN0aW9uIChyZWdpb24sIGF4aXNDb3VudD10aGlzLmZ2YXIuYXhpc0NvdW50KSB7XG5cdGxldCBTID0gMTsgLy8gUyB3aWxsIGVuZCB1cCBpbiB0aGUgcmFuZ2UgWzAsIDFdXG5cdGZvciAobGV0IGE9MDsgYSA8IGF4aXNDb3VudDsgYSsrKSB7XG5cdFx0Y29uc3QgW3N0YXJ0LCBwZWFrLCBlbmRdID0gcmVnaW9uW2FdOyAvLyByZWdpb25bYV0gaXMgYSBsaW5lYXJSZWdpb25cblx0XHRpZiAocGVhayAhPT0gMCkgeyAvLyBkb2VzIHRoZSBsaW5lYXJSZWdpb24gcGFydGljaXBhdGUgaW4gdGhlIGNhbGN1bGF0aW9uP1xuXHRcdFx0Y29uc3QgdiA9IHR1cGxlW2FdOyAvLyB2IGlzIHRoZSBh4oCZdGggbm9ybWFsaXplZCBheGlzIHZhbHVlIGZyb20gdGhlIHR1cGxlXG5cdFx0XHRpZiAodiA9PSAwKSB7XG5cdFx0XHRcdFMgPSAwO1xuXHRcdFx0XHRicmVhazsgLy8gemVybyBzY2FsYXIsIHdoaWNoIG1ha2VzIFM9MCwgc28gcXVpdCBsb29wIChtYXliZSB0aGlzIGlzIG1vcmUgY29tbW9uIHRoYW4gdGhlIHY9PXBlYWsgY2FzZSwgc28gc2hvdWxkIGJlIHRlc3RlZCBmaXJzdClcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKHYgIT09IHBlYWspIHsgLy8gd2UgY291bGQgbGV0IHRoZSB2PT1wZWFrIGNhc2UgZmFsbCB0aHJvdWdoLCBidXQgaXTigJlzIGNvbW1vbiBzbyB3b3J0aCB0ZXN0aW5nIGZpcnN0XG5cdFx0XHRcdGNvbnN0IHZNc3RhcnQgPSB2IC0gc3RhcnQsIHZNZW5kID0gdiAtIGVuZDsgLy8gcHJlY2FsY3VsYXRpbmcgdGhlc2Ugc3BlZWRzIHRoaW5ncyB1cCBhIGJpdFxuXHRcdFx0XHRpZiAodk1zdGFydCA8IDAgfHwgdk1lbmQgPiAwKSB7XG5cdFx0XHRcdFx0UyA9IDA7XG5cdFx0XHRcdFx0YnJlYWs7IC8vIHplcm8gc2NhbGFyLCB3aGljaCBtYWtlcyBTPTAsIHNvIHF1aXQgbG9vcCAobWF5YmUgdGhpcyBpcyBtb3JlIGNvbW1vbiB0aGFuIHRoZSB2PT1wZWFrIGNhc2UsIHNvIHNob3VsZCBiZSB0ZXN0ZWQgZmlyc3QpXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAodiA8IHBlYWspXG5cdFx0XHRcdFx0UyAqPSB2TXN0YXJ0IC8gKHBlYWsgLSBzdGFydCk7XG5cdFx0XHRcdGVsc2UgLy8gaWYgKHYgPiBwZWFrKSAvLyBiZWNhdXNlIHdlIGFscmVhZHkgdGVzdGVkIGFsbCBvdGhlciBwb3NzaWJpbGl0aWVzIChpbmNsdWRpbmcgdj09cGVhaykgd2UgY2FuIHJlbW92ZSB0aGlzIHRlc3QgYW5kIGp1c3QgaGF2ZSBcImVsc2VcIlxuXHRcdFx0XHRcdFMgKj0gdk1lbmQgLyAocGVhayAtIGVuZCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBTO1xufVxuXHRcbi8vIHByb2Nlc3MgSXRlbVZhcmlhdGlvblN0b3JlIHRvIGdldCBzY2FsYXJzIGZvciBhbiBpbnN0YW5jZSAoaW5jbHVkaW5nIGF2YXIyKVxuLy8gLSB0aGUgcmV0dXJuZWQgc2NhbGFyc1tuXSBhcnJheSBjb250YWlucyBhIHNjYWxhciBmb3IgZWFjaCByZWdpb24gKHRoZXJlZm9yZSByZWdpb25zLmxlbmd0aCA9PSBzY2FsYXJzLmxlbmd0aClcbi8vU2Ftc2FGb250LnByb3RvdHlwZS5nZXRWYXJpYXRpb25TY2FsYXJzID0gZnVuY3Rpb24gKHJlZ2lvbnMsIHR1cGxlKSB7XG5TYW1zYUZvbnQucHJvdG90eXBlLmdldFZhcmlhdGlvblNjYWxhcnMgPSBmdW5jdGlvbiAoaXZzLCB0dXBsZSkge1xuXHRjb25zdCBzY2FsYXJzID0gW107XG5cdGNvbnN0IHJlZ2lvbnMgPSBpdnMucmVnaW9ucztcblx0cmVnaW9ucy5mb3JFYWNoKHJlZ2lvbiA9PiB7IC8vIGZvciBlYWNoIHJlZ2lvbi4uLlxuXHRcdC8vIC4uLiBnbyB0aHJ1IGVhY2ggb2YgdGhlIGF4aXNDb3VudCBsaW5lYXJSZWdpb25zIGluIHRoZSByZWdpb25cblx0XHRsZXQgUyA9IDE7XG5cdFx0Zm9yIChsZXQgYT0wOyBhIDwgaXZzLmF4aXNDb3VudDsgYSsrKSB7XG5cdFx0XHRjb25zdCBbc3RhcnQsIHBlYWssIGVuZF0gPSByZWdpb25bYV07XG5cdFx0XHRpZiAocGVhayAhPT0gMCkgeyAvLyBkb2VzIHRoZSBsaW5lYXJSZWdpb24gcGFydGljaXBhdGUgaW4gdGhlIGNhbGN1bGF0aW9uP1xuXHRcdFx0XHRjb25zdCB2ID0gdHVwbGVbYV07IC8vIHYgaXMgdGhlIGHigJl0aCBub3JtYWxpemVkIGF4aXMgdmFsdWUgZnJvbSB0aGUgdHVwbGVcblx0XHRcdFx0aWYgKHYgPT0gMCkge1xuXHRcdFx0XHRcdFMgPSAwO1xuXHRcdFx0XHRcdGJyZWFrOyAvLyB6ZXJvIHNjYWxhciwgd2hpY2ggbWFrZXMgUz0wLCBzbyBxdWl0IGxvb3AgKG1heWJlIHRoaXMgaXMgbW9yZSBjb21tb24gdGhhbiB0aGUgdj09cGVhayBjYXNlLCBzbyBzaG91bGQgYmUgdGVzdGVkIGZpcnN0KVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKHYgIT09IHBlYWspIHsgLy8gd2UgY291bGQgbGV0IHRoZSB2PT1wZWFrIGNhc2UgZmFsbCB0aHJvdWdoLCBidXQgaXTigJlzIGNvbW1vbiBzbyB3b3J0aCB0ZXN0aW5nIGZpcnN0XG5cdFx0XHRcdFx0Y29uc3Qgdk1zdGFydCA9IHYgLSBzdGFydCwgdk1lbmQgPSB2IC0gZW5kOyAvLyBwcmVjYWxjdWxhdGluZyB0aGVzZSBzcGVlZHMgdGhpbmdzIHVwIGEgYml0XG5cdFx0XHRcdFx0aWYgKHZNc3RhcnQgPCAwIHx8IHZNZW5kID4gMCkge1xuXHRcdFx0XHRcdFx0UyA9IDA7XG5cdFx0XHRcdFx0XHRicmVhazsgLy8gemVybyBzY2FsYXIsIHdoaWNoIG1ha2VzIFM9MCwgc28gcXVpdCBsb29wIChtYXliZSB0aGlzIGlzIG1vcmUgY29tbW9uIHRoYW4gdGhlIHY9PXBlYWsgY2FzZSwgc28gc2hvdWxkIGJlIHRlc3RlZCBmaXJzdClcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAodiA8IHBlYWspXG5cdFx0XHRcdFx0XHRTICo9IHZNc3RhcnQgLyAocGVhayAtIHN0YXJ0KTtcblx0XHRcdFx0XHRlbHNlIGlmICh2ID4gcGVhaykgLy8gYmVjYXVzZSB3ZSBhbHJlYWR5IHRlc3RlZCBhbGwgb3RoZXIgcG9zc2liaWxpdGllcyAoaW5jbHVkaW5nIHY9PXBlYWspIHdlIGNvdWxkIHJlbW92ZSB0aGlzIHRlc3QgYW5kIGp1c3QgaGF2ZSBcImVsc2VcIlxuXHRcdFx0XHRcdFx0UyAqPSB2TWVuZCAvIChwZWFrIC0gZW5kKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRzY2FsYXJzLnB1c2goUyk7XG5cdH0pO1xuXHRyZXR1cm4gc2NhbGFycztcbn1cblxuU2Ftc2FGb250LnByb3RvdHlwZS5sb2FkR2x5cGhCeUlkID0gZnVuY3Rpb24gKGlkKSB7XG5cdHRoaXMuYnVmLnNlZWsodGhpcy50YWJsZXMubG9jYS5vZmZzZXQgKyBpZCAqICh0aGlzLmhlYWQuaW5kZXhUb0xvY0Zvcm1hdCA/IDQgOiAyKSk7XG5cdGNvbnN0IG9mZnNldCA9IHRoaXMuaGVhZC5pbmRleFRvTG9jRm9ybWF0ID8gW2J1Zi51MzIsIGJ1Zi51MzJdIDogW2J1Zi51MTYgKiAyLCBidWYudTE2ICogMl07XG5cdGJ1Zi5zZWVrKHRoaXMudGFibGVzLmdseWYub2Zmc2V0ICsgb2Zmc2V0KTtcblx0dGhpcy5nbHlwaHNbZ10gPSBidWYuZGVjb2RlR2x5cGgoe2lkOiBpZCwgZm9udDogdGhpcywgbGVuZ3RoOiBvZmZzZXRzWzFdIC0gb2Zmc2V0c1swXX0pO1xufVxuXG4vLyBTYW1zYUZvbnQuZ2x5cGhJZEZyb21Vbmljb2RlKCkg4oCTwqByZXR1cm5zIGdseXBoSWQgZm9yIGEgZ2l2ZW4gdW5pY29kZSBjb2RlIHBvaW50XG4vLyB1bmk6IHRoZSBjb2RlIHBvaW50XG4vLyByZXR1cm46IHRoZSBnbHlwaElkICgwIGlmIG5vdCBmb3VuZClcbi8vIE5vdGVzOiBIYW5kbGVzIGZvcm1hdHMgMSwgNCwgMTIuXG5TYW1zYUZvbnQucHJvdG90eXBlLmdseXBoSWRGcm9tVW5pY29kZSA9IGZ1bmN0aW9uICh1bmkpIHtcblxuXHRjb25zdCBjbWFwID0gdGhpcy5jbWFwO1xuXHRjb25zdCBjaGFyYWN0ZXJNYXAgPSBjbWFwLmNoYXJhY3Rlck1hcDtcblx0Y29uc3QgdGJ1ZiA9IHRoaXMuYnVmZmVyRnJvbVRhYmxlKFwiY21hcFwiKTtcblx0bGV0IGc9MDtcblxuXHRzd2l0Y2ggKGNoYXJhY3Rlck1hcC5mb3JtYXQpIHtcblxuXHRcdGNhc2UgMToge1xuXHRcdFx0Ly9nID0gY2hhcmFjdGVyTWFwLm1hcHBpbmcodW5pKSA/PyAwO1xuXHRcdFx0ZyA9IGNoYXJhY3Rlck1hcC5tYXBwaW5nKHVuaSkgPyBjaGFyYWN0ZXJNYXAubWFwcGluZyh1bmkpIDogMDtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdGNhc2UgNDoge1xuXHRcdFx0Ly8gYWxnbzogaHR0cHM6Ly9sZWFybi5taWNyb3NvZnQuY29tL2VuLXVzL3R5cG9ncmFwaHkvb3BlbnR5cGUvc3BlYy9jbWFwI2Zvcm1hdC00LXNlZ21lbnQtbWFwcGluZy10by1kZWx0YS12YWx1ZXNcblx0XHRcdGxldCBzLCBzZWdtZW50O1xuXHRcdFx0Zm9yIChzPTA7IHM8Y2hhcmFjdGVyTWFwLnNlZ21lbnRzLmxlbmd0aDsgcysrKSB7IC8vIHRoaXMgY291bGQgYmUgYSBiaW5hcnkgc2VhcmNoXG5cdFx0XHRcdHNlZ21lbnQgPSBjaGFyYWN0ZXJNYXAuc2VnbWVudHNbc107XG5cdFx0XHRcdGlmICh1bmkgPj0gc2VnbWVudC5zdGFydCAmJiB1bmkgPD0gc2VnbWVudC5lbmQpIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAocyA8IGNoYXJhY3Rlck1hcC5zZWdtZW50cy5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdGlmIChzZWdtZW50LmlkUmFuZ2VPZmZzZXQpIHtcblx0XHRcdFx0XHR0YnVmLnNlZWsoY2hhcmFjdGVyTWFwLmlkUmFuZ2VPZmZzZXRPZmZzZXQgKyBzICogMiArIHNlZ21lbnQuaWRSYW5nZU9mZnNldCArICh1bmkgLSBzZWdtZW50LnN0YXJ0KSAqIDIpO1xuXHRcdFx0XHRcdGcgPSB0YnVmLnUxNjtcblx0XHRcdFx0XHRpZiAoZyA+IDApXG5cdFx0XHRcdFx0XHRnICs9IHNlZ21lbnQuaWREZWx0YTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRnID0gdW5pICsgc2VnbWVudC5pZERlbHRhO1xuXHRcdFx0XHR9XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRnICU9IDB4MTAwMDA7XG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRjYXNlIDEyOiB7XG5cdFx0XHRmb3IgKGxldCBncnA9MDsgZ3JwPGNoYXJhY3Rlck1hcC5ncm91cHMubGVuZ3RoOyBncnArKykge1xuXHRcdFx0XHRjb25zdCBncm91cCA9IGNoYXJhY3Rlck1hcC5ncm91cHNbZ3JwXTtcblx0XHRcdFx0aWYgKHVuaSA+PSBncm91cC5zdGFydCAmJiB1bmkgPD0gZ3JvdXAuZW5kKSB7XG5cdFx0XHRcdFx0ZyA9IGdyb3VwLmdseXBoSWQgKyB1bmkgLSBncm91cC5zdGFydDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdGJyZWFrO1xuXHR9XG5cblx0cmV0dXJuIGc7XG59XG5cblxuLy8gdXRpbGl0eSBmdW5jdGlvbnNcbi8vIC0gdGhlc2UgZG9u4oCZdCB1c2UgdGhlIGZvbnQgYXQgYWxsLCBidXQgaXTigJlzIGEgd2F5IHRvIGdldCB0aGVtIGV4cG9ydGVkXG5TYW1zYUZvbnQucHJvdG90eXBlLmxpbmVhckdyYWRpZW50RnJvbVRocmVlUG9pbnRzID0gZnVuY3Rpb24gKHBvaW50cykge1xuXHRjb25zdFxuXHRcdHAweCA9IHBvaW50c1swXVswXSxcblx0XHRwMHkgPSBwb2ludHNbMF1bMV0sXG5cdFx0cDF4ID0gcG9pbnRzWzFdWzBdLFxuXHRcdHAxeSA9IHBvaW50c1sxXVsxXSxcblx0XHRwMnggPSBwb2ludHNbMl1bMF0sXG5cdFx0cDJ5ID0gcG9pbnRzWzJdWzFdLFxuXHRcdGQxeCA9IHAxeCAtIHAweCxcblx0XHRkMXkgPSBwMXkgLSBwMHksXG5cdFx0ZDJ4ID0gcDJ4IC0gcDB4LFxuXHRcdGQyeSA9IHAyeSAtIHAweSxcblx0XHRkb3RQcm9kID0gZDF4KmQyeCArIGQxeSpkMnksXG5cdFx0cm90TGVuZ3RoU3F1YXJlZCA9IGQyeCpkMnggKyBkMnkqZDJ5LFxuXHRcdG1hZ25pdHVkZSA9IGRvdFByb2QgLyByb3RMZW5ndGhTcXVhcmVkLFxuXHRcdGZpbmFsWCA9IHAxeCAtIG1hZ25pdHVkZSAqIGQyeCxcblx0XHRmaW5hbFkgPSBwMXkgLSBtYWduaXR1ZGUgKiBkMnk7XG5cblx0cmV0dXJuIFtmaW5hbFgsIGZpbmFsWV07XG59XG5cblNhbXNhRm9udC5wcm90b3R5cGUuaGV4Q29sb3JGcm9tVTMyID0gZnVuY3Rpb24gKG51bSkge1xuXHRsZXQgaGV4ID0gKCgoKG51bSAmIDB4ZmYwMDAwMDApID4+PiAxNikgfCAobnVtICYgMHgwMGZmMDAwMCkgfCAoKG51bSAmIDB4MDAwMGZmMDApIDw8IDE2KSB8IG51bSAmIDB4MDAwMDAwZmYpID4+PiAwKS50b1N0cmluZygxNikucGFkU3RhcnQoOCwgXCIwXCIpO1xuXHRpZiAoaGV4LmVuZHNXaXRoKFwiZmZcIikpXG5cdFx0aGV4ID0gaGV4LnN1YnN0cmluZygwLCA2KTtcblx0aWYgKGhleFswXSA9PSBoZXhbMV0gJiYgaGV4WzJdID09IGhleFszXSAmJiBoZXhbNF0gPT0gaGV4WzVdICYmIChoZXgubGVuZ3RoID09IDggPyBoZXhbNl0gPT0gaGV4WzddIDogdHJ1ZSkpXG5cdFx0aGV4ID0gaGV4WzBdICsgaGV4WzJdICsgaGV4WzRdICsgKGhleC5sZW5ndGggPT0gOCA/IGhleFs2XSA6IFwiXCIpO1xuXHRyZXR1cm4gXCIjXCIgKyBoZXg7XG59XG5cblNhbXNhRm9udC5wcm90b3R5cGUudTMyRnJvbUhleENvbG9yID0gZnVuY3Rpb24gKGhleCwgb3BhY2l0eT0xKSB7XG5cdGlmIChoZXhbMF0gPT0gXCIjXCIpIHtcblx0XHRoZXggPSBoZXguc3Vic3RyaW5nKDEpO1xuXHR9XG5cdGlmIChoZXgubWF0Y2goL15bMC05YS1mXXszLDh9JC9pKSAmJiBoZXgubGVuZ3RoID09IDMgfHwgaGV4Lmxlbmd0aCA9PSA0IHx8IGhleC5sZW5ndGggPT0gNiB8fCBoZXgubGVuZ3RoID09IDgpIHtcblx0XHRpZiAoaGV4Lmxlbmd0aCA8PSA0KSB7XG5cdFx0XHRoZXggPSBoZXhbMF0gKyBoZXhbMF0gKyBoZXhbMV0gKyBoZXhbMV0gKyBoZXhbMl0gKyBoZXhbMl0gKyAoaGV4Lmxlbmd0aCA9PSA0ID8gaGV4WzNdICsgaGV4WzNdIDogXCJcIik7XG5cdFx0fVxuXHRcdGlmIChoZXgubGVuZ3RoID09IDYpIHtcblx0XHRcdGhleCArPSAob3BhY2l0eSAqIDI1NSkudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsXCIwXCIpO1xuXHRcdH1cblx0XHRyZXR1cm4gcGFyc2VJbnQoaGV4LnN1YnN0cmluZyg0LDYpLCAxNikgKiAweDEwMDAwMDAgKyBwYXJzZUludChoZXguc3Vic3RyaW5nKDIsNCksIDE2KSAqIDB4MTAwMDAgKyBwYXJzZUludChoZXguc3Vic3RyaW5nKDAsMiksIDE2KSAqIDB4MTAwICsgcGFyc2VJbnQoaGV4LnN1YnN0cmluZyg2LDgpLCAxNik7XG5cdH1cblx0ZWxzZSB7XG5cdFx0cmV0dXJuIDB4MDAwMDAwZmY7IC8vIGJhY2sgdG8gYmxhY2tcblx0fVxufVxuXG4vLyAtIGdseXBoTGF5b3V0OiBhcnJheSBcbi8vIC0gcmV0dXJuOiBTVkcgcmVhZHkgdG8gdXNlLCBwcm9iYWJseSB3aXRoIGEgdHJhbnNmb3JtIGFuZCB2aWV3Ym94XG5TYW1zYUluc3RhbmNlLnByb3RvdHlwZS5zdmdGcm9tR2x5cGhMYXlvdXQgPSBmdW5jdGlvbiAoZ2x5cGhMYXlvdXQpIHtcblxuXHRnbHlwaExheW91dC5mb3JFYWNoKGdseXBoSW5SdW4gPT4ge1xuXHRcdGNvbnN0IFtnbHlwaElkLCB0cmFuc2xhdGVdID0gZ2x5cGhJblJ1bjtcblx0fSk7XG5cdHJldHVybiBzdmc7XG59XG5cblxuLy8gdGFrZSBhbiBhcnJheSBvZiBnbHlwaGlkcywgYW5kIHJldHVybiBhIHNlcXVlbmNlIG9mIGdseXBoaWRzIHdpdGggbGF5b3V0IGluZm9ybWF0aW9uXG4vLyAtIGdseXBoSWRzOiBhcnJheSBvZiBnbHlwaCBpZHNcbi8vIC0gcmV0dXJuOiBnbHlwaExheW91dCwgYW4gYXJyYXkgb2Ygb2JqZWN0cywgd2hlcmUgZWFjaCBvYmplY3QgaGFzIGEgZ2x5cGggYW5kIGFuIGFic29sdXRlIHh5IG9mZnNldFxuXG4vLyAtIG5vdGUgdGhhdCB3ZSBhcmUgbmV1dHJhbCBoZXJlIHJlZ2FyZGluZyBvdXRwdXQgZm9ybWF0XG4vLyAtIHNob3VsZG7igJl0IGl0IGJlIFNhbXNhSW5zdGFuY2U/P1xuU2Ftc2FJbnN0YW5jZS5wcm90b3R5cGUuZ2x5cGhMYXlvdXRGcm9tR2x5cGhSdW4gPSBmdW5jdGlvbiAoZ2x5cGhJZHMpIHtcblxuXHQvLyB3ZSBjYW4gdXNlIGhtdHgsIHZtdHgsIEhWQVIsIFZWQVIgZm9yIHRoaXNcblxuXHRjb25zdCBnbHlwaExheW91dCA9IFtdO1xuXG5cdGNvbnN0IGhvcml6b250YWxBZHZhbmNlID0gNzc3O1xuXHRjb25zdCB2ZXJ0aWNhbEFkdmFuY2UgPSA3Nzc7XG5cblx0Ly8gdWhoLi4uIGhhbmRsZSBPcGVuVHlwZSBMYXlvdXQgdGFibGVzIGhlcmUuLi4gR1NVQiwgR1BPUywgR0RFRi4uLlxuXG5cblx0Z2x5cGhJZHMuZm9yRWFjaChnbHlwaElkID0+IHtcblx0XHRcblx0XHRjb25zdCBsYXlvdXRPYmogPSB7XG5cdFx0XHRnbHlwaDogZ2x5cGhJZCxcblx0XHRcdGFkdmFuY2U6IFtob3Jpem9udGFsQWR2YW5jZSwgdmVydGljYWxBZHZhbmNlXSxcblx0XHR9XG5cblx0XHRnbHlwaExheW91dC5wdXNoKGxheW91dE9iaik7XG5cdH0pO1xuXHRcblx0cmV0dXJuIGdseXBoTGF5b3V0O1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vICB0dXBsZUZyb21GdnMoKVxuLy8gLSBmdnMgaXMgYW4gb2JqZWN0IHdoZXJlIGF4aXMgdGFncyBhcmUga2V5cyBhbmQgYXhpcyB2YWx1ZXMgYXJlIHZhbHVlc1xuLy8gLSByZXR1cm5zOiBhIHR1cGxlIG9mIGxlbmd0aCB0aGlzLmF4aXNDb3VudCwgd2l0aCB2YWx1ZXMgbm9ybWFsaXplZCAqd2l0aG91dCogYXZhciBtYXBwaW5nOyB0aGlzIHR1cGxlIGlzIHN1aXRhYmxlIHRvIHN1cHBseSBuZXcgU2Ftc2FJbnN0YW5jZSgpXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5TYW1zYUZvbnQucHJvdG90eXBlLnR1cGxlRnJvbUZ2cyA9IGZ1bmN0aW9uIChmdnMpIHtcblxuXHRsZXQgdHVwbGUgPSBbXTtcblx0bGV0IHZhbGlkID0gdHJ1ZTtcblx0aWYgKCF0aGlzLmZ2YXIpXG5cdFx0cmV0dXJuIHR1cGxlO1xuXG5cdHRoaXMuZnZhci5heGVzLmZvckVhY2goKGF4aXMsYSkgPT4ge1xuXHRcdGNvbnN0IHZhbCA9ICghZnZzIHx8IGZ2c1theGlzLmF4aXNUYWddID09PSB1bmRlZmluZWQpID8gYXhpcy5kZWZhdWx0VmFsdWUgOiAxICogZnZzW2F4aXMuYXhpc1RhZ107XG5cdFx0bGV0IG47IC8vIG5vcm1hbGl6ZWQgdmFsdWVcblx0XHRpZiAodmFsID09IGF4aXMuZGVmYXVsdFZhbHVlKVxuXHRcdFx0biA9IDA7XG5cdFx0ZWxzZSBpZiAodmFsID4gYXhpcy5kZWZhdWx0VmFsdWUpIHtcblx0XHRcdGlmICh2YWwgPiBheGlzLm1heFZhbHVlKSAvLyBieSB1c2luZyA+IHJhdGhlciB0aGFuID49IGhlcmUgd2UgZW5zdXJlIGNsYW1waW5nIHdvcmtzIHByb3Blcmx5XG5cdFx0XHRcdG4gPSAxO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRuID0gYXhpcy5tYXhWYWx1ZT09YXhpcy5kZWZhdWx0VmFsdWU/IDAgOiAodmFsIC0gYXhpcy5kZWZhdWx0VmFsdWUpIC8gKGF4aXMubWF4VmFsdWUgLSBheGlzLmRlZmF1bHRWYWx1ZSk7XG5cdFx0fVxuXHRcdGVsc2UgeyAvLyB2YWwgPCBheGlzLmRlZmF1bHRWYWx1ZVxuXHRcdFx0aWYgKHZhbCA8IGF4aXMubWluVmFsdWUpXG5cdFx0XHRcdG4gPSAtMTtcblx0XHRcdGVsc2Vcblx0XHRcdFx0biA9IGF4aXMubWluVmFsdWU9PWF4aXMuZGVmYXVsdFZhbHVlPyAwIDogKGF4aXMuZGVmYXVsdFZhbHVlIC0gdmFsKSAvIChheGlzLm1pblZhbHVlIC0gYXhpcy5kZWZhdWx0VmFsdWUpO1xuXHRcdH1cblx0XHR0dXBsZVthXSA9IG47XG5cdH0pO1xuXG5cdHJldHVybiB2YWxpZCA/IHR1cGxlIDogQXJyYXkodGhpcy5mdmFyLmF4aXNDb3VudCkuZmlsbCgwKTtcbn1cblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFNhbXNhSW5zdGFuY2Vcbi8vIC0gZm9udCBpcyBhIFNhbXNhRm9udFxuLy8gLSB0dXBsZSBpcyBhIGZpbmFsIHR1cGxlLCBhZnRlciBwcm9jZXNzaW5nIGJ5IGF2YXIgLSBOTyBJVOKAmVMgTk9ULCBJVOKAmVMgVEhFIE9SSUdJTkFMIFRVUExFXG5mdW5jdGlvbiBTYW1zYUluc3RhbmNlKGZvbnQsIHVzZXJUdXBsZSwgb3B0aW9ucz17fSkge1xuXG5cdC8vY29uc29sZS5sb2coXCJJbiBTYW1zYUluc3RhbmNlIGNyZWF0aW5nIHdpdGggXCIsIHVzZXJUdXBsZSk7XG5cdHRoaXMuZm9udCA9IGZvbnQ7XG5cdGNvbnN0IHthdmFyLCBndmFyfSA9IGZvbnQ7IC8vIGRlc3RydWN0dXJlIHRhYmxlIGRhdGEgb2JqZWN0c1xuXHR0aGlzLnR1cGxlID0gWy4uLnVzZXJUdXBsZV07IC8vIGFueSBhdmFyMiBjaGFuZ2VzIHRvIHR1cGxlIGFyZSBwcmVzZXJ2ZWQgaW4gdGhlIGluc3RhbmNlIHZpYSB0aGlzLnR1cGxlOyBtYXliZSB3ZSBzaG91bGQga2VlcCB0aGUgdW50cmFuc2Zvcm1lZCB0dXBsZSBhcm91bmQgZm9yIFNhbXNhLXN0eWxlIGRlYnVnZ2luZyBldGMuXG5cdGNvbnN0IHR1cGxlID0gdGhpcy50dXBsZTtcblx0dGhpcy5nbHlwaHMgPSBbXTtcblx0dGhpcy5kZWx0YVNldHMgPSB7fTsgLy8gZGVsdGFTZXRzIGZyb20gSXRlbVZhcmlhdGlvblN0b3JlOiBrZXlzIGFyZSBcIk1WQVJcIiwgXCJDT0xSXCIgZXRjLiBOb3RlIHRoYXQgZWFjaCBzZXQgb2YgZGVsdGFzIGNvcnJlc3BvbmRzIHRvIGRpZmZlcmVudCB0eXBlcyBvZiBkZWZhdWx0IGl0ZW0uXG5cdHRoaXMuc2hhcmVkU2NhbGFycyA9IFtdOyAvLyBzY2FsYXJzIGZvciB0aGUgc2hhcmVkVHVwbGVzIGFyZSBjYWxjdWxhdGVkIGp1c3Qgb25jZSBwZXIgaW5zdGFuY2Vcblx0Y29uc3QgYnVmID0gZm9udC5idWY7XG5cdGNvbnN0IGF4aXNDb3VudCA9IGZvbnQuZnZhciA/IGZvbnQuZnZhci5heGlzQ291bnQgOiAwO1xuXG5cdC8vIHZhbGlkYXRlIHR1cGxlXG5cdGlmICghdmFsaWRhdGVUdXBsZSAodHVwbGUsIGF4aXNDb3VudCkpIHtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cblx0Ly8gcm91bmQgdHVwbGUgdG8gdGhlIG5lYXJlc3QgMS8xNjM4NCAoZW5zdXJlcyB3ZSBnZXQgZXhhY3RseSAwLCAxLCAtMSB3aGVuIHdlIGFyZSBvZmYgYnkgYSB0aW55IGFtb3VudClcblx0Ly8gLSB0aGUgc3BlYzogXCJDb252ZXJ0IHRoZSBmaW5hbCwgbm9ybWFsaXplZCAxNi4xNiBjb29yZGluYXRlIHZhbHVlIHRvIDIuMTQgYnkgdGhpcyBtZXRob2Q6IGFkZCAweDAwMDAwMDAyLCBhbmQgc2lnbi1leHRlbmQgc2hpZnQgdG8gdGhlIHJpZ2h0IGJ5IDIuXCIgaHR0cHM6Ly9sZWFybi5taWNyb3NvZnQuY29tL2VuLXVzL3R5cG9ncmFwaHkvb3BlbnR5cGUvc3BlYy9vdHZhcm92ZXJ2aWV3I2Nvb3JkaW5hdGUtc2NhbGVzLWFuZC1ub3JtYWxpemF0aW9uXG5cdGZvciAobGV0IGE9MDsgYTxheGlzQ291bnQ7IGErKykge1xuXHRcdHR1cGxlW2FdID0gTWF0aC5yb3VuZCh0dXBsZVthXSAqIDE2Mzg0KSAvIDE2Mzg0O1xuXHR9XG5cblx0Ly8gYXZhciBtYXBwaW5ncyBtdXN0IGNvbWUgZmlyc3QhIHNpbmNlIGFsbCBzdWJzZXF1ZW50IHZhcmlhdGlvbiBvcGVyYXRpb24gdXNlIHRoZSB0dXBsZSByZW1hcHBlZCBieSBhdmFyXG5cdC8vIC0gdGhlIHR1cGxlIHN1cHBsaWVkIHRvIHRoZSBTYW1zYUluc3RhbmNlKCkgY29uc3RydWN0b3IgaXMgbW9kaWZpZWQgaGVyZSAobWF5YmUgaXQgc2hvdWxkIGJlIGEgY29weSlcblx0Ly8gLSBtYXliZSBlbmNhcHN1bGF0ZSBhdmFyIHRyYW5zZm9ybSBpbiBhIGZ1bmN0aW9uXG5cdGlmIChhdmFyKSB7XG5cblx0XHQvLyBhdmFyMVxuXHRcdC8vIC0gdHJhbnNmb3JtIHR1cGxlIGludG8gYXZhci12MS1tYXBwZWQgdHVwbGUsIG9uZSBheGlzIGF0IGEgdGltZVxuXHRcdGF2YXIuYXhpc1NlZ21lbnRNYXBzLmZvckVhY2goKG1hcCxhKSA9PiB7XG5cdFx0XHRsZXQgbiA9IHR1cGxlW2FdO1xuXHRcdFx0Zm9yIChsZXQgbT0wOyBtPG1hcC5sZW5ndGg7IG0rKykge1xuXHRcdFx0XHRpZiAobWFwW21dWzBdID49IG4pIHtcblx0XHRcdFx0XHRpZiAobWFwW21dWzBdID09IG4pXG5cdFx0XHRcdFx0XHRuID0gbWFwW21dWzFdO1xuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdG4gPSBtYXBbbS0xXVsxXSArIChtYXBbbV1bMV0gLSBtYXBbbS0xXVsxXSkgKiAoICggbiAtIG1hcFttLTFdWzBdICkgLyAoIG1hcFttXVswXSAtIG1hcFttLTFdWzBdICkgKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dHVwbGVbYV0gPSBuO1xuXHRcdH0pO1xuXG5cdFx0Ly8gYXZhcjJcblx0XHQvLyAtIGluc3RhbnRpYXRlIHRoZSBhdmFyMiBJdGVtVmFyaWF0aW9uU3RvcmVcblx0XHRpZiAoYXZhci5pdGVtVmFyaWF0aW9uU3RvcmUpIHtcblxuXHRcdFx0Ly8gYXZhcjIgbWFwcGluZ3Ncblx0XHRcdGNvbnN0IGRlbHRhcyA9IGZvbnQuaXRlbVZhcmlhdGlvblN0b3JlSW5zdGFudGlhdGUoYXZhci5pdGVtVmFyaWF0aW9uU3RvcmUsIHR1cGxlKTtcblx0XHRcdFxuXHRcdFx0Ly8gZWFjaCBlbnRyeSBpbiBheGlzSW5kZXhNYXAgZGVmaW5lcyBob3cgYSBwYXJ0aWN1bGFyIGF4aXMgZ2V0cyBpbmZsdWVuY2VkIGJ5IHRoZSByZWdpb24gc2NhbGFyc1xuXHRcdFx0Ly8gLSBheGlzSWQgaXMgZ2l2ZW4gYnkgaW5kZXggaW4gYXhpc0luZGV4TWFwXG5cdFx0XHQvLyAtIG5vdGUgdGhhdCBzb21lIGF4ZXMgbWF5IG5vdCBoYXZlIGF2YXIyIHRyYW5zZm9ybWF0aW9uczogdGhleSBlaXRoZXIgaGF2ZSBlbnRyeT09WzB4ZmZmZiwweGZmZmZdIG9yIHRoZWlyIGF4aXNJZCBpcyA+PSBheGlzSW5kZXhNYXAubGVuZ3RoXG5cdFx0XHQvLyAtIGluZGV4IGlkZW50aWZpZXMgdGhlIHZhbHVlIGluIHRoZSAyZCBhcnJheSBpbnRlcnBvbGF0ZWREZWx0YXMgKHRoZSBzYW1lIGluZGV4aW5nIHRoYXQgaWRlbnRpZmllcyB0aGUgaXZkIGFuZCB0aGUgZGVsdGFTZXQgd2l0aGluIHRoZSBpdmQpXG5cdFx0XHQvLyAtIHdlIGl0ZXJhdGUgdGhyb3VnaCBhbGwgYXhlcywgc2luY2UgaXQgY291bGQgYmUgdGhhdCB0aGlzLmF2YXIuYXhpc0luZGV4TWFwLmxlbmd0aCA8IHRoaXMuYXhpc0NvdW50IHlldCB0aGUgbGFzdCBlbnRyeSBpbiB0aGlzLmF4aXNDb3VudCBpcyBub3QgMHhmZmZmLzB4ZmZmZiwgdGhpcyBtdXN0IGJlIHJlcGVhdGVkXG5cdFx0XHRmb3IgKGxldCBhPTA7IGE8YXhpc0NvdW50OyBhKyspIHtcblx0XHRcdFx0bGV0IG91dGVyLCBpbm5lcjtcblx0XHRcdFx0aWYgKGF2YXIuYXhpc0luZGV4TWFwKSB7XG5cdFx0XHRcdFx0W291dGVyLCBpbm5lcl0gPSBhdmFyLmF4aXNJbmRleE1hcFsgTWF0aC5taW4oYSwgYXZhci5heGlzSW5kZXhNYXAubGVuZ3RoIC0gMSkgXTsgLy8gdXNlIHRoZSBh4oCZdGggZW50cnkgb3IgdGhlIGxhc3QgZW50cnkgb2YgYXhpc0luZGV4TWFwXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7IC8vIGltcGxpY2l0IGF4aXNJbmRleE1hcFxuXHRcdFx0XHRcdG91dGVyID0gYSA+PiAxNjsgLy8geWVzLCBJIGtub3cgdGhpcyB3aWxsIGFsd2F5cyBiZSAwXG5cdFx0XHRcdFx0aW5uZXIgPSBhICYgMHhmZmZmOyAvLyB5ZXMsIEkga25vdyB0aGlzIHdpbGwgYWx3YXlzIGJlIGFcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAob3V0ZXIgIT0gMHhmZmZmICYmIGlubmVyICE9IDB4ZmZmZikgeyAvLyBpZiB0aGlzIGVudHJ5IGlzIG5vbi1udWxsLi4uIChobW0sIG1pZ2h0IGJlIG5pY2VyIHRvIGhhdmUgY3JlYXRlZCBhIHNwYXJzZSBhcnJheSBpbiB0aGUgZmlyc3QgcGxhY2UsIHNraXBwaW5nIG51bGxzIGFuZCB0aHVzIGF2b2lkaW5nIHRoaXMgY2hlY2spXG5cdFx0XHRcdFx0dHVwbGVbYV0gKz0gTWF0aC5yb3VuZChkZWx0YXNbb3V0ZXJdW2lubmVyXSkgLyAweDQwMDA7IC8vIGFkZCB0aGUgaW50ZXJwb2xhdGVkIGRlbHRhIHRvIHR1cGxlW2FdOyBub3RlIHRoYXQgdGhlIHNwZWMgcHJvdmlkZXMgYW4gaW50ZWdlciBtZXRob2QgZm9yIHJvdW5kaW5nXG5cdFx0XHRcdFx0dHVwbGVbYV0gPSBjbGFtcCh0dXBsZVthXSwgLTEsIDEpOyAvLyBjbGFtcCB0aGUgcmVzdWx0IHRvIFstMSwxXVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0XG5cdC8vIGluc3RhbnRpYXRlIHRoZSBpdGVtIHZhcmlhdGlvbiBzdG9yZXNcblx0Ly8gVE9ETzogZml4IHRoZSBsb2dpYyBvZiB3aGVyZSB0aGlzIGNvbWVzLi4uIGl0IHNob3VsZCBwcm9iYWJseSBoYXBwZW4gb25seSBpZihmb250LmF2YXIpIHJhdGhlciB0aGFuIHdpdGhpbiBpZiB0aGVyZSBhcmUgYW55IEl0ZW1WYXJpYXRpb25TdG9yZXNcblx0Ly8gdGhlbiBpbnN0YW50aWF0ZSB0aGUgb3RoZXIgaXRlbSB2YXJpYXRpb24gc3RvcmVzXG5cdE9iamVjdC5rZXlzKGZvbnQuSXRlbVZhcmlhdGlvblN0b3JlcykuZm9yRWFjaChrZXkgPT4ge1xuXG5cdFx0aWYgKGtleSAhPSBcImF2YXJcIikgeyAvLyB3ZSBhbHJlYWR5IGhhbmRsZWQgdGhlIGF2YXIyIEl0ZW1WYXJpYXRpb25TdG9yZSwgaWYgaXQgZXhpc3RzXG5cdFx0XHRjb25zdCBkZWx0YVNldHMgPSBmb250Lml0ZW1WYXJpYXRpb25TdG9yZUluc3RhbnRpYXRlKGZvbnQuSXRlbVZhcmlhdGlvblN0b3Jlc1trZXldLCB0dXBsZSk7IC8vIGRvZXMgdGhpcyBuZWVkIHRvIHN0aWNrIGFyb3VuZD8gbm8gZm9yIE1WQVIsIGFzIHdlIGNhbiBnZXQgdGhlIG5ldyB2YWx1ZXNcblx0XHRcdFxuXHRcdFx0Ly8gZWFjaCBpdnMgaGFzIGl0cyBvd24gd2F5IG9mIG1hcHBpbmcgaW5kaWNlczsgdGhlIG1hcHBpbmcgY2FuIG1heWJlIGJlIGRvbmUgSklULi4uXG5cdFx0XHRzd2l0Y2ggKGtleSkge1xuXHRcdFx0XHRjYXNlIFwiTVZBUlwiIDoge1xuXHRcdFx0XHRcdHRoaXMuTVZBUiA9IHt9O1xuXHRcdFx0XHRcdE9iamVjdC5rZXlzKGZvbnQuTVZBUi52YWx1ZVJlY29yZHMpLmZvckVhY2godGFnID0+IHsgLy8gd291bGQgYmUgc2xpZ2h0bHkgbW9yZSBlZmZpY2llbnQgaWYgd2Ugc3RvcmUgZm9udC5NVkFSLnZhbHVlUmVjb3JkcyBhcyBhbiBhcnJheSBvZiBhcnJheXM6IFt0YWcsIG91dGVyLCBpbm5lcl0sIHRoZW4gd2UgY2FuIGp1c3QgLmZvckVhY2goKSBlYXNpbHlcblx0XHRcdFx0XHRcdGNvbnN0IFtvdXRlciwgaW5uZXJdID0gZm9udC5NVkFSLnZhbHVlUmVjb3Jkc1t0YWddO1xuXHRcdFx0XHRcdFx0dGhpcy5NVkFSW3RhZ10gPSBkZWx0YVNldHNbb3V0ZXJdW2lubmVyXTsgLy8gZS5nLiBpbnN0YW5jZS5NVkFSW1wieGhndFwiXSA9IGRlbHRhU2V0c1sxLDE1XTsgLy8geWllbGRzIGRlbHRhIHRvIGFkZCB0byBPUy8yLnN4SGVpZ2h0IGZvciB0aGlzIGluc3RhbmNlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRkZWZhdWx0OiB7XG5cdFx0XHRcdFx0dGhpcy5kZWx0YVNldHNba2V5XSA9IGRlbHRhU2V0cztcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly8gbm90ZSB0aGF0IHNvbWUgaXRlbVZhcmlhdGlvblN0b3JlIHRhYmxlcyAoQ09MUiwgSFZBUikgbWlnaHQgYmUgbGFyZ2UsIGFuZCBpdCB3b3VsZCBiZSBiZXR0ZXIgZm9yIGp1c3QgYSBwb3J0aW9uIHRvIGJlIGluc3RhbnRpYXRlZCBvbiBkZW1hbmRcblx0XHR9XG5cdH0pO1xuXG5cdC8vIGNhbGN1bGF0ZSBpbnN0YW5jZS5zaGFyZWRTY2FsYXJzICh0aGV54oCZcmUgZGVyaXZlZCBmcm9tIGd2YXLigJlzIHNoYXJlZCB0dXBsZXMgdXNpbmcgdGhlIGN1cnJlbnQgdXNlciB0dXBsZSlcblx0Ly8gLSB0aGlzIGNhY2hpbmcgc2hvdWxkIG1hcmdpbmFsbHkgc3BlZWQgdGhpbmdzIHVwXG5cdC8vIC0gd2UgaW5kZXggYnkgdGhlIHNhbWUgaWRzIHVzZWQgd2l0aGluIHRoZSBwZXItZ2x5cGggdHZ0IGRhdGEgZGVlcGVyIGluIGd2YXJcblx0Ly8gLSBub3RlIHRoaXMgY2FsY3VsYXRpb24gbXVzdCBjb21lIGFmdGVyIGF2YXIgY2FsY3VsYXRpb25cblx0aWYgKGd2YXIpIHtcblx0XHRndmFyLnNoYXJlZFR1cGxlcy5mb3JFYWNoKHNoYXJlZFR1cGxlID0+IHtcblxuXHRcdFx0bGV0IFM9MTtcblx0XHRcdGZvciAobGV0IGE9MDsgYTxheGlzQ291bnQ7IGErKykgeyAvLyBlYWNoIGVsZW1lbnQgb2Ygc2hhcmVkVHVwbGUgaXMgLTEsIDAgb3IgMSAoaXQgcmVjb3JkcyBwZWFrcyBvbmx5LCB3aXRoIGltcGxpY2l0IHN0YXJ0IGFuZCBlbmRcblx0XHRcdFx0aWYgKHNoYXJlZFR1cGxlW2FdID09IDApIC8vIG5vIGVmZmVjdCwgcGVhayA9IDAgbWVhbnMgZG8gbm90aGluZywgaW4gb3RoZXIgd29yZHMgKj0gMVxuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRlbHNlIGlmICh0dXBsZVthXSA9PSAwIHx8IHNoYXJlZFR1cGxlW2FdICogdHVwbGVbYV0gPCAwKSB7IC8vIDEpIGlmIGFueSBvZiB0aGUgY29udHJpYnV0aW5nIGF4ZXMgYXJlIHplcm8sIHRoZSBzY2FsYXIgaXMgemVybzsgMikgaWYgdGhlaXIgc2lnbnMgYXJlIGRpZmZlcmVudCwgdGhlIHNjYWxhciBpcyB6ZXJvXG5cdFx0XHRcdFx0UyA9IDA7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0UyAqPSB0dXBsZVthXTsgLy8gdGhlIG9ubHkgb3B0aW9uIGxlZnQ6IHRoZSBzaW1wbGUgdGVudCBtZWFucyB0aGF0IHRoZSBzY2FsYXIgZm9yIGVhY2ggYXhpcyBpcyBlcXVhbCB0byB0aGUgYWJzb2x1dGUgYXhpcyB2YWx1ZSAod2UgZml4IHRoZSBzaWduIG9mIFMgbGF0ZXIsIGFmdGVyIHBvdGVudGlhbGx5IG11bHRpcGxlIHNpZ24gZmxpcHMpXG5cdFx0XHR9XG5cdFx0XHR0aGlzLnNoYXJlZFNjYWxhcnMucHVzaChTID49IDAgPyBTIDogLVMpOyAvLyBmaXggdGhlIHNpZ24sIHRoZW4gYXBwZW5kIHRvIHRoaXMgaW5zdGFuY2XigJlzIHNoYXJlZFNjYWxhcnMgYXJyYXlcblx0XHRcdC8vIFRPRE86IHdlICpjYW4qIHVzZSBzaGFyZWRTY2FsYXJzIGxpa2UgdGhpcyAodGhleSB3b3JrIGFzIGlzIGluIG1hbnkgZm9udHMpIGJ1dCBvbmx5IGluIGdlbmVyYWwgaWYgdGhleSBhcmUgYWxsIG5vbi1pbnRlcm1lZGlhdGUsIHRoaXMgaGF2ZSBwZWFrIHZhbHVlcyAtMSwgMCBvciAxIChCaXR0ZXIgdmFyaWFibGUgZm9udCB2aW9sYXRlcyB0aGlzLCBmb3IgZXhhbXBsZSlcblx0XHRcdC8vIC0gYmVjYXVzZSB0aGUgc3RhcnQgYW5kIGVuZCBhcmUgbm90IGxvY2FsIGJ1dCBlbWJlZGRlZCBkZWVwIGluIGd2YXIsIHdlIGNhbm5vdCBhc3N1bWUgdGhleSBhcmUgYWx3YXlzIHRoZSBzYW1lIHZhbHVlcyAodGhleSBtYXkgdmVyeSB3ZWxsIGJlLCBhbmQgaW4gdGhlb3J5IHdlIGNvdWxkIGNoZWNrIGZvciB0aGlzKVxuXHRcdFx0Ly8gLSBjdXJyZW50bHkgd2UgYXJlIG5vdCB1c2luZyBzaGFyZWRTY2FsYXJzXG5cdFx0fSk7XG5cdH1cblxuXHQvLyBpbnN0YW50aWF0ZSBnbHlwaHM/XG5cdGlmIChvcHRpb25zLmFsbEdseXBocykge1xuXHRcdGZvciAobGV0IGc9MDsgZzxmb250Lm51bUdseXBoczsgZysrKSB7XG5cdFx0XHR0aGlzLmdseXBoc1tnXSA9IGZvbnQuZ2x5cGhzW2ddLmluc3RhbnRpYXRlKHR1cGxlKTtcblx0XHR9XG5cdH1cblx0ZWxzZSBpZiAob3B0aW9ucy5nbHlwaElkcykge1xuXHRcdG9wdGlvbnMuZ2x5cGhJZHMuZm9yRWFjaChnID0+IHtcblx0XHRcdHRoaXMuZ2x5cGhzW2ddID0gZm9udC5nbHlwaHNbZ10uaW5zdGFudGlhdGUodHVwbGUpO1xuXHRcdH0pO1xuXHR9XG59XG5cblxuLy8gU2Ftc2FJbnN0YW5jZS5nbHlwaEFkdmFuY2UoKSAtIHJldHVybiB0aGUgYWR2YW5jZSBvZiBhIGdseXBoXG4vLyAtIHdlIG5lZWQgdGhpcyBtZXRob2QgaW4gU2Ftc2FJbnN0YW5jZSwgbm90IFNhbXNhR2x5cGgsIGJlY2F1c2UgU2Ftc2FHbHlwaCBtaWdodCBub3QgYmUgbG9hZGVkIChhbmQgd2UgZG9u4oCZdCBuZWVkIHRvIGxvYWQgaXQsIGJlY2F1c2Ugd2UgaGF2ZSBobXR4IGFuZCBIVkFSKVxuLy8gLSBpZiB3ZSBoYXZlIGEgdmFyaWFibGUgZm9udCBhbmQgSFZBUiBpcyBub3QgcHJlc2VudCwgd2UgbXVzdCBsb2FkIHRoZSBnbHlwaCBpbiBvcmRlciB0byBrbm93IGl0cyB2YXJpYWJsZSBhZHZhbmNlXG4vLyAtIHJlcGxhY2UgaXQgd2l0aCBnbHlwaE1ldHJpY3MoKSA/XG4vLyAtIG1heWJlIHdlIGNhbiBoYXZlIGEgU2Ftc2FHbHlwaC5nbHlwaEFkdmFuY2UoKSBtZXRob2QgdG9vLCB3aGljaCBjYWxscyB0aGlzIG1ldGhvZCB3aXRoIGl0cyBvd24gaW5zdGFuY2UgKGlmIGl0IGhhcyBvbmUpLlxuU2Ftc2FJbnN0YW5jZS5wcm90b3R5cGUuZ2x5cGhBZHZhbmNlID0gZnVuY3Rpb24gKGdseXBoSWQpIHtcblx0Y29uc3QgZm9udCA9IHRoaXMuZm9udDtcblx0Y29uc3QgYWR2YW5jZSA9IFswLDBdO1xuXHRjb25zdCBnbHlwaCA9IGZvbnQuZ2x5cGhzW2dseXBoSWRdO1xuXHRjb25zdCBpZ2x5cGggPSBnbHlwaC5pbnN0YW50aWF0ZSh0aGlzKTtcblx0Ly8gd2UgZG8gbm90IG5lZWQgdG8gZGVjb21wb3NlIFxuXG5cdGlmIChpZ2x5cGgpIHtcblx0XHQvLyBnZXQgdGhlIGFkdmFuY2UgZnJvbSBTYW1zYUdseXBoXG5cdFx0Y29uc3QgbnVtUG9pbnRzID0gaWdseXBoLm51bVBvaW50cztcblx0XHRhZHZhbmNlWzBdID0gaWdseXBoLnBvaW50c1tudW1Qb2ludHMrMV1bMF07IC8vIGhvcml6b250YWwgYWR2YW5jZVxuXHRcdGFkdmFuY2VbMV0gPSBpZ2x5cGgucG9pbnRzW251bVBvaW50cysyXVsxXTsgLy8gdmVydGljYWwgYWR2YW5jZVxuXHR9XG5cdGVsc2Uge1xuXHRcdC8vIFRPRE86IG1vZGlmeSB0aGUgYWR2YW5jZSB1c2luZyBIVkFSLCBWVkFSXG5cdFx0Ly8gSFZBUiBhbmQgVlZBUiBzaG91bGQgYWxyZWFkeSBiZSBpbnN0YW50aWF0ZWRcblx0XHRhZHZhbmNlWzBdID0gZm9udC5obXR4ID8gZm9udC5obXR4W2dseXBoSWRdIDogMDtcblx0XHRhZHZhbmNlWzFdID0gZm9udC52bXR4ID8gZm9udC52bXR4W2dseXBoSWRdIDogMDtcblxuXHRcdGlmIChmb250LkhWQVIpIHtcblx0XHRcdGNvbnN0IFtvdXRlciwgaW5uZXJdID0gZm9udC5IVkFSLmluZGV4TWFwW2dseXBoSWRdO1xuXHRcdFx0Y29uc3QgZGVsdGFzID0gZm9udC5JdGVtVmFyaWF0aW9uU3RvcmVzW1wiSFZBUlwiXTtcblx0XHRcdGFkdmFuY2VbMF0gKz0gZGVsdGFzW291dGVyXVtpbm5lcl07XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGFkdmFuY2U7XG59XG5cbi8vIGlucHV0OiBhIHN0cmluZyBvciBhbiBhcnJheSBvZiBnbHlwaElkc1xuLy8gLSByZXR1cm46IGEgR2x5cGhSdW4gb2JqZWN0IHdoaWNoIGlzIGFuIGFycmF5IG9mIG9iamVjdHMsIHdoZXJlIGVhY2ggb2JqZWN0IGhhcyBhIGdseXBoIGFuZCBhbiBhYnNvbHV0ZSB4eSBvZmZzZXRcbi8vIEV4YW1wbGVzOlxuLy8gaW5zdGFuY2UuZ2x5cGhMYXlvdXRGcm9tU3RyaW5nKFwiaGVsbG9cIikgLy8gZ2V0cyB0aGUgbGF5b3V0IGZvciB0aGUgc3RyaW5nIFwiaGVsbG9cIlxuLy8gaW5zdGFuY2UuZ2x5cGhMYXlvdXRGcm9tU3RyaW5nKFsyMzRdKSAvLyBnZXRzIHRoZSBsYXlvdXQgZm9yIGdseXBoIDIzNFxuLy8gaW5zdGFuY2UuZ2x5cGhMYXlvdXRGcm9tU3RyaW5nKFsyMzQsNTVdKSAvLyBnZXRzIHRoZSBsYXlvdXQgZm9yIGdseXBoIDIzNCBmb2xsb3dlZCBieSBnbHlwaCA1NVxuLy8gLSBhIGNvbXBsZXRlIGltcGxlbWVudGF0aW9uIHdvdWxkIHByb2Nlc3MgT3BlblR5cGUgTGF5b3V0IGZlYXR1cmVzXG5TYW1zYUluc3RhbmNlLnByb3RvdHlwZS5nbHlwaExheW91dEZyb21TdHJpbmcgPSBmdW5jdGlvbiAoaW5wdXQpIHtcblx0Y29uc3QgZm9udCA9IHRoaXMuZm9udDtcblx0Y29uc3QgZ2x5cGhMYXlvdXQgPSBbXTsgLy8gd2UgcmV0dXJuIHRoaXNcblx0bGV0IGdseXBoUnVuID0gW107XG5cdGxldCB4ID0gMCwgeSA9IDA7XG5cblx0Ly8gZ2V0IGEgc2ltcGxlIGFycmF5IG9mIGdseXBoSWRzIChpZiBpbnB1dCBpcyBhIHN0cmluZywgdHVybiBpdCBpbnRvIGEgc2ltcGxlIGFycmF5IG9mIGdseXBoSWRzKVxuXHRpZiAodHlwZW9mIGlucHV0ID09IFwic3RyaW5nXCIpIHtcblx0XHQvLyBzdGVwIHRocm91Z2ggdGhlIHN0cmluZyBpbiBhIFVURi0xNiBhd2FyZSB3YXksIHRoYXQgaXMgY29vbCB3aXRoIFwi8J+QjvCfjKHvuI/inaTvuI/wn6Sv4oya77iPzp3Ph1FcIjtcblx0XHRbLi4uaW5wdXRdLmZvckVhY2goY2ggPT4ge1xuXHRcdFx0Z2x5cGhSdW4ucHVzaChmb250LmdseXBoSWRGcm9tVW5pY29kZShjaC5jb2RlUG9pbnRBdCgwKSkpO1xuXHRcdH0pXG5cdH1cblx0ZWxzZSBpZiAoQXJyYXkuaXNBcnJheShpbnB1dCkpIHtcblx0XHRnbHlwaFJ1biA9IGlucHV0O1xuXHR9XG5cblx0Ly8gc2hvdWxkIHRoaXMgYWxyZWFkeSBwb3NpdGlvbiBlYWNoIGdseXBoIGFic29sdXRlbHk/IG1heWJlLCB0byBiZSBzaW1pbGFyIHRvIGhhcmZidXp6Li4uIHNpbXBsZXIgZm9yIHRoZSBmaW5hbCByZW5kZXJpbmdcblxuXHRnbHlwaFJ1bi5mb3JFYWNoKGdseXBoSWQgPT4ge1xuXG5cdFx0Y29uc3QgW2R4LCBkeV0gPSB0aGlzLmdseXBoQWR2YW5jZShnbHlwaElkKTsgLy8gZ2x5cGhBZHZhbmNlKCkgaXMgcmVzcG9uc2libGUgZm9yIGRlY29kaW5nIGFuZCBpbnN0YW50aWF0aW5nIHRoZSBnbHlwaCBpZiBuZWNlc3Nhcnlcblx0XG5cdFx0Ly8gZW1pdCBzaW1pbGFyIGZvcm1hdCB0byBoYXJmYnV6elxuXHRcdGdseXBoTGF5b3V0LnB1c2goe1xuXHRcdFx0aWQ6IGdseXBoSWQsXG5cdFx0XHRheDogeCxcblx0XHRcdGF5OiB5LFxuXHRcdFx0ZHg6IGR4LFxuXHRcdFx0ZHk6IGR5LFxuXHRcdH0pO1xuXG5cdFx0eCArPSBkeDsgLy8gaG9yaXpvbnRhbCBhZHZhbmNlXG5cdFx0eSArPSBkeTsgLy8gdmVydGljYWwgYWR2YW5jZVxuXG5cdH0pO1xuXG5cdC8vIGdldCB0aGUgZ2x5cGggaWRzIGZvciB0aGUgY2hhcmFjdGVycyBpbiB0aGUgc3RyaW5nXG5cdFxuXHQvLyBwcm9jZXNzIHRoZSBnbHlwaGlkIHNlcXVlbmNlIHRvIGdldCBzdWJzdGl0dXRpb25zIGFuZCBwb3NpdGlvbmluZ1xuXHQvLyAtIHdlIGNhbiBkbyB0aGlzIHdpdGg6XG5cdC8vICAgLSBoYXJmYnV6ei53YXNtXG5cdC8vICAgLSBvcGVudHlwZS5qc1xuXHQvLyAgIC0gZm9udGtpdC5qc1xuXHQvLyAgIC0gYmFzaWMgbWV0cmljcywgbm8ga2VybmluZyAobm8gc3Vic2l0dXRpb25zKVxuXHQvLyAgIC0gYmFzaXMgbWV0cmljcywga2VybiB0YWJsZSAobm8gc3Vic2l0dXRpb25zKVxuXG5cdHJldHVybiBnbHlwaExheW91dDtcbn1cblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFNhbXNhR2x5cGhcbmZ1bmN0aW9uIFNhbXNhR2x5cGggKGluaXQ9e30pIHtcblxuXHR0aGlzLmlkID0gaW5pdC5pZDtcblx0dGhpcy5uYW1lID0gaW5pdC5uYW1lO1xuXHR0aGlzLmZvbnQgPSBpbml0LmZvbnQ7XG5cdHRoaXMubnVtUG9pbnRzID0gaW5pdC5udW1Qb2ludHMgfHwgMDtcblx0dGhpcy5udW1iZXJPZkNvbnRvdXJzID0gaW5pdC5udW1iZXJPZkNvbnRvdXJzIHx8IDA7XG5cdHRoaXMuaW5zdHJ1Y3Rpb25MZW5ndGggPSAwO1xuXHR0aGlzLnBvaW50cyA9IGluaXQucG9pbnRzIHx8IFtdO1xuXHR0aGlzLmNvbXBvbmVudHMgPSBpbml0LmNvbXBvbmVudHMgfHwgW107XG5cdHRoaXMuZW5kUHRzID0gaW5pdC5lbmRQdHMgfHwgW107XG5cdHRoaXMudHZ0cyA9IGluaXQudHZ0cyB8fCBbXTsgLy8gdW5kZWZpbmVkIG1lYW5zIG5vdCBwYXJzZWQ7IGVtcHR5IGFycmF5IG1lYW5zIG5vIHR2dHNcblx0dGhpcy5jdXJ2ZU9yZGVyID0gMjsgXG5cdC8vdGhpcy5jdXJ2ZU9yZGVyID0gaW5pdC5jdXJ2ZU9yZGVyIHx8ICh0aGlzLmZvbnQgPyB0aGlzLmZvbnQuY3VydmVPcmRlciA6IHVuZGVmaW5lZCk7XG59XG5cblxuLy8gU2Ftc2FHbHlwaC5pbnN0YW50aWF0ZSgpXG4vLyAtIGluc3RhbnRpYXRlcyBhIGdseXBoXG4vLyBUaGUgZmlyc3QgYXJndW1lbnQgaXMgZWl0aGVyIGEgU2Ftc2FJbnN0YW5jZSBvciBhIHR1cGxlXG4vLyAtIGlmIGl04oCZcyBhIFNhbXNhSW5zdGFuY2UsIHRoZW4gaXQgdGFrZXMgdGhhdCBpbnN0YW5jZeKAmXMgdHVwbGUgYW5kIGdldHMgaW5zZXJ0ZWQgaW50byB0aGUgZ2x5cGhzIGFycmF5IG9mIHRoZSBpbnN0YW5jZVxuLy8gLSBpZiBpdOKAmXMgYSB0dXBsZSwgdGhlbiBpdCBpcyBhIHN0YW5kYWxvbmUgZ2x5cGhcblNhbXNhR2x5cGgucHJvdG90eXBlLmluc3RhbnRpYXRlID0gZnVuY3Rpb24oYXJnLCBvcHRpb25zPXt9KSB7XG5cblx0Y29uc3QgaWdseXBoID0gbmV3IFNhbXNhR2x5cGgoKTtcblx0Y29uc3QgZm9udCA9IHRoaXMuZm9udDtcblx0Y29uc3QgYXhpc0NvdW50ID0gZm9udC5mdmFyID8gZm9udC5mdmFyLmF4aXNDb3VudCA6IDA7XG5cdGNvbnN0IGlnbm9yZUlVUCA9IGZhbHNlO1xuXG5cdGlmIChhcmcgaW5zdGFuY2VvZiBTYW1zYUluc3RhbmNlKSB7XG5cdFx0YXJnLmdseXBoc1t0aGlzLmlkXSA9IGlnbHlwaDtcblx0XHRpZ2x5cGguaW5zdGFuY2UgPSBhcmc7XG5cdFx0aWdseXBoLnR1cGxlID0gYXJnLnR1cGxlO1xuXHR9XG5cdGVsc2UgaWYgKHZhbGlkYXRlVHVwbGUgKGFyZywgYXhpc0NvdW50KSkge1xuXHRcdGlnbHlwaC50dXBsZSA9IHR1cGxlO1xuXHRcdC8vIGl04oCZcyBhIGdseXBoIHdpdGhvdXQgYW4gaW5zdGFuY2UuLi4gdGhpcyBmZWVscyBkYW5nZXJvdXMsIHNpbmNlIHdlIG1heSBuZWVkIEl0ZW1WYXJpYXRpb25TdG9yZSBkYXRhIHRoYXQgd2UgYXJlIG5vdCB5ZXQgY2FsY3VsYXRpbmcgSklUXG5cdH1cblx0ZWxzZSB7XG5cdFx0aWdseXBoLnR1cGxlID0gQXJyYXkoYXhpc0NvdW50KS5maWxsKDApO1xuXHR9XG5cblx0aWdseXBoLmlkID0gdGhpcy5pZDtcblx0aWdseXBoLm5hbWUgPSB0aGlzLm5hbWU7XG5cdGlnbHlwaC5mb250ID0gdGhpcy5mb250O1xuXHRpZ2x5cGgubnVtUG9pbnRzID0gdGhpcy5udW1Qb2ludHM7XG5cdGlnbHlwaC5udW1iZXJPZkNvbnRvdXJzID0gdGhpcy5udW1iZXJPZkNvbnRvdXJzO1xuXHRpZ2x5cGguaW5zdHJ1Y3Rpb25MZW5ndGggPSB0aGlzLmluc3RydWN0aW9uTGVuZ3RoO1xuXHRpZ2x5cGguY29tcG9uZW50cyA9IHRoaXMuY29tcG9uZW50cztcblx0aWdseXBoLmVuZFB0cyA9IHRoaXMuZW5kUHRzO1xuXHRpZ2x5cGgudHZ0cyA9IHRoaXMudHZ0cztcblx0aWdseXBoLmN1cnZlT3JkZXIgPSB0aGlzLmN1cnZlT3JkZXI7XG5cdGlnbHlwaC50b3VjaGVkID0gW107IC8vIGhlbHBmdWwgZm9yIHZpc3VhbGlzaW5nIHZhcmlhdGlvbnNcblx0aWdseXBoLnZpeiA9IHt0dnRzOiBbXX07IC8vIHZpc3VhbGl6YXRpb24gZGF0YVxuXG5cdC8vIGluc3RhbnRpYXRlIHBvaW50czogY29weSB0aGUgcG9pbnRzIG9mIGdseXBoIGludG8gaWdseXBoXG5cdGxldCBwPXRoaXMucG9pbnRzLmxlbmd0aDtcblx0d2hpbGUgKC0tcCA+PSAwKSB7XG5cdFx0Y29uc3QgcG9pbnQgPSB0aGlzLnBvaW50c1twXTtcblx0XHRpZ2x5cGgucG9pbnRzW3BdID0gW3BvaW50WzBdLCBwb2ludFsxXSwgcG9pbnRbMl1dOyAvLyBub3RlIHRoYXQgWy4uLnBvaW50XSBpcyBzbG93ZXIgOilcblx0fVxuXG5cdC8vIGdvIHRocm91Z2ggZWFjaCB0dnQgKD10dXBsZSB2YXJpYXRpb24gdGFibGUpIGZvciB0aGlzIGdseXBoXG5cdHRoaXMudHZ0cy5mb3JFYWNoKHR2dCA9PiB7XG5cblx0XHRjb25zdCBzY2FsZWREZWx0YXMgPSBbXTtcblx0XHRjb25zdCB0b3VjaGVkID0gW107XG5cdFx0bGV0IHB0ID0gdGhpcy5wb2ludHMubGVuZ3RoO1xuXHRcdGxldCBTO1xuXG5cdFx0Ly8gaW5pdGlhbGl6ZSB0aGUgc2NhbGVkRGVsdGFzIGFycmF5IHRvIHplcm8gdmVjdG9yc1xuXHRcdHdoaWxlICgtLXB0ID49IDApIHtcblx0XHRcdHNjYWxlZERlbHRhc1twdF0gPSBbMCwwXTtcblx0XHR9XG5cblx0XHQvLyBzaGFyZWRTY2FsYXJzIGFyZSBkaXNhYmxlZCBmb3Igbm93XG5cdFx0aWYgKDEpIHtcblx0XHRcdC8vIGdvIHRocnUgZWFjaCBheGlzLCBtdWx0aXBseSBhIHNjYWxhciBTIGZyb20gaW5kaXZpZHVhbCBzY2FsYXJzIEFTXG5cdFx0XHQvLyAtIGlmIHRoZSBjdXJyZW50IGRlc2lnbnNwYWNlIGxvY2F0aW9uIGlzIG91dHNpZGUgb2YgdGhpcyB0dnTigJlzIHR1cGxlLCB3ZSBnZXQgUyA9IDAgYW5kIG5vdGhpbmcgaXMgZG9uZVxuXHRcdFx0Ly8gLSBiYXNlZCBvbiBwc2V1ZG9jb2RlIGZyb20gaHR0cHM6Ly93d3cubWljcm9zb2Z0LmNvbS90eXBvZ3JhcGh5L290c3BlYy9vdHZhcm92ZXJ2aWV3Lmh0bVxuXHRcdFx0UyA9IDFcblx0XHRcdGZvciAobGV0IGE9MDsgYTxheGlzQ291bnQ7IGErKykge1xuXHRcdFx0XHRjb25zdCB1YSA9IGlnbHlwaC50dXBsZVthXTtcblx0XHRcdFx0Y29uc3QgW3N0YXJ0LCBwZWFrLCBlbmRdID0gW3R2dC5zdGFydFthXSwgdHZ0LnBlYWtbYV0sIHR2dC5lbmRbYV1dOyAvLyBUT0RPOiBzdG9yZSB0aGVzZSBhcyAzLWVsZW1lbnQgYXJyYXlzXG5cdFx0XHRcdGlmIChwZWFrICE9IDApIHtcblx0XHRcdFx0XHRpZiAodWEgPCBzdGFydCB8fCB1YSA+IGVuZCkge1xuXHRcdFx0XHRcdFx0UyA9IDA7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAodWEgPCBwZWFrKVxuXHRcdFx0XHRcdFx0UyAqPSAodWEgLSBzdGFydCkgLyAocGVhayAtIHN0YXJ0KTtcblx0XHRcdFx0XHRlbHNlIGlmICh1YSA+IHBlYWspXG5cdFx0XHRcdFx0XHRTICo9IChlbmQgLSB1YSkgLyAoZW5kIC0gcGVhayk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHQvLyB1c2Ugc2hhcmVkU2NhbGFycyBvcHRpbWl6YXRpb25cblx0XHRcdFMgPSBpZ2x5cGguaW5zdGFuY2Uuc2hhcmVkU2NhbGFyc1t0dnQuc2hhcmVkVHVwbGVJZF07XG5cdFx0fVxuXG5cblx0XHQvLyBub3cgd2UgY2FuIG1vdmUgdGhlIHBvaW50cyBieSBTICogZGVsdGFcblx0XHQvLyBPUFRJTUlaRTogaXQgbXVzdCBiZSBwb3NzaWJsZSB0byBvcHRpbWl6ZSBmb3IgdGhlIFM9PTEgY2FzZSwgYnV0IGF0dGVtcHRzIHJlZHVjZSBzcGVlZC4uLlxuXHRcdGlmIChTICE9IDApIHtcblxuXHRcdFx0cHQgPSB0aGlzLnBvaW50cy5sZW5ndGg7XG5cdFx0XHR3aGlsZSAoLS1wdCA+PSAwKSB7XG5cdFx0XHRcdGNvbnN0IGRlbHRhID0gdHZ0LmRlbHRhc1twdF07XHRcdFx0XHRcblx0XHRcdFx0aWYgKGRlbHRhICE9PSBudWxsICYmIGRlbHRhICE9PSB1bmRlZmluZWQpIHsgLy8gaWYgbm90IElVUFxuXHRcdFx0XHRcdHRvdWNoZWRbcHRdID0gdHJ1ZTsgLy8gdG91Y2hlZFtdIGlzIGp1c3QgZm9yIHRoaXMgdHZ0OyBuZXdHbHlwaC50b3VjaGVkW10gaXMgZm9yIGFsbCB0dnRzIChpbiBjYXNlIHdlIHdhbnQgdG8gc2hvdyBJVVAgaW4gVUkpIFxuXHRcdFx0XHRcdHNjYWxlZERlbHRhc1twdF0gPSBbUyAqIGRlbHRhWzBdLCBTICogZGVsdGFbMV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIElVUFxuXHRcdFx0Ly8gLSBUT0RPOiBpZ25vcmUgdGhpcyBzdGVwIGZvciBjb21wb3NpdGVzIChldmVuIHRob3VnaCBpdCBpcyBzYWZlIGJlY2F1c2UgbnVtYmVyT2ZDb250b3VyczwwKVxuXHRcdFx0Ly8gLSBPUFRJTUlaRTogY2FsY3VsYXRlIElVUCBkZWx0YXMgd2hlbiBwYXJzaW5nLCB0aGVuIGEgXCJkZWx0YXNcIiB2YXJpYWJsZSBjYW4gcG9pbnQgZWl0aGVyIHRvIHRoZSBvcmlnaW5hbCBkZWx0YXMgYXJyYXkgb3IgdG8gYSBuZXcgc2NhbGVkIGRlbHRhcyBhcnJheSAoaG1tLCByb3VuZGluZyB3aWxsIGJlIGEgYml0IGRpZmZlcmVudCBpZiBJVVAgc2NhbGVkIGRlbHRhcyBhcmUgYWx3YXlzIGJhc2VkIG9uIHRoZSAxMDAlIGRlbHRhcylcblx0XHRcdGlmICghdHZ0LmFsbFBvaW50cyAmJiB0aGlzLm51bWJlck9mQ29udG91cnMgPiAwICYmIHRvdWNoZWQubGVuZ3RoID4gMCAmJiAhaWdub3JlSVVQKSB7IC8vIGl0IHdvdWxkIGJlIG5pY2UgdG8gY2hlY2sgXCJ0b3VjaGVkLmxlbmd0aCA8IGdseXBoLnBvaW50cy5sZW5ndGhcIiBidXQgdGhhdCB3b27igJl0IHdvcmsgd2l0aCBzcGFyc2UgYXJyYXlzLCBhbmQgbXVzdCBhbHNvIHRoaW5rIGFib3V0IHBoYW50b20gcG9pbnRzXG5cblx0XHRcdFx0Ly8gZm9yIGVhY2ggY29udG91clxuXHRcdFx0XHRmb3IgKGxldCBjPTAsIHN0YXJ0UHQ9MDsgYzx0aGlzLm51bWJlck9mQ29udG91cnM7IGMrKykge1xuXHRcdFx0XHRcblx0XHRcdFx0XHQvLyBPUFRJTUlaRTogY2hlY2sgaGVyZSB0aGF0IHRoZSBjb250b3VyIGlzIGFjdHVhbGx5IHRvdWNoZWRcblx0XHRcdFx0XHRjb25zdCBudW1Qb2ludHNJbkNvbnRvdXIgPSB0aGlzLmVuZFB0c1tjXS1zdGFydFB0KzE7XG5cdFx0XHRcdFx0bGV0IGZpcnN0UHJlY1B0ID0gLTE7IC8vIG51bGwgdmFsdWVcblx0XHRcdFx0XHRsZXQgcHJlY1B0LCBmb2xsUHQ7XG5cdFx0XHRcdFx0Zm9yIChsZXQgcD1zdGFydFB0OyBwIT1maXJzdFByZWNQdDsgKSB7XG5cdFx0XHRcdFx0XHRsZXQgcE5leHQgPSAocC1zdGFydFB0KzEpJW51bVBvaW50c0luQ29udG91citzdGFydFB0O1xuXHRcdFx0XHRcdFx0aWYgKHRvdWNoZWRbcF0gJiYgIXRvdWNoZWRbcE5leHRdKSB7IC8vIGZvdW5kIGEgcHJlY1B0XG5cdFx0XHRcdFx0XHRcdC8vIGdldCBwcmVjUHQgYW5kIGZvbGxQdFxuXHRcdFx0XHRcdFx0XHRwcmVjUHQgPSBwO1xuXHRcdFx0XHRcdFx0XHRmb2xsUHQgPSBwTmV4dDtcblx0XHRcdFx0XHRcdFx0aWYgKGZpcnN0UHJlY1B0ID09IC0xKVxuXHRcdFx0XHRcdFx0XHRcdGZpcnN0UHJlY1B0ID0gcHJlY1B0O1xuXHRcdFx0XHRcdFx0XHRkbyB7XG5cdFx0XHRcdFx0XHRcdFx0Zm9sbFB0ID0gKGZvbGxQdC1zdGFydFB0KzEpICUgbnVtUG9pbnRzSW5Db250b3VyICsgc3RhcnRQdDtcblx0XHRcdFx0XHRcdFx0fSB3aGlsZSAoIXRvdWNoZWRbZm9sbFB0XSkgLy8gZm91bmQgdGhlIGZvbGxQdFxuXG5cdFx0XHRcdFx0XHRcdC8vIHBlcmZvcm0gSVVQIGZvciB4KDApLCB0aGVuIGZvciB5KDEpXG5cdFx0XHRcdFx0XHRcdGZvciAobGV0IHh5PTA7IHh5PD0xOyB4eSsrKSB7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBJVVAgc3BlYzogaHR0cHM6Ly93d3cubWljcm9zb2Z0LmNvbS90eXBvZ3JhcGh5L290c3BlYy9ndmFyLmh0bSNJRFVQXG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgcEEgPSB0aGlzLnBvaW50c1twcmVjUHRdW3h5XTtcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBwQiA9IHRoaXMucG9pbnRzW2ZvbGxQdF1beHldO1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IGRBID0gc2NhbGVkRGVsdGFzW3ByZWNQdF1beHldO1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IGRCID0gc2NhbGVkRGVsdGFzW2ZvbGxQdF1beHldO1xuXG5cdFx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgcT1wTmV4dCwgRCwgVCwgUTsgcSE9Zm9sbFB0OyBxPSAocS1zdGFydFB0KzEpICUgbnVtUG9pbnRzSW5Db250b3VyICsgc3RhcnRQdCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0USA9IHRoaXMucG9pbnRzW3FdW3h5XTtcblx0XHRcdFx0XHRcdFx0XHRcdGlmIChwQSA9PSBwQilcblx0XHRcdFx0XHRcdFx0XHRcdFx0RCA9IGRBID09IGRCID8gZEEgOiAwO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChRIDw9IHBBICYmIFEgPD0gcEIpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0RCA9IHBBIDwgcEIgPyBkQSA6IGRCO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNlIGlmIChRID49IHBBICYmIFEgPj0gcEIpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0RCA9IHBBID4gcEIgPyBkQSA6IGRCO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRUID0gKFEgLSBwQSkgLyAocEIgLSBwQSk7IC8vIHNhZmUgZm9yIGRpdmlkZS1ieS16ZXJvXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0RCA9ICgxLVQpICogZEEgKyBUICogZEI7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdHNjYWxlZERlbHRhc1txXVt4eV0gKz0gRDtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cCA9IGZvbGxQdDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKHBOZXh0ID09IHN0YXJ0UHQgJiYgZmlyc3RQcmVjUHQgPT0gLTEpIC8vIGZhaWxlZCB0byBmaW5kIGEgcHJlY1B0LCBzbyBhYmFuZG9uIHRoaXMgY29udG91clxuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0cCA9IHBOZXh0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzdGFydFB0ID0gdGhpcy5lbmRQdHNbY10rMTtcblx0XHRcdFx0fVxuXHRcdFx0fSAvLyBpZiBJVVBcblxuXHRcdFx0Ly8gYWRkIHRoZSBuZXQgZGVsdGFzIHRvIHRoZSBnbHlwaFxuXHRcdFx0Ly8gVE9ETzogVHJ5IHRvIGF2b2lkIHRoaXMgc3RlcCBmb3IgcG9pbnRzIHRoYXQgd2VyZSBub3QgbW92ZWRcblx0XHRcdC8vIFRPRE86IFVuZGVyc3RhbmQgd2hldGhlciByb3VuZGluZyBpcyBkZWZpbml0ZWx5IHdyb25nIGhlcmUuXG5cdFx0XHQvLyAtIGh0dHBzOi8vZG9jcy5taWNyb3NvZnQuY29tL2VuLXVzL3R5cG9ncmFwaHkvb3BlbnR5cGUvc3BlYy9vdHZhcm92ZXJ2aWV3XG5cdFx0XHRpZ2x5cGgucG9pbnRzLmZvckVhY2goKHBvaW50LCBwdCkgPT4ge1xuXHRcdFx0XHRwb2ludFswXSArPSBzY2FsZWREZWx0YXNbcHRdWzBdO1xuXHRcdFx0XHRwb2ludFsxXSArPSBzY2FsZWREZWx0YXNbcHRdWzFdO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Ly8gc3RvcmUgUyBhbmQgc2NhbGVkRGVsdGFzIHNvIHdlIGNhbiB1c2UgdGhlbSBpbiB2aXN1YWxpemF0aW9uXG5cdFx0Ly8gLSBtYXliZSB3ZSBzaG91bGQgcmVjYWxjdWxhdGUgbXVsdGlwbGUgQVMgdmFsdWVzIGFuZCAxIFMgdmFsdWUgaW4gdGhlIEdVSSBzbyB3ZSBkb27igJl0IGFkZCBsb2FkIHRvIHNhbXNhLWNvcmVcblx0XHRpZiAob3B0aW9ucy52aXN1YWxpemF0aW9uKSB7XG5cdFx0XHRpZ2x5cGgudml6LnR2dHMucHVzaCh7XG5cdFx0XHRcdFM6IFMsXG5cdFx0XHRcdHNjYWxlZERlbHRhczogc2NhbGVkRGVsdGFzLFxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdH0pOyAvLyBlbmQgb2YgcHJvY2Vzc2luZyB0aGUgdHZ0c1xuXG5cdC8vIHJlY2FsY3VsYXRlIGJib3hcblx0Ly8gLSBUT0RPOiBmaXggZm9yIGNvbXBvc2l0ZXMgYW5kIG5vbi1wcmludGluZyBnbHlwaHMgKGV2ZW4gdGhvdWdoIHRoZSBsYXR0ZXIgZG9u4oCZdCByZWNvcmQgYSBiYm94KVxuXHQvLyBpZ2x5cGgucmVjYWxjdWxhdGVCb3VuZHMoKTtcblxuXHQvLyBhdHRhY2ggdGhlIGluc3RhbnRpYXRlZCBnbHlwaCB0byB0aGUgaW5zdGFuY2Vcblx0aWYgKGlnbHlwaC5pbnN0YW5jZSlcblx0XHRpZ2x5cGguaW5zdGFuY2UuZ2x5cGhzW3RoaXMuaWRdID0gaWdseXBoO1xuXG5cdHJldHVybiBpZ2x5cGg7XG59XG5cblxuLy8gZGVjb21wb3NlKClcbi8vIC0gZGVjb21wb3NlIGEgY29tcG9zaXRlIGdseXBoIGludG8gYSBuZXcgc2ltcGxlIGdseXBoXG4vLyAtIFRPRE86IGZpeCB0aGlzIGZvciB0aGUgbmV3IHBhcmFkaWdtcyA6KVxuLy9TYW1zYUdseXBoLnByb3RvdHlwZS5kZWNvbXBvc2UgPSBmdW5jdGlvbiAodHVwbGUsIHBhcmFtcykge1xuLy9TYW1zYUdseXBoLnByb3RvdHlwZS5kZWNvbXBvc2UgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIHBhcmFtcykge1xuU2Ftc2FHbHlwaC5wcm90b3R5cGUuZGVjb21wb3NlID0gZnVuY3Rpb24gKHBhcmFtcykge1xuXG5cdC8vIFwidGhpc1wiIGlzIGVpdGhlciBhIGdseXBoICh3aXRob3V0IGFuIGluc3RhbmNlKSBvciBhbiBpbnN0YW50aWF0ZWQgZ2x5cGggKHdpdGggYW4gaW5zdGFuY2UpXG5cblx0Y29uc3QgZm9udCA9IHRoaXMuZm9udDtcblx0bGV0IHNpbXBsZUdseXBoID0gbmV3IFNhbXNhR2x5cGgoIHtcblx0XHRpZDogdGhpcy5pZCxcblx0XHRuYW1lOiB0aGlzLm5hbWUsXG5cdFx0Zm9udDogZm9udCxcblx0XHRjdXJ2ZU9yZGVyOiB0aGlzLmN1cnZlT3JkZXIsXG5cdFx0ZW5kUHRzOiBbXSxcblx0fSApO1xuXG5cdGlmICh0aGlzLmluc3RhbmNlKSB7XG5cdFx0c2ltcGxlR2x5cGguaW5zdGFuY2UgPSB0aGlzLmluc3RhbmNlO1xuXHR9XG5cblx0bGV0IG9mZnNldCwgdHJhbnNmb3JtLCBmbGFncztcblx0aWYgKHBhcmFtcykge1xuXHRcdG9mZnNldCA9IHBhcmFtcy5vZmZzZXQ7XG5cdFx0dHJhbnNmb3JtID0gcGFyYW1zLnRyYW5zZm9ybTtcblx0XHRmbGFncyA9IHBhcmFtcy5mbGFncztcblx0fVxuXG5cdC8vIHNpbXBsZSBjYXNlXG5cdGlmICh0aGlzLm51bWJlck9mQ29udG91cnMgPj0gMCkge1xuXG5cdFx0aWYgKCFwYXJhbXMpIC8vIG9wdGltaXphdGlvbiBmb3IgY2FzZSB3aGVuIHRoZXJl4oCZcyBubyBvZmZzZXQgYW5kIG5vIHRyYW5zZm9ybSAod2UgY2FuIG1ha2UgdGhpcyByZXR1cm4gXCJ0aGlzXCIgaXRzZWxmOiB0aGUgZGVjb21wb3NpdGlvbiBvZiBhIHNpbXBsZSBnbHlwaCBpcyBpdHNlbGYpXG5cdFx0XHRyZXR1cm4gdGhpcztcblxuXHRcdC8vIGFwcGVuZCBhbGwgdGhlIHBvaW50cyAoaWdub3JlIHBoYW50b20gcG9pbnRzKVxuXHRcdGZvciAobGV0IHB0PTA7IHB0PHRoaXMubnVtUG9pbnRzOyBwdCsrKSB7XG5cblx0XHRcdC8vIHNwZWM6IGh0dHBzOi8vZG9jcy5taWNyb3NvZnQuY29tL2VuLXVzL3R5cG9ncmFwaHkvb3BlbnR5cGUvc3BlYy9nbHlmXG5cdFx0XHRsZXQgcG9pbnQgPSBbIHRoaXMucG9pbnRzW3B0XVswXSwgdGhpcy5wb2ludHNbcHRdWzFdLCB0aGlzLnBvaW50c1twdF1bMl0gXTsgLy8gbmVlZHMgdG8gYmUgYSBkZWVwIGNvcHksIEkgdGhpbmtcblxuXHRcdFx0Ly8gb2Zmc2V0IGJlZm9yZSB0cmFuc2Zvcm1cblx0XHRcdGlmIChvZmZzZXQgJiYgKGZsYWdzICYgMHgwODAwKSkgeyAvLyBTQ0FMRURfQ09NUE9ORU5UX09GRlNFVFxuXHRcdFx0XHRwb2ludFswXSArPSBvZmZzZXRbMF07XG5cdFx0XHRcdHBvaW50WzFdICs9IG9mZnNldFsxXTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gdHJhbnNmb3JtIG1hdHJpeD9cblx0XHRcdGlmICh0cmFuc2Zvcm0pIHtcblx0XHRcdFx0bGV0IHggPSBwb2ludFswXSwgeSA9IHBvaW50WzFdO1xuXHRcdFx0XHRwb2ludFswXSA9IHggKiB0cmFuc2Zvcm1bMF0gKyB5ICogdHJhbnNmb3JtWzFdO1xuXHRcdFx0XHRwb2ludFsxXSA9IHggKiB0cmFuc2Zvcm1bMl0gKyB5ICogdHJhbnNmb3JtWzNdO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBvZmZzZXQgYWZ0ZXIgdHJhbnNmb3JtXG5cdFx0XHRpZiAob2Zmc2V0ICYmICEoZmxhZ3MgJiAweDA4MDApKSB7IC8vIFNDQUxFRF9DT01QT05FTlRfT0ZGU0VUXG5cdFx0XHRcdHBvaW50WzBdICs9IG9mZnNldFswXTtcblx0XHRcdFx0cG9pbnRbMV0gKz0gb2Zmc2V0WzFdO1xuXHRcdFx0fVxuXG5cdFx0XHRzaW1wbGVHbHlwaC5wb2ludHMucHVzaChwb2ludCk7XG5cdFx0fVxuXG5cdFx0Ly8gZml4IHVwIHNpbXBsZUdseXBoXG5cdFx0Ly8gVE9ETzogY2FuIHRoZXNlIHBvaW50IHRvIHRoZSBvcmlnaW5hbCBvYmplY3RzP1xuXHRcdHRoaXMuZW5kUHRzLmZvckVhY2goZW5kUHQgPT4ge1xuXHRcdFx0c2ltcGxlR2x5cGguZW5kUHRzLnB1c2goZW5kUHQgKyBzaW1wbGVHbHlwaC5udW1Qb2ludHMpO1xuXHRcdH0pO1xuXHRcdHNpbXBsZUdseXBoLm51bVBvaW50cyArPSB0aGlzLm51bVBvaW50cztcblx0XHRzaW1wbGVHbHlwaC5udW1iZXJPZkNvbnRvdXJzICs9IHRoaXMubnVtYmVyT2ZDb250b3Vycztcblx0fVxuXG5cdGVsc2Uge1xuXHRcdC8vIHN0ZXAgdGhydSBjb21wb25lbnRzLCBhZGRpbmcgcG9pbnRzIHRvIHNpbXBsZUdseXBoXG5cdFx0dGhpcy5jb21wb25lbnRzLmZvckVhY2goKGNvbXBvbmVudCwgYykgPT4ge1xuXG5cdFx0XHQvLyBnZXQgZ2MsIHRoZSBjb21wb25lbnQgZ2x5cGgsIGluc3RhbnRpYXRlIGlmIG5lY2Vzc2FyeVxuXHRcdFx0bGV0IGdjO1xuXHRcdFx0aWYgKHRoaXMuaW5zdGFuY2UpIHtcblx0XHRcdFx0Z2MgPSB0aGlzLmluc3RhbmNlLmdseXBoc1tjb21wb25lbnQuZ2x5cGhJZF07IC8vIGF0dGVtcHQgdG8gZ2V0IHRoZSBpbnN0YW50ZWQgZ2x5cGhcblx0XHRcdFx0aWYgKCFnYykgeyAvLyBpZiBpdOKAmXMgbm90IGFscmVhZHkgaW5zdGFudGlhdGVkLCBpbnN0YW50aWF0ZSBpdFxuXHRcdFx0XHRcdGNvbnN0IGdjRGVmYXVsdCA9IGZvbnQuZ2x5cGhzW2NvbXBvbmVudC5nbHlwaElkXSB8fCBmb250LmxvYWRHbHlwaEJ5SWQoY29tcG9uZW50LmdseXBoSWQpOyAvLyBmZXRjaCBmcm9tIGJpbmFyeSBpZiBub3QgYWxyZWFkeSBsb2FkZWRcblx0XHRcdFx0XHRnYyA9IGdjRGVmYXVsdC5pbnN0YW50aWF0ZSh0aGlzLmluc3RhbmNlKTsgLy8gaXQgc3RpbGwgbmVlZHMgdG8gYmUgZGVjb21wb3NlZFxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Z2MgPSBmb250LmdseXBoc1tjb21wb25lbnQuZ2x5cGhJZF0gfHwgZm9udC5sb2FkR2x5cGhCeUlkKGNvbXBvbmVudC5nbHlwaElkKTtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgbWF0Y2hlZCA9IGNvbXBvbmVudC5tYXRjaGVkUG9pbnRzO1xuXHRcdFx0Y29uc3QgbmV3VHJhbnNmb3JtID0gY29tcG9uZW50LnRyYW5zZm9ybTtcblx0XHRcdGxldCBuZXdPZmZzZXQgPSBbIHRoaXMucG9pbnRzW2NdWzBdLCB0aGlzLnBvaW50c1tjXVsxXSBdO1xuXHRcdFx0aWYgKG9mZnNldCkge1xuXHRcdFx0XHRuZXdPZmZzZXRbMF0gKz0gb2Zmc2V0WzBdO1xuXHRcdFx0XHRuZXdPZmZzZXRbMV0gKz0gb2Zmc2V0WzFdO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBkZWNvbXBvc2UhXG5cdFx0XHQvLyAtIHRoaXMgaXMgdGhlIHJlY3Vyc2l2ZSBzdGVwXG5cdFx0XHRsZXQgZGVjb21wID0gZ2MuZGVjb21wb3NlKHtcblx0XHRcdFx0b2Zmc2V0OiBuZXdPZmZzZXQsXG5cdFx0XHRcdHRyYW5zZm9ybTogbmV3VHJhbnNmb3JtLFxuXHRcdFx0XHRmbGFnczogY29tcG9uZW50LmZsYWdzLFxuXHRcdFx0XHRtYXRjaGVkOiBtYXRjaGVkLFxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIGdldCBkZWx0YSBpZiB0aGlzIGNvbXBvbmVudCBpcyBwb3NpdGlvbmVkIHdpdGggXCJtYXRjaGVkIHBvaW50c1wiXG5cdFx0XHRsZXQgZHg9MCwgZHk9MDtcblx0XHRcdGlmIChtYXRjaGVkKSB7XG5cdFx0XHRcdGR4ID0gc2ltcGxlR2x5cGgucG9pbnRzW21hdGNoZWRbMF1dWzBdIC0gZGVjb21wLnBvaW50c1ttYXRjaGVkWzFdXVswXTtcblx0XHRcdFx0ZHkgPSBzaW1wbGVHbHlwaC5wb2ludHNbbWF0Y2hlZFswXV1bMV0gLSBkZWNvbXAucG9pbnRzW21hdGNoZWRbMV1dWzFdO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyB3ZSBub3cgaGF2ZSB0aGUgc2ltcGxlIGdseXBoIFwiZGVjb21wXCI6IG5vIG9mZnNldCBvciB0cmFuc2Zvcm0gaXMgbmVlZGVkIChidXQgd2UgbWF5IG5lZWQgdG8gbWF0Y2ggcG9pbnRzIHVzaW5nIGR4LGR5KVxuXHRcdFx0Zm9yIChsZXQgcD0wOyBwPGRlY29tcC5udW1Qb2ludHM7IHArKykge1xuXHRcdFx0XHRzaW1wbGVHbHlwaC5wb2ludHMucHVzaChbXG5cdFx0XHRcdFx0ZGVjb21wLnBvaW50c1twXVswXSArIGR4LFxuXHRcdFx0XHRcdGRlY29tcC5wb2ludHNbcF1bMV0gKyBkeSxcblx0XHRcdFx0XHRkZWNvbXAucG9pbnRzW3BdWzJdXG5cdFx0XHRcdF0pO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBmaXggdXAgc2ltcGxlR2x5cGhcblx0XHRcdGRlY29tcC5lbmRQdHMuZm9yRWFjaChlbmRQdCA9PiB7XG5cdFx0XHRcdHNpbXBsZUdseXBoLmVuZFB0cy5wdXNoKGVuZFB0ICsgc2ltcGxlR2x5cGgubnVtUG9pbnRzKTtcblx0XHRcdH0pO1xuXHRcdFx0c2ltcGxlR2x5cGgubnVtUG9pbnRzICs9IGRlY29tcC5udW1Qb2ludHM7XG5cdFx0XHRzaW1wbGVHbHlwaC5udW1iZXJPZkNvbnRvdXJzICs9IGRlY29tcC5udW1iZXJPZkNvbnRvdXJzO1xuXHRcdH0pO1xuXHR9XG5cblxuXHQvLyBhZGQgdGhlIDQgcGhhbnRvbSBwb2ludHNcblx0c2ltcGxlR2x5cGgucG9pbnRzLnB1c2goWzAsMCwwXSwgW3RoaXMucG9pbnRzW3RoaXMucG9pbnRzLmxlbmd0aC0zXVswXSwwLDBdLCBbMCwwLDBdLCBbMCwwLDBdKTtcblxuXHQvLyByZXR1cm4gdGhlIHNpbXBsZSBnbHlwaFxuXHRyZXR1cm4gc2ltcGxlR2x5cGg7XG5cbn1cblxuLy8gc3ZnUGF0aCgpXG4vLyAtIGV4cG9ydCBnbHlwaCBhcyBhIHN0cmluZyBzdWl0YWJsZSBmb3IgdGhlIFNWRyA8cGF0aD4gXCJkXCIgYXR0cmlidXRlXG5TYW1zYUdseXBoLnByb3RvdHlwZS5zdmdQYXRoID0gZnVuY3Rpb24gKCkge1xuXG5cdGxldCBjb250b3VycyA9IFtdO1xuXHRsZXQgY29udG91ciwgY29udG91ckxlbiwgcHQsIHB0XywgcHRfXywgcCwgc3RhcnRQdDtcblx0bGV0IHBhdGggPSBcIlwiO1xuXG5cdHN3aXRjaCAodGhpcy5jdXJ2ZU9yZGVyKSB7XG5cblx0XHQvLyBxdWFkcmF0aWMgY3VydmVzXG5cdFx0Y2FzZSAyOlxuXG5cdFx0XHQvLyBMT09QIDE6IGNvbnZlcnQgdGhlIGdseXBoIGNvbnRvdXJzIGludG8gYW4gU1ZHLWNvbXBhdGlibGUgY29udG91cnMgYXJyYXlcblx0XHRcdHN0YXJ0UHQgPSAwO1xuXHRcdFx0dGhpcy5lbmRQdHMuZm9yRWFjaChlbmRQdCA9PiB7XG5cdFx0XHRcdGNvbnRvdXJMZW4gPSBlbmRQdC1zdGFydFB0KzE7IC8vIG51bWJlciBvZiBwb2ludHMgaW4gdGhpcyBjb250b3VyXG5cdFx0XHRcdGNvbnRvdXIgPSBbXTtcblxuXHRcdFx0XHQvLyBpbnNlcnQgb24tY3VydmUgcG9pbnRzIGJldHdlZW4gYW55IHR3byBjb25zZWN1dGl2ZSBvZmYtY3VydmUgcG9pbnRzXG5cdFx0XHRcdGZvciAocD1zdGFydFB0OyBwPD1lbmRQdDsgcCsrKSB7XG5cdFx0XHRcdFx0cHQgPSB0aGlzLnBvaW50c1twXTtcblx0XHRcdFx0XHRwdF8gPSB0aGlzLnBvaW50c1socC1zdGFydFB0KzEpJWNvbnRvdXJMZW4rc3RhcnRQdF07XG5cdFx0XHRcdFx0Y29udG91ci5wdXNoIChwdCk7XG5cdFx0XHRcdFx0aWYgKCEocHRbMl0gJiAweDAxIHx8IHB0X1syXSAmIDB4MDEpKSAvLyBpZiB3ZSBoYXZlIDIgY29uc2VjdXRpdmUgb2ZmLWN1cnZlIHBvaW50cy4uLlxuXHRcdFx0XHRcdFx0Y29udG91ci5wdXNoICggWyAocHRbMF0rcHRfWzBdKS8yLCAocHRbMV0rcHRfWzFdKS8yLCAxIF0gKTsgLy8gLi4ud2UgaW5zZXJ0IHRoZSBpbXBsaWVkIG9uLWN1cnZlIHBvaW50XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBlbnN1cmUgU1ZHIGNvbnRvdXIgc3RhcnRzIHdpdGggYW4gb24tY3VydmUgcG9pbnRcblx0XHRcdFx0aWYgKCEoY29udG91clswXVsyXSAmIDB4MDEpKSAvLyBpcyBmaXJzdCBwb2ludCBvZmYtY3VydmU/XG5cdFx0XHRcdFx0Y29udG91ci51bnNoaWZ0KGNvbnRvdXIucG9wKCkpOyAvLyBPUFRJTUlaRTogdW5zaGlmdCBpcyBzbG93LCBzbyBtYXliZSBidWlsZCB0d28gYXJyYXlzLCBcImFjdHVhbFwiIGFuZCBcInRvQXBwZW5kXCIsIHdoZXJlIFwiYWN0dWFsXCIgc3RhcnRzIHdpdGggYW4gb24tY3VydmVcblxuXHRcdFx0XHQvLyBhcHBlbmQgdGhpcyBjb250b3VyXG5cdFx0XHRcdGNvbnRvdXJzLnB1c2goY29udG91cik7XG5cblx0XHRcdFx0c3RhcnRQdCA9IGVuZFB0KzE7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gTE9PUCAyOiBjb252ZXJ0IGNvbnRvdXJzIGFycmF5IHRvIGFuIGFjdHVhbCBTVkcgcGF0aFxuXHRcdFx0Ly8gLSB3ZeKAmXZlIGFscmVhZHkgZml4ZWQgdGhpbmdzIGluIGxvb3AgMSBzbyB0aGVyZSBhcmUgbmV2ZXIgY29uc2VjdXRpdmUgb2ZmLWN1cnZlIHBvaW50c1xuXHRcdFx0Y29udG91cnMuZm9yRWFjaChjb250b3VyID0+IHtcblx0XHRcdFx0Zm9yIChwPTA7IHA8Y29udG91ci5sZW5ndGg7IHArKykge1xuXHRcdFx0XHRcdHB0ID0gY29udG91cltwXTtcblx0XHRcdFx0XHRpZiAocD09MClcblx0XHRcdFx0XHRcdHBhdGggKz0gYE0ke3B0WzBdfSAke3B0WzFdfWA7XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAocHRbMl0gJiAweDAxKSB7IC8vIG9uLWN1cnZlIHBvaW50IChjb25zdW1lIDEgcG9pbnQpXG5cdFx0XHRcdFx0XHRcdHBhdGggKz0gYEwke3B0WzBdfSAke3B0WzFdfWA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHsgLy8gb2ZmLWN1cnZlIHBvaW50IChjb25zdW1lIDIgcG9pbnRzKVxuXHRcdFx0XHRcdFx0XHRwdF8gPSBjb250b3VyWygrK3ApICUgY29udG91ci5sZW5ndGhdOyAvLyBpbmNyZW1lbnRzIGxvb3AgdmFyaWFibGUgcFxuXHRcdFx0XHRcdFx0XHRwYXRoICs9IGBRJHtwdFswXX0gJHtwdFsxXX0gJHtwdF9bMF19ICR7cHRfWzFdfWA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHBhdGggKz0gXCJaXCI7XG5cdFx0XHR9KTtcblxuXHRcdFx0YnJlYWs7XG5cblx0XHQvLyBjdWJpYyBjdXJ2ZXNcblx0XHQvLyAtIEVYUEVSSU1FTlRBTCFcblx0XHQvLyAtIGZvciB1c2Ugd2l0aCB0dGYtY3ViaWMgZm9ybWF0LCBjZmYgKHdoZW4gd2UgaW1wbGVtZW50IGNmZiksIGFuZCBnbHlmMVxuXHRcdGNhc2UgMzpcblx0XHRcdHN0YXJ0UHQgPSAwO1xuXG5cdFx0XHQvLyBsb29wIHRocm91Z2ggZWFjaCBjb250b3VyXG5cdFx0XHR0aGlzLmVuZFB0cy5mb3JFYWNoKGVuZFB0ID0+IHtcblxuXHRcdFx0XHRsZXQgZmlyc3RPblB0O1xuXHRcdFx0XHRjb250b3VyTGVuID0gZW5kUHQtc3RhcnRQdCsxO1xuXG5cdFx0XHRcdC8vIGZpbmQgdGhpcyBjb250b3Vy4oCZcyBmaXJzdCBvbi1jdXJ2ZSBwb2ludDogaXQgaXMgZWl0aGVyIHN0YXJ0UHQsIHN0YXJ0UHQrMSBvciBzdGFydFB0KzIgKGVsc2UgdGhlIGNvbnRvdXIgaXMgaW52YWxpZClcblx0XHRcdFx0aWYgICAgICAoY29udG91ckxlbiA+PSAxICYmIHRoaXMucG9pbnRzW3N0YXJ0UHRdWzJdICYgMHgwMSlcblx0XHRcdFx0XHRmaXJzdE9uUHQgPSAwO1xuXHRcdFx0XHRlbHNlIGlmIChjb250b3VyTGVuID49IDIgJiYgdGhpcy5wb2ludHNbc3RhcnRQdCsxXVsyXSAmIDB4MDEpXG5cdFx0XHRcdFx0Zmlyc3RPblB0ID0gMTtcblx0XHRcdFx0ZWxzZSBpZiAoY29udG91ckxlbiA+PSAzICYmIHRoaXMucG9pbnRzW3N0YXJ0UHQrMl1bMl0gJiAweDAxKVxuXHRcdFx0XHRcdGZpcnN0T25QdCA9IDI7XG5cblx0XHRcdFx0aWYgKGZpcnN0T25QdCAhPT0gdW5kZWZpbmVkKSB7XG5cblx0XHRcdFx0XHQvLyBsb29wIHRocm91Z2ggYWxsIHRoaXMgY29udG91cuKAmXMgcG9pbnRzXG5cdFx0XHRcdFx0Zm9yIChwPTA7IHA8Y29udG91ckxlbjsgcCsrKSB7XG5cblx0XHRcdFx0XHRcdHB0ID0gdGhpcy5wb2ludHNbc3RhcnRQdCArIChwK2ZpcnN0T25QdCkgJSBjb250b3VyTGVuXTtcblx0XHRcdFx0XHRcdGlmIChwPT0wKVxuXHRcdFx0XHRcdFx0XHRwYXRoICs9IGBNJHtwdFswXX0gJHtwdFsxXX1gO1xuXHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGlmIChwdFsyXSAmIDB4MDEpIHsgLy8gb24tY3VydmUgcG9pbnQgKGNvbnN1bWUgMSBwb2ludClcblx0XHRcdFx0XHRcdFx0XHRwYXRoICs9IGBMJHtwdFswXX0gJHtwdFsxXX1gO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2UgeyAvLyBvZmYtY3VydmUgcG9pbnQgKGNvbnN1bWUgMyBwb2ludHMpXG5cdFx0XHRcdFx0XHRcdFx0cHRfID0gdGhpcy5wb2ludHNbc3RhcnRQdCArICgoKytwICsgZmlyc3RPblB0KSAlIGNvbnRvdXJMZW4pXTsgLy8gaW5jcmVtZW50cyBsb29wIHZhcmlhYmxlIHBcblx0XHRcdFx0XHRcdFx0XHRwdF9fID0gdGhpcy5wb2ludHNbc3RhcnRQdCArICgoKytwICsgZmlyc3RPblB0KSAlIGNvbnRvdXJMZW4pXTsgLy8gaW5jcmVtZW50cyBsb29wIHZhcmlhYmxlIHBcblx0XHRcdFx0XHRcdFx0XHRwYXRoICs9IGBDJHtwdFswXX0gJHtwdFsxXX0gJHtwdF9bMF19ICR7cHRfWzFdfSAke3B0X19bMF19ICR7cHRfX1sxXX1gO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmIChwID09IChjb250b3VyTGVuK2ZpcnN0T25QdC0xKSAlIGNvbnRvdXJMZW4pXG5cdFx0XHRcdFx0XHRcdFx0cGF0aCArPSBcIlpcIjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzdGFydFB0ID0gZW5kUHQrMTtcblx0XHRcdH0pO1xuXHRcdFx0YnJlYWs7XG5cdH1cblxuXHRyZXR1cm4gcGF0aDtcbn07XG5cbi8vIGV4cG9ydFBhdGgoKVxuLy8gLSBleHBvcnQgZ2x5cGggb3V0bGluZSBpbiBhcmJpdHJhcnkgd2F5cywgYWNjb3JkaW5nIHRvIHRoZSBzdXBwbGllZCBTYW1zYUNvbnRleHRcbi8vIC0gU2Ftc2FDb250ZXh0IHByb3ZpZGVzIHZhcmlvdXMgZnVuY3Rpb25zLCBjdHgubW92ZXRvKCksIGN0eC5saW5ldG8sIGN0eC5xdWFkdG8sIGV0Yy5cblNhbXNhR2x5cGgucHJvdG90eXBlLmV4cG9ydFBhdGggPSBmdW5jdGlvbiAoY3R4KSB7XG5cblx0Y29uc3QgY29udG91cnMgPSBbXTtcblx0Y29uc3QgZ2x5cGggPSB0aGlzLm51bWJlck9mQ29udG91cnMgPCAwID8gdGhpcy5kZWNvbXBvc2UoKSA6IHRoaXM7XG5cdGxldCBjb250b3VyLCBjb250b3VyTGVuLCBwdCwgcHRfLCBwdF9fLCBjLCBwLCBzdGFydFB0O1xuXG5cdHN3aXRjaCAodGhpcy5jdXJ2ZU9yZGVyKSB7XG5cblx0XHQvLyBxdWFkcmF0aWMgY3VydmVzXG5cdFx0Y2FzZSAyOlxuXG5cdFx0XHQvLyBMT09QIDE6IGNvbnZlcnQgdGhlIGdseXBoIGNvbnRvdXJzIGludG8gYW4gU1ZHLWNvbXBhdGlibGUgY29udG91cnMgYXJyYXlcblx0XHRcdHN0YXJ0UHQgPSAwO1xuXHRcdFx0Ly90aGlzLmVuZFB0cy5mb3JFYWNoKGVuZFB0ID0+IHtcblx0XHRcdGdseXBoLmVuZFB0cy5mb3JFYWNoKGVuZFB0ID0+IHtcblx0XHRcdFx0XG5cdFx0XHRcdGNvbnRvdXJMZW4gPSBlbmRQdC1zdGFydFB0KzE7IC8vIG51bWJlciBvZiBwb2ludHMgaW4gdGhpcyBjb250b3VyXG5cdFx0XHRcdGNvbnRvdXIgPSBbXTtcblxuXHRcdFx0XHQvLyBpbnNlcnQgb24tY3VydmUgcG9pbnRzIGJldHdlZW4gYW55IHR3byBjb25zZWN1dGl2ZSBvZmYtY3VydmUgcG9pbnRzXG5cdFx0XHRcdGZvciAocD1zdGFydFB0OyBwPD1lbmRQdDsgcCsrKSB7XG5cdFx0XHRcdFx0Ly8gcHQgPSB0aGlzLnBvaW50c1twXTtcblx0XHRcdFx0XHQvLyBwdF8gPSB0aGlzLnBvaW50c1socC1zdGFydFB0KzEpJWNvbnRvdXJMZW4rc3RhcnRQdF07XG5cdFx0XHRcdFx0cHQgPSBnbHlwaC5wb2ludHNbcF07XG5cdFx0XHRcdFx0cHRfID0gZ2x5cGgucG9pbnRzWyhwLXN0YXJ0UHQrMSklY29udG91ckxlbitzdGFydFB0XTtcblx0XHRcdFx0XHRjb250b3VyLnB1c2ggKHB0KTtcblx0XHRcdFx0XHRpZiAoIShwdFsyXSAmIDB4MDEgfHwgcHRfWzJdICYgMHgwMSkpIC8vIGlmIHdlIGhhdmUgMiBjb25zZWN1dGl2ZSBvZmYtY3VydmUgcG9pbnRzLi4uXG5cdFx0XHRcdFx0XHRjb250b3VyLnB1c2ggKCBbIChwdFswXStwdF9bMF0pLzIsIChwdFsxXStwdF9bMV0pLzIsIDEgXSApOyAvLyAuLi53ZSBpbnNlcnQgdGhlIGltcGxpZWQgb24tY3VydmUgcG9pbnRcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGVuc3VyZSBTVkcgY29udG91ciBzdGFydHMgd2l0aCBhbiBvbi1jdXJ2ZSBwb2ludFxuXHRcdFx0XHRpZiAoIShjb250b3VyWzBdWzJdICYgMHgwMSkpIC8vIGlzIGZpcnN0IHBvaW50IG9mZi1jdXJ2ZT9cblx0XHRcdFx0XHRjb250b3VyLnVuc2hpZnQoY29udG91ci5wb3AoKSk7IC8vIE9QVElNSVpFOiB1bnNoaWZ0IGlzIHNsb3csIHNvIG1heWJlIGJ1aWxkIHR3byBhcnJheXMsIFwiYWN0dWFsXCIgYW5kIFwidG9BcHBlbmRcIiwgd2hlcmUgXCJhY3R1YWxcIiBzdGFydHMgd2l0aCBhbiBvbi1jdXJ2ZVxuXG5cdFx0XHRcdC8vIGFwcGVuZCB0aGlzIGNvbnRvdXJcblx0XHRcdFx0Y29udG91cnMucHVzaChjb250b3VyKTtcblx0XHRcdFx0c3RhcnRQdCA9IGVuZFB0KzE7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gTE9PUCAyOiBjb252ZXJ0IGNvbnRvdXJzIGFycmF5IHRvIGFuIGFjdHVhbCBTVkcgcGF0aFxuXHRcdFx0Ly8gLSB3ZeKAmXZlIGFscmVhZHkgZml4ZWQgdGhpbmdzIGluIGxvb3AgMSBzbyB0aGVyZSBhcmUgbmV2ZXIgY29uc2VjdXRpdmUgb2ZmLWN1cnZlIHBvaW50c1xuXHRcdFx0Y29udG91cnMuZm9yRWFjaChjb250b3VyID0+IHtcblx0XHRcdFx0Zm9yIChwPTA7IHA8Y29udG91ci5sZW5ndGg7IHArKykge1xuXHRcdFx0XHRcdHB0ID0gY29udG91cltwXTtcblx0XHRcdFx0XHRpZiAocD09MCkge1xuXHRcdFx0XHRcdFx0Y3R4Lm1vdmV0byhwdFswXSwgcHRbMV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdGlmIChwdFsyXSAmIDB4MDEpIHsgLy8gb24tY3VydmUgcG9pbnQgKGNvbnN1bWUgMSBwb2ludClcblx0XHRcdFx0XHRcdFx0Y3R4LmxpbmV0byhwdFswXSwgcHRbMV0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7IC8vIG9mZi1jdXJ2ZSBwb2ludCAoY29uc3VtZSAyIHBvaW50cylcblx0XHRcdFx0XHRcdFx0cHRfID0gY29udG91clsoKytwKSAlIGNvbnRvdXIubGVuZ3RoXTsgLy8gaW5jcmVtZW50cyBsb29wIHZhcmlhYmxlIHBcblx0XHRcdFx0XHRcdFx0Y3R4LnF1YWR0byhwdFswXSwgcHRbMV0sIHB0X1swXSwgcHRfWzFdKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Y3R4LmNsb3NlcGF0aCgpO1xuXHRcdFx0fSk7XG5cblx0XHRcdGJyZWFrO1xuXG5cdFx0Ly8gY3ViaWMgY3VydmVzXG5cdFx0Ly8gLSBFWFBFUklNRU5UQUwhXG5cdFx0Ly8gLSBmb3IgdXNlIHdpdGggdHRmLWN1YmljIGZvcm1hdCwgY2ZmICh3aGVuIHdlIGltcGxlbWVudCBjZmYpLCBhbmQgZ2x5ZjFcblx0XHRjYXNlIDM6XG5cdFx0XHRzdGFydFB0ID0gMDtcblxuXHRcdFx0Ly8gbG9vcCB0aHJvdWdoIGVhY2ggY29udG91clxuXHRcdFx0dGhpcy5lbmRQdHMuZm9yRWFjaChlbmRQdCA9PiB7XG5cblx0XHRcdFx0bGV0IGZpcnN0T25QdDtcblx0XHRcdFx0Y29udG91ckxlbiA9IGVuZFB0LXN0YXJ0UHQrMTtcblxuXHRcdFx0XHQvLyBmaW5kIHRoaXMgY29udG91cuKAmXMgZmlyc3Qgb24tY3VydmUgcG9pbnQ6IGl0IGlzIGVpdGhlciBzdGFydFB0LCBzdGFydFB0KzEgb3Igc3RhcnRQdCsyIChlbHNlIHRoZSBjb250b3VyIGlzIGludmFsaWQpXG5cdFx0XHRcdGlmICAgICAgKGNvbnRvdXJMZW4gPj0gMSAmJiB0aGlzLnBvaW50c1tzdGFydFB0XVsyXSAmIDB4MDEpXG5cdFx0XHRcdFx0Zmlyc3RPblB0ID0gMDtcblx0XHRcdFx0ZWxzZSBpZiAoY29udG91ckxlbiA+PSAyICYmIHRoaXMucG9pbnRzW3N0YXJ0UHQrMV1bMl0gJiAweDAxKVxuXHRcdFx0XHRcdGZpcnN0T25QdCA9IDE7XG5cdFx0XHRcdGVsc2UgaWYgKGNvbnRvdXJMZW4gPj0gMyAmJiB0aGlzLnBvaW50c1tzdGFydFB0KzJdWzJdICYgMHgwMSlcblx0XHRcdFx0XHRmaXJzdE9uUHQgPSAyO1xuXG5cdFx0XHRcdGlmIChmaXJzdE9uUHQgIT09IHVuZGVmaW5lZCkge1xuXG5cdFx0XHRcdFx0Ly8gbG9vcCB0aHJvdWdoIGFsbCB0aGlzIGNvbnRvdXLigJlzIHBvaW50c1xuXHRcdFx0XHRcdGZvciAocD0wOyBwPGNvbnRvdXJMZW47IHArKykge1xuXG5cdFx0XHRcdFx0XHRwdCA9IHRoaXMucG9pbnRzW3N0YXJ0UHQgKyAocCtmaXJzdE9uUHQpICUgY29udG91ckxlbl07XG5cdFx0XHRcdFx0XHRpZiAocD09MCkge1xuXHRcdFx0XHRcdFx0XHRjdHgubW92ZXRvKHB0WzBdLCBwdFsxXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0aWYgKHB0WzJdICYgMHgwMSkgeyAvLyBvbi1jdXJ2ZSBwb2ludCAoY29uc3VtZSAxIHBvaW50KVxuXHRcdFx0XHRcdFx0XHRcdGN0eC5saW5ldG8ocHRbMF0sIHB0WzFdKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlIHsgLy8gb2ZmLWN1cnZlIHBvaW50IChjb25zdW1lIDMgcG9pbnRzKVxuXHRcdFx0XHRcdFx0XHRcdHB0XyA9IHRoaXMucG9pbnRzW3N0YXJ0UHQgKyAoKCsrcCArIGZpcnN0T25QdCkgJSBjb250b3VyTGVuKV07IC8vIGluY3JlbWVudHMgbG9vcCB2YXJpYWJsZSBwXG5cdFx0XHRcdFx0XHRcdFx0cHRfXyA9IHRoaXMucG9pbnRzW3N0YXJ0UHQgKyAoKCsrcCArIGZpcnN0T25QdCkgJSBjb250b3VyTGVuKV07IC8vIGluY3JlbWVudHMgbG9vcCB2YXJpYWJsZSBwXG5cdFx0XHRcdFx0XHRcdFx0Y3R4LmN1cnZldG8ocHRbMF0sIHB0WzFdLCBwdF9bMF0sIHB0X1sxXSwgcHRfX1swXSwgcHRfX1sxXSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYgKHAgPT0gKGNvbnRvdXJMZW4rZmlyc3RPblB0LTEpICUgY29udG91ckxlbikge1xuXHRcdFx0XHRcdFx0XHRcdGN0eC5jbG9zZXBhdGgoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHN0YXJ0UHQgPSBlbmRQdCsxO1xuXHRcdFx0fSk7XG5cdFx0XHRicmVhaztcblx0fVxuXG5cdC8vcmV0dXJuIHBhdGg7XG59O1xuXG4vLyBwcm9jZXNzIHBhaW50IHRhYmxlcyBmb3IgYSBnbHlwaCwgcHJvZHVjaW5nIGEgREFHIChkaXJlY3RlZCBhY3ljbGljIGdyYXBoKSBvZiBwYWludCB0YWJsZXMsIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVuZGVyIHRoZSBnbHlwaCBvciBtYWtlIGEgZGlhZ3JhbSBvZiBpdHMgcGFpbnQgc3RydWN0dXJlXG4vLyAtIHJldHVybiBmYWxzZSBpZiB0aGVyZSBpcyBubyBDT0xSdjEgZGF0YSBmb3IgdGhpcyBnbHlwaFxuLy8gLSBjb25zaWRlciByZXR1cm5pbmcgQ09MUnYwIGRhdGEgaW4gdGhlIGZvcm0gb2YgcGFpbnQgdGFibGVzLCBzbyB0aGF0IG9ubHkgb25lIGNvbG91ciBcInJlbmRlcmVyXCIgaXMgbmVlZGVkXG5TYW1zYUdseXBoLnByb3RvdHlwZS5wYWludCA9IGZ1bmN0aW9uIChjb250ZXh0PXt9KSB7XG5cdGNvbnN0IG9mZnNldCA9IHRoaXMuZmluZENPTFIoMSk7XG5cblx0aWYgKCFvZmZzZXQpIHtcblx0XHRyZXR1cm4gZmFsc2U7IC8vIG5vIENPTFJ2MSBkYXRhIGZvciB0aGlzIGdseXBoXG5cdH1cblx0ZWxzZSB7XG5cdFx0Y29uc3QgZm9udCA9IHRoaXMuZm9udDtcblx0XHRjb25zdCBidWYgPSBmb250LmJ1ZmZlckZyb21UYWJsZShcIkNPTFJcIik7XG5cdFx0Y29uc3QgY29sciA9IGZvbnQuQ09MUjtcblx0XHRjb25zdCBjcGFsID0gZm9udC5DUEFMO1xuXHRcdGNvbnN0IGdyYWRpZW50cyA9IGNvbnRleHQuZ3JhZGllbnRzO1xuXHRcdGNvbnN0IHBhbGV0dGUgPSBjcGFsLnBhbGV0dGVzW2NvbnRleHQucGFsZXR0ZUlkIHx8IDBdO1xuXG5cdFx0aWYgKGNvbnRleHQuY29sb3IgPT09IHVuZGVmaW5lZCkgY29udGV4dC5jb2xvciA9IDB4MDAwMDAwZmY7XG5cdFx0aWYgKCFjb250ZXh0LnJlbmRlcmluZykgY29udGV4dC5yZW5kZXJpbmcgPSB7fTtcblx0XHRpZiAoIWNvbnRleHQuZ3JhZGllbnRzKSBjb250ZXh0LmdyYWRpZW50cyA9IHt9O1xuXHRcdGlmICghY29udGV4dC5mb250KSBjb250ZXh0LmZvbnQgPSBmb250O1xuXHRcdGlmICghY29udGV4dC5yZW5kZXJpbmcpIGNvbnRleHQucmVuZGVyaW5nID0ge307XG5cdFx0Y29udGV4dC5wYWludElkcyA9IFtdOyAvLyBrZWVwIHRyYWNrIG9mIHRoZSBwYWludCBJRHMgd2XigJl2ZSB1c2VkIChtdXN0IGJlIHJlc2V0IGZvciBlYWNoIGdseXBoKTogd2UgXG5cblx0XHQvLyBmZXRjaCB0aGUgREFHIG9mIHBhaW50IHRhYmxlcyByZWN1cnNpdmVseVxuXHRcdGJ1Zi5zZWVrKG9mZnNldCk7XG5cdFx0Y29uc3QgcGFpbnQgPSBidWYuZGVjb2RlUGFpbnQoY29udGV4dCk7IC8vIHJlY3Vyc2l2ZSAob2ZmZXIgYSBub24tcmVjdXJzaXZlIG9wdGlvbj8pXG5cdFx0Y29udGV4dC5wYWludElkcyA9IG51bGw7IC8vIHdlIG5vIGxvbmdlciBuZWVkIHRoaXNcblx0XHRyZXR1cm4gcGFpbnQ7XG5cdH1cbn1cblxuXG4vLyBwYWludFNWRygpIHJlbmRlcnMgYSBDT0xSdjEgREFHIChwYWludCB0cmVlKSByZWN1cnNpdmVseVxuLy8gLSBwYWludCAocmVxdWlyZWQpIGlzIHRoZSByb290IG9mIHRoZSBEQUcsIG9yIHN1YnJvb3Qgd2hlbiBjYWxsZWQgcmVjdXJzaXZlbHlcbi8vIC0gY29udGV4dCAocmVxdWlyZWQpIGNvbnRhaW5zOlxuLy8gICAuZm9udCwgYSByZWZlcmVuY2UgdG8gdGhlIFNhbXNhRm9udCBvYmplY3Rcbi8vICAgLmNvbG9yLCB0aGUgZm9yZWdyb3VuZCBjb2xvciBiZWluZyB1c2VkIGluIFUzMiBmb3JtYXQgKG9wdGlvbmFsLCBkZWZhdWx0IGlzIDB4MDAwMDAwZmYpXG4vLyAgIC5wYXRocywgb2JqZWN0IHRvIGNhY2hlIHRoZSBtb25vY2hyb21lIGdseXBoIG91dGxpbmVzIHVzZWQgaW4gdGhlIHRleHQgcnVuLCBpbmRleGVkIGJ5IGdseXBoSWRcbi8vICAgLmdyYWRpZW50cywgb2JqZWN0IHRvIGNhY2hlIHRoZSBncmFkaWVudHMgdXNlZCwgaW5kZXhlZCBieSBncmFkaWVudElkXG4vLyAtIHRoZSBmdW5jdGlvbiBkb2VzIG5vdCBtYWtlIHVzZSBvZiB0aGUgU2Ftc2FHbHlwaCBvYmplY3QgYXQgYWxsLCBpdOKAmXMganVzdCBjb252ZW5pZW50IGZvciBleHBvcnRcbi8vIC0gdGhlIG1haW4gc3dpdGNoIHN0YXRlbWVudCBzZWxlY3RzIGJldHdlZW4gdGhlIDQgcGFpbnQgdHlwZXM7IHBhaW50IHR5cGVzIGdyb3VwIHBhaW50IGZvcm1hdHMgdG9nZXRoZXIsIGFuZCBhcmUgc3RvcmVkIGluIFBBSU5UX1RZUEVTOyBQQUlOVF9DT01QT1NFIGlzIHRoZSBvbmx5IG5vbi1yZWN1cnNpdmUgcGFpbnQgdHlwZSAocGFpbnQgZm9ybWF0PTMyIGlzIGEgc3BlY2lhbCBjYXNlIHdoaWNoIG5lZWRzIHRvIHJlY3Vyc2UgMiBwYWludCB0cmVlcyBiZWZvcmUgdGhlIGNvbXBvc2Ugb3BlcmF0aW9uKVxuLy8gLSB0aGUgcmVzdWx0IG9mIGEgcGFpbnRTVkcoKSBzdGlsbCBuZWVkcyB0byBiZSB3cmFwcGVkIGluIGEgPHN2Zz4gZWxlbWVudCwgYW5kIDxkZWZzPiBuZWVkcyB0byBiZSBjb25zdHJ1Y3RlZCBmcm9tIC5wYXRocyBhbmQgLmdyYWRpZW50c1xuU2Ftc2FHbHlwaC5wcm90b3R5cGUucGFpbnRTVkcgPSBmdW5jdGlvbiAocGFpbnQsIGNvbnRleHQpIHtcblx0Y29uc3QgZm9udCA9IGNvbnRleHQuZm9udDtcblx0Y29uc3QgcGFsZXR0ZSA9IGZvbnQuQ1BBTC5wYWxldHRlc1tjb250ZXh0LnBhbGV0dGVJZCB8fCAwXTtcblx0aWYgKGNvbnRleHQuY29sb3IgPT09IHVuZGVmaW5lZClcblx0XHRjb250ZXh0LmNvbG9yID0gMHgwMDAwMDBmZjsgLy8gYmxhY2tcblxuXHRsZXQgc3ZnID0gYDxnPmA7XG5cblx0c3dpdGNoIChQQUlOVF9UWVBFU1twYWludC5mb3JtYXRdKSB7XG5cblx0XHRjYXNlIFBBSU5UX0xBWUVSUzoge1xuXHRcdFx0cGFpbnQuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG5cdFx0XHRcdHN2ZyArPSB0aGlzLnBhaW50U1ZHKGNoaWxkLCBjb250ZXh0KTtcblx0XHRcdH0pO1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0Y2FzZSBQQUlOVF9TSEFQRToge1xuXHRcdFx0aWYgKCFjb250ZXh0LnBhdGhzW3BhaW50LmdseXBoSURdKSB7XG5cdFx0XHRcdGNvbnN0IGdseXBoID0gY29udGV4dC5mb250LmdseXBoc1twYWludC5nbHlwaElEXTtcblx0XHRcdFx0Y29uc3QgaWdseXBoID0gZ2x5cGguaW5zdGFudGlhdGUoY29udGV4dC5pbnN0YW5jZSk7XG5cdFx0XHRcdGNvbnN0IHBhdGggPSBpZ2x5cGguc3ZnR2x5cGhNb25vY2hyb21lKDApOyAvLyByZXRyaWV2ZSBpdCBpZiB3ZSBkb24ndCBhbHJlYWR5IGhhdmUgaXRcblx0XHRcdFx0Y29udGV4dC5wYXRoc1twYWludC5nbHlwaElEXSA9IGA8cGF0aCBpZD1cImcke3BhaW50LmdseXBoSUR9XCIgZD1cIiR7cGF0aH1cIi8+YDtcblx0XHRcdH1cblx0XHRcdGNvbnRleHQubGFzdEdseXBoSWQgPSBwYWludC5nbHlwaElEO1xuXHRcdFx0c3ZnICs9IHRoaXMucGFpbnRTVkcocGFpbnQuY2hpbGRyZW5bMF0sIGNvbnRleHQpOyAvLyB0aGVyZeKAmXMgb25seSBvbmUgY2hpbGQ7IHRoaXMgc2hvdWxkIGJlIGEgZmlsbCBvciBhIGdyYWRpZW50IChvciBtYXliZSBhbm90aGVyIFBBSU5UX1NIQVBFKVxuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0Y2FzZSBQQUlOVF9UUkFOU0ZPUk06IHtcblx0XHRcdGNvbnN0IGNlbnRlciA9IHBhaW50LmNlbnRlcjtcblx0XHRcdGxldCB0cmFuc2Zvcm0gPSBcIlwiO1xuXHRcdFx0aWYgKHBhaW50LnRyYW5zbGF0ZSkge1xuXHRcdFx0XHR0cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7cGFpbnQudHJhbnNsYXRlWzBdfSAke3BhaW50LnRyYW5zbGF0ZVsxXX0pYDtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKHBhaW50Lm1hdHJpeCkge1xuXHRcdFx0XHR0cmFuc2Zvcm0gPSBgbWF0cml4KCR7cGFpbnQubWF0cml4LmpvaW4oXCIgXCIpfSlgO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAocGFpbnQucm90YXRlKSB7XG5cdFx0XHRcdHRyYW5zZm9ybSArPSBgcm90YXRlKCR7LXBhaW50LnJvdGF0ZX1gICsgKGNlbnRlciA/IGAgJHtjZW50ZXJbMF19ICR7Y2VudGVyWzFdfWAgOiBcIlwiKSArYClgOyAvLyBmbGlwIHNpZ24gb2YgYW5nbGUsIGFuZCB1c2UgdGhlIDMtYXJndW1lbnQgZm9ybSBpZiB0aGVyZSBpcyBhIGNlbnRlclxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGlmIChjZW50ZXIpIHtcblx0XHRcdFx0XHR0cmFuc2Zvcm0gKz0gYHRyYW5zbGF0ZSgke2NlbnRlclswXX0gJHtjZW50ZXJbMV19KSBgO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChwYWludC5zY2FsZSkge1xuXHRcdFx0XHRcdHRyYW5zZm9ybSArPSBgc2NhbGUoJHtwYWludC5zY2FsZVswXX0gJHtwYWludC5zY2FsZVsxXX0pYDtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmIChwYWludC5za2V3KSB7XG5cdFx0XHRcdFx0dHJhbnNmb3JtICs9IGBza2V3WCgkey1wYWludC5za2V3WzBdfSlza2V3WSgkey1wYWludC5za2V3WzFdfSlgOyAvLyBmbGlwIHNpZ24gb2YgYW5nbGVzXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGNlbnRlcikge1xuXHRcdFx0XHRcdHRyYW5zZm9ybSArPSBgIHRyYW5zbGF0ZSgkey1jZW50ZXJbMF19ICR7LWNlbnRlclsxXX0pYDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvKlxuXHRcdFx0c3dpdGNoIChwYWludC5mb3JtYXQgLSBwYWludC5mb3JtYXQgJSAyKSB7IC8vIDEyIGFuZCAxMyAtPiAxMiwgMTQgYW5kIDE1IC0+IDE0LCBldGMuICh2YXJpYXRpb24gZGVsdGFzIGhhdmUgYWxyZWFkeSBiZWVuIGFkZGVkKVxuXG5cdFx0XHRcdC8vIHRoZXNlIGFyZSBtb3JlIGVmZmljbmVudGx5IGRvbmUgYnkgY2hlY2tpbmcgcGFpbnQuc2tldyBldGMuIGRpcmVjdGx5XG5cdFx0XHRcdC8vIGlmIChwYWludC5tYXRyaXgpIGV0Yy5cblxuXHRcdFx0XHRjYXNlIDEyOiB7IC8vIFBhaW50VHJhbnNmb3JtXG5cdFx0XHRcdFx0dHJhbnNmb3JtID0gYG1hdHJpeCgke3BhaW50Lm1hdHJpeC5qb2luKFwiIFwiKX0pYDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXNlIDE0OiB7IC8vIFBhaW50VHJhbnNsYXRlXG5cdFx0XHRcdFx0dHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3BhaW50LnRyYW5zbGF0ZVswXX0gJHtwYWludC50cmFuc2xhdGVbMV19KWA7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FzZSAxNjogY2FzZSAxODogY2FzZSAyMDogY2FzZSAyMjogeyAvLyBQYWludFNjYWxlXG5cdFx0XHRcdFx0aWYgKHBhaW50LmNlbnRlcikgdHJhbnNmb3JtICs9IGB0cmFuc2xhdGUoJHstcGFpbnQuY2VudGVyWzBdfSAkey1wYWludC5jZW50ZXJbMV19KWA7XG5cdFx0XHRcdFx0dHJhbnNmb3JtICs9IGBzY2FsZSgke3BhaW50LnNjYWxlLmpvaW4oXCIgXCIpfSlgO1xuXHRcdFx0XHRcdGlmIChwYWludC5jZW50ZXIpIHRyYW5zZm9ybSArPSBgdHJhbnNsYXRlKCR7cGFpbnQuY2VudGVyWzBdfSAke3BhaW50LmNlbnRlclsxXX0pYDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXNlIDI0OiBjYXNlIDI2OiB7IC8vIFBhaW50Um90YXRlXG5cdFx0XHRcdFx0aWYgKHBhaW50LmNlbnRlcikgdHJhbnNmb3JtICs9IGB0cmFuc2xhdGUoJHstcGFpbnQuY2VudGVyWzBdfSAkey1wYWludC5jZW50ZXJbMV19KWA7XG5cdFx0XHRcdFx0dHJhbnNmb3JtICs9IGByb3RhdGUoJHstcGFpbnQucm90YXRlfSlgOyAvLyBmbGlwIHNpZ24gb2YgYW5nbGVcblx0XHRcdFx0XHRpZiAocGFpbnQuY2VudGVyKSB0cmFuc2Zvcm0gKz0gYHRyYW5zbGF0ZSgke3BhaW50LmNlbnRlclswXX0gJHtwYWludC5jZW50ZXJbMV19KWA7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FzZSAyODogY2FzZSAzMDogeyAvLyBQYWludFNrZXdcblx0XHRcdFx0XHRpZiAocGFpbnQuY2VudGVyKSB0cmFuc2Zvcm0gKz0gYHRyYW5zbGF0ZSgkey1wYWludC5jZW50ZXJbMF19ICR7LXBhaW50LmNlbnRlclsxXX0pYDtcblx0XHRcdFx0XHR0cmFuc2Zvcm0gKz0gYHNrZXdYKCR7LXBhaW50LnNrZXdbMF19KWA7IC8vIGZsaXAgc2lnbiBvZiBhbmdsZVxuXHRcdFx0XHRcdHRyYW5zZm9ybSArPSBgc2tld1koJHstcGFpbnQuc2tld1sxXX0pYDsgLy8gZmxpcCBzaWduIG9mIGFuZ2xlXG5cdFx0XHRcdFx0aWYgKHBhaW50LmNlbnRlcikgdHJhbnNmb3JtICs9IGB0cmFuc2xhdGUoJHtwYWludC5jZW50ZXJbMF19ICR7cGFpbnQuY2VudGVyWzFdfSlgO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQqL1xuXG5cdFx0XHRzdmcgPSBgPGcgdHJhbnNmb3JtPVwiJHt0cmFuc2Zvcm19XCI+YDsgLy8gcmV3cml0ZSA8Zz4gdGFnXG5cdFx0XHRzdmcgKz0gdGhpcy5wYWludFNWRyhwYWludC5jaGlsZHJlblswXSwgY29udGV4dCk7IC8vIHRoZXJl4oCZcyBvbmx5IG9uZSBjaGlsZFxuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0Y2FzZSBQQUlOVF9DT01QT1NFOiB7XG5cdFx0XHRzd2l0Y2ggKHBhaW50LmZvcm1hdCkge1xuXHRcdFx0XHRjYXNlIDI6IGNhc2UgMzogeyAvLyBQYWludFNvbGlkXG5cdFx0XHRcdFx0Y29uc3QgcGFsZXR0ZUluZGV4ID0gcGFpbnQucGFsZXR0ZUluZGV4O1xuXHRcdFx0XHRcdGNvbnN0IGNvbG9yID0gcGFsZXR0ZUluZGV4ID09IDB4ZmZmZiA/IGNvbnRleHQuY29sb3IgOiBwYWxldHRlLmNvbG9yc1twYWxldHRlSW5kZXhdO1xuXHRcdFx0XHRcdHN2ZyArPSBgPHVzZSB4PVwiMFwiIHk9XCIwXCIgaHJlZj1cIiNnJHtjb250ZXh0Lmxhc3RHbHlwaElkfVwiIGZpbGw9XCIke2ZvbnQuaGV4Q29sb3JGcm9tVTMyKGNvbG9yKX1cIiAvPmA7IC8vIG1heWJlIHVwZGF0ZSB0aGVzZSB4IGFuZCB5IGxhdGVyXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjYXNlIDQ6IGNhc2UgNTogeyAvLyBQYWludExpbmVhckdyYWRpZW50XG5cdFx0XHRcdFx0aWYgKCFjb250ZXh0LmdyYWRpZW50c1twYWludC5vZmZzZXRdKSB7IC8vIHdlIHVzZSBwYWludC5vZmZzZXQgYXMgZ3JhZGllbnRJZFxuXG5cdFx0XHRcdFx0XHQvLyBjYWxjdWxhdGUgdGhlIGdyYWRpZW50IGxpbmUgKHAweCxwMHkpLi4oZmluYWxYLCBmaW5hbFkpIGZyb20gdGhlIDMgcG9pbnRzIGJ5IGRldGVybWluaW5nIHRoZSBwcm9qZWN0aW9uIHZlY3RvciB2aWEgdGhlIGRvdCBwcm9kdWN0XG5cdFx0XHRcdFx0XHRjb25zdFxuXHRcdFx0XHRcdFx0XHRwMHggPSBwYWludC5wb2ludHNbMF1bMF0sXG5cdFx0XHRcdFx0XHRcdHAweSA9IHBhaW50LnBvaW50c1swXVsxXSxcblx0XHRcdFx0XHRcdFx0cDF4ID0gcGFpbnQucG9pbnRzWzFdWzBdLFxuXHRcdFx0XHRcdFx0XHRwMXkgPSBwYWludC5wb2ludHNbMV1bMV0sXG5cdFx0XHRcdFx0XHRcdHAyeCA9IHBhaW50LnBvaW50c1syXVswXSxcblx0XHRcdFx0XHRcdFx0cDJ5ID0gcGFpbnQucG9pbnRzWzJdWzFdLFxuXHRcdFx0XHRcdFx0XHRkMXggPSBwMXggLSBwMHgsXG5cdFx0XHRcdFx0XHRcdGQxeSA9IHAxeSAtIHAweSxcblx0XHRcdFx0XHRcdFx0ZDJ4ID0gcDJ4IC0gcDB4LFxuXHRcdFx0XHRcdFx0XHRkMnkgPSBwMnkgLSBwMHksXG5cdFx0XHRcdFx0XHRcdGRvdFByb2R1Y3QgPSBkMXgqZDJ4ICsgZDF5KmQyeSxcblx0XHRcdFx0XHRcdFx0cm90TGVuZ3RoU3F1YXJlZCA9IGQyeCpkMnggKyBkMnkqZDJ5LFxuXHRcdFx0XHRcdFx0XHRtYWduaXR1ZGUgPSBkb3RQcm9kdWN0IC8gcm90TGVuZ3RoU3F1YXJlZCxcblx0XHRcdFx0XHRcdFx0ZmluYWxYID0gcDF4IC0gbWFnbml0dWRlICogZDJ4LFxuXHRcdFx0XHRcdFx0XHRmaW5hbFkgPSBwMXkgLSBtYWduaXR1ZGUgKiBkMnk7XG5cblx0XHRcdFx0XHRcdGxldCBncmFkaWVudCA9IGA8bGluZWFyR3JhZGllbnQgaWQ9XCJmJHtwYWludC5vZmZzZXR9XCIgZ3JhZGllbnRVbml0cz1cInVzZXJTcGFjZU9uVXNlXCIgeDE9XCIke3AweH1cIiB5MT1cIiR7cDB5fVwiIHgyPVwiJHtmaW5hbFh9XCIgeTI9XCIke2ZpbmFsWX1cIj5gOyAvLyBwYWludC5vZmZzZXQgaXMgZ3JhZGllbnRJZFxuXHRcdFx0XHRcdFx0cGFpbnQuY29sb3JMaW5lLmNvbG9yU3RvcHMuZm9yRWFjaChjb2xvclN0b3AgPT4ge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBwYWxldHRlSW5kZXggPSBjb2xvclN0b3AucGFsZXR0ZUluZGV4O1xuXHRcdFx0XHRcdFx0XHRjb25zdCBjb2xvciA9IHBhbGV0dGVJbmRleCA9PSAweGZmZmYgPyBjb250ZXh0LmNvbG9yIDogcGFsZXR0ZS5jb2xvcnNbcGFsZXR0ZUluZGV4XTtcblx0XHRcdFx0XHRcdFx0Z3JhZGllbnQgKz0gYDxzdG9wIG9mZnNldD1cIiR7Y29sb3JTdG9wLnN0b3BPZmZzZXQqMTAwfSVcIiBzdG9wLWNvbG9yPVwiJHtmb250LmhleENvbG9yRnJvbVUzMihjb2xvcil9XCIvPmA7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGdyYWRpZW50ICs9IGA8L2xpbmVhckdyYWRpZW50PmA7XG5cdFx0XHRcdFx0XHRjb250ZXh0LmdyYWRpZW50c1twYWludC5vZmZzZXRdID0gZ3JhZGllbnQ7IC8vIHBhaW50Lm9mZnNldCBpcyBncmFkaWVudElkXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHN2ZyArPSBgPHVzZSBocmVmPVwiI2cke2NvbnRleHQubGFzdEdseXBoSWR9XCIgZmlsbD1cInVybCgjZiR7cGFpbnQub2Zmc2V0fSlcIiAvPmA7IC8vIHdlIGhhdmUgeCBhbmQgeSBhdHRyaWJ1dGVzIGF2YWlsYWJsZSBoZXJlLCBidXQgd2UgdXNlIHRoZSBlbmNsb3NpbmcgPGc+IGluc3RlYWRcblx0XHRcdFx0XHQvLyBsYXN0R2x5cGhJZCBpcyBub3Qgc2F0aXNmYWN0b3J5LCBzaW5jZSB3ZSBtYXkgaGF2ZSBzZXZlcmFsIGNvbnNlY3V0aXZlIGZvcm1hdCAxMCB0YWJsZXMgZGVmaW5pbmcgYSBjbGlwIHBhdGggKGluIHByYWN0aWNlIHRoaXMgc2VlbXMgdW5jb21tb24pXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjYXNlIDY6IGNhc2UgNzogeyAvLyBQYWludFJhZGlhbEdyYWRpZW50LCBQYWludFZhclJhZGlhbEdyYWRpZW50XG5cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNhc2UgODogY2FzZSA5OiB7IC8vIFBhaW50U3dlZXBHcmFkaWVudCwgUGFpbnRWYXJTd2VlcEdyYWRpZW50XG5cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNhc2UgMzI6IHsgLy8gUGFpbnRDb21wb3NpdGVcblxuXHRcdFx0XHRcdGNvbnN0IHNyYyA9IHRoaXMucGFpbnRTVkcocGFpbnQuY2hpbGRyZW5bMF0sIGNvbnRleHQpOyAvLyBzb3VyY2Vcblx0XHRcdFx0XHRjb25zdCBkZXN0ID0gdGhpcy5wYWludFNWRyhwYWludC5jaGlsZHJlblsxXSwgY29udGV4dCk7IC8vIGRlc3RpbmF0aW9uXG5cdFx0XHRcdFx0Y29uc3QgZmVNb2RlID0gRkVDT01QT1NJVEVfTU9ERVNbcGFpbnQuY29tcG9zaXRlTW9kZV07XG5cdFx0XHRcdFx0Y29uc3QgY3NzTW9kZSA9IENTU19NSVhfQkxFTkRfTU9ERVNbcGFpbnQuY29tcG9zaXRlTW9kZV07XG5cblx0XHRcdFx0XHQvL2NvbnN0IG1vZGUgPSBGRUNPTVBPU0lURV9NT0RFU1twYWludC5jb21wb3NpdGVNb2RlXSB8fCBDU1NfTUlYX0JMRU5EX01PREVTW3BhaW50LmNvbXBvc2l0ZU1vZGVdO1xuXHRcdFx0XHRcdGlmIChmZU1vZGUpIHtcblx0XHRcdFx0XHRcdHN2ZyA9IGA8ZyBtaXgtYmxlbmQtbW9kZT1cIiR7ZmVNb2RlfVwiPmA7XG5cdFx0XHRcdFx0XHRzdmcgKz0gc3JjO1xuXHRcdFx0XHRcdFx0c3ZnICs9IGRlc3Q7XG5cdFx0XHRcdFx0XHRzdmcgKz0gYDwvZz5gO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmIChjc3NNb2RlKSB7XG5cdFx0XHRcdFx0XHRzdmcgPSBgPGcgc3R5bGU9XCJtaXgtYmxlbmQtbW9kZTogJHtjc3NNb2RlfTtcIj5gO1xuXHRcdFx0XHRcdFx0c3ZnICs9IHNyYztcblx0XHRcdFx0XHRcdHN2ZyArPSBkZXN0O1xuXHRcdFx0XHRcdFx0c3ZnICs9IGA8L2c+YDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRzd2l0Y2ggKHBhaW50LmNvbXBvc2l0ZU1vZGUpIHtcblx0XHRcdFx0XHRcdFx0Y2FzZSAwOiB7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gZG8gbm90aGluZ1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGNhc2UgMToge1xuXHRcdFx0XHRcdFx0XHRcdC8vIHBhaW50IHNyY1xuXHRcdFx0XHRcdFx0XHRcdHN2ZyArPSBzcmM7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0Y2FzZSAyOiB7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gcGFpbnQgZGVzdFxuXHRcdFx0XHRcdFx0XHRcdHN2ZyArPSBkZXN0O1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblx0XG5cdHN2ZyArPSBcIjwvZz5cIjtcblx0cmV0dXJuIHN2Zztcbn1cblxuU2Ftc2FHbHlwaC5wcm90b3R5cGUuc3ZnR2x5cGhDT0xSdjEgPSBmdW5jdGlvbiAoY29udGV4dD17fSkge1xuXHRjb25zdCByZXN1bHQgPSB0aGlzLmZpbmRDT0xSKDEpOyAvLyBtaWdodCBiZSB1bmRlZmluZWRcblx0aWYgKHJlc3VsdCkge1xuXHRcdGNvbnN0IHBhaW50RGFnID0gdGhpcy5wYWludChjb250ZXh0KTtcblx0XHRpZiAocGFpbnREYWcpIHtcblx0XHRcdGNvbnN0IHN2Z1Jlc3VsdCA9IHRoaXMucGFpbnRTVkcocGFpbnREYWcsIGNvbnRleHQpOyAvLyB3ZSBjb3VsZCBicmluZyB0aGUgcGFpbnRTVkcgZnVuY3Rpb24gaW5zaWRlIGhlcmUsIGJ1dCB0aGVyZSBzZWVtcyBsaXR0bGUgcG9pbnRcblx0XHRcdHJldHVybiBzdmdSZXN1bHQ7IC8vIHRoaXMgaXMgYSA8Zz4gZWxlbWVudCByZWFkeSB0byBiZSBpbnNlcnRlZCBpbnRvIGFuIDxzdmc+LCBidXQgd2UgbXVzdCBhbHNvIHJlbWVtYmVyIHRvIGFkZCB0aGUgcGF0aHMgYW5kIGdyYWRpZW50cyBmcm9tIHRoZSBjb250ZXh0XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0cmV0dXJuIGZhbHNlOyAvLyB3ZSBkaWRu4oCZdCBmaW5kIGEgQ09MUnYxIGdseXBoXG5cdFx0fVxuXHR9XG59XG5cblNhbXNhR2x5cGgucHJvdG90eXBlLnN2Z0dseXBoQ09MUnYwID0gZnVuY3Rpb24gKGNvbnRleHQ9e30pIHsgLy8gd2UgbmVlZCB0byBwb3NzIHRoZSBpbnN0YW5jZSwgcmlnaHQ/XG5cdGNvbnN0IHJlc3VsdCA9IHRoaXMuZmluZENPTFIoMCk7IC8vIG1pZ2h0IGJlIHVuZGVmaW5lZFxuXHRpZiAocmVzdWx0KSB7XG5cdFx0Y29uc3QgW2ZpcnN0TGF5ZXJJbmRleCwgbnVtTGF5ZXJzXSA9IHJlc3VsdDtcblx0XHRjb25zdCBmb250ID0gdGhpcy5mb250O1xuXHRcdGNvbnN0IGJ1ZiA9IGZvbnQuYnVmZmVyRnJvbVRhYmxlKFwiQ09MUlwiKTtcblx0XHRjb25zdCBjb2xyID0gZm9udC5DT0xSO1xuXHRcdGNvbnN0IGNwYWwgPSBmb250LkNQQUw7XG5cdFx0Ly9jb25zdCBkZWZhdWx0Q29sb3IgPSBjb250ZXh0LmNvbG9yID8/IDB4MDAwMDAwZmY7IC8vIGRlZmF1bHQgY29sb3IgLy8gYWxsb3dzIDB4MDAwMDAwMDAwIChhIHZhbGlkIHRyYW5zcGFyZW50IGNvbG9yKVxuXHRcdGNvbnN0IGRlZmF1bHRDb2xvciA9IGNvbnRleHQuY29sb3IgPT09IHVuZGVmaW5lZCA/IDB4MDAwMDAwZmYgOiBjb250ZXh0LmNvbG9yOyAvLyBkZWZhdWx0IGNvbG9yIC8vIGFsbG93cyAweDAwMDAwMDAwMCAoYSB2YWxpZCB0cmFuc3BhcmVudCBjb2xvcilcblx0XHRjb25zdCBwYWxldHRlID0gY3BhbC5wYWxldHRlc1tjb250ZXh0LnBhbGV0dGVJZCB8fCAwXTtcblx0XHRsZXQgcGF0aHMgPSBcIlwiO1xuXHRcdGZvciAobGV0IGk9MDsgaTxudW1MYXllcnM7IGkrKykge1xuXHRcdFx0YnVmLnNlZWsoY29sci5sYXllclJlY29yZHNPZmZzZXQgKyA0ICogKGZpcnN0TGF5ZXJJbmRleCArIGkpKTtcblx0XHRcdGNvbnN0IGdseXBoSWQgPSBidWYudTE2O1xuXHRcdFx0Y29uc3QgcGFsZXR0ZUluZGV4ID0gYnVmLnUxNjtcblx0XHRcdGNvbnN0IGxheWVyR2x5cGggPSBmb250LmdseXBoc1tnbHlwaElkXTtcblx0XHRcdGNvbnN0IGlHbHlwaCA9IGxheWVyR2x5cGguaW5zdGFudGlhdGUoY29udGV4dC5pbnN0YW5jZSk7XG5cdFx0XHRjb25zdCBkR2x5cGggPSBpR2x5cGguZGVjb21wb3NlKCk7XG5cdFx0XHRpZiAoZEdseXBoLm51bWJlck9mQ29udG91cnMgPiAwKSB7XG5cdFx0XHRcdGNvbnN0IGxheWVyQ29sb3IgPSBwYWxldHRlSW5kZXggPT0gMHhmZmZmID8gZGVmYXVsdENvbG9yIDogcGFsZXR0ZS5jb2xvcnNbcGFsZXR0ZUluZGV4XTsgLy8gVE9ETzogb21pdCBmaWxsIGlmIHBhbGV0dGVJbmRleCA9PSAweGZmZmYsIGFuZCBwdXQgaXQgaW4gdGhlIGNvbnRhaW5pbmcgPGc+IGVsZW1lbnQgaW5zdGVhZFxuXHRcdFx0XHRwYXRocyArPSBgPHBhdGggZD1cIiR7ZEdseXBoLnN2Z1BhdGgoKX1cIiBmaWxsPVwiJHtmb250LmhleENvbG9yRnJvbVUzMihsYXllckNvbG9yKX1cIi8+XFxuYDsgLy8gVE9ETzogcHJlY2FsY3VsYXRlIHRoZSBoZXggc3RyaW5ncyBmb3IgdGhlIHBhbGV0dGVzPyBOT1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gcGF0aHM7XG5cdH1cblx0ZWxzZSB7XG5cdFx0cmV0dXJuIGZhbHNlOyAvLyB3ZSBkaWRu4oCZdCBmaW5kIGEgQ09MUnYwIGdseXBoXG5cdH1cbn1cblxuZnVuY3Rpb24gU2Ftc2FDb250ZXh0KG9wdGlvbnMpIHtcblx0dGhpcy5wYXRoID0gW107XG5cdHRoaXMuYmVnaW5wYXRoID0gb3B0aW9ucy5iZWdpbnBhdGg7XG5cdHRoaXMubW92ZXRvID0gb3B0aW9ucy5tb3ZldG87XG5cdHRoaXMubGluZXRvID0gb3B0aW9ucy5saW5ldG87XG5cdHRoaXMucXVhZHRvID0gb3B0aW9ucy5xdWFkdG87XG5cdHRoaXMuY3ViaWN0byA9IG9wdGlvbnMuY3ViaWN0bztcblx0dGhpcy5jbG9zZXBhdGggPSBvcHRpb25zLmNsb3NlcGF0aDtcblx0dGhpcy5jb2xvciA9IG9wdGlvbnMuY29sb3I7XG5cdHRoaXMucGFsZXR0ZUlkID0gb3B0aW9ucy5wYWxldHRlSWQ7XG5cdHRoaXMuZ3JhZGllbnRJZCA9IG9wdGlvbnMuZ3JhZGllbnRJZDtcblx0dGhpcy5ncmFkaWVudFBvaW50cyA9IG9wdGlvbnMuZ3JhZGllbnRQb2ludHM7XG5cdHRoaXMuZ3JhZGllbnRTdG9wcyA9IG9wdGlvbnMuZ3JhZGllbnRTdG9wcztcblx0dGhpcy5ncmFkaWVudFR5cGUgPSBvcHRpb25zLmdyYWRpZW50VHlwZTtcblx0Ly90aGlzLnBvcFRyYW5zZm9ybSA9IG9wdGlvbnMuZ3JhZGllbnRUcmFuc2Zvcm07XG5cdHRoaXMuY3R4ID0gb3B0aW9ucy5jdHg7IC8vIHRoaXMgaXMgdXNlZCBmb3IgdGhlIGFjdHVhbCBIVE1MIGNhbnZhcyBjb250ZXh0IChpZ25vcmVkIGluIFNWRylcbn1cblxuXG4vLyBTYW1zYUdseXBoLnByb3RvdHlwZS5zdmdHbHlwaE1vbm9jaHJvbWUgPSBmdW5jdGlvbiAoKSB7XG5cbi8vIFx0Ly8gVE9ETzogZG9u4oCZdCByZXR1cm4gYW55dGhpbmcgZm9yIGVtcHR5IGdseXBocywgYnV0IHRha2UgYWNjb3VudCBvZiBtZXRyaWNzXG4vLyBcdHJldHVybiBgPHBhdGggZD1cIiR7dGhpcy5zdmdQYXRoKCl9XCIvPmA7XG5cbi8vIH1cblxuXG5TYW1zYUdseXBoLnByb3RvdHlwZS5zdmdHbHlwaE1vbm9jaHJvbWUgPSBmdW5jdGlvbiAod3JhcD0xKSB7XG5cblx0Ly8gVE9ETzogZG9u4oCZdCByZXR1cm4gYW55dGhpbmcgZm9yIGVtcHR5IGdseXBocywgYnV0IHRha2UgYWNjb3VudCBvZiBtZXRyaWNzXG5cblx0Ly9yZXR1cm4gYDxwYXRoIGQ9XCIke3RoaXMuc3ZnUGF0aCgpfVwiLz5gO1xuXHQvLyB0aGlzIGlzIFNWRyBidXQgd2UgY2FuIGRvIGNhbnZhcyB0b29cblxuXHRsZXQgY3R4ID0gbmV3IFNhbXNhQ29udGV4dChEUkFXX0ZVTkNUSU9OU1tDT05URVhUX1NWR10pO1xuXHR0aGlzLmV4cG9ydFBhdGgoY3R4KTsgLy8gY29tcGxldGUgdGhlIGN0eC5wYXRoIHN0cmluZyB3aXRoIHRoZSBTVkcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdseXBoXG5cblx0aWYgKHdyYXApXG5cdFx0cmV0dXJuIGA8cGF0aCBkPVwiJHtjdHgucGF0aC5qb2luKFwiXCIpfVwiLz5gO1xuXHRlbHNlXG5cdFx0cmV0dXJuIGN0eC5wYXRoLmpvaW4oXCJcIik7XG5cblx0Ly8gbGV0IGN0eENhbnZhcyA9IG5ldyBTYW1zYUNvbnRleHQoRFJBV19GVU5DVElPTlNbQ09OVEVYVF9DQU5WQVNdKTtcblx0Ly8gY3R4Q2FudmFzLmN0eCA9IGN0eDtcblx0Ly9jdHhDYW52YXMuY3R4LmZpbGxTdHlsZSA9IFwiI2ZmMDAwMFwiO1xuXG5cblx0Ly8gcmV0dXJuIGA8cGF0aCBkPVwiJHt0aGlzLnN2Z1BhdGgoKX1cIi8+YDtcblxufVxuXG5cblNhbXNhR2x5cGgucHJvdG90eXBlLmNhbnZhc0dseXBoTW9ub2Nocm9tZSA9IGZ1bmN0aW9uIChjdHgpIHtcblx0bGV0IGN0eFNhbXNhID0gbmV3IFNhbXNhQ29udGV4dChEUkFXX0ZVTkNUSU9OU1tDT05URVhUX0NBTlZBU10pO1xuXHQvL2N0eENhbnZhcy5jdHggPSBjdHg7XG5cdHRoaXMuZXhwb3J0UGF0aChjdHhTYW1zYSk7IC8vIG5vdyB0aGlzLnBhdGggY29udGFpbnMgbXVsdGlwbGUgZHJhd2luZyBjb21tYW5kc1xuXG5cdC8vY29uc29sZS5sb2coY3R4Q2FudmFzLnBhdGgpO1xuXG5cdC8vIGZldGNoIHRoZSBkcmF3aW5nIGNvbW1hbmRzXG5cdGN0eC5iZWdpblBhdGgoKTtcblxuXHRjdHhTYW1zYS5wYXRoLmZvckVhY2goY21kID0+IHtcblxuXHRcdGNvbnN0IG9wID0gY21kLnBvcCgpO1xuXHRcdHN3aXRjaCAob3ApIHtcblxuXHRcdFx0Y2FzZSBcIk1cIjpcblx0XHRcdFx0Y3R4Lm1vdmVUbyguLi5jbWQpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdFxuXHRcdFx0Y2FzZSBcIkxcIjpcblx0XHRcdFx0Y3R4LmxpbmVUbyguLi5jbWQpO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBcIkNcIjpcblx0XHRcdFx0Y3R4LmJlemllckN1cnZlVG8oLi4uY21kKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcblx0XHRcdGNhc2UgXCJRXCI6XG5cdFx0XHRcdGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKC4uLmNtZCk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFwiWlwiOlxuXHRcdFx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fSlcblx0Y3R4LmZpbGwoKTtcbn1cblxuXG5TYW1zYUdseXBoLnByb3RvdHlwZS5tYXhDT0xSID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gdGhpcy5maW5kQ09MUigxKSA/IDEgOiB0aGlzLmZpbmRDT0xSKDApID8gMCA6IHVuZGVmaW5lZDtcbn1cblxuLy8gZG9lcyB0aGlzIGdseXBoIGhhdmUgYSBjb2xvciBnbHlwaCBvZiB0aGUgZ2l2ZW4gQ09MUiB0YWJsZSB2ZXJzaW9uP1xuLy8gLSB3ZSBjb3VsZCBidWlsZCB0aGlzIGludG8gdGhlIHN2Z0dseXBoQ09MUnYxKCkgYW5kIHN2Z0dseXBoQ09MUnYwKCkgbWV0aG9kcyBidXQgZGVmaW5pbmcgaXQgc2VwYXJhdGVseSBtYWtlcyBpdCBwb3NzaWJsZSB0byB0ZXN0IGZvciBwcmVzZW5jZSBlZmZpY2llbnRseVxuU2Ftc2FHbHlwaC5wcm90b3R5cGUuZmluZENPTFIgPSBmdW5jdGlvbiAodmVyc2lvbikge1xuXHRjb25zdCBmb250ID0gdGhpcy5mb250O1xuXHRjb25zdCBjb2xyID0gZm9udC5DT0xSO1xuXHRpZiAoY29scikge1xuXHRcdGxldCBiPTA7XG5cdFx0bGV0IGdseXBoSWQ7XG5cblx0XHRpZiAodmVyc2lvbiA9PSAxICYmIGNvbHIudmVyc2lvbiA+PSAxKSB7XG5cdFx0XHRyZXR1cm4gY29sci5iYXNlR2x5cGhQYWludFJlY29yZHNbdGhpcy5pZF07IC8vIHJldHVybnMgb2Zmc2V0IHRvIHRoZSBwYWludCByZWNvcmQgb3IgdW5kZWZpbmVkXG5cdFx0fVxuXHRcdGVsc2UgaWYgKHZlcnNpb24gPT0gMCAmJiBjb2xyLnZlcnNpb24gPj0gMCkge1xuXHRcdFx0cmV0dXJuIGNvbHIuYmFzZUdseXBoUmVjb3Jkc1t0aGlzLmlkXTsgLy8gcmV0dXJucyBbZmlyc3RMYXllckluZGV4LCBudW1MYXllcnNdIG9yIHVuZGVmaW5lZFxuXHRcdH1cblxuXHRcdC8vIGlmICh2ZXJzaW9uID09IDEgJiYgY29sci52ZXJzaW9uID49IDEpIHtcblx0XHQvLyBcdGJ1Zi5zZWVrKGNvbHIuYmFzZUdseXBoTGlzdE9mZnNldCk7XG5cdFx0Ly8gXHRjb25zdCBudW1CYXNlR2x5cGhQYWludFJlY29yZHMgPSBidWYudTMyO1xuXHRcdC8vIFx0d2hpbGUgKGIrKyA8IG51bUJhc2VHbHlwaFBhaW50UmVjb3JkcyAmJiAoZ2x5cGhJZCA9IGJ1Zi51MTYpIDwgdGhpcy5pZCkgeyAvLyBsb29rIGZvciBnbHlwaCBpZCBpbiBCYXNlR2x5cGhQYWludFJlY29yZHMgKFRPRE86IGJpbmFyeSBzZWFyY2gpIGhtbSwgd2h5IG5vdCBwcmVwb3B1bGF0ZSB0aGlzP1xuXHRcdC8vIFx0XHRidWYuc2Vla3IoNCk7XG5cdFx0Ly8gXHR9XG5cdFx0Ly8gXHRpZiAoZ2x5cGhJZCA9PSB0aGlzLmlkKVxuXHRcdC8vIFx0XHRyZXR1cm4gYnVmLnRlbGwoKS0yOyAvLyBDSEVDSyB0aGF0IC0yIGlzIGNvcnJlY3QgdG8gdW5kbyB0aGUgdTE2IHJlYWRcblx0XHQvLyB9XG5cblx0XHQvLyBlbHNlIGlmICh2ZXJzaW9uID09IDAgJiYgY29sci52ZXJzaW9uID49IDApIHtcblx0XHQvLyBcdGJ1Zi5zZWVrKGNvbHIuYmFzZUdseXBoUmVjb3Jkc09mZnNldCk7XG5cdFx0Ly8gXHR3aGlsZSAoYisrIDwgY29sci5udW1CYXNlR2x5cGhSZWNvcmRzICYmIChnbHlwaElkID0gYnVmLnUxNikgPCB0aGlzLmlkKSB7IC8vIGxvb2sgZm9yIGdseXBoIGlkIGluIGJhc2VHbHlwaFJlY29yZHMgKFRPRE86IGJpbmFyeSBzZWFyY2gpXG5cdFx0Ly8gXHRcdGJ1Zi5zZWVrcig0KTtcblx0XHQvLyBcdH1cblx0XHQvLyBcdGlmIChnbHlwaElkID09IHRoaXMuaWQpXG5cdFx0Ly8gXHRcdHJldHVybiBidWYudGVsbCgpLTI7XG5cdFx0Ly8gfVxuXHR9XG5cdHJldHVybiBmYWxzZTtcbn1cblxuLy8gU2Ftc2FHbHlwaC5zdmcoKVxuLy8gLSB3ZSBkb27igJl0IHdhbnQgdGhpcyBtZXRob2QgdG8gc3VwcGx5IGEgZmluYWwgc3ZnLi4uIHNpbmNlIHdlIFxuLy8gLSBzdHlsZSBzdXBwbGllcyB2YXJpb3VzIHBhcmFtZXRlcnMgdG8gc3R5bGUgdGhlIHJlc3VsdGluZyBTVkdcbi8vICAgICBTdHlsaW5nIGlzIGFwcGxpZWQgdG8gdGhlIDxnPiBlbGVtZW50IHRoYXQgY29udGFpbnMgdGhlIGdseXBoLlxuLy8gICAgIFRyeSB7IGZpbGw6IFwicmVkXCIgfSBvciB7IGZpbGw6IFwicmVkXCIsIHRyYW5zZm9ybTogXCJ0cmFuc2xhdGUoMTMwLDUwMCkgc2NhbGUoMC41IC0wLjUpXCIgfVxuLy8gICAgIEN1cnJlbnRseSBvbmx5IHN1cHBvcnRzIGNsYXNzLCBmaWxsLCBzdHJva2UsIHN0cm9rZVdpZHRoLCB0cmFuc2Zvcm0uXG4vLyAgICAgTm90ZSB0aGF0IHRoZSB0cmFuc2Zvcm0gcHJvcGVydHkgaXMgYXNzaWduZWQgdG8gdGhlIHRyYW5zZm9ybSBhdHRyaWJ1dGUsIG5vdCB0aGUgc3R5bGUgYXR0cmlidXRlLlxuLy8gLSBvcHRpb25zLmNvbHIgc2VsZWN0cyB0aGUgKm1heGltdW0qIGNvbG9yIGZvcm1hdCB0byB1c2U6IDE9Q09MUnYxLCAwPUNPTFJ2MCwgLTE9bW9ub2Nocm9tZVxuLy8gLSBvcHRpb25zLnBhbGV0dGVJZCBzZWxlY3RzIGEgcGFsZXR0ZUlkIGluIHRoZSBmb250XG4vLyAtIG9wdGlvbnMucGFsZXR0ZSBzdXBwbGllcyBhIGN1c3RvbSBwYWxldHRlXG4vL1NhbXNhR2x5cGgucHJvdG90eXBlLnN2ZyA9IGZ1bmN0aW9uIChzdHlsZT17fSwgb3B0aW9ucz17fSkge1xuU2Ftc2FHbHlwaC5wcm90b3R5cGUuc3ZnID0gZnVuY3Rpb24gKGNvbnRleHQ9e30pIHtcblxuXHRjb25zdCBmb250ID0gdGhpcy5mb250O1xuXG5cdC8vY29uc29sZS5sb2coYFNWRy1pbmcgZ2x5cGggJHt0aGlzLmlkfSwgJHt0aGlzLm51bVBvaW50c30gcG9pbnRzLCAke3RoaXMubnVtYmVyT2ZDb250b3Vyc30gY29udG91cnNgKTtcblx0Ly8gVE9ETzogYWRkIGEgY29tbWVudCBjb250YWluaW4gdGhlIHN0cmluZyBhbmQgZ2x5cGhpZHMgdGhhdCB0aGlzIHN2ZyByZXByZXNlbnRzIChtYXliZSB1c2UgY2xhc3Mgb3IgaWQgaW4gdGhlIDxnPiA/KVxuXHQvL2xldCBzdmdTdHJpbmcgPSBTVkdfUFJFQU1CTEU7XG5cdGxldCBzdmdTdHJpbmcgPSBcIlwiO1xuXHQvLyBsZXQgZXh0cmEgPSAoc3R5bGUuY2xhc3MgPyBgIGNsYXNzPVwiJHtzdHlsZS5jbGFzc31cImAgOiBcIlwiKVxuXHQvLyAgICAgICAgICAgKyAoc3R5bGUuZmlsbCA/IGAgZmlsbD1cIiR7c3R5bGUuZmlsbH1cImAgOiBcIlwiKVxuXHQvLyAgICAgICAgICAgKyAoc3R5bGUuc3Ryb2tlID8gYCBzdHJva2U9XCIke3N0eWxlLnN0cm9rZX1cImAgOiBcIlwiKVxuXHQvLyAgICAgICAgICAgKyAoc3R5bGUuc3Ryb2tlV2lkdGggPyBgIHN0cm9rZS13aWR0aD1cIiR7c3R5bGUuc3Ryb2tlV2lkdGh9XCJgIDogXCJcIik7XG5cdGxldCBleHRyYSA9IChjb250ZXh0LmNsYXNzID8gYCBjbGFzcz1cIiR7Y29udGV4dC5jbGFzc31cImAgOiBcIlwiKVxuXHQgICAgICAgICAgKyAoY29udGV4dC5maWxsID8gYCBmaWxsPVwiJHtjb250ZXh0LmZpbGx9XCJgIDogXCJcIilcblx0ICAgICAgICAgICsgKGNvbnRleHQuc3Ryb2tlID8gYCBzdHJva2U9XCIke2NvbnRleHQuc3Ryb2tlfVwiYCA6IFwiXCIpXG5cdCAgICAgICAgICArIChjb250ZXh0LnN0cm9rZVdpZHRoID8gYCBzdHJva2Utd2lkdGg9XCIke2NvbnRleHQuc3Ryb2tlV2lkdGh9XCJgIDogXCJcIilcblx0XHRcdCAgKyAoY29udGV4dC50cmFuc2Zvcm0gPyBgIHRyYW5zZm9ybT1cIiR7Y29udGV4dC50cmFuc2Zvcm19XCJgIDogXCJcIik7XG5cdC8vIFRPRE86IGNoZWNrIHRoZXNlIHN0eWxlIHRoaW5ncyBkb27igJl0IGludGVyZmVyZSB3aXRoIHRoZSBDT0xSdjEgc3R5bGluZyAob3IgbWF5YmUgdGhhdOKAmXMgb2spXG5cdC8vIFRPRE86IGNvbXBsZXRlbHkgaWdub3JlIHRoaXMgc3R1ZmYsIGFzIGJleW9uZCBzY29wZSBvZiBnZXR0aW5nIHN2ZyBmb3IgYSBnbHlwaDsgaXQgc2hvdWxkIGJlIHRoZSA8Zz4gKCsgb3B0aW9uYWwgdHJhbnNsYXRlKSBhbmQgbm90aGluZyBlbHNlXG5cblx0Ly8gVE9ETzogcmVtb3ZlIHRoaXMgU1ZHIHdyYXBwZXIgc28gd2UgY2FuIHJldHVybiBtdWx0aXBsZSBhIGdseXBoIHJ1biBpbiBhIHNpbmdsZSBTVkdcblx0Ly8gLSBvciBtYXliZSBoYXZlIGEgbG9vayB0aHJ1IGFuIGFycmF5IG9mIGdseXBocyBhbmQgb2Zmc2V0cyBjYWxjdWxhdGVkIGZyb20gc2ltcGxlIG1ldHJpY3Mgb3IgT3BlblR5cGUgbGF5b3V0XG5cdHN2Z1N0cmluZyArPSBgPGcke2V4dHJhfT5cXG5gO1xuXHRzdmdTdHJpbmcgKz0gYDwhLS0gZ2x5cGggJHt0aGlzLmlkfSAtLT5cXG5gO1xuXHRcblx0Ly8gYXR0ZW1wdCBDT0xSdjEsIHRoZW4gQ09MUnYwLCB0aGVuIG1vbm9jaHJvbWUgZm9yIHRoaXMgZ2x5cGhcblx0c3ZnU3RyaW5nICs9IGZvbnQuQ09MUiA/IHRoaXMuc3ZnR2x5cGhDT0xSdjEoY29udGV4dCkgfHwgdGhpcy5zdmdHbHlwaENPTFJ2MChjb250ZXh0KSB8fCB0aGlzLnN2Z0dseXBoTW9ub2Nocm9tZSgpIDogdGhpcy5zdmdHbHlwaE1vbm9jaHJvbWUoKTsgLy8gdGhpcyB0aGUgZGVmYXVsdCBhdXRvIG1vZGUgLy8gVE9ETzogb2ZmZXIgbWV0aG9kIHRvIHNlbGVjdCBhIHNwZWNpZmljIGZvcm1hdFxuXHQvLyAtIHdlIGNhbiBwcm92aWRlIHNvbWUgcmVzdWx0cyBpbmZvIGluIHRoZSBjb250ZXh0XG5cdC8vc3ZnU3RyaW5nICs9IHRoaXMuc3ZnR2x5cGhNb25vY2hyb21lKCk7IC8vIHRoaXMgdGhlIGRlZmF1bHQgYXV0byBtb2RlIC8vIFRPRE86IG9mZmVyIG1ldGhvZCB0byBzZWxlY3QgYSBzcGVjaWZpYyBmb3JtYXRcblxuXHRzdmdTdHJpbmcgKz0gYFxcbjwvZz5gO1xuXHRyZXR1cm4gc3ZnU3RyaW5nOyAvLyBzaGFsbCB3ZSBqdXN0IGxlYXZlIGl0IGxpa2UgdGhpcz9cbn1cblxuXG5cbi8vIGN1c3RvbSBwcm9jZXNzb3JzXG4vKlxuZnVuY3Rpb24gbW92ZXRvX3N2ZyB7XG5cbn1cblxuZnVuY3Rpb24gbW92ZXRvX2NhbnZhcyB7XG5cbn1cblxuZnVuY3Rpb24gbGluZXRvX2NhbnZhcyB7XG5cbn1cblxuZnVuY3Rpb24gcXVhZHRvX2NhbnZhcyB7XG5cbn1cblxuZnVuY3Rpb24gY3ViaWN0b19jYW52YXMge1xuXG59XG4qL1xuXG5cbmNvbnN0IFJFTkRFUkVSX1NWRyA9IDE7XG5jb25zdCBSRU5ERVJFUl9DQU5WQVMgPSAyO1xuXG5jb25zdCBSX01PVkVUTyA9IDE7XG5jb25zdCBSX0xJTkVUTyA9IDI7XG5jb25zdCBSX1FVQURUTyA9IDM7XG5jb25zdCBSX0NVQklDVE8gPSA0O1xuY29uc3QgUl9FTkRQQVRIID0gNTtcbmNvbnN0IFJfTEFZRVIgPSA2O1xuY29uc3QgUl9QQUlOVCA9IDc7XG5jb25zdCBSX01BWCA9IDg7XG5cbmNvbnN0IHJlbmRlckZ1bmNzID0gW107XG5yZW5kZXJGdW5jc1tSRU5ERVJFUl9TVkddID0gW107XG5yZW5kZXJGdW5jc1tSRU5ERVJFUl9DQU5WQVNdID0gW107XG5cbi8vIHJlbmRlckZ1bmNzW1JFTkRFUkVSX1NWR11bUl9NT1ZFVE9dID0gKGN0eCwgeCwgeSkgPT4ge1xuXG4vLyB9KTtcblxuLy8gcmVuZGVyRnVuY3MuZ2V0KFJFTkRFUkVSX1NWRylcbi8vIGNvbnN0IHJlbmRlckZ1bmNzW1JFTkRFUkVSX1NWR10gPSBuZXcgTWFwKClcblxuLy8ge1xuLy8gXHRSX01PVkVUTzogKGN0eCwgeCwgeSkgPT4ge1xuXG4vLyBcdH1cblxuLy8gfTtcblxuXG4vLyBXT1cgdGhpcyBpcyB3b3JraW5nIDIwMjMtMDYtMjIgMDI6MjVcbmNvbnN0IENPTlRFWFRfU1ZHID0gMTtcbmNvbnN0IENPTlRFWFRfQ0FOVkFTID0gMjtcbmNvbnN0IERSQVdfRlVOQ1RJT05TID0gW107XG5EUkFXX0ZVTkNUSU9OU1tDT05URVhUX1NWR10gPSB7XG5cdGJlZ2lucGF0aDogZnVuY3Rpb24gKCkge1xuXHRcdDsgLy8gbm90aGluZyB0byBkb1xuXHR9LFxuXHRtb3ZldG86IGZ1bmN0aW9uICh4LCB5KSB7XG5cdFx0dGhpcy5wYXRoLnB1c2goYE0ke3h9ICR7eX1gKTtcblx0fSxcblx0bGluZXRvOiBmdW5jdGlvbiAoeCwgeSkge1xuXHRcdHRoaXMucGF0aC5wdXNoKGBMJHt4fSAke3l9YCk7XG5cdH0sXG5cdHF1YWR0bzogZnVuY3Rpb24gKHgxLCB5MSwgeCwgeSkge1xuXHRcdHRoaXMucGF0aC5wdXNoKGBRJHt4MX0gJHt5MX0gJHt4fSAke3l9YCk7XG5cdH0sXG5cdGN1YmljdG86IGZ1bmN0aW9uICh4MSwgeTEsIHgyLCB5MiwgeCwgeSkge1xuXHRcdHRoaXMucGF0aC5wdXNoKGBDJHt4MX0gJHt5MX0gJHt4Mn0gJHt5Mn0gJHt4fSAke3l9YCk7XG5cdH0sXG5cdGNsb3NlcGF0aDogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMucGF0aC5wdXNoKGBaYCk7XG5cdH0sXG59O1xuLy8gRFJBV19GVU5DVElPTlNbQ09OVEVYVF9DQU5WQVNdID0ge1xuLy8gXHRiZWdpbnBhdGg6IGZ1bmN0aW9uICgpIHtcbi8vIFx0XHR0aGlzLnBhdGgucHVzaChbXCJCXCJdKTtcbi8vIFx0fSxcbi8vIFx0bW92ZXRvOiBmdW5jdGlvbiAoeCwgeSkge1xuLy8gXHRcdHRoaXMucGF0aC5wdXNoKFtcIk1cIiwgeCwgeV0pO1xuLy8gXHR9LFxuLy8gXHRsaW5ldG86IGZ1bmN0aW9uICh4LCB5KSB7XG4vLyBcdFx0dGhpcy5wYXRoLnB1c2goW1wiTFwiLCB4LCB5XSk7XG4vLyBcdH0sXG4vLyBcdHF1YWR0bzogZnVuY3Rpb24gKHgxLCB5MSwgeCwgeSkge1xuLy8gXHRcdHRoaXMucGF0aC5wdXNoKFtcIlFcIiwgeDEsIHkxLCB4LCB5XSk7XG4vLyBcdFx0O1xuLy8gXHR9LFxuLy8gXHRjdWJpY3RvOiBmdW5jdGlvbiAoeDEsIHkxLCB4MiwgeTIsIHgsIHkpIHtcbi8vIFx0XHR0aGlzLnBhdGgucHVzaChbXCJDXCIsIHgxLCB5MSwgeDIsIHkyLCB4LCB5XSk7XG4vLyBcdH0sXG4vLyBcdGNsb3NlcGF0aDogZnVuY3Rpb24gKCkge1xuLy8gXHRcdHRoaXMucGF0aC5wdXNoKFtcIkZcIl0pO1xuLy8gXHR9LFx0XHRcbi8vIH07XG5cbkRSQVdfRlVOQ1RJT05TW0NPTlRFWFRfQ0FOVkFTXSA9IHtcblx0YmVnaW5wYXRoOiBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy5wYXRoLnB1c2goW1wiQlwiXSk7XG5cdH0sXG5cdG1vdmV0bzogZnVuY3Rpb24gKHgsIHkpIHtcblx0XHR0aGlzLnBhdGgucHVzaChbeCwgeSwgXCJNXCJdKTtcblx0fSxcblx0bGluZXRvOiBmdW5jdGlvbiAoeCwgeSkge1xuXHRcdHRoaXMucGF0aC5wdXNoKFt4LCB5LCBcIkxcIl0pO1xuXHR9LFxuXHRxdWFkdG86IGZ1bmN0aW9uICh4MSwgeTEsIHgsIHkpIHtcblx0XHR0aGlzLnBhdGgucHVzaChbeDEsIHkxLCB4LCB5LCBcIlFcIl0pO1xuXHRcdDtcblx0fSxcblx0Y3ViaWN0bzogZnVuY3Rpb24gKHgxLCB5MSwgeDIsIHkyLCB4LCB5KSB7XG5cdFx0dGhpcy5wYXRoLnB1c2goW3gxLCB5MSwgeDIsIHkyLCB4LCB5LCBcIkNcIl0pO1xuXHR9LFxuXHRjbG9zZXBhdGg6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLnBhdGgucHVzaChbXCJGXCJdKTtcblx0fSxcdFx0XG59O1xuXG5cbi8qXG5jb25zdCBtb3ZlVG8gPSBbXTtcblxuLy8gU1ZHIHJlbmRlcmluZyBmdW5jdGlvbnNcbm1vdmVUb1tSRU5ERVJFUl9TVkddID0gKGN0eCwgeCwgeSkgPT4ge1xuXHRyZXR1cm4gYE0ke3h9ICR7eX1gO1xufVxubGluZVRvW1JFTkRFUkVSX1NWR10gPSAoY3R4LCB4LCB5KSA9PiB7XG5cdHJldHVybiBgTCR7eH0gJHt5fWA7XG59XG5xdWFkVG9bUkVOREVSRVJfU1ZHXSA9IChjdHgsIHgxLCB5MSwgeCwgeSkgPT4ge1xuXHRyZXR1cm4gYFEke3gxfSAke3kxfSAke3h9ICR7eX1gO1xufVxuY3ViaWNUb1tSRU5ERVJFUl9TVkddID0gKGN0eCwgeDEsIHkxLCB4MiwgeTIsIHgsIHkpID0+IHtcblx0cmV0dXJuIGBDJHt4MX0gJHt5MX0gJHt4Mn0gJHt5Mn0gJHt4fSAke3l9YDtcbn1cbmVuZFBhdGhbUkVOREVSRVJfU1ZHXSA9IChjdHgpID0+IHtcblx0cmV0dXJuIGBaYDtcbn1cbnBhaW50W1JFTkRFUkVSX1NWR10gPSAoY3R4LCBwYWludCkgPT4ge1xuXHRyZXR1cm4gYENPTFJ2MSBhIHdob2xlIHN0YWNrIG9mIHN0dWZmYDtcbn1cbmxheWVyW1JFTkRFUkVSX1NWR10gPSAoY3R4LCBnbHlwaCwgY29sb3IpID0+IHtcblx0cmV0dXJuIGBDT0xSdjAgbGF5ZXJgO1xufVxucGFsZXR0ZVtSRU5ERVJFUl9TVkddID0gKGN0eCwgcGFsZXR0ZSkgPT4ge1xuXHRyZXR1cm4gYENQQUwgcGFsZXR0ZWA7XG59XG5cbi8vIGNhbnZhcyByZW5kZXJpbmcgZnVuY3Rpb25zXG5tb3ZlVG9bUkVOREVSRVJfQ0FOVkFTXSA9IChjdHgsIHgsIHkpID0+IHtcblx0cmV0dXJuIGBtIHggeWA7XG59XG5saW5lVG9bUkVOREVSRVJfQ0FOVkFTXSA9IChjdHgsIHgsIHkpID0+IHtcblx0cmV0dXJuIGBsIHggeWA7XG59XG4qL1xuXG4vKlxuZnVuY3Rpb24gU2Ftc2FDb250ZXh0IChuYW1lKSB7XG5cdHRoaXMubmFtZSA9IG5hbWU7XG5cdHN3aXRjaCAodGhpcy5uYW1lKSB7XG5cblx0XHRjYXNlIFwic3ZnXCI6XG5cdFx0XHR0aGlzLnR5cGUgPSBSRU5ERVJFUl9TVkc7XG5cdFx0XHRicmVhaztcblx0XG5cdFx0Y2FzZSBcImNhbnZhc1wiOlxuXHRcdFx0dGhpcy50eXBlID0gUkVOREVSRVJfQ0FOVkFTO1xuXHRcdFx0YnJlYWs7XG5cdFxuXHRcdGRlZmF1bHQ6XG5cdFx0XHRicmVhaztcblx0fVxuXG59XG4qL1xuXG4vKlxuY29uc3QgUkVOREVSRVJTID0ge1xuXHRzdmc6IHtcblx0XHRtb3ZldG86IG1vdmV0b19jYW52YXMsXG5cdFx0bGluZXRvOiBtb3ZldG9fY2FudmFzLFxuXHRcdHF1YWR0bzogcXVhZHRvX2NhbnZhcyxcblx0XHRjdWJpY3RvOiBjdWJpY3RvX2NhbnZhcyxcblx0XHRlbmRwYXRoOiBlbmRwYXRoX2NhbnZhcyxcblx0fVxufVxuKi9cblxuXG4vLyAtIHdvcmtzIGluIGJyb3dzZXIgYW5kIG5vZGVcbmV4cG9ydCB7IFNhbXNhRm9udCwgU2Ftc2FJbnN0YW5jZSwgU2Ftc2FHbHlwaCwgU2Ftc2FDb250ZXh0LCBTYW1zYUJ1ZmZlciwgU0FNU0FHTE9CQUx9O1xuXG5cbi8qXG5cblxuUVVFU1RJT05TXG5cblRoZSBjaGlsZCBwb3NzaWJpbGl0aWVzIGZvciBhIFBhaW50R2x5cGggc2VlbSBwcm9ibGVtYXRpYywgc2VlIEZpbGxpbmcgU2hhcGVzIGh0dHBzOi8vbGVhcm4ubWljcm9zb2Z0LmNvbS9lbi11cy90eXBvZ3JhcGh5L29wZW50eXBlL3NwZWMvY29sciNmaWxsaW5nLXNoYXBlc1xuXG5TbyB0aGUgc2ltcGxlIGlkZWEgaXMgdGhhdCBhbnkgb2YgdGhlIGZpbGwgb3BlcmF0aW9ucyBjYW4gYmUgdXNlZCwgc29saWQgYW5kIGdyYWRpZW50LlxuXG5GaW5hbGx5IHRoZXJl4oCZcyB0aGUgc3RhdGVtZW50OlxuXCJUaGUgY2hpbGQgb2YgYSBQYWludEdseXBoIHRhYmxlIGlzIG5vdCwgaG93ZXZlciwgbGltaXRlZCB0byBvbmUgb2YgdGhlIGJhc2ljIGZpbGwgZm9ybWF0cy4gUmF0aGVyLCB0aGUgY2hpbGQgY2FuIGJlIHRoZSBcbnJvb3Qgb2YgYSBzdWItZ3JhcGggdGhhdCBkZXNjcmliZXMgc29tZSBncmFwaGljIGNvbXBvc2l0aW9uIHRoYXQgaXMgdXNlZCBhcyBhIGZpbGwuIEFub3RoZXIgd2F5IHRvIGRlc2NyaWJlIHRoZSByZWxhdGlvbnNoaXAgXG5iZXR3ZWVuIGEgUGFpbnRHbHlwaCB0YWJsZSBhbmQgaXRzIGNoaWxkIHN1Yi1ncmFwaCBpcyB0aGF0IHRoZSBnbHlwaCBvdXRsaW5lIHNwZWNpZmllZCBieSB0aGUgUGFpbnRHbHlwaCB0YWJsZSBkZWZpbmVzIGEgXG5ib3VuZHMsIG9yIGNsaXAgcmVnaW9uLCB0aGF0IGlzIGFwcGxpZWQgdG8gdGhlIGZpbGwgY29tcG9zaXRpb24gZGVmaW5lZCBieSB0aGUgY2hpbGQgc3ViLWdyYXBoLlwiXG5cblNvIHRoZSBtYWluIGlkZWEgdGhpcyBzZWVtcyB0byBzdXBwb3J0IGlzIHRvIGdlbmVyYXRlIGEgY2xpcCByZWdpb24sIGJlaW5nIHRoZSBpbnRlcnNlY3Rpb24gb2YgYWxsIHRoZSBzaGFwZXMgb2YgYSBzZXF1ZW5jZSBvZiBQYWludEdseXBocy5cblxuT2sgc28gZmFyLCBhbmQgZG9hYmxlIHVzaW5nIDxkZWZzPiBhbmQgPGNsaXBQYXRoPiBpbiBTVkcuXG5cbkJ1dCB0aGVuIHRoZXJl4oCZcyB0aGlzOlxuXCJOb3RlOiBTaGFwZXMgY2FuIGFsc28gYmUgZGVyaXZlZCB1c2luZyBQYWludEdseXBoIHRhYmxlcyBpbiBjb21iaW5hdGlvbiB3aXRoIG90aGVyIHRhYmxlcywgc3VjaCBhcyBQYWludFRyYW5zZm9ybSBcbihzZWUgVHJhbnNmb3JtYXRpb25zKSBvciBQYWludENvbXBvc2l0ZSAoc2VlIENvbXBvc2l0aW5nIGFuZCBibGVuZGluZykuXCJcblxuVGhlIHByb2JsZW0gaXMgdGhlIHdvcmRpbmcgXCJpbiBjb21iaW5hdGlvbiB3aXRoXCIuIEl04oCZcyBwb3NzaWJsZSB0aGF0IHRoaXMgbWVhbnMgdGhvc2UgUGFpbnQgdGFibGVzIG1heSBoYXZlIGJlZW4gdXNlZCBvbmx5IGFzICpwYXJlbnRzKiBvZiB0aGlzIFxuUGFpbnRHbHlwaCB0YWJsZS4gSWYgc28sIHRoYXQga2VlcHMgdGhpbmdzIHVuZGVyIGNvbnRyb2wsIGJ1dCBpdCBpcyBub3QgY2xlYXIuIFRoZSBwaHJhc2UgY291bGQgaW5jbHVkZSB0aGUgcG9zc2liaWxpdHkgb2YgUGFpbnRUcmFuc2Zvcm0gYW5kIFxuUGFpbnRDb21wb3NpdGUgYXMgY2hpbGRyZW4gb2YgUGFpbnRHbHlwaC4gUGFpbnRUcmFuc2Zvcm0gaXMgbm90IGEgYmlnIHByb2JsZW06IHdl4oCZZCBuZWVkIHRvIHRyYW5zZm9ybSB0aGUgc2hhcGUgYW5kIHByZXN1bWFibHkgYWxzbyBhbnkgZ3JhZGllbnQgXG5maWxsLiBIb3dldmVyLCBpZiB3ZSBhbGxvdyBQYWludENvbXBvc2l0ZSBjaGlsZHJlbiwgaXQgaW50ZXJmZXJlcyB3aXRoIFBhaW50Q29tcG9zaXRl4oCZcyBhYmlsaXR5IHRvIGNvbXBvc2Ugb250byB0aGUgY2FudmFzLCBzaW5jZSBpdCB3b3VsZCBiZSB1c2VkIFxuYXMgYSBjbGlwIHJlZ2lvbiBpbnN0ZWFkLlxuXG5Gb3Igbm93LCBsZXTigJlzIGFzc3VtZSBhIHNlcXVlbmNlIG9mIFBhaW50R2x5cGhzIGZvbGxvd2VkIGJ5IGEgZmlsbCBvbmx5LiBObyBQYWludFRyYW5zZm9ybXMsIG5vIFBhaW50Q29tcG9zaXRlcyBhZnRlciBhIFBhaW50R2x5cGguXG5cbiMgU3BlYyBzdWdnZXN0aW9uc1xuXG4jIyBjbWFwXG4qIENsYXJpZnkgdGhhdCBtdWx0aXBsZSBjaGFyYWN0ZXIgbWFwcGluZ3MgYXJlIG5vdCBpbnRlbmRlZCB0byBiZSBhY3RpdmUgYXQgdGhlIHNhbWUgdGltZS4gRm9yIGV4YW1wbGUsIGl0IGlzIG5vdCBwZXJtaXNzbGJsZSB0byBzZXQgdXAgYSBcbmZvbnQgdG8gdXNlIHNvbWUgbWFwcGluZ3MgdmlhIEZvcm1hdCA0LCB0aGVuIGZhbGxiYWNrIHRvIEZvcm1hdCAxMyBmb3IgXCJsYXN0IHJlc29ydFwiIGdseXBocy4gU2ltaWxhcmx5LCBGb3JtYXQgMTIgdGFibGVzICBtdXN0IGJlIGNvbXBsZXRlLFxuYW5kIG11c3Qgbm90IHJlbHkgb24gRm9ybWF0IDQgYXMgZmFsbGJhY2suXG5cbiMjIHZtdHhcbiogU2hvdyB0aGUgdk1ldHJpY3MgZmllbGQgZXhwbGljaXRseS5cblxuIyMgQ09MUnYxXG4qIExpc3QgdGhlIHBvc3NpYmlsaXRpZXMgZm9yIGEgUGFpbnQgcGF0aCBhcyBhIGxhbmd1YWdlLWxpa2UgdHJlZSwgb3IgbWF5YmUgYSBraW5kIG9mIHJlZ2V4LlxuXG4jIyBndmFyXG4qIE1ha2UgY2xlYXIgdGhlIHNoYXJlZFR1cGxlIGFycmF5IGlzIGFsbCBhYm91dCBwZWFrIHR1cGxlcywgd2l0aCBpbmZlcnJlZCBzdGFydCBhbmQgZW5kIGJlaW5nIC0xLCAwIGFuZCAxIGFzIGFwcHJvcHRpYXRlLlxuKiBBbHNvIG5vdGUgdGhhdCB0aGUgc2NhbGFycyBkZXJpdmVkIGZyb20gdGhlIHNoYXJlZFR1cGxlcyBtYXkgYmUgY2FsY3VsYXRlZCBqdXN0IG9uY2UgcGVyIGluc3RhbmNlLlxuKiBUaGVzZSB0d28gc3RhdGVtZW50cyBjb25mbGljdCBcIk5vdGUgdGhhdCBpbnRlcm1lZGlhdGVSZWdpb24gZmxhZyBpcyBpbmRlcGVuZGVudCBvZiB0aGUgZW1iZWRkZWRQZWFrVHVwbGUgZmxhZy4uLlwiIFwiQW4gaW50ZXJtZWRpYXRlLXJlZ2lvblxuIHR1cGxlIHZhcmlhdGlvbiB0YWJsZSBhZGRpdGlvbmFsbHkgaGFzIHN0YXJ0IGFuZCBlbmQgbi10dXBsZXMgLi4uIHRoZXNlIGFyZSBhbHdheXMgcmVwcmVzZW50ZWQgdXNpbmcgZW1iZWRkZWQgdHVwbGUgcmVjb3Jkcy5cIiBUaGUgdHJ1dGggaXMgaWYgIFxuIElOVEVSTUVESUFURV9SRUdJT04gaXMgc2V0LCB0aGVuIEVNQkVEREVEX1BFQUtfVFVQTEUgbXVzdCBhbHNvIGJlIHNldC4gV2UgaGF2ZSBhIHByb2JsZW0gaW4gdGhhdCBpZiB3ZSBoYXZlIGFuIGVtYmVkZGVkIHBlYWsgdHVwbGUgdGhhdCBpcyBOT1RcbiBhbiBpbnRlcm1lZGlhdGUgcmVnaW9uLCB0aGUgc2V0dGluZyBvZiBzdGFydCBhbmQgZW5kIGlzIG5vdCBkZWZpbmVkLiBXZSBhc3N1bWUgaXTigJlzIFxuXG5cblxuKi8iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuLy9pbXBvcnQgeyBjcmVhdGVSZWN0YW5nbGVzIH0gZnJvbSBcIi4vcmVjdGFuZ2xlLW1vZHVsZVwiO1xuLy9pbXBvcnQgeyBTYW1zYUZvbnQsIFNhbXNhR2x5cGgsIFNhbXNhSW5zdGFuY2UsIFNhbXNhQnVmZmVyLCBTQU1TQUdMT0JBTCB9IGZyb20gXCIuL3NhbXNhLWNvcmVcIjtcbi8vaW1wb3J0IHsgU2Ftc2FGb250LCBTYW1zYUdseXBoLCBTYW1zYUluc3RhbmNlLCBTYW1zYUJ1ZmZlciwgU0FNU0FHTE9CQUwgfSBmcm9tIFwic2Ftc2EtY29yZVwiO1xuLy8gY29uc3Qgc2Ftc2EgPSByZXF1aXJlIChcInNhbXNhLWNvcmVcIik7XG4vLyBjb25zdCBTYW1zYUJ1ZmZlciA9IHNhbXNhLlNhbXNhQnVmZmVyO1xuLy8gY29uc3QgU2Ftc2FGb250ID0gc2Ftc2EuU2Ftc2FGb250O1xuLy8gY29uc3QgU2Ftc2FHbHlwaCA9IHNhbXNhLlNhbXNhR2x5cGg7XG4vLyBjb25zdCBTYW1zYUluc3RhbmNlID0gc2Ftc2EuU2Ftc2FJbnN0YW5jZTtcbi8vIGNvbnN0IFNBTVNBR0xPQkFMID0gc2Ftc2EuU0FNU0FHTE9CQUxcbmNvbnN0IHsgU2Ftc2FGb250LCBTYW1zYUdseXBoLCBTYW1zYUluc3RhbmNlLCBTYW1zYUJ1ZmZlciwgU0FNU0FHTE9CQUwgfSA9IHJlcXVpcmUoXCJzYW1zYS1jb3JlXCIpO1xuLy8gQ29kZSBpbiB0aGlzIGZpbGUgaGFzIGFjY2VzcyB0byB0aGUgKmZpZ21hIGRvY3VtZW50KiB2aWEgdGhlIGZpZ21hIGdsb2JhbCBvYmplY3QuXG4vLyBCcm93c2VyIEFQSXMgaW4gdGhlIDxzY3JpcHQ+IHRhZyBpbnNpZGUgXCJ1aS5odG1sXCIgd2hpY2ggaGFzIGFcbi8vIGZ1bGwgYnJvd3NlciBlbnZpcm9ubWVudCAoU2VlIGh0dHBzOi8vd3d3LmZpZ21hLmNvbS9wbHVnaW4tZG9jcy9ob3ctcGx1Z2lucy1ydW4pLlxuLy8gaHR0cHM6Ly93d3cuZmlnbWEuY29tL3BsdWdpbi1kb2NzL3BsdWdpbi1xdWlja3N0YXJ0LWd1aWRlL1xuLy8gRWFjaCB0aW1lIHlvdSBzdGFydCBWUyBDb2RlLCBkbzpcbi8vIDEuIEhpdCBDdHJsLVNoaWZ0LUIgaW4gV2luZG93cywgb3IgQ29tbWFuZC1TaGlmdC1CIGZvciBNYWMuXG4vLyAyLiBTZWxlY3Qgd2F0Y2gtdHNjb25maWcuanNvblxuLy8gV2VicGFjayBhbmQgYnVuZGxpbmdcbi8vIGh0dHBzOi8vd3d3LmZpZ21hLmNvbS9wbHVnaW4tZG9jcy9saWJyYXJpZXMtYW5kLWJ1bmRsaW5nL1xuLy9sZXQgZiA9IG5ldyBTYW1zYUZvbnQoKTtcbi8vIGNvbnN0IEdMT0JBTCA9IHtcbi8vICAgc2Ftc2FGb250OiBudWxsLFxuLy8gfTtcbmNvbnN0IEdMT0JBTCA9IHtcbiAgICBmaWdtYU5vZGU6IG51bGwsXG59O1xuLy8gVGhpcyBzaG93cyB0aGUgSFRNTCBwYWdlIGluIFwidWkuaHRtbFwiLlxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgICB3aWR0aDogMzAwLFxuICAgIGhlaWdodDogNTAwLFxuICAgIHRpdGxlOiBcIkNPTFJ2MSBmb250c1wiLFxufTtcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgb3B0aW9ucyk7XG5jb25zdCBzY2VuZU5vZGVzID0gW107IC8vIHRoZXNlIGFyZSB1c2VkIGluIHRoZSBcInpvb20gdG8gZml0XCIgc3RlcCAvLyBUT0RPOiBpZiB0aGUgVUkgaXMgcGVyc2lzdGVudCwgd2UgbmVlZCB0byByZWNvbnNpZGVyIGhvdyB3ZSB6b29tIHRvIGZpdCBlYWNoIHRpbWVcbmxldCBmb250ID0ge307IC8vIHNraXAgdHlwZSBjaGVja2luZ1xuLy8gQ2FsbHMgdG8gXCJwYXJlbnQucG9zdE1lc3NhZ2VcIiBmcm9tIHdpdGhpbiB0aGUgSFRNTCBwYWdlIHdpbGwgdHJpZ2dlciB0aGlzXG4vLyBjYWxsYmFjay4gVGhlIGNhbGxiYWNrIHdpbGwgYmUgcGFzc2VkIHRoZSBcInBsdWdpbk1lc3NhZ2VcIiBwcm9wZXJ0eSBvZiB0aGVcbi8vIHBvc3RlZCBtZXNzYWdlLlxuZmlnbWEudWkub25tZXNzYWdlID0gbXNnID0+IHtcbiAgICAvLyBPbmUgd2F5IG9mIGRpc3Rpbmd1aXNoaW5nIGJldHdlZW4gZGlmZmVyZW50IHR5cGVzIG9mIG1lc3NhZ2VzIHNlbnQgZnJvbVxuICAgIC8vIHlvdXIgSFRNTCBwYWdlIGlzIHRvIHVzZSBhbiBvYmplY3Qgd2l0aCBhIFwidHlwZVwiIHByb3BlcnR5IGxpa2UgdGhpcy5cbiAgICB2YXIgX2E7XG4gICAgc3dpdGNoIChtc2cudHlwZSkge1xuICAgICAgICBjYXNlICdjcmVhdGUtcmVjdGFuZ2xlcyc6IHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGVzID0gW107XG4gICAgICAgICAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IG1zZy5jb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAvLyAgIGNvbnN0IHJlY3QgPSBmaWdtYS5jcmVhdGVSZWN0YW5nbGUoKTtcbiAgICAgICAgICAgIC8vICAgcmVjdC54ID0gaSAqIDE1MDtcbiAgICAgICAgICAgIC8vICAgcmVjdC5maWxscyA9IFt7dHlwZTogJ1NPTElEJywgY29sb3I6IHtyOiAxLCBnOiAwLjUsIGI6IDB9fV07XG4gICAgICAgICAgICAvLyAgIGZpZ21hLmN1cnJlbnRQYWdlLmFwcGVuZENoaWxkKHJlY3QpO1xuICAgICAgICAgICAgLy8gICBub2Rlcy5wdXNoKHJlY3QpO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gbm9kZXM7XG4gICAgICAgICAgICAvL2ZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhub2Rlcyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlIFwiZmV0Y2gtZm9udFwiOiB7XG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gbXNnICE9PSBudWxsICYmIG1zZyAhPT0gdm9pZCAwID8gbXNnIDogMDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRlbXApO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJmZXRjaC1mb250XCIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJoZXJlIHdlIGFyZVwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgICAgICBmZXRjaChtc2cudXJsKVxuICAgICAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkxvYWRlZCByZXNwb25zZTogXCIsIHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuYXJyYXlCdWZmZXIoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oYXJyYXlCdWZmZXIgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTG9hZGVkIGJ5dGVzOiBcIiwgYXJyYXlCdWZmZXIuYnl0ZUxlbmd0aCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgZm9udEZhY2U6IG1zZy51cmwsXG4gICAgICAgICAgICAgICAgICAgIGFsbEdseXBoczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgYWxsVFZUczogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGZvbnQgPSBuZXcgU2Ftc2FGb250KG5ldyBTYW1zYUJ1ZmZlcihhcnJheUJ1ZmZlciksIG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRm9udCBsb2FkZWRcIik7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZm9udCk7XG4gICAgICAgICAgICAgICAgaWYgKGZvbnQuZnZhcikge1xuICAgICAgICAgICAgICAgICAgICBmb250LmZ2YXIuYXhlcy5mb3JFYWNoKChheGlzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzLm5hbWUgPSBmb250Lm5hbWVzW2F4aXMuYXhpc05hbWVJRF07XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZm9udC5DUEFMKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvbnQuQ1BBTC5oZXhDb2xvcnMgPSB7fTsgLy8gbXVzdCB1c2UgYW4gb2JqZWN0IGhlcmUuLi4gKHNwYXJzZSBhcnJheXMgaW4gSlNPTiBhcmUgSFVHRSEpXG4gICAgICAgICAgICAgICAgICAgIGZvbnQuQ1BBTC5wYWxldHRlcy5mb3JFYWNoKChwYWxldHRlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWxldHRlLmNvbG9ycy5mb3JFYWNoKChjb2xvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQuQ1BBTC5oZXhDb2xvcnNbY29sb3JdID0gZm9udC5oZXhDb2xvckZyb21VMzIoY29sb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBzaWduYWwgdG8gdGhlIFVJIHRoYXQgd2XigJl2ZSBnb3QgdGhlIGZvbnQsIGJ5IHNlbmRpbmcgaXRzIG5hbWVzLCBmdmFyLCBDUEFMXG4gICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiBcIm5hbWVzXCIsIGZ2YXI6IGZvbnQubmFtZXMgfSk7XG4gICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiBcImZ2YXJcIiwgZnZhcjogZm9udC5mdmFyIH0pO1xuICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogXCJDUEFMXCIsIENQQUw6IGZvbnQuQ1BBTCB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgXCJyZW5kZXJcIjoge1xuICAgICAgICAgICAgLy8gZ2V0IHN2ZyBmcm9tIHRleHQsIGZvbnQsIHNpemUsIGF4aXNTZXR0aW5ncywgcGFsZXR0ZVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cgKFwiUkVOREVSXCIpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cgKG1zZyk7XG4gICAgICAgICAgICBjb25zdCB0dXBsZSA9IGZvbnQudHVwbGVGcm9tRnZzKG1zZy5vcHRpb25zLmZ2cyk7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyBTYW1zYUluc3RhbmNlKGZvbnQsIHR1cGxlKTtcbiAgICAgICAgICAgIGlmICghbXNnLm9wdGlvbnMudGV4dClcbiAgICAgICAgICAgICAgICBtc2cub3B0aW9ucy50ZXh0ID0gXCJoZWxsb1wiO1xuICAgICAgICAgICAgY29uc3QgbGF5b3V0ID0gaW5zdGFuY2UuZ2x5cGhMYXlvdXRGcm9tU3RyaW5nKG1zZy5vcHRpb25zLnRleHQpO1xuICAgICAgICAgICAgY29uc3QgZm9udFNpemUgPSBtc2cub3B0aW9ucy5mb250U2l6ZTtcbiAgICAgICAgICAgIGNvbnN0IHVwZW0gPSBmb250LmhlYWQudW5pdHNQZXJFbTtcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yVTMyID0gMHgwMDAwMDBmZjtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRleHQgPSB7XG4gICAgICAgICAgICAgICAgZm9udDogZm9udCxcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2UsXG4gICAgICAgICAgICAgICAgcGF0aHM6IHt9LFxuICAgICAgICAgICAgICAgIGdyYWRpZW50czoge30sXG4gICAgICAgICAgICAgICAgY29sb3I6IGNvbG9yVTMyLFxuICAgICAgICAgICAgICAgIHBhbGV0dGVJZDogKF9hID0gbXNnLm9wdGlvbnMucGFsZXR0ZUlkKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAwLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIHNldCB0aGUgdGV4dCBhcyBTVkdcbiAgICAgICAgICAgIGxldCBpbm5lclNWR0NvbXBvc2l0aW9uID0gXCJcIjtcbiAgICAgICAgICAgIGxheW91dC5mb3JFYWNoKChsYXlvdXRJdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ2x5cGggPSBmb250LmdseXBoc1tsYXlvdXRJdGVtLmlkXTtcbiAgICAgICAgICAgICAgICBjb25zdCBpZ2x5cGggPSBnbHlwaC5pbnN0YW50aWF0ZShpbnN0YW5jZSk7XG4gICAgICAgICAgICAgICAgbGV0IHRoaXNTVkcgPSBpZ2x5cGguc3ZnKGNvbnRleHQpOyAvLyBnZXRzIHRoZSBiZXN0IHBvc3NpYmxlIENPTFIgZ2x5cGgsIHdpdGggbW9ub2Nocm9tZSBmYWxsYmFja1xuICAgICAgICAgICAgICAgIHRoaXNTVkcgPSBgPGcgdHJhbnNmb3JtPVwidHJhbnNsYXRlKCR7bGF5b3V0SXRlbS5heH0gMClcIiBmaWxsPVwiJHtmb250LmhleENvbG9yRnJvbVUzMihjb2xvclUzMil9XCI+YCArIHRoaXNTVkcgKyBcIjwvZz5cIjtcbiAgICAgICAgICAgICAgICBpbm5lclNWR0NvbXBvc2l0aW9uICs9IHRoaXNTVkc7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IGRlZnMgPSBPYmplY3QudmFsdWVzKGNvbnRleHQucGF0aHMpLmpvaW4oXCJcIikgKyBPYmplY3QudmFsdWVzKGNvbnRleHQuZ3JhZGllbnRzKS5qb2luKFwiXCIpO1xuICAgICAgICAgICAgY29uc3Qgc3ZnUHJlYW1ibGUgPSBgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgd2lkdGg9XCIyMDAwXCIgaGVpZ2h0PVwiMjAwMFwiIHZpZXdCb3g9XCIwIDAgMjAwMCAyMDAwXCI+YDtcbiAgICAgICAgICAgIGNvbnN0IHN2Z1Bvc3RhbWJsZSA9IGA8L3N2Zz5gO1xuICAgICAgICAgICAgY29uc3Qgc2NhbGUgPSBmb250U2l6ZSAvIHVwZW07XG4gICAgICAgICAgICBjb25zdCBnUHJlYW1ibGUgPSBgPGcgdHJhbnNmb3JtPVwic2NhbGUoJHtzY2FsZX0gJHstc2NhbGV9KSB0cmFuc2xhdGUoMCAkey11cGVtfSlcIj5gO1xuICAgICAgICAgICAgY29uc3QgZ1Bvc3RhbWJsZSA9IGA8L2c+YDtcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgd2hlcmUgaXQgY29tZXMgdG9nZXRoZXJcbiAgICAgICAgICAgIGNvbnN0IHN2Z1N0cmluZyA9IHN2Z1ByZWFtYmxlICsgKGRlZnMgPyBgPGRlZnM+JHtkZWZzfTwvZGVmcz5gIDogXCJcIikgKyBnUHJlYW1ibGUgKyBpbm5lclNWR0NvbXBvc2l0aW9uICsgZ1Bvc3RhbWJsZSArIHN2Z1Bvc3RhbWJsZTsgLy8gYnVpbGQgYW5kIGluc2VydCBmaW5hbCBTVkdcbiAgICAgICAgICAgIGlmIChHTE9CQUwuZmlnbWFOb2RlKVxuICAgICAgICAgICAgICAgIEdMT0JBTC5maWdtYU5vZGUucmVtb3ZlKCk7XG4gICAgICAgICAgICBsZXQgbm9kZSA9IGZpZ21hLmNyZWF0ZU5vZGVGcm9tU3ZnKHN2Z1N0cmluZyk7IC8vIGNvbnZlcnQgU1ZHIHRvIG5vZGUgYW5kIGFkZCBpdCB0byB0aGUgcGFnZVxuICAgICAgICAgICAgR0xPQkFMLmZpZ21hTm9kZSA9IG5vZGU7XG4gICAgICAgICAgICAvL25vZGUuc2V0UGx1Z2luRGF0YShcInNhbXNhLXJlbmRlclwiLCBtc2cpOyAvLyB0aGlzIHNlZW1zIG9ubHkgdG8gdGFrZSBzdHJpbmcgZGF0YVxuICAgICAgICAgICAgc2NlbmVOb2Rlcy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgLy9maWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBzY2VuZU5vZGVzO1xuICAgICAgICAgICAgLy9maWdtYS52aWV3cG9ydC5zY3JvbGxBbmRab29tSW50b1ZpZXcoc2NlbmVOb2Rlcyk7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgLy8gYWRkIHRoZSBub2RlIHRvIHRoZSBjYW52YXNcbiAgICAgICAgICAgIGxldCBub2RlID0gZmlnbWEuY3JlYXRlTm9kZUZyb21Tdmcoc3ZnU3RyaW5nKTsgLy8gY29udmVydCBTVkcgdG8gbm9kZSBhbmQgYWRkIGl0IHRvIHRoZSBwYWdlXG5cbiAgICAgICAgICAgIC8vIExBVEVSLCB3ZSBjYW4gdHJ5IHRoaXNcbiAgICAgICAgICAgIC8vIHNldCBtZXRhZGF0YSBvbiB0aGUgbm9kZVxuICAgICAgICAgICAgLy8gYWxzbyBzZXQgdGhlIHBsdWdpbiB0aGF0IG1hZGUgaXRcbiAgICAgICAgICAgIC8vIGFsc28gc2V0IHRoZSBkYXRlXG4gICAgICAgICAgICBub2RlLnNldFBsdWdpbkRhdGEoXCJmb250XCIsIGZvbnQubmFtZXNbNl0pOyAvLyBQb3N0U2NyaXB0IG5hbWVcbiAgICAgICAgICAgIG5vZGUuc2V0UGx1Z2luRGF0YShcImZvbnRTaXplXCIsIG1zZy5mb250U2l6ZS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIG5vZGUuc2V0UGx1Z2luRGF0YShcInRleHRcIiwgbXNnLnRleHQpO1xuICAgICAgICAgICAgbm9kZS5zZXRQbHVnaW5EYXRhKFwiZm9udFZhcmlhdGlvblNldHRpbmdzXCIsIFwiXCIpO1xuXG4gICAgICAgICAgICAvLyB6b29tIHRvIGZpdFxuICAgICAgICAgICAgc2NlbmVOb2Rlcy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gc2NlbmVOb2RlcztcbiAgICAgICAgICAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhzY2VuZU5vZGVzKTtcblxuICAgICAgICAgICAgLy8gVEVTVDogYWRkIGEgbmV3IGVsZW1lbnQgdG8gdGhlIFVJIGJ5IHNlbmRpbmcgYSBtZXNzYWdlXG4gICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7dHlwZTogXCJBZGRBeGlzXCIsIHRhZzogXCJ3Z2h0XCJ9KTtcbiAgICAgICAgICAgICovXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlIFwicGFsZXR0ZS1lZGl0XCI6IHtcbiAgICAgICAgICAgIGlmIChmb250LkNQQUwpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYWxldHRlSWQgPSBwYXJzZUludChtc2cucGFsZXR0ZUlkKTtcbiAgICAgICAgICAgICAgICBjb25zdCBlbnRyeUlkID0gcGFyc2VJbnQobXNnLmVudHJ5SWQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhbGV0dGUgPSBmb250LkNQQUwucGFsZXR0ZXNbcGFsZXR0ZUlkXTtcbiAgICAgICAgICAgICAgICBpZiAocGFsZXR0ZSAmJiBwYWxldHRlLmNvbG9yc1tlbnRyeUlkXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhbGV0dGUuY29sb3JzW2VudHJ5SWRdID0gZm9udC51MzJGcm9tSGV4Q29sb3IobXNnLmNvbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhgdXBkYXRlZCBwYWxldHRlICR7cGFsZXR0ZUlkfSBlbnRyeSAke2VudHJ5SWR9IHRvICR7bXNnLmNvbG9yfSBhcyAke2NvbG9yfWApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgXCJjYW5jZWxcIjoge1xuICAgICAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==