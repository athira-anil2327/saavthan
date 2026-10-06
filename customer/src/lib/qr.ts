import QRCode from 'qrcode';

/**
 * Standards-compliant SVG QR Code Generator (ISO/IEC 18004)
 * Generates valid, camera-scannable QR Code SVG for mobile phones & tablets.
 */
export function generateQRCodeSVG(text: string, size = 200, color = '#18181b', bg = '#FFFFFF'): string {
	if (!text) return '';
	try {
		const qr = QRCode.create(text, { errorCorrectionLevel: 'M' });
		const moduleCount = qr.modules.size;
		const margin = 2;
		const totalCount = moduleCount + margin * 2;
		const cellSize = size / totalCount;

		let pathData = '';
		for (let r = 0; r < moduleCount; r++) {
			for (let c = 0; c < moduleCount; c++) {
				if (qr.modules.get(r, c)) {
					const x = (c + margin) * cellSize;
					const y = (r + margin) * cellSize;
					pathData += `M${x.toFixed(2)},${y.toFixed(2)}h${cellSize.toFixed(2)}v${cellSize.toFixed(2)}h-${cellSize.toFixed(2)}z `;
				}
			}
		}

		return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="w-full h-full">
			<rect width="100%" height="100%" fill="${bg}" rx="8" />
			<path d="${pathData}" fill="${color}" shape-rendering="crispEdges" />
		</svg>`;
	} catch (e) {
		console.error('Failed to generate standard QR code:', e);
		return '';
	}
}
