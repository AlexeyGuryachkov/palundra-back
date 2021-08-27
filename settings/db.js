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
		/*создаю таблицу друзей*/
		const sqlFriends = "CREATE TABLE IF NOT EXISTS friends (id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY, status int, fromId bigint REFERENCES users(id), toId bigint REFERENCES users(id))"
		connection.query(sqlFriends, function (err, result) {
			if (err) throw err;
		})
		/*создаю таблицу сообщений*/
		const sqlMessanges = "CREATE TABLE IF NOT EXISTS messages (id bigint NOT NULL AUTO_INCREMENT PRIMARY KEY, text varchar(10000), status int, fromId bigint REFERENCES users(id), toId bigint REFERENCES users(id))"
		connection.query(sqlMessanges, function (err, result) {
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

/*
messages statuses:
0-unreaded
1-readed
*/

module.exports = connection