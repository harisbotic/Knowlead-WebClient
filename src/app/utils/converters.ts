import { Response } from '@angular/http';
import { ResponseModel, ApplicationUserModel } from './../models/dto';
import { LoginResponse } from './../models/login.response';
import { FrontendErrorCodes } from './../models/frontend.constants';

export function safeJsonExtraction(response: Response) {
    try {
        return response.json();
    } catch(SyntaxError) {
        return null;
    }
}

export function responseToLoginResponse(response:Response) : LoginResponse {
    return safeJsonExtraction(response);
}

export function responseToResponseModel(response:Response) : ResponseModel {
    return safeJsonExtraction(response);
}

export function responseToUser(response:Response) : ApplicationUserModel {
    return responseToResponseModel(response).object;
}

export function loginResponseToResponseModel(loginResponse: LoginResponse): ResponseModel {
    if (loginResponse == null) {
        return <ResponseModel>{errors: [FrontendErrorCodes.networkError]};
    }
    if (loginResponse.error_description != null && loginResponse.error_description != "") {
        return <ResponseModel>{errors: [loginResponse.error.toUpperCase()]};
    } else return null;
}
