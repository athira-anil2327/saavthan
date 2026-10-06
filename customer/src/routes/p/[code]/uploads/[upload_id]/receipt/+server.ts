import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, fetch }) => {
	const uploadId = params.upload_id;
	const code = params.code;
	try {
		const res = await fetch(`/api/v1/uploads/${uploadId}/receipt`);
		if (res.ok) {
			const data = await res.json();
			return json(data);
		}
	} catch (e) {
		console.warn('[Receipt Route] Error proxying receipt:', e);
	}
	return json({ error: 'Receipt not found', upload_id: uploadId, code }, { status: 404 });
};
