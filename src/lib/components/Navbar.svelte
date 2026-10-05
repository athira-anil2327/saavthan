<script lang="ts">
	import { Search, User, Menu, X, Shield } from "@lucide/svelte";

	interface Props {
		currentPath?: string;
	}

	let { currentPath = "/download" }: Props = $props();
	let mobileMenuOpen = $state(false);

	const navLinks = [
		{ name: "Home", href: "/" },
		{ name: "Features", href: "/features" },
		{ name: "Download", href: "/download" },
		{ name: "Docs", href: "/docs" },
		{ name: "Community", href: "/community" },
	];
</script>

<header class="w-full bg-[#FFFFFF] border-b border-[#E5E7EB] sticky top-0 z-50">
	<div class="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16 h-18 sm:h-20 flex items-center justify-between">
		<!-- Left: Logo & Brand -->
		<div class="flex items-center gap-8 lg:gap-12">
			<a href="/" class="flex items-center gap-3 group">
				<div class="w-9 h-9 rounded-lg bg-[#ff7675] flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105">
					<Shield class="size-5 fill-white/20 stroke-[2.2]" />
				</div>
				<span class="text-xl font-semibold tracking-tight text-[#202124]">
					Saavthan
				</span>
			</a>

			<!-- Desktop Nav Links -->
			<nav class="hidden md:flex items-center gap-8">
				{#each navLinks as link}
					{@const isActive = currentPath === link.href || (link.href === '/download' && currentPath.startsWith('/download'))}
					{#if isActive}
						<a
							href={link.href}
							class="relative py-2 text-sm font-medium text-[#ff7675] transition-colors"
						>
							{link.name}
							<span class="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ff7675] rounded-full"></span>
						</a>
					{:else}
						<a
							href={link.href}
							class="py-2 text-sm font-medium text-[#6B7280] hover:text-[#202124] transition-colors"
						>
							{link.name}
						</a>
					{/if}
				{/each}
			</nav>
		</div>

		<!-- Right: Icons & Actions -->
		<div class="flex items-center gap-2 sm:gap-3">
			<button
				type="button"
				aria-label="Search"
				class="p-2.5 rounded-lg text-[#6B7280] hover:text-[#202124] hover:bg-[#F8F9FA] transition-colors cursor-pointer"
			>
				<Search class="size-5 stroke-[1.8]" />
			</button>

			<button
				type="button"
				aria-label="User Profile"
				class="p-2.5 rounded-lg text-[#6B7280] hover:text-[#202124] hover:bg-[#F8F9FA] transition-colors cursor-pointer"
			>
				<User class="size-5 stroke-[1.8]" />
			</button>

			<!-- Mobile Menu Button -->
			<button
				type="button"
				aria-label="Toggle Menu"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				class="md:hidden p-2.5 rounded-lg text-[#6B7280] hover:text-[#202124] hover:bg-[#F8F9FA] transition-colors cursor-pointer"
			>
				{#if mobileMenuOpen}
					<X class="size-5 stroke-[1.8]" />
				{:else}
					<Menu class="size-5 stroke-[1.8]" />
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile Dropdown Menu -->
	{#if mobileMenuOpen}
		<div class="md:hidden border-t border-[#E5E7EB] bg-[#FFFFFF] px-6 py-4 space-y-2">
			{#each navLinks as link}
				{@const isActive = currentPath === link.href || (link.href === '/download' && currentPath.startsWith('/download'))}
				<a
					href={link.href}
					onclick={() => (mobileMenuOpen = false)}
					class="block px-3 py-2 rounded-lg text-base font-medium transition-colors {isActive ? 'text-[#ff7675] bg-[#fff0f0]' : 'text-[#6B7280] hover:text-[#202124] hover:bg-[#F8F9FA]'}"
				>
					{link.name}
				</a>
			{/each}
		</div>
	{/if}
</header>
