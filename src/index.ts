import express from "express";
import bodyParser from "body-parser";

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

// // セッションにニックネームがなければログインページにリダイレクト
// app.use((req, res, next) => {
// 	if(req.session.nickname) {
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

app.use(bodyParser.urlencoded({extended: false}));

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

// signup
app.get("/signup", (req, res) => {
	res.render("signup", {});
});

// login
app.get("/login", (req, res) => {
	res.render("login", {});
});

// app.use(express.urlencoded ({express:false}));
app.post("/login", (req,res) => {
	console.log(req.body.nickname);
	console.log(req.body.password);
	// DBヘ登録
	const nickname = req.body.nickname;
	const password = req.body.password;

	const sql = "INSERT INTO USER_INFO ";

	con.query('INSERT INTO ', {}, function(error: any, responce: any) {

	})
});

// app.post("/login", (req, res) => {
// 	const nickname = req.body.nickname;
// 	const password = req.body.password;
// 	if(nickname == "admin" && password == "password") {
// 		req.session.regenerate((err) => {
// 			req.session.nickname = "admin";
// 			res.redirect("/");
// 		})
// 	}else{
// 		res.redirect("/");
// 	}
// });

// app.get("/logout", (req, res) => {
// 	req.session.destroy((err) => {
// 		res.redirect("/");
// 	})
// })

app.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});