export class ErrorModel {
    errorCode : number;
    errorDescription : string;
    constructor(errorDescription: string, errorCode: number = null) {
        this.errorCode = errorCode;
        this.errorDescription = errorDescription;
    }
}