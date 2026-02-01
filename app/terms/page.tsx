export const metadata = {
  title: 'Terms of Service | Wick & Lather',
  description: 'Read our terms of service to understand the rules and regulations for using our website and purchasing our products.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-beige-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-serif font-bold text-olive-900 mb-8">
          Terms of Service
        </h1>
        <div className="prose prose-olive max-w-none bg-white rounded-2xl p-8 shadow-soft">
          <p className="text-sm text-olive-600 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-olive-900 mb-4">
              Acceptance of Terms
            </h2>
            <p className="text-olive-700 leading-relaxed">
              By accessing and using the Wick & Lather website, you accept and
              agree to be bound by these Terms of Service. If you do not agree
              to these terms, please do not use our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-olive-900 mb-4">
              Products and Pricing
            </h2>
            <p className="text-olive-700 leading-relaxed mb-4">
              We strive to provide accurate product descriptions and pricing.
              However, we reserve the right to correct any errors and to change
              prices at any time without prior notice. All prices are in USD
              unless otherwise stated.
            </p>
            <p className="text-olive-700 leading-relaxed">
              Product availability is subject to change. If a product becomes
              unavailable after you place an order, we will notify you and
              provide a full refund.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-olive-900 mb-4">
              Orders and Payment
            </h2>
            <p className="text-olive-700 leading-relaxed mb-4">
              When you place an order, you are making an offer to purchase
              products at the listed price. We reserve the right to accept or
              reject any order. Payment must be received before we process and
              ship your order.
            </p>
            <p className="text-olive-700 leading-relaxed">
              We accept major credit cards and process payments securely through
              Stripe. All payment information is encrypted and secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-olive-900 mb-4">
              Shipping and Delivery
            </h2>
            <p className="text-olive-700 leading-relaxed">
              Shipping costs and estimated delivery times are provided at
              checkout. We are not responsible for delays caused by shipping
              carriers or customs. Risk of loss and title pass to you upon
              delivery to the carrier.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-olive-900 mb-4">
              Intellectual Property
            </h2>
            <p className="text-olive-700 leading-relaxed">
              All content on this website, including text, graphics, logos, and
              images, is the property of Wick & Lather and is protected by
              copyright and trademark laws. You may not reproduce, distribute, or
              use any content without our written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-olive-900 mb-4">
              Limitation of Liability
            </h2>
            <p className="text-olive-700 leading-relaxed">
              To the fullest extent permitted by law, Wick & Lather shall not be
              liable for any indirect, incidental, special, or consequential
              damages arising from your use of our website or products.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-olive-900 mb-4">
              Contact Us
            </h2>
            <p className="text-olive-700 leading-relaxed">
              If you have questions about these terms, please contact us at{' '}
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
