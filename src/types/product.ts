export type BrandName = 'Cayman Newlight' | 'Hyundai Lighting' | 'Luceva';

export interface ProductVariant {
  itemNo?: string;
  power?: string;
  voltage?: string;
  inputVoltage?: string;
  outputVoltage?: string;
  outputCurrent?: string;
  colorTemperature?: string;
  ledColour?: string;
  luminousOutput?: string;
  luminousEfficiency?: string;
  dimensions?: string;
  housingSize?: string;
  lampBaseSize?: string;
  cutOut?: string;
  beamAngle?: string;
  cri?: string;
  material?: string;
  wireMaterial?: string;
  operatingTemperature?: string;
  tapeLength?: string;
  signalRange?: string;
  speakerDrive?: string;
  [key: string]: string | undefined;
}

export interface ProductSpecifications {
  power?: string;
  voltage?: string;
  inputVoltage?: string;
  outputVoltage?: string;
  outputCurrent?: string;
  colorTemperature?: string;
  ledColour?: string;
  luminousOutput?: string;
  luminousEfficiency?: string;
  dimensions?: string;
  housingSize?: string;
  cutOut?: string;
  beamAngle?: string;
  cri?: string;
  material?: string;
  operatingTemperature?: string;
  tapeLength?: string;
  ipRating?: string;
  mountingType?: string;
  mountingLocation?: string;
  applicationEnvironment?: string;
  warranty?: string;
}

export interface CatalogProduct {
  id: string;
  slug: string;
  productName: string;
  productCode: string;
  brand: BrandName;
  categories: string[];
  description: string;
  images: string[];
  variants: ProductVariant[];
  specifications: ProductSpecifications;
  datasheetUrl?: string;
  sourceUrl: string;
}

export interface CategoryItem {
  slug: string;
  name: string;
  imageUrl?: string;
  description: string;
}

export interface BrandItem {
  slug: string;
  name: BrandName;
  tagline: string;
  logoUrl?: string;
}

export interface ProjectItem {
  id: number;
  slug: string;
  title: string;
  image: string | null;
  categories: string[];
  excerpt: string;
  link: string;
}

export interface EnquiryItem {
  product: CatalogProduct;
  selectedVariant?: ProductVariant;
  quantity: number;
}

export type SortOption = 'newest' | 'name-asc' | 'name-desc';

export interface FilterState {
  categories: string[];
  brands: BrandName[];
  productTypes: string[];
  powers: string[];
  colorTemperatures: string[];
  voltages: string[];
}

export const EMPTY_FILTERS: FilterState = {
  categories: [],
  brands: [],
  productTypes: [],
  powers: [],
  colorTemperatures: [],
  voltages: [],
};
