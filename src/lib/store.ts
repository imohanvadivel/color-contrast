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
            fgColor = sanitizeHex(fgColor);
            update((prev) => ({ ...prev, foreground: fgColor }));
        }
    }

    function setForegroundOpacity(opacity: number) {
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

export function calculateContrast(foregroundColor: string, backgroundColor: string, foregroundOpacity: number) {
    let foreground = foregroundColor;
    const background = backgroundColor;
    const opacity = foregroundOpacity;

    if (opacity < 1) {
        const foregroundColor = alphaBlend([...hex2Rgb(foreground), opacity], hex2Rgb(background)) as RGBColor;
        foreground = rgb2Hex(foregroundColor);
    }

    const wcag = calcWcag2(foreground, background).toFixed(2).toString();
    const bridgeLc = calcBPCA(foreground, background) as number;
    const bpca = parseFloat(bridgeRatio(bridgeLc, foreground, background, "")).toString();
    const apca = calcAPCA(foreground, background).toFixed(2).toString();

    let wcagScore = {
        largeText: {
            aa: parseFloat(wcag) >= 3,
            aaa: parseFloat(wcag) >= 4.5,
        },
        normalText: {
            aa: parseFloat(wcag) >= 4.5,
            aaa: parseFloat(wcag) >= 7,
        },
        passed: parseFloat(wcag) >= 4.5,
    };

    let bpcaScore = {
        largeText: {
            aa: parseFloat(bpca) >= 3,
            aaa: parseFloat(bpca) >= 4.5,
        },
        normalText: {
            aa: parseFloat(bpca) >= 4.5,
            aaa: parseFloat(bpca) >= 7,
        },
        passed: parseFloat(bpca) >= 4.5,
    };

    let apcaScore = {
        largeText: Math.abs(parseFloat(apca)) >= 45,
        normalText: Math.abs(parseFloat(apca)) >= 75,
        passed: Math.abs(parseFloat(apca)) >= 75,
    };

    return { wcag: wcagScore, bpca: bpcaScore, apca: apcaScore };
}

export const isConformanceShown = writable(false);

export const isAuditRan = writable(false);

export type WCAGContrastData = {
    largeText: {
        aa: boolean;
        aaa: boolean;
    };
    normalText: {
        aa: boolean;
        aaa: boolean;
    };
    passed: boolean;
};
export type APCAContrastData = {
    largeText: boolean;
    normalText: boolean;
    passed: boolean;
};

export type AuditData = {
    contrast: {
        wcag: WCAGContrastData;
        bpca: WCAGContrastData;
        apca: APCAContrastData;
    };
    name: string;
    id: string;
};

export const auditData = writable<AuditData[]>([]);

export const selectedContrast = writable<{ value: "wcag" | "bpca" | "apca"; label: string; selected: boolean }>({
    value: "wcag",
    label: "WCAG 2",
    selected: true,
});

export const contrastAlgorithm = writable<{ value: "wcag" | "bpca" | "apca"; label: string; selected: boolean }[]>([
    { value: "wcag", label: "WCAG 2", selected: true },
    { value: "bpca", label: "BPCA", selected: false },
    { value: "apca", label: "APCA", selected: false },
]);

export const violatedData = derived([auditData, selectedContrast], ([$auditData, $selectedContrast]) => {
    return $auditData.filter((item) => !item.contrast[$selectedContrast.value].passed);
});

export const totalViolations = derived(violatedData, ($violatedData) => {
    return $violatedData.length || 0;
});
