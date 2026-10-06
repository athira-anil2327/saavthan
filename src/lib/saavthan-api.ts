/**
 * Saavthan Secure Workspace Client API
 * Connects directly to the running Saavthan backend (server.py + manager.py)
 */

export interface SystemStatus {
	device_id: string | null;
	cafe_slug: string | null;
	app_version: string;
	image_version: string;
	active_image_file: string;
	update_status: string;
	server_time: number;
}

export interface SessionInfo {
	session_id: string;
	workspace_path: string;
	status: string;
	started_at?: number;
	ended_at?: number;
}

export interface DropInfo {
	drop_code: string;
	portal_url: string;
	vanity_url: string;
	tunnel_url: string;
	local_portal_url: string;
	expires_at: number;
	max_bytes: number;
	label?: string;
	status?: string;
	is_expired?: boolean;
}

export interface UploadRecord {
	id: string;
	drop_code: string;
	display_name: string;
	declared_size: number;
	total_chunks: number;
	status: 'receiving' | 'verified' | 'delivered' | 'wiped';
	tree_hash: string | null;
	created_at: number;
	receipt?: {
		version: number;
		upload_id: string;
		drop_code: string;
		cafe_slug: string;
		tree_hash: string;
		size: number;
		chunk_size: number;
		received_at: number;
		hub_public_key: string;
	} | null;
	hub_sig?: string | null;
	manager_ack_seq?: number | null;
	source?: 'qr' | 'whatsapp' | 'email' | 'bluetooth' | 'usb' | 'direct';
}

export interface SessionActivityEvent {
	id: string;
	timestamp: Date;
	type: 'session_start' | 'drop_created' | 'file_uploaded' | 'file_delivered' | 'file_deleted' | 'device_connected' | 'session_wiped' | 'info';
	title: string;
	detail?: string;
	meta?: Record<string, unknown>;
}

// In-memory token management for staff / operator requests
let authToken: string | null = null;
const TOKEN_STORAGE_KEY = 'saavthan_staff_token';

export function getStoredToken(): string | null {
	if (typeof window !== 'undefined' && !authToken) {
		authToken = localStorage.getItem(TOKEN_STORAGE_KEY);
	}
	return authToken;
}

export function setStoredToken(token: string | null) {
	authToken = token;
	if (typeof window !== 'undefined') {
		if (token) {
			localStorage.setItem(TOKEN_STORAGE_KEY, token);
		} else {
			localStorage.removeItem(TOKEN_STORAGE_KEY);
		}
	}
}

function getAuthHeaders(): HeadersInit {
	const token = getStoredToken();
	const headers: Record<string, string> = {
		'Content-Type': 'application/json'
	};
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}
	return headers;
}

/**
 * Check backend bootstrap status
 */
export async function getAuthStatus(): Promise<{ bootstrapped: boolean }> {
	try {
		const res = await fetch('/api/v1/auth/status');
		if (res.ok) {
			return await res.json();
		}
	} catch (e) {
		console.warn('[Saavthan API] Failed to fetch auth status:', e);
	}
	return { bootstrapped: false };
}

/**
 * Log in staff / operator with provided credentials
 */
export async function loginStaff(username: string, password: string): Promise<boolean> {
	try {
		const res = await fetch('/api/v1/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		});
		if (res.ok) {
			const data = await res.json();
			setStoredToken(data.access_token);
			if (typeof window !== 'undefined' && data.role) {
				localStorage.setItem('vault_user_role', data.role);
			}
			return true;
		}
	} catch (e) {
		console.error('[Saavthan API] Login failed:', e);
	}
	return false;
}

export function getStoredRole(): string | null {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('vault_user_role');
	}
	return null;
}

/**
 * Bootstrap node with first-time operator credentials
 */
export async function bootstrapStaff(username: string, password: string): Promise<boolean> {
	try {
		const bootRes = await fetch('/api/v1/auth/bootstrap', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		});
		if (bootRes.ok) {
			return await loginStaff(username, password);
		}
	} catch (e) {
		console.error('[Saavthan API] Bootstrap failed:', e);
	}
	return false;
}

/**
 * Verify if current stored token is valid against backend
 */
export async function ensureAuthenticated(): Promise<boolean> {
	try {
		if (getStoredToken()) {
			const meRes = await fetch('/api/v1/auth/me', {
				headers: getAuthHeaders()
			});
			if (meRes.ok) return true;
		}
	} catch (e) {
		console.warn('[Saavthan API] Auth verification error:', e);
	}
	return false;
}

