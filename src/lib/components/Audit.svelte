<script lang="ts">
    import {
        auditData,
        calculateContrast,
        isAuditRan,
        selectedContrast,
        contrastAlgorithm,
        type WCAGContrastData,
        type APCAContrastData,
        violatedData,
        totalViolations,
    } from "$lib/store.ts";
    import { postFigma, processFgAndBg } from "$lib/util.ts";
    import { Button, Select, Label } from "figblocks";
    import { createEventDispatcher, onMount } from "svelte";
    import Pill from "./Pill.svelte";
    import { Confetti } from "svelte-confetti";

    let hasSelection = false;
    let selectedLayerName: string;

    type LayerData = {
        foreground: number[];
        background: number[];
        name: string;
        id: string;
    };

    let dispatch = createEventDispatcher();

    function handleMessageEvent(event: MessageEvent) {
        const { type, payload } = event.data.pluginMessage;

        if (type === "SELECTION_CHANGE") {
            hasSelection = payload.hasSelection;
            selectedLayerName = payload.nodeName;
        }

        if (type === "AUDIT_DATA") {
            $auditData = (payload as LayerData[]).map((e) => {
                let { foreground, background, name, id } = e;
                let { foregroundColor, backgroundColor, foregroundOpacity } = processFgAndBg({ foreground, background });
                let contrast = calculateContrast(foregroundColor, backgroundColor, foregroundOpacity);

                return { contrast, name, id };
            });
        }

        if (type === "RESET_AUDIT") {
            $isAuditRan = false;
        }
    }

    function focusNode(event: MouseEvent, id: string) {
        postFigma({ type: "FOCUS_NODE", payload: id });
        if (event.shiftKey) dispatch("openInspect");
    }

    function handleAudit() {
        $isAuditRan = true;
        postFigma({ type: "AUDIT" });
    }

    function evaluateTextContrast(
        contrastObj: WCAGContrastData | APCAContrastData,
        selectedContrast: "wcag" | "bpca" | "apca"
    ) {
        let isLargeTextPassed, isNormalTextPassed, largeTextLabel, normalTextLabel;

        switch (selectedContrast) {
            case "apca":
                isLargeTextPassed = contrastObj.largeText;
                isNormalTextPassed = contrastObj.normalText;
                largeTextLabel = isLargeTextPassed ? "PASS" : "FAIL";
                normalTextLabel = isNormalTextPassed ? "PASS" : "FAIL";
                break;
            case "bpca":
            case "wcag":
                if ((contrastObj as WCAGContrastData).largeText.aaa) {
                    isLargeTextPassed = true;
                    largeTextLabel = "AAA";
                } else if ((contrastObj as WCAGContrastData).largeText.aa) {
                    isLargeTextPassed = true;
                    largeTextLabel = "AA";
                } else {
                    isLargeTextPassed = false;
                    largeTextLabel = "AA";
                }

                if ((contrastObj as WCAGContrastData).normalText.aaa) {
                    isNormalTextPassed = true;
                    normalTextLabel = "AAA";
                } else if ((contrastObj as WCAGContrastData).normalText.aa) {
                    isNormalTextPassed = true;
                    normalTextLabel = "AA";
                } else {
                    isNormalTextPassed = false;
                    normalTextLabel = "AA";
                }
                break;
        }

        return [
            { violated: !isLargeTextPassed, text: largeTextLabel },
            { violated: !isNormalTextPassed, text: normalTextLabel },
        ];
    }

    onMount(() => {
        postFigma({ type: "GET_SELECTION" });
        postFigma({ type: "RESIZE", payload: { height: 743, width: 300 } });

        addEventListener("message", handleMessageEvent);

        return () => {
            removeEventListener("message", handleMessageEvent);
        };
    });
</script>

