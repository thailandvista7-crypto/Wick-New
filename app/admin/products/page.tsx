'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { Product } from '@prisma/client';
import { getProductImage } from '@/lib/product-utils';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication via API since cookie is httpOnly
    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products', {
        credentials: 'include',
      });
      
      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to load products');
      }
      
      const data = await response.json();
      setProducts(data);
      setIsLoading(false);
    } catch (error) {
      toast.error('Failed to load products');
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!response.ok) throw new Error('Delete failed');

      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center text-olive-700 hover:text-olive-600 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-serif font-bold text-olive-900">
              Manage Products
            </h1>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-all shadow-soft font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-olive-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-olive-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-olive-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-beige-50">
                    <td className="px-6 py-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        {(() => {
                          const imageUrl = getProductImage(product);
                          const isDataUrl = imageUrl.startsWith('data:');
                          return isDataUrl ? (
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Image
                              src={imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          );
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-olive-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-olive-600">{product.sku}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-olive-100 text-olive-700 rounded-full text-sm capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-olive-900 font-semibold">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          product.stock > 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-2 text-olive-700 hover:bg-olive-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
