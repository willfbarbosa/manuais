export interface BrandItem {
  id: string;
  name: string;
  description?: string;
  color?: string; // hex or tailwind theme color
}

export interface CategoryItem {
  id: string;
  name: string;
  description?: string;
  iconName?: string;
}

export type BrandType = string;
export type CategoryType = string;

export interface Manual {
  id: string;
  title: string;
  brand: BrandType;
  category: CategoryType;
  model: string;
  version: string;
  description: string;
  fileSize: string;
  fileType: 'PDF' | 'DOC' | 'ZIP';
  fileUrl: string; // Base64 data URL or external URL
  thumbnailUrl: string;
  updatedAt: string;
  wiringDiagramNotes?: string;
  jumperSettings?: Array<{ dip: string; function: string; defaultVal: string }>;
  tags: string[];
  downloadCount: number;
}

export type ViewMode = 'grid' | 'list' | 'brands';
