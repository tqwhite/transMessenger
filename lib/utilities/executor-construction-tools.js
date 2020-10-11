'use strict';

const qtLib = require('qtools-functional-library');
const path=require('path');


const asynchronousPipe = new require('asynchronous-pipe-plus')();

//START OF moduleFunction() ============================================================

const moduleFunction = function({
	commandLineParameters,
	systemConfig,
	jobConfig,
	codeRoot
} = {}) {

	const { configName } = jobConfig;
	const config = systemConfig.getElement(configName)('.');
	const { _log: qlog, sequence, retriever } = config;

	const constructMainExecutorProcess = (messageProcessObject, callback) => {
		const pipeRunner = asynchronousPipe.asynchronousPipe;
		const taskList = asynchronousPipe.taskListPlus();

		const messages = messageProcessObject.getMessages();

		sequence.forEach(item => {
			
			const moduleConfig = systemConfig.getElement(item.processRefId)('.').qtMerge(jobConfig.qtGetSurePath('parameters', {}));

			const module = require(path.join(codeRoot, moduleConfig.modulePath))({
				commandLineParameters,
				jobConfig,
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
			if(typeof(callback)=='function'){
				callback(err, messageProcessObject);
			}
		});
	};
	
	return {constructMainExecutorProcess}
};

//END OF moduleFunction() ============================================================

module.exports=args=>new moduleFunction(args);

