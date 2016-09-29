import { ME } from './urls';
import { ApplicationUserModel } from './../models/dto';

export type StorageConfiguration = {
    api: string;
}
export const STORAGE_CONFIG: {[key: string] : StorageConfiguration} = {
    "user": {api: ME}
};
export const STORE_ACCESS_TOKEN = "access_token";