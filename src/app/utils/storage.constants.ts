import { ME, LANGUAGES, COUNTRIES, STATES, FOSES } from './urls';
import { ApplicationUserModel } from './../models/dto';

export type StorageKey = "user" | "languages" | "countries" | "states" | "FOSes";

export type StorageConfiguration = {
    api: string;
    parameters?: string[];
}
export const STORAGE_CONFIG: {[StorageKey: string] : StorageConfiguration} = {
    "user": {api: ME},
    "languages": {api: LANGUAGES },
    "countries": {api: COUNTRIES },
    "states": {api: STATES, parameters: ["countryId"]},
    "FOSes": {api: FOSES}
};
export const STORE_ACCESS_TOKEN = "access_token";
