export const PLACEHOLDER_IMAGE = '/dummy-poster.png';

export const CITY_KEYS = [
    'all',
    'almaty',
    'astana',
    'shymkent',
    'karaganda',
    'aktobe',
    'ustKamenogorsk',
    'pavlodar',
] as const;

export type CityKey = (typeof CITY_KEYS)[number];

export const CITY_VALUES: Record<CityKey, string> = {
    all: '',
    almaty: 'Алматы',
    astana: 'Астана',
    shymkent: 'Шымкент',
    karaganda: 'Караганда',
    aktobe: 'Актобе',
    ustKamenogorsk: 'Усть-Каменогорск',
    pavlodar: 'Павлодар',
};
