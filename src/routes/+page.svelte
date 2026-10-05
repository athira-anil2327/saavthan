<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import * as Card from "#lib/components/ui/card/index.js";
	import { ExternalLink, ArrowRight, Menu, X } from "@lucide/svelte";

	let mobileMenuOpen = $state(false);
	const githubRepoUrl = "https://github.com/athira-anil2327/saavthan";
</script>

<svelte:head>
	<title>VAULT — Zero-Trace Workspace for Shared Computers</title>
	<meta
		name="description"
		content="A zero-trace workspace for secure document access on shared computers. Protect your client. Leave no trace."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Zen+Dots&display=swap" rel="stylesheet" />
</svelte:head>

<div class="vault-page">
	<!-- Full Viewport Width Navbar -->
	<header class="vault-navbar">
		<a href="/" class="brand-link">
			<span class="brand-text">VAULT</span>
		</a>

		<!-- Desktop Actions (Right Edge) -->
		<nav class="desktop-nav">
			<a href="/login" class="nav-item">Login</a>
			<a
				href={githubRepoUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="nav-item nav-source-item"
			>
				<span>Source</span>
				<ExternalLink size={14} class="external-icon" />
			</a>
			<a href="/selfhost" class="nav-item">Selfhost Guide</a>
		</nav>

		<!-- Mobile Menu Toggle -->
		<button
			type="button"
			aria-label="Toggle navigation"
			class="mobile-menu-btn"
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
		>
			{#if mobileMenuOpen}
				<X size={22} />
			{:else}
				<Menu size={22} />
			{/if}
		</button>
	</header>

	<!-- Mobile Menu Drawer -->
	{#if mobileMenuOpen}
		<div class="mobile-drawer">
			<a href="/login" onclick={() => (mobileMenuOpen = false)} class="mobile-nav-item">Login</a>
			<a
				href={githubRepoUrl}
				target="_blank"
				rel="noopener noreferrer"
				onclick={() => (mobileMenuOpen = false)}
				class="mobile-nav-item mobile-source-item"
			>
				<span>Source</span>
				<ExternalLink size={15} />
			</a>
			<a href="/selfhost" onclick={() => (mobileMenuOpen = false)} class="mobile-nav-item">Selfhost Guide</a>
		</div>
	{/if}

	<!-- Main Content Area (Centered Container) -->
	<main class="vault-main">
		<!-- Hero Section -->
		<section class="hero-section">
			<h1 class="hero-headline">
				SECURE YOUR CUSTOMER.
			</h1>

			<p class="hero-tagline">
				Protect your client. Leave no trace.
			</p>

			<p class="hero-description">
				A zero-trace workspace for secure document access on shared computers.
			</p>

			<div class="hero-cta-wrapper">
				<Button href="/login" class="vault-primary-button">
					Get Started
				</Button>
			</div>
		</section>

		<!-- Subtle Divider -->
		<div class="divider-container">
			<hr class="section-divider" />
		</div>

		<!-- Process Section (Built for Shared Computers) -->
		<section class="process-section">
			<div class="process-header">
				<h2 class="process-heading">
					BUILT FOR SHARED COMPUTERS
				</h2>
				<p class="process-subheading">
					Protect every customer session from the moment it starts to the moment it ends.
				</p>
			</div>

			<!-- Three Sequential Process Blocks with Arrows -->
			<div class="process-flow">
				<!-- Step 01: ISOLATE -->
				<Card.Root class="process-card">
					<div class="step-header">
						<span class="step-number">01</span>
					</div>
					<h3 class="step-title">ISOLATE</h3>
					<p class="step-description">
						A private environment is created for every session.
					</p>
				</Card.Root>

				<!-- Process Arrow Connector -->
				<div class="process-arrow" aria-hidden="true">
					<ArrowRight size={22} class="arrow-icon" />
				</div>

				<!-- Step 02: WORK -->
				<Card.Root class="process-card">
					<div class="step-header">
						<span class="step-number">02</span>
					</div>
					<h3 class="step-title">WORK</h3>
					<p class="step-description">
						Customers can safely access, download and print documents.
					</p>
				</Card.Root>

				<!-- Process Arrow Connector -->
				<div class="process-arrow" aria-hidden="true">
					<ArrowRight size={22} class="arrow-icon" />
				</div>

				<!-- Step 03: WIPE -->
				<Card.Root class="process-card">
					<div class="step-header">
						<span class="step-number">03</span>
					</div>
					<h3 class="step-title">WIPE</h3>
					<p class="step-description">
						When the session ends, the environment disappears.
					</p>
				</Card.Root>
			</div>

			<!-- Process Conclusion Statement -->
			<div class="process-conclusion">
				<h3 class="conclusion-text">
					ONE SESSION. ZERO TRACE.
				</h3>
			</div>
		</section>

		<!-- Subtle Divider -->
		<div class="divider-container">
			<hr class="section-divider" />
		</div>

		<!-- Final CTA Section -->
		<section class="final-cta-section">
			<h2 class="final-cta-headline">
				TAKE CONTROL OF YOUR DATA.
			</h2>

			<div class="final-cta-wrapper">
				<Button href="/login" class="vault-primary-button">
					Get Started
				</Button>
			</div>
		</section>
	</main>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Zen+Dots&display=swap');

	/* Page Base Layout */
	.vault-page {
		min-height: 100vh;
		background-color: #ffffff;
		color: #202124;
		display: flex;
		flex-direction: column;
		font-family: inherit;
		width: 100%;
		overflow-x: hidden;
	}

	/* Full-Width Independent Navbar */
	.vault-navbar {
		position: sticky;
		top: 0;
		width: 100%;
		height: 72px;
		background-color: #ffffff;
		border-bottom: 1px solid #e5e7eb;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 32px;
		z-index: 50;
		box-sizing: border-box;
	}

	.brand-link {
		text-decoration: none;
		display: inline-flex;
		align-items: center;
	}

	.brand-text {
		font-family: 'Zen Dots', sans-serif;
		font-size: 20px;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: #202124;
		transition: color 0.15s ease;
	}

	.brand-link:hover .brand-text {
		color: #d96f7a;
	}

	.desktop-nav {
		display: flex;
		align-items: center;
		gap: 32px;
	}

	.nav-item {
		font-size: 14px;
		font-weight: 500;
		color: #6b7280;
		text-decoration: none;
		transition: color 0.15s ease;
		padding: 4px 0;
	}

	.nav-item:hover {
		color: #202124;
	}

	.nav-source-item {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	:global(.external-icon) {
		opacity: 0.6;
	}

	.mobile-menu-btn {
		display: none;
		background: none;
		border: none;
		color: #6b7280;
		cursor: pointer;
		padding: 6px;
		border-radius: 6px;
	}

	.mobile-menu-btn:hover {
		color: #202124;
		background-color: #f8f9fa;
	}

	.mobile-drawer {
		display: none;
		border-bottom: 1px solid #e5e7eb;
		background-color: #ffffff;
		padding: 16px 24px;
		flex-direction: column;
		gap: 8px;
	}

	.mobile-nav-item {
		font-size: 15px;
		font-weight: 500;
		color: #6b7280;
		text-decoration: none;
		padding: 8px 12px;
		border-radius: 6px;
		transition: background-color 0.15s ease, color 0.15s ease;
	}

	.mobile-nav-item:hover {
		color: #202124;
		background-color: #f8f9fa;
	}

	.mobile-source-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	/* Main Centered Content Container */
	.vault-main {
		flex: 1;
		width: 100%;
		max-width: 1240px;
		margin: 0 auto;
		padding: 0 32px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	/* Hero Section */
	.hero-section {
		padding-top: 120px;
		padding-bottom: 90px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.hero-headline {
		font-family: 'Zen Dots', sans-serif;
		font-size: 72px;
		font-weight: 700;
		line-height: 1.05;
		letter-spacing: -0.02em;
		color: #202124;
		text-transform: uppercase;
		margin: 0 0 18px 0;
		max-width: 920px;
	}

	.hero-tagline {
		font-family: 'Zen Dots', sans-serif;
		font-size: 26px;
		font-weight: 700;
		line-height: 1.3;
		color: #d96f7a;
		margin: 0 0 20px 0;
		max-width: 800px;
	}

	.hero-description {
		font-size: 19px;
		font-weight: 400;
		line-height: 1.5;
		color: #6b7280;
		max-width: 650px;
		margin: 0 0 36px 0;
	}

	.hero-cta-wrapper {
		display: flex;
		justify-content: center;
	}

	:global(.vault-primary-button) {
		height: 48px !important;
		padding: 0 36px !important;
		background-color: #d96f7a !important;
		color: #ffffff !important;
		font-size: 15px !important;
		font-weight: 500 !important;
		border-radius: 8px !important;
		border: none !important;
		box-shadow: none !important;
		cursor: pointer !important;
		text-decoration: none !important;
		display: inline-flex !important;
		align-items: center !important;
		justify-content: center !important;
		transition: background-color 0.15s ease !important;
	}

	:global(.vault-primary-button:hover) {
		background-color: #c95f6a !important;
	}

	/* Dividers */
	.divider-container {
		width: 100%;
	}

	.section-divider {
		border: none;
		border-top: 1px solid #e5e7eb;
		margin: 0;
		width: 100%;
	}

	/* Process Section */
	.process-section {
		padding: 96px 0 100px 0;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.process-header {
		margin-bottom: 56px;
		max-width: 780px;
	}

	.process-heading {
		font-family: 'Zen Dots', sans-serif;
		font-size: 36px;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: #202124;
		text-transform: uppercase;
		margin: 0 0 14px 0;
	}

	.process-subheading {
		font-size: 19px;
		font-weight: 400;
		line-height: 1.5;
		color: #6b7280;
		margin: 0;
	}

	.process-flow {
		display: flex;
		align-items: stretch;
		justify-content: center;
		gap: 16px;
		width: 100%;
		max-width: 1140px;
		margin-bottom: 64px;
	}

	:global(.process-card) {
		flex: 1 !important;
		background-color: #ffffff !important;
		border: 1px solid #e5e7eb !important;
		border-radius: 12px !important;
		padding: 32px 28px !important;
		box-shadow: none !important;
		text-align: left !important;
		display: flex !important;
		flex-direction: column !important;
		justify-content: flex-start !important;
		transition: border-color 0.15s ease !important;
		box-sizing: border-box !important;
	}

	:global(.process-card:hover) {
		border-color: #d1d5db !important;
	}

	.step-header {
		margin-bottom: 24px;
	}

	.step-number {
		font-size: 14px;
		font-weight: 600;
		color: #9ca3af;
		letter-spacing: 0.05em;
	}

	.step-title {
		font-family: 'Zen Dots', sans-serif;
		font-size: 20px;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: #202124;
		text-transform: uppercase;
		margin: 0 0 12px 0;
	}

	.step-description {
		font-size: 14px;
		font-weight: 400;
		line-height: 1.6;
		color: #6b7280;
		margin: 0;
	}

	.process-arrow {
		display: flex;
		align-items: center;
		justify-content: center;
		color: #9ca3af;
		padding: 0 4px;
		flex-shrink: 0;
	}

	:global(.arrow-icon) {
		opacity: 0.5;
	}

	.process-conclusion {
		text-align: center;
		padding-top: 8px;
	}

	.conclusion-text {
		font-family: 'Zen Dots', sans-serif;
		font-size: 36px;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: #202124;
		text-transform: uppercase;
		margin: 0;
	}

	/* Final CTA Section */
	.final-cta-section {
		padding: 88px 0 110px 0;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.final-cta-headline {
		font-family: 'Zen Dots', sans-serif;
		font-size: 34px;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: #202124;
		text-transform: uppercase;
		margin: 0 0 28px 0;
	}

	.final-cta-wrapper {
		display: flex;
		justify-content: center;
	}

	/* Responsive Breakpoints */
	@media (max-width: 960px) {
		.hero-headline {
			font-size: 52px;
		}

		.hero-tagline {
			font-size: 22px;
		}

		.hero-description {
			font-size: 18px;
		}

		.process-heading {
			font-size: 30px;
		}

		.process-flow {
			flex-direction: column;
			align-items: center;
			gap: 16px;
		}

		:global(.process-card) {
			width: 100% !important;
			max-width: 520px !important;
		}

		.process-arrow {
			transform: rotate(90deg);
			padding: 4px 0;
		}

		.conclusion-text {
			font-size: 28px;
		}

		.final-cta-headline {
			font-size: 28px;
		}
	}

	@media (max-width: 768px) {
		.vault-navbar {
			padding: 0 20px;
			height: 64px;
		}

		.brand-text {
			font-size: 18px;
		}

		.desktop-nav {
			display: none;
		}

		.mobile-menu-btn {
			display: block;
		}

		.mobile-drawer {
			display: flex;
		}

		.vault-main {
			padding: 0 20px;
		}

		.hero-section {
			padding-top: 72px;
			padding-bottom: 60px;
		}

		.hero-headline {
			font-size: 36px;
			margin-bottom: 14px;
		}

		.hero-tagline {
			font-size: 18px;
			margin-bottom: 16px;
		}

		.hero-description {
			font-size: 16px;
			margin-bottom: 28px;
		}

		.process-section {
			padding: 64px 0 72px 0;
		}

		.process-header {
			margin-bottom: 40px;
		}

		.process-heading {
			font-size: 24px;
		}

		.process-subheading {
			font-size: 16px;
		}

		.conclusion-text {
			font-size: 22px;
		}

		.final-cta-section {
			padding: 60px 0 80px 0;
		}

		.final-cta-headline {
			font-size: 22px;
			margin-bottom: 22px;
		}
	}
</style>
