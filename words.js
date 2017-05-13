'use strict'
const Localize = require('localize')

var localizedSentences = new Localize({
    "Welcome_student": {
        "us": "Oh, hi. I'm the assistant of the prof' Augusto Zanella. Type 'help' to know I can do for you."
    },
    "Welcome_professor": {
    	"us": "Oh, hi Augusto. What can I do for you ? Type 'help' to know my competences."
    },
    "Apology $[1]": {
    	"us": "I'm not that good with other things that the following ones : \n $[1]"
    },
    "Help_intro_student $[1]": {
    	"us": "Join a class and I would transmit the messages Augusto Zanella wants to send to your class.\n Here is the things you can tell me :\n $[1]"
    },
    "Help_intro_professors $[1]": {
    	"us": "I can transmit the messages you want to send to your classes. When ever you want to publish a message to one of your class, I will send your message to all the students that join the class.\n"
    	+ "\nHere is the things you can tell me : \n $[1]"
    },
    "Help_cmd_student $[1] $[2] $[3]": {
    	"us": "• '$[1]' to got the list of all the classes\n" 
    	+ "• '$[2]' followed by the name of a class to join it\n" 
    	+ "• '$[3]' followed by the name of a class to leave it\n"
    	+ "• '$[4]' to got the list of courses you've joined" 
    },
    "Help_cmd_professor $[1] $[2] $[3] $[4]": {
    	"us": "• '$[1]' to got the list of all the classes you have created so far\n"
    	+ "• '$[2]' followed by the name of a class to create it\n"
    	+ "• '$[3]' followed by the name of a class to delete it\n"
    	+ "• '$[4][name of the class]' followed by your message to publish the message to the class\n"
    }
})

var localizedSuccess = new Localize({
	"Create_class $[1]": {
		"us": "Okay, $[1] created"
	},
	"Delete_class $[1]": {
		"us": "Hm, $[1] deleted"
	},
	"Join_class $[1]": {
		"us": "Cool, you've joined the class $[1]"
	},
	"Leave_class $[1]": {
		"us": "Hm, you've left $[1]"
	},
	"My_classes": {
		"us": "Here is your current classes :\n"
	},
	"Classes": {
		"us": "Here is all the classes :\n"
	},
	"Classes_empty": {
		"us": "There is no class yet"
	},
	"publish $[1]": {
		"us": "Your message has been published to $[1]"
	}
})

var localizedError = new Localize({
})

var localizedCommands = new Localize({
	"Help": {
		"us": "help"
	},
	"Create_class": {
		"us": "create class"
	},
	"Delete_class": {
		"us": "delete class"
	},
	"Join_class": {
		"us": "join class"
	},
	"Leave_class": {
		"us": "leave class"
	},
	"My_classes": {
		"us": "my classes"
	},
	"All_classes": {
		"us": "classes"
	},
	"Publishing_key": {
		"us": "@"
	}
})

localizedCommands.setLocale("us")
localizedSentences.setLocale("us")
localizedError.setLocale("us")
localizedSuccess.setLocale("us")

module.exports = {
	Commands: localizedCommands, 
	Sentences: localizedSentences,
	Success: localizedSuccess,
	Error: localizedError
}