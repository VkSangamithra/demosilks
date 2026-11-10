/**
 * DEMO SILKS - Product Catalog & Static Data
 * Curated exclusively with authentic handloom photoshoot collections
 */

const SAREE_PRODUCTS = [
  {
    id: 1,
    name: "Swarna Kamal Kanchipuram Pure Silk Saree",
    sku: "DS-KAN-0101",
    category: "kanjivaram",
    categoryName: "Kanchipuram Silk",
    fabric: "Pure Mulberry Silk (3-Ply)",
    zari: "Pure 24K Tested Gold Zari",
    color: "Royal Magenta Crimson",
    colorFamily: "Pink",
    colorHex: "#be185d",
    occasion: "Bridal",
    price: 42500,
    originalPrice: 48900,
    rating: 5.0,
    reviewsCount: 128,
    isNew: true,
    isBestSeller: true,
    isOffer: true,
    discountPercent: 13,
    images: [
      "assets/images/collection-kanchipuram.jpg"
    ],
    description: "An archival bridal heirloom hand-woven on traditional pit looms in Kanchipuram. Featuring intricate golden lotus (Kamal) and peacock (Mayil) motifs woven in tested 24K gold zari, framed by a majestic 12-inch interlocking Korvai temple border and a rich brocade pallu.",
    specs: {
      "Silk Mark": "100% Certified Pure Mulberry Silk",
      "Origin": "Kanchipuram, Tamil Nadu",
      "Weave Type": "Traditional 3-Ply Korvai Handloom",
      "Length": "6.2 Metres (includes 80cm unstitched blouse piece)",
      "Blouse Fabric": "Pure Silk in Contrast Forest Green with Gold Zari Border",
      "Zari Grade": "Grade 1 Tested 24K Gold Plated Silver Zari",
      "Care": "Strictly Dry Clean Only. Wrap in pure cotton muslin."
    }
  },
  {
    id: 2,
    name: "Varanasi Shikargah Kadwa Banarasi Silk Saree",
    sku: "DS-BAN-0202",
    category: "banarasi",
    categoryName: "Banarasi Silk",
    fabric: "Pure Katan Silk",
    zari: "Antique Gold & Sona-Rupa Zari",
    color: "Imperial Violet Purple",
    colorFamily: "Purple",
    colorHex: "#581c87",
    occasion: "Festive",
    price: 38000,
    originalPrice: 44000,
    rating: 4.9,
    reviewsCount: 94,
    isNew: true,
    isBestSeller: true,
    isOffer: false,
    discountPercent: 14,
    images: [
      "assets/images/collection-banarasi.jpg"
    ],
    description: "Woven along the sacred ghats of Varanasi by master artisans. Authentic pure Katan silk featuring exquisite Kadwa Shikargah hunting jaal weaving with zero loose floats on the reverse, enriched with subtle meenakari accents and an opulent brocade pallu.",
    specs: {
      "Silk Mark": "Certified Handloom Banarasi Silk Mark",
      "Origin": "Varanasi, Uttar Pradesh",
      "Weave Type": "Kadwa Handloom Brocade",
      "Length": "6.3 Metres (includes running blouse piece)",
      "Blouse Fabric": "Pure Katan Silk with heavy sleeve borders",
      "Zari Grade": "Electroplated Tested Gold Zari",
      "Care": "Dry Clean Only. Store flat in cloth saree bag."
    }
  },
  {
    id: 3,
    name: "Amrita Lavender Grace Pure Soft Silk Saree",
    sku: "DS-SFT-0303",
    category: "softsilk",
    categoryName: "Soft Silk",
    fabric: "Pure Mulberry Soft Silk",
    zari: "Delicate Champagne Gold Zari",
    color: "Lilac Lavender",
    colorFamily: "Purple",
    colorHex: "#a855f7",
    occasion: "Festive",
    price: 28500,
    originalPrice: 33900,
    rating: 4.9,
    reviewsCount: 84,
    isNew: true,
    isBestSeller: true,
    isOffer: true,
    discountPercent: 16,
    images: [
      "assets/images/collection-softsilk.jpg"
    ],
    description: "Featherlight, breathable pure mulberry soft silk drape bathed in serene lavender pastel tones. Highlighted by whisper-soft zari motifs, a fluid drape, and lightweight comfort designed for effortless day-long celebrations.",
    specs: {
      "Silk Mark": "100% Certified Pure Silk",
      "Origin": "Tamil Nadu Handloom Cluster",
      "Weave Type": "Pure Soft Silk Handloom",
      "Length": "6.2 Metres (includes matching blouse piece)",
      "Blouse Fabric": "Lavender Pure Soft Silk with Zari Border",
      "Zari Grade": "Tested Lightweight Gold Zari",
      "Care": "Dry Clean Recommended. Preserve in cotton cover."
    }
  },
  {
    id: 4,
    name: "Rajmatha Royal Navy Mysore Crepe Silk Saree",
    sku: "DS-MYS-0404",
    category: "mysoresilk",
    categoryName: "Mysore Silk",
    fabric: "Pure Mysore Crepe Silk",
    zari: "Hallmarked Pure Gold Zari Border",
    color: "Royal Navy Blue",
    colorFamily: "Blue",
    colorHex: "#1e3a8a",
    occasion: "Reception",
    price: 32000,
    originalPrice: 37500,
    rating: 5.0,
    reviewsCount: 112,
    isNew: true,
    isBestSeller: true,
    isOffer: false,
    discountPercent: 15,
    images: [
      "assets/images/collection-mysoresilk.jpg"
    ],
    description: "Woven on the legendary royal looms of Mysore using 100% pure silk yarns and hallmarked pure gold zari borders. Revered for its smooth, supple crepe texture, regal navy sheen, and unmatched royal drape.",
    specs: {
      "Silk Mark": "100% Certified Mysore Silk Mark",
      "Origin": "Mysore, Karnataka",
      "Weave Type": "Royal Crepe Silk Handloom",
      "Length": "6.2 Metres (includes contrast gold blouse piece)",
      "Blouse Fabric": "Pure Crepe Silk with Zari border",
      "Zari Grade": "Hallmarked Pure Gold Zari (Tested)",
      "Care": "Dry Clean Only. Iron on gentle silk setting."
    }
  },
  {
    id: 5,
    name: "Apsara Mint Bloom Pure Tissue Organza Saree",
    sku: "DS-ORG-0505",
    category: "organza",
    categoryName: "Organza",
    fabric: "Pure Silk Tissue Organza",
    zari: "Champagne Silver & Cutdana",
    color: "Pastel Mint Green",
    colorFamily: "Green",
    colorHex: "#10b981",
    occasion: "Party Wear",
    price: 24900,
    originalPrice: 29500,
    rating: 4.9,
    reviewsCount: 67,
    isNew: true,
    isBestSeller: true,
    isOffer: true,
    discountPercent: 16,
    images: [
      "assets/images/collection-organza.jpg"
    ],
    description: "Featherlight crystalline tissue organza drape infused with delicate metallic sheen. Intricately embellished with hand-embroidered floral resham threadwork, micro pearls, and contemporary scalloped borders.",
    specs: {
      "Silk Mark": "Certified Silk Organza",
      "Origin": "Chanderi / Surat Atelier",
      "Weave Type": "Semi-sheer Crisp Tissue Weave",
      "Length": "5.5 Metres + 1 Metre Blouse",
      "Blouse Fabric": "Pure Raw Silk with Hand Embroidery",
      "Zari Grade": "Champagne Micro Zari",
      "Care": "Gentle Dry Clean Only. Steam iron on reverse."
    }
  }
];

