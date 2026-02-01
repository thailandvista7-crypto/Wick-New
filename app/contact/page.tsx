'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // In production, this would send to your backend/email service
    setTimeout(() => {
      toast.success('Thank you! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-beige-50">
      <div className="bg-white border-b border-olive-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-olive-900 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-olive-700">
            We'd love to hear from you. Send us a message and we'll respond as
            soon as possible.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-semibold text-olive-900 mb-6">
              Get in Touch
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-olive-700 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-olive-900 mb-1">Email</h3>
                  <a
                    href="mailto:hello@wickandlather.com"
                    className="text-olive-700 hover:text-olive-600 transition-colors"
                  >
                    hello@wickandlather.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-olive-700 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-olive-900 mb-1">Phone</h3>
                  <a
                    href="tel:+15550123"
                    className="text-olive-700 hover:text-olive-600 transition-colors"
                  >
                    +1 (555) 012-3456
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-olive-700 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-olive-900 mb-1">Address</h3>
                  <p className="text-olive-700">
                    123 Artisan Lane
                    <br />
                    Craft City, CC 12345
                    <br />
                    United States
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-olive-50 rounded-xl">
              <h3 className="font-semibold text-olive-900 mb-2">
                Business Hours
              </h3>
              <p className="text-olive-700">
                Monday - Friday: 9:00 AM - 5:00 PM EST
                <br />
                Saturday: 10:00 AM - 3:00 PM EST
                <br />
                Sunday: Closed
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-olive-700 font-medium mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-olive-300 focus:outline-none focus:ring-2 focus:ring-olive-500"
                />
              </div>
              <div>
                <label className="block text-olive-700 font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-olive-300 focus:outline-none focus:ring-2 focus:ring-olive-500"
                />
              </div>
              <div>
                <label className="block text-olive-700 font-medium mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-olive-300 focus:outline-none focus:ring-2 focus:ring-olive-500"
                />
              </div>
              <div>
                <label className="block text-olive-700 font-medium mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-olive-300 focus:outline-none focus:ring-2 focus:ring-olive-500 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-olive-700 text-white rounded-lg hover:bg-olive-800 transition-all duration-300 shadow-soft font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
