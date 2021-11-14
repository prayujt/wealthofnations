const { MongoClient } = require('mongodb');

const uri =
	'mongodb://admin:testing@prayujt.com:27017/?authSource=admin&readPreference=primary&directConnection=true&ssl=false';

exports.connect = async (database, callback) => {
	let client = new MongoClient(uri);
	await client.connect();
	callback(client.db(database));
};

exports.databaseExists = async (database, client) => {
	let promise = await client.admin().listDatabases();
	data = promise['databases'];
	for (let i = 0; i < data.length; i++) {
		if (data[i]['name'] == database) return true;
	}
	return false;
};

exports.dropDatabase = async (client) => {
	client.dropDatabase(() => {});
};

exports.createCollection = async (collection, client) => {
	await client.createCollection(collection);
};

exports.dropCollection = async (collection, client) => {
	await client.collection(collection).drop();
};

exports.remove = async (collection, filter, client) => {
	await client.collection(collection).deleteOne(filter);
};

exports.removeAll = async (collection, filter, client) => {
	await client.collection(collection).deleteMany(filter);
};

exports.get = async (collection, query, client) => {
	let data = await client.collection(collection).findOne(query);
	return data;
};

exports.getAll = async (collection, query, client) => {
	let data = await client.collection(collection).find(query);
	return data.toArray();
};

exports.insert = async (collection, data, client) => {
	try {
		await client.collection(collection).insertOne(data);
	} catch (MongoServerError) {
		console.log('Caught duplicate!');
	}
};

exports.insertMany = async (collection, data, client) => {
	await client.collection(collection).insertMany(data);
};

exports.update = async (collection, filter, data, client) => {
	await client.collection(collection).updateOne(filter, data);
};

exports.updateField = async (collection, filter, data, client) => {
	await client.collection(collection).updateOne(filter, { $set: data });
};

exports.replace = async (collection, query, data, client) => {
	await client.collection(collection).replaceOne(query, data);
};

exports.watch = async (collection, callback, client) => {
	let watcher = client.collection(collection).watch();

	watcher.on('change', async (value) => {
		callback(value);
	});
};

exports.distinct = async (collection, field, client) => {
	let distinctValues = await client.collection(collection).distinct(field);
	return distinctValues;
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
