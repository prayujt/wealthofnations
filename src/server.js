let app = require('express')();
let http = require('http').Server(app);
const { MongoClient } = require('mongodb');

const { connect } = require('./global');
const {
	clientFindLobbyFunctions,
} = require('./functions/client/findLobbyFunctions');
const { initializeDatabase } = require('./events/InitializeDatabase');

const io = require('socket.io')(http, {
	cors: {
		origin: 'http://prayujt:2000',
		methods: ['GET', 'POST'],
	},
});

let port = 8000;

connect('wealthofnations', async (client) => {
	await initializeDatabase(client);
	io.on('connection', (socket) => {
		clientFindLobbyFunctions(socket, client, io);
	});
});

app.get('/', (req, res) => {
	res.send('Hello World!');
});

http.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
