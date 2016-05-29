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
		this.DBClasse = DBModel.Classe
		this.DBUser = DBModel.User
	}

	// Error

	logError(error) {
		console.log(err.message)
	}

	// Prof

	getClasses(cb) {
		console.log("Searching all the classes ...")
		this.DBClasse.find({}).exec((err, dbClasses) => {
			if(dbClasses) {
				console.log("Find ", dbClasses.length, " classes")
				var classes = []
				dbClasses.forEach((classe) => {
					classes.push(new Model.Classe(classe.name))
				})
				cb(err, classes)
			} else {
				this.logError(err)
				cb(err)
			}
		})
	}

	addClasseWithName(name, cb) {
		console.log("Adding new class with name ", name, " ...")
		this.DBClasse.findOne({name: name}, (err, classe) => {
			if(classe) {
				console.log("Class name already taken")
				cb(new Error(name + " classe already exists"))
				return
			}
			console.log("Class added")
			var classe = new this.DBClasse({name: name, students: []})
			classe.save(cb)
		})
	}

	removeClasseWithName(name, cb) {
		console.log("Removing class named ", name, " ...")
		this.DBClasse.findOne({name : name}, (err, classe) => {
			if(!classe) {
				console.log("No class found with name ", name)
				cb(new Error(name + " classe does not exist"))
				return
			}
			console.log("Class removed")
			this.DBClasse.remove({name : name}, cb)	
		})
	}

}

module.exports = DataSource