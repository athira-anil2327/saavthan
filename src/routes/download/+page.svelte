<script lang="ts">
	import { ArrowRight } from "@lucide/svelte";
	import Navbar from "#lib/components/Navbar.svelte";
	import DownloadCard, { type DownloadOption } from "#lib/components/DownloadCard.svelte";

	const downloadOptions: DownloadOption[] = [
		{
			id: "linux",
			name: "Linux",
			subtitle: "Ubuntu • Debian • Fedora",
			version: "v1.0.0",
			architecture: "64-bit",
			size: "120 MB",
			href: "/downloads/saavthan-linux",
			buttonText: "Download for Linux",
		},
		{
			id: "windows",
			name: "Windows",
			subtitle: "Windows 10 / 11",
			version: "v1.0.0",
			architecture: "64-bit",
			size: "140 MB",
			href: "/downloads/saavthan-windows",
			buttonText: "Download for Windows",
		},
		{
			id: "macos",
			name: "macOS",
			subtitle: "Apple Silicon • Intel",
			version: "v1.0.0",
			architecture: "64-bit",
			size: "130 MB",
			href: "/downloads/saavthan-macos",
			buttonText: "Download for macOS",
		},
	];
</script>

<svelte:head>
	<title>Download Saavthan - Simple, Powerful Platform</title>
	<meta
		name="description"
		content="Download Saavthan for Linux, Windows, or macOS. A simple, powerful platform to organise, manage and keep everything in one place."
	/>
</svelte:head>

<div class="min-h-screen bg-[#FFFFFF] text-[#202124] flex flex-col font-sans antialiased selection:bg-[#fff0f0] selection:text-[#ff7675]">
	<!-- Navigation -->
	<Navbar />

	<main class="flex-1">
		<!-- Hero Section -->
		<section class="pt-16 pb-12 sm:pt-20 sm:pb-16 text-center max-w-4xl mx-auto px-6">
			<!-- Version Pill -->
			<div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#fff0f0] border border-[#ff7675]/20 text-xs sm:text-sm font-medium text-[#6B7280] mb-8 shadow-xs">
				<span>v1.0.0</span>
				<span class="w-1.5 h-1.5 rounded-full bg-[#ff7675]" aria-hidden="true"></span>
				<span>Now available</span>
			</div>

			<!-- Main Heading -->
			<h1 class="text-4xl sm:text-5xl lg:text-[64px] font-semibold tracking-tight leading-[1.1] mb-6">
				<span class="text-[#202124]">Download </span><span class="text-[#ff7675]">Saavthan</span>
			</h1>

			<!-- Subtitles -->
			<div class="space-y-2">
				<p class="text-base sm:text-lg text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
					A simple, powerful platform to organise, manage and keep everything in one place.
				</p>
				<p class="text-sm sm:text-base text-[#6B7280]">
					Choose your operating system to get started.
				</p>
			</div>
		</section>

		<!-- Download Cards Section -->
		<section class="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16 pb-16">
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
				{#each downloadOptions as option (option.id)}
					<DownloadCard {option} />
				{/each}
			</div>
		</section>

		<!-- Bottom Divider & Installation Guide Link -->
		<div class="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16">
			<hr class="border-[#E5E7EB]" />
		</div>

		<section class="py-12 text-center px-6">
			<p class="text-sm sm:text-base text-[#6B7280]">
				Need help?
				<a
					href="/docs/installation"
					class="inline-flex items-center gap-1.5 text-[#ff7675] hover:text-[#e66766] font-medium ml-1.5 transition-colors group"
				>
					<span>View installation guide</span>
					<ArrowRight class="size-4 transition-transform group-hover:translate-x-0.5" />
				</a>
			</p>
		</section>
	</main>
</div>
