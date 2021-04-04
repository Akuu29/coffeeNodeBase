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
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
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


// login
app.get("/login", (req, res) => {
	res.render("login", {});
});

// app.use(express.urlencoded ({express:false}));
app.post("/login", (req,res) => {
	console.log(req.body.nickname);
	console.log(req.body.password);
	
	let loginNickname: string = req.body.nickname;
	let loginPassword: string = req.body.password;

	let selectUsersinfo: string = "SELECT NICKNAME, PASSWORD FROM USER_INFO WHERE NICKNAME = ? AND PASSWORD = ?";

	con.query(selectUsersinfo, {}, function(error: any, responce: any) {

	})
});

// signup
app.get("/signup", (req, res) => {
	res.render("signup", {});
});

app.post("/signup", (req, res) => {
	console.log(req.body.nickname);
	console.log(req.body.mailaddress);
	console.log(req.body.password);

	let signupNickname: string = req.body.nickname;
	let signupMailaddress: string = req.body.mailaddress;
	let signupPassword: string = req.body.password;
	let signupConfirm: string = req.body.confirm;

	// password欄confirm欄入力チェック 一致したら登録
	if(signupPassword == signupConfirm) {
		let insertUsers: string = "INSERT INTO USERS SET ?";
		let post: any = {"nickname": signupNickname, "mail_address": signupMailaddress, "password": signupPassword};

		con.query(insertUsers, post, function(error: any, responce: any) {
			if(error) throw error;
			res.render("index", {});
		});

	}else{
		// エラーメッセージ
	}

});



app.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});