import { Response } from "@angular/http";
import { LoginResponse, ActionResponse } from "../models";

export * from "./urls";

export function mapToLoginResponse(response:Response) : LoginResponse {
    return response.json();
}

export function mapToActionResponse(response:Response) : ActionResponse {
    return response.json();
}

export function urlFormEncode(data:any) : string {
    let rets = [];
    for (var key in data) {
        rets.push(key + "=" + data[key]);
    }
    return rets.join("&");
}