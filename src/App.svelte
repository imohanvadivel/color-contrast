<script lang="ts">
    import Inspect from "$lib/components/Inspect.svelte";
    import Audit from "$lib/components/Audit.svelte";
    import { Tabs, TabItem } from "figblocks";

    let isInspectOpen = true;
    let sectionEl: HTMLElement;

    function openInspect() {
        console.log("openInspect called");
        sectionEl.querySelector('button')?.click();
    }
</script>

<section bind:this={sectionEl}>
    <Tabs >
        <TabItem title="Inspect" open={isInspectOpen}>
            <Inspect />
        </TabItem>
        <TabItem title="Audit">
            <Audit on:openInspect={openInspect} />
        </TabItem>
    </Tabs>
</section>

<style>
    section {
        height: 100%;
        overflow: hidden;
    }
</style>
