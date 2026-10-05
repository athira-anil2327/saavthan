<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import * as Card from "#lib/components/ui/card/index.js";
	import { ExternalLink, Menu, X, Download } from "@lucide/svelte";

	let mobileMenuOpen = $state(false);
	const githubRepoUrl = "https://github.com/athira-anil2327/saavthan";
</script>

<svelte:head>
	<title>DOWNLOAD VAULT — Deployment Options</title>
	<meta
		name="description"
		content="Choose how you want to use Vault: Try instantly, subscribe to Pro, or self-host Vault on your own infrastructure."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="download-page">
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

	<!-- Main Content Area -->
	<main class="download-main">
		<!-- Page Hero -->
		<section class="download-hero">
			<h1 class="hero-heading">
				DOWNLOAD VAULT
			</h1>
			<p class="hero-subheading">
				Choose how you want to use Vault.
			</p>
		</section>

		<!-- Three Main Options (TRY -> PRO -> SELF-HOST) -->
		<section class="options-section">
			<div class="options-grid">
				<!-- Option 1: TRY -->
				<Card.Root class="option-card">
					<div class="card-content-wrap">
						<h2 class="card-title">TRY</h2>
						<p class="card-description">
							Experience Vault quickly with no setup.
						</p>
					</div>
					<div class="card-action-wrap">
						<Button href="/login" class="vault-primary-button">
							TRY
						</Button>
					</div>
				</Card.Root>

				<!-- Option 2: PRO -->
				<Card.Root class="option-card pro-card">
					<div class="card-content-wrap">
						<h2 class="card-title">PRO</h2>
						<p class="card-description">
							Use the full hosted Vault experience with no infrastructure to manage.
						</p>
					</div>
					<div class="card-action-wrap">
						<Button href="/login" class="vault-primary-button">
							GET PRO
						</Button>
					</div>
				</Card.Root>

				<!-- Option 3: SELF-HOST -->
				<Card.Root class="option-card">
					<div class="card-content-wrap">
						<h2 class="card-title">SELF-HOST</h2>
						<p class="card-description">
							Run Vault on your own infrastructure.
						</p>
					</div>
					<div class="card-action-wrap">
						<Button href="/selfhost" class="vault-primary-button">
							SELF-HOST
						</Button>
					</div>
				</Card.Root>
			</div>
		</section>

		<!-- Section Separator -->
		<div class="divider-container">
			<hr class="section-divider" />
		</div>

		<!-- Self-Host OS Downloads Section -->
		<section class="selfhost-downloads-section">
			<div class="section-header">
				<span class="section-badge">SELF-HOST</span>
				<h2 class="section-title">
					DOWNLOAD FOR YOUR PLATFORM
				</h2>
				<p class="section-description">
					Download the Vault application for your operating system.
				</p>
			</div>

			<!-- OS Cards (WINDOWS, macOS, LINUX) -->
			<div class="os-grid">
				<!-- OS 1: Windows -->
				<Card.Root class="os-card">
					<div class="os-content-wrap">
						<h3 class="os-title">WINDOWS</h3>
						<p class="os-subtitle">Windows 10 / 11</p>
					</div>
					<div class="os-action-wrap">
						<Button class="vault-os-button" type="button">
							<Download size={16} />
							<span>DOWNLOAD</span>
						</Button>
					</div>
				</Card.Root>

				<!-- OS 2: macOS -->
				<Card.Root class="os-card">
					<div class="os-content-wrap">
						<h3 class="os-title">macOS</h3>
						<p class="os-subtitle">macOS</p>
					</div>
					<div class="os-action-wrap">
						<Button class="vault-os-button" type="button">
							<Download size={16} />
							<span>DOWNLOAD</span>
						</Button>
					</div>
				</Card.Root>

				<!-- OS 3: Linux -->
				<Card.Root class="os-card">
					<div class="os-content-wrap">
						<h3 class="os-title">LINUX</h3>
						<p class="os-subtitle">Linux</p>
					</div>
					<div class="os-action-wrap">
						<Button class="vault-os-button" type="button">
							<Download size={16} />
							<span>DOWNLOAD</span>
						</Button>
					</div>
				</Card.Root>
			</div>
		</section>
	</main>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700&display=swap');

	/* Page Base Layout */
	.download-page {
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
		font-family: 'Orbitron', sans-serif;
		font-size: 20px;
		font-weight: 700;
		letter-spacing: 0.05em;
		color: #202124;
		transition: color 0.15s ease;
	}

	.brand-link:hover .brand-text {
		color: #00b894;
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
	.download-main {
		flex: 1;
		width: 100%;
		max-width: 1160px;
		margin: 0 auto;
		padding: 0 32px 96px 32px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}

	/* Hero Section */
	.download-hero {
		padding-top: 80px;
		padding-bottom: 56px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.hero-heading {
		font-family: 'Orbitron', sans-serif;
		font-size: 56px;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: #202124;
		text-transform: uppercase;
		margin: 0 0 16px 0;
	}

	.hero-subheading {
		font-size: 19px;
		font-weight: 400;
		line-height: 1.5;
		color: #6b7280;
		margin: 0;
	}

	/* Options Section (TRY, PRO, SELF-HOST) */
	.options-section {
		margin-bottom: 64px;
		width: 100%;
	}

	.options-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
		width: 100%;
		align-items: stretch;
	}

	:global(.option-card) {
		background-color: #ffffff !important;
		border: 1px solid #e5e7eb !important;
		border-radius: 12px !important;
		padding: 36px 30px !important;
		box-shadow: none !important;
		display: flex !important;
		flex-direction: column !important;
		justify-content: space-between !important;
		box-sizing: border-box !important;
		height: 100% !important;
		min-height: 260px !important;
		transition: border-color 0.15s ease !important;
	}

	:global(.option-card:hover) {
		border-color: #00b894 !important;
	}

	:global(.pro-card) {
		border: 1px solid #00b894 !important;
	}

	.card-content-wrap {
		display: flex;
		flex-direction: column;
		margin-bottom: 32px;
	}

	.card-title {
		font-family: 'Orbitron', sans-serif;
		font-size: 22px;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: #202124;
		text-transform: uppercase;
		margin: 0 0 14px 0;
	}

	.card-description {
		font-size: 15px;
		font-weight: 400;
		line-height: 1.6;
		color: #6b7280;
		margin: 0;
	}

	.card-action-wrap {
		width: 100%;
	}

	:global(.vault-primary-button) {
		width: 100% !important;
		height: 46px !important;
		background-color: #00b894 !important;
		color: #ffffff !important;
		font-size: 14px !important;
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

	/* Divider */
	.divider-container {
		width: 100%;
		margin-bottom: 64px;
	}

	.section-divider {
		border: none;
		border-top: 1px solid #e5e7eb;
		margin: 0;
		width: 100%;
	}

	/* Self-Host Downloads Section */
	.selfhost-downloads-section {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
	}

	.section-header {
		margin-bottom: 48px;
		max-width: 720px;
	}

	.section-badge {
		display: inline-block;
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.08em;
		color: #00b894;
		text-transform: uppercase;
		margin-bottom: 12px;
	}

	.section-title {
		font-family: 'Orbitron', sans-serif;
		font-size: 32px;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: #202124;
		text-transform: uppercase;
		margin: 0 0 12px 0;
	}

	.section-description {
		font-size: 17px;
		font-weight: 400;
		line-height: 1.5;
		color: #6b7280;
		margin: 0;
	}

	/* OS Cards Grid (WINDOWS, macOS, LINUX) */
	.os-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
		width: 100%;
		align-items: stretch;
	}

	:global(.os-card) {
		background-color: #ffffff !important;
		border: 1px solid #e5e7eb !important;
		border-radius: 12px !important;
		padding: 32px 28px !important;
		box-shadow: none !important;
		display: flex !important;
		flex-direction: column !important;
		justify-content: space-between !important;
		box-sizing: border-box !important;
		height: 100% !important;
		min-height: 200px !important;
		transition: border-color 0.15s ease !important;
	}

	:global(.os-card:hover) {
		border-color: #00b894 !important;
	}

	.os-content-wrap {
		display: flex;
		flex-direction: column;
		margin-bottom: 24px;
		text-align: left;
	}

	.os-title {
		font-family: 'Orbitron', sans-serif;
		font-size: 18px;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: #202124;
		margin: 0 0 8px 0;
	}

	.os-subtitle {
		font-size: 14px;
		font-weight: 400;
		color: #6b7280;
		margin: 0;
	}

	.os-action-wrap {
		width: 100%;
	}

	:global(.vault-os-button) {
		width: 100% !important;
		height: 44px !important;
		background-color: #00b894 !important;
		color: #ffffff !important;
		font-size: 13px !important;
		font-weight: 600 !important;
		letter-spacing: 0.04em !important;
		border-radius: 8px !important;
		border: none !important;
		box-shadow: none !important;
		cursor: pointer !important;
		text-decoration: none !important;
		display: inline-flex !important;
		align-items: center !important;
		justify-content: center !important;
		gap: 8px !important;
		transition: background-color 0.15s ease !important;
	}

	:global(.vault-os-button:hover) {
		background-color: #009f80 !important;
	}

	/* Responsive Breakpoints */
	@media (max-width: 960px) {
		.hero-heading {
			font-size: 42px;
		}

		.hero-subheading {
			font-size: 17px;
		}

		.section-title {
			font-size: 26px;
		}

		.options-grid,
		.os-grid {
			grid-template-columns: 1fr;
			gap: 16px;
		}

		:global(.option-card),
		:global(.os-card) {
			min-height: auto !important;
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

		.download-main {
			padding: 0 20px 64px 20px;
		}

		.download-hero {
			padding-top: 56px;
			padding-bottom: 40px;
		}

		.hero-heading {
			font-size: 32px;
			margin-bottom: 12px;
		}

		.hero-subheading {
			font-size: 16px;
		}

		.section-header {
			margin-bottom: 32px;
		}

		.section-title {
			font-size: 22px;
		}

		.section-description {
			font-size: 15px;
		}
	}
</style>
