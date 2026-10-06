
import error from './shared/error-template.js';

export const options = {
	app_template_contains_nonce: false,
	csp: {"mode":"auto","directives":{"upgrade-insecure-requests":false,"block-all-mixed-content":false},"reportOnly":{"upgrade-insecure-requests":false,"block-all-mixed-content":false}},
	csrf_trusted_origins: [],
	service_worker_options: undefined,
	templates: {
		app: ({ head, body, assets, nonce, env }) => "<!doctype html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<link rel=\"icon\" href=\"" + assets + "/favicon.png\" />\n\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n\t\t<title>VAULT</title>\n\t\t<script>\n\t\t\ttry {\n\t\t\t\tconst theme = localStorage.getItem('vault-theme') || 'light';\n\t\t\t\tif (theme === 'dark') {\n\t\t\t\t\tdocument.documentElement.classList.add('dark');\n\t\t\t\t\tdocument.documentElement.setAttribute('data-theme', 'dark');\n\t\t\t\t\tdocument.documentElement.style.colorScheme = 'dark';\n\t\t\t\t} else {\n\t\t\t\t\tdocument.documentElement.classList.remove('dark');\n\t\t\t\t\tdocument.documentElement.setAttribute('data-theme', 'light');\n\t\t\t\t\tdocument.documentElement.style.colorScheme = 'light';\n\t\t\t\t}\n\t\t\t} catch (e) {}\n\t\t</script>\n\t\t" + head + "\n\t</head>\n\t<body data-sveltekit-preload-data=\"hover\" class=\"bg-background text-foreground antialiased transition-colors duration-200\">\n\t\t<div style=\"display: contents\">" + body + "</div>\n\t</body>\n</html>\n",
		error
	}
};

export async function get_hooks() {
	let handle;
	let handleFetch;
	let handleError;
	let init;
	

	let reroute;
	let transport;
	

	return {
		handle,
		handleFetch,
		handleError,
		init,
		reroute,
		transport
	};
}
