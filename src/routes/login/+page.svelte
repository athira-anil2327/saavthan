<script lang="ts">
	import Navbar from "#lib/components/Navbar.svelte";
	import * as Card from "#lib/components/ui/card/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import { Button } from "#lib/components/ui/button/index.js";

	let email = $state("");
	let password = $state("");
</script>

<svelte:head>
	<title>Login — VAULT</title>
	<meta name="description" content="Sign in to your Vault instance." />
</svelte:head>

<div class="min-h-screen bg-[#FFFFFF] text-[#202124] flex flex-col font-sans antialiased selection:bg-[#fff0f0] selection:text-[#ff7675]">
	<!-- Public Navbar -->
	<Navbar currentPath="/login" />

	<main class="flex-1 flex items-center justify-center p-6 sm:p-12">
		<div class="w-full max-w-sm">
			<Card.Root class="bg-[#FFFFFF] border-[#E5E7EB] rounded-xl shadow-none p-6 sm:p-8">
				<div class="mb-6 text-center">
					<h1 class="text-2xl font-bold tracking-tight text-[#202124] mb-2">
						Sign In
					</h1>
					<p class="text-sm text-[#6B7280]">
						Enter your credentials to access your Vault.
					</p>
				</div>

				<form onsubmit={(e) => e.preventDefault()} class="space-y-4">
					<div class="space-y-1.5">
						<Label for="email" class="text-xs font-semibold text-[#202124]">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="admin@example.com"
							bind:value={email}
							required
							class="h-10 bg-white border-[#E5E7EB] focus-visible:ring-[#ff7675] text-sm"
						/>
					</div>

					<div class="space-y-1.5">
						<div class="flex items-center justify-between">
							<Label for="password" class="text-xs font-semibold text-[#202124]">Password</Label>
						</div>
						<Input
							id="password"
							type="password"
							placeholder="••••••••"
							bind:value={password}
							required
							class="h-10 bg-white border-[#E5E7EB] focus-visible:ring-[#ff7675] text-sm"
						/>
					</div>

					<div class="pt-2">
						<Button
							type="submit"
							class="w-full h-10 bg-[#ff7675] hover:bg-[#e66766] text-white font-medium rounded-lg text-sm transition-colors shadow-none cursor-pointer"
						>
							Sign In
						</Button>
					</div>
				</form>
			</Card.Root>
		</div>
	</main>
</div>
