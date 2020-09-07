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
		projectPathVarName = 'transMessengerProjectPath',
		configsContainerName = 'configs',
		configDirVarName = 'transMessengerConfigDirName',
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

	const getElement = ((config, configName, configFileName) => item => {
		if (typeof item != 'object' || !item.filename) {
			if (!item.filename) {
				console.error(
					`ERROR: getElement() can only be called with a valid 'module' object. Quitting`
				);
				process.exit(1);
			}
		} else {
			const moduleName = path.basename(item.filename).replace(/\.\w+$/, '');
			const moduleConfig = config.qtGetSurePath(moduleName, {
				warning: `no config was found for '${moduleName}' in ${configName}/${configFileName}`
			});
			return { ...moduleConfig, global: config.global, log };
		}
	})(config, configName, configFileName);
	
	//EXIT ============================================================
	
	return { getElement };
	
};

//END OF moduleFunction() ============================================================

module.exports = args => new moduleFunction(args);

