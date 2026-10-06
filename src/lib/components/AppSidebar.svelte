<script lang="ts">
	import { LogOut } from 'lucide-svelte';

	export interface SidebarItem {
		id: string;
		name: string;
		icon: any;
		badge?: string | number;
	}

	interface Props {
		items: SidebarItem[];
		activeId: string;
		onSelect: (id: string) => void;
		mobileOpen?: boolean;
		onExit?: () => void;
	}

	let {
		items,
		activeId,
		onSelect,
		mobileOpen = false,
		onExit
	}: Props = $props();
</script>

<aside
	class="{mobileOpen ? 'block' : 'hidden'} md:flex md:flex-col w-full md:w-60 shrink-0 border-r border-border bg-card p-3 select-none justify-between transition-colors"
>
	<!-- Navigation List -->
	<nav class="space-y-1">
		{#each items as item}
			{@const isActive = activeId === item.id}
			<button
				type="button"
				onclick={() => onSelect(item.id)}
				class="w-full flex items-center justify-between px-3 h-10 text-xs rounded-lg transition-all text-left relative cursor-pointer {isActive
					? 'bg-[#FF7675]/[0.12] border border-[#FF7675]/[0.16] text-[#FF7675] font-medium'
					: 'bg-transparent border border-transparent text-[#6B7280] hover:text-foreground hover:bg-[#FF7675]/[0.04] font-medium'}"
			>
				<div class="flex items-center gap-2.5 min-w-0">
					<item.icon class="w-4 h-4 shrink-0 {isActive ? 'text-[#FF7675]' : 'text-[#6B7280]'}" />
					<span class="truncate">{item.name}</span>
				</div>
				{#if item.badge !== undefined}
					<span class="text-xs font-mono font-medium {isActive ? 'text-[#FF7675]' : 'text-[#6B7280]'}">
						{item.badge}
					</span>
				{/if}
			</button>
		{/each}
	</nav>

	{#if onExit}
		<div class="pt-3 border-t border-border">
			<button
				type="button"
				onclick={onExit}
				class="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-destructive hover:bg-destructive/10 border border-destructive/30 transition-colors cursor-pointer shadow-xs"
			>
				<LogOut class="w-3.5 h-3.5" />
				<span>Exit Session</span>
			</button>
		</div>
	{/if}
</aside>
