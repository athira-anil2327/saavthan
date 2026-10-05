<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils';

	let {
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		children?: Snippet;
	} = $props();
</script>

<div
	class={cn(
		'rounded-xl border border-[#E5E7EB] bg-white text-[#202124] shadow-none',
		className
	)}
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}
</div>
