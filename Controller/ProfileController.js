'use strict'

const responce = require('./../responce')
const db = require('./../settings/db')
const jwt_decode = require("jwt-decode")
const errors = require('../settings/errors')

exports.updateUser = (req, res) => {
	const myToken = req.headers.authorization
	const tokenPayload = jwt_decode(myToken)
	const myId = tokenPayload.userId

	const sql = `UPDATE users SET ? WHERE id = ${myId}`
	const updateData = req.body

	db.query(sql, updateData, (error, results) => {

		if (error) {
			responce.status(false, errors.defaultError(error), res)
		} else {
			responce.status(true, results, res)
		}

	})
}