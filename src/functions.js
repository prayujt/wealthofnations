let firebase = require('firebase/app');
require('firebase/database');
const { initializeGame } = require('./events/InitializeGame');
const { backgroundAsync } = require('./events/BackgroundAsync');

var firebaseConfig = {
	apiKey: 'AIzaSyAV_lm-m49nT1uaXBzwBwZsXzsV16ZmdiI',
	authDomain: 'wealth-of-nations.firebaseapp.com',
	databaseURL: 'https://wealth-of-nations-default-rtdb.firebaseio.com',
	projectId: 'wealth-of-nations',
	storageBucket: 'wealth-of-nations.appspot.com',
	messagingSenderId: '585602058367',
	appId: '1:585602058367:web:2d7e2915b43f466e57d74a',
	measurementId: 'G-LWK0DJPE26',
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

database.ref('lobbies').on('child_added', (snapshot) => {
	database
		.ref('server/' + snapshot.ref.key)
		.child('initializingGame')
		.on('value', (start) => {
			if (start.val()) {
				initializeGame(snapshot.ref.key, database).then(() => {
					// new Game(snapshot.ref.key, database);
					gameFunctions(snapshot.ref.key).then(() => {});
				});
			}
		});
});

const gameFunctions = async (key) => {
	// insert server-side function calls to events/ files

	// run asynchronous tasks in game background
	database
		.ref('server/' + key)
		.child('initializingGame')
		.on('value', (start) => {
			if (start.val() == false) {
				backgroundAsync(database, key);
			}
		});
};
