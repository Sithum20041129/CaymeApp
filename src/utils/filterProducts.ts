import {
  BrandName,
  CatalogProduct,
  FilterState,
  ProductSpecifications,
  SortOption,
} from '@/types/product';

export const SPEC_LABELS: Record<keyof ProductSpecifications, string> = {
  power: 'Power',
  voltage: 'Voltage',
  inputVoltage: 'Input Voltage',
  outputVoltage: 'Output Voltage',
  outputCurrent: 'Output Current',
  colorTemperature: 'Colour Temperature',
  ledColour: 'LED Colour',
  luminousOutput: 'Luminous Output',
  luminousEfficiency: 'Luminous Efficacy',
  dimensions: 'Dimensions',
  housingSize: 'Housing Size',
  cutOut: 'Cut-Out',
  beamAngle: 'Beam Angle',
  cri: 'CRI',
  material: 'Housing Material',
  operatingTemperature: 'Operating Temp',
  tapeLength: 'Tape Length',
  ipRating: 'IP Rating',
  mountingType: 'Mounting Type',
  mountingLocation: 'Mounting Location',
  applicationEnvironment: 'Application',
  warranty: 'Warranty',
};

const KNOWN_TYPES = [
  'Pendant',
  'Ceiling',
  'Downlight',
  'Spot',
  'Track',
  'Magnetic Track',
  'Linear',
  'Panel',
  'Wall',
  'Floor',
  'Garden',
  'Lawn',
  'Inground',
  'Flood',
  'High Bay',
  'Step',
  'Strip',
  'Driver',
  'LED Bulb',
];

function normalizeCategoryText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function productMatchesCategory(
  product: CatalogProduct,
  categoryNameOrSlug: string
): boolean {
  const target = normalizeCategoryText(categoryNameOrSlug);
  if (!target) return true;
  return product.categories.some((cat) => {
    const norm = normalizeCategoryText(cat);
    return norm === target || norm.includes(target) || target.includes(norm);
  });
}

export function productMatchesType(
  product: CatalogProduct,
  typeLabel: string
): boolean {
  const target = normalizeCategoryText(typeLabel);
  return product.categories.some((cat) =>
    normalizeCategoryText(cat).includes(target)
  );
}

export function extractAvailableFilterOptions(products: CatalogProduct[]) {
  const categorySet = new Set<string>();
  const brandSet = new Set<BrandName>();
  const typeSet = new Set<string>();
  const powerSet = new Set<string>();
  const cctSet = new Set<string>();
  const voltageSet = new Set<string>();

  for (const p of products) {
    brandSet.add(p.brand);
    for (const c of p.categories) {
      if (
        c !== 'Cayman Newlight' &&
        c !== 'Hyundai Lighting' &&
        c !== 'Luceva'
      ) {
        categorySet.add(c);
      }
      for (const t of KNOWN_TYPES) {
        if (normalizeCategoryText(c).includes(normalizeCategoryText(t))) {
          typeSet.add(t);
        }
      }
    }

    const collectFromSpec = (obj?: Record<string, string | undefined>) => {
      if (!obj) return;
      if (obj.power) powerSet.add(obj.power.trim());
      if (obj.colorTemperature) cctSet.add(obj.colorTemperature.trim());
      if (obj.voltage) voltageSet.add(obj.voltage.trim());
      if (obj.inputVoltage) voltageSet.add(obj.inputVoltage.trim());
    };

    collectFromSpec(p.specifications as Record<string, string | undefined>);
    for (const v of p.variants) {
      collectFromSpec(v);
    }
  }

  return {
    categories: Array.from(categorySet).sort(),
    brands: Array.from(brandSet),
    productTypes: Array.from(typeSet).sort(),
    powers: Array.from(powerSet).sort((a, b) => {
      const na = parseFloat(a) || 9999;
      const nb = parseFloat(b) || 9999;
      return na - nb;
    }),
    colorTemperatures: Array.from(cctSet).sort(),
    voltages: Array.from(voltageSet).sort(),
  };
}

export function filterAndSortProducts(
  products: CatalogProduct[],
  filters: FilterState,
  query: string,
  sortBy: SortOption
): CatalogProduct[] {
  const q = query.trim().toLowerCase();

  const filtered = products.filter((p) => {
    if (q) {
      const specText = Object.values(p.specifications || {})
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const variantText = p.variants
        .map((v) => Object.values(v).filter(Boolean).join(' '))
        .join(' ')
        .toLowerCase();
      const haystack = `${p.productName} ${p.productCode} ${p.brand} ${p.categories.join(' ')} ${specText} ${variantText}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (
      filters.brands.length > 0 &&
      !filters.brands.includes(p.brand)
    ) {
      return false;
    }

    if (
      filters.categories.length > 0 &&
      !filters.categories.some((c) => productMatchesCategory(p, c))
    ) {
      return false;
    }

    if (
      filters.productTypes.length > 0 &&
      !filters.productTypes.some((t) => productMatchesType(p, t))
    ) {
      return false;
    }

    if (filters.powers.length > 0) {
      const pPowers = new Set<string>();
      if (p.specifications.power) pPowers.add(p.specifications.power.trim());
      p.variants.forEach((v) => v.power && pPowers.add(v.power.trim()));
      if (!filters.powers.some((pw) => pPowers.has(pw))) return false;
    }

    if (filters.colorTemperatures.length > 0) {
      const pCcts = new Set<string>();
      if (p.specifications.colorTemperature) {
        pCcts.add(p.specifications.colorTemperature.trim());
      }
      p.variants.forEach(
        (v) => v.colorTemperature && pCcts.add(v.colorTemperature.trim())
      );
      if (!filters.colorTemperatures.some((ct) => pCcts.has(ct))) return false;
    }

    if (filters.voltages.length > 0) {
      const pVolts = new Set<string>();
      if (p.specifications.voltage) pVolts.add(p.specifications.voltage.trim());
      if (p.specifications.inputVoltage) {
        pVolts.add(p.specifications.inputVoltage.trim());
      }
      p.variants.forEach((v) => {
        if (v.voltage) pVolts.add(v.voltage.trim());
        if (v.inputVoltage) pVolts.add(v.inputVoltage.trim());
      });
      if (!filters.voltages.some((vl) => pVolts.has(vl))) return false;
    }

    return true;
  });

  if (sortBy === 'name-asc') {
    return [...filtered].sort((a, b) =>
      a.productName.localeCompare(b.productName)
    );
  }
  if (sortBy === 'name-desc') {
    return [...filtered].sort((a, b) =>
      b.productName.localeCompare(a.productName)
    );
  }
  return filtered;
}

export function countActiveFilters(filters: FilterState): number {
  return (
    filters.categories.length +
    filters.brands.length +
    filters.productTypes.length +
    filters.powers.length +
    filters.colorTemperatures.length +
    filters.voltages.length
  );
}
