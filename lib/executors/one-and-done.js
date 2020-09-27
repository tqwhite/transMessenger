'use strict';

const qtLib = require('qtools-functional-library');
const asynchronousPipe = new require('asynchronous-pipe-plus')();
const path = require('path');

//START OF moduleFunction() ============================================================

const moduleFunction = function({
	commandLineParameters,
	systemConfig,
	worker,
	codeRoot,
	messageProcessObjectGen
} = {}) {
	const { configName } = worker;

	const config = systemConfig.getElement(configName)('.');
	const { _log: qlog, sequence, retriever } = config;
	
	//LOCAL FUNCTIONS ============================================================
	
	const workerSpecificMessageExtractor = systemConfig.makeRetriever(retriever, codeRoot);
	
	//MAIN PROCESS SEQUENCE ============================================================

	const runProcess = messageProcessObject => {
		const pipeRunner = asynchronousPipe.asynchronousPipe;
		const taskList = asynchronousPipe.taskListPlus();

		const messages = messageProcessObject.getMessages();

		sequence.forEach(item => {
			
			const moduleConfig = systemConfig.getElement(item.processRefId)('.').qtMerge(worker.qtGetSurePath('parameters', {}));

			const module = require(path.join(codeRoot, moduleConfig.modulePath))({
				commandLineParameters,
				systemConfig,
				moduleConfig,
				codeRoot
			});

			taskList.push((messageProcessObject, next) => {
				const localCallback = (err, result) => {
					next('', result);
				};
				module.action(messageProcessObject, localCallback);
			});
		});

		const initialData = messageProcessObject;
		pipeRunner(taskList.getList(), initialData, (err, messageProcessObject) => {
			//command-line has exited with quitter
		});
	};

	const requestObject = commandLineParameters;
	
	const messages = workerSpecificMessageExtractor.getMessages(requestObject);


	const messageProcessObject = messageProcessObjectGen({ messages });

	if (messageProcessObject.messagesReady()) {
		runProcess(messageProcessObject);
	}
};

//END OF moduleFunction() ============================================================

module.exports = args => new moduleFunction(args);

