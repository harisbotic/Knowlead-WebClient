import { ErrorModel } from "./error.model";

export class ActionModel {
    success: boolean;
    errorList: ErrorModel[];
    errorMap: {[key: string] : ErrorModel[]};

    constructor(success: boolean = true, errors: ErrorModel | ErrorModel[] = null, errorMap: {[key: string] : ErrorModel[]} = null) {
        this.success = success;
        if (errors != null)
            this.errorList = [].concat(errors);
        this.errorMap = errorMap;
    }

    static success(): ActionModel {
        return new ActionModel(true);
    }

    static failList(errors: ErrorModel | ErrorModel[]) {
        return new ActionModel(false, errors);
    }

    static failString(error: string) {
        return new ActionModel(false, new ErrorModel(error, null));
    }
}