<script lang="ts">
	import { Check, Download, ArrowRight } from 'lucide-svelte';

	const plans = [
		{
			id: 'free',
			badge: 'Free / Public Use',
			title: 'Public Clean Room',
			description: 'Designed for everyday citizens accessing public cyber cafes or shared kiosks without leaving a trace.',
			price: 'Free',
			period: 'forever',
			features: [
				'Single-click portable .exe app',
				'Lightweight QEMU sandbox isolation',
				'Zero digital footprint on exit',
				'Free community updates'
			],
			buttonText: 'Download SecureBox',
			popular: false
		},
		{
			id: 'pro',
			badge: 'For Power Users & Technicians',
			title: 'Advanced Workspace',
			description: 'For power users and small businesses requiring enhanced security controls, custom network routing, and priority updates.',
			price: '$12',
			period: 'per month',
			features: [
				'Custom Cloudflare Tunnel routing',
				'Extended session timeouts & custom RAM allocation',
				'Advanced session logging & audit trails',
				'Priority technical support & updates'
			],
			buttonText: 'Start Pro Trial',
			popular: true
		},
		{
			id: 'enterprise',
			badge: 'For Cyber Cafes & Enterprises',
			title: 'Enterprise Kiosk',
			description: 'For cyber cafes, Common Service Centres (CSCs), and institutions demanding 100% data sovereignty and fleet-wide deployment.',
			price: 'Custom',
			period: 'on-premise',
			features: [
				'Fleet-wide deployment on Windows nodes',
				'Centralized kiosk management & configuration',
				'Full source access & custom integrations',
				'Dedicated enterprise technical support'
			],
			buttonText: 'Deploy Self-Host',
			popular: false
		}
	];
</script>

<svelte:head>
	<title>Pricing & Plans — Vault</title>
</svelte:head>

<main class="w-full flex-1 flex flex-col items-center py-12 sm:py-20 px-4 sm:px-6 bg-background text-foreground transition-colors">
	<!-- Page Header -->
	<div class="text-center max-w-2xl mb-10 sm:mb-12">
		<h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
			Start Using Vault
		</h1>
		<p class="text-sm sm:text-base text-muted-foreground leading-relaxed">
			Select the option that best fits your workflow and take complete control over your data.
		</p>
	</div>

	<!-- Pricing / Plan Options -->
	<div class="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
		{#each plans as plan}
			<div class="flex flex-col justify-between p-6 sm:p-8 rounded-xl border bg-card text-card-foreground transition-all shadow-xs {plan.popular ? 'border-primary ring-1 ring-primary shadow-md relative' : 'border-border'}">
				<div>
					<div class="flex items-center justify-between gap-2 mb-2">
						<span class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
							{plan.badge}
						</span>
						{#if plan.popular}
							<span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
								Popular
							</span>
						{/if}
					</div>

					<h3 class="text-xl font-bold tracking-tight text-foreground mb-2">
						{plan.title}
					</h3>

					<p class="text-xs text-muted-foreground leading-relaxed mb-6 min-h-[42px]">
						{plan.description}
					</p>

					<div class="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-border/60">
						<span class="text-3xl sm:text-4xl font-extrabold text-foreground">
							{plan.price}
						</span>
						<span class="text-xs text-muted-foreground">
							/ {plan.period}
						</span>
					</div>

					<!-- Feature List -->
					<div class="space-y-3 mb-8">
						{#each plan.features as feature}
							<div class="flex items-start gap-2.5 text-xs text-foreground leading-relaxed">
								<div class="w-4 h-4 rounded-md bg-accent flex items-center justify-center text-primary shrink-0 mt-0.5 border border-primary/20">
									<Check class="w-2.5 h-2.5 stroke-[3]" />
								</div>
								<span>{feature}</span>
							</div>
						{/each}
					</div>
				</div>

				<div class="mt-auto pt-4 border-t border-border/60">
					{#if plan.id === 'enterprise'}
						<a
							href="/selfhost"
							class="w-full h-10 rounded-lg text-xs font-semibold transition-all cursor-pointer inline-flex items-center justify-center bg-muted hover:bg-muted/80 text-foreground border border-border shadow-xs"
						>
							{plan.buttonText}
						</a>
					{:else if plan.id === 'pro'}
						<a
							href="/login?plan=pro"
							class="w-full h-10 rounded-lg text-xs font-semibold transition-all cursor-pointer inline-flex items-center justify-center bg-primary hover:opacity-90 text-primary-foreground shadow-xs"
						>
							{plan.buttonText}
						</a>
					{:else}
						<a
							href="/#windows-download"
							class="w-full h-10 rounded-lg text-xs font-semibold transition-all cursor-pointer inline-flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 text-foreground border border-border shadow-xs"
						>
							<Download class="w-3.5 h-3.5 text-muted-foreground" />
							<span>{plan.buttonText}</span>
						</a>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</main>
