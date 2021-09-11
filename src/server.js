let app = require('express')();
let http = require('http').Server(app);
const { MongoClient } = require('mongodb');

const { connect } = require('./global');
const { clientLobbyFunctions } = require('./functions/client/lobbyFunctions');
const { serverLobbyFunctions } = require('./functions/server/lobbyFunctions');
const { initializeDatabase } = require('./events/InitializeDatabase');

const io = require('socket.io')(http, {
	cors: {
		origin: 'http://localhost:2000',
		methods: ['GET', 'POST'],
	},
});

let port = 8000;

connect('wealthofnations', async (client) => {
	await initializeDatabase(client);
	await serverLobbyFunctions(client, io);
	io.on('connection', (socket) => {
		console.log('user connected');
		clientLobbyFunctions(client, socket);
	});
});

app.get('/', (req, res) => {
	res.send('Hello World!');
});

http.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
