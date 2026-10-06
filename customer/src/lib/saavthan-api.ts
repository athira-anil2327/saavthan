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
}

export interface UploadRecord {
	id: string;
	drop_code: string;
	display_name: string;
	declared_size: number;
	total_chunks: number;
	status: 'receiving' | 'verified' | 'delivered';
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
 * Ensure an authenticated session with the backend.
 * Automatically tries to login or bootstrap a local session if needed.
 */
export async function ensureAuthenticated(): Promise<boolean> {
	try {
		// Check current token
		if (getStoredToken()) {
			const meRes = await fetch('/api/v1/auth/me', {
				headers: getAuthHeaders()
			});
			if (meRes.ok) return true;
		}

		// Try logging in with default operator / staff credentials
		const loginRes = await fetch('/api/v1/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				username: 'staff1',
				password: 'StrongPassword123!'
			})
		});

		if (loginRes.ok) {
			const data = await loginRes.json();
			setStoredToken(data.access_token);
			return true;
		}

		// If server is not bootstrapped, attempt bootstrap
		const statusRes = await fetch('/api/v1/auth/status');
		if (statusRes.ok) {
			const statusData = await statusRes.json();
			if (!statusData.bootstrapped) {
				const bootRes = await fetch('/api/v1/auth/bootstrap', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						username: 'staff1',
						password: 'StrongPassword123!'
					})
				});
				if (bootRes.ok) {
					// Now login
					const postBootLogin = await fetch('/api/v1/auth/login', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							username: 'staff1',
							password: 'StrongPassword123!'
						})
					});
					if (postBootLogin.ok) {
						const loginData = await postBootLogin.json();
						setStoredToken(loginData.access_token);
						return true;
					}
				}
			}
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
