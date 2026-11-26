import seedData from './seedData.json';
import {
  BrandItem,
  CatalogProduct,
  CategoryItem,
  ProjectItem,
} from '@/types/product';

export const SEED_PRODUCTS: CatalogProduct[] =
  seedData.products as CatalogProduct[];

export const SEED_PROJECTS: ProjectItem[] =
  seedData.projects as ProjectItem[];

export const BRANDS: BrandItem[] = [
  {
    slug: 'cayman-newlight',
    name: 'Cayman Newlight',
    tagline: 'Architectural & decorative LED lighting engineered for modern interiors.',
    logoUrl:
      'https://caymelighting.com/wp-content/uploads/2025/12/cayman-logo-02-scaled.png',
  },
  {
    slug: 'hyundai-lighting',
    name: 'Hyundai Lighting',
    tagline: 'High-efficiency commercial, residential, and industrial LED solutions.',
  },
  {
    slug: 'luceva',
    name: 'Luceva',
    tagline: 'Minimalist magnetic track, recessed, and architectural luminaires.',
  },
];

export const MAIN_CATEGORIES: CategoryItem[] = [
  {
    slug: 'home-light',
    name: 'Home Light',
    imageUrl:
      'https://caymelighting.com/wp-content/uploads/2025/12/02-Home-light-scaled.png',
    description: 'Pendants, ceiling lights, wall sconces, and residential luminaires.',
  },
  {
    slug: 'commercial-light',
    name: 'Commercial Light',
    imageUrl:
      'https://caymelighting.com/wp-content/uploads/2025/12/01-Commercial-Light-scaled.png',
    description: 'Panels, downlights, linear systems, and high-bay fixtures.',
  },
  {
    slug: 'outdoor-light',
    name: 'Outdoor Light',
    imageUrl:
      'https://caymelighting.com/wp-content/uploads/2025/12/03-Outdoor-light-scaled.png',
    description: 'Garden, lawn, inground, step, and architectural flood lighting.',
  },
  {
    slug: 'pendant-light',
    name: 'Pendant Light',
    description: 'Statement pendant luminaires and architectural chandeliers.',
  },
  {
    slug: 'ceiling-light',
    name: 'Ceiling Light',
    description: 'Surface-mounted and recessed ceiling luminaires.',
  },
  {
    slug: 'downlight',
    name: 'Downlight',
    description: 'Precision recessed downlights and anti-glare modules.',
  },
  {
    slug: 'track-light',
    name: 'Track Light',
    description: 'Magnetic track systems, track spotlights, and track sockets.',
  },
  {
    slug: 'strip-light',
    name: 'Strip Light',
    imageUrl:
      'https://caymelighting.com/wp-content/uploads/2026/04/05-Strip-light-scaled.png',
    description: 'Flexible LED strips and aluminum profile systems.',
  },
  {
    slug: 'wall-light',
    name: 'Wall Light',
    description: 'Indoor and exterior architectural wall luminaires.',
  },
  {
    slug: 'drivers',
    name: 'Drivers',
    imageUrl:
      'https://caymelighting.com/wp-content/uploads/2025/12/06-LED-Drivers-scaled.png',
    description: 'Constant-voltage and constant-current LED power supplies.',
  },
];

export interface CollectionItem {
  slug: string;
  title: string;
  subtitle: string;
  categoryFilter: string;
  imageUrl: string;
}

export const COLLECTIONS: CollectionItem[] = [
  {
    slug: 'home-light',
    title: 'Modern Home Lighting',
    subtitle: 'Warm pendants, ceiling fixtures, and wall accents for living spaces.',
    categoryFilter: 'Home Light',
    imageUrl:
      'https://caymelighting.com/wp-content/uploads/2025/12/02-Home-light-scaled.png',
  },
  {
    slug: 'commercial-light',
    title: 'Commercial Lighting',
    subtitle: 'High-efficacy panels, linear systems, and precision downlights.',
    categoryFilter: 'Commercial Light',
    imageUrl:
      'https://caymelighting.com/wp-content/uploads/2025/12/01-Commercial-Light-scaled.png',
  },
  {
    slug: 'outdoor-light',
    title: 'Outdoor Lighting',
    subtitle: 'Weather-resistant garden, inground, and facade luminaires.',
    categoryFilter: 'Outdoor Light',
    imageUrl:
      'https://caymelighting.com/wp-content/uploads/2025/12/03-Outdoor-light-scaled.png',
  },
  {
    slug: 'magnetic-track-light',
    title: 'Architectural Track',
    subtitle: 'Modular magnetic and spotlights for galleries and modern spaces.',
    categoryFilter: 'Track Light',
    imageUrl:
      'https://caymelighting.com/wp-content/uploads/2025/11/view-futuristic-lighting-lamp-design-scaled.jpg',
  },
];
