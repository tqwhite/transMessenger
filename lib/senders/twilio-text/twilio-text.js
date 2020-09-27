'use strict';

const qtLib = require('qtools-functional-library');
const asynchronousPipe = new require('asynchronous-pipe-plus')();

//START OF moduleFunction() ============================================================

const moduleFunction = function(args = {}) {
	const { commandLineParameters, systemConfig, moduleConfig } = args;
	const { _log: qlog, accountSid, authToken, twilioSenderPhoneNumber } = moduleConfig;


	const client = require('twilio')(accountSid, authToken);

	
	const sendTextMessage = ({ message, phoneNumber }, callback) => {

		if (moduleConfig.suppressActualMessages) {
			console.log(
				`\n=-=============   MESSAGE TRANSMISSION SUPPRESSED  ========================= [twilio-text.js.moduleFunction]\n`
			);
			callback('', {});
			return;
		}

		let outObject = {};
		const result = client.messages
			.create({
				body: message,
				from: `+1${twilioSenderPhoneNumber}`,
				to: `+1${phoneNumber}`
			})
			.catch(err => {
				outObject.error = err.toString();
			})
			.then((result = {}) => {
				outObject = { ...outObject, result };
			})
			.done(() => {
				outObject.error ||
					qlog(
						`message was sent to ${phoneNumber} (sid='${
							outObject.sid
						}')`
					);
				outObject.error &&
					qlog(
						`message FAILED for ${phoneNumber}' because of '${
							outObject.error
						}'`
					);
				callback(outObject.error, outObject);
			});
	};
	
	
	const sendMessage = (({ sendTextMessage }) => (
		messageObject,
		messageProcessObject,
		callback
	) => {
		const { phoneNumbers, message, type = [] } = messageObject;



		const processedMessage = message.qtPop().replace(/\+/g, ' ');
		const processedType = type.qtPop();

		const pipeRunner = asynchronousPipe.asynchronousPipe;
		const taskList = asynchronousPipe.taskListPlus();

		for (var i = 0, len = phoneNumbers.length; i < len; i++) {
			const phoneNumber = phoneNumbers[i];
			taskList.push((args, next) => {
				const { sendTextMessage } = args;
				const localCallback = (err, result) => {
					if (err) {
						messageProcessObject.errors.add({ err, phoneNumber });
					} else {
						messageProcessObject.actions.add(result);
					}

					next(err, args);
				};

				const result = sendTextMessage(
					{
						message: processedMessage,
						phoneNumber
					},

					localCallback
				);
			});
		}

		const initialData = { sendTextMessage };
		asynchronousPipe.pipeRunner(
			taskList.getList(),
			initialData,
			(err, args) => {
				callback('', messageProcessObject);
			}
		);
	})({ sendTextMessage });
	
	const sendMessageList = (sendMessage => (messageProcessObject, callback) => {
		const pipeRunner = asynchronousPipe.asynchronousPipe;
		const taskList = asynchronousPipe.taskListPlus();
		const messageList = messageProcessObject.getMessages();

		messageList.forEach(message => {
			taskList.push((args, next) => {
				const localCallback = (err, result) => {
					next(err, args);
				};

				sendMessage(message.qtClone(), messageProcessObject, localCallback);
			});
		});

		const initialData = { sendTextMessage };
		asynchronousPipe.pipeRunner(
			taskList.getList(),
			initialData,
			(err, args) => {
				callback('', messageProcessObject);
			}
		);
	})(sendMessage);
	
	const action = (messageProcessObject, callback) => {
		sendMessageList(messageProcessObject, callback);
	};
	
	return { sendMessage, action };
};

//END OF moduleFunction() ============================================================

module.exports = args => new moduleFunction(args);
