## Trans Messenger

* polls a data source, asking for messaging events

* operates an api, accepting messaging events

* publishes an http endpoint, accepting messaging events

messaging events can be
	a list of transMessageReferences (transMessageInfoSource, uniqueId)
	a list of transMessages (type, destination list, content)
	a request for status of previous transMessages

a transMessageInfoSource has two functions
	.getList(uniqueId)
	.setCompletionStatus(uniqueId)

transMessage.type
	references a configuration item
		.messagePreparation(message)
		.transmitter(destinationList, preparedMessage)