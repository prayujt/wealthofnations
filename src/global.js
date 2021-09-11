const { MongoClient } = require('mongodb');

const uri =
	'mongodb://admin:chingchong123@prayujt.com:27017/?authSource=admin&readPreference=primary&directConnection=true&ssl=false';

let uniqueKeys = [];

exports.connect = async (database, callback) => {
	let client = new MongoClient(uri);
	client.connect().then(callback(client.db(database)));
};

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

exports.watch = async (collection, callback, client) => {
	let watcher = client.collection(collection).watch();
	watcher.on('change', async (value) => {
		let matched = this.match(value, client);
		if (!matched) {
			callback(value);
		}
	});
};

exports.exists = async (collection, query, client) => {
	let exists = await client.collection(collection).findOne(query);
	if (exists != null) return true;
	else return false;
};

exports.match = (documentID) => {
	let uniqueID = documentID.documentKey._id.toString();
	let value = uniqueKeys.includes(uniqueID);
	let returnValue = true;
	if (!value) {
		uniqueKeys.push(uniqueID);
		returnValue = false;
	}
	return returnValue;
};
