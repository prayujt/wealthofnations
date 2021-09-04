let db = require('rethinkdb');

exports.connect = async (callback) => {
	db.connect({ host: 'prayujt.com', db: 'wealthofnations' }).then(
		(connection) => {
			callback(connection);
		}
	);
};

exports.createTable = async (name, primaryKey, connection) => {
	await db.tableCreate(name, { primaryKey: primaryKey }).run(connection);
};

exports.createTableCallback = async (name, connection, callback) => {
	db.tableCreate(name).run(connection, () => {
		callback();
	});
};

exports.dropTable = async (table, connection) => {
	await db.tableDrop(table).run(connection);
};

exports.get = async (table, criteria, connection) => {
	let data = await db.table(table).filter(criteria).run(connection);
	return data;
};

exports.getIndex = async (table, index, value, connection) => {
	let data = await db
		.table(table)
		.getAll(value, { index: index })
		.run(connection);
};

exports.insert = async (table, connection, data) => {
	await db.table(table).insert(data).run(connection);
};

exports.insertCallback = async (table, connection, data, callback) => {
	db.table(table).insert(data).run(connection, callback);
};

exports.update = async (table, key, connection, data) => {
	await db.table(table).get(key).update(data).run(connection);
};

exports.replace = async (table, key, connection, data) => {
	await db.table(table).get(key).replace(data).run(connection);
	console.log('finished replacement');
};

exports.exists = async (table, key, connection) => {
	let exists = await db.table(table).get(key).run(connection);
	if (exists) return true;
	else return false;
};
