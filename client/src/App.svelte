<script>
    import Auth from './auth/Auth.svelte';
    export let database;

    var gameStarted = false;
    let username;
    var color;
    let users = {};
    let id = "";

    const initialize = (id_) => {
        id = id_
        color = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
        database.ref('users/' + id).set({
            x: Math.floor(Math.random() * 1000),
            y: Math.floor(Math.random() * 1000),
            color: color,
            username: username
        });
        gameStarted = true;
    }

    const close = (event) => {
        database.ref('users/' + id).remove();
    }

    const handleKeydown = (event) => {
        let key = event.key;
        let pixels = 20;
        if (key == 's' && gameStarted) {
            database.ref('users/' + id).transaction(user => ({
                ...user,
                y: user.y + pixels
            })
            );
        }
        else if (key == 'w' && gameStarted) {
            database.ref('users/' + id).transaction(user => ({
                ...user,
                y: user.y - pixels
            })
            );
        }
        else if (key == 'd' && gameStarted) {
            database.ref('users/' + id).transaction(user => ({
                ...user,
                x: user.x + pixels
            })
            );
        }
        else if (key == 'a' && gameStarted) {
            database.ref('users/' + id).transaction(user => ({
                ...user,
                x: user.x - pixels
            })
            );
        }
    }

    database.ref('users').on('value', snapshot => {
        const data = snapshot.val();
        users = Object.keys(data ? data : []).map(k => ({
            ...data[k]
        }));
    });

</script>

<main>
    <Auth
        useRedirect={true}
        let:user
        let:loggedIn
        let:loginWithGoogle
        let:logout
    >
    {#if !loggedIn}
        <button type="button" on:click|preventDefault={loginWithGoogle}>Sign in with Google</button>
    {:else}
        {#if !gameStarted}
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" bind:value={username}><br><br>
            <button on:click={initialize(user.id)}>Start</button>
            <button type="button" on:click={logout}>Logout</button>
        {:else}
            {#each users as player}
                <span class="dot" style="background-color:{player.color}; position: absolute; left: {player.x}px; top: {player.y}px">{player.username}</span>
            {/each}
        {/if}
    {/if}
    </Auth>
</main>

<svelte:window on:keydown={handleKeydown} on:beforeunload={close}/>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

    .dot {
        height: 50px;
        width: 50px;
        border-radius: 50%;
        display: inline-block;
    }

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
