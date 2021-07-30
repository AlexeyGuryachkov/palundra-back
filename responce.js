'use strict'

exports.status = (success, result, res) => {

	const data = {
		success,
		result
	}

	res.status(200)
	res.json(data)
	res.end()

}