/**
 * Fetch local system and node status
 */
export async function fetchSystemStatus(): Promise<SystemStatus | null> {
	try {
		const res = await fetch('/api/v1/system/status');
		if (res.ok) {
			return await res.json();
		}
	} catch (e) {
		console.warn('[Saavthan API] Failed to fetch system status:', e);
	}
	return null;
}

/**
 * Initialize a new ephemeral kiosk workspace session
 */
export async function startSession(): Promise<SessionInfo | null> {
	await ensureAuthenticated();
	try {
		const res = await fetch('/api/v1/session/start', {
			method: 'POST',
			headers: getAuthHeaders()
		});
		if (res.ok) {
			return await res.json();
		}
	} catch (e) {
		console.error('[Saavthan API] Failed to start session:', e);
	}
	return null;
}

/**
 * Obliterates session workspace and destroys keys (crypto-shredding)
 */
export async function endSession(sessionId: string): Promise<{ status: string; session_id: string; wipe_verified: boolean } | null> {
	await ensureAuthenticated();
	try {
		const res = await fetch(`/api/v1/session/${sessionId}/end`, {
			method: 'POST',
			headers: getAuthHeaders()
		});
		if (res.ok) {
			return await res.json();
		}
	} catch (e) {
		console.error('[Saavthan API] Failed to end session:', e);
	}
	return null;
}

/**
 * Create a new drop link for receiving files
 */
export async function createDrop(label = 'Secure Workspace Drop', maxBytes = 100 * 1024 * 1024, ttlMinutes = 120): Promise<DropInfo | null> {
	await ensureAuthenticated();
	try {
		const res = await fetch('/api/v1/drops', {
			method: 'POST',
			headers: getAuthHeaders(),
			body: JSON.stringify({
				label,
				max_bytes: maxBytes,
				ttl_minutes: ttlMinutes
			})
		});
		if (res.ok) {
			return await res.json();
		}
	} catch (e) {
		console.error('[Saavthan API] Failed to create drop:', e);
	}
	return null;
}

/**
 * List all active/recent drops
 */
export async function listDrops(): Promise<DropInfo[]> {
	await ensureAuthenticated();
	try {
		const res = await fetch('/api/v1/drops', {
			headers: getAuthHeaders()
		});
		if (res.ok) {
			return await res.json();
		}
	} catch (e) {
		console.warn('[Saavthan API] Failed to list drops:', e);
	}
	return [];
}

/**
 * Fetch all uploads
 */
export async function listUploads(): Promise<UploadRecord[]> {
	await ensureAuthenticated();
	try {
		const res = await fetch('/api/v1/uploads', {
			headers: getAuthHeaders()
		});
		if (res.ok) {
			return await res.json();
		}
	} catch (e) {
		console.warn('[Saavthan API] Failed to list uploads:', e);
	}
	return [];
}

/**
 * Deliver a verified upload directly into the ephemeral session workspace
 */
export async function deliverUpload(sessionId: string, uploadId: string): Promise<{ status: string; file_name: string; path: string } | null> {
	await ensureAuthenticated();
	try {
		const res = await fetch(`/api/v1/session/${sessionId}/deliver/${uploadId}`, {
			method: 'POST',
			headers: getAuthHeaders()
		});
		if (res.ok) {
			return await res.json();
		}
	} catch (e) {
		console.error('[Saavthan API] Failed to deliver upload to session workspace:', e);
	}
	return null;
}

/**
 * Computes domain-separated tree hash over chunk digests matching backend server.py
 * h = sha256(b"vault-file-v1\x00" + chunk_size(4) + total_size(8) + digests...)
 */
