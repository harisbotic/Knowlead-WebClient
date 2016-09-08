import { LoginModel } from './login.model';

export class ConfirmEmail extends LoginModel {
    constructor(username="", password="", code="") {
        super(username, password);
        this.code = code;
    }
    code: string;
}