import { Response } from "@angular/http";
import { ActionModel } from "../models";

export * from "./urls";

export function mapToAction(response:Response) : ActionModel {
    return response.json().data;
}

export function urlFormEncode(data:any) : string {
    let rets = [];
    for (var key in data) {
        rets.push(key + "=" + data[key]);
    }
    return rets.join("&");
}