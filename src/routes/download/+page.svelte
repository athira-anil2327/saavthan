<script lang="ts">
	import DownloadNavbar from "#lib/components/DownloadNavbar.svelte";
	import * as Card from "#lib/components/ui/card/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { Download } from "@lucide/svelte";
</script>

<svelte:head>
	<title>DOWNLOAD VAULT — Windows</title>
	<meta
		name="description"
		content="Download Vault for Windows. A secure, zero-trace workspace for accessing sensitive documents on shared computers."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="download-page">
	<!-- Dedicated Download Flow Navbar (No Login) -->
	<DownloadNavbar />

	<main class="download-main">
		<!-- Hero Section -->
		<section class="download-hero">
			<span class="hero-eyebrow">DOWNLOAD VAULT</span>
			<h1 class="hero-heading">VAULT FOR WINDOWS</h1>
			<p class="hero-description">
				A secure, zero-trace workspace for accessing sensitive documents on shared computers.
			</p>
		</section>

		<!-- Large App Store-Style Windows Product/Download Card -->
		<section class="product-card-section">
			<Card.Root class="windows-product-card">
				<!-- Left Column: Product Information -->
				<div class="product-info-col">
					<div class="platform-badge-wrap">
						<span class="platform-badge">OFFICIAL RELEASE</span>
					</div>
					<h2 class="product-name">WINDOWS</h2>
					<p class="product-description">
						Run Vault securely on Windows with no installation or complex setup.
					</p>
				</div>

				<!-- Right Column: Windows Logo, Action Button & Platform Note -->
				<div class="product-action-col">
					<!-- Prominent Windows Icon Treatment -->
					<div class="windows-logo-wrap" aria-hidden="true">
						<svg class="windows-logo-svg" viewBox="0 0 24 24" fill="currentColor">
							<path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.8" />
						</svg>
					</div>

					<div class="action-btn-wrap">
						<Button href="/download/windows" class="vault-download-btn">
							<Download size={18} />
							<span>DOWNLOAD FOR WINDOWS</span>
						</Button>
						<span class="platform-note">Windows 10 / 11</span>
					</div>
				</div>
			</Card.Root>
		</section>
	</main>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700&display=swap');

	/* Page Base */
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

	/* Main Container */
	.download-main {
		flex: 1;
		width: 100%;
		max-width: 1040px;
		margin: 0 auto;
		padding: 0 32px 96px 32px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	/* Hero Section */
	.download-hero {
		padding-top: 88px;
		padding-bottom: 56px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 780px;
	}

	.hero-eyebrow {
		font-family: 'Orbitron', sans-serif;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.1em;
		color: #00b894;
		text-transform: uppercase;
		margin-bottom: 14px;
	}

	.hero-heading {
		font-family: 'Orbitron', sans-serif;
		font-size: 52px;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: #202124;
		text-transform: uppercase;
		margin: 0 0 16px 0;
		line-height: 1.1;
	}

	.hero-description {
		font-size: 18px;
		font-weight: 400;
		line-height: 1.6;
		color: #6b7280;
		margin: 0;
		max-width: 620px;
	}

	/* Product Card Section */
	.product-card-section {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	:global(.windows-product-card) {
		width: 100% !important;
		background-color: #ffffff !important;
		border: 1px solid #e5e7eb !important;
		border-radius: 16px !important;
		padding: 48px 44px !important;
		box-shadow: none !important;
		display: flex !important;
		flex-direction: row !important;
		align-items: center !important;
		justify-content: space-between !important;
		box-sizing: border-box !important;
		transition: border-color 0.15s ease !important;
		gap: 40px !important;
	}

	:global(.windows-product-card:hover) {
		border-color: #00b894 !important;
	}

	/* Left Column: Product Info */
	.product-info-col {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		text-align: left;
	}

	.platform-badge-wrap {
		margin-bottom: 12px;
	}

	.platform-badge {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.08em;
		color: #6b7280;
		background-color: #f8f9fa;
		border: 1px solid #e5e7eb;
		padding: 4px 10px;
		border-radius: 6px;
		text-transform: uppercase;
	}

	.product-name {
		font-family: 'Orbitron', sans-serif;
		font-size: 28px;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: #202124;
		text-transform: uppercase;
		margin: 0 0 12px 0;
	}

	.product-description {
		font-size: 15px;
		font-weight: 400;
		line-height: 1.6;
		color: #6b7280;
		margin: 0;
		max-width: 420px;
	}

	/* Right Column: Prominent Logo & Button */
	.product-action-col {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: center;
		gap: 24px;
		flex-shrink: 0;
	}

	.windows-logo-wrap {
		width: 64px;
		height: 64px;
		border-radius: 14px;
		background-color: #f8f9fa;
		border: 1px solid #e5e7eb;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #202124;
	}

	.windows-logo-svg {
		width: 32px;
		height: 32px;
	}

	.action-btn-wrap {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 8px;
	}

	:global(.vault-download-btn) {
		height: 48px !important;
		padding: 0 32px !important;
		background-color: #00b894 !important;
		color: #ffffff !important;
		font-size: 14px !important;
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
		gap: 10px !important;
		transition: background-color 0.15s ease !important;
	}

	:global(.vault-download-btn:hover) {
		background-color: #009f80 !important;
	}

	.platform-note {
		font-size: 13px;
		font-weight: 400;
		color: #6b7280;
	}

	/* Responsive Breakpoints */
	@media (max-width: 860px) {
		:global(.windows-product-card) {
			flex-direction: column !important;
			align-items: flex-start !important;
			padding: 36px 28px !important;
			gap: 32px !important;
		}

		.product-action-col {
			width: 100%;
			align-items: flex-start;
			flex-direction: row;
			justify-content: space-between;
		}

		.action-btn-wrap {
			flex: 1;
			align-items: stretch;
		}

		:global(.vault-download-btn) {
			width: 100% !important;
		}

		.platform-note {
			text-align: center;
		}
	}

	@media (max-width: 640px) {
		.download-main {
			padding: 0 20px 64px 20px;
		}

		.download-hero {
			padding-top: 60px;
			padding-bottom: 40px;
		}

		.hero-heading {
			font-size: 34px;
		}

		.hero-description {
			font-size: 15px;
		}

		.product-action-col {
			flex-direction: column;
			align-items: flex-start;
			gap: 20px;
		}

		.action-btn-wrap {
			width: 100%;
		}
	}
</style>
