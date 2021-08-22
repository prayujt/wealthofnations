const backgroundTimer = (database, key) => {
	database
		.ref('server/' + key)
		.child('timer')
		.on('value', (snapshot) => {});
};

events.backgroundTimer = backgroundTimer;
