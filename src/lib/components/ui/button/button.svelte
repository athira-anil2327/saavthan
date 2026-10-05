<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils';

	let {
		class: className,
		children,
		type = 'button',
		...restProps
	}: HTMLButtonAttributes & {
		children?: Snippet;
	} = $props();
</script>

<button
	{type}
	class={cn(
		'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF7675] disabled:pointer-events-none disabled:opacity-50',
		className
	)}
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}
</button>
