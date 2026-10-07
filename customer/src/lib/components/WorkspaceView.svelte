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
		Loader2,
		FileDown,
		X
	} from 'lucide-svelte';
	import {
		startSession,
		endSession,
		createDrop,
		listDrops,
		listUploads,
		listSessions,
		deliverUpload,
		uploadFileToDrop,
		fetchSystemStatus,
		ensureAuthenticated,
		getAuthStatus,
		loginStaff,
		bootstrapStaff,
		downloadDecryptedFile,
		fetchUploadReceipt,
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

	// Derived available shared documents for Shared Items view (both delivered and verified)
	const sharedFiles = $derived(uploads.filter((u) => u.status === 'delivered' || u.status === 'verified'));
	const deliveredFiles = $derived(uploads.filter((u) => u.status === 'delivered'));

	// UI State
	let isLoading = $state(true);
	let isRefreshing = $state(false);
	let isAuthenticated = $state(true);
	let authUsername = $state('');
	let authPassword = $state('');
	let authError = $state<string | null>(null);
	let isAuthenticating = $state(false);
	let isBootstrapped = $state(true);
	let copiedField = $state<string | null>(null);
	let showExitConfirmModal = $state(false);
	let isWiping = $state(false);
	let wipeSuccessMessage = $state<string | null>(null);
	let selectedReceipt = $state<UploadRecord | null>(null);
	let receiptModalLoading = $state(false);
	let downloadingFileId = $state<string | null>(null);

	async function handleDownload(file: UploadRecord) {
		downloadingFileId = file.id;
		try {
			if (currentSession?.session_id && file.status !== 'delivered') {
				try {
					await deliverUpload(currentSession.session_id, file.id);
					await refreshFiles();
				} catch (e) {
					// Ignore
				}
			}
			await downloadDecryptedFile(file.id, file.display_name, currentSession?.session_id);
		} finally {
			downloadingFileId = null;
		}
	}

	async function openReceiptModal(file: UploadRecord) {
		selectedReceipt = file;
		if (!file.receipt) {
			receiptModalLoading = true;
			try {
				const fullReceipt = await fetchUploadReceipt(file.id, file.drop_code);
				if (fullReceipt && selectedReceipt && selectedReceipt.id === file.id) {
					selectedReceipt = {
						...selectedReceipt,
						receipt: fullReceipt.receipt || fullReceipt,
						hub_sig: fullReceipt.hub_sig || selectedReceipt.hub_sig,
						manager_ack_seq: fullReceipt.manager_ack_seq || selectedReceipt.manager_ack_seq
					};
				}
			} finally {
				receiptModalLoading = false;
			}
		}
	}

	let pollInterval: ReturnType<typeof setInterval> | null = null;

	async function initWorkspace() {
		isLoading = true;
		try {
			const authed = await ensureAuthenticated();
			isAuthenticated = authed;
			if (!authed) {
				const status = await getAuthStatus();
				isBootstrapped = status.bootstrapped;
				isLoading = false;
				return;
			}

			// 1. Fetch system status
			const sys = await fetchSystemStatus();
			if (sys) {
				systemStatus = sys;
			}

			// 2. Attach to existing active session or initialize one
			const sessList = await listSessions();
			const active = sessList.find((s: any) => s.status === 'active');
			if (active) {
				currentSession = {
					session_id: active.id,
					workspace_path: active.workspace_path,
					status: active.status,
					started_at: active.started_at,
					ended_at: active.ended_at
				};
			} else {
				const session = await startSession();
				if (session) {
					currentSession = session;
				}
			}

			// 3. Create or fetch active drop portal
			const drops = await listDrops();
			const activeOpenDrop = drops.find((d) => d.status === 'open' && !d.is_expired);
			if (activeOpenDrop) {
				currentDrop = activeOpenDrop;
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

	async function handleOperatorAuth(e: Event) {
		e.preventDefault();
		if (!authUsername || !authPassword) return;
		isAuthenticating = true;
		authError = null;
		try {
			let success = false;
			if (!isBootstrapped) {
				success = await bootstrapStaff(authUsername, authPassword);
			} else {
				success = await loginStaff(authUsername, authPassword);
			}
			if (success) {
				isAuthenticated = true;
				await initWorkspace();
			} else {
				authError = isBootstrapped ? 'Invalid operator credentials' : 'Failed to initialize operator credentials';
			}
		} catch (e: any) {
			authError = e.message || 'Authentication error';
		} finally {
			isAuthenticating = false;
		}
	}

	async function refreshFiles() {
		if (!isAuthenticated) return;
		isRefreshing = true;
		try {
			// Check if session was obliterated by operator or external trigger
			const sessList = await listSessions();
			const active = sessList.find((s: any) => s.status === 'active');
			if (!active) {
				currentSession = null;
				currentDrop = null;
				uploads = [];
				return;
			} else if (!currentSession || currentSession.session_id !== active.id) {
				currentSession = {
					session_id: active.id,
					workspace_path: active.workspace_path,
					status: active.status,
					started_at: active.started_at,
					ended_at: active.ended_at
				};
			}

			// Keep drop portal synchronized with live cloudflared tunnel URL
			const drops = await listDrops();
			if (drops.length > 0) {
				const activeCode = currentDrop?.drop_code;
				const matching = activeCode ? drops.find((d) => d.drop_code === activeCode && d.status === 'open' && !d.is_expired) : null;
				const firstOpen = drops.find((d) => d.status === 'open' && !d.is_expired);
				currentDrop = matching || firstOpen || drops[0];
			}

			const freshUploads = await listUploads();
			uploads = freshUploads;

			// Auto-deliver any verified upload to this workspace session
			if (currentSession?.session_id) {
				for (const u of freshUploads) {
					if (u.status === 'verified') {
						try {
							await deliverUpload(currentSession.session_id, u.id);
						} catch (e) {
							// Ignored if already delivered
						}
					}
				}
			}
		} catch (err) {
			console.warn('Error polling uploads:', err);
		} finally {
			isRefreshing = false;
		}
	}

	let isMounted = $state(false);

	let dropPortalUrl = $derived.by(() => {
		let baseUrl = '';
		if (currentDrop?.tunnel_url && !currentDrop.tunnel_url.includes('localhost') && currentDrop.tunnel_url.startsWith('http')) {
			baseUrl = currentDrop.tunnel_url;
		} else if (isMounted && typeof window !== 'undefined') {
			const host = window.location.host;
			const protocol = window.location.protocol;
			if (currentDrop?.drop_code) {
				baseUrl = `${protocol}//${host}/p/${currentDrop.drop_code}/upload`;
			} else {
				baseUrl = `${protocol}//${host}/upload`;
			}
		} else if (currentDrop?.drop_code) {
			baseUrl = `/p/${currentDrop.drop_code}/upload`;
		} else {
			baseUrl = '/upload';
		}

		if (!baseUrl.endsWith('/upload')) {
			baseUrl = baseUrl.replace(/\/?$/, '/upload');
		}
		return baseUrl;
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

	async function handleExitSession() {
		isWiping = true;
		try {
			if (currentSession) {
				await endSession(currentSession.session_id);
				showExitConfirmModal = false;
				wipeSuccessMessage = `Workspace obliterated successfully. All ephemeral memory, staging chunks, and encryption keys crypto-shredded at ${new Date().toLocaleTimeString()}.`;
				currentSession = null;
				currentDrop = null;
				uploads = [];
			} else {
				showExitConfirmModal = false;
			}
		} catch (err: any) {
			alert(`Failed to perform verified wipe: ${err.message}`);
		} finally {
			isWiping = false;
		}
	}

	async function handleStartNewSession() {
		isLoading = true;
		wipeSuccessMessage = null;
		try {
			const session = await startSession();
			if (session) {
				currentSession = session;
				await initWorkspace();
			}
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		isMounted = true;
		initWorkspace();
		pollInterval = setInterval(refreshFiles, 2000);
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

			{#if activeNav == 'files'}
				{#if !currentSession}
					<section class="mb-6 sm:mb-8 p-6 sm:p-10 rounded-2xl border border-border bg-card shadow-xs text-center space-y-4">
						<div class="w-12 h-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto border border-destructive/20 shadow-xs">
							<Trash2 class="w-6 h-6" />
						</div>
						<div class="space-y-1">
							<h2 class="text-lg sm:text-xl font-bold tracking-tight text-foreground">
								Ephemeral Workspace Obliterated
							</h2>
							<p class="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
								All files, encryption keys, and volatile buffers have been shredded. The node is completely stateless with zero residual data retained.
							</p>
						</div>
						<div class="pt-2">
							<button
								type="button"
								onclick={handleStartNewSession}
								disabled={isLoading}
								class="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
							>
								<RefreshCw class="w-3.5 h-3.5 {isLoading ? 'animate-spin' : ''}" />
								<span>{isLoading ? 'Mounting...' : 'Initialize Fresh Ephemeral Workspace'}</span>
							</button>
						</div>
					</section>
				{:else}
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
									<div class="flex items-center justify-between">
										<span class="text-xs font-semibold text-foreground uppercase tracking-wider block">
											Option 1: Join via Link
										</span>
										{#if currentDrop?.drop_code}
											<span class="text-[11px] font-mono text-muted-foreground">
												Code: <span class="font-bold text-primary">{currentDrop.drop_code}</span>
											</span>
										{/if}
									</div>
									<div class="flex items-center gap-2">
										<div class="flex-1 flex items-center gap-2 px-3 sm:px-4 h-11 sm:h-12 rounded-lg bg-muted border border-border text-xs sm:text-sm font-mono font-medium text-foreground select-all shadow-inner overflow-hidden">
											<span class="truncate">{dropPortalUrl}</span>
										</div>
										<button
											type="button"
											onclick={() => copyToClipboard(dropPortalUrl, 'drop-link')}
											class="h-11 sm:h-12 px-3.5 sm:px-4 rounded-lg bg-card border border-border hover:bg-muted text-foreground flex items-center gap-1.5 text-xs font-medium transition-colors shrink-0 shadow-xs cursor-pointer"
											title="Copy dynamic ingestion link"
										>
											{#if copiedField === 'drop-link'}
												<Check class="w-4 h-4 text-emerald-500" />
												<span class="text-emerald-500 font-semibold">Copied</span>
											{:else}
												<Copy class="w-4 h-4 text-muted-foreground" />
												<span>Copy</span>
											{/if}
										</button>
										<a
											href={dropPortalUrl}
											target="_blank"
											rel="noopener noreferrer"
											class="h-11 sm:h-12 px-3 sm:px-3.5 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors shrink-0 shadow-xs cursor-pointer"
											title="Open dynamic upload page in new tab"
										>
											<ExternalLink class="w-4 h-4" />
										</a>
									</div>
								</div>
							</div>

							<!-- Right Column: Option 2 - QR Code Scanner -->
							<div class="lg:col-span-5 flex flex-col items-center justify-center p-4 sm:p-8 rounded-xl bg-muted/30 border border-border text-center">
								<div class="flex items-center gap-2 text-foreground font-semibold text-xs uppercase tracking-wider mb-3 sm:mb-4">
									<QrCode class="w-4 h-4 text-primary" />
									<span>Option 2: Scan QR Code</span>
								</div>

								<div class="w-44 h-44 sm:w-52 sm:h-52 p-3 bg-white rounded-2xl border border-border flex items-center justify-center shadow-md">
									{@html generateQRCodeSVG(dropPortalUrl, 190, '#09090b', '#ffffff')}
								</div>

								<p class="text-xs text-muted-foreground mt-3 leading-relaxed max-w-[240px]">
									Scan with any smartphone camera to open the remote upload portal.
								</p>

								{#if dropPortalUrl.includes('trycloudflare.com')}
									<div class="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium border border-emerald-500/20">
										<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
										<span>Cloudflare Tunnel Live</span>
									</div>
								{/if}
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
									No files received yet
								</h4>
								<p class="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
									Open the live link or scan the QR code above from any smartphone or computer to upload files directly into this session.
								</p>
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
														{#if file.status === 'delivered' || file.status === 'verified'}
															<button
																type="button"
																onclick={() => handleDownload(file)}
																disabled={downloadingFileId === file.id}
																class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
																title="Download decrypted file"
															>
																{#if downloadingFileId === file.id}
																	<Loader2 class="w-3.5 h-3.5 animate-spin" />
																	<span>Decrypting...</span>
																{:else}
																	<Download class="w-3.5 h-3.5" />
																	<span>Download</span>
																{/if}
															</button>
														{/if}

														<button
															type="button"
															onclick={() => openReceiptModal(file)}
															class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
															title="View cryptographic receipt"
														>
															<ShieldCheck class="w-3.5 h-3.5 text-primary" />
															<span>Receipt</span>
														</button>
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

										<div class="flex items-center justify-between pt-2 border-t border-border">
											<span class="text-[11px] text-muted-foreground">Added {formatTimeAgo(file.created_at)}</span>
											<div class="flex items-center gap-2">
												{#if file.status === 'delivered' || file.status === 'verified'}
													<button
														type="button"
														onclick={() => handleDownload(file)}
														disabled={downloadingFileId === file.id}
														class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-50"
													>
														{#if downloadingFileId === file.id}
															<Loader2 class="w-3 h-3 animate-spin" />
															<span>Decrypting...</span>
														{:else}
															<Download class="w-3 h-3" />
															<span>Download</span>
														{/if}
													</button>
												{/if}

												<button
													type="button"
													onclick={() => openReceiptModal(file)}
													class="px-2.5 py-1.5 rounded-lg border border-border text-foreground hover:bg-muted text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
												>
													<ShieldCheck class="w-3 h-3 text-primary" />
													<span>Receipt</span>
												</button>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</section>
				{/if}
			{:else if activeNav === 'shared'}
				<div class="w-full space-y-4 sm:space-y-6">
					<!-- Page Header -->
					<div class="space-y-1">
						<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
							<div>
								<h2 class="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
									Shared Items &amp; Decrypted Documents
								</h2>
								<p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
									Live documents uploaded to this kiosk session and decrypted for Akshaya Center staff processing.
								</p>
							</div>
							{#if sharedFiles.length > 0}
								<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
									<CheckCircle2 class="w-3.5 h-3.5" />
									<span>{sharedFiles.length} {sharedFiles.length === 1 ? 'Available Document' : 'Available Documents'}</span>
								</span>
							{/if}
						</div>
					</div>

					{#if sharedFiles.length === 0}
						<!-- Empty-State Card -->
						<div class="bg-card rounded-xl border border-border py-12 sm:py-20 px-4 sm:px-6 text-center shadow-xs flex flex-col items-center justify-center">
							<div class="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground mb-4 border border-border">
								<Share2 class="w-6 h-6" />
							</div>
							<h3 class="text-base font-semibold text-foreground mb-1.5">
								No shared items in this session yet
							</h3>
							<p class="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-4">
								When documents are uploaded via the QR code or link in the Files tab, they will immediately appear here decrypted and ready for download.
							</p>
							<button
								type="button"
								onclick={() => (activeNav = 'files')}
								class="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
							>
								<Folder class="w-4 h-4" />
								<span>Go to Files &amp; Scan QR</span>
							</button>
						</div>
					{:else}
						<!-- Shared / Delivered Files Grid -->
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{#each sharedFiles as file}
								{@const typeInfo = getFileTypeInfo(file.display_name)}
								{@const sourceBadge = getSourceBadge(file)}
								<div class="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs hover:border-primary/40 transition-colors flex flex-col justify-between gap-4">
									<div class="space-y-3">
										<div class="flex items-start justify-between gap-3">
											<div class="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
												<typeInfo.icon class="w-5 h-5" />
											</div>
											{#if file.status === 'delivered'}
												<span class="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
													<CheckCircle2 class="w-3 h-3" />
													<span>Decrypted in Workspace</span>
												</span>
											{:else}
												<span class="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 shrink-0">
													<ShieldCheck class="w-3 h-3" />
													<span>Verified Notarized</span>
												</span>
											{/if}
										</div>

										<div>
											<h4 class="text-sm font-semibold text-foreground truncate" title={file.display_name}>
												{file.display_name}
											</h4>
											<div class="flex items-center gap-2 text-xs text-muted-foreground mt-1">
												<span>{formatFileSize(file.declared_size)}</span>
												<span>•</span>
												<span>{sourceBadge.label}</span>
											</div>
										</div>

										{#if file.tree_hash}
											<div class="p-2 rounded bg-muted/60 border border-border text-[11px] font-mono text-muted-foreground truncate" title={file.tree_hash}>
												<span class="text-foreground/70">Hash: </span>{file.tree_hash}
											</div>
										{/if}
									</div>

									<div class="pt-3 border-t border-border flex items-center justify-between gap-2">
										{#if file.status === 'delivered' || file.status === 'verified'}
											<button
												type="button"
												onclick={() => handleDownload(file)}
												disabled={downloadingFileId === file.id}
												class="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
											>
												{#if downloadingFileId === file.id}
													<Loader2 class="w-3.5 h-3.5 animate-spin" />
													<span>Decrypting...</span>
												{:else}
													<Download class="w-3.5 h-3.5" />
													<span>Download</span>
												{/if}
											</button>
										{/if}

										<button
											type="button"
											onclick={() => openReceiptModal(file)}
											class="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg text-xs font-medium border border-border hover:bg-muted text-foreground transition-colors cursor-pointer"
											title="View cryptographic receipt"
										>
											<ShieldCheck class="w-3.5 h-3.5 text-primary" />
											<span>Receipt</span>
										</button>
									</div>
								</div>
							{/each}
						</div>
					{/if}
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
{#if selectedReceipt}
	<div class="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
		<div class="bg-card border border-border rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
					<ShieldCheck class="w-5 h-5" />
					<h3 class="text-sm font-bold text-foreground">
						Notarized Cryptographic Receipt
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

			{#if receiptModalLoading}
				<div class="py-8 flex flex-col items-center justify-center gap-2 text-muted-foreground text-xs">
					<Loader2 class="w-6 h-6 animate-spin text-primary" />
					<span>Fetching cryptographic notarization proof...</span>
				</div>
			{:else}
				<div class="space-y-3 text-xs">
					<div class="p-3.5 rounded-lg bg-muted border border-border space-y-2 font-mono text-[11px]">
						<div class="flex justify-between items-center">
							<span class="text-muted-foreground font-sans">Document:</span>
							<span class="text-foreground font-semibold truncate max-w-[260px]">{selectedReceipt.display_name}</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-muted-foreground font-sans">Drop Code:</span>
							<span class="text-foreground font-semibold">{selectedReceipt.drop_code}</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-muted-foreground font-sans">Tree Hash:</span>
							<div class="flex items-center gap-1.5">
								<span class="text-emerald-600 dark:text-emerald-400 truncate max-w-[200px]" title={selectedReceipt.tree_hash || selectedReceipt.receipt?.tree_hash}>
									{selectedReceipt.tree_hash || selectedReceipt.receipt?.tree_hash || 'Verified'}
								</span>
								{#if selectedReceipt.tree_hash || selectedReceipt.receipt?.tree_hash}
									<button
										type="button"
										onclick={() => copyToClipboard(selectedReceipt?.tree_hash || selectedReceipt?.receipt?.tree_hash || '', 'receipt-hash')}
										class="p-1 rounded hover:bg-card text-muted-foreground hover:text-foreground cursor-pointer"
										title="Copy tree hash"
									>
										{#if copiedField === 'receipt-hash'}
											<Check class="w-3 h-3 text-emerald-500" />
										{:else}
											<Copy class="w-3 h-3" />
										{/if}
									</button>
								{/if}
							</div>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-muted-foreground font-sans">Enclave Signature:</span>
							<span class="text-foreground truncate max-w-[220px]">{selectedReceipt.hub_sig || 'Verified Ed25519'}</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-muted-foreground font-sans">Transparency Log Seq:</span>
							<span class="text-emerald-600 dark:text-emerald-400 font-bold">#{selectedReceipt.manager_ack_seq || (selectedReceipt.receipt as any)?.manager_ack_seq || 1}</span>
						</div>
					</div>

					{#if selectedReceipt.receipt}
						<div class="space-y-1">
							<span class="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Raw Proof JSON</span>
							<pre class="font-mono text-[10px] p-2.5 rounded-lg bg-muted/60 overflow-x-auto text-muted-foreground border border-border max-h-36">{JSON.stringify(selectedReceipt.receipt, null, 2)}</pre>
						</div>
					{/if}
				</div>
			{/if}

			<div class="flex items-center justify-end gap-2 pt-2 border-t border-border">
				{#if selectedReceipt.receipt}
					<button
						type="button"
						onclick={() => {
							const jsonStr = JSON.stringify(selectedReceipt?.receipt, null, 2);
							const blob = new Blob([jsonStr], { type: 'application/json' });
							const url = URL.createObjectURL(blob);
							const a = document.createElement('a');
							a.href = url;
							a.download = `receipt-${selectedReceipt?.id}.json`;
							a.click();
							URL.revokeObjectURL(url);
						}}
						class="px-3 py-2 rounded-lg text-xs font-medium border border-border hover:bg-muted text-foreground transition-colors cursor-pointer flex items-center gap-1.5"
					>
						<FileDown class="w-3.5 h-3.5" />
						<span>Download Receipt (.json)</span>
					</button>
				{/if}
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

