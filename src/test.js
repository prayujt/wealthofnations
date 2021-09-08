const { MongoClient } = require('mongodb');
const uri = 'mongodb://prayujt.com:27017';
const client = new MongoClient(uri);

let thing = async () => {
	await client.connect();
	console.log('connected');

	const database = client.db('wealthofnations');
	const lobbies = database.collection('lobbies');

	let watcher = lobbies.watch();
	watcher.on('change', (value) => {
		console.log(value);
	});
};

thing();
