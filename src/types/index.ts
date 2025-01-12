export interface Product {
  id: string;
  code: string;
  product_name: string;
  image_url: string;
  categories: string;
  ingredients_text: string;
  nutrition_grades: string;
  nutriments: {
    energy_100g: number;
    fat_100g: number;
    carbohydrates_100g: number;
    proteins_100g: number;
  };
  labels: string;
  quantity: string;
}

export interface SearchParams {
  query: string;
  category: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
}