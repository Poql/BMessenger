'use strict'

class Classe {
	constructor(name) {
		this.name = name
	}
}

class User {
	constructor(id) {
		this.id = id
	}
}

module.exports = { 
	Classe : Classe,
	User : User
}
