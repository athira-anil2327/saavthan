<script lang="ts">
	import { page } from '$app/state';
	import ThemeSwitcher from './ThemeSwitcher.svelte';
	import { ChevronDown, RefreshCw, LogOut, Menu, X, ArrowLeftRight, Server, FolderSync, UploadCloud } from 'lucide-svelte';
	import { mobileNav } from '$lib/nav.svelte';

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
		subtitle,
		onRefresh,
		onExit,
		isRefreshing = false,
		sessionId,
		mobileNavOpen = false,
		onToggleMobileNav
	}: Props = $props();

	let userDropdownOpen = $state(false);

	const isWorkspace = $derived(page.url.pathname.startsWith('/workspace'));
	const isManager = $derived(page.url.pathname.startsWith('/manager'));
	const isUpload = $derived(page.url.pathname.startsWith('/upload') || page.url.pathname.startsWith('/p'));

	const roleBadge = $derived(isManager ? 'AD' : isWorkspace ? 'OP' : 'CS');
	const roleTitle = $derived(isManager ? 'Admin Authority' : isWorkspace ? 'Operator Console' : 'Customer Session');

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('#header-user-dropdown')) {
			userDropdownOpen = false;
		}
	}

	function handleVaultClick(e: MouseEvent) {
		if (typeof window !== 'undefined' && window.innerWidth < 768) {
			if (onToggleMobileNav) {
				e.preventDefault();
				onToggleMobileNav();
			} else {
				mobileNav.toggle();
			}
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

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
				onclick={handleVaultClick}
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
				<span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
					{subtitle}
				</span>
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
					{roleBadge}
				</div>
				<span class="font-medium text-foreground hidden sm:inline">{roleTitle}</span>
				<ChevronDown class="w-3.5 h-3.5 text-muted-foreground" />
			</button>

			{#if userDropdownOpen}
				<div class="absolute right-0 mt-1.5 w-60 rounded-lg bg-popover border border-border shadow-lg py-1 z-50 text-xs text-popover-foreground">
					<div class="px-3 py-2 border-b border-border">
						<p class="font-semibold text-foreground">{roleTitle}</p>
						<p class="text-muted-foreground font-mono text-[11px] truncate mt-0.5">
							{sessionId ? sessionId.substring(0, 18) + '...' : isManager ? 'Fleet Central Authority' : 'active-node'}
						</p>
					</div>

					<div class="py-1 border-b border-border">
						<a
							href="/workspace"
							onclick={() => (userDropdownOpen = false)}
							class="w-full text-left px-3 py-2 flex items-center justify-between transition-colors {isWorkspace ? 'bg-accent text-accent-foreground font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'}"
						>
							<div class="flex items-center gap-2">
								<FolderSync class="w-3.5 h-3.5" />
								<span>Operator Workspace</span>
							</div>
							{#if isWorkspace}
								<span class="text-[10px] text-primary font-bold">Active</span>
							{/if}
						</a>

						<a
							href="/manager"
							onclick={() => (userDropdownOpen = false)}
							class="w-full text-left px-3 py-2 flex items-center justify-between transition-colors {isManager ? 'bg-accent text-accent-foreground font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'}"
						>
							<div class="flex items-center gap-2">
								<Server class="w-3.5 h-3.5" />
								<span>Fleet & Tenant Manager</span>
							</div>
							{#if isManager}
								<span class="text-[10px] text-primary font-bold">Active</span>
							{/if}
						</a>

						<a
							href="/upload"
							onclick={() => (userDropdownOpen = false)}
							class="w-full text-left px-3 py-2 flex items-center justify-between transition-colors {isUpload ? 'bg-accent text-accent-foreground font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'}"
						>
							<div class="flex items-center gap-2">
								<UploadCloud class="w-3.5 h-3.5" />
								<span>Customer Drop Portal</span>
							</div>
							{#if isUpload}
								<span class="text-[10px] text-primary font-bold">Active</span>
							{/if}
						</a>
					</div>

					{#if onExit}
						<div class="p-1 border-b border-border">
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

					<div class="p-1">
						<a
							href="/"
							onclick={() => (userDropdownOpen = false)}
							class="w-full text-left px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 flex items-center justify-between transition-colors text-[11px]"
						>
							<span>← Back to Vault Home</span>
						</a>
					</div>
				</div>
			{/if}
		</div>
	</div>
</header>
