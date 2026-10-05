<script lang="ts">
	import Navbar from "#lib/components/Navbar.svelte";
	import { Button } from "#lib/components/ui/button/index.js";
	import * as Card from "#lib/components/ui/card/index.js";
	import { Lock, ShieldCheck, Server } from "@lucide/svelte";
</script>

<svelte:head>
	<title>VAULT — Your Data. Your Control.</title>
	<meta
		name="description"
		content="A simple and secure way to manage your data, your way. Private, secure, and self-hosted on your own infrastructure."
	/>
</svelte:head>

<div class="min-h-screen bg-[#FFFFFF] text-[#202124] flex flex-col font-sans antialiased selection:bg-[#FFF1F2] selection:text-[#D96F7A]">
	<!-- Global Vault Public Navigation -->
	<Navbar currentPath="/" variant="vault" />

	<main class="flex-1 flex flex-col">
		<!-- Hero Section -->
		<section class="pt-24 pb-20 sm:pt-32 sm:pb-24 text-center max-w-4xl mx-auto px-6">
			<!-- Main Headline -->
			<h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#202124] leading-[1.1] mb-6 uppercase">
				YOUR DATA.<br />YOUR CONTROL.
			</h1>

			<!-- Subtitle -->
			<p class="text-lg sm:text-xl text-[#6B7280] max-w-xl mx-auto leading-relaxed mb-10">
				A simple and secure way to manage your data, your way.
			</p>

			<!-- Primary CTA Button -->
			<div class="flex justify-center">
				<Button
					href="/login"
					class="h-12 px-8 bg-[#D96F7A] hover:bg-[#C95F6A] text-white font-medium rounded-lg text-sm transition-colors shadow-none cursor-pointer"
				>
					Get Started
				</Button>
			</div>
		</section>

		<!-- Subtle Divider -->
		<div class="max-w-[1200px] w-full mx-auto px-6 md:px-12">
			<hr class="border-[#E5E7EB]" />
		</div>

		<!-- Why Vault Section -->
		<section class="py-20 sm:py-24 max-w-[1200px] w-full mx-auto px-6 md:px-12 text-center">
			<h2 class="text-xs sm:text-sm font-semibold tracking-widest text-[#6B7280] uppercase mb-12">
				WHY VAULT
			</h2>

			<!-- Three Simple Text/Card Columns -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
				<!-- Item 1: PRIVATE -->
				<Card.Root class="bg-[#FFFFFF] border-[#E5E7EB] rounded-xl p-8 shadow-none hover:border-[#D96F7A]/40 transition-colors flex flex-col justify-start">
					<div class="w-10 h-10 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] flex items-center justify-center text-[#202124] mb-5">
						<Lock class="size-5 stroke-[1.8]" />
					</div>
					<h3 class="text-base font-bold tracking-wide text-[#202124] uppercase mb-2">
						PRIVATE
					</h3>
					<p class="text-sm text-[#6B7280] leading-relaxed">
						Your data stays under your control.
					</p>
				</Card.Root>

				<!-- Item 2: SECURE -->
				<Card.Root class="bg-[#FFFFFF] border-[#E5E7EB] rounded-xl p-8 shadow-none hover:border-[#D96F7A]/40 transition-colors flex flex-col justify-start">
					<div class="w-10 h-10 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] flex items-center justify-center text-[#202124] mb-5">
						<ShieldCheck class="size-5 stroke-[1.8]" />
					</div>
					<h3 class="text-base font-bold tracking-wide text-[#202124] uppercase mb-2">
						SECURE
					</h3>
					<p class="text-sm text-[#6B7280] leading-relaxed">
						Your data is protected.
					</p>
				</Card.Root>

				<!-- Item 3: SELF-HOSTED -->
				<Card.Root class="bg-[#FFFFFF] border-[#E5E7EB] rounded-xl p-8 shadow-none hover:border-[#D96F7A]/40 transition-colors flex flex-col justify-start">
					<div class="w-10 h-10 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB] flex items-center justify-center text-[#202124] mb-5">
						<Server class="size-5 stroke-[1.8]" />
					</div>
					<h3 class="text-base font-bold tracking-wide text-[#202124] uppercase mb-2">
						SELF-HOSTED
					</h3>
					<p class="text-sm text-[#6B7280] leading-relaxed">
						Run Vault on your infrastructure.
					</p>
				</Card.Root>
			</div>
		</section>

		<!-- Subtle Divider -->
		<div class="max-w-[1200px] w-full mx-auto px-6 md:px-12">
			<hr class="border-[#E5E7EB]" />
		</div>

		<!-- Final CTA Section -->
		<section class="py-20 sm:py-24 text-center max-w-4xl mx-auto px-6">
			<h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-[#202124] mb-8 uppercase">
				TAKE CONTROL OF YOUR DATA.
			</h2>

			<div class="flex justify-center">
				<Button
					href="/login"
					class="h-12 px-8 bg-[#D96F7A] hover:bg-[#C95F6A] text-white font-medium rounded-lg text-sm transition-colors shadow-none cursor-pointer"
				>
					Get Started
				</Button>
			</div>
		</section>
	</main>
</div>
