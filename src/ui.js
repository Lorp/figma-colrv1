function Q (selector, root=document) {
	return root.querySelector(selector);
}

function QA (selector, root=document) {
	return root.querySelectorAll(selector);
}

function EL (tag, attrs, props, style) {
	let el = document.createElement(tag);
	if (attrs)
		el.attr(attrs);
	if (props)
		for (const prop in props)
			el[prop] = props[prop];
	if (style)
		for (const prop in style)
			el.style[prop] = style[prop];
	return el;
}

Element.prototype.attr = function(attrs) {
	for (const key in attrs) {
		this.setAttributeNS(null, key, attrs[key]);
	}
}

const GLOBAL = {
	emojiSVGs: {}, // store all the svgs: should be emptied on font change
	emojiVariants: {}, // string keys indexing an array of variant strings (key is only present if there are variant strings, so no empty arrays)
	emojiVariantsDelay: 650, // ms
	emojiPerPageCount: 63, // 9 columns, 7 rows is the initial load for each emoji group
	emojiGroupLookup: { // these property names are strings that GSUB to icons from Material Symbols
		schedule: -1,
		mood: 0,
		emoji_people: 1,
		emoji_nature: 2,
		emoji_food_beverage: 3,
		emoji_transportation: 4,
		emoji_events: 5,
		emoji_objects: 6,
		glyphs: 7,
		emoji_flags: 8,
	},
	uiReady: true,
	fontList: [],
	fontSizes: [6,7,8,9,10,11,12,14,16,18,20,24,28,36,48,60,72],
	axisDefaultOverrides: { wdth: 100, wght: 400, ital: 0, opsz: 12 },
	timers: {},
};

// run this when the UI is ready
function initUI() {
	populateAxes();
	populatePalettes();
	changeMode();
	changeFontFamily();
}


function fontByName(name) {
	return GLOBAL.fontList.find(font => name && font.name === name);
}

function changeFontSize(e) {

	const selectEl = e.target.closest(".select");
	const inputEl = Q(".current", selectEl);
	const dropdownEl = Q(".dropdown", selectEl);
	if (e.target.classList.contains("dropdown-item")) {
		inputEl.value = e.target.textContent;
	}
	inputEl.value = Math.abs(parseFloat(inputEl.value)) + "px"; // sanitize input in case it is typed by user
	dropdownEl.style.display = "none";
	updateRendering();
}

function changePaletteColor(e) {
	const message = {
		type: "palette-edit",
		paletteId: e.target.dataset.paletteId,
		entryId: e.target.dataset.entryId,
		color: e.target.value,
	}
	parent.postMessage({ pluginMessage: message }, "*");
	updateRendering();
}

function changeMode(e) {

	//alert ("mode clicked")
	const el = e ? e.target.closest(".mode") : document.querySelector(".mode");
	GLOBAL.mode = el.classList.contains("emoji") ? "emoji" : "text";
	console.log("We set mode to ", GLOBAL.mode);
	console.log(el);

	// set underline color (transparent or blue) that denotes the selected mode
	el.parentNode.querySelectorAll(".mode").forEach(el_ => el_.style.borderColor = (el === el_) ? "var(--blue-active)" : "transparent" );

	// show/hide the relevant controls
	if (el.classList.contains("emoji")) {
		Q(".controls.emoji").style.display = "block";
		Q(".controls.text").style.display = "none";
		Q(".text-input input").placeholder = "Emoji will insert as you select";
		Q(".text-input input").style.fontFamily = "Noto Color Emoji,Google Sans Text";
	}
	else if (el.classList.contains("text")) {
		Q(".controls.text").style.display = "block";
		Q(".controls.emoji").style.display = "none";
		Q(".text-input input").placeholder = "Text will update as you type";
		Q(".text-input input").style.fontFamily = "var(--ui-font-family)";
	}

	Q(".text-input input").value = "";

	// we should set the default family for the mode here
	changeFontFamily();
}

