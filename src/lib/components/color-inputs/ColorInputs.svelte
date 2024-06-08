<script lang="ts">
    import { colorStore } from "$lib/store.ts";
    import { onMount } from "svelte";
    import { rgb2Hex } from "$lib/util.ts";
    import Background from "./Background.svelte";
    import Foreground from "./Foreground.svelte";

    let foregroundColor = "#000";
    let backgroundColor = "#FFF";
    let foregroundOpacity = 1;

    onMount(() => {
        onmessage = (event) => {
            const { type, payload } = event.data.pluginMessage;

            if (type === "UPDATE") {
                const { foreground, background } = payload;

                foregroundOpacity = foreground && foreground.pop();
                background && background.pop();

                foregroundColor = foreground === null ? foregroundColor : rgb2Hex(foreground);
                backgroundColor = backgroundColor === null ? backgroundColor : rgb2Hex(background);

                colorStore.set({ foreground: foregroundColor, background: backgroundColor, foregroundOpacity });
            }
        };
    });
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
