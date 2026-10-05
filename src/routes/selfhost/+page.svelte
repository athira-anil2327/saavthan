<script lang="ts">
	import Navbar from "#lib/components/Navbar.svelte";
	import { Check, Copy, ChevronRight, Terminal, Server, Cpu, HardDrive } from "@lucide/svelte";

	let activeSection = $state("introduction");
	let copiedId = $state<string | null>(null);

	const sections = [
		{ id: "introduction", label: "Introduction" },
		{ id: "requirements", label: "Requirements" },
		{ id: "installation", label: "Installation" },
		{ id: "configuration", label: "Configuration" },
		{ id: "docker", label: "Docker" },
		{ id: "environment", label: "Environment" },
		{ id: "updating", label: "Updating" },
	];

	function copyToClipboard(text: string, id: string) {
		navigator.clipboard.writeText(text);
		copiedId = id;
		setTimeout(() => {
			if (copiedId === id) copiedId = null;
		}, 2000);
	}

	function scrollToSection(id: string) {
		activeSection = id;
		const el = document.getElementById(id);
		if (el) {
			const offset = 100;
			const bodyRect = document.body.getBoundingClientRect().top;
			const elementRect = el.getBoundingClientRect().top;
			const elementPosition = elementRect - bodyRect;
			const offsetPosition = elementPosition - offset;

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});
		}
	}
</script>

<svelte:head>
	<title>Self-Host Guide — VAULT</title>
	<meta
		name="description"
		content="Documentation and deployment instructions to self-host Vault on your own infrastructure with Docker."
	/>
</svelte:head>

