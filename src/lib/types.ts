export type FieldType = 'string' | 'number' | 'boolean' | 'date';

export interface AppModel {
  [fieldName: string]: FieldType;
}

export interface AppStructure {
  pages: string[];
  features: string[];
  models: Record<string, AppModel>;
}