export async function computeTreeHash(chunkDigests: Uint8Array[], totalSize: number, chunkSize: number): Promise<string> {
	const prefix = new TextEncoder().encode('vault-file-v1\0');
	const chunkSizeBuf = new ArrayBuffer(4);
	new DataView(chunkSizeBuf).setUint32(0, chunkSize, false);
	const totalSizeBuf = new ArrayBuffer(8);
	new DataView(totalSizeBuf).setBigUint64(0, BigInt(totalSize), false);

	const totalLength = prefix.length + 4 + 8 + chunkDigests.reduce((acc, d) => acc + d.length, 0);
	const combined = new Uint8Array(totalLength);
	let offset = 0;
	combined.set(prefix, offset);
	offset += prefix.length;
	combined.set(new Uint8Array(chunkSizeBuf), offset);
	offset += 4;
	combined.set(new Uint8Array(totalSizeBuf), offset);
	offset += 8;
	for (const d of chunkDigests) {
		combined.set(d, offset);
		offset += d.length;
	}

	const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
	return Array.from(new Uint8Array(hashBuffer))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

/**
 * Upload a file directly using the chunked upload + verification API
 */
export async function uploadFileToDrop(
	dropCode: string,
	file: File,
	onProgress?: (percent: number) => void
): Promise<{ upload_id: string; tree_hash: string; status: string } | null> {
	try {
		const chunkSize = 8 * 1024 * 1024; // 8MB chunks
		const totalChunks = Math.ceil(file.size / chunkSize) || 1;

		// 1. Init Upload
		const initRes = await fetch(`/p/${dropCode}/uploads`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				display_name: file.name,
				size: file.size,
				chunk_size: chunkSize
			})
		});

		if (!initRes.ok) {
			const err = await initRes.text();
			throw new Error(`Init upload failed: ${err}`);
		}

		const initData = await initRes.json();
		const uploadId = initData.upload_id;
		const chunkDigests: Uint8Array[] = [];

		// 2. Upload Chunks
		for (let idx = 0; idx < totalChunks; idx++) {
			const start = idx * chunkSize;
			const end = Math.min(file.size, start + chunkSize);
			const chunkBlob = file.slice(start, end);
			const chunkBuffer = await chunkBlob.arrayBuffer();

			// Calculate SHA-256 of chunk
			const chunkHashBuffer = await crypto.subtle.digest('SHA-256', chunkBuffer);
			const chunkHashHex = Array.from(new Uint8Array(chunkHashBuffer))
				.map((b) => b.toString(16).padStart(2, '0'))
				.join('');
			chunkDigests.push(new Uint8Array(chunkHashBuffer));

			const chunkRes = await fetch(`/p/${dropCode}/uploads/${uploadId}/chunks/${idx}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/octet-stream',
					'X-Chunk-SHA256': chunkHashHex
				},
				body: chunkBuffer
			});

			if (!chunkRes.ok) {
				throw new Error(`Chunk ${idx} upload failed`);
			}

			if (onProgress) {
				onProgress(Math.round(((idx + 1) / totalChunks) * 100));
			}
		}

		// 3. Complete Upload & verify tree hash
		const treeHashHex = await computeTreeHash(chunkDigests, file.size, chunkSize);
		const completeRes = await fetch(`/p/${dropCode}/uploads/${uploadId}/complete`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				chunk_digests: chunkDigests.map((d) => Array.from(d).map((b) => b.toString(16).padStart(2, '0')).join('')),
				tree_hash: treeHashHex
			})
		});

		if (!completeRes.ok) {
			throw new Error(`Complete upload verification failed`);
		}

		const completeData = await completeRes.json();
		return {
			upload_id: uploadId,
			tree_hash: treeHashHex,
			status: completeData.status
		};
	} catch (e) {
		console.error('[Saavthan API] File upload failed:', e);
		return null;
	}
}

/**
 * List all kiosk sessions
 */
export async function listSessions(): Promise<any[]> {
	await ensureAuthenticated();
	try {
		const res = await fetch('/api/v1/sessions', {
			headers: getAuthHeaders()
		});
		if (res.ok) {
			return await res.json();
		}
	} catch (e) {
		console.warn('[Saavthan API] Failed to list sessions:', e);
	}
	return [];
}

/**
 * Close a drop
 */
export async function closeDrop(code: string): Promise<boolean> {
	await ensureAuthenticated();
	try {
		const res = await fetch(`/api/v1/drops/${code}/close`, {
			method: 'POST',
			headers: getAuthHeaders()
		});
		return res.ok;
	} catch (e) {
		console.error('[Saavthan API] Failed to close drop:', e);
		return false;
	}
}

/**
 * Trigger immediate OTA update check & install
 */
export async function triggerOtaUpdate(): Promise<any> {
	await ensureAuthenticated();
	try {
		const res = await fetch('/api/v1/system/check-update', {
			method: 'POST',
			headers: getAuthHeaders()
		});
		if (res.ok) {
			return await res.json();
		}
	} catch (e) {
		console.error('[Saavthan API] OTA update trigger failed:', e);
	}
	return null;
}

/**
 * Enroll node with central manager
 */
export async function enrollNode(managerUrl: string, token: string): Promise<any> {
	await ensureAuthenticated();
	try {
		const res = await fetch('/api/v1/system/enroll', {
			method: 'POST',
			headers: getAuthHeaders(),
			body: JSON.stringify({ manager_url: managerUrl, token })
		});
		if (res.ok) {
			return await res.json();
		}
	} catch (e) {
		console.error('[Saavthan API] Enrollment failed:', e);
	}
	return null;
}

/**
 * List staff team members
 */
export async function listUsers(): Promise<any[]> {
	await ensureAuthenticated();
	try {
		const res = await fetch('/api/v1/users', {
			headers: getAuthHeaders()
		});
		if (res.ok) {
			return await res.json();
		}
	} catch (e) {
		console.warn('[Saavthan API] Failed to list users:', e);
	}
	return [];
}

/**
 * Register a new staff operator
 */
export async function registerStaff(username: string, password: string): Promise<any> {
	try {
		const res = await fetch('/api/v1/auth/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		});
		if (res.ok) {
			return await res.json();
		}
	} catch (e) {
		console.error('[Saavthan API] Staff registration failed:', e);
	}
	return null;
}

export interface SessionFile {
	name: string;
	size: number;
	media_type: string;
	created_at: number;
	tree_hash?: string;
	upload_id?: string;
	status?: string;
	download_url: string;
}

/**
 * Lists decrypted plaintext files present in active workspace session
 */
export async function listSessionFiles(sessionId: string): Promise<SessionFile[]> {
	try {
		const res = await fetch(`/api/v1/session/${sessionId}/files`);
		if (res.ok) {
			return await res.json();
		}
	} catch (e) {
		console.warn('[Saavthan API] Failed to list session files:', e);
	}
	return [];
}

/**
 * Download decrypted file either from session workspace or on-the-fly decryption streaming
 */
export async function downloadDecryptedFile(uploadId: string, filename: string, sessionId?: string): Promise<boolean> {
	try {
		// 1. Try session download if session is active
		if (sessionId) {
			const sessUrl = `/api/v1/session/${sessionId}/files/${encodeURIComponent(filename)}`;
			const res = await fetch(sessUrl);
			if (res.ok) {
				const blob = await res.blob();
				const blobUrl = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = blobUrl;
				a.download = filename;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(blobUrl);
				return true;
			}
		}

		// 2. Try on-the-fly streaming endpoint
		const token = getStoredToken();
		const headers: Record<string, string> = {};
		if (token) headers['Authorization'] = `Bearer ${token}`;
		const dlUrl = `/api/v1/uploads/${uploadId}/download${token ? `?token=${encodeURIComponent(token)}` : ''}`;
		const dlRes = await fetch(dlUrl, { headers });
		if (dlRes.ok) {
			const blob = await dlRes.blob();
			const blobUrl = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = blobUrl;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(blobUrl);
			return true;
		}
	} catch (e) {
		console.error('[Saavthan API] Download decrypted file failed:', e);
	}
	return false;
}

/**
 * Fetch cryptographic receipt for an upload
 */
export async function fetchUploadReceipt(uploadId: string, dropCode?: string): Promise<any | null> {
	try {
		const res = await fetch(`/api/v1/uploads/${uploadId}/receipt`);
		if (res.ok) {
			return await res.json();
		}
		if (dropCode) {
			const fallback = await fetch(`/p/${dropCode}/uploads/${uploadId}/receipt`);
			if (fallback.ok) {
				return await fallback.json();
			}
		}
	} catch (e) {
		console.warn('[Saavthan API] Fetch upload receipt failed:', e);
	}
	return null;
}

/**
 * Remotely delete a single upload from the drop session (client-triggered crypto-shred)
 */
export async function deleteUploadFromDrop(dropCode: string, uploadId: string): Promise<boolean> {
	try {
		const res = await fetch(`/p/${dropCode}/uploads/${uploadId}`, {
			method: 'DELETE'
		});
		if (res.ok) return true;
		const fallback = await fetch(`/p/${dropCode}/uploads/${uploadId}/delete`, {
			method: 'POST'
		});
		return fallback.ok;
	} catch (e) {
		console.error('[Saavthan API] Failed to delete upload:', e);
		return false;
	}
}

/**
 * Remotely delete all uploaded files handed over in this drop session (client-triggered 'Delete Now')
 */
export async function deleteAllUploadsFromDrop(dropCode: string): Promise<{ success: boolean; count: number }> {
	try {
		const res = await fetch(`/p/${dropCode}/delete-all`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({})
		});
		if (res.ok) {
			const data = await res.json();
			return { success: true, count: data.count || 0 };
		}
	} catch (e) {
		console.error('[Saavthan API] Failed to delete all uploads:', e);
	}
	return { success: false, count: 0 };
}


