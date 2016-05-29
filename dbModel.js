const mongoose = require('mongoose')
const Model = require("./model")
const Schema = mongoose.Schema

let userSchema = Schema({
	facebook_id: Number
})

let classeSchema = Schema({
	name: String,
	students: [{type: Schema.Types.ObjectId, ref: 'User'}]
})

classeSchema.methods.getClass = function() {
	let model = new Model.Classe(this.name) 
	return model}

let ModelClasse  = mongoose.model('Classe', classeSchema)
let ModelUser = mongoose.model('User', userSchema)

module.exports = {
	Classe: ModelClasse,
	User: ModelUser
}
