'use strict'
const CMD = require("./words").Commands 

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

const CMD_CLASSES = CMD.translate("All_classes")
const CMD_HELP = CMD.translate("Help")

const CMD_REMOVE_CLASS = CMD.translate("Delete_class") + " "
const CMD_ADD_CLASS = CMD.translate("Create_class") + " "

const CMD_MY_CLASSES = CMD.translate("My_classes")
const CMD_LEAVE_CLASS = CMD.translate("Leave_class") + " "
const CMD_JOIN_CLASS = CMD.translate("Join_class") + " "


class Parser {
	parseMessage(msg) {
		if (!msg || typeof(msg) != "string") {
			console.log(":-(")
			return {
				messageType: MessageType.unparsed,
				payload: ""
			}
		}

		let gross = msg.trim()
		let message = gross.toLowerCase()

		if(message == CMD_CLASSES){
			return { messageType: MessageType.classes }
		}

		if(message == CMD_HELP) {
			return { messageType: MessageType.help }
		}

		// if(isProf) {
		// 	return this.parseProfessorMessage(gross, message)
		// }
		// return this.parseStudentMessage(gross, message)
		var result = this.parseProfessorMessage(gross, message)
		if(!result) {
			result = this.parseStudentMessage(gross, message)
		}
		if (result) {
			return result
		}
		return {
			messageType: MessageType.unparsed,
			payload: gross
		}
	}

	parseStudentMessage(gross, message) {
		var result = null

		if(message == CMD_MY_CLASSES) {
			result = { messageType: MessageType.my_classes }
		}
		else if(this.stringBegins(message, CMD_JOIN_CLASS)) {
			result = {
				messageType: MessageType.join_class,
				payload: this.endOfString(gross, CMD_JOIN_CLASS)
			}
		}
		else if(this.stringBegins(message, CMD_LEAVE_CLASS)) {
			result = {
				messageType: MessageType.leave_class,
				payload: this.endOfString(gross, CMD_LEAVE_CLASS)
			}
		}
		return result
	}

	parseProfessorMessage(gross, message) {
		var result = null

		if(this.stringBegins(message, CMD_REMOVE_CLASS)) {
			result = {
				messageType: MessageType.remove_class,
				payload: this.endOfString(gross, CMD_REMOVE_CLASS) 
			}
		}
		else if(message == CMD_REMOVE_CLASS) {
			result = { messageType: MessageType.remove }
		}
		else if(message.substring(0, 1) == "@") {
			result = this.resultForPublish(gross)
		}
		else if(this.stringBegins(message, CMD_ADD_CLASS))  {
			result = {
				messageType: MessageType.add_class,
				payload: this.endOfString(gross, CMD_ADD_CLASS)
			}
		}

		return result
	}

	resultForPublish(gross) {
		var words = gross.split(" ")
		var classes = []
		var msg = ""

		words.forEach((word) => {
			if(word.substring(0,1) == "@") {
				let classe = word.substring(1,word.length).toUpperCase()
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