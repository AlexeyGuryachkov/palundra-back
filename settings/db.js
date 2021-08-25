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
		const sql = "CREATE TABLE IF NOT EXISTS friends (id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY, status int, fromId bigint REFERENCES users(id), toId bigint REFERENCES users(id))"
		connection.query(sql, function (err, result) {
			if (err) throw err;
		})
		return console.log('connection success')
	}
})


/*
firends statuses:
0-rejected
1-approved
2-requested
*/

module.exports = connection