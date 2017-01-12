export function extractTranslationPage(key: string): string {
    return key.split('|')[0];
}

export function extractTranslationName(key: string): string {
    return key.split('|', 2)[1];
}

export function joinTranslation(page: string, name: string, parameter?: any): string {
    return page + '|' + name + (parameter) ? ':' + parameter : '';
}
