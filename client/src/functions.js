import { database } from './main';

export const getUsernameLobby = (userID, gameID) => {
	database
		.ref('lobbies/' + gameID)
		.child('players')
		.get()
		.then((snapshot) => {
			return snapshot.val()[userID];
		});
};

export const getUUIDLobby = (username, gameID) => {
	database
		.ref('lobbies/' + gameID)
		.child('players')
		.get()
		.then((snapshot) => {
			for (const [key, value] of Object.entries(snapshot.val())) {
				if (value === username) return key;
			}
			return null;
		});
};
