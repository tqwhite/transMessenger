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
	
	const executeSequence = require(path.join(
		codeRoot,
		'/lib/utilities/executor-construction-tools'
	))({
		commandLineParameters,
		systemConfig,
		jobConfig,
		codeRoot
	}).constructMainExecutorProcess;
	
	const pollingIntervalSeconds = jobConfig.qtGetSurePath(
		'parameters.pollingIntervalSeconds',
		30
	);
	
	
	const operateSequence = (({
		executeSequence,
		workerSpecificMessageExtractor,
		commandLineParameters,
		messageProcessObjectGen,
		pollingIntervalSeconds
	}) => requestObject => {
		workerSpecificMessageExtractor.getMessages(
			requestObject,
			(err = '', messages) => {
				if (err) {
					err.toString().qtDump({ label: 'err' });
				}
				const messageProcessObject = messageProcessObjectGen({ messages });
				executeSequence(messageProcessObject, (err, result) => {
//console.log(`\n=-=============   setTimeout TURNED OFF ========================= [timer-loop.js.moduleFunction]\n`);


				setTimeout(operateSequence, pollingIntervalSeconds * 1000, requestObject);
				});
			}
		);
	})({
		executeSequence,
		workerSpecificMessageExtractor,
		commandLineParameters,
		messageProcessObjectGen,
		pollingIntervalSeconds
	});
	
	//INITIALIZE ============================================================
	
	const requestObject = {hello:'GOODBYE:'}; //this would come from a web request in some other situation
	operateSequence(requestObject);
	
	
	
};

//END OF moduleFunction() ============================================================

module.exports = args => new moduleFunction(args);

