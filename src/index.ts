import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import { resolveSoa } from "dns";

require("dotenv").config();

const mysql = require("mysql");
const app: express.Express = express();
const port = 3000;

// DB接続
const con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: process.env.DB_PASSWORD
});

con.connect(function(err: any) {
	if(err) throw err;
	console.log("Connected");
})

// // セッションにユーザ名がなければログインページにリダイレクト
// app.use((req, res, next) => {
// 	if(req.session.username) {
// 		next();
// 	} else {
// 		res.redirect("/login");
// 	}
// });

// // COURSの許可
// app.use((req, res, next) => {
// 	res.header("Access-Control-Arrow-Origin", "*");
// 	res.header("Access-Control-Arrow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
// 	next();
// })

// View Engineにejsを指定
app.set("view engine", "ejs");

// 静的ファイルの提供
app.use(express.static("public"));
// app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
	// res.sendFile(`${__dirname}/views/index.ejs`);
	res.render("index", {});
	// console.log("/ へアクセスがありました");
});

app.get("/login", (req, res) => {
	res.render("login", {});
})

app.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});

