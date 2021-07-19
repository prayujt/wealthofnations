<script>
	import Auth from "../auth/Auth.svelte";
	import Game from "./Game.svelte";
	import { Button, TextInput } from "carbon-components-svelte";
	import { onMount, onDestroy, beforeUpdate, afterUpdate } from "svelte";

	export let database;

	onMount(() => {});
</script>

<Auth useRedirect={true} let:user let:loggedIn let:loginWithGoogle let:logout>
	{#if !loggedIn}
		<Button kind="ghost" on:click={loginWithGoogle}>Sign in with Google</Button>
	{:else}
		<!-- <Button
			kind="ghost"
			on:click={() => {
				logout();
			}}>Logout</Button
		> -->
		<Game />
	{/if}
</Auth>

<style>
</style>
