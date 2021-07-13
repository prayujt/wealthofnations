let database = require("./firebase").database;

database.ref("temp").on("child_added", async (snapshot) => {
	const id = snapshot.key;
	await sleep(2000);
	database.ref("temp/" + id).once("value", (snapshot) => {
		if (snapshot.exists()) {
			database.ref("users/" + id).remove();
			database.ref("temp/" + id).remove();
		}
	});
});

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
