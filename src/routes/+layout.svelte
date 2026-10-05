<script lang="ts">
	import '../app.css';
	import Navbar from '#lib/components/Navbar.svelte';

	let { children } = $props();
</script>

<div class="min-h-screen bg-white text-[#202124] flex flex-col font-sans antialiased selection:bg-[#FFF1F1] selection:text-[#FF7675]">
	<Navbar />
	{@render children()}
</div>
