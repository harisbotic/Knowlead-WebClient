import { Response } from '@angular/http';
import { ErrorModel, ResponseModel, ApplicationUserModel } from './../models/dto';
import { LoginResponse } from './../models/login.response';

function safeJsonExtraction(response: Response) {
    try {
        return response.json();
    } catch(SyntaxError) {
        return null;
    }
}

export function responseToErrorModel(response: Response): ErrorModel {
    return safeJsonExtraction(response);
}

export function responseToLoginResponse(response:Response) : LoginResponse {
    return safeJsonExtraction(response);
}

export function responseToResponseModel(response:Response) : ResponseModel {
    return safeJsonExtraction(response);
}

export function responseToUser(response:Response) : ApplicationUserModel {
    return safeJsonExtraction(response);
}

export function loginResponseToErrorModel(loginResponse: LoginResponse): ErrorModel {
    if (loginResponse.error_description != null && loginResponse.error_description != "") {
        // TODO: Translate loginResponse.error to number
        return {errorDescription: loginResponse.error_description, errorCode: null};
    } else return null;
}