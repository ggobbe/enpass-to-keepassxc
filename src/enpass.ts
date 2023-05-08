// Enpass JSON export structure
export interface EnpassExport {
  folders: EnpassTag[]; // Enpass tags are named `folders` in JSON export
  items: EnpassItem[];
}

export interface EnpassTag {
  icon: string;
  parent_uuid: string;
  title: string;
  updated_at: number;
  uuid: string;
}

export interface EnpassItem {
  title: string;
  subtitle: string;
  category: string;
  fields: EnpassField[];
  folders: string[];
  note: string;

  createdAt: number;
  updated_at: number;

  archived: number;
  trashed: number;
}

export interface EnpassField {
  label: string;
  type: string;
  value: string;
  uid: string;

  deleted: number;
}
