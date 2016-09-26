import { ME } from './urls';
import { BaseModel } from './../models/base.response';
import { User } from './../models/user.model';
export type StorageConfiguration = {
    api: string;
    type: typeof BaseModel;
}
export const STORAGE_CONFIG: {[key: string] : StorageConfiguration} = {
    "user": {api: ME, type: User}
};
export const STORE_ACCESS_TOKEN = "access_token";