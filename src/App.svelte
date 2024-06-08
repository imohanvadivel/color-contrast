<script lang="ts">
    import ApcaConformance from "$lib/components/apcaConformance.svelte";
    import ColorInputs from "$lib/components/color-inputs/ColorInputs.svelte";
    import WcagConformance from "$lib/components/wcagConformance.svelte";
    import { colorStore, contrast } from "$lib/store.ts";
    import { postFigma } from "$lib/util.ts";
    import { Button } from "figblocks";

    let showConformace = false;

    function handleConformance() {
        if (showConformace) {
            postFigma({ type: "RESIZE", payload: { height: 420, width: 300 } });
        } else {
            postFigma({ type: "RESIZE", payload: { height: 702, width: 300 } });
        }

        showConformace = !showConformace;
    }
</script>

<ColorInputs />

<div class="contrast-cnt">
    <div class="row figma-font-ui12">
        <div>
            <p>WCAG 2:</p>
            <p class="desc figma-font-ui11">Simple Contrast.</p>
        </div>
        <p class="figma-font-ui12-bold">{$contrast.wcag} : 1</p>
    </div>
    {#if showConformace}
        <WcagConformance contrast={$contrast.wcag} />
    {/if}
</div>

<div class="contrast-cnt">
    <div class="row figma-font-ui12">
        <div>
            <p>BPCA:</p>
            <p class="desc figma-font-ui11">Bridge for WCAG 2 contrast using APCA.</p>
        </div>
        <p class="figma-font-ui12-bold">{$contrast.bpca} : 1</p>
    </div>
    {#if showConformace}
        <WcagConformance contrast={$contrast.bpca} />
    {/if}
</div>

<div class="contrast-cnt">
    <div class="row figma-font-ui12">
        <div>
            <p>APCA:</p>
            <p class="desc figma-font-ui11">Accessible perpetual contrast algorithm.</p>
        </div>
        <p class="figma-font-ui12-bold">{$contrast.apca}</p>
    </div>
    {#if showConformace}
        <ApcaConformance contrast={$contrast.apca} />
    {/if}
</div>

<footer>
    <Button variant="tertiary" on:click={handleConformance}>
        {showConformace ? "Hide" : "Show"} conformance
    </Button>

    <a href="https://mohanvadivel.com/thoughts/color-contrast" target="_blank">More about contrast ↗</a>
</footer>

<style>
    .contrast-cnt {
        display: flex;
        flex-direction: column;
        padding: 1rem 1rem;
        border-bottom: 1px solid var(--figma-color-border);
        row-gap: 1rem;
    }
    .row {
        display: flex;
        justify-content: space-between;
        padding: 0 1rem;
    }
    .desc {
        padding-top: 0.5rem;
        color: var(--figma-color-text-secondary);
        max-width: 16rem;
    }
    footer {
        padding: 0.5rem 1.75rem;
        display: flex;
        column-gap: 1.5rem;
        align-items: baseline;
    }
    footer a {
        color: var(--figma-color-text-brand);
        text-decoration: none;
    }
</style>
