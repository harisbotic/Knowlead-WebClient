import { Response } from '@angular/http';
import { ErrorModel, ResponseModel, ApplicationUserModel } from './../models/dto';
import { LoginResponse } from './../models/login.response';

export function responseToErrorModel(response: Response): ErrorModel {
    return response.json();
}

export function responseToLoginResponse(response:Response) : LoginResponse {
    return response.json();
}

export function responseToResponseModel(response:Response) : ResponseModel {
    return response.json();
}

export function responseToUser(response:Response) : ApplicationUserModel {
    return response.json();
}

export function loginResponseToErrorModel(loginResponse: LoginResponse): ErrorModel {
    if (loginResponse.error_description != null && loginResponse.error_description != "") {
        // TODO: Translate loginResponse.error to number
        return {errorDescription: loginResponse.error_description, errorCode: null};
    } else return null;
}