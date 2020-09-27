'use strict';

const qtLib = require('qtools-functional-library');
const asynchronousPipe = new require('asynchronous-pipe-plus')();

//START OF moduleFunction() ============================================================

const moduleFunction = function({retrieverConfig = {}}={}) {

// ..../code/startAll.js --type=twilio-text --message=TQ's+New+Trans+Messenger+says:+HELLO' --phoneNumbers=7087630100

//for command line there is no module config beyond it's path

const getMessages=requestObject=> [requestObject.values];
	
	return { getMessages };
};

//END OF moduleFunction() ============================================================

module.exports = args => new moduleFunction(args);
