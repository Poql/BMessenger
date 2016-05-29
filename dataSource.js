'use strict'
const Model = new require("./Model")
const DBModel = new require("./dbModel")
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/ZanellaDB')
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
	console.log("DB open")
});

class DataSource {

	constructor() {
		this.classes = [new Model.Classe("Classe 1"), new Model.Classe("Classe 2")]
	}

	getClasses() {
		return this.classes
	}

	addClasses(classe) {
		this.classes.append(classe)
	}

	removeClasse(classe) {
		let i = this.classes.findIndex(function(el) { return el.name == classe.name })
		if (i >= 0) { this.classes.splice(i, 1) }
	}
}

module.exports = DataSource