/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/font-finder/dist/extract.js":
/*!**************************************************!*\
  !*** ./node_modules/font-finder/dist/extract.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __webpack_require__(/*! os */ "?651b");
var Type;
(function (Type) {
    Type["Serif"] = "serif";
    Type["SansSerif"] = "sansSerif";
    Type["Monospace"] = "monospace";
    Type["Cursive"] = "cursive";
    Type["Unknown"] = "unknown";
})(Type = exports.Type || (exports.Type = {}));
var Style;
(function (Style) {
    Style["Regular"] = "regular";
    Style["Italic"] = "italic";
    Style["Oblique"] = "oblique";
    Style["Bold"] = "bold";
    Style["BoldItalic"] = "boldItalic";
    Style["BoldOblique"] = "boldOblique";
    Style["Other"] = "other";
})(Style = exports.Style || (exports.Style = {}));
const standardEndings = [
    ' Regular',
    ' Bold',
    ' Bold Italic',
    ' Bold Oblique',
    ' Italic',
    ' Oblique'
];
function name(fontData, language) {
    const family = fontData.names.preferredFamily && fontData.names.preferredFamily[language]
        ? fontData.names.preferredFamily[language]
        : fontData.names.fontFamily[language];
    // On Windows, if the full font name doesn't end with one of the standard
    // forms, the full name is needed to identify the font. Notably, this is not
    // the same thing as the subfamily matching it, as with 'Roboto Thin Italic'
    // where the subfamily is 'Thin Italic'. In this case, the 'Italic' should
    // be removed, but not the 'Thin'.
    // TODO: actually, 'Roboto' and 'Roboto Thin' seem to both work. This needs
    // more work to figure out the exact logic
    if (os.platform() === 'win32') {
        const subfamily = fontData.names.preferredSubfamily && fontData.names.preferredSubfamily[language]
            ? fontData.names.preferredSubfamily[language]
            : fontData.names.fontSubfamily[language];
        const fullName = `${family} ${subfamily}`;
        let endIndex = -1;
        for (const end of standardEndings) {
            const index = fullName.lastIndexOf(end);
            if (index !== -1) {
                endIndex = index;
                break;
            }
        }
        if (endIndex !== -1) {
            return fullName.substring(0, endIndex);
        }
        return fullName;
    }
    return family;
}
exports.name = name;
function type(fontData) {
    if (fontData.os2) {
        // Panose specification: https://monotype.github.io/panose/pan1.htm
        switch (fontData.os2.panose[0]) {
            case 2:
                // https://monotype.github.io/panose/pan2.htm#_Toc380547256
                if (fontData.os2.panose[3] === 9) {
                    return Type.Monospace;
                }
                // https://monotype.github.io/panose/pan2.htm#Sec2SerifStyle
                if (fontData.os2.panose[1] >= 11 &&
                    fontData.os2.panose[1] <= 15 ||
                    fontData.os2.panose[1] === 0) {
                    return Type.SansSerif;
                }
                return Type.Serif;
            case 3:
                return Type.Cursive;
        }
    }
    else if (fontData.post && fontData.post.isFixedPitch) {
        return Type.Monospace;
    }
    // TODO: better classification
    return Type.Unknown;
}
exports.type = type;
// https://docs.microsoft.com/en-us/typography/opentype/spec/os2#fsselection
function style(fontData) {
    // If we don't have an OS/2 or head table, there's no good way to figure out
    // what's in the font
    if (!fontData.os2 && !fontData.head) {
        return Style.Other;
    }
    const bold = fontData.os2
        ? fontData.os2.fsSelection & 0x20 // OS/2: fsSelection bit 5
        : fontData.head.macStyle & 0x01; // head: macStyle bit 0
    const italic = fontData.os2
        ? fontData.os2.fsSelection & 0x01 // OS/2: fsSelection bit 0
        : fontData.post
            ? fontData.post.italicAngle < 0 // post: negative italicAngle
            : fontData.head.macStyle & 0x02; // head: macStyle bit 1
    const oblique = fontData.os2
        ? fontData.os2.fsSelection & 0x200 // OS/2: fsSelection bit 9
        : fontData.post
            ? fontData.post.italicAngle > 0 // post: positive italicAngle
            : 0; // head: N/A
    const regular = fontData.os2
        ? fontData.os2.fsSelection & 0x140 // OS/2: fsSelection bit 6 or 8 (WWS)
        : 1; // head: N/A (assume yes for fallback)
    if (bold) {
        // Oblique has to come before italic for it to get picked up
        if (oblique) {
            return Style.BoldOblique;
        }
        if (italic) {
            return Style.BoldItalic;
        }
        return Style.Bold;
    }
    // Oblique has to come before italic for it to get picked up
    if (oblique) {
        return Style.Oblique;
    }
    if (italic) {
        return Style.Italic;
    }
    if (regular) {
        return Style.Regular;
    }
    // TODO: better classification
    return Style.Other;
}
exports.style = style;
const boldStyles = [Style.Bold, Style.BoldItalic, Style.BoldOblique];
function weight(fontData) {
    if (fontData.os2) {
        // Use the OS/2 weight class if available
        return fontData.os2.usWeightClass;
    }
    else if (boldStyles.includes(style(fontData))) {
        // Assume 700 if the font is a bold font
        return 700;
    }
    else {
        // Assume the standard 400 if all else fails
        return 400;
    }
}
exports.weight = weight;
//# sourceMappingURL=extract.js.map

/***/ }),

/***/ "./node_modules/font-finder/dist/index.js":
/*!************************************************!*\
  !*** ./node_modules/font-finder/dist/index.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const get_system_fonts_1 = __webpack_require__(/*! get-system-fonts */ "./node_modules/get-system-fonts/dist/index.js");
const parse_1 = __webpack_require__(/*! ./parse */ "./node_modules/font-finder/dist/parse.js");
const extract = __webpack_require__(/*! ./extract */ "./node_modules/font-finder/dist/extract.js");
var extract_1 = __webpack_require__(/*! ./extract */ "./node_modules/font-finder/dist/extract.js");
exports.Type = extract_1.Type;
exports.Style = extract_1.Style;
/**
 * Retrieve metadata for all fonts installed on the system.
 *
 * @param options Options to configure font retrieval
 */
async function list(options) {
    const opts = Object.assign({ concurrency: 4, language: 'en', onFontError: null }, options);
    // TODO: support woff, woff2, ttc
    const files = await get_system_fonts_1.default({ extensions: ['ttf', 'otf'] });
    // Process each font in parallel, swallowing any errors found along the way.
    const results = await parallelize(async (file) => {
        try {
            const fontData = await parse_1.default(file);
            return getMetadata(file, fontData, opts.language);
        }
        catch (e) {
            if (opts.onFontError) {
                opts.onFontError(file, e);
            }
        }
    }, files, opts.concurrency);
    // Group the fonts by their font family
    const fonts = {};
    for (let _a of results.filter(font => font)) {
        const { name } = _a, font = __rest(_a, ["name"]);
        if (!fonts[name]) {
            fonts[name] = [];
        }
        fonts[name].push(font);
    }
    return fonts;
}
exports.list = list;
/**
 * Lists all variants found for the provided font family. If no variants are
 * found, an empty array is returned.
 *
 * @param name The name of the font family to retrieve
 * @param options Options to configure font retrieval
 */
async function listVariants(name, options) {
    const fonts = await list(options);
    return fonts[name] || [];
}
exports.listVariants = listVariants;
/**
 * Gets metadata for a single font file, returning metadata for the first
 * font variant found in the file. If there is an error extracting the font, an
 * error is thrown (unlike in list, where the font is simply ignored).
 *
 * @param path Absolute path to the file to retrieve
 * @param options Options to configure font retrieval
 */
async function get(path, options) {
    const opts = Object.assign({ language: 'en' }, options);
    const fontData = await parse_1.default(path);
    return getMetadata(path, fontData, opts.language);
}
exports.get = get;
/**
 * Extracts font metadata, given the font information.
 *
 * @param path Absolute path to the font file
 * @param fontData Table data for the font
 * @param language Language to use when resolving names
 */
function getMetadata(path, fontData, language) {
    return {
        name: extract.name(fontData, language),
        path,
        type: extract.type(fontData),
        weight: extract.weight(fontData),
        style: extract.style(fontData)
    };
}
/**
 * Runs an asynchronous operation against a list of inputs, capping the
 * concurrency of execution at the provided number.
 *
 * @param operation Function to run with each input
 * @param data Array of inputs to be applied to the function. Inputs are started
 *             in array order
 * @param concurrency The maximum number of operations to run simultaneously
 */
async function parallelize(operation, data, concurrency) {
    const results = [];
    let index = 0;
    const wrapper = async (i) => {
        results.push(await operation(data[i]));
        if (index < data.length) {
            await wrapper(index++);
        }
    };
    const promises = [];
    for (; index < data.length && index < concurrency; index++) {
        promises.push(wrapper(index));
    }
    await Promise.all(promises);
    return results;
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/font-finder/dist/parse.js":
/*!************************************************!*\
  !*** ./node_modules/font-finder/dist/parse.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const fs = __webpack_require__(/*! fs */ "?3854");
const promise_stream_reader_1 = __webpack_require__(/*! promise-stream-reader */ "./node_modules/promise-stream-reader/dist/index.js");
const name_1 = __webpack_require__(/*! ./tables/name */ "./node_modules/font-finder/dist/tables/name.js");
const ltag_1 = __webpack_require__(/*! ./tables/ltag */ "./node_modules/font-finder/dist/tables/ltag.js");
const os2_1 = __webpack_require__(/*! ./tables/os2 */ "./node_modules/font-finder/dist/tables/os2.js");
const head_1 = __webpack_require__(/*! ./tables/head */ "./node_modules/font-finder/dist/tables/head.js");
const post_1 = __webpack_require__(/*! ./tables/post */ "./node_modules/font-finder/dist/tables/post.js");
var SignatureType;
(function (SignatureType) {
    SignatureType[SignatureType["TrueType"] = 0] = "TrueType";
    SignatureType[SignatureType["CFF"] = 1] = "CFF";
    SignatureType[SignatureType["Woff"] = 2] = "Woff";
})(SignatureType || (SignatureType = {}));
const tableInfo = {
    name: {
        tag: Buffer.from('name'),
        parse: name_1.default
    },
    ltag: {
        tag: Buffer.from('ltag'),
        parse: ltag_1.default
    },
    os2: {
        tag: Buffer.from('OS/2'),
        parse: os2_1.default
    },
    head: {
        tag: Buffer.from('head'),
        parse: head_1.default
    },
    post: {
        tag: Buffer.from('post'),
        parse: post_1.default
    }
};
/**
 * Loads the bare minimum information needed to retrieve the metadata that we
 * want, streaming the data from the file until we've found everything we need.
 *
 * @param filePath Absolute path to the font to load
 */
async function parseFont(filePath) {
    return new Promise((resolve, reject) => {
        (async () => {
            const pStream = promise_stream_reader_1.default();
            const stream = fs.createReadStream(filePath);
            // Track the stream state so we don't try to destroy a closed socket
            let streamFinished = false;
            const markFinished = () => { streamFinished = true; };
            stream.once('close', markFinished);
            stream.once('end', markFinished);
            stream.once('error', e => {
                streamFinished = true;
                reject(e);
            });
            stream.pipe(pStream);
            try {
                const signature = parseTag(await pStream.read(4));
                switch (signature) {
                    case SignatureType.TrueType:
                    case SignatureType.CFF:
                        const numTables = (await pStream.read(2)).readUInt16BE(0);
                        // Skip the rest of the offset table
                        await pStream.skip(6);
                        // Get the table metadata
                        const tableMeta = await findTableRecords(pStream, numTables);
                        // Order the tables based on location in the file. We
                        // want to look for earlier tables first
                        const orderedTables = Object.entries(tableMeta)
                            .sort((a, b) => a[1].offset - b[1].offset);
                        // Get the buffer representing each of the tables
                        const tableData = {};
                        for (const [name, meta] of orderedTables) {
                            // Skip the data between the end of the previous
                            // table and the start of this one
                            await pStream.skip(meta.offset - pStream.offset);
                            tableData[name] = await pStream.read(meta.length);
                        }
                        // The ltag table is usually not present, but parse it
                        // first if it is because we need it for the name table.
                        let ltag = [];
                        if (tableData.ltag) {
                            ltag = tableInfo.ltag.parse(tableData.ltag);
                        }
                        // If any of the necessary font tables are missing,
                        // throw
                        if (!tableData.name) {
                            throw new Error(`missing required OpenType table 'name' in font file: ${filePath}`);
                        }
                        // Parse and return the tables we need
                        return {
                            names: tableInfo.name.parse(tableData.name, ltag),
                            os2: tableData.os2 && tableInfo.os2.parse(tableData.os2),
                            head: tableData.head && tableInfo.head.parse(tableData.head),
                            post: tableData.post && tableInfo.post.parse(tableData.post)
                        };
                    case SignatureType.Woff:
                    default:
                        throw new Error('provided font type is not supported yet');
                }
            }
            finally {
                // Clean up our state so that the file stream doesn't leak
                stream.unpipe(pStream);
                if (!streamFinished) {
                    stream.destroy();
                    pStream.destroy();
                }
            }
        })().then(resolve, reject);
    });
}
exports.default = parseFont;
const signatures = {
    one: Buffer.from([0x00, 0x01, 0x00, 0x00]),
    otto: Buffer.from('OTTO'),
    true: Buffer.from('true'),
    typ1: Buffer.from('typ1'),
    woff: Buffer.from('wOFF')
};
/**
 * Parses a tag buffer, returning the type of font contained within.
 *
 * @param tag 4-byte buffer to parse for the tag
 */
function parseTag(tag) {
    if (tag.equals(signatures.one) ||
        tag.equals(signatures.true) ||
        tag.equals(signatures.typ1)) {
        return SignatureType.TrueType;
    }
    else if (tag.equals(signatures.otto)) {
        return SignatureType.CFF;
    }
    else if (tag.equals(signatures.woff)) {
        return SignatureType.Woff;
    }
    else {
        throw new Error(`Unsupported signature type: ${tag}`);
    }
}
/**
 * Parse the table record list for the specific tables that we care about.
 *
 * @param stream Promise stream positioned at the table record list
 * @param numTables The number of tables in the table record list
 */
async function findTableRecords(stream, numTables) {
    const tableMeta = {};
    for (let i = 0; i < numTables; i++) {
        const tag = await stream.read(4);
        const data = await stream.read(12);
        for (const [name, table] of Object.entries(tableInfo)) {
            if (tag.equals(table.tag)) {
                tableMeta[name] = {
                    offset: data.readUInt32BE(4),
                    length: data.readUInt32BE(8)
                };
                if (tableMeta.name && tableMeta.ltag && tableMeta.os2) {
                    return tableMeta;
                }
            }
        }
    }
    return tableMeta;
}
//# sourceMappingURL=parse.js.map

/***/ }),

/***/ "./node_modules/font-finder/dist/tables/head.js":
/*!******************************************************!*\
  !*** ./node_modules/font-finder/dist/tables/head.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const utility_1 = __webpack_require__(/*! ./utility */ "./node_modules/font-finder/dist/tables/utility.js");
// Parse the header `head` table
function parseHeadTable(data) {
    return {
        version: utility_1.formatFixed(data.readUInt16BE(0), data.readUInt16BE(2)),
        fontRevision: utility_1.formatFixed(data.readUInt16BE(4), data.readUInt16BE(6)),
        checkSumAdjustment: data.readUInt32BE(8),
        magicNumber: data.readUInt32BE(12),
        flags: data.readUInt16BE(16),
        unitsPerEm: data.readUInt16BE(18),
        created: utility_1.formatLongDateTime(data.readUInt32BE(20), data.readUInt32BE(24)),
        modified: utility_1.formatLongDateTime(data.readUInt32BE(28), data.readUInt32BE(32)),
        xMin: data.readInt16BE(36),
        yMin: data.readInt16BE(38),
        xMax: data.readInt16BE(40),
        yMax: data.readInt16BE(42),
        macStyle: data.readUInt16BE(44),
        lowestRecPPEM: data.readUInt16BE(46),
        fontDirectionHint: data.readInt16BE(48),
        indexToLocFormat: data.readInt16BE(50),
        glyphDataFormat: data.readInt16BE(52)
    };
}
exports.default = parseHeadTable;
//# sourceMappingURL=head.js.map

/***/ }),

/***/ "./node_modules/font-finder/dist/tables/ltag.js":
/*!******************************************************!*\
  !*** ./node_modules/font-finder/dist/tables/ltag.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// This file is modified from opentype.js. All credit for the capabilities
// provided herein goes to that project and its maintainers. The project can be
// found at https://github.com/nodebox/opentype.js
Object.defineProperty(exports, "__esModule", ({ value: true }));
// The `ltag` table stores IETF BCP-47 language tags. It allows supporting
// languages for which TrueType does not assign a numeric code.
// https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6ltag.html
// http://www.w3.org/International/articles/language-tags/
// http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry
function parseLtagTable(data) {
    const tableVersion = data.readUInt32BE(0);
    if (tableVersion !== 1) {
        throw new Error('Unsupported ltag table version.');
    }
    // The 'ltag' specification does not define any flags; skip the field.
    const numTags = data.readUInt32BE(8);
    const tags = [];
    for (let i = 0; i < numTags; i++) {
        let tag = '';
        const offset = data.readUInt16BE(12 + i * 4);
        const length = data.readUInt16BE(14 + i * 4);
        for (let j = offset; j < offset + length; ++j) {
            tag += String.fromCharCode(data.readInt8(j));
        }
        tags.push(tag);
    }
    return tags;
}
exports.default = parseLtagTable;
//# sourceMappingURL=ltag.js.map

/***/ }),

/***/ "./node_modules/font-finder/dist/tables/name.js":
/*!******************************************************!*\
  !*** ./node_modules/font-finder/dist/tables/name.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// This file is modified from opentype.js. All credit for the capabilities
// provided herein goes to that project and its maintainers. The project can be
// found at https://github.com/nodebox/opentype.js
Object.defineProperty(exports, "__esModule", ({ value: true }));
// The `name` naming table.
// https://www.microsoft.com/typography/OTSPEC/name.htm
// NameIDs for the name table.
const nameTableNames = [
    'copyright',
    'fontFamily',
    'fontSubfamily',
    'uniqueID',
    'fullName',
    'version',
    'postScriptName',
    'trademark',
    'manufacturer',
    'designer',
    'description',
    'manufacturerURL',
    'designerURL',
    'license',
    'licenseURL',
    'reserved',
    'preferredFamily',
    'preferredSubfamily',
    'compatibleFullName',
    'sampleText',
    'postScriptFindFontName',
    'wwsFamily',
    'wwsSubfamily' // 22
];
const macLanguages = {
    0: 'en',
    1: 'fr',
    2: 'de',
    3: 'it',
    4: 'nl',
    5: 'sv',
    6: 'es',
    7: 'da',
    8: 'pt',
    9: 'no',
    10: 'he',
    11: 'ja',
    12: 'ar',
    13: 'fi',
    14: 'el',
    15: 'is',
    16: 'mt',
    17: 'tr',
    18: 'hr',
    19: 'zh-Hant',
    20: 'ur',
    21: 'hi',
    22: 'th',
    23: 'ko',
    24: 'lt',
    25: 'pl',
    26: 'hu',
    27: 'es',
    28: 'lv',
    29: 'se',
    30: 'fo',
    31: 'fa',
    32: 'ru',
    33: 'zh',
    34: 'nl-BE',
    35: 'ga',
    36: 'sq',
    37: 'ro',
    38: 'cz',
    39: 'sk',
    40: 'si',
    41: 'yi',
    42: 'sr',
    43: 'mk',
    44: 'bg',
    45: 'uk',
    46: 'be',
    47: 'uz',
    48: 'kk',
    49: 'az-Cyrl',
    50: 'az-Arab',
    51: 'hy',
    52: 'ka',
    53: 'mo',
    54: 'ky',
    55: 'tg',
    56: 'tk',
    57: 'mn-CN',
    58: 'mn',
    59: 'ps',
    60: 'ks',
    61: 'ku',
    62: 'sd',
    63: 'bo',
    64: 'ne',
    65: 'sa',
    66: 'mr',
    67: 'bn',
    68: 'as',
    69: 'gu',
    70: 'pa',
    71: 'or',
    72: 'ml',
    73: 'kn',
    74: 'ta',
    75: 'te',
    76: 'si',
    77: 'my',
    78: 'km',
    79: 'lo',
    80: 'vi',
    81: 'id',
    82: 'tl',
    83: 'ms',
    84: 'ms-Arab',
    85: 'am',
    86: 'ti',
    87: 'om',
    88: 'so',
    89: 'sw',
    90: 'rw',
    91: 'rn',
    92: 'ny',
    93: 'mg',
    94: 'eo',
    128: 'cy',
    129: 'eu',
    130: 'ca',
    131: 'la',
    132: 'qu',
    133: 'gn',
    134: 'ay',
    135: 'tt',
    136: 'ug',
    137: 'dz',
    138: 'jv',
    139: 'su',
    140: 'gl',
    141: 'af',
    142: 'br',
    143: 'iu',
    144: 'gd',
    145: 'gv',
    146: 'ga',
    147: 'to',
    148: 'el-polyton',
    149: 'kl',
    150: 'az',
    151: 'nn'
};
// While Microsoft indicates a region/country for all its language
// IDs, we omit the region code if it's equal to the "most likely
// region subtag" according to Unicode CLDR. For scripts, we omit
// the subtag if it is equal to the Suppress-Script entry in the
// IANA language subtag registry for IETF BCP 47.
//
// For example, Microsoft states that its language code 0x041A is
// Croatian in Croatia. We transform this to the BCP 47 language code 'hr'
// and not 'hr-HR' because Croatia is the default country for Croatian,
// according to Unicode CLDR. As another example, Microsoft states
// that 0x101A is Croatian (Latin) in Bosnia-Herzegovina. We transform
// this to 'hr-BA' and not 'hr-Latn-BA' because Latin is the default script
// for the Croatian language, according to IANA.
//
// http://www.unicode.org/cldr/charts/latest/supplemental/likely_subtags.html
// http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry
const windowsLanguages = {
    0x0436: 'af',
    0x041C: 'sq',
    0x0484: 'gsw',
    0x045E: 'am',
    0x1401: 'ar-DZ',
    0x3C01: 'ar-BH',
    0x0C01: 'ar',
    0x0801: 'ar-IQ',
    0x2C01: 'ar-JO',
    0x3401: 'ar-KW',
    0x3001: 'ar-LB',
    0x1001: 'ar-LY',
    0x1801: 'ary',
    0x2001: 'ar-OM',
    0x4001: 'ar-QA',
    0x0401: 'ar-SA',
    0x2801: 'ar-SY',
    0x1C01: 'aeb',
    0x3801: 'ar-AE',
    0x2401: 'ar-YE',
    0x042B: 'hy',
    0x044D: 'as',
    0x082C: 'az-Cyrl',
    0x042C: 'az',
    0x046D: 'ba',
    0x042D: 'eu',
    0x0423: 'be',
    0x0845: 'bn',
    0x0445: 'bn-IN',
    0x201A: 'bs-Cyrl',
    0x141A: 'bs',
    0x047E: 'br',
    0x0402: 'bg',
    0x0403: 'ca',
    0x0C04: 'zh-HK',
    0x1404: 'zh-MO',
    0x0804: 'zh',
    0x1004: 'zh-SG',
    0x0404: 'zh-TW',
    0x0483: 'co',
    0x041A: 'hr',
    0x101A: 'hr-BA',
    0x0405: 'cs',
    0x0406: 'da',
    0x048C: 'prs',
    0x0465: 'dv',
    0x0813: 'nl-BE',
    0x0413: 'nl',
    0x0C09: 'en-AU',
    0x2809: 'en-BZ',
    0x1009: 'en-CA',
    0x2409: 'en-029',
    0x4009: 'en-IN',
    0x1809: 'en-IE',
    0x2009: 'en-JM',
    0x4409: 'en-MY',
    0x1409: 'en-NZ',
    0x3409: 'en-PH',
    0x4809: 'en-SG',
    0x1C09: 'en-ZA',
    0x2C09: 'en-TT',
    0x0809: 'en-GB',
    0x0409: 'en',
    0x3009: 'en-ZW',
    0x0425: 'et',
    0x0438: 'fo',
    0x0464: 'fil',
    0x040B: 'fi',
    0x080C: 'fr-BE',
    0x0C0C: 'fr-CA',
    0x040C: 'fr',
    0x140C: 'fr-LU',
    0x180C: 'fr-MC',
    0x100C: 'fr-CH',
    0x0462: 'fy',
    0x0456: 'gl',
    0x0437: 'ka',
    0x0C07: 'de-AT',
    0x0407: 'de',
    0x1407: 'de-LI',
    0x1007: 'de-LU',
    0x0807: 'de-CH',
    0x0408: 'el',
    0x046F: 'kl',
    0x0447: 'gu',
    0x0468: 'ha',
    0x040D: 'he',
    0x0439: 'hi',
    0x040E: 'hu',
    0x040F: 'is',
    0x0470: 'ig',
    0x0421: 'id',
    0x045D: 'iu',
    0x085D: 'iu-Latn',
    0x083C: 'ga',
    0x0434: 'xh',
    0x0435: 'zu',
    0x0410: 'it',
    0x0810: 'it-CH',
    0x0411: 'ja',
    0x044B: 'kn',
    0x043F: 'kk',
    0x0453: 'km',
    0x0486: 'quc',
    0x0487: 'rw',
    0x0441: 'sw',
    0x0457: 'kok',
    0x0412: 'ko',
    0x0440: 'ky',
    0x0454: 'lo',
    0x0426: 'lv',
    0x0427: 'lt',
    0x082E: 'dsb',
    0x046E: 'lb',
    0x042F: 'mk',
    0x083E: 'ms-BN',
    0x043E: 'ms',
    0x044C: 'ml',
    0x043A: 'mt',
    0x0481: 'mi',
    0x047A: 'arn',
    0x044E: 'mr',
    0x047C: 'moh',
    0x0450: 'mn',
    0x0850: 'mn-CN',
    0x0461: 'ne',
    0x0414: 'nb',
    0x0814: 'nn',
    0x0482: 'oc',
    0x0448: 'or',
    0x0463: 'ps',
    0x0415: 'pl',
    0x0416: 'pt',
    0x0816: 'pt-PT',
    0x0446: 'pa',
    0x046B: 'qu-BO',
    0x086B: 'qu-EC',
    0x0C6B: 'qu',
    0x0418: 'ro',
    0x0417: 'rm',
    0x0419: 'ru',
    0x243B: 'smn',
    0x103B: 'smj-NO',
    0x143B: 'smj',
    0x0C3B: 'se-FI',
    0x043B: 'se',
    0x083B: 'se-SE',
    0x203B: 'sms',
    0x183B: 'sma-NO',
    0x1C3B: 'sms',
    0x044F: 'sa',
    0x1C1A: 'sr-Cyrl-BA',
    0x0C1A: 'sr',
    0x181A: 'sr-Latn-BA',
    0x081A: 'sr-Latn',
    0x046C: 'nso',
    0x0432: 'tn',
    0x045B: 'si',
    0x041B: 'sk',
    0x0424: 'sl',
    0x2C0A: 'es-AR',
    0x400A: 'es-BO',
    0x340A: 'es-CL',
    0x240A: 'es-CO',
    0x140A: 'es-CR',
    0x1C0A: 'es-DO',
    0x300A: 'es-EC',
    0x440A: 'es-SV',
    0x100A: 'es-GT',
    0x480A: 'es-HN',
    0x080A: 'es-MX',
    0x4C0A: 'es-NI',
    0x180A: 'es-PA',
    0x3C0A: 'es-PY',
    0x280A: 'es-PE',
    0x500A: 'es-PR',
    // Microsoft has defined two different language codes for
    // “Spanish with modern sorting” and “Spanish with traditional
    // sorting”. This makes sense for collation APIs, and it would be
    // possible to express this in BCP 47 language tags via Unicode
    // extensions (eg., es-u-co-trad is Spanish with traditional
    // sorting). However, for storing names in fonts, the distinction
    // does not make sense, so we give “es” in both cases.
    0x0C0A: 'es',
    0x040A: 'es',
    0x540A: 'es-US',
    0x380A: 'es-UY',
    0x200A: 'es-VE',
    0x081D: 'sv-FI',
    0x041D: 'sv',
    0x045A: 'syr',
    0x0428: 'tg',
    0x085F: 'tzm',
    0x0449: 'ta',
    0x0444: 'tt',
    0x044A: 'te',
    0x041E: 'th',
    0x0451: 'bo',
    0x041F: 'tr',
    0x0442: 'tk',
    0x0480: 'ug',
    0x0422: 'uk',
    0x042E: 'hsb',
    0x0420: 'ur',
    0x0843: 'uz-Cyrl',
    0x0443: 'uz',
    0x042A: 'vi',
    0x0452: 'cy',
    0x0488: 'wo',
    0x0485: 'sah',
    0x0478: 'ii',
    0x046A: 'yo'
};
// Returns a IETF BCP 47 language code, for example 'zh-Hant'
// for 'Chinese in the traditional script'.
function getLanguageCode(platformID, languageID, ltag) {
    switch (platformID) {
        case 0: // Unicode
            if (languageID === 0xFFFF) {
                return 'und';
            }
            else if (ltag) {
                return ltag[languageID];
            }
            break;
        case 1: // Macintosh
            return macLanguages[languageID];
        case 3: // Windows
            return windowsLanguages[languageID];
    }
    return undefined;
}
const utf16 = 'utf-16';
// MacOS script ID → encoding. This table stores the default case,
// which can be overridden by macLanguageEncodings.
const macScriptEncodings = {
    0: 'macintosh',
    1: 'x-mac-japanese',
    2: 'x-mac-chinesetrad',
    3: 'x-mac-korean',
    6: 'x-mac-greek',
    7: 'x-mac-cyrillic',
    9: 'x-mac-devanagai',
    10: 'x-mac-gurmukhi',
    11: 'x-mac-gujarati',
    12: 'x-mac-oriya',
    13: 'x-mac-bengali',
    14: 'x-mac-tamil',
    15: 'x-mac-telugu',
    16: 'x-mac-kannada',
    17: 'x-mac-malayalam',
    18: 'x-mac-sinhalese',
    19: 'x-mac-burmese',
    20: 'x-mac-khmer',
    21: 'x-mac-thai',
    22: 'x-mac-lao',
    23: 'x-mac-georgian',
    24: 'x-mac-armenian',
    25: 'x-mac-chinesesimp',
    26: 'x-mac-tibetan',
    27: 'x-mac-mongolian',
    28: 'x-mac-ethiopic',
    29: 'x-mac-ce',
    30: 'x-mac-vietnamese',
    31: 'x-mac-extarabic' // smExtArabic
};
// MacOS language ID → encoding. This table stores the exceptional
// cases, which override macScriptEncodings. For writing MacOS naming
// tables, we need to emit a MacOS script ID. Therefore, we cannot
// merge macScriptEncodings into macLanguageEncodings.
//
// http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/Readme.txt
const macLanguageEncodings = {
    15: 'x-mac-icelandic',
    17: 'x-mac-turkish',
    18: 'x-mac-croatian',
    24: 'x-mac-ce',
    25: 'x-mac-ce',
    26: 'x-mac-ce',
    27: 'x-mac-ce',
    28: 'x-mac-ce',
    30: 'x-mac-icelandic',
    37: 'x-mac-romanian',
    38: 'x-mac-ce',
    39: 'x-mac-ce',
    40: 'x-mac-ce',
    143: 'x-mac-inuit',
    146: 'x-mac-gaelic' // langIrishGaelicScript
};
function getEncoding(platformID, encodingID, languageID) {
    switch (platformID) {
        case 0: // Unicode
            return utf16;
        case 1: // Apple Macintosh
            return macLanguageEncodings[languageID] || macScriptEncodings[encodingID];
        case 3: // Microsoft Windows
            if (encodingID === 1 || encodingID === 10) {
                return utf16;
            }
            break;
    }
    return undefined;
}
// Parse the naming `name` table.
// FIXME: Format 1 additional fields are not supported yet.
// ltag is the content of the `ltag' table, such as ['en', 'zh-Hans', 'de-CH-1904'].
function parseNameTable(data, ltag) {
    const name = {};
    // const format = data.readUInt16BE(0);
    const count = data.readUInt16BE(2);
    const stringOffset = data.readUInt16BE(4);
    let tableOffset = 6;
    for (let i = 0; i < count; i++) {
        const platformID = data.readUInt16BE(tableOffset + 0);
        const encodingID = data.readUInt16BE(tableOffset + 2);
        const languageID = data.readUInt16BE(tableOffset + 4);
        const nameID = data.readUInt16BE(tableOffset + 6);
        const property = nameTableNames[nameID] || String(nameID);
        const byteLength = data.readUInt16BE(tableOffset + 8);
        const offset = data.readUInt16BE(tableOffset + 10);
        const language = getLanguageCode(platformID, languageID, ltag);
        const encoding = getEncoding(platformID, encodingID, languageID);
        tableOffset += 12;
        if (encoding !== undefined && language !== undefined) {
            let text;
            if (encoding === utf16) {
                const charLength = byteLength / 2;
                const chars = Array(charLength);
                for (let i = 0; i < charLength; i++) {
                    chars[i] = data.readUInt16BE(stringOffset + offset + i * 2);
                }
                text = String.fromCharCode(...chars);
            }
            else {
                text = decodeMacString(data, stringOffset + offset, byteLength, encoding);
            }
            if (text) {
                let translations = name[property];
                // tslint:disable-next-line
                if (translations === undefined) {
                    translations = name[property] = {};
                }
                translations[language] = text;
            }
        }
    }
    return name;
}
exports.default = parseNameTable;
// Data for converting old eight-bit Macintosh encodings to Unicode.
// This representation is optimized for decoding; encoding is slower
// and needs more memory. The assumption is that all opentype.js users
// want to open fonts, but saving a font will be comparatively rare
// so it can be more expensive. Keyed by IANA character set name.
//
// Python script for generating these strings:
//
//     s = u''.join([chr(c).decode('mac_greek') for c in range(128, 256)])
//     print(s.encode('utf-8'))
/**
 * @private
 */
const eightBitMacEncodings = {
    'x-mac-croatian': // Python: 'mac_croatian'
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø' +
        '¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊©⁄€‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ',
    'x-mac-cyrillic': // Python: 'mac_cyrillic'
    'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°Ґ£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµґЈЄєЇїЉљЊњ' +
        'јЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю',
    'x-mac-gaelic': // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/GAELIC.TXT
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØḂ±≤≥ḃĊċḊḋḞḟĠġṀæø' +
        'ṁṖṗɼƒſṠ«»… ÀÃÕŒœ–—“”‘’ṡẛÿŸṪ€‹›Ŷŷṫ·Ỳỳ⁊ÂÊÁËÈÍÎÏÌÓÔ♣ÒÚÛÙıÝýŴŵẄẅẀẁẂẃ',
    'x-mac-greek': // Python: 'mac_greek'
    'Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦€ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩ' +
        'άΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ\u00AD',
    'x-mac-icelandic': // Python: 'mac_iceland'
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
        '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
    'x-mac-inuit': // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/INUIT.TXT
    'ᐃᐄᐅᐆᐊᐋᐱᐲᐳᐴᐸᐹᑉᑎᑏᑐᑑᑕᑖᑦᑭᑮᑯᑰᑲᑳᒃᒋᒌᒍᒎᒐᒑ°ᒡᒥᒦ•¶ᒧ®©™ᒨᒪᒫᒻᓂᓃᓄᓅᓇᓈᓐᓯᓰᓱᓲᓴᓵᔅᓕᓖᓗ' +
        'ᓘᓚᓛᓪᔨᔩᔪᔫᔭ… ᔮᔾᕕᕖᕗ–—“”‘’ᕘᕙᕚᕝᕆᕇᕈᕉᕋᕌᕐᕿᖀᖁᖂᖃᖄᖅᖏᖐᖑᖒᖓᖔᖕᙱᙲᙳᙴᙵᙶᖖᖠᖡᖢᖣᖤᖥᖦᕼŁł',
    'x-mac-ce': // Python: 'mac_latin2'
    'ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅ' +
        'ņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ',
    macintosh: // Python: 'mac_roman'
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
        '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
    'x-mac-romanian': // Python: 'mac_romanian'
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂȘ∞±≤≥¥µ∂∑∏π∫ªºΩăș' +
        '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›Țț‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
    'x-mac-turkish': // Python: 'mac_turkish'
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
        '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙˆ˜¯˘˙˚¸˝˛ˇ'
};
/**
 * Decodes an old-style Macintosh string. Returns either a Unicode JavaScript
 * string, or 'undefined' if the encoding is unsupported. For example, we do
 * not support Chinese, Japanese or Korean because these would need large
 * mapping tables.
 * @param {DataView} dataView
 * @param {number} offset
 * @param {number} dataLength
 * @param {string} encoding
 * @returns {string}
 */
function decodeMacString(data, offset, dataLength, encoding) {
    const table = eightBitMacEncodings[encoding];
    if (table === undefined) {
        return undefined;
    }
    let result = '';
    for (let i = 0; i < dataLength; i++) {
        const c = data.readUInt8(offset + i);
        // In all eight-bit Mac encodings, the characters 0x00..0x7F are
        // mapped to U+0000..U+007F; we only need to look up the others.
        if (c <= 0x7F) {
            result += String.fromCharCode(c);
        }
        else {
            result += table[c & 0x7F];
        }
    }
    return result;
}
//# sourceMappingURL=name.js.map

/***/ }),

/***/ "./node_modules/font-finder/dist/tables/os2.js":
/*!*****************************************************!*\
  !*** ./node_modules/font-finder/dist/tables/os2.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// This file is modified from opentype.js. All credit for the capabilities
// provided herein goes to that project and its maintainers. The project can be
// found at https://github.com/nodebox/opentype.js
Object.defineProperty(exports, "__esModule", ({ value: true }));
// Parse the OS/2 and Windows metrics `OS/2` table
function parseOS2Table(data) {
    // The OS/2 table must be at least 78 bytes long
    if (data.length < 78) {
        return undefined;
    }
    const os2 = {
        version: data.readUInt16BE(0),
        xAvgCharWidth: data.readUInt16BE(2),
        usWeightClass: data.readUInt16BE(4),
        usWidthClass: data.readUInt16BE(6),
        fsType: data.readUInt16BE(8),
        ySubscriptXSize: data.readInt16BE(10),
        ySubscriptYSize: data.readInt16BE(12),
        ySubscriptXOffset: data.readInt16BE(14),
        ySubscriptYOffset: data.readInt16BE(16),
        ySuperscriptXSize: data.readInt16BE(18),
        ySuperscriptYSize: data.readInt16BE(20),
        ySuperscriptXOffset: data.readInt16BE(22),
        ySuperscriptYOffset: data.readInt16BE(24),
        yStrikeoutSize: data.readInt16BE(26),
        yStrikeoutPosition: data.readInt16BE(28),
        sFamilyClass: data.readInt16BE(30),
        panose: [
            data.readUInt8(32),
            data.readUInt8(33),
            data.readUInt8(34),
            data.readUInt8(35),
            data.readUInt8(36),
            data.readUInt8(37),
            data.readUInt8(38),
            data.readUInt8(39),
            data.readUInt8(40),
            data.readUInt8(41)
        ],
        ulUnicodeRange1: data.readUInt32BE(42),
        ulUnicodeRange2: data.readUInt32BE(46),
        ulUnicodeRange3: data.readUInt32BE(50),
        ulUnicodeRange4: data.readUInt32BE(54),
        achVendID: String.fromCharCode(data.readUInt8(58), data.readUInt8(59), data.readUInt8(60), data.readUInt8(61)),
        fsSelection: data.readUInt16BE(62),
        usFirstCharIndex: data.readUInt16BE(64),
        usLastCharIndex: data.readUInt16BE(66),
        sTypoAscender: data.readInt16BE(68),
        sTypoDescender: data.readInt16BE(70),
        sTypoLineGap: data.readInt16BE(72),
        usWinAscent: data.readUInt16BE(74),
        usWinDescent: data.readUInt16BE(76)
    };
    if (os2.version >= 1 && data.length >= 86) {
        os2.ulCodePageRange1 = data.readUInt32BE(78);
        os2.ulCodePageRange2 = data.readUInt32BE(82);
    }
    if (os2.version >= 2 && data.length >= 96) {
        os2.sxHeight = data.readInt16BE(86);
        os2.sCapHeight = data.readInt16BE(88);
        os2.usDefaultChar = data.readUInt16BE(90);
        os2.usBreakChar = data.readUInt16BE(92);
        os2.usMaxContent = data.readUInt16BE(94);
    }
    return os2;
}
exports.default = parseOS2Table;
//# sourceMappingURL=os2.js.map

/***/ }),

/***/ "./node_modules/font-finder/dist/tables/post.js":
/*!******************************************************!*\
  !*** ./node_modules/font-finder/dist/tables/post.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const utility_1 = __webpack_require__(/*! ./utility */ "./node_modules/font-finder/dist/tables/utility.js");
// Parse the PostScript `post` table. We don't bother with version-specific data
// because it doesn't impact any of our computations
function parsePostTable(data) {
    return {
        version: utility_1.formatFixed(data.readUInt16BE(0), data.readUInt16BE(2)),
        italicAngle: utility_1.formatFixed(data.readUInt16BE(4), data.readUInt16BE(6)),
        underlinePosition: data.readInt16BE(8),
        underlineThickness: data.readInt16BE(10),
        isFixedPitch: data.readUInt32BE(12),
        minMemType42: data.readUInt32BE(16),
        maxMemType42: data.readUInt32BE(20),
        minMemType1: data.readUInt32BE(24),
        maxMemType1: data.readUInt32BE(28)
    };
}
exports.default = parsePostTable;
//# sourceMappingURL=post.js.map

/***/ }),

/***/ "./node_modules/font-finder/dist/tables/utility.js":
/*!*********************************************************!*\
  !*** ./node_modules/font-finder/dist/tables/utility.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function formatFixed(whole, fraction) {
    return whole + fraction / 2 ** 16;
}
exports.formatFixed = formatFixed;
function formatLongDateTime(high, low) {
    // OpenType dates are since 1904. We make them since 1970 to align with unix
    // and multiply by 1000 to make it a millisecond time like the rest of
    // Javascript
    return ((high * 2 ** 32) + low - 2082844800) * 1000;
}
exports.formatLongDateTime = formatLongDateTime;
//# sourceMappingURL=utility.js.map

/***/ }),

/***/ "./node_modules/font-ligatures/dist/flatten.js":
/*!*****************************************************!*\
  !*** ./node_modules/font-ligatures/dist/flatten.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function flatten(tree) {
    const result = {};
    for (const [glyphId, entry] of Object.entries(tree.individual)) {
        result[glyphId] = flattenEntry(entry);
    }
    for (const { range, entry } of tree.range) {
        const flattened = flattenEntry(entry);
        for (let glyphId = range[0]; glyphId < range[1]; glyphId++) {
            result[glyphId] = flattened;
        }
    }
    return result;
}
exports.default = flatten;
function flattenEntry(entry) {
    const result = {};
    if (entry.forward) {
        result.forward = flatten(entry.forward);
    }
    if (entry.reverse) {
        result.reverse = flatten(entry.reverse);
    }
    if (entry.lookup) {
        result.lookup = entry.lookup;
    }
    return result;
}
//# sourceMappingURL=flatten.js.map

/***/ }),

/***/ "./node_modules/font-ligatures/dist/index.js":
/*!***************************************************!*\
  !*** ./node_modules/font-ligatures/dist/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const opentype = __webpack_require__(/*! opentype.js */ "./node_modules/opentype.js/src/opentype.js");
const lru = __webpack_require__(/*! lru-cache */ "./node_modules/lru-cache/index.js");
const merge_1 = __webpack_require__(/*! ./merge */ "./node_modules/font-ligatures/dist/merge.js");
const walk_1 = __webpack_require__(/*! ./walk */ "./node_modules/font-ligatures/dist/walk.js");
const mergeRange_1 = __webpack_require__(/*! ./mergeRange */ "./node_modules/font-ligatures/dist/mergeRange.js");
const _6_1_1 = __webpack_require__(/*! ./processors/6-1 */ "./node_modules/font-ligatures/dist/processors/6-1.js");
const _6_2_1 = __webpack_require__(/*! ./processors/6-2 */ "./node_modules/font-ligatures/dist/processors/6-2.js");
const _6_3_1 = __webpack_require__(/*! ./processors/6-3 */ "./node_modules/font-ligatures/dist/processors/6-3.js");
const _8_1_1 = __webpack_require__(/*! ./processors/8-1 */ "./node_modules/font-ligatures/dist/processors/8-1.js");
const flatten_1 = __webpack_require__(/*! ./flatten */ "./node_modules/font-ligatures/dist/flatten.js");
class FontImpl {
    constructor(font, options) {
        this._lookupTrees = [];
        this._glyphLookups = {};
        this._font = font;
        if (options.cacheSize > 0) {
            this._cache = new lru({
                max: options.cacheSize,
                length: ((val, key) => key.length)
            });
        }
        const caltFeatures = this._font.tables.gsub && this._font.tables.gsub.features.filter(f => f.tag === 'calt') || [];
        const lookupIndices = caltFeatures
            .reduce((acc, val) => [...acc, ...val.feature.lookupListIndexes], []);
        const allLookups = this._font.tables.gsub && this._font.tables.gsub.lookups || [];
        const lookupGroups = allLookups.filter((l, i) => lookupIndices.some(idx => idx === i));
        for (const [index, lookup] of lookupGroups.entries()) {
            const trees = [];
            switch (lookup.lookupType) {
                case 6:
                    for (const [index, table] of lookup.subtables.entries()) {
                        switch (table.substFormat) {
                            case 1:
                                trees.push(_6_1_1.default(table, allLookups, index));
                                break;
                            case 2:
                                trees.push(_6_2_1.default(table, allLookups, index));
                                break;
                            case 3:
                                trees.push(_6_3_1.default(table, allLookups, index));
                                break;
                        }
                    }
                    break;
                case 8:
                    for (const [index, table] of lookup.subtables.entries()) {
                        trees.push(_8_1_1.default(table, index));
                    }
                    break;
            }
            const tree = flatten_1.default(merge_1.default(trees));
            this._lookupTrees.push({
                tree,
                processForward: lookup.lookupType !== 8
            });
            for (const glyphId of Object.keys(tree)) {
                if (!this._glyphLookups[glyphId]) {
                    this._glyphLookups[glyphId] = [];
                }
                this._glyphLookups[glyphId].push(index);
            }
        }
    }
    findLigatures(text) {
        const cached = this._cache && this._cache.get(text);
        if (cached && !Array.isArray(cached)) {
            return cached;
        }
        const glyphIds = [];
        for (const char of text) {
            glyphIds.push(this._font.charToGlyphIndex(char));
        }
        // If there are no lookup groups, there's no point looking for
        // replacements. This gives us a minor performance boost for fonts with
        // no ligatures
        if (this._lookupTrees.length === 0) {
            return {
                inputGlyphs: glyphIds,
                outputGlyphs: glyphIds,
                contextRanges: []
            };
        }
        const result = this._findInternal(glyphIds.slice());
        const finalResult = {
            inputGlyphs: glyphIds,
            outputGlyphs: result.sequence,
            contextRanges: result.ranges
        };
        if (this._cache) {
            this._cache.set(text, finalResult);
        }
        return finalResult;
    }
    findLigatureRanges(text) {
        // Short circuit the process if there are no possible ligatures in the
        // font
        if (this._lookupTrees.length === 0) {
            return [];
        }
        const cached = this._cache && this._cache.get(text);
        if (cached) {
            return Array.isArray(cached) ? cached : cached.contextRanges;
        }
        const glyphIds = [];
        for (const char of text) {
            glyphIds.push(this._font.charToGlyphIndex(char));
        }
        const result = this._findInternal(glyphIds);
        if (this._cache) {
            this._cache.set(text, result.ranges);
        }
        return result.ranges;
    }
    _findInternal(sequence) {
        const ranges = [];
        let nextLookup = this._getNextLookup(sequence, 0);
        while (nextLookup.index !== null) {
            const lookup = this._lookupTrees[nextLookup.index];
            if (lookup.processForward) {
                let lastGlyphIndex = nextLookup.last;
                for (let i = nextLookup.first; i < lastGlyphIndex; i++) {
                    const result = walk_1.default(lookup.tree, sequence, i, i);
                    if (result) {
                        for (let j = 0; j < result.substitutions.length; j++) {
                            const sub = result.substitutions[j];
                            if (sub !== null) {
                                sequence[i + j] = sub;
                            }
                        }
                        mergeRange_1.default(ranges, result.contextRange[0] + i, result.contextRange[1] + i);
                        // Substitutions can end up extending the search range
                        if (i + result.length >= lastGlyphIndex) {
                            lastGlyphIndex = i + result.length + 1;
                        }
                        i += result.length - 1;
                    }
                }
            }
            else {
                // We don't need to do the lastGlyphIndex tracking here because
                // reverse processing isn't allowed to replace more than one
                // character at a time.
                for (let i = nextLookup.last - 1; i >= nextLookup.first; i--) {
                    const result = walk_1.default(lookup.tree, sequence, i, i);
                    if (result) {
                        for (let j = 0; j < result.substitutions.length; j++) {
                            const sub = result.substitutions[j];
                            if (sub !== null) {
                                sequence[i + j] = sub;
                            }
                        }
                        mergeRange_1.default(ranges, result.contextRange[0] + i, result.contextRange[1] + i);
                        i -= result.length - 1;
                    }
                }
            }
            nextLookup = this._getNextLookup(sequence, nextLookup.index + 1);
        }
        return { sequence, ranges };
    }
    /**
     * Returns the lookup and glyph range for the first lookup that might
     * contain a match.
     *
     * @param sequence Input glyph sequence
     * @param start The first input to try
     */
    _getNextLookup(sequence, start) {
        const result = {
            index: null,
            first: Infinity,
            last: -1
        };
        // Loop through each glyph and find the first valid lookup for it
        for (let i = 0; i < sequence.length; i++) {
            const lookups = this._glyphLookups[sequence[i]];
            if (!lookups) {
                continue;
            }
            for (let j = 0; j < lookups.length; j++) {
                const lookupIndex = lookups[j];
                if (lookupIndex >= start) {
                    // Update the lookup information if it's the one we're
                    // storing or earlier than it.
                    if (result.index === null || lookupIndex <= result.index) {
                        result.index = lookupIndex;
                        if (result.first > i) {
                            result.first = i;
                        }
                        result.last = i + 1;
                    }
                    break;
                }
            }
        }
        return result;
    }
}
/**
 * Load the font with the given name. The returned value can be used to find
 * ligatures for the font.
 *
 * @param name Font family name for the font to load
 */
async function load(name, options) {
    // We just grab the first font variant we find for now.
    // TODO: allow users to specify information to pick a specific variant
    const [fontInfo] = await Promise.resolve().then(() => __webpack_require__(/*! font-finder */ "./node_modules/font-finder/dist/index.js")).then(fontFinder => fontFinder.listVariants(name));
    if (!fontInfo) {
        throw new Error(`Font ${name} not found`);
    }
    return loadFile(fontInfo.path, options);
}
exports.load = load;
/**
 * Load the font at the given file path. The returned value can be used to find
 * ligatures for the font.
 *
 * @param path Path to the file containing the font
 */
async function loadFile(path, options) {
    const font = await Promise.resolve().then(() => __webpack_require__(/*! util */ "?847c")).then(util => util.promisify(opentype.load)(path));
    return new FontImpl(font, Object.assign({ cacheSize: 0 }, options));
}
exports.loadFile = loadFile;
/**
 * Load the font from it's binary data. The returned value can be used to find
 * ligatures for the font.
 *
 * @param buffer ArrayBuffer of the font to load
 */
function loadBuffer(buffer, options) {
    const font = opentype.parse(buffer);
    return new FontImpl(font, Object.assign({ cacheSize: 0 }, options));
}
exports.loadBuffer = loadBuffer;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/font-ligatures/dist/merge.js":
/*!***************************************************!*\
  !*** ./node_modules/font-ligatures/dist/merge.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Merges the provided trees into a single lookup tree. When conflicting lookups
 * are encountered between two trees, the one with the lower index, then the
 * lower subindex is chosen.
 *
 * @param trees Array of trees to merge. Entries in earlier trees are favored
 *              over those in later trees when there is a choice.
 */
function mergeTrees(trees) {
    const result = {
        individual: {},
        range: []
    };
    for (const tree of trees) {
        mergeSubtree(result, tree);
    }
    return result;
}
exports.default = mergeTrees;
/**
 * Recursively merges the data for the mergeTree into the mainTree.
 *
 * @param mainTree The tree where the values should be merged
 * @param mergeTree The tree to be merged into the mainTree
 */
function mergeSubtree(mainTree, mergeTree) {
    // Need to fix this recursively (and handle lookups)
    for (const [glyphId, value] of Object.entries(mergeTree.individual)) {
        // The main tree is guaranteed to have no overlaps between the
        // individual and range values, so if we match an invididual, there
        // must not be a range
        if (mainTree.individual[glyphId]) {
            mergeTreeEntry(mainTree.individual[glyphId], value);
        }
        else {
            let matched = false;
            for (const [index, { range, entry }] of mainTree.range.entries()) {
                const overlap = getIndividualOverlap(Number(glyphId), range);
                // Don't overlap
                if (overlap.both === null) {
                    continue;
                }
                matched = true;
                // If they overlap, we have to split the range and then
                // merge the overlap
                mainTree.individual[glyphId] = value;
                mergeTreeEntry(mainTree.individual[glyphId], cloneEntry(entry));
                // When there's an overlap, we also have to fix up the range
                // that we had already processed
                mainTree.range.splice(index, 1);
                for (const glyph of overlap.second) {
                    if (Array.isArray(glyph)) {
                        mainTree.range.push({
                            range: glyph,
                            entry: cloneEntry(entry)
                        });
                    }
                    else {
                        mainTree.individual[glyph] = cloneEntry(entry);
                    }
                }
            }
            if (!matched) {
                mainTree.individual[glyphId] = value;
            }
        }
    }
    for (const { range, entry } of mergeTree.range) {
        // Ranges are more complicated, because they can overlap with
        // multiple things, individual and range alike. We start by
        // eliminating ranges that are already present in another range
        let remainingRanges = [range];
        for (let index = 0; index < mainTree.range.length; index++) {
            const { range, entry: resultEntry } = mainTree.range[index];
            for (const [remainingIndex, remainingRange] of remainingRanges.entries()) {
                if (Array.isArray(remainingRange)) {
                    const overlap = getRangeOverlap(remainingRange, range);
                    if (overlap.both === null) {
                        continue;
                    }
                    mainTree.range.splice(index, 1);
                    index--;
                    const entryToMerge = cloneEntry(resultEntry);
                    if (Array.isArray(overlap.both)) {
                        mainTree.range.push({
                            range: overlap.both,
                            entry: entryToMerge
                        });
                    }
                    else {
                        mainTree.individual[overlap.both] = entryToMerge;
                    }
                    mergeTreeEntry(entryToMerge, cloneEntry(entry));
                    for (const second of overlap.second) {
                        if (Array.isArray(second)) {
                            mainTree.range.push({
                                range: second,
                                entry: cloneEntry(resultEntry)
                            });
                        }
                        else {
                            mainTree.individual[second] = cloneEntry(resultEntry);
                        }
                    }
                    remainingRanges = overlap.first;
                }
                else {
                    const overlap = getIndividualOverlap(remainingRange, range);
                    if (overlap.both === null) {
                        continue;
                    }
                    // If they overlap, we have to split the range and then
                    // merge the overlap
                    mainTree.individual[remainingRange] = cloneEntry(entry);
                    mergeTreeEntry(mainTree.individual[remainingRange], cloneEntry(resultEntry));
                    // When there's an overlap, we also have to fix up the range
                    // that we had already processed
                    mainTree.range.splice(index, 1);
                    index--;
                    for (const glyph of overlap.second) {
                        if (Array.isArray(glyph)) {
                            mainTree.range.push({
                                range: glyph,
                                entry: cloneEntry(resultEntry)
                            });
                        }
                        else {
                            mainTree.individual[glyph] = cloneEntry(resultEntry);
                        }
                    }
                    remainingRanges.splice(remainingIndex, 1, ...overlap.first);
                    break;
                }
            }
        }
        // Next, we run the same against any individual glyphs
        for (const glyphId of Object.keys(mainTree.individual)) {
            for (const [remainingIndex, remainingRange] of remainingRanges.entries()) {
                if (Array.isArray(remainingRange)) {
                    const overlap = getIndividualOverlap(Number(glyphId), remainingRange);
                    if (overlap.both === null) {
                        continue;
                    }
                    // If they overlap, we have to merge the overlap
                    mergeTreeEntry(mainTree.individual[glyphId], cloneEntry(entry));
                    // Update the remaining ranges
                    remainingRanges.splice(remainingIndex, 1, ...overlap.second);
                    break;
                }
                else {
                    if (Number(glyphId) === remainingRange) {
                        mergeTreeEntry(mainTree.individual[glyphId], cloneEntry(entry));
                        break;
                    }
                }
            }
        }
        // Any remaining ranges should just be added directly
        for (const remainingRange of remainingRanges) {
            if (Array.isArray(remainingRange)) {
                mainTree.range.push({
                    range: remainingRange,
                    entry: cloneEntry(entry)
                });
            }
            else {
                mainTree.individual[remainingRange] = cloneEntry(entry);
            }
        }
    }
}
/**
 * Recursively merges the entry forr the mergeTree into the mainTree
 *
 * @param mainTree The entry where the values should be merged
 * @param mergeTree The entry to merge into the mainTree
 */
function mergeTreeEntry(mainTree, mergeTree) {
    if (mergeTree.lookup && (!mainTree.lookup ||
        mainTree.lookup.index > mergeTree.lookup.index ||
        (mainTree.lookup.index === mergeTree.lookup.index && mainTree.lookup.subIndex > mergeTree.lookup.subIndex))) {
        mainTree.lookup = mergeTree.lookup;
    }
    if (mergeTree.forward) {
        if (!mainTree.forward) {
            mainTree.forward = mergeTree.forward;
        }
        else {
            mergeSubtree(mainTree.forward, mergeTree.forward);
        }
    }
    if (mergeTree.reverse) {
        if (!mainTree.reverse) {
            mainTree.reverse = mergeTree.reverse;
        }
        else {
            mergeSubtree(mainTree.reverse, mergeTree.reverse);
        }
    }
}
/**
 * Determines the overlap (if any) between two ranges. Returns the distinct
 * ranges for each range and the overlap (if any).
 *
 * @param first First range
 * @param second Second range
 */
function getRangeOverlap(first, second) {
    const result = {
        first: [],
        second: [],
        both: null
    };
    // Both
    if (first[0] < second[1] && second[0] < first[1]) {
        const start = Math.max(first[0], second[0]);
        const end = Math.min(first[1], second[1]);
        result.both = rangeOrIndividual(start, end);
    }
    // Before
    if (first[0] < second[0]) {
        const start = first[0];
        const end = Math.min(second[0], first[1]);
        result.first.push(rangeOrIndividual(start, end));
    }
    else if (second[0] < first[0]) {
        const start = second[0];
        const end = Math.min(second[1], first[0]);
        result.second.push(rangeOrIndividual(start, end));
    }
    // After
    if (first[1] > second[1]) {
        const start = Math.max(first[0], second[1]);
        const end = first[1];
        result.first.push(rangeOrIndividual(start, end));
    }
    else if (second[1] > first[1]) {
        const start = Math.max(first[1], second[0]);
        const end = second[1];
        result.second.push(rangeOrIndividual(start, end));
    }
    return result;
}
/**
 * Determines the overlap (if any) between the individual glyph and the range
 * provided. Returns the glyphs and/or ranges that are unique to each provided
 * and the overlap (if any).
 *
 * @param first Individual glyph
 * @param second Range
 */
function getIndividualOverlap(first, second) {
    // Disjoint
    if (first < second[0] || first > second[1]) {
        return {
            first: [first],
            second: [second],
            both: null
        };
    }
    const result = {
        first: [],
        second: [],
        both: first
    };
    if (second[0] < first) {
        result.second.push(rangeOrIndividual(second[0], first));
    }
    if (second[1] > first) {
        result.second.push(rangeOrIndividual(first + 1, second[1]));
    }
    return result;
}
/**
 * Returns an individual glyph if the range is of size one or a range if it is
 * larger.
 *
 * @param start Beginning of the range (inclusive)
 * @param end End of the range (exclusive)
 */
function rangeOrIndividual(start, end) {
    if (end - start === 1) {
        return start;
    }
    else {
        return [start, end];
    }
}
/**
 * Clones an individual lookup tree entry.
 *
 * @param entry Lookup tree entry to clone
 */
function cloneEntry(entry) {
    const result = {};
    if (entry.forward) {
        result.forward = cloneTree(entry.forward);
    }
    if (entry.reverse) {
        result.reverse = cloneTree(entry.reverse);
    }
    if (entry.lookup) {
        result.lookup = {
            contextRange: entry.lookup.contextRange.slice(),
            index: entry.lookup.index,
            length: entry.lookup.length,
            subIndex: entry.lookup.subIndex,
            substitutions: entry.lookup.substitutions.slice()
        };
    }
    return result;
}
/**
 * Clones a lookup tree.
 *
 * @param tree Lookup tree to clone
 */
function cloneTree(tree) {
    const individual = {};
    for (const [glyphId, entry] of Object.entries(tree.individual)) {
        individual[glyphId] = cloneEntry(entry);
    }
    return {
        individual,
        range: tree.range.map(({ range, entry }) => ({
            range: range.slice(),
            entry: cloneEntry(entry)
        }))
    };
}
//# sourceMappingURL=merge.js.map

/***/ }),

/***/ "./node_modules/font-ligatures/dist/mergeRange.js":
/*!********************************************************!*\
  !*** ./node_modules/font-ligatures/dist/mergeRange.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Merges the range defined by the provided start and end into the list of
 * existing ranges. The merge is done in place on the existing range for
 * performance and is also returned.
 *
 * @param ranges Existing range list
 * @param newRangeStart Start position of the range to merge, inclusive
 * @param newRangeEnd End position of range to merge, exclusive
 */
function mergeRange(ranges, newRangeStart, newRangeEnd) {
    let inRange = false;
    for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];
        if (!inRange) {
            if (newRangeEnd <= range[0]) {
                // Case 1: New range is before the search range
                ranges.splice(i, 0, [newRangeStart, newRangeEnd]);
                return ranges;
            }
            else if (newRangeEnd <= range[1]) {
                // Case 2: New range is either wholly contained within the
                // search range or overlaps with the front of it
                range[0] = Math.min(newRangeStart, range[0]);
                return ranges;
            }
            else if (newRangeStart < range[1]) {
                // Case 3: New range either wholly contains the search range
                // or overlaps with the end of it
                range[0] = Math.min(newRangeStart, range[0]);
                inRange = true;
            }
            else {
                // Case 4: New range starts after the search range
                continue;
            }
        }
        else {
            if (newRangeEnd <= range[0]) {
                // Case 5: New range extends from previous range but doesn't
                // reach the current one
                ranges[i - 1][1] = newRangeEnd;
                return ranges;
            }
            else if (newRangeEnd <= range[1]) {
                // Case 6: New range extends from prvious range into the
                // current range
                ranges[i - 1][1] = Math.max(newRangeEnd, range[1]);
                ranges.splice(i, 1);
                inRange = false;
                return ranges;
            }
            else {
                // Case 7: New range extends from previous range past the
                // end of the current range
                ranges.splice(i, 1);
                i--;
            }
        }
    }
    if (inRange) {
        // Case 8: New range extends past the last existing range
        ranges[ranges.length - 1][1] = newRangeEnd;
    }
    else {
        // Case 9: New range starts after the last existing range
        ranges.push([newRangeStart, newRangeEnd]);
    }
    return ranges;
}
exports.default = mergeRange;
//# sourceMappingURL=mergeRange.js.map

/***/ }),

/***/ "./node_modules/font-ligatures/dist/processors/6-1.js":
/*!************************************************************!*\
  !*** ./node_modules/font-ligatures/dist/processors/6-1.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const coverage_1 = __webpack_require__(/*! ./coverage */ "./node_modules/font-ligatures/dist/processors/coverage.js");
const helper_1 = __webpack_require__(/*! ./helper */ "./node_modules/font-ligatures/dist/processors/helper.js");
/**
 * Build lookup tree for GSUB lookup table 6, format 1.
 * https://docs.microsoft.com/en-us/typography/opentype/spec/gsub#61-chaining-context-substitution-format-1-simple-glyph-contexts
 *
 * @param table JSON representation of the table
 * @param lookups List of lookup tables
 * @param tableIndex Index of this table in the overall lookup
 */
function buildTree(table, lookups, tableIndex) {
    const result = {
        individual: {},
        range: []
    };
    const firstGlyphs = coverage_1.listGlyphsByIndex(table.coverage);
    for (const { glyphId, index } of firstGlyphs) {
        const chainRuleSet = table.chainRuleSets[index];
        // If the chain rule set is null there's nothing to do with this table.
        if (!chainRuleSet) {
            continue;
        }
        for (const [subIndex, subTable] of chainRuleSet.entries()) {
            let currentEntries = helper_1.getInputTree(result, subTable.lookupRecords, lookups, 0, glyphId).map(({ entry, substitution }) => ({ entry, substitutions: [substitution] }));
            // We walk forward, then backward
            for (const [index, glyph] of subTable.input.entries()) {
                currentEntries = helper_1.processInputPosition([glyph], index + 1, currentEntries, subTable.lookupRecords, lookups);
            }
            for (const glyph of subTable.lookahead) {
                currentEntries = helper_1.processLookaheadPosition([glyph], currentEntries);
            }
            for (const glyph of subTable.backtrack) {
                currentEntries = helper_1.processBacktrackPosition([glyph], currentEntries);
            }
            // When we get to the end, insert the lookup information
            for (const { entry, substitutions } of currentEntries) {
                entry.lookup = {
                    substitutions,
                    length: subTable.input.length + 1,
                    index: tableIndex,
                    subIndex,
                    contextRange: [
                        -1 * subTable.backtrack.length,
                        1 + subTable.input.length + subTable.lookahead.length
                    ]
                };
            }
        }
    }
    return result;
}
exports.default = buildTree;
//# sourceMappingURL=6-1.js.map

/***/ }),

/***/ "./node_modules/font-ligatures/dist/processors/6-2.js":
/*!************************************************************!*\
  !*** ./node_modules/font-ligatures/dist/processors/6-2.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const merge_1 = __webpack_require__(/*! ../merge */ "./node_modules/font-ligatures/dist/merge.js");
const coverage_1 = __webpack_require__(/*! ./coverage */ "./node_modules/font-ligatures/dist/processors/coverage.js");
const classDef_1 = __webpack_require__(/*! ./classDef */ "./node_modules/font-ligatures/dist/processors/classDef.js");
const helper_1 = __webpack_require__(/*! ./helper */ "./node_modules/font-ligatures/dist/processors/helper.js");
/**
 * Build lookup tree for GSUB lookup table 6, format 2.
 * https://docs.microsoft.com/en-us/typography/opentype/spec/gsub#62-chaining-context-substitution-format-2-class-based-glyph-contexts
 *
 * @param table JSON representation of the table
 * @param lookups List of lookup tables
 * @param tableIndex Index of this table in the overall lookup
 */
function buildTree(table, lookups, tableIndex) {
    const results = [];
    const firstGlyphs = coverage_1.listGlyphsByIndex(table.coverage);
    for (const { glyphId } of firstGlyphs) {
        const firstInputClass = classDef_1.default(table.inputClassDef, glyphId);
        for (const [glyphId, inputClass] of firstInputClass.entries()) {
            // istanbul ignore next - invalid font
            if (inputClass === null) {
                continue;
            }
            const classSet = table.chainClassSet[inputClass];
            // If the class set is null there's nothing to do with this table.
            if (!classSet) {
                continue;
            }
            for (const [subIndex, subTable] of classSet.entries()) {
                const result = {
                    individual: {},
                    range: []
                };
                let currentEntries = helper_1.getInputTree(result, subTable.lookupRecords, lookups, 0, glyphId).map(({ entry, substitution }) => ({ entry, substitutions: [substitution] }));
                for (const [index, classNum] of subTable.input.entries()) {
                    currentEntries = helper_1.processInputPosition(classDef_1.listClassGlyphs(table.inputClassDef, classNum), index + 1, currentEntries, subTable.lookupRecords, lookups);
                }
                for (const classNum of subTable.lookahead) {
                    currentEntries = helper_1.processLookaheadPosition(classDef_1.listClassGlyphs(table.lookaheadClassDef, classNum), currentEntries);
                }
                for (const classNum of subTable.backtrack) {
                    currentEntries = helper_1.processBacktrackPosition(classDef_1.listClassGlyphs(table.backtrackClassDef, classNum), currentEntries);
                }
                // When we get to the end, all of the entries we've accumulated
                // should have a lookup defined
                for (const { entry, substitutions } of currentEntries) {
                    entry.lookup = {
                        substitutions,
                        index: tableIndex,
                        subIndex,
                        length: subTable.input.length + 1,
                        contextRange: [
                            -1 * subTable.backtrack.length,
                            1 + subTable.input.length + subTable.lookahead.length
                        ]
                    };
                }
                results.push(result);
            }
        }
    }
    return merge_1.default(results);
}
exports.default = buildTree;
//# sourceMappingURL=6-2.js.map

/***/ }),

/***/ "./node_modules/font-ligatures/dist/processors/6-3.js":
/*!************************************************************!*\
  !*** ./node_modules/font-ligatures/dist/processors/6-3.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const coverage_1 = __webpack_require__(/*! ./coverage */ "./node_modules/font-ligatures/dist/processors/coverage.js");
const helper_1 = __webpack_require__(/*! ./helper */ "./node_modules/font-ligatures/dist/processors/helper.js");
/**
 * Build lookup tree for GSUB lookup table 6, format 3.
 * https://docs.microsoft.com/en-us/typography/opentype/spec/gsub#63-chaining-context-substitution-format-3-coverage-based-glyph-contexts
 *
 * @param table JSON representation of the table
 * @param lookups List of lookup tables
 * @param tableIndex Index of this table in the overall lookup
 */
function buildTree(table, lookups, tableIndex) {
    const result = {
        individual: {},
        range: []
    };
    const firstGlyphs = coverage_1.listGlyphsByIndex(table.inputCoverage[0]);
    for (const { glyphId } of firstGlyphs) {
        let currentEntries = helper_1.getInputTree(result, table.lookupRecords, lookups, 0, glyphId).map(({ entry, substitution }) => ({ entry, substitutions: [substitution] }));
        for (const [index, coverage] of table.inputCoverage.slice(1).entries()) {
            currentEntries = helper_1.processInputPosition(coverage_1.listGlyphsByIndex(coverage).map(glyph => glyph.glyphId), index + 1, currentEntries, table.lookupRecords, lookups);
        }
        for (const coverage of table.lookaheadCoverage) {
            currentEntries = helper_1.processLookaheadPosition(coverage_1.listGlyphsByIndex(coverage).map(glyph => glyph.glyphId), currentEntries);
        }
        for (const coverage of table.backtrackCoverage) {
            currentEntries = helper_1.processBacktrackPosition(coverage_1.listGlyphsByIndex(coverage).map(glyph => glyph.glyphId), currentEntries);
        }
        // When we get to the end, all of the entries we've accumulated
        // should have a lookup defined
        for (const { entry, substitutions } of currentEntries) {
            entry.lookup = {
                substitutions,
                index: tableIndex,
                subIndex: 0,
                length: table.inputCoverage.length,
                contextRange: [
                    -1 * table.backtrackCoverage.length,
                    table.inputCoverage.length + table.lookaheadCoverage.length
                ]
            };
        }
    }
    return result;
}
exports.default = buildTree;
//# sourceMappingURL=6-3.js.map

/***/ }),

/***/ "./node_modules/font-ligatures/dist/processors/8-1.js":
/*!************************************************************!*\
  !*** ./node_modules/font-ligatures/dist/processors/8-1.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const coverage_1 = __webpack_require__(/*! ./coverage */ "./node_modules/font-ligatures/dist/processors/coverage.js");
const helper_1 = __webpack_require__(/*! ./helper */ "./node_modules/font-ligatures/dist/processors/helper.js");
/**
 * Build lookup tree for GSUB lookup table 8, format 1.
 * https://docs.microsoft.com/en-us/typography/opentype/spec/gsub#81-reverse-chaining-contextual-single-substitution-format-1-coverage-based-glyph-contexts
 *
 * @param table JSON representation of the table
 * @param tableIndex Index of this table in the overall lookup
 */
function buildTree(table, tableIndex) {
    const result = {
        individual: {},
        range: []
    };
    const glyphs = coverage_1.listGlyphsByIndex(table.coverage);
    for (const { glyphId, index } of glyphs) {
        const initialEntry = {};
        if (Array.isArray(glyphId)) {
            result.range.push({
                entry: initialEntry,
                range: glyphId
            });
        }
        else {
            result.individual[glyphId] = initialEntry;
        }
        let currentEntries = [{
                entry: initialEntry,
                substitutions: [table.substitutes[index]]
            }];
        // We walk forward, then backward
        for (const coverage of table.lookaheadCoverage) {
            currentEntries = helper_1.processLookaheadPosition(coverage_1.listGlyphsByIndex(coverage).map(glyph => glyph.glyphId), currentEntries);
        }
        for (const coverage of table.backtrackCoverage) {
            currentEntries = helper_1.processBacktrackPosition(coverage_1.listGlyphsByIndex(coverage).map(glyph => glyph.glyphId), currentEntries);
        }
        // When we get to the end, insert the lookup information
        for (const { entry, substitutions } of currentEntries) {
            entry.lookup = {
                substitutions,
                index: tableIndex,
                subIndex: 0,
                length: 1,
                contextRange: [
                    -1 * table.backtrackCoverage.length,
                    1 + table.lookaheadCoverage.length
                ]
            };
        }
    }
    return result;
}
exports.default = buildTree;
//# sourceMappingURL=8-1.js.map

/***/ }),

/***/ "./node_modules/font-ligatures/dist/processors/classDef.js":
/*!*****************************************************************!*\
  !*** ./node_modules/font-ligatures/dist/processors/classDef.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Get the number of the class to which the glyph belongs, or null if it doesn't
 * belong to any of them.
 *
 * @param table JSON representation of the class def table
 * @param glyphId Index of the glyph to look for
 */
function getGlyphClass(table, glyphId) {
    switch (table.format) {
        // https://docs.microsoft.com/en-us/typography/opentype/spec/chapter2#class-definition-table-format-2
        case 2:
            if (Array.isArray(glyphId)) {
                return getRangeGlyphClass(table, glyphId);
            }
            else {
                return new Map([[
                        glyphId,
                        getIndividualGlyphClass(table, glyphId)
                    ]]);
            }
        // https://docs.microsoft.com/en-us/typography/opentype/spec/chapter2#class-definition-table-format-1
        default:
            return new Map([[glyphId, null]]);
    }
}
exports.default = getGlyphClass;
function getRangeGlyphClass(table, glyphId) {
    let classStart = glyphId[0];
    let currentClass = getIndividualGlyphClass(table, classStart);
    let search = glyphId[0] + 1;
    const result = new Map();
    while (search < glyphId[1]) {
        const clazz = getIndividualGlyphClass(table, search);
        if (clazz !== currentClass) {
            if (search - classStart <= 1) {
                result.set(classStart, currentClass);
            }
            else {
                result.set([classStart, search], currentClass);
            }
        }
    }
    if (search - classStart <= 1) {
        result.set(classStart, currentClass);
    }
    else {
        result.set([classStart, search], currentClass);
    }
    return result;
}
function getIndividualGlyphClass(table, glyphId) {
    for (const range of table.ranges) {
        if (range.start <= glyphId && range.end >= glyphId) {
            return range.classId;
        }
    }
    return null;
}
function listClassGlyphs(table, index) {
    switch (table.format) {
        case 2:
            const results = [];
            for (const range of table.ranges) {
                if (range.classId !== index) {
                    continue;
                }
                if (range.end === range.start) {
                    results.push(range.start);
                }
                else {
                    results.push([range.start, range.end + 1]);
                }
            }
            return results;
        default:
            return [];
    }
}
exports.listClassGlyphs = listClassGlyphs;
//# sourceMappingURL=classDef.js.map

/***/ }),

/***/ "./node_modules/font-ligatures/dist/processors/coverage.js":
/*!*****************************************************************!*\
  !*** ./node_modules/font-ligatures/dist/processors/coverage.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Get the index of the given glyph in the coverage table, or null if it is not
 * present in the table.
 *
 * @param table JSON representation of the coverage table
 * @param glyphId Index of the glyph to look for
 */
function getCoverageGlyphIndex(table, glyphId) {
    switch (table.format) {
        // https://docs.microsoft.com/en-us/typography/opentype/spec/chapter2#coverage-format-1
        case 1:
            const index = table.glyphs.indexOf(glyphId);
            return index !== -1
                ? index
                : null;
        // https://docs.microsoft.com/en-us/typography/opentype/spec/chapter2#coverage-format-2
        case 2:
            const range = table.ranges
                .find(range => range.start <= glyphId && range.end >= glyphId);
            return range
                ? range.index
                : null;
    }
}
exports.default = getCoverageGlyphIndex;
function listGlyphsByIndex(table) {
    switch (table.format) {
        case 1:
            return table.glyphs.map((glyphId, index) => ({ glyphId, index }));
        case 2:
            let results = [];
            for (const [index, range] of table.ranges.entries()) {
                if (range.end === range.start) {
                    results.push({ glyphId: range.start, index });
                }
                else {
                    results.push({ glyphId: [range.start, range.end + 1], index });
                }
            }
            return results;
    }
}
exports.listGlyphsByIndex = listGlyphsByIndex;
//# sourceMappingURL=coverage.js.map

/***/ }),

/***/ "./node_modules/font-ligatures/dist/processors/helper.js":
/*!***************************************************************!*\
  !*** ./node_modules/font-ligatures/dist/processors/helper.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const substitution_1 = __webpack_require__(/*! ./substitution */ "./node_modules/font-ligatures/dist/processors/substitution.js");
function processInputPosition(glyphs, position, currentEntries, lookupRecords, lookups) {
    const nextEntries = [];
    for (const currentEntry of currentEntries) {
        currentEntry.entry.forward = {
            individual: {},
            range: []
        };
        for (const glyph of glyphs) {
            nextEntries.push(...getInputTree(currentEntry.entry.forward, lookupRecords, lookups, position, glyph).map(({ entry, substitution }) => ({
                entry,
                substitutions: [...currentEntry.substitutions, substitution]
            })));
        }
    }
    return nextEntries;
}
exports.processInputPosition = processInputPosition;
function processLookaheadPosition(glyphs, currentEntries) {
    const nextEntries = [];
    for (const currentEntry of currentEntries) {
        for (const glyph of glyphs) {
            const entry = {};
            if (!currentEntry.entry.forward) {
                currentEntry.entry.forward = {
                    individual: {},
                    range: []
                };
            }
            nextEntries.push({
                entry,
                substitutions: currentEntry.substitutions
            });
            if (Array.isArray(glyph)) {
                currentEntry.entry.forward.range.push({
                    entry,
                    range: glyph
                });
            }
            else {
                currentEntry.entry.forward.individual[glyph] = entry;
            }
        }
    }
    return nextEntries;
}
exports.processLookaheadPosition = processLookaheadPosition;
function processBacktrackPosition(glyphs, currentEntries) {
    const nextEntries = [];
    for (const currentEntry of currentEntries) {
        for (const glyph of glyphs) {
            const entry = {};
            if (!currentEntry.entry.reverse) {
                currentEntry.entry.reverse = {
                    individual: {},
                    range: []
                };
            }
            nextEntries.push({
                entry,
                substitutions: currentEntry.substitutions
            });
            if (Array.isArray(glyph)) {
                currentEntry.entry.reverse.range.push({
                    entry,
                    range: glyph
                });
            }
            else {
                currentEntry.entry.reverse.individual[glyph] = entry;
            }
        }
    }
    return nextEntries;
}
exports.processBacktrackPosition = processBacktrackPosition;
function getInputTree(tree, substitutions, lookups, inputIndex, glyphId) {
    const result = [];
    if (!Array.isArray(glyphId)) {
        tree.individual[glyphId] = {};
        result.push({
            entry: tree.individual[glyphId],
            substitution: getSubstitutionAtPosition(substitutions, lookups, inputIndex, glyphId)
        });
    }
    else {
        const subs = getSubstitutionAtPositionRange(substitutions, lookups, inputIndex, glyphId);
        for (const [range, substitution] of subs) {
            const entry = {};
            if (Array.isArray(range)) {
                tree.range.push({ range, entry });
            }
            else {
                tree.individual[range] = {};
            }
            result.push({ entry, substitution });
        }
    }
    return result;
}
exports.getInputTree = getInputTree;
function getSubstitutionAtPositionRange(substitutions, lookups, index, range) {
    for (const substitution of substitutions.filter(s => s.sequenceIndex === index)) {
        for (const substitutionTable of lookups[substitution.lookupListIndex].subtables) {
            const sub = substitution_1.getRangeSubstitutionGlyphs(substitutionTable, range);
            if (!Array.from(sub.values()).every(val => val !== null)) {
                return sub;
            }
        }
    }
    return new Map([[range, null]]);
}
function getSubstitutionAtPosition(substitutions, lookups, index, glyphId) {
    for (const substitution of substitutions.filter(s => s.sequenceIndex === index)) {
        for (const substitutionTable of lookups[substitution.lookupListIndex].subtables) {
            const sub = substitution_1.getIndividualSubstitutionGlyph(substitutionTable, glyphId);
            if (sub !== null) {
                return sub;
            }
        }
    }
    return null;
}
//# sourceMappingURL=helper.js.map

/***/ }),

/***/ "./node_modules/font-ligatures/dist/processors/substitution.js":
/*!*********************************************************************!*\
  !*** ./node_modules/font-ligatures/dist/processors/substitution.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const coverage_1 = __webpack_require__(/*! ./coverage */ "./node_modules/font-ligatures/dist/processors/coverage.js");
/**
 * Get the substitution glyph for the givne glyph, or null if the glyph was not
 * found in the table.
 *
 * @param table JSON representation of the substitution table
 * @param glyphId The index of the glpyh to find substitutions for
 */
function getRangeSubstitutionGlyphs(table, glyphId) {
    let replacementStart = glyphId[0];
    let currentReplacement = getIndividualSubstitutionGlyph(table, replacementStart);
    let search = glyphId[0] + 1;
    const result = new Map();
    while (search < glyphId[1]) {
        const sub = getIndividualSubstitutionGlyph(table, search);
        if (sub !== currentReplacement) {
            if (search - replacementStart <= 1) {
                result.set(replacementStart, currentReplacement);
            }
            else {
                result.set([replacementStart, search], currentReplacement);
            }
        }
        search++;
    }
    if (search - replacementStart <= 1) {
        result.set(replacementStart, currentReplacement);
    }
    else {
        result.set([replacementStart, search], currentReplacement);
    }
    return result;
}
exports.getRangeSubstitutionGlyphs = getRangeSubstitutionGlyphs;
function getIndividualSubstitutionGlyph(table, glyphId) {
    const coverageIndex = coverage_1.default(table.coverage, glyphId);
    // istanbul ignore next - invalid font
    if (coverageIndex === null) {
        return null;
    }
    switch (table.substFormat) {
        // https://docs.microsoft.com/en-us/typography/opentype/spec/gsub#11-single-substitution-format-1
        case 1:
            // TODO: determine if there's a rhyme or reason to the 16-bit
            // wraparound and if it can ever be a different number
            return (glyphId + table.deltaGlyphId) % (2 ** 16);
        // https://docs.microsoft.com/en-us/typography/opentype/spec/gsub#12-single-substitution-format-2
        case 2:
            // tslint:disable-next-line
            return table.substitute[coverageIndex] != null
                ? table.substitute[coverageIndex]
                : null;
    }
}
exports.getIndividualSubstitutionGlyph = getIndividualSubstitutionGlyph;
//# sourceMappingURL=substitution.js.map

/***/ }),

/***/ "./node_modules/font-ligatures/dist/walk.js":
/*!**************************************************!*\
  !*** ./node_modules/font-ligatures/dist/walk.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function walkTree(tree, sequence, startIndex, index) {
    const glyphId = sequence[index];
    let subtree = tree[glyphId];
    if (!subtree) {
        return undefined;
    }
    let lookup = subtree.lookup;
    if (subtree.reverse) {
        const reverseLookup = walkReverse(subtree.reverse, sequence, startIndex);
        if ((!lookup && reverseLookup) ||
            (reverseLookup && lookup && (lookup.index > reverseLookup.index ||
                (lookup.index === reverseLookup.index && lookup.subIndex > reverseLookup.subIndex)))) {
            lookup = reverseLookup;
        }
    }
    if (++index >= sequence.length || !subtree.forward) {
        return lookup;
    }
    const forwardLookup = walkTree(subtree.forward, sequence, startIndex, index);
    if ((!lookup && forwardLookup) ||
        (forwardLookup && lookup && (lookup.index > forwardLookup.index ||
            (lookup.index === forwardLookup.index && lookup.subIndex > forwardLookup.subIndex)))) {
        lookup = forwardLookup;
    }
    return lookup;
}
exports.default = walkTree;
function walkReverse(tree, sequence, index) {
    let subtree = tree[sequence[--index]];
    let lookup = subtree && subtree.lookup;
    while (subtree) {
        if ((!lookup && subtree.lookup) ||
            (subtree.lookup && lookup && lookup.index > subtree.lookup.index)) {
            lookup = subtree.lookup;
        }
        if (--index < 0 || !subtree.reverse) {
            break;
        }
        subtree = subtree.reverse[sequence[index]];
    }
    return lookup;
}
//# sourceMappingURL=walk.js.map

/***/ }),

/***/ "./node_modules/get-system-fonts/dist/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/get-system-fonts/dist/index.js ***!
  \*****************************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const path = __webpack_require__(/*! path */ "?34bb");
const os = __webpack_require__(/*! os */ "?a202");
const recursiveWalk_1 = __webpack_require__(/*! ./recursiveWalk */ "./node_modules/get-system-fonts/dist/recursiveWalk.js");
const directories = {
    win32: () => {
        const globalDir = path.join(process.env.WINDIR || 'C:\\Windows', 'Fonts');
        const appDataDir = 'Microsoft\\Windows\\Fonts';
        let localDir;
        if (process.env.LOCALAPPDATA) {
            localDir = path.join(process.env.LOCALAPPDATA, appDataDir);
        }
        else if (process.env.APPDATA) {
            localDir = path.join(process.env.APPDATA, 'Local', appDataDir);
        }
        else if (process.env.USERPROFILE) {
            localDir = path.join(process.env.USERPROFILE, 'AppData', 'Local', appDataDir);
        }
        if (localDir) {
            return [globalDir, localDir];
        }
        else {
            return [globalDir];
        }
    },
    darwin: () => {
        const home = os.homedir();
        const userFolders = home
            ? [path.join(home, '/Library/Fonts')]
            : [];
        return [
            ...userFolders,
            '/Library/Fonts',
            '/Network/Library/Fonts',
            '/System/Library/Fonts',
            '/System Folder/Fonts'
        ];
    },
    linux: () => {
        const home = os.homedir();
        const userFolders = home
            ? [
                path.join(home, '.fonts'),
                path.join(home, '.local/share/fonts')
            ]
            : [];
        return [
            // TODO: use fontconfig to find the folder locations
            '/usr/share/fonts',
            '/usr/local/share/fonts',
            ...userFolders
        ];
    }
};
/**
 * List absolute paths to all installed system fonts present.
 *
 * @param options Configuration options
 */
function getSystemFonts(options) {
    const opts = Object.assign({ extensions: ['ttf', 'otf', 'ttc', 'woff', 'woff2'], additionalFolders: [] }, options);
    const platform = os.platform();
    const getDirs = directories[platform];
    if (!getDirs) {
        throw new Error(`Unsupported platform: ${platform}`);
    }
    const dirs = getDirs();
    return recursiveWalk_1.default([...dirs, ...opts.additionalFolders], opts.extensions);
}
module.exports = Object.assign(getSystemFonts, { default: getSystemFonts });
exports.default = getSystemFonts;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/get-system-fonts/dist/recursiveWalk.js":
/*!*************************************************************!*\
  !*** ./node_modules/get-system-fonts/dist/recursiveWalk.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const fs = __webpack_require__(/*! fs */ "?aaef");
const util = __webpack_require__(/*! util */ "?c2fa");
const path = __webpack_require__(/*! path */ "?34bb");
const readdirAsync = util.promisify(fs.readdir);
const statAsync = util.promisify(fs.stat);
/**
 * Recursively scans the list of directories for files with one of the provided
 * extensions.
 *
 * @param baseDirs Directories to search for files
 * @param extensions List of valid extensions that files may have
 */
async function recursiveWalk(baseDirs, extensions) {
    // We put the results in a set to ensure there are no duplicates
    const results = new Set();
    await Promise.all(baseDirs.map(async (baseDir) => {
        const files = await recursiveWalkInternal(path.resolve(baseDir), new RegExp(`\\.${extensions.map(ext => `(?:${ext})`).join('|')}$`, 'i'));
        for (const file of files) {
            results.add(file);
        }
    }));
    return [...results];
}
exports.default = recursiveWalk;
/**
 * Recursively walk the filesystem to find files with the proper extensions.
 *
 * @param baseDir The fully resolved starting directory (absolute path)
 * @param extensionRegex Regular expression to verify the file extension
 * @param maxDepth The maximum number of recursive calls to make before stopping
 */
async function recursiveWalkInternal(baseDir, extensionRegex, maxDepth = 10) {
    if (maxDepth <= 0) {
        return [];
    }
    let entries;
    try {
        entries = await readdirAsync(baseDir);
    }
    catch (_a) {
        return [];
    }
    // We collect the results up in this array as we find them rather than
    // mapping/reducing the data to avoid the cost of creating and concatenating
    // intermediate arrays.
    const results = [];
    await Promise.all(entries.map(async (entry) => {
        const entryPath = path.join(baseDir, entry);
        let stats;
        try {
            stats = await statAsync(entryPath);
        }
        catch (_a) {
            return;
        }
        if (stats.isFile() && extensionRegex.test(entryPath)) {
            results.push(entryPath);
        }
        else if (stats.isDirectory()) {
            results.push(...await recursiveWalkInternal(entryPath, extensionRegex, maxDepth - 1));
        }
    }));
    return results;
}
//# sourceMappingURL=recursiveWalk.js.map

/***/ }),

/***/ "./node_modules/lru-cache/index.js":
/*!*****************************************!*\
  !*** ./node_modules/lru-cache/index.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// A linked list to keep track of recently-used-ness
const Yallist = __webpack_require__(/*! yallist */ "./node_modules/yallist/yallist.js")

const MAX = Symbol('max')
const LENGTH = Symbol('length')
const LENGTH_CALCULATOR = Symbol('lengthCalculator')
const ALLOW_STALE = Symbol('allowStale')
const MAX_AGE = Symbol('maxAge')
const DISPOSE = Symbol('dispose')
const NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet')
const LRU_LIST = Symbol('lruList')
const CACHE = Symbol('cache')
const UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet')

const naiveLength = () => 1

// lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.
class LRUCache {
  constructor (options) {
    if (typeof options === 'number')
      options = { max: options }

    if (!options)
      options = {}

    if (options.max && (typeof options.max !== 'number' || options.max < 0))
      throw new TypeError('max must be a non-negative number')
    // Kind of weird to have a default max of Infinity, but oh well.
    const max = this[MAX] = options.max || Infinity

    const lc = options.length || naiveLength
    this[LENGTH_CALCULATOR] = (typeof lc !== 'function') ? naiveLength : lc
    this[ALLOW_STALE] = options.stale || false
    if (options.maxAge && typeof options.maxAge !== 'number')
      throw new TypeError('maxAge must be a number')
    this[MAX_AGE] = options.maxAge || 0
    this[DISPOSE] = options.dispose
    this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false
    this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false
    this.reset()
  }

  // resize the cache when the max changes.
  set max (mL) {
    if (typeof mL !== 'number' || mL < 0)
      throw new TypeError('max must be a non-negative number')

    this[MAX] = mL || Infinity
    trim(this)
  }
  get max () {
    return this[MAX]
  }

  set allowStale (allowStale) {
    this[ALLOW_STALE] = !!allowStale
  }
  get allowStale () {
    return this[ALLOW_STALE]
  }

  set maxAge (mA) {
    if (typeof mA !== 'number')
      throw new TypeError('maxAge must be a non-negative number')

    this[MAX_AGE] = mA
    trim(this)
  }
  get maxAge () {
    return this[MAX_AGE]
  }

  // resize the cache when the lengthCalculator changes.
  set lengthCalculator (lC) {
    if (typeof lC !== 'function')
      lC = naiveLength

    if (lC !== this[LENGTH_CALCULATOR]) {
      this[LENGTH_CALCULATOR] = lC
      this[LENGTH] = 0
      this[LRU_LIST].forEach(hit => {
        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key)
        this[LENGTH] += hit.length
      })
    }
    trim(this)
  }
  get lengthCalculator () { return this[LENGTH_CALCULATOR] }

  get length () { return this[LENGTH] }
  get itemCount () { return this[LRU_LIST].length }

  rforEach (fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].tail; walker !== null;) {
      const prev = walker.prev
      forEachStep(this, fn, walker, thisp)
      walker = prev
    }
  }

  forEach (fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].head; walker !== null;) {
      const next = walker.next
      forEachStep(this, fn, walker, thisp)
      walker = next
    }
  }

  keys () {
    return this[LRU_LIST].toArray().map(k => k.key)
  }

  values () {
    return this[LRU_LIST].toArray().map(k => k.value)
  }

  reset () {
    if (this[DISPOSE] &&
        this[LRU_LIST] &&
        this[LRU_LIST].length) {
      this[LRU_LIST].forEach(hit => this[DISPOSE](hit.key, hit.value))
    }

    this[CACHE] = new Map() // hash of items by key
    this[LRU_LIST] = new Yallist() // list of items in order of use recency
    this[LENGTH] = 0 // length of items in the list
  }

  dump () {
    return this[LRU_LIST].map(hit =>
      isStale(this, hit) ? false : {
        k: hit.key,
        v: hit.value,
        e: hit.now + (hit.maxAge || 0)
      }).toArray().filter(h => h)
  }

  dumpLru () {
    return this[LRU_LIST]
  }

  set (key, value, maxAge) {
    maxAge = maxAge || this[MAX_AGE]

    if (maxAge && typeof maxAge !== 'number')
      throw new TypeError('maxAge must be a number')

    const now = maxAge ? Date.now() : 0
    const len = this[LENGTH_CALCULATOR](value, key)

    if (this[CACHE].has(key)) {
      if (len > this[MAX]) {
        del(this, this[CACHE].get(key))
        return false
      }

      const node = this[CACHE].get(key)
      const item = node.value

      // dispose of the old one before overwriting
      // split out into 2 ifs for better coverage tracking
      if (this[DISPOSE]) {
        if (!this[NO_DISPOSE_ON_SET])
          this[DISPOSE](key, item.value)
      }

      item.now = now
      item.maxAge = maxAge
      item.value = value
      this[LENGTH] += len - item.length
      item.length = len
      this.get(key)
      trim(this)
      return true
    }

    const hit = new Entry(key, value, len, now, maxAge)

    // oversized objects fall out of cache automatically.
    if (hit.length > this[MAX]) {
      if (this[DISPOSE])
        this[DISPOSE](key, value)

      return false
    }

    this[LENGTH] += hit.length
    this[LRU_LIST].unshift(hit)
    this[CACHE].set(key, this[LRU_LIST].head)
    trim(this)
    return true
  }

  has (key) {
    if (!this[CACHE].has(key)) return false
    const hit = this[CACHE].get(key).value
    return !isStale(this, hit)
  }

  get (key) {
    return get(this, key, true)
  }

  peek (key) {
    return get(this, key, false)
  }

  pop () {
    const node = this[LRU_LIST].tail
    if (!node)
      return null

    del(this, node)
    return node.value
  }

  del (key) {
    del(this, this[CACHE].get(key))
  }

  load (arr) {
    // reset the cache
    this.reset()

    const now = Date.now()
    // A previous serialized cache has the most recent items first
    for (let l = arr.length - 1; l >= 0; l--) {
      const hit = arr[l]
      const expiresAt = hit.e || 0
      if (expiresAt === 0)
        // the item was created without expiration in a non aged cache
        this.set(hit.k, hit.v)
      else {
        const maxAge = expiresAt - now
        // dont add already expired items
        if (maxAge > 0) {
          this.set(hit.k, hit.v, maxAge)
        }
      }
    }
  }

  prune () {
    this[CACHE].forEach((value, key) => get(this, key, false))
  }
}

const get = (self, key, doUse) => {
  const node = self[CACHE].get(key)
  if (node) {
    const hit = node.value
    if (isStale(self, hit)) {
      del(self, node)
      if (!self[ALLOW_STALE])
        return undefined
    } else {
      if (doUse) {
        if (self[UPDATE_AGE_ON_GET])
          node.value.now = Date.now()
        self[LRU_LIST].unshiftNode(node)
      }
    }
    return hit.value
  }
}

const isStale = (self, hit) => {
  if (!hit || (!hit.maxAge && !self[MAX_AGE]))
    return false

  const diff = Date.now() - hit.now
  return hit.maxAge ? diff > hit.maxAge
    : self[MAX_AGE] && (diff > self[MAX_AGE])
}

const trim = self => {
  if (self[LENGTH] > self[MAX]) {
    for (let walker = self[LRU_LIST].tail;
      self[LENGTH] > self[MAX] && walker !== null;) {
      // We know that we're about to delete this one, and also
      // what the next least recently used key will be, so just
      // go ahead and set it now.
      const prev = walker.prev
      del(self, walker)
      walker = prev
    }
  }
}

const del = (self, node) => {
  if (node) {
    const hit = node.value
    if (self[DISPOSE])
      self[DISPOSE](hit.key, hit.value)

    self[LENGTH] -= hit.length
    self[CACHE].delete(hit.key)
    self[LRU_LIST].removeNode(node)
  }
}

class Entry {
  constructor (key, value, length, now, maxAge) {
    this.key = key
    this.value = value
    this.length = length
    this.now = now
    this.maxAge = maxAge || 0
  }
}

const forEachStep = (self, fn, node, thisp) => {
  let hit = node.value
  if (isStale(self, hit)) {
    del(self, node)
    if (!self[ALLOW_STALE])
      hit = undefined
  }
  if (hit)
    fn.call(thisp, hit.value, hit.key, self)
}

module.exports = LRUCache


/***/ }),

/***/ "./node_modules/opentype.js/src/bbox.js":
/*!**********************************************!*\
  !*** ./node_modules/opentype.js/src/bbox.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// The Bounding Box object

function derive(v0, v1, v2, v3, t) {
    return Math.pow(1 - t, 3) * v0 +
        3 * Math.pow(1 - t, 2) * t * v1 +
        3 * (1 - t) * Math.pow(t, 2) * v2 +
        Math.pow(t, 3) * v3;
}
/**
 * A bounding box is an enclosing box that describes the smallest measure within which all the points lie.
 * It is used to calculate the bounding box of a glyph or text path.
 *
 * On initialization, x1/y1/x2/y2 will be NaN. Check if the bounding box is empty using `isEmpty()`.
 *
 * @exports opentype.BoundingBox
 * @class
 * @constructor
 */
function BoundingBox() {
    this.x1 = Number.NaN;
    this.y1 = Number.NaN;
    this.x2 = Number.NaN;
    this.y2 = Number.NaN;
}

/**
 * Returns true if the bounding box is empty, that is, no points have been added to the box yet.
 */
BoundingBox.prototype.isEmpty = function() {
    return isNaN(this.x1) || isNaN(this.y1) || isNaN(this.x2) || isNaN(this.y2);
};

/**
 * Add the point to the bounding box.
 * The x1/y1/x2/y2 coordinates of the bounding box will now encompass the given point.
 * @param {number} x - The X coordinate of the point.
 * @param {number} y - The Y coordinate of the point.
 */
BoundingBox.prototype.addPoint = function(x, y) {
    if (typeof x === 'number') {
        if (isNaN(this.x1) || isNaN(this.x2)) {
            this.x1 = x;
            this.x2 = x;
        }
        if (x < this.x1) {
            this.x1 = x;
        }
        if (x > this.x2) {
            this.x2 = x;
        }
    }
    if (typeof y === 'number') {
        if (isNaN(this.y1) || isNaN(this.y2)) {
            this.y1 = y;
            this.y2 = y;
        }
        if (y < this.y1) {
            this.y1 = y;
        }
        if (y > this.y2) {
            this.y2 = y;
        }
    }
};

/**
 * Add a X coordinate to the bounding box.
 * This extends the bounding box to include the X coordinate.
 * This function is used internally inside of addBezier.
 * @param {number} x - The X coordinate of the point.
 */
BoundingBox.prototype.addX = function(x) {
    this.addPoint(x, null);
};

/**
 * Add a Y coordinate to the bounding box.
 * This extends the bounding box to include the Y coordinate.
 * This function is used internally inside of addBezier.
 * @param {number} y - The Y coordinate of the point.
 */
BoundingBox.prototype.addY = function(y) {
    this.addPoint(null, y);
};

/**
 * Add a Bézier curve to the bounding box.
 * This extends the bounding box to include the entire Bézier.
 * @param {number} x0 - The starting X coordinate.
 * @param {number} y0 - The starting Y coordinate.
 * @param {number} x1 - The X coordinate of the first control point.
 * @param {number} y1 - The Y coordinate of the first control point.
 * @param {number} x2 - The X coordinate of the second control point.
 * @param {number} y2 - The Y coordinate of the second control point.
 * @param {number} x - The ending X coordinate.
 * @param {number} y - The ending Y coordinate.
 */
BoundingBox.prototype.addBezier = function(x0, y0, x1, y1, x2, y2, x, y) {
    // This code is based on http://nishiohirokazu.blogspot.com/2009/06/how-to-calculate-bezier-curves-bounding.html
    // and https://github.com/icons8/svg-path-bounding-box

    const p0 = [x0, y0];
    const p1 = [x1, y1];
    const p2 = [x2, y2];
    const p3 = [x, y];

    this.addPoint(x0, y0);
    this.addPoint(x, y);

    for (let i = 0; i <= 1; i++) {
        const b = 6 * p0[i] - 12 * p1[i] + 6 * p2[i];
        const a = -3 * p0[i] + 9 * p1[i] - 9 * p2[i] + 3 * p3[i];
        const c = 3 * p1[i] - 3 * p0[i];

        if (a === 0) {
            if (b === 0) continue;
            const t = -c / b;
            if (0 < t && t < 1) {
                if (i === 0) this.addX(derive(p0[i], p1[i], p2[i], p3[i], t));
                if (i === 1) this.addY(derive(p0[i], p1[i], p2[i], p3[i], t));
            }
            continue;
        }

        const b2ac = Math.pow(b, 2) - 4 * c * a;
        if (b2ac < 0) continue;
        const t1 = (-b + Math.sqrt(b2ac)) / (2 * a);
        if (0 < t1 && t1 < 1) {
            if (i === 0) this.addX(derive(p0[i], p1[i], p2[i], p3[i], t1));
            if (i === 1) this.addY(derive(p0[i], p1[i], p2[i], p3[i], t1));
        }
        const t2 = (-b - Math.sqrt(b2ac)) / (2 * a);
        if (0 < t2 && t2 < 1) {
            if (i === 0) this.addX(derive(p0[i], p1[i], p2[i], p3[i], t2));
            if (i === 1) this.addY(derive(p0[i], p1[i], p2[i], p3[i], t2));
        }
    }
};

/**
 * Add a quadratic curve to the bounding box.
 * This extends the bounding box to include the entire quadratic curve.
 * @param {number} x0 - The starting X coordinate.
 * @param {number} y0 - The starting Y coordinate.
 * @param {number} x1 - The X coordinate of the control point.
 * @param {number} y1 - The Y coordinate of the control point.
 * @param {number} x - The ending X coordinate.
 * @param {number} y - The ending Y coordinate.
 */
BoundingBox.prototype.addQuad = function(x0, y0, x1, y1, x, y) {
    const cp1x = x0 + 2 / 3 * (x1 - x0);
    const cp1y = y0 + 2 / 3 * (y1 - y0);
    const cp2x = cp1x + 1 / 3 * (x - x0);
    const cp2y = cp1y + 1 / 3 * (y - y0);
    this.addBezier(x0, y0, cp1x, cp1y, cp2x, cp2y, x, y);
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BoundingBox);


/***/ }),

/***/ "./node_modules/opentype.js/src/check.js":
/*!***********************************************!*\
  !*** ./node_modules/opentype.js/src/check.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fail": () => (/* binding */ fail),
/* harmony export */   "argument": () => (/* binding */ argument),
/* harmony export */   "assert": () => (/* binding */ argument),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Run-time checking of preconditions.

function fail(message) {
    throw new Error(message);
}

// Precondition function that checks if the given predicate is true.
// If not, it will throw an error.
function argument(predicate, message) {
    if (!predicate) {
        fail(message);
    }
}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ fail, argument, assert: argument });


/***/ }),

/***/ "./node_modules/opentype.js/src/draw.js":
/*!**********************************************!*\
  !*** ./node_modules/opentype.js/src/draw.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Drawing utility functions.

// Draw a line on the given context from point `x1,y1` to point `x2,y2`.
function line(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ line });


/***/ }),

/***/ "./node_modules/opentype.js/src/encoding.js":
/*!**************************************************!*\
  !*** ./node_modules/opentype.js/src/encoding.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "cffStandardStrings": () => (/* binding */ cffStandardStrings),
/* harmony export */   "cffStandardEncoding": () => (/* binding */ cffStandardEncoding),
/* harmony export */   "cffExpertEncoding": () => (/* binding */ cffExpertEncoding),
/* harmony export */   "standardNames": () => (/* binding */ standardNames),
/* harmony export */   "DefaultEncoding": () => (/* binding */ DefaultEncoding),
/* harmony export */   "CmapEncoding": () => (/* binding */ CmapEncoding),
/* harmony export */   "CffEncoding": () => (/* binding */ CffEncoding),
/* harmony export */   "GlyphNames": () => (/* binding */ GlyphNames),
/* harmony export */   "addGlyphNames": () => (/* binding */ addGlyphNames)
/* harmony export */ });
// Glyph encoding

const cffStandardStrings = [
    '.notdef', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent', 'ampersand', 'quoteright',
    'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash', 'zero', 'one', 'two',
    'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less', 'equal', 'greater',
    'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright', 'asciicircum', 'underscore',
    'quoteleft', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde', 'exclamdown', 'cent', 'sterling',
    'fraction', 'yen', 'florin', 'section', 'currency', 'quotesingle', 'quotedblleft', 'guillemotleft',
    'guilsinglleft', 'guilsinglright', 'fi', 'fl', 'endash', 'dagger', 'daggerdbl', 'periodcentered', 'paragraph',
    'bullet', 'quotesinglbase', 'quotedblbase', 'quotedblright', 'guillemotright', 'ellipsis', 'perthousand',
    'questiondown', 'grave', 'acute', 'circumflex', 'tilde', 'macron', 'breve', 'dotaccent', 'dieresis', 'ring',
    'cedilla', 'hungarumlaut', 'ogonek', 'caron', 'emdash', 'AE', 'ordfeminine', 'Lslash', 'Oslash', 'OE',
    'ordmasculine', 'ae', 'dotlessi', 'lslash', 'oslash', 'oe', 'germandbls', 'onesuperior', 'logicalnot', 'mu',
    'trademark', 'Eth', 'onehalf', 'plusminus', 'Thorn', 'onequarter', 'divide', 'brokenbar', 'degree', 'thorn',
    'threequarters', 'twosuperior', 'registered', 'minus', 'eth', 'multiply', 'threesuperior', 'copyright',
    'Aacute', 'Acircumflex', 'Adieresis', 'Agrave', 'Aring', 'Atilde', 'Ccedilla', 'Eacute', 'Ecircumflex',
    'Edieresis', 'Egrave', 'Iacute', 'Icircumflex', 'Idieresis', 'Igrave', 'Ntilde', 'Oacute', 'Ocircumflex',
    'Odieresis', 'Ograve', 'Otilde', 'Scaron', 'Uacute', 'Ucircumflex', 'Udieresis', 'Ugrave', 'Yacute',
    'Ydieresis', 'Zcaron', 'aacute', 'acircumflex', 'adieresis', 'agrave', 'aring', 'atilde', 'ccedilla', 'eacute',
    'ecircumflex', 'edieresis', 'egrave', 'iacute', 'icircumflex', 'idieresis', 'igrave', 'ntilde', 'oacute',
    'ocircumflex', 'odieresis', 'ograve', 'otilde', 'scaron', 'uacute', 'ucircumflex', 'udieresis', 'ugrave',
    'yacute', 'ydieresis', 'zcaron', 'exclamsmall', 'Hungarumlautsmall', 'dollaroldstyle', 'dollarsuperior',
    'ampersandsmall', 'Acutesmall', 'parenleftsuperior', 'parenrightsuperior', '266 ff', 'onedotenleader',
    'zerooldstyle', 'oneoldstyle', 'twooldstyle', 'threeoldstyle', 'fouroldstyle', 'fiveoldstyle', 'sixoldstyle',
    'sevenoldstyle', 'eightoldstyle', 'nineoldstyle', 'commasuperior', 'threequartersemdash', 'periodsuperior',
    'questionsmall', 'asuperior', 'bsuperior', 'centsuperior', 'dsuperior', 'esuperior', 'isuperior', 'lsuperior',
    'msuperior', 'nsuperior', 'osuperior', 'rsuperior', 'ssuperior', 'tsuperior', 'ff', 'ffi', 'ffl',
    'parenleftinferior', 'parenrightinferior', 'Circumflexsmall', 'hyphensuperior', 'Gravesmall', 'Asmall',
    'Bsmall', 'Csmall', 'Dsmall', 'Esmall', 'Fsmall', 'Gsmall', 'Hsmall', 'Ismall', 'Jsmall', 'Ksmall', 'Lsmall',
    'Msmall', 'Nsmall', 'Osmall', 'Psmall', 'Qsmall', 'Rsmall', 'Ssmall', 'Tsmall', 'Usmall', 'Vsmall', 'Wsmall',
    'Xsmall', 'Ysmall', 'Zsmall', 'colonmonetary', 'onefitted', 'rupiah', 'Tildesmall', 'exclamdownsmall',
    'centoldstyle', 'Lslashsmall', 'Scaronsmall', 'Zcaronsmall', 'Dieresissmall', 'Brevesmall', 'Caronsmall',
    'Dotaccentsmall', 'Macronsmall', 'figuredash', 'hypheninferior', 'Ogoneksmall', 'Ringsmall', 'Cedillasmall',
    'questiondownsmall', 'oneeighth', 'threeeighths', 'fiveeighths', 'seveneighths', 'onethird', 'twothirds',
    'zerosuperior', 'foursuperior', 'fivesuperior', 'sixsuperior', 'sevensuperior', 'eightsuperior', 'ninesuperior',
    'zeroinferior', 'oneinferior', 'twoinferior', 'threeinferior', 'fourinferior', 'fiveinferior', 'sixinferior',
    'seveninferior', 'eightinferior', 'nineinferior', 'centinferior', 'dollarinferior', 'periodinferior',
    'commainferior', 'Agravesmall', 'Aacutesmall', 'Acircumflexsmall', 'Atildesmall', 'Adieresissmall',
    'Aringsmall', 'AEsmall', 'Ccedillasmall', 'Egravesmall', 'Eacutesmall', 'Ecircumflexsmall', 'Edieresissmall',
    'Igravesmall', 'Iacutesmall', 'Icircumflexsmall', 'Idieresissmall', 'Ethsmall', 'Ntildesmall', 'Ogravesmall',
    'Oacutesmall', 'Ocircumflexsmall', 'Otildesmall', 'Odieresissmall', 'OEsmall', 'Oslashsmall', 'Ugravesmall',
    'Uacutesmall', 'Ucircumflexsmall', 'Udieresissmall', 'Yacutesmall', 'Thornsmall', 'Ydieresissmall', '001.000',
    '001.001', '001.002', '001.003', 'Black', 'Bold', 'Book', 'Light', 'Medium', 'Regular', 'Roman', 'Semibold'];

const cffStandardEncoding = [
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent', 'ampersand', 'quoteright',
    'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash', 'zero', 'one', 'two',
    'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less', 'equal', 'greater',
    'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
    'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright', 'asciicircum', 'underscore',
    'quoteleft', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    'exclamdown', 'cent', 'sterling', 'fraction', 'yen', 'florin', 'section', 'currency', 'quotesingle',
    'quotedblleft', 'guillemotleft', 'guilsinglleft', 'guilsinglright', 'fi', 'fl', '', 'endash', 'dagger',
    'daggerdbl', 'periodcentered', '', 'paragraph', 'bullet', 'quotesinglbase', 'quotedblbase', 'quotedblright',
    'guillemotright', 'ellipsis', 'perthousand', '', 'questiondown', '', 'grave', 'acute', 'circumflex', 'tilde',
    'macron', 'breve', 'dotaccent', 'dieresis', '', 'ring', 'cedilla', '', 'hungarumlaut', 'ogonek', 'caron',
    'emdash', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'AE', '', 'ordfeminine', '', '', '',
    '', 'Lslash', 'Oslash', 'OE', 'ordmasculine', '', '', '', '', '', 'ae', '', '', '', 'dotlessi', '', '',
    'lslash', 'oslash', 'oe', 'germandbls'];

const cffExpertEncoding = [
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', 'space', 'exclamsmall', 'Hungarumlautsmall', '', 'dollaroldstyle', 'dollarsuperior',
    'ampersandsmall', 'Acutesmall', 'parenleftsuperior', 'parenrightsuperior', 'twodotenleader', 'onedotenleader',
    'comma', 'hyphen', 'period', 'fraction', 'zerooldstyle', 'oneoldstyle', 'twooldstyle', 'threeoldstyle',
    'fouroldstyle', 'fiveoldstyle', 'sixoldstyle', 'sevenoldstyle', 'eightoldstyle', 'nineoldstyle', 'colon',
    'semicolon', 'commasuperior', 'threequartersemdash', 'periodsuperior', 'questionsmall', '', 'asuperior',
    'bsuperior', 'centsuperior', 'dsuperior', 'esuperior', '', '', 'isuperior', '', '', 'lsuperior', 'msuperior',
    'nsuperior', 'osuperior', '', '', 'rsuperior', 'ssuperior', 'tsuperior', '', 'ff', 'fi', 'fl', 'ffi', 'ffl',
    'parenleftinferior', '', 'parenrightinferior', 'Circumflexsmall', 'hyphensuperior', 'Gravesmall', 'Asmall',
    'Bsmall', 'Csmall', 'Dsmall', 'Esmall', 'Fsmall', 'Gsmall', 'Hsmall', 'Ismall', 'Jsmall', 'Ksmall', 'Lsmall',
    'Msmall', 'Nsmall', 'Osmall', 'Psmall', 'Qsmall', 'Rsmall', 'Ssmall', 'Tsmall', 'Usmall', 'Vsmall', 'Wsmall',
    'Xsmall', 'Ysmall', 'Zsmall', 'colonmonetary', 'onefitted', 'rupiah', 'Tildesmall', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    'exclamdownsmall', 'centoldstyle', 'Lslashsmall', '', '', 'Scaronsmall', 'Zcaronsmall', 'Dieresissmall',
    'Brevesmall', 'Caronsmall', '', 'Dotaccentsmall', '', '', 'Macronsmall', '', '', 'figuredash', 'hypheninferior',
    '', '', 'Ogoneksmall', 'Ringsmall', 'Cedillasmall', '', '', '', 'onequarter', 'onehalf', 'threequarters',
    'questiondownsmall', 'oneeighth', 'threeeighths', 'fiveeighths', 'seveneighths', 'onethird', 'twothirds', '',
    '', 'zerosuperior', 'onesuperior', 'twosuperior', 'threesuperior', 'foursuperior', 'fivesuperior',
    'sixsuperior', 'sevensuperior', 'eightsuperior', 'ninesuperior', 'zeroinferior', 'oneinferior', 'twoinferior',
    'threeinferior', 'fourinferior', 'fiveinferior', 'sixinferior', 'seveninferior', 'eightinferior',
    'nineinferior', 'centinferior', 'dollarinferior', 'periodinferior', 'commainferior', 'Agravesmall',
    'Aacutesmall', 'Acircumflexsmall', 'Atildesmall', 'Adieresissmall', 'Aringsmall', 'AEsmall', 'Ccedillasmall',
    'Egravesmall', 'Eacutesmall', 'Ecircumflexsmall', 'Edieresissmall', 'Igravesmall', 'Iacutesmall',
    'Icircumflexsmall', 'Idieresissmall', 'Ethsmall', 'Ntildesmall', 'Ogravesmall', 'Oacutesmall',
    'Ocircumflexsmall', 'Otildesmall', 'Odieresissmall', 'OEsmall', 'Oslashsmall', 'Ugravesmall', 'Uacutesmall',
    'Ucircumflexsmall', 'Udieresissmall', 'Yacutesmall', 'Thornsmall', 'Ydieresissmall'];

const standardNames = [
    '.notdef', '.null', 'nonmarkingreturn', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent',
    'ampersand', 'quotesingle', 'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash',
    'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less',
    'equal', 'greater', 'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright',
    'asciicircum', 'underscore', 'grave', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde',
    'Adieresis', 'Aring', 'Ccedilla', 'Eacute', 'Ntilde', 'Odieresis', 'Udieresis', 'aacute', 'agrave',
    'acircumflex', 'adieresis', 'atilde', 'aring', 'ccedilla', 'eacute', 'egrave', 'ecircumflex', 'edieresis',
    'iacute', 'igrave', 'icircumflex', 'idieresis', 'ntilde', 'oacute', 'ograve', 'ocircumflex', 'odieresis',
    'otilde', 'uacute', 'ugrave', 'ucircumflex', 'udieresis', 'dagger', 'degree', 'cent', 'sterling', 'section',
    'bullet', 'paragraph', 'germandbls', 'registered', 'copyright', 'trademark', 'acute', 'dieresis', 'notequal',
    'AE', 'Oslash', 'infinity', 'plusminus', 'lessequal', 'greaterequal', 'yen', 'mu', 'partialdiff', 'summation',
    'product', 'pi', 'integral', 'ordfeminine', 'ordmasculine', 'Omega', 'ae', 'oslash', 'questiondown',
    'exclamdown', 'logicalnot', 'radical', 'florin', 'approxequal', 'Delta', 'guillemotleft', 'guillemotright',
    'ellipsis', 'nonbreakingspace', 'Agrave', 'Atilde', 'Otilde', 'OE', 'oe', 'endash', 'emdash', 'quotedblleft',
    'quotedblright', 'quoteleft', 'quoteright', 'divide', 'lozenge', 'ydieresis', 'Ydieresis', 'fraction',
    'currency', 'guilsinglleft', 'guilsinglright', 'fi', 'fl', 'daggerdbl', 'periodcentered', 'quotesinglbase',
    'quotedblbase', 'perthousand', 'Acircumflex', 'Ecircumflex', 'Aacute', 'Edieresis', 'Egrave', 'Iacute',
    'Icircumflex', 'Idieresis', 'Igrave', 'Oacute', 'Ocircumflex', 'apple', 'Ograve', 'Uacute', 'Ucircumflex',
    'Ugrave', 'dotlessi', 'circumflex', 'tilde', 'macron', 'breve', 'dotaccent', 'ring', 'cedilla', 'hungarumlaut',
    'ogonek', 'caron', 'Lslash', 'lslash', 'Scaron', 'scaron', 'Zcaron', 'zcaron', 'brokenbar', 'Eth', 'eth',
    'Yacute', 'yacute', 'Thorn', 'thorn', 'minus', 'multiply', 'onesuperior', 'twosuperior', 'threesuperior',
    'onehalf', 'onequarter', 'threequarters', 'franc', 'Gbreve', 'gbreve', 'Idotaccent', 'Scedilla', 'scedilla',
    'Cacute', 'cacute', 'Ccaron', 'ccaron', 'dcroat'];

/**
 * This is the encoding used for fonts created from scratch.
 * It loops through all glyphs and finds the appropriate unicode value.
 * Since it's linear time, other encodings will be faster.
 * @exports opentype.DefaultEncoding
 * @class
 * @constructor
 * @param {opentype.Font}
 */
function DefaultEncoding(font) {
    this.font = font;
}

DefaultEncoding.prototype.charToGlyphIndex = function(c) {
    const code = c.charCodeAt(0);
    const glyphs = this.font.glyphs;
    if (glyphs) {
        for (let i = 0; i < glyphs.length; i += 1) {
            const glyph = glyphs.get(i);
            for (let j = 0; j < glyph.unicodes.length; j += 1) {
                if (glyph.unicodes[j] === code) {
                    return i;
                }
            }
        }
    }
    return null;
};

/**
 * @exports opentype.CmapEncoding
 * @class
 * @constructor
 * @param {Object} cmap - a object with the cmap encoded data
 */
function CmapEncoding(cmap) {
    this.cmap = cmap;
}

/**
 * @param  {string} c - the character
 * @return {number} The glyph index.
 */
CmapEncoding.prototype.charToGlyphIndex = function(c) {
    return this.cmap.glyphIndexMap[c.charCodeAt(0)] || 0;
};

/**
 * @exports opentype.CffEncoding
 * @class
 * @constructor
 * @param {string} encoding - The encoding
 * @param {Array} charset - The character set.
 */
function CffEncoding(encoding, charset) {
    this.encoding = encoding;
    this.charset = charset;
}

/**
 * @param  {string} s - The character
 * @return {number} The index.
 */
CffEncoding.prototype.charToGlyphIndex = function(s) {
    const code = s.charCodeAt(0);
    const charName = this.encoding[code];
    return this.charset.indexOf(charName);
};

/**
 * @exports opentype.GlyphNames
 * @class
 * @constructor
 * @param {Object} post
 */
function GlyphNames(post) {
    switch (post.version) {
        case 1:
            this.names = standardNames.slice();
            break;
        case 2:
            this.names = new Array(post.numberOfGlyphs);
            for (let i = 0; i < post.numberOfGlyphs; i++) {
                if (post.glyphNameIndex[i] < standardNames.length) {
                    this.names[i] = standardNames[post.glyphNameIndex[i]];
                } else {
                    this.names[i] = post.names[post.glyphNameIndex[i] - standardNames.length];
                }
            }

            break;
        case 2.5:
            this.names = new Array(post.numberOfGlyphs);
            for (let i = 0; i < post.numberOfGlyphs; i++) {
                this.names[i] = standardNames[i + post.glyphNameIndex[i]];
            }

            break;
        case 3:
            this.names = [];
            break;
        default:
            this.names = [];
            break;
    }
}

/**
 * Gets the index of a glyph by name.
 * @param  {string} name - The glyph name
 * @return {number} The index
 */
GlyphNames.prototype.nameToGlyphIndex = function(name) {
    return this.names.indexOf(name);
};

/**
 * @param  {number} gid
 * @return {string}
 */
GlyphNames.prototype.glyphIndexToName = function(gid) {
    return this.names[gid];
};

/**
 * @alias opentype.addGlyphNames
 * @param {opentype.Font}
 */
function addGlyphNames(font) {
    let glyph;
    const glyphIndexMap = font.tables.cmap.glyphIndexMap;
    const charCodes = Object.keys(glyphIndexMap);

    for (let i = 0; i < charCodes.length; i += 1) {
        const c = charCodes[i];
        const glyphIndex = glyphIndexMap[c];
        glyph = font.glyphs.get(glyphIndex);
        glyph.addUnicode(parseInt(c));
    }

    for (let i = 0; i < font.glyphs.length; i += 1) {
        glyph = font.glyphs.get(i);
        if (font.cffEncoding) {
            if (font.isCIDFont) {
                glyph.name = 'gid' + i;
            } else {
                glyph.name = font.cffEncoding.charset[i];
            }
        } else if (font.glyphNames.names) {
            glyph.name = font.glyphNames.glyphIndexToName(i);
        }
    }
}




/***/ }),

/***/ "./node_modules/opentype.js/src/font.js":
/*!**********************************************!*\
  !*** ./node_modules/opentype.js/src/font.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./path */ "./node_modules/opentype.js/src/path.js");
/* harmony import */ var _tables_sfnt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tables/sfnt */ "./node_modules/opentype.js/src/tables/sfnt.js");
/* harmony import */ var _encoding__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./encoding */ "./node_modules/opentype.js/src/encoding.js");
/* harmony import */ var _glyphset__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./glyphset */ "./node_modules/opentype.js/src/glyphset.js");
/* harmony import */ var _position__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./position */ "./node_modules/opentype.js/src/position.js");
/* harmony import */ var _substitution__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./substitution */ "./node_modules/opentype.js/src/substitution.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./util */ "./node_modules/opentype.js/src/util.js");
/* harmony import */ var _hintingtt__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./hintingtt */ "./node_modules/opentype.js/src/hintingtt.js");
// The Font object










/**
 * @typedef FontOptions
 * @type Object
 * @property {Boolean} empty - whether to create a new empty font
 * @property {string} familyName
 * @property {string} styleName
 * @property {string=} fullName
 * @property {string=} postScriptName
 * @property {string=} designer
 * @property {string=} designerURL
 * @property {string=} manufacturer
 * @property {string=} manufacturerURL
 * @property {string=} license
 * @property {string=} licenseURL
 * @property {string=} version
 * @property {string=} description
 * @property {string=} copyright
 * @property {string=} trademark
 * @property {Number} unitsPerEm
 * @property {Number} ascender
 * @property {Number} descender
 * @property {Number} createdTimestamp
 * @property {string=} weightClass
 * @property {string=} widthClass
 * @property {string=} fsSelection
 */

/**
 * A Font represents a loaded OpenType font file.
 * It contains a set of glyphs and methods to draw text on a drawing context,
 * or to get a path representing the text.
 * @exports opentype.Font
 * @class
 * @param {FontOptions}
 * @constructor
 */
function Font(options) {
    options = options || {};

    if (!options.empty) {
        // Check that we've provided the minimum set of names.
        (0,_util__WEBPACK_IMPORTED_MODULE_6__.checkArgument)(options.familyName, 'When creating a new Font object, familyName is required.');
        (0,_util__WEBPACK_IMPORTED_MODULE_6__.checkArgument)(options.styleName, 'When creating a new Font object, styleName is required.');
        (0,_util__WEBPACK_IMPORTED_MODULE_6__.checkArgument)(options.unitsPerEm, 'When creating a new Font object, unitsPerEm is required.');
        (0,_util__WEBPACK_IMPORTED_MODULE_6__.checkArgument)(options.ascender, 'When creating a new Font object, ascender is required.');
        (0,_util__WEBPACK_IMPORTED_MODULE_6__.checkArgument)(options.descender, 'When creating a new Font object, descender is required.');
        (0,_util__WEBPACK_IMPORTED_MODULE_6__.checkArgument)(options.descender < 0, 'Descender should be negative (e.g. -512).');

        // OS X will complain if the names are empty, so we put a single space everywhere by default.
        this.names = {
            fontFamily: {en: options.familyName || ' '},
            fontSubfamily: {en: options.styleName || ' '},
            fullName: {en: options.fullName || options.familyName + ' ' + options.styleName},
            postScriptName: {en: options.postScriptName || options.familyName + options.styleName},
            designer: {en: options.designer || ' '},
            designerURL: {en: options.designerURL || ' '},
            manufacturer: {en: options.manufacturer || ' '},
            manufacturerURL: {en: options.manufacturerURL || ' '},
            license: {en: options.license || ' '},
            licenseURL: {en: options.licenseURL || ' '},
            version: {en: options.version || 'Version 0.1'},
            description: {en: options.description || ' '},
            copyright: {en: options.copyright || ' '},
            trademark: {en: options.trademark || ' '}
        };
        this.unitsPerEm = options.unitsPerEm || 1000;
        this.ascender = options.ascender;
        this.descender = options.descender;
        this.createdTimestamp = options.createdTimestamp;
        this.tables = { os2: {
            usWeightClass: options.weightClass || this.usWeightClasses.MEDIUM,
            usWidthClass: options.widthClass || this.usWidthClasses.MEDIUM,
            fsSelection: options.fsSelection || this.fsSelectionValues.REGULAR
        } };
    }

    this.supported = true; // Deprecated: parseBuffer will throw an error if font is not supported.
    this.glyphs = new _glyphset__WEBPACK_IMPORTED_MODULE_3__.default.GlyphSet(this, options.glyphs || []);
    this.encoding = new _encoding__WEBPACK_IMPORTED_MODULE_2__.DefaultEncoding(this);
    this.position = new _position__WEBPACK_IMPORTED_MODULE_4__.default(this);
    this.substitution = new _substitution__WEBPACK_IMPORTED_MODULE_5__.default(this);
    this.tables = this.tables || {};

    Object.defineProperty(this, 'hinting', {
        get: function() {
            if (this._hinting) return this._hinting;
            if (this.outlinesFormat === 'truetype') {
                return (this._hinting = new _hintingtt__WEBPACK_IMPORTED_MODULE_7__.default(this));
            }
        }
    });
}

/**
 * Check if the font has a glyph for the given character.
 * @param  {string}
 * @return {Boolean}
 */
Font.prototype.hasChar = function(c) {
    return this.encoding.charToGlyphIndex(c) !== null;
};

/**
 * Convert the given character to a single glyph index.
 * Note that this function assumes that there is a one-to-one mapping between
 * the given character and a glyph; for complex scripts this might not be the case.
 * @param  {string}
 * @return {Number}
 */
Font.prototype.charToGlyphIndex = function(s) {
    return this.encoding.charToGlyphIndex(s);
};

/**
 * Convert the given character to a single Glyph object.
 * Note that this function assumes that there is a one-to-one mapping between
 * the given character and a glyph; for complex scripts this might not be the case.
 * @param  {string}
 * @return {opentype.Glyph}
 */
Font.prototype.charToGlyph = function(c) {
    const glyphIndex = this.charToGlyphIndex(c);
    let glyph = this.glyphs.get(glyphIndex);
    if (!glyph) {
        // .notdef
        glyph = this.glyphs.get(0);
    }

    return glyph;
};

/**
 * Convert the given text to a list of Glyph objects.
 * Note that there is no strict one-to-one mapping between characters and
 * glyphs, so the list of returned glyphs can be larger or smaller than the
 * length of the given string.
 * @param  {string}
 * @param  {GlyphRenderOptions} [options]
 * @return {opentype.Glyph[]}
 */
Font.prototype.stringToGlyphs = function(s, options) {
    options = options || this.defaultRenderOptions;
    // Get glyph indexes
    const indexes = [];
    for (let i = 0; i < s.length; i += 1) {
        const c = s[i];
        indexes.push(this.charToGlyphIndex(c));
    }
    let length = indexes.length;

    // Apply substitutions on glyph indexes
    if (options.features) {
        const script = options.script || this.substitution.getDefaultScriptName();
        let manyToOne = [];
        if (options.features.liga) manyToOne = manyToOne.concat(this.substitution.getFeature('liga', script, options.language));
        if (options.features.rlig) manyToOne = manyToOne.concat(this.substitution.getFeature('rlig', script, options.language));
        for (let i = 0; i < length; i += 1) {
            for (let j = 0; j < manyToOne.length; j++) {
                const ligature = manyToOne[j];
                const components = ligature.sub;
                const compCount = components.length;
                let k = 0;
                while (k < compCount && components[k] === indexes[i + k]) k++;
                if (k === compCount) {
                    indexes.splice(i, compCount, ligature.by);
                    length = length - compCount + 1;
                }
            }
        }
    }

    // convert glyph indexes to glyph objects
    const glyphs = new Array(length);
    const notdef = this.glyphs.get(0);
    for (let i = 0; i < length; i += 1) {
        glyphs[i] = this.glyphs.get(indexes[i]) || notdef;
    }
    return glyphs;
};

/**
 * @param  {string}
 * @return {Number}
 */
Font.prototype.nameToGlyphIndex = function(name) {
    return this.glyphNames.nameToGlyphIndex(name);
};

/**
 * @param  {string}
 * @return {opentype.Glyph}
 */
Font.prototype.nameToGlyph = function(name) {
    const glyphIndex = this.nameToGlyphIndex(name);
    let glyph = this.glyphs.get(glyphIndex);
    if (!glyph) {
        // .notdef
        glyph = this.glyphs.get(0);
    }

    return glyph;
};

/**
 * @param  {Number}
 * @return {String}
 */
Font.prototype.glyphIndexToName = function(gid) {
    if (!this.glyphNames.glyphIndexToName) {
        return '';
    }

    return this.glyphNames.glyphIndexToName(gid);
};

/**
 * Retrieve the value of the kerning pair between the left glyph (or its index)
 * and the right glyph (or its index). If no kerning pair is found, return 0.
 * The kerning value gets added to the advance width when calculating the spacing
 * between glyphs.
 * @param  {opentype.Glyph} leftGlyph
 * @param  {opentype.Glyph} rightGlyph
 * @return {Number}
 */
Font.prototype.getKerningValue = function(leftGlyph, rightGlyph) {
    leftGlyph = leftGlyph.index || leftGlyph;
    rightGlyph = rightGlyph.index || rightGlyph;
    return this.kerningPairs[leftGlyph + ',' + rightGlyph] || 0;
};

/**
 * @typedef GlyphRenderOptions
 * @type Object
 * @property {string} [script] - script used to determine which features to apply. By default, 'DFLT' or 'latn' is used.
 *                               See https://www.microsoft.com/typography/otspec/scripttags.htm
 * @property {string} [language='dflt'] - language system used to determine which features to apply.
 *                                        See https://www.microsoft.com/typography/developers/opentype/languagetags.aspx
 * @property {boolean} [kerning=true] - whether to include kerning values
 * @property {object} [features] - OpenType Layout feature tags. Used to enable or disable the features of the given script/language system.
 *                                 See https://www.microsoft.com/typography/otspec/featuretags.htm
 */
Font.prototype.defaultRenderOptions = {
    kerning: true,
    features: {
        liga: true,
        rlig: true
    }
};

/**
 * Helper function that invokes the given callback for each glyph in the given text.
 * The callback gets `(glyph, x, y, fontSize, options)`.* @param  {string} text
 * @param {string} text - The text to apply.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {GlyphRenderOptions=} options
 * @param  {Function} callback
 */
Font.prototype.forEachGlyph = function(text, x, y, fontSize, options, callback) {
    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    fontSize = fontSize !== undefined ? fontSize : 72;
    options = options || this.defaultRenderOptions;
    const fontScale = 1 / this.unitsPerEm * fontSize;
    const glyphs = this.stringToGlyphs(text, options);
    let kerningLookups;
    if (options.kerning) {
        const script = options.script || this.position.getDefaultScriptName();
        kerningLookups = this.position.getKerningTables(script, options.language);
    }
    for (let i = 0; i < glyphs.length; i += 1) {
        const glyph = glyphs[i];
        callback.call(this, glyph, x, y, fontSize, options);
        if (glyph.advanceWidth) {
            x += glyph.advanceWidth * fontScale;
        }

        if (options.kerning && i < glyphs.length - 1) {
            // We should apply position adjustment lookups in a more generic way.
            // Here we only use the xAdvance value.
            const kerningValue = kerningLookups ?
                  this.position.getKerningValue(kerningLookups, glyph.index, glyphs[i + 1].index) :
                  this.getKerningValue(glyph, glyphs[i + 1]);
            x += kerningValue * fontScale;
        }

        if (options.letterSpacing) {
            x += options.letterSpacing * fontSize;
        } else if (options.tracking) {
            x += (options.tracking / 1000) * fontSize;
        }
    }
    return x;
};

/**
 * Create a Path object that represents the given text.
 * @param  {string} text - The text to create.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {GlyphRenderOptions=} options
 * @return {opentype.Path}
 */
Font.prototype.getPath = function(text, x, y, fontSize, options) {
    const fullPath = new _path__WEBPACK_IMPORTED_MODULE_0__.default();
    this.forEachGlyph(text, x, y, fontSize, options, function(glyph, gX, gY, gFontSize) {
        const glyphPath = glyph.getPath(gX, gY, gFontSize, options, this);
        fullPath.extend(glyphPath);
    });
    return fullPath;
};

/**
 * Create an array of Path objects that represent the glyphs of a given text.
 * @param  {string} text - The text to create.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {GlyphRenderOptions=} options
 * @return {opentype.Path[]}
 */
Font.prototype.getPaths = function(text, x, y, fontSize, options) {
    const glyphPaths = [];
    this.forEachGlyph(text, x, y, fontSize, options, function(glyph, gX, gY, gFontSize) {
        const glyphPath = glyph.getPath(gX, gY, gFontSize, options, this);
        glyphPaths.push(glyphPath);
    });

    return glyphPaths;
};

/**
 * Returns the advance width of a text.
 *
 * This is something different than Path.getBoundingBox() as for example a
 * suffixed whitespace increases the advanceWidth but not the bounding box
 * or an overhanging letter like a calligraphic 'f' might have a quite larger
 * bounding box than its advance width.
 *
 * This corresponds to canvas2dContext.measureText(text).width
 *
 * @param  {string} text - The text to create.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {GlyphRenderOptions=} options
 * @return advance width
 */
Font.prototype.getAdvanceWidth = function(text, fontSize, options) {
    return this.forEachGlyph(text, 0, 0, fontSize, options, function() {});
};

/**
 * Draw the text on the given drawing context.
 * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
 * @param  {string} text - The text to create.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {GlyphRenderOptions=} options
 */
Font.prototype.draw = function(ctx, text, x, y, fontSize, options) {
    this.getPath(text, x, y, fontSize, options).draw(ctx);
};

/**
 * Draw the points of all glyphs in the text.
 * On-curve points will be drawn in blue, off-curve points will be drawn in red.
 * @param {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
 * @param {string} text - The text to create.
 * @param {number} [x=0] - Horizontal position of the beginning of the text.
 * @param {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param {GlyphRenderOptions=} options
 */
Font.prototype.drawPoints = function(ctx, text, x, y, fontSize, options) {
    this.forEachGlyph(text, x, y, fontSize, options, function(glyph, gX, gY, gFontSize) {
        glyph.drawPoints(ctx, gX, gY, gFontSize);
    });
};

/**
 * Draw lines indicating important font measurements for all glyphs in the text.
 * Black lines indicate the origin of the coordinate system (point 0,0).
 * Blue lines indicate the glyph bounding box.
 * Green line indicates the advance width of the glyph.
 * @param {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
 * @param {string} text - The text to create.
 * @param {number} [x=0] - Horizontal position of the beginning of the text.
 * @param {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param {GlyphRenderOptions=} options
 */
Font.prototype.drawMetrics = function(ctx, text, x, y, fontSize, options) {
    this.forEachGlyph(text, x, y, fontSize, options, function(glyph, gX, gY, gFontSize) {
        glyph.drawMetrics(ctx, gX, gY, gFontSize);
    });
};

/**
 * @param  {string}
 * @return {string}
 */
Font.prototype.getEnglishName = function(name) {
    const translations = this.names[name];
    if (translations) {
        return translations.en;
    }
};

/**
 * Validate
 */
Font.prototype.validate = function() {
    const warnings = [];
    const _this = this;

    function assert(predicate, message) {
        if (!predicate) {
            warnings.push(message);
        }
    }

    function assertNamePresent(name) {
        const englishName = _this.getEnglishName(name);
        assert(englishName && englishName.trim().length > 0,
               'No English ' + name + ' specified.');
    }

    // Identification information
    assertNamePresent('fontFamily');
    assertNamePresent('weightName');
    assertNamePresent('manufacturer');
    assertNamePresent('copyright');
    assertNamePresent('version');

    // Dimension information
    assert(this.unitsPerEm > 0, 'No unitsPerEm specified.');
};

/**
 * Convert the font object to a SFNT data structure.
 * This structure contains all the necessary tables and metadata to create a binary OTF file.
 * @return {opentype.Table}
 */
Font.prototype.toTables = function() {
    return _tables_sfnt__WEBPACK_IMPORTED_MODULE_1__.default.fontToTable(this);
};
/**
 * @deprecated Font.toBuffer is deprecated. Use Font.toArrayBuffer instead.
 */
Font.prototype.toBuffer = function() {
    console.warn('Font.toBuffer is deprecated. Use Font.toArrayBuffer instead.');
    return this.toArrayBuffer();
};
/**
 * Converts a `opentype.Font` into an `ArrayBuffer`
 * @return {ArrayBuffer}
 */
Font.prototype.toArrayBuffer = function() {
    const sfntTable = this.toTables();
    const bytes = sfntTable.encode();
    const buffer = new ArrayBuffer(bytes.length);
    const intArray = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
        intArray[i] = bytes[i];
    }

    return buffer;
};

/**
 * Initiate a download of the OpenType font.
 */
Font.prototype.download = function(fileName) {
    const familyName = this.getEnglishName('fontFamily');
    const styleName = this.getEnglishName('fontSubfamily');
    fileName = fileName || familyName.replace(/\s/g, '') + '-' + styleName + '.otf';
    const arrayBuffer = this.toArrayBuffer();

    if ((0,_util__WEBPACK_IMPORTED_MODULE_6__.isBrowser)()) {
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(window.TEMPORARY, arrayBuffer.byteLength, function(fs) {
            fs.root.getFile(fileName, {create: true}, function(fileEntry) {
                fileEntry.createWriter(function(writer) {
                    const dataView = new DataView(arrayBuffer);
                    const blob = new Blob([dataView], {type: 'font/opentype'});
                    writer.write(blob);

                    writer.addEventListener('writeend', function() {
                        // Navigating to the file will download it.
                        location.href = fileEntry.toURL();
                    }, false);
                });
            });
        },
        function(err) {
            throw new Error(err.name + ': ' + err.message);
        });
    } else {
        const fs = __webpack_require__(/*! fs */ "?4aa2");
        const buffer = (0,_util__WEBPACK_IMPORTED_MODULE_6__.arrayBufferToNodeBuffer)(arrayBuffer);
        fs.writeFileSync(fileName, buffer);
    }
};
/**
 * @private
 */
Font.prototype.fsSelectionValues = {
    ITALIC:              0x001, //1
    UNDERSCORE:          0x002, //2
    NEGATIVE:            0x004, //4
    OUTLINED:            0x008, //8
    STRIKEOUT:           0x010, //16
    BOLD:                0x020, //32
    REGULAR:             0x040, //64
    USER_TYPO_METRICS:   0x080, //128
    WWS:                 0x100, //256
    OBLIQUE:             0x200  //512
};

/**
 * @private
 */
Font.prototype.usWidthClasses = {
    ULTRA_CONDENSED: 1,
    EXTRA_CONDENSED: 2,
    CONDENSED: 3,
    SEMI_CONDENSED: 4,
    MEDIUM: 5,
    SEMI_EXPANDED: 6,
    EXPANDED: 7,
    EXTRA_EXPANDED: 8,
    ULTRA_EXPANDED: 9
};

/**
 * @private
 */
Font.prototype.usWeightClasses = {
    THIN: 100,
    EXTRA_LIGHT: 200,
    LIGHT: 300,
    NORMAL: 400,
    MEDIUM: 500,
    SEMI_BOLD: 600,
    BOLD: 700,
    EXTRA_BOLD: 800,
    BLACK:    900
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Font);


/***/ }),

/***/ "./node_modules/opentype.js/src/glyph.js":
/*!***********************************************!*\
  !*** ./node_modules/opentype.js/src/glyph.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./check */ "./node_modules/opentype.js/src/check.js");
/* harmony import */ var _draw__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./draw */ "./node_modules/opentype.js/src/draw.js");
/* harmony import */ var _path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./path */ "./node_modules/opentype.js/src/path.js");
/* harmony import */ var _tables_glyf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./tables/glyf */ "./node_modules/opentype.js/src/tables/glyf.js");
// The Glyph object






function getPathDefinition(glyph, path) {
    let _path = path || new _path__WEBPACK_IMPORTED_MODULE_2__.default();
    return {
        configurable: true,

        get: function() {
            if (typeof _path === 'function') {
                _path = _path();
            }

            return _path;
        },

        set: function(p) {
            _path = p;
        }
    };
}
/**
 * @typedef GlyphOptions
 * @type Object
 * @property {string} [name] - The glyph name
 * @property {number} [unicode]
 * @property {Array} [unicodes]
 * @property {number} [xMin]
 * @property {number} [yMin]
 * @property {number} [xMax]
 * @property {number} [yMax]
 * @property {number} [advanceWidth]
 */

// A Glyph is an individual mark that often corresponds to a character.
// Some glyphs, such as ligatures, are a combination of many characters.
// Glyphs are the basic building blocks of a font.
//
// The `Glyph` class contains utility methods for drawing the path and its points.
/**
 * @exports opentype.Glyph
 * @class
 * @param {GlyphOptions}
 * @constructor
 */
function Glyph(options) {
    // By putting all the code on a prototype function (which is only declared once)
    // we reduce the memory requirements for larger fonts by some 2%
    this.bindConstructorValues(options);
}

/**
 * @param  {GlyphOptions}
 */
Glyph.prototype.bindConstructorValues = function(options) {
    this.index = options.index || 0;

    // These three values cannot be deferred for memory optimization:
    this.name = options.name || null;
    this.unicode = options.unicode || undefined;
    this.unicodes = options.unicodes || options.unicode !== undefined ? [options.unicode] : [];

    // But by binding these values only when necessary, we reduce can
    // the memory requirements by almost 3% for larger fonts.
    if (options.xMin) {
        this.xMin = options.xMin;
    }

    if (options.yMin) {
        this.yMin = options.yMin;
    }

    if (options.xMax) {
        this.xMax = options.xMax;
    }

    if (options.yMax) {
        this.yMax = options.yMax;
    }

    if (options.advanceWidth) {
        this.advanceWidth = options.advanceWidth;
    }

    // The path for a glyph is the most memory intensive, and is bound as a value
    // with a getter/setter to ensure we actually do path parsing only once the
    // path is actually needed by anything.
    Object.defineProperty(this, 'path', getPathDefinition(this, options.path));
};

/**
 * @param {number}
 */
Glyph.prototype.addUnicode = function(unicode) {
    if (this.unicodes.length === 0) {
        this.unicode = unicode;
    }

    this.unicodes.push(unicode);
};

/**
 * Calculate the minimum bounding box for this glyph.
 * @return {opentype.BoundingBox}
 */
Glyph.prototype.getBoundingBox = function() {
    return this.path.getBoundingBox();
};

/**
 * Convert the glyph to a Path we can draw on a drawing context.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {Object=} options - xScale, yScale to stretch the glyph.
 * @param  {opentype.Font} if hinting is to be used, the font
 * @return {opentype.Path}
 */
Glyph.prototype.getPath = function(x, y, fontSize, options, font) {
    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    fontSize = fontSize !== undefined ? fontSize : 72;
    let commands;
    let hPoints;
    if (!options) options = { };
    let xScale = options.xScale;
    let yScale = options.yScale;

    if (options.hinting && font && font.hinting) {
        // in case of hinting, the hinting engine takes care
        // of scaling the points (not the path) before hinting.
        hPoints = this.path && font.hinting.exec(this, fontSize);
        // in case the hinting engine failed hPoints is undefined
        // and thus reverts to plain rending
    }

    if (hPoints) {
        commands = _tables_glyf__WEBPACK_IMPORTED_MODULE_3__.default.getPath(hPoints).commands;
        x = Math.round(x);
        y = Math.round(y);
        // TODO in case of hinting xyScaling is not yet supported
        xScale = yScale = 1;
    } else {
        commands = this.path.commands;
        const scale = 1 / this.path.unitsPerEm * fontSize;
        if (xScale === undefined) xScale = scale;
        if (yScale === undefined) yScale = scale;
    }

    const p = new _path__WEBPACK_IMPORTED_MODULE_2__.default();
    for (let i = 0; i < commands.length; i += 1) {
        const cmd = commands[i];
        if (cmd.type === 'M') {
            p.moveTo(x + (cmd.x * xScale), y + (-cmd.y * yScale));
        } else if (cmd.type === 'L') {
            p.lineTo(x + (cmd.x * xScale), y + (-cmd.y * yScale));
        } else if (cmd.type === 'Q') {
            p.quadraticCurveTo(x + (cmd.x1 * xScale), y + (-cmd.y1 * yScale),
                               x + (cmd.x * xScale), y + (-cmd.y * yScale));
        } else if (cmd.type === 'C') {
            p.curveTo(x + (cmd.x1 * xScale), y + (-cmd.y1 * yScale),
                      x + (cmd.x2 * xScale), y + (-cmd.y2 * yScale),
                      x + (cmd.x * xScale), y + (-cmd.y * yScale));
        } else if (cmd.type === 'Z') {
            p.closePath();
        }
    }

    return p;
};

/**
 * Split the glyph into contours.
 * This function is here for backwards compatibility, and to
 * provide raw access to the TrueType glyph outlines.
 * @return {Array}
 */
Glyph.prototype.getContours = function() {
    if (this.points === undefined) {
        return [];
    }

    const contours = [];
    let currentContour = [];
    for (let i = 0; i < this.points.length; i += 1) {
        const pt = this.points[i];
        currentContour.push(pt);
        if (pt.lastPointOfContour) {
            contours.push(currentContour);
            currentContour = [];
        }
    }

    _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(currentContour.length === 0, 'There are still points left in the current contour.');
    return contours;
};

/**
 * Calculate the xMin/yMin/xMax/yMax/lsb/rsb for a Glyph.
 * @return {Object}
 */
Glyph.prototype.getMetrics = function() {
    const commands = this.path.commands;
    const xCoords = [];
    const yCoords = [];
    for (let i = 0; i < commands.length; i += 1) {
        const cmd = commands[i];
        if (cmd.type !== 'Z') {
            xCoords.push(cmd.x);
            yCoords.push(cmd.y);
        }

        if (cmd.type === 'Q' || cmd.type === 'C') {
            xCoords.push(cmd.x1);
            yCoords.push(cmd.y1);
        }

        if (cmd.type === 'C') {
            xCoords.push(cmd.x2);
            yCoords.push(cmd.y2);
        }
    }

    const metrics = {
        xMin: Math.min.apply(null, xCoords),
        yMin: Math.min.apply(null, yCoords),
        xMax: Math.max.apply(null, xCoords),
        yMax: Math.max.apply(null, yCoords),
        leftSideBearing: this.leftSideBearing
    };

    if (!isFinite(metrics.xMin)) {
        metrics.xMin = 0;
    }

    if (!isFinite(metrics.xMax)) {
        metrics.xMax = this.advanceWidth;
    }

    if (!isFinite(metrics.yMin)) {
        metrics.yMin = 0;
    }

    if (!isFinite(metrics.yMax)) {
        metrics.yMax = 0;
    }

    metrics.rightSideBearing = this.advanceWidth - metrics.leftSideBearing - (metrics.xMax - metrics.xMin);
    return metrics;
};

/**
 * Draw the glyph on the given context.
 * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 * @param  {Object=} options - xScale, yScale to stretch the glyph.
 */
Glyph.prototype.draw = function(ctx, x, y, fontSize, options) {
    this.getPath(x, y, fontSize, options).draw(ctx);
};

/**
 * Draw the points of the glyph.
 * On-curve points will be drawn in blue, off-curve points will be drawn in red.
 * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 */
Glyph.prototype.drawPoints = function(ctx, x, y, fontSize) {
    function drawCircles(l, x, y, scale) {
        const PI_SQ = Math.PI * 2;
        ctx.beginPath();
        for (let j = 0; j < l.length; j += 1) {
            ctx.moveTo(x + (l[j].x * scale), y + (l[j].y * scale));
            ctx.arc(x + (l[j].x * scale), y + (l[j].y * scale), 2, 0, PI_SQ, false);
        }

        ctx.closePath();
        ctx.fill();
    }

    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    fontSize = fontSize !== undefined ? fontSize : 24;
    const scale = 1 / this.path.unitsPerEm * fontSize;

    const blueCircles = [];
    const redCircles = [];
    const path = this.path;
    for (let i = 0; i < path.commands.length; i += 1) {
        const cmd = path.commands[i];
        if (cmd.x !== undefined) {
            blueCircles.push({x: cmd.x, y: -cmd.y});
        }

        if (cmd.x1 !== undefined) {
            redCircles.push({x: cmd.x1, y: -cmd.y1});
        }

        if (cmd.x2 !== undefined) {
            redCircles.push({x: cmd.x2, y: -cmd.y2});
        }
    }

    ctx.fillStyle = 'blue';
    drawCircles(blueCircles, x, y, scale);
    ctx.fillStyle = 'red';
    drawCircles(redCircles, x, y, scale);
};

/**
 * Draw lines indicating important font measurements.
 * Black lines indicate the origin of the coordinate system (point 0,0).
 * Blue lines indicate the glyph bounding box.
 * Green line indicates the advance width of the glyph.
 * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
 */
Glyph.prototype.drawMetrics = function(ctx, x, y, fontSize) {
    let scale;
    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    fontSize = fontSize !== undefined ? fontSize : 24;
    scale = 1 / this.path.unitsPerEm * fontSize;
    ctx.lineWidth = 1;

    // Draw the origin
    ctx.strokeStyle = 'black';
    _draw__WEBPACK_IMPORTED_MODULE_1__.default.line(ctx, x, -10000, x, 10000);
    _draw__WEBPACK_IMPORTED_MODULE_1__.default.line(ctx, -10000, y, 10000, y);

    // This code is here due to memory optimization: by not using
    // defaults in the constructor, we save a notable amount of memory.
    const xMin = this.xMin || 0;
    let yMin = this.yMin || 0;
    const xMax = this.xMax || 0;
    let yMax = this.yMax || 0;
    const advanceWidth = this.advanceWidth || 0;

    // Draw the glyph box
    ctx.strokeStyle = 'blue';
    _draw__WEBPACK_IMPORTED_MODULE_1__.default.line(ctx, x + (xMin * scale), -10000, x + (xMin * scale), 10000);
    _draw__WEBPACK_IMPORTED_MODULE_1__.default.line(ctx, x + (xMax * scale), -10000, x + (xMax * scale), 10000);
    _draw__WEBPACK_IMPORTED_MODULE_1__.default.line(ctx, -10000, y + (-yMin * scale), 10000, y + (-yMin * scale));
    _draw__WEBPACK_IMPORTED_MODULE_1__.default.line(ctx, -10000, y + (-yMax * scale), 10000, y + (-yMax * scale));

    // Draw the advance width
    ctx.strokeStyle = 'green';
    _draw__WEBPACK_IMPORTED_MODULE_1__.default.line(ctx, x + (advanceWidth * scale), -10000, x + (advanceWidth * scale), 10000);
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Glyph);


/***/ }),

/***/ "./node_modules/opentype.js/src/glyphset.js":
/*!**************************************************!*\
  !*** ./node_modules/opentype.js/src/glyphset.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _glyph__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./glyph */ "./node_modules/opentype.js/src/glyph.js");
// The GlyphSet object



// Define a property on the glyph that depends on the path being loaded.
function defineDependentProperty(glyph, externalName, internalName) {
    Object.defineProperty(glyph, externalName, {
        get: function() {
            // Request the path property to make sure the path is loaded.
            glyph.path; // jshint ignore:line
            return glyph[internalName];
        },
        set: function(newValue) {
            glyph[internalName] = newValue;
        },
        enumerable: true,
        configurable: true
    });
}

/**
 * A GlyphSet represents all glyphs available in the font, but modelled using
 * a deferred glyph loader, for retrieving glyphs only once they are absolutely
 * necessary, to keep the memory footprint down.
 * @exports opentype.GlyphSet
 * @class
 * @param {opentype.Font}
 * @param {Array}
 */
function GlyphSet(font, glyphs) {
    this.font = font;
    this.glyphs = {};
    if (Array.isArray(glyphs)) {
        for (let i = 0; i < glyphs.length; i++) {
            this.glyphs[i] = glyphs[i];
        }
    }

    this.length = (glyphs && glyphs.length) || 0;
}

/**
 * @param  {number} index
 * @return {opentype.Glyph}
 */
GlyphSet.prototype.get = function(index) {
    if (typeof this.glyphs[index] === 'function') {
        this.glyphs[index] = this.glyphs[index]();
    }

    return this.glyphs[index];
};

/**
 * @param  {number} index
 * @param  {Object}
 */
GlyphSet.prototype.push = function(index, loader) {
    this.glyphs[index] = loader;
    this.length++;
};

/**
 * @alias opentype.glyphLoader
 * @param  {opentype.Font} font
 * @param  {number} index
 * @return {opentype.Glyph}
 */
function glyphLoader(font, index) {
    return new _glyph__WEBPACK_IMPORTED_MODULE_0__.default({index: index, font: font});
}

/**
 * Generate a stub glyph that can be filled with all metadata *except*
 * the "points" and "path" properties, which must be loaded only once
 * the glyph's path is actually requested for text shaping.
 * @alias opentype.ttfGlyphLoader
 * @param  {opentype.Font} font
 * @param  {number} index
 * @param  {Function} parseGlyph
 * @param  {Object} data
 * @param  {number} position
 * @param  {Function} buildPath
 * @return {opentype.Glyph}
 */
function ttfGlyphLoader(font, index, parseGlyph, data, position, buildPath) {
    return function() {
        const glyph = new _glyph__WEBPACK_IMPORTED_MODULE_0__.default({index: index, font: font});

        glyph.path = function() {
            parseGlyph(glyph, data, position);
            const path = buildPath(font.glyphs, glyph);
            path.unitsPerEm = font.unitsPerEm;
            return path;
        };

        defineDependentProperty(glyph, 'xMin', '_xMin');
        defineDependentProperty(glyph, 'xMax', '_xMax');
        defineDependentProperty(glyph, 'yMin', '_yMin');
        defineDependentProperty(glyph, 'yMax', '_yMax');

        return glyph;
    };
}
/**
 * @alias opentype.cffGlyphLoader
 * @param  {opentype.Font} font
 * @param  {number} index
 * @param  {Function} parseCFFCharstring
 * @param  {string} charstring
 * @return {opentype.Glyph}
 */
function cffGlyphLoader(font, index, parseCFFCharstring, charstring) {
    return function() {
        const glyph = new _glyph__WEBPACK_IMPORTED_MODULE_0__.default({index: index, font: font});

        glyph.path = function() {
            const path = parseCFFCharstring(font, glyph, charstring);
            path.unitsPerEm = font.unitsPerEm;
            return path;
        };

        return glyph;
    };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ GlyphSet, glyphLoader, ttfGlyphLoader, cffGlyphLoader });


/***/ }),

/***/ "./node_modules/opentype.js/src/hintingtt.js":
/*!***************************************************!*\
  !*** ./node_modules/opentype.js/src/hintingtt.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* A TrueType font hinting interpreter.
*
* (c) 2017 Axel Kittenberger
*
* This interpreter has been implemented according to this documentation:
* https://developer.apple.com/fonts/TrueType-Reference-Manual/RM05/Chap5.html
*
* According to the documentation F24DOT6 values are used for pixels.
* That means calculation is 1/64 pixel accurate and uses integer operations.
* However, Javascript has floating point operations by default and only
* those are available. One could make a case to simulate the 1/64 accuracy
* exactly by truncating after every division operation
* (for example with << 0) to get pixel exactly results as other TrueType
* implementations. It may make sense since some fonts are pixel optimized
* by hand using DELTAP instructions. The current implementation doesn't
* and rather uses full floating point precision.
*
* xScale, yScale and rotation is currently ignored.
*
* A few non-trivial instructions are missing as I didn't encounter yet
* a font that used them to test a possible implementation.
*
* Some fonts seem to use undocumented features regarding the twilight zone.
* Only some of them are implemented as they were encountered.
*
* The exports.DEBUG statements are removed on the minified distribution file.
*/


let instructionTable;
let exec;
let execGlyph;
let execComponent;

/*
* Creates a hinting object.
*
* There ought to be exactly one
* for each truetype font that is used for hinting.
*/
function Hinting(font) {
    // the font this hinting object is for
    this.font = font;

    // cached states
    this._fpgmState  =
    this._prepState  =
        undefined;

    // errorState
    // 0 ... all okay
    // 1 ... had an error in a glyf,
    //       continue working but stop spamming
    //       the console
    // 2 ... error at prep, stop hinting at this ppem
    // 3 ... error at fpeg, stop hinting for this font at all
    this._errorState = 0;
}

/*
* Not rounding.
*/
function roundOff(v) {
    return v;
}

/*
* Rounding to grid.
*/
function roundToGrid(v) {
    //Rounding in TT is supposed to "symmetrical around zero"
    return Math.sign(v) * Math.round(Math.abs(v));
}

/*
* Rounding to double grid.
*/
function roundToDoubleGrid(v) {
    return Math.sign(v) * Math.round(Math.abs(v * 2)) / 2;
}

/*
* Rounding to half grid.
*/
function roundToHalfGrid(v) {
    return Math.sign(v) * (Math.round(Math.abs(v) + 0.5) - 0.5);
}

/*
* Rounding to up to grid.
*/
function roundUpToGrid(v) {
    return Math.sign(v) * Math.ceil(Math.abs(v));
}

/*
* Rounding to down to grid.
*/
function roundDownToGrid(v) {
    return Math.sign(v) * Math.floor(Math.abs(v));
}

/*
* Super rounding.
*/
const roundSuper = function (v) {
    const period = this.srPeriod;
    let phase = this.srPhase;
    const threshold = this.srThreshold;
    let sign = 1;

    if (v < 0) {
        v = -v;
        sign = -1;
    }

    v += threshold - phase;

    v = Math.trunc(v / period) * period;

    v += phase;

    // according to http://xgridfit.sourceforge.net/round.html
    if (v < 0) return phase * sign;

    return v * sign;
};

/*
* Unit vector of x-axis.
*/
const xUnitVector = {
    x: 1,

    y: 0,

    axis: 'x',

    // Gets the projected distance between two points.
    // o1/o2 ... if true, respective original position is used.
    distance: function (p1, p2, o1, o2) {
        return (o1 ? p1.xo : p1.x) - (o2 ? p2.xo : p2.x);
    },

    // Moves point p so the moved position has the same relative
    // position to the moved positions of rp1 and rp2 than the
    // original positions had.
    //
    // See APPENDIX on INTERPOLATE at the bottom of this file.
    interpolate: function (p, rp1, rp2, pv) {
        let do1;
        let do2;
        let doa1;
        let doa2;
        let dm1;
        let dm2;
        let dt;

        if (!pv || pv === this) {
            do1 = p.xo - rp1.xo;
            do2 = p.xo - rp2.xo;
            dm1 = rp1.x - rp1.xo;
            dm2 = rp2.x - rp2.xo;
            doa1 = Math.abs(do1);
            doa2 = Math.abs(do2);
            dt = doa1 + doa2;

            if (dt === 0) {
                p.x = p.xo + (dm1 + dm2) / 2;
                return;
            }

            p.x = p.xo + (dm1 * doa2 + dm2 * doa1) / dt;
            return;
        }

        do1 = pv.distance(p, rp1, true, true);
        do2 = pv.distance(p, rp2, true, true);
        dm1 = pv.distance(rp1, rp1, false, true);
        dm2 = pv.distance(rp2, rp2, false, true);
        doa1 = Math.abs(do1);
        doa2 = Math.abs(do2);
        dt = doa1 + doa2;

        if (dt === 0) {
            xUnitVector.setRelative(p, p, (dm1 + dm2) / 2, pv, true);
            return;
        }

        xUnitVector.setRelative(p, p, (dm1 * doa2 + dm2 * doa1) / dt, pv, true);
    },

    // Slope of line normal to this
    normalSlope: Number.NEGATIVE_INFINITY,

    // Sets the point 'p' relative to point 'rp'
    // by the distance 'd'.
    //
    // See APPENDIX on SETRELATIVE at the bottom of this file.
    //
    // p   ... point to set
    // rp  ... reference point
    // d   ... distance on projection vector
    // pv  ... projection vector (undefined = this)
    // org ... if true, uses the original position of rp as reference.
    setRelative: function (p, rp, d, pv, org) {
        if (!pv || pv === this) {
            p.x = (org ? rp.xo : rp.x) + d;
            return;
        }

        const rpx = org ? rp.xo : rp.x;
        const rpy = org ? rp.yo : rp.y;
        const rpdx = rpx + d * pv.x;
        const rpdy = rpy + d * pv.y;

        p.x = rpdx + (p.y - rpdy) / pv.normalSlope;
    },

    // Slope of vector line.
    slope: 0,

    // Touches the point p.
    touch: function (p) {
        p.xTouched = true;
    },

    // Tests if a point p is touched.
    touched: function (p) {
        return p.xTouched;
    },

    // Untouches the point p.
    untouch: function (p) {
        p.xTouched = false;
    }
};

/*
* Unit vector of y-axis.
*/
const yUnitVector = {
    x: 0,

    y: 1,

    axis: 'y',

    // Gets the projected distance between two points.
    // o1/o2 ... if true, respective original position is used.
    distance: function (p1, p2, o1, o2) {
        return (o1 ? p1.yo : p1.y) - (o2 ? p2.yo : p2.y);
    },

    // Moves point p so the moved position has the same relative
    // position to the moved positions of rp1 and rp2 than the
    // original positions had.
    //
    // See APPENDIX on INTERPOLATE at the bottom of this file.
    interpolate: function (p, rp1, rp2, pv) {
        let do1;
        let do2;
        let doa1;
        let doa2;
        let dm1;
        let dm2;
        let dt;

        if (!pv || pv === this) {
            do1 = p.yo - rp1.yo;
            do2 = p.yo - rp2.yo;
            dm1 = rp1.y - rp1.yo;
            dm2 = rp2.y - rp2.yo;
            doa1 = Math.abs(do1);
            doa2 = Math.abs(do2);
            dt = doa1 + doa2;

            if (dt === 0) {
                p.y = p.yo + (dm1 + dm2) / 2;
                return;
            }

            p.y = p.yo + (dm1 * doa2 + dm2 * doa1) / dt;
            return;
        }

        do1 = pv.distance(p, rp1, true, true);
        do2 = pv.distance(p, rp2, true, true);
        dm1 = pv.distance(rp1, rp1, false, true);
        dm2 = pv.distance(rp2, rp2, false, true);
        doa1 = Math.abs(do1);
        doa2 = Math.abs(do2);
        dt = doa1 + doa2;

        if (dt === 0) {
            yUnitVector.setRelative(p, p, (dm1 + dm2) / 2, pv, true);
            return;
        }

        yUnitVector.setRelative(p, p, (dm1 * doa2 + dm2 * doa1) / dt, pv, true);
    },

    // Slope of line normal to this.
    normalSlope: 0,

    // Sets the point 'p' relative to point 'rp'
    // by the distance 'd'
    //
    // See APPENDIX on SETRELATIVE at the bottom of this file.
    //
    // p   ... point to set
    // rp  ... reference point
    // d   ... distance on projection vector
    // pv  ... projection vector (undefined = this)
    // org ... if true, uses the original position of rp as reference.
    setRelative: function (p, rp, d, pv, org) {
        if (!pv || pv === this) {
            p.y = (org ? rp.yo : rp.y) + d;
            return;
        }

        const rpx = org ? rp.xo : rp.x;
        const rpy = org ? rp.yo : rp.y;
        const rpdx = rpx + d * pv.x;
        const rpdy = rpy + d * pv.y;

        p.y = rpdy + pv.normalSlope * (p.x - rpdx);
    },

    // Slope of vector line.
    slope: Number.POSITIVE_INFINITY,

    // Touches the point p.
    touch: function (p) {
        p.yTouched = true;
    },

    // Tests if a point p is touched.
    touched: function (p) {
        return p.yTouched;
    },

    // Untouches the point p.
    untouch: function (p) {
        p.yTouched = false;
    }
};

Object.freeze(xUnitVector);
Object.freeze(yUnitVector);

/*
* Creates a unit vector that is not x- or y-axis.
*/
function UnitVector(x, y) {
    this.x = x;
    this.y = y;
    this.axis = undefined;
    this.slope = y / x;
    this.normalSlope = -x / y;
    Object.freeze(this);
}

/*
* Gets the projected distance between two points.
* o1/o2 ... if true, respective original position is used.
*/
UnitVector.prototype.distance = function(p1, p2, o1, o2) {
    return (
        this.x * xUnitVector.distance(p1, p2, o1, o2) +
        this.y * yUnitVector.distance(p1, p2, o1, o2)
    );
};

/*
* Moves point p so the moved position has the same relative
* position to the moved positions of rp1 and rp2 than the
* original positions had.
*
* See APPENDIX on INTERPOLATE at the bottom of this file.
*/
UnitVector.prototype.interpolate = function(p, rp1, rp2, pv) {
    let dm1;
    let dm2;
    let do1;
    let do2;
    let doa1;
    let doa2;
    let dt;

    do1 = pv.distance(p, rp1, true, true);
    do2 = pv.distance(p, rp2, true, true);
    dm1 = pv.distance(rp1, rp1, false, true);
    dm2 = pv.distance(rp2, rp2, false, true);
    doa1 = Math.abs(do1);
    doa2 = Math.abs(do2);
    dt = doa1 + doa2;

    if (dt === 0) {
        this.setRelative(p, p, (dm1 + dm2) / 2, pv, true);
        return;
    }

    this.setRelative(p, p, (dm1 * doa2 + dm2 * doa1) / dt, pv, true);
};

/*
* Sets the point 'p' relative to point 'rp'
* by the distance 'd'
*
* See APPENDIX on SETRELATIVE at the bottom of this file.
*
* p   ...  point to set
* rp  ... reference point
* d   ... distance on projection vector
* pv  ... projection vector (undefined = this)
* org ... if true, uses the original position of rp as reference.
*/
UnitVector.prototype.setRelative = function(p, rp, d, pv, org) {
    pv = pv || this;

    const rpx = org ? rp.xo : rp.x;
    const rpy = org ? rp.yo : rp.y;
    const rpdx = rpx + d * pv.x;
    const rpdy = rpy + d * pv.y;

    const pvns = pv.normalSlope;
    const fvs = this.slope;

    const px = p.x;
    const py = p.y;

    p.x = (fvs * px - pvns * rpdx + rpdy - py) / (fvs - pvns);
    p.y = fvs * (p.x - px) + py;
};

/*
* Touches the point p.
*/
UnitVector.prototype.touch = function(p) {
    p.xTouched = true;
    p.yTouched = true;
};

/*
* Returns a unit vector with x/y coordinates.
*/
function getUnitVector(x, y) {
    const d = Math.sqrt(x * x + y * y);

    x /= d;
    y /= d;

    if (x === 1 && y === 0) return xUnitVector;
    else if (x === 0 && y === 1) return yUnitVector;
    else return new UnitVector(x, y);
}

/*
* Creates a point in the hinting engine.
*/
function HPoint(
    x,
    y,
    lastPointOfContour,
    onCurve
) {
    this.x = this.xo = Math.round(x * 64) / 64; // hinted x value and original x-value
    this.y = this.yo = Math.round(y * 64) / 64; // hinted y value and original y-value

    this.lastPointOfContour = lastPointOfContour;
    this.onCurve = onCurve;
    this.prevPointOnContour = undefined;
    this.nextPointOnContour = undefined;
    this.xTouched = false;
    this.yTouched = false;

    Object.preventExtensions(this);
}

/*
* Returns the next touched point on the contour.
*
* v  ... unit vector to test touch axis.
*/
HPoint.prototype.nextTouched = function(v) {
    let p = this.nextPointOnContour;

    while (!v.touched(p) && p !== this) p = p.nextPointOnContour;

    return p;
};

/*
* Returns the previous touched point on the contour
*
* v  ... unit vector to test touch axis.
*/
HPoint.prototype.prevTouched = function(v) {
    let p = this.prevPointOnContour;

    while (!v.touched(p) && p !== this) p = p.prevPointOnContour;

    return p;
};

/*
* The zero point.
*/
const HPZero = Object.freeze(new HPoint(0, 0));

/*
* The default state of the interpreter.
*
* Note: Freezing the defaultState and then deriving from it
* makes the V8 Javascript engine going awkward,
* so this is avoided, albeit the defaultState shouldn't
* ever change.
*/
const defaultState = {
    cvCutIn: 17 / 16,    // control value cut in
    deltaBase: 9,
    deltaShift: 0.125,
    loop: 1,             // loops some instructions
    minDis: 1,           // minimum distance
    autoFlip: true
};

/*
* The current state of the interpreter.
*
* env  ... 'fpgm' or 'prep' or 'glyf'
* prog ... the program
*/
function State(env, prog) {
    this.env = env;
    this.stack = [];
    this.prog = prog;

    switch (env) {
        case 'glyf' :
            this.zp0 = this.zp1 = this.zp2 = 1;
            this.rp0 = this.rp1 = this.rp2 = 0;
            /* fall through */
        case 'prep' :
            this.fv = this.pv = this.dpv = xUnitVector;
            this.round = roundToGrid;
    }
}

/*
* Executes a glyph program.
*
* This does the hinting for each glyph.
*
* Returns an array of moved points.
*
* glyph: the glyph to hint
* ppem: the size the glyph is rendered for
*/
Hinting.prototype.exec = function(glyph, ppem) {
    if (typeof ppem !== 'number') {
        throw new Error('Point size is not a number!');
    }

    // Received a fatal error, don't do any hinting anymore.
    if (this._errorState > 2) return;

    const font = this.font;
    let prepState = this._prepState;

    if (!prepState || prepState.ppem !== ppem) {
        let fpgmState = this._fpgmState;

        if (!fpgmState) {
            // Executes the fpgm state.
            // This is used by fonts to define functions.
            State.prototype = defaultState;

            fpgmState =
            this._fpgmState =
                new State('fpgm', font.tables.fpgm);

            fpgmState.funcs = [ ];
            fpgmState.font = font;

            if (exports.DEBUG) {
                console.log('---EXEC FPGM---');
                fpgmState.step = -1;
            }

            try {
                exec(fpgmState);
            } catch (e) {
                console.log('Hinting error in FPGM:' + e);
                this._errorState = 3;
                return;
            }
        }

        // Executes the prep program for this ppem setting.
        // This is used by fonts to set cvt values
        // depending on to be rendered font size.

        State.prototype = fpgmState;
        prepState =
        this._prepState =
            new State('prep', font.tables.prep);

        prepState.ppem = ppem;

        // Creates a copy of the cvt table
        // and scales it to the current ppem setting.
        const oCvt = font.tables.cvt;
        if (oCvt) {
            const cvt = prepState.cvt = new Array(oCvt.length);
            const scale = ppem / font.unitsPerEm;
            for (let c = 0; c < oCvt.length; c++) {
                cvt[c] = oCvt[c] * scale;
            }
        } else {
            prepState.cvt = [];
        }

        if (exports.DEBUG) {
            console.log('---EXEC PREP---');
            prepState.step = -1;
        }

        try {
            exec(prepState);
        } catch (e) {
            if (this._errorState < 2) {
                console.log('Hinting error in PREP:' + e);
            }
            this._errorState = 2;
        }
    }

    if (this._errorState > 1) return;

    try {
        return execGlyph(glyph, prepState);
    } catch (e) {
        if (this._errorState < 1) {
            console.log('Hinting error:' + e);
            console.log('Note: further hinting errors are silenced');
        }
        this._errorState = 1;
        return undefined;
    }
};

/*
* Executes the hinting program for a glyph.
*/
execGlyph = function(glyph, prepState) {
    // original point positions
    const xScale = prepState.ppem / prepState.font.unitsPerEm;
    const yScale = xScale;
    let components = glyph.components;
    let contours;
    let gZone;
    let state;

    State.prototype = prepState;
    if (!components) {
        state = new State('glyf', glyph.instructions);
        if (exports.DEBUG) {
            console.log('---EXEC GLYPH---');
            state.step = -1;
        }
        execComponent(glyph, state, xScale, yScale);
        gZone = state.gZone;
    } else {
        const font = prepState.font;
        gZone = [];
        contours = [];
        for (let i = 0; i < components.length; i++) {
            const c = components[i];
            const cg = font.glyphs.get(c.glyphIndex);

            state = new State('glyf', cg.instructions);

            if (exports.DEBUG) {
                console.log('---EXEC COMP ' + i + '---');
                state.step = -1;
            }

            execComponent(cg, state, xScale, yScale);
            // appends the computed points to the result array
            // post processes the component points
            const dx = Math.round(c.dx * xScale);
            const dy = Math.round(c.dy * yScale);
            const gz = state.gZone;
            const cc = state.contours;
            for (let pi = 0; pi < gz.length; pi++) {
                const p = gz[pi];
                p.xTouched = p.yTouched = false;
                p.xo = p.x = p.x + dx;
                p.yo = p.y = p.y + dy;
            }

            const gLen = gZone.length;
            gZone.push.apply(gZone, gz);
            for (let j = 0; j < cc.length; j++) {
                contours.push(cc[j] + gLen);
            }
        }

        if (glyph.instructions && !state.inhibitGridFit) {
            // the composite has instructions on its own
            state = new State('glyf', glyph.instructions);

            state.gZone = state.z0 = state.z1 = state.z2 = gZone;

            state.contours = contours;

            // note: HPZero cannot be used here, since
            //       the point might be modified
            gZone.push(
                new HPoint(0, 0),
                new HPoint(Math.round(glyph.advanceWidth * xScale), 0)
            );

            if (exports.DEBUG) {
                console.log('---EXEC COMPOSITE---');
                state.step = -1;
            }

            exec(state);

            gZone.length -= 2;
        }
    }

    return gZone;
};

/*
* Executes the hinting program for a component of a multi-component glyph
* or of the glyph itself for a non-component glyph.
*/
execComponent = function(glyph, state, xScale, yScale)
{
    const points = glyph.points || [];
    const pLen = points.length;
    const gZone = state.gZone = state.z0 = state.z1 = state.z2 = [];
    const contours = state.contours = [];

    // Scales the original points and
    // makes copies for the hinted points.
    let cp; // current point
    for (let i = 0; i < pLen; i++) {
        cp = points[i];

        gZone[i] = new HPoint(
            cp.x * xScale,
            cp.y * yScale,
            cp.lastPointOfContour,
            cp.onCurve
        );
    }

    // Chain links the contours.
    let sp; // start point
    let np; // next point

    for (let i = 0; i < pLen; i++) {
        cp = gZone[i];

        if (!sp) {
            sp = cp;
            contours.push(i);
        }

        if (cp.lastPointOfContour) {
            cp.nextPointOnContour = sp;
            sp.prevPointOnContour = cp;
            sp = undefined;
        } else {
            np = gZone[i + 1];
            cp.nextPointOnContour = np;
            np.prevPointOnContour = cp;
        }
    }

    if (state.inhibitGridFit) return;

    if (exports.DEBUG) {
        console.log('PROCESSING GLYPH', state.stack);
        for (let i = 0; i < pLen; i++) {
            console.log(i, gZone[i].x, gZone[i].y);
        }
    }

    gZone.push(
        new HPoint(0, 0),
        new HPoint(Math.round(glyph.advanceWidth * xScale), 0)
    );

    exec(state);

    // Removes the extra points.
    gZone.length -= 2;

    if (exports.DEBUG) {
        console.log('FINISHED GLYPH', state.stack);
        for (let i = 0; i < pLen; i++) {
            console.log(i, gZone[i].x, gZone[i].y);
        }
    }
};

/*
* Executes the program loaded in state.
*/
exec = function(state) {
    let prog = state.prog;

    if (!prog) return;

    const pLen = prog.length;
    let ins;

    for (state.ip = 0; state.ip < pLen; state.ip++) {
        if (exports.DEBUG) state.step++;
        ins = instructionTable[prog[state.ip]];

        if (!ins) {
            throw new Error(
                'unknown instruction: 0x' +
                Number(prog[state.ip]).toString(16)
            );
        }

        ins(state);

        // very extensive debugging for each step
        /*
        if (exports.DEBUG) {
            var da;
            if (state.gZone) {
                da = [];
                for (let i = 0; i < state.gZone.length; i++)
                {
                    da.push(i + ' ' +
                        state.gZone[i].x * 64 + ' ' +
                        state.gZone[i].y * 64 + ' ' +
                        (state.gZone[i].xTouched ? 'x' : '') +
                        (state.gZone[i].yTouched ? 'y' : '')
                    );
                }
                console.log('GZ', da);
            }

            if (state.tZone) {
                da = [];
                for (let i = 0; i < state.tZone.length; i++) {
                    da.push(i + ' ' +
                        state.tZone[i].x * 64 + ' ' +
                        state.tZone[i].y * 64 + ' ' +
                        (state.tZone[i].xTouched ? 'x' : '') +
                        (state.tZone[i].yTouched ? 'y' : '')
                    );
                }
                console.log('TZ', da);
            }

            if (state.stack.length > 10) {
                console.log(
                    state.stack.length,
                    '...', state.stack.slice(state.stack.length - 10)
                );
            } else {
                console.log(state.stack.length, state.stack);
            }
        }
        */
    }
};

/*
* Initializes the twilight zone.
*
* This is only done if a SZPx instruction
* refers to the twilight zone.
*/
function initTZone(state)
{
    const tZone = state.tZone = new Array(state.gZone.length);

    // no idea if this is actually correct...
    for (let i = 0; i < tZone.length; i++)
    {
        tZone[i] = new HPoint(0, 0);
    }
}

/*
* Skips the instruction pointer ahead over an IF/ELSE block.
* handleElse .. if true breaks on matching ELSE
*/
function skip(state, handleElse)
{
    const prog = state.prog;
    let ip = state.ip;
    let nesting = 1;
    let ins;

    do {
        ins = prog[++ip];
        if (ins === 0x58) // IF
            nesting++;
        else if (ins === 0x59) // EIF
            nesting--;
        else if (ins === 0x40) // NPUSHB
            ip += prog[ip + 1] + 1;
        else if (ins === 0x41) // NPUSHW
            ip += 2 * prog[ip + 1] + 1;
        else if (ins >= 0xB0 && ins <= 0xB7) // PUSHB
            ip += ins - 0xB0 + 1;
        else if (ins >= 0xB8 && ins <= 0xBF) // PUSHW
            ip += (ins - 0xB8 + 1) * 2;
        else if (handleElse && nesting === 1 && ins === 0x1B) // ELSE
            break;
    } while (nesting > 0);

    state.ip = ip;
}

/*----------------------------------------------------------*
*          And then a lot of instructions...                *
*----------------------------------------------------------*/

// SVTCA[a] Set freedom and projection Vectors To Coordinate Axis
// 0x00-0x01
function SVTCA(v, state) {
    if (exports.DEBUG) console.log(state.step, 'SVTCA[' + v.axis + ']');

    state.fv = state.pv = state.dpv = v;
}

// SPVTCA[a] Set Projection Vector to Coordinate Axis
// 0x02-0x03
function SPVTCA(v, state) {
    if (exports.DEBUG) console.log(state.step, 'SPVTCA[' + v.axis + ']');

    state.pv = state.dpv = v;
}

// SFVTCA[a] Set Freedom Vector to Coordinate Axis
// 0x04-0x05
function SFVTCA(v, state) {
    if (exports.DEBUG) console.log(state.step, 'SFVTCA[' + v.axis + ']');

    state.fv = v;
}

// SPVTL[a] Set Projection Vector To Line
// 0x06-0x07
function SPVTL(a, state) {
    const stack = state.stack;
    const p2i = stack.pop();
    const p1i = stack.pop();
    const p2 = state.z2[p2i];
    const p1 = state.z1[p1i];

    if (exports.DEBUG) console.log('SPVTL[' + a + ']', p2i, p1i);

    let dx;
    let dy;

    if (!a) {
        dx = p1.x - p2.x;
        dy = p1.y - p2.y;
    } else {
        dx = p2.y - p1.y;
        dy = p1.x - p2.x;
    }

    state.pv = state.dpv = getUnitVector(dx, dy);
}

// SFVTL[a] Set Freedom Vector To Line
// 0x08-0x09
function SFVTL(a, state) {
    const stack = state.stack;
    const p2i = stack.pop();
    const p1i = stack.pop();
    const p2 = state.z2[p2i];
    const p1 = state.z1[p1i];

    if (exports.DEBUG) console.log('SFVTL[' + a + ']', p2i, p1i);

    let dx;
    let dy;

    if (!a) {
        dx = p1.x - p2.x;
        dy = p1.y - p2.y;
    } else {
        dx = p2.y - p1.y;
        dy = p1.x - p2.x;
    }

    state.fv = getUnitVector(dx, dy);
}

// SPVFS[] Set Projection Vector From Stack
// 0x0A
function SPVFS(state) {
    const stack = state.stack;
    const y = stack.pop();
    const x = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'SPVFS[]', y, x);

    state.pv = state.dpv = getUnitVector(x, y);
}

// SFVFS[] Set Freedom Vector From Stack
// 0x0B
function SFVFS(state) {
    const stack = state.stack;
    const y = stack.pop();
    const x = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'SPVFS[]', y, x);

    state.fv = getUnitVector(x, y);
}

// GPV[] Get Projection Vector
// 0x0C
function GPV(state) {
    const stack = state.stack;
    const pv = state.pv;

    if (exports.DEBUG) console.log(state.step, 'GPV[]');

    stack.push(pv.x * 0x4000);
    stack.push(pv.y * 0x4000);
}

// GFV[] Get Freedom Vector
// 0x0C
function GFV(state) {
    const stack = state.stack;
    const fv = state.fv;

    if (exports.DEBUG) console.log(state.step, 'GFV[]');

    stack.push(fv.x * 0x4000);
    stack.push(fv.y * 0x4000);
}

// SFVTPV[] Set Freedom Vector To Projection Vector
// 0x0E
function SFVTPV(state) {
    state.fv = state.pv;

    if (exports.DEBUG) console.log(state.step, 'SFVTPV[]');
}

// ISECT[] moves point p to the InterSECTion of two lines
// 0x0F
function ISECT(state)
{
    const stack = state.stack;
    const pa0i = stack.pop();
    const pa1i = stack.pop();
    const pb0i = stack.pop();
    const pb1i = stack.pop();
    const pi = stack.pop();
    const z0 = state.z0;
    const z1 = state.z1;
    const pa0 = z0[pa0i];
    const pa1 = z0[pa1i];
    const pb0 = z1[pb0i];
    const pb1 = z1[pb1i];
    const p = state.z2[pi];

    if (exports.DEBUG) console.log('ISECT[], ', pa0i, pa1i, pb0i, pb1i, pi);

    // math from
    // en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line

    const x1 = pa0.x;
    const y1 = pa0.y;
    const x2 = pa1.x;
    const y2 = pa1.y;
    const x3 = pb0.x;
    const y3 = pb0.y;
    const x4 = pb1.x;
    const y4 = pb1.y;

    const div = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    const f1 = x1 * y2 - y1 * x2;
    const f2 = x3 * y4 - y3 * x4;

    p.x = (f1 * (x3 - x4) - f2 * (x1 - x2)) / div;
    p.y = (f1 * (y3 - y4) - f2 * (y1 - y2)) / div;
}

// SRP0[] Set Reference Point 0
// 0x10
function SRP0(state) {
    state.rp0 = state.stack.pop();

    if (exports.DEBUG) console.log(state.step, 'SRP0[]', state.rp0);
}

// SRP1[] Set Reference Point 1
// 0x11
function SRP1(state) {
    state.rp1 = state.stack.pop();

    if (exports.DEBUG) console.log(state.step, 'SRP1[]', state.rp1);
}

// SRP1[] Set Reference Point 2
// 0x12
function SRP2(state) {
    state.rp2 = state.stack.pop();

    if (exports.DEBUG) console.log(state.step, 'SRP2[]', state.rp2);
}

// SZP0[] Set Zone Pointer 0
// 0x13
function SZP0(state) {
    const n = state.stack.pop();

    if (exports.DEBUG) console.log(state.step, 'SZP0[]', n);

    state.zp0 = n;

    switch (n) {
        case 0:
            if (!state.tZone) initTZone(state);
            state.z0 = state.tZone;
            break;
        case 1 :
            state.z0 = state.gZone;
            break;
        default :
            throw new Error('Invalid zone pointer');
    }
}

// SZP1[] Set Zone Pointer 1
// 0x14
function SZP1(state) {
    const n = state.stack.pop();

    if (exports.DEBUG) console.log(state.step, 'SZP1[]', n);

    state.zp1 = n;

    switch (n) {
        case 0:
            if (!state.tZone) initTZone(state);
            state.z1 = state.tZone;
            break;
        case 1 :
            state.z1 = state.gZone;
            break;
        default :
            throw new Error('Invalid zone pointer');
    }
}

// SZP2[] Set Zone Pointer 2
// 0x15
function SZP2(state) {
    const n = state.stack.pop();

    if (exports.DEBUG) console.log(state.step, 'SZP2[]', n);

    state.zp2 = n;

    switch (n) {
        case 0:
            if (!state.tZone) initTZone(state);
            state.z2 = state.tZone;
            break;
        case 1 :
            state.z2 = state.gZone;
            break;
        default :
            throw new Error('Invalid zone pointer');
    }
}

// SZPS[] Set Zone PointerS
// 0x16
function SZPS(state) {
    const n = state.stack.pop();

    if (exports.DEBUG) console.log(state.step, 'SZPS[]', n);

    state.zp0 = state.zp1 = state.zp2 = n;

    switch (n) {
        case 0:
            if (!state.tZone) initTZone(state);
            state.z0 = state.z1 = state.z2 = state.tZone;
            break;
        case 1 :
            state.z0 = state.z1 = state.z2 = state.gZone;
            break;
        default :
            throw new Error('Invalid zone pointer');
    }
}

// SLOOP[] Set LOOP variable
// 0x17
function SLOOP(state) {
    state.loop = state.stack.pop();

    if (exports.DEBUG) console.log(state.step, 'SLOOP[]', state.loop);
}

// RTG[] Round To Grid
// 0x18
function RTG(state) {
    if (exports.DEBUG) console.log(state.step, 'RTG[]');

    state.round = roundToGrid;
}

// RTHG[] Round To Half Grid
// 0x19
function RTHG(state) {
    if (exports.DEBUG) console.log(state.step, 'RTHG[]');

    state.round = roundToHalfGrid;
}

// SMD[] Set Minimum Distance
// 0x1A
function SMD(state) {
    const d = state.stack.pop();

    if (exports.DEBUG) console.log(state.step, 'SMD[]', d);

    state.minDis = d / 0x40;
}

// ELSE[] ELSE clause
// 0x1B
function ELSE(state) {
    // This instruction has been reached by executing a then branch
    // so it just skips ahead until matching EIF.
    //
    // In case the IF was negative the IF[] instruction already
    // skipped forward over the ELSE[]

    if (exports.DEBUG) console.log(state.step, 'ELSE[]');

    skip(state, false);
}

// JMPR[] JuMP Relative
// 0x1C
function JMPR(state) {
    const o = state.stack.pop();

    if (exports.DEBUG) console.log(state.step, 'JMPR[]', o);

    // A jump by 1 would do nothing.
    state.ip += o - 1;
}

// SCVTCI[] Set Control Value Table Cut-In
// 0x1D
function SCVTCI(state) {
    const n = state.stack.pop();

    if (exports.DEBUG) console.log(state.step, 'SCVTCI[]', n);

    state.cvCutIn = n / 0x40;
}

// DUP[] DUPlicate top stack element
// 0x20
function DUP(state) {
    const stack = state.stack;

    if (exports.DEBUG) console.log(state.step, 'DUP[]');

    stack.push(stack[stack.length - 1]);
}

// POP[] POP top stack element
// 0x21
function POP(state) {
    if (exports.DEBUG) console.log(state.step, 'POP[]');

    state.stack.pop();
}

// CLEAR[] CLEAR the stack
// 0x22
function CLEAR(state) {
    if (exports.DEBUG) console.log(state.step, 'CLEAR[]');

    state.stack.length = 0;
}

// SWAP[] SWAP the top two elements on the stack
// 0x23
function SWAP(state) {
    const stack = state.stack;

    const a = stack.pop();
    const b = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'SWAP[]');

    stack.push(a);
    stack.push(b);
}

// DEPTH[] DEPTH of the stack
// 0x24
function DEPTH(state) {
    const stack = state.stack;

    if (exports.DEBUG) console.log(state.step, 'DEPTH[]');

    stack.push(stack.length);
}

// LOOPCALL[] LOOPCALL function
// 0x2A
function LOOPCALL(state) {
    const stack = state.stack;
    const fn = stack.pop();
    const c = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'LOOPCALL[]', fn, c);

    // saves callers program
    const cip = state.ip;
    const cprog = state.prog;

    state.prog = state.funcs[fn];

    // executes the function
    for (let i = 0; i < c; i++) {
        exec(state);

        if (exports.DEBUG) console.log(
            ++state.step,
            i + 1 < c ? 'next loopcall' : 'done loopcall',
            i
        );
    }

    // restores the callers program
    state.ip = cip;
    state.prog = cprog;
}

// CALL[] CALL function
// 0x2B
function CALL(state) {
    const fn = state.stack.pop();

    if (exports.DEBUG) console.log(state.step, 'CALL[]', fn);

    // saves callers program
    const cip = state.ip;
    const cprog = state.prog;

    state.prog = state.funcs[fn];

    // executes the function
    exec(state);

    // restores the callers program
    state.ip = cip;
    state.prog = cprog;

    if (exports.DEBUG) console.log(++state.step, 'returning from', fn);
}

// CINDEX[] Copy the INDEXed element to the top of the stack
// 0x25
function CINDEX(state) {
    const stack = state.stack;
    const k = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'CINDEX[]', k);

    // In case of k == 1, it copies the last element after popping
    // thus stack.length - k.
    stack.push(stack[stack.length - k]);
}

// MINDEX[] Move the INDEXed element to the top of the stack
// 0x26
function MINDEX(state) {
    const stack = state.stack;
    const k = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'MINDEX[]', k);

    stack.push(stack.splice(stack.length - k, 1)[0]);
}

// FDEF[] Function DEFinition
// 0x2C
function FDEF(state) {
    if (state.env !== 'fpgm') throw new Error('FDEF not allowed here');
    const stack = state.stack;
    const prog = state.prog;
    let ip = state.ip;

    const fn = stack.pop();
    const ipBegin = ip;

    if (exports.DEBUG) console.log(state.step, 'FDEF[]', fn);

    while (prog[++ip] !== 0x2D);

    state.ip = ip;
    state.funcs[fn] = prog.slice(ipBegin + 1, ip);
}

// MDAP[a] Move Direct Absolute Point
// 0x2E-0x2F
function MDAP(round, state) {
    const pi = state.stack.pop();
    const p = state.z0[pi];
    const fv = state.fv;
    const pv = state.pv;

    if (exports.DEBUG) console.log(state.step, 'MDAP[' + round + ']', pi);

    let d = pv.distance(p, HPZero);

    if (round) d = state.round(d);

    fv.setRelative(p, HPZero, d, pv);
    fv.touch(p);

    state.rp0 = state.rp1 = pi;
}

// IUP[a] Interpolate Untouched Points through the outline
// 0x30
function IUP(v, state) {
    const z2 = state.z2;
    const pLen = z2.length - 2;
    let cp;
    let pp;
    let np;

    if (exports.DEBUG) console.log(state.step, 'IUP[' + v.axis + ']');

    for (let i = 0; i < pLen; i++) {
        cp = z2[i]; // current point

        // if this point has been touched go on
        if (v.touched(cp)) continue;

        pp = cp.prevTouched(v);

        // no point on the contour has been touched?
        if (pp === cp) continue;

        np = cp.nextTouched(v);

        if (pp === np) {
            // only one point on the contour has been touched
            // so simply moves the point like that

            v.setRelative(cp, cp, v.distance(pp, pp, false, true), v, true);
        }

        v.interpolate(cp, pp, np, v);
    }
}

// SHP[] SHift Point using reference point
// 0x32-0x33
function SHP(a, state) {
    const stack = state.stack;
    const rpi = a ? state.rp1 : state.rp2;
    const rp = (a ? state.z0 : state.z1)[rpi];
    const fv = state.fv;
    const pv = state.pv;
    let loop = state.loop;
    const z2 = state.z2;

    while (loop--)
    {
        const pi = stack.pop();
        const p = z2[pi];

        const d = pv.distance(rp, rp, false, true);
        fv.setRelative(p, p, d, pv);
        fv.touch(p);

        if (exports.DEBUG) {
            console.log(
                state.step,
                (state.loop > 1 ?
                   'loop ' + (state.loop - loop) + ': ' :
                   ''
                ) +
                'SHP[' + (a ? 'rp1' : 'rp2') + ']', pi
            );
        }
    }

    state.loop = 1;
}

// SHC[] SHift Contour using reference point
// 0x36-0x37
function SHC(a, state) {
    const stack = state.stack;
    const rpi = a ? state.rp1 : state.rp2;
    const rp = (a ? state.z0 : state.z1)[rpi];
    const fv = state.fv;
    const pv = state.pv;
    const ci = stack.pop();
    const sp = state.z2[state.contours[ci]];
    let p = sp;

    if (exports.DEBUG) console.log(state.step, 'SHC[' + a + ']', ci);

    const d = pv.distance(rp, rp, false, true);

    do {
        if (p !== rp) fv.setRelative(p, p, d, pv);
        p = p.nextPointOnContour;
    } while (p !== sp);
}

// SHZ[] SHift Zone using reference point
// 0x36-0x37
function SHZ(a, state) {
    const stack = state.stack;
    const rpi = a ? state.rp1 : state.rp2;
    const rp = (a ? state.z0 : state.z1)[rpi];
    const fv = state.fv;
    const pv = state.pv;

    const e = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'SHZ[' + a + ']', e);

    let z;
    switch (e) {
        case 0 : z = state.tZone; break;
        case 1 : z = state.gZone; break;
        default : throw new Error('Invalid zone');
    }

    let p;
    const d = pv.distance(rp, rp, false, true);
    const pLen = z.length - 2;
    for (let i = 0; i < pLen; i++)
    {
        p = z[i];
        fv.setRelative(p, p, d, pv);
        //if (p !== rp) fv.setRelative(p, p, d, pv);
    }
}

// SHPIX[] SHift point by a PIXel amount
// 0x38
function SHPIX(state) {
    const stack = state.stack;
    let loop = state.loop;
    const fv = state.fv;
    const d = stack.pop() / 0x40;
    const z2 = state.z2;

    while (loop--) {
        const pi = stack.pop();
        const p = z2[pi];

        if (exports.DEBUG) {
            console.log(
                state.step,
                (state.loop > 1 ? 'loop ' + (state.loop - loop) + ': ' : '') +
                'SHPIX[]', pi, d
            );
        }

        fv.setRelative(p, p, d);
        fv.touch(p);
    }

    state.loop = 1;
}

// IP[] Interpolate Point
// 0x39
function IP(state) {
    const stack = state.stack;
    const rp1i = state.rp1;
    const rp2i = state.rp2;
    let loop = state.loop;
    const rp1 = state.z0[rp1i];
    const rp2 = state.z1[rp2i];
    const fv = state.fv;
    const pv = state.dpv;
    const z2 = state.z2;

    while (loop--) {
        const pi = stack.pop();
        const p = z2[pi];

        if (exports.DEBUG) {
            console.log(
                state.step,
                (state.loop > 1 ? 'loop ' + (state.loop - loop) + ': ' : '') +
                'IP[]', pi, rp1i, '<->', rp2i
            );
        }

        fv.interpolate(p, rp1, rp2, pv);

        fv.touch(p);
    }

    state.loop = 1;
}

// MSIRP[a] Move Stack Indirect Relative Point
// 0x3A-0x3B
function MSIRP(a, state) {
    const stack = state.stack;
    const d = stack.pop() / 64;
    const pi = stack.pop();
    const p = state.z1[pi];
    const rp0 = state.z0[state.rp0];
    const fv = state.fv;
    const pv = state.pv;

    fv.setRelative(p, rp0, d, pv);
    fv.touch(p);

    if (exports.DEBUG) console.log(state.step, 'MSIRP[' + a + ']', d, pi);

    state.rp1 = state.rp0;
    state.rp2 = pi;
    if (a) state.rp0 = pi;
}

// ALIGNRP[] Align to reference point.
// 0x3C
function ALIGNRP(state) {
    const stack = state.stack;
    const rp0i = state.rp0;
    const rp0 = state.z0[rp0i];
    let loop = state.loop;
    const fv = state.fv;
    const pv = state.pv;
    const z1 = state.z1;

    while (loop--) {
        const pi = stack.pop();
        const p = z1[pi];

        if (exports.DEBUG) {
            console.log(
                state.step,
                (state.loop > 1 ? 'loop ' + (state.loop - loop) + ': ' : '') +
                'ALIGNRP[]', pi
            );
        }

        fv.setRelative(p, rp0, 0, pv);
        fv.touch(p);
    }

    state.loop = 1;
}

// RTG[] Round To Double Grid
// 0x3D
function RTDG(state) {
    if (exports.DEBUG) console.log(state.step, 'RTDG[]');

    state.round = roundToDoubleGrid;
}

// MIAP[a] Move Indirect Absolute Point
// 0x3E-0x3F
function MIAP(round, state) {
    const stack = state.stack;
    const n = stack.pop();
    const pi = stack.pop();
    const p = state.z0[pi];
    const fv = state.fv;
    const pv = state.pv;
    let cv = state.cvt[n];

    if (exports.DEBUG) {
        console.log(
            state.step,
            'MIAP[' + round + ']',
            n, '(', cv, ')', pi
        );
    }

    let d = pv.distance(p, HPZero);

    if (round) {
        if (Math.abs(d - cv) < state.cvCutIn) d = cv;

        d = state.round(d);
    }

    fv.setRelative(p, HPZero, d, pv);

    if (state.zp0 === 0) {
        p.xo = p.x;
        p.yo = p.y;
    }

    fv.touch(p);

    state.rp0 = state.rp1 = pi;
}

// NPUSB[] PUSH N Bytes
// 0x40
function NPUSHB(state) {
    const prog = state.prog;
    let ip = state.ip;
    const stack = state.stack;

    const n = prog[++ip];

    if (exports.DEBUG) console.log(state.step, 'NPUSHB[]', n);

    for (let i = 0; i < n; i++) stack.push(prog[++ip]);

    state.ip = ip;
}

// NPUSHW[] PUSH N Words
// 0x41
function NPUSHW(state) {
    let ip = state.ip;
    const prog = state.prog;
    const stack = state.stack;
    const n = prog[++ip];

    if (exports.DEBUG) console.log(state.step, 'NPUSHW[]', n);

    for (let i = 0; i < n; i++) {
        let w = (prog[++ip] << 8) | prog[++ip];
        if (w & 0x8000) w = -((w ^ 0xffff) + 1);
        stack.push(w);
    }

    state.ip = ip;
}

// WS[] Write Store
// 0x42
function WS(state) {
    const stack = state.stack;
    let store = state.store;

    if (!store) store = state.store = [];

    const v = stack.pop();
    const l = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'WS', v, l);

    store[l] = v;
}

// RS[] Read Store
// 0x43
function RS(state) {
    const stack = state.stack;
    const store = state.store;

    const l = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'RS', l);

    const v = (store && store[l]) || 0;

    stack.push(v);
}

// WCVTP[] Write Control Value Table in Pixel units
// 0x44
function WCVTP(state) {
    const stack = state.stack;

    const v = stack.pop();
    const l = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'WCVTP', v, l);

    state.cvt[l] = v / 0x40;
}

// RCVT[] Read Control Value Table entry
// 0x45
function RCVT(state) {
    const stack = state.stack;
    const cvte = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'RCVT', cvte);

    stack.push(state.cvt[cvte] * 0x40);
}

// GC[] Get Coordinate projected onto the projection vector
// 0x46-0x47
function GC(a, state) {
    const stack = state.stack;
    const pi = stack.pop();
    const p = state.z2[pi];

    if (exports.DEBUG) console.log(state.step, 'GC[' + a + ']', pi);

    stack.push(state.dpv.distance(p, HPZero, a, false) * 0x40);
}

// MD[a] Measure Distance
// 0x49-0x4A
function MD(a, state) {
    const stack = state.stack;
    const pi2 = stack.pop();
    const pi1 = stack.pop();
    const p2 = state.z1[pi2];
    const p1 = state.z0[pi1];
    const d = state.dpv.distance(p1, p2, a, a);

    if (exports.DEBUG) console.log(state.step, 'MD[' + a + ']', pi2, pi1, '->', d);

    state.stack.push(Math.round(d * 64));
}

// MPPEM[] Measure Pixels Per EM
// 0x4B
function MPPEM(state) {
    if (exports.DEBUG) console.log(state.step, 'MPPEM[]');
    state.stack.push(state.ppem);
}

// FLIPON[] set the auto FLIP Boolean to ON
// 0x4D
function FLIPON(state) {
    if (exports.DEBUG) console.log(state.step, 'FLIPON[]');
    state.autoFlip = true;
}

// LT[] Less Than
// 0x50
function LT(state) {
    const stack = state.stack;
    const e2 = stack.pop();
    const e1 = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'LT[]', e2, e1);

    stack.push(e1 < e2 ? 1 : 0);
}

// LTEQ[] Less Than or EQual
// 0x53
function LTEQ(state) {
    const stack = state.stack;
    const e2 = stack.pop();
    const e1 = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'LTEQ[]', e2, e1);

    stack.push(e1 <= e2 ? 1 : 0);
}

// GTEQ[] Greater Than
// 0x52
function GT(state) {
    const stack = state.stack;
    const e2 = stack.pop();
    const e1 = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'GT[]', e2, e1);

    stack.push(e1 > e2 ? 1 : 0);
}

// GTEQ[] Greater Than or EQual
// 0x53
function GTEQ(state) {
    const stack = state.stack;
    const e2 = stack.pop();
    const e1 = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'GTEQ[]', e2, e1);

    stack.push(e1 >= e2 ? 1 : 0);
}

// EQ[] EQual
// 0x54
function EQ(state) {
    const stack = state.stack;
    const e2 = stack.pop();
    const e1 = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'EQ[]', e2, e1);

    stack.push(e2 === e1 ? 1 : 0);
}

// NEQ[] Not EQual
// 0x55
function NEQ(state) {
    const stack = state.stack;
    const e2 = stack.pop();
    const e1 = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'NEQ[]', e2, e1);

    stack.push(e2 !== e1 ? 1 : 0);
}

// ODD[] ODD
// 0x56
function ODD(state) {
    const stack = state.stack;
    const n = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'ODD[]', n);

    stack.push(Math.trunc(n) % 2 ? 1 : 0);
}

// EVEN[] EVEN
// 0x57
function EVEN(state) {
    const stack = state.stack;
    const n = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'EVEN[]', n);

    stack.push(Math.trunc(n) % 2 ? 0 : 1);
}

// IF[] IF test
// 0x58
function IF(state) {
    let test = state.stack.pop();
    let ins;

    if (exports.DEBUG) console.log(state.step, 'IF[]', test);

    // if test is true it just continues
    // if not the ip is skipped until matching ELSE or EIF
    if (!test) {
        skip(state, true);

        if (exports.DEBUG) console.log(state.step, ins === 0x1B ? 'ELSE[]' : 'EIF[]');
    }
}

// EIF[] End IF
// 0x59
function EIF(state) {
    // this can be reached normally when
    // executing an else branch.
    // -> just ignore it

    if (exports.DEBUG) console.log(state.step, 'EIF[]');
}

// AND[] logical AND
// 0x5A
function AND(state) {
    const stack = state.stack;
    const e2 = stack.pop();
    const e1 = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'AND[]', e2, e1);

    stack.push(e2 && e1 ? 1 : 0);
}

// OR[] logical OR
// 0x5B
function OR(state) {
    const stack = state.stack;
    const e2 = stack.pop();
    const e1 = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'OR[]', e2, e1);

    stack.push(e2 || e1 ? 1 : 0);
}

// NOT[] logical NOT
// 0x5C
function NOT(state) {
    const stack = state.stack;
    const e = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'NOT[]', e);

    stack.push(e ? 0 : 1);
}

// DELTAP1[] DELTA exception P1
// DELTAP2[] DELTA exception P2
// DELTAP3[] DELTA exception P3
// 0x5D, 0x71, 0x72
function DELTAP123(b, state) {
    const stack = state.stack;
    const n = stack.pop();
    const fv = state.fv;
    const pv = state.pv;
    const ppem = state.ppem;
    const base = state.deltaBase + (b - 1) * 16;
    const ds = state.deltaShift;
    const z0 = state.z0;

    if (exports.DEBUG) console.log(state.step, 'DELTAP[' + b + ']', n, stack);

    for (let i = 0; i < n; i++) {
        const pi = stack.pop();
        const arg = stack.pop();
        const appem = base + ((arg & 0xF0) >> 4);
        if (appem !== ppem) continue;

        let mag = (arg & 0x0F) - 8;
        if (mag >= 0) mag++;
        if (exports.DEBUG) console.log(state.step, 'DELTAPFIX', pi, 'by', mag * ds);

        const p = z0[pi];
        fv.setRelative(p, p, mag * ds, pv);
    }
}

// SDB[] Set Delta Base in the graphics state
// 0x5E
function SDB(state) {
    const stack = state.stack;
    const n = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'SDB[]', n);

    state.deltaBase = n;
}

// SDS[] Set Delta Shift in the graphics state
// 0x5F
function SDS(state) {
    const stack = state.stack;
    const n = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'SDS[]', n);

    state.deltaShift = Math.pow(0.5, n);
}

// ADD[] ADD
// 0x60
function ADD(state) {
    const stack = state.stack;
    const n2 = stack.pop();
    const n1 = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'ADD[]', n2, n1);

    stack.push(n1 + n2);
}

// SUB[] SUB
// 0x61
function SUB(state) {
    const stack = state.stack;
    const n2 = stack.pop();
    const n1 = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'SUB[]', n2, n1);

    stack.push(n1 - n2);
}

// DIV[] DIV
// 0x62
function DIV(state) {
    const stack = state.stack;
    const n2 = stack.pop();
    const n1 = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'DIV[]', n2, n1);

    stack.push(n1 * 64 / n2);
}

// MUL[] MUL
// 0x63
function MUL(state) {
    const stack = state.stack;
    const n2 = stack.pop();
    const n1 = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'MUL[]', n2, n1);

    stack.push(n1 * n2 / 64);
}

// ABS[] ABSolute value
// 0x64
function ABS(state) {
    const stack = state.stack;
    const n = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'ABS[]', n);

    stack.push(Math.abs(n));
}

// NEG[] NEGate
// 0x65
function NEG(state) {
    const stack = state.stack;
    let n = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'NEG[]', n);

    stack.push(-n);
}

// FLOOR[] FLOOR
// 0x66
function FLOOR(state) {
    const stack = state.stack;
    const n = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'FLOOR[]', n);

    stack.push(Math.floor(n / 0x40) * 0x40);
}

// CEILING[] CEILING
// 0x67
function CEILING(state) {
    const stack = state.stack;
    const n = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'CEILING[]', n);

    stack.push(Math.ceil(n / 0x40) * 0x40);
}

// ROUND[ab] ROUND value
// 0x68-0x6B
function ROUND(dt, state) {
    const stack = state.stack;
    const n = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'ROUND[]');

    stack.push(state.round(n / 0x40) * 0x40);
}

// WCVTF[] Write Control Value Table in Funits
// 0x70
function WCVTF(state) {
    const stack = state.stack;
    const v = stack.pop();
    const l = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'WCVTF[]', v, l);

    state.cvt[l] = v * state.ppem / state.font.unitsPerEm;
}

// DELTAC1[] DELTA exception C1
// DELTAC2[] DELTA exception C2
// DELTAC3[] DELTA exception C3
// 0x73, 0x74, 0x75
function DELTAC123(b, state) {
    const stack = state.stack;
    const n = stack.pop();
    const ppem = state.ppem;
    const base = state.deltaBase + (b - 1) * 16;
    const ds = state.deltaShift;

    if (exports.DEBUG) console.log(state.step, 'DELTAC[' + b + ']', n, stack);

    for (let i = 0; i < n; i++) {
        const c = stack.pop();
        const arg = stack.pop();
        const appem = base + ((arg & 0xF0) >> 4);
        if (appem !== ppem) continue;

        let mag = (arg & 0x0F) - 8;
        if (mag >= 0) mag++;

        const delta = mag * ds;

        if (exports.DEBUG) console.log(state.step, 'DELTACFIX', c, 'by', delta);

        state.cvt[c] += delta;
    }
}

// SROUND[] Super ROUND
// 0x76
function SROUND(state) {
    let n = state.stack.pop();

    if (exports.DEBUG) console.log(state.step, 'SROUND[]', n);

    state.round = roundSuper;

    let period;

    switch (n & 0xC0) {
        case 0x00:
            period = 0.5;
            break;
        case 0x40:
            period = 1;
            break;
        case 0x80:
            period = 2;
            break;
        default:
            throw new Error('invalid SROUND value');
    }

    state.srPeriod = period;

    switch (n & 0x30) {
        case 0x00:
            state.srPhase = 0;
            break;
        case 0x10:
            state.srPhase = 0.25 * period;
            break;
        case 0x20:
            state.srPhase = 0.5  * period;
            break;
        case 0x30:
            state.srPhase = 0.75 * period;
            break;
        default: throw new Error('invalid SROUND value');
    }

    n &= 0x0F;

    if (n === 0) state.srThreshold = 0;
    else state.srThreshold = (n / 8 - 0.5) * period;
}

// S45ROUND[] Super ROUND 45 degrees
// 0x77
function S45ROUND(state) {
    let n = state.stack.pop();

    if (exports.DEBUG) console.log(state.step, 'S45ROUND[]', n);

    state.round = roundSuper;

    let period;

    switch (n & 0xC0) {
        case 0x00:
            period = Math.sqrt(2) / 2;
            break;
        case 0x40:
            period = Math.sqrt(2);
            break;
        case 0x80:
            period = 2 * Math.sqrt(2);
            break;
        default:
            throw new Error('invalid S45ROUND value');
    }

    state.srPeriod = period;

    switch (n & 0x30) {
        case 0x00:
            state.srPhase = 0;
            break;
        case 0x10:
            state.srPhase = 0.25 * period;
            break;
        case 0x20:
            state.srPhase = 0.5  * period;
            break;
        case 0x30:
            state.srPhase = 0.75 * period;
            break;
        default:
            throw new Error('invalid S45ROUND value');
    }

    n &= 0x0F;

    if (n === 0) state.srThreshold = 0;
    else state.srThreshold = (n / 8 - 0.5) * period;
}

// ROFF[] Round Off
// 0x7A
function ROFF(state) {
    if (exports.DEBUG) console.log(state.step, 'ROFF[]');

    state.round = roundOff;
}

// RUTG[] Round Up To Grid
// 0x7C
function RUTG(state) {
    if (exports.DEBUG) console.log(state.step, 'RUTG[]');

    state.round = roundUpToGrid;
}

// RDTG[] Round Down To Grid
// 0x7D
function RDTG(state) {
    if (exports.DEBUG) console.log(state.step, 'RDTG[]');

    state.round = roundDownToGrid;
}

// SCANCTRL[] SCAN conversion ConTRoL
// 0x85
function SCANCTRL(state) {
    const n = state.stack.pop();

    // ignored by opentype.js

    if (exports.DEBUG) console.log(state.step, 'SCANCTRL[]', n);
}

// SDPVTL[a] Set Dual Projection Vector To Line
// 0x86-0x87
function SDPVTL(a, state) {
    const stack = state.stack;
    const p2i = stack.pop();
    const p1i = stack.pop();
    const p2 = state.z2[p2i];
    const p1 = state.z1[p1i];

    if (exports.DEBUG) console.log(state.step, 'SDPVTL[' + a + ']', p2i, p1i);

    let dx;
    let dy;

    if (!a) {
        dx = p1.x - p2.x;
        dy = p1.y - p2.y;
    } else {
        dx = p2.y - p1.y;
        dy = p1.x - p2.x;
    }

    state.dpv = getUnitVector(dx, dy);
}

// GETINFO[] GET INFOrmation
// 0x88
function GETINFO(state) {
    const stack = state.stack;
    const sel = stack.pop();
    let r = 0;

    if (exports.DEBUG) console.log(state.step, 'GETINFO[]', sel);

    // v35 as in no subpixel hinting
    if (sel & 0x01) r = 35;

    // TODO rotation and stretch currently not supported
    // and thus those GETINFO are always 0.

    // opentype.js is always gray scaling
    if (sel & 0x20) r |= 0x1000;

    stack.push(r);
}

// ROLL[] ROLL the top three stack elements
// 0x8A
function ROLL(state) {
    const stack = state.stack;
    const a = stack.pop();
    const b = stack.pop();
    const c = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'ROLL[]');

    stack.push(b);
    stack.push(a);
    stack.push(c);
}

// MAX[] MAXimum of top two stack elements
// 0x8B
function MAX(state) {
    const stack = state.stack;
    const e2 = stack.pop();
    const e1 = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'MAX[]', e2, e1);

    stack.push(Math.max(e1, e2));
}

// MIN[] MINimum of top two stack elements
// 0x8C
function MIN(state) {
    const stack = state.stack;
    const e2 = stack.pop();
    const e1 = stack.pop();

    if (exports.DEBUG) console.log(state.step, 'MIN[]', e2, e1);

    stack.push(Math.min(e1, e2));
}

// SCANTYPE[] SCANTYPE
// 0x8D
function SCANTYPE(state) {
    const n = state.stack.pop();
    // ignored by opentype.js
    if (exports.DEBUG) console.log(state.step, 'SCANTYPE[]', n);
}

// INSTCTRL[] INSTCTRL
// 0x8D
function INSTCTRL(state) {
    const s = state.stack.pop();
    let v = state.stack.pop();

    if (exports.DEBUG) console.log(state.step, 'INSTCTRL[]', s, v);

    switch (s) {
        case 1 : state.inhibitGridFit = !!v; return;
        case 2 : state.ignoreCvt = !!v; return;
        default: throw new Error('invalid INSTCTRL[] selector');
    }
}

// PUSHB[abc] PUSH Bytes
// 0xB0-0xB7
function PUSHB(n, state) {
    const stack = state.stack;
    const prog = state.prog;
    let ip = state.ip;

    if (exports.DEBUG) console.log(state.step, 'PUSHB[' + n + ']');

    for (let i = 0; i < n; i++) stack.push(prog[++ip]);

    state.ip = ip;
}

// PUSHW[abc] PUSH Words
// 0xB8-0xBF
function PUSHW(n, state) {
    let ip = state.ip;
    const prog = state.prog;
    const stack = state.stack;

    if (exports.DEBUG) console.log(state.ip, 'PUSHW[' + n + ']');

    for (let i = 0; i < n; i++) {
        let w = (prog[++ip] << 8) | prog[++ip];
        if (w & 0x8000) w = -((w ^ 0xffff) + 1);
        stack.push(w);
    }

    state.ip = ip;
}

// MDRP[abcde] Move Direct Relative Point
// 0xD0-0xEF
// (if indirect is 0)
//
// and
//
// MIRP[abcde] Move Indirect Relative Point
// 0xE0-0xFF
// (if indirect is 1)

function MDRP_MIRP(indirect, setRp0, keepD, ro, dt, state) {
    const stack = state.stack;
    const cvte = indirect && stack.pop();
    const pi = stack.pop();
    const rp0i = state.rp0;
    const rp = state.z0[rp0i];
    const p = state.z1[pi];

    const md = state.minDis;
    const fv = state.fv;
    const pv = state.dpv;
    let od; // original distance
    let d; // moving distance
    let sign; // sign of distance
    let cv;

    d = od = pv.distance(p, rp, true, true);
    sign = d >= 0 ? 1 : -1; // Math.sign would be 0 in case of 0

    // TODO consider autoFlip
    d = Math.abs(d);

    if (indirect) {
        cv = state.cvt[cvte];

        if (ro && Math.abs(d - cv) < state.cvCutIn) d = cv;
    }

    if (keepD && d < md) d = md;

    if (ro) d = state.round(d);

    fv.setRelative(p, rp, sign * d, pv);
    fv.touch(p);

    if (exports.DEBUG) {
        console.log(
            state.step,
            (indirect ? 'MIRP[' : 'MDRP[') +
            (setRp0 ? 'M' : 'm') +
            (keepD ? '>' : '_') +
            (ro ? 'R' : '_') +
            (dt === 0 ? 'Gr' : (dt === 1 ? 'Bl' : (dt === 2 ? 'Wh' : ''))) +
            ']',
            indirect ?
                cvte + '(' + state.cvt[cvte] + ',' +  cv + ')' :
                '',
            pi,
            '(d =', od, '->', sign * d, ')'
        );
    }

    state.rp1 = state.rp0;
    state.rp2 = pi;
    if (setRp0) state.rp0 = pi;
}

/*
* The instruction table.
*/
instructionTable = [
    /* 0x00 */ SVTCA.bind(undefined, yUnitVector),
    /* 0x01 */ SVTCA.bind(undefined, xUnitVector),
    /* 0x02 */ SPVTCA.bind(undefined, yUnitVector),
    /* 0x03 */ SPVTCA.bind(undefined, xUnitVector),
    /* 0x04 */ SFVTCA.bind(undefined, yUnitVector),
    /* 0x05 */ SFVTCA.bind(undefined, xUnitVector),
    /* 0x06 */ SPVTL.bind(undefined, 0),
    /* 0x07 */ SPVTL.bind(undefined, 1),
    /* 0x08 */ SFVTL.bind(undefined, 0),
    /* 0x09 */ SFVTL.bind(undefined, 1),
    /* 0x0A */ SPVFS,
    /* 0x0B */ SFVFS,
    /* 0x0C */ GPV,
    /* 0x0D */ GFV,
    /* 0x0E */ SFVTPV,
    /* 0x0F */ ISECT,
    /* 0x10 */ SRP0,
    /* 0x11 */ SRP1,
    /* 0x12 */ SRP2,
    /* 0x13 */ SZP0,
    /* 0x14 */ SZP1,
    /* 0x15 */ SZP2,
    /* 0x16 */ SZPS,
    /* 0x17 */ SLOOP,
    /* 0x18 */ RTG,
    /* 0x19 */ RTHG,
    /* 0x1A */ SMD,
    /* 0x1B */ ELSE,
    /* 0x1C */ JMPR,
    /* 0x1D */ SCVTCI,
    /* 0x1E */ undefined,   // TODO SSWCI
    /* 0x1F */ undefined,   // TODO SSW
    /* 0x20 */ DUP,
    /* 0x21 */ POP,
    /* 0x22 */ CLEAR,
    /* 0x23 */ SWAP,
    /* 0x24 */ DEPTH,
    /* 0x25 */ CINDEX,
    /* 0x26 */ MINDEX,
    /* 0x27 */ undefined,   // TODO ALIGNPTS
    /* 0x28 */ undefined,
    /* 0x29 */ undefined,   // TODO UTP
    /* 0x2A */ LOOPCALL,
    /* 0x2B */ CALL,
    /* 0x2C */ FDEF,
    /* 0x2D */ undefined,   // ENDF (eaten by FDEF)
    /* 0x2E */ MDAP.bind(undefined, 0),
    /* 0x2F */ MDAP.bind(undefined, 1),
    /* 0x30 */ IUP.bind(undefined, yUnitVector),
    /* 0x31 */ IUP.bind(undefined, xUnitVector),
    /* 0x32 */ SHP.bind(undefined, 0),
    /* 0x33 */ SHP.bind(undefined, 1),
    /* 0x34 */ SHC.bind(undefined, 0),
    /* 0x35 */ SHC.bind(undefined, 1),
    /* 0x36 */ SHZ.bind(undefined, 0),
    /* 0x37 */ SHZ.bind(undefined, 1),
    /* 0x38 */ SHPIX,
    /* 0x39 */ IP,
    /* 0x3A */ MSIRP.bind(undefined, 0),
    /* 0x3B */ MSIRP.bind(undefined, 1),
    /* 0x3C */ ALIGNRP,
    /* 0x3D */ RTDG,
    /* 0x3E */ MIAP.bind(undefined, 0),
    /* 0x3F */ MIAP.bind(undefined, 1),
    /* 0x40 */ NPUSHB,
    /* 0x41 */ NPUSHW,
    /* 0x42 */ WS,
    /* 0x43 */ RS,
    /* 0x44 */ WCVTP,
    /* 0x45 */ RCVT,
    /* 0x46 */ GC.bind(undefined, 0),
    /* 0x47 */ GC.bind(undefined, 1),
    /* 0x48 */ undefined,   // TODO SCFS
    /* 0x49 */ MD.bind(undefined, 0),
    /* 0x4A */ MD.bind(undefined, 1),
    /* 0x4B */ MPPEM,
    /* 0x4C */ undefined,   // TODO MPS
    /* 0x4D */ FLIPON,
    /* 0x4E */ undefined,   // TODO FLIPOFF
    /* 0x4F */ undefined,   // TODO DEBUG
    /* 0x50 */ LT,
    /* 0x51 */ LTEQ,
    /* 0x52 */ GT,
    /* 0x53 */ GTEQ,
    /* 0x54 */ EQ,
    /* 0x55 */ NEQ,
    /* 0x56 */ ODD,
    /* 0x57 */ EVEN,
    /* 0x58 */ IF,
    /* 0x59 */ EIF,
    /* 0x5A */ AND,
    /* 0x5B */ OR,
    /* 0x5C */ NOT,
    /* 0x5D */ DELTAP123.bind(undefined, 1),
    /* 0x5E */ SDB,
    /* 0x5F */ SDS,
    /* 0x60 */ ADD,
    /* 0x61 */ SUB,
    /* 0x62 */ DIV,
    /* 0x63 */ MUL,
    /* 0x64 */ ABS,
    /* 0x65 */ NEG,
    /* 0x66 */ FLOOR,
    /* 0x67 */ CEILING,
    /* 0x68 */ ROUND.bind(undefined, 0),
    /* 0x69 */ ROUND.bind(undefined, 1),
    /* 0x6A */ ROUND.bind(undefined, 2),
    /* 0x6B */ ROUND.bind(undefined, 3),
    /* 0x6C */ undefined,   // TODO NROUND[ab]
    /* 0x6D */ undefined,   // TODO NROUND[ab]
    /* 0x6E */ undefined,   // TODO NROUND[ab]
    /* 0x6F */ undefined,   // TODO NROUND[ab]
    /* 0x70 */ WCVTF,
    /* 0x71 */ DELTAP123.bind(undefined, 2),
    /* 0x72 */ DELTAP123.bind(undefined, 3),
    /* 0x73 */ DELTAC123.bind(undefined, 1),
    /* 0x74 */ DELTAC123.bind(undefined, 2),
    /* 0x75 */ DELTAC123.bind(undefined, 3),
    /* 0x76 */ SROUND,
    /* 0x77 */ S45ROUND,
    /* 0x78 */ undefined,   // TODO JROT[]
    /* 0x79 */ undefined,   // TODO JROF[]
    /* 0x7A */ ROFF,
    /* 0x7B */ undefined,
    /* 0x7C */ RUTG,
    /* 0x7D */ RDTG,
    /* 0x7E */ POP, // actually SANGW, supposed to do only a pop though
    /* 0x7F */ POP, // actually AA, supposed to do only a pop though
    /* 0x80 */ undefined,   // TODO FLIPPT
    /* 0x81 */ undefined,   // TODO FLIPRGON
    /* 0x82 */ undefined,   // TODO FLIPRGOFF
    /* 0x83 */ undefined,
    /* 0x84 */ undefined,
    /* 0x85 */ SCANCTRL,
    /* 0x86 */ SDPVTL.bind(undefined, 0),
    /* 0x87 */ SDPVTL.bind(undefined, 1),
    /* 0x88 */ GETINFO,
    /* 0x89 */ undefined,   // TODO IDEF
    /* 0x8A */ ROLL,
    /* 0x8B */ MAX,
    /* 0x8C */ MIN,
    /* 0x8D */ SCANTYPE,
    /* 0x8E */ INSTCTRL,
    /* 0x8F */ undefined,
    /* 0x90 */ undefined,
    /* 0x91 */ undefined,
    /* 0x92 */ undefined,
    /* 0x93 */ undefined,
    /* 0x94 */ undefined,
    /* 0x95 */ undefined,
    /* 0x96 */ undefined,
    /* 0x97 */ undefined,
    /* 0x98 */ undefined,
    /* 0x99 */ undefined,
    /* 0x9A */ undefined,
    /* 0x9B */ undefined,
    /* 0x9C */ undefined,
    /* 0x9D */ undefined,
    /* 0x9E */ undefined,
    /* 0x9F */ undefined,
    /* 0xA0 */ undefined,
    /* 0xA1 */ undefined,
    /* 0xA2 */ undefined,
    /* 0xA3 */ undefined,
    /* 0xA4 */ undefined,
    /* 0xA5 */ undefined,
    /* 0xA6 */ undefined,
    /* 0xA7 */ undefined,
    /* 0xA8 */ undefined,
    /* 0xA9 */ undefined,
    /* 0xAA */ undefined,
    /* 0xAB */ undefined,
    /* 0xAC */ undefined,
    /* 0xAD */ undefined,
    /* 0xAE */ undefined,
    /* 0xAF */ undefined,
    /* 0xB0 */ PUSHB.bind(undefined, 1),
    /* 0xB1 */ PUSHB.bind(undefined, 2),
    /* 0xB2 */ PUSHB.bind(undefined, 3),
    /* 0xB3 */ PUSHB.bind(undefined, 4),
    /* 0xB4 */ PUSHB.bind(undefined, 5),
    /* 0xB5 */ PUSHB.bind(undefined, 6),
    /* 0xB6 */ PUSHB.bind(undefined, 7),
    /* 0xB7 */ PUSHB.bind(undefined, 8),
    /* 0xB8 */ PUSHW.bind(undefined, 1),
    /* 0xB9 */ PUSHW.bind(undefined, 2),
    /* 0xBA */ PUSHW.bind(undefined, 3),
    /* 0xBB */ PUSHW.bind(undefined, 4),
    /* 0xBC */ PUSHW.bind(undefined, 5),
    /* 0xBD */ PUSHW.bind(undefined, 6),
    /* 0xBE */ PUSHW.bind(undefined, 7),
    /* 0xBF */ PUSHW.bind(undefined, 8),
    /* 0xC0 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 0, 0),
    /* 0xC1 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 0, 1),
    /* 0xC2 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 0, 2),
    /* 0xC3 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 0, 3),
    /* 0xC4 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 1, 0),
    /* 0xC5 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 1, 1),
    /* 0xC6 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 1, 2),
    /* 0xC7 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 1, 3),
    /* 0xC8 */ MDRP_MIRP.bind(undefined, 0, 0, 1, 0, 0),
    /* 0xC9 */ MDRP_MIRP.bind(undefined, 0, 0, 1, 0, 1),
    /* 0xCA */ MDRP_MIRP.bind(undefined, 0, 0, 1, 0, 2),
    /* 0xCB */ MDRP_MIRP.bind(undefined, 0, 0, 1, 0, 3),
    /* 0xCC */ MDRP_MIRP.bind(undefined, 0, 0, 1, 1, 0),
    /* 0xCD */ MDRP_MIRP.bind(undefined, 0, 0, 1, 1, 1),
    /* 0xCE */ MDRP_MIRP.bind(undefined, 0, 0, 1, 1, 2),
    /* 0xCF */ MDRP_MIRP.bind(undefined, 0, 0, 1, 1, 3),
    /* 0xD0 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 0, 0),
    /* 0xD1 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 0, 1),
    /* 0xD2 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 0, 2),
    /* 0xD3 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 0, 3),
    /* 0xD4 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 1, 0),
    /* 0xD5 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 1, 1),
    /* 0xD6 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 1, 2),
    /* 0xD7 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 1, 3),
    /* 0xD8 */ MDRP_MIRP.bind(undefined, 0, 1, 1, 0, 0),
    /* 0xD9 */ MDRP_MIRP.bind(undefined, 0, 1, 1, 0, 1),
    /* 0xDA */ MDRP_MIRP.bind(undefined, 0, 1, 1, 0, 2),
    /* 0xDB */ MDRP_MIRP.bind(undefined, 0, 1, 1, 0, 3),
    /* 0xDC */ MDRP_MIRP.bind(undefined, 0, 1, 1, 1, 0),
    /* 0xDD */ MDRP_MIRP.bind(undefined, 0, 1, 1, 1, 1),
    /* 0xDE */ MDRP_MIRP.bind(undefined, 0, 1, 1, 1, 2),
    /* 0xDF */ MDRP_MIRP.bind(undefined, 0, 1, 1, 1, 3),
    /* 0xE0 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 0, 0),
    /* 0xE1 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 0, 1),
    /* 0xE2 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 0, 2),
    /* 0xE3 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 0, 3),
    /* 0xE4 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 1, 0),
    /* 0xE5 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 1, 1),
    /* 0xE6 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 1, 2),
    /* 0xE7 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 1, 3),
    /* 0xE8 */ MDRP_MIRP.bind(undefined, 1, 0, 1, 0, 0),
    /* 0xE9 */ MDRP_MIRP.bind(undefined, 1, 0, 1, 0, 1),
    /* 0xEA */ MDRP_MIRP.bind(undefined, 1, 0, 1, 0, 2),
    /* 0xEB */ MDRP_MIRP.bind(undefined, 1, 0, 1, 0, 3),
    /* 0xEC */ MDRP_MIRP.bind(undefined, 1, 0, 1, 1, 0),
    /* 0xED */ MDRP_MIRP.bind(undefined, 1, 0, 1, 1, 1),
    /* 0xEE */ MDRP_MIRP.bind(undefined, 1, 0, 1, 1, 2),
    /* 0xEF */ MDRP_MIRP.bind(undefined, 1, 0, 1, 1, 3),
    /* 0xF0 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 0, 0),
    /* 0xF1 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 0, 1),
    /* 0xF2 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 0, 2),
    /* 0xF3 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 0, 3),
    /* 0xF4 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 1, 0),
    /* 0xF5 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 1, 1),
    /* 0xF6 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 1, 2),
    /* 0xF7 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 1, 3),
    /* 0xF8 */ MDRP_MIRP.bind(undefined, 1, 1, 1, 0, 0),
    /* 0xF9 */ MDRP_MIRP.bind(undefined, 1, 1, 1, 0, 1),
    /* 0xFA */ MDRP_MIRP.bind(undefined, 1, 1, 1, 0, 2),
    /* 0xFB */ MDRP_MIRP.bind(undefined, 1, 1, 1, 0, 3),
    /* 0xFC */ MDRP_MIRP.bind(undefined, 1, 1, 1, 1, 0),
    /* 0xFD */ MDRP_MIRP.bind(undefined, 1, 1, 1, 1, 1),
    /* 0xFE */ MDRP_MIRP.bind(undefined, 1, 1, 1, 1, 2),
    /* 0xFF */ MDRP_MIRP.bind(undefined, 1, 1, 1, 1, 3)
];

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Hinting);

/*****************************
  Mathematical Considerations
******************************

fv ... refers to freedom vector
pv ... refers to projection vector
rp ... refers to reference point
p  ... refers to to point being operated on
d  ... refers to distance

SETRELATIVE:
============

case freedom vector == x-axis:
------------------------------

                        (pv)
                     .-'
              rpd .-'
               .-*
          d .-'90°'
         .-'       '
      .-'           '
   *-'               ' b
  rp                  '
                       '
                        '
            p *----------*-------------- (fv)
                          pm

  rpdx = rpx + d * pv.x
  rpdy = rpy + d * pv.y

  equation of line b

   y - rpdy = pvns * (x- rpdx)

   y = p.y

   x = rpdx + ( p.y - rpdy ) / pvns


case freedom vector == y-axis:
------------------------------

    * pm
    |\
    | \
    |  \
    |   \
    |    \
    |     \
    |      \
    |       \
    |        \
    |         \ b
    |          \
    |           \
    |            \    .-' (pv)
    |         90° \.-'
    |           .-'* rpd
    |        .-'
    *     *-'  d
    p     rp

  rpdx = rpx + d * pv.x
  rpdy = rpy + d * pv.y

  equation of line b:
           pvns ... normal slope to pv

   y - rpdy = pvns * (x - rpdx)

   x = p.x

   y = rpdy +  pvns * (p.x - rpdx)



generic case:
-------------


                              .'(fv)
                            .'
                          .* pm
                        .' !
                      .'    .
                    .'      !
                  .'         . b
                .'           !
               *              .
              p               !
                         90°   .    ... (pv)
                           ...-*-'''
                  ...---'''    rpd
         ...---'''   d
   *--'''
  rp

    rpdx = rpx + d * pv.x
    rpdy = rpy + d * pv.y

 equation of line b:
    pvns... normal slope to pv

    y - rpdy = pvns * (x - rpdx)

 equation of freedom vector line:
    fvs ... slope of freedom vector (=fy/fx)

    y - py = fvs * (x - px)


  on pm both equations are true for same x/y

    y - rpdy = pvns * (x - rpdx)

    y - py = fvs * (x - px)

  form to y and set equal:

    pvns * (x - rpdx) + rpdy = fvs * (x - px) + py

  expand:

    pvns * x - pvns * rpdx + rpdy = fvs * x - fvs * px + py

  switch:

    fvs * x - fvs * px + py = pvns * x - pvns * rpdx + rpdy

  solve for x:

    fvs * x - pvns * x = fvs * px - pvns * rpdx - py + rpdy



          fvs * px - pvns * rpdx + rpdy - py
    x =  -----------------------------------
                 fvs - pvns

  and:

    y = fvs * (x - px) + py



INTERPOLATE:
============

Examples of point interpolation.

The weight of the movement of the reference point gets bigger
the further the other reference point is away, thus the safest
option (that is avoiding 0/0 divisions) is to weight the
original distance of the other point by the sum of both distances.

If the sum of both distances is 0, then move the point by the
arithmetic average of the movement of both reference points.




           (+6)
    rp1o *---->*rp1
         .     .                          (+12)
         .     .                  rp2o *---------->* rp2
         .     .                       .           .
         .     .                       .           .
         .    10          20           .           .
         |.........|...................|           .
               .   .                               .
               .   . (+8)                          .
                po *------>*p                      .
               .           .                       .
               .    12     .          24           .
               |...........|.......................|
                                  36


-------



           (+10)
    rp1o *-------->*rp1
         .         .                      (-10)
         .         .              rp2 *<---------* rpo2
         .         .                   .         .
         .         .                   .         .
         .    10   .          30       .         .
         |.........|.............................|
                   .                   .
                   . (+5)              .
                po *--->* p            .
                   .    .              .
                   .    .   20         .
                   |....|..............|
                     5        15


-------


           (+10)
    rp1o *-------->*rp1
         .         .
         .         .
    rp2o *-------->*rp2


                               (+10)
                          po *-------->* p

-------


           (+10)
    rp1o *-------->*rp1
         .         .
         .         .(+30)
    rp2o *---------------------------->*rp2


                                        (+25)
                          po *----------------------->* p



vim: set ts=4 sw=4 expandtab:
*****/


/***/ }),

/***/ "./node_modules/opentype.js/src/layout.js":
/*!************************************************!*\
  !*** ./node_modules/opentype.js/src/layout.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./check */ "./node_modules/opentype.js/src/check.js");
// The Layout object is the prototype of Substitution objects, and provides
// utility methods to manipulate common layout tables (GPOS, GSUB, GDEF...)



function searchTag(arr, tag) {
    /* jshint bitwise: false */
    let imin = 0;
    let imax = arr.length - 1;
    while (imin <= imax) {
        const imid = (imin + imax) >>> 1;
        const val = arr[imid].tag;
        if (val === tag) {
            return imid;
        } else if (val < tag) {
            imin = imid + 1;
        } else { imax = imid - 1; }
    }
    // Not found: return -1-insertion point
    return -imin - 1;
}

function binSearch(arr, value) {
    /* jshint bitwise: false */
    let imin = 0;
    let imax = arr.length - 1;
    while (imin <= imax) {
        const imid = (imin + imax) >>> 1;
        const val = arr[imid];
        if (val === value) {
            return imid;
        } else if (val < value) {
            imin = imid + 1;
        } else { imax = imid - 1; }
    }
    // Not found: return -1-insertion point
    return -imin - 1;
}

// binary search in a list of ranges (coverage, class definition)
function searchRange(ranges, value) {
    // jshint bitwise: false
    let range;
    let imin = 0;
    let imax = ranges.length - 1;
    while (imin <= imax) {
        const imid = (imin + imax) >>> 1;
        range = ranges[imid];
        const start = range.start;
        if (start === value) {
            return range;
        } else if (start < value) {
            imin = imid + 1;
        } else { imax = imid - 1; }
    }
    if (imin > 0) {
        range = ranges[imin - 1];
        if (value > range.end) return 0;
        return range;
    }
}

/**
 * @exports opentype.Layout
 * @class
 */
function Layout(font, tableName) {
    this.font = font;
    this.tableName = tableName;
}

Layout.prototype = {

    /**
     * Binary search an object by "tag" property
     * @instance
     * @function searchTag
     * @memberof opentype.Layout
     * @param  {Array} arr
     * @param  {string} tag
     * @return {number}
     */
    searchTag: searchTag,

    /**
     * Binary search in a list of numbers
     * @instance
     * @function binSearch
     * @memberof opentype.Layout
     * @param  {Array} arr
     * @param  {number} value
     * @return {number}
     */
    binSearch: binSearch,

    /**
     * Get or create the Layout table (GSUB, GPOS etc).
     * @param  {boolean} create - Whether to create a new one.
     * @return {Object} The GSUB or GPOS table.
     */
    getTable: function(create) {
        let layout = this.font.tables[this.tableName];
        if (!layout && create) {
            layout = this.font.tables[this.tableName] = this.createDefaultTable();
        }
        return layout;
    },

    /**
     * Returns all scripts in the substitution table.
     * @instance
     * @return {Array}
     */
    getScriptNames: function() {
        let layout = this.getTable();
        if (!layout) { return []; }
        return layout.scripts.map(function(script) {
            return script.tag;
        });
    },

    /**
     * Returns the best bet for a script name.
     * Returns 'DFLT' if it exists.
     * If not, returns 'latn' if it exists.
     * If neither exist, returns undefined.
     */
    getDefaultScriptName: function() {
        let layout = this.getTable();
        if (!layout) { return; }
        let hasLatn = false;
        for (let i = 0; i < layout.scripts.length; i++) {
            const name = layout.scripts[i].tag;
            if (name === 'DFLT') return name;
            if (name === 'latn') hasLatn = true;
        }
        if (hasLatn) return 'latn';
    },

    /**
     * Returns all LangSysRecords in the given script.
     * @instance
     * @param {string} [script='DFLT']
     * @param {boolean} create - forces the creation of this script table if it doesn't exist.
     * @return {Object} An object with tag and script properties.
     */
    getScriptTable: function(script, create) {
        const layout = this.getTable(create);
        if (layout) {
            script = script || 'DFLT';
            const scripts = layout.scripts;
            const pos = searchTag(layout.scripts, script);
            if (pos >= 0) {
                return scripts[pos].script;
            } else if (create) {
                const scr = {
                    tag: script,
                    script: {
                        defaultLangSys: {reserved: 0, reqFeatureIndex: 0xffff, featureIndexes: []},
                        langSysRecords: []
                    }
                };
                scripts.splice(-1 - pos, 0, scr);
                return scr.script;
            }
        }
    },

    /**
     * Returns a language system table
     * @instance
     * @param {string} [script='DFLT']
     * @param {string} [language='dlft']
     * @param {boolean} create - forces the creation of this langSysTable if it doesn't exist.
     * @return {Object}
     */
    getLangSysTable: function(script, language, create) {
        const scriptTable = this.getScriptTable(script, create);
        if (scriptTable) {
            if (!language || language === 'dflt' || language === 'DFLT') {
                return scriptTable.defaultLangSys;
            }
            const pos = searchTag(scriptTable.langSysRecords, language);
            if (pos >= 0) {
                return scriptTable.langSysRecords[pos].langSys;
            } else if (create) {
                const langSysRecord = {
                    tag: language,
                    langSys: {reserved: 0, reqFeatureIndex: 0xffff, featureIndexes: []}
                };
                scriptTable.langSysRecords.splice(-1 - pos, 0, langSysRecord);
                return langSysRecord.langSys;
            }
        }
    },

    /**
     * Get a specific feature table.
     * @instance
     * @param {string} [script='DFLT']
     * @param {string} [language='dlft']
     * @param {string} feature - One of the codes listed at https://www.microsoft.com/typography/OTSPEC/featurelist.htm
     * @param {boolean} create - forces the creation of the feature table if it doesn't exist.
     * @return {Object}
     */
    getFeatureTable: function(script, language, feature, create) {
        const langSysTable = this.getLangSysTable(script, language, create);
        if (langSysTable) {
            let featureRecord;
            const featIndexes = langSysTable.featureIndexes;
            const allFeatures = this.font.tables[this.tableName].features;
            // The FeatureIndex array of indices is in arbitrary order,
            // even if allFeatures is sorted alphabetically by feature tag.
            for (let i = 0; i < featIndexes.length; i++) {
                featureRecord = allFeatures[featIndexes[i]];
                if (featureRecord.tag === feature) {
                    return featureRecord.feature;
                }
            }
            if (create) {
                const index = allFeatures.length;
                // Automatic ordering of features would require to shift feature indexes in the script list.
                _check__WEBPACK_IMPORTED_MODULE_0__.default.assert(index === 0 || feature >= allFeatures[index - 1].tag, 'Features must be added in alphabetical order.');
                featureRecord = {
                    tag: feature,
                    feature: { params: 0, lookupListIndexes: [] }
                };
                allFeatures.push(featureRecord);
                featIndexes.push(index);
                return featureRecord.feature;
            }
        }
    },

    /**
     * Get the lookup tables of a given type for a script/language/feature.
     * @instance
     * @param {string} [script='DFLT']
     * @param {string} [language='dlft']
     * @param {string} feature - 4-letter feature code
     * @param {number} lookupType - 1 to 9
     * @param {boolean} create - forces the creation of the lookup table if it doesn't exist, with no subtables.
     * @return {Object[]}
     */
    getLookupTables: function(script, language, feature, lookupType, create) {
        const featureTable = this.getFeatureTable(script, language, feature, create);
        const tables = [];
        if (featureTable) {
            let lookupTable;
            const lookupListIndexes = featureTable.lookupListIndexes;
            const allLookups = this.font.tables[this.tableName].lookups;
            // lookupListIndexes are in no particular order, so use naive search.
            for (let i = 0; i < lookupListIndexes.length; i++) {
                lookupTable = allLookups[lookupListIndexes[i]];
                if (lookupTable.lookupType === lookupType) {
                    tables.push(lookupTable);
                }
            }
            if (tables.length === 0 && create) {
                lookupTable = {
                    lookupType: lookupType,
                    lookupFlag: 0,
                    subtables: [],
                    markFilteringSet: undefined
                };
                const index = allLookups.length;
                allLookups.push(lookupTable);
                lookupListIndexes.push(index);
                return [lookupTable];
            }
        }
        return tables;
    },

    /**
     * Find a glyph in a class definition table
     * https://docs.microsoft.com/en-us/typography/opentype/spec/chapter2#class-definition-table
     * @param {object} classDefTable - an OpenType Layout class definition table
     * @param {number} glyphIndex - the index of the glyph to find
     * @returns {number} -1 if not found
     */
    getGlyphClass: function(classDefTable, glyphIndex) {
        switch (classDefTable.format) {
            case 1:
                if (classDefTable.startGlyph <= glyphIndex && glyphIndex < classDefTable.startGlyph + classDefTable.classes.length) {
                    return classDefTable.classes[glyphIndex - classDefTable.startGlyph];
                }
                return 0;
            case 2:
                const range = searchRange(classDefTable.ranges, glyphIndex);
                return range ? range.classId : 0;
        }
    },

    /**
     * Find a glyph in a coverage table
     * https://docs.microsoft.com/en-us/typography/opentype/spec/chapter2#coverage-table
     * @param {object} coverageTable - an OpenType Layout coverage table
     * @param {number} glyphIndex - the index of the glyph to find
     * @returns {number} -1 if not found
     */
    getCoverageIndex: function(coverageTable, glyphIndex) {
        switch (coverageTable.format) {
            case 1:
                const index = binSearch(coverageTable.glyphs, glyphIndex);
                return index >= 0 ? index : -1;
            case 2:
                const range = searchRange(coverageTable.ranges, glyphIndex);
                return range ? range.index + glyphIndex - range.start : -1;
        }
    },

    /**
     * Returns the list of glyph indexes of a coverage table.
     * Format 1: the list is stored raw
     * Format 2: compact list as range records.
     * @instance
     * @param  {Object} coverageTable
     * @return {Array}
     */
    expandCoverage: function(coverageTable) {
        if (coverageTable.format === 1) {
            return coverageTable.glyphs;
        } else {
            const glyphs = [];
            const ranges = coverageTable.ranges;
            for (let i = 0; i < ranges.length; i++) {
                const range = ranges[i];
                const start = range.start;
                const end = range.end;
                for (let j = start; j <= end; j++) {
                    glyphs.push(j);
                }
            }
            return glyphs;
        }
    }

};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Layout);


/***/ }),

/***/ "./node_modules/opentype.js/src/opentype.js":
/*!**************************************************!*\
  !*** ./node_modules/opentype.js/src/opentype.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Font": () => (/* reexport safe */ _font__WEBPACK_IMPORTED_MODULE_1__.default),
/* harmony export */   "Glyph": () => (/* reexport safe */ _glyph__WEBPACK_IMPORTED_MODULE_2__.default),
/* harmony export */   "Path": () => (/* reexport safe */ _path__WEBPACK_IMPORTED_MODULE_6__.default),
/* harmony export */   "BoundingBox": () => (/* reexport safe */ _bbox__WEBPACK_IMPORTED_MODULE_5__.default),
/* harmony export */   "_parse": () => (/* reexport safe */ _parse__WEBPACK_IMPORTED_MODULE_4__.default),
/* harmony export */   "parse": () => (/* binding */ parseBuffer),
/* harmony export */   "load": () => (/* binding */ load),
/* harmony export */   "loadSync": () => (/* binding */ loadSync)
/* harmony export */ });
/* harmony import */ var tiny_inflate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tiny-inflate */ "./node_modules/tiny-inflate/index.js");
/* harmony import */ var tiny_inflate__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tiny_inflate__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _font__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./font */ "./node_modules/opentype.js/src/font.js");
/* harmony import */ var _glyph__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./glyph */ "./node_modules/opentype.js/src/glyph.js");
/* harmony import */ var _encoding__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./encoding */ "./node_modules/opentype.js/src/encoding.js");
/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./parse */ "./node_modules/opentype.js/src/parse.js");
/* harmony import */ var _bbox__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./bbox */ "./node_modules/opentype.js/src/bbox.js");
/* harmony import */ var _path__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./path */ "./node_modules/opentype.js/src/path.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./util */ "./node_modules/opentype.js/src/util.js");
/* harmony import */ var _tables_cmap__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./tables/cmap */ "./node_modules/opentype.js/src/tables/cmap.js");
/* harmony import */ var _tables_cff__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./tables/cff */ "./node_modules/opentype.js/src/tables/cff.js");
/* harmony import */ var _tables_fvar__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./tables/fvar */ "./node_modules/opentype.js/src/tables/fvar.js");
/* harmony import */ var _tables_glyf__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./tables/glyf */ "./node_modules/opentype.js/src/tables/glyf.js");
/* harmony import */ var _tables_gpos__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./tables/gpos */ "./node_modules/opentype.js/src/tables/gpos.js");
/* harmony import */ var _tables_gsub__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./tables/gsub */ "./node_modules/opentype.js/src/tables/gsub.js");
/* harmony import */ var _tables_head__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./tables/head */ "./node_modules/opentype.js/src/tables/head.js");
/* harmony import */ var _tables_hhea__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./tables/hhea */ "./node_modules/opentype.js/src/tables/hhea.js");
/* harmony import */ var _tables_hmtx__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./tables/hmtx */ "./node_modules/opentype.js/src/tables/hmtx.js");
/* harmony import */ var _tables_kern__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./tables/kern */ "./node_modules/opentype.js/src/tables/kern.js");
/* harmony import */ var _tables_ltag__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./tables/ltag */ "./node_modules/opentype.js/src/tables/ltag.js");
/* harmony import */ var _tables_loca__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./tables/loca */ "./node_modules/opentype.js/src/tables/loca.js");
/* harmony import */ var _tables_maxp__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./tables/maxp */ "./node_modules/opentype.js/src/tables/maxp.js");
/* harmony import */ var _tables_name__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./tables/name */ "./node_modules/opentype.js/src/tables/name.js");
/* harmony import */ var _tables_os2__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./tables/os2 */ "./node_modules/opentype.js/src/tables/os2.js");
/* harmony import */ var _tables_post__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./tables/post */ "./node_modules/opentype.js/src/tables/post.js");
/* harmony import */ var _tables_meta__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./tables/meta */ "./node_modules/opentype.js/src/tables/meta.js");
// opentype.js
// https://github.com/nodebox/opentype.js
// (c) 2015 Frederik De Bleser
// opentype.js may be freely distributed under the MIT license.

/* global DataView, Uint8Array, XMLHttpRequest  */



























/**
 * The opentype library.
 * @namespace opentype
 */

// File loaders /////////////////////////////////////////////////////////
/**
 * Loads a font from a file. The callback throws an error message as the first parameter if it fails
 * and the font as an ArrayBuffer in the second parameter if it succeeds.
 * @param  {string} path - The path of the file
 * @param  {Function} callback - The function to call when the font load completes
 */
function loadFromFile(path, callback) {
    const fs = __webpack_require__(/*! fs */ "?4aa2");
    fs.readFile(path, function(err, buffer) {
        if (err) {
            return callback(err.message);
        }

        callback(null, (0,_util__WEBPACK_IMPORTED_MODULE_7__.nodeBufferToArrayBuffer)(buffer));
    });
}
/**
 * Loads a font from a URL. The callback throws an error message as the first parameter if it fails
 * and the font as an ArrayBuffer in the second parameter if it succeeds.
 * @param  {string} url - The URL of the font file.
 * @param  {Function} callback - The function to call when the font load completes
 */
function loadFromUrl(url, callback) {
    const request = new XMLHttpRequest();
    request.open('get', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        if (request.response) {
            return callback(null, request.response);
        } else {
            return callback('Font could not be loaded: ' + request.statusText);
        }
    };

    request.onerror = function () {
        callback('Font could not be loaded');
    };

    request.send();
}

// Table Directory Entries //////////////////////////////////////////////
/**
 * Parses OpenType table entries.
 * @param  {DataView}
 * @param  {Number}
 * @return {Object[]}
 */
function parseOpenTypeTableEntries(data, numTables) {
    const tableEntries = [];
    let p = 12;
    for (let i = 0; i < numTables; i += 1) {
        const tag = _parse__WEBPACK_IMPORTED_MODULE_4__.default.getTag(data, p);
        const checksum = _parse__WEBPACK_IMPORTED_MODULE_4__.default.getULong(data, p + 4);
        const offset = _parse__WEBPACK_IMPORTED_MODULE_4__.default.getULong(data, p + 8);
        const length = _parse__WEBPACK_IMPORTED_MODULE_4__.default.getULong(data, p + 12);
        tableEntries.push({tag: tag, checksum: checksum, offset: offset, length: length, compression: false});
        p += 16;
    }

    return tableEntries;
}

/**
 * Parses WOFF table entries.
 * @param  {DataView}
 * @param  {Number}
 * @return {Object[]}
 */
function parseWOFFTableEntries(data, numTables) {
    const tableEntries = [];
    let p = 44; // offset to the first table directory entry.
    for (let i = 0; i < numTables; i += 1) {
        const tag = _parse__WEBPACK_IMPORTED_MODULE_4__.default.getTag(data, p);
        const offset = _parse__WEBPACK_IMPORTED_MODULE_4__.default.getULong(data, p + 4);
        const compLength = _parse__WEBPACK_IMPORTED_MODULE_4__.default.getULong(data, p + 8);
        const origLength = _parse__WEBPACK_IMPORTED_MODULE_4__.default.getULong(data, p + 12);
        let compression;
        if (compLength < origLength) {
            compression = 'WOFF';
        } else {
            compression = false;
        }

        tableEntries.push({tag: tag, offset: offset, compression: compression,
            compressedLength: compLength, length: origLength});
        p += 20;
    }

    return tableEntries;
}

/**
 * @typedef TableData
 * @type Object
 * @property {DataView} data - The DataView
 * @property {number} offset - The data offset.
 */

/**
 * @param  {DataView}
 * @param  {Object}
 * @return {TableData}
 */
function uncompressTable(data, tableEntry) {
    if (tableEntry.compression === 'WOFF') {
        const inBuffer = new Uint8Array(data.buffer, tableEntry.offset + 2, tableEntry.compressedLength - 2);
        const outBuffer = new Uint8Array(tableEntry.length);
        tiny_inflate__WEBPACK_IMPORTED_MODULE_0___default()(inBuffer, outBuffer);
        if (outBuffer.byteLength !== tableEntry.length) {
            throw new Error('Decompression error: ' + tableEntry.tag + ' decompressed length doesn\'t match recorded length');
        }

        const view = new DataView(outBuffer.buffer, 0);
        return {data: view, offset: 0};
    } else {
        return {data: data, offset: tableEntry.offset};
    }
}

// Public API ///////////////////////////////////////////////////////////

/**
 * Parse the OpenType file data (as an ArrayBuffer) and return a Font object.
 * Throws an error if the font could not be parsed.
 * @param  {ArrayBuffer}
 * @return {opentype.Font}
 */
function parseBuffer(buffer) {
    let indexToLocFormat;
    let ltagTable;

    // Since the constructor can also be called to create new fonts from scratch, we indicate this
    // should be an empty font that we'll fill with our own data.
    const font = new _font__WEBPACK_IMPORTED_MODULE_1__.default({empty: true});

    // OpenType fonts use big endian byte ordering.
    // We can't rely on typed array view types, because they operate with the endianness of the host computer.
    // Instead we use DataViews where we can specify endianness.
    const data = new DataView(buffer, 0);
    let numTables;
    let tableEntries = [];
    const signature = _parse__WEBPACK_IMPORTED_MODULE_4__.default.getTag(data, 0);
    if (signature === String.fromCharCode(0, 1, 0, 0) || signature === 'true' || signature === 'typ1') {
        font.outlinesFormat = 'truetype';
        numTables = _parse__WEBPACK_IMPORTED_MODULE_4__.default.getUShort(data, 4);
        tableEntries = parseOpenTypeTableEntries(data, numTables);
    } else if (signature === 'OTTO') {
        font.outlinesFormat = 'cff';
        numTables = _parse__WEBPACK_IMPORTED_MODULE_4__.default.getUShort(data, 4);
        tableEntries = parseOpenTypeTableEntries(data, numTables);
    } else if (signature === 'wOFF') {
        const flavor = _parse__WEBPACK_IMPORTED_MODULE_4__.default.getTag(data, 4);
        if (flavor === String.fromCharCode(0, 1, 0, 0)) {
            font.outlinesFormat = 'truetype';
        } else if (flavor === 'OTTO') {
            font.outlinesFormat = 'cff';
        } else {
            throw new Error('Unsupported OpenType flavor ' + signature);
        }

        numTables = _parse__WEBPACK_IMPORTED_MODULE_4__.default.getUShort(data, 12);
        tableEntries = parseWOFFTableEntries(data, numTables);
    } else {
        throw new Error('Unsupported OpenType signature ' + signature);
    }

    let cffTableEntry;
    let fvarTableEntry;
    let glyfTableEntry;
    let gposTableEntry;
    let gsubTableEntry;
    let hmtxTableEntry;
    let kernTableEntry;
    let locaTableEntry;
    let nameTableEntry;
    let metaTableEntry;
    let p;

    for (let i = 0; i < numTables; i += 1) {
        const tableEntry = tableEntries[i];
        let table;
        switch (tableEntry.tag) {
            case 'cmap':
                table = uncompressTable(data, tableEntry);
                font.tables.cmap = _tables_cmap__WEBPACK_IMPORTED_MODULE_8__.default.parse(table.data, table.offset);
                font.encoding = new _encoding__WEBPACK_IMPORTED_MODULE_3__.CmapEncoding(font.tables.cmap);
                break;
            case 'cvt ' :
                table = uncompressTable(data, tableEntry);
                p = new _parse__WEBPACK_IMPORTED_MODULE_4__.default.Parser(table.data, table.offset);
                font.tables.cvt = p.parseShortList(tableEntry.length / 2);
                break;
            case 'fvar':
                fvarTableEntry = tableEntry;
                break;
            case 'fpgm' :
                table = uncompressTable(data, tableEntry);
                p = new _parse__WEBPACK_IMPORTED_MODULE_4__.default.Parser(table.data, table.offset);
                font.tables.fpgm = p.parseByteList(tableEntry.length);
                break;
            case 'head':
                table = uncompressTable(data, tableEntry);
                font.tables.head = _tables_head__WEBPACK_IMPORTED_MODULE_14__.default.parse(table.data, table.offset);
                font.unitsPerEm = font.tables.head.unitsPerEm;
                indexToLocFormat = font.tables.head.indexToLocFormat;
                break;
            case 'hhea':
                table = uncompressTable(data, tableEntry);
                font.tables.hhea = _tables_hhea__WEBPACK_IMPORTED_MODULE_15__.default.parse(table.data, table.offset);
                font.ascender = font.tables.hhea.ascender;
                font.descender = font.tables.hhea.descender;
                font.numberOfHMetrics = font.tables.hhea.numberOfHMetrics;
                break;
            case 'hmtx':
                hmtxTableEntry = tableEntry;
                break;
            case 'ltag':
                table = uncompressTable(data, tableEntry);
                ltagTable = _tables_ltag__WEBPACK_IMPORTED_MODULE_18__.default.parse(table.data, table.offset);
                break;
            case 'maxp':
                table = uncompressTable(data, tableEntry);
                font.tables.maxp = _tables_maxp__WEBPACK_IMPORTED_MODULE_20__.default.parse(table.data, table.offset);
                font.numGlyphs = font.tables.maxp.numGlyphs;
                break;
            case 'name':
                nameTableEntry = tableEntry;
                break;
            case 'OS/2':
                table = uncompressTable(data, tableEntry);
                font.tables.os2 = _tables_os2__WEBPACK_IMPORTED_MODULE_22__.default.parse(table.data, table.offset);
                break;
            case 'post':
                table = uncompressTable(data, tableEntry);
                font.tables.post = _tables_post__WEBPACK_IMPORTED_MODULE_23__.default.parse(table.data, table.offset);
                font.glyphNames = new _encoding__WEBPACK_IMPORTED_MODULE_3__.GlyphNames(font.tables.post);
                break;
            case 'prep' :
                table = uncompressTable(data, tableEntry);
                p = new _parse__WEBPACK_IMPORTED_MODULE_4__.default.Parser(table.data, table.offset);
                font.tables.prep = p.parseByteList(tableEntry.length);
                break;
            case 'glyf':
                glyfTableEntry = tableEntry;
                break;
            case 'loca':
                locaTableEntry = tableEntry;
                break;
            case 'CFF ':
                cffTableEntry = tableEntry;
                break;
            case 'kern':
                kernTableEntry = tableEntry;
                break;
            case 'GPOS':
                gposTableEntry = tableEntry;
                break;
            case 'GSUB':
                gsubTableEntry = tableEntry;
                break;
            case 'meta':
                metaTableEntry = tableEntry;
                break;
        }
    }

    const nameTable = uncompressTable(data, nameTableEntry);
    font.tables.name = _tables_name__WEBPACK_IMPORTED_MODULE_21__.default.parse(nameTable.data, nameTable.offset, ltagTable);
    font.names = font.tables.name;

    if (glyfTableEntry && locaTableEntry) {
        const shortVersion = indexToLocFormat === 0;
        const locaTable = uncompressTable(data, locaTableEntry);
        const locaOffsets = _tables_loca__WEBPACK_IMPORTED_MODULE_19__.default.parse(locaTable.data, locaTable.offset, font.numGlyphs, shortVersion);
        const glyfTable = uncompressTable(data, glyfTableEntry);
        font.glyphs = _tables_glyf__WEBPACK_IMPORTED_MODULE_11__.default.parse(glyfTable.data, glyfTable.offset, locaOffsets, font);
    } else if (cffTableEntry) {
        const cffTable = uncompressTable(data, cffTableEntry);
        _tables_cff__WEBPACK_IMPORTED_MODULE_9__.default.parse(cffTable.data, cffTable.offset, font);
    } else {
        throw new Error('Font doesn\'t contain TrueType or CFF outlines.');
    }

    const hmtxTable = uncompressTable(data, hmtxTableEntry);
    _tables_hmtx__WEBPACK_IMPORTED_MODULE_16__.default.parse(hmtxTable.data, hmtxTable.offset, font.numberOfHMetrics, font.numGlyphs, font.glyphs);
    (0,_encoding__WEBPACK_IMPORTED_MODULE_3__.addGlyphNames)(font);

    if (kernTableEntry) {
        const kernTable = uncompressTable(data, kernTableEntry);
        font.kerningPairs = _tables_kern__WEBPACK_IMPORTED_MODULE_17__.default.parse(kernTable.data, kernTable.offset);
    } else {
        font.kerningPairs = {};
    }

    if (gposTableEntry) {
        const gposTable = uncompressTable(data, gposTableEntry);
        font.tables.gpos = _tables_gpos__WEBPACK_IMPORTED_MODULE_12__.default.parse(gposTable.data, gposTable.offset);
    }

    if (gsubTableEntry) {
        const gsubTable = uncompressTable(data, gsubTableEntry);
        font.tables.gsub = _tables_gsub__WEBPACK_IMPORTED_MODULE_13__.default.parse(gsubTable.data, gsubTable.offset);
    }

    if (fvarTableEntry) {
        const fvarTable = uncompressTable(data, fvarTableEntry);
        font.tables.fvar = _tables_fvar__WEBPACK_IMPORTED_MODULE_10__.default.parse(fvarTable.data, fvarTable.offset, font.names);
    }

    if (metaTableEntry) {
        const metaTable = uncompressTable(data, metaTableEntry);
        font.tables.meta = _tables_meta__WEBPACK_IMPORTED_MODULE_24__.default.parse(metaTable.data, metaTable.offset);
        font.metas = font.tables.meta;
    }

    return font;
}

/**
 * Asynchronously load the font from a URL or a filesystem. When done, call the callback
 * with two arguments `(err, font)`. The `err` will be null on success,
 * the `font` is a Font object.
 * We use the node.js callback convention so that
 * opentype.js can integrate with frameworks like async.js.
 * @alias opentype.load
 * @param  {string} url - The URL of the font to load.
 * @param  {Function} callback - The callback.
 */
function load(url, callback) {
    const isNode = typeof window === 'undefined';
    const loadFn = isNode ? loadFromFile : loadFromUrl;
    loadFn(url, function(err, arrayBuffer) {
        if (err) {
            return callback(err);
        }
        let font;
        try {
            font = parseBuffer(arrayBuffer);
        } catch (e) {
            return callback(e, null);
        }
        return callback(null, font);
    });
}

/**
 * Synchronously load the font from a URL or file.
 * When done, returns the font object or throws an error.
 * @alias opentype.loadSync
 * @param  {string} url - The URL of the font to load.
 * @return {opentype.Font}
 */
function loadSync(url) {
    const fs = __webpack_require__(/*! fs */ "?4aa2");
    const buffer = fs.readFileSync(url);
    return parseBuffer((0,_util__WEBPACK_IMPORTED_MODULE_7__.nodeBufferToArrayBuffer)(buffer));
}




/***/ }),

/***/ "./node_modules/opentype.js/src/parse.js":
/*!***********************************************!*\
  !*** ./node_modules/opentype.js/src/parse.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "Parser": () => (/* binding */ Parser)
/* harmony export */ });
/* harmony import */ var _check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./check */ "./node_modules/opentype.js/src/check.js");
// Parsing utility functions



// Retrieve an unsigned byte from the DataView.
function getByte(dataView, offset) {
    return dataView.getUint8(offset);
}

// Retrieve an unsigned 16-bit short from the DataView.
// The value is stored in big endian.
function getUShort(dataView, offset) {
    return dataView.getUint16(offset, false);
}

// Retrieve a signed 16-bit short from the DataView.
// The value is stored in big endian.
function getShort(dataView, offset) {
    return dataView.getInt16(offset, false);
}

// Retrieve an unsigned 32-bit long from the DataView.
// The value is stored in big endian.
function getULong(dataView, offset) {
    return dataView.getUint32(offset, false);
}

// Retrieve a 32-bit signed fixed-point number (16.16) from the DataView.
// The value is stored in big endian.
function getFixed(dataView, offset) {
    const decimal = dataView.getInt16(offset, false);
    const fraction = dataView.getUint16(offset + 2, false);
    return decimal + fraction / 65535;
}

// Retrieve a 4-character tag from the DataView.
// Tags are used to identify tables.
function getTag(dataView, offset) {
    let tag = '';
    for (let i = offset; i < offset + 4; i += 1) {
        tag += String.fromCharCode(dataView.getInt8(i));
    }

    return tag;
}

// Retrieve an offset from the DataView.
// Offsets are 1 to 4 bytes in length, depending on the offSize argument.
function getOffset(dataView, offset, offSize) {
    let v = 0;
    for (let i = 0; i < offSize; i += 1) {
        v <<= 8;
        v += dataView.getUint8(offset + i);
    }

    return v;
}

// Retrieve a number of bytes from start offset to the end offset from the DataView.
function getBytes(dataView, startOffset, endOffset) {
    const bytes = [];
    for (let i = startOffset; i < endOffset; i += 1) {
        bytes.push(dataView.getUint8(i));
    }

    return bytes;
}

// Convert the list of bytes to a string.
function bytesToString(bytes) {
    let s = '';
    for (let i = 0; i < bytes.length; i += 1) {
        s += String.fromCharCode(bytes[i]);
    }

    return s;
}

const typeOffsets = {
    byte: 1,
    uShort: 2,
    short: 2,
    uLong: 4,
    fixed: 4,
    longDateTime: 8,
    tag: 4
};

// A stateful parser that changes the offset whenever a value is retrieved.
// The data is a DataView.
function Parser(data, offset) {
    this.data = data;
    this.offset = offset;
    this.relativeOffset = 0;
}

Parser.prototype.parseByte = function() {
    const v = this.data.getUint8(this.offset + this.relativeOffset);
    this.relativeOffset += 1;
    return v;
};

Parser.prototype.parseChar = function() {
    const v = this.data.getInt8(this.offset + this.relativeOffset);
    this.relativeOffset += 1;
    return v;
};

Parser.prototype.parseCard8 = Parser.prototype.parseByte;

Parser.prototype.parseUShort = function() {
    const v = this.data.getUint16(this.offset + this.relativeOffset);
    this.relativeOffset += 2;
    return v;
};

Parser.prototype.parseCard16 = Parser.prototype.parseUShort;
Parser.prototype.parseSID = Parser.prototype.parseUShort;
Parser.prototype.parseOffset16 = Parser.prototype.parseUShort;

Parser.prototype.parseShort = function() {
    const v = this.data.getInt16(this.offset + this.relativeOffset);
    this.relativeOffset += 2;
    return v;
};

Parser.prototype.parseF2Dot14 = function() {
    const v = this.data.getInt16(this.offset + this.relativeOffset) / 16384;
    this.relativeOffset += 2;
    return v;
};

Parser.prototype.parseULong = function() {
    const v = getULong(this.data, this.offset + this.relativeOffset);
    this.relativeOffset += 4;
    return v;
};

Parser.prototype.parseOffset32 = Parser.prototype.parseULong;

Parser.prototype.parseFixed = function() {
    const v = getFixed(this.data, this.offset + this.relativeOffset);
    this.relativeOffset += 4;
    return v;
};

Parser.prototype.parseString = function(length) {
    const dataView = this.data;
    const offset = this.offset + this.relativeOffset;
    let string = '';
    this.relativeOffset += length;
    for (let i = 0; i < length; i++) {
        string += String.fromCharCode(dataView.getUint8(offset + i));
    }

    return string;
};

Parser.prototype.parseTag = function() {
    return this.parseString(4);
};

// LONGDATETIME is a 64-bit integer.
// JavaScript and unix timestamps traditionally use 32 bits, so we
// only take the last 32 bits.
// + Since until 2038 those bits will be filled by zeros we can ignore them.
Parser.prototype.parseLongDateTime = function() {
    let v = getULong(this.data, this.offset + this.relativeOffset + 4);
    // Subtract seconds between 01/01/1904 and 01/01/1970
    // to convert Apple Mac timestamp to Standard Unix timestamp
    v -= 2082844800;
    this.relativeOffset += 8;
    return v;
};

Parser.prototype.parseVersion = function(minorBase) {
    const major = getUShort(this.data, this.offset + this.relativeOffset);

    // How to interpret the minor version is very vague in the spec. 0x5000 is 5, 0x1000 is 1
    // Default returns the correct number if minor = 0xN000 where N is 0-9
    // Set minorBase to 1 for tables that use minor = N where N is 0-9
    const minor = getUShort(this.data, this.offset + this.relativeOffset + 2);
    this.relativeOffset += 4;
    if (minorBase === undefined) minorBase = 0x1000;
    return major + minor / minorBase / 10;
};

Parser.prototype.skip = function(type, amount) {
    if (amount === undefined) {
        amount = 1;
    }

    this.relativeOffset += typeOffsets[type] * amount;
};

///// Parsing lists and records ///////////////////////////////

// Parse a list of 32 bit unsigned integers.
Parser.prototype.parseULongList = function(count) {
    if (count === undefined) { count = this.parseULong(); }
    const offsets = new Array(count);
    const dataView = this.data;
    let offset = this.offset + this.relativeOffset;
    for (let i = 0; i < count; i++) {
        offsets[i] = dataView.getUint32(offset);
        offset += 4;
    }

    this.relativeOffset += count * 4;
    return offsets;
};

// Parse a list of 16 bit unsigned integers. The length of the list can be read on the stream
// or provided as an argument.
Parser.prototype.parseOffset16List =
Parser.prototype.parseUShortList = function(count) {
    if (count === undefined) { count = this.parseUShort(); }
    const offsets = new Array(count);
    const dataView = this.data;
    let offset = this.offset + this.relativeOffset;
    for (let i = 0; i < count; i++) {
        offsets[i] = dataView.getUint16(offset);
        offset += 2;
    }

    this.relativeOffset += count * 2;
    return offsets;
};

// Parses a list of 16 bit signed integers.
Parser.prototype.parseShortList = function(count) {
    const list = new Array(count);
    const dataView = this.data;
    let offset = this.offset + this.relativeOffset;
    for (let i = 0; i < count; i++) {
        list[i] = dataView.getInt16(offset);
        offset += 2;
    }

    this.relativeOffset += count * 2;
    return list;
};

// Parses a list of bytes.
Parser.prototype.parseByteList = function(count) {
    const list = new Array(count);
    const dataView = this.data;
    let offset = this.offset + this.relativeOffset;
    for (let i = 0; i < count; i++) {
        list[i] = dataView.getUint8(offset++);
    }

    this.relativeOffset += count;
    return list;
};

/**
 * Parse a list of items.
 * Record count is optional, if omitted it is read from the stream.
 * itemCallback is one of the Parser methods.
 */
Parser.prototype.parseList = function(count, itemCallback) {
    if (!itemCallback) {
        itemCallback = count;
        count = this.parseUShort();
    }
    const list = new Array(count);
    for (let i = 0; i < count; i++) {
        list[i] = itemCallback.call(this);
    }
    return list;
};

Parser.prototype.parseList32 = function(count, itemCallback) {
    if (!itemCallback) {
        itemCallback = count;
        count = this.parseULong();
    }
    const list = new Array(count);
    for (let i = 0; i < count; i++) {
        list[i] = itemCallback.call(this);
    }
    return list;
};

/**
 * Parse a list of records.
 * Record count is optional, if omitted it is read from the stream.
 * Example of recordDescription: { sequenceIndex: Parser.uShort, lookupListIndex: Parser.uShort }
 */
Parser.prototype.parseRecordList = function(count, recordDescription) {
    // If the count argument is absent, read it in the stream.
    if (!recordDescription) {
        recordDescription = count;
        count = this.parseUShort();
    }
    const records = new Array(count);
    const fields = Object.keys(recordDescription);
    for (let i = 0; i < count; i++) {
        const rec = {};
        for (let j = 0; j < fields.length; j++) {
            const fieldName = fields[j];
            const fieldType = recordDescription[fieldName];
            rec[fieldName] = fieldType.call(this);
        }
        records[i] = rec;
    }
    return records;
};

Parser.prototype.parseRecordList32 = function(count, recordDescription) {
    // If the count argument is absent, read it in the stream.
    if (!recordDescription) {
        recordDescription = count;
        count = this.parseULong();
    }
    const records = new Array(count);
    const fields = Object.keys(recordDescription);
    for (let i = 0; i < count; i++) {
        const rec = {};
        for (let j = 0; j < fields.length; j++) {
            const fieldName = fields[j];
            const fieldType = recordDescription[fieldName];
            rec[fieldName] = fieldType.call(this);
        }
        records[i] = rec;
    }
    return records;
};

// Parse a data structure into an object
// Example of description: { sequenceIndex: Parser.uShort, lookupListIndex: Parser.uShort }
Parser.prototype.parseStruct = function(description) {
    if (typeof description === 'function') {
        return description.call(this);
    } else {
        const fields = Object.keys(description);
        const struct = {};
        for (let j = 0; j < fields.length; j++) {
            const fieldName = fields[j];
            const fieldType = description[fieldName];
            struct[fieldName] = fieldType.call(this);
        }
        return struct;
    }
};

/**
 * Parse a GPOS valueRecord
 * https://docs.microsoft.com/en-us/typography/opentype/spec/gpos#value-record
 * valueFormat is optional, if omitted it is read from the stream.
 */
Parser.prototype.parseValueRecord = function(valueFormat) {
    if (valueFormat === undefined) {
        valueFormat = this.parseUShort();
    }
    if (valueFormat === 0) {
        // valueFormat2 in kerning pairs is most often 0
        // in this case return undefined instead of an empty object, to save space
        return;
    }
    const valueRecord = {};

    if (valueFormat & 0x0001) { valueRecord.xPlacement = this.parseShort(); }
    if (valueFormat & 0x0002) { valueRecord.yPlacement = this.parseShort(); }
    if (valueFormat & 0x0004) { valueRecord.xAdvance = this.parseShort(); }
    if (valueFormat & 0x0008) { valueRecord.yAdvance = this.parseShort(); }

    // Device table (non-variable font) / VariationIndex table (variable font) not supported
    // https://docs.microsoft.com/fr-fr/typography/opentype/spec/chapter2#devVarIdxTbls
    if (valueFormat & 0x0010) { valueRecord.xPlaDevice = undefined; this.parseShort(); }
    if (valueFormat & 0x0020) { valueRecord.yPlaDevice = undefined; this.parseShort(); }
    if (valueFormat & 0x0040) { valueRecord.xAdvDevice = undefined; this.parseShort(); }
    if (valueFormat & 0x0080) { valueRecord.yAdvDevice = undefined; this.parseShort(); }

    return valueRecord;
};

/**
 * Parse a list of GPOS valueRecords
 * https://docs.microsoft.com/en-us/typography/opentype/spec/gpos#value-record
 * valueFormat and valueCount are read from the stream.
 */
Parser.prototype.parseValueRecordList = function() {
    const valueFormat = this.parseUShort();
    const valueCount = this.parseUShort();
    const values = new Array(valueCount);
    for (let i = 0; i < valueCount; i++) {
        values[i] = this.parseValueRecord(valueFormat);
    }
    return values;
};

Parser.prototype.parsePointer = function(description) {
    const structOffset = this.parseOffset16();
    if (structOffset > 0) {
        // NULL offset => return undefined
        return new Parser(this.data, this.offset + structOffset).parseStruct(description);
    }
    return undefined;
};

Parser.prototype.parsePointer32 = function(description) {
    const structOffset = this.parseOffset32();
    if (structOffset > 0) {
        // NULL offset => return undefined
        return new Parser(this.data, this.offset + structOffset).parseStruct(description);
    }
    return undefined;
};

/**
 * Parse a list of offsets to lists of 16-bit integers,
 * or a list of offsets to lists of offsets to any kind of items.
 * If itemCallback is not provided, a list of list of UShort is assumed.
 * If provided, itemCallback is called on each item and must parse the item.
 * See examples in tables/gsub.js
 */
Parser.prototype.parseListOfLists = function(itemCallback) {
    const offsets = this.parseOffset16List();
    const count = offsets.length;
    const relativeOffset = this.relativeOffset;
    const list = new Array(count);
    for (let i = 0; i < count; i++) {
        const start = offsets[i];
        if (start === 0) {
            // NULL offset
            // Add i as owned property to list. Convenient with assert.
            list[i] = undefined;
            continue;
        }
        this.relativeOffset = start;
        if (itemCallback) {
            const subOffsets = this.parseOffset16List();
            const subList = new Array(subOffsets.length);
            for (let j = 0; j < subOffsets.length; j++) {
                this.relativeOffset = start + subOffsets[j];
                subList[j] = itemCallback.call(this);
            }
            list[i] = subList;
        } else {
            list[i] = this.parseUShortList();
        }
    }
    this.relativeOffset = relativeOffset;
    return list;
};

///// Complex tables parsing //////////////////////////////////

// Parse a coverage table in a GSUB, GPOS or GDEF table.
// https://www.microsoft.com/typography/OTSPEC/chapter2.htm
// parser.offset must point to the start of the table containing the coverage.
Parser.prototype.parseCoverage = function() {
    const startOffset = this.offset + this.relativeOffset;
    const format = this.parseUShort();
    const count = this.parseUShort();
    if (format === 1) {
        return {
            format: 1,
            glyphs: this.parseUShortList(count)
        };
    } else if (format === 2) {
        const ranges = new Array(count);
        for (let i = 0; i < count; i++) {
            ranges[i] = {
                start: this.parseUShort(),
                end: this.parseUShort(),
                index: this.parseUShort()
            };
        }
        return {
            format: 2,
            ranges: ranges
        };
    }
    throw new Error('0x' + startOffset.toString(16) + ': Coverage format must be 1 or 2.');
};

// Parse a Class Definition Table in a GSUB, GPOS or GDEF table.
// https://www.microsoft.com/typography/OTSPEC/chapter2.htm
Parser.prototype.parseClassDef = function() {
    const startOffset = this.offset + this.relativeOffset;
    const format = this.parseUShort();
    if (format === 1) {
        return {
            format: 1,
            startGlyph: this.parseUShort(),
            classes: this.parseUShortList()
        };
    } else if (format === 2) {
        return {
            format: 2,
            ranges: this.parseRecordList({
                start: Parser.uShort,
                end: Parser.uShort,
                classId: Parser.uShort
            })
        };
    }
    throw new Error('0x' + startOffset.toString(16) + ': ClassDef format must be 1 or 2.');
};

///// Static methods ///////////////////////////////////
// These convenience methods can be used as callbacks and should be called with "this" context set to a Parser instance.

Parser.list = function(count, itemCallback) {
    return function() {
        return this.parseList(count, itemCallback);
    };
};

Parser.list32 = function(count, itemCallback) {
    return function() {
        return this.parseList32(count, itemCallback);
    };
};

Parser.recordList = function(count, recordDescription) {
    return function() {
        return this.parseRecordList(count, recordDescription);
    };
};

Parser.recordList32 = function(count, recordDescription) {
    return function() {
        return this.parseRecordList32(count, recordDescription);
    };
};

Parser.pointer = function(description) {
    return function() {
        return this.parsePointer(description);
    };
};

Parser.pointer32 = function(description) {
    return function() {
        return this.parsePointer32(description);
    };
};

Parser.tag = Parser.prototype.parseTag;
Parser.byte = Parser.prototype.parseByte;
Parser.uShort = Parser.offset16 = Parser.prototype.parseUShort;
Parser.uShortList = Parser.prototype.parseUShortList;
Parser.uLong = Parser.offset32 = Parser.prototype.parseULong;
Parser.uLongList = Parser.prototype.parseULongList;
Parser.struct = Parser.prototype.parseStruct;
Parser.coverage = Parser.prototype.parseCoverage;
Parser.classDef = Parser.prototype.parseClassDef;

///// Script, Feature, Lookup lists ///////////////////////////////////////////////
// https://www.microsoft.com/typography/OTSPEC/chapter2.htm

const langSysTable = {
    reserved: Parser.uShort,
    reqFeatureIndex: Parser.uShort,
    featureIndexes: Parser.uShortList
};

Parser.prototype.parseScriptList = function() {
    return this.parsePointer(Parser.recordList({
        tag: Parser.tag,
        script: Parser.pointer({
            defaultLangSys: Parser.pointer(langSysTable),
            langSysRecords: Parser.recordList({
                tag: Parser.tag,
                langSys: Parser.pointer(langSysTable)
            })
        })
    })) || [];
};

Parser.prototype.parseFeatureList = function() {
    return this.parsePointer(Parser.recordList({
        tag: Parser.tag,
        feature: Parser.pointer({
            featureParams: Parser.offset16,
            lookupListIndexes: Parser.uShortList
        })
    })) || [];
};

Parser.prototype.parseLookupList = function(lookupTableParsers) {
    return this.parsePointer(Parser.list(Parser.pointer(function() {
        const lookupType = this.parseUShort();
        _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(1 <= lookupType && lookupType <= 9, 'GPOS/GSUB lookup type ' + lookupType + ' unknown.');
        const lookupFlag = this.parseUShort();
        const useMarkFilteringSet = lookupFlag & 0x10;
        return {
            lookupType: lookupType,
            lookupFlag: lookupFlag,
            subtables: this.parseList(Parser.pointer(lookupTableParsers[lookupType])),
            markFilteringSet: useMarkFilteringSet ? this.parseUShort() : undefined
        };
    }))) || [];
};

Parser.prototype.parseFeatureVariationsList = function() {
    return this.parsePointer32(function() {
        const majorVersion = this.parseUShort();
        const minorVersion = this.parseUShort();
        _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(majorVersion === 1 && minorVersion < 1, 'GPOS/GSUB feature variations table unknown.');
        const featureVariations = this.parseRecordList32({
            conditionSetOffset: Parser.offset32,
            featureTableSubstitutionOffset: Parser.offset32
        });
        return featureVariations;
    }) || [];
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    getByte,
    getCard8: getByte,
    getUShort,
    getCard16: getUShort,
    getShort,
    getULong,
    getFixed,
    getTag,
    getOffset,
    getBytes,
    bytesToString,
    Parser,
});




/***/ }),

/***/ "./node_modules/opentype.js/src/path.js":
/*!**********************************************!*\
  !*** ./node_modules/opentype.js/src/path.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _bbox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bbox */ "./node_modules/opentype.js/src/bbox.js");
// Geometric objects



/**
 * A bézier path containing a set of path commands similar to a SVG path.
 * Paths can be drawn on a context using `draw`.
 * @exports opentype.Path
 * @class
 * @constructor
 */
function Path() {
    this.commands = [];
    this.fill = 'black';
    this.stroke = null;
    this.strokeWidth = 1;
}

/**
 * @param  {number} x
 * @param  {number} y
 */
Path.prototype.moveTo = function(x, y) {
    this.commands.push({
        type: 'M',
        x: x,
        y: y
    });
};

/**
 * @param  {number} x
 * @param  {number} y
 */
Path.prototype.lineTo = function(x, y) {
    this.commands.push({
        type: 'L',
        x: x,
        y: y
    });
};

/**
 * Draws cubic curve
 * @function
 * curveTo
 * @memberof opentype.Path.prototype
 * @param  {number} x1 - x of control 1
 * @param  {number} y1 - y of control 1
 * @param  {number} x2 - x of control 2
 * @param  {number} y2 - y of control 2
 * @param  {number} x - x of path point
 * @param  {number} y - y of path point
 */

/**
 * Draws cubic curve
 * @function
 * bezierCurveTo
 * @memberof opentype.Path.prototype
 * @param  {number} x1 - x of control 1
 * @param  {number} y1 - y of control 1
 * @param  {number} x2 - x of control 2
 * @param  {number} y2 - y of control 2
 * @param  {number} x - x of path point
 * @param  {number} y - y of path point
 * @see curveTo
 */
Path.prototype.curveTo = Path.prototype.bezierCurveTo = function(x1, y1, x2, y2, x, y) {
    this.commands.push({
        type: 'C',
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        x: x,
        y: y
    });
};

/**
 * Draws quadratic curve
 * @function
 * quadraticCurveTo
 * @memberof opentype.Path.prototype
 * @param  {number} x1 - x of control
 * @param  {number} y1 - y of control
 * @param  {number} x - x of path point
 * @param  {number} y - y of path point
 */

/**
 * Draws quadratic curve
 * @function
 * quadTo
 * @memberof opentype.Path.prototype
 * @param  {number} x1 - x of control
 * @param  {number} y1 - y of control
 * @param  {number} x - x of path point
 * @param  {number} y - y of path point
 */
Path.prototype.quadTo = Path.prototype.quadraticCurveTo = function(x1, y1, x, y) {
    this.commands.push({
        type: 'Q',
        x1: x1,
        y1: y1,
        x: x,
        y: y
    });
};

/**
 * Closes the path
 * @function closePath
 * @memberof opentype.Path.prototype
 */

/**
 * Close the path
 * @function close
 * @memberof opentype.Path.prototype
 */
Path.prototype.close = Path.prototype.closePath = function() {
    this.commands.push({
        type: 'Z'
    });
};

/**
 * Add the given path or list of commands to the commands of this path.
 * @param  {Array} pathOrCommands - another opentype.Path, an opentype.BoundingBox, or an array of commands.
 */
Path.prototype.extend = function(pathOrCommands) {
    if (pathOrCommands.commands) {
        pathOrCommands = pathOrCommands.commands;
    } else if (pathOrCommands instanceof _bbox__WEBPACK_IMPORTED_MODULE_0__.default) {
        const box = pathOrCommands;
        this.moveTo(box.x1, box.y1);
        this.lineTo(box.x2, box.y1);
        this.lineTo(box.x2, box.y2);
        this.lineTo(box.x1, box.y2);
        this.close();
        return;
    }

    Array.prototype.push.apply(this.commands, pathOrCommands);
};

/**
 * Calculate the bounding box of the path.
 * @returns {opentype.BoundingBox}
 */
Path.prototype.getBoundingBox = function() {
    const box = new _bbox__WEBPACK_IMPORTED_MODULE_0__.default();

    let startX = 0;
    let startY = 0;
    let prevX = 0;
    let prevY = 0;
    for (let i = 0; i < this.commands.length; i++) {
        const cmd = this.commands[i];
        switch (cmd.type) {
            case 'M':
                box.addPoint(cmd.x, cmd.y);
                startX = prevX = cmd.x;
                startY = prevY = cmd.y;
                break;
            case 'L':
                box.addPoint(cmd.x, cmd.y);
                prevX = cmd.x;
                prevY = cmd.y;
                break;
            case 'Q':
                box.addQuad(prevX, prevY, cmd.x1, cmd.y1, cmd.x, cmd.y);
                prevX = cmd.x;
                prevY = cmd.y;
                break;
            case 'C':
                box.addBezier(prevX, prevY, cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
                prevX = cmd.x;
                prevY = cmd.y;
                break;
            case 'Z':
                prevX = startX;
                prevY = startY;
                break;
            default:
                throw new Error('Unexpected path command ' + cmd.type);
        }
    }
    if (box.isEmpty()) {
        box.addPoint(0, 0);
    }
    return box;
};

/**
 * Draw the path to a 2D context.
 * @param {CanvasRenderingContext2D} ctx - A 2D drawing context.
 */
Path.prototype.draw = function(ctx) {
    ctx.beginPath();
    for (let i = 0; i < this.commands.length; i += 1) {
        const cmd = this.commands[i];
        if (cmd.type === 'M') {
            ctx.moveTo(cmd.x, cmd.y);
        } else if (cmd.type === 'L') {
            ctx.lineTo(cmd.x, cmd.y);
        } else if (cmd.type === 'C') {
            ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
        } else if (cmd.type === 'Q') {
            ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
        } else if (cmd.type === 'Z') {
            ctx.closePath();
        }
    }

    if (this.fill) {
        ctx.fillStyle = this.fill;
        ctx.fill();
    }

    if (this.stroke) {
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = this.strokeWidth;
        ctx.stroke();
    }
};

/**
 * Convert the Path to a string of path data instructions
 * See http://www.w3.org/TR/SVG/paths.html#PathData
 * @param  {number} [decimalPlaces=2] - The amount of decimal places for floating-point values
 * @return {string}
 */
Path.prototype.toPathData = function(decimalPlaces) {
    decimalPlaces = decimalPlaces !== undefined ? decimalPlaces : 2;

    function floatToString(v) {
        if (Math.round(v) === v) {
            return '' + Math.round(v);
        } else {
            return v.toFixed(decimalPlaces);
        }
    }

    function packValues() {
        let s = '';
        for (let i = 0; i < arguments.length; i += 1) {
            const v = arguments[i];
            if (v >= 0 && i > 0) {
                s += ' ';
            }

            s += floatToString(v);
        }

        return s;
    }

    let d = '';
    for (let i = 0; i < this.commands.length; i += 1) {
        const cmd = this.commands[i];
        if (cmd.type === 'M') {
            d += 'M' + packValues(cmd.x, cmd.y);
        } else if (cmd.type === 'L') {
            d += 'L' + packValues(cmd.x, cmd.y);
        } else if (cmd.type === 'C') {
            d += 'C' + packValues(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
        } else if (cmd.type === 'Q') {
            d += 'Q' + packValues(cmd.x1, cmd.y1, cmd.x, cmd.y);
        } else if (cmd.type === 'Z') {
            d += 'Z';
        }
    }

    return d;
};

/**
 * Convert the path to an SVG <path> element, as a string.
 * @param  {number} [decimalPlaces=2] - The amount of decimal places for floating-point values
 * @return {string}
 */
Path.prototype.toSVG = function(decimalPlaces) {
    let svg = '<path d="';
    svg += this.toPathData(decimalPlaces);
    svg += '"';
    if (this.fill && this.fill !== 'black') {
        if (this.fill === null) {
            svg += ' fill="none"';
        } else {
            svg += ' fill="' + this.fill + '"';
        }
    }

    if (this.stroke) {
        svg += ' stroke="' + this.stroke + '" stroke-width="' + this.strokeWidth + '"';
    }

    svg += '/>';
    return svg;
};

/**
 * Convert the path to a DOM element.
 * @param  {number} [decimalPlaces=2] - The amount of decimal places for floating-point values
 * @return {SVGPathElement}
 */
Path.prototype.toDOMElement = function(decimalPlaces) {
    const temporaryPath = this.toPathData(decimalPlaces);
    const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    newPath.setAttribute('d', temporaryPath);

    return newPath;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Path);


/***/ }),

/***/ "./node_modules/opentype.js/src/position.js":
/*!**************************************************!*\
  !*** ./node_modules/opentype.js/src/position.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./layout */ "./node_modules/opentype.js/src/layout.js");
// The Position object provides utility methods to manipulate
// the GPOS position table.



/**
 * @exports opentype.Position
 * @class
 * @extends opentype.Layout
 * @param {opentype.Font}
 * @constructor
 */
function Position(font) {
    _layout__WEBPACK_IMPORTED_MODULE_0__.default.call(this, font, 'gpos');
}

Position.prototype = _layout__WEBPACK_IMPORTED_MODULE_0__.default.prototype;

/**
 * Find a glyph pair in a list of lookup tables of type 2 and retrieve the xAdvance kerning value.
 *
 * @param {integer} leftIndex - left glyph index
 * @param {integer} rightIndex - right glyph index
 * @returns {integer}
 */
Position.prototype.getKerningValue = function(kerningLookups, leftIndex, rightIndex) {
    for (let i = 0; i < kerningLookups.length; i++) {
        const subtables = kerningLookups[i].subtables;
        for (let j = 0; j < subtables.length; j++) {
            const subtable = subtables[j];
            const covIndex = this.getCoverageIndex(subtable.coverage, leftIndex);
            if (covIndex < 0) continue;
            switch (subtable.posFormat) {
                case 1:
                    // Search Pair Adjustment Positioning Format 1
                    let pairSet = subtable.pairSets[covIndex];
                    for (let k = 0; k < pairSet.length; k++) {
                        let pair = pairSet[k];
                        if (pair.secondGlyph === rightIndex) {
                            return pair.value1 && pair.value1.xAdvance || 0;
                        }
                    }
                    break;      // left glyph found, not right glyph - try next subtable
                case 2:
                    // Search Pair Adjustment Positioning Format 2
                    const class1 = this.getGlyphClass(subtable.classDef1, leftIndex);
                    const class2 = this.getGlyphClass(subtable.classDef2, rightIndex);
                    const pair = subtable.classRecords[class1][class2];
                    return pair.value1 && pair.value1.xAdvance || 0;
            }
        }
    }
    return 0;
};

/**
 * List all kerning lookup tables.
 *
 * @param {string} [script='DFLT'] - use font.position.getDefaultScriptName() for a better default value
 * @param {string} [language='dflt']
 * @return {object[]} The list of kerning lookup tables (may be empty), or undefined if there is no GPOS table (and we should use the kern table)
 */
Position.prototype.getKerningTables = function(script, language) {
    if (this.font.tables.gpos) {
        return this.getLookupTables(script, language, 'kern', 2);
    }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Position);


/***/ }),

/***/ "./node_modules/opentype.js/src/substitution.js":
/*!******************************************************!*\
  !*** ./node_modules/opentype.js/src/substitution.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./check */ "./node_modules/opentype.js/src/check.js");
/* harmony import */ var _layout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./layout */ "./node_modules/opentype.js/src/layout.js");
// The Substitution object provides utility methods to manipulate
// the GSUB substitution table.




/**
 * @exports opentype.Substitution
 * @class
 * @extends opentype.Layout
 * @param {opentype.Font}
 * @constructor
 */
function Substitution(font) {
    _layout__WEBPACK_IMPORTED_MODULE_1__.default.call(this, font, 'gsub');
}

// Check if 2 arrays of primitives are equal.
function arraysEqual(ar1, ar2) {
    const n = ar1.length;
    if (n !== ar2.length) { return false; }
    for (let i = 0; i < n; i++) {
        if (ar1[i] !== ar2[i]) { return false; }
    }
    return true;
}

// Find the first subtable of a lookup table in a particular format.
function getSubstFormat(lookupTable, format, defaultSubtable) {
    const subtables = lookupTable.subtables;
    for (let i = 0; i < subtables.length; i++) {
        const subtable = subtables[i];
        if (subtable.substFormat === format) {
            return subtable;
        }
    }
    if (defaultSubtable) {
        subtables.push(defaultSubtable);
        return defaultSubtable;
    }
    return undefined;
}

Substitution.prototype = _layout__WEBPACK_IMPORTED_MODULE_1__.default.prototype;

/**
 * Create a default GSUB table.
 * @return {Object} gsub - The GSUB table.
 */
Substitution.prototype.createDefaultTable = function() {
    // Generate a default empty GSUB table with just a DFLT script and dflt lang sys.
    return {
        version: 1,
        scripts: [{
            tag: 'DFLT',
            script: {
                defaultLangSys: { reserved: 0, reqFeatureIndex: 0xffff, featureIndexes: [] },
                langSysRecords: []
            }
        }],
        features: [],
        lookups: []
    };
};

/**
 * List all single substitutions (lookup type 1) for a given script, language, and feature.
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 * @param {string} feature - 4-character feature name ('aalt', 'salt', 'ss01'...)
 * @return {Array} substitutions - The list of substitutions.
 */
Substitution.prototype.getSingle = function(feature, script, language) {
    const substitutions = [];
    const lookupTables = this.getLookupTables(script, language, feature, 1);
    for (let idx = 0; idx < lookupTables.length; idx++) {
        const subtables = lookupTables[idx].subtables;
        for (let i = 0; i < subtables.length; i++) {
            const subtable = subtables[i];
            const glyphs = this.expandCoverage(subtable.coverage);
            let j;
            if (subtable.substFormat === 1) {
                const delta = subtable.deltaGlyphId;
                for (j = 0; j < glyphs.length; j++) {
                    const glyph = glyphs[j];
                    substitutions.push({ sub: glyph, by: glyph + delta });
                }
            } else {
                const substitute = subtable.substitute;
                for (j = 0; j < glyphs.length; j++) {
                    substitutions.push({ sub: glyphs[j], by: substitute[j] });
                }
            }
        }
    }
    return substitutions;
};

/**
 * List all alternates (lookup type 3) for a given script, language, and feature.
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 * @param {string} feature - 4-character feature name ('aalt', 'salt'...)
 * @return {Array} alternates - The list of alternates
 */
Substitution.prototype.getAlternates = function(feature, script, language) {
    const alternates = [];
    const lookupTables = this.getLookupTables(script, language, feature, 3);
    for (let idx = 0; idx < lookupTables.length; idx++) {
        const subtables = lookupTables[idx].subtables;
        for (let i = 0; i < subtables.length; i++) {
            const subtable = subtables[i];
            const glyphs = this.expandCoverage(subtable.coverage);
            const alternateSets = subtable.alternateSets;
            for (let j = 0; j < glyphs.length; j++) {
                alternates.push({ sub: glyphs[j], by: alternateSets[j] });
            }
        }
    }
    return alternates;
};

/**
 * List all ligatures (lookup type 4) for a given script, language, and feature.
 * The result is an array of ligature objects like { sub: [ids], by: id }
 * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 * @return {Array} ligatures - The list of ligatures.
 */
Substitution.prototype.getLigatures = function(feature, script, language) {
    const ligatures = [];
    const lookupTables = this.getLookupTables(script, language, feature, 4);
    for (let idx = 0; idx < lookupTables.length; idx++) {
        const subtables = lookupTables[idx].subtables;
        for (let i = 0; i < subtables.length; i++) {
            const subtable = subtables[i];
            const glyphs = this.expandCoverage(subtable.coverage);
            const ligatureSets = subtable.ligatureSets;
            for (let j = 0; j < glyphs.length; j++) {
                const startGlyph = glyphs[j];
                const ligSet = ligatureSets[j];
                for (let k = 0; k < ligSet.length; k++) {
                    const lig = ligSet[k];
                    ligatures.push({
                        sub: [startGlyph].concat(lig.components),
                        by: lig.ligGlyph
                    });
                }
            }
        }
    }
    return ligatures;
};

/**
 * Add or modify a single substitution (lookup type 1)
 * Format 2, more flexible, is always used.
 * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
 * @param {Object} substitution - { sub: id, delta: number } for format 1 or { sub: id, by: id } for format 2.
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 */
Substitution.prototype.addSingle = function(feature, substitution, script, language) {
    const lookupTable = this.getLookupTables(script, language, feature, 1, true)[0];
    const subtable = getSubstFormat(lookupTable, 2, {                // lookup type 1 subtable, format 2, coverage format 1
        substFormat: 2,
        coverage: {format: 1, glyphs: []},
        substitute: []
    });
    _check__WEBPACK_IMPORTED_MODULE_0__.default.assert(subtable.coverage.format === 1, 'Ligature: unable to modify coverage table format ' + subtable.coverage.format);
    const coverageGlyph = substitution.sub;
    let pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
    if (pos < 0) {
        pos = -1 - pos;
        subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
        subtable.substitute.splice(pos, 0, 0);
    }
    subtable.substitute[pos] = substitution.by;
};

/**
 * Add or modify an alternate substitution (lookup type 1)
 * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
 * @param {Object} substitution - { sub: id, by: [ids] }
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 */
Substitution.prototype.addAlternate = function(feature, substitution, script, language) {
    const lookupTable = this.getLookupTables(script, language, feature, 3, true)[0];
    const subtable = getSubstFormat(lookupTable, 1, {                // lookup type 3 subtable, format 1, coverage format 1
        substFormat: 1,
        coverage: {format: 1, glyphs: []},
        alternateSets: []
    });
    _check__WEBPACK_IMPORTED_MODULE_0__.default.assert(subtable.coverage.format === 1, 'Ligature: unable to modify coverage table format ' + subtable.coverage.format);
    const coverageGlyph = substitution.sub;
    let pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
    if (pos < 0) {
        pos = -1 - pos;
        subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
        subtable.alternateSets.splice(pos, 0, 0);
    }
    subtable.alternateSets[pos] = substitution.by;
};

/**
 * Add a ligature (lookup type 4)
 * Ligatures with more components must be stored ahead of those with fewer components in order to be found
 * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
 * @param {Object} ligature - { sub: [ids], by: id }
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 */
Substitution.prototype.addLigature = function(feature, ligature, script, language) {
    const lookupTable = this.getLookupTables(script, language, feature, 4, true)[0];
    let subtable = lookupTable.subtables[0];
    if (!subtable) {
        subtable = {                // lookup type 4 subtable, format 1, coverage format 1
            substFormat: 1,
            coverage: { format: 1, glyphs: [] },
            ligatureSets: []
        };
        lookupTable.subtables[0] = subtable;
    }
    _check__WEBPACK_IMPORTED_MODULE_0__.default.assert(subtable.coverage.format === 1, 'Ligature: unable to modify coverage table format ' + subtable.coverage.format);
    const coverageGlyph = ligature.sub[0];
    const ligComponents = ligature.sub.slice(1);
    const ligatureTable = {
        ligGlyph: ligature.by,
        components: ligComponents
    };
    let pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
    if (pos >= 0) {
        // ligatureSet already exists
        const ligatureSet = subtable.ligatureSets[pos];
        for (let i = 0; i < ligatureSet.length; i++) {
            // If ligature already exists, return.
            if (arraysEqual(ligatureSet[i].components, ligComponents)) {
                return;
            }
        }
        // ligature does not exist: add it.
        ligatureSet.push(ligatureTable);
    } else {
        // Create a new ligatureSet and add coverage for the first glyph.
        pos = -1 - pos;
        subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
        subtable.ligatureSets.splice(pos, 0, [ligatureTable]);
    }
};

/**
 * List all feature data for a given script and language.
 * @param {string} feature - 4-letter feature name
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 * @return {Array} substitutions - The list of substitutions.
 */
Substitution.prototype.getFeature = function(feature, script, language) {
    if (/ss\d\d/.test(feature)) {
        // ss01 - ss20
        return this.getSingle(feature, script, language);
    }
    switch (feature) {
        case 'aalt':
        case 'salt':
            return this.getSingle(feature, script, language)
                    .concat(this.getAlternates(feature, script, language));
        case 'dlig':
        case 'liga':
        case 'rlig': return this.getLigatures(feature, script, language);
    }
    return undefined;
};

/**
 * Add a substitution to a feature for a given script and language.
 * @param {string} feature - 4-letter feature name
 * @param {Object} sub - the substitution to add (an object like { sub: id or [ids], by: id or [ids] })
 * @param {string} [script='DFLT']
 * @param {string} [language='dflt']
 */
Substitution.prototype.add = function(feature, sub, script, language) {
    if (/ss\d\d/.test(feature)) {
        // ss01 - ss20
        return this.addSingle(feature, sub, script, language);
    }
    switch (feature) {
        case 'aalt':
        case 'salt':
            if (typeof sub.by === 'number') {
                return this.addSingle(feature, sub, script, language);
            }
            return this.addAlternate(feature, sub, script, language);
        case 'dlig':
        case 'liga':
        case 'rlig':
            return this.addLigature(feature, sub, script, language);
    }
    return undefined;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Substitution);


/***/ }),

/***/ "./node_modules/opentype.js/src/table.js":
/*!***********************************************!*\
  !*** ./node_modules/opentype.js/src/table.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./check */ "./node_modules/opentype.js/src/check.js");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types */ "./node_modules/opentype.js/src/types.js");
// Table metadata




/**
 * @exports opentype.Table
 * @class
 * @param {string} tableName
 * @param {Array} fields
 * @param {Object} options
 * @constructor
 */
function Table(tableName, fields, options) {
    for (let i = 0; i < fields.length; i += 1) {
        const field = fields[i];
        this[field.name] = field.value;
    }

    this.tableName = tableName;
    this.fields = fields;
    if (options) {
        const optionKeys = Object.keys(options);
        for (let i = 0; i < optionKeys.length; i += 1) {
            const k = optionKeys[i];
            const v = options[k];
            if (this[k] !== undefined) {
                this[k] = v;
            }
        }
    }
}

/**
 * Encodes the table and returns an array of bytes
 * @return {Array}
 */
Table.prototype.encode = function() {
    return _types__WEBPACK_IMPORTED_MODULE_1__.encode.TABLE(this);
};

/**
 * Get the size of the table.
 * @return {number}
 */
Table.prototype.sizeOf = function() {
    return _types__WEBPACK_IMPORTED_MODULE_1__.sizeOf.TABLE(this);
};

/**
 * @private
 */
function ushortList(itemName, list, count) {
    if (count === undefined) {
        count = list.length;
    }
    const fields = new Array(list.length + 1);
    fields[0] = {name: itemName + 'Count', type: 'USHORT', value: count};
    for (let i = 0; i < list.length; i++) {
        fields[i + 1] = {name: itemName + i, type: 'USHORT', value: list[i]};
    }
    return fields;
}

/**
 * @private
 */
function tableList(itemName, records, itemCallback) {
    const count = records.length;
    const fields = new Array(count + 1);
    fields[0] = {name: itemName + 'Count', type: 'USHORT', value: count};
    for (let i = 0; i < count; i++) {
        fields[i + 1] = {name: itemName + i, type: 'TABLE', value: itemCallback(records[i], i)};
    }
    return fields;
}

/**
 * @private
 */
function recordList(itemName, records, itemCallback) {
    const count = records.length;
    let fields = [];
    fields[0] = {name: itemName + 'Count', type: 'USHORT', value: count};
    for (let i = 0; i < count; i++) {
        fields = fields.concat(itemCallback(records[i], i));
    }
    return fields;
}

// Common Layout Tables

/**
 * @exports opentype.Coverage
 * @class
 * @param {opentype.Table}
 * @constructor
 * @extends opentype.Table
 */
function Coverage(coverageTable) {
    if (coverageTable.format === 1) {
        Table.call(this, 'coverageTable',
            [{name: 'coverageFormat', type: 'USHORT', value: 1}]
            .concat(ushortList('glyph', coverageTable.glyphs))
        );
    } else {
        _check__WEBPACK_IMPORTED_MODULE_0__.default.assert(false, 'Can\'t create coverage table format 2 yet.');
    }
}
Coverage.prototype = Object.create(Table.prototype);
Coverage.prototype.constructor = Coverage;

function ScriptList(scriptListTable) {
    Table.call(this, 'scriptListTable',
        recordList('scriptRecord', scriptListTable, function(scriptRecord, i) {
            const script = scriptRecord.script;
            let defaultLangSys = script.defaultLangSys;
            _check__WEBPACK_IMPORTED_MODULE_0__.default.assert(!!defaultLangSys, 'Unable to write GSUB: script ' + scriptRecord.tag + ' has no default language system.');
            return [
                {name: 'scriptTag' + i, type: 'TAG', value: scriptRecord.tag},
                {name: 'script' + i, type: 'TABLE', value: new Table('scriptTable', [
                    {name: 'defaultLangSys', type: 'TABLE', value: new Table('defaultLangSys', [
                        {name: 'lookupOrder', type: 'USHORT', value: 0},
                        {name: 'reqFeatureIndex', type: 'USHORT', value: defaultLangSys.reqFeatureIndex}]
                        .concat(ushortList('featureIndex', defaultLangSys.featureIndexes)))}
                    ].concat(recordList('langSys', script.langSysRecords, function(langSysRecord, i) {
                        const langSys = langSysRecord.langSys;
                        return [
                            {name: 'langSysTag' + i, type: 'TAG', value: langSysRecord.tag},
                            {name: 'langSys' + i, type: 'TABLE', value: new Table('langSys', [
                                {name: 'lookupOrder', type: 'USHORT', value: 0},
                                {name: 'reqFeatureIndex', type: 'USHORT', value: langSys.reqFeatureIndex}
                                ].concat(ushortList('featureIndex', langSys.featureIndexes)))}
                        ];
                    })))}
            ];
        })
    );
}
ScriptList.prototype = Object.create(Table.prototype);
ScriptList.prototype.constructor = ScriptList;

/**
 * @exports opentype.FeatureList
 * @class
 * @param {opentype.Table}
 * @constructor
 * @extends opentype.Table
 */
function FeatureList(featureListTable) {
    Table.call(this, 'featureListTable',
        recordList('featureRecord', featureListTable, function(featureRecord, i) {
            const feature = featureRecord.feature;
            return [
                {name: 'featureTag' + i, type: 'TAG', value: featureRecord.tag},
                {name: 'feature' + i, type: 'TABLE', value: new Table('featureTable', [
                    {name: 'featureParams', type: 'USHORT', value: feature.featureParams},
                    ].concat(ushortList('lookupListIndex', feature.lookupListIndexes)))}
            ];
        })
    );
}
FeatureList.prototype = Object.create(Table.prototype);
FeatureList.prototype.constructor = FeatureList;

/**
 * @exports opentype.LookupList
 * @class
 * @param {opentype.Table}
 * @param {Object}
 * @constructor
 * @extends opentype.Table
 */
function LookupList(lookupListTable, subtableMakers) {
    Table.call(this, 'lookupListTable', tableList('lookup', lookupListTable, function(lookupTable) {
        let subtableCallback = subtableMakers[lookupTable.lookupType];
        _check__WEBPACK_IMPORTED_MODULE_0__.default.assert(!!subtableCallback, 'Unable to write GSUB lookup type ' + lookupTable.lookupType + ' tables.');
        return new Table('lookupTable', [
            {name: 'lookupType', type: 'USHORT', value: lookupTable.lookupType},
            {name: 'lookupFlag', type: 'USHORT', value: lookupTable.lookupFlag}
        ].concat(tableList('subtable', lookupTable.subtables, subtableCallback)));
    }));
}
LookupList.prototype = Object.create(Table.prototype);
LookupList.prototype.constructor = LookupList;

// Record = same as Table, but inlined (a Table has an offset and its data is further in the stream)
// Don't use offsets inside Records (probable bug), only in Tables.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    Table,
    Record: Table,
    Coverage,
    ScriptList,
    FeatureList,
    LookupList,
    ushortList,
    tableList,
    recordList,
});


/***/ }),

/***/ "./node_modules/opentype.js/src/tables/cff.js":
/*!****************************************************!*\
  !*** ./node_modules/opentype.js/src/tables/cff.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _encoding__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../encoding */ "./node_modules/opentype.js/src/encoding.js");
/* harmony import */ var _glyphset__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../glyphset */ "./node_modules/opentype.js/src/glyphset.js");
/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../parse */ "./node_modules/opentype.js/src/parse.js");
/* harmony import */ var _path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../path */ "./node_modules/opentype.js/src/path.js");
/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../table */ "./node_modules/opentype.js/src/table.js");
// The `CFF` table contains the glyph outlines in PostScript format.
// https://www.microsoft.com/typography/OTSPEC/cff.htm
// http://download.microsoft.com/download/8/0/1/801a191c-029d-4af3-9642-555f6fe514ee/cff.pdf
// http://download.microsoft.com/download/8/0/1/801a191c-029d-4af3-9642-555f6fe514ee/type2.pdf







// Custom equals function that can also check lists.
function equals(a, b) {
    if (a === b) {
        return true;
    } else if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }

        for (let i = 0; i < a.length; i += 1) {
            if (!equals(a[i], b[i])) {
                return false;
            }
        }

        return true;
    } else {
        return false;
    }
}

// Subroutines are encoded using the negative half of the number space.
// See type 2 chapter 4.7 "Subroutine operators".
function calcCFFSubroutineBias(subrs) {
    let bias;
    if (subrs.length < 1240) {
        bias = 107;
    } else if (subrs.length < 33900) {
        bias = 1131;
    } else {
        bias = 32768;
    }

    return bias;
}

// Parse a `CFF` INDEX array.
// An index array consists of a list of offsets, then a list of objects at those offsets.
function parseCFFIndex(data, start, conversionFn) {
    const offsets = [];
    const objects = [];
    const count = _parse__WEBPACK_IMPORTED_MODULE_2__.default.getCard16(data, start);
    let objectOffset;
    let endOffset;
    if (count !== 0) {
        const offsetSize = _parse__WEBPACK_IMPORTED_MODULE_2__.default.getByte(data, start + 2);
        objectOffset = start + ((count + 1) * offsetSize) + 2;
        let pos = start + 3;
        for (let i = 0; i < count + 1; i += 1) {
            offsets.push(_parse__WEBPACK_IMPORTED_MODULE_2__.default.getOffset(data, pos, offsetSize));
            pos += offsetSize;
        }

        // The total size of the index array is 4 header bytes + the value of the last offset.
        endOffset = objectOffset + offsets[count];
    } else {
        endOffset = start + 2;
    }

    for (let i = 0; i < offsets.length - 1; i += 1) {
        let value = _parse__WEBPACK_IMPORTED_MODULE_2__.default.getBytes(data, objectOffset + offsets[i], objectOffset + offsets[i + 1]);
        if (conversionFn) {
            value = conversionFn(value);
        }

        objects.push(value);
    }

    return {objects: objects, startOffset: start, endOffset: endOffset};
}

// Parse a `CFF` DICT real value.
function parseFloatOperand(parser) {
    let s = '';
    const eof = 15;
    const lookup = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'E', 'E-', null, '-'];
    while (true) {
        const b = parser.parseByte();
        const n1 = b >> 4;
        const n2 = b & 15;

        if (n1 === eof) {
            break;
        }

        s += lookup[n1];

        if (n2 === eof) {
            break;
        }

        s += lookup[n2];
    }

    return parseFloat(s);
}

// Parse a `CFF` DICT operand.
function parseOperand(parser, b0) {
    let b1;
    let b2;
    let b3;
    let b4;
    if (b0 === 28) {
        b1 = parser.parseByte();
        b2 = parser.parseByte();
        return b1 << 8 | b2;
    }

    if (b0 === 29) {
        b1 = parser.parseByte();
        b2 = parser.parseByte();
        b3 = parser.parseByte();
        b4 = parser.parseByte();
        return b1 << 24 | b2 << 16 | b3 << 8 | b4;
    }

    if (b0 === 30) {
        return parseFloatOperand(parser);
    }

    if (b0 >= 32 && b0 <= 246) {
        return b0 - 139;
    }

    if (b0 >= 247 && b0 <= 250) {
        b1 = parser.parseByte();
        return (b0 - 247) * 256 + b1 + 108;
    }

    if (b0 >= 251 && b0 <= 254) {
        b1 = parser.parseByte();
        return -(b0 - 251) * 256 - b1 - 108;
    }

    throw new Error('Invalid b0 ' + b0);
}

// Convert the entries returned by `parseDict` to a proper dictionary.
// If a value is a list of one, it is unpacked.
function entriesToObject(entries) {
    const o = {};
    for (let i = 0; i < entries.length; i += 1) {
        const key = entries[i][0];
        const values = entries[i][1];
        let value;
        if (values.length === 1) {
            value = values[0];
        } else {
            value = values;
        }

        if (o.hasOwnProperty(key) && !isNaN(o[key])) {
            throw new Error('Object ' + o + ' already has key ' + key);
        }

        o[key] = value;
    }

    return o;
}

// Parse a `CFF` DICT object.
// A dictionary contains key-value pairs in a compact tokenized format.
function parseCFFDict(data, start, size) {
    start = start !== undefined ? start : 0;
    const parser = new _parse__WEBPACK_IMPORTED_MODULE_2__.default.Parser(data, start);
    const entries = [];
    let operands = [];
    size = size !== undefined ? size : data.length;

    while (parser.relativeOffset < size) {
        let op = parser.parseByte();

        // The first byte for each dict item distinguishes between operator (key) and operand (value).
        // Values <= 21 are operators.
        if (op <= 21) {
            // Two-byte operators have an initial escape byte of 12.
            if (op === 12) {
                op = 1200 + parser.parseByte();
            }

            entries.push([op, operands]);
            operands = [];
        } else {
            // Since the operands (values) come before the operators (keys), we store all operands in a list
            // until we encounter an operator.
            operands.push(parseOperand(parser, op));
        }
    }

    return entriesToObject(entries);
}

// Given a String Index (SID), return the value of the string.
// Strings below index 392 are standard CFF strings and are not encoded in the font.
function getCFFString(strings, index) {
    if (index <= 390) {
        index = _encoding__WEBPACK_IMPORTED_MODULE_0__.cffStandardStrings[index];
    } else {
        index = strings[index - 391];
    }

    return index;
}

// Interpret a dictionary and return a new dictionary with readable keys and values for missing entries.
// This function takes `meta` which is a list of objects containing `operand`, `name` and `default`.
function interpretDict(dict, meta, strings) {
    const newDict = {};
    let value;

    // Because we also want to include missing values, we start out from the meta list
    // and lookup values in the dict.
    for (let i = 0; i < meta.length; i += 1) {
        const m = meta[i];

        if (Array.isArray(m.type)) {
            const values = [];
            values.length = m.type.length;
            for (let j = 0; j < m.type.length; j++) {
                value = dict[m.op] !== undefined ? dict[m.op][j] : undefined;
                if (value === undefined) {
                    value = m.value !== undefined && m.value[j] !== undefined ? m.value[j] : null;
                }
                if (m.type[j] === 'SID') {
                    value = getCFFString(strings, value);
                }
                values[j] = value;
            }
            newDict[m.name] = values;
        } else {
            value = dict[m.op];
            if (value === undefined) {
                value = m.value !== undefined ? m.value : null;
            }

            if (m.type === 'SID') {
                value = getCFFString(strings, value);
            }
            newDict[m.name] = value;
        }
    }

    return newDict;
}

// Parse the CFF header.
function parseCFFHeader(data, start) {
    const header = {};
    header.formatMajor = _parse__WEBPACK_IMPORTED_MODULE_2__.default.getCard8(data, start);
    header.formatMinor = _parse__WEBPACK_IMPORTED_MODULE_2__.default.getCard8(data, start + 1);
    header.size = _parse__WEBPACK_IMPORTED_MODULE_2__.default.getCard8(data, start + 2);
    header.offsetSize = _parse__WEBPACK_IMPORTED_MODULE_2__.default.getCard8(data, start + 3);
    header.startOffset = start;
    header.endOffset = start + 4;
    return header;
}

const TOP_DICT_META = [
    {name: 'version', op: 0, type: 'SID'},
    {name: 'notice', op: 1, type: 'SID'},
    {name: 'copyright', op: 1200, type: 'SID'},
    {name: 'fullName', op: 2, type: 'SID'},
    {name: 'familyName', op: 3, type: 'SID'},
    {name: 'weight', op: 4, type: 'SID'},
    {name: 'isFixedPitch', op: 1201, type: 'number', value: 0},
    {name: 'italicAngle', op: 1202, type: 'number', value: 0},
    {name: 'underlinePosition', op: 1203, type: 'number', value: -100},
    {name: 'underlineThickness', op: 1204, type: 'number', value: 50},
    {name: 'paintType', op: 1205, type: 'number', value: 0},
    {name: 'charstringType', op: 1206, type: 'number', value: 2},
    {
        name: 'fontMatrix',
        op: 1207,
        type: ['real', 'real', 'real', 'real', 'real', 'real'],
        value: [0.001, 0, 0, 0.001, 0, 0]
    },
    {name: 'uniqueId', op: 13, type: 'number'},
    {name: 'fontBBox', op: 5, type: ['number', 'number', 'number', 'number'], value: [0, 0, 0, 0]},
    {name: 'strokeWidth', op: 1208, type: 'number', value: 0},
    {name: 'xuid', op: 14, type: [], value: null},
    {name: 'charset', op: 15, type: 'offset', value: 0},
    {name: 'encoding', op: 16, type: 'offset', value: 0},
    {name: 'charStrings', op: 17, type: 'offset', value: 0},
    {name: 'private', op: 18, type: ['number', 'offset'], value: [0, 0]},
    {name: 'ros', op: 1230, type: ['SID', 'SID', 'number']},
    {name: 'cidFontVersion', op: 1231, type: 'number', value: 0},
    {name: 'cidFontRevision', op: 1232, type: 'number', value: 0},
    {name: 'cidFontType', op: 1233, type: 'number', value: 0},
    {name: 'cidCount', op: 1234, type: 'number', value: 8720},
    {name: 'uidBase', op: 1235, type: 'number'},
    {name: 'fdArray', op: 1236, type: 'offset'},
    {name: 'fdSelect', op: 1237, type: 'offset'},
    {name: 'fontName', op: 1238, type: 'SID'}
];

const PRIVATE_DICT_META = [
    {name: 'subrs', op: 19, type: 'offset', value: 0},
    {name: 'defaultWidthX', op: 20, type: 'number', value: 0},
    {name: 'nominalWidthX', op: 21, type: 'number', value: 0}
];

// Parse the CFF top dictionary. A CFF table can contain multiple fonts, each with their own top dictionary.
// The top dictionary contains the essential metadata for the font, together with the private dictionary.
function parseCFFTopDict(data, strings) {
    const dict = parseCFFDict(data, 0, data.byteLength);
    return interpretDict(dict, TOP_DICT_META, strings);
}

// Parse the CFF private dictionary. We don't fully parse out all the values, only the ones we need.
function parseCFFPrivateDict(data, start, size, strings) {
    const dict = parseCFFDict(data, start, size);
    return interpretDict(dict, PRIVATE_DICT_META, strings);
}

// Returns a list of "Top DICT"s found using an INDEX list.
// Used to read both the usual high-level Top DICTs and also the FDArray
// discovered inside CID-keyed fonts.  When a Top DICT has a reference to
// a Private DICT that is read and saved into the Top DICT.
//
// In addition to the expected/optional values as outlined in TOP_DICT_META
// the following values might be saved into the Top DICT.
//
//    _subrs []        array of local CFF subroutines from Private DICT
//    _subrsBias       bias value computed from number of subroutines
//                      (see calcCFFSubroutineBias() and parseCFFCharstring())
//    _defaultWidthX   default widths for CFF characters
//    _nominalWidthX   bias added to width embedded within glyph description
//
//    _privateDict     saved copy of parsed Private DICT from Top DICT
function gatherCFFTopDicts(data, start, cffIndex, strings) {
    const topDictArray = [];
    for (let iTopDict = 0; iTopDict < cffIndex.length; iTopDict += 1) {
        const topDictData = new DataView(new Uint8Array(cffIndex[iTopDict]).buffer);
        const topDict = parseCFFTopDict(topDictData, strings);
        topDict._subrs = [];
        topDict._subrsBias = 0;
        const privateSize = topDict.private[0];
        const privateOffset = topDict.private[1];
        if (privateSize !== 0 && privateOffset !== 0) {
            const privateDict = parseCFFPrivateDict(data, privateOffset + start, privateSize, strings);
            topDict._defaultWidthX = privateDict.defaultWidthX;
            topDict._nominalWidthX = privateDict.nominalWidthX;
            if (privateDict.subrs !== 0) {
                const subrOffset = privateOffset + privateDict.subrs;
                const subrIndex = parseCFFIndex(data, subrOffset + start);
                topDict._subrs = subrIndex.objects;
                topDict._subrsBias = calcCFFSubroutineBias(topDict._subrs);
            }
            topDict._privateDict = privateDict;
        }
        topDictArray.push(topDict);
    }
    return topDictArray;
}

// Parse the CFF charset table, which contains internal names for all the glyphs.
// This function will return a list of glyph names.
// See Adobe TN #5176 chapter 13, "Charsets".
function parseCFFCharset(data, start, nGlyphs, strings) {
    let sid;
    let count;
    const parser = new _parse__WEBPACK_IMPORTED_MODULE_2__.default.Parser(data, start);

    // The .notdef glyph is not included, so subtract 1.
    nGlyphs -= 1;
    const charset = ['.notdef'];

    const format = parser.parseCard8();
    if (format === 0) {
        for (let i = 0; i < nGlyphs; i += 1) {
            sid = parser.parseSID();
            charset.push(getCFFString(strings, sid));
        }
    } else if (format === 1) {
        while (charset.length <= nGlyphs) {
            sid = parser.parseSID();
            count = parser.parseCard8();
            for (let i = 0; i <= count; i += 1) {
                charset.push(getCFFString(strings, sid));
                sid += 1;
            }
        }
    } else if (format === 2) {
        while (charset.length <= nGlyphs) {
            sid = parser.parseSID();
            count = parser.parseCard16();
            for (let i = 0; i <= count; i += 1) {
                charset.push(getCFFString(strings, sid));
                sid += 1;
            }
        }
    } else {
        throw new Error('Unknown charset format ' + format);
    }

    return charset;
}

// Parse the CFF encoding data. Only one encoding can be specified per font.
// See Adobe TN #5176 chapter 12, "Encodings".
function parseCFFEncoding(data, start, charset) {
    let code;
    const enc = {};
    const parser = new _parse__WEBPACK_IMPORTED_MODULE_2__.default.Parser(data, start);
    const format = parser.parseCard8();
    if (format === 0) {
        const nCodes = parser.parseCard8();
        for (let i = 0; i < nCodes; i += 1) {
            code = parser.parseCard8();
            enc[code] = i;
        }
    } else if (format === 1) {
        const nRanges = parser.parseCard8();
        code = 1;
        for (let i = 0; i < nRanges; i += 1) {
            const first = parser.parseCard8();
            const nLeft = parser.parseCard8();
            for (let j = first; j <= first + nLeft; j += 1) {
                enc[j] = code;
                code += 1;
            }
        }
    } else {
        throw new Error('Unknown encoding format ' + format);
    }

    return new _encoding__WEBPACK_IMPORTED_MODULE_0__.CffEncoding(enc, charset);
}

// Take in charstring code and return a Glyph object.
// The encoding is described in the Type 2 Charstring Format
// https://www.microsoft.com/typography/OTSPEC/charstr2.htm
function parseCFFCharstring(font, glyph, code) {
    let c1x;
    let c1y;
    let c2x;
    let c2y;
    const p = new _path__WEBPACK_IMPORTED_MODULE_3__.default();
    const stack = [];
    let nStems = 0;
    let haveWidth = false;
    let open = false;
    let x = 0;
    let y = 0;
    let subrs;
    let subrsBias;
    let defaultWidthX;
    let nominalWidthX;
    if (font.isCIDFont) {
        const fdIndex = font.tables.cff.topDict._fdSelect[glyph.index];
        const fdDict = font.tables.cff.topDict._fdArray[fdIndex];
        subrs = fdDict._subrs;
        subrsBias = fdDict._subrsBias;
        defaultWidthX = fdDict._defaultWidthX;
        nominalWidthX = fdDict._nominalWidthX;
    } else {
        subrs = font.tables.cff.topDict._subrs;
        subrsBias = font.tables.cff.topDict._subrsBias;
        defaultWidthX = font.tables.cff.topDict._defaultWidthX;
        nominalWidthX = font.tables.cff.topDict._nominalWidthX;
    }
    let width = defaultWidthX;

    function newContour(x, y) {
        if (open) {
            p.closePath();
        }

        p.moveTo(x, y);
        open = true;
    }

    function parseStems() {
        let hasWidthArg;

        // The number of stem operators on the stack is always even.
        // If the value is uneven, that means a width is specified.
        hasWidthArg = stack.length % 2 !== 0;
        if (hasWidthArg && !haveWidth) {
            width = stack.shift() + nominalWidthX;
        }

        nStems += stack.length >> 1;
        stack.length = 0;
        haveWidth = true;
    }

    function parse(code) {
        let b1;
        let b2;
        let b3;
        let b4;
        let codeIndex;
        let subrCode;
        let jpx;
        let jpy;
        let c3x;
        let c3y;
        let c4x;
        let c4y;

        let i = 0;
        while (i < code.length) {
            let v = code[i];
            i += 1;
            switch (v) {
                case 1: // hstem
                    parseStems();
                    break;
                case 3: // vstem
                    parseStems();
                    break;
                case 4: // vmoveto
                    if (stack.length > 1 && !haveWidth) {
                        width = stack.shift() + nominalWidthX;
                        haveWidth = true;
                    }

                    y += stack.pop();
                    newContour(x, y);
                    break;
                case 5: // rlineto
                    while (stack.length > 0) {
                        x += stack.shift();
                        y += stack.shift();
                        p.lineTo(x, y);
                    }

                    break;
                case 6: // hlineto
                    while (stack.length > 0) {
                        x += stack.shift();
                        p.lineTo(x, y);
                        if (stack.length === 0) {
                            break;
                        }

                        y += stack.shift();
                        p.lineTo(x, y);
                    }

                    break;
                case 7: // vlineto
                    while (stack.length > 0) {
                        y += stack.shift();
                        p.lineTo(x, y);
                        if (stack.length === 0) {
                            break;
                        }

                        x += stack.shift();
                        p.lineTo(x, y);
                    }

                    break;
                case 8: // rrcurveto
                    while (stack.length > 0) {
                        c1x = x + stack.shift();
                        c1y = y + stack.shift();
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x + stack.shift();
                        y = c2y + stack.shift();
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    }

                    break;
                case 10: // callsubr
                    codeIndex = stack.pop() + subrsBias;
                    subrCode = subrs[codeIndex];
                    if (subrCode) {
                        parse(subrCode);
                    }

                    break;
                case 11: // return
                    return;
                case 12: // flex operators
                    v = code[i];
                    i += 1;
                    switch (v) {
                        case 35: // flex
                            // |- dx1 dy1 dx2 dy2 dx3 dy3 dx4 dy4 dx5 dy5 dx6 dy6 fd flex (12 35) |-
                            c1x = x   + stack.shift();    // dx1
                            c1y = y   + stack.shift();    // dy1
                            c2x = c1x + stack.shift();    // dx2
                            c2y = c1y + stack.shift();    // dy2
                            jpx = c2x + stack.shift();    // dx3
                            jpy = c2y + stack.shift();    // dy3
                            c3x = jpx + stack.shift();    // dx4
                            c3y = jpy + stack.shift();    // dy4
                            c4x = c3x + stack.shift();    // dx5
                            c4y = c3y + stack.shift();    // dy5
                            x = c4x   + stack.shift();    // dx6
                            y = c4y   + stack.shift();    // dy6
                            stack.shift();                // flex depth
                            p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                            p.curveTo(c3x, c3y, c4x, c4y, x, y);
                            break;
                        case 34: // hflex
                            // |- dx1 dx2 dy2 dx3 dx4 dx5 dx6 hflex (12 34) |-
                            c1x = x   + stack.shift();    // dx1
                            c1y = y;                      // dy1
                            c2x = c1x + stack.shift();    // dx2
                            c2y = c1y + stack.shift();    // dy2
                            jpx = c2x + stack.shift();    // dx3
                            jpy = c2y;                    // dy3
                            c3x = jpx + stack.shift();    // dx4
                            c3y = c2y;                    // dy4
                            c4x = c3x + stack.shift();    // dx5
                            c4y = y;                      // dy5
                            x = c4x + stack.shift();      // dx6
                            p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                            p.curveTo(c3x, c3y, c4x, c4y, x, y);
                            break;
                        case 36: // hflex1
                            // |- dx1 dy1 dx2 dy2 dx3 dx4 dx5 dy5 dx6 hflex1 (12 36) |-
                            c1x = x   + stack.shift();    // dx1
                            c1y = y   + stack.shift();    // dy1
                            c2x = c1x + stack.shift();    // dx2
                            c2y = c1y + stack.shift();    // dy2
                            jpx = c2x + stack.shift();    // dx3
                            jpy = c2y;                    // dy3
                            c3x = jpx + stack.shift();    // dx4
                            c3y = c2y;                    // dy4
                            c4x = c3x + stack.shift();    // dx5
                            c4y = c3y + stack.shift();    // dy5
                            x = c4x + stack.shift();      // dx6
                            p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                            p.curveTo(c3x, c3y, c4x, c4y, x, y);
                            break;
                        case 37: // flex1
                            // |- dx1 dy1 dx2 dy2 dx3 dy3 dx4 dy4 dx5 dy5 d6 flex1 (12 37) |-
                            c1x = x   + stack.shift();    // dx1
                            c1y = y   + stack.shift();    // dy1
                            c2x = c1x + stack.shift();    // dx2
                            c2y = c1y + stack.shift();    // dy2
                            jpx = c2x + stack.shift();    // dx3
                            jpy = c2y + stack.shift();    // dy3
                            c3x = jpx + stack.shift();    // dx4
                            c3y = jpy + stack.shift();    // dy4
                            c4x = c3x + stack.shift();    // dx5
                            c4y = c3y + stack.shift();    // dy5
                            if (Math.abs(c4x - x) > Math.abs(c4y - y)) {
                                x = c4x + stack.shift();
                            } else {
                                y = c4y + stack.shift();
                            }

                            p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
                            p.curveTo(c3x, c3y, c4x, c4y, x, y);
                            break;
                        default:
                            console.log('Glyph ' + glyph.index + ': unknown operator ' + 1200 + v);
                            stack.length = 0;
                    }
                    break;
                case 14: // endchar
                    if (stack.length > 0 && !haveWidth) {
                        width = stack.shift() + nominalWidthX;
                        haveWidth = true;
                    }

                    if (open) {
                        p.closePath();
                        open = false;
                    }

                    break;
                case 18: // hstemhm
                    parseStems();
                    break;
                case 19: // hintmask
                case 20: // cntrmask
                    parseStems();
                    i += (nStems + 7) >> 3;
                    break;
                case 21: // rmoveto
                    if (stack.length > 2 && !haveWidth) {
                        width = stack.shift() + nominalWidthX;
                        haveWidth = true;
                    }

                    y += stack.pop();
                    x += stack.pop();
                    newContour(x, y);
                    break;
                case 22: // hmoveto
                    if (stack.length > 1 && !haveWidth) {
                        width = stack.shift() + nominalWidthX;
                        haveWidth = true;
                    }

                    x += stack.pop();
                    newContour(x, y);
                    break;
                case 23: // vstemhm
                    parseStems();
                    break;
                case 24: // rcurveline
                    while (stack.length > 2) {
                        c1x = x + stack.shift();
                        c1y = y + stack.shift();
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x + stack.shift();
                        y = c2y + stack.shift();
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    }

                    x += stack.shift();
                    y += stack.shift();
                    p.lineTo(x, y);
                    break;
                case 25: // rlinecurve
                    while (stack.length > 6) {
                        x += stack.shift();
                        y += stack.shift();
                        p.lineTo(x, y);
                    }

                    c1x = x + stack.shift();
                    c1y = y + stack.shift();
                    c2x = c1x + stack.shift();
                    c2y = c1y + stack.shift();
                    x = c2x + stack.shift();
                    y = c2y + stack.shift();
                    p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    break;
                case 26: // vvcurveto
                    if (stack.length % 2) {
                        x += stack.shift();
                    }

                    while (stack.length > 0) {
                        c1x = x;
                        c1y = y + stack.shift();
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x;
                        y = c2y + stack.shift();
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    }

                    break;
                case 27: // hhcurveto
                    if (stack.length % 2) {
                        y += stack.shift();
                    }

                    while (stack.length > 0) {
                        c1x = x + stack.shift();
                        c1y = y;
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x + stack.shift();
                        y = c2y;
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    }

                    break;
                case 28: // shortint
                    b1 = code[i];
                    b2 = code[i + 1];
                    stack.push(((b1 << 24) | (b2 << 16)) >> 16);
                    i += 2;
                    break;
                case 29: // callgsubr
                    codeIndex = stack.pop() + font.gsubrsBias;
                    subrCode = font.gsubrs[codeIndex];
                    if (subrCode) {
                        parse(subrCode);
                    }

                    break;
                case 30: // vhcurveto
                    while (stack.length > 0) {
                        c1x = x;
                        c1y = y + stack.shift();
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x + stack.shift();
                        y = c2y + (stack.length === 1 ? stack.shift() : 0);
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                        if (stack.length === 0) {
                            break;
                        }

                        c1x = x + stack.shift();
                        c1y = y;
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        y = c2y + stack.shift();
                        x = c2x + (stack.length === 1 ? stack.shift() : 0);
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    }

                    break;
                case 31: // hvcurveto
                    while (stack.length > 0) {
                        c1x = x + stack.shift();
                        c1y = y;
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        y = c2y + stack.shift();
                        x = c2x + (stack.length === 1 ? stack.shift() : 0);
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                        if (stack.length === 0) {
                            break;
                        }

                        c1x = x;
                        c1y = y + stack.shift();
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x + stack.shift();
                        y = c2y + (stack.length === 1 ? stack.shift() : 0);
                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
                    }

                    break;
                default:
                    if (v < 32) {
                        console.log('Glyph ' + glyph.index + ': unknown operator ' + v);
                    } else if (v < 247) {
                        stack.push(v - 139);
                    } else if (v < 251) {
                        b1 = code[i];
                        i += 1;
                        stack.push((v - 247) * 256 + b1 + 108);
                    } else if (v < 255) {
                        b1 = code[i];
                        i += 1;
                        stack.push(-(v - 251) * 256 - b1 - 108);
                    } else {
                        b1 = code[i];
                        b2 = code[i + 1];
                        b3 = code[i + 2];
                        b4 = code[i + 3];
                        i += 4;
                        stack.push(((b1 << 24) | (b2 << 16) | (b3 << 8) | b4) / 65536);
                    }
            }
        }
    }

    parse(code);

    glyph.advanceWidth = width;
    return p;
}

function parseCFFFDSelect(data, start, nGlyphs, fdArrayCount) {
    const fdSelect = [];
    let fdIndex;
    const parser = new _parse__WEBPACK_IMPORTED_MODULE_2__.default.Parser(data, start);
    const format = parser.parseCard8();
    if (format === 0) {
        // Simple list of nGlyphs elements
        for (let iGid = 0; iGid < nGlyphs; iGid++) {
            fdIndex = parser.parseCard8();
            if (fdIndex >= fdArrayCount) {
                throw new Error('CFF table CID Font FDSelect has bad FD index value ' + fdIndex + ' (FD count ' + fdArrayCount + ')');
            }
            fdSelect.push(fdIndex);
        }
    } else if (format === 3) {
        // Ranges
        const nRanges = parser.parseCard16();
        let first = parser.parseCard16();
        if (first !== 0) {
            throw new Error('CFF Table CID Font FDSelect format 3 range has bad initial GID ' + first);
        }
        let next;
        for (let iRange = 0; iRange < nRanges; iRange++) {
            fdIndex = parser.parseCard8();
            next = parser.parseCard16();
            if (fdIndex >= fdArrayCount) {
                throw new Error('CFF table CID Font FDSelect has bad FD index value ' + fdIndex + ' (FD count ' + fdArrayCount + ')');
            }
            if (next > nGlyphs) {
                throw new Error('CFF Table CID Font FDSelect format 3 range has bad GID ' + next);
            }
            for (; first < next; first++) {
                fdSelect.push(fdIndex);
            }
            first = next;
        }
        if (next !== nGlyphs) {
            throw new Error('CFF Table CID Font FDSelect format 3 range has bad final GID ' + next);
        }
    } else {
        throw new Error('CFF Table CID Font FDSelect table has unsupported format ' + format);
    }
    return fdSelect;
}

// Parse the `CFF` table, which contains the glyph outlines in PostScript format.
function parseCFFTable(data, start, font) {
    font.tables.cff = {};
    const header = parseCFFHeader(data, start);
    const nameIndex = parseCFFIndex(data, header.endOffset, _parse__WEBPACK_IMPORTED_MODULE_2__.default.bytesToString);
    const topDictIndex = parseCFFIndex(data, nameIndex.endOffset);
    const stringIndex = parseCFFIndex(data, topDictIndex.endOffset, _parse__WEBPACK_IMPORTED_MODULE_2__.default.bytesToString);
    const globalSubrIndex = parseCFFIndex(data, stringIndex.endOffset);
    font.gsubrs = globalSubrIndex.objects;
    font.gsubrsBias = calcCFFSubroutineBias(font.gsubrs);

    const topDictArray = gatherCFFTopDicts(data, start, topDictIndex.objects, stringIndex.objects);
    if (topDictArray.length !== 1) {
        throw new Error('CFF table has too many fonts in \'FontSet\' - count of fonts NameIndex.length = ' + topDictArray.length);
    }

    const topDict = topDictArray[0];
    font.tables.cff.topDict = topDict;

    if (topDict._privateDict) {
        font.defaultWidthX = topDict._privateDict.defaultWidthX;
        font.nominalWidthX = topDict._privateDict.nominalWidthX;
    }

    if (topDict.ros[0] !== undefined && topDict.ros[1] !== undefined) {
        font.isCIDFont = true;
    }

    if (font.isCIDFont) {
        let fdArrayOffset = topDict.fdArray;
        let fdSelectOffset = topDict.fdSelect;
        if (fdArrayOffset === 0 || fdSelectOffset === 0) {
            throw new Error('Font is marked as a CID font, but FDArray and/or FDSelect information is missing');
        }
        fdArrayOffset += start;
        const fdArrayIndex = parseCFFIndex(data, fdArrayOffset);
        const fdArray = gatherCFFTopDicts(data, start, fdArrayIndex.objects, stringIndex.objects);
        topDict._fdArray = fdArray;
        fdSelectOffset += start;
        topDict._fdSelect = parseCFFFDSelect(data, fdSelectOffset, font.numGlyphs, fdArray.length);
    }

    const privateDictOffset = start + topDict.private[1];
    const privateDict = parseCFFPrivateDict(data, privateDictOffset, topDict.private[0], stringIndex.objects);
    font.defaultWidthX = privateDict.defaultWidthX;
    font.nominalWidthX = privateDict.nominalWidthX;

    if (privateDict.subrs !== 0) {
        const subrOffset = privateDictOffset + privateDict.subrs;
        const subrIndex = parseCFFIndex(data, subrOffset);
        font.subrs = subrIndex.objects;
        font.subrsBias = calcCFFSubroutineBias(font.subrs);
    } else {
        font.subrs = [];
        font.subrsBias = 0;
    }

    // Offsets in the top dict are relative to the beginning of the CFF data, so add the CFF start offset.
    const charStringsIndex = parseCFFIndex(data, start + topDict.charStrings);
    font.nGlyphs = charStringsIndex.objects.length;

    const charset = parseCFFCharset(data, start + topDict.charset, font.nGlyphs, stringIndex.objects);
    if (topDict.encoding === 0) {
        // Standard encoding
        font.cffEncoding = new _encoding__WEBPACK_IMPORTED_MODULE_0__.CffEncoding(_encoding__WEBPACK_IMPORTED_MODULE_0__.cffStandardEncoding, charset);
    } else if (topDict.encoding === 1) {
        // Expert encoding
        font.cffEncoding = new _encoding__WEBPACK_IMPORTED_MODULE_0__.CffEncoding(_encoding__WEBPACK_IMPORTED_MODULE_0__.cffExpertEncoding, charset);
    } else {
        font.cffEncoding = parseCFFEncoding(data, start + topDict.encoding, charset);
    }

    // Prefer the CMAP encoding to the CFF encoding.
    font.encoding = font.encoding || font.cffEncoding;

    font.glyphs = new _glyphset__WEBPACK_IMPORTED_MODULE_1__.default.GlyphSet(font);
    for (let i = 0; i < font.nGlyphs; i += 1) {
        const charString = charStringsIndex.objects[i];
        font.glyphs.push(i, _glyphset__WEBPACK_IMPORTED_MODULE_1__.default.cffGlyphLoader(font, i, parseCFFCharstring, charString));
    }
}

// Convert a string to a String ID (SID).
// The list of strings is modified in place.
function encodeString(s, strings) {
    let sid;

    // Is the string in the CFF standard strings?
    let i = _encoding__WEBPACK_IMPORTED_MODULE_0__.cffStandardStrings.indexOf(s);
    if (i >= 0) {
        sid = i;
    }

    // Is the string already in the string index?
    i = strings.indexOf(s);
    if (i >= 0) {
        sid = i + _encoding__WEBPACK_IMPORTED_MODULE_0__.cffStandardStrings.length;
    } else {
        sid = _encoding__WEBPACK_IMPORTED_MODULE_0__.cffStandardStrings.length + strings.length;
        strings.push(s);
    }

    return sid;
}

function makeHeader() {
    return new _table__WEBPACK_IMPORTED_MODULE_4__.default.Record('Header', [
        {name: 'major', type: 'Card8', value: 1},
        {name: 'minor', type: 'Card8', value: 0},
        {name: 'hdrSize', type: 'Card8', value: 4},
        {name: 'major', type: 'Card8', value: 1}
    ]);
}

function makeNameIndex(fontNames) {
    const t = new _table__WEBPACK_IMPORTED_MODULE_4__.default.Record('Name INDEX', [
        {name: 'names', type: 'INDEX', value: []}
    ]);
    t.names = [];
    for (let i = 0; i < fontNames.length; i += 1) {
        t.names.push({name: 'name_' + i, type: 'NAME', value: fontNames[i]});
    }

    return t;
}

// Given a dictionary's metadata, create a DICT structure.
function makeDict(meta, attrs, strings) {
    const m = {};
    for (let i = 0; i < meta.length; i += 1) {
        const entry = meta[i];
        let value = attrs[entry.name];
        if (value !== undefined && !equals(value, entry.value)) {
            if (entry.type === 'SID') {
                value = encodeString(value, strings);
            }

            m[entry.op] = {name: entry.name, type: entry.type, value: value};
        }
    }

    return m;
}

// The Top DICT houses the global font attributes.
function makeTopDict(attrs, strings) {
    const t = new _table__WEBPACK_IMPORTED_MODULE_4__.default.Record('Top DICT', [
        {name: 'dict', type: 'DICT', value: {}}
    ]);
    t.dict = makeDict(TOP_DICT_META, attrs, strings);
    return t;
}

function makeTopDictIndex(topDict) {
    const t = new _table__WEBPACK_IMPORTED_MODULE_4__.default.Record('Top DICT INDEX', [
        {name: 'topDicts', type: 'INDEX', value: []}
    ]);
    t.topDicts = [{name: 'topDict_0', type: 'TABLE', value: topDict}];
    return t;
}

function makeStringIndex(strings) {
    const t = new _table__WEBPACK_IMPORTED_MODULE_4__.default.Record('String INDEX', [
        {name: 'strings', type: 'INDEX', value: []}
    ]);
    t.strings = [];
    for (let i = 0; i < strings.length; i += 1) {
        t.strings.push({name: 'string_' + i, type: 'STRING', value: strings[i]});
    }

    return t;
}

function makeGlobalSubrIndex() {
    // Currently we don't use subroutines.
    return new _table__WEBPACK_IMPORTED_MODULE_4__.default.Record('Global Subr INDEX', [
        {name: 'subrs', type: 'INDEX', value: []}
    ]);
}

function makeCharsets(glyphNames, strings) {
    const t = new _table__WEBPACK_IMPORTED_MODULE_4__.default.Record('Charsets', [
        {name: 'format', type: 'Card8', value: 0}
    ]);
    for (let i = 0; i < glyphNames.length; i += 1) {
        const glyphName = glyphNames[i];
        const glyphSID = encodeString(glyphName, strings);
        t.fields.push({name: 'glyph_' + i, type: 'SID', value: glyphSID});
    }

    return t;
}

function glyphToOps(glyph) {
    const ops = [];
    const path = glyph.path;
    ops.push({name: 'width', type: 'NUMBER', value: glyph.advanceWidth});
    let x = 0;
    let y = 0;
    for (let i = 0; i < path.commands.length; i += 1) {
        let dx;
        let dy;
        let cmd = path.commands[i];
        if (cmd.type === 'Q') {
            // CFF only supports bézier curves, so convert the quad to a bézier.
            const _13 = 1 / 3;
            const _23 = 2 / 3;

            // We're going to create a new command so we don't change the original path.
            cmd = {
                type: 'C',
                x: cmd.x,
                y: cmd.y,
                x1: _13 * x + _23 * cmd.x1,
                y1: _13 * y + _23 * cmd.y1,
                x2: _13 * cmd.x + _23 * cmd.x1,
                y2: _13 * cmd.y + _23 * cmd.y1
            };
        }

        if (cmd.type === 'M') {
            dx = Math.round(cmd.x - x);
            dy = Math.round(cmd.y - y);
            ops.push({name: 'dx', type: 'NUMBER', value: dx});
            ops.push({name: 'dy', type: 'NUMBER', value: dy});
            ops.push({name: 'rmoveto', type: 'OP', value: 21});
            x = Math.round(cmd.x);
            y = Math.round(cmd.y);
        } else if (cmd.type === 'L') {
            dx = Math.round(cmd.x - x);
            dy = Math.round(cmd.y - y);
            ops.push({name: 'dx', type: 'NUMBER', value: dx});
            ops.push({name: 'dy', type: 'NUMBER', value: dy});
            ops.push({name: 'rlineto', type: 'OP', value: 5});
            x = Math.round(cmd.x);
            y = Math.round(cmd.y);
        } else if (cmd.type === 'C') {
            const dx1 = Math.round(cmd.x1 - x);
            const dy1 = Math.round(cmd.y1 - y);
            const dx2 = Math.round(cmd.x2 - cmd.x1);
            const dy2 = Math.round(cmd.y2 - cmd.y1);
            dx = Math.round(cmd.x - cmd.x2);
            dy = Math.round(cmd.y - cmd.y2);
            ops.push({name: 'dx1', type: 'NUMBER', value: dx1});
            ops.push({name: 'dy1', type: 'NUMBER', value: dy1});
            ops.push({name: 'dx2', type: 'NUMBER', value: dx2});
            ops.push({name: 'dy2', type: 'NUMBER', value: dy2});
            ops.push({name: 'dx', type: 'NUMBER', value: dx});
            ops.push({name: 'dy', type: 'NUMBER', value: dy});
            ops.push({name: 'rrcurveto', type: 'OP', value: 8});
            x = Math.round(cmd.x);
            y = Math.round(cmd.y);
        }

        // Contours are closed automatically.
    }

    ops.push({name: 'endchar', type: 'OP', value: 14});
    return ops;
}

function makeCharStringsIndex(glyphs) {
    const t = new _table__WEBPACK_IMPORTED_MODULE_4__.default.Record('CharStrings INDEX', [
        {name: 'charStrings', type: 'INDEX', value: []}
    ]);

    for (let i = 0; i < glyphs.length; i += 1) {
        const glyph = glyphs.get(i);
        const ops = glyphToOps(glyph);
        t.charStrings.push({name: glyph.name, type: 'CHARSTRING', value: ops});
    }

    return t;
}

function makePrivateDict(attrs, strings) {
    const t = new _table__WEBPACK_IMPORTED_MODULE_4__.default.Record('Private DICT', [
        {name: 'dict', type: 'DICT', value: {}}
    ]);
    t.dict = makeDict(PRIVATE_DICT_META, attrs, strings);
    return t;
}

function makeCFFTable(glyphs, options) {
    const t = new _table__WEBPACK_IMPORTED_MODULE_4__.default.Table('CFF ', [
        {name: 'header', type: 'RECORD'},
        {name: 'nameIndex', type: 'RECORD'},
        {name: 'topDictIndex', type: 'RECORD'},
        {name: 'stringIndex', type: 'RECORD'},
        {name: 'globalSubrIndex', type: 'RECORD'},
        {name: 'charsets', type: 'RECORD'},
        {name: 'charStringsIndex', type: 'RECORD'},
        {name: 'privateDict', type: 'RECORD'}
    ]);

    const fontScale = 1 / options.unitsPerEm;
    // We use non-zero values for the offsets so that the DICT encodes them.
    // This is important because the size of the Top DICT plays a role in offset calculation,
    // and the size shouldn't change after we've written correct offsets.
    const attrs = {
        version: options.version,
        fullName: options.fullName,
        familyName: options.familyName,
        weight: options.weightName,
        fontBBox: options.fontBBox || [0, 0, 0, 0],
        fontMatrix: [fontScale, 0, 0, fontScale, 0, 0],
        charset: 999,
        encoding: 0,
        charStrings: 999,
        private: [0, 999]
    };

    const privateAttrs = {};

    const glyphNames = [];
    let glyph;

    // Skip first glyph (.notdef)
    for (let i = 1; i < glyphs.length; i += 1) {
        glyph = glyphs.get(i);
        glyphNames.push(glyph.name);
    }

    const strings = [];

    t.header = makeHeader();
    t.nameIndex = makeNameIndex([options.postScriptName]);
    let topDict = makeTopDict(attrs, strings);
    t.topDictIndex = makeTopDictIndex(topDict);
    t.globalSubrIndex = makeGlobalSubrIndex();
    t.charsets = makeCharsets(glyphNames, strings);
    t.charStringsIndex = makeCharStringsIndex(glyphs);
    t.privateDict = makePrivateDict(privateAttrs, strings);

    // Needs to come at the end, to encode all custom strings used in the font.
    t.stringIndex = makeStringIndex(strings);

    const startOffset = t.header.sizeOf() +
        t.nameIndex.sizeOf() +
        t.topDictIndex.sizeOf() +
        t.stringIndex.sizeOf() +
        t.globalSubrIndex.sizeOf();
    attrs.charset = startOffset;

    // We use the CFF standard encoding; proper encoding will be handled in cmap.
    attrs.encoding = 0;
    attrs.charStrings = attrs.charset + t.charsets.sizeOf();
    attrs.private[1] = attrs.charStrings + t.charStringsIndex.sizeOf();

    // Recreate the Top DICT INDEX with the correct offsets.
    topDict = makeTopDict(attrs, strings);
    t.topDictIndex = makeTopDictIndex(topDict);

    return t;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ parse: parseCFFTable, make: makeCFFTable });


/***/ }),

/***/ "./node_modules/opentype.js/src/tables/cmap.js":
/*!*****************************************************!*\
  !*** ./node_modules/opentype.js/src/tables/cmap.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../check */ "./node_modules/opentype.js/src/check.js");
/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../parse */ "./node_modules/opentype.js/src/parse.js");
/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../table */ "./node_modules/opentype.js/src/table.js");
// The `cmap` table stores the mappings from characters to glyphs.
// https://www.microsoft.com/typography/OTSPEC/cmap.htm





function parseCmapTableFormat12(cmap, p) {
    //Skip reserved.
    p.parseUShort();

    // Length in bytes of the sub-tables.
    cmap.length = p.parseULong();
    cmap.language = p.parseULong();

    let groupCount;
    cmap.groupCount = groupCount = p.parseULong();
    cmap.glyphIndexMap = {};

    for (let i = 0; i < groupCount; i += 1) {
        const startCharCode = p.parseULong();
        const endCharCode = p.parseULong();
        let startGlyphId = p.parseULong();

        for (let c = startCharCode; c <= endCharCode; c += 1) {
            cmap.glyphIndexMap[c] = startGlyphId;
            startGlyphId++;
        }
    }
}

function parseCmapTableFormat4(cmap, p, data, start, offset) {
    // Length in bytes of the sub-tables.
    cmap.length = p.parseUShort();
    cmap.language = p.parseUShort();

    // segCount is stored x 2.
    let segCount;
    cmap.segCount = segCount = p.parseUShort() >> 1;

    // Skip searchRange, entrySelector, rangeShift.
    p.skip('uShort', 3);

    // The "unrolled" mapping from character codes to glyph indices.
    cmap.glyphIndexMap = {};
    const endCountParser = new _parse__WEBPACK_IMPORTED_MODULE_1__.default.Parser(data, start + offset + 14);
    const startCountParser = new _parse__WEBPACK_IMPORTED_MODULE_1__.default.Parser(data, start + offset + 16 + segCount * 2);
    const idDeltaParser = new _parse__WEBPACK_IMPORTED_MODULE_1__.default.Parser(data, start + offset + 16 + segCount * 4);
    const idRangeOffsetParser = new _parse__WEBPACK_IMPORTED_MODULE_1__.default.Parser(data, start + offset + 16 + segCount * 6);
    let glyphIndexOffset = start + offset + 16 + segCount * 8;
    for (let i = 0; i < segCount - 1; i += 1) {
        let glyphIndex;
        const endCount = endCountParser.parseUShort();
        const startCount = startCountParser.parseUShort();
        const idDelta = idDeltaParser.parseShort();
        const idRangeOffset = idRangeOffsetParser.parseUShort();
        for (let c = startCount; c <= endCount; c += 1) {
            if (idRangeOffset !== 0) {
                // The idRangeOffset is relative to the current position in the idRangeOffset array.
                // Take the current offset in the idRangeOffset array.
                glyphIndexOffset = (idRangeOffsetParser.offset + idRangeOffsetParser.relativeOffset - 2);

                // Add the value of the idRangeOffset, which will move us into the glyphIndex array.
                glyphIndexOffset += idRangeOffset;

                // Then add the character index of the current segment, multiplied by 2 for USHORTs.
                glyphIndexOffset += (c - startCount) * 2;
                glyphIndex = _parse__WEBPACK_IMPORTED_MODULE_1__.default.getUShort(data, glyphIndexOffset);
                if (glyphIndex !== 0) {
                    glyphIndex = (glyphIndex + idDelta) & 0xFFFF;
                }
            } else {
                glyphIndex = (c + idDelta) & 0xFFFF;
            }

            cmap.glyphIndexMap[c] = glyphIndex;
        }
    }
}

// Parse the `cmap` table. This table stores the mappings from characters to glyphs.
// There are many available formats, but we only support the Windows format 4 and 12.
// This function returns a `CmapEncoding` object or null if no supported format could be found.
function parseCmapTable(data, start) {
    const cmap = {};
    cmap.version = _parse__WEBPACK_IMPORTED_MODULE_1__.default.getUShort(data, start);
    _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(cmap.version === 0, 'cmap table version should be 0.');

    // The cmap table can contain many sub-tables, each with their own format.
    // We're only interested in a "platform 3" table. This is a Windows format.
    cmap.numTables = _parse__WEBPACK_IMPORTED_MODULE_1__.default.getUShort(data, start + 2);
    let offset = -1;
    for (let i = cmap.numTables - 1; i >= 0; i -= 1) {
        const platformId = _parse__WEBPACK_IMPORTED_MODULE_1__.default.getUShort(data, start + 4 + (i * 8));
        const encodingId = _parse__WEBPACK_IMPORTED_MODULE_1__.default.getUShort(data, start + 4 + (i * 8) + 2);
        if (platformId === 3 && (encodingId === 0 || encodingId === 1 || encodingId === 10)) {
            offset = _parse__WEBPACK_IMPORTED_MODULE_1__.default.getULong(data, start + 4 + (i * 8) + 4);
            break;
        }
    }

    if (offset === -1) {
        // There is no cmap table in the font that we support.
        throw new Error('No valid cmap sub-tables found.');
    }

    const p = new _parse__WEBPACK_IMPORTED_MODULE_1__.default.Parser(data, start + offset);
    cmap.format = p.parseUShort();

    if (cmap.format === 12) {
        parseCmapTableFormat12(cmap, p);
    } else if (cmap.format === 4) {
        parseCmapTableFormat4(cmap, p, data, start, offset);
    } else {
        throw new Error('Only format 4 and 12 cmap tables are supported (found format ' + cmap.format + ').');
    }

    return cmap;
}

function addSegment(t, code, glyphIndex) {
    t.segments.push({
        end: code,
        start: code,
        delta: -(code - glyphIndex),
        offset: 0,
        glyphIndex: glyphIndex
    });
}

function addTerminatorSegment(t) {
    t.segments.push({
        end: 0xFFFF,
        start: 0xFFFF,
        delta: 1,
        offset: 0
    });
}

// Make cmap table, format 4 by default, 12 if needed only
function makeCmapTable(glyphs) {
    // Plan 0 is the base Unicode Plan but emojis, for example are on another plan, and needs cmap 12 format (with 32bit)
    let isPlan0Only = true;
    let i;

    // Check if we need to add cmap format 12 or if format 4 only is fine
    for (i = glyphs.length - 1; i > 0; i -= 1) {
        const g = glyphs.get(i);
        if (g.unicode > 65535) {
            console.log('Adding CMAP format 12 (needed!)');
            isPlan0Only = false;
            break;
        }
    }

    let cmapTable = [
        {name: 'version', type: 'USHORT', value: 0},
        {name: 'numTables', type: 'USHORT', value: isPlan0Only ? 1 : 2},

        // CMAP 4 header
        {name: 'platformID', type: 'USHORT', value: 3},
        {name: 'encodingID', type: 'USHORT', value: 1},
        {name: 'offset', type: 'ULONG', value: isPlan0Only ? 12 : (12 + 8)}
    ];

    if (!isPlan0Only)
        cmapTable = cmapTable.concat([
            // CMAP 12 header
            {name: 'cmap12PlatformID', type: 'USHORT', value: 3}, // We encode only for PlatformID = 3 (Windows) because it is supported everywhere
            {name: 'cmap12EncodingID', type: 'USHORT', value: 10},
            {name: 'cmap12Offset', type: 'ULONG', value: 0}
        ]);

    cmapTable = cmapTable.concat([
        // CMAP 4 Subtable
        {name: 'format', type: 'USHORT', value: 4},
        {name: 'cmap4Length', type: 'USHORT', value: 0},
        {name: 'language', type: 'USHORT', value: 0},
        {name: 'segCountX2', type: 'USHORT', value: 0},
        {name: 'searchRange', type: 'USHORT', value: 0},
        {name: 'entrySelector', type: 'USHORT', value: 0},
        {name: 'rangeShift', type: 'USHORT', value: 0}
    ]);

    const t = new _table__WEBPACK_IMPORTED_MODULE_2__.default.Table('cmap', cmapTable);

    t.segments = [];
    for (i = 0; i < glyphs.length; i += 1) {
        const glyph = glyphs.get(i);
        for (let j = 0; j < glyph.unicodes.length; j += 1) {
            addSegment(t, glyph.unicodes[j], i);
        }

        t.segments = t.segments.sort(function (a, b) {
            return a.start - b.start;
        });
    }

    addTerminatorSegment(t);

    const segCount = t.segments.length;
    let segCountToRemove = 0;

    // CMAP 4
    // Set up parallel segment arrays.
    let endCounts = [];
    let startCounts = [];
    let idDeltas = [];
    let idRangeOffsets = [];
    let glyphIds = [];

    // CMAP 12
    let cmap12Groups = [];

    // Reminder this loop is not following the specification at 100%
    // The specification -> find suites of characters and make a group
    // Here we're doing one group for each letter
    // Doing as the spec can save 8 times (or more) space
    for (i = 0; i < segCount; i += 1) {
        const segment = t.segments[i];

        // CMAP 4
        if (segment.end <= 65535 && segment.start <= 65535) {
            endCounts = endCounts.concat({name: 'end_' + i, type: 'USHORT', value: segment.end});
            startCounts = startCounts.concat({name: 'start_' + i, type: 'USHORT', value: segment.start});
            idDeltas = idDeltas.concat({name: 'idDelta_' + i, type: 'SHORT', value: segment.delta});
            idRangeOffsets = idRangeOffsets.concat({name: 'idRangeOffset_' + i, type: 'USHORT', value: segment.offset});
            if (segment.glyphId !== undefined) {
                glyphIds = glyphIds.concat({name: 'glyph_' + i, type: 'USHORT', value: segment.glyphId});
            }
        } else {
            // Skip Unicode > 65535 (16bit unsigned max) for CMAP 4, will be added in CMAP 12
            segCountToRemove += 1;
        }

        // CMAP 12
        // Skip Terminator Segment
        if (!isPlan0Only && segment.glyphIndex !== undefined) {
            cmap12Groups = cmap12Groups.concat({name: 'cmap12Start_' + i, type: 'ULONG', value: segment.start});
            cmap12Groups = cmap12Groups.concat({name: 'cmap12End_' + i, type: 'ULONG', value: segment.end});
            cmap12Groups = cmap12Groups.concat({name: 'cmap12Glyph_' + i, type: 'ULONG', value: segment.glyphIndex});
        }
    }

    // CMAP 4 Subtable
    t.segCountX2 = (segCount - segCountToRemove) * 2;
    t.searchRange = Math.pow(2, Math.floor(Math.log((segCount - segCountToRemove)) / Math.log(2))) * 2;
    t.entrySelector = Math.log(t.searchRange / 2) / Math.log(2);
    t.rangeShift = t.segCountX2 - t.searchRange;

    t.fields = t.fields.concat(endCounts);
    t.fields.push({name: 'reservedPad', type: 'USHORT', value: 0});
    t.fields = t.fields.concat(startCounts);
    t.fields = t.fields.concat(idDeltas);
    t.fields = t.fields.concat(idRangeOffsets);
    t.fields = t.fields.concat(glyphIds);

    t.cmap4Length = 14 + // Subtable header
        endCounts.length * 2 +
        2 + // reservedPad
        startCounts.length * 2 +
        idDeltas.length * 2 +
        idRangeOffsets.length * 2 +
        glyphIds.length * 2;

    if (!isPlan0Only) {
        // CMAP 12 Subtable
        const cmap12Length = 16 + // Subtable header
            cmap12Groups.length * 4;

        t.cmap12Offset = 12 + (2 * 2) + 4 + t.cmap4Length;
        t.fields = t.fields.concat([
            {name: 'cmap12Format', type: 'USHORT', value: 12},
            {name: 'cmap12Reserved', type: 'USHORT', value: 0},
            {name: 'cmap12Length', type: 'ULONG', value: cmap12Length},
            {name: 'cmap12Language', type: 'ULONG', value: 0},
            {name: 'cmap12nGroups', type: 'ULONG', value: cmap12Groups.length / 3}
        ]);

        t.fields = t.fields.concat(cmap12Groups);
    }

    return t;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ parse: parseCmapTable, make: makeCmapTable });


/***/ }),

/***/ "./node_modules/opentype.js/src/tables/fvar.js":
/*!*****************************************************!*\
  !*** ./node_modules/opentype.js/src/tables/fvar.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../check */ "./node_modules/opentype.js/src/check.js");
/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../parse */ "./node_modules/opentype.js/src/parse.js");
/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../table */ "./node_modules/opentype.js/src/table.js");
// The `fvar` table stores font variation axes and instances.
// https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6fvar.html





function addName(name, names) {
    const nameString = JSON.stringify(name);
    let nameID = 256;
    for (let nameKey in names) {
        let n = parseInt(nameKey);
        if (!n || n < 256) {
            continue;
        }

        if (JSON.stringify(names[nameKey]) === nameString) {
            return n;
        }

        if (nameID <= n) {
            nameID = n + 1;
        }
    }

    names[nameID] = name;
    return nameID;
}

function makeFvarAxis(n, axis, names) {
    const nameID = addName(axis.name, names);
    return [
        {name: 'tag_' + n, type: 'TAG', value: axis.tag},
        {name: 'minValue_' + n, type: 'FIXED', value: axis.minValue << 16},
        {name: 'defaultValue_' + n, type: 'FIXED', value: axis.defaultValue << 16},
        {name: 'maxValue_' + n, type: 'FIXED', value: axis.maxValue << 16},
        {name: 'flags_' + n, type: 'USHORT', value: 0},
        {name: 'nameID_' + n, type: 'USHORT', value: nameID}
    ];
}

function parseFvarAxis(data, start, names) {
    const axis = {};
    const p = new _parse__WEBPACK_IMPORTED_MODULE_1__.default.Parser(data, start);
    axis.tag = p.parseTag();
    axis.minValue = p.parseFixed();
    axis.defaultValue = p.parseFixed();
    axis.maxValue = p.parseFixed();
    p.skip('uShort', 1);  // reserved for flags; no values defined
    axis.name = names[p.parseUShort()] || {};
    return axis;
}

function makeFvarInstance(n, inst, axes, names) {
    const nameID = addName(inst.name, names);
    const fields = [
        {name: 'nameID_' + n, type: 'USHORT', value: nameID},
        {name: 'flags_' + n, type: 'USHORT', value: 0}
    ];

    for (let i = 0; i < axes.length; ++i) {
        const axisTag = axes[i].tag;
        fields.push({
            name: 'axis_' + n + ' ' + axisTag,
            type: 'FIXED',
            value: inst.coordinates[axisTag] << 16
        });
    }

    return fields;
}

function parseFvarInstance(data, start, axes, names) {
    const inst = {};
    const p = new _parse__WEBPACK_IMPORTED_MODULE_1__.default.Parser(data, start);
    inst.name = names[p.parseUShort()] || {};
    p.skip('uShort', 1);  // reserved for flags; no values defined

    inst.coordinates = {};
    for (let i = 0; i < axes.length; ++i) {
        inst.coordinates[axes[i].tag] = p.parseFixed();
    }

    return inst;
}

function makeFvarTable(fvar, names) {
    const result = new _table__WEBPACK_IMPORTED_MODULE_2__.default.Table('fvar', [
        {name: 'version', type: 'ULONG', value: 0x10000},
        {name: 'offsetToData', type: 'USHORT', value: 0},
        {name: 'countSizePairs', type: 'USHORT', value: 2},
        {name: 'axisCount', type: 'USHORT', value: fvar.axes.length},
        {name: 'axisSize', type: 'USHORT', value: 20},
        {name: 'instanceCount', type: 'USHORT', value: fvar.instances.length},
        {name: 'instanceSize', type: 'USHORT', value: 4 + fvar.axes.length * 4}
    ]);
    result.offsetToData = result.sizeOf();

    for (let i = 0; i < fvar.axes.length; i++) {
        result.fields = result.fields.concat(makeFvarAxis(i, fvar.axes[i], names));
    }

    for (let j = 0; j < fvar.instances.length; j++) {
        result.fields = result.fields.concat(makeFvarInstance(j, fvar.instances[j], fvar.axes, names));
    }

    return result;
}

function parseFvarTable(data, start, names) {
    const p = new _parse__WEBPACK_IMPORTED_MODULE_1__.default.Parser(data, start);
    const tableVersion = p.parseULong();
    _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(tableVersion === 0x00010000, 'Unsupported fvar table version.');
    const offsetToData = p.parseOffset16();
    // Skip countSizePairs.
    p.skip('uShort', 1);
    const axisCount = p.parseUShort();
    const axisSize = p.parseUShort();
    const instanceCount = p.parseUShort();
    const instanceSize = p.parseUShort();

    const axes = [];
    for (let i = 0; i < axisCount; i++) {
        axes.push(parseFvarAxis(data, start + offsetToData + i * axisSize, names));
    }

    const instances = [];
    const instanceStart = start + offsetToData + axisCount * axisSize;
    for (let j = 0; j < instanceCount; j++) {
        instances.push(parseFvarInstance(data, instanceStart + j * instanceSize, axes, names));
    }

    return {axes: axes, instances: instances};
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ make: makeFvarTable, parse: parseFvarTable });


/***/ }),

/***/ "./node_modules/opentype.js/src/tables/glyf.js":
/*!*****************************************************!*\
  !*** ./node_modules/opentype.js/src/tables/glyf.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../check */ "./node_modules/opentype.js/src/check.js");
/* harmony import */ var _glyphset__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../glyphset */ "./node_modules/opentype.js/src/glyphset.js");
/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../parse */ "./node_modules/opentype.js/src/parse.js");
/* harmony import */ var _path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../path */ "./node_modules/opentype.js/src/path.js");
// The `glyf` table describes the glyphs in TrueType outline format.
// http://www.microsoft.com/typography/otspec/glyf.htm






// Parse the coordinate data for a glyph.
function parseGlyphCoordinate(p, flag, previousValue, shortVectorBitMask, sameBitMask) {
    let v;
    if ((flag & shortVectorBitMask) > 0) {
        // The coordinate is 1 byte long.
        v = p.parseByte();
        // The `same` bit is re-used for short values to signify the sign of the value.
        if ((flag & sameBitMask) === 0) {
            v = -v;
        }

        v = previousValue + v;
    } else {
        //  The coordinate is 2 bytes long.
        // If the `same` bit is set, the coordinate is the same as the previous coordinate.
        if ((flag & sameBitMask) > 0) {
            v = previousValue;
        } else {
            // Parse the coordinate as a signed 16-bit delta value.
            v = previousValue + p.parseShort();
        }
    }

    return v;
}

// Parse a TrueType glyph.
function parseGlyph(glyph, data, start) {
    const p = new _parse__WEBPACK_IMPORTED_MODULE_2__.default.Parser(data, start);
    glyph.numberOfContours = p.parseShort();
    glyph._xMin = p.parseShort();
    glyph._yMin = p.parseShort();
    glyph._xMax = p.parseShort();
    glyph._yMax = p.parseShort();
    let flags;
    let flag;

    if (glyph.numberOfContours > 0) {
        // This glyph is not a composite.
        const endPointIndices = glyph.endPointIndices = [];
        for (let i = 0; i < glyph.numberOfContours; i += 1) {
            endPointIndices.push(p.parseUShort());
        }

        glyph.instructionLength = p.parseUShort();
        glyph.instructions = [];
        for (let i = 0; i < glyph.instructionLength; i += 1) {
            glyph.instructions.push(p.parseByte());
        }

        const numberOfCoordinates = endPointIndices[endPointIndices.length - 1] + 1;
        flags = [];
        for (let i = 0; i < numberOfCoordinates; i += 1) {
            flag = p.parseByte();
            flags.push(flag);
            // If bit 3 is set, we repeat this flag n times, where n is the next byte.
            if ((flag & 8) > 0) {
                const repeatCount = p.parseByte();
                for (let j = 0; j < repeatCount; j += 1) {
                    flags.push(flag);
                    i += 1;
                }
            }
        }

        _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(flags.length === numberOfCoordinates, 'Bad flags.');

        if (endPointIndices.length > 0) {
            const points = [];
            let point;
            // X/Y coordinates are relative to the previous point, except for the first point which is relative to 0,0.
            if (numberOfCoordinates > 0) {
                for (let i = 0; i < numberOfCoordinates; i += 1) {
                    flag = flags[i];
                    point = {};
                    point.onCurve = !!(flag & 1);
                    point.lastPointOfContour = endPointIndices.indexOf(i) >= 0;
                    points.push(point);
                }

                let px = 0;
                for (let i = 0; i < numberOfCoordinates; i += 1) {
                    flag = flags[i];
                    point = points[i];
                    point.x = parseGlyphCoordinate(p, flag, px, 2, 16);
                    px = point.x;
                }

                let py = 0;
                for (let i = 0; i < numberOfCoordinates; i += 1) {
                    flag = flags[i];
                    point = points[i];
                    point.y = parseGlyphCoordinate(p, flag, py, 4, 32);
                    py = point.y;
                }
            }

            glyph.points = points;
        } else {
            glyph.points = [];
        }
    } else if (glyph.numberOfContours === 0) {
        glyph.points = [];
    } else {
        glyph.isComposite = true;
        glyph.points = [];
        glyph.components = [];
        let moreComponents = true;
        while (moreComponents) {
            flags = p.parseUShort();
            const component = {
                glyphIndex: p.parseUShort(),
                xScale: 1,
                scale01: 0,
                scale10: 0,
                yScale: 1,
                dx: 0,
                dy: 0
            };
            if ((flags & 1) > 0) {
                // The arguments are words
                if ((flags & 2) > 0) {
                    // values are offset
                    component.dx = p.parseShort();
                    component.dy = p.parseShort();
                } else {
                    // values are matched points
                    component.matchedPoints = [p.parseUShort(), p.parseUShort()];
                }

            } else {
                // The arguments are bytes
                if ((flags & 2) > 0) {
                    // values are offset
                    component.dx = p.parseChar();
                    component.dy = p.parseChar();
                } else {
                    // values are matched points
                    component.matchedPoints = [p.parseByte(), p.parseByte()];
                }
            }

            if ((flags & 8) > 0) {
                // We have a scale
                component.xScale = component.yScale = p.parseF2Dot14();
            } else if ((flags & 64) > 0) {
                // We have an X / Y scale
                component.xScale = p.parseF2Dot14();
                component.yScale = p.parseF2Dot14();
            } else if ((flags & 128) > 0) {
                // We have a 2x2 transformation
                component.xScale = p.parseF2Dot14();
                component.scale01 = p.parseF2Dot14();
                component.scale10 = p.parseF2Dot14();
                component.yScale = p.parseF2Dot14();
            }

            glyph.components.push(component);
            moreComponents = !!(flags & 32);
        }
        if (flags & 0x100) {
            // We have instructions
            glyph.instructionLength = p.parseUShort();
            glyph.instructions = [];
            for (let i = 0; i < glyph.instructionLength; i += 1) {
                glyph.instructions.push(p.parseByte());
            }
        }
    }
}

// Transform an array of points and return a new array.
function transformPoints(points, transform) {
    const newPoints = [];
    for (let i = 0; i < points.length; i += 1) {
        const pt = points[i];
        const newPt = {
            x: transform.xScale * pt.x + transform.scale01 * pt.y + transform.dx,
            y: transform.scale10 * pt.x + transform.yScale * pt.y + transform.dy,
            onCurve: pt.onCurve,
            lastPointOfContour: pt.lastPointOfContour
        };
        newPoints.push(newPt);
    }

    return newPoints;
}

function getContours(points) {
    const contours = [];
    let currentContour = [];
    for (let i = 0; i < points.length; i += 1) {
        const pt = points[i];
        currentContour.push(pt);
        if (pt.lastPointOfContour) {
            contours.push(currentContour);
            currentContour = [];
        }
    }

    _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(currentContour.length === 0, 'There are still points left in the current contour.');
    return contours;
}

// Convert the TrueType glyph outline to a Path.
function getPath(points) {
    const p = new _path__WEBPACK_IMPORTED_MODULE_3__.default();
    if (!points) {
        return p;
    }

    const contours = getContours(points);

    for (let contourIndex = 0; contourIndex < contours.length; ++contourIndex) {
        const contour = contours[contourIndex];

        let prev = null;
        let curr = contour[contour.length - 1];
        let next = contour[0];

        if (curr.onCurve) {
            p.moveTo(curr.x, curr.y);
        } else {
            if (next.onCurve) {
                p.moveTo(next.x, next.y);
            } else {
                // If both first and last points are off-curve, start at their middle.
                const start = {x: (curr.x + next.x) * 0.5, y: (curr.y + next.y) * 0.5};
                p.moveTo(start.x, start.y);
            }
        }

        for (let i = 0; i < contour.length; ++i) {
            prev = curr;
            curr = next;
            next = contour[(i + 1) % contour.length];

            if (curr.onCurve) {
                // This is a straight line.
                p.lineTo(curr.x, curr.y);
            } else {
                let prev2 = prev;
                let next2 = next;

                if (!prev.onCurve) {
                    prev2 = { x: (curr.x + prev.x) * 0.5, y: (curr.y + prev.y) * 0.5 };
                    p.lineTo(prev2.x, prev2.y);
                }

                if (!next.onCurve) {
                    next2 = { x: (curr.x + next.x) * 0.5, y: (curr.y + next.y) * 0.5 };
                }

                p.lineTo(prev2.x, prev2.y);
                p.quadraticCurveTo(curr.x, curr.y, next2.x, next2.y);
            }
        }

        p.closePath();
    }
    return p;
}

function buildPath(glyphs, glyph) {
    if (glyph.isComposite) {
        for (let j = 0; j < glyph.components.length; j += 1) {
            const component = glyph.components[j];
            const componentGlyph = glyphs.get(component.glyphIndex);
            // Force the ttfGlyphLoader to parse the glyph.
            componentGlyph.getPath();
            if (componentGlyph.points) {
                let transformedPoints;
                if (component.matchedPoints === undefined) {
                    // component positioned by offset
                    transformedPoints = transformPoints(componentGlyph.points, component);
                } else {
                    // component positioned by matched points
                    if ((component.matchedPoints[0] > glyph.points.length - 1) ||
                        (component.matchedPoints[1] > componentGlyph.points.length - 1)) {
                        throw Error('Matched points out of range in ' + glyph.name);
                    }
                    const firstPt = glyph.points[component.matchedPoints[0]];
                    let secondPt = componentGlyph.points[component.matchedPoints[1]];
                    const transform = {
                        xScale: component.xScale, scale01: component.scale01,
                        scale10: component.scale10, yScale: component.yScale,
                        dx: 0, dy: 0
                    };
                    secondPt = transformPoints([secondPt], transform)[0];
                    transform.dx = firstPt.x - secondPt.x;
                    transform.dy = firstPt.y - secondPt.y;
                    transformedPoints = transformPoints(componentGlyph.points, transform);
                }
                glyph.points = glyph.points.concat(transformedPoints);
            }
        }
    }

    return getPath(glyph.points);
}

// Parse all the glyphs according to the offsets from the `loca` table.
function parseGlyfTable(data, start, loca, font) {
    const glyphs = new _glyphset__WEBPACK_IMPORTED_MODULE_1__.default.GlyphSet(font);

    // The last element of the loca table is invalid.
    for (let i = 0; i < loca.length - 1; i += 1) {
        const offset = loca[i];
        const nextOffset = loca[i + 1];
        if (offset !== nextOffset) {
            glyphs.push(i, _glyphset__WEBPACK_IMPORTED_MODULE_1__.default.ttfGlyphLoader(font, i, parseGlyph, data, start + offset, buildPath));
        } else {
            glyphs.push(i, _glyphset__WEBPACK_IMPORTED_MODULE_1__.default.glyphLoader(font, i));
        }
    }

    return glyphs;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ getPath, parse: parseGlyfTable });


/***/ }),

/***/ "./node_modules/opentype.js/src/tables/gpos.js":
/*!*****************************************************!*\
  !*** ./node_modules/opentype.js/src/tables/gpos.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../check */ "./node_modules/opentype.js/src/check.js");
/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../parse */ "./node_modules/opentype.js/src/parse.js");
/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../table */ "./node_modules/opentype.js/src/table.js");
// The `GPOS` table contains kerning pairs, among other things.
// https://docs.microsoft.com/en-us/typography/opentype/spec/gpos





const subtableParsers = new Array(10);         // subtableParsers[0] is unused

// https://docs.microsoft.com/en-us/typography/opentype/spec/gpos#lookup-type-1-single-adjustment-positioning-subtable
// this = Parser instance
subtableParsers[1] = function parseLookup1() {
    const start = this.offset + this.relativeOffset;
    const posformat = this.parseUShort();
    if (posformat === 1) {
        return {
            posFormat: 1,
            coverage: this.parsePointer(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.coverage),
            value: this.parseValueRecord()
        };
    } else if (posformat === 2) {
        return {
            posFormat: 2,
            coverage: this.parsePointer(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.coverage),
            values: this.parseValueRecordList()
        };
    }
    _check__WEBPACK_IMPORTED_MODULE_0__.default.assert(false, '0x' + start.toString(16) + ': GPOS lookup type 1 format must be 1 or 2.');
};

// https://docs.microsoft.com/en-us/typography/opentype/spec/gpos#lookup-type-2-pair-adjustment-positioning-subtable
subtableParsers[2] = function parseLookup2() {
    const start = this.offset + this.relativeOffset;
    const posFormat = this.parseUShort();
    const coverage = this.parsePointer(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.coverage);
    const valueFormat1 = this.parseUShort();
    const valueFormat2 = this.parseUShort();
    if (posFormat === 1) {
        // Adjustments for Glyph Pairs
        return {
            posFormat: posFormat,
            coverage: coverage,
            valueFormat1: valueFormat1,
            valueFormat2: valueFormat2,
            pairSets: this.parseList(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.pointer(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.list(function() {
                return {        // pairValueRecord
                    secondGlyph: this.parseUShort(),
                    value1: this.parseValueRecord(valueFormat1),
                    value2: this.parseValueRecord(valueFormat2)
                };
            })))
        };
    } else if (posFormat === 2) {
        const classDef1 = this.parsePointer(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.classDef);
        const classDef2 = this.parsePointer(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.classDef);
        const class1Count = this.parseUShort();
        const class2Count = this.parseUShort();
        return {
            // Class Pair Adjustment
            posFormat: posFormat,
            coverage: coverage,
            valueFormat1: valueFormat1,
            valueFormat2: valueFormat2,
            classDef1: classDef1,
            classDef2: classDef2,
            class1Count: class1Count,
            class2Count: class2Count,
            classRecords: this.parseList(class1Count, _parse__WEBPACK_IMPORTED_MODULE_1__.Parser.list(class2Count, function() {
                return {
                    value1: this.parseValueRecord(valueFormat1),
                    value2: this.parseValueRecord(valueFormat2)
                };
            }))
        };
    }
    _check__WEBPACK_IMPORTED_MODULE_0__.default.assert(false, '0x' + start.toString(16) + ': GPOS lookup type 2 format must be 1 or 2.');
};

subtableParsers[3] = function parseLookup3() { return { error: 'GPOS Lookup 3 not supported' }; };
subtableParsers[4] = function parseLookup4() { return { error: 'GPOS Lookup 4 not supported' }; };
subtableParsers[5] = function parseLookup5() { return { error: 'GPOS Lookup 5 not supported' }; };
subtableParsers[6] = function parseLookup6() { return { error: 'GPOS Lookup 6 not supported' }; };
subtableParsers[7] = function parseLookup7() { return { error: 'GPOS Lookup 7 not supported' }; };
subtableParsers[8] = function parseLookup8() { return { error: 'GPOS Lookup 8 not supported' }; };
subtableParsers[9] = function parseLookup9() { return { error: 'GPOS Lookup 9 not supported' }; };

// https://docs.microsoft.com/en-us/typography/opentype/spec/gpos
function parseGposTable(data, start) {
    start = start || 0;
    const p = new _parse__WEBPACK_IMPORTED_MODULE_1__.Parser(data, start);
    const tableVersion = p.parseVersion(1);
    _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(tableVersion === 1 || tableVersion === 1.1, 'Unsupported GPOS table version ' + tableVersion);

    if (tableVersion === 1) {
        return {
            version: tableVersion,
            scripts: p.parseScriptList(),
            features: p.parseFeatureList(),
            lookups: p.parseLookupList(subtableParsers)
        };
    } else {
        return {
            version: tableVersion,
            scripts: p.parseScriptList(),
            features: p.parseFeatureList(),
            lookups: p.parseLookupList(subtableParsers),
            variations: p.parseFeatureVariationsList()
        };
    }

}

// GPOS Writing //////////////////////////////////////////////
// NOT SUPPORTED
const subtableMakers = new Array(10);

function makeGposTable(gpos) {
    return new _table__WEBPACK_IMPORTED_MODULE_2__.default.Table('GPOS', [
        {name: 'version', type: 'ULONG', value: 0x10000},
        {name: 'scripts', type: 'TABLE', value: new _table__WEBPACK_IMPORTED_MODULE_2__.default.ScriptList(gpos.scripts)},
        {name: 'features', type: 'TABLE', value: new _table__WEBPACK_IMPORTED_MODULE_2__.default.FeatureList(gpos.features)},
        {name: 'lookups', type: 'TABLE', value: new _table__WEBPACK_IMPORTED_MODULE_2__.default.LookupList(gpos.lookups, subtableMakers)}
    ]);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ parse: parseGposTable, make: makeGposTable });


/***/ }),

/***/ "./node_modules/opentype.js/src/tables/gsub.js":
/*!*****************************************************!*\
  !*** ./node_modules/opentype.js/src/tables/gsub.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../check */ "./node_modules/opentype.js/src/check.js");
/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../parse */ "./node_modules/opentype.js/src/parse.js");
/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../table */ "./node_modules/opentype.js/src/table.js");
// The `GSUB` table contains ligatures, among other things.
// https://www.microsoft.com/typography/OTSPEC/gsub.htm





const subtableParsers = new Array(9);         // subtableParsers[0] is unused

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#SS
subtableParsers[1] = function parseLookup1() {
    const start = this.offset + this.relativeOffset;
    const substFormat = this.parseUShort();
    if (substFormat === 1) {
        return {
            substFormat: 1,
            coverage: this.parsePointer(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.coverage),
            deltaGlyphId: this.parseUShort()
        };
    } else if (substFormat === 2) {
        return {
            substFormat: 2,
            coverage: this.parsePointer(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.coverage),
            substitute: this.parseOffset16List()
        };
    }
    _check__WEBPACK_IMPORTED_MODULE_0__.default.assert(false, '0x' + start.toString(16) + ': lookup type 1 format must be 1 or 2.');
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#MS
subtableParsers[2] = function parseLookup2() {
    const substFormat = this.parseUShort();
    _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(substFormat === 1, 'GSUB Multiple Substitution Subtable identifier-format must be 1');
    return {
        substFormat: substFormat,
        coverage: this.parsePointer(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.coverage),
        sequences: this.parseListOfLists()
    };
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#AS
subtableParsers[3] = function parseLookup3() {
    const substFormat = this.parseUShort();
    _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(substFormat === 1, 'GSUB Alternate Substitution Subtable identifier-format must be 1');
    return {
        substFormat: substFormat,
        coverage: this.parsePointer(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.coverage),
        alternateSets: this.parseListOfLists()
    };
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#LS
subtableParsers[4] = function parseLookup4() {
    const substFormat = this.parseUShort();
    _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(substFormat === 1, 'GSUB ligature table identifier-format must be 1');
    return {
        substFormat: substFormat,
        coverage: this.parsePointer(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.coverage),
        ligatureSets: this.parseListOfLists(function() {
            return {
                ligGlyph: this.parseUShort(),
                components: this.parseUShortList(this.parseUShort() - 1)
            };
        })
    };
};

const lookupRecordDesc = {
    sequenceIndex: _parse__WEBPACK_IMPORTED_MODULE_1__.Parser.uShort,
    lookupListIndex: _parse__WEBPACK_IMPORTED_MODULE_1__.Parser.uShort
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#CSF
subtableParsers[5] = function parseLookup5() {
    const start = this.offset + this.relativeOffset;
    const substFormat = this.parseUShort();

    if (substFormat === 1) {
        return {
            substFormat: substFormat,
            coverage: this.parsePointer(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.coverage),
            ruleSets: this.parseListOfLists(function() {
                const glyphCount = this.parseUShort();
                const substCount = this.parseUShort();
                return {
                    input: this.parseUShortList(glyphCount - 1),
                    lookupRecords: this.parseRecordList(substCount, lookupRecordDesc)
                };
            })
        };
    } else if (substFormat === 2) {
        return {
            substFormat: substFormat,
            coverage: this.parsePointer(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.coverage),
            classDef: this.parsePointer(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.classDef),
            classSets: this.parseListOfLists(function() {
                const glyphCount = this.parseUShort();
                const substCount = this.parseUShort();
                return {
                    classes: this.parseUShortList(glyphCount - 1),
                    lookupRecords: this.parseRecordList(substCount, lookupRecordDesc)
                };
            })
        };
    } else if (substFormat === 3) {
        const glyphCount = this.parseUShort();
        const substCount = this.parseUShort();
        return {
            substFormat: substFormat,
            coverages: this.parseList(glyphCount, _parse__WEBPACK_IMPORTED_MODULE_1__.Parser.pointer(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.coverage)),
            lookupRecords: this.parseRecordList(substCount, lookupRecordDesc)
        };
    }
    _check__WEBPACK_IMPORTED_MODULE_0__.default.assert(false, '0x' + start.toString(16) + ': lookup type 5 format must be 1, 2 or 3.');
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#CC
subtableParsers[6] = function parseLookup6() {
    const start = this.offset + this.relativeOffset;
    const substFormat = this.parseUShort();
    if (substFormat === 1) {
        return {
            substFormat: 1,
            coverage: this.parsePointer(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.coverage),
            chainRuleSets: this.parseListOfLists(function() {
                return {
                    backtrack: this.parseUShortList(),
                    input: this.parseUShortList(this.parseShort() - 1),
                    lookahead: this.parseUShortList(),
                    lookupRecords: this.parseRecordList(lookupRecordDesc)
                };
            })
        };
    } else if (substFormat === 2) {
        return {
            substFormat: 2,
            coverage: this.parsePointer(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.coverage),
            backtrackClassDef: this.parsePointer(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.classDef),
            inputClassDef: this.parsePointer(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.classDef),
            lookaheadClassDef: this.parsePointer(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.classDef),
            chainClassSet: this.parseListOfLists(function() {
                return {
                    backtrack: this.parseUShortList(),
                    input: this.parseUShortList(this.parseShort() - 1),
                    lookahead: this.parseUShortList(),
                    lookupRecords: this.parseRecordList(lookupRecordDesc)
                };
            })
        };
    } else if (substFormat === 3) {
        return {
            substFormat: 3,
            backtrackCoverage: this.parseList(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.pointer(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.coverage)),
            inputCoverage: this.parseList(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.pointer(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.coverage)),
            lookaheadCoverage: this.parseList(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.pointer(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.coverage)),
            lookupRecords: this.parseRecordList(lookupRecordDesc)
        };
    }
    _check__WEBPACK_IMPORTED_MODULE_0__.default.assert(false, '0x' + start.toString(16) + ': lookup type 6 format must be 1, 2 or 3.');
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#ES
subtableParsers[7] = function parseLookup7() {
    // Extension Substitution subtable
    const substFormat = this.parseUShort();
    _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(substFormat === 1, 'GSUB Extension Substitution subtable identifier-format must be 1');
    const extensionLookupType = this.parseUShort();
    const extensionParser = new _parse__WEBPACK_IMPORTED_MODULE_1__.Parser(this.data, this.offset + this.parseULong());
    return {
        substFormat: 1,
        lookupType: extensionLookupType,
        extension: subtableParsers[extensionLookupType].call(extensionParser)
    };
};

// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#RCCS
subtableParsers[8] = function parseLookup8() {
    const substFormat = this.parseUShort();
    _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(substFormat === 1, 'GSUB Reverse Chaining Contextual Single Substitution Subtable identifier-format must be 1');
    return {
        substFormat: substFormat,
        coverage: this.parsePointer(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.coverage),
        backtrackCoverage: this.parseList(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.pointer(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.coverage)),
        lookaheadCoverage: this.parseList(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.pointer(_parse__WEBPACK_IMPORTED_MODULE_1__.Parser.coverage)),
        substitutes: this.parseUShortList()
    };
};

// https://www.microsoft.com/typography/OTSPEC/gsub.htm
function parseGsubTable(data, start) {
    start = start || 0;
    const p = new _parse__WEBPACK_IMPORTED_MODULE_1__.Parser(data, start);
    const tableVersion = p.parseVersion(1);
    _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(tableVersion === 1 || tableVersion === 1.1, 'Unsupported GSUB table version.');
    if (tableVersion === 1) {
        return {
            version: tableVersion,
            scripts: p.parseScriptList(),
            features: p.parseFeatureList(),
            lookups: p.parseLookupList(subtableParsers)
        };
    } else {
        return {
            version: tableVersion,
            scripts: p.parseScriptList(),
            features: p.parseFeatureList(),
            lookups: p.parseLookupList(subtableParsers),
            variations: p.parseFeatureVariationsList()
        };
    }

}

// GSUB Writing //////////////////////////////////////////////
const subtableMakers = new Array(9);

subtableMakers[1] = function makeLookup1(subtable) {
    if (subtable.substFormat === 1) {
        return new _table__WEBPACK_IMPORTED_MODULE_2__.default.Table('substitutionTable', [
            {name: 'substFormat', type: 'USHORT', value: 1},
            {name: 'coverage', type: 'TABLE', value: new _table__WEBPACK_IMPORTED_MODULE_2__.default.Coverage(subtable.coverage)},
            {name: 'deltaGlyphID', type: 'USHORT', value: subtable.deltaGlyphId}
        ]);
    } else {
        return new _table__WEBPACK_IMPORTED_MODULE_2__.default.Table('substitutionTable', [
            {name: 'substFormat', type: 'USHORT', value: 2},
            {name: 'coverage', type: 'TABLE', value: new _table__WEBPACK_IMPORTED_MODULE_2__.default.Coverage(subtable.coverage)}
        ].concat(_table__WEBPACK_IMPORTED_MODULE_2__.default.ushortList('substitute', subtable.substitute)));
    }
    _check__WEBPACK_IMPORTED_MODULE_0__.default.fail('Lookup type 1 substFormat must be 1 or 2.');
};

subtableMakers[3] = function makeLookup3(subtable) {
    _check__WEBPACK_IMPORTED_MODULE_0__.default.assert(subtable.substFormat === 1, 'Lookup type 3 substFormat must be 1.');
    return new _table__WEBPACK_IMPORTED_MODULE_2__.default.Table('substitutionTable', [
        {name: 'substFormat', type: 'USHORT', value: 1},
        {name: 'coverage', type: 'TABLE', value: new _table__WEBPACK_IMPORTED_MODULE_2__.default.Coverage(subtable.coverage)}
    ].concat(_table__WEBPACK_IMPORTED_MODULE_2__.default.tableList('altSet', subtable.alternateSets, function(alternateSet) {
        return new _table__WEBPACK_IMPORTED_MODULE_2__.default.Table('alternateSetTable', _table__WEBPACK_IMPORTED_MODULE_2__.default.ushortList('alternate', alternateSet));
    })));
};

subtableMakers[4] = function makeLookup4(subtable) {
    _check__WEBPACK_IMPORTED_MODULE_0__.default.assert(subtable.substFormat === 1, 'Lookup type 4 substFormat must be 1.');
    return new _table__WEBPACK_IMPORTED_MODULE_2__.default.Table('substitutionTable', [
        {name: 'substFormat', type: 'USHORT', value: 1},
        {name: 'coverage', type: 'TABLE', value: new _table__WEBPACK_IMPORTED_MODULE_2__.default.Coverage(subtable.coverage)}
    ].concat(_table__WEBPACK_IMPORTED_MODULE_2__.default.tableList('ligSet', subtable.ligatureSets, function(ligatureSet) {
        return new _table__WEBPACK_IMPORTED_MODULE_2__.default.Table('ligatureSetTable', _table__WEBPACK_IMPORTED_MODULE_2__.default.tableList('ligature', ligatureSet, function(ligature) {
            return new _table__WEBPACK_IMPORTED_MODULE_2__.default.Table('ligatureTable',
                [{name: 'ligGlyph', type: 'USHORT', value: ligature.ligGlyph}]
                .concat(_table__WEBPACK_IMPORTED_MODULE_2__.default.ushortList('component', ligature.components, ligature.components.length + 1))
            );
        }));
    })));
};

function makeGsubTable(gsub) {
    return new _table__WEBPACK_IMPORTED_MODULE_2__.default.Table('GSUB', [
        {name: 'version', type: 'ULONG', value: 0x10000},
        {name: 'scripts', type: 'TABLE', value: new _table__WEBPACK_IMPORTED_MODULE_2__.default.ScriptList(gsub.scripts)},
        {name: 'features', type: 'TABLE', value: new _table__WEBPACK_IMPORTED_MODULE_2__.default.FeatureList(gsub.features)},
        {name: 'lookups', type: 'TABLE', value: new _table__WEBPACK_IMPORTED_MODULE_2__.default.LookupList(gsub.lookups, subtableMakers)}
    ]);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ parse: parseGsubTable, make: makeGsubTable });


/***/ }),

/***/ "./node_modules/opentype.js/src/tables/head.js":
/*!*****************************************************!*\
  !*** ./node_modules/opentype.js/src/tables/head.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../check */ "./node_modules/opentype.js/src/check.js");
/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../parse */ "./node_modules/opentype.js/src/parse.js");
/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../table */ "./node_modules/opentype.js/src/table.js");
// The `head` table contains global information about the font.
// https://www.microsoft.com/typography/OTSPEC/head.htm





// Parse the header `head` table
function parseHeadTable(data, start) {
    const head = {};
    const p = new _parse__WEBPACK_IMPORTED_MODULE_1__.default.Parser(data, start);
    head.version = p.parseVersion();
    head.fontRevision = Math.round(p.parseFixed() * 1000) / 1000;
    head.checkSumAdjustment = p.parseULong();
    head.magicNumber = p.parseULong();
    _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(head.magicNumber === 0x5F0F3CF5, 'Font header has wrong magic number.');
    head.flags = p.parseUShort();
    head.unitsPerEm = p.parseUShort();
    head.created = p.parseLongDateTime();
    head.modified = p.parseLongDateTime();
    head.xMin = p.parseShort();
    head.yMin = p.parseShort();
    head.xMax = p.parseShort();
    head.yMax = p.parseShort();
    head.macStyle = p.parseUShort();
    head.lowestRecPPEM = p.parseUShort();
    head.fontDirectionHint = p.parseShort();
    head.indexToLocFormat = p.parseShort();
    head.glyphDataFormat = p.parseShort();
    return head;
}

function makeHeadTable(options) {
    // Apple Mac timestamp epoch is 01/01/1904 not 01/01/1970
    const timestamp = Math.round(new Date().getTime() / 1000) + 2082844800;
    let createdTimestamp = timestamp;

    if (options.createdTimestamp) {
        createdTimestamp = options.createdTimestamp + 2082844800;
    }

    return new _table__WEBPACK_IMPORTED_MODULE_2__.default.Table('head', [
        {name: 'version', type: 'FIXED', value: 0x00010000},
        {name: 'fontRevision', type: 'FIXED', value: 0x00010000},
        {name: 'checkSumAdjustment', type: 'ULONG', value: 0},
        {name: 'magicNumber', type: 'ULONG', value: 0x5F0F3CF5},
        {name: 'flags', type: 'USHORT', value: 0},
        {name: 'unitsPerEm', type: 'USHORT', value: 1000},
        {name: 'created', type: 'LONGDATETIME', value: createdTimestamp},
        {name: 'modified', type: 'LONGDATETIME', value: timestamp},
        {name: 'xMin', type: 'SHORT', value: 0},
        {name: 'yMin', type: 'SHORT', value: 0},
        {name: 'xMax', type: 'SHORT', value: 0},
        {name: 'yMax', type: 'SHORT', value: 0},
        {name: 'macStyle', type: 'USHORT', value: 0},
        {name: 'lowestRecPPEM', type: 'USHORT', value: 0},
        {name: 'fontDirectionHint', type: 'SHORT', value: 2},
        {name: 'indexToLocFormat', type: 'SHORT', value: 0},
        {name: 'glyphDataFormat', type: 'SHORT', value: 0}
    ], options);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ parse: parseHeadTable, make: makeHeadTable });


/***/ }),

/***/ "./node_modules/opentype.js/src/tables/hhea.js":
/*!*****************************************************!*\
  !*** ./node_modules/opentype.js/src/tables/hhea.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../parse */ "./node_modules/opentype.js/src/parse.js");
/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../table */ "./node_modules/opentype.js/src/table.js");
// The `hhea` table contains information for horizontal layout.
// https://www.microsoft.com/typography/OTSPEC/hhea.htm




// Parse the horizontal header `hhea` table
function parseHheaTable(data, start) {
    const hhea = {};
    const p = new _parse__WEBPACK_IMPORTED_MODULE_0__.default.Parser(data, start);
    hhea.version = p.parseVersion();
    hhea.ascender = p.parseShort();
    hhea.descender = p.parseShort();
    hhea.lineGap = p.parseShort();
    hhea.advanceWidthMax = p.parseUShort();
    hhea.minLeftSideBearing = p.parseShort();
    hhea.minRightSideBearing = p.parseShort();
    hhea.xMaxExtent = p.parseShort();
    hhea.caretSlopeRise = p.parseShort();
    hhea.caretSlopeRun = p.parseShort();
    hhea.caretOffset = p.parseShort();
    p.relativeOffset += 8;
    hhea.metricDataFormat = p.parseShort();
    hhea.numberOfHMetrics = p.parseUShort();
    return hhea;
}

function makeHheaTable(options) {
    return new _table__WEBPACK_IMPORTED_MODULE_1__.default.Table('hhea', [
        {name: 'version', type: 'FIXED', value: 0x00010000},
        {name: 'ascender', type: 'FWORD', value: 0},
        {name: 'descender', type: 'FWORD', value: 0},
        {name: 'lineGap', type: 'FWORD', value: 0},
        {name: 'advanceWidthMax', type: 'UFWORD', value: 0},
        {name: 'minLeftSideBearing', type: 'FWORD', value: 0},
        {name: 'minRightSideBearing', type: 'FWORD', value: 0},
        {name: 'xMaxExtent', type: 'FWORD', value: 0},
        {name: 'caretSlopeRise', type: 'SHORT', value: 1},
        {name: 'caretSlopeRun', type: 'SHORT', value: 0},
        {name: 'caretOffset', type: 'SHORT', value: 0},
        {name: 'reserved1', type: 'SHORT', value: 0},
        {name: 'reserved2', type: 'SHORT', value: 0},
        {name: 'reserved3', type: 'SHORT', value: 0},
        {name: 'reserved4', type: 'SHORT', value: 0},
        {name: 'metricDataFormat', type: 'SHORT', value: 0},
        {name: 'numberOfHMetrics', type: 'USHORT', value: 0}
    ], options);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ parse: parseHheaTable, make: makeHheaTable });


/***/ }),

/***/ "./node_modules/opentype.js/src/tables/hmtx.js":
/*!*****************************************************!*\
  !*** ./node_modules/opentype.js/src/tables/hmtx.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../parse */ "./node_modules/opentype.js/src/parse.js");
/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../table */ "./node_modules/opentype.js/src/table.js");
// The `hmtx` table contains the horizontal metrics for all glyphs.
// https://www.microsoft.com/typography/OTSPEC/hmtx.htm




// Parse the `hmtx` table, which contains the horizontal metrics for all glyphs.
// This function augments the glyph array, adding the advanceWidth and leftSideBearing to each glyph.
function parseHmtxTable(data, start, numMetrics, numGlyphs, glyphs) {
    let advanceWidth;
    let leftSideBearing;
    const p = new _parse__WEBPACK_IMPORTED_MODULE_0__.default.Parser(data, start);
    for (let i = 0; i < numGlyphs; i += 1) {
        // If the font is monospaced, only one entry is needed. This last entry applies to all subsequent glyphs.
        if (i < numMetrics) {
            advanceWidth = p.parseUShort();
            leftSideBearing = p.parseShort();
        }

        const glyph = glyphs.get(i);
        glyph.advanceWidth = advanceWidth;
        glyph.leftSideBearing = leftSideBearing;
    }
}

function makeHmtxTable(glyphs) {
    const t = new _table__WEBPACK_IMPORTED_MODULE_1__.default.Table('hmtx', []);
    for (let i = 0; i < glyphs.length; i += 1) {
        const glyph = glyphs.get(i);
        const advanceWidth = glyph.advanceWidth || 0;
        const leftSideBearing = glyph.leftSideBearing || 0;
        t.fields.push({name: 'advanceWidth_' + i, type: 'USHORT', value: advanceWidth});
        t.fields.push({name: 'leftSideBearing_' + i, type: 'SHORT', value: leftSideBearing});
    }

    return t;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ parse: parseHmtxTable, make: makeHmtxTable });


/***/ }),

/***/ "./node_modules/opentype.js/src/tables/kern.js":
/*!*****************************************************!*\
  !*** ./node_modules/opentype.js/src/tables/kern.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../check */ "./node_modules/opentype.js/src/check.js");
/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../parse */ "./node_modules/opentype.js/src/parse.js");
// The `kern` table contains kerning pairs.
// Note that some fonts use the GPOS OpenType layout table to specify kerning.
// https://www.microsoft.com/typography/OTSPEC/kern.htm




function parseWindowsKernTable(p) {
    const pairs = {};
    // Skip nTables.
    p.skip('uShort');
    const subtableVersion = p.parseUShort();
    _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(subtableVersion === 0, 'Unsupported kern sub-table version.');
    // Skip subtableLength, subtableCoverage
    p.skip('uShort', 2);
    const nPairs = p.parseUShort();
    // Skip searchRange, entrySelector, rangeShift.
    p.skip('uShort', 3);
    for (let i = 0; i < nPairs; i += 1) {
        const leftIndex = p.parseUShort();
        const rightIndex = p.parseUShort();
        const value = p.parseShort();
        pairs[leftIndex + ',' + rightIndex] = value;
    }
    return pairs;
}

function parseMacKernTable(p) {
    const pairs = {};
    // The Mac kern table stores the version as a fixed (32 bits) but we only loaded the first 16 bits.
    // Skip the rest.
    p.skip('uShort');
    const nTables = p.parseULong();
    //check.argument(nTables === 1, 'Only 1 subtable is supported (got ' + nTables + ').');
    if (nTables > 1) {
        console.warn('Only the first kern subtable is supported.');
    }
    p.skip('uLong');
    const coverage = p.parseUShort();
    const subtableVersion = coverage & 0xFF;
    p.skip('uShort');
    if (subtableVersion === 0) {
        const nPairs = p.parseUShort();
        // Skip searchRange, entrySelector, rangeShift.
        p.skip('uShort', 3);
        for (let i = 0; i < nPairs; i += 1) {
            const leftIndex = p.parseUShort();
            const rightIndex = p.parseUShort();
            const value = p.parseShort();
            pairs[leftIndex + ',' + rightIndex] = value;
        }
    }
    return pairs;
}

// Parse the `kern` table which contains kerning pairs.
function parseKernTable(data, start) {
    const p = new _parse__WEBPACK_IMPORTED_MODULE_1__.default.Parser(data, start);
    const tableVersion = p.parseUShort();
    if (tableVersion === 0) {
        return parseWindowsKernTable(p);
    } else if (tableVersion === 1) {
        return parseMacKernTable(p);
    } else {
        throw new Error('Unsupported kern table version (' + tableVersion + ').');
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ parse: parseKernTable });


/***/ }),

/***/ "./node_modules/opentype.js/src/tables/loca.js":
/*!*****************************************************!*\
  !*** ./node_modules/opentype.js/src/tables/loca.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../parse */ "./node_modules/opentype.js/src/parse.js");
// The `loca` table stores the offsets to the locations of the glyphs in the font.
// https://www.microsoft.com/typography/OTSPEC/loca.htm



// Parse the `loca` table. This table stores the offsets to the locations of the glyphs in the font,
// relative to the beginning of the glyphData table.
// The number of glyphs stored in the `loca` table is specified in the `maxp` table (under numGlyphs)
// The loca table has two versions: a short version where offsets are stored as uShorts, and a long
// version where offsets are stored as uLongs. The `head` table specifies which version to use
// (under indexToLocFormat).
function parseLocaTable(data, start, numGlyphs, shortVersion) {
    const p = new _parse__WEBPACK_IMPORTED_MODULE_0__.default.Parser(data, start);
    const parseFn = shortVersion ? p.parseUShort : p.parseULong;
    // There is an extra entry after the last index element to compute the length of the last glyph.
    // That's why we use numGlyphs + 1.
    const glyphOffsets = [];
    for (let i = 0; i < numGlyphs + 1; i += 1) {
        let glyphOffset = parseFn.call(p);
        if (shortVersion) {
            // The short table version stores the actual offset divided by 2.
            glyphOffset *= 2;
        }

        glyphOffsets.push(glyphOffset);
    }

    return glyphOffsets;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ parse: parseLocaTable });


/***/ }),

/***/ "./node_modules/opentype.js/src/tables/ltag.js":
/*!*****************************************************!*\
  !*** ./node_modules/opentype.js/src/tables/ltag.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../check */ "./node_modules/opentype.js/src/check.js");
/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../parse */ "./node_modules/opentype.js/src/parse.js");
/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../table */ "./node_modules/opentype.js/src/table.js");
// The `ltag` table stores IETF BCP-47 language tags. It allows supporting
// languages for which TrueType does not assign a numeric code.
// https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6ltag.html
// http://www.w3.org/International/articles/language-tags/
// http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry





function makeLtagTable(tags) {
    const result = new _table__WEBPACK_IMPORTED_MODULE_2__.default.Table('ltag', [
        {name: 'version', type: 'ULONG', value: 1},
        {name: 'flags', type: 'ULONG', value: 0},
        {name: 'numTags', type: 'ULONG', value: tags.length}
    ]);

    let stringPool = '';
    const stringPoolOffset = 12 + tags.length * 4;
    for (let i = 0; i < tags.length; ++i) {
        let pos = stringPool.indexOf(tags[i]);
        if (pos < 0) {
            pos = stringPool.length;
            stringPool += tags[i];
        }

        result.fields.push({name: 'offset ' + i, type: 'USHORT', value: stringPoolOffset + pos});
        result.fields.push({name: 'length ' + i, type: 'USHORT', value: tags[i].length});
    }

    result.fields.push({name: 'stringPool', type: 'CHARARRAY', value: stringPool});
    return result;
}

function parseLtagTable(data, start) {
    const p = new _parse__WEBPACK_IMPORTED_MODULE_1__.default.Parser(data, start);
    const tableVersion = p.parseULong();
    _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(tableVersion === 1, 'Unsupported ltag table version.');
    // The 'ltag' specification does not define any flags; skip the field.
    p.skip('uLong', 1);
    const numTags = p.parseULong();

    const tags = [];
    for (let i = 0; i < numTags; i++) {
        let tag = '';
        const offset = start + p.parseUShort();
        const length = p.parseUShort();
        for (let j = offset; j < offset + length; ++j) {
            tag += String.fromCharCode(data.getInt8(j));
        }

        tags.push(tag);
    }

    return tags;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ make: makeLtagTable, parse: parseLtagTable });


/***/ }),

/***/ "./node_modules/opentype.js/src/tables/maxp.js":
/*!*****************************************************!*\
  !*** ./node_modules/opentype.js/src/tables/maxp.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../parse */ "./node_modules/opentype.js/src/parse.js");
/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../table */ "./node_modules/opentype.js/src/table.js");
// The `maxp` table establishes the memory requirements for the font.
// We need it just to get the number of glyphs in the font.
// https://www.microsoft.com/typography/OTSPEC/maxp.htm




// Parse the maximum profile `maxp` table.
function parseMaxpTable(data, start) {
    const maxp = {};
    const p = new _parse__WEBPACK_IMPORTED_MODULE_0__.default.Parser(data, start);
    maxp.version = p.parseVersion();
    maxp.numGlyphs = p.parseUShort();
    if (maxp.version === 1.0) {
        maxp.maxPoints = p.parseUShort();
        maxp.maxContours = p.parseUShort();
        maxp.maxCompositePoints = p.parseUShort();
        maxp.maxCompositeContours = p.parseUShort();
        maxp.maxZones = p.parseUShort();
        maxp.maxTwilightPoints = p.parseUShort();
        maxp.maxStorage = p.parseUShort();
        maxp.maxFunctionDefs = p.parseUShort();
        maxp.maxInstructionDefs = p.parseUShort();
        maxp.maxStackElements = p.parseUShort();
        maxp.maxSizeOfInstructions = p.parseUShort();
        maxp.maxComponentElements = p.parseUShort();
        maxp.maxComponentDepth = p.parseUShort();
    }

    return maxp;
}

function makeMaxpTable(numGlyphs) {
    return new _table__WEBPACK_IMPORTED_MODULE_1__.default.Table('maxp', [
        {name: 'version', type: 'FIXED', value: 0x00005000},
        {name: 'numGlyphs', type: 'USHORT', value: numGlyphs}
    ]);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ parse: parseMaxpTable, make: makeMaxpTable });


/***/ }),

/***/ "./node_modules/opentype.js/src/tables/meta.js":
/*!*****************************************************!*\
  !*** ./node_modules/opentype.js/src/tables/meta.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../check */ "./node_modules/opentype.js/src/check.js");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../types */ "./node_modules/opentype.js/src/types.js");
/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../parse */ "./node_modules/opentype.js/src/parse.js");
/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../table */ "./node_modules/opentype.js/src/table.js");
// The `GPOS` table contains kerning pairs, among other things.
// https://www.microsoft.com/typography/OTSPEC/gpos.htm






// Parse the metadata `meta` table.
// https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6meta.html
function parseMetaTable(data, start) {
    const p = new _parse__WEBPACK_IMPORTED_MODULE_2__.default.Parser(data, start);
    const tableVersion = p.parseULong();
    _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(tableVersion === 1, 'Unsupported META table version.');
    p.parseULong(); // flags - currently unused and set to 0
    p.parseULong(); // tableOffset
    const numDataMaps = p.parseULong();

    const tags = {};
    for (let i = 0; i < numDataMaps; i++) {
        const tag = p.parseTag();
        const dataOffset = p.parseULong();
        const dataLength = p.parseULong();
        const text = _types__WEBPACK_IMPORTED_MODULE_1__.decode.UTF8(data, start + dataOffset, dataLength);

        tags[tag] = text;
    }
    return tags;
}

function makeMetaTable(tags) {
    const numTags = Object.keys(tags).length;
    let stringPool = '';
    const stringPoolOffset = 16 + numTags * 12;

    const result = new _table__WEBPACK_IMPORTED_MODULE_3__.default.Table('meta', [
        {name: 'version', type: 'ULONG', value: 1},
        {name: 'flags', type: 'ULONG', value: 0},
        {name: 'offset', type: 'ULONG', value: stringPoolOffset},
        {name: 'numTags', type: 'ULONG', value: numTags}
    ]);

    for (let tag in tags) {
        const pos = stringPool.length;
        stringPool += tags[tag];

        result.fields.push({name: 'tag ' + tag, type: 'TAG', value: tag});
        result.fields.push({name: 'offset ' + tag, type: 'ULONG', value: stringPoolOffset + pos});
        result.fields.push({name: 'length ' + tag, type: 'ULONG', value: tags[tag].length});
    }

    result.fields.push({name: 'stringPool', type: 'CHARARRAY', value: stringPool});

    return result;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ parse: parseMetaTable, make: makeMetaTable });


/***/ }),

/***/ "./node_modules/opentype.js/src/tables/name.js":
/*!*****************************************************!*\
  !*** ./node_modules/opentype.js/src/tables/name.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../types */ "./node_modules/opentype.js/src/types.js");
/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../parse */ "./node_modules/opentype.js/src/parse.js");
/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../table */ "./node_modules/opentype.js/src/table.js");
// The `name` naming table.
// https://www.microsoft.com/typography/OTSPEC/name.htm





// NameIDs for the name table.
const nameTableNames = [
    'copyright',              // 0
    'fontFamily',             // 1
    'fontSubfamily',          // 2
    'uniqueID',               // 3
    'fullName',               // 4
    'version',                // 5
    'postScriptName',         // 6
    'trademark',              // 7
    'manufacturer',           // 8
    'designer',               // 9
    'description',            // 10
    'manufacturerURL',        // 11
    'designerURL',            // 12
    'license',                // 13
    'licenseURL',             // 14
    'reserved',               // 15
    'preferredFamily',        // 16
    'preferredSubfamily',     // 17
    'compatibleFullName',     // 18
    'sampleText',             // 19
    'postScriptFindFontName', // 20
    'wwsFamily',              // 21
    'wwsSubfamily'            // 22
];

const macLanguages = {
    0: 'en',
    1: 'fr',
    2: 'de',
    3: 'it',
    4: 'nl',
    5: 'sv',
    6: 'es',
    7: 'da',
    8: 'pt',
    9: 'no',
    10: 'he',
    11: 'ja',
    12: 'ar',
    13: 'fi',
    14: 'el',
    15: 'is',
    16: 'mt',
    17: 'tr',
    18: 'hr',
    19: 'zh-Hant',
    20: 'ur',
    21: 'hi',
    22: 'th',
    23: 'ko',
    24: 'lt',
    25: 'pl',
    26: 'hu',
    27: 'es',
    28: 'lv',
    29: 'se',
    30: 'fo',
    31: 'fa',
    32: 'ru',
    33: 'zh',
    34: 'nl-BE',
    35: 'ga',
    36: 'sq',
    37: 'ro',
    38: 'cz',
    39: 'sk',
    40: 'si',
    41: 'yi',
    42: 'sr',
    43: 'mk',
    44: 'bg',
    45: 'uk',
    46: 'be',
    47: 'uz',
    48: 'kk',
    49: 'az-Cyrl',
    50: 'az-Arab',
    51: 'hy',
    52: 'ka',
    53: 'mo',
    54: 'ky',
    55: 'tg',
    56: 'tk',
    57: 'mn-CN',
    58: 'mn',
    59: 'ps',
    60: 'ks',
    61: 'ku',
    62: 'sd',
    63: 'bo',
    64: 'ne',
    65: 'sa',
    66: 'mr',
    67: 'bn',
    68: 'as',
    69: 'gu',
    70: 'pa',
    71: 'or',
    72: 'ml',
    73: 'kn',
    74: 'ta',
    75: 'te',
    76: 'si',
    77: 'my',
    78: 'km',
    79: 'lo',
    80: 'vi',
    81: 'id',
    82: 'tl',
    83: 'ms',
    84: 'ms-Arab',
    85: 'am',
    86: 'ti',
    87: 'om',
    88: 'so',
    89: 'sw',
    90: 'rw',
    91: 'rn',
    92: 'ny',
    93: 'mg',
    94: 'eo',
    128: 'cy',
    129: 'eu',
    130: 'ca',
    131: 'la',
    132: 'qu',
    133: 'gn',
    134: 'ay',
    135: 'tt',
    136: 'ug',
    137: 'dz',
    138: 'jv',
    139: 'su',
    140: 'gl',
    141: 'af',
    142: 'br',
    143: 'iu',
    144: 'gd',
    145: 'gv',
    146: 'ga',
    147: 'to',
    148: 'el-polyton',
    149: 'kl',
    150: 'az',
    151: 'nn'
};

// MacOS language ID → MacOS script ID
//
// Note that the script ID is not sufficient to determine what encoding
// to use in TrueType files. For some languages, MacOS used a modification
// of a mainstream script. For example, an Icelandic name would be stored
// with smRoman in the TrueType naming table, but the actual encoding
// is a special Icelandic version of the normal Macintosh Roman encoding.
// As another example, Inuktitut uses an 8-bit encoding for Canadian Aboriginal
// Syllables but MacOS had run out of available script codes, so this was
// done as a (pretty radical) "modification" of Ethiopic.
//
// http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/Readme.txt
const macLanguageToScript = {
    0: 0,  // langEnglish → smRoman
    1: 0,  // langFrench → smRoman
    2: 0,  // langGerman → smRoman
    3: 0,  // langItalian → smRoman
    4: 0,  // langDutch → smRoman
    5: 0,  // langSwedish → smRoman
    6: 0,  // langSpanish → smRoman
    7: 0,  // langDanish → smRoman
    8: 0,  // langPortuguese → smRoman
    9: 0,  // langNorwegian → smRoman
    10: 5,  // langHebrew → smHebrew
    11: 1,  // langJapanese → smJapanese
    12: 4,  // langArabic → smArabic
    13: 0,  // langFinnish → smRoman
    14: 6,  // langGreek → smGreek
    15: 0,  // langIcelandic → smRoman (modified)
    16: 0,  // langMaltese → smRoman
    17: 0,  // langTurkish → smRoman (modified)
    18: 0,  // langCroatian → smRoman (modified)
    19: 2,  // langTradChinese → smTradChinese
    20: 4,  // langUrdu → smArabic
    21: 9,  // langHindi → smDevanagari
    22: 21,  // langThai → smThai
    23: 3,  // langKorean → smKorean
    24: 29,  // langLithuanian → smCentralEuroRoman
    25: 29,  // langPolish → smCentralEuroRoman
    26: 29,  // langHungarian → smCentralEuroRoman
    27: 29,  // langEstonian → smCentralEuroRoman
    28: 29,  // langLatvian → smCentralEuroRoman
    29: 0,  // langSami → smRoman
    30: 0,  // langFaroese → smRoman (modified)
    31: 4,  // langFarsi → smArabic (modified)
    32: 7,  // langRussian → smCyrillic
    33: 25,  // langSimpChinese → smSimpChinese
    34: 0,  // langFlemish → smRoman
    35: 0,  // langIrishGaelic → smRoman (modified)
    36: 0,  // langAlbanian → smRoman
    37: 0,  // langRomanian → smRoman (modified)
    38: 29,  // langCzech → smCentralEuroRoman
    39: 29,  // langSlovak → smCentralEuroRoman
    40: 0,  // langSlovenian → smRoman (modified)
    41: 5,  // langYiddish → smHebrew
    42: 7,  // langSerbian → smCyrillic
    43: 7,  // langMacedonian → smCyrillic
    44: 7,  // langBulgarian → smCyrillic
    45: 7,  // langUkrainian → smCyrillic (modified)
    46: 7,  // langByelorussian → smCyrillic
    47: 7,  // langUzbek → smCyrillic
    48: 7,  // langKazakh → smCyrillic
    49: 7,  // langAzerbaijani → smCyrillic
    50: 4,  // langAzerbaijanAr → smArabic
    51: 24,  // langArmenian → smArmenian
    52: 23,  // langGeorgian → smGeorgian
    53: 7,  // langMoldavian → smCyrillic
    54: 7,  // langKirghiz → smCyrillic
    55: 7,  // langTajiki → smCyrillic
    56: 7,  // langTurkmen → smCyrillic
    57: 27,  // langMongolian → smMongolian
    58: 7,  // langMongolianCyr → smCyrillic
    59: 4,  // langPashto → smArabic
    60: 4,  // langKurdish → smArabic
    61: 4,  // langKashmiri → smArabic
    62: 4,  // langSindhi → smArabic
    63: 26,  // langTibetan → smTibetan
    64: 9,  // langNepali → smDevanagari
    65: 9,  // langSanskrit → smDevanagari
    66: 9,  // langMarathi → smDevanagari
    67: 13,  // langBengali → smBengali
    68: 13,  // langAssamese → smBengali
    69: 11,  // langGujarati → smGujarati
    70: 10,  // langPunjabi → smGurmukhi
    71: 12,  // langOriya → smOriya
    72: 17,  // langMalayalam → smMalayalam
    73: 16,  // langKannada → smKannada
    74: 14,  // langTamil → smTamil
    75: 15,  // langTelugu → smTelugu
    76: 18,  // langSinhalese → smSinhalese
    77: 19,  // langBurmese → smBurmese
    78: 20,  // langKhmer → smKhmer
    79: 22,  // langLao → smLao
    80: 30,  // langVietnamese → smVietnamese
    81: 0,  // langIndonesian → smRoman
    82: 0,  // langTagalog → smRoman
    83: 0,  // langMalayRoman → smRoman
    84: 4,  // langMalayArabic → smArabic
    85: 28,  // langAmharic → smEthiopic
    86: 28,  // langTigrinya → smEthiopic
    87: 28,  // langOromo → smEthiopic
    88: 0,  // langSomali → smRoman
    89: 0,  // langSwahili → smRoman
    90: 0,  // langKinyarwanda → smRoman
    91: 0,  // langRundi → smRoman
    92: 0,  // langNyanja → smRoman
    93: 0,  // langMalagasy → smRoman
    94: 0,  // langEsperanto → smRoman
    128: 0,  // langWelsh → smRoman (modified)
    129: 0,  // langBasque → smRoman
    130: 0,  // langCatalan → smRoman
    131: 0,  // langLatin → smRoman
    132: 0,  // langQuechua → smRoman
    133: 0,  // langGuarani → smRoman
    134: 0,  // langAymara → smRoman
    135: 7,  // langTatar → smCyrillic
    136: 4,  // langUighur → smArabic
    137: 26,  // langDzongkha → smTibetan
    138: 0,  // langJavaneseRom → smRoman
    139: 0,  // langSundaneseRom → smRoman
    140: 0,  // langGalician → smRoman
    141: 0,  // langAfrikaans → smRoman
    142: 0,  // langBreton → smRoman (modified)
    143: 28,  // langInuktitut → smEthiopic (modified)
    144: 0,  // langScottishGaelic → smRoman (modified)
    145: 0,  // langManxGaelic → smRoman (modified)
    146: 0,  // langIrishGaelicScript → smRoman (modified)
    147: 0,  // langTongan → smRoman
    148: 6,  // langGreekAncient → smRoman
    149: 0,  // langGreenlandic → smRoman
    150: 0,  // langAzerbaijanRoman → smRoman
    151: 0   // langNynorsk → smRoman
};

// While Microsoft indicates a region/country for all its language
// IDs, we omit the region code if it's equal to the "most likely
// region subtag" according to Unicode CLDR. For scripts, we omit
// the subtag if it is equal to the Suppress-Script entry in the
// IANA language subtag registry for IETF BCP 47.
//
// For example, Microsoft states that its language code 0x041A is
// Croatian in Croatia. We transform this to the BCP 47 language code 'hr'
// and not 'hr-HR' because Croatia is the default country for Croatian,
// according to Unicode CLDR. As another example, Microsoft states
// that 0x101A is Croatian (Latin) in Bosnia-Herzegovina. We transform
// this to 'hr-BA' and not 'hr-Latn-BA' because Latin is the default script
// for the Croatian language, according to IANA.
//
// http://www.unicode.org/cldr/charts/latest/supplemental/likely_subtags.html
// http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry
const windowsLanguages = {
    0x0436: 'af',
    0x041C: 'sq',
    0x0484: 'gsw',
    0x045E: 'am',
    0x1401: 'ar-DZ',
    0x3C01: 'ar-BH',
    0x0C01: 'ar',
    0x0801: 'ar-IQ',
    0x2C01: 'ar-JO',
    0x3401: 'ar-KW',
    0x3001: 'ar-LB',
    0x1001: 'ar-LY',
    0x1801: 'ary',
    0x2001: 'ar-OM',
    0x4001: 'ar-QA',
    0x0401: 'ar-SA',
    0x2801: 'ar-SY',
    0x1C01: 'aeb',
    0x3801: 'ar-AE',
    0x2401: 'ar-YE',
    0x042B: 'hy',
    0x044D: 'as',
    0x082C: 'az-Cyrl',
    0x042C: 'az',
    0x046D: 'ba',
    0x042D: 'eu',
    0x0423: 'be',
    0x0845: 'bn',
    0x0445: 'bn-IN',
    0x201A: 'bs-Cyrl',
    0x141A: 'bs',
    0x047E: 'br',
    0x0402: 'bg',
    0x0403: 'ca',
    0x0C04: 'zh-HK',
    0x1404: 'zh-MO',
    0x0804: 'zh',
    0x1004: 'zh-SG',
    0x0404: 'zh-TW',
    0x0483: 'co',
    0x041A: 'hr',
    0x101A: 'hr-BA',
    0x0405: 'cs',
    0x0406: 'da',
    0x048C: 'prs',
    0x0465: 'dv',
    0x0813: 'nl-BE',
    0x0413: 'nl',
    0x0C09: 'en-AU',
    0x2809: 'en-BZ',
    0x1009: 'en-CA',
    0x2409: 'en-029',
    0x4009: 'en-IN',
    0x1809: 'en-IE',
    0x2009: 'en-JM',
    0x4409: 'en-MY',
    0x1409: 'en-NZ',
    0x3409: 'en-PH',
    0x4809: 'en-SG',
    0x1C09: 'en-ZA',
    0x2C09: 'en-TT',
    0x0809: 'en-GB',
    0x0409: 'en',
    0x3009: 'en-ZW',
    0x0425: 'et',
    0x0438: 'fo',
    0x0464: 'fil',
    0x040B: 'fi',
    0x080C: 'fr-BE',
    0x0C0C: 'fr-CA',
    0x040C: 'fr',
    0x140C: 'fr-LU',
    0x180C: 'fr-MC',
    0x100C: 'fr-CH',
    0x0462: 'fy',
    0x0456: 'gl',
    0x0437: 'ka',
    0x0C07: 'de-AT',
    0x0407: 'de',
    0x1407: 'de-LI',
    0x1007: 'de-LU',
    0x0807: 'de-CH',
    0x0408: 'el',
    0x046F: 'kl',
    0x0447: 'gu',
    0x0468: 'ha',
    0x040D: 'he',
    0x0439: 'hi',
    0x040E: 'hu',
    0x040F: 'is',
    0x0470: 'ig',
    0x0421: 'id',
    0x045D: 'iu',
    0x085D: 'iu-Latn',
    0x083C: 'ga',
    0x0434: 'xh',
    0x0435: 'zu',
    0x0410: 'it',
    0x0810: 'it-CH',
    0x0411: 'ja',
    0x044B: 'kn',
    0x043F: 'kk',
    0x0453: 'km',
    0x0486: 'quc',
    0x0487: 'rw',
    0x0441: 'sw',
    0x0457: 'kok',
    0x0412: 'ko',
    0x0440: 'ky',
    0x0454: 'lo',
    0x0426: 'lv',
    0x0427: 'lt',
    0x082E: 'dsb',
    0x046E: 'lb',
    0x042F: 'mk',
    0x083E: 'ms-BN',
    0x043E: 'ms',
    0x044C: 'ml',
    0x043A: 'mt',
    0x0481: 'mi',
    0x047A: 'arn',
    0x044E: 'mr',
    0x047C: 'moh',
    0x0450: 'mn',
    0x0850: 'mn-CN',
    0x0461: 'ne',
    0x0414: 'nb',
    0x0814: 'nn',
    0x0482: 'oc',
    0x0448: 'or',
    0x0463: 'ps',
    0x0415: 'pl',
    0x0416: 'pt',
    0x0816: 'pt-PT',
    0x0446: 'pa',
    0x046B: 'qu-BO',
    0x086B: 'qu-EC',
    0x0C6B: 'qu',
    0x0418: 'ro',
    0x0417: 'rm',
    0x0419: 'ru',
    0x243B: 'smn',
    0x103B: 'smj-NO',
    0x143B: 'smj',
    0x0C3B: 'se-FI',
    0x043B: 'se',
    0x083B: 'se-SE',
    0x203B: 'sms',
    0x183B: 'sma-NO',
    0x1C3B: 'sms',
    0x044F: 'sa',
    0x1C1A: 'sr-Cyrl-BA',
    0x0C1A: 'sr',
    0x181A: 'sr-Latn-BA',
    0x081A: 'sr-Latn',
    0x046C: 'nso',
    0x0432: 'tn',
    0x045B: 'si',
    0x041B: 'sk',
    0x0424: 'sl',
    0x2C0A: 'es-AR',
    0x400A: 'es-BO',
    0x340A: 'es-CL',
    0x240A: 'es-CO',
    0x140A: 'es-CR',
    0x1C0A: 'es-DO',
    0x300A: 'es-EC',
    0x440A: 'es-SV',
    0x100A: 'es-GT',
    0x480A: 'es-HN',
    0x080A: 'es-MX',
    0x4C0A: 'es-NI',
    0x180A: 'es-PA',
    0x3C0A: 'es-PY',
    0x280A: 'es-PE',
    0x500A: 'es-PR',

    // Microsoft has defined two different language codes for
    // “Spanish with modern sorting” and “Spanish with traditional
    // sorting”. This makes sense for collation APIs, and it would be
    // possible to express this in BCP 47 language tags via Unicode
    // extensions (eg., es-u-co-trad is Spanish with traditional
    // sorting). However, for storing names in fonts, the distinction
    // does not make sense, so we give “es” in both cases.
    0x0C0A: 'es',
    0x040A: 'es',

    0x540A: 'es-US',
    0x380A: 'es-UY',
    0x200A: 'es-VE',
    0x081D: 'sv-FI',
    0x041D: 'sv',
    0x045A: 'syr',
    0x0428: 'tg',
    0x085F: 'tzm',
    0x0449: 'ta',
    0x0444: 'tt',
    0x044A: 'te',
    0x041E: 'th',
    0x0451: 'bo',
    0x041F: 'tr',
    0x0442: 'tk',
    0x0480: 'ug',
    0x0422: 'uk',
    0x042E: 'hsb',
    0x0420: 'ur',
    0x0843: 'uz-Cyrl',
    0x0443: 'uz',
    0x042A: 'vi',
    0x0452: 'cy',
    0x0488: 'wo',
    0x0485: 'sah',
    0x0478: 'ii',
    0x046A: 'yo'
};

// Returns a IETF BCP 47 language code, for example 'zh-Hant'
// for 'Chinese in the traditional script'.
function getLanguageCode(platformID, languageID, ltag) {
    switch (platformID) {
        case 0:  // Unicode
            if (languageID === 0xFFFF) {
                return 'und';
            } else if (ltag) {
                return ltag[languageID];
            }

            break;

        case 1:  // Macintosh
            return macLanguages[languageID];

        case 3:  // Windows
            return windowsLanguages[languageID];
    }

    return undefined;
}

const utf16 = 'utf-16';

// MacOS script ID → encoding. This table stores the default case,
// which can be overridden by macLanguageEncodings.
const macScriptEncodings = {
    0: 'macintosh',           // smRoman
    1: 'x-mac-japanese',      // smJapanese
    2: 'x-mac-chinesetrad',   // smTradChinese
    3: 'x-mac-korean',        // smKorean
    6: 'x-mac-greek',         // smGreek
    7: 'x-mac-cyrillic',      // smCyrillic
    9: 'x-mac-devanagai',     // smDevanagari
    10: 'x-mac-gurmukhi',     // smGurmukhi
    11: 'x-mac-gujarati',     // smGujarati
    12: 'x-mac-oriya',        // smOriya
    13: 'x-mac-bengali',      // smBengali
    14: 'x-mac-tamil',        // smTamil
    15: 'x-mac-telugu',       // smTelugu
    16: 'x-mac-kannada',      // smKannada
    17: 'x-mac-malayalam',    // smMalayalam
    18: 'x-mac-sinhalese',    // smSinhalese
    19: 'x-mac-burmese',      // smBurmese
    20: 'x-mac-khmer',        // smKhmer
    21: 'x-mac-thai',         // smThai
    22: 'x-mac-lao',          // smLao
    23: 'x-mac-georgian',     // smGeorgian
    24: 'x-mac-armenian',     // smArmenian
    25: 'x-mac-chinesesimp',  // smSimpChinese
    26: 'x-mac-tibetan',      // smTibetan
    27: 'x-mac-mongolian',    // smMongolian
    28: 'x-mac-ethiopic',     // smEthiopic
    29: 'x-mac-ce',           // smCentralEuroRoman
    30: 'x-mac-vietnamese',   // smVietnamese
    31: 'x-mac-extarabic'     // smExtArabic
};

// MacOS language ID → encoding. This table stores the exceptional
// cases, which override macScriptEncodings. For writing MacOS naming
// tables, we need to emit a MacOS script ID. Therefore, we cannot
// merge macScriptEncodings into macLanguageEncodings.
//
// http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/Readme.txt
const macLanguageEncodings = {
    15: 'x-mac-icelandic',    // langIcelandic
    17: 'x-mac-turkish',      // langTurkish
    18: 'x-mac-croatian',     // langCroatian
    24: 'x-mac-ce',           // langLithuanian
    25: 'x-mac-ce',           // langPolish
    26: 'x-mac-ce',           // langHungarian
    27: 'x-mac-ce',           // langEstonian
    28: 'x-mac-ce',           // langLatvian
    30: 'x-mac-icelandic',    // langFaroese
    37: 'x-mac-romanian',     // langRomanian
    38: 'x-mac-ce',           // langCzech
    39: 'x-mac-ce',           // langSlovak
    40: 'x-mac-ce',           // langSlovenian
    143: 'x-mac-inuit',       // langInuktitut
    146: 'x-mac-gaelic'       // langIrishGaelicScript
};

function getEncoding(platformID, encodingID, languageID) {
    switch (platformID) {
        case 0:  // Unicode
            return utf16;

        case 1:  // Apple Macintosh
            return macLanguageEncodings[languageID] || macScriptEncodings[encodingID];

        case 3:  // Microsoft Windows
            if (encodingID === 1 || encodingID === 10) {
                return utf16;
            }

            break;
    }

    return undefined;
}

// Parse the naming `name` table.
// FIXME: Format 1 additional fields are not supported yet.
// ltag is the content of the `ltag' table, such as ['en', 'zh-Hans', 'de-CH-1904'].
function parseNameTable(data, start, ltag) {
    const name = {};
    const p = new _parse__WEBPACK_IMPORTED_MODULE_1__.default.Parser(data, start);
    const format = p.parseUShort();
    const count = p.parseUShort();
    const stringOffset = p.offset + p.parseUShort();
    for (let i = 0; i < count; i++) {
        const platformID = p.parseUShort();
        const encodingID = p.parseUShort();
        const languageID = p.parseUShort();
        const nameID = p.parseUShort();
        const property = nameTableNames[nameID] || nameID;
        const byteLength = p.parseUShort();
        const offset = p.parseUShort();
        const language = getLanguageCode(platformID, languageID, ltag);
        const encoding = getEncoding(platformID, encodingID, languageID);
        if (encoding !== undefined && language !== undefined) {
            let text;
            if (encoding === utf16) {
                text = _types__WEBPACK_IMPORTED_MODULE_0__.decode.UTF16(data, stringOffset + offset, byteLength);
            } else {
                text = _types__WEBPACK_IMPORTED_MODULE_0__.decode.MACSTRING(data, stringOffset + offset, byteLength, encoding);
            }

            if (text) {
                let translations = name[property];
                if (translations === undefined) {
                    translations = name[property] = {};
                }

                translations[language] = text;
            }
        }
    }

    let langTagCount = 0;
    if (format === 1) {
        // FIXME: Also handle Microsoft's 'name' table 1.
        langTagCount = p.parseUShort();
    }

    return name;
}

// {23: 'foo'} → {'foo': 23}
// ['bar', 'baz'] → {'bar': 0, 'baz': 1}
function reverseDict(dict) {
    const result = {};
    for (let key in dict) {
        result[dict[key]] = parseInt(key);
    }

    return result;
}

function makeNameRecord(platformID, encodingID, languageID, nameID, length, offset) {
    return new _table__WEBPACK_IMPORTED_MODULE_2__.default.Record('NameRecord', [
        {name: 'platformID', type: 'USHORT', value: platformID},
        {name: 'encodingID', type: 'USHORT', value: encodingID},
        {name: 'languageID', type: 'USHORT', value: languageID},
        {name: 'nameID', type: 'USHORT', value: nameID},
        {name: 'length', type: 'USHORT', value: length},
        {name: 'offset', type: 'USHORT', value: offset}
    ]);
}

// Finds the position of needle in haystack, or -1 if not there.
// Like String.indexOf(), but for arrays.
function findSubArray(needle, haystack) {
    const needleLength = needle.length;
    const limit = haystack.length - needleLength + 1;

    loop:
    for (let pos = 0; pos < limit; pos++) {
        for (; pos < limit; pos++) {
            for (let k = 0; k < needleLength; k++) {
                if (haystack[pos + k] !== needle[k]) {
                    continue loop;
                }
            }

            return pos;
        }
    }

    return -1;
}

function addStringToPool(s, pool) {
    let offset = findSubArray(s, pool);
    if (offset < 0) {
        offset = pool.length;
        let i = 0;
        const len = s.length;
        for (; i < len; ++i) {
            pool.push(s[i]);
        }

    }

    return offset;
}

function makeNameTable(names, ltag) {
    let nameID;
    const nameIDs = [];

    const namesWithNumericKeys = {};
    const nameTableIds = reverseDict(nameTableNames);
    for (let key in names) {
        let id = nameTableIds[key];
        if (id === undefined) {
            id = key;
        }

        nameID = parseInt(id);

        if (isNaN(nameID)) {
            throw new Error('Name table entry "' + key + '" does not exist, see nameTableNames for complete list.');
        }

        namesWithNumericKeys[nameID] = names[key];
        nameIDs.push(nameID);
    }

    const macLanguageIds = reverseDict(macLanguages);
    const windowsLanguageIds = reverseDict(windowsLanguages);

    const nameRecords = [];
    const stringPool = [];

    for (let i = 0; i < nameIDs.length; i++) {
        nameID = nameIDs[i];
        const translations = namesWithNumericKeys[nameID];
        for (let lang in translations) {
            const text = translations[lang];

            // For MacOS, we try to emit the name in the form that was introduced
            // in the initial version of the TrueType spec (in the late 1980s).
            // However, this can fail for various reasons: the requested BCP 47
            // language code might not have an old-style Mac equivalent;
            // we might not have a codec for the needed character encoding;
            // or the name might contain characters that cannot be expressed
            // in the old-style Macintosh encoding. In case of failure, we emit
            // the name in a more modern fashion (Unicode encoding with BCP 47
            // language tags) that is recognized by MacOS 10.5, released in 2009.
            // If fonts were only read by operating systems, we could simply
            // emit all names in the modern form; this would be much easier.
            // However, there are many applications and libraries that read
            // 'name' tables directly, and these will usually only recognize
            // the ancient form (silently skipping the unrecognized names).
            let macPlatform = 1;  // Macintosh
            let macLanguage = macLanguageIds[lang];
            let macScript = macLanguageToScript[macLanguage];
            const macEncoding = getEncoding(macPlatform, macScript, macLanguage);
            let macName = _types__WEBPACK_IMPORTED_MODULE_0__.encode.MACSTRING(text, macEncoding);
            if (macName === undefined) {
                macPlatform = 0;  // Unicode
                macLanguage = ltag.indexOf(lang);
                if (macLanguage < 0) {
                    macLanguage = ltag.length;
                    ltag.push(lang);
                }

                macScript = 4;  // Unicode 2.0 and later
                macName = _types__WEBPACK_IMPORTED_MODULE_0__.encode.UTF16(text);
            }

            const macNameOffset = addStringToPool(macName, stringPool);
            nameRecords.push(makeNameRecord(macPlatform, macScript, macLanguage,
                                            nameID, macName.length, macNameOffset));

            const winLanguage = windowsLanguageIds[lang];
            if (winLanguage !== undefined) {
                const winName = _types__WEBPACK_IMPORTED_MODULE_0__.encode.UTF16(text);
                const winNameOffset = addStringToPool(winName, stringPool);
                nameRecords.push(makeNameRecord(3, 1, winLanguage,
                                                nameID, winName.length, winNameOffset));
            }
        }
    }

    nameRecords.sort(function(a, b) {
        return ((a.platformID - b.platformID) ||
                (a.encodingID - b.encodingID) ||
                (a.languageID - b.languageID) ||
                (a.nameID - b.nameID));
    });

    const t = new _table__WEBPACK_IMPORTED_MODULE_2__.default.Table('name', [
        {name: 'format', type: 'USHORT', value: 0},
        {name: 'count', type: 'USHORT', value: nameRecords.length},
        {name: 'stringOffset', type: 'USHORT', value: 6 + nameRecords.length * 12}
    ]);

    for (let r = 0; r < nameRecords.length; r++) {
        t.fields.push({name: 'record_' + r, type: 'RECORD', value: nameRecords[r]});
    }

    t.fields.push({name: 'strings', type: 'LITERAL', value: stringPool});
    return t;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ parse: parseNameTable, make: makeNameTable });


/***/ }),

/***/ "./node_modules/opentype.js/src/tables/os2.js":
/*!****************************************************!*\
  !*** ./node_modules/opentype.js/src/tables/os2.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../parse */ "./node_modules/opentype.js/src/parse.js");
/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../table */ "./node_modules/opentype.js/src/table.js");
// The `OS/2` table contains metrics required in OpenType fonts.
// https://www.microsoft.com/typography/OTSPEC/os2.htm




const unicodeRanges = [
    {begin: 0x0000, end: 0x007F}, // Basic Latin
    {begin: 0x0080, end: 0x00FF}, // Latin-1 Supplement
    {begin: 0x0100, end: 0x017F}, // Latin Extended-A
    {begin: 0x0180, end: 0x024F}, // Latin Extended-B
    {begin: 0x0250, end: 0x02AF}, // IPA Extensions
    {begin: 0x02B0, end: 0x02FF}, // Spacing Modifier Letters
    {begin: 0x0300, end: 0x036F}, // Combining Diacritical Marks
    {begin: 0x0370, end: 0x03FF}, // Greek and Coptic
    {begin: 0x2C80, end: 0x2CFF}, // Coptic
    {begin: 0x0400, end: 0x04FF}, // Cyrillic
    {begin: 0x0530, end: 0x058F}, // Armenian
    {begin: 0x0590, end: 0x05FF}, // Hebrew
    {begin: 0xA500, end: 0xA63F}, // Vai
    {begin: 0x0600, end: 0x06FF}, // Arabic
    {begin: 0x07C0, end: 0x07FF}, // NKo
    {begin: 0x0900, end: 0x097F}, // Devanagari
    {begin: 0x0980, end: 0x09FF}, // Bengali
    {begin: 0x0A00, end: 0x0A7F}, // Gurmukhi
    {begin: 0x0A80, end: 0x0AFF}, // Gujarati
    {begin: 0x0B00, end: 0x0B7F}, // Oriya
    {begin: 0x0B80, end: 0x0BFF}, // Tamil
    {begin: 0x0C00, end: 0x0C7F}, // Telugu
    {begin: 0x0C80, end: 0x0CFF}, // Kannada
    {begin: 0x0D00, end: 0x0D7F}, // Malayalam
    {begin: 0x0E00, end: 0x0E7F}, // Thai
    {begin: 0x0E80, end: 0x0EFF}, // Lao
    {begin: 0x10A0, end: 0x10FF}, // Georgian
    {begin: 0x1B00, end: 0x1B7F}, // Balinese
    {begin: 0x1100, end: 0x11FF}, // Hangul Jamo
    {begin: 0x1E00, end: 0x1EFF}, // Latin Extended Additional
    {begin: 0x1F00, end: 0x1FFF}, // Greek Extended
    {begin: 0x2000, end: 0x206F}, // General Punctuation
    {begin: 0x2070, end: 0x209F}, // Superscripts And Subscripts
    {begin: 0x20A0, end: 0x20CF}, // Currency Symbol
    {begin: 0x20D0, end: 0x20FF}, // Combining Diacritical Marks For Symbols
    {begin: 0x2100, end: 0x214F}, // Letterlike Symbols
    {begin: 0x2150, end: 0x218F}, // Number Forms
    {begin: 0x2190, end: 0x21FF}, // Arrows
    {begin: 0x2200, end: 0x22FF}, // Mathematical Operators
    {begin: 0x2300, end: 0x23FF}, // Miscellaneous Technical
    {begin: 0x2400, end: 0x243F}, // Control Pictures
    {begin: 0x2440, end: 0x245F}, // Optical Character Recognition
    {begin: 0x2460, end: 0x24FF}, // Enclosed Alphanumerics
    {begin: 0x2500, end: 0x257F}, // Box Drawing
    {begin: 0x2580, end: 0x259F}, // Block Elements
    {begin: 0x25A0, end: 0x25FF}, // Geometric Shapes
    {begin: 0x2600, end: 0x26FF}, // Miscellaneous Symbols
    {begin: 0x2700, end: 0x27BF}, // Dingbats
    {begin: 0x3000, end: 0x303F}, // CJK Symbols And Punctuation
    {begin: 0x3040, end: 0x309F}, // Hiragana
    {begin: 0x30A0, end: 0x30FF}, // Katakana
    {begin: 0x3100, end: 0x312F}, // Bopomofo
    {begin: 0x3130, end: 0x318F}, // Hangul Compatibility Jamo
    {begin: 0xA840, end: 0xA87F}, // Phags-pa
    {begin: 0x3200, end: 0x32FF}, // Enclosed CJK Letters And Months
    {begin: 0x3300, end: 0x33FF}, // CJK Compatibility
    {begin: 0xAC00, end: 0xD7AF}, // Hangul Syllables
    {begin: 0xD800, end: 0xDFFF}, // Non-Plane 0 *
    {begin: 0x10900, end: 0x1091F}, // Phoenicia
    {begin: 0x4E00, end: 0x9FFF}, // CJK Unified Ideographs
    {begin: 0xE000, end: 0xF8FF}, // Private Use Area (plane 0)
    {begin: 0x31C0, end: 0x31EF}, // CJK Strokes
    {begin: 0xFB00, end: 0xFB4F}, // Alphabetic Presentation Forms
    {begin: 0xFB50, end: 0xFDFF}, // Arabic Presentation Forms-A
    {begin: 0xFE20, end: 0xFE2F}, // Combining Half Marks
    {begin: 0xFE10, end: 0xFE1F}, // Vertical Forms
    {begin: 0xFE50, end: 0xFE6F}, // Small Form Variants
    {begin: 0xFE70, end: 0xFEFF}, // Arabic Presentation Forms-B
    {begin: 0xFF00, end: 0xFFEF}, // Halfwidth And Fullwidth Forms
    {begin: 0xFFF0, end: 0xFFFF}, // Specials
    {begin: 0x0F00, end: 0x0FFF}, // Tibetan
    {begin: 0x0700, end: 0x074F}, // Syriac
    {begin: 0x0780, end: 0x07BF}, // Thaana
    {begin: 0x0D80, end: 0x0DFF}, // Sinhala
    {begin: 0x1000, end: 0x109F}, // Myanmar
    {begin: 0x1200, end: 0x137F}, // Ethiopic
    {begin: 0x13A0, end: 0x13FF}, // Cherokee
    {begin: 0x1400, end: 0x167F}, // Unified Canadian Aboriginal Syllabics
    {begin: 0x1680, end: 0x169F}, // Ogham
    {begin: 0x16A0, end: 0x16FF}, // Runic
    {begin: 0x1780, end: 0x17FF}, // Khmer
    {begin: 0x1800, end: 0x18AF}, // Mongolian
    {begin: 0x2800, end: 0x28FF}, // Braille Patterns
    {begin: 0xA000, end: 0xA48F}, // Yi Syllables
    {begin: 0x1700, end: 0x171F}, // Tagalog
    {begin: 0x10300, end: 0x1032F}, // Old Italic
    {begin: 0x10330, end: 0x1034F}, // Gothic
    {begin: 0x10400, end: 0x1044F}, // Deseret
    {begin: 0x1D000, end: 0x1D0FF}, // Byzantine Musical Symbols
    {begin: 0x1D400, end: 0x1D7FF}, // Mathematical Alphanumeric Symbols
    {begin: 0xFF000, end: 0xFFFFD}, // Private Use (plane 15)
    {begin: 0xFE00, end: 0xFE0F}, // Variation Selectors
    {begin: 0xE0000, end: 0xE007F}, // Tags
    {begin: 0x1900, end: 0x194F}, // Limbu
    {begin: 0x1950, end: 0x197F}, // Tai Le
    {begin: 0x1980, end: 0x19DF}, // New Tai Lue
    {begin: 0x1A00, end: 0x1A1F}, // Buginese
    {begin: 0x2C00, end: 0x2C5F}, // Glagolitic
    {begin: 0x2D30, end: 0x2D7F}, // Tifinagh
    {begin: 0x4DC0, end: 0x4DFF}, // Yijing Hexagram Symbols
    {begin: 0xA800, end: 0xA82F}, // Syloti Nagri
    {begin: 0x10000, end: 0x1007F}, // Linear B Syllabary
    {begin: 0x10140, end: 0x1018F}, // Ancient Greek Numbers
    {begin: 0x10380, end: 0x1039F}, // Ugaritic
    {begin: 0x103A0, end: 0x103DF}, // Old Persian
    {begin: 0x10450, end: 0x1047F}, // Shavian
    {begin: 0x10480, end: 0x104AF}, // Osmanya
    {begin: 0x10800, end: 0x1083F}, // Cypriot Syllabary
    {begin: 0x10A00, end: 0x10A5F}, // Kharoshthi
    {begin: 0x1D300, end: 0x1D35F}, // Tai Xuan Jing Symbols
    {begin: 0x12000, end: 0x123FF}, // Cuneiform
    {begin: 0x1D360, end: 0x1D37F}, // Counting Rod Numerals
    {begin: 0x1B80, end: 0x1BBF}, // Sundanese
    {begin: 0x1C00, end: 0x1C4F}, // Lepcha
    {begin: 0x1C50, end: 0x1C7F}, // Ol Chiki
    {begin: 0xA880, end: 0xA8DF}, // Saurashtra
    {begin: 0xA900, end: 0xA92F}, // Kayah Li
    {begin: 0xA930, end: 0xA95F}, // Rejang
    {begin: 0xAA00, end: 0xAA5F}, // Cham
    {begin: 0x10190, end: 0x101CF}, // Ancient Symbols
    {begin: 0x101D0, end: 0x101FF}, // Phaistos Disc
    {begin: 0x102A0, end: 0x102DF}, // Carian
    {begin: 0x1F030, end: 0x1F09F}  // Domino Tiles
];

function getUnicodeRange(unicode) {
    for (let i = 0; i < unicodeRanges.length; i += 1) {
        const range = unicodeRanges[i];
        if (unicode >= range.begin && unicode < range.end) {
            return i;
        }
    }

    return -1;
}

// Parse the OS/2 and Windows metrics `OS/2` table
function parseOS2Table(data, start) {
    const os2 = {};
    const p = new _parse__WEBPACK_IMPORTED_MODULE_0__.default.Parser(data, start);
    os2.version = p.parseUShort();
    os2.xAvgCharWidth = p.parseShort();
    os2.usWeightClass = p.parseUShort();
    os2.usWidthClass = p.parseUShort();
    os2.fsType = p.parseUShort();
    os2.ySubscriptXSize = p.parseShort();
    os2.ySubscriptYSize = p.parseShort();
    os2.ySubscriptXOffset = p.parseShort();
    os2.ySubscriptYOffset = p.parseShort();
    os2.ySuperscriptXSize = p.parseShort();
    os2.ySuperscriptYSize = p.parseShort();
    os2.ySuperscriptXOffset = p.parseShort();
    os2.ySuperscriptYOffset = p.parseShort();
    os2.yStrikeoutSize = p.parseShort();
    os2.yStrikeoutPosition = p.parseShort();
    os2.sFamilyClass = p.parseShort();
    os2.panose = [];
    for (let i = 0; i < 10; i++) {
        os2.panose[i] = p.parseByte();
    }

    os2.ulUnicodeRange1 = p.parseULong();
    os2.ulUnicodeRange2 = p.parseULong();
    os2.ulUnicodeRange3 = p.parseULong();
    os2.ulUnicodeRange4 = p.parseULong();
    os2.achVendID = String.fromCharCode(p.parseByte(), p.parseByte(), p.parseByte(), p.parseByte());
    os2.fsSelection = p.parseUShort();
    os2.usFirstCharIndex = p.parseUShort();
    os2.usLastCharIndex = p.parseUShort();
    os2.sTypoAscender = p.parseShort();
    os2.sTypoDescender = p.parseShort();
    os2.sTypoLineGap = p.parseShort();
    os2.usWinAscent = p.parseUShort();
    os2.usWinDescent = p.parseUShort();
    if (os2.version >= 1) {
        os2.ulCodePageRange1 = p.parseULong();
        os2.ulCodePageRange2 = p.parseULong();
    }

    if (os2.version >= 2) {
        os2.sxHeight = p.parseShort();
        os2.sCapHeight = p.parseShort();
        os2.usDefaultChar = p.parseUShort();
        os2.usBreakChar = p.parseUShort();
        os2.usMaxContent = p.parseUShort();
    }

    return os2;
}

function makeOS2Table(options) {
    return new _table__WEBPACK_IMPORTED_MODULE_1__.default.Table('OS/2', [
        {name: 'version', type: 'USHORT', value: 0x0003},
        {name: 'xAvgCharWidth', type: 'SHORT', value: 0},
        {name: 'usWeightClass', type: 'USHORT', value: 0},
        {name: 'usWidthClass', type: 'USHORT', value: 0},
        {name: 'fsType', type: 'USHORT', value: 0},
        {name: 'ySubscriptXSize', type: 'SHORT', value: 650},
        {name: 'ySubscriptYSize', type: 'SHORT', value: 699},
        {name: 'ySubscriptXOffset', type: 'SHORT', value: 0},
        {name: 'ySubscriptYOffset', type: 'SHORT', value: 140},
        {name: 'ySuperscriptXSize', type: 'SHORT', value: 650},
        {name: 'ySuperscriptYSize', type: 'SHORT', value: 699},
        {name: 'ySuperscriptXOffset', type: 'SHORT', value: 0},
        {name: 'ySuperscriptYOffset', type: 'SHORT', value: 479},
        {name: 'yStrikeoutSize', type: 'SHORT', value: 49},
        {name: 'yStrikeoutPosition', type: 'SHORT', value: 258},
        {name: 'sFamilyClass', type: 'SHORT', value: 0},
        {name: 'bFamilyType', type: 'BYTE', value: 0},
        {name: 'bSerifStyle', type: 'BYTE', value: 0},
        {name: 'bWeight', type: 'BYTE', value: 0},
        {name: 'bProportion', type: 'BYTE', value: 0},
        {name: 'bContrast', type: 'BYTE', value: 0},
        {name: 'bStrokeVariation', type: 'BYTE', value: 0},
        {name: 'bArmStyle', type: 'BYTE', value: 0},
        {name: 'bLetterform', type: 'BYTE', value: 0},
        {name: 'bMidline', type: 'BYTE', value: 0},
        {name: 'bXHeight', type: 'BYTE', value: 0},
        {name: 'ulUnicodeRange1', type: 'ULONG', value: 0},
        {name: 'ulUnicodeRange2', type: 'ULONG', value: 0},
        {name: 'ulUnicodeRange3', type: 'ULONG', value: 0},
        {name: 'ulUnicodeRange4', type: 'ULONG', value: 0},
        {name: 'achVendID', type: 'CHARARRAY', value: 'XXXX'},
        {name: 'fsSelection', type: 'USHORT', value: 0},
        {name: 'usFirstCharIndex', type: 'USHORT', value: 0},
        {name: 'usLastCharIndex', type: 'USHORT', value: 0},
        {name: 'sTypoAscender', type: 'SHORT', value: 0},
        {name: 'sTypoDescender', type: 'SHORT', value: 0},
        {name: 'sTypoLineGap', type: 'SHORT', value: 0},
        {name: 'usWinAscent', type: 'USHORT', value: 0},
        {name: 'usWinDescent', type: 'USHORT', value: 0},
        {name: 'ulCodePageRange1', type: 'ULONG', value: 0},
        {name: 'ulCodePageRange2', type: 'ULONG', value: 0},
        {name: 'sxHeight', type: 'SHORT', value: 0},
        {name: 'sCapHeight', type: 'SHORT', value: 0},
        {name: 'usDefaultChar', type: 'USHORT', value: 0},
        {name: 'usBreakChar', type: 'USHORT', value: 0},
        {name: 'usMaxContext', type: 'USHORT', value: 0}
    ], options);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ parse: parseOS2Table, make: makeOS2Table, unicodeRanges, getUnicodeRange });


/***/ }),

/***/ "./node_modules/opentype.js/src/tables/post.js":
/*!*****************************************************!*\
  !*** ./node_modules/opentype.js/src/tables/post.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _encoding__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../encoding */ "./node_modules/opentype.js/src/encoding.js");
/* harmony import */ var _parse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../parse */ "./node_modules/opentype.js/src/parse.js");
/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../table */ "./node_modules/opentype.js/src/table.js");
// The `post` table stores additional PostScript information, such as glyph names.
// https://www.microsoft.com/typography/OTSPEC/post.htm





// Parse the PostScript `post` table
function parsePostTable(data, start) {
    const post = {};
    const p = new _parse__WEBPACK_IMPORTED_MODULE_1__.default.Parser(data, start);
    post.version = p.parseVersion();
    post.italicAngle = p.parseFixed();
    post.underlinePosition = p.parseShort();
    post.underlineThickness = p.parseShort();
    post.isFixedPitch = p.parseULong();
    post.minMemType42 = p.parseULong();
    post.maxMemType42 = p.parseULong();
    post.minMemType1 = p.parseULong();
    post.maxMemType1 = p.parseULong();
    switch (post.version) {
        case 1:
            post.names = _encoding__WEBPACK_IMPORTED_MODULE_0__.standardNames.slice();
            break;
        case 2:
            post.numberOfGlyphs = p.parseUShort();
            post.glyphNameIndex = new Array(post.numberOfGlyphs);
            for (let i = 0; i < post.numberOfGlyphs; i++) {
                post.glyphNameIndex[i] = p.parseUShort();
            }

            post.names = [];
            for (let i = 0; i < post.numberOfGlyphs; i++) {
                if (post.glyphNameIndex[i] >= _encoding__WEBPACK_IMPORTED_MODULE_0__.standardNames.length) {
                    const nameLength = p.parseChar();
                    post.names.push(p.parseString(nameLength));
                }
            }

            break;
        case 2.5:
            post.numberOfGlyphs = p.parseUShort();
            post.offset = new Array(post.numberOfGlyphs);
            for (let i = 0; i < post.numberOfGlyphs; i++) {
                post.offset[i] = p.parseChar();
            }

            break;
    }
    return post;
}

function makePostTable() {
    return new _table__WEBPACK_IMPORTED_MODULE_2__.default.Table('post', [
        {name: 'version', type: 'FIXED', value: 0x00030000},
        {name: 'italicAngle', type: 'FIXED', value: 0},
        {name: 'underlinePosition', type: 'FWORD', value: 0},
        {name: 'underlineThickness', type: 'FWORD', value: 0},
        {name: 'isFixedPitch', type: 'ULONG', value: 0},
        {name: 'minMemType42', type: 'ULONG', value: 0},
        {name: 'maxMemType42', type: 'ULONG', value: 0},
        {name: 'minMemType1', type: 'ULONG', value: 0},
        {name: 'maxMemType1', type: 'ULONG', value: 0}
    ]);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ parse: parsePostTable, make: makePostTable });


/***/ }),

/***/ "./node_modules/opentype.js/src/tables/sfnt.js":
/*!*****************************************************!*\
  !*** ./node_modules/opentype.js/src/tables/sfnt.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../check */ "./node_modules/opentype.js/src/check.js");
/* harmony import */ var _table__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../table */ "./node_modules/opentype.js/src/table.js");
/* harmony import */ var _cmap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./cmap */ "./node_modules/opentype.js/src/tables/cmap.js");
/* harmony import */ var _cff__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./cff */ "./node_modules/opentype.js/src/tables/cff.js");
/* harmony import */ var _head__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./head */ "./node_modules/opentype.js/src/tables/head.js");
/* harmony import */ var _hhea__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hhea */ "./node_modules/opentype.js/src/tables/hhea.js");
/* harmony import */ var _hmtx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./hmtx */ "./node_modules/opentype.js/src/tables/hmtx.js");
/* harmony import */ var _ltag__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ltag */ "./node_modules/opentype.js/src/tables/ltag.js");
/* harmony import */ var _maxp__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./maxp */ "./node_modules/opentype.js/src/tables/maxp.js");
/* harmony import */ var _name__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./name */ "./node_modules/opentype.js/src/tables/name.js");
/* harmony import */ var _os2__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./os2 */ "./node_modules/opentype.js/src/tables/os2.js");
/* harmony import */ var _post__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./post */ "./node_modules/opentype.js/src/tables/post.js");
/* harmony import */ var _gsub__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./gsub */ "./node_modules/opentype.js/src/tables/gsub.js");
/* harmony import */ var _meta__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./meta */ "./node_modules/opentype.js/src/tables/meta.js");
// The `sfnt` wrapper provides organization for the tables in the font.
// It is the top-level data structure in a font.
// https://www.microsoft.com/typography/OTSPEC/otff.htm
// Recommendations for creating OpenType Fonts:
// http://www.microsoft.com/typography/otspec140/recom.htm

















function log2(v) {
    return Math.log(v) / Math.log(2) | 0;
}

function computeCheckSum(bytes) {
    while (bytes.length % 4 !== 0) {
        bytes.push(0);
    }

    let sum = 0;
    for (let i = 0; i < bytes.length; i += 4) {
        sum += (bytes[i] << 24) +
            (bytes[i + 1] << 16) +
            (bytes[i + 2] << 8) +
            (bytes[i + 3]);
    }

    sum %= Math.pow(2, 32);
    return sum;
}

function makeTableRecord(tag, checkSum, offset, length) {
    return new _table__WEBPACK_IMPORTED_MODULE_1__.default.Record('Table Record', [
        {name: 'tag', type: 'TAG', value: tag !== undefined ? tag : ''},
        {name: 'checkSum', type: 'ULONG', value: checkSum !== undefined ? checkSum : 0},
        {name: 'offset', type: 'ULONG', value: offset !== undefined ? offset : 0},
        {name: 'length', type: 'ULONG', value: length !== undefined ? length : 0}
    ]);
}

function makeSfntTable(tables) {
    const sfnt = new _table__WEBPACK_IMPORTED_MODULE_1__.default.Table('sfnt', [
        {name: 'version', type: 'TAG', value: 'OTTO'},
        {name: 'numTables', type: 'USHORT', value: 0},
        {name: 'searchRange', type: 'USHORT', value: 0},
        {name: 'entrySelector', type: 'USHORT', value: 0},
        {name: 'rangeShift', type: 'USHORT', value: 0}
    ]);
    sfnt.tables = tables;
    sfnt.numTables = tables.length;
    const highestPowerOf2 = Math.pow(2, log2(sfnt.numTables));
    sfnt.searchRange = 16 * highestPowerOf2;
    sfnt.entrySelector = log2(highestPowerOf2);
    sfnt.rangeShift = sfnt.numTables * 16 - sfnt.searchRange;

    const recordFields = [];
    const tableFields = [];

    let offset = sfnt.sizeOf() + (makeTableRecord().sizeOf() * sfnt.numTables);
    while (offset % 4 !== 0) {
        offset += 1;
        tableFields.push({name: 'padding', type: 'BYTE', value: 0});
    }

    for (let i = 0; i < tables.length; i += 1) {
        const t = tables[i];
        _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(t.tableName.length === 4, 'Table name' + t.tableName + ' is invalid.');
        const tableLength = t.sizeOf();
        const tableRecord = makeTableRecord(t.tableName, computeCheckSum(t.encode()), offset, tableLength);
        recordFields.push({name: tableRecord.tag + ' Table Record', type: 'RECORD', value: tableRecord});
        tableFields.push({name: t.tableName + ' table', type: 'RECORD', value: t});
        offset += tableLength;
        _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(!isNaN(offset), 'Something went wrong calculating the offset.');
        while (offset % 4 !== 0) {
            offset += 1;
            tableFields.push({name: 'padding', type: 'BYTE', value: 0});
        }
    }

    // Table records need to be sorted alphabetically.
    recordFields.sort(function(r1, r2) {
        if (r1.value.tag > r2.value.tag) {
            return 1;
        } else {
            return -1;
        }
    });

    sfnt.fields = sfnt.fields.concat(recordFields);
    sfnt.fields = sfnt.fields.concat(tableFields);
    return sfnt;
}

// Get the metrics for a character. If the string has more than one character
// this function returns metrics for the first available character.
// You can provide optional fallback metrics if no characters are available.
function metricsForChar(font, chars, notFoundMetrics) {
    for (let i = 0; i < chars.length; i += 1) {
        const glyphIndex = font.charToGlyphIndex(chars[i]);
        if (glyphIndex > 0) {
            const glyph = font.glyphs.get(glyphIndex);
            return glyph.getMetrics();
        }
    }

    return notFoundMetrics;
}

function average(vs) {
    let sum = 0;
    for (let i = 0; i < vs.length; i += 1) {
        sum += vs[i];
    }

    return sum / vs.length;
}

// Convert the font object to a SFNT data structure.
// This structure contains all the necessary tables and metadata to create a binary OTF file.
function fontToSfntTable(font) {
    const xMins = [];
    const yMins = [];
    const xMaxs = [];
    const yMaxs = [];
    const advanceWidths = [];
    const leftSideBearings = [];
    const rightSideBearings = [];
    let firstCharIndex;
    let lastCharIndex = 0;
    let ulUnicodeRange1 = 0;
    let ulUnicodeRange2 = 0;
    let ulUnicodeRange3 = 0;
    let ulUnicodeRange4 = 0;

    for (let i = 0; i < font.glyphs.length; i += 1) {
        const glyph = font.glyphs.get(i);
        const unicode = glyph.unicode | 0;

        if (isNaN(glyph.advanceWidth)) {
            throw new Error('Glyph ' + glyph.name + ' (' + i + '): advanceWidth is not a number.');
        }

        if (firstCharIndex > unicode || firstCharIndex === undefined) {
            // ignore .notdef char
            if (unicode > 0) {
                firstCharIndex = unicode;
            }
        }

        if (lastCharIndex < unicode) {
            lastCharIndex = unicode;
        }

        const position = _os2__WEBPACK_IMPORTED_MODULE_10__.default.getUnicodeRange(unicode);
        if (position < 32) {
            ulUnicodeRange1 |= 1 << position;
        } else if (position < 64) {
            ulUnicodeRange2 |= 1 << position - 32;
        } else if (position < 96) {
            ulUnicodeRange3 |= 1 << position - 64;
        } else if (position < 123) {
            ulUnicodeRange4 |= 1 << position - 96;
        } else {
            throw new Error('Unicode ranges bits > 123 are reserved for internal usage');
        }
        // Skip non-important characters.
        if (glyph.name === '.notdef') continue;
        const metrics = glyph.getMetrics();
        xMins.push(metrics.xMin);
        yMins.push(metrics.yMin);
        xMaxs.push(metrics.xMax);
        yMaxs.push(metrics.yMax);
        leftSideBearings.push(metrics.leftSideBearing);
        rightSideBearings.push(metrics.rightSideBearing);
        advanceWidths.push(glyph.advanceWidth);
    }

    const globals = {
        xMin: Math.min.apply(null, xMins),
        yMin: Math.min.apply(null, yMins),
        xMax: Math.max.apply(null, xMaxs),
        yMax: Math.max.apply(null, yMaxs),
        advanceWidthMax: Math.max.apply(null, advanceWidths),
        advanceWidthAvg: average(advanceWidths),
        minLeftSideBearing: Math.min.apply(null, leftSideBearings),
        maxLeftSideBearing: Math.max.apply(null, leftSideBearings),
        minRightSideBearing: Math.min.apply(null, rightSideBearings)
    };
    globals.ascender = font.ascender;
    globals.descender = font.descender;

    const headTable = _head__WEBPACK_IMPORTED_MODULE_4__.default.make({
        flags: 3, // 00000011 (baseline for font at y=0; left sidebearing point at x=0)
        unitsPerEm: font.unitsPerEm,
        xMin: globals.xMin,
        yMin: globals.yMin,
        xMax: globals.xMax,
        yMax: globals.yMax,
        lowestRecPPEM: 3,
        createdTimestamp: font.createdTimestamp
    });

    const hheaTable = _hhea__WEBPACK_IMPORTED_MODULE_5__.default.make({
        ascender: globals.ascender,
        descender: globals.descender,
        advanceWidthMax: globals.advanceWidthMax,
        minLeftSideBearing: globals.minLeftSideBearing,
        minRightSideBearing: globals.minRightSideBearing,
        xMaxExtent: globals.maxLeftSideBearing + (globals.xMax - globals.xMin),
        numberOfHMetrics: font.glyphs.length
    });

    const maxpTable = _maxp__WEBPACK_IMPORTED_MODULE_8__.default.make(font.glyphs.length);

    const os2Table = _os2__WEBPACK_IMPORTED_MODULE_10__.default.make({
        xAvgCharWidth: Math.round(globals.advanceWidthAvg),
        usWeightClass: font.tables.os2.usWeightClass,
        usWidthClass: font.tables.os2.usWidthClass,
        usFirstCharIndex: firstCharIndex,
        usLastCharIndex: lastCharIndex,
        ulUnicodeRange1: ulUnicodeRange1,
        ulUnicodeRange2: ulUnicodeRange2,
        ulUnicodeRange3: ulUnicodeRange3,
        ulUnicodeRange4: ulUnicodeRange4,
        fsSelection: font.tables.os2.fsSelection, // REGULAR
        // See http://typophile.com/node/13081 for more info on vertical metrics.
        // We get metrics for typical characters (such as "x" for xHeight).
        // We provide some fallback characters if characters are unavailable: their
        // ordering was chosen experimentally.
        sTypoAscender: globals.ascender,
        sTypoDescender: globals.descender,
        sTypoLineGap: 0,
        usWinAscent: globals.yMax,
        usWinDescent: Math.abs(globals.yMin),
        ulCodePageRange1: 1, // FIXME: hard-code Latin 1 support for now
        sxHeight: metricsForChar(font, 'xyvw', {yMax: Math.round(globals.ascender / 2)}).yMax,
        sCapHeight: metricsForChar(font, 'HIKLEFJMNTZBDPRAGOQSUVWXY', globals).yMax,
        usDefaultChar: font.hasChar(' ') ? 32 : 0, // Use space as the default character, if available.
        usBreakChar: font.hasChar(' ') ? 32 : 0 // Use space as the break character, if available.
    });

    const hmtxTable = _hmtx__WEBPACK_IMPORTED_MODULE_6__.default.make(font.glyphs);
    const cmapTable = _cmap__WEBPACK_IMPORTED_MODULE_2__.default.make(font.glyphs);

    const englishFamilyName = font.getEnglishName('fontFamily');
    const englishStyleName = font.getEnglishName('fontSubfamily');
    const englishFullName = englishFamilyName + ' ' + englishStyleName;
    let postScriptName = font.getEnglishName('postScriptName');
    if (!postScriptName) {
        postScriptName = englishFamilyName.replace(/\s/g, '') + '-' + englishStyleName;
    }

    const names = {};
    for (let n in font.names) {
        names[n] = font.names[n];
    }

    if (!names.uniqueID) {
        names.uniqueID = {en: font.getEnglishName('manufacturer') + ':' + englishFullName};
    }

    if (!names.postScriptName) {
        names.postScriptName = {en: postScriptName};
    }

    if (!names.preferredFamily) {
        names.preferredFamily = font.names.fontFamily;
    }

    if (!names.preferredSubfamily) {
        names.preferredSubfamily = font.names.fontSubfamily;
    }

    const languageTags = [];
    const nameTable = _name__WEBPACK_IMPORTED_MODULE_9__.default.make(names, languageTags);
    const ltagTable = (languageTags.length > 0 ? _ltag__WEBPACK_IMPORTED_MODULE_7__.default.make(languageTags) : undefined);

    const postTable = _post__WEBPACK_IMPORTED_MODULE_11__.default.make();
    const cffTable = _cff__WEBPACK_IMPORTED_MODULE_3__.default.make(font.glyphs, {
        version: font.getEnglishName('version'),
        fullName: englishFullName,
        familyName: englishFamilyName,
        weightName: englishStyleName,
        postScriptName: postScriptName,
        unitsPerEm: font.unitsPerEm,
        fontBBox: [0, globals.yMin, globals.ascender, globals.advanceWidthMax]
    });

    const metaTable = (font.metas && Object.keys(font.metas).length > 0) ? _meta__WEBPACK_IMPORTED_MODULE_13__.default.make(font.metas) : undefined;

    // The order does not matter because makeSfntTable() will sort them.
    const tables = [headTable, hheaTable, maxpTable, os2Table, nameTable, cmapTable, postTable, cffTable, hmtxTable];
    if (ltagTable) {
        tables.push(ltagTable);
    }
    // Optional tables
    if (font.tables.gsub) {
        tables.push(_gsub__WEBPACK_IMPORTED_MODULE_12__.default.make(font.tables.gsub));
    }
    if (metaTable) {
        tables.push(metaTable);
    }

    const sfntTable = makeSfntTable(tables);

    // Compute the font's checkSum and store it in head.checkSumAdjustment.
    const bytes = sfntTable.encode();
    const checkSum = computeCheckSum(bytes);
    const tableFields = sfntTable.fields;
    let checkSumAdjusted = false;
    for (let i = 0; i < tableFields.length; i += 1) {
        if (tableFields[i].name === 'head table') {
            tableFields[i].value.checkSumAdjustment = 0xB1B0AFBA - checkSum;
            checkSumAdjusted = true;
            break;
        }
    }

    if (!checkSumAdjusted) {
        throw new Error('Could not find head table with checkSum to adjust.');
    }

    return sfntTable;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ make: makeSfntTable, fontToTable: fontToSfntTable, computeCheckSum });


/***/ }),

/***/ "./node_modules/opentype.js/src/types.js":
/*!***********************************************!*\
  !*** ./node_modules/opentype.js/src/types.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "decode": () => (/* binding */ decode),
/* harmony export */   "encode": () => (/* binding */ encode),
/* harmony export */   "sizeOf": () => (/* binding */ sizeOf)
/* harmony export */ });
/* harmony import */ var _check__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./check */ "./node_modules/opentype.js/src/check.js");
// Data types used in the OpenType font file.
// All OpenType fonts use Motorola-style byte ordering (Big Endian)



const LIMIT16 = 32768; // The limit at which a 16-bit number switches signs == 2^15
const LIMIT32 = 2147483648; // The limit at which a 32-bit number switches signs == 2 ^ 31

/**
 * @exports opentype.decode
 * @class
 */
const decode = {};
/**
 * @exports opentype.encode
 * @class
 */
const encode = {};
/**
 * @exports opentype.sizeOf
 * @class
 */
const sizeOf = {};

// Return a function that always returns the same value.
function constant(v) {
    return function() {
        return v;
    };
}

// OpenType data types //////////////////////////////////////////////////////

/**
 * Convert an 8-bit unsigned integer to a list of 1 byte.
 * @param {number}
 * @returns {Array}
 */
encode.BYTE = function(v) {
    _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(v >= 0 && v <= 255, 'Byte value should be between 0 and 255.');
    return [v];
};
/**
 * @constant
 * @type {number}
 */
sizeOf.BYTE = constant(1);

/**
 * Convert a 8-bit signed integer to a list of 1 byte.
 * @param {string}
 * @returns {Array}
 */
encode.CHAR = function(v) {
    return [v.charCodeAt(0)];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.CHAR = constant(1);

/**
 * Convert an ASCII string to a list of bytes.
 * @param {string}
 * @returns {Array}
 */
encode.CHARARRAY = function(v) {
    const b = [];
    for (let i = 0; i < v.length; i += 1) {
        b[i] = v.charCodeAt(i);
    }

    return b;
};

/**
 * @param {Array}
 * @returns {number}
 */
sizeOf.CHARARRAY = function(v) {
    return v.length;
};

/**
 * Convert a 16-bit unsigned integer to a list of 2 bytes.
 * @param {number}
 * @returns {Array}
 */
encode.USHORT = function(v) {
    return [(v >> 8) & 0xFF, v & 0xFF];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.USHORT = constant(2);

/**
 * Convert a 16-bit signed integer to a list of 2 bytes.
 * @param {number}
 * @returns {Array}
 */
encode.SHORT = function(v) {
    // Two's complement
    if (v >= LIMIT16) {
        v = -(2 * LIMIT16 - v);
    }

    return [(v >> 8) & 0xFF, v & 0xFF];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.SHORT = constant(2);

/**
 * Convert a 24-bit unsigned integer to a list of 3 bytes.
 * @param {number}
 * @returns {Array}
 */
encode.UINT24 = function(v) {
    return [(v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.UINT24 = constant(3);

/**
 * Convert a 32-bit unsigned integer to a list of 4 bytes.
 * @param {number}
 * @returns {Array}
 */
encode.ULONG = function(v) {
    return [(v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.ULONG = constant(4);

/**
 * Convert a 32-bit unsigned integer to a list of 4 bytes.
 * @param {number}
 * @returns {Array}
 */
encode.LONG = function(v) {
    // Two's complement
    if (v >= LIMIT32) {
        v = -(2 * LIMIT32 - v);
    }

    return [(v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.LONG = constant(4);

encode.FIXED = encode.ULONG;
sizeOf.FIXED = sizeOf.ULONG;

encode.FWORD = encode.SHORT;
sizeOf.FWORD = sizeOf.SHORT;

encode.UFWORD = encode.USHORT;
sizeOf.UFWORD = sizeOf.USHORT;

/**
 * Convert a 32-bit Apple Mac timestamp integer to a list of 8 bytes, 64-bit timestamp.
 * @param {number}
 * @returns {Array}
 */
encode.LONGDATETIME = function(v) {
    return [0, 0, 0, 0, (v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.LONGDATETIME = constant(8);

/**
 * Convert a 4-char tag to a list of 4 bytes.
 * @param {string}
 * @returns {Array}
 */
encode.TAG = function(v) {
    _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(v.length === 4, 'Tag should be exactly 4 ASCII characters.');
    return [v.charCodeAt(0),
            v.charCodeAt(1),
            v.charCodeAt(2),
            v.charCodeAt(3)];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.TAG = constant(4);

// CFF data types ///////////////////////////////////////////////////////////

encode.Card8 = encode.BYTE;
sizeOf.Card8 = sizeOf.BYTE;

encode.Card16 = encode.USHORT;
sizeOf.Card16 = sizeOf.USHORT;

encode.OffSize = encode.BYTE;
sizeOf.OffSize = sizeOf.BYTE;

encode.SID = encode.USHORT;
sizeOf.SID = sizeOf.USHORT;

// Convert a numeric operand or charstring number to a variable-size list of bytes.
/**
 * Convert a numeric operand or charstring number to a variable-size list of bytes.
 * @param {number}
 * @returns {Array}
 */
encode.NUMBER = function(v) {
    if (v >= -107 && v <= 107) {
        return [v + 139];
    } else if (v >= 108 && v <= 1131) {
        v = v - 108;
        return [(v >> 8) + 247, v & 0xFF];
    } else if (v >= -1131 && v <= -108) {
        v = -v - 108;
        return [(v >> 8) + 251, v & 0xFF];
    } else if (v >= -32768 && v <= 32767) {
        return encode.NUMBER16(v);
    } else {
        return encode.NUMBER32(v);
    }
};

/**
 * @param {number}
 * @returns {number}
 */
sizeOf.NUMBER = function(v) {
    return encode.NUMBER(v).length;
};

/**
 * Convert a signed number between -32768 and +32767 to a three-byte value.
 * This ensures we always use three bytes, but is not the most compact format.
 * @param {number}
 * @returns {Array}
 */
encode.NUMBER16 = function(v) {
    return [28, (v >> 8) & 0xFF, v & 0xFF];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.NUMBER16 = constant(3);

/**
 * Convert a signed number between -(2^31) and +(2^31-1) to a five-byte value.
 * This is useful if you want to be sure you always use four bytes,
 * at the expense of wasting a few bytes for smaller numbers.
 * @param {number}
 * @returns {Array}
 */
encode.NUMBER32 = function(v) {
    return [29, (v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
};

/**
 * @constant
 * @type {number}
 */
sizeOf.NUMBER32 = constant(5);

/**
 * @param {number}
 * @returns {Array}
 */
encode.REAL = function(v) {
    let value = v.toString();

    // Some numbers use an epsilon to encode the value. (e.g. JavaScript will store 0.0000001 as 1e-7)
    // This code converts it back to a number without the epsilon.
    const m = /\.(\d*?)(?:9{5,20}|0{5,20})\d{0,2}(?:e(.+)|$)/.exec(value);
    if (m) {
        const epsilon = parseFloat('1e' + ((m[2] ? +m[2] : 0) + m[1].length));
        value = (Math.round(v * epsilon) / epsilon).toString();
    }

    let nibbles = '';
    for (let i = 0, ii = value.length; i < ii; i += 1) {
        const c = value[i];
        if (c === 'e') {
            nibbles += value[++i] === '-' ? 'c' : 'b';
        } else if (c === '.') {
            nibbles += 'a';
        } else if (c === '-') {
            nibbles += 'e';
        } else {
            nibbles += c;
        }
    }

    nibbles += (nibbles.length & 1) ? 'f' : 'ff';
    const out = [30];
    for (let i = 0, ii = nibbles.length; i < ii; i += 2) {
        out.push(parseInt(nibbles.substr(i, 2), 16));
    }

    return out;
};

/**
 * @param {number}
 * @returns {number}
 */
sizeOf.REAL = function(v) {
    return encode.REAL(v).length;
};

encode.NAME = encode.CHARARRAY;
sizeOf.NAME = sizeOf.CHARARRAY;

encode.STRING = encode.CHARARRAY;
sizeOf.STRING = sizeOf.CHARARRAY;

/**
 * @param {DataView} data
 * @param {number} offset
 * @param {number} numBytes
 * @returns {string}
 */
decode.UTF8 = function(data, offset, numBytes) {
    const codePoints = [];
    const numChars = numBytes;
    for (let j = 0; j < numChars; j++, offset += 1) {
        codePoints[j] = data.getUint8(offset);
    }

    return String.fromCharCode.apply(null, codePoints);
};

/**
 * @param {DataView} data
 * @param {number} offset
 * @param {number} numBytes
 * @returns {string}
 */
decode.UTF16 = function(data, offset, numBytes) {
    const codePoints = [];
    const numChars = numBytes / 2;
    for (let j = 0; j < numChars; j++, offset += 2) {
        codePoints[j] = data.getUint16(offset);
    }

    return String.fromCharCode.apply(null, codePoints);
};

/**
 * Convert a JavaScript string to UTF16-BE.
 * @param {string}
 * @returns {Array}
 */
encode.UTF16 = function(v) {
    const b = [];
    for (let i = 0; i < v.length; i += 1) {
        const codepoint = v.charCodeAt(i);
        b[b.length] = (codepoint >> 8) & 0xFF;
        b[b.length] = codepoint & 0xFF;
    }

    return b;
};

/**
 * @param {string}
 * @returns {number}
 */
sizeOf.UTF16 = function(v) {
    return v.length * 2;
};

// Data for converting old eight-bit Macintosh encodings to Unicode.
// This representation is optimized for decoding; encoding is slower
// and needs more memory. The assumption is that all opentype.js users
// want to open fonts, but saving a font will be comparatively rare
// so it can be more expensive. Keyed by IANA character set name.
//
// Python script for generating these strings:
//
//     s = u''.join([chr(c).decode('mac_greek') for c in range(128, 256)])
//     print(s.encode('utf-8'))
/**
 * @private
 */
const eightBitMacEncodings = {
    'x-mac-croatian':  // Python: 'mac_croatian'
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø' +
    '¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊©⁄€‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ',
    'x-mac-cyrillic':  // Python: 'mac_cyrillic'
    'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°Ґ£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµґЈЄєЇїЉљЊњ' +
    'јЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю',
    'x-mac-gaelic': // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/GAELIC.TXT
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØḂ±≤≥ḃĊċḊḋḞḟĠġṀæø' +
    'ṁṖṗɼƒſṠ«»… ÀÃÕŒœ–—“”‘’ṡẛÿŸṪ€‹›Ŷŷṫ·Ỳỳ⁊ÂÊÁËÈÍÎÏÌÓÔ♣ÒÚÛÙıÝýŴŵẄẅẀẁẂẃ',
    'x-mac-greek':  // Python: 'mac_greek'
    'Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦€ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩ' +
    'άΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ\u00AD',
    'x-mac-icelandic':  // Python: 'mac_iceland'
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
    '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
    'x-mac-inuit': // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/INUIT.TXT
    'ᐃᐄᐅᐆᐊᐋᐱᐲᐳᐴᐸᐹᑉᑎᑏᑐᑑᑕᑖᑦᑭᑮᑯᑰᑲᑳᒃᒋᒌᒍᒎᒐᒑ°ᒡᒥᒦ•¶ᒧ®©™ᒨᒪᒫᒻᓂᓃᓄᓅᓇᓈᓐᓯᓰᓱᓲᓴᓵᔅᓕᓖᓗ' +
    'ᓘᓚᓛᓪᔨᔩᔪᔫᔭ… ᔮᔾᕕᕖᕗ–—“”‘’ᕘᕙᕚᕝᕆᕇᕈᕉᕋᕌᕐᕿᖀᖁᖂᖃᖄᖅᖏᖐᖑᖒᖓᖔᖕᙱᙲᙳᙴᙵᙶᖖᖠᖡᖢᖣᖤᖥᖦᕼŁł',
    'x-mac-ce':  // Python: 'mac_latin2'
    'ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅ' +
    'ņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ',
    macintosh:  // Python: 'mac_roman'
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
    '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
    'x-mac-romanian':  // Python: 'mac_romanian'
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂȘ∞±≤≥¥µ∂∑∏π∫ªºΩăș' +
    '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›Țț‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
    'x-mac-turkish':  // Python: 'mac_turkish'
    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
    '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙˆ˜¯˘˙˚¸˝˛ˇ'
};

/**
 * Decodes an old-style Macintosh string. Returns either a Unicode JavaScript
 * string, or 'undefined' if the encoding is unsupported. For example, we do
 * not support Chinese, Japanese or Korean because these would need large
 * mapping tables.
 * @param {DataView} dataView
 * @param {number} offset
 * @param {number} dataLength
 * @param {string} encoding
 * @returns {string}
 */
decode.MACSTRING = function(dataView, offset, dataLength, encoding) {
    const table = eightBitMacEncodings[encoding];
    if (table === undefined) {
        return undefined;
    }

    let result = '';
    for (let i = 0; i < dataLength; i++) {
        const c = dataView.getUint8(offset + i);
        // In all eight-bit Mac encodings, the characters 0x00..0x7F are
        // mapped to U+0000..U+007F; we only need to look up the others.
        if (c <= 0x7F) {
            result += String.fromCharCode(c);
        } else {
            result += table[c & 0x7F];
        }
    }

    return result;
};

// Helper function for encode.MACSTRING. Returns a dictionary for mapping
// Unicode character codes to their 8-bit MacOS equivalent. This table
// is not exactly a super cheap data structure, but we do not care because
// encoding Macintosh strings is only rarely needed in typical applications.
const macEncodingTableCache = typeof WeakMap === 'function' && new WeakMap();
let macEncodingCacheKeys;
const getMacEncodingTable = function (encoding) {
    // Since we use encoding as a cache key for WeakMap, it has to be
    // a String object and not a literal. And at least on NodeJS 2.10.1,
    // WeakMap requires that the same String instance is passed for cache hits.
    if (!macEncodingCacheKeys) {
        macEncodingCacheKeys = {};
        for (let e in eightBitMacEncodings) {
            /*jshint -W053 */  // Suppress "Do not use String as a constructor."
            macEncodingCacheKeys[e] = new String(e);
        }
    }

    const cacheKey = macEncodingCacheKeys[encoding];
    if (cacheKey === undefined) {
        return undefined;
    }

    // We can't do "if (cache.has(key)) {return cache.get(key)}" here:
    // since garbage collection may run at any time, it could also kick in
    // between the calls to cache.has() and cache.get(). In that case,
    // we would return 'undefined' even though we do support the encoding.
    if (macEncodingTableCache) {
        const cachedTable = macEncodingTableCache.get(cacheKey);
        if (cachedTable !== undefined) {
            return cachedTable;
        }
    }

    const decodingTable = eightBitMacEncodings[encoding];
    if (decodingTable === undefined) {
        return undefined;
    }

    const encodingTable = {};
    for (let i = 0; i < decodingTable.length; i++) {
        encodingTable[decodingTable.charCodeAt(i)] = i + 0x80;
    }

    if (macEncodingTableCache) {
        macEncodingTableCache.set(cacheKey, encodingTable);
    }

    return encodingTable;
};

/**
 * Encodes an old-style Macintosh string. Returns a byte array upon success.
 * If the requested encoding is unsupported, or if the input string contains
 * a character that cannot be expressed in the encoding, the function returns
 * 'undefined'.
 * @param {string} str
 * @param {string} encoding
 * @returns {Array}
 */
encode.MACSTRING = function(str, encoding) {
    const table = getMacEncodingTable(encoding);
    if (table === undefined) {
        return undefined;
    }

    const result = [];
    for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);

        // In all eight-bit Mac encodings, the characters 0x00..0x7F are
        // mapped to U+0000..U+007F; we only need to look up the others.
        if (c >= 0x80) {
            c = table[c];
            if (c === undefined) {
                // str contains a Unicode character that cannot be encoded
                // in the requested encoding.
                return undefined;
            }
        }
        result[i] = c;
        // result.push(c);
    }

    return result;
};

/**
 * @param {string} str
 * @param {string} encoding
 * @returns {number}
 */
sizeOf.MACSTRING = function(str, encoding) {
    const b = encode.MACSTRING(str, encoding);
    if (b !== undefined) {
        return b.length;
    } else {
        return 0;
    }
};

// Helper for encode.VARDELTAS
function isByteEncodable(value) {
    return value >= -128 && value <= 127;
}

// Helper for encode.VARDELTAS
function encodeVarDeltaRunAsZeroes(deltas, pos, result) {
    let runLength = 0;
    const numDeltas = deltas.length;
    while (pos < numDeltas && runLength < 64 && deltas[pos] === 0) {
        ++pos;
        ++runLength;
    }
    result.push(0x80 | (runLength - 1));
    return pos;
}

// Helper for encode.VARDELTAS
function encodeVarDeltaRunAsBytes(deltas, offset, result) {
    let runLength = 0;
    const numDeltas = deltas.length;
    let pos = offset;
    while (pos < numDeltas && runLength < 64) {
        const value = deltas[pos];
        if (!isByteEncodable(value)) {
            break;
        }

        // Within a byte-encoded run of deltas, a single zero is best
        // stored literally as 0x00 value. However, if we have two or
        // more zeroes in a sequence, it is better to start a new run.
        // Fore example, the sequence of deltas [15, 15, 0, 15, 15]
        // becomes 6 bytes (04 0F 0F 00 0F 0F) when storing the zero
        // within the current run, but 7 bytes (01 0F 0F 80 01 0F 0F)
        // when starting a new run.
        if (value === 0 && pos + 1 < numDeltas && deltas[pos + 1] === 0) {
            break;
        }

        ++pos;
        ++runLength;
    }
    result.push(runLength - 1);
    for (let i = offset; i < pos; ++i) {
        result.push((deltas[i] + 256) & 0xff);
    }
    return pos;
}

// Helper for encode.VARDELTAS
function encodeVarDeltaRunAsWords(deltas, offset, result) {
    let runLength = 0;
    const numDeltas = deltas.length;
    let pos = offset;
    while (pos < numDeltas && runLength < 64) {
        const value = deltas[pos];

        // Within a word-encoded run of deltas, it is easiest to start
        // a new run (with a different encoding) whenever we encounter
        // a zero value. For example, the sequence [0x6666, 0, 0x7777]
        // needs 7 bytes when storing the zero inside the current run
        // (42 66 66 00 00 77 77), and equally 7 bytes when starting a
        // new run (40 66 66 80 40 77 77).
        if (value === 0) {
            break;
        }

        // Within a word-encoded run of deltas, a single value in the
        // range (-128..127) should be encoded within the current run
        // because it is more compact. For example, the sequence
        // [0x6666, 2, 0x7777] becomes 7 bytes when storing the value
        // literally (42 66 66 00 02 77 77), but 8 bytes when starting
        // a new run (40 66 66 00 02 40 77 77).
        if (isByteEncodable(value) && pos + 1 < numDeltas && isByteEncodable(deltas[pos + 1])) {
            break;
        }

        ++pos;
        ++runLength;
    }
    result.push(0x40 | (runLength - 1));
    for (let i = offset; i < pos; ++i) {
        const val = deltas[i];
        result.push(((val + 0x10000) >> 8) & 0xff, (val + 0x100) & 0xff);
    }
    return pos;
}

/**
 * Encode a list of variation adjustment deltas.
 *
 * Variation adjustment deltas are used in ‘gvar’ and ‘cvar’ tables.
 * They indicate how points (in ‘gvar’) or values (in ‘cvar’) get adjusted
 * when generating instances of variation fonts.
 *
 * @see https://www.microsoft.com/typography/otspec/gvar.htm
 * @see https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6gvar.html
 * @param {Array}
 * @return {Array}
 */
encode.VARDELTAS = function(deltas) {
    let pos = 0;
    const result = [];
    while (pos < deltas.length) {
        const value = deltas[pos];
        if (value === 0) {
            pos = encodeVarDeltaRunAsZeroes(deltas, pos, result);
        } else if (value >= -128 && value <= 127) {
            pos = encodeVarDeltaRunAsBytes(deltas, pos, result);
        } else {
            pos = encodeVarDeltaRunAsWords(deltas, pos, result);
        }
    }
    return result;
};

// Convert a list of values to a CFF INDEX structure.
// The values should be objects containing name / type / value.
/**
 * @param {Array} l
 * @returns {Array}
 */
encode.INDEX = function(l) {
    //var offset, offsets, offsetEncoder, encodedOffsets, encodedOffset, data,
    //    i, v;
    // Because we have to know which data type to use to encode the offsets,
    // we have to go through the values twice: once to encode the data and
    // calculate the offsets, then again to encode the offsets using the fitting data type.
    let offset = 1; // First offset is always 1.
    const offsets = [offset];
    const data = [];
    for (let i = 0; i < l.length; i += 1) {
        const v = encode.OBJECT(l[i]);
        Array.prototype.push.apply(data, v);
        offset += v.length;
        offsets.push(offset);
    }

    if (data.length === 0) {
        return [0, 0];
    }

    const encodedOffsets = [];
    const offSize = (1 + Math.floor(Math.log(offset) / Math.log(2)) / 8) | 0;
    const offsetEncoder = [undefined, encode.BYTE, encode.USHORT, encode.UINT24, encode.ULONG][offSize];
    for (let i = 0; i < offsets.length; i += 1) {
        const encodedOffset = offsetEncoder(offsets[i]);
        Array.prototype.push.apply(encodedOffsets, encodedOffset);
    }

    return Array.prototype.concat(encode.Card16(l.length),
                           encode.OffSize(offSize),
                           encodedOffsets,
                           data);
};

/**
 * @param {Array}
 * @returns {number}
 */
sizeOf.INDEX = function(v) {
    return encode.INDEX(v).length;
};

/**
 * Convert an object to a CFF DICT structure.
 * The keys should be numeric.
 * The values should be objects containing name / type / value.
 * @param {Object} m
 * @returns {Array}
 */
encode.DICT = function(m) {
    let d = [];
    const keys = Object.keys(m);
    const length = keys.length;

    for (let i = 0; i < length; i += 1) {
        // Object.keys() return string keys, but our keys are always numeric.
        const k = parseInt(keys[i], 0);
        const v = m[k];
        // Value comes before the key.
        d = d.concat(encode.OPERAND(v.value, v.type));
        d = d.concat(encode.OPERATOR(k));
    }

    return d;
};

/**
 * @param {Object}
 * @returns {number}
 */
sizeOf.DICT = function(m) {
    return encode.DICT(m).length;
};

/**
 * @param {number}
 * @returns {Array}
 */
encode.OPERATOR = function(v) {
    if (v < 1200) {
        return [v];
    } else {
        return [12, v - 1200];
    }
};

/**
 * @param {Array} v
 * @param {string}
 * @returns {Array}
 */
encode.OPERAND = function(v, type) {
    let d = [];
    if (Array.isArray(type)) {
        for (let i = 0; i < type.length; i += 1) {
            _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(v.length === type.length, 'Not enough arguments given for type' + type);
            d = d.concat(encode.OPERAND(v[i], type[i]));
        }
    } else {
        if (type === 'SID') {
            d = d.concat(encode.NUMBER(v));
        } else if (type === 'offset') {
            // We make it easy for ourselves and always encode offsets as
            // 4 bytes. This makes offset calculation for the top dict easier.
            d = d.concat(encode.NUMBER32(v));
        } else if (type === 'number') {
            d = d.concat(encode.NUMBER(v));
        } else if (type === 'real') {
            d = d.concat(encode.REAL(v));
        } else {
            throw new Error('Unknown operand type ' + type);
            // FIXME Add support for booleans
        }
    }

    return d;
};

encode.OP = encode.BYTE;
sizeOf.OP = sizeOf.BYTE;

// memoize charstring encoding using WeakMap if available
const wmm = typeof WeakMap === 'function' && new WeakMap();

/**
 * Convert a list of CharString operations to bytes.
 * @param {Array}
 * @returns {Array}
 */
encode.CHARSTRING = function(ops) {
    // See encode.MACSTRING for why we don't do "if (wmm && wmm.has(ops))".
    if (wmm) {
        const cachedValue = wmm.get(ops);
        if (cachedValue !== undefined) {
            return cachedValue;
        }
    }

    let d = [];
    const length = ops.length;

    for (let i = 0; i < length; i += 1) {
        const op = ops[i];
        d = d.concat(encode[op.type](op.value));
    }

    if (wmm) {
        wmm.set(ops, d);
    }

    return d;
};

/**
 * @param {Array}
 * @returns {number}
 */
sizeOf.CHARSTRING = function(ops) {
    return encode.CHARSTRING(ops).length;
};

// Utility functions ////////////////////////////////////////////////////////

/**
 * Convert an object containing name / type / value to bytes.
 * @param {Object}
 * @returns {Array}
 */
encode.OBJECT = function(v) {
    const encodingFunction = encode[v.type];
    _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(encodingFunction !== undefined, 'No encoding function for type ' + v.type);
    return encodingFunction(v.value);
};

/**
 * @param {Object}
 * @returns {number}
 */
sizeOf.OBJECT = function(v) {
    const sizeOfFunction = sizeOf[v.type];
    _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(sizeOfFunction !== undefined, 'No sizeOf function for type ' + v.type);
    return sizeOfFunction(v.value);
};

/**
 * Convert a table object to bytes.
 * A table contains a list of fields containing the metadata (name, type and default value).
 * The table itself has the field values set as attributes.
 * @param {opentype.Table}
 * @returns {Array}
 */
encode.TABLE = function(table) {
    let d = [];
    const length = table.fields.length;
    const subtables = [];
    const subtableOffsets = [];

    for (let i = 0; i < length; i += 1) {
        const field = table.fields[i];
        const encodingFunction = encode[field.type];
        _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(encodingFunction !== undefined, 'No encoding function for field type ' + field.type + ' (' + field.name + ')');
        let value = table[field.name];
        if (value === undefined) {
            value = field.value;
        }

        const bytes = encodingFunction(value);

        if (field.type === 'TABLE') {
            subtableOffsets.push(d.length);
            d = d.concat([0, 0]);
            subtables.push(bytes);
        } else {
            d = d.concat(bytes);
        }
    }

    for (let i = 0; i < subtables.length; i += 1) {
        const o = subtableOffsets[i];
        const offset = d.length;
        _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(offset < 65536, 'Table ' + table.tableName + ' too big.');
        d[o] = offset >> 8;
        d[o + 1] = offset & 0xff;
        d = d.concat(subtables[i]);
    }

    return d;
};

/**
 * @param {opentype.Table}
 * @returns {number}
 */
sizeOf.TABLE = function(table) {
    let numBytes = 0;
    const length = table.fields.length;

    for (let i = 0; i < length; i += 1) {
        const field = table.fields[i];
        const sizeOfFunction = sizeOf[field.type];
        _check__WEBPACK_IMPORTED_MODULE_0__.default.argument(sizeOfFunction !== undefined, 'No sizeOf function for field type ' + field.type + ' (' + field.name + ')');
        let value = table[field.name];
        if (value === undefined) {
            value = field.value;
        }

        numBytes += sizeOfFunction(value);

        // Subtables take 2 more bytes for offsets.
        if (field.type === 'TABLE') {
            numBytes += 2;
        }
    }

    return numBytes;
};

encode.RECORD = encode.TABLE;
sizeOf.RECORD = sizeOf.TABLE;

// Merge in a list of bytes.
encode.LITERAL = function(v) {
    return v;
};

sizeOf.LITERAL = function(v) {
    return v.length;
};




/***/ }),

/***/ "./node_modules/opentype.js/src/util.js":
/*!**********************************************!*\
  !*** ./node_modules/opentype.js/src/util.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isBrowser": () => (/* binding */ isBrowser),
/* harmony export */   "isNode": () => (/* binding */ isNode),
/* harmony export */   "nodeBufferToArrayBuffer": () => (/* binding */ nodeBufferToArrayBuffer),
/* harmony export */   "arrayBufferToNodeBuffer": () => (/* binding */ arrayBufferToNodeBuffer),
/* harmony export */   "checkArgument": () => (/* binding */ checkArgument)
/* harmony export */ });
function isBrowser() {
    return typeof window !== 'undefined';
}

function isNode() {
    return typeof window === 'undefined';
}

function nodeBufferToArrayBuffer(buffer) {
    const ab = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }

    return ab;
}

function arrayBufferToNodeBuffer(ab) {
    const buffer = new Buffer(ab.byteLength);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }

    return buffer;
}

function checkArgument(expression, message) {
    if (!expression) {
        throw message;
    }
}




/***/ }),

/***/ "./node_modules/promise-stream-reader/dist/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/promise-stream-reader/dist/index.js ***!
  \**********************************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const stream_1 = __webpack_require__(/*! stream */ "?f29b");
class PromiseStreamImpl extends stream_1.Writable {
    constructor() {
        super(...arguments);
        this.offset = 0;
        this._waiters = [];
        this._closed = false;
    }
    _write(chunk, encoding, callback) {
        let readPos = 0;
        const process = () => {
            while (this._waiters.length > 0) {
                const waiter = this._waiters[0];
                if (this._buffer) {
                    const bufAvailable = this._buffer.size - this._buffer.offset;
                    if (bufAvailable + chunk.length >= waiter.size) {
                        // If the waiter doesn't actually want the data, just
                        // drop it.
                        if (waiter.skip) {
                            this._buffer = undefined;
                            waiter.resolve();
                        }
                        else {
                            // If we get here the buffer must be defined because
                            // we only drop the data if we were waiting
                            const bufToCopy = Math.min(bufAvailable, waiter.size);
                            const buf = Buffer.alloc(waiter.size);
                            this._buffer.buf.copy(buf, 0, this._buffer.offset, this._buffer.offset + bufToCopy);
                            chunk.copy(buf, bufToCopy, 0, waiter.size - bufToCopy);
                            waiter.resolve(buf);
                        }
                        this.offset += waiter.size;
                        this._waiters.shift();
                        this._buffer = undefined;
                        if (bufAvailable + chunk.length === waiter.size) {
                            // There's no more data left. Finish processing.
                            callback();
                            break;
                        }
                        else {
                            readPos += waiter.size - bufAvailable;
                        }
                    }
                    else {
                        // There's not enough data to fill the waiter. Add it to
                        // the buffer and wait.
                        if (!waiter.skip) {
                            const buf = Buffer.alloc(bufAvailable + chunk.length);
                            this._buffer.buf.copy(buf, 0, this._buffer.offset, this._buffer.size);
                            chunk.copy(buf, bufAvailable, 0, chunk.length);
                            this._buffer.buf = buf;
                        }
                        this._buffer.offset = 0;
                        this._buffer.size = bufAvailable + chunk.length;
                        // We can't do anything else with our data. Call the
                        // callback and break
                        callback();
                        break;
                    }
                }
                else {
                    if (chunk.length - readPos >= waiter.size) {
                        if (waiter.skip) {
                            waiter.resolve();
                        }
                        else {
                            waiter.resolve(chunk.slice(readPos, readPos + waiter.size));
                        }
                        this.offset += waiter.size;
                        this._waiters.shift();
                        readPos += waiter.size;
                        if (chunk.length === readPos) {
                            // There's no more data left. Finish processing.
                            callback();
                            break;
                        }
                    }
                    else {
                        // There's not enough data to fill the waiter. Add it to
                        // the buffer and wait.
                        this._buffer = {
                            buf: waiter.skip ? undefined : chunk.slice(readPos),
                            offset: 0,
                            size: chunk.length - readPos
                        };
                        readPos = chunk.length;
                        callback();
                        break;
                    }
                }
            }
            // If we made it down here and there's still data left in the chunk,
            // we need to wait for more requests to come in. Pass our processing
            // function out to the rest of the object so we can get triggered
            // when there's more work to do. Otherwise, we should clear out the
            this._processTrigger = chunk.length - readPos > 0
                ? process
                : undefined;
        };
        // Run the processing function
        process();
    }
    _destroy(err, callback) {
        this._processTrigger = undefined;
        for (const waiter of this._waiters) {
            waiter.reject(err || new Error('stream destroyed'));
        }
        this._waiters = [];
        this._closed = true;
    }
    _final(callback) {
        this._processTrigger = undefined;
        for (const waiter of this._waiters) {
            waiter.reject(new Error('not enough data in stream'));
        }
        this._waiters = [];
        this._closed = true;
    }
    read(size) {
        return new Promise((resolve, reject) => {
            if (this._closed) {
                reject(new Error('stream is closed'));
            }
            this._waiters.push({ resolve, reject, size, skip: false });
            // Flush any waiting data
            if (this._processTrigger) {
                this._processTrigger();
            }
        });
    }
    skip(size) {
        return new Promise((resolve, reject) => {
            if (this._closed) {
                reject(new Error('stream is closed'));
            }
            this._waiters.push({ resolve, reject, size, skip: true });
            // Flush any waiting data
            if (this._processTrigger) {
                this._processTrigger();
            }
        });
    }
}
function create() {
    return new PromiseStreamImpl();
}
// Use the first line for the actual export and the second to get the typings
// right for typescript. This allows both the standard require and typescript
// syntaxes simultaneously.
module.exports = Object.assign(create, { default: create });
exports.default = create;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/tiny-inflate/index.js":
/*!********************************************!*\
  !*** ./node_modules/tiny-inflate/index.js ***!
  \********************************************/
/***/ ((module) => {

var TINF_OK = 0;
var TINF_DATA_ERROR = -3;

function Tree() {
  this.table = new Uint16Array(16);   /* table of code length counts */
  this.trans = new Uint16Array(288);  /* code -> symbol translation table */
}

function Data(source, dest) {
  this.source = source;
  this.sourceIndex = 0;
  this.tag = 0;
  this.bitcount = 0;
  
  this.dest = dest;
  this.destLen = 0;
  
  this.ltree = new Tree();  /* dynamic length/symbol tree */
  this.dtree = new Tree();  /* dynamic distance tree */
}

/* --------------------------------------------------- *
 * -- uninitialized global data (static structures) -- *
 * --------------------------------------------------- */

var sltree = new Tree();
var sdtree = new Tree();

/* extra bits and base tables for length codes */
var length_bits = new Uint8Array(30);
var length_base = new Uint16Array(30);

/* extra bits and base tables for distance codes */
var dist_bits = new Uint8Array(30);
var dist_base = new Uint16Array(30);

/* special ordering of code length codes */
var clcidx = new Uint8Array([
  16, 17, 18, 0, 8, 7, 9, 6,
  10, 5, 11, 4, 12, 3, 13, 2,
  14, 1, 15
]);

/* used by tinf_decode_trees, avoids allocations every call */
var code_tree = new Tree();
var lengths = new Uint8Array(288 + 32);

/* ----------------------- *
 * -- utility functions -- *
 * ----------------------- */

/* build extra bits and base tables */
function tinf_build_bits_base(bits, base, delta, first) {
  var i, sum;

  /* build bits table */
  for (i = 0; i < delta; ++i) bits[i] = 0;
  for (i = 0; i < 30 - delta; ++i) bits[i + delta] = i / delta | 0;

  /* build base table */
  for (sum = first, i = 0; i < 30; ++i) {
    base[i] = sum;
    sum += 1 << bits[i];
  }
}

/* build the fixed huffman trees */
function tinf_build_fixed_trees(lt, dt) {
  var i;

  /* build fixed length tree */
  for (i = 0; i < 7; ++i) lt.table[i] = 0;

  lt.table[7] = 24;
  lt.table[8] = 152;
  lt.table[9] = 112;

  for (i = 0; i < 24; ++i) lt.trans[i] = 256 + i;
  for (i = 0; i < 144; ++i) lt.trans[24 + i] = i;
  for (i = 0; i < 8; ++i) lt.trans[24 + 144 + i] = 280 + i;
  for (i = 0; i < 112; ++i) lt.trans[24 + 144 + 8 + i] = 144 + i;

  /* build fixed distance tree */
  for (i = 0; i < 5; ++i) dt.table[i] = 0;

  dt.table[5] = 32;

  for (i = 0; i < 32; ++i) dt.trans[i] = i;
}

/* given an array of code lengths, build a tree */
var offs = new Uint16Array(16);

function tinf_build_tree(t, lengths, off, num) {
  var i, sum;

  /* clear code length count table */
  for (i = 0; i < 16; ++i) t.table[i] = 0;

  /* scan symbol lengths, and sum code length counts */
  for (i = 0; i < num; ++i) t.table[lengths[off + i]]++;

  t.table[0] = 0;

  /* compute offset table for distribution sort */
  for (sum = 0, i = 0; i < 16; ++i) {
    offs[i] = sum;
    sum += t.table[i];
  }

  /* create code->symbol translation table (symbols sorted by code) */
  for (i = 0; i < num; ++i) {
    if (lengths[off + i]) t.trans[offs[lengths[off + i]]++] = i;
  }
}

/* ---------------------- *
 * -- decode functions -- *
 * ---------------------- */

/* get one bit from source stream */
function tinf_getbit(d) {
  /* check if tag is empty */
  if (!d.bitcount--) {
    /* load next tag */
    d.tag = d.source[d.sourceIndex++];
    d.bitcount = 7;
  }

  /* shift bit out of tag */
  var bit = d.tag & 1;
  d.tag >>>= 1;

  return bit;
}

/* read a num bit value from a stream and add base */
function tinf_read_bits(d, num, base) {
  if (!num)
    return base;

  while (d.bitcount < 24) {
    d.tag |= d.source[d.sourceIndex++] << d.bitcount;
    d.bitcount += 8;
  }

  var val = d.tag & (0xffff >>> (16 - num));
  d.tag >>>= num;
  d.bitcount -= num;
  return val + base;
}

/* given a data stream and a tree, decode a symbol */
function tinf_decode_symbol(d, t) {
  while (d.bitcount < 24) {
    d.tag |= d.source[d.sourceIndex++] << d.bitcount;
    d.bitcount += 8;
  }
  
  var sum = 0, cur = 0, len = 0;
  var tag = d.tag;

  /* get more bits while code value is above sum */
  do {
    cur = 2 * cur + (tag & 1);
    tag >>>= 1;
    ++len;

    sum += t.table[len];
    cur -= t.table[len];
  } while (cur >= 0);
  
  d.tag = tag;
  d.bitcount -= len;

  return t.trans[sum + cur];
}

/* given a data stream, decode dynamic trees from it */
function tinf_decode_trees(d, lt, dt) {
  var hlit, hdist, hclen;
  var i, num, length;

  /* get 5 bits HLIT (257-286) */
  hlit = tinf_read_bits(d, 5, 257);

  /* get 5 bits HDIST (1-32) */
  hdist = tinf_read_bits(d, 5, 1);

  /* get 4 bits HCLEN (4-19) */
  hclen = tinf_read_bits(d, 4, 4);

  for (i = 0; i < 19; ++i) lengths[i] = 0;

  /* read code lengths for code length alphabet */
  for (i = 0; i < hclen; ++i) {
    /* get 3 bits code length (0-7) */
    var clen = tinf_read_bits(d, 3, 0);
    lengths[clcidx[i]] = clen;
  }

  /* build code length tree */
  tinf_build_tree(code_tree, lengths, 0, 19);

  /* decode code lengths for the dynamic trees */
  for (num = 0; num < hlit + hdist;) {
    var sym = tinf_decode_symbol(d, code_tree);

    switch (sym) {
      case 16:
        /* copy previous code length 3-6 times (read 2 bits) */
        var prev = lengths[num - 1];
        for (length = tinf_read_bits(d, 2, 3); length; --length) {
          lengths[num++] = prev;
        }
        break;
      case 17:
        /* repeat code length 0 for 3-10 times (read 3 bits) */
        for (length = tinf_read_bits(d, 3, 3); length; --length) {
          lengths[num++] = 0;
        }
        break;
      case 18:
        /* repeat code length 0 for 11-138 times (read 7 bits) */
        for (length = tinf_read_bits(d, 7, 11); length; --length) {
          lengths[num++] = 0;
        }
        break;
      default:
        /* values 0-15 represent the actual code lengths */
        lengths[num++] = sym;
        break;
    }
  }

  /* build dynamic trees */
  tinf_build_tree(lt, lengths, 0, hlit);
  tinf_build_tree(dt, lengths, hlit, hdist);
}

/* ----------------------------- *
 * -- block inflate functions -- *
 * ----------------------------- */

/* given a stream and two trees, inflate a block of data */
function tinf_inflate_block_data(d, lt, dt) {
  while (1) {
    var sym = tinf_decode_symbol(d, lt);

    /* check for end of block */
    if (sym === 256) {
      return TINF_OK;
    }

    if (sym < 256) {
      d.dest[d.destLen++] = sym;
    } else {
      var length, dist, offs;
      var i;

      sym -= 257;

      /* possibly get more bits from length code */
      length = tinf_read_bits(d, length_bits[sym], length_base[sym]);

      dist = tinf_decode_symbol(d, dt);

      /* possibly get more bits from distance code */
      offs = d.destLen - tinf_read_bits(d, dist_bits[dist], dist_base[dist]);

      /* copy match */
      for (i = offs; i < offs + length; ++i) {
        d.dest[d.destLen++] = d.dest[i];
      }
    }
  }
}

/* inflate an uncompressed block of data */
function tinf_inflate_uncompressed_block(d) {
  var length, invlength;
  var i;
  
  /* unread from bitbuffer */
  while (d.bitcount > 8) {
    d.sourceIndex--;
    d.bitcount -= 8;
  }

  /* get length */
  length = d.source[d.sourceIndex + 1];
  length = 256 * length + d.source[d.sourceIndex];

  /* get one's complement of length */
  invlength = d.source[d.sourceIndex + 3];
  invlength = 256 * invlength + d.source[d.sourceIndex + 2];

  /* check length */
  if (length !== (~invlength & 0x0000ffff))
    return TINF_DATA_ERROR;

  d.sourceIndex += 4;

  /* copy block */
  for (i = length; i; --i)
    d.dest[d.destLen++] = d.source[d.sourceIndex++];

  /* make sure we start next block on a byte boundary */
  d.bitcount = 0;

  return TINF_OK;
}

/* inflate stream from source to dest */
function tinf_uncompress(source, dest) {
  var d = new Data(source, dest);
  var bfinal, btype, res;

  do {
    /* read final block flag */
    bfinal = tinf_getbit(d);

    /* read block type (2 bits) */
    btype = tinf_read_bits(d, 2, 0);

    /* decompress block */
    switch (btype) {
      case 0:
        /* decompress uncompressed block */
        res = tinf_inflate_uncompressed_block(d);
        break;
      case 1:
        /* decompress block with fixed huffman trees */
        res = tinf_inflate_block_data(d, sltree, sdtree);
        break;
      case 2:
        /* decompress block with dynamic huffman trees */
        tinf_decode_trees(d, d.ltree, d.dtree);
        res = tinf_inflate_block_data(d, d.ltree, d.dtree);
        break;
      default:
        res = TINF_DATA_ERROR;
    }

    if (res !== TINF_OK)
      throw new Error('Data error');

  } while (!bfinal);

  if (d.destLen < d.dest.length) {
    if (typeof d.dest.slice === 'function')
      return d.dest.slice(0, d.destLen);
    else
      return d.dest.subarray(0, d.destLen);
  }
  
  return d.dest;
}

/* -------------------- *
 * -- initialization -- *
 * -------------------- */

/* build fixed huffman trees */
tinf_build_fixed_trees(sltree, sdtree);

/* build extra bits and base tables */
tinf_build_bits_base(length_bits, length_base, 4, 3);
tinf_build_bits_base(dist_bits, dist_base, 2, 1);

/* fix a special case */
length_bits[28] = 0;
length_base[28] = 258;

module.exports = tinf_uncompress;


/***/ }),

/***/ "./node_modules/xterm-addon-attach/lib/xterm-addon-attach.js":
/*!*******************************************************************!*\
  !*** ./node_modules/xterm-addon-attach/lib/xterm-addon-attach.js ***!
  \*******************************************************************/
/***/ ((module) => {

!function(t,e){ true?module.exports=e():0}(window,(function(){return function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(o,r,function(e){return t[e]}.bind(null,r));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.AttachAddon=void 0;var o=function(){function t(t,e){this._disposables=[],this._socket=t,this._socket.binaryType="arraybuffer",this._bidirectional=!e||!1!==e.bidirectional}return t.prototype.activate=function(t){var e=this;this._disposables.push(r(this._socket,"message",(function(e){var n=e.data;t.write("string"==typeof n?n:new Uint8Array(n))}))),this._bidirectional&&(this._disposables.push(t.onData((function(t){return e._sendData(t)}))),this._disposables.push(t.onBinary((function(t){return e._sendBinary(t)})))),this._disposables.push(r(this._socket,"close",(function(){return e.dispose()}))),this._disposables.push(r(this._socket,"error",(function(){return e.dispose()})))},t.prototype.dispose=function(){this._disposables.forEach((function(t){return t.dispose()}))},t.prototype._sendData=function(t){1===this._socket.readyState&&this._socket.send(t)},t.prototype._sendBinary=function(t){if(1===this._socket.readyState){for(var e=new Uint8Array(t.length),n=0;n<t.length;++n)e[n]=255&t.charCodeAt(n);this._socket.send(e)}},t}();function r(t,e,n){return t.addEventListener(e,n),{dispose:function(){n&&t.removeEventListener(e,n)}}}e.AttachAddon=o}])}));
//# sourceMappingURL=xterm-addon-attach.js.map

/***/ }),

/***/ "./node_modules/xterm-addon-fit/lib/xterm-addon-fit.js":
/*!*************************************************************!*\
  !*** ./node_modules/xterm-addon-fit/lib/xterm-addon-fit.js ***!
  \*************************************************************/
/***/ ((module) => {

!function(e,t){ true?module.exports=t():0}(self,(function(){return(()=>{"use strict";var e={775:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.FitAddon=void 0;var r=function(){function e(){}return e.prototype.activate=function(e){this._terminal=e},e.prototype.dispose=function(){},e.prototype.fit=function(){var e=this.proposeDimensions();if(e&&this._terminal){var t=this._terminal._core;this._terminal.rows===e.rows&&this._terminal.cols===e.cols||(t._renderService.clear(),this._terminal.resize(e.cols,e.rows))}},e.prototype.proposeDimensions=function(){if(this._terminal&&this._terminal.element&&this._terminal.element.parentElement){var e=this._terminal._core;if(0!==e._renderService.dimensions.actualCellWidth&&0!==e._renderService.dimensions.actualCellHeight){var t=window.getComputedStyle(this._terminal.element.parentElement),r=parseInt(t.getPropertyValue("height")),i=Math.max(0,parseInt(t.getPropertyValue("width"))),n=window.getComputedStyle(this._terminal.element),o=r-(parseInt(n.getPropertyValue("padding-top"))+parseInt(n.getPropertyValue("padding-bottom"))),a=i-(parseInt(n.getPropertyValue("padding-right"))+parseInt(n.getPropertyValue("padding-left")))-e.viewport.scrollBarWidth;return{cols:Math.max(2,Math.floor(a/e._renderService.dimensions.actualCellWidth)),rows:Math.max(1,Math.floor(o/e._renderService.dimensions.actualCellHeight))}}}},e}();t.FitAddon=r}},t={};return function r(i){if(t[i])return t[i].exports;var n=t[i]={exports:{}};return e[i](n,n.exports,r),n.exports}(775)})()}));
//# sourceMappingURL=xterm-addon-fit.js.map

/***/ }),

/***/ "./node_modules/xterm-addon-ligatures/lib/xterm-addon-ligatures.js":
/*!*************************************************************************!*\
  !*** ./node_modules/xterm-addon-ligatures/lib/xterm-addon-ligatures.js ***!
  \*************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*! For license information please see xterm-addon-ligatures.js.LICENSE.txt */
!function(e,t){ true?module.exports=t(__webpack_require__(/*! font-finder */ "./node_modules/font-finder/dist/index.js"),__webpack_require__(/*! font-ligatures */ "./node_modules/font-ligatures/dist/index.js")):0}(__webpack_require__.g,(function(e,t){return(()=>{"use strict";var n={871:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.LigaturesAddon=void 0;const o=n(833);t.LigaturesAddon=class{constructor(){}activate(e){o.enableLigatures(e)}dispose(){}}},109:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0});const o=n(577),r=n(779),s=n(233);let i=void 0;t.default=async function(e,t){i||(i=o.list());const n=await i;for(const o of s.default(e)){if(f.includes(o))return;if(n.hasOwnProperty(o)&&n[o].length>0)return await r.loadFile(n[o][0].path,{cacheSize:t})}};const f=["serif","sans-serif","cursive","fantasy","monospace","system-ui","emoji","math","fangsong"]},833:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.enableLigatures=void 0;const o=n(109);t.enableLigatures=function(e){let t=void 0,n=void 0,r=0,s=void 0;e.registerCharacterJoiner((i=>{const f=e.getOption("fontFamily");if(f&&(0===r||t!==f)){n=void 0,r=1,t=f;const i=t;o.default(i,1e5).then((t=>{i===e.getOption("fontFamily")&&(r=2,n=t,t&&e.refresh(0,e.getOption("rows")-1))})).catch((t=>{i===e.getOption("fontFamily")&&(r=3,n=void 0,s=t)}))}if(n&&2===r)return n.findLigatureRanges(i).map((e=>[e[0],e[1]]));if(3===r)throw s||new Error("Failure while loading font");return[]}))}},233:(e,t)=>{function n(e,t){let n="",o=!1;for(;e.offset<e.input.length;){const s=e.input[e.offset++];if(o)/[0-9a-fA-F]/.test(s)?(e.offset--,n+=r(e)):"\n"!==s&&(n+=s),o=!1;else switch(s){case t:return n;case"\\":o=!0;break;default:n+=s}}throw new Error("Unterminated string")}function o(e){let t="",n=!1;for(;e.offset<e.input.length;){const o=e.input[e.offset++];if(n)/[0-9a-fA-F]/.test(o)?(e.offset--,t+=r(e)):t+=o,n=!1;else switch(o){case"\\":n=!0;break;case",":return t;default:/\s/.test(o)?t.endsWith(" ")||(t+=" "):t+=o}}return t}function r(e){let t="";for(;e.offset<e.input.length;){const n=e.input[e.offset++];if(/\s/.test(n))return s(t);if(t.length>=6||!/[0-9a-fA-F]/.test(n))return e.offset--,s(t);t+=n}return s(t)}function s(e){return String.fromCodePoint(parseInt(e,16))}Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){if("string"!=typeof e)throw new Error("Font family must be a string");const t={input:e,offset:0},r=[];let s="";for(;t.offset<t.input.length;){const e=t.input[t.offset++];switch(e){case"'":case'"':s+=n(t,e);break;case",":r.push(s),s="";break;default:/\s/.test(e)||(t.offset--,s+=o(t),r.push(s),s="")}}return r}},577:t=>{t.exports=e},779:e=>{e.exports=t}},o={};return function e(t){if(o[t])return o[t].exports;var r=o[t]={exports:{}};return n[t](r,r.exports,e),r.exports}(871)})()}));
//# sourceMappingURL=xterm-addon-ligatures.js.map

/***/ }),

/***/ "./node_modules/xterm-addon-search/lib/xterm-addon-search.js":
/*!*******************************************************************!*\
  !*** ./node_modules/xterm-addon-search/lib/xterm-addon-search.js ***!
  \*******************************************************************/
/***/ ((module) => {

!function(e,t){ true?module.exports=t():0}(self,(function(){return(()=>{"use strict";var e={258:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.SearchAddon=void 0;var i=" ~!@#$%^&*()+`-=[]{}|;:\"',./<>?",r=function(){function e(){this._linesCacheTimeoutId=0}return e.prototype.activate=function(e){this._terminal=e},e.prototype.dispose=function(){},e.prototype.findNext=function(e,t){if(!this._terminal)throw new Error("Cannot use addon until it has been loaded");if(!e||0===e.length)return this._terminal.clearSelection(),!1;var i,r=0,n=0;if(this._terminal.hasSelection()){var s=!!t&&t.incremental;i=this._terminal.getSelectionPosition(),n=s?i.startRow:i.endRow,r=s?i.startColumn:i.endColumn}this._initLinesCache();var o={startRow:n,startCol:r},a=this._findInLine(e,o,t);if(!a)for(var l=n+1;l<this._terminal.buffer.active.baseY+this._terminal.rows&&(o.startRow=l,o.startCol=0,!(a=this._findInLine(e,o,t)));l++);if(!a&&0!==n)for(l=0;l<n&&(o.startRow=l,o.startCol=0,!(a=this._findInLine(e,o,t)));l++);return!a&&i&&(o.startRow=i.startRow,o.startCol=0,a=this._findInLine(e,o,t)),this._selectResult(a)},e.prototype.findPrevious=function(e,t){if(!this._terminal)throw new Error("Cannot use addon until it has been loaded");if(!e||0===e.length)return this._terminal.clearSelection(),!1;var i,r,n=!0,s=this._terminal.buffer.active.baseY+this._terminal.rows,o=this._terminal.cols,a=!!t&&t.incremental;this._terminal.hasSelection()&&(s=(r=this._terminal.getSelectionPosition()).startRow,o=r.startColumn),this._initLinesCache();var l={startRow:s,startCol:o};if(a?(i=this._findInLine(e,l,t,!1))&&i.row===s&&i.col===o||(r&&(l.startRow=r.endRow,l.startCol=r.endColumn),i=this._findInLine(e,l,t,!0)):i=this._findInLine(e,l,t,n),!i){l.startCol=Math.max(l.startCol,this._terminal.cols);for(var h=s-1;h>=0&&(l.startRow=h,!(i=this._findInLine(e,l,t,n)));h--);}if(!i&&s!==this._terminal.buffer.active.baseY+this._terminal.rows)for(h=this._terminal.buffer.active.baseY+this._terminal.rows;h>=s&&(l.startRow=h,!(i=this._findInLine(e,l,t,n)));h--);return!(i||!r)||this._selectResult(i)},e.prototype._initLinesCache=function(){var e=this,t=this._terminal;this._linesCache||(this._linesCache=new Array(t.buffer.active.length),this._cursorMoveListener=t.onCursorMove((function(){return e._destroyLinesCache()})),this._resizeListener=t.onResize((function(){return e._destroyLinesCache()}))),window.clearTimeout(this._linesCacheTimeoutId),this._linesCacheTimeoutId=window.setTimeout((function(){return e._destroyLinesCache()}),15e3)},e.prototype._destroyLinesCache=function(){this._linesCache=void 0,this._cursorMoveListener&&(this._cursorMoveListener.dispose(),this._cursorMoveListener=void 0),this._resizeListener&&(this._resizeListener.dispose(),this._resizeListener=void 0),this._linesCacheTimeoutId&&(window.clearTimeout(this._linesCacheTimeoutId),this._linesCacheTimeoutId=0)},e.prototype._isWholeWord=function(e,t,r){return!(0!==e&&-1===i.indexOf(t[e-1])||e+r.length!==t.length&&-1===i.indexOf(t[e+r.length]))},e.prototype._findInLine=function(e,t,i,r){void 0===i&&(i={}),void 0===r&&(r=!1);var n=this._terminal,s=t.startRow,o=t.startCol,a=n.buffer.active.getLine(s);if(a&&a.isWrapped)return r?void(t.startCol+=n.cols):(t.startRow--,t.startCol+=n.cols,this._findInLine(e,t,i));var l=this._linesCache?this._linesCache[s]:void 0;void 0===l&&(l=this._translateBufferLineToStringWithWrap(s,!0),this._linesCache&&(this._linesCache[s]=l));var h=i.caseSensitive?e:e.toLowerCase(),c=i.caseSensitive?l:l.toLowerCase(),f=-1;if(i.regex){var u=RegExp(h,"g"),d=void 0;if(r)for(;d=u.exec(c.slice(0,o));)f=u.lastIndex-d[0].length,e=d[0],u.lastIndex-=e.length-1;else(d=u.exec(c.slice(o)))&&d[0].length>0&&(f=o+(u.lastIndex-d[0].length),e=d[0])}else r?o-h.length>=0&&(f=c.lastIndexOf(h,o-h.length)):f=c.indexOf(h,o);if(f>=0){if(f>=n.cols&&(s+=Math.floor(f/n.cols),f%=n.cols),i.wholeWord&&!this._isWholeWord(f,c,e))return;var _=n.buffer.active.getLine(s);if(_)for(var v=0;v<f;v++){var p=_.getCell(v);if(!p)break;var w=p.getChars();w.length>1&&(f-=w.length-1),0===p.getWidth()&&f++}return{term:e,col:f,row:s}}},e.prototype._translateBufferLineToStringWithWrap=function(e,t){var i,r=this._terminal,n="";do{var s=r.buffer.active.getLine(e+1);i=!!s&&s.isWrapped;var o=r.buffer.active.getLine(e);if(!o)break;n+=o.translateToString(!i&&t).substring(0,r.cols),e++}while(i);return n},e.prototype._selectResult=function(e){var t=this._terminal;if(!e)return t.clearSelection(),!1;if(t.select(e.col,e.row,e.term.length),e.row>=t.buffer.active.viewportY+t.rows||e.row<t.buffer.active.viewportY){var i=e.row-t.buffer.active.viewportY;i-=Math.floor(t.rows/2),t.scrollLines(i)}return!0},e}();t.SearchAddon=r}},t={};return function i(r){if(t[r])return t[r].exports;var n=t[r]={exports:{}};return e[r](n,n.exports,i),n.exports}(258)})()}));
//# sourceMappingURL=xterm-addon-search.js.map

/***/ }),

/***/ "./node_modules/xterm-addon-serialize/lib/xterm-addon-serialize.js":
/*!*************************************************************************!*\
  !*** ./node_modules/xterm-addon-serialize/lib/xterm-addon-serialize.js ***!
  \*************************************************************************/
/***/ ((module) => {

!function(t,e){ true?module.exports=e():0}(self,(function(){return(()=>{"use strict";var t={44:function(t,e){var r,i=this&&this.__extends||(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])})(t,e)},function(t,e){function i(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)});function s(t,e){return t.getBgColorMode()===e.getBgColorMode()&&t.getBgColor()===e.getBgColor()}Object.defineProperty(e,"__esModule",{value:!0}),e.SerializeAddon=void 0;var o=function(t){function e(e,r){var i=t.call(this,e)||this;return i._buffer1=e,i._terminal=r,i._rowIndex=0,i._allRows=new Array,i._allRowSeparators=new Array,i._currentRow="",i._nullCellCount=0,i._cursorStyle=i._buffer1.getNullCell(),i._cursorStyleRow=0,i._cursorStyleCol=0,i._backgroundCell=i._buffer1.getNullCell(),i._firstRow=0,i._lastCursorRow=0,i._lastCursorCol=0,i._lastContentCursorRow=0,i._lastContentCursorCol=0,i._thisRowLastChar=i._buffer1.getNullCell(),i._thisRowLastSecondChar=i._buffer1.getNullCell(),i._nextRowFirstChar=i._buffer1.getNullCell(),i}return i(e,t),e.prototype._beforeSerialize=function(t,e,r){this._allRows=new Array(t),this._lastContentCursorRow=e,this._lastCursorRow=e,this._firstRow=e},e.prototype._rowEnd=function(t,e){var r;this._nullCellCount>0&&!s(this._cursorStyle,this._backgroundCell)&&(this._currentRow+="["+this._nullCellCount+"X");var i="";if(!e){t-this._firstRow>=this._terminal.rows&&(null===(r=this._buffer1.getLine(this._cursorStyleRow))||void 0===r||r.getCell(this._cursorStyleCol,this._backgroundCell));var o=this._buffer1.getLine(t),l=this._buffer1.getLine(t+1);if(l.isWrapped){i="";var n=o.getCell(o.length-1,this._thisRowLastChar),u=o.getCell(o.length-2,this._thisRowLastSecondChar),h=l.getCell(0,this._nextRowFirstChar),_=h.getWidth()>1,a=!1;(h.getChars()&&_?this._nullCellCount<=1:this._nullCellCount<=0)&&((n.getChars()||0===n.getWidth())&&s(n,h)&&(a=!0),_&&(u.getChars()||0===u.getWidth())&&s(n,h)&&s(u,h)&&(a=!0)),a||(i="-".repeat(this._nullCellCount+1),i+="[1D[1X",this._nullCellCount>0&&(i+="[A",i+="["+(o.length-this._nullCellCount)+"C",i+="["+this._nullCellCount+"X",i+="["+(o.length-this._nullCellCount)+"D",i+="[B"),this._lastContentCursorRow=t+1,this._lastContentCursorCol=0,this._lastCursorRow=t+1,this._lastCursorCol=0)}else i="\r\n",this._lastCursorRow=t+1,this._lastCursorCol=0}this._allRows[this._rowIndex]=this._currentRow,this._allRowSeparators[this._rowIndex++]=i,this._currentRow="",this._nullCellCount=0},e.prototype._diffStyle=function(t,e){var r,i,o=[],l=(i=e,!((r=t).getFgColorMode()===i.getFgColorMode()&&r.getFgColor()===i.getFgColor())),n=!s(t,e),u=!function(t,e){return t.isInverse()===e.isInverse()&&t.isBold()===e.isBold()&&t.isUnderline()===e.isUnderline()&&t.isBlink()===e.isBlink()&&t.isInvisible()===e.isInvisible()&&t.isItalic()===e.isItalic()&&t.isDim()===e.isDim()}(t,e);if(l||n||u)if(t.isAttributeDefault())e.isAttributeDefault()||o.push(0);else{if(l){var h=t.getFgColor();t.isFgRGB()?o.push(38,2,h>>>16&255,h>>>8&255,255&h):t.isFgPalette()?h>=16?o.push(38,5,h):o.push(8&h?90+(7&h):30+(7&h)):o.push(39)}n&&(h=t.getBgColor(),t.isBgRGB()?o.push(48,2,h>>>16&255,h>>>8&255,255&h):t.isBgPalette()?h>=16?o.push(48,5,h):o.push(8&h?100+(7&h):40+(7&h)):o.push(49)),u&&(t.isInverse()!==e.isInverse()&&o.push(t.isInverse()?7:27),t.isBold()!==e.isBold()&&o.push(t.isBold()?1:22),t.isUnderline()!==e.isUnderline()&&o.push(t.isUnderline()?4:24),t.isBlink()!==e.isBlink()&&o.push(t.isBlink()?5:25),t.isInvisible()!==e.isInvisible()&&o.push(t.isInvisible()?8:28),t.isItalic()!==e.isItalic()&&o.push(t.isItalic()?3:23),t.isDim()!==e.isDim()&&o.push(t.isDim()?2:22))}return o},e.prototype._nextCell=function(t,e,r,i){if(0!==t.getWidth()){var o=""===t.getChars(),l=this._diffStyle(t,this._cursorStyle);if(o?!s(this._cursorStyle,t):l.length>0){this._nullCellCount>0&&(s(this._cursorStyle,this._backgroundCell)||(this._currentRow+="["+this._nullCellCount+"X"),this._currentRow+="["+this._nullCellCount+"C",this._nullCellCount=0),this._lastContentCursorRow=this._lastCursorRow=r,this._lastContentCursorCol=this._lastCursorCol=i,this._currentRow+="["+l.join(";")+"m";var n=this._buffer1.getLine(r);void 0!==n&&(n.getCell(i,this._cursorStyle),this._cursorStyleRow=r,this._cursorStyleCol=i)}o?this._nullCellCount+=t.getWidth():(this._nullCellCount>0&&(s(this._cursorStyle,this._backgroundCell)||(this._currentRow+="["+this._nullCellCount+"X"),this._currentRow+="["+this._nullCellCount+"C",this._nullCellCount=0),this._currentRow+=t.getChars(),this._lastContentCursorRow=this._lastCursorRow=r,this._lastContentCursorCol=this._lastCursorCol=i+t.getWidth())}},e.prototype._serializeString=function(){var t=this._allRows.length;this._buffer1.length-this._firstRow<=this._terminal.rows&&(t=this._lastContentCursorRow+1-this._firstRow,this._lastCursorCol=this._lastContentCursorCol,this._lastCursorRow=this._lastContentCursorRow);for(var e="",r=0;r<t;r++)e+=this._allRows[r],r+1<t&&(e+=this._allRowSeparators[r]);var i,s=this._buffer1.baseY+this._buffer1.cursorY,o=this._buffer1.cursorX;return(s!==this._lastCursorRow||o!==this._lastCursorCol)&&((i=s-this._lastCursorRow)>0?e+="["+i+"B":i<0&&(e+="["+-i+"A"),function(t){t>0?e+="["+t+"C":t<0&&(e+="["+-t+"D")}(o-this._lastCursorCol)),e},e}(function(){function t(t){this._buffer=t}return t.prototype.serialize=function(t,e){var r=this._buffer.getNullCell(),i=this._buffer.getNullCell(),s=r;this._beforeSerialize(e-t,t,e);for(var o=t;o<e;o++){var l=this._buffer.getLine(o);if(l)for(var n=0;n<l.length;n++){var u=l.getCell(n,s===r?i:r);u?(this._nextCell(u,s,o,n),s=u):console.warn("Can't get cell at row="+o+", col="+n)}this._rowEnd(o,o===e-1)}return this._afterSerialize(),this._serializeString()},t.prototype._nextCell=function(t,e,r,i){},t.prototype._rowEnd=function(t,e){},t.prototype._beforeSerialize=function(t,e,r){},t.prototype._afterSerialize=function(){},t.prototype._serializeString=function(){return""},t}()),l=function(){function t(){}return t.prototype.activate=function(t){this._terminal=t},t.prototype._getString=function(t,e){var r,i,s=t.length,l=new o(t,this._terminal),n=void 0===e?s:(r=e+this._terminal.rows,0,i=s,Math.max(0,Math.min(r,i)));return l.serialize(s-n,s)},t.prototype.serialize=function(t){if(!this._terminal)throw new Error("Cannot use addon until it has been loaded");return"normal"===this._terminal.buffer.active.type?this._getString(this._terminal.buffer.active,t):this._getString(this._terminal.buffer.normal,t)+"[?1049h[H"+this._getString(this._terminal.buffer.alternate,void 0)},t.prototype.dispose=function(){},t}();e.SerializeAddon=l}},e={};return function r(i){if(e[i])return e[i].exports;var s=e[i]={exports:{}};return t[i].call(s.exports,s,s.exports,r),s.exports}(44)})()}));
//# sourceMappingURL=xterm-addon-serialize.js.map

/***/ }),

/***/ "./node_modules/xterm-addon-unicode11/lib/xterm-addon-unicode11.js":
/*!*************************************************************************!*\
  !*** ./node_modules/xterm-addon-unicode11/lib/xterm-addon-unicode11.js ***!
  \*************************************************************************/
/***/ ((module) => {

!function(e,t){ true?module.exports=t():0}(window,(function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Unicode11Addon=void 0;const o=n(1);t.Unicode11Addon=class{activate(e){e.unicode.register(new o.UnicodeV11)}dispose(){}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.UnicodeV11=void 0;const o=n(2),r=[[768,879],[1155,1161],[1425,1469],[1471,1471],[1473,1474],[1476,1477],[1479,1479],[1536,1541],[1552,1562],[1564,1564],[1611,1631],[1648,1648],[1750,1757],[1759,1764],[1767,1768],[1770,1773],[1807,1807],[1809,1809],[1840,1866],[1958,1968],[2027,2035],[2045,2045],[2070,2073],[2075,2083],[2085,2087],[2089,2093],[2137,2139],[2259,2306],[2362,2362],[2364,2364],[2369,2376],[2381,2381],[2385,2391],[2402,2403],[2433,2433],[2492,2492],[2497,2500],[2509,2509],[2530,2531],[2558,2558],[2561,2562],[2620,2620],[2625,2626],[2631,2632],[2635,2637],[2641,2641],[2672,2673],[2677,2677],[2689,2690],[2748,2748],[2753,2757],[2759,2760],[2765,2765],[2786,2787],[2810,2815],[2817,2817],[2876,2876],[2879,2879],[2881,2884],[2893,2893],[2902,2902],[2914,2915],[2946,2946],[3008,3008],[3021,3021],[3072,3072],[3076,3076],[3134,3136],[3142,3144],[3146,3149],[3157,3158],[3170,3171],[3201,3201],[3260,3260],[3263,3263],[3270,3270],[3276,3277],[3298,3299],[3328,3329],[3387,3388],[3393,3396],[3405,3405],[3426,3427],[3530,3530],[3538,3540],[3542,3542],[3633,3633],[3636,3642],[3655,3662],[3761,3761],[3764,3772],[3784,3789],[3864,3865],[3893,3893],[3895,3895],[3897,3897],[3953,3966],[3968,3972],[3974,3975],[3981,3991],[3993,4028],[4038,4038],[4141,4144],[4146,4151],[4153,4154],[4157,4158],[4184,4185],[4190,4192],[4209,4212],[4226,4226],[4229,4230],[4237,4237],[4253,4253],[4448,4607],[4957,4959],[5906,5908],[5938,5940],[5970,5971],[6002,6003],[6068,6069],[6071,6077],[6086,6086],[6089,6099],[6109,6109],[6155,6158],[6277,6278],[6313,6313],[6432,6434],[6439,6440],[6450,6450],[6457,6459],[6679,6680],[6683,6683],[6742,6742],[6744,6750],[6752,6752],[6754,6754],[6757,6764],[6771,6780],[6783,6783],[6832,6846],[6912,6915],[6964,6964],[6966,6970],[6972,6972],[6978,6978],[7019,7027],[7040,7041],[7074,7077],[7080,7081],[7083,7085],[7142,7142],[7144,7145],[7149,7149],[7151,7153],[7212,7219],[7222,7223],[7376,7378],[7380,7392],[7394,7400],[7405,7405],[7412,7412],[7416,7417],[7616,7673],[7675,7679],[8203,8207],[8234,8238],[8288,8292],[8294,8303],[8400,8432],[11503,11505],[11647,11647],[11744,11775],[12330,12333],[12441,12442],[42607,42610],[42612,42621],[42654,42655],[42736,42737],[43010,43010],[43014,43014],[43019,43019],[43045,43046],[43204,43205],[43232,43249],[43263,43263],[43302,43309],[43335,43345],[43392,43394],[43443,43443],[43446,43449],[43452,43453],[43493,43493],[43561,43566],[43569,43570],[43573,43574],[43587,43587],[43596,43596],[43644,43644],[43696,43696],[43698,43700],[43703,43704],[43710,43711],[43713,43713],[43756,43757],[43766,43766],[44005,44005],[44008,44008],[44013,44013],[64286,64286],[65024,65039],[65056,65071],[65279,65279],[65529,65531]],i=[[66045,66045],[66272,66272],[66422,66426],[68097,68099],[68101,68102],[68108,68111],[68152,68154],[68159,68159],[68325,68326],[68900,68903],[69446,69456],[69633,69633],[69688,69702],[69759,69761],[69811,69814],[69817,69818],[69821,69821],[69837,69837],[69888,69890],[69927,69931],[69933,69940],[70003,70003],[70016,70017],[70070,70078],[70089,70092],[70191,70193],[70196,70196],[70198,70199],[70206,70206],[70367,70367],[70371,70378],[70400,70401],[70459,70460],[70464,70464],[70502,70508],[70512,70516],[70712,70719],[70722,70724],[70726,70726],[70750,70750],[70835,70840],[70842,70842],[70847,70848],[70850,70851],[71090,71093],[71100,71101],[71103,71104],[71132,71133],[71219,71226],[71229,71229],[71231,71232],[71339,71339],[71341,71341],[71344,71349],[71351,71351],[71453,71455],[71458,71461],[71463,71467],[71727,71735],[71737,71738],[72148,72151],[72154,72155],[72160,72160],[72193,72202],[72243,72248],[72251,72254],[72263,72263],[72273,72278],[72281,72283],[72330,72342],[72344,72345],[72752,72758],[72760,72765],[72767,72767],[72850,72871],[72874,72880],[72882,72883],[72885,72886],[73009,73014],[73018,73018],[73020,73021],[73023,73029],[73031,73031],[73104,73105],[73109,73109],[73111,73111],[73459,73460],[78896,78904],[92912,92916],[92976,92982],[94031,94031],[94095,94098],[113821,113822],[113824,113827],[119143,119145],[119155,119170],[119173,119179],[119210,119213],[119362,119364],[121344,121398],[121403,121452],[121461,121461],[121476,121476],[121499,121503],[121505,121519],[122880,122886],[122888,122904],[122907,122913],[122915,122916],[122918,122922],[123184,123190],[123628,123631],[125136,125142],[125252,125258],[917505,917505],[917536,917631],[917760,917999]],l=[[4352,4447],[8986,8987],[9001,9002],[9193,9196],[9200,9200],[9203,9203],[9725,9726],[9748,9749],[9800,9811],[9855,9855],[9875,9875],[9889,9889],[9898,9899],[9917,9918],[9924,9925],[9934,9934],[9940,9940],[9962,9962],[9970,9971],[9973,9973],[9978,9978],[9981,9981],[9989,9989],[9994,9995],[10024,10024],[10060,10060],[10062,10062],[10067,10069],[10071,10071],[10133,10135],[10160,10160],[10175,10175],[11035,11036],[11088,11088],[11093,11093],[11904,11929],[11931,12019],[12032,12245],[12272,12283],[12288,12329],[12334,12350],[12353,12438],[12443,12543],[12549,12591],[12593,12686],[12688,12730],[12736,12771],[12784,12830],[12832,12871],[12880,19903],[19968,42124],[42128,42182],[43360,43388],[44032,55203],[63744,64255],[65040,65049],[65072,65106],[65108,65126],[65128,65131],[65281,65376],[65504,65510]],u=[[94176,94179],[94208,100343],[100352,101106],[110592,110878],[110928,110930],[110948,110951],[110960,111355],[126980,126980],[127183,127183],[127374,127374],[127377,127386],[127488,127490],[127504,127547],[127552,127560],[127568,127569],[127584,127589],[127744,127776],[127789,127797],[127799,127868],[127870,127891],[127904,127946],[127951,127955],[127968,127984],[127988,127988],[127992,128062],[128064,128064],[128066,128252],[128255,128317],[128331,128334],[128336,128359],[128378,128378],[128405,128406],[128420,128420],[128507,128591],[128640,128709],[128716,128716],[128720,128722],[128725,128725],[128747,128748],[128756,128762],[128992,129003],[129293,129393],[129395,129398],[129402,129442],[129445,129450],[129454,129482],[129485,129535],[129648,129651],[129656,129658],[129664,129666],[129680,129685],[131072,196605],[196608,262141]];let f;function c(e,t){let n,o=0,r=t.length-1;if(e<t[0][0]||e>t[r][1])return!1;for(;r>=o;)if(n=o+r>>1,e>t[n][1])o=n+1;else{if(!(e<t[n][0]))return!0;r=n-1}return!1}t.UnicodeV11=class{constructor(){if(this.version="11",!f){f=new Uint8Array(65536),o.fill(f,1),f[0]=0,o.fill(f,0,1,32),o.fill(f,0,127,160);for(let e=0;e<r.length;++e)o.fill(f,0,r[e][0],r[e][1]+1);for(let e=0;e<l.length;++e)o.fill(f,2,l[e][0],l[e][1]+1)}}wcwidth(e){return e<32?0:e<127?1:e<65536?f[e]:c(e,i)?0:c(e,u)?2:1}}},function(e,t,n){"use strict";function o(e,t,n,o){if(void 0===n&&(n=0),void 0===o&&(o=e.length),n>=e.length)return e;n=(e.length+n)%e.length,o=o>=e.length?e.length:(e.length+o)%e.length;for(var r=n;r<o;++r)e[r]=t;return e}Object.defineProperty(t,"__esModule",{value:!0}),t.concat=t.fillFallback=t.fill=void 0,t.fill=function(e,t,n,r){return e.fill?e.fill(t,n,r):o(e,t,n,r)},t.fillFallback=o,t.concat=function(e,t){var n=new e.constructor(e.length+t.length);return n.set(e),n.set(t,e.length),n}}])}));
//# sourceMappingURL=xterm-addon-unicode11.js.map

/***/ }),

/***/ "./node_modules/xterm-addon-web-links/lib/xterm-addon-web-links.js":
/*!*************************************************************************!*\
  !*** ./node_modules/xterm-addon-web-links/lib/xterm-addon-web-links.js ***!
  \*************************************************************************/
/***/ ((module) => {

!function(e,t){ true?module.exports=t():0}(window,(function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.WebLinksAddon=void 0;var r=n(1),i=new RegExp("(?:^|[^\\da-z\\.-]+)((https?:\\/\\/)((([\\da-z\\.-]+)\\.([a-z\\.]{2,6}))|((\\d{1,3}\\.){3}\\d{1,3})|(localhost))(:\\d{1,5})?((\\/[\\/\\w\\.\\-%~:+@]*)*([^:\"'\\s]))?(\\?[0-9\\w\\[\\]\\(\\)\\/\\?\\!#@$%&'*+,:;~\\=\\.\\-]*)?(#[0-9\\w\\[\\]\\(\\)\\/\\?\\!#@$%&'*+,:;~\\=\\.\\-]*)?)($|[^\\/\\w\\.\\-%]+)");function o(e,t){var n=window.open();n?(n.opener=null,n.location.href=t):console.warn("Opening link blocked as opener could not be cleared")}var a=function(){function e(e,t,n){void 0===e&&(e=o),void 0===t&&(t={}),void 0===n&&(n=!1),this._handler=e,this._options=t,this._useLinkProvider=n,this._options.matchIndex=1}return e.prototype.activate=function(e){this._terminal=e,this._useLinkProvider&&"registerLinkProvider"in this._terminal?this._linkProvider=this._terminal.registerLinkProvider(new r.WebLinkProvider(this._terminal,i,this._handler)):this._linkMatcherId=this._terminal.registerLinkMatcher(i,this._handler,this._options)},e.prototype.dispose=function(){var e;void 0!==this._linkMatcherId&&void 0!==this._terminal&&this._terminal.deregisterLinkMatcher(this._linkMatcherId),null===(e=this._linkProvider)||void 0===e||e.dispose()},e}();t.WebLinksAddon=a},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.LinkComputer=t.WebLinkProvider=void 0;var r=function(){function e(e,t,n){this._terminal=e,this._regex=t,this._handler=n}return e.prototype.provideLinks=function(e,t){t(i.computeLink(e,this._regex,this._terminal,this._handler))},e}();t.WebLinkProvider=r;var i=function(){function e(){}return e.computeLink=function(t,n,r,i){for(var o,a=new RegExp(n.source,(n.flags||"")+"g"),s=e._translateBufferLineToStringWithWrap(t-1,!1,r),u=s[0],d=s[1],l=-1,c=[];null!==(o=a.exec(u));){var f=o[1];if(!f){console.log("match found without corresponding matchIndex");break}if(l=u.indexOf(f,l+1),a.lastIndex=l+f.length,l<0)break;for(var p=l+f.length,h=d+1;p>r.cols;)p-=r.cols,h++;var v={start:{x:l+1,y:d+1},end:{x:p,y:h}};c.push({range:v,text:f,activate:i})}return c},e._translateBufferLineToStringWithWrap=function(e,t,n){var r,i,o="";do{if(!(s=n.buffer.active.getLine(e)))break;s.isWrapped&&e--,i=s.isWrapped}while(i);var a=e;do{var s,u=n.buffer.active.getLine(e+1);if(r=!!u&&u.isWrapped,!(s=n.buffer.active.getLine(e)))break;o+=s.translateToString(!r&&t).substring(0,n.cols),e++}while(r);return[o,a]},e}();t.LinkComputer=i}])}));
//# sourceMappingURL=xterm-addon-web-links.js.map

/***/ }),

/***/ "./node_modules/xterm-addon-webgl/lib/xterm-addon-webgl.js":
/*!*****************************************************************!*\
  !*** ./node_modules/xterm-addon-webgl/lib/xterm-addon-webgl.js ***!
  \*****************************************************************/
/***/ ((module) => {

!function(t,e){ true?module.exports=e():0}(self,(function(){return(()=>{"use strict";var t={965:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.GlyphRenderer=void 0;var r=i(381),o=i(310),n=i(455),s=i(259),a=i(855),l=i(147),h=10,c=h*Float32Array.BYTES_PER_ELEMENT,_=function(){function t(t,e,i,o){this._terminal=t,this._colors=e,this._gl=i,this._dimensions=o,this._activeBuffer=0,this._vertices={count:0,attributes:new Float32Array(0),attributesBuffers:[new Float32Array(0),new Float32Array(0)],selectionAttributes:new Float32Array(0)};var n=this._gl,s=r.throwIfFalsy(r.createProgram(n,"#version 300 es\nlayout (location = 0) in vec2 a_unitquad;\nlayout (location = 1) in vec2 a_cellpos;\nlayout (location = 2) in vec2 a_offset;\nlayout (location = 3) in vec2 a_size;\nlayout (location = 4) in vec2 a_texcoord;\nlayout (location = 5) in vec2 a_texsize;\n\nuniform mat4 u_projection;\nuniform vec2 u_resolution;\n\nout vec2 v_texcoord;\n\nvoid main() {\n  vec2 zeroToOne = (a_offset / u_resolution) + a_cellpos + (a_unitquad * a_size);\n  gl_Position = u_projection * vec4(zeroToOne, 0.0, 1.0);\n  v_texcoord = a_texcoord + a_unitquad * a_texsize;\n}","#version 300 es\nprecision lowp float;\n\nin vec2 v_texcoord;\n\nuniform sampler2D u_texture;\n\nout vec4 outColor;\n\nvoid main() {\n  outColor = texture(u_texture, v_texcoord);\n}"));this._program=s,this._projectionLocation=r.throwIfFalsy(n.getUniformLocation(this._program,"u_projection")),this._resolutionLocation=r.throwIfFalsy(n.getUniformLocation(this._program,"u_resolution")),this._textureLocation=r.throwIfFalsy(n.getUniformLocation(this._program,"u_texture")),this._vertexArrayObject=n.createVertexArray(),n.bindVertexArray(this._vertexArrayObject);var a=new Float32Array([0,0,1,0,0,1,1,1]),l=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,l),n.bufferData(n.ARRAY_BUFFER,a,n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,this._gl.FLOAT,!1,0,0);var h=new Uint8Array([0,1,3,0,2,3]),_=n.createBuffer();n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,_),n.bufferData(n.ELEMENT_ARRAY_BUFFER,h,n.STATIC_DRAW),this._attributesBuffer=r.throwIfFalsy(n.createBuffer()),n.bindBuffer(n.ARRAY_BUFFER,this._attributesBuffer),n.enableVertexAttribArray(2),n.vertexAttribPointer(2,2,n.FLOAT,!1,c,0),n.vertexAttribDivisor(2,1),n.enableVertexAttribArray(3),n.vertexAttribPointer(3,2,n.FLOAT,!1,c,2*Float32Array.BYTES_PER_ELEMENT),n.vertexAttribDivisor(3,1),n.enableVertexAttribArray(4),n.vertexAttribPointer(4,2,n.FLOAT,!1,c,4*Float32Array.BYTES_PER_ELEMENT),n.vertexAttribDivisor(4,1),n.enableVertexAttribArray(5),n.vertexAttribPointer(5,2,n.FLOAT,!1,c,6*Float32Array.BYTES_PER_ELEMENT),n.vertexAttribDivisor(5,1),n.enableVertexAttribArray(1),n.vertexAttribPointer(1,2,n.FLOAT,!1,c,8*Float32Array.BYTES_PER_ELEMENT),n.vertexAttribDivisor(1,1),this._atlasTexture=r.throwIfFalsy(n.createTexture()),n.bindTexture(n.TEXTURE_2D,this._atlasTexture),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,new Uint8Array([0,0,255,255])),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.enable(n.BLEND),n.blendFunc(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA),this.onResize()}return t.prototype.beginFrame=function(){return!this._atlas||this._atlas.beginFrame()},t.prototype.updateCell=function(t,e,i,r,o,n){this._updateCell(this._vertices.attributes,t,e,i,r,o,n)},t.prototype._updateCell=function(t,e,i,r,o,s,l){var c,_=(i*this._terminal.cols+e)*h;r!==a.NULL_CELL_CODE&&r!==a.WHITESPACE_CELL_CODE&&void 0!==r?this._atlas&&((c=l&&l.length>1?this._atlas.getRasterizedGlyphCombinedChar(l,o,s):this._atlas.getRasterizedGlyph(r,o,s))?(t[_]=-c.offset.x+this._dimensions.scaledCharLeft,t[_+1]=-c.offset.y+this._dimensions.scaledCharTop,t[_+2]=c.size.x/this._dimensions.scaledCanvasWidth,t[_+3]=c.size.y/this._dimensions.scaledCanvasHeight,t[_+4]=c.texturePositionClipSpace.x,t[_+5]=c.texturePositionClipSpace.y,t[_+6]=c.sizeClipSpace.x,t[_+7]=c.sizeClipSpace.y):n.fill(t,0,_,_+h-1-2)):n.fill(t,0,_,_+h-1-2)},t.prototype.updateSelection=function(t){var e=this._terminal;this._vertices.selectionAttributes=s.slice(this._vertices.attributes,0);var i=this._colors.selectionOpaque.rgba>>>8|50331648;if(t.selection.columnSelectMode)for(var r=t.selection.startCol,o=t.selection.endCol-r,n=t.selection.viewportCappedEndRow-t.selection.viewportCappedStartRow+1,a=t.selection.viewportCappedStartRow;a<t.selection.viewportCappedStartRow+n;a++)this._updateSelectionRange(r,r+o,a,t,i);else{r=t.selection.viewportStartRow===t.selection.viewportCappedStartRow?t.selection.startCol:0;var l=t.selection.viewportCappedStartRow===t.selection.viewportCappedEndRow?t.selection.endCol:e.cols;this._updateSelectionRange(r,l,t.selection.viewportCappedStartRow,t,i);var h=Math.max(t.selection.viewportCappedEndRow-t.selection.viewportCappedStartRow-1,0);for(a=t.selection.viewportCappedStartRow+1;a<=t.selection.viewportCappedStartRow+h;a++)this._updateSelectionRange(0,l,a,t,i);if(t.selection.viewportCappedStartRow!==t.selection.viewportCappedEndRow){var c=t.selection.viewportEndRow===t.selection.viewportCappedEndRow?t.selection.endCol:e.cols;this._updateSelectionRange(0,c,t.selection.viewportCappedEndRow,t,i)}}},t.prototype._updateSelectionRange=function(t,e,i,r,n){for(var s,a=this._terminal,h=i+a.buffer.active.viewportY,c=t;c<e;c++){var _=(i*this._terminal.cols+c)*o.RENDER_MODEL_INDICIES_PER_CELL,d=r.cells[_],u=r.cells[_+o.RENDER_MODEL_FG_OFFSET];if(67108864&u){var f=new l.AttributeData;switch(f.fg=u,f.bg=r.cells[_+o.RENDER_MODEL_BG_OFFSET],u&=-134217728,f.getBgColorMode()){case 16777216:case 33554432:var p=this._getColorFromAnsiIndex(f.getBgColor()).rgba;u|=p>>8&16711680|p>>8&65280|p>>8&255;case 50331648:var g=l.AttributeData.toColorRGB(f.getBgColor());u|=g[0]<<16|g[1]<<8|g[2]<<0;case 0:default:var v=this._colors.background.rgba;u|=v>>8&16711680|v>>8&65280|v>>8&255}u|=50331648}if(d&o.COMBINED_CHAR_BIT_MASK){s||(s=a.buffer.active.getLine(h));var C=s.getCell(c).getChars();this._updateCell(this._vertices.selectionAttributes,c,i,r.cells[_],n,u,C)}else this._updateCell(this._vertices.selectionAttributes,c,i,r.cells[_],n,u)}},t.prototype._getColorFromAnsiIndex=function(t){if(t>=this._colors.ansi.length)throw new Error("No color found for idx "+t);return this._colors.ansi[t]},t.prototype.onResize=function(){var t=this._terminal,e=this._gl;e.viewport(0,0,e.canvas.width,e.canvas.height);var i=t.cols*t.rows*h;if(this._vertices.count!==i){this._vertices.count=i,this._vertices.attributes=new Float32Array(i);for(var r=0;r<this._vertices.attributesBuffers.length;r++)this._vertices.attributesBuffers[r]=new Float32Array(i);for(var o=0,n=0;n<t.rows;n++)for(var s=0;s<t.cols;s++)this._vertices.attributes[o+8]=s/t.cols,this._vertices.attributes[o+9]=n/t.rows,o+=h}},t.prototype.setColors=function(){},t.prototype.render=function(t,e){if(this._atlas){var i=this._gl;i.useProgram(this._program),i.bindVertexArray(this._vertexArrayObject),this._activeBuffer=(this._activeBuffer+1)%2;for(var o=this._vertices.attributesBuffers[this._activeBuffer],n=0,s=0;s<t.lineLengths.length;s++){var a=s*this._terminal.cols*h,l=(e?this._vertices.selectionAttributes:this._vertices.attributes).subarray(a,a+t.lineLengths[s]*h);o.set(l,n),n+=l.length}i.bindBuffer(i.ARRAY_BUFFER,this._attributesBuffer),i.bufferData(i.ARRAY_BUFFER,o.subarray(0,n),i.STREAM_DRAW),this._atlas.hasCanvasChanged&&(this._atlas.hasCanvasChanged=!1,i.uniform1i(this._textureLocation,0),i.activeTexture(i.TEXTURE0+0),i.bindTexture(i.TEXTURE_2D,this._atlasTexture),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,i.RGBA,i.UNSIGNED_BYTE,this._atlas.cacheCanvas),i.generateMipmap(i.TEXTURE_2D)),i.uniformMatrix4fv(this._projectionLocation,!1,r.PROJECTION_MATRIX),i.uniform2f(this._resolutionLocation,i.canvas.width,i.canvas.height),i.drawElementsInstanced(i.TRIANGLES,6,i.UNSIGNED_BYTE,0,n/h)}},t.prototype.setAtlas=function(t){var e=this._gl;this._atlas=t,e.bindTexture(e.TEXTURE_2D,this._atlasTexture),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,t.cacheCanvas),e.generateMipmap(e.TEXTURE_2D)},t.prototype.setDimensions=function(t){this._dimensions=t},t}();e.GlyphRenderer=_},344:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.RectangleRenderer=void 0;var r=i(381),o=i(455),n=i(310),s=8*Float32Array.BYTES_PER_ELEMENT,a=function(){function t(t,e,i,o){this._terminal=t,this._colors=e,this._gl=i,this._dimensions=o,this._vertices={count:0,attributes:new Float32Array(160),selection:new Float32Array(24)};var n=this._gl;this._program=r.throwIfFalsy(r.createProgram(n,"#version 300 es\nlayout (location = 0) in vec2 a_position;\nlayout (location = 1) in vec2 a_size;\nlayout (location = 2) in vec4 a_color;\nlayout (location = 3) in vec2 a_unitquad;\n\nuniform mat4 u_projection;\nuniform vec2 u_resolution;\n\nout vec4 v_color;\n\nvoid main() {\n  vec2 zeroToOne = (a_position + (a_unitquad * a_size)) / u_resolution;\n  gl_Position = u_projection * vec4(zeroToOne, 0.0, 1.0);\n  v_color = a_color;\n}","#version 300 es\nprecision lowp float;\n\nin vec4 v_color;\n\nout vec4 outColor;\n\nvoid main() {\n  outColor = v_color;\n}")),this._resolutionLocation=r.throwIfFalsy(n.getUniformLocation(this._program,"u_resolution")),this._projectionLocation=r.throwIfFalsy(n.getUniformLocation(this._program,"u_projection")),this._vertexArrayObject=n.createVertexArray(),n.bindVertexArray(this._vertexArrayObject);var a=new Float32Array([0,0,1,0,0,1,1,1]),l=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,l),n.bufferData(n.ARRAY_BUFFER,a,n.STATIC_DRAW),n.enableVertexAttribArray(3),n.vertexAttribPointer(3,2,this._gl.FLOAT,!1,0,0);var h=new Uint8Array([0,1,3,0,2,3]),c=n.createBuffer();n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,c),n.bufferData(n.ELEMENT_ARRAY_BUFFER,h,n.STATIC_DRAW),this._attributesBuffer=r.throwIfFalsy(n.createBuffer()),n.bindBuffer(n.ARRAY_BUFFER,this._attributesBuffer),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,s,0),n.vertexAttribDivisor(0,1),n.enableVertexAttribArray(1),n.vertexAttribPointer(1,2,n.FLOAT,!1,s,2*Float32Array.BYTES_PER_ELEMENT),n.vertexAttribDivisor(1,1),n.enableVertexAttribArray(2),n.vertexAttribPointer(2,4,n.FLOAT,!1,s,4*Float32Array.BYTES_PER_ELEMENT),n.vertexAttribDivisor(2,1),this._updateCachedColors()}return t.prototype.render=function(){var t=this._gl;t.useProgram(this._program),t.bindVertexArray(this._vertexArrayObject),t.uniformMatrix4fv(this._projectionLocation,!1,r.PROJECTION_MATRIX),t.uniform2f(this._resolutionLocation,t.canvas.width,t.canvas.height),t.bindBuffer(t.ARRAY_BUFFER,this._attributesBuffer),t.bufferData(t.ARRAY_BUFFER,this._vertices.attributes,t.DYNAMIC_DRAW),t.drawElementsInstanced(this._gl.TRIANGLES,6,t.UNSIGNED_BYTE,0,this._vertices.count),t.bindBuffer(t.ARRAY_BUFFER,this._attributesBuffer),t.bufferData(t.ARRAY_BUFFER,this._vertices.selection,t.DYNAMIC_DRAW),t.drawElementsInstanced(this._gl.TRIANGLES,6,t.UNSIGNED_BYTE,0,3)},t.prototype.onResize=function(){this._updateViewportRectangle()},t.prototype.setColors=function(){this._updateCachedColors(),this._updateViewportRectangle()},t.prototype._updateCachedColors=function(){this._bgFloat=this._colorToFloat32Array(this._colors.background),this._selectionFloat=this._colorToFloat32Array(this._colors.selectionOpaque)},t.prototype._updateViewportRectangle=function(){this._addRectangleFloat(this._vertices.attributes,0,0,0,this._terminal.cols*this._dimensions.scaledCellWidth,this._terminal.rows*this._dimensions.scaledCellHeight,this._bgFloat)},t.prototype.updateSelection=function(t){var e=this._terminal;if(t.hasSelection)if(t.columnSelectMode){var i=t.startCol,r=t.endCol-i,n=t.viewportCappedEndRow-t.viewportCappedStartRow+1;this._addRectangleFloat(this._vertices.selection,0,i*this._dimensions.scaledCellWidth,t.viewportCappedStartRow*this._dimensions.scaledCellHeight,r*this._dimensions.scaledCellWidth,n*this._dimensions.scaledCellHeight,this._selectionFloat),o.fill(this._vertices.selection,0,8)}else{i=t.viewportStartRow===t.viewportCappedStartRow?t.startCol:0;var s=t.viewportCappedStartRow===t.viewportEndRow?t.endCol:e.cols;this._addRectangleFloat(this._vertices.selection,0,i*this._dimensions.scaledCellWidth,t.viewportCappedStartRow*this._dimensions.scaledCellHeight,(s-i)*this._dimensions.scaledCellWidth,this._dimensions.scaledCellHeight,this._selectionFloat);var a=Math.max(t.viewportCappedEndRow-t.viewportCappedStartRow-1,0);if(this._addRectangleFloat(this._vertices.selection,8,0,(t.viewportCappedStartRow+1)*this._dimensions.scaledCellHeight,e.cols*this._dimensions.scaledCellWidth,a*this._dimensions.scaledCellHeight,this._selectionFloat),t.viewportCappedStartRow!==t.viewportCappedEndRow){var l=t.viewportEndRow===t.viewportCappedEndRow?t.endCol:e.cols;this._addRectangleFloat(this._vertices.selection,16,0,t.viewportCappedEndRow*this._dimensions.scaledCellHeight,l*this._dimensions.scaledCellWidth,this._dimensions.scaledCellHeight,this._selectionFloat)}else o.fill(this._vertices.selection,0,16)}else o.fill(this._vertices.selection,0,0)},t.prototype.updateBackgrounds=function(t){for(var e=this._terminal,i=this._vertices,r=1,o=0;o<e.rows;o++){for(var s=-1,a=0,l=0,h=!1,c=0;c<e.cols;c++){var _=(o*e.cols+c)*n.RENDER_MODEL_INDICIES_PER_CELL,d=t.cells[_+n.RENDER_MODEL_BG_OFFSET],u=t.cells[_+n.RENDER_MODEL_FG_OFFSET],f=!!(67108864&u);if(d!==a||u!==l&&(h||f)){if(0!==a||h&&0!==l){var p=8*r++;this._updateRectangle(i,p,l,a,s,c,o)}s=c,a=d,l=u,h=f}}(0!==a||h&&0!==l)&&(p=8*r++,this._updateRectangle(i,p,l,a,s,e.cols,o))}i.count=r},t.prototype._updateRectangle=function(t,e,i,o,n,s,a){var l;if(67108864&i)switch(50331648&i){case 16777216:case 33554432:l=this._colors.ansi[255&i].rgba;break;case 50331648:l=(16777215&i)<<8;break;case 0:default:l=this._colors.foreground.rgba}else switch(50331648&o){case 16777216:case 33554432:l=this._colors.ansi[255&o].rgba;break;case 50331648:l=(16777215&o)<<8;break;case 0:default:l=this._colors.background.rgba}t.attributes.length<e+4&&(t.attributes=r.expandFloat32Array(t.attributes,this._terminal.rows*this._terminal.cols*8));var h=n*this._dimensions.scaledCellWidth,c=a*this._dimensions.scaledCellHeight,_=(l>>24&255)/255,d=(l>>16&255)/255,u=(l>>8&255)/255;this._addRectangle(t.attributes,e,h,c,(s-n)*this._dimensions.scaledCellWidth,this._dimensions.scaledCellHeight,_,d,u,1)},t.prototype._addRectangle=function(t,e,i,r,o,n,s,a,l,h){t[e]=i,t[e+1]=r,t[e+2]=o,t[e+3]=n,t[e+4]=s,t[e+5]=a,t[e+6]=l,t[e+7]=h},t.prototype._addRectangleFloat=function(t,e,i,r,o,n,s){t[e]=i,t[e+1]=r,t[e+2]=o,t[e+3]=n,t[e+4]=s[0],t[e+5]=s[1],t[e+6]=s[2],t[e+7]=s[3]},t.prototype._colorToFloat32Array=function(t){return new Float32Array([(t.rgba>>24&255)/255,(t.rgba>>16&255)/255,(t.rgba>>8&255)/255,(255&t.rgba)/255])},t}();e.RectangleRenderer=a},310:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.RenderModel=e.COMBINED_CHAR_BIT_MASK=e.RENDER_MODEL_FG_OFFSET=e.RENDER_MODEL_BG_OFFSET=e.RENDER_MODEL_INDICIES_PER_CELL=void 0;var r=i(455);e.RENDER_MODEL_INDICIES_PER_CELL=3,e.RENDER_MODEL_BG_OFFSET=1,e.RENDER_MODEL_FG_OFFSET=2,e.COMBINED_CHAR_BIT_MASK=2147483648;var o=function(){function t(){this.cells=new Uint32Array(0),this.lineLengths=new Uint32Array(0),this.selection={hasSelection:!1,columnSelectMode:!1,viewportStartRow:0,viewportEndRow:0,viewportCappedStartRow:0,viewportCappedEndRow:0,startCol:0,endCol:0}}return t.prototype.resize=function(t,i){var r=t*i*e.RENDER_MODEL_INDICIES_PER_CELL;r!==this.cells.length&&(this.cells=new Uint32Array(r),this.lineLengths=new Uint32Array(i))},t.prototype.clear=function(){r.fill(this.cells,0,0),r.fill(this.lineLengths,0,0)},t.prototype.clearSelection=function(){this.selection.hasSelection=!1,this.selection.viewportStartRow=0,this.selection.viewportEndRow=0,this.selection.viewportCappedStartRow=0,this.selection.viewportCappedEndRow=0,this.selection.startCol=0,this.selection.endCol=0},t}();e.RenderModel=o},259:(t,e)=>{function i(t,e,i){void 0===e&&(e=0),void 0===i&&(i=t.length),e<0&&(e=(t.length+e)%t.length),i=i>=t.length?t.length:(t.length+i)%t.length,e=Math.min(e,i);for(var r=new t.constructor(i-e),o=0;o<i-e;++o)r[o]=t[o+e];return r}Object.defineProperty(e,"__esModule",{value:!0}),e.sliceFallback=e.slice=void 0,e.slice=function(t,e,r){return t.slice?t.slice(e,r):i(t,e,r)},e.sliceFallback=i},795:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.WebglAddon=void 0;var r=i(666),o=function(){function t(t){this._preserveDrawingBuffer=t}return t.prototype.activate=function(t){if(!t.element)throw new Error("Cannot activate WebglAddon before Terminal.open");this._terminal=t;var e=t._core._renderService,i=t._core._colorManager.colors;this._renderer=new r.WebglRenderer(t,i,this._preserveDrawingBuffer),e.setRenderer(this._renderer)},t.prototype.dispose=function(){if(!this._terminal)throw new Error("Cannot dispose WebglAddon because it is activated");var t=this._terminal._core._renderService;t.setRenderer(this._terminal._core._createRenderer()),t.onResize(this._terminal.cols,this._terminal.rows),this._renderer=void 0},Object.defineProperty(t.prototype,"textureAtlas",{get:function(){var t;return null===(t=this._renderer)||void 0===t?void 0:t.textureAtlas},enumerable:!1,configurable:!0}),t.prototype.clearTextureAtlas=function(){var t;null===(t=this._renderer)||void 0===t||t.clearCharAtlas()},t}();e.WebglAddon=o},666:function(t,e,i){var r,o=this&&this.__extends||(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i])})(t,e)},function(t,e){function i(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)});Object.defineProperty(e,"__esModule",{value:!0}),e.WebglRenderer=void 0;var n=i(965),s=i(733),a=i(461),l=i(713),h=i(344),c=i(310),_=i(859),d=i(855),u=i(345),f=i(782),p=function(t){function e(e,i,r){var o=t.call(this)||this;o._terminal=e,o._colors=i,o._model=new c.RenderModel,o._workCell=new f.CellData,o._onRequestRedraw=new u.EventEmitter,o._core=o._terminal._core,o._renderLayers=[new s.LinkRenderLayer(o._core.screenElement,2,o._colors,o._core),new a.CursorRenderLayer(o._core.screenElement,3,o._colors,o._onRequestRedraw)],o.dimensions={scaledCharWidth:0,scaledCharHeight:0,scaledCellWidth:0,scaledCellHeight:0,scaledCharLeft:0,scaledCharTop:0,scaledCanvasWidth:0,scaledCanvasHeight:0,canvasWidth:0,canvasHeight:0,actualCellWidth:0,actualCellHeight:0},o._devicePixelRatio=window.devicePixelRatio,o._updateDimensions(),o._canvas=document.createElement("canvas");var l={antialias:!1,depth:!1,preserveDrawingBuffer:r};if(o._gl=o._canvas.getContext("webgl2",l),!o._gl)throw new Error("WebGL2 not supported "+o._gl);return o._core.screenElement.appendChild(o._canvas),o._rectangleRenderer=new h.RectangleRenderer(o._terminal,o._colors,o._gl,o.dimensions),o._glyphRenderer=new n.GlyphRenderer(o._terminal,o._colors,o._gl,o.dimensions),o.onCharSizeChanged(),o._isAttached=document.body.contains(o._core.screenElement),o}return o(e,t),Object.defineProperty(e.prototype,"onRequestRedraw",{get:function(){return this._onRequestRedraw.event},enumerable:!1,configurable:!0}),e.prototype.dispose=function(){this._renderLayers.forEach((function(t){return t.dispose()})),this._core.screenElement.removeChild(this._canvas),t.prototype.dispose.call(this)},Object.defineProperty(e.prototype,"textureAtlas",{get:function(){var t;return null===(t=this._charAtlas)||void 0===t?void 0:t.cacheCanvas},enumerable:!1,configurable:!0}),e.prototype.setColors=function(t){var e=this;this._colors=t,this._renderLayers.forEach((function(t){t.setColors(e._terminal,e._colors),t.reset(e._terminal)})),this._rectangleRenderer.setColors(),this._glyphRenderer.setColors(),this._refreshCharAtlas(),this._model.clear()},e.prototype.onDevicePixelRatioChange=function(){this._devicePixelRatio!==window.devicePixelRatio&&(this._devicePixelRatio=window.devicePixelRatio,this.onResize(this._terminal.cols,this._terminal.rows))},e.prototype.onResize=function(t,e){var i=this;this._updateDimensions(),this._model.resize(this._terminal.cols,this._terminal.rows),this._renderLayers.forEach((function(t){return t.resize(i._terminal,i.dimensions)})),this._canvas.width=this.dimensions.scaledCanvasWidth,this._canvas.height=this.dimensions.scaledCanvasHeight,this._canvas.style.width=this.dimensions.canvasWidth+"px",this._canvas.style.height=this.dimensions.canvasHeight+"px",this._core.screenElement.style.width=this.dimensions.canvasWidth+"px",this._core.screenElement.style.height=this.dimensions.canvasHeight+"px",this._rectangleRenderer.onResize(),this._model.selection.hasSelection&&this._rectangleRenderer.updateSelection(this._model.selection),this._glyphRenderer.setDimensions(this.dimensions),this._glyphRenderer.onResize(),this._refreshCharAtlas(),this._model.clear()},e.prototype.onCharSizeChanged=function(){this.onResize(this._terminal.cols,this._terminal.rows)},e.prototype.onBlur=function(){var t=this;this._renderLayers.forEach((function(e){return e.onBlur(t._terminal)}))},e.prototype.onFocus=function(){var t=this;this._renderLayers.forEach((function(e){return e.onFocus(t._terminal)}))},e.prototype.onSelectionChanged=function(t,e,i){var r=this;this._renderLayers.forEach((function(o){return o.onSelectionChanged(r._terminal,t,e,i)})),this._updateSelectionModel(t,e,i),this._onRequestRedraw.fire({start:0,end:this._terminal.rows-1})},e.prototype.onCursorMove=function(){var t=this;this._renderLayers.forEach((function(e){return e.onCursorMove(t._terminal)}))},e.prototype.onOptionsChanged=function(){var t=this;this._renderLayers.forEach((function(e){return e.onOptionsChanged(t._terminal)})),this._updateDimensions(),this._refreshCharAtlas()},e.prototype._refreshCharAtlas=function(){if(this.dimensions.scaledCharWidth<=0&&this.dimensions.scaledCharHeight<=0)this._isAttached=!1;else{var t=l.acquireCharAtlas(this._terminal,this._colors,this.dimensions.scaledCharWidth,this.dimensions.scaledCharHeight);if(!("getRasterizedGlyph"in t))throw new Error("The webgl renderer only works with the webgl char atlas");this._charAtlas=t,this._charAtlas.warmUp(),this._glyphRenderer.setAtlas(this._charAtlas)}},e.prototype.clearCharAtlas=function(){var t;null===(t=this._charAtlas)||void 0===t||t.clearTexture(),this._model.clear(),this._updateModel(0,this._terminal.rows-1),this._onRequestRedraw.fire({start:0,end:this._terminal.rows-1})},e.prototype.clear=function(){var t=this;this._renderLayers.forEach((function(e){return e.reset(t._terminal)}))},e.prototype.registerCharacterJoiner=function(t){return-1},e.prototype.deregisterCharacterJoiner=function(t){return!1},e.prototype.renderRows=function(t,e){var i=this;if(!this._isAttached){if(!(document.body.contains(this._core.screenElement)&&this._core._charSizeService.width&&this._core._charSizeService.height))return;this._updateDimensions(),this._refreshCharAtlas(),this._isAttached=!0}this._renderLayers.forEach((function(r){return r.onGridChanged(i._terminal,t,e)})),this._glyphRenderer.beginFrame()&&(this._model.clear(),this._updateSelectionModel(void 0,void 0)),this._updateModel(t,e),this._rectangleRenderer.render(),this._glyphRenderer.render(this._model,this._model.selection.hasSelection)},e.prototype._updateModel=function(t,e){for(var i=this._core,r=t;r<=e;r++){var o=r+i.buffer.ydisp,n=i.buffer.lines.get(o);this._model.lineLengths[r]=0;for(var s=0;s<i.cols;s++){n.loadCell(s,this._workCell);var a=this._workCell.getChars(),l=this._workCell.getCode(),h=(r*i.cols+s)*c.RENDER_MODEL_INDICIES_PER_CELL;l!==d.NULL_CELL_CODE&&(this._model.lineLengths[r]=s+1),this._model.cells[h]===l&&this._model.cells[h+c.RENDER_MODEL_BG_OFFSET]===this._workCell.bg&&this._model.cells[h+c.RENDER_MODEL_FG_OFFSET]===this._workCell.fg||(a.length>1&&(l|=c.COMBINED_CHAR_BIT_MASK),this._model.cells[h]=l,this._model.cells[h+c.RENDER_MODEL_BG_OFFSET]=this._workCell.bg,this._model.cells[h+c.RENDER_MODEL_FG_OFFSET]=this._workCell.fg,this._glyphRenderer.updateCell(s,r,l,this._workCell.bg,this._workCell.fg,a))}}this._rectangleRenderer.updateBackgrounds(this._model),this._model.selection.hasSelection&&this._glyphRenderer.updateSelection(this._model)},e.prototype._updateSelectionModel=function(t,e,i){void 0===i&&(i=!1);var r=this._terminal;if(!t||!e||t[0]===e[0]&&t[1]===e[1])return this._model.clearSelection(),void this._rectangleRenderer.updateSelection(this._model.selection);var o=t[1]-r.buffer.active.viewportY,n=e[1]-r.buffer.active.viewportY,s=Math.max(o,0),a=Math.min(n,r.rows-1);if(s>=r.rows||a<0)return this._model.clearSelection(),void this._rectangleRenderer.updateSelection(this._model.selection);this._model.selection.hasSelection=!0,this._model.selection.columnSelectMode=i,this._model.selection.viewportStartRow=o,this._model.selection.viewportEndRow=n,this._model.selection.viewportCappedStartRow=s,this._model.selection.viewportCappedEndRow=a,this._model.selection.startCol=t[0],this._model.selection.endCol=e[0],this._rectangleRenderer.updateSelection(this._model.selection)},e.prototype._updateDimensions=function(){this._core._charSizeService.width&&this._core._charSizeService.height&&(this.dimensions.scaledCharWidth=Math.floor(this._core._charSizeService.width*this._devicePixelRatio),this.dimensions.scaledCharHeight=Math.ceil(this._core._charSizeService.height*this._devicePixelRatio),this.dimensions.scaledCellHeight=Math.floor(this.dimensions.scaledCharHeight*this._terminal.getOption("lineHeight")),this.dimensions.scaledCharTop=1===this._terminal.getOption("lineHeight")?0:Math.round((this.dimensions.scaledCellHeight-this.dimensions.scaledCharHeight)/2),this.dimensions.scaledCellWidth=this.dimensions.scaledCharWidth+Math.round(this._terminal.getOption("letterSpacing")),this.dimensions.scaledCharLeft=Math.floor(this._terminal.getOption("letterSpacing")/2),this.dimensions.scaledCanvasHeight=this._terminal.rows*this.dimensions.scaledCellHeight,this.dimensions.scaledCanvasWidth=this._terminal.cols*this.dimensions.scaledCellWidth,this.dimensions.canvasHeight=Math.round(this.dimensions.scaledCanvasHeight/this._devicePixelRatio),this.dimensions.canvasWidth=Math.round(this.dimensions.scaledCanvasWidth/this._devicePixelRatio),this.dimensions.actualCellHeight=this.dimensions.scaledCellHeight/this._devicePixelRatio,this.dimensions.actualCellWidth=this.dimensions.scaledCellWidth/this._devicePixelRatio)},e}(_.Disposable);e.WebglRenderer=p},381:(t,e)=>{function i(t,e,i){var o=r(t.createShader(e));if(t.shaderSource(o,i),t.compileShader(o),t.getShaderParameter(o,t.COMPILE_STATUS))return o;console.error(t.getShaderInfoLog(o)),t.deleteShader(o)}function r(t){if(!t)throw new Error("value must not be falsy");return t}Object.defineProperty(e,"__esModule",{value:!0}),e.throwIfFalsy=e.expandFloat32Array=e.createShader=e.createProgram=e.PROJECTION_MATRIX=void 0,e.PROJECTION_MATRIX=new Float32Array([2,0,0,0,0,-2,0,0,0,0,1,0,-1,1,0,1]),e.createProgram=function(t,e,o){var n=r(t.createProgram());if(t.attachShader(n,r(i(t,t.VERTEX_SHADER,e))),t.attachShader(n,r(i(t,t.FRAGMENT_SHADER,o))),t.linkProgram(n),t.getProgramParameter(n,t.LINK_STATUS))return n;console.error(t.getProgramInfoLog(n)),t.deleteProgram(n)},e.createShader=i,e.expandFloat32Array=function(t,e){for(var i=Math.min(2*t.length,e),r=new Float32Array(i),o=0;o<t.length;o++)r[o]=t[o];return r},e.throwIfFalsy=r},713:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.removeTerminalFromCache=e.acquireCharAtlas=void 0;var r=i(433),o=i(167),n=[];e.acquireCharAtlas=function(t,e,i,s){for(var a=r.generateConfig(i,s,t,e),l=0;l<n.length;l++){var h=(c=n[l]).ownedBy.indexOf(t);if(h>=0){if(r.configEquals(c.config,a))return c.atlas;1===c.ownedBy.length?(c.atlas.dispose(),n.splice(l,1)):c.ownedBy.splice(h,1);break}}for(l=0;l<n.length;l++){var c=n[l];if(r.configEquals(c.config,a))return c.ownedBy.push(t),c.atlas}var _={atlas:new o.WebglCharAtlas(document,a),config:a,ownedBy:[t]};return n.push(_),_.atlas},e.removeTerminalFromCache=function(t){for(var e=0;e<n.length;e++){var i=n[e].ownedBy.indexOf(t);if(-1!==i){1===n[e].ownedBy.length?(n[e].atlas.dispose(),n.splice(e,1)):n[e].ownedBy.splice(i,1);break}}}},433:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.is256Color=e.configEquals=e.generateConfig=void 0;var i={css:"",rgba:0};e.generateConfig=function(t,e,r,o){var n={foreground:o.foreground,background:o.background,cursor:i,cursorAccent:i,selectionTransparent:i,selectionOpaque:i,ansi:o.ansi.slice(),contrastCache:o.contrastCache};return{devicePixelRatio:window.devicePixelRatio,scaledCharWidth:t,scaledCharHeight:e,fontFamily:r.getOption("fontFamily"),fontSize:r.getOption("fontSize"),fontWeight:r.getOption("fontWeight"),fontWeightBold:r.getOption("fontWeightBold"),allowTransparency:r.getOption("allowTransparency"),drawBoldTextInBrightColors:r.getOption("drawBoldTextInBrightColors"),minimumContrastRatio:r.getOption("minimumContrastRatio"),colors:n}},e.configEquals=function(t,e){for(var i=0;i<t.colors.ansi.length;i++)if(t.colors.ansi[i].rgba!==e.colors.ansi[i].rgba)return!1;return t.devicePixelRatio===e.devicePixelRatio&&t.fontFamily===e.fontFamily&&t.fontSize===e.fontSize&&t.fontWeight===e.fontWeight&&t.fontWeightBold===e.fontWeightBold&&t.allowTransparency===e.allowTransparency&&t.scaledCharWidth===e.scaledCharWidth&&t.scaledCharHeight===e.scaledCharHeight&&t.drawBoldTextInBrightColors===e.drawBoldTextInBrightColors&&t.minimumContrastRatio===e.minimumContrastRatio&&t.colors.foreground===e.colors.foreground&&t.colors.background===e.colors.background},e.is256Color=function(t){return 16777216==(50331648&t)||33554432==(50331648&t)}},167:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.WebglCharAtlas=void 0;var r=i(499),o=i(855),n=i(381),s=i(147),a=i(742),l=1024,h=1024,c=Math.floor(819.2),_={css:"rgba(0, 0, 0, 0)",rgba:0},d={offset:{x:0,y:0},texturePosition:{x:0,y:0},texturePositionClipSpace:{x:0,y:0},size:{x:0,y:0},sizeClipSpace:{x:0,y:0}},u=function(){function t(t,e){this._config=e,this._didWarmUp=!1,this._cacheMap={},this._cacheMapCombined={},this._currentRowY=0,this._currentRowX=0,this._currentRowHeight=0,this.hasCanvasChanged=!1,this._workBoundingBox={top:0,left:0,bottom:0,right:0},this._workAttributeData=new s.AttributeData,this.cacheCanvas=t.createElement("canvas"),this.cacheCanvas.width=l,this.cacheCanvas.height=h,this._cacheCtx=n.throwIfFalsy(this.cacheCanvas.getContext("2d",{alpha:!0})),this._tmpCanvas=t.createElement("canvas"),this._tmpCanvas.width=2*this._config.scaledCharWidth+4,this._tmpCanvas.height=this._config.scaledCharHeight+4,this._tmpCtx=n.throwIfFalsy(this._tmpCanvas.getContext("2d",{alpha:this._config.allowTransparency}))}return t.prototype.dispose=function(){this.cacheCanvas.parentElement&&this.cacheCanvas.parentElement.removeChild(this.cacheCanvas)},t.prototype.warmUp=function(){this._didWarmUp||(this._doWarmUp(),this._didWarmUp=!0)},t.prototype._doWarmUp=function(){for(var t,e,i=33;i<126;i++){var r=this._drawToCache(i,o.DEFAULT_COLOR,o.DEFAULT_COLOR);this._cacheMap[i]=((t={})[o.DEFAULT_COLOR]=((e={})[o.DEFAULT_COLOR]=r,e),t)}},t.prototype.beginFrame=function(){return this._currentRowY>c&&(this.clearTexture(),this.warmUp(),!0)},t.prototype.clearTexture=function(){0===this._currentRowX&&0===this._currentRowY||(this._cacheCtx.clearRect(0,0,l,h),this._cacheMap={},this._cacheMapCombined={},this._currentRowHeight=0,this._currentRowX=0,this._currentRowY=0,this._didWarmUp=!1)},t.prototype.getRasterizedGlyphCombinedChar=function(t,e,i){var r,o=this._cacheMapCombined[t];o||(o={},this._cacheMapCombined[t]=o);var n=o[e];return n&&(r=n[i]),r||(r=this._drawToCache(t,e,i),o[e]||(o[e]={}),o[e][i]=r),r},t.prototype.getRasterizedGlyph=function(t,e,i){var r,o=this._cacheMap[t];o||(o={},this._cacheMap[t]=o);var n=o[e];return n&&(r=n[i]),r||(r=this._drawToCache(t,e,i),o[e]||(o[e]={}),o[e][i]=r),r},t.prototype._getColorFromAnsiIndex=function(t){if(t>=this._config.colors.ansi.length)throw new Error("No color found for idx "+t);return this._config.colors.ansi[t]},t.prototype._getBackgroundColor=function(t,e,i){if(this._config.allowTransparency)return _;switch(t){case 16777216:case 33554432:return this._getColorFromAnsiIndex(e);case 50331648:var r=s.AttributeData.toColorRGB(e);return{rgba:e<<8,css:"#"+f(r[0])+f(r[1])+f(r[2])};case 0:default:return i?this._config.colors.foreground:this._config.colors.background}},t.prototype._getForegroundCss=function(t,e,i,r,o,n,l,h){var c=this._getMinimumContrastCss(t,e,i,r,o,n,l,h);if(c)return c;switch(o){case 16777216:case 33554432:return this._config.drawBoldTextInBrightColors&&h&&n<8&&(n+=8),this._getColorFromAnsiIndex(n).css;case 50331648:var _=s.AttributeData.toColorRGB(n);return a.channels.toCss(_[0],_[1],_[2]);case 0:default:if(l){var d=this._config.colors.background.css;return 9===d.length?d.substr(0,7):d}return this._config.colors.foreground.css}},t.prototype._resolveBackgroundRgba=function(t,e,i){switch(t){case 16777216:case 33554432:return this._getColorFromAnsiIndex(e).rgba;case 50331648:return e<<8;case 0:default:return i?this._config.colors.foreground.rgba:this._config.colors.background.rgba}},t.prototype._resolveForegroundRgba=function(t,e,i,r){switch(t){case 16777216:case 33554432:return this._config.drawBoldTextInBrightColors&&r&&e<8&&(e+=8),this._getColorFromAnsiIndex(e).rgba;case 50331648:return e<<8;case 0:default:return i?this._config.colors.background.rgba:this._config.colors.foreground.rgba}},t.prototype._getMinimumContrastCss=function(t,e,i,r,o,n,s,l){if(1!==this._config.minimumContrastRatio){var h=this._config.colors.contrastCache.getCss(t,r);if(void 0!==h)return h||void 0;var c=this._resolveBackgroundRgba(e,i,s),_=this._resolveForegroundRgba(o,n,s,l),d=a.rgba.ensureContrastRatio(c,_,this._config.minimumContrastRatio);if(d){var u=a.channels.toCss(d>>24&255,d>>16&255,d>>8&255);return this._config.colors.contrastCache.setCss(t,r,u),u}this._config.colors.contrastCache.setCss(t,r,null)}},t.prototype._drawToCache=function(t,e,i){var o="number"==typeof t?String.fromCharCode(t):t;if(this.hasCanvasChanged=!0,this._tmpCtx.save(),this._workAttributeData.fg=i,this._workAttributeData.bg=e,this._workAttributeData.isInvisible())return d;var n=!!this._workAttributeData.isBold(),s=!!this._workAttributeData.isInverse(),a=!!this._workAttributeData.isDim(),c=!!this._workAttributeData.isItalic(),_=this._workAttributeData.getFgColor(),u=this._workAttributeData.getFgColorMode(),f=this._workAttributeData.getBgColor(),p=this._workAttributeData.getBgColorMode();if(s){var g=_;_=f,f=g;var v=u;u=p,p=v}var C=this._getBackgroundColor(p,f,s);this._tmpCtx.globalCompositeOperation="copy",this._tmpCtx.fillStyle=C.css,this._tmpCtx.fillRect(0,0,this._tmpCanvas.width,this._tmpCanvas.height),this._tmpCtx.globalCompositeOperation="source-over";var m=n?this._config.fontWeightBold:this._config.fontWeight,y=c?"italic":"";this._tmpCtx.font=y+" "+m+" "+this._config.fontSize*this._config.devicePixelRatio+"px "+this._config.fontFamily,this._tmpCtx.textBaseline="middle",this._tmpCtx.fillStyle=this._getForegroundCss(e,p,f,i,u,_,s,n),a&&(this._tmpCtx.globalAlpha=r.DIM_OPACITY),this._tmpCtx.fillText(o,2,2+this._config.scaledCharHeight/2),this._tmpCtx.restore();var R=this._tmpCtx.getImageData(0,0,this._tmpCanvas.width,this._tmpCanvas.height);if(function(t,e){for(var i=!0,r=e.rgba>>>24,o=e.rgba>>>16&255,n=e.rgba>>>8&255,s=0;s<t.data.length;s+=4)t.data[s]===r&&t.data[s+1]===o&&t.data[s+2]===n?t.data[s+3]=0:i=!1;return i}(R,C))return d;var b=this._findGlyphBoundingBox(R,this._workBoundingBox),w=this._clipImageData(R,this._workBoundingBox);return this._currentRowX+this._config.scaledCharWidth>l&&(this._currentRowX=0,this._currentRowY+=this._currentRowHeight,this._currentRowHeight=0),b.texturePosition.x=this._currentRowX,b.texturePosition.y=this._currentRowY,b.texturePositionClipSpace.x=this._currentRowX/l,b.texturePositionClipSpace.y=this._currentRowY/h,this._currentRowHeight=Math.max(this._currentRowHeight,b.size.y),this._currentRowX+=b.size.x,this._cacheCtx.putImageData(w,b.texturePosition.x,b.texturePosition.y),b},t.prototype._findGlyphBoundingBox=function(t,e){e.top=0;for(var i=!1,r=0;r<this._tmpCanvas.height;r++){for(var o=0;o<this._tmpCanvas.width;o++){var n=r*this._tmpCanvas.width*4+4*o+3;if(0!==t.data[n]){e.top=r,i=!0;break}}if(i)break}for(e.left=0,i=!1,o=0;o<this._tmpCanvas.width;o++){for(r=0;r<this._tmpCanvas.height;r++)if(n=r*this._tmpCanvas.width*4+4*o+3,0!==t.data[n]){e.left=o,i=!0;break}if(i)break}for(e.right=this._tmpCanvas.width,i=!1,o=this._tmpCanvas.width-1;o>=0;o--){for(r=0;r<this._tmpCanvas.height;r++)if(n=r*this._tmpCanvas.width*4+4*o+3,0!==t.data[n]){e.right=o,i=!0;break}if(i)break}for(e.bottom=this._tmpCanvas.height,i=!1,r=this._tmpCanvas.height-1;r>=0;r--){for(o=0;o<this._tmpCanvas.width;o++)if(n=r*this._tmpCanvas.width*4+4*o+3,0!==t.data[n]){e.bottom=r,i=!0;break}if(i)break}return{texturePosition:{x:0,y:0},texturePositionClipSpace:{x:0,y:0},size:{x:e.right-e.left+1,y:e.bottom-e.top+1},sizeClipSpace:{x:(e.right-e.left+1)/l,y:(e.bottom-e.top+1)/h},offset:{x:2-e.left,y:2-e.top}}},t.prototype._clipImageData=function(t,e){for(var i=e.right-e.left+1,r=e.bottom-e.top+1,o=new Uint8ClampedArray(i*r*4),n=e.top;n<=e.bottom;n++)for(var s=e.left;s<=e.right;s++){var a=n*this._tmpCanvas.width*4+4*s,l=(n-e.top)*i*4+4*(s-e.left);o[l]=t.data[a],o[l+1]=t.data[a+1],o[l+2]=t.data[a+2],o[l+3]=t.data[a+3]}return new ImageData(o,i,r)},t}();function f(t){var e=t.toString(16);return e.length<2?"0"+e:e}e.WebglCharAtlas=u},592:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.BaseRenderLayer=void 0;var r=i(713),o=i(381),n=function(){function t(t,e,i,r,o){this._container=t,this._alpha=r,this._colors=o,this._scaledCharWidth=0,this._scaledCharHeight=0,this._scaledCellWidth=0,this._scaledCellHeight=0,this._scaledCharLeft=0,this._scaledCharTop=0,this._canvas=document.createElement("canvas"),this._canvas.classList.add("xterm-"+e+"-layer"),this._canvas.style.zIndex=i.toString(),this._initCanvas(),this._container.appendChild(this._canvas)}return t.prototype.dispose=function(){this._container.removeChild(this._canvas),this._charAtlas&&this._charAtlas.dispose()},t.prototype._initCanvas=function(){this._ctx=o.throwIfFalsy(this._canvas.getContext("2d",{alpha:this._alpha})),this._alpha||this._clearAll()},t.prototype.onOptionsChanged=function(t){},t.prototype.onBlur=function(t){},t.prototype.onFocus=function(t){},t.prototype.onCursorMove=function(t){},t.prototype.onGridChanged=function(t,e,i){},t.prototype.onSelectionChanged=function(t,e,i,r){void 0===r&&(r=!1)},t.prototype.setColors=function(t,e){this._refreshCharAtlas(t,e)},t.prototype._setTransparency=function(t,e){if(e!==this._alpha){var i=this._canvas;this._alpha=e,this._canvas=this._canvas.cloneNode(),this._initCanvas(),this._container.replaceChild(this._canvas,i),this._refreshCharAtlas(t,this._colors),this.onGridChanged(t,0,t.rows-1)}},t.prototype._refreshCharAtlas=function(t,e){this._scaledCharWidth<=0&&this._scaledCharHeight<=0||(this._charAtlas=r.acquireCharAtlas(t,e,this._scaledCharWidth,this._scaledCharHeight),this._charAtlas.warmUp())},t.prototype.resize=function(t,e){this._scaledCellWidth=e.scaledCellWidth,this._scaledCellHeight=e.scaledCellHeight,this._scaledCharWidth=e.scaledCharWidth,this._scaledCharHeight=e.scaledCharHeight,this._scaledCharLeft=e.scaledCharLeft,this._scaledCharTop=e.scaledCharTop,this._canvas.width=e.scaledCanvasWidth,this._canvas.height=e.scaledCanvasHeight,this._canvas.style.width=e.canvasWidth+"px",this._canvas.style.height=e.canvasHeight+"px",this._alpha||this._clearAll(),this._refreshCharAtlas(t,this._colors)},t.prototype._fillCells=function(t,e,i,r){this._ctx.fillRect(t*this._scaledCellWidth,e*this._scaledCellHeight,i*this._scaledCellWidth,r*this._scaledCellHeight)},t.prototype._fillBottomLineAtCells=function(t,e,i){void 0===i&&(i=1),this._ctx.fillRect(t*this._scaledCellWidth,(e+1)*this._scaledCellHeight-window.devicePixelRatio-1,i*this._scaledCellWidth,window.devicePixelRatio)},t.prototype._fillLeftLineAtCell=function(t,e,i){this._ctx.fillRect(t*this._scaledCellWidth,e*this._scaledCellHeight,window.devicePixelRatio*i,this._scaledCellHeight)},t.prototype._strokeRectAtCell=function(t,e,i,r){this._ctx.lineWidth=window.devicePixelRatio,this._ctx.strokeRect(t*this._scaledCellWidth+window.devicePixelRatio/2,e*this._scaledCellHeight+window.devicePixelRatio/2,i*this._scaledCellWidth-window.devicePixelRatio,r*this._scaledCellHeight-window.devicePixelRatio)},t.prototype._clearAll=function(){this._alpha?this._ctx.clearRect(0,0,this._canvas.width,this._canvas.height):(this._ctx.fillStyle=this._colors.background.css,this._ctx.fillRect(0,0,this._canvas.width,this._canvas.height))},t.prototype._clearCells=function(t,e,i,r){this._alpha?this._ctx.clearRect(t*this._scaledCellWidth,e*this._scaledCellHeight,i*this._scaledCellWidth,r*this._scaledCellHeight):(this._ctx.fillStyle=this._colors.background.css,this._ctx.fillRect(t*this._scaledCellWidth,e*this._scaledCellHeight,i*this._scaledCellWidth,r*this._scaledCellHeight))},t.prototype._fillCharTrueColor=function(t,e,i,r){this._ctx.font=this._getFont(t,!1,!1),this._ctx.textBaseline="middle",this._clipRow(t,r),this._ctx.fillText(e.getChars(),i*this._scaledCellWidth+this._scaledCharLeft,r*this._scaledCellHeight+this._scaledCharTop+this._scaledCharHeight/2)},t.prototype._clipRow=function(t,e){this._ctx.beginPath(),this._ctx.rect(0,e*this._scaledCellHeight,t.cols*this._scaledCellWidth,this._scaledCellHeight),this._ctx.clip()},t.prototype._getFont=function(t,e,i){return(i?"italic":"")+" "+(e?t.getOption("fontWeightBold"):t.getOption("fontWeight"))+" "+t.getOption("fontSize")*window.devicePixelRatio+"px "+t.getOption("fontFamily")},t}();e.BaseRenderLayer=n},461:function(t,e,i){var r,o=this&&this.__extends||(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i])})(t,e)},function(t,e){function i(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)});Object.defineProperty(e,"__esModule",{value:!0}),e.CursorRenderLayer=void 0;var n=i(592),s=i(782),a=600,l=function(t){function e(e,i,r,o){var n=t.call(this,e,"cursor",i,!0,r)||this;return n._onRequestRefreshRowsEvent=o,n._cell=new s.CellData,n._state={x:0,y:0,isFocused:!1,style:"",width:0},n._cursorRenderers={bar:n._renderBarCursor.bind(n),block:n._renderBlockCursor.bind(n),underline:n._renderUnderlineCursor.bind(n)},n}return o(e,t),e.prototype.resize=function(e,i){t.prototype.resize.call(this,e,i),this._state={x:0,y:0,isFocused:!1,style:"",width:0}},e.prototype.reset=function(t){this._clearCursor(),this._cursorBlinkStateManager&&(this._cursorBlinkStateManager.dispose(),this.onOptionsChanged(t))},e.prototype.onBlur=function(t){this._cursorBlinkStateManager&&this._cursorBlinkStateManager.pause(),this._onRequestRefreshRowsEvent.fire({start:t.buffer.active.cursorY,end:t.buffer.active.cursorY})},e.prototype.onFocus=function(t){this._cursorBlinkStateManager?this._cursorBlinkStateManager.resume(t):this._onRequestRefreshRowsEvent.fire({start:t.buffer.active.cursorY,end:t.buffer.active.cursorY})},e.prototype.onOptionsChanged=function(t){var e,i=this;t.getOption("cursorBlink")?this._cursorBlinkStateManager||(this._cursorBlinkStateManager=new h(t,(function(){i._render(t,!0)}))):(null===(e=this._cursorBlinkStateManager)||void 0===e||e.dispose(),this._cursorBlinkStateManager=void 0),this._onRequestRefreshRowsEvent.fire({start:t.buffer.active.cursorY,end:t.buffer.active.cursorY})},e.prototype.onCursorMove=function(t){this._cursorBlinkStateManager&&this._cursorBlinkStateManager.restartBlinkAnimation(t)},e.prototype.onGridChanged=function(t,e,i){!this._cursorBlinkStateManager||this._cursorBlinkStateManager.isPaused?this._render(t,!1):this._cursorBlinkStateManager.restartBlinkAnimation(t)},e.prototype._render=function(t,e){if(t._core._coreService.isCursorInitialized&&!t._core._coreService.isCursorHidden){var i=t.buffer.active.baseY+t.buffer.active.cursorY,r=i-t.buffer.active.viewportY,o=Math.min(t.buffer.active.cursorX,t.cols-1);if(r<0||r>=t.rows)this._clearCursor();else if(t._core.buffer.lines.get(i).loadCell(o,this._cell),void 0!==this._cell.content){if(!c(t)){this._clearCursor(),this._ctx.save(),this._ctx.fillStyle=this._colors.cursor.css;var n=t.getOption("cursorStyle");return n&&"block"!==n?this._cursorRenderers[n](t,o,r,this._cell):this._renderBlurCursor(t,o,r,this._cell),this._ctx.restore(),this._state.x=o,this._state.y=r,this._state.isFocused=!1,this._state.style=n,void(this._state.width=this._cell.getWidth())}if(!this._cursorBlinkStateManager||this._cursorBlinkStateManager.isCursorVisible){if(this._state){if(this._state.x===o&&this._state.y===r&&this._state.isFocused===c(t)&&this._state.style===t.getOption("cursorStyle")&&this._state.width===this._cell.getWidth())return;this._clearCursor()}this._ctx.save(),this._cursorRenderers[t.getOption("cursorStyle")||"block"](t,o,r,this._cell),this._ctx.restore(),this._state.x=o,this._state.y=r,this._state.isFocused=!1,this._state.style=t.getOption("cursorStyle"),this._state.width=this._cell.getWidth()}else this._clearCursor()}}else this._clearCursor()},e.prototype._clearCursor=function(){this._state&&(this._clearCells(this._state.x,this._state.y,this._state.width,1),this._state={x:0,y:0,isFocused:!1,style:"",width:0})},e.prototype._renderBarCursor=function(t,e,i,r){this._ctx.save(),this._ctx.fillStyle=this._colors.cursor.css,this._fillLeftLineAtCell(e,i,t.getOption("cursorWidth")),this._ctx.restore()},e.prototype._renderBlockCursor=function(t,e,i,r){this._ctx.save(),this._ctx.fillStyle=this._colors.cursor.css,this._fillCells(e,i,r.getWidth(),1),this._ctx.fillStyle=this._colors.cursorAccent.css,this._fillCharTrueColor(t,r,e,i),this._ctx.restore()},e.prototype._renderUnderlineCursor=function(t,e,i,r){this._ctx.save(),this._ctx.fillStyle=this._colors.cursor.css,this._fillBottomLineAtCells(e,i),this._ctx.restore()},e.prototype._renderBlurCursor=function(t,e,i,r){this._ctx.save(),this._ctx.strokeStyle=this._colors.cursor.css,this._strokeRectAtCell(e,i,r.getWidth(),1),this._ctx.restore()},e}(n.BaseRenderLayer);e.CursorRenderLayer=l;var h=function(){function t(t,e){this._renderCallback=e,this.isCursorVisible=!0,c(t)&&this._restartInterval()}return Object.defineProperty(t.prototype,"isPaused",{get:function(){return!(this._blinkStartTimeout||this._blinkInterval)},enumerable:!1,configurable:!0}),t.prototype.dispose=function(){this._blinkInterval&&(window.clearInterval(this._blinkInterval),this._blinkInterval=void 0),this._blinkStartTimeout&&(window.clearTimeout(this._blinkStartTimeout),this._blinkStartTimeout=void 0),this._animationFrame&&(window.cancelAnimationFrame(this._animationFrame),this._animationFrame=void 0)},t.prototype.restartBlinkAnimation=function(t){var e=this;this.isPaused||(this._animationTimeRestarted=Date.now(),this.isCursorVisible=!0,this._animationFrame||(this._animationFrame=window.requestAnimationFrame((function(){e._renderCallback(),e._animationFrame=void 0}))))},t.prototype._restartInterval=function(t){var e=this;void 0===t&&(t=a),this._blinkInterval&&window.clearInterval(this._blinkInterval),this._blinkStartTimeout=window.setTimeout((function(){if(e._animationTimeRestarted){var t=a-(Date.now()-e._animationTimeRestarted);if(e._animationTimeRestarted=void 0,t>0)return void e._restartInterval(t)}e.isCursorVisible=!1,e._animationFrame=window.requestAnimationFrame((function(){e._renderCallback(),e._animationFrame=void 0})),e._blinkInterval=window.setInterval((function(){if(e._animationTimeRestarted){var t=a-(Date.now()-e._animationTimeRestarted);return e._animationTimeRestarted=void 0,void e._restartInterval(t)}e.isCursorVisible=!e.isCursorVisible,e._animationFrame=window.requestAnimationFrame((function(){e._renderCallback(),e._animationFrame=void 0}))}),a)}),t)},t.prototype.pause=function(){this.isCursorVisible=!0,this._blinkInterval&&(window.clearInterval(this._blinkInterval),this._blinkInterval=void 0),this._blinkStartTimeout&&(window.clearTimeout(this._blinkStartTimeout),this._blinkStartTimeout=void 0),this._animationFrame&&(window.cancelAnimationFrame(this._animationFrame),this._animationFrame=void 0)},t.prototype.resume=function(t){this.pause(),this._animationTimeRestarted=void 0,this._restartInterval(),this.restartBlinkAnimation(t)},t}();function c(t){return document.activeElement===t.textarea&&document.hasFocus()}},733:function(t,e,i){var r,o=this&&this.__extends||(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i])})(t,e)},function(t,e){function i(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)});Object.defineProperty(e,"__esModule",{value:!0}),e.LinkRenderLayer=void 0;var n=i(592),s=i(499),a=i(433),l=function(t){function e(e,i,r,o){var n=t.call(this,e,"link",i,!0,r)||this;return o.linkifier.onShowLinkUnderline((function(t){return n._onShowLinkUnderline(t)})),o.linkifier.onHideLinkUnderline((function(t){return n._onHideLinkUnderline(t)})),o.linkifier2.onShowLinkUnderline((function(t){return n._onShowLinkUnderline(t)})),o.linkifier2.onHideLinkUnderline((function(t){return n._onHideLinkUnderline(t)})),n}return o(e,t),e.prototype.resize=function(e,i){t.prototype.resize.call(this,e,i),this._state=void 0},e.prototype.reset=function(t){this._clearCurrentLink()},e.prototype._clearCurrentLink=function(){if(this._state){this._clearCells(this._state.x1,this._state.y1,this._state.cols-this._state.x1,1);var t=this._state.y2-this._state.y1-1;t>0&&this._clearCells(0,this._state.y1+1,this._state.cols,t),this._clearCells(0,this._state.y2,this._state.x2,1),this._state=void 0}},e.prototype._onShowLinkUnderline=function(t){if(t.fg===s.INVERTED_DEFAULT_COLOR?this._ctx.fillStyle=this._colors.background.css:void 0!==t.fg&&a.is256Color(t.fg)?this._ctx.fillStyle=this._colors.ansi[t.fg].css:this._ctx.fillStyle=this._colors.foreground.css,t.y1===t.y2)this._fillBottomLineAtCells(t.x1,t.y1,t.x2-t.x1);else{this._fillBottomLineAtCells(t.x1,t.y1,t.cols-t.x1);for(var e=t.y1+1;e<t.y2;e++)this._fillBottomLineAtCells(0,e,t.cols);this._fillBottomLineAtCells(0,t.y2,t.x2)}this._state=t},e.prototype._onHideLinkUnderline=function(t){this._clearCurrentLink()},e}(n.BaseRenderLayer);e.LinkRenderLayer=l},742:(t,e)=>{var i,r,o,n;function s(t){var e=t.toString(16);return e.length<2?"0"+e:e}function a(t,e){return t<e?(e+.05)/(t+.05):(t+.05)/(e+.05)}Object.defineProperty(e,"__esModule",{value:!0}),e.contrastRatio=e.toPaddedHex=e.rgba=e.rgb=e.css=e.color=e.channels=void 0,function(t){t.toCss=function(t,e,i,r){return void 0!==r?"#"+s(t)+s(e)+s(i)+s(r):"#"+s(t)+s(e)+s(i)},t.toRgba=function(t,e,i,r){return void 0===r&&(r=255),(t<<24|e<<16|i<<8|r)>>>0}}(i=e.channels||(e.channels={})),(r=e.color||(e.color={})).blend=function(t,e){var r=(255&e.rgba)/255;if(1===r)return{css:e.css,rgba:e.rgba};var o=e.rgba>>24&255,n=e.rgba>>16&255,s=e.rgba>>8&255,a=t.rgba>>24&255,l=t.rgba>>16&255,h=t.rgba>>8&255,c=a+Math.round((o-a)*r),_=l+Math.round((n-l)*r),d=h+Math.round((s-h)*r);return{css:i.toCss(c,_,d),rgba:i.toRgba(c,_,d)}},r.isOpaque=function(t){return 255==(255&t.rgba)},r.ensureContrastRatio=function(t,e,i){var r=n.ensureContrastRatio(t.rgba,e.rgba,i);if(r)return n.toColor(r>>24&255,r>>16&255,r>>8&255)},r.opaque=function(t){var e=(255|t.rgba)>>>0,r=n.toChannels(e),o=r[0],s=r[1],a=r[2];return{css:i.toCss(o,s,a),rgba:e}},r.opacity=function(t,e){var r=Math.round(255*e),o=n.toChannels(t.rgba),s=o[0],a=o[1],l=o[2];return{css:i.toCss(s,a,l,r),rgba:i.toRgba(s,a,l,r)}},(e.css||(e.css={})).toColor=function(t){switch(t.length){case 7:return{css:t,rgba:(parseInt(t.slice(1),16)<<8|255)>>>0};case 9:return{css:t,rgba:parseInt(t.slice(1),16)>>>0}}throw new Error("css.toColor: Unsupported css format")},function(t){function e(t,e,i){var r=t/255,o=e/255,n=i/255;return.2126*(r<=.03928?r/12.92:Math.pow((r+.055)/1.055,2.4))+.7152*(o<=.03928?o/12.92:Math.pow((o+.055)/1.055,2.4))+.0722*(n<=.03928?n/12.92:Math.pow((n+.055)/1.055,2.4))}t.relativeLuminance=function(t){return e(t>>16&255,t>>8&255,255&t)},t.relativeLuminance2=e}(o=e.rgb||(e.rgb={})),function(t){function e(t,e,i){for(var r=t>>24&255,n=t>>16&255,s=t>>8&255,l=e>>24&255,h=e>>16&255,c=e>>8&255,_=a(o.relativeLuminance2(l,c,h),o.relativeLuminance2(r,n,s));_<i&&(l>0||h>0||c>0);)l-=Math.max(0,Math.ceil(.1*l)),h-=Math.max(0,Math.ceil(.1*h)),c-=Math.max(0,Math.ceil(.1*c)),_=a(o.relativeLuminance2(l,c,h),o.relativeLuminance2(r,n,s));return(l<<24|h<<16|c<<8|255)>>>0}function r(t,e,i){for(var r=t>>24&255,n=t>>16&255,s=t>>8&255,l=e>>24&255,h=e>>16&255,c=e>>8&255,_=a(o.relativeLuminance2(l,c,h),o.relativeLuminance2(r,n,s));_<i&&(l<255||h<255||c<255);)l=Math.min(255,l+Math.ceil(.1*(255-l))),h=Math.min(255,h+Math.ceil(.1*(255-h))),c=Math.min(255,c+Math.ceil(.1*(255-c))),_=a(o.relativeLuminance2(l,c,h),o.relativeLuminance2(r,n,s));return(l<<24|h<<16|c<<8|255)>>>0}t.ensureContrastRatio=function(t,i,n){var s=o.relativeLuminance(t>>8),l=o.relativeLuminance(i>>8);if(a(s,l)<n)return l<s?e(t,i,n):r(t,i,n)},t.reduceLuminance=e,t.increaseLuminance=r,t.toChannels=function(t){return[t>>24&255,t>>16&255,t>>8&255,255&t]},t.toColor=function(t,e,r){return{css:i.toCss(t,e,r),rgba:i.toRgba(t,e,r)}}}(n=e.rgba||(e.rgba={})),e.toPaddedHex=s,e.contrastRatio=a},499:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.CHAR_ATLAS_CELL_SPACING=e.DIM_OPACITY=e.INVERTED_DEFAULT_COLOR=void 0,e.INVERTED_DEFAULT_COLOR=257,e.DIM_OPACITY=.5,e.CHAR_ATLAS_CELL_SPACING=1},345:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.forwardEvent=e.EventEmitter=void 0;var i=function(){function t(){this._listeners=[],this._disposed=!1}return Object.defineProperty(t.prototype,"event",{get:function(){var t=this;return this._event||(this._event=function(e){return t._listeners.push(e),{dispose:function(){if(!t._disposed)for(var i=0;i<t._listeners.length;i++)if(t._listeners[i]===e)return void t._listeners.splice(i,1)}}}),this._event},enumerable:!1,configurable:!0}),t.prototype.fire=function(t,e){for(var i=[],r=0;r<this._listeners.length;r++)i.push(this._listeners[r]);for(r=0;r<i.length;r++)i[r].call(void 0,t,e)},t.prototype.dispose=function(){this._listeners&&(this._listeners.length=0),this._disposed=!0},t}();e.EventEmitter=i,e.forwardEvent=function(t,e){return t((function(t){return e.fire(t)}))}},859:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.getDisposeArrayDisposable=e.disposeArray=e.Disposable=void 0;var i=function(){function t(){this._disposables=[],this._isDisposed=!1}return t.prototype.dispose=function(){this._isDisposed=!0;for(var t=0,e=this._disposables;t<e.length;t++)e[t].dispose();this._disposables.length=0},t.prototype.register=function(t){return this._disposables.push(t),t},t.prototype.unregister=function(t){var e=this._disposables.indexOf(t);-1!==e&&this._disposables.splice(e,1)},t}();function r(t){for(var e=0,i=t;e<i.length;e++)i[e].dispose();t.length=0}e.Disposable=i,e.disposeArray=r,e.getDisposeArrayDisposable=function(t){return{dispose:function(){return r(t)}}}},455:(t,e)=>{function i(t,e,i,r){if(void 0===i&&(i=0),void 0===r&&(r=t.length),i>=t.length)return t;i=(t.length+i)%t.length,r=r>=t.length?t.length:(t.length+r)%t.length;for(var o=i;o<r;++o)t[o]=e;return t}Object.defineProperty(e,"__esModule",{value:!0}),e.concat=e.fillFallback=e.fill=void 0,e.fill=function(t,e,r,o){return t.fill?t.fill(e,r,o):i(t,e,r,o)},e.fillFallback=i,e.concat=function(t,e){var i=new t.constructor(t.length+e.length);return i.set(t),i.set(e,t.length),i}},147:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.ExtendedAttrs=e.AttributeData=void 0;var i=function(){function t(){this.fg=0,this.bg=0,this.extended=new r}return t.toColorRGB=function(t){return[t>>>16&255,t>>>8&255,255&t]},t.fromColorRGB=function(t){return(255&t[0])<<16|(255&t[1])<<8|255&t[2]},t.prototype.clone=function(){var e=new t;return e.fg=this.fg,e.bg=this.bg,e.extended=this.extended.clone(),e},t.prototype.isInverse=function(){return 67108864&this.fg},t.prototype.isBold=function(){return 134217728&this.fg},t.prototype.isUnderline=function(){return 268435456&this.fg},t.prototype.isBlink=function(){return 536870912&this.fg},t.prototype.isInvisible=function(){return 1073741824&this.fg},t.prototype.isItalic=function(){return 67108864&this.bg},t.prototype.isDim=function(){return 134217728&this.bg},t.prototype.getFgColorMode=function(){return 50331648&this.fg},t.prototype.getBgColorMode=function(){return 50331648&this.bg},t.prototype.isFgRGB=function(){return 50331648==(50331648&this.fg)},t.prototype.isBgRGB=function(){return 50331648==(50331648&this.bg)},t.prototype.isFgPalette=function(){return 16777216==(50331648&this.fg)||33554432==(50331648&this.fg)},t.prototype.isBgPalette=function(){return 16777216==(50331648&this.bg)||33554432==(50331648&this.bg)},t.prototype.isFgDefault=function(){return 0==(50331648&this.fg)},t.prototype.isBgDefault=function(){return 0==(50331648&this.bg)},t.prototype.isAttributeDefault=function(){return 0===this.fg&&0===this.bg},t.prototype.getFgColor=function(){switch(50331648&this.fg){case 16777216:case 33554432:return 255&this.fg;case 50331648:return 16777215&this.fg;default:return-1}},t.prototype.getBgColor=function(){switch(50331648&this.bg){case 16777216:case 33554432:return 255&this.bg;case 50331648:return 16777215&this.bg;default:return-1}},t.prototype.hasExtendedAttrs=function(){return 268435456&this.bg},t.prototype.updateExtended=function(){this.extended.isEmpty()?this.bg&=-268435457:this.bg|=268435456},t.prototype.getUnderlineColor=function(){if(268435456&this.bg&&~this.extended.underlineColor)switch(50331648&this.extended.underlineColor){case 16777216:case 33554432:return 255&this.extended.underlineColor;case 50331648:return 16777215&this.extended.underlineColor;default:return this.getFgColor()}return this.getFgColor()},t.prototype.getUnderlineColorMode=function(){return 268435456&this.bg&&~this.extended.underlineColor?50331648&this.extended.underlineColor:this.getFgColorMode()},t.prototype.isUnderlineColorRGB=function(){return 268435456&this.bg&&~this.extended.underlineColor?50331648==(50331648&this.extended.underlineColor):this.isFgRGB()},t.prototype.isUnderlineColorPalette=function(){return 268435456&this.bg&&~this.extended.underlineColor?16777216==(50331648&this.extended.underlineColor)||33554432==(50331648&this.extended.underlineColor):this.isFgPalette()},t.prototype.isUnderlineColorDefault=function(){return 268435456&this.bg&&~this.extended.underlineColor?0==(50331648&this.extended.underlineColor):this.isFgDefault()},t.prototype.getUnderlineStyle=function(){return 268435456&this.fg?268435456&this.bg?this.extended.underlineStyle:1:0},t}();e.AttributeData=i;var r=function(){function t(t,e){void 0===t&&(t=0),void 0===e&&(e=-1),this.underlineStyle=t,this.underlineColor=e}return t.prototype.clone=function(){return new t(this.underlineStyle,this.underlineColor)},t.prototype.isEmpty=function(){return 0===this.underlineStyle},t}();e.ExtendedAttrs=r},782:function(t,e,i){var r,o=this&&this.__extends||(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i])})(t,e)},function(t,e){function i(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i)});Object.defineProperty(e,"__esModule",{value:!0}),e.CellData=void 0;var n=i(133),s=i(855),a=i(147),l=function(t){function e(){var e=null!==t&&t.apply(this,arguments)||this;return e.content=0,e.fg=0,e.bg=0,e.extended=new a.ExtendedAttrs,e.combinedData="",e}return o(e,t),e.fromCharData=function(t){var i=new e;return i.setFromCharData(t),i},e.prototype.isCombined=function(){return 2097152&this.content},e.prototype.getWidth=function(){return this.content>>22},e.prototype.getChars=function(){return 2097152&this.content?this.combinedData:2097151&this.content?n.stringFromCodePoint(2097151&this.content):""},e.prototype.getCode=function(){return this.isCombined()?this.combinedData.charCodeAt(this.combinedData.length-1):2097151&this.content},e.prototype.setFromCharData=function(t){this.fg=t[s.CHAR_DATA_ATTR_INDEX],this.bg=0;var e=!1;if(t[s.CHAR_DATA_CHAR_INDEX].length>2)e=!0;else if(2===t[s.CHAR_DATA_CHAR_INDEX].length){var i=t[s.CHAR_DATA_CHAR_INDEX].charCodeAt(0);if(55296<=i&&i<=56319){var r=t[s.CHAR_DATA_CHAR_INDEX].charCodeAt(1);56320<=r&&r<=57343?this.content=1024*(i-55296)+r-56320+65536|t[s.CHAR_DATA_WIDTH_INDEX]<<22:e=!0}else e=!0}else this.content=t[s.CHAR_DATA_CHAR_INDEX].charCodeAt(0)|t[s.CHAR_DATA_WIDTH_INDEX]<<22;e&&(this.combinedData=t[s.CHAR_DATA_CHAR_INDEX],this.content=2097152|t[s.CHAR_DATA_WIDTH_INDEX]<<22)},e.prototype.getAsCharData=function(){return[this.fg,this.getChars(),this.getWidth(),this.getCode()]},e}(a.AttributeData);e.CellData=l},855:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.WHITESPACE_CELL_CODE=e.WHITESPACE_CELL_WIDTH=e.WHITESPACE_CELL_CHAR=e.NULL_CELL_CODE=e.NULL_CELL_WIDTH=e.NULL_CELL_CHAR=e.CHAR_DATA_CODE_INDEX=e.CHAR_DATA_WIDTH_INDEX=e.CHAR_DATA_CHAR_INDEX=e.CHAR_DATA_ATTR_INDEX=e.DEFAULT_ATTR=e.DEFAULT_COLOR=void 0,e.DEFAULT_COLOR=256,e.DEFAULT_ATTR=256|e.DEFAULT_COLOR<<9,e.CHAR_DATA_ATTR_INDEX=0,e.CHAR_DATA_CHAR_INDEX=1,e.CHAR_DATA_WIDTH_INDEX=2,e.CHAR_DATA_CODE_INDEX=3,e.NULL_CELL_CHAR="",e.NULL_CELL_WIDTH=1,e.NULL_CELL_CODE=0,e.WHITESPACE_CELL_CHAR=" ",e.WHITESPACE_CELL_WIDTH=1,e.WHITESPACE_CELL_CODE=32},133:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Utf8ToUtf32=e.StringToUtf32=e.utf32ToString=e.stringFromCodePoint=void 0,e.stringFromCodePoint=function(t){return t>65535?(t-=65536,String.fromCharCode(55296+(t>>10))+String.fromCharCode(t%1024+56320)):String.fromCharCode(t)},e.utf32ToString=function(t,e,i){void 0===e&&(e=0),void 0===i&&(i=t.length);for(var r="",o=e;o<i;++o){var n=t[o];n>65535?(n-=65536,r+=String.fromCharCode(55296+(n>>10))+String.fromCharCode(n%1024+56320)):r+=String.fromCharCode(n)}return r};var i=function(){function t(){this._interim=0}return t.prototype.clear=function(){this._interim=0},t.prototype.decode=function(t,e){var i=t.length;if(!i)return 0;var r=0,o=0;this._interim&&(56320<=(a=t.charCodeAt(o++))&&a<=57343?e[r++]=1024*(this._interim-55296)+a-56320+65536:(e[r++]=this._interim,e[r++]=a),this._interim=0);for(var n=o;n<i;++n){var s=t.charCodeAt(n);if(55296<=s&&s<=56319){if(++n>=i)return this._interim=s,r;var a;56320<=(a=t.charCodeAt(n))&&a<=57343?e[r++]=1024*(s-55296)+a-56320+65536:(e[r++]=s,e[r++]=a)}else 65279!==s&&(e[r++]=s)}return r},t}();e.StringToUtf32=i;var r=function(){function t(){this.interim=new Uint8Array(3)}return t.prototype.clear=function(){this.interim.fill(0)},t.prototype.decode=function(t,e){var i=t.length;if(!i)return 0;var r,o,n,s,a=0,l=0,h=0;if(this.interim[0]){var c=!1,_=this.interim[0];_&=192==(224&_)?31:224==(240&_)?15:7;for(var d=0,u=void 0;(u=63&this.interim[++d])&&d<4;)_<<=6,_|=u;for(var f=192==(224&this.interim[0])?2:224==(240&this.interim[0])?3:4,p=f-d;h<p;){if(h>=i)return 0;if(128!=(192&(u=t[h++]))){h--,c=!0;break}this.interim[d++]=u,_<<=6,_|=63&u}c||(2===f?_<128?h--:e[a++]=_:3===f?_<2048||_>=55296&&_<=57343||65279===_||(e[a++]=_):_<65536||_>1114111||(e[a++]=_)),this.interim.fill(0)}for(var g=i-4,v=h;v<i;){for(;!(!(v<g)||128&(r=t[v])||128&(o=t[v+1])||128&(n=t[v+2])||128&(s=t[v+3]));)e[a++]=r,e[a++]=o,e[a++]=n,e[a++]=s,v+=4;if((r=t[v++])<128)e[a++]=r;else if(192==(224&r)){if(v>=i)return this.interim[0]=r,a;if(128!=(192&(o=t[v++]))){v--;continue}if((l=(31&r)<<6|63&o)<128){v--;continue}e[a++]=l}else if(224==(240&r)){if(v>=i)return this.interim[0]=r,a;if(128!=(192&(o=t[v++]))){v--;continue}if(v>=i)return this.interim[0]=r,this.interim[1]=o,a;if(128!=(192&(n=t[v++]))){v--;continue}if((l=(15&r)<<12|(63&o)<<6|63&n)<2048||l>=55296&&l<=57343||65279===l)continue;e[a++]=l}else if(240==(248&r)){if(v>=i)return this.interim[0]=r,a;if(128!=(192&(o=t[v++]))){v--;continue}if(v>=i)return this.interim[0]=r,this.interim[1]=o,a;if(128!=(192&(n=t[v++]))){v--;continue}if(v>=i)return this.interim[0]=r,this.interim[1]=o,this.interim[2]=n,a;if(128!=(192&(s=t[v++]))){v--;continue}if((l=(7&r)<<18|(63&o)<<12|(63&n)<<6|63&s)<65536||l>1114111)continue;e[a++]=l}}return a},t}();e.Utf8ToUtf32=r}},e={};return function i(r){if(e[r])return e[r].exports;var o=e[r]={exports:{}};return t[r].call(o.exports,o,o.exports,i),o.exports}(795)})()}));
//# sourceMappingURL=xterm-addon-webgl.js.map

/***/ }),

/***/ "./node_modules/xterm/lib/xterm.js":
/*!*****************************************!*\
  !*** ./node_modules/xterm/lib/xterm.js ***!
  \*****************************************/
/***/ ((module) => {

!function(e,t){if(true)module.exports=t();else { var i, r; }}(self,(function(){return(()=>{"use strict";var e={4567:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.AccessibilityManager=void 0;var o=r(9042),s=r(6114),a=r(6193),c=r(3656),l=r(844),h=r(5596),u=r(9631),f=function(e){function t(t,r){var i=e.call(this)||this;i._terminal=t,i._renderService=r,i._liveRegionLineCount=0,i._charsToConsume=[],i._charsToAnnounce="",i._accessibilityTreeRoot=document.createElement("div"),i._accessibilityTreeRoot.classList.add("xterm-accessibility"),i._rowContainer=document.createElement("div"),i._rowContainer.setAttribute("role","list"),i._rowContainer.classList.add("xterm-accessibility-tree"),i._rowElements=[];for(var n=0;n<i._terminal.rows;n++)i._rowElements[n]=i._createAccessibilityTreeNode(),i._rowContainer.appendChild(i._rowElements[n]);if(i._topBoundaryFocusListener=function(e){return i._onBoundaryFocus(e,0)},i._bottomBoundaryFocusListener=function(e){return i._onBoundaryFocus(e,1)},i._rowElements[0].addEventListener("focus",i._topBoundaryFocusListener),i._rowElements[i._rowElements.length-1].addEventListener("focus",i._bottomBoundaryFocusListener),i._refreshRowsDimensions(),i._accessibilityTreeRoot.appendChild(i._rowContainer),i._renderRowsDebouncer=new a.RenderDebouncer(i._renderRows.bind(i)),i._refreshRows(),i._liveRegion=document.createElement("div"),i._liveRegion.classList.add("live-region"),i._liveRegion.setAttribute("aria-live","assertive"),i._accessibilityTreeRoot.appendChild(i._liveRegion),!i._terminal.element)throw new Error("Cannot enable accessibility before Terminal.open");return i._terminal.element.insertAdjacentElement("afterbegin",i._accessibilityTreeRoot),i.register(i._renderRowsDebouncer),i.register(i._terminal.onResize((function(e){return i._onResize(e.rows)}))),i.register(i._terminal.onRender((function(e){return i._refreshRows(e.start,e.end)}))),i.register(i._terminal.onScroll((function(){return i._refreshRows()}))),i.register(i._terminal.onA11yChar((function(e){return i._onChar(e)}))),i.register(i._terminal.onLineFeed((function(){return i._onChar("\n")}))),i.register(i._terminal.onA11yTab((function(e){return i._onTab(e)}))),i.register(i._terminal.onKey((function(e){return i._onKey(e.key)}))),i.register(i._terminal.onBlur((function(){return i._clearLiveRegion()}))),i.register(i._renderService.onDimensionsChange((function(){return i._refreshRowsDimensions()}))),i._screenDprMonitor=new h.ScreenDprMonitor,i.register(i._screenDprMonitor),i._screenDprMonitor.setListener((function(){return i._refreshRowsDimensions()})),i.register(c.addDisposableDomListener(window,"resize",(function(){return i._refreshRowsDimensions()}))),i}return n(t,e),t.prototype.dispose=function(){e.prototype.dispose.call(this),u.removeElementFromParent(this._accessibilityTreeRoot),this._rowElements.length=0},t.prototype._onBoundaryFocus=function(e,t){var r=e.target,i=this._rowElements[0===t?1:this._rowElements.length-2];if(r.getAttribute("aria-posinset")!==(0===t?"1":""+this._terminal.buffer.lines.length)&&e.relatedTarget===i){var n,o;if(0===t?(n=r,o=this._rowElements.pop(),this._rowContainer.removeChild(o)):(n=this._rowElements.shift(),o=r,this._rowContainer.removeChild(n)),n.removeEventListener("focus",this._topBoundaryFocusListener),o.removeEventListener("focus",this._bottomBoundaryFocusListener),0===t){var s=this._createAccessibilityTreeNode();this._rowElements.unshift(s),this._rowContainer.insertAdjacentElement("afterbegin",s)}else s=this._createAccessibilityTreeNode(),this._rowElements.push(s),this._rowContainer.appendChild(s);this._rowElements[0].addEventListener("focus",this._topBoundaryFocusListener),this._rowElements[this._rowElements.length-1].addEventListener("focus",this._bottomBoundaryFocusListener),this._terminal.scrollLines(0===t?-1:1),this._rowElements[0===t?1:this._rowElements.length-2].focus(),e.preventDefault(),e.stopImmediatePropagation()}},t.prototype._onResize=function(e){this._rowElements[this._rowElements.length-1].removeEventListener("focus",this._bottomBoundaryFocusListener);for(var t=this._rowContainer.children.length;t<this._terminal.rows;t++)this._rowElements[t]=this._createAccessibilityTreeNode(),this._rowContainer.appendChild(this._rowElements[t]);for(;this._rowElements.length>e;)this._rowContainer.removeChild(this._rowElements.pop());this._rowElements[this._rowElements.length-1].addEventListener("focus",this._bottomBoundaryFocusListener),this._refreshRowsDimensions()},t.prototype._createAccessibilityTreeNode=function(){var e=document.createElement("div");return e.setAttribute("role","listitem"),e.tabIndex=-1,this._refreshRowDimensions(e),e},t.prototype._onTab=function(e){for(var t=0;t<e;t++)this._onChar(" ")},t.prototype._onChar=function(e){var t=this;this._liveRegionLineCount<21&&(this._charsToConsume.length>0?this._charsToConsume.shift()!==e&&(this._charsToAnnounce+=e):this._charsToAnnounce+=e,"\n"===e&&(this._liveRegionLineCount++,21===this._liveRegionLineCount&&(this._liveRegion.textContent+=o.tooMuchOutput)),s.isMac&&this._liveRegion.textContent&&this._liveRegion.textContent.length>0&&!this._liveRegion.parentNode&&setTimeout((function(){t._accessibilityTreeRoot.appendChild(t._liveRegion)}),0))},t.prototype._clearLiveRegion=function(){this._liveRegion.textContent="",this._liveRegionLineCount=0,s.isMac&&u.removeElementFromParent(this._liveRegion)},t.prototype._onKey=function(e){this._clearLiveRegion(),this._charsToConsume.push(e)},t.prototype._refreshRows=function(e,t){this._renderRowsDebouncer.refresh(e,t,this._terminal.rows)},t.prototype._renderRows=function(e,t){for(var r=this._terminal.buffer,i=r.lines.length.toString(),n=e;n<=t;n++){var o=r.translateBufferLineToString(r.ydisp+n,!0),s=(r.ydisp+n+1).toString(),a=this._rowElements[n];a&&(0===o.length?a.innerText=" ":a.textContent=o,a.setAttribute("aria-posinset",s),a.setAttribute("aria-setsize",i))}this._announceCharacters()},t.prototype._refreshRowsDimensions=function(){if(this._renderService.dimensions.actualCellHeight){this._rowElements.length!==this._terminal.rows&&this._onResize(this._terminal.rows);for(var e=0;e<this._terminal.rows;e++)this._refreshRowDimensions(this._rowElements[e])}},t.prototype._refreshRowDimensions=function(e){e.style.height=this._renderService.dimensions.actualCellHeight+"px"},t.prototype._announceCharacters=function(){0!==this._charsToAnnounce.length&&(this._liveRegion.textContent+=this._charsToAnnounce,this._charsToAnnounce="")},t}(l.Disposable);t.AccessibilityManager=f},3614:(e,t)=>{function r(e){return e.replace(/\r?\n/g,"\r")}function i(e,t){return t?"[200~"+e+"[201~":e}function n(e,t,n){e=i(e=r(e),n.decPrivateModes.bracketedPasteMode),n.triggerDataEvent(e,!0),t.value=""}function o(e,t,r){var i=r.getBoundingClientRect(),n=e.clientX-i.left-10,o=e.clientY-i.top-10;t.style.width="20px",t.style.height="20px",t.style.left=n+"px",t.style.top=o+"px",t.style.zIndex="1000",t.focus()}Object.defineProperty(t,"__esModule",{value:!0}),t.rightClickHandler=t.moveTextAreaUnderMouseCursor=t.paste=t.handlePasteEvent=t.copyHandler=t.bracketTextForPaste=t.prepareTextForTerminal=void 0,t.prepareTextForTerminal=r,t.bracketTextForPaste=i,t.copyHandler=function(e,t){e.clipboardData&&e.clipboardData.setData("text/plain",t.selectionText),e.preventDefault()},t.handlePasteEvent=function(e,t,r){e.stopPropagation(),e.clipboardData&&n(e.clipboardData.getData("text/plain"),t,r)},t.paste=n,t.moveTextAreaUnderMouseCursor=o,t.rightClickHandler=function(e,t,r,i,n){o(e,t,r),n&&i.rightClickSelect(e),t.value=i.selectionText,t.select()}},4774:(e,t)=>{var r,i,n,o;function s(e){var t=e.toString(16);return t.length<2?"0"+t:t}function a(e,t){return e<t?(t+.05)/(e+.05):(e+.05)/(t+.05)}Object.defineProperty(t,"__esModule",{value:!0}),t.contrastRatio=t.toPaddedHex=t.rgba=t.rgb=t.css=t.color=t.channels=void 0,function(e){e.toCss=function(e,t,r,i){return void 0!==i?"#"+s(e)+s(t)+s(r)+s(i):"#"+s(e)+s(t)+s(r)},e.toRgba=function(e,t,r,i){return void 0===i&&(i=255),(e<<24|t<<16|r<<8|i)>>>0}}(r=t.channels||(t.channels={})),(i=t.color||(t.color={})).blend=function(e,t){var i=(255&t.rgba)/255;if(1===i)return{css:t.css,rgba:t.rgba};var n=t.rgba>>24&255,o=t.rgba>>16&255,s=t.rgba>>8&255,a=e.rgba>>24&255,c=e.rgba>>16&255,l=e.rgba>>8&255,h=a+Math.round((n-a)*i),u=c+Math.round((o-c)*i),f=l+Math.round((s-l)*i);return{css:r.toCss(h,u,f),rgba:r.toRgba(h,u,f)}},i.isOpaque=function(e){return 255==(255&e.rgba)},i.ensureContrastRatio=function(e,t,r){var i=o.ensureContrastRatio(e.rgba,t.rgba,r);if(i)return o.toColor(i>>24&255,i>>16&255,i>>8&255)},i.opaque=function(e){var t=(255|e.rgba)>>>0,i=o.toChannels(t),n=i[0],s=i[1],a=i[2];return{css:r.toCss(n,s,a),rgba:t}},i.opacity=function(e,t){var i=Math.round(255*t),n=o.toChannels(e.rgba),s=n[0],a=n[1],c=n[2];return{css:r.toCss(s,a,c,i),rgba:r.toRgba(s,a,c,i)}},(t.css||(t.css={})).toColor=function(e){switch(e.length){case 7:return{css:e,rgba:(parseInt(e.slice(1),16)<<8|255)>>>0};case 9:return{css:e,rgba:parseInt(e.slice(1),16)>>>0}}throw new Error("css.toColor: Unsupported css format")},function(e){function t(e,t,r){var i=e/255,n=t/255,o=r/255;return.2126*(i<=.03928?i/12.92:Math.pow((i+.055)/1.055,2.4))+.7152*(n<=.03928?n/12.92:Math.pow((n+.055)/1.055,2.4))+.0722*(o<=.03928?o/12.92:Math.pow((o+.055)/1.055,2.4))}e.relativeLuminance=function(e){return t(e>>16&255,e>>8&255,255&e)},e.relativeLuminance2=t}(n=t.rgb||(t.rgb={})),function(e){function t(e,t,r){for(var i=e>>24&255,o=e>>16&255,s=e>>8&255,c=t>>24&255,l=t>>16&255,h=t>>8&255,u=a(n.relativeLuminance2(c,h,l),n.relativeLuminance2(i,o,s));u<r&&(c>0||l>0||h>0);)c-=Math.max(0,Math.ceil(.1*c)),l-=Math.max(0,Math.ceil(.1*l)),h-=Math.max(0,Math.ceil(.1*h)),u=a(n.relativeLuminance2(c,h,l),n.relativeLuminance2(i,o,s));return(c<<24|l<<16|h<<8|255)>>>0}function i(e,t,r){for(var i=e>>24&255,o=e>>16&255,s=e>>8&255,c=t>>24&255,l=t>>16&255,h=t>>8&255,u=a(n.relativeLuminance2(c,h,l),n.relativeLuminance2(i,o,s));u<r&&(c<255||l<255||h<255);)c=Math.min(255,c+Math.ceil(.1*(255-c))),l=Math.min(255,l+Math.ceil(.1*(255-l))),h=Math.min(255,h+Math.ceil(.1*(255-h))),u=a(n.relativeLuminance2(c,h,l),n.relativeLuminance2(i,o,s));return(c<<24|l<<16|h<<8|255)>>>0}e.ensureContrastRatio=function(e,r,o){var s=n.relativeLuminance(e>>8),c=n.relativeLuminance(r>>8);if(a(s,c)<o)return c<s?t(e,r,o):i(e,r,o)},e.reduceLuminance=t,e.increaseLuminance=i,e.toChannels=function(e){return[e>>24&255,e>>16&255,e>>8&255,255&e]},e.toColor=function(e,t,i){return{css:r.toCss(e,t,i),rgba:r.toRgba(e,t,i)}}}(o=t.rgba||(t.rgba={})),t.toPaddedHex=s,t.contrastRatio=a},7239:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ColorContrastCache=void 0;var r=function(){function e(){this._color={},this._rgba={}}return e.prototype.clear=function(){this._color={},this._rgba={}},e.prototype.setCss=function(e,t,r){this._rgba[e]||(this._rgba[e]={}),this._rgba[e][t]=r},e.prototype.getCss=function(e,t){return this._rgba[e]?this._rgba[e][t]:void 0},e.prototype.setColor=function(e,t,r){this._color[e]||(this._color[e]={}),this._color[e][t]=r},e.prototype.getColor=function(e,t){return this._color[e]?this._color[e][t]:void 0},e}();t.ColorContrastCache=r},5680:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ColorManager=t.DEFAULT_ANSI_COLORS=void 0;var i=r(4774),n=r(7239),o=i.css.toColor("#ffffff"),s=i.css.toColor("#000000"),a=i.css.toColor("#ffffff"),c=i.css.toColor("#000000"),l={css:"rgba(255, 255, 255, 0.3)",rgba:4294967117};t.DEFAULT_ANSI_COLORS=Object.freeze(function(){for(var e=[i.css.toColor("#2e3436"),i.css.toColor("#cc0000"),i.css.toColor("#4e9a06"),i.css.toColor("#c4a000"),i.css.toColor("#3465a4"),i.css.toColor("#75507b"),i.css.toColor("#06989a"),i.css.toColor("#d3d7cf"),i.css.toColor("#555753"),i.css.toColor("#ef2929"),i.css.toColor("#8ae234"),i.css.toColor("#fce94f"),i.css.toColor("#729fcf"),i.css.toColor("#ad7fa8"),i.css.toColor("#34e2e2"),i.css.toColor("#eeeeec")],t=[0,95,135,175,215,255],r=0;r<216;r++){var n=t[r/36%6|0],o=t[r/6%6|0],s=t[r%6];e.push({css:i.channels.toCss(n,o,s),rgba:i.channels.toRgba(n,o,s)})}for(r=0;r<24;r++){var a=8+10*r;e.push({css:i.channels.toCss(a,a,a),rgba:i.channels.toRgba(a,a,a)})}return e}());var h=function(){function e(e,r){this.allowTransparency=r;var h=e.createElement("canvas");h.width=1,h.height=1;var u=h.getContext("2d");if(!u)throw new Error("Could not get rendering context");this._ctx=u,this._ctx.globalCompositeOperation="copy",this._litmusColor=this._ctx.createLinearGradient(0,0,1,1),this._contrastCache=new n.ColorContrastCache,this.colors={foreground:o,background:s,cursor:a,cursorAccent:c,selectionTransparent:l,selectionOpaque:i.color.blend(s,l),ansi:t.DEFAULT_ANSI_COLORS.slice(),contrastCache:this._contrastCache}}return e.prototype.onOptionsChange=function(e){"minimumContrastRatio"===e&&this._contrastCache.clear()},e.prototype.setTheme=function(e){void 0===e&&(e={}),this.colors.foreground=this._parseColor(e.foreground,o),this.colors.background=this._parseColor(e.background,s),this.colors.cursor=this._parseColor(e.cursor,a,!0),this.colors.cursorAccent=this._parseColor(e.cursorAccent,c,!0),this.colors.selectionTransparent=this._parseColor(e.selection,l,!0),this.colors.selectionOpaque=i.color.blend(this.colors.background,this.colors.selectionTransparent),i.color.isOpaque(this.colors.selectionTransparent)&&(this.colors.selectionTransparent=i.color.opacity(this.colors.selectionTransparent,.3)),this.colors.ansi[0]=this._parseColor(e.black,t.DEFAULT_ANSI_COLORS[0]),this.colors.ansi[1]=this._parseColor(e.red,t.DEFAULT_ANSI_COLORS[1]),this.colors.ansi[2]=this._parseColor(e.green,t.DEFAULT_ANSI_COLORS[2]),this.colors.ansi[3]=this._parseColor(e.yellow,t.DEFAULT_ANSI_COLORS[3]),this.colors.ansi[4]=this._parseColor(e.blue,t.DEFAULT_ANSI_COLORS[4]),this.colors.ansi[5]=this._parseColor(e.magenta,t.DEFAULT_ANSI_COLORS[5]),this.colors.ansi[6]=this._parseColor(e.cyan,t.DEFAULT_ANSI_COLORS[6]),this.colors.ansi[7]=this._parseColor(e.white,t.DEFAULT_ANSI_COLORS[7]),this.colors.ansi[8]=this._parseColor(e.brightBlack,t.DEFAULT_ANSI_COLORS[8]),this.colors.ansi[9]=this._parseColor(e.brightRed,t.DEFAULT_ANSI_COLORS[9]),this.colors.ansi[10]=this._parseColor(e.brightGreen,t.DEFAULT_ANSI_COLORS[10]),this.colors.ansi[11]=this._parseColor(e.brightYellow,t.DEFAULT_ANSI_COLORS[11]),this.colors.ansi[12]=this._parseColor(e.brightBlue,t.DEFAULT_ANSI_COLORS[12]),this.colors.ansi[13]=this._parseColor(e.brightMagenta,t.DEFAULT_ANSI_COLORS[13]),this.colors.ansi[14]=this._parseColor(e.brightCyan,t.DEFAULT_ANSI_COLORS[14]),this.colors.ansi[15]=this._parseColor(e.brightWhite,t.DEFAULT_ANSI_COLORS[15]),this._contrastCache.clear()},e.prototype._parseColor=function(e,t,r){if(void 0===r&&(r=this.allowTransparency),void 0===e)return t;if(this._ctx.fillStyle=this._litmusColor,this._ctx.fillStyle=e,"string"!=typeof this._ctx.fillStyle)return console.warn("Color: "+e+" is invalid using fallback "+t.css),t;this._ctx.fillRect(0,0,1,1);var n=this._ctx.getImageData(0,0,1,1).data;if(255!==n[3]){if(!r)return console.warn("Color: "+e+" is using transparency, but allowTransparency is false. Using fallback "+t.css+"."),t;var o=this._ctx.fillStyle.substring(5,this._ctx.fillStyle.length-1).split(",").map((function(e){return Number(e)})),s=o[0],a=o[1],c=o[2],l=o[3],h=Math.round(255*l);return{rgba:i.channels.toRgba(s,a,c,h),css:e}}return{css:this._ctx.fillStyle,rgba:i.channels.toRgba(n[0],n[1],n[2],n[3])}},e}();t.ColorManager=h},9631:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.removeElementFromParent=void 0,t.removeElementFromParent=function(){for(var e,t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var i=0,n=t;i<n.length;i++){var o=n[i];null===(e=null==o?void 0:o.parentElement)||void 0===e||e.removeChild(o)}}},3656:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.addDisposableDomListener=void 0,t.addDisposableDomListener=function(e,t,r,i){e.addEventListener(t,r,i);var n=!1;return{dispose:function(){n||(n=!0,e.removeEventListener(t,r,i))}}}},3551:function(e,t,r){var i=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},n=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.MouseZone=t.Linkifier=void 0;var o=r(8460),s=r(2585),a=function(){function e(e,t,r){this._bufferService=e,this._logService=t,this._unicodeService=r,this._linkMatchers=[],this._nextLinkMatcherId=0,this._onShowLinkUnderline=new o.EventEmitter,this._onHideLinkUnderline=new o.EventEmitter,this._onLinkTooltip=new o.EventEmitter,this._rowsToLinkify={start:void 0,end:void 0}}return Object.defineProperty(e.prototype,"onShowLinkUnderline",{get:function(){return this._onShowLinkUnderline.event},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onHideLinkUnderline",{get:function(){return this._onHideLinkUnderline.event},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onLinkTooltip",{get:function(){return this._onLinkTooltip.event},enumerable:!1,configurable:!0}),e.prototype.attachToDom=function(e,t){this._element=e,this._mouseZoneManager=t},e.prototype.linkifyRows=function(t,r){var i=this;this._mouseZoneManager&&(void 0===this._rowsToLinkify.start||void 0===this._rowsToLinkify.end?(this._rowsToLinkify.start=t,this._rowsToLinkify.end=r):(this._rowsToLinkify.start=Math.min(this._rowsToLinkify.start,t),this._rowsToLinkify.end=Math.max(this._rowsToLinkify.end,r)),this._mouseZoneManager.clearAll(t,r),this._rowsTimeoutId&&clearTimeout(this._rowsTimeoutId),this._rowsTimeoutId=setTimeout((function(){return i._linkifyRows()}),e._timeBeforeLatency))},e.prototype._linkifyRows=function(){this._rowsTimeoutId=void 0;var e=this._bufferService.buffer;if(void 0!==this._rowsToLinkify.start&&void 0!==this._rowsToLinkify.end){var t=e.ydisp+this._rowsToLinkify.start;if(!(t>=e.lines.length)){for(var r=e.ydisp+Math.min(this._rowsToLinkify.end,this._bufferService.rows)+1,i=Math.ceil(2e3/this._bufferService.cols),n=this._bufferService.buffer.iterator(!1,t,r,i,i);n.hasNext();)for(var o=n.next(),s=0;s<this._linkMatchers.length;s++)this._doLinkifyRow(o.range.first,o.content,this._linkMatchers[s]);this._rowsToLinkify.start=void 0,this._rowsToLinkify.end=void 0}}else this._logService.debug("_rowToLinkify was unset before _linkifyRows was called")},e.prototype.registerLinkMatcher=function(e,t,r){if(void 0===r&&(r={}),!t)throw new Error("handler must be defined");var i={id:this._nextLinkMatcherId++,regex:e,handler:t,matchIndex:r.matchIndex,validationCallback:r.validationCallback,hoverTooltipCallback:r.tooltipCallback,hoverLeaveCallback:r.leaveCallback,willLinkActivate:r.willLinkActivate,priority:r.priority||0};return this._addLinkMatcherToList(i),i.id},e.prototype._addLinkMatcherToList=function(e){if(0!==this._linkMatchers.length){for(var t=this._linkMatchers.length-1;t>=0;t--)if(e.priority<=this._linkMatchers[t].priority)return void this._linkMatchers.splice(t+1,0,e);this._linkMatchers.splice(0,0,e)}else this._linkMatchers.push(e)},e.prototype.deregisterLinkMatcher=function(e){for(var t=0;t<this._linkMatchers.length;t++)if(this._linkMatchers[t].id===e)return this._linkMatchers.splice(t,1),!0;return!1},e.prototype._doLinkifyRow=function(e,t,r){for(var i,n=this,o=new RegExp(r.regex.source,(r.regex.flags||"")+"g"),s=-1,a=function(){var a=i["number"!=typeof r.matchIndex?0:r.matchIndex];if(!a)return c._logService.debug("match found without corresponding matchIndex",i,r),"break";if(s=t.indexOf(a,s+1),o.lastIndex=s+a.length,s<0)return"break";var l=c._bufferService.buffer.stringIndexToBufferIndex(e,s);if(l[0]<0)return"break";var h=c._bufferService.buffer.lines.get(l[0]);if(!h)return"break";var u=h.getFg(l[1]),f=u?u>>9&511:void 0;r.validationCallback?r.validationCallback(a,(function(e){n._rowsTimeoutId||e&&n._addLink(l[1],l[0]-n._bufferService.buffer.ydisp,a,r,f)})):c._addLink(l[1],l[0]-c._bufferService.buffer.ydisp,a,r,f)},c=this;null!==(i=o.exec(t))&&"break"!==a(););},e.prototype._addLink=function(e,t,r,i,n){var o=this;if(this._mouseZoneManager&&this._element){var s=this._unicodeService.getStringCellWidth(r),a=e%this._bufferService.cols,l=t+Math.floor(e/this._bufferService.cols),h=(a+s)%this._bufferService.cols,u=l+Math.floor((a+s)/this._bufferService.cols);0===h&&(h=this._bufferService.cols,u--),this._mouseZoneManager.add(new c(a+1,l+1,h+1,u+1,(function(e){if(i.handler)return i.handler(e,r);var t=window.open();t?(t.opener=null,t.location.href=r):console.warn("Opening link blocked as opener could not be cleared")}),(function(){o._onShowLinkUnderline.fire(o._createLinkHoverEvent(a,l,h,u,n)),o._element.classList.add("xterm-cursor-pointer")}),(function(e){o._onLinkTooltip.fire(o._createLinkHoverEvent(a,l,h,u,n)),i.hoverTooltipCallback&&i.hoverTooltipCallback(e,r,{start:{x:a,y:l},end:{x:h,y:u}})}),(function(){o._onHideLinkUnderline.fire(o._createLinkHoverEvent(a,l,h,u,n)),o._element.classList.remove("xterm-cursor-pointer"),i.hoverLeaveCallback&&i.hoverLeaveCallback()}),(function(e){return!i.willLinkActivate||i.willLinkActivate(e,r)})))}},e.prototype._createLinkHoverEvent=function(e,t,r,i,n){return{x1:e,y1:t,x2:r,y2:i,cols:this._bufferService.cols,fg:n}},e._timeBeforeLatency=200,e=i([n(0,s.IBufferService),n(1,s.ILogService),n(2,s.IUnicodeService)],e)}();t.Linkifier=a;var c=function(e,t,r,i,n,o,s,a,c){this.x1=e,this.y1=t,this.x2=r,this.y2=i,this.clickCallback=n,this.hoverCallback=o,this.tooltipCallback=s,this.leaveCallback=a,this.willLinkActivate=c};t.MouseZone=c},6465:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},s=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.Linkifier2=void 0;var a=r(2585),c=r(8460),l=r(844),h=r(3656),u=function(e){function t(t){var r=e.call(this)||this;return r._bufferService=t,r._linkProviders=[],r._linkCacheDisposables=[],r._isMouseOut=!0,r._activeLine=-1,r._onShowLinkUnderline=r.register(new c.EventEmitter),r._onHideLinkUnderline=r.register(new c.EventEmitter),r.register(l.getDisposeArrayDisposable(r._linkCacheDisposables)),r}return n(t,e),Object.defineProperty(t.prototype,"onShowLinkUnderline",{get:function(){return this._onShowLinkUnderline.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onHideLinkUnderline",{get:function(){return this._onHideLinkUnderline.event},enumerable:!1,configurable:!0}),t.prototype.registerLinkProvider=function(e){var t=this;return this._linkProviders.push(e),{dispose:function(){var r=t._linkProviders.indexOf(e);-1!==r&&t._linkProviders.splice(r,1)}}},t.prototype.attachToDom=function(e,t,r){var i=this;this._element=e,this._mouseService=t,this._renderService=r,this.register(h.addDisposableDomListener(this._element,"mouseleave",(function(){i._isMouseOut=!0,i._clearCurrentLink()}))),this.register(h.addDisposableDomListener(this._element,"mousemove",this._onMouseMove.bind(this))),this.register(h.addDisposableDomListener(this._element,"click",this._onClick.bind(this)))},t.prototype._onMouseMove=function(e){if(this._lastMouseEvent=e,this._element&&this._mouseService){var t=this._positionFromMouseEvent(e,this._element,this._mouseService);if(t){this._isMouseOut=!1;for(var r=e.composedPath(),i=0;i<r.length;i++){var n=r[i];if(n.classList.contains("xterm"))break;if(n.classList.contains("xterm-hover"))return}this._lastBufferCell&&t.x===this._lastBufferCell.x&&t.y===this._lastBufferCell.y||(this._onHover(t),this._lastBufferCell=t)}}},t.prototype._onHover=function(e){if(this._activeLine!==e.y)return this._clearCurrentLink(),void this._askForLink(e,!1);this._currentLink&&this._linkAtPosition(this._currentLink.link,e)||(this._clearCurrentLink(),this._askForLink(e,!0))},t.prototype._askForLink=function(e,t){var r,i=this;this._activeProviderReplies&&t||(null===(r=this._activeProviderReplies)||void 0===r||r.forEach((function(e){null==e||e.forEach((function(e){e.link.dispose&&e.link.dispose()}))})),this._activeProviderReplies=new Map,this._activeLine=e.y);var n=!1;this._linkProviders.forEach((function(r,o){var s;t?(null===(s=i._activeProviderReplies)||void 0===s?void 0:s.get(o))&&(n=i._checkLinkProviderResult(o,e,n)):r.provideLinks(e.y,(function(t){var r,s;if(!i._isMouseOut){var a=null==t?void 0:t.map((function(e){return{link:e}}));null===(r=i._activeProviderReplies)||void 0===r||r.set(o,a),n=i._checkLinkProviderResult(o,e,n),(null===(s=i._activeProviderReplies)||void 0===s?void 0:s.size)===i._linkProviders.length&&i._removeIntersectingLinks(e.y,i._activeProviderReplies)}}))}))},t.prototype._removeIntersectingLinks=function(e,t){for(var r=new Set,i=0;i<t.size;i++){var n=t.get(i);if(n)for(var o=0;o<n.length;o++)for(var s=n[o],a=s.link.range.start.y<e?0:s.link.range.start.x,c=s.link.range.end.y>e?this._bufferService.cols:s.link.range.end.x,l=a;l<=c;l++){if(r.has(l)){n.splice(o--,1);break}r.add(l)}}},t.prototype._checkLinkProviderResult=function(e,t,r){var i,n=this;if(!this._activeProviderReplies)return r;for(var o=this._activeProviderReplies.get(e),s=!1,a=0;a<e;a++)this._activeProviderReplies.has(a)&&!this._activeProviderReplies.get(a)||(s=!0);if(!s&&o){var c=o.find((function(e){return n._linkAtPosition(e.link,t)}));c&&(r=!0,this._handleNewLink(c))}if(this._activeProviderReplies.size===this._linkProviders.length&&!r)for(a=0;a<this._activeProviderReplies.size;a++){var l=null===(i=this._activeProviderReplies.get(a))||void 0===i?void 0:i.find((function(e){return n._linkAtPosition(e.link,t)}));if(l){r=!0,this._handleNewLink(l);break}}return r},t.prototype._onClick=function(e){if(this._element&&this._mouseService&&this._currentLink){var t=this._positionFromMouseEvent(e,this._element,this._mouseService);t&&this._linkAtPosition(this._currentLink.link,t)&&this._currentLink.link.activate(e,this._currentLink.link.text)}},t.prototype._clearCurrentLink=function(e,t){this._element&&this._currentLink&&this._lastMouseEvent&&(!e||!t||this._currentLink.link.range.start.y>=e&&this._currentLink.link.range.end.y<=t)&&(this._linkLeave(this._element,this._currentLink.link,this._lastMouseEvent),this._currentLink=void 0,l.disposeArray(this._linkCacheDisposables))},t.prototype._handleNewLink=function(e){var t=this;if(this._element&&this._lastMouseEvent&&this._mouseService){var r=this._positionFromMouseEvent(this._lastMouseEvent,this._element,this._mouseService);r&&this._linkAtPosition(e.link,r)&&(this._currentLink=e,this._currentLink.state={decorations:{underline:void 0===e.link.decorations||e.link.decorations.underline,pointerCursor:void 0===e.link.decorations||e.link.decorations.pointerCursor},isHovered:!0},this._linkHover(this._element,e.link,this._lastMouseEvent),e.link.decorations={},Object.defineProperties(e.link.decorations,{pointerCursor:{get:function(){var e,r;return null===(r=null===(e=t._currentLink)||void 0===e?void 0:e.state)||void 0===r?void 0:r.decorations.pointerCursor},set:function(e){var r,i;(null===(r=t._currentLink)||void 0===r?void 0:r.state)&&t._currentLink.state.decorations.pointerCursor!==e&&(t._currentLink.state.decorations.pointerCursor=e,t._currentLink.state.isHovered&&(null===(i=t._element)||void 0===i||i.classList.toggle("xterm-cursor-pointer",e)))}},underline:{get:function(){var e,r;return null===(r=null===(e=t._currentLink)||void 0===e?void 0:e.state)||void 0===r?void 0:r.decorations.underline},set:function(r){var i,n,o;(null===(i=t._currentLink)||void 0===i?void 0:i.state)&&(null===(o=null===(n=t._currentLink)||void 0===n?void 0:n.state)||void 0===o?void 0:o.decorations.underline)!==r&&(t._currentLink.state.decorations.underline=r,t._currentLink.state.isHovered&&t._fireUnderlineEvent(e.link,r))}}}),this._renderService&&this._linkCacheDisposables.push(this._renderService.onRenderedBufferChange((function(e){var r=0===e.start?0:e.start+1+t._bufferService.buffer.ydisp;t._clearCurrentLink(r,e.end+1+t._bufferService.buffer.ydisp)}))))}},t.prototype._linkHover=function(e,t,r){var i;(null===(i=this._currentLink)||void 0===i?void 0:i.state)&&(this._currentLink.state.isHovered=!0,this._currentLink.state.decorations.underline&&this._fireUnderlineEvent(t,!0),this._currentLink.state.decorations.pointerCursor&&e.classList.add("xterm-cursor-pointer")),t.hover&&t.hover(r,t.text)},t.prototype._fireUnderlineEvent=function(e,t){var r=e.range,i=this._bufferService.buffer.ydisp,n=this._createLinkUnderlineEvent(r.start.x-1,r.start.y-i-1,r.end.x,r.end.y-i-1,void 0);(t?this._onShowLinkUnderline:this._onHideLinkUnderline).fire(n)},t.prototype._linkLeave=function(e,t,r){var i;(null===(i=this._currentLink)||void 0===i?void 0:i.state)&&(this._currentLink.state.isHovered=!1,this._currentLink.state.decorations.underline&&this._fireUnderlineEvent(t,!1),this._currentLink.state.decorations.pointerCursor&&e.classList.remove("xterm-cursor-pointer")),t.leave&&t.leave(r,t.text)},t.prototype._linkAtPosition=function(e,t){var r=e.range.start.y===e.range.end.y,i=e.range.start.y<t.y,n=e.range.end.y>t.y;return(r&&e.range.start.x<=t.x&&e.range.end.x>=t.x||i&&e.range.end.x>=t.x||n&&e.range.start.x<=t.x||i&&n)&&e.range.start.y<=t.y&&e.range.end.y>=t.y},t.prototype._positionFromMouseEvent=function(e,t,r){var i=r.getCoords(e,t,this._bufferService.cols,this._bufferService.rows);if(i)return{x:i[0],y:i[1]+this._bufferService.buffer.ydisp}},t.prototype._createLinkUnderlineEvent=function(e,t,r,i,n){return{x1:e,y1:t,x2:r,y2:i,cols:this._bufferService.cols,fg:n}},o([s(0,a.IBufferService)],t)}(l.Disposable);t.Linkifier2=u},9042:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.tooMuchOutput=t.promptLabel=void 0,t.promptLabel="Terminal input",t.tooMuchOutput="Too much output to announce, navigate to rows manually to read"},6954:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},s=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.MouseZoneManager=void 0;var a=r(844),c=r(3656),l=r(4725),h=r(2585),u=function(e){function t(t,r,i,n,o,s){var a=e.call(this)||this;return a._element=t,a._screenElement=r,a._bufferService=i,a._mouseService=n,a._selectionService=o,a._optionsService=s,a._zones=[],a._areZonesActive=!1,a._lastHoverCoords=[void 0,void 0],a._initialSelectionLength=0,a.register(c.addDisposableDomListener(a._element,"mousedown",(function(e){return a._onMouseDown(e)}))),a._mouseMoveListener=function(e){return a._onMouseMove(e)},a._mouseLeaveListener=function(e){return a._onMouseLeave(e)},a._clickListener=function(e){return a._onClick(e)},a}return n(t,e),t.prototype.dispose=function(){e.prototype.dispose.call(this),this._deactivate()},t.prototype.add=function(e){this._zones.push(e),1===this._zones.length&&this._activate()},t.prototype.clearAll=function(e,t){if(0!==this._zones.length){e&&t||(e=0,t=this._bufferService.rows-1);for(var r=0;r<this._zones.length;r++){var i=this._zones[r];(i.y1>e&&i.y1<=t+1||i.y2>e&&i.y2<=t+1||i.y1<e&&i.y2>t+1)&&(this._currentZone&&this._currentZone===i&&(this._currentZone.leaveCallback(),this._currentZone=void 0),this._zones.splice(r--,1))}0===this._zones.length&&this._deactivate()}},t.prototype._activate=function(){this._areZonesActive||(this._areZonesActive=!0,this._element.addEventListener("mousemove",this._mouseMoveListener),this._element.addEventListener("mouseleave",this._mouseLeaveListener),this._element.addEventListener("click",this._clickListener))},t.prototype._deactivate=function(){this._areZonesActive&&(this._areZonesActive=!1,this._element.removeEventListener("mousemove",this._mouseMoveListener),this._element.removeEventListener("mouseleave",this._mouseLeaveListener),this._element.removeEventListener("click",this._clickListener))},t.prototype._onMouseMove=function(e){this._lastHoverCoords[0]===e.pageX&&this._lastHoverCoords[1]===e.pageY||(this._onHover(e),this._lastHoverCoords=[e.pageX,e.pageY])},t.prototype._onHover=function(e){var t=this,r=this._findZoneEventAt(e);r!==this._currentZone&&(this._currentZone&&(this._currentZone.leaveCallback(),this._currentZone=void 0,this._tooltipTimeout&&clearTimeout(this._tooltipTimeout)),r&&(this._currentZone=r,r.hoverCallback&&r.hoverCallback(e),this._tooltipTimeout=window.setTimeout((function(){return t._onTooltip(e)}),this._optionsService.options.linkTooltipHoverDuration)))},t.prototype._onTooltip=function(e){this._tooltipTimeout=void 0;var t=this._findZoneEventAt(e);t&&t.tooltipCallback&&t.tooltipCallback(e)},t.prototype._onMouseDown=function(e){if(this._initialSelectionLength=this._getSelectionLength(),this._areZonesActive){var t=this._findZoneEventAt(e);(null==t?void 0:t.willLinkActivate(e))&&(e.preventDefault(),e.stopImmediatePropagation())}},t.prototype._onMouseLeave=function(e){this._currentZone&&(this._currentZone.leaveCallback(),this._currentZone=void 0,this._tooltipTimeout&&clearTimeout(this._tooltipTimeout))},t.prototype._onClick=function(e){var t=this._findZoneEventAt(e),r=this._getSelectionLength();t&&r===this._initialSelectionLength&&(t.clickCallback(e),e.preventDefault(),e.stopImmediatePropagation())},t.prototype._getSelectionLength=function(){var e=this._selectionService.selectionText;return e?e.length:0},t.prototype._findZoneEventAt=function(e){var t=this._mouseService.getCoords(e,this._screenElement,this._bufferService.cols,this._bufferService.rows);if(t)for(var r=t[0],i=t[1],n=0;n<this._zones.length;n++){var o=this._zones[n];if(o.y1===o.y2){if(i===o.y1&&r>=o.x1&&r<o.x2)return o}else if(i===o.y1&&r>=o.x1||i===o.y2&&r<o.x2||i>o.y1&&i<o.y2)return o}},o([s(2,h.IBufferService),s(3,l.IMouseService),s(4,l.ISelectionService),s(5,h.IOptionsService)],t)}(a.Disposable);t.MouseZoneManager=u},6193:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.RenderDebouncer=void 0;var r=function(){function e(e){this._renderCallback=e}return e.prototype.dispose=function(){this._animationFrame&&(window.cancelAnimationFrame(this._animationFrame),this._animationFrame=void 0)},e.prototype.refresh=function(e,t,r){var i=this;this._rowCount=r,e=void 0!==e?e:0,t=void 0!==t?t:this._rowCount-1,this._rowStart=void 0!==this._rowStart?Math.min(this._rowStart,e):e,this._rowEnd=void 0!==this._rowEnd?Math.max(this._rowEnd,t):t,this._animationFrame||(this._animationFrame=window.requestAnimationFrame((function(){return i._innerRefresh()})))},e.prototype._innerRefresh=function(){if(void 0!==this._rowStart&&void 0!==this._rowEnd&&void 0!==this._rowCount){var e=Math.max(this._rowStart,0),t=Math.min(this._rowEnd,this._rowCount-1);this._rowStart=void 0,this._rowEnd=void 0,this._animationFrame=void 0,this._renderCallback(e,t)}},e}();t.RenderDebouncer=r},5596:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.ScreenDprMonitor=void 0;var o=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t._currentDevicePixelRatio=window.devicePixelRatio,t}return n(t,e),t.prototype.setListener=function(e){var t=this;this._listener&&this.clearListener(),this._listener=e,this._outerListener=function(){t._listener&&(t._listener(window.devicePixelRatio,t._currentDevicePixelRatio),t._updateDpr())},this._updateDpr()},t.prototype.dispose=function(){e.prototype.dispose.call(this),this.clearListener()},t.prototype._updateDpr=function(){var e;this._outerListener&&(null===(e=this._resolutionMediaMatchList)||void 0===e||e.removeListener(this._outerListener),this._currentDevicePixelRatio=window.devicePixelRatio,this._resolutionMediaMatchList=window.matchMedia("screen and (resolution: "+window.devicePixelRatio+"dppx)"),this._resolutionMediaMatchList.addListener(this._outerListener))},t.prototype.clearListener=function(){this._resolutionMediaMatchList&&this._listener&&this._outerListener&&(this._resolutionMediaMatchList.removeListener(this._outerListener),this._resolutionMediaMatchList=void 0,this._listener=void 0,this._outerListener=void 0)},t}(r(844).Disposable);t.ScreenDprMonitor=o},3236:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.Terminal=void 0;var o=r(2950),s=r(1680),a=r(3614),c=r(2584),l=r(5435),h=r(3525),u=r(3551),f=r(9312),_=r(6114),d=r(3656),p=r(9042),v=r(357),g=r(6954),y=r(4567),b=r(1296),S=r(7399),m=r(8460),C=r(8437),w=r(5680),E=r(3230),L=r(4725),A=r(428),R=r(8934),k=r(6465),x=r(5114),D=r(8969),T=r(4774),O="undefined"!=typeof window?window.document:null,M=function(e){function t(t){void 0===t&&(t={});var r=e.call(this,t)||this;return r.browser=_,r._keyDownHandled=!1,r._onCursorMove=new m.EventEmitter,r._onKey=new m.EventEmitter,r._onRender=new m.EventEmitter,r._onSelectionChange=new m.EventEmitter,r._onTitleChange=new m.EventEmitter,r._onFocus=new m.EventEmitter,r._onBlur=new m.EventEmitter,r._onA11yCharEmitter=new m.EventEmitter,r._onA11yTabEmitter=new m.EventEmitter,r._setup(),r.linkifier=r._instantiationService.createInstance(u.Linkifier),r.linkifier2=r.register(r._instantiationService.createInstance(k.Linkifier2)),r.register(r._inputHandler.onRequestBell((function(){return r.bell()}))),r.register(r._inputHandler.onRequestRefreshRows((function(e,t){return r.refresh(e,t)}))),r.register(r._inputHandler.onRequestReset((function(){return r.reset()}))),r.register(r._inputHandler.onRequestScroll((function(e,t){return r.scroll(e,t||void 0)}))),r.register(r._inputHandler.onRequestWindowsOptionsReport((function(e){return r._reportWindowsOptions(e)}))),r.register(r._inputHandler.onAnsiColorChange((function(e){return r._changeAnsiColor(e)}))),r.register(m.forwardEvent(r._inputHandler.onCursorMove,r._onCursorMove)),r.register(m.forwardEvent(r._inputHandler.onTitleChange,r._onTitleChange)),r.register(m.forwardEvent(r._inputHandler.onA11yChar,r._onA11yCharEmitter)),r.register(m.forwardEvent(r._inputHandler.onA11yTab,r._onA11yTabEmitter)),r.register(r._bufferService.onResize((function(e){return r._afterResize(e.cols,e.rows)}))),r}return n(t,e),Object.defineProperty(t.prototype,"options",{get:function(){return this.optionsService.options},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onCursorMove",{get:function(){return this._onCursorMove.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onKey",{get:function(){return this._onKey.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onRender",{get:function(){return this._onRender.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onSelectionChange",{get:function(){return this._onSelectionChange.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onTitleChange",{get:function(){return this._onTitleChange.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onFocus",{get:function(){return this._onFocus.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onBlur",{get:function(){return this._onBlur.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onA11yChar",{get:function(){return this._onA11yCharEmitter.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onA11yTab",{get:function(){return this._onA11yTabEmitter.event},enumerable:!1,configurable:!0}),t.prototype._changeAnsiColor=function(e){var t,r,i=this;this._colorManager&&(e.colors.forEach((function(e){var t=T.rgba.toColor(e.red,e.green,e.blue);i._colorManager.colors.ansi[e.colorIndex]=t})),null===(t=this._renderService)||void 0===t||t.setColors(this._colorManager.colors),null===(r=this.viewport)||void 0===r||r.onThemeChange(this._colorManager.colors))},t.prototype.dispose=function(){var t,r,i;this._isDisposed||(e.prototype.dispose.call(this),null===(t=this._renderService)||void 0===t||t.dispose(),this._customKeyEventHandler=void 0,this.write=function(){},null===(i=null===(r=this.element)||void 0===r?void 0:r.parentNode)||void 0===i||i.removeChild(this.element))},t.prototype._setup=function(){e.prototype._setup.call(this),this._customKeyEventHandler=void 0},Object.defineProperty(t.prototype,"buffer",{get:function(){return this.buffers.active},enumerable:!1,configurable:!0}),t.prototype.focus=function(){this.textarea&&this.textarea.focus({preventScroll:!0})},t.prototype._updateOptions=function(t){var r,i,n,o;switch(e.prototype._updateOptions.call(this,t),t){case"fontFamily":case"fontSize":null===(r=this._renderService)||void 0===r||r.clear(),null===(i=this._charSizeService)||void 0===i||i.measure();break;case"cursorBlink":case"cursorStyle":this.refresh(this.buffer.y,this.buffer.y);break;case"drawBoldTextInBrightColors":case"letterSpacing":case"lineHeight":case"fontWeight":case"fontWeightBold":case"minimumContrastRatio":this._renderService&&(this._renderService.clear(),this._renderService.onResize(this.cols,this.rows),this.refresh(0,this.rows-1));break;case"rendererType":this._renderService&&(this._renderService.setRenderer(this._createRenderer()),this._renderService.onResize(this.cols,this.rows));break;case"scrollback":null===(n=this.viewport)||void 0===n||n.syncScrollArea();break;case"screenReaderMode":this.optionsService.options.screenReaderMode?!this._accessibilityManager&&this._renderService&&(this._accessibilityManager=new y.AccessibilityManager(this,this._renderService)):(null===(o=this._accessibilityManager)||void 0===o||o.dispose(),this._accessibilityManager=void 0);break;case"tabStopWidth":this.buffers.setupTabStops();break;case"theme":this._setTheme(this.optionsService.options.theme)}},t.prototype._onTextAreaFocus=function(e){this._coreService.decPrivateModes.sendFocus&&this._coreService.triggerDataEvent(c.C0.ESC+"[I"),this.updateCursorStyle(e),this.element.classList.add("focus"),this._showCursor(),this._onFocus.fire()},t.prototype.blur=function(){var e;return null===(e=this.textarea)||void 0===e?void 0:e.blur()},t.prototype._onTextAreaBlur=function(){this.textarea.value="",this.refresh(this.buffer.y,this.buffer.y),this._coreService.decPrivateModes.sendFocus&&this._coreService.triggerDataEvent(c.C0.ESC+"[O"),this.element.classList.remove("focus"),this._onBlur.fire()},t.prototype._syncTextArea=function(){if(this.textarea&&this.buffer.isCursorInViewport&&!this._compositionHelper.isComposing){var e=Math.ceil(this._charSizeService.height*this.optionsService.options.lineHeight),t=this._bufferService.buffer.y*e,r=this._bufferService.buffer.x*this._charSizeService.width;this.textarea.style.left=r+"px",this.textarea.style.top=t+"px",this.textarea.style.width=this._charSizeService.width+"px",this.textarea.style.height=e+"px",this.textarea.style.lineHeight=e+"px",this.textarea.style.zIndex="-5"}},t.prototype._initGlobal=function(){var e=this;this._bindKeys(),this.register(d.addDisposableDomListener(this.element,"copy",(function(t){e.hasSelection()&&a.copyHandler(t,e._selectionService)})));var t=function(t){return a.handlePasteEvent(t,e.textarea,e._coreService)};this.register(d.addDisposableDomListener(this.textarea,"paste",t)),this.register(d.addDisposableDomListener(this.element,"paste",t)),_.isFirefox?this.register(d.addDisposableDomListener(this.element,"mousedown",(function(t){2===t.button&&a.rightClickHandler(t,e.textarea,e.screenElement,e._selectionService,e.options.rightClickSelectsWord)}))):this.register(d.addDisposableDomListener(this.element,"contextmenu",(function(t){a.rightClickHandler(t,e.textarea,e.screenElement,e._selectionService,e.options.rightClickSelectsWord)}))),_.isLinux&&this.register(d.addDisposableDomListener(this.element,"auxclick",(function(t){1===t.button&&a.moveTextAreaUnderMouseCursor(t,e.textarea,e.screenElement)})))},t.prototype._bindKeys=function(){var e=this;this.register(d.addDisposableDomListener(this.textarea,"keyup",(function(t){return e._keyUp(t)}),!0)),this.register(d.addDisposableDomListener(this.textarea,"keydown",(function(t){return e._keyDown(t)}),!0)),this.register(d.addDisposableDomListener(this.textarea,"keypress",(function(t){return e._keyPress(t)}),!0)),this.register(d.addDisposableDomListener(this.textarea,"compositionstart",(function(){return e._compositionHelper.compositionstart()}))),this.register(d.addDisposableDomListener(this.textarea,"compositionupdate",(function(t){return e._compositionHelper.compositionupdate(t)}))),this.register(d.addDisposableDomListener(this.textarea,"compositionend",(function(){return e._compositionHelper.compositionend()}))),this.register(this.onRender((function(){return e._compositionHelper.updateCompositionElements()}))),this.register(this.onRender((function(t){return e._queueLinkification(t.start,t.end)})))},t.prototype.open=function(e){var t=this;if(!e)throw new Error("Terminal requires a parent element.");e.isConnected||this._logService.debug("Terminal.open was called on an element that was not attached to the DOM"),this._document=e.ownerDocument,this.element=this._document.createElement("div"),this.element.dir="ltr",this.element.classList.add("terminal"),this.element.classList.add("xterm"),this.element.setAttribute("tabindex","0"),this.element.setAttribute("role","document"),e.appendChild(this.element);var r=O.createDocumentFragment();this._viewportElement=O.createElement("div"),this._viewportElement.classList.add("xterm-viewport"),r.appendChild(this._viewportElement),this._viewportScrollArea=O.createElement("div"),this._viewportScrollArea.classList.add("xterm-scroll-area"),this._viewportElement.appendChild(this._viewportScrollArea),this.screenElement=O.createElement("div"),this.screenElement.classList.add("xterm-screen"),this._helperContainer=O.createElement("div"),this._helperContainer.classList.add("xterm-helpers"),this.screenElement.appendChild(this._helperContainer),r.appendChild(this.screenElement),this.textarea=O.createElement("textarea"),this.textarea.classList.add("xterm-helper-textarea"),this.textarea.setAttribute("aria-label",p.promptLabel),this.textarea.setAttribute("aria-multiline","false"),this.textarea.setAttribute("autocorrect","off"),this.textarea.setAttribute("autocapitalize","off"),this.textarea.setAttribute("spellcheck","false"),this.textarea.tabIndex=0,this.register(d.addDisposableDomListener(this.textarea,"focus",(function(e){return t._onTextAreaFocus(e)}))),this.register(d.addDisposableDomListener(this.textarea,"blur",(function(){return t._onTextAreaBlur()}))),this._helperContainer.appendChild(this.textarea);var i=this._instantiationService.createInstance(x.CoreBrowserService,this.textarea);this._instantiationService.setService(L.ICoreBrowserService,i),this._charSizeService=this._instantiationService.createInstance(A.CharSizeService,this._document,this._helperContainer),this._instantiationService.setService(L.ICharSizeService,this._charSizeService),this._compositionView=O.createElement("div"),this._compositionView.classList.add("composition-view"),this._compositionHelper=this._instantiationService.createInstance(o.CompositionHelper,this.textarea,this._compositionView),this._helperContainer.appendChild(this._compositionView),this.element.appendChild(r),this._theme=this.options.theme||this._theme,this._colorManager=new w.ColorManager(O,this.options.allowTransparency),this.register(this.optionsService.onOptionChange((function(e){return t._colorManager.onOptionsChange(e)}))),this._colorManager.setTheme(this._theme);var n=this._createRenderer();this._renderService=this.register(this._instantiationService.createInstance(E.RenderService,n,this.rows,this.screenElement)),this._instantiationService.setService(L.IRenderService,this._renderService),this.register(this._renderService.onRenderedBufferChange((function(e){return t._onRender.fire(e)}))),this.onResize((function(e){return t._renderService.resize(e.cols,e.rows)})),this._soundService=this._instantiationService.createInstance(v.SoundService),this._instantiationService.setService(L.ISoundService,this._soundService),this._mouseService=this._instantiationService.createInstance(R.MouseService),this._instantiationService.setService(L.IMouseService,this._mouseService),this.viewport=this._instantiationService.createInstance(s.Viewport,(function(e,r){return t.scrollLines(e,r)}),this._viewportElement,this._viewportScrollArea),this.viewport.onThemeChange(this._colorManager.colors),this.register(this._inputHandler.onRequestSyncScrollBar((function(){return t.viewport.syncScrollArea()}))),this.register(this.viewport),this.register(this.onCursorMove((function(){t._renderService.onCursorMove(),t._syncTextArea()}))),this.register(this.onResize((function(){return t._renderService.onResize(t.cols,t.rows)}))),this.register(this.onBlur((function(){return t._renderService.onBlur()}))),this.register(this.onFocus((function(){return t._renderService.onFocus()}))),this.register(this._renderService.onDimensionsChange((function(){return t.viewport.syncScrollArea()}))),this._selectionService=this.register(this._instantiationService.createInstance(f.SelectionService,this.element,this.screenElement)),this._instantiationService.setService(L.ISelectionService,this._selectionService),this.register(this._selectionService.onRequestScrollLines((function(e){return t.scrollLines(e.amount,e.suppressScrollEvent)}))),this.register(this._selectionService.onSelectionChange((function(){return t._onSelectionChange.fire()}))),this.register(this._selectionService.onRequestRedraw((function(e){return t._renderService.onSelectionChanged(e.start,e.end,e.columnSelectMode)}))),this.register(this._selectionService.onLinuxMouseSelection((function(e){t.textarea.value=e,t.textarea.focus(),t.textarea.select()}))),this.register(this.onScroll((function(){t.viewport.syncScrollArea(),t._selectionService.refresh()}))),this.register(d.addDisposableDomListener(this._viewportElement,"scroll",(function(){return t._selectionService.refresh()}))),this._mouseZoneManager=this._instantiationService.createInstance(g.MouseZoneManager,this.element,this.screenElement),this.register(this._mouseZoneManager),this.register(this.onScroll((function(){return t._mouseZoneManager.clearAll()}))),this.linkifier.attachToDom(this.element,this._mouseZoneManager),this.linkifier2.attachToDom(this.element,this._mouseService,this._renderService),this.register(d.addDisposableDomListener(this.element,"mousedown",(function(e){return t._selectionService.onMouseDown(e)}))),this._coreMouseService.areMouseEventsActive?(this._selectionService.disable(),this.element.classList.add("enable-mouse-events")):this._selectionService.enable(),this.options.screenReaderMode&&(this._accessibilityManager=new y.AccessibilityManager(this,this._renderService)),this._charSizeService.measure(),this.refresh(0,this.rows-1),this._initGlobal(),this.bindMouse()},t.prototype._createRenderer=function(){switch(this.options.rendererType){case"canvas":return this._instantiationService.createInstance(h.Renderer,this._colorManager.colors,this.screenElement,this.linkifier,this.linkifier2);case"dom":return this._instantiationService.createInstance(b.DomRenderer,this._colorManager.colors,this.element,this.screenElement,this._viewportElement,this.linkifier,this.linkifier2);default:throw new Error('Unrecognized rendererType "'+this.options.rendererType+'"')}},t.prototype._setTheme=function(e){var t,r,i;this._theme=e,null===(t=this._colorManager)||void 0===t||t.setTheme(e),null===(r=this._renderService)||void 0===r||r.setColors(this._colorManager.colors),null===(i=this.viewport)||void 0===i||i.onThemeChange(this._colorManager.colors)},t.prototype.bindMouse=function(){var e=this,t=this,r=this.element;function i(e){var r,i,n=t._mouseService.getRawByteCoords(e,t.screenElement,t.cols,t.rows);if(!n)return!1;switch(e.overrideType||e.type){case"mousemove":i=32,void 0===e.buttons?(r=3,void 0!==e.button&&(r=e.button<3?e.button:3)):r=1&e.buttons?0:4&e.buttons?1:2&e.buttons?2:3;break;case"mouseup":i=0,r=e.button<3?e.button:3;break;case"mousedown":i=1,r=e.button<3?e.button:3;break;case"wheel":0!==e.deltaY&&(i=e.deltaY<0?0:1),r=4;break;default:return!1}return!(void 0===i||void 0===r||r>4)&&t._coreMouseService.triggerMouseEvent({col:n.x-33,row:n.y-33,button:r,action:i,ctrl:e.ctrlKey,alt:e.altKey,shift:e.shiftKey})}var n={mouseup:null,wheel:null,mousedrag:null,mousemove:null},o=function(t){return i(t),t.buttons||(e._document.removeEventListener("mouseup",n.mouseup),n.mousedrag&&e._document.removeEventListener("mousemove",n.mousedrag)),e.cancel(t)},s=function(t){return i(t),t.preventDefault(),e.cancel(t)},a=function(e){e.buttons&&i(e)},l=function(e){e.buttons||i(e)};this.register(this._coreMouseService.onProtocolChange((function(t){t?("debug"===e.optionsService.options.logLevel&&e._logService.debug("Binding to mouse events:",e._coreMouseService.explainEvents(t)),e.element.classList.add("enable-mouse-events"),e._selectionService.disable()):(e._logService.debug("Unbinding from mouse events."),e.element.classList.remove("enable-mouse-events"),e._selectionService.enable()),8&t?n.mousemove||(r.addEventListener("mousemove",l),n.mousemove=l):(r.removeEventListener("mousemove",n.mousemove),n.mousemove=null),16&t?n.wheel||(r.addEventListener("wheel",s,{passive:!1}),n.wheel=s):(r.removeEventListener("wheel",n.wheel),n.wheel=null),2&t?n.mouseup||(n.mouseup=o):(e._document.removeEventListener("mouseup",n.mouseup),n.mouseup=null),4&t?n.mousedrag||(n.mousedrag=a):(e._document.removeEventListener("mousemove",n.mousedrag),n.mousedrag=null)}))),this._coreMouseService.activeProtocol=this._coreMouseService.activeProtocol,this.register(d.addDisposableDomListener(r,"mousedown",(function(t){if(t.preventDefault(),e.focus(),e._coreMouseService.areMouseEventsActive&&!e._selectionService.shouldForceSelection(t))return i(t),n.mouseup&&e._document.addEventListener("mouseup",n.mouseup),n.mousedrag&&e._document.addEventListener("mousemove",n.mousedrag),e.cancel(t)}))),this.register(d.addDisposableDomListener(r,"wheel",(function(t){if(n.wheel);else if(!e.buffer.hasScrollback){var r=e.viewport.getLinesScrolled(t);if(0===r)return;for(var i=c.C0.ESC+(e._coreService.decPrivateModes.applicationCursorKeys?"O":"[")+(t.deltaY<0?"A":"B"),o="",s=0;s<Math.abs(r);s++)o+=i;e._coreService.triggerDataEvent(o,!0)}}),{passive:!0})),this.register(d.addDisposableDomListener(r,"wheel",(function(t){if(!n.wheel)return e.viewport.onWheel(t)?void 0:e.cancel(t)}),{passive:!1})),this.register(d.addDisposableDomListener(r,"touchstart",(function(t){if(!e._coreMouseService.areMouseEventsActive)return e.viewport.onTouchStart(t),e.cancel(t)}),{passive:!0})),this.register(d.addDisposableDomListener(r,"touchmove",(function(t){if(!e._coreMouseService.areMouseEventsActive)return e.viewport.onTouchMove(t)?void 0:e.cancel(t)}),{passive:!1}))},t.prototype.refresh=function(e,t){var r;null===(r=this._renderService)||void 0===r||r.refreshRows(e,t)},t.prototype._queueLinkification=function(e,t){var r;null===(r=this.linkifier)||void 0===r||r.linkifyRows(e,t)},t.prototype.updateCursorStyle=function(e){this._selectionService&&this._selectionService.shouldColumnSelect(e)?this.element.classList.add("column-select"):this.element.classList.remove("column-select")},t.prototype._showCursor=function(){this._coreService.isCursorInitialized||(this._coreService.isCursorInitialized=!0,this.refresh(this.buffer.y,this.buffer.y))},t.prototype.scrollLines=function(t,r){e.prototype.scrollLines.call(this,t,r),this.refresh(0,this.rows-1)},t.prototype.paste=function(e){a.paste(e,this.textarea,this._coreService)},t.prototype.attachCustomKeyEventHandler=function(e){this._customKeyEventHandler=e},t.prototype.registerLinkMatcher=function(e,t,r){var i=this.linkifier.registerLinkMatcher(e,t,r);return this.refresh(0,this.rows-1),i},t.prototype.deregisterLinkMatcher=function(e){this.linkifier.deregisterLinkMatcher(e)&&this.refresh(0,this.rows-1)},t.prototype.registerLinkProvider=function(e){return this.linkifier2.registerLinkProvider(e)},t.prototype.registerCharacterJoiner=function(e){var t=this._renderService.registerCharacterJoiner(e);return this.refresh(0,this.rows-1),t},t.prototype.deregisterCharacterJoiner=function(e){this._renderService.deregisterCharacterJoiner(e)&&this.refresh(0,this.rows-1)},Object.defineProperty(t.prototype,"markers",{get:function(){return this.buffer.markers},enumerable:!1,configurable:!0}),t.prototype.addMarker=function(e){if(this.buffer===this.buffers.normal)return this.buffer.addMarker(this.buffer.ybase+this.buffer.y+e)},t.prototype.hasSelection=function(){return!!this._selectionService&&this._selectionService.hasSelection},t.prototype.select=function(e,t,r){this._selectionService.setSelection(e,t,r)},t.prototype.getSelection=function(){return this._selectionService?this._selectionService.selectionText:""},t.prototype.getSelectionPosition=function(){if(this._selectionService&&this._selectionService.hasSelection)return{startColumn:this._selectionService.selectionStart[0],startRow:this._selectionService.selectionStart[1],endColumn:this._selectionService.selectionEnd[0],endRow:this._selectionService.selectionEnd[1]}},t.prototype.clearSelection=function(){var e;null===(e=this._selectionService)||void 0===e||e.clearSelection()},t.prototype.selectAll=function(){var e;null===(e=this._selectionService)||void 0===e||e.selectAll()},t.prototype.selectLines=function(e,t){var r;null===(r=this._selectionService)||void 0===r||r.selectLines(e,t)},t.prototype._keyDown=function(e){if(this._keyDownHandled=!1,this._customKeyEventHandler&&!1===this._customKeyEventHandler(e))return!1;if(!this._compositionHelper.keydown(e))return this.buffer.ybase!==this.buffer.ydisp&&this.scrollToBottom(),!1;var t=S.evaluateKeyboardEvent(e,this._coreService.decPrivateModes.applicationCursorKeys,this.browser.isMac,this.options.macOptionIsMeta);if(this.updateCursorStyle(e),3===t.type||2===t.type){var r=this.rows-1;return this.scrollLines(2===t.type?-r:r),this.cancel(e,!0)}return 1===t.type&&this.selectAll(),!!this._isThirdLevelShift(this.browser,e)||(t.cancel&&this.cancel(e,!0),!t.key||(t.key!==c.C0.ETX&&t.key!==c.C0.CR||(this.textarea.value=""),this._onKey.fire({key:t.key,domEvent:e}),this._showCursor(),this._coreService.triggerDataEvent(t.key,!0),this.optionsService.options.screenReaderMode?void(this._keyDownHandled=!0):this.cancel(e,!0)))},t.prototype._isThirdLevelShift=function(e,t){var r=e.isMac&&!this.options.macOptionIsMeta&&t.altKey&&!t.ctrlKey&&!t.metaKey||e.isWindows&&t.altKey&&t.ctrlKey&&!t.metaKey;return"keypress"===t.type?r:r&&(!t.keyCode||t.keyCode>47)},t.prototype._keyUp=function(e){this._customKeyEventHandler&&!1===this._customKeyEventHandler(e)||(function(e){return 16===e.keyCode||17===e.keyCode||18===e.keyCode}(e)||this.focus(),this.updateCursorStyle(e))},t.prototype._keyPress=function(e){var t;if(this._keyDownHandled)return!1;if(this._customKeyEventHandler&&!1===this._customKeyEventHandler(e))return!1;if(this.cancel(e),e.charCode)t=e.charCode;else if(null===e.which||void 0===e.which)t=e.keyCode;else{if(0===e.which||0===e.charCode)return!1;t=e.which}return!(!t||(e.altKey||e.ctrlKey||e.metaKey)&&!this._isThirdLevelShift(this.browser,e)||(t=String.fromCharCode(t),this._onKey.fire({key:t,domEvent:e}),this._showCursor(),this._coreService.triggerDataEvent(t,!0),0))},t.prototype.bell=function(){this._soundBell()&&this._soundService.playBellSound()},t.prototype.resize=function(t,r){t!==this.cols||r!==this.rows?e.prototype.resize.call(this,t,r):this._charSizeService&&!this._charSizeService.hasValidSize&&this._charSizeService.measure()},t.prototype._afterResize=function(e,t){var r,i;null===(r=this._charSizeService)||void 0===r||r.measure(),null===(i=this.viewport)||void 0===i||i.syncScrollArea(!0)},t.prototype.clear=function(){if(0!==this.buffer.ybase||0!==this.buffer.y){this.buffer.lines.set(0,this.buffer.lines.get(this.buffer.ybase+this.buffer.y)),this.buffer.lines.length=1,this.buffer.ydisp=0,this.buffer.ybase=0,this.buffer.y=0;for(var e=1;e<this.rows;e++)this.buffer.lines.push(this.buffer.getBlankLine(C.DEFAULT_ATTR_DATA));this.refresh(0,this.rows-1),this._onScroll.fire(this.buffer.ydisp)}},t.prototype.reset=function(){var t,r;this.options.rows=this.rows,this.options.cols=this.cols;var i=this._customKeyEventHandler;this._setup(),e.prototype.reset.call(this),null===(t=this._selectionService)||void 0===t||t.reset(),this._customKeyEventHandler=i,this.refresh(0,this.rows-1),null===(r=this.viewport)||void 0===r||r.syncScrollArea()},t.prototype._reportWindowsOptions=function(e){if(this._renderService)switch(e){case l.WindowsOptionsReportType.GET_WIN_SIZE_PIXELS:var t=this._renderService.dimensions.scaledCanvasWidth.toFixed(0),r=this._renderService.dimensions.scaledCanvasHeight.toFixed(0);this._coreService.triggerDataEvent(c.C0.ESC+"[4;"+r+";"+t+"t");break;case l.WindowsOptionsReportType.GET_CELL_SIZE_PIXELS:var i=this._renderService.dimensions.scaledCellWidth.toFixed(0),n=this._renderService.dimensions.scaledCellHeight.toFixed(0);this._coreService.triggerDataEvent(c.C0.ESC+"[6;"+n+";"+i+"t")}},t.prototype.cancel=function(e,t){if(this.options.cancelEvents||t)return e.preventDefault(),e.stopPropagation(),!1},t.prototype._visualBell=function(){return!1},t.prototype._soundBell=function(){return"sound"===this.options.bellStyle},t}(D.CoreTerminal);t.Terminal=M},1680:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},s=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.Viewport=void 0;var a=r(844),c=r(3656),l=r(4725),h=r(2585),u=function(e){function t(t,r,i,n,o,s,a){var l=e.call(this)||this;return l._scrollLines=t,l._viewportElement=r,l._scrollArea=i,l._bufferService=n,l._optionsService=o,l._charSizeService=s,l._renderService=a,l.scrollBarWidth=0,l._currentRowHeight=0,l._lastRecordedBufferLength=0,l._lastRecordedViewportHeight=0,l._lastRecordedBufferHeight=0,l._lastTouchY=0,l._lastScrollTop=0,l._wheelPartialScroll=0,l._refreshAnimationFrame=null,l._ignoreNextScrollEvent=!1,l.scrollBarWidth=l._viewportElement.offsetWidth-l._scrollArea.offsetWidth||15,l.register(c.addDisposableDomListener(l._viewportElement,"scroll",l._onScroll.bind(l))),setTimeout((function(){return l.syncScrollArea()}),0),l}return n(t,e),t.prototype.onThemeChange=function(e){this._viewportElement.style.backgroundColor=e.background.css},t.prototype._refresh=function(e){var t=this;if(e)return this._innerRefresh(),void(null!==this._refreshAnimationFrame&&cancelAnimationFrame(this._refreshAnimationFrame));null===this._refreshAnimationFrame&&(this._refreshAnimationFrame=requestAnimationFrame((function(){return t._innerRefresh()})))},t.prototype._innerRefresh=function(){if(this._charSizeService.height>0){this._currentRowHeight=this._renderService.dimensions.scaledCellHeight/window.devicePixelRatio,this._lastRecordedViewportHeight=this._viewportElement.offsetHeight;var e=Math.round(this._currentRowHeight*this._lastRecordedBufferLength)+(this._lastRecordedViewportHeight-this._renderService.dimensions.canvasHeight);this._lastRecordedBufferHeight!==e&&(this._lastRecordedBufferHeight=e,this._scrollArea.style.height=this._lastRecordedBufferHeight+"px")}var t=this._bufferService.buffer.ydisp*this._currentRowHeight;this._viewportElement.scrollTop!==t&&(this._ignoreNextScrollEvent=!0,this._viewportElement.scrollTop=t),this._refreshAnimationFrame=null},t.prototype.syncScrollArea=function(e){if(void 0===e&&(e=!1),this._lastRecordedBufferLength!==this._bufferService.buffer.lines.length)return this._lastRecordedBufferLength=this._bufferService.buffer.lines.length,void this._refresh(e);if(this._lastRecordedViewportHeight===this._renderService.dimensions.canvasHeight){var t=this._bufferService.buffer.ydisp*this._currentRowHeight;this._lastScrollTop===t&&this._lastScrollTop===this._viewportElement.scrollTop&&this._renderService.dimensions.scaledCellHeight/window.devicePixelRatio===this._currentRowHeight||this._refresh(e)}else this._refresh(e)},t.prototype._onScroll=function(e){if(this._lastScrollTop=this._viewportElement.scrollTop,this._viewportElement.offsetParent)if(this._ignoreNextScrollEvent)this._ignoreNextScrollEvent=!1;else{var t=Math.round(this._lastScrollTop/this._currentRowHeight)-this._bufferService.buffer.ydisp;this._scrollLines(t,!0)}},t.prototype._bubbleScroll=function(e,t){var r=this._viewportElement.scrollTop+this._lastRecordedViewportHeight;return!(t<0&&0!==this._viewportElement.scrollTop||t>0&&r<this._lastRecordedBufferHeight)||(e.cancelable&&e.preventDefault(),!1)},t.prototype.onWheel=function(e){var t=this._getPixelsScrolled(e);return 0!==t&&(this._viewportElement.scrollTop+=t,this._bubbleScroll(e,t))},t.prototype._getPixelsScrolled=function(e){if(0===e.deltaY)return 0;var t=this._applyScrollModifier(e.deltaY,e);return e.deltaMode===WheelEvent.DOM_DELTA_LINE?t*=this._currentRowHeight:e.deltaMode===WheelEvent.DOM_DELTA_PAGE&&(t*=this._currentRowHeight*this._bufferService.rows),t},t.prototype.getLinesScrolled=function(e){if(0===e.deltaY)return 0;var t=this._applyScrollModifier(e.deltaY,e);return e.deltaMode===WheelEvent.DOM_DELTA_PIXEL?(t/=this._currentRowHeight+0,this._wheelPartialScroll+=t,t=Math.floor(Math.abs(this._wheelPartialScroll))*(this._wheelPartialScroll>0?1:-1),this._wheelPartialScroll%=1):e.deltaMode===WheelEvent.DOM_DELTA_PAGE&&(t*=this._bufferService.rows),t},t.prototype._applyScrollModifier=function(e,t){var r=this._optionsService.options.fastScrollModifier;return"alt"===r&&t.altKey||"ctrl"===r&&t.ctrlKey||"shift"===r&&t.shiftKey?e*this._optionsService.options.fastScrollSensitivity*this._optionsService.options.scrollSensitivity:e*this._optionsService.options.scrollSensitivity},t.prototype.onTouchStart=function(e){this._lastTouchY=e.touches[0].pageY},t.prototype.onTouchMove=function(e){var t=this._lastTouchY-e.touches[0].pageY;return this._lastTouchY=e.touches[0].pageY,0!==t&&(this._viewportElement.scrollTop+=t,this._bubbleScroll(e,t))},o([s(3,h.IBufferService),s(4,h.IOptionsService),s(5,l.ICharSizeService),s(6,l.IRenderService)],t)}(a.Disposable);t.Viewport=u},2950:function(e,t,r){var i=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},n=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.CompositionHelper=void 0;var o=r(4725),s=r(2585),a=function(){function e(e,t,r,i,n,o){this._textarea=e,this._compositionView=t,this._bufferService=r,this._optionsService=i,this._charSizeService=n,this._coreService=o,this._isComposing=!1,this._isSendingComposition=!1,this._compositionPosition={start:0,end:0},this._dataAlreadySent=""}return Object.defineProperty(e.prototype,"isComposing",{get:function(){return this._isComposing},enumerable:!1,configurable:!0}),e.prototype.compositionstart=function(){this._isComposing=!0,this._compositionPosition.start=this._textarea.value.length,this._compositionView.textContent="",this._dataAlreadySent="",this._compositionView.classList.add("active")},e.prototype.compositionupdate=function(e){var t=this;this._compositionView.textContent=e.data,this.updateCompositionElements(),setTimeout((function(){t._compositionPosition.end=t._textarea.value.length}),0)},e.prototype.compositionend=function(){this._finalizeComposition(!0)},e.prototype.keydown=function(e){if(this._isComposing||this._isSendingComposition){if(229===e.keyCode)return!1;if(16===e.keyCode||17===e.keyCode||18===e.keyCode)return!1;this._finalizeComposition(!1)}return 229!==e.keyCode||(this._handleAnyTextareaChanges(),!1)},e.prototype._finalizeComposition=function(e){var t=this;if(this._compositionView.classList.remove("active"),this._isComposing=!1,e){var r={start:this._compositionPosition.start,end:this._compositionPosition.end};this._isSendingComposition=!0,setTimeout((function(){if(t._isSendingComposition){t._isSendingComposition=!1;var e;r.start+=t._dataAlreadySent.length,(e=t._isComposing?t._textarea.value.substring(r.start,r.end):t._textarea.value.substring(r.start)).length>0&&t._coreService.triggerDataEvent(e,!0)}}),0)}else{this._isSendingComposition=!1;var i=this._textarea.value.substring(this._compositionPosition.start,this._compositionPosition.end);this._coreService.triggerDataEvent(i,!0)}},e.prototype._handleAnyTextareaChanges=function(){var e=this,t=this._textarea.value;setTimeout((function(){if(!e._isComposing){var r=e._textarea.value.replace(t,"");r.length>0&&(e._dataAlreadySent=r,e._coreService.triggerDataEvent(r,!0))}}),0)},e.prototype.updateCompositionElements=function(e){var t=this;if(this._isComposing){if(this._bufferService.buffer.isCursorInViewport){var r=Math.ceil(this._charSizeService.height*this._optionsService.options.lineHeight),i=this._bufferService.buffer.y*r,n=this._bufferService.buffer.x*this._charSizeService.width;this._compositionView.style.left=n+"px",this._compositionView.style.top=i+"px",this._compositionView.style.height=r+"px",this._compositionView.style.lineHeight=r+"px",this._compositionView.style.fontFamily=this._optionsService.options.fontFamily,this._compositionView.style.fontSize=this._optionsService.options.fontSize+"px";var o=this._compositionView.getBoundingClientRect();this._textarea.style.left=n+"px",this._textarea.style.top=i+"px",this._textarea.style.width=o.width+"px",this._textarea.style.height=o.height+"px",this._textarea.style.lineHeight=o.height+"px"}e||setTimeout((function(){return t.updateCompositionElements(!0)}),0)}},i([n(2,s.IBufferService),n(3,s.IOptionsService),n(4,o.ICharSizeService),n(5,s.ICoreService)],e)}();t.CompositionHelper=a},9806:(e,t)=>{function r(e,t){var r=t.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]}Object.defineProperty(t,"__esModule",{value:!0}),t.getRawByteCoords=t.getCoords=t.getCoordsRelativeToElement=void 0,t.getCoordsRelativeToElement=r,t.getCoords=function(e,t,i,n,o,s,a,c){if(o){var l=r(e,t);if(l)return l[0]=Math.ceil((l[0]+(c?s/2:0))/s),l[1]=Math.ceil(l[1]/a),l[0]=Math.min(Math.max(l[0],1),i+(c?1:0)),l[1]=Math.min(Math.max(l[1],1),n),l}},t.getRawByteCoords=function(e){if(e)return{x:e[0]+32,y:e[1]+32}}},9504:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.moveToCellSequence=void 0;var i=r(2584);function n(e,t,r,i){var n=e-o(r,e),a=t-o(r,t);return l(Math.abs(n-a)-function(e,t,r){for(var i=0,n=e-o(r,e),a=t-o(r,t),c=0;c<Math.abs(n-a);c++){var l="A"===s(e,t)?-1:1,h=r.buffer.lines.get(n+l*c);h&&h.isWrapped&&i++}return i}(e,t,r),c(s(e,t),i))}function o(e,t){for(var r=0,i=e.buffer.lines.get(t),n=i&&i.isWrapped;n&&t>=0&&t<e.rows;)r++,n=(i=e.buffer.lines.get(--t))&&i.isWrapped;return r}function s(e,t){return e>t?"A":"B"}function a(e,t,r,i,n,o){for(var s=e,a=t,c="";s!==r||a!==i;)s+=n?1:-1,n&&s>o.cols-1?(c+=o.buffer.translateBufferLineToString(a,!1,e,s),s=0,e=0,a++):!n&&s<0&&(c+=o.buffer.translateBufferLineToString(a,!1,0,e+1),e=s=o.cols-1,a--);return c+o.buffer.translateBufferLineToString(a,!1,e,s)}function c(e,t){var r=t?"O":"[";return i.C0.ESC+r+e}function l(e,t){e=Math.floor(e);for(var r="",i=0;i<e;i++)r+=t;return r}t.moveToCellSequence=function(e,t,r,i){var s,h=r.buffer.x,u=r.buffer.y;if(!r.buffer.hasScrollback)return function(e,t,r,i,s,h){return 0===n(t,i,s,h).length?"":l(a(e,t,e,t-o(s,t),!1,s).length,c("D",h))}(h,u,0,t,r,i)+n(u,t,r,i)+function(e,t,r,i,s,h){var u;u=n(t,i,s,h).length>0?i-o(s,i):t;var f=i,_=function(e,t,r,i,s,a){var c;return c=n(r,i,s,a).length>0?i-o(s,i):t,e<r&&c<=i||e>=r&&c<i?"C":"D"}(e,t,r,i,s,h);return l(a(e,u,r,f,"C"===_,s).length,c(_,h))}(h,u,e,t,r,i);if(u===t)return s=h>e?"D":"C",l(Math.abs(h-e),c(s,i));s=u>t?"D":"C";var f=Math.abs(u-t);return l(function(e,t){return t.cols-e}(u>t?e:h,r)+(f-1)*r.cols+1+((u>t?h:e)-1),c(s,i))}},244:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.AddonManager=void 0;var r=function(){function e(){this._addons=[]}return e.prototype.dispose=function(){for(var e=this._addons.length-1;e>=0;e--)this._addons[e].instance.dispose()},e.prototype.loadAddon=function(e,t){var r=this,i={instance:t,dispose:t.dispose,isDisposed:!1};this._addons.push(i),t.dispose=function(){return r._wrappedAddonDispose(i)},t.activate(e)},e.prototype._wrappedAddonDispose=function(e){if(!e.isDisposed){for(var t=-1,r=0;r<this._addons.length;r++)if(this._addons[r]===e){t=r;break}if(-1===t)throw new Error("Could not dispose an addon that has not been loaded");e.isDisposed=!0,e.dispose.apply(e.instance),this._addons.splice(t,1)}},e}();t.AddonManager=r},4389:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Terminal=void 0;var i=r(511),n=r(3236),o=r(9042),s=r(8460),a=r(244),c=function(){function e(e){this._core=new n.Terminal(e),this._addonManager=new a.AddonManager}return e.prototype._checkProposedApi=function(){if(!this._core.optionsService.options.allowProposedApi)throw new Error("You must set the allowProposedApi option to true to use proposed API")},Object.defineProperty(e.prototype,"onCursorMove",{get:function(){return this._core.onCursorMove},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onLineFeed",{get:function(){return this._core.onLineFeed},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onSelectionChange",{get:function(){return this._core.onSelectionChange},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onData",{get:function(){return this._core.onData},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onBinary",{get:function(){return this._core.onBinary},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onTitleChange",{get:function(){return this._core.onTitleChange},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onScroll",{get:function(){return this._core.onScroll},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onKey",{get:function(){return this._core.onKey},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onRender",{get:function(){return this._core.onRender},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onResize",{get:function(){return this._core.onResize},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"element",{get:function(){return this._core.element},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"parser",{get:function(){return this._checkProposedApi(),this._parser||(this._parser=new f(this._core)),this._parser},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"unicode",{get:function(){return this._checkProposedApi(),new _(this._core)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"textarea",{get:function(){return this._core.textarea},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"rows",{get:function(){return this._core.rows},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"cols",{get:function(){return this._core.cols},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"buffer",{get:function(){return this._checkProposedApi(),this._buffer||(this._buffer=new h(this._core)),this._buffer},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"markers",{get:function(){return this._checkProposedApi(),this._core.markers},enumerable:!1,configurable:!0}),e.prototype.blur=function(){this._core.blur()},e.prototype.focus=function(){this._core.focus()},e.prototype.resize=function(e,t){this._verifyIntegers(e,t),this._core.resize(e,t)},e.prototype.open=function(e){this._core.open(e)},e.prototype.attachCustomKeyEventHandler=function(e){this._core.attachCustomKeyEventHandler(e)},e.prototype.registerLinkMatcher=function(e,t,r){return this._checkProposedApi(),this._core.registerLinkMatcher(e,t,r)},e.prototype.deregisterLinkMatcher=function(e){this._checkProposedApi(),this._core.deregisterLinkMatcher(e)},e.prototype.registerLinkProvider=function(e){return this._checkProposedApi(),this._core.registerLinkProvider(e)},e.prototype.registerCharacterJoiner=function(e){return this._checkProposedApi(),this._core.registerCharacterJoiner(e)},e.prototype.deregisterCharacterJoiner=function(e){this._checkProposedApi(),this._core.deregisterCharacterJoiner(e)},e.prototype.registerMarker=function(e){return this._checkProposedApi(),this._verifyIntegers(e),this._core.addMarker(e)},e.prototype.addMarker=function(e){return this.registerMarker(e)},e.prototype.hasSelection=function(){return this._core.hasSelection()},e.prototype.select=function(e,t,r){this._verifyIntegers(e,t,r),this._core.select(e,t,r)},e.prototype.getSelection=function(){return this._core.getSelection()},e.prototype.getSelectionPosition=function(){return this._core.getSelectionPosition()},e.prototype.clearSelection=function(){this._core.clearSelection()},e.prototype.selectAll=function(){this._core.selectAll()},e.prototype.selectLines=function(e,t){this._verifyIntegers(e,t),this._core.selectLines(e,t)},e.prototype.dispose=function(){this._addonManager.dispose(),this._core.dispose()},e.prototype.scrollLines=function(e){this._verifyIntegers(e),this._core.scrollLines(e)},e.prototype.scrollPages=function(e){this._verifyIntegers(e),this._core.scrollPages(e)},e.prototype.scrollToTop=function(){this._core.scrollToTop()},e.prototype.scrollToBottom=function(){this._core.scrollToBottom()},e.prototype.scrollToLine=function(e){this._verifyIntegers(e),this._core.scrollToLine(e)},e.prototype.clear=function(){this._core.clear()},e.prototype.write=function(e,t){this._core.write(e,t)},e.prototype.writeUtf8=function(e,t){this._core.write(e,t)},e.prototype.writeln=function(e,t){this._core.write(e),this._core.write("\r\n",t)},e.prototype.paste=function(e){this._core.paste(e)},e.prototype.getOption=function(e){return this._core.optionsService.getOption(e)},e.prototype.setOption=function(e,t){this._core.optionsService.setOption(e,t)},e.prototype.refresh=function(e,t){this._verifyIntegers(e,t),this._core.refresh(e,t)},e.prototype.reset=function(){this._core.reset()},e.prototype.loadAddon=function(e){return this._addonManager.loadAddon(this,e)},Object.defineProperty(e,"strings",{get:function(){return o},enumerable:!1,configurable:!0}),e.prototype._verifyIntegers=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];for(var r=0,i=e;r<i.length;r++){var n=i[r];if(n===1/0||isNaN(n)||n%1!=0)throw new Error("This API only accepts integers")}},e}();t.Terminal=c;var l=function(){function e(e,t){this._buffer=e,this.type=t}return e.prototype.init=function(e){return this._buffer=e,this},Object.defineProperty(e.prototype,"cursorY",{get:function(){return this._buffer.y},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"cursorX",{get:function(){return this._buffer.x},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"viewportY",{get:function(){return this._buffer.ydisp},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"baseY",{get:function(){return this._buffer.ybase},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"length",{get:function(){return this._buffer.lines.length},enumerable:!1,configurable:!0}),e.prototype.getLine=function(e){var t=this._buffer.lines.get(e);if(t)return new u(t)},e.prototype.getNullCell=function(){return new i.CellData},e}(),h=function(){function e(e){var t=this;this._core=e,this._onBufferChange=new s.EventEmitter,this._normal=new l(this._core.buffers.normal,"normal"),this._alternate=new l(this._core.buffers.alt,"alternate"),this._core.buffers.onBufferActivate((function(){return t._onBufferChange.fire(t.active)}))}return Object.defineProperty(e.prototype,"onBufferChange",{get:function(){return this._onBufferChange.event},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"active",{get:function(){if(this._core.buffers.active===this._core.buffers.normal)return this.normal;if(this._core.buffers.active===this._core.buffers.alt)return this.alternate;throw new Error("Active buffer is neither normal nor alternate")},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"normal",{get:function(){return this._normal.init(this._core.buffers.normal)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"alternate",{get:function(){return this._alternate.init(this._core.buffers.alt)},enumerable:!1,configurable:!0}),e}(),u=function(){function e(e){this._line=e}return Object.defineProperty(e.prototype,"isWrapped",{get:function(){return this._line.isWrapped},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"length",{get:function(){return this._line.length},enumerable:!1,configurable:!0}),e.prototype.getCell=function(e,t){if(!(e<0||e>=this._line.length))return t?(this._line.loadCell(e,t),t):this._line.loadCell(e,new i.CellData)},e.prototype.translateToString=function(e,t,r){return this._line.translateToString(e,t,r)},e}(),f=function(){function e(e){this._core=e}return e.prototype.registerCsiHandler=function(e,t){return this._core.addCsiHandler(e,(function(e){return t(e.toArray())}))},e.prototype.addCsiHandler=function(e,t){return this.registerCsiHandler(e,t)},e.prototype.registerDcsHandler=function(e,t){return this._core.addDcsHandler(e,(function(e,r){return t(e,r.toArray())}))},e.prototype.addDcsHandler=function(e,t){return this.registerDcsHandler(e,t)},e.prototype.registerEscHandler=function(e,t){return this._core.addEscHandler(e,t)},e.prototype.addEscHandler=function(e,t){return this.registerEscHandler(e,t)},e.prototype.registerOscHandler=function(e,t){return this._core.addOscHandler(e,t)},e.prototype.addOscHandler=function(e,t){return this.registerOscHandler(e,t)},e}(),_=function(){function e(e){this._core=e}return e.prototype.register=function(e){this._core.unicodeService.register(e)},Object.defineProperty(e.prototype,"versions",{get:function(){return this._core.unicodeService.versions},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"activeVersion",{get:function(){return this._core.unicodeService.activeVersion},set:function(e){this._core.unicodeService.activeVersion=e},enumerable:!1,configurable:!0}),e}()},1546:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.BaseRenderLayer=void 0;var i=r(643),n=r(8803),o=r(1420),s=r(3734),a=r(1752),c=r(4774),l=r(9631),h=function(){function e(e,t,r,i,n,o,s,a){this._container=e,this._alpha=i,this._colors=n,this._rendererId=o,this._bufferService=s,this._optionsService=a,this._scaledCharWidth=0,this._scaledCharHeight=0,this._scaledCellWidth=0,this._scaledCellHeight=0,this._scaledCharLeft=0,this._scaledCharTop=0,this._currentGlyphIdentifier={chars:"",code:0,bg:0,fg:0,bold:!1,dim:!1,italic:!1},this._canvas=document.createElement("canvas"),this._canvas.classList.add("xterm-"+t+"-layer"),this._canvas.style.zIndex=r.toString(),this._initCanvas(),this._container.appendChild(this._canvas)}return e.prototype.dispose=function(){var e;l.removeElementFromParent(this._canvas),null===(e=this._charAtlas)||void 0===e||e.dispose()},e.prototype._initCanvas=function(){this._ctx=a.throwIfFalsy(this._canvas.getContext("2d",{alpha:this._alpha})),this._alpha||this._clearAll()},e.prototype.onOptionsChanged=function(){},e.prototype.onBlur=function(){},e.prototype.onFocus=function(){},e.prototype.onCursorMove=function(){},e.prototype.onGridChanged=function(e,t){},e.prototype.onSelectionChanged=function(e,t,r){void 0===r&&(r=!1)},e.prototype.setColors=function(e){this._refreshCharAtlas(e)},e.prototype._setTransparency=function(e){if(e!==this._alpha){var t=this._canvas;this._alpha=e,this._canvas=this._canvas.cloneNode(),this._initCanvas(),this._container.replaceChild(this._canvas,t),this._refreshCharAtlas(this._colors),this.onGridChanged(0,this._bufferService.rows-1)}},e.prototype._refreshCharAtlas=function(e){this._scaledCharWidth<=0&&this._scaledCharHeight<=0||(this._charAtlas=o.acquireCharAtlas(this._optionsService.options,this._rendererId,e,this._scaledCharWidth,this._scaledCharHeight),this._charAtlas.warmUp())},e.prototype.resize=function(e){this._scaledCellWidth=e.scaledCellWidth,this._scaledCellHeight=e.scaledCellHeight,this._scaledCharWidth=e.scaledCharWidth,this._scaledCharHeight=e.scaledCharHeight,this._scaledCharLeft=e.scaledCharLeft,this._scaledCharTop=e.scaledCharTop,this._canvas.width=e.scaledCanvasWidth,this._canvas.height=e.scaledCanvasHeight,this._canvas.style.width=e.canvasWidth+"px",this._canvas.style.height=e.canvasHeight+"px",this._alpha||this._clearAll(),this._refreshCharAtlas(this._colors)},e.prototype._fillCells=function(e,t,r,i){this._ctx.fillRect(e*this._scaledCellWidth,t*this._scaledCellHeight,r*this._scaledCellWidth,i*this._scaledCellHeight)},e.prototype._fillBottomLineAtCells=function(e,t,r){void 0===r&&(r=1),this._ctx.fillRect(e*this._scaledCellWidth,(t+1)*this._scaledCellHeight-window.devicePixelRatio-1,r*this._scaledCellWidth,window.devicePixelRatio)},e.prototype._fillLeftLineAtCell=function(e,t,r){this._ctx.fillRect(e*this._scaledCellWidth,t*this._scaledCellHeight,window.devicePixelRatio*r,this._scaledCellHeight)},e.prototype._strokeRectAtCell=function(e,t,r,i){this._ctx.lineWidth=window.devicePixelRatio,this._ctx.strokeRect(e*this._scaledCellWidth+window.devicePixelRatio/2,t*this._scaledCellHeight+window.devicePixelRatio/2,r*this._scaledCellWidth-window.devicePixelRatio,i*this._scaledCellHeight-window.devicePixelRatio)},e.prototype._clearAll=function(){this._alpha?this._ctx.clearRect(0,0,this._canvas.width,this._canvas.height):(this._ctx.fillStyle=this._colors.background.css,this._ctx.fillRect(0,0,this._canvas.width,this._canvas.height))},e.prototype._clearCells=function(e,t,r,i){this._alpha?this._ctx.clearRect(e*this._scaledCellWidth,t*this._scaledCellHeight,r*this._scaledCellWidth,i*this._scaledCellHeight):(this._ctx.fillStyle=this._colors.background.css,this._ctx.fillRect(e*this._scaledCellWidth,t*this._scaledCellHeight,r*this._scaledCellWidth,i*this._scaledCellHeight))},e.prototype._fillCharTrueColor=function(e,t,r){this._ctx.font=this._getFont(!1,!1),this._ctx.textBaseline="middle",this._clipRow(r),this._ctx.fillText(e.getChars(),t*this._scaledCellWidth+this._scaledCharLeft,r*this._scaledCellHeight+this._scaledCharTop+this._scaledCharHeight/2)},e.prototype._drawChars=function(e,t,r){var o,s,a=this._getContrastColor(e);a||e.isFgRGB()||e.isBgRGB()?this._drawUncachedChars(e,t,r,a):(e.isInverse()?(o=e.isBgDefault()?n.INVERTED_DEFAULT_COLOR:e.getBgColor(),s=e.isFgDefault()?n.INVERTED_DEFAULT_COLOR:e.getFgColor()):(s=e.isBgDefault()?i.DEFAULT_COLOR:e.getBgColor(),o=e.isFgDefault()?i.DEFAULT_COLOR:e.getFgColor()),o+=this._optionsService.options.drawBoldTextInBrightColors&&e.isBold()&&o<8?8:0,this._currentGlyphIdentifier.chars=e.getChars()||i.WHITESPACE_CELL_CHAR,this._currentGlyphIdentifier.code=e.getCode()||i.WHITESPACE_CELL_CODE,this._currentGlyphIdentifier.bg=s,this._currentGlyphIdentifier.fg=o,this._currentGlyphIdentifier.bold=!!e.isBold(),this._currentGlyphIdentifier.dim=!!e.isDim(),this._currentGlyphIdentifier.italic=!!e.isItalic(),this._charAtlas&&this._charAtlas.draw(this._ctx,this._currentGlyphIdentifier,t*this._scaledCellWidth+this._scaledCharLeft,r*this._scaledCellHeight+this._scaledCharTop)||this._drawUncachedChars(e,t,r))},e.prototype._drawUncachedChars=function(e,t,r,i){if(this._ctx.save(),this._ctx.font=this._getFont(!!e.isBold(),!!e.isItalic()),this._ctx.textBaseline="middle",e.isInverse())if(i)this._ctx.fillStyle=i.css;else if(e.isBgDefault())this._ctx.fillStyle=c.color.opaque(this._colors.background).css;else if(e.isBgRGB())this._ctx.fillStyle="rgb("+s.AttributeData.toColorRGB(e.getBgColor()).join(",")+")";else{var o=e.getBgColor();this._optionsService.options.drawBoldTextInBrightColors&&e.isBold()&&o<8&&(o+=8),this._ctx.fillStyle=this._colors.ansi[o].css}else if(i)this._ctx.fillStyle=i.css;else if(e.isFgDefault())this._ctx.fillStyle=this._colors.foreground.css;else if(e.isFgRGB())this._ctx.fillStyle="rgb("+s.AttributeData.toColorRGB(e.getFgColor()).join(",")+")";else{var a=e.getFgColor();this._optionsService.options.drawBoldTextInBrightColors&&e.isBold()&&a<8&&(a+=8),this._ctx.fillStyle=this._colors.ansi[a].css}this._clipRow(r),e.isDim()&&(this._ctx.globalAlpha=n.DIM_OPACITY),this._ctx.fillText(e.getChars(),t*this._scaledCellWidth+this._scaledCharLeft,r*this._scaledCellHeight+this._scaledCharTop+this._scaledCharHeight/2),this._ctx.restore()},e.prototype._clipRow=function(e){this._ctx.beginPath(),this._ctx.rect(0,e*this._scaledCellHeight,this._bufferService.cols*this._scaledCellWidth,this._scaledCellHeight),this._ctx.clip()},e.prototype._getFont=function(e,t){return(t?"italic":"")+" "+(e?this._optionsService.options.fontWeightBold:this._optionsService.options.fontWeight)+" "+this._optionsService.options.fontSize*window.devicePixelRatio+"px "+this._optionsService.options.fontFamily},e.prototype._getContrastColor=function(e){if(1!==this._optionsService.options.minimumContrastRatio){var t=this._colors.contrastCache.getColor(e.bg,e.fg);if(void 0!==t)return t||void 0;var r=e.getFgColor(),i=e.getFgColorMode(),n=e.getBgColor(),o=e.getBgColorMode(),s=!!e.isInverse(),a=!!e.isInverse();if(s){var l=r;r=n,n=l;var h=i;i=o,o=h}var u=this._resolveBackgroundRgba(o,n,s),f=this._resolveForegroundRgba(i,r,s,a),_=c.rgba.ensureContrastRatio(u,f,this._optionsService.options.minimumContrastRatio);if(_){var d={css:c.channels.toCss(_>>24&255,_>>16&255,_>>8&255),rgba:_};return this._colors.contrastCache.setColor(e.bg,e.fg,d),d}this._colors.contrastCache.setColor(e.bg,e.fg,null)}},e.prototype._resolveBackgroundRgba=function(e,t,r){switch(e){case 16777216:case 33554432:return this._colors.ansi[t].rgba;case 50331648:return t<<8;case 0:default:return r?this._colors.foreground.rgba:this._colors.background.rgba}},e.prototype._resolveForegroundRgba=function(e,t,r,i){switch(e){case 16777216:case 33554432:return this._optionsService.options.drawBoldTextInBrightColors&&i&&t<8&&(t+=8),this._colors.ansi[t].rgba;case 50331648:return t<<8;case 0:default:return r?this._colors.background.rgba:this._colors.foreground.rgba}},e}();t.BaseRenderLayer=h},5879:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.CharacterJoinerRegistry=t.JoinedCellData=void 0;var o=r(3734),s=r(643),a=r(511),c=function(e){function t(t,r,i){var n=e.call(this)||this;return n.content=0,n.combinedData="",n.fg=t.fg,n.bg=t.bg,n.combinedData=r,n._width=i,n}return n(t,e),t.prototype.isCombined=function(){return 2097152},t.prototype.getWidth=function(){return this._width},t.prototype.getChars=function(){return this.combinedData},t.prototype.getCode=function(){return 2097151},t.prototype.setFromCharData=function(e){throw new Error("not implemented")},t.prototype.getAsCharData=function(){return[this.fg,this.getChars(),this.getWidth(),this.getCode()]},t}(o.AttributeData);t.JoinedCellData=c;var l=function(){function e(e){this._bufferService=e,this._characterJoiners=[],this._nextCharacterJoinerId=0,this._workCell=new a.CellData}return e.prototype.registerCharacterJoiner=function(e){var t={id:this._nextCharacterJoinerId++,handler:e};return this._characterJoiners.push(t),t.id},e.prototype.deregisterCharacterJoiner=function(e){for(var t=0;t<this._characterJoiners.length;t++)if(this._characterJoiners[t].id===e)return this._characterJoiners.splice(t,1),!0;return!1},e.prototype.getJoinedCharacters=function(e){if(0===this._characterJoiners.length)return[];var t=this._bufferService.buffer.lines.get(e);if(!t||0===t.length)return[];for(var r=[],i=t.translateToString(!0),n=0,o=0,a=0,c=t.getFg(0),l=t.getBg(0),h=0;h<t.getTrimmedLength();h++)if(t.loadCell(h,this._workCell),0!==this._workCell.getWidth()){if(this._workCell.fg!==c||this._workCell.bg!==l){if(h-n>1)for(var u=this._getJoinedRanges(i,a,o,t,n),f=0;f<u.length;f++)r.push(u[f]);n=h,a=o,c=this._workCell.fg,l=this._workCell.bg}o+=this._workCell.getChars().length||s.WHITESPACE_CELL_CHAR.length}if(this._bufferService.cols-n>1)for(u=this._getJoinedRanges(i,a,o,t,n),f=0;f<u.length;f++)r.push(u[f]);return r},e.prototype._getJoinedRanges=function(t,r,i,n,o){for(var s=t.substring(r,i),a=this._characterJoiners[0].handler(s),c=1;c<this._characterJoiners.length;c++)for(var l=this._characterJoiners[c].handler(s),h=0;h<l.length;h++)e._mergeRanges(a,l[h]);return this._stringRangesToCellRanges(a,n,o),a},e.prototype._stringRangesToCellRanges=function(e,t,r){var i=0,n=!1,o=0,a=e[i];if(a){for(var c=r;c<this._bufferService.cols;c++){var l=t.getWidth(c),h=t.getString(c).length||s.WHITESPACE_CELL_CHAR.length;if(0!==l){if(!n&&a[0]<=o&&(a[0]=c,n=!0),a[1]<=o){if(a[1]=c,!(a=e[++i]))break;a[0]<=o?(a[0]=c,n=!0):n=!1}o+=h}}a&&(a[1]=this._bufferService.cols)}},e._mergeRanges=function(e,t){for(var r=!1,i=0;i<e.length;i++){var n=e[i];if(r){if(t[1]<=n[0])return e[i-1][1]=t[1],e;if(t[1]<=n[1])return e[i-1][1]=Math.max(t[1],n[1]),e.splice(i,1),e;e.splice(i,1),i--}else{if(t[1]<=n[0])return e.splice(i,0,t),e;if(t[1]<=n[1])return n[0]=Math.min(t[0],n[0]),e;t[0]<n[1]&&(n[0]=Math.min(t[0],n[0]),r=!0)}}return r?e[e.length-1][1]=t[1]:e.push(t),e},e}();t.CharacterJoinerRegistry=l},2512:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.CursorRenderLayer=void 0;var o=r(1546),s=r(511),a=600,c=function(e){function t(t,r,i,n,o,a,c,l,h){var u=e.call(this,t,"cursor",r,!0,i,n,a,c)||this;return u._onRequestRedraw=o,u._coreService=l,u._coreBrowserService=h,u._cell=new s.CellData,u._state={x:0,y:0,isFocused:!1,style:"",width:0},u._cursorRenderers={bar:u._renderBarCursor.bind(u),block:u._renderBlockCursor.bind(u),underline:u._renderUnderlineCursor.bind(u)},u}return n(t,e),t.prototype.resize=function(t){e.prototype.resize.call(this,t),this._state={x:0,y:0,isFocused:!1,style:"",width:0}},t.prototype.reset=function(){this._clearCursor(),this._cursorBlinkStateManager&&(this._cursorBlinkStateManager.dispose(),this._cursorBlinkStateManager=void 0,this.onOptionsChanged())},t.prototype.onBlur=function(){this._cursorBlinkStateManager&&this._cursorBlinkStateManager.pause(),this._onRequestRedraw.fire({start:this._bufferService.buffer.y,end:this._bufferService.buffer.y})},t.prototype.onFocus=function(){this._cursorBlinkStateManager?this._cursorBlinkStateManager.resume():this._onRequestRedraw.fire({start:this._bufferService.buffer.y,end:this._bufferService.buffer.y})},t.prototype.onOptionsChanged=function(){var e,t=this;this._optionsService.options.cursorBlink?this._cursorBlinkStateManager||(this._cursorBlinkStateManager=new l(this._coreBrowserService.isFocused,(function(){t._render(!0)}))):(null===(e=this._cursorBlinkStateManager)||void 0===e||e.dispose(),this._cursorBlinkStateManager=void 0),this._onRequestRedraw.fire({start:this._bufferService.buffer.y,end:this._bufferService.buffer.y})},t.prototype.onCursorMove=function(){this._cursorBlinkStateManager&&this._cursorBlinkStateManager.restartBlinkAnimation()},t.prototype.onGridChanged=function(e,t){!this._cursorBlinkStateManager||this._cursorBlinkStateManager.isPaused?this._render(!1):this._cursorBlinkStateManager.restartBlinkAnimation()},t.prototype._render=function(e){if(this._coreService.isCursorInitialized&&!this._coreService.isCursorHidden){var t=this._bufferService.buffer.ybase+this._bufferService.buffer.y,r=t-this._bufferService.buffer.ydisp;if(r<0||r>=this._bufferService.rows)this._clearCursor();else{var i=Math.min(this._bufferService.buffer.x,this._bufferService.cols-1);if(this._bufferService.buffer.lines.get(t).loadCell(i,this._cell),void 0!==this._cell.content){if(!this._coreBrowserService.isFocused){this._clearCursor(),this._ctx.save(),this._ctx.fillStyle=this._colors.cursor.css;var n=this._optionsService.options.cursorStyle;return n&&"block"!==n?this._cursorRenderers[n](i,r,this._cell):this._renderBlurCursor(i,r,this._cell),this._ctx.restore(),this._state.x=i,this._state.y=r,this._state.isFocused=!1,this._state.style=n,void(this._state.width=this._cell.getWidth())}if(!this._cursorBlinkStateManager||this._cursorBlinkStateManager.isCursorVisible){if(this._state){if(this._state.x===i&&this._state.y===r&&this._state.isFocused===this._coreBrowserService.isFocused&&this._state.style===this._optionsService.options.cursorStyle&&this._state.width===this._cell.getWidth())return;this._clearCursor()}this._ctx.save(),this._cursorRenderers[this._optionsService.options.cursorStyle||"block"](i,r,this._cell),this._ctx.restore(),this._state.x=i,this._state.y=r,this._state.isFocused=!1,this._state.style=this._optionsService.options.cursorStyle,this._state.width=this._cell.getWidth()}else this._clearCursor()}}}else this._clearCursor()},t.prototype._clearCursor=function(){this._state&&(this._clearCells(this._state.x,this._state.y,this._state.width,1),this._state={x:0,y:0,isFocused:!1,style:"",width:0})},t.prototype._renderBarCursor=function(e,t,r){this._ctx.save(),this._ctx.fillStyle=this._colors.cursor.css,this._fillLeftLineAtCell(e,t,this._optionsService.options.cursorWidth),this._ctx.restore()},t.prototype._renderBlockCursor=function(e,t,r){this._ctx.save(),this._ctx.fillStyle=this._colors.cursor.css,this._fillCells(e,t,r.getWidth(),1),this._ctx.fillStyle=this._colors.cursorAccent.css,this._fillCharTrueColor(r,e,t),this._ctx.restore()},t.prototype._renderUnderlineCursor=function(e,t,r){this._ctx.save(),this._ctx.fillStyle=this._colors.cursor.css,this._fillBottomLineAtCells(e,t),this._ctx.restore()},t.prototype._renderBlurCursor=function(e,t,r){this._ctx.save(),this._ctx.strokeStyle=this._colors.cursor.css,this._strokeRectAtCell(e,t,r.getWidth(),1),this._ctx.restore()},t}(o.BaseRenderLayer);t.CursorRenderLayer=c;var l=function(){function e(e,t){this._renderCallback=t,this.isCursorVisible=!0,e&&this._restartInterval()}return Object.defineProperty(e.prototype,"isPaused",{get:function(){return!(this._blinkStartTimeout||this._blinkInterval)},enumerable:!1,configurable:!0}),e.prototype.dispose=function(){this._blinkInterval&&(window.clearInterval(this._blinkInterval),this._blinkInterval=void 0),this._blinkStartTimeout&&(window.clearTimeout(this._blinkStartTimeout),this._blinkStartTimeout=void 0),this._animationFrame&&(window.cancelAnimationFrame(this._animationFrame),this._animationFrame=void 0)},e.prototype.restartBlinkAnimation=function(){var e=this;this.isPaused||(this._animationTimeRestarted=Date.now(),this.isCursorVisible=!0,this._animationFrame||(this._animationFrame=window.requestAnimationFrame((function(){e._renderCallback(),e._animationFrame=void 0}))))},e.prototype._restartInterval=function(e){var t=this;void 0===e&&(e=a),this._blinkInterval&&window.clearInterval(this._blinkInterval),this._blinkStartTimeout=window.setTimeout((function(){if(t._animationTimeRestarted){var e=a-(Date.now()-t._animationTimeRestarted);if(t._animationTimeRestarted=void 0,e>0)return void t._restartInterval(e)}t.isCursorVisible=!1,t._animationFrame=window.requestAnimationFrame((function(){t._renderCallback(),t._animationFrame=void 0})),t._blinkInterval=window.setInterval((function(){if(t._animationTimeRestarted){var e=a-(Date.now()-t._animationTimeRestarted);return t._animationTimeRestarted=void 0,void t._restartInterval(e)}t.isCursorVisible=!t.isCursorVisible,t._animationFrame=window.requestAnimationFrame((function(){t._renderCallback(),t._animationFrame=void 0}))}),a)}),e)},e.prototype.pause=function(){this.isCursorVisible=!0,this._blinkInterval&&(window.clearInterval(this._blinkInterval),this._blinkInterval=void 0),this._blinkStartTimeout&&(window.clearTimeout(this._blinkStartTimeout),this._blinkStartTimeout=void 0),this._animationFrame&&(window.cancelAnimationFrame(this._animationFrame),this._animationFrame=void 0)},e.prototype.resume=function(){this.pause(),this._animationTimeRestarted=void 0,this._restartInterval(),this.restartBlinkAnimation()},e}()},3700:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.GridCache=void 0;var r=function(){function e(){this.cache=[]}return e.prototype.resize=function(e,t){for(var r=0;r<e;r++){this.cache.length<=r&&this.cache.push([]);for(var i=this.cache[r].length;i<t;i++)this.cache[r].push(void 0);this.cache[r].length=t}this.cache.length=e},e.prototype.clear=function(){for(var e=0;e<this.cache.length;e++)for(var t=0;t<this.cache[e].length;t++)this.cache[e][t]=void 0},e}();t.GridCache=r},5098:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.LinkRenderLayer=void 0;var o=r(1546),s=r(8803),a=r(2040),c=function(e){function t(t,r,i,n,o,s,a,c){var l=e.call(this,t,"link",r,!0,i,n,a,c)||this;return o.onShowLinkUnderline((function(e){return l._onShowLinkUnderline(e)})),o.onHideLinkUnderline((function(e){return l._onHideLinkUnderline(e)})),s.onShowLinkUnderline((function(e){return l._onShowLinkUnderline(e)})),s.onHideLinkUnderline((function(e){return l._onHideLinkUnderline(e)})),l}return n(t,e),t.prototype.resize=function(t){e.prototype.resize.call(this,t),this._state=void 0},t.prototype.reset=function(){this._clearCurrentLink()},t.prototype._clearCurrentLink=function(){if(this._state){this._clearCells(this._state.x1,this._state.y1,this._state.cols-this._state.x1,1);var e=this._state.y2-this._state.y1-1;e>0&&this._clearCells(0,this._state.y1+1,this._state.cols,e),this._clearCells(0,this._state.y2,this._state.x2,1),this._state=void 0}},t.prototype._onShowLinkUnderline=function(e){if(e.fg===s.INVERTED_DEFAULT_COLOR?this._ctx.fillStyle=this._colors.background.css:e.fg&&a.is256Color(e.fg)?this._ctx.fillStyle=this._colors.ansi[e.fg].css:this._ctx.fillStyle=this._colors.foreground.css,e.y1===e.y2)this._fillBottomLineAtCells(e.x1,e.y1,e.x2-e.x1);else{this._fillBottomLineAtCells(e.x1,e.y1,e.cols-e.x1);for(var t=e.y1+1;t<e.y2;t++)this._fillBottomLineAtCells(0,t,e.cols);this._fillBottomLineAtCells(0,e.y2,e.x2)}this._state=e},t.prototype._onHideLinkUnderline=function(e){this._clearCurrentLink()},t}(o.BaseRenderLayer);t.LinkRenderLayer=c},3525:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},s=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.Renderer=void 0;var a=r(9596),c=r(4149),l=r(2512),h=r(5098),u=r(5879),f=r(844),_=r(4725),d=r(2585),p=r(1420),v=r(8460),g=1,y=function(e){function t(t,r,i,n,o,s,f,_,d){var p=e.call(this)||this;p._colors=t,p._screenElement=r,p._bufferService=o,p._charSizeService=s,p._optionsService=f,p._id=g++,p._onRequestRedraw=new v.EventEmitter;var y=p._optionsService.options.allowTransparency;return p._characterJoinerRegistry=new u.CharacterJoinerRegistry(p._bufferService),p._renderLayers=[new a.TextRenderLayer(p._screenElement,0,p._colors,p._characterJoinerRegistry,y,p._id,p._bufferService,f),new c.SelectionRenderLayer(p._screenElement,1,p._colors,p._id,p._bufferService,f),new h.LinkRenderLayer(p._screenElement,2,p._colors,p._id,i,n,p._bufferService,f),new l.CursorRenderLayer(p._screenElement,3,p._colors,p._id,p._onRequestRedraw,p._bufferService,f,_,d)],p.dimensions={scaledCharWidth:0,scaledCharHeight:0,scaledCellWidth:0,scaledCellHeight:0,scaledCharLeft:0,scaledCharTop:0,scaledCanvasWidth:0,scaledCanvasHeight:0,canvasWidth:0,canvasHeight:0,actualCellWidth:0,actualCellHeight:0},p._devicePixelRatio=window.devicePixelRatio,p._updateDimensions(),p.onOptionsChanged(),p}return n(t,e),Object.defineProperty(t.prototype,"onRequestRedraw",{get:function(){return this._onRequestRedraw.event},enumerable:!1,configurable:!0}),t.prototype.dispose=function(){for(var t=0,r=this._renderLayers;t<r.length;t++)r[t].dispose();e.prototype.dispose.call(this),p.removeTerminalFromCache(this._id)},t.prototype.onDevicePixelRatioChange=function(){this._devicePixelRatio!==window.devicePixelRatio&&(this._devicePixelRatio=window.devicePixelRatio,this.onResize(this._bufferService.cols,this._bufferService.rows))},t.prototype.setColors=function(e){this._colors=e;for(var t=0,r=this._renderLayers;t<r.length;t++){var i=r[t];i.setColors(this._colors),i.reset()}},t.prototype.onResize=function(e,t){this._updateDimensions();for(var r=0,i=this._renderLayers;r<i.length;r++)i[r].resize(this.dimensions);this._screenElement.style.width=this.dimensions.canvasWidth+"px",this._screenElement.style.height=this.dimensions.canvasHeight+"px"},t.prototype.onCharSizeChanged=function(){this.onResize(this._bufferService.cols,this._bufferService.rows)},t.prototype.onBlur=function(){this._runOperation((function(e){return e.onBlur()}))},t.prototype.onFocus=function(){this._runOperation((function(e){return e.onFocus()}))},t.prototype.onSelectionChanged=function(e,t,r){void 0===r&&(r=!1),this._runOperation((function(i){return i.onSelectionChanged(e,t,r)}))},t.prototype.onCursorMove=function(){this._runOperation((function(e){return e.onCursorMove()}))},t.prototype.onOptionsChanged=function(){this._runOperation((function(e){return e.onOptionsChanged()}))},t.prototype.clear=function(){this._runOperation((function(e){return e.reset()}))},t.prototype._runOperation=function(e){for(var t=0,r=this._renderLayers;t<r.length;t++)e(r[t])},t.prototype.renderRows=function(e,t){for(var r=0,i=this._renderLayers;r<i.length;r++)i[r].onGridChanged(e,t)},t.prototype._updateDimensions=function(){this._charSizeService.hasValidSize&&(this.dimensions.scaledCharWidth=Math.floor(this._charSizeService.width*window.devicePixelRatio),this.dimensions.scaledCharHeight=Math.ceil(this._charSizeService.height*window.devicePixelRatio),this.dimensions.scaledCellHeight=Math.floor(this.dimensions.scaledCharHeight*this._optionsService.options.lineHeight),this.dimensions.scaledCharTop=1===this._optionsService.options.lineHeight?0:Math.round((this.dimensions.scaledCellHeight-this.dimensions.scaledCharHeight)/2),this.dimensions.scaledCellWidth=this.dimensions.scaledCharWidth+Math.round(this._optionsService.options.letterSpacing),this.dimensions.scaledCharLeft=Math.floor(this._optionsService.options.letterSpacing/2),this.dimensions.scaledCanvasHeight=this._bufferService.rows*this.dimensions.scaledCellHeight,this.dimensions.scaledCanvasWidth=this._bufferService.cols*this.dimensions.scaledCellWidth,this.dimensions.canvasHeight=Math.round(this.dimensions.scaledCanvasHeight/window.devicePixelRatio),this.dimensions.canvasWidth=Math.round(this.dimensions.scaledCanvasWidth/window.devicePixelRatio),this.dimensions.actualCellHeight=this.dimensions.canvasHeight/this._bufferService.rows,this.dimensions.actualCellWidth=this.dimensions.canvasWidth/this._bufferService.cols)},t.prototype.registerCharacterJoiner=function(e){return this._characterJoinerRegistry.registerCharacterJoiner(e)},t.prototype.deregisterCharacterJoiner=function(e){return this._characterJoinerRegistry.deregisterCharacterJoiner(e)},o([s(4,d.IBufferService),s(5,_.ICharSizeService),s(6,d.IOptionsService),s(7,d.ICoreService),s(8,_.ICoreBrowserService)],t)}(f.Disposable);t.Renderer=y},1752:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.throwIfFalsy=void 0,t.throwIfFalsy=function(e){if(!e)throw new Error("value must not be falsy");return e}},4149:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.SelectionRenderLayer=void 0;var o=function(e){function t(t,r,i,n,o,s){var a=e.call(this,t,"selection",r,!0,i,n,o,s)||this;return a._clearState(),a}return n(t,e),t.prototype._clearState=function(){this._state={start:void 0,end:void 0,columnSelectMode:void 0,ydisp:void 0}},t.prototype.resize=function(t){e.prototype.resize.call(this,t),this._clearState()},t.prototype.reset=function(){this._state.start&&this._state.end&&(this._clearState(),this._clearAll())},t.prototype.onSelectionChanged=function(e,t,r){if(this._didStateChange(e,t,r,this._bufferService.buffer.ydisp))if(this._clearAll(),e&&t){var i=e[1]-this._bufferService.buffer.ydisp,n=t[1]-this._bufferService.buffer.ydisp,o=Math.max(i,0),s=Math.min(n,this._bufferService.rows-1);if(o>=this._bufferService.rows||s<0)this._state.ydisp=this._bufferService.buffer.ydisp;else{if(this._ctx.fillStyle=this._colors.selectionTransparent.css,r){var a=e[0],c=t[0]-a,l=s-o+1;this._fillCells(a,o,c,l)}else{a=i===o?e[0]:0;var h=o===n?t[0]:this._bufferService.cols;this._fillCells(a,o,h-a,1);var u=Math.max(s-o-1,0);if(this._fillCells(0,o+1,this._bufferService.cols,u),o!==s){var f=n===s?t[0]:this._bufferService.cols;this._fillCells(0,s,f,1)}}this._state.start=[e[0],e[1]],this._state.end=[t[0],t[1]],this._state.columnSelectMode=r,this._state.ydisp=this._bufferService.buffer.ydisp}}else this._clearState()},t.prototype._didStateChange=function(e,t,r,i){return!this._areCoordinatesEqual(e,this._state.start)||!this._areCoordinatesEqual(t,this._state.end)||r!==this._state.columnSelectMode||i!==this._state.ydisp},t.prototype._areCoordinatesEqual=function(e,t){return!(!e||!t)&&e[0]===t[0]&&e[1]===t[1]},t}(r(1546).BaseRenderLayer);t.SelectionRenderLayer=o},9596:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.TextRenderLayer=void 0;var o=r(3700),s=r(1546),a=r(3734),c=r(643),l=r(5879),h=r(511),u=function(e){function t(t,r,i,n,s,a,c,l){var u=e.call(this,t,"text",r,s,i,a,c,l)||this;return u._characterWidth=0,u._characterFont="",u._characterOverlapCache={},u._workCell=new h.CellData,u._state=new o.GridCache,u._characterJoinerRegistry=n,u}return n(t,e),t.prototype.resize=function(t){e.prototype.resize.call(this,t);var r=this._getFont(!1,!1);this._characterWidth===t.scaledCharWidth&&this._characterFont===r||(this._characterWidth=t.scaledCharWidth,this._characterFont=r,this._characterOverlapCache={}),this._state.clear(),this._state.resize(this._bufferService.cols,this._bufferService.rows)},t.prototype.reset=function(){this._state.clear(),this._clearAll()},t.prototype._forEachCell=function(e,t,r,i){for(var n=e;n<=t;n++)for(var o=n+this._bufferService.buffer.ydisp,s=this._bufferService.buffer.lines.get(o),a=r?r.getJoinedCharacters(o):[],h=0;h<this._bufferService.cols;h++){s.loadCell(h,this._workCell);var u=this._workCell,f=!1,_=h;if(0!==u.getWidth()){if(a.length>0&&h===a[0][0]){f=!0;var d=a.shift();u=new l.JoinedCellData(this._workCell,s.translateToString(!0,d[0],d[1]),d[1]-d[0]),_=d[1]-1}!f&&this._isOverlapping(u)&&_<s.length-1&&s.getCodePoint(_+1)===c.NULL_CELL_CODE&&(u.content&=-12582913,u.content|=2<<22),i(u,h,n),h=_}}},t.prototype._drawBackground=function(e,t){var r=this,i=this._ctx,n=this._bufferService.cols,o=0,s=0,c=null;i.save(),this._forEachCell(e,t,null,(function(e,t,l){var h=null;e.isInverse()?h=e.isFgDefault()?r._colors.foreground.css:e.isFgRGB()?"rgb("+a.AttributeData.toColorRGB(e.getFgColor()).join(",")+")":r._colors.ansi[e.getFgColor()].css:e.isBgRGB()?h="rgb("+a.AttributeData.toColorRGB(e.getBgColor()).join(",")+")":e.isBgPalette()&&(h=r._colors.ansi[e.getBgColor()].css),null===c&&(o=t,s=l),l!==s?(i.fillStyle=c||"",r._fillCells(o,s,n-o,1),o=t,s=l):c!==h&&(i.fillStyle=c||"",r._fillCells(o,s,t-o,1),o=t,s=l),c=h})),null!==c&&(i.fillStyle=c,this._fillCells(o,s,n-o,1)),i.restore()},t.prototype._drawForeground=function(e,t){var r=this;this._forEachCell(e,t,this._characterJoinerRegistry,(function(e,t,i){if(!e.isInvisible()&&(r._drawChars(e,t,i),e.isUnderline())){if(r._ctx.save(),e.isInverse())if(e.isBgDefault())r._ctx.fillStyle=r._colors.background.css;else if(e.isBgRGB())r._ctx.fillStyle="rgb("+a.AttributeData.toColorRGB(e.getBgColor()).join(",")+")";else{var n=e.getBgColor();r._optionsService.options.drawBoldTextInBrightColors&&e.isBold()&&n<8&&(n+=8),r._ctx.fillStyle=r._colors.ansi[n].css}else if(e.isFgDefault())r._ctx.fillStyle=r._colors.foreground.css;else if(e.isFgRGB())r._ctx.fillStyle="rgb("+a.AttributeData.toColorRGB(e.getFgColor()).join(",")+")";else{var o=e.getFgColor();r._optionsService.options.drawBoldTextInBrightColors&&e.isBold()&&o<8&&(o+=8),r._ctx.fillStyle=r._colors.ansi[o].css}r._fillBottomLineAtCells(t,i,e.getWidth()),r._ctx.restore()}}))},t.prototype.onGridChanged=function(e,t){0!==this._state.cache.length&&(this._charAtlas&&this._charAtlas.beginFrame(),this._clearCells(0,e,this._bufferService.cols,t-e+1),this._drawBackground(e,t),this._drawForeground(e,t))},t.prototype.onOptionsChanged=function(){this._setTransparency(this._optionsService.options.allowTransparency)},t.prototype._isOverlapping=function(e){if(1!==e.getWidth())return!1;if(e.getCode()<256)return!1;var t=e.getChars();if(this._characterOverlapCache.hasOwnProperty(t))return this._characterOverlapCache[t];this._ctx.save(),this._ctx.font=this._characterFont;var r=Math.floor(this._ctx.measureText(t).width)>this._characterWidth;return this._ctx.restore(),this._characterOverlapCache[t]=r,r},t}(s.BaseRenderLayer);t.TextRenderLayer=u},9616:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.BaseCharAtlas=void 0;var r=function(){function e(){this._didWarmUp=!1}return e.prototype.dispose=function(){},e.prototype.warmUp=function(){this._didWarmUp||(this._doWarmUp(),this._didWarmUp=!0)},e.prototype._doWarmUp=function(){},e.prototype.beginFrame=function(){},e}();t.BaseCharAtlas=r},1420:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.removeTerminalFromCache=t.acquireCharAtlas=void 0;var i=r(2040),n=r(1906),o=[];t.acquireCharAtlas=function(e,t,r,s,a){for(var c=i.generateConfig(s,a,e,r),l=0;l<o.length;l++){var h=(u=o[l]).ownedBy.indexOf(t);if(h>=0){if(i.configEquals(u.config,c))return u.atlas;1===u.ownedBy.length?(u.atlas.dispose(),o.splice(l,1)):u.ownedBy.splice(h,1);break}}for(l=0;l<o.length;l++){var u=o[l];if(i.configEquals(u.config,c))return u.ownedBy.push(t),u.atlas}var f={atlas:new n.DynamicCharAtlas(document,c),config:c,ownedBy:[t]};return o.push(f),f.atlas},t.removeTerminalFromCache=function(e){for(var t=0;t<o.length;t++){var r=o[t].ownedBy.indexOf(e);if(-1!==r){1===o[t].ownedBy.length?(o[t].atlas.dispose(),o.splice(t,1)):o[t].ownedBy.splice(r,1);break}}}},2040:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.is256Color=t.configEquals=t.generateConfig=void 0;var i=r(643);t.generateConfig=function(e,t,r,i){var n={foreground:i.foreground,background:i.background,cursor:void 0,cursorAccent:void 0,selection:void 0,ansi:i.ansi};return{devicePixelRatio:window.devicePixelRatio,scaledCharWidth:e,scaledCharHeight:t,fontFamily:r.fontFamily,fontSize:r.fontSize,fontWeight:r.fontWeight,fontWeightBold:r.fontWeightBold,allowTransparency:r.allowTransparency,colors:n}},t.configEquals=function(e,t){for(var r=0;r<e.colors.ansi.length;r++)if(e.colors.ansi[r].rgba!==t.colors.ansi[r].rgba)return!1;return e.devicePixelRatio===t.devicePixelRatio&&e.fontFamily===t.fontFamily&&e.fontSize===t.fontSize&&e.fontWeight===t.fontWeight&&e.fontWeightBold===t.fontWeightBold&&e.allowTransparency===t.allowTransparency&&e.scaledCharWidth===t.scaledCharWidth&&e.scaledCharHeight===t.scaledCharHeight&&e.colors.foreground===t.colors.foreground&&e.colors.background===t.colors.background},t.is256Color=function(e){return e<i.DEFAULT_COLOR}},8803:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.CHAR_ATLAS_CELL_SPACING=t.DIM_OPACITY=t.INVERTED_DEFAULT_COLOR=void 0,t.INVERTED_DEFAULT_COLOR=257,t.DIM_OPACITY=.5,t.CHAR_ATLAS_CELL_SPACING=1},1906:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.NoneCharAtlas=t.DynamicCharAtlas=t.getGlyphCacheKey=void 0;var o=r(8803),s=r(9616),a=r(5680),c=r(7001),l=r(6114),h=r(1752),u=r(4774),f={css:"rgba(0, 0, 0, 0)",rgba:0};function _(e){return e.code<<21|e.bg<<12|e.fg<<3|(e.bold?0:4)+(e.dim?0:2)+(e.italic?0:1)}t.getGlyphCacheKey=_;var d=function(e){function t(t,r){var i=e.call(this)||this;i._config=r,i._drawToCacheCount=0,i._glyphsWaitingOnBitmap=[],i._bitmapCommitTimeout=null,i._bitmap=null,i._cacheCanvas=t.createElement("canvas"),i._cacheCanvas.width=1024,i._cacheCanvas.height=1024,i._cacheCtx=h.throwIfFalsy(i._cacheCanvas.getContext("2d",{alpha:!0}));var n=t.createElement("canvas");n.width=i._config.scaledCharWidth,n.height=i._config.scaledCharHeight,i._tmpCtx=h.throwIfFalsy(n.getContext("2d",{alpha:i._config.allowTransparency})),i._width=Math.floor(1024/i._config.scaledCharWidth),i._height=Math.floor(1024/i._config.scaledCharHeight);var o=i._width*i._height;return i._cacheMap=new c.LRUMap(o),i._cacheMap.prealloc(o),i}return n(t,e),t.prototype.dispose=function(){null!==this._bitmapCommitTimeout&&(window.clearTimeout(this._bitmapCommitTimeout),this._bitmapCommitTimeout=null)},t.prototype.beginFrame=function(){this._drawToCacheCount=0},t.prototype.draw=function(e,t,r,i){if(32===t.code)return!0;if(!this._canCache(t))return!1;var n=_(t),o=this._cacheMap.get(n);if(null!=o)return this._drawFromCache(e,o,r,i),!0;if(this._drawToCacheCount<100){var s;s=this._cacheMap.size<this._cacheMap.capacity?this._cacheMap.size:this._cacheMap.peek().index;var a=this._drawToCache(t,s);return this._cacheMap.set(n,a),this._drawFromCache(e,a,r,i),!0}return!1},t.prototype._canCache=function(e){return e.code<256},t.prototype._toCoordinateX=function(e){return e%this._width*this._config.scaledCharWidth},t.prototype._toCoordinateY=function(e){return Math.floor(e/this._width)*this._config.scaledCharHeight},t.prototype._drawFromCache=function(e,t,r,i){if(!t.isEmpty){var n=this._toCoordinateX(t.index),o=this._toCoordinateY(t.index);e.drawImage(t.inBitmap?this._bitmap:this._cacheCanvas,n,o,this._config.scaledCharWidth,this._config.scaledCharHeight,r,i,this._config.scaledCharWidth,this._config.scaledCharHeight)}},t.prototype._getColorFromAnsiIndex=function(e){return e<this._config.colors.ansi.length?this._config.colors.ansi[e]:a.DEFAULT_ANSI_COLORS[e]},t.prototype._getBackgroundColor=function(e){return this._config.allowTransparency?f:e.bg===o.INVERTED_DEFAULT_COLOR?this._config.colors.foreground:e.bg<256?this._getColorFromAnsiIndex(e.bg):this._config.colors.background},t.prototype._getForegroundColor=function(e){return e.fg===o.INVERTED_DEFAULT_COLOR?u.color.opaque(this._config.colors.background):e.fg<256?this._getColorFromAnsiIndex(e.fg):this._config.colors.foreground},t.prototype._drawToCache=function(e,t){this._drawToCacheCount++,this._tmpCtx.save();var r=this._getBackgroundColor(e);this._tmpCtx.globalCompositeOperation="copy",this._tmpCtx.fillStyle=r.css,this._tmpCtx.fillRect(0,0,this._config.scaledCharWidth,this._config.scaledCharHeight),this._tmpCtx.globalCompositeOperation="source-over";var i=e.bold?this._config.fontWeightBold:this._config.fontWeight,n=e.italic?"italic":"";this._tmpCtx.font=n+" "+i+" "+this._config.fontSize*this._config.devicePixelRatio+"px "+this._config.fontFamily,this._tmpCtx.textBaseline="middle",this._tmpCtx.fillStyle=this._getForegroundColor(e).css,e.dim&&(this._tmpCtx.globalAlpha=o.DIM_OPACITY),this._tmpCtx.fillText(e.chars,0,this._config.scaledCharHeight/2),this._tmpCtx.restore();var s=this._tmpCtx.getImageData(0,0,this._config.scaledCharWidth,this._config.scaledCharHeight),a=!1;this._config.allowTransparency||(a=function(e,t){for(var r=!0,i=t.rgba>>>24,n=t.rgba>>>16&255,o=t.rgba>>>8&255,s=0;s<e.data.length;s+=4)e.data[s]===i&&e.data[s+1]===n&&e.data[s+2]===o?e.data[s+3]=0:r=!1;return r}(s,r));var c=this._toCoordinateX(t),l=this._toCoordinateY(t);this._cacheCtx.putImageData(s,c,l);var h={index:t,isEmpty:a,inBitmap:!1};return this._addGlyphToBitmap(h),h},t.prototype._addGlyphToBitmap=function(e){var t=this;!("createImageBitmap"in window)||l.isFirefox||l.isSafari||(this._glyphsWaitingOnBitmap.push(e),null===this._bitmapCommitTimeout&&(this._bitmapCommitTimeout=window.setTimeout((function(){return t._generateBitmap()}),100)))},t.prototype._generateBitmap=function(){var e=this,t=this._glyphsWaitingOnBitmap;this._glyphsWaitingOnBitmap=[],window.createImageBitmap(this._cacheCanvas).then((function(r){e._bitmap=r;for(var i=0;i<t.length;i++)t[i].inBitmap=!0})),this._bitmapCommitTimeout=null},t}(s.BaseCharAtlas);t.DynamicCharAtlas=d;var p=function(e){function t(t,r){return e.call(this)||this}return n(t,e),t.prototype.draw=function(e,t,r,i){return!1},t}(s.BaseCharAtlas);t.NoneCharAtlas=p},7001:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.LRUMap=void 0;var r=function(){function e(e){this.capacity=e,this._map={},this._head=null,this._tail=null,this._nodePool=[],this.size=0}return e.prototype._unlinkNode=function(e){var t=e.prev,r=e.next;e===this._head&&(this._head=r),e===this._tail&&(this._tail=t),null!==t&&(t.next=r),null!==r&&(r.prev=t)},e.prototype._appendNode=function(e){var t=this._tail;null!==t&&(t.next=e),e.prev=t,e.next=null,this._tail=e,null===this._head&&(this._head=e)},e.prototype.prealloc=function(e){for(var t=this._nodePool,r=0;r<e;r++)t.push({prev:null,next:null,key:null,value:null})},e.prototype.get=function(e){var t=this._map[e];return void 0!==t?(this._unlinkNode(t),this._appendNode(t),t.value):null},e.prototype.peekValue=function(e){var t=this._map[e];return void 0!==t?t.value:null},e.prototype.peek=function(){var e=this._head;return null===e?null:e.value},e.prototype.set=function(e,t){var r=this._map[e];if(void 0!==r)r=this._map[e],this._unlinkNode(r),r.value=t;else if(this.size>=this.capacity)r=this._head,this._unlinkNode(r),delete this._map[r.key],r.key=e,r.value=t,this._map[e]=r;else{var i=this._nodePool;i.length>0?((r=i.pop()).key=e,r.value=t):r={prev:null,next:null,key:e,value:t},this._map[e]=r,this.size++}this._appendNode(r)},e}();t.LRUMap=r},1296:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},s=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.DomRenderer=void 0;var a=r(3787),c=r(8803),l=r(844),h=r(4725),u=r(2585),f=r(8460),_=r(4774),d=r(9631),p="xterm-dom-renderer-owner-",v="xterm-fg-",g="xterm-bg-",y="xterm-focus",b=1,S=function(e){function t(t,r,i,n,o,s,c,l,h){var u=e.call(this)||this;return u._colors=t,u._element=r,u._screenElement=i,u._viewportElement=n,u._linkifier=o,u._linkifier2=s,u._charSizeService=c,u._optionsService=l,u._bufferService=h,u._terminalClass=b++,u._rowElements=[],u._rowContainer=document.createElement("div"),u._rowContainer.classList.add("xterm-rows"),u._rowContainer.style.lineHeight="normal",u._rowContainer.setAttribute("aria-hidden","true"),u._refreshRowElements(u._bufferService.cols,u._bufferService.rows),u._selectionContainer=document.createElement("div"),u._selectionContainer.classList.add("xterm-selection"),u._selectionContainer.setAttribute("aria-hidden","true"),u.dimensions={scaledCharWidth:0,scaledCharHeight:0,scaledCellWidth:0,scaledCellHeight:0,scaledCharLeft:0,scaledCharTop:0,scaledCanvasWidth:0,scaledCanvasHeight:0,canvasWidth:0,canvasHeight:0,actualCellWidth:0,actualCellHeight:0},u._updateDimensions(),u._injectCss(),u._rowFactory=new a.DomRendererRowFactory(document,u._optionsService,u._colors),u._element.classList.add(p+u._terminalClass),u._screenElement.appendChild(u._rowContainer),u._screenElement.appendChild(u._selectionContainer),u._linkifier.onShowLinkUnderline((function(e){return u._onLinkHover(e)})),u._linkifier.onHideLinkUnderline((function(e){return u._onLinkLeave(e)})),u._linkifier2.onShowLinkUnderline((function(e){return u._onLinkHover(e)})),u._linkifier2.onHideLinkUnderline((function(e){return u._onLinkLeave(e)})),u}return n(t,e),Object.defineProperty(t.prototype,"onRequestRedraw",{get:function(){return(new f.EventEmitter).event},enumerable:!1,configurable:!0}),t.prototype.dispose=function(){this._element.classList.remove(p+this._terminalClass),d.removeElementFromParent(this._rowContainer,this._selectionContainer,this._themeStyleElement,this._dimensionsStyleElement),e.prototype.dispose.call(this)},t.prototype._updateDimensions=function(){this.dimensions.scaledCharWidth=this._charSizeService.width*window.devicePixelRatio,this.dimensions.scaledCharHeight=Math.ceil(this._charSizeService.height*window.devicePixelRatio),this.dimensions.scaledCellWidth=this.dimensions.scaledCharWidth+Math.round(this._optionsService.options.letterSpacing),this.dimensions.scaledCellHeight=Math.floor(this.dimensions.scaledCharHeight*this._optionsService.options.lineHeight),this.dimensions.scaledCharLeft=0,this.dimensions.scaledCharTop=0,this.dimensions.scaledCanvasWidth=this.dimensions.scaledCellWidth*this._bufferService.cols,this.dimensions.scaledCanvasHeight=this.dimensions.scaledCellHeight*this._bufferService.rows,this.dimensions.canvasWidth=Math.round(this.dimensions.scaledCanvasWidth/window.devicePixelRatio),this.dimensions.canvasHeight=Math.round(this.dimensions.scaledCanvasHeight/window.devicePixelRatio),this.dimensions.actualCellWidth=this.dimensions.canvasWidth/this._bufferService.cols,this.dimensions.actualCellHeight=this.dimensions.canvasHeight/this._bufferService.rows;for(var e=0,t=this._rowElements;e<t.length;e++){var r=t[e];r.style.width=this.dimensions.canvasWidth+"px",r.style.height=this.dimensions.actualCellHeight+"px",r.style.lineHeight=this.dimensions.actualCellHeight+"px",r.style.overflow="hidden"}this._dimensionsStyleElement||(this._dimensionsStyleElement=document.createElement("style"),this._screenElement.appendChild(this._dimensionsStyleElement));var i=this._terminalSelector+" .xterm-rows span { display: inline-block; height: 100%; vertical-align: top; width: "+this.dimensions.actualCellWidth+"px}";this._dimensionsStyleElement.textContent=i,this._selectionContainer.style.height=this._viewportElement.style.height,this._screenElement.style.width=this.dimensions.canvasWidth+"px",this._screenElement.style.height=this.dimensions.canvasHeight+"px"},t.prototype.setColors=function(e){this._colors=e,this._injectCss()},t.prototype._injectCss=function(){var e=this;this._themeStyleElement||(this._themeStyleElement=document.createElement("style"),this._screenElement.appendChild(this._themeStyleElement));var t=this._terminalSelector+" .xterm-rows { color: "+this._colors.foreground.css+"; font-family: "+this._optionsService.options.fontFamily+"; font-size: "+this._optionsService.options.fontSize+"px;}";t+=this._terminalSelector+" span:not(."+a.BOLD_CLASS+") { font-weight: "+this._optionsService.options.fontWeight+";}"+this._terminalSelector+" span."+a.BOLD_CLASS+" { font-weight: "+this._optionsService.options.fontWeightBold+";}"+this._terminalSelector+" span."+a.ITALIC_CLASS+" { font-style: italic;}",t+="@keyframes blink_box_shadow_"+this._terminalClass+" { 50% {  box-shadow: none; }}",t+="@keyframes blink_block_"+this._terminalClass+" { 0% {  background-color: "+this._colors.cursor.css+";  color: "+this._colors.cursorAccent.css+"; } 50% {  background-color: "+this._colors.cursorAccent.css+";  color: "+this._colors.cursor.css+"; }}",t+=this._terminalSelector+" .xterm-rows:not(.xterm-focus) ."+a.CURSOR_CLASS+"."+a.CURSOR_STYLE_BLOCK_CLASS+" { outline: 1px solid "+this._colors.cursor.css+"; outline-offset: -1px;}"+this._terminalSelector+" .xterm-rows.xterm-focus ."+a.CURSOR_CLASS+"."+a.CURSOR_BLINK_CLASS+":not(."+a.CURSOR_STYLE_BLOCK_CLASS+") { animation: blink_box_shadow_"+this._terminalClass+" 1s step-end infinite;}"+this._terminalSelector+" .xterm-rows.xterm-focus ."+a.CURSOR_CLASS+"."+a.CURSOR_BLINK_CLASS+"."+a.CURSOR_STYLE_BLOCK_CLASS+" { animation: blink_block_"+this._terminalClass+" 1s step-end infinite;}"+this._terminalSelector+" .xterm-rows.xterm-focus ."+a.CURSOR_CLASS+"."+a.CURSOR_STYLE_BLOCK_CLASS+" { background-color: "+this._colors.cursor.css+"; color: "+this._colors.cursorAccent.css+";}"+this._terminalSelector+" .xterm-rows ."+a.CURSOR_CLASS+"."+a.CURSOR_STYLE_BAR_CLASS+" { box-shadow: "+this._optionsService.options.cursorWidth+"px 0 0 "+this._colors.cursor.css+" inset;}"+this._terminalSelector+" .xterm-rows ."+a.CURSOR_CLASS+"."+a.CURSOR_STYLE_UNDERLINE_CLASS+" { box-shadow: 0 -1px 0 "+this._colors.cursor.css+" inset;}",t+=this._terminalSelector+" .xterm-selection { position: absolute; top: 0; left: 0; z-index: 1; pointer-events: none;}"+this._terminalSelector+" .xterm-selection div { position: absolute; background-color: "+this._colors.selectionTransparent.css+";}",this._colors.ansi.forEach((function(r,i){t+=e._terminalSelector+" ."+v+i+" { color: "+r.css+"; }"+e._terminalSelector+" ."+g+i+" { background-color: "+r.css+"; }"})),t+=this._terminalSelector+" ."+v+c.INVERTED_DEFAULT_COLOR+" { color: "+_.color.opaque(this._colors.background).css+"; }"+this._terminalSelector+" ."+g+c.INVERTED_DEFAULT_COLOR+" { background-color: "+this._colors.foreground.css+"; }",this._themeStyleElement.textContent=t},t.prototype.onDevicePixelRatioChange=function(){this._updateDimensions()},t.prototype._refreshRowElements=function(e,t){for(var r=this._rowElements.length;r<=t;r++){var i=document.createElement("div");this._rowContainer.appendChild(i),this._rowElements.push(i)}for(;this._rowElements.length>t;)this._rowContainer.removeChild(this._rowElements.pop())},t.prototype.onResize=function(e,t){this._refreshRowElements(e,t),this._updateDimensions()},t.prototype.onCharSizeChanged=function(){this._updateDimensions()},t.prototype.onBlur=function(){this._rowContainer.classList.remove(y)},t.prototype.onFocus=function(){this._rowContainer.classList.add(y)},t.prototype.onSelectionChanged=function(e,t,r){for(;this._selectionContainer.children.length;)this._selectionContainer.removeChild(this._selectionContainer.children[0]);if(e&&t){var i=e[1]-this._bufferService.buffer.ydisp,n=t[1]-this._bufferService.buffer.ydisp,o=Math.max(i,0),s=Math.min(n,this._bufferService.rows-1);if(!(o>=this._bufferService.rows||s<0)){var a=document.createDocumentFragment();if(r)a.appendChild(this._createSelectionElement(o,e[0],t[0],s-o+1));else{var c=i===o?e[0]:0,l=o===n?t[0]:this._bufferService.cols;a.appendChild(this._createSelectionElement(o,c,l));var h=s-o-1;if(a.appendChild(this._createSelectionElement(o+1,0,this._bufferService.cols,h)),o!==s){var u=n===s?t[0]:this._bufferService.cols;a.appendChild(this._createSelectionElement(s,0,u))}}this._selectionContainer.appendChild(a)}}},t.prototype._createSelectionElement=function(e,t,r,i){void 0===i&&(i=1);var n=document.createElement("div");return n.style.height=i*this.dimensions.actualCellHeight+"px",n.style.top=e*this.dimensions.actualCellHeight+"px",n.style.left=t*this.dimensions.actualCellWidth+"px",n.style.width=this.dimensions.actualCellWidth*(r-t)+"px",n},t.prototype.onCursorMove=function(){},t.prototype.onOptionsChanged=function(){this._updateDimensions(),this._injectCss()},t.prototype.clear=function(){for(var e=0,t=this._rowElements;e<t.length;e++)t[e].innerText=""},t.prototype.renderRows=function(e,t){for(var r=this._bufferService.buffer.ybase+this._bufferService.buffer.y,i=Math.min(this._bufferService.buffer.x,this._bufferService.cols-1),n=this._optionsService.options.cursorBlink,o=e;o<=t;o++){var s=this._rowElements[o];s.innerText="";var a=o+this._bufferService.buffer.ydisp,c=this._bufferService.buffer.lines.get(a),l=this._optionsService.options.cursorStyle;s.appendChild(this._rowFactory.createRow(c,a===r,l,i,n,this.dimensions.actualCellWidth,this._bufferService.cols))}},Object.defineProperty(t.prototype,"_terminalSelector",{get:function(){return"."+p+this._terminalClass},enumerable:!1,configurable:!0}),t.prototype.registerCharacterJoiner=function(e){return-1},t.prototype.deregisterCharacterJoiner=function(e){return!1},t.prototype._onLinkHover=function(e){this._setCellUnderline(e.x1,e.x2,e.y1,e.y2,e.cols,!0)},t.prototype._onLinkLeave=function(e){this._setCellUnderline(e.x1,e.x2,e.y1,e.y2,e.cols,!1)},t.prototype._setCellUnderline=function(e,t,r,i,n,o){for(;e!==t||r!==i;){var s=this._rowElements[r];if(!s)return;var a=s.children[e];a&&(a.style.textDecoration=o?"underline":"none"),++e>=n&&(e=0,r++)}},o([s(6,h.ICharSizeService),s(7,u.IOptionsService),s(8,u.IBufferService)],t)}(l.Disposable);t.DomRenderer=S},3787:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.DomRendererRowFactory=t.CURSOR_STYLE_UNDERLINE_CLASS=t.CURSOR_STYLE_BAR_CLASS=t.CURSOR_STYLE_BLOCK_CLASS=t.CURSOR_BLINK_CLASS=t.CURSOR_CLASS=t.UNDERLINE_CLASS=t.ITALIC_CLASS=t.DIM_CLASS=t.BOLD_CLASS=void 0;var i=r(8803),n=r(643),o=r(511),s=r(4774);t.BOLD_CLASS="xterm-bold",t.DIM_CLASS="xterm-dim",t.ITALIC_CLASS="xterm-italic",t.UNDERLINE_CLASS="xterm-underline",t.CURSOR_CLASS="xterm-cursor",t.CURSOR_BLINK_CLASS="xterm-cursor-blink",t.CURSOR_STYLE_BLOCK_CLASS="xterm-cursor-block",t.CURSOR_STYLE_BAR_CLASS="xterm-cursor-bar",t.CURSOR_STYLE_UNDERLINE_CLASS="xterm-cursor-underline";var a=function(){function e(e,t,r){this._document=e,this._optionsService=t,this._colors=r,this._workCell=new o.CellData}return e.prototype.setColors=function(e){this._colors=e},e.prototype.createRow=function(e,r,o,a,l,h,u){for(var f=this._document.createDocumentFragment(),_=0,d=Math.min(e.length,u)-1;d>=0;d--)if(e.loadCell(d,this._workCell).getCode()!==n.NULL_CELL_CODE||r&&d===a){_=d+1;break}for(d=0;d<_;d++){e.loadCell(d,this._workCell);var p=this._workCell.getWidth();if(0!==p){var v=this._document.createElement("span");if(p>1&&(v.style.width=h*p+"px"),r&&d===a)switch(v.classList.add(t.CURSOR_CLASS),l&&v.classList.add(t.CURSOR_BLINK_CLASS),o){case"bar":v.classList.add(t.CURSOR_STYLE_BAR_CLASS);break;case"underline":v.classList.add(t.CURSOR_STYLE_UNDERLINE_CLASS);break;default:v.classList.add(t.CURSOR_STYLE_BLOCK_CLASS)}this._workCell.isBold()&&v.classList.add(t.BOLD_CLASS),this._workCell.isItalic()&&v.classList.add(t.ITALIC_CLASS),this._workCell.isDim()&&v.classList.add(t.DIM_CLASS),this._workCell.isUnderline()&&v.classList.add(t.UNDERLINE_CLASS),this._workCell.isInvisible()?v.textContent=n.WHITESPACE_CELL_CHAR:v.textContent=this._workCell.getChars()||n.WHITESPACE_CELL_CHAR;var g=this._workCell.getFgColor(),y=this._workCell.getFgColorMode(),b=this._workCell.getBgColor(),S=this._workCell.getBgColorMode(),m=!!this._workCell.isInverse();if(m){var C=g;g=b,b=C;var w=y;y=S,S=w}switch(y){case 16777216:case 33554432:this._workCell.isBold()&&g<8&&this._optionsService.options.drawBoldTextInBrightColors&&(g+=8),this._applyMinimumContrast(v,this._colors.background,this._colors.ansi[g])||v.classList.add("xterm-fg-"+g);break;case 50331648:var E=s.rgba.toColor(g>>16&255,g>>8&255,255&g);this._applyMinimumContrast(v,this._colors.background,E)||this._addStyle(v,"color:#"+c(g.toString(16),"0",6));break;case 0:default:this._applyMinimumContrast(v,this._colors.background,this._colors.foreground)||m&&v.classList.add("xterm-fg-"+i.INVERTED_DEFAULT_COLOR)}switch(S){case 16777216:case 33554432:v.classList.add("xterm-bg-"+b);break;case 50331648:this._addStyle(v,"background-color:#"+c(b.toString(16),"0",6));break;case 0:default:m&&v.classList.add("xterm-bg-"+i.INVERTED_DEFAULT_COLOR)}f.appendChild(v)}}return f},e.prototype._applyMinimumContrast=function(e,t,r){if(1===this._optionsService.options.minimumContrastRatio)return!1;var i=this._colors.contrastCache.getColor(this._workCell.bg,this._workCell.fg);return void 0===i&&(i=s.color.ensureContrastRatio(t,r,this._optionsService.options.minimumContrastRatio),this._colors.contrastCache.setColor(this._workCell.bg,this._workCell.fg,null!=i?i:null)),!!i&&(this._addStyle(e,"color:"+i.css),!0)},e.prototype._addStyle=function(e,t){e.setAttribute("style",""+(e.getAttribute("style")||"")+t+";")},e}();function c(e,t,r){for(;e.length<r;)e=t+e;return e}t.DomRendererRowFactory=a},456:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.SelectionModel=void 0;var r=function(){function e(e){this._bufferService=e,this.isSelectAllActive=!1,this.selectionStartLength=0}return e.prototype.clearSelection=function(){this.selectionStart=void 0,this.selectionEnd=void 0,this.isSelectAllActive=!1,this.selectionStartLength=0},Object.defineProperty(e.prototype,"finalSelectionStart",{get:function(){return this.isSelectAllActive?[0,0]:this.selectionEnd&&this.selectionStart&&this.areSelectionValuesReversed()?this.selectionEnd:this.selectionStart},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"finalSelectionEnd",{get:function(){if(this.isSelectAllActive)return[this._bufferService.cols,this._bufferService.buffer.ybase+this._bufferService.rows-1];if(this.selectionStart){if(!this.selectionEnd||this.areSelectionValuesReversed()){var e=this.selectionStart[0]+this.selectionStartLength;return e>this._bufferService.cols?[e%this._bufferService.cols,this.selectionStart[1]+Math.floor(e/this._bufferService.cols)]:[e,this.selectionStart[1]]}return this.selectionStartLength&&this.selectionEnd[1]===this.selectionStart[1]?[Math.max(this.selectionStart[0]+this.selectionStartLength,this.selectionEnd[0]),this.selectionEnd[1]]:this.selectionEnd}},enumerable:!1,configurable:!0}),e.prototype.areSelectionValuesReversed=function(){var e=this.selectionStart,t=this.selectionEnd;return!(!e||!t)&&(e[1]>t[1]||e[1]===t[1]&&e[0]>t[0])},e.prototype.onTrim=function(e){return this.selectionStart&&(this.selectionStart[1]-=e),this.selectionEnd&&(this.selectionEnd[1]-=e),this.selectionEnd&&this.selectionEnd[1]<0?(this.clearSelection(),!0):(this.selectionStart&&this.selectionStart[1]<0&&(this.selectionStart[1]=0),!1)},e}();t.SelectionModel=r},428:function(e,t,r){var i=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},n=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.CharSizeService=void 0;var o=r(2585),s=r(8460),a=function(){function e(e,t,r){this._optionsService=r,this.width=0,this.height=0,this._onCharSizeChange=new s.EventEmitter,this._measureStrategy=new c(e,t,this._optionsService)}return Object.defineProperty(e.prototype,"hasValidSize",{get:function(){return this.width>0&&this.height>0},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onCharSizeChange",{get:function(){return this._onCharSizeChange.event},enumerable:!1,configurable:!0}),e.prototype.measure=function(){var e=this._measureStrategy.measure();e.width===this.width&&e.height===this.height||(this.width=e.width,this.height=e.height,this._onCharSizeChange.fire())},i([n(2,o.IOptionsService)],e)}();t.CharSizeService=a;var c=function(){function e(e,t,r){this._document=e,this._parentElement=t,this._optionsService=r,this._result={width:0,height:0},this._measureElement=this._document.createElement("span"),this._measureElement.classList.add("xterm-char-measure-element"),this._measureElement.textContent="W",this._measureElement.setAttribute("aria-hidden","true"),this._parentElement.appendChild(this._measureElement)}return e.prototype.measure=function(){this._measureElement.style.fontFamily=this._optionsService.options.fontFamily,this._measureElement.style.fontSize=this._optionsService.options.fontSize+"px";var e=this._measureElement.getBoundingClientRect();return 0!==e.width&&0!==e.height&&(this._result.width=e.width,this._result.height=Math.ceil(e.height)),this._result},e}()},5114:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.CoreBrowserService=void 0;var r=function(){function e(e){this._textarea=e}return Object.defineProperty(e.prototype,"isFocused",{get:function(){return(this._textarea.getRootNode?this._textarea.getRootNode():document).activeElement===this._textarea&&document.hasFocus()},enumerable:!1,configurable:!0}),e}();t.CoreBrowserService=r},8934:function(e,t,r){var i=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},n=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.MouseService=void 0;var o=r(4725),s=r(9806),a=function(){function e(e,t){this._renderService=e,this._charSizeService=t}return e.prototype.getCoords=function(e,t,r,i,n){return s.getCoords(e,t,r,i,this._charSizeService.hasValidSize,this._renderService.dimensions.actualCellWidth,this._renderService.dimensions.actualCellHeight,n)},e.prototype.getRawByteCoords=function(e,t,r,i){var n=this.getCoords(e,t,r,i);return s.getRawByteCoords(n)},i([n(0,o.IRenderService),n(1,o.ICharSizeService)],e)}();t.MouseService=a},3230:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},s=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.RenderService=void 0;var a=r(6193),c=r(8460),l=r(844),h=r(5596),u=r(3656),f=r(2585),_=r(4725),d=function(e){function t(t,r,i,n,o,s){var l=e.call(this)||this;if(l._renderer=t,l._rowCount=r,l._charSizeService=o,l._isPaused=!1,l._needsFullRefresh=!1,l._isNextRenderRedrawOnly=!0,l._needsSelectionRefresh=!1,l._canvasWidth=0,l._canvasHeight=0,l._selectionState={start:void 0,end:void 0,columnSelectMode:!1},l._onDimensionsChange=new c.EventEmitter,l._onRender=new c.EventEmitter,l._onRefreshRequest=new c.EventEmitter,l.register({dispose:function(){return l._renderer.dispose()}}),l._renderDebouncer=new a.RenderDebouncer((function(e,t){return l._renderRows(e,t)})),l.register(l._renderDebouncer),l._screenDprMonitor=new h.ScreenDprMonitor,l._screenDprMonitor.setListener((function(){return l.onDevicePixelRatioChange()})),l.register(l._screenDprMonitor),l.register(s.onResize((function(e){return l._fullRefresh()}))),l.register(n.onOptionChange((function(){return l._renderer.onOptionsChanged()}))),l.register(l._charSizeService.onCharSizeChange((function(){return l.onCharSizeChanged()}))),l._renderer.onRequestRedraw((function(e){return l.refreshRows(e.start,e.end,!0)})),l.register(u.addDisposableDomListener(window,"resize",(function(){return l.onDevicePixelRatioChange()}))),"IntersectionObserver"in window){var f=new IntersectionObserver((function(e){return l._onIntersectionChange(e[e.length-1])}),{threshold:0});f.observe(i),l.register({dispose:function(){return f.disconnect()}})}return l}return n(t,e),Object.defineProperty(t.prototype,"onDimensionsChange",{get:function(){return this._onDimensionsChange.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onRenderedBufferChange",{get:function(){return this._onRender.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onRefreshRequest",{get:function(){return this._onRefreshRequest.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"dimensions",{get:function(){return this._renderer.dimensions},enumerable:!1,configurable:!0}),t.prototype._onIntersectionChange=function(e){this._isPaused=void 0===e.isIntersecting?0===e.intersectionRatio:!e.isIntersecting,this._isPaused||this._charSizeService.hasValidSize||this._charSizeService.measure(),!this._isPaused&&this._needsFullRefresh&&(this.refreshRows(0,this._rowCount-1),this._needsFullRefresh=!1)},t.prototype.refreshRows=function(e,t,r){void 0===r&&(r=!1),this._isPaused?this._needsFullRefresh=!0:(r||(this._isNextRenderRedrawOnly=!1),this._renderDebouncer.refresh(e,t,this._rowCount))},t.prototype._renderRows=function(e,t){this._renderer.renderRows(e,t),this._needsSelectionRefresh&&(this._renderer.onSelectionChanged(this._selectionState.start,this._selectionState.end,this._selectionState.columnSelectMode),this._needsSelectionRefresh=!1),this._isNextRenderRedrawOnly||this._onRender.fire({start:e,end:t}),this._isNextRenderRedrawOnly=!0},t.prototype.resize=function(e,t){this._rowCount=t,this._fireOnCanvasResize()},t.prototype.changeOptions=function(){this._renderer.onOptionsChanged(),this.refreshRows(0,this._rowCount-1),this._fireOnCanvasResize()},t.prototype._fireOnCanvasResize=function(){this._renderer.dimensions.canvasWidth===this._canvasWidth&&this._renderer.dimensions.canvasHeight===this._canvasHeight||this._onDimensionsChange.fire(this._renderer.dimensions)},t.prototype.dispose=function(){e.prototype.dispose.call(this)},t.prototype.setRenderer=function(e){var t=this;this._renderer.dispose(),this._renderer=e,this._renderer.onRequestRedraw((function(e){return t.refreshRows(e.start,e.end,!0)})),this._needsSelectionRefresh=!0,this._fullRefresh()},t.prototype._fullRefresh=function(){this._isPaused?this._needsFullRefresh=!0:this.refreshRows(0,this._rowCount-1)},t.prototype.setColors=function(e){this._renderer.setColors(e),this._fullRefresh()},t.prototype.onDevicePixelRatioChange=function(){this._charSizeService.measure(),this._renderer.onDevicePixelRatioChange(),this.refreshRows(0,this._rowCount-1)},t.prototype.onResize=function(e,t){this._renderer.onResize(e,t),this._fullRefresh()},t.prototype.onCharSizeChanged=function(){this._renderer.onCharSizeChanged()},t.prototype.onBlur=function(){this._renderer.onBlur()},t.prototype.onFocus=function(){this._renderer.onFocus()},t.prototype.onSelectionChanged=function(e,t,r){this._selectionState.start=e,this._selectionState.end=t,this._selectionState.columnSelectMode=r,this._renderer.onSelectionChanged(e,t,r)},t.prototype.onCursorMove=function(){this._renderer.onCursorMove()},t.prototype.clear=function(){this._renderer.clear()},t.prototype.registerCharacterJoiner=function(e){return this._renderer.registerCharacterJoiner(e)},t.prototype.deregisterCharacterJoiner=function(e){return this._renderer.deregisterCharacterJoiner(e)},o([s(3,f.IOptionsService),s(4,_.ICharSizeService),s(5,f.IBufferService)],t)}(l.Disposable);t.RenderService=d},9312:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},s=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.SelectionService=void 0;var a=r(6114),c=r(456),l=r(511),h=r(8460),u=r(4725),f=r(2585),_=r(9806),d=r(9504),p=r(844),v=String.fromCharCode(160),g=new RegExp(v,"g"),y=function(e){function t(t,r,i,n,o,s,a){var u=e.call(this)||this;return u._element=t,u._screenElement=r,u._bufferService=i,u._coreService=n,u._mouseService=o,u._optionsService=s,u._renderService=a,u._dragScrollAmount=0,u._enabled=!0,u._workCell=new l.CellData,u._mouseDownTimeStamp=0,u._oldHasSelection=!1,u._oldSelectionStart=void 0,u._oldSelectionEnd=void 0,u._onLinuxMouseSelection=u.register(new h.EventEmitter),u._onRedrawRequest=u.register(new h.EventEmitter),u._onSelectionChange=u.register(new h.EventEmitter),u._onRequestScrollLines=u.register(new h.EventEmitter),u._mouseMoveListener=function(e){return u._onMouseMove(e)},u._mouseUpListener=function(e){return u._onMouseUp(e)},u._coreService.onUserInput((function(){u.hasSelection&&u.clearSelection()})),u._trimListener=u._bufferService.buffer.lines.onTrim((function(e){return u._onTrim(e)})),u.register(u._bufferService.buffers.onBufferActivate((function(e){return u._onBufferActivate(e)}))),u.enable(),u._model=new c.SelectionModel(u._bufferService),u._activeSelectionMode=0,u}return n(t,e),Object.defineProperty(t.prototype,"onLinuxMouseSelection",{get:function(){return this._onLinuxMouseSelection.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onRequestRedraw",{get:function(){return this._onRedrawRequest.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onSelectionChange",{get:function(){return this._onSelectionChange.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onRequestScrollLines",{get:function(){return this._onRequestScrollLines.event},enumerable:!1,configurable:!0}),t.prototype.dispose=function(){this._removeMouseDownListeners()},t.prototype.reset=function(){this.clearSelection()},t.prototype.disable=function(){this.clearSelection(),this._enabled=!1},t.prototype.enable=function(){this._enabled=!0},Object.defineProperty(t.prototype,"selectionStart",{get:function(){return this._model.finalSelectionStart},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"selectionEnd",{get:function(){return this._model.finalSelectionEnd},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"hasSelection",{get:function(){var e=this._model.finalSelectionStart,t=this._model.finalSelectionEnd;return!(!e||!t||e[0]===t[0]&&e[1]===t[1])},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"selectionText",{get:function(){var e=this._model.finalSelectionStart,t=this._model.finalSelectionEnd;if(!e||!t)return"";var r=this._bufferService.buffer,i=[];if(3===this._activeSelectionMode){if(e[0]===t[0])return"";for(var n=e[1];n<=t[1];n++){var o=r.translateBufferLineToString(n,!0,e[0],t[0]);i.push(o)}}else{var s=e[1]===t[1]?t[0]:void 0;for(i.push(r.translateBufferLineToString(e[1],!0,e[0],s)),n=e[1]+1;n<=t[1]-1;n++){var c=r.lines.get(n);o=r.translateBufferLineToString(n,!0),c&&c.isWrapped?i[i.length-1]+=o:i.push(o)}e[1]!==t[1]&&(c=r.lines.get(t[1]),o=r.translateBufferLineToString(t[1],!0,0,t[0]),c&&c.isWrapped?i[i.length-1]+=o:i.push(o))}return i.map((function(e){return e.replace(g," ")})).join(a.isWindows?"\r\n":"\n")},enumerable:!1,configurable:!0}),t.prototype.clearSelection=function(){this._model.clearSelection(),this._removeMouseDownListeners(),this.refresh(),this._onSelectionChange.fire()},t.prototype.refresh=function(e){var t=this;this._refreshAnimationFrame||(this._refreshAnimationFrame=window.requestAnimationFrame((function(){return t._refresh()}))),a.isLinux&&e&&this.selectionText.length&&this._onLinuxMouseSelection.fire(this.selectionText)},t.prototype._refresh=function(){this._refreshAnimationFrame=void 0,this._onRedrawRequest.fire({start:this._model.finalSelectionStart,end:this._model.finalSelectionEnd,columnSelectMode:3===this._activeSelectionMode})},t.prototype._isClickInSelection=function(e){var t=this._getMouseBufferCoords(e),r=this._model.finalSelectionStart,i=this._model.finalSelectionEnd;return!!(r&&i&&t)&&this._areCoordsInSelection(t,r,i)},t.prototype._areCoordsInSelection=function(e,t,r){return e[1]>t[1]&&e[1]<r[1]||t[1]===r[1]&&e[1]===t[1]&&e[0]>=t[0]&&e[0]<r[0]||t[1]<r[1]&&e[1]===r[1]&&e[0]<r[0]||t[1]<r[1]&&e[1]===t[1]&&e[0]>=t[0]},t.prototype._selectWordAtCursor=function(e){var t=this._getMouseBufferCoords(e);t&&(this._selectWordAt(t,!1),this._model.selectionEnd=void 0,this.refresh(!0))},t.prototype.selectAll=function(){this._model.isSelectAllActive=!0,this.refresh(),this._onSelectionChange.fire()},t.prototype.selectLines=function(e,t){this._model.clearSelection(),e=Math.max(e,0),t=Math.min(t,this._bufferService.buffer.lines.length-1),this._model.selectionStart=[0,e],this._model.selectionEnd=[this._bufferService.cols,t],this.refresh(),this._onSelectionChange.fire()},t.prototype._onTrim=function(e){this._model.onTrim(e)&&this.refresh()},t.prototype._getMouseBufferCoords=function(e){var t=this._mouseService.getCoords(e,this._screenElement,this._bufferService.cols,this._bufferService.rows,!0);if(t)return t[0]--,t[1]--,t[1]+=this._bufferService.buffer.ydisp,t},t.prototype._getMouseEventScrollAmount=function(e){var t=_.getCoordsRelativeToElement(e,this._screenElement)[1],r=this._renderService.dimensions.canvasHeight;return t>=0&&t<=r?0:(t>r&&(t-=r),t=Math.min(Math.max(t,-50),50),(t/=50)/Math.abs(t)+Math.round(14*t))},t.prototype.shouldForceSelection=function(e){return a.isMac?e.altKey&&this._optionsService.options.macOptionClickForcesSelection:e.shiftKey},t.prototype.onMouseDown=function(e){if(this._mouseDownTimeStamp=e.timeStamp,(2!==e.button||!this.hasSelection)&&0===e.button){if(!this._enabled){if(!this.shouldForceSelection(e))return;e.stopPropagation()}e.preventDefault(),this._dragScrollAmount=0,this._enabled&&e.shiftKey?this._onIncrementalClick(e):1===e.detail?this._onSingleClick(e):2===e.detail?this._onDoubleClick(e):3===e.detail&&this._onTripleClick(e),this._addMouseDownListeners(),this.refresh(!0)}},t.prototype._addMouseDownListeners=function(){var e=this;this._screenElement.ownerDocument&&(this._screenElement.ownerDocument.addEventListener("mousemove",this._mouseMoveListener),this._screenElement.ownerDocument.addEventListener("mouseup",this._mouseUpListener)),this._dragScrollIntervalTimer=window.setInterval((function(){return e._dragScroll()}),50)},t.prototype._removeMouseDownListeners=function(){this._screenElement.ownerDocument&&(this._screenElement.ownerDocument.removeEventListener("mousemove",this._mouseMoveListener),this._screenElement.ownerDocument.removeEventListener("mouseup",this._mouseUpListener)),clearInterval(this._dragScrollIntervalTimer),this._dragScrollIntervalTimer=void 0},t.prototype._onIncrementalClick=function(e){this._model.selectionStart&&(this._model.selectionEnd=this._getMouseBufferCoords(e))},t.prototype._onSingleClick=function(e){if(this._model.selectionStartLength=0,this._model.isSelectAllActive=!1,this._activeSelectionMode=this.shouldColumnSelect(e)?3:0,this._model.selectionStart=this._getMouseBufferCoords(e),this._model.selectionStart){this._model.selectionEnd=void 0;var t=this._bufferService.buffer.lines.get(this._model.selectionStart[1]);t&&t.length!==this._model.selectionStart[0]&&0===t.hasWidth(this._model.selectionStart[0])&&this._model.selectionStart[0]++}},t.prototype._onDoubleClick=function(e){var t=this._getMouseBufferCoords(e);t&&(this._activeSelectionMode=1,this._selectWordAt(t,!0))},t.prototype._onTripleClick=function(e){var t=this._getMouseBufferCoords(e);t&&(this._activeSelectionMode=2,this._selectLineAt(t[1]))},t.prototype.shouldColumnSelect=function(e){return e.altKey&&!(a.isMac&&this._optionsService.options.macOptionClickForcesSelection)},t.prototype._onMouseMove=function(e){if(e.stopImmediatePropagation(),this._model.selectionStart){var t=this._model.selectionEnd?[this._model.selectionEnd[0],this._model.selectionEnd[1]]:null;if(this._model.selectionEnd=this._getMouseBufferCoords(e),this._model.selectionEnd){2===this._activeSelectionMode?this._model.selectionEnd[1]<this._model.selectionStart[1]?this._model.selectionEnd[0]=0:this._model.selectionEnd[0]=this._bufferService.cols:1===this._activeSelectionMode&&this._selectToWordAt(this._model.selectionEnd),this._dragScrollAmount=this._getMouseEventScrollAmount(e),3!==this._activeSelectionMode&&(this._dragScrollAmount>0?this._model.selectionEnd[0]=this._bufferService.cols:this._dragScrollAmount<0&&(this._model.selectionEnd[0]=0));var r=this._bufferService.buffer;if(this._model.selectionEnd[1]<r.lines.length){var i=r.lines.get(this._model.selectionEnd[1]);i&&0===i.hasWidth(this._model.selectionEnd[0])&&this._model.selectionEnd[0]++}t&&t[0]===this._model.selectionEnd[0]&&t[1]===this._model.selectionEnd[1]||this.refresh(!0)}else this.refresh(!0)}},t.prototype._dragScroll=function(){if(this._model.selectionEnd&&this._model.selectionStart&&this._dragScrollAmount){this._onRequestScrollLines.fire({amount:this._dragScrollAmount,suppressScrollEvent:!1});var e=this._bufferService.buffer;this._dragScrollAmount>0?(3!==this._activeSelectionMode&&(this._model.selectionEnd[0]=this._bufferService.cols),this._model.selectionEnd[1]=Math.min(e.ydisp+this._bufferService.rows,e.lines.length-1)):(3!==this._activeSelectionMode&&(this._model.selectionEnd[0]=0),this._model.selectionEnd[1]=e.ydisp),this.refresh()}},t.prototype._onMouseUp=function(e){var t=e.timeStamp-this._mouseDownTimeStamp;if(this._removeMouseDownListeners(),this.selectionText.length<=1&&t<500&&e.altKey&&this._optionsService.getOption("altClickMovesCursor")){if(this._bufferService.buffer.ybase===this._bufferService.buffer.ydisp){var r=this._mouseService.getCoords(e,this._element,this._bufferService.cols,this._bufferService.rows,!1);if(r&&void 0!==r[0]&&void 0!==r[1]){var i=d.moveToCellSequence(r[0]-1,r[1]-1,this._bufferService,this._coreService.decPrivateModes.applicationCursorKeys);this._coreService.triggerDataEvent(i,!0)}}}else this._fireEventIfSelectionChanged()},t.prototype._fireEventIfSelectionChanged=function(){var e=this._model.finalSelectionStart,t=this._model.finalSelectionEnd,r=!(!e||!t||e[0]===t[0]&&e[1]===t[1]);r?e&&t&&(this._oldSelectionStart&&this._oldSelectionEnd&&e[0]===this._oldSelectionStart[0]&&e[1]===this._oldSelectionStart[1]&&t[0]===this._oldSelectionEnd[0]&&t[1]===this._oldSelectionEnd[1]||this._fireOnSelectionChange(e,t,r)):this._oldHasSelection&&this._fireOnSelectionChange(e,t,r)},t.prototype._fireOnSelectionChange=function(e,t,r){this._oldSelectionStart=e,this._oldSelectionEnd=t,this._oldHasSelection=r,this._onSelectionChange.fire()},t.prototype._onBufferActivate=function(e){var t=this;this.clearSelection(),this._trimListener.dispose(),this._trimListener=e.activeBuffer.lines.onTrim((function(e){return t._onTrim(e)}))},t.prototype._convertViewportColToCharacterIndex=function(e,t){for(var r=t[0],i=0;t[0]>=i;i++){var n=e.loadCell(i,this._workCell).getChars().length;0===this._workCell.getWidth()?r--:n>1&&t[0]!==i&&(r+=n-1)}return r},t.prototype.setSelection=function(e,t,r){this._model.clearSelection(),this._removeMouseDownListeners(),this._model.selectionStart=[e,t],this._model.selectionStartLength=r,this.refresh()},t.prototype.rightClickSelect=function(e){this._isClickInSelection(e)||(this._selectWordAtCursor(e),this._fireEventIfSelectionChanged())},t.prototype._getWordAt=function(e,t,r,i){if(void 0===r&&(r=!0),void 0===i&&(i=!0),!(e[0]>=this._bufferService.cols)){var n=this._bufferService.buffer,o=n.lines.get(e[1]);if(o){var s=n.translateBufferLineToString(e[1],!1),a=this._convertViewportColToCharacterIndex(o,e),c=a,l=e[0]-a,h=0,u=0,f=0,_=0;if(" "===s.charAt(a)){for(;a>0&&" "===s.charAt(a-1);)a--;for(;c<s.length&&" "===s.charAt(c+1);)c++}else{var d=e[0],p=e[0];0===o.getWidth(d)&&(h++,d--),2===o.getWidth(p)&&(u++,p++);var v=o.getString(p).length;for(v>1&&(_+=v-1,c+=v-1);d>0&&a>0&&!this._isCharWordSeparator(o.loadCell(d-1,this._workCell));){o.loadCell(d-1,this._workCell);var g=this._workCell.getChars().length;0===this._workCell.getWidth()?(h++,d--):g>1&&(f+=g-1,a-=g-1),a--,d--}for(;p<o.length&&c+1<s.length&&!this._isCharWordSeparator(o.loadCell(p+1,this._workCell));){o.loadCell(p+1,this._workCell);var y=this._workCell.getChars().length;2===this._workCell.getWidth()?(u++,p++):y>1&&(_+=y-1,c+=y-1),c++,p++}}c++;var b=a+l-h+f,S=Math.min(this._bufferService.cols,c-a+h+u-f-_);if(t||""!==s.slice(a,c).trim()){if(r&&0===b&&32!==o.getCodePoint(0)){var m=n.lines.get(e[1]-1);if(m&&o.isWrapped&&32!==m.getCodePoint(this._bufferService.cols-1)){var C=this._getWordAt([this._bufferService.cols-1,e[1]-1],!1,!0,!1);if(C){var w=this._bufferService.cols-C.start;b-=w,S+=w}}}if(i&&b+S===this._bufferService.cols&&32!==o.getCodePoint(this._bufferService.cols-1)){var E=n.lines.get(e[1]+1);if(E&&E.isWrapped&&32!==E.getCodePoint(0)){var L=this._getWordAt([0,e[1]+1],!1,!1,!0);L&&(S+=L.length)}}return{start:b,length:S}}}}},t.prototype._selectWordAt=function(e,t){var r=this._getWordAt(e,t);if(r){for(;r.start<0;)r.start+=this._bufferService.cols,e[1]--;this._model.selectionStart=[r.start,e[1]],this._model.selectionStartLength=r.length}},t.prototype._selectToWordAt=function(e){var t=this._getWordAt(e,!0);if(t){for(var r=e[1];t.start<0;)t.start+=this._bufferService.cols,r--;if(!this._model.areSelectionValuesReversed())for(;t.start+t.length>this._bufferService.cols;)t.length-=this._bufferService.cols,r++;this._model.selectionEnd=[this._model.areSelectionValuesReversed()?t.start:t.start+t.length,r]}},t.prototype._isCharWordSeparator=function(e){return 0!==e.getWidth()&&this._optionsService.options.wordSeparator.indexOf(e.getChars())>=0},t.prototype._selectLineAt=function(e){var t=this._bufferService.buffer.getWrappedRangeForLine(e);this._model.selectionStart=[0,t.first],this._model.selectionEnd=[this._bufferService.cols,t.last],this._model.selectionStartLength=0},o([s(2,f.IBufferService),s(3,f.ICoreService),s(4,u.IMouseService),s(5,f.IOptionsService),s(6,u.IRenderService)],t)}(p.Disposable);t.SelectionService=y},4725:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ISoundService=t.ISelectionService=t.IRenderService=t.IMouseService=t.ICoreBrowserService=t.ICharSizeService=void 0;var i=r(8343);t.ICharSizeService=i.createDecorator("CharSizeService"),t.ICoreBrowserService=i.createDecorator("CoreBrowserService"),t.IMouseService=i.createDecorator("MouseService"),t.IRenderService=i.createDecorator("RenderService"),t.ISelectionService=i.createDecorator("SelectionService"),t.ISoundService=i.createDecorator("SoundService")},357:function(e,t,r){var i=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},n=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.SoundService=void 0;var o=r(2585),s=function(){function e(e){this._optionsService=e}return Object.defineProperty(e,"audioContext",{get:function(){if(!e._audioContext){var t=window.AudioContext||window.webkitAudioContext;if(!t)return console.warn("Web Audio API is not supported by this browser. Consider upgrading to the latest version"),null;e._audioContext=new t}return e._audioContext},enumerable:!1,configurable:!0}),e.prototype.playBellSound=function(){var t=e.audioContext;if(t){var r=t.createBufferSource();t.decodeAudioData(this._base64ToArrayBuffer(this._removeMimeType(this._optionsService.options.bellSound)),(function(e){r.buffer=e,r.connect(t.destination),r.start(0)}))}},e.prototype._base64ToArrayBuffer=function(e){for(var t=window.atob(e),r=t.length,i=new Uint8Array(r),n=0;n<r;n++)i[n]=t.charCodeAt(n);return i.buffer},e.prototype._removeMimeType=function(e){return e.split(",")[1]},e=i([n(0,o.IOptionsService)],e)}();t.SoundService=s},6349:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.CircularList=void 0;var i=r(8460),n=function(){function e(e){this._maxLength=e,this.onDeleteEmitter=new i.EventEmitter,this.onInsertEmitter=new i.EventEmitter,this.onTrimEmitter=new i.EventEmitter,this._array=new Array(this._maxLength),this._startIndex=0,this._length=0}return Object.defineProperty(e.prototype,"onDelete",{get:function(){return this.onDeleteEmitter.event},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onInsert",{get:function(){return this.onInsertEmitter.event},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onTrim",{get:function(){return this.onTrimEmitter.event},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"maxLength",{get:function(){return this._maxLength},set:function(e){if(this._maxLength!==e){for(var t=new Array(e),r=0;r<Math.min(e,this.length);r++)t[r]=this._array[this._getCyclicIndex(r)];this._array=t,this._maxLength=e,this._startIndex=0}},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"length",{get:function(){return this._length},set:function(e){if(e>this._length)for(var t=this._length;t<e;t++)this._array[t]=void 0;this._length=e},enumerable:!1,configurable:!0}),e.prototype.get=function(e){return this._array[this._getCyclicIndex(e)]},e.prototype.set=function(e,t){this._array[this._getCyclicIndex(e)]=t},e.prototype.push=function(e){this._array[this._getCyclicIndex(this._length)]=e,this._length===this._maxLength?(this._startIndex=++this._startIndex%this._maxLength,this.onTrimEmitter.fire(1)):this._length++},e.prototype.recycle=function(){if(this._length!==this._maxLength)throw new Error("Can only recycle when the buffer is full");return this._startIndex=++this._startIndex%this._maxLength,this.onTrimEmitter.fire(1),this._array[this._getCyclicIndex(this._length-1)]},Object.defineProperty(e.prototype,"isFull",{get:function(){return this._length===this._maxLength},enumerable:!1,configurable:!0}),e.prototype.pop=function(){return this._array[this._getCyclicIndex(this._length---1)]},e.prototype.splice=function(e,t){for(var r=[],i=2;i<arguments.length;i++)r[i-2]=arguments[i];if(t){for(var n=e;n<this._length-t;n++)this._array[this._getCyclicIndex(n)]=this._array[this._getCyclicIndex(n+t)];this._length-=t,this.onDeleteEmitter.fire({index:e,amount:t})}for(n=this._length-1;n>=e;n--)this._array[this._getCyclicIndex(n+r.length)]=this._array[this._getCyclicIndex(n)];for(n=0;n<r.length;n++)this._array[this._getCyclicIndex(e+n)]=r[n];if(r.length&&this.onInsertEmitter.fire({index:e,amount:r.length}),this._length+r.length>this._maxLength){var o=this._length+r.length-this._maxLength;this._startIndex+=o,this._length=this._maxLength,this.onTrimEmitter.fire(o)}else this._length+=r.length},e.prototype.trimStart=function(e){e>this._length&&(e=this._length),this._startIndex+=e,this._length-=e,this.onTrimEmitter.fire(e)},e.prototype.shiftElements=function(e,t,r){if(!(t<=0)){if(e<0||e>=this._length)throw new Error("start argument out of range");if(e+r<0)throw new Error("Cannot shift elements in list beyond index 0");if(r>0){for(var i=t-1;i>=0;i--)this.set(e+i+r,this.get(e+i));var n=e+t+r-this._length;if(n>0)for(this._length+=n;this._length>this._maxLength;)this._length--,this._startIndex++,this.onTrimEmitter.fire(1)}else for(i=0;i<t;i++)this.set(e+i+r,this.get(e+i))}},e.prototype._getCyclicIndex=function(e){return(this._startIndex+e)%this._maxLength},e}();t.CircularList=n},1439:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.clone=void 0,t.clone=function e(t,r){if(void 0===r&&(r=5),"object"!=typeof t)return t;var i=Array.isArray(t)?[]:{};for(var n in t)i[n]=r<=1?t[n]:t[n]?e(t[n],r-1):t[n];return i}},8969:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.CoreTerminal=void 0;var o=r(844),s=r(2585),a=r(4348),c=r(7866),l=r(744),h=r(7302),u=r(6975),f=r(8460),_=r(1753),d=r(3730),p=r(1480),v=r(7994),g=r(9282),y=r(5435),b=r(5981),S=function(e){function t(t){var r=e.call(this)||this;return r._onBinary=new f.EventEmitter,r._onData=new f.EventEmitter,r._onLineFeed=new f.EventEmitter,r._onResize=new f.EventEmitter,r._onScroll=new f.EventEmitter,r._instantiationService=new a.InstantiationService,r.optionsService=new h.OptionsService(t),r._instantiationService.setService(s.IOptionsService,r.optionsService),r._bufferService=r.register(r._instantiationService.createInstance(l.BufferService)),r._instantiationService.setService(s.IBufferService,r._bufferService),r._logService=r._instantiationService.createInstance(c.LogService),r._instantiationService.setService(s.ILogService,r._logService),r._coreService=r.register(r._instantiationService.createInstance(u.CoreService,(function(){return r.scrollToBottom()}))),r._instantiationService.setService(s.ICoreService,r._coreService),r._coreMouseService=r._instantiationService.createInstance(_.CoreMouseService),r._instantiationService.setService(s.ICoreMouseService,r._coreMouseService),r._dirtyRowService=r._instantiationService.createInstance(d.DirtyRowService),r._instantiationService.setService(s.IDirtyRowService,r._dirtyRowService),r.unicodeService=r._instantiationService.createInstance(p.UnicodeService),r._instantiationService.setService(s.IUnicodeService,r.unicodeService),r._charsetService=r._instantiationService.createInstance(v.CharsetService),r._instantiationService.setService(s.ICharsetService,r._charsetService),r._inputHandler=new y.InputHandler(r._bufferService,r._charsetService,r._coreService,r._dirtyRowService,r._logService,r.optionsService,r._coreMouseService,r.unicodeService),r.register(f.forwardEvent(r._inputHandler.onLineFeed,r._onLineFeed)),r.register(r._inputHandler),r.register(f.forwardEvent(r._bufferService.onResize,r._onResize)),r.register(f.forwardEvent(r._coreService.onData,r._onData)),r.register(f.forwardEvent(r._coreService.onBinary,r._onBinary)),r.register(r.optionsService.onOptionChange((function(e){return r._updateOptions(e)}))),r._writeBuffer=new b.WriteBuffer((function(e){return r._inputHandler.parse(e)})),r}return n(t,e),Object.defineProperty(t.prototype,"onBinary",{get:function(){return this._onBinary.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onData",{get:function(){return this._onData.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onLineFeed",{get:function(){return this._onLineFeed.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onResize",{get:function(){return this._onResize.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onScroll",{get:function(){return this._onScroll.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"cols",{get:function(){return this._bufferService.cols},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"rows",{get:function(){return this._bufferService.rows},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"buffers",{get:function(){return this._bufferService.buffers},enumerable:!1,configurable:!0}),t.prototype.dispose=function(){var t;this._isDisposed||(e.prototype.dispose.call(this),null===(t=this._windowsMode)||void 0===t||t.dispose(),this._windowsMode=void 0)},t.prototype.write=function(e,t){this._writeBuffer.write(e,t)},t.prototype.writeSync=function(e){this._writeBuffer.writeSync(e)},t.prototype.resize=function(e,t){isNaN(e)||isNaN(t)||(e=Math.max(e,l.MINIMUM_COLS),t=Math.max(t,l.MINIMUM_ROWS),this._bufferService.resize(e,t))},t.prototype.scroll=function(e,t){void 0===t&&(t=!1);var r,i=this._bufferService.buffer;(r=this._cachedBlankLine)&&r.length===this.cols&&r.getFg(0)===e.fg&&r.getBg(0)===e.bg||(r=i.getBlankLine(e,t),this._cachedBlankLine=r),r.isWrapped=t;var n=i.ybase+i.scrollTop,o=i.ybase+i.scrollBottom;if(0===i.scrollTop){var s=i.lines.isFull;o===i.lines.length-1?s?i.lines.recycle().copyFrom(r):i.lines.push(r.clone()):i.lines.splice(o+1,0,r.clone()),s?this._bufferService.isUserScrolling&&(i.ydisp=Math.max(i.ydisp-1,0)):(i.ybase++,this._bufferService.isUserScrolling||i.ydisp++)}else{var a=o-n+1;i.lines.shiftElements(n+1,a-1,-1),i.lines.set(o,r.clone())}this._bufferService.isUserScrolling||(i.ydisp=i.ybase),this._dirtyRowService.markRangeDirty(i.scrollTop,i.scrollBottom),this._onScroll.fire(i.ydisp)},t.prototype.scrollLines=function(e,t){var r=this._bufferService.buffer;if(e<0){if(0===r.ydisp)return;this._bufferService.isUserScrolling=!0}else e+r.ydisp>=r.ybase&&(this._bufferService.isUserScrolling=!1);var i=r.ydisp;r.ydisp=Math.max(Math.min(r.ydisp+e,r.ybase),0),i!==r.ydisp&&(t||this._onScroll.fire(r.ydisp))},t.prototype.scrollPages=function(e){this.scrollLines(e*(this.rows-1))},t.prototype.scrollToTop=function(){this.scrollLines(-this._bufferService.buffer.ydisp)},t.prototype.scrollToBottom=function(){this.scrollLines(this._bufferService.buffer.ybase-this._bufferService.buffer.ydisp)},t.prototype.scrollToLine=function(e){var t=e-this._bufferService.buffer.ydisp;0!==t&&this.scrollLines(t)},t.prototype.addEscHandler=function(e,t){return this._inputHandler.addEscHandler(e,t)},t.prototype.addDcsHandler=function(e,t){return this._inputHandler.addDcsHandler(e,t)},t.prototype.addCsiHandler=function(e,t){return this._inputHandler.addCsiHandler(e,t)},t.prototype.addOscHandler=function(e,t){return this._inputHandler.addOscHandler(e,t)},t.prototype._setup=function(){this.optionsService.options.windowsMode&&this._enableWindowsMode()},t.prototype.reset=function(){this._inputHandler.reset(),this._bufferService.reset(),this._charsetService.reset(),this._coreService.reset(),this._coreMouseService.reset()},t.prototype._updateOptions=function(e){var t;switch(e){case"scrollback":this.buffers.resize(this.cols,this.rows);break;case"windowsMode":this.optionsService.options.windowsMode?this._enableWindowsMode():(null===(t=this._windowsMode)||void 0===t||t.dispose(),this._windowsMode=void 0)}},t.prototype._enableWindowsMode=function(){var e=this;if(!this._windowsMode){var t=[];t.push(this.onLineFeed(g.updateWindowsModeWrappedState.bind(null,this._bufferService))),t.push(this.addCsiHandler({final:"H"},(function(){return g.updateWindowsModeWrappedState(e._bufferService),!1}))),this._windowsMode={dispose:function(){for(var e=0,r=t;e<r.length;e++)r[e].dispose()}}}},t}(o.Disposable);t.CoreTerminal=S},8460:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.forwardEvent=t.EventEmitter=void 0;var r=function(){function e(){this._listeners=[],this._disposed=!1}return Object.defineProperty(e.prototype,"event",{get:function(){var e=this;return this._event||(this._event=function(t){return e._listeners.push(t),{dispose:function(){if(!e._disposed)for(var r=0;r<e._listeners.length;r++)if(e._listeners[r]===t)return void e._listeners.splice(r,1)}}}),this._event},enumerable:!1,configurable:!0}),e.prototype.fire=function(e,t){for(var r=[],i=0;i<this._listeners.length;i++)r.push(this._listeners[i]);for(i=0;i<r.length;i++)r[i].call(void 0,e,t)},e.prototype.dispose=function(){this._listeners&&(this._listeners.length=0),this._disposed=!0},e}();t.EventEmitter=r,t.forwardEvent=function(e,t){return e((function(e){return t.fire(e)}))}},5435:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.InputHandler=t.WindowsOptionsReportType=void 0;var o,s=r(2584),a=r(7116),c=r(2015),l=r(844),h=r(8273),u=r(482),f=r(8437),_=r(8460),d=r(643),p=r(511),v=r(3734),g=r(6242),y=r(6351),b={"(":0,")":1,"*":2,"+":3,"-":1,".":2},S=131072;function m(e,t){if(e>24)return t.setWinLines||!1;switch(e){case 1:return!!t.restoreWin;case 2:return!!t.minimizeWin;case 3:return!!t.setWinPosition;case 4:return!!t.setWinSizePixels;case 5:return!!t.raiseWin;case 6:return!!t.lowerWin;case 7:return!!t.refreshWin;case 8:return!!t.setWinSizeChars;case 9:return!!t.maximizeWin;case 10:return!!t.fullscreenWin;case 11:return!!t.getWinState;case 13:return!!t.getWinPosition;case 14:return!!t.getWinSizePixels;case 15:return!!t.getScreenSizePixels;case 16:return!!t.getCellSizePixels;case 18:return!!t.getWinSizeChars;case 19:return!!t.getScreenSizeChars;case 20:return!!t.getIconTitle;case 21:return!!t.getWinTitle;case 22:return!!t.pushTitle;case 23:return!!t.popTitle;case 24:return!!t.setWinLines}return!1}!function(e){e[e.GET_WIN_SIZE_PIXELS=0]="GET_WIN_SIZE_PIXELS",e[e.GET_CELL_SIZE_PIXELS=1]="GET_CELL_SIZE_PIXELS"}(o=t.WindowsOptionsReportType||(t.WindowsOptionsReportType={}));var C=function(){function e(e,t,r,i){this._bufferService=e,this._coreService=t,this._logService=r,this._optionsService=i,this._data=new Uint32Array(0)}return e.prototype.hook=function(e){this._data=new Uint32Array(0)},e.prototype.put=function(e,t,r){this._data=h.concat(this._data,e.subarray(t,r))},e.prototype.unhook=function(e){if(!e)return this._data=new Uint32Array(0),!0;var t=u.utf32ToString(this._data);switch(this._data=new Uint32Array(0),t){case'"q':this._coreService.triggerDataEvent(s.C0.ESC+'P1$r0"q'+s.C0.ESC+"\\");break;case'"p':this._coreService.triggerDataEvent(s.C0.ESC+'P1$r61;1"p'+s.C0.ESC+"\\");break;case"r":var r=this._bufferService.buffer.scrollTop+1+";"+(this._bufferService.buffer.scrollBottom+1)+"r";this._coreService.triggerDataEvent(s.C0.ESC+"P1$r"+r+s.C0.ESC+"\\");break;case"m":this._coreService.triggerDataEvent(s.C0.ESC+"P1$r0m"+s.C0.ESC+"\\");break;case" q":var i={block:2,underline:4,bar:6}[this._optionsService.options.cursorStyle];i-=this._optionsService.options.cursorBlink?1:0,this._coreService.triggerDataEvent(s.C0.ESC+"P1$r"+i+" q"+s.C0.ESC+"\\");break;default:this._logService.debug("Unknown DCS $q %s",t),this._coreService.triggerDataEvent(s.C0.ESC+"P0$r"+s.C0.ESC+"\\")}return!0},e}(),w=function(e){function t(t,r,i,n,o,l,h,d,v){void 0===v&&(v=new c.EscapeSequenceParser);var y=e.call(this)||this;y._bufferService=t,y._charsetService=r,y._coreService=i,y._dirtyRowService=n,y._logService=o,y._optionsService=l,y._coreMouseService=h,y._unicodeService=d,y._parser=v,y._parseBuffer=new Uint32Array(4096),y._stringDecoder=new u.StringToUtf32,y._utf8Decoder=new u.Utf8ToUtf32,y._workCell=new p.CellData,y._windowTitle="",y._iconName="",y._windowTitleStack=[],y._iconNameStack=[],y._curAttrData=f.DEFAULT_ATTR_DATA.clone(),y._eraseAttrDataInternal=f.DEFAULT_ATTR_DATA.clone(),y._onRequestBell=new _.EventEmitter,y._onRequestRefreshRows=new _.EventEmitter,y._onRequestReset=new _.EventEmitter,y._onRequestScroll=new _.EventEmitter,y._onRequestSyncScrollBar=new _.EventEmitter,y._onRequestWindowsOptionsReport=new _.EventEmitter,y._onA11yChar=new _.EventEmitter,y._onA11yTab=new _.EventEmitter,y._onCursorMove=new _.EventEmitter,y._onLineFeed=new _.EventEmitter,y._onScroll=new _.EventEmitter,y._onTitleChange=new _.EventEmitter,y._onAnsiColorChange=new _.EventEmitter,y.register(y._parser),y._parser.setCsiHandlerFallback((function(e,t){y._logService.debug("Unknown CSI code: ",{identifier:y._parser.identToString(e),params:t.toArray()})})),y._parser.setEscHandlerFallback((function(e){y._logService.debug("Unknown ESC code: ",{identifier:y._parser.identToString(e)})})),y._parser.setExecuteHandlerFallback((function(e){y._logService.debug("Unknown EXECUTE code: ",{code:e})})),y._parser.setOscHandlerFallback((function(e,t,r){y._logService.debug("Unknown OSC code: ",{identifier:e,action:t,data:r})})),y._parser.setDcsHandlerFallback((function(e,t,r){"HOOK"===t&&(r=r.toArray()),y._logService.debug("Unknown DCS code: ",{identifier:y._parser.identToString(e),action:t,payload:r})})),y._parser.setPrintHandler((function(e,t,r){return y.print(e,t,r)})),y._parser.registerCsiHandler({final:"@"},(function(e){return y.insertChars(e)})),y._parser.registerCsiHandler({intermediates:" ",final:"@"},(function(e){return y.scrollLeft(e)})),y._parser.registerCsiHandler({final:"A"},(function(e){return y.cursorUp(e)})),y._parser.registerCsiHandler({intermediates:" ",final:"A"},(function(e){return y.scrollRight(e)})),y._parser.registerCsiHandler({final:"B"},(function(e){return y.cursorDown(e)})),y._parser.registerCsiHandler({final:"C"},(function(e){return y.cursorForward(e)})),y._parser.registerCsiHandler({final:"D"},(function(e){return y.cursorBackward(e)})),y._parser.registerCsiHandler({final:"E"},(function(e){return y.cursorNextLine(e)})),y._parser.registerCsiHandler({final:"F"},(function(e){return y.cursorPrecedingLine(e)})),y._parser.registerCsiHandler({final:"G"},(function(e){return y.cursorCharAbsolute(e)})),y._parser.registerCsiHandler({final:"H"},(function(e){return y.cursorPosition(e)})),y._parser.registerCsiHandler({final:"I"},(function(e){return y.cursorForwardTab(e)})),y._parser.registerCsiHandler({final:"J"},(function(e){return y.eraseInDisplay(e)})),y._parser.registerCsiHandler({prefix:"?",final:"J"},(function(e){return y.eraseInDisplay(e)})),y._parser.registerCsiHandler({final:"K"},(function(e){return y.eraseInLine(e)})),y._parser.registerCsiHandler({prefix:"?",final:"K"},(function(e){return y.eraseInLine(e)})),y._parser.registerCsiHandler({final:"L"},(function(e){return y.insertLines(e)})),y._parser.registerCsiHandler({final:"M"},(function(e){return y.deleteLines(e)})),y._parser.registerCsiHandler({final:"P"},(function(e){return y.deleteChars(e)})),y._parser.registerCsiHandler({final:"S"},(function(e){return y.scrollUp(e)})),y._parser.registerCsiHandler({final:"T"},(function(e){return y.scrollDown(e)})),y._parser.registerCsiHandler({final:"X"},(function(e){return y.eraseChars(e)})),y._parser.registerCsiHandler({final:"Z"},(function(e){return y.cursorBackwardTab(e)})),y._parser.registerCsiHandler({final:"`"},(function(e){return y.charPosAbsolute(e)})),y._parser.registerCsiHandler({final:"a"},(function(e){return y.hPositionRelative(e)})),y._parser.registerCsiHandler({final:"b"},(function(e){return y.repeatPrecedingCharacter(e)})),y._parser.registerCsiHandler({final:"c"},(function(e){return y.sendDeviceAttributesPrimary(e)})),y._parser.registerCsiHandler({prefix:">",final:"c"},(function(e){return y.sendDeviceAttributesSecondary(e)})),y._parser.registerCsiHandler({final:"d"},(function(e){return y.linePosAbsolute(e)})),y._parser.registerCsiHandler({final:"e"},(function(e){return y.vPositionRelative(e)})),y._parser.registerCsiHandler({final:"f"},(function(e){return y.hVPosition(e)})),y._parser.registerCsiHandler({final:"g"},(function(e){return y.tabClear(e)})),y._parser.registerCsiHandler({final:"h"},(function(e){return y.setMode(e)})),y._parser.registerCsiHandler({prefix:"?",final:"h"},(function(e){return y.setModePrivate(e)})),y._parser.registerCsiHandler({final:"l"},(function(e){return y.resetMode(e)})),y._parser.registerCsiHandler({prefix:"?",final:"l"},(function(e){return y.resetModePrivate(e)})),y._parser.registerCsiHandler({final:"m"},(function(e){return y.charAttributes(e)})),y._parser.registerCsiHandler({final:"n"},(function(e){return y.deviceStatus(e)})),y._parser.registerCsiHandler({prefix:"?",final:"n"},(function(e){return y.deviceStatusPrivate(e)})),y._parser.registerCsiHandler({intermediates:"!",final:"p"},(function(e){return y.softReset(e)})),y._parser.registerCsiHandler({intermediates:" ",final:"q"},(function(e){return y.setCursorStyle(e)})),y._parser.registerCsiHandler({final:"r"},(function(e){return y.setScrollRegion(e)})),y._parser.registerCsiHandler({final:"s"},(function(e){return y.saveCursor(e)})),y._parser.registerCsiHandler({final:"t"},(function(e){return y.windowOptions(e)})),y._parser.registerCsiHandler({final:"u"},(function(e){return y.restoreCursor(e)})),y._parser.registerCsiHandler({intermediates:"'",final:"}"},(function(e){return y.insertColumns(e)})),y._parser.registerCsiHandler({intermediates:"'",final:"~"},(function(e){return y.deleteColumns(e)})),y._parser.setExecuteHandler(s.C0.BEL,(function(){return y.bell()})),y._parser.setExecuteHandler(s.C0.LF,(function(){return y.lineFeed()})),y._parser.setExecuteHandler(s.C0.VT,(function(){return y.lineFeed()})),y._parser.setExecuteHandler(s.C0.FF,(function(){return y.lineFeed()})),y._parser.setExecuteHandler(s.C0.CR,(function(){return y.carriageReturn()})),y._parser.setExecuteHandler(s.C0.BS,(function(){return y.backspace()})),y._parser.setExecuteHandler(s.C0.HT,(function(){return y.tab()})),y._parser.setExecuteHandler(s.C0.SO,(function(){return y.shiftOut()})),y._parser.setExecuteHandler(s.C0.SI,(function(){return y.shiftIn()})),y._parser.setExecuteHandler(s.C1.IND,(function(){return y.index()})),y._parser.setExecuteHandler(s.C1.NEL,(function(){return y.nextLine()})),y._parser.setExecuteHandler(s.C1.HTS,(function(){return y.tabSet()})),y._parser.registerOscHandler(0,new g.OscHandler((function(e){return y.setTitle(e),y.setIconName(e),!0}))),y._parser.registerOscHandler(1,new g.OscHandler((function(e){return y.setIconName(e)}))),y._parser.registerOscHandler(2,new g.OscHandler((function(e){return y.setTitle(e)}))),y._parser.registerOscHandler(4,new g.OscHandler((function(e){return y.setAnsiColor(e)}))),y._parser.registerEscHandler({final:"7"},(function(){return y.saveCursor()})),y._parser.registerEscHandler({final:"8"},(function(){return y.restoreCursor()})),y._parser.registerEscHandler({final:"D"},(function(){return y.index()})),y._parser.registerEscHandler({final:"E"},(function(){return y.nextLine()})),y._parser.registerEscHandler({final:"H"},(function(){return y.tabSet()})),y._parser.registerEscHandler({final:"M"},(function(){return y.reverseIndex()})),y._parser.registerEscHandler({final:"="},(function(){return y.keypadApplicationMode()})),y._parser.registerEscHandler({final:">"},(function(){return y.keypadNumericMode()})),y._parser.registerEscHandler({final:"c"},(function(){return y.fullReset()})),y._parser.registerEscHandler({final:"n"},(function(){return y.setgLevel(2)})),y._parser.registerEscHandler({final:"o"},(function(){return y.setgLevel(3)})),y._parser.registerEscHandler({final:"|"},(function(){return y.setgLevel(3)})),y._parser.registerEscHandler({final:"}"},(function(){return y.setgLevel(2)})),y._parser.registerEscHandler({final:"~"},(function(){return y.setgLevel(1)})),y._parser.registerEscHandler({intermediates:"%",final:"@"},(function(){return y.selectDefaultCharset()})),y._parser.registerEscHandler({intermediates:"%",final:"G"},(function(){return y.selectDefaultCharset()}));var b=function(e){S._parser.registerEscHandler({intermediates:"(",final:e},(function(){return y.selectCharset("("+e)})),S._parser.registerEscHandler({intermediates:")",final:e},(function(){return y.selectCharset(")"+e)})),S._parser.registerEscHandler({intermediates:"*",final:e},(function(){return y.selectCharset("*"+e)})),S._parser.registerEscHandler({intermediates:"+",final:e},(function(){return y.selectCharset("+"+e)})),S._parser.registerEscHandler({intermediates:"-",final:e},(function(){return y.selectCharset("-"+e)})),S._parser.registerEscHandler({intermediates:".",final:e},(function(){return y.selectCharset("."+e)})),S._parser.registerEscHandler({intermediates:"/",final:e},(function(){return y.selectCharset("/"+e)}))},S=this;for(var m in a.CHARSETS)b(m);return y._parser.registerEscHandler({intermediates:"#",final:"8"},(function(){return y.screenAlignmentPattern()})),y._parser.setErrorHandler((function(e){return y._logService.error("Parsing error: ",e),e})),y._parser.registerDcsHandler({intermediates:"$",final:"q"},new C(y._bufferService,y._coreService,y._logService,y._optionsService)),y}return n(t,e),Object.defineProperty(t.prototype,"onRequestBell",{get:function(){return this._onRequestBell.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onRequestRefreshRows",{get:function(){return this._onRequestRefreshRows.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onRequestReset",{get:function(){return this._onRequestReset.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onRequestScroll",{get:function(){return this._onRequestScroll.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onRequestSyncScrollBar",{get:function(){return this._onRequestSyncScrollBar.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onRequestWindowsOptionsReport",{get:function(){return this._onRequestWindowsOptionsReport.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onA11yChar",{get:function(){return this._onA11yChar.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onA11yTab",{get:function(){return this._onA11yTab.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onCursorMove",{get:function(){return this._onCursorMove.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onLineFeed",{get:function(){return this._onLineFeed.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onScroll",{get:function(){return this._onScroll.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onTitleChange",{get:function(){return this._onTitleChange.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onAnsiColorChange",{get:function(){return this._onAnsiColorChange.event},enumerable:!1,configurable:!0}),t.prototype.dispose=function(){e.prototype.dispose.call(this)},t.prototype.parse=function(e){var t=this._bufferService.buffer,r=t.x,i=t.y;if(this._logService.debug("parsing data",e),this._parseBuffer.length<e.length&&this._parseBuffer.length<S&&(this._parseBuffer=new Uint32Array(Math.min(e.length,S))),this._dirtyRowService.clearRange(),e.length>S)for(var n=0;n<e.length;n+=S){var o=n+S<e.length?n+S:e.length,s="string"==typeof e?this._stringDecoder.decode(e.substring(n,o),this._parseBuffer):this._utf8Decoder.decode(e.subarray(n,o),this._parseBuffer);this._parser.parse(this._parseBuffer,s)}else s="string"==typeof e?this._stringDecoder.decode(e,this._parseBuffer):this._utf8Decoder.decode(e,this._parseBuffer),this._parser.parse(this._parseBuffer,s);(t=this._bufferService.buffer).x===r&&t.y===i||this._onCursorMove.fire(),this._onRequestRefreshRows.fire(this._dirtyRowService.start,this._dirtyRowService.end)},t.prototype.print=function(e,t,r){var i,n,o=this._bufferService.buffer,s=this._charsetService.charset,a=this._optionsService.options.screenReaderMode,c=this._bufferService.cols,l=this._coreService.decPrivateModes.wraparound,h=this._coreService.modes.insertMode,f=this._curAttrData,_=o.lines.get(o.ybase+o.y);this._dirtyRowService.markDirty(o.y),o.x&&r-t>0&&2===_.getWidth(o.x-1)&&_.setCellFromCodePoint(o.x-1,0,1,f.fg,f.bg,f.extended);for(var p=t;p<r;++p){if(i=e[p],n=this._unicodeService.wcwidth(i),i<127&&s){var v=s[String.fromCharCode(i)];v&&(i=v.charCodeAt(0))}if(a&&this._onA11yChar.fire(u.stringFromCodePoint(i)),n||!o.x){if(o.x+n-1>=c)if(l){for(;o.x<c;)_.setCellFromCodePoint(o.x++,0,1,f.fg,f.bg,f.extended);o.x=0,o.y++,o.y===o.scrollBottom+1?(o.y--,this._onRequestScroll.fire(this._eraseAttrData(),!0)):(o.y>=this._bufferService.rows&&(o.y=this._bufferService.rows-1),o.lines.get(o.ybase+o.y).isWrapped=!0),_=o.lines.get(o.ybase+o.y)}else if(o.x=c-1,2===n)continue;if(h&&(_.insertCells(o.x,n,o.getNullCell(f),f),2===_.getWidth(c-1)&&_.setCellFromCodePoint(c-1,d.NULL_CELL_CODE,d.NULL_CELL_WIDTH,f.fg,f.bg,f.extended)),_.setCellFromCodePoint(o.x++,i,n,f.fg,f.bg,f.extended),n>0)for(;--n;)_.setCellFromCodePoint(o.x++,0,0,f.fg,f.bg,f.extended)}else _.getWidth(o.x-1)?_.addCodepointToCell(o.x-1,i):_.addCodepointToCell(o.x-2,i)}r-t>0&&(_.loadCell(o.x-1,this._workCell),2===this._workCell.getWidth()||this._workCell.getCode()>65535?this._parser.precedingCodepoint=0:this._workCell.isCombined()?this._parser.precedingCodepoint=this._workCell.getChars().charCodeAt(0):this._parser.precedingCodepoint=this._workCell.content),o.x<c&&r-t>0&&0===_.getWidth(o.x)&&!_.hasContent(o.x)&&_.setCellFromCodePoint(o.x,0,1,f.fg,f.bg,f.extended),this._dirtyRowService.markDirty(o.y)},t.prototype.addCsiHandler=function(e,t){var r=this;return"t"!==e.final||e.prefix||e.intermediates?this._parser.registerCsiHandler(e,t):this._parser.registerCsiHandler(e,(function(e){return!m(e.params[0],r._optionsService.options.windowOptions)||t(e)}))},t.prototype.addDcsHandler=function(e,t){return this._parser.registerDcsHandler(e,new y.DcsHandler(t))},t.prototype.addEscHandler=function(e,t){return this._parser.registerEscHandler(e,t)},t.prototype.addOscHandler=function(e,t){return this._parser.registerOscHandler(e,new g.OscHandler(t))},t.prototype.bell=function(){return this._onRequestBell.fire(),!0},t.prototype.lineFeed=function(){var e=this._bufferService.buffer;return this._dirtyRowService.markDirty(e.y),this._optionsService.options.convertEol&&(e.x=0),e.y++,e.y===e.scrollBottom+1?(e.y--,this._onRequestScroll.fire(this._eraseAttrData())):e.y>=this._bufferService.rows&&(e.y=this._bufferService.rows-1),e.x>=this._bufferService.cols&&e.x--,this._dirtyRowService.markDirty(e.y),this._onLineFeed.fire(),!0},t.prototype.carriageReturn=function(){return this._bufferService.buffer.x=0,!0},t.prototype.backspace=function(){var e,t=this._bufferService.buffer;if(!this._coreService.decPrivateModes.reverseWraparound)return this._restrictCursor(),t.x>0&&t.x--,!0;if(this._restrictCursor(this._bufferService.cols),t.x>0)t.x--;else if(0===t.x&&t.y>t.scrollTop&&t.y<=t.scrollBottom&&(null===(e=t.lines.get(t.ybase+t.y))||void 0===e?void 0:e.isWrapped)){t.lines.get(t.ybase+t.y).isWrapped=!1,t.y--,t.x=this._bufferService.cols-1;var r=t.lines.get(t.ybase+t.y);r.hasWidth(t.x)&&!r.hasContent(t.x)&&t.x--}return this._restrictCursor(),!0},t.prototype.tab=function(){if(this._bufferService.buffer.x>=this._bufferService.cols)return!0;var e=this._bufferService.buffer.x;return this._bufferService.buffer.x=this._bufferService.buffer.nextStop(),this._optionsService.options.screenReaderMode&&this._onA11yTab.fire(this._bufferService.buffer.x-e),!0},t.prototype.shiftOut=function(){return this._charsetService.setgLevel(1),!0},t.prototype.shiftIn=function(){return this._charsetService.setgLevel(0),!0},t.prototype._restrictCursor=function(e){void 0===e&&(e=this._bufferService.cols-1),this._bufferService.buffer.x=Math.min(e,Math.max(0,this._bufferService.buffer.x)),this._bufferService.buffer.y=this._coreService.decPrivateModes.origin?Math.min(this._bufferService.buffer.scrollBottom,Math.max(this._bufferService.buffer.scrollTop,this._bufferService.buffer.y)):Math.min(this._bufferService.rows-1,Math.max(0,this._bufferService.buffer.y)),this._dirtyRowService.markDirty(this._bufferService.buffer.y)},t.prototype._setCursor=function(e,t){this._dirtyRowService.markDirty(this._bufferService.buffer.y),this._coreService.decPrivateModes.origin?(this._bufferService.buffer.x=e,this._bufferService.buffer.y=this._bufferService.buffer.scrollTop+t):(this._bufferService.buffer.x=e,this._bufferService.buffer.y=t),this._restrictCursor(),this._dirtyRowService.markDirty(this._bufferService.buffer.y)},t.prototype._moveCursor=function(e,t){this._restrictCursor(),this._setCursor(this._bufferService.buffer.x+e,this._bufferService.buffer.y+t)},t.prototype.cursorUp=function(e){var t=this._bufferService.buffer.y-this._bufferService.buffer.scrollTop;return t>=0?this._moveCursor(0,-Math.min(t,e.params[0]||1)):this._moveCursor(0,-(e.params[0]||1)),!0},t.prototype.cursorDown=function(e){var t=this._bufferService.buffer.scrollBottom-this._bufferService.buffer.y;return t>=0?this._moveCursor(0,Math.min(t,e.params[0]||1)):this._moveCursor(0,e.params[0]||1),!0},t.prototype.cursorForward=function(e){return this._moveCursor(e.params[0]||1,0),!0},t.prototype.cursorBackward=function(e){return this._moveCursor(-(e.params[0]||1),0),!0},t.prototype.cursorNextLine=function(e){return this.cursorDown(e),this._bufferService.buffer.x=0,!0},t.prototype.cursorPrecedingLine=function(e){return this.cursorUp(e),this._bufferService.buffer.x=0,!0},t.prototype.cursorCharAbsolute=function(e){return this._setCursor((e.params[0]||1)-1,this._bufferService.buffer.y),!0},t.prototype.cursorPosition=function(e){return this._setCursor(e.length>=2?(e.params[1]||1)-1:0,(e.params[0]||1)-1),!0},t.prototype.charPosAbsolute=function(e){return this._setCursor((e.params[0]||1)-1,this._bufferService.buffer.y),!0},t.prototype.hPositionRelative=function(e){return this._moveCursor(e.params[0]||1,0),!0},t.prototype.linePosAbsolute=function(e){return this._setCursor(this._bufferService.buffer.x,(e.params[0]||1)-1),!0},t.prototype.vPositionRelative=function(e){return this._moveCursor(0,e.params[0]||1),!0},t.prototype.hVPosition=function(e){return this.cursorPosition(e),!0},t.prototype.tabClear=function(e){var t=e.params[0];return 0===t?delete this._bufferService.buffer.tabs[this._bufferService.buffer.x]:3===t&&(this._bufferService.buffer.tabs={}),!0},t.prototype.cursorForwardTab=function(e){if(this._bufferService.buffer.x>=this._bufferService.cols)return!0;for(var t=e.params[0]||1;t--;)this._bufferService.buffer.x=this._bufferService.buffer.nextStop();return!0},t.prototype.cursorBackwardTab=function(e){if(this._bufferService.buffer.x>=this._bufferService.cols)return!0;for(var t=e.params[0]||1,r=this._bufferService.buffer;t--;)r.x=r.prevStop();return!0},t.prototype._eraseInBufferLine=function(e,t,r,i){void 0===i&&(i=!1);var n=this._bufferService.buffer.lines.get(this._bufferService.buffer.ybase+e);n.replaceCells(t,r,this._bufferService.buffer.getNullCell(this._eraseAttrData()),this._eraseAttrData()),i&&(n.isWrapped=!1)},t.prototype._resetBufferLine=function(e){var t=this._bufferService.buffer.lines.get(this._bufferService.buffer.ybase+e);t.fill(this._bufferService.buffer.getNullCell(this._eraseAttrData())),t.isWrapped=!1},t.prototype.eraseInDisplay=function(e){var t;switch(this._restrictCursor(),e.params[0]){case 0:for(t=this._bufferService.buffer.y,this._dirtyRowService.markDirty(t),this._eraseInBufferLine(t++,this._bufferService.buffer.x,this._bufferService.cols,0===this._bufferService.buffer.x);t<this._bufferService.rows;t++)this._resetBufferLine(t);this._dirtyRowService.markDirty(t);break;case 1:for(t=this._bufferService.buffer.y,this._dirtyRowService.markDirty(t),this._eraseInBufferLine(t,0,this._bufferService.buffer.x+1,!0),this._bufferService.buffer.x+1>=this._bufferService.cols&&(this._bufferService.buffer.lines.get(t+1).isWrapped=!1);t--;)this._resetBufferLine(t);this._dirtyRowService.markDirty(0);break;case 2:for(t=this._bufferService.rows,this._dirtyRowService.markDirty(t-1);t--;)this._resetBufferLine(t);this._dirtyRowService.markDirty(0);break;case 3:var r=this._bufferService.buffer.lines.length-this._bufferService.rows;r>0&&(this._bufferService.buffer.lines.trimStart(r),this._bufferService.buffer.ybase=Math.max(this._bufferService.buffer.ybase-r,0),this._bufferService.buffer.ydisp=Math.max(this._bufferService.buffer.ydisp-r,0),this._onScroll.fire(0))}return!0},t.prototype.eraseInLine=function(e){switch(this._restrictCursor(),e.params[0]){case 0:this._eraseInBufferLine(this._bufferService.buffer.y,this._bufferService.buffer.x,this._bufferService.cols);break;case 1:this._eraseInBufferLine(this._bufferService.buffer.y,0,this._bufferService.buffer.x+1);break;case 2:this._eraseInBufferLine(this._bufferService.buffer.y,0,this._bufferService.cols)}return this._dirtyRowService.markDirty(this._bufferService.buffer.y),!0},t.prototype.insertLines=function(e){this._restrictCursor();var t=e.params[0]||1,r=this._bufferService.buffer;if(r.y>r.scrollBottom||r.y<r.scrollTop)return!0;for(var i=r.ybase+r.y,n=this._bufferService.rows-1-r.scrollBottom,o=this._bufferService.rows-1+r.ybase-n+1;t--;)r.lines.splice(o-1,1),r.lines.splice(i,0,r.getBlankLine(this._eraseAttrData()));return this._dirtyRowService.markRangeDirty(r.y,r.scrollBottom),r.x=0,!0},t.prototype.deleteLines=function(e){this._restrictCursor();var t=e.params[0]||1,r=this._bufferService.buffer;if(r.y>r.scrollBottom||r.y<r.scrollTop)return!0;var i,n=r.ybase+r.y;for(i=this._bufferService.rows-1-r.scrollBottom,i=this._bufferService.rows-1+r.ybase-i;t--;)r.lines.splice(n,1),r.lines.splice(i,0,r.getBlankLine(this._eraseAttrData()));return this._dirtyRowService.markRangeDirty(r.y,r.scrollBottom),r.x=0,!0},t.prototype.insertChars=function(e){this._restrictCursor();var t=this._bufferService.buffer.lines.get(this._bufferService.buffer.ybase+this._bufferService.buffer.y);return t&&(t.insertCells(this._bufferService.buffer.x,e.params[0]||1,this._bufferService.buffer.getNullCell(this._eraseAttrData()),this._eraseAttrData()),this._dirtyRowService.markDirty(this._bufferService.buffer.y)),!0},t.prototype.deleteChars=function(e){this._restrictCursor();var t=this._bufferService.buffer.lines.get(this._bufferService.buffer.ybase+this._bufferService.buffer.y);return t&&(t.deleteCells(this._bufferService.buffer.x,e.params[0]||1,this._bufferService.buffer.getNullCell(this._eraseAttrData()),this._eraseAttrData()),this._dirtyRowService.markDirty(this._bufferService.buffer.y)),!0},t.prototype.scrollUp=function(e){for(var t=e.params[0]||1,r=this._bufferService.buffer;t--;)r.lines.splice(r.ybase+r.scrollTop,1),r.lines.splice(r.ybase+r.scrollBottom,0,r.getBlankLine(this._eraseAttrData()));return this._dirtyRowService.markRangeDirty(r.scrollTop,r.scrollBottom),!0},t.prototype.scrollDown=function(e){for(var t=e.params[0]||1,r=this._bufferService.buffer;t--;)r.lines.splice(r.ybase+r.scrollBottom,1),r.lines.splice(r.ybase+r.scrollTop,0,r.getBlankLine(f.DEFAULT_ATTR_DATA));return this._dirtyRowService.markRangeDirty(r.scrollTop,r.scrollBottom),!0},t.prototype.scrollLeft=function(e){var t=this._bufferService.buffer;if(t.y>t.scrollBottom||t.y<t.scrollTop)return!0;for(var r=e.params[0]||1,i=t.scrollTop;i<=t.scrollBottom;++i){var n=t.lines.get(t.ybase+i);n.deleteCells(0,r,t.getNullCell(this._eraseAttrData()),this._eraseAttrData()),n.isWrapped=!1}return this._dirtyRowService.markRangeDirty(t.scrollTop,t.scrollBottom),!0},t.prototype.scrollRight=function(e){var t=this._bufferService.buffer;if(t.y>t.scrollBottom||t.y<t.scrollTop)return!0;for(var r=e.params[0]||1,i=t.scrollTop;i<=t.scrollBottom;++i){var n=t.lines.get(t.ybase+i);n.insertCells(0,r,t.getNullCell(this._eraseAttrData()),this._eraseAttrData()),n.isWrapped=!1}return this._dirtyRowService.markRangeDirty(t.scrollTop,t.scrollBottom),!0},t.prototype.insertColumns=function(e){var t=this._bufferService.buffer;if(t.y>t.scrollBottom||t.y<t.scrollTop)return!0;for(var r=e.params[0]||1,i=t.scrollTop;i<=t.scrollBottom;++i){var n=this._bufferService.buffer.lines.get(t.ybase+i);n.insertCells(t.x,r,t.getNullCell(this._eraseAttrData()),this._eraseAttrData()),n.isWrapped=!1}return this._dirtyRowService.markRangeDirty(t.scrollTop,t.scrollBottom),!0},t.prototype.deleteColumns=function(e){var t=this._bufferService.buffer;if(t.y>t.scrollBottom||t.y<t.scrollTop)return!0;for(var r=e.params[0]||1,i=t.scrollTop;i<=t.scrollBottom;++i){var n=t.lines.get(t.ybase+i);n.deleteCells(t.x,r,t.getNullCell(this._eraseAttrData()),this._eraseAttrData()),n.isWrapped=!1}return this._dirtyRowService.markRangeDirty(t.scrollTop,t.scrollBottom),!0},t.prototype.eraseChars=function(e){this._restrictCursor();var t=this._bufferService.buffer.lines.get(this._bufferService.buffer.ybase+this._bufferService.buffer.y);return t&&(t.replaceCells(this._bufferService.buffer.x,this._bufferService.buffer.x+(e.params[0]||1),this._bufferService.buffer.getNullCell(this._eraseAttrData()),this._eraseAttrData()),this._dirtyRowService.markDirty(this._bufferService.buffer.y)),!0},t.prototype.repeatPrecedingCharacter=function(e){if(!this._parser.precedingCodepoint)return!0;for(var t=e.params[0]||1,r=new Uint32Array(t),i=0;i<t;++i)r[i]=this._parser.precedingCodepoint;return this.print(r,0,r.length),!0},t.prototype.sendDeviceAttributesPrimary=function(e){return e.params[0]>0||(this._is("xterm")||this._is("rxvt-unicode")||this._is("screen")?this._coreService.triggerDataEvent(s.C0.ESC+"[?1;2c"):this._is("linux")&&this._coreService.triggerDataEvent(s.C0.ESC+"[?6c")),!0},t.prototype.sendDeviceAttributesSecondary=function(e){return e.params[0]>0||(this._is("xterm")?this._coreService.triggerDataEvent(s.C0.ESC+"[>0;276;0c"):this._is("rxvt-unicode")?this._coreService.triggerDataEvent(s.C0.ESC+"[>85;95;0c"):this._is("linux")?this._coreService.triggerDataEvent(e.params[0]+"c"):this._is("screen")&&this._coreService.triggerDataEvent(s.C0.ESC+"[>83;40003;0c")),!0},t.prototype._is=function(e){return 0===(this._optionsService.options.termName+"").indexOf(e)},t.prototype.setMode=function(e){for(var t=0;t<e.length;t++)switch(e.params[t]){case 4:this._coreService.modes.insertMode=!0}return!0},t.prototype.setModePrivate=function(e){for(var t=0;t<e.length;t++)switch(e.params[t]){case 1:this._coreService.decPrivateModes.applicationCursorKeys=!0;break;case 2:this._charsetService.setgCharset(0,a.DEFAULT_CHARSET),this._charsetService.setgCharset(1,a.DEFAULT_CHARSET),this._charsetService.setgCharset(2,a.DEFAULT_CHARSET),this._charsetService.setgCharset(3,a.DEFAULT_CHARSET);break;case 3:this._optionsService.options.windowOptions.setWinLines&&(this._bufferService.resize(132,this._bufferService.rows),this._onRequestReset.fire());break;case 6:this._coreService.decPrivateModes.origin=!0,this._setCursor(0,0);break;case 7:this._coreService.decPrivateModes.wraparound=!0;break;case 12:break;case 45:this._coreService.decPrivateModes.reverseWraparound=!0;break;case 66:this._logService.debug("Serial port requested application keypad."),this._coreService.decPrivateModes.applicationKeypad=!0,this._onRequestSyncScrollBar.fire();break;case 9:this._coreMouseService.activeProtocol="X10";break;case 1e3:this._coreMouseService.activeProtocol="VT200";break;case 1002:this._coreMouseService.activeProtocol="DRAG";break;case 1003:this._coreMouseService.activeProtocol="ANY";break;case 1004:this._coreService.decPrivateModes.sendFocus=!0;break;case 1005:this._logService.debug("DECSET 1005 not supported (see #2507)");break;case 1006:this._coreMouseService.activeEncoding="SGR";break;case 1015:this._logService.debug("DECSET 1015 not supported (see #2507)");break;case 25:this._coreService.isCursorHidden=!1;break;case 1048:this.saveCursor();break;case 1049:this.saveCursor();case 47:case 1047:this._bufferService.buffers.activateAltBuffer(this._eraseAttrData()),this._coreService.isCursorInitialized=!0,this._onRequestRefreshRows.fire(0,this._bufferService.rows-1),this._onRequestSyncScrollBar.fire();break;case 2004:this._coreService.decPrivateModes.bracketedPasteMode=!0}return!0},t.prototype.resetMode=function(e){for(var t=0;t<e.length;t++)switch(e.params[t]){case 4:this._coreService.modes.insertMode=!1}return!0},t.prototype.resetModePrivate=function(e){for(var t=0;t<e.length;t++)switch(e.params[t]){case 1:this._coreService.decPrivateModes.applicationCursorKeys=!1;break;case 3:this._optionsService.options.windowOptions.setWinLines&&(this._bufferService.resize(80,this._bufferService.rows),this._onRequestReset.fire());break;case 6:this._coreService.decPrivateModes.origin=!1,this._setCursor(0,0);break;case 7:this._coreService.decPrivateModes.wraparound=!1;break;case 12:break;case 45:this._coreService.decPrivateModes.reverseWraparound=!1;break;case 66:this._logService.debug("Switching back to normal keypad."),this._coreService.decPrivateModes.applicationKeypad=!1,this._onRequestSyncScrollBar.fire();break;case 9:case 1e3:case 1002:case 1003:this._coreMouseService.activeProtocol="NONE";break;case 1004:this._coreService.decPrivateModes.sendFocus=!1;break;case 1005:this._logService.debug("DECRST 1005 not supported (see #2507)");break;case 1006:this._coreMouseService.activeEncoding="DEFAULT";break;case 1015:this._logService.debug("DECRST 1015 not supported (see #2507)");break;case 25:this._coreService.isCursorHidden=!0;break;case 1048:this.restoreCursor();break;case 1049:case 47:case 1047:this._bufferService.buffers.activateNormalBuffer(),1049===e.params[t]&&this.restoreCursor(),this._coreService.isCursorInitialized=!0,this._onRequestRefreshRows.fire(0,this._bufferService.rows-1),this._onRequestSyncScrollBar.fire();break;case 2004:this._coreService.decPrivateModes.bracketedPasteMode=!1}return!0},t.prototype._updateAttrColor=function(e,t,r,i,n){return 2===t?(e|=50331648,e&=-16777216,e|=v.AttributeData.fromColorRGB([r,i,n])):5===t&&(e&=-50331904,e|=33554432|255&r),e},t.prototype._extractColor=function(e,t,r){var i=[0,0,-1,0,0,0],n=0,o=0;do{if(i[o+n]=e.params[t+o],e.hasSubParams(t+o)){var s=e.getSubParams(t+o),a=0;do{5===i[1]&&(n=1),i[o+a+1+n]=s[a]}while(++a<s.length&&a+o+1+n<i.length);break}if(5===i[1]&&o+n>=2||2===i[1]&&o+n>=5)break;i[1]&&(n=1)}while(++o+t<e.length&&o+n<i.length);for(a=2;a<i.length;++a)-1===i[a]&&(i[a]=0);switch(i[0]){case 38:r.fg=this._updateAttrColor(r.fg,i[1],i[3],i[4],i[5]);break;case 48:r.bg=this._updateAttrColor(r.bg,i[1],i[3],i[4],i[5]);break;case 58:r.extended=r.extended.clone(),r.extended.underlineColor=this._updateAttrColor(r.extended.underlineColor,i[1],i[3],i[4],i[5])}return o},t.prototype._processUnderline=function(e,t){t.extended=t.extended.clone(),(!~e||e>5)&&(e=1),t.extended.underlineStyle=e,t.fg|=268435456,0===e&&(t.fg&=-268435457),t.updateExtended()},t.prototype.charAttributes=function(e){if(1===e.length&&0===e.params[0])return this._curAttrData.fg=f.DEFAULT_ATTR_DATA.fg,this._curAttrData.bg=f.DEFAULT_ATTR_DATA.bg,!0;for(var t,r=e.length,i=this._curAttrData,n=0;n<r;n++)(t=e.params[n])>=30&&t<=37?(i.fg&=-50331904,i.fg|=16777216|t-30):t>=40&&t<=47?(i.bg&=-50331904,i.bg|=16777216|t-40):t>=90&&t<=97?(i.fg&=-50331904,i.fg|=16777224|t-90):t>=100&&t<=107?(i.bg&=-50331904,i.bg|=16777224|t-100):0===t?(i.fg=f.DEFAULT_ATTR_DATA.fg,i.bg=f.DEFAULT_ATTR_DATA.bg):1===t?i.fg|=134217728:3===t?i.bg|=67108864:4===t?(i.fg|=268435456,this._processUnderline(e.hasSubParams(n)?e.getSubParams(n)[0]:1,i)):5===t?i.fg|=536870912:7===t?i.fg|=67108864:8===t?i.fg|=1073741824:2===t?i.bg|=134217728:21===t?this._processUnderline(2,i):22===t?(i.fg&=-134217729,i.bg&=-134217729):23===t?i.bg&=-67108865:24===t?i.fg&=-268435457:25===t?i.fg&=-536870913:27===t?i.fg&=-67108865:28===t?i.fg&=-1073741825:39===t?(i.fg&=-67108864,i.fg|=16777215&f.DEFAULT_ATTR_DATA.fg):49===t?(i.bg&=-67108864,i.bg|=16777215&f.DEFAULT_ATTR_DATA.bg):38===t||48===t||58===t?n+=this._extractColor(e,n,i):59===t?(i.extended=i.extended.clone(),i.extended.underlineColor=-1,i.updateExtended()):100===t?(i.fg&=-67108864,i.fg|=16777215&f.DEFAULT_ATTR_DATA.fg,i.bg&=-67108864,i.bg|=16777215&f.DEFAULT_ATTR_DATA.bg):this._logService.debug("Unknown SGR attribute: %d.",t);return!0},t.prototype.deviceStatus=function(e){switch(e.params[0]){case 5:this._coreService.triggerDataEvent(s.C0.ESC+"[0n");break;case 6:var t=this._bufferService.buffer.y+1,r=this._bufferService.buffer.x+1;this._coreService.triggerDataEvent(s.C0.ESC+"["+t+";"+r+"R")}return!0},t.prototype.deviceStatusPrivate=function(e){switch(e.params[0]){case 6:var t=this._bufferService.buffer.y+1,r=this._bufferService.buffer.x+1;this._coreService.triggerDataEvent(s.C0.ESC+"[?"+t+";"+r+"R")}return!0},t.prototype.softReset=function(e){return this._coreService.isCursorHidden=!1,this._onRequestSyncScrollBar.fire(),this._bufferService.buffer.scrollTop=0,this._bufferService.buffer.scrollBottom=this._bufferService.rows-1,this._curAttrData=f.DEFAULT_ATTR_DATA.clone(),this._coreService.reset(),this._charsetService.reset(),this._bufferService.buffer.savedX=0,this._bufferService.buffer.savedY=this._bufferService.buffer.ybase,this._bufferService.buffer.savedCurAttrData.fg=this._curAttrData.fg,this._bufferService.buffer.savedCurAttrData.bg=this._curAttrData.bg,this._bufferService.buffer.savedCharset=this._charsetService.charset,this._coreService.decPrivateModes.origin=!1,!0},t.prototype.setCursorStyle=function(e){var t=e.params[0]||1;switch(t){case 1:case 2:this._optionsService.options.cursorStyle="block";break;case 3:case 4:this._optionsService.options.cursorStyle="underline";break;case 5:case 6:this._optionsService.options.cursorStyle="bar"}var r=t%2==1;return this._optionsService.options.cursorBlink=r,!0},t.prototype.setScrollRegion=function(e){var t,r=e.params[0]||1;return(e.length<2||(t=e.params[1])>this._bufferService.rows||0===t)&&(t=this._bufferService.rows),t>r&&(this._bufferService.buffer.scrollTop=r-1,this._bufferService.buffer.scrollBottom=t-1,this._setCursor(0,0)),!0},t.prototype.windowOptions=function(e){if(!m(e.params[0],this._optionsService.options.windowOptions))return!0;var t=e.length>1?e.params[1]:0;switch(e.params[0]){case 14:2!==t&&this._onRequestWindowsOptionsReport.fire(o.GET_WIN_SIZE_PIXELS);break;case 16:this._onRequestWindowsOptionsReport.fire(o.GET_CELL_SIZE_PIXELS);break;case 18:this._bufferService&&this._coreService.triggerDataEvent(s.C0.ESC+"[8;"+this._bufferService.rows+";"+this._bufferService.cols+"t");break;case 22:0!==t&&2!==t||(this._windowTitleStack.push(this._windowTitle),this._windowTitleStack.length>10&&this._windowTitleStack.shift()),0!==t&&1!==t||(this._iconNameStack.push(this._iconName),this._iconNameStack.length>10&&this._iconNameStack.shift());break;case 23:0!==t&&2!==t||this._windowTitleStack.length&&this.setTitle(this._windowTitleStack.pop()),0!==t&&1!==t||this._iconNameStack.length&&this.setIconName(this._iconNameStack.pop())}return!0},t.prototype.saveCursor=function(e){return this._bufferService.buffer.savedX=this._bufferService.buffer.x,this._bufferService.buffer.savedY=this._bufferService.buffer.ybase+this._bufferService.buffer.y,this._bufferService.buffer.savedCurAttrData.fg=this._curAttrData.fg,this._bufferService.buffer.savedCurAttrData.bg=this._curAttrData.bg,this._bufferService.buffer.savedCharset=this._charsetService.charset,!0},t.prototype.restoreCursor=function(e){return this._bufferService.buffer.x=this._bufferService.buffer.savedX||0,this._bufferService.buffer.y=Math.max(this._bufferService.buffer.savedY-this._bufferService.buffer.ybase,0),this._curAttrData.fg=this._bufferService.buffer.savedCurAttrData.fg,this._curAttrData.bg=this._bufferService.buffer.savedCurAttrData.bg,this._charsetService.charset=this._savedCharset,this._bufferService.buffer.savedCharset&&(this._charsetService.charset=this._bufferService.buffer.savedCharset),this._restrictCursor(),!0},t.prototype.setTitle=function(e){return this._windowTitle=e,this._onTitleChange.fire(e),!0},t.prototype.setIconName=function(e){return this._iconName=e,!0},t.prototype._parseAnsiColorChange=function(e){for(var t,r={colors:[]},i=/(\d+);rgb:([0-9a-f]{2})\/([0-9a-f]{2})\/([0-9a-f]{2})/gi;null!==(t=i.exec(e));)r.colors.push({colorIndex:parseInt(t[1]),red:parseInt(t[2],16),green:parseInt(t[3],16),blue:parseInt(t[4],16)});return 0===r.colors.length?null:r},t.prototype.setAnsiColor=function(e){var t=this._parseAnsiColorChange(e);return t?this._onAnsiColorChange.fire(t):this._logService.warn("Expected format <num>;rgb:<rr>/<gg>/<bb> but got data: "+e),!0},t.prototype.nextLine=function(){return this._bufferService.buffer.x=0,this.index(),!0},t.prototype.keypadApplicationMode=function(){return this._logService.debug("Serial port requested application keypad."),this._coreService.decPrivateModes.applicationKeypad=!0,this._onRequestSyncScrollBar.fire(),!0},t.prototype.keypadNumericMode=function(){return this._logService.debug("Switching back to normal keypad."),this._coreService.decPrivateModes.applicationKeypad=!1,this._onRequestSyncScrollBar.fire(),!0},t.prototype.selectDefaultCharset=function(){return this._charsetService.setgLevel(0),this._charsetService.setgCharset(0,a.DEFAULT_CHARSET),!0},t.prototype.selectCharset=function(e){return 2!==e.length?(this.selectDefaultCharset(),!0):("/"===e[0]||this._charsetService.setgCharset(b[e[0]],a.CHARSETS[e[1]]||a.DEFAULT_CHARSET),!0)},t.prototype.index=function(){this._restrictCursor();var e=this._bufferService.buffer;return this._bufferService.buffer.y++,e.y===e.scrollBottom+1?(e.y--,this._onRequestScroll.fire(this._eraseAttrData())):e.y>=this._bufferService.rows&&(e.y=this._bufferService.rows-1),this._restrictCursor(),!0},t.prototype.tabSet=function(){return this._bufferService.buffer.tabs[this._bufferService.buffer.x]=!0,!0},t.prototype.reverseIndex=function(){this._restrictCursor();var e=this._bufferService.buffer;if(e.y===e.scrollTop){var t=e.scrollBottom-e.scrollTop;e.lines.shiftElements(e.ybase+e.y,t,1),e.lines.set(e.ybase+e.y,e.getBlankLine(this._eraseAttrData())),this._dirtyRowService.markRangeDirty(e.scrollTop,e.scrollBottom)}else e.y--,this._restrictCursor();return!0},t.prototype.fullReset=function(){return this._parser.reset(),this._onRequestReset.fire(),!0},t.prototype.reset=function(){this._curAttrData=f.DEFAULT_ATTR_DATA.clone(),this._eraseAttrDataInternal=f.DEFAULT_ATTR_DATA.clone()},t.prototype._eraseAttrData=function(){return this._eraseAttrDataInternal.bg&=-67108864,this._eraseAttrDataInternal.bg|=67108863&this._curAttrData.bg,this._eraseAttrDataInternal},t.prototype.setgLevel=function(e){return this._charsetService.setgLevel(e),!0},t.prototype.screenAlignmentPattern=function(){var e=new p.CellData;e.content=1<<22|"E".charCodeAt(0),e.fg=this._curAttrData.fg,e.bg=this._curAttrData.bg;var t=this._bufferService.buffer;this._setCursor(0,0);for(var r=0;r<this._bufferService.rows;++r){var i=t.ybase+t.y+r,n=t.lines.get(i);n&&(n.fill(e),n.isWrapped=!1)}return this._dirtyRowService.markAllDirty(),this._setCursor(0,0),!0},t}(l.Disposable);t.InputHandler=w},844:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.getDisposeArrayDisposable=t.disposeArray=t.Disposable=void 0;var r=function(){function e(){this._disposables=[],this._isDisposed=!1}return e.prototype.dispose=function(){this._isDisposed=!0;for(var e=0,t=this._disposables;e<t.length;e++)t[e].dispose();this._disposables.length=0},e.prototype.register=function(e){return this._disposables.push(e),e},e.prototype.unregister=function(e){var t=this._disposables.indexOf(e);-1!==t&&this._disposables.splice(t,1)},e}();function i(e){for(var t=0,r=e;t<r.length;t++)r[t].dispose();e.length=0}t.Disposable=r,t.disposeArray=i,t.getDisposeArrayDisposable=function(e){return{dispose:function(){return i(e)}}}},6114:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.isLinux=t.isWindows=t.isIphone=t.isIpad=t.isMac=t.isSafari=t.isFirefox=void 0;var r="undefined"==typeof navigator,i=r?"node":navigator.userAgent,n=r?"node":navigator.platform;t.isFirefox=i.includes("Firefox"),t.isSafari=/^((?!chrome|android).)*safari/i.test(i),t.isMac=["Macintosh","MacIntel","MacPPC","Mac68K"].includes(n),t.isIpad="iPad"===n,t.isIphone="iPhone"===n,t.isWindows=["Windows","Win16","Win32","WinCE"].includes(n),t.isLinux=n.indexOf("Linux")>=0},8273:(e,t)=>{function r(e,t,r,i){if(void 0===r&&(r=0),void 0===i&&(i=e.length),r>=e.length)return e;r=(e.length+r)%e.length,i=i>=e.length?e.length:(e.length+i)%e.length;for(var n=r;n<i;++n)e[n]=t;return e}Object.defineProperty(t,"__esModule",{value:!0}),t.concat=t.fillFallback=t.fill=void 0,t.fill=function(e,t,i,n){return e.fill?e.fill(t,i,n):r(e,t,i,n)},t.fillFallback=r,t.concat=function(e,t){var r=new e.constructor(e.length+t.length);return r.set(e),r.set(t,e.length),r}},9282:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.updateWindowsModeWrappedState=void 0;var i=r(643);t.updateWindowsModeWrappedState=function(e){var t=e.buffer.lines.get(e.buffer.ybase+e.buffer.y-1),r=null==t?void 0:t.get(e.cols-1),n=e.buffer.lines.get(e.buffer.ybase+e.buffer.y);n&&r&&(n.isWrapped=r[i.CHAR_DATA_CODE_INDEX]!==i.NULL_CELL_CODE&&r[i.CHAR_DATA_CODE_INDEX]!==i.WHITESPACE_CELL_CODE)}},3734:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ExtendedAttrs=t.AttributeData=void 0;var r=function(){function e(){this.fg=0,this.bg=0,this.extended=new i}return e.toColorRGB=function(e){return[e>>>16&255,e>>>8&255,255&e]},e.fromColorRGB=function(e){return(255&e[0])<<16|(255&e[1])<<8|255&e[2]},e.prototype.clone=function(){var t=new e;return t.fg=this.fg,t.bg=this.bg,t.extended=this.extended.clone(),t},e.prototype.isInverse=function(){return 67108864&this.fg},e.prototype.isBold=function(){return 134217728&this.fg},e.prototype.isUnderline=function(){return 268435456&this.fg},e.prototype.isBlink=function(){return 536870912&this.fg},e.prototype.isInvisible=function(){return 1073741824&this.fg},e.prototype.isItalic=function(){return 67108864&this.bg},e.prototype.isDim=function(){return 134217728&this.bg},e.prototype.getFgColorMode=function(){return 50331648&this.fg},e.prototype.getBgColorMode=function(){return 50331648&this.bg},e.prototype.isFgRGB=function(){return 50331648==(50331648&this.fg)},e.prototype.isBgRGB=function(){return 50331648==(50331648&this.bg)},e.prototype.isFgPalette=function(){return 16777216==(50331648&this.fg)||33554432==(50331648&this.fg)},e.prototype.isBgPalette=function(){return 16777216==(50331648&this.bg)||33554432==(50331648&this.bg)},e.prototype.isFgDefault=function(){return 0==(50331648&this.fg)},e.prototype.isBgDefault=function(){return 0==(50331648&this.bg)},e.prototype.isAttributeDefault=function(){return 0===this.fg&&0===this.bg},e.prototype.getFgColor=function(){switch(50331648&this.fg){case 16777216:case 33554432:return 255&this.fg;case 50331648:return 16777215&this.fg;default:return-1}},e.prototype.getBgColor=function(){switch(50331648&this.bg){case 16777216:case 33554432:return 255&this.bg;case 50331648:return 16777215&this.bg;default:return-1}},e.prototype.hasExtendedAttrs=function(){return 268435456&this.bg},e.prototype.updateExtended=function(){this.extended.isEmpty()?this.bg&=-268435457:this.bg|=268435456},e.prototype.getUnderlineColor=function(){if(268435456&this.bg&&~this.extended.underlineColor)switch(50331648&this.extended.underlineColor){case 16777216:case 33554432:return 255&this.extended.underlineColor;case 50331648:return 16777215&this.extended.underlineColor;default:return this.getFgColor()}return this.getFgColor()},e.prototype.getUnderlineColorMode=function(){return 268435456&this.bg&&~this.extended.underlineColor?50331648&this.extended.underlineColor:this.getFgColorMode()},e.prototype.isUnderlineColorRGB=function(){return 268435456&this.bg&&~this.extended.underlineColor?50331648==(50331648&this.extended.underlineColor):this.isFgRGB()},e.prototype.isUnderlineColorPalette=function(){return 268435456&this.bg&&~this.extended.underlineColor?16777216==(50331648&this.extended.underlineColor)||33554432==(50331648&this.extended.underlineColor):this.isFgPalette()},e.prototype.isUnderlineColorDefault=function(){return 268435456&this.bg&&~this.extended.underlineColor?0==(50331648&this.extended.underlineColor):this.isFgDefault()},e.prototype.getUnderlineStyle=function(){return 268435456&this.fg?268435456&this.bg?this.extended.underlineStyle:1:0},e}();t.AttributeData=r;var i=function(){function e(e,t){void 0===e&&(e=0),void 0===t&&(t=-1),this.underlineStyle=e,this.underlineColor=t}return e.prototype.clone=function(){return new e(this.underlineStyle,this.underlineColor)},e.prototype.isEmpty=function(){return 0===this.underlineStyle},e}();t.ExtendedAttrs=i},9092:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.BufferStringIterator=t.Buffer=t.MAX_BUFFER_SIZE=void 0;var i=r(6349),n=r(8437),o=r(511),s=r(643),a=r(4634),c=r(4863),l=r(7116),h=r(3734);t.MAX_BUFFER_SIZE=4294967295;var u=function(){function e(e,t,r){this._hasScrollback=e,this._optionsService=t,this._bufferService=r,this.ydisp=0,this.ybase=0,this.y=0,this.x=0,this.savedY=0,this.savedX=0,this.savedCurAttrData=n.DEFAULT_ATTR_DATA.clone(),this.savedCharset=l.DEFAULT_CHARSET,this.markers=[],this._nullCell=o.CellData.fromCharData([0,s.NULL_CELL_CHAR,s.NULL_CELL_WIDTH,s.NULL_CELL_CODE]),this._whitespaceCell=o.CellData.fromCharData([0,s.WHITESPACE_CELL_CHAR,s.WHITESPACE_CELL_WIDTH,s.WHITESPACE_CELL_CODE]),this._cols=this._bufferService.cols,this._rows=this._bufferService.rows,this.lines=new i.CircularList(this._getCorrectBufferLength(this._rows)),this.scrollTop=0,this.scrollBottom=this._rows-1,this.setupTabStops()}return e.prototype.getNullCell=function(e){return e?(this._nullCell.fg=e.fg,this._nullCell.bg=e.bg,this._nullCell.extended=e.extended):(this._nullCell.fg=0,this._nullCell.bg=0,this._nullCell.extended=new h.ExtendedAttrs),this._nullCell},e.prototype.getWhitespaceCell=function(e){return e?(this._whitespaceCell.fg=e.fg,this._whitespaceCell.bg=e.bg,this._whitespaceCell.extended=e.extended):(this._whitespaceCell.fg=0,this._whitespaceCell.bg=0,this._whitespaceCell.extended=new h.ExtendedAttrs),this._whitespaceCell},e.prototype.getBlankLine=function(e,t){return new n.BufferLine(this._bufferService.cols,this.getNullCell(e),t)},Object.defineProperty(e.prototype,"hasScrollback",{get:function(){return this._hasScrollback&&this.lines.maxLength>this._rows},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"isCursorInViewport",{get:function(){var e=this.ybase+this.y-this.ydisp;return e>=0&&e<this._rows},enumerable:!1,configurable:!0}),e.prototype._getCorrectBufferLength=function(e){if(!this._hasScrollback)return e;var r=e+this._optionsService.options.scrollback;return r>t.MAX_BUFFER_SIZE?t.MAX_BUFFER_SIZE:r},e.prototype.fillViewportRows=function(e){if(0===this.lines.length){void 0===e&&(e=n.DEFAULT_ATTR_DATA);for(var t=this._rows;t--;)this.lines.push(this.getBlankLine(e))}},e.prototype.clear=function(){this.ydisp=0,this.ybase=0,this.y=0,this.x=0,this.lines=new i.CircularList(this._getCorrectBufferLength(this._rows)),this.scrollTop=0,this.scrollBottom=this._rows-1,this.setupTabStops()},e.prototype.resize=function(e,t){var r=this.getNullCell(n.DEFAULT_ATTR_DATA),i=this._getCorrectBufferLength(t);if(i>this.lines.maxLength&&(this.lines.maxLength=i),this.lines.length>0){if(this._cols<e)for(var o=0;o<this.lines.length;o++)this.lines.get(o).resize(e,r);var s=0;if(this._rows<t)for(var a=this._rows;a<t;a++)this.lines.length<t+this.ybase&&(this._optionsService.options.windowsMode?this.lines.push(new n.BufferLine(e,r)):this.ybase>0&&this.lines.length<=this.ybase+this.y+s+1?(this.ybase--,s++,this.ydisp>0&&this.ydisp--):this.lines.push(new n.BufferLine(e,r)));else for(a=this._rows;a>t;a--)this.lines.length>t+this.ybase&&(this.lines.length>this.ybase+this.y+1?this.lines.pop():(this.ybase++,this.ydisp++));if(i<this.lines.maxLength){var c=this.lines.length-i;c>0&&(this.lines.trimStart(c),this.ybase=Math.max(this.ybase-c,0),this.ydisp=Math.max(this.ydisp-c,0),this.savedY=Math.max(this.savedY-c,0)),this.lines.maxLength=i}this.x=Math.min(this.x,e-1),this.y=Math.min(this.y,t-1),s&&(this.y+=s),this.savedX=Math.min(this.savedX,e-1),this.scrollTop=0}if(this.scrollBottom=t-1,this._isReflowEnabled&&(this._reflow(e,t),this._cols>e))for(o=0;o<this.lines.length;o++)this.lines.get(o).resize(e,r);this._cols=e,this._rows=t},Object.defineProperty(e.prototype,"_isReflowEnabled",{get:function(){return this._hasScrollback&&!this._optionsService.options.windowsMode},enumerable:!1,configurable:!0}),e.prototype._reflow=function(e,t){this._cols!==e&&(e>this._cols?this._reflowLarger(e,t):this._reflowSmaller(e,t))},e.prototype._reflowLarger=function(e,t){var r=a.reflowLargerGetLinesToRemove(this.lines,this._cols,e,this.ybase+this.y,this.getNullCell(n.DEFAULT_ATTR_DATA));if(r.length>0){var i=a.reflowLargerCreateNewLayout(this.lines,r);a.reflowLargerApplyNewLayout(this.lines,i.layout),this._reflowLargerAdjustViewport(e,t,i.countRemoved)}},e.prototype._reflowLargerAdjustViewport=function(e,t,r){for(var i=this.getNullCell(n.DEFAULT_ATTR_DATA),o=r;o-- >0;)0===this.ybase?(this.y>0&&this.y--,this.lines.length<t&&this.lines.push(new n.BufferLine(e,i))):(this.ydisp===this.ybase&&this.ydisp--,this.ybase--);this.savedY=Math.max(this.savedY-r,0)},e.prototype._reflowSmaller=function(e,t){for(var r=this.getNullCell(n.DEFAULT_ATTR_DATA),i=[],o=0,s=this.lines.length-1;s>=0;s--){var c=this.lines.get(s);if(!(!c||!c.isWrapped&&c.getTrimmedLength()<=e)){for(var l=[c];c.isWrapped&&s>0;)c=this.lines.get(--s),l.unshift(c);var h=this.ybase+this.y;if(!(h>=s&&h<s+l.length)){var u,f=l[l.length-1].getTrimmedLength(),_=a.reflowSmallerGetNewLineLengths(l,this._cols,e),d=_.length-l.length;u=0===this.ybase&&this.y!==this.lines.length-1?Math.max(0,this.y-this.lines.maxLength+d):Math.max(0,this.lines.length-this.lines.maxLength+d);for(var p=[],v=0;v<d;v++){var g=this.getBlankLine(n.DEFAULT_ATTR_DATA,!0);p.push(g)}p.length>0&&(i.push({start:s+l.length+o,newLines:p}),o+=p.length),l.push.apply(l,p);var y=_.length-1,b=_[y];0===b&&(b=_[--y]);for(var S=l.length-d-1,m=f;S>=0;){var C=Math.min(m,b);if(l[y].copyCellsFrom(l[S],m-C,b-C,C,!0),0==(b-=C)&&(b=_[--y]),0==(m-=C)){S--;var w=Math.max(S,0);m=a.getWrappedLineTrimmedLength(l,w,this._cols)}}for(v=0;v<l.length;v++)_[v]<e&&l[v].setCell(_[v],r);for(var E=d-u;E-- >0;)0===this.ybase?this.y<t-1?(this.y++,this.lines.pop()):(this.ybase++,this.ydisp++):this.ybase<Math.min(this.lines.maxLength,this.lines.length+o)-t&&(this.ybase===this.ydisp&&this.ydisp++,this.ybase++);this.savedY=Math.min(this.savedY+d,this.ybase+t-1)}}}if(i.length>0){var L=[],A=[];for(v=0;v<this.lines.length;v++)A.push(this.lines.get(v));var R=this.lines.length,k=R-1,x=0,D=i[x];this.lines.length=Math.min(this.lines.maxLength,this.lines.length+o);var T=0;for(v=Math.min(this.lines.maxLength-1,R+o-1);v>=0;v--)if(D&&D.start>k+T){for(var O=D.newLines.length-1;O>=0;O--)this.lines.set(v--,D.newLines[O]);v++,L.push({index:k+1,amount:D.newLines.length}),T+=D.newLines.length,D=i[++x]}else this.lines.set(v,A[k--]);var M=0;for(v=L.length-1;v>=0;v--)L[v].index+=M,this.lines.onInsertEmitter.fire(L[v]),M+=L[v].amount;var P=Math.max(0,R+o-this.lines.maxLength);P>0&&this.lines.onTrimEmitter.fire(P)}},e.prototype.stringIndexToBufferIndex=function(e,t,r){for(void 0===r&&(r=!1);t;){var i=this.lines.get(e);if(!i)return[-1,-1];for(var n=r?i.getTrimmedLength():i.length,o=0;o<n;++o)if(i.get(o)[s.CHAR_DATA_WIDTH_INDEX]&&(t-=i.get(o)[s.CHAR_DATA_CHAR_INDEX].length||1),t<0)return[e,o];e++}return[e,0]},e.prototype.translateBufferLineToString=function(e,t,r,i){void 0===r&&(r=0);var n=this.lines.get(e);return n?n.translateToString(t,r,i):""},e.prototype.getWrappedRangeForLine=function(e){for(var t=e,r=e;t>0&&this.lines.get(t).isWrapped;)t--;for(;r+1<this.lines.length&&this.lines.get(r+1).isWrapped;)r++;return{first:t,last:r}},e.prototype.setupTabStops=function(e){for(null!=e?this.tabs[e]||(e=this.prevStop(e)):(this.tabs={},e=0);e<this._cols;e+=this._optionsService.options.tabStopWidth)this.tabs[e]=!0},e.prototype.prevStop=function(e){for(null==e&&(e=this.x);!this.tabs[--e]&&e>0;);return e>=this._cols?this._cols-1:e<0?0:e},e.prototype.nextStop=function(e){for(null==e&&(e=this.x);!this.tabs[++e]&&e<this._cols;);return e>=this._cols?this._cols-1:e<0?0:e},e.prototype.addMarker=function(e){var t=this,r=new c.Marker(e);return this.markers.push(r),r.register(this.lines.onTrim((function(e){r.line-=e,r.line<0&&r.dispose()}))),r.register(this.lines.onInsert((function(e){r.line>=e.index&&(r.line+=e.amount)}))),r.register(this.lines.onDelete((function(e){r.line>=e.index&&r.line<e.index+e.amount&&r.dispose(),r.line>e.index&&(r.line-=e.amount)}))),r.register(r.onDispose((function(){return t._removeMarker(r)}))),r},e.prototype._removeMarker=function(e){this.markers.splice(this.markers.indexOf(e),1)},e.prototype.iterator=function(e,t,r,i,n){return new f(this,e,t,r,i,n)},e}();t.Buffer=u;var f=function(){function e(e,t,r,i,n,o){void 0===r&&(r=0),void 0===i&&(i=e.lines.length),void 0===n&&(n=0),void 0===o&&(o=0),this._buffer=e,this._trimRight=t,this._startIndex=r,this._endIndex=i,this._startOverscan=n,this._endOverscan=o,this._startIndex<0&&(this._startIndex=0),this._endIndex>this._buffer.lines.length&&(this._endIndex=this._buffer.lines.length),this._current=this._startIndex}return e.prototype.hasNext=function(){return this._current<this._endIndex},e.prototype.next=function(){var e=this._buffer.getWrappedRangeForLine(this._current);e.first<this._startIndex-this._startOverscan&&(e.first=this._startIndex-this._startOverscan),e.last>this._endIndex+this._endOverscan&&(e.last=this._endIndex+this._endOverscan),e.first=Math.max(e.first,0),e.last=Math.min(e.last,this._buffer.lines.length);for(var t="",r=e.first;r<=e.last;++r)t+=this._buffer.translateBufferLineToString(r,this._trimRight);return this._current=e.last+1,{range:e,content:t}},e}();t.BufferStringIterator=f},8437:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.BufferLine=t.DEFAULT_ATTR_DATA=void 0;var i=r(482),n=r(643),o=r(511),s=r(3734);t.DEFAULT_ATTR_DATA=Object.freeze(new s.AttributeData);var a=function(){function e(e,t,r){void 0===r&&(r=!1),this.isWrapped=r,this._combined={},this._extendedAttrs={},this._data=new Uint32Array(3*e);for(var i=t||o.CellData.fromCharData([0,n.NULL_CELL_CHAR,n.NULL_CELL_WIDTH,n.NULL_CELL_CODE]),s=0;s<e;++s)this.setCell(s,i);this.length=e}return e.prototype.get=function(e){var t=this._data[3*e+0],r=2097151&t;return[this._data[3*e+1],2097152&t?this._combined[e]:r?i.stringFromCodePoint(r):"",t>>22,2097152&t?this._combined[e].charCodeAt(this._combined[e].length-1):r]},e.prototype.set=function(e,t){this._data[3*e+1]=t[n.CHAR_DATA_ATTR_INDEX],t[n.CHAR_DATA_CHAR_INDEX].length>1?(this._combined[e]=t[1],this._data[3*e+0]=2097152|e|t[n.CHAR_DATA_WIDTH_INDEX]<<22):this._data[3*e+0]=t[n.CHAR_DATA_CHAR_INDEX].charCodeAt(0)|t[n.CHAR_DATA_WIDTH_INDEX]<<22},e.prototype.getWidth=function(e){return this._data[3*e+0]>>22},e.prototype.hasWidth=function(e){return 12582912&this._data[3*e+0]},e.prototype.getFg=function(e){return this._data[3*e+1]},e.prototype.getBg=function(e){return this._data[3*e+2]},e.prototype.hasContent=function(e){return 4194303&this._data[3*e+0]},e.prototype.getCodePoint=function(e){var t=this._data[3*e+0];return 2097152&t?this._combined[e].charCodeAt(this._combined[e].length-1):2097151&t},e.prototype.isCombined=function(e){return 2097152&this._data[3*e+0]},e.prototype.getString=function(e){var t=this._data[3*e+0];return 2097152&t?this._combined[e]:2097151&t?i.stringFromCodePoint(2097151&t):""},e.prototype.loadCell=function(e,t){var r=3*e;return t.content=this._data[r+0],t.fg=this._data[r+1],t.bg=this._data[r+2],2097152&t.content&&(t.combinedData=this._combined[e]),268435456&t.bg&&(t.extended=this._extendedAttrs[e]),t},e.prototype.setCell=function(e,t){2097152&t.content&&(this._combined[e]=t.combinedData),268435456&t.bg&&(this._extendedAttrs[e]=t.extended),this._data[3*e+0]=t.content,this._data[3*e+1]=t.fg,this._data[3*e+2]=t.bg},e.prototype.setCellFromCodePoint=function(e,t,r,i,n,o){268435456&n&&(this._extendedAttrs[e]=o),this._data[3*e+0]=t|r<<22,this._data[3*e+1]=i,this._data[3*e+2]=n},e.prototype.addCodepointToCell=function(e,t){var r=this._data[3*e+0];2097152&r?this._combined[e]+=i.stringFromCodePoint(t):(2097151&r?(this._combined[e]=i.stringFromCodePoint(2097151&r)+i.stringFromCodePoint(t),r&=-2097152,r|=2097152):r=t|1<<22,this._data[3*e+0]=r)},e.prototype.insertCells=function(e,t,r,i){if((e%=this.length)&&2===this.getWidth(e-1)&&this.setCellFromCodePoint(e-1,0,1,(null==i?void 0:i.fg)||0,(null==i?void 0:i.bg)||0,(null==i?void 0:i.extended)||new s.ExtendedAttrs),t<this.length-e){for(var n=new o.CellData,a=this.length-e-t-1;a>=0;--a)this.setCell(e+t+a,this.loadCell(e+a,n));for(a=0;a<t;++a)this.setCell(e+a,r)}else for(a=e;a<this.length;++a)this.setCell(a,r);2===this.getWidth(this.length-1)&&this.setCellFromCodePoint(this.length-1,0,1,(null==i?void 0:i.fg)||0,(null==i?void 0:i.bg)||0,(null==i?void 0:i.extended)||new s.ExtendedAttrs)},e.prototype.deleteCells=function(e,t,r,i){if(e%=this.length,t<this.length-e){for(var n=new o.CellData,a=0;a<this.length-e-t;++a)this.setCell(e+a,this.loadCell(e+t+a,n));for(a=this.length-t;a<this.length;++a)this.setCell(a,r)}else for(a=e;a<this.length;++a)this.setCell(a,r);e&&2===this.getWidth(e-1)&&this.setCellFromCodePoint(e-1,0,1,(null==i?void 0:i.fg)||0,(null==i?void 0:i.bg)||0,(null==i?void 0:i.extended)||new s.ExtendedAttrs),0!==this.getWidth(e)||this.hasContent(e)||this.setCellFromCodePoint(e,0,1,(null==i?void 0:i.fg)||0,(null==i?void 0:i.bg)||0,(null==i?void 0:i.extended)||new s.ExtendedAttrs)},e.prototype.replaceCells=function(e,t,r,i){for(e&&2===this.getWidth(e-1)&&this.setCellFromCodePoint(e-1,0,1,(null==i?void 0:i.fg)||0,(null==i?void 0:i.bg)||0,(null==i?void 0:i.extended)||new s.ExtendedAttrs),t<this.length&&2===this.getWidth(t-1)&&this.setCellFromCodePoint(t,0,1,(null==i?void 0:i.fg)||0,(null==i?void 0:i.bg)||0,(null==i?void 0:i.extended)||new s.ExtendedAttrs);e<t&&e<this.length;)this.setCell(e++,r)},e.prototype.resize=function(e,t){if(e!==this.length){if(e>this.length){var r=new Uint32Array(3*e);this.length&&(3*e<this._data.length?r.set(this._data.subarray(0,3*e)):r.set(this._data)),this._data=r;for(var i=this.length;i<e;++i)this.setCell(i,t)}else if(e){(r=new Uint32Array(3*e)).set(this._data.subarray(0,3*e)),this._data=r;var n=Object.keys(this._combined);for(i=0;i<n.length;i++){var o=parseInt(n[i],10);o>=e&&delete this._combined[o]}}else this._data=new Uint32Array(0),this._combined={};this.length=e}},e.prototype.fill=function(e){this._combined={},this._extendedAttrs={};for(var t=0;t<this.length;++t)this.setCell(t,e)},e.prototype.copyFrom=function(e){for(var t in this.length!==e.length?this._data=new Uint32Array(e._data):this._data.set(e._data),this.length=e.length,this._combined={},e._combined)this._combined[t]=e._combined[t];for(var t in this._extendedAttrs={},e._extendedAttrs)this._extendedAttrs[t]=e._extendedAttrs[t];this.isWrapped=e.isWrapped},e.prototype.clone=function(){var t=new e(0);for(var r in t._data=new Uint32Array(this._data),t.length=this.length,this._combined)t._combined[r]=this._combined[r];for(var r in this._extendedAttrs)t._extendedAttrs[r]=this._extendedAttrs[r];return t.isWrapped=this.isWrapped,t},e.prototype.getTrimmedLength=function(){for(var e=this.length-1;e>=0;--e)if(4194303&this._data[3*e+0])return e+(this._data[3*e+0]>>22);return 0},e.prototype.copyCellsFrom=function(e,t,r,i,n){var o=e._data;if(n)for(var s=i-1;s>=0;s--)for(var a=0;a<3;a++)this._data[3*(r+s)+a]=o[3*(t+s)+a];else for(s=0;s<i;s++)for(a=0;a<3;a++)this._data[3*(r+s)+a]=o[3*(t+s)+a];var c=Object.keys(e._combined);for(a=0;a<c.length;a++){var l=parseInt(c[a],10);l>=t&&(this._combined[l-t+r]=e._combined[l])}},e.prototype.translateToString=function(e,t,r){void 0===e&&(e=!1),void 0===t&&(t=0),void 0===r&&(r=this.length),e&&(r=Math.min(r,this.getTrimmedLength()));for(var o="";t<r;){var s=this._data[3*t+0],a=2097151&s;o+=2097152&s?this._combined[t]:a?i.stringFromCodePoint(a):n.WHITESPACE_CELL_CHAR,t+=s>>22||1}return o},e}();t.BufferLine=a},4634:(e,t)=>{function r(e,t,r){if(t===e.length-1)return e[t].getTrimmedLength();var i=!e[t].hasContent(r-1)&&1===e[t].getWidth(r-1),n=2===e[t+1].getWidth(0);return i&&n?r-1:r}Object.defineProperty(t,"__esModule",{value:!0}),t.getWrappedLineTrimmedLength=t.reflowSmallerGetNewLineLengths=t.reflowLargerApplyNewLayout=t.reflowLargerCreateNewLayout=t.reflowLargerGetLinesToRemove=void 0,t.reflowLargerGetLinesToRemove=function(e,t,i,n,o){for(var s=[],a=0;a<e.length-1;a++){var c=a,l=e.get(++c);if(l.isWrapped){for(var h=[e.get(a)];c<e.length&&l.isWrapped;)h.push(l),l=e.get(++c);if(n>=a&&n<c)a+=h.length-1;else{for(var u=0,f=r(h,u,t),_=1,d=0;_<h.length;){var p=r(h,_,t),v=p-d,g=i-f,y=Math.min(v,g);h[u].copyCellsFrom(h[_],d,f,y,!1),(f+=y)===i&&(u++,f=0),(d+=y)===p&&(_++,d=0),0===f&&0!==u&&2===h[u-1].getWidth(i-1)&&(h[u].copyCellsFrom(h[u-1],i-1,f++,1,!1),h[u-1].setCell(i-1,o))}h[u].replaceCells(f,i,o);for(var b=0,S=h.length-1;S>0&&(S>u||0===h[S].getTrimmedLength());S--)b++;b>0&&(s.push(a+h.length-b),s.push(b)),a+=h.length-1}}}return s},t.reflowLargerCreateNewLayout=function(e,t){for(var r=[],i=0,n=t[i],o=0,s=0;s<e.length;s++)if(n===s){var a=t[++i];e.onDeleteEmitter.fire({index:s-o,amount:a}),s+=a-1,o+=a,n=t[++i]}else r.push(s);return{layout:r,countRemoved:o}},t.reflowLargerApplyNewLayout=function(e,t){for(var r=[],i=0;i<t.length;i++)r.push(e.get(t[i]));for(i=0;i<r.length;i++)e.set(i,r[i]);e.length=t.length},t.reflowSmallerGetNewLineLengths=function(e,t,i){for(var n=[],o=e.map((function(i,n){return r(e,n,t)})).reduce((function(e,t){return e+t})),s=0,a=0,c=0;c<o;){if(o-c<i){n.push(o-c);break}s+=i;var l=r(e,a,t);s>l&&(s-=l,a++);var h=2===e[a].getWidth(s-1);h&&s--;var u=h?i-1:i;n.push(u),c+=u}return n},t.getWrappedLineTrimmedLength=r},5295:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.BufferSet=void 0;var o=r(9092),s=r(8460),a=function(e){function t(t,r){var i=e.call(this)||this;return i._optionsService=t,i._bufferService=r,i._onBufferActivate=i.register(new s.EventEmitter),i.reset(),i}return n(t,e),Object.defineProperty(t.prototype,"onBufferActivate",{get:function(){return this._onBufferActivate.event},enumerable:!1,configurable:!0}),t.prototype.reset=function(){this._normal=new o.Buffer(!0,this._optionsService,this._bufferService),this._normal.fillViewportRows(),this._alt=new o.Buffer(!1,this._optionsService,this._bufferService),this._activeBuffer=this._normal,this.setupTabStops()},Object.defineProperty(t.prototype,"alt",{get:function(){return this._alt},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"active",{get:function(){return this._activeBuffer},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"normal",{get:function(){return this._normal},enumerable:!1,configurable:!0}),t.prototype.activateNormalBuffer=function(){this._activeBuffer!==this._normal&&(this._normal.x=this._alt.x,this._normal.y=this._alt.y,this._alt.clear(),this._activeBuffer=this._normal,this._onBufferActivate.fire({activeBuffer:this._normal,inactiveBuffer:this._alt}))},t.prototype.activateAltBuffer=function(e){this._activeBuffer!==this._alt&&(this._alt.fillViewportRows(e),this._alt.x=this._normal.x,this._alt.y=this._normal.y,this._activeBuffer=this._alt,this._onBufferActivate.fire({activeBuffer:this._alt,inactiveBuffer:this._normal}))},t.prototype.resize=function(e,t){this._normal.resize(e,t),this._alt.resize(e,t)},t.prototype.setupTabStops=function(e){this._normal.setupTabStops(e),this._alt.setupTabStops(e)},t}(r(844).Disposable);t.BufferSet=a},511:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.CellData=void 0;var o=r(482),s=r(643),a=r(3734),c=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.content=0,t.fg=0,t.bg=0,t.extended=new a.ExtendedAttrs,t.combinedData="",t}return n(t,e),t.fromCharData=function(e){var r=new t;return r.setFromCharData(e),r},t.prototype.isCombined=function(){return 2097152&this.content},t.prototype.getWidth=function(){return this.content>>22},t.prototype.getChars=function(){return 2097152&this.content?this.combinedData:2097151&this.content?o.stringFromCodePoint(2097151&this.content):""},t.prototype.getCode=function(){return this.isCombined()?this.combinedData.charCodeAt(this.combinedData.length-1):2097151&this.content},t.prototype.setFromCharData=function(e){this.fg=e[s.CHAR_DATA_ATTR_INDEX],this.bg=0;var t=!1;if(e[s.CHAR_DATA_CHAR_INDEX].length>2)t=!0;else if(2===e[s.CHAR_DATA_CHAR_INDEX].length){var r=e[s.CHAR_DATA_CHAR_INDEX].charCodeAt(0);if(55296<=r&&r<=56319){var i=e[s.CHAR_DATA_CHAR_INDEX].charCodeAt(1);56320<=i&&i<=57343?this.content=1024*(r-55296)+i-56320+65536|e[s.CHAR_DATA_WIDTH_INDEX]<<22:t=!0}else t=!0}else this.content=e[s.CHAR_DATA_CHAR_INDEX].charCodeAt(0)|e[s.CHAR_DATA_WIDTH_INDEX]<<22;t&&(this.combinedData=e[s.CHAR_DATA_CHAR_INDEX],this.content=2097152|e[s.CHAR_DATA_WIDTH_INDEX]<<22)},t.prototype.getAsCharData=function(){return[this.fg,this.getChars(),this.getWidth(),this.getCode()]},t}(a.AttributeData);t.CellData=c},643:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.WHITESPACE_CELL_CODE=t.WHITESPACE_CELL_WIDTH=t.WHITESPACE_CELL_CHAR=t.NULL_CELL_CODE=t.NULL_CELL_WIDTH=t.NULL_CELL_CHAR=t.CHAR_DATA_CODE_INDEX=t.CHAR_DATA_WIDTH_INDEX=t.CHAR_DATA_CHAR_INDEX=t.CHAR_DATA_ATTR_INDEX=t.DEFAULT_ATTR=t.DEFAULT_COLOR=void 0,t.DEFAULT_COLOR=256,t.DEFAULT_ATTR=256|t.DEFAULT_COLOR<<9,t.CHAR_DATA_ATTR_INDEX=0,t.CHAR_DATA_CHAR_INDEX=1,t.CHAR_DATA_WIDTH_INDEX=2,t.CHAR_DATA_CODE_INDEX=3,t.NULL_CELL_CHAR="",t.NULL_CELL_WIDTH=1,t.NULL_CELL_CODE=0,t.WHITESPACE_CELL_CHAR=" ",t.WHITESPACE_CELL_WIDTH=1,t.WHITESPACE_CELL_CODE=32},4863:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.Marker=void 0;var o=r(8460),s=function(e){function t(r){var i=e.call(this)||this;return i.line=r,i._id=t._nextId++,i.isDisposed=!1,i._onDispose=new o.EventEmitter,i}return n(t,e),Object.defineProperty(t.prototype,"id",{get:function(){return this._id},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onDispose",{get:function(){return this._onDispose.event},enumerable:!1,configurable:!0}),t.prototype.dispose=function(){this.isDisposed||(this.isDisposed=!0,this.line=-1,this._onDispose.fire(),e.prototype.dispose.call(this))},t._nextId=1,t}(r(844).Disposable);t.Marker=s},7116:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.DEFAULT_CHARSET=t.CHARSETS=void 0,t.CHARSETS={},t.DEFAULT_CHARSET=t.CHARSETS.B,t.CHARSETS[0]={"`":"◆",a:"▒",b:"␉",c:"␌",d:"␍",e:"␊",f:"°",g:"±",h:"␤",i:"␋",j:"┘",k:"┐",l:"┌",m:"└",n:"┼",o:"⎺",p:"⎻",q:"─",r:"⎼",s:"⎽",t:"├",u:"┤",v:"┴",w:"┬",x:"│",y:"≤",z:"≥","{":"π","|":"≠","}":"£","~":"·"},t.CHARSETS.A={"#":"£"},t.CHARSETS.B=void 0,t.CHARSETS[4]={"#":"£","@":"¾","[":"ij","\\":"½","]":"|","{":"¨","|":"f","}":"¼","~":"´"},t.CHARSETS.C=t.CHARSETS[5]={"[":"Ä","\\":"Ö","]":"Å","^":"Ü","`":"é","{":"ä","|":"ö","}":"å","~":"ü"},t.CHARSETS.R={"#":"£","@":"à","[":"°","\\":"ç","]":"§","{":"é","|":"ù","}":"è","~":"¨"},t.CHARSETS.Q={"@":"à","[":"â","\\":"ç","]":"ê","^":"î","`":"ô","{":"é","|":"ù","}":"è","~":"û"},t.CHARSETS.K={"@":"§","[":"Ä","\\":"Ö","]":"Ü","{":"ä","|":"ö","}":"ü","~":"ß"},t.CHARSETS.Y={"#":"£","@":"§","[":"°","\\":"ç","]":"é","`":"ù","{":"à","|":"ò","}":"è","~":"ì"},t.CHARSETS.E=t.CHARSETS[6]={"@":"Ä","[":"Æ","\\":"Ø","]":"Å","^":"Ü","`":"ä","{":"æ","|":"ø","}":"å","~":"ü"},t.CHARSETS.Z={"#":"£","@":"§","[":"¡","\\":"Ñ","]":"¿","{":"°","|":"ñ","}":"ç"},t.CHARSETS.H=t.CHARSETS[7]={"@":"É","[":"Ä","\\":"Ö","]":"Å","^":"Ü","`":"é","{":"ä","|":"ö","}":"å","~":"ü"},t.CHARSETS["="]={"#":"ù","@":"à","[":"é","\\":"ç","]":"ê","^":"î",_:"è","`":"ô","{":"ä","|":"ö","}":"ü","~":"û"}},2584:(e,t)=>{var r,i;Object.defineProperty(t,"__esModule",{value:!0}),t.C1=t.C0=void 0,(i=t.C0||(t.C0={})).NUL="\0",i.SOH="",i.STX="",i.ETX="",i.EOT="",i.ENQ="",i.ACK="",i.BEL="",i.BS="\b",i.HT="\t",i.LF="\n",i.VT="\v",i.FF="\f",i.CR="\r",i.SO="",i.SI="",i.DLE="",i.DC1="",i.DC2="",i.DC3="",i.DC4="",i.NAK="",i.SYN="",i.ETB="",i.CAN="",i.EM="",i.SUB="",i.ESC="",i.FS="",i.GS="",i.RS="",i.US="",i.SP=" ",i.DEL="",(r=t.C1||(t.C1={})).PAD="",r.HOP="",r.BPH="",r.NBH="",r.IND="",r.NEL="",r.SSA="",r.ESA="",r.HTS="",r.HTJ="",r.VTS="",r.PLD="",r.PLU="",r.RI="",r.SS2="",r.SS3="",r.DCS="",r.PU1="",r.PU2="",r.STS="",r.CCH="",r.MW="",r.SPA="",r.EPA="",r.SOS="",r.SGCI="",r.SCI="",r.CSI="",r.ST="",r.OSC="",r.PM="",r.APC=""},7399:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.evaluateKeyboardEvent=void 0;var i=r(2584),n={48:["0",")"],49:["1","!"],50:["2","@"],51:["3","#"],52:["4","$"],53:["5","%"],54:["6","^"],55:["7","&"],56:["8","*"],57:["9","("],186:[";",":"],187:["=","+"],188:[",","<"],189:["-","_"],190:[".",">"],191:["/","?"],192:["`","~"],219:["[","{"],220:["\\","|"],221:["]","}"],222:["'",'"']};t.evaluateKeyboardEvent=function(e,t,r,o){var s={type:0,cancel:!1,key:void 0},a=(e.shiftKey?1:0)|(e.altKey?2:0)|(e.ctrlKey?4:0)|(e.metaKey?8:0);switch(e.keyCode){case 0:"UIKeyInputUpArrow"===e.key?s.key=t?i.C0.ESC+"OA":i.C0.ESC+"[A":"UIKeyInputLeftArrow"===e.key?s.key=t?i.C0.ESC+"OD":i.C0.ESC+"[D":"UIKeyInputRightArrow"===e.key?s.key=t?i.C0.ESC+"OC":i.C0.ESC+"[C":"UIKeyInputDownArrow"===e.key&&(s.key=t?i.C0.ESC+"OB":i.C0.ESC+"[B");break;case 8:if(e.shiftKey){s.key=i.C0.BS;break}if(e.altKey){s.key=i.C0.ESC+i.C0.DEL;break}s.key=i.C0.DEL;break;case 9:if(e.shiftKey){s.key=i.C0.ESC+"[Z";break}s.key=i.C0.HT,s.cancel=!0;break;case 13:s.key=e.altKey?i.C0.ESC+i.C0.CR:i.C0.CR,s.cancel=!0;break;case 27:s.key=i.C0.ESC,e.altKey&&(s.key=i.C0.ESC+i.C0.ESC),s.cancel=!0;break;case 37:if(e.metaKey)break;a?(s.key=i.C0.ESC+"[1;"+(a+1)+"D",s.key===i.C0.ESC+"[1;3D"&&(s.key=i.C0.ESC+(r?"b":"[1;5D"))):s.key=t?i.C0.ESC+"OD":i.C0.ESC+"[D";break;case 39:if(e.metaKey)break;a?(s.key=i.C0.ESC+"[1;"+(a+1)+"C",s.key===i.C0.ESC+"[1;3C"&&(s.key=i.C0.ESC+(r?"f":"[1;5C"))):s.key=t?i.C0.ESC+"OC":i.C0.ESC+"[C";break;case 38:if(e.metaKey)break;a?(s.key=i.C0.ESC+"[1;"+(a+1)+"A",r||s.key!==i.C0.ESC+"[1;3A"||(s.key=i.C0.ESC+"[1;5A")):s.key=t?i.C0.ESC+"OA":i.C0.ESC+"[A";break;case 40:if(e.metaKey)break;a?(s.key=i.C0.ESC+"[1;"+(a+1)+"B",r||s.key!==i.C0.ESC+"[1;3B"||(s.key=i.C0.ESC+"[1;5B")):s.key=t?i.C0.ESC+"OB":i.C0.ESC+"[B";break;case 45:e.shiftKey||e.ctrlKey||(s.key=i.C0.ESC+"[2~");break;case 46:s.key=a?i.C0.ESC+"[3;"+(a+1)+"~":i.C0.ESC+"[3~";break;case 36:s.key=a?i.C0.ESC+"[1;"+(a+1)+"H":t?i.C0.ESC+"OH":i.C0.ESC+"[H";break;case 35:s.key=a?i.C0.ESC+"[1;"+(a+1)+"F":t?i.C0.ESC+"OF":i.C0.ESC+"[F";break;case 33:e.shiftKey?s.type=2:s.key=i.C0.ESC+"[5~";break;case 34:e.shiftKey?s.type=3:s.key=i.C0.ESC+"[6~";break;case 112:s.key=a?i.C0.ESC+"[1;"+(a+1)+"P":i.C0.ESC+"OP";break;case 113:s.key=a?i.C0.ESC+"[1;"+(a+1)+"Q":i.C0.ESC+"OQ";break;case 114:s.key=a?i.C0.ESC+"[1;"+(a+1)+"R":i.C0.ESC+"OR";break;case 115:s.key=a?i.C0.ESC+"[1;"+(a+1)+"S":i.C0.ESC+"OS";break;case 116:s.key=a?i.C0.ESC+"[15;"+(a+1)+"~":i.C0.ESC+"[15~";break;case 117:s.key=a?i.C0.ESC+"[17;"+(a+1)+"~":i.C0.ESC+"[17~";break;case 118:s.key=a?i.C0.ESC+"[18;"+(a+1)+"~":i.C0.ESC+"[18~";break;case 119:s.key=a?i.C0.ESC+"[19;"+(a+1)+"~":i.C0.ESC+"[19~";break;case 120:s.key=a?i.C0.ESC+"[20;"+(a+1)+"~":i.C0.ESC+"[20~";break;case 121:s.key=a?i.C0.ESC+"[21;"+(a+1)+"~":i.C0.ESC+"[21~";break;case 122:s.key=a?i.C0.ESC+"[23;"+(a+1)+"~":i.C0.ESC+"[23~";break;case 123:s.key=a?i.C0.ESC+"[24;"+(a+1)+"~":i.C0.ESC+"[24~";break;default:if(!e.ctrlKey||e.shiftKey||e.altKey||e.metaKey)if(r&&!o||!e.altKey||e.metaKey)!r||e.altKey||e.ctrlKey||e.shiftKey||!e.metaKey?e.key&&!e.ctrlKey&&!e.altKey&&!e.metaKey&&e.keyCode>=48&&1===e.key.length?s.key=e.key:e.key&&e.ctrlKey&&"_"===e.key&&(s.key=i.C0.US):65===e.keyCode&&(s.type=1);else{var c=n[e.keyCode],l=c&&c[e.shiftKey?1:0];if(l)s.key=i.C0.ESC+l;else if(e.keyCode>=65&&e.keyCode<=90){var h=e.ctrlKey?e.keyCode-64:e.keyCode+32;s.key=i.C0.ESC+String.fromCharCode(h)}}else e.keyCode>=65&&e.keyCode<=90?s.key=String.fromCharCode(e.keyCode-64):32===e.keyCode?s.key=i.C0.NUL:e.keyCode>=51&&e.keyCode<=55?s.key=String.fromCharCode(e.keyCode-51+27):56===e.keyCode?s.key=i.C0.DEL:219===e.keyCode?s.key=i.C0.ESC:220===e.keyCode?s.key=i.C0.FS:221===e.keyCode&&(s.key=i.C0.GS)}return s}},482:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Utf8ToUtf32=t.StringToUtf32=t.utf32ToString=t.stringFromCodePoint=void 0,t.stringFromCodePoint=function(e){return e>65535?(e-=65536,String.fromCharCode(55296+(e>>10))+String.fromCharCode(e%1024+56320)):String.fromCharCode(e)},t.utf32ToString=function(e,t,r){void 0===t&&(t=0),void 0===r&&(r=e.length);for(var i="",n=t;n<r;++n){var o=e[n];o>65535?(o-=65536,i+=String.fromCharCode(55296+(o>>10))+String.fromCharCode(o%1024+56320)):i+=String.fromCharCode(o)}return i};var r=function(){function e(){this._interim=0}return e.prototype.clear=function(){this._interim=0},e.prototype.decode=function(e,t){var r=e.length;if(!r)return 0;var i=0,n=0;this._interim&&(56320<=(a=e.charCodeAt(n++))&&a<=57343?t[i++]=1024*(this._interim-55296)+a-56320+65536:(t[i++]=this._interim,t[i++]=a),this._interim=0);for(var o=n;o<r;++o){var s=e.charCodeAt(o);if(55296<=s&&s<=56319){if(++o>=r)return this._interim=s,i;var a;56320<=(a=e.charCodeAt(o))&&a<=57343?t[i++]=1024*(s-55296)+a-56320+65536:(t[i++]=s,t[i++]=a)}else 65279!==s&&(t[i++]=s)}return i},e}();t.StringToUtf32=r;var i=function(){function e(){this.interim=new Uint8Array(3)}return e.prototype.clear=function(){this.interim.fill(0)},e.prototype.decode=function(e,t){var r=e.length;if(!r)return 0;var i,n,o,s,a=0,c=0,l=0;if(this.interim[0]){var h=!1,u=this.interim[0];u&=192==(224&u)?31:224==(240&u)?15:7;for(var f=0,_=void 0;(_=63&this.interim[++f])&&f<4;)u<<=6,u|=_;for(var d=192==(224&this.interim[0])?2:224==(240&this.interim[0])?3:4,p=d-f;l<p;){if(l>=r)return 0;if(128!=(192&(_=e[l++]))){l--,h=!0;break}this.interim[f++]=_,u<<=6,u|=63&_}h||(2===d?u<128?l--:t[a++]=u:3===d?u<2048||u>=55296&&u<=57343||65279===u||(t[a++]=u):u<65536||u>1114111||(t[a++]=u)),this.interim.fill(0)}for(var v=r-4,g=l;g<r;){for(;!(!(g<v)||128&(i=e[g])||128&(n=e[g+1])||128&(o=e[g+2])||128&(s=e[g+3]));)t[a++]=i,t[a++]=n,t[a++]=o,t[a++]=s,g+=4;if((i=e[g++])<128)t[a++]=i;else if(192==(224&i)){if(g>=r)return this.interim[0]=i,a;if(128!=(192&(n=e[g++]))){g--;continue}if((c=(31&i)<<6|63&n)<128){g--;continue}t[a++]=c}else if(224==(240&i)){if(g>=r)return this.interim[0]=i,a;if(128!=(192&(n=e[g++]))){g--;continue}if(g>=r)return this.interim[0]=i,this.interim[1]=n,a;if(128!=(192&(o=e[g++]))){g--;continue}if((c=(15&i)<<12|(63&n)<<6|63&o)<2048||c>=55296&&c<=57343||65279===c)continue;t[a++]=c}else if(240==(248&i)){if(g>=r)return this.interim[0]=i,a;if(128!=(192&(n=e[g++]))){g--;continue}if(g>=r)return this.interim[0]=i,this.interim[1]=n,a;if(128!=(192&(o=e[g++]))){g--;continue}if(g>=r)return this.interim[0]=i,this.interim[1]=n,this.interim[2]=o,a;if(128!=(192&(s=e[g++]))){g--;continue}if((c=(7&i)<<18|(63&n)<<12|(63&o)<<6|63&s)<65536||c>1114111)continue;t[a++]=c}}return a},e}();t.Utf8ToUtf32=i},225:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.UnicodeV6=void 0;var i,n=r(8273),o=[[768,879],[1155,1158],[1160,1161],[1425,1469],[1471,1471],[1473,1474],[1476,1477],[1479,1479],[1536,1539],[1552,1557],[1611,1630],[1648,1648],[1750,1764],[1767,1768],[1770,1773],[1807,1807],[1809,1809],[1840,1866],[1958,1968],[2027,2035],[2305,2306],[2364,2364],[2369,2376],[2381,2381],[2385,2388],[2402,2403],[2433,2433],[2492,2492],[2497,2500],[2509,2509],[2530,2531],[2561,2562],[2620,2620],[2625,2626],[2631,2632],[2635,2637],[2672,2673],[2689,2690],[2748,2748],[2753,2757],[2759,2760],[2765,2765],[2786,2787],[2817,2817],[2876,2876],[2879,2879],[2881,2883],[2893,2893],[2902,2902],[2946,2946],[3008,3008],[3021,3021],[3134,3136],[3142,3144],[3146,3149],[3157,3158],[3260,3260],[3263,3263],[3270,3270],[3276,3277],[3298,3299],[3393,3395],[3405,3405],[3530,3530],[3538,3540],[3542,3542],[3633,3633],[3636,3642],[3655,3662],[3761,3761],[3764,3769],[3771,3772],[3784,3789],[3864,3865],[3893,3893],[3895,3895],[3897,3897],[3953,3966],[3968,3972],[3974,3975],[3984,3991],[3993,4028],[4038,4038],[4141,4144],[4146,4146],[4150,4151],[4153,4153],[4184,4185],[4448,4607],[4959,4959],[5906,5908],[5938,5940],[5970,5971],[6002,6003],[6068,6069],[6071,6077],[6086,6086],[6089,6099],[6109,6109],[6155,6157],[6313,6313],[6432,6434],[6439,6440],[6450,6450],[6457,6459],[6679,6680],[6912,6915],[6964,6964],[6966,6970],[6972,6972],[6978,6978],[7019,7027],[7616,7626],[7678,7679],[8203,8207],[8234,8238],[8288,8291],[8298,8303],[8400,8431],[12330,12335],[12441,12442],[43014,43014],[43019,43019],[43045,43046],[64286,64286],[65024,65039],[65056,65059],[65279,65279],[65529,65531]],s=[[68097,68099],[68101,68102],[68108,68111],[68152,68154],[68159,68159],[119143,119145],[119155,119170],[119173,119179],[119210,119213],[119362,119364],[917505,917505],[917536,917631],[917760,917999]],a=function(){function e(){if(this.version="6",!i){i=new Uint8Array(65536),n.fill(i,1),i[0]=0,n.fill(i,0,1,32),n.fill(i,0,127,160),n.fill(i,2,4352,4448),i[9001]=2,i[9002]=2,n.fill(i,2,11904,42192),i[12351]=1,n.fill(i,2,44032,55204),n.fill(i,2,63744,64256),n.fill(i,2,65040,65050),n.fill(i,2,65072,65136),n.fill(i,2,65280,65377),n.fill(i,2,65504,65511);for(var e=0;e<o.length;++e)n.fill(i,0,o[e][0],o[e][1]+1)}}return e.prototype.wcwidth=function(e){return e<32?0:e<127?1:e<65536?i[e]:function(e,t){var r,i=0,n=t.length-1;if(e<t[0][0]||e>t[n][1])return!1;for(;n>=i;)if(e>t[r=i+n>>1][1])i=r+1;else{if(!(e<t[r][0]))return!0;n=r-1}return!1}(e,s)?0:e>=131072&&e<=196605||e>=196608&&e<=262141?2:1},e}();t.UnicodeV6=a},5981:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.WriteBuffer=void 0;var r=function(){function e(e){this._action=e,this._writeBuffer=[],this._callbacks=[],this._pendingData=0,this._bufferOffset=0}return e.prototype.writeSync=function(e){if(this._writeBuffer.length){for(var t=this._bufferOffset;t<this._writeBuffer.length;++t){var r=this._writeBuffer[t],i=this._callbacks[t];this._action(r),i&&i()}this._writeBuffer=[],this._callbacks=[],this._pendingData=0,this._bufferOffset=2147483647}this._action(e)},e.prototype.write=function(e,t){var r=this;if(this._pendingData>5e7)throw new Error("write data discarded, use flow control to avoid losing data");this._writeBuffer.length||(this._bufferOffset=0,setTimeout((function(){return r._innerWrite()}))),this._pendingData+=e.length,this._writeBuffer.push(e),this._callbacks.push(t)},e.prototype._innerWrite=function(){for(var e=this,t=Date.now();this._writeBuffer.length>this._bufferOffset;){var r=this._writeBuffer[this._bufferOffset],i=this._callbacks[this._bufferOffset];if(this._bufferOffset++,this._action(r),this._pendingData-=r.length,i&&i(),Date.now()-t>=12)break}this._writeBuffer.length>this._bufferOffset?(this._bufferOffset>50&&(this._writeBuffer=this._writeBuffer.slice(this._bufferOffset),this._callbacks=this._callbacks.slice(this._bufferOffset),this._bufferOffset=0),setTimeout((function(){return e._innerWrite()}),0)):(this._writeBuffer=[],this._callbacks=[],this._pendingData=0,this._bufferOffset=0)},e}();t.WriteBuffer=r},5770:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.PAYLOAD_LIMIT=void 0,t.PAYLOAD_LIMIT=1e7},6351:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.DcsHandler=t.DcsParser=void 0;var i=r(482),n=r(8742),o=r(5770),s=[],a=function(){function e(){this._handlers=Object.create(null),this._active=s,this._ident=0,this._handlerFb=function(){}}return e.prototype.dispose=function(){this._handlers=Object.create(null),this._handlerFb=function(){},this._active=s},e.prototype.registerHandler=function(e,t){void 0===this._handlers[e]&&(this._handlers[e]=[]);var r=this._handlers[e];return r.push(t),{dispose:function(){var e=r.indexOf(t);-1!==e&&r.splice(e,1)}}},e.prototype.clearHandler=function(e){this._handlers[e]&&delete this._handlers[e]},e.prototype.setHandlerFallback=function(e){this._handlerFb=e},e.prototype.reset=function(){this._active.length&&this.unhook(!1),this._active=s,this._ident=0},e.prototype.hook=function(e,t){if(this.reset(),this._ident=e,this._active=this._handlers[e]||s,this._active.length)for(var r=this._active.length-1;r>=0;r--)this._active[r].hook(t);else this._handlerFb(this._ident,"HOOK",t)},e.prototype.put=function(e,t,r){if(this._active.length)for(var n=this._active.length-1;n>=0;n--)this._active[n].put(e,t,r);else this._handlerFb(this._ident,"PUT",i.utf32ToString(e,t,r))},e.prototype.unhook=function(e){if(this._active.length){for(var t=this._active.length-1;t>=0&&!this._active[t].unhook(e);t--);for(t--;t>=0;t--)this._active[t].unhook(!1)}else this._handlerFb(this._ident,"UNHOOK",e);this._active=s,this._ident=0},e}();t.DcsParser=a;var c=new n.Params;c.addParam(0);var l=function(){function e(e){this._handler=e,this._data="",this._params=c,this._hitLimit=!1}return e.prototype.hook=function(e){this._params=e.length>1||e.params[0]?e.clone():c,this._data="",this._hitLimit=!1},e.prototype.put=function(e,t,r){this._hitLimit||(this._data+=i.utf32ToString(e,t,r),this._data.length>o.PAYLOAD_LIMIT&&(this._data="",this._hitLimit=!0))},e.prototype.unhook=function(e){var t=!1;return this._hitLimit?t=!1:e&&(t=this._handler(this._data,this._params)),this._params=c,this._data="",this._hitLimit=!1,t},e}();t.DcsHandler=l},2015:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0}),t.EscapeSequenceParser=t.VT500_TRANSITION_TABLE=t.TransitionTable=void 0;var o=r(844),s=r(8273),a=r(8742),c=r(6242),l=r(6351),h=function(){function e(e){this.table=new Uint8Array(e)}return e.prototype.setDefault=function(e,t){s.fill(this.table,e<<4|t)},e.prototype.add=function(e,t,r,i){this.table[t<<8|e]=r<<4|i},e.prototype.addMany=function(e,t,r,i){for(var n=0;n<e.length;n++)this.table[t<<8|e[n]]=r<<4|i},e}();t.TransitionTable=h;var u=160;t.VT500_TRANSITION_TABLE=function(){var e=new h(4095),t=Array.apply(null,Array(256)).map((function(e,t){return t})),r=function(e,r){return t.slice(e,r)},i=r(32,127),n=r(0,24);n.push(25),n.push.apply(n,r(28,32));var o,s=r(0,14);for(o in e.setDefault(1,0),e.addMany(i,0,2,0),s)e.addMany([24,26,153,154],o,3,0),e.addMany(r(128,144),o,3,0),e.addMany(r(144,152),o,3,0),e.add(156,o,0,0),e.add(27,o,11,1),e.add(157,o,4,8),e.addMany([152,158,159],o,0,7),e.add(155,o,11,3),e.add(144,o,11,9);return e.addMany(n,0,3,0),e.addMany(n,1,3,1),e.add(127,1,0,1),e.addMany(n,8,0,8),e.addMany(n,3,3,3),e.add(127,3,0,3),e.addMany(n,4,3,4),e.add(127,4,0,4),e.addMany(n,6,3,6),e.addMany(n,5,3,5),e.add(127,5,0,5),e.addMany(n,2,3,2),e.add(127,2,0,2),e.add(93,1,4,8),e.addMany(i,8,5,8),e.add(127,8,5,8),e.addMany([156,27,24,26,7],8,6,0),e.addMany(r(28,32),8,0,8),e.addMany([88,94,95],1,0,7),e.addMany(i,7,0,7),e.addMany(n,7,0,7),e.add(156,7,0,0),e.add(127,7,0,7),e.add(91,1,11,3),e.addMany(r(64,127),3,7,0),e.addMany(r(48,60),3,8,4),e.addMany([60,61,62,63],3,9,4),e.addMany(r(48,60),4,8,4),e.addMany(r(64,127),4,7,0),e.addMany([60,61,62,63],4,0,6),e.addMany(r(32,64),6,0,6),e.add(127,6,0,6),e.addMany(r(64,127),6,0,0),e.addMany(r(32,48),3,9,5),e.addMany(r(32,48),5,9,5),e.addMany(r(48,64),5,0,6),e.addMany(r(64,127),5,7,0),e.addMany(r(32,48),4,9,5),e.addMany(r(32,48),1,9,2),e.addMany(r(32,48),2,9,2),e.addMany(r(48,127),2,10,0),e.addMany(r(48,80),1,10,0),e.addMany(r(81,88),1,10,0),e.addMany([89,90,92],1,10,0),e.addMany(r(96,127),1,10,0),e.add(80,1,11,9),e.addMany(n,9,0,9),e.add(127,9,0,9),e.addMany(r(28,32),9,0,9),e.addMany(r(32,48),9,9,12),e.addMany(r(48,60),9,8,10),e.addMany([60,61,62,63],9,9,10),e.addMany(n,11,0,11),e.addMany(r(32,128),11,0,11),e.addMany(r(28,32),11,0,11),e.addMany(n,10,0,10),e.add(127,10,0,10),e.addMany(r(28,32),10,0,10),e.addMany(r(48,60),10,8,10),e.addMany([60,61,62,63],10,0,11),e.addMany(r(32,48),10,9,12),e.addMany(n,12,0,12),e.add(127,12,0,12),e.addMany(r(28,32),12,0,12),e.addMany(r(32,48),12,9,12),e.addMany(r(48,64),12,0,11),e.addMany(r(64,127),12,12,13),e.addMany(r(64,127),10,12,13),e.addMany(r(64,127),9,12,13),e.addMany(n,13,13,13),e.addMany(i,13,13,13),e.add(127,13,0,13),e.addMany([27,156,24,26],13,14,0),e.add(u,0,2,0),e.add(u,8,5,8),e.add(u,6,0,6),e.add(u,11,0,11),e.add(u,13,13,13),e}();var f=function(e){function r(r){void 0===r&&(r=t.VT500_TRANSITION_TABLE);var i=e.call(this)||this;return i._transitions=r,i.initialState=0,i.currentState=i.initialState,i._params=new a.Params,i._params.addParam(0),i._collect=0,i.precedingCodepoint=0,i._printHandlerFb=function(e,t,r){},i._executeHandlerFb=function(e){},i._csiHandlerFb=function(e,t){},i._escHandlerFb=function(e){},i._errorHandlerFb=function(e){return e},i._printHandler=i._printHandlerFb,i._executeHandlers=Object.create(null),i._csiHandlers=Object.create(null),i._escHandlers=Object.create(null),i._oscParser=new c.OscParser,i._dcsParser=new l.DcsParser,i._errorHandler=i._errorHandlerFb,i.registerEscHandler({final:"\\"},(function(){return!0})),i}return n(r,e),r.prototype._identifier=function(e,t){void 0===t&&(t=[64,126]);var r=0;if(e.prefix){if(e.prefix.length>1)throw new Error("only one byte as prefix supported");if((r=e.prefix.charCodeAt(0))&&60>r||r>63)throw new Error("prefix must be in range 0x3c .. 0x3f")}if(e.intermediates){if(e.intermediates.length>2)throw new Error("only two bytes as intermediates are supported");for(var i=0;i<e.intermediates.length;++i){var n=e.intermediates.charCodeAt(i);if(32>n||n>47)throw new Error("intermediate must be in range 0x20 .. 0x2f");r<<=8,r|=n}}if(1!==e.final.length)throw new Error("final must be a single byte");var o=e.final.charCodeAt(0);if(t[0]>o||o>t[1])throw new Error("final must be in range "+t[0]+" .. "+t[1]);return(r<<=8)|o},r.prototype.identToString=function(e){for(var t=[];e;)t.push(String.fromCharCode(255&e)),e>>=8;return t.reverse().join("")},r.prototype.dispose=function(){this._csiHandlers=Object.create(null),this._executeHandlers=Object.create(null),this._escHandlers=Object.create(null),this._oscParser.dispose(),this._dcsParser.dispose()},r.prototype.setPrintHandler=function(e){this._printHandler=e},r.prototype.clearPrintHandler=function(){this._printHandler=this._printHandlerFb},r.prototype.registerEscHandler=function(e,t){var r=this._identifier(e,[48,126]);void 0===this._escHandlers[r]&&(this._escHandlers[r]=[]);var i=this._escHandlers[r];return i.push(t),{dispose:function(){var e=i.indexOf(t);-1!==e&&i.splice(e,1)}}},r.prototype.clearEscHandler=function(e){this._escHandlers[this._identifier(e,[48,126])]&&delete this._escHandlers[this._identifier(e,[48,126])]},r.prototype.setEscHandlerFallback=function(e){this._escHandlerFb=e},r.prototype.setExecuteHandler=function(e,t){this._executeHandlers[e.charCodeAt(0)]=t},r.prototype.clearExecuteHandler=function(e){this._executeHandlers[e.charCodeAt(0)]&&delete this._executeHandlers[e.charCodeAt(0)]},r.prototype.setExecuteHandlerFallback=function(e){this._executeHandlerFb=e},r.prototype.registerCsiHandler=function(e,t){var r=this._identifier(e);void 0===this._csiHandlers[r]&&(this._csiHandlers[r]=[]);var i=this._csiHandlers[r];return i.push(t),{dispose:function(){var e=i.indexOf(t);-1!==e&&i.splice(e,1)}}},r.prototype.clearCsiHandler=function(e){this._csiHandlers[this._identifier(e)]&&delete this._csiHandlers[this._identifier(e)]},r.prototype.setCsiHandlerFallback=function(e){this._csiHandlerFb=e},r.prototype.registerDcsHandler=function(e,t){return this._dcsParser.registerHandler(this._identifier(e),t)},r.prototype.clearDcsHandler=function(e){this._dcsParser.clearHandler(this._identifier(e))},r.prototype.setDcsHandlerFallback=function(e){this._dcsParser.setHandlerFallback(e)},r.prototype.registerOscHandler=function(e,t){return this._oscParser.registerHandler(e,t)},r.prototype.clearOscHandler=function(e){this._oscParser.clearHandler(e)},r.prototype.setOscHandlerFallback=function(e){this._oscParser.setHandlerFallback(e)},r.prototype.setErrorHandler=function(e){this._errorHandler=e},r.prototype.clearErrorHandler=function(){this._errorHandler=this._errorHandlerFb},r.prototype.reset=function(){this.currentState=this.initialState,this._oscParser.reset(),this._dcsParser.reset(),this._params.reset(),this._params.addParam(0),this._collect=0,this.precedingCodepoint=0},r.prototype.parse=function(e,t){for(var r=0,i=0,n=this.currentState,o=this._oscParser,s=this._dcsParser,a=this._collect,c=this._params,l=this._transitions.table,h=0;h<t;++h){switch((i=l[n<<8|((r=e[h])<160?r:u)])>>4){case 2:for(var f=h+1;;++f){if(f>=t||(r=e[f])<32||r>126&&r<u){this._printHandler(e,h,f),h=f-1;break}if(++f>=t||(r=e[f])<32||r>126&&r<u){this._printHandler(e,h,f),h=f-1;break}if(++f>=t||(r=e[f])<32||r>126&&r<u){this._printHandler(e,h,f),h=f-1;break}if(++f>=t||(r=e[f])<32||r>126&&r<u){this._printHandler(e,h,f),h=f-1;break}}break;case 3:this._executeHandlers[r]?this._executeHandlers[r]():this._executeHandlerFb(r),this.precedingCodepoint=0;break;case 0:break;case 1:if(this._errorHandler({position:h,code:r,currentState:n,collect:a,params:c,abort:!1}).abort)return;break;case 7:for(var _=this._csiHandlers[a<<8|r],d=_?_.length-1:-1;d>=0&&!_[d](c);d--);d<0&&this._csiHandlerFb(a<<8|r,c),this.precedingCodepoint=0;break;case 8:do{switch(r){case 59:c.addParam(0);break;case 58:c.addSubParam(-1);break;default:c.addDigit(r-48)}}while(++h<t&&(r=e[h])>47&&r<60);h--;break;case 9:a<<=8,a|=r;break;case 10:for(var p=this._escHandlers[a<<8|r],v=p?p.length-1:-1;v>=0&&!p[v]();v--);v<0&&this._escHandlerFb(a<<8|r),this.precedingCodepoint=0;break;case 11:c.reset(),c.addParam(0),a=0;break;case 12:s.hook(a<<8|r,c);break;case 13:for(var g=h+1;;++g)if(g>=t||24===(r=e[g])||26===r||27===r||r>127&&r<u){s.put(e,h,g),h=g-1;break}break;case 14:s.unhook(24!==r&&26!==r),27===r&&(i|=1),c.reset(),c.addParam(0),a=0,this.precedingCodepoint=0;break;case 4:o.start();break;case 5:for(var y=h+1;;y++)if(y>=t||(r=e[y])<32||r>127&&r<u){o.put(e,h,y),h=y-1;break}break;case 6:o.end(24!==r&&26!==r),27===r&&(i|=1),c.reset(),c.addParam(0),a=0,this.precedingCodepoint=0}n=15&i}this._collect=a,this.currentState=n},r}(o.Disposable);t.EscapeSequenceParser=f},6242:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.OscHandler=t.OscParser=void 0;var i=r(5770),n=r(482),o=[],s=function(){function e(){this._state=0,this._active=o,this._id=-1,this._handlers=Object.create(null),this._handlerFb=function(){}}return e.prototype.registerHandler=function(e,t){void 0===this._handlers[e]&&(this._handlers[e]=[]);var r=this._handlers[e];return r.push(t),{dispose:function(){var e=r.indexOf(t);-1!==e&&r.splice(e,1)}}},e.prototype.clearHandler=function(e){this._handlers[e]&&delete this._handlers[e]},e.prototype.setHandlerFallback=function(e){this._handlerFb=e},e.prototype.dispose=function(){this._handlers=Object.create(null),this._handlerFb=function(){},this._active=o},e.prototype.reset=function(){2===this._state&&this.end(!1),this._active=o,this._id=-1,this._state=0},e.prototype._start=function(){if(this._active=this._handlers[this._id]||o,this._active.length)for(var e=this._active.length-1;e>=0;e--)this._active[e].start();else this._handlerFb(this._id,"START")},e.prototype._put=function(e,t,r){if(this._active.length)for(var i=this._active.length-1;i>=0;i--)this._active[i].put(e,t,r);else this._handlerFb(this._id,"PUT",n.utf32ToString(e,t,r))},e.prototype._end=function(e){if(this._active.length){for(var t=this._active.length-1;t>=0&&!this._active[t].end(e);t--);for(t--;t>=0;t--)this._active[t].end(!1)}else this._handlerFb(this._id,"END",e)},e.prototype.start=function(){this.reset(),this._state=1},e.prototype.put=function(e,t,r){if(3!==this._state){if(1===this._state)for(;t<r;){var i=e[t++];if(59===i){this._state=2,this._start();break}if(i<48||57<i)return void(this._state=3);-1===this._id&&(this._id=0),this._id=10*this._id+i-48}2===this._state&&r-t>0&&this._put(e,t,r)}},e.prototype.end=function(e){0!==this._state&&(3!==this._state&&(1===this._state&&this._start(),this._end(e)),this._active=o,this._id=-1,this._state=0)},e}();t.OscParser=s;var a=function(){function e(e){this._handler=e,this._data="",this._hitLimit=!1}return e.prototype.start=function(){this._data="",this._hitLimit=!1},e.prototype.put=function(e,t,r){this._hitLimit||(this._data+=n.utf32ToString(e,t,r),this._data.length>i.PAYLOAD_LIMIT&&(this._data="",this._hitLimit=!0))},e.prototype.end=function(e){var t=!1;return this._hitLimit?t=!1:e&&(t=this._handler(this._data)),this._data="",this._hitLimit=!1,t},e}();t.OscHandler=a},8742:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Params=void 0;var r=2147483647,i=function(){function e(e,t){if(void 0===e&&(e=32),void 0===t&&(t=32),this.maxLength=e,this.maxSubParamsLength=t,t>256)throw new Error("maxSubParamsLength must not be greater than 256");this.params=new Int32Array(e),this.length=0,this._subParams=new Int32Array(t),this._subParamsLength=0,this._subParamsIdx=new Uint16Array(e),this._rejectDigits=!1,this._rejectSubDigits=!1,this._digitIsSub=!1}return e.fromArray=function(t){var r=new e;if(!t.length)return r;for(var i=t[0]instanceof Array?1:0;i<t.length;++i){var n=t[i];if(n instanceof Array)for(var o=0;o<n.length;++o)r.addSubParam(n[o]);else r.addParam(n)}return r},e.prototype.clone=function(){var t=new e(this.maxLength,this.maxSubParamsLength);return t.params.set(this.params),t.length=this.length,t._subParams.set(this._subParams),t._subParamsLength=this._subParamsLength,t._subParamsIdx.set(this._subParamsIdx),t._rejectDigits=this._rejectDigits,t._rejectSubDigits=this._rejectSubDigits,t._digitIsSub=this._digitIsSub,t},e.prototype.toArray=function(){for(var e=[],t=0;t<this.length;++t){e.push(this.params[t]);var r=this._subParamsIdx[t]>>8,i=255&this._subParamsIdx[t];i-r>0&&e.push(Array.prototype.slice.call(this._subParams,r,i))}return e},e.prototype.reset=function(){this.length=0,this._subParamsLength=0,this._rejectDigits=!1,this._rejectSubDigits=!1,this._digitIsSub=!1},e.prototype.addParam=function(e){if(this._digitIsSub=!1,this.length>=this.maxLength)this._rejectDigits=!0;else{if(e<-1)throw new Error("values lesser than -1 are not allowed");this._subParamsIdx[this.length]=this._subParamsLength<<8|this._subParamsLength,this.params[this.length++]=e>r?r:e}},e.prototype.addSubParam=function(e){if(this._digitIsSub=!0,this.length)if(this._rejectDigits||this._subParamsLength>=this.maxSubParamsLength)this._rejectSubDigits=!0;else{if(e<-1)throw new Error("values lesser than -1 are not allowed");this._subParams[this._subParamsLength++]=e>r?r:e,this._subParamsIdx[this.length-1]++}},e.prototype.hasSubParams=function(e){return(255&this._subParamsIdx[e])-(this._subParamsIdx[e]>>8)>0},e.prototype.getSubParams=function(e){var t=this._subParamsIdx[e]>>8,r=255&this._subParamsIdx[e];return r-t>0?this._subParams.subarray(t,r):null},e.prototype.getSubParamsAll=function(){for(var e={},t=0;t<this.length;++t){var r=this._subParamsIdx[t]>>8,i=255&this._subParamsIdx[t];i-r>0&&(e[t]=this._subParams.slice(r,i))}return e},e.prototype.addDigit=function(e){var t;if(!(this._rejectDigits||!(t=this._digitIsSub?this._subParamsLength:this.length)||this._digitIsSub&&this._rejectSubDigits)){var i=this._digitIsSub?this._subParams:this.params,n=i[t-1];i[t-1]=~n?Math.min(10*n+e,r):e}},e}();t.Params=i},744:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},s=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.BufferService=t.MINIMUM_ROWS=t.MINIMUM_COLS=void 0;var a=r(2585),c=r(5295),l=r(8460),h=r(844);t.MINIMUM_COLS=2,t.MINIMUM_ROWS=1;var u=function(e){function r(r){var i=e.call(this)||this;return i._optionsService=r,i.isUserScrolling=!1,i._onResize=new l.EventEmitter,i.cols=Math.max(r.options.cols,t.MINIMUM_COLS),i.rows=Math.max(r.options.rows,t.MINIMUM_ROWS),i.buffers=new c.BufferSet(r,i),i}return n(r,e),Object.defineProperty(r.prototype,"onResize",{get:function(){return this._onResize.event},enumerable:!1,configurable:!0}),Object.defineProperty(r.prototype,"buffer",{get:function(){return this.buffers.active},enumerable:!1,configurable:!0}),r.prototype.dispose=function(){e.prototype.dispose.call(this),this.buffers.dispose()},r.prototype.resize=function(e,t){this.cols=e,this.rows=t,this.buffers.resize(e,t),this.buffers.setupTabStops(this.cols),this._onResize.fire({cols:e,rows:t})},r.prototype.reset=function(){this.buffers.reset(),this.isUserScrolling=!1},o([s(0,a.IOptionsService)],r)}(h.Disposable);t.BufferService=u},7994:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.CharsetService=void 0;var r=function(){function e(){this.glevel=0,this._charsets=[]}return e.prototype.reset=function(){this.charset=void 0,this._charsets=[],this.glevel=0},e.prototype.setgLevel=function(e){this.glevel=e,this.charset=this._charsets[e]},e.prototype.setgCharset=function(e,t){this._charsets[e]=t,this.glevel===e&&(this.charset=t)},e}();t.CharsetService=r},1753:function(e,t,r){var i=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},n=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.CoreMouseService=void 0;var o=r(2585),s=r(8460),a={NONE:{events:0,restrict:function(){return!1}},X10:{events:1,restrict:function(e){return 4!==e.button&&1===e.action&&(e.ctrl=!1,e.alt=!1,e.shift=!1,!0)}},VT200:{events:19,restrict:function(e){return 32!==e.action}},DRAG:{events:23,restrict:function(e){return 32!==e.action||3!==e.button}},ANY:{events:31,restrict:function(e){return!0}}};function c(e,t){var r=(e.ctrl?16:0)|(e.shift?4:0)|(e.alt?8:0);return 4===e.button?(r|=64,r|=e.action):(r|=3&e.button,4&e.button&&(r|=64),8&e.button&&(r|=128),32===e.action?r|=32:0!==e.action||t||(r|=3)),r}var l=String.fromCharCode,h={DEFAULT:function(e){var t=[c(e,!1)+32,e.col+32,e.row+32];return t[0]>255||t[1]>255||t[2]>255?"":"[M"+l(t[0])+l(t[1])+l(t[2])},SGR:function(e){var t=0===e.action&&4!==e.button?"m":"M";return"[<"+c(e,!0)+";"+e.col+";"+e.row+t}},u=function(){function e(e,t){this._bufferService=e,this._coreService=t,this._protocols={},this._encodings={},this._activeProtocol="",this._activeEncoding="",this._onProtocolChange=new s.EventEmitter,this._lastEvent=null;for(var r=0,i=Object.keys(a);r<i.length;r++){var n=i[r];this.addProtocol(n,a[n])}for(var o=0,c=Object.keys(h);o<c.length;o++){var l=c[o];this.addEncoding(l,h[l])}this.reset()}return e.prototype.addProtocol=function(e,t){this._protocols[e]=t},e.prototype.addEncoding=function(e,t){this._encodings[e]=t},Object.defineProperty(e.prototype,"activeProtocol",{get:function(){return this._activeProtocol},set:function(e){if(!this._protocols[e])throw new Error('unknown protocol "'+e+'"');this._activeProtocol=e,this._onProtocolChange.fire(this._protocols[e].events)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"areMouseEventsActive",{get:function(){return 0!==this._protocols[this._activeProtocol].events},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"activeEncoding",{get:function(){return this._activeEncoding},set:function(e){if(!this._encodings[e])throw new Error('unknown encoding "'+e+'"');this._activeEncoding=e},enumerable:!1,configurable:!0}),e.prototype.reset=function(){this.activeProtocol="NONE",this.activeEncoding="DEFAULT",this._lastEvent=null},Object.defineProperty(e.prototype,"onProtocolChange",{get:function(){return this._onProtocolChange.event},enumerable:!1,configurable:!0}),e.prototype.triggerMouseEvent=function(e){if(e.col<0||e.col>=this._bufferService.cols||e.row<0||e.row>=this._bufferService.rows)return!1;if(4===e.button&&32===e.action)return!1;if(3===e.button&&32!==e.action)return!1;if(4!==e.button&&(2===e.action||3===e.action))return!1;if(e.col++,e.row++,32===e.action&&this._lastEvent&&this._compareEvents(this._lastEvent,e))return!1;if(!this._protocols[this._activeProtocol].restrict(e))return!1;var t=this._encodings[this._activeEncoding](e);return t&&("DEFAULT"===this._activeEncoding?this._coreService.triggerBinaryEvent(t):this._coreService.triggerDataEvent(t,!0)),this._lastEvent=e,!0},e.prototype.explainEvents=function(e){return{down:!!(1&e),up:!!(2&e),drag:!!(4&e),move:!!(8&e),wheel:!!(16&e)}},e.prototype._compareEvents=function(e,t){return e.col===t.col&&e.row===t.row&&e.button===t.button&&e.action===t.action&&e.ctrl===t.ctrl&&e.alt===t.alt&&e.shift===t.shift},i([n(0,o.IBufferService),n(1,o.ICoreService)],e)}();t.CoreMouseService=u},6975:function(e,t,r){var i,n=this&&this.__extends||(i=function(e,t){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)},function(e,t){function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}),o=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},s=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.CoreService=void 0;var a=r(2585),c=r(8460),l=r(1439),h=r(844),u=Object.freeze({insertMode:!1}),f=Object.freeze({applicationCursorKeys:!1,applicationKeypad:!1,bracketedPasteMode:!1,origin:!1,reverseWraparound:!1,sendFocus:!1,wraparound:!0}),_=function(e){function t(t,r,i,n){var o=e.call(this)||this;return o._bufferService=r,o._logService=i,o._optionsService=n,o.isCursorInitialized=!1,o.isCursorHidden=!1,o._onData=o.register(new c.EventEmitter),o._onUserInput=o.register(new c.EventEmitter),o._onBinary=o.register(new c.EventEmitter),o._scrollToBottom=t,o.register({dispose:function(){return o._scrollToBottom=void 0}}),o.modes=l.clone(u),o.decPrivateModes=l.clone(f),o}return n(t,e),Object.defineProperty(t.prototype,"onData",{get:function(){return this._onData.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onUserInput",{get:function(){return this._onUserInput.event},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"onBinary",{get:function(){return this._onBinary.event},enumerable:!1,configurable:!0}),t.prototype.reset=function(){this.modes=l.clone(u),this.decPrivateModes=l.clone(f)},t.prototype.triggerDataEvent=function(e,t){if(void 0===t&&(t=!1),!this._optionsService.options.disableStdin){var r=this._bufferService.buffer;r.ybase!==r.ydisp&&this._scrollToBottom(),t&&this._onUserInput.fire(),this._logService.debug('sending data "'+e+'"',(function(){return e.split("").map((function(e){return e.charCodeAt(0)}))})),this._onData.fire(e)}},t.prototype.triggerBinaryEvent=function(e){this._optionsService.options.disableStdin||(this._logService.debug('sending binary "'+e+'"',(function(){return e.split("").map((function(e){return e.charCodeAt(0)}))})),this._onBinary.fire(e))},o([s(1,a.IBufferService),s(2,a.ILogService),s(3,a.IOptionsService)],t)}(h.Disposable);t.CoreService=_},3730:function(e,t,r){var i=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},n=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}};Object.defineProperty(t,"__esModule",{value:!0}),t.DirtyRowService=void 0;var o=r(2585),s=function(){function e(e){this._bufferService=e,this.clearRange()}return Object.defineProperty(e.prototype,"start",{get:function(){return this._start},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"end",{get:function(){return this._end},enumerable:!1,configurable:!0}),e.prototype.clearRange=function(){this._start=this._bufferService.buffer.y,this._end=this._bufferService.buffer.y},e.prototype.markDirty=function(e){e<this._start?this._start=e:e>this._end&&(this._end=e)},e.prototype.markRangeDirty=function(e,t){if(e>t){var r=e;e=t,t=r}e<this._start&&(this._start=e),t>this._end&&(this._end=t)},e.prototype.markAllDirty=function(){this.markRangeDirty(0,this._bufferService.rows-1)},i([n(0,o.IBufferService)],e)}();t.DirtyRowService=s},4348:function(e,t,r){var i=this&&this.__spreadArrays||function(){for(var e=0,t=0,r=arguments.length;t<r;t++)e+=arguments[t].length;var i=Array(e),n=0;for(t=0;t<r;t++)for(var o=arguments[t],s=0,a=o.length;s<a;s++,n++)i[n]=o[s];return i};Object.defineProperty(t,"__esModule",{value:!0}),t.InstantiationService=t.ServiceCollection=void 0;var n=r(2585),o=r(8343),s=function(){function e(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];this._entries=new Map;for(var r=0,i=e;r<i.length;r++){var n=i[r],o=n[0],s=n[1];this.set(o,s)}}return e.prototype.set=function(e,t){var r=this._entries.get(e);return this._entries.set(e,t),r},e.prototype.forEach=function(e){this._entries.forEach((function(t,r){return e(r,t)}))},e.prototype.has=function(e){return this._entries.has(e)},e.prototype.get=function(e){return this._entries.get(e)},e}();t.ServiceCollection=s;var a=function(){function e(){this._services=new s,this._services.set(n.IInstantiationService,this)}return e.prototype.setService=function(e,t){this._services.set(e,t)},e.prototype.getService=function(e){return this._services.get(e)},e.prototype.createInstance=function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];for(var n=o.getServiceDependencies(e).sort((function(e,t){return e.index-t.index})),s=[],a=0,c=n;a<c.length;a++){var l=c[a],h=this._services.get(l.id);if(!h)throw new Error("[createInstance] "+e.name+" depends on UNKNOWN service "+l.id+".");s.push(h)}var u=n.length>0?n[0].index:t.length;if(t.length!==u)throw new Error("[createInstance] First service dependency of "+e.name+" at position "+(u+1)+" conflicts with "+t.length+" static arguments");return new(e.bind.apply(e,i([void 0],i(t,s))))},e}();t.InstantiationService=a},7866:function(e,t,r){var i=this&&this.__decorate||function(e,t,r,i){var n,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,r,s):n(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s},n=this&&this.__param||function(e,t){return function(r,i){t(r,i,e)}},o=this&&this.__spreadArrays||function(){for(var e=0,t=0,r=arguments.length;t<r;t++)e+=arguments[t].length;var i=Array(e),n=0;for(t=0;t<r;t++)for(var o=arguments[t],s=0,a=o.length;s<a;s++,n++)i[n]=o[s];return i};Object.defineProperty(t,"__esModule",{value:!0}),t.LogService=t.LogLevel=void 0;var s,a=r(2585);!function(e){e[e.DEBUG=0]="DEBUG",e[e.INFO=1]="INFO",e[e.WARN=2]="WARN",e[e.ERROR=3]="ERROR",e[e.OFF=4]="OFF"}(s=t.LogLevel||(t.LogLevel={}));var c={debug:s.DEBUG,info:s.INFO,warn:s.WARN,error:s.ERROR,off:s.OFF},l=function(){function e(e){var t=this;this._optionsService=e,this._updateLogLevel(),this._optionsService.onOptionChange((function(e){"logLevel"===e&&t._updateLogLevel()}))}return e.prototype._updateLogLevel=function(){this._logLevel=c[this._optionsService.options.logLevel]},e.prototype._evalLazyOptionalParams=function(e){for(var t=0;t<e.length;t++)"function"==typeof e[t]&&(e[t]=e[t]())},e.prototype._log=function(e,t,r){this._evalLazyOptionalParams(r),e.call.apply(e,o([console,"xterm.js: "+t],r))},e.prototype.debug=function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];this._logLevel<=s.DEBUG&&this._log(console.log,e,t)},e.prototype.info=function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];this._logLevel<=s.INFO&&this._log(console.info,e,t)},e.prototype.warn=function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];this._logLevel<=s.WARN&&this._log(console.warn,e,t)},e.prototype.error=function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];this._logLevel<=s.ERROR&&this._log(console.error,e,t)},i([n(0,a.IOptionsService)],e)}();t.LogService=l},7302:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.OptionsService=t.DEFAULT_OPTIONS=t.DEFAULT_BELL_SOUND=void 0;var i=r(8460),n=r(6114),o=r(1439);t.DEFAULT_BELL_SOUND="data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjMyLjEwNAAAAAAAAAAAAAAA//tQxAADB8AhSmxhIIEVCSiJrDCQBTcu3UrAIwUdkRgQbFAZC1CQEwTJ9mjRvBA4UOLD8nKVOWfh+UlK3z/177OXrfOdKl7pyn3Xf//WreyTRUoAWgBgkOAGbZHBgG1OF6zM82DWbZaUmMBptgQhGjsyYqc9ae9XFz280948NMBWInljyzsNRFLPWdnZGWrddDsjK1unuSrVN9jJsK8KuQtQCtMBjCEtImISdNKJOopIpBFpNSMbIHCSRpRR5iakjTiyzLhchUUBwCgyKiweBv/7UsQbg8isVNoMPMjAAAA0gAAABEVFGmgqK////9bP/6XCykxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",t.DEFAULT_OPTIONS=Object.freeze({cols:80,rows:24,cursorBlink:!1,cursorStyle:"block",cursorWidth:1,bellSound:t.DEFAULT_BELL_SOUND,bellStyle:"none",drawBoldTextInBrightColors:!0,fastScrollModifier:"alt",fastScrollSensitivity:5,fontFamily:"courier-new, courier, monospace",fontSize:15,fontWeight:"normal",fontWeightBold:"bold",lineHeight:1,linkTooltipHoverDuration:500,letterSpacing:0,logLevel:"info",scrollback:1e3,scrollSensitivity:1,screenReaderMode:!1,macOptionIsMeta:!1,macOptionClickForcesSelection:!1,minimumContrastRatio:1,disableStdin:!1,allowProposedApi:!0,allowTransparency:!1,tabStopWidth:8,theme:{},rightClickSelectsWord:n.isMac,rendererType:"canvas",windowOptions:{},windowsMode:!1,wordSeparator:" ()[]{}',\"`",altClickMovesCursor:!0,convertEol:!1,termName:"xterm",cancelEvents:!1});var s=["normal","bold","100","200","300","400","500","600","700","800","900"],a=["cols","rows"],c=function(){function e(e){this._onOptionChange=new i.EventEmitter,this.options=o.clone(t.DEFAULT_OPTIONS);for(var r=0,n=Object.keys(e);r<n.length;r++){var s=n[r];if(s in this.options)try{var a=e[s];this.options[s]=this._sanitizeAndValidateOption(s,a)}catch(e){console.error(e)}}}return Object.defineProperty(e.prototype,"onOptionChange",{get:function(){return this._onOptionChange.event},enumerable:!1,configurable:!0}),e.prototype.setOption=function(e,r){if(!(e in t.DEFAULT_OPTIONS))throw new Error('No option with key "'+e+'"');if(a.includes(e))throw new Error('Option "'+e+'" can only be set in the constructor');this.options[e]!==r&&(r=this._sanitizeAndValidateOption(e,r),this.options[e]!==r&&(this.options[e]=r,this._onOptionChange.fire(e)))},e.prototype._sanitizeAndValidateOption=function(e,r){switch(e){case"bellStyle":case"cursorStyle":case"rendererType":case"wordSeparator":r||(r=t.DEFAULT_OPTIONS[e]);break;case"fontWeight":case"fontWeightBold":if("number"==typeof r&&1<=r&&r<=1e3)break;r=s.includes(r)?r:t.DEFAULT_OPTIONS[e];break;case"cursorWidth":r=Math.floor(r);case"lineHeight":case"tabStopWidth":if(r<1)throw new Error(e+" cannot be less than 1, value: "+r);break;case"minimumContrastRatio":r=Math.max(1,Math.min(21,Math.round(10*r)/10));break;case"scrollback":if((r=Math.min(r,4294967295))<0)throw new Error(e+" cannot be less than 0, value: "+r);break;case"fastScrollSensitivity":case"scrollSensitivity":if(r<=0)throw new Error(e+" cannot be less than or equal to 0, value: "+r)}return r},e.prototype.getOption=function(e){if(!(e in t.DEFAULT_OPTIONS))throw new Error('No option with key "'+e+'"');return this.options[e]},e}();t.OptionsService=c},8343:(e,t)=>{function r(e,t,r){t.di$target===t?t.di$dependencies.push({id:e,index:r}):(t.di$dependencies=[{id:e,index:r}],t.di$target=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.createDecorator=t.getServiceDependencies=t.serviceRegistry=void 0,t.serviceRegistry=new Map,t.getServiceDependencies=function(e){return e.di$dependencies||[]},t.createDecorator=function(e){if(t.serviceRegistry.has(e))return t.serviceRegistry.get(e);var i=function(e,t,n){if(3!==arguments.length)throw new Error("@IServiceName-decorator can only be used to decorate a parameter");r(i,e,n)};return i.toString=function(){return e},t.serviceRegistry.set(e,i),i}},2585:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.IUnicodeService=t.IOptionsService=t.ILogService=t.IInstantiationService=t.IDirtyRowService=t.ICharsetService=t.ICoreService=t.ICoreMouseService=t.IBufferService=void 0;var i=r(8343);t.IBufferService=i.createDecorator("BufferService"),t.ICoreMouseService=i.createDecorator("CoreMouseService"),t.ICoreService=i.createDecorator("CoreService"),t.ICharsetService=i.createDecorator("CharsetService"),t.IDirtyRowService=i.createDecorator("DirtyRowService"),t.IInstantiationService=i.createDecorator("InstantiationService"),t.ILogService=i.createDecorator("LogService"),t.IOptionsService=i.createDecorator("OptionsService"),t.IUnicodeService=i.createDecorator("UnicodeService")},1480:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.UnicodeService=void 0;var i=r(8460),n=r(225),o=function(){function e(){this._providers=Object.create(null),this._active="",this._onChange=new i.EventEmitter;var e=new n.UnicodeV6;this.register(e),this._active=e.version,this._activeProvider=e}return Object.defineProperty(e.prototype,"onChange",{get:function(){return this._onChange.event},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"versions",{get:function(){return Object.keys(this._providers)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"activeVersion",{get:function(){return this._active},set:function(e){if(!this._providers[e])throw new Error('unknown Unicode version "'+e+'"');this._active=e,this._activeProvider=this._providers[e],this._onChange.fire(e)},enumerable:!1,configurable:!0}),e.prototype.register=function(e){this._providers[e.version]=e},e.prototype.wcwidth=function(e){return this._activeProvider.wcwidth(e)},e.prototype.getStringCellWidth=function(e){for(var t=0,r=e.length,i=0;i<r;++i){var n=e.charCodeAt(i);if(55296<=n&&n<=56319){if(++i>=r)return t+this.wcwidth(n);var o=e.charCodeAt(i);56320<=o&&o<=57343?n=1024*(n-55296)+o-56320+65536:t+=this.wcwidth(o)}t+=this.wcwidth(n)}return t},e}();t.UnicodeService=o}},t={};return function r(i){if(t[i])return t[i].exports;var n=t[i]={exports:{}};return e[i].call(n.exports,n,n.exports,r),n.exports}(4389)})()}));
//# sourceMappingURL=xterm.js.map

/***/ }),

/***/ "./node_modules/yallist/iterator.js":
/*!******************************************!*\
  !*** ./node_modules/yallist/iterator.js ***!
  \******************************************/
/***/ ((module) => {

"use strict";

module.exports = function (Yallist) {
  Yallist.prototype[Symbol.iterator] = function* () {
    for (let walker = this.head; walker; walker = walker.next) {
      yield walker.value
    }
  }
}


/***/ }),

/***/ "./node_modules/yallist/yallist.js":
/*!*****************************************!*\
  !*** ./node_modules/yallist/yallist.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = Yallist

Yallist.Node = Node
Yallist.create = Yallist

function Yallist (list) {
  var self = this
  if (!(self instanceof Yallist)) {
    self = new Yallist()
  }

  self.tail = null
  self.head = null
  self.length = 0

  if (list && typeof list.forEach === 'function') {
    list.forEach(function (item) {
      self.push(item)
    })
  } else if (arguments.length > 0) {
    for (var i = 0, l = arguments.length; i < l; i++) {
      self.push(arguments[i])
    }
  }

  return self
}

Yallist.prototype.removeNode = function (node) {
  if (node.list !== this) {
    throw new Error('removing node which does not belong to this list')
  }

  var next = node.next
  var prev = node.prev

  if (next) {
    next.prev = prev
  }

  if (prev) {
    prev.next = next
  }

  if (node === this.head) {
    this.head = next
  }
  if (node === this.tail) {
    this.tail = prev
  }

  node.list.length--
  node.next = null
  node.prev = null
  node.list = null

  return next
}

Yallist.prototype.unshiftNode = function (node) {
  if (node === this.head) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var head = this.head
  node.list = this
  node.next = head
  if (head) {
    head.prev = node
  }

  this.head = node
  if (!this.tail) {
    this.tail = node
  }
  this.length++
}

Yallist.prototype.pushNode = function (node) {
  if (node === this.tail) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var tail = this.tail
  node.list = this
  node.prev = tail
  if (tail) {
    tail.next = node
  }

  this.tail = node
  if (!this.head) {
    this.head = node
  }
  this.length++
}

Yallist.prototype.push = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    push(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.unshift = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    unshift(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.pop = function () {
  if (!this.tail) {
    return undefined
  }

  var res = this.tail.value
  this.tail = this.tail.prev
  if (this.tail) {
    this.tail.next = null
  } else {
    this.head = null
  }
  this.length--
  return res
}

Yallist.prototype.shift = function () {
  if (!this.head) {
    return undefined
  }

  var res = this.head.value
  this.head = this.head.next
  if (this.head) {
    this.head.prev = null
  } else {
    this.tail = null
  }
  this.length--
  return res
}

Yallist.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.head, i = 0; walker !== null; i++) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.next
  }
}

Yallist.prototype.forEachReverse = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.prev
  }
}

Yallist.prototype.get = function (n) {
  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.next
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.getReverse = function (n) {
  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.prev
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.map = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.head; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.next
  }
  return res
}

Yallist.prototype.mapReverse = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.tail; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.prev
  }
  return res
}

Yallist.prototype.reduce = function (fn, initial) {
  var acc
  var walker = this.head
  if (arguments.length > 1) {
    acc = initial
  } else if (this.head) {
    walker = this.head.next
    acc = this.head.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = 0; walker !== null; i++) {
    acc = fn(acc, walker.value, i)
    walker = walker.next
  }

  return acc
}

Yallist.prototype.reduceReverse = function (fn, initial) {
  var acc
  var walker = this.tail
  if (arguments.length > 1) {
    acc = initial
  } else if (this.tail) {
    walker = this.tail.prev
    acc = this.tail.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = this.length - 1; walker !== null; i--) {
    acc = fn(acc, walker.value, i)
    walker = walker.prev
  }

  return acc
}

Yallist.prototype.toArray = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.head; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.next
  }
  return arr
}

Yallist.prototype.toArrayReverse = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.tail; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.prev
  }
  return arr
}

Yallist.prototype.slice = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
    walker = walker.next
  }
  for (; walker !== null && i < to; i++, walker = walker.next) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.sliceReverse = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
    walker = walker.prev
  }
  for (; walker !== null && i > from; i--, walker = walker.prev) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.splice = function (start, deleteCount, ...nodes) {
  if (start > this.length) {
    start = this.length - 1
  }
  if (start < 0) {
    start = this.length + start;
  }

  for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
    walker = walker.next
  }

  var ret = []
  for (var i = 0; walker && i < deleteCount; i++) {
    ret.push(walker.value)
    walker = this.removeNode(walker)
  }
  if (walker === null) {
    walker = this.tail
  }

  if (walker !== this.head && walker !== this.tail) {
    walker = walker.prev
  }

  for (var i = 0; i < nodes.length; i++) {
    walker = insert(this, walker, nodes[i])
  }
  return ret;
}

Yallist.prototype.reverse = function () {
  var head = this.head
  var tail = this.tail
  for (var walker = head; walker !== null; walker = walker.prev) {
    var p = walker.prev
    walker.prev = walker.next
    walker.next = p
  }
  this.head = tail
  this.tail = head
  return this
}

function insert (self, node, value) {
  var inserted = node === self.head ?
    new Node(value, null, node, self) :
    new Node(value, node, node.next, self)

  if (inserted.next === null) {
    self.tail = inserted
  }
  if (inserted.prev === null) {
    self.head = inserted
  }

  self.length++

  return inserted
}

function push (self, item) {
  self.tail = new Node(item, self.tail, null, self)
  if (!self.head) {
    self.head = self.tail
  }
  self.length++
}

function unshift (self, item) {
  self.head = new Node(item, null, self.head, self)
  if (!self.tail) {
    self.tail = self.head
  }
  self.length++
}

function Node (value, prev, next, list) {
  if (!(this instanceof Node)) {
    return new Node(value, prev, next, list)
  }

  this.list = list
  this.value = value

  if (prev) {
    prev.next = this
    this.prev = prev
  } else {
    this.prev = null
  }

  if (next) {
    next.prev = this
    this.next = next
  } else {
    this.next = null
  }
}

try {
  // add if support for Symbol.iterator is present
  __webpack_require__(/*! ./iterator.js */ "./node_modules/yallist/iterator.js")(Yallist)
} catch (er) {}


/***/ }),

/***/ "?3854":
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?651b":
/*!********************!*\
  !*** os (ignored) ***!
  \********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?847c":
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?aaef":
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?a202":
/*!********************!*\
  !*** os (ignored) ***!
  \********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?34bb":
/*!**********************!*\
  !*** path (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?c2fa":
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?4aa2":
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?f29b":
/*!************************!*\
  !*** stream (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
/*!************************!*\
  !*** ./demo/client.ts ***!
  \************************/

/**
 * Copyright (c) 2018 The xterm.js authors. All rights reserved.
 * @license MIT
 *
 * This file is the entry point for browserify.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/// <reference path="../typings/xterm.d.ts"/>
// Use tsc version (yarn watch)
const xterm_1 = __webpack_require__(/*! xterm */ "./node_modules/xterm/lib/xterm.js");
const xterm_addon_attach_1 = __webpack_require__(/*! xterm-addon-attach */ "./node_modules/xterm-addon-attach/lib/xterm-addon-attach.js");
const xterm_addon_fit_1 = __webpack_require__(/*! xterm-addon-fit */ "./node_modules/xterm-addon-fit/lib/xterm-addon-fit.js");
const xterm_addon_search_1 = __webpack_require__(/*! xterm-addon-search */ "./node_modules/xterm-addon-search/lib/xterm-addon-search.js");
const xterm_addon_serialize_1 = __webpack_require__(/*! xterm-addon-serialize */ "./node_modules/xterm-addon-serialize/lib/xterm-addon-serialize.js");
const xterm_addon_web_links_1 = __webpack_require__(/*! xterm-addon-web-links */ "./node_modules/xterm-addon-web-links/lib/xterm-addon-web-links.js");
const xterm_addon_webgl_1 = __webpack_require__(/*! xterm-addon-webgl */ "./node_modules/xterm-addon-webgl/lib/xterm-addon-webgl.js");
const xterm_addon_unicode11_1 = __webpack_require__(/*! xterm-addon-unicode11 */ "./node_modules/xterm-addon-unicode11/lib/xterm-addon-unicode11.js");
const xterm_addon_ligatures_1 = __webpack_require__(/*! xterm-addon-ligatures */ "./node_modules/xterm-addon-ligatures/lib/xterm-addon-ligatures.js");
let term;
let protocol;
let socketURL;
let socket;
let pid;
const addons = {
    attach: { name: 'attach', ctor: xterm_addon_attach_1.AttachAddon, canChange: false },
    fit: { name: 'fit', ctor: xterm_addon_fit_1.FitAddon, canChange: false },
    search: { name: 'search', ctor: xterm_addon_search_1.SearchAddon, canChange: true },
    serialize: { name: 'serialize', ctor: xterm_addon_serialize_1.SerializeAddon, canChange: true },
    'web-links': { name: 'web-links', ctor: xterm_addon_web_links_1.WebLinksAddon, canChange: true },
    webgl: { name: 'webgl', ctor: xterm_addon_webgl_1.WebglAddon, canChange: true },
    unicode11: { name: 'unicode11', ctor: xterm_addon_unicode11_1.Unicode11Addon, canChange: true },
    ligatures: { name: 'ligatures', ctor: xterm_addon_ligatures_1.LigaturesAddon, canChange: true }
};
const terminalContainer = document.getElementById('terminal-container');
const actionElements = {
    findNext: document.querySelector('#find-next'),
    findPrevious: document.querySelector('#find-previous')
};
const paddingElement = document.getElementById('padding');
function setPadding() {
    term.element.style.padding = parseInt(paddingElement.value, 10).toString() + 'px';
    addons.fit.instance.fit();
}
function getSearchOptions(e) {
    return {
        regex: document.getElementById('regex').checked,
        wholeWord: document.getElementById('whole-word').checked,
        caseSensitive: document.getElementById('case-sensitive').checked,
        incremental: e.key !== `Enter`
    };
}
const disposeRecreateButtonHandler = () => {
    // If the terminal exists dispose of it, otherwise recreate it
    if (term) {
        term.dispose();
        term = null;
        window.term = null;
        socket = null;
        addons.attach.instance = undefined;
        addons.fit.instance = undefined;
        addons.search.instance = undefined;
        addons.serialize.instance = undefined;
        addons.unicode11.instance = undefined;
        addons.ligatures.instance = undefined;
        addons['web-links'].instance = undefined;
        addons.webgl.instance = undefined;
        document.getElementById('dispose').innerHTML = 'Recreate Terminal';
    }
    else {
        createTerminal();
        document.getElementById('dispose').innerHTML = 'Dispose terminal';
    }
};
if (document.location.pathname === '/test') {
    window.Terminal = xterm_1.Terminal;
    window.AttachAddon = xterm_addon_attach_1.AttachAddon;
    window.FitAddon = xterm_addon_fit_1.FitAddon;
    window.SearchAddon = xterm_addon_search_1.SearchAddon;
    window.SerializeAddon = xterm_addon_serialize_1.SerializeAddon;
    window.Unicode11Addon = xterm_addon_unicode11_1.Unicode11Addon;
    window.LigaturesAddon = xterm_addon_ligatures_1.LigaturesAddon;
    window.WebLinksAddon = xterm_addon_web_links_1.WebLinksAddon;
    window.WebglAddon = xterm_addon_webgl_1.WebglAddon;
}
else {
    createTerminal();
    document.getElementById('dispose').addEventListener('click', disposeRecreateButtonHandler);
    document.getElementById('serialize').addEventListener('click', serializeButtonHandler);
}
function createTerminal() {
    // Clean terminal
    while (terminalContainer.children.length) {
        terminalContainer.removeChild(terminalContainer.children[0]);
    }
    const isWindows = ['Windows', 'Win16', 'Win32', 'WinCE'].indexOf(navigator.platform) >= 0;
    term = new xterm_1.Terminal({
        windowsMode: isWindows,
        fontFamily: 'Fira Code, courier-new, courier, monospace'
    });
    // Load addons
    const typedTerm = term;
    addons.search.instance = new xterm_addon_search_1.SearchAddon();
    addons.serialize.instance = new xterm_addon_serialize_1.SerializeAddon();
    addons.fit.instance = new xterm_addon_fit_1.FitAddon();
    addons.unicode11.instance = new xterm_addon_unicode11_1.Unicode11Addon();
    // TODO: Remove arguments when link provider API is the default
    addons['web-links'].instance = new xterm_addon_web_links_1.WebLinksAddon(undefined, undefined, true);
    typedTerm.loadAddon(addons.fit.instance);
    typedTerm.loadAddon(addons.search.instance);
    typedTerm.loadAddon(addons.serialize.instance);
    typedTerm.loadAddon(addons.unicode11.instance);
    typedTerm.loadAddon(addons['web-links'].instance);
    window.term = term; // Expose `term` to window for debugging purposes
    term.onResize((size) => {
        if (!pid) {
            return;
        }
        const cols = size.cols;
        const rows = size.rows;
        const url = '/terminals/' + pid + '/size?cols=' + cols + '&rows=' + rows;
        fetch(url, { method: 'POST' });
    });
    protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';
    socketURL = protocol + location.hostname + ((location.port) ? (':' + location.port) : '') + '/terminals/';
    term.open(terminalContainer);
    addons.fit.instance.fit();
    term.focus();
    addDomListener(paddingElement, 'change', setPadding);
    addDomListener(actionElements.findNext, 'keyup', (e) => {
        addons.search.instance.findNext(actionElements.findNext.value, getSearchOptions(e));
    });
    addDomListener(actionElements.findPrevious, 'keyup', (e) => {
        addons.search.instance.findPrevious(actionElements.findPrevious.value, getSearchOptions(e));
    });
    // fit is called within a setTimeout, cols and rows need this.
    setTimeout(() => {
        initOptions(term);
        // TODO: Clean this up, opt-cols/rows doesn't exist anymore
        document.getElementById(`opt-cols`).value = term.cols;
        document.getElementById(`opt-rows`).value = term.rows;
        paddingElement.value = '0';
        // Set terminal size again to set the specific dimensions on the demo
        updateTerminalSize();
        fetch('/terminals?cols=' + term.cols + '&rows=' + term.rows, { method: 'POST' }).then((res) => {
            res.text().then((processId) => {
                pid = processId;
                socketURL += processId;
                socket = new WebSocket(socketURL);
                socket.onopen = runRealTerminal;
                socket.onclose = runFakeTerminal;
                socket.onerror = runFakeTerminal;
            });
        });
    }, 0);
}
function runRealTerminal() {
    addons.attach.instance = new xterm_addon_attach_1.AttachAddon(socket);
    term.loadAddon(addons.attach.instance);
    term._initialized = true;
    initAddons(term);
}
function runFakeTerminal() {
    if (term._initialized) {
        return;
    }
    term._initialized = true;
    initAddons(term);
    term.prompt = () => {
        term.write('\r\n$ ');
    };
    term.writeln('Welcome to xterm.js');
    term.writeln('This is a local terminal emulation, without a real terminal in the back-end.');
    term.writeln('Type some keys and commands to play around.');
    term.writeln('');
    term.prompt();
    term.onKey((e) => {
        const ev = e.domEvent;
        const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
        if (ev.keyCode === 13) {
            term.prompt();
        }
        else if (ev.keyCode === 8) {
            // Do not delete the prompt
            if (term._core.buffer.x > 2) {
                term.write('\b \b');
            }
        }
        else if (printable) {
            term.write(e.key);
        }
    });
}
function initOptions(term) {
    const blacklistedOptions = [
        // Internal only options
        'cancelEvents',
        'convertEol',
        'termName',
        // Complex option
        'theme',
        'windowOptions'
    ];
    const stringOptions = {
        bellSound: null,
        bellStyle: ['none', 'sound'],
        cursorStyle: ['block', 'underline', 'bar'],
        fastScrollModifier: ['alt', 'ctrl', 'shift', undefined],
        fontFamily: null,
        fontWeight: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
        fontWeightBold: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
        logLevel: ['debug', 'info', 'warn', 'error', 'off'],
        rendererType: ['dom', 'canvas'],
        wordSeparator: null
    };
    const options = Object.keys(term._core.options);
    const booleanOptions = [];
    const numberOptions = [];
    options.filter(o => blacklistedOptions.indexOf(o) === -1).forEach(o => {
        switch (typeof term.getOption(o)) {
            case 'boolean':
                booleanOptions.push(o);
                break;
            case 'number':
                numberOptions.push(o);
                break;
            default:
                if (Object.keys(stringOptions).indexOf(o) === -1) {
                    console.warn(`Unrecognized option: "${o}"`);
                }
        }
    });
    let html = '';
    html += '<div class="option-group">';
    booleanOptions.forEach(o => {
        html += `<div class="option"><label><input id="opt-${o}" type="checkbox" ${term.getOption(o) ? 'checked' : ''}/> ${o}</label></div>`;
    });
    html += '</div><div class="option-group">';
    numberOptions.forEach(o => {
        html += `<div class="option"><label>${o} <input id="opt-${o}" type="number" value="${term.getOption(o)}" step="${o === 'lineHeight' || o === 'scrollSensitivity' ? '0.1' : '1'}"/></label></div>`;
    });
    html += '</div><div class="option-group">';
    Object.keys(stringOptions).forEach(o => {
        if (stringOptions[o]) {
            html += `<div class="option"><label>${o} <select id="opt-${o}">${stringOptions[o].map(v => `<option ${term.getOption(o) === v ? 'selected' : ''}>${v}</option>`).join('')}</select></label></div>`;
        }
        else {
            html += `<div class="option"><label>${o} <input id="opt-${o}" type="text" value="${term.getOption(o)}"/></label></div>`;
        }
    });
    html += '</div>';
    const container = document.getElementById('options-container');
    container.innerHTML = html;
    // Attach listeners
    booleanOptions.forEach(o => {
        const input = document.getElementById(`opt-${o}`);
        addDomListener(input, 'change', () => {
            console.log('change', o, input.checked);
            term.setOption(o, input.checked);
        });
    });
    numberOptions.forEach(o => {
        const input = document.getElementById(`opt-${o}`);
        addDomListener(input, 'change', () => {
            console.log('change', o, input.value);
            if (o === 'cols' || o === 'rows') {
                updateTerminalSize();
            }
            else if (o === 'lineHeight' || o === 'scrollSensitivity') {
                term.setOption(o, parseFloat(input.value));
                updateTerminalSize();
            }
            else {
                term.setOption(o, parseInt(input.value));
            }
        });
    });
    Object.keys(stringOptions).forEach(o => {
        const input = document.getElementById(`opt-${o}`);
        addDomListener(input, 'change', () => {
            console.log('change', o, input.value);
            term.setOption(o, input.value);
        });
    });
}
function initAddons(term) {
    const fragment = document.createDocumentFragment();
    Object.keys(addons).forEach((name) => {
        const addon = addons[name];
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = !!addon.instance;
        if (!addon.canChange) {
            checkbox.disabled = true;
        }
        addDomListener(checkbox, 'change', () => {
            if (checkbox.checked) {
                addon.instance = new addon.ctor();
                term.loadAddon(addon.instance);
                if (name === 'webgl') {
                    setTimeout(() => {
                        document.body.appendChild(addon.instance.textureAtlas);
                    }, 0);
                }
            }
            else {
                if (name === 'webgl') {
                    document.body.removeChild(addon.instance.textureAtlas);
                }
                addon.instance.dispose();
                addon.instance = undefined;
            }
        });
        const label = document.createElement('label');
        label.classList.add('addon');
        if (!addon.canChange) {
            label.title = 'This addon is needed for the demo to operate';
        }
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(name));
        const wrapper = document.createElement('div');
        wrapper.classList.add('addon');
        wrapper.appendChild(label);
        fragment.appendChild(wrapper);
    });
    const container = document.getElementById('addons-container');
    container.innerHTML = '';
    container.appendChild(fragment);
}
function addDomListener(element, type, handler) {
    element.addEventListener(type, handler);
    term._core.register({ dispose: () => element.removeEventListener(type, handler) });
}
function updateTerminalSize() {
    const cols = parseInt(document.getElementById(`opt-cols`).value, 10);
    const rows = parseInt(document.getElementById(`opt-rows`).value, 10);
    const width = (cols * term._core._renderService.dimensions.actualCellWidth + term._core.viewport.scrollBarWidth).toString() + 'px';
    const height = (rows * term._core._renderService.dimensions.actualCellHeight).toString() + 'px';
    terminalContainer.style.width = width;
    terminalContainer.style.height = height;
    addons.fit.instance.fit();
}
function serializeButtonHandler() {
    const output = addons.serialize.instance.serialize();
    const outputString = JSON.stringify(output);
    document.getElementById('serialize-output').innerText = outputString;
    if (document.getElementById('write-to-terminal').checked) {
        term.reset();
        term.write(output);
    }
}

})();

/******/ })()
;