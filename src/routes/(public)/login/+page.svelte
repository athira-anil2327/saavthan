<script lang="ts">
	import { Button } from '#lib/components/ui/button';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-svelte';

	let isSignUp = $state(false);
	let email = $state('');
	let password = $state('');
	let name = $state('');
	let loading = $state(false);

	const isPro = $derived(page.url.searchParams.get('plan') === 'pro');

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		setTimeout(() => {
			goto('/images');
		}, 300);
	}
</script>

<svelte:head>
	<title>Sign In - Vault</title>
</svelte:head>

<main class="w-full flex-1 flex flex-col items-center justify-center py-16 px-6">
	<div class="w-full max-w-[420px] bg-white border border-[#E5E7EB] rounded-2xl p-8 sm:p-10 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.04)]">
		<!-- Brand & Header -->
		<div class="flex flex-col items-center text-center mb-8">
			<div class="w-12 h-12 rounded-full bg-[#FFF1F1] flex items-center justify-center text-[#FF7675] mb-4">
				<ShieldCheck class="w-6 h-6" />
			</div>
			
			<h1 class="text-2xl font-bold tracking-tight text-[#202124]">
				{isSignUp ? 'Create your Vault account' : 'Sign in to Vault'}
			</h1>
			
			<p class="text-sm text-[#6B7280] mt-1.5 leading-relaxed">
				{#if isPro}
					Activate your 14-day Pro trial and access your secure workspace.
				{:else}
					Access your isolated virtual environments and images.
				{/if}
			</p>
		</div>

		<!-- Auth Mode Switcher Tabs -->
		<div class="grid grid-cols-2 p-1 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] mb-6 text-sm font-medium">
			<button
				type="button"
				onclick={() => (isSignUp = false)}
				class="py-2 rounded-lg transition-all text-center { !isSignUp ? 'bg-white text-[#202124] shadow-sm font-semibold' : 'text-[#6B7280] hover:text-[#202124]' }"
			>
				Sign In
			</button>
			<button
				type="button"
				onclick={() => (isSignUp = true)}
				class="py-2 rounded-lg transition-all text-center { isSignUp ? 'bg-white text-[#202124] shadow-sm font-semibold' : 'text-[#6B7280] hover:text-[#202124]' }"
			>
				Sign Up
			</button>
		</div>

		<!-- Auth Form -->
		<form onsubmit={handleSubmit} class="space-y-4">
			{#if isSignUp}
				<div>
					<label for="name" class="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-1.5">
						Full Name
					</label>
					<input
						id="name"
						type="text"
						bind:value={name}
						placeholder="Jane Doe"
						class="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#202124] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF7675] focus:ring-1 focus:ring-[#FF7675] transition-all"
					/>
				</div>
			{/if}

			<div>
				<label for="email" class="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-1.5">
					Email Address
				</label>
				<div class="relative">
					<div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
						<Mail class="w-4 h-4" />
					</div>
					<input
						id="email"
						type="email"
						bind:value={email}
						required
						placeholder="jane@company.com"
						class="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#202124] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF7675] focus:ring-1 focus:ring-[#FF7675] transition-all"
					/>
				</div>
			</div>

			<div>
				<div class="flex items-center justify-between mb-1.5">
					<label for="password" class="block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
						Password
					</label>
					{#if !isSignUp}
						<a href="#forgot" class="text-xs text-[#FF7675] hover:underline">
							Forgot password?
						</a>
					{/if}
				</div>
				<div class="relative">
					<div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
						<Lock class="w-4 h-4" />
					</div>
					<input
						id="password"
						type="password"
						bind:value={password}
						required
						placeholder="••••••••"
						class="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#202124] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF7675] focus:ring-1 focus:ring-[#FF7675] transition-all"
					/>
				</div>
			</div>

			<Button
				type="submit"
				disabled={loading}
				class="w-full h-[44px] bg-[#FF7675] hover:bg-[#ff6261] text-white text-sm font-medium rounded-lg transition-all cursor-pointer shadow-none flex items-center justify-center gap-2 mt-2"
			>
				<span>{isSignUp ? 'Create Account & Continue' : 'Sign In to Workspace'}</span>
				<ArrowRight class="w-4 h-4" />
			</Button>
		</form>

		<!-- Bottom Notice / Quick Access -->
		<div class="mt-6 pt-6 border-t border-[#E5E7EB] text-center">
			<a
				href="/images"
				class="text-xs text-[#6B7280] hover:text-[#202124] inline-flex items-center gap-1 transition-colors"
			>
				<span>Skip to workspace preview</span>
				<span>→</span>
			</a>
		</div>
	</div>
</main>
