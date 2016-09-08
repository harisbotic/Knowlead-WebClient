import { LoginModel } from "./login.model";

export class RegisterModel extends LoginModel {
    constructor(email: string = "", password: string = "", username: string = "") {
        super(username, password);
        this.username = username;
    }
    username: string;
}