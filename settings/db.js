const mysql = require('mysql')
const config = require('../config')

const connection = mysql.createConnection({
	host: config.HOST,
	user: config.DBUSER,
	password: config.DBPASSWORD,
	database: config.DBNAME
})

connection.connect((error) => {
	if(error) {
		return console.log('connection error', error)
	} else {
		return console.log('connection success')
	}
})

module.exports = connection