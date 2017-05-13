"use strict"
const http = require("http")
const Bot = require("./zanellaBot")
const DataSource = require("./dataSource")
const Templater = require("./templater")
const Words = require("./words")

const dataSource = new DataSource()

let bot = new Bot({
    token: 'TOKEN',
    verify: 'VERIFICATION_TOKEN'
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
    var resp = "Classe names incorrect"

    console.log("Publishing to " + classNames.toString() + " ...")

    if(classNames) {
        dataSource.getFacebookIds(classNames, (err, ids) => {
            if(ids) {
                ids.forEach((id) => {
                    bot.sendMessage(id, { text: message }, (error) => {
                        if(error) { console.log(error.message) }
                    })
                })

                resp = "Message published to : " + classNames.toString()
            } else {
                resp = err.message
            }
        })
    }
    reply({ text : resp })
})

bot.on("postback", (event, reply) => {
    console.log(event)
})

bot.on("unparsed", (event, reply) => {
    reply({ text : "I can not understand that"})
})

http.createServer(bot.middleware()).listen(3000)