import { ME, LANGUAGES, COUNTRIES, STATES, FOSES, USER, P2P, GET_FRIENDS, NOTEBOOK, P2P_MESSAGES, REWARDS, FOS_VOTES } from './urls';
// import { NotebookModel } from '../models/dto';

export type StorageKey = 'user' | 'languages' | 'countries' | 'FOSes' | 'otherUser' | 'p2p' | 'friends' | 'notebook' |
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
    storeOffline?: boolean; // store to web storage ?
};
export const STORAGE_CONFIG: {[StorageKey: string]: StorageConfiguration} = {
    'user': {api: ME, clearOnLogout: true, storeOffline: true},
    'languages': {api: LANGUAGES, clearOnLogout: false, storeOffline: true },
    'countries': {api: COUNTRIES, clearOnLogout: false, storeOffline: true },
    'FOSes': {api: FOSES, clearOnLogout: false, storeOffline: true},
    'rewards': {api: REWARDS, clearOnLogout: false, storeOffline: true},
    'otherUser': {api: USER, parameters: ['id', 'includeDetails'], clearOnLogout: false, storeOffline: true},
    'p2p': {api: P2P, parameters: ['id'], clearOnLogout: true},
    'friends': {api: GET_FRIENDS, clearOnLogout: true, storeOffline: true},
    'notebook': {api: NOTEBOOK, parameters: ['id'], clearOnLogout: true},
    'p2pMessages': {api: P2P_MESSAGES, parameters: ['id'], clearOnLogout: true}
};
export const STORE_ACCESS_TOKEN = 'access_token';
export const STORE_REFRESH_TOKEN = 'refresh_token';
