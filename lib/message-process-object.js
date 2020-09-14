'use strict';

const qtLib = require('qtools-functional-library');

console.log(__dirname);

//START OF moduleFunction() ============================================================

const moduleFunction = function({ messages } = {}) {



	const validMessages = messages => {
		if (messages.type && messages.phoneNumbers && messages.message) {
			return true;
		} else {
			return false;
		}
	};

	const messagesReady = (messages => () => {
		return validMessages(messages) ? true : false;
	})(messages);

	const getMessages = (messages => () => {
		return messages;
	})(messages);
	
	
	const errorList = [];
	
	const errors={
		add:(errorList => error => errorList.push(error))(errorList),
		get:(errorList => () => errorList)(errorList)
	}
	const actionList = [];
	const actions={
		add:(actionList => actionItem => actionList.push(actionItem))(actionList),
		get:(actionList => () => actionList)(actionList)
	}
	

	
	
	

	return { messagesReady, getMessages, errors, actions };
};

//END OF moduleFunction() ============================================================

module.exports = args => new moduleFunction(args);

