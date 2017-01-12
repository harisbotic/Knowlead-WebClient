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
    dateInvalid: DateValidationErrorValue;
}

export function dateValidator(configuration: DateValidatorConfiguration): (control: FormControl) => DateValidatorError {
    return (control: FormControl) => {
        let param = control.value;
        if (param == null) {
            return null;
        }
        let value = typeof(param) === 'string' ? <Date>JSON.parse(param) : <Date>param;
        let invalid = false;
        if (configuration.minDate) {
            invalid = invalid || value < configuration.minDate;
        } else if (configuration.minYearsOld) {
            let other = new Date();
            other.setFullYear(other.getFullYear() - configuration.minYearsOld);
            invalid = invalid || value > other;
        } else if (configuration.maxDate) {
            invalid = invalid || value > configuration.maxDate;
        } else {
            throw new Error('Invalid date validator configuration');
        }
        let ret: DateValidatorError = {
            dateInvalid: {
                actualDate: value,
                dateConfiguration: configuration
            }
        };
        if (invalid) {
            return ret;
        }
        return null;
    };
}
