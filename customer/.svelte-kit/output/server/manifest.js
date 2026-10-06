export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	app_dir: "_app",
	app_path: "_app",
	assets: new Set([]),
	mime_types: {},
	client: {start:"_app/immutable/entry/start.B_HRcV_O.js",app:"_app/immutable/entry/app.FOAjLx6f.js",imports:["_app/immutable/entry/start.B_HRcV_O.js","_app/immutable/entry/payload.DSmR2FwN.js","_app/immutable/chunks/BaNbYf_w.js","_app/immutable/chunks/CqReZM9j.js","_app/immutable/chunks/D40v1Fcj.js","_app/immutable/chunks/Ba4XpUn5.js","_app/immutable/entry/app.FOAjLx6f.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
	
	nodes: [
		__memo(() => import('./nodes/0.js')),
		__memo(() => import('./nodes/1.js')),
		__memo(() => import('./nodes/2.js')),
		__memo(() => import('./nodes/3.js')),
		__memo(() => import('./nodes/4.js')),
		__memo(() => import('./nodes/5.js'))
	],
	remotes: {
		
	},
	routes: [
		{
			id: "/",
			pattern: /^\/$/,
			params: [],
			page: { layouts: [0,], errors: [1,], leaf: 3 },
			endpoint: null
		},
		{
			id: "/upload",
			pattern: /^\/upload\/?$/,
			params: [],
			page: { layouts: [0,2,], errors: [1,,], leaf: 4 },
			endpoint: null
		},
		{
			id: "/workspace",
			pattern: /^\/workspace\/?$/,
			params: [],
			page: { layouts: [0,], errors: [1,], leaf: 5 },
			endpoint: null
		}
	],
	prerendered_routes: new Set([]),
	matchers: async () => {
		return {};
	},
	server_assets: {}
}
})();
