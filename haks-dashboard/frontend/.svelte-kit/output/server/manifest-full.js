export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.C4lanf97.js",app:"_app/immutable/entry/app.CEobgu0u.js",imports:["_app/immutable/entry/start.C4lanf97.js","_app/immutable/chunks/B00TgBh1.js","_app/immutable/chunks/dxqk_aNS.js","_app/immutable/chunks/BWFiLchX.js","_app/immutable/chunks/CL6uaj4E.js","_app/immutable/entry/app.CEobgu0u.js","_app/immutable/chunks/CL6uaj4E.js","_app/immutable/chunks/BWFiLchX.js","_app/immutable/chunks/dxqk_aNS.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
