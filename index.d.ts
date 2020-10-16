declare module "json-stringify-opts" {

  export function stringify(src: any, opts: JSONStringifyOptions): string;
  export default stringify;
  export = stringify;
  
  export interface DepthReplacerInfo {
      type: string;
      path: string;
      depth: number;
    }
  export type DepthReplacerFunction = (depthInfo: DepthReplacerInfo, k: string, v: any) => any;

  export interface CycleReplacerInfo {
      type: string;
      path: string;
    }
  export type CycleReplacerFunction = (cycleInfo: CycleReplacerInfo, k: string, v: any) => any;

  export interface UnsupportedReplacerInfo {
      type: string;
      path: string;
    }
  export type UnsupportedReplacerFunction = (unsupportedInfo: UnsupportedReplacerInfo, k: string, v: any) => any;

  export type JSONReplacerFunction = (k: string, v: any) => any;

  export interface JSONStringifyOptions {
    space?: number | string;
    replacer?: JSONReplacerFunction;
    depth?: number | DepthReplacerFunction;
    maxDepth?: number;
    cycle?: boolean | CycleReplacerFunction;
    unsupported?: boolean | UnsupportedReplacerFunction;
  }
}
