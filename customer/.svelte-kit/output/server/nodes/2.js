

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/upload/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.ClxWrb8I.js","_app/immutable/chunks/D40v1Fcj.js"];
export const stylesheets = [];
export const fonts = [];
