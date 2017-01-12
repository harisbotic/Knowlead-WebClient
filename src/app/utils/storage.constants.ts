import { ME, LANGUAGES, COUNTRIES, STATES, FOSES, USER, P2P, GET_FRIENDS } from './urls';

export type StorageKey = 'user' | 'languages' | 'countries' | 'states' | 'FOSes' | 'otherUser' | 'p2p' | 'friends';

export type StorageConfiguration = {
    api: string;
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
    'friends': {api: GET_FRIENDS}
};
export const STORE_ACCESS_TOKEN = 'access_token';