function changeFontFamily(e) {

	let family = "";

	// if the user has picked a font, we get its name
	if (e) {
		family = e.target.textContent;
	}
	// else we need a default font for this mode, so filter fonts by mode (emoji or text) then pick the top priority font
	else {
		const filteredFonts = GLOBAL.fontList.filter(font => font.attributes.includes(GLOBAL.mode));
		filteredFonts.sort((a, b) => {
			const aPri = a.priority || 0;
			const bPri = b.priority || 0;
			if (aPri < bPri) return 1;
			if (aPri > bPri) return -1;
			if (a.name < b.name) return -1;
			if (a.name > b.name) return 1;
			return 0;
		});
		const font = filteredFonts[0];
		family = filteredFonts[0].name;
	}
		
	parent.postMessage({ pluginMessage: { type: 'fetch-font-by-name', name: family } }, "*");

	Q(`.controls.${GLOBAL.mode} .font .family.select .current`).value = family; // set the current font family
	
	if (e)
		e.target.closest(".dropdown").style.display = "none"; // hide the dropdown menu
}

function changeInstance(e) {

	const selectedInstance = GLOBAL.fvar.instances.find(instance => instance.name === e.target.textContent);
	const axisEls = QA(".axes .axis", e.target.closest(".controls"));
	if (axisEls.length === selectedInstance.coordinates.length) {
		const selectEl = e.target.closest(".select");
		selectedInstance.coordinates.forEach((coord, a) => axisEls[a].querySelector(".numeric").value = axisEls[a].querySelector(".slider").value = coord );
		Q(".current", selectEl).value = e.target.textContent; // update name
		Q(".dropdown", selectEl).style.display = "none"; // hide dropdown
		updateRendering();
	}
}

// for the elements of class "select", this
// - populates the "dropdown" child element
// - adds a click handler for the "current" child element
// - does NOT populate the "current" child element with any content
function populateSelects() {

	function hideAllDropdowns() {
		QA(".dropdown").forEach(dropdownEl => dropdownEl.style.display = "none");
	}

	const familySelectEmojiEl = Q(".controls.emoji .font .family.select");
	const familySelectTextEl = Q(".controls.text .font .family.select");

	// add an event handler for each select element
	QA(".select").forEach(selectEl => {
		const currentEl = Q(".current", selectEl);
		if (currentEl) {
			currentEl.onclick = e => {
				const dropDownEl = Q(".dropdown", selectEl); // selectEl’s context is preserved
				if (dropDownEl) {
					dropDownEl.style.display = "block"; // display the dropdown
					//dropDownEl.onmouseleave = () => dropDownEl.style.display = "none"; // hide the dropdown
					dropDownEl.onmouseleave = () => hideAllDropdowns(); // hide the dropdown
				}				
			};
		}

		if (selectEl.classList.contains("size")) {
			Q(".current", selectEl).onchange = changeFontSize; // don’t use blur event, as that interferes with the click event of the dropdown
			GLOBAL.fontSizes.forEach(size => {
				const sizeChoiceEl = EL("div", {class: "dropdown-item"}, {textContent: size + "px", onclick: changeFontSize});
				const dropDownEl = Q(".dropdown", selectEl);
				if (dropDownEl)
					dropDownEl.append(sizeChoiceEl);
			});
		}

		selectEl.onmouseleave = () => hideAllDropdowns();
	});

	// populate the dropdown with initial font families
	GLOBAL.fontList.forEach((font, f) => {
		const familyEl = EL("div", {class: "dropdown-item"}, {textContent: font.name, onclick: changeFontFamily});
		const familySelectEl = font.attributes.includes("text") ? familySelectTextEl : familySelectEmojiEl; // decide which parent (emoji or text) to append this family to
		Q(".dropdown", familySelectEl).append(familyEl);
	});

	changeMode();
}

function populateAxes() {

	console.log("populateAxes()")
	const axisControlsEl = Q(".axes .axis-controls");
	if (!GLOBAL.fvar || !GLOBAL.fvar.axes || GLOBAL.fvar.axes.length === 0) {
		axisControlsEl.innerHTML = "No variation axes found.";
	}
	else {
		axisControlsEl.innerHTML = "";
		GLOBAL.fvar.axes.forEach(axis => {
			const value = axisDefaultOverride(axis);
			const axisEl = EL("div", {class: "axis"});
			axisEl.style.width = "100%";
			const leftEl = EL("div");
			const rightEl = EL("div");

			const tagEl = EL("div", {
				title: axis.name,
				class: "tag",
			}, {
				textContent: axis.axisTag,
			});
			const numericEl = EL("input", {
				type: "text",
				class: "numeric",
				value: value,
			}, {
				oninput: axisInput,
				readonly: true,
			}, {
				fontFamily: "var(--ui-font-family)",
				textAlign: "left",
			});
			const sliderEl = EL("input", {
				type: "range",
				class: "slider",
				min: axis.minValue,
				max: axis.maxValue,
				step: 0.01,
				value: value,
			}, {
				oninput: axisInput,
			});

			leftEl.append(tagEl, numericEl);
			rightEl.append(sliderEl);
			axisEl.append(leftEl, rightEl);
			axisControlsEl.append(axisEl);
		});
	}
}

