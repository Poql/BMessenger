const Bot = require("messenger-bot")
const Parser = require("./parser")
const MessageType = Parser.MessageType

class ZanellaBot extends Bot {

	constructor(opts) {
		super(opts)
		this.parser = new Parser.Parser()
	}

	// HANDLE EVENT

	_handleEvent (type, event) {
		console.log('New event : ' + type)
		this.emit("event", event, (newEvent) => {
			if(newEvent.message) {
				this._handleMessageEvent(newEvent)
			} else if(newEvent.postback) {
				this._handlePostBack(newEvent)
			} else {
				super._handleEvent(type, newEvent)
			}
		})
	}

	_handleMessageEvent(event) {
		let text = event.message.text
		let result = this.parser.parseMessage(text)

		event.payload = result.payload
		let type = result.messageType

		super._handleEvent(type, event)
	}

	_handlePostBack(event) {
		super._handleEvent("postback", event)
	}
}

module.exports = ZanellaBot
