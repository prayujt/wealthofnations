<script>
	export let username;
	export let message;
</script>

<div class="message-container">
	<p>{username}: {message}</p>
</div>

<style lang="scss">
	.message-container {
		border: 1px solid black;
		width: 4rem;
		overflow-wrap: normal;
	}
</style>