function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

function axisDefaultOverride(axis) {
	if (GLOBAL.axisDefaultOverrides[axis.axisTag] !== undefined) {
		return clamp(GLOBAL.axisDefaultOverrides[axis.axisTag], axis.minValue, axis.maxValue);
	}
	else {
		return axis.defaultValue;
	}
}

function populateInstances() {
	// populate instances from fvar table
	console.log("populateInstances()", GLOBAL.fvar?.instances.length);
	console.log(GLOBAL.fvar?.instances)
	const instancesSelect = Q(`.controls.${GLOBAL.mode} .style.select`);
	const currentEl = Q(".current", instancesSelect);
	const dropdownEl = Q(".dropdown", instancesSelect);
	currentEl.value = "Default";
	if (!GLOBAL.fvar?.instances.length || GLOBAL.mode === "emoji") {
		currentEl.onclick = null; // disable the instances select for emoji and fonts with 0 instances
	}
	dropdownEl.innerHTML = "";
	if (GLOBAL.fvar?.instances) {
		GLOBAL.fvar.instances.forEach((instance, i) => {
			dropdownEl.append(EL("div", {class: "dropdown-item"}, {textContent: instance.name, onclick: changeInstance}));
		});
	}
}

function populatePalettes() {

	const palettesEl = Q(".palettes .palette-controls");
	if (!GLOBAL.CPAL || !GLOBAL.CPAL.palettes || GLOBAL.CPAL.palettes.length === 0) {
		palettesEl.innerHTML = "No CPAL palettes found.";
	}
	else {
		palettesEl.innerHTML = "";
		GLOBAL.CPAL.palettes.forEach((palette, p) => {

			// list: each palette div needs n children for the grid to work
			const paletteEl = EL("div", {class: "palette"});
			paletteEl.append(EL("input", {type: "radio", name: "palette-id", value: p}, {checked: p==0, onchange: updateRendering})); // create & append a radio button for the palette

			// create the color inputs
			palette.colors.forEach((color, c) => {
				const frameEl = EL("div", {class: "frame"});
				const sampleEl = EL("input", {type: "color", value: GLOBAL.CPAL.hexColors[color], title: `Palette ${p}, entry ${c}: ${GLOBAL.CPAL.hexColors[color]}`}, {oninput: changePaletteColor});
				sampleEl.dataset.paletteId = p;
				sampleEl.dataset.entryId = c;
				if (c < 18) { // TODO: hack to show max 18 colors in a palette
					frameEl.append(sampleEl);
					paletteEl.append(frameEl);
				}
			});
			palettesEl.append(paletteEl);
		});
	}
}


function axisInput(e) {
	const input = e.target;
	const numericEl = e.target.closest(".axis").querySelector(".numeric");
	numericEl.value = e.target.value;

	// document.querySelector("#instances-select").value = "-2";

	// TODO: set all other axes that have this tag to this new value
	updateRendering();
}

function getCurrentAxisValues() {
	const fvs = {};
	const axisEls = QA(`.axis-controls .axis`);
	if (GLOBAL?.fvar?.axes.length && axisEls.length === GLOBAL.fvar.axes.length) {
		GLOBAL.fvar.axes.forEach((axis, a) => fvs[axis.axisTag] = parseFloat(Q(".numeric", axisEls[a]).value) );
	}
	return fvs;
}

