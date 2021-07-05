<script>
    export let database;

    var gameStarted = false;
    let username;
    var color;
    let users = {};

    const initialize = () => {
        color = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
        database.ref('users/' + username).set({
            x: Math.floor(Math.random() * 1000),
            y: Math.floor(Math.random() * 1000),
            color: color
        });
        gameStarted = true;
    }

    const close = (event) => {
        database.ref('users/' + username).remove();
    }

    const handleKeydown = (event) => {
        let key = event.key;
        let pixels = 10;
        if (key == 's' && gameStarted) {
            database.ref('users/' + username).transaction(user => ({
                ...user,
                y: user.y + pixels
            })
            );
        }
        else if (key == 'w' && gameStarted) {
            database.ref('users/' + username).transaction(user => ({
                ...user,
                y: user.y - pixels
            })
            );
        }
        else if (key == 'd' && gameStarted) {
            database.ref('users/' + username).transaction(user => ({
                ...user,
                x: user.x + pixels
            })
            );
        }
        else if (key == 'a' && gameStarted) {
            database.ref('users/' + username).transaction(user => ({
                ...user,
                x: user.x - pixels
            })
            );
        }
    }

    database.ref('users').on('value', snapshot => {
        const data = snapshot.val();
        users = Object.keys(data ? data : []).map(k => ({
            ...data[k],
            name: k
        }));
    });

</script>

<main>
    {#if !gameStarted}
        <h1>Hello!</h1>
        <p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" bind:value={username}><br><br>
        <button on:click={initialize}>Start</button>
    {:else}
        {#each users as player}
            <span class="dot" style="background-color:{player.color}; position: absolute; left: {player.x}px; top: {player.y}px"></span>
        {/each}
    {/if}
</main>

<svelte:window on:keydown={handleKeydown} on:beforeunload={close}/>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

    .dot {
        height: 25px;
        width: 25px;
        border-radius: 50%;
        display: inline-block;
    }

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
