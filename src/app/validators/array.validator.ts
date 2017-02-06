import { FormControl } from '@angular/forms';
export interface ArrayValidatorConfiguration {
  min?: number;
  max?: number;
}

export interface ArrayValidatorError {
  shorter: boolean;
  longer: boolean;
  notArray: boolean;
}

export function ArrayValidator(configuration?: ArrayValidatorConfiguration) {
  return (control: FormControl) => {
    if (control.value == null) {
      return null;
    }
    if (!Array.isArray(control.value)) {
      return {
        notArray: true
      };
    }
    if (configuration) {
      if (configuration.min != null && control.value.length < configuration.min) {
        return {
          shorter: true
        };
      }
      if (configuration.max != null && control.value.length > configuration.max) {
        return {
          longer: true
        };
      }
    }
  };
}
