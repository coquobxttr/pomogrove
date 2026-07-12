<script lang="ts">
    let { children } = $props();
    import "../app.css";
</script>

<svelte:window on:contextmenu={(e) => e.preventDefault()} />
{@render children()}