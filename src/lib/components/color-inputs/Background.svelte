<script lang="ts">
    import { isValidHex, sanitizeHex } from "$lib/util.ts";
    import { TextInput, Label } from "figblocks";
    import { colorStore } from "$lib/store.ts";

    export let color: string;

    function handleInput(e: Event) {
        let target = e.target as HTMLInputElement;
        let targetValue = target && target.value;

        if (isValidHex(targetValue)) {
            colorStore.setBackground(targetValue);
        }

        color = sanitizeHex(targetValue);
    }

    function validatehex(ev: Event) {
        let target = ev.target as HTMLInputElement;
        let targetValue = target && target.value;

        if (!isValidHex(targetValue)) {
            colorStore.setBackground("#000000");
        }
    }
</script>

<div class="cnt">
    <Label class="label">Background</Label>
    <div class="color-tile" style="background-color: {color};"></div>
    <TextInput bind:value={color} border on:input={handleInput} on:blur={validatehex} class="inp" />
</div>

<style>
    .color-tile {
        width: 80px;
        height: 80px;
        border: 1px solid var(--figma-color-border);
        border-radius: 4px;
        margin-bottom: 0.25rem;
    }

    .cnt {
        display: flex;
        flex-direction: column;
    }

    .cnt :global(.inp) {
        width: 80px;
    }

    .cnt :global(.label) {
        margin-left: -0.5rem;
    }
</style>
