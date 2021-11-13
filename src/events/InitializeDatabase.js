const {
	connect,
	createCollection,
	dropCollection,
	dropDatabase,
} = require('../global');

exports.initializeDatabase = async (client) => {
	client.admin().listDatabases(async (err, result) => {
		let databases = result.databases;
		databases.forEach(async (element) => {
			if (element.name.startsWith('wealthofnations')) {
				connect(element.name, async (newDatabase) => {
					await dropDatabase(newDatabase);
				});
			}
		});
	});
};
