<script lang="ts">
	import { page } from '$app/state';
	import { LogOut, ArrowLeftRight, ArrowLeft, X } from 'lucide-svelte';
	import { mobileNav } from '$lib/nav.svelte';

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

	let isDrawerOpen = $derived(mobileOpen || mobileNav.isOpen);

	function handleItemClick(id: string) {
		onSelect(id);
		mobileNav.close();
	}

	function handleClose() {
		mobileNav.close();
	}
</script>

<!-- ========================================================================= -->
<!-- 1. MOBILE DRAWER OVERLAY (Appears when clicking VAULT on Phone)           -->
<!-- ========================================================================= -->
{#if isDrawerOpen}
	<!-- Backdrop -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		onclick={handleClose}
		class="fixed inset-0 bg-background/80 backdrop-blur-xs z-50 md:hidden transition-opacity"
	></div>

	<!-- Slide-in Drawer -->
	<div
		class="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-card border-r border-border p-4 z-50 flex flex-col justify-between shadow-2xl md:hidden transition-transform select-none"
	>
		<div class="space-y-4">
			<!-- Top Drawer Header with Back Button -->
			<div class="flex items-center justify-between pb-3 border-b border-border">
				<button
					type="button"
					onclick={handleClose}
					class="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg hover:bg-muted border border-border transition-colors cursor-pointer"
				>
					<ArrowLeft class="w-4 h-4" />
					<span>Back</span>
				</button>

				<div class="flex items-center gap-2">
					<div class="w-6 h-6 bg-primary text-primary-foreground flex items-center justify-center font-bold text-[10px] rounded-md shadow-xs">
						V
					</div>
					<span class="text-xs font-bold tracking-tight text-foreground">Menu</span>
				</div>
			</div>

			<!-- Navigation Items -->
			<nav class="space-y-1">
				{#each items as item}
					{@const isActive = activeId === item.id}
					<button
						type="button"
						onclick={() => handleItemClick(item.id)}
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
		</div>

		<!-- Footer: Mode Switch & Exit -->
		<div class="pt-3 border-t border-border space-y-1.5">
			{#if page.url.pathname === '/workspace'}
				<a
					href="/"
					onclick={handleClose}
					class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
				>
					<ArrowLeftRight class="w-3.5 h-3.5" />
					<span>Customer Ingestion Hub</span>
				</a>
			{:else}
				<a
					href="/workspace"
					onclick={handleClose}
					class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
				>
					<ArrowLeftRight class="w-3.5 h-3.5" />
					<span>Operator Console</span>
				</a>
			{/if}

			{#if onExit}
				<button
					type="button"
					onclick={() => {
						handleClose();
						onExit?.();
					}}
					class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-destructive hover:bg-destructive/10 border border-destructive/30 transition-colors cursor-pointer shadow-xs"
				>
					<LogOut class="w-3.5 h-3.5" />
					<span>Exit & Wipe Session</span>
				</button>
			{/if}
		</div>
	</div>
{/if}

<!-- ========================================================================= -->
<!-- 2. DESKTOP SIDEBAR (Static docked on MD and above)                         -->
<!-- ========================================================================= -->
<aside
	class="hidden md:flex md:flex-col w-60 shrink-0 border-r border-border bg-card p-3 select-none justify-between transition-colors"
>
	<!-- Navigation List -->
	<div class="space-y-4">
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
	</div>

	<!-- Footer: Switch Workspace Mode + Exit Session -->
	<div class="pt-3 border-t border-border space-y-1.5">
		{#if page.url.pathname === '/workspace'}
			<a
				href="/"
				class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
			>
				<ArrowLeftRight class="w-3.5 h-3.5" />
				<span>Customer Ingestion Hub</span>
			</a>
		{:else}
			<a
				href="/workspace"
				class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
			>
				<ArrowLeftRight class="w-3.5 h-3.5" />
				<span>Operator Console</span>
			</a>
		{/if}

		{#if onExit}
			<button
				type="button"
				onclick={onExit}
				class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-destructive hover:bg-destructive/10 border border-destructive/30 transition-colors cursor-pointer shadow-xs"
			>
				<LogOut class="w-3.5 h-3.5" />
				<span>Exit & Wipe Session</span>
			</button>
		{/if}
	</div>
</aside>

