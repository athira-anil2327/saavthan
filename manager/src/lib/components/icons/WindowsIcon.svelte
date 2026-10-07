<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';

	let { class: className = 'w-6 h-6', ...restProps }: SVGAttributes<SVGSVGElement> = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
	fill="currentColor"
	class={className}
	{...restProps}
>
	<path d="M0 3.449L9.75 2.1v9.451H0V3.449zm10.949-1.554L24 0v11.551H10.949V1.895zM0 12.45h9.75v9.451L0 20.551V12.45zm10.949 0H24V24l-13.051-1.895V12.45z" />
</svg>
