const express = require("express")
const multer = require('multer')
const passport = require('passport')

const app = express()
const port = 3500

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

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	next();
});

//делаем наш парсинг в формате json
app.use(express.json())

// парсит запросы по типу: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

app.use(passport.initialize())
require('./middleware/passport')(passport)

const routes = require('./settings/routes')
routes(app)


// установить порт, и слушать запросы
app.listen(port, () => {
	console.log(`Сервер запущен на ${port} порту`)
})


