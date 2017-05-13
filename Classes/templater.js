'use strict'

class Templater {

	constructor() {
	}

	// Attachment
	
	static attachment(type, payload){
		return {
			attachment: {
				type: type, 
				payload: payload
			}
		}
	}

	// Templates

	static buttonsTemplate(text ,buttons) {
		return { 
			template_type: "button",
			text: text, 
			buttons: buttons
		}
	}

	static genericTemplate(elements) {
		return {
			template_type:"generic",
			elements: elements
		}
	}

	// Elements

	static element(title, subtitle, imageURL, buttons) {
		return {
			title: title,
			subtitle: subtitle,
			image_url: imageURL, 
			buttons: buttons
		}
	}

	static button(type, title, payload) {
		return {
			type: type, 
			title: title, 
			payload: payload
		}
	}
}

module.exports = Templater