import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Heart, Leaf, Award } from 'lucide-react';

export const metadata = {
  title: 'About Us | Wick & Lather - Our Story & Craftsmanship',
  description:
    'Learn about Wick & Lather\'s commitment to handcrafted luxury, natural ingredients, and artisanal care. Discover our story and values.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-beige-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-olive-700 to-olive-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
            Our Story
          </h1>
          <p className="text-xl text-olive-100 max-w-2xl mx-auto">
            Crafting luxury soaps and candles with passion, care, and a
            commitment to natural ingredients
          </p>
        </div>
      </section>

      {/* Main Story */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg prose-olive max-w-none">
            <h2 className="text-3xl font-serif font-bold text-olive-900 mb-6">
              The Beginning
            </h2>
            <p className="text-lg text-olive-700 mb-6 leading-relaxed">
              Wick & Lather was born from a simple yet profound belief: that
              self-care should be accessible, meaningful, and luxurious. Our
              founder, inspired by generations of artisanal soap-making
              traditions, set out to create products that honor both your skin
              and your senses.
            </p>
            <p className="text-lg text-olive-700 mb-6 leading-relaxed">
              What started as a small home-based operation has grown into a
              dedicated workshop where every bar of soap and every candle is
              handcrafted with meticulous attention to detail. We've never lost
              sight of our original mission: to create products that transform
              your daily routine into a moment of indulgence.
            </p>

            <h2 className="text-3xl font-serif font-bold text-olive-900 mb-6 mt-12">
              Our Craftsmanship
            </h2>
            <p className="text-lg text-olive-700 mb-6 leading-relaxed">
              Every product at Wick & Lather is made using traditional methods
              that have been refined over centuries. Our soaps are created using
              the cold-process method, which preserves the natural properties of
              our premium ingredients. This technique requires patience—each bar
              is carefully mixed, poured, and then cured for six to eight weeks
              to achieve the perfect texture and longevity.
            </p>
            <p className="text-lg text-olive-700 mb-6 leading-relaxed">
              Our candles are hand-poured in small batches, ensuring consistent
              quality and optimal fragrance throw. We use premium soy wax, which
              burns cleaner and longer than paraffin, and natural cotton wicks
              that create a beautiful, even flame. Each candle is tested to
              ensure it meets our exacting standards before it reaches you.
            </p>

            <h2 className="text-3xl font-serif font-bold text-olive-900 mb-6 mt-12">
              Our Ingredients
            </h2>
            <p className="text-lg text-olive-700 mb-6 leading-relaxed">
              We believe that what you put on your skin matters. That's why we
              source only the finest natural and organic ingredients from trusted
              suppliers around the world. From cold-pressed olive oil from the
              Mediterranean to shea butter from West Africa, from French
              lavender essential oil to Indian sandalwood, every ingredient is
              chosen for its quality, efficacy, and ethical sourcing.
            </p>
            <p className="text-lg text-olive-700 mb-6 leading-relaxed">
              We never use harsh chemicals, synthetic fragrances, or artificial
              preservatives. Our products are cruelty-free, and we're committed
              to using sustainable, eco-friendly packaging wherever possible. We
              believe that luxury and responsibility can coexist beautifully.
            </p>

            <h2 className="text-3xl font-serif font-bold text-olive-900 mb-6 mt-12">
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-6 my-8">
              <div className="text-center p-6 bg-beige-50 rounded-xl">
                <Heart className="w-12 h-12 text-olive-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-olive-900 mb-2">
                  Quality First
                </h3>
                <p className="text-olive-700">
                  We never compromise on quality, from ingredient selection to
                  final packaging.
                </p>
              </div>
              <div className="text-center p-6 bg-beige-50 rounded-xl">
                <Leaf className="w-12 h-12 text-olive-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-olive-900 mb-2">
                  Natural & Safe
                </h3>
                <p className="text-olive-700">
                  All our products are made with natural ingredients, safe for
                  you and the environment.
                </p>
              </div>
              <div className="text-center p-6 bg-beige-50 rounded-xl">
                <Award className="w-12 h-12 text-olive-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-olive-900 mb-2">
                  Artisan Made
                </h3>
                <p className="text-olive-700">
                  Every product is handcrafted with care, ensuring unique
                  quality in every batch.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-serif font-bold text-olive-900 mb-6 mt-12">
              Looking Forward
            </h2>
            <p className="text-lg text-olive-700 mb-6 leading-relaxed">
              As we continue to grow, our commitment to quality, craftsmanship,
              and customer satisfaction remains unwavering. We're constantly
              exploring new ingredients, refining our formulas, and developing
              new products that align with our values and your needs.
            </p>
            <p className="text-lg text-olive-700 mb-8 leading-relaxed">
              Thank you for being part of our journey. Every purchase supports
              our mission to bring luxury, natural self-care products into your
              daily life. We're honored to be part of your wellness routine.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-olive-700 to-olive-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif font-bold mb-6">
            Experience Our Craft
          </h2>
          <p className="text-xl text-olive-100 mb-8">
            Discover our handcrafted collection of luxury soaps and candles
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-300 shadow-luxury font-medium text-lg"
          >
            Shop Collection
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
