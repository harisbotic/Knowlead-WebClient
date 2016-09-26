import { ErrorModel } from "./error.model";
import { BaseModel } from './base.response';

export class ActionResponse extends BaseModel {
    success: boolean;
    errorList: ErrorModel[];
    errorMap: {[key: string] : ErrorModel[]};

    constructor(success: boolean = true, errors: ErrorModel | ErrorModel[] = null, errorMap: {[key: string] : ErrorModel[]} = null) {
        super();
        this.success = success;
        if (errors != null)
            this.errorList = [].concat(errors);
        this.errorMap = errorMap;
    }

    static success(): ActionResponse {
        return new ActionResponse(true);
    }

    static failList(errors: ErrorModel | ErrorModel[]) {
        return new ActionResponse(false, errors);
    }

    static failString(error: string) {
        return new ActionResponse(false, new ErrorModel(error, null));
    }
}