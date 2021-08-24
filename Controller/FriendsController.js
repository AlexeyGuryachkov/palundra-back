'use strict'

const responce = require('./../responce')
const db = require('./../settings/db')
const jwt_decode = require("jwt-decode")

const errors = require('../settings/errors')

	exports.getFriends = (req, res) => {
		const myToken = req.headers.authorization
		const tokenPayload = jwt_decode(myToken)
		const myId = tokenPayload.userId
	
		const sql = `SELECT friends FROM users WHERE id = ${myId}`
		
		db.query(sql, (error, results) => {
			
			if(error) {
				responce.status(false, errors.defaultError(error), res)
			} else {
				const friends = 'null' ? [] : [...results[0].friends]

				responce.status(true, {friends}, res)
			}
		})
	}

	exports.requestToAddToFriends = (req, res) => {
		const myToken = req.headers.authorization
		const tokenPayload = jwt_decode(myToken)
		const myId = tokenPayload.userId

		const responseJson = JSON.stringify(req.body)
	
		const sql = `UPDATE users SET requestsToFriendsIn = ? WHERE id = ?`

		db.query(sql, [responseJson, myId], (error, results) => {
	
			if (error) {
				responce.status(false, errors.defaultError(error), res)
			} else {
				responce.status(true, results, res)
			}
	
		})
	}
