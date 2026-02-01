import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'admin123',
    10
  );

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@wickandlather.com' },
    update: {
      password: hashedPassword, // Always update password to ensure it's correct
      role: 'admin',
    },
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@wickandlather.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
    },
  });

  console.log('Admin user created:', admin.email);

  // Products data
  const products = [
    // Luxury Soaps
    {
      name: 'Olive & Honey Artisan Soap',
      slug: 'olive-honey-artisan-soap',
      category: 'soap',
      shortDesc: 'A luxurious blend of cold-pressed olive oil and raw honey, handcrafted to nourish and restore your skin\'s natural radiance.',
      longDesc: 'Our Olive & Honey Artisan Soap represents the pinnacle of handcrafted luxury. Each bar is meticulously created using traditional cold-process methods, combining the finest cold-pressed extra virgin olive oil with raw, unfiltered honey sourced from local apiaries. This gentle yet effective formula has been cherished for centuries for its ability to moisturize, soothe, and protect the skin. The olive oil provides deep hydration and antioxidants, while the honey offers natural antibacterial properties and a subtle, warm sweetness. Perfect for daily use, this soap leaves your skin feeling silky smooth and delicately scented. Each bar is cured for six weeks to ensure maximum quality and longevity.',
      ingredients: 'Saponified olive oil, raw honey, shea butter, coconut oil, essential oils, natural glycerin',
      price: 24.99,
      comparePrice: 29.99,
      sku: 'SOAP-OLIVE-001',
      stock: 50,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800',
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
      ]),
      seoTitle: 'Olive & Honey Artisan Soap | Luxury Handcrafted Soap | Wick & Lather',
      seoDescription: 'Experience the luxury of our handcrafted Olive & Honey Artisan Soap. Made with cold-pressed olive oil and raw honey, this premium soap nourishes and restores your skin\'s natural radiance.',
      featured: true,
    },
    {
      name: 'Lavender & Oatmeal Calming Soap',
      slug: 'lavender-oatmeal-calming-soap',
      category: 'soap',
      shortDesc: 'A soothing blend of French lavender and finely ground oatmeal, designed to calm sensitive skin and promote relaxation.',
      longDesc: 'Indulge in tranquility with our Lavender & Oatmeal Calming Soap. This therapeutic blend combines the calming essence of French lavender essential oil with the gentle exfoliating properties of finely ground organic oatmeal. Lavender has been revered for centuries for its ability to reduce stress and promote restful sleep, while oatmeal is known for its anti-inflammatory properties that soothe irritated and sensitive skin. The creamy lather gently cleanses without stripping natural oils, making it ideal for those with eczema, psoriasis, or dry skin conditions. Each bar is handcrafted in small batches and cured to perfection, ensuring a long-lasting, luxurious experience.',
      ingredients: 'Saponified coconut oil, olive oil, shea butter, organic oatmeal, French lavender essential oil, natural glycerin',
      price: 26.99,
      comparePrice: 32.99,
      sku: 'SOAP-LAV-002',
      stock: 45,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800',
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800',
      ]),
      seoTitle: 'Lavender & Oatmeal Calming Soap | Sensitive Skin Soap | Wick & Lather',
      seoDescription: 'Soothe sensitive skin with our Lavender & Oatmeal Calming Soap. Made with French lavender and organic oatmeal for a gentle, therapeutic cleansing experience.',
      featured: true,
    },
    {
      name: 'Charcoal & Tea Tree Detox Soap',
      slug: 'charcoal-tea-tree-detox-soap',
      category: 'soap',
      shortDesc: 'Activated charcoal and tea tree oil work together to deeply cleanse and purify, perfect for oily and acne-prone skin.',
      longDesc: 'Transform your skincare routine with our Charcoal & Tea Tree Detox Soap. This powerful yet gentle formula harnesses the purifying properties of activated bamboo charcoal and the antimicrobial benefits of Australian tea tree essential oil. Activated charcoal acts like a magnet, drawing out impurities, excess oil, and toxins from deep within your pores. Tea tree oil, known for its natural antiseptic properties, helps combat acne-causing bacteria while soothing inflammation. Together, they create a deep-cleansing experience that leaves your skin feeling refreshed, balanced, and revitalized. Ideal for those with oily, combination, or acne-prone skin, this soap helps maintain clear, healthy-looking skin without over-drying.',
      ingredients: 'Saponified coconut oil, activated bamboo charcoal, Australian tea tree essential oil, olive oil, natural glycerin',
      price: 27.99,
      comparePrice: 33.99,
      sku: 'SOAP-CHAR-003',
      stock: 40,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800',
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
      ]),
      seoTitle: 'Charcoal & Tea Tree Detox Soap | Deep Cleansing Soap | Wick & Lather',
      seoDescription: 'Deeply cleanse and purify with our Charcoal & Tea Tree Detox Soap. Perfect for oily and acne-prone skin, featuring activated charcoal and tea tree oil.',
      featured: false,
    },
    {
      name: 'Rose & Argan Oil Luxury Soap',
      slug: 'rose-argan-oil-luxury-soap',
      category: 'soap',
      shortDesc: 'An opulent blend of Bulgarian rose petals and Moroccan argan oil, delivering intense hydration and a romantic, floral fragrance.',
      longDesc: 'Experience pure luxury with our Rose & Argan Oil Luxury Soap. This exquisite creation combines the delicate beauty of Bulgarian rose petals with the nourishing power of cold-pressed Moroccan argan oil, often called "liquid gold" for its remarkable skin benefits. The rose petals are carefully infused to release their natural antioxidants and gentle astringent properties, while argan oil provides deep hydration, vitamin E, and essential fatty acids that help restore skin elasticity and radiance. The result is a sumptuous, creamy lather that envelops you in a romantic, floral fragrance reminiscent of a blooming rose garden. This soap is perfect for those seeking an indulgent daily ritual that pampers both body and soul.',
      ingredients: 'Saponified argan oil, olive oil, Bulgarian rose petals, rose essential oil, shea butter, natural glycerin',
      price: 29.99,
      comparePrice: 35.99,
      sku: 'SOAP-ROSE-004',
      stock: 35,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800',
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
      ]),
      seoTitle: 'Rose & Argan Oil Luxury Soap | Premium Hydrating Soap | Wick & Lather',
      seoDescription: 'Indulge in luxury with our Rose & Argan Oil Luxury Soap. Featuring Bulgarian rose petals and Moroccan argan oil for intense hydration and a romantic fragrance.',
      featured: true,
    },
    {
      name: 'Eucalyptus & Mint Revitalizing Soap',
      slug: 'eucalyptus-mint-revitalizing-soap',
      category: 'soap',
      shortDesc: 'An invigorating blend of eucalyptus and peppermint that awakens the senses and energizes your morning routine.',
      longDesc: 'Start your day with renewed energy using our Eucalyptus & Mint Revitalizing Soap. This refreshing formula combines the crisp, clean scent of Australian eucalyptus with the cooling sensation of organic peppermint essential oil. Eucalyptus is renowned for its ability to open airways and promote mental clarity, while peppermint provides a natural cooling effect that invigorates tired muscles and awakens the senses. The soap creates a rich, foamy lather that thoroughly cleanses while leaving behind a refreshing, minty fragrance that lingers subtly throughout the day. Perfect for morning showers, post-workout cleansing, or whenever you need a natural energy boost. The combination of these two powerful botanicals creates an experience that is both cleansing and revitalizing.',
      ingredients: 'Saponified coconut oil, olive oil, Australian eucalyptus essential oil, organic peppermint essential oil, natural glycerin',
      price: 25.99,
      comparePrice: 30.99,
      sku: 'SOAP-EUC-005',
      stock: 48,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800',
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800',
      ]),
      seoTitle: 'Eucalyptus & Mint Revitalizing Soap | Energizing Soap | Wick & Lather',
      seoDescription: 'Awaken your senses with our Eucalyptus & Mint Revitalizing Soap. An invigorating blend perfect for morning routines and post-workout cleansing.',
      featured: false,
    },
    {
      name: 'Vanilla & Shea Butter Nourishing Soap',
      slug: 'vanilla-shea-butter-nourishing-soap',
      category: 'soap',
      shortDesc: 'Rich shea butter and warm vanilla create a deeply moisturizing experience that transforms dry skin into silky smoothness.',
      longDesc: 'Pamper your skin with our Vanilla & Shea Butter Nourishing Soap, a decadent treat for dry and mature skin. This luxurious formula features unrefined shea butter from West Africa, known for its exceptional moisturizing properties and high concentration of vitamins A and E. Combined with the warm, comforting scent of Madagascar vanilla, this soap creates a rich, creamy lather that deeply hydrates and nourishes. Shea butter helps restore the skin\'s natural barrier, lock in moisture, and improve elasticity, while vanilla provides a soothing, gourmand fragrance that feels indulgent and comforting. Perfect for those with dry, sensitive, or mature skin, this soap helps combat the effects of harsh weather, aging, and environmental stressors. Each bar is handcrafted to ensure maximum shea butter content for optimal skin benefits.',
      ingredients: 'Saponified shea butter, coconut oil, olive oil, Madagascar vanilla extract, natural glycerin',
      price: 28.99,
      comparePrice: 34.99,
      sku: 'SOAP-VAN-006',
      stock: 42,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800',
      ]),
      seoTitle: 'Vanilla & Shea Butter Nourishing Soap | Deep Moisturizing Soap | Wick & Lather',
      seoDescription: 'Deeply nourish dry skin with our Vanilla & Shea Butter Nourishing Soap. Rich in shea butter and vanilla for silky smooth, hydrated skin.',
      featured: false,
    },
    // Luxury Candles
    {
      name: 'Sage & Cedarwood Meditation Candle',
      slug: 'sage-cedarwood-meditation-candle',
      category: 'candle',
      shortDesc: 'A grounding blend of white sage and cedarwood that promotes mindfulness, clarity, and peaceful moments of reflection.',
      longDesc: 'Create a sanctuary of calm with our Sage & Cedarwood Meditation Candle. This thoughtfully crafted candle combines the purifying energy of white sage with the grounding essence of cedarwood, creating an atmosphere that encourages mindfulness and inner peace. White sage has been used for centuries in spiritual practices for its ability to clear negative energy and promote mental clarity, while cedarwood provides a warm, woody base note that helps reduce stress and anxiety. Hand-poured in small batches using premium soy wax and a natural cotton wick, this candle burns cleanly and evenly for up to 50 hours. The elegant amber glass vessel complements any decor, and the subtle, earthy fragrance creates the perfect ambiance for meditation, yoga, reading, or simply unwinding after a long day. Each candle is a work of art, designed to transform your space into a haven of tranquility.',
      ingredients: 'Premium soy wax, white sage essential oil, cedarwood essential oil, natural cotton wick, amber glass vessel',
      price: 42.99,
      comparePrice: 49.99,
      sku: 'CANDLE-SAGE-001',
      stock: 30,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
      ]),
      seoTitle: 'Sage & Cedarwood Meditation Candle | Mindfulness Candle | Wick & Lather',
      seoDescription: 'Promote mindfulness and inner peace with our Sage & Cedarwood Meditation Candle. Hand-poured with premium soy wax and natural essential oils.',
      featured: true,
    },
    {
      name: 'Lavender Fields Relaxation Candle',
      slug: 'lavender-fields-relaxation-candle',
      category: 'candle',
      shortDesc: 'The calming essence of Provence lavender fields captured in a candle designed to soothe the mind and prepare you for restful sleep.',
      longDesc: 'Drift into tranquility with our Lavender Fields Relaxation Candle, inspired by the endless purple fields of Provence, France. This luxurious candle features the highest quality lavender essential oil, carefully extracted to preserve its therapeutic properties. Lavender is scientifically proven to reduce anxiety, lower heart rate, and promote deep, restful sleep. Our candle is hand-poured using a blend of premium soy and coconut wax, ensuring a clean, even burn that releases the calming fragrance gradually throughout your space. The soft, floral scent is neither overpowering nor too subtle—it creates the perfect balance to help you unwind after a stressful day. Whether you place it in your bedroom for a pre-sleep ritual, in your bathroom for a spa-like experience, or in your living room for a peaceful ambiance, this candle transforms any moment into a moment of serenity. The elegant frosted glass vessel adds a touch of sophistication to your decor.',
      ingredients: 'Premium soy and coconut wax blend, Provence lavender essential oil, natural cotton wick, frosted glass vessel',
      price: 44.99,
      comparePrice: 52.99,
      sku: 'CANDLE-LAV-002',
      stock: 28,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
      ]),
      seoTitle: 'Lavender Fields Relaxation Candle | Sleep Candle | Wick & Lather',
      seoDescription: 'Experience the calming essence of Provence lavender with our Relaxation Candle. Perfect for promoting restful sleep and reducing anxiety.',
      featured: true,
    },
    {
      name: 'Amber & Sandalwood Luxury Candle',
      slug: 'amber-sandalwood-luxury-candle',
      category: 'candle',
      shortDesc: 'An opulent fusion of warm amber and exotic sandalwood that creates an atmosphere of sophistication and timeless elegance.',
      longDesc: 'Indulge in the epitome of luxury with our Amber & Sandalwood Luxury Candle. This exquisite fragrance combines the rich, honeyed warmth of amber with the creamy, exotic depth of Indian sandalwood, creating a scent profile that is both timeless and contemporary. Amber, with its resinous, slightly sweet character, provides a warm base that lingers beautifully, while sandalwood adds a smooth, woody sophistication that has been prized for millennia. This candle is hand-poured in limited batches using the finest soy wax and a carefully selected wick that ensures optimal fragrance throw. The elegant matte black vessel with gold accents makes a stunning statement piece in any room, while the fragrance itself creates an atmosphere of refined luxury. Perfect for evening gatherings, intimate dinners, or when you simply want to elevate your everyday moments. This candle burns for approximately 60 hours, filling your space with a scent that evolves beautifully as it burns.',
      ingredients: 'Premium soy wax, amber fragrance oil, Indian sandalwood essential oil, natural cotton wick, matte black glass vessel',
      price: 49.99,
      comparePrice: 59.99,
      sku: 'CANDLE-AMB-003',
      stock: 25,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
      ]),
      seoTitle: 'Amber & Sandalwood Luxury Candle | Premium Home Fragrance | Wick & Lather',
      seoDescription: 'Experience opulent luxury with our Amber & Sandalwood Candle. A sophisticated blend perfect for creating an elegant atmosphere in your home.',
      featured: true,
    },
    {
      name: 'Citrus Grove Energizing Candle',
      slug: 'citrus-grove-energizing-candle',
      category: 'candle',
      shortDesc: 'A bright, uplifting blend of lemon, grapefruit, and bergamot that invigorates your space and boosts your mood.',
      longDesc: 'Brighten your day with our Citrus Grove Energizing Candle, a vibrant fusion of the sunniest citrus fruits. This refreshing blend combines the zesty brightness of Sicilian lemon, the tangy sweetness of pink grapefruit, and the sophisticated complexity of Calabrian bergamot. Together, they create an invigorating fragrance that instantly lifts your mood and energizes your space. Citrus scents are known for their ability to enhance focus, increase alertness, and create a sense of positivity. This candle is perfect for morning routines, home offices, or any time you need a natural energy boost. Hand-poured with premium soy wax, it burns cleanly and evenly, releasing the bright, cheerful fragrance throughout your space. The vibrant yellow glass vessel adds a pop of color to your decor while reflecting the sunny, optimistic nature of the fragrance inside. Light this candle to transform any room into a space filled with light, energy, and joy.',
      ingredients: 'Premium soy wax, Sicilian lemon essential oil, pink grapefruit essential oil, Calabrian bergamot essential oil, natural cotton wick, yellow glass vessel',
      price: 41.99,
      comparePrice: 48.99,
      sku: 'CANDLE-CIT-004',
      stock: 32,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
      ]),
      seoTitle: 'Citrus Grove Energizing Candle | Uplifting Home Fragrance | Wick & Lather',
      seoDescription: 'Energize your space with our Citrus Grove Candle. A bright blend of lemon, grapefruit, and bergamot that boosts mood and invigorates your home.',
      featured: false,
    },
    {
      name: 'Vanilla Bean & Tonka Comfort Candle',
      slug: 'vanilla-bean-tonka-comfort-candle',
      category: 'candle',
      shortDesc: 'A cozy, comforting blend of Madagascar vanilla and tonka bean that wraps you in warmth and creates a sense of home.',
      longDesc: 'Wrap yourself in comfort with our Vanilla Bean & Tonka Comfort Candle, a fragrance that feels like a warm embrace. This indulgent blend combines the rich, creamy sweetness of Madagascar vanilla beans with the warm, slightly spicy complexity of tonka bean. Vanilla is one of the most beloved scents in the world, known for its ability to evoke feelings of comfort, nostalgia, and contentment. Tonka bean adds depth with its notes of almond, cherry, and a hint of spice, creating a sophisticated gourmand fragrance that is far from simple. This candle is hand-poured using premium soy wax, ensuring a clean burn and excellent fragrance throw. The warm, inviting scent fills your space with a sense of coziness and well-being, making it perfect for autumn and winter evenings, reading nooks, or any time you want to create a welcoming atmosphere. The cream-colored ceramic vessel adds a touch of rustic elegance to your decor.',
      ingredients: 'Premium soy wax, Madagascar vanilla extract, tonka bean fragrance oil, natural cotton wick, cream ceramic vessel',
      price: 43.99,
      comparePrice: 50.99,
      sku: 'CANDLE-VAN-005',
      stock: 30,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
      ]),
      seoTitle: 'Vanilla Bean & Tonka Comfort Candle | Cozy Home Fragrance | Wick & Lather',
      seoDescription: 'Create a cozy atmosphere with our Vanilla Bean & Tonka Comfort Candle. A warm, comforting blend perfect for creating a sense of home and well-being.',
      featured: false,
    },
    {
      name: 'Ocean Breeze Fresh Candle',
      slug: 'ocean-breeze-fresh-candle',
      category: 'candle',
      shortDesc: 'A crisp, clean fragrance inspired by coastal air, combining sea salt, white musk, and fresh linen for a breath of fresh air.',
      longDesc: 'Bring the refreshing essence of the coast into your home with our Ocean Breeze Fresh Candle. This clean, invigorating fragrance captures the feeling of standing on a windswept beach, breathing in the crisp, salty air. The scent profile combines the mineral freshness of sea salt, the clean softness of white musk, and the crisp brightness of fresh linen, creating a fragrance that is both energizing and calming. This candle is perfect for bathrooms, entryways, or any space where you want to create a sense of cleanliness and freshness. The light, airy scent is never overwhelming, making it ideal for those who prefer subtle fragrances or have sensitivity to strong scents. Hand-poured with premium soy wax, it burns cleanly and evenly, filling your space with a breath of fresh air. The elegant blue-tinted glass vessel reflects the oceanic inspiration of the fragrance, adding a touch of coastal elegance to your decor.',
      ingredients: 'Premium soy wax, sea salt fragrance oil, white musk essential oil, fresh linen fragrance oil, natural cotton wick, blue-tinted glass vessel',
      price: 40.99,
      comparePrice: 47.99,
      sku: 'CANDLE-OCEAN-006',
      stock: 35,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
      ]),
      seoTitle: 'Ocean Breeze Fresh Candle | Clean Coastal Fragrance | Wick & Lather',
      seoDescription: 'Bring the refreshing essence of the coast home with our Ocean Breeze Fresh Candle. A crisp, clean fragrance perfect for creating a fresh, airy atmosphere.',
      featured: false,
    },
  ];

  // Create products
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log(`Created ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
