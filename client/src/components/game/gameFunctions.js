import { database } from '../../main';

export const getUsername = (userID, gameID) => {
	database
		.ref('games/' + gameID)
		.child('players')
		.get()
		.then((snapshot) => {
			return snapshot.val()[userID]['username'];
		});
};

export const getUUID = (username, gameID) => {
	database
		.ref('games/' + gameID)
		.child('players')
		.get()
		.then((snapshot) => {
			for (const [key, value] of Object.entries(snapshot.val())) {
				if (value['username'] === username) return key;
			}
			return null;
		});
};
