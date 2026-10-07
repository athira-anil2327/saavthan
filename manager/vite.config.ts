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
		proxy: {
			// Central Manager API: Fleet management, tokens, OTA releases
			'/api/v1/admin': {
				target: 'http://127.0.0.1:8000',
				changeOrigin: true
			},
			// Central Manager API: Transparency notarization and dispute verification
			'/api/v1/log': {
				target: 'http://127.0.0.1:8000',
				changeOrigin: true
			},
			// Local Server / Kiosk API: Auth, drops, sessions, file delivery, wipe engine
			'/api/v1': {
				target: 'http://127.0.0.1:8443',
				changeOrigin: true
			},
			// Customer Drop Portal: Upload chunks, complete, delete, and notarized receipts
			'/p': {
				target: 'http://127.0.0.1:8443',
				changeOrigin: true,
				bypass: (req) => {
					// When a browser requests an HTML document for navigation,
					// return the URL so SvelteKit renders the interactive Svelte UI.
					const accept = req.headers.accept || '';
					if (
						req.method === 'GET' &&
						accept.includes('text/html') &&
						!req.url?.includes('/receipt') &&
						!req.url?.includes('/qr')
					) {
						return req.url;
					}
					// Forward binary chunk uploads, completion commits, and API calls to backend server.py
					return null;
				}
			}
		}
	}
});
