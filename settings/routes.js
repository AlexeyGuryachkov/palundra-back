'use strict'

module.exports = (app) => {
	const passport = require('passport')
	const usersController = require('./../Controller/UsersController')
	const AuthController = require('./../Controller/AuthController')
	const ProfileController = require('./../Controller/ProfileController')
	const FriendsController = require('./../Controller/FriendsController')
	const MessengerContoller = require('./../Controller/MessengerContoller')

	app
	.route('/auth/signup')
	.post(AuthController.signUp)
	
	app
	.route('/auth/signin')
	.post(AuthController.signIn)
	
	app
		.route('/auth/me')
		.get(passport.authenticate('jwt', { session: false }), AuthController.authMe)

	/*profile*/
	app
	.route('/profile/update')
	.post(passport.authenticate('jwt', { session: false }), ProfileController.updateUser)
	
	app
		.route('/profile/updateAvatar')
		.post(passport.authenticate('jwt', { session: false }), ProfileController.saveImage)

	/*users*/
	app
	.route('/users/find')
	.get(passport.authenticate('jwt', { session: false }), usersController.findUser)

	app
		.route('/users')
		.get(passport.authenticate('jwt', { session: false }), usersController.getAllUsers)

	/*friends*/
	app
		.route('/friends/add')
		.post(passport.authenticate('jwt', { session: false }), FriendsController.requestToAddToFriends)

	app
		.route('/friends/getFriends')
		.get(passport.authenticate('jwt', { session: false }), FriendsController.getFriends)

	app
		.route('/friends/getRequestsOut')
		.get(passport.authenticate('jwt', { session: false }), FriendsController.getFriendsRequestsOut)

	app
		.route('/friends/getRequestsIn')
		.get(passport.authenticate('jwt', { session: false }), FriendsController.getFriendsRequestsIn)

	app
		.route('/friends/approveRequest')
		.post(passport.authenticate('jwt', { session: false }), FriendsController.approveRequestToFriends)
		
	/*messenger*/
	app
		.route('/messenger/send')
		.post(passport.authenticate('jwt', { session: false }), MessengerContoller.sendMessage)

	app
		.route('/dialog/get')
		.get(passport.authenticate('jwt', { session: false }), MessengerContoller.getDialog)

	app
		.route('/messenger/getList')
		.get(passport.authenticate('jwt', { session: false }), MessengerContoller.getDialogsList)
}