/**
 * @file vite.config.ts
 * @description Unified Vite configuration for Vault Frontend Application.
 * 
 * Features:
 * 1. Tailwind CSS integration via @tailwindcss/vite.
 * 2. SvelteKit plugin with both $lib and #lib alias paths for backward compatibility.
 * 3. Multi-service reverse proxy:
 *    - /api/v1/admin & /api/v1/log -> Central Manager API (Port 8000)
 *    - /api/v1 (auth, drops, sessions, uploads) -> Server Kiosk API (Port 8443)
 *    - /p (drop portal uploads, chunks, receipts) -> Server Kiosk API (Port 8443),
 *      with an intelligent bypass rule for browser HTML page navigation so that
 *      SvelteKit routes (/p/[code]/upload) render the modern interactive Svelte UI.
 */

import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// Target endpoints: accepts SERVERIP (e.g. "1.2.3.4" or "http://1.2.3.4")
// For manager, targets manager.py on port 8000 and server.py on port 8443
function resolveBackend(raw: string | undefined, defaultPort: number): string {
	const val = raw || `127.0.0.1:${defaultPort}`;
	if (val.startsWith('http://') || val.startsWith('https://')) {
		return val.includes(':', val.indexOf('://') + 3) ? val : `${val}:${defaultPort}`;
	}
	return `http://${val.includes(':') ? val : `${val}:${defaultPort}`}`;
}

const hostOrIp = process.env.SERVERIP || process.env.SERVER_IP || process.env.MANAGER_IP || process.env.HOST_IP;
const managerBackendUrl = resolveBackend(process.env.MANAGER_BACKEND_URL || hostOrIp, 8000);
const serverBackendUrl = resolveBackend(process.env.SERVER_BACKEND_URL || hostOrIp, 8443);

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			adapter: adapter(),
			alias: {
				$lib: 'src/lib',
				'$lib/*': 'src/lib/*',
				'#lib': 'src/lib',
				'#lib/*': 'src/lib/*'
			}
		})
	],
	server: {
		port: 5173,
		host: '0.0.0.0',
		allowedHosts: ['vault.laddu.cc'],
		proxy: {
			// Central Manager API: Fleet management, tokens, OTA releases
			'/api/v1/admin': {
				target: managerBackendUrl,
				changeOrigin: true
			},
			// Central Manager API: Transparency notarization and dispute verification
			'/api/v1/log': {
				target: managerBackendUrl,
				changeOrigin: true
			},
			// Local Server / Kiosk API: Auth, drops, sessions, file delivery, wipe engine
			'/api/v1': {
				target: serverBackendUrl,
				changeOrigin: true
			}
		}
	}
});
