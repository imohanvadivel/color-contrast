figma.showUI(__html__, { themeColors: true, width: 300, height: 420 });

figma.ui.onmessage = (msg) => {
    const { width, height } = msg.payload;
    switch (msg.type) {
        case "RESIZE":
            figma.ui.resize(width, height);
            break;
    }
};

figma.on("selectionchange", handleSelectionChange);
handleSelectionChange();
// figma.on("", handleSelectionChange);

function handleSelectionChange() {
    const selection = figma.currentPage.selection[0];
    let foreground;
    let background;
    if (!selection) return;

    const supportedParentNodes = ["FRAME", "RECTANGLE", "ELLIPSE", "VECTOR", "STAR", "GROUP", "COMPONENT", "INSTANCE"];

    // Case: Text node
    if (selection.type === "TEXT") {
        const textSegments = selection.getStyledTextSegments(["fills"]);
        foreground = getFill(textSegments[0].fills);

        // Check for the background color in the parent frame
        const parent = selection.parent;

        if (!supportedParentNodes.includes(parent!.type)) {
            background = [255, 255, 255, 1];
        } else {
            if (parent?.type === "GROUP") {
                const Rectangle = parent.findOne((node) => node.type === "RECTANGLE") as RectangleNode | null;
                const Frame = parent.findOne((node) => node.type === "FRAME") as FrameNode | null;

                if (Rectangle) {
                    background = getFill(Rectangle.fills);
                } else if (Frame) {
                    background = getFill(Frame.fills);
                } else {
                    background = null;
                }
            } else {
                background = getFill((parent as FrameNode)?.fills);
            }
        }
    }

    // Case: Frame node
    else if (selection.type === "FRAME") {
        background = getFill(selection.fills);

        // Check for the text color in the child text node
        const textNode = selection.findOne((node) => node.type === "TEXT") as TextNode | null;

        if (!textNode) {
            console.log("No text node found within the frame");
            foreground = [0, 0, 0, 1];
        } else {
            const textSegments = textNode.getStyledTextSegments(["fills"]);
            foreground = getFill(textSegments[0].fills);
        }
    }
    // Case: Group node
    else if (selection.type === "GROUP") {
        const Rectangle = selection.findOne((node) => node.type === "RECTANGLE") as RectangleNode | null;
        const Frame = selection.findOne((node) => node.type === "FRAME") as FrameNode | null;
        const textNode = selection.findOne((node) => node.type === "TEXT") as TextNode | null;

        if (!textNode) {
            console.log("No text node found within the group");
            foreground = null;
        } else {
            const textSegments = textNode.getStyledTextSegments(["fills"]);
            foreground = getFill(textSegments[0].fills);
        }

        if (Rectangle) {
            background = getFill(Rectangle.fills);
        } else if (Frame) {
            background = getFill(Frame.fills);
        } else {
            background = null;
        }
    }

    // Case: Other nodes
    else if (supportedParentNodes.includes(selection.type)) {
        if (!hasFills(selection)) return;

        // @ts-expect-error Suppressing TypeScript error because selection.fills might be undefined
        background = getFill(selection.fills);

        // For now the foreground color is hardcoded to white
        foreground = [255, 255, 255, 1];

        /**Todo:  Check for the overlapping text node in the parent nodes */
    }

    const payload = { foreground, background };

    figma.ui.postMessage({ type: "UPDATE", payload });
}

function getFill(paints: Paint[] | ReadonlyArray<Paint> | PluginAPI["mixed"]) {
    if (typeof paints === "string") return null;
    if (!Array.isArray(paints)) return null;
    if (clone(paints).length === 0) return null;

    const paint = clone(paints)[0] as Paint;

    if (paint.type === "SOLID") {
        const rgb = paint.color;
        const opacity = paint.opacity || 1;

        // Denormilize the color values
        return [Math.round(rgb.r * 255), Math.round(rgb.g * 255), Math.round(rgb.b * 255), opacity];

        // Check for the Gradient background
    } else if (paint.type === "GRADIENT_LINEAR" || paint.type === "GRADIENT_RADIAL") {
        return null;
        // figma.notify("Gradient fills aren't supported yet!", { error: true });
        // return [255, 255, 255, 1];

        // Check for the other background types
    } else {
        return null;
        // figma.notify("Unsupported fill type.", { error: true });
        // return [255, 255, 255, 1];
    }
}

function clone(obj: unknown) {
    return JSON.parse(JSON.stringify(obj));
}

function hasFills(node: BaseNode) {
    return "fills" in node;
}
