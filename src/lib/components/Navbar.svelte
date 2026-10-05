<script lang="ts">
	import { ExternalLink, Menu, X } from "@lucide/svelte";
	import { page } from "$app/state";

	interface Props {
		currentPath?: string;
	}

	let { currentPath }: Props = $props();

	let mobileMenuOpen = $state(false);

	const githubRepoUrl = "https://github.com/athira-anil2327/vault";

	// Determine active path from props or $app/state
	let pathname = $derived(currentPath ?? page.url.pathname);
</script>

<header class="w-full bg-[#FFFFFF] border-b border-[#E5E7EB] sticky top-0 z-50">
	<div class="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16 h-18 flex items-center justify-between">
		<!-- Left: VAULT Logo/Text -->
		<a href="/" class="flex items-center gap-2 group">
			<span class="text-xl font-bold tracking-wider text-[#202124] transition-colors group-hover:text-[#ff7675]">
				VAULT
			</span>
		</a>

		<!-- Right: Navigation Actions (Desktop) -->
		<nav class="hidden md:flex items-center gap-8 text-sm font-medium">
			<a
				href="/login"
				class="text-[#6B7280] hover:text-[#202124] transition-colors py-1 {pathname === '/login' ? 'text-[#202124] font-semibold' : ''}"
			>
				Login
			</a>

			<a
				href={githubRepoUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-1 text-[#6B7280] hover:text-[#202124] transition-colors py-1"
			>
				<span>Source</span>
				<ExternalLink class="size-3.5 opacity-60" />
			</a>

			<a
				href="/selfhost"
				class="py-1 transition-colors relative {pathname === '/selfhost' ? 'text-[#ff7675] font-semibold' : 'text-[#6B7280] hover:text-[#202124]'}"
			>
				Selfhost Guide
				{#if pathname === '/selfhost'}
					<span class="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#ff7675] rounded-full"></span>
				{/if}
			</a>
		</nav>

		<!-- Mobile Menu Button -->
		<button
			type="button"
			aria-label="Toggle navigation"
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
			class="md:hidden p-2 rounded-lg text-[#6B7280] hover:text-[#202124] hover:bg-[#F8F9FA] transition-colors cursor-pointer"
		>
			{#if mobileMenuOpen}
				<X class="size-5" />
			{:else}
				<Menu class="size-5" />
			{/if}
		</button>
	</div>

	<!-- Mobile Navigation Drawer -->
	{#if mobileMenuOpen}
		<div class="md:hidden border-t border-[#E5E7EB] bg-[#FFFFFF] px-6 py-4 space-y-2">
			<a
				href="/login"
				onclick={() => (mobileMenuOpen = false)}
				class="block px-3 py-2 rounded-lg text-sm font-medium transition-colors {pathname === '/login' ? 'bg-[#fff0f0] text-[#ff7675]' : 'text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#202124]'}"
			>
				Login
			</a>
			<a
				href={githubRepoUrl}
				target="_blank"
				rel="noopener noreferrer"
				onclick={() => (mobileMenuOpen = false)}
				class="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#202124] transition-colors"
			>
				<span>Source</span>
				<ExternalLink class="size-4 opacity-60" />
			</a>
			<a
				href="/selfhost"
				onclick={() => (mobileMenuOpen = false)}
				class="block px-3 py-2 rounded-lg text-sm font-medium transition-colors {pathname === '/selfhost' ? 'bg-[#fff0f0] text-[#ff7675] font-semibold' : 'text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#202124]'}"
			>
				Selfhost Guide
			</a>
		</div>
	{/if}
</header>
