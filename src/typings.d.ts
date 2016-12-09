// Typings reference file, see links for more information
// https://github.com/typings/typings
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

declare var System: any;
declare var module: { id: string };
declare var require: any;
declare type DataReceived = (data: any) => void;
declare type ErrorHandler = (e: any) => void;
declare type ConnectionClosed = (e?: any) => void;