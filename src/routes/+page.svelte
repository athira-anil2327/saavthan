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
				SECURE YOUR<br />CUSTOMER.
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

			<!-- Three Sequential Process Blocks with Centered Arrows -->
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
					<ArrowRight size={22} />
				</div>

				<!-- Step 02: WORK -->
				<Card.Root class="process-card">
					<div class="step-header">
						<span class="step-number">02</span>
					</div>
					<h3 class="step-title">WORK</h3>
					<p class="step-description">
						Customers can safely access, download and print their documents.
					</p>
				</Card.Root>

				<!-- Process Arrow Connector -->
				<div class="process-arrow" aria-hidden="true">
					<ArrowRight size={22} />
				</div>

				<!-- Step 03: WIPE -->
				<Card.Root class="process-card">
					<div class="step-header">
						<span class="step-number">03</span>
					</div>
					<h3 class="step-title">WIPE</h3>
					<p class="step-description">
						When the session ends, the environment disappears with its data.
					</p>
				</Card.Root>
			</div>

			<!-- Process Conclusion Statement -->
			<div class="process-conclusion">
				<h3 class="conclusion-text">
					ONE SESSION. <span class="accent-text">ZERO TRACE.</span>
				</h3>
			</div>
		</section>
	</main>
</div>

<style>
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
		height: 68px;
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
		font-size: 19px;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: #202124;
		transition: color 0.15s ease;
	}

	.brand-link:hover .brand-text {
		color: #00b894;
	}

	.desktop-nav {
		display: flex;
		align-items: center;
		gap: 28px;
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
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 32px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	/* Hero Section */
	.hero-section {
		padding-top: 96px;
		padding-bottom: 72px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.hero-headline {
		font-size: 54px;
		font-weight: 700;
		line-height: 1.15;
		letter-spacing: -0.02em;
		color: #202124;
		text-transform: uppercase;
		margin: 0 0 16px 0;
		max-width: 840px;
	}

	.hero-tagline {
		font-size: 22px;
		font-weight: 600;
		line-height: 1.35;
		letter-spacing: -0.01em;
		color: #00b894;
		margin: 0 0 18px 0;
		max-width: 700px;
	}

	.hero-description {
		font-size: 17px;
		font-weight: 400;
		line-height: 1.6;
		color: #6b7280;
		max-width: 600px;
		margin: 0 0 32px 0;
	}

	.hero-cta-wrapper {
		display: flex;
		justify-content: center;
	}

	:global(.vault-primary-button) {
		height: 46px !important;
		padding: 0 32px !important;
		background-color: #00b894 !important;
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
		background-color: #009f80 !important;
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
		padding: 72px 0 84px 0;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.process-header {
		margin-bottom: 48px;
		max-width: 680px;
	}

	.process-heading {
		font-size: 28px;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: #202124;
		text-transform: uppercase;
		margin: 0 0 10px 0;
	}

	.process-subheading {
		font-size: 16px;
		font-weight: 400;
		line-height: 1.5;
		color: #6b7280;
		margin: 0;
	}

	/* Perfectly Aligned Equal 3-Card Grid with Centered Connectors */
	.process-flow {
		display: grid;
		grid-template-columns: 1fr auto 1fr auto 1fr;
		align-items: center;
		gap: 16px;
		width: 100%;
		max-width: 1080px;
		margin-bottom: 52px;
	}

	:global(.process-card) {
		height: 100% !important;
		background-color: #ffffff !important;
		border: 1px solid #e5e7eb !important;
		border-radius: 12px !important;
		padding: 30px 26px !important;
		box-shadow: none !important;
		text-align: left !important;
		display: flex !important;
		flex-direction: column !important;
		justify-content: flex-start !important;
		box-sizing: border-box !important;
		transition: border-color 0.15s ease !important;
	}

	:global(.process-card:hover) {
		border-color: #00b894 !important;
	}

	.step-header {
		margin-bottom: 20px;
	}

	.step-number {
		font-size: 13px;
		font-weight: 600;
		color: #9ca3af;
		letter-spacing: 0.04em;
	}

	.step-title {
		font-size: 16px;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: #00b894;
		text-transform: uppercase;
		margin: 0 0 8px 0;
	}

	.step-description {
		font-size: 14px;
		font-weight: 400;
		line-height: 1.55;
		color: #6b7280;
		margin: 0;
	}

	.process-arrow {
		display: flex;
		align-items: center;
		justify-content: center;
		color: #00b894;
		padding: 0 6px;
		flex-shrink: 0;
	}

	.process-conclusion {
		text-align: center;
		padding-top: 8px;
	}

	.conclusion-text {
		font-size: 24px;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: #202124;
		text-transform: uppercase;
		margin: 0;
	}

	.accent-text {
		color: #00b894;
	}

	/* Responsive Breakpoints */
	@media (max-width: 960px) {
		.hero-headline {
			font-size: 42px;
		}

		.hero-tagline {
			font-size: 19px;
		}

		.hero-description {
			font-size: 15px;
		}

		.process-heading {
			font-size: 24px;
		}

		.process-flow {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 16px;
		}

		:global(.process-card) {
			width: 100% !important;
			max-width: 480px !important;
		}

		.process-arrow {
			transform: rotate(90deg);
			padding: 4px 0;
		}

		.conclusion-text {
			font-size: 20px;
		}
	}

	@media (max-width: 768px) {
		.vault-navbar {
			padding: 0 20px;
			height: 64px;
		}

		.brand-text {
			font-size: 17px;
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
			padding-top: 60px;
			padding-bottom: 48px;
		}

		.hero-headline {
			font-size: 32px;
			margin-bottom: 12px;
		}

		.hero-tagline {
			font-size: 17px;
			margin-bottom: 14px;
		}

		.hero-description {
			font-size: 14px;
			margin-bottom: 24px;
		}

		.process-section {
			padding: 48px 0 56px 0;
		}

		.process-header {
			margin-bottom: 32px;
		}

		.process-heading {
			font-size: 20px;
		}

		.process-subheading {
			font-size: 14px;
		}

		.conclusion-text {
			font-size: 18px;
		}
	}
</style>
