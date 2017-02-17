import { ME, LANGUAGES, COUNTRIES, STATES, FOSES, USER, P2P, GET_FRIENDS, NOTEBOOK, P2P_MESSAGES, REWARDS } from './urls';
// import { NotebookModel } from '../models/dto';

export type StorageKey = 'user' | 'languages' | 'countries' | 'states' | 'FOSes' | 'otherUser' | 'p2p' | 'friends' | 'notebook' |
    'p2pMessages' | 'rewards';
export interface MockType {
    value: any;
    idKey: string;
    type: 'object' | 'array';
}

export type StorageConfiguration = {
    api?: string;
    mock?: MockType;
    parameters?: string[];
    clearOnLogout: boolean;
};
export const STORAGE_CONFIG: {[StorageKey: string]: StorageConfiguration} = {
    'user': {api: ME, clearOnLogout: true},
    'languages': {api: LANGUAGES, clearOnLogout: false },
    'countries': {api: COUNTRIES, clearOnLogout: false },
    'states': {api: STATES, parameters: ['countryId'], clearOnLogout: false},
    'FOSes': {api: FOSES, clearOnLogout: false},
    'rewards': {api: REWARDS, clearOnLogout: false},
    'otherUser': {api: USER, parameters: ['id', 'includeDetails'], clearOnLogout: false},
    'p2p': {api: P2P, parameters: ['id'], clearOnLogout: true},
    'friends': {api: GET_FRIENDS, clearOnLogout: true},
    'notebook': {api: NOTEBOOK, parameters: ['id'], clearOnLogout: true},
    'p2pMessages': {api: P2P_MESSAGES, parameters: ['id'], clearOnLogout: true}
};
export const STORE_ACCESS_TOKEN = 'access_token';
