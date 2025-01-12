import React from 'react';
import { SearchBar } from '../components/SearchBar';
import { Filters } from '../components/Filters';
import { ProductCard } from '../components/ProductCard';
import { searchProducts, getCategories, getProductByBarcode } from '../api';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export function HomePage() {
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [searchParams, setSearchParams] = React.useState({
    query: '',
    category: '',
    sortBy: 'product_name',
    sortOrder: 'asc' as const,
    page: 1,
  });
  
  const navigate = useNavigate();

  React.useEffect(() => {
    getCategories().then((data) => setCategories(data.tags.map((tag: any) => tag.name)));
  }, []);

  React.useEffect(() => {
    setLoading(true);
    searchProducts(searchParams)
      .then((data) => setProducts(data.products))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleBarcodeSearch = async (barcode: string) => {
    const result = await getProductByBarcode(barcode);
    if (result.status === 1) {
      navigate(`/product/${barcode}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="w-8 h-8 text-indigo-600" />
          <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Food Product Explorer
          </h1>
          <Sparkles className="w-8 h-8 text-purple-600" />
        </div>

        <div className="space-y-6">
          <SearchBar
            query={searchParams.query}
            onQueryChange={(query) =>
              setSearchParams((prev) => ({ ...prev, query, page: 1 }))
            }
            onBarcodeSearch={handleBarcodeSearch}
          />

          <Filters
            categories={categories}
            selectedCategory={searchParams.category}
            onCategoryChange={(category) =>
              setSearchParams((prev) => ({ ...prev, category, page: 1 }))
            }
            sortBy={searchParams.sortBy}
            onSortChange={(sortBy) =>
              setSearchParams((prev) => ({ ...prev, sortBy }))
            }
            sortOrder={searchParams.sortOrder}
            onSortOrderChange={(sortOrder) =>
              setSearchParams((prev) => ({ ...prev, sortOrder }))
            }
          />

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.code} product={product} />
              ))}
            </div>
          )}

          <div className="flex justify-center pt-8">
            <button
              onClick={() =>
                setSearchParams((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium 
                         hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 
                         focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Load More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}