'use strict'
const Model = new require("./Model")
const DBModel = new require("./dbModel")
const mongoose = require('mongoose')
const ModelMapper = require("./ModelMapper")

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
		this.mapper = new ModelMapper()
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

	// Student

	joinClass(name, facebook_id, cb) {
		console.log("Joining class named ", name, " ...")
		this.getDBUser(facebook_id, (err, user) => {
			if(user) {
				console.log(user.facebook_id," joined class named ", name)
				this.DBClasse.update({name: name}, {$addToSet: {students: user._id}}, cb)	
			} else {
				this.logError(err)
				cb(err)
			}
		})
	}

	leaveClass(name, facebook_id, cb) {
		console.log("Leaving class named ", name, " ...")
		this.getDBUser(facebook_id, (err, user) => {
			if(user) {
				console.log(user.facebook_id, " leaved class named", name)
				this.DBClasse.update({students : user._id, name : name}, { $pullAll: {students: [user._id] } }, cb)
			} else {
				this.log(err)
				cb(err)
			}
		})
	}

	getMyClasses(facebook_id, cb) {
		console.log("Searching all the classes of the user ", facebook_id, " ...")
		this.getUser(facebook_id, (err, user) => {
			if(user) {
				this.DBClasse.find({students : user._id}, (err, classes) => {
					if(classes) {
						console.log("Find the ", classes.length, " classes of the user ", facebook_id)
						let result = classes.map((el) => { return el.getClass() })
						cb(err, result)	
					} else {
						this.log(err)
						cb(err)
					}
				})
			} else {
				this.log(err)
				cb(err)
			}
		})
	}

	getFacebookIds(classNames, cb) {
		console.log("Searching all the students for the classes named ", classNames)
		this.DBClasse.find({name: {$in : classNames}})
		.populate("students")
		.exec((err, classes) => {
			var facebook_ids = []
			if(classes) {
				console.log("Find the classes named ", classes.map((c)=>{ return c.name }))
				classes.forEach((c) => {
					console.log(c.students)
					var students = c.students.map((s) => { return s.facebook_id })
					facebook_ids = facebook_ids.concat(students)
				})
				console.log("Find ", facebook_ids, " students")
				cb(err, new Set(facebook_ids))
			} else {
				cb(err)
			}
		})
	}

	createUser(facebook_id, profile, cb) {
		let schema = this.mapper.creationUserSchema(profile, facebook_id)
		let user = new this.DBUser(schema)
		user.save((err) => {
			if (err){
				cb(err)
				return
			}
			cb(err, this.mapper.userSchemaFromDBUser(user))
		})
	}

	updateUser(facebook_id, profile, cb) {
		let schema = this.mapper.modificationUserSchema(profile)
		this.DBUser.findOneAndUpdate({ facebook_id : facebook_id }, schema, (err, user) => {
			if (user){
				cb(err, this.mapper.userSchemaFromDBUser(user))
				return
			}
			cb(err, user)
		})
	}

	getUser(facebook_id, cb) {
		this.getDBUser(facebook_id, (err, user) => {
			if (user) {
				cb(null, this.mapper.userSchemaFromDBUser(user))
				return
			}
			cb(err)
		})
	}

	getDBUser(facebook_id, cb) {
		this.DBUser.findOne({facebook_id : facebook_id}, cb)
	}
}
module.exports = DataSource
