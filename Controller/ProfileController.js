'use strict'

const responce = require('./../responce')
const db = require('./../settings/db')
const jwt_decode = require("jwt-decode")
const multer = require('multer')
const server = require('../server')

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

exports.saveImage = (req, res) => {
	server.upload(req, res, function (err) {
		const myToken = req.headers.authorization
		const tokenPayload = jwt_decode(myToken)
		const myId = tokenPayload.userId
		
		const newImage = res.req.file.path
	
		const sql = `UPDATE users SET ? WHERE id = ${myId}`

			if (err instanceof multer.MulterError) {
				console.log(err)
			} else if (err) {
				console.log(err)
			} else {
				db.query(sql, {image: newImage}, (error, results) => {
					if (error) {
						responce.status(false, errors.defaultError(error), res)
					} else {
						responce.status(true, results, res)
					}
				})
			}
		})
	}
