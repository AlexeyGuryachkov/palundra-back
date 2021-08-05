'use strict'

module.exports = (app) => {
	const passport = require('passport')
	const usersController = require('./../Controller/UsersController')
	const AuthController = require('./../Controller/AuthController')
	const ProfileController = require('./../Controller/ProfileController')

	app
	.route('/auth/signup')
	.post(AuthController.signUp)
	
	app
	.route('/auth/signin')
	.post(AuthController.signIn)
	
	app
	.route('/profile/update')
	.post(passport.authenticate('jwt', { session: false }), ProfileController.updateUser)
	
	app
	.route('/users/find')
	.get(passport.authenticate('jwt', { session: false }), usersController.findUser)

	app
		.route('/users')
		.get(passport.authenticate('jwt', { session: false }), usersController.getAllUsers)

	app
		.route('/auth/me')
		.get(passport.authenticate('jwt', { session: false }), AuthController.authMe)
}