<script lang="ts">
    import { Label } from "figblocks";
    import Input from "./Input.svelte";
    import { isValidHex, postFigma, sanitizeHex } from "$lib/util.ts";
    import { colorStore } from "$lib/store.ts";

    export let color: string;
    export let opacity: string | number;

    function handleInput(e: Event) {
        let target = e.target as HTMLInputElement;
        let targetValue = target && target.value;

        if (isValidHex(targetValue)) {
            colorStore.setForeground(color);
        }

        color = sanitizeHex(targetValue);
    }

    function validatehex(ev: Event) {
        let target = ev.target as HTMLInputElement;
        let targetValue = target && target.value;

        if (!isValidHex(targetValue)) {
            colorStore.setForeground("#FFFFFF");
        }
    }

    function handleOpacity(e: Event) {
        let target = e.target as HTMLInputElement;
        let targetValue = target && target.value;
        targetValue = targetValue.replace("%", "");
        colorStore.setForegroundOpacity(parseFloat(targetValue));
    }
</script>

<div class="cnt">
    <Label class="label">Foreground</Label>
    <div class="color-tile">
        <div class="left-part" style="background-color: {$colorStore.foreground};"></div>
        <div class="right-part">
            <div
                class="color-layer"
                style="background-color: {$colorStore.foreground}; opacity: {$colorStore.foregroundOpacity}"
            />
            <div class="transparent-layer" />
        </div>
    </div>
    <Input {opacity} border on:input={handleInput} {handleOpacity} {validatehex} />
</div>

<style>
    .color-tile {
        width: 80px;
        height: 80px;
        border: 1px solid var(--figma-color-border);
        border-radius: 4px;
        margin-bottom: 0.25rem;
        display: flex;
        overflow: hidden;
        --checker-pattern: rgb(0, 0, 0, 0.2);
    }

    :global(.figma-dark .cnt .color-tile) {
        --checker-pattern: rgb(255, 255, 255, 0.3);
    }

    .left-part,
    .right-part {
        height: 100%;
        width: 50%;
    }

    .right-part {
        position: relative;
    }

    .right-part div {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .color-layer {
        z-index: 5;
    }

    .transparent-layer {
        z-index: 0;

        background-image: linear-gradient(45deg, var(--checker-pattern) 25%, transparent 25%),
            linear-gradient(-45deg, var(--checker-pattern) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, var(--checker-pattern) 75%),
            linear-gradient(-45deg, transparent 75%, var(--checker-pattern) 75%);

        background-size: 20px 20px;
        background-position:
            0 0,
            0 10px,
            10px -10px,
            -10px 0px;
        opacity: 1;
    }

    .cnt {
        display: flex;
        flex-direction: column;
        padding: 0 0.5rem;
    }

    .cnt :global(.label) {
        margin-left: -0.5rem;
    }
</style>
