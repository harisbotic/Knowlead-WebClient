import { BaseModel } from './base.response';
export class User extends BaseModel {
    username: String;
    emailConfirmed: boolean;
}