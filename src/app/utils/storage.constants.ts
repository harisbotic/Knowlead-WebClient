import { ME, LANGUAGES, COUNTRIES, STATES } from './urls';
import { ApplicationUserModel } from './../models/dto';

export type StorageConfiguration = {
    api: string;
    parameters?: string[];
}
export const STORAGE_CONFIG: {[key: string] : StorageConfiguration} = {
    "user": {api: ME},
    "languages": {api: LANGUAGES },
    "countries": {api: COUNTRIES },
    "states": {api: STATES, parameters: ["countryId"]}
};
export const STORE_ACCESS_TOKEN = "access_token";