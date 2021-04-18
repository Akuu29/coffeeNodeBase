import express from "express";
import bodyParser from "body-parser";
import session from "express-session";

require("dotenv").config();

const mysql = require("mysql");
const app: express.Express = express();
const port = 3000;

const MySQLStore = require("express-mysql-session")(session);

// DB情報
const con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});

const sessOption = {
	host: "localhost",
	user: "root",
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
}

const sessionStore = new MySQLStore(sessOption);

con.connect(function(err: any) {
	if(err) throw err;
	console.log("Connected");
});

// セッション生成
const sess = {
	secret: "secretSecretSecret",
	resave: false,
	saveUninitialized: true,
	cookie: {maxAge: 10 * 1000},
	// cookie: {},
	store: sessionStore
};

if(app.get("env") == "production") {
	app.set("trust proxy", 1)
	// sess.cookie.secure = true
}

app.use(session(sess));

app.use(bodyParser.urlencoded({extended: false}));

// View Engineにejsを指定
app.set("view engine", "ejs");

// 静的ファイルの提供
app.use(express.static("public"));
// app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
	// res.sendFile(`${__dirname}/views/index.ejs`);
	res.render("index", {});
});

app.get("/login", (req, res) => {
	res.render("login", {});
});

// ログイン
app.post("/login", (req: any,res: any) => {
	let loginNickname: string = req.body.nickname;
	let loginPassword: string = req.body.password;

	let selectUsers: string = "SELECT NICKNAME, PASSWORD FROM USERS WHERE NICKNAME = ? AND PASSWORD = ?";
	let usersInfo: any = [loginNickname, loginPassword];

	// con.query(selectUsers, loginNickname, loginPassword, function(error: any, responce: any) {
	con.query(selectUsers, usersInfo, function(error: any, results: any, fields: any) {
		if(error) throw error;
		// console.log(results);
		if(results != "") {
			req.session.regenerate((err: any) => {
				req.session.nickname = loginNickname; // セッション生成
				res.render("index", {});
			});
			
		}else{
			// ユーザネームまたはパスワードが間違っています。
			
		}
		
	});
});

// サインアップ
app.get("/signup", (req, res) => {
	res.render("signup", {});
});

app.post("/signup", (req, res) => {
	let signupNickname: string = req.body.nickname;
	let signupMailaddress: string = req.body.mailaddress;
	let signupPassword: string = req.body.password;
	let signupConfirm: string = req.body.confirm;

	// password欄confirm欄入力チェック 一致したら登録
	if(signupPassword == signupConfirm) {
		let insertUsers: string = "INSERT INTO USERS SET ?";
		let post: any = {"nickname": signupNickname, "mail_address": signupMailaddress, "password": signupPassword};

		con.query(insertUsers, post, function(error: any, results: any, fields: any) {
			if(error) throw error;
			console.log(results);
			res.render("index", {});
		});

	}else{
		;
	}

});



app.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});