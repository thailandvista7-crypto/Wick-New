import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://wickandlather.com';

  // Get all products
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      select: { slug: true, updatedAt: true },
    });
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error);
  }

  // Static pages
  const staticPages = [
    '',
    '/shop',
    '/about',
    '/faqs',
    '/contact',
    '/privacy',
    '/terms',
    '/refund',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Product pages
  const productPages = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages];
}