<main>
    {#if !$isAuditRan}
        {#if !hasSelection}
            <div class="info">
                <p>Kindly select a frame to run the audit</p>
            </div>
        {:else}
            <div class="info">
                <p>Selected Layer: <span class="bold-font">{selectedLayerName}</span></p>
                <Button on:click={handleAudit}>Run Audit</Button>
            </div>
        {/if}
    {/if}

    {#if $isAuditRan}
        <header>
            <Label>Contrast Algorithm</Label>
            <Select bind:menuItems={$contrastAlgorithm} bind:value={$selectedContrast} />
        </header>

        <div class="header-table">
            <Label>Layer Name</Label>

            <div class="right-part">
                <Label>Large</Label>
                <Label>Normal</Label>
            </div>
        </div>

        {#if $violatedData.length === 0}
            <div class="no-violations-info">
                <svg width="42" height="46" viewBox="0 0 42 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M11.0781 36.2656C8.28126 36.2656 6.98438 34.9688 6.98438 32.1719V28.7969C6.98438 28.4688 6.90626 28.25 6.67188 28L4.28126 25.5938C2.31251 23.625 2.29688 21.7969 4.28126 19.8281L6.67188 17.4219C6.90626 17.1875 6.98438 16.9531 6.98438 16.6406V13.25C6.98438 10.4375 8.28126 9.15626 11.0781 9.15626H14.4688C14.7813 9.15626 15.0156 9.07813 15.25 8.84376L17.6563 6.45313C19.625 4.48438 21.4531 4.46876 23.4219 6.45313L25.8281 8.84376C26.0781 9.07813 26.2969 9.15626 26.625 9.15626H30C32.8125 9.15626 34.0938 10.4688 34.0938 13.25V16.6406C34.0938 16.9531 34.1875 17.1875 34.4219 17.4219L36.8125 19.8281C38.7813 21.7969 38.7969 23.625 36.8125 25.5938L34.4219 28C34.1875 28.25 34.0938 28.4688 34.0938 28.7969V32.1719C34.0938 34.9844 32.7969 36.2656 30 36.2656H26.625C26.2969 36.2656 26.0781 36.3594 25.8281 36.5938L23.4219 38.9844C21.4531 40.9531 19.625 40.9688 17.6563 38.9844L15.25 36.5938C15.0156 36.3594 14.7813 36.2656 14.4688 36.2656H11.0781ZM18.7969 30.3438C19.3281 30.3438 19.7813 30.0938 20.1094 29.5938L27.4531 18.0156C27.6406 17.7031 27.8438 17.3438 27.8438 16.9844C27.8438 16.2656 27.2031 15.7969 26.5313 15.7969C26.1094 15.7969 25.7031 16.0313 25.4063 16.5156L18.7344 27.2344L15.5625 23.1406C15.1719 22.625 14.8281 22.4688 14.3906 22.4688C13.6719 22.4688 13.125 23.0469 13.125 23.7656C13.125 24.1094 13.2656 24.4688 13.5 24.7813L17.4219 29.5938C17.8281 30.1406 18.2656 30.3438 18.7969 30.3438Z"
                        fill="var(--figma-color-icon-success)"
                    />
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M20.1094 29.5938C19.7812 30.0938 19.3281 30.3438 18.7969 30.3438C18.2656 30.3438 17.8281 30.1406 17.4219 29.5938L13.5 24.7812C13.2656 24.4688 13.125 24.1094 13.125 23.7656C13.125 23.0469 13.6719 22.4688 14.3906 22.4688C14.8281 22.4688 15.1719 22.625 15.5625 23.1406L18.7344 27.2344L25.4062 16.5156C25.7031 16.0312 26.1094 15.7969 26.5312 15.7969C27.2031 15.7969 27.8438 16.2656 27.8438 16.9844C27.8438 17.3438 27.6406 17.7031 27.4531 18.0156L20.1094 29.5938Z"
                        fill="white"
                    />
                </svg>

                <p>No violations found</p>
                <Confetti duration={2000} x={[-0.7, 0.7]} />
            </div>
        {/if}

        {#if $violatedData.length > 0}
            <ul>
                {#each $violatedData as item}
                    <li>
                        <button on:click={(e) => focusNode(e, item.id)}>
                            <p>{item.name}</p>

                            <div class="pills-container">
                                {#each evaluateTextContrast(item.contrast[$selectedContrast.value], $selectedContrast.value) as result}
                                    <Pill text={result.text} violated={result.violated} />
                                {/each}
                            </div>
                        </button>
                    </li>
                {/each}

                <div class="help-text">
                    <p>[Click] to focus on the layer.</p>
                    <p>[Shift + Click] to open the layer in inspect mode.</p>
                </div>
            </ul>
        {/if}

        <footer>
            <Button on:click={handleAudit}>Re Run Audit</Button>

            {#if $totalViolations > 0}
                <p class="violation-text">{$totalViolations} Violations Found</p>
            {/if}
        </footer>
    {/if}
</main>

<style>
    .pills-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        width: 102px;
        gap: 2rem;
        align-items: center;
    }

    .header-table {
        display: flex;
        padding: 0.25rem 0.75rem;
        justify-content: space-between;
        border-bottom: 1px solid var(--figma-color-border);
    }

    .right-part {
        display: flex;
        gap: 1.45rem;
        flex-shrink: 0;
        padding-right: 0.55rem;
    }

    .right-part > :global(label) {
        white-space: nowrap;
    }

    .header-table :global(label) {
        font-weight: 500;
    }

    .help-text {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1.25rem;
        font-size: var(--font-size-xsmall);
        color: var(--figma-color-text-tertiary);
        align-items: flex-start;
        user-select: none;
        font-family: var(--font-stack);
    }

    .info {
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;
        margin-top: 35vh;
        font-family: var(--font-stack);
        font-size: var(--font-size-small);
    }

    .no-violations-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        margin-top: 30vh;
    }

    .bold-font {
        font-weight: 500;
        color: var(--figma-color-text);
    }

    main {
        display: flex;
        flex-direction: column;
        height: 100%;
        position: relative;
        --header-height: 41px;
        --config-height: 76px;
        --footer-height: 61px;
        --table-header-height: 38px;
        --offset-height: calc(var(--header-height) + var(--config-height) + var(--footer-height) + var(--table-header-height));
        overflow: hidden;
        font-size: var(--font-size-small);
    }

    header {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.5rem 0.75rem;
        border-bottom: 1px solid var(--figma-color-border);
        position: sticky;
        top: 0;
        background-color: var(--figma-color-bg);
    }

    p {
        text-align: center;
        color: var(--figma-color-text-secondary);
    }

    li {
        border-bottom: 1px solid var(--figma-color-border);
    }

    li:hover {
        background-color: var(--figma-color-bg-hover);
    }

    ul {
        display: flex;
        flex-direction: column;
        height: calc(100% - var(--offset-height));
        overflow-y: auto;
        padding-bottom: var(--footer-height);
    }

    button {
        background-color: transparent;
        border: none;
        outline: none;
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0.75rem 1.5rem;
        align-items: center;
        font-family: var(--font-stack);
        font-size: var(--font-size-small);
    }

    footer {
        padding: 1.25rem;
        border-top: 1px solid var(--figma-color-border);
        position: fixed;
        bottom: 0;
        width: 100%;
        background-color: var(--figma-color-bg);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .violation-text {
        color: var(--figma-color-text-danger);
        font-weight: 500;
    }
</style>
