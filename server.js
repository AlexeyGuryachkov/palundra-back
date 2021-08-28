const http = require("http")
const express = require("express")
const multer = require('multer')
const passport = require('passport')
const WebSocket  = require('ws')
const jwt = require('jsonwebtoken')
const config = require('./config')

const app = express()
const port = 3500

const server = http.createServer(app)

const webSocketServer = new WebSocket.Server({ server })

//приём файлов
const storage = multer.diskStorage({
	destination: function (req, file, callback) {
    callback(null, '/IT/backend/palundra-back/files/images')
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname + '-' + Date.now() + '.png')
  }
})

exports.upload = multer({ storage: storage }).single('image')

// To upload multiple image 
//var upload = multer({ storage: storage }).array('images', maxCount);
// req.files is array of `images` files
// maxCount files could be uploaded 

// заголовки corse
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	next();
});

//парсинг в формате json
app.use(express.json())

// парсит запросы по типу: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

app.use(passport.initialize())
require('./middleware/passport')(passport)

const routes = require('./settings/routes')
routes(app)

const wsMap = new Map()
module.exports.wsMap = wsMap


// webScocket
webSocketServer.on('connection', ws => {
	console.log('ws connected')

	let user_id = ''

	ws.on('message', m => {
		const token = JSON.parse(m).token

		if (!token) {
			ws.close(401, 'Unauthorized')
			console.log('Close, unauthorized')
		} else {
			jwt.verify(token, config.jwt, function (err, decoded) {

				if (err) {
					ws.close(1011, "Token cannot be decrypted")
					console.log('Token cannot be decrypted', err)
				} else {
					console.log('Token decrypted:',decoded)
					user_id = decoded.userId

					if (!wsMap.has(user_id)) {
						wsMap.set(user_id, ws)
					}
				}
			})

		}
	})

	ws.on("error", e => ws.send(e))

	ws.on("close", () => {
		wsMap.delete(user_id)
	})
	
	ws.send(JSON.stringify({type: 'log', data: 'ws connected'}))
})


// установить порт, и слушать запросы
server.listen(port, () => {
	console.log(`Сервер запущен на ${port} порту`)
})
