module.exports = class Player {
	constructor(gameID, uuid, username, database) {
		this.gameID = gameID;
		this.database = database;
		this.uuid = uuid;
		this.username = username;

		database
			.ref('games/' + gameID)
			.child('players')
			.child(uuid)
			.set({
				username: username,
				netWorth: 1000000,
				debt: 0,
				balance: 1000000,
				influence: 100,
				bankrupt: false,
			});
		console.log('Initialized Player with ID ' + uuid);
	}

	getGameID = () => {
		return this.gameID;
	};

	getUsername = () => {
		return this.username;
	};

	getUUID = () => {
		return this.uuid;
	};
};
