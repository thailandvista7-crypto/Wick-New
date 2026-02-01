export const metadata = {
  title: 'Refund Policy | Wick & Lather',
  description: 'Learn about our refund and return policy for your purchases.',
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-beige-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-serif font-bold text-olive-900 mb-8">
          Refund Policy
        </h1>
        <div className="prose prose-olive max-w-none bg-white rounded-2xl p-8 shadow-soft">
          <p className="text-sm text-olive-600 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-olive-900 mb-4">
              Returns
            </h2>
            <p className="text-olive-700 leading-relaxed mb-4">
              We want you to be completely satisfied with your purchase. If
              you're not happy with your order, you may return unopened, unused
              products within 30 days of delivery for a full refund.
            </p>
            <p className="text-olive-700 leading-relaxed">
              To initiate a return, please contact us at{' '}
              <a
                href="mailto:hello@wickandlather.com"
                className="text-olive-700 hover:text-olive-600 underline"
              >
                hello@wickandlather.com
              </a>{' '}
              with your order number. We'll provide you with a return
              authorization and instructions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-olive-900 mb-4">
              Refund Process
            </h2>
            <p className="text-olive-700 leading-relaxed mb-4">
              Once we receive your returned item(s) in their original condition,
              we will process your refund within 5-7 business days. Refunds will
              be issued to the original payment method.
            </p>
            <p className="text-olive-700 leading-relaxed">
              Return shipping costs are the customer's responsibility unless the
              product was damaged, defective, or incorrect. In such cases, we
              will cover return shipping costs.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-olive-900 mb-4">
              Non-Refundable Items
            </h2>
            <p className="text-olive-700 leading-relaxed mb-4">
              For hygiene reasons, opened or used products cannot be returned.
              However, if you experience any issues with product quality or
              receive a damaged or incorrect item, please contact us immediately
              and we'll make it right.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-olive-900 mb-4">
              Damaged or Defective Products
            </h2>
            <p className="text-olive-700 leading-relaxed">
              If you receive a damaged or defective product, please contact us
              within 7 days of delivery with photos of the damage. We'll send a
              replacement immediately at no cost to you, or provide a full refund
              if you prefer.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-olive-900 mb-4">
              Contact Us
            </h2>
            <p className="text-olive-700 leading-relaxed">
              If you have questions about returns or refunds, please contact us
              at{' '}
              <a
                href="mailto:hello@wickandlather.com"
                className="text-olive-700 hover:text-olive-600 underline"
              >
                hello@wickandlather.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
