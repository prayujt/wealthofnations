let firebase = require('firebase/app');
require('firebase/database');
let Game = require('./Game');

let games = [];

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
		.child('initializeGame')
		.on('value', (start) => {
			if (start.val()) games.push(new Game(snapshot.ref.key, database));
		});
});

const sleep = (ms) => {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
		d;
	});
};
