<script lang="ts">
	import { Sun, Moon } from 'lucide-svelte';
	import { toggleTheme } from '#lib/theme.svelte';

	let { class: className = '' } = $props<{ class?: string }>();
</script>

<button
	type="button"
	onclick={toggleTheme}
	class="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-colors cursor-pointer {className}"
	title="Toggle Light/Dark Theme"
	aria-label="Toggle theme"
>
	<Sun class="w-3.5 h-3.5 text-amber-400 hidden dark:inline-block transition-transform duration-200 rotate-0 hover:rotate-45" />
	<Moon class="w-3.5 h-3.5 text-indigo-500 inline-block dark:hidden transition-transform duration-200 rotate-0 hover:-rotate-12" />
</button>

