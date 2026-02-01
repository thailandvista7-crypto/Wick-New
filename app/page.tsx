import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getProductImage } from '@/lib/product-utils';
import HeroCarousel from '@/components/home/HeroCarousel';
import AnimatedStorySection from '@/components/home/AnimatedStorySection';
import AnimatedFeaturedProducts from '@/components/home/AnimatedFeaturedProducts';

export const metadata = {
  title: 'Wick & Lather | Luxury Handcrafted Soaps & Candles from Thailand',
  description:
    'Premium handcrafted soaps and luxury scented candles made in Thailand. Export-quality wellness products crafted with natural ingredients, Thai heritage, and artisanal excellence. International shipping available.',
  keywords: 'handcrafted soaps Thailand, luxury candles Thailand, Thai artisan soap, premium candles Thailand, natural skincare Thailand, export quality soap, luxury wellness products, Thai handcrafted goods',
  openGraph: {
    title: 'Wick & Lather | Luxury Handcrafted Soaps & Candles from Thailand',
    description: 'Premium handcrafted soaps and luxury scented candles made in Thailand. Export-quality wellness products for global customers.',
    type: 'website',
    locale: 'en_US',
  },
};

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    take: 4,
  });

  return (
    <>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Story Section */}
      <AnimatedStorySection />

      {/* Featured Products */}
      <AnimatedFeaturedProducts products={featuredProducts} />

      {/* Values Section */}
      <section className="py-20 bg-white" aria-labelledby="values-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="values-heading" className="text-3xl font-serif font-bold text-olive-900 text-center mb-12">
            Thai Craftsmanship & Export Quality
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <article className="text-center">
              <div className="w-16 h-16 bg-olive-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-olive-700" />
              </div>
              <h3 className="text-xl font-semibold text-olive-900 mb-2">
                Thai Heritage & Natural Ingredients
              </h3>
              <p className="text-olive-700">
                Handcrafted in Thailand using traditional techniques and premium natural ingredients. Each product reflects our commitment to Thai artisan heritage and export-quality standards.
              </p>
            </article>
            <article className="text-center">
              <div className="w-16 h-16 bg-olive-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-olive-700" />
              </div>
              <h3 className="text-xl font-semibold text-olive-900 mb-2">
                Export-Ready Packaging
              </h3>
              <p className="text-olive-700">
                Every product is carefully packaged for international shipping. Our export-quality standards ensure your order arrives safely, whether you're in the US, EU, GCC, or Asia.
              </p>
            </article>
            <article className="text-center">
              <div className="w-16 h-16 bg-olive-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-olive-700" />
              </div>
              <h3 className="text-xl font-semibold text-olive-900 mb-2">
                Ethical Sourcing & Sustainability
              </h3>
              <p className="text-olive-700">
                We source ingredients responsibly and support local Thai communities. Our eco-friendly packaging and sustainable practices make us a trusted choice for conscious global customers.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-olive-700 to-olive-900 text-white" aria-labelledby="cta-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="cta-heading" className="text-4xl font-serif font-bold mb-6">
            Experience Thai Craftsmanship, Delivered Globally
          </h2>
          <p className="text-xl text-olive-100 mb-8">
            Discover luxury handcrafted soaps and premium candles made in Thailand. International shipping available to customers worldwide.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center px-8 py-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-300 shadow-luxury font-medium text-lg"
            aria-label="Shop our collection of handcrafted soaps and candles"
          >
            Shop Collection
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* SEO Content - Main H1 Section */}
      <section className="py-16 bg-beige-50" aria-labelledby="main-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-olive max-w-none">
            <h1 id="main-heading" className="text-4xl md:text-5xl font-serif font-bold text-olive-900 mb-6 text-center">
              Luxury Handcrafted Soaps & Scented Candles from Thailand
            </h1>
            <p className="text-xl text-olive-700 mb-8 leading-relaxed text-center max-w-3xl mx-auto">
              Wick & Lather brings you premium handcrafted soaps and luxury scented candles made in Thailand. Our products combine traditional Thai craftsmanship with modern wellness needs, creating export-quality goods designed for international customers seeking authentic, artisanal luxury.
            </p>
          </div>
        </div>
      </section>

      {/* SEO Content - Structured H2 Sections */}
      <section className="py-16 bg-white" aria-labelledby="thai-craftsmanship-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-olive max-w-none">
            <h2 id="thai-craftsmanship-heading" className="text-3xl font-serif font-bold text-olive-900 mb-6">
              Thai Craftsmanship & Heritage
            </h2>
            <p className="text-lg text-olive-700 mb-4 leading-relaxed">
              Each product is handcrafted in Thailand by skilled artisans who have mastered traditional techniques passed down through generations. Our commitment to Thai heritage means every bar of soap and every candle reflects the quality and attention to detail that Thailand is renowned for in the global market.
            </p>
            <p className="text-lg text-olive-700 leading-relaxed">
              We honor the time-honored methods of Thai artisan production while meeting the rigorous standards required for international export. This dedication to craftsmanship ensures that customers in the US, EU, GCC, and Asia receive products that embody authentic Thai quality and luxury.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-beige-50" aria-labelledby="natural-ingredients-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-olive max-w-none">
            <h2 id="natural-ingredients-heading" className="text-3xl font-serif font-bold text-olive-900 mb-6">
              Natural Ingredients & Safety Standards
            </h2>
            <p className="text-lg text-olive-700 mb-4 leading-relaxed">
              Our handcrafted soaps are made using the traditional cold-process method, preserving the natural benefits of premium ingredients like coconut oil, shea butter, and essential oils. Our luxury candles feature natural soy wax and carefully selected fragrance oils.
            </p>
            <p className="text-lg text-olive-700 leading-relaxed">
              All products meet international safety and quality standards, making them suitable for export to the US, EU, GCC, and Asian markets. We source ingredients responsibly and test every batch to ensure consistency and safety for our global customers.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" aria-labelledby="export-quality-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-olive max-w-none">
            <h2 id="export-quality-heading" className="text-3xl font-serif font-bold text-olive-900 mb-6">
              Export-Quality Production & International Shipping
            </h2>
            <p className="text-lg text-olive-700 mb-4 leading-relaxed">
              Every product is manufactured with export requirements in mind. Our packaging is designed to protect your order during international shipping, ensuring that your luxury soaps and candles arrive in perfect condition.
            </p>
            <p className="text-lg text-olive-700 leading-relaxed">
              We understand the needs of global customers and have structured our production and shipping processes accordingly. Our export-ready packaging meets international standards, and we work with trusted shipping partners to deliver your order safely, whether you're in the US, EU, GCC, or Asia.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-beige-50" aria-labelledby="luxury-lifestyle-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-olive max-w-none">
            <h2 id="luxury-lifestyle-heading" className="text-3xl font-serif font-bold text-olive-900 mb-6">
              Luxury Gifting & Lifestyle Use
            </h2>
            <p className="text-lg text-olive-700 mb-4 leading-relaxed">
              Our handcrafted soaps and scented candles make exceptional gifts for those who appreciate quality and craftsmanship. Whether you're looking for a thoughtful present or enhancing your own daily wellness ritual, our products offer a touch of Thai luxury that elevates any moment.
            </p>
            <p className="text-lg text-olive-700 leading-relaxed">
              Explore our <Link href="/shop?category=soap" className="text-olive-700 underline hover:text-olive-600 font-medium">luxury soap collection</Link> featuring formulas for normal, sensitive, dry, and oily skin types, or discover our <Link href="/shop?category=candle" className="text-olive-700 underline hover:text-olive-600 font-medium">premium candle range</Link> with carefully curated scent profiles. Each product is handcrafted in Thailand and designed to meet the expectations of discerning international customers.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
