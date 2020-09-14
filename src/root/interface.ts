export interface Resource {
  key: string;
  value: number;
  max: number;
  cssStyle?: string;
  unlockedDefault: boolean;
}

export interface ResourceRef {
  category: string;
  id: string;
}
