<script lang="ts">
	import { page } from '$app/state';
	import ThemeSwitcher from './ThemeSwitcher.svelte';
	import { ChevronDown, RefreshCw, LogOut, Menu, X } from 'lucide-svelte';
	import { mobileNav } from '#lib/nav.svelte';

	interface Props {
		onRefresh?: () => void;
		onExit?: () => void;
		isRefreshing?: boolean;
		sessionId?: string | null;
		mobileNavOpen?: boolean;
		onToggleMobileNav?: () => void;
	}

	let {
		onRefresh,
		onExit,
		isRefreshing = false,
		sessionId,
		mobileNavOpen = false,
		onToggleMobileNav
	}: Props = $props();

	let userDropdownOpen = $state(false);

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('#header-user-dropdown')) {
			userDropdownOpen = false;
		}
	}

	function handleVaultClick(e: MouseEvent) {
		if (typeof window !== 'undefined' && window.innerWidth < 768) {
			e.preventDefault();
			if (onToggleMobileNav) {
				onToggleMobileNav();
			} else {
				mobileNav.toggle();
			}
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<header class="w-full h-14 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 shrink-0 select-none sticky top-0 z-30 transition-colors">
	<!-- Left: Brand (Clicking Vault on Phone Opens Menu Bar) -->
	<div class="flex items-center gap-3 sm:gap-4">
		<a
			href="/"
			onclick={handleVaultClick}
			class="flex items-center gap-2.5 font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity cursor-pointer"
			title="Click to toggle menu on mobile"
		>
			<div class="w-7 h-7 bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs rounded-lg shadow-xs">
				V
			</div>
			<span class="text-base font-extrabold tracking-tight">VAULT</span>
		</a>
	</div>

	<!-- Right Controls -->
	<div class="flex items-center gap-2 sm:gap-3">
		{#if onRefresh}
			<button
				type="button"
				onclick={onRefresh}
				class="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-colors cursor-pointer shadow-xs"
				title="Refresh workspace files"
				aria-label="Refresh workspace files"
			>
				<RefreshCw class="w-3.5 h-3.5 {isRefreshing ? 'animate-spin text-primary' : ''}" />
			</button>
		{/if}

		<ThemeSwitcher />

		<!-- User / Operator Indicator Dropdown -->
		<div id="header-user-dropdown" class="relative">
			<button
				type="button"
				onclick={(e) => {
					e.stopPropagation();
					userDropdownOpen = !userDropdownOpen;
				}}
				class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted border border-border transition-colors cursor-pointer text-xs shadow-xs"
			>
				<div class="w-6 h-6 rounded-md bg-muted text-foreground font-semibold text-xs flex items-center justify-center border border-border">
					{page.url.pathname === '/workspace' ? 'OP' : 'CS'}
				</div>
				<span class="font-medium text-foreground hidden sm:inline">
					{page.url.pathname === '/workspace' ? 'Operator' : 'Customer'}
				</span>
				<ChevronDown class="w-3.5 h-3.5 text-muted-foreground" />
			</button>

			{#if userDropdownOpen}
				<div class="absolute right-0 mt-1.5 w-60 rounded-lg bg-popover border border-border shadow-lg py-1 z-50 text-xs text-popover-foreground">
					<div class="px-3 py-2 border-b border-border">
						<p class="font-semibold text-foreground">
							{page.url.pathname === '/workspace' ? 'Operator Console' : 'Customer Session'}
						</p>
						<p class="text-muted-foreground font-mono text-[11px] truncate mt-0.5">
							{sessionId ? sessionId.substring(0, 18) + '...' : 'active-node'}
						</p>
					</div>

					<div class="py-1 border-b border-border">
						<a
							href="/"
							onclick={() => (userDropdownOpen = false)}
							class="w-full text-left px-3 py-2 flex items-center justify-between transition-colors {page.url.pathname === '/' ? 'bg-accent text-accent-foreground font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'}"
						>
							<span>Customer Ingestion Hub</span>
							{#if page.url.pathname === '/'}
								<span class="text-[10px] text-primary font-bold">Active</span>
							{/if}
						</a>
						<a
							href="/workspace"
							onclick={() => (userDropdownOpen = false)}
							class="w-full text-left px-3 py-2 flex items-center justify-between transition-colors {page.url.pathname === '/workspace' ? 'bg-accent text-accent-foreground font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'}"
						>
							<span>Operator Workspace</span>
							{#if page.url.pathname === '/workspace'}
								<span class="text-[10px] text-primary font-bold">Active</span>
							{/if}
						</a>
					</div>

					{#if onExit}
						<div class="p-1">
							<button
								type="button"
								onclick={() => {
									userDropdownOpen = false;
									onExit?.();
								}}
								class="w-full text-left px-3 py-2 rounded-md text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors cursor-pointer font-medium"
							>
								<LogOut class="w-3.5 h-3.5" />
								<span>Wipe & Exit Session</span>
							</button>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</header>
