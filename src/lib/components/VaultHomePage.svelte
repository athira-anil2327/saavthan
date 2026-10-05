<script lang="ts">
	import { Button } from '#lib/components/ui/button';
	import { Separator } from '#lib/components/ui/separator';
	import WindowsIcon from '#lib/components/icons/WindowsIcon.svelte';
	import {
		Download,
		Upload,
		Database,
		Monitor,
		Shield,
		Lock,
		Server,
		Zap
	} from 'lucide-svelte';

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

	const whyVaultPoints = [
		{
			title: 'Private',
			icon: Shield,
			description:
				'Your data stays under your control. No third parties, no unnecessary tracking, and no external dependency for managing your data.'
		},
		{
			title: 'Secure',
			icon: Lock,
			description:
				'Built with security in mind. Your data is encrypted and protected, giving you a safe and reliable platform you can trust.'
		},
		{
			title: 'Self-hosted',
			icon: Server,
			description:
				'Run Vault yourself. Deploy it on your own infrastructure and keep complete control over your data, access and updates.'
		}
	];

	function scrollToWindowsDownload() {
		const el = document.getElementById('windows-download');
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}
</script>

<main class="w-full flex flex-col items-center">
	<!-- 1. HERO SECTION -->
	<section class="w-full max-w-5xl px-6 pt-10 sm:pt-12 md:pt-14 pb-0 flex flex-col items-center text-center">
		<!-- Version Pill -->
		<div class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF1F1] text-xs font-medium text-[#FF7675] mb-3">
			<span>●</span>
			<span>v1.0.0</span>
		</div>

		<!-- Hero Heading -->
		<h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-[56px] font-bold tracking-tight text-[#202124] leading-[1.06] mb-4 select-none">
			<span>SECURE YOUR</span><br />
			<span>CUSTOMER.</span>
		</h1>

		<!-- Hero Supporting Text -->
		<p class="text-base sm:text-lg text-[#6B7280] max-w-xl leading-relaxed mb-6 font-normal">
			<span>A simple, secure and self-hosted</span><br />
			<span>way to manage your data.</span>
		</p>

		<!-- Get Started Button (keeps current behavior: scrolls to Windows download panel) -->
		<div>
			<Button
				onclick={scrollToWindowsDownload}
				class="bg-[#FF7675] hover:bg-[#ff6261] text-white px-6 h-[44px] text-sm font-medium rounded-lg transition-all cursor-pointer shadow-none"
			>
				Get Started
			</Button>
		</div>

		<!-- 2. WINDOWS DOWNLOAD BOX -->
		<div id="windows-download" class="w-full max-w-[960px] mt-8 sm:mt-10 text-left scroll-mt-24">
			<div class="bg-white border border-[#E5E7EB] rounded-2xl p-8 sm:p-10 md:p-12 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.04)] grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
				<!-- LEFT COLUMN (approx 38-40%) -->
				<div class="md:col-span-5 flex flex-col items-center text-center w-full md:pr-6">
					<!-- Windows Icon in 80px soft circular container -->
					<div class="w-20 h-20 rounded-full bg-[#FFF1F1] flex items-center justify-center text-[#FF7675] mb-4 shrink-0">
						<WindowsIcon class="w-8 h-8 fill-current" />
					</div>

					<!-- Windows Title -->
					<h3 class="text-xl font-semibold text-[#202124] mb-3.5">
						Windows
					</h3>

					<!-- Download for Windows Button (navigates to /start plan options) -->
					<a
						href="/start"
						class="w-full max-w-[230px] bg-[#FF7675] hover:bg-[#ff6261] text-white text-sm font-medium h-[44px] rounded-full inline-flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-none mb-4"
					>
						<Download class="w-4 h-4 shrink-0" />
						<span>Download for Windows</span>
					</a>

					<!-- Metadata Pills -->
					<div class="flex items-center justify-center gap-2 flex-wrap">
						<span class="px-2.5 py-1 text-xs text-[#6B7280] bg-[#F8F9FA] rounded-md font-normal">
							v1.0.0
						</span>
						<span class="px-2.5 py-1 text-xs text-[#6B7280] bg-[#F8F9FA] rounded-md font-normal">
								64-bit
						</span>
						<span class="px-2.5 py-1 text-xs text-[#6B7280] bg-[#F8F9FA] rounded-md font-normal">
							140 MB
						</span>
					</div>
				</div>

				<!-- RIGHT COLUMN (approx 60-62%) -->
				<div class="md:col-span-7 flex flex-col justify-center md:pl-8 md:border-l md:border-[#E5E7EB] border-t md:border-t-0 pt-8 md:pt-0 border-[#E5E7EB]">
					<!-- Heading -->
					<h2 class="text-xl sm:text-2xl font-bold tracking-tight text-[#202124] mb-3">
						Get the latest version for Windows
					</h2>

					<!-- Description -->
					<p class="text-sm sm:text-base text-[#6B7280] leading-relaxed mb-7 font-normal">
						Download Vault for Windows 10/11 and start managing your data securely. Easy to install, lightweight, and designed for a smooth self-hosted experience.
					</p>

					<!-- Three Feature Rows -->
					<div class="flex flex-col gap-4 sm:gap-5">
						<!-- Feature 1 -->
						<div class="flex items-start gap-3.5">
							<div class="w-8 h-8 rounded-full bg-[#FFF1F1] flex items-center justify-center text-[#FF7675] shrink-0 mt-0.5">
								<WindowsIcon class="w-3.5 h-3.5 fill-current" />
							</div>
							<div class="text-sm">
								<p class="font-semibold text-[#202124]">Works on Windows 10 and 11</p>
								<p class="text-[#6B7280] text-xs sm:text-sm mt-0.5">Stable and optimized performance.</p>
							</div>
						</div>

						<!-- Feature 2 -->
						<div class="flex items-start gap-3.5">
							<div class="w-8 h-8 rounded-full bg-[#FFF1F1] flex items-center justify-center text-[#FF7675] shrink-0 mt-0.5">
								<Shield class="w-3.5 h-3.5" />
							</div>
							<div class="text-sm">
								<p class="font-semibold text-[#202124]">Secure by design</p>
								<p class="text-[#6B7280] text-xs sm:text-sm mt-0.5">Your data stays on your infrastructure.</p>
							</div>
						</div>

						<!-- Feature 3 -->
						<div class="flex items-start gap-3.5">
							<div class="w-8 h-8 rounded-full bg-[#FFF1F1] flex items-center justify-center text-[#FF7675] shrink-0 mt-0.5">
								<Zap class="w-3.5 h-3.5" />
							</div>
							<div class="text-sm">
								<p class="font-semibold text-[#202124]">Simple setup</p>
								<p class="text-[#6B7280] text-xs sm:text-sm mt-0.5">Get started in minutes.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- 3. SUBTLE SECTION DIVIDER -->
	<div class="w-full max-w-6xl px-6 mt-20 sm:mt-24">
		<Separator class="bg-[#E5E7EB]" />
	</div>

	<!-- 4. HOW IT WORKS SECTION (Subtle #FDFDFD background differentiation) -->
	<section class="w-full bg-[#FDFDFD] py-20 sm:py-24 flex flex-col items-center">
		<div class="w-full max-w-6xl px-6 flex flex-col items-center">
			<!-- Section Title & Subtitle -->
			<h2 class="text-xl sm:text-2xl font-bold tracking-tight text-[#202124] uppercase text-center mb-2.5">
				HOW IT WORKS
			</h2>
			<p class="text-sm sm:text-base text-[#6B7280] text-center max-w-2xl leading-relaxed mb-16 font-normal">
				A simple workflow designed to keep your data accessible, controlled and secure.
			</p>

			<!-- Three Visual Feature Blocks -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 lg:gap-16 w-full">
				{#each howItWorksSteps as step}
					<div class="flex flex-col items-center text-center px-2">
						<!-- 48px Circular Icon Container -->
						<div class="w-12 h-12 rounded-full bg-[#FFF1F1] flex items-center justify-center text-[#FF7675] mb-5 shrink-0">
							<step.icon class="w-5 h-5" />
						</div>
						<h3 class="text-lg sm:text-xl font-semibold text-[#202124] mb-3">
							{step.title}
						</h3>
						<p class="text-sm sm:text-[15px] text-[#6B7280] leading-[1.65] font-normal max-w-sm">
							{step.description}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- SUBTLE SECTION DIVIDER -->
	<div class="w-full max-w-6xl px-6">
		<Separator class="bg-[#E5E7EB]" />
	</div>

	<!-- 5. WHY VAULT SECTION (Clean #FFFFFF background) -->
	<section class="w-full bg-white py-20 sm:py-24 pb-20 sm:pb-24 flex flex-col items-center">
		<div class="w-full max-w-6xl px-6 flex flex-col items-center">
			<!-- Section Title & Subtitle -->
			<h2 class="text-xl sm:text-2xl font-bold tracking-tight text-[#202124] uppercase text-center mb-2.5">
				WHY VAULT
			</h2>
			<p class="text-sm sm:text-base text-[#6B7280] text-center max-w-2xl leading-relaxed mb-16 font-normal">
				Built for organizations that value privacy, security and complete control over their data.
			</p>

			<!-- Three Visual Feature Blocks -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 lg:gap-16 w-full">
				{#each whyVaultPoints as point}
					<div class="flex flex-col items-center text-center px-2">
						<!-- 48px Circular Icon Container -->
						<div class="w-12 h-12 rounded-full bg-[#FFF1F1] flex items-center justify-center text-[#FF7675] mb-5 shrink-0">
							<point.icon class="w-5 h-5" />
						</div>
						<h3 class="text-lg sm:text-xl font-semibold text-[#202124] mb-3">
							{point.title}
						</h3>
						<p class="text-sm sm:text-[15px] text-[#6B7280] leading-[1.65] font-normal max-w-sm">
							{point.description}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>
</main>
