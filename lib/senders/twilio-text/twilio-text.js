'use strict';

const qtLib = require('qtools-functional-library');
const asynchronousPipe = new require('asynchronous-pipe-plus')();

//START OF moduleFunction() ============================================================

const moduleFunction = function(args = {}) {
	const { commandLineParameters, systemConfig } = args;
	const config = systemConfig.getElement(module);
	const { log, accountSid, authToken, twilioSenderPhoneNumber } = config;
	
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
					log(
						`message was sent to ${recipientPhoneNumber} (sid='${
							outObject.sid
						}')`
					);
				outObject.error && log(`message FAILED for ${recipientPhoneNumber}' because of ${outObject.error}`);
				callback(outObject.error, outObject);
			});
	};
	
	
	const sendMessageList = (({ sendTextMessage }) => async (
		values,
		callback
	) => {
		const { phoneNumbers, message, type = [] } = values;

		const processedMessage = message.qtPop().replace(/\+/g, ' ');
		const processedType = type.qtPop();

		const processList = [];
		const errorList = [];

		const pipeRunner = asynchronousPipe.asynchronousPipe;
		const taskList = asynchronousPipe.taskListPlus();

		for (var i = 0, len = phoneNumbers.length; i < len; i++) {
			const phoneNumber = phoneNumbers[i];

			taskList.push((args, next) => {
				const { sendTextMessage } = args;
				const localCallback = (err, result) => {
					if (err) {
						errorList.push({ err });
					} else {
						processList.push(result);
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
			(err, finalResult) => {
				callback(errorList.length, {
					sentStatus: `${phoneNumbers.length} messages attempted. ${
						processList.length
					} succeeded. ${errorList.length} failed.`,
					processList,
					errorList
				});
			}
		);
	})({ sendTextMessage });
	
	
	return { sendMessageList };
};

//END OF moduleFunction() ============================================================

module.exports = args => new moduleFunction(args);
