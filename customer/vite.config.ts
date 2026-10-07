import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// Target server backend endpoint: accepts SERVERIP (e.g. "1.2.3.4" or "http://1.2.3.4:8443")
const rawServerTarget = process.env.SERVERIP || process.env.SERVER_IP || process.env.BACKEND_URL || 'http://127.0.0.1:8443';
const serverBackendUrl = rawServerTarget.startsWith('http://') || rawServerTarget.startsWith('https://')
	? (rawServerTarget.includes(':', rawServerTarget.indexOf('://') + 3) ? rawServerTarget : `${rawServerTarget}:8443`)
	: `http://${rawServerTarget.includes(':') ? rawServerTarget : `${rawServerTarget}:8443`}`;

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
		port: 5174,
		host: '0.0.0.0',
		proxy: {
			'/api/v1': {
				target: serverBackendUrl,
				changeOrigin: true
			},
			'/p': {
				target: serverBackendUrl,
				changeOrigin: true,
				bypass: (req) => {
					const accept = req.headers.accept || '';
					if (req.method === 'GET' && accept.includes('text/html') && !req.url?.includes('/receipt') && !req.url?.includes('/qr')) {
						return req.url;
					}
					return null;
				}
			}
		}
	}
});
