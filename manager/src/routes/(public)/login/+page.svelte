<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-svelte';
	import { loginStaff, bootstrapStaff, getAuthStatus, getStoredRole } from '$lib/saavthan-api';

	let isSignUp = $state(false);
	let email = $state('');
	let password = $state('');
	let name = $state('');
	let loading = $state(false);
	let errorMessage = $state<string | null>(null);

	const isPro = $derived(page.url.searchParams.get('plan') === 'pro');

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		errorMessage = null;
		try {
			if (isSignUp) {
				const status = await getAuthStatus();
				if (!status.bootstrapped) {
					const ok = await bootstrapStaff(email, password);
					if (ok) {
						goto('/manager');
						return;
					}
				}
			}

			const success = await loginStaff(email, password);
			if (success) {
				goto('/manager');
			} else {
				errorMessage = 'Invalid credentials or unable to reach node authentication service.';
			}
		} catch (err: any) {
			errorMessage = err?.message || 'Authentication failed.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Sign In - Vault</title>
</svelte:head>

<main class="w-full flex-1 flex flex-col items-center justify-center py-16 px-6 bg-background text-foreground transition-colors">
	<div class="w-full max-w-[420px] bg-card border border-border rounded-2xl p-8 sm:p-10 shadow-md">
		<!-- Brand & Header -->
		<div class="flex flex-col items-center text-center mb-8">
			<div class="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-primary mb-4 border border-border shadow-xs">
				<ShieldCheck class="w-6 h-6" />
			</div>
			
			<h1 class="text-2xl font-bold tracking-tight text-foreground">
				{isSignUp ? 'Create your Vault account' : 'Sign in to Vault'}
			</h1>
			
			<p class="text-sm text-muted-foreground mt-1.5 leading-relaxed">
				{#if isPro}
					Activate your 14-day Pro trial and access your secure workspace.
				{:else}
					Access your isolated virtual environments and images.
				{/if}
			</p>
		</div>

		<!-- Auth Mode Switcher Tabs -->
		<div class="grid grid-cols-2 p-1 bg-muted rounded-xl border border-border mb-6 text-sm font-medium">
			<button
				type="button"
				onclick={() => (isSignUp = false)}
				class="py-2 rounded-lg transition-all text-center cursor-pointer { !isSignUp ? 'bg-card text-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:text-foreground' }"
			>
				Sign In
			</button>
			<button
				type="button"
				onclick={() => (isSignUp = true)}
				class="py-2 rounded-lg transition-all text-center cursor-pointer { isSignUp ? 'bg-card text-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:text-foreground' }"
			>
				Sign Up
			</button>
		</div>

		<!-- Auth Form -->
		<form onsubmit={handleSubmit} class="space-y-4">
			{#if errorMessage}
				<div class="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
					<AlertCircle class="w-4 h-4 shrink-0" />
					<span>{errorMessage}</span>
				</div>
			{/if}

			{#if isSignUp}
				<div>
					<label for="name" class="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
						Full Name
					</label>
					<input
						id="name"
						type="text"
						bind:value={name}
						placeholder="Jane Doe"
						class="w-full px-3.5 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-xs transition-all"
					/>
				</div>
			{/if}

			<div>
				<label for="email" class="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
					Email Address
				</label>
				<div class="relative">
					<div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
						<Mail class="w-4 h-4" />
					</div>
					<input
						id="email"
						type="email"
						bind:value={email}
						required
						placeholder="jane@company.com"
						class="w-full pl-10 pr-3.5 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-xs transition-all"
					/>
				</div>
			</div>

			<div>
				<div class="flex items-center justify-between mb-1.5">
					<label for="password" class="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
						Password
					</label>
					{#if !isSignUp}
						<a href="#forgot" class="text-xs text-primary hover:underline font-medium">
							Forgot password?
						</a>
					{/if}
				</div>
				<div class="relative">
					<div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
						<Lock class="w-4 h-4" />
					</div>
					<input
						id="password"
						type="password"
						bind:value={password}
						required
						placeholder="••••••••••••"
						class="w-full pl-10 pr-3.5 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-xs transition-all"
					/>
				</div>
			</div>

			<div class="pt-2">
				<button
					type="submit"
					disabled={loading}
					class="w-full h-10 rounded-lg text-xs font-semibold bg-primary hover:opacity-90 text-primary-foreground transition-opacity cursor-pointer inline-flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
				>
					<span>{loading ? 'Authenticating...' : isSignUp ? 'Create Account' : 'Sign In'}</span>
					<ArrowRight class="w-3.5 h-3.5" />
				</button>
			</div>
		</form>
	</div>
</main>
