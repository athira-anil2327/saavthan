<script lang="ts">
	import { Button } from '#lib/components/ui/button';
	import DebianIcon from '#lib/components/icons/DebianIcon.svelte';
	import {
		Layers,
		Server,
		Download,
		Settings,
		ChevronDown,
		Play
	} from 'lucide-svelte';

	// Sidebar Navigation
	const sidebarItems = [
		{ name: 'Images', icon: Layers, active: true, href: '/images' },
		{ name: 'Service', icon: Server, active: false, href: '#service' },
		{ name: 'Download', icon: Download, active: false, href: '/download' },
		{ name: 'Settings', icon: Settings, active: false, href: '#settings' }
	];

	// Debian Image Versions
	interface ImageOption {
		id: string;
		version: string;
		size: string;
	}

	const debianImages: ImageOption[] = [
		{ id: 'deb-15', version: 'Debian 15.1.0', size: '13.6 GB' },
		{ id: 'deb-13-1', version: 'Debian 13.1', size: '13.1 GB' },
		{ id: 'deb-13-0-9', version: 'Debian 13.0.9 (NUEN)', size: '13.0 GB' }
	];

	let selectedId = $state<string>('deb-15');
</script>

<svelte:head>
	<title>Images - Vault</title>
</svelte:head>

<div class="min-h-screen bg-white text-[#202124] flex flex-col font-sans antialiased w-full selection:bg-[#FFF1F1] selection:text-[#FF7675]">
	<!-- 1. TOP HEADER (Height: 64px) -->
	<header class="w-full h-[64px] bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6 shrink-0 select-none sticky top-0 z-30">
		<!-- Left: VAULT (24px left padding, font size ~18px, bold) -->
		<a href="/" class="text-[18px] font-bold tracking-tight text-[#202124] hover:text-[#FF7675] transition-colors">
			VAULT
		</a>

		<!-- Right: Avatar & Chevron (24px right padding) -->
		<div class="flex items-center gap-2 cursor-pointer p-1">
			<div class="w-8 h-8 rounded-full bg-[#FFF1F1] text-[#FF7675] font-semibold flex items-center justify-center text-xs border border-[#FF7675]/30">
				A
			</div>
			<ChevronDown class="w-4 h-4 text-[#6B7280]" />
		</div>
	</header>

	<!-- 2. BODY: SIDEBAR + MAIN CONTENT (display: flex) -->
	<div class="flex-1 flex flex-row w-full min-h-[calc(100vh-64px)]">
		<!-- 3. LEFT SIDEBAR (Width: 220px, full remaining viewport height) -->
		<aside class="w-[220px] shrink-0 border-r border-[#E5E7EB] bg-white p-3 select-none flex flex-col justify-between">
			<nav class="space-y-1">
				{#each sidebarItems as item}
					{#if item.active}
						<!-- Active Images Item (h-44px, ~20px horizontal pad, icon ~18px, text 14-15px) -->
						<div class="relative">
							<!-- Subtle coral left accent -->
							<div class="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#FF7675] rounded-r-full"></div>
							<a
								href={item.href}
								class="flex items-center gap-3 px-4 h-[44px] rounded-lg bg-[#FFF1F1] text-[#FF7675] text-[14px] font-medium transition-colors"
							>
								<item.icon class="w-[18px] h-[18px] text-[#FF7675] shrink-0" />
								<span>{item.name}</span>
							</a>
						</div>
					{:else}
						<!-- Neutral Items -->
						<a
							href={item.href}
							class="flex items-center gap-3 px-4 h-[44px] rounded-lg text-[#4B5563] hover:text-[#202124] hover:bg-[#F9FAFB] text-[14px] font-medium transition-colors"
						>
							<item.icon class="w-[18px] h-[18px] text-[#6B7280] shrink-0" />
							<span>{item.name}</span>
						</a>
					{/if}
				{/each}
			</nav>
		</aside>

		<!-- 4. MAIN CONTENT (padding: 40px 48px, max-width: 1100px) -->
		<main class="flex-1 min-w-0 px-12 py-10 bg-white">
			<div class="max-w-[1100px] w-full">
				<!-- Heading (32px, bold, 700) -->
				<h1 class="text-[32px] font-bold text-[#202124] tracking-tight leading-tight mb-2 text-left">
					Images
				</h1>

				<!-- Subtitle (16px, #6B7280, 28-32px gap below) -->
				<p class="text-[16px] text-[#6B7280] mb-8 font-normal leading-normal text-left">
					Choose an operating system image to start a secure, isolated workspace.
				</p>

				<!-- 5. MAIN CARD (Debian Card: max-width 1100px, 32px padding, 14px radius, subtle shadow) -->
				<div class="w-full bg-white border border-[#E5E7EB] rounded-[14px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
					<!-- 6. CARD HEADER (title 16px, subtitle 14px, 8px gap, 16px gap below) -->
					<div class="mb-4">
						<div class="flex items-center gap-2.5 mb-2">
							<div class="w-8 h-8 rounded-full bg-[#FFF1F1] flex items-center justify-center text-[#FF7675] shrink-0">
								<DebianIcon class="w-4 h-4 fill-current" />
							</div>
							<div class="text-[16px] font-medium flex items-center gap-1.5">
								<span class="text-[#6B7280]">Images</span>
								<span class="text-[#9CA3AF]">›</span>
								<span class="text-[#202124] font-semibold">Debian</span>
							</div>
						</div>

						<p class="text-[14px] text-[#6B7280] font-normal text-left">
							Select a Debian image to launch your secure workspace.
						</p>
					</div>

					<!-- 7. VERSION TABLE (Real two-column layout: 75% Version / 25% Size) -->
					<div class="w-full border border-[#E5E7EB] rounded-[10px] overflow-hidden">
						<!-- Table Header (44px height) -->
						<div class="h-[44px] px-5 bg-[#FAFAFA] border-b border-[#E5E7EB] flex items-center justify-between text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">
							<span class="w-3/4 text-left">VERSION</span>
							<span class="w-1/4 text-right">SIZE</span>
						</div>

						<!-- Table Rows (56px minimum height each) -->
						<div class="divide-y divide-[#F3F4F6]">
							{#each debianImages as image}
								{@const isSelected = selectedId === image.id}
								<button
									type="button"
									onclick={() => (selectedId = image.id)}
									class="w-full min-h-[56px] h-[58px] flex items-center justify-between px-5 text-left transition-colors cursor-pointer {isSelected ? 'bg-[#FFF1F1]' : 'bg-white hover:bg-[#F9FAFB]'}"
								>
									<!-- Left: [radio] Debian version (75% width) -->
									<div class="w-3/4 flex items-center gap-3">
										{#if isSelected}
											<!-- Coral radio indicator -->
											<div class="w-4 h-4 rounded-full border-2 border-[#FF7675] flex items-center justify-center shrink-0">
												<div class="w-2 h-2 rounded-full bg-[#FF7675]"></div>
											</div>
										{:else}
											<!-- Unselected radio indicator -->
											<div class="w-4 h-4 rounded-full border border-[#D1D5DB] shrink-0 bg-white"></div>
										{/if}

										<span class="text-[14px] {isSelected ? 'font-medium text-[#202124]' : 'font-normal text-[#202124]'}">
											{image.version}
										</span>
									</div>

									<!-- Right: Size (25% width, right-aligned) -->
									<div class="w-1/4 text-right text-[14px] font-normal text-[#6B7280]">
										{image.size}
									</div>
								</button>
							{/each}
						</div>
					</div>

					<!-- 8. START VM BUTTON (Bottom-Right, 32px gap above, 140px width, 44px height, 8px radius) -->
					<div class="flex justify-end w-full mt-8">
						<Button
							class="w-[140px] h-[44px] bg-[#FF7675] hover:bg-[#ff6261] text-white text-[14px] font-medium rounded-[8px] transition-all cursor-pointer shadow-none inline-flex items-center justify-center gap-2"
						>
							<Play class="w-3.5 h-3.5 fill-current text-white" />
							<span>Start VM</span>
						</Button>
					</div>
				</div>
			</div>
		</main>
	</div>
</div>
