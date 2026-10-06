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
		port: 5174,
		host: '0.0.0.0',
		proxy: {
			'/api/v1': {
				target: 'http://127.0.0.1:8443',
				changeOrigin: true
			},
			'/p': {
				target: 'http://127.0.0.1:8443',
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
