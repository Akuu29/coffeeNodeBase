const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
	// res.sendFile(`${__dirname}/index.html`);
	res.send("こんちには");
	console.log("/ へアクセスがありました");
});

app.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});