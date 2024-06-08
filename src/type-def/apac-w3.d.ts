declare module 'apca-w3' {
  /**
   * Calculates the APCA contrast between two colors.
   * @param txtY - The luminance of the text color.
   * @param bgY - The luminance of the background color.
   * @param places - Optional parameter to specify the number of decimal places in the result.
   * @returns The calculated contrast as a number.
   */
  export function APCAcontrast(txtY: number, bgY: number, places?: number): number;

  /**
   * Converts sRGB color values to luminance (Y).
   * @param rgb - An array representing the sRGB color values.
   * @returns The calculated luminance.
   */
  export function sRGBtoY(rgb: number[]): number;

  /**
   * Converts Display P3 color values to luminance (Y).
   * @param rgb - An array representing the Display P3 color values.
   * @returns The calculated luminance.
   */
  export function displayP3toY(rgb: number[]): number;

  /**
   * Converts Adobe RGB color values to luminance (Y).
   * @param rgb - An array representing the Adobe RGB color values.
   * @returns The calculated luminance.
   */
  export function adobeRGBtoY(rgb: number[]): number;

  /**
   * Blends two colors considering their alpha values.
   * @param rgbaFG - An array representing the foreground color with alpha.
   * @param rgbBG - An array representing the background color.
   * @param round - Optional boolean to round the resulting color values.
   * @returns An array representing the blended color.
   */
  export function alphaBlend(rgbaFG: number[], rgbBG: number[], round?: boolean): number[];

  /**
   * Looks up the appropriate font size and weight based on the contrast.
   * @param contrast - The contrast value.
   * @param places - Optional parameter to specify the number of decimal places in the result.
   * @returns An array containing the font size and weight recommendations.
   */
  export function fontLookupAPCA(contrast: number, places?: number): number[];

  /**
   * Calculates APCA contrast for given text and background colors.
   * @param textColor - The text color in hexadecimal format.
   * @param bgColor - The background color in hexadecimal format.
   * @param places - Optional parameter to specify the number of decimal places in the result.
   * @param round - Optional boolean to indicate whether to round the result.
   * @returns The calculated contrast as a number.
   */
  export function calcAPCA(textColor: string, bgColor: string, places?: number, round?: boolean): number;

  // Placeholder for other functions that might be part of the module
  // Add additional function signatures here as needed
}