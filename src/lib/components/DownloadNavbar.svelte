<script lang="ts">
	import { ExternalLink, Menu, X } from "@lucide/svelte";

	let mobileMenuOpen = $state(false);
	const githubRepoUrl = "https://github.com/athira-anil2327/saavthan";
</script>

<header class="download-navbar">
	<div class="navbar-container">
		<!-- Left: VAULT at extreme left -->
		<a href="/" class="brand-link">
			<span class="brand-text">VAULT</span>
		</a>

		<!-- Right: Source and Selfhost Guide (NO Login) -->
		<nav class="desktop-nav">
			<a
				href={githubRepoUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="nav-item nav-source-item"
			>
				<span>Source</span>
				<ExternalLink size={14} class="external-icon" />
			</a>

			<a href="/selfhost" class="nav-item">
				Selfhost Guide
			</a>
		</nav>

		<!-- Mobile Menu Toggle Button -->
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
	</div>

	<!-- Mobile Drawer -->
	{#if mobileMenuOpen}
		<div class="mobile-drawer">
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
			<a
				href="/selfhost"
				onclick={() => (mobileMenuOpen = false)}
				class="mobile-nav-item"
			>
				Selfhost Guide
			</a>
		</div>
	{/if}
</header>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700&display=swap');

	.download-navbar {
		width: 100%;
		background-color: #ffffff;
		border-bottom: 1px solid #e5e7eb;
		position: sticky;
		top: 0;
		z-index: 50;
		box-sizing: border-box;
	}

	.navbar-container {
		width: 100%;
		height: 72px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 32px;
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
		border-top: 1px solid #e5e7eb;
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

	@media (max-width: 768px) {
		.navbar-container {
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
	}
</style>
