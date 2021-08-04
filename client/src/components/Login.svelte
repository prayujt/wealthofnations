<script>
	import Auth from '../auth/Auth.svelte';
	import FindLobby from './FindLobby.svelte';
	import { Button, TextInput } from 'carbon-components-svelte';
	import { onMount, onDestroy, beforeUpdate, afterUpdate } from 'svelte';

	export let database;

	onMount(() => {});
</script>

<Auth useRedirect={true} let:user let:loggedIn let:loginWithGoogle let:logout>
	{#if !loggedIn}
		<Button kind="ghost" on:click={loginWithGoogle}>Sign in with Google</Button>
	{:else}
		<FindLobby {database} {user} {logout} />
	{/if}
</Auth>

<style>
</style>
