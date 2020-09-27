'use strict';

const qtLib = require('qtools-functional-library');

const path = require('path');

console.log(__dirname);

//START OF moduleFunction() ============================================================

const moduleFunction = function({ messages } = {}) {
	 
	console.error(
		`${path.basename(
			__filename
		)} SAYS: validate phone number/type pairs "item.phoneNumbers.filter(item=>(item.type && item.number))" someday`
	);

	const validMessages = messages =>
		messages.length &&
		messages.filter(item => item.phoneNumbers && item.message).length
			? true
			: false;
	const messagesReady = (messages => () => {
		return validMessages(messages) ? true : false;
	})(messages);

	const getMessages = (messages => () => {
		return messages;
	})(messages);
	
	
	const errorList = [];
	
	const errors = {
		add: (errorList => error => errorList.push(error))(errorList),
		get: (errorList => () => errorList)(errorList)
	};
	const actionList = [];
	const actions = {
		add: (actionList => actionItem => actionList.push(actionItem))(actionList),
		get: (actionList => () => actionList)(actionList)
	};
	

	
	
	

	return { messagesReady, getMessages, errors, actions };
};

//END OF moduleFunction() ============================================================

module.exports = args => new moduleFunction(args);

