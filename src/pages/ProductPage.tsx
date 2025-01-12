import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductByBarcode } from '../api';
import { Badge } from '../components/ui/Badge';
import { ArrowLeft, Leaf, Info, AlertTriangle, PackageX } from 'lucide-react';

export function ProductPage() {
  const { barcode } = useParams();
  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [imageError, setImageError] = React.useState(false);

  const fallbackImageUrl = 'https://images.unsplash.com/photo-1604147495798-57beb5d6af73?w=500&auto=format&fit=crop&q=60';

  React.useEffect(() => {
    if (barcode) {
      setLoading(true);
      getProductByBarcode(barcode)
        .then((data) => setProduct(data.product))
        .finally(() => setLoading(false));
    }
  }, [barcode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 
                    flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 
                    flex flex-col items-center justify-center gap-4">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <p className="text-xl font-semibold text-gray-900">Product not found</p>
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              {imageError ? (
                <div className="h-48 w-full md:h-full md:w-64 bg-gray-100 flex flex-col items-center justify-center">
                  <PackageX className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">No image available</p>
                </div>
              ) : (
                <img
                  className="h-48 w-full object-cover md:h-full md:w-64"
                  src={product.image_url || fallbackImageUrl}
                  alt={product.product_name}
                  onError={() => setImageError(true)}
                />
              )}
            </div>
            {/* Rest of the component remains the same */}
            <div className="p-8">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.product_name}
                </h1>
                {product.nutrition_grades && (
                  <Badge variant={getNutritionGradeColor(product.nutrition_grades)}>
                    Grade {product.nutrition_grades.toUpperCase()}
                  </Badge>
                )}
              </div>

              <div className="mt-8 space-y-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Ingredients</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{product.ingredients_text}</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Nutrition Facts</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <NutritionCard
                      label="Energy"
                      value={`${product.nutriments.energy_100g} kcal`}
                      unit="/100g"
                    />
                    <NutritionCard
                      label="Fat"
                      value={product.nutriments.fat_100g}
                      unit="g/100g"
                    />
                    <NutritionCard
                      label="Carbohydrates"
                      value={product.nutriments.carbohydrates_100g}
                      unit="g/100g"
                    />
                    <NutritionCard
                      label="Proteins"
                      value={product.nutriments.proteins_100g}
                      unit="g/100g"
                    />
                  </div>
                </div>

                {product.labels && (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <Leaf className="w-5 h-5 text-green-600" />
                      <h2 className="text-xl font-semibold text-gray-900">Labels</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.labels.split(',').map((label) => (
                        <Badge key={label} variant="info">
                          {label.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NutritionCard({ label, value, unit }: { label: string; value: number | string; unit: string }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-semibold text-gray-900">
        {value} <span className="text-sm font-normal text-gray-500">{unit}</span>
      </p>
    </div>
  );
}

function getNutritionGradeColor(grade: string) {
  const grades: Record<string, string> = {
    a: 'success',
    b: 'info',
    c: 'warning',
    d: 'warning',
    e: 'error',
  };
  return grades[grade.toLowerCase()] || 'default';
}