<script lang="ts">
	import { page } from '$app/state';

	const navLinks = [
		{ label: 'Login', href: '/login' },
		{ label: 'Source', href: 'https://github.com/athira-anil2327/saavthan' },
		{ label: 'Selfhost Guide', href: '/selfhost' }
	];
</script>

<header class="w-full h-[72px] bg-white border-b border-[#E5E7EB] flex items-center justify-between px-7 sm:px-8 select-none sticky top-0 z-30">
	<!-- LEFT: Brand Name -->
	<div class="flex items-center">
		<a href="/" class="text-xl font-bold tracking-tight text-[#202124] hover:text-[#FF7675] transition-colors">
			VAULT
		</a>
	</div>

	<!-- RIGHT: Simple text links -->
	<nav class="flex items-center gap-6 sm:gap-8">
		{#each navLinks as link}
			{@const isExternal = link.href.startsWith('http')}
			{@const isActive = !isExternal && page.url.pathname.startsWith(link.href) && link.href !== '/'}
			{#if isActive}
				<div class="relative py-2">
					<a
						href={link.href}
						class="text-sm font-medium text-[#FF7675] transition-colors"
					>
						{link.label}
					</a>
					<div class="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF7675] rounded-full"></div>
				</div>
			{:else}
				<a
					href={link.href}
					target={isExternal ? '_blank' : undefined}
					rel={isExternal ? 'noopener noreferrer' : undefined}
					class="text-sm font-normal text-[#6B7280] hover:text-[#202124] transition-colors py-2"
				>
					{link.label}
				</a>
			{/if}
		{/each}
	</nav>
</header>
