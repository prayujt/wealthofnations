<script>
	import Auth from './Auth.svelte';
	import FindLobby from '../lobby/FindLobby.svelte';
	import { Button, TextInput } from 'carbon-components-svelte';
	import { onMount, onDestroy, beforeUpdate, afterUpdate } from 'svelte';

	export let socket;

	onMount(() => {});
</script>

<div class="login-container">
	<Auth useRedirect={true} let:user let:loggedIn let:loginWithGoogle let:logout>
		{#if !loggedIn}
			<h1 class="title">Wealth of Nations</h1>
			<Button kind="ghost" on:click={loginWithGoogle}
				>Sign in with Google</Button
			>
		{:else}
			<FindLobby {socket} {user} {logout} />
		{/if}
	</Auth>
</div>

<style lang="scss">
	.login-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
