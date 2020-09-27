'use strict';

console.clear();
console.log(
	`\n=-=============   console.clear()()  ========================= [startAll.js.]\n`
);



const qtLib = require('qtools-functional-library');
const path = require('path');
const messageProcessObjectGen=require('./lib/message-process-object');

//INITIAL PARAMETERS ============================================================

const commandLineParser = require('qtools-parse-command-line');
const commandLineParameters = commandLineParser.getParameters();

const systemConfig = require('./lib/config-initializer.js')({
	commandLineParameters,
	environment: process.env
});

systemConfig ||
	console.error(`ERROR: No config file found. Quitting`) ||
	process.exit(1);

//START OF moduleFunction() ============================================================

var moduleFunction = function(args) {
	const { commandLineParameters, systemConfig } = args;
	const config = systemConfig.getElement(module)('.');

	const { _log: qlog, jobInstances, components } = config;

	const codeRoot = path.dirname(module.filename);


//MAIN FUNCTION ============================================================

	const buildWorker = (({
		commandLineParameters,
		systemConfig,
		codeRoot
	}) => jobConfig => {
	
		const workerDefinition=systemConfig.getElement(jobConfig.configName)('.')
	
		require(path.join(codeRoot, workerDefinition.executor))({
			commandLineParameters,
			systemConfig,
			jobConfig,
			codeRoot,
			messageProcessObjectGen
		});
	})({ commandLineParameters, systemConfig, codeRoot });
	
//initialization ============================================================


	jobInstances.forEach(buildWorker);
	
};

//END OF moduleFunction() ============================================================

moduleFunction({ commandLineParameters, systemConfig });