function updateRendering(figmaNodeId) {

	console.log(`.controls.${GLOBAL.mode} .size .current`);
	console.log(Q(`.controls.${GLOBAL.mode} .size .current`));

	const options = {
		fvs: getCurrentAxisValues(),
		text: Q(".text-input input").value,
		fontSize: parseFloat(Q(`.controls.${GLOBAL.mode} .size .current`).value), // font size input
	}
	if (GLOBAL.CPAL) {
		const paletteEl = Q(`input[name="palette-id"]:checked`);
		if (paletteEl) {
			options.paletteId = paletteEl.value;
		}
	}
	parent.postMessage({ pluginMessage: { type: 'render', options: options } }, '*');

	// update CSS for user to copy
	let css = "@font-face {\n\tfont-family: \"" + GLOBAL.fontFamily + "\";\n\tsrc: url(\"" + GLOBAL.fontURL + "\");\n}\n\n";
	css += ".myClass {\n\tfont-family: \"" + GLOBAL.fontFamily + "\";\n\n}\n"

	Q(".panel.css .content").textContent = css;
}

// EVENT: change mode text/emoji
QA(".mode").forEach(el => {
	el.onclick = changeMode;
});

// EVENT: type text into the text box
Q(".text-input input").oninput = updateRendering;

// add event so we change group when we click on a group icon
QA(".emoji-group-icon").forEach(el => {
	el.onclick = emojiChangeGroup;
});


QA(".show-panel").forEach(el => {
	console.log("setting up panel");
	if (el.classList.contains("info"))
		el.dataset.panelName = "info";
	else if (el.classList.contains("css"))
		el.dataset.panelName = "css";

	if (el.dataset.panelName) {
		const panelEl = Q(`.panel.${el.dataset.panelName}`);
		el.onclick = e => {
			console.log("clicked panel");
			panelEl.style.top = "0";
			panelEl.style.display = "block";
		};

		const closeEl = Q(".close", panelEl);
		closeEl.onclick = e => {
			panelEl.style.top = "100%";
			panelEl.style.display = "none";
		};
	}
});

// drag-drop a font file [NEW]
// - assume all drag-drop fonts are text fonts, not emoji
Q("body").ondragover = e => {
	e.preventDefault();
	Q(".dropzone").style.display = "block";
};

Q("body").ondragend = e => {
	console.log("dragend")
	e.preventDefault();
	Q(".dropzone").style.display = "none";
};

Q(".dropzone").ondrop = e => {
	console.log("drop")
	e.preventDefault();
	Q(".dropzone").style.display = "none";

	const file = e.dataTransfer.files[0];
	file.arrayBuffer().then(arrayBuffer => {
		
		// send this data to the plugin as base64
		const uint8Arr = new Uint8Array(arrayBuffer);
		let string = "";
		for (let i=0; i<arrayBuffer.byteLength; i++) {
			string += String.fromCharCode(uint8Arr[i]);
		}

		const message = {
			type: "font-upload",
			// fontData: btoa(String.fromCharCode(...new Uint8Array(arrayBuffer))), // this works for short blobs but gives error "Maximum call stack size exceeded" for longer ones, hence the for loop above
			fontData: btoa(string), // base64 encoding of the ArrayBuffer
		}
		parent.postMessage({ pluginMessage: message }, "*");

		// TODO add the new font to the menu

	});

};

// dispatch a ping message so we can check latency
setInterval(() => {
	const id = Math.round(Math.random() * 10000000);
	GLOBAL.timers[id] = {start: Date.now(), label: "ping"};
	parent.postMessage({ pluginMessage: { type: "ping", id: id } }, "*");
}, 10000);


