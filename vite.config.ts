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
			'/api/v1/admin': {
				target: 'http://127.0.0.1:8000',
				changeOrigin: true
			},
			'/api/v1/log': {
				target: 'http://127.0.0.1:8000',
				changeOrigin: true
			},
			'/api/v1': {
				target: 'http://127.0.0.1:8443',
				changeOrigin: true
			}
		}
	}
});
