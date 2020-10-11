'use strict';

const qtLib = require('qtools-functional-library');
const configFileProcessor = require('qtools-config-file-processor');

const path = require('path');
const fs = require('fs');

//START OF moduleFunction() ============================================================

const moduleFunction = function(args = {}) {
	
	const {
		environment,
		commandLineParameters,
		projectPathVarName = 'switchinatorProjectPath',
		configsContainerName = 'configs',
		configDirVarName = 'switchinatorConfigDirName',
		configFileName = '_systemSpecs.ini'
	} = args;

	const projectPath =
		environment[projectPathVarName] ||
		console.error(`ERROR: missing environment variable: $projectPathVarName`);

	const configName =
		environment[configDirVarName] ||
		console.error(`ERROR: missing environment variable: configDirName`);

	const configPath = (path =>
		fs.existsSync(path)
			? fs.realpathSync(path)
			: console.error(`ERROR: no ${configFileName} file`))(
		path.join(projectPath, configsContainerName, configName, configFileName)
	);
	
	//PREPARE FINAL CONFIG ============================================================
	
	const config = configPath
		? configFileProcessor.getConfig(configPath)
		: void 0;
	
	config.global = {
		...config.global,
		configurationModificationDate: config.configurationModificationDate,
		configurationSourceFilePath: config.configurationSourceFilePath
	};
	
	const loggerName = config.qtGetSurePath('global.loggerName');
	
	const log = loggerName
		? require(loggerName)(config.global)
		: message => message.qtDump({ label: 'default logger' });
	
	//WORKING METHOD ============================================================

	const getElement = ((
		config,
		configName,
		configFileName,
		commandLineParameters
	) => item => {
		let configItem;

		if (typeof item == 'string') {
			configItem = config.qtGetSurePath(item, {
				warning: `no config was found for string '${item}' in ${configName}/${configFileName}`
			});
		} else if (typeof item == 'object' && item.configElementName) {
			configItem = config.qtGetSurePath(item.configElementName, {
				warning: `no config was found for configElementName:'${
					item.configElementName
				}' in ${configName}/${configFileName}`
			});
		} else if (typeof item == 'object' && item.filename) {
			const moduleName = path.basename(item.filename).replace(/\.\w+$/, '');
			configItem = config.qtGetSurePath(moduleName, {
				warning: `no config was found for filename:'${
					item.configString
				}' in ${configName}/${configFileName}`
			});
		} else {
			console.error(
				`ERROR: getElement() can only be called with a string or an object with properties 'configElementName' or 'fileName'. Quitting `
			);
			console.trace();
			process.exit(1);
		}

		return subStringPath => {
			const _meta = { configElementName: item, subStringPath: subStringPath };

			if (subStringPath == '.') {
				return {
					...configItem,
					commandLineParameters,
					_global: config.global,
					_meta,
					_log: log
				};
			}

			const configElement = configItem.qtGetSurePath(subStringPath);

			if (typeof configElement != 'object') {
				return configElement;
			}

			return {
				...configElement,
				commandLineParameters,
				_global: config.global,
				_meta,
				_log: log
			};
		};
		
		
	})(config, configName, configFileName, commandLineParameters);
	
	
	const makeRetriever = (getElement => (retriever, codeRoot, jobConfig) => {
		
		const retrieverConfig = getElement(retriever)('.');
		return require(path.join(codeRoot, retrieverConfig.modulePath))({
			retrieverConfig, jobConfig, systemConfig
		});
		
	})(getElement);
	
	
	
	
	
	
	const showAll = () => config.qtDump();
	//EXIT ============================================================
	
	const systemConfig = { getElement, showAll, makeRetriever };
	return systemConfig;
	
};

//END OF moduleFunction() ============================================================

module.exports = args => new moduleFunction(args);

