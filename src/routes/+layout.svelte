<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { initTheme } from '#lib/theme.svelte';

	let { children } = $props();

	onMount(() => {
		initTheme();
	});
</script>

<div class="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased selection:bg-accent selection:text-primary transition-colors duration-200">
	{@render children()}
</div>
