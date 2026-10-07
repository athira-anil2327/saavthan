<script lang="ts">
	import AppHeader from '$lib/components/AppHeader.svelte';

	let { children } = $props();
</script>

<AppHeader subtitle="Operator Workspace" />

<div class="flex-1 flex flex-col md:flex-row w-full min-h-[calc(100vh-56px)]">
	{@render children()}
</div>
