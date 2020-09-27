'use strict';

const qtLib = require('qtools-functional-library');
const asynchronousPipe = new require('asynchronous-pipe-plus')();
const fs = require('fs');

//START OF moduleFunction() ============================================================

const moduleFunction = function({retrieverConfig, jobConfig, systemConfig}) {

	const getMessages = requestObject => {
		return JSON.parse(
			fs.readFileSync(retrieverConfig.messageFilePath).toString()
		);
	};
	
	return { getMessages };
};

//END OF moduleFunction() ============================================================

module.exports = args => new moduleFunction(args);
