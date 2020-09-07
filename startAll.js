'use strict';

console.clear();
console.log(
	`\n=-=============   console.clear()()  ========================= [startAll.js.]\n`
);

const qtLib = require('qtools-functional-library');
const asynchronousPipe = new require('asynchronous-pipe-plus')();

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

	const config = systemConfig.getElement(module);
	const { log } = config;
	const { type = [] } = commandLineParameters.values;
	
	const messageSender = require('./lib/senders/twilio-text')({
		systemConfig
	});

	if (type.qtPop() == 'twilio-text') {
		const pipeRunner = asynchronousPipe.asynchronousPipe;
		const taskList = asynchronousPipe.taskListPlus();

		taskList.push((args, next) => {
			messageSender.sendMessageList(
				commandLineParameters.values,
				(err, sendersResult) => {
					next(err, { ...args, sendersResult });
				}
			);
		});
		const initialData = {};
		pipeRunner(taskList.getList(), initialData, (err, args) => {
			const { sendersResult } = args;
			const { sentStatus, errorList, processList } = sendersResult;

			if (err) {
				log(
					`ERRORS OCCURRED: \n\t${errorList.map(item => item.err).join('\n\t')}`
				);
			}
			log(sentStatus);
		});
	} else {
		//start loop
		//start web interface
		log('no messages sent yet');
	}
	
};

//END OF moduleFunction() ============================================================

moduleFunction({ commandLineParameters, systemConfig });

