import { alphaBlend, calcAPCA } from "apca-w3";
import { calcBPCA, bridgeRatio } from "./bridge-pca.js";

// https://www.w3.org/TR/WCAG20/#relativeluminancedef
function getLuminance(hex: string) {
    const a = hex2Rgb(hex).map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });

    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}
export function calcWcag2(foreground: string, background: string) {
    const foregroundLum = getLuminance(foreground);
    const backgroundLum = getLuminance(background);

    const ratio = (Math.max(foregroundLum, backgroundLum) + 0.05) / (Math.min(foregroundLum, backgroundLum) + 0.05);

    return ratio;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function postFigma(msg: any) {
    parent.postMessage({ pluginMessage: msg }, "*");
}

export { calcBPCA, alphaBlend, calcAPCA, bridgeRatio };

export function rgb2Hex(rgb: number[], isNormalized = false) {
    const r = isNormalized ? rgb[0] * 255 : rgb[0];
    const g = isNormalized ? rgb[1] * 255 : rgb[1];
    const b = isNormalized ? rgb[2] * 255 : rgb[2];

    // const R = Math.round(r).toString(16).padStart(2, "0");
    // const G = Math.round(g).toString(16).padStart(2, "0");
    // const B = Math.round(b).toString(16).padStart(2, "0");

    const R = Math.round(r).toString(16).toUpperCase();
    const G = Math.round(g).toString(16).toUpperCase();
    const B = Math.round(b).toString(16).toUpperCase();

    // Manually pad the strings to ensure they are always two characters long
    // padStart is not supported in figma, since figma currently support es2016
    const paddedR = R.length === 1 ? "0" + R : R;
    const paddedG = G.length === 1 ? "0" + G : G;
    const paddedB = B.length === 1 ? "0" + B : B;

    return `#${paddedR}${paddedG}${paddedB}`;
}

export function hex2Rgb(hex: string) {
    // Remove the hash character
    hex = hex.replace("#", "");

    // check if the hex value is shorthand
    if (hex.length === 3) {
        hex = hex
            .split("")
            .map((char) => char + char)
            .join("");
    }

    // Parse the hex value into RGB components
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    return [r, g, b];
}

export function sanitizeHex(hex: string, allowShort: boolean = false) {
    // Add # if missing
    if (hex.charAt(0) !== "#") {
        hex = "#" + hex;
    }

    // convert short hex to long hex
    if (allowShort && hex.length === 4) {
        hex = hex.replace(/^#(.)(.)(.)$/, "#$1$1$2$2$3$3");
    }

    return hex.toUpperCase();
}

export function isValidHex(hex: string, allowAlpha: boolean = false) {
    if (allowAlpha) {
        return /^#?([0-9A-Fa-f]{4}){1,2}$/.test(hex);
    } else {
        return /^#?([0-9A-Fa-f]{3}){1,2}$/.test(hex);
    }
}

export function processFgAndBg(payload: { foreground: number[]; background: number[] }) {
    const { foreground, background } = payload;

    let foregroundColor = "#000";
    let backgroundColor = "#FFF";
    let foregroundOpacity = 1;

    foregroundOpacity = foreground && (foreground.pop() as number);
    background && background.pop();

    foregroundColor = foreground === null ? foregroundColor : rgb2Hex(foreground);
    backgroundColor = backgroundColor === null ? backgroundColor : rgb2Hex(background);

    return { foregroundColor, backgroundColor, foregroundOpacity };
}
