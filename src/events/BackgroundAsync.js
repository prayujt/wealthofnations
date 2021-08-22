const backgroundAsync = async (database, key) => {
	database
		.ref('server/' + key)
		.child('timer')
		.on('value', (snapshot) => {
			if (snapshot.val() == true) {
				let gameRef = database.ref('games/' + key);
				let companies = await database
					.ref('games/' + key)
					.child('companies')
					.once('value');
				for (const [key, value] of Object.entries(companies.val())) {
					console.log(key);
					console.log(value);
				}
				database.ref('server/' + key).update({
					timer: false,
				});
			}
		});

	//setInterval(endTurn(database, key), 10000);
};

//const endTurn = async (database, key) => {
//let companies = await database.ref('games/' + key).child('companies').once('value');
//for (const [key, value] of Object.entries(companies.val())) {
//console.log(key);
//console.log(value);
//}
//}

exports.backgroundAsync = backgroundAsync;
