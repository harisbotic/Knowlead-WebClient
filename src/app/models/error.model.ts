import { LoginResponse } from './login.response';
import { BaseModel } from './base.response';
import { Response } from '@angular/http';
export class ErrorModel extends BaseModel {
    errorCode : number;
    errorDescription : string;
    constructor(errorDescription: string, errorCode: number = null) {
        super();
        this.errorCode = errorCode;
        this.errorDescription = errorDescription;
    }
    static fromLoginResponse(loginResponse: LoginResponse): ErrorModel {
        // TODO: Translate error code to number
        return new ErrorModel(loginResponse.error_description);
    }
    static fromResponse(response: Response) {
        let j = response.json();
        return new ErrorModel(j.errorDescription, j.errorCode);
    }
}