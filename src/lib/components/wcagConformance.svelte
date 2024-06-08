<script lang="ts">
    import Check from "./check.svelte";

    export let contrast: number;
</script>

<div class="cnt">
    <div class="col">
        <h3>Normal Text</h3>

        <div class="row figma-font-ui11-medium">
            <div class="left-part">
                <Check check={contrast >= 4.5} />
                <span>AA</span>
            </div>
            <span class="ratio"> 4.5 : 1 </span>
        </div>

        <div class="row figma-font-ui11-medium">
            <div class="left-part">
                <Check check={contrast >= 7} />
                <span>AAA</span>
            </div>
            <span class="ratio"> 7 : 1 </span>
        </div>
    </div>

    <div class="col">
        <h3>Large Text</h3>

        <div class="row figma-font-ui11-medium">
            <div class="left-part">
                <Check check={contrast >= 3} />
                <span>AA</span>
            </div>
            <span class="ratio"> 3 : 1 </span>
        </div>

        <div class="row figma-font-ui11-medium">
            <div class="left-part">
                <Check check={contrast >= 4.5} />
                <span>AAA</span>
            </div>
            <span class="ratio"> 4.5 : 1 </span>
        </div>
    </div>
</div>

<style>
    .cnt {
        display: flex;
        flex-direction: row;
        background-color: var(--figma-color-bg-secondary);
        padding: 0.75rem 1rem;
        border-radius: 4px;
        column-gap: 2.5rem;
        /* margin: 1rem; */
        color: var(--figma-color-text);
    }

    .col {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
    }

    .left-part {
        display: flex;
        flex-direction: row;
        align-items: center;
        column-gap: 0.25rem;
        font-weight: var(--font-weight-medium);
        font-size: var(--font-size-xsmall);
        letter-spacing: var(--font-letter-spacing-neg-small);
    }

    h3 {
        color: var(--figma-color-text-secondary);
        margin-bottom: 0.25rem;
        font-weight: var(--font-weight-normal);
        font-size: var(--font-size-xsmall);
    }
    .ratio {
        color: var(--figma-color-text-secondary);
    }
</style>
