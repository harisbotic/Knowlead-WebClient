import { BaseComponent } from './base.component';
import { FormGroup } from '@angular/forms';
import { OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Rx';
import { ResponseModel } from './models/dto';
export abstract class BaseFormComponent<T> extends BaseComponent implements OnInit {
    form: FormGroup;
    wasSet = false;
    protected subscriptions: Subscription[];
    abstract getNewValue(): T | Observable<T>;
    abstract getNewForm(): FormGroup;
    abstract submit();

    getValue(): T {
        if (this.form) {
            return this.form.value;
        } else {
            return null;
        }
    }

    applyFullValue(value: T) {
        this.wasSet = true;
        if (value == null) {
            console.warn('Value for form was null');
            this.form.reset();
            return;
        }
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
        let tmp = this.getNewValue();
        if (!(tmp instanceof Observable)) {
            tmp = Observable.of(tmp);
        }
        tmp.take(1).subscribe(value => {
            this.applyFullValue(value);
        });
        for (let key of Object.keys(this.form.controls)) {
            this.form.controls[key].setErrors(null);
            this.form.controls[key].disable();
            this.form.controls[key].markAsPristine();
        }
        this.form.setErrors(null);

        // This is necessary because custom forms need a status change event
        // so that form control directive registers it is pristine
        setTimeout(() => {
            for (let key of Object.keys(this.form.controls)) {
                this.form.controls[key].enable();
            }
        }, 200);
    }

    constructor() {
        super();
        this.form = this.getNewForm();
    }

    ngOnInit() {
        if (!this.wasSet) {
            this.restartForm();
        }
    }

    onSubmit() {
        this.form.markAsDirty();
        for (let control of Object.keys(this.form.controls)) {
            this.form.controls[control].markAsDirty();
        }
        this.applyFullValue(this.getValue());
        if (this.form.valid) {
            this.submit();
        }
    }

    errorHandler = (err: ResponseModel) => {
        for (let key of Object.keys(err.formErrors)) {
            if (!this.form.controls[key]) {
                console.error('Got error from backend for ' + key + ' but form doesnt contain control for that');
                continue;
            }
            this.form.controls[key].setErrors({backend: err.formErrors[key][0]});
        }
    }
}
