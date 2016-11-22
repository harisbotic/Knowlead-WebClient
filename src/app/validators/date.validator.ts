import * as _ from 'lodash';
import { FormControl } from '@angular/forms';

export interface DateValidatorConfiguration {
    minDate?: Date;
    minYearsOld?: number;
    maxDate?: Date;
}

export interface DateValidationErrorValue {
    actualDate: Date;
    dateConfiguration: DateValidatorConfiguration;
}

export interface DateValidatorError {
    dateInvalid: DateValidationErrorValue
}

export function dateValidator(configuration: DateValidatorConfiguration): (control: FormControl) => DateValidatorError {
    return (control : FormControl) => {
        let param = control.value;
        if (param == null)
            return null;
        let value = typeof(param) === "string" ? <Date>JSON.parse(param) : <Date>param;
        let other: Date;
        let future = false;
        if (configuration.minDate) {
            other = configuration.minDate;
        } else if (configuration.minYearsOld) {
            other = new Date();
            other.setFullYear(other.getFullYear() - configuration.minYearsOld);
        } else if (configuration.maxDate) {
            other = configuration.maxDate;
            future = true;
        } else {
            throw new Error("Invalid date validator configuration");
        }
        let ret: DateValidatorError = {
            dateInvalid: {
                actualDate: other,
                dateConfiguration: configuration
            }
        }
        if (future) {
            if (value < other) {
                return ret;
            }
        } else {
            if (value > other) {
                return ret;
            }
        }
        return null;
    }
}