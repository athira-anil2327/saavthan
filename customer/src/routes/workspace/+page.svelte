<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		FolderSync,
		Inbox,
		Radio,
		Cpu,
		Users,
		ArrowLeft,
		Play,
		Trash2,
		RefreshCw,
		CheckCircle2,
		AlertTriangle,
		ExternalLink,
		Copy,
		Check,
		FileText,
		ShieldCheck,
		ShieldAlert,
		DownloadCloud,
		Download,
		Loader2,
		FileDown,
		Plus,
		KeyRound,
		Lock,
		Folder,
		ChevronLeft,
		ChevronRight,
		Maximize2,
		Minimize2,
		X
	} from 'lucide-svelte';
	import {
		startSession,
		endSession,
		createDrop,
		listDrops,
		closeDrop,
		listUploads,
		deliverUpload,
		listSessions,
		fetchSystemStatus,
		triggerOtaUpdate,
		enrollNode,
		listUsers,
		registerStaff,
		downloadDecryptedFile,
		fetchUploadReceipt,
		listSessionFiles,
		type SessionInfo,
		type DropInfo,
		type UploadRecord,
		type SystemStatus,
		type SessionFile
	} from '#lib/saavthan-api';
	import AppSidebar, { type SidebarItem } from '#lib/components/AppSidebar.svelte';

	// Sidebar Sections
	type OperatorSection = 'session' | 'staging' | 'drops' | 'node' | 'staff';
	let activeSection = $state<OperatorSection>('session');
	let mobileNavOpen = $state(false);

	const sidebarItems: SidebarItem[] = [
		{ id: 'session', name: 'Active Session', icon: FolderSync },
		{ id: 'staging', name: 'Staged Ingestion Queue', icon: Inbox },
		{ id: 'drops', name: 'Drop Portals', icon: Radio },
		{ id: 'node', name: 'Node & OTA Enclave', icon: Cpu },
		{ id: 'staff', name: 'Staff Access', icon: Users }
	];

	// Data State
	let systemStatus = $state<SystemStatus | null>(null);
	let currentSession = $state<SessionInfo | null>(null);
	let sessions = $state<any[]>([]);
	let drops = $state<DropInfo[]>([]);
	let uploads = $state<UploadRecord[]>([]);
	let users = $state<any[]>([]);

	// Session Ledger Pagination (15 items per page)
	const SESSIONS_PER_PAGE = 15;
	let sessionPage = $state(1);
	let totalSessionPages = $derived(Math.max(1, Math.ceil(sessions.length / SESSIONS_PER_PAGE)));
	let paginatedSessions = $derived(
		sessions.slice((sessionPage - 1) * SESSIONS_PER_PAGE, sessionPage * SESSIONS_PER_PAGE)
	);
	let ledgerModalOpen = $state(false);

	function nextSessionPage() {
		if (sessionPage < totalSessionPages) {
			sessionPage++;
		}
	}

	function prevSessionPage() {
		if (sessionPage > 1) {
			sessionPage--;
		}
	}

	let isLoading = $state(true);
	let isRefreshing = $state(false);
	let copiedKey = $state<string | null>(null);

	// Action States
	let isStartingSession = $state(false);
	let isWiping = $state(false);
	let wipeModalOpen = $state(false);
	let wipeMessage = $state<string | null>(null);
	let deliveringUploadId = $state<string | null>(null);
	let deliverySuccessMessage = $state<string | null>(null);
	let downloadingUploadId = $state<string | null>(null);
	let isDeliveringAll = $state(false);
	let workspaceFiles = $state<SessionFile[]>([]);

	// New Drop Form
	let newDropLabel = $state('');
	let newDropMaxMb = $state(100);
	let newDropTtlMinutes = $state(120);
	let isCreatingDrop = $state(false);
	let dropCreatedMessage = $state<string | null>(null);

	// Node Enrollment Form
	let enrollManagerUrl = $state('');
	let enrollToken = $state('');
	let isEnrolling = $state(false);
	let enrollMessage = $state<string | null>(null);

	// OTA Check & Modal
	interface OtaModalData {
		status: 'applied' | 'up_to_date' | 'rejected' | 'failed' | 'error';
		title: string;
		description: string;
		previous_version?: string;
		new_version?: string;
		current_image_version?: string;
		active_image_file?: string;
		sha256?: string;
		reason?: string;
		message?: string;
		timestamp: string;
		rawJson?: string;
	}

	let isCheckingOta = $state(false);
	let otaStatusMessage = $state<string | null>(null);
	let activeOtaResult = $state<OtaModalData | null>(null);
	let lastOtaResult = $state<OtaModalData | null>(null);
	let showOtaRawJson = $state(false);

	// New Staff Form
	let newStaffUsername = $state('');
	let newStaffPassword = $state('');
	let isCreatingStaff = $state(false);
	let staffMessage = $state<string | null>(null);

	// Receipt Modal
	let activeReceipt = $state<UploadRecord | null>(null);
	let receiptLoading = $state(false);

	let pollInterval: ReturnType<typeof setInterval> | null = null;

	async function loadAllData() {
		try {
			// 1. Fetch system status
			const sys = await fetchSystemStatus();
			if (sys) systemStatus = sys;

			// 2. Fetch sessions
			const sessList = await listSessions();
			sessions = sessList;
			const active = sessList.find((s: any) => s.status === 'active');
			if (active) {
				currentSession = {
					session_id: active.id,
					workspace_path: active.workspace_path,
					status: active.status,
					started_at: active.started_at,
					ended_at: active.ended_at
				};
				workspaceFiles = await listSessionFiles(active.id);
			} else {
				currentSession = null;
				workspaceFiles = [];
			}

			// 3. Fetch drops
			drops = await listDrops();

			// 4. Fetch uploads
			uploads = await listUploads();

			// 5. Fetch users
			users = await listUsers();
		} catch (e) {
			console.warn('Operator data poll error:', e);
		}
	}

	async function handleStartSession() {
		isStartingSession = true;
		try {
			const res = await startSession();
			if (res) {
				currentSession = res;
				await loadAllData();
			}
		} finally {
			isStartingSession = false;
		}
	}

	async function handleEndSession() {
		if (!currentSession) return;
		isWiping = true;
		wipeMessage = null;
		try {
			const res = await endSession(currentSession.session_id);
			if (res && res.wipe_verified) {
				wipeMessage = `Session ${currentSession.session_id.substring(0, 8)} obliterated. Workspace folder shredded, encryption keys destroyed.`;
				currentSession = null;
				workspaceFiles = [];
				await loadAllData();
			} else {
				wipeMessage = `Wipe command executed.`;
				currentSession = null;
				workspaceFiles = [];
				await loadAllData();
			}
		} finally {
			isWiping = false;
		}
	}

	async function handleDeliverUpload(uploadId: string) {
		if (!currentSession) {
			alert('Please start an active session before delivering files to workspace.');
			return;
		}
		deliveringUploadId = uploadId;
		deliverySuccessMessage = null;
		try {
			const res = await deliverUpload(currentSession.session_id, uploadId);
			if (res) {
				deliverySuccessMessage = `Decrypted and delivered "${res.file_name}" into workspace.`;
				await loadAllData();
			}
		} finally {
			deliveringUploadId = null;
		}
	}

	async function handleDeliverAll() {
		if (!currentSession) {
			alert('Please start an active session first.');
			return;
		}
		isDeliveringAll = true;
		deliverySuccessMessage = null;
		try {
			const pending = uploads.filter((u) => u.status !== 'delivered' && u.status !== 'wiped');
			let count = 0;
			for (const u of pending) {
				try {
					await deliverUpload(currentSession.session_id, u.id);
					count++;
				} catch (e) {
					// Ignore
				}
			}
			deliverySuccessMessage = `Delivered ${count} document(s) into workspace.`;
			await loadAllData();
		} finally {
			isDeliveringAll = false;
		}
	}

	async function handleDownloadFile(uploadId: string, displayName: string) {
		downloadingUploadId = uploadId;
		try {
			// If not delivered yet, auto-deliver to workspace
			if (currentSession?.session_id) {
				const match = uploads.find((u) => u.id === uploadId);
				if (match && match.status !== 'delivered') {
					try {
						await deliverUpload(currentSession.session_id, uploadId);
						await loadAllData();
					} catch (e) {
						// Ignore
					}
				}
			}
			await downloadDecryptedFile(uploadId, displayName, currentSession?.session_id);
		} finally {
			downloadingUploadId = null;
		}
	}

	async function openReceiptModal(u: UploadRecord) {
		activeReceipt = u;
		if (!u.receipt) {
			receiptLoading = true;
			try {
				const full = await fetchUploadReceipt(u.id, u.drop_code);
				if (full && activeReceipt && activeReceipt.id === u.id) {
					activeReceipt = {
						...activeReceipt,
						receipt: full.receipt || full,
						hub_sig: full.hub_sig || activeReceipt.hub_sig,
						manager_ack_seq: full.manager_ack_seq || activeReceipt.manager_ack_seq
					};
				}
			} finally {
				receiptLoading = false;
			}
		}
	}

	async function handleCreateDrop(e: Event) {
		e.preventDefault();
		isCreatingDrop = true;
		dropCreatedMessage = null;
		try {
			const drop = await createDrop(newDropLabel, newDropMaxMb * 1024 * 1024, newDropTtlMinutes);
			if (drop) {
				dropCreatedMessage = `Drop ${drop.drop_code} generated successfully!`;
				await loadAllData();
			}
		} finally {
			isCreatingDrop = false;
		}
	}

	async function handleCloseDrop(code: string) {
		const ok = await closeDrop(code);
		if (ok) {
			await loadAllData();
		}
	}

	async function handleEnrollNode(e: Event) {
		e.preventDefault();
		if (!enrollToken) return;
		isEnrolling = true;
		enrollMessage = null;
		try {
			const res = await enrollNode(enrollManagerUrl, enrollToken);
			if (res && res.status === 'enrolled') {
				enrollMessage = `Node enrolled! Device ID: ${res.device_id}`;
				enrollToken = '';
				await loadAllData();
			} else {
				enrollMessage = `Enrollment failed: ${res?.detail || 'Invalid token or unreachable manager'}`;
			}
		} finally {
			isEnrolling = false;
		}
	}

	async function handleTriggerOta() {
		isCheckingOta = true;
		otaStatusMessage = null;
		try {
			const res = await triggerOtaUpdate();
			const timestamp = new Date().toLocaleString();
			if (res) {
				const rawStr = JSON.stringify(res, null, 2);
				if (res.status === 'up_to_date') {
					const data: OtaModalData = {
						status: 'up_to_date',
						title: 'Node Firmware Up to Date',
						description: 'Your node is currently operating on the latest signed release image verified by the Central Authority.',
						current_image_version: res.current_image_version || systemStatus?.image_version || '1.0.0',
						active_image_file: systemStatus?.active_image_file || 'base_image.bin',
						timestamp,
						rawJson: rawStr
					};
					activeOtaResult = data;
					lastOtaResult = data;
				} else if (res.status === 'applied' || res.status === 'updated') {
					const data: OtaModalData = {
						status: 'applied',
						title: 'OTA Update Applied Successfully',
						description: 'Cryptographically verified release manifest signature confirmed. Image downloaded, verified via SHA-256, and activated.',
						previous_version: res.previous_version || systemStatus?.image_version,
						new_version: res.new_version || res.target_version,
						active_image_file: res.active_image_file,
						sha256: res.sha256,
						timestamp,
						rawJson: rawStr
					};
					activeOtaResult = data;
					lastOtaResult = data;
				} else if (res.status === 'rejected') {
					const data: OtaModalData = {
						status: 'rejected',
						title: 'OTA Update Rejected',
						description: 'The release manifest failed cryptographic signature verification against the Central Manager public key.',
						reason: res.reason || 'Ed25519 signature mismatch',
						timestamp,
						rawJson: rawStr
					};
					activeOtaResult = data;
					lastOtaResult = data;
				} else if (res.status === 'failed') {
					const data: OtaModalData = {
						status: 'failed',
						title: 'OTA Verification / Download Failed',
						description: 'The OTA update could not be completed due to an artifact integrity or download failure.',
						reason: res.reason || 'Integrity verification failed',
						timestamp,
						rawJson: rawStr
					};
					activeOtaResult = data;
					lastOtaResult = data;
				} else {
					const data: OtaModalData = {
						status: 'error',
						title: 'OTA Update Status Report',
						description: res.message || res.detail || 'Central Manager returned an alert notice for this node.',
						message: res.message || res.detail,
						reason: res.reason,
						timestamp,
						rawJson: rawStr
					};
					activeOtaResult = data;
					lastOtaResult = data;
				}
				showOtaRawJson = false;
				await loadAllData();
			} else {
				const data: OtaModalData = {
					status: 'error',
					title: 'OTA Check Failed',
					description: 'Could not contact Central Manager or no response was received.',
					message: 'Central Manager unreachable or timed out.',
					timestamp: new Date().toLocaleString()
				};
				activeOtaResult = data;
				lastOtaResult = data;
				showOtaRawJson = false;
			}
		} catch (err: any) {
			const data: OtaModalData = {
				status: 'error',
				title: 'OTA Check Error',
				description: err?.message || 'An unexpected error occurred while querying updates.',
				message: String(err),
				timestamp: new Date().toLocaleString(),
				rawJson: JSON.stringify(err, null, 2)
			};
			activeOtaResult = data;
			lastOtaResult = data;
			showOtaRawJson = false;
		} finally {
			isCheckingOta = false;
		}
	}

	async function handleCreateStaff(e: Event) {
		e.preventDefault();
		if (!newStaffUsername || !newStaffPassword) return;
		isCreatingStaff = true;
		staffMessage = null;
		try {
			const res = await registerStaff(newStaffUsername, newStaffPassword);
			if (res) {
				staffMessage = `Staff account '${res.username}' created with role '${res.role}'.`;
				newStaffUsername = '';
				newStaffPassword = '';
				await loadAllData();
			} else {
				staffMessage = 'Staff registration failed.';
			}
		} finally {
			isCreatingStaff = false;
		}
	}

	function copyText(text: string, key: string) {
		navigator.clipboard.writeText(text);
		copiedKey = key;
		setTimeout(() => (copiedKey = null), 2000);
	}

	function formatBytes(bytes: number): string {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
	}

	function formatTime(timestamp: number): string {
		if (!timestamp) return '—';
		return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
	}

	onMount(async () => {
		isLoading = true;
		await loadAllData();
		isLoading = false;

		pollInterval = setInterval(async () => {
			await loadAllData();
		}, 4000);
	});

	onDestroy(() => {
		if (pollInterval) clearInterval(pollInterval);
	});
