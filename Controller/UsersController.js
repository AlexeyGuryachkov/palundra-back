'use strict'

const e = require('express')
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(15)

const responce = require('./../responce')
const db = require('./../settings/db')
const errors = require('../settings/errors')

exports.getAllUsers = (req, res) => {
	const sql = 'SELECT `id`, `name`, `surname`, `image` FROM `users`'

	db.query(sql, (error, results ) => {

		if(error) {
			responce.status(400, error, res)
		} else {
			responce.status(200, {usersList: results}, res)
		}
	})
}

exports.addUser = (req, res) => {
	const sql = `INSERT INTO users SET ?`

	// res.set('Access-Control-Allow-Origin', '*')

	const post = {
		name: req.body.name ? req.body.name : null,
		surname: req.body.surname ? req.body.surname : null,
		email: req.body.email ? req.body.email : null,
		image: req.body.image ? req.body.image : null,
		login: req.body.login ? req.body.login : null,
		birthdate: req.body.birthdate ? req.body.birthdate : null,
		status: req.body.status ? req.body.status : '',
		phone: req.body.phone ? req.body.phone : null,
		pass: bcrypt.hashSync(req.body.pass, salt)
	}

	db.query(sql, post, (error, results) => {

		if (error) {
			responce.status(false, errors.defaultError(error), res)
		} else {
			responce.status(true, {newUser: results[0]}, res)
		}

	})
}

exports.findUser = (req, res) => {
	const id = req.query.id
	db.query(`SELECT * FROM users WHERE id = ${id}`, (error, results) => {

		if(error) {
			responce.status(400, error, res)
		} else {
			responce.status(200, results, res)
		}

	})
}
