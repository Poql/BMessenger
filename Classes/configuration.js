"use strict"

let fs = require('fs')
let configFilePath = __dirname + '/../configuration.json'
let config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'))

module.exports = {
	FB_CLIENT_TOKEN : config.FB_CLIENT_TOKEN,
	FB_VERIFY_TOKEN : config.FB_VERIFY_TOKEN
}
