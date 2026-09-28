const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('⏳ Starting REXTON Watch Store database seed with real user watch photos...');

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
      image: '/images/watches/IMG20260906163102.jpg',
    },
    {
      name: 'Automatic Masterpieces',
      slug: 'automatic',
      description: 'Self-winding horological excellence powered by the natural kinetics of the wearer.',
      image: '/images/watches/IMG20260906164112.jpg',
    },
    {
      name: 'Heritage Dress Watches',
      slug: 'dress-watches',
      description: 'Ultra-slim silhouettes with guilloché dials and hand-finished straps.',
      image: '/images/watches/IMG20260906165658.jpg',
    },
    {
      name: 'Nautical & Diver Editions',
      slug: 'diver-editions',
      description: 'Deep-sea certified up to 300 meters, featuring helium escape valves and Super-LumiNova luminescence.',
      image: '/images/watches/IMG20260906165541.jpg',
    },
    {
      name: 'Haute Horlogerie & Tourbillons',
      slug: 'tourbillon',
      description: 'Gravity-defying flying tourbillon cages crafted in 18k Rose Gold and Grade 5 Titanium.',
      image: '/images/watches/IMG20260906165738.jpg',
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
      description: 'A tribute to classical watchmakers, featuring fluted bezels and high-beat escapements.',
      bannerImage: '/images/products/watch-sovereign-blue-chrono.jpg',
      isFeatured: true,
    },
    {
      name: 'Apex Aero Chrono',
      slug: 'apex-aero',
      tagline: 'High-Performance Precision Horology',
      description: 'Constructed from lightweight forged carbon and satin-brushed 316L stainless steel for extreme performance.',
      bannerImage: '/images/watches/IMG20260906163102.jpg',
      isFeatured: true,
    },
    {
      name: 'Abyssal Deep 300M',
      slug: 'abyssal-deep',
      tagline: 'Sublime Resilience in the Deep Ocean',
      description: 'Uncompromising aquatic instruments tested under severe atmospheric pressure with ceramic rotating bezels.',
      bannerImage: '/images/watches/IMG20260906165541.jpg',
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

  // 4. Seed 10 Luxury Timepieces using user's real photos
  const productsData = [
    {
      title: 'REXTON Sovereign Chronograph 42mm',
      slug: 'rexton-sovereign-chronograph-42mm',
      sku: 'REX-SOV-4201',
      shortDescription: 'Swiss automatic column-wheel chronograph with sunburst midnight blue dial and sapphire crystal caseback.',
      description: 'The REXTON Sovereign Chronograph embodies the golden era of Swiss horology. Powered by an automatic movement with a 70-hour power reserve, this masterpiece showcases hand-finished Geneva stripes visible through the exhibition sapphire caseback. The sunburst midnight blue dial is complemented by faceted rhodium-plated hands and double anti-reflective sapphire crystal.',
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
        'Movement': 'Swiss Automatic Calibre R-902',
        'Case Diameter': '42mm',
        'Case Thickness': '12.4mm',
        'Lug-to-Lug': '48.5mm',
        'Power Reserve': '70 Hours',
        'Frequency': '28,800 vph (4 Hz)',
        'Water Resistance': '10 ATM (100m)',
        'Crystal': 'Domed Sapphire Crystal with Dual AR',
        'Dial': 'Sunburst Midnight Blue with Applied Rhodium Indices',
        'Strap': 'Hand-stitched Alligator Leather with Deployant Buckle',
        'Warranty': '5-Year International Atelier Warranty',
      }),
      images: [
        {
          url: '/images/products/watch-sovereign-blue-chrono.jpg',
          altText: 'REXTON Sovereign Chronograph 42mm Front Dial',
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: '/images/watches/IMG20260906164723.jpg',
          altText: 'REXTON Sovereign Chronograph Dial Macro Detail',
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: '/images/watches/IMG20260906164724.jpg',
          altText: 'REXTON Sovereign Chronograph Case Angle',
          isPrimary: false,
          sortOrder: 2,
        },
        {
          url: '/images/watches/IMG20260906164840.jpg',
          altText: 'REXTON Sovereign Chronograph on Wrist',
          isPrimary: false,
          sortOrder: 3,
        },
      ],
    },
    {
      title: 'REXTON Barrel Skeleton Chronograph 46mm',
      slug: 'rexton-barrel-skeleton-chronograph-46mm',
      sku: 'REX-BRL-4607',
      shortDescription: 'Tonneau-shaped skeleton chronograph with gold-accent sub-dials and black vulcanized rubber strap.',
      description: 'The Barrel Skeleton Chronograph commands attention with its dramatic tonneau case architecture and open-worked skeleton dial revealing every gear and wheel of the movement. Gold-accented subdials at 3 and 9 o\'clock track elapsed minutes and seconds with precision. Matching silver case screws anchor the bold design aesthetic. Paired with a ribbed black vulcanized rubber strap for sport-luxury versatility.',
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
        'Movement': 'Automatic Skeleton Chronograph Calibre R-460',
        'Case Shape': 'Tonneau (Barrel)',
        'Case Diameter': '46mm',
        'Case Thickness': '14.2mm',
        'Power Reserve': '48 Hours',
        'Water Resistance': '10 ATM (100m)',
        'Sub-dials': 'Gold-toned 30-min & Running Seconds',
        'Strap': 'High-durability Vulcanized Rubber',
        'Warranty': '5-Year Atelier Warranty',
      }),
      images: [
        {
          url: '/images/watches/IMG20260906163102.jpg',
          altText: 'REXTON Barrel Skeleton Chronograph 46mm Front View',
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: '/images/watches/IMG20260906163104.jpg',
          altText: 'REXTON Barrel Skeleton Chronograph Profile Angle',
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: '/images/watches/IMG20260906163111.jpg',
          altText: 'REXTON Barrel Skeleton Chronograph Dial Detail',
          isPrimary: false,
          sortOrder: 2,
        },
        {
          url: '/images/watches/IMG20260906163237.jpg',
          altText: 'REXTON Barrel Skeleton Chronograph on Wrist',
          isPrimary: false,
          sortOrder: 3,
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
        'Movement': 'Skeleton Automatic Calibre R-440',
        'Case Shape': 'Octagonal (8-sided)',
        'Case Diameter': '44mm',
        'Case Thickness': '13.0mm',
        'Power Reserve': '42 Hours',
        'Water Resistance': '5 ATM (50m)',
        'Movement Finishing': 'Iridescent Rhodium-plated Bridges',
        'Strap': 'Ribbed Vulcanized Rubber',
        'Warranty': '5-Year Atelier Warranty',
      }),
      images: [
        {
          url: '/images/watches/IMG20260906164112.jpg',
          altText: 'REXTON Octagon Skeleton Automatic 44mm Front View',
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: '/images/watches/IMG20260906164113.jpg',
          altText: 'REXTON Octagon Skeleton Automatic Bevel View',
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: '/images/watches/IMG20260906164155.jpg',
          altText: 'REXTON Octagon Skeleton Movement Macro',
          isPrimary: false,
          sortOrder: 2,
        },
        {
          url: '/images/watches/IMG20260906164203.jpg',
          altText: 'REXTON Octagon Skeleton Caseback View',
          isPrimary: false,
          sortOrder: 3,
        },
        {
          url: '/images/watches/IMG20260906164238.jpg',
          altText: 'REXTON Octagon Skeleton on Wrist',
          isPrimary: false,
          sortOrder: 4,
        },
      ],
    },
    {
      title: 'REXTON Diamant Ladies Bracelet — Azure Blue',
      slug: 'rexton-diamant-ladies-bracelet-azure-blue',
      sku: 'REX-DIA-L309',
      shortDescription: 'Silver bracelet ladies watch with radiant azure blue dial, Roman numerals, and diamond-set bezel.',
      description: 'Crafted for the modern connoisseur of feminine elegance, the Diamant Ladies Bracelet pairs a deep azure blue sunburst dial with a sculpted silver-tone bracelet featuring C-link interlinks and sparkling crystal-set links. The sapphire-shade dial features Roman numeral hour markers at 12, 3, 6, and 9 — a timeless composition complemented by the diamond-pavé bezel catching light from every angle.',
      movement: 'Japanese Precision Quartz ETA 901.001',
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
        'Movement': 'Precision Quartz Calibre',
        'Case Diameter': '32mm',
        'Case Thickness': '8.2mm',
        'Bezel': 'Crystal Pavé Set',
        'Dial': 'Deep Azure Blue Sunburst with Roman Numerals',
        'Strap': 'Stainless Steel C-link Bracelet',
        'Water Resistance': '3 ATM (30m)',
        'Warranty': '5-Year Atelier Warranty',
      }),
      images: [
        {
          url: '/images/watches/IMG20260906164003.jpg',
          altText: 'REXTON Diamant Ladies Bracelet Azure Blue Dial',
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: '/images/watches/IMG20260906164011.jpg',
          altText: 'REXTON Diamant Ladies Bracelet Clasp & Link Detail',
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: '/images/watches/IMG20260906164016.jpg',
          altText: 'REXTON Diamant Ladies Bracelet Profile Angle',
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },
    {
      title: 'REXTON Rotor Sport Rose Gold — Spinning Wheel Edition',
      slug: 'rexton-rotor-sport-rose-gold-spinning-wheel',
      sku: 'REX-ROT-4410',
      shortDescription: 'Rose gold sport watch with 3D rotating brake disc dial and red accent indicators.',
      description: 'A watch built for the speed-obsessed. The Rotor Sport Rose Gold Edition features a wholly unique 3D rotating brake disc dial mechanism — the openworked wheel spins freely on the wrist, with a red caliper accent marking the hours. Inspired by high-performance supercars, this statement piece is cased in warm rose gold PVD stainless steel with a matching solid link bracelet.',
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
        'Movement': 'Quartz with Kinetic 3D Rotating Brake Wheel',
        'Case Diameter': '45mm',
        'Case Thickness': '13.5mm',
        'Dial': 'Matte Black 3D Caliper Wheel',
        'Case Finish': 'Rose Gold PVD Polished',
        'Bracelet': 'Solid Rose Gold PVD Link',
        'Water Resistance': '5 ATM (50m)',
        'Warranty': '5-Year Atelier Warranty',
      }),
      images: [
        {
          url: '/images/watches/IMG20260906165033.jpg',
          altText: 'REXTON Rotor Sport Rose Gold Spinning Wheel Front',
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: '/images/watches/IMG20260906165034.jpg',
          altText: 'REXTON Rotor Sport Rose Gold Dial Detail',
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: '/images/watches/IMG20260906165058.jpg',
          altText: 'REXTON Rotor Sport Rose Gold Bracelet Angle',
          isPrimary: false,
          sortOrder: 2,
        },
        {
          url: '/images/watches/IMG20260906165059.jpg',
          altText: 'REXTON Rotor Sport Rose Gold Caliper Close-up',
          isPrimary: false,
          sortOrder: 3,
        },
      ],
    },
    {
      title: 'REXTON Apex Carbon Chrono Black',
      slug: 'rexton-apex-carbon-chrono-black',
      sku: 'REX-APX-4302',
      shortDescription: 'Forged carbon and titanium skeleton chronograph designed for high-performance automotive pursuits.',
      description: 'Conceived for high adrenaline, the Apex Carbon Chrono is a triumph of lightweight material science. Its monolithic forged carbon case weighs just 54 grams yet offers twice the tensile strength of titanium. The open-worked skeleton dial reveals the precision escapement and column wheel in continuous kinetic motion.',
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
        'Movement': 'High-Beat Skeleton Chronograph RX-18',
        'Case Diameter': '43mm',
        'Case Material': 'Forged Carbon & DLC Grade 5 Titanium',
        'Power Reserve': '65 Hours',
        'Water Resistance': '10 ATM (100m)',
        'Crystal': 'Flat Sapphire Crystal with Multi-layer AR',
        'Strap': 'FKM Vulcanized Rubber with Titanium Deployant',
        'Warranty': '5-Year International Atelier Warranty',
      }),
      images: [
        {
          url: '/images/watches/IMG20260906165400.jpg',
          altText: 'REXTON Apex Carbon Chronograph Front View',
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: '/images/watches/IMG20260906165401.jpg',
          altText: 'REXTON Apex Carbon Chronograph Bevel View',
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: '/images/watches/IMG20260906165431.jpg',
          altText: 'REXTON Apex Carbon Chronograph Dial Detail',
          isPrimary: false,
          sortOrder: 2,
        },
        {
          url: '/images/watches/IMG20260906165432.jpg',
          altText: 'REXTON Apex Carbon Chronograph Crown & Pushers',
          isPrimary: false,
          sortOrder: 3,
        },
        {
          url: '/images/watches/IMG20260906165502.jpg',
          altText: 'REXTON Apex Carbon Chronograph on Wrist',
          isPrimary: false,
          sortOrder: 4,
        },
      ],
    },
    {
      title: 'REXTON Chrono Sport Monopoussoir',
      slug: 'rexton-chrono-sport-monopoussoir',
      sku: 'REX-MONO-4106',
      shortDescription: 'Single-pusher column-wheel chronograph with vintage aesthetic and tachymeter bezel scale.',
      description: 'A tribute to 1930s aviators. This mono-pusher chronograph integrates the start, stop, and reset functions into a single coaxial crown pusher. The balanced dial features twin registers and a telemetric outer chapter ring.',
      movement: 'Integrated Column-Wheel Monopusher Chronograph Calibre R-550',
      caseSize: '41mm',
      caseMaterial: '316L Stainless Steel',
      waterResistance: '10 ATM (100m)',
      dialColor: 'Anthracite Sunburst with Silver Registers',
      strapMaterial: 'Hand-finished Calfskin with Quick-release',
      glassType: 'Box Sapphire Crystal with Dual AR',
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
        'Movement': 'Monopusher Chronograph Calibre R-550',
        'Case Diameter': '41mm',
        'Case Thickness': '12.8mm',
        'Power Reserve': '60 Hours',
        'Water Resistance': '10 ATM (100m)',
        'Warranty': '5-Year Atelier Warranty',
      }),
      images: [
        {
          url: '/images/watches/IMG20260906165143.jpg',
          altText: 'REXTON Chrono Sport Monopoussoir Front Dial',
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: '/images/watches/IMG20260906165145.jpg',
          altText: 'REXTON Chrono Sport Monopoussoir Side Angle',
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: '/images/watches/IMG20260906165210.jpg',
          altText: 'REXTON Chrono Sport Monopoussoir Dial Close-up',
          isPrimary: false,
          sortOrder: 2,
        },
      ],
    },
    {
      title: 'REXTON Abyssal Deep Diver 300M Ceramic',
      slug: 'rexton-abyssal-deep-diver-300m',
      sku: 'REX-ABY-4204',
      shortDescription: 'Professional 300M dive instrument with unidirectional ceramic bezel and Helium Escape Valve.',
      description: 'Engineered for extreme oceanic exploration. The Abyssal Deep is pressure-tested in Switzerland to withstand 30 atmospheres of pressure. Its scratch-proof zirconium oxide ceramic bezel ensures tactical timing, while indices coated in Super-LumiNova guarantee unmatched legibility in total darkness.',
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
        'Movement': 'High-Torque Automatic Shock-Resistant',
        'Case Diameter': '42.5mm',
        'Case Thickness': '13.8mm',
        'Bezel': '120-Click Unidirectional High-Tech Ceramic',
        'Water Resistance': '30 ATM (300m / 1000ft)',
        'Helium Valve': 'Automatic Escape Valve at 9 o\'clock',
        'Warranty': '5-Year Atelier Warranty',
      }),
      images: [
        {
          url: '/images/watches/IMG20260906165541.jpg',
          altText: 'REXTON Abyssal Deep Diver 300M Front View',
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: '/images/watches/IMG20260906165542.jpg',
          altText: 'REXTON Abyssal Deep Diver Dial & Ceramic Bezel',
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: '/images/watches/IMG20260906165549.jpg',
          altText: 'REXTON Abyssal Deep Diver Profile',
          isPrimary: false,
          sortOrder: 2,
        },
        {
          url: '/images/watches/IMG20260906165550.jpg',
          altText: 'REXTON Abyssal Deep Diver Caseback',
          isPrimary: false,
          sortOrder: 3,
        },
      ],
    },
    {
      title: 'REXTON Heritage Automatic 39mm Silver Dial',
      slug: 'rexton-heritage-automatic-39mm-silver',
      sku: 'REX-HRT-3903',
      shortDescription: 'Classic dress watch featuring a guilloché silver dial, thermal blued hands, and slim 8.9mm profile.',
      description: 'An exercise in minimalist refinement. The Heritage 39mm represents the archetype of the gentleman’s dress watch. Featuring a hand-turned Clous de Paris guilloché center dial, flame-blued leaf hands, and an ultra-thin automatic movement that slips effortlessly under a cuff.',
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
        'Movement': 'Ultra-thin Automatic Calibre R-280',
        'Case Diameter': '39mm',
        'Case Thickness': '8.9mm',
        'Dial Pattern': 'Hand-guilloché Clous de Paris',
        'Hands': 'Flame-blued Thermal Steel',
        'Water Resistance': '5 ATM (50m)',
        'Warranty': '5-Year Atelier Warranty',
      }),
      images: [
        {
          url: '/images/watches/IMG20260906165658.jpg',
          altText: 'REXTON Heritage Automatic 39mm Silver Dial Front',
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: '/images/watches/IMG20260906165703.jpg',
          altText: 'REXTON Heritage Automatic Dial Macro Detail',
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: '/images/watches/IMG20260906165732.jpg',
          altText: 'REXTON Heritage Automatic Slim Profile',
          isPrimary: false,
          sortOrder: 2,
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
        'Movement': 'Hand-Wound Flying Tourbillon RT-01',
        'Case Diameter': '41mm',
        'Case Material': '18k Solid Rose Gold',
        'Power Reserve': '100 Hours (Twin Barrels)',
        'Tourbillon Cage': '60-Second Flying Tourbillon (0.28g)',
        'Water Resistance': '3 ATM (30m)',
        'Warranty': '5-Year Atelier Warranty',
      }),
      images: [
        {
          url: '/images/watches/IMG20260906165738.jpg',
          altText: 'REXTON Tourbillon Imperial Rose Gold Front',
          isPrimary: true,
          sortOrder: 0,
        },
        {
          url: '/images/watches/IMG20260906165739.jpg',
          altText: 'REXTON Tourbillon Imperial Rose Gold Dial Detail',
          isPrimary: false,
          sortOrder: 1,
        },
        {
          url: '/images/watches/IMG20260906165909.jpg',
          altText: 'REXTON Tourbillon Imperial Rose Gold Cage Close-up',
          isPrimary: false,
          sortOrder: 2,
        },
        {
          url: '/images/watches/IMG20260906165911.jpg',
          altText: 'REXTON Tourbillon Imperial Rose Gold Exhibition Caseback',
          isPrimary: false,
          sortOrder: 3,
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

    // Seed all images for this product
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
        reason: 'PHOTO_SEED',
      },
    });

    // Seed verified customer review
    await prisma.review.upsert({
      where: { id: `rev-${product.id}` },
      update: {},
      create: {
        id: `rev-${product.id}`,
        productId: product.id,
        authorName: 'Julian Sterling',
        rating: 5,
        title: 'Exceptional craftsmanship and wrist presence',
        comment: 'The finishing on the case and the smooth sweep of the movement rival timepieces twice the price. Pure mechanical perfection.',
        isApproved: true,
        isVerifiedPurchase: true,
      },
    });
  }

  // Remove any obsolete products that are not part of the active catalog
  const activeSlugs = productsData.map((p) => p.slug);
  await prisma.product.deleteMany({
    where: { slug: { notIn: activeSlugs } },
  });

  console.log(`✅ All ${productsData.length} Timepieces seeded with user's real watch photography galleries!`);

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
      title: 'The Anatomy of a High-Beat Mechanical Escapement',
      slug: 'anatomy-of-high-beat-mechanical-escapement',
      excerpt: 'How oscillating at 28,800 vibrations per hour achieves micro-second equilibrium across temperature and gravitational shifts.',
      content: `In the quiet mountain valleys of the Swiss Jura, the pursuit of isochronism has remained virtually unchanged for three centuries. At REXTON, every escapement wheel is cut from specialized non-magnetic glucydur alloys and poised by hand.

When an escapement beats at 4 Hertz (28,800 vph), the balance wheel completes 8 micro-arcs every second. This relentless precision mitigates the subtle drags caused by wrist movement, delivering an accuracy within +2/-2 seconds per day.

We examine why column-wheel engagement produces the signature tactile click beloved by collectors, and how laser-welded balance springs prevent rate drift over decades of ownership.`,
      coverImage: '/images/atelier/swiss-watchmaker.jpg',
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
      coverImage: '/images/watches/IMG20260906165400.jpg',
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
  console.log('🎉 REXTON Database seeding completed with real watch photos from C:\\1Rexton\\product image\\watches!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
