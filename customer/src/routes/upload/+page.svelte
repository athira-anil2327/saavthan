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
		Check
	} from 'lucide-svelte';
	import {
		listDrops,
		createDrop,
		uploadFileToDrop,
		type DropInfo
	} from '#lib/saavthan-api';

	interface SelectedFileItem {
		id: string;
		file: File;
		progress: number;
		status: 'selected' | 'uploading' | 'verified' | 'error';
		error?: string;
		treeHash?: string;
	}

	let currentDrop = $state<DropInfo | null>(null);
	let selectedFiles = $state<SelectedFileItem[]>([]);
	let isDragging = $state(false);
	let isUploading = $state(false);
	let fileInputRef: HTMLInputElement | null = null;

	onMount(async () => {
		try {
			// Find drop from URL query or fetch active
			const codeParam = page.url.searchParams.get('code');
			const drops = await listDrops();
			if (codeParam) {
				currentDrop = drops.find((d) => d.drop_code === codeParam) || null;
			}
			if (!currentDrop && drops.length > 0) {
				currentDrop = drops[0];
			}
			if (!currentDrop) {
				currentDrop = await createDrop('Customer Portal Drop');
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

	function removeSelectedFile(id: string) {
		selectedFiles = selectedFiles.filter((f) => f.id !== id);
	}

	async function handleUploadAll() {
		if (selectedFiles.length === 0 || isUploading) return;
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

<div class="space-y-6">
	<!-- Hidden File Input -->
	<input
		type="file"
		multiple
		bind:this={fileInputRef}
		onchange={handleFilesSelected}
		class="hidden"
	/>

	<!-- Header -->
	<div class="upload-header text-center space-y-1">
		<h1 class="text-2xl font-bold tracking-tight text-foreground">
			Upload to Vault
		</h1>
		<p class="text-xs text-muted-foreground">
			Files are end-to-end encrypted with AES-256 and signed with Ed25519 tree-hashes.
		</p>
	</div>

	<!-- Responsive Grid: 40% Upload Area (Left) & 60% Selected Files Area (Right) -->
	<div class="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
		<!-- 1. 40% UPLOAD BOX (LEFT) -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			onclick={handleFilePick}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			ondrop={handleDrop}
			class="upload-panel md:col-span-2 w-full h-full min-h-[360px] md:min-h-[420px] rounded-2xl border-2 border-dashed {isDragging ? 'border-primary ring-2 ring-primary/20 scale-[0.99]' : 'border-border hover:border-primary/60'} bg-gradient-to-b from-muted/80 via-muted/40 to-background flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all shadow-xs select-none"
		>
			<!-- Standard Upload Sign -->
			<div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-card border border-border flex items-center justify-center text-primary mb-4 shadow-sm transition-transform hover:scale-105">
				<UploadCloud class="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
			</div>

			<h2 class="text-base sm:text-lg font-bold text-foreground tracking-tight">
				{isDragging ? 'Drop files here' : 'Choose files to upload'}
			</h2>
			<p class="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-[260px] leading-relaxed">
				Tap here or drag & drop documents, photos, or archives
			</p>
			<p class="text-[11px] text-muted-foreground/80 mt-3 font-mono">
				Max 500 MB per file
			</p>
		</div>

		<!-- 2. 60% SELECTED FILES BOX (RIGHT) -->
		<div class="upload-panel md:col-span-3 flex flex-col justify-between h-full min-h-[360px] md:min-h-[420px] bg-card border border-border rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
			<div class="space-y-4 flex-1 flex flex-col min-h-0">
				<!-- Header -->
				<div class="flex items-center justify-between pb-2 border-b border-border/60">
					<h3 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
						Selected Files ({selectedFiles.length})
					</h3>
					{#if selectedFiles.length > 0 && !isUploading}
						<button
							type="button"
							onclick={() => (selectedFiles = [])}
							class="text-xs text-destructive hover:underline cursor-pointer"
						>
							Clear All
						</button>
					{/if}
				</div>

				<!-- Scrollable Selected Files List -->
				<div class="flex-1 overflow-y-auto max-h-[300px] md:max-h-[340px] pr-1 space-y-2.5">
					{#if selectedFiles.length === 0}
						<div class="h-full min-h-[240px] w-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-border/70 rounded-xl bg-muted/10 text-xs sm:text-sm text-muted-foreground">
							<UploadCloud class="w-10 h-10 opacity-30 mb-3" />
							<span class="max-w-[280px] leading-relaxed">No files selected yet. Click or drop files into the upload box on the left.</span>
						</div>
					{:else}
						{#each selectedFiles as item}
							{@const Icon = getFileIcon(item.file.name)}
							<div class="p-3 sm:p-3.5 rounded-xl border border-border bg-muted/30 shadow-xs flex items-center justify-between gap-3">
								<div class="flex items-center gap-3 min-w-0">
									<div class="w-8 h-8 rounded-lg bg-card text-foreground flex items-center justify-center shrink-0 border border-border">
										<Icon class="w-4 h-4 text-primary" />
									</div>
									<div class="min-w-0">
										<p class="text-xs sm:text-sm font-medium text-foreground truncate max-w-[220px] sm:max-w-[340px]">
											{item.file.name}
										</p>
										<div class="flex items-center gap-2 text-[11px] sm:text-xs text-muted-foreground mt-0.5">
											<span>{formatBytes(item.file.size)}</span>
											{#if item.status === 'verified'}
												<span class="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
													<Check class="w-3.5 h-3.5" />
													Verified
												</span>
											{:else if item.status === 'uploading'}
												<span class="text-primary font-medium flex items-center gap-1">
													<RefreshCw class="w-3.5 h-3.5 animate-spin" />
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

								<div class="flex items-center gap-1.5 shrink-0">
									{#if item.status === 'verified'}
										<CheckCircle2 class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
									{:else if !isUploading}
										<button
											type="button"
											onclick={() => removeSelectedFile(item.id)}
											class="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
											title="Remove selected file"
										>
											<Trash2 class="w-4 h-4" />
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

	<!-- Centered Upload Files Button Directly Below Both Boxes (320px-380px wide) -->
	<div class="upload-action-btn flex justify-center pt-3 pb-8">
		<button
			type="button"
			onclick={handleUploadAll}
			disabled={isUploading || selectedFiles.length === 0 || unverifiedCount === 0}
			class="w-full max-w-[360px] sm:w-[360px] h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm shadow-xs hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-50"
		>
			{#if isUploading}
				<RefreshCw class="w-4 h-4 animate-spin" />
				<span>Encrypting & Uploading...</span>
			{:else if selectedFiles.length > 0 && unverifiedCount === 0}
				<CheckCircle2 class="w-4 h-4" />
				<span>All Files Uploaded</span>
			{:else}
				<UploadCloud class="w-4 h-4" />
				<span>Upload Files {unverifiedCount > 0 ? `(${unverifiedCount})` : ''}</span>
			{/if}
		</button>
	</div>
</div>


