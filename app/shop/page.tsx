import { Suspense } from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ProductGrid from '@/components/products/ProductGrid';
import { Filter } from 'lucide-react';

export const metadata = {
  title: 'Shop Luxury Soaps & Candles from Thailand | Wick & Lather',
  description:
    'Browse our complete collection of luxury handcrafted soaps and premium scented candles made in Thailand. Export-quality products with international shipping to US, EU, GCC, and Asia.',
  keywords: 'handcrafted soaps Thailand, luxury candles Thailand, Thai artisan products, export quality, international shipping, premium wellness products',
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const category = searchParams.category;
  const search = searchParams.search;

  const where: any = {};
  if (category && (category === 'soap' || category === 'candle')) {
    where.category = category;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { shortDesc: { contains: search, mode: 'insensitive' } },
      { longDesc: { contains: search, mode: 'insensitive' } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  const soapCount = await prisma.product.count({
    where: { category: 'soap' },
  });
  const candleCount = await prisma.product.count({
    where: { category: 'candle' },
  });

  return (
    <div className="min-h-screen bg-beige-50">
      {/* Header */}
      <header className="bg-white border-b border-olive-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-olive-900 mb-4">
            {category === 'soap' 
              ? 'Luxury Handcrafted Soaps from Thailand'
              : category === 'candle'
              ? 'Premium Scented Candles from Thailand'
              : 'Shop Collection: Handcrafted Soaps & Candles from Thailand'}
          </h1>
          <p className="text-lg text-olive-700 max-w-2xl">
            {category === 'soap'
              ? 'Discover our premium handcrafted soaps made in Thailand using traditional techniques and natural ingredients. Export-quality products designed for all skin types, available for international shipping.'
              : category === 'candle'
              ? 'Explore our luxury scented candles handcrafted in Thailand. Premium fragrances, natural soy wax, and artisan craftsmanship create the perfect ambiance for your home. International shipping available.'
              : 'Discover our complete range of handcrafted luxury soaps and premium scented candles, each made in Thailand with care, natural ingredients, and export-quality standards for global customers.'}
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center gap-2 text-olive-700">
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filter by:</span>
          </div>
          <a
            href="/shop"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !category
                ? 'bg-olive-700 text-white'
                : 'bg-white text-olive-700 hover:bg-olive-50'
            }`}
          >
            All Products ({products.length})
          </a>
          <a
            href="/shop?category=soap"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              category === 'soap'
                ? 'bg-olive-700 text-white'
                : 'bg-white text-olive-700 hover:bg-olive-50'
            }`}
          >
            Soaps ({soapCount})
          </a>
          <a
            href="/shop?category=candle"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              category === 'candle'
                ? 'bg-olive-700 text-white'
                : 'bg-white text-olive-700 hover:bg-olive-50'
            }`}
          >
            Candles ({candleCount})
          </a>
        </div>

        {/* Products Grid */}
        <Suspense fallback={<div>Loading products...</div>}>
          <ProductGrid products={products} />
        </Suspense>

        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-olive-700 mb-4">
              No products found matching your criteria.
            </p>
            <a
              href="/shop"
              className="text-olive-700 hover:text-olive-600 font-medium underline"
            >
              View all products
            </a>
          </div>
        )}
      </div>

      {/* SEO Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" aria-labelledby="category-seo-heading">
        <div className="prose prose-olive max-w-none">
          {category === 'soap' ? (
            <>
              <h2 id="category-seo-heading" className="text-3xl font-serif font-bold text-olive-900 mb-6">
                Premium Handcrafted Soaps from Thailand
              </h2>
              <p className="text-lg text-olive-700 mb-4 leading-relaxed">
                Our luxury soap collection features handcrafted products made in Thailand using traditional cold-process methods. Each bar is crafted in small batches, ensuring attention to detail and preserving the natural benefits of premium ingredients like coconut oil, shea butter, and essential oils.
              </p>
              <p className="text-lg text-olive-700 mb-4 leading-relaxed">
                Our soaps are designed for various skin types, from normal to sensitive, dry, and oily skin. We use natural ingredients sourced responsibly, and our export-quality production standards ensure that every product meets international safety requirements. Whether you're looking for deeply moisturizing blends or gentle formulas, our <Link href="/shop?category=soap" className="text-olive-700 underline hover:text-olive-600 font-medium">Thai handcrafted soaps</Link> offer a luxurious addition to your skincare routine.
              </p>
              <p className="text-lg text-olive-700 mb-4 leading-relaxed">
                Each soap is cured for several weeks to achieve optimal texture and longevity. Made in Thailand with care and exported worldwide, our products reflect the quality and craftsmanship that Thailand is known for. Perfect for personal use or as a thoughtful gift, our soaps combine wellness benefits with artisanal beauty.
              </p>
              <p className="text-lg text-olive-700 leading-relaxed">
                Explore our <Link href="/shop?category=candle" className="text-olive-700 underline hover:text-olive-600 font-medium">luxury candle collection</Link> to complete your wellness experience. Our candles are handcrafted in Thailand with the same attention to detail and export-quality standards.
              </p>
            </>
          ) : category === 'candle' ? (
            <>
              <h2 id="category-seo-heading" className="text-3xl font-serif font-bold text-olive-900 mb-6">
                Luxury Scented Candles from Thailand
              </h2>
              <p className="text-lg text-olive-700 mb-4 leading-relaxed">
                Our premium candle collection features hand-poured soy wax candles crafted in Thailand with carefully developed fragrance profiles. Each candle is designed to create a specific mood or atmosphere, from energizing morning scents to calming evening fragrances. We use natural cotton wicks and premium fragrance oils to ensure clean burns and excellent scent throw.
              </p>
              <p className="text-lg text-olive-700 mb-4 leading-relaxed">
                Our candles are available in different scent strengths—light, medium, and strong—allowing you to choose the perfect intensity for your space. Made in Thailand with export-quality standards, our candles are packaged securely for international shipping. Whether you're creating ambiance in your home or looking for a luxury gift, our <Link href="/shop?category=candle" className="text-olive-700 underline hover:text-olive-600 font-medium">Thai handcrafted candles</Link> offer premium quality and authentic craftsmanship.
              </p>
              <p className="text-lg text-olive-700 mb-4 leading-relaxed">
                Each candle reflects our commitment to Thai artisan heritage and modern wellness needs. Our production process ensures consistent quality, making our candles a trusted choice for customers worldwide.
              </p>
              <p className="text-lg text-olive-700 leading-relaxed">
                Pair your candle with our <Link href="/shop?category=soap" className="text-olive-700 underline hover:text-olive-600 font-medium">luxury handcrafted soaps</Link> for a complete wellness experience. Both collections are made in Thailand with the same dedication to quality and export standards.
              </p>
            </>
          ) : (
            <>
              <h2 id="category-seo-heading" className="text-3xl font-serif font-bold text-olive-900 mb-6">
                Explore Our Complete Collection of Luxury Soaps and Candles from Thailand
              </h2>
              <p className="text-lg text-olive-700 mb-4 leading-relaxed">
                Our shop features a carefully curated selection of premium handcrafted products made in Thailand. Each product combines traditional Thai craftsmanship with modern wellness needs, creating export-quality goods designed for international customers. Whether you're looking for nourishing skincare solutions or ambient home fragrances, we have something special for everyone.
              </p>
              <p className="text-lg text-olive-700 mb-4 leading-relaxed">
                Our <Link href="/shop?category=soap" className="text-olive-700 underline hover:text-olive-600 font-medium">luxury soap collection</Link> includes formulas for every skin type, from normal to sensitive, dry, and oily. Made using the traditional cold-process method, our soaps preserve the natural benefits of premium ingredients like coconut oil, shea butter, and essential oils. Each bar is handcrafted in Thailand and cured for several weeks to achieve optimal quality.
              </p>
              <p className="text-lg text-olive-700 leading-relaxed">
                Our <Link href="/shop?category=candle" className="text-olive-700 underline hover:text-olive-600 font-medium">premium candle collection</Link> features hand-poured soy wax candles with carefully developed fragrance profiles. Available in light, medium, and strong scent strengths, our candles are crafted in Thailand with natural cotton wicks and premium fragrance oils. Export-ready packaging ensures safe delivery to customers worldwide.
              </p>
            </>
          )}
        </div>
      </section>

      {/* Export & Trust Signals */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white rounded-xl shadow-soft" aria-labelledby="trust-signals-heading">
        <h2 id="trust-signals-heading" className="text-2xl font-semibold text-olive-900 mb-6 text-center">
          Export Quality & International Shipping
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-olive-900 mb-2">Made in Thailand</h3>
            <p className="text-olive-700 text-sm">
              Handcrafted in Thailand using traditional techniques and premium natural ingredients. Our products reflect Thai artisan heritage and quality craftsmanship.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-olive-900 mb-2">Export-Ready Packaging</h3>
            <p className="text-olive-700 text-sm">
              Each product is carefully packaged for international shipping. Our export-quality standards ensure safe delivery to customers worldwide.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-olive-900 mb-2">International Shipping</h3>
            <p className="text-olive-700 text-sm">
              We ship to the US, EU, GCC, Asia, and other international destinations. Our products meet international safety and quality standards.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-olive-900 mb-2">Quality Assurance</h3>
            <p className="text-olive-700 text-sm">
              Every product undergoes quality checks before shipping. We're committed to delivering premium quality that meets global customer expectations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
