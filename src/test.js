const { MongoClient } = require('mongodb');
const uri = 'mongodb://prayujt.com:27017';
const client = new MongoClient(uri);

let thing = async () => {
	await client.connect();

	const database = client.db('wealthofnations');
	const lobbies = database.collection('lobbies');

	const doc = {
		title: 'Record of a Shriveled Datum',
		content: 'No bytes, no problem. Just insert a document, in MongoDB',
	};
	const result = await lobbies.insertOne(doc);
	console.log(result);
};

thing();
