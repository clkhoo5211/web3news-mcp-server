// Type declarations for html-to-text
// Note: @types/html-to-text is installed, but this ensures compatibility
declare module 'html-to-text' {
  export interface Options {
    wordwrap?: number | false | null;
    ignoreLinks?: boolean;
    ignoreImages?: boolean;
    [key: string]: any;
  }
  
  export function convert(html: string, options?: Options): string;
}

