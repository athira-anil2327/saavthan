<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		Folder,
		Share2,
		Clock,
		Settings,
		QrCode,
		MessageSquare,
		Mail,
		Bluetooth,
		HardDrive,
		Download,
		Copy,
		Check,
		Trash2,
		ExternalLink,
		FileText,
		FileImage,
		FileArchive,
		FileCode,
		FileSpreadsheet,
		FileQuestion,
		ShieldCheck,
		AlertTriangle,
		RefreshCw,
		UploadCloud,
		CheckCircle2,
		X
	} from 'lucide-svelte';
	import {
		startSession,
		endSession,
		createDrop,
		listDrops,
		listUploads,
		deliverUpload,
		uploadFileToDrop,
		fetchSystemStatus,
		type SessionInfo,
		type DropInfo,
		type UploadRecord,
		type SystemStatus
	} from '#lib/saavthan-api';
	import { generateQRCodeSVG } from '#lib/qr';
	import AppSidebar, { type SidebarItem } from '#lib/components/AppSidebar.svelte';

	// Sidebar Navigation
	type NavItem = 'files' | 'shared' | 'activity' | 'settings';
	let activeNav = $state<NavItem>('files');
	let mobileNavOpen = $state(false);

	const sidebarItems: SidebarItem[] = [
		{ id: 'files', name: 'Files', icon: Folder },
		{ id: 'shared', name: 'Shared Items', icon: Share2 },
		{ id: 'activity', name: 'Recent Activity', icon: Clock },
		{ id: 'settings', name: 'Settings', icon: Settings }
	];

	// Session State
	let currentSession = $state<SessionInfo | null>(null);
	let currentDrop = $state<DropInfo | null>(null);
	let systemStatus = $state<SystemStatus | null>(null);
	let uploads = $state<UploadRecord[]>([]);

	// UI State
	let isLoading = $state(true);
	let isRefreshing = $state(false);
	let isUploadingUSB = $state(false);
	let uploadProgress = $state<number | null>(null);
	let copiedField = $state<string | null>(null);
	let showExitConfirmModal = $state(false);
	let isWiping = $state(false);
	let wipeSuccessMessage = $state<string | null>(null);
	let selectedReceipt = $state<UploadRecord | null>(null);

	let pollInterval: ReturnType<typeof setInterval> | null = null;
	let fileInputRef: HTMLInputElement | null = null;

	async function initWorkspace() {
		isLoading = true;
		try {
			// 1. Fetch system status
			const sys = await fetchSystemStatus();
			if (sys) {
				systemStatus = sys;
			}

			// 2. Initialize ephemeral kiosk session
			const session = await startSession();
			if (session) {
				currentSession = session;
			}

			// 3. Create or fetch active drop portal
			const drops = await listDrops();
			if (drops.length > 0) {
				currentDrop = drops[0];
			} else {
				const drop = await createDrop('Secure Workspace Drop');
				if (drop) {
					currentDrop = drop;
				}
			}

			// 4. Initial files fetch
			await refreshFiles();
		} catch (err) {
			console.error('Failed to initialize secure workspace:', err);
		} finally {
			isLoading = false;
		}
	}

	async function refreshFiles() {
		isRefreshing = true;
		try {
			const freshUploads = await listUploads();
			uploads = freshUploads;
		} catch (err) {
			console.warn('Error polling uploads:', err);
		} finally {
			isRefreshing = false;
		}
	}

	let isMounted = $state(false);

	let dropPortalUrl = $derived.by(() => {
		if (isMounted && typeof window !== 'undefined') {
			const host = window.location.host;
			const protocol = window.location.protocol;
			if (currentDrop?.drop_code) {
				return `${protocol}//${host}/upload?code=${currentDrop.drop_code}`;
			}
			return `${protocol}//${host}/upload`;
		}
		if (currentDrop?.drop_code) {
			return `https://vault.local/upload?code=${currentDrop.drop_code}`;
		}
		return 'https://vault.local/upload';
	});

	function downloadQRCode() {
		const svgContent = generateQRCodeSVG(dropPortalUrl, 300);
		const blob = new Blob([svgContent], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `vault-drop-qr-${currentDrop?.drop_code || 'session'}.svg`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	async function copyToClipboard(text: string, fieldId: string) {
		try {
			await navigator.clipboard.writeText(text);
			copiedField = fieldId;
			setTimeout(() => {
				if (copiedField === fieldId) copiedField = null;
			}, 2000);
		} catch (e) {
			console.error('Failed to copy to clipboard', e);
		}
	}

	async function handleBrowseUSB() {
		if (fileInputRef) {
			fileInputRef.click();
		}
	}

	async function handleFileSelected(e: Event) {
		const target = e.target as HTMLInputElement;
		if (!target.files || target.files.length === 0) return;

		const filesToUpload = Array.from(target.files);
		isUploadingUSB = true;

		try {
			let targetDrop = currentDrop;
			if (!targetDrop) {
				targetDrop = await createDrop('Secure Workspace Drop');
				if (targetDrop) currentDrop = targetDrop;
			}

			if (!targetDrop) {
				alert('Could not establish secure drop channel. Please check backend connection.');
				return;
			}

			for (const file of filesToUpload) {
				uploadProgress = 10;
				const uploaded = await uploadFileToDrop(
					targetDrop.drop_code,
					file,
					(pct: number) => {
						uploadProgress = pct;
					}
				);

				if (uploaded && currentSession?.session_id) {
					await deliverUpload(currentSession.session_id, uploaded.upload_id);
				}
			}

			await refreshFiles();
		} catch (err: any) {
			console.error('USB Upload error:', err);
			alert(`Upload error: ${err.message || 'Failed to encrypt and store file'}`);
		} finally {
			isUploadingUSB = false;
			uploadProgress = null;
			if (fileInputRef) fileInputRef.value = '';
		}
	}

	async function handleExitSession() {
		isWiping = true;
		try {
			if (currentSession) {
				await endSession(currentSession.session_id);
				showExitConfirmModal = false;
				wipeSuccessMessage = `Session wiped successfully. Ephemeral memory crypto-shredded at ${new Date().toLocaleTimeString()}.`;
				currentSession = null;
				currentDrop = null;
				uploads = [];

				setTimeout(() => {
					initWorkspace();
				}, 2000);
			} else {
				showExitConfirmModal = false;
			}
		} catch (err: any) {
			alert(`Failed to perform verified wipe: ${err.message}`);
		} finally {
			isWiping = false;
		}
	}

	onMount(() => {
		isMounted = true;
		initWorkspace();
		pollInterval = setInterval(refreshFiles, 4000);
	});

	onDestroy(() => {
		if (pollInterval) clearInterval(pollInterval);
	});

	function formatFileSize(bytes: number): string {
		if (!bytes || bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
	}

	function formatTimeAgo(val: string | number): string {
		if (!val) return 'just now';
		const d = typeof val === 'number' ? new Date(val * 1000) : new Date(val);
		const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
		if (diffSec < 60) return `${Math.max(1, diffSec)}s ago`;
		const diffMin = Math.floor(diffSec / 60);
		if (diffMin < 60) return `${diffMin}m ago`;
		return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	function getFileTypeInfo(name: string) {
		const ext = name.split('.').pop()?.toLowerCase() || '';
		if (['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext)) {
			return { icon: FileImage, label: 'Image' };
		}
		if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext)) {
			return { icon: FileText, label: 'Document' };
		}
		if (['zip', 'tar', 'gz', '7z', 'rar'].includes(ext)) {
			return { icon: FileArchive, label: 'Archive' };
		}
		if (['xls', 'xlsx', 'csv'].includes(ext)) {
			return { icon: FileSpreadsheet, label: 'Spreadsheet' };
		}
		if (['js', 'ts', 'py', 'json', 'html', 'css', 'sh'].includes(ext)) {
			return { icon: FileCode, label: 'Code' };
		}
		return { icon: FileQuestion, label: 'File' };
	}

	function getSourceBadge(u: UploadRecord) {
		const src = (u.source || '').toLowerCase();
		const name = (u.display_name || '').toLowerCase();

		if (src === 'whatsapp' || name.includes('whatsapp')) {
			return {
				label: 'WhatsApp',
				icon: MessageSquare
			};
		}
		if (src === 'email' || name.includes('email')) {
			return {
				label: 'Email',
				icon: Mail
			};
		}
		if (src === 'bluetooth' || name.includes('bluetooth')) {
			return {
				label: 'Bluetooth',
				icon: Bluetooth
			};
		}
		if (src === 'usb' || name.includes('usb')) {
			return {
				label: 'USB',
				icon: HardDrive
			};
		}
		return {
			label: 'QR Code',
			icon: QrCode
		};
	}
</script>

<svelte:head>
	<title>Vault — Consumer Workspace</title>
</svelte:head>

<!-- Hidden USB file input -->
<!-- Hidden USB file input -->
<input
	type="file"
	multiple
	bind:this={fileInputRef}
	onchange={handleFileSelected}
	class="hidden"
/>

<!-- Left Sidebar Navigation -->
<AppSidebar
	items={sidebarItems}
	activeId={activeNav}
	onSelect={(id) => (activeNav = id as NavItem)}
	mobileOpen={mobileNavOpen}
	onExit={() => (showExitConfirmModal = true)}
/>

<!-- Main Workspace Area -->
<main class="flex-1 px-4 py-5 sm:p-8 lg:px-10 lg:py-8 min-w-0 bg-background overflow-y-auto w-full">
	<div class="w-full max-w-[1320px] space-y-5 sm:space-y-6">
	{#if wipeSuccessMessage}
				<div class="mb-4 sm:mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-3 shadow-xs">
					<CheckCircle2 class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
					<span>{wipeSuccessMessage}</span>
				</div>
			{/if}

			{#if activeNav === 'files'}
				<!-- 1. Vault Active Status Banner (Calm Reassurance Status) -->
				<section class="vault-banner mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl border border-border bg-card shadow-xs transition-colors">
					<div class="flex items-start justify-between gap-4">
						<div class="space-y-1">
							<div class="flex items-center gap-2.5">
								<span class="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block"></span>
								<h2 class="text-lg sm:text-xl font-bold tracking-tight text-foreground">
									VAULT is Active
								</h2>
							</div>
							<p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
								Your secure workspace is ready. Add files through any of the available methods below.
							</p>
						</div>

						<div class="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-lg border border-border shadow-xs shrink-0">
							<ShieldCheck class="w-4 h-4 text-primary" />
							<span>AES-256-GCM Encrypted</span>
						</div>
					</div>
				</section>

				<!-- 2. Add Files Section: Big Rectangular Ingestion Box -->
				<section class="vault-ingest-card mb-6 sm:mb-10">
					<div class="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xs">
						<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
							<!-- Left Column: Option 1 - Join via Link -->
							<div class="lg:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-6">
								<div>
									<div class="flex items-center gap-2 text-primary mb-1.5 sm:mb-2">
										<UploadCloud class="w-4 h-4 sm:w-5 sm:h-5" />
										<span class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Add Files to Workspace</span>
									</div>
									<h3 class="text-xl sm:text-3xl font-bold tracking-tight text-foreground">
										Upload from Any Device
									</h3>
									<p class="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1.5 sm:mt-2">
										Add documents and images to this secure session using the direct link or by scanning the QR code from your mobile device.
									</p>
								</div>

								<!-- Option 1: Direct Ingestion Link -->
								<div class="space-y-2 pt-1 sm:pt-2">
									<span class="text-xs font-semibold text-foreground uppercase tracking-wider block">
										Option 1: Join via Link
									</span>
									<div class="flex items-center gap-2 px-3 sm:px-4 h-11 sm:h-12 rounded-lg bg-muted border border-border text-xs sm:text-sm md:text-base font-mono font-medium text-foreground select-all shadow-inner">
										<span class="text-primary font-bold shrink-0">https://</span>
										<span class="truncate">ladduvault/centrallib/vault</span>
									</div>
								</div>
							</div>

							<!-- Right Column: Option 2 - QR Code Scanner -->
							<div class="lg:col-span-5 flex flex-col items-center justify-center p-4 sm:p-8 rounded-xl bg-muted/30 border border-border text-center">
								<div class="flex items-center gap-2 text-foreground font-semibold text-xs uppercase tracking-wider mb-3 sm:mb-4">
									<QrCode class="w-4 h-4 text-primary" />
									<span>Option 2: Scan QR Code</span>
								</div>

								<div class="w-40 h-40 sm:w-48 sm:h-48 p-2.5 bg-white rounded-xl border border-border flex items-center justify-center shadow-sm">
									{@html generateQRCodeSVG(dropPortalUrl, 150)}
								</div>

								<p class="text-xs text-muted-foreground mt-3 sm:mt-4 leading-relaxed max-w-[220px]">
									Point your smartphone camera at this code to upload instantly.
								</p>
							</div>
						</div>
					</div>
				</section>

				<!-- 3. Files Table -->
				<section class="vault-files-section space-y-3 sm:space-y-4">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="text-base sm:text-lg font-semibold tracking-tight text-foreground">
								Files in This Session
							</h3>
							<p class="text-xs text-muted-foreground">
								{uploads.length} {uploads.length === 1 ? 'file' : 'files'} securely staged and verified in current workspace
							</p>
						</div>
					</div>

					<div class="bg-card rounded-xl border border-border overflow-hidden shadow-xs">
						{#if uploads.length === 0}
							<div class="py-12 sm:py-16 px-4 text-center">
								<div class="w-10 h-10 rounded-lg bg-accent text-primary flex items-center justify-center mx-auto mb-3 border border-primary/20 shadow-xs">
									<Folder class="w-5 h-5" />
								</div>
								<h4 class="text-sm font-semibold text-foreground mb-1">
									No files added yet
								</h4>
								<p class="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed mb-4">
									Use any of the methods above (QR code, WhatsApp, Email, Bluetooth, or USB) to add files to this secure session.
								</p>
								<button
									type="button"
									onclick={handleBrowseUSB}
									class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-primary-foreground bg-primary hover:opacity-90 shadow-xs transition-all cursor-pointer"
								>
									<UploadCloud class="w-3.5 h-3.5" />
									<span>Upload / Browse Files</span>
								</button>
							</div>
						{:else}
							<!-- Desktop Table -->
							<div class="hidden md:block overflow-x-auto">
								<table class="w-full text-left text-xs border-collapse">
									<thead>
										<tr class="border-b border-border bg-muted/50 text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
											<th class="py-3 px-4">Name</th>
											<th class="py-3 px-4">Type</th>
											<th class="py-3 px-4">Source</th>
											<th class="py-3 px-4">Size</th>
											<th class="py-3 px-4">Added At</th>
											<th class="py-3 px-4 text-right">Actions</th>
										</tr>
									</thead>
									<tbody class="divide-y divide-border">
										{#each uploads as file}
											{@const typeInfo = getFileTypeInfo(file.display_name)}
											{@const sourceBadge = getSourceBadge(file)}
											<tr class="hover:bg-muted/40 transition-colors">
												<td class="py-3 px-4 font-medium text-foreground">
													<div class="flex items-center gap-2.5">
														<div class="w-7 h-7 rounded-md bg-accent text-primary flex items-center justify-center shrink-0 border border-primary/20">
															<typeInfo.icon class="w-3.5 h-3.5" />
														</div>
														<div class="min-w-0">
															<p class="truncate font-medium max-w-[180px] sm:max-w-xs">{file.display_name}</p>
															{#if file.tree_hash}
																<p class="text-[10px] text-muted-foreground font-mono truncate max-w-[160px]">
																	hash: {file.tree_hash.substring(0, 10)}...
																</p>
															{/if}
														</div>
													</div>
												</td>

												<td class="py-3 px-4 text-muted-foreground">
													{typeInfo.label}
												</td>

												<td class="py-3 px-4">
													<span class="inline-flex items-center gap-1.5 text-xs text-foreground font-medium">
														<sourceBadge.icon class="w-3.5 h-3.5 text-muted-foreground" />
														<span>{sourceBadge.label}</span>
													</span>
												</td>

												<td class="py-3 px-4 font-mono text-muted-foreground">
													{formatFileSize(file.declared_size)}
												</td>

												<td class="py-3 px-4 text-muted-foreground">
													{formatTimeAgo(file.created_at)}
												</td>

												<td class="py-3 px-4 text-right">
													<div class="flex items-center justify-end gap-1.5">
														{#if file.receipt}
															<button
																type="button"
																onclick={() => (selectedReceipt = file)}
																class="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-accent transition-colors cursor-pointer"
																title="View cryptographic receipt"
															>
																<ShieldCheck class="w-4 h-4" />
															</button>
														{/if}

														<a
															href={`/p/${file.drop_code}/uploads/${file.id}/receipt`}
															target="_blank"
															class="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
															title="Receipt metadata"
														>
															<ExternalLink class="w-4 h-4" />
														</a>
													</div>
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>

							<!-- Mobile Stacked Card View -->
							<div class="block md:hidden divide-y divide-border">
								{#each uploads as file}
									{@const typeInfo = getFileTypeInfo(file.display_name)}
									{@const sourceBadge = getSourceBadge(file)}
									<div class="p-3.5 space-y-2 text-xs">
										<div class="flex items-center justify-between gap-2">
											<div class="flex items-center gap-2 min-w-0">
												<div class="w-7 h-7 rounded-md bg-accent text-primary flex items-center justify-center shrink-0 border border-primary/20">
													<typeInfo.icon class="w-3.5 h-3.5" />
												</div>
												<div class="min-w-0">
													<p class="font-semibold text-foreground truncate">{file.display_name}</p>
													<p class="text-[10px] text-muted-foreground">{typeInfo.label} • {formatFileSize(file.declared_size)}</p>
												</div>
											</div>
											<span class="inline-flex items-center gap-1 text-[11px] text-muted-foreground shrink-0 bg-muted px-2 py-0.5 rounded border border-border">
												<sourceBadge.icon class="w-3 h-3 text-muted-foreground" />
												<span>{sourceBadge.label}</span>
											</span>
										</div>

										{#if file.tree_hash}
											<div class="text-[10px] font-mono text-muted-foreground truncate bg-muted/50 p-1 rounded">
												hash: {file.tree_hash}
											</div>
										{/if}

										<div class="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
											<span>Added {formatTimeAgo(file.created_at)}</span>
											<div class="flex items-center gap-2">
												{#if file.receipt}
													<button
														type="button"
														onclick={() => (selectedReceipt = file)}
														class="px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
													>
														Receipt
													</button>
												{/if}
												<a
													href={`/p/${file.drop_code}/uploads/${file.id}/receipt`}
													target="_blank"
													class="px-2 py-1 rounded border border-border hover:bg-muted text-foreground transition-colors font-medium flex items-center gap-1"
												>
													<span>Details</span>
													<ExternalLink class="w-3 h-3" />
												</a>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</section>
			{:else if activeNav === 'shared'}
				<div class="w-full space-y-4 sm:space-y-6">
					<!-- Page Header -->
					<div class="space-y-1">
						<h2 class="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
							Shared Items
						</h2>
						<p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
							Items shared across local kiosk sessions or delivered from registered drops.
						</p>
					</div>

					<!-- Empty-State Card -->
					<div class="bg-card rounded-xl border border-border py-12 sm:py-24 px-4 sm:px-6 text-center shadow-xs flex flex-col items-center justify-center">
						<div class="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground mb-4 border border-border">
							<Share2 class="w-6 h-6" />
						</div>
						<h3 class="text-base font-semibold text-foreground mb-1.5">
							No shared items
						</h3>
						<p class="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
							All files received in this session remain isolated in the private workspace.
						</p>
					</div>
				</div>
			{:else if activeNav === 'activity'}
				<div class="w-full space-y-4 sm:space-y-6">
					<!-- Page Header -->
					<div class="space-y-1">
						<h2 class="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
							Recent Activity
						</h2>
						<p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
							Session operations and cryptographic notarization history.
						</p>
					</div>

					<!-- Activity Card -->
					<div class="bg-card rounded-xl border border-border divide-y divide-border shadow-xs">
						<div class="p-4 sm:p-6 flex items-center justify-between gap-3">
							<div class="space-y-0.5 min-w-0">
								<p class="text-xs sm:text-sm font-semibold text-foreground">
									Ephemeral Session Initialized
								</p>
								<p class="text-[11px] sm:text-xs text-muted-foreground font-mono truncate max-w-[200px] sm:max-w-none">
									{currentSession?.session_id || 'Active'}
								</p>
							</div>
							<div class="shrink-0">
								<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
									Ready
								</span>
							</div>
						</div>

						<div class="p-4 sm:p-6 flex items-center justify-between gap-3">
							<div class="space-y-0.5 min-w-0">
								<p class="text-xs sm:text-sm font-semibold text-foreground">
									Drop Portal Channel Created
								</p>
								<p class="text-[11px] sm:text-xs text-muted-foreground font-mono truncate max-w-[200px] sm:max-w-none">
									{currentDrop?.drop_code || 'Configured'}
								</p>
							</div>
							<div class="shrink-0">
								<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
									Online
								</span>
							</div>
						</div>
					</div>
				</div>
			{:else if activeNav === 'settings'}
				<div class="w-full space-y-4 sm:space-y-6">
					<!-- Page Header -->
					<div class="space-y-1">
						<h2 class="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
							Workspace Settings
						</h2>
						<p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
							Configure local node and ephemeral session preferences.
						</p>
					</div>

					<!-- Settings Card -->
					<div class="bg-card rounded-xl border border-border divide-y divide-border shadow-xs">
						<div class="p-4 sm:p-6 flex items-center justify-between gap-3">
							<div class="space-y-0.5 min-w-0">
								<p class="text-xs sm:text-sm font-semibold text-foreground">
									Enclave Cryptography
								</p>
								<p class="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
									AES-256-GCM chunk encryption at rest
								</p>
							</div>
							<div class="shrink-0">
								<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
									Active
								</span>
							</div>
						</div>

						<div class="p-4 sm:p-6 flex items-center justify-between gap-3">
							<div class="space-y-0.5 min-w-0">
								<p class="text-xs sm:text-sm font-semibold text-foreground">
									Wipe-on-Boot Guarantee
								</p>
								<p class="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
									Eradicates pending workspaces upon restart
								</p>
							</div>
							<div class="shrink-0">
								<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
									Enabled
								</span>
							</div>
						</div>

						<div class="p-4 sm:p-6 flex items-center justify-between gap-3">
							<div class="space-y-0.5 min-w-0">
								<p class="text-xs sm:text-sm font-semibold text-foreground">
									Digital Receipt Notarization
								</p>
								<p class="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
									Ed25519 signature verified on completion
								</p>
							</div>
							<div class="shrink-0">
								<span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
									Enforced
								</span>
							</div>
						</div>
					</div>
				</div>
			{/if}
	</div>
</main>

<!-- Exit Session Modal -->
{#if showExitConfirmModal}
	<div class="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
		<div class="bg-card border border-border rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
			<div class="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center border border-destructive/20">
				<AlertTriangle class="w-5 h-5" />
			</div>

			<div>
				<h3 class="text-base font-bold text-foreground">
					Exit & Obliterate Secure Session?
				</h3>
				<p class="text-xs text-muted-foreground mt-2 leading-relaxed">
					Ending this session will trigger the <strong>Verified Wipe Engine</strong>.
					The ephemeral workspace directory will be completely obliterated, session Data Encryption Keys (DEKs) will be crypto-shredded, and zero unencrypted data will remain on disk.
				</p>
			</div>

			<div class="p-3 rounded-lg bg-muted border border-border text-[11px] text-muted-foreground space-y-1">
				<div class="flex justify-between">
					<span>Workspace:</span>
					<span class="font-mono text-foreground">{currentSession?.session_id.substring(0, 16)}...</span>
				</div>
				<div class="flex justify-between">
					<span>Files to shred:</span>
					<span class="font-semibold text-foreground">{uploads.length} file(s)</span>
				</div>
			</div>

			<div class="flex items-center justify-end gap-2.5 pt-2">
				<button
					type="button"
					onclick={() => (showExitConfirmModal = false)}
					disabled={isWiping}
					class="px-3.5 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted border border-border transition-colors cursor-pointer"
				>
					Cancel
				</button>
				<button
					type="button"
					onclick={handleExitSession}
					disabled={isWiping}
					class="px-3.5 py-2 rounded-lg text-xs font-semibold text-primary-foreground bg-destructive hover:opacity-90 shadow-xs transition-opacity cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
				>
					<Trash2 class="w-3.5 h-3.5" />
					<span>{isWiping ? 'Wiping Workspace...' : 'Wipe & Exit Session'}</span>
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Cryptographic Receipt Modal -->
{#if selectedReceipt && selectedReceipt.receipt}
	<div class="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
		<div class="bg-card border border-border rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
					<ShieldCheck class="w-5 h-5" />
					<h3 class="text-sm font-bold text-foreground">
						Cryptographic Upload Receipt
					</h3>
				</div>
				<button
					type="button"
					onclick={() => (selectedReceipt = null)}
					class="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
				>
					<X class="w-4 h-4" />
				</button>
			</div>

			<div class="space-y-2 text-xs">
				<div class="p-3 rounded-lg bg-muted border border-border space-y-1.5 font-mono text-[11px]">
					<div class="flex justify-between">
						<span class="text-muted-foreground">File:</span>
						<span class="text-foreground font-semibold">{selectedReceipt.display_name}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-muted-foreground">Tree Hash:</span>
						<span class="text-foreground truncate max-w-[240px]">{selectedReceipt.receipt.tree_hash}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-muted-foreground">Hub Signature:</span>
						<span class="text-foreground truncate max-w-[240px]">{selectedReceipt.hub_sig || 'Verified Ed25519'}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-muted-foreground">Manager Notarization Seq:</span>
						<span class="text-emerald-600 dark:text-emerald-400 font-bold">{selectedReceipt.manager_ack_seq ?? 'Synced'}</span>
					</div>
				</div>
			</div>

			<div class="flex justify-end pt-2">
				<button
					type="button"
					onclick={() => (selectedReceipt = null)}
					class="px-4 py-2 rounded-lg text-xs font-semibold text-primary-foreground bg-primary hover:opacity-90 shadow-xs transition-opacity cursor-pointer"
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}
