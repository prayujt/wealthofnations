var admin = require('firebase-admin');

admin.initializeApp({
	credential: admin.credential.applicationDefault(),
	databaseURL: 'https://wealth-of-nations-default-rtdb.firebaseio.com',
});

const database = admin.database();
exports.database = database;