<div class="min-h-screen bg-[#FFFFFF] text-[#202124] flex flex-col font-sans antialiased selection:bg-[#fff0f0] selection:text-[#ff7675]">
	<!-- Public Navbar -->
	<Navbar currentPath="/selfhost" />

	<!-- Main Documentation Layout -->
	<div class="max-w-[1400px] w-full mx-auto px-6 md:px-12 xl:px-16 flex-1 flex flex-col md:flex-row">
		<!-- Left Sidebar (Desktop) -->
		<aside class="hidden md:block w-64 shrink-0 py-10 pr-8 border-r border-[#E5E7EB] sticky top-18 h-[calc(100vh-4.5rem)] overflow-y-auto">
			<div class="mb-6">
				<h2 class="text-xs font-semibold tracking-wider text-[#6B7280] uppercase">
					SELFHOST GUIDE
				</h2>
			</div>

			<nav class="space-y-1">
				{#each sections as section}
					<button
						type="button"
						onclick={() => scrollToSection(section.id)}
						class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer flex items-center justify-between {activeSection === section.id ? 'bg-[#fff0f0] text-[#ff7675] font-semibold' : 'text-[#6B7280] hover:bg-[#F8F9FA] hover:text-[#202124]'}"
					>
						<span>{section.label}</span>
						{#if activeSection === section.id}
							<ChevronRight class="size-3.5 text-[#ff7675]" />
						{/if}
					</button>
				{/each}
			</nav>
		</aside>

		<!-- Mobile Quick Nav -->
		<div class="md:hidden py-4 border-b border-[#E5E7EB] overflow-x-auto">
			<div class="flex items-center gap-2">
				{#each sections as section}
					<button
						type="button"
						onclick={() => scrollToSection(section.id)}
						class="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors {activeSection === section.id ? 'bg-[#ff7675] text-white' : 'bg-[#F8F9FA] text-[#6B7280] border border-[#E5E7EB]'}"
					>
						{section.label}
					</button>
				{/each}
			</div>
		</div>

		<!-- Documentation Content -->
		<main class="flex-1 py-10 md:py-12 md:pl-12 lg:pl-16 max-w-3xl">
			<!-- Header -->
			<div class="mb-8">
				<h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-[#202124] mb-3">
					Self-host Vault
				</h1>
				<p class="text-lg text-[#6B7280]">
					Run Vault on your own infrastructure.
				</p>
			</div>

			<hr class="border-[#E5E7EB] mb-12" />

			<div class="space-y-14">
				<!-- Section 1: Introduction -->
				<section id="introduction" class="scroll-mt-24 space-y-4">
					<h2 class="text-xl font-bold text-[#202124]">
						Introduction
					</h2>
					<p class="text-[#6B7280] leading-relaxed">
						Vault is designed from the ground up to be self-hosted. By running Vault on your own server, your sensitive records, data, and configurations remain entirely under your control with zero third-party telemetry or dependencies.
					</p>
					<p class="text-[#6B7280] leading-relaxed">
						This guide walks you through provisioning prerequisites, configuring environment files, and running Vault containerized via Docker Compose.
					</p>
				</section>

				<!-- Section 2: Requirements -->
				<section id="requirements" class="scroll-mt-24 space-y-4">
					<h2 class="text-xl font-bold text-[#202124]">
						Requirements
					</h2>
					<p class="text-[#6B7280]">
						Before installing Vault, make sure you have:
					</p>

					<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
						<div class="p-4 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB]">
							<div class="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-[#202124] mb-3">
								<Terminal class="size-4" />
							</div>
							<h3 class="text-sm font-semibold text-[#202124] mb-1">Docker</h3>
							<p class="text-xs text-[#6B7280]">Docker Engine v24+ with Docker Compose v2+</p>
						</div>

						<div class="p-4 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB]">
							<div class="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-[#202124] mb-3">
								<Cpu class="size-4" />
							</div>
							<h3 class="text-sm font-semibold text-[#202124] mb-1">Git</h3>
							<p class="text-xs text-[#6B7280]">Git client installed for cloning the repository</p>
						</div>

						<div class="p-4 rounded-xl bg-[#F8F9FA] border border-[#E5E7EB]">
							<div class="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-[#202124] mb-3">
								<Server class="size-4" />
							</div>
							<h3 class="text-sm font-semibold text-[#202124] mb-1">Server</h3>
							<p class="text-xs text-[#6B7280]">1 CPU Core, 1 GB RAM, Linux / macOS / Windows</p>
						</div>
					</div>
				</section>

				<!-- Section 3: Installation -->
				<section id="installation" class="scroll-mt-24 space-y-4">
					<h2 class="text-xl font-bold text-[#202124]">
						Installation
					</h2>
					<p class="text-[#6B7280]">
						1. Clone the repository and navigate to the project directory:
					</p>

					<div class="relative group rounded-xl bg-[#18181B] text-[#F4F4F5] p-4 font-mono text-sm overflow-x-auto border border-[#27272A]">
						<button
							type="button"
							onclick={() => copyToClipboard("git clone https://github.com/athira-anil2327/vault.git\ncd vault", "clone-cmd")}
							class="absolute top-3 right-3 p-1.5 rounded-md bg-[#27272A] hover:bg-[#3F3F46] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
							aria-label="Copy to clipboard"
						>
							{#if copiedId === "clone-cmd"}
								<Check class="size-4 text-emerald-400" />
							{:else}
								<Copy class="size-4" />
							{/if}
						</button>
						<pre class="pr-10 leading-relaxed"><span class="text-[#71717A] select-none">$ </span>git clone https://github.com/athira-anil2327/vault.git
<span class="text-[#71717A] select-none">$ </span>cd vault</pre>
					</div>
				</section>

				<!-- Section 4: Configuration -->
				<section id="configuration" class="scroll-mt-24 space-y-4">
					<h2 class="text-xl font-bold text-[#202124]">
						Configuration
					</h2>
					<p class="text-[#6B7280]">
						Copy the sample environment file to create your local production configuration:
					</p>

					<div class="relative group rounded-xl bg-[#18181B] text-[#F4F4F5] p-4 font-mono text-sm overflow-x-auto border border-[#27272A]">
						<button
							type="button"
							onclick={() => copyToClipboard("cp .env.example .env", "env-cmd")}
							class="absolute top-3 right-3 p-1.5 rounded-md bg-[#27272A] hover:bg-[#3F3F46] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
							aria-label="Copy to clipboard"
						>
							{#if copiedId === "env-cmd"}
								<Check class="size-4 text-emerald-400" />
							{:else}
								<Copy class="size-4" />
							{/if}
						</button>
						<pre class="pr-10"><span class="text-[#71717A] select-none">$ </span>cp .env.example .env</pre>
					</div>

					<p class="text-sm text-[#6B7280]">
						Edit <code class="px-1.5 py-0.5 rounded bg-[#F8F9FA] border border-[#E5E7EB] text-[#202124] text-xs font-mono">.env</code> with your secret keys and domain settings before proceeding to deployment.
					</p>
				</section>

				<!-- Section 5: Docker -->
				<section id="docker" class="scroll-mt-24 space-y-4">
					<h2 class="text-xl font-bold text-[#202124]">
						Docker
					</h2>
					<p class="text-[#6B7280]">
						Start Vault in detached mode using Docker Compose:
					</p>

					<div class="relative group rounded-xl bg-[#18181B] text-[#F4F4F5] p-4 font-mono text-sm overflow-x-auto border border-[#27272A]">
						<button
							type="button"
							onclick={() => copyToClipboard("docker compose up -d", "docker-cmd")}
							class="absolute top-3 right-3 p-1.5 rounded-md bg-[#27272A] hover:bg-[#3F3F46] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
							aria-label="Copy to clipboard"
						>
							{#if copiedId === "docker-cmd"}
								<Check class="size-4 text-emerald-400" />
							{:else}
								<Copy class="size-4" />
							{/if}
						</button>
						<pre class="pr-10"><span class="text-[#71717A] select-none">$ </span>docker compose up -d</pre>
					</div>

					<p class="text-[#6B7280]">
						Verify container status and stream running service logs:
					</p>

					<div class="relative group rounded-xl bg-[#18181B] text-[#F4F4F5] p-4 font-mono text-sm overflow-x-auto border border-[#27272A]">
						<button
							type="button"
							onclick={() => copyToClipboard("docker compose logs -f", "logs-cmd")}
							class="absolute top-3 right-3 p-1.5 rounded-md bg-[#27272A] hover:bg-[#3F3F46] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
							aria-label="Copy to clipboard"
						>
							{#if copiedId === "logs-cmd"}
								<Check class="size-4 text-emerald-400" />
							{:else}
								<Copy class="size-4" />
							{/if}
						</button>
						<pre class="pr-10"><span class="text-[#71717A] select-none">$ </span>docker compose logs -f</pre>
					</div>
				</section>

				<!-- Section 6: Environment -->
				<section id="environment" class="scroll-mt-24 space-y-4">
					<h2 class="text-xl font-bold text-[#202124]">
						Environment Variables
					</h2>
					<p class="text-[#6B7280]">
						The following variables are available to customize your Vault instance:
					</p>

					<div class="border border-[#E5E7EB] rounded-xl overflow-hidden">
						<table class="w-full text-left text-sm">
							<thead class="bg-[#F8F9FA] border-b border-[#E5E7EB] text-[#202124] font-semibold">
								<tr>
									<th class="py-3 px-4">Variable</th>
									<th class="py-3 px-4">Default</th>
									<th class="py-3 px-4">Description</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-[#E5E7EB] text-[#6B7280]">
								<tr>
									<td class="py-3 px-4 font-mono text-xs text-[#202124]">PORT</td>
									<td class="py-3 px-4 font-mono text-xs">5173</td>
									<td class="py-3 px-4">Listening web port for the container</td>
								</tr>
								<tr>
									<td class="py-3 px-4 font-mono text-xs text-[#202124]">NODE_ENV</td>
									<td class="py-3 px-4 font-mono text-xs">production</td>
									<td class="py-3 px-4">Runtime environment mode</td>
								</tr>
								<tr>
									<td class="py-3 px-4 font-mono text-xs text-[#202124]">ORIGIN</td>
									<td class="py-3 px-4 font-mono text-xs">http://localhost:5173</td>
									<td class="py-3 px-4">Allowed public origin domain for requests</td>
								</tr>
								<tr>
									<td class="py-3 px-4 font-mono text-xs text-[#202124]">VAULT_SECRET</td>
									<td class="py-3 px-4 font-mono text-xs">—</td>
									<td class="py-3 px-4">32-character encryption key for stored secrets</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>

				<!-- Section 7: Updating -->
				<section id="updating" class="scroll-mt-24 space-y-4">
					<h2 class="text-xl font-bold text-[#202124]">
						Updating
					</h2>
					<p class="text-[#6B7280]">
						To update Vault to the latest release, pull the newest Git commits and recreate the containers:
					</p>

					<div class="relative group rounded-xl bg-[#18181B] text-[#F4F4F5] p-4 font-mono text-sm overflow-x-auto border border-[#27272A]">
						<button
							type="button"
							onclick={() => copyToClipboard("git pull origin main\ndocker compose down\ndocker compose up -d --build", "update-cmd")}
							class="absolute top-3 right-3 p-1.5 rounded-md bg-[#27272A] hover:bg-[#3F3F46] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
							aria-label="Copy to clipboard"
						>
							{#if copiedId === "update-cmd"}
								<Check class="size-4 text-emerald-400" />
							{:else}
								<Copy class="size-4" />
							{/if}
						</button>
						<pre class="pr-10 leading-relaxed"><span class="text-[#71717A] select-none">$ </span>git pull origin main
<span class="text-[#71717A] select-none">$ </span>docker compose down
<span class="text-[#71717A] select-none">$ </span>docker compose up -d --build</pre>
					</div>
				</section>
			</div>
		</main>
	</div>
</div>
