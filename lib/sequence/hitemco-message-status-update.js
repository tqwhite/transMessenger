'use strict';

const qtLib = require('qtools-functional-library');
const path = require('path');
const axios = require('axios');
const asynchronousPipePlus = new require('asynchronous-pipe-plus')();
const pipeRunner = asynchronousPipePlus.pipeRunner;
const taskListPlus = asynchronousPipePlus.taskListPlus;
const os = require('os');

//START OF moduleFunction() ============================================================

const moduleFunction = function(args = {}) {
	const { commandLineParameters, systemConfig, moduleConfig } = args;
	const {
		_log: qlog,
		messageObjectAccomplishmentFieldName,
		privateKeyUpdateFieldName,
		confirmUrl,
		recipientsUrl,
		authString
	} = moduleConfig;
	
	

	const headers = {
		['Accept']: '*/*',
		['Authorization']: authString,
		['Referer']: 'https://108.179.57.130:9010/test?debugForm',
		['Host']: os.hostname(),
		['Accept-Language']: 'en-us',
		['User-Agent']: `${moduleConfig.qtGetSurePath(
			'_global.applicationName',
			''
		)}/${moduleConfig.qtGetSurePath('_global.instanceLoggingIdString', '')}`,
		['Accept-Encoding']: 'gzip, deflate, br',
		['Connection']: 'keep-alive',
		['X-Requested-With']: 'XMLHttpRequest'
	};
	
	const sendHelixData = (requestObject, url, query, callback) => {
		const postObject = {
			method: 'post',
			url,
			headers,
			options: {},
			data: query
		};
		
		axios(postObject)
			.then(function(response) {
				callback('', {
					data: response.data,
					postObject
				});
			})
			.catch(function(error) {
				error.qtDump({ label: 'ERROR:' });
				callback(error);
			})
			.finally(function() {
				//no op
			});
		return { headers };
	};
	
	const action = (messageProcessObject, callback) => {
		const messageList = messageProcessObject.getMessages();
		const taskList = new taskListPlus();

		messageList.forEach(message => {
			
			if (message[messageObjectAccomplishmentFieldName]) {
				taskList.push((args, next) => {
					const localCallback = (err, localResult1) => {
						if (!err){
						qlog(`completed sending and update of ${privateKeyUpdateFieldName}=${message.rawSource[privateKeyUpdateFieldName]}`);
						}
						else{
						
						}
						next(err, args);
					};
					
					sendHelixData(
						message,
						confirmUrl,
						{
							[privateKeyUpdateFieldName]:
								message.rawSource[privateKeyUpdateFieldName]
						},
						localCallback
					);
				});
			}
		});

		const initialData = typeof inData != 'undefined' ? inData : {};
		pipeRunner(taskList.getList(), initialData, (err, args) => {
			if (err) {
				console.error(err.toString());
			}

			callback(err, args);
		});
	};
	
	return { action };
	
};

//END OF moduleFunction() ============================================================

module.exports = args => new moduleFunction(args);

