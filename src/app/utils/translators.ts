import * as _ from 'lodash';
import { PATTERN_EMAIL, PATTERN_ONE_LOWERCASE } from './index';
type translatable = (key: string, value: any) => string;

interface MinLengthInterface {
    actualLength: number,
    requiredLength: number
}
function translateMinLengthValidator(key: string, value: MinLengthInterface): string {
    return "validation:minlength:" + value.requiredLength;
}

interface PatternInterface {
    actialValue: string,
    requiredPattern: string
}
function translatePatternValidator(key: string, value: PatternInterface) {
    let fullPattern = value.requiredPattern.substring(1, value.requiredPattern.length - 1);
    if (fullPattern == PATTERN_EMAIL) {
        return "validation:email_invalid";
    } else if (fullPattern == PATTERN_ONE_LOWERCASE) {
        return "validation:one_lowercase";
    } else {
        return null;
    }
}

function translateByKeyValidator(key: string, value: boolean): string {
    return "validation:" + key;
}
let dict: {[index: string]: translatable} = {
    "minlength": translateMinLengthValidator,
    "required": translateByKeyValidator,
    "pattern": translatePatternValidator,
    "passwords_dont_match": translateByKeyValidator
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
