const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('⏳ Starting REXTON Watch Store database seed...');

  // 1. Seed Super Admin and Staff Users
  const superAdminPassword = await bcrypt.hash('Admin@Rexton2026!', 12);
  const staffPassword = await bcrypt.hash('Staff@Rexton2026!', 12);
  const customerPassword = await bcrypt.hash('Customer@123', 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@rexton.com' },
    update: {},
    create: {
      email: 'admin@rexton.com',
      name: 'Philippe Rexton',
      phone: '+41 22 700 8900',
      passwordHash: superAdminPassword,
      role: 'SUPER_ADMIN',
    },
  });

  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@rexton.com' },
    update: {},
    create: {
      email: 'staff@rexton.com',
      name: 'Horology Concierge',
      phone: '+41 22 700 8901',
      passwordHash: staffPassword,
      role: 'STAFF',
    },
  });

  const sampleCustomer = await prisma.user.upsert({
    where: { email: 'collector@example.com' },
    update: {},
    create: {
      email: 'collector@example.com',
      name: 'Julian Sterling',
      phone: '+91 9876543210',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
    },
  });

  console.log('✅ Admin & demo users seeded.');

  // 2. Seed Categories
  const categoriesData = [
    {
      name: 'Chronographs',
      slug: 'chronographs',
      description: 'Precision timing instruments engineered with Swiss mechanical column-wheel movements and dual sub-dials.',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Automatic Masterpieces',
      slug: 'automatic',
      description: 'Self-winding horological excellence powered by the natural kinetics of the wearer.',
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Heritage Dress Watches',
      slug: 'dress-watches',
      description: 'Ultra-slim silhouettes with guilloché enamel dials and hand-finished alligator straps.',
      image: 'https://images.unsplash.com/photo-1547996160-71dfa80693a1?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Nautical & Diver Editions',
      slug: 'diver-editions',
      description: 'Deep-sea certified up to 300 meters, featuring helium escape valves and Super-LumiNova luminescence.',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Haute Horlogerie & Tourbillons',
      slug: 'tourbillon',
      description: 'Gravity-defying flying tourbillon cages crafted in 18k Rose Gold and Grade 5 Titanium.',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categories.push(created);
  }

  console.log(`✅ ${categories.length} Categories seeded.`);

  // 3. Seed Collections
  const collectionsData = [
    {
      name: 'The Sovereign Heritage',
      slug: 'sovereign-heritage',
      tagline: 'Timeless Swiss Elegance since 1928',
      description: 'A tribute to the early Geneva watchmakers, featuring fluted bezels, Breguet numerals, and high-beat escapements.',
      bannerImage: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1600&q=85',
      isFeatured: true,
    },
    {
      name: 'Apex Aero Chrono',
      slug: 'apex-aero',
      tagline: 'Born on the Grand Prix & High Altitudes',
      description: 'Constructed from lightweight forged carbon and satin-brushed 316L stainless steel for extreme performance.',
      bannerImage: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=1600&q=85',
      isFeatured: true,
    },
    {
      name: 'Abyssal Deep 300M',
      slug: 'abyssal-deep',
      tagline: 'Sublime Resilience in the Deep Ocean',
      description: 'Uncompromising aquatic instruments tested under severe atmospheric pressure with ceramic rotating bezels.',
      bannerImage: 'https://images.unsplash.com/photo-1518131149554-a7577530d6be?auto=format&fit=crop&w=1600&q=85',
      isFeatured: true,
    },
  ];

  const collections = [];
  for (const col of collectionsData) {
    const created = await prisma.collection.upsert({
      where: { slug: col.slug },
      update: col,
      create: col,
    });
    collections.push(created);
  }

  console.log(`✅ ${collections.length} Collections seeded.`);

  // 4. Seed Luxury Timepieces
  const productsData = [
    {
      title: 'REXTON Sovereign Chronograph 42mm',
      slug: 'rexton-sovereign-chronograph-42mm',
      sku: 'REX-SOV-4201',
      shortDescription: 'Swiss automatic column-wheel chronograph with sunburst midnight blue dial and sapphire crystal caseback.',
      description: 'The REXTON Sovereign Chronograph embodies the golden era of Swiss horology. Powered by the proprietary Calibre R-902 automatic movement with a 70-hour power reserve, this masterpiece showcases hand-finished Geneva stripes (Côtes de Genève) visible through the exhibition sapphire caseback. The sunburst midnight blue dial is complemented by faceted rhodium-plated hands and double anti-reflective sapphire crystal.',
      movement: 'Swiss Automatic Calibre R-902 (28,800 vph)',
      caseSize: '42mm',
      caseMaterial: '316L Surgical Grade Stainless Steel',
      waterResistance: '10 ATM (100m / 330ft)',
      dialColor: 'Sunburst Midnight Blue',
      strapMaterial: 'Hand-stitched Alligator Leather in Deep Navy',
      glassType: 'Domed Scratch-resistant Sapphire Crystal with Dual AR Coating',
      powerReserve: '70 Hours',
      price: 185000,
      compareAtPrice: 215000,
      stock: 12,
      lowStockThreshold: 3,
      isFeatured: true,
      isNew: true,
      categoryId: categories[0].id,
      collectionId: collections[0].id,
      specifications: JSON.stringify({
        'Jewels': '33 Synthetic Rubies',
        'Frequency': '4 Hz (28,800 beats per hour)',
        'Bezel': 'Polished Mirror Finish',
        'Crown': 'Screw-down with engraved REXTON Crown Crest',
        'Clasp': 'Triple-blade folding security deployant buckle',
        'Origin': 'La Chaux-de-Fonds, Switzerland',
      }),
      images: [
        {
          url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85',
          altText: 'REXTON Sovereign Chronograph Front Dial',
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=85',
          altText: 'REXTON Sovereign Chronograph Wrist Angle',
          isPrimary: false,
          sortOrder: 1,
        },
      ],
    },
    {
      title: 'REXTON Apex Carbon Chrono Black',
      slug: 'rexton-apex-carbon-chrono-black',
      sku: 'REX-APX-4302',
      shortDescription: 'Forged carbon and titanium skeleton chronograph designed for high-performance automotive pursuits.',
      description: 'Conceived on the racetrack, the Apex Carbon Chrono is a triumph of lightweight material science. Its monolithic forged carbon case weighs just 54 grams yet offers twice the tensile strength of titanium. The open-worked skeleton dial reveals the precision escapement and red-accented column wheel in continuous kinetic motion.',
      movement: 'High-Beat Skeleton Chronograph Calibre RX-18',
      caseSize: '43mm',
      caseMaterial: 'Forged Carbon Fiber & DLC Titanium',
      waterResistance: '10 ATM (100m / 330ft)',
      dialColor: 'Open-worked Anthracite Skeleton',
      strapMaterial: 'FKM High-durability Vulcanized Rubber with Titanium Clasp',
      glassType: 'Flat Sapphire Crystal with Multi-layer Anti-reflective Coating',
      powerReserve: '65 Hours',
      price: 245000,
      compareAtPrice: 280000,
      stock: 7,
      lowStockThreshold: 2,
      isFeatured: true,
      isNew: true,
      categoryId: categories[0].id,
      collectionId: collections[1].id,
      specifications: JSON.stringify({
        'Weight': '88g (including strap)',
        'Luminescence': 'Super-LumiNova BGW9 (Blue emission)',
        'Pushers': 'Ergonomic Titanium Grade 5 knurled buttons',
        'Warranty': '5-Year International Warranty',
      }),
      images: [
        {
          url: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=1200&q=85',
          altText: 'REXTON Apex Carbon Chronograph',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
    {
      title: 'REXTON Heritage Automatic 39mm Silver Dial',
      slug: 'rexton-heritage-automatic-39mm-silver',
      sku: 'REX-HRT-3903',
      shortDescription: 'Classic dress watch featuring a guilloché silver dial, blued steel hands, and slim 8.9mm profile.',
      description: 'An exercise in minimalist Swiss refinement. The Heritage 39mm represents the archetype of the gentleman’s dress watch. Featuring a hand-turned Clous de Paris guilloché center dial, flame-blued leaf hands, and an ultra-thin automatic movement that slips effortlessly under a French cuff.',
      movement: 'Ultra-thin Automatic Calibre R-280 (8.9mm case height)',
      caseSize: '39mm',
      caseMaterial: '316L Stainless Steel with Mirror Polishing',
      waterResistance: '5 ATM (50m / 165ft)',
      dialColor: 'Guilloché Opaline Silver',
      strapMaterial: 'French Calfskin in Saddle Tan',
      glassType: 'Curved Sapphire Crystal',
      powerReserve: '48 Hours',
      price: 135000,
      compareAtPrice: 155000,
      stock: 15,
      lowStockThreshold: 4,
      isFeatured: true,
      isNew: false,
      categoryId: categories[2].id,
      collectionId: collections[0].id,
      specifications: JSON.stringify({
        'Case Thickness': '8.9mm',
        'Hands': 'Flame-blued Thermal Steel',
        'Dial Pattern': 'Hand-guilloché Clous de Paris',
        'Water Resistance': '50 Meters',
      }),
      images: [
        {
          url: 'https://images.unsplash.com/photo-1547996160-71dfa80693a1?auto=format&fit=crop&w=1200&q=85',
          altText: 'REXTON Heritage Automatic Silver Dial',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
    {
      title: 'REXTON Abyssal Deep Diver 300M Ceramic',
      slug: 'rexton-abyssal-deep-diver-300m',
      sku: 'REX-ABY-4204',
      shortDescription: 'Professional 300M dive watch with unidirectional ceramic bezel and Helium Escape Valve.',
      description: 'Engineered for extreme oceanic exploration. The Abyssal Deep is pressure-tested in Switzerland to withstand 30 atmospheres of pressure. Its scratch-proof zirconium oxide ceramic bezel ensures flawless tactical timing, while large indices coated in Swiss Super-LumiNova guarantee unmatched legibility in total darkness.',
      movement: 'High-Torque Automatic Calibre R-770 Shock-Resistant',
      caseSize: '42.5mm',
      caseMaterial: 'Satin-brushed 316L Stainless Steel & Ceramic Bezel',
      waterResistance: '30 ATM (300m / 1000ft)',
      dialColor: 'Deep Ocean Matte Black',
      strapMaterial: 'Solid Link Steel Bracelet with Wet-suit Extension',
      glassType: '4mm Thick Double-domed Sapphire Crystal',
      powerReserve: '55 Hours',
      price: 165000,
      compareAtPrice: 195000,
      stock: 9,
      lowStockThreshold: 3,
      isFeatured: true,
      isNew: true,
      categoryId: categories[3].id,
      collectionId: collections[2].id,
      specifications: JSON.stringify({
        'Bezel': '120-click Unidirectional High-Tech Ceramic',
        'Valve': 'Automatic Helium Release Valve at 9 o\'clock',
        'Antimagnetic': 'Up to 15,000 Gauss',
      }),
      images: [
        {
          url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85',
          altText: 'REXTON Abyssal Deep Diver',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
    {
      title: 'REXTON Tourbillon Imperial Rose Gold 41mm',
      slug: 'rexton-tourbillon-imperial-rose-gold',
      sku: 'REX-TRB-4105',
      shortDescription: 'Flying 60-second Tourbillon crafted in 18k Rose Gold with grand feu enamel dial.',
      description: 'The pinnacle of the REXTON atelier. The Imperial Tourbillon features a gravity-compensating one-minute flying tourbillon cage floating at the 6 o\'clock aperture. Cased in solid 18k Rose Gold with hand-beveled bridges, anglage finishing, and an authentic Grand Feu white enamel dial.',
      movement: 'In-House Hand-Wound Flying Tourbillon Calibre RT-01',
      caseSize: '41mm',
      caseMaterial: '18k 4N Solid Rose Gold',
      waterResistance: '3 ATM (30m / 100ft)',
      dialColor: 'Grand Feu White Enamel',
      strapMaterial: 'Hand-crafted Black Mississippi Alligator with 18k Gold Buckle',
      glassType: 'Box-form Sapphire Crystal with Anti-glare treatment',
      powerReserve: '100 Hours (Twin Barrels)',
      price: 850000,
      compareAtPrice: 950000,
      stock: 3,
      lowStockThreshold: 1,
      isFeatured: true,
      isNew: true,
      categoryId: categories[4].id,
      collectionId: collections[0].id,
      specifications: JSON.stringify({
        'Tourbillon Weight': '0.28 grams (68 components)',
        'Finishing': 'Hand-polished anglage & Côtes de Genève',
        'Gold Weight': '68.5g of pure 18k Rose Gold',
        'Certification': 'Chronometer Certified (COSC)',
      }),
      images: [
        {
          url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85',
          altText: 'REXTON Tourbillon Imperial Rose Gold',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
    {
      title: 'REXTON Chrono Sport Monopoussoir',
      slug: 'rexton-chrono-sport-monopoussoir',
      sku: 'REX-MONO-4106',
      shortDescription: 'Single-pusher chronograph with salmon vintage dial and tachymeter scale.',
      description: 'A tribute to 1930s aviators. This mono-pusher chronograph integrates the start, stop, and reset functions into a single coaxial crown pusher. The vintage salmon dial features a telemetric & tachymetric outer chapter ring.',
      movement: 'Integrated Column-Wheel Monopusher Chronograph Calibre R-550',
      caseSize: '40.5mm',
      caseMaterial: '316L Stainless Steel',
      waterResistance: '10 ATM (100m)',
      dialColor: 'Vintage Salmon Sunburst',
      strapMaterial: 'Beige Suede Nubuck Leather with Quick-release',
      glassType: 'Box Sapphire Crystal',
      powerReserve: '60 Hours',
      price: 175000,
      compareAtPrice: 195000,
      stock: 8,
      lowStockThreshold: 2,
      isFeatured: false,
      isNew: true,
      categoryId: categories[0].id,
      collectionId: collections[1].id,
      specifications: JSON.stringify({
        'Pusher': 'Single Coaxial Crown Button',
        'Complications': '30-minute counter, small seconds, tachymeter',
      }),
      images: [
        {
          url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85',
          altText: 'REXTON Chrono Sport Monopoussoir',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
    {
      title: 'REXTON Barrel Skeleton Chronograph 46mm',
      slug: 'rexton-barrel-skeleton-chronograph-46mm',
      sku: 'REX-BRL-4607',
      shortDescription: 'Tonneau-shaped skeleton chronograph with gold-accent sub-dials and black vulcanized rubber strap.',
      description: 'The Barrel Skeleton Chronograph commands attention with its dramatic tonneau (barrel) case architecture and open-worked skeleton dial revealing every gear and wheel of the high-beat movement. Gold-accented subdials at 3 and 9 o\'clock track elapsed minutes and seconds with precision. Matching silver case screws at each corner anchor the bold design aesthetic. Paired with a ribbed black vulcanized rubber strap for sport-luxury versatility.',
      movement: 'Automatic Skeleton Chronograph Calibre R-460',
      caseSize: '46mm',
      caseMaterial: 'Silver 316L Stainless Steel — Tonneau Case',
      waterResistance: '10 ATM (100m)',
      dialColor: 'Open-worked Skeleton with Gold Accent Sub-dials',
      strapMaterial: 'Ribbed Black Vulcanized Rubber with Stainless Steel Buckle',
      glassType: 'Domed Hardened Mineral Crystal',
      powerReserve: '48 Hours',
      price: 89000,
      compareAtPrice: 115000,
      stock: 14,
      lowStockThreshold: 3,
      isFeatured: true,
      isNew: true,
      categoryId: categories[0].id,
      collectionId: collections[1].id,
      specifications: JSON.stringify({
        'Case Shape': 'Tonneau (Barrel)',
        'Sub-dials': 'Gold-toned 30-min & Running Seconds',
        'Case Screws': '4 × Silver-polished Crown Screws',
        'Luminescence': 'Super-LumiNova on Indices',
        'Water Resistance': '100 Meters',
      }),
      images: [
        {
          url: '/images/products/watch-barrel-chrono-front.jpg',
          altText: 'REXTON Barrel Skeleton Chronograph — Front Dial View',
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: '/images/products/watch-octagon-skeleton-front.jpg',
          altText: 'REXTON Barrel Skeleton Chronograph — Side Profile',
          isPrimary: false,
          sortOrder: 1,
        },
      ],
    },
    {
      title: 'REXTON Octagon Skeleton Automatic 44mm',
      slug: 'rexton-octagon-skeleton-automatic-44mm',
      sku: 'REX-OCT-4408',
      shortDescription: 'Eight-sided skeleton automatic with iridescent movement and black rubber strap.',
      description: 'Inspired by contemporary haute horlogerie architecture, the Octagon Skeleton presents an eight-sided case geometry with bold brushed facets and polished bevels. The open-worked dial showcases the skeleton movement with iridescent hand-finishing catching light at every angle. The twin-pusher crown at 3 o\'clock provides effortless time-setting, while the anti-reflective curved crystal offers crystal-clear movement visibility.',
      movement: 'Skeleton Automatic Calibre R-440 (Self-winding)',
      caseSize: '44mm',
      caseMaterial: 'Brushed & Polished 316L Stainless Steel — Octagon Case',
      waterResistance: '5 ATM (50m)',
      dialColor: 'Full Skeleton — Iridescent Rhodium-plated Bridges',
      strapMaterial: 'Ribbed Black Vulcanized Rubber with Steel Tang Buckle',
      glassType: 'Curved Hardened Mineral Crystal with AR Coating',
      powerReserve: '42 Hours',
      price: 72000,
      compareAtPrice: 92000,
      stock: 18,
      lowStockThreshold: 4,
      isFeatured: true,
      isNew: true,
      categoryId: categories[1].id,
      collectionId: collections[1].id,
      specifications: JSON.stringify({
        'Case Shape': 'Octagonal (8-sided)',
        'Finishing': 'Mixed Brushed & Mirror Polish',
        'Movement Visibility': 'Full Open-worked Skeleton Dial',
        'Crown': 'Dual Push-pull Crown at 3 o\'clock',
      }),
      images: [
        {
          url: '/images/products/watch-octagon-skeleton-front.jpg',
          altText: 'REXTON Octagon Skeleton Automatic — Front View',
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: '/images/products/watch-barrel-chrono-front.jpg',
          altText: 'REXTON Octagon Skeleton Automatic — Strap View',
          isPrimary: false,
          sortOrder: 1,
        },
      ],
    },
    {
      title: 'REXTON Diamant Ladies Bracelet — Azure Blue',
      slug: 'rexton-diamant-ladies-bracelet-azure-blue',
      sku: 'REX-DIA-L309',
      shortDescription: 'Silver bracelet ladies watch with radiant azure blue dial, Roman numerals, and diamond-set bezel.',
      description: 'Crafted for the modern connoisseur of feminine elegance, the Diamant Ladies Bracelet pairs a deep azure blue sunburst dial with a sculpted silver-tone bracelet featuring C-link interlinks and sparkling crystal-set links. The sapphire-shade dial features Roman numeral hour markers at 12, 3, 6, and 9 — a timeless composition complemented by the diamond-pavé bezel catching light from every angle. A true statement of understated luxury for formal and evening occasions.',
      movement: 'Japanese Quartz ETA 901.001',
      caseSize: '32mm',
      caseMaterial: 'Silver 316L Stainless Steel with Crystal-set Bezel',
      waterResistance: '3 ATM (30m)',
      dialColor: 'Deep Azure Blue Sunburst with Roman Numerals',
      strapMaterial: 'Silver Stainless Steel C-link Bracelet with Safety Clasp',
      glassType: 'Curved Hardened Mineral Crystal',
      powerReserve: 'Battery (approx. 3 years)',
      price: 38000,
      compareAtPrice: 52000,
      stock: 22,
      lowStockThreshold: 5,
      isFeatured: true,
      isNew: true,
      categoryId: categories[2].id,
      collectionId: collections[0].id,
      specifications: JSON.stringify({
        'Bracelet Style': 'C-link with Crystal Accent Links',
        'Bezel': 'Crystal Pavé Set',
        'Dial Markers': 'Roman Numerals — I, III, VI, IX',
        'Gender': 'Ladies',
        'Clasp': 'Double Push Safety Clasp',
      }),
      images: [
        {
          url: '/images/products/watch-ladies-blue-dial.jpg',
          altText: 'REXTON Diamant Ladies Bracelet — Azure Blue Dial',
          isPrimary: true,
          sortOrder: 0,
        },
      ],
    },
    {
      title: 'REXTON Rotor Sport Rose Gold — Spinning Wheel Edition',
      slug: 'rexton-rotor-sport-rose-gold-spinning-wheel',
      sku: 'REX-ROT-4410',
      shortDescription: 'Rose gold sport watch with 3D rotating brake disc dial and red accent indicators.',
      description: 'A watch built for the speed-obsessed. The Rotor Sport Rose Gold Edition features a wholly unique 3D rotating brake disc dial mechanism — the openworked wheel spins freely on the wrist, with a red caliper accent marking the hours. Inspired by high-performance supercars, this statement piece is cased in warm rose gold PVD stainless steel with a matching solid link bracelet. The crown at 4 o\'clock adjusts the time while the disc mechanism provides an unmatched conversation-starting display.',
      movement: 'Japanese Quartz with Rotating Disc Complication',
      caseSize: '45mm',
      caseMaterial: 'Rose Gold PVD Stainless Steel',
      waterResistance: '5 ATM (50m)',
      dialColor: '3D Rotating Brake Disc — Matte Black with Red Caliper Accents',
      strapMaterial: 'Rose Gold PVD Solid-link Stainless Steel Bracelet',
      glassType: 'Domed Mineral Crystal',
      powerReserve: 'Battery (approx. 2 years)',
      price: 55000,
      compareAtPrice: 72000,
      stock: 11,
      lowStockThreshold: 3,
      isFeatured: true,
      isNew: true,
      categoryId: categories[0].id,
      collectionId: collections[1].id,
      specifications: JSON.stringify({
        'Complication': '3D Spinning Brake Disc Dial',
        'Accent Color': 'Racing Red Caliper Indicator',
        'Case Color': 'Rose Gold PVD',
        'Bracelet': 'Solid Rose Gold PVD Link',
        'Crown Position': '4 o\'clock',
      }),
      images: [
        {
          url: '/images/products/watch-tencel-rosegold-1.jpg',
          altText: 'REXTON Rotor Sport Rose Gold — Spinning Wheel Front',
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: '/images/products/watch-tencel-rosegold-2.jpg',
          altText: 'REXTON Rotor Sport Rose Gold — Dial Close-up',
          isPrimary: false,
          sortOrder: 1,
        },
      ],
    },
  ];

  for (const prodData of productsData) {
    const { images, specifications, ...productFields } = prodData;

    const product = await prisma.product.upsert({
      where: { slug: prodData.slug },
      update: {
        ...productFields,
        specifications,
      },
      create: {
        ...productFields,
        specifications,
      },
    });

    // Seed images
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    for (const img of images) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: img.url,
          altText: img.altText,
          isPrimary: img.isPrimary,
          sortOrder: img.sortOrder,
        },
      });
    }

    // Seed initial inventory log
    await prisma.inventoryLog.create({
      data: {
        productId: product.id,
        changeAmount: productFields.stock,
        previousStock: 0,
        newStock: productFields.stock,
        reason: 'INITIAL_SEED',
      },
    });

    // Seed sample approved review
    await prisma.review.create({
      data: {
        productId: product.id,
        authorName: 'Antoine de Saint',
        rating: 5,
        title: 'Masterpiece of modern Swiss watchmaking',
        comment: 'The finishing on the case and the smooth sweep of the chronograph hand rival timepieces twice the price. Truly exceptional craftsmanship.',
        isApproved: true,
        isVerifiedPurchase: true,
      },
    });
  }

  console.log(`✅ ${productsData.length} Timepieces seeded with images, inventory, and reviews.`);

  // 5. Seed Coupons
  const couponsData = [
    {
      code: 'SWISS10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderAmount: 50000,
      maxDiscount: 25000,
      usageLimit: 500,
      isActive: true,
    },
    {
      code: 'REXTONVIP',
      discountType: 'FIXED',
      discountValue: 15000,
      minOrderAmount: 100000,
      usageLimit: 100,
      isActive: true,
    },
  ];

  for (const coup of couponsData) {
    await prisma.coupon.upsert({
      where: { code: coup.code },
      update: coup,
      create: coup,
    });
  }

  console.log(`✅ ${couponsData.length} Promotional coupons seeded.`);

  // 6. Seed Journal Articles
  const journalPosts = [
    {
      title: 'The Anatomy of a High-Beat Swiss Escapement',
      slug: 'anatomy-of-high-beat-swiss-escapement',
      excerpt: 'How oscillating at 28,800 vibrations per hour achieves micro-second equilibrium across temperature and gravitational shifts.',
      content: `In the quiet mountain valleys of the Swiss Jura, the pursuit of isochronism has remained virtually unchanged for three centuries. At REXTON, every escapement wheel is cut from specialized non-magnetic glucydur alloys and poised by hand.

When an escapement beats at 4 Hertz (28,800 vph), the balance wheel completes 8 micro-arcs every second. This relentless precision mitigates the subtle drags caused by wrist movement, delivering an accuracy within +2/-2 seconds per day.

We examine why column-wheel engagement produces the signature tactile click beloved by collectors, and how laser-welded balance springs prevent rate drift over decades of ownership.`,
      coverImage: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1200&q=85',
      author: 'Philippe Rexton, Master Horologist',
      readTime: '5 min read',
      isPublished: true,
    },
    {
      title: 'Preserving Your Mechanical Heirloom: Care & Servicing Protocol',
      slug: 'preserving-mechanical-heirloom-care-guide',
      excerpt: 'Essential practices for maintaining the lubrication, gaskets, and cosmetic brilliance of your REXTON timepiece.',
      content: `A luxury mechanical timepiece is engineered to transcend generations. However, micro-lubricants naturally dry over a 5-year cycle, and moisture seals require periodic inspection.

Here are the four pillars of timepiece preservation:
1. Always screw down the crown fully prior to water immersion.
2. Avoid setting the date complication between 9:00 PM and 3:00 AM when the calendar gearing is engaged.
3. Keep the watch isolated from strong electromagnetic fields (speakers, MRI apparatus, inductive chargers).
4. Entrust your watch only to authorized REXTON ateliers for pressure testing and synthetic ultrasonic cleaning.`,
      coverImage: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=85',
      author: 'REXTON Technical Atelier',
      readTime: '4 min read',
      isPublished: true,
    },
  ];

  for (const post of journalPosts) {
    await prisma.journalPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  console.log(`✅ ${journalPosts.length} Journal posts seeded.`);
  console.log('🎉 REXTON Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
