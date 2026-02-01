# Wick & Lather - Luxury Ecommerce Platform

A full-stack luxury ecommerce website for handcrafted soaps and candles, built with Next.js, TypeScript, Prisma, and Stripe.

## Features

- **Luxury Design**: Elegant, minimalist design with olive green, beige, and amber color palette
- **Full Ecommerce**: Complete shopping cart, checkout, and order management
- **Stripe Integration**: Secure payment processing with Stripe Checkout
- **Admin Dashboard**: Comprehensive admin panel for managing products, orders, and customers
- **SEO Optimized**: Complete SEO implementation with JSON-LD structured data, sitemap, and meta tags
- **Responsive Design**: Mobile-first, fully responsive across all devices
- **Product Management**: CRUD operations for products with inventory tracking
- **Order Management**: Track and manage customer orders
- **12 Premium Products**: Pre-seeded with 6 luxury soaps and 6 luxury candles

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based admin authentication
- **Payments**: Stripe Checkout
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- SQLite (included, no setup required for local dev)
- Stripe account (for payments - optional for local dev)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wick-and-lather
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

The `.env` file is already created with SQLite configuration for local development. For production, update:
- `DATABASE_URL`: Change to PostgreSQL connection string for production
- `JWT_SECRET`: Use a strong secret key in production
- `STRIPE_SECRET_KEY`: Your Stripe secret key (required for checkout)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret (for production)
- `NEXT_PUBLIC_APP_URL`: Your app URL (e.g., http://localhost:3000)
- `ADMIN_EMAIL`: Admin login email
- `ADMIN_PASSWORD`: Admin login password

4. Set up the database (SQLite for local dev):
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

The database file `dev.db` will be created automatically in the project root.

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── products/          # Product detail pages
│   ├── shop/              # Shop page
│   └── ...                # Other pages (about, contact, etc.)
├── components/            # React components
│   ├── layout/           # Header, Footer
│   ├── products/         # Product components
│   └── ui/               # UI components
├── lib/                  # Utility functions
│   ├── prisma.ts        # Prisma client
│   ├── auth.ts          # Authentication utilities
│   ├── stripe.ts        # Stripe client
│   └── cart.ts          # Cart utilities
├── prisma/              # Database schema and seeds
└── public/              # Static assets
```

## Admin Access

Default admin credentials (change in production):
- Email: `admin@wickandlather.com`
- Password: `admin123`

Access the admin dashboard at `/admin/login`

## Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Add them to your `.env` file
4. For webhooks (production), set up a webhook endpoint pointing to `/api/webhook`

## Database Schema

- **User**: Admin and customer accounts
- **Product**: Product catalog with SEO fields
- **Order**: Customer orders
- **OrderItem**: Order line items
- **Coupon**: Discount codes (schema ready, implementation optional)

**Note**: The project uses SQLite for local development (no external database required). For production, switch to PostgreSQL by updating the `datasource` in `prisma/schema.prisma` and your `DATABASE_URL`.

## SEO Features

- JSON-LD structured data (Product, Organization, FAQPage, BreadcrumbList)
- Comprehensive meta tags
- Sitemap.xml generation
- Robots.txt configuration
- Internal linking structure
- Long-form SEO content on key pages

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Set up PostgreSQL database (or use SQLite for simple deployments)
- Configure environment variables
- Run `npm run build`
- Start with `npm start`

## Production Checklist

- [ ] Change admin credentials
- [ ] Switch to PostgreSQL database (update `prisma/schema.prisma`)
- [ ] Configure Stripe webhooks
- [ ] Update `NEXT_PUBLIC_APP_URL` to production URL
- [ ] Set secure JWT secret
- [ ] Enable HTTPS
- [ ] Set up email service (for order confirmations)
- [ ] Configure CDN for images
- [ ] Set up monitoring and error tracking

## License

This project is proprietary and confidential.

## Support

For support, email hello@wickandlather.com
