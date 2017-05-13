"use strict"

class ModelMapper {
	constructor() {}

	creationUserSchema(profile, facebook_id) {
		profile.facebook_id = facebook_id
		profile.updateDate = new Date()
		profile.modificationDate = new Date()
		return profile
	}

	modificationUserSchema(profile) {
		profile.modificationDate = new Date()
		return profile
	}

	userSchemaFromDBUser(user) {
		return {
			facebook_id: user.facebook_id,
			last_name: user.last_name,
			first_name: user.first_name,
			locale: user.locale,
			profile_pic: user.profile_pic,
			timezone: user.timezone,
			gender: user.gender,
			modificationDate: user.modificationDate,
			creationDate: user.creationDate
		}
	}
}

module.exports = ModelMapper