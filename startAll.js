'use strict';
// const qtoolsGen = require('qtools');
// const qtools = new qtoolsGen(module, { updatePrototypes: true });

const qtLib = require('qtools-functional-library');
// const commandLineParser = require('qtools-parse-command-line');
// const commandLineParameters = commandLineParser.getParameters();

// const configFileProcessor = require('qtools-config-file-processor');


/*
ln -s /Users/tqwhite/node_modules/qtools-config-file-processor qtools-config-file-processor
ln -s /Users/tqwhite/node_modules/qtools-parse-command-line qtools-parse-command-line
ln -s /Users/tqwhite/node_modules/qtools-functional-library qtools-functional-library
NOTE: don't forget to update package.js dependendies for linked libraries
*/

console.log(__dirname);

//START OF moduleFunction() ============================================================

const moduleFunction = function(args={}) {

	const workingFunctionActual=localArgs=>operatingArgs=>{
	
		return "hello";
	
	}
	
	this.workingFunction=workingFunctionActual(Object.assign({}, args));

	return this;
};

//END OF moduleFunction() ============================================================

module.exports = moduleFunction;
//module.exports = new moduleFunction();

