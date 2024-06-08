<script lang="ts">
    import Check from "./check.svelte";

    export let contrast: number;
</script>

<div class="cnt">
    <div class="col">
        <div class="row figma-font-ui11-medium">
            <div class="left-part">
                <Check check={contrast >= 45 || contrast <= -45} />
                <span>Large text</span>
            </div>
            <span class="ratio"> 45 </span>
        </div>

        <div class="row figma-font-ui11-medium">
            <div class="left-part">
                <Check check={contrast >= 60 || contrast <= -60} />
                <span>Fluent text</span>
            </div>
            <span class="ratio"> 60 </span>
        </div>
    </div>

    <div class="col">
        <div class="row figma-font-ui11-medium">
            <div class="left-part">
                <Check check={contrast >= 75 || contrast <= -75} />
                <span>Body text</span>
            </div>
            <span class="ratio"> 75 </span>
        </div>

        <div class="row figma-font-ui11-medium">
            <div class="left-part">
                <Check check={contrast >= 90 || contrast <= -90} />
                <span>Preferred</span>
            </div>
            <span class="ratio"> 90 </span>
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
    .ratio {
        color: var(--figma-color-text-secondary);
    }
</style>
