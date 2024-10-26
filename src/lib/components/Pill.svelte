<script lang="ts">
    export let text: string | undefined;
    export let violated: boolean;
</script>

<div class:violated>{text}</div>

<style>
    div {
        padding: 4px;
        border-radius: 16px;
        color: var(--figma-color-text-onbrand);
        background-color: var(--figma-color-bg-brand);
        font-size: 11px;
        letter-spacing: 0.01em;
    }

    div.violated {
        background-color: var(--figma-color-bg-danger);
    }
</style>
