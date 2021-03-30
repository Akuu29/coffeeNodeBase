import express = require("express");
import session = require("express-session");

const app = express();

app.use(
  session({
    secret: "keyboard cat",
    // secret: 指定した文字列をしようしてクッキーIDを暗号化し、クッキーIDが書き換えられているか判断する
    resave: false,
    // resave: セッションにアクセスすると上書きされるオプション
    saveUninitialized: false,
    // saveUninitialized: 未初期化状態のセッションも保存するようなオプション
    cookie: {
      httpOnly: true,
      // httpOnly: クライアント川でクッキー値を見れない、書き換えられないようにするオプション
      secure: true,
      // secure: false,
      // secure: httpsで使用する場合はtrueにする
      maxAge: 1000 * 60 * 30
      // maxAge: セッションの消滅時間。単位はミリ秒。今回は３０分。
    }
  }),
);