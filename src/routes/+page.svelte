<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import * as Card from "#lib/components/ui/card/index.js";
	import { ExternalLink, Lock, ShieldCheck, Server, Menu, X } from "@lucide/svelte";

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

		<!-- Why Vault Section -->
		<section class="why-section">
			<h2 class="why-heading">WHY VAULT</h2>

			<div class="features-grid">
				<!-- Feature 1: Private -->
				<Card.Root class="feature-card">
					<div class="feature-icon-wrapper">
						<Lock size={20} strokeWidth={1.8} />
					</div>
					<h3 class="feature-title">PRIVATE</h3>
					<p class="feature-description">
						Your data stays under your control.
					</p>
				</Card.Root>

				<!-- Feature 2: Secure -->
				<Card.Root class="feature-card">
					<div class="feature-icon-wrapper">
						<ShieldCheck size={20} strokeWidth={1.8} />
					</div>
					<h3 class="feature-title">SECURE</h3>
					<p class="feature-description">
						Your data is protected.
					</p>
				</Card.Root>

				<!-- Feature 3: Self-hosted -->
				<Card.Root class="feature-card">
					<div class="feature-icon-wrapper">
						<Server size={20} strokeWidth={1.8} />
					</div>
					<h3 class="feature-title">SELF-HOSTED</h3>
					<p class="feature-description">
						Run Vault on your own infrastructure.
					</p>
				</Card.Root>
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
		font-size: 19px;
		font-weight: 700;
		letter-spacing: 0.08em;
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
		font-size: 74px;
		font-weight: 700;
		line-height: 1.05;
		letter-spacing: -0.02em;
		color: #202124;
		text-transform: uppercase;
		margin: 0 0 16px 0;
		max-width: 900px;
	}

	.hero-tagline {
		font-size: 26px;
		font-weight: 600;
		line-height: 1.3;
		color: #d96f7a;
		margin: 0 0 20px 0;
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

	/* Why Vault Section */
	.why-section {
		padding: 88px 0;
		text-align: center;
	}

	.why-heading {
		font-size: 28px;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: #202124;
		text-transform: uppercase;
		margin: 0 0 48px 0;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 28px;
		text-align: left;
	}

	:global(.feature-card) {
		background-color: #ffffff !important;
		border: 1px solid #e5e7eb !important;
		border-radius: 12px !important;
		padding: 32px 28px !important;
		box-shadow: none !important;
		transition: border-color 0.15s ease !important;
		display: flex !important;
		flex-direction: column !important;
		align-items: flex-start !important;
	}

	:global(.feature-card:hover) {
		border-color: #d1d5db !important;
	}

	.feature-icon-wrapper {
		width: 42px;
		height: 42px;
		border-radius: 8px;
		background-color: #f8f9fa;
		border: 1px solid #e5e7eb;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #202124;
		margin-bottom: 20px;
	}

	.feature-title {
		font-size: 15px;
		font-weight: 600;
		letter-spacing: 0.06em;
		color: #202124;
		text-transform: uppercase;
		margin: 0 0 8px 0;
	}

	.feature-description {
		font-size: 14px;
		font-weight: 400;
		line-height: 1.5;
		color: #6b7280;
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
		font-size: 28px;
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
			font-size: 54px;
		}

		.hero-tagline {
			font-size: 22px;
		}

		.hero-description {
			font-size: 18px;
		}

		.features-grid {
			grid-template-columns: 1fr;
			gap: 20px;
		}
	}

	@media (max-width: 768px) {
		.vault-navbar {
			padding: 0 20px;
			height: 64px;
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
			font-size: 38px;
			margin-bottom: 12px;
		}

		.hero-tagline {
			font-size: 19px;
			margin-bottom: 16px;
		}

		.hero-description {
			font-size: 16px;
			margin-bottom: 28px;
		}

		.why-section {
			padding: 60px 0;
		}

		.why-heading {
			font-size: 24px;
			margin-bottom: 32px;
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
