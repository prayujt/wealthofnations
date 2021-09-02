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

exports.exists = async (table, key) => {
	return db.table(table).getAll(key).count().eq(1);
};

exports.update = async (name, data) => {
	db.table(name)
		.insert({
			username: 'prayuj',
			netWorth: 6000000,
			debt: 0,
			balance: 5000000,
			influence: 100,
			bankrupt: false,
			companies: ['BoA'],
		})
		.run(connection, (err, result) => {
			if (err) throw err;
			console.log(JSON.stringify(result, null, 2));
		});
};
