'use strict';

const qtLib = require('qtools-functional-library');
const path=require('path');

//START OF moduleFunction() ============================================================

const moduleFunction = function(args = {}) {

	
	return (message='')=>{
	const tmp=qtLib.callerName(true);
	
	if (typeof(message)=='string'){
	`${message} [${path.basename(tmp)}]`.qtDump({});
	
	}
	
	if (typeof(message)=='object'){
message.qtDump({label:"message"});

const messageList=[];//=message.getMessages();


// 				`ATTEMPTED ${messageList.length} messages totalling ${messageList.reduce((result, item)=>(result+item.recipients.length), 0)} recipients. ${
// 					message.actions.get().length
// 				} SUCCEEDED and ${message.errors.get().length} FAILED.`.qtDump();
	
	}
	

	}
	
};

//END OF moduleFunction() ============================================================

module.exports = args => new moduleFunction(args);

