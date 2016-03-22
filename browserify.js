// dOOdad - Object-oriented programming framework
// File: browserify.js - Module startup file for 'browserify'.
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

"use strict";

module.exports = {
	add: function add(DD_MODULES) {
		DD_MODULES = (DD_MODULES || {});
		DD_MODULES['doodad-js-unicode'] = {
			type: null,
			version: '0.3.0a',
			namespaces: null,
			dependencies: null,
			exports: module.exports,
			
			create: function create(root, /*optional*/_options) {
				var config = null;
				try {
					config = require('./dist/doodad-js-unicode/config.json');
				} catch(ex) {
				};
				
				var modules = {};
				
				require("./dist/doodad-js-unicode/Tools_Unicode.min.js").add(modules);
				
				return root.Doodad.Namespaces.loadNamespaces(modules, null, config, false);
			},
		};
		return DD_MODULES;
	},
};