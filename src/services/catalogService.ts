import { SEED_PRODUCTS } from '@/data/catalog';
import { BrandName, CatalogProduct, ProductVariant } from '@/types/product';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const CACHE_KEY = '@cayman_catalogue_cache_v1';
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface RawWooProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  description: string;
  images: { id: number; src: string; alt: string }[];
  categories: { id: number; name: string }[];
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8211;/g, '–')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeSpecKey(raw: string): string {
  const k = raw
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace('v oltage', 'voltage')
    .replace('efficieny', 'efficiency')
    .replace('efficacy', 'efficiency')
    .trim();

  const map: Record<string, string> = {
    'item no.': 'itemNo',
    'item no': 'itemNo',
    power: 'power',
    voltage: 'voltage',
    'input voltage': 'inputVoltage',
    'output voltage': 'outputVoltage',
    'output current': 'outputCurrent',
    'color temperature': 'colorTemperature',
    'led colour': 'ledColour',
    luminous: 'luminousOutput',
    lumen: 'luminousOutput',
    'luminous efficiency': 'luminousEfficiency',
    size: 'dimensions',
    'size (l*w*h)': 'dimensions',
    'light size': 'dimensions',
    'housing size': 'housingSize',
    'cut-out': 'cutOut',
    'beam angle': 'beamAngle',
    cri: 'cri',
    material: 'material',
    'operating temperature': 'operatingTemperature',
    'tape length': 'tapeLength',
  };
  return map[k] ?? k;
}

function parseVariantsFromHtml(html: string): ProductVariant[] {
  const rows = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi);
  if (!rows || rows.length < 2) return [];

  const headerCells = rows[0].match(/<t[hd][^>]*>[\s\S]*?<\/t[hd]>/gi) ?? [];
  const headers = headerCells.map((c) => normalizeSpecKey(stripHtml(c)));

  const variants: ProductVariant[] = [];
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].match(/<t[hd][^>]*>[\s\S]*?<\/t[hd]>/gi) ?? [];
    const values = cells.map((c) => stripHtml(c));
    if (!values.some(Boolean)) continue;

    const variant: ProductVariant = {};
    values.forEach((val, idx) => {
      const key = headers[idx];
      if (key && val) {
        variant[key] = val;
      }
    });
    if (Object.keys(variant).length > 0) {
      variants.push(variant);
    }
  }
  return variants;
}

function detectBrand(categories: string[]): BrandName {
  const lower = categories.map((c) => c.toLowerCase());
  if (lower.some((c) => c.includes('hyundai'))) return 'Hyundai Lighting';
  if (lower.some((c) => c.includes('luceva'))) return 'Luceva';
  return 'Cayman Newlight';
}

export function mapRawProduct(raw: RawWooProduct): CatalogProduct {
  const categories = (raw.categories ?? []).map((c) => stripHtml(c.name));
  const variants = parseVariantsFromHtml(raw.description ?? '');
  const first = variants[0] ?? {};

  return {
    id: String(raw.id),
    slug: raw.slug,
    productName: stripHtml(raw.name),
    productCode: stripHtml(raw.name),
    brand: detectBrand(categories),
    categories,
    description: '',
    images: (raw.images ?? []).map((img) => img.src).filter(Boolean),
    variants,
    specifications: {
      power: first.power,
      voltage: first.voltage,
      inputVoltage: first.inputVoltage,
      outputVoltage: first.outputVoltage,
      outputCurrent: first.outputCurrent,
      colorTemperature: first.colorTemperature,
      ledColour: first.ledColour,
      luminousOutput: first.luminousOutput,
      luminousEfficiency: first.luminousEfficiency,
      dimensions: first.dimensions,
      housingSize: first.housingSize,
      cutOut: first.cutOut,
      beamAngle: first.beamAngle,
      cri: first.cri,
      material: first.material,
      operatingTemperature: first.operatingTemperature,
      tapeLength: first.tapeLength,
    },
    sourceUrl: raw.permalink,
  };
}

export async function loadCachedCatalogue(): Promise<CatalogProduct[]> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CatalogProduct[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Fall back to seed data
  }
  return SEED_PRODUCTS;
}

export async function syncLiveCatalogue(): Promise<{
  products: CatalogProduct[];
  fromNetwork: boolean;
}> {
  // On web, caymelighting.com does not send CORS headers for browser fetch().
  // Use the bundled real catalogue cleanly on web without triggering Failed to fetch.
  if (Platform.OS === 'web') {
    return { products: SEED_PRODUCTS, fromNetwork: false };
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${BASE_URL}/api/products?per_page=40&page=1`, {
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const rawList = (await res.json()) as RawWooProduct[];
    const liveMapped = rawList.map(mapRawProduct);

    // Merge live products with seed products so all 3 brands remain rich
    const mergedMap = new Map<string, CatalogProduct>();
    for (const p of liveMapped) mergedMap.set(p.id, p);
    for (const p of SEED_PRODUCTS) {
      if (!mergedMap.has(p.id)) mergedMap.set(p.id, p);
    }

    const merged = Array.from(mergedMap.values());
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(merged));
    return { products: merged, fromNetwork: true };
  } catch {
    const cached = await loadCachedCatalogue();
    return { products: cached, fromNetwork: false };
  }
}

interface RawWooCategory {
  slug?: string;
  image?: { src?: string } | null;
}

/** Fetch category image URLs keyed by category slug from cayme-api. */
export async function fetchCategoryImages(): Promise<Record<string, string>> {
  if (!BASE_URL || Platform.OS === 'web') {
    return {};
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${BASE_URL}/api/categories`, {
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) {
      return {};
    }

    const rawCategories = (await res.json()) as RawWooCategory[];
    const imageMap: Record<string, string> = {};
    for (const cat of rawCategories) {
      if (cat.slug && cat.image?.src) {
        imageMap[cat.slug] = cat.image.src;
      }
    }
    return imageMap;
  } catch {
    return {};
  }
}
