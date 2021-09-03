let db = require('rethinkdb');

exports.connect = async (callback) => {
	db.connect({ host: 'prayujt.com', db: 'wealthofnations' }).then(
		(connection) => {
			callback(connection);
		}
	);
};

exports.createTable = async (name, primaryKey, connection, callback) => {
	db.tableCreate(name, { primaryKey: primaryKey }).run(connection, () => {
		callback();
	});
};

exports.createTableBasic = async (name, connection, callback) => {
	db.tableCreate(name).run(connection, () => {
		callback();
	});
};

exports.insert = async (name, connection, data) => {
	db.table(name)
		.insert(data)
		.run(connection, () => {});
};

exports.insertCallback = async (name, connection, data, callback) => {
	db.table(name).insert(data).run(connection, callback);
};

exports.dropTable = async (name, connection) => {
	db.tableDrop(name).run(connection, () => {});
	return true;
};

exports.exists = async (table, key) => {
	return db.table(table).getAll(key).count().eq(1);
};
