import { BaseModel } from './base.response';
export class LoginModel extends BaseModel {
    email: string;
    password: string;
    constructor(email: string, password: string) {
        super();
        this.email = email;
        this.password = password;
    }
}