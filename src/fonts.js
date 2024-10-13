"use strict";

// data-url: pseudo-protocol triggers Parcel to inline the file as a (large) base64-encoded string
import dataUrlEmojiColr from "data-url:./fonts/NotoColorEmoji-COLRv1.woff2"; // Noto Color Emoji 15.1
import dataUrlEmojiMono from "data-url:./fonts/NotoEmoji-VariableFont_wght.woff2";

const fonts = [
	{
		name: "Blaka Ink",
		attributes: ["text", "color", "COLRv1"],
		website: "https://fonts.google.com/specimen/Blaka+Ink",
		url: "https://raw.githubusercontent.com/google/fonts/main/ofl/blakaink/BlakaInk-Regular.ttf",
	},
	{
		name: "Bungee Tint",
		attributes: ["text", "color", "COLRv0"],
		website: "https://djr.com/bungee",
		url: "https://raw.githubusercontent.com/google/fonts/main/ofl/bungeetint/BungeeTint-Regular.ttf",
	},
	{
		name: "Bungee Spice",
		attributes: ["text", "color", "COLRv1"],
		website: "https://fonts.google.com/specimen/Bungee+Spice",
		url: "https://raw.githubusercontent.com/google/fonts/main/ofl/bungeespice/BungeeSpice-Regular.ttf",
	},
	{
		name: "Foldit",
		attributes: ["text", "color", "COLRv1"],
		website: "https://fonts.google.com/specimen/Foldit",
		url: "https://raw.githubusercontent.com/google/fonts/main/ofl/foldit/Foldit%5Bwght%5D.ttf",
	},
	{
		name: "Gimme Constructo",
		attributes: ["text", "color", "COLRv0"],
		website: "https://www.futurefonts.xyz/typearture/gimme",
		url: "https://www.axis-praxis.org/samsa/fonts/figma/GimmeConstructoVariablev03VF.woff2",
	},
	{
		name: "Kalnia Glaze",
		attributes: ["text", "color", "COLRv1"],
		website: "https://fonts.google.com/specimen/Kalnia+Glaze",
		url: "https://raw.githubusercontent.com/google/fonts/main/ofl/kalniaglaze/KalniaGlaze%5Bwdth%2Cwght%5D.ttf",
		priority: 1, // makes this the default text font
	},
	{
		name: "Nabla",
		attributes: ["text", "color", "COLRv1"],
		website: "https://fonts.google.com/specimen/Nabla",
		url: "https://raw.githubusercontent.com/google/fonts/main/ofl/nabla/Nabla%5BEDPT%2CEHLT%5D.ttf",
	},
	{
		name: "Rocher",
		attributes: ["text", "color", "COLRv0"],
		website: "https://www.harbortype.com/fonts/rocher-color/",
		url: "https://www.axis-praxis.org/samsa/fonts/figma/RocherColorGX.woff2",
	},
	{
		name: "Snoese Color",
		attributes: ["text", "color", "COLRv0"],
		website: "https://www.typearture.com/magical-unicorn/the-very-eventful-adventure-of-snoeze/",
		url: "https://www.axis-praxis.org/samsa/fonts/figma/SnoeseColorVariable.woff2",
	},
	{
		name: "Noto Color Emoji",
		attributes: ["emoji", "color", "COLRv1"],
		version: "15.1",
		website: "https://fonts.google.com/noto/specimen/Noto+Color+Emoji",
		priority: 1, // makes this the default emoji font
		url: dataUrlEmojiColr,
	},
	{
		name: "Noto Emoji",
		attributes: ["emoji"],
		website: "https://fonts.google.com/noto/specimen/Noto+Emoji",
		url: dataUrlEmojiMono,
	},
];

export {fonts};
