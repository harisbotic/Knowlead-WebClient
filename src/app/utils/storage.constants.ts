import { ME, LANGUAGES, COUNTRIES, STATES, FOSES, USER, P2P } from './urls';
import { ApplicationUserModel } from './../models/dto';

export type StorageKey = "user" | "languages" | "countries" | "states" | "FOSes" | "otherUser" | "p2p";

export type StorageConfiguration = {
    api: string;
    parameters?: string[];
}
export const STORAGE_CONFIG: {[StorageKey: string] : StorageConfiguration} = {
    "user": {api: ME},
    "languages": {api: LANGUAGES },
    "countries": {api: COUNTRIES },
    "states": {api: STATES, parameters: ["countryId"]},
    "FOSes": {api: FOSES},
    "otherUser": {api: USER, parameters: ["id", "includeDetails"]},
    "p2p": {api: P2P, parameters: ["id"]}
};
export const STORE_ACCESS_TOKEN = "access_token";
