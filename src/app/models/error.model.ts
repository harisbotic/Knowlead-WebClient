import { LoginResponse } from './login.response';
export class ErrorModel {
    errorCode : number;
    errorDescription : string;
    constructor(errorDescription: string, errorCode: number = null) {
        this.errorCode = errorCode;
        this.errorDescription = errorDescription;
    }
    static fromLoginResponse(loginResponse: LoginResponse): ErrorModel {
        // TODO: Translate error code to number
        return new ErrorModel(loginResponse.error_description);
    }
}