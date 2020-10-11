'use strict';

const qtLib = require('qtools-functional-library');
const axios = require('axios');
const os = require('os');

const asynchronousPipePlus = new require('asynchronous-pipe-plus')();
const pipeRunner = asynchronousPipePlus.pipeRunner;
const taskListPlus = asynchronousPipePlus.taskListPlus;

//START OF moduleFunction() ============================================================

const moduleFunction = function(args) {
	const { retrieverConfig, jobConfig, systemConfig } = args;
	const { messageUrl, recipientsUrl, authString } = retrieverConfig;

	const headers = {
		['Accept']: '*/*',
		['Authorization']: authString,
		['Referer']: 'https://108.179.57.130:9010/test?debugForm',
		['Host']: os.hostname(),
		['Accept-Language']: 'en-us',
		['User-Agent']: `${retrieverConfig.qtGetSurePath(
			'_global.applicationName',
			''
		)}/${retrieverConfig.qtGetSurePath('_global.instanceLoggingIdString', '')}`,
		['Accept-Encoding']: 'gzip, deflate, br',
		['Connection']: 'keep-alive',
		['X-Requested-With']: 'XMLHttpRequest'
	};

	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
	
	const getHelixData = (requestObject, url, query, callback) => {
	const getObject={
			method: 'get',
			url,
			headers,
			options: {},
			params: query
		};
		
		axios(getObject)
			.then(function(response) {
				callback('', {
				data:response.data,
				getObject});
			})
			.catch(function(error) {
				error.qtDump({label:"ERROR:"});
				callback(error);
			})
			.finally(function() {
				//no op
			});
		return { headers };
	};
	

	

	const getMessages = (requestObject, callback) => {
		const taskList = new taskListPlus();

		taskList.push((args, next) => {
			const localCallback = (err, result) => {
				const messages=result.data;
			
				//yes, this is pushing items onto the tasklist from inside the tasklist.
				messages.forEach(message => {
					taskList.push((args, next) => {
						const localCallback = (err, result={}) => {

							const recipients=result.data;
							if (!recipients  || !recipients.length){
								result.getObject.qtDump({label:"GETOBJECT"});
							}

							message.recipients = recipients;
							next(err, args);
						};

						getHelixData('', recipientsUrl, message, localCallback);
					});
				});

				next(err, { ...args, messages });
			};
			getHelixData('', messageUrl, {}, localCallback);
		});

		pipeRunner(taskList.getList(), { requestObject }, (err, args) => {
			if (err) {
				console.error(`ERROR: ${err.toString()} [${module.filename}]`);
			}
			
			const messages = args.messages.map(rawSource => {
			


			return ({
				rawSource,
				message: [rawSource.content],
				recipients: rawSource
					.qtGetSurePath('recipients', [])
					.map(helixRecipient => {
			
					return ({
						type: helixRecipient.addressType,
						parameters: {
							number: helixRecipient.addressResult
						}
					})
					
					})
			})
			
			});

// 			const fs = require('fs');
// 			const messagesx = JSON.parse(
// 				fs
// 					.readFileSync(
// 						'/Users/tqwhite/Documents/webdev/switchinator/system/configs/tqwhite/testData/oneMessage.json'
// 					)
// 					.toString()
// 			);


			callback(err, messages);
		});
	};

	//	getHelixStuff()
	
	
	
	
	
	
	
	
	
	return { getMessages };
};

//END OF moduleFunction() ============================================================

module.exports = args => new moduleFunction(args);
