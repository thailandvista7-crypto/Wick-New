import { Accordion } from '@/components/ui/Accordion';

export const metadata = {
  title: 'Frequently Asked Questions | Wick & Lather',
  description:
    'Find answers to common questions about our luxury soaps, candles, shipping, returns, and more.',
};

const faqs = [
  {
    question: 'What makes your soaps different from store-bought soaps?',
    answer:
      'Our soaps are handcrafted using the traditional cold-process method, which preserves the natural glycerin and beneficial properties of our premium ingredients. Unlike commercial soaps that often strip natural oils, our soaps are formulated to moisturize and nourish your skin. We use only natural ingredients—no harsh chemicals, synthetic fragrances, or artificial preservatives. Each bar is cured for six to eight weeks to ensure optimal quality and longevity.',
  },
  {
    question: 'How long do your candles burn?',
    answer:
      'Our candles are designed to burn for approximately 50-60 hours, depending on the size and how they\'re used. To maximize burn time, we recommend trimming the wick to 1/4 inch before each use and allowing the candle to burn long enough for the entire top layer to melt (usually 2-3 hours). This prevents tunneling and ensures an even burn throughout the candle\'s life.',
  },
  {
    question: 'Are your products suitable for sensitive skin?',
    answer:
      'Yes! Many of our products are specifically formulated for sensitive skin. Our Lavender & Oatmeal Calming Soap is particularly gentle and soothing. However, we always recommend doing a patch test if you have known allergies or very sensitive skin. All our products are made with natural ingredients and are free from harsh chemicals, but individual sensitivities can vary. If you have specific concerns, please contact us before purchasing.',
  },
  {
    question: 'What is your shipping policy?',
    answer:
      'We offer standard shipping (5-7 business days) and expedited shipping (2-3 business days) within the United States. Shipping costs are calculated at checkout based on your location and order size. Orders over $75 qualify for free standard shipping. International shipping is available to select countries—please contact us for rates and delivery times. All orders are carefully packaged to ensure your products arrive in perfect condition.',
  },
  {
    question: 'Do you offer refunds or returns?',
    answer:
      'We want you to be completely satisfied with your purchase. If you\'re not happy with your order, you can return unopened, unused products within 30 days of delivery for a full refund. Opened products cannot be returned for hygiene reasons, but if you experience any issues with product quality, please contact us and we\'ll make it right. Return shipping costs are the customer\'s responsibility unless the product was damaged or incorrect.',
  },
  {
    question: 'How should I store my soap?',
    answer:
      'To maximize the life of your soap, keep it in a well-drained soap dish between uses. This allows the soap to dry out, preventing it from becoming soft or mushy. Avoid leaving soap sitting in water. Our soaps will last longer if stored in a cool, dry place when not in use. Properly stored, our soaps can last for months.',
  },
  {
    question: 'Can I customize orders for gifts or events?',
    answer:
      'Yes! We offer gift wrapping and can create custom gift sets. For larger orders or special events, please contact us at least two weeks in advance so we can ensure we have sufficient stock and can accommodate your needs. We\'re happy to work with you to create the perfect gift or event favor.',
  },
  {
    question: 'Are your products cruelty-free and vegan?',
    answer:
      'All our products are cruelty-free—we never test on animals. Many of our products are vegan, but some contain ingredients like honey or beeswax. Each product page clearly lists all ingredients, so you can make an informed choice. We\'re committed to ethical sourcing and sustainable practices throughout our supply chain.',
  },
  {
    question: 'What if my product arrives damaged?',
    answer:
      'We take great care in packaging your order, but occasionally damage can occur during shipping. If your product arrives damaged, please contact us immediately with photos of the damage and your order number. We\'ll send a replacement right away at no cost to you. Your satisfaction is our priority.',
  },
  {
    question: 'Do you offer wholesale or bulk pricing?',
    answer:
      'Yes, we offer wholesale pricing for retailers and bulk pricing for larger orders. Please contact us at hello@wickandlather.com with details about your business or order size, and we\'ll provide a custom quote. We love working with retailers who share our values and commitment to quality.',
  },
];

export default function FAQsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-beige-50">
        <div className="bg-white border-b border-olive-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-olive-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-olive-700">
              Find answers to common questions about our products, shipping,
              returns, and more.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>

          <div className="mt-12 p-8 bg-olive-50 rounded-2xl">
            <h2 className="text-2xl font-semibold text-olive-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-olive-700 mb-4">
              We're here to help! Contact us and we'll get back to you as soon
              as possible.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center text-olive-700 font-semibold hover:text-olive-600 transition-colors"
            >
              Contact Us →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
