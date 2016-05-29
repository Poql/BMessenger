'use strict'
const http = require('http')
const Bot = require('messenger-bot')

let bot = new Bot({
    token: 'TOKEN',
    verify: 'VERIFICATION_TOKEN'
})

bot.on('error', (err) => {
    console.log(err.message)
})

bot.on("classes", (event, reply) => {
})

bot.on("add_class", (event, reply) => {
})

bot.on("remove_class", (event, reply) => {
})

bot.on("remove", (event, reply) => {
})

bot.on("publish", (event, reply) => {
})

bot.on("postback", (event, reply) => {
})

bot.on("unparsed", (event, reply) => {
})

http.createServer(bot.middleware()).listen(3000)