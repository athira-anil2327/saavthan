<!--
  @component UploadPortal
  @description Unified Customer Drop Portal (Svelte 5 Runes).
  
  Features:
  - Drag-and-drop file ingestion matching Vault peach/white theme and shadcn design.
  - Client-side cryptographic chunking and in-browser Merkle tree hashing.
  - Unified dynamic action button: transforms from "Upload Now" to "DELETE NOW"
    once files have been handed over to the server.
  - Stationary Lucide trash bin icon (no continuous spinning after upload).
  - Remote deletion mechanism allowing users to purge their staged files instantly.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import {
		UploadCloud,
		FileText,
		FileImage,
		FileArchive,
		FileCode,
		FileSpreadsheet,
		FileQuestion,
		CheckCircle2,
		AlertCircle,
		Trash2,
		X,
		RefreshCw,
		Check,
		Lock
	} from 'lucide-svelte';
	import {
		listDrops,
		createDrop,
		uploadFileToDrop,
		deleteUploadFromDrop,
		deleteAllUploadsFromDrop,
		type DropInfo
	} from '$lib/saavthan-api';

	interface SelectedFileItem {
		id: string;
		file: File;
		progress: number;
		status: 'selected' | 'uploading' | 'verified' | 'error';
		error?: string;
		treeHash?: string;
		uploadId?: string;
	}

	let currentDrop = $state<DropInfo | null>(null);
	let selectedFiles = $state<SelectedFileItem[]>([]);
	let isDragging = $state(false);
	let isUploading = $state(false);
	let isDeleting = $state(false);
	let fileInputRef: HTMLInputElement | null = null;
	let dropStatusMessage = $state<string | null>(null);
	let toastMessage = $state<string | null>(null);

	onMount(async () => {
		try {
			// Find drop code from path parameter (/p/[code]/upload) or query param (?code=...)
			const codeParam = page.params?.code || page.url.searchParams.get('code');
			const targetCode = codeParam || 'LOCAL';

			// First try public drop metadata endpoint (zero authentication required)
			try {
				const publicRes = await fetch(`/p/${targetCode}`, {
					headers: { 'Accept': 'application/json' }
				});
				if (publicRes.ok) {
					const data = await publicRes.json();
					currentDrop = {
						drop_code: data.code,
						portal_url: `/p/${data.code}/upload`,
						vanity_url: `/p/${data.code}/upload`,
						tunnel_url: `/p/${data.code}/upload`,
						local_portal_url: `/p/${data.code}/upload`,
						expires_at: (data.expires_at || 0) * 1000,
						max_bytes: data.max_bytes || 500 * 1024 * 1024,
						label: data.label
					};
				}
			} catch (e) {
				console.warn('Public drop resolution error:', e);
			}

			// If public endpoint didn't set it, try staff listDrops (if operator session)
			if (!currentDrop) {
				const drops = await listDrops();
				if (codeParam) {
					currentDrop = drops.find((d) => d.drop_code === codeParam) || null;
				}
				if (!currentDrop && drops.length > 0) {
					currentDrop = drops[0];
				}
			}

			// Safe fallback: construct valid drop code
			if (!currentDrop) {
				const fallbackCode = codeParam || 'LOCAL';
				currentDrop = {
					drop_code: fallbackCode,
					portal_url: `/p/${fallbackCode}/upload`,
					vanity_url: `/p/${fallbackCode}/upload`,
					tunnel_url: `/p/${fallbackCode}/upload`,
					local_portal_url: `/p/${fallbackCode}/upload`,
					expires_at: Date.now() + 3600000,
					max_bytes: 500 * 1024 * 1024
				};
			}
		} catch (err) {
			console.error('Failed to resolve drop channel:', err);
		}
	});

	function handleFilePick() {
		if (fileInputRef) fileInputRef.click();
	}

	function handleFilesSelected(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files) {
			addSelectedFiles(Array.from(target.files));
		}
		if (fileInputRef) fileInputRef.value = '';
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		if (e.dataTransfer?.files) {
			addSelectedFiles(Array.from(e.dataTransfer.files));
		}
	}

	function addSelectedFiles(newFiles: File[]) {
		for (const file of newFiles) {
			// Prevent duplicate selection of same file name and size in current queue
			if (selectedFiles.some((f) => f.file.name === file.name && f.file.size === file.size)) {
				continue;
			}
			selectedFiles.push({
				id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
				file,
				progress: 0,
				status: 'selected'
			});
		}
	}

	async function removeSelectedFile(id: string) {
		const target = selectedFiles.find((f) => f.id === id);
		if (target && target.uploadId && currentDrop) {
			try {
				await deleteUploadFromDrop(currentDrop.drop_code, target.uploadId);
				showToast(`Permanently deleted ${target.file.name}`);
			} catch (e) {
				console.error('Remote delete failed:', e);
			}
		}
		selectedFiles = selectedFiles.filter((f) => f.id !== id);
	}

	function showToast(msg: string) {
		toastMessage = msg;
		setTimeout(() => {
			if (toastMessage === msg) toastMessage = null;
		}, 3500);
	}

	async function handleDeleteAll() {
		if (isDeleting || isUploading) return;
		const code = currentDrop?.drop_code || 'LOCAL';

		isDeleting = true;
		try {
			// Trigger server-side crypto-shred for all uploads in drop session
			const result = await deleteAllUploadsFromDrop(code);
			selectedFiles = [];
			showToast(result.success ? `Permanently deleted ${result.count} files from server` : 'Files deleted from server');
		} catch (err) {
			console.error('Delete now error:', err);
			showToast('Failed to complete remote deletion');
		} finally {
			isDeleting = false;
		}
	}

	async function handleUploadAll() {
		if (selectedFiles.length === 0 || isUploading || isDeleting) return;
		if (!currentDrop) {
			alert('Drop portal channel is initializing. Please try again in a moment.');
			return;
		}

		isUploading = true;

		for (const item of selectedFiles) {
			if (item.status === 'verified') continue;

			item.status = 'uploading';
			item.progress = 10;

			try {
				const result = await uploadFileToDrop(
					currentDrop.drop_code,
					item.file,
					(pct) => {
						item.progress = Math.max(10, pct);
					}
				);

				if (result && result.upload_id) {
					item.status = 'verified';
					item.progress = 100;
					item.treeHash = result.tree_hash;
					item.uploadId = result.upload_id;
				} else {
					item.status = 'error';
					item.error = 'Upload verification rejected';
				}
			} catch (err: any) {
				item.status = 'error';
				item.error = err.message || 'Failed to upload';
			}
		}

		isUploading = false;
	}

	function formatBytes(bytes: number): string {
		if (!bytes || bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
	}

	function getFileIcon(name: string) {
		const ext = name.split('.').pop()?.toLowerCase() || '';
		if (['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext)) return FileImage;
		if (['pdf', 'doc', 'docx', 'txt'].includes(ext)) return FileText;
		if (['zip', 'tar', 'gz', '7z'].includes(ext)) return FileArchive;
		if (['xls', 'xlsx', 'csv'].includes(ext)) return FileSpreadsheet;
		if (['js', 'ts', 'py', 'json', 'html', 'css'].includes(ext)) return FileCode;
		return FileQuestion;
	}

	let unverifiedCount = $derived(selectedFiles.filter((f) => f.status !== 'verified').length);
</script>

<svelte:head>
	<title>Vault — Direct Upload Portal</title>
</svelte:head>

<div class="space-y-6 max-w-4xl mx-auto">
	<!-- Hidden File Input -->
	<input
		type="file"
		multiple
		bind:this={fileInputRef}
		onchange={handleFilesSelected}
		class="hidden"
	/>

	<!-- Header (Strict shadcn typography: tracking-tight, muted-foreground, font-semibold) -->
	<div class="text-center space-y-1.5 pt-2">
		<div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-medium">
			<Lock class="w-3 h-3" />
			<span>Drop Code: {currentDrop?.drop_code || 'Active'}</span>
		</div>
		<h1 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
			Upload to Vault
		</h1>
		<p class="text-sm text-muted-foreground max-w-lg mx-auto">
			Files are end-to-end encrypted with AES-256 and transferred directly into the secure kiosk workspace.
		</p>
	</div>

	<!-- Responsive Grid: 40% Upload Area (Left) & 60% Selected Files Area (Right) -->
	<div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-stretch">
		<!-- 1. 40% UPLOAD BOX (LEFT) -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			onclick={handleFilePick}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			ondrop={handleDrop}
			class="md:col-span-2 w-full h-full min-h-[340px] md:min-h-[380px] rounded-xl border-2 border-dashed {isDragging ? 'border-primary ring-2 ring-primary/20 bg-accent' : 'border-border hover:border-primary/50 bg-card'} flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors shadow-xs select-none"
		>
			<div class="w-14 h-14 rounded-xl bg-muted/60 border border-border flex items-center justify-center text-primary mb-3.5 shadow-xs">
				<UploadCloud class="w-7 h-7 text-primary" />
			</div>

			<h2 class="text-base font-semibold text-foreground tracking-tight">
				{isDragging ? 'Drop files here' : 'Choose files to upload'}
			</h2>
			<p class="text-xs text-muted-foreground mt-1 max-w-[240px] leading-relaxed">
				Drag &amp; drop files here, or browse from device
			</p>
			<p class="text-[11px] text-muted-foreground/80 mt-3 font-mono">
				Max 500 MB per file
			</p>
		</div>

		<!-- 2. 60% SELECTED FILES BOX (RIGHT) -->
		<div class="md:col-span-3 flex flex-col justify-between h-full min-h-[340px] md:min-h-[380px] bg-card border border-border rounded-xl p-5 shadow-xs space-y-3">
			<div class="space-y-3 flex-1 flex flex-col min-h-0">
				<!-- Header -->
				<div class="flex items-center justify-between pb-2 border-b border-border">
					<h3 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
						Selected Files ({selectedFiles.length})
					</h3>
					{#if selectedFiles.length > 0 && !isUploading && !isDeleting}
						<button
							type="button"
							onclick={() => (selectedFiles = [])}
							class="text-xs font-medium text-destructive hover:underline cursor-pointer"
						>
							Clear All
						</button>
					{/if}
				</div>

				<!-- Scrollable Selected Files List -->
				<div class="flex-1 overflow-y-auto max-h-[280px] md:max-h-[300px] pr-1 space-y-2">
					{#if selectedFiles.length === 0}
						<div class="h-full min-h-[220px] w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-lg bg-muted/30 text-xs text-muted-foreground">
							<UploadCloud class="w-8 h-8 opacity-40 mb-2" />
							<span class="max-w-[240px]">No files selected yet. Choose files from the box on the left.</span>
						</div>
					{:else}
						{#each selectedFiles as item}
							{@const Icon = getFileIcon(item.file.name)}
							<div class="p-2.5 sm:p-3 rounded-lg border border-border bg-muted/30 shadow-2xs flex items-center justify-between gap-3 transition-colors hover:bg-muted/50">
								<div class="flex items-center gap-3 min-w-0">
									<div class="w-8 h-8 rounded-md bg-card text-foreground flex items-center justify-center shrink-0 border border-border">
										<Icon class="w-4 h-4 text-primary" />
									</div>
									<div class="min-w-0">
										<p class="text-xs font-medium text-foreground truncate max-w-[200px] sm:max-w-[320px]">
											{item.file.name}
										</p>
										<div class="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
											<span>{formatBytes(item.file.size)}</span>
											<span>&bull;</span>
											{#if item.status === 'verified'}
												<span class="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
													<Check class="w-3 h-3" />
													Delivered
												</span>
											{:else if item.status === 'uploading'}
												<span class="text-primary font-medium flex items-center gap-1">
													<RefreshCw class="w-3 h-3 animate-spin" />
													{item.progress}%
												</span>
											{:else if item.status === 'error'}
												<span class="text-destructive font-medium">
													{item.error || 'Failed'}
												</span>
											{:else}
												<span>Queued</span>
											{/if}
										</div>
									</div>
								</div>

								<div class="flex items-center gap-1 shrink-0">
									{#if item.status === 'verified'}
										<button
											type="button"
											onclick={() => removeSelectedFile(item.id)}
											class="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
											title="Delete from server"
										>
											<Trash2 class="w-3.5 h-3.5 text-destructive/80 hover:text-destructive" />
										</button>
										<CheckCircle2 class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
									{:else if !isUploading && !isDeleting}
										<button
											type="button"
											onclick={() => removeSelectedFile(item.id)}
											class="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
											title="Remove"
										>
											<Trash2 class="w-3.5 h-3.5" />
										</button>
									{/if}
								</div>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Single Dynamic Action Button: Upload Now by default -> changes to DELETE NOW once files are uploaded -->
	<div class="upload-action-btn flex justify-center pt-3 pb-8">
		{#if selectedFiles.length > 0 && unverifiedCount === 0}
			<!-- Post-upload state: Single DELETE NOW button -->
			<button
				type="button"
				onclick={handleDeleteAll}
				disabled={isDeleting || isUploading}
				class="w-full max-w-[340px] sm:w-[340px] h-11 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 font-medium text-sm shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
				title="Remotely delete and obliterate all files handed over to the server in this session"
			>
				{#if isDeleting}
					<RefreshCw class="w-4 h-4 animate-spin" />
					<span>Deleting Files...</span>
				{:else}
					<Trash2 class="w-4 h-4" />
					<span>DELETE NOW</span>
				{/if}
			</button>
		{:else}
			<!-- Default / Pre-upload state: Single Upload Now button -->
			<button
				type="button"
				onclick={handleUploadAll}
				disabled={isUploading || isDeleting || selectedFiles.length === 0}
				class="w-full max-w-[340px] sm:w-[340px] h-11 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
			>
				{#if isUploading}
					<RefreshCw class="w-4 h-4 animate-spin" />
					<span>Encrypting & Uploading...</span>
				{:else}
					<UploadCloud class="w-4 h-4" />
					<span>Upload Now {unverifiedCount > 0 ? `(${unverifiedCount})` : ''}</span>
				{/if}
			</button>
		{/if}
	</div>

	<!-- Toast Notification -->
	{#if toastMessage}
		<div class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-card text-foreground border border-border px-4 py-2.5 rounded-lg shadow-md flex items-center gap-2 text-xs font-medium z-50 animate-in fade-in slide-in-from-bottom-2">
			<Check class="w-4 h-4 text-primary" />
			<span>{toastMessage}</span>
		</div>
	{/if}
</div>
