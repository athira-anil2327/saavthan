/**
 * @file proxy-5174.mjs
 * @description Transparent reverse proxy bridge for Port 5174.
 * 
 * Purpose:
 * Preserves backwards compatibility for existing browser sessions and workflows
 * that accessed the Customer / Operator Kiosk on port 5174 prior to the unified rebase.
 * 
 * Behavior:
 * 1. HTTP requests to http://localhost:5174/ are redirected (302) to /workspace.
 * 2. All subpaths (/workspace, /upload, /p/..., etc.) are proxied transparently to port 5173.
 * 3. WebSocket 'upgrade' requests are bridged to port 5173 to support Vite Hot Module Replacement (HMR).
 */

import http from 'node:http';
import net from 'node:net';

const TARGET_PORT = 5173;
const LISTEN_PORT = 5174;

const server = http.createServer((req, res) => {
	// If root requested on 5174, route to /workspace to preserve customer app view
	let targetUrl = req.url;
	if (targetUrl === '/') {
		res.writeHead(302, { Location: '/workspace' });
		return res.end();
	}

	const headers = { ...req.headers, host: `localhost:${TARGET_PORT}` };

	const proxyReq = http.request(
		{
			hostname: '127.0.0.1',
			port: TARGET_PORT,
			path: targetUrl,
			method: req.method,
			headers
		},
		(proxyRes) => {
			res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
			proxyRes.pipe(res, { end: true });
		}
	);

	proxyReq.on('error', (err) => {
		res.writeHead(502, { 'Content-Type': 'text/plain' });
		res.end(`Proxy Error: ${err.message}`);
	});

	req.pipe(proxyReq, { end: true });
});

// Support WebSocket upgrade for Vite Hot Module Replacement (HMR)
server.on('upgrade', (req, clientSocket, head) => {
	const targetSocket = net.connect(TARGET_PORT, '127.0.0.1', () => {
		let rawHeaders = `${req.method} ${req.url} HTTP/${req.httpVersion}\r\n`;
		for (const [k, v] of Object.entries(req.headers)) {
			rawHeaders += `${k}: ${v}\r\n`;
		}
		rawHeaders += '\r\n';
		targetSocket.write(rawHeaders);
		if (head && head.length > 0) {
			targetSocket.write(head);
		}
		targetSocket.pipe(clientSocket);
		clientSocket.pipe(targetSocket);
	});

	targetSocket.on('error', () => {
		clientSocket.destroy();
	});
	clientSocket.on('error', () => {
		targetSocket.destroy();
	});
});

server.listen(LISTEN_PORT, '0.0.0.0', () => {
	console.log(`Port 5174 bridge active -> forwarding to 5173`);
});
