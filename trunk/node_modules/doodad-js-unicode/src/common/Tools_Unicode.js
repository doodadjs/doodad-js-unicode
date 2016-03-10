//! REPLACE_BY("// Copyright 2016 Claude Petit, licensed under Apache License version 2.0\n")
// dOOdad - Object-oriented programming framework
// File: Tools_Unicode.js - Unicode Tools
// Project home: https://sourceforge.net/projects/doodad-js/
// Trunk: svn checkout svn://svn.code.sf.net/p/doodad-js/code/trunk doodad-js-code
// Author: Claude Petit, Quebec city
// Contact: doodadjs [at] gmail.com
// Note: I'm still in alpha-beta stage, so expect to find some bugs or incomplete parts !
// License: Apache V2
//
//	Copyright 2016 Claude Petit
//
//	Licensed under the Apache License, Version 2.0 (the "License");
//	you may not use this file except in compliance with the License.
//	You may obtain a copy of the License at
//
//		http://www.apache.org/licenses/LICENSE-2.0
//
//	Unless required by applicable law or agreed to in writing, software
//	distributed under the License is distributed on an "AS IS" BASIS,
//	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//	See the License for the specific language governing permissions and
//	limitations under the License.
//! END_REPLACE()

(function() {
	var global = this;
	
	var exports = {};
	if (typeof process === 'object') {
		module.exports = exports;
	};
	
	exports.add = function add(DD_MODULES) {
		DD_MODULES = (DD_MODULES || {});
		DD_MODULES['Doodad.Tools.Unicode'] = {
			type: null,
			version: '0.1.0a',
			namespaces: null,
			dependencies: [
				{
					name: 'Doodad.Tools',
					version: '2.0.0',
				},
				{
					name: 'Doodad.Types',
					version: '2.0.0',
				},
			],
			exports: exports,
			
			create: function create(root, /*optional*/_options) {
				"use strict";

				//===================================
				// Get namespaces
				//===================================
					
				var doodad = root.Doodad,
					types = doodad.Types,
					tools = doodad.Tools,
					unicode = tools.Unicode;
					
				//===================================
				// Internal
				//===================================
					
				var __Internal__ = {
				};
				
				
				//===================================
				// Options
				//===================================
					
				//__Internal__.oldSetOptions = unicode.setOptions;
				//unicode.setOptions = function setOptions(/*paramarray*/) {
				//};
				
				//unicode.setOptions({
				//}, _options);
				

				//===================================
				// Native functions
				//===================================
					
				try {
					__Internal__.supportsCodePoint = (eval("'\\u{00010428}'") && true);
				} catch (ex) {
					__Internal__.supportsCodePoint = false;
				};
				
				var __Natives__ = {
					// "fromCodePoint"
					stringFromCharCode: String.fromCharCode,
					stringFromCodePoint: (__Internal__.supportsCodePoint && types.isNativeFunction(String.fromCodePoint) ? String.fromCodePoint : undefined),
					
					// "codePointAt"
					stringCharCodeAt: String.prototype.charCodeAt,
					stringCodePointAt: (__Internal__.supportsCodePoint && types.isNativeFunction(String.prototype.codePointAt) ? String.prototype.codePointAt : undefined),
				};
				
				if (!__Natives__.stringFromCodePoint || !__Natives__.stringCodePointAt) {
					// Native function may got busted.
					__Internal__.supportsCodePoint = false;
				};
				
				//===================================
				// Unicode 
				//===================================

				unicode.codePointToCharCodes = root.DD_DOC(
					//! REPLACE_BY("null")
					{
								author: "Claude Petit",
								revision: 0,
								params: {
									codePoint: {
										type: 'integer',
										optional: false,
										description: "Code point.",
									},
								},
								returns: 'object',
								description: "Returns code point surrogates.",
					}
					//! END_REPLACE()
					, (function codePointToCharCodes(codePoint) {
						// Source: http://www.2ality.com/2013/09/javascript-unicode.html

						if (codePoint < 0x10000) {
							return {
								leadSurrogate: codePoint, 
							};
						};
					
						codePoint -= 0x10000;
					
						// Shift right to get to most significant 10 bits
						var leadSurrogate = 0xD800 + (codePoint >> 10);
					
						// Mask to get least significant 10 bits
						var tailSurrogate = 0xDC00 + (codePoint & 0x03FF);
					
						return {
							leadSurrogate: leadSurrogate, 
							tailSurrogate: tailSurrogate,
						};
					}));

				unicode.charCodesToCodePoint = root.DD_DOC(
					//! REPLACE_BY("null")
					{
								author: "Claude Petit",
								revision: 0,
								params: {
									surrogates: {
										type: 'object',
										optional: false,
										description: "Surrogates.",
									},
								},
								returns: 'object',
								description: "Returns code point from surrogates.",
					}
					//! END_REPLACE()
					, function charCodesToCodePoint(surrogates) {
							var leadSurrogate = surrogates.leadSurrogate;
						
							if ((leadSurrogate < 0xD800) || (leadSurrogate > 0xDFFF)) {
								return {
									codePoint: leadSurrogate,
									size: 1,
									complete: true,
									valid: true,
								};
							};
					
							var tailSurrogate = surrogates.tailSurrogate;
					
							if (types.isNothing(tailSurrogate)) {
								// Incomplete UTF16 sequence
								return {
									codePoint: leadSurrogate,
									size: 2,
									complete: false,
									valid: false,
								};
							};
					
							if ((tailSurrogate < 0xDC00) || (tailSurrogate > 0xDFFF)) {
								// Invalid UTF16 sequence. Returns the lead surrogate.
								return {
									codePoint: leadSurrogate,
									size: 1,
									complete: true,
									valid: false,
								};
							};
					
							var codePoint = tailSurrogate - 0xDC00;
					
							codePoint += ((leadSurrogate - 0xD800) << 10);
					
							codePoint += 0x10000;
					
							return {
								codePoint: codePoint,
								size: 2,
								complete: true,
								valid: true,
							};
					});

				unicode.fromCodePoint = root.DD_DOC(
					//! REPLACE_BY("null")
					{
								author: "Claude Petit",
								revision: 1,
								params: {
									codePoint: {
										type: 'integer',
										optional: false,
										description: "Code point.",
									},
								},
								returns: 'string',
								description: "Returns string from an Unicode 'code point'.",
					}
					//! END_REPLACE()
					, (__Internal__.supportsCodePoint ? __Natives__.stringFromCodePoint : function fromCodePoint(codePoint) {
						var surrogates = unicode.codePointToCharCodes(codePoint);
					
						var chr = __Natives__.stringFromCharCode(surrogates.leadSurrogate);
						
						if (!types.isNothing(surrogates.tailSurrogate)) {
							chr += __Natives__.stringFromCharCode(surrogates.tailSurrogate);
						};
						
						return chr;
					}));

				unicode.codePointAt = root.DD_DOC(
					//! REPLACE_BY("null")
					{
								author: "Claude Petit",
								revision: 1,
								params: {
									str: {
										type: 'string',
										optional: false,
										description: "A string.",
									},
									index: {
										type: 'integer',
										optional: true,
										description: "Position. Default is '0'.",
									},
								},
								returns: 'array',
								description: "Returns an array of two items : The Unicode 'code point' from a string at the specified position, and the character's length.",
					}
					//! END_REPLACE()
					, (__Internal__.supportsCodePoint ?
						function codePointAt(str, /*optional*/index) {
							index = (index | 0);  // null|undefined|true|false|NaN|Infinity

							var codePoint = __Natives__.stringCodePointAt.call(str, index);
							
							if (codePoint === undefined) {
								// Invalid index
								return null;
							};
							
							if ((codePoint >= 0xD800) && (codePoint <= 0xDFFF)) {
								if ((index + 1) >= str.length) {
									// Incomplete UTF16 sequence.
									return {
										codePoint: codePoint,
										size: 2,
										complete: false,
										valid: false,
									};
								} else {
									// Invalid UTF16 sequence. Returns the lead surrogate.
									return {
										codePoint: codePoint,
										size: 1,
										complete: true,
										valid: false,
									};
								};
							} else {
								return {
									codePoint: codePoint,
									size: (codePoint >= 0x10000 ? 2 : 1),
									complete: true,
									valid: true,
								};
							};
							
						} : function codePointAt(str, /*optional*/index) {
							index = (index | 0);  // null|undefined|true|false|NaN|Infinity

							var leadSurrogate = __Natives__.stringCharCodeAt.call(str, index);

							if (types.isNaN(leadSurrogate)) {
								// Invalid index
								return null;
							};
							
							var tailSurrogate = __Natives__.stringCharCodeAt.call(str, index + 1);
							
							var surrogates = {
								leadSurrogate: leadSurrogate,
							};
							
							if (!types.isNaN(tailSurrogate)) {
								surrogates.tailSurrogate = tailSurrogate;
							};

							return unicode.charCodesToCodePoint(surrogates);
						}));

				unicode.charAt = root.DD_DOC(
					//! REPLACE_BY("null")
					{
								author: "Claude Petit",
								revision: 1,
								params: {
									str: {
										type: 'string',
										optional: false,
										description: "A string.",
									},
									index: {
										type: 'integer',
										optional: true,
										description: "Position. Default is 0.",
									},
								},
								returns: 'string',
								description: "Returns the complete Unicode character sequence from the specified position. Use its 'length' property to get its size.",
					}
					//! END_REPLACE()
					, function charAt(str, /*optional*/index) {
							index = (index | 0);  // null|undefined|true|false|NaN|Infinity

							var codePoint = types.codePointAt(str, index);
							
							if (types.isNothing(codePoint)) {
								// Invalid index
								return null;
							};
					
							if (!codePoint.valid) {
								// Incomplete or Invalid UTF16 sequence
								return "";
							};
							
							return str.slice(index, index + codePoint.size);
						});

				unicode.nextChar = root.DD_DOC(
					//! REPLACE_BY("null")
					{
								author: "Claude Petit",
								revision: 1,
								params: {
									str: {
										type: 'string',
										optional: false,
										description: "A string.",
									},
									start: {
										type: 'integer',
										optional: true,
										description: "Start position, inclusive. Default is 0.",
									},
									end: {
										type: 'integer',
										optional: true,
										description: "End position, exclusive. Default is string's length.",
									},
									seek: {
										type: 'integer',
										optional: true,
										description: "Seek to a new position. Exemple: unicode.nextChar('hello').nextChar().nextChar(3).nextChar().chr === 'o'",
									},
								},
								returns: 'object',
								description: "Returns an object with the next Unicode character sequence from the specified position and the 'nextChar' function with preset arguments.",
					}
					//! END_REPLACE()
					, function nextChar(str, /*optional*/start, /*optional*/end, /* <<< BIND */ /*optional*/seek) {
							if (types.isNothing(seek)) {
								start = (start | 0);  // null|undefined|true|false|NaN|Infinity
							} else {
								// Want to seek at new position
								start = (seek | 0);
							};
							if (types.isNothing(end)) {
								end = str.length;
							} else {
								end = (+end || 0);  // null|undefined|true|false|NaN|Infinity
							};
							if (start >= end) {
								// End position reached
								return null;
							};
							var codePoint = unicode.codePointAt(str, start);
							if (types.isNothing(codePoint)) {
								// Invalid index
								return null;
							};
							if (codePoint.complete && ((start + codePoint.size - 1) >= end)) {
								// End position reached
								return null;
							};
							var chr = str.slice(start, start + codePoint.size);
							return {
								index: start,
								codePoint: codePoint.codePoint,
								size: codePoint.size,
								chr: chr,
								complete: codePoint.complete,
								nextChar: types.bind(null, unicode.nextChar, [str, start + codePoint.size, end]),
							};
						});

				unicode.isClass = function isClass(className, chr, localeData) {
					var cls = localeData.LC_CTYPE.classes[className];
					if (!cls && (className === 'alnum')) {
						// NOTE: "alnum" is not in the database.
						return unicode.isClass('digit', chr, localeData) || unicode.isClass('alpha', chr, localeData);
					};
					if (!cls) {
						throw new types.Error("Unknow Unicode class '~0~'.", [className]);
					};
					return cls.regExp.test(chr);
				};

				unicode.isLower = function isLower(chr, localeData) {
					return unicode.isClass('lower', chr, localeData);
				};
				
				unicode.isUpper = function isUpper(chr, localeData) {
					return unicode.isClass('upper', chr, localeData);
				};
				
				unicode.isAlpha = function isAlpha(chr, localeData) {
					return unicode.isClass('alpha', chr, localeData);
				};
				
				unicode.isDigit = function isDigit(chr, localeData) {
					return unicode.isClass('digit', chr, localeData);
				};
				
				unicode.isAlnum = function isAlnum(chr, localeData) {
					return unicode.isClass('alnum', chr, localeData);
				};
				
				unicode.isHexDigit = function isHexDigit(chr, localeData) {
					return unicode.isClass('xdigit', chr, localeData);
				};
				
				unicode.isPunct = function isPunct(chr, localeData) {
					return unicode.isClass('punct', chr, localeData);
				};
				
				unicode.isSpace = function isSpace(chr, localeData) {
					return unicode.isClass('space', chr, localeData);
				};
				
				unicode.isBlank = function isBlank(chr, localeData) {
					return unicode.isClass('blank', chr, localeData);
				};
				
				unicode.isGraph = function isGraph(chr, localeData) {
					return unicode.isClass('graph', chr, localeData);
				};
				
				unicode.isPrint = function isPrint(chr, localeData) {
					return unicode.isClass('print', chr, localeData);
				};
				
				unicode.isCntrl = function isCntrl(chr, localeData) {
					return unicode.isClass('cntrl', chr, localeData);
				};
				
/*
// TODO: See if Javascript's "toLowerCase" and "toUpperCase" functions are equivalent (has the same mappings)
Function: wint_t towlower (wint_t wc)
Function: wint_t towupper (wint_t wc)

*/

				//===================================
				// Init
				//===================================
				//return function init(/*optional*/options) {
				//};
			},
		};
		
		return DD_MODULES;
	};
	
	if (typeof process !== 'object') {
		// <PRB> export/import are not yet supported in browsers
		global.DD_MODULES = exports.add(global.DD_MODULES);
	};
}).call((typeof global !== 'undefined') ? global : ((typeof window !== 'undefined') ? window : this));