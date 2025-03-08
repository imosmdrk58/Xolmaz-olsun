/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "easyocr-js" {
  export default class EasyOCRWrapper {
    constructor();
    init(language: string): Promise<string>;
    readText(imagePath: string): Promise<string>;
    close(): Promise<string>;
  }
}



declare module "gtts" {
  class gtts {
    constructor(text: string, lang?: string);
    save(filepath: string, callback: (err?: Error) => void): void;
    stream(): any;
  }
  export = gtts;
}
