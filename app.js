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

bot.on('message', (payload, reply) => {

})

http.createServer(bot.middleware()).listen(3000)