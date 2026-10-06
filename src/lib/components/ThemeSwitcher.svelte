<script lang="ts">
	import { Sun, Moon } from 'lucide-svelte';
	import { getTheme, toggleTheme } from '#lib/theme.svelte';

	let { class: className = '' } = $props<{ class?: string }>();
	const theme = $derived(getTheme());
</script>

<button
	type="button"
	onclick={toggleTheme}
	class="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-colors cursor-pointer {className}"
	title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
	aria-label="Toggle theme"
>
	{#if theme === 'dark'}
		<Sun class="w-3.5 h-3.5 text-amber-400 transition-transform duration-200 rotate-0 hover:rotate-45" />
	{:else}
		<Moon class="w-3.5 h-3.5 text-indigo-500 transition-transform duration-200 rotate-0 hover:-rotate-12" />
	{/if}
</button>
