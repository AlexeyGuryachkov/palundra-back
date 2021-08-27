'use strict'

const responce = require('./../responce')
const db = require('./../settings/db')
const jwt_decode = require("jwt-decode")

const errors = require('../settings/errors')

	exports.getFriends = (req, res) => {
		const myToken = req.headers.authorization
		const tokenPayload = jwt_decode(myToken)
		const myId = tokenPayload.userId

		/*друзья из входящих заявок*/
		const sqlToId = `SELECT users.id, users.name, users.surname, users.image FROM friends JOIN users ON users.id=friends.fromId WHERE friends.toId=${myId} AND friends.status=1`
		/*друзья из изходящих заявок*/
		const sqlFromId = `SELECT users.id, users.name, users.surname, users.image FROM friends JOIN users ON users.id=friends.toId WHERE friends.fromId=${myId} AND friends.status=1`
		
		db.query(sqlToId, (error, results) => {
			
			if(error) {
				responce.status(false, errors.defaultError(error), res)
			} else {
				const friendsToMyId = results

				db.query(sqlFromId, (error_from, results_from) => {
			
					if(error_from) {
						responce.status(false, errors.defaultError(error_from), res)
					} else {
						const friendsfromMyId = results_from
						
						responce.status(true, {friends: [...friendsToMyId, ...friendsfromMyId]}, res)
					}
				})
			}
		})
	}

exports.requestToAddToFriends = (req, res) => {
	const myToken = req.headers.authorization
	const tokenPayload = jwt_decode(myToken)

	const myId = tokenPayload.userId
	const toId = req.body.toId

	const post = {
		fromId: myId, toId, status: 2
	}

	const sql = 'INSERT INTO friends SET ?'

	db.query(sql, post, (error, results) => {
		if (error) {
			responce.status(false, errors.defaultError(error), res)
		} else {
			const requestToFriends = {
				mess: 'Заявка в друзья отправлена',
			}
			responce.status(true, requestToFriends, res)
		}
	})
}

exports.getFriendsRequestsOut = (req, res) => {
	const myToken = req.headers.authorization
	const tokenPayload = jwt_decode(myToken)

	const myId = tokenPayload.userId

	const sql = `SELECT users.id, users.name, users.surname, users.image FROM friends JOIN users ON users.id=friends.toId WHERE friends.fromId=${myId} AND friends.status=2`

	db.query(sql, (error, results) => {
		if (error) {
			responce.status(false, errors.defaultError(error), res)
		} else {
			responce.status(true, {friendsRequestsOut: results}, res)
		}
	})
}

exports.getFriendsRequestsIn = (req, res) => {
	const myToken = req.headers.authorization
	const tokenPayload = jwt_decode(myToken)

	const myId = tokenPayload.userId
	
	const sql = `SELECT users.id, friends.id AS requestId, users.name, users.surname, users.image FROM friends JOIN users ON users.id=friends.fromId WHERE friends.toId=${myId} AND friends.status=2`

	db.query(sql, (error, results) => {
		if (error) {
			responce.status(false, errors.defaultError(error), res)
		} else {
			responce.status(true, {friendsRequestsIn: results}, res)
		}
	})
}

exports.approveRequestToFriends = (req, res) => {
	const myToken = req.headers.authorization
	const tokenPayload = jwt_decode(myToken)

	const myId = tokenPayload.userId
	const requestId = req.body.requestId

	const sql = `UPDATE friends SET status=1 WHERE id = ${requestId} AND toId=${myId}`

	db.query(sql, (error, results) => {
		if (error) {
			responce.status(false, errors.defaultError(error), res)
		} else {
			responce.status(true, {friendsRequestsIn: results}, res)
		}
	})
}
