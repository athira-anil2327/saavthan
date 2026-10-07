import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// Target server backend endpoint: accepts SERVERIP (e.g. "127.0.0.1", "1.2.3.4", or "http://1.2.3.4:8443")
const rawServerTarget = process.env.SERVERIP || process.env.SERVER_IP || process.env.BACKEND_URL;

function resolveBackend(raw: string | undefined, defaultPort: number): string {
	const val = raw || '127.0.0.1';
	if (val.startsWith('http://') || val.startsWith('https://')) {
		return val.includes(':', val.indexOf('://') + 3) ? val : `${val}:${defaultPort}`;
	}
	return `http://${val.includes(':') ? val : `${val}:${defaultPort}`}`;
}

const serverBackendUrl = resolveBackend(rawServerTarget, 8443);

export default defineConfig({
	cacheDir: './.vite',
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
		port: 5174,
		host: '0.0.0.0',
		allowedHosts: ['vault.laddu.cc'],
		proxy: {
			'/api/v1': {
				target: serverBackendUrl,
				changeOrigin: true
			},
			'/p': {
				target: serverBackendUrl,
				changeOrigin: true,
				bypass: (req) => {
					const url = req.url || '';
					// Backend API endpoints (uploads, chunks, complete, delete, qr) must be proxied
					if (
						url.includes('/uploads') ||
						url.includes('/chunks') ||
						url.includes('/complete') ||
						url.includes('/delete') ||
						url.includes('/qr')
					) {
						return null; // proxy to server.py backend
					}
					// Client page navigations (/p/[code], /p/[code]/upload, SvelteKit data/chunks) stay in SvelteKit
					return req.url;
				}
			}
		}
	}
});
