'use strict';

const qtLib = require('qtools-functional-library');
const asynchronousPipe = new require('asynchronous-pipe-plus')();
const fs = require('fs');

//START OF moduleFunction() ============================================================

const moduleFunction = function({ retrieverConfig = {} } = {}) {
	// ..../code/startAll.js --type=twilio-text --message=TQ's+New+Trans+Messenger+says:+HELLO' --phoneNumbers=7087630100

	//for command line there is no module config beyond it's path

	const getMessages = () => {
		 
		if (retrieverConfig.filePathSource == 'config') {
			return JSON.parse(
				fs.readFileSync(retrieverConfig.messageFilePath).toString()
			);
		} else if (retrieverConfig.filePathSource == 'commandLine') {
			const commandLineParameters = retrieverConfig.commandLineParameters;
			commandLineParameters.qtDump({ label: 'commandLineParameters' });
		} else {
			throw `filePathSource must be either 'config' or 'commandLine'`;
		}
	};
	
	return { getMessages };
};

//END OF moduleFunction() ============================================================

module.exports = args => new moduleFunction(args);
