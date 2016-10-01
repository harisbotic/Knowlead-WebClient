export function extractTranslationPage(key: string): string {
    return key.split(":")[0];
}

export function extractTranslationName(key: string): string {
    return key.split(":", 2)[1];
}