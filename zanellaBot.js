const Bot = require("messenger-bot")

class ZanellaBot extends Bot {

	constructor(opts) {
		super(opts)
	}

	// HANDLE EVENT

	_handleEvent (type, event) {
		console.log('New event : ${type}')

		if(event.message) {
			this._handleMessageEvent(event)
		}
		else if(event.postback) {
			this._handlePostBack(event)
		}
		else {
			super._handleEvent(type, event)
		}
	}

	_handleMessageEvent(event) {
	}

	_handlePostBack(event) {
	}
}

module.exports = ZanellaBot
