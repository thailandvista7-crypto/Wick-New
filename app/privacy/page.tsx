export const metadata = {
  title: 'Privacy Policy | Wick & Lather',
  description: 'Read our privacy policy to understand how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-beige-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-serif font-bold text-olive-900 mb-8">
          Privacy Policy
        </h1>
        <div className="prose prose-olive max-w-none bg-white rounded-2xl p-8 shadow-soft">
          <p className="text-sm text-olive-600 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-olive-900 mb-4">
              Introduction
            </h2>
            <p className="text-olive-700 leading-relaxed mb-4">
              At Wick & Lather, we respect your privacy and are committed to
              protecting your personal data. This privacy policy explains how we
              collect, use, and safeguard your information when you visit our
              website or make a purchase.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-olive-900 mb-4">
              Information We Collect
            </h2>
            <p className="text-olive-700 leading-relaxed mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-olive-700 space-y-2 mb-4">
              <li>Name and contact information (email, phone, address)</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Order history and preferences</li>
              <li>Communication preferences</li>
            </ul>
            <p className="text-olive-700 leading-relaxed">
              We also automatically collect certain information when you visit
              our website, such as IP address, browser type, and browsing
              behavior.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-olive-900 mb-4">
              How We Use Your Information
            </h2>
            <p className="text-olive-700 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-olive-700 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders and our products</li>
              <li>Improve our website and customer experience</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-olive-900 mb-4">
              Data Security
            </h2>
            <p className="text-olive-700 leading-relaxed">
              We implement appropriate technical and organizational measures to
              protect your personal data against unauthorized access, alteration,
              disclosure, or destruction. All payment information is processed
              securely through Stripe and is never stored on our servers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-olive-900 mb-4">
              Your Rights
            </h2>
            <p className="text-olive-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-olive-700 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Object to processing of your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-olive-900 mb-4">
              Contact Us
            </h2>
            <p className="text-olive-700 leading-relaxed">
              If you have questions about this privacy policy or wish to
              exercise your rights, please contact us at{' '}
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
