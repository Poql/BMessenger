'use strict'
const Model = new require("./Model")

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