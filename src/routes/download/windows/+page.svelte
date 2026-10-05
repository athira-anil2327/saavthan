<script lang="ts">
	import DownloadNavbar from "#lib/components/DownloadNavbar.svelte";
	import * as Card from "#lib/components/ui/card/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
</script>

<svelte:head>
	<title>CHOOSE HOW YOU WANT TO USE VAULT — Windows</title>
	<meta
		name="description"
		content="Choose how you want to use Vault on Windows: Try instantly, subscribe to Pro, or self-host on your own infrastructure."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="windows-flow-page">
	<!-- Dedicated Download Flow Navbar (No Login) -->
	<DownloadNavbar />

	<main class="windows-flow-main">
		<!-- Page Header -->
		<section class="windows-flow-header">
			<span class="header-eyebrow">WINDOWS</span>
			<h1 class="header-heading">
				CHOOSE HOW YOU WANT TO USE VAULT
			</h1>
			<p class="header-subheading">
				Select the option that best fits how you want to use Vault.
			</p>
		</section>

		<!-- Three Options Grid (TRY -> PRO -> SELF-HOST) -->
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
						<Button class="vault-primary-button" type="button">
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
						<Button class="vault-primary-button" type="button">
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
	</main>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700&display=swap');

	/* Page Base Layout */
	.windows-flow-page {
		min-height: 100vh;
		background-color: #ffffff;
		color: #202124;
		display: flex;
		flex-direction: column;
		font-family: inherit;
		width: 100%;
		overflow-x: hidden;
	}

	/* Main Centered Content Container */
	.windows-flow-main {
		flex: 1;
		width: 100%;
		max-width: 1140px;
		margin: 0 auto;
		padding: 0 32px 96px 32px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	/* Header Section */
	.windows-flow-header {
		padding-top: 84px;
		padding-bottom: 56px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 800px;
	}

	.header-eyebrow {
		font-family: 'Orbitron', sans-serif;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.1em;
		color: #00b894;
		text-transform: uppercase;
		margin-bottom: 14px;
	}

	.header-heading {
		font-family: 'Orbitron', sans-serif;
		font-size: 42px;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: #202124;
		text-transform: uppercase;
		margin: 0 0 16px 0;
		line-height: 1.15;
	}

	.header-subheading {
		font-size: 18px;
		font-weight: 400;
		line-height: 1.55;
		color: #6b7280;
		margin: 0;
		max-width: 600px;
	}

	/* Options Section (TRY, PRO, SELF-HOST) */
	.options-section {
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
		min-height: 270px !important;
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
		text-align: left;
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

	/* Responsive Breakpoints */
	@media (max-width: 960px) {
		.header-heading {
			font-size: 34px;
		}

		.header-subheading {
			font-size: 16px;
		}

		.options-grid {
			grid-template-columns: 1fr;
			gap: 18px;
		}

		:global(.option-card) {
			min-height: auto !important;
		}
	}

	@media (max-width: 640px) {
		.windows-flow-main {
			padding: 0 20px 64px 20px;
		}

		.windows-flow-header {
			padding-top: 56px;
			padding-bottom: 36px;
		}

		.header-heading {
			font-size: 28px;
		}

		.header-subheading {
			font-size: 15px;
		}
	}
</style>
