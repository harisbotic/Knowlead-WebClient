import { ME, LANGUAGES, COUNTRIES, STATES, FOSES, USER, P2P, GET_FRIENDS, NOTEBOOK } from './urls';
// import { NotebookModel } from '../models/dto';

export type StorageKey = 'user' | 'languages' | 'countries' | 'states' | 'FOSes' | 'otherUser' | 'p2p' | 'friends' | 'notebook';
export interface MockType {
    value: any;
    idKey: string;
    type: 'object' | 'array';
}

export type StorageConfiguration = {
    api?: string;
    mock?: MockType;
    parameters?: string[];
};
export const STORAGE_CONFIG: {[StorageKey: string]: StorageConfiguration} = {
    'user': {api: ME},
    'languages': {api: LANGUAGES },
    'countries': {api: COUNTRIES },
    'states': {api: STATES, parameters: ['countryId']},
    'FOSes': {api: FOSES},
    'otherUser': {api: USER, parameters: ['id', 'includeDetails']},
    'p2p': {api: P2P, parameters: ['id']},
    'friends': {api: GET_FRIENDS},
    'notebook': {api: NOTEBOOK, parameters: ['id']}
};
export const STORE_ACCESS_TOKEN = 'access_token';
