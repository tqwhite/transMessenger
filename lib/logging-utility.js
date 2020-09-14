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

				`${message.getMessages().phoneNumbers.length} messages attempted. ${
					message.actions.get().length
				} succeeded. ${message.errors.get().length} failed.`.qtDump();
	
	}
	

	}
	
};

//END OF moduleFunction() ============================================================

module.exports = args => new moduleFunction(args);

