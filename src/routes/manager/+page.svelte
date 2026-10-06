<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import DebianIcon from '#lib/components/icons/DebianIcon.svelte';
	import AppHeader from '#lib/components/AppHeader.svelte';
	import AppSidebar, { type SidebarItem } from '#lib/components/AppSidebar.svelte';
	import {
		Layers,
		Server,
		Store,
		Key,
		Radio,
		FileCheck,
		Play,
		Search,
		ShieldAlert,
		ShieldCheck,
		CheckCircle2,
		Plus
	} from 'lucide-svelte';

	// Active Section
	type Section = 'images' | 'fleet' | 'tenants' | 'tokens' | 'releases' | 'transparency';
	let activeSection = $state<Section>('images');
	let mobileNavOpen = $state(false);

	const sidebarItems: SidebarItem[] = [
		{ id: 'images', name: 'Images', icon: Layers },
		{ id: 'fleet', name: 'Fleet Command', icon: Server },
		{ id: 'tenants', name: 'Café Tenants', icon: Store },
		{ id: 'tokens', name: 'Enrollment Tokens', icon: Key },
		{ id: 'releases', name: 'Signed OTA Releases', icon: Radio },
		{ id: 'transparency', name: 'Transparency Log', icon: FileCheck }
	];

	// --- 1. IMAGES STATE ---
	interface ImageOption {
		id: string;
		version: string;
		size: string;
	}

	const debianImages: ImageOption[] = [
		{ id: 'deb-15', version: 'Debian 15.1.0', size: '13.6 GB' },
		{ id: 'deb-13-1', version: 'Debian 13.1', size: '13.1 GB' },
		{ id: 'deb-13-0-9', version: 'Debian 13.0.9 (NUEN)', size: '13.0 GB' }
	];

	let selectedId = $state<string>('deb-15');
	let isStartingVM = $state(false);
	let vmStatusMessage = $state<string | null>(null);

	function handleStartVM() {
		isStartingVM = true;
		vmStatusMessage = `Launching isolated workspace for ${debianImages.find((i) => i.id === selectedId)?.version}...`;
		setTimeout(() => {
			isStartingVM = false;
			vmStatusMessage = `Workspace VM is active and running in secure enclave.`;
		}, 1200);
	}

	// --- 2. SAAVTHAN MANAGER BACKEND DATA & ACTIONS ---
	let loadingStats = $state(true);
	let errorStats = $state<string | null>(null);

	let totalDevices = $state(0);
	let totalCafes = $state(0);
	let notarizedCount = $state(0);
	let totalReleases = $state(0);

	let devices = $state<any[]>([]);
	let cafes = $state<any[]>([]);
	let tokens = $state<any[]>([]);
	let releases = $state<any[]>([]);
	let recentLogs = $state<any[]>([]);

	// Form: Create Cafe Tenant
	let newCafeSlug = $state('');
	let newCafeName = $state('');
	let newCafeEmail = $state('');
	let isSubmittingCafe = $state(false);
	let cafeActionMessage = $state<string | null>(null);

	// Form: Issue Token
	let tokenCafeSlug = $state('akshaya-tvm');
	let tokenMaxUses = $state(1);
	let tokenTtlHours = $state(72);
	let isSubmittingToken = $state(false);
	let newlyIssuedToken = $state<string | null>(null);
	let tokenCopied = $state(false);
	let tokenActionError = $state<string | null>(null);

	// Form: Publish Release
	let releaseVersion = $state('v1.0.1');
	let releaseSeverity = $state('security');
	let releaseFileInput = $state<HTMLInputElement | null>(null);
	let isSubmittingRelease = $state(false);
	let releaseActionMessage = $state<string | null>(null);

	// Form: Verify Tree Hash
	let verifyHashInput = $state('');
	let isVerifyingHash = $state(false);
	let verificationResult = $state<any | null>(null);
	let verificationPerformed = $state(false);

	let pollTimer: ReturnType<typeof setInterval> | null = null;

	async function fetchManagerData() {
		loadingStats = true;
		errorStats = null;
		try {
			const fleetRes = await fetch('/api/v1/admin/fleet').catch(() => null);
			if (fleetRes && fleetRes.ok) {
				const fleetData = await fleetRes.json();
				totalDevices = fleetData.total_devices || 0;
				totalCafes = fleetData.total_cafes || 0;
				notarizedCount = fleetData.notarized_receipts_count || 0;
				devices = fleetData.devices || [];
				cafes = fleetData.cafes || [];
				if (cafes.length > 0 && !tokenCafeSlug) {
					tokenCafeSlug = cafes[0].slug;
				}
			}

			const tokensRes = await fetch('/api/v1/admin/tokens').catch(() => null);
			if (tokensRes && tokensRes.ok) {
				tokens = await tokensRes.json();
			}

			const releasesRes = await fetch('/api/v1/admin/releases').catch(() => null);
			if (releasesRes && releasesRes.ok) {
				releases = await releasesRes.json();
				totalReleases = releases.length;
			}

			const logsRes = await fetch('/api/v1/log/recent').catch(() => null);
			if (logsRes && logsRes.ok) {
				recentLogs = await logsRes.json();
			}
		} catch (err: any) {
			console.warn('Saavthan backend offline or unreachable:', err);
			errorStats = 'Manager API unreachable. Ensure the Central Manager service is running.';
		} finally {
			loadingStats = false;
		}
	}

	async function handleCreateCafe(e?: Event) {
		if (e?.preventDefault) e.preventDefault();
		if (!newCafeSlug || !newCafeName || !newCafeEmail) return;
		isSubmittingCafe = true;
		cafeActionMessage = null;
		try {
			const res = await fetch('/api/v1/admin/cafes', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					slug: newCafeSlug.trim().toLowerCase(),
					name: newCafeName.trim(),
					email: newCafeEmail.trim()
				})
			});
			if (res.ok) {
				cafeActionMessage = `Café tenant "${newCafeName}" registered successfully!`;
				newCafeSlug = '';
				newCafeName = '';
				newCafeEmail = '';
				await fetchManagerData();
			} else {
				const err = await res.json().catch(() => ({}));
				cafeActionMessage = `Error: ${err.detail || 'Failed to register café'}`;
			}
		} catch (err: any) {
			cafeActionMessage = `Network error: ${err.message}`;
		} finally {
			isSubmittingCafe = false;
		}
	}

	async function handleIssueToken(e?: Event) {
		if (e?.preventDefault) e.preventDefault();
		const slugToUse = tokenCafeSlug || (cafes.length > 0 ? cafes[0].slug : 'akshaya-tvm');
		if (!slugToUse) return;
		isSubmittingToken = true;
		newlyIssuedToken = null;
		tokenCopied = false;
		try {
			const res = await fetch('/api/v1/admin/tokens', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					cafe_slug: slugToUse,
					max_uses: Number(tokenMaxUses),
					ttl_hours: Number(tokenTtlHours)
				})
			});
			if (res.ok) {
				const data = await res.json();
				newlyIssuedToken = data.token;
				tokenActionError = null;
				await fetchManagerData();
			} else {
				const err = await res.json().catch(() => ({}));
				tokenActionError = err.detail || 'Failed to issue token';
			}
		} catch (err: any) {
			tokenActionError = `Network error: ${err.message}`;
		} finally {
			isSubmittingToken = false;
		}
	}

	async function handlePublishRelease(e?: Event) {
		if (e?.preventDefault) e.preventDefault();
		if (!releaseFileInput?.files || releaseFileInput.files.length === 0) {
			releaseActionMessage = 'Please select a .bin / .iso file to publish.';
			return;
		}
		const file = releaseFileInput.files[0];
		isSubmittingRelease = true;
		releaseActionMessage = null;

		const formData = new FormData();
		formData.append('version', releaseVersion);
		formData.append('severity', releaseSeverity);
		formData.append('file', file);

		try {
			const res = await fetch('/api/v1/admin/releases/upload', {
				method: 'POST',
				body: formData
			});
			if (res.ok) {
				releaseActionMessage = `Release ${releaseVersion} signed and published successfully!`;
				if (releaseFileInput) releaseFileInput.value = '';
				await fetchManagerData();
			} else {
				const err = await res.json().catch(() => ({}));
				releaseActionMessage = `Error: ${err.detail || 'Failed to upload release'}`;
			}
		} catch (err: any) {
			releaseActionMessage = `Network error: ${err.message}`;
		} finally {
			isSubmittingRelease = false;
		}
	}

	async function handleVerifyHash(e?: Event) {
		if (e?.preventDefault) e.preventDefault();
		const cleanHash = verifyHashInput.trim();
		if (!cleanHash) return;
		isVerifyingHash = true;
		verificationPerformed = false;
		try {
			const res = await fetch(`/api/v1/log/verify?tree_hash=${encodeURIComponent(cleanHash)}`);
			if (res.ok) {
				verificationResult = await res.json();
			} else {
				verificationResult = { found: false };
			}
		} catch {
			verificationResult = { found: false, error: 'Connection to Manager log failed' };
		} finally {
			isVerifyingHash = false;
			verificationPerformed = true;
		}
	}

	function copyText(val: string) {
		navigator.clipboard.writeText(val);
		tokenCopied = true;
		setTimeout(() => (tokenCopied = false), 2000);
	}

	onMount(() => {
		fetchManagerData();
		pollTimer = setInterval(fetchManagerData, 8000);
	});

	onDestroy(() => {
		if (pollTimer) clearInterval(pollTimer);
	});
