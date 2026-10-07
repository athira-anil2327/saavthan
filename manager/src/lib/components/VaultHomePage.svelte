<script lang="ts">
	import { Separator } from '#lib/components/ui/separator';
	import WindowsIcon from '#lib/components/icons/WindowsIcon.svelte';
	import {
		Download,
		Upload,
		Database,
		Monitor,
		Shield,
		Zap
	} from 'lucide-svelte';

	import { onMount } from 'svelte';

	const howItWorksSteps = [
		{
			title: 'Upload',
			icon: Upload,
			description:
				'Upload your files and data securely. Vault supports documents, media and other important files through a simple and clean interface.'
		},
		{
			title: 'Store',
			icon: Database,
			description:
				'Keep your data in your own vault. Everything is stored on your infrastructure, giving you full ownership and complete control.'
		},
		{
			title: 'Access',
			icon: Monitor,
			description:
				'Access your data whenever you need it. Use your vault with a secure and consistent experience whenever your files are required.'
		}
	];

	let heroTextRef = $state<HTMLElement | null>(null);
	let gradientRef: HTMLDivElement;

	onMount(() => {
		let targetOffsetX = 0;
		let targetOffsetY = 0;
		let currentOffsetX = 0;
		let currentOffsetY = 0;
		let animationFrameId: number;

		function handlePointerMove(e: PointerEvent) {
			if (!heroTextRef) return;
			const rect = heroTextRef.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;

			const dx = e.clientX - centerX;
			const dy = e.clientY - centerY;

			// Elastic, smooth displacement towards cursor (anchored around center)
			targetOffsetX = Math.max(-130, Math.min(130, dx * 0.24));
			targetOffsetY = Math.max(-75, Math.min(75, dy * 0.22));
		}

		function handlePointerLeave() {
			targetOffsetX = 0;
			targetOffsetY = 0;
		}

		window.addEventListener('pointermove', handlePointerMove, { passive: true });
		window.addEventListener('blur', handlePointerLeave);
		document.addEventListener('mouseleave', handlePointerLeave);

		function animate() {
			currentOffsetX += (targetOffsetX - currentOffsetX) * 0.075;
			currentOffsetY += (targetOffsetY - currentOffsetY) * 0.075;

			if (gradientRef) {
				gradientRef.style.transform = `translate3d(calc(-50% + ${currentOffsetX.toFixed(2)}px), calc(-50% + ${currentOffsetY.toFixed(2)}px), 0)`;
			}

			animationFrameId = requestAnimationFrame(animate);
		}

		animationFrameId = requestAnimationFrame(animate);

		return () => {
			window.removeEventListener('pointermove', handlePointerMove);
			window.removeEventListener('blur', handlePointerLeave);
			document.removeEventListener('mouseleave', handlePointerLeave);
			if (animationFrameId) cancelAnimationFrame(animationFrameId);
		};
	});
</script>

