import { derived, writable } from "svelte/store";
import { bridgeRatio, calcBPCA, calcWcag2, hex2Rgb, isValidHex, rgb2Hex, sanitizeHex } from "./util.ts";
import { alphaBlend, calcAPCA } from "apca-w3";

type RGBColor = [number, number, number];

type Color = {
    foreground: string;
    foregroundOpacity: number;
    background: string;
};

function createColorStore(input: Color) {
    const { subscribe, set, update } = writable<Color>(input);

    function setBackground(color: string | RGBColor) {
        let bgColor = Array.isArray(color) ? rgb2Hex(color) : color;
        if (isValidHex(bgColor)) {
            bgColor = sanitizeHex(bgColor);
            update((prev) => ({ ...prev, background: bgColor }));
        }
    }

    function setForeground(color: string | RGBColor) {
        let fgColor = Array.isArray(color) ? rgb2Hex(color) : color;
        if (isValidHex(fgColor)) {
            console.log({ fgColor });

            fgColor = sanitizeHex(fgColor);
            update((prev) => ({ ...prev, foreground: fgColor }));
        }
    }

    function setForegroundOpacity(opacity: number) {
        console.log({ opacity });

        if (!isNaN(opacity)) {
            opacity = opacity / 100;
            opacity = Math.min(1, Math.max(0, opacity));
            update((prev) => ({ ...prev, foregroundOpacity: opacity }));
        }
    }

    return { subscribe, set, setBackground, setForeground, setForegroundOpacity };
}

export const colorStore = createColorStore({ foreground: "#000", foregroundOpacity: 1, background: "#FFF" });

type Contrast = {
    wcag: number;
    bpca: number;
    apca: number;
};

export const contrast = derived(
    colorStore,
    ($color, set) => {
        let foreground = $color.foreground;
        const background = $color.background;
        const opacity = $color.foregroundOpacity;

        if (opacity < 1) {
            const foregroundColor = alphaBlend([...hex2Rgb(foreground), opacity], hex2Rgb(background)) as RGBColor;
            foreground = rgb2Hex(foregroundColor);
        }

        const wcag = calcWcag2(foreground, background).toFixed(2).toString();
        const bridgeLc = calcBPCA(foreground, background) as number;
        const bpca = parseFloat(bridgeRatio(bridgeLc, foreground, background, "")).toString();
        const apca = calcAPCA(foreground, background).toFixed(2).toString();

        set({ wcag: parseFloat(wcag), bpca: parseFloat(bpca), apca: parseFloat(apca) });
    },
    {} as Contrast
);