// receive messages from the plugin code
// https://www.figma.com/plugin-docs/creating-ui
onmessage = (e) => {
	console.log("UI received message");

	const msg = e.data.pluginMessage;
	//console.log(msg);

	switch (msg.type) {

		case "pong": {
			console.log(`Timer [${GLOBAL.timers[msg.id].label}]`, Date.now() - GLOBAL.timers[msg.id].start, "ms");
			GLOBAL.timers[msg.id] = undefined;
			break;
		}

		case "init": {
			console.log("Got init message");
			console.log(msg);
			break;
		}

		case "error": {
			if (msg.message) {
				alert (msg.message);
			}
			break;
		}

		case "names": {
			console.log("names switch");
			alert ("names")
			break;
		}

		case "font-list": {
			GLOBAL.fontList.push(...msg.fontList);
			populateSelects();

			// update content for info panel dynamically
			["text", "emoji"].forEach(mode => {
				let fontListHTML = "";
				GLOBAL.fontList.filter(font => font.attributes.includes(mode)).forEach(font => {
					let entry = font.name;
					if (font.website) {
						entry = `<a href="${font.website}" target="_blank">${font.name}</a>`;
					}
					["COLRv0", "COLRv1"].forEach(format => {
						if (font.attributes.includes(format)) {
							entry += ` (${format})`;
						}
					});
					fontListHTML += `<li>${entry}</li>`;
				});
				Q(`.panel.info .content .font-list.${mode}`).innerHTML = fontListHTML;
			});
			break;
		}

		case "render-complete": {
			GLOBAL.uiReady = true;
			break;
		}

		case "emoji-ordering": {
			GLOBAL.emojiMetadata = msg.emojiMetadata;

			// set up emoji ordering
			GLOBAL.emojiVariants = {};
			GLOBAL.emojiMetadata.forEach(emojiGroup => {
				emojiGroup.emoji.forEach(emojiChar => {
					if (emojiChar.alternates.length > 0) {
						const str = String.fromCodePoint(...emojiChar.base);
						GLOBAL.emojiVariants[str] = [];
						emojiChar.alternates.forEach(variant => {
							GLOBAL.emojiVariants[str].push(String.fromCodePoint(...variant));
						});
					}
				});
			});
			break;
		}

		case "font-fetched": {
			console.log("Font fetched");

			GLOBAL.fvar = undefined;
			GLOBAL.CPAL = undefined;

			// we can prepare the UI now

			// emoji handling: we need to import the emoji glyphs to show in the picker
			// - the response will be handled in onmessage for "emoji-svgs"
			if (GLOBAL.mode === "emoji") {
				Q(".emoji-group-icon.default").dispatchEvent(new Event("click")); // trigger a fetch of the default emoji group
			}

			break;
		}

		case "font-data-delivered": {
			updateRendering(); // update the text being edited to this font

			populateAxes();
			populatePalettes();
			populateInstances();

			GLOBAL.fontFamily = msg.fontFamily; // the backend requests "Noto Color Emoji"
			GLOBAL.fontMetadata = GLOBAL.fontList.find(font => font.name === GLOBAL.fontFamily);

			if (GLOBAL.fontMetadata) {
				if (GLOBAL.fontMetadata.attributes.includes("emoji")) {
					GLOBAL.mode = "emoji";
				}
				else if (GLOBAL.fontMetadata.attributes.includes("text")) {
					GLOBAL.mode = "text";
				}
				else {
					GLOBAL.mode = "";
				}
				
				if (GLOBAL.mode !== "") {
					//document.querySelector(`.mode.${GLOBAL.mode}`).dispatchEvent(new Event("click")); // trigger a fetch of the text emoji mode
				}
			}

			break;
		}

		case "fvar": {
			GLOBAL.fvar = msg.fvar;
			break;
		}

		case "CPAL": {
			GLOBAL.CPAL = msg.CPAL;
			break;
		}

		case "emoji-svgs": {

			// now place all the default svgs in the panel
			const emojiGrid = Q(".emoji-main .emoji-grid");
			const startTime = Date.now();
			if (msg.emojiType >= 0 && msg.emojiType < GLOBAL.emojiMetadata.length) {
				const emojiGroup = GLOBAL.emojiMetadata[msg.emojiType]; // 0-based index into the defined groups
				Object.assign(GLOBAL.emojiSVGs, msg.svgs); // merge new svgs with existing svgs (we could check this array in advance, since the svgs may be cached already)
				if (msg.startIndex === 0) {
					// we’ve got the first "page" of this group’s emojis, so immediately fetch the rest!
					const message = { type: "fetch-emojis", emojiType: msg.emojiType, startIndex: GLOBAL.emojiPerPageCount, includeAlternates: false };
					parent.postMessage({ pluginMessage: message }, "*");
					emojiGrid.innerHTML = ""; // clear the grid if we’re starting from the beginning
				}
				emojiGroup.emoji.forEach(emojiChar => {
					const str = String.fromCodePoint(...emojiChar.base); // get the string we need
					if (msg.svgs[str]) // conditional as we retrieve them in batches
						emojiInsertIntoContainer(emojiGrid, str, msg.svgs[str]);
				});
			}
			else if (msg.emojiStrings) {
				Object.assign(GLOBAL.emojiSVGs, msg.svgs); // merge new svgs with existing svgs
			}
			else {
				console.log("Error: emojiType out of range");
			}
			const endTime = Date.now();
			console.log("Time to render emojis:", endTime - startTime, "ms");
			break;
		}
	}
}


