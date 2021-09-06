const { MongoClient } = require('mongodb');

const uri = 'mongodb://prayujt.com:27017';

exports.connect = async (database, callback) => {
	let client = new MongoClient(uri);
	client.connect().then(callback(client.db(database)));
};

// exports.createCollection = async (name, primaryKey, client) => {
// 	await client.collection(name);
// };

exports.dropCollection = async (collection, client) => {
	await client.collection(collection).drop();
};

exports.get = async (collection, query, client) => {
	let data = await client.collection(collection).findOne(query);
	return data;
};

exports.insert = async (collection, data, client) => {
	await client.collection(collection).insertOne(data);
};

exports.insertMany = async (collection, data, client) => {
	await client.collection(collection).insertMany(data);
};

exports.update = async (collection, filter, data, client) => {
	await client.collection(collection).updateOne(filter, data);
};

exports.replace = async (collection, query, data, client) => {
	await client.collection(collection).replaceOne(query, data);
};

exports.exists = async (collection, query, client) => {
	let exists = await client.collection(collection).findOne(query);
	if (exists != null) return true;
	else return false;
};
