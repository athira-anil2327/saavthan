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

<svelte:head>
	<title>Self-Host Guide — Vault</title>
</svelte:head>

<div class="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-10 pt-12 sm:pt-16 pb-20 lg:pb-28 flex-1 flex gap-10 lg:gap-16 xl:gap-20 bg-background text-foreground transition-colors">
	<!-- LEFT SIDEBAR (Desktop) -->
	<aside class="hidden lg:block w-56 shrink-0 sticky top-24 h-[calc(100vh-8rem)] self-start overflow-y-auto">
		<div class="mb-6">
			<h4 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-3">
				SELF-HOST
			</h4>
			<nav class="space-y-1">
				{#each sidebarItems as item}
					<button
						type="button"
						onclick={() => scrollToSection(item.id)}
						class="w-full text-left text-xs py-2 px-3 rounded-lg transition-colors cursor-pointer {activeSection === item.id ? 'bg-accent text-accent-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'}"
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
			<span class="text-xs font-semibold uppercase tracking-wider text-primary inline-block mb-3">
				SELF-HOST GUIDE
			</span>
			<h1 class="text-3xl sm:text-4xl md:text-[44px] font-bold tracking-tight text-foreground leading-tight mb-4">
				Self-host Vault
			</h1>
			<p class="text-base sm:text-lg text-muted-foreground leading-relaxed">
				Run Vault on your own infrastructure and keep complete control over your data.
			</p>
		</div>

		<Separator class="bg-border my-10 sm:my-12" />

		<!-- SECTION 1: Getting Started -->
		<section id="getting-started" class="mb-16 sm:mb-20 scroll-mt-28">
			<h2 class="text-2xl font-bold tracking-tight text-foreground mb-4">
				Getting Started
			</h2>
			<p class="text-[15px] text-muted-foreground leading-relaxed mb-4">
				Vault can be self-hosted on your own infrastructure, giving you complete control over your data, configuration and deployment.
			</p>
			<p class="text-[15px] text-muted-foreground leading-relaxed">
				By hosting Vault yourself, you ensure that no third-party services have access to your stored files or internal records. Everything remains isolated in your environment.
			</p>
		</section>

		<Separator class="bg-border my-10 sm:my-12" />

		<!-- SECTION 2: Requirements -->
		<section id="requirements" class="mb-16 sm:mb-20 scroll-mt-28">
			<h2 class="text-2xl font-bold tracking-tight text-foreground mb-4">
				Requirements
			</h2>
			<p class="text-[15px] text-muted-foreground leading-relaxed mb-4">
				Before getting started, make sure your environment meets the minimum system requirements:
			</p>
			<ul class="space-y-2.5 text-[15px] text-foreground pl-5 list-disc marker:text-primary">
				<li>A server or local machine capable of running Vault</li>
				<li>A supported operating system (Linux, macOS, or Windows)</li>
				<li>Network access for the services Vault requires</li>
				<li>Sufficient storage for your data</li>
			</ul>
		</section>

		<Separator class="bg-border my-10 sm:my-12" />

		<!-- SECTION 3: Installation -->
		<section id="installation" class="mb-16 sm:mb-20 scroll-mt-28">
			<h2 class="text-2xl font-bold tracking-tight text-foreground mb-4">
				Installation
			</h2>
			<p class="text-[15px] text-muted-foreground leading-relaxed mb-6">
				Clone the repository and install dependencies using Python and npm:
			</p>

			<div class="relative rounded-xl border border-border bg-card p-4 font-mono text-xs text-card-foreground shadow-xs">
				<div class="flex items-center justify-between pb-2 mb-2 border-b border-border text-muted-foreground text-[11px]">
					<span>bash</span>
					<button
						type="button"
						onclick={() => copyCode('git clone https://github.com/fahimshafeek/Saavthan.git\ncd Saavthan\npython server.py serve', 1)}
						class="flex items-center gap-1 hover:text-foreground cursor-pointer"
					>
						{#if copiedIndex === 1}
							<Check class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
							<span class="text-emerald-600 dark:text-emerald-400">Copied</span>
						{:else}
							<Copy class="w-3.5 h-3.5" />
							<span>Copy</span>
						{/if}
					</button>
				</div>
				<pre class="overflow-x-auto leading-relaxed">git clone https://github.com/fahimshafeek/Saavthan.git
cd Saavthan
python server.py serve --port 8443</pre>
			</div>
		</section>
	</main>
</div>
