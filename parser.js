'use strict'

const MessageType = {
	// prof
	classes: "classes",
	add_class: "add_class",
	remove_class: "remove_class",
	remove: "remove",
	publish: "publish",

	// student
	join_class: "join_class", 
	leave_class: "leave_class",
	my_classes: "my_classes",

	// default
	unparsed: "unparsed", 
	help: "help"
}

const CMD_CLASSES = "classes"
const CMD_HELP = "help"

const CMD_REMOVE_CLASS = "remove "
const CMD_ADD_CLASS = "add "

const CMD_MY_CLASSES = "my classes"
const CMD_LEAVE_CLASS = "leave "
const CMD_JOIN_CLASS = "join "


class Parser {
	parseMessage(msg) {
		var result = {
			messageType: undefined,
			payload: undefined
		}

		let gross = msg.trim()
		let message = gross.toLowerCase()

		if(message == CMD_CLASSES){
			result.messageType = MessageType.classes
		}
		else if(message.substring(0, CMD_REMOVE_CLASS.length) == CMD_REMOVE_CLASS) {
			result.messageType = MessageType.remove_class
			result.payload = gross.substring(CMD_REMOVE_CLASS.length, gross.length)
		}
		else if(message == "remove") {
			result.messageType = MessageType.remove
		}
		else if(message.substring(0, 1) == "@") {
			result = resultForPublish(gross)
		}
		else if(message.substring(0, CMD_ADD_CLASS.length) == CMD_ADD_CLASS)  {
			result.messageType = MessageType.add_class
			result.payload = gross.substring(CMD_ADD_CLASS.length, gross.length)
		}
		else {
			result.messageType = MessageType.unparsed
			result.payload = gross
		}
		return result
	}

	resultForPublish(gross) {
		var words = gross.split(" ")
		var classes = []
		var msg = ""

		words.forEach((word) => {
			if(word.substring(0,1) == "@") {
				let classe = word.substring(1,word.length).toLowerCase()
				if(classes.indexOf(classe) == -1) {
					classes.push(classe)	
				}
			}
			else {
				msg += (word + " ")
			}
		})
		return {
			messageType: MessageType.publish,
			payload: {
				classes: classes,
				message: msg.trim()
			}
		}

		
	}

	stringBegins(string, begin) {
		return string.substring(0, begin.length) == begin
	}

	endOfString(string, begin) {
		return string.substring(begin.length, string.length)
	}
}

module.exports = {
	Parser: Parser,
	MessageType: MessageType
}