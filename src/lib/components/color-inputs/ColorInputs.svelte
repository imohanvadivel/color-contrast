<script lang="ts">
    import { colorStore } from "$lib/store.ts";
    import { onMount } from "svelte";
    import { rgb2Hex } from "$lib/util.ts";
    import Background from "./Background.svelte";
    import Foreground from "./Foreground.svelte";

    export let foregroundColor: string;
    export let backgroundColor: string;
    export let foregroundOpacity: number;
</script>

<div>
    <Foreground bind:color={foregroundColor} bind:opacity={foregroundOpacity} />
    <Background bind:color={backgroundColor} />
</div>

<style>
    div {
        display: flex;
        padding: 0.5rem 1rem 1rem 1rem;
        column-gap: 1.5rem;
    }
</style>
