const express = require("express")
const passport = require('passport')

const app = express()
const port = 3500


// app.use(function(req, res, next) {
// 	res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// 	next();
// });

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, DELETE, OPTIONS"
//   );
//   next();
// })

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


