<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { initTheme } from '#lib/theme.svelte';
	import AppHeader from '#lib/components/AppHeader.svelte';

	let { children } = $props();

	onMount(() => {
		initTheme();
	});
</script>

<div class="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased selection:bg-accent selection:text-primary transition-colors duration-200">
	<!-- Top Navigation Bar -->
	<AppHeader />

	<!-- Layout Body: Flush Left Sidebar + Main Content Container -->
	<div class="flex-1 flex flex-col md:flex-row w-full min-h-[calc(100vh-56px)]">
		{@render children()}
	</div>
</div>
