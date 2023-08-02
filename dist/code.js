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

2023-07-27: All occurrences of "??" nullish coalescing operator have been replaced (it’s not supported by something in the Figma plugin build process). The ?? lines remain as comments above their replacements.

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
		let offset = 0;
		// we should do this differently if the font is only lightly loaded, e.g. from a big file that we don’t want to load in full
		for (let g=0; g<this.maxp.numGlyphs; g++) {
			this.buf.seek(this.tables.loca.offset + (g+1) * (this.head.indexToLocFormat ? 4 : 2));
			const nextOffset = this.head.indexToLocFormat ? buf.u32 : buf.u16 * 2;
			buf.seek(this.tables.glyf.offset + offset);
			this.glyphs[g] = buf.decodeGlyph({id: g, font: this, length: nextOffset - offset});
			offset = nextOffset;
		}

		// options.allTVTs: load all TVTs?
		if (options.allTVTs && this.gvar) {
			const gvar = this.gvar;
			const gvarBuf = this.bufferFromTable("gvar");
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
	function expandAttrs (attrs) {
		let str = "";
		for (let attr in attrs) {
			if (attrs[attr] !== undefined)
				str += ` ${attr}="${attrs[attr]}"`;
		}
		return str;
	}

	const font = context.font;
	const extendModes = ["pad", "repeat", "reflect"];
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
					if (!context.gradients[paint.offset]) { // if we have not already stored this paint in this glyph run

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

						const attrs = {
							id: "f" + paint.offset,
							x1: p0x,
							y1: p0y,
							x2: finalX,
							y2: finalY,
							gradientUnits: "userSpaceOnUse",
							spreadMethod : paint.colorLine.extend ? extendModes[paint.colorLine.extend] : undefined, // we could allow "pad" here, but instead we ignore EXTEND_PAD (0) since it is default behaviour
						};
						let gradient = `<linearGradient${expandAttrs(attrs)}>`;
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
					console.error("PaintRadialGradient not implemented yet");
					console.log(paint);
					break;
				}

				case 8: case 9: { // PaintSweepGradient, PaintVarSweepGradient
					console.error("PaintSweepGradient not implemented yet");
					console.log(paint);
					break;
				}

				case 32: { // PaintComposite

					console.error("PaintComposite not implemented yet");
					console.log(paint);

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
                figma.ui.postMessage({ type: "names", names: font.names }); // avoid sparseness
                figma.ui.postMessage({ type: "fvar", fvar: font.fvar });
                figma.ui.postMessage({ type: "CPAL", CPAL: font.CPAL });
            });
            break;
        }
        case "render": {
            // get svg from text, font, size, axisSettings, palette
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQWdHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FuRjtBQUNiO0FBQ0E7OztBQUdBOztBQUVBOztBQUVBOztBQUVBLDJCQUEyQjtBQUMzQixxQ0FBcUM7O0FBRXJDO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxnR0FBZ0c7O0FBRWhHO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4R0FBOEcsb0JBQW9CLHdCQUF3QixvQkFBb0I7QUFDOUssZ0JBQWdCLHVCQUF1QjtBQUN2QztBQUNBO0FBQ0EsaUJBQWlCLG9CQUFvQjtBQUNyQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaURBQWlEO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCOztBQUVBO0FBQ0EsaUZBQWlGO0FBQ2pGO0FBQ0EsZ0JBQWdCLG9CQUFvQjtBQUNwQztBQUNBO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIsT0FBTztBQUMxQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0EsbUJBQW1CLFlBQVk7QUFDL0Isa0NBQWtDO0FBQ2xDLG1CQUFtQjtBQUNuQixtQkFBbUIsWUFBWTtBQUMvQjtBQUNBLG1CQUFtQixZQUFZO0FBQy9CO0FBQ0E7QUFDQSxtQkFBbUIsWUFBWTtBQUMvQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLGVBQWU7QUFDcEMsaUNBQWlDLGdEQUFnRDtBQUNqRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzREFBc0Qsb0JBQW9CO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQiw0QkFBNEI7QUFDOUM7QUFDQSwwREFBMEQ7QUFDMUQ7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGlDQUFpQztBQUNwRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDBJQUEwSTtBQUMxSTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixnQ0FBZ0M7QUFDckQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQix3QkFBd0I7QUFDeEMsNkJBQTZCO0FBQzdCOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQiw0QkFBNEI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQixzQkFBc0I7QUFDeEMscUJBQXFCOztBQUVyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsMEJBQTBCO0FBQzNDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGtCQUFrQjtBQUNsQztBQUNBO0FBQ0E7QUFDQSwrRUFBK0U7QUFDL0UsZ0JBQWdCLHNCQUFzQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLDJCQUEyQjtBQUMzQztBQUNBLGlCQUFpQixrQkFBa0I7QUFDbkMsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixnQ0FBZ0M7QUFDbkQ7QUFDQSxvQkFBb0IsdUJBQXVCO0FBQzNDLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRkFBbUY7O0FBRW5GO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQiwwQkFBMEIsT0FBTztBQUNqRDtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsOEJBQThCO0FBQzlDLGlEQUFpRDtBQUNqRCx5REFBeUQ7QUFDekQ7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQixtQkFBbUI7QUFDbkI7QUFDQSxnQkFBZ0IsY0FBYztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQSxHQUFHO0FBQ0gsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBLDJIQUEySDs7QUFFM0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QjtBQUN4QiwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxlQUFlO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsaUJBQWlCLG1CQUFtQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLGlCQUFpQixFQUFFLGFBQWEsRUFBRSxZQUFZO0FBQ25FO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0Isb0JBQW9CLDBDQUEwQzs7O0FBR2xGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZSw4QkFBOEIsT0FBTztBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCxzQkFBc0I7O0FBRXRCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFlBQVk7QUFDOUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixZQUFZO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCO0FBQ3JCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7O0FBRUEscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQixTQUFTO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBa0IsU0FBUztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsVUFBVTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLFVBQVU7QUFDMUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixVQUFVO0FBQzFCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0IsY0FBYztBQUM5QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLGlCQUFpQiwwQkFBMEI7QUFDM0M7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixvQkFBb0I7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsVUFBVTtBQUM3QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCO0FBQzNCLG1DQUFtQztBQUNuQyxrQ0FBa0M7QUFDbEMsd0JBQXdCO0FBQ3hCLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSwyQkFBMkI7QUFDM0IsbUNBQW1DO0FBQ25DLGtDQUFrQztBQUNsQyx3QkFBd0I7QUFDeEIsa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMkRBQTJEO0FBQzNELHlEQUF5RDtBQUN6RCxrRUFBa0U7QUFDbEUsZ0VBQWdFO0FBQ2hFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDJDQUEyQyw0Q0FBNEM7QUFDdkYsc0VBQXNFO0FBQ3RFLHNGQUFzRjtBQUN0Rjs7QUFFQTtBQUNBOztBQUVBLEtBQUssdUJBQXVCOztBQUU1QjtBQUNBLHdCQUF3QjtBQUN4QjtBQUNBOztBQUVBO0FBQ0EsMENBQTBDO0FBQzFDOztBQUVBO0FBQ0EsOEVBQThFO0FBQzlFLDhFQUE4RTtBQUM5RSw4RUFBOEU7QUFDOUUsOEVBQThFO0FBQzlFLHVGQUF1RjtBQUN2Rix1RkFBdUY7QUFDdkYsdUZBQXVGO0FBQ3ZGLHVGQUF1RjtBQUN2RjtBQUNBO0FBQ0E7O0FBRUEsZ0NBQWdDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQSx3QkFBd0I7O0FBRXhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGNBQWM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEIsa0JBQWtCLDBCQUEwQjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBLHdFQUF3RTtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFDQUFxQztBQUNyQyxtREFBbUQ7O0FBRW5EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQixvQkFBb0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0VBQXdFO0FBQ3hFLGlCQUFpQixjQUFjO0FBQy9CO0FBQ0E7O0FBRUEsK0RBQStEO0FBQy9ELGlCQUFpQixjQUFjO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGNBQWM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNFQUFzRTtBQUN0RSxpQkFBaUIsY0FBYztBQUMvQixnQ0FBZ0M7QUFDaEM7O0FBRUEsaUJBQWlCLGNBQWM7QUFDL0I7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTs7QUFFQSxpQkFBaUIsY0FBYztBQUMvQjtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixjQUFjO0FBQzlCO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGNBQWM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsY0FBYztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixjQUFjO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQSxpQkFBaUIsMkJBQTJCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTs7QUFFQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRDtBQUNoRCxnREFBZ0Q7QUFDaEQsZ0RBQWdEO0FBQ2hELGdEQUFnRDtBQUNoRDtBQUNBO0FBQ0EsNkJBQTZCOztBQUU3Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9COztBQUVwQixnQkFBZ0IsbUJBQW1CO0FBQ25DO0FBQ0EsaUJBQWlCLGlCQUFpQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLDhCQUE4QjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0EsZ0ZBQWdGO0FBQ2hGO0FBQ0E7QUFDQSxrQkFBa0IsZUFBZTtBQUNqQztBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLG1CQUFtQjtBQUNyQztBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsWUFBWTtBQUM1QixvREFBb0Q7QUFDcEQsMENBQTBDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGNBQWM7QUFDL0IseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixjQUFjO0FBQ2hDO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxrQkFBa0IsY0FBYztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkIsdUJBQXVCO0FBQ3ZCLGtCQUFrQixhQUFhLE9BQU87QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixnQkFBZ0I7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw2REFBNkQ7QUFDN0Q7QUFDQSwrREFBK0Q7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQixhQUFhO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7O0FBRUE7QUFDQSxtQkFBbUIsYUFBYTtBQUNoQztBQUNBO0FBQ0EsbUJBQW1CLGFBQWE7QUFDaEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsYUFBYTtBQUMvQix1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxpREFBaUQ7QUFDakQsdUdBQXVHO0FBQ3ZHLGlCQUFpQixnQkFBZ0IsT0FBTztBQUN4QztBQUNBLHNHQUFzRztBQUN0RywwQ0FBMEM7QUFDMUMsa0ZBQWtGO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLDBCQUEwQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQiwwQkFBMEI7QUFDcEQ7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBLG9EQUFvRDtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEseUJBQXlCOztBQUV6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1HQUFtRyxpREFBaUQ7QUFDcEo7QUFDQSxrQ0FBa0M7QUFDbEMseUZBQXlGO0FBQ3pGO0FBQ0E7QUFDQSxpQkFBaUIsbUJBQW1CO0FBQ3BDO0FBQ0EsOEdBQThHO0FBQzlHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQix3QkFBd0I7QUFDM0M7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0VBQXdFLGNBQWM7QUFDdEYsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7O0FBRUE7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLHNCQUFzQixpQkFBaUI7QUFDdkM7QUFDQSxxREFBcUQ7QUFDckQ7QUFDQTtBQUNBOztBQUVBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscURBQXFEO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsY0FBYztBQUNkO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0Esb0RBQW9EO0FBQ3BEO0FBQ0E7O0FBRUEsY0FBYztBQUNkO0FBQ0E7QUFDQSxvREFBb0Q7QUFDcEQ7QUFDQTs7QUFFQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9EO0FBQ3BEO0FBQ0E7O0FBRUEsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0Q7QUFDcEQ7QUFDQTs7QUFFQSw2RUFBNkU7QUFDN0U7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQSxzREFBc0Q7QUFDdEQ7QUFDQSxvREFBb0Q7QUFDcEQ7QUFDQTs7QUFFQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9EO0FBQ3BEO0FBQ0E7O0FBRUEseUNBQXlDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBLHlFQUF5RTtBQUN6RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRDtBQUNwRDtBQUNBOztBQUVBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLGNBQWM7QUFDeEQ7QUFDQTtBQUNBOztBQUVBLDBCQUEwQjtBQUMxQixnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7O0FBRXBDOztBQUVBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0M7QUFDaEMsc0NBQXNDOztBQUV0QztBQUNBOztBQUVBO0FBQ0EsZUFBZSx5QkFBeUI7QUFDeEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMkNBQTJDOztBQUUzQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQSx5REFBeUQ7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLHVCQUF1QjtBQUN2QztBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsK0NBQStDO0FBQ3BGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsdUJBQXVCOztBQUV4QztBQUNBOztBQUVBLHlEQUF5RDtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVEQUF1RDtBQUN2RCxnQ0FBZ0M7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyRUFBMkU7QUFDM0U7QUFDQSxHQUFHO0FBQ0gsRUFBRTtBQUNGLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1REFBdUQ7QUFDdkQsZ0NBQWdDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkVBQTJFO0FBQzNFO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsRUFBRTtBQUNGLDRCQUE0Qjs7QUFFNUI7QUFDQTs7O0FBR0E7O0FBRUE7QUFDQSxZQUFZO0FBQ1osZUFBZSxlQUFlO0FBQzlCLHdDQUF3QztBQUN4QyxvQkFBb0I7QUFDcEIsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSwwQkFBMEI7QUFDMUIsZ0RBQWdEO0FBQ2hEO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0EsZ0JBQWdCLG1CQUFtQjtBQUNuQztBQUNBLHFCQUFxQjtBQUNyQix3QkFBd0I7QUFDeEI7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBLDJCQUEyQjtBQUMzQixpREFBaUQ7QUFDakQ7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxvREFBb0Q7QUFDdkY7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsZ0NBQWdDLE9BQU87QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLGdDQUFnQztBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsSUFBSTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBLCtGQUErRjtBQUMvRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtEOztBQUVsRDtBQUNBO0FBQ0EsUUFBUSxZQUFZLFFBQVE7QUFDNUIsOEJBQThCLDRFQUE0RTtBQUMxRztBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCLDBCQUEwQjtBQUMxQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLGFBQWE7QUFDNUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixjQUFjO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsYUFBYTtBQUM5QjtBQUNBO0FBQ0Esc0ZBQXNGO0FBQ3RGO0FBQ0EsV0FBVztBQUNYLHNCQUFzQjtBQUN0Qix5QkFBeUI7QUFDekI7QUFDQSw4Q0FBOEM7QUFDOUMsNERBQTRELDJDQUEyQztBQUN2Ryx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUI7QUFDdkIsK0ZBQStGO0FBQy9GO0FBQ0EsbURBQW1EO0FBQ25EO0FBQ0E7QUFDQTtBQUNBLDBEQUEwRDtBQUMxRDtBQUNBLGdEQUFnRCxpREFBaUQ7QUFDakcsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixhQUFhLE9BQU87QUFDckM7QUFDQTtBQUNBLCtEQUErRCxvRUFBb0U7QUFDbkk7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLGtCQUFrQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUMsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLCtDQUErQztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSCxXQUFXO0FBQ1gsV0FBVzs7QUFFWCxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsNEJBQTRCOztBQUU1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsK0JBQStCO0FBQzdEO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJEQUEyRDs7QUFFM0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCLGVBQWUsV0FBVzs7QUFFMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQ7QUFDckQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE1BQU0sSUFBQztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGFBQWE7QUFDOUI7QUFDQSx3RUFBd0U7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxFQUdKOzs7QUFHSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaURBQWlEO0FBQ2pELHlCQUF5QixtQ0FBbUM7QUFDNUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDBGQUEwRjs7QUFFMUY7QUFDQSw2QkFBNkIseUJBQXlCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBLHlCQUF5QixnQkFBZ0I7QUFDekM7QUFDQSwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0Esc0JBQXNCLE9BQU87O0FBRTdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUNBQW1DLFdBQVc7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKOztBQUVBLEVBQUUsR0FBRzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsbUJBQW1COztBQUVwQztBQUNBLCtFQUErRTs7QUFFL0U7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNDQUFzQztBQUN0QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRDtBQUNsRCxlQUFlO0FBQ2YsZ0dBQWdHO0FBQ2hHLGdEQUFnRDtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsb0JBQW9CO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLEdBQUc7QUFDSDs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7O0FBRUE7QUFDQSxvQkFBb0IsVUFBVTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtFQUFrRTtBQUNsRTs7QUFFQTtBQUNBO0FBQ0EscUNBQXFDOztBQUVyQztBQUNBOztBQUVBO0FBQ0EsSUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQSxjQUFjLGtCQUFrQjtBQUNoQztBQUNBO0FBQ0Esa0JBQWtCLE9BQU8sRUFBRSxNQUFNO0FBQ2pDO0FBQ0EsMEJBQTBCO0FBQzFCLG1CQUFtQixPQUFPLEVBQUUsTUFBTTtBQUNsQztBQUNBLGFBQWE7QUFDYiw4Q0FBOEM7QUFDOUMsbUJBQW1CLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU87QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsZUFBZSxjQUFjOztBQUU3QjtBQUNBO0FBQ0EsbUJBQW1CLE9BQU8sRUFBRSxNQUFNO0FBQ2xDO0FBQ0EsMkJBQTJCO0FBQzNCLG9CQUFvQixPQUFPLEVBQUUsTUFBTTtBQUNuQztBQUNBLGNBQWM7QUFDZCx1RUFBdUU7QUFDdkUsd0VBQXdFO0FBQ3hFLG9CQUFvQixPQUFPLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFFBQVE7QUFDN0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDOztBQUVBO0FBQ0Esb0JBQW9CLFVBQVU7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0VBQWtFO0FBQ2xFOztBQUVBO0FBQ0E7QUFDQSxxQ0FBcUM7O0FBRXJDO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0EsY0FBYyxrQkFBa0I7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0EsYUFBYTtBQUNiLDhDQUE4QztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLGVBQWUsY0FBYzs7QUFFN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0EsY0FBYztBQUNkLHVFQUF1RTtBQUN2RSx3RUFBd0U7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaURBQWlEO0FBQ2pEOztBQUVBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5Qjs7QUFFekI7QUFDQTtBQUNBLDBDQUEwQztBQUMxQywyQkFBMkI7QUFDM0I7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0VBQWtFLHlFQUF5RTtBQUMzSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLEtBQUssSUFBSSxZQUFZO0FBQ3BDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4Qjs7QUFFOUI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0MsaURBQWlELGNBQWMsT0FBTyxLQUFLO0FBQzNFO0FBQ0E7QUFDQSxxREFBcUQsMkJBQTJCO0FBQ2hGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsb0JBQW9CLEVBQUUsbUJBQW1CO0FBQ3RFO0FBQ0E7QUFDQSwwQkFBMEIsdUJBQXVCO0FBQ2pEO0FBQ0E7QUFDQSwyQkFBMkIsY0FBYyxrQkFBa0IsV0FBVyxFQUFFLFVBQVUsY0FBYztBQUNoRztBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsV0FBVyxFQUFFLFVBQVU7QUFDdEQ7QUFDQTtBQUNBLDJCQUEyQixnQkFBZ0IsRUFBRSxlQUFlO0FBQzVEO0FBQ0E7QUFDQSwyQkFBMkIsZUFBZSxTQUFTLGVBQWUsSUFBSTtBQUN0RTtBQUNBO0FBQ0EsZ0NBQWdDLFlBQVksRUFBRSxXQUFXO0FBQ3pEO0FBQ0E7O0FBRUE7QUFDQSw4Q0FBOEM7O0FBRTlDO0FBQ0E7O0FBRUEsZUFBZTtBQUNmLDJCQUEyQix1QkFBdUI7QUFDbEQ7QUFDQTtBQUNBLGVBQWU7QUFDZiw4QkFBOEIsb0JBQW9CLEVBQUUsbUJBQW1CO0FBQ3ZFO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUMsaURBQWlELGtCQUFrQixFQUFFLGlCQUFpQjtBQUN0RiwyQkFBMkIsc0JBQXNCO0FBQ2pELGlEQUFpRCxpQkFBaUIsRUFBRSxnQkFBZ0I7QUFDcEY7QUFDQTtBQUNBLHdCQUF3QjtBQUN4QixpREFBaUQsa0JBQWtCLEVBQUUsaUJBQWlCO0FBQ3RGLDRCQUE0QixjQUFjLElBQUk7QUFDOUMsaURBQWlELGlCQUFpQixFQUFFLGdCQUFnQjtBQUNwRjtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCLGlEQUFpRCxrQkFBa0IsRUFBRSxpQkFBaUI7QUFDdEYsMkJBQTJCLGVBQWUsSUFBSTtBQUM5QywyQkFBMkIsZUFBZSxJQUFJO0FBQzlDLGlEQUFpRCxpQkFBaUIsRUFBRSxnQkFBZ0I7QUFDcEY7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMEJBQTBCLFVBQVUsS0FBSztBQUN6QyxxREFBcUQ7QUFDckQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQSx3Q0FBd0Msb0JBQW9CLFVBQVUsNEJBQTRCLE9BQU87QUFDekc7QUFDQTs7QUFFQSxzQkFBc0I7QUFDdEIsNkNBQTZDOztBQUU3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxtQkFBbUI7QUFDMUQ7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLHlCQUF5QixpQkFBaUIsNEJBQTRCO0FBQzFHLE9BQU87QUFDUDtBQUNBLGtEQUFrRDtBQUNsRDtBQUNBLDRCQUE0QixvQkFBb0IsZ0JBQWdCLGFBQWEsUUFBUTtBQUNyRjtBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxlQUFlOztBQUVmO0FBQ0E7O0FBRUEsNERBQTREO0FBQzVELDZEQUE2RDtBQUM3RDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQ0FBa0MsT0FBTztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLFNBQVM7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwwREFBMEQ7QUFDMUQsa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RCxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7O0FBRUEsMERBQTBELElBQUk7QUFDOUQsa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRDtBQUN0RCxpRkFBaUY7QUFDakY7QUFDQTtBQUNBLGdCQUFnQixhQUFhO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkZBQTZGO0FBQzdGLHlCQUF5QixpQkFBaUIsVUFBVSxpQ0FBaUMsUUFBUTtBQUM3RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCOzs7QUFHQTs7QUFFQTtBQUNBLHVCQUF1QixlQUFlOztBQUV0Qzs7O0FBR0E7O0FBRUE7O0FBRUEsc0JBQXNCLGVBQWU7QUFDckM7O0FBRUE7QUFDQSx1QkFBdUI7O0FBRXZCO0FBQ0EscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0EsdUJBQXVCLGVBQWU7O0FBRXRDOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7O0FBRTVCOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLCtDQUErQztBQUMvQztBQUNBO0FBQ0EsMENBQTBDO0FBQzFDOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdGQUFnRjtBQUNoRjtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7O0FBRUE7QUFDQTtBQUNBLGdGQUFnRjtBQUNoRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxjQUFjLEtBQUs7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyxZQUFZO0FBQzNELCtDQUErQzs7QUFFL0M7O0FBRUEsZ0NBQWdDLFFBQVEsSUFBSSxnQkFBZ0IsVUFBVSx1QkFBdUI7QUFDN0Y7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLFlBQVk7QUFDdEQsd0NBQXdDLFdBQVc7QUFDbkQsNENBQTRDLGFBQWE7QUFDekQsdURBQXVELGtCQUFrQjtBQUN6RSx5Q0FBeUMsY0FBYztBQUN2RCx1Q0FBdUMsYUFBYTtBQUNwRCwyQ0FBMkMsZUFBZTtBQUMxRCxzREFBc0Qsb0JBQW9CO0FBQzFFLDJDQUEyQyxrQkFBa0I7QUFDN0Q7QUFDQSxvRkFBb0Y7O0FBRXBGO0FBQ0E7QUFDQSxtQkFBbUIsTUFBTTtBQUN6Qiw0QkFBNEIsU0FBUztBQUNyQztBQUNBO0FBQ0EsaUpBQWlKO0FBQ2pKO0FBQ0EsMkNBQTJDOztBQUUzQztBQUNBLG1CQUFtQjtBQUNuQjs7OztBQUlBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBLElBQUk7O0FBRUo7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0osRUFBRTtBQUNGO0FBQ0EscUJBQXFCLEdBQUcsRUFBRSxFQUFFO0FBQzVCLEVBQUU7QUFDRjtBQUNBLHFCQUFxQixHQUFHLEVBQUUsRUFBRTtBQUM1QixFQUFFO0FBQ0Y7QUFDQSxxQkFBcUIsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRTtBQUN4QyxFQUFFO0FBQ0Y7QUFDQSxxQkFBcUIsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFO0FBQ3BELEVBQUU7QUFDRjtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBLEVBQUU7QUFDRjs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxHQUFHLEVBQUUsRUFBRTtBQUNuQjtBQUNBO0FBQ0EsWUFBWSxHQUFHLEVBQUUsRUFBRTtBQUNuQjtBQUNBO0FBQ0EsWUFBWSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFO0FBQy9CO0FBQ0E7QUFDQSxZQUFZLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRTtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUN1Rjs7O0FBR3ZGOzs7QUFHQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBOzs7Ozs7VUMzbUpBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7O0FDTmE7QUFDYixXQUFXLG1CQUFtQjtBQUM5QixXQUFXLGlFQUFpRTtBQUM1RSxXQUFXLGlFQUFpRTtBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlFQUFpRSxFQUFFLG1CQUFPLENBQUMsc0RBQVk7QUFDL0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QixlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsZUFBZTtBQUM5QztBQUNBO0FBQ0EsZ0NBQWdDLHVCQUF1QixvQkFBb0I7QUFDM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QixxQkFBcUI7QUFDckI7QUFDQTtBQUNBLHVDQUF1QyxrQ0FBa0MsR0FBRztBQUM1RSx1Q0FBdUMsK0JBQStCO0FBQ3RFLHVDQUF1QywrQkFBK0I7QUFDdEUsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRDtBQUNuRCxxREFBcUQsZUFBZSxZQUFZLCtCQUErQjtBQUMvRztBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRCxPQUFPLEVBQUUsT0FBTyxnQkFBZ0IsTUFBTTtBQUMzRjtBQUNBO0FBQ0EsNkRBQTZELEtBQUssOEVBQThFO0FBQ2hKO0FBQ0E7QUFDQSwyREFBMkQ7QUFDM0Q7QUFDQSx1REFBdUQ7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJEQUEyRDs7QUFFM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBdUQ7QUFDdkQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0NBQWtDLDZCQUE2QjtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRCxXQUFXLFFBQVEsU0FBUyxLQUFLLFdBQVcsS0FBSyxNQUFNO0FBQzVHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmlnbWEtY29scnYxLy4vbm9kZV9tb2R1bGVzL3NhbXNhLWNvcmUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZmlnbWEtY29scnYxLy4vbm9kZV9tb2R1bGVzL3NhbXNhLWNvcmUvc3JjL3NhbXNhLWNvcmUuanMiLCJ3ZWJwYWNrOi8vZmlnbWEtY29scnYxL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2ZpZ21hLWNvbHJ2MS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZmlnbWEtY29scnYxL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZmlnbWEtY29scnYxL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZmlnbWEtY29scnYxLy4vc3JjL2NvZGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IHtTYW1zYUZvbnQsIFNhbXNhR2x5cGgsIFNhbXNhSW5zdGFuY2UsIFNhbXNhQnVmZmVyLCBTQU1TQUdMT0JBTH0gZnJvbSBcIi4vc3JjL3NhbXNhLWNvcmVcIjtcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gc2Ftc2EtY29yZS5qc1xuLy8gVmVyc2lvbiAyLjAgYWxwaGFcblxuXG4vLyBtaW5pZnkgdXNpbmcgdWdsaWZ5anM6IH4vbm9kZV9tb2R1bGVzL3VnbGlmeS1qcy9iaW4vdWdsaWZ5anMgc2Ftc2EtY29yZS5qcyA+IHNhbXNhLWNvcmUubWluLmpzXG5cbi8qXG5cbkEgbm90ZSBvbiB2YXJpYWJsZSBuYW1pbmcuIFlvdSBtYXkgc2VlIGEgZmV3IG9mIHRoZXNlOlxuXG5jb25zdCBfcnVuQ291bnQgPSBidWYudTE2OyAvLyBnZXQgdGhlIGRhdGEgZnJvbSB0aGUgYnVmZmVyXG5jb25zdCBydW5Db3VudCA9IF9ydW5Db3VudCAmIDB4N0ZGRjsgLy8gcmVmaW5lIHRoZSBkYXRhIGludG8gYSB1c2VhYmxlIHZhcmlhYmxlXG5cblRoZSB1bmRlcnNjb3JlIHByZWZpeCBpcyBpbnRlbmRlZCB0byBtZWFuIHRoZSBpbml0aWFsIHZlcnNpb24gb2YgdGhlIHZhcmlhYmxlIChfcnVuQ291bnQpIHRoYXQgbmVlZHMgdG8gYmUgcmVmaW5lZCBpbnRvIGEgdXNlYWJsZSB2YXJpYWJsZSAocnVuQ291bnQpLiBUaGlzIHdheSB3ZSBjYW4gXG5hY2N1cmF0ZWx5IHJlZmxlY3QgZmllbGRzIGRlc2NyaWJlZCBpbiB0aGUgc3BlYywgZGVyaXZlIHNvbWUgZGF0YSBmcm9tIGZsYWdzLCB0aGVuIHVzZSB0aGVtIHVuZGVyIHNpbWlsYXIgbmFtZSBmb3IgdGhlIHB1cnBvc2UgZGVjcmliZWQgYnkgdGhlIG5hbWUuXG5cbjIwMjMtMDctMjc6IEFsbCBvY2N1cnJlbmNlcyBvZiBcIj8/XCIgbnVsbGlzaCBjb2FsZXNjaW5nIG9wZXJhdG9yIGhhdmUgYmVlbiByZXBsYWNlZCAoaXTigJlzIG5vdCBzdXBwb3J0ZWQgYnkgc29tZXRoaW5nIGluIHRoZSBGaWdtYSBwbHVnaW4gYnVpbGQgcHJvY2VzcykuIFRoZSA/PyBsaW5lcyByZW1haW4gYXMgY29tbWVudHMgYWJvdmUgdGhlaXIgcmVwbGFjZW1lbnRzLlxuXG4qL1xuXG4vLyBleHBvc2UgdGhlc2UgdG8gdGhlIGNsaWVudFxuY29uc3QgU0FNU0FHTE9CQUwgPSB7XG5cdHZlcnNpb246IFwiMi4wLjBcIixcblx0YnJvd3NlcjogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIixcblx0ZW5kaWFubmVzczogZW5kaWFubmVzcygpLFxuXHRsaXR0bGVlbmRpYW46IGVuZGlhbm5lc3MoXCJMRVwiKSxcblx0YmlnZW5kaWFuOiBlbmRpYW5uZXNzKFwiQkVcIiksXG5cdHN0ZEdseXBoTmFtZXM6IFtcIi5ub3RkZWZcIixcIi5udWxsXCIsXCJub25tYXJraW5ncmV0dXJuXCIsXCJzcGFjZVwiLFwiZXhjbGFtXCIsXCJxdW90ZWRibFwiLFwibnVtYmVyc2lnblwiLFwiZG9sbGFyXCIsXCJwZXJjZW50XCIsXCJhbXBlcnNhbmRcIixcInF1b3Rlc2luZ2xlXCIsXCJwYXJlbmxlZnRcIixcInBhcmVucmlnaHRcIixcImFzdGVyaXNrXCIsXCJwbHVzXCIsXCJjb21tYVwiLFwiaHlwaGVuXCIsXCJwZXJpb2RcIixcInNsYXNoXCIsXCJ6ZXJvXCIsXCJvbmVcIixcInR3b1wiLFwidGhyZWVcIixcImZvdXJcIixcImZpdmVcIixcInNpeFwiLFwic2V2ZW5cIixcImVpZ2h0XCIsXCJuaW5lXCIsXCJjb2xvblwiLFwic2VtaWNvbG9uXCIsXCJsZXNzXCIsXCJlcXVhbFwiLFwiZ3JlYXRlclwiLFwicXVlc3Rpb25cIixcImF0XCIsXCJBXCIsXCJCXCIsXCJDXCIsXCJEXCIsXCJFXCIsXCJGXCIsXCJHXCIsXCJIXCIsXCJJXCIsXCJKXCIsXCJLXCIsXCJMXCIsXCJNXCIsXCJOXCIsXCJPXCIsXCJQXCIsXCJRXCIsXCJSXCIsXCJTXCIsXCJUXCIsXCJVXCIsXCJWXCIsXCJXXCIsXCJYXCIsXCJZXCIsXCJaXCIsXCJicmFja2V0bGVmdFwiLFwiYmFja3NsYXNoXCIsXCJicmFja2V0cmlnaHRcIixcImFzY2lpY2lyY3VtXCIsXCJ1bmRlcnNjb3JlXCIsXCJncmF2ZVwiLFwiYVwiLFwiYlwiLFwiY1wiLFwiZFwiLFwiZVwiLFwiZlwiLFwiZ1wiLFwiaFwiLFwiaVwiLFwialwiLFwia1wiLFwibFwiLFwibVwiLFwiblwiLFwib1wiLFwicFwiLFwicVwiLFwiclwiLFwic1wiLFwidFwiLFwidVwiLFwidlwiLFwid1wiLFwieFwiLFwieVwiLFwielwiLFwiYnJhY2VsZWZ0XCIsXCJiYXJcIixcImJyYWNlcmlnaHRcIixcImFzY2lpdGlsZGVcIixcIkFkaWVyZXNpc1wiLFwiQXJpbmdcIixcIkNjZWRpbGxhXCIsXCJFYWN1dGVcIixcIk50aWxkZVwiLFwiT2RpZXJlc2lzXCIsXCJVZGllcmVzaXNcIixcImFhY3V0ZVwiLFwiYWdyYXZlXCIsXCJhY2lyY3VtZmxleFwiLFwiYWRpZXJlc2lzXCIsXCJhdGlsZGVcIixcImFyaW5nXCIsXCJjY2VkaWxsYVwiLFwiZWFjdXRlXCIsXCJlZ3JhdmVcIixcImVjaXJjdW1mbGV4XCIsXCJlZGllcmVzaXNcIixcImlhY3V0ZVwiLFwiaWdyYXZlXCIsXCJpY2lyY3VtZmxleFwiLFwiaWRpZXJlc2lzXCIsXCJudGlsZGVcIixcIm9hY3V0ZVwiLFwib2dyYXZlXCIsXCJvY2lyY3VtZmxleFwiLFwib2RpZXJlc2lzXCIsXCJvdGlsZGVcIixcInVhY3V0ZVwiLFwidWdyYXZlXCIsXCJ1Y2lyY3VtZmxleFwiLFwidWRpZXJlc2lzXCIsXCJkYWdnZXJcIixcImRlZ3JlZVwiLFwiY2VudFwiLFwic3RlcmxpbmdcIixcInNlY3Rpb25cIixcImJ1bGxldFwiLFwicGFyYWdyYXBoXCIsXCJnZXJtYW5kYmxzXCIsXCJyZWdpc3RlcmVkXCIsXCJjb3B5cmlnaHRcIixcInRyYWRlbWFya1wiLFwiYWN1dGVcIixcImRpZXJlc2lzXCIsXCJub3RlcXVhbFwiLFwiQUVcIixcIk9zbGFzaFwiLFwiaW5maW5pdHlcIixcInBsdXNtaW51c1wiLFwibGVzc2VxdWFsXCIsXCJncmVhdGVyZXF1YWxcIixcInllblwiLFwibXVcIixcInBhcnRpYWxkaWZmXCIsXCJzdW1tYXRpb25cIixcInByb2R1Y3RcIixcInBpXCIsXCJpbnRlZ3JhbFwiLFwib3JkZmVtaW5pbmVcIixcIm9yZG1hc2N1bGluZVwiLFwiT21lZ2FcIixcImFlXCIsXCJvc2xhc2hcIixcInF1ZXN0aW9uZG93blwiLFwiZXhjbGFtZG93blwiLFwibG9naWNhbG5vdFwiLFwicmFkaWNhbFwiLFwiZmxvcmluXCIsXCJhcHByb3hlcXVhbFwiLFwiRGVsdGFcIixcImd1aWxsZW1vdGxlZnRcIixcImd1aWxsZW1vdHJpZ2h0XCIsXCJlbGxpcHNpc1wiLFwibm9uYnJlYWtpbmdzcGFjZVwiLFwiQWdyYXZlXCIsXCJBdGlsZGVcIixcIk90aWxkZVwiLFwiT0VcIixcIm9lXCIsXCJlbmRhc2hcIixcImVtZGFzaFwiLFwicXVvdGVkYmxsZWZ0XCIsXCJxdW90ZWRibHJpZ2h0XCIsXCJxdW90ZWxlZnRcIixcInF1b3RlcmlnaHRcIixcImRpdmlkZVwiLFwibG96ZW5nZVwiLFwieWRpZXJlc2lzXCIsXCJZZGllcmVzaXNcIixcImZyYWN0aW9uXCIsXCJjdXJyZW5jeVwiLFwiZ3VpbHNpbmdsbGVmdFwiLFwiZ3VpbHNpbmdscmlnaHRcIixcImZpXCIsXCJmbFwiLFwiZGFnZ2VyZGJsXCIsXCJwZXJpb2RjZW50ZXJlZFwiLFwicXVvdGVzaW5nbGJhc2VcIixcInF1b3RlZGJsYmFzZVwiLFwicGVydGhvdXNhbmRcIixcIkFjaXJjdW1mbGV4XCIsXCJFY2lyY3VtZmxleFwiLFwiQWFjdXRlXCIsXCJFZGllcmVzaXNcIixcIkVncmF2ZVwiLFwiSWFjdXRlXCIsXCJJY2lyY3VtZmxleFwiLFwiSWRpZXJlc2lzXCIsXCJJZ3JhdmVcIixcIk9hY3V0ZVwiLFwiT2NpcmN1bWZsZXhcIixcImFwcGxlXCIsXCJPZ3JhdmVcIixcIlVhY3V0ZVwiLFwiVWNpcmN1bWZsZXhcIixcIlVncmF2ZVwiLFwiZG90bGVzc2lcIixcImNpcmN1bWZsZXhcIixcInRpbGRlXCIsXCJtYWNyb25cIixcImJyZXZlXCIsXCJkb3RhY2NlbnRcIixcInJpbmdcIixcImNlZGlsbGFcIixcImh1bmdhcnVtbGF1dFwiLFwib2dvbmVrXCIsXCJjYXJvblwiLFwiTHNsYXNoXCIsXCJsc2xhc2hcIixcIlNjYXJvblwiLFwic2Nhcm9uXCIsXCJaY2Fyb25cIixcInpjYXJvblwiLFwiYnJva2VuYmFyXCIsXCJFdGhcIixcImV0aFwiLFwiWWFjdXRlXCIsXCJ5YWN1dGVcIixcIlRob3JuXCIsXCJ0aG9yblwiLFwibWludXNcIixcIm11bHRpcGx5XCIsXCJvbmVzdXBlcmlvclwiLFwidHdvc3VwZXJpb3JcIixcInRocmVlc3VwZXJpb3JcIixcIm9uZWhhbGZcIixcIm9uZXF1YXJ0ZXJcIixcInRocmVlcXVhcnRlcnNcIixcImZyYW5jXCIsXCJHYnJldmVcIixcImdicmV2ZVwiLFwiSWRvdGFjY2VudFwiLFwiU2NlZGlsbGFcIixcInNjZWRpbGxhXCIsXCJDYWN1dGVcIixcImNhY3V0ZVwiLFwiQ2Nhcm9uXCIsXCJjY2Fyb25cIixcImRjcm9hdFwiXSxcbn07XG5cbi8vIGZvcm1hdCBjb2Rlc1xuY29uc3QgVTQgPSAwO1xuY29uc3QgVTggPSAxO1xuY29uc3QgSTggPSAyO1xuY29uc3QgVTE2ID0gMztcbmNvbnN0IEkxNiA9IDQ7XG5jb25zdCBVMjQgPSA1O1xuY29uc3QgSTI0ID0gNjtcbmNvbnN0IFUzMiA9IDc7XG5jb25zdCBJMzIgPSA4O1xuY29uc3QgVTY0ID0gOTtcbmNvbnN0IEk2NCA9IDEwO1xuY29uc3QgRjE2MTYgPSAxMTtcbmNvbnN0IEYyMTQgPSAxMjtcbmNvbnN0IFNUUiA9IDEzO1xuY29uc3QgVEFHID0gMTQ7XG5jb25zdCBDSEFSID0gMTU7XG5cbmNvbnN0IEZPUk1BVFMgPSB7XG5cblx0aGVhZDoge1xuXHRcdHZlcnNpb246IFtVMTYsMl0sXG5cdFx0Zm9udFJldmlzaW9uOiBbVTE2LDJdLFxuXHRcdGNoZWNrU3VtQWRqdXN0bWVudDogVTMyLFxuXHRcdG1hZ2ljTnVtYmVyOiBVMzIsXG5cdFx0ZmxhZ3M6IFUxNixcblx0XHR1bml0c1BlckVtOiBVMTYsXG5cdFx0Y3JlYXRlZDogSTY0LFxuXHRcdG1vZGlmaWVkOiBJNjQsXG5cdFx0eE1pbjogSTE2LFxuXHRcdHlNaW46IEkxNixcblx0XHR4TWF4OiBJMTYsXG5cdFx0eU1heDogSTE2LFxuXHRcdG1hY1N0eWxlOiBVMTYsXG5cdFx0bG93ZXN0UmVjUFBFTTogVTE2LFxuXHRcdGZvbnREaXJlY3Rpb25IaW50OiBJMTYsXG5cdFx0aW5kZXhUb0xvY0Zvcm1hdDogSTE2LFxuXHRcdGdseXBoRGF0YUZvcm1hdDogSTE2LFxuXHR9LFxuXG5cdGhoZWE6IHtcblx0XHR2ZXJzaW9uOiBbVTE2LDJdLFxuXHRcdGFzY2VuZGVyOiBJMTYsXG5cdFx0ZGVzY2VuZGVyOiBJMTYsXG5cdFx0bGluZUdhcDogSTE2LFxuXHRcdGFkdmFuY2VXaWR0aE1heDogVTE2LFxuXHRcdG1pbkxlZnRTaWRlQmVhcmluZzogSTE2LFxuXHRcdG1pblJpZ2h0U2lkZUJlYXJpbmc6IEkxNixcblx0XHR4TWF4RXh0ZW50OiBJMTYsXG5cdFx0Y2FyZXRTbG9wZVJpc2U6IEkxNixcblx0XHRjYXJldFNsb3BlUnVuOiBJMTYsXG5cdFx0Y2FyZXRPZmZzZXQ6IEkxNixcblx0XHRyZXNlcnZlZDogW0kxNiw0XSxcblx0XHRtZXRyaWNEYXRhRm9ybWF0OiBJMTYsXG5cdFx0bnVtYmVyT2ZITWV0cmljczogVTE2LFxuXHR9LFxuXG5cdHZoZWE6IHtcblx0XHR2ZXJzaW9uOiBbVTMyXSxcblx0XHRfSUZfMTA6IFtbXCJ2ZXJzaW9uXCIsIFwiPT1cIiwgMHgwMDAxMDAwMF0sIHtcblx0XHRcdGFzY2VudDogSTE2LFxuXHRcdFx0ZGVzY2VudDogSTE2LFxuXHRcdFx0bGluZUdhcDogSTE2LFxuXHRcdH1dLFxuXHRcdF9JRl8xMTogW1tcInZlcnNpb25cIiwgXCI9PVwiLCAweDAwMDExMDAwXSwge1xuXHRcdFx0dmVydFR5cG9Bc2NlbmRlcjogSTE2LFxuXHRcdFx0dmVydFR5cG9EZXNjZW5kZXI6IEkxNixcblx0XHRcdHZlcnRUeXBvTGluZUdhcDogSTE2LFxuXHRcdH1dLFxuXHRcdGFkdmFuY2VIZWlnaHRNYXg6IEkxNixcblx0XHRtaW5Ub3A6IEkxNixcblx0XHRtaW5Cb3R0b206IEkxNixcblx0XHR5TWF4RXh0ZW50OiBJMTYsXG5cdFx0Y2FyZXRTbG9wZVJpc2U6IEkxNixcblx0XHRjYXJldFNsb3BlUnVuOiBJMTYsXG5cdFx0Y2FyZXRPZmZzZXQ6IEkxNixcblx0XHRyZXNlcnZlZDogW0kxNiw0XSxcblx0XHRtZXRyaWNEYXRhRm9ybWF0OiBJMTYsXG5cdFx0bnVtT2ZMb25nVmVyTWV0cmljczogVTE2LFxuXHR9LFxuXHRcblx0bWF4cDoge1xuXHRcdHZlcnNpb246IEYxNjE2LFxuXHRcdG51bUdseXBoczogVTE2LFxuXHRcdF9JRl86IFtbXCJ2ZXJzaW9uXCIsIFwiPj1cIiwgMS4wXSwge1xuXHRcdFx0bWF4UG9pbnRzOiBVMTYsXG5cdFx0XHRtYXhDb250b3VyczogVTE2LFxuXHRcdFx0bWF4Q29tcG9zaXRlUG9pbnRzOiBVMTYsXG5cdFx0XHRtYXhDb21wb3NpdGVDb250b3VyczogVTE2LFxuXHRcdFx0bWF4Wm9uZXM6IFUxNixcblx0XHRcdG1heFR3aWxpZ2h0UG9pbnRzOiBVMTYsXG5cdFx0XHRtYXhTdG9yYWdlOiBVMTYsXG5cdFx0XHRtYXhGdW5jdGlvbkRlZnM6IFUxNixcblx0XHRcdG1heEluc3RydWN0aW9uRGVmczogVTE2LFxuXHRcdFx0bWF4U3RhY2tFbGVtZW50czogVTE2LFxuXHRcdFx0bWF4U2l6ZU9mSW5zdHJ1Y3Rpb25zOiBVMTYsXG5cdFx0XHRtYXhDb21wb25lbnRFbGVtZW50czogVTE2LFxuXHRcdFx0bWF4Q29tcG9uZW50RGVwdGg6IFUxNixcblx0XHR9XSxcblx0fSxcblx0XG5cdHBvc3Q6IHtcblx0XHR2ZXJzaW9uOiBGMTYxNixcblx0XHRpdGFsaWNBbmdsZTogRjE2MTYsXG5cdFx0dW5kZXJsaW5lUG9zaXRpb246IEkxNixcblx0XHR1bmRlcmxpbmVUaGlja25lc3M6IEkxNixcblx0XHRpc0ZpeGVkUGl0Y2g6IFUzMixcblx0XHRtaW5NZW1UeXBlNDI6IFUzMixcblx0XHRtYXhNZW1UeXBlNDI6IFUzMixcblx0XHRtaW5NZW1UeXBlMTogVTMyLFxuXHRcdG1heE1lbVR5cGUxOiBVMzIsXG5cdFx0X0lGXzogW1tcInZlcnNpb25cIiwgXCI9PVwiLCAyLjBdLCB7XG5cdFx0XHRudW1HbHlwaHM6IFUxNixcblx0XHRcdGdseXBoTmFtZUluZGV4OiBbVTE2LCBcIl9BUkcwX1wiXSxcblx0XHR9XSxcblx0XHRfSUZfMjogW1tcInZlcnNpb25cIiwgXCI9PVwiLCAyLjVdLCB7XG5cdFx0XHRudW1HbHlwaHM6IFUxNixcblx0XHRcdG9mZnNldDogW0k4LCBcIm51bUdseXBoc1wiXSxcblx0XHR9XSxcblx0fSxcblxuXHRuYW1lOiB7XG5cdFx0dmVyc2lvbjogVTE2LFxuXHRcdGNvdW50OiBVMTYsXG5cdFx0c3RvcmFnZU9mZnNldDogVTE2LFxuXHR9LFxuXG5cdGNtYXA6IHtcblx0XHR2ZXJzaW9uOiBVMTYsXG5cdFx0bnVtVGFibGVzOiBVMTYsXG5cdH0sXG5cdFxuXHRcIk9TLzJcIjoge1xuXHRcdHZlcnNpb246IFUxNixcblx0XHR4QXZnQ2hhcldpZHRoOiBVMTYsXG5cdFx0dXNXZWlnaHRDbGFzczogVTE2LFxuXHRcdHVzV2lkdGhDbGFzczogVTE2LFxuXHRcdGZzVHlwZTogVTE2LFxuXHRcdHlTdWJzY3JpcHRYU2l6ZTogVTE2LFxuXHRcdHlTdWJzY3JpcHRZU2l6ZTogVTE2LFxuXHRcdHlTdWJzY3JpcHRYT2Zmc2V0OiBVMTYsXG5cdFx0eVN1YnNjcmlwdFlPZmZzZXQ6IFUxNixcblx0XHR5U3VwZXJzY3JpcHRYU2l6ZTogVTE2LFxuXHRcdHlTdXBlcnNjcmlwdFlTaXplOiBVMTYsXG5cdFx0eVN1cGVyc2NyaXB0WE9mZnNldDogVTE2LFxuXHRcdHlTdXBlcnNjcmlwdFlPZmZzZXQ6IFUxNixcblx0XHR5U3RyaWtlb3V0U2l6ZTogVTE2LFxuXHRcdHlTdHJpa2VvdXRQb3NpdGlvbjogVTE2LFxuXHRcdHNGYW1pbHlDbGFzczogVTE2LFxuXHRcdHBhbm9zZTogW1U4LDEwXSxcblx0XHR1bFVuaWNvZGVSYW5nZTE6IFUzMixcblx0XHR1bFVuaWNvZGVSYW5nZTI6IFUzMixcblx0XHR1bFVuaWNvZGVSYW5nZTM6IFUzMixcblx0XHR1bFVuaWNvZGVSYW5nZTQ6IFUzMixcblx0XHRhY2hWZW5kSUQ6IFRBRyxcblx0XHRmc1NlbGVjdGlvbjogVTE2LFxuXHRcdHVzRmlyc3RDaGFySW5kZXg6IFUxNixcblx0XHR1c0xhc3RDaGFySW5kZXg6IFUxNixcblx0XHRzVHlwb0FzY2VuZGVyOiBVMTYsXG5cdFx0c1R5cG9EZXNjZW5kZXI6IFUxNixcblx0XHRzVHlwb0xpbmVHYXA6IFUxNixcblx0XHR1c1dpbkFzY2VudDogVTE2LFxuXHRcdHVzV2luRGVzY2VudDogVTE2LFxuXHRcdF9JRl86IFtbXCJ2ZXJzaW9uXCIsIFwiPj1cIiwgMV0sIHtcblx0XHRcdHVsQ29kZVBhZ2VSYW5nZTE6IFUzMixcblx0XHRcdHVsQ29kZVBhZ2VSYW5nZTI6IFUzMixcblx0XHR9XSxcblx0XHRfSUZfMjogW1tcInZlcnNpb25cIiwgXCI+PVwiLCAyXSwge1xuXHRcdFx0c3hIZWlnaHQ6IFUxNixcblx0XHRcdHNDYXBIZWlnaHQ6IFUxNixcblx0XHRcdHVzRGVmYXVsdENoYXI6IFUxNixcblx0XHRcdHVzQnJlYWtDaGFyOiBVMTYsXG5cdFx0XHR1c01heENvbnRleHQ6IFUxNixcblx0XHR9XSxcblx0XHRfSUZfMzogW1tcInZlcnNpb25cIiwgXCI+PVwiLCA1XSwge1xuXHRcdFx0dXNMb3dlck9wdGljYWxQb2ludFNpemU6IFUxNixcblx0XHRcdHVzVXBwZXJPcHRpY2FsUG9pbnRTaXplOiBVMTYsXG5cdFx0fV0sXG5cdH0sXG5cblx0ZnZhcjoge1xuXHRcdHZlcnNpb246IFtVMTYsMl0sXG5cdFx0YXhlc0FycmF5T2Zmc2V0OiBVMTYsXG5cdFx0cmVzZXJ2ZWQ6IFUxNixcblx0XHRheGlzQ291bnQ6IFUxNixcblx0XHRheGlzU2l6ZTogVTE2LFxuXHRcdGluc3RhbmNlQ291bnQ6IFUxNixcblx0XHRpbnN0YW5jZVNpemU6IFUxNlxuXHR9LFxuXG5cdGd2YXI6IHtcblx0XHR2ZXJzaW9uOiBbVTE2LDJdLFxuXHRcdGF4aXNDb3VudDogVTE2LFxuXHRcdHNoYXJlZFR1cGxlQ291bnQ6IFUxNixcblx0XHRzaGFyZWRUdXBsZXNPZmZzZXQ6IFUzMixcblx0XHRnbHlwaENvdW50OiBVMTYsXG5cdFx0ZmxhZ3M6IFUxNixcblx0XHRnbHlwaFZhcmlhdGlvbkRhdGFBcnJheU9mZnNldDogVTMyLFxuXHR9LFxuXG5cdGF2YXI6IHtcblx0XHR2ZXJzaW9uOiBbVTE2LDJdLFxuXHRcdHJlc2VydmVkOiBVMTYsXG5cdFx0YXhpc0NvdW50OiBVMTYsXG5cdH0sXG5cblx0Q09MUjoge1xuXHRcdHZlcnNpb246IFUxNixcblx0XHRudW1CYXNlR2x5cGhSZWNvcmRzOiBVMTYsXG5cdFx0YmFzZUdseXBoUmVjb3Jkc09mZnNldDogVTMyLFxuXHRcdGxheWVyUmVjb3Jkc09mZnNldDogVTMyLFxuXHRcdG51bUxheWVyUmVjb3JkczogVTE2LFxuXHRcdF9JRl86IFtbXCJ2ZXJzaW9uXCIsIFwiPT1cIiwgMV0sIHtcblx0XHRcdGJhc2VHbHlwaExpc3RPZmZzZXQ6IFUzMixcblx0XHRcdGxheWVyTGlzdE9mZnNldDogVTMyLFxuXHRcdFx0Y2xpcExpc3RPZmZzZXQ6IFUzMixcblx0XHRcdHZhckluZGV4TWFwT2Zmc2V0OiBVMzIsXG5cdFx0XHRpdGVtVmFyaWF0aW9uU3RvcmVPZmZzZXQ6IFUzMixcblx0XHR9XSxcblx0fSxcblxuXHRDUEFMOiB7XG5cdFx0dmVyc2lvbjogVTE2LFxuXHRcdG51bVBhbGV0dGVFbnRyaWVzOiBVMTYsXG5cdFx0bnVtUGFsZXR0ZXM6IFUxNixcblx0XHRudW1Db2xvclJlY29yZHM6IFUxNixcblx0XHRjb2xvclJlY29yZHNBcnJheU9mZnNldDogVTMyLFxuXHRcdGNvbG9yUmVjb3JkSW5kaWNlczogW1UxNixcIm51bVBhbGV0dGVzXCJdLFxuXHRcdF9JRl86IFtbXCJ2ZXJzaW9uXCIsIFwiPT1cIiwgMV0sIHtcblx0XHRcdHBhbGV0dGVUeXBlc0FycmF5T2Zmc2V0OiBVMzIsXG5cdFx0XHRwYWxldHRlTGFiZWxzQXJyYXlPZmZzZXQ6IFUzMixcblx0XHRcdHBhbGV0dGVFbnRyeUxhYmVsc0FycmF5T2Zmc2V0OiBVMzIsXG5cdFx0fV0sXG5cdFx0Ly8gY29sb3JSZWNvcmRzW1UzMiwgXCJudW1Db2xvclJlY29yZHNcIiwgXCJAY29sb3JSZWNvcmRzQXJyYXlPZmZzZXRcIl0sIC8vIG1heWJlIHRoaXMgZm9ybWF0XG5cdH0sXG5cblx0U1RBVDoge1xuXHRcdHZlcnNpb246IFtVMTYsMl0sXG5cdFx0ZGVzaWduQXhpc1NpemU6IFUxNixcblx0XHRkZXNpZ25BeGlzQ291bnQ6IFUxNixcblx0XHRkZXNpZ25BeGVzT2Zmc2V0OiBVMzIsXG5cdFx0YXhpc1ZhbHVlQ291bnQ6IFUxNixcblx0XHRvZmZzZXRUb0F4aXNWYWx1ZU9mZnNldHM6IFUzMixcblx0XHRlbGlkZWRGYWxsYmFja05hbWVJRDogVTE2XG5cdH0sXG5cblx0TVZBUjoge1xuXHRcdHZlcnNpb246IFtVMTYsMl0sXG5cdFx0cmVzZXJ2ZWQ6IFUxNixcblx0XHR2YWx1ZVJlY29yZFNpemU6IFUxNixcblx0XHR2YWx1ZVJlY29yZENvdW50OiBVMTYsXG5cdFx0aXRlbVZhcmlhdGlvblN0b3JlT2Zmc2V0OiBVMTYsXG5cdH0sXG5cblx0SFZBUjoge1xuXHRcdHZlcnNpb246IFtVMTYsMl0sXG5cdFx0aXRlbVZhcmlhdGlvblN0b3JlT2Zmc2V0OiBVMzIsXG5cdFx0YWR2YW5jZVdpZHRoTWFwcGluZ09mZnNldDogVTMyLFxuXHRcdGxzYk1hcHBpbmdPZmZzZXQ6IFUzMixcblx0XHRyc2JNYXBwaW5nT2Zmc2V0OiBVMzIsXG5cdH0sXG5cblx0VlZBUjoge1xuXHRcdHZlcnNpb246IFtVMTYsMl0sXG5cdFx0aXRlbVZhcmlhdGlvblN0b3JlT2Zmc2V0OiBVMzIsXG5cdFx0YWR2YW5jZUhlaWdodE1hcHBpbmdPZmZzZXQ6IFUzMixcblx0XHR0c2JNYXBwaW5nT2Zmc2V0OiBVMzIsXG5cdFx0YnNiTWFwcGluZ09mZnNldDogVTMyLFxuXHRcdHZPcmdNYXBwaW5nT2Zmc2V0OiBVMzIsXG5cdH0sXG5cblx0VGFibGVEaXJlY3Rvcnk6IHtcblx0XHRzZm50VmVyc2lvbjogVTMyLFxuXHRcdG51bVRhYmxlczogVTE2LFxuXHRcdHNlYXJjaFJhbmdlOiBVMTYsXG5cdFx0ZW50cnlTZWxlY3RvcjogVTE2LFxuXHRcdHJhbmdlU2hpZnQ6IFUxNixcblx0fSxcblxuXHRUYWJsZVJlY29yZDoge1xuXHRcdHRhZzogVEFHLFxuXHRcdGNoZWNrU3VtOiBVMzIsXG5cdFx0b2Zmc2V0OiBVMzIsXG5cdFx0bGVuZ3RoOiBVMzIsXG5cdH0sXG5cblx0TmFtZVJlY29yZDoge1xuXHRcdHBsYXRmb3JtSUQ6IFUxNixcblx0XHRlbmNvZGluZ0lEOiBVMTYsXG5cdFx0bGFuZ3VhZ2VJRDogVTE2LFxuXHRcdG5hbWVJRDogVTE2LFxuXHRcdGxlbmd0aDogVTE2LFxuXHRcdHN0cmluZ09mZnNldDogVTE2LFxuXHR9LFxuXHRcblx0RW5jb2RpbmdSZWNvcmQ6IHtcblx0XHRwbGF0Zm9ybUlEOiBVMTYsXG5cdFx0ZW5jb2RpbmdJRDogVTE2LFxuXHRcdHN1YnRhYmxlT2Zmc2V0OiBVMzIsXG5cdH0sXG5cblx0Q2hhcmFjdGVyTWFwOiB7XG5cdFx0Zm9ybWF0OiBVMTYsXG5cdFx0X0lGXzogW1tcImZvcm1hdFwiLCBcIjw9XCIsIDZdLCB7XG5cdFx0XHRsZW5ndGg6IFUxNixcblx0XHRcdGxhbmd1YWdlOiBVMTYsXG5cdFx0fV0sXG5cdFx0X0lGXzE6IFtbXCJmb3JtYXRcIiwgXCI9PVwiLCA4XSwge1xuXHRcdFx0cmVzZXJ2ZWQ6IFUxNixcblx0XHRcdGxlbmd0aDogVTMyLFxuXHRcdFx0bGFuZ3VhZ2U6IFUzMixcblx0XHR9XSxcblx0XHRfSUZfMjogW1tcImZvcm1hdFwiLCBcIj09XCIsIDEwXSwge1xuXHRcdFx0cmVzZXJ2ZWQ6IFUxNixcblx0XHRcdGxlbmd0aDogVTMyLFxuXHRcdFx0bGFuZ3VhZ2U6IFUzMixcblx0XHR9XSxcblx0XHRfSUZfMzogW1tcImZvcm1hdFwiLCBcIj09XCIsIDEyXSwge1xuXHRcdFx0cmVzZXJ2ZWQ6IFUxNixcblx0XHRcdGxlbmd0aDogVTMyLFxuXHRcdFx0bGFuZ3VhZ2U6IFUzMixcblx0XHR9XSxcblx0XHRfSUZfNDogW1tcImZvcm1hdFwiLCBcIj09XCIsIDE0XSwge1xuXHRcdFx0bGVuZ3RoOiBVMzIsXG5cdFx0fV0sXG5cdH0sXG5cdFx0XG5cdEdseXBoSGVhZGVyOiB7XG5cdFx0bnVtYmVyT2ZDb250b3VyczogSTE2LFxuXHRcdHhNaW46IEkxNixcblx0XHR5TWluOiBJMTYsXG5cdFx0eE1heDogSTE2LFxuXHRcdHlNYXg6IEkxNixcblx0fSxcblxuXHRWYXJpYXRpb25BeGlzUmVjb3JkOiB7XG5cdFx0YXhpc1RhZzogVEFHLFxuXHRcdG1pblZhbHVlOiBGMTYxNixcblx0XHRkZWZhdWx0VmFsdWU6IEYxNjE2LFxuXHRcdG1heFZhbHVlOiBGMTYxNixcblx0XHRmbGFnczogVTE2LFxuXHRcdGF4aXNOYW1lSUQ6IFUxNixcblx0fSxcblx0XG5cdEluc3RhbmNlUmVjb3JkOiB7XG5cdFx0c3ViZmFtaWx5TmFtZUlEOiBVMTYsXG5cdFx0ZmxhZ3M6IFUxNixcblx0XHRjb29yZGluYXRlczogW0YxNjE2LCBcIl9BUkcwX1wiXSxcblx0XHRfSUZfOiBbW1wiX0FSRzFfXCIsIFwiPT1cIiwgdHJ1ZV0sIHtcblx0XHRcdHBvc3RTY3JpcHROYW1lSUQ6IFUxNixcblx0XHR9XSxcblx0fSxcblxuXHRBeGlzUmVjb3JkOiB7XG5cdFx0YXhpc1RhZzogVEFHLFxuXHRcdGF4aXNOYW1lSUQ6IFUxNixcblx0XHRheGlzT3JkZXJpbmc6IFUxNixcblx0fSxcblxuXHRBeGlzVmFsdWVGb3JtYXQ6IHtcblx0XHRmb3JtYXQ6IFUxNixcblx0XHRfSUZfOiBbW1wiZm9ybWF0XCIsIFwiPFwiLCA0XSwge1xuXHRcdFx0YXhpc0luZGV4OiBVMTYsXG5cdFx0fV0sXG5cdFx0X0lGXzQ6IFtbXCJmb3JtYXRcIiwgXCI9PVwiLCA0XSwge1xuXHRcdFx0YXhpc0NvdW50OiBVMTYsXG5cdFx0fV0sXG5cdFx0ZmxhZ3M6IFUxNixcblx0XHR2YWx1ZU5hbWVJRDogVTE2LFxuXHRcdF9JRl8xOiBbW1wiZm9ybWF0XCIsIFwiPT1cIiwgMV0sIHtcblx0XHRcdHZhbHVlOiBGMTYxNixcblx0XHR9XSxcblx0XHRfSUZfMjogW1tcImZvcm1hdFwiLCBcIj09XCIsIDJdLCB7XG5cdFx0XHR2YWx1ZTogRjE2MTYsXG5cdFx0XHRyYW5nZU1pblZhbHVlOiBGMTYxNixcblx0XHRcdHJhbmdlTWF4VmFsdWU6IEYxNjE2LFxuXHRcdH1dLFxuXHRcdF9JRl8zOiBbW1wiZm9ybWF0XCIsIFwiPT1cIiwgM10sIHtcblx0XHRcdHZhbHVlOiBGMTYxNixcblx0XHRcdGxpbmtlZFZhbHVlOiBGMTYxNixcblx0XHR9XSxcblx0fSxcblxuXHRJdGVtVmFyaWF0aW9uU3RvcmVIZWFkZXI6IHtcblx0XHRmb3JtYXQ6IFUxNixcblx0XHRyZWdpb25MaXN0T2Zmc2V0OiBVMzIsXG5cdFx0aXRlbVZhcmlhdGlvbkRhdGFDb3VudDogVTE2LFxuXHRcdGl0ZW1WYXJpYXRpb25EYXRhT2Zmc2V0czogW1UzMiwgXCJpdGVtVmFyaWF0aW9uRGF0YUNvdW50XCJdLFxuXHR9LFxuXG5cdEl0ZW1WYXJpYXRpb25EYXRhOiB7XG5cdFx0aXRlbUNvdW50OiBVMTYsXG5cdFx0d29yZERlbHRhQ291bnQ6IFUxNixcblx0XHRyZWdpb25JbmRleENvdW50OiBVMTYsXG5cdFx0cmVnaW9uSW5kZXhlczogW1UxNiwgXCJyZWdpb25JbmRleENvdW50XCJdLFxuXHR9LFxufTtcblxuLy8gZ3ZhclxuY29uc3QgR1ZBUl9TSEFSRURfUE9JTlRfTlVNQkVSUyA9IDB4ODAwMDtcbmNvbnN0IEdWQVJfRU1CRURERURfUEVBS19UVVBMRSA9IDB4ODAwMDtcbmNvbnN0IEdWQVJfSU5URVJNRURJQVRFX1JFR0lPTiA9IDB4NDAwMDtcbmNvbnN0IEdWQVJfUFJJVkFURV9QT0lOVF9OVU1CRVJTID0gMHgyMDAwO1xuY29uc3QgREVMVEFTX0FSRV9aRVJPID0gMHg4MDtcbmNvbnN0IERFTFRBU19BUkVfV09SRFMgPSAweDQwO1xuY29uc3QgREVMVEFfUlVOX0NPVU5UX01BU0sgPSAweDNmO1xuXG4vLyBDT0xSdjEgY29tcG9zaXRlIG1vZGVzXG5jb25zdCBDT01QT1NJVEVfQ0xFQVIgPSAwO1xuY29uc3QgQ09NUE9TSVRFX1NSQyA9IDE7XG5jb25zdCBDT01QT1NJVEVfREVTVCA9IDI7XG5jb25zdCBDT01QT1NJVEVfU1JDX09WRVIgPSAzO1xuY29uc3QgQ09NUE9TSVRFX0RFU1RfT1ZFUiA9IDQ7XG5jb25zdCBDT01QT1NJVEVfU1JDX0lOID0gNTtcbmNvbnN0IENPTVBPU0lURV9ERVNUX0lOID0gNjtcbmNvbnN0IENPTVBPU0lURV9TUkNfT1VUID0gNztcbmNvbnN0IENPTVBPU0lURV9ERVNUX09VVCA9IDg7XG5jb25zdCBDT01QT1NJVEVfU1JDX0FUT1AgPSA5O1xuY29uc3QgQ09NUE9TSVRFX0RFU1RfQVRPUCA9IDEwO1xuY29uc3QgQ09NUE9TSVRFX1hPUiA9IDExO1xuY29uc3QgQ09NUE9TSVRFX1BMVVMgPSAxMjtcbmNvbnN0IENPTVBPU0lURV9TQ1JFRU4gPSAxMztcbmNvbnN0IENPTVBPU0lURV9PVkVSTEFZID0gMTQ7XG5jb25zdCBDT01QT1NJVEVfREFSS0VOID0gMTU7XG5jb25zdCBDT01QT1NJVEVfTElHSFRFTiA9IDE2O1xuY29uc3QgQ09NUE9TSVRFX0NPTE9SX0RPREdFID0gMTc7XG5jb25zdCBDT01QT1NJVEVfQ09MT1JfQlVSTiA9IDE4O1xuY29uc3QgQ09NUE9TSVRFX0hBUkRfTElHSFQgPSAxOTtcbmNvbnN0IENPTVBPU0lURV9TT0ZUX0xJR0hUID0gMjA7XG5jb25zdCBDT01QT1NJVEVfRElGRkVSRU5DRSA9IDIxO1xuY29uc3QgQ09NUE9TSVRFX0VYQ0xVU0lPTiA9IDIyO1xuY29uc3QgQ09NUE9TSVRFX01VTFRJUExZID0gMjM7XG5jb25zdCBDT01QT1NJVEVfSFNMX0hVRSA9IDI0O1xuY29uc3QgQ09NUE9TSVRFX0hTTF9TQVRVUkFUSU9OID0gMjU7XG5jb25zdCBDT01QT1NJVEVfSFNMX0NPTE9SID0gMjY7XG5jb25zdCBDT01QT1NJVEVfSFNMX0xVTUlOT1NJVFkgPSAyNztcblxuLy8gQ09MUnYxIHBhaW50IHR5cGVzIChtdWx0aXBsZSBmb3JtYXRzIGhhdmUgdGhlIHNhbWUgdHlwZSlcbmNvbnN0IFBBSU5UX0xBWUVSUyA9IDE7XG5jb25zdCBQQUlOVF9TSEFQRSA9IDI7XG5jb25zdCBQQUlOVF9UUkFOU0ZPUk0gPSAzO1xuY29uc3QgUEFJTlRfQ09NUE9TRSA9IDQ7XG5cbi8vIHRoZXJlIGFyZSA0IHR5cGVzIG9mIHBhaW50IHRhYmxlczogUEFJTlRfTEFZRVJTLCBQQUlOVF9UUkFOU0ZPUk0sIFBBSU5UX1NIQVBFLCBQQUlOVF9DT01QT1NFXG4vLyBhbGwgREFHIGxlYXZlcyBhcmUgUEFJTlRfQ09NUE9TRVxuY29uc3QgUEFJTlRfVFlQRVMgPSBbXG5cdDAsXG5cdFBBSU5UX0xBWUVSUyxcblx0UEFJTlRfQ09NUE9TRSxcblx0UEFJTlRfQ09NUE9TRSxcblx0UEFJTlRfQ09NUE9TRSxcblx0UEFJTlRfQ09NUE9TRSxcblx0UEFJTlRfQ09NUE9TRSxcblx0UEFJTlRfQ09NUE9TRSxcblx0UEFJTlRfQ09NUE9TRSxcblx0UEFJTlRfQ09NUE9TRSxcblx0UEFJTlRfU0hBUEUsXG5cdFBBSU5UX0xBWUVSUyxcblx0UEFJTlRfVFJBTlNGT1JNLFxuXHRQQUlOVF9UUkFOU0ZPUk0sXG5cdFBBSU5UX1RSQU5TRk9STSxcblx0UEFJTlRfVFJBTlNGT1JNLFxuXHRQQUlOVF9UUkFOU0ZPUk0sXG5cdFBBSU5UX1RSQU5TRk9STSxcblx0UEFJTlRfVFJBTlNGT1JNLFxuXHRQQUlOVF9UUkFOU0ZPUk0sXG5cdFBBSU5UX1RSQU5TRk9STSxcblx0UEFJTlRfVFJBTlNGT1JNLFxuXHRQQUlOVF9UUkFOU0ZPUk0sXG5cdFBBSU5UX1RSQU5TRk9STSxcblx0UEFJTlRfVFJBTlNGT1JNLFxuXHRQQUlOVF9UUkFOU0ZPUk0sXG5cdFBBSU5UX1RSQU5TRk9STSxcblx0UEFJTlRfVFJBTlNGT1JNLFxuXHRQQUlOVF9UUkFOU0ZPUk0sXG5cdFBBSU5UX1RSQU5TRk9STSxcblx0UEFJTlRfVFJBTlNGT1JNLFxuXHRQQUlOVF9UUkFOU0ZPUk0sXG5cdFBBSU5UX0NPTVBPU0UsXG5dO1xuXG5jb25zdCBQQUlOVF9WQVJfT1BFUkFORFMgPSBbMCwwLDEsMSw2LDYsNiw2LDQsNCwwLDAsNiw2LDIsMiwyLDIsNCw0LDEsMSwzLDMsMSwxLDMsMywyLDIsNCw0LDBdOyAvLyB0aGUgbnVtYmVyIG9mIHZhcmlhYmxlIG9wZXJhbmRzIHRoYXQgZWFjaCBwYWludCBoYXMsIGluZGV4ZWQgYnkgcGFpbnQuZm9ybWF0IChwcmVwZW5kZWQgd2l0aCBhIHJlY29yZCBmb3IgaW52YWxpZCBwYWludC5mb3JtYXQgMCkgdGh1cyAzMyBpdGVtcyBmcm9tIDAgdG8gMzJcblxuLy8gQ09MUnYxIGdyYWRpZW50IGV4dGVuZCBtb2Rlc1xuY29uc3QgRVhURU5EX1BBRCA9IDA7XG5jb25zdCBFWFRFTkRfUkVQRUFUID0gMTtcbmNvbnN0IEVYVEVORF9SRUZMRUNUID0gMjtcblxuXG4vLyB0YWJsZSBkZWNvZGVycyBhcmUgY2FsbGVkICphZnRlciogdGhlIGZpcnN0IHBhcnQgaGFzIGJlZW4gZGVjb2RlZCB1c2luZyB0aGUgRk9STUFUU1s8dGFibGVUYWc+XSBkZWZpbml0aW9uXG4vLyAtIGZvbnQgaXMgdGhlIFNhbXNhRm9udCBvYmplY3Rcbi8vIC0gYnVmIGlzIGEgU2Ftc2FCdWZmZXIgb2JqZWN0IGFscmVhZHkgc2V0IHVwIHRvIGNvdmVyIHRoZSB0YWJsZSBkYXRhIG9ubHksIGluaXRpYWxpemVkIHdpdGggdGhlIHRhYmxlJ3Mgb2Zmc2V0IGJlaW5nIHA9MCBhbmQgbGVuZ3RoID0gaXRzIGxlbmd0aFxuLy8gLSByZXR1cm4gKG5vbmUpLCBidXQgZm9udC48dGFibGVUYWc+IG5vdyBjb250YWlucyBtb3JlIChwb3NzaWJseSBhbGwpIG9mIHRoZSBkZWNvZGVkIHRhYmxlIGRhdGFcbmNvbnN0IFRBQkxFX0RFQ09ERVJTID0ge1xuXG5cdFwiYXZhclwiOiAoZm9udCwgYnVmKSA9PiB7XG5cdFx0Ly8gYXZhcjEgYW5kIGF2YXIyXG5cdFx0Ly8gaHR0cHM6Ly9sZWFybi5taWNyb3NvZnQuY29tL2VuLXVzL3R5cG9ncmFwaHkvb3BlbnR5cGUvc3BlYy9hdmFyXG5cdFx0Ly8gaHR0cHM6Ly9naXRodWIuY29tL2hhcmZidXp6L2JvcmluZy1leHBhbnNpb24tc3BlYy9ibG9iL21haW4vYXZhcjIubWRcblx0XHRmb250LmF2YXIuYXhpc1NlZ21lbnRNYXBzID0gW107XG5cdFx0Y29uc29sZS5hc3NlcnQoZm9udC5hdmFyLmF4aXNDb3VudCA9PT0gZm9udC5mdmFyLmF4aXNDb3VudCB8fCBmb250LmF2YXIuYXhpc0NvdW50ID09PSAwLCBgZnZhci5heGlzQ291bnQgKCR7Zm9udC5mdmFyLmF4aXNDb3VudH0pIGFuZCBhdmFyLmF4aXNDb3VudCAoJHtmb250LmF2YXIuYXhpc0NvdW50fSkgbXVzdCBtYXRjaCwgb3IgZWxzZSBhdmFyLmF4aXNDb3VudCBtdXN0IGJlIDBgKTtcblx0XHRmb3IgKGxldCBhPTA7IGE8Zm9udC5hdmFyLmF4aXNDb3VudDsgYSsrKSB7XG5cdFx0XHRjb25zdCBwb3NpdGlvbk1hcENvdW50ID0gYnVmLnUxNjtcblx0XHRcdGZvbnQuYXZhci5heGlzU2VnbWVudE1hcHNbYV0gPSBbXTtcblx0XHRcdGZvciAobGV0IHA9MDsgcDxwb3NpdGlvbk1hcENvdW50OyBwKyspIHtcblx0XHRcdFx0Zm9udC5hdmFyLmF4aXNTZWdtZW50TWFwc1thXS5wdXNoKFsgYnVmLmYyMTQsIGJ1Zi5mMjE0IF0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIGF2YXIyIG9ubHlcblx0XHRpZiAoZm9udC5hdmFyLnZlcnNpb25bMF0gPT0gMikge1xuXHRcdFx0Zm9udC5hdmFyLmF4aXNJbmRleE1hcE9mZnNldCA9IGJ1Zi51MzI7XG5cdFx0XHRmb250LmF2YXIuaXRlbVZhcmlhdGlvblN0b3JlT2Zmc2V0ID0gYnVmLnUzMjsgLy8gd2UgdXNlIHRoaXMga2V5LCByYXRoZXIgdGhhdCBpbiB0aGUgc3BlYywgc28gdGhhdCBpdCB3aWxsIGdldCBwaWNrZWQgdXAgYnkgdGhlIEl0ZW1WYXJpYXRpb25TdG9yZSBkZWNvZGVyIGFsb25nIHdpdGggdGhvc2Ugb2YgTVZBUiwgSFZBUiwgZXRjLlxuXHRcdFx0aWYgKGZvbnQuYXZhci5heGlzSW5kZXhNYXBPZmZzZXQpIHtcblx0XHRcdFx0YnVmLnNlZWsoZm9udC5hdmFyLmF4aXNJbmRleE1hcE9mZnNldCk7XG5cdFx0XHRcdGZvbnQuYXZhci5heGlzSW5kZXhNYXAgPSBidWYuZGVjb2RlSW5kZXhNYXAoKTtcblx0XHRcdH1cblx0XHRcdC8vIGVsc2Ugd2UgbXVzdCB1c2UgaW1wbGljaXQgbWFwcGluZ3MgbGF0ZXJcdFx0XHRcblx0XHR9XG5cdH0sXG5cblx0XCJjbWFwXCI6IChmb250LCBidWYpID0+IHtcblx0XHQvLyBodHRwczovL2xlYXJuLm1pY3Jvc29mdC5jb20vZW4tdXMvdHlwb2dyYXBoeS9vcGVudHlwZS9zcGVjL2NtYXBcblx0XHRjb25zdCBjbWFwID0gZm9udC5jbWFwO1xuXHRcdGNtYXAubG9va3VwID0gW107IC8vIHRoZSBtYWluIGNtYXAgbG9va3VwIHRhYmxlXG5cdFx0Y21hcC5lbmNvZGluZ1JlY29yZHMgPSBbXTtcblxuXHRcdC8vIHN0ZXAgdGhydSB0aGUgZW5jb2RpbmdSZWNvcmRzXG5cdFx0Y29uc3QgdmFsaWRFbmNvZGluZ3MgPSBbIDAgKiAweDEwMDAwICsgMywgMyAqIDB4MTAwMDAgKyAxLCAzICogMHgxMDAwMCArIDEwIF07IC8vIHdlIGVuY29kZSBbMCwzXSwgWzMsMV0gYW5kIFszLDEwXSBsaWtlIHRoaXMgZm9yIGVhc3kgc2VhcmNoaW5nXG5cdFx0YnVmLnNlZWsoNCk7XG5cdFx0Zm9yIChsZXQgdD0wOyB0IDwgY21hcC5udW1UYWJsZXM7IHQrKykge1xuXHRcdFx0Y29uc3QgZW5jb2RpbmdSZWNvcmQgPSBidWYuZGVjb2RlKEZPUk1BVFMuRW5jb2RpbmdSZWNvcmQpO1xuXHRcdFx0aWYgKHZhbGlkRW5jb2RpbmdzLmluY2x1ZGVzKGVuY29kaW5nUmVjb3JkLnBsYXRmb3JtSUQgKiAweDEwMDAwICsgZW5jb2RpbmdSZWNvcmQuZW5jb2RpbmdJRCkpIHtcblx0XHRcdFx0Y21hcC5lbmNvZGluZ1JlY29yZCA9IGVuY29kaW5nUmVjb3JkOyAvLyB0aGlzIHdpbGwgcHJlZmVyIHRoZSBsYXRlciBvbmVzLCBzbyBbMywxMF0gYmV0dGVyIHRoYW4gWzMsMV1cblx0XHRcdH1cblx0XHRcdGNtYXAuZW5jb2RpbmdSZWNvcmRzLnB1c2goZW5jb2RpbmdSZWNvcmQpO1xuXHRcdH1cblx0XHRcblx0XHQvLyBzZWxlY3QgdGhlIGxhc3QgZW5jb2RpbmdSZWNvcmQgd2UgZm91bmQgdGhhdCB3YXMgdmFsaWQgZm9yIHVzIFszLDEwXSBpcyBiZXR0ZXIgdGhhbiBbMywxXSBhbmQgWzAsM11cblx0XHRpZiAoY21hcC5lbmNvZGluZ1JlY29yZCkge1xuXG5cdFx0XHRidWYuc2VlayhjbWFwLmVuY29kaW5nUmVjb3JkLnN1YnRhYmxlT2Zmc2V0KTtcblx0XHRcdGNvbnN0IGNoYXJhY3Rlck1hcCA9IGJ1Zi5kZWNvZGUoRk9STUFUUy5DaGFyYWN0ZXJNYXApO1xuXG5cdFx0XHQvLyBwYXJzZSB0aGUgZm9ybWF0LCB0aGVuIHN3aXRjaCB0byBmb3JtYXQtc3BlY2lmaWMgcGFyc2VyXG5cdFx0XHQvLyBUT0RPOiB3ZeKAmWQgc2F2ZSBtZW1vcnkgYnkgemlwcGluZyB0aHJvdWdoIHRoZSBiaW5hcnkgbGl2ZS4uLlxuXHRcdFx0Ly8gVGhlc2UgZm9ybWF0cyBhcmUgZGVjb2RlZCByZWFkeSBmb3IgcXVpY2sgbG9va3VwIGluIFNhbXNhRm9udC5nbHlwaElkRnJvbVVuaWNvZGUoKVxuXHRcdFx0c3dpdGNoIChjaGFyYWN0ZXJNYXAuZm9ybWF0KSB7XG5cblx0XHRcdFx0Y2FzZSAwOiB7XG5cdFx0XHRcdFx0Y2hhcmFjdGVyTWFwLm1hcHBpbmcgPSBbXTtcblx0XHRcdFx0XHRmb3IgKGxldCBjPTA7IGM8MjU2OyBjKyspIHtcblx0XHRcdFx0XHRcdGNoYXJhY3Rlck1hcC5tYXBwaW5nW2NdID0gYnVmLnU4O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNhc2UgNDoge1xuXHRcdFx0XHRcdGNvbnN0IHNlZ0NvdW50ID0gYnVmLnUxNiAvIDI7XG5cdFx0XHRcdFx0YnVmLnNlZWtyKDYpOyAvLyBza2lwIGJpbmFyeSBzZWFyY2ggcGFyYW1zXG5cdFx0XHRcdFx0Y2hhcmFjdGVyTWFwLnNlZ21lbnRzID0gW107XG5cdFx0XHRcdFx0Zm9yIChsZXQgcz0wOyBzPHNlZ0NvdW50OyBzKyspXG5cdFx0XHRcdFx0XHRjaGFyYWN0ZXJNYXAuc2VnbWVudHNbc10gPSB7ZW5kOiBidWYudTE2fTtcblx0XHRcdFx0XHRidWYuc2Vla3IoMik7IC8vIHNraXAgcmVzZXJ2ZWRQYWRcblx0XHRcdFx0XHRmb3IgKGxldCBzPTA7IHM8c2VnQ291bnQ7IHMrKylcblx0XHRcdFx0XHRcdGNoYXJhY3Rlck1hcC5zZWdtZW50c1tzXS5zdGFydCA9IGJ1Zi51MTY7XG5cdFx0XHRcdFx0Zm9yIChsZXQgcz0wOyBzPHNlZ0NvdW50OyBzKyspXG5cdFx0XHRcdFx0XHRjaGFyYWN0ZXJNYXAuc2VnbWVudHNbc10uaWREZWx0YSA9IGJ1Zi51MTY7XG5cdFx0XHRcdFx0Y2hhcmFjdGVyTWFwLmlkUmFuZ2VPZmZzZXRPZmZzZXQgPSBidWYudGVsbCgpO1xuXHRcdFx0XHRcdGZvciAobGV0IHM9MDsgczxzZWdDb3VudDsgcysrKVxuXHRcdFx0XHRcdFx0Y2hhcmFjdGVyTWFwLnNlZ21lbnRzW3NdLmlkUmFuZ2VPZmZzZXQgPSBidWYudTE2O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y2FzZSAxMjoge1xuXHRcdFx0XHRcdGNvbnN0IG51bUdyb3VwcyA9IGJ1Zi51MzI7XG5cdFx0XHRcdFx0Y2hhcmFjdGVyTWFwLmdyb3VwcyA9IFtdO1xuXHRcdFx0XHRcdGZvciAobGV0IGdycD0wOyBncnA8bnVtR3JvdXBzOyBncnArKykge1xuXHRcdFx0XHRcdFx0Y2hhcmFjdGVyTWFwLmdyb3Vwcy5wdXNoKHsgc3RhcnQ6IGJ1Zi51MzIsIGVuZDogYnVmLnUzMiwgZ2x5cGhJZDogYnVmLnUzMiB9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGBXYXJuaW5nOiBOb3QgaGFuZGxpbmcgY21hcCBmb3JtYXQgJHtjaGFyYWN0ZXJNYXAuZm9ybWF0fWApO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0Y21hcC5jaGFyYWN0ZXJNYXAgPSBjaGFyYWN0ZXJNYXA7XG5cdFx0fVxuXHR9LFxuXG5cdFwiQ09MUlwiOiAoZm9udCwgYnVmKSA9PiB7XG5cdFx0Ly8gaHR0cHM6Ly9sZWFybi5taWNyb3NvZnQuY29tL2VuLXVzL3R5cG9ncmFwaHkvb3BlbnR5cGUvc3BlYy9jb2xyXG5cdFx0Y29uc3QgY29sciA9IGZvbnQuQ09MUjtcblx0XHRpZiAoY29sci52ZXJzaW9uIDw9IDEpIHtcblxuXHRcdFx0Ly8gQ09MUnYwIG9mZnNldHMgKGl0IHdvdWxkIGJlIG9rIHRvIGxvb2sgdGhlc2UgdXAgbGl2ZSB3aXRoIGJpbmFyeSBzZWFyY2gpXG5cdFx0XHRjb2xyLmJhc2VHbHlwaFJlY29yZHMgPSBbXTtcblx0XHRcdGlmIChjb2xyLm51bUJhc2VHbHlwaFJlY29yZHMpIHtcblx0XHRcdFx0YnVmLnNlZWsoY29sci5iYXNlR2x5cGhSZWNvcmRzT2Zmc2V0KTtcblx0XHRcdFx0Zm9yIChsZXQgaT0wOyBpPGNvbHIubnVtQmFzZUdseXBoUmVjb3JkczsgaSsrKSAge1xuXHRcdFx0XHRcdGNvbnN0IGdseXBoSUQgPSBidWYudTE2O1xuXHRcdFx0XHRcdGNvbHIuYmFzZUdseXBoUmVjb3Jkc1tnbHlwaElEXSA9IFtidWYudTE2LCBidWYudTE2XTsgLy8gZmlyc3RMYXllckluZGV4LCBudW1MYXllcnNcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY29sci52ZXJzaW9uID09IDEpIHtcblxuXHRcdFx0XHQvLyBDT0xSdjEgb2Zmc2V0cyAoaXQgd291bGQgYmUgb2sgdG8gbG9vayB0aGVzZSB1cCBsaXZlIHdpdGggYmluYXJ5IHNlYXJjaClcblx0XHRcdFx0aWYgKGNvbHIuYmFzZUdseXBoTGlzdE9mZnNldCkge1xuXHRcdFx0XHRcdGJ1Zi5zZWVrKGNvbHIuYmFzZUdseXBoTGlzdE9mZnNldCk7XG5cdFx0XHRcdFx0Y29sci5udW1CYXNlR2x5cGhQYWludFJlY29yZHMgPSBidWYudTMyO1xuXHRcdFx0XHRcdGNvbHIuYmFzZUdseXBoUGFpbnRSZWNvcmRzID0gW107XG5cdFx0XHRcdFx0Zm9yIChsZXQgaT0wOyBpPGNvbHIubnVtQmFzZUdseXBoUGFpbnRSZWNvcmRzOyBpKyspICB7XG5cdFx0XHRcdFx0XHRjb25zdCBnbHlwaElEID0gYnVmLnUxNjtcblx0XHRcdFx0XHRcdGNvbHIuYmFzZUdseXBoUGFpbnRSZWNvcmRzW2dseXBoSURdID0gY29sci5iYXNlR2x5cGhMaXN0T2Zmc2V0ICsgYnVmLnUzMjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBDT0xSdjEgbGF5ZXJMaXN0XG5cdFx0XHRcdC8vIC0gZnJvbSB0aGUgc3BlYzogXCJUaGUgTGF5ZXJMaXN0IGlzIG9ubHkgdXNlZCBpbiBjb25qdW5jdGlvbiB3aXRoIHRoZSBCYXNlR2x5cGhMaXN0IGFuZCwgc3BlY2lmaWNhbGx5LCB3aXRoIFBhaW50Q29sckxheWVycyB0YWJsZXM7IGl0IGlzIG5vdCByZXF1aXJlZCBpZiBubyBjb2xvciBnbHlwaHMgdXNlIGEgUGFpbnRDb2xyTGF5ZXJzIHRhYmxlLiBJZiBub3QgdXNlZCwgc2V0IGxheWVyTGlzdE9mZnNldCB0byBOVUxMXCJcblx0XHRcdFx0Y29sci5sYXllckxpc3QgPSBbXTtcblx0XHRcdFx0aWYgKGNvbHIubGF5ZXJMaXN0T2Zmc2V0KSB7XG5cdFx0XHRcdFx0YnVmLnNlZWsoY29sci5sYXllckxpc3RPZmZzZXQpO1xuXHRcdFx0XHRcdGNvbHIubnVtTGF5ZXJMaXN0RW50cmllcyA9IGJ1Zi51MzI7XG5cdFx0XHRcdFx0Zm9yIChsZXQgbHlyPTA7IGx5ciA8IGNvbHIubnVtTGF5ZXJMaXN0RW50cmllczsgbHlyKyspXG5cdFx0XHRcdFx0XHRjb2xyLmxheWVyTGlzdFtseXJdID0gY29sci5sYXllckxpc3RPZmZzZXQgKyBidWYudTMyO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQ09MUnYxIHZhckluZGV4TWFwXG5cdFx0XHRcdGlmIChjb2xyLnZhckluZGV4TWFwT2Zmc2V0KSB7XG5cdFx0XHRcdFx0YnVmLnNlZWsoY29sci52YXJJbmRleE1hcE9mZnNldCk7XG5cdFx0XHRcdFx0Y29sci52YXJJbmRleE1hcCA9IGJ1Zi5kZWNvZGVJbmRleE1hcCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdFwiQ1BBTFwiOiAoZm9udCwgYnVmKSA9PiB7XG5cdFx0Ly8gbG9hZCBDUEFMIHRhYmxlIGZ1bGx5XG5cdFx0Ly8gaHR0cHM6Ly9sZWFybi5taWNyb3NvZnQuY29tL2VuLXVzL3R5cG9ncmFwaHkvb3BlbnR5cGUvc3BlYy9jcGFsXG5cdFx0Y29uc3QgY3BhbCA9IGZvbnQuQ1BBTDtcblx0XHRjcGFsLmNvbG9ycyA9IFtdO1xuXHRcdGNwYWwucGFsZXR0ZXMgPSBbXTtcblx0XHRjcGFsLnBhbGV0dGVFbnRyeUxhYmVscyA9IFtdO1xuXG5cdFx0Ly8gZGVjb2RlIGNvbG9yUmVjb3Jkc1xuXHRcdGJ1Zi5zZWVrKGNwYWwuY29sb3JSZWNvcmRzQXJyYXlPZmZzZXQpO1xuXHRcdGZvciAobGV0IGM9MDsgYzxjcGFsLm51bUNvbG9yUmVjb3JkczsgYysrKSB7XG5cdFx0XHRjcGFsLmNvbG9yc1tjXSA9IGJ1Zi51MzI7IC8vIFtibHVlLCBncmVlbiwgcmVkLCBhbHBoYSBhcyB1MzJdXG5cdFx0fVxuXG5cdFx0Ly8gZGVjb2RlIHBhbGV0dGVFbnRyeUxhYmVsc1xuXHRcdGlmIChjcGFsLnBhbGV0dGVFbnRyeUxhYmVsc0FycmF5T2Zmc2V0KSB7XG5cdFx0XHRidWYuc2VlayhjcGFsLnBhbGV0dGVFbnRyeUxhYmVsc0FycmF5T2Zmc2V0KTtcblx0XHRcdGZvciAobGV0IHBlbD0wOyBwZWw8Y3BhbC5udW1QYWxldHRlRW50cmllczsgcGVsKyspIHtcblx0XHRcdFx0Y29uc3QgbmFtZUlkID0gYnVmLnUxNjtcblx0XHRcdFx0aWYgKG5hbWVJZCAhPT0gMHhmZmZmKVxuXHRcdFx0XHRcdGNwYWwucGFsZXR0ZUVudHJ5TGFiZWxzW3BlbF0gPSBmb250Lm5hbWVzW25hbWVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gZGVjb2RlIHBhbGV0dGVzOiBuYW1lLCB0eXBlLCBjb2xvcnNcblx0XHRmb3IgKGxldCBwYWw9MDsgcGFsPGNwYWwubnVtUGFsZXR0ZXM7IHBhbCsrKSB7XG5cdFx0XHRjb25zdCBwYWxldHRlID0geyBuYW1lOiBcIlwiLCB0eXBlOiAwLCBjb2xvcnM6IFtdIH07XG5cblx0XHRcdC8vIG5hbWVcblx0XHRcdGlmIChjcGFsLnBhbGV0dGVMYWJlbHNBcnJheU9mZnNldCkge1xuXHRcdFx0XHRidWYuc2VlayhjcGFsLnBhbGV0dGVMYWJlbHNBcnJheU9mZnNldCArIDIgKiBwYWwpO1xuXHRcdFx0XHRjb25zdCBuYW1lSWQgPSBidWYudTE2O1xuXHRcdFx0XHRpZiAobmFtZUlkICE9PSAweGZmZmYpIHtcblx0XHRcdFx0XHRwYWxldHRlLm5hbWUgPSBmb250Lm5hbWVzW25hbWVJZF07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gdHlwZVxuXHRcdFx0aWYgKGNwYWwucGFsZXR0ZVR5cGVzQXJyYXlPZmZzZXQpIHtcblx0XHRcdFx0YnVmLnNlZWsoY3BhbC5wYWxldHRlVHlwZXNBcnJheU9mZnNldCArIDIgKiBwYWwpO1xuXHRcdFx0XHRwYWxldHRlLnR5cGUgPSBidWYudTE2O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBjb2xvcnNcblx0XHRcdGZvciAobGV0IGU9MDsgZTxjcGFsLm51bVBhbGV0dGVFbnRyaWVzOyBlKyspIHtcblx0XHRcdFx0cGFsZXR0ZS5jb2xvcnNbZV0gPSBjcGFsLmNvbG9yc1tjcGFsLmNvbG9yUmVjb3JkSW5kaWNlc1twYWxdICsgZV07XG5cdFx0XHR9XG5cblx0XHRcdGNwYWwucGFsZXR0ZXMucHVzaChwYWxldHRlKTtcblx0XHR9XG5cdH0sXG5cblx0XCJmdmFyXCI6IChmb250LCBidWYpID0+IHtcblx0XHQvLyBsb2FkIGZ2YXIgYXhlcyBhbmQgaW5zdGFuY2VzXG5cdFx0Ly8gaHR0cHM6Ly9sZWFybi5taWNyb3NvZnQuY29tL2VuLXVzL3R5cG9ncmFwaHkvb3BlbnR5cGUvc3BlYy9mdmFyXG5cdFx0Y29uc3QgZnZhciA9IGZvbnQuZnZhcjtcblx0XHRmdmFyLmF4ZXMgPSBbXTtcblx0XHRidWYuc2VlayhmdmFyLmF4ZXNBcnJheU9mZnNldCk7XG5cdFx0Zm9yIChsZXQgYT0wOyBhPGZ2YXIuYXhpc0NvdW50OyBhKyspIHtcblx0XHRcdGZ2YXIuYXhlcy5wdXNoKGJ1Zi5kZWNvZGUoRk9STUFUUy5WYXJpYXRpb25BeGlzUmVjb3JkKSk7XG5cdFx0fVxuXHRcdGZ2YXIuaW5zdGFuY2VzID0gW107XG5cdFx0Y29uc3QgaW5jbHVkZVBvc3RTY3JpcHROYW1lSUQgPSBmdmFyLmluc3RhbmNlU2l6ZSA9PSBmdmFyLmF4aXNDb3VudCAqIDQgKyA2OyAvLyBpbnN0YW5jZVNpemUgZGV0ZXJtaW5zIHdoZXRoZXIgcG9zdFNjcmlwdE5hbWVJRCBpcyBpbmNsdWRlZFxuXHRcdGZvciAobGV0IGk9MDsgaTxmdmFyLmluc3RhbmNlQ291bnQ7IGkrKykge1xuXHRcdFx0Y29uc3QgaW5zdGFuY2UgPSBidWYuZGVjb2RlKEZPUk1BVFMuSW5zdGFuY2VSZWNvcmQsIGZ2YXIuYXhpc0NvdW50LCBpbmNsdWRlUG9zdFNjcmlwdE5hbWVJRCk7XG5cdFx0XHRpbnN0YW5jZS5uYW1lID0gZm9udC5uYW1lc1tpbnN0YW5jZS5zdWJmYW1pbHlOYW1lSURdO1xuXHRcdFx0ZnZhci5pbnN0YW5jZXMucHVzaChpbnN0YW5jZSk7XG5cdFx0fVxuXHR9LFxuXG5cdFwiZ3ZhclwiOiAoZm9udCwgYnVmKSA9PiB7XG5cdFx0Ly8gZGVjb2RlIGd2YXLigJlzIHNoYXJlZFR1cGxlcyBhcnJheSwgc28gd2UgY2FuIHByZWNhbGN1bGF0ZSBzY2FsYXJzIChsZWF2ZSB0aGUgcmVzdCBmb3IgSklUKVxuXHRcdC8vIGh0dHBzOi8vbGVhcm4ubWljcm9zb2Z0LmNvbS9lbi11cy90eXBvZ3JhcGh5L29wZW50eXBlL3NwZWMvZ3ZhclxuXHRcdGNvbnN0IGd2YXIgPSBmb250Lmd2YXI7XG5cdFx0YnVmLnNlZWsoZ3Zhci5zaGFyZWRUdXBsZXNPZmZzZXQpO1xuXHRcdGd2YXIuc2hhcmVkVHVwbGVzID0gW107XG5cdFx0Zm9yIChsZXQgdD0wOyB0IDwgZ3Zhci5zaGFyZWRUdXBsZUNvdW50OyB0KyspIHtcblx0XHRcdGNvbnN0IHR1cGxlID0gW107XG5cdFx0XHRmb3IgKGxldCBhPTA7IGE8Z3Zhci5heGlzQ291bnQ7IGErKykge1xuXHRcdFx0XHR0dXBsZS5wdXNoKGJ1Zi5mMjE0KTsgLy8gdGhlc2UgYXJlIHRoZSBwZWFrcywgd2UgaGF2ZSB0byBjcmVhdGUgc3RhcnQgYW5kIGVuZFxuXHRcdFx0fVxuXHRcdFx0Z3Zhci5zaGFyZWRUdXBsZXMucHVzaCh0dXBsZSk7XG5cdFx0fVxuXG5cdFx0Ly8gLy8gVGhpcyBpcyBnb29kLCBJIHRoaW5rISBCdXQgbGV04oCZcyB0cnkgaXQgb25seSB3aGVuIHdlIGFyZSBoYXBweSB3aXRoIG90aGVyIHN0dWZmXG5cdFx0Ly8gLy8gLSB3ZSBjYW4gYWxzbyB1c2UgZ2V0VmFyaWF0aW9uU2NhbGFyKCkgKHNpbmd1bGFyKSBvciB3aHkgbm90IGdldFZhcmlhdGlvblNjYWxhcnMoKSBwbHVyYWwuLi4/XG5cdFx0Ly8gdGhpcy5ndmFyLnNoYXJlZFJlZ2lvbnMgPSBbXTtcblx0XHQvLyBidWYuc2Vlayh0aGlzLnRhYmxlc1tcImd2YXJcIl0ub2Zmc2V0ICsgdGhpcy5ndmFyLnNoYXJlZFR1cGxlc09mZnNldCk7XG5cdFx0Ly8gZm9yIChsZXQgdD0wOyB0IDwgdGhpcy5ndmFyLnNoYXJlZFR1cGxlQ291bnQ7IHQrKykge1xuXHRcdC8vIFx0Y29uc3QgcmVnaW9uID0gW107XG5cdFx0Ly8gXHRmb3IgKGxldCBhPTA7IGE8dGhpcy5ndmFyLmF4aXNDb3VudDsgYSsrKSB7XG5cdFx0Ly8gXHRcdGNvbnN0IHBlYWsgPSBidWYuZjIxNDsgLy8gb25seSB0aGUgcGVhayBpcyBzdG9yZWQsIHdlIGNyZWF0ZSBzdGFydCBhbmQgZW5kXG5cdFx0Ly8gXHRcdGlmIChwZWFrIDwgMCkge1xuXHRcdC8vIFx0XHRcdHN0YXJ0ID0gLTE7XG5cdFx0Ly8gXHRcdFx0ZW5kID0gMDtcblx0XHQvLyBcdFx0fVxuXHRcdC8vIFx0XHRlbHNlIGlmIChwZWFrID4gMCkge1xuXHRcdC8vIFx0XHRcdHN0YXJ0ID0gMDtcblx0XHQvLyBcdFx0XHRlbmQgPSAxO1xuXHRcdC8vIFx0XHR9XG5cdFx0Ly8gXHRcdHJlZ2lvbi5wdXNoKFtzdGFydCwgcGVhaywgZW5kXSk7XG5cdFx0Ly8gXHR9XG5cdFx0Ly8gXHR0aGlzLmd2YXIuc2hhcmVkUmVnaW9ucy5wdXNoKHJlZ2lvbik7XG5cdFx0Ly8gfVxuXHRcdC8vIEhtbSwgaXTigJlzIG5vdCB0aGF0IGdyZWF0LCBhY3R1YWxseSwgc2luY2UgaXTigJlzIGFsd2F5cyBwZWFrcyBvbmx5IGF0IGV4dHJlbWVzOyBvbiBpbnN0YW50aWF0aW9uIHdlIGp1c3QgbmVlZCB0byBjYWxjdWxhdGUgYSBzY2FsYXIgZm9yIGVhY2ggdHVwbGVcblxuXHRcdC8vIGdldCB0dXBsZU9mZnNldHMgYXJyYXkgKFRPRE86IHdlIGNvdWxkIGdldCB0aGVzZSBvZmZzZXRzIEpJVClcblx0XHRidWYuc2VlaygyMCk7XG5cdFx0Z3Zhci50dXBsZU9mZnNldHMgPSBbXTtcblx0XHRmb3IgKGxldCBnPTA7IGcgPD0gZm9udC5tYXhwLm51bUdseXBoczsgZysrKSB7IC8vIDw9XG5cdFx0XHRndmFyLnR1cGxlT2Zmc2V0c1tnXSA9IGd2YXIuZmxhZ3MgJiAweDAxID8gYnVmLnUzMiA6IGJ1Zi51MTYgKiAyO1xuXHRcdH1cblx0fSxcblxuXHRcImhtdHhcIjogKGZvbnQsIGJ1ZikgPT4ge1xuXHRcdC8vIGRlY29kZSBob3Jpem9udGFsIG1ldHJpY3Ncblx0XHQvLyBodHRwczovL2xlYXJuLm1pY3Jvc29mdC5jb20vZW4tdXMvdHlwb2dyYXBoeS9vcGVudHlwZS9zcGVjL2htdHhcblx0XHRjb25zdCBudW1iZXJPZkhNZXRyaWNzID0gZm9udC5oaGVhLm51bWJlck9mSE1ldHJpY3M7XG5cdFx0Y29uc3QgaG10eCA9IGZvbnQuaG10eCA9IFtdO1xuXHRcdGxldCBnPTA7XG5cdFx0d2hpbGUgKGc8bnVtYmVyT2ZITWV0cmljcykge1xuXHRcdFx0aG10eFtnKytdID0gYnVmLnUxNjtcblx0XHRcdGJ1Zi5zZWVrcigyKTsgLy8gc2tpcCBvdmVyIGxzYiwgd2Ugb25seSByZWNvcmQgYWR2YW5jZSB3aWR0aFxuXHRcdH1cblx0XHR3aGlsZSAoZzxmb250Lm1heHAubnVtR2x5cGhzKSB7XG5cdFx0XHRobXR4W2crK10gPSBobXR4W251bWJlck9mSE1ldHJpY3MtMV07XG5cdFx0fVxuXHR9LFxuXG5cdFwiSFZBUlwiOiAoZm9udCwgYnVmKSA9PiB7XG5cdFx0Ly8gaHR0cHM6Ly9sZWFybi5taWNyb3NvZnQuY29tL2VuLXVzL3R5cG9ncmFwaHkvb3BlbnR5cGUvc3BlYy9odmFyXG5cdFx0YnVmLnNlZWsoZm9udC5IVkFSLmFkdmFuY2VXaWR0aE1hcHBpbmdPZmZzZXQpO1xuXHRcdGZvbnQuSFZBUi5pbmRleE1hcCA9IGJ1Zi5kZWNvZGVJbmRleE1hcCgpO1xuXHR9LFxuXG5cdFwiTVZBUlwiOiAoZm9udCwgYnVmKSA9PiB7XG5cdFx0Ly8gZGVjb2RlIE1WQVIgdmFsdWUgcmVjb3Jkc1xuXHRcdC8vIGh0dHBzOi8vbGVhcm4ubWljcm9zb2Z0LmNvbS9lbi11cy90eXBvZ3JhcGh5L29wZW50eXBlL3NwZWMvbXZhclxuXHRcdGZvbnQuTVZBUi52YWx1ZVJlY29yZHMgPSB7fTtcblx0XHRmb3IgKGxldCB2PTA7IHY8Zm9udC5NVkFSLnZhbHVlUmVjb3JkQ291bnQ7IHYrKykge1xuXHRcdFx0YnVmLnNlZWsoMTIgKyB2ICogZm9udC5NVkFSLnZhbHVlUmVjb3JkU2l6ZSk7IC8vIHdlIGFyZSBkdXRpZnVsbHkgdXNpbmcgdmFsdWVSZWNvcmRTaXplIHRvIGNhbGN1bGF0ZSBvZmZzZXQsIGJ1dCBpdCBzaG91bGQgYWx3YXlzIGJlIDggYnl0ZXNcblx0XHRcdGZvbnQuTVZBUi52YWx1ZVJlY29yZHNbYnVmLnRhZ10gPSBbYnVmLnUxNiwgYnVmLnUxNl07IC8vIGRlbHRhU2V0T3V0ZXJJbmRleCwgZGVsdGFTZXRJbm5lckluZGV4XG5cdFx0fVxuXHR9LFxuXG5cdFwibmFtZVwiOiAoZm9udCwgYnVmKSA9PiB7XG5cdFx0Ly8gZGVjb2RlIG5hbWUgdGFibGUgc3RyaW5nc1xuXHRcdC8vIGh0dHBzOi8vbGVhcm4ubWljcm9zb2Z0LmNvbS9lbi11cy90eXBvZ3JhcGh5L29wZW50eXBlL3NwZWMvbmFtZVxuXHRcdGNvbnN0IG5hbWUgPSBmb250Lm5hbWU7IC8vIGZvbnQubmFtZSBpcyB0aGUgbmFtZSB0YWJsZSBpbmZvIGRpcmVjdGx5XG5cdFx0Zm9udC5uYW1lcyA9IFtdOyAvLyBmb250Lm5hbWVzIGlzIHRoZSBuYW1lcyByZWFkeSB0byB1c2UgYXMgVVRGOCBzdHJpbmdzLCBpbmRleGVkIGJ5IG5hbWVJRCBpbiB0aGUgYmVzdCBwbGF0Zm9ybUlEL2VuY29uZGluZ0lEL2xhbmd1YWdlSUQgbWF0Y2hcblx0XHRuYW1lLm5hbWVSZWNvcmRzID0gW107XG5cdFx0Zm9yIChsZXQgcj0wOyByPG5hbWUuY291bnQ7IHIrKykge1xuXHRcdFx0bmFtZS5uYW1lUmVjb3Jkcy5wdXNoKGJ1Zi5kZWNvZGUoRk9STUFUUy5OYW1lUmVjb3JkKSk7XG5cdFx0fVxuXHRcdG5hbWUubmFtZVJlY29yZHMuZm9yRWFjaChyZWNvcmQgPT4ge1xuXHRcdFx0YnVmLnNlZWsobmFtZS5zdG9yYWdlT2Zmc2V0ICsgcmVjb3JkLnN0cmluZ09mZnNldCk7XG5cdFx0XHRyZWNvcmQuc3RyaW5nID0gYnVmLmRlY29kZU5hbWVTdHJpbmcocmVjb3JkLmxlbmd0aCk7XG5cdFx0XHRpZiAocmVjb3JkLnBsYXRmb3JtSUQgPT0gMyAmJiByZWNvcmQuZW5jb2RpbmdJRCA9PSAxICYmIHJlY29yZC5sYW5ndWFnZUlEID09IDB4MDQwOSkge1xuXHRcdFx0XHRmb250Lm5hbWVzW3JlY29yZC5uYW1lSURdID0gcmVjb3JkLnN0cmluZzsgLy8gb25seSByZWNvcmQgMywgMSwgMHgwNDA5IGZvciBlYXN5IHVzZVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXG5cdFwidm10eFwiOiAoZm9udCwgYnVmKSA9PiB7XG5cdFx0Ly8gZGVjb2RlIHZlcnRpY2FsIG1ldHJpY3Ncblx0XHQvLyBodHRwczovL2xlYXJuLm1pY3Jvc29mdC5jb20vZW4tdXMvdHlwb2dyYXBoeS9vcGVudHlwZS9zcGVjL3ZtdHhcblx0XHRjb25zdCBudW1PZkxvbmdWZXJNZXRyaWNzID0gZm9udC52aGVhLm51bU9mTG9uZ1Zlck1ldHJpY3M7XG5cdFx0Y29uc3Qgdm10eCA9IGZvbnQudm10eCA9IFtdO1xuXHRcdGxldCBnPTA7XG5cdFx0d2hpbGUgKGc8bnVtT2ZMb25nVmVyTWV0cmljcykge1xuXHRcdFx0dm10eFtnKytdID0gYnVmLnUxNjtcblx0XHRcdGJ1Zi5zZWVrcigyKTsgLy8gc2tpcCBvdmVyIHRzYiwgd2Ugb25seSByZWNvcmQgYWR2YW5jZSBoZWlnaHRcblx0XHR9XG5cdFx0d2hpbGUgKGc8Zm9udC5tYXhwLm51bUdseXBocykge1xuXHRcdFx0dm10eFtnKytdID0gdm10eFtudW1PZkxvbmdWZXJNZXRyaWNzLTFdO1xuXHRcdH1cblx0fSxcbn1cblxuY29uc3QgU1ZHX1BSRUFNQkxFID0gYDxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjEwMDBcIiBoZWlnaHQ9XCIxMDAwXCI+XFxuPGRlZnM+PC9kZWZzPlxcbmA7IC8vIHdl4oCZbGwgcmVwbGFjZSA8ZGVmcz48L2RlZnM+IGxhdGVyIGlmIG5lY2Vzc2FyeVxuXG4vLyBub24tZXhwb3J0ZWQgZnVuY3Rpb25zXG5mdW5jdGlvbiBlbmRpYW5uZXNzIChzdHIpIHtcblx0Y29uc3QgYnVmID0gbmV3IEFycmF5QnVmZmVyKDIpO1xuXHRjb25zdCB0ZXN0QXJyYXkgPSBuZXcgVWludDE2QXJyYXkoYnVmKTtcblx0Y29uc3QgdGVzdERhdGFWaWV3ID0gbmV3IERhdGFWaWV3KGJ1Zik7XG5cdHRlc3RBcnJheVswXSA9IDB4MTIzNDsgLy8gTEUgb3IgQkVcblx0Y29uc3QgcmVzdWx0ID0gdGVzdERhdGFWaWV3LmdldFVpbnQxNigwKTsgLy8gQkVcblx0Y29uc3QgZW5kaWFubmVzcyA9IHJlc3VsdCA9PSAweDEyMzQgPyBcIkJFXCIgOiBcIkxFXCI7XG5cdHJldHVybiBzdHIgPT09IHVuZGVmaW5lZCA/IGVuZGlhbm5lc3MgOiBzdHIgPT0gZW5kaWFubmVzcztcbn1cblxuZnVuY3Rpb24gY2xhbXAgKG51bSwgbWluLCBtYXgpIHtcblx0aWYgKG51bSA8IG1pbilcblx0XHRudW0gPSBtaW47XG5cdGVsc2UgaWYgKG51bSA+IG1heClcblx0XHRudW0gPSBtYXg7XG5cdHJldHVybiBudW07XG59XG5cbmZ1bmN0aW9uIGluUmFuZ2UgKG51bSwgbWluLCBtYXgpIHtcblx0cmV0dXJuIG51bSA+PSBtaW4gJiYgbnVtIDw9IG1heDtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVUdXBsZSAodHVwbGUsIGF4aXNDb3VudCkge1xuXHRpZiAoIUFycmF5LmlzQXJyYXkodHVwbGUpKVxuXHRcdHJldHVybiBmYWxzZTtcblx0aWYgKHR1cGxlLmxlbmd0aCAhPSBheGlzQ291bnQpXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHRmb3IgKGxldCBhPTA7IGEgPCBheGlzQ291bnQ7IGErKykge1xuXHRcdCBpZiAodHlwZW9mIHR1cGxlW2FdICE9IFwibnVtYmVyXCIgfHwgIWluUmFuZ2UodHVwbGVbYV0sIC0xLCAxKSlcblx0XHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRyZXR1cm4gdHJ1ZTtcbn1cblxuLypcbi8vIHBhaW50IGEgZnVsbHkgZGVjb21wb3NlZCBDT0xSdjEgZ2x5cGhcbmZ1bmN0aW9uIHN2Z1BhaW50IChwYWludCkge1xuXG5cdFxuXG5cbn1cblxuLy8gb3V0cHV0IGEgZGlhZ3JhbW1hdGljIHJlcHJlc2VudGF0aW9uIG9mIGEgcGFpbnQgdHJlZVxuZnVuY3Rpb24gZGlhZ3JhbVBhaW50IChwYWludCkge1xuXG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NQYWludFNWRyAocGFpbnQsIHJlbmRlcmluZykge1xuXG5cdC8vIHJlY3Vyc2UgdW50aWwgd2UgYXJyaXZlIGF0IGEgUGFpbnRTb2xpZCBvciBQYWludEdyYWRpZW50XG5cdC8vIHRoZW4gY29uc3RydWN0IHRoZSBzdmdcblxuXHRpZiAocmVuZGVyaW5nLmRlcHRoKVxuXHRcdHJlbmRlcmluZy5kZXB0aCsrO1xuXHRlbHNlXG5cdFx0cmVuZGVyaW5nLmRlcHRoID0gMDtcblxuXHRpZiAocmVuZGVyaW5nLmRlcHRoID4gMTAwKSB7XG5cdFx0Y29uc29sZS5sb2coXCJyZW5kZXJpbmcgZGVwdGggPjEwMFwiKTtcblx0XHRjb25zb2xlLmxvZyhwYWludCk7XG5cdFx0Y29uc29sZS5sb2cocmVuZGVyaW5nKTtcblx0XHQvL3Byb2Nlc3MuZXhpdCgpO1xuXHR9XG5cblx0c3dpdGNoIChwYWludC50eXBlKSB7XG5cblx0XHRjYXNlIFBBSU5UX0xBWUVSUzoge1xuXHRcdFx0Zm9yIChsZXQgbD0wOyBsIDwgbGF5ZXJzLmxlbmd0aDsgbCsrKSB7XG5cdFx0XHRcdHByb2Nlc3NQYWludFNWRyhwYWludE5leHQsIHJlbmRlcmluZyk7XG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRjYXNlIFBBSU5UX0dMWVBIOiB7XG5cblx0XHRcdHByb2Nlc3NQYWludFNWRyhwYWludE5leHQsIHJlbmRlcmluZyk7XG5cdFx0fVxuXG5cdFx0Y2FzZSBQQUlOVF9UUkFOU0ZPUk06IHtcblx0XHRcdGxldCBzdHI7XG5cdFx0XHRzd2l0Y2ggKHRyYW5zZm9ybS50eXBlKSB7XG5cdFx0XHRcdGNhc2UgXCJyb3RhdGVcIjogXG5cdFx0XHRcdFx0c3RyID0gYHJvdGF0ZSgke3RyYW5zZm9ybS5hbmdsZX0gJHt0cmFuc2Zvcm0ueH0gJHt0cmFuc2Zvcm0ueX0pYDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdHByb2Nlc3NQYWludFNWRyhwYWludE5leHQsIHJlbmRlcmluZyk7XG5cdFx0fVxuXG5cdFx0Y2FzZSBQQUlOVF9DT01QT1NJVEU6IHtcblx0XHRcdHByb2Nlc3NQYWludFNWRyhwYWludE5leHQsIHJlbmRlcmluZyk7XG5cdFx0fVxuXG5cdFx0Y2FzZSBQQUlOVF9GSUxMOiB7XG5cdFx0XHRjb25zdCBzdmcgPSBcIlwiO1xuXG5cdFx0XHRpZiAocmVuZGVyaW5nLnRyYW5zZm9ybSkge1xuXHRcdFx0XHRyZW5kZXJpbmcudHJhbnNmb3JtLnNwbGl0KFwiIFwiKSAvLyB0aGlzIGNvbmNhdGVuYXRlcyBhbGwgdGhlIHRyYW5zZm9ybXMsIG1hdHJpeCwgcm90YXRlLCBza2V3LCB0cmFuc2xhdGVcblx0XG5cdFx0XHR9XG5cdFxuXHRcdFx0aWYgKHJlbmRlcmluZy5ncmFkaWVudCkge1xuXHRcblx0XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHsgLy8gcmVuZGVyaW5nIGZpbGxcblx0XG5cdFxuXHRcdFx0fVxuXHRcblx0XHRcdHJldHVybiBzdmc7XG5cdFxuXHRcdH1cblxuXHR9XG59XG5cbmZ1bmN0aW9uIGZpbmFsaXplU1ZHIChzdmdFbGVtZW50cywgZGVmcywgdHJhbnNmb3JtLCBzdHlsZSkge1xuXG5cdGxldCBzdmdTdHJpbmcgPSBTVkdfUFJFQU1CTEU7XG5cdGlmIChkZWZzLmxlbmd0aClcblx0XHRzdmdTdHJpbmcgKz0gXCI8ZGVmcz5cIiArIGRlZnMuam9pbigpICsgXCI8L2RlZnM+XCI7XG5cdHN2Z1N0cmluZyArPSAgc3ZnRWxlbWVudHM7XG5cdHN2Z1N0cmluZyArPSBcIjwvZz5cIjtcblx0cmV0dXJuIHN2Z1N0cmluZztcbn1cblxuY29uc3QgUEFJTlRfSEFORExFUlMgPSB7XG5cdC8vIGhhbmRsZXJzIGZvciB0ZXh0IG91dHB1dFxuXHR0ZXh0OiAocGFpbnQpID0+IHsgY29uc29sZS5sb2cocGFpbnQpOyBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTsgfSxcblxuXG5cdC8vIGhhbmRsZXJzIGZvciBTVkcgb3V0cHV0XG5cdHN2ZzogW1xuXHRcdG51bGwsIC8vIDAgKGRvZXMgbm90IGV4aXN0KVxuXG5cdFx0Ly8gMTogUGFpbnRDb2xyTGF5ZXJzXG5cdFx0KHBhaW50LCByZW5kZXJpbmcpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFpbnRDb2xyTGF5ZXJzXCIpO1xuXHRcdH0sXG5cdFx0XG5cdFx0Ly8gMjogUGFpbnRTb2xpZFxuXHRcdChwYWludCwgcmVuZGVyaW5nKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhaW50U29saWRcIik7XG5cdFx0fSxcblx0XHRudWxsLCAvLyAzOiBQYWludFZhclNvbGlkXG5cblx0XHQvLyA0OiBQYWludExpbmVhckdyYWRpZW50XG5cdFx0KHBhaW50LCByZW5kZXJpbmcpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFpbnRMaW5lYXJHcmFkaWVudFwiKTtcblx0XHR9LFxuXHRcdG51bGwsIC8vIDU6IFBhaW50VmFyTGluZWFyR3JhZGllbnRcblxuXHRcdC8vIDY6IFBhaW50UmFkaWFsR3JhZGllbnRcblx0XHQocGFpbnQsIHJlbmRlcmluZykgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coXCJQYWludFJhZGlhbEdyYWRpZW50XCIpO1xuXHRcdH0sXG5cdFx0bnVsbCwgLy8gNzogUGFpbnRWYXJSYWRpYWxHcmFkaWVudFxuXG5cdFx0Ly8gODogUGFpbnRTd2VlcEdyYWRpZW50XG5cdFx0KHBhaW50LCByZW5kZXJpbmcpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFpbnRTd2VlcEdyYWRpZW50XCIpO1xuXHRcdH0sXG5cdFx0bnVsbCwgLy8gOTogUGFpbnRWYXJTd2VlcEdyYWRpZW50XG5cblx0XHQvLyAxMDogUGFpbnRHbHlwaFxuXHRcdChwYWludCwgcmVuZGVyaW5nKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhaW50R2x5cGhcIik7XG5cdFx0fSxcblxuXHRcdC8vIDExOiBQYWludENvbHJHbHlwaFxuXHRcdChwYWludCwgcmVuZGVyaW5nKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhaW50Q29sckdseXBoXCIpO1xuXHRcdH0sXG5cblx0XHQvLyAxMiA6IFBhaW50VHJhbnNmb3JtXG5cdFx0KHBhaW50LCByZW5kZXJpbmcpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFpbnRTd2VlcEdyYWRpZW50XCIpO1xuXHRcdH0sXG5cdFx0bnVsbCwgLy8gMTM6IFBhaW50VmFyVHJhbnNmb3JtXG5cblx0XHQvLyAxNCA6IFBhaW50VHJhbnNsYXRlXG5cdFx0KHBhaW50LCByZW5kZXJpbmcpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFpbnRUcmFuc2xhdGVcIik7XG5cdFx0fSxcblx0XHRudWxsLCAvLyAxNTogUGFpbnRWYXJUcmFuc2xhdGVcblxuXHRcdC8vIDE2OiBQYWludFNjYWxlXG5cdFx0KHBhaW50LCByZW5kZXJpbmcpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFpbnRTY2FsZVwiKTtcblx0XHR9LFxuXHRcdG51bGwsIC8vIDE3OiBQYWludFZhclNjYWxlXG5cdFx0bnVsbCwgLy8gMTg6IFBhaW50U2NhbGVBcm91bmRDZW50ZXJcblx0XHRudWxsLCAvLyAxOTogUGFpbnRWYXJTY2FsZUFyb3VuZENlbnRlclxuXHRcdG51bGwsIC8vIDIwOiBQYWludFNjYWxlVW5pZm9ybVxuXHRcdG51bGwsIC8vIDIxOiBQYWludFZhclNjYWxlVW5pZm9ybVxuXHRcdG51bGwsIC8vIDIyOiBQYWludFNjYWxlVW5pZm9ybUFyb3VuZENlbnRlclxuXHRcdG51bGwsIC8vIDIzOiBQYWludFZhclNjYWxlVW5pZm9ybUFyb3VuZENlbnRlclxuXG5cdFx0Ly8gMjQ6IFBhaW50Um90YXRlXG5cdFx0KHBhaW50LCByZW5kZXJpbmcpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFpbnRSb3RhdGVcIik7XG5cdFx0fSxcblx0XHRudWxsLCAvLyAyNTogUGFpbnRWYXJSb3RhdGVcblx0XHRudWxsLCAvLyAyNjogUGFpbnRSb3RhdGVBcm91bmRDZW50ZXJcblx0XHRudWxsLCAvLyAyNzogUGFpbnRWYXJSb3RhdGVBcm91bmRDZW50ZXJcblxuXHRcdC8vIDI4OiBQYWludFNrZXdcblx0XHQocGFpbnQsIHJlbmRlcmluZykgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coXCJQYWludFNrZXdcIik7XG5cdFx0fSxcblx0XHRudWxsLCAvLyAyOTogUGFpbnRWYXJTa2V3XG5cdFx0bnVsbCwgLy8gMzA6IFBhaW50U2tld0Fyb3VuZENlbnRlciwgUGFpbnRWYXJTa2V3QXJvdW5kQ2VudGVyXG5cdFx0bnVsbCwgLy8gMzE6IFBhaW50U2tld0Fyb3VuZENlbnRlciwgUGFpbnRWYXJTa2V3QXJvdW5kQ2VudGVyXG5cblx0XHQvLyAzMjogUGFpbnRDb21wb3NpdGVcblx0XHQocGFpbnQsIHJlbmRlcmluZykgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coXCJQYWludENvbXBvc2l0ZVwiKTtcblx0XHR9LFxuXHRdLFxuXG5cblx0Ly8gaGFuZGxlcnMgZm9yIFNWRyBvdXRwdXRcblx0X3N2ZzogW1xuXHRcdG51bGwsIC8vIDAgKGRvZXMgbm90IGV4aXN0KVxuXG5cdFx0Ly8gMTogUGFpbnRDb2xyTGF5ZXJzXG5cdFx0KHBhaW50LCByZW5kZXJpbmcpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFpbnRDb2xyTGF5ZXJzXCIpO1xuXHRcdH0sXG5cdFx0XG5cdFx0Ly8gMjogUGFpbnRTb2xpZFxuXHRcdChwYWludCwgcmVuZGVyaW5nKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhaW50U29saWRcIik7XG5cdFx0fSxcblx0XHRudWxsLCAvLyAzOiBQYWludFZhclNvbGlkXG5cblx0XHQvLyA0OiBQYWludExpbmVhckdyYWRpZW50XG5cdFx0KHBhaW50LCByZW5kZXJpbmcpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFpbnRMaW5lYXJHcmFkaWVudFwiKTtcblx0XHR9LFxuXHRcdG51bGwsIC8vIDU6IFBhaW50VmFyTGluZWFyR3JhZGllbnRcblxuXHRcdC8vIDY6IFBhaW50UmFkaWFsR3JhZGllbnRcblx0XHQocGFpbnQsIHJlbmRlcmluZykgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coXCJQYWludFJhZGlhbEdyYWRpZW50XCIpO1xuXHRcdH0sXG5cdFx0bnVsbCwgLy8gNzogUGFpbnRWYXJSYWRpYWxHcmFkaWVudFxuXG5cdFx0Ly8gODogUGFpbnRTd2VlcEdyYWRpZW50XG5cdFx0KHBhaW50LCByZW5kZXJpbmcpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFpbnRTd2VlcEdyYWRpZW50XCIpO1xuXHRcdH0sXG5cdFx0bnVsbCwgLy8gOTogUGFpbnRWYXJTd2VlcEdyYWRpZW50XG5cblx0XHQvLyAxMDogUGFpbnRHbHlwaFxuXHRcdChwYWludCwgcmVuZGVyaW5nKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhaW50R2x5cGhcIik7XG5cdFx0fSxcblxuXHRcdC8vIDExOiBQYWludENvbHJHbHlwaFxuXHRcdChwYWludCwgcmVuZGVyaW5nKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhaW50Q29sckdseXBoXCIpO1xuXHRcdH0sXG5cblx0XHQvLyAxMiA6IFBhaW50VHJhbnNmb3JtXG5cdFx0KHBhaW50LCByZW5kZXJpbmcpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFpbnRTd2VlcEdyYWRpZW50XCIpO1xuXHRcdH0sXG5cdFx0bnVsbCwgLy8gMTM6IFBhaW50VmFyVHJhbnNmb3JtXG5cblx0XHQvLyAxNCA6IFBhaW50VHJhbnNsYXRlXG5cdFx0KHBhaW50LCByZW5kZXJpbmcpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFpbnRUcmFuc2xhdGVcIik7XG5cdFx0fSxcblx0XHRudWxsLCAvLyAxNTogUGFpbnRWYXJUcmFuc2xhdGVcblxuXHRcdC8vIDE2OiBQYWludFNjYWxlXG5cdFx0KHBhaW50LCByZW5kZXJpbmcpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFpbnRTY2FsZVwiKTtcblx0XHR9LFxuXHRcdG51bGwsIC8vIDE3OiBQYWludFZhclNjYWxlXG5cdFx0bnVsbCwgLy8gMTg6IFBhaW50U2NhbGVBcm91bmRDZW50ZXJcblx0XHRudWxsLCAvLyAxOTogUGFpbnRWYXJTY2FsZUFyb3VuZENlbnRlclxuXHRcdG51bGwsIC8vIDIwOiBQYWludFNjYWxlVW5pZm9ybVxuXHRcdG51bGwsIC8vIDIxOiBQYWludFZhclNjYWxlVW5pZm9ybVxuXHRcdG51bGwsIC8vIDIyOiBQYWludFNjYWxlVW5pZm9ybUFyb3VuZENlbnRlclxuXHRcdG51bGwsIC8vIDIzOiBQYWludFZhclNjYWxlVW5pZm9ybUFyb3VuZENlbnRlclxuXG5cdFx0Ly8gMjQ6IFBhaW50Um90YXRlXG5cdFx0KHBhaW50LCByZW5kZXJpbmcpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFpbnRSb3RhdGVcIik7XG5cdFx0fSxcblx0XHRudWxsLCAvLyAyNTogUGFpbnRWYXJSb3RhdGVcblx0XHRudWxsLCAvLyAyNjogUGFpbnRSb3RhdGVBcm91bmRDZW50ZXJcblx0XHRudWxsLCAvLyAyNzogUGFpbnRWYXJSb3RhdGVBcm91bmRDZW50ZXJcblxuXHRcdC8vIDI4OiBQYWludFNrZXdcblx0XHQocGFpbnQsIHJlbmRlcmluZykgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coXCJQYWludFNrZXdcIik7XG5cdFx0fSxcblx0XHRudWxsLCAvLyAyOTogUGFpbnRWYXJTa2V3XG5cdFx0bnVsbCwgLy8gMzA6IFBhaW50U2tld0Fyb3VuZENlbnRlciwgUGFpbnRWYXJTa2V3QXJvdW5kQ2VudGVyXG5cdFx0bnVsbCwgLy8gMzE6IFBhaW50U2tld0Fyb3VuZENlbnRlciwgUGFpbnRWYXJTa2V3QXJvdW5kQ2VudGVyXG5cblx0XHQvLyAzMjogUGFpbnRDb21wb3NpdGVcblx0XHQocGFpbnQsIHJlbmRlcmluZykgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2coXCJQYWludENvbXBvc2l0ZVwiKTtcblx0XHR9LFxuXHRdLFxufTtcbk9iamVjdC5rZXlzKFBBSU5UX0hBTkRMRVJTKS5mb3JFYWNoKGtleSA9PiB7XG5cblx0bGV0IGxhc3ROb25OdWxsSGFuZGxlciA9IG51bGw7XG5cdGZvciAobGV0IGg9MTsgaDxQQUlOVF9IQU5ETEVSU1trZXldLmxlbmd0aDsgaCsrKSB7IC8vIHNraXAgdGhlIGZpcnN0IGVudHJ5LCB3aGljaCBpcyBhbHdheXMgbnVsbFxuXHRcdGlmIChQQUlOVF9IQU5ETEVSU1trZXldW2hdKSB7XG5cdFx0XHRsYXN0Tm9uTnVsbEhhbmRsZXIgPSBQQUlOVF9IQU5ETEVSU1trZXldW2hdO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdFBBSU5UX0hBTkRMRVJTW2tleV1baF0gPSBsYXN0Tm9uTnVsbEhhbmRsZXI7XG5cdFx0fVx0XG5cdH1cbn0pO1xuKi9cblxuXG4vLyBTYW1zYUJ1ZmZlciBpcyBhIERhdGFWaWV3IHN1YmNsYXNzLCBjb25zdHJ1Y3RlZCBmcm9tIGFuIEFycmF5QnVmZmVyIGluIGV4YWN0bHkgdGhlIHNhbWUgd2F5IGFzIERhdGFWaWV3XG4vLyAtIHRoZSBtYWluIGRpZmZlcmVuY2UgaXMgdGhhdCBpdCBrZWVwcyB0cmFjayBvZiBhIG1lbW9yeSBwb2ludGVyLCB3aGljaCBpcyBpbmNyZW1lbnRlZCBvbiByZWFkL3dyaXRlXG4vLyAtIHdlIGFsc28ga2VlcCB0cmFjayBvZiBhIHBoYXNlLCB3aGljaCBpcyB1c2VkIGZvciBuaWJibGUgcmVhZHMvd3JpdGVzXG4vLyAtIHRoZXJlIGFyZSBudW1lcm91cyBkZWNvZGUvZW5jb2RlIG1ldGhvZHMgZm9yIGNvbnZlcnRpbmcgY29tcGxleCBkYXRhIHN0cnVjdHVyZXMgdG8gYW5kIGZyb20gYmluYXJ5XG5jbGFzcyBTYW1zYUJ1ZmZlciBleHRlbmRzIERhdGFWaWV3IHtcblx0XG5cdGNvbnN0cnVjdG9yKGJ1ZmZlciwgYnl0ZU9mZnNldCwgYnl0ZUxlbmd0aCkge1xuXHRcdHN1cGVyKGJ1ZmZlciwgYnl0ZU9mZnNldCwgYnl0ZUxlbmd0aCk7XG5cdFx0dGhpcy5wID0gMDsgLy8gdGhlIG1lbW9yeSBwb2ludGVyXG5cdFx0dGhpcy5waGFzZSA9IGZhbHNlOyAvLyBwaGFzZSBmb3IgbmliYmxlc1xuXG5cdFx0dGhpcy5nZXR0ZXJzID0gW107XG5cdFx0dGhpcy5nZXR0ZXJzW1U0XSA9ICgpID0+IHRoaXMudTQ7XG5cdFx0dGhpcy5nZXR0ZXJzW1U4XSA9ICgpID0+IHRoaXMudTg7XG5cdFx0dGhpcy5nZXR0ZXJzW0k4XSA9ICgpID0+IHRoaXMuaTg7XG5cdFx0dGhpcy5nZXR0ZXJzW1UxNl0gPSAoKSA9PiB0aGlzLnUxNjtcblx0XHR0aGlzLmdldHRlcnNbSTE2XSA9ICgpID0+IHRoaXMuaTE2O1xuXHRcdHRoaXMuZ2V0dGVyc1tVMjRdID0gKCkgPT4gdGhpcy51MjQ7XG5cdFx0dGhpcy5nZXR0ZXJzW0kyNF0gPSAoKSA9PiB0aGlzLmkyNDtcblx0XHR0aGlzLmdldHRlcnNbVTMyXSA9ICgpID0+IHRoaXMudTMyO1xuXHRcdHRoaXMuZ2V0dGVyc1tJMzJdID0gKCkgPT4gdGhpcy5pMzI7XG5cdFx0dGhpcy5nZXR0ZXJzW1U2NF0gPSAoKSA9PiB0aGlzLnU2NDtcblx0XHR0aGlzLmdldHRlcnNbSTY0XSA9ICgpID0+IHRoaXMuaTY0O1xuXHRcdHRoaXMuZ2V0dGVyc1tGMjE0XSA9ICgpID0+IHRoaXMuZjIxNDtcblx0XHR0aGlzLmdldHRlcnNbRjE2MTZdID0gKCkgPT4gdGhpcy5mMTYxNjtcblx0XHR0aGlzLmdldHRlcnNbVEFHXSA9ICgpID0+IHRoaXMudGFnO1xuXHRcdHRoaXMuZ2V0dGVyc1tTVFJdID0gKCkgPT4gdGhpcy50YWc7XG5cblx0XHR0aGlzLnNldHRlcnMgPSBbXTtcblx0XHR0aGlzLnNldHRlcnNbVTRdID0gbiA9PiB0aGlzLnU0ID0gbjtcblx0XHR0aGlzLnNldHRlcnNbVThdID0gbiA9PiB0aGlzLnU4ID0gbjtcblx0XHR0aGlzLnNldHRlcnNbSThdID0gbiA9PiB0aGlzLmk4ID0gbjtcblx0XHR0aGlzLnNldHRlcnNbVTE2XSA9IG4gPT4gdGhpcy51MTYgPSBuO1xuXHRcdHRoaXMuc2V0dGVyc1tJMTZdID0gbiA9PiB0aGlzLmkxNiA9IG47XG5cdFx0dGhpcy5zZXR0ZXJzW1UyNF0gPSBuID0+IHRoaXMudTI0ID0gbjtcblx0XHR0aGlzLnNldHRlcnNbSTI0XSA9IG4gPT4gdGhpcy5pMjQgPSBuO1xuXHRcdHRoaXMuc2V0dGVyc1tVMzJdID0gbiA9PiB0aGlzLnUzMiA9IG47XG5cdFx0dGhpcy5zZXR0ZXJzW0kzMl0gPSBuID0+IHRoaXMuaTMyID0gbjtcblx0XHR0aGlzLnNldHRlcnNbVTY0XSA9IG4gPT4gdGhpcy51NjQgPSBuO1xuXHRcdHRoaXMuc2V0dGVyc1tJNjRdID0gbiA9PiB0aGlzLmk2NCA9IG47XG5cdFx0dGhpcy5zZXR0ZXJzW0YyMTRdID0gbiA9PiB0aGlzLmYyMTQgPSBuO1xuXHRcdHRoaXMuc2V0dGVyc1tGMTYxNl0gPSBuID0+IHRoaXMuZjE2MTYgPSBuO1xuXHRcdHRoaXMuc2V0dGVyc1tUQUddID0gbiA9PiB0aGlzLnRhZyA9IG47XG5cdFx0dGhpcy5zZXR0ZXJzW1NUUl0gPSBuID0+IHRoaXMudGFnID0gbjtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0Ly8gZ2V0IGN1cnJlbnQgcG9zaXRpb25cblx0dGVsbCgpIHtcblx0XHRyZXR1cm4gdGhpcy5wO1xuXHR9XG5cblx0Ly8gc2VlayB0byBhYnNvbHV0ZSBwb3NpdGlvblxuXHRzZWVrKHApIHtcblx0XHR0aGlzLnAgPSBwO1xuXHR9XG5cblx0Ly8gc2VlayB0byByZWxhdGl2ZSBwb3NpdGlvblxuXHRzZWVrcihwKSB7XG5cdFx0dGhpcy5wICs9IHA7XG5cdH1cblxuXHQvLyB2YWxpZGF0ZSBvZmZzZXRcblx0c2Vla1ZhbGlkKHApIHtcblx0XHRyZXR1cm4gcCA+PSAwICYmIHAgPCB0aGlzLmJ5dGVMZW5ndGg7XG5cdH1cblxuXHQvLyB1aW50NjQsIGludDY0XG5cdHNldCB1NjQobnVtKSB7XG5cdFx0dGhpcy5zZXRVaW50MzIodGhpcy5wLCBudW0gPj4gMzIpO1xuXHRcdHRoaXMuc2V0VWludDMyKHRoaXMucCs0LCBudW0gJiAweGZmZmZmZmZmKTtcblx0XHR0aGlzLnAgKz0gODtcblx0fVxuXG5cdGdldCB1NjQoKSB7XG5cdFx0Y29uc3QgcmV0ID0gKHRoaXMuZ2V0VWludDMyKHRoaXMucCkgPDwgMzIpICsgdGhpcy5nZXRVaW50MzIodGhpcy5wKzQpO1xuXHRcdHRoaXMucCArPSA4O1xuXHRcdHJldHVybiByZXQ7XG5cdH1cblxuXHRzZXQgaTY0KG51bSkge1xuXHRcdHRoaXMuc2V0VWludDMyKHRoaXMucCwgbnVtID4+IDMyKTtcblx0XHR0aGlzLnNldFVpbnQzMih0aGlzLnArNCwgbnVtICYgMHhmZmZmZmZmZik7XG5cdFx0dGhpcy5wICs9IDg7XG5cdH1cblxuXHRnZXQgaTY0KCkge1xuXHRcdGNvbnN0IHJldCA9ICh0aGlzLmdldFVpbnQzMih0aGlzLnApIDw8IDMyKSArIHRoaXMuZ2V0VWludDMyKHRoaXMucCs0KTtcblx0XHR0aGlzLnAgKz0gODtcblx0XHRyZXR1cm4gcmV0O1xuXHR9XG5cblx0Ly8gdWludDMyLCBpbnQzMiwgZjE2ZG90MTZcblx0c2V0IHUzMihudW0pIHtcblx0XHR0aGlzLnNldFVpbnQzMih0aGlzLnAsIG51bSk7XG5cdFx0dGhpcy5wICs9IDQ7XG5cdH1cblxuXHRnZXQgdTMyKCkge1xuXHRcdGNvbnN0IHJldCA9IHRoaXMuZ2V0VWludDMyKHRoaXMucCk7XG5cdFx0dGhpcy5wICs9IDQ7XG5cdFx0cmV0dXJuIHJldDtcblx0fVxuXG5cdHNldCBpMzIobnVtKSB7XG5cdFx0dGhpcy5zZXRJbnQzMih0aGlzLnAsIG51bSk7XG5cdFx0dGhpcy5wICs9IDQ7XG5cdH1cblxuXHRnZXQgaTMyKCkge1xuXHRcdGNvbnN0IHJldCA9IHRoaXMuZ2V0SW50MzIodGhpcy5wKTtcblx0XHR0aGlzLnAgKz0gNDtcblx0XHRyZXR1cm4gcmV0O1xuXHR9XG5cblx0c2V0IGYxNjE2KG51bSkge1xuXHRcdHRoaXMuc2V0SW50MzIodGhpcy5wLCBudW0gKiAweDEwMDAwKTtcblx0XHR0aGlzLnAgKz0gNDtcblx0fVxuXG5cdGdldCBmMTYxNigpIHtcblx0XHRjb25zdCByZXQgPSB0aGlzLmdldEludDMyKHRoaXMucCkgLyAweDEwMDAwO1xuXHRcdHRoaXMucCArPSA0O1xuXHRcdHJldHVybiByZXQ7XG5cdH1cblxuXHQvLyB1aW50MjQsIGludDI0XG5cdHNldCB1MjQobnVtKSB7XG5cdFx0dGhpcy5zZXRVaW50MTYodGhpcy5wLCBudW0gPj4gOCk7XG5cdFx0dGhpcy5zZXRVaW50OCh0aGlzLnArMiwgbnVtICYgMHhmZik7XG5cdFx0dGhpcy5wICs9IDM7XG5cdH1cblxuXHRnZXQgdTI0KCkge1xuXHRcdGNvbnN0IHJldCA9ICh0aGlzLmdldFVpbnQxNih0aGlzLnApIDw8IDgpICsgdGhpcy5nZXRVaW50OCh0aGlzLnArMik7XG5cdFx0dGhpcy5wICs9IDM7XG5cdFx0cmV0dXJuIHJldDtcblx0fVxuXG5cdHNldCBpMjQobnVtKSB7XG5cdFx0dGhpcy5zZXRVaW50MTYodGhpcy5wLCBudW0gPj4gOCk7XG5cdFx0dGhpcy5zZXRVaW50OCh0aGlzLnArMiwgbnVtICYgMHhmZik7XG5cdFx0dGhpcy5wICs9IDM7XG5cdH1cblxuXHRnZXQgaTI0KCkge1xuXHRcdGNvbnN0IHJldCA9ICh0aGlzLmdldEludDE2KHRoaXMucCkgKiAyNTYpICsgdGhpcy5nZXRVaW50OCh0aGlzLnArMik7XG5cdFx0dGhpcy5wICs9IDM7XG5cdFx0cmV0dXJuIHJldDtcblx0fVxuXG5cdC8vIHVpbnQxNiwgaW50MTYsIGYyZG90MTRcblx0c2V0IHUxNihudW0pIHtcblx0XHR0aGlzLnNldFVpbnQxNih0aGlzLnAsIG51bSk7XG5cdFx0dGhpcy5wICs9IDI7XG5cdH1cblxuXHRnZXQgdTE2KCkge1xuXHRcdGNvbnN0IHJldCA9IHRoaXMuZ2V0VWludDE2KHRoaXMucCk7XG5cdFx0dGhpcy5wICs9IDI7XG5cdFx0cmV0dXJuIHJldDtcblx0fVxuXG5cdHNldCB1MTZfMjU1KG51bSkge1xuXHRcdGNvbnN0IG9uZU1vcmVCeXRlQ29kZTEgICAgPSAyNTU7XG5cdFx0Y29uc3Qgb25lTW9yZUJ5dGVDb2RlMiAgICA9IDI1NDtcblx0XHRjb25zdCB3b3JkQ29kZSAgICAgICAgICAgID0gMjUzO1xuXHRcdGNvbnN0IGxvd2VzdFVDb2RlICAgICAgICAgPSAyNTM7XG5cdFx0aWYgKG51bSA8IDI1Mykge1xuXHRcdFx0dGhpcy51OCA9IG51bTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAobnVtIDwgNTA2KSB7XG5cdFx0XHR0aGlzLnU4ID0gb25lTW9yZUJ5dGVDb2RlMTtcblx0XHRcdHRoaXMudTggPSBudW0gLSBsb3dlc3RVQ29kZTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAobnVtIDwgNzU5KSB7XG5cdFx0XHR0aGlzLnU4ID0gb25lTW9yZUJ5dGVDb2RlMjtcblx0XHRcdHRoaXMudTggPSBudW0gLSBsb3dlc3RVQ29kZSAqIDI7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGhpcy51OCA9IHdvcmRDb2RlO1xuXHRcdFx0dGhpcy51MTYgPSBudW07XG5cdFx0fVxuXHR9XG5cblx0Z2V0IHUxNl8yNTUoKSB7XG5cdFx0Ly8gaHR0cHM6Ly93d3cudzMub3JnL1RSL1dPRkYyLyNnbHlmX3RhYmxlX2Zvcm1hdFxuXHRcdGNvbnN0IG9uZU1vcmVCeXRlQ29kZTEgICAgPSAyNTU7XG5cdFx0Y29uc3Qgb25lTW9yZUJ5dGVDb2RlMiAgICA9IDI1NDtcblx0XHRjb25zdCB3b3JkQ29kZSAgICAgICAgICAgID0gMjUzO1xuXHRcdGNvbnN0IGxvd2VzdFVDb2RlICAgICAgICAgPSAyNTM7XG5cdFx0bGV0IHZhbHVlLCB2YWx1ZTI7XG5cblx0XHRjb25zdCBjb2RlID0gdGhpcy51ODtcblx0XHRpZiAoY29kZSA9PSB3b3JkQ29kZSkge1xuXHRcdFx0dmFsdWUgPSB0aGlzLnU4O1xuXHRcdFx0dmFsdWUgPDw9IDg7XG5cdFx0XHR2YWx1ZSB8PSB0aGlzLnU4O1xuXHRcdH1cblx0XHRlbHNlIGlmIChjb2RlID09IG9uZU1vcmVCeXRlQ29kZTEpICB7XG5cdFx0XHR2YWx1ZSA9IHRoaXMudTggKyBsb3dlc3RVQ29kZTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoY29kZSA9PSBvbmVNb3JlQnl0ZUNvZGUyKSB7XG5cdFx0XHR2YWx1ZSA9IHRoaXMudTggKyBsb3dlc3RVQ29kZSoyO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHZhbHVlID0gY29kZTtcblx0XHR9XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH1cblxuXHRzZXQgaTE2KG51bSkge1xuXHRcdHRoaXMuc2V0SW50MTYodGhpcy5wLCBudW0pO1xuXHRcdHRoaXMucCArPSAyO1xuXHR9XG5cblx0Z2V0IGkxNigpIHtcblx0XHRjb25zdCByZXQgPSB0aGlzLmdldEludDE2KHRoaXMucCk7XG5cdFx0dGhpcy5wICs9IDI7XG5cdFx0cmV0dXJuIHJldDtcblx0fVxuXG5cdHNldCBmMjE0KG51bSkge1xuXHRcdHRoaXMuc2V0SW50MTYodGhpcy5wLCBudW0gKiAweDQwMDApO1xuXHRcdHRoaXMucCArPSAyO1xuXHR9XG5cblx0Z2V0IGYyMTQoKSB7XG5cdFx0Y29uc3QgcmV0ID0gdGhpcy5nZXRJbnQxNih0aGlzLnApIC8gMHg0MDAwO1xuXHRcdHRoaXMucCArPSAyO1xuXHRcdHJldHVybiByZXQ7XG5cdH1cblxuXHQvLyB1aW50OCwgaW50OFxuXHRzZXQgdTgobnVtKSB7XG5cdFx0dGhpcy5zZXRVaW50OCh0aGlzLnArKywgbnVtKTtcblx0fVxuXG5cdGdldCB1OCgpIHtcblx0XHRyZXR1cm4gdGhpcy5nZXRVaW50OCh0aGlzLnArKyk7XG5cdH1cblxuXHRzZXQgaTgobnVtKSB7XG5cdFx0dGhpcy5zZXRJbnQ4KHRoaXMucCsrLCBudW0pO1xuXHR9XG5cblx0Z2V0IGk4KCkge1xuXHRcdHJldHVybiB0aGlzLmdldEludDgodGhpcy5wKyspO1xuXHR9XG5cblx0Ly8gdTQgKG5pYmJsZSlcblx0c2V0IHU0KG51bSkge1xuXHRcdC8vIG5vdGUgdGhhdCB3cml0aW5nIHRoZSBoaWdoIG5pYmJsZSBkb2VzIG5vdCB6ZXJvIHRoZSBsb3cgbmliYmxlXG5cdFx0Y29uc3QgYnl0ZSA9IHRoaXMuZ2V0VWludDgodGhpcy5wKTtcblx0XHRpZiAodGhpcy5waGFzZSkge1xuXHRcdFx0dGhpcy5zZXRVaW50OCh0aGlzLnArKywgKGJ5dGUgJiAweGYwKSB8IChudW0gJiAweDBmKSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGhpcy5zZXRVaW50OCh0aGlzLnAsIChieXRlICYgMHgwZikgfCAobnVtIDw8IDQpKTtcblx0XHR9XG5cdFx0dGhpcy5waGFzZSA9ICF0aGlzLnBoYXNlO1xuXHR9XG5cblx0Z2V0IHU0KCkge1xuXHRcdGNvbnN0IGJ5dGUgPSB0aGlzLmdldFVpbnQ4KHRoaXMucCk7XG5cdFx0dGhpcy5waGFzZSA9ICF0aGlzLnBoYXNlO1xuXHRcdGlmICh0aGlzLnBoYXNlKSB7XG5cdFx0XHRyZXR1cm4gKGJ5dGUgJiAweGYwKSA+PiA0O1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoaXMucCsrO1xuXHRcdFx0cmV0dXJuIGJ5dGUgJiAweDBmO1xuXHRcdH1cblx0fVxuXG5cdC8vIHRhZ1xuXHRzZXQgdGFnKHN0cikge1xuXHRcdGxldCBsZW5ndGggPSA0O1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcblx0XHRcdHRoaXMuc2V0VWludDgodGhpcy5wKyssIHN0ci5jaGFyQ29kZUF0KGkpKTtcblx0XHR9XG5cdH1cblxuXHRnZXQgdGFnKCkge1xuXHRcdGxldCByZXQgPSBcIlwiO1xuXHRcdGxldCBsZW5ndGggPSA0O1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcblx0XHRcdHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHRoaXMuZ2V0VWludDgodGhpcy5wKyspKTtcblx0XHR9XG5cdFx0cmV0dXJuIHJldDtcblx0fVxuXG5cdGNvbXBhcmUoY29uZGl0aW9uKSB7XG5cdFx0Y29uc3QgW2EsIGNvbXBhcmlzb24sIGJdID0gY29uZGl0aW9uO1xuXHRcdHN3aXRjaCAoY29tcGFyaXNvbikge1xuXHRcdFx0Y2FzZSBcIj49XCI6IHJldHVybiBhID49IGI7XG5cdFx0XHRjYXNlIFwiPD1cIjogcmV0dXJuIGEgPD0gYjtcblx0XHRcdGNhc2UgXCI9PVwiOiByZXR1cm4gYSA9PSBiO1xuXHRcdFx0Y2FzZSBcIjxcIjogcmV0dXJuIGEgPCBiO1xuXHRcdFx0Y2FzZSBcIj5cIjogcmV0dXJuIGEgPiBiO1xuXHRcdFx0Y2FzZSBcIiE9XCI6IHJldHVybiBhICE9IGI7XG5cdFx0fVxuXHR9XG5cblx0Y2hlY2tTdW0ob2Zmc2V0PTAsIGxlbmd0aCwgaGVhZFRhYmxlKSB7XG5cdFx0aWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRsZW5ndGggPSB0aGlzLmJ5dGVMZW5ndGggLSBvZmZzZXQ7XG5cdFx0fVxuXHRcdGNvbnN0IHBTYXZlZCA9IHRoaXMudGVsbCgpO1xuXHRcdGNvbnN0IG1haW5MZW5ndGggPSA0ICogTWF0aC5mbG9vcihsZW5ndGgvNCk7XG5cdFx0bGV0IHN1bSA9IDA7XG5cdFx0dGhpcy5zZWVrKG9mZnNldCk7XG5cblx0XHQvLyBzdW0gdGhlIGVudGlyZSB0YWJsZSBleGNlcHQgYW55IHRyYWlsaW5nIGJ5dGVzIHRoYXQgYXJlIG5vdCBhIG11bHRpcGxlIG9mIDRcblx0XHRpZiAoIWhlYWRUYWJsZSkge1xuXHRcdFx0Ly8gdGhpcyBpcyBub3QgdGhlIGhlYWQgdGFibGUgOilcblx0XHRcdHdoaWxlICh0aGlzLnAgPCBvZmZzZXQgKyBtYWluTGVuZ3RoKSB7XG5cdFx0XHRcdHN1bSArPSB0aGlzLnUzMjtcblx0XHRcdFx0c3VtICY9IDB4ZmZmZmZmZmY7XG5cdFx0XHRcdHN1bSA+Pj49IDA7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0Ly8gc3BlY2lhbCBoYW5kbGluZyBmb3IgaGVhZCB0YWJsZTogIHNraXAgb3ZlciB0aGUgY2hlY2tzdW1BZGp1c3RtZW50IGZpZWxkXG5cdFx0XHR3aGlsZSAodGhpcy5wIDwgb2Zmc2V0ICsgbWFpbkxlbmd0aCkge1xuXHRcdFx0XHRpZiAodGhpcy5wIC0gb2Zmc2V0ID09PSA4KSB7XG5cdFx0XHRcdFx0dGhpcy5wICs9IDQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0c3VtICs9IHRoaXMudTMyO1xuXHRcdFx0XHRcdHN1bSAmPSAweGZmZmZmZmZmO1xuXHRcdFx0XHRcdHN1bSA+Pj49IDA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBzdW0gYW55IHRyYWlsaW5nIGJ5dGVzXG5cdFx0d2hpbGUgKHRoaXMucCA8IG9mZnNldCArIGxlbmd0aCkge1xuXHRcdFx0Y29uc3Qgc2hpZnQgPSAoMyAtICh0aGlzLnAgLSBvZmZzZXQpICUgNCkgKiA4O1xuXHRcdFx0c3VtICs9IHRoaXMudTggPDwgc2hpZnQ7XG5cdFx0XHRzdW0gPj4+PSAwO1xuXHRcdH1cblxuXHRcdHN1bSAmPSAweGZmZmZmZmZmOyAvLyB1bm5lY2Vzc2FyeT9cblx0XHRzdW0gPj4+PSAwOyAvLyB1bm5lY2Vzc2FyeT9cblx0XHR0aGlzLnNlZWsocFNhdmVkKTtcblx0XHRyZXR1cm4gc3VtO1xuXHR9XG5cblx0ZGVjb2RlKG9ialR5cGUsIGFyZzAsIGFyZzEsIGFyZzIpIHsgLy8gVE9ETzogdGVzdCBmaXJzdCBmb3IgdHlwZW9mIG9ialR5cGVba2V5XSA9PSBcIm51bWJlclwiIGFzIGl04oCZcyB0aGUgbW9zdCBjb21tb25cblx0XHRjb25zdCBvYmogPSB7fTtcblx0XHRPYmplY3Qua2V5cyhvYmpUeXBlKS5mb3JFYWNoKGtleSA9PiB7XG5cdFx0XHRpZiAoa2V5LnN0YXJ0c1dpdGgoXCJfSUZfXCIpKSB7XG5cdFx0XHRcdC8vIGRlY29kZSBjb25kaXRpb25hbCBibG9ja1xuXHRcdFx0XHRjb25zdCBjb25kaXRpb24gPSBbLi4ub2JqVHlwZVtrZXldWzBdXTtcblx0XHRcdFx0aWYgKGNvbmRpdGlvblswXSA9PSBcIl9BUkcwX1wiKVxuXHRcdFx0XHRcdGNvbmRpdGlvblswXSA9IGFyZzA7XG5cdFx0XHRcdGVsc2UgaWYgKGNvbmRpdGlvblswXSA9PSBcIl9BUkcxX1wiKVxuXHRcdFx0XHRcdGNvbmRpdGlvblswXSA9IGFyZzE7XG5cdFx0XHRcdGVsc2UgaWYgKGNvbmRpdGlvblswXSA9PSBcIl9BUkcyX1wiKVxuXHRcdFx0XHRcdGNvbmRpdGlvblswXSA9IGFyZzI7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRjb25kaXRpb25bMF0gPSBvYmpbY29uZGl0aW9uWzBdXTtcblxuXHRcdFx0XHRpZiAodGhpcy5jb21wYXJlKGNvbmRpdGlvbikpIHtcblx0XHRcdFx0XHRjb25zdCBvYmpfID0gdGhpcy5kZWNvZGUob2JqVHlwZVtrZXldWzFdKTtcblx0XHRcdFx0XHRPYmplY3Qua2V5cyhvYmpfKS5mb3JFYWNoKGtleV8gPT4ge1xuXHRcdFx0XHRcdFx0b2JqW2tleV9dID0gb2JqX1trZXlfXTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChBcnJheS5pc0FycmF5KG9ialR5cGVba2V5XSkpIHtcblx0XHRcdFx0Ly8gZGVjb2RlIGFycmF5IG9mIHNpbWlsYXIgdmFsdWVzXG5cdFx0XHRcdGxldCBjb3VudDtcblx0XHRcdFx0aWYgKE51bWJlci5pc0ludGVnZXIob2JqVHlwZVtrZXldWzFdKSlcblx0XHRcdFx0XHRjb3VudCA9IG9ialR5cGVba2V5XVsxXTtcblx0XHRcdFx0ZWxzZSBpZiAob2JqVHlwZVtrZXldWzFdID09IFwiX0FSRzBfXCIpXG5cdFx0XHRcdFx0Y291bnQgPSBhcmcwO1xuXHRcdFx0XHRlbHNlIGlmIChvYmpUeXBlW2tleV1bMV0gPT0gXCJfQVJHMV9cIilcblx0XHRcdFx0XHRjb3VudCA9IGFyZzE7XG5cdFx0XHRcdGVsc2UgaWYgKG9ialR5cGVba2V5XVsxXSA9PSBcIl9BUkcyX1wiKVxuXHRcdFx0XHRcdGNvdW50ID0gYXJnMjtcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGNvdW50ID0gb2JqW29ialR5cGVba2V5XVsxXV07XG5cblx0XHRcdFx0b2JqW2tleV0gPSBbXTtcblx0XHRcdFx0Zm9yIChsZXQgYz0wOyBjPGNvdW50OyBjKyspIHtcblx0XHRcdFx0XHRvYmpba2V5XS5wdXNoKHRoaXMuZ2V0dGVyc1tvYmpUeXBlW2tleV1bMF1dKCkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Ly8gc2ltcGxlIGRlY29kZVxuXHRcdFx0XHRvYmpba2V5XSA9IHRoaXMuZ2V0dGVyc1tvYmpUeXBlW2tleV1dKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG9iajtcblx0fVxuXG5cdGVuY29kZShvYmpUeXBlLCBvYmosIGFyZzAsIGFyZzEsIGFyZzIpIHtcblx0XHRPYmplY3Qua2V5cyhvYmpUeXBlKS5mb3JFYWNoKGtleSA9PiB7XG5cdFx0XHRpZiAoa2V5LnN0YXJ0c1dpdGgoXCJfSUZfXCIpKSB7XG5cdFx0XHRcdC8vIGVuY29kZSBjb25kaXRpb25hbCBibG9ja1xuXHRcdFx0XHRjb25zdCBjb25kaXRpb24gPSBbLi4ub2JqVHlwZVtrZXldWzBdXTtcblx0XHRcdFx0aWYgKGNvbmRpdGlvblswXSA9PSBcIl9BUkcwX1wiKVxuXHRcdFx0XHRcdGNvbmRpdGlvblswXSA9IGFyZzA7XG5cdFx0XHRcdGVsc2UgaWYgKGNvbmRpdGlvblswXSA9PSBcIl9BUkcxX1wiKVxuXHRcdFx0XHRcdGNvbmRpdGlvblswXSA9IGFyZzE7XG5cdFx0XHRcdGVsc2UgaWYgKGNvbmRpdGlvblswXSA9PSBcIl9BUkcyX1wiKVxuXHRcdFx0XHRcdGNvbmRpdGlvblswXSA9IGFyZzI7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRjb25kaXRpb25bMF0gPSBvYmpbY29uZGl0aW9uWzBdXTtcblxuXHRcdFx0XHRpZiAodGhpcy5jb21wYXJlKGNvbmRpdGlvbikpIHtcblx0XHRcdFx0XHR0aGlzLmVuY29kZShvYmpUeXBlW2tleV1bMV0sIG9iaik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKEFycmF5LmlzQXJyYXkob2JqVHlwZVtrZXldKSkge1xuXHRcdFx0XHQvLyBlbmNvZGUgYXJyYXkgb2Ygc2ltaWxhciB2YWx1ZXNcblx0XHRcdFx0bGV0IGNvdW50O1xuXHRcdFx0XHRpZiAoTnVtYmVyLmlzSW50ZWdlcihvYmpUeXBlW2tleV1bMV0pKVxuXHRcdFx0XHRcdGNvdW50ID0gb2JqVHlwZVtrZXldWzFdO1xuXHRcdFx0XHRlbHNlIGlmIChvYmpUeXBlW2tleV1bMV0gPT0gXCJfQVJHMF9cIilcblx0XHRcdFx0XHRjb3VudCA9IGFyZzA7XG5cdFx0XHRcdGVsc2UgaWYgKG9ialR5cGVba2V5XVsxXSA9PSBcIl9BUkcxX1wiKVxuXHRcdFx0XHRcdGNvdW50ID0gYXJnMTtcblx0XHRcdFx0ZWxzZSBpZiAob2JqVHlwZVtrZXldWzFdID09IFwiX0FSRzJfXCIpXG5cdFx0XHRcdFx0Y291bnQgPSBhcmcyO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0Y291bnQgPSBvYmpbb2JqVHlwZVtrZXldWzFdXTtcblxuXHRcdFx0XHRmb3IgKGxldCBjPTA7IGM8Y291bnQ7IGMrKykge1xuXHRcdFx0XHRcdHRoaXMuc2V0dGVyc1tvYmpUeXBlW2tleV1bMF1dKG9ialtrZXldW2NdKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdC8vIHNpbXBsZSBlbmNvZGVcblx0XHRcdFx0dGhpcy5zZXR0ZXJzW29ialR5cGVba2V5XV0ob2JqW2tleV0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0ZGVjb2RlQXJyYXkgKHR5cGUsIGxlbmd0aCkge1xuXHRcdGNvbnN0IGdldHRlciA9IHRoaXMuZ2V0dGVyc1t0eXBlXTtcblx0XHRjb25zdCBhcnJheSA9IFtdO1xuXHRcdGZvciAobGV0IGk9MDsgaTxsZW5ndGg7IGkrKykge1xuXHRcdFx0YXJyYXkucHVzaChnZXR0ZXIoKSk7XG5cdFx0fVxuXHRcdHJldHVybiBhcnJheTtcblx0fVxuXG5cdGVuY29kZUFycmF5IChhcnJheSwgdHlwZSwgbGVuZ3RoKSB7XG5cdFx0aWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cdFx0fVxuXHRcdGNvbnN0IHNldHRlciA9IHRoaXMuc2V0dGVyc1t0eXBlXTtcblx0XHRmb3IgKGxldCBpPTA7IGk8bGVuZ3RoOyBpKyspIHtcblx0XHRcdHNldHRlcihhcnJheVtpXSk7XG5cdFx0fVxuXHR9XG5cblx0ZGVjb2RlTmFtZVN0cmluZyhsZW5ndGgpIHtcblx0XHQvLyBUT0RPOiBoYW5kbGUgVVRGLTggYmV5b25kIDE2IGJpdHNcblx0XHRsZXQgc3RyID0gXCJcIjtcblx0XHRmb3IgKGxldCBpPTA7IGk8bGVuZ3RoOyBpKz0yKSB7XG5cdFx0XHRzdHIgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSh0aGlzLnUxNik7XG5cdFx0fVxuXHRcdHJldHVybiBzdHI7XG5cdH1cblxuXHRlbmNvZGVOYW1lU3RyaW5nKHN0cikge1xuXHRcdC8vIFRPRE86IGhhbmRsZSBVVEYtOCBiZXlvbmQgMTYgYml0c1xuXHRcdGZvciAobGV0IGM9MDsgYzxzdHIubGVuZ3RoOyBjKyspIHtcblx0XHRcdHRoaXMudTE2ID0gc3RyLmNoYXJDb2RlQXQoYyk7XG5cdFx0fVxuXHRcdC8vIFRPRE86IHJldHVybiBieXRlbGVuZ3RoPyBpdCBtYXkgYmUgZGlmZmVyZW50IGZyb20gc3RyLmxlbmd0aCoyXG5cdH1cblxuXHRkZWNvZGVHbHlwaChvcHRpb25zPXt9KSB7XG5cdFx0XG5cdFx0Ly9jb25zdCBtZXRyaWNzID0gb3B0aW9ucy5tZXRyaWNzID8/IFswLCAwLCAwLCAwXTtcblx0XHRjb25zdCBtZXRyaWNzID0gb3B0aW9ucy5tZXRyaWNzID09PSB1bmRlZmluZWQgPyBbMCwgMCwgMCwgMF0gOiBvcHRpb25zLm1ldHJpY3M7XG5cdFx0Y29uc3QgZ2x5cGggPSBvcHRpb25zLmxlbmd0aCA/IG5ldyBTYW1zYUdseXBoKHRoaXMuZGVjb2RlKEZPUk1BVFMuR2x5cGhIZWFkZXIpKSA6IG5ldyBTYW1zYUdseXBoKCk7XG5cdFx0aWYgKG9wdGlvbnMuaWQpXG5cdFx0XHRnbHlwaC5pZCA9IG9wdGlvbnMuaWQ7XG5cblx0XHQvLyBzZXQgbWV0cmljcyBmcm9tIHRoZSBmb2504oCZcyBobXR4XG5cdFx0Z2x5cGguZm9udCA9IG9wdGlvbnMuZm9udDtcblx0XHRpZiAoZ2x5cGguZm9udC5obXR4KVx0e1xuXHRcdFx0bWV0cmljc1sxXSA9IGdseXBoLmZvbnQuaG10eFtnbHlwaC5pZF07XG5cdFx0fVxuXG5cdFx0Ly8gc2ltcGxlIGdseXBoXG5cdFx0aWYgKGdseXBoLm51bWJlck9mQ29udG91cnMgPiAwKSB7XG5cblx0XHRcdGdseXBoLmVuZFB0cyA9IFtdO1xuXG5cdFx0XHQvLyBlbmQgcG9pbnRzIG9mIGVhY2ggY29udG91clxuXHRcdFx0Zm9yIChsZXQgYz0wOyBjPGdseXBoLm51bWJlck9mQ29udG91cnM7IGMrKykge1xuXHRcdFx0XHRnbHlwaC5lbmRQdHMucHVzaCh0aGlzLnUxNik7XG5cdFx0XHR9XG5cdFx0XHRnbHlwaC5udW1Qb2ludHMgPSBnbHlwaC5lbmRQdHNbZ2x5cGgubnVtYmVyT2ZDb250b3VycyAtMV0gKyAxO1xuXG5cdFx0XHQvLyBpbnN0cnVjdGlvbnMgKHNraXApXG5cdFx0XHR0aGlzLnNlZWtyKGdseXBoLmluc3RydWN0aW9uTGVuZ3RoID0gdGhpcy51MTYpO1xuXG5cdFx0XHQvLyBmbGFnc1xuXHRcdFx0Y29uc3QgZmxhZ3MgPSBbXTtcblx0XHRcdGZvciAobGV0IHB0PTA7IHB0PGdseXBoLm51bVBvaW50czsgKSB7XG5cdFx0XHRcdGxldCBmbGFnID0gdGhpcy51ODtcblx0XHRcdFx0ZmxhZ3NbcHQrK10gPSBmbGFnO1xuXHRcdFx0XHRpZiAoZmxhZyAmIDB4MDgpIHtcblx0XHRcdFx0XHRjb25zdCByZXBlYXQgPSB0aGlzLnU4O1xuXHRcdFx0XHRcdGZvciAobGV0IHI9MDsgcjxyZXBlYXQ7IHIrKykgXG5cdFx0XHRcdFx0XHRmbGFnc1twdCsrXSA9IGZsYWc7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gcG9pbnRzXG5cdFx0XHRjb25zb2xlLmFzc2VydChmbGFncy5sZW5ndGggPT09IGdseXBoLm51bVBvaW50cywgXCJFcnJvciBpbiBnbHlwaCBkZWNvZGluZzogZmxhZ3MubGVuZ3RoICglaSkgIT0gZ2x5cGgubnVtUG9pbnRzICglaSlcIiwgZmxhZ3MubGVuZ3RoLCBnbHlwaC5udW1Qb2ludHMpO1xuXHRcdFx0bGV0IHhfPTAsIHlfPTAsIHgsIHk7XG5cdFx0XHRmbGFncy5mb3JFYWNoKChmbGFnLGYpID0+IHtcblx0XHRcdFx0Ly8gY29uc3QgbWFzayA9IGZsYWcgJiAweDEyO1xuXHRcdFx0XHQvLyB4ICs9IChtYXNrID09IDB4MTIgPyB0aGlzLnU4IDogKG1hc2sgPT0gMHgwMiA/IC10aGlzLnU4IDogKG1hc2sgPT0gMHgwMCA/IHRoaXMuaTE2IDogMCkpKTtcblx0XHRcdFx0Ly8gZ2x5cGgucG9pbnRzW2ZdID0gW3gsIDAsIGZsYWcgJiAweDAxXTtcblxuXHRcdFx0XHRzd2l0Y2ggKGZsYWcgJiAweDEyKSB7IC8vIHhcblx0XHRcdFx0XHRjYXNlIDB4MDA6IHggPSB4XyArIHRoaXMuaTE2OyBicmVhaztcblx0XHRcdFx0XHRjYXNlIDB4MDI6IHggPSB4XyAtIHRoaXMudTg7IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMHgxMDogeCA9IHhfOyBicmVhaztcblx0XHRcdFx0XHRjYXNlIDB4MTI6IHggPSB4XyArIHRoaXMudTg7IGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHhfID0geDtcblx0XHRcdFx0Z2x5cGgucG9pbnRzW2ZdID0gW3gsIDAsIGZsYWcgJiAweDAxXTtcblx0XHRcdH0pO1xuXHRcdFx0ZmxhZ3MuZm9yRWFjaCgoZmxhZyxmKSA9PiB7XG5cdFx0XHRcdHN3aXRjaCAoZmxhZyAmIDB4MjQpIHsgLy8geVxuXHRcdFx0XHRcdGNhc2UgMHgwMDogeSA9IHlfICsgdGhpcy5pMTY7IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMHgwNDogeSA9IHlfIC0gdGhpcy51ODsgYnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAweDIwOiB5ID0geV87IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMHgyNDogeSA9IHlfICsgdGhpcy51ODsgYnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0eV8gPSB5O1xuXHRcdFx0XHRnbHlwaC5wb2ludHNbZl1bMV0gPSB5O1xuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdFxuXHRcdC8vIGNvbXBvc2l0ZSBnbHlwaFxuXHRcdC8vIC0gd2UgRE8gYWRkIHBvaW50cyBmb3IgY29tcG9zaXRlIGdseXBoczogb25lIHBlciBjb21wb25lbnQgKHRoZXkgYXJlIHRoZSB4IGFuZCB5IG9mZnNldHMpLCBhbmQgdGhlIDQgZXh0cmEgbWV0cmljcyBwb2ludHNcblx0XHQvLyAtIHdoZW4gd2UgcHJvY2VzcyB0aGVzZSBnbHlwaHMsIHdlIGxvb2sgYXQgZ2x5cGgubnVtYmVyT2ZDb250b3VycyBhbmQgZ2x5cGgucG9pbnRzLCBidXQgTk9UIGdseXBoLm51bVBvaW50c1xuXHRcdGVsc2UgaWYgKGdseXBoLm51bWJlck9mQ29udG91cnMgPCAwKSB7XG5cblx0XHRcdGdseXBoLmNvbXBvbmVudHMgPSBbXTtcblx0XHRcdGxldCBmbGFnO1xuXG5cdFx0XHRkbyAge1xuXHRcdFx0XHRjb25zdCBjb21wb25lbnQgPSB7fTtcblx0XHRcdFx0ZmxhZyA9IGNvbXBvbmVudC5mbGFncyA9IHRoaXMudTE2O1xuXHRcdFx0XHRjb21wb25lbnQuZ2x5cGhJZCA9IHRoaXMudTE2O1xuXG5cdFx0XHRcdC8vIG9mZnNldHMgYW5kIG1hdGNoZWQgcG9pbnRzIChBUkdTX0FSRV9YWV9WQUxVRVMsIEFSR18xX0FORF8yX0FSRV9XT1JEUylcblx0XHRcdFx0c3dpdGNoIChmbGFnICYgMHgwMDAzKSB7XG5cdFx0XHRcdFx0Y2FzZSAweDAwMDM6IGNvbXBvbmVudC5vZmZzZXQgPSBbdGhpcy5pMTYsIHRoaXMuaTE2XTsgYnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAweDAwMDI6IGNvbXBvbmVudC5vZmZzZXQgPSBbdGhpcy5pOCwgdGhpcy5pOF07IGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMHgwMDAxOiBjb21wb25lbnQubWF0Y2hlZFBvaW50cyA9IFt0aGlzLnUxNiwgdGhpcy51MTZdOyBicmVhaztcblx0XHRcdFx0XHRjYXNlIDB4MDAwMDogY29tcG9uZW50Lm1hdGNoZWRQb2ludHMgPSBbdGhpcy51OCwgdGhpcy51OF07IGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gdGhpcyBpcyBjb29sLCB3ZSBzdG9yZSB0aGUgb2Zmc2V0IGFzIGl0IHdhcyBhIHBvaW50LCB0aGVuIHdlIGNhbiB0cmVhdCBpdCBhcyBhIHBvaW50IHdoZW4gYWN0ZWQgb24gYnkgdGhlIHR2dHNcblx0XHRcdFx0Ly8gLSBJIHRoaW5rIHdlIHNob3VsZCBwdXNoIHplcm9lcyBpZiBtYXRjaGVkUG9pbnRzXG5cdFx0XHRcdGlmIChjb21wb25lbnQub2Zmc2V0KSB7XG5cdFx0XHRcdFx0Z2x5cGgucG9pbnRzLnB1c2goIFtjb21wb25lbnQub2Zmc2V0WzBdLCBjb21wb25lbnQub2Zmc2V0WzFdLCAwXSApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGdseXBoLnBvaW50cy5wdXNoKCBbMCwwLDBdICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyB0cmFuc2Zvcm1hdGlvbiBtYXRyaXggKGlmIGNvbXBvbmVudC50cmFuc2Zvcm0gaXMgdW5kZWZpbmVkLCB0aGUgbWF0cml4IGlzIFsxLCAwLCAwLCAxXSk6IGNoZWNrIGJpdHMgMHgwMDA4LCAweDAwNDAsIDB4MDA4MFxuXHRcdFx0XHRzd2l0Y2ggKGZsYWcgJiAweDAwYzgpIHtcblx0XHRcdFx0XHRjYXNlIDB4MDAwODogY29uc3Qgc2NhbGUgPSB0aGlzLmYyMTQ7IGNvbXBvbmVudC50cmFuc2Zvcm0gPSBbc2NhbGUsIDAsIDAsIHNjYWxlXTsgYnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAweDAwNDA6IGNvbXBvbmVudC50cmFuc2Zvcm0gPSBbdGhpcy5mMjE0LCAwLCAwLCB0aGlzLmYyMTRdOyBicmVhaztcblx0XHRcdFx0XHRjYXNlIDB4MDA4MDogY29tcG9uZW50LnRyYW5zZm9ybSA9IFt0aGlzLmYyMTQsIHRoaXMuZjIxNCwgdGhpcy5mMjE0LCB0aGlzLmYyMTRdOyBicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIHN0b3JlIGNvbXBvbmVudFxuXHRcdFx0XHRnbHlwaC5jb21wb25lbnRzLnB1c2goY29tcG9uZW50KTtcblxuXHRcdFx0fSB3aGlsZSAoZmxhZyAmIDB4MDAyMCk7IC8vIE1PUkVfQ09NUE9ORU5UU1xuXG5cdFx0XHQvLyBza2lwIG92ZXIgY29tcG9zaXRlIGluc3RydWN0aW9uc1xuXHRcdFx0aWYgKGZsYWcgJiAweDAxMDApIHsgLy8gV0VfSEFWRV9JTlNUUlxuXHRcdFx0XHR0aGlzLnNlZWtyKGdseXBoLmluc3RydWN0aW9uTGVuZ3RoID0gdGhpcy51MTYpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBwcmV0ZW5kIHRoZXNlIGFyZSBwb2ludHMgc28gdGhleSBjYW4gYmUgcHJvY2Vzc2VkIGJ5IHZhcmlhdGlvbnNcblx0XHRcdGdseXBoLm51bVBvaW50cyA9IGdseXBoLnBvaW50cy5sZW5ndGg7IC8vIG5vIG1ldHJpY3MgcG9pbnRzIHlldFxuXHRcdH1cblxuXHRcdC8vIFRPRE86IGZpeCB0aGUgbWV0cmljcyBwb2ludHNcblx0XHQvLyBnbHlwaC5wb2ludHNbZ2x5cGgubnVtUG9pbnRzXSAgID0gW21ldHJpY3NbMF0gPz8gMCwgICAgICAgICAgICAgICAwLCAwXTsgLy8gSDogTGVmdCBzaWRlIGJlYXJpbmcgcG9pbnRcblx0XHQvLyBnbHlwaC5wb2ludHNbZ2x5cGgubnVtUG9pbnRzKzFdID0gW21ldHJpY3NbMV0gPz8gMCwgICAgICAgICAgICAgICAwLCAwXTsgLy8gSDogUmlnaHQgc2lkZSBiZWFyaW5nIHBvaW50XG5cdFx0Ly8gZ2x5cGgucG9pbnRzW2dseXBoLm51bVBvaW50cysyXSA9IFsgICAgICAgICAgICAgIDAsIG1ldHJpY3NbMl0gPz8gMCwgMF07IC8vIFY6IFRvcCBzaWRlIGJlYXJpbmcgcG9pbnRcblx0XHQvLyBnbHlwaC5wb2ludHNbZ2x5cGgubnVtUG9pbnRzKzNdID0gWyAgICAgICAgICAgICAgMCwgbWV0cmljc1szXSA/PyAwLCAwXTsgLy8gVjogQm90dG9tIHNpZGUgYmVhcmluZyBwb2ludFxuXHRcdGdseXBoLnBvaW50c1tnbHlwaC5udW1Qb2ludHNdICAgPSBbbWV0cmljc1swXSA/IG1ldHJpY3NbMF0gOiAwLCAgICAgICAgICAgICAgIDAsIDBdOyAvLyBIOiBMZWZ0IHNpZGUgYmVhcmluZyBwb2ludFxuXHRcdGdseXBoLnBvaW50c1tnbHlwaC5udW1Qb2ludHMrMV0gPSBbbWV0cmljc1sxXSA/IG1ldHJpY3NbMV0gOiAwLCAgICAgICAgICAgICAgIDAsIDBdOyAvLyBIOiBSaWdodCBzaWRlIGJlYXJpbmcgcG9pbnRcblx0XHRnbHlwaC5wb2ludHNbZ2x5cGgubnVtUG9pbnRzKzJdID0gWyAgICAgICAgICAgICAgMCwgbWV0cmljc1syXSA/IG1ldHJpY3NbMl0gOiAwLCAwXTsgLy8gVjogVG9wIHNpZGUgYmVhcmluZyBwb2ludFxuXHRcdGdseXBoLnBvaW50c1tnbHlwaC5udW1Qb2ludHMrM10gPSBbICAgICAgICAgICAgICAwLCBtZXRyaWNzWzNdID8gbWV0cmljc1szXSA6IDAsIDBdOyAvLyBWOiBCb3R0b20gc2lkZSBiZWFyaW5nIHBvaW50XG5cdFxuXHRcdHJldHVybiBnbHlwaDtcblx0fVxuXG5cdGVuY29kZUdseXBoKGdseXBoLCBvcHRpb25zID0ge30pIHtcblx0XHQvLyBFbmNvZGUgYSBnbHlwaCBpbnRvIGEgU2Ftc2FCdWZmZXJcblx0XHQvL1xuXHRcdC8vIGdseXBoOlxuXHRcdC8vIC0gYSBTYW1zYUdseXBoIG9iamVjdFxuXHRcdC8vXG5cdFx0Ly8gb3B0aW9uczpcblx0XHQvLyAtIGJib3g6IHRydWUgPSByZWNhbGN1bGF0ZSB0aGUgYm91bmRpbmcgYm94IG9mIHRoZSBnbHlwaCAoZGVmYXVsdCksIGZhbHNlID0gZG9u4oCZdCByZWNhbGN1bGF0ZVxuXHRcdC8vIC0gY29tcHJlc3Npb246IDAgPSBkb27igJl0IGNvbXByZXNzIChmYXN0ZXIpLCAxID0gY29tcHJlc3MgdGhlIGdseXBoIChzbG93ZXIsIGRlZmF1bHQpLCAyID0gV09GRjIgY29tcHJlc3Npb24gKG5vdCBpbXBsZW1lbnRlZClcblx0XHQvLyAtIG1ldHJpY3M6IGludGVnZXIgYXJyYXkgdGhhdCByZWNlaXZlcyB0aGUgNCBtZXRyaWNzIHBvaW50cyBhZnRlciB0aGUgbWFpbiBwb2ludHMgKGlmIGFic2VudCwgdGhlc2UgYXJlIG5vdCB3cml0dGVuKVxuXHRcdC8vIC0gb3ZlcmxhcFNpbXBsZTogdHJ1ZSA9IGZsYWcgdGhlIGZpcnN0IHBvaW50IG9mIGEgc2ltcGxlIGdseXBoIGFzIG92ZXJsYXBwaW5nIChmb3IgQXBwbGUgZm9udHMpLCBmYWxzZSA9IGRvbuKAmXQgZmxhZyAoZGVmYXVsdClcblx0XHQvLyAtIGJpZ2VuZGlhbjogdHJ1ZSA9IHRoZSBtZXRob2QgaXMgYWxsb3dlZCB0byB1c2UgSW50MTZBcnJheSwgVUludDE2QXJyYXksIEludDMyQXJyYXksIFVJbnQzMkFycmF5LCBldGMuIGZvciBzcGVlZFxuXHRcdC8vIC0gZ2V0TWF4Q29tcGlsZWRTaXplOiB0cnVlID0gcmV0dXJuIHRoZSBtYXhpbXVtIHNpemUgb2YgdGhlIGNvbXBpbGVkIGdseXBoIChubyBjb21waWxhdGlvbilcblx0XHQvL1xuXHRcdC8vIHJldHVybiB2YWx1ZTpcblx0XHQvLyAtIHNpemUgb2YgdGhlIGNvbXBpbGVkIGdseXBoIGluIGJ5dGVzICh3aXRob3V0IHBhZGRpbmcpXG5cdFx0Ly8gLSBtYXhpbXVtIHNpemUgb2YgdGhlIGNvbXBpbGVkIGdseXBoIGluIGJ5dGVzICh3aXRob3V0IHBhZGRpbmcpIGlmIG9wdGlvbnMuZ2V0TWF4Q29tcGlsZWRTaXplXG5cblx0XHQvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG5cdFx0aWYgKG9wdGlvbnMuY29tcHJlc3Npb24gPT09IHVuZGVmaW5lZClcblx0XHRcdG9wdGlvbnMuY29tcHJlc3Npb24gPSAxOyAvLyBzdGFuZGFyZCBUcnVlVHlwZSBjb21wcmVzc2lvblxuXHRcdGlmIChvcHRpb25zLmJib3ggPT09IHVuZGVmaW5lZClcblx0XHRcdG9wdGlvbnMuYmJveCA9IHRydWU7IC8vIHJlY2FsY3VsYXRlIGJvdW5kaW5nIGJveFxuXG5cdFx0aWYgKG9wdGlvbnMuZ2V0TWF4Q29tcGlsZWRTaXplKSB7XG5cdFx0XHRpZiAob3B0aW9ucy5jb21wcmVzc2lvbiA9PSAyKSB7XG5cdFx0XHRcdGlmIChnbHlwaC5udW1iZXJPZkNvbnRvdXJzID4gMClcblx0XHRcdFx0XHRyZXR1cm4gXG5cdFx0XHRcdGVsc2UgaWYgKGdseXBoLm51bWJlck9mQ29udG91cnMgPCAwKVxuXHRcdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmV0dXJuIDA7XHRcdFx0XHRcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmIChnbHlwaC5udW1iZXJPZkNvbnRvdXJzID4gMClcblx0XHRcdFx0XHRyZXR1cm4gKDUqMikgKyBnbHlwaC5udW1iZXJPZkNvbnRvdXJzKjIgKyAyICsgZ2x5cGguaW5zdHJ1Y3Rpb25MZW5ndGggKyBnbHlwaC5udW1Qb2ludHMgKiAoMisyKzEpO1xuXHRcdFx0XHRlbHNlIGlmIChnbHlwaC5udW1iZXJPZkNvbnRvdXJzIDwgMClcblx0XHRcdFx0XHRyZXR1cm4gKDUqMikgKyAoNCs0KSoyICogZ2x5cGguY29tcG9uZW50cy5sZW5ndGggKyAyICsgZ2x5cGguaW5zdHJ1Y3Rpb25MZW5ndGg7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZXR1cm4gMDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRjb25zdCBwb2ludHMgPSBnbHlwaC5wb2ludHM7XG5cdFx0Y29uc3QgbnVtUG9pbnRzID0gZ2x5cGgubnVtUG9pbnRzO1xuXHRcdGNvbnN0IHRlbGwgPSB0aGlzLnRlbGwoKTtcblx0XG5cdFx0Ly8gMS4gU0lNUExFIGdseXBoXG5cdFx0aWYgKGdseXBoLm51bWJlck9mQ29udG91cnMgPiAwKSB7XG5cdFxuXHRcdFx0bGV0IGluc3RydWN0aW9uTGVuZ3RoID0gMDtcblx0XG5cdFx0XHQvLyByZWNhbGN1bGF0ZSBiYm94XG5cdFx0XHRpZiAob3B0aW9ucy5iYm94KSB7XG5cdFx0XHRcdGlmIChwb2ludHMgJiYgcG9pbnRzWzBdKSB7XG5cdFx0XHRcdFx0bGV0IHhNaW4sIHhNYXgsIHlNaW4sIHlNYXg7XG5cdFx0XHRcdFx0W3hNaW4seU1pbl0gPSBbeE1heCx5TWF4XSA9IHBvaW50c1swXTtcblx0XHRcdFx0XHRmb3IgKHB0PTE7IHB0PG51bVBvaW50czsgcHQrKykge1xuXHRcdFx0XHRcdFx0Y29uc3QgUCA9IHBvaW50c1twdF1bMF0sIFEgPSBwb2ludHNbcHRdWzFdO1xuXHRcdFx0XHRcdFx0aWYgKFA8eE1pbilcblx0XHRcdFx0XHRcdFx0eE1pbj1QO1xuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoUD54TWF4KVxuXHRcdFx0XHRcdFx0XHR4TWF4PVA7XG5cdFx0XHRcdFx0XHRpZiAoUTx5TWluKVxuXHRcdFx0XHRcdFx0XHR5TWluPVE7XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChRPnlNYXgpXG5cdFx0XHRcdFx0XHRcdHlNYXg9UTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Z2x5cGgueE1pbiA9IE1hdGguZmxvb3IoeE1pbik7IC8vIHJvdW5kaW5nIGlzIGluIGNhc2UgdGhlIHBvaW50cyBhcmUgbm90IGludGVnZXJzLCB0aGFua3MgdG8gdmFyaWF0aW9ucyBvciB0cmFuc2Zvcm1zXG5cdFx0XHRcdFx0Z2x5cGgueU1pbiA9IE1hdGguZmxvb3IoeU1pbik7XG5cdFx0XHRcdFx0Z2x5cGgueE1heCA9IE1hdGguY2VpbCh4TWF4KTtcblx0XHRcdFx0XHRnbHlwaC55TWF4ID0gTWF0aC5jZWlsKHlNYXgpO1xuXHRcdFx0XHRcdC8vIFRPRE86IGNvbnNpZGVyIHRoYXQsIGlmIHRoaXMgZ2x5cGggaXMgZnJvbSBhIG5vbi1kZWZhdWx0IGluc3RhbmNlLCB0aGVzZSB2YWx1ZXMgd2lsbCBpbiBnZW5lcmFsIG5vdCBiZSBpbnRlZ2Vyc1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIGNvbXByZXNzaW9uOiBXT0ZGMiBtZXRob2Rcblx0XHRcdGlmIChvcHRpb25zLmNvbXByZXNzaW9uID09IDIpIHtcblxuXHRcdFx0XHQvLyBkb2NzXG5cdFx0XHRcdC8vIC0gaHR0cHM6Ly93d3cudzMub3JnL1RSL1dPRkYyLyNnbHlmX3RhYmxlX2Zvcm1hdFxuXG5cdFx0XHRcdC8vIC0gaGVyZSwgd2UgdXNlIHRoZSBXT0ZGMiBtZXRob2QgdG8gZW5jb2RlIGZsYWdzIGFuZCBjb29yZGluYXRlczpcblx0XHRcdFx0Ly8gLSBudW1iZXJPZkNvbnRvdXJzIFtVMTZdXG5cdFx0XHRcdC8vIC0gblBvaW50cyBbVTE2XVtudW1iZXJPZkNvbnRvdXJzXSAobnVtYmVyIG9mIHBvaW50cyBpbiBlYWNoIGNvbnRvdXIpXG5cdFx0XHRcdC8vIC0gZmxhZ3MgW1U4XVtudW1Qb2ludHNdICgxIGJ5dGUgcGVyIHBvaW50LCBudW1Qb2ludHMgaXMgdG90YWwgbnVtYmVyIG9mIHBvaW50cylcblx0XHRcdFx0Ly8gLSBwb2ludHMgKGNvb3JkaW5hdGUgZGF0YSlcblxuXG5cdFx0XHRcdC8vIHdyaXRlIG51bWJlck9mQ29udG91cnNcblx0XHRcdFx0dGhpcy51MTYgPSBnbHlwaC5udW1iZXJPZkNvbnRvdXJzO1xuXG5cdFx0XHRcdC8vIHdyaXRlIG5Qb2ludHMgYXJyYXlcblx0XHRcdFx0bGV0IHByZXZFbmRQdCA9IDA7XG5cdFx0XHRcdHRoaXMucGhhc2UgPSBmYWxzZTsgLy8gc2V0IHVwIGZvciBuaWJibGVzXG5cdFx0XHRcdGZvciAobGV0IGM9MDsgYzxnbHlwaC5udW1iZXJPZkNvbnRvdXJzOyBjKyspIHtcblx0XHRcdFx0XHRjb25zdCBjb250b3VyTGVuZ3RoID0gZ2x5cGguZW5kUHRzW2NdIC0gcHJldkVuZFB0ICsgMTtcblx0XHRcdFx0XHRjb25zdCBjbE5pYmJsZSA9IGNvbnRvdXJMZW5ndGggLSA0O1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdC8vIHRoaXMgaXMgYSBjdXN0b20gZW5jb2RpbmcgdG8gc2F2ZSBzcGFjZSBpbiB0aGUgY29udG91ckxlbmd0aHMgYXJyYXlcblx0XHRcdFx0XHQvLyB3cml0ZSBuaWJibGVzIG9mIGNvbnRvdXJMZW5ndGggLSA0IChjb250b3VyTGVuZ3RoID09IDMgaXMgcmFyZTsgY29udG91ckxlbmd0aCA9PSAyLCAxLCAwIHNob3VsZCBub3QgZXhpc3QgYnV0IHdlIHN0aWxsIGhhbmRsZSB0aGVtIGluZWZmaWNpZW50bHkpXG5cdFx0XHRcdFx0Ly8gLSBzbyB3ZSBoYW5kbGUgY29udG91cnMgb2YgbGVuZ3RoIDQgdG8gMTggKGluY2x1c2l2ZSkgaW4gb25lIG5pYmJsZVxuXHRcdFx0XHRcdGlmIChjbE5pYmJsZSA+PSAwICYmIGNsTmliYmxlIDwgMTUpIHtcblx0XHRcdFx0XHRcdHRoaXMudTQgPSBjbE5pYmJsZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHR0aGlzLnU0ID0gMTU7IC8vIGRlY2xhcmF0aW9uIHRoYXQgd2Ugd2lsbCB3cml0ZSBjb250b3VyTGVuZ3RoIGxpdGVyYWxseSBpbiAzIG5pYmJsZXMgKG11c3QgYmUgPCA0MDk2KVxuXHRcdFx0XHRcdFx0dGhpcy51NCA9IGNvbnRvdXJMZW5ndGggJiAweDBmMDAgPj4gODtcblx0XHRcdFx0XHRcdHRoaXMudTQgPSBjb250b3VyTGVuZ3RoICYgMHgwMGYwID4+IDQ7XG5cdFx0XHRcdFx0XHR0aGlzLnU0ID0gY29udG91ckxlbmd0aCAmIDB4MDAwZjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvL3RoaXMudTE2XzI1NSA9IGNvbnRvdXJMZW5ndGg7IC8vIHdyaXRlIFUxNl8yNTUgY29tcHJlc3NlZCBzdHJlYW0gW1UxNl8yNTUgQ09NUFJFU1NJT04gT0YgZW5kUHRzXVxuXHRcdFx0XHRcdC8vdGhpcy51MTYgPSBnbHlwaC5lbmRQdHNbY10gLSBwcmV2RW5kUHQgKyAxOyAvLyB3cml0ZSBVMTYgW05PIENPTVBSRVNTSU9OIE9GIGVuZFB0c11cblxuXHRcdFx0XHRcdC8qXG5cdFx0XHRcdFx0Ly8gZ2V0IGNvbnRvdXJMZW5ndGhzIHN0YXRzXG5cdFx0XHRcdFx0aWYgKGNvbnRvdXJMZW5ndGhzW2NvbnRvdXJMZW5ndGhdID09PSB1bmRlZmluZWQpXG5cdFx0XHRcdFx0XHRjb250b3VyTGVuZ3Roc1tjb250b3VyTGVuZ3RoXSA9IDA7XG5cdFx0XHRcdFx0ZWxzZSBcblx0XHRcdFx0XHRcdGNvbnRvdXJMZW5ndGhzW2NvbnRvdXJMZW5ndGhdKys7XG5cdFx0XHRcdFx0Ki9cblxuXHRcdFx0XHRcdHByZXZFbmRQdCA9IGdseXBoLmVuZFB0c1tjXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGNvbmNsdWRlIG5pYmJsaW5nXG5cdFx0XHRcdGlmICh0aGlzLnBoYXNlKSB7XG5cdFx0XHRcdFx0dGhpcy51NCA9IDA7XG5cdFx0XHRcdFx0dGhpcy5waGFzZSA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gYWxsb2NhdGUgZmxhZ3MgYXJyYXlcblx0XHRcdFx0Y29uc3QgZkFycmF5ID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5idWZmZXIsIHRoaXMucCwgbnVtUG9pbnRzKVxuXHRcdFx0XHR0aGlzLnNlZWtyKG51bVBvaW50cylcblxuXHRcdFx0XHQvLyB3cml0ZSBwb2ludCBjb29yZGluYXRlc1xuXHRcdFx0XHRsZXQgcHJldlB0ID0gWzAsMCwxXVxuXHRcdFx0XHRmb3IgKGxldCBwdD0wOyBwdDxnbHlwaC5udW1Qb2ludHM7IHB0KyspIHtcblx0XG5cdFx0XHRcdFx0Y29uc3QgcG9pbnQgPSBnbHlwaC5wb2ludHNbcHRdXG5cdFx0XHRcdFx0bGV0IGR4ID0gcG9pbnRbMF0gLSBwcmV2UHRbMF0sIGR4YSA9IE1hdGguYWJzKGR4KVxuXHRcdFx0XHRcdGxldCBkeSA9IHBvaW50WzFdIC0gcHJldlB0WzFdLCBkeWEgPSBNYXRoLmFicyhkeSlcblx0XHRcdFx0XHRsZXQgZmxhZ1xuXHRcblx0XHRcdFx0XHQvLyB0aGVyZSBhcmUgNSB0eXBlcyBvZiBkeC9keSBjb21ib1xuXHRcdFx0XHRcdC8vIDIgKiA4IDogMi1ieXRlIGVuY29kaW5ncyB3aGVyZSBkeCA9IDAgb3IgZHkgPSAwXG5cdFx0XHRcdFx0Ly8gNCAqIDQgOiAyLWJ5dGUgZW5jb2RpbmdzIFxuXHRcdFx0XHRcdC8vIDMgKiAzIDogMy1ieXRlIGVuY29kaW5nc1xuXHRcdFx0XHRcdC8vIDQgICAgIDogNC1ieXRlIGVuY29kaW5nc1xuXHRcdFx0XHRcdC8vIDQgICAgIDogNS1ieXRlIGVuY29kaW5nc1xuXHRcblx0XHRcdFx0XHQvLyBidWNrZXRzIDAuLjk6IGR4PT0wXG5cdFx0XHRcdFx0aWYgKGR4YSA9PSAwICYmIGR5YSA8IDEyODApIHtcblx0XHRcdFx0XHRcdGZsYWcgPSAwXG5cdFx0XHRcdFx0XHRmbGFnICs9IDIgKiBNYXRoLmZsb29yKGR5YSAvIDI1Nilcblx0XHRcdFx0XHRcdGlmIChkeSA+IDApXG5cdFx0XHRcdFx0XHRcdGZsYWcrK1xuXHRcdFx0XHRcdFx0dGhpcy51OCA9IGR5YSAlIDI1NiAvLyB3cml0ZSBjb29yZCBkYXRhICgxIGJ5dGUpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIGJ1Y2tldHMgMTAuLjE5OiBkeT09MFxuXHRcdFx0XHRcdGVsc2UgaWYgKGR5YSA9PSAwICYmIGR4YSA8IDEyODApIHtcblx0XHRcdFx0XHRcdGZsYWcgPSAxMFxuXHRcdFx0XHRcdFx0ZmxhZyArPSAyICogTWF0aC5mbG9vcihkeGEgLyAyNTYpXG5cdFx0XHRcdFx0XHRpZiAoZHggPiAwKVxuXHRcdFx0XHRcdFx0XHRmbGFnKytcdFxuXHRcdFx0XHRcdFx0dGhpcy51OCA9IGR4YSAlIDI1NiAvLyB3cml0ZSBjb29yZCBkYXRhICgxIGJ5dGUpXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIGJ1Y2tldHMgMjAuLjgzOiBkeCBhbmQgZHkgYXJlIGZhaXJseSBzaG9ydFxuXHRcdFx0XHRcdGVsc2UgaWYgKGR4YSA8PSA2NCAmJiBkeWEgPD0gNjQpIHsgLy8gd2UgY2FuIHVzZSBuaWJibGVzIGZvciBkeCBhbmQgZHksIHNvIDEgYnl0ZVxuXHRcdFx0XHRcdFx0ZmxhZyA9IDIwXG5cdFx0XHRcdFx0XHRmbGFnICs9IDE2ICogTWF0aC5mbG9vcigoZHhhLTEpIC8gMTYpXG5cdFx0XHRcdFx0XHRmbGFnICs9IDQgKiBNYXRoLmZsb29yKChkeWEtMSkgLyAxNilcblx0XHRcdFx0XHRcdGlmIChkeCA+IDApXG5cdFx0XHRcdFx0XHRcdGZsYWcrK1xuXHRcdFx0XHRcdFx0aWYgKGR5ID4gMClcblx0XHRcdFx0XHRcdFx0ZmxhZyArPSAyXG5cdFx0XHRcdFx0XHRsZXQgbmlieCA9ICgoZHhhLTEpICUgMTYpXG5cdFx0XHRcdFx0XHRsZXQgbmlieSA9ICgoZHlhLTEpICUgMTYpXG5cdFx0XHRcdFx0XHR0aGlzLnU4ID0gKG5pYnggPDwgNCkgfCBuaWJ5IC8vIHdyaXRlIGNvb3JkIGRhdGEgKDEgYnl0ZSlcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gYnVja2V0cyA4NC4uMTE5OiBkeCBhbmQgZHkgYXJlIG5vdCBxdWl0ZSBzbyBzaG9ydFxuXHRcdFx0XHRcdGVsc2UgaWYgKGR4YSA8PSA3NjggJiYgZHlhIDw9IDc2OCkgeyAvLyB3ZSBjYW4gdXNlIDEgYnl0ZSBmb3IgZHgsIDEgYnl0ZSBmb3IgZHlcblx0XHRcdFx0XHRcdGZsYWcgPSA4NFxuXHRcdFx0XHRcdFx0ZmxhZyArPSAxMiAqIE1hdGguZmxvb3IoKGR4YS0xKSAvIDI1Nilcblx0XHRcdFx0XHRcdGZsYWcgKz0gNCAqIE1hdGguZmxvb3IoKGR5YS0xKSAvIDI1Nilcblx0XHRcdFx0XHRcdGlmIChkeCA+IDApXG5cdFx0XHRcdFx0XHRcdGZsYWcrK1xuXHRcdFx0XHRcdFx0aWYgKGR5ID4gMClcblx0XHRcdFx0XHRcdFx0ZmxhZyArPSAyXG5cdFx0XHRcdFx0XHR0aGlzLnU4ID0gKGR4YS0xKSAlIDI1NiAvLyB3cml0ZSB4IGNvb3JkIGRhdGEgKDEgYnl0ZSlcblx0XHRcdFx0XHRcdHRoaXMudTggPSAoZHlhLTEpICUgMjU2IC8vIHdyaXRlIHkgY29vcmQgZGF0YSAoMSBieXRlKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvLyBidWNrZXRzIDEyMC4uMTIzXG5cdFx0XHRcdFx0ZWxzZSBpZiAoZHhhIDwgNDA5NiAmJiBkeWEgPCA0MDk2KSB7XG5cdFx0XHRcdFx0XHRmbGFnID0gMTIwXG5cdFx0XHRcdFx0XHRpZiAoZHggPiAwKVxuXHRcdFx0XHRcdFx0XHRmbGFnKytcblx0XHRcdFx0XHRcdGlmIChkeSA+IDApXG5cdFx0XHRcdFx0XHRcdGZsYWcgKz0gMlxuXHRcdFx0XHRcdFx0dGhpcy51MTYgPSBkeGEgPDwgNCB8IGR5YSA+PiA4XG5cdFx0XHRcdFx0XHR0aGlzLnU4ID0gZHlhICUgMjU2XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIGJ1Y2tldHMgMTI0Li4xMjdcblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdGZsYWcgPSAxMjRcblx0XHRcdFx0XHRcdGlmIChkeCA+IDApXG5cdFx0XHRcdFx0XHRcdGZsYWcrK1xuXHRcdFx0XHRcdFx0aWYgKGR5ID4gMClcblx0XHRcdFx0XHRcdFx0ZmxhZyArPSAyXG5cdFx0XHRcdFx0XHR0aGlzLnUxNiA9IGR4YVxuXHRcdFx0XHRcdFx0dGhpcy51MTYgPSBkeWFcblx0XHRcdFx0XHR9XG5cdFxuXHRcdFx0XHRcdC8vIGlzIHRoZSBwb2ludCBvZmYtY3VydmU/IGlmIHNvLCBzZXQgdGhlIGZsYWfigJlzIG1vc3Qgc2lnbmlmaWNhbnQgYml0XG5cdFx0XHRcdFx0aWYgKHBvaW50WzJdID09IDApXG5cdFx0XHRcdFx0XHRmbGFnIHw9IDB4ODBcblx0XHRcdFx0XHRcblx0XHRcdFx0XHQvLyB3cml0ZSB0aGUgZmxhZyBpbnRvIHRoZSBmbGFnIGFycmF5XG5cdFx0XHRcdFx0ZkFycmF5W3B0XSA9IGZsYWdcblx0XG5cdFx0XHRcdFx0Ly8gdXBkYXRlIHByZXZQdFxuXHRcdFx0XHRcdHByZXZQdCA9IHBvaW50XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0ZWxzZSB7XG5cblx0XHRcdFx0Ly8gb3B0aW9ucy5jb21wcmVzc2lvbiAhPSAyXG5cdFx0XHRcdGxldCBwdDtcblxuXHRcdFx0XHQvLyBuZXcgaGVhZGVyIHdpdGggYmJveFxuXHRcdFx0XHR0aGlzLmVuY29kZShGT1JNQVRTLkdseXBoSGVhZGVyLCBnbHlwaCk7XG5cdFx0XG5cdFx0XHRcdC8vIGVuZHBvaW50c1xuXHRcdFx0XHRnbHlwaC5lbmRQdHMuZm9yRWFjaChlbmRQdCA9PiB7XG5cdFx0XHRcdFx0dGhpcy51MTYgPSBlbmRQdDtcblx0XHRcdFx0fSk7XG5cdFx0XG5cdFx0XHRcdC8vIGluc3RydWN0aW9ucyAobm9uZSBmb3Igbm93KVxuXHRcdFx0XHR0aGlzLnUxNiA9IGluc3RydWN0aW9uTGVuZ3RoO1xuXHRcdFx0XHR0aGlzLnNlZWtyKGluc3RydWN0aW9uTGVuZ3RoKTtcblx0XHRcblx0XHRcdFx0Ly8gd3JpdGUgZ2x5cGggcG9pbnRzXG5cblx0XHRcdFx0Ly8gY29tcHJlc3Npb246IG5vbmVcblx0XHRcdFx0aWYgKG9wdGlvbnMuY29tcHJlc3Npb24gPT0gMCkge1xuXG5cdFx0XHRcdFx0Ly8gd3JpdGUgdW5jb21wcmVzc2VkIGdseXBoIHBvaW50cyAoZmFzdGVyIGluIG1lbW9yeSBhbmQgZm9yIFNTRCBkaXNrcylcblx0XHRcdFx0XHRsZXQgY3g9MDtcblx0XHRcdFx0XHRsZXQgY3k9MDtcblxuXHRcdFx0XHRcdGlmIChvcHRpb25zLmJpZ2VuZGlhbikge1xuXHRcdFx0XHRcdFx0Ly8gSW50MTZBcnJheSBtZXRob2Rcblx0XHRcdFx0XHRcdC8vIC0gYSBiaXQgZmFzdGVyLCBidXQgZG9lcyBub3Qgd29yayBvbiBMRSBwbGF0Zm9ybXMgc3VjaCBhcyBNYWMgTTFcblx0XHRcdFx0XHRcdGNvbnN0IGZBcnJheSA9IG5ldyBVaW50OEFycmF5KHRoaXMsIHRoaXMucCk7XG5cdFx0XHRcdFx0XHRmQXJyYXlbMF0gPSBwb2ludHNbMF1bMl0gJiAob3B0aW9ucy5vdmVybGFwU2ltcGxlID8gMHg0MCA6IDB4MDApOyAvLyBmaXJzdCBieXRlIG1heSBoYXZlIGFuIG92ZXJsYXAgZmxhZ1xuXHRcdFx0XHRcdFx0Zm9yIChwdD0xOyBwdDxudW1Qb2ludHM7IHB0KyspIHtcblx0XHRcdFx0XHRcdFx0ZkFycmF5W3B0XSA9IHBvaW50c1twdF1bMl07XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGNvbnN0IHBBcnJheSA9IG5ldyBJbnQxNkFycmF5KHRoaXMsIHRoaXMucCArIG51bVBvaW50cyk7IC8vIGRhbmdlcm91cywgc2luY2UgSW50MTZBcnJheSB1c2VzIHBsYXRmb3JtIGJ5dGUgb3JkZXIgKE0xIE1hYyBkb2VzKVxuXHRcdFx0XHRcdFx0Zm9yIChwdD0wOyBwdDxudW1Qb2ludHM7IHB0KyspIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgeCA9IHBvaW50c1twdF1bMF07XG5cdFx0XHRcdFx0XHRcdHBBcnJheVtwdF0gPSB4IC0gY3g7XG5cdFx0XHRcdFx0XHRcdGN4ID0geDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGZvciAocHQ9MDsgcHQ8bnVtUG9pbnRzOyBwdCsrKSB7XHRcblx0XHRcdFx0XHRcdFx0Y29uc3QgeSA9IHBvaW50c1twdF1bMV07XG5cdFx0XHRcdFx0XHRcdHBBcnJheVtudW1Qb2ludHMrcHRdID0geSAtIGN5O1xuXHRcdFx0XHRcdFx0XHRjeSA9IHk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0aGlzLnNlZWtyKG51bVBvaW50cyo1KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHQvLyBEYXRhVmlldyBtZXRob2Rcblx0XHRcdFx0XHRcdHRoaXMudTggPSBwb2ludHNbMF1bMl0gJiAob3B0aW9ucy5vdmVybGFwU2ltcGxlID8gMHg0MCA6IDB4MDApOyAvLyBmaXJzdCBieXRlIG1heSBoYXZlIGFuIG92ZXJsYXAgZmxhZ1xuXHRcdFx0XHRcdFx0Zm9yIChwdD0xOyBwdDxudW1Qb2ludHM7IHB0KyspIHtcblx0XHRcdFx0XHRcdFx0dGhpcy51OCA9IHBvaW50c1twdF1bMl07IC8vIHdyaXRlIDEgYnl0ZSBmb3IgZmxhZ1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRmb3IgKHB0PTA7IHB0PG51bVBvaW50czsgcHQrKykge1xuXHRcdFx0XHRcdFx0XHRjb25zdCB4ID0gcG9pbnRzW3B0XVswXVxuXHRcdFx0XHRcdFx0XHR0aGlzLmkxNiA9IHggLSBjeDsgLy8gd3JpdGUgMiBieXRlcyBmb3IgZHhcblx0XHRcdFx0XHRcdFx0Y3ggPSB4O1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRmb3IgKHB0PTA7IHB0PG51bVBvaW50czsgcHQrKykge1x0XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHkgPSBwb2ludHNbcHRdWzFdO1xuXHRcdFx0XHRcdFx0XHR0aGlzLmkxNiA9IHkgLSBjeTsgLy8gd3JpdGUgMiBieXRlcyBmb3IgZHlcblx0XHRcdFx0XHRcdFx0Y3kgPSB5O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gY29tcHJlc3Npb246IHN0YW5kYXJkIFRydWVUeXBlIGNvbXByZXNzaW9uXG5cdFx0XHRcdGVsc2UgaWYgKG9wdGlvbnMuY29tcHJlc3Npb24gPT0gMSkge1xuXG5cdFx0XHRcdFx0Ly8gd3JpdGUgY29tcHJlc3NlZCBnbHlwaCBwb2ludHMgKHNsb3dlcilcblx0XHRcdFx0XHRsZXQgY3g9MCwgY3k9MDtcblx0XHRcdFx0XHRjb25zdCBkeD1bXSwgZHk9W10sIGZsYWdzPVtdO1xuXHRcdFx0XG5cdFx0XHRcdFx0Zm9yIChwdD0wOyBwdDxudW1Qb2ludHM7IHB0KyspIHtcblx0XHRcdFx0XHRcdGNvbnN0IFggPSBkeFtwdF0gPSBNYXRoLnJvdW5kKHBvaW50c1twdF1bMF0pIC0gY3g7XG5cdFx0XHRcdFx0XHRjb25zdCBZID0gZHlbcHRdID0gTWF0aC5yb3VuZChwb2ludHNbcHRdWzFdKSAtIGN5O1xuXHRcdFx0XHRcdFx0bGV0IGYgPSBwb2ludHNbcHRdWzJdICYgMHhjMTsgLy8gcHJlc2VydmUgYml0cyAwIChvbi1jdXJ2ZSksIDYgKG92ZXJsYXBzKSwgNyAocmVzZXJ2ZWQpXG5cdFx0XHRcdFx0XHRpZiAoWD09MClcblx0XHRcdFx0XHRcdFx0ZiB8PSAweDEwO1xuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoWCA+PSAtMjU1ICYmIFggPD0gMjU1KVxuXHRcdFx0XHRcdFx0XHRmIHw9IChYID4gMCA/IDB4MTIgOiAweDAyKTtcblx0XHRcblx0XHRcdFx0XHRcdGlmIChZPT0wKVxuXHRcdFx0XHRcdFx0XHRmIHw9IDB4MjA7XG5cdFx0XHRcdFx0XHRlbHNlIGlmIChZID49IC0yNTUgJiYgWSA8PSAyNTUpXG5cdFx0XHRcdFx0XHRcdGYgfD0gKFkgPiAwID8gMHgyNCA6IDB4MDQpO1xuXHRcdFxuXHRcdFx0XHRcdFx0ZmxhZ3NbcHRdID0gZjtcblx0XHRcdFx0XHRcdGN4ID0gcG9pbnRzW3B0XVswXTtcblx0XHRcdFx0XHRcdGN5ID0gcG9pbnRzW3B0XVsxXTtcblx0XHRcdFx0XHR9XG5cdFx0XG5cdFx0XHRcdFx0Ly8gb3ZlcmxhcCBzaWduYWwgZm9yIEFwcGxlXG5cdFx0XHRcdFx0aWYgKG9wdGlvbnMub3ZlcmxhcFNpbXBsZSlcblx0XHRcdFx0XHRcdGZsYWdzWzBdIHw9IDB4NDA7XG5cdFx0XG5cdFx0XHRcdFx0Ly8gd3JpdGUgZmxhZ3Mgd2l0aCBSTEVcblx0XHRcdFx0XHRsZXQgcnB0ID0gMDtcblx0XHRcdFx0XHRmb3IgKHB0PTA7IHB0PG51bVBvaW50czsgcHQrKykge1xuXHRcdFx0XHRcdFx0aWYgKHB0ID4gMCAmJiBycHQgPCAyNTUgJiYgZmxhZ3NbcHRdID09IGZsYWdzW3B0LTFdKSB7XG5cdFx0XHRcdFx0XHRcdHJwdCsrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJwdCA9IDA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XG5cdFx0XHRcdFx0XHRpZiAocnB0PDIpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy51OCA9IGZsYWdzW3B0XTsgLy8gd3JpdGUgd2l0aG91dCBjb21wcmVzc2lvbiAoZG9u4oCZdCBjb21wcmVzcyAyIGNvbnNlY3V0aXZlIGlkZW50aWNhbCBieXRlcylcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBjdXJyZW50UG9zID0gdGhpcy50ZWxsKCk7XG5cdFx0XHRcdFx0XHRcdGlmIChycHQ9PTIpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnNlZWsoY3VycmVudFBvcy0yKTtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnU4ID0gZmxhZ3NbcHRdIHwgMHgwODsgLy8gc2V0IHJlcGVhdCBiaXQgb24gdGhlIHByZS1wcmV2aW91cyBmbGFnIGJ5dGVcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR0aGlzLnNlZWsoY3VycmVudFBvcy0xKTtcblx0XHRcdFx0XHRcdFx0dGhpcy51OCA9IHJwdDsgLy8gd3JpdGUgdGhlIG51bWJlciBvZiByZXBlYXRzXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFxuXHRcdFx0XHRcdC8vIHdyaXRlIHBvaW50IGNvb3JkaW5hdGVzXG5cdFx0XHRcdFx0Zm9yIChwdD0wOyBwdDxudW1Qb2ludHM7IHB0KyspIHtcblx0XHRcdFx0XHRcdGlmIChkeFtwdF0gPT0gMClcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHRpZiAoZHhbcHRdID49IC0yNTUgJiYgZHhbcHRdIDw9IDI1NSlcblx0XHRcdFx0XHRcdFx0dGhpcy51OCA9IChkeFtwdF0+MCkgPyBkeFtwdF0gOiAtZHhbcHRdO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHR0aGlzLmkxNiA9IGR4W3B0XTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Zm9yIChwdD0wOyBwdDxudW1Qb2ludHM7IHB0KyspIHtcblx0XHRcdFx0XHRcdGlmIChkeVtwdF0gPT0gMClcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHRpZiAoZHlbcHRdID49IC0yNTUgJiYgZHlbcHRdIDw9IDI1NSlcblx0XHRcdFx0XHRcdFx0dGhpcy51OCA9IChkeVtwdF0+MCkgPyBkeVtwdF0gOiAtZHlbcHRdO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHR0aGlzLmkxNiA9IGR5W3B0XTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdH0gLy8gc2ltcGxlIGdseXBoIGVuZFxuXHRcblx0XHQvLyAyLiBDT01QT1NJVEUgZ2x5cGhcblx0XHRlbHNlIGlmIChnbHlwaC5udW1iZXJPZkNvbnRvdXJzIDwgMCkge1xuXG5cdFx0XHQvLyBnbHlwaCBoZWFkZXJcblx0XHRcdHRoaXMuZW5jb2RlKEZPUk1BVFMuR2x5cGhIZWFkZXIsIGdseXBoKTsgLy8gVE9ETzogcmVjYWxjdWxhdGUgY29tcG9zaXRlIGJib3ggKHRyaWNreSBpbiBnZW5lcmFsLCBub3QgYmFkIGZvciBzaW1wbGUgdHJhbnNsYXRpb25zKVxuXHRcblx0XHRcdC8vIGNvbXBvbmVudHNcblx0XHRcdGZvciAobGV0IGM9MDsgYzxnbHlwaC5jb21wb25lbnRzLmxlbmd0aDsgYysrKSB7XG5cdFx0XHRcdGxldCBjb21wb25lbnQgPSBnbHlwaC5jb21wb25lbnRzW2NdO1xuXHRcblx0XHRcdFx0Ly8gc2V0IHVwIHRoZSBmbGFnc1xuXHRcdFx0XHRsZXQgZmxhZ3MgPSAwO1xuXHRcdFx0XHRpZiAob3B0aW9ucy5jb21wcmVzc2lvbiA9PSAwKSB7XG5cdFx0XHRcdFx0ZmxhZ3MgfD0gMHgwMDAxOyAvLyBBUkdfMV9BTkRfMl9BUkVfV09SRFNcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRpZiAoICAgKGNvbXBvbmVudC5vZmZzZXQgJiYgKGNvbXBvbmVudC5vZmZzZXRbMF0gPCAtMTI4IHx8IGNvbXBvbmVudC5vZmZzZXRbMF0gPiAxMjcgfHwgY29tcG9uZW50Lm9mZnNldFsxXSA8IC0xMjggfHwgY29tcG9uZW50Lm9mZnNldFsxXSA+IDEyNykpXG5cdFx0XHRcdFx0XHR8fCAoY29tcG9uZW50Lm1hdGNoZWRQb2ludHMgJiYgKGNvbXBvbmVudC5tYXRjaGVkUG9pbnRzWzBdID4gMjU1IHx8IGNvbXBvbmVudC5tYXRjaGVkUG9pbnRzWzFdID4gMjU1KSkgKSB7XG5cdFx0XHRcdFx0XHRmbGFncyB8PSAweDAwMDE7IC8vIEFSR18xX0FORF8yX0FSRV9XT1JEU1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChjb21wb25lbnQub2Zmc2V0KSB7XG5cdFx0XHRcdFx0ZmxhZ3MgfD0gMHgwMDAyOyAvLyBBUkdTX0FSRV9YWV9WQUxVRVNcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoYyA8IGdseXBoLmNvbXBvbmVudHMubGVuZ3RoLTEpIHtcblx0XHRcdFx0XHRmbGFncyB8PSAweDAwMjA7IC8vIE1PUkVfQ09NUE9ORU5UU1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChjb21wb25lbnQuZmxhZ3MgJiAweDAyMDApIHtcblx0XHRcdFx0XHRmbGFncyB8PSAweDAyMDA7IC8vIFVTRV9NWV9NRVRSSUNTIChjb3B5IGZyb20gdGhlIG9yaWdpbmFsIGdseXBoKVxuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIGZsYWcgMHgwMTAwIFdFX0hBVkVfSU5TVFJVQ1RJT05TIGlzIHNldCB0byB6ZXJvXG5cblx0XHRcdFx0Ly8gVE9ETzogaGFuZGxlIHRyYW5zZm9ybXNcblx0XG5cdFx0XHRcdC8vIHdyaXRlIHRoaXMgY29tcG9uZW50XG5cdFx0XHRcdHRoaXMudTE2ID0gZmxhZ3M7XG5cdFx0XHRcdHRoaXMudTE2ID0gY29tcG9uZW50LmdseXBoSWQ7XG5cdFx0XHRcdGlmIChmbGFncyAmIDB4MDAwMikgeyAvLyBBUkdTX0FSRV9YWV9WQUxVRVNcblx0XHRcdFx0XHRpZiAoZmxhZ3MgJiAweDAwMDEpIHsgLy8gQVJHXzFfQU5EXzJfQVJFX1dPUkRTXG5cdFx0XHRcdFx0XHR0aGlzLmkxNiA9IGNvbXBvbmVudC5vZmZzZXRbMF07XG5cdFx0XHRcdFx0XHR0aGlzLmkxNiA9IGNvbXBvbmVudC5vZmZzZXRbMV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhpcy5pOCA9IGNvbXBvbmVudC5vZmZzZXRbMF07XG5cdFx0XHRcdFx0XHR0aGlzLmk4ID0gY29tcG9uZW50Lm9mZnNldFsxXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0aWYgKGZsYWdzICYgMHgwMDAxKSB7IC8vIEFSR18xX0FORF8yX0FSRV9XT1JEU1xuXHRcdFx0XHRcdFx0dGhpcy51MTYgPSBjb21wb25lbnQubWF0Y2hlZFBvaW50c1swXTtcblx0XHRcdFx0XHRcdHRoaXMudTE2ID0gY29tcG9uZW50Lm1hdGNoZWRQb2ludHNbMV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhpcy51OCA9IGNvbXBvbmVudC5tYXRjaGVkUG9pbnRzWzBdO1xuXHRcdFx0XHRcdFx0dGhpcy51OCA9IGNvbXBvbmVudC5tYXRjaGVkUG9pbnRzWzFdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gLy8gY29tcG9zaXRlIGdseXBoIGVuZFxuXHRcblx0XHQvLyBzdG9yZSBtZXRyaWNzIChmb3Igc2ltcGxlLCBjb21wb3NpdGUgYW5kIGVtcHR5IGdseXBocylcblx0XHRpZiAob3B0aW9ucy5tZXRyaWNzKSB7XG5cdFx0XHRvcHRpb25zLm1ldHJpY3NbMF0gPSBwb2ludHNbbnVtUG9pbnRzKzBdWzBdOyAvLyBsc2IgcG9pbnQsIHVzdWFsbHkgMFxuXHRcdFx0b3B0aW9ucy5tZXRyaWNzWzFdID0gcG9pbnRzW251bVBvaW50cysxXVswXTsgLy8gYWR2YW5jZSBwb2ludFxuXHRcdFx0b3B0aW9ucy5tZXRyaWNzWzJdID0gcG9pbnRzW251bVBvaW50cysyXVsxXTsgLy8gdG9wIG1ldHJpYywgdXN1YWxseSAwIGluIGhvcml6b250YWwgZ2x5cGhzXG5cdFx0XHRvcHRpb25zLm1ldHJpY3NbM10gPSBwb2ludHNbbnVtUG9pbnRzKzNdWzFdOyAvLyBib3R0b20gbWV0cmljLCB1c3VhbGx5IDAgaW4gaG9yaXpvbnRhbCBnbHlwaHNcblx0XHR9XG5cdFxuXHRcdHJldHVybiB0aGlzLnRlbGwoKSAtIHRlbGw7IC8vIHNpemUgb2YgYmluYXJ5IGdseXBoIGluIGJ5dGVzXG5cblx0fVxuXG5cdGRlY29kZUl0ZW1WYXJpYXRpb25TdG9yZSgpIHtcblx0XHRjb25zdCBpdnNTdGFydCA9IHRoaXMudGVsbCgpO1xuXHRcdGNvbnN0IGl2cyA9IHRoaXMuZGVjb2RlKEZPUk1BVFMuSXRlbVZhcmlhdGlvblN0b3JlSGVhZGVyKTtcblx0XHR0aGlzLnNlZWsoaXZzU3RhcnQgKyBpdnMucmVnaW9uTGlzdE9mZnNldCk7XG5cblx0XHRpdnMuYXhpc0NvdW50ID0gdGhpcy51MTY7XG5cdFx0aXZzLnJlZ2lvbkNvdW50ID0gdGhpcy51MTY7XG5cdFx0aXZzLnJlZ2lvbnMgPSBbXTsgLy8gZ2V0IHRoZSByZWdpb25zXG5cblx0XHRmb3IgKGxldCByPTA7IHI8aXZzLnJlZ2lvbkNvdW50OyByKyspIHtcblx0XHRcdGNvbnN0IHJlZ2lvbiA9IFtdO1xuXHRcdFx0Zm9yIChsZXQgYT0wOyBhPGl2cy5heGlzQ291bnQ7IGErKykge1xuXHRcdFx0XHRyZWdpb25bYV0gPSBbIHRoaXMuZjIxNCwgdGhpcy5mMjE0LCB0aGlzLmYyMTQgXTtcblx0XHRcdH1cblx0XHRcdGl2cy5yZWdpb25zLnB1c2gocmVnaW9uKTtcblx0XHR9XG5cblx0XHQvLyBkZWNvZGUgdGhlIEl0ZW1WYXJpYXRpb25EYXRhc1xuXHRcdGl2cy5pdmRzID0gW107XG5cdFx0Zm9yIChsZXQgZD0wOyBkPGl2cy5pdGVtVmFyaWF0aW9uRGF0YUNvdW50OyBkKyspIHtcblx0XHRcdHRoaXMuc2VlayhpdnNTdGFydCArIGl2cy5pdGVtVmFyaWF0aW9uRGF0YU9mZnNldHNbZF0pO1xuXHRcdFx0Y29uc3QgaXZkID0ge1xuXHRcdFx0XHRpdGVtQ291bnQ6IHRoaXMudTE2LCAvLyB0aGUgbnVtYmVyIG9mIGl0ZW1zIGluIGVhY2ggZGVsdGFTZXRcblx0XHRcdFx0cmVnaW9uSWRzOiBbXSxcblx0XHRcdFx0ZGVsdGFTZXRzOiBbXSxcblx0XHRcdH07XG5cdFx0XHRsZXQgd29yZERlbHRhQ291bnQgPSB0aGlzLnUxNjtcblx0XHRcdGNvbnN0IHJlZ2lvbkNvdW50ID0gdGhpcy51MTY7XG5cdFx0XHRjb25zdCBsb25nV29yZHMgPSB3b3JkRGVsdGFDb3VudCAmIDB4ODAwMDtcblx0XHRcdHdvcmREZWx0YUNvdW50ICY9IDB4N2ZmZjsgLy8gZml4IHRoZSB2YWx1ZSBmb3IgdXNlXG5cdFx0XHRjb25zb2xlLmFzc2VydChpdmQuaXRlbUNvdW50ID4wLCBcIml2ZC5pdGVtQ291bnQgc2hvdWxkIGJlID4wIGJ1dCBpcyAwXCIpO1xuXHRcdFx0Y29uc29sZS5hc3NlcnQod29yZERlbHRhQ291bnQgPD0gcmVnaW9uQ291bnQsIFwid29yZERlbHRhQ291bnQgc2hvdWxkIG5pY2VseSBiZSA8PSByZWdpb25Db3VudFwiKTtcblx0XHRcdGNvbnNvbGUuYXNzZXJ0KHJlZ2lvbkNvdW50ID4gMCwgXCJyZWdpb25Db3VudCBzaG91bGQgYmUgPjAgYnV0IGlzIDAgKG5vbiBmYXRhbClcIiwgd29yZERlbHRhQ291bnQsICBpdmQpO1xuXHRcdFx0aWYgKGl2ZC5pdGVtQ291bnQgPiAwICYmIHJlZ2lvbkNvdW50ID4gMCAmJiB3b3JkRGVsdGFDb3VudCA8PSByZWdpb25Db3VudCkgeyAvLyBza2lwIGJhZCBJVkRzIChzb21lIG9sZCBmb250IGJ1aWxkcyBoYXZlIHJlZ2lvbkNvdW50PT0wLCBidXQgdGhleSBzZWVtIGhhcm1sZXNzIGlmIHNraXBwZWQpXG5cdFxuXHRcdFx0XHQvLyBwb3B1bGF0ZSByZWdpb25JbmRleGVzXG5cdFx0XHRcdGZvciAobGV0IHI9MDsgcjxyZWdpb25Db3VudDsgcisrKSB7XG5cdFx0XHRcdFx0aXZkLnJlZ2lvbklkcy5wdXNoKHRoaXMudTE2KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGRlY29kZSB0aGUgZGVsdGFTZXRzXG5cdFx0XHRcdGZvciAobGV0IGQ9MDsgZCA8IGl2ZC5pdGVtQ291bnQ7IGQrKykge1xuXHRcdFx0XHRcdGNvbnN0IGRlbHRhU2V0ID0gW107XG5cdFx0XHRcdFx0bGV0IHI9MDtcblx0XHRcdFx0XHR3aGlsZSAociA8IHdvcmREZWx0YUNvdW50KSB7IC8vIGRvbuKAmXQgcmVwbGFjZSByIHdpdGggcisrIGhlcmUhXG5cdFx0XHRcdFx0XHRkZWx0YVNldC5wdXNoKGxvbmdXb3JkcyA/IHRoaXMuaTMyIDogdGhpcy5pMTYpO1xuXHRcdFx0XHRcdFx0cisrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR3aGlsZSAociA8IHJlZ2lvbkNvdW50KSB7IC8vIGRvbuKAmXQgcmVwbGFjZSByIHdpdGggcisrIGhlcmUhXG5cdFx0XHRcdFx0XHRkZWx0YVNldC5wdXNoKGxvbmdXb3JkcyA/IHRoaXMuaTE2IDogdGhpcy5pOCk7XG5cdFx0XHRcdFx0XHRyKys7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGl2ZC5kZWx0YVNldHMucHVzaChkZWx0YVNldCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aXZzLml2ZHMucHVzaChpdmQpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gaXZzO1xuXHR9XG5cblx0Ly8gcGFyc2VyIGZvciB2YXJpYXRpb25JbmRleE1hcFxuXHQvLyAtIGNvbnZlcnRzIGEgY29tcHJlc3NlZCBiaW5hcnkgaW50byBhbiBhcnJheSBvZiBvdXRlciBhbmQgaW5uZXIgdmFsdWVzXG5cdC8vIC0gZWFjaCBlbGVtZW50IGluIHRoZSByZXR1cm5lZCBhcnJheSBpcyBhbiBhcnJheSBvZiAyIGVsZW1lbnRzIG1hZGUgb2YgW291dGVyLCBpbm5lcl1cblx0Ly8gLSBkZWx0YVNldEluZGV4TWFwcyBhcmUgYWx3YXlzIDAtYmFzZWRcblx0ZGVjb2RlSW5kZXhNYXAoKSB7XG5cdFx0Y29uc3QgaW5kZXhNYXAgPSBbXTtcblx0XHRjb25zdCBmb3JtYXQgPSB0aGlzLnU4O1xuXHRcdGNvbnN0IGVudHJ5Rm9ybWF0ID0gdGhpcy51ODtcblx0XHRjb25zdCBtYXBDb3VudCA9IGZvcm1hdCA9PT0gMCA/IHRoaXMudTE2IDogdGhpcy51MzI7XG5cdFx0Y29uc3QgaXRlbVNpemUgPSAoKGVudHJ5Rm9ybWF0ICYgMHgzMCkgPj4gNCkgKyAxO1xuXHRcdGNvbnN0IGlubmVyQml0Q291bnQgPSAoZW50cnlGb3JtYXQgJiAweDBmKSArIDE7XG5cdFx0Y29uc3QgZ2V0dGVycyA9IFswLCBVOCwgVTE2LCBVMjQsIFUzMl07XG5cdFx0Zm9yIChsZXQgbT0wOyBtPG1hcENvdW50OyBtKyspIHtcblx0XHRcdGNvbnN0IGVudHJ5ID0gdGhpcy5nZXR0ZXJzW2dldHRlcnNbaXRlbVNpemVdXSgpOyAvLyB0aGlzLnU4LCB0aGlzLnUxNiwgdGhpcy51MjQsIHRoaXMudTMyXG5cdFx0XHRjb25zdCBvdXRlciA9IGVudHJ5ID4+PiBpbm5lckJpdENvdW50OyAvLyA+Pj4gYXZvaWRzIGNyZWF0aW5nIG5lZ2F0aXZlIHZhbHVlcyAod2Ugd2FudCAweGZmZmYsIG5vdCAtMSlcblx0XHRcdGNvbnN0IGlubmVyID0gZW50cnkgJiAoKDEgPDwgaW5uZXJCaXRDb3VudCkgLSAxKTtcblx0XHRcdGluZGV4TWFwLnB1c2goW291dGVyLCBpbm5lcl0pO1xuXHRcdH1cblx0XHRyZXR1cm4gaW5kZXhNYXA7XG5cdH1cblxuXHQvLyBwYXJzZSBwYWNrZWQgcG9pbnRJZHNcblx0Ly8gLSB1c2VkIGluIGd2YXIgYW5kIGN2YXIgdGFibGVzXG5cdC8vIC0gaHR0cHM6Ly9sZWFybi5taWNyb3NvZnQuY29tL2VuLXVzL3R5cG9ncmFwaHkvb3BlbnR5cGUvc3BlYy9vdHZhcmNvbW1vbmZvcm1hdHMjcGFja2VkLXBvaW50LW51bWJlcnNcblx0ZGVjb2RlUG9pbnRJZHMoKSB7XG5cdFx0Y29uc3QgUE9JTlRTX0FSRV9XT1JEUyA9IDB4ODA7XG5cdFx0Y29uc3QgUE9JTlRfUlVOX0NPVU5UX01BU0sgPSAweDdmO1xuXHRcdGNvbnN0IHBvaW50SWRzID0gW107XG5cdFx0Y29uc3QgX2NvdW50ID0gdGhpcy51ODtcblx0XHRjb25zdCBjb3VudCA9IF9jb3VudCAmIFBPSU5UU19BUkVfV09SRFMgPyAoX2NvdW50ICYgUE9JTlRfUlVOX0NPVU5UX01BU0spICogMHgwMTAwICsgdGhpcy51OCA6IF9jb3VudDtcblx0XHRsZXQgcG9pbnRJZCA9IDA7XG5cdFx0bGV0IGMgPSAwO1xuXHRcdHdoaWxlIChjIDwgY291bnQpIHtcblx0XHRcdGNvbnN0IF9ydW5Db3VudCA9IHRoaXMudTg7XG5cdFx0XHRjb25zdCBydW5Db3VudCA9IChfcnVuQ291bnQgJiBQT0lOVF9SVU5fQ09VTlRfTUFTSykgKyAxO1xuXHRcdFx0Y29uc3QgZ2V0dGVyID0gX3J1bkNvdW50ICYgUE9JTlRTX0FSRV9XT1JEUyA/IHRoaXMuZ2V0dGVyc1tVMTZdIDogdGhpcy5nZXR0ZXJzW1U4XTtcblx0XHRcdGZvciAobGV0IHI9MDsgciA8IHJ1bkNvdW50OyByKyspIHtcblx0XHRcdFx0cG9pbnRJZCArPSBnZXR0ZXIoKTsgLy8gY29udmVydCBkZWx0YSBpZHMgaW50byBhYnNvbHV0ZSBpZHNcblx0XHRcdFx0cG9pbnRJZHMucHVzaChwb2ludElkKTtcblx0XHRcdH1cblx0XHRcdGMgKz0gcnVuQ291bnQ7XG5cdFx0fVxuXHRcdHJldHVybiBwb2ludElkcztcblx0fVxuXG5cdC8vIHBhcnNlIHBhY2tlZCBkZWx0YXNcblx0Ly8gLSB1c2VkIGluIGd2YXIgYW5kIGN2YXIgdGFibGVzXG5cdC8vIC0gaHR0cHM6Ly9sZWFybi5taWNyb3NvZnQuY29tL2VuLXVzL3R5cG9ncmFwaHkvb3BlbnR5cGUvc3BlYy9vdHZhcmNvbW1vbmZvcm1hdHMjcGFja2VkLWRlbHRhc1xuXHRkZWNvZGVEZWx0YXMoY291bnQpIHtcblx0XHRjb25zdCBkZWx0YXMgPSBbXTtcblx0XHRsZXQgZCA9IDA7XG5cdFx0d2hpbGUgKGQgPCBjb3VudCkge1xuXHRcdFx0Y29uc3QgX3J1bkNvdW50ID0gdGhpcy51ODtcblx0XHRcdGNvbnN0IHJ1bkNvdW50ID0gKF9ydW5Db3VudCAmIERFTFRBX1JVTl9DT1VOVF9NQVNLKSArIDE7XG5cdFx0XHRpZiAoX3J1bkNvdW50ICYgREVMVEFTX0FSRV9aRVJPKSB7XG5cdFx0XHRcdGZvciAobGV0IHI9MDsgciA8IHJ1bkNvdW50OyByKyspIHtcblx0XHRcdFx0XHRkZWx0YXNbZCsrXSA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IGdldHRlciA9IF9ydW5Db3VudCAmIERFTFRBU19BUkVfV09SRFMgPyB0aGlzLmdldHRlcnNbSTE2XSA6IHRoaXMuZ2V0dGVyc1tJOF07XG5cdFx0XHRcdGZvciAobGV0IHI9MDsgciA8IHJ1bkNvdW50OyByKyspIHtcblx0XHRcdFx0XHRkZWx0YXNbZCsrXSA9IGdldHRlcigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBkZWx0YXM7XG5cdH1cblxuXHRlbmNvZGVEZWx0YXMoZGVsdGFzKSB7XG5cdFx0Ly8gZGVsdGFzIGFyZSBlbmNvZGVkIGluIGdyb3VwcyBvZiBzaXplIFsxLDY0XSAoMHhmZiAmIERFTFRBX1JVTl9DT1VOVF9NQVNLICsgMSA9IDY0KVxuXHRcdC8vIGNvc3Qgb2Ygc3dpdGNoaW5nIHRvIGEgbmV3IGdyb3VwIGFuZCBiYWNrIGlzIDIgYnl0ZXNcblx0XHQvLyBjb3N0IG9mIG5vdCBzd2l0Y2hpbmcgdG8gemVyb2VzIGlzIDIgYnl0ZXMgcGVyIGRlbHRhIGlmIHdl4oCZcmUgaW4gd29yZHMsIDEgYnl0ZSBwZXIgZGVsdGEgaWYgd2XigJlyZSBpbiBieXRlc1xuXHRcdC8vIGNvc3Qgb2Ygbm90IHN3aXRjaGluZyB0byBieXRlcyBpcyAxIGJ5dGUgcGVyIGRlbHRhXG5cdFx0Ly8gLSBpZGVhbGx5IHdl4oCZZCBsaWtlIHRvIHNraXAgcnVucyBvZiBsZW5ndGggMSwgYnV0IGxldOKAmXMgaWdub3JlIHRoYXQgZm9yIG5vd1xuXHRcdGxldCBkLCByO1xuXHRcdGNvbnN0IG51bUJ5dGVzID0gW107XG5cdFx0ZGVsdGFzLmZvckVhY2goZGVsdGEgPT4ge1xuXHRcdFx0bnVtQnl0ZXMucHVzaCgoZGVsdGEgPT09IDApID8gMCA6IChpblJhbmdlKGRlbHRhLCAtMTI4LCAxMjcpKSA/IDEgOiAyKTtcblx0XHR9KTtcblxuXHRcdC8vIHRoaXMgYWxnbyBjcmVhdGVzIGEgbmV3IHJ1biBmb3IgZWFjaCBkaXN0aW5jdCBudW1CeXRlcyBzZWN0aW9uLCBldmVuIHRob3NlIG9mIGxlbmd0aCAxXG5cdFx0Y29uc3QgcnVucyA9IFtdO1xuXHRcdGQ9MDtcblx0XHRyPTA7XG5cdFx0d2hpbGUgKGQ8ZGVsdGFzLmxlbmd0aCkge1xuXHRcdFx0cnVuc1tyXSA9IFtudW1CeXRlc1tkXSwgMF07IC8vIHdlIHN0b3JlIGRpcmVjdGx5IDAgdG8gbWVhbiAxIGRlbHRhLCAxIHRvIG1lYW4gMiBkZWx0YXMsIG4gdG8gbWVhbiBuKzEgZGVsdGFzLCBldGMuXG5cdFx0XHRsZXQgZF8gPSBkKzE7XG5cdFx0XHR3aGlsZSAoZF88ZGVsdGFzLmxlbmd0aCAmJiBudW1CeXRlc1tkX10gPT0gbnVtQnl0ZXNbZF0gJiYgcnVuc1tyXVsxXSA8IDYzKSB7XG5cdFx0XHRcdHJ1bnNbcl1bMV0rKzsgLy8gNjMgPSAweDNmIGlzIHRoZSBtYXggdmFsdWUgd2Ugd2lsbCBzdG9yZSBoZXJlLCBtZWFuaW5nIDY0IGRlbHRhcyBpbiB0aGUgcnVuXG5cdFx0XHRcdGRfKys7XG5cdFx0XHR9XG5cdFx0XHRkID0gZF87XG5cdFx0XHRyKys7XG5cdFx0fVxuXG5cdFx0Ly8gd3JpdGUgdGhlIHJ1bnNcblx0XHRkPTA7XG5cdFx0cnVucy5mb3JFYWNoKHJ1biA9PiB7XG5cdFx0XHRjb25zdCBbbnVtQnl0ZXMsIHJ1bkNvdW50XSA9IHJ1bjtcblx0XHRcdGNvbnN0IF9ydW5Db3VudCA9IHJ1bkNvdW50IHwgKG51bUJ5dGVzID09IDIgPyBERUxUQVNfQVJFX1dPUkRTIDogMCkgfCAobnVtQnl0ZXMgPT0gMCA/IERFTFRBU19BUkVfWkVSTyA6IDApO1xuXHRcdFx0dGhpcy51OChfcnVuQ291bnQpOyAvLyB0aGlzIGluY29ycG9yYXRlcyBydW5Db3VudCAoYml0cyAwLTUgYW5kIHRoZSBmbGFnIGJpdHMgNiBhbmQgNylcblx0XHRcdGlmIChudW1CeXRlcyA+IDApIHsgLy8gd3JpdGUgbm90aGluZyBmb3IgemVybyBkZWx0YXNcblx0XHRcdFx0Zm9yIChsZXQgaT0wOyBpPD1ydW5Db3VudDsgaSsrKSB7IC8vIDw9IDAgbWVhbnMgMSBpdGVtLCAxIG1lYW5zIDIgaXRlbXMsIGV0Yy5cblx0XHRcdFx0XHRpZiAobnVtQnl0ZXMgPT0gMSlcblx0XHRcdFx0XHRcdHRoaXMuaTgoZGVsdGFzW2QrK10pO1xuXHRcdFx0XHRcdGVsc2UgaWYgKG51bUJ5dGVzID09IDIpXG5cdFx0XHRcdFx0XHR0aGlzLmkxNihkZWx0YXNbZCsrXSk7XG5cdFx0XHRcdH1cdFxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0Ly8gZGVjb2RlVHZ0cygpXG5cdC8vIC0gcGFyc2UgdGhlIHR1cGxlIHZhcmlhdGlvbiB0YWJsZXMgKHR2dHMpLCBhbHNvIGtub3duIGFzIFwiZGVsdGEgc2V0cyB3aXRoIHRoZWlyIHR1cGxlc1wiIGZvciB0aGlzIGdseXBoXG5cdC8vIC0gd2Ugb25seSBnZXQgaGVyZSBmcm9tIGEgZ3ZhciBvciBjdmFyIHRhYmxlXG5cdGRlY29kZVR2dHMoZ2x5cGgpIHtcblx0XG5cdFx0Y29uc3QgdHZ0cyA9IFtdO1xuXHRcdGNvbnN0IGZvbnQgPSBnbHlwaC5mb250O1xuXHRcdGNvbnN0IGd2YXIgPSBmb250Lmd2YXI7XG5cdFx0Y29uc3QgYXhpc0NvdW50ID0gZm9udC5mdmFyLmF4aXNDb3VudDtcblxuXHRcdGNvbnN0IG9mZnNldCA9IGd2YXIudHVwbGVPZmZzZXRzW2dseXBoLmlkXTtcblx0XHRjb25zdCBuZXh0T2Zmc2V0ID0gZ3Zhci50dXBsZU9mZnNldHNbZ2x5cGguaWQrMV07XG5cblx0XHQvLyBkbyB3ZSBoYXZlIHR2dCBkYXRhP1xuXHRcdGlmIChuZXh0T2Zmc2V0IC0gb2Zmc2V0ID4gMCkge1xuXHRcblx0XHRcdC8vIGp1bXAgdG8gdGhlIHR2dCBkYXRhLCByZWNvcmQgdGhlIG9mZnNldFxuXHRcdFx0dGhpcy5zZWVrKGd2YXIuZ2x5cGhWYXJpYXRpb25EYXRhQXJyYXlPZmZzZXQgKyBvZmZzZXQpO1xuXHRcdFx0Y29uc3QgdHZ0U3RhcnQgPSB0aGlzLnRlbGwoKTtcblxuXHRcdFx0Ly8gZ2V0IHR2dHMgaGVhZGVyXG5cdFx0XHRjb25zdCBfdHVwbGVDb3VudCA9IHRoaXMudTE2O1xuXHRcdFx0Y29uc3QgdHVwbGVDb3VudCA9IF90dXBsZUNvdW50ICYgMHgwRkZGO1xuXHRcdFx0Y29uc3Qgb2Zmc2V0VG9TZXJpYWxpemVkRGF0YSA9IHRoaXMudTE2O1xuXG5cdFx0XHQvLyBjcmVhdGUgYWxsIHRoZSB0dXBsZXNcblx0XHRcdGZvciAobGV0IHQ9MDsgdCA8IHR1cGxlQ291bnQ7IHQrKykge1xuXHRcdFx0XHRjb25zdCB0dnQgPSB7XG5cdFx0XHRcdFx0c2VyaWFsaXplZERhdGFTaXplOiB0aGlzLnUxNixcblx0XHRcdFx0XHRmbGFnczogdGhpcy51MTYsIC8vIHR1cGxlSW5kZXggaW4gdGhlIHNwZWNcblx0XHRcdFx0XHRudW1Qb2ludHM6IDAsXG5cdFx0XHRcdFx0c2hhcmVkVHVwbGVJZDogLTEsXG5cdFx0XHRcdFx0cGVhazogW10sXG5cdFx0XHRcdFx0c3RhcnQ6IFtdLFxuXHRcdFx0XHRcdGVuZDogW10sXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Ly8gbW92ZSB0byBhIHJlZ2lvbiByZXByZXNlbnRhdGlvbiwgcmF0aGVyIHRoYW4gcGVhaywgc3RhcnQsIGVuZCBhcnJheXNcblx0XHRcdFx0Ly8gZWl0aGVyIFxuXHRcdFx0XHQvLyByZWdpb24gPSBbW3AwLHAxLHAyLHAzXSxbczAsczEsczIsczNdLFtlMCxlMSxlMixlM11dOyAvLyBmZXdlciBvYmplY3RzIGluIGdlbmVyYWxcblx0XHRcdFx0Ly8gb3Jcblx0XHRcdFx0Ly8gcmVnaW9uID0gW1twMCxzMCxlMF0sW3AxLHMxLGUxXSxbcDIsczIsZTJdLFtwMyxzMyxlM11dOyAvLyBtb3JlIGludHVpdGl2ZSwgYW5kIHVzdWFsbHkgYXhpc0NvdW50IGlzIG1heCAzIG9yIDRcblx0XHRcdFx0Ly8gYWxzbyBjb25zaWRlciBhIHNpbmdsZSBJbnQxNkFycmF5XG5cblx0XHRcdFx0Y29uc3QgdHVwbGVJbmRleCA9IHR2dC5mbGFncyAmIDB4MEZGRjtcblx0XHRcdFx0aWYgKHR2dC5mbGFncyAmIEdWQVJfRU1CRURERURfUEVBS19UVVBMRSkge1xuXHRcdFx0XHRcdGZvciAobGV0IGE9MDsgYTxheGlzQ291bnQ7IGErKykge1xuXHRcdFx0XHRcdFx0dHZ0LnBlYWtbYV0gPSB0aGlzLmYyMTQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHR2dC5zaGFyZWRUdXBsZUlkID0gdHVwbGVJbmRleDtcblx0XHRcdFx0XHR0dnQucGVhayA9IGd2YXIuc2hhcmVkVHVwbGVzW3R1cGxlSW5kZXhdOyAvLyBzZXQgdGhlIHdob2xlIHBlYWsgYXJyYXkgYXQgb25jZSwgVE9ETzogaXQgd291bGQgYmUgYmV0dGVyIGlmIHdlIHRob3VnaHQgaW4gdGVybXMgb2YgcmVnaW9ucywgYW5kIGFzc2lnbmVkIGNvbXBsZXRlIHNoYXJlZCByZWdpb25zXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodHZ0LmZsYWdzICYgR1ZBUl9JTlRFUk1FRElBVEVfUkVHSU9OKSB7XG5cdFx0XHRcdFx0Zm9yIChsZXQgYT0wOyBhPGF4aXNDb3VudDsgYSsrKSB7XG5cdFx0XHRcdFx0XHR0dnQuc3RhcnRbYV0gPSB0aGlzLmYyMTQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGZvciAobGV0IGE9MDsgYTxheGlzQ291bnQ7IGErKykge1xuXHRcdFx0XHRcdFx0dHZ0LmVuZFthXSA9IHRoaXMuZjIxNDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBUT0RPOiBhbGwgdGhlc2UgW2FdIGluZGV4ZXMgYXJlIHVnbHksIHRoaW5rIGluIHRlcm1zIG9mIGEgcmVnaW9uIGluc3RlYWQsIGVhY2ggcmVnaW9uIGhhdmluZyBheGlzQ291bnQgKiBbc3RhcnQscGVhayxlbmRdIGFycmF5cyBhbmQgb3B0aW9uYWxseSBoYXZpbmcgYSBwcmUtbWFkZSBzY2FsYXJcblx0XHRcdFx0Ly8gZml4dXBzXG5cdFx0XHRcdC8vIEkgdGhpbmsgdGhlc2UgYXJlIG9rIGJlY2F1c2UgXCJBbiBpbnRlcm1lZGlhdGUtcmVnaW9uIHR1cGxlIHZhcmlhdGlvbiB0YWJsZSBhZGRpdGlvbmFsbHkgaGFzIHN0YXJ0IGFuZCBlbmQgbi10dXBsZXNcIi5cblx0XHRcdFx0Ly8gSW4gcHJhY3RpY2UsIHdlIGNvdWxkIHJlbW92ZSB0aGlzIHdob2xlIGJsb2NrIGZvciB3ZWxsLWZvcm1lZCBmb250cywgYnV0IHRoZSBzcGVjIGFza3MgdXMgdG8gZm9yY2UgYW55IGludmFsaWQgdHVwbGVzIHRvIG51bGxcblx0XHRcdFx0Ly8gVGhlIGZpcnN0IFwidHZ0LnN0YXJ0W2FdID09PSB1bmRlZmluZWRcIiBibG9jayBzZWVtcyB1bm5lY2Vzc2FyeVxuXHRcdFx0XHRmb3IgKGxldCBhPTA7IGE8YXhpc0NvdW50OyBhKyspIHtcblx0XHRcdFx0XHRpZiAodHZ0LnN0YXJ0W2FdID09PSB1bmRlZmluZWQpIHsgLy8gaW5mZXIgc3RhcnRzIGFuZCBlbmRzIGZyb20gcGVha3M6IGEgc2hhcmVkIHBlYWsgKmNhbiogaGF2ZSBcImVtYmVkZGVkXCIgc3RhcnQgYW5kIGVuZCB0dXBsZXMgKHNlZSBCaXR0ZXIgdmFyaWFibGUgZm9udClcblx0XHRcdFx0XHRcdGlmICh0dnQucGVha1thXSA+IDApIHtcblx0XHRcdFx0XHRcdFx0dHZ0LnN0YXJ0W2FdID0gMDtcblx0XHRcdFx0XHRcdFx0dHZ0LmVuZFthXSA9IDE7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0dHZ0LnN0YXJ0W2FdID0gLTE7XG5cdFx0XHRcdFx0XHRcdHR2dC5lbmRbYV0gPSAwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdGlmICgodHZ0LnN0YXJ0W2FdID4gdHZ0LmVuZFthXSkgfHwgKHR2dC5zdGFydFthXSA8IDAgJiYgdHZ0LmVuZFthXSA+IDApKSAvLyBmb3JjZSBudWxsIGlmIGludmFsaWRcblx0XHRcdFx0XHRcdFx0dHZ0LnN0YXJ0W2FdID0gdHZ0LmVuZFthXSA9IHR2dC5wZWFrW2FdID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdHR2dHMucHVzaCh0dnQpOyAvLyBzdG9yZSB0aGUgdHZ0XG5cdFx0XHR9XG5cblx0XHRcdC8vIGlzIG91ciBwb3NpdGlvbiBvaz9cblx0XHRcdGNvbnNvbGUuYXNzZXJ0KHRoaXMudGVsbCgpID09IHR2dFN0YXJ0ICsgb2Zmc2V0VG9TZXJpYWxpemVkRGF0YSwgXCJkZWNvZGVUdnRzKCk6IGN1cnJlbnQgb2Zmc2V0IGlzIG5vdCBvayAodGhpcy50ZWxsKCkgIT0gdHZ0U3RhcnQgKyBvZmZzZXRUb1NlcmlhbGl6ZWREYXRhKVwiLCB0aGlzLnRlbGwoKSwgdHZ0U3RhcnQgKyBvZmZzZXRUb1NlcmlhbGl6ZWREYXRhKTtcblxuXHRcdFx0Ly8gZ2V0IHBvaW50SWRzIGFuZCBkZWx0YXMgZnJvbSB0aGUgc2VyaWFsaXplZCBkYXRhXG5cdFx0XHR0aGlzLnNlZWsodHZ0U3RhcnQgKyBvZmZzZXRUb1NlcmlhbGl6ZWREYXRhKTsgLy8ganVtcCB0byB0aGUgc2VyaWFsaXplZCBkYXRhIGV4cGxpY2l0bHlcdFx0XG5cdFx0XHRjb25zdCBzaGFyZWRQb2ludElkcyA9IF90dXBsZUNvdW50ICYgR1ZBUl9TSEFSRURfUE9JTlRfTlVNQkVSUyA/IHRoaXMuZGVjb2RlUG9pbnRJZHMoKSA6IHVuZGVmaW5lZDsgLy8gZ2V0IHRoZSBzaGFyZWQgcG9pbnRJZHNcblx0XHRcdGZvciAobGV0IHQ9MDsgdCA8IHR1cGxlQ291bnQ7IHQrKykgeyAvLyBnbyB0aHJ1IGVhY2ggdHVwbGVcblx0XHRcdFx0Y29uc3QgdHZ0ID0gdHZ0c1t0XTtcblx0XHRcdFx0Y29uc3QgcG9pbnRJZHMgPSB0dnQuZmxhZ3MgJiBHVkFSX1BSSVZBVEVfUE9JTlRfTlVNQkVSUyA/IHRoaXMuZGVjb2RlUG9pbnRJZHMoKSA6IHNoYXJlZFBvaW50SWRzOyAvLyB1c2UgcHJpdmF0ZSBwb2ludCBpZHMgb3IgdXNlIHRoZSBzaGFyZWQgcG9pbnQgaWRzXG5cdFx0XHRcdHR2dC5hbGxQb2ludHMgPSBwb2ludElkcy5sZW5ndGggPT0gMDsgLy8gZmxhZyBzcGVjaWFsIGNhc2UgaWYgYWxsIHBvaW50cyBhcmUgdXNlZCwgdGhpcyB0cmlnZ2VycyBJVVAhXG5cdFx0XHRcdGNvbnN0IHR1cGxlTnVtUG9pbnRzID0gdHZ0LmFsbFBvaW50cyA/IGdseXBoLnBvaW50cy5sZW5ndGggOiBwb2ludElkcy5sZW5ndGg7IC8vIGhvdyBtYW55IGRlbHRhcyBkbyB3ZSBuZWVkP1xuXHRcdFx0XHRjb25zdCB4RGVsdGFzID0gdGhpcy5kZWNvZGVEZWx0YXModHVwbGVOdW1Qb2ludHMpO1xuXHRcdFx0XHRjb25zdCB5RGVsdGFzID0gdGhpcy5kZWNvZGVEZWx0YXModHVwbGVOdW1Qb2ludHMpO1xuXHRcdFx0XHR0dnQuZGVsdGFzID0gW107XG5cdFx0XHRcdGlmICh0dnQuYWxsUG9pbnRzKSB7XG5cdFx0XHRcdFx0Zm9yIChsZXQgcHQ9MDsgcHQgPCBnbHlwaC5wb2ludHMubGVuZ3RoOyBwdCsrKSB7XG5cdFx0XHRcdFx0XHR0dnQuZGVsdGFzW3B0XSA9IFt4RGVsdGFzW3B0XSwgeURlbHRhc1twdF1dO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRmb3IgKGxldCBwdD0wLCBwYz0wOyBwdCA8IGdseXBoLnBvaW50cy5sZW5ndGg7IHB0KyspIHtcblx0XHRcdFx0XHRcdGlmIChwdCA8IHBvaW50SWRzW3BjXSB8fCBwYyA+PSB0dXBsZU51bVBvaW50cykge1xuXHRcdFx0XHRcdFx0XHR0dnQuZGVsdGFzW3B0XSA9IG51bGw7IC8vIHRoZXNlIHBvaW50cyB3aWxsIGJlIG1vdmVkIGJ5IElVUFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHR2dC5kZWx0YXNbcHRdID0gW3hEZWx0YXNbcGNdLCB5RGVsdGFzW3BjXV07IC8vIHRoZXNlIHBvaW50cyB3aWxsIGJlIG1vdmVkIGV4cGxpY2l0bHlcblx0XHRcdFx0XHRcdFx0cGMrKztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gYWZ0ZXIgdGhpcywgd2Ugbm8gbG9uZ2VyIG5lZWQgcG9pbnRJZHMsIHJpZ2h0PyBzbyBpdCBuZWVkbuKAmXQgc3RpY2sgYXJvdW5kIGFzIGEgcHJvcGVydHkgb2YgdGhlIHR2dCAoZXhjZXB0IGZvciB2aXN1YWxpemF0aW9uKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB0dnRzO1xuXHR9XG5cblx0ZGVjb2RlUGFpbnQoY29udGV4dCA9IHt9KSB7XG5cblx0XHQvLyByZWFkT3BlcmFuZHMoKVxuXHRcdC8vIC0gdGhpcyByZWFkcyBhbGwgdGhlIHZhcmlhYmxlIG9wZXJhbmRzIGZvciBhIHBhaW50ICh3ZSBhbHNvIHVzZSB0aGlzIGZvciBub24tdmFyaWFibGUgdmVyc2lvbnMgb2YgdGhlIHNhbWUgcGFpbnQpXG5cdFx0Ly8gLSB3ZSBsb29rIHVwIHRoZSBudW1iZXIgb2Ygb3BlcmFuZHMgbmVlZGVkIGluIFBBSU5UX1ZBUl9PUEVSQU5EUywgc28gd2UgY2FuIHVzZSB0aGUgc2FtZSBmdW5jdGlvbiBmb3IgYWxsIHBhaW50IGZvcm1hdHNcblx0XHRjb25zdCByZWFkT3BlcmFuZHMgPSAodHlwZSkgPT4ge1xuXHRcdFx0Y29uc3QgY291bnQgPSBQQUlOVF9WQVJfT1BFUkFORFNbcGFpbnQuZm9ybWF0XTtcblx0XHRcdGZvciAobGV0IGk9MDsgaTxjb3VudDsgaSsrKVxuXHRcdFx0XHRvcGVyYW5kcy5wdXNoKHRoaXMuZ2V0dGVyc1t0eXBlXSgpKTtcblx0XHR9O1xuXHRcdFxuXHRcdC8vIGFkZFZhcmlhdGlvbnMoKVxuXHRcdC8vIC0gYWRkcyB0aGUgdmFyaWF0aW9uIGRlbHRhcyB0byB0aGUgb3BlcmFuZHNcblx0XHQvLyAtIHRoZSBhcnJvdyBmdW5jdGlvbiBrZWVwcyBcInRoaXNcIiAodGhlIGJ1ZmZlcikgaW4gc2NvcGVcblx0XHRjb25zdCBhZGRWYXJpYXRpb25zID0gKG9wZXJhbmRzKSA9PiB7XG5cdFx0XHRjb25zdCB2YXJpYXRpb25zRW5hYmxlZCA9IHRydWU7XG5cdFx0XHRpZiAoIXZhcmlhdGlvbnNFbmFibGVkIHx8IHBhaW50LmZvcm1hdCAlIDIgPT0gMCB8fCBvcGVyYW5kcy5sZW5ndGggPT0gMCkgLy8gdmFyaWF0aW9ucyBlbmFibGVkOyBvbmx5IG9kZC1udW1iZXJlZCBwYWludCBmb3JtYXRzIGhhdmUgdmFyaWF0aW9uczsgd2UgbmVlZCBvcGVyYW5kc1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHRjb25zdCB2YXJJbmRleEJhc2UgPSB0aGlzLnUzMjsgLy8gd2UgbXVzdCByZWFkIHRoaXMgZXZlbiBpZiB3ZSBkb27igJl0IGhhdmUgYW4gaW5zdGFuY2UsIG90aGVyd2lzZSByZWFkaW5nIGdldHMgb3V0IG9mIHN5bmNcblx0XHRcdGlmICh2YXJJbmRleEJhc2UgPT0gMHhmZmZmZmZmZiB8fCAhY29udGV4dC5pbnN0YW5jZSkgLy8gbm8gdmFyaWF0aW9ucyBmb3IgdGhpcyBwYWludDsgd2UgbmVlZCBhbiBpbnN0YW5jZVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHRjb25zdCBkZWx0YXMgPSBjb250ZXh0Lmluc3RhbmNlLmRlbHRhU2V0c1tcIkNPTFJcIl07XG5cdFx0XHRmb3IgKGxldCBpPTA7IGk8b3BlcmFuZHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSB2YXJJbmRleEJhc2UgKyBpO1xuXHRcdFx0XHRjb25zdCBbb3V0ZXIsIGlubmVyXSA9IGNvbHIudmFySW5kZXhNYXBPZmZzZXQgPyBjb2xyLnZhckluZGV4TWFwW2luZGV4XSA6IFtpbmRleCA+Pj4gMTYsIGluZGV4ICYgMHhmZmZmXTsgLy8gZXhwbGljaXQgb3IgaW1wbGljaXQgbWFwcGluZ1xuXHRcdFx0XHRpZiAob3V0ZXIgIT0gMHhmZmZmICYmIGlubmVyICE9IDB4ZmZmZikge1xuXHRcdFx0XHRcdG9wZXJhbmRzW2ldICs9IGRlbHRhc1tvdXRlcl1baW5uZXJdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdC8vIHdlIGRlY29kZSBjb2xvckxpbmUgaGVyZSwgcmF0aGVyIHRoYW4gYXMgYSBtZXRob2Qgb2YgU2Ftc2FCdWZmZXIsIGluIG9yZGVyIHRvIGtlZXAgcGFpbnQgaW4gc2NvcGUgYW5kIHRvIGJlIGFibGUgdG8gdXNlIGFkZFZhcmlhdGlvbnMoKVxuXHRcdC8vIC0gdW5saWtlIG90aGVyIGRlY29kZVggbWV0aG9kcywgaXQgc2V0cyB0aGUgZGF0YSBwb2ludGVyIGFjY29yZGluZyB0byB0aGUgc3VwcGxpZWQgYXJndW1lbnQsIHRoZW4gcmVzdG9yZXMgaXRcblx0XHRjb25zdCBkZWNvZGVDb2xvckxpbmUgPSAoY29sb3JMaW5lT2Zmc2V0KSA9PiB7XG5cdFx0XHRjb25zdCB0ZWxsID0gdGhpcy50ZWxsKCk7XG5cdFx0XHR0aGlzLnNlZWsocGFpbnQub2Zmc2V0ICsgY29sb3JMaW5lT2Zmc2V0KTtcblx0XHRcdGNvbnN0IGNvbG9yTGluZSA9IHtcblx0XHRcdFx0ZXh0ZW5kOiB0aGlzLnU4LCAvLyBvbmUgb2YgRVhURU5EX1BBRCAoMCksIEVYVEVORF9SRVBFQVQgKDEpLCBFWFRFTkRfUkVGTEVDVCAoMilcblx0XHRcdFx0bnVtU3RvcHM6IHRoaXMudTE2LFxuXHRcdFx0XHRjb2xvclN0b3BzOiBbXSxcblx0XHRcdH07XG5cdFx0XHRjb25zdCBvcGVyYW5kcyA9IFtdO1xuXHRcdFx0Zm9yIChsZXQgY3N0PTA7IGNzdDxjb2xvckxpbmUubnVtU3RvcHM7IGNzdCsrKSB7XG5cdFx0XHRcdGNvbnN0IGNvbG9yU3RvcCA9IHt9O1xuXHRcdFx0XHRvcGVyYW5kc1swXSA9IHRoaXMuaTE2OyAvLyBzdG9wT2Zmc2V0XG5cdFx0XHRcdGNvbG9yU3RvcC5wYWxldHRlSW5kZXggPSB0aGlzLnUxNjtcblx0XHRcdFx0b3BlcmFuZHNbMV0gPSB0aGlzLmkxNjsgLy8gYWxwaGFcblx0XHRcdFx0YWRkVmFyaWF0aW9ucyhvcGVyYW5kcyk7XG5cdFx0XHRcdGNvbG9yU3RvcC5zdG9wT2Zmc2V0ID0gb3BlcmFuZHNbMF0gLyAxNjM4NDtcblx0XHRcdFx0Y29sb3JTdG9wLmFscGhhID0gb3BlcmFuZHNbMV0gLyAxNjM4NDtcblx0XHRcdFx0Y29sb3JMaW5lLmNvbG9yU3RvcHMucHVzaChjb2xvclN0b3ApO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5zZWVrKHRlbGwpOyAvLyByZXN0b3JlIHRoZSBkYXRhIHBvaW50ZXJcblx0XHRcdHJldHVybiBjb2xvckxpbmU7XG5cdFx0fTtcblxuXHRcdGNvbnN0IGNvbHIgPSBjb250ZXh0LmZvbnQuQ09MUjtcblx0XHRjb25zdCBwYWludCA9IHtcblx0XHRcdG9mZnNldDogdGhpcy50ZWxsKCksXG5cdFx0XHRmb3JtYXQ6IHRoaXMudTgsXG5cdFx0XHRjaGlsZHJlbjogW10sXG5cdFx0fTtcblx0XHRjb25zdCBvcGVyYW5kcyA9IFtdO1xuXHRcdGxldCB0ZWxsO1xuXG5cdFx0Ly8ga2VlcCB0cmFjayBvZiBwYWludElkcyB3ZSBoYXZlIHVzZWQsIHRvIGF2b2lkIGluZmluaXRlIHJlY3Vyc2lvblxuXHRcdC8vIC0gd2UgdXNlIGFuIEFycmF5IChub3QgYSBTZXQgb3IgYW55dGhpbmcgbm9uLUxJRk8pLCBzaW5jZSB3ZSBuZWVkIHRvIHB1c2ggYW5kIHBvcCBhdCB0aGUgYmVnaW5uaW5nIG9mIGVhY2ggZGVjb2RlUGFpbnQoKVxuXHRcdC8vIC0gaXTigJlzIG9ubHkgcmVsZXZhbnQgdG8gdGVzdCB3aGV0aGVyIHRoZSBwYWludElkIGhhcyBiZWVuIHVzZWQgaW4gdGhlIHBhdGggZnJvbSByb290IHRvIGN1cnJlbnQgbm9kZVxuXHRcdC8vIC0gbXVsdGlwbGUgY2hpbGRyZW4gb2YgdGhlIHNhbWUgcGFyZW50IG1heSB1c2UgdGhlIHNhbWUgcGFpbnRJZCwgZm9yIGV4YW1wbGUgdG8gZmlsbCB0d28gc2hhcGVzIHRoZSBzYW1lIHdheVxuXHRcdC8vIC0gcGFpbnQub2Zmc2V0IGlzIHN1aXRhYmxlIHRvIGlkZW50aWZ5IGVhY2ggcGFpbnRcblx0XHRpZiAoY29udGV4dC5wYWludElkcy5pbmNsdWRlcyhwYWludC5vZmZzZXQpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKGBkZWNvZGVQYWludCgpOiBpbmZpbml0ZSByZWN1cnNpb24gZGV0ZWN0ZWQ6IHBhaW50SWQgJHtwYWludC5vZmZzZXR9IGlzIGFscmVhZHkgdXNlZCBpbiB0aGlzIERBR2ApO1xuXHRcdFx0cmV0dXJuIHBhaW50OyAvLyByZXR1cm4gd2hhdCB3ZSBoYXZlIGZvdW5kIHNvIGZhclxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGNvbnRleHQucGFpbnRJZHMucHVzaChwYWludC5vZmZzZXQpOyAvLyBwdXNoIHRoZSBwYWludElkOiB3ZeKAmWxsIHBvcCBpdCBhdCB0aGUgZW5kIG9mIHRoaXMgcnVuIHRocm91Z2h0IGRlY29kZVBhaW50KCksIHNvIGl0IHdvcmtzIHdlbGwgZm9yIG5lc3RlZCBwYWludHNcblx0XHR9XG5cblx0XHRzd2l0Y2ggKHBhaW50LmZvcm1hdCkge1xuXHRcdFx0Y2FzZSAxOiB7IC8vIFBhaW50Q29sckxheWVyc1xuXHRcdFx0XHRjb25zdCBudW1MYXllcnMgPSB0aGlzLnU4O1xuXHRcdFx0XHRjb25zdCBmaXJzdExheWVySW5kZXggPSB0aGlzLnUzMjtcblx0XHRcdFx0Zm9yIChsZXQgbHlyID0gMDsgbHlyIDwgbnVtTGF5ZXJzOyBseXIrKykge1xuXHRcdFx0XHRcdHRoaXMuc2Vlayhjb2xyLmxheWVyTGlzdFtmaXJzdExheWVySW5kZXggKyBseXJdKTtcblx0XHRcdFx0XHRwYWludC5jaGlsZHJlbi5wdXNoKHRoaXMuZGVjb2RlUGFpbnQoY29udGV4dCkpOyAvLyByZWN1cnNpdmVcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0Y2FzZSAyOiBjYXNlIDM6IHsgLy8gUGFpbnRTb2xpZFxuXHRcdFx0XHRwYWludC5wYWxldHRlSW5kZXggPSB0aGlzLnUxNjtcblx0XHRcdFx0cmVhZE9wZXJhbmRzKEkxNik7XG5cdFx0XHRcdGFkZFZhcmlhdGlvbnMob3BlcmFuZHMpO1xuXHRcdFx0XHRwYWludC5hbHBoYSA9IG9wZXJhbmRzWzBdIC8gMHg0MDAwO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0Y2FzZSA0OiBjYXNlIDU6IGNhc2UgNjogY2FzZSA3OiBjYXNlIDg6IGNhc2UgOTogeyAvLyBhbGwgZ3JhZGllbnQgcGFpbnRzXG5cdFx0XHRcdGNvbnN0IGNvbG9yTGluZU9mZnNldCA9IHRoaXMudTI0O1xuXHRcdFx0XHRwYWludC5jb2xvckxpbmUgPSBkZWNvZGVDb2xvckxpbmUoY29sb3JMaW5lT2Zmc2V0KTtcblx0XHRcdFx0cmVhZE9wZXJhbmRzKEkxNik7XG5cdFx0XHRcdGFkZFZhcmlhdGlvbnMob3BlcmFuZHMpO1xuXHRcdFx0XHRpZiAocGFpbnQuZm9ybWF0IDwgNikgeyAvLyBQYWludExpbmVhckdyYWRpZW50LCBQYWludFZhckxpbmVhckdyYWRpZW50XG5cdFx0XHRcdFx0cGFpbnQucG9pbnRzID0gWyBbb3BlcmFuZHNbMF0sIG9wZXJhbmRzWzFdXSwgW29wZXJhbmRzWzJdLCBvcGVyYW5kc1szXV0sIFtvcGVyYW5kc1s0XSwgb3BlcmFuZHNbNV1dIF07XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAocGFpbnQuZm9ybWF0IDwgOCkgeyAvLyBQYWludFJhZGlhbEdyYWRpZW50LCBQYWludFZhclJhZGlhbEdyYWRpZW50XG5cdFx0XHRcdFx0cGFpbnQucG9pbnRzID0gWyBbb3BlcmFuZHNbMF0sIG9wZXJhbmRzWzFdLCBvcGVyYW5kc1syXV0sIFtvcGVyYW5kc1szXSwgb3BlcmFuZHNbNF0sIG9wZXJhbmRzWzVdXSBdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgeyAvLyBQYWludFN3ZWVwR3JhZGllbnQsIFBhaW50VmFyU3dlZXBHcmFkaWVudFxuXHRcdFx0XHRcdHBhaW50LmNlbnRlciA9IFtvcGVyYW5kc1swXSwgb3BlcmFuZHNbMV1dO1xuXHRcdFx0XHRcdHBhaW50LnN0YXJ0QW5nbGUgPSBvcGVyYW5kc1syXSAvIDB4NDAwMCAqIDE4MDtcblx0XHRcdFx0XHRwYWludC5lbmRBbmdsZSA9IG9wZXJhbmRzWzNdIC8gMHg0MDAwICogMTgwO1x0XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGNhc2UgMTA6IHsgLy8gUGFpbnRHbHlwaFxuXHRcdFx0XHRjb25zdCBuZXh0T2Zmc2V0ID0gdGhpcy51MjQ7XG5cdFx0XHRcdHBhaW50LmdseXBoSUQgPSB0aGlzLnUxNjsgLy8gYnkgYXNzaWduaW5nIGdseXBoaWQgd2UgZ2V0IGFuIGFjdHVhbCBzaGFwZSB0byB1c2Vcblx0XHRcdFx0dGhpcy5zZWVrKHBhaW50Lm9mZnNldCArIG5leHRPZmZzZXQpO1xuXHRcdFx0XHRwYWludC5jaGlsZHJlbi5wdXNoKHRoaXMuZGVjb2RlUGFpbnQoY29udGV4dCkpOyAvLyByZWN1cnNpdmUgKGJ1dCB3ZSBzaG91bGQgb25seSBnZXQgdHJhbnNmb3JtcywgbW9yZSBGb3JtYXQgMTAgdGFibGVzLCBhbmQgYSBmaWxsIGZyb20gbm93IG9uKVxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0Y2FzZSAxMTogeyAvLyBQYWludENvbHJHbHlwaFxuXHRcdFx0XHRjb25zdCBnbHlwaElEID0gdGhpcy51MTY7XG5cdFx0XHRcdHRoaXMuc2Vlayhjb2xyLmJhc2VHbHlwaFBhaW50UmVjb3Jkc1tnbHlwaElEXSk7XG5cdFx0XHRcdHBhaW50LmNoaWxkcmVuLnB1c2godGhpcy5kZWNvZGVQYWludChjb250ZXh0KSk7IC8vIHJlY3Vyc2l2ZVxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0Y2FzZSAxMjogY2FzZSAxMzogeyAvLyBQYWludFRyYW5zZm9ybSwgUGFpbnRWYXJUcmFuc2Zvcm1cblx0XHRcdFx0Y29uc3QgbmV4dE9mZnNldCA9IHRoaXMudTI0O1xuXHRcdFx0XHRjb25zdCB0cmFuc2Zvcm1PZmZzZXQgPSB0aGlzLnUyNDtcblx0XHRcdFx0dGVsbCA9IHRoaXMudGVsbCgpO1xuXHRcdFx0XHR0aGlzLnNlZWsocGFpbnQub2Zmc2V0ICsgdHJhbnNmb3JtT2Zmc2V0KTtcblx0XHRcdFx0cmVhZE9wZXJhbmRzKEkzMik7XG5cdFx0XHRcdHRoaXMuc2Vlayh0ZWxsKTtcblx0XHRcdFx0YWRkVmFyaWF0aW9ucyhvcGVyYW5kcyk7XG5cdFx0XHRcdHBhaW50Lm1hdHJpeCA9IFsgb3BlcmFuZHNbMF0vMHgxMDAwMCwgb3BlcmFuZHNbMV0vMHgxMDAwMCwgb3BlcmFuZHNbMl0vMHgxMDAwMCwgb3BlcmFuZHNbM10vMHgxMDAwMCwgb3BlcmFuZHNbNF0vMHgxMDAwMCwgb3BlcmFuZHNbNV0vMHgxMDAwMCBdO1xuXHRcdFx0XHR0aGlzLnNlZWsocGFpbnQub2Zmc2V0ICsgbmV4dE9mZnNldCk7XG5cdFx0XHRcdHBhaW50LmNoaWxkcmVuLnB1c2godGhpcy5kZWNvZGVQYWludChjb250ZXh0KSk7IC8vIHJlY3Vyc2l2ZVxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0Y2FzZSAxNDogY2FzZSAxNTogeyAvLyBQYWludFRyYW5zbGF0ZSwgUGFpbnRWYXJUcmFuc2xhdGVcblx0XHRcdFx0Y29uc3QgbmV4dE9mZnNldCA9IHRoaXMudTI0O1xuXHRcdFx0XHRyZWFkT3BlcmFuZHMoSTE2KTtcblx0XHRcdFx0YWRkVmFyaWF0aW9ucyhvcGVyYW5kcyk7XG5cdFx0XHRcdHBhaW50LnRyYW5zbGF0ZSA9IFsgb3BlcmFuZHNbMF0sIG9wZXJhbmRzWzFdIF07XG5cdFx0XHRcdHRoaXMuc2VlayhwYWludC5vZmZzZXQgKyBuZXh0T2Zmc2V0KTtcblx0XHRcdFx0cGFpbnQuY2hpbGRyZW4ucHVzaCh0aGlzLmRlY29kZVBhaW50KGNvbnRleHQpKTsgLy8gcmVjdXJzaXZlXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRjYXNlIDE2OiBjYXNlIDE3OiBjYXNlIDE4OiBjYXNlIDE5OiBjYXNlIDIwOiBjYXNlIDIxOiBjYXNlIDIyOiBjYXNlIDIzOiB7IC8vIFBhaW50U2NhbGUgYW5kIHZhcmlhbnQgc2NhbGluZyBmb3JtYXRzXG5cdFx0XHRcdGNvbnN0IG5leHRPZmZzZXQgPSB0aGlzLnUyNDtcblx0XHRcdFx0cmVhZE9wZXJhbmRzKEkxNik7XG5cdFx0XHRcdGFkZFZhcmlhdGlvbnMob3BlcmFuZHMpO1xuXHRcdFx0XHRsZXQgbyA9IDA7XG5cdFx0XHRcdHBhaW50LnNjYWxlID0gWyBvcGVyYW5kc1tvKytdIF07IC8vIHNjYWxlWFxuXHRcdFx0XHRpZiAocGFpbnQuZm9ybWF0ID49IDIwKVxuXHRcdFx0XHRcdHBhaW50LnNjYWxlLnB1c2gob3BlcmFuZHNbbysrXSk7ICAvLyBzY2FsZVlcblx0XHRcdFx0aWYgKHBhaW50LmZvcm1hdCA9PSAxOCB8fCBwYWludC5mb3JtYXQgPT0gMTkgfHwgcGFpbnQuZm9ybWF0ID09IDIyIHx8IHBhaW50LmZvcm1hdCA9PSAyMylcblx0XHRcdFx0XHRwYWludC5jZW50ZXIgPSBbIG9wZXJhbmRzW28rK10sIG9wZXJhbmRzW28rK10gXTsgLy8gY2VudGVyWCwgY2VudGVyWVxuXHRcdFx0XHR0aGlzLnNlZWsocGFpbnQub2Zmc2V0ICsgbmV4dE9mZnNldCk7XG5cdFx0XHRcdHBhaW50LmNoaWxkcmVuLnB1c2godGhpcy5kZWNvZGVQYWludChjb250ZXh0KSk7IC8vIHJlY3Vyc2l2ZVx0XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRjYXNlIDI0OiBjYXNlIDI1OiBjYXNlIDI2OiBjYXNlIDI3OiB7IC8vIFBhaW50Um90YXRlLCBQYWludFZhclJvdGF0ZSwgUGFpbnRSb3RhdGVBcm91bmRDZW50ZXIsIFBhaW50VmFyUm90YXRlQXJvdW5kQ2VudGVyXG5cdFx0XHRcdGNvbnN0IG5leHRPZmZzZXQgPSB0aGlzLnUyNDtcblx0XHRcdFx0cmVhZE9wZXJhbmRzKEkxNik7XG5cdFx0XHRcdGFkZFZhcmlhdGlvbnMob3BlcmFuZHMpO1xuXHRcdFx0XHRwYWludC5yb3RhdGUgPSBvcGVyYW5kc1swXS8weDQwMDAgKiAxODA7IC8vIHdlIHN0b3JlIDEvMTgwIG9mIHRoZSByb3RhdGlvbiBhbmdsZSBhcyBGMjE0XG5cdFx0XHRcdGlmIChwYWludC5mb3JtYXQgPj0gMjYpIHtcblx0XHRcdFx0XHRwYWludC5jZW50ZXIgPSBbIG9wZXJhbmRzWzFdLCBvcGVyYW5kc1syXSBdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuc2VlayhwYWludC5vZmZzZXQgKyBuZXh0T2Zmc2V0KTtcblx0XHRcdFx0cGFpbnQuY2hpbGRyZW4ucHVzaCh0aGlzLmRlY29kZVBhaW50KGNvbnRleHQpKTsgLy8gcmVjdXJzaXZlXHRcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGNhc2UgMjg6IGNhc2UgMjk6IGNhc2UgMzA6IGNhc2UgMzE6IHsgLy8gUGFpbnRTa2V3LCBQYWludFZhclNrZXcsIFBhaW50U2tld0Fyb3VuZENlbnRlciwgUGFpbnRWYXJTa2V3QXJvdW5kQ2VudGVyXG5cdFx0XHRcdGNvbnN0IG5leHRPZmZzZXQgPSB0aGlzLnUyNDtcblx0XHRcdFx0cmVhZE9wZXJhbmRzKEkxNik7XG5cdFx0XHRcdGFkZFZhcmlhdGlvbnMob3BlcmFuZHMpO1xuXHRcdFx0XHRwYWludC5za2V3ID0gWyBvcGVyYW5kc1swXS8weDQwMDAgKiAxODAsIG9wZXJhbmRzWzFdLzB4NDAwMCAqIDE4MCBdOyAvLyB3ZSBzdG9yZSAxLzE4MCBvZiB0aGUgcm90YXRpb24gYW5nbGUgYXMgRjIxNFxuXHRcdFx0XHRpZiAocGFpbnQuZm9ybWF0ID49IDMwKSB7XG5cdFx0XHRcdFx0cGFpbnQuY2VudGVyID0gWyBvcGVyYW5kc1sxXSwgb3BlcmFuZHNbMl0gXTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLnNlZWsocGFpbnQub2Zmc2V0ICsgbmV4dE9mZnNldCk7XG5cdFx0XHRcdHBhaW50LmNoaWxkcmVuLnB1c2godGhpcy5kZWNvZGVQYWludChjb250ZXh0KSk7IC8vIHJlY3Vyc2l2ZVx0XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRjYXNlIDMyOiB7IC8vIFBhaW50Q29tcG9zaXRlXG5cdFx0XHRcdGNvbnN0IHNvdXJjZVBhaW50T2Zmc2V0ID0gdGhpcy51MjQ7XG5cdFx0XHRcdHBhaW50LmNvbXBvc2l0ZU1vZGUgPSB0aGlzLnU4O1xuXHRcdFx0XHRjb25zdCBiYWNrZHJvcFBhaW50T2Zmc2V0ID0gdGhpcy51MjQ7XG5cdFx0XHRcdHRoaXMuc2VlayhwYWludC5vZmZzZXQgKyBzb3VyY2VQYWludE9mZnNldCk7XG5cdFx0XHRcdHBhaW50LmNoaWxkcmVuLnB1c2godGhpcy5kZWNvZGVQYWludChjb250ZXh0KSk7XG5cdFx0XHRcdHRoaXMuc2VlayhwYWludC5vZmZzZXQgKyBiYWNrZHJvcFBhaW50T2Zmc2V0KTtcblx0XHRcdFx0cGFpbnQuY2hpbGRyZW4ucHVzaCh0aGlzLmRlY29kZVBhaW50KGNvbnRleHQpKTtcblx0XHRcdFx0YnJlYWs7XHRcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0ZGVmYXVsdDoge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBVbmtub3duIHBhaW50LmZvcm1hdCAke3BhaW50LmZvcm1hdH0gKG11c3QgYmUgMSA8PSBwYWludC5mb3JtYXQgPD0gMzIpYClcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Y29udGV4dC5wYWludElkcy5wb3AoKTsgLy8gd2UgcG9wIHRoZSBwYWludElkIHdlIHB1c2hlZCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoaXMgZGVjb2RlUGFpbnQoKSwgYnV0IG1pZ2h0IHJldXNlIHRoZSBzYW1lIHBhaW50SWQgaW4gbGF0ZXIgcGFpbnRzIGluIHRoZSBzYW1lIGdseXBoXG5cdFx0cmV0dXJuIHBhaW50OyAvLyBoYXZpbmcgcmVjdXJzZWQgdGhlIHdob2xlIHBhaW50IHRyZWUsIHRoaXMgaXMgbm93IGEgREFHXG5cdH1cbn1cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBTYW1zYUZvbnRcbi8vIC0gbGV04oCZcyBrZWVwIHRoaXMgcHVyZSwgYW5kIGxlYXZlIGZhbmN5IGxvYWRpbmcgZnJvbSBVUkwgb3IgcGF0aCB0byBzcGVjaWFsIHB1cnBvc2UgZnVuY3Rpb25zXG4vLyAtIGJ1ZjogYSBTYW1zYUJ1ZmZlciBjb250YWluaW5nIHRoZSBmb250IChyZXF1aXJlZClcbi8vIC0gb3B0aW9uczogdmFyaW91c1xuLy8gLSBUT0RPOiBhdCBzb21lIHBvaW50IHdlIG5lZWQgaXQgdG8gd29yayB3aXRob3V0IGxvYWRpbmcgYWxsIHRoZSBnbHlwaHMgaW50byBtZW1vcnksIHNvIHRoZXkgc3RheSBpbiBhIGZpbGUsIGUuZy4gb3B0aW9ucy5nbHlwaHNPbkRlbWFuZCA9IHRydWVcbmZ1bmN0aW9uIFNhbXNhRm9udChidWYsIG9wdGlvbnMgPSB7fSkge1xuXG5cdGNvbnNvbGUubG9nKFwiU2Ftc2FGb250IVwiKVxuXG5cdHRoaXMuYnVmID0gYnVmOyAvLyBTYW1zYUJ1ZmZlclxuXHR0aGlzLnRhYmxlcyA9IHt9O1xuXHR0aGlzLnRhYmxlTGlzdCA9IFtdO1xuXHR0aGlzLmdseXBocyA9IFtdO1xuXHR0aGlzLkl0ZW1WYXJpYXRpb25TdG9yZXMgPSB7fTsgLy8ga2V5cyB3aWxsIGJlIFwiYXZhclwiLCBcIk1WQVJcIiwgXCJDT0xSXCIsIFwiQ0ZGMlwiLCBcIkhWQVJcIiwgXCJWVkFSXCIuLi4gdGhleSBhbGwgZ2V0IHJlY2FsY3VsYXRlZCB3aGVuIGEgbmV3IGluc3RhbmNlIGlzIHJlcXVlc3RlZFxuXHR0aGlzLnRhYmxlRGVjb2RlcnMgPSBUQUJMRV9ERUNPREVSUzsgLy8gd2UgYXNzaWduIGl0IGhlcmUgc28gd2UgaGF2ZSBhY2Nlc3MgdG8gaXQgaW4gY29kZSB0aGF0IGltcG9ydHMgdGhlIGxpYnJhcnlcblxuXHQvLyBmb250IGhlYWRlclxuXHR0aGlzLmhlYWRlciA9IGJ1Zi5kZWNvZGUoRk9STUFUUy5UYWJsZURpcmVjdG9yeSk7XG5cblx0Ly8gY3JlYXRlIHRhYmxlIGRpcmVjdG9yeVxuXHRmb3IgKGxldCB0PTA7IHQ8dGhpcy5oZWFkZXIubnVtVGFibGVzOyB0KyspIHtcblx0XHRjb25zdCB0YWJsZSA9IGJ1Zi5kZWNvZGUoRk9STUFUUy5UYWJsZVJlY29yZCk7XG5cdFx0dGhpcy50YWJsZUxpc3QucHVzaCh0aGlzLnRhYmxlc1t0YWJsZS50YWddID0gdGFibGUpO1xuXHR9XG5cblx0Ly8gbG9hZCB0YWJsZXMgaW4gdGhlIGZvbGxvd2luZyBvcmRlclxuXHRjb25zdCByZXF1ZXN0VGFibGVzID0gW1wibmFtZVwiLFwiY21hcFwiLFwiT1MvMlwiLFwibWF4cFwiLFwiaGVhZFwiLFwiaGhlYVwiLFwiaG10eFwiLFwidmhlYVwiLFwidm10eFwiLFwicG9zdFwiLFwiZnZhclwiLFwiZ3ZhclwiLFwiYXZhclwiLFwiQ09MUlwiLFwiQ1BBTFwiLFwiTVZBUlwiLFwiSFZBUlwiLFwiVlZBUlwiLFwiU1RBVFwiLFwiR0RFRlwiLFwiR1BPU1wiLFwiR1NVQlwiLFwiQkFTRVwiXTtcblx0Y29uc3QgcmVxdWlyZVRhYmxlcyA9IFtcIm5hbWVcIixcImNtYXBcIixcIk9TLzJcIixcIm1heHBcIixcImhlYWRcIixcImhoZWFcIixcImhtdHhcIixcInBvc3RcIl07XG5cblx0cmVxdWVzdFRhYmxlcy5mb3JFYWNoKHRhZyA9PiB7XG5cdFx0aWYgKCF0aGlzLnRhYmxlc1t0YWddICYmIHJlcXVpcmVUYWJsZXMuaW5jbHVkZXModGFnKSkge1xuXHRcdFx0Y29uc29sZS5hc3NlcnQodGhpcy50YWJsZXNbdGFnXSwgXCJFUlJPUjogTWlzc2luZyByZXF1aXJlZCB0YWJsZTogXCIsIHRhZyk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMudGFibGVzW3RhZ10pIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiTG9hZGluZyB0YWJsZTogXCIsIHRhZyk7XG5cdFx0XHRjb25zdCB0YnVmID0gdGhpcy5idWZmZXJGcm9tVGFibGUodGFnKTsgLy8gd291bGRu4oCZdCBpdCBiZSBhIGdvb2QgaWRlYSB0byBzdG9yZSBhbGwgdGhlc2UgYnVmZmVycyBhcyBmb250LmF2YXIuYnVmZmVyLCBmb250LkNPTFIuYnVmZmVyLCBldGMuID9cblxuXHRcdFx0Ly8gZGVjb2RlIGZpcnN0IHBhcnQgb2YgdGFibGVcblx0XHRcdGlmIChGT1JNQVRTW3RhZ10pIHtcblx0XHRcdFx0dGhpc1t0YWddID0gdGJ1Zi5kZWNvZGUoRk9STUFUU1t0YWddKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gZGVjb2RlIG1vcmUgb2YgdGhlIHRhYmxlXG5cdFx0XHRpZiAodGhpcy50YWJsZURlY29kZXJzW3RhZ10pIHtcblx0XHRcdFx0dGhpcy50YWJsZURlY29kZXJzW3RhZ10odGhpcywgdGJ1Zik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBsb2FkIEl0ZW1WYXJpYXRpb25TdG9yZXNcblx0Y29uc3QgaXZzVGFncyA9IFtcImF2YXJcIiwgXCJNVkFSXCIsIFwiSFZBUlwiLCBcIlZWQVJcIiwgXCJDT0xSXCJdO1xuXHRpdnNUYWdzLmZvckVhY2godGFnID0+IHtcblx0XHRpZiAodGhpc1t0YWddICYmIHRoaXNbdGFnXS5pdGVtVmFyaWF0aW9uU3RvcmVPZmZzZXQpIHsgLy8gaWYgaXRlbVZhcmlhdGlvblN0b3JlT2Zmc2V0ID09IDAgKGxlZ2l0aW1hdGUgYXQgbGVhc3QgaW4gYXZhciksIGRvIG5vdGhpbmdcblx0XHRcdGJ1Zi5zZWVrKHRoaXMudGFibGVzW3RhZ10ub2Zmc2V0ICsgdGhpc1t0YWddLml0ZW1WYXJpYXRpb25TdG9yZU9mZnNldCk7XG5cdFx0XHR0aGlzW3RhZ10uaXRlbVZhcmlhdGlvblN0b3JlID0gdGhpcy5JdGVtVmFyaWF0aW9uU3RvcmVzW3RhZ10gPSBidWYuZGVjb2RlSXRlbVZhcmlhdGlvblN0b3JlKCk7XG5cdFx0XHRjb25zb2xlLmFzc2VydCh0aGlzW3RhZ10uaXRlbVZhcmlhdGlvblN0b3JlLmF4aXNDb3VudCA9PSB0aGlzLmZ2YXIuYXhpc0NvdW50LCBcImF4aXNDb3VudCBtaXNtYXRjaCBpbiBJdGVtVmFyaWF0aW9uU3RvcmVcIik7XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBvcHRpb25zLmFsbEdseXBoczogbG9hZCBhbGwgZ2x5cGhzXG5cdGlmIChvcHRpb25zLmFsbEdseXBocykge1xuXHRcdGxldCBvZmZzZXQgPSAwO1xuXHRcdC8vIHdlIHNob3VsZCBkbyB0aGlzIGRpZmZlcmVudGx5IGlmIHRoZSBmb250IGlzIG9ubHkgbGlnaHRseSBsb2FkZWQsIGUuZy4gZnJvbSBhIGJpZyBmaWxlIHRoYXQgd2UgZG9u4oCZdCB3YW50IHRvIGxvYWQgaW4gZnVsbFxuXHRcdGZvciAobGV0IGc9MDsgZzx0aGlzLm1heHAubnVtR2x5cGhzOyBnKyspIHtcblx0XHRcdHRoaXMuYnVmLnNlZWsodGhpcy50YWJsZXMubG9jYS5vZmZzZXQgKyAoZysxKSAqICh0aGlzLmhlYWQuaW5kZXhUb0xvY0Zvcm1hdCA/IDQgOiAyKSk7XG5cdFx0XHRjb25zdCBuZXh0T2Zmc2V0ID0gdGhpcy5oZWFkLmluZGV4VG9Mb2NGb3JtYXQgPyBidWYudTMyIDogYnVmLnUxNiAqIDI7XG5cdFx0XHRidWYuc2Vlayh0aGlzLnRhYmxlcy5nbHlmLm9mZnNldCArIG9mZnNldCk7XG5cdFx0XHR0aGlzLmdseXBoc1tnXSA9IGJ1Zi5kZWNvZGVHbHlwaCh7aWQ6IGcsIGZvbnQ6IHRoaXMsIGxlbmd0aDogbmV4dE9mZnNldCAtIG9mZnNldH0pO1xuXHRcdFx0b2Zmc2V0ID0gbmV4dE9mZnNldDtcblx0XHR9XG5cblx0XHQvLyBvcHRpb25zLmFsbFRWVHM6IGxvYWQgYWxsIFRWVHM/XG5cdFx0aWYgKG9wdGlvbnMuYWxsVFZUcyAmJiB0aGlzLmd2YXIpIHtcblx0XHRcdGNvbnN0IGd2YXIgPSB0aGlzLmd2YXI7XG5cdFx0XHRjb25zdCBndmFyQnVmID0gdGhpcy5idWZmZXJGcm9tVGFibGUoXCJndmFyXCIpO1xuXHRcdFx0Zm9yIChsZXQgZz0wOyBnPHRoaXMubWF4cC5udW1HbHlwaHM7IGcrKykge1xuXG5cdFx0XHRcdGlmICghdGhpcy5nbHlwaHNbZ10uZm9udClcblx0XHRcdFx0XHRjb25zb2xlLmxvZyh0aGlzLmdseXBoc1tnXSlcblxuXHRcdFx0XHRpZiAoZ3Zhci50dXBsZU9mZnNldHNbZysxXSA+IGd2YXIudHVwbGVPZmZzZXRzW2ddKSB7IC8vIGRvIHdlIGhhdmUgVFZUIGRhdGE/XG5cdFx0XHRcdFx0Z3ZhckJ1Zi5zZWVrKGd2YXIuZ2x5cGhWYXJpYXRpb25EYXRhQXJyYXlPZmZzZXQgKyBndmFyLnR1cGxlT2Zmc2V0c1tnXSk7XG5cdFx0XHRcdFx0dGhpcy5nbHlwaHNbZ10udHZ0cyA9IGd2YXJCdWYuZGVjb2RlVHZ0cyh0aGlzLmdseXBoc1tnXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5nbHlwaHNbZ10udHZ0cyA9IFtdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cblNhbXNhRm9udC5wcm90b3R5cGUudmFsaWRhdGVDaGVja3N1bXMgPSBmdW5jdGlvbiAoKSB7XG5cdGNvbnN0IGVycm9ycyA9IFtdO1xuXHRmb250LnRhYmxlTGlzdC5mb3JFYWNoKHRhYmxlID0+IHtcblx0XHRsZXQgYWN0dWFsU3VtID0gZm9udC5idWYuY2hlY2tTdW0odGFibGUub2Zmc2V0LCB0YWJsZS5sZW5ndGgsIHRhYmxlLnRhZyA9PSBcImhlYWRcIik7XG5cdFx0aWYgKHRhYmxlLmNoZWNrU3VtICE9PSBhY3R1YWxTdW0pIHtcblx0XHRcdGVycm9ycy5wdXNoKFt0YWJsZS50YWcsIHRhYmxlLnRhYmxlLmNoZWNrU3VtLCBhY3R1YWxTdW1dKTtcblx0XHR9XG5cdH0pO1xuXHRyZXR1cm4gZXJyb3JzO1xufVxuXG5TYW1zYUZvbnQucHJvdG90eXBlLmJ1ZmZlckZyb21UYWJsZSA9IGZ1bmN0aW9uICh0YWcpIHtcblx0cmV0dXJuIG5ldyBTYW1zYUJ1ZmZlcih0aGlzLmJ1Zi5idWZmZXIsIHRoaXMudGFibGVzW3RhZ10ub2Zmc2V0LCB0aGlzLnRhYmxlc1t0YWddLmxlbmd0aCk7XG59XG5cblNhbXNhRm9udC5wcm90b3R5cGUuaXRlbVZhcmlhdGlvblN0b3JlSW5zdGFudGlhdGUgPSBmdW5jdGlvbiAoaXZzLCB0dXBsZSkge1xuXHRjb25zdCBzY2FsYXJzID0gdGhpcy5nZXRWYXJpYXRpb25TY2FsYXJzKGl2cywgdHVwbGUpOyAvLyBnZXQgdGhlIHJlZ2lvbiBzY2FsYXJzOiB3ZSBnZXQgdGhpcyBvbmx5IE9OQ0UgcGVyIGluc3RhbmNlXG5cdGNvbnN0IGludGVycG9sYXRlZERlbHRhcyA9IFtdOyAvLyBhIDJkIGFycmF5IG1hZGUgb2YgKGl2ZC5kZWx0YVNldHMubGVuZ3RoKSBhcnJheXMgb2YgaW50ZXJwb2xhdGVkIGRlbHRhIHZhbHVlc1xuXHRpdnMuaXZkcy5mb3JFYWNoKChpdmQsIGkpID0+IHtcblx0XHRpbnRlcnBvbGF0ZWREZWx0YXNbaV0gPSBbXTtcblx0XHRpdmQuZGVsdGFTZXRzLmZvckVhY2goZGVsdGFTZXQgPT4ge1xuXHRcdFx0bGV0IGQgPSAwO1xuXHRcdFx0ZGVsdGFTZXQuZm9yRWFjaCgoZGVsdGEsIHIpID0+IGQgKz0gc2NhbGFyc1tpdmQucmVnaW9uSWRzW3JdXSAqIGRlbHRhKTsgLy8gdGhpcyBpcyB3aGVyZSB0aGUgZ29vZCBzdHVmZiBoYXBwZW5zIVxuXHRcdFx0aW50ZXJwb2xhdGVkRGVsdGFzW2ldLnB1c2goZCk7XG5cdFx0fSk7XG5cdH0pO1xuXHRyZXR1cm4gaW50ZXJwb2xhdGVkRGVsdGFzOyAvLyAyZCBhcnJheSBvZiB2YWx1ZXMgdGhhdCBuZWVkIHRvIGJlIGFkZGVkIHRvIHRoZSBpdGVtcyB0aGV5IGFwcGx5IHRvXG5cdC8vIGFsdGhvdWdoIGRlbHRhIHZhbHVlcyBhcmUgYWx3YXlzIGludGVnZXJzLCB0aGUgaW50ZXJwb2xhdGVkIGRlbHRhcyB3aWxsIG5vdyBiZSBmbG9hdGluZyBwb2ludCAoaW4gZ2VuZXJhbClcblx0Ly8gSE1NLCBzaG91bGRu4oCZdCB0aGUgbGlzdCBvZiBkZWx0YXMgcGVyIGl0ZW0gY29sbGFwc2UgdG8gYSBzaW5nbGUgaXRlbT9cblx0Ly8gVEhVUzpcblxuXHQvKlxuXHRjb25zdCBzY2FsYXJzID0gdGhpcy5nZXRWYXJpYXRpb25TY2FsYXJzKGl2cywgdHVwbGUpOyAvLyBnZXQgdGhlIHJlZ2lvbiBzY2FsYXJzOiB3ZSBnZXQgdGhpcyBvbmx5IE9OQ0UgcGVyIGluc3RhbmNlXG5cdGNvbnN0IGludGVycG9sYXRlZERlbHRhcyA9IFtdOyAvLyBhIDJkIGFycmF5IG1hZGUgb2YgKGl2ZC5kZWx0YVNldHMubGVuZ3RoKSBhcnJheXMgb2YgaW50ZXJwb2xhdGVkIGRlbHRhIHZhbHVlc1xuXHRpdnMuaXZkcy5mb3JFYWNoKChpdmQsIGkpID0+IHtcblx0XHRpbnRlcnBvbGF0ZWREZWx0YXNbaV0gPSAwO1xuXHRcdGl2ZC5kZWx0YVNldHMuZm9yRWFjaChkZWx0YVNldCA9PiB7XG5cdFx0XHRsZXQgZCA9IDA7XG5cdFx0XHRkZWx0YVNldC5mb3JFYWNoKChkZWx0YSwgcikgPT4gZCArPSBzY2FsYXJzW2l2ZC5yZWdpb25JZHNbcl1dICogZGVsdGEpOyAvLyB0aGlzIGlzIHdoZXJlIHRoZSBnb29kIHN0dWZmIGhhcHBlbnMhXG5cdFx0XHRpbnRlcnBvbGF0ZWREZWx0YXNbaV0gKz0gZDtcblx0XHRcdC8vIGNvdWxkIHdlIGRvIHRoZSBhYm92ZSB3aXRoIGEgcmVkdWNlPyBhbmQgbWF5YmUgdGhlIGVuY2xvc2luZyB0aGluZyBpbiBhbm90aGVyIHJlZHVjZT9cblx0XHR9KTtcblx0fSk7XG5cdHJldHVybiBpbnRlcnBvbGF0ZWREZWx0YXM7IC8vIDJkIGFycmF5IG9mIHZhbHVlcyB0aGF0IG5lZWQgdG8gYmUgYWRkZWQgdG8gdGhlIGl0ZW1zIHRoZXkgYXBwbHkgdG9cblxuXHQvLyBITU0sIG1heWJlIG5vdC4uLiB0aGUgaW5uZXIvb3V0ZXIgdGhpbmcgaXMgZXNzZW50aWFsIHRvIGtlZXBcblx0Ki9cblxuXG59XG5cblNhbXNhRm9udC5wcm90b3R5cGUuZ2V0VmFyaWF0aW9uU2NhbGFyID0gZnVuY3Rpb24gKHJlZ2lvbiwgYXhpc0NvdW50PXRoaXMuZnZhci5heGlzQ291bnQpIHtcblx0bGV0IFMgPSAxOyAvLyBTIHdpbGwgZW5kIHVwIGluIHRoZSByYW5nZSBbMCwgMV1cblx0Zm9yIChsZXQgYT0wOyBhIDwgYXhpc0NvdW50OyBhKyspIHtcblx0XHRjb25zdCBbc3RhcnQsIHBlYWssIGVuZF0gPSByZWdpb25bYV07IC8vIHJlZ2lvblthXSBpcyBhIGxpbmVhclJlZ2lvblxuXHRcdGlmIChwZWFrICE9PSAwKSB7IC8vIGRvZXMgdGhlIGxpbmVhclJlZ2lvbiBwYXJ0aWNpcGF0ZSBpbiB0aGUgY2FsY3VsYXRpb24/XG5cdFx0XHRjb25zdCB2ID0gdHVwbGVbYV07IC8vIHYgaXMgdGhlIGHigJl0aCBub3JtYWxpemVkIGF4aXMgdmFsdWUgZnJvbSB0aGUgdHVwbGVcblx0XHRcdGlmICh2ID09IDApIHtcblx0XHRcdFx0UyA9IDA7XG5cdFx0XHRcdGJyZWFrOyAvLyB6ZXJvIHNjYWxhciwgd2hpY2ggbWFrZXMgUz0wLCBzbyBxdWl0IGxvb3AgKG1heWJlIHRoaXMgaXMgbW9yZSBjb21tb24gdGhhbiB0aGUgdj09cGVhayBjYXNlLCBzbyBzaG91bGQgYmUgdGVzdGVkIGZpcnN0KVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAodiAhPT0gcGVhaykgeyAvLyB3ZSBjb3VsZCBsZXQgdGhlIHY9PXBlYWsgY2FzZSBmYWxsIHRocm91Z2gsIGJ1dCBpdOKAmXMgY29tbW9uIHNvIHdvcnRoIHRlc3RpbmcgZmlyc3Rcblx0XHRcdFx0Y29uc3Qgdk1zdGFydCA9IHYgLSBzdGFydCwgdk1lbmQgPSB2IC0gZW5kOyAvLyBwcmVjYWxjdWxhdGluZyB0aGVzZSBzcGVlZHMgdGhpbmdzIHVwIGEgYml0XG5cdFx0XHRcdGlmICh2TXN0YXJ0IDwgMCB8fCB2TWVuZCA+IDApIHtcblx0XHRcdFx0XHRTID0gMDtcblx0XHRcdFx0XHRicmVhazsgLy8gemVybyBzY2FsYXIsIHdoaWNoIG1ha2VzIFM9MCwgc28gcXVpdCBsb29wIChtYXliZSB0aGlzIGlzIG1vcmUgY29tbW9uIHRoYW4gdGhlIHY9PXBlYWsgY2FzZSwgc28gc2hvdWxkIGJlIHRlc3RlZCBmaXJzdClcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmICh2IDwgcGVhaylcblx0XHRcdFx0XHRTICo9IHZNc3RhcnQgLyAocGVhayAtIHN0YXJ0KTtcblx0XHRcdFx0ZWxzZSAvLyBpZiAodiA+IHBlYWspIC8vIGJlY2F1c2Ugd2UgYWxyZWFkeSB0ZXN0ZWQgYWxsIG90aGVyIHBvc3NpYmlsaXRpZXMgKGluY2x1ZGluZyB2PT1wZWFrKSB3ZSBjYW4gcmVtb3ZlIHRoaXMgdGVzdCBhbmQganVzdCBoYXZlIFwiZWxzZVwiXG5cdFx0XHRcdFx0UyAqPSB2TWVuZCAvIChwZWFrIC0gZW5kKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIFM7XG59XG5cdFxuLy8gcHJvY2VzcyBJdGVtVmFyaWF0aW9uU3RvcmUgdG8gZ2V0IHNjYWxhcnMgZm9yIGFuIGluc3RhbmNlIChpbmNsdWRpbmcgYXZhcjIpXG4vLyAtIHRoZSByZXR1cm5lZCBzY2FsYXJzW25dIGFycmF5IGNvbnRhaW5zIGEgc2NhbGFyIGZvciBlYWNoIHJlZ2lvbiAodGhlcmVmb3JlIHJlZ2lvbnMubGVuZ3RoID09IHNjYWxhcnMubGVuZ3RoKVxuLy9TYW1zYUZvbnQucHJvdG90eXBlLmdldFZhcmlhdGlvblNjYWxhcnMgPSBmdW5jdGlvbiAocmVnaW9ucywgdHVwbGUpIHtcblNhbXNhRm9udC5wcm90b3R5cGUuZ2V0VmFyaWF0aW9uU2NhbGFycyA9IGZ1bmN0aW9uIChpdnMsIHR1cGxlKSB7XG5cdGNvbnN0IHNjYWxhcnMgPSBbXTtcblx0Y29uc3QgcmVnaW9ucyA9IGl2cy5yZWdpb25zO1xuXHRyZWdpb25zLmZvckVhY2gocmVnaW9uID0+IHsgLy8gZm9yIGVhY2ggcmVnaW9uLi4uXG5cdFx0Ly8gLi4uIGdvIHRocnUgZWFjaCBvZiB0aGUgYXhpc0NvdW50IGxpbmVhclJlZ2lvbnMgaW4gdGhlIHJlZ2lvblxuXHRcdGxldCBTID0gMTtcblx0XHRmb3IgKGxldCBhPTA7IGEgPCBpdnMuYXhpc0NvdW50OyBhKyspIHtcblx0XHRcdGNvbnN0IFtzdGFydCwgcGVhaywgZW5kXSA9IHJlZ2lvblthXTtcblx0XHRcdGlmIChwZWFrICE9PSAwKSB7IC8vIGRvZXMgdGhlIGxpbmVhclJlZ2lvbiBwYXJ0aWNpcGF0ZSBpbiB0aGUgY2FsY3VsYXRpb24/XG5cdFx0XHRcdGNvbnN0IHYgPSB0dXBsZVthXTsgLy8gdiBpcyB0aGUgYeKAmXRoIG5vcm1hbGl6ZWQgYXhpcyB2YWx1ZSBmcm9tIHRoZSB0dXBsZVxuXHRcdFx0XHRpZiAodiA9PSAwKSB7XG5cdFx0XHRcdFx0UyA9IDA7XG5cdFx0XHRcdFx0YnJlYWs7IC8vIHplcm8gc2NhbGFyLCB3aGljaCBtYWtlcyBTPTAsIHNvIHF1aXQgbG9vcCAobWF5YmUgdGhpcyBpcyBtb3JlIGNvbW1vbiB0aGFuIHRoZSB2PT1wZWFrIGNhc2UsIHNvIHNob3VsZCBiZSB0ZXN0ZWQgZmlyc3QpXG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAodiAhPT0gcGVhaykgeyAvLyB3ZSBjb3VsZCBsZXQgdGhlIHY9PXBlYWsgY2FzZSBmYWxsIHRocm91Z2gsIGJ1dCBpdOKAmXMgY29tbW9uIHNvIHdvcnRoIHRlc3RpbmcgZmlyc3Rcblx0XHRcdFx0XHRjb25zdCB2TXN0YXJ0ID0gdiAtIHN0YXJ0LCB2TWVuZCA9IHYgLSBlbmQ7IC8vIHByZWNhbGN1bGF0aW5nIHRoZXNlIHNwZWVkcyB0aGluZ3MgdXAgYSBiaXRcblx0XHRcdFx0XHRpZiAodk1zdGFydCA8IDAgfHwgdk1lbmQgPiAwKSB7XG5cdFx0XHRcdFx0XHRTID0gMDtcblx0XHRcdFx0XHRcdGJyZWFrOyAvLyB6ZXJvIHNjYWxhciwgd2hpY2ggbWFrZXMgUz0wLCBzbyBxdWl0IGxvb3AgKG1heWJlIHRoaXMgaXMgbW9yZSBjb21tb24gdGhhbiB0aGUgdj09cGVhayBjYXNlLCBzbyBzaG91bGQgYmUgdGVzdGVkIGZpcnN0KVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmICh2IDwgcGVhaylcblx0XHRcdFx0XHRcdFMgKj0gdk1zdGFydCAvIChwZWFrIC0gc3RhcnQpO1xuXHRcdFx0XHRcdGVsc2UgaWYgKHYgPiBwZWFrKSAvLyBiZWNhdXNlIHdlIGFscmVhZHkgdGVzdGVkIGFsbCBvdGhlciBwb3NzaWJpbGl0aWVzIChpbmNsdWRpbmcgdj09cGVhaykgd2UgY291bGQgcmVtb3ZlIHRoaXMgdGVzdCBhbmQganVzdCBoYXZlIFwiZWxzZVwiXG5cdFx0XHRcdFx0XHRTICo9IHZNZW5kIC8gKHBlYWsgLSBlbmQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHNjYWxhcnMucHVzaChTKTtcblx0fSk7XG5cdHJldHVybiBzY2FsYXJzO1xufVxuXG5TYW1zYUZvbnQucHJvdG90eXBlLmxvYWRHbHlwaEJ5SWQgPSBmdW5jdGlvbiAoaWQpIHtcblx0dGhpcy5idWYuc2Vlayh0aGlzLnRhYmxlcy5sb2NhLm9mZnNldCArIGlkICogKHRoaXMuaGVhZC5pbmRleFRvTG9jRm9ybWF0ID8gNCA6IDIpKTtcblx0Y29uc3Qgb2Zmc2V0ID0gdGhpcy5oZWFkLmluZGV4VG9Mb2NGb3JtYXQgPyBbYnVmLnUzMiwgYnVmLnUzMl0gOiBbYnVmLnUxNiAqIDIsIGJ1Zi51MTYgKiAyXTtcblx0YnVmLnNlZWsodGhpcy50YWJsZXMuZ2x5Zi5vZmZzZXQgKyBvZmZzZXQpO1xuXHR0aGlzLmdseXBoc1tnXSA9IGJ1Zi5kZWNvZGVHbHlwaCh7aWQ6IGlkLCBmb250OiB0aGlzLCBsZW5ndGg6IG9mZnNldHNbMV0gLSBvZmZzZXRzWzBdfSk7XG59XG5cbi8vIFNhbXNhRm9udC5nbHlwaElkRnJvbVVuaWNvZGUoKSDigJPCoHJldHVybnMgZ2x5cGhJZCBmb3IgYSBnaXZlbiB1bmljb2RlIGNvZGUgcG9pbnRcbi8vIHVuaTogdGhlIGNvZGUgcG9pbnRcbi8vIHJldHVybjogdGhlIGdseXBoSWQgKDAgaWYgbm90IGZvdW5kKVxuLy8gTm90ZXM6IEhhbmRsZXMgZm9ybWF0cyAxLCA0LCAxMi5cblNhbXNhRm9udC5wcm90b3R5cGUuZ2x5cGhJZEZyb21Vbmljb2RlID0gZnVuY3Rpb24gKHVuaSkge1xuXG5cdGNvbnN0IGNtYXAgPSB0aGlzLmNtYXA7XG5cdGNvbnN0IGNoYXJhY3Rlck1hcCA9IGNtYXAuY2hhcmFjdGVyTWFwO1xuXHRjb25zdCB0YnVmID0gdGhpcy5idWZmZXJGcm9tVGFibGUoXCJjbWFwXCIpO1xuXHRsZXQgZz0wO1xuXG5cdHN3aXRjaCAoY2hhcmFjdGVyTWFwLmZvcm1hdCkge1xuXG5cdFx0Y2FzZSAxOiB7XG5cdFx0XHQvL2cgPSBjaGFyYWN0ZXJNYXAubWFwcGluZyh1bmkpID8/IDA7XG5cdFx0XHRnID0gY2hhcmFjdGVyTWFwLm1hcHBpbmcodW5pKSA/IGNoYXJhY3Rlck1hcC5tYXBwaW5nKHVuaSkgOiAwO1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0Y2FzZSA0OiB7XG5cdFx0XHQvLyBhbGdvOiBodHRwczovL2xlYXJuLm1pY3Jvc29mdC5jb20vZW4tdXMvdHlwb2dyYXBoeS9vcGVudHlwZS9zcGVjL2NtYXAjZm9ybWF0LTQtc2VnbWVudC1tYXBwaW5nLXRvLWRlbHRhLXZhbHVlc1xuXHRcdFx0bGV0IHMsIHNlZ21lbnQ7XG5cdFx0XHRmb3IgKHM9MDsgczxjaGFyYWN0ZXJNYXAuc2VnbWVudHMubGVuZ3RoOyBzKyspIHsgLy8gdGhpcyBjb3VsZCBiZSBhIGJpbmFyeSBzZWFyY2hcblx0XHRcdFx0c2VnbWVudCA9IGNoYXJhY3Rlck1hcC5zZWdtZW50c1tzXTtcblx0XHRcdFx0aWYgKHVuaSA+PSBzZWdtZW50LnN0YXJ0ICYmIHVuaSA8PSBzZWdtZW50LmVuZCkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChzIDwgY2hhcmFjdGVyTWFwLnNlZ21lbnRzLmxlbmd0aCAtIDEpIHtcblx0XHRcdFx0aWYgKHNlZ21lbnQuaWRSYW5nZU9mZnNldCkge1xuXHRcdFx0XHRcdHRidWYuc2VlayhjaGFyYWN0ZXJNYXAuaWRSYW5nZU9mZnNldE9mZnNldCArIHMgKiAyICsgc2VnbWVudC5pZFJhbmdlT2Zmc2V0ICsgKHVuaSAtIHNlZ21lbnQuc3RhcnQpICogMik7XG5cdFx0XHRcdFx0ZyA9IHRidWYudTE2O1xuXHRcdFx0XHRcdGlmIChnID4gMClcblx0XHRcdFx0XHRcdGcgKz0gc2VnbWVudC5pZERlbHRhO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGcgPSB1bmkgKyBzZWdtZW50LmlkRGVsdGE7XG5cdFx0XHRcdH1cdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdGcgJT0gMHgxMDAwMDtcblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdGNhc2UgMTI6IHtcblx0XHRcdGZvciAobGV0IGdycD0wOyBncnA8Y2hhcmFjdGVyTWFwLmdyb3Vwcy5sZW5ndGg7IGdycCsrKSB7XG5cdFx0XHRcdGNvbnN0IGdyb3VwID0gY2hhcmFjdGVyTWFwLmdyb3Vwc1tncnBdO1xuXHRcdFx0XHRpZiAodW5pID49IGdyb3VwLnN0YXJ0ICYmIHVuaSA8PSBncm91cC5lbmQpIHtcblx0XHRcdFx0XHRnID0gZ3JvdXAuZ2x5cGhJZCArIHVuaSAtIGdyb3VwLnN0YXJ0O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0YnJlYWs7XG5cdH1cblxuXHRyZXR1cm4gZztcbn1cblxuXG4vLyB1dGlsaXR5IGZ1bmN0aW9uc1xuLy8gLSB0aGVzZSBkb27igJl0IHVzZSB0aGUgZm9udCBhdCBhbGwsIGJ1dCBpdOKAmXMgYSB3YXkgdG8gZ2V0IHRoZW0gZXhwb3J0ZWRcblNhbXNhRm9udC5wcm90b3R5cGUubGluZWFyR3JhZGllbnRGcm9tVGhyZWVQb2ludHMgPSBmdW5jdGlvbiAocG9pbnRzKSB7XG5cdGNvbnN0XG5cdFx0cDB4ID0gcG9pbnRzWzBdWzBdLFxuXHRcdHAweSA9IHBvaW50c1swXVsxXSxcblx0XHRwMXggPSBwb2ludHNbMV1bMF0sXG5cdFx0cDF5ID0gcG9pbnRzWzFdWzFdLFxuXHRcdHAyeCA9IHBvaW50c1syXVswXSxcblx0XHRwMnkgPSBwb2ludHNbMl1bMV0sXG5cdFx0ZDF4ID0gcDF4IC0gcDB4LFxuXHRcdGQxeSA9IHAxeSAtIHAweSxcblx0XHRkMnggPSBwMnggLSBwMHgsXG5cdFx0ZDJ5ID0gcDJ5IC0gcDB5LFxuXHRcdGRvdFByb2QgPSBkMXgqZDJ4ICsgZDF5KmQyeSxcblx0XHRyb3RMZW5ndGhTcXVhcmVkID0gZDJ4KmQyeCArIGQyeSpkMnksXG5cdFx0bWFnbml0dWRlID0gZG90UHJvZCAvIHJvdExlbmd0aFNxdWFyZWQsXG5cdFx0ZmluYWxYID0gcDF4IC0gbWFnbml0dWRlICogZDJ4LFxuXHRcdGZpbmFsWSA9IHAxeSAtIG1hZ25pdHVkZSAqIGQyeTtcblxuXHRyZXR1cm4gW2ZpbmFsWCwgZmluYWxZXTtcbn1cblxuU2Ftc2FGb250LnByb3RvdHlwZS5oZXhDb2xvckZyb21VMzIgPSBmdW5jdGlvbiAobnVtKSB7XG5cdGxldCBoZXggPSAoKCgobnVtICYgMHhmZjAwMDAwMCkgPj4+IDE2KSB8IChudW0gJiAweDAwZmYwMDAwKSB8ICgobnVtICYgMHgwMDAwZmYwMCkgPDwgMTYpIHwgbnVtICYgMHgwMDAwMDBmZikgPj4+IDApLnRvU3RyaW5nKDE2KS5wYWRTdGFydCg4LCBcIjBcIik7XG5cdGlmIChoZXguZW5kc1dpdGgoXCJmZlwiKSlcblx0XHRoZXggPSBoZXguc3Vic3RyaW5nKDAsIDYpO1xuXHRpZiAoaGV4WzBdID09IGhleFsxXSAmJiBoZXhbMl0gPT0gaGV4WzNdICYmIGhleFs0XSA9PSBoZXhbNV0gJiYgKGhleC5sZW5ndGggPT0gOCA/IGhleFs2XSA9PSBoZXhbN10gOiB0cnVlKSlcblx0XHRoZXggPSBoZXhbMF0gKyBoZXhbMl0gKyBoZXhbNF0gKyAoaGV4Lmxlbmd0aCA9PSA4ID8gaGV4WzZdIDogXCJcIik7XG5cdHJldHVybiBcIiNcIiArIGhleDtcbn1cblxuU2Ftc2FGb250LnByb3RvdHlwZS51MzJGcm9tSGV4Q29sb3IgPSBmdW5jdGlvbiAoaGV4LCBvcGFjaXR5PTEpIHtcblx0aWYgKGhleFswXSA9PSBcIiNcIikge1xuXHRcdGhleCA9IGhleC5zdWJzdHJpbmcoMSk7XG5cdH1cblx0aWYgKGhleC5tYXRjaCgvXlswLTlhLWZdezMsOH0kL2kpICYmIGhleC5sZW5ndGggPT0gMyB8fCBoZXgubGVuZ3RoID09IDQgfHwgaGV4Lmxlbmd0aCA9PSA2IHx8IGhleC5sZW5ndGggPT0gOCkge1xuXHRcdGlmIChoZXgubGVuZ3RoIDw9IDQpIHtcblx0XHRcdGhleCA9IGhleFswXSArIGhleFswXSArIGhleFsxXSArIGhleFsxXSArIGhleFsyXSArIGhleFsyXSArIChoZXgubGVuZ3RoID09IDQgPyBoZXhbM10gKyBoZXhbM10gOiBcIlwiKTtcblx0XHR9XG5cdFx0aWYgKGhleC5sZW5ndGggPT0gNikge1xuXHRcdFx0aGV4ICs9IChvcGFjaXR5ICogMjU1KS50b1N0cmluZygxNikucGFkU3RhcnQoMixcIjBcIik7XG5cdFx0fVxuXHRcdHJldHVybiBwYXJzZUludChoZXguc3Vic3RyaW5nKDQsNiksIDE2KSAqIDB4MTAwMDAwMCArIHBhcnNlSW50KGhleC5zdWJzdHJpbmcoMiw0KSwgMTYpICogMHgxMDAwMCArIHBhcnNlSW50KGhleC5zdWJzdHJpbmcoMCwyKSwgMTYpICogMHgxMDAgKyBwYXJzZUludChoZXguc3Vic3RyaW5nKDYsOCksIDE2KTtcblx0fVxuXHRlbHNlIHtcblx0XHRyZXR1cm4gMHgwMDAwMDBmZjsgLy8gYmFjayB0byBibGFja1xuXHR9XG59XG5cbi8vIC0gZ2x5cGhMYXlvdXQ6IGFycmF5IFxuLy8gLSByZXR1cm46IFNWRyByZWFkeSB0byB1c2UsIHByb2JhYmx5IHdpdGggYSB0cmFuc2Zvcm0gYW5kIHZpZXdib3hcblNhbXNhSW5zdGFuY2UucHJvdG90eXBlLnN2Z0Zyb21HbHlwaExheW91dCA9IGZ1bmN0aW9uIChnbHlwaExheW91dCkge1xuXG5cdGdseXBoTGF5b3V0LmZvckVhY2goZ2x5cGhJblJ1biA9PiB7XG5cdFx0Y29uc3QgW2dseXBoSWQsIHRyYW5zbGF0ZV0gPSBnbHlwaEluUnVuO1xuXHR9KTtcblx0cmV0dXJuIHN2Zztcbn1cblxuXG4vLyB0YWtlIGFuIGFycmF5IG9mIGdseXBoaWRzLCBhbmQgcmV0dXJuIGEgc2VxdWVuY2Ugb2YgZ2x5cGhpZHMgd2l0aCBsYXlvdXQgaW5mb3JtYXRpb25cbi8vIC0gZ2x5cGhJZHM6IGFycmF5IG9mIGdseXBoIGlkc1xuLy8gLSByZXR1cm46IGdseXBoTGF5b3V0LCBhbiBhcnJheSBvZiBvYmplY3RzLCB3aGVyZSBlYWNoIG9iamVjdCBoYXMgYSBnbHlwaCBhbmQgYW4gYWJzb2x1dGUgeHkgb2Zmc2V0XG5cbi8vIC0gbm90ZSB0aGF0IHdlIGFyZSBuZXV0cmFsIGhlcmUgcmVnYXJkaW5nIG91dHB1dCBmb3JtYXRcbi8vIC0gc2hvdWxkbuKAmXQgaXQgYmUgU2Ftc2FJbnN0YW5jZT8/XG5TYW1zYUluc3RhbmNlLnByb3RvdHlwZS5nbHlwaExheW91dEZyb21HbHlwaFJ1biA9IGZ1bmN0aW9uIChnbHlwaElkcykge1xuXG5cdC8vIHdlIGNhbiB1c2UgaG10eCwgdm10eCwgSFZBUiwgVlZBUiBmb3IgdGhpc1xuXG5cdGNvbnN0IGdseXBoTGF5b3V0ID0gW107XG5cblx0Y29uc3QgaG9yaXpvbnRhbEFkdmFuY2UgPSA3Nzc7XG5cdGNvbnN0IHZlcnRpY2FsQWR2YW5jZSA9IDc3NztcblxuXHQvLyB1aGguLi4gaGFuZGxlIE9wZW5UeXBlIExheW91dCB0YWJsZXMgaGVyZS4uLiBHU1VCLCBHUE9TLCBHREVGLi4uXG5cblxuXHRnbHlwaElkcy5mb3JFYWNoKGdseXBoSWQgPT4ge1xuXHRcdFxuXHRcdGNvbnN0IGxheW91dE9iaiA9IHtcblx0XHRcdGdseXBoOiBnbHlwaElkLFxuXHRcdFx0YWR2YW5jZTogW2hvcml6b250YWxBZHZhbmNlLCB2ZXJ0aWNhbEFkdmFuY2VdLFxuXHRcdH1cblxuXHRcdGdseXBoTGF5b3V0LnB1c2gobGF5b3V0T2JqKTtcblx0fSk7XG5cdFxuXHRyZXR1cm4gZ2x5cGhMYXlvdXQ7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gIHR1cGxlRnJvbUZ2cygpXG4vLyAtIGZ2cyBpcyBhbiBvYmplY3Qgd2hlcmUgYXhpcyB0YWdzIGFyZSBrZXlzIGFuZCBheGlzIHZhbHVlcyBhcmUgdmFsdWVzXG4vLyAtIHJldHVybnM6IGEgdHVwbGUgb2YgbGVuZ3RoIHRoaXMuYXhpc0NvdW50LCB3aXRoIHZhbHVlcyBub3JtYWxpemVkICp3aXRob3V0KiBhdmFyIG1hcHBpbmc7IHRoaXMgdHVwbGUgaXMgc3VpdGFibGUgdG8gc3VwcGx5IG5ldyBTYW1zYUluc3RhbmNlKClcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblNhbXNhRm9udC5wcm90b3R5cGUudHVwbGVGcm9tRnZzID0gZnVuY3Rpb24gKGZ2cykge1xuXG5cdGxldCB0dXBsZSA9IFtdO1xuXHRsZXQgdmFsaWQgPSB0cnVlO1xuXHRpZiAoIXRoaXMuZnZhcilcblx0XHRyZXR1cm4gdHVwbGU7XG5cblx0dGhpcy5mdmFyLmF4ZXMuZm9yRWFjaCgoYXhpcyxhKSA9PiB7XG5cdFx0Y29uc3QgdmFsID0gKCFmdnMgfHwgZnZzW2F4aXMuYXhpc1RhZ10gPT09IHVuZGVmaW5lZCkgPyBheGlzLmRlZmF1bHRWYWx1ZSA6IDEgKiBmdnNbYXhpcy5heGlzVGFnXTtcblx0XHRsZXQgbjsgLy8gbm9ybWFsaXplZCB2YWx1ZVxuXHRcdGlmICh2YWwgPT0gYXhpcy5kZWZhdWx0VmFsdWUpXG5cdFx0XHRuID0gMDtcblx0XHRlbHNlIGlmICh2YWwgPiBheGlzLmRlZmF1bHRWYWx1ZSkge1xuXHRcdFx0aWYgKHZhbCA+IGF4aXMubWF4VmFsdWUpIC8vIGJ5IHVzaW5nID4gcmF0aGVyIHRoYW4gPj0gaGVyZSB3ZSBlbnN1cmUgY2xhbXBpbmcgd29ya3MgcHJvcGVybHlcblx0XHRcdFx0biA9IDE7XG5cdFx0XHRlbHNlXG5cdFx0XHRcdG4gPSBheGlzLm1heFZhbHVlPT1heGlzLmRlZmF1bHRWYWx1ZT8gMCA6ICh2YWwgLSBheGlzLmRlZmF1bHRWYWx1ZSkgLyAoYXhpcy5tYXhWYWx1ZSAtIGF4aXMuZGVmYXVsdFZhbHVlKTtcblx0XHR9XG5cdFx0ZWxzZSB7IC8vIHZhbCA8IGF4aXMuZGVmYXVsdFZhbHVlXG5cdFx0XHRpZiAodmFsIDwgYXhpcy5taW5WYWx1ZSlcblx0XHRcdFx0biA9IC0xO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRuID0gYXhpcy5taW5WYWx1ZT09YXhpcy5kZWZhdWx0VmFsdWU/IDAgOiAoYXhpcy5kZWZhdWx0VmFsdWUgLSB2YWwpIC8gKGF4aXMubWluVmFsdWUgLSBheGlzLmRlZmF1bHRWYWx1ZSk7XG5cdFx0fVxuXHRcdHR1cGxlW2FdID0gbjtcblx0fSk7XG5cblx0cmV0dXJuIHZhbGlkID8gdHVwbGUgOiBBcnJheSh0aGlzLmZ2YXIuYXhpc0NvdW50KS5maWxsKDApO1xufVxuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gU2Ftc2FJbnN0YW5jZVxuLy8gLSBmb250IGlzIGEgU2Ftc2FGb250XG4vLyAtIHR1cGxlIGlzIGEgZmluYWwgdHVwbGUsIGFmdGVyIHByb2Nlc3NpbmcgYnkgYXZhciAtIE5PIElU4oCZUyBOT1QsIElU4oCZUyBUSEUgT1JJR0lOQUwgVFVQTEVcbmZ1bmN0aW9uIFNhbXNhSW5zdGFuY2UoZm9udCwgdXNlclR1cGxlLCBvcHRpb25zPXt9KSB7XG5cblx0Ly9jb25zb2xlLmxvZyhcIkluIFNhbXNhSW5zdGFuY2UgY3JlYXRpbmcgd2l0aCBcIiwgdXNlclR1cGxlKTtcblx0dGhpcy5mb250ID0gZm9udDtcblx0Y29uc3Qge2F2YXIsIGd2YXJ9ID0gZm9udDsgLy8gZGVzdHJ1Y3R1cmUgdGFibGUgZGF0YSBvYmplY3RzXG5cdHRoaXMudHVwbGUgPSBbLi4udXNlclR1cGxlXTsgLy8gYW55IGF2YXIyIGNoYW5nZXMgdG8gdHVwbGUgYXJlIHByZXNlcnZlZCBpbiB0aGUgaW5zdGFuY2UgdmlhIHRoaXMudHVwbGU7IG1heWJlIHdlIHNob3VsZCBrZWVwIHRoZSB1bnRyYW5zZm9ybWVkIHR1cGxlIGFyb3VuZCBmb3IgU2Ftc2Etc3R5bGUgZGVidWdnaW5nIGV0Yy5cblx0Y29uc3QgdHVwbGUgPSB0aGlzLnR1cGxlO1xuXHR0aGlzLmdseXBocyA9IFtdO1xuXHR0aGlzLmRlbHRhU2V0cyA9IHt9OyAvLyBkZWx0YVNldHMgZnJvbSBJdGVtVmFyaWF0aW9uU3RvcmU6IGtleXMgYXJlIFwiTVZBUlwiLCBcIkNPTFJcIiBldGMuIE5vdGUgdGhhdCBlYWNoIHNldCBvZiBkZWx0YXMgY29ycmVzcG9uZHMgdG8gZGlmZmVyZW50IHR5cGVzIG9mIGRlZmF1bHQgaXRlbS5cblx0dGhpcy5zaGFyZWRTY2FsYXJzID0gW107IC8vIHNjYWxhcnMgZm9yIHRoZSBzaGFyZWRUdXBsZXMgYXJlIGNhbGN1bGF0ZWQganVzdCBvbmNlIHBlciBpbnN0YW5jZVxuXHRjb25zdCBidWYgPSBmb250LmJ1Zjtcblx0Y29uc3QgYXhpc0NvdW50ID0gZm9udC5mdmFyID8gZm9udC5mdmFyLmF4aXNDb3VudCA6IDA7XG5cblx0Ly8gdmFsaWRhdGUgdHVwbGVcblx0aWYgKCF2YWxpZGF0ZVR1cGxlICh0dXBsZSwgYXhpc0NvdW50KSkge1xuXHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdH1cblxuXHQvLyByb3VuZCB0dXBsZSB0byB0aGUgbmVhcmVzdCAxLzE2Mzg0IChlbnN1cmVzIHdlIGdldCBleGFjdGx5IDAsIDEsIC0xIHdoZW4gd2UgYXJlIG9mZiBieSBhIHRpbnkgYW1vdW50KVxuXHQvLyAtIHRoZSBzcGVjOiBcIkNvbnZlcnQgdGhlIGZpbmFsLCBub3JtYWxpemVkIDE2LjE2IGNvb3JkaW5hdGUgdmFsdWUgdG8gMi4xNCBieSB0aGlzIG1ldGhvZDogYWRkIDB4MDAwMDAwMDIsIGFuZCBzaWduLWV4dGVuZCBzaGlmdCB0byB0aGUgcmlnaHQgYnkgMi5cIiBodHRwczovL2xlYXJuLm1pY3Jvc29mdC5jb20vZW4tdXMvdHlwb2dyYXBoeS9vcGVudHlwZS9zcGVjL290dmFyb3ZlcnZpZXcjY29vcmRpbmF0ZS1zY2FsZXMtYW5kLW5vcm1hbGl6YXRpb25cblx0Zm9yIChsZXQgYT0wOyBhPGF4aXNDb3VudDsgYSsrKSB7XG5cdFx0dHVwbGVbYV0gPSBNYXRoLnJvdW5kKHR1cGxlW2FdICogMTYzODQpIC8gMTYzODQ7XG5cdH1cblxuXHQvLyBhdmFyIG1hcHBpbmdzIG11c3QgY29tZSBmaXJzdCEgc2luY2UgYWxsIHN1YnNlcXVlbnQgdmFyaWF0aW9uIG9wZXJhdGlvbiB1c2UgdGhlIHR1cGxlIHJlbWFwcGVkIGJ5IGF2YXJcblx0Ly8gLSB0aGUgdHVwbGUgc3VwcGxpZWQgdG8gdGhlIFNhbXNhSW5zdGFuY2UoKSBjb25zdHJ1Y3RvciBpcyBtb2RpZmllZCBoZXJlIChtYXliZSBpdCBzaG91bGQgYmUgYSBjb3B5KVxuXHQvLyAtIG1heWJlIGVuY2Fwc3VsYXRlIGF2YXIgdHJhbnNmb3JtIGluIGEgZnVuY3Rpb25cblx0aWYgKGF2YXIpIHtcblxuXHRcdC8vIGF2YXIxXG5cdFx0Ly8gLSB0cmFuc2Zvcm0gdHVwbGUgaW50byBhdmFyLXYxLW1hcHBlZCB0dXBsZSwgb25lIGF4aXMgYXQgYSB0aW1lXG5cdFx0YXZhci5heGlzU2VnbWVudE1hcHMuZm9yRWFjaCgobWFwLGEpID0+IHtcblx0XHRcdGxldCBuID0gdHVwbGVbYV07XG5cdFx0XHRmb3IgKGxldCBtPTA7IG08bWFwLmxlbmd0aDsgbSsrKSB7XG5cdFx0XHRcdGlmIChtYXBbbV1bMF0gPj0gbikge1xuXHRcdFx0XHRcdGlmIChtYXBbbV1bMF0gPT0gbilcblx0XHRcdFx0XHRcdG4gPSBtYXBbbV1bMV07XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0biA9IG1hcFttLTFdWzFdICsgKG1hcFttXVsxXSAtIG1hcFttLTFdWzFdKSAqICggKCBuIC0gbWFwW20tMV1bMF0gKSAvICggbWFwW21dWzBdIC0gbWFwW20tMV1bMF0gKSApO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0dXBsZVthXSA9IG47XG5cdFx0fSk7XG5cblx0XHQvLyBhdmFyMlxuXHRcdC8vIC0gaW5zdGFudGlhdGUgdGhlIGF2YXIyIEl0ZW1WYXJpYXRpb25TdG9yZVxuXHRcdGlmIChhdmFyLml0ZW1WYXJpYXRpb25TdG9yZSkge1xuXG5cdFx0XHQvLyBhdmFyMiBtYXBwaW5nc1xuXHRcdFx0Y29uc3QgZGVsdGFzID0gZm9udC5pdGVtVmFyaWF0aW9uU3RvcmVJbnN0YW50aWF0ZShhdmFyLml0ZW1WYXJpYXRpb25TdG9yZSwgdHVwbGUpO1xuXHRcdFx0XG5cdFx0XHQvLyBlYWNoIGVudHJ5IGluIGF4aXNJbmRleE1hcCBkZWZpbmVzIGhvdyBhIHBhcnRpY3VsYXIgYXhpcyBnZXRzIGluZmx1ZW5jZWQgYnkgdGhlIHJlZ2lvbiBzY2FsYXJzXG5cdFx0XHQvLyAtIGF4aXNJZCBpcyBnaXZlbiBieSBpbmRleCBpbiBheGlzSW5kZXhNYXBcblx0XHRcdC8vIC0gbm90ZSB0aGF0IHNvbWUgYXhlcyBtYXkgbm90IGhhdmUgYXZhcjIgdHJhbnNmb3JtYXRpb25zOiB0aGV5IGVpdGhlciBoYXZlIGVudHJ5PT1bMHhmZmZmLDB4ZmZmZl0gb3IgdGhlaXIgYXhpc0lkIGlzID49IGF4aXNJbmRleE1hcC5sZW5ndGhcblx0XHRcdC8vIC0gaW5kZXggaWRlbnRpZmllcyB0aGUgdmFsdWUgaW4gdGhlIDJkIGFycmF5IGludGVycG9sYXRlZERlbHRhcyAodGhlIHNhbWUgaW5kZXhpbmcgdGhhdCBpZGVudGlmaWVzIHRoZSBpdmQgYW5kIHRoZSBkZWx0YVNldCB3aXRoaW4gdGhlIGl2ZClcblx0XHRcdC8vIC0gd2UgaXRlcmF0ZSB0aHJvdWdoIGFsbCBheGVzLCBzaW5jZSBpdCBjb3VsZCBiZSB0aGF0IHRoaXMuYXZhci5heGlzSW5kZXhNYXAubGVuZ3RoIDwgdGhpcy5heGlzQ291bnQgeWV0IHRoZSBsYXN0IGVudHJ5IGluIHRoaXMuYXhpc0NvdW50IGlzIG5vdCAweGZmZmYvMHhmZmZmLCB0aGlzIG11c3QgYmUgcmVwZWF0ZWRcblx0XHRcdGZvciAobGV0IGE9MDsgYTxheGlzQ291bnQ7IGErKykge1xuXHRcdFx0XHRsZXQgb3V0ZXIsIGlubmVyO1xuXHRcdFx0XHRpZiAoYXZhci5heGlzSW5kZXhNYXApIHtcblx0XHRcdFx0XHRbb3V0ZXIsIGlubmVyXSA9IGF2YXIuYXhpc0luZGV4TWFwWyBNYXRoLm1pbihhLCBhdmFyLmF4aXNJbmRleE1hcC5sZW5ndGggLSAxKSBdOyAvLyB1c2UgdGhlIGHigJl0aCBlbnRyeSBvciB0aGUgbGFzdCBlbnRyeSBvZiBheGlzSW5kZXhNYXBcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHsgLy8gaW1wbGljaXQgYXhpc0luZGV4TWFwXG5cdFx0XHRcdFx0b3V0ZXIgPSBhID4+IDE2OyAvLyB5ZXMsIEkga25vdyB0aGlzIHdpbGwgYWx3YXlzIGJlIDBcblx0XHRcdFx0XHRpbm5lciA9IGEgJiAweGZmZmY7IC8vIHllcywgSSBrbm93IHRoaXMgd2lsbCBhbHdheXMgYmUgYVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChvdXRlciAhPSAweGZmZmYgJiYgaW5uZXIgIT0gMHhmZmZmKSB7IC8vIGlmIHRoaXMgZW50cnkgaXMgbm9uLW51bGwuLi4gKGhtbSwgbWlnaHQgYmUgbmljZXIgdG8gaGF2ZSBjcmVhdGVkIGEgc3BhcnNlIGFycmF5IGluIHRoZSBmaXJzdCBwbGFjZSwgc2tpcHBpbmcgbnVsbHMgYW5kIHRodXMgYXZvaWRpbmcgdGhpcyBjaGVjaylcblx0XHRcdFx0XHR0dXBsZVthXSArPSBNYXRoLnJvdW5kKGRlbHRhc1tvdXRlcl1baW5uZXJdKSAvIDB4NDAwMDsgLy8gYWRkIHRoZSBpbnRlcnBvbGF0ZWQgZGVsdGEgdG8gdHVwbGVbYV07IG5vdGUgdGhhdCB0aGUgc3BlYyBwcm92aWRlcyBhbiBpbnRlZ2VyIG1ldGhvZCBmb3Igcm91bmRpbmdcblx0XHRcdFx0XHR0dXBsZVthXSA9IGNsYW1wKHR1cGxlW2FdLCAtMSwgMSk7IC8vIGNsYW1wIHRoZSByZXN1bHQgdG8gWy0xLDFdXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRcblx0Ly8gaW5zdGFudGlhdGUgdGhlIGl0ZW0gdmFyaWF0aW9uIHN0b3Jlc1xuXHQvLyBUT0RPOiBmaXggdGhlIGxvZ2ljIG9mIHdoZXJlIHRoaXMgY29tZXMuLi4gaXQgc2hvdWxkIHByb2JhYmx5IGhhcHBlbiBvbmx5IGlmKGZvbnQuYXZhcikgcmF0aGVyIHRoYW4gd2l0aGluIGlmIHRoZXJlIGFyZSBhbnkgSXRlbVZhcmlhdGlvblN0b3Jlc1xuXHQvLyB0aGVuIGluc3RhbnRpYXRlIHRoZSBvdGhlciBpdGVtIHZhcmlhdGlvbiBzdG9yZXNcblx0T2JqZWN0LmtleXMoZm9udC5JdGVtVmFyaWF0aW9uU3RvcmVzKS5mb3JFYWNoKGtleSA9PiB7XG5cblx0XHRpZiAoa2V5ICE9IFwiYXZhclwiKSB7IC8vIHdlIGFscmVhZHkgaGFuZGxlZCB0aGUgYXZhcjIgSXRlbVZhcmlhdGlvblN0b3JlLCBpZiBpdCBleGlzdHNcblx0XHRcdGNvbnN0IGRlbHRhU2V0cyA9IGZvbnQuaXRlbVZhcmlhdGlvblN0b3JlSW5zdGFudGlhdGUoZm9udC5JdGVtVmFyaWF0aW9uU3RvcmVzW2tleV0sIHR1cGxlKTsgLy8gZG9lcyB0aGlzIG5lZWQgdG8gc3RpY2sgYXJvdW5kPyBubyBmb3IgTVZBUiwgYXMgd2UgY2FuIGdldCB0aGUgbmV3IHZhbHVlc1xuXHRcdFx0XG5cdFx0XHQvLyBlYWNoIGl2cyBoYXMgaXRzIG93biB3YXkgb2YgbWFwcGluZyBpbmRpY2VzOyB0aGUgbWFwcGluZyBjYW4gbWF5YmUgYmUgZG9uZSBKSVQuLi5cblx0XHRcdHN3aXRjaCAoa2V5KSB7XG5cdFx0XHRcdGNhc2UgXCJNVkFSXCIgOiB7XG5cdFx0XHRcdFx0dGhpcy5NVkFSID0ge307XG5cdFx0XHRcdFx0T2JqZWN0LmtleXMoZm9udC5NVkFSLnZhbHVlUmVjb3JkcykuZm9yRWFjaCh0YWcgPT4geyAvLyB3b3VsZCBiZSBzbGlnaHRseSBtb3JlIGVmZmljaWVudCBpZiB3ZSBzdG9yZSBmb250Lk1WQVIudmFsdWVSZWNvcmRzIGFzIGFuIGFycmF5IG9mIGFycmF5czogW3RhZywgb3V0ZXIsIGlubmVyXSwgdGhlbiB3ZSBjYW4ganVzdCAuZm9yRWFjaCgpIGVhc2lseVxuXHRcdFx0XHRcdFx0Y29uc3QgW291dGVyLCBpbm5lcl0gPSBmb250Lk1WQVIudmFsdWVSZWNvcmRzW3RhZ107XG5cdFx0XHRcdFx0XHR0aGlzLk1WQVJbdGFnXSA9IGRlbHRhU2V0c1tvdXRlcl1baW5uZXJdOyAvLyBlLmcuIGluc3RhbmNlLk1WQVJbXCJ4aGd0XCJdID0gZGVsdGFTZXRzWzEsMTVdOyAvLyB5aWVsZHMgZGVsdGEgdG8gYWRkIHRvIE9TLzIuc3hIZWlnaHQgZm9yIHRoaXMgaW5zdGFuY2Vcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGRlZmF1bHQ6IHtcblx0XHRcdFx0XHR0aGlzLmRlbHRhU2V0c1trZXldID0gZGVsdGFTZXRzO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHQvLyBub3RlIHRoYXQgc29tZSBpdGVtVmFyaWF0aW9uU3RvcmUgdGFibGVzIChDT0xSLCBIVkFSKSBtaWdodCBiZSBsYXJnZSwgYW5kIGl0IHdvdWxkIGJlIGJldHRlciBmb3IganVzdCBhIHBvcnRpb24gdG8gYmUgaW5zdGFudGlhdGVkIG9uIGRlbWFuZFxuXHRcdH1cblx0fSk7XG5cblx0Ly8gY2FsY3VsYXRlIGluc3RhbmNlLnNoYXJlZFNjYWxhcnMgKHRoZXnigJlyZSBkZXJpdmVkIGZyb20gZ3ZhcuKAmXMgc2hhcmVkIHR1cGxlcyB1c2luZyB0aGUgY3VycmVudCB1c2VyIHR1cGxlKVxuXHQvLyAtIHRoaXMgY2FjaGluZyBzaG91bGQgbWFyZ2luYWxseSBzcGVlZCB0aGluZ3MgdXBcblx0Ly8gLSB3ZSBpbmRleCBieSB0aGUgc2FtZSBpZHMgdXNlZCB3aXRoaW4gdGhlIHBlci1nbHlwaCB0dnQgZGF0YSBkZWVwZXIgaW4gZ3ZhclxuXHQvLyAtIG5vdGUgdGhpcyBjYWxjdWxhdGlvbiBtdXN0IGNvbWUgYWZ0ZXIgYXZhciBjYWxjdWxhdGlvblxuXHRpZiAoZ3Zhcikge1xuXHRcdGd2YXIuc2hhcmVkVHVwbGVzLmZvckVhY2goc2hhcmVkVHVwbGUgPT4ge1xuXG5cdFx0XHRsZXQgUz0xO1xuXHRcdFx0Zm9yIChsZXQgYT0wOyBhPGF4aXNDb3VudDsgYSsrKSB7IC8vIGVhY2ggZWxlbWVudCBvZiBzaGFyZWRUdXBsZSBpcyAtMSwgMCBvciAxIChpdCByZWNvcmRzIHBlYWtzIG9ubHksIHdpdGggaW1wbGljaXQgc3RhcnQgYW5kIGVuZFxuXHRcdFx0XHRpZiAoc2hhcmVkVHVwbGVbYV0gPT0gMCkgLy8gbm8gZWZmZWN0LCBwZWFrID0gMCBtZWFucyBkbyBub3RoaW5nLCBpbiBvdGhlciB3b3JkcyAqPSAxXG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdGVsc2UgaWYgKHR1cGxlW2FdID09IDAgfHwgc2hhcmVkVHVwbGVbYV0gKiB0dXBsZVthXSA8IDApIHsgLy8gMSkgaWYgYW55IG9mIHRoZSBjb250cmlidXRpbmcgYXhlcyBhcmUgemVybywgdGhlIHNjYWxhciBpcyB6ZXJvOyAyKSBpZiB0aGVpciBzaWducyBhcmUgZGlmZmVyZW50LCB0aGUgc2NhbGFyIGlzIHplcm9cblx0XHRcdFx0XHRTID0gMDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRTICo9IHR1cGxlW2FdOyAvLyB0aGUgb25seSBvcHRpb24gbGVmdDogdGhlIHNpbXBsZSB0ZW50IG1lYW5zIHRoYXQgdGhlIHNjYWxhciBmb3IgZWFjaCBheGlzIGlzIGVxdWFsIHRvIHRoZSBhYnNvbHV0ZSBheGlzIHZhbHVlICh3ZSBmaXggdGhlIHNpZ24gb2YgUyBsYXRlciwgYWZ0ZXIgcG90ZW50aWFsbHkgbXVsdGlwbGUgc2lnbiBmbGlwcylcblx0XHRcdH1cblx0XHRcdHRoaXMuc2hhcmVkU2NhbGFycy5wdXNoKFMgPj0gMCA/IFMgOiAtUyk7IC8vIGZpeCB0aGUgc2lnbiwgdGhlbiBhcHBlbmQgdG8gdGhpcyBpbnN0YW5jZeKAmXMgc2hhcmVkU2NhbGFycyBhcnJheVxuXHRcdFx0Ly8gVE9ETzogd2UgKmNhbiogdXNlIHNoYXJlZFNjYWxhcnMgbGlrZSB0aGlzICh0aGV5IHdvcmsgYXMgaXMgaW4gbWFueSBmb250cykgYnV0IG9ubHkgaW4gZ2VuZXJhbCBpZiB0aGV5IGFyZSBhbGwgbm9uLWludGVybWVkaWF0ZSwgdGhpcyBoYXZlIHBlYWsgdmFsdWVzIC0xLCAwIG9yIDEgKEJpdHRlciB2YXJpYWJsZSBmb250IHZpb2xhdGVzIHRoaXMsIGZvciBleGFtcGxlKVxuXHRcdFx0Ly8gLSBiZWNhdXNlIHRoZSBzdGFydCBhbmQgZW5kIGFyZSBub3QgbG9jYWwgYnV0IGVtYmVkZGVkIGRlZXAgaW4gZ3Zhciwgd2UgY2Fubm90IGFzc3VtZSB0aGV5IGFyZSBhbHdheXMgdGhlIHNhbWUgdmFsdWVzICh0aGV5IG1heSB2ZXJ5IHdlbGwgYmUsIGFuZCBpbiB0aGVvcnkgd2UgY291bGQgY2hlY2sgZm9yIHRoaXMpXG5cdFx0XHQvLyAtIGN1cnJlbnRseSB3ZSBhcmUgbm90IHVzaW5nIHNoYXJlZFNjYWxhcnNcblx0XHR9KTtcblx0fVxuXG5cdC8vIGluc3RhbnRpYXRlIGdseXBocz9cblx0aWYgKG9wdGlvbnMuYWxsR2x5cGhzKSB7XG5cdFx0Zm9yIChsZXQgZz0wOyBnPGZvbnQubnVtR2x5cGhzOyBnKyspIHtcblx0XHRcdHRoaXMuZ2x5cGhzW2ddID0gZm9udC5nbHlwaHNbZ10uaW5zdGFudGlhdGUodHVwbGUpO1xuXHRcdH1cblx0fVxuXHRlbHNlIGlmIChvcHRpb25zLmdseXBoSWRzKSB7XG5cdFx0b3B0aW9ucy5nbHlwaElkcy5mb3JFYWNoKGcgPT4ge1xuXHRcdFx0dGhpcy5nbHlwaHNbZ10gPSBmb250LmdseXBoc1tnXS5pbnN0YW50aWF0ZSh0dXBsZSk7XG5cdFx0fSk7XG5cdH1cbn1cblxuXG4vLyBTYW1zYUluc3RhbmNlLmdseXBoQWR2YW5jZSgpIC0gcmV0dXJuIHRoZSBhZHZhbmNlIG9mIGEgZ2x5cGhcbi8vIC0gd2UgbmVlZCB0aGlzIG1ldGhvZCBpbiBTYW1zYUluc3RhbmNlLCBub3QgU2Ftc2FHbHlwaCwgYmVjYXVzZSBTYW1zYUdseXBoIG1pZ2h0IG5vdCBiZSBsb2FkZWQgKGFuZCB3ZSBkb27igJl0IG5lZWQgdG8gbG9hZCBpdCwgYmVjYXVzZSB3ZSBoYXZlIGhtdHggYW5kIEhWQVIpXG4vLyAtIGlmIHdlIGhhdmUgYSB2YXJpYWJsZSBmb250IGFuZCBIVkFSIGlzIG5vdCBwcmVzZW50LCB3ZSBtdXN0IGxvYWQgdGhlIGdseXBoIGluIG9yZGVyIHRvIGtub3cgaXRzIHZhcmlhYmxlIGFkdmFuY2Vcbi8vIC0gcmVwbGFjZSBpdCB3aXRoIGdseXBoTWV0cmljcygpID9cbi8vIC0gbWF5YmUgd2UgY2FuIGhhdmUgYSBTYW1zYUdseXBoLmdseXBoQWR2YW5jZSgpIG1ldGhvZCB0b28sIHdoaWNoIGNhbGxzIHRoaXMgbWV0aG9kIHdpdGggaXRzIG93biBpbnN0YW5jZSAoaWYgaXQgaGFzIG9uZSkuXG5TYW1zYUluc3RhbmNlLnByb3RvdHlwZS5nbHlwaEFkdmFuY2UgPSBmdW5jdGlvbiAoZ2x5cGhJZCkge1xuXHRjb25zdCBmb250ID0gdGhpcy5mb250O1xuXHRjb25zdCBhZHZhbmNlID0gWzAsMF07XG5cdGNvbnN0IGdseXBoID0gZm9udC5nbHlwaHNbZ2x5cGhJZF07XG5cdGNvbnN0IGlnbHlwaCA9IGdseXBoLmluc3RhbnRpYXRlKHRoaXMpO1xuXHQvLyB3ZSBkbyBub3QgbmVlZCB0byBkZWNvbXBvc2UgXG5cblx0aWYgKGlnbHlwaCkge1xuXHRcdC8vIGdldCB0aGUgYWR2YW5jZSBmcm9tIFNhbXNhR2x5cGhcblx0XHRjb25zdCBudW1Qb2ludHMgPSBpZ2x5cGgubnVtUG9pbnRzO1xuXHRcdGFkdmFuY2VbMF0gPSBpZ2x5cGgucG9pbnRzW251bVBvaW50cysxXVswXTsgLy8gaG9yaXpvbnRhbCBhZHZhbmNlXG5cdFx0YWR2YW5jZVsxXSA9IGlnbHlwaC5wb2ludHNbbnVtUG9pbnRzKzJdWzFdOyAvLyB2ZXJ0aWNhbCBhZHZhbmNlXG5cdH1cblx0ZWxzZSB7XG5cdFx0Ly8gVE9ETzogbW9kaWZ5IHRoZSBhZHZhbmNlIHVzaW5nIEhWQVIsIFZWQVJcblx0XHQvLyBIVkFSIGFuZCBWVkFSIHNob3VsZCBhbHJlYWR5IGJlIGluc3RhbnRpYXRlZFxuXHRcdGFkdmFuY2VbMF0gPSBmb250LmhtdHggPyBmb250LmhtdHhbZ2x5cGhJZF0gOiAwO1xuXHRcdGFkdmFuY2VbMV0gPSBmb250LnZtdHggPyBmb250LnZtdHhbZ2x5cGhJZF0gOiAwO1xuXG5cdFx0aWYgKGZvbnQuSFZBUikge1xuXHRcdFx0Y29uc3QgW291dGVyLCBpbm5lcl0gPSBmb250LkhWQVIuaW5kZXhNYXBbZ2x5cGhJZF07XG5cdFx0XHRjb25zdCBkZWx0YXMgPSBmb250Lkl0ZW1WYXJpYXRpb25TdG9yZXNbXCJIVkFSXCJdO1xuXHRcdFx0YWR2YW5jZVswXSArPSBkZWx0YXNbb3V0ZXJdW2lubmVyXTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gYWR2YW5jZTtcbn1cblxuLy8gaW5wdXQ6IGEgc3RyaW5nIG9yIGFuIGFycmF5IG9mIGdseXBoSWRzXG4vLyAtIHJldHVybjogYSBHbHlwaFJ1biBvYmplY3Qgd2hpY2ggaXMgYW4gYXJyYXkgb2Ygb2JqZWN0cywgd2hlcmUgZWFjaCBvYmplY3QgaGFzIGEgZ2x5cGggYW5kIGFuIGFic29sdXRlIHh5IG9mZnNldFxuLy8gRXhhbXBsZXM6XG4vLyBpbnN0YW5jZS5nbHlwaExheW91dEZyb21TdHJpbmcoXCJoZWxsb1wiKSAvLyBnZXRzIHRoZSBsYXlvdXQgZm9yIHRoZSBzdHJpbmcgXCJoZWxsb1wiXG4vLyBpbnN0YW5jZS5nbHlwaExheW91dEZyb21TdHJpbmcoWzIzNF0pIC8vIGdldHMgdGhlIGxheW91dCBmb3IgZ2x5cGggMjM0XG4vLyBpbnN0YW5jZS5nbHlwaExheW91dEZyb21TdHJpbmcoWzIzNCw1NV0pIC8vIGdldHMgdGhlIGxheW91dCBmb3IgZ2x5cGggMjM0IGZvbGxvd2VkIGJ5IGdseXBoIDU1XG4vLyAtIGEgY29tcGxldGUgaW1wbGVtZW50YXRpb24gd291bGQgcHJvY2VzcyBPcGVuVHlwZSBMYXlvdXQgZmVhdHVyZXNcblNhbXNhSW5zdGFuY2UucHJvdG90eXBlLmdseXBoTGF5b3V0RnJvbVN0cmluZyA9IGZ1bmN0aW9uIChpbnB1dCkge1xuXHRjb25zdCBmb250ID0gdGhpcy5mb250O1xuXHRjb25zdCBnbHlwaExheW91dCA9IFtdOyAvLyB3ZSByZXR1cm4gdGhpc1xuXHRsZXQgZ2x5cGhSdW4gPSBbXTtcblx0bGV0IHggPSAwLCB5ID0gMDtcblxuXHQvLyBnZXQgYSBzaW1wbGUgYXJyYXkgb2YgZ2x5cGhJZHMgKGlmIGlucHV0IGlzIGEgc3RyaW5nLCB0dXJuIGl0IGludG8gYSBzaW1wbGUgYXJyYXkgb2YgZ2x5cGhJZHMpXG5cdGlmICh0eXBlb2YgaW5wdXQgPT0gXCJzdHJpbmdcIikge1xuXHRcdC8vIHN0ZXAgdGhyb3VnaCB0aGUgc3RyaW5nIGluIGEgVVRGLTE2IGF3YXJlIHdheSwgdGhhdCBpcyBjb29sIHdpdGggXCLwn5CO8J+Moe+4j+KdpO+4j/CfpK/ijJrvuI/Onc+HUVwiO1xuXHRcdFsuLi5pbnB1dF0uZm9yRWFjaChjaCA9PiB7XG5cdFx0XHRnbHlwaFJ1bi5wdXNoKGZvbnQuZ2x5cGhJZEZyb21Vbmljb2RlKGNoLmNvZGVQb2ludEF0KDApKSk7XG5cdFx0fSlcblx0fVxuXHRlbHNlIGlmIChBcnJheS5pc0FycmF5KGlucHV0KSkge1xuXHRcdGdseXBoUnVuID0gaW5wdXQ7XG5cdH1cblxuXHQvLyBzaG91bGQgdGhpcyBhbHJlYWR5IHBvc2l0aW9uIGVhY2ggZ2x5cGggYWJzb2x1dGVseT8gbWF5YmUsIHRvIGJlIHNpbWlsYXIgdG8gaGFyZmJ1enouLi4gc2ltcGxlciBmb3IgdGhlIGZpbmFsIHJlbmRlcmluZ1xuXG5cdGdseXBoUnVuLmZvckVhY2goZ2x5cGhJZCA9PiB7XG5cblx0XHRjb25zdCBbZHgsIGR5XSA9IHRoaXMuZ2x5cGhBZHZhbmNlKGdseXBoSWQpOyAvLyBnbHlwaEFkdmFuY2UoKSBpcyByZXNwb25zaWJsZSBmb3IgZGVjb2RpbmcgYW5kIGluc3RhbnRpYXRpbmcgdGhlIGdseXBoIGlmIG5lY2Vzc2FyeVxuXHRcblx0XHQvLyBlbWl0IHNpbWlsYXIgZm9ybWF0IHRvIGhhcmZidXp6XG5cdFx0Z2x5cGhMYXlvdXQucHVzaCh7XG5cdFx0XHRpZDogZ2x5cGhJZCxcblx0XHRcdGF4OiB4LFxuXHRcdFx0YXk6IHksXG5cdFx0XHRkeDogZHgsXG5cdFx0XHRkeTogZHksXG5cdFx0fSk7XG5cblx0XHR4ICs9IGR4OyAvLyBob3Jpem9udGFsIGFkdmFuY2Vcblx0XHR5ICs9IGR5OyAvLyB2ZXJ0aWNhbCBhZHZhbmNlXG5cblx0fSk7XG5cblx0Ly8gZ2V0IHRoZSBnbHlwaCBpZHMgZm9yIHRoZSBjaGFyYWN0ZXJzIGluIHRoZSBzdHJpbmdcblx0XG5cdC8vIHByb2Nlc3MgdGhlIGdseXBoaWQgc2VxdWVuY2UgdG8gZ2V0IHN1YnN0aXR1dGlvbnMgYW5kIHBvc2l0aW9uaW5nXG5cdC8vIC0gd2UgY2FuIGRvIHRoaXMgd2l0aDpcblx0Ly8gICAtIGhhcmZidXp6Lndhc21cblx0Ly8gICAtIG9wZW50eXBlLmpzXG5cdC8vICAgLSBmb250a2l0LmpzXG5cdC8vICAgLSBiYXNpYyBtZXRyaWNzLCBubyBrZXJuaW5nIChubyBzdWJzaXR1dGlvbnMpXG5cdC8vICAgLSBiYXNpcyBtZXRyaWNzLCBrZXJuIHRhYmxlIChubyBzdWJzaXR1dGlvbnMpXG5cblx0cmV0dXJuIGdseXBoTGF5b3V0O1xufVxuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gU2Ftc2FHbHlwaFxuZnVuY3Rpb24gU2Ftc2FHbHlwaCAoaW5pdD17fSkge1xuXG5cdHRoaXMuaWQgPSBpbml0LmlkO1xuXHR0aGlzLm5hbWUgPSBpbml0Lm5hbWU7XG5cdHRoaXMuZm9udCA9IGluaXQuZm9udDtcblx0dGhpcy5udW1Qb2ludHMgPSBpbml0Lm51bVBvaW50cyB8fCAwO1xuXHR0aGlzLm51bWJlck9mQ29udG91cnMgPSBpbml0Lm51bWJlck9mQ29udG91cnMgfHwgMDtcblx0dGhpcy5pbnN0cnVjdGlvbkxlbmd0aCA9IDA7XG5cdHRoaXMucG9pbnRzID0gaW5pdC5wb2ludHMgfHwgW107XG5cdHRoaXMuY29tcG9uZW50cyA9IGluaXQuY29tcG9uZW50cyB8fCBbXTtcblx0dGhpcy5lbmRQdHMgPSBpbml0LmVuZFB0cyB8fCBbXTtcblx0dGhpcy50dnRzID0gaW5pdC50dnRzIHx8IFtdOyAvLyB1bmRlZmluZWQgbWVhbnMgbm90IHBhcnNlZDsgZW1wdHkgYXJyYXkgbWVhbnMgbm8gdHZ0c1xuXHR0aGlzLmN1cnZlT3JkZXIgPSAyOyBcblx0Ly90aGlzLmN1cnZlT3JkZXIgPSBpbml0LmN1cnZlT3JkZXIgfHwgKHRoaXMuZm9udCA/IHRoaXMuZm9udC5jdXJ2ZU9yZGVyIDogdW5kZWZpbmVkKTtcbn1cblxuXG4vLyBTYW1zYUdseXBoLmluc3RhbnRpYXRlKClcbi8vIC0gaW5zdGFudGlhdGVzIGEgZ2x5cGhcbi8vIFRoZSBmaXJzdCBhcmd1bWVudCBpcyBlaXRoZXIgYSBTYW1zYUluc3RhbmNlIG9yIGEgdHVwbGVcbi8vIC0gaWYgaXTigJlzIGEgU2Ftc2FJbnN0YW5jZSwgdGhlbiBpdCB0YWtlcyB0aGF0IGluc3RhbmNl4oCZcyB0dXBsZSBhbmQgZ2V0cyBpbnNlcnRlZCBpbnRvIHRoZSBnbHlwaHMgYXJyYXkgb2YgdGhlIGluc3RhbmNlXG4vLyAtIGlmIGl04oCZcyBhIHR1cGxlLCB0aGVuIGl0IGlzIGEgc3RhbmRhbG9uZSBnbHlwaFxuU2Ftc2FHbHlwaC5wcm90b3R5cGUuaW5zdGFudGlhdGUgPSBmdW5jdGlvbihhcmcsIG9wdGlvbnM9e30pIHtcblxuXHRjb25zdCBpZ2x5cGggPSBuZXcgU2Ftc2FHbHlwaCgpO1xuXHRjb25zdCBmb250ID0gdGhpcy5mb250O1xuXHRjb25zdCBheGlzQ291bnQgPSBmb250LmZ2YXIgPyBmb250LmZ2YXIuYXhpc0NvdW50IDogMDtcblx0Y29uc3QgaWdub3JlSVVQID0gZmFsc2U7XG5cblx0aWYgKGFyZyBpbnN0YW5jZW9mIFNhbXNhSW5zdGFuY2UpIHtcblx0XHRhcmcuZ2x5cGhzW3RoaXMuaWRdID0gaWdseXBoO1xuXHRcdGlnbHlwaC5pbnN0YW5jZSA9IGFyZztcblx0XHRpZ2x5cGgudHVwbGUgPSBhcmcudHVwbGU7XG5cdH1cblx0ZWxzZSBpZiAodmFsaWRhdGVUdXBsZSAoYXJnLCBheGlzQ291bnQpKSB7XG5cdFx0aWdseXBoLnR1cGxlID0gdHVwbGU7XG5cdFx0Ly8gaXTigJlzIGEgZ2x5cGggd2l0aG91dCBhbiBpbnN0YW5jZS4uLiB0aGlzIGZlZWxzIGRhbmdlcm91cywgc2luY2Ugd2UgbWF5IG5lZWQgSXRlbVZhcmlhdGlvblN0b3JlIGRhdGEgdGhhdCB3ZSBhcmUgbm90IHlldCBjYWxjdWxhdGluZyBKSVRcblx0fVxuXHRlbHNlIHtcblx0XHRpZ2x5cGgudHVwbGUgPSBBcnJheShheGlzQ291bnQpLmZpbGwoMCk7XG5cdH1cblxuXHRpZ2x5cGguaWQgPSB0aGlzLmlkO1xuXHRpZ2x5cGgubmFtZSA9IHRoaXMubmFtZTtcblx0aWdseXBoLmZvbnQgPSB0aGlzLmZvbnQ7XG5cdGlnbHlwaC5udW1Qb2ludHMgPSB0aGlzLm51bVBvaW50cztcblx0aWdseXBoLm51bWJlck9mQ29udG91cnMgPSB0aGlzLm51bWJlck9mQ29udG91cnM7XG5cdGlnbHlwaC5pbnN0cnVjdGlvbkxlbmd0aCA9IHRoaXMuaW5zdHJ1Y3Rpb25MZW5ndGg7XG5cdGlnbHlwaC5jb21wb25lbnRzID0gdGhpcy5jb21wb25lbnRzO1xuXHRpZ2x5cGguZW5kUHRzID0gdGhpcy5lbmRQdHM7XG5cdGlnbHlwaC50dnRzID0gdGhpcy50dnRzO1xuXHRpZ2x5cGguY3VydmVPcmRlciA9IHRoaXMuY3VydmVPcmRlcjtcblx0aWdseXBoLnRvdWNoZWQgPSBbXTsgLy8gaGVscGZ1bCBmb3IgdmlzdWFsaXNpbmcgdmFyaWF0aW9uc1xuXHRpZ2x5cGgudml6ID0ge3R2dHM6IFtdfTsgLy8gdmlzdWFsaXphdGlvbiBkYXRhXG5cblx0Ly8gaW5zdGFudGlhdGUgcG9pbnRzOiBjb3B5IHRoZSBwb2ludHMgb2YgZ2x5cGggaW50byBpZ2x5cGhcblx0bGV0IHA9dGhpcy5wb2ludHMubGVuZ3RoO1xuXHR3aGlsZSAoLS1wID49IDApIHtcblx0XHRjb25zdCBwb2ludCA9IHRoaXMucG9pbnRzW3BdO1xuXHRcdGlnbHlwaC5wb2ludHNbcF0gPSBbcG9pbnRbMF0sIHBvaW50WzFdLCBwb2ludFsyXV07IC8vIG5vdGUgdGhhdCBbLi4ucG9pbnRdIGlzIHNsb3dlciA6KVxuXHR9XG5cblx0Ly8gZ28gdGhyb3VnaCBlYWNoIHR2dCAoPXR1cGxlIHZhcmlhdGlvbiB0YWJsZSkgZm9yIHRoaXMgZ2x5cGhcblx0dGhpcy50dnRzLmZvckVhY2godHZ0ID0+IHtcblxuXHRcdGNvbnN0IHNjYWxlZERlbHRhcyA9IFtdO1xuXHRcdGNvbnN0IHRvdWNoZWQgPSBbXTtcblx0XHRsZXQgcHQgPSB0aGlzLnBvaW50cy5sZW5ndGg7XG5cdFx0bGV0IFM7XG5cblx0XHQvLyBpbml0aWFsaXplIHRoZSBzY2FsZWREZWx0YXMgYXJyYXkgdG8gemVybyB2ZWN0b3JzXG5cdFx0d2hpbGUgKC0tcHQgPj0gMCkge1xuXHRcdFx0c2NhbGVkRGVsdGFzW3B0XSA9IFswLDBdO1xuXHRcdH1cblxuXHRcdC8vIHNoYXJlZFNjYWxhcnMgYXJlIGRpc2FibGVkIGZvciBub3dcblx0XHRpZiAoMSkge1xuXHRcdFx0Ly8gZ28gdGhydSBlYWNoIGF4aXMsIG11bHRpcGx5IGEgc2NhbGFyIFMgZnJvbSBpbmRpdmlkdWFsIHNjYWxhcnMgQVNcblx0XHRcdC8vIC0gaWYgdGhlIGN1cnJlbnQgZGVzaWduc3BhY2UgbG9jYXRpb24gaXMgb3V0c2lkZSBvZiB0aGlzIHR2dOKAmXMgdHVwbGUsIHdlIGdldCBTID0gMCBhbmQgbm90aGluZyBpcyBkb25lXG5cdFx0XHQvLyAtIGJhc2VkIG9uIHBzZXVkb2NvZGUgZnJvbSBodHRwczovL3d3dy5taWNyb3NvZnQuY29tL3R5cG9ncmFwaHkvb3RzcGVjL290dmFyb3ZlcnZpZXcuaHRtXG5cdFx0XHRTID0gMVxuXHRcdFx0Zm9yIChsZXQgYT0wOyBhPGF4aXNDb3VudDsgYSsrKSB7XG5cdFx0XHRcdGNvbnN0IHVhID0gaWdseXBoLnR1cGxlW2FdO1xuXHRcdFx0XHRjb25zdCBbc3RhcnQsIHBlYWssIGVuZF0gPSBbdHZ0LnN0YXJ0W2FdLCB0dnQucGVha1thXSwgdHZ0LmVuZFthXV07IC8vIFRPRE86IHN0b3JlIHRoZXNlIGFzIDMtZWxlbWVudCBhcnJheXNcblx0XHRcdFx0aWYgKHBlYWsgIT0gMCkge1xuXHRcdFx0XHRcdGlmICh1YSA8IHN0YXJ0IHx8IHVhID4gZW5kKSB7XG5cdFx0XHRcdFx0XHRTID0gMDtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmICh1YSA8IHBlYWspXG5cdFx0XHRcdFx0XHRTICo9ICh1YSAtIHN0YXJ0KSAvIChwZWFrIC0gc3RhcnQpO1xuXHRcdFx0XHRcdGVsc2UgaWYgKHVhID4gcGVhaylcblx0XHRcdFx0XHRcdFMgKj0gKGVuZCAtIHVhKSAvIChlbmQgLSBwZWFrKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdC8vIHVzZSBzaGFyZWRTY2FsYXJzIG9wdGltaXphdGlvblxuXHRcdFx0UyA9IGlnbHlwaC5pbnN0YW5jZS5zaGFyZWRTY2FsYXJzW3R2dC5zaGFyZWRUdXBsZUlkXTtcblx0XHR9XG5cblxuXHRcdC8vIG5vdyB3ZSBjYW4gbW92ZSB0aGUgcG9pbnRzIGJ5IFMgKiBkZWx0YVxuXHRcdC8vIE9QVElNSVpFOiBpdCBtdXN0IGJlIHBvc3NpYmxlIHRvIG9wdGltaXplIGZvciB0aGUgUz09MSBjYXNlLCBidXQgYXR0ZW1wdHMgcmVkdWNlIHNwZWVkLi4uXG5cdFx0aWYgKFMgIT0gMCkge1xuXG5cdFx0XHRwdCA9IHRoaXMucG9pbnRzLmxlbmd0aDtcblx0XHRcdHdoaWxlICgtLXB0ID49IDApIHtcblx0XHRcdFx0Y29uc3QgZGVsdGEgPSB0dnQuZGVsdGFzW3B0XTtcdFx0XHRcdFxuXHRcdFx0XHRpZiAoZGVsdGEgIT09IG51bGwgJiYgZGVsdGEgIT09IHVuZGVmaW5lZCkgeyAvLyBpZiBub3QgSVVQXG5cdFx0XHRcdFx0dG91Y2hlZFtwdF0gPSB0cnVlOyAvLyB0b3VjaGVkW10gaXMganVzdCBmb3IgdGhpcyB0dnQ7IG5ld0dseXBoLnRvdWNoZWRbXSBpcyBmb3IgYWxsIHR2dHMgKGluIGNhc2Ugd2Ugd2FudCB0byBzaG93IElVUCBpbiBVSSkgXG5cdFx0XHRcdFx0c2NhbGVkRGVsdGFzW3B0XSA9IFtTICogZGVsdGFbMF0sIFMgKiBkZWx0YVsxXV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gSVVQXG5cdFx0XHQvLyAtIFRPRE86IGlnbm9yZSB0aGlzIHN0ZXAgZm9yIGNvbXBvc2l0ZXMgKGV2ZW4gdGhvdWdoIGl0IGlzIHNhZmUgYmVjYXVzZSBudW1iZXJPZkNvbnRvdXJzPDApXG5cdFx0XHQvLyAtIE9QVElNSVpFOiBjYWxjdWxhdGUgSVVQIGRlbHRhcyB3aGVuIHBhcnNpbmcsIHRoZW4gYSBcImRlbHRhc1wiIHZhcmlhYmxlIGNhbiBwb2ludCBlaXRoZXIgdG8gdGhlIG9yaWdpbmFsIGRlbHRhcyBhcnJheSBvciB0byBhIG5ldyBzY2FsZWQgZGVsdGFzIGFycmF5IChobW0sIHJvdW5kaW5nIHdpbGwgYmUgYSBiaXQgZGlmZmVyZW50IGlmIElVUCBzY2FsZWQgZGVsdGFzIGFyZSBhbHdheXMgYmFzZWQgb24gdGhlIDEwMCUgZGVsdGFzKVxuXHRcdFx0aWYgKCF0dnQuYWxsUG9pbnRzICYmIHRoaXMubnVtYmVyT2ZDb250b3VycyA+IDAgJiYgdG91Y2hlZC5sZW5ndGggPiAwICYmICFpZ25vcmVJVVApIHsgLy8gaXQgd291bGQgYmUgbmljZSB0byBjaGVjayBcInRvdWNoZWQubGVuZ3RoIDwgZ2x5cGgucG9pbnRzLmxlbmd0aFwiIGJ1dCB0aGF0IHdvbuKAmXQgd29yayB3aXRoIHNwYXJzZSBhcnJheXMsIGFuZCBtdXN0IGFsc28gdGhpbmsgYWJvdXQgcGhhbnRvbSBwb2ludHNcblxuXHRcdFx0XHQvLyBmb3IgZWFjaCBjb250b3VyXG5cdFx0XHRcdGZvciAobGV0IGM9MCwgc3RhcnRQdD0wOyBjPHRoaXMubnVtYmVyT2ZDb250b3VyczsgYysrKSB7XG5cdFx0XHRcdFxuXHRcdFx0XHRcdC8vIE9QVElNSVpFOiBjaGVjayBoZXJlIHRoYXQgdGhlIGNvbnRvdXIgaXMgYWN0dWFsbHkgdG91Y2hlZFxuXHRcdFx0XHRcdGNvbnN0IG51bVBvaW50c0luQ29udG91ciA9IHRoaXMuZW5kUHRzW2NdLXN0YXJ0UHQrMTtcblx0XHRcdFx0XHRsZXQgZmlyc3RQcmVjUHQgPSAtMTsgLy8gbnVsbCB2YWx1ZVxuXHRcdFx0XHRcdGxldCBwcmVjUHQsIGZvbGxQdDtcblx0XHRcdFx0XHRmb3IgKGxldCBwPXN0YXJ0UHQ7IHAhPWZpcnN0UHJlY1B0OyApIHtcblx0XHRcdFx0XHRcdGxldCBwTmV4dCA9IChwLXN0YXJ0UHQrMSklbnVtUG9pbnRzSW5Db250b3VyK3N0YXJ0UHQ7XG5cdFx0XHRcdFx0XHRpZiAodG91Y2hlZFtwXSAmJiAhdG91Y2hlZFtwTmV4dF0pIHsgLy8gZm91bmQgYSBwcmVjUHRcblx0XHRcdFx0XHRcdFx0Ly8gZ2V0IHByZWNQdCBhbmQgZm9sbFB0XG5cdFx0XHRcdFx0XHRcdHByZWNQdCA9IHA7XG5cdFx0XHRcdFx0XHRcdGZvbGxQdCA9IHBOZXh0O1xuXHRcdFx0XHRcdFx0XHRpZiAoZmlyc3RQcmVjUHQgPT0gLTEpXG5cdFx0XHRcdFx0XHRcdFx0Zmlyc3RQcmVjUHQgPSBwcmVjUHQ7XG5cdFx0XHRcdFx0XHRcdGRvIHtcblx0XHRcdFx0XHRcdFx0XHRmb2xsUHQgPSAoZm9sbFB0LXN0YXJ0UHQrMSkgJSBudW1Qb2ludHNJbkNvbnRvdXIgKyBzdGFydFB0O1xuXHRcdFx0XHRcdFx0XHR9IHdoaWxlICghdG91Y2hlZFtmb2xsUHRdKSAvLyBmb3VuZCB0aGUgZm9sbFB0XG5cblx0XHRcdFx0XHRcdFx0Ly8gcGVyZm9ybSBJVVAgZm9yIHgoMCksIHRoZW4gZm9yIHkoMSlcblx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgeHk9MDsgeHk8PTE7IHh5KyspIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIElVUCBzcGVjOiBodHRwczovL3d3dy5taWNyb3NvZnQuY29tL3R5cG9ncmFwaHkvb3RzcGVjL2d2YXIuaHRtI0lEVVBcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBwQSA9IHRoaXMucG9pbnRzW3ByZWNQdF1beHldO1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IHBCID0gdGhpcy5wb2ludHNbZm9sbFB0XVt4eV07XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgZEEgPSBzY2FsZWREZWx0YXNbcHJlY1B0XVt4eV07XG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgZEIgPSBzY2FsZWREZWx0YXNbZm9sbFB0XVt4eV07XG5cblx0XHRcdFx0XHRcdFx0XHRmb3IgKGxldCBxPXBOZXh0LCBELCBULCBROyBxIT1mb2xsUHQ7IHE9IChxLXN0YXJ0UHQrMSkgJSBudW1Qb2ludHNJbkNvbnRvdXIgKyBzdGFydFB0KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRRID0gdGhpcy5wb2ludHNbcV1beHldO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHBBID09IHBCKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHREID0gZEEgPT0gZEIgPyBkQSA6IDA7XG5cdFx0XHRcdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKFEgPD0gcEEgJiYgUSA8PSBwQilcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHREID0gcEEgPCBwQiA/IGRBIDogZEI7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2UgaWYgKFEgPj0gcEEgJiYgUSA+PSBwQilcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHREID0gcEEgPiBwQiA/IGRBIDogZEI7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFQgPSAoUSAtIHBBKSAvIChwQiAtIHBBKTsgLy8gc2FmZSBmb3IgZGl2aWRlLWJ5LXplcm9cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHREID0gKDEtVCkgKiBkQSArIFQgKiBkQjtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0c2NhbGVkRGVsdGFzW3FdW3h5XSArPSBEO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRwID0gZm9sbFB0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAocE5leHQgPT0gc3RhcnRQdCAmJiBmaXJzdFByZWNQdCA9PSAtMSkgLy8gZmFpbGVkIHRvIGZpbmQgYSBwcmVjUHQsIHNvIGFiYW5kb24gdGhpcyBjb250b3VyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRwID0gcE5leHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHN0YXJ0UHQgPSB0aGlzLmVuZFB0c1tjXSsxO1xuXHRcdFx0XHR9XG5cdFx0XHR9IC8vIGlmIElVUFxuXG5cdFx0XHQvLyBhZGQgdGhlIG5ldCBkZWx0YXMgdG8gdGhlIGdseXBoXG5cdFx0XHQvLyBUT0RPOiBUcnkgdG8gYXZvaWQgdGhpcyBzdGVwIGZvciBwb2ludHMgdGhhdCB3ZXJlIG5vdCBtb3ZlZFxuXHRcdFx0Ly8gVE9ETzogVW5kZXJzdGFuZCB3aGV0aGVyIHJvdW5kaW5nIGlzIGRlZmluaXRlbHkgd3JvbmcgaGVyZS5cblx0XHRcdC8vIC0gaHR0cHM6Ly9kb2NzLm1pY3Jvc29mdC5jb20vZW4tdXMvdHlwb2dyYXBoeS9vcGVudHlwZS9zcGVjL290dmFyb3ZlcnZpZXdcblx0XHRcdGlnbHlwaC5wb2ludHMuZm9yRWFjaCgocG9pbnQsIHB0KSA9PiB7XG5cdFx0XHRcdHBvaW50WzBdICs9IHNjYWxlZERlbHRhc1twdF1bMF07XG5cdFx0XHRcdHBvaW50WzFdICs9IHNjYWxlZERlbHRhc1twdF1bMV07XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHQvLyBzdG9yZSBTIGFuZCBzY2FsZWREZWx0YXMgc28gd2UgY2FuIHVzZSB0aGVtIGluIHZpc3VhbGl6YXRpb25cblx0XHQvLyAtIG1heWJlIHdlIHNob3VsZCByZWNhbGN1bGF0ZSBtdWx0aXBsZSBBUyB2YWx1ZXMgYW5kIDEgUyB2YWx1ZSBpbiB0aGUgR1VJIHNvIHdlIGRvbuKAmXQgYWRkIGxvYWQgdG8gc2Ftc2EtY29yZVxuXHRcdGlmIChvcHRpb25zLnZpc3VhbGl6YXRpb24pIHtcblx0XHRcdGlnbHlwaC52aXoudHZ0cy5wdXNoKHtcblx0XHRcdFx0UzogUyxcblx0XHRcdFx0c2NhbGVkRGVsdGFzOiBzY2FsZWREZWx0YXMsXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0fSk7IC8vIGVuZCBvZiBwcm9jZXNzaW5nIHRoZSB0dnRzXG5cblx0Ly8gcmVjYWxjdWxhdGUgYmJveFxuXHQvLyAtIFRPRE86IGZpeCBmb3IgY29tcG9zaXRlcyBhbmQgbm9uLXByaW50aW5nIGdseXBocyAoZXZlbiB0aG91Z2ggdGhlIGxhdHRlciBkb27igJl0IHJlY29yZCBhIGJib3gpXG5cdC8vIGlnbHlwaC5yZWNhbGN1bGF0ZUJvdW5kcygpO1xuXG5cdC8vIGF0dGFjaCB0aGUgaW5zdGFudGlhdGVkIGdseXBoIHRvIHRoZSBpbnN0YW5jZVxuXHRpZiAoaWdseXBoLmluc3RhbmNlKVxuXHRcdGlnbHlwaC5pbnN0YW5jZS5nbHlwaHNbdGhpcy5pZF0gPSBpZ2x5cGg7XG5cblx0cmV0dXJuIGlnbHlwaDtcbn1cblxuXG4vLyBkZWNvbXBvc2UoKVxuLy8gLSBkZWNvbXBvc2UgYSBjb21wb3NpdGUgZ2x5cGggaW50byBhIG5ldyBzaW1wbGUgZ2x5cGhcbi8vIC0gVE9ETzogZml4IHRoaXMgZm9yIHRoZSBuZXcgcGFyYWRpZ21zIDopXG4vL1NhbXNhR2x5cGgucHJvdG90eXBlLmRlY29tcG9zZSA9IGZ1bmN0aW9uICh0dXBsZSwgcGFyYW1zKSB7XG4vL1NhbXNhR2x5cGgucHJvdG90eXBlLmRlY29tcG9zZSA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgcGFyYW1zKSB7XG5TYW1zYUdseXBoLnByb3RvdHlwZS5kZWNvbXBvc2UgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG5cblx0Ly8gXCJ0aGlzXCIgaXMgZWl0aGVyIGEgZ2x5cGggKHdpdGhvdXQgYW4gaW5zdGFuY2UpIG9yIGFuIGluc3RhbnRpYXRlZCBnbHlwaCAod2l0aCBhbiBpbnN0YW5jZSlcblxuXHRjb25zdCBmb250ID0gdGhpcy5mb250O1xuXHRsZXQgc2ltcGxlR2x5cGggPSBuZXcgU2Ftc2FHbHlwaCgge1xuXHRcdGlkOiB0aGlzLmlkLFxuXHRcdG5hbWU6IHRoaXMubmFtZSxcblx0XHRmb250OiBmb250LFxuXHRcdGN1cnZlT3JkZXI6IHRoaXMuY3VydmVPcmRlcixcblx0XHRlbmRQdHM6IFtdLFxuXHR9ICk7XG5cblx0aWYgKHRoaXMuaW5zdGFuY2UpIHtcblx0XHRzaW1wbGVHbHlwaC5pbnN0YW5jZSA9IHRoaXMuaW5zdGFuY2U7XG5cdH1cblxuXHRsZXQgb2Zmc2V0LCB0cmFuc2Zvcm0sIGZsYWdzO1xuXHRpZiAocGFyYW1zKSB7XG5cdFx0b2Zmc2V0ID0gcGFyYW1zLm9mZnNldDtcblx0XHR0cmFuc2Zvcm0gPSBwYXJhbXMudHJhbnNmb3JtO1xuXHRcdGZsYWdzID0gcGFyYW1zLmZsYWdzO1xuXHR9XG5cblx0Ly8gc2ltcGxlIGNhc2Vcblx0aWYgKHRoaXMubnVtYmVyT2ZDb250b3VycyA+PSAwKSB7XG5cblx0XHRpZiAoIXBhcmFtcykgLy8gb3B0aW1pemF0aW9uIGZvciBjYXNlIHdoZW4gdGhlcmXigJlzIG5vIG9mZnNldCBhbmQgbm8gdHJhbnNmb3JtICh3ZSBjYW4gbWFrZSB0aGlzIHJldHVybiBcInRoaXNcIiBpdHNlbGY6IHRoZSBkZWNvbXBvc2l0aW9uIG9mIGEgc2ltcGxlIGdseXBoIGlzIGl0c2VsZilcblx0XHRcdHJldHVybiB0aGlzO1xuXG5cdFx0Ly8gYXBwZW5kIGFsbCB0aGUgcG9pbnRzIChpZ25vcmUgcGhhbnRvbSBwb2ludHMpXG5cdFx0Zm9yIChsZXQgcHQ9MDsgcHQ8dGhpcy5udW1Qb2ludHM7IHB0KyspIHtcblxuXHRcdFx0Ly8gc3BlYzogaHR0cHM6Ly9kb2NzLm1pY3Jvc29mdC5jb20vZW4tdXMvdHlwb2dyYXBoeS9vcGVudHlwZS9zcGVjL2dseWZcblx0XHRcdGxldCBwb2ludCA9IFsgdGhpcy5wb2ludHNbcHRdWzBdLCB0aGlzLnBvaW50c1twdF1bMV0sIHRoaXMucG9pbnRzW3B0XVsyXSBdOyAvLyBuZWVkcyB0byBiZSBhIGRlZXAgY29weSwgSSB0aGlua1xuXG5cdFx0XHQvLyBvZmZzZXQgYmVmb3JlIHRyYW5zZm9ybVxuXHRcdFx0aWYgKG9mZnNldCAmJiAoZmxhZ3MgJiAweDA4MDApKSB7IC8vIFNDQUxFRF9DT01QT05FTlRfT0ZGU0VUXG5cdFx0XHRcdHBvaW50WzBdICs9IG9mZnNldFswXTtcblx0XHRcdFx0cG9pbnRbMV0gKz0gb2Zmc2V0WzFdO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyB0cmFuc2Zvcm0gbWF0cml4P1xuXHRcdFx0aWYgKHRyYW5zZm9ybSkge1xuXHRcdFx0XHRsZXQgeCA9IHBvaW50WzBdLCB5ID0gcG9pbnRbMV07XG5cdFx0XHRcdHBvaW50WzBdID0geCAqIHRyYW5zZm9ybVswXSArIHkgKiB0cmFuc2Zvcm1bMV07XG5cdFx0XHRcdHBvaW50WzFdID0geCAqIHRyYW5zZm9ybVsyXSArIHkgKiB0cmFuc2Zvcm1bM107XG5cdFx0XHR9XG5cblx0XHRcdC8vIG9mZnNldCBhZnRlciB0cmFuc2Zvcm1cblx0XHRcdGlmIChvZmZzZXQgJiYgIShmbGFncyAmIDB4MDgwMCkpIHsgLy8gU0NBTEVEX0NPTVBPTkVOVF9PRkZTRVRcblx0XHRcdFx0cG9pbnRbMF0gKz0gb2Zmc2V0WzBdO1xuXHRcdFx0XHRwb2ludFsxXSArPSBvZmZzZXRbMV07XG5cdFx0XHR9XG5cblx0XHRcdHNpbXBsZUdseXBoLnBvaW50cy5wdXNoKHBvaW50KTtcblx0XHR9XG5cblx0XHQvLyBmaXggdXAgc2ltcGxlR2x5cGhcblx0XHQvLyBUT0RPOiBjYW4gdGhlc2UgcG9pbnQgdG8gdGhlIG9yaWdpbmFsIG9iamVjdHM/XG5cdFx0dGhpcy5lbmRQdHMuZm9yRWFjaChlbmRQdCA9PiB7XG5cdFx0XHRzaW1wbGVHbHlwaC5lbmRQdHMucHVzaChlbmRQdCArIHNpbXBsZUdseXBoLm51bVBvaW50cyk7XG5cdFx0fSk7XG5cdFx0c2ltcGxlR2x5cGgubnVtUG9pbnRzICs9IHRoaXMubnVtUG9pbnRzO1xuXHRcdHNpbXBsZUdseXBoLm51bWJlck9mQ29udG91cnMgKz0gdGhpcy5udW1iZXJPZkNvbnRvdXJzO1xuXHR9XG5cblx0ZWxzZSB7XG5cdFx0Ly8gc3RlcCB0aHJ1IGNvbXBvbmVudHMsIGFkZGluZyBwb2ludHMgdG8gc2ltcGxlR2x5cGhcblx0XHR0aGlzLmNvbXBvbmVudHMuZm9yRWFjaCgoY29tcG9uZW50LCBjKSA9PiB7XG5cblx0XHRcdC8vIGdldCBnYywgdGhlIGNvbXBvbmVudCBnbHlwaCwgaW5zdGFudGlhdGUgaWYgbmVjZXNzYXJ5XG5cdFx0XHRsZXQgZ2M7XG5cdFx0XHRpZiAodGhpcy5pbnN0YW5jZSkge1xuXHRcdFx0XHRnYyA9IHRoaXMuaW5zdGFuY2UuZ2x5cGhzW2NvbXBvbmVudC5nbHlwaElkXTsgLy8gYXR0ZW1wdCB0byBnZXQgdGhlIGluc3RhbnRlZCBnbHlwaFxuXHRcdFx0XHRpZiAoIWdjKSB7IC8vIGlmIGl04oCZcyBub3QgYWxyZWFkeSBpbnN0YW50aWF0ZWQsIGluc3RhbnRpYXRlIGl0XG5cdFx0XHRcdFx0Y29uc3QgZ2NEZWZhdWx0ID0gZm9udC5nbHlwaHNbY29tcG9uZW50LmdseXBoSWRdIHx8IGZvbnQubG9hZEdseXBoQnlJZChjb21wb25lbnQuZ2x5cGhJZCk7IC8vIGZldGNoIGZyb20gYmluYXJ5IGlmIG5vdCBhbHJlYWR5IGxvYWRlZFxuXHRcdFx0XHRcdGdjID0gZ2NEZWZhdWx0Lmluc3RhbnRpYXRlKHRoaXMuaW5zdGFuY2UpOyAvLyBpdCBzdGlsbCBuZWVkcyB0byBiZSBkZWNvbXBvc2VkXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRnYyA9IGZvbnQuZ2x5cGhzW2NvbXBvbmVudC5nbHlwaElkXSB8fCBmb250LmxvYWRHbHlwaEJ5SWQoY29tcG9uZW50LmdseXBoSWQpO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBtYXRjaGVkID0gY29tcG9uZW50Lm1hdGNoZWRQb2ludHM7XG5cdFx0XHRjb25zdCBuZXdUcmFuc2Zvcm0gPSBjb21wb25lbnQudHJhbnNmb3JtO1xuXHRcdFx0bGV0IG5ld09mZnNldCA9IFsgdGhpcy5wb2ludHNbY11bMF0sIHRoaXMucG9pbnRzW2NdWzFdIF07XG5cdFx0XHRpZiAob2Zmc2V0KSB7XG5cdFx0XHRcdG5ld09mZnNldFswXSArPSBvZmZzZXRbMF07XG5cdFx0XHRcdG5ld09mZnNldFsxXSArPSBvZmZzZXRbMV07XG5cdFx0XHR9XG5cblx0XHRcdC8vIGRlY29tcG9zZSFcblx0XHRcdC8vIC0gdGhpcyBpcyB0aGUgcmVjdXJzaXZlIHN0ZXBcblx0XHRcdGxldCBkZWNvbXAgPSBnYy5kZWNvbXBvc2Uoe1xuXHRcdFx0XHRvZmZzZXQ6IG5ld09mZnNldCxcblx0XHRcdFx0dHJhbnNmb3JtOiBuZXdUcmFuc2Zvcm0sXG5cdFx0XHRcdGZsYWdzOiBjb21wb25lbnQuZmxhZ3MsXG5cdFx0XHRcdG1hdGNoZWQ6IG1hdGNoZWQsXG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gZ2V0IGRlbHRhIGlmIHRoaXMgY29tcG9uZW50IGlzIHBvc2l0aW9uZWQgd2l0aCBcIm1hdGNoZWQgcG9pbnRzXCJcblx0XHRcdGxldCBkeD0wLCBkeT0wO1xuXHRcdFx0aWYgKG1hdGNoZWQpIHtcblx0XHRcdFx0ZHggPSBzaW1wbGVHbHlwaC5wb2ludHNbbWF0Y2hlZFswXV1bMF0gLSBkZWNvbXAucG9pbnRzW21hdGNoZWRbMV1dWzBdO1xuXHRcdFx0XHRkeSA9IHNpbXBsZUdseXBoLnBvaW50c1ttYXRjaGVkWzBdXVsxXSAtIGRlY29tcC5wb2ludHNbbWF0Y2hlZFsxXV1bMV07XG5cdFx0XHR9XG5cblx0XHRcdC8vIHdlIG5vdyBoYXZlIHRoZSBzaW1wbGUgZ2x5cGggXCJkZWNvbXBcIjogbm8gb2Zmc2V0IG9yIHRyYW5zZm9ybSBpcyBuZWVkZWQgKGJ1dCB3ZSBtYXkgbmVlZCB0byBtYXRjaCBwb2ludHMgdXNpbmcgZHgsZHkpXG5cdFx0XHRmb3IgKGxldCBwPTA7IHA8ZGVjb21wLm51bVBvaW50czsgcCsrKSB7XG5cdFx0XHRcdHNpbXBsZUdseXBoLnBvaW50cy5wdXNoKFtcblx0XHRcdFx0XHRkZWNvbXAucG9pbnRzW3BdWzBdICsgZHgsXG5cdFx0XHRcdFx0ZGVjb21wLnBvaW50c1twXVsxXSArIGR5LFxuXHRcdFx0XHRcdGRlY29tcC5wb2ludHNbcF1bMl1cblx0XHRcdFx0XSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGZpeCB1cCBzaW1wbGVHbHlwaFxuXHRcdFx0ZGVjb21wLmVuZFB0cy5mb3JFYWNoKGVuZFB0ID0+IHtcblx0XHRcdFx0c2ltcGxlR2x5cGguZW5kUHRzLnB1c2goZW5kUHQgKyBzaW1wbGVHbHlwaC5udW1Qb2ludHMpO1xuXHRcdFx0fSk7XG5cdFx0XHRzaW1wbGVHbHlwaC5udW1Qb2ludHMgKz0gZGVjb21wLm51bVBvaW50cztcblx0XHRcdHNpbXBsZUdseXBoLm51bWJlck9mQ29udG91cnMgKz0gZGVjb21wLm51bWJlck9mQ29udG91cnM7XG5cdFx0fSk7XG5cdH1cblxuXG5cdC8vIGFkZCB0aGUgNCBwaGFudG9tIHBvaW50c1xuXHRzaW1wbGVHbHlwaC5wb2ludHMucHVzaChbMCwwLDBdLCBbdGhpcy5wb2ludHNbdGhpcy5wb2ludHMubGVuZ3RoLTNdWzBdLDAsMF0sIFswLDAsMF0sIFswLDAsMF0pO1xuXG5cdC8vIHJldHVybiB0aGUgc2ltcGxlIGdseXBoXG5cdHJldHVybiBzaW1wbGVHbHlwaDtcblxufVxuXG4vLyBzdmdQYXRoKClcbi8vIC0gZXhwb3J0IGdseXBoIGFzIGEgc3RyaW5nIHN1aXRhYmxlIGZvciB0aGUgU1ZHIDxwYXRoPiBcImRcIiBhdHRyaWJ1dGVcblNhbXNhR2x5cGgucHJvdG90eXBlLnN2Z1BhdGggPSBmdW5jdGlvbiAoKSB7XG5cblx0bGV0IGNvbnRvdXJzID0gW107XG5cdGxldCBjb250b3VyLCBjb250b3VyTGVuLCBwdCwgcHRfLCBwdF9fLCBwLCBzdGFydFB0O1xuXHRsZXQgcGF0aCA9IFwiXCI7XG5cblx0c3dpdGNoICh0aGlzLmN1cnZlT3JkZXIpIHtcblxuXHRcdC8vIHF1YWRyYXRpYyBjdXJ2ZXNcblx0XHRjYXNlIDI6XG5cblx0XHRcdC8vIExPT1AgMTogY29udmVydCB0aGUgZ2x5cGggY29udG91cnMgaW50byBhbiBTVkctY29tcGF0aWJsZSBjb250b3VycyBhcnJheVxuXHRcdFx0c3RhcnRQdCA9IDA7XG5cdFx0XHR0aGlzLmVuZFB0cy5mb3JFYWNoKGVuZFB0ID0+IHtcblx0XHRcdFx0Y29udG91ckxlbiA9IGVuZFB0LXN0YXJ0UHQrMTsgLy8gbnVtYmVyIG9mIHBvaW50cyBpbiB0aGlzIGNvbnRvdXJcblx0XHRcdFx0Y29udG91ciA9IFtdO1xuXG5cdFx0XHRcdC8vIGluc2VydCBvbi1jdXJ2ZSBwb2ludHMgYmV0d2VlbiBhbnkgdHdvIGNvbnNlY3V0aXZlIG9mZi1jdXJ2ZSBwb2ludHNcblx0XHRcdFx0Zm9yIChwPXN0YXJ0UHQ7IHA8PWVuZFB0OyBwKyspIHtcblx0XHRcdFx0XHRwdCA9IHRoaXMucG9pbnRzW3BdO1xuXHRcdFx0XHRcdHB0XyA9IHRoaXMucG9pbnRzWyhwLXN0YXJ0UHQrMSklY29udG91ckxlbitzdGFydFB0XTtcblx0XHRcdFx0XHRjb250b3VyLnB1c2ggKHB0KTtcblx0XHRcdFx0XHRpZiAoIShwdFsyXSAmIDB4MDEgfHwgcHRfWzJdICYgMHgwMSkpIC8vIGlmIHdlIGhhdmUgMiBjb25zZWN1dGl2ZSBvZmYtY3VydmUgcG9pbnRzLi4uXG5cdFx0XHRcdFx0XHRjb250b3VyLnB1c2ggKCBbIChwdFswXStwdF9bMF0pLzIsIChwdFsxXStwdF9bMV0pLzIsIDEgXSApOyAvLyAuLi53ZSBpbnNlcnQgdGhlIGltcGxpZWQgb24tY3VydmUgcG9pbnRcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGVuc3VyZSBTVkcgY29udG91ciBzdGFydHMgd2l0aCBhbiBvbi1jdXJ2ZSBwb2ludFxuXHRcdFx0XHRpZiAoIShjb250b3VyWzBdWzJdICYgMHgwMSkpIC8vIGlzIGZpcnN0IHBvaW50IG9mZi1jdXJ2ZT9cblx0XHRcdFx0XHRjb250b3VyLnVuc2hpZnQoY29udG91ci5wb3AoKSk7IC8vIE9QVElNSVpFOiB1bnNoaWZ0IGlzIHNsb3csIHNvIG1heWJlIGJ1aWxkIHR3byBhcnJheXMsIFwiYWN0dWFsXCIgYW5kIFwidG9BcHBlbmRcIiwgd2hlcmUgXCJhY3R1YWxcIiBzdGFydHMgd2l0aCBhbiBvbi1jdXJ2ZVxuXG5cdFx0XHRcdC8vIGFwcGVuZCB0aGlzIGNvbnRvdXJcblx0XHRcdFx0Y29udG91cnMucHVzaChjb250b3VyKTtcblxuXHRcdFx0XHRzdGFydFB0ID0gZW5kUHQrMTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBMT09QIDI6IGNvbnZlcnQgY29udG91cnMgYXJyYXkgdG8gYW4gYWN0dWFsIFNWRyBwYXRoXG5cdFx0XHQvLyAtIHdl4oCZdmUgYWxyZWFkeSBmaXhlZCB0aGluZ3MgaW4gbG9vcCAxIHNvIHRoZXJlIGFyZSBuZXZlciBjb25zZWN1dGl2ZSBvZmYtY3VydmUgcG9pbnRzXG5cdFx0XHRjb250b3Vycy5mb3JFYWNoKGNvbnRvdXIgPT4ge1xuXHRcdFx0XHRmb3IgKHA9MDsgcDxjb250b3VyLmxlbmd0aDsgcCsrKSB7XG5cdFx0XHRcdFx0cHQgPSBjb250b3VyW3BdO1xuXHRcdFx0XHRcdGlmIChwPT0wKVxuXHRcdFx0XHRcdFx0cGF0aCArPSBgTSR7cHRbMF19ICR7cHRbMV19YDtcblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdGlmIChwdFsyXSAmIDB4MDEpIHsgLy8gb24tY3VydmUgcG9pbnQgKGNvbnN1bWUgMSBwb2ludClcblx0XHRcdFx0XHRcdFx0cGF0aCArPSBgTCR7cHRbMF19ICR7cHRbMV19YDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgeyAvLyBvZmYtY3VydmUgcG9pbnQgKGNvbnN1bWUgMiBwb2ludHMpXG5cdFx0XHRcdFx0XHRcdHB0XyA9IGNvbnRvdXJbKCsrcCkgJSBjb250b3VyLmxlbmd0aF07IC8vIGluY3JlbWVudHMgbG9vcCB2YXJpYWJsZSBwXG5cdFx0XHRcdFx0XHRcdHBhdGggKz0gYFEke3B0WzBdfSAke3B0WzFdfSAke3B0X1swXX0gJHtwdF9bMV19YDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cGF0aCArPSBcIlpcIjtcblx0XHRcdH0pO1xuXG5cdFx0XHRicmVhaztcblxuXHRcdC8vIGN1YmljIGN1cnZlc1xuXHRcdC8vIC0gRVhQRVJJTUVOVEFMIVxuXHRcdC8vIC0gZm9yIHVzZSB3aXRoIHR0Zi1jdWJpYyBmb3JtYXQsIGNmZiAod2hlbiB3ZSBpbXBsZW1lbnQgY2ZmKSwgYW5kIGdseWYxXG5cdFx0Y2FzZSAzOlxuXHRcdFx0c3RhcnRQdCA9IDA7XG5cblx0XHRcdC8vIGxvb3AgdGhyb3VnaCBlYWNoIGNvbnRvdXJcblx0XHRcdHRoaXMuZW5kUHRzLmZvckVhY2goZW5kUHQgPT4ge1xuXG5cdFx0XHRcdGxldCBmaXJzdE9uUHQ7XG5cdFx0XHRcdGNvbnRvdXJMZW4gPSBlbmRQdC1zdGFydFB0KzE7XG5cblx0XHRcdFx0Ly8gZmluZCB0aGlzIGNvbnRvdXLigJlzIGZpcnN0IG9uLWN1cnZlIHBvaW50OiBpdCBpcyBlaXRoZXIgc3RhcnRQdCwgc3RhcnRQdCsxIG9yIHN0YXJ0UHQrMiAoZWxzZSB0aGUgY29udG91ciBpcyBpbnZhbGlkKVxuXHRcdFx0XHRpZiAgICAgIChjb250b3VyTGVuID49IDEgJiYgdGhpcy5wb2ludHNbc3RhcnRQdF1bMl0gJiAweDAxKVxuXHRcdFx0XHRcdGZpcnN0T25QdCA9IDA7XG5cdFx0XHRcdGVsc2UgaWYgKGNvbnRvdXJMZW4gPj0gMiAmJiB0aGlzLnBvaW50c1tzdGFydFB0KzFdWzJdICYgMHgwMSlcblx0XHRcdFx0XHRmaXJzdE9uUHQgPSAxO1xuXHRcdFx0XHRlbHNlIGlmIChjb250b3VyTGVuID49IDMgJiYgdGhpcy5wb2ludHNbc3RhcnRQdCsyXVsyXSAmIDB4MDEpXG5cdFx0XHRcdFx0Zmlyc3RPblB0ID0gMjtcblxuXHRcdFx0XHRpZiAoZmlyc3RPblB0ICE9PSB1bmRlZmluZWQpIHtcblxuXHRcdFx0XHRcdC8vIGxvb3AgdGhyb3VnaCBhbGwgdGhpcyBjb250b3Vy4oCZcyBwb2ludHNcblx0XHRcdFx0XHRmb3IgKHA9MDsgcDxjb250b3VyTGVuOyBwKyspIHtcblxuXHRcdFx0XHRcdFx0cHQgPSB0aGlzLnBvaW50c1tzdGFydFB0ICsgKHArZmlyc3RPblB0KSAlIGNvbnRvdXJMZW5dO1xuXHRcdFx0XHRcdFx0aWYgKHA9PTApXG5cdFx0XHRcdFx0XHRcdHBhdGggKz0gYE0ke3B0WzBdfSAke3B0WzFdfWA7XG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0aWYgKHB0WzJdICYgMHgwMSkgeyAvLyBvbi1jdXJ2ZSBwb2ludCAoY29uc3VtZSAxIHBvaW50KVxuXHRcdFx0XHRcdFx0XHRcdHBhdGggKz0gYEwke3B0WzBdfSAke3B0WzFdfWA7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZSB7IC8vIG9mZi1jdXJ2ZSBwb2ludCAoY29uc3VtZSAzIHBvaW50cylcblx0XHRcdFx0XHRcdFx0XHRwdF8gPSB0aGlzLnBvaW50c1tzdGFydFB0ICsgKCgrK3AgKyBmaXJzdE9uUHQpICUgY29udG91ckxlbildOyAvLyBpbmNyZW1lbnRzIGxvb3AgdmFyaWFibGUgcFxuXHRcdFx0XHRcdFx0XHRcdHB0X18gPSB0aGlzLnBvaW50c1tzdGFydFB0ICsgKCgrK3AgKyBmaXJzdE9uUHQpICUgY29udG91ckxlbildOyAvLyBpbmNyZW1lbnRzIGxvb3AgdmFyaWFibGUgcFxuXHRcdFx0XHRcdFx0XHRcdHBhdGggKz0gYEMke3B0WzBdfSAke3B0WzFdfSAke3B0X1swXX0gJHtwdF9bMV19ICR7cHRfX1swXX0gJHtwdF9fWzFdfWA7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYgKHAgPT0gKGNvbnRvdXJMZW4rZmlyc3RPblB0LTEpICUgY29udG91ckxlbilcblx0XHRcdFx0XHRcdFx0XHRwYXRoICs9IFwiWlwiO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHN0YXJ0UHQgPSBlbmRQdCsxO1xuXHRcdFx0fSk7XG5cdFx0XHRicmVhaztcblx0fVxuXG5cdHJldHVybiBwYXRoO1xufTtcblxuLy8gZXhwb3J0UGF0aCgpXG4vLyAtIGV4cG9ydCBnbHlwaCBvdXRsaW5lIGluIGFyYml0cmFyeSB3YXlzLCBhY2NvcmRpbmcgdG8gdGhlIHN1cHBsaWVkIFNhbXNhQ29udGV4dFxuLy8gLSBTYW1zYUNvbnRleHQgcHJvdmlkZXMgdmFyaW91cyBmdW5jdGlvbnMsIGN0eC5tb3ZldG8oKSwgY3R4LmxpbmV0bywgY3R4LnF1YWR0bywgZXRjLlxuU2Ftc2FHbHlwaC5wcm90b3R5cGUuZXhwb3J0UGF0aCA9IGZ1bmN0aW9uIChjdHgpIHtcblxuXHRjb25zdCBjb250b3VycyA9IFtdO1xuXHRjb25zdCBnbHlwaCA9IHRoaXMubnVtYmVyT2ZDb250b3VycyA8IDAgPyB0aGlzLmRlY29tcG9zZSgpIDogdGhpcztcblx0bGV0IGNvbnRvdXIsIGNvbnRvdXJMZW4sIHB0LCBwdF8sIHB0X18sIGMsIHAsIHN0YXJ0UHQ7XG5cblx0c3dpdGNoICh0aGlzLmN1cnZlT3JkZXIpIHtcblxuXHRcdC8vIHF1YWRyYXRpYyBjdXJ2ZXNcblx0XHRjYXNlIDI6XG5cblx0XHRcdC8vIExPT1AgMTogY29udmVydCB0aGUgZ2x5cGggY29udG91cnMgaW50byBhbiBTVkctY29tcGF0aWJsZSBjb250b3VycyBhcnJheVxuXHRcdFx0c3RhcnRQdCA9IDA7XG5cdFx0XHQvL3RoaXMuZW5kUHRzLmZvckVhY2goZW5kUHQgPT4ge1xuXHRcdFx0Z2x5cGguZW5kUHRzLmZvckVhY2goZW5kUHQgPT4ge1xuXHRcdFx0XHRcblx0XHRcdFx0Y29udG91ckxlbiA9IGVuZFB0LXN0YXJ0UHQrMTsgLy8gbnVtYmVyIG9mIHBvaW50cyBpbiB0aGlzIGNvbnRvdXJcblx0XHRcdFx0Y29udG91ciA9IFtdO1xuXG5cdFx0XHRcdC8vIGluc2VydCBvbi1jdXJ2ZSBwb2ludHMgYmV0d2VlbiBhbnkgdHdvIGNvbnNlY3V0aXZlIG9mZi1jdXJ2ZSBwb2ludHNcblx0XHRcdFx0Zm9yIChwPXN0YXJ0UHQ7IHA8PWVuZFB0OyBwKyspIHtcblx0XHRcdFx0XHQvLyBwdCA9IHRoaXMucG9pbnRzW3BdO1xuXHRcdFx0XHRcdC8vIHB0XyA9IHRoaXMucG9pbnRzWyhwLXN0YXJ0UHQrMSklY29udG91ckxlbitzdGFydFB0XTtcblx0XHRcdFx0XHRwdCA9IGdseXBoLnBvaW50c1twXTtcblx0XHRcdFx0XHRwdF8gPSBnbHlwaC5wb2ludHNbKHAtc3RhcnRQdCsxKSVjb250b3VyTGVuK3N0YXJ0UHRdO1xuXHRcdFx0XHRcdGNvbnRvdXIucHVzaCAocHQpO1xuXHRcdFx0XHRcdGlmICghKHB0WzJdICYgMHgwMSB8fCBwdF9bMl0gJiAweDAxKSkgLy8gaWYgd2UgaGF2ZSAyIGNvbnNlY3V0aXZlIG9mZi1jdXJ2ZSBwb2ludHMuLi5cblx0XHRcdFx0XHRcdGNvbnRvdXIucHVzaCAoIFsgKHB0WzBdK3B0X1swXSkvMiwgKHB0WzFdK3B0X1sxXSkvMiwgMSBdICk7IC8vIC4uLndlIGluc2VydCB0aGUgaW1wbGllZCBvbi1jdXJ2ZSBwb2ludFxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gZW5zdXJlIFNWRyBjb250b3VyIHN0YXJ0cyB3aXRoIGFuIG9uLWN1cnZlIHBvaW50XG5cdFx0XHRcdGlmICghKGNvbnRvdXJbMF1bMl0gJiAweDAxKSkgLy8gaXMgZmlyc3QgcG9pbnQgb2ZmLWN1cnZlP1xuXHRcdFx0XHRcdGNvbnRvdXIudW5zaGlmdChjb250b3VyLnBvcCgpKTsgLy8gT1BUSU1JWkU6IHVuc2hpZnQgaXMgc2xvdywgc28gbWF5YmUgYnVpbGQgdHdvIGFycmF5cywgXCJhY3R1YWxcIiBhbmQgXCJ0b0FwcGVuZFwiLCB3aGVyZSBcImFjdHVhbFwiIHN0YXJ0cyB3aXRoIGFuIG9uLWN1cnZlXG5cblx0XHRcdFx0Ly8gYXBwZW5kIHRoaXMgY29udG91clxuXHRcdFx0XHRjb250b3Vycy5wdXNoKGNvbnRvdXIpO1xuXHRcdFx0XHRzdGFydFB0ID0gZW5kUHQrMTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBMT09QIDI6IGNvbnZlcnQgY29udG91cnMgYXJyYXkgdG8gYW4gYWN0dWFsIFNWRyBwYXRoXG5cdFx0XHQvLyAtIHdl4oCZdmUgYWxyZWFkeSBmaXhlZCB0aGluZ3MgaW4gbG9vcCAxIHNvIHRoZXJlIGFyZSBuZXZlciBjb25zZWN1dGl2ZSBvZmYtY3VydmUgcG9pbnRzXG5cdFx0XHRjb250b3Vycy5mb3JFYWNoKGNvbnRvdXIgPT4ge1xuXHRcdFx0XHRmb3IgKHA9MDsgcDxjb250b3VyLmxlbmd0aDsgcCsrKSB7XG5cdFx0XHRcdFx0cHQgPSBjb250b3VyW3BdO1xuXHRcdFx0XHRcdGlmIChwPT0wKSB7XG5cdFx0XHRcdFx0XHRjdHgubW92ZXRvKHB0WzBdLCBwdFsxXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKHB0WzJdICYgMHgwMSkgeyAvLyBvbi1jdXJ2ZSBwb2ludCAoY29uc3VtZSAxIHBvaW50KVxuXHRcdFx0XHRcdFx0XHRjdHgubGluZXRvKHB0WzBdLCBwdFsxXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHsgLy8gb2ZmLWN1cnZlIHBvaW50IChjb25zdW1lIDIgcG9pbnRzKVxuXHRcdFx0XHRcdFx0XHRwdF8gPSBjb250b3VyWygrK3ApICUgY29udG91ci5sZW5ndGhdOyAvLyBpbmNyZW1lbnRzIGxvb3AgdmFyaWFibGUgcFxuXHRcdFx0XHRcdFx0XHRjdHgucXVhZHRvKHB0WzBdLCBwdFsxXSwgcHRfWzBdLCBwdF9bMV0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRjdHguY2xvc2VwYXRoKCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0YnJlYWs7XG5cblx0XHQvLyBjdWJpYyBjdXJ2ZXNcblx0XHQvLyAtIEVYUEVSSU1FTlRBTCFcblx0XHQvLyAtIGZvciB1c2Ugd2l0aCB0dGYtY3ViaWMgZm9ybWF0LCBjZmYgKHdoZW4gd2UgaW1wbGVtZW50IGNmZiksIGFuZCBnbHlmMVxuXHRcdGNhc2UgMzpcblx0XHRcdHN0YXJ0UHQgPSAwO1xuXG5cdFx0XHQvLyBsb29wIHRocm91Z2ggZWFjaCBjb250b3VyXG5cdFx0XHR0aGlzLmVuZFB0cy5mb3JFYWNoKGVuZFB0ID0+IHtcblxuXHRcdFx0XHRsZXQgZmlyc3RPblB0O1xuXHRcdFx0XHRjb250b3VyTGVuID0gZW5kUHQtc3RhcnRQdCsxO1xuXG5cdFx0XHRcdC8vIGZpbmQgdGhpcyBjb250b3Vy4oCZcyBmaXJzdCBvbi1jdXJ2ZSBwb2ludDogaXQgaXMgZWl0aGVyIHN0YXJ0UHQsIHN0YXJ0UHQrMSBvciBzdGFydFB0KzIgKGVsc2UgdGhlIGNvbnRvdXIgaXMgaW52YWxpZClcblx0XHRcdFx0aWYgICAgICAoY29udG91ckxlbiA+PSAxICYmIHRoaXMucG9pbnRzW3N0YXJ0UHRdWzJdICYgMHgwMSlcblx0XHRcdFx0XHRmaXJzdE9uUHQgPSAwO1xuXHRcdFx0XHRlbHNlIGlmIChjb250b3VyTGVuID49IDIgJiYgdGhpcy5wb2ludHNbc3RhcnRQdCsxXVsyXSAmIDB4MDEpXG5cdFx0XHRcdFx0Zmlyc3RPblB0ID0gMTtcblx0XHRcdFx0ZWxzZSBpZiAoY29udG91ckxlbiA+PSAzICYmIHRoaXMucG9pbnRzW3N0YXJ0UHQrMl1bMl0gJiAweDAxKVxuXHRcdFx0XHRcdGZpcnN0T25QdCA9IDI7XG5cblx0XHRcdFx0aWYgKGZpcnN0T25QdCAhPT0gdW5kZWZpbmVkKSB7XG5cblx0XHRcdFx0XHQvLyBsb29wIHRocm91Z2ggYWxsIHRoaXMgY29udG91cuKAmXMgcG9pbnRzXG5cdFx0XHRcdFx0Zm9yIChwPTA7IHA8Y29udG91ckxlbjsgcCsrKSB7XG5cblx0XHRcdFx0XHRcdHB0ID0gdGhpcy5wb2ludHNbc3RhcnRQdCArIChwK2ZpcnN0T25QdCkgJSBjb250b3VyTGVuXTtcblx0XHRcdFx0XHRcdGlmIChwPT0wKSB7XG5cdFx0XHRcdFx0XHRcdGN0eC5tb3ZldG8ocHRbMF0sIHB0WzFdKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRpZiAocHRbMl0gJiAweDAxKSB7IC8vIG9uLWN1cnZlIHBvaW50IChjb25zdW1lIDEgcG9pbnQpXG5cdFx0XHRcdFx0XHRcdFx0Y3R4LmxpbmV0byhwdFswXSwgcHRbMV0pO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGVsc2UgeyAvLyBvZmYtY3VydmUgcG9pbnQgKGNvbnN1bWUgMyBwb2ludHMpXG5cdFx0XHRcdFx0XHRcdFx0cHRfID0gdGhpcy5wb2ludHNbc3RhcnRQdCArICgoKytwICsgZmlyc3RPblB0KSAlIGNvbnRvdXJMZW4pXTsgLy8gaW5jcmVtZW50cyBsb29wIHZhcmlhYmxlIHBcblx0XHRcdFx0XHRcdFx0XHRwdF9fID0gdGhpcy5wb2ludHNbc3RhcnRQdCArICgoKytwICsgZmlyc3RPblB0KSAlIGNvbnRvdXJMZW4pXTsgLy8gaW5jcmVtZW50cyBsb29wIHZhcmlhYmxlIHBcblx0XHRcdFx0XHRcdFx0XHRjdHguY3VydmV0byhwdFswXSwgcHRbMV0sIHB0X1swXSwgcHRfWzFdLCBwdF9fWzBdLCBwdF9fWzFdKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZiAocCA9PSAoY29udG91ckxlbitmaXJzdE9uUHQtMSkgJSBjb250b3VyTGVuKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y3R4LmNsb3NlcGF0aCgpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0c3RhcnRQdCA9IGVuZFB0KzE7XG5cdFx0XHR9KTtcblx0XHRcdGJyZWFrO1xuXHR9XG5cblx0Ly9yZXR1cm4gcGF0aDtcbn07XG5cbi8vIHByb2Nlc3MgcGFpbnQgdGFibGVzIGZvciBhIGdseXBoLCBwcm9kdWNpbmcgYSBEQUcgKGRpcmVjdGVkIGFjeWNsaWMgZ3JhcGgpIG9mIHBhaW50IHRhYmxlcywgdGhhdCBjYW4gYmUgdXNlZCB0byByZW5kZXIgdGhlIGdseXBoIG9yIG1ha2UgYSBkaWFncmFtIG9mIGl0cyBwYWludCBzdHJ1Y3R1cmVcbi8vIC0gcmV0dXJuIGZhbHNlIGlmIHRoZXJlIGlzIG5vIENPTFJ2MSBkYXRhIGZvciB0aGlzIGdseXBoXG4vLyAtIGNvbnNpZGVyIHJldHVybmluZyBDT0xSdjAgZGF0YSBpbiB0aGUgZm9ybSBvZiBwYWludCB0YWJsZXMsIHNvIHRoYXQgb25seSBvbmUgY29sb3VyIFwicmVuZGVyZXJcIiBpcyBuZWVkZWRcblNhbXNhR2x5cGgucHJvdG90eXBlLnBhaW50ID0gZnVuY3Rpb24gKGNvbnRleHQ9e30pIHtcblx0Y29uc3Qgb2Zmc2V0ID0gdGhpcy5maW5kQ09MUigxKTtcblxuXHRpZiAoIW9mZnNldCkge1xuXHRcdHJldHVybiBmYWxzZTsgLy8gbm8gQ09MUnYxIGRhdGEgZm9yIHRoaXMgZ2x5cGhcblx0fVxuXHRlbHNlIHtcblx0XHRjb25zdCBmb250ID0gdGhpcy5mb250O1xuXHRcdGNvbnN0IGJ1ZiA9IGZvbnQuYnVmZmVyRnJvbVRhYmxlKFwiQ09MUlwiKTtcblx0XHRjb25zdCBjb2xyID0gZm9udC5DT0xSO1xuXHRcdGNvbnN0IGNwYWwgPSBmb250LkNQQUw7XG5cdFx0Y29uc3QgZ3JhZGllbnRzID0gY29udGV4dC5ncmFkaWVudHM7XG5cdFx0Y29uc3QgcGFsZXR0ZSA9IGNwYWwucGFsZXR0ZXNbY29udGV4dC5wYWxldHRlSWQgfHwgMF07XG5cblx0XHRpZiAoY29udGV4dC5jb2xvciA9PT0gdW5kZWZpbmVkKSBjb250ZXh0LmNvbG9yID0gMHgwMDAwMDBmZjtcblx0XHRpZiAoIWNvbnRleHQucmVuZGVyaW5nKSBjb250ZXh0LnJlbmRlcmluZyA9IHt9O1xuXHRcdGlmICghY29udGV4dC5ncmFkaWVudHMpIGNvbnRleHQuZ3JhZGllbnRzID0ge307XG5cdFx0aWYgKCFjb250ZXh0LmZvbnQpIGNvbnRleHQuZm9udCA9IGZvbnQ7XG5cdFx0aWYgKCFjb250ZXh0LnJlbmRlcmluZykgY29udGV4dC5yZW5kZXJpbmcgPSB7fTtcblx0XHRjb250ZXh0LnBhaW50SWRzID0gW107IC8vIGtlZXAgdHJhY2sgb2YgdGhlIHBhaW50IElEcyB3ZeKAmXZlIHVzZWQgKG11c3QgYmUgcmVzZXQgZm9yIGVhY2ggZ2x5cGgpOiB3ZSBcblxuXHRcdC8vIGZldGNoIHRoZSBEQUcgb2YgcGFpbnQgdGFibGVzIHJlY3Vyc2l2ZWx5XG5cdFx0YnVmLnNlZWsob2Zmc2V0KTtcblx0XHRjb25zdCBwYWludCA9IGJ1Zi5kZWNvZGVQYWludChjb250ZXh0KTsgLy8gcmVjdXJzaXZlIChvZmZlciBhIG5vbi1yZWN1cnNpdmUgb3B0aW9uPylcblx0XHRjb250ZXh0LnBhaW50SWRzID0gbnVsbDsgLy8gd2Ugbm8gbG9uZ2VyIG5lZWQgdGhpc1xuXHRcdHJldHVybiBwYWludDtcblx0fVxufVxuXG5cbi8vIHBhaW50U1ZHKCkgcmVuZGVycyBhIENPTFJ2MSBEQUcgKHBhaW50IHRyZWUpIHJlY3Vyc2l2ZWx5XG4vLyAtIHBhaW50IChyZXF1aXJlZCkgaXMgdGhlIHJvb3Qgb2YgdGhlIERBRywgb3Igc3Vicm9vdCB3aGVuIGNhbGxlZCByZWN1cnNpdmVseVxuLy8gLSBjb250ZXh0IChyZXF1aXJlZCkgY29udGFpbnM6XG4vLyAgIC5mb250LCBhIHJlZmVyZW5jZSB0byB0aGUgU2Ftc2FGb250IG9iamVjdFxuLy8gICAuY29sb3IsIHRoZSBmb3JlZ3JvdW5kIGNvbG9yIGJlaW5nIHVzZWQgaW4gVTMyIGZvcm1hdCAob3B0aW9uYWwsIGRlZmF1bHQgaXMgMHgwMDAwMDBmZilcbi8vICAgLnBhdGhzLCBvYmplY3QgdG8gY2FjaGUgdGhlIG1vbm9jaHJvbWUgZ2x5cGggb3V0bGluZXMgdXNlZCBpbiB0aGUgdGV4dCBydW4sIGluZGV4ZWQgYnkgZ2x5cGhJZFxuLy8gICAuZ3JhZGllbnRzLCBvYmplY3QgdG8gY2FjaGUgdGhlIGdyYWRpZW50cyB1c2VkLCBpbmRleGVkIGJ5IGdyYWRpZW50SWRcbi8vIC0gdGhlIGZ1bmN0aW9uIGRvZXMgbm90IG1ha2UgdXNlIG9mIHRoZSBTYW1zYUdseXBoIG9iamVjdCBhdCBhbGwsIGl04oCZcyBqdXN0IGNvbnZlbmllbnQgZm9yIGV4cG9ydFxuLy8gLSB0aGUgbWFpbiBzd2l0Y2ggc3RhdGVtZW50IHNlbGVjdHMgYmV0d2VlbiB0aGUgNCBwYWludCB0eXBlczsgcGFpbnQgdHlwZXMgZ3JvdXAgcGFpbnQgZm9ybWF0cyB0b2dldGhlciwgYW5kIGFyZSBzdG9yZWQgaW4gUEFJTlRfVFlQRVM7IFBBSU5UX0NPTVBPU0UgaXMgdGhlIG9ubHkgbm9uLXJlY3Vyc2l2ZSBwYWludCB0eXBlIChwYWludCBmb3JtYXQ9MzIgaXMgYSBzcGVjaWFsIGNhc2Ugd2hpY2ggbmVlZHMgdG8gcmVjdXJzZSAyIHBhaW50IHRyZWVzIGJlZm9yZSB0aGUgY29tcG9zZSBvcGVyYXRpb24pXG4vLyAtIHRoZSByZXN1bHQgb2YgYSBwYWludFNWRygpIHN0aWxsIG5lZWRzIHRvIGJlIHdyYXBwZWQgaW4gYSA8c3ZnPiBlbGVtZW50LCBhbmQgPGRlZnM+IG5lZWRzIHRvIGJlIGNvbnN0cnVjdGVkIGZyb20gLnBhdGhzIGFuZCAuZ3JhZGllbnRzXG5TYW1zYUdseXBoLnByb3RvdHlwZS5wYWludFNWRyA9IGZ1bmN0aW9uIChwYWludCwgY29udGV4dCkge1xuXHRmdW5jdGlvbiBleHBhbmRBdHRycyAoYXR0cnMpIHtcblx0XHRsZXQgc3RyID0gXCJcIjtcblx0XHRmb3IgKGxldCBhdHRyIGluIGF0dHJzKSB7XG5cdFx0XHRpZiAoYXR0cnNbYXR0cl0gIT09IHVuZGVmaW5lZClcblx0XHRcdFx0c3RyICs9IGAgJHthdHRyfT1cIiR7YXR0cnNbYXR0cl19XCJgO1xuXHRcdH1cblx0XHRyZXR1cm4gc3RyO1xuXHR9XG5cblx0Y29uc3QgZm9udCA9IGNvbnRleHQuZm9udDtcblx0Y29uc3QgZXh0ZW5kTW9kZXMgPSBbXCJwYWRcIiwgXCJyZXBlYXRcIiwgXCJyZWZsZWN0XCJdO1xuXHRjb25zdCBwYWxldHRlID0gZm9udC5DUEFMLnBhbGV0dGVzW2NvbnRleHQucGFsZXR0ZUlkIHx8IDBdO1xuXHRpZiAoY29udGV4dC5jb2xvciA9PT0gdW5kZWZpbmVkKVxuXHRcdGNvbnRleHQuY29sb3IgPSAweDAwMDAwMGZmOyAvLyBibGFja1xuXG5cdGxldCBzdmcgPSBgPGc+YDtcblxuXHRzd2l0Y2ggKFBBSU5UX1RZUEVTW3BhaW50LmZvcm1hdF0pIHtcblxuXHRcdGNhc2UgUEFJTlRfTEFZRVJTOiB7XG5cdFx0XHRwYWludC5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcblx0XHRcdFx0c3ZnICs9IHRoaXMucGFpbnRTVkcoY2hpbGQsIGNvbnRleHQpO1xuXHRcdFx0fSk7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRjYXNlIFBBSU5UX1NIQVBFOiB7XG5cdFx0XHRpZiAoIWNvbnRleHQucGF0aHNbcGFpbnQuZ2x5cGhJRF0pIHtcblx0XHRcdFx0Y29uc3QgZ2x5cGggPSBjb250ZXh0LmZvbnQuZ2x5cGhzW3BhaW50LmdseXBoSURdO1xuXHRcdFx0XHRjb25zdCBpZ2x5cGggPSBnbHlwaC5pbnN0YW50aWF0ZShjb250ZXh0Lmluc3RhbmNlKTtcblx0XHRcdFx0Y29uc3QgcGF0aCA9IGlnbHlwaC5zdmdHbHlwaE1vbm9jaHJvbWUoMCk7IC8vIHJldHJpZXZlIGl0IGlmIHdlIGRvbid0IGFscmVhZHkgaGF2ZSBpdFxuXHRcdFx0XHRjb250ZXh0LnBhdGhzW3BhaW50LmdseXBoSURdID0gYDxwYXRoIGlkPVwiZyR7cGFpbnQuZ2x5cGhJRH1cIiBkPVwiJHtwYXRofVwiLz5gO1xuXHRcdFx0fVxuXHRcdFx0Y29udGV4dC5sYXN0R2x5cGhJZCA9IHBhaW50LmdseXBoSUQ7XG5cdFx0XHRzdmcgKz0gdGhpcy5wYWludFNWRyhwYWludC5jaGlsZHJlblswXSwgY29udGV4dCk7IC8vIHRoZXJl4oCZcyBvbmx5IG9uZSBjaGlsZDsgdGhpcyBzaG91bGQgYmUgYSBmaWxsIG9yIGEgZ3JhZGllbnQgKG9yIG1heWJlIGFub3RoZXIgUEFJTlRfU0hBUEUpXG5cdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRjYXNlIFBBSU5UX1RSQU5TRk9STToge1xuXHRcdFx0Y29uc3QgY2VudGVyID0gcGFpbnQuY2VudGVyO1xuXHRcdFx0bGV0IHRyYW5zZm9ybSA9IFwiXCI7XG5cdFx0XHRpZiAocGFpbnQudHJhbnNsYXRlKSB7XG5cdFx0XHRcdHRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHtwYWludC50cmFuc2xhdGVbMF19ICR7cGFpbnQudHJhbnNsYXRlWzFdfSlgO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAocGFpbnQubWF0cml4KSB7XG5cdFx0XHRcdHRyYW5zZm9ybSA9IGBtYXRyaXgoJHtwYWludC5tYXRyaXguam9pbihcIiBcIil9KWA7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChwYWludC5yb3RhdGUpIHtcblx0XHRcdFx0dHJhbnNmb3JtICs9IGByb3RhdGUoJHstcGFpbnQucm90YXRlfWAgKyAoY2VudGVyID8gYCAke2NlbnRlclswXX0gJHtjZW50ZXJbMV19YCA6IFwiXCIpICtgKWA7IC8vIGZsaXAgc2lnbiBvZiBhbmdsZSwgYW5kIHVzZSB0aGUgMy1hcmd1bWVudCBmb3JtIGlmIHRoZXJlIGlzIGEgY2VudGVyXG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYgKGNlbnRlcikge1xuXHRcdFx0XHRcdHRyYW5zZm9ybSArPSBgdHJhbnNsYXRlKCR7Y2VudGVyWzBdfSAke2NlbnRlclsxXX0pIGA7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHBhaW50LnNjYWxlKSB7XG5cdFx0XHRcdFx0dHJhbnNmb3JtICs9IGBzY2FsZSgke3BhaW50LnNjYWxlWzBdfSAke3BhaW50LnNjYWxlWzFdfSlgO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKHBhaW50LnNrZXcpIHtcblx0XHRcdFx0XHR0cmFuc2Zvcm0gKz0gYHNrZXdYKCR7LXBhaW50LnNrZXdbMF19KXNrZXdZKCR7LXBhaW50LnNrZXdbMV19KWA7IC8vIGZsaXAgc2lnbiBvZiBhbmdsZXNcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY2VudGVyKSB7XG5cdFx0XHRcdFx0dHJhbnNmb3JtICs9IGAgdHJhbnNsYXRlKCR7LWNlbnRlclswXX0gJHstY2VudGVyWzFdfSlgO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8qXG5cdFx0XHRzd2l0Y2ggKHBhaW50LmZvcm1hdCAtIHBhaW50LmZvcm1hdCAlIDIpIHsgLy8gMTIgYW5kIDEzIC0+IDEyLCAxNCBhbmQgMTUgLT4gMTQsIGV0Yy4gKHZhcmlhdGlvbiBkZWx0YXMgaGF2ZSBhbHJlYWR5IGJlZW4gYWRkZWQpXG5cblx0XHRcdFx0Ly8gdGhlc2UgYXJlIG1vcmUgZWZmaWNuZW50bHkgZG9uZSBieSBjaGVja2luZyBwYWludC5za2V3IGV0Yy4gZGlyZWN0bHlcblx0XHRcdFx0Ly8gaWYgKHBhaW50Lm1hdHJpeCkgZXRjLlxuXG5cdFx0XHRcdGNhc2UgMTI6IHsgLy8gUGFpbnRUcmFuc2Zvcm1cblx0XHRcdFx0XHR0cmFuc2Zvcm0gPSBgbWF0cml4KCR7cGFpbnQubWF0cml4LmpvaW4oXCIgXCIpfSlgO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhc2UgMTQ6IHsgLy8gUGFpbnRUcmFuc2xhdGVcblx0XHRcdFx0XHR0cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7cGFpbnQudHJhbnNsYXRlWzBdfSAke3BhaW50LnRyYW5zbGF0ZVsxXX0pYDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXNlIDE2OiBjYXNlIDE4OiBjYXNlIDIwOiBjYXNlIDIyOiB7IC8vIFBhaW50U2NhbGVcblx0XHRcdFx0XHRpZiAocGFpbnQuY2VudGVyKSB0cmFuc2Zvcm0gKz0gYHRyYW5zbGF0ZSgkey1wYWludC5jZW50ZXJbMF19ICR7LXBhaW50LmNlbnRlclsxXX0pYDtcblx0XHRcdFx0XHR0cmFuc2Zvcm0gKz0gYHNjYWxlKCR7cGFpbnQuc2NhbGUuam9pbihcIiBcIil9KWA7XG5cdFx0XHRcdFx0aWYgKHBhaW50LmNlbnRlcikgdHJhbnNmb3JtICs9IGB0cmFuc2xhdGUoJHtwYWludC5jZW50ZXJbMF19ICR7cGFpbnQuY2VudGVyWzFdfSlgO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhc2UgMjQ6IGNhc2UgMjY6IHsgLy8gUGFpbnRSb3RhdGVcblx0XHRcdFx0XHRpZiAocGFpbnQuY2VudGVyKSB0cmFuc2Zvcm0gKz0gYHRyYW5zbGF0ZSgkey1wYWludC5jZW50ZXJbMF19ICR7LXBhaW50LmNlbnRlclsxXX0pYDtcblx0XHRcdFx0XHR0cmFuc2Zvcm0gKz0gYHJvdGF0ZSgkey1wYWludC5yb3RhdGV9KWA7IC8vIGZsaXAgc2lnbiBvZiBhbmdsZVxuXHRcdFx0XHRcdGlmIChwYWludC5jZW50ZXIpIHRyYW5zZm9ybSArPSBgdHJhbnNsYXRlKCR7cGFpbnQuY2VudGVyWzBdfSAke3BhaW50LmNlbnRlclsxXX0pYDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXNlIDI4OiBjYXNlIDMwOiB7IC8vIFBhaW50U2tld1xuXHRcdFx0XHRcdGlmIChwYWludC5jZW50ZXIpIHRyYW5zZm9ybSArPSBgdHJhbnNsYXRlKCR7LXBhaW50LmNlbnRlclswXX0gJHstcGFpbnQuY2VudGVyWzFdfSlgO1xuXHRcdFx0XHRcdHRyYW5zZm9ybSArPSBgc2tld1goJHstcGFpbnQuc2tld1swXX0pYDsgLy8gZmxpcCBzaWduIG9mIGFuZ2xlXG5cdFx0XHRcdFx0dHJhbnNmb3JtICs9IGBza2V3WSgkey1wYWludC5za2V3WzFdfSlgOyAvLyBmbGlwIHNpZ24gb2YgYW5nbGVcblx0XHRcdFx0XHRpZiAocGFpbnQuY2VudGVyKSB0cmFuc2Zvcm0gKz0gYHRyYW5zbGF0ZSgke3BhaW50LmNlbnRlclswXX0gJHtwYWludC5jZW50ZXJbMV19KWA7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdCovXG5cblx0XHRcdHN2ZyA9IGA8ZyB0cmFuc2Zvcm09XCIke3RyYW5zZm9ybX1cIj5gOyAvLyByZXdyaXRlIDxnPiB0YWdcblx0XHRcdHN2ZyArPSB0aGlzLnBhaW50U1ZHKHBhaW50LmNoaWxkcmVuWzBdLCBjb250ZXh0KTsgLy8gdGhlcmXigJlzIG9ubHkgb25lIGNoaWxkXG5cdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRjYXNlIFBBSU5UX0NPTVBPU0U6IHtcblx0XHRcdHN3aXRjaCAocGFpbnQuZm9ybWF0KSB7XG5cdFx0XHRcdGNhc2UgMjogY2FzZSAzOiB7IC8vIFBhaW50U29saWRcblx0XHRcdFx0XHRjb25zdCBwYWxldHRlSW5kZXggPSBwYWludC5wYWxldHRlSW5kZXg7XG5cdFx0XHRcdFx0Y29uc3QgY29sb3IgPSBwYWxldHRlSW5kZXggPT0gMHhmZmZmID8gY29udGV4dC5jb2xvciA6IHBhbGV0dGUuY29sb3JzW3BhbGV0dGVJbmRleF07XG5cdFx0XHRcdFx0c3ZnICs9IGA8dXNlIHg9XCIwXCIgeT1cIjBcIiBocmVmPVwiI2cke2NvbnRleHQubGFzdEdseXBoSWR9XCIgZmlsbD1cIiR7Zm9udC5oZXhDb2xvckZyb21VMzIoY29sb3IpfVwiIC8+YDsgLy8gbWF5YmUgdXBkYXRlIHRoZXNlIHggYW5kIHkgbGF0ZXJcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNhc2UgNDogY2FzZSA1OiB7IC8vIFBhaW50TGluZWFyR3JhZGllbnRcblx0XHRcdFx0XHRpZiAoIWNvbnRleHQuZ3JhZGllbnRzW3BhaW50Lm9mZnNldF0pIHsgLy8gaWYgd2UgaGF2ZSBub3QgYWxyZWFkeSBzdG9yZWQgdGhpcyBwYWludCBpbiB0aGlzIGdseXBoIHJ1blxuXG5cdFx0XHRcdFx0XHQvLyBjYWxjdWxhdGUgdGhlIGdyYWRpZW50IGxpbmUgKHAweCxwMHkpLi4oZmluYWxYLCBmaW5hbFkpIGZyb20gdGhlIDMgcG9pbnRzIGJ5IGRldGVybWluaW5nIHRoZSBwcm9qZWN0aW9uIHZlY3RvciB2aWEgdGhlIGRvdCBwcm9kdWN0XG5cdFx0XHRcdFx0XHRjb25zdFxuXHRcdFx0XHRcdFx0XHRwMHggPSBwYWludC5wb2ludHNbMF1bMF0sXG5cdFx0XHRcdFx0XHRcdHAweSA9IHBhaW50LnBvaW50c1swXVsxXSxcblx0XHRcdFx0XHRcdFx0cDF4ID0gcGFpbnQucG9pbnRzWzFdWzBdLFxuXHRcdFx0XHRcdFx0XHRwMXkgPSBwYWludC5wb2ludHNbMV1bMV0sXG5cdFx0XHRcdFx0XHRcdHAyeCA9IHBhaW50LnBvaW50c1syXVswXSxcblx0XHRcdFx0XHRcdFx0cDJ5ID0gcGFpbnQucG9pbnRzWzJdWzFdLFxuXHRcdFx0XHRcdFx0XHRkMXggPSBwMXggLSBwMHgsXG5cdFx0XHRcdFx0XHRcdGQxeSA9IHAxeSAtIHAweSxcblx0XHRcdFx0XHRcdFx0ZDJ4ID0gcDJ4IC0gcDB4LFxuXHRcdFx0XHRcdFx0XHRkMnkgPSBwMnkgLSBwMHksXG5cdFx0XHRcdFx0XHRcdGRvdFByb2R1Y3QgPSBkMXgqZDJ4ICsgZDF5KmQyeSxcblx0XHRcdFx0XHRcdFx0cm90TGVuZ3RoU3F1YXJlZCA9IGQyeCpkMnggKyBkMnkqZDJ5LFxuXHRcdFx0XHRcdFx0XHRtYWduaXR1ZGUgPSBkb3RQcm9kdWN0IC8gcm90TGVuZ3RoU3F1YXJlZCxcblx0XHRcdFx0XHRcdFx0ZmluYWxYID0gcDF4IC0gbWFnbml0dWRlICogZDJ4LFxuXHRcdFx0XHRcdFx0XHRmaW5hbFkgPSBwMXkgLSBtYWduaXR1ZGUgKiBkMnk7XG5cblx0XHRcdFx0XHRcdGNvbnN0IGF0dHJzID0ge1xuXHRcdFx0XHRcdFx0XHRpZDogXCJmXCIgKyBwYWludC5vZmZzZXQsXG5cdFx0XHRcdFx0XHRcdHgxOiBwMHgsXG5cdFx0XHRcdFx0XHRcdHkxOiBwMHksXG5cdFx0XHRcdFx0XHRcdHgyOiBmaW5hbFgsXG5cdFx0XHRcdFx0XHRcdHkyOiBmaW5hbFksXG5cdFx0XHRcdFx0XHRcdGdyYWRpZW50VW5pdHM6IFwidXNlclNwYWNlT25Vc2VcIixcblx0XHRcdFx0XHRcdFx0c3ByZWFkTWV0aG9kIDogcGFpbnQuY29sb3JMaW5lLmV4dGVuZCA/IGV4dGVuZE1vZGVzW3BhaW50LmNvbG9yTGluZS5leHRlbmRdIDogdW5kZWZpbmVkLCAvLyB3ZSBjb3VsZCBhbGxvdyBcInBhZFwiIGhlcmUsIGJ1dCBpbnN0ZWFkIHdlIGlnbm9yZSBFWFRFTkRfUEFEICgwKSBzaW5jZSBpdCBpcyBkZWZhdWx0IGJlaGF2aW91clxuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdGxldCBncmFkaWVudCA9IGA8bGluZWFyR3JhZGllbnQke2V4cGFuZEF0dHJzKGF0dHJzKX0+YDtcblx0XHRcdFx0XHRcdHBhaW50LmNvbG9yTGluZS5jb2xvclN0b3BzLmZvckVhY2goY29sb3JTdG9wID0+IHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgcGFsZXR0ZUluZGV4ID0gY29sb3JTdG9wLnBhbGV0dGVJbmRleDtcblx0XHRcdFx0XHRcdFx0Y29uc3QgY29sb3IgPSBwYWxldHRlSW5kZXggPT0gMHhmZmZmID8gY29udGV4dC5jb2xvciA6IHBhbGV0dGUuY29sb3JzW3BhbGV0dGVJbmRleF07XG5cdFx0XHRcdFx0XHRcdGdyYWRpZW50ICs9IGA8c3RvcCBvZmZzZXQ9XCIke2NvbG9yU3RvcC5zdG9wT2Zmc2V0KjEwMH0lXCIgc3RvcC1jb2xvcj1cIiR7Zm9udC5oZXhDb2xvckZyb21VMzIoY29sb3IpfVwiLz5gO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRncmFkaWVudCArPSBgPC9saW5lYXJHcmFkaWVudD5gO1xuXHRcdFx0XHRcdFx0Y29udGV4dC5ncmFkaWVudHNbcGFpbnQub2Zmc2V0XSA9IGdyYWRpZW50OyAvLyBwYWludC5vZmZzZXQgaXMgZ3JhZGllbnRJZFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzdmcgKz0gYDx1c2UgaHJlZj1cIiNnJHtjb250ZXh0Lmxhc3RHbHlwaElkfVwiIGZpbGw9XCJ1cmwoI2Yke3BhaW50Lm9mZnNldH0pXCIgLz5gOyAvLyB3ZSBoYXZlIHggYW5kIHkgYXR0cmlidXRlcyBhdmFpbGFibGUgaGVyZSwgYnV0IHdlIHVzZSB0aGUgZW5jbG9zaW5nIDxnPiBpbnN0ZWFkXG5cdFx0XHRcdFx0Ly8gbGFzdEdseXBoSWQgaXMgbm90IHNhdGlzZmFjdG9yeSwgc2luY2Ugd2UgbWF5IGhhdmUgc2V2ZXJhbCBjb25zZWN1dGl2ZSBmb3JtYXQgMTAgdGFibGVzIGRlZmluaW5nIGEgY2xpcCBwYXRoIChpbiBwcmFjdGljZSB0aGlzIHNlZW1zIHVuY29tbW9uKVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y2FzZSA2OiBjYXNlIDc6IHsgLy8gUGFpbnRSYWRpYWxHcmFkaWVudCwgUGFpbnRWYXJSYWRpYWxHcmFkaWVudFxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJQYWludFJhZGlhbEdyYWRpZW50IG5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cocGFpbnQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y2FzZSA4OiBjYXNlIDk6IHsgLy8gUGFpbnRTd2VlcEdyYWRpZW50LCBQYWludFZhclN3ZWVwR3JhZGllbnRcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yKFwiUGFpbnRTd2VlcEdyYWRpZW50IG5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cocGFpbnQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y2FzZSAzMjogeyAvLyBQYWludENvbXBvc2l0ZVxuXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihcIlBhaW50Q29tcG9zaXRlIG5vdCBpbXBsZW1lbnRlZCB5ZXRcIik7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cocGFpbnQpO1xuXG5cdFx0XHRcdFx0Y29uc3Qgc3JjID0gdGhpcy5wYWludFNWRyhwYWludC5jaGlsZHJlblswXSwgY29udGV4dCk7IC8vIHNvdXJjZVxuXHRcdFx0XHRcdGNvbnN0IGRlc3QgPSB0aGlzLnBhaW50U1ZHKHBhaW50LmNoaWxkcmVuWzFdLCBjb250ZXh0KTsgLy8gZGVzdGluYXRpb25cblx0XHRcdFx0XHRjb25zdCBmZU1vZGUgPSBGRUNPTVBPU0lURV9NT0RFU1twYWludC5jb21wb3NpdGVNb2RlXTtcblx0XHRcdFx0XHRjb25zdCBjc3NNb2RlID0gQ1NTX01JWF9CTEVORF9NT0RFU1twYWludC5jb21wb3NpdGVNb2RlXTtcblxuXHRcdFx0XHRcdC8vY29uc3QgbW9kZSA9IEZFQ09NUE9TSVRFX01PREVTW3BhaW50LmNvbXBvc2l0ZU1vZGVdIHx8IENTU19NSVhfQkxFTkRfTU9ERVNbcGFpbnQuY29tcG9zaXRlTW9kZV07XG5cdFx0XHRcdFx0aWYgKGZlTW9kZSkge1xuXHRcdFx0XHRcdFx0c3ZnID0gYDxnIG1peC1ibGVuZC1tb2RlPVwiJHtmZU1vZGV9XCI+YDtcblx0XHRcdFx0XHRcdHN2ZyArPSBzcmM7XG5cdFx0XHRcdFx0XHRzdmcgKz0gZGVzdDtcblx0XHRcdFx0XHRcdHN2ZyArPSBgPC9nPmA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgaWYgKGNzc01vZGUpIHtcblx0XHRcdFx0XHRcdHN2ZyA9IGA8ZyBzdHlsZT1cIm1peC1ibGVuZC1tb2RlOiAke2Nzc01vZGV9O1wiPmA7XG5cdFx0XHRcdFx0XHRzdmcgKz0gc3JjO1xuXHRcdFx0XHRcdFx0c3ZnICs9IGRlc3Q7XG5cdFx0XHRcdFx0XHRzdmcgKz0gYDwvZz5gO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHN3aXRjaCAocGFpbnQuY29tcG9zaXRlTW9kZSkge1xuXHRcdFx0XHRcdFx0XHRjYXNlIDA6IHtcblx0XHRcdFx0XHRcdFx0XHQvLyBkbyBub3RoaW5nXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0Y2FzZSAxOiB7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gcGFpbnQgc3JjXG5cdFx0XHRcdFx0XHRcdFx0c3ZnICs9IHNyYztcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRjYXNlIDI6IHtcblx0XHRcdFx0XHRcdFx0XHQvLyBwYWludCBkZXN0XG5cdFx0XHRcdFx0XHRcdFx0c3ZnICs9IGRlc3Q7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXHRcblx0c3ZnICs9IFwiPC9nPlwiO1xuXHRyZXR1cm4gc3ZnO1xufVxuXG5TYW1zYUdseXBoLnByb3RvdHlwZS5zdmdHbHlwaENPTFJ2MSA9IGZ1bmN0aW9uIChjb250ZXh0PXt9KSB7XG5cdGNvbnN0IHJlc3VsdCA9IHRoaXMuZmluZENPTFIoMSk7IC8vIG1pZ2h0IGJlIHVuZGVmaW5lZFxuXHRpZiAocmVzdWx0KSB7XG5cdFx0Y29uc3QgcGFpbnREYWcgPSB0aGlzLnBhaW50KGNvbnRleHQpO1xuXHRcdGlmIChwYWludERhZykge1xuXHRcdFx0Y29uc3Qgc3ZnUmVzdWx0ID0gdGhpcy5wYWludFNWRyhwYWludERhZywgY29udGV4dCk7IC8vIHdlIGNvdWxkIGJyaW5nIHRoZSBwYWludFNWRyBmdW5jdGlvbiBpbnNpZGUgaGVyZSwgYnV0IHRoZXJlIHNlZW1zIGxpdHRsZSBwb2ludFxuXHRcdFx0cmV0dXJuIHN2Z1Jlc3VsdDsgLy8gdGhpcyBpcyBhIDxnPiBlbGVtZW50IHJlYWR5IHRvIGJlIGluc2VydGVkIGludG8gYW4gPHN2Zz4sIGJ1dCB3ZSBtdXN0IGFsc28gcmVtZW1iZXIgdG8gYWRkIHRoZSBwYXRocyBhbmQgZ3JhZGllbnRzIGZyb20gdGhlIGNvbnRleHRcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7IC8vIHdlIGRpZG7igJl0IGZpbmQgYSBDT0xSdjEgZ2x5cGhcblx0XHR9XG5cdH1cbn1cblxuU2Ftc2FHbHlwaC5wcm90b3R5cGUuc3ZnR2x5cGhDT0xSdjAgPSBmdW5jdGlvbiAoY29udGV4dD17fSkgeyAvLyB3ZSBuZWVkIHRvIHBvc3MgdGhlIGluc3RhbmNlLCByaWdodD9cblx0Y29uc3QgcmVzdWx0ID0gdGhpcy5maW5kQ09MUigwKTsgLy8gbWlnaHQgYmUgdW5kZWZpbmVkXG5cdGlmIChyZXN1bHQpIHtcblx0XHRjb25zdCBbZmlyc3RMYXllckluZGV4LCBudW1MYXllcnNdID0gcmVzdWx0O1xuXHRcdGNvbnN0IGZvbnQgPSB0aGlzLmZvbnQ7XG5cdFx0Y29uc3QgYnVmID0gZm9udC5idWZmZXJGcm9tVGFibGUoXCJDT0xSXCIpO1xuXHRcdGNvbnN0IGNvbHIgPSBmb250LkNPTFI7XG5cdFx0Y29uc3QgY3BhbCA9IGZvbnQuQ1BBTDtcblx0XHQvL2NvbnN0IGRlZmF1bHRDb2xvciA9IGNvbnRleHQuY29sb3IgPz8gMHgwMDAwMDBmZjsgLy8gZGVmYXVsdCBjb2xvciAvLyBhbGxvd3MgMHgwMDAwMDAwMDAgKGEgdmFsaWQgdHJhbnNwYXJlbnQgY29sb3IpXG5cdFx0Y29uc3QgZGVmYXVsdENvbG9yID0gY29udGV4dC5jb2xvciA9PT0gdW5kZWZpbmVkID8gMHgwMDAwMDBmZiA6IGNvbnRleHQuY29sb3I7IC8vIGRlZmF1bHQgY29sb3IgLy8gYWxsb3dzIDB4MDAwMDAwMDAwIChhIHZhbGlkIHRyYW5zcGFyZW50IGNvbG9yKVxuXHRcdGNvbnN0IHBhbGV0dGUgPSBjcGFsLnBhbGV0dGVzW2NvbnRleHQucGFsZXR0ZUlkIHx8IDBdO1xuXHRcdGxldCBwYXRocyA9IFwiXCI7XG5cdFx0Zm9yIChsZXQgaT0wOyBpPG51bUxheWVyczsgaSsrKSB7XG5cdFx0XHRidWYuc2Vlayhjb2xyLmxheWVyUmVjb3Jkc09mZnNldCArIDQgKiAoZmlyc3RMYXllckluZGV4ICsgaSkpO1xuXHRcdFx0Y29uc3QgZ2x5cGhJZCA9IGJ1Zi51MTY7XG5cdFx0XHRjb25zdCBwYWxldHRlSW5kZXggPSBidWYudTE2O1xuXHRcdFx0Y29uc3QgbGF5ZXJHbHlwaCA9IGZvbnQuZ2x5cGhzW2dseXBoSWRdO1xuXHRcdFx0Y29uc3QgaUdseXBoID0gbGF5ZXJHbHlwaC5pbnN0YW50aWF0ZShjb250ZXh0Lmluc3RhbmNlKTtcblx0XHRcdGNvbnN0IGRHbHlwaCA9IGlHbHlwaC5kZWNvbXBvc2UoKTtcblx0XHRcdGlmIChkR2x5cGgubnVtYmVyT2ZDb250b3VycyA+IDApIHtcblx0XHRcdFx0Y29uc3QgbGF5ZXJDb2xvciA9IHBhbGV0dGVJbmRleCA9PSAweGZmZmYgPyBkZWZhdWx0Q29sb3IgOiBwYWxldHRlLmNvbG9yc1twYWxldHRlSW5kZXhdOyAvLyBUT0RPOiBvbWl0IGZpbGwgaWYgcGFsZXR0ZUluZGV4ID09IDB4ZmZmZiwgYW5kIHB1dCBpdCBpbiB0aGUgY29udGFpbmluZyA8Zz4gZWxlbWVudCBpbnN0ZWFkXG5cdFx0XHRcdHBhdGhzICs9IGA8cGF0aCBkPVwiJHtkR2x5cGguc3ZnUGF0aCgpfVwiIGZpbGw9XCIke2ZvbnQuaGV4Q29sb3JGcm9tVTMyKGxheWVyQ29sb3IpfVwiLz5cXG5gOyAvLyBUT0RPOiBwcmVjYWxjdWxhdGUgdGhlIGhleCBzdHJpbmdzIGZvciB0aGUgcGFsZXR0ZXM/IE5PXG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBwYXRocztcblx0fVxuXHRlbHNlIHtcblx0XHRyZXR1cm4gZmFsc2U7IC8vIHdlIGRpZG7igJl0IGZpbmQgYSBDT0xSdjAgZ2x5cGhcblx0fVxufVxuXG5mdW5jdGlvbiBTYW1zYUNvbnRleHQob3B0aW9ucykge1xuXHR0aGlzLnBhdGggPSBbXTtcblx0dGhpcy5iZWdpbnBhdGggPSBvcHRpb25zLmJlZ2lucGF0aDtcblx0dGhpcy5tb3ZldG8gPSBvcHRpb25zLm1vdmV0bztcblx0dGhpcy5saW5ldG8gPSBvcHRpb25zLmxpbmV0bztcblx0dGhpcy5xdWFkdG8gPSBvcHRpb25zLnF1YWR0bztcblx0dGhpcy5jdWJpY3RvID0gb3B0aW9ucy5jdWJpY3RvO1xuXHR0aGlzLmNsb3NlcGF0aCA9IG9wdGlvbnMuY2xvc2VwYXRoO1xuXHR0aGlzLmNvbG9yID0gb3B0aW9ucy5jb2xvcjtcblx0dGhpcy5wYWxldHRlSWQgPSBvcHRpb25zLnBhbGV0dGVJZDtcblx0dGhpcy5ncmFkaWVudElkID0gb3B0aW9ucy5ncmFkaWVudElkO1xuXHR0aGlzLmdyYWRpZW50UG9pbnRzID0gb3B0aW9ucy5ncmFkaWVudFBvaW50cztcblx0dGhpcy5ncmFkaWVudFN0b3BzID0gb3B0aW9ucy5ncmFkaWVudFN0b3BzO1xuXHR0aGlzLmdyYWRpZW50VHlwZSA9IG9wdGlvbnMuZ3JhZGllbnRUeXBlO1xuXHQvL3RoaXMucG9wVHJhbnNmb3JtID0gb3B0aW9ucy5ncmFkaWVudFRyYW5zZm9ybTtcblx0dGhpcy5jdHggPSBvcHRpb25zLmN0eDsgLy8gdGhpcyBpcyB1c2VkIGZvciB0aGUgYWN0dWFsIEhUTUwgY2FudmFzIGNvbnRleHQgKGlnbm9yZWQgaW4gU1ZHKVxufVxuXG5cbi8vIFNhbXNhR2x5cGgucHJvdG90eXBlLnN2Z0dseXBoTW9ub2Nocm9tZSA9IGZ1bmN0aW9uICgpIHtcblxuLy8gXHQvLyBUT0RPOiBkb27igJl0IHJldHVybiBhbnl0aGluZyBmb3IgZW1wdHkgZ2x5cGhzLCBidXQgdGFrZSBhY2NvdW50IG9mIG1ldHJpY3Ncbi8vIFx0cmV0dXJuIGA8cGF0aCBkPVwiJHt0aGlzLnN2Z1BhdGgoKX1cIi8+YDtcblxuLy8gfVxuXG5cblNhbXNhR2x5cGgucHJvdG90eXBlLnN2Z0dseXBoTW9ub2Nocm9tZSA9IGZ1bmN0aW9uICh3cmFwPTEpIHtcblxuXHQvLyBUT0RPOiBkb27igJl0IHJldHVybiBhbnl0aGluZyBmb3IgZW1wdHkgZ2x5cGhzLCBidXQgdGFrZSBhY2NvdW50IG9mIG1ldHJpY3NcblxuXHQvL3JldHVybiBgPHBhdGggZD1cIiR7dGhpcy5zdmdQYXRoKCl9XCIvPmA7XG5cdC8vIHRoaXMgaXMgU1ZHIGJ1dCB3ZSBjYW4gZG8gY2FudmFzIHRvb1xuXG5cdGxldCBjdHggPSBuZXcgU2Ftc2FDb250ZXh0KERSQVdfRlVOQ1RJT05TW0NPTlRFWFRfU1ZHXSk7XG5cdHRoaXMuZXhwb3J0UGF0aChjdHgpOyAvLyBjb21wbGV0ZSB0aGUgY3R4LnBhdGggc3RyaW5nIHdpdGggdGhlIFNWRyByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2x5cGhcblxuXHRpZiAod3JhcClcblx0XHRyZXR1cm4gYDxwYXRoIGQ9XCIke2N0eC5wYXRoLmpvaW4oXCJcIil9XCIvPmA7XG5cdGVsc2Vcblx0XHRyZXR1cm4gY3R4LnBhdGguam9pbihcIlwiKTtcblxuXHQvLyBsZXQgY3R4Q2FudmFzID0gbmV3IFNhbXNhQ29udGV4dChEUkFXX0ZVTkNUSU9OU1tDT05URVhUX0NBTlZBU10pO1xuXHQvLyBjdHhDYW52YXMuY3R4ID0gY3R4O1xuXHQvL2N0eENhbnZhcy5jdHguZmlsbFN0eWxlID0gXCIjZmYwMDAwXCI7XG5cblxuXHQvLyByZXR1cm4gYDxwYXRoIGQ9XCIke3RoaXMuc3ZnUGF0aCgpfVwiLz5gO1xuXG59XG5cblxuU2Ftc2FHbHlwaC5wcm90b3R5cGUuY2FudmFzR2x5cGhNb25vY2hyb21lID0gZnVuY3Rpb24gKGN0eCkge1xuXHRsZXQgY3R4U2Ftc2EgPSBuZXcgU2Ftc2FDb250ZXh0KERSQVdfRlVOQ1RJT05TW0NPTlRFWFRfQ0FOVkFTXSk7XG5cdC8vY3R4Q2FudmFzLmN0eCA9IGN0eDtcblx0dGhpcy5leHBvcnRQYXRoKGN0eFNhbXNhKTsgLy8gbm93IHRoaXMucGF0aCBjb250YWlucyBtdWx0aXBsZSBkcmF3aW5nIGNvbW1hbmRzXG5cblx0Ly9jb25zb2xlLmxvZyhjdHhDYW52YXMucGF0aCk7XG5cblx0Ly8gZmV0Y2ggdGhlIGRyYXdpbmcgY29tbWFuZHNcblx0Y3R4LmJlZ2luUGF0aCgpO1xuXG5cdGN0eFNhbXNhLnBhdGguZm9yRWFjaChjbWQgPT4ge1xuXG5cdFx0Y29uc3Qgb3AgPSBjbWQucG9wKCk7XG5cdFx0c3dpdGNoIChvcCkge1xuXG5cdFx0XHRjYXNlIFwiTVwiOlxuXHRcdFx0XHRjdHgubW92ZVRvKC4uLmNtZCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0XG5cdFx0XHRjYXNlIFwiTFwiOlxuXHRcdFx0XHRjdHgubGluZVRvKC4uLmNtZCk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFwiQ1wiOlxuXHRcdFx0XHRjdHguYmV6aWVyQ3VydmVUbyguLi5jbWQpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdFxuXHRcdFx0Y2FzZSBcIlFcIjpcblx0XHRcdFx0Y3R4LnF1YWRyYXRpY0N1cnZlVG8oLi4uY21kKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgXCJaXCI6XG5cdFx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9KVxuXHRjdHguZmlsbCgpO1xufVxuXG5cblNhbXNhR2x5cGgucHJvdG90eXBlLm1heENPTFIgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB0aGlzLmZpbmRDT0xSKDEpID8gMSA6IHRoaXMuZmluZENPTFIoMCkgPyAwIDogdW5kZWZpbmVkO1xufVxuXG4vLyBkb2VzIHRoaXMgZ2x5cGggaGF2ZSBhIGNvbG9yIGdseXBoIG9mIHRoZSBnaXZlbiBDT0xSIHRhYmxlIHZlcnNpb24/XG4vLyAtIHdlIGNvdWxkIGJ1aWxkIHRoaXMgaW50byB0aGUgc3ZnR2x5cGhDT0xSdjEoKSBhbmQgc3ZnR2x5cGhDT0xSdjAoKSBtZXRob2RzIGJ1dCBkZWZpbmluZyBpdCBzZXBhcmF0ZWx5IG1ha2VzIGl0IHBvc3NpYmxlIHRvIHRlc3QgZm9yIHByZXNlbmNlIGVmZmljaWVudGx5XG5TYW1zYUdseXBoLnByb3RvdHlwZS5maW5kQ09MUiA9IGZ1bmN0aW9uICh2ZXJzaW9uKSB7XG5cdGNvbnN0IGZvbnQgPSB0aGlzLmZvbnQ7XG5cdGNvbnN0IGNvbHIgPSBmb250LkNPTFI7XG5cdGlmIChjb2xyKSB7XG5cdFx0bGV0IGI9MDtcblx0XHRsZXQgZ2x5cGhJZDtcblxuXHRcdGlmICh2ZXJzaW9uID09IDEgJiYgY29sci52ZXJzaW9uID49IDEpIHtcblx0XHRcdHJldHVybiBjb2xyLmJhc2VHbHlwaFBhaW50UmVjb3Jkc1t0aGlzLmlkXTsgLy8gcmV0dXJucyBvZmZzZXQgdG8gdGhlIHBhaW50IHJlY29yZCBvciB1bmRlZmluZWRcblx0XHR9XG5cdFx0ZWxzZSBpZiAodmVyc2lvbiA9PSAwICYmIGNvbHIudmVyc2lvbiA+PSAwKSB7XG5cdFx0XHRyZXR1cm4gY29sci5iYXNlR2x5cGhSZWNvcmRzW3RoaXMuaWRdOyAvLyByZXR1cm5zIFtmaXJzdExheWVySW5kZXgsIG51bUxheWVyc10gb3IgdW5kZWZpbmVkXG5cdFx0fVxuXG5cdFx0Ly8gaWYgKHZlcnNpb24gPT0gMSAmJiBjb2xyLnZlcnNpb24gPj0gMSkge1xuXHRcdC8vIFx0YnVmLnNlZWsoY29sci5iYXNlR2x5cGhMaXN0T2Zmc2V0KTtcblx0XHQvLyBcdGNvbnN0IG51bUJhc2VHbHlwaFBhaW50UmVjb3JkcyA9IGJ1Zi51MzI7XG5cdFx0Ly8gXHR3aGlsZSAoYisrIDwgbnVtQmFzZUdseXBoUGFpbnRSZWNvcmRzICYmIChnbHlwaElkID0gYnVmLnUxNikgPCB0aGlzLmlkKSB7IC8vIGxvb2sgZm9yIGdseXBoIGlkIGluIEJhc2VHbHlwaFBhaW50UmVjb3JkcyAoVE9ETzogYmluYXJ5IHNlYXJjaCkgaG1tLCB3aHkgbm90IHByZXBvcHVsYXRlIHRoaXM/XG5cdFx0Ly8gXHRcdGJ1Zi5zZWVrcig0KTtcblx0XHQvLyBcdH1cblx0XHQvLyBcdGlmIChnbHlwaElkID09IHRoaXMuaWQpXG5cdFx0Ly8gXHRcdHJldHVybiBidWYudGVsbCgpLTI7IC8vIENIRUNLIHRoYXQgLTIgaXMgY29ycmVjdCB0byB1bmRvIHRoZSB1MTYgcmVhZFxuXHRcdC8vIH1cblxuXHRcdC8vIGVsc2UgaWYgKHZlcnNpb24gPT0gMCAmJiBjb2xyLnZlcnNpb24gPj0gMCkge1xuXHRcdC8vIFx0YnVmLnNlZWsoY29sci5iYXNlR2x5cGhSZWNvcmRzT2Zmc2V0KTtcblx0XHQvLyBcdHdoaWxlIChiKysgPCBjb2xyLm51bUJhc2VHbHlwaFJlY29yZHMgJiYgKGdseXBoSWQgPSBidWYudTE2KSA8IHRoaXMuaWQpIHsgLy8gbG9vayBmb3IgZ2x5cGggaWQgaW4gYmFzZUdseXBoUmVjb3JkcyAoVE9ETzogYmluYXJ5IHNlYXJjaClcblx0XHQvLyBcdFx0YnVmLnNlZWtyKDQpO1xuXHRcdC8vIFx0fVxuXHRcdC8vIFx0aWYgKGdseXBoSWQgPT0gdGhpcy5pZClcblx0XHQvLyBcdFx0cmV0dXJuIGJ1Zi50ZWxsKCktMjtcblx0XHQvLyB9XG5cdH1cblx0cmV0dXJuIGZhbHNlO1xufVxuXG4vLyBTYW1zYUdseXBoLnN2ZygpXG4vLyAtIHdlIGRvbuKAmXQgd2FudCB0aGlzIG1ldGhvZCB0byBzdXBwbHkgYSBmaW5hbCBzdmcuLi4gc2luY2Ugd2UgXG4vLyAtIHN0eWxlIHN1cHBsaWVzIHZhcmlvdXMgcGFyYW1ldGVycyB0byBzdHlsZSB0aGUgcmVzdWx0aW5nIFNWR1xuLy8gICAgIFN0eWxpbmcgaXMgYXBwbGllZCB0byB0aGUgPGc+IGVsZW1lbnQgdGhhdCBjb250YWlucyB0aGUgZ2x5cGguXG4vLyAgICAgVHJ5IHsgZmlsbDogXCJyZWRcIiB9IG9yIHsgZmlsbDogXCJyZWRcIiwgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZSgxMzAsNTAwKSBzY2FsZSgwLjUgLTAuNSlcIiB9XG4vLyAgICAgQ3VycmVudGx5IG9ubHkgc3VwcG9ydHMgY2xhc3MsIGZpbGwsIHN0cm9rZSwgc3Ryb2tlV2lkdGgsIHRyYW5zZm9ybS5cbi8vICAgICBOb3RlIHRoYXQgdGhlIHRyYW5zZm9ybSBwcm9wZXJ0eSBpcyBhc3NpZ25lZCB0byB0aGUgdHJhbnNmb3JtIGF0dHJpYnV0ZSwgbm90IHRoZSBzdHlsZSBhdHRyaWJ1dGUuXG4vLyAtIG9wdGlvbnMuY29sciBzZWxlY3RzIHRoZSAqbWF4aW11bSogY29sb3IgZm9ybWF0IHRvIHVzZTogMT1DT0xSdjEsIDA9Q09MUnYwLCAtMT1tb25vY2hyb21lXG4vLyAtIG9wdGlvbnMucGFsZXR0ZUlkIHNlbGVjdHMgYSBwYWxldHRlSWQgaW4gdGhlIGZvbnRcbi8vIC0gb3B0aW9ucy5wYWxldHRlIHN1cHBsaWVzIGEgY3VzdG9tIHBhbGV0dGVcbi8vU2Ftc2FHbHlwaC5wcm90b3R5cGUuc3ZnID0gZnVuY3Rpb24gKHN0eWxlPXt9LCBvcHRpb25zPXt9KSB7XG5TYW1zYUdseXBoLnByb3RvdHlwZS5zdmcgPSBmdW5jdGlvbiAoY29udGV4dD17fSkge1xuXG5cdGNvbnN0IGZvbnQgPSB0aGlzLmZvbnQ7XG5cblx0Ly9jb25zb2xlLmxvZyhgU1ZHLWluZyBnbHlwaCAke3RoaXMuaWR9LCAke3RoaXMubnVtUG9pbnRzfSBwb2ludHMsICR7dGhpcy5udW1iZXJPZkNvbnRvdXJzfSBjb250b3Vyc2ApO1xuXHQvLyBUT0RPOiBhZGQgYSBjb21tZW50IGNvbnRhaW5pbiB0aGUgc3RyaW5nIGFuZCBnbHlwaGlkcyB0aGF0IHRoaXMgc3ZnIHJlcHJlc2VudHMgKG1heWJlIHVzZSBjbGFzcyBvciBpZCBpbiB0aGUgPGc+ID8pXG5cdC8vbGV0IHN2Z1N0cmluZyA9IFNWR19QUkVBTUJMRTtcblx0bGV0IHN2Z1N0cmluZyA9IFwiXCI7XG5cdC8vIGxldCBleHRyYSA9IChzdHlsZS5jbGFzcyA/IGAgY2xhc3M9XCIke3N0eWxlLmNsYXNzfVwiYCA6IFwiXCIpXG5cdC8vICAgICAgICAgICArIChzdHlsZS5maWxsID8gYCBmaWxsPVwiJHtzdHlsZS5maWxsfVwiYCA6IFwiXCIpXG5cdC8vICAgICAgICAgICArIChzdHlsZS5zdHJva2UgPyBgIHN0cm9rZT1cIiR7c3R5bGUuc3Ryb2tlfVwiYCA6IFwiXCIpXG5cdC8vICAgICAgICAgICArIChzdHlsZS5zdHJva2VXaWR0aCA/IGAgc3Ryb2tlLXdpZHRoPVwiJHtzdHlsZS5zdHJva2VXaWR0aH1cImAgOiBcIlwiKTtcblx0bGV0IGV4dHJhID0gKGNvbnRleHQuY2xhc3MgPyBgIGNsYXNzPVwiJHtjb250ZXh0LmNsYXNzfVwiYCA6IFwiXCIpXG5cdCAgICAgICAgICArIChjb250ZXh0LmZpbGwgPyBgIGZpbGw9XCIke2NvbnRleHQuZmlsbH1cImAgOiBcIlwiKVxuXHQgICAgICAgICAgKyAoY29udGV4dC5zdHJva2UgPyBgIHN0cm9rZT1cIiR7Y29udGV4dC5zdHJva2V9XCJgIDogXCJcIilcblx0ICAgICAgICAgICsgKGNvbnRleHQuc3Ryb2tlV2lkdGggPyBgIHN0cm9rZS13aWR0aD1cIiR7Y29udGV4dC5zdHJva2VXaWR0aH1cImAgOiBcIlwiKVxuXHRcdFx0ICArIChjb250ZXh0LnRyYW5zZm9ybSA/IGAgdHJhbnNmb3JtPVwiJHtjb250ZXh0LnRyYW5zZm9ybX1cImAgOiBcIlwiKTtcblx0Ly8gVE9ETzogY2hlY2sgdGhlc2Ugc3R5bGUgdGhpbmdzIGRvbuKAmXQgaW50ZXJmZXJlIHdpdGggdGhlIENPTFJ2MSBzdHlsaW5nIChvciBtYXliZSB0aGF04oCZcyBvaylcblx0Ly8gVE9ETzogY29tcGxldGVseSBpZ25vcmUgdGhpcyBzdHVmZiwgYXMgYmV5b25kIHNjb3BlIG9mIGdldHRpbmcgc3ZnIGZvciBhIGdseXBoOyBpdCBzaG91bGQgYmUgdGhlIDxnPiAoKyBvcHRpb25hbCB0cmFuc2xhdGUpIGFuZCBub3RoaW5nIGVsc2VcblxuXHQvLyBUT0RPOiByZW1vdmUgdGhpcyBTVkcgd3JhcHBlciBzbyB3ZSBjYW4gcmV0dXJuIG11bHRpcGxlIGEgZ2x5cGggcnVuIGluIGEgc2luZ2xlIFNWR1xuXHQvLyAtIG9yIG1heWJlIGhhdmUgYSBsb29rIHRocnUgYW4gYXJyYXkgb2YgZ2x5cGhzIGFuZCBvZmZzZXRzIGNhbGN1bGF0ZWQgZnJvbSBzaW1wbGUgbWV0cmljcyBvciBPcGVuVHlwZSBsYXlvdXRcblx0c3ZnU3RyaW5nICs9IGA8ZyR7ZXh0cmF9PlxcbmA7XG5cdHN2Z1N0cmluZyArPSBgPCEtLSBnbHlwaCAke3RoaXMuaWR9IC0tPlxcbmA7XG5cdFxuXHQvLyBhdHRlbXB0IENPTFJ2MSwgdGhlbiBDT0xSdjAsIHRoZW4gbW9ub2Nocm9tZSBmb3IgdGhpcyBnbHlwaFxuXHRzdmdTdHJpbmcgKz0gZm9udC5DT0xSID8gdGhpcy5zdmdHbHlwaENPTFJ2MShjb250ZXh0KSB8fCB0aGlzLnN2Z0dseXBoQ09MUnYwKGNvbnRleHQpIHx8IHRoaXMuc3ZnR2x5cGhNb25vY2hyb21lKCkgOiB0aGlzLnN2Z0dseXBoTW9ub2Nocm9tZSgpOyAvLyB0aGlzIHRoZSBkZWZhdWx0IGF1dG8gbW9kZSAvLyBUT0RPOiBvZmZlciBtZXRob2QgdG8gc2VsZWN0IGEgc3BlY2lmaWMgZm9ybWF0XG5cdC8vIC0gd2UgY2FuIHByb3ZpZGUgc29tZSByZXN1bHRzIGluZm8gaW4gdGhlIGNvbnRleHRcblx0Ly9zdmdTdHJpbmcgKz0gdGhpcy5zdmdHbHlwaE1vbm9jaHJvbWUoKTsgLy8gdGhpcyB0aGUgZGVmYXVsdCBhdXRvIG1vZGUgLy8gVE9ETzogb2ZmZXIgbWV0aG9kIHRvIHNlbGVjdCBhIHNwZWNpZmljIGZvcm1hdFxuXG5cdHN2Z1N0cmluZyArPSBgXFxuPC9nPmA7XG5cdHJldHVybiBzdmdTdHJpbmc7IC8vIHNoYWxsIHdlIGp1c3QgbGVhdmUgaXQgbGlrZSB0aGlzP1xufVxuXG5cblxuLy8gY3VzdG9tIHByb2Nlc3NvcnNcbi8qXG5mdW5jdGlvbiBtb3ZldG9fc3ZnIHtcblxufVxuXG5mdW5jdGlvbiBtb3ZldG9fY2FudmFzIHtcblxufVxuXG5mdW5jdGlvbiBsaW5ldG9fY2FudmFzIHtcblxufVxuXG5mdW5jdGlvbiBxdWFkdG9fY2FudmFzIHtcblxufVxuXG5mdW5jdGlvbiBjdWJpY3RvX2NhbnZhcyB7XG5cbn1cbiovXG5cblxuY29uc3QgUkVOREVSRVJfU1ZHID0gMTtcbmNvbnN0IFJFTkRFUkVSX0NBTlZBUyA9IDI7XG5cbmNvbnN0IFJfTU9WRVRPID0gMTtcbmNvbnN0IFJfTElORVRPID0gMjtcbmNvbnN0IFJfUVVBRFRPID0gMztcbmNvbnN0IFJfQ1VCSUNUTyA9IDQ7XG5jb25zdCBSX0VORFBBVEggPSA1O1xuY29uc3QgUl9MQVlFUiA9IDY7XG5jb25zdCBSX1BBSU5UID0gNztcbmNvbnN0IFJfTUFYID0gODtcblxuY29uc3QgcmVuZGVyRnVuY3MgPSBbXTtcbnJlbmRlckZ1bmNzW1JFTkRFUkVSX1NWR10gPSBbXTtcbnJlbmRlckZ1bmNzW1JFTkRFUkVSX0NBTlZBU10gPSBbXTtcblxuLy8gcmVuZGVyRnVuY3NbUkVOREVSRVJfU1ZHXVtSX01PVkVUT10gPSAoY3R4LCB4LCB5KSA9PiB7XG5cbi8vIH0pO1xuXG4vLyByZW5kZXJGdW5jcy5nZXQoUkVOREVSRVJfU1ZHKVxuLy8gY29uc3QgcmVuZGVyRnVuY3NbUkVOREVSRVJfU1ZHXSA9IG5ldyBNYXAoKVxuXG4vLyB7XG4vLyBcdFJfTU9WRVRPOiAoY3R4LCB4LCB5KSA9PiB7XG5cbi8vIFx0fVxuXG4vLyB9O1xuXG5cbi8vIFdPVyB0aGlzIGlzIHdvcmtpbmcgMjAyMy0wNi0yMiAwMjoyNVxuY29uc3QgQ09OVEVYVF9TVkcgPSAxO1xuY29uc3QgQ09OVEVYVF9DQU5WQVMgPSAyO1xuY29uc3QgRFJBV19GVU5DVElPTlMgPSBbXTtcbkRSQVdfRlVOQ1RJT05TW0NPTlRFWFRfU1ZHXSA9IHtcblx0YmVnaW5wYXRoOiBmdW5jdGlvbiAoKSB7XG5cdFx0OyAvLyBub3RoaW5nIHRvIGRvXG5cdH0sXG5cdG1vdmV0bzogZnVuY3Rpb24gKHgsIHkpIHtcblx0XHR0aGlzLnBhdGgucHVzaChgTSR7eH0gJHt5fWApO1xuXHR9LFxuXHRsaW5ldG86IGZ1bmN0aW9uICh4LCB5KSB7XG5cdFx0dGhpcy5wYXRoLnB1c2goYEwke3h9ICR7eX1gKTtcblx0fSxcblx0cXVhZHRvOiBmdW5jdGlvbiAoeDEsIHkxLCB4LCB5KSB7XG5cdFx0dGhpcy5wYXRoLnB1c2goYFEke3gxfSAke3kxfSAke3h9ICR7eX1gKTtcblx0fSxcblx0Y3ViaWN0bzogZnVuY3Rpb24gKHgxLCB5MSwgeDIsIHkyLCB4LCB5KSB7XG5cdFx0dGhpcy5wYXRoLnB1c2goYEMke3gxfSAke3kxfSAke3gyfSAke3kyfSAke3h9ICR7eX1gKTtcblx0fSxcblx0Y2xvc2VwYXRoOiBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy5wYXRoLnB1c2goYFpgKTtcblx0fSxcbn07XG4vLyBEUkFXX0ZVTkNUSU9OU1tDT05URVhUX0NBTlZBU10gPSB7XG4vLyBcdGJlZ2lucGF0aDogZnVuY3Rpb24gKCkge1xuLy8gXHRcdHRoaXMucGF0aC5wdXNoKFtcIkJcIl0pO1xuLy8gXHR9LFxuLy8gXHRtb3ZldG86IGZ1bmN0aW9uICh4LCB5KSB7XG4vLyBcdFx0dGhpcy5wYXRoLnB1c2goW1wiTVwiLCB4LCB5XSk7XG4vLyBcdH0sXG4vLyBcdGxpbmV0bzogZnVuY3Rpb24gKHgsIHkpIHtcbi8vIFx0XHR0aGlzLnBhdGgucHVzaChbXCJMXCIsIHgsIHldKTtcbi8vIFx0fSxcbi8vIFx0cXVhZHRvOiBmdW5jdGlvbiAoeDEsIHkxLCB4LCB5KSB7XG4vLyBcdFx0dGhpcy5wYXRoLnB1c2goW1wiUVwiLCB4MSwgeTEsIHgsIHldKTtcbi8vIFx0XHQ7XG4vLyBcdH0sXG4vLyBcdGN1YmljdG86IGZ1bmN0aW9uICh4MSwgeTEsIHgyLCB5MiwgeCwgeSkge1xuLy8gXHRcdHRoaXMucGF0aC5wdXNoKFtcIkNcIiwgeDEsIHkxLCB4MiwgeTIsIHgsIHldKTtcbi8vIFx0fSxcbi8vIFx0Y2xvc2VwYXRoOiBmdW5jdGlvbiAoKSB7XG4vLyBcdFx0dGhpcy5wYXRoLnB1c2goW1wiRlwiXSk7XG4vLyBcdH0sXHRcdFxuLy8gfTtcblxuRFJBV19GVU5DVElPTlNbQ09OVEVYVF9DQU5WQVNdID0ge1xuXHRiZWdpbnBhdGg6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLnBhdGgucHVzaChbXCJCXCJdKTtcblx0fSxcblx0bW92ZXRvOiBmdW5jdGlvbiAoeCwgeSkge1xuXHRcdHRoaXMucGF0aC5wdXNoKFt4LCB5LCBcIk1cIl0pO1xuXHR9LFxuXHRsaW5ldG86IGZ1bmN0aW9uICh4LCB5KSB7XG5cdFx0dGhpcy5wYXRoLnB1c2goW3gsIHksIFwiTFwiXSk7XG5cdH0sXG5cdHF1YWR0bzogZnVuY3Rpb24gKHgxLCB5MSwgeCwgeSkge1xuXHRcdHRoaXMucGF0aC5wdXNoKFt4MSwgeTEsIHgsIHksIFwiUVwiXSk7XG5cdFx0O1xuXHR9LFxuXHRjdWJpY3RvOiBmdW5jdGlvbiAoeDEsIHkxLCB4MiwgeTIsIHgsIHkpIHtcblx0XHR0aGlzLnBhdGgucHVzaChbeDEsIHkxLCB4MiwgeTIsIHgsIHksIFwiQ1wiXSk7XG5cdH0sXG5cdGNsb3NlcGF0aDogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMucGF0aC5wdXNoKFtcIkZcIl0pO1xuXHR9LFx0XHRcbn07XG5cblxuLypcbmNvbnN0IG1vdmVUbyA9IFtdO1xuXG4vLyBTVkcgcmVuZGVyaW5nIGZ1bmN0aW9uc1xubW92ZVRvW1JFTkRFUkVSX1NWR10gPSAoY3R4LCB4LCB5KSA9PiB7XG5cdHJldHVybiBgTSR7eH0gJHt5fWA7XG59XG5saW5lVG9bUkVOREVSRVJfU1ZHXSA9IChjdHgsIHgsIHkpID0+IHtcblx0cmV0dXJuIGBMJHt4fSAke3l9YDtcbn1cbnF1YWRUb1tSRU5ERVJFUl9TVkddID0gKGN0eCwgeDEsIHkxLCB4LCB5KSA9PiB7XG5cdHJldHVybiBgUSR7eDF9ICR7eTF9ICR7eH0gJHt5fWA7XG59XG5jdWJpY1RvW1JFTkRFUkVSX1NWR10gPSAoY3R4LCB4MSwgeTEsIHgyLCB5MiwgeCwgeSkgPT4ge1xuXHRyZXR1cm4gYEMke3gxfSAke3kxfSAke3gyfSAke3kyfSAke3h9ICR7eX1gO1xufVxuZW5kUGF0aFtSRU5ERVJFUl9TVkddID0gKGN0eCkgPT4ge1xuXHRyZXR1cm4gYFpgO1xufVxucGFpbnRbUkVOREVSRVJfU1ZHXSA9IChjdHgsIHBhaW50KSA9PiB7XG5cdHJldHVybiBgQ09MUnYxIGEgd2hvbGUgc3RhY2sgb2Ygc3R1ZmZgO1xufVxubGF5ZXJbUkVOREVSRVJfU1ZHXSA9IChjdHgsIGdseXBoLCBjb2xvcikgPT4ge1xuXHRyZXR1cm4gYENPTFJ2MCBsYXllcmA7XG59XG5wYWxldHRlW1JFTkRFUkVSX1NWR10gPSAoY3R4LCBwYWxldHRlKSA9PiB7XG5cdHJldHVybiBgQ1BBTCBwYWxldHRlYDtcbn1cblxuLy8gY2FudmFzIHJlbmRlcmluZyBmdW5jdGlvbnNcbm1vdmVUb1tSRU5ERVJFUl9DQU5WQVNdID0gKGN0eCwgeCwgeSkgPT4ge1xuXHRyZXR1cm4gYG0geCB5YDtcbn1cbmxpbmVUb1tSRU5ERVJFUl9DQU5WQVNdID0gKGN0eCwgeCwgeSkgPT4ge1xuXHRyZXR1cm4gYGwgeCB5YDtcbn1cbiovXG5cbi8qXG5mdW5jdGlvbiBTYW1zYUNvbnRleHQgKG5hbWUpIHtcblx0dGhpcy5uYW1lID0gbmFtZTtcblx0c3dpdGNoICh0aGlzLm5hbWUpIHtcblxuXHRcdGNhc2UgXCJzdmdcIjpcblx0XHRcdHRoaXMudHlwZSA9IFJFTkRFUkVSX1NWRztcblx0XHRcdGJyZWFrO1xuXHRcblx0XHRjYXNlIFwiY2FudmFzXCI6XG5cdFx0XHR0aGlzLnR5cGUgPSBSRU5ERVJFUl9DQU5WQVM7XG5cdFx0XHRicmVhaztcblx0XG5cdFx0ZGVmYXVsdDpcblx0XHRcdGJyZWFrO1xuXHR9XG5cbn1cbiovXG5cbi8qXG5jb25zdCBSRU5ERVJFUlMgPSB7XG5cdHN2Zzoge1xuXHRcdG1vdmV0bzogbW92ZXRvX2NhbnZhcyxcblx0XHRsaW5ldG86IG1vdmV0b19jYW52YXMsXG5cdFx0cXVhZHRvOiBxdWFkdG9fY2FudmFzLFxuXHRcdGN1YmljdG86IGN1YmljdG9fY2FudmFzLFxuXHRcdGVuZHBhdGg6IGVuZHBhdGhfY2FudmFzLFxuXHR9XG59XG4qL1xuXG5cbi8vIC0gd29ya3MgaW4gYnJvd3NlciBhbmQgbm9kZVxuZXhwb3J0IHsgU2Ftc2FGb250LCBTYW1zYUluc3RhbmNlLCBTYW1zYUdseXBoLCBTYW1zYUNvbnRleHQsIFNhbXNhQnVmZmVyLCBTQU1TQUdMT0JBTH07XG5cblxuLypcblxuXG5RVUVTVElPTlNcblxuVGhlIGNoaWxkIHBvc3NpYmlsaXRpZXMgZm9yIGEgUGFpbnRHbHlwaCBzZWVtIHByb2JsZW1hdGljLCBzZWUgRmlsbGluZyBTaGFwZXMgaHR0cHM6Ly9sZWFybi5taWNyb3NvZnQuY29tL2VuLXVzL3R5cG9ncmFwaHkvb3BlbnR5cGUvc3BlYy9jb2xyI2ZpbGxpbmctc2hhcGVzXG5cblNvIHRoZSBzaW1wbGUgaWRlYSBpcyB0aGF0IGFueSBvZiB0aGUgZmlsbCBvcGVyYXRpb25zIGNhbiBiZSB1c2VkLCBzb2xpZCBhbmQgZ3JhZGllbnQuXG5cbkZpbmFsbHkgdGhlcmXigJlzIHRoZSBzdGF0ZW1lbnQ6XG5cIlRoZSBjaGlsZCBvZiBhIFBhaW50R2x5cGggdGFibGUgaXMgbm90LCBob3dldmVyLCBsaW1pdGVkIHRvIG9uZSBvZiB0aGUgYmFzaWMgZmlsbCBmb3JtYXRzLiBSYXRoZXIsIHRoZSBjaGlsZCBjYW4gYmUgdGhlIFxucm9vdCBvZiBhIHN1Yi1ncmFwaCB0aGF0IGRlc2NyaWJlcyBzb21lIGdyYXBoaWMgY29tcG9zaXRpb24gdGhhdCBpcyB1c2VkIGFzIGEgZmlsbC4gQW5vdGhlciB3YXkgdG8gZGVzY3JpYmUgdGhlIHJlbGF0aW9uc2hpcCBcbmJldHdlZW4gYSBQYWludEdseXBoIHRhYmxlIGFuZCBpdHMgY2hpbGQgc3ViLWdyYXBoIGlzIHRoYXQgdGhlIGdseXBoIG91dGxpbmUgc3BlY2lmaWVkIGJ5IHRoZSBQYWludEdseXBoIHRhYmxlIGRlZmluZXMgYSBcbmJvdW5kcywgb3IgY2xpcCByZWdpb24sIHRoYXQgaXMgYXBwbGllZCB0byB0aGUgZmlsbCBjb21wb3NpdGlvbiBkZWZpbmVkIGJ5IHRoZSBjaGlsZCBzdWItZ3JhcGguXCJcblxuU28gdGhlIG1haW4gaWRlYSB0aGlzIHNlZW1zIHRvIHN1cHBvcnQgaXMgdG8gZ2VuZXJhdGUgYSBjbGlwIHJlZ2lvbiwgYmVpbmcgdGhlIGludGVyc2VjdGlvbiBvZiBhbGwgdGhlIHNoYXBlcyBvZiBhIHNlcXVlbmNlIG9mIFBhaW50R2x5cGhzLlxuXG5PayBzbyBmYXIsIGFuZCBkb2FibGUgdXNpbmcgPGRlZnM+IGFuZCA8Y2xpcFBhdGg+IGluIFNWRy5cblxuQnV0IHRoZW4gdGhlcmXigJlzIHRoaXM6XG5cIk5vdGU6IFNoYXBlcyBjYW4gYWxzbyBiZSBkZXJpdmVkIHVzaW5nIFBhaW50R2x5cGggdGFibGVzIGluIGNvbWJpbmF0aW9uIHdpdGggb3RoZXIgdGFibGVzLCBzdWNoIGFzIFBhaW50VHJhbnNmb3JtIFxuKHNlZSBUcmFuc2Zvcm1hdGlvbnMpIG9yIFBhaW50Q29tcG9zaXRlIChzZWUgQ29tcG9zaXRpbmcgYW5kIGJsZW5kaW5nKS5cIlxuXG5UaGUgcHJvYmxlbSBpcyB0aGUgd29yZGluZyBcImluIGNvbWJpbmF0aW9uIHdpdGhcIi4gSXTigJlzIHBvc3NpYmxlIHRoYXQgdGhpcyBtZWFucyB0aG9zZSBQYWludCB0YWJsZXMgbWF5IGhhdmUgYmVlbiB1c2VkIG9ubHkgYXMgKnBhcmVudHMqIG9mIHRoaXMgXG5QYWludEdseXBoIHRhYmxlLiBJZiBzbywgdGhhdCBrZWVwcyB0aGluZ3MgdW5kZXIgY29udHJvbCwgYnV0IGl0IGlzIG5vdCBjbGVhci4gVGhlIHBocmFzZSBjb3VsZCBpbmNsdWRlIHRoZSBwb3NzaWJpbGl0eSBvZiBQYWludFRyYW5zZm9ybSBhbmQgXG5QYWludENvbXBvc2l0ZSBhcyBjaGlsZHJlbiBvZiBQYWludEdseXBoLiBQYWludFRyYW5zZm9ybSBpcyBub3QgYSBiaWcgcHJvYmxlbTogd2XigJlkIG5lZWQgdG8gdHJhbnNmb3JtIHRoZSBzaGFwZSBhbmQgcHJlc3VtYWJseSBhbHNvIGFueSBncmFkaWVudCBcbmZpbGwuIEhvd2V2ZXIsIGlmIHdlIGFsbG93IFBhaW50Q29tcG9zaXRlIGNoaWxkcmVuLCBpdCBpbnRlcmZlcmVzIHdpdGggUGFpbnRDb21wb3NpdGXigJlzIGFiaWxpdHkgdG8gY29tcG9zZSBvbnRvIHRoZSBjYW52YXMsIHNpbmNlIGl0IHdvdWxkIGJlIHVzZWQgXG5hcyBhIGNsaXAgcmVnaW9uIGluc3RlYWQuXG5cbkZvciBub3csIGxldOKAmXMgYXNzdW1lIGEgc2VxdWVuY2Ugb2YgUGFpbnRHbHlwaHMgZm9sbG93ZWQgYnkgYSBmaWxsIG9ubHkuIE5vIFBhaW50VHJhbnNmb3Jtcywgbm8gUGFpbnRDb21wb3NpdGVzIGFmdGVyIGEgUGFpbnRHbHlwaC5cblxuIyBTcGVjIHN1Z2dlc3Rpb25zXG5cbiMjIGNtYXBcbiogQ2xhcmlmeSB0aGF0IG11bHRpcGxlIGNoYXJhY3RlciBtYXBwaW5ncyBhcmUgbm90IGludGVuZGVkIHRvIGJlIGFjdGl2ZSBhdCB0aGUgc2FtZSB0aW1lLiBGb3IgZXhhbXBsZSwgaXQgaXMgbm90IHBlcm1pc3NsYmxlIHRvIHNldCB1cCBhIFxuZm9udCB0byB1c2Ugc29tZSBtYXBwaW5ncyB2aWEgRm9ybWF0IDQsIHRoZW4gZmFsbGJhY2sgdG8gRm9ybWF0IDEzIGZvciBcImxhc3QgcmVzb3J0XCIgZ2x5cGhzLiBTaW1pbGFybHksIEZvcm1hdCAxMiB0YWJsZXMgIG11c3QgYmUgY29tcGxldGUsXG5hbmQgbXVzdCBub3QgcmVseSBvbiBGb3JtYXQgNCBhcyBmYWxsYmFjay5cblxuIyMgdm10eFxuKiBTaG93IHRoZSB2TWV0cmljcyBmaWVsZCBleHBsaWNpdGx5LlxuXG4jIyBDT0xSdjFcbiogTGlzdCB0aGUgcG9zc2liaWxpdGllcyBmb3IgYSBQYWludCBwYXRoIGFzIGEgbGFuZ3VhZ2UtbGlrZSB0cmVlLCBvciBtYXliZSBhIGtpbmQgb2YgcmVnZXguXG5cbiMjIGd2YXJcbiogTWFrZSBjbGVhciB0aGUgc2hhcmVkVHVwbGUgYXJyYXkgaXMgYWxsIGFib3V0IHBlYWsgdHVwbGVzLCB3aXRoIGluZmVycmVkIHN0YXJ0IGFuZCBlbmQgYmVpbmcgLTEsIDAgYW5kIDEgYXMgYXBwcm9wdGlhdGUuXG4qIEFsc28gbm90ZSB0aGF0IHRoZSBzY2FsYXJzIGRlcml2ZWQgZnJvbSB0aGUgc2hhcmVkVHVwbGVzIG1heSBiZSBjYWxjdWxhdGVkIGp1c3Qgb25jZSBwZXIgaW5zdGFuY2UuXG4qIFRoZXNlIHR3byBzdGF0ZW1lbnRzIGNvbmZsaWN0IFwiTm90ZSB0aGF0IGludGVybWVkaWF0ZVJlZ2lvbiBmbGFnIGlzIGluZGVwZW5kZW50IG9mIHRoZSBlbWJlZGRlZFBlYWtUdXBsZSBmbGFnLi4uXCIgXCJBbiBpbnRlcm1lZGlhdGUtcmVnaW9uXG4gdHVwbGUgdmFyaWF0aW9uIHRhYmxlIGFkZGl0aW9uYWxseSBoYXMgc3RhcnQgYW5kIGVuZCBuLXR1cGxlcyAuLi4gdGhlc2UgYXJlIGFsd2F5cyByZXByZXNlbnRlZCB1c2luZyBlbWJlZGRlZCB0dXBsZSByZWNvcmRzLlwiIFRoZSB0cnV0aCBpcyBpZiAgXG4gSU5URVJNRURJQVRFX1JFR0lPTiBpcyBzZXQsIHRoZW4gRU1CRURERURfUEVBS19UVVBMRSBtdXN0IGFsc28gYmUgc2V0LiBXZSBoYXZlIGEgcHJvYmxlbSBpbiB0aGF0IGlmIHdlIGhhdmUgYW4gZW1iZWRkZWQgcGVhayB0dXBsZSB0aGF0IGlzIE5PVFxuIGFuIGludGVybWVkaWF0ZSByZWdpb24sIHRoZSBzZXR0aW5nIG9mIHN0YXJ0IGFuZCBlbmQgaXMgbm90IGRlZmluZWQuIFdlIGFzc3VtZSBpdOKAmXMgXG5cblxuXG4qLyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG4vL2ltcG9ydCB7IGNyZWF0ZVJlY3RhbmdsZXMgfSBmcm9tIFwiLi9yZWN0YW5nbGUtbW9kdWxlXCI7XG4vL2ltcG9ydCB7IFNhbXNhRm9udCwgU2Ftc2FHbHlwaCwgU2Ftc2FJbnN0YW5jZSwgU2Ftc2FCdWZmZXIsIFNBTVNBR0xPQkFMIH0gZnJvbSBcIi4vc2Ftc2EtY29yZVwiO1xuLy9pbXBvcnQgeyBTYW1zYUZvbnQsIFNhbXNhR2x5cGgsIFNhbXNhSW5zdGFuY2UsIFNhbXNhQnVmZmVyLCBTQU1TQUdMT0JBTCB9IGZyb20gXCJzYW1zYS1jb3JlXCI7XG4vLyBjb25zdCBzYW1zYSA9IHJlcXVpcmUgKFwic2Ftc2EtY29yZVwiKTtcbi8vIGNvbnN0IFNhbXNhQnVmZmVyID0gc2Ftc2EuU2Ftc2FCdWZmZXI7XG4vLyBjb25zdCBTYW1zYUZvbnQgPSBzYW1zYS5TYW1zYUZvbnQ7XG4vLyBjb25zdCBTYW1zYUdseXBoID0gc2Ftc2EuU2Ftc2FHbHlwaDtcbi8vIGNvbnN0IFNhbXNhSW5zdGFuY2UgPSBzYW1zYS5TYW1zYUluc3RhbmNlO1xuLy8gY29uc3QgU0FNU0FHTE9CQUwgPSBzYW1zYS5TQU1TQUdMT0JBTFxuY29uc3QgeyBTYW1zYUZvbnQsIFNhbXNhR2x5cGgsIFNhbXNhSW5zdGFuY2UsIFNhbXNhQnVmZmVyLCBTQU1TQUdMT0JBTCB9ID0gcmVxdWlyZShcInNhbXNhLWNvcmVcIik7XG4vLyBDb2RlIGluIHRoaXMgZmlsZSBoYXMgYWNjZXNzIHRvIHRoZSAqZmlnbWEgZG9jdW1lbnQqIHZpYSB0aGUgZmlnbWEgZ2xvYmFsIG9iamVjdC5cbi8vIEJyb3dzZXIgQVBJcyBpbiB0aGUgPHNjcmlwdD4gdGFnIGluc2lkZSBcInVpLmh0bWxcIiB3aGljaCBoYXMgYVxuLy8gZnVsbCBicm93c2VyIGVudmlyb25tZW50IChTZWUgaHR0cHM6Ly93d3cuZmlnbWEuY29tL3BsdWdpbi1kb2NzL2hvdy1wbHVnaW5zLXJ1bikuXG4vLyBodHRwczovL3d3dy5maWdtYS5jb20vcGx1Z2luLWRvY3MvcGx1Z2luLXF1aWNrc3RhcnQtZ3VpZGUvXG4vLyBFYWNoIHRpbWUgeW91IHN0YXJ0IFZTIENvZGUsIGRvOlxuLy8gMS4gSGl0IEN0cmwtU2hpZnQtQiBpbiBXaW5kb3dzLCBvciBDb21tYW5kLVNoaWZ0LUIgZm9yIE1hYy5cbi8vIDIuIFNlbGVjdCB3YXRjaC10c2NvbmZpZy5qc29uXG4vLyBXZWJwYWNrIGFuZCBidW5kbGluZ1xuLy8gaHR0cHM6Ly93d3cuZmlnbWEuY29tL3BsdWdpbi1kb2NzL2xpYnJhcmllcy1hbmQtYnVuZGxpbmcvXG4vL2xldCBmID0gbmV3IFNhbXNhRm9udCgpO1xuLy8gY29uc3QgR0xPQkFMID0ge1xuLy8gICBzYW1zYUZvbnQ6IG51bGwsXG4vLyB9O1xuY29uc3QgR0xPQkFMID0ge1xuICAgIGZpZ21hTm9kZTogbnVsbCxcbn07XG4vLyBUaGlzIHNob3dzIHRoZSBIVE1MIHBhZ2UgaW4gXCJ1aS5odG1sXCIuXG5jb25zdCBvcHRpb25zID0ge1xuICAgIHdpZHRoOiAzMDAsXG4gICAgaGVpZ2h0OiA1MDAsXG4gICAgdGl0bGU6IFwiQ09MUnYxIGZvbnRzXCIsXG59O1xuZmlnbWEuc2hvd1VJKF9faHRtbF9fLCBvcHRpb25zKTtcbmNvbnN0IHNjZW5lTm9kZXMgPSBbXTsgLy8gdGhlc2UgYXJlIHVzZWQgaW4gdGhlIFwiem9vbSB0byBmaXRcIiBzdGVwIC8vIFRPRE86IGlmIHRoZSBVSSBpcyBwZXJzaXN0ZW50LCB3ZSBuZWVkIHRvIHJlY29uc2lkZXIgaG93IHdlIHpvb20gdG8gZml0IGVhY2ggdGltZVxubGV0IGZvbnQgPSB7fTsgLy8gc2tpcCB0eXBlIGNoZWNraW5nXG4vLyBDYWxscyB0byBcInBhcmVudC5wb3N0TWVzc2FnZVwiIGZyb20gd2l0aGluIHRoZSBIVE1MIHBhZ2Ugd2lsbCB0cmlnZ2VyIHRoaXNcbi8vIGNhbGxiYWNrLiBUaGUgY2FsbGJhY2sgd2lsbCBiZSBwYXNzZWQgdGhlIFwicGx1Z2luTWVzc2FnZVwiIHByb3BlcnR5IG9mIHRoZVxuLy8gcG9zdGVkIG1lc3NhZ2UuXG5maWdtYS51aS5vbm1lc3NhZ2UgPSBtc2cgPT4ge1xuICAgIC8vIE9uZSB3YXkgb2YgZGlzdGluZ3Vpc2hpbmcgYmV0d2VlbiBkaWZmZXJlbnQgdHlwZXMgb2YgbWVzc2FnZXMgc2VudCBmcm9tXG4gICAgLy8geW91ciBIVE1MIHBhZ2UgaXMgdG8gdXNlIGFuIG9iamVjdCB3aXRoIGEgXCJ0eXBlXCIgcHJvcGVydHkgbGlrZSB0aGlzLlxuICAgIHZhciBfYTtcbiAgICBzd2l0Y2ggKG1zZy50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2NyZWF0ZS1yZWN0YW5nbGVzJzoge1xuICAgICAgICAgICAgY29uc3Qgbm9kZXMgPSBbXTtcbiAgICAgICAgICAgIC8vIGZvciAobGV0IGkgPSAwOyBpIDwgbXNnLmNvdW50OyBpKyspIHtcbiAgICAgICAgICAgIC8vICAgY29uc3QgcmVjdCA9IGZpZ21hLmNyZWF0ZVJlY3RhbmdsZSgpO1xuICAgICAgICAgICAgLy8gICByZWN0LnggPSBpICogMTUwO1xuICAgICAgICAgICAgLy8gICByZWN0LmZpbGxzID0gW3t0eXBlOiAnU09MSUQnLCBjb2xvcjoge3I6IDEsIGc6IDAuNSwgYjogMH19XTtcbiAgICAgICAgICAgIC8vICAgZmlnbWEuY3VycmVudFBhZ2UuYXBwZW5kQ2hpbGQocmVjdCk7XG4gICAgICAgICAgICAvLyAgIG5vZGVzLnB1c2gocmVjdCk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBub2RlcztcbiAgICAgICAgICAgIC8vZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KG5vZGVzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgXCJmZXRjaC1mb250XCI6IHtcbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBtc2cgIT09IG51bGwgJiYgbXNnICE9PSB2b2lkIDAgPyBtc2cgOiAwO1xuICAgICAgICAgICAgY29uc29sZS5sb2codGVtcCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImZldGNoLWZvbnRcIik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImhlcmUgd2UgYXJlXCIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgICAgIGZldGNoKG1zZy51cmwpXG4gICAgICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTG9hZGVkIHJlc3BvbnNlOiBcIiwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5hcnJheUJ1ZmZlcigpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihhcnJheUJ1ZmZlciA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJMb2FkZWQgYnl0ZXM6IFwiLCBhcnJheUJ1ZmZlci5ieXRlTGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBmb250RmFjZTogbXNnLnVybCxcbiAgICAgICAgICAgICAgICAgICAgYWxsR2x5cGhzOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBhbGxUVlRzOiB0cnVlLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgZm9udCA9IG5ldyBTYW1zYUZvbnQobmV3IFNhbXNhQnVmZmVyKGFycmF5QnVmZmVyKSwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGb250IGxvYWRlZFwiKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhmb250KTtcbiAgICAgICAgICAgICAgICBpZiAoZm9udC5mdmFyKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvbnQuZnZhci5heGVzLmZvckVhY2goKGF4aXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF4aXMubmFtZSA9IGZvbnQubmFtZXNbYXhpcy5heGlzTmFtZUlEXTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChmb250LkNQQUwpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9udC5DUEFMLmhleENvbG9ycyA9IHt9OyAvLyBtdXN0IHVzZSBhbiBvYmplY3QgaGVyZS4uLiAoc3BhcnNlIGFycmF5cyBpbiBKU09OIGFyZSBIVUdFISlcbiAgICAgICAgICAgICAgICAgICAgZm9udC5DUEFMLnBhbGV0dGVzLmZvckVhY2goKHBhbGV0dGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhbGV0dGUuY29sb3JzLmZvckVhY2goKGNvbG9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udC5DUEFMLmhleENvbG9yc1tjb2xvcl0gPSBmb250LmhleENvbG9yRnJvbVUzMihjb2xvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHNpZ25hbCB0byB0aGUgVUkgdGhhdCB3ZeKAmXZlIGdvdCB0aGUgZm9udCwgYnkgc2VuZGluZyBpdHMgbmFtZXMsIGZ2YXIsIENQQUxcbiAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6IFwibmFtZXNcIiwgbmFtZXM6IGZvbnQubmFtZXMgfSk7IC8vIGF2b2lkIHNwYXJzZW5lc3NcbiAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6IFwiZnZhclwiLCBmdmFyOiBmb250LmZ2YXIgfSk7XG4gICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiBcIkNQQUxcIiwgQ1BBTDogZm9udC5DUEFMIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlIFwicmVuZGVyXCI6IHtcbiAgICAgICAgICAgIC8vIGdldCBzdmcgZnJvbSB0ZXh0LCBmb250LCBzaXplLCBheGlzU2V0dGluZ3MsIHBhbGV0dGVcbiAgICAgICAgICAgIGNvbnN0IHR1cGxlID0gZm9udC50dXBsZUZyb21GdnMobXNnLm9wdGlvbnMuZnZzKTtcbiAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IFNhbXNhSW5zdGFuY2UoZm9udCwgdHVwbGUpO1xuICAgICAgICAgICAgaWYgKCFtc2cub3B0aW9ucy50ZXh0KVxuICAgICAgICAgICAgICAgIG1zZy5vcHRpb25zLnRleHQgPSBcImhlbGxvXCI7XG4gICAgICAgICAgICBjb25zdCBsYXlvdXQgPSBpbnN0YW5jZS5nbHlwaExheW91dEZyb21TdHJpbmcobXNnLm9wdGlvbnMudGV4dCk7XG4gICAgICAgICAgICBjb25zdCBmb250U2l6ZSA9IG1zZy5vcHRpb25zLmZvbnRTaXplO1xuICAgICAgICAgICAgY29uc3QgdXBlbSA9IGZvbnQuaGVhZC51bml0c1BlckVtO1xuICAgICAgICAgICAgY29uc3QgY29sb3JVMzIgPSAweDAwMDAwMGZmO1xuICAgICAgICAgICAgY29uc3QgY29udGV4dCA9IHtcbiAgICAgICAgICAgICAgICBmb250OiBmb250LFxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZSxcbiAgICAgICAgICAgICAgICBwYXRoczoge30sXG4gICAgICAgICAgICAgICAgZ3JhZGllbnRzOiB7fSxcbiAgICAgICAgICAgICAgICBjb2xvcjogY29sb3JVMzIsXG4gICAgICAgICAgICAgICAgcGFsZXR0ZUlkOiAoX2EgPSBtc2cub3B0aW9ucy5wYWxldHRlSWQpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IDAsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gc2V0IHRoZSB0ZXh0IGFzIFNWR1xuICAgICAgICAgICAgbGV0IGlubmVyU1ZHQ29tcG9zaXRpb24gPSBcIlwiO1xuICAgICAgICAgICAgbGF5b3V0LmZvckVhY2goKGxheW91dEl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBnbHlwaCA9IGZvbnQuZ2x5cGhzW2xheW91dEl0ZW0uaWRdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlnbHlwaCA9IGdseXBoLmluc3RhbnRpYXRlKGluc3RhbmNlKTtcbiAgICAgICAgICAgICAgICBsZXQgdGhpc1NWRyA9IGlnbHlwaC5zdmcoY29udGV4dCk7IC8vIGdldHMgdGhlIGJlc3QgcG9zc2libGUgQ09MUiBnbHlwaCwgd2l0aCBtb25vY2hyb21lIGZhbGxiYWNrXG4gICAgICAgICAgICAgICAgdGhpc1NWRyA9IGA8ZyB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoJHtsYXlvdXRJdGVtLmF4fSAwKVwiIGZpbGw9XCIke2ZvbnQuaGV4Q29sb3JGcm9tVTMyKGNvbG9yVTMyKX1cIj5gICsgdGhpc1NWRyArIFwiPC9nPlwiO1xuICAgICAgICAgICAgICAgIGlubmVyU1ZHQ29tcG9zaXRpb24gKz0gdGhpc1NWRztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgZGVmcyA9IE9iamVjdC52YWx1ZXMoY29udGV4dC5wYXRocykuam9pbihcIlwiKSArIE9iamVjdC52YWx1ZXMoY29udGV4dC5ncmFkaWVudHMpLmpvaW4oXCJcIik7XG4gICAgICAgICAgICBjb25zdCBzdmdQcmVhbWJsZSA9IGA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB3aWR0aD1cIjIwMDBcIiBoZWlnaHQ9XCIyMDAwXCIgdmlld0JveD1cIjAgMCAyMDAwIDIwMDBcIj5gO1xuICAgICAgICAgICAgY29uc3Qgc3ZnUG9zdGFtYmxlID0gYDwvc3ZnPmA7XG4gICAgICAgICAgICBjb25zdCBzY2FsZSA9IGZvbnRTaXplIC8gdXBlbTtcbiAgICAgICAgICAgIGNvbnN0IGdQcmVhbWJsZSA9IGA8ZyB0cmFuc2Zvcm09XCJzY2FsZSgke3NjYWxlfSAkey1zY2FsZX0pIHRyYW5zbGF0ZSgwICR7LXVwZW19KVwiPmA7XG4gICAgICAgICAgICBjb25zdCBnUG9zdGFtYmxlID0gYDwvZz5gO1xuICAgICAgICAgICAgLy8gdGhpcyBpcyB3aGVyZSBpdCBjb21lcyB0b2dldGhlclxuICAgICAgICAgICAgY29uc3Qgc3ZnU3RyaW5nID0gc3ZnUHJlYW1ibGUgKyAoZGVmcyA/IGA8ZGVmcz4ke2RlZnN9PC9kZWZzPmAgOiBcIlwiKSArIGdQcmVhbWJsZSArIGlubmVyU1ZHQ29tcG9zaXRpb24gKyBnUG9zdGFtYmxlICsgc3ZnUG9zdGFtYmxlOyAvLyBidWlsZCBhbmQgaW5zZXJ0IGZpbmFsIFNWR1xuICAgICAgICAgICAgaWYgKEdMT0JBTC5maWdtYU5vZGUpXG4gICAgICAgICAgICAgICAgR0xPQkFMLmZpZ21hTm9kZS5yZW1vdmUoKTtcbiAgICAgICAgICAgIGxldCBub2RlID0gZmlnbWEuY3JlYXRlTm9kZUZyb21Tdmcoc3ZnU3RyaW5nKTsgLy8gY29udmVydCBTVkcgdG8gbm9kZSBhbmQgYWRkIGl0IHRvIHRoZSBwYWdlXG4gICAgICAgICAgICBHTE9CQUwuZmlnbWFOb2RlID0gbm9kZTtcbiAgICAgICAgICAgIC8vbm9kZS5zZXRQbHVnaW5EYXRhKFwic2Ftc2EtcmVuZGVyXCIsIG1zZyk7IC8vIHRoaXMgc2VlbXMgb25seSB0byB0YWtlIHN0cmluZyBkYXRhXG4gICAgICAgICAgICBzY2VuZU5vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAvL2ZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IHNjZW5lTm9kZXM7XG4gICAgICAgICAgICAvL2ZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhzY2VuZU5vZGVzKTtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAvLyBhZGQgdGhlIG5vZGUgdG8gdGhlIGNhbnZhc1xuICAgICAgICAgICAgbGV0IG5vZGUgPSBmaWdtYS5jcmVhdGVOb2RlRnJvbVN2ZyhzdmdTdHJpbmcpOyAvLyBjb252ZXJ0IFNWRyB0byBub2RlIGFuZCBhZGQgaXQgdG8gdGhlIHBhZ2VcblxuICAgICAgICAgICAgLy8gTEFURVIsIHdlIGNhbiB0cnkgdGhpc1xuICAgICAgICAgICAgLy8gc2V0IG1ldGFkYXRhIG9uIHRoZSBub2RlXG4gICAgICAgICAgICAvLyBhbHNvIHNldCB0aGUgcGx1Z2luIHRoYXQgbWFkZSBpdFxuICAgICAgICAgICAgLy8gYWxzbyBzZXQgdGhlIGRhdGVcbiAgICAgICAgICAgIG5vZGUuc2V0UGx1Z2luRGF0YShcImZvbnRcIiwgZm9udC5uYW1lc1s2XSk7IC8vIFBvc3RTY3JpcHQgbmFtZVxuICAgICAgICAgICAgbm9kZS5zZXRQbHVnaW5EYXRhKFwiZm9udFNpemVcIiwgbXNnLmZvbnRTaXplLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgbm9kZS5zZXRQbHVnaW5EYXRhKFwidGV4dFwiLCBtc2cudGV4dCk7XG4gICAgICAgICAgICBub2RlLnNldFBsdWdpbkRhdGEoXCJmb250VmFyaWF0aW9uU2V0dGluZ3NcIiwgXCJcIik7XG5cbiAgICAgICAgICAgIC8vIHpvb20gdG8gZml0XG4gICAgICAgICAgICBzY2VuZU5vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBzY2VuZU5vZGVzO1xuICAgICAgICAgICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KHNjZW5lTm9kZXMpO1xuXG4gICAgICAgICAgICAvLyBURVNUOiBhZGQgYSBuZXcgZWxlbWVudCB0byB0aGUgVUkgYnkgc2VuZGluZyBhIG1lc3NhZ2VcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHt0eXBlOiBcIkFkZEF4aXNcIiwgdGFnOiBcIndnaHRcIn0pO1xuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgXCJwYWxldHRlLWVkaXRcIjoge1xuICAgICAgICAgICAgaWYgKGZvbnQuQ1BBTCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhbGV0dGVJZCA9IHBhcnNlSW50KG1zZy5wYWxldHRlSWQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGVudHJ5SWQgPSBwYXJzZUludChtc2cuZW50cnlJZCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFsZXR0ZSA9IGZvbnQuQ1BBTC5wYWxldHRlc1twYWxldHRlSWRdO1xuICAgICAgICAgICAgICAgIGlmIChwYWxldHRlICYmIHBhbGV0dGUuY29sb3JzW2VudHJ5SWRdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFsZXR0ZS5jb2xvcnNbZW50cnlJZF0gPSBmb250LnUzMkZyb21IZXhDb2xvcihtc2cuY29sb3IpO1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGB1cGRhdGVkIHBhbGV0dGUgJHtwYWxldHRlSWR9IGVudHJ5ICR7ZW50cnlJZH0gdG8gJHttc2cuY29sb3J9IGFzICR7Y29sb3J9YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBcImNhbmNlbFwiOiB7XG4gICAgICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9