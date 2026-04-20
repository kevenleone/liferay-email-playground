import { faker } from '@faker-js/faker';

export type VariablePreset = {
    name: string;
    value: () => string;
};

export const PRESET_VARIABLES: VariablePreset[] = [
    { name: 'USER_NAME', value: () => faker.person.fullName() },
    { name: 'FIRST_NAME', value: () => faker.person.firstName() },
    { name: 'LAST_NAME', value: () => faker.person.lastName() },
    { name: 'EMAIL', value: () => faker.internet.email() },
    { name: 'COMPANY_NAME', value: () => faker.company.name() },
    { name: 'PHONE_NUMBER', value: () => faker.phone.number() },
    { name: 'ADDRESS', value: () => faker.location.streetAddress() },
    { name: 'CITY', value: () => faker.location.city() },
    { name: 'DATE', value: () => faker.date.recent().toLocaleDateString() },
    {
        name: 'ORDER_ID',
        value: () => `ORD-${faker.string.alphanumeric(6).toUpperCase()}`,
    },
    { name: 'TRANSACTION_ID', value: () => faker.string.uuid() },
    { name: 'AMOUNT', value: () => faker.commerce.price({ symbol: '$' }) },
    { name: 'PRODUCT_NAME', value: () => faker.commerce.productName() },
    { name: 'DEPARTMENT', value: () => faker.commerce.department() },
    {
        name: 'IMAGE_URL',
        value: () =>
            `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/600/400`,
    },
    { name: 'AVATAR_URL', value: () => faker.image.avatar() },
];

export const VARIABLE_PATTERN = /\[%(\w+)%\]/g;

export function extractVariables(...sources: (string | undefined | null)[]): string[] {
    const found = new Set<string>();

    for (const source of sources) {
        if (!source) continue;

        for (const match of source.matchAll(VARIABLE_PATTERN)) {
            found.add(match[1]);
        }
    }

    return [...found];
}

export function guessPreset(name: string): VariablePreset | null {
    const lower = name.toLowerCase();
    const find = (n: string) =>
        PRESET_VARIABLES.find((preset) => preset.name === n) ?? null;

    if (/avatar|profile.?pic/.test(lower)) return find('AVATAR_URL');
    if (/image|photo|picture|banner|thumbnail|logo/.test(lower))
        return find('IMAGE_URL');
    if (/first.?name/.test(lower)) return find('FIRST_NAME');
    if (/last.?name|surname/.test(lower)) return find('LAST_NAME');
    if (/email/.test(lower)) return find('EMAIL');
    if (/phone/.test(lower)) return find('PHONE_NUMBER');
    if (/address|street/.test(lower)) return find('ADDRESS');
    if (/company|organization/.test(lower)) return find('COMPANY_NAME');
    if (/city/.test(lower)) return find('CITY');
    if (/order.?id|order.?number/.test(lower)) return find('ORDER_ID');
    if (/transaction/.test(lower)) return find('TRANSACTION_ID');
    if (/amount|price|total/.test(lower)) return find('AMOUNT');
    if (/product/.test(lower)) return find('PRODUCT_NAME');
    if (/department|dept/.test(lower)) return find('DEPARTMENT');
    if (/date/.test(lower)) return find('DATE');
    if (/name/.test(lower)) return find('USER_NAME');

    return null;
}
