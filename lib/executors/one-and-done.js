'use strict';

const qtLib = require('qtools-functional-library');
const asynchronousPipe = new require('asynchronous-pipe-plus')();
const path = require('path');

//START OF moduleFunction() ============================================================

const moduleFunction = function({
	commandLineParameters,
	systemConfig,
	jobConfig,
	codeRoot,
	messageProcessObjectGen
} = {}) {
	const { configName } = jobConfig;
	const config = systemConfig.getElement(configName)('.');
	const { _log: qlog, sequence, retriever:retrieverFileName } = config;
	
	//LOCAL FUNCTIONS ============================================================
	
	const workerSpecificMessageExtractor = systemConfig.makeRetriever(
		retrieverFileName,
		codeRoot,
		jobConfig
	);
	
	//MAIN PROCESS SEQUENCE ============================================================
	const requestObject = commandLineParameters;
	
	const messages = workerSpecificMessageExtractor.getMessages(requestObject);
	
	const messageProcessObject = messageProcessObjectGen({ messages });

	if (messageProcessObject.messagesReady()) {
		require(path.join(codeRoot, '/lib/utilities/executor-construction-tools'))({
			commandLineParameters,
			systemConfig,
			jobConfig,
			codeRoot
		}).constructMainExecutorProcess(messageProcessObject);
	}
};

//END OF moduleFunction() ============================================================

module.exports = args => new moduleFunction(args);

