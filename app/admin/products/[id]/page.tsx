'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'soap',
    shortDesc: '',
    longDesc: '',
    ingredients: '',
    price: '',
    comparePrice: '',
    sku: '',
    stock: '0',
    images: '',
    seoTitle: '',
    seoDescription: '',
    featured: false,
  });

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products`, {
        credentials: 'include',
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to load product');
      }

      const products = await response.json();
      const product = products.find((p: any) => p.id === productId);

      if (!product) {
        toast.error('Product not found');
        router.push('/admin/products');
        return;
      }

      // Parse images from JSON string
      const images = product.images ? JSON.parse(product.images) : [];
      const imagesString = Array.isArray(images) ? images.join(', ') : '';

      setImageUrls(Array.isArray(images) ? images : []);

      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        category: product.category || 'soap',
        shortDesc: product.shortDesc || '',
        longDesc: product.longDesc || '',
        ingredients: product.ingredients || '',
        price: product.price?.toString() || '',
        comparePrice: product.comparePrice?.toString() || '',
        sku: product.sku || '',
        stock: product.stock?.toString() || '0',
        images: imagesString,
        seoTitle: product.seoTitle || '',
        seoDescription: product.seoDescription || '',
        featured: product.featured || false,
      });

      setIsLoading(false);
    } catch (error) {
      toast.error('Failed to load product');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Use imageUrls array or fallback to images string
      const images = imageUrls.length > 0
        ? JSON.stringify(imageUrls)
        : formData.images
        ? JSON.stringify(formData.images.split(',').map((url) => url.trim()).filter(Boolean))
        : JSON.stringify([]);

      const productData = {
        ...formData,
        images,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
        stock: parseInt(formData.stock),
      };

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(productData),
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update product');
      }

      toast.success('Product updated successfully!');
      router.push('/admin/products');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update product');
      setIsSaving(false);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/admin/products"
            className="inline-flex items-center text-olive-700 hover:text-olive-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
          <h1 className="text-4xl font-serif font-bold text-olive-900">
            Edit Product
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-soft p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-olive-700 font-medium mb-2">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-olive-300 bg-white focus:outline-none focus:ring-2 focus:ring-olive-500"
              />
            </div>

            <div>
              <label className="block text-olive-700 font-medium mb-2">
                Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-olive-300 bg-white focus:outline-none focus:ring-2 focus:ring-olive-500"
              />
            </div>

            <div>
              <label className="block text-olive-700 font-medium mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-olive-300 bg-white focus:outline-none focus:ring-2 focus:ring-olive-500"
              >
                <option value="soap">Soap</option>
                <option value="candle">Candle</option>
              </select>
            </div>

            <div>
              <label className="block text-olive-700 font-medium mb-2">
                SKU *
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-olive-300 bg-white focus:outline-none focus:ring-2 focus:ring-olive-500"
              />
            </div>

            <div>
              <label className="block text-olive-700 font-medium mb-2">
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-olive-300 bg-white focus:outline-none focus:ring-2 focus:ring-olive-500"
              />
            </div>

            <div>
              <label className="block text-olive-700 font-medium mb-2">
                Compare Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.comparePrice}
                onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-olive-300 bg-white focus:outline-none focus:ring-2 focus:ring-olive-500"
              />
            </div>

            <div>
              <label className="block text-olive-700 font-medium mb-2">
                Stock *
              </label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-olive-300 bg-white focus:outline-none focus:ring-2 focus:ring-olive-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-olive-600 border-olive-300 rounded focus:ring-olive-500"
              />
              <label htmlFor="featured" className="ml-2 text-olive-700 font-medium">
                Featured Product
              </label>
            </div>
          </div>

          <div>
            <label className="block text-olive-700 font-medium mb-2">
              Short Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.shortDesc}
              onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-olive-300 bg-white focus:outline-none focus:ring-2 focus:ring-olive-500"
            />
          </div>

          <div>
            <label className="block text-olive-700 font-medium mb-2">
              Long Description *
            </label>
            <textarea
              required
              rows={6}
              value={formData.longDesc}
              onChange={(e) => setFormData({ ...formData, longDesc: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-olive-300 bg-white focus:outline-none focus:ring-2 focus:ring-olive-500"
            />
          </div>

          <div>
            <label className="block text-olive-700 font-medium mb-2">
              Ingredients *
            </label>
            <input
              type="text"
              required
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-olive-300 bg-white focus:outline-none focus:ring-2 focus:ring-olive-500"
            />
          </div>

          <div>
            <label className="block text-olive-700 font-medium mb-2">
              Product Images
            </label>
            <div className="space-y-4">
              {/* Upload from System */}
              <div>
                <label className="block text-sm text-olive-600 mb-2">Upload Images from Your Computer:</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    files.forEach((file) => {
                      if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (reader.result) {
                            setImageUrls([...imageUrls, reader.result as string]);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    });
                    // Reset input
                    e.target.value = '';
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-olive-300 bg-white focus:outline-none focus:ring-2 focus:ring-olive-500 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-olive-700 file:text-white hover:file:bg-olive-800"
                />
              </div>

              {/* Image URL Input */}
              <div>
                <label className="block text-sm text-olive-600 mb-2">Or Enter Image URL:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="imageUrlInput"
                    className="flex-1 px-4 py-3 rounded-lg border border-olive-300 bg-white focus:outline-none focus:ring-2 focus:ring-olive-500"
                    placeholder="Enter image URL (e.g., https://images.unsplash.com/photo-...)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.currentTarget;
                        if (input.value.trim()) {
                          setImageUrls([...imageUrls, input.value.trim()]);
                          input.value = '';
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('imageUrlInput') as HTMLInputElement;
                      if (input && input.value.trim()) {
                        setImageUrls([...imageUrls, input.value.trim()]);
                        input.value = '';
                      }
                    }}
                    className="px-6 py-3 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-all font-medium flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add
                  </button>
                </div>
              </div>

              {/* Image Preview List */}
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border border-olive-200">
                        <img
                          src={url}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Invalid+URL';
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== index))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Fallback: Comma-separated input */}
              <div className="mt-4">
                <p className="text-sm text-olive-600 mb-2">Or paste comma-separated URLs:</p>
                <input
                  type="text"
                  value={formData.images}
                  onChange={(e) => {
                    setFormData({ ...formData, images: e.target.value });
                    // Auto-populate imageUrls if comma-separated
                    if (e.target.value.includes(',')) {
                      const urls = e.target.value.split(',').map((url) => url.trim()).filter(Boolean);
                      setImageUrls(urls);
                    }
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-olive-300 bg-white focus:outline-none focus:ring-2 focus:ring-olive-500"
                  placeholder="https://image1.com, https://image2.com, https://image3.com"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-olive-700 font-medium mb-2">
              SEO Title
            </label>
            <input
              type="text"
              value={formData.seoTitle}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-olive-300 bg-white focus:outline-none focus:ring-2 focus:ring-olive-500"
            />
          </div>

          <div>
            <label className="block text-olive-700 font-medium mb-2">
              SEO Description
            </label>
            <textarea
              rows={3}
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-olive-300 bg-white focus:outline-none focus:ring-2 focus:ring-olive-500"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-all shadow-soft font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              href="/admin/products"
              className="px-8 py-3 bg-olive-100 text-olive-700 rounded-lg hover:bg-olive-200 transition-all font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
