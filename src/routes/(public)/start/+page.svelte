<script lang="ts">
	import { Button } from '#lib/components/ui/button';
	import { Card } from '#lib/components/ui/card';
	import { Check } from 'lucide-svelte';

	const plans = [
		{
			name: 'Free',
			tagline: 'For individuals exploring personal data privacy.',
			price: '$0',
			period: 'forever',
			features: [
				'1 Vault instance',
				'Up to 10 GB storage',
				'Standard encryption',
				'Community support'
			],
			buttonText: 'Get Started Free',
			popular: false
		},
		{
			name: 'Pro',
			tagline: 'For professionals and growing teams needing more power.',
			price: '$12',
			period: 'per month',
			features: [
				'Unlimited Vault instances',
				'500 GB storage included',
				'Advanced encryption & audit logs',
				'Priority support & updates'
			],
			buttonText: 'Start Pro Trial',
			popular: true
		},
		{
			name: 'Self-host',
			tagline: 'For organizations demanding 100% data sovereignty.',
			price: 'Custom',
			period: 'on-premise',
			features: [
				'Unlimited self-hosted nodes',
				'Deploy on your own servers',
				'Full source access & custom integrations',
				'Dedicated technical support'
			],
			buttonText: 'Deploy Self-Host',
			popular: false
		}
	];
</script>

<main class="w-full flex-1 flex flex-col items-center py-20 sm:py-24 px-6">
	<!-- Page Header -->
	<div class="text-center max-w-2xl mb-16">
		<div class="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#FFF1F1] text-xs font-medium text-[#FF7675] mb-4">
			Choose Your Plan
		</div>
		<h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-[#202124] mb-4">
			Start Using Vault
		</h1>
		<p class="text-base sm:text-lg text-[#6B7280] leading-relaxed">
			Select the option that best fits your workflow and take complete control over your data.
		</p>
	</div>

	<!-- Pricing / Plan Options -->
	<div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
		{#each plans as plan}
			<Card class="flex flex-col justify-between p-8 rounded-2xl border {plan.popular ? 'border-[#FF7675] shadow-[0_4px_24px_-4px_rgba(255,118,117,0.15)] ring-1 ring-[#FF7675]' : 'border-[#E5E7EB] shadow-none'} bg-white text-left transition-all">
				<div>
					<div class="flex items-center justify-between mb-4">
						<h3 class="text-xl font-bold text-[#202124]">
							{plan.name}
						</h3>
						{#if plan.popular}
							<span class="px-2.5 py-0.5 text-xs font-semibold text-[#FF7675] bg-[#FFF1F1] rounded-full">
								Popular
							</span>
						{/if}
					</div>

					<p class="text-sm text-[#6B7280] leading-relaxed mb-6 min-h-[40px]">
						{plan.tagline}
					</p>

					<div class="flex items-baseline gap-1.5 mb-8">
						<span class="text-3xl sm:text-4xl font-bold text-[#202124]">
							{plan.price}
						</span>
						<span class="text-xs text-[#6B7280]">
							/ {plan.period}
						</span>
					</div>

					<!-- Feature List -->
					<div class="space-y-3 mb-8">
						{#each plan.features as feature}
							<div class="flex items-center gap-2.5 text-sm text-[#202124]">
								<div class="w-4 h-4 rounded-full bg-[#FFF1F1] flex items-center justify-center text-[#FF7675] shrink-0">
									<Check class="w-2.5 h-2.5 stroke-[3]" />
								</div>
								<span>{feature}</span>
							</div>
						{/each}
					</div>
				</div>

				<div class="mt-auto pt-4">
					{#if plan.name === 'Self-host'}
						<a
							href="/selfhost"
							class="w-full h-[44px] text-sm font-medium rounded-lg transition-all cursor-pointer shadow-none inline-flex items-center justify-center {plan.popular ? 'bg-[#FF7675] hover:bg-[#ff6261] text-white' : 'bg-white hover:bg-[#F8F9FA] text-[#202124] border border-[#E5E7EB]'}"
						>
							{plan.buttonText}
						</a>
					{:else if plan.name === 'Pro'}
						<a
							href="/login?plan=pro"
							class="w-full h-[44px] text-sm font-medium rounded-lg transition-all cursor-pointer shadow-none inline-flex items-center justify-center bg-[#FF7675] hover:bg-[#ff6261] text-white"
						>
							{plan.buttonText}
						</a>
					{:else}
						<a
							href="/login?plan=free"
							class="w-full h-[44px] text-sm font-medium rounded-lg transition-all cursor-pointer shadow-none inline-flex items-center justify-center bg-white hover:bg-[#F8F9FA] text-[#202124] border border-[#E5E7EB]"
						>
							{plan.buttonText}
						</a>
					{/if}
				</div>
			</Card>
		{/each}
	</div>
</main>
