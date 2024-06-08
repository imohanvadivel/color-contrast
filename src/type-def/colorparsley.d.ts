// Define the ColorParsley namespace to encapsulate all exports
declare namespace ColorParsley {

  // Function signature for colorParsley
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function colorParsley(colorIn: any): number[];

  // Function signature for parseString
  export function parseString(colorString: string): number[];

  // Function signature for colorToHex
  export function colorToHex(rgba: number[], allow3: boolean): string;

  // Function signature for colorToRGB
  export function colorToRGB(rgba: number[], round: boolean): string;
}

// Export the entire namespace so it can be imported elsewhere
export = ColorParsley;