const COLLECTIONS_DATA = [
  {
    id: "kanchipuram-silk",
    title: "Kanchipuram Silk",
    tagline: "Authentic 3-Ply Pure Mulberry Silk with 24K Gold Korvai Temple Borders",
    count: "48 Masterpieces",
    image: "assets/images/collection-kanchipuram.jpg",
    filter: "kanjivaram",
    badge: "Royal Muhurtham Edit"
  },
  {
    id: "banarasi-silk",
    title: "Banarasi Silk",
    tagline: "Varanasi Kadwa Katan Brocades with Shikargah Hunting Jaal & Meenakari",
    count: "36 Sarees",
    image: "assets/images/collection-banarasi.jpg",
    filter: "banarasi",
    badge: "Imperial Brocade"
  },
  {
    id: "soft-silk",
    title: "Soft Silk",
    tagline: "Featherlight Fluid Drapes in Ethereal Pastel Tones with Graceful Zari Accents",
    count: "32 Sarees",
    image: "assets/images/collection-softsilk.jpg",
    filter: "softsilk",
    badge: "Ethereal Pastel Grace"
  },
  {
    id: "mysore-silk",
    title: "Mysore Silk",
    tagline: "Heritage Royal Crepe Silk Woven with Hallmarked Gold Zari Border",
    count: "28 Sarees",
    image: "assets/images/collection-mysoresilk.jpg",
    filter: "mysoresilk",
    badge: "Royal Heritage Crepe"
  },
  {
    id: "organza",
    title: "Organza",
    tagline: "Luminous Semi-Sheer Tissue Organza Adorned with Delicate Handcrafted Bootis",
    count: "29 Creations",
    image: "assets/images/collection-organza.jpg",
    filter: "organza",
    badge: "Luminous Sheer Flora"
  }
];

