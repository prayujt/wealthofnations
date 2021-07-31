const path = require('path');
const app = require('express')();
const http = require('http').Server(app);
const port = 8000;

app.get('/', (req, res) => {
	res.send('Hello World!');
});

http.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
