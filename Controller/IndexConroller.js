'use strict'

const responce = require('./../responce')

exports.index = (req, res) => {

	responce.status('hello Rest api nodejs', res)
	
}