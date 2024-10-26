import { AuditNodes, getFgAndBg } from "./util.ts";

figma.showUI(__html__, { themeColors: true, width: 300, height: 461 });

figma.ui.onmessage = async (msg) => {
    switch (msg.type) {
        case "RESIZE":
            const { width, height } = msg.payload;
            figma.ui.resize(width, height);
            break;
        case "INSPECT":
            initInspect();
            break;
        case "AUDIT":
            if (figma.currentPage.selection.length === 0) {
                figma.notify("Kindly select a frame to run the audit");
                figma.ui.postMessage({ type: "RESET_AUDIT" });
                break;
            }
            figma.ui.postMessage({ type: "AUDIT_DATA", payload: AuditNodes() });
            break;
        case "FOCUS_NODE":
            figma.currentPage.selection = [await figma.getNodeByIdAsync(msg.payload) as SceneNode];
            figma.viewport.scrollAndZoomIntoView([figma.currentPage.selection[0]]);
            break;

        case "GET_SELECTION":
            initSelectionChangeEvent();
            break;
    }
};

figma.on("selectionchange", handleSelectionChange);

function handleSelectionChange() {
    initSelectionChangeEvent();
    initInspect();
}

function initInspect() {
    let res = getFgAndBg(figma.currentPage.selection[0]);
    figma.ui.postMessage({ type: "UPDATE_INSPECT", payload: res });
}

function initSelectionChangeEvent() {
    let selection = figma.currentPage.selection;
    let noSelection = selection.length === 0;

    let noSelectionPayload = { hasSelection: false };
    let selectionPayload = { hasSelection: true, nodeName: selection[0]?.name };

    figma.ui.postMessage({ type: "SELECTION_CHANGE", payload: noSelection ? noSelectionPayload : selectionPayload });
}

initSelectionChangeEvent();
