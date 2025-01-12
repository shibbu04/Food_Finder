import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { Badge } from './ui/Badge';
import { Info, PackageX } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = React.useState(false);

  const fallbackImageUrl = 'https://images.unsplash.com/photo-1604147495798-57beb5d6af73?w=500&auto=format&fit=crop&q=60';

  return (
    <Link to={`/product/${product.code}`} className="group">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden 
                    transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className="aspect-square relative">
          {imageError ? (
            <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
              <PackageX className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">No image available</p>
            </div>
          ) : (
            <img
              src={product.image_url || fallbackImageUrl}
              alt={product.product_name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 
                        group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white text-sm line-clamp-2">{product.ingredients_text}</p>
            </div>
          </div>
          {product.nutrition_grades && (
            <div className="absolute top-4 right-4">
              <Badge variant={getNutritionGradeColor(product.nutrition_grades)}>
                Grade {product.nutrition_grades.toUpperCase()}
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-2 group-hover:text-indigo-600 
                       transition-colors duration-200">
            {product.product_name}
          </h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-1">
            {product.categories}
          </p>
          <div className="flex items-center gap-1 text-indigo-600">
            <Info className="w-4 h-4" />
            <span className="text-sm">View Details</span>
          </div>
        </div>
      </div>
    </Link>
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