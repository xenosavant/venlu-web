export interface IFilter {
    key: string;
    title: string;
    type: 'checkbox' | 'radio';
    options: { key: string, value: string, count?: number }[];
    selected: string[];
}