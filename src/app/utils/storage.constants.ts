import { ME, LANGUAGES, COUNTRIES, STATES, FOSES, USER, P2P, GET_FRIENDS } from './urls';
import { UserNotebookModel } from '../models/dto';

export type StorageKey = 'user' | 'languages' | 'countries' | 'states' | 'FOSes' | 'otherUser' | 'p2p' | 'friends' | 'notebook';
export interface MockType {
    value: any;
    idKey: string;
    type: 'object' | 'array';
}

export const notebooksMock: UserNotebookModel[] = [{
    userNotebookId: 0,
    name: 'ime',
    markdown: 'tekst',
    createdAt: new Date(),
    createdById: '',
    createdBy: undefined,
    imageBlobId: undefined,
    imageBlob: undefined
}, {
    userNotebookId: 1,
    name: 'drugi notebook',
    markdown: 'ovo ono he he he',
    createdAt: new Date(2000, 10, 10),
    createdById: '',
    createdBy: undefined,
    imageBlobId: undefined,
    imageBlob: undefined
}];

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
    'notebook': {mock: {idKey: 'userNotebookId', value: notebooksMock, type: 'array'}, parameters: ['id']}
};
export const STORE_ACCESS_TOKEN = 'access_token';
