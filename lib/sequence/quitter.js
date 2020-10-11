'use strict';

const qtLib = require('qtools-functional-library');
const path=require('path');

//START OF moduleFunction() ============================================================

const moduleFunction = function({
	commandLineParameters,
	systemConfig,
	jobConfig,
	codeRoot,
	messageProcessObjectGen
} = {}) {
	const config = systemConfig.getElement(module)('.');
	const { _log: qlog} = config;
	

	
	const action=(messageProcessObject, next)=>{


	qlog(messageProcessObject)
	qlog('QUITTER: all done');
	next('', messageProcessObject)
	}
	
	return {action}
	
};

//END OF moduleFunction() ============================================================

module.exports = args => new moduleFunction(args);

