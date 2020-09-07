'use strict';

const qtLib = require('qtools-functional-library');
const path=require('path');

//START OF moduleFunction() ============================================================

const moduleFunction = function(args = {}) {

	
	return (message='')=>{
	
	const tmp=qtLib.callerName(true);
	

	`${message} [${path.basename(tmp)}]`.qtDump({});
	}
	
};

//END OF moduleFunction() ============================================================

module.exports = args => new moduleFunction(args);

