<script>
	import Auth from "../auth/Auth.svelte";
	import { Button, TextInput } from "carbon-components-svelte";
</script>

<Auth useRedirect={true} let:user let:loggedIn let:loginWithGoogle let:logout>
	{#if !loggedIn}
		<Button kind="ghost" on:click={loginWithGoogle}>Sign in with Google</Button>
	{:else}
		<Button
			kind="ghost"
			on:click={() => {
				logout();
			}}>Logout</Button
		>
	{/if}
</Auth>
