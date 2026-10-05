<script lang="ts">
	import { Separator } from '#lib/components/ui/separator';
	import { Check, Copy } from 'lucide-svelte';

	let activeSection = $state('getting-started');
	let copiedIndex = $state<number | null>(null);

	const sidebarItems = [
		{ id: 'getting-started', label: 'Getting Started' },
		{ id: 'requirements', label: 'Requirements' },
		{ id: 'installation', label: 'Installation' },
		{ id: 'configuration', label: 'Configuration' },
		{ id: 'running-vault', label: 'Running Vault' }
	];

	function copyCode(text: string, index: number) {
		navigator.clipboard.writeText(text);
		copiedIndex = index;
		setTimeout(() => {
			if (copiedIndex === index) copiedIndex = null;
		}, 2000);
	}

	function scrollToSection(id: string) {
		activeSection = id;
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}
</script>

<div class="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-10 pt-12 sm:pt-16 pb-20 lg:pb-28 flex-1 flex gap-10 lg:gap-16 xl:gap-20">
	<!-- LEFT SIDEBAR (Desktop) -->
	<aside class="hidden lg:block w-56 shrink-0 sticky top-32 h-[calc(100vh-10rem)] self-start overflow-y-auto">
		<div class="mb-6">
			<h4 class="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-3 px-3">
				SELF-HOST
			</h4>
			<nav class="space-y-1">
				{#each sidebarItems as item}
					<button
						type="button"
						onclick={() => scrollToSection(item.id)}
						class="w-full text-left text-sm py-2 px-3 rounded-md transition-colors cursor-pointer {activeSection === item.id ? 'bg-[#FFF1F1] text-[#FF7675] font-medium' : 'text-[#6B7280] hover:text-[#202124] hover:bg-[#F8F9FA]'}"
					>
						{item.label}
					</button>
				{/each}
			</nav>
		</div>
	</aside>

	<!-- MAIN DOCUMENTATION -->
	<main class="flex-1 min-w-0 max-w-3xl lg:px-4 py-2">
		<!-- Header Label & Main Heading -->
		<div class="mb-10 sm:mb-12">
			<span class="text-xs font-semibold uppercase tracking-wider text-[#FF7675] inline-block mb-3">
				SELF-HOST GUIDE
			</span>
			<h1 class="text-3xl sm:text-4xl md:text-[44px] font-bold tracking-tight text-[#202124] leading-tight mb-4">
				Self-host Vault
			</h1>
			<p class="text-base sm:text-lg text-[#6B7280] leading-relaxed">
				Run Vault on your own infrastructure and keep complete control over your data.
			</p>
		</div>

		<Separator class="bg-[#E5E7EB] my-10 sm:my-12" />

		<!-- SECTION 1: Getting Started -->
		<section id="getting-started" class="mb-16 sm:mb-20 scroll-mt-32">
			<h2 class="text-2xl font-bold tracking-tight text-[#202124] mb-4">
				Getting Started
			</h2>
			<p class="text-[15px] text-[#6B7280] leading-relaxed mb-4">
				Vault can be self-hosted on your own infrastructure, giving you complete control over your data, configuration and deployment.
			</p>
			<p class="text-[15px] text-[#6B7280] leading-relaxed">
				By hosting Vault yourself, you ensure that no third-party services have access to your stored files or internal records. Everything remains isolated in your environment.
			</p>
		</section>

		<Separator class="bg-[#E5E7EB] my-10 sm:my-12" />

		<!-- SECTION 2: Requirements -->
		<section id="requirements" class="mb-16 sm:mb-20 scroll-mt-32">
			<h2 class="text-2xl font-bold tracking-tight text-[#202124] mb-4">
				Requirements
			</h2>
			<p class="text-[15px] text-[#6B7280] leading-relaxed mb-4">
				Before getting started, make sure your environment meets the minimum system requirements:
			</p>
			<ul class="space-y-2.5 text-[15px] text-[#202124] pl-5 list-disc marker:text-[#FF7675]">
				<li>A server or local machine capable of running Vault</li>
				<li>A supported operating system (Linux, macOS, or Windows)</li>
				<li>Network access for the services Vault requires</li>
				<li>Sufficient storage for your data</li>
			</ul>
		</section>

		<Separator class="bg-[#E5E7EB] my-10 sm:my-12" />

		<!-- SECTION 3: Installation -->
		<section id="installation" class="mb-16 sm:mb-20 scroll-mt-32">
			<h2 class="text-2xl font-bold tracking-tight text-[#202124] mb-4">
				Installation
			</h2>
			<p class="text-[15px] text-[#6B7280] leading-relaxed mb-4">
				Download the Vault package and place it on the machine where you want to run the service.
			</p>

			<!-- Code block -->
			<div class="relative bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl overflow-hidden mb-6">
				<div class="flex items-center justify-between px-4 py-2 border-b border-[#E5E7EB] bg-white text-xs text-[#6B7280] font-mono">
					<span>bash</span>
					<button
						type="button"
						onclick={() => copyCode('git clone <your-vault-repository>\ncd vault\n./install.sh', 1)}
						class="flex items-center gap-1.5 hover:text-[#202124] transition-colors cursor-pointer"
						aria-label="Copy code"
					>
						{#if copiedIndex === 1}
							<Check class="w-3.5 h-3.5 text-[#FF7675]" />
							<span class="text-[#FF7675]">Copied</span>
						{:else}
							<Copy class="w-3.5 h-3.5" />
							<span>Copy</span>
						{/if}
					</button>
				</div>
				<pre class="p-4 text-sm font-mono text-[#202124] overflow-x-auto leading-relaxed"><code>git clone &lt;your-vault-repository&gt;
cd vault
./install.sh</code></pre>
			</div>
		</section>

		<Separator class="bg-[#E5E7EB] my-10 sm:my-12" />

		<!-- SECTION 4: Configuration -->
		<section id="configuration" class="mb-16 sm:mb-20 scroll-mt-32">
			<h2 class="text-2xl font-bold tracking-tight text-[#202124] mb-4">
				Configuration
			</h2>
			<p class="text-[15px] text-[#6B7280] leading-relaxed mb-4">
				Vault uses a straightforward configuration file to define storage paths, networking rules, and security options.
			</p>

			<!-- Code block -->
			<div class="relative bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl overflow-hidden mb-6">
				<div class="flex items-center justify-between px-4 py-2 border-b border-[#E5E7EB] bg-white text-xs text-[#6B7280] font-mono">
					<span>vault.config.json</span>
					<button
						type="button"
						onclick={() => copyCode('{\n  "port": 8080,\n  "host": "0.0.0.0",\n  "storage": "/var/lib/vault/data",\n  "encryption": "aes-256-gcm"\n}', 2)}
						class="flex items-center gap-1.5 hover:text-[#202124] transition-colors cursor-pointer"
						aria-label="Copy code"
					>
						{#if copiedIndex === 2}
							<Check class="w-3.5 h-3.5 text-[#FF7675]" />
							<span class="text-[#FF7675]">Copied</span>
						{:else}
							<Copy class="w-3.5 h-3.5" />
							<span>Copy</span>
						{/if}
					</button>
				</div>
				<pre class="p-4 text-sm font-mono text-[#202124] overflow-x-auto leading-relaxed"><code>{`{
  "port": 8080,
  "host": "0.0.0.0",
  "storage": "/var/lib/vault/data",
  "encryption": "aes-256-gcm"
}`}</code></pre>
			</div>
		</section>

		<Separator class="bg-[#E5E7EB] my-10 sm:my-12" />

		<!-- SECTION 5: Running Vault -->
		<section id="running-vault" class="mb-16 sm:mb-20 scroll-mt-32">
			<h2 class="text-2xl font-bold tracking-tight text-[#202124] mb-4">
				Running Vault
			</h2>
			<p class="text-[15px] text-[#6B7280] leading-relaxed mb-4">
				Once installed and configured, launch the Vault server using the CLI:
			</p>

			<!-- Code block -->
			<div class="relative bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl overflow-hidden mb-6">
				<div class="flex items-center justify-between px-4 py-2 border-b border-[#E5E7EB] bg-white text-xs text-[#6B7280] font-mono">
					<span>bash</span>
					<button
						type="button"
						onclick={() => copyCode('vault start', 3)}
						class="flex items-center gap-1.5 hover:text-[#202124] transition-colors cursor-pointer"
						aria-label="Copy code"
					>
						{#if copiedIndex === 3}
							<Check class="w-3.5 h-3.5 text-[#FF7675]" />
							<span class="text-[#FF7675]">Copied</span>
						{:else}
							<Copy class="w-3.5 h-3.5" />
							<span>Copy</span>
						{/if}
					</button>
				</div>
				<pre class="p-4 text-sm font-mono text-[#202124] overflow-x-auto leading-relaxed"><code>vault start</code></pre>
			</div>

			<p class="text-[15px] text-[#6B7280] leading-relaxed">
				Vault will start listening on your configured port. Open your browser or client application to connect to your instance.
			</p>
		</section>
	</main>

	<!-- RIGHT TOC (Desktop) -->
	<aside class="hidden xl:block w-56 shrink-0 sticky top-32 h-[calc(100vh-10rem)] self-start overflow-y-auto">
		<div class="pl-4 border-l border-[#E5E7EB]">
			<h4 class="text-xs font-semibold uppercase tracking-wider text-[#202124] mb-3">
				On this page
			</h4>
			<nav class="space-y-2">
				{#each sidebarItems as item}
					<button
						type="button"
						onclick={() => scrollToSection(item.id)}
						class="w-full text-left text-xs transition-colors cursor-pointer block {activeSection === item.id ? 'text-[#FF7675] font-medium' : 'text-[#6B7280] hover:text-[#202124]'}"
					>
						{item.label}
					</button>
				{/each}
			</nav>
		</div>
	</aside>
</div>
