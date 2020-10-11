'use strict';

const qtLib = require('qtools-functional-library');
const asynchronousPipe = new require('asynchronous-pipe-plus')();

//START OF moduleFunction() ============================================================

const moduleFunction = function({retrieverConfig, jobConfig, systemConfig}) {

// ..../code/startAll.js --type=text --message=TQ's+New+Trans+Messenger+says:+HELLO' --phoneNumbers=7087630100

//for command line there is no module config beyond it's path


const getMessages=requestObject=> {


requestObject.values.qtDump({label:"requestObject.values"});

const {type:types=[], message:messages=[], phoneNumbers=[]}=requestObject.values;


const type=types.qtPop();
const message=messages.qtPop();
const number=phoneNumbers.qtPop();

return [	{
		"message": [
			message
		],
		"recipients": [
			{
				"type": type,
				"parameters": {
					number
				}
			}
		]
	}]


};
	
	return { getMessages };
};

//END OF moduleFunction() ============================================================

module.exports = args => new moduleFunction(args);
