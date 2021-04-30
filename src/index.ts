import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
// import cookieParser from "cookie-parser";

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

// セッション生成用DB情報
const sessOption = {
	host: "localhost",
	user: "root",
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
}

const sessionStore = new MySQLStore(sessOption);

// con.connect(function(err: any) {
// 	if(err) throw err;
// 	console.log("Connected");
// });

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
	app.set("trust proxy", 1);
	// sess.cookie.secure = true
}

app.use(session(sess));
app.use(bodyParser.urlencoded({extended: false}));
// app.use(cookieParser());

// View Engineにejsを指定
app.set("view engine", "ejs");

// 静的ファイルの提供
app.use(express.static("public"));
// app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
	// res.sendFile(`${__dirname}/views/index.ejs`);
	res.render("index", {nickname: ""});
});

app.get("/login", (req, res) => {
	res.render("login", {});
});

// ログイン
app.post("/login", (req: any,res: any) => {
	con.connect(function(err: any) {
		if(err) throw err;
		console.log("Connected");
	});	

	let loginUser: any = req.body;
	let loginNickname: string = loginUser.nickname;
	let loginPassword: string = loginUser.password;

	let selectUsers: string = "SELECT NICKNAME, PASSWORD FROM USERS WHERE NICKNAME = ? AND PASSWORD = ?";
	let usersInfo: any = [loginNickname, loginPassword];

	// con.query(selectUsers, loginNickname, loginPassword, function(error: any, responce: any) {
	con.query(selectUsers, usersInfo, function(error: any, results: any, fields: any) {
		if(error) {
			throw error
		};
		// console.log(results);
		if(results != "") {
			req.session.regenerate((err: any) => {
				req.session.loginUser = {
					nickname: loginUser.nickname
				}; // セッション生成
				// console.log(req.session.loginUser.nickname);
				res.render("index", {nickname: req.session.loginUser.nickname}); // nickname: session.nickname
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

app.post("/signup", (req: any, res: any) => {
	con.connect(function(err: any) {
		if(err) throw err;
		console.log("Connected");
	});

	let signupUser: any = req.body;
	// let signupNickname: string = signupUser.nickname;
	// let signupMailaddress: string = signupUser.mailaddress;
	// let signupPassword: string = signupUser.password;
	// let signupConfirm: string = signupUser.confirm;

	// password欄confirm欄入力チェック 一致したら登録
	if(signupUser.password == signupUser.confirm) {
		let insertUsers: string = "INSERT INTO USERS SET ?";
		let post: any = {"nickname": signupUser.nickname, "mail_address": signupUser.mailaddress, "password": signupUser.password};

		con.query(insertUsers, post, function(error: any, results: any, fields: any) {
			if(error) {
				throw error;
			}
			// console.log(results);
			if(results != "") {
				req.session.regenerate((err: any) =>{
					req.session.signupUser = {
						nickname: signupUser.nickname
					};
					res.render("index", {nickname: req.session.signupUser.nickname});
				});
			}
		});

	}else{
		;
	}

});

app.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});