function emojiInsertIntoContainer(container, str, svg, variant=false) {

	const el = document.createElement("div");
	el.classList.add("emoji-cell");
	el.innerHTML = svg;
	el.dataset.string = str;

	container.append(el);

	// handle long-click if it’s a default emoji or mouseup if it’s a variant emoji
	if (variant) {
		el.onmouseup = emojiPick;
	}
	else {
		el.onmousedown = emojiVariantTimer;
		el.onclick = emojiPick;
	}
}

function emojiPick(e) {
	const el = e.target.closest(".emoji-cell"); // which cell did we click on?
	const inputEl = Q(".text-input input")
	inputEl.value += el.dataset.string; // append the selected emoji (as a string) to the input text
	inputEl.dispatchEvent(new Event("input")); // trigger a redraw by sending the "input" event to the <input id="#text"> element
}

function emojiVariantTimer(e) {
  
  const el = e.target.closest(".emoji-cell");
  const str = el.dataset.string;

  // are there in fact any alternates for this string?
  if (GLOBAL.emojiVariants[str]) {

		// fetch the variants (should really fetch them immediately after the mousedown )
		parent.postMessage({ pluginMessage: { type: "fetch-emojis", emojiStrings: [str], getAlternates: true, getBases: false } }, "*");

		// start timer and define what happens when it times out
		GLOBAL.emojiVariantsTimer = setTimeout(function () {

			const emojiGrid = el.closest(".emoji-grid"); // we need this for its scroll offset
			const elVariants = Q(".emoji-variants-grid");
			elVariants.style.display = "grid";
			elVariants.innerHTML = ""; // clear previous alternates
			const itemsPerRow = Math.min(5, GLOBAL.emojiVariants[str].length);
			elVariants.style.display = "grid";
			elVariants.style.gridTemplateColumns = `repeat(${itemsPerRow}, 1fr)`;
			elVariants.style.gridAutoRows = "34px";
			elVariants.style.left = `${el.offsetLeft}px`;
			elVariants.style.top = `${el.offsetTop - 34 - emojiGrid.scrollTop}px`;
			elVariants.style.width = (itemsPerRow * 27) + `px`;
			GLOBAL.emojiVariants[str].forEach(variantStr => emojiInsertIntoContainer(elVariants, variantStr, GLOBAL.emojiSVGs[variantStr], true) );
			GLOBAL.emojiVariantsTimer = null;

		}, GLOBAL.emojiVariantsDelay);

		document.onmouseup = clearLongpressTimer; // cancel timer if the mouseup happens at document level
	}
}

function clearLongpressTimer(e) {
	clearTimeout(GLOBAL.alternatesTimer);
	GLOBAL.emojiVariantsTimer = null;
	document.removeEventListener("onmouseup", clearLongpressTimer);

	// hide the alternates picker
	const elVariants = Q(".emoji-variants-grid");
	elVariants.style.display = "none";
}

// change emoji group
function emojiChangeGroup(e) {
	const el = e.target;
	const emojiGroupId = GLOBAL.emojiGroupLookup[el.textContent]; // an integer index into the emojiMetadata array

	// reset scroll position
	const emojiGrid = Q(".emoji-grid");
	emojiGrid.scrollTop = "0px";

	// fetch emojis for the requested group
	// - the response will be a message of type "emoji-svgs", with string keys and svg values
	const message = { type: "fetch-emojis", emojiType: emojiGroupId, startIndex: 0, count: GLOBAL.emojiPerPageCount, includeAlternates: false };
	parent.postMessage({ pluginMessage: message }, "*");

	// set the group title
	Q("h2.emoji-group").innerText = GLOBAL.emojiMetadata[emojiGroupId].group;

	// update icon color/style
	QA(".emoji-group-icon").forEach(el_ => {
		if (el_ === el) {
			el_.style.textDecoration = "underline";
			el_.classList.add("selected");
		}
		else {
			el_.style.textDecoration = "none";
			el_.classList.remove("selected");
		}
	});
}
