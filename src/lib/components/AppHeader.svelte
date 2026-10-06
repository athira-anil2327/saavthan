<script lang="ts">
	import ThemeSwitcher from './ThemeSwitcher.svelte';
	import { ChevronDown, RefreshCw, LogOut, Menu, X } from 'lucide-svelte';

	interface Props {
		title?: string;
		subtitle?: string;
		onRefresh?: () => void;
		onExit?: () => void;
		isRefreshing?: boolean;
		sessionId?: string | null;
		mobileNavOpen?: boolean;
		onToggleMobileNav?: () => void;
	}

	let {
		title = 'VAULT',
		subtitle = 'Manager',
		onRefresh,
		onExit,
		isRefreshing = false,
		sessionId,
		mobileNavOpen = false,
		onToggleMobileNav
	}: Props = $props();

	let userDropdownOpen = $state(false);
</script>

<header class="w-full h-14 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 shrink-0 select-none sticky top-0 z-30 transition-colors">
	<!-- Left: Brand & Title -->
	<div class="flex items-center gap-3 sm:gap-4">
		{#if onToggleMobileNav}
			<button
				type="button"
				onclick={onToggleMobileNav}
				class="md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted border border-border cursor-pointer transition-colors"
				aria-label="Toggle navigation"
			>
				{#if mobileNavOpen}
					<X class="w-4 h-4" />
				{:else}
					<Menu class="w-4 h-4" />
				{/if}
			</button>
		{/if}

		<div class="flex items-center gap-2">
			<a
				href="/"
				class="flex items-center gap-2.5 font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity cursor-pointer"
				title="Back to Vault Home"
			>
				<div class="w-7 h-7 bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs rounded-lg shadow-xs">
					V
				</div>
				<span class="text-base font-extrabold tracking-tight">VAULT</span>
			</a>
			{#if subtitle}
				<span class="text-muted-foreground/60 select-none text-xs">/</span>
				<a
					href="/manager"
					class="text-xs font-semibold text-muted-foreground hover:text-foreground uppercase tracking-wider transition-colors"
				>
					{subtitle}
				</a>
			{/if}
		</div>
	</div>

	<!-- Right Controls (Refresh, Theme, Profile) -->
	<div class="flex items-center gap-2 sm:gap-3">
		{#if onRefresh}
			<button
				type="button"
				onclick={onRefresh}
				class="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition-colors cursor-pointer shadow-xs"
				title="Refresh data"
				aria-label="Refresh data"
			>
				<RefreshCw class="w-3.5 h-3.5 {isRefreshing ? 'animate-spin text-primary' : ''}" />
			</button>
		{/if}

		<ThemeSwitcher />

		<!-- User Dropdown -->
		<div class="relative">
			<button
				type="button"
				onclick={() => (userDropdownOpen = !userDropdownOpen)}
				class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted border border-border transition-colors cursor-pointer text-xs shadow-xs"
			>
				<div class="w-6 h-6 rounded-md bg-muted text-foreground font-semibold text-xs flex items-center justify-center border border-border">
					AD
				</div>
				<span class="font-medium text-foreground hidden sm:inline">Admin Authority</span>
				<ChevronDown class="w-3.5 h-3.5 text-muted-foreground" />
			</button>

			{#if userDropdownOpen}
				<div class="absolute right-0 mt-1 w-56 rounded-lg bg-popover border border-border shadow-lg py-1 z-40 text-xs text-popover-foreground">
					<div class="px-3 py-2 border-b border-border">
						<p class="font-semibold text-foreground">Central Manager</p>
						<p class="text-muted-foreground font-mono text-[11px] truncate mt-0.5">
							Fleet Authority
						</p>
					</div>
					<a
						href="/manager"
						onclick={() => (userDropdownOpen = false)}
						class="w-full text-left px-3 py-2 hover:bg-muted flex items-center justify-between text-foreground transition-colors"
					>
						<span>Fleet & Tenant Manager</span>
					</a>
					<a
						href="/"
						onclick={() => (userDropdownOpen = false)}
						class="w-full text-left px-3 py-2 hover:bg-muted flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors border-t border-border"
					>
						<span>← Back to Vault Home</span>
					</a>
				</div>
			{/if}
		</div>
	</div>
</header>
