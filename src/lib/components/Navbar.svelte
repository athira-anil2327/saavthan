<script lang="ts">
	import { page } from '$app/state';
	import ThemeSwitcher from './ThemeSwitcher.svelte';
	import { Menu, X, ArrowRight, Shield, ExternalLink } from 'lucide-svelte';

	let mobileMenuOpen = $state(false);

	const navLinks = [
		{ label: 'Overview', href: '/' },
		{ label: 'Pricing', href: '/start' },
		{ label: 'Self-Host', href: '/selfhost' }
	];
</script>

<header class="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-colors">
	<div class="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-8">
		<!-- Left: Brand Logo & Main Nav -->
		<div class="flex items-center gap-6 md:gap-8">
			<a href="/" class="flex items-center gap-2.5 font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity">
				<div class="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shadow-xs">
					V
				</div>
				<span class="text-base font-extrabold tracking-tight">VAULT</span>
			</a>

			<!-- Desktop Nav Links -->
			<nav class="hidden md:flex items-center gap-1 text-xs font-medium">
				{#each navLinks as link}
					{@const isActive = link.href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(link.href)}
					<a
						href={link.href}
						class="px-3 py-1.5 rounded-md transition-colors {isActive ? 'text-foreground font-semibold bg-muted' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'}"
					>
						{link.label}
					</a>
				{/each}
			</nav>
		</div>

		<!-- Right: Action Buttons & Theme Switcher -->
		<div class="flex items-center gap-2 sm:gap-3">
			<a
				href="https://github.com/fahimshafeek/Saavthan"
				target="_blank"
				rel="noopener noreferrer"
				class="hidden sm:inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
				title="GitHub Source"
				aria-label="GitHub Source"
			>
				<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
					<path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
				</svg>
			</a>

			<ThemeSwitcher />

			<div class="hidden sm:flex items-center gap-2 border-l border-border pl-2 sm:pl-3">
				<a
					href="/login"
					class="inline-flex items-center justify-center h-8 px-3 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
				>
					Sign In
				</a>
				<a
					href="/manager"
					class="inline-flex items-center justify-center gap-1.5 h-8 px-3.5 rounded-md text-xs font-semibold bg-primary text-primary-foreground shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
				>
					<span>Open Manager</span>
					<ArrowRight class="w-3.5 h-3.5" />
				</a>
			</div>

			<!-- Mobile Menu Button -->
			<button
				type="button"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				class="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted border border-border cursor-pointer transition-colors"
				aria-label="Toggle navigation"
			>
				{#if mobileMenuOpen}
					<X class="w-4 h-4" />
				{:else}
					<Menu class="w-4 h-4" />
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile Dropdown Menu -->
	{#if mobileMenuOpen}
		<div class="md:hidden border-b border-border bg-background px-4 py-4 space-y-3 shadow-lg">
			<nav class="space-y-1">
				{#each navLinks as link}
					{@const isActive = page.url.pathname === link.href}
					<a
						href={link.href}
						onclick={() => (mobileMenuOpen = false)}
						class="block px-3 py-2 rounded-md text-sm font-medium transition-colors {isActive ? 'bg-accent text-accent-foreground font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}"
					>
						{link.label}
					</a>
				{/each}
			</nav>

			<div class="pt-3 border-t border-border grid grid-cols-2 gap-2">
				<a
					href="/login"
					onclick={() => (mobileMenuOpen = false)}
					class="w-full inline-flex items-center justify-center h-9 rounded-md text-xs font-medium border border-border text-foreground hover:bg-muted"
				>
					Sign In
				</a>
				<a
					href="/manager"
					onclick={() => (mobileMenuOpen = false)}
					class="w-full inline-flex items-center justify-center gap-1.5 h-9 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-xs"
				>
					<span>Manager</span>
					<ArrowRight class="w-3 h-3" />
				</a>
			</div>
		</div>
	{/if}
</header>
