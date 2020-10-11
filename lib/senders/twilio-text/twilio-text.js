'use strict';

const qtLib = require('qtools-functional-library');
const asynchronousPipe = new require('asynchronous-pipe-plus')();

//START OF moduleFunction() ============================================================

const moduleFunction = function(args = {}) {
	const { commandLineParameters, systemConfig, moduleConfig } = args;
	const {
		_log: qlog,
		accountSid,
		authToken,
		twilioSenderPhoneNumber
	} = moduleConfig;
	
	const client = require('twilio')(accountSid, authToken);

	
	const sendTextMessage = ({ message, phoneNumber }, callback) => {
	
		if (moduleConfig.allMessageGoToTq){
			phoneNumber = '7087630100'; //TQ phone number
		}

		if (moduleConfig.suppressActualMessages) {
			console.log(
				`\n=-= MESSAGE TRANSMISSION SUPPRESSED ${phoneNumber} ${message.substr(0,50)}...  ====== [twilio-text.js.moduleFunction]\n`
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
				callback(err);
			})
			.then((result = {}) => {
				console.log(
					`\n=-= SENT: ${phoneNumber} ${message.substr(0,50)}...  ====== [twilio-text.js.moduleFunction]\n`
				);
				callback('', result);;
			})
	};
	
	
	const sendMessage = (({ sendTextMessage }) => (
		messageObject,
		messageProcessObject,
		callback
	) => {
		const { recipients, message } = messageObject;
		const processedMessage = message.qtPop().replace(/\+/g, ' ');
		const pipeRunner = asynchronousPipe.asynchronousPipe;
		const taskList = asynchronousPipe.taskListPlus();

		for (var i = 0, len = recipients.length; i < len; i++) {
			const recipient = recipients[i];
			const phoneNumber = recipient.qtGetSurePath('parameters.number');

			taskList.push((args, next) => {
				const { sendTextMessage } = args;
				const localCallback = (err='no error', result='no result sent') => {

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
					message['twilio-text']=true;
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
		
	
		if (moduleConfig.allMessageGoToTq){		console.log(
			`\n=-=============   OVERRIDE: ALL PHONES TO GO TO TQ  ========================= [twilio-text.js.moduleFunction]\n`
		);
		}

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
