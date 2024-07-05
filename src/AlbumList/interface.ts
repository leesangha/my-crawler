export interface GroupResponse {
  groups: Group[];
}

export interface Group {
  id: number;
  name: string;
  name_en: string;
  image: string;
}
