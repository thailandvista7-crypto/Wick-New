import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { parseProductImages } from '@/lib/product-utils';
import ProductGallery from '@/components/products/ProductGallery';
import VariantSelector from '@/components/products/VariantSelector';
import AddToCartButton from '@/components/products/AddToCartButton';
import ReviewList from '@/components/products/ReviewList';
import RelatedProducts from '@/components/products/RelatedProducts';
import ProductInfoClient from '@/components/products/ProductInfoClient';

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { slug: true },
  });
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        reviews: {
          select: { rating: true },
        },
      },
    });

    if (!product) {
      return {
        title: 'Product Not Found | Wick & Lather',
      };
    }

    const averageRating =
      product.reviews && product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;

    const categoryLabel = product.category === 'soap' ? 'Luxury Handcrafted Soap' : 'Premium Scented Candle';
    const description = product.seoDescription || 
      `${product.shortDesc} Made in Thailand. Export-quality ${product.category === 'soap' ? 'handcrafted soap' : 'scented candle'} with international shipping available.`;
    const title = product.seoTitle || 
      `${product.name} - ${categoryLabel} from Thailand | Wick & Lather`;

    return {
      title,
      description,
      keywords: `${product.name}, ${categoryLabel.toLowerCase()} Thailand, handcrafted ${product.category} Thailand, export quality, Thai artisan ${product.category}, international shipping`,
      openGraph: {
        title: `${product.name} - ${categoryLabel} from Thailand`,
        description,
        images: parseProductImages(product.images),
        type: 'website',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} - ${categoryLabel} from Thailand`,
        description,
        images: parseProductImages(product.images),
      },
    };
  } catch (error) {
    // Fallback if reviews relation doesn't exist yet
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
    });

    if (!product) {
      return {
        title: 'Product Not Found | Wick & Lather',
      };
    }

    const categoryLabel = product.category === 'soap' ? 'Luxury Handcrafted Soap' : 'Premium Scented Candle';
    const description = product.seoDescription || 
      `${product.shortDesc} Made in Thailand. Export-quality ${product.category === 'soap' ? 'handcrafted soap' : 'scented candle'} with international shipping available.`;
    const title = product.seoTitle || 
      `${product.name} - ${categoryLabel} from Thailand | Wick & Lather`;

    return {
      title,
      description,
      keywords: `${product.name}, ${categoryLabel.toLowerCase()} Thailand, handcrafted ${product.category} Thailand, export quality, Thai artisan ${product.category}, international shipping`,
      openGraph: {
        title: `${product.name} - ${categoryLabel} from Thailand`,
        description,
        images: parseProductImages(product.images),
        type: 'website',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} - ${categoryLabel} from Thailand`,
        description,
        images: parseProductImages(product.images),
      },
    };
  }
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  let product;
  let reviews: any[] = [];
  
  try {
    product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    
    if (product && 'reviews' in product && product.reviews) {
      reviews = product.reviews;
    }
  } catch (error) {
    // Fallback if reviews relation doesn't exist yet
    product = await prisma.product.findUnique({
      where: { slug: params.slug },
    });
  }

  if (!product) {
    notFound();
  }

  // Get related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id },
    },
    take: 4,
  });

  // Calculate review stats
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

  // Format reviews for client component
  const formattedReviews = reviews.map((review) => ({
    id: review.id,
    name: review.name,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt.toISOString(),
    verified: review.verified,
  }));

  // JSON-LD Schema - Enhanced for SEO
  const images = parseProductImages(product.images);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://wickandlather.com';
  const categoryLabel = product.category === 'soap' ? 'Handcrafted Soap' : 'Scented Candle';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.seoDescription || product.shortDesc || product.longDesc,
    image: images,
    sku: product.sku,
    mpn: product.sku,
    category: categoryLabel,
    brand: {
      '@type': 'Brand',
      name: 'Wick & Lather',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Wick & Lather',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'TH',
      },
    },
    countryOfOrigin: {
      '@type': 'Country',
      name: 'Thailand',
    },
    productionDate: product.createdAt.toISOString(),
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/products/${product.slug}`,
      priceCurrency: 'USD',
      price: product.price.toString(),
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Wick & Lather',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'USD',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'AE', 'SA', 'QA', 'KW', 'BH', 'OM', 'SG', 'MY', 'TH', 'JP', 'KR', 'HK', 'TW'],
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          businessDays: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          },
          cutoffTime: '14:00',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 7,
            maxValue: 21,
            unitCode: 'DAY',
          },
        },
      },
    },
    ...(totalReviews > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating.toFixed(1),
        reviewCount: totalReviews,
        bestRating: '5',
        worstRating: '1',
      },
      review: reviews.slice(0, 5).map((review) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.name,
        },
        datePublished: review.createdAt.toISOString(),
        reviewBody: review.comment,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating.toString(),
          bestRating: '5',
          worstRating: '1',
        },
      })),
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-beige-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-olive-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm text-olive-600">
              <Link href="/" className="hover:text-olive-700">
                Home
              </Link>
              <span>/</span>
              <Link href="/shop" className="hover:text-olive-700">
                Shop
              </Link>
              <span>/</span>
              <Link
                href={`/shop?category=${product.category}`}
                className="hover:text-olive-700 capitalize"
              >
                {product.category}s
              </Link>
              <span>/</span>
              <span className="text-olive-900">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* Product Gallery */}
            <div>
              <ProductGallery
                images={images}
                productName={`${product.name} - ${product.category === 'soap' ? 'Luxury handcrafted soap from Thailand' : 'Premium scented candle from Thailand'}`}
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <span className="text-sm font-medium text-olive-500 uppercase tracking-wide">
                  {product.category}
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-olive-900">
                {product.name}
              </h1>
              
              {/* Made in Thailand Badge - Above the fold */}
              <div className="flex items-center gap-2 text-sm text-olive-600 mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Handcrafted in Thailand | Export Quality</span>
              </div>
              
              {/* Short Description - Luxury focused */}
              <p className="text-lg text-olive-700 leading-relaxed">
                {product.shortDesc}
              </p>
              {!product.shortDesc.toLowerCase().includes('thailand') && (
                <p className="text-base text-olive-600 mt-2 italic">
                  Handcrafted in Thailand with traditional artisan techniques and premium natural ingredients.
                </p>
              )}

              {/* Client Component for Interactive Elements */}
              <ProductInfoClient
                product={product}
                averageRating={averageRating}
                totalReviews={totalReviews}
              />
            </div>
          </div>


          {/* Detailed Information Sections */}
          <div className="mt-16 grid md:grid-cols-2 gap-12">
            {/* Detailed Description */}
            <section aria-labelledby="description-heading">
              <h2 id="description-heading" className="text-2xl font-semibold text-olive-900 mb-4">
                Detailed Description
              </h2>
              <div className="prose prose-olive max-w-none">
                <p className="text-olive-700 leading-relaxed whitespace-pre-line">
                  {product.longDesc}
                </p>
                {product.longDesc && !product.longDesc.toLowerCase().includes('thailand') && (
                  <p className="text-olive-700 leading-relaxed mt-4">
                    This product is handcrafted in Thailand using traditional techniques and premium natural ingredients. Our export-quality production ensures that each item meets international standards for safety and quality.
                  </p>
                )}
              </div>
            </section>

            {/* Ingredients / Materials */}
            <section aria-labelledby="ingredients-heading">
              <h2 id="ingredients-heading" className="text-2xl font-semibold text-olive-900 mb-4">
                {product.category === 'soap' ? 'Ingredients & Skin Profile' : 'Scent Notes & Materials'}
              </h2>
              <div className="prose prose-olive max-w-none">
                <p className="text-olive-700 leading-relaxed whitespace-pre-line">
                  {product.ingredients}
                </p>
                {product.category === 'soap' && (
                  <p className="text-olive-600 text-sm mt-4 italic">
                    All ingredients are carefully selected and sourced responsibly. Our soaps are made using traditional cold-process methods in Thailand, preserving the natural benefits of each ingredient.
                  </p>
                )}
                {product.category === 'candle' && (
                  <p className="text-olive-600 text-sm mt-4 italic">
                    Our candles are hand-poured in Thailand using natural soy wax and premium fragrance oils. Each candle is crafted with attention to detail to ensure consistent quality and excellent scent throw.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Usage & Care Instructions */}
          {product.usageInstructions && (
            <section className="mt-12">
              <h2 className="text-2xl font-semibold text-olive-900 mb-4">
                Usage & Care Instructions
              </h2>
              <div className="bg-white rounded-xl shadow-soft p-6">
                <p className="text-olive-700 leading-relaxed whitespace-pre-line">
                  {product.usageInstructions}
                </p>
              </div>
            </section>
          )}

          {/* Safety & Sensitivity Notice */}
          {product.safetyNotice && (
            <section className="mt-8" aria-labelledby="safety-heading">
              <h2 id="safety-heading" className="text-2xl font-semibold text-olive-900 mb-4">
                Safety & Sensitivity Notice
              </h2>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <p className="text-olive-800 leading-relaxed whitespace-pre-line">
                  {product.safetyNotice}
                </p>
              </div>
            </section>
          )}

          {/* Export & Trust Signals */}
          <section className="mt-12 bg-white rounded-xl shadow-soft p-8" aria-labelledby="trust-heading">
            <h2 id="trust-heading" className="text-2xl font-semibold text-olive-900 mb-6">
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

          {/* FAQ Section - SEO Optimized */}
          <section className="mt-12" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-semibold text-olive-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <details className="bg-white rounded-lg shadow-soft p-6">
                <summary className="font-semibold text-olive-900 cursor-pointer">
                  Where is this {product.category === 'soap' ? 'soap' : 'candle'} made?
                </summary>
                <p className="text-olive-700 mt-3">
                  This {product.category === 'soap' ? 'handcrafted soap' : 'premium scented candle'} is made in Thailand using traditional artisan techniques and premium natural ingredients. Our production facility follows international quality standards, ensuring export-ready products for global customers in the US, EU, GCC, and Asia.
                </p>
              </details>
              <details className="bg-white rounded-lg shadow-soft p-6">
                <summary className="font-semibold text-olive-900 cursor-pointer">
                  Do you ship internationally?
                </summary>
                <p className="text-olive-700 mt-3">
                  Yes, we ship worldwide including the US, EU, GCC, and Asian markets. Our products are packaged securely for international shipping with export-quality standards. Each order is carefully packed to ensure safe delivery to customers worldwide.
                </p>
              </details>
              {product.category === 'soap' && (
                <>
                  <details className="bg-white rounded-lg shadow-soft p-6">
                    <summary className="font-semibold text-olive-900 cursor-pointer">
                      What skin types are these handcrafted soaps suitable for?
                    </summary>
                    <p className="text-olive-700 mt-3">
                      Our Thai handcrafted soaps are available in different formulations for normal, sensitive, dry, and oily skin types. Each product listing includes specific skin profile information to help you choose the right option for your needs. Made with natural ingredients in Thailand, our soaps are gentle yet effective.
                    </p>
                  </details>
                  <details className="bg-white rounded-lg shadow-soft p-6">
                    <summary className="font-semibold text-olive-900 cursor-pointer">
                      How are the soaps made?
                    </summary>
                    <p className="text-olive-700 mt-3">
                      Our soaps are handcrafted in Thailand using the traditional cold-process method. This technique preserves the natural benefits of premium ingredients like coconut oil, shea butter, and essential oils. Each bar is cured for several weeks to achieve optimal texture and longevity, ensuring export-quality standards.
                    </p>
                  </details>
                </>
              )}
              {product.category === 'candle' && (
                <>
                  <details className="bg-white rounded-lg shadow-soft p-6">
                    <summary className="font-semibold text-olive-900 cursor-pointer">
                      What scent strengths are available for these candles?
                    </summary>
                    <p className="text-olive-700 mt-3">
                      Our handcrafted candles from Thailand are available in light, medium, and strong scent strengths. You can select your preferred intensity when adding the product to your cart to ensure the perfect fragrance level for your space. Each candle is hand-poured with natural soy wax for clean burns.
                    </p>
                  </details>
                  <details className="bg-white rounded-lg shadow-soft p-6">
                    <summary className="font-semibold text-olive-900 cursor-pointer">
                      What materials are used in the candles?
                    </summary>
                    <p className="text-olive-700 mt-3">
                      Our premium candles are handcrafted in Thailand using natural soy wax and premium fragrance oils. We use natural cotton wicks to ensure clean burns and excellent scent throw. Each candle is carefully crafted to meet export-quality standards for international customers.
                    </p>
                  </details>
                </>
              )}
              <details className="bg-white rounded-lg shadow-soft p-6">
                <summary className="font-semibold text-olive-900 cursor-pointer">
                  How long does international shipping take?
                </summary>
                <p className="text-olive-700 mt-3">
                  Shipping times vary by destination. International orders typically arrive within 7-21 business days, depending on your location. We provide tracking information once your order ships. Our export-ready packaging ensures your {product.category === 'soap' ? 'handcrafted soaps' : 'premium candles'} arrive in perfect condition.
                </p>
              </details>
              <details className="bg-white rounded-lg shadow-soft p-6">
                <summary className="font-semibold text-olive-900 cursor-pointer">
                  Are these products safe for international shipping?
                </summary>
                <p className="text-olive-700 mt-3">
                  Yes, all our products meet international safety and quality standards. Our {product.category === 'soap' ? 'handcrafted soaps' : 'scented candles'} are packaged securely for international shipping and comply with export regulations. We ensure export-quality standards for safe delivery to customers worldwide.
                </p>
              </details>
            </div>
          </section>

          {/* Reviews Section */}
          <section className="mt-20">
            <ReviewList
              reviews={formattedReviews}
              averageRating={averageRating}
              totalReviews={totalReviews}
            />
          </section>

          {/* Related Products */}
          <RelatedProducts
            products={relatedProducts}
            currentProductId={product.id}
          />
        </div>
      </div>
    </>
  );
}
