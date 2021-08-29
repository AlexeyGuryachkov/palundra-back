'use strict'

const responce = require('./../responce')
const db = require('./../settings/db')
const jwt_decode = require("jwt-decode")

const wsMap = require('../server')

const errors = require('../settings/errors')

exports.sendMessage = (req, res) => {
	const myToken = req.headers.authorization
	const tokenPayload = jwt_decode(myToken)

	const myId = tokenPayload.userId

	const post = {
		fromId: myId,
		toId: req.body.toId,
		text: req.body.text,
	}

	const sql = 'INSERT INTO messages SET ?'

	db.query(sql, post, (error, results) => {
		if (error) {
			responce.status(false, errors.defaultError(error), res)
		} else {
			responce.status(true, 'ok', res)
		}
	})

	const targetWs = wsMap.wsMap.get(req.body.toId)
	targetWs?.send(JSON.stringify({type: 'message', data: post}))
}

exports.getDialog = (req, res) => {
	const myToken = req.headers.authorization
	const tokenPayload = jwt_decode(myToken)

	const myId = tokenPayload.userId
	const whithId = req.query.id

	const sqlTo = `SELECT users.id, users.name, users.surname, users.image, messages.* FROM messages JOIN users ON users.id=${whithId} WHERE messages.toId=${myId} AND messages.fromId=${whithId}`

	db.query(sqlTo, (error, results) => {
		if (error) {
			responce.status(false, errors.defaultError(error), res)
		} else {
			const messagesTo = results

			const sqlFrom = `SELECT users.id, users.name, users.surname, users.image, messages.* FROM messages JOIN users ON users.id=${myId} WHERE messages.fromId=${myId} AND messages.toId=${whithId}`
			db.query(sqlFrom, (error, results) => {

				if (error) {
					responce.status(false, errors.defaultError(error), res)
				} else {
					const messangeList = [...messagesTo, ...results].sort((a, b) => a.id > b.id ? 1 : -1)

					responce.status(true, messangeList, res)
				}
			})
		}
	})
}


	exports.getDialogsList = (req, res) => {
		const myToken = req.headers.authorization
		const tokenPayload = jwt_decode(myToken)
	
		const myId = tokenPayload.userId

		const sqlFrom = `SELECT users.id AS whithId, users.name, users.surname, users.image, messages.* FROM users JOIN messages ON users.id=messages.fromId WHERE messages.toId=${myId}`
	
		db.query(sqlFrom, (error, results) => {
	
			if (error) {
				responce.status(false, errors.defaultError(error), res)
			} else {
				const messegesFrom = results

				const sqlTo = `SELECT users.id AS whithId, users.name, users.surname, users.image, messages.* FROM users JOIN messages ON users.id=messages.toId WHERE messages.fromId=${myId}`
	
				db.query(sqlTo, (error, results) => {
			
					if (error) {
						responce.status(false, errors.defaultError(error), res)
					} else {
						const dialogsList = [...messegesFrom, ...results].sort((a, b) => a.id < b.id ? 1 : -1).filter((obj, index, arr) => {
							return arr.map(mapObj => mapObj['whithId']).indexOf(obj['whithId']) === index
					})

						responce.status(true, dialogsList, res)
					}
				})
			}
		})
	}