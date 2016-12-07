import * as _ from 'lodash';
import { PATTERN_EMAIL, PATTERN_ONE_LOWERCASE } from './index';
import { DateValidationErrorValue } from '../validators/date.validator';
type translatable = (key: string, value: any) => string;

interface MinLengthInterface {
    actualLength: number,
    requiredLength: number
}
function translateMinLengthValidator(key: string, value: MinLengthInterface): string {
    return "PASSWORD_LENGHT_VALIDATION:" + value.requiredLength;
}

interface PatternInterface {
    actialValue: string,
    requiredPattern: string
}
function translatePatternValidator(key: string, value: PatternInterface): string {
    let fullPattern = value.requiredPattern.substring(1, value.requiredPattern.length - 1);
    if (fullPattern == PATTERN_EMAIL) {
        return "EMAIL_INVALID";
    } else if (fullPattern == PATTERN_ONE_LOWERCASE) {
        return "PASSWORD_LOWERCASE_VALIDATION";
    } else {
        return null;
    }
}
let translateDict = {
    "required": "REQUIRED_FIELD",
    "passwords_dont_match": "PASSWORD_DONT_MATCH"
};
function translateByKeyValidator(key: string, value: boolean): string {
    return translateDict[key];
}

function translateDateValidator(key: string, value: DateValidationErrorValue): string {
    if (value.dateConfiguration.minYearsOld) {
        return "DATE_TOO_YOUNG:" + value.dateConfiguration.minYearsOld;
    } else if (value.dateConfiguration.minDate) {
        return "DATE_TOO_EARLY:" + value.dateConfiguration.minDate.toLocaleDateString();
    } else if (value.dateConfiguration.maxDate) {
        return "DATE_TOO_LATE:" + value.dateConfiguration.maxDate.toLocaleDateString();
    } else {
        return null;
    }
}

let dict: {[index: string]: translatable} = {
    "minlength": translateMinLengthValidator,
    "required": translateByKeyValidator,
    "pattern": translatePatternValidator,
    "passwords_dont_match": translateByKeyValidator,
    "dateInvalid": translateDateValidator
};

export function translateValidations(object: {[key: string]: any}): string[] {
    return Object.keys(object || {}).map((key) => {
        let fn = dict[key];
        let ret = null;
        if (fn)
            ret = fn(key, object[key]);
        if (ret == null || !fn) {
            console.warn("No validator translation for " + key);
            console.warn(object[key]);
        }
        return ret;
    }).filter((v) => v);
}