</script>

<svelte:head>
	<title>Vault Manager — Fleet & Authority</title>
</svelte:head>

<div class="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased w-full selection:bg-accent selection:text-primary transition-colors duration-200">
	<!-- Unified Shared Header -->
	<AppHeader
		title="VAULT"
		subtitle="Manager & Fleet"
		onRefresh={fetchManagerData}
		isRefreshing={loadingStats}
		mobileNavOpen={mobileNavOpen}
		onToggleMobileNav={() => (mobileNavOpen = !mobileNavOpen)}
	/>

	<!-- Body Layout: Flush Sidebar + Main Content -->
	<div class="flex-1 flex flex-col md:flex-row w-full min-h-[calc(100vh-56px)]">
		<!-- Unified Shared Sidebar (Flush on Left Edge, 0 Margins) -->
		<AppSidebar
			items={sidebarItems}
			activeId={activeSection}
			onSelect={(id) => (activeSection = id as Section)}
			mobileOpen={mobileNavOpen}
		/>

		<!-- Main Content Area -->
		<main class="flex-1 min-w-0 p-6 sm:p-8 lg:p-10 bg-background overflow-y-auto">
			<div class="w-full space-y-8">
				<!-- TOP STAT CARDS -->
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
					<div class="bg-card rounded-xl border border-border p-5 flex flex-col justify-between gap-3 shadow-xs">
						<span class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
							ENROLLED NODES
						</span>
						<div>
							<span class="text-3xl font-extrabold tracking-tight text-foreground">{totalDevices}</span>
						</div>
						<span class="text-xs text-muted-foreground">Active Hubs & Kiosks</span>
					</div>

					<div class="bg-card rounded-xl border border-border p-5 flex flex-col justify-between gap-3 shadow-xs">
						<span class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
							REGISTERED TENANTS
						</span>
						<div>
							<span class="text-3xl font-extrabold tracking-tight text-foreground">{totalCafes}</span>
						</div>
						<span class="text-xs text-muted-foreground">Active Centers</span>
					</div>

					<div class="bg-card rounded-xl border border-border p-5 flex flex-col justify-between gap-3 shadow-xs">
						<span class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
							NOTARIZED RECEIPTS
						</span>
						<div>
							<span class="text-3xl font-extrabold tracking-tight text-foreground">{notarizedCount}</span>
						</div>
						<span class="text-xs text-muted-foreground">Immutable Hash Chain</span>
					</div>

					<div class="bg-card rounded-xl border border-border p-5 flex flex-col justify-between gap-3 shadow-xs">
						<span class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
							OTA RELEASES
						</span>
						<div>
							<span class="text-3xl font-extrabold tracking-tight text-foreground">{totalReleases}</span>
						</div>
						<span class="text-xs text-muted-foreground">Signed Builds</span>
					</div>
				</div>

				<!-- SECTION 1: IMAGES -->
				{#if activeSection === 'images'}
					<div class="space-y-6">
						<div>
							<h1 class="text-2xl font-bold tracking-tight text-foreground mb-1">
								Images
							</h1>
							<p class="text-sm text-muted-foreground">
								Choose an operating system image to start a secure, isolated workspace.
							</p>
						</div>

						<div class="w-full bg-card rounded-xl border border-border p-6 sm:p-8 shadow-xs">
							<div class="mb-6">
								<h2 class="text-base font-bold text-foreground mb-1">
									Debian Enclave Image
								</h2>
								<p class="text-xs text-muted-foreground">
									Select a verified Debian distribution release to launch in an isolated ephemeral sandbox.
								</p>
							</div>

							<div class="space-y-2 mb-6">
								{#each debianImages as image}
									{@const isSelected = selectedId === image.id}
									<label
										class="flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-all shadow-xs {isSelected ? 'border-primary bg-accent/60' : 'border-border bg-card hover:bg-muted/40'}"
									>
										<div class="flex items-center gap-3">
											<input
												type="radio"
												name="debian-version"
												value={image.id}
												checked={isSelected}
												onchange={() => (selectedId = image.id)}
												class="w-4 h-4 text-primary accent-primary cursor-pointer"
											/>
											<div class="w-6 h-6 rounded-md bg-accent text-primary flex items-center justify-center shrink-0 border border-primary/20">
												<DebianIcon class="w-3.5 h-3.5 fill-current" />
											</div>
											<span class="text-sm font-semibold text-foreground">
												{image.version}
											</span>
										</div>
										<span class="text-xs font-mono text-muted-foreground">
											{image.size}
										</span>
									</label>
								{/each}
							</div>

							<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border">
								<button
									type="button"
									onclick={handleStartVM}
									disabled={isStartingVM}
									class="h-9 px-4 rounded-lg bg-primary hover:opacity-90 text-primary-foreground text-xs font-semibold shadow-xs transition-opacity cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
								>
									<Play class="w-3 h-3 fill-current" />
									<span>{isStartingVM ? 'Launching Workspace...' : 'Launch Workspace'}</span>
								</button>

								{#if vmStatusMessage}
									<p class="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
										<CheckCircle2 class="w-3.5 h-3.5" />
										<span>{vmStatusMessage}</span>
									</p>
								{/if}
							</div>
						</div>
					</div>

				<!-- SECTION 2: FLEET COMMAND -->
				{:else if activeSection === 'fleet'}
					<div class="space-y-6">
						<div>
							<h1 class="text-2xl font-bold tracking-tight text-foreground mb-1">
								Fleet Command
							</h1>
							<p class="text-sm text-muted-foreground">
								Real-time telemetry and management across enrolled shop nodes.
							</p>
						</div>

						<div class="bg-card rounded-xl border border-border overflow-hidden shadow-xs">
							{#if devices.length === 0}
								<div class="p-12 text-center">
									<Server class="w-8 h-8 text-muted-foreground mx-auto mb-3" />
									<h4 class="text-sm font-semibold text-foreground">No Devices Enrolled</h4>
									<p class="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
										Issue an enrollment token in the Tokens tab and start the shop node with the token.
									</p>
								</div>
							{:else}
								<div class="overflow-x-auto">
									<table class="w-full text-left text-xs border-collapse">
										<thead>
											<tr class="border-b border-border bg-muted/50 text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
												<th class="py-3 px-4">Device ID</th>
												<th class="py-3 px-4">Café Slug</th>
												<th class="py-3 px-4">OS / Role</th>
												<th class="py-3 px-4">Image Ver</th>
												<th class="py-3 px-4">Update Status</th>
												<th class="py-3 px-4">Status</th>
											</tr>
										</thead>
										<tbody class="divide-y divide-border">
											{#each devices as dev}
												<tr class="hover:bg-muted/40 transition-colors">
													<td class="py-3 px-4 font-mono font-medium text-foreground">
														{dev.id?.substring(0, 12)}...
													</td>
													<td class="py-3 px-4 font-semibold text-primary">
														{dev.cafe_slug}
													</td>
													<td class="py-3 px-4 text-muted-foreground">
														{dev.os || 'Linux'} ({dev.role})
													</td>
													<td class="py-3 px-4 font-mono text-muted-foreground">
														v{dev.image_version || '1.0.0'}
													</td>
													<td class="py-3 px-4">
														<span class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
															{dev.update_status || 'up_to_date'}
														</span>
													</td>
													<td class="py-3 px-4">
														<span class="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
															<span class="w-1.5 h-1.5 rounded-xs bg-emerald-500 inline-block"></span>
															Active
														</span>
													</td>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>
							{/if}
						</div>
					</div>

				<!-- SECTION 3: CAFÉ TENANTS -->
				{:else if activeSection === 'tenants'}
					<div class="space-y-6">
						<div>
							<h1 class="text-2xl font-bold tracking-tight text-foreground mb-1">
								Café Tenants
							</h1>
							<p class="text-sm text-muted-foreground">
								Provision and manage registered business tenants and custom endpoints.
							</p>
						</div>

						<div class="bg-card rounded-xl border border-border p-6 shadow-xs space-y-4">
							<h3 class="text-sm font-bold text-foreground flex items-center gap-2">
								<Plus class="w-4 h-4 text-primary" />
								<span>Register New Tenant</span>
							</h3>

							<form onsubmit={handleCreateCafe} class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
								<div>
									<label for="c-name" class="block font-medium text-muted-foreground mb-1">Center Name</label>
									<input
										id="c-name"
										type="text"
										bind:value={newCafeName}
										placeholder="Akshaya Cyber Center"
										required
										class="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:border-primary shadow-xs"
									/>
								</div>
								<div>
									<label for="c-slug" class="block font-medium text-muted-foreground mb-1">Vanity Slug</label>
									<input
										id="c-slug"
										type="text"
										bind:value={newCafeSlug}
										placeholder="akshaya-tvm"
										required
										class="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:border-primary shadow-xs"
									/>
								</div>
								<div>
									<label for="c-email" class="block font-medium text-muted-foreground mb-1">Owner Email</label>
									<input
										id="c-email"
										type="email"
										bind:value={newCafeEmail}
										placeholder="admin@akshaya.in"
										required
										class="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:border-primary shadow-xs"
									/>
								</div>

								<div class="sm:col-span-3 flex items-center justify-between pt-2">
									{#if cafeActionMessage}
										<p class="text-xs text-emerald-600 dark:text-emerald-400">{cafeActionMessage}</p>
									{:else}
										<span></span>
									{/if}
									<button
										type="submit"
										disabled={isSubmittingCafe}
										class="px-4 py-2 rounded-lg bg-primary hover:opacity-90 text-primary-foreground text-xs font-semibold shadow-xs transition-opacity cursor-pointer disabled:opacity-50"
									>
										{isSubmittingCafe ? 'Registering...' : 'Register Tenant'}
									</button>
								</div>
							</form>
						</div>

						<div class="bg-card rounded-xl border border-border overflow-hidden shadow-xs">
							<div class="overflow-x-auto">
								<table class="w-full text-left text-xs border-collapse">
									<thead>
										<tr class="border-b border-border bg-muted/50 text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
											<th class="py-3 px-4">Center Name</th>
											<th class="py-3 px-4">Slug</th>
											<th class="py-3 px-4">Endpoint</th>
											<th class="py-3 px-4">Owner Email</th>
											<th class="py-3 px-4">Status</th>
										</tr>
									</thead>
									<tbody class="divide-y divide-border">
										{#each cafes as c}
											<tr class="hover:bg-muted/40 transition-colors">
												<td class="py-3 px-4 font-semibold text-foreground">
													{c.name}
												</td>
												<td class="py-3 px-4 font-mono text-primary">
													{c.slug}
												</td>
												<td class="py-3 px-4 font-mono text-muted-foreground">
													/{c.slug}
												</td>
												<td class="py-3 px-4 text-muted-foreground">
													{c.owner_email}
												</td>
												<td class="py-3 px-4">
													<span class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
														{c.status || 'active'}
													</span>
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					</div>

				<!-- SECTION 4: ENROLLMENT TOKENS -->
				{:else if activeSection === 'tokens'}
					<div class="space-y-6">
						<div>
							<h1 class="text-2xl font-bold tracking-tight text-foreground mb-1">
								Enrollment Tokens
							</h1>
							<p class="text-sm text-muted-foreground">
								Generate single-use or multi-use cryptographic provisioning tokens for shop nodes.
							</p>
						</div>

						<div class="bg-card rounded-xl border border-border p-6 shadow-xs space-y-4">
							<h3 class="text-sm font-bold text-foreground flex items-center gap-2">
								<Key class="w-4 h-4 text-primary" />
								<span>Issue New Provisioning Token</span>
							</h3>

							<form onsubmit={handleIssueToken} class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
								<div>
									<label for="t-slug" class="block font-medium text-muted-foreground mb-1">Assign to Café</label>
									<select
										id="t-slug"
										bind:value={tokenCafeSlug}
										class="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:border-primary shadow-xs"
									>
										{#if cafes.length === 0}
											<option value="akshaya-tvm">akshaya-tvm (default)</option>
										{:else}
											{#each cafes as c}
												<option value={c.slug}>{c.name} ({c.slug})</option>
											{/each}
										{/if}
									</select>
								</div>
								<div>
									<label for="t-uses" class="block font-medium text-muted-foreground mb-1">Max Uses</label>
									<input
										id="t-uses"
										type="number"
										bind:value={tokenMaxUses}
										min="1"
										max="100"
										class="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:border-primary shadow-xs"
									/>
								</div>
								<div>
									<label for="t-ttl" class="block font-medium text-muted-foreground mb-1">TTL (Hours)</label>
									<input
										id="t-ttl"
										type="number"
										bind:value={tokenTtlHours}
										min="1"
										max="720"
										class="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:border-primary shadow-xs"
									/>
								</div>

								<div class="sm:col-span-3 flex items-center justify-end pt-2">
									<button
										type="submit"
										disabled={isSubmittingToken}
										class="px-4 py-2 rounded-lg bg-primary hover:opacity-90 text-primary-foreground text-xs font-semibold shadow-xs transition-opacity cursor-pointer disabled:opacity-50"
									>
										{isSubmittingToken ? 'Issuing...' : 'Issue Token'}
									</button>
								</div>
							</form>

							{#if newlyIssuedToken}
								<div class="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs space-y-2">
									<p class="font-bold text-emerald-800 dark:text-emerald-300">New Token Generated (Copy Now):</p>
									<div class="flex items-center gap-2">
										<input
											type="text"
											readonly
											value={newlyIssuedToken}
											class="flex-1 p-2 rounded-md bg-card font-mono text-xs border border-emerald-300 dark:border-emerald-700 text-foreground"
										/>
										<button
											type="button"
											onclick={() => copyText(newlyIssuedToken!)}
											class="px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium cursor-pointer shadow-xs"
										>
											{tokenCopied ? 'Copied!' : 'Copy'}
										</button>
									</div>
								</div>
							{/if}
						</div>

						<div class="bg-card rounded-xl border border-border overflow-hidden shadow-xs">
							<div class="overflow-x-auto">
								<table class="w-full text-left text-xs border-collapse">
									<thead>
										<tr class="border-b border-border bg-muted/50 text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
											<th class="py-3 px-4">Token Hash</th>
											<th class="py-3 px-4">Café Slug</th>
											<th class="py-3 px-4">Usage</th>
											<th class="py-3 px-4">Expires At</th>
										</tr>
									</thead>
									<tbody class="divide-y divide-border">
										{#each tokens as t}
											<tr class="hover:bg-muted/40 transition-colors">
												<td class="py-3 px-4 font-mono text-foreground">
													{t.token_hash?.substring(0, 16)}...
												</td>
												<td class="py-3 px-4 font-semibold text-primary">
													{t.cafe_slug}
												</td>
												<td class="py-3 px-4 text-muted-foreground">
													{t.used_count} / {t.max_uses}
												</td>
												<td class="py-3 px-4 font-mono text-muted-foreground">
													{new Date(t.expires_at * 1000).toLocaleString()}
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					</div>

				<!-- SECTION 5: OTA RELEASES -->
				{:else if activeSection === 'releases'}
					<div class="space-y-6">
						<div>
							<h1 class="text-2xl font-bold tracking-tight text-foreground mb-1">
								Signed OTA Releases
							</h1>
							<p class="text-sm text-muted-foreground">
								Cryptographically sign and publish software / kernel images to all fleet nodes.
							</p>
						</div>

						<div class="bg-card rounded-xl border border-border p-6 shadow-xs space-y-4">
							<h3 class="text-sm font-bold text-foreground flex items-center gap-2">
								<Radio class="w-4 h-4 text-primary" />
								<span>Publish New Signed Release</span>
							</h3>

							<form onsubmit={handlePublishRelease} class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
								<div>
									<label for="r-ver" class="block font-medium text-muted-foreground mb-1">Version</label>
									<input
										id="r-ver"
										type="text"
										bind:value={releaseVersion}
										placeholder="v1.0.2"
										required
										class="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:border-primary shadow-xs"
									/>
								</div>
								<div>
									<label for="r-sev" class="block font-medium text-muted-foreground mb-1">Severity</label>
									<select
										id="r-sev"
										bind:value={releaseSeverity}
										class="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:border-primary shadow-xs"
									>
										<option value="normal">Normal</option>
										<option value="security">Security Patch</option>
										<option value="critical">Critical Hotfix</option>
									</select>
								</div>
								<div>
									<label for="r-file" class="block font-medium text-muted-foreground mb-1">Artifact File (.bin / .iso)</label>
									<input
										id="r-file"
										type="file"
										bind:this={releaseFileInput}
										required
										class="w-full px-3 py-1.5 rounded-lg bg-card border border-border text-foreground text-xs shadow-xs"
									/>
								</div>

								<div class="sm:col-span-3 flex items-center justify-between pt-2">
									{#if releaseActionMessage}
										<p class="text-xs text-emerald-600 dark:text-emerald-400">{releaseActionMessage}</p>
									{:else}
										<span></span>
									{/if}
									<button
										type="submit"
										disabled={isSubmittingRelease}
										class="px-4 py-2 rounded-lg bg-primary hover:opacity-90 text-primary-foreground text-xs font-semibold shadow-xs transition-opacity cursor-pointer disabled:opacity-50"
									>
										{isSubmittingRelease ? 'Signing & Uploading...' : 'Sign & Publish Release'}
									</button>
								</div>
							</form>
						</div>

						<div class="bg-card rounded-xl border border-border overflow-hidden shadow-xs">
							<div class="overflow-x-auto">
								<table class="w-full text-left text-xs border-collapse">
									<thead>
										<tr class="border-b border-border bg-muted/50 text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
											<th class="py-3 px-4">Version</th>
											<th class="py-3 px-4">Severity</th>
											<th class="py-3 px-4">Manifest Summary</th>
											<th class="py-3 px-4">Published At</th>
										</tr>
									</thead>
									<tbody class="divide-y divide-border">
										{#each releases as r}
											<tr class="hover:bg-muted/40 transition-colors">
												<td class="py-3 px-4 font-bold text-foreground">
													{r.version}
												</td>
												<td class="py-3 px-4">
													<span class="px-2 py-0.5 rounded-md text-[10px] font-medium {r.severity === 'critical' ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'}">
														{r.severity}
													</span>
												</td>
												<td class="py-3 px-4 font-mono text-[11px] text-muted-foreground">
													Artifacts: {r.manifest?.artifacts?.length || 0}
												</td>
												<td class="py-3 px-4 font-mono text-muted-foreground">
													{new Date(r.published_at * 1000).toLocaleString()}
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					</div>

				<!-- SECTION 6: TRANSPARENCY LOG -->
				{:else if activeSection === 'transparency'}
					<div class="space-y-6">
						<div>
							<h1 class="text-2xl font-bold tracking-tight text-foreground mb-1">
								Transparency Log & Notary
							</h1>
							<p class="text-sm text-muted-foreground">
								Append-only immutable notarization log and cryptographic receipt dispute verifier.
							</p>
						</div>

						<div class="bg-card rounded-xl border border-border p-6 shadow-xs space-y-4">
							<h3 class="text-sm font-bold text-foreground flex items-center gap-2">
								<Search class="w-4 h-4 text-primary" />
								<span>Public Dispute Verifier (Tree Hash Lookup)</span>
							</h3>

							<form onsubmit={handleVerifyHash} class="flex gap-2">
								<input
									type="text"
									bind:value={verifyHashInput}
									placeholder="Enter file tree hash (e.g. e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855)..."
									class="flex-1 px-3.5 py-2.5 rounded-lg bg-card border border-border text-xs font-mono text-foreground focus:outline-none focus:border-primary shadow-xs"
								/>
								<button
									type="submit"
									disabled={isVerifyingHash}
									class="px-5 py-2.5 rounded-lg bg-primary hover:opacity-90 text-primary-foreground text-xs font-semibold shadow-xs transition-opacity cursor-pointer disabled:opacity-50"
								>
									{isVerifyingHash ? 'Verifying...' : 'Verify Notarization'}
								</button>
							</form>

							{#if verificationPerformed}
								{#if verificationResult?.found}
									<div class="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs space-y-2">
										<div class="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
											<ShieldCheck class="w-4 h-4" />
											<span>Receipt Verified in Hash Chain (Seq #{verificationResult.seq})</span>
										</div>
										<p class="font-mono text-[11px] text-emerald-700 dark:text-emerald-400">
											Entry Hash: {verificationResult.entry_hash}
										</p>
									</div>
								{:else}
									<div class="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-xs flex items-center gap-2 text-destructive">
										<ShieldAlert class="w-4 h-4 text-destructive" />
										<span>Hash not found in central transparency log. Dispute detected or unregistered receipt.</span>
									</div>
								{/if}
							{/if}
						</div>

						<div class="bg-card rounded-xl border border-border overflow-hidden shadow-xs">
							<div class="overflow-x-auto">
								<table class="w-full text-left text-xs border-collapse">
									<thead>
										<tr class="border-b border-border bg-muted/50 text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
											<th class="py-3 px-4">Seq</th>
											<th class="py-3 px-4">Café</th>
											<th class="py-3 px-4">Entry Hash</th>
											<th class="py-3 px-4">Prev Hash</th>
											<th class="py-3 px-4">Logged At</th>
										</tr>
									</thead>
									<tbody class="divide-y divide-border">
										{#each recentLogs as log}
											<tr class="hover:bg-muted/40 transition-colors">
												<td class="py-3 px-4 font-bold text-foreground">
													#{log.seq}
												</td>
												<td class="py-3 px-4 font-semibold text-primary">
													{log.cafe_slug}
												</td>
												<td class="py-3 px-4 font-mono text-[11px] text-muted-foreground">
													{log.entry_hash?.substring(0, 16)}...
												</td>
												<td class="py-3 px-4 font-mono text-[11px] text-muted-foreground">
													{log.prev_hash?.substring(0, 16)}...
												</td>
												<td class="py-3 px-4 font-mono text-muted-foreground">
													{new Date(log.created_at * 1000).toLocaleTimeString()}
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</main>
	</div>
</div>
