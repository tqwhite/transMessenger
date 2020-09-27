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
	const { _log: qlog, sequence, retriever: retrieverFileName } = config;
	
	//LOCAL FUNCTIONS ============================================================
	
	const workerSpecificMessageExtractor = systemConfig.makeRetriever(
		retrieverFileName,
		codeRoot
	);
	
	//MAIN PROCESS SEQUENCE ============================================================


const pollingIntervalSeconds=jobConfig.qtGetSurePath('parameters.pollingIntervalSeconds', 30);

	setInterval(() => {
		const requestObject = commandLineParameters;
		
		const messages = workerSpecificMessageExtractor.getMessages(requestObject);
		
		const messageProcessObject = messageProcessObjectGen({ messages });

		if (messageProcessObject.messagesReady()) {
			require(path.join(
				codeRoot,
				'/lib/utilities/executor-construction-tools'
			))({
				commandLineParameters,
				systemConfig,
				jobConfig,
				codeRoot
			}).constructMainExecutorProcess(messageProcessObject);
		}
	}, pollingIntervalSeconds*1000);
};

//END OF moduleFunction() ============================================================

module.exports = args => new moduleFunction(args);

