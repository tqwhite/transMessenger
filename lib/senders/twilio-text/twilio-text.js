'use strict';

const qtLib = require('qtools-functional-library');
const asynchronousPipe = new require('asynchronous-pipe-plus')();

//START OF moduleFunction() ============================================================

const moduleFunction = function(args = {}) {
	const { commandLineParameters, systemConfig } = args;
	const config = systemConfig.getElement(module)('.');
	const { _log: qlog, accountSid, authToken, twilioSenderPhoneNumber } = config;
	
	const client = require('twilio')(accountSid, authToken);

	const recipientPhoneNumber = '7087630100';
	
	const sendTextMessage = ({ message, phoneNumber }, callback) => {
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
						`message was sent to ${recipientPhoneNumber} (sid='${
							outObject.sid
						}')`
					);
				outObject.error &&
					qlog(
						`message FAILED for ${recipientPhoneNumber}' because of '${
							outObject.error
						}'`
					);
				callback(outObject.error, outObject);
			});
	};
	
	
	const sendMessageList = (({ sendTextMessage }) => async (
		messageProcessObject,
		callback
	) => {
		const {
			phoneNumbers,
			message,
			type = []
		} = messageProcessObject.getMessages();

		if (!message || message.length == 0) {
			callback();
			return;
		}

		const processedMessage = message.qtPop().replace(/\+/g, ' ');
		const processedType = type.qtPop();

		const processList = [];

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
	
	const action = (messageProcessObject, next) => {
		sendMessageList(messageProcessObject, next);
	};
	
	return { sendMessageList, action };
};

//END OF moduleFunction() ============================================================

module.exports = args => new moduleFunction(args);
