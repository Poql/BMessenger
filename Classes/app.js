"use strict"
const http = require("http")
const Bot = require("./zanellaBot")
const DataSource = require("./dataSource")
const Templater = require("./templater")
const Words = require("./words")
const Configuration = require("./configuration")

const dataSource = new DataSource()

let bot = new Bot({
    token: Configuration.FB_CLIENT_TOKEN,
    verify: Configuration.FB_VERIFY_TOKEN
})

bot.on("event", (event, reply) => {
    let id = event.sender.id
    dataSource.getUser(id, (err, user) => {
        if (err) {
            reply(event)
            return
        }

        if (user) {
            console.log(user.first_name + " triggers an event")
            event.user = user
            reply(event)
        } else {
            console.log("Fetching profil of user " + id)    
            bot.getProfile(id, (err, profile) => {
                dataSource.createUser(id, profile, (err, user) => {
                    console.log("Just created " + user.first_name +" triggers an event")
                    event.user = user
                    reply(event)
                })
            })
        }
    })
})

bot.on("error", (err) => {
    console.log(err.message)
})

bot.on("classes", (event, reply) => {
    dataSource.getClasses((err, classes) => {
        if(err) { console.log(err.message); return; }
        var resp = ""
        if(classes.length == 0) {
            resp = Words.Success.translate("Classes_empty")
        } else {
            resp = Words.Success.translate("Classes")
            classes.forEach((el) => {
                resp += "• " +  el.name + "\n"
            })
        }
        reply({text : resp })
    })
})

bot.on("help", (event, reply) => {
    // let help = Words.Sentences.translate("Help")
    reply({text: "😎"})
})

// Prof

bot.on("add_class", (event, reply) => {
    var resp = ""
    let name = event.payload.toUpperCase()
    if(name.indexOf(" ") >= 0) {
        resp = "A classe can not have white space"
        reply({ text : resp })
        return
    }
    dataSource.addClasseWithName(name, (err) => {
        if(err) {
            resp = err.message
        } else {
            resp = event.payload + " added 😊"
        }
        reply({ text : resp })
    })
})

bot.on("remove_class", (event, reply) => {
    let name = event.payload
    dataSource.removeClasseWithName(name, (err) => {
        var resp = ""
        if(err) {
            resp =  name + " : classe does not exist" 
        } else {
            resp = name + " removed"
        }
        reply({ text : resp })
    })
})

// Student

bot.on("join_class", (event, reply) => {
    let name = event.payload
    dataSource.joinClass(name, event.sender.id, (err) => {
        var resp = ""
        if(err) {
            resp = err.message
        } else {
            resp = "You join class " + name
        }
        reply({ text : resp })
    })
})

bot.on("leave_class", (event, reply) => {
    let name = event.payload
    console.log("User wants to leave class named " + name)
    dataSource.leaveClass(name, event.sender.id, (err) => {
        var resp = ""
        if(err) {
            resp = err.message
        } else {
            resp = "You leave the class " + name
        }
        reply({text : resp})
    })
})

bot.on("my_classes", (event, reply) => {
    dataSource.getMyClasses(event.sender.id, (err, classes) => {
        if(err) { console.log(err.message); return; }
        var resp = ""
        if(!(classes) || classes.length == 0) {
            resp = "No classes yet"
        } else {
            console.log("find classes")
            classes.forEach((el) => {
                resp += "• " +  el.name + "\n"
            })
        }
        reply({text : resp })
    })
})

// PAYLOAD

bot.on("remove", (event, reply) => {
    let b = Templater.button("postback", "A postback button", "heelo")
    let buttonsTemplate = Templater.buttonsTemplate("Classes to remove ?", [b])
    let attachment = Templater.attachment("template", buttonsTemplate)
    reply(attachment)
})

bot.on("publish", (event, reply) => {
    let classNames = event.payload.classes
    let message = event.payload.message

    console.log("Publishing to " + classNames.toString() + " ...")

    if(!classNames || classNames.count == 0) {
        reply({ text : "Classe names incorrect"})
        return
    }
    dataSource.getFacebookIds(classNames, (err, ids) => {
        if(ids) {
            var text = ""
            ids.forEach((id) => {
                bot.sendMessage(id, { text: message }, (error) => {
                    if(error) { console.log(error.message) }
                })
            })
            text = "Message published to : " + classNames.toString()
        } else {
            text = err.message
        }
        reply({ text : text })
    })
})

bot.on("postback", (event, reply) => {
    console.log(event)
})

bot.on("unparsed", (event, reply) => {
    reply({ text : "I can not understand that " + event.user.first_name })
})

http.createServer(bot.middleware()).listen(3000)