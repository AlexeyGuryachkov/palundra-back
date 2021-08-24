'use strict'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwt_decode = require("jwt-decode")

const responce = require('./../responce')
const db = require('./../settings/db')
const config = require('./../config')
const errors = require('../settings/errors')

const UsersController = require('./UsersController')

exports.signUp = (req, res) => {
	const sql = 'SELECT * FROM users WHERE `email` = ?'

	const email = req.body.email

	db.query(sql, email, (error, results) => {

		if(error) {
			responce.status(false, errors.defaultError(error), res)
		} else if (typeof results !== 'undefined' && !!results.length) {
			responce.status(true, errors.emailExists(JSON.parse(JSON.stringify(results))[0].email), res)
		} else {
			UsersController.addUser(req, res)
		}
		
	})
}

exports.signIn = (req, res) => {
	const sql = 'SELECT * FROM users WHERE `email` = ?'

	const email = req.body.email

	db.query(sql, email, (error, results) => {

		if (error) {
			responce.status(false, errors.defaultError(error), res)
		}
		
		if (!results.length) {
			responce.status(false, errors.userNotFound(req.body.email), res)
		} else {
			const pass = JSON.parse(JSON.stringify(results))[0].pass
			const comparedPass = bcrypt.compareSync(req.body.pass, pass)

			if (comparedPass) {
				const token = jwt.sign({
					userId: JSON.parse(JSON.stringify(results))[0].id,
					email: JSON.parse(JSON.stringify(results))[0].email
				}, config.jwt, { expiresIn: 86400 })
				responce.status(true, { token, profile: results[0]}, res)
			} else {
			responce.status(false, errors.invalidPassword(), res)
			}
		}

	})
}

exports.authMe = (req, res) => {
	const myToken = req.headers.authorization
	const tokenPayload = jwt_decode(myToken)
	const myId = tokenPayload.userId

	const sql = `SELECT id, name, surname, email, image, login, birthdate, status, phone FROM users WHERE id = ${myId}`
	
	db.query(sql, (error, results) => {

		if(error) {
			responce.status(false, errors.defaultError(error), res)
		} else {
			responce.status(true, {profile: results[0]}, res)
		}

	})
}
