'use strict';

const qtLib = require('qtools-functional-library');
const path=require('path');

//START OF moduleFunction() ============================================================

const moduleFunction = function(args = {}) {
	const { commandLineParameters, systemConfig } = args;
	const config = systemConfig.getElement(module)('.');
	const { _log: qlog} = config;
	

	
	const action=(messageProcessObject, next)=>{


	qlog(messageProcessObject)
	qlog('quitter: all done');
	next('', messageProcessObject)
	}
	
	return {action}
	
};

//END OF moduleFunction() ============================================================

module.exports = args => new moduleFunction(args);