const REELS_DATA = [
  {
    id: 1,
    title: "How to drape a Royal Kanjivaram in under 4 minutes ✨",
    views: "184K",
    likes: "14.2K",
    category: "Styling Guide",
    productId: 1,
    productName: "Swarna Kamal Kanchipuram",
    duration: "0:45",
    videoPoster: "assets/images/collection-kanchipuram.jpg"
  },
  {
    id: 2,
    title: "Behind the Loom: 28 days of handweaving Varanasi Katan",
    views: "512K",
    likes: "45.1K",
    category: "Master Weaver Spotlight",
    productId: 2,
    productName: "Varanasi Shikargah Brocade",
    duration: "1:15",
    videoPoster: "assets/images/collection-banarasi.jpg"
  },
  {
    id: 3,
    title: "Ethereal Pastel Grace: Pure Soft Silk styling walkthrough 🌸",
    views: "92K",
    likes: "8.6K",
    category: "Lookbook",
    productId: 3,
    productName: "Amrita Lavender Soft Silk",
    duration: "0:52",
    videoPoster: "assets/images/collection-softsilk.jpg"
  },
  {
    id: 4,
    title: "Royal Crepe Elegance: Legendary Mysore Pure Silk 👑",
    views: "220K",
    likes: "19.3K",
    category: "Bridal Diaries",
    productId: 4,
    productName: "Rajmatha Royal Navy Mysore Silk",
    duration: "0:58",
    videoPoster: "assets/images/collection-mysoresilk.jpg"
  },
  {
    id: 5,
    title: "Pastel Organza with modern blouse styling ideas ✨",
    views: "340K",
    likes: "29.8K",
    category: "Styling Guide",
    productId: 5,
    productName: "Apsara Mint Tissue Organza",
    duration: "0:30",
    videoPoster: "assets/images/collection-organza.jpg"
  },
  {
    id: 6,
    title: "Pit Loom Mastery: Heritage Handloom Technique Live",
    views: "410K",
    likes: "37.5K",
    category: "Draping Tutorial",
    productId: 1,
    productName: "Heritage Pit Loom Craft",
    duration: "0:48",
    videoPoster: "assets/images/about-hero-pitloom.jpg"
  }
];

const REVIEWS_DATA = [
  {
    id: 1,
    name: "Dr. Radhika Iyer",
    location: "Bangalore, India",
    rating: 5,
    date: "14 October 2026",
    verified: true,
    sareeBought: "Swarna Kamal Kanchipuram Pure Silk Saree",
    headline: "Felt like royalty on my wedding day!",
    review: "I ordered this Kanchipuram for my wedding Muhurtham ceremony. The gold zari has the warmest, most exquisite shine—not brassy at all. The weight of the silk is substantial yet draped like butter. Customer support arranged a video call to show the drape in daylight. Worth every single rupee!",
    avatar: "assets/images/collection-kanchipuram.jpg",
    likes: 38
  },
  {
    id: 2,
    name: "Meenakshi Sundaram",
    location: "Chennai, India",
    rating: 5,
    date: "28 September 2026",
    verified: true,
    sareeBought: "Varanasi Shikargah Kadwa Banarasi Silk Saree",
    headline: "Unmatched craftsmanship & Silk Mark certified authenticity",
    review: "Being a saree connoisseur from Tamil Nadu, I am very particular about pure zari. DEMO SILKS exceeded expectations. The korvai border joint is immaculate, and the temple pattern is woven cleanly. Received compliments throughout the reception.",
    avatar: "assets/images/collection-banarasi.jpg",
    likes: 24
  },
  {
    id: 3,
    name: "Sneha Kapoor",
    location: "London, United Kingdom",
    rating: 5,
    date: "05 November 2026",
    verified: true,
    sareeBought: "Amrita Lavender Grace Pure Soft Silk Saree",
    headline: "Fast international DHL shipping and sublime packaging",
    review: "I ordered from London for Diwali. It arrived in 4 business days in a gorgeous branded keepsake box with a muslin saree preservation bag. The cutdana work caught all the evening chandeliers beautifully!",
    avatar: "assets/images/collection-softsilk.jpg",
    likes: 19
  },
  {
    id: 4,
    name: "Aarti Deshmukh",
    location: "Pune, India",
    rating: 5,
    date: "19 October 2026",
    verified: true,
    sareeBought: "Rajmatha Royal Navy Mysore Crepe Silk Saree",
    headline: "True heritage Mysore royal crepe weave",
    review: "The crepe silk drape is so fluid and comfortable. The navy blue is deep, rich and saturated with authentic hallmarked gold zari. Will cherish this heirloom and pass it down to my daughter.",
    avatar: "assets/images/collection-mysoresilk.jpg",
    likes: 15
  },
  {
    id: 5,
    name: "Pooja Singhania",
    location: "Mumbai, India",
    rating: 5,
    date: "02 November 2026",
    verified: true,
    sareeBought: "Apsara Mint Bloom Pure Tissue Organza Saree",
    headline: "Breathtaking mint hue and translucent finish",
    review: "Magnificent weave. The mint green hue is ethereal and luminous. The fall and blouse stitching service from their team was also spot-on. Absolute perfection!",
    avatar: "assets/images/collection-organza.jpg",
    likes: 12
  }
];
