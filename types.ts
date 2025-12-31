export type AppMode = 'ADMIN' | 'USER';

export interface FormValues {
  [key: string]: string;
}

export type PresetType = 'promo' | 'event' | 'cert';

export interface PresetTemplate {
  name: string;
  type: PresetType;
  html: string;
  icon: string;
}