<main class="w-full flex flex-col items-center bg-background text-foreground transition-colors overflow-x-hidden">
	<!-- 1. HERO SECTION -->
	<section
		aria-label="Download Hero Section"
		class="w-full max-w-5xl px-4 sm:px-6 pt-10 sm:pt-16 md:pt-24 pb-0 flex flex-col items-center text-center relative"
	>
		<!-- Hero Content Area with One Atmospheric Soft Transparent Pink Glow (Anchored & Elastic) -->
		<div bind:this={heroTextRef} class="relative w-full flex flex-col items-center mt-4 sm:mt-8 md:mt-12 mb-10 sm:mb-16 md:mb-24">
			<div
				bind:this={gradientRef}
				class="absolute pointer-events-none -z-0 select-none left-1/2 top-1/2 w-[720px] max-w-[92vw] h-[380px] rounded-full"
				style="
					transform: translate3d(-50%, -50%, 0);
					background: radial-gradient(ellipse 65% 55% at 50% 50%, rgba(255, 118, 117, 0.16) 0%, rgba(255, 118, 117, 0.08) 40%, rgba(255, 118, 117, 0.015) 70%, transparent 100%);
					filter: blur(48px);
				"
				aria-hidden="true"
			></div>

			<!-- Hero Content Area (relative z-10) -->
			<div class="relative z-10 flex flex-col items-center w-full px-2 sm:px-4">
				<!-- Tagline / Secondary Heading -->
				<h2 class="text-sm sm:text-xl md:text-2xl font-bold tracking-wider sm:tracking-tight text-foreground mb-2 sm:mb-4 select-none uppercase">
					SECURE YOUR CUSTOMER.
				</h2>

				<!-- Main Hero Heading (Responsive, wraps gracefully on narrow mobile, never clips) -->
				<h1 class="text-[34px] min-[390px]:text-[40px] min-[430px]:text-[44px] sm:text-6xl md:text-[68px] lg:text-[76px] font-extrabold tracking-tight text-foreground leading-[1.1] mb-5 sm:mb-8 select-none flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4.5 gap-y-0.5 sm:gap-y-1">
					<span>Download</span>
					<span class="text-primary">Saavthan</span>
				</h1>

				<!-- Hero Supporting Text -->
				<p class="text-xs sm:text-base md:text-lg text-muted-foreground max-w-md sm:max-w-2xl leading-relaxed font-normal">
					<span>A simple, powerful platform to organise, manage and keep everything in one place.</span><br class="hidden sm:inline" />
					<span class="inline sm:inline"> Choose your operating system to get started.</span>
				</p>
			</div>
		</div>

		<!-- 2. WINDOWS DOWNLOAD BOX (relative z-10) -->
		<div id="windows-download" class="w-full max-w-[960px] text-left relative z-10">
			<div class="bg-card border border-border rounded-xl p-5 sm:p-8 md:p-12 shadow-md grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 md:gap-12 items-center">
				<!-- LEFT COLUMN (approx 38-40% on desktop, stacked on mobile) -->
				<div class="md:col-span-5 flex flex-col items-center text-center w-full md:pr-6">
					<!-- Windows Icon Container -->
					<div class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-muted flex items-center justify-center text-primary mb-3 sm:mb-4 shrink-0 border border-border">
						<WindowsIcon class="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
					</div>

					<!-- Windows Title -->
					<h3 class="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-3.5">
						Windows
					</h3>

					<!-- Download for Windows Button -->
					<a
						href="/start"
						class="w-full max-w-[240px] bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium h-10 rounded-lg inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs mb-3.5 sm:mb-4"
					>
						<Download class="w-4 h-4 shrink-0" />
						<span>Download for Windows</span>
					</a>

					<!-- Metadata Badges -->
					<div class="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap text-xs text-muted-foreground">
						<span class="px-2 py-0.5 rounded-md bg-muted font-mono border border-border">
							v1.0.0
						</span>
						<span class="px-2 py-0.5 rounded-md bg-muted border border-border">
							64-bit
						</span>
						<span class="px-2 py-0.5 rounded-md bg-muted border border-border">
							140 MB
						</span>
					</div>
				</div>

				<!-- RIGHT COLUMN (approx 60-62% on desktop, stacked below on mobile) -->
				<div class="md:col-span-7 flex flex-col justify-center md:pl-8 md:border-l md:border-border border-t md:border-t-0 pt-6 md:pt-0 border-border">
					<!-- Heading -->
					<h2 class="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground mb-2 sm:mb-3 text-center md:text-left">
						Get the latest version for Windows
					</h2>

					<!-- Description -->
					<p class="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed mb-5 sm:mb-7 font-normal text-center md:text-left">
						Download Vault for Windows 10/11 and start managing your data securely. Easy to install, lightweight, and designed for a smooth self-hosted experience.
					</p>

					<!-- Three Feature Rows -->
					<div class="flex flex-col gap-3.5 sm:gap-4.5">
						<!-- Feature 1 -->
						<div class="flex items-start gap-3 sm:gap-3.5">
							<div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-muted flex items-center justify-center text-primary shrink-0 mt-0.5 border border-border">
								<WindowsIcon class="w-3.5 h-3.5 fill-current" />
							</div>
							<div class="text-xs sm:text-sm">
								<p class="font-semibold text-foreground">Works on Windows 10 and 11</p>
								<p class="text-muted-foreground text-xs sm:text-sm mt-0.5">Stable and optimized performance.</p>
							</div>
						</div>

						<!-- Feature 2 -->
						<div class="flex items-start gap-3 sm:gap-3.5">
							<div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-muted flex items-center justify-center text-primary shrink-0 mt-0.5 border border-border">
								<Shield class="w-3.5 h-3.5" />
							</div>
							<div class="text-xs sm:text-sm">
								<p class="font-semibold text-foreground">Secure by design</p>
								<p class="text-muted-foreground text-xs sm:text-sm mt-0.5">Your data stays on your infrastructure.</p>
							</div>
						</div>

						<!-- Feature 3 -->
						<div class="flex items-start gap-3 sm:gap-3.5">
							<div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-muted flex items-center justify-center text-primary shrink-0 mt-0.5 border border-border">
								<Zap class="w-3.5 h-3.5" />
							</div>
							<div class="text-xs sm:text-sm">
								<p class="font-semibold text-foreground">Simple setup</p>
								<p class="text-muted-foreground text-xs sm:text-sm mt-0.5">Get started in minutes.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- 3. SUBTLE SECTION DIVIDER -->
	<div class="w-full max-w-6xl px-4 sm:px-6 mt-14 sm:mt-20 md:mt-24">
		<Separator class="bg-border" />
	</div>

	<!-- 4. HOW IT WORKS SECTION -->
	<section class="w-full bg-muted/40 py-14 sm:py-20 md:py-24 flex flex-col items-center border-t border-border mt-12 sm:mt-16 transition-colors">
		<div class="w-full max-w-6xl px-4 sm:px-6 flex flex-col items-center">
			<!-- Section Title & Subtitle -->
			<h2 class="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground uppercase text-center mb-2 sm:mb-2.5">
				HOW IT WORKS
			</h2>
			<p class="text-xs sm:text-sm md:text-base text-muted-foreground text-center max-w-2xl leading-relaxed mb-10 sm:mb-16 font-normal">
				A simple workflow designed to keep your data accessible, controlled and secure.
			</p>

			<!-- Three Visual Feature Blocks -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-16 w-full">
				{#each howItWorksSteps as step}
					<div class="flex flex-col items-center text-center px-2">
						<!-- Icon Container -->
						<div class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-card flex items-center justify-center text-primary mb-4 sm:mb-5 shrink-0 border border-border shadow-xs">
							<step.icon class="w-5 h-5" />
						</div>
						<h3 class="text-base sm:text-lg md:text-xl font-semibold text-foreground mb-2 sm:mb-3">
							{step.title}
						</h3>
						<p class="text-xs sm:text-sm text-muted-foreground leading-[1.65] font-normal max-w-sm">
							{step.description}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>
</main>