</script>

<svelte:head>
	<title>Vault — Node Operator Enclave Workspace</title>
</svelte:head>

<!-- Left Sidebar Navigation -->
<AppSidebar
	items={sidebarItems}
	activeId={activeSection}
	onSelect={(id) => {
		activeSection = id as OperatorSection;
		mobileNavOpen = false;
	}}
	mobileOpen={mobileNavOpen}
	onExit={() => (wipeModalOpen = true)}
/>

<!-- Main Workspace Application Area -->
<main class="flex-1 px-4 py-5 sm:p-8 lg:px-10 lg:py-8 min-w-0 bg-background overflow-y-auto w-full">
	<div class="w-full max-w-[1320px] space-y-5 sm:space-y-6">

				<!-- Top Sub-Header & Breadcrumb / Switcher -->
				<div class="op-header flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
					<div>
						<h1 class="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
							{#if activeSection === 'session'}Ephemeral Workspace Session{/if}
							{#if activeSection === 'staging'}Staged Ingestion Queue{/if}
							{#if activeSection === 'drops'}Drop Portals Management{/if}
							{#if activeSection === 'node'}Node Enclave & OTA Updates{/if}
							{#if activeSection === 'staff'}Staff & Operator Access{/if}
						</h1>
					</div>

					<div class="flex items-center gap-2 self-start sm:self-auto">
						<button
							type="button"
							onclick={async () => { isRefreshing = true; await loadAllData(); isRefreshing = false; }}
							class="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium border border-border text-foreground hover:bg-muted transition-colors cursor-pointer shadow-xs"
						>
							<RefreshCw class="w-3.5 h-3.5 {isRefreshing ? 'animate-spin' : ''}" />
							<span>Refresh</span>
						</button>
					</div>
				</div>

				<!-- ======================================================== -->
				<!-- SECTION 1: EPHEMERAL WORKSPACE SESSION                   -->
				<!-- ======================================================== -->
				{#if activeSection === 'session'}
					<div class="space-y-4 sm:space-y-6">
						<!-- Active Session Enclave Card -->
						<div class="op-card bg-card border border-border rounded-xl p-4 sm:p-6 shadow-xs">
							<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 sm:mb-6">
								<div class="flex items-start gap-3.5">
									<div class="w-10 h-10 rounded-lg {currentSession ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-muted text-muted-foreground'} flex items-center justify-center shrink-0">
										<FolderSync class="w-5 h-5" />
									</div>
									<div class="min-w-0">
										<div class="flex flex-wrap items-center gap-2">
											<h2 class="text-base sm:text-lg font-semibold text-foreground">
												{currentSession ? 'Active Kiosk Ephemeral Workspace' : 'No Active Session'}
											</h2>
											{#if currentSession}
												<span class="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
													<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
													Enclave Mounted
												</span>
											{/if}
										</div>
										<p class="text-xs text-muted-foreground mt-0.5">
											{currentSession ? 'Files delivered to this session reside in volatile memory and are crypto-shredded upon obliteration.' : 'Start a fresh ephemeral workspace to begin staging and decrypting files.'}
										</p>
									</div>
								</div>

								<div class="flex items-center gap-2 w-full md:w-auto">
									{#if currentSession}
										<button
											type="button"
											onclick={() => (wipeModalOpen = true)}
											class="w-full md:w-auto inline-flex items-center justify-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-xs cursor-pointer"
										>
											<Trash2 class="w-4 h-4" />
											<span>Obliterate Workspace</span>
										</button>
									{:else}
										<button
											type="button"
											onclick={handleStartSession}
											disabled={isStartingSession}
											class="w-full md:w-auto inline-flex items-center justify-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
										>
											<Play class="w-4 h-4" />
											<span>{isStartingSession ? 'Mounting...' : 'Start New Session'}</span>
										</button>
									{/if}
								</div>
							</div>

							{#if currentSession}
								<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 sm:p-4 rounded-lg bg-muted/40 border border-border text-xs">
									<div class="min-w-0">
										<span class="text-muted-foreground block">Session ID</span>
										<code class="font-mono text-foreground font-medium mt-0.5 block truncate" title={currentSession.session_id}>
											{currentSession.session_id}
										</code>
									</div>
									<div class="min-w-0">
										<span class="text-muted-foreground block">Workspace Mount Path</span>
										<code class="font-mono text-foreground font-medium mt-0.5 block truncate" title={currentSession.workspace_path}>
											{currentSession.workspace_path}
										</code>
									</div>
									<div>
										<span class="text-muted-foreground block">Started At</span>
										<span class="font-medium text-foreground mt-0.5 block">
											{formatTime(currentSession.started_at || 0)}
										</span>
									</div>
								</div>
							{/if}

							{#if wipeMessage}
								<div class="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2">
									<CheckCircle2 class="w-4 h-4 shrink-0" />
									<span>{wipeMessage}</span>
								</div>
							{/if}
						</div>

						<!-- Ephemeral Workspace Files (Plaintext) -->
						<div class="op-card bg-card border border-border rounded-xl p-4 sm:p-6 shadow-xs">
							<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
								<div>
									<div class="flex items-center gap-2">
										<h3 class="text-sm sm:text-base font-semibold text-foreground">
											Workspace Ephemeral Files (Plaintext)
										</h3>
										{#if currentSession}
											<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
												RAM Mounted
											</span>
										{/if}
									</div>
									<p class="text-xs text-muted-foreground mt-0.5">
										{workspaceFiles.length} decrypted document(s) residing in volatile kiosk workspace memory.
									</p>
								</div>

							</div>

							{#if !currentSession}
								<div class="p-8 text-center border border-dashed border-border rounded-lg text-muted-foreground">
									<FolderSync class="w-8 h-8 mx-auto mb-2 opacity-40" />
									<p class="text-xs font-medium">No active session mounted</p>
									<p class="text-[11px] mt-1 text-muted-foreground">Start an ephemeral workspace session above to begin receiving and decrypting files.</p>
								</div>
							{:else if workspaceFiles.length === 0}
								<div class="p-8 text-center border border-dashed border-border rounded-lg text-muted-foreground">
									<Inbox class="w-8 h-8 mx-auto mb-2 opacity-40 text-primary" />
									<p class="text-xs font-medium text-foreground">Workspace mounted, no files delivered yet</p>
									<p class="text-[11px] mt-1 text-muted-foreground max-w-sm mx-auto">
										Files uploaded by customers are automatically transferred and decrypted into this secure session.
									</p>
								</div>
							{:else}
								<div class="overflow-x-auto">
									<table class="w-full text-xs text-left">
										<thead>
											<tr class="border-b border-border text-muted-foreground">
												<th class="pb-2 font-medium">Document Name</th>
												<th class="pb-2 font-medium">Size</th>
												<th class="pb-2 font-medium">Status</th>
												<th class="pb-2 font-medium text-right">Actions</th>
											</tr>
										</thead>
										<tbody class="divide-y divide-border/60">
											{#each workspaceFiles as f}
												{@const matchedUpload = uploads.find(u => u.display_name === f.name || u.id === f.upload_id)}
												<tr class="hover:bg-muted/30 transition-colors">
													<td class="py-2.5 font-medium text-foreground">
														<div class="flex items-center gap-2">
															<FileText class="w-4 h-4 text-primary shrink-0" />
															<span class="truncate max-w-[240px] sm:max-w-md">{f.name}</span>
														</div>
													</td>
													<td class="py-2.5 font-mono text-muted-foreground">{formatBytes(f.size)}</td>
													<td class="py-2.5">
														<span class="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
															<CheckCircle2 class="w-3 h-3" />
															<span>Decrypted Plaintext</span>
														</span>
													</td>
													<td class="py-2.5 text-right">
														<div class="inline-flex items-center gap-1.5">
															<button
																type="button"
																onclick={() => handleDownloadFile(f.upload_id || '', f.name)}
																disabled={downloadingUploadId === f.upload_id}
																class="h-7 px-2.5 rounded-md text-[11px] font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1 shadow-xs"
																title="Download decrypted document"
															>
																{#if downloadingUploadId === f.upload_id}
																	<Loader2 class="w-3 h-3 animate-spin" />
																	<span>Downloading...</span>
																{:else}
																	<Download class="w-3 h-3" />
																	<span>Download</span>
																{/if}
															</button>

															{#if matchedUpload}
																<button
																	type="button"
																	onclick={() => openReceiptModal(matchedUpload)}
																	class="h-7 px-2 rounded-md text-[11px] font-medium border border-border text-foreground hover:bg-muted transition-colors cursor-pointer flex items-center gap-1"
																	title="View Cryptographic Receipt"
																>
																	<ShieldCheck class="w-3 h-3 text-primary" />
																	<span>Receipt</span>
																</button>
															{/if}
														</div>
													</td>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>
							{/if}
						</div>

						<!-- Session History Table (15 per page + Expand All Popup) -->
						<div class="op-card bg-card border border-border rounded-xl p-4 sm:p-6 shadow-xs">
							<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
								<div>
									<h3 class="text-sm font-semibold text-foreground">
										Session Ledger
									</h3>
									<p class="text-xs text-muted-foreground mt-0.5">
										{sessions.length} total sessions recorded on this node.
									</p>
								</div>

								<div class="flex flex-wrap items-center gap-2">
									{#if totalSessionPages > 1}
										<div class="flex items-center gap-2">
											<span class="text-xs text-muted-foreground">
												Page {sessionPage} of {totalSessionPages}
											</span>
											<div class="inline-flex items-center rounded-lg border border-border bg-background p-0.5 shadow-xs">
												<button
													type="button"
													onclick={prevSessionPage}
													disabled={sessionPage <= 1}
													class="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
													title="Previous page"
													aria-label="Previous page"
												>
													<ChevronLeft class="w-4 h-4" />
												</button>
												<button
													type="button"
													onclick={nextSessionPage}
													disabled={sessionPage >= totalSessionPages}
													class="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
													title="Next page"
													aria-label="Next page"
												>
													<ChevronRight class="w-4 h-4" />
												</button>
											</div>
										</div>
									{/if}

									<button
										type="button"
										onclick={() => (ledgerModalOpen = true)}
										class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
										title="Expand all sessions"
									>
										<Maximize2 class="w-3.5 h-3.5 text-muted-foreground" />
										<span>Expand All</span>
									</button>
								</div>
							</div>

							{#if sessions.length === 0}
								<p class="text-xs text-muted-foreground py-4 text-center">No sessions recorded on this node yet.</p>
							{:else}
								<!-- Desktop Table View -->
								<div class="hidden md:block overflow-x-auto">
									<table class="w-full text-xs text-left">
										<thead>
											<tr class="border-b border-border text-muted-foreground">
												<th class="pb-2 font-medium">Session ID</th>
												<th class="pb-2 font-medium">Status</th>
												<th class="pb-2 font-medium">Workspace Path</th>
												<th class="pb-2 font-medium">Started</th>
												<th class="pb-2 font-medium">Ended</th>
											</tr>
										</thead>
										<tbody class="divide-y divide-border/60">
											{#each paginatedSessions as s}
												<tr class="hover:bg-muted/30 transition-colors">
													<td class="py-2.5 font-mono font-medium text-foreground">{s.id.substring(0, 8)}...</td>
													<td class="py-2.5">
														{#if s.status === 'active'}
															<span class="text-xs font-medium text-emerald-600 dark:text-emerald-400">Active</span>
														{:else}
															<span class="text-xs text-muted-foreground">Wiped</span>
														{/if}
													</td>
													<td class="py-2.5 font-mono text-muted-foreground truncate max-w-[200px]">{s.workspace_path}</td>
													<td class="py-2.5 text-muted-foreground">{formatTime(s.started_at)}</td>
													<td class="py-2.5 text-muted-foreground">{s.ended_at ? formatTime(s.ended_at) : '—'}</td>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>

								<!-- Mobile Stacked Card View -->
								<div class="block md:hidden divide-y divide-border/60">
									{#each paginatedSessions as s}
										<div class="py-3 first:pt-0 last:pb-0 space-y-1.5 text-xs">
											<div class="flex items-center justify-between">
												<span class="font-mono font-medium text-foreground">{s.id.substring(0, 12)}...</span>
												{#if s.status === 'active'}
													<span class="font-medium text-emerald-600 dark:text-emerald-400">Active</span>
												{:else}
													<span class="text-muted-foreground">Wiped</span>
												{/if}
											</div>
											<div class="text-[11px] font-mono text-muted-foreground truncate" title={s.workspace_path}>
												{s.workspace_path}
											</div>
											<div class="flex items-center justify-between text-[11px] text-muted-foreground">
												<span>Started: {formatTime(s.started_at)}</span>
												<span>Ended: {s.ended_at ? formatTime(s.ended_at) : '—'}</span>
											</div>
										</div>
									{/each}
								</div>

								{#if totalSessionPages > 1}
									<!-- Bottom Pagination Footer -->
									<div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mt-4 border-t border-border text-xs text-muted-foreground">
										<span>
											Showing {(sessionPage - 1) * SESSIONS_PER_PAGE + 1}–{Math.min(sessionPage * SESSIONS_PER_PAGE, sessions.length)} of {sessions.length} sessions
										</span>
										<div class="flex items-center gap-2">
											<button
												type="button"
												onclick={prevSessionPage}
												disabled={sessionPage <= 1}
												class="px-2.5 py-1.5 rounded-lg border border-border hover:bg-muted text-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
											>
												Previous
											</button>
											<span class="px-2 font-medium text-foreground">
												{sessionPage} / {totalSessionPages}
											</span>
											<button
												type="button"
												onclick={nextSessionPage}
												disabled={sessionPage >= totalSessionPages}
												class="px-2.5 py-1.5 rounded-lg border border-border hover:bg-muted text-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
											>
												Next
											</button>
										</div>
									</div>
								{/if}
							{/if}
						</div>
					</div>
				{/if}

				<!-- ======================================================== -->
				<!-- SECTION 2: STAGED INGESTION QUEUE & DELIVERY             -->
				<!-- ======================================================== -->
				{#if activeSection === 'staging'}
					<div class="space-y-4 sm:space-y-6">
						<div class="op-card bg-card border border-border rounded-xl p-4 sm:p-6 shadow-xs">
							<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
								<div>
									<h2 class="text-base sm:text-lg font-semibold text-foreground">Live Customer Ingestions</h2>
									<p class="text-xs text-muted-foreground mt-0.5">
										Incoming customer files verified via Merkle tree-hash notarization and automatically transferred into the active workspace.
									</p>
								</div>
								{#if deliverySuccessMessage}
									<div class="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-1.5 self-start sm:self-auto">
										<CheckCircle2 class="w-3.5 h-3.5 shrink-0" />
										<span>{deliverySuccessMessage}</span>
									</div>
								{/if}
							</div>

							{#if uploads.length === 0}
								<div class="py-12 text-center text-muted-foreground">
									<Inbox class="w-10 h-10 mx-auto mb-2 opacity-40" />
									<p class="text-sm font-medium">No files staged yet</p>
									<p class="text-xs mt-1">Upload a file via the customer ingestion portal or an active drop link.</p>
								</div>
							{:else}
								<!-- Desktop Table View -->
								<div class="hidden md:block overflow-x-auto">
									<table class="w-full text-xs text-left">
										<thead>
											<tr class="border-b border-border text-muted-foreground">
												<th class="pb-2 font-medium">File Name</th>
												<th class="pb-2 font-medium">Size</th>
												<th class="pb-2 font-medium">Drop Code</th>
												<th class="pb-2 font-medium">Status</th>
												<th class="pb-2 font-medium">Tree Hash</th>
												<th class="pb-2 font-medium text-right">Actions</th>
											</tr>
										</thead>
										<tbody class="divide-y divide-border/60">
											{#each uploads as u}
												<tr class="hover:bg-muted/30 transition-colors">
													<td class="py-3 font-semibold text-foreground flex items-center gap-2">
														<FileText class="w-4 h-4 text-primary shrink-0" />
														<span>{u.display_name}</span>
													</td>
													<td class="py-3 text-muted-foreground">{formatBytes(u.declared_size)}</td>
													<td class="py-3 font-mono text-muted-foreground">{u.drop_code}</td>
													<td class="py-3">
														{#if u.status === 'delivered'}
															<span class="text-xs font-medium text-primary">Delivered</span>
														{:else if u.status === 'verified'}
															<span class="text-xs font-medium text-emerald-600 dark:text-emerald-400">Verified</span>
														{:else}
															<span class="text-xs font-medium text-amber-600 dark:text-amber-400">{u.status}</span>
														{/if}
													</td>
													<td class="py-3">
														{#if u.tree_hash}
															<code class="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border" title={u.tree_hash}>
																{u.tree_hash.substring(0, 10)}...
															</code>
														{:else}
															<span class="text-muted-foreground">—</span>
														{/if}
													</td>
													<td class="py-3 text-right">
														<div class="inline-flex items-center gap-1.5">
															{#if u.status === 'delivered' || u.status === 'verified'}
																<button
																	type="button"
																	onclick={() => handleDownloadFile(u.id, u.display_name)}
																	disabled={downloadingUploadId === u.id}
																	class="h-7 px-2.5 rounded-md text-[11px] font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1 shadow-xs"
																	title="Download decrypted document"
																>
																	{#if downloadingUploadId === u.id}
																		<Loader2 class="w-3 h-3 animate-spin" />
																		<span>Downloading...</span>
																	{:else}
																		<Download class="w-3 h-3" />
																		<span>Download</span>
																	{/if}
																</button>
															{/if}
															<button
																type="button"
																onclick={() => openReceiptModal(u)}
																class="h-7 px-2 rounded-md text-[11px] font-medium border border-border text-foreground hover:bg-muted transition-colors cursor-pointer flex items-center gap-1"
																title="View Cryptographic Receipt"
															>
																<ShieldCheck class="w-3 h-3 text-primary" />
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
								<div class="block md:hidden space-y-3">
									{#each uploads as u}
										<div class="p-3.5 rounded-lg border border-border bg-muted/20 space-y-3">
											<div class="flex items-center gap-2 min-w-0">
												<FileText class="w-4 h-4 text-primary shrink-0" />
												<span class="font-semibold text-xs text-foreground truncate">{u.display_name}</span>
											</div>

											<div class="space-y-1.5 text-xs">
												<div class="flex items-center justify-between">
													<span class="text-muted-foreground">Status</span>
													<div>
														{#if u.status === 'delivered'}
															<span class="font-medium text-emerald-600 dark:text-emerald-400">Delivered</span>
														{:else if u.status === 'verified'}
															<span class="font-medium text-primary">Verified</span>
														{:else}
															<span class="font-medium text-amber-600 dark:text-amber-400">{u.status}</span>
														{/if}
													</div>
												</div>
												<div class="flex items-center justify-between">
													<span class="text-muted-foreground">Size</span>
													<span class="text-muted-foreground">{formatBytes(u.declared_size)}</span>
												</div>
												<div class="flex items-center justify-between">
													<span class="text-muted-foreground">Drop Code</span>
													<span class="font-mono text-muted-foreground">{u.drop_code}</span>
												</div>
												<div class="flex items-center justify-between">
													<span class="text-muted-foreground">Tree Hash</span>
													{#if u.tree_hash}
														<code class="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border" title={u.tree_hash}>
															{u.tree_hash.substring(0, 10)}...
														</code>
													{:else}
														<span class="text-muted-foreground">—</span>
													{/if}
												</div>
											</div>

											<div class="pt-1 flex flex-col sm:flex-row gap-2">
												{#if u.status === 'delivered' || u.status === 'verified'}
													<button
														type="button"
														onclick={() => handleDownloadFile(u.id, u.display_name)}
														disabled={downloadingUploadId === u.id}
														class="w-full h-8 px-3 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xs"
													>
														{#if downloadingUploadId === u.id}
															<Loader2 class="w-3.5 h-3.5 animate-spin" />
															<span>Downloading...</span>
														{:else}
															<Download class="w-3.5 h-3.5" />
															<span>Download</span>
														{/if}
													</button>
												{/if}
												<button
													type="button"
													onclick={() => openReceiptModal(u)}
													class="w-full h-8 px-3 rounded-lg text-xs font-medium border border-border text-foreground hover:bg-muted transition-colors cursor-pointer flex items-center justify-center gap-1.5"
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
					</div>
				{/if}

				<!-- ======================================================== -->
				<!-- SECTION 3: DROP PORTALS MANAGEMENT                       -->
				<!-- ======================================================== -->
				{#if activeSection === 'drops'}
					<div class="max-w-xl mx-auto w-full">
						<!-- Main Drop Portal Creation Panel -->
						<div class="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-xs">
							<div class="mb-5">
								<h2 class="text-lg font-bold tracking-tight text-foreground mb-1">Generate Drop Portal</h2>
								<p class="text-xs text-muted-foreground">
									Configure secure ephemeral ingestion parameters including file size limit and cryptographic TTL expiry.
								</p>
							</div>

							<form onsubmit={handleCreateDrop} class="space-y-4">
								<div>
									<label for="droplabel" class="block text-xs font-medium text-foreground mb-1.5">Portal Label</label>
									<input
										id="droplabel"
										type="text"
										bind:value={newDropLabel}
										placeholder="e.g. Counter Drop"
										required
										class="w-full h-9 px-3 rounded-lg text-xs bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
									/>
								</div>
								<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
									<div>
										<label for="dropmax" class="block text-xs font-medium text-foreground mb-1.5">Max Size (MB)</label>
										<input
											id="dropmax"
											type="number"
											bind:value={newDropMaxMb}
											min="1"
											max="500"
											class="w-full h-9 px-3 rounded-lg text-xs bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
										/>
									</div>
									<div>
										<label for="dropttl" class="block text-xs font-medium text-foreground mb-1.5">TTL (Minutes)</label>
										<input
											id="dropttl"
											type="number"
											bind:value={newDropTtlMinutes}
											min="5"
											max="1440"
											class="w-full h-9 px-3 rounded-lg text-xs bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
										/>
									</div>
								</div>
								<button
									type="submit"
									disabled={isCreatingDrop}
									class="w-full h-9 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-xs transition-opacity flex items-center justify-center gap-1.5 cursor-pointer mt-4 disabled:opacity-50"
								>
									<Plus class="w-3.5 h-3.5" />
									<span>{isCreatingDrop ? 'Generating...' : 'Create Drop Portal'}</span>
								</button>
							</form>

							{#if dropCreatedMessage}
								<div class="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
									<CheckCircle2 class="w-4 h-4 shrink-0" />
									<span>{dropCreatedMessage}</span>
								</div>
							{/if}
						</div>
					</div>
				{/if}

				<!-- ======================================================== -->
				<!-- SECTION 4: NODE ENCLAVE & OTA UPDATES                    -->
				<!-- ======================================================== -->
				{#if activeSection === 'node'}
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
						<!-- Node Enclave Status -->
						<div class="op-card bg-card border border-border rounded-xl p-4 sm:p-6 shadow-xs h-full flex flex-col justify-between min-h-0 lg:min-h-[380px] space-y-4">
							<div class="space-y-3.5 sm:space-y-4">
								<div class="flex items-center justify-between">
									<h2 class="text-base font-semibold text-foreground">Node Identity & Hardware Enclave</h2>
								</div>

								<div class="space-y-2 text-xs">
									<div class="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-muted/40 border border-border">
										<span class="text-muted-foreground shrink-0">Device ID</span>
										<code class="font-mono text-foreground truncate text-right max-w-[180px] sm:max-w-none">{systemStatus?.device_id || '—'}</code>
									</div>
									<div class="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-muted/40 border border-border">
										<span class="text-muted-foreground shrink-0">Café Tenant Slug</span>
										<span class="text-foreground truncate text-right">{systemStatus?.cafe_slug || '—'}</span>
									</div>
									<div class="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-muted/40 border border-border">
										<span class="text-muted-foreground shrink-0">Active OS Image File</span>
										<code class="font-mono text-foreground truncate text-right max-w-[180px] sm:max-w-none">{systemStatus?.active_image_file || '—'}</code>
									</div>
									<div class="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-muted/40 border border-border">
										<span class="text-muted-foreground shrink-0">OTA Image Version</span>
										<span class="text-foreground">{systemStatus?.image_version || '—'}</span>
									</div>
								</div>
							</div>

							<div class="pt-2 flex flex-wrap items-center gap-2">
								<button
									type="button"
									onclick={handleTriggerOta}
									disabled={isCheckingOta}
									class="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
								>
									<RefreshCw class="w-3.5 h-3.5 {isCheckingOta ? 'animate-spin' : ''}" />
									<span>{isCheckingOta ? 'Checking OTA Signatures...' : 'Check & Apply Signed OTA Update'}</span>
								</button>
								{#if lastOtaResult}
									<button
										type="button"
										onclick={() => { activeOtaResult = lastOtaResult; showOtaRawJson = false; }}
										class="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
									>
										<span>View Last Result Modal</span>
									</button>
								{/if}
							</div>
						</div>

						<!-- Manager Enrollment -->
						<div class="op-card bg-card border border-border rounded-xl p-4 sm:p-6 shadow-xs h-full flex flex-col justify-between min-h-0 lg:min-h-[380px]">
							<div>
								<h3 class="text-sm font-semibold text-foreground mb-1">Enroll with Central Manager</h3>
								<p class="text-xs text-muted-foreground mb-4">
									Enter an enrollment token issued by the Central Manager to sync logs and updates.
								</p>

								<form onsubmit={handleEnrollNode} class="space-y-3">
									<div>
										<label for="mgrurl" class="block text-xs font-medium text-foreground mb-1">Manager URL</label>
										<input
											id="mgrurl"
											type="text"
											bind:value={enrollManagerUrl}
											placeholder="https://manager.example.com"
											required
											class="w-full h-9 px-3 rounded-lg text-xs bg-background border border-border text-foreground focus:outline-none"
										/>
									</div>
									<div>
										<label for="mgrtoken" class="block text-xs font-medium text-foreground mb-1">Enrollment Token</label>
										<input
											id="mgrtoken"
											type="text"
											bind:value={enrollToken}
											placeholder="e.g. Qr5u_MIs_kHlPvcw..."
											required
											class="w-full h-9 px-3 rounded-lg text-xs bg-background border border-border text-foreground focus:outline-none"
										/>
									</div>
									<button
										type="submit"
										disabled={isEnrolling}
										class="w-full h-9 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer mt-2"
									>
										{isEnrolling ? 'Enrolling...' : 'Enroll Node'}
									</button>
								</form>
							</div>

							{#if enrollMessage}
								<div class="mt-3 p-2.5 rounded-lg bg-muted text-foreground text-xs font-mono border border-border">
									{enrollMessage}
								</div>
							{/if}
						</div>
					</div>
				{/if}

				<!-- ======================================================== -->
				<!-- SECTION 5: STAFF & OPERATOR ACCESS                       -->
				<!-- ======================================================== -->
				{#if activeSection === 'staff'}
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
						<!-- Left: Register Staff -->
						<div class="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-xs h-full flex flex-col justify-between min-h-0 lg:min-h-[380px]">
							<div>
								<h2 class="text-base font-semibold text-foreground mb-1">Add Staff Operator</h2>
								<p class="text-xs text-muted-foreground mb-4">Create operator credentials for local terminal access.</p>

								<form onsubmit={handleCreateStaff} class="space-y-3">
									<div>
										<label for="staffuser" class="block text-xs font-medium text-foreground mb-1">Username</label>
										<input
											id="staffuser"
											type="text"
											bind:value={newStaffUsername}
											placeholder="e.g. operator_2"
											required
											class="w-full h-9 px-3 rounded-lg text-xs bg-background border border-border text-foreground focus:outline-none"
										/>
									</div>
									<div>
										<label for="staffpass" class="block text-xs font-medium text-foreground mb-1">Password</label>
										<input
											id="staffpass"
											type="password"
											bind:value={newStaffPassword}
											placeholder="••••••••••••"
											required
											class="w-full h-9 px-3 rounded-lg text-xs bg-background border border-border text-foreground focus:outline-none"
										/>
									</div>
									<button
										type="submit"
										disabled={isCreatingStaff}
										class="w-full h-9 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer mt-2"
									>
										{isCreatingStaff ? 'Creating...' : 'Register Operator'}
									</button>
								</form>
							</div>

							{#if staffMessage}
								<p class="text-xs text-primary mt-3">{staffMessage}</p>
							{/if}
						</div>

						<!-- Right: Staff List -->
						<div class="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-xs h-full flex flex-col justify-between min-h-0 lg:min-h-[380px]">
							<div class="flex-1">
								<h3 class="text-sm font-semibold text-foreground mb-1">Authorized Operators</h3>
								<p class="text-xs text-muted-foreground mb-4">Personnel authorized to operate this local terminal node.</p>

								{#if users.length === 0}
									<div class="py-12 sm:py-16 text-center text-muted-foreground flex flex-col items-center justify-center">
										<Users class="w-8 h-8 opacity-30 mb-2" />
										<p class="text-xs">No additional operators registered.</p>
										<p class="text-[11px] text-muted-foreground/70 mt-0.5">Use the registration form on the left to add staff.</p>
									</div>
								{:else}
									<div class="space-y-2">
										{#each users as u}
											<div class="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
												<div class="flex items-center gap-2.5 min-w-0">
													<div class="w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
														{u.username.charAt(0).toUpperCase()}
													</div>
													<div class="min-w-0">
														<span class="text-xs font-semibold text-foreground block truncate">{u.username}</span>
														<span class="text-[10px] text-muted-foreground uppercase">{u.role}</span>
													</div>
												</div>
												<span class="text-xs font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
													Authorized
												</span>
											</div>
										{/each}
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/if}

			</div>
		</main>

<!-- ======================================================== -->
<!-- MODAL: VERIFIED WIPE OBLITERATION                        -->
<!-- ======================================================== -->
{#if wipeModalOpen && currentSession}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
		<div class="bg-card border border-destructive/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
			<div class="flex items-center gap-3 text-destructive">
				<div class="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
					<AlertTriangle class="w-5 h-5" />
				</div>
				<div>
					<h3 class="font-bold text-foreground">Confirm Ephemeral Obliteration</h3>
					<p class="text-xs text-muted-foreground">Session ID: {currentSession.session_id.substring(0, 8)}</p>
				</div>
			</div>

			<p class="text-xs text-muted-foreground leading-relaxed">
				Obliterating this session will execute verified cryptographic shredding: all staged AES-256 keys (DEKs) are erased, workspace directories are removed, and zero citizen data remains on the node.
			</p>

			<div class="flex items-center justify-end gap-2 pt-2">
				<button
					type="button"
					onclick={() => (wipeModalOpen = false)}
					class="h-8 px-3 rounded-lg text-xs font-medium border border-border text-foreground hover:bg-muted cursor-pointer"
				>
					Cancel
				</button>
				<button
					type="button"
					onclick={async () => { wipeModalOpen = false; await handleEndSession(); }}
					disabled={isWiping}
					class="h-8 px-4 rounded-lg text-xs font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer shadow-xs"
				>
					{isWiping ? 'Obliterating...' : 'Confirm & Obliterate'}
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- ======================================================== -->
<!-- MODAL: CRYPTOGRAPHIC RECEIPT VIEWER                     -->
<!-- ======================================================== -->
{#if activeReceipt}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
		<div class="bg-card border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
			<div class="flex items-center justify-between pb-2 border-b border-border">
				<div class="flex items-center gap-2">
					<ShieldCheck class="w-5 h-5 text-emerald-500" />
					<h3 class="font-bold text-foreground text-sm">Notarized Cryptographic Receipt</h3>
				</div>
				<button
					type="button"
					onclick={() => (activeReceipt = null)}
					class="text-muted-foreground hover:text-foreground cursor-pointer"
				>
					<X class="w-4 h-4" />
				</button>
			</div>

			{#if receiptLoading}
				<div class="py-8 flex flex-col items-center justify-center gap-2 text-muted-foreground text-xs">
					<Loader2 class="w-6 h-6 animate-spin text-primary" />
					<span>Fetching cryptographic receipt from transparency log...</span>
				</div>
			{:else}
				<div class="space-y-3 text-xs">
					<div>
						<span class="text-muted-foreground block">Document Name</span>
						<span class="font-semibold text-foreground text-sm">{activeReceipt.display_name}</span>
					</div>
					<div>
						<span class="text-muted-foreground block">Upload ID</span>
						<code class="font-mono text-foreground font-semibold">{activeReceipt.id}</code>
					</div>
					<div>
						<span class="text-muted-foreground block">Tree Hash</span>
						<div class="flex items-center gap-1.5 mt-0.5">
							<code class="font-mono text-emerald-500 break-all">{activeReceipt.tree_hash || activeReceipt.receipt?.tree_hash || 'Verified'}</code>
							{#if activeReceipt.tree_hash || activeReceipt.receipt?.tree_hash}
								<button
									type="button"
									onclick={() => copyText(activeReceipt?.tree_hash || activeReceipt?.receipt?.tree_hash || '', 'modal-hash')}
									class="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
									title="Copy tree hash"
								>
									{#if copiedKey === 'modal-hash'}
										<Check class="w-3.5 h-3.5 text-emerald-500" />
									{:else}
										<Copy class="w-3.5 h-3.5" />
									{/if}
								</button>
							{/if}
						</div>
					</div>
					<div>
						<span class="text-muted-foreground block">Manager Ack Sequence</span>
						<span class="font-bold text-foreground">#{activeReceipt.manager_ack_seq || (activeReceipt.receipt as any)?.manager_ack_seq || 1}</span>
					</div>
					{#if activeReceipt.receipt}
						<div>
							<span class="text-muted-foreground block">Raw Notarized JSON</span>
							<pre class="font-mono text-[10px] p-3 rounded-lg bg-muted overflow-x-auto text-muted-foreground border border-border max-h-36">{JSON.stringify(activeReceipt.receipt, null, 2)}</pre>
						</div>
					{/if}
				</div>
			{/if}

			<div class="flex items-center justify-end gap-2 pt-2 border-t border-border">
				{#if activeReceipt.receipt}
					<button
						type="button"
						onclick={() => {
							const jsonStr = JSON.stringify(activeReceipt?.receipt, null, 2);
							const blob = new Blob([jsonStr], { type: 'application/json' });
							const url = URL.createObjectURL(blob);
							const a = document.createElement('a');
							a.href = url;
							a.download = `receipt-${activeReceipt?.id}.json`;
							a.click();
							URL.revokeObjectURL(url);
						}}
						class="h-8 px-3 rounded-lg text-xs font-medium border border-border hover:bg-muted text-foreground transition-colors cursor-pointer flex items-center gap-1.5"
					>
						<FileDown class="w-3.5 h-3.5" />
						<span>Download Receipt (.json)</span>
					</button>
				{/if}
				<button
					type="button"
					onclick={() => (activeReceipt = null)}
					class="h-8 px-4 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 cursor-pointer"
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- ======================================================== -->
<!-- MODAL: OTA UPDATE RESULT VIEWER                          -->
<!-- ======================================================== -->
{#if activeOtaResult}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
	>
		<div class="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 text-card-foreground shadow-2xl space-y-4">
			<!-- Header following Shadcn DialogHeader & Typography -->
			<div class="flex items-start justify-between gap-4 pb-3 border-b border-border">
				<div class="flex flex-col space-y-1.5 text-left">
					<div class="flex items-center gap-2">
						{#if activeOtaResult.status === 'applied'}
							<CheckCircle2 class="w-5 h-5 text-emerald-500 shrink-0" />
						{:else if activeOtaResult.status === 'up_to_date'}
							<ShieldCheck class="w-5 h-5 text-primary shrink-0" />
						{:else if activeOtaResult.status === 'rejected'}
							<ShieldAlert class="w-5 h-5 text-destructive shrink-0" />
						{:else}
							<AlertTriangle class="w-5 h-5 text-amber-500 shrink-0" />
						{/if}
						<h3 class="text-lg font-semibold leading-none tracking-tight text-foreground">
							{activeOtaResult.title}
						</h3>
					</div>
					<p class="text-sm text-muted-foreground">
						{activeOtaResult.description}
					</p>
				</div>
				<button
					type="button"
					onclick={() => (activeOtaResult = null)}
					class="rounded-sm opacity-70 transition-opacity hover:opacity-100 text-muted-foreground hover:text-foreground cursor-pointer"
				>
					<X class="w-4 h-4" />
					<span class="sr-only">Close</span>
				</button>
			</div>

			<!-- Body with Shadcn Typography & Layout -->
			<div class="space-y-3 py-1">
				<div class="flex items-center justify-between py-1 border-b border-border/50">
					<span class="text-xs font-medium text-muted-foreground">Execution Status</span>
					{#if activeOtaResult.status === 'applied'}
						<span class="inline-flex items-center rounded-full border border-transparent bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
							Update Applied
						</span>
					{:else if activeOtaResult.status === 'up_to_date'}
						<span class="inline-flex items-center rounded-full border border-transparent bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
							Up to Date
						</span>
					{:else if activeOtaResult.status === 'rejected'}
						<span class="inline-flex items-center rounded-full border border-transparent bg-destructive/15 px-2.5 py-0.5 text-xs font-semibold text-destructive">
							Signature Rejected
						</span>
					{:else}
						<span class="inline-flex items-center rounded-full border border-transparent bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
							{activeOtaResult.status.toUpperCase()}
						</span>
					{/if}
				</div>

				{#if activeOtaResult.previous_version || activeOtaResult.new_version}
					<div class="grid grid-cols-2 gap-3 py-1 border-b border-border/50">
						<div>
							<span class="text-xs font-medium text-muted-foreground block">Previous Image</span>
							<span class="text-sm font-semibold text-foreground">{activeOtaResult.previous_version || '—'}</span>
						</div>
						<div>
							<span class="text-xs font-medium text-muted-foreground block">Target Release</span>
							<span class="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{activeOtaResult.new_version || '—'}</span>
						</div>
					</div>
				{/if}

				{#if activeOtaResult.current_image_version}
					<div class="flex items-center justify-between py-1 border-b border-border/50">
						<span class="text-xs font-medium text-muted-foreground">Active Image Version</span>
						<span class="text-sm font-semibold text-foreground">{activeOtaResult.current_image_version}</span>
					</div>
				{/if}

				{#if activeOtaResult.active_image_file}
					<div class="flex items-center justify-between py-1 border-b border-border/50">
						<span class="text-xs font-medium text-muted-foreground">Activated Image Binary</span>
						<code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-semibold text-foreground">
							{activeOtaResult.active_image_file}
						</code>
					</div>
				{/if}

				{#if activeOtaResult.sha256}
					<div class="py-1 border-b border-border/50 space-y-1">
						<div class="flex items-center justify-between">
							<span class="text-xs font-medium text-muted-foreground">Artifact SHA-256 Digest</span>
							<button
								type="button"
								onclick={() => copyText(activeOtaResult?.sha256 || '', 'ota-hash')}
								class="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 cursor-pointer"
							>
								{#if copiedKey === 'ota-hash'}
									<Check class="w-3 h-3 text-emerald-500" />
									<span class="text-emerald-500 text-[11px]">Copied</span>
								{:else}
									<Copy class="w-3 h-3" />
									<span class="text-[11px]">Copy Hash</span>
								{/if}
							</button>
						</div>
						<div class="rounded-md bg-muted p-2 font-mono text-[11px] text-foreground break-all">
							{activeOtaResult.sha256}
						</div>
					</div>
				{/if}

				{#if activeOtaResult.reason}
					<div class="py-1 border-b border-border/50">
						<span class="text-xs font-medium text-muted-foreground block">Failure Detail</span>
						<p class="text-sm text-destructive mt-0.5 font-medium">{activeOtaResult.reason}</p>
					</div>
				{/if}

				{#if activeOtaResult.message}
					<div class="py-1 border-b border-border/50">
						<span class="text-xs font-medium text-muted-foreground block">Manager Notice</span>
						<p class="text-sm text-foreground mt-0.5">{activeOtaResult.message}</p>
					</div>
				{/if}

				<div class="flex items-center justify-between py-1 border-b border-border/50">
					<span class="text-xs font-medium text-muted-foreground">Timestamp</span>
					<span class="text-xs font-mono text-muted-foreground">{activeOtaResult.timestamp}</span>
				</div>

				{#if activeOtaResult.rawJson}
					<div class="pt-1">
						<button
							type="button"
							onclick={() => (showOtaRawJson = !showOtaRawJson)}
							class="text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1 cursor-pointer"
						>
							<span>{showOtaRawJson ? 'Hide Raw Details' : 'Inspect Raw Response JSON'}</span>
						</button>
						{#if showOtaRawJson}
							<pre class="mt-2 relative rounded-md bg-muted p-3 font-mono text-[11px] text-muted-foreground overflow-x-auto max-h-36 border border-border">{activeOtaResult.rawJson}</pre>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Footer following Shadcn DialogFooter -->
			<div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-3 border-t border-border">
				<button
					type="button"
					onclick={() => (activeOtaResult = null)}
					class="inline-flex items-center justify-center rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 h-9 px-4 transition-opacity cursor-pointer"
				>
					Dismiss
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- ======================================================== -->
<!-- MODAL: EXPANDED SESSION LEDGER VIEWER                    -->
<!-- ======================================================== -->
{#if ledgerModalOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-xs"
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		onclick={(e) => { if (e.target === e.currentTarget) ledgerModalOpen = false; }}
		onkeydown={(e) => { if (e.key === 'Escape') ledgerModalOpen = false; }}
	>
		<div class="bg-card border border-border rounded-xl max-w-4xl w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden">
			<!-- Modal Header -->
			<div class="p-6 border-b border-border flex items-center justify-between shrink-0">
				<div>
					<h3 class="text-sm font-semibold text-foreground">
						Session Ledger
					</h3>
					<p class="text-xs text-muted-foreground mt-0.5">
						{sessions.length} total sessions recorded on this node.
					</p>
				</div>

				<button
					type="button"
					onclick={() => (ledgerModalOpen = false)}
					class="text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-md hover:bg-muted transition-colors"
					aria-label="Close dialog"
				>
					<X class="w-4 h-4" />
				</button>
			</div>

			<!-- Modal Body (Scrollable table matching the exact box table design) -->
			<div class="flex-1 overflow-y-auto p-6 max-h-[60vh]">
				{#if sessions.length === 0}
					<p class="text-xs text-muted-foreground py-4 text-center">No sessions recorded on this node yet.</p>
				{:else}
					<div class="overflow-x-auto">
						<table class="w-full text-xs text-left">
							<thead class="sticky top-0 bg-card z-10">
								<tr class="border-b border-border text-muted-foreground">
									<th class="pb-2 font-medium">Session ID</th>
									<th class="pb-2 font-medium">Status</th>
									<th class="pb-2 font-medium">Workspace Path</th>
									<th class="pb-2 font-medium">Started</th>
									<th class="pb-2 font-medium">Ended</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-border/60">
								{#each sessions as s}
									<tr class="hover:bg-muted/30 transition-colors">
										<td class="py-2.5 font-mono font-medium text-foreground">{s.id}</td>
										<td class="py-2.5">
											{#if s.status === 'active'}
												<span class="text-xs font-medium text-emerald-600 dark:text-emerald-400">Active</span>
											{:else}
												<span class="text-xs text-muted-foreground">Wiped</span>
											{/if}
										</td>
										<td class="py-2.5 font-mono text-muted-foreground truncate max-w-[240px]" title={s.workspace_path}>{s.workspace_path}</td>
										<td class="py-2.5 text-muted-foreground">{formatTime(s.started_at)}</td>
										<td class="py-2.5 text-muted-foreground">{s.ended_at ? formatTime(s.ended_at) : '—'}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</div>

			<!-- Modal Footer -->
			<div class="p-4 px-6 border-t border-border flex items-center justify-end shrink-0">
				<button
					type="button"
					onclick={() => (ledgerModalOpen = false)}
					class="h-8 px-4 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}

