export function getFgAndBg(selection: SceneNode) {
    // const selection = figma.currentPage.selection[0];
    let foreground;
    let background;
    if (!selection) return;

    const supportedParentNodes = ["FRAME", "RECTANGLE", "ELLIPSE", "VECTOR", "STAR", "GROUP", "COMPONENT", "INSTANCE"];

    // Case: Text node
    if (selection.type === "TEXT") {
        foreground = getForeground(selection);
        background = getBackground(selection.parent);
    }

    // Case: Frame node
    else if (selection.type === "FRAME" || selection.type === "GROUP") {
        // Check for the text color in the child text node
        const textNode = selection.findOne((node) => node.type === "TEXT") as TextNode | null;

        if (!textNode) {
            // console.log("No text node found within the frame");
            foreground = [255, 255, 255, 1];
            background = getBackground(selection);
        } else {
            foreground = getForeground(textNode);
            background = getBackground(textNode?.parent);
        }
    }

    // Case: Other nodes
    else if (supportedParentNodes.includes(selection.type)) {
        let textNode;

        if ("findOne" in selection) {
            textNode = selection.findOne((node) => node.type === "TEXT") as TextNode | null;

            if (!textNode && selection.parent && selection.parent.type === "PAGE") {
                textNode = selection.parent.findOne((node) => node.type === "TEXT") as TextNode | null;
            }
        }

        if (textNode) {
            foreground = getForeground(textNode);
        } else {
            foreground = [255, 255, 255, 1];
        }

        background = getBackground(selection);
    }

    const payload = { foreground, background };

    return payload;
}

function getForeground(selection: TextNode) {
    const textOpacity = selection.opacity;

    const textSegments = selection.getStyledTextSegments(["fills"]);
    const foreground = getFill(textSegments[0].fills);
    if (textOpacity < 1 && foreground && foreground[foreground.length - 1] === 1) {
        foreground.pop();
        foreground.push(textOpacity);
    }

    return foreground;
}

function getBackground(node: any) {
    // console.log("getbg", node);

    if ("fills" in node && node.fills.length > 0) {
        return getFill(node.fills);
    } else if (node.type === "PAGE") {
        // console.log("getting bg for page node", node);

        return getFill(node.backgrounds);
    } else if ("parent" in node) {
        return getBackground(node.parent);
    }
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

function getAllTextNodes(node: SceneNode): TextNode[] | undefined {
    let textNodes: TextNode[] = [];

    if (!("findAll" in node)) {
        figma.notify("Unsupported node type.");
        figma.ui.postMessage({ type: "RESET_AUDIT" });
        return;
    }

    textNodes = node.findAll((node) => node.type === "TEXT") as TextNode[];
    return textNodes.filter((node) => node.visible);
}

export function AuditNodes() {
    let textNodes = getAllTextNodes(figma.currentPage.selection[0]);

    let data = [];

    if (textNodes?.length === 0) {
        figma.notify("No text nodes found.");
        figma.ui.postMessage({ type: "RESET_AUDIT" });
        return;
    }

    if (!textNodes) {
        figma.notify("Unable to process the selected node.");
        figma.ui.postMessage({ type: "RESET_AUDIT" });
        return;
    }

    for (let node of textNodes) {
        let foreground = getForeground(node);
        let background = getBackground(node.parent);
        let name = node.name.length > 20 ? `${node.name.slice(0, 20)}...` : node.name;
        let id = node.id;

        data.push({ foreground, background, name, id });
    }

    return data;
}
