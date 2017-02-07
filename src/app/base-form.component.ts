import { BaseComponent } from './base.component';
import { FormGroup } from '@angular/forms';
import { OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
export abstract class BaseFormComponent<T> extends BaseComponent implements OnInit {
    form: FormGroup;
    protected subscriptions: Subscription[];
    abstract getNewValue(): T;
    abstract getNewForm(): FormGroup;
    abstract onSubmit();

    getValue(): T {
        if (this.form) {
            return this.form.value;
        } else {
            return null;
        }
    }

    applyFullValue(value: T) {
        const controlKeys = Object.keys(this.form.controls);
        const valueKeys = Object.keys(value);
        for (let key of valueKeys) {
            if (controlKeys.indexOf(key) === -1 && value[key] != null) {
                console.warn('Form doesn\'t contain control: ' + key);
            }
        }
        for (let key of controlKeys) {
            if (valueKeys.indexOf(key) === -1) {
                console.error('Value doesn\'t contain control: ' + key);
            }
        }
        this.form.patchValue(value);
    }

    restartForm() {
        this.form.reset();
        this.applyFullValue(this.getNewValue());
    }

    constructor() {
        super();
        this.form = this.getNewForm();
    }

    ngOnInit() {
        this.restartForm();
    }
}
