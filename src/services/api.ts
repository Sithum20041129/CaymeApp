const BASE_URL = 'https://caymelighting.com/wp-json/wc/store/v1';

export interface Product {
    id: number;
    name: string;
    images: { id: number; src: string; alt: string }[];
    short_description: string;
    categories: { id: number; name: string }[];
}

export async function fetchProducts(page = 1, perPage = 20): Promise<Product[]> {
    const response = await fetch(
        `${BASE_URL}/products?page=${page}&per_page=${perPage}`
    );
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    return response.json();
}