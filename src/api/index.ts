const BASE_URL = 'https://world.openfoodfacts.org';

export async function searchProducts(params: SearchParams) {
  const searchUrl = new URL(`${BASE_URL}/cgi/search.pl`);
  searchUrl.searchParams.append('action', 'process');
  searchUrl.searchParams.append('json', 'true');
  searchUrl.searchParams.append('page_size', '24');
  searchUrl.searchParams.append('page', params.page.toString());
  
  if (params.query) {
    searchUrl.searchParams.append('search_terms', params.query);
  }
  
  if (params.category) {
    searchUrl.searchParams.append('tagtype_0', 'categories');
    searchUrl.searchParams.append('tag_contains_0', 'contains');
    searchUrl.searchParams.append('tag_0', params.category);
  }

  // Add sorting parameters
  if (params.sortBy) {
    searchUrl.searchParams.append('sort_by', params.sortBy);
    searchUrl.searchParams.append('sort_order', params.sortOrder);
  }

  const response = await fetch(searchUrl.toString());
  const data = await response.json();
  
  // Sort results client-side if needed
  if (data.products && data.products.length > 0) {
    return {
      ...data,
      products: sortProducts(data.products, params.sortBy, params.sortOrder)
    };
  }
  
  return data;
}

function sortProducts(products: any[], sortBy: string, sortOrder: 'asc' | 'desc') {
  return [...products].sort((a, b) => {
    let valueA = a[sortBy] || '';
    let valueB = b[sortBy] || '';
    
    // Handle numeric values
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
    }
    
    // Handle string values
    valueA = String(valueA).toLowerCase();
    valueB = String(valueB).toLowerCase();
    
    return sortOrder === 'asc' 
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });
}

export async function getProductByBarcode(barcode: string) {
  const response = await fetch(`${BASE_URL}/api/v0/product/${barcode}.json`);
  return response.json();
}

export async function getCategories() {
  const response = await fetch(`${BASE_URL}/categories.json`);
  const data = await response.json();
  return {
    ...data,
    tags: data.tags
      .filter((tag: any) => tag.products > 100) // Only show categories with significant products
      .sort((a: any, b: any) => b.products - a.products) // Sort by popularity
  };
}

export async function scanBarcode(imageData: string) {
  try {
    // Using ZXing library for barcode scanning
    const worker = new Worker(new URL('../workers/barcodeWorker.ts', import.meta.url));
    
    return new Promise((resolve, reject) => {
      worker.onmessage = (e) => {
        worker.terminate();
        resolve(e.data);
      };
      
      worker.onerror = (e) => {
        worker.terminate();
        reject(e);
      };
      
      worker.postMessage(imageData);
    });
  } catch (error) {
    console.error('Barcode scanning error:', error);
    throw error;
  }
}