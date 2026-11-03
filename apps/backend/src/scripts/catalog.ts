/**
 * MemoryMakers4U catalogue, taken from the MEMORYMAKERS4U.xlsx price list.
 * Only the items, categories and prices in that sheet are used.
 * Edit, rename or delete any of these later in Admin → Products / Categories.
 * Prices are in rupees and include GST.
 */

export type SeedCategory = {
  name: string
  description?: string
  children: string[]
}

/**
 * The categories exactly as they appear in the Excel sheet, in the same
 * order. They are all top-level (no sub-categories).
 */
export const CATEGORY_TREE: SeedCategory[] = [
  "Kundans",
  "Hair Accessories",
  "Glue",
  "MDF",
  "Chains",
  "Silk Threads",
  "Zardosi",
  "Necklace Chains",
  "Necklace Chain Materials",
  "Invisible Chain Material",
  "Saree Pins",
  "Jhumka Base",
  "Tools",
  "Flower Caps",
  "Finger Ring",
  "Earrings Material",
  "OHP Sheet",
  "Wax Sheet",
  "Seed Beads",
  "Tube Beads",
  "Jarkan Stones",
  "Loreal Beads",
  "Sequins",
  "Micro Pollens",
  "Pearl Flower",
  "3mm Clip Stone",
  "Hanging Beads",
  "10x7mm Rectangle Clip Stone",
  "10x8mm Drop Clip Stone",
  "Connectors",
  "Pearl Beads",
  "Bracelet Chains",
  "Charms",
  "Invisible Chain Pendants",
  "Packing Materials",
  "Gold Sequins",
  "Stencils",
  "Glue Pen",
  "Jasmine Buds",
].map((name) => ({ name, children: [] }))

export type SeedVariant = {
  /** Option title → value, e.g. { Shape: "Heart", Pack: "10 g" } */
  options: Record<string, string>
  /** Missing when the Excel sheet has no price yet */
  price?: number
}

export type SeedProduct = {
  title: string
  /** Category name(s) from CATEGORY_TREE */
  categories: string[]
  description: string
  options: { title: string; values: string[] }[]
  variants: SeedVariant[]
  /** Saved as a hidden draft until a price is added in Admin */
  draft?: boolean
}

// ------------------------------------------------------------- helpers

/** A product with a single variant, e.g. "Cutter – 1 piece – ₹60". */
const single = (
  title: string,
  category: string | string[],
  pack: string,
  price: number
): SeedProduct => ({
  title,
  categories: [category].flat(),
  description: `Sold per ${pack}.`,
  options: [{ title: "Pack", values: [pack] }],
  variants: [{ options: { Pack: pack }, price }],
})

/**
 * A product where the customer picks one value (colour, size…), used where
 * the sheet lists colours or sizes under one item.
 */
const choice = (
  title: string,
  category: string,
  optionTitle: string,
  values: string[],
  pack: string,
  price: number
): SeedProduct => ({
  title,
  categories: [category],
  description: `Sold per ${pack}. Choose your ${optionTitle.toLowerCase()}.`,
  options: [
    { title: optionTitle, values },
    { title: "Pack", values: [pack] },
  ],
  variants: values.map((value) => ({
    options: { [optionTitle]: value, Pack: pack },
    price,
  })),
})

/** Kundans: every shape comes in 10 g / 20 g / 50 g packs. */
const kundan = (
  title: string,
  shapes: string[],
  prices: [number, number, number]
): SeedProduct => {
  const packs = ["10 g", "20 g", "50 g"]
  return {
    title,
    categories: ["Kundans"],
    description: "Choose your shape and pack size.",
    options: [
      { title: "Shape", values: shapes },
      { title: "Pack", values: packs },
    ],
    variants: shapes.flatMap((shape) =>
      packs.map((pack, i) => ({ options: { Shape: shape, Pack: pack }, price: prices[i] }))
    ),
  }
}

/**
 * An item listed in the sheet without a price or pack size. It is saved as
 * a hidden draft, ready to be priced and published in Admin → Products.
 */
const unpriced = (title: string, category: string): SeedProduct => ({
  title,
  categories: [category],
  description: "",
  options: [{ title: "Pack", values: ["1 piece"] }],
  variants: [{ options: { Pack: "1 piece" } }],
  draft: true,
})

// ------------------------------------------------------------ products

// In the same order as the Excel sheet.
export const PRODUCTS: SeedProduct[] = [
  // KUNDANS
  kundan(
    "White Glass Kundans",
    [
      "S", "Square 4x4", "Rectangle 3x7", "Round 3mm", "Round 4mm", "Triangle 6x6",
      "Crown", "Star", "Diamond 8x4", "Eye 6K", "Heart", "Drop", "Half Moon",
    ],
    [15, 30, 70]
  ),
  kundan(
    "Gold Glass Kundans",
    [
      "Triangle", "Half Moon", "Heart", "Star", "Tilakam", "Rectangle", "Square",
      "Drop", "3mm Round", "4mm Round", "Diamond", "Eye 6K", "Crown",
    ],
    [15, 30, 70]
  ),
  kundan(
    "Ceramic White Kundans",
    ["Triangle", "Drop", "Heart", "Rectangle", "6K Eye", "8K Eye", "3mm Round", "4mm Round", "Square"],
    [15, 30, 70]
  ),
  kundan(
    "Ceramic Gold Kundans",
    ["Triangle", "Drop", "Heart", "Rectangle", "6K Eye", "8K Eye", "3mm Round", "4mm Round", "Square"],
    [15, 30, 70]
  ),
  kundan(
    "Colour Glass Kundans",
    ["Crown", "Half Moon", "4mm Round", "Drop", "Heart", "Star", "Eye 6K", "Rectangle"],
    [20, 40, 90]
  ),

  // HAIR ACCESSORIES
  single("Head Bands", "Hair Accessories", "1 piece", 15),
  single("Rubber Bands", "Hair Accessories", "1 pair", 5),
  single("Attachers", "Hair Accessories", "1 piece", 3),
  single("Gold Tik Tok Clips", "Hair Accessories", "1 pair", 14),
  single("Alligator Clips 4.5cm", "Hair Accessories", "1 pair", 8),
  single("Center Clip 8cm", "Hair Accessories", "1 piece", 10),
  single("Center Clip 7cm", "Hair Accessories", "1 piece", 10),
  single("Gold U Pins 6cm", "Hair Accessories", "1 piece", 2),

  // GLUE
  single("Fevicryl 80g", "Glue", "1 piece", 35),
  single("Fevicryl 18g", "Glue", "1 piece", 18),
  single("Cone Fabric Glue", "Glue", "1 piece", 17),
  single("B7000 25ml", "Glue", "1 piece", 40),
  single("B7000 50ml", "Glue", "1 piece", 70),
  single("B7000 110ml", "Glue", "1 piece", 110),

  // MDF
  single("1 Inch Round MDF", "MDF", "1 pair", 5),
  single("1.5 Inch Round in Round MDF", "MDF", "1 pair", 10),
  single("Square MDF", "MDF", "1 pair", 8),
  single("Triangle MDF", "MDF", "1 pair", 8),
  single("1.5 Inch Round MDF", "MDF", "1 pair", 8),

  // CHAINS (the sheet has 8 prices for 7 chains; the first 7 are used)
  single("Loreal Chain", "Chains", "1 metre", 50),
  single("White Stone Chain", "Chains", "1 metre", 20),
  single("Muthyam Chain", "Chains", "1 metre", 20),
  single("Gold Ball Chain", "Chains", "1 metre", 20),
  single("Gold Stone White Muthyam Chain", "Chains", "1 metre", 10),
  single("Multi Colour Stone Chain", "Chains", "1 metre", 20),
  single("Colour Chains", "Chains", "1 metre", 40),

  // SILK THREADS
  single("KIP Silk Thread - Shade No 35NL", "Silk Threads", "1 piece", 18),
  single("KIP Silk Thread - Shade No 7N", "Silk Threads", "1 piece", 18),
  single("KIP Silk Thread - Shade No 24", "Silk Threads", "1 piece", 18),
  single("KIP Silk Thread - Shade No 69", "Silk Threads", "1 piece", 18),

  // ZARDOSI
  single("Gold Zardosi", "Zardosi", "10 g", 20),
  single("Silver Zardosi", "Zardosi", "10 g", 20),

  // NECKLACE CHAINS
  single("Gold Metal Link Chain 0.7mm", "Necklace Chains", "1 metre", 10),
  single("Gold Metal Link Chain 0.8mm", "Necklace Chains", "1 metre", 10),

  // NECKLACE CHAIN MATERIALS (Jump Rings is also listed under Earrings Material)
  single("Hooks", "Necklace Chain Materials", "1 piece", 4),
  single("Lobster Locks", "Necklace Chain Materials", "10 pieces", 15),
  single("Jump Rings", ["Necklace Chain Materials", "Earrings Material"], "10 g", 15),
  single("Dori", "Necklace Chain Materials", "1 piece", 18),

  // INVISIBLE CHAIN MATERIAL
  single("Gear Wire 0.45mm", "Invisible Chain Material", "1 piece", 50),
  single("Gold Beads", "Invisible Chain Material", "10 g", 20),
  single("Gear Locks / Lock Beads", "Invisible Chain Material", "5 g", 28),
  single("Stone Balls", "Invisible Chain Material", "10 pieces", 20),
  single("Elastic 0.7mm", "Invisible Chain Material", "1 piece", 40),
  single("6mm Rhinestone Spacer Beads", "Invisible Chain Material", "10 pieces", 10),

  // SAREE PINS
  single("Saree Pins Black 5.5cm", "Saree Pins", "1 piece", 7),
  single("Gold Brooch Pin 3cm", "Saree Pins", "1 piece", 3),

  // JHUMKA BASE
  single("Round Earring Jhumka 2cm", "Jhumka Base", "10 g", 20),

  // TOOLS
  single("Cutter", "Tools", "1 piece", 60),
  single("Nose Plier Flat", "Tools", "1 piece", 80),
  single("Nose Plier Round", "Tools", "1 piece", 100),
  single("Thread Cutter", "Tools", "1 piece", 20),

  // FLOWER CAPS
  single("Gold Flower Caps Model 1", "Flower Caps", "10 g", 15),
  single("Gold Flower Caps Model 2", "Flower Caps", "10 g", 15),

  // FINGER RING
  single("Finger Ring Base", "Finger Ring", "1 piece", 3),

  // EARRINGS MATERIAL
  single("Studs", "Earrings Material", "10 g", 15),
  single("Eye Pins", "Earrings Material", "10 g", 15),
  single("Head Pins", "Earrings Material", "10 g", 15),
  single("Hangings", "Earrings Material", "10 g", 15),
  single("Stoppers", "Earrings Material", "20 pieces", 10),
  single("Lakshmi Kasulu", "Earrings Material", "10 g", 15),

  // OHP SHEET
  single("OHP Sheet / Transparent Sheet", "OHP Sheet", "1 sheet", 5),

  // WAX SHEET
  single("Wax Sheet", "Wax Sheet", "1 sheet", 5),

  // SEED BEADS
  single("Micro Seed Beads", "Seed Beads", "10 g", 15),
  single("2mm Gold Glass Seed Beads", "Seed Beads", "10 g", 15),
  single("2mm Pink Glass Seed Beads", "Seed Beads", "10 g", 15),

  // TUBE BEADS
  single("4mm Gold Tube Beads", "Tube Beads", "10 g", 20),
  single("2mm Gold Tube Beads", "Tube Beads", "10 g", 20),
  single("2mm Pink Tube Beads", "Tube Beads", "10 g", 20),
  single("2mm Green Tube Beads", "Tube Beads", "10 g", 20),

  // JARKAN STONES (no price in the sheet yet)
  unpriced("2.7mm Jarkan Stones White", "Jarkan Stones"),

  // LOREAL BEADS
  single("4mm Loreal Beads White", "Loreal Beads", "10 g", 50),
  single("4mm Loreal Beads Black", "Loreal Beads", "10 g", 50),
  single("4mm Loreal Beads Blue", "Loreal Beads", "10 g", 50),
  single("4mm Loreal Beads Yellow", "Loreal Beads", "10 g", 50),

  // SEQUINS
  choice("Sequins", "Sequins", "Colour",
    ["Baby Pink", "Light Green", "Pink", "Purple", "Orange", "Sky Blue"], "10 g", 15),

  // MICRO POLLENS
  single("Gold Micro Pollens / Kothimeera", "Micro Pollens", "10 g", 35),

  // PEARL FLOWER
  single("2cm Pearl Flower Multicolour", "Pearl Flower", "1 pair", 6),

  // 3MM CLIP STONE
  choice("3mm Clip Stone", "3mm Clip Stone", "Colour",
    ["Red", "Blue", "Green", "Rainbow", "Pink", "Sky Blue"], "5 g", 30),

  // HANGING BEADS
  choice("Hanging Beads", "Hanging Beads", "Colour",
    ["Red", "Yellow", "White", "Green", "Purple", "Pink"], "10 pieces", 15),

  // 10X7MM RECTANGLE CLIP STONE
  choice("10x7mm Rectangle Clip Stone", "10x7mm Rectangle Clip Stone", "Colour",
    ["Blue", "Pink", "Light Green", "Rainbow"], "1 piece", 6),

  // 10X8MM DROP CLIP STONE
  choice("10x8mm Drop Clip Stone", "10x8mm Drop Clip Stone", "Colour",
    ["Gold", "Pink", "Blue", "Onion Pink"], "1 piece", 5),

  // CONNECTORS (no price in the sheet yet)
  unpriced("Antique Connectors", "Connectors"),
  unpriced("Gold Connectors", "Connectors"),

  // PEARL BEADS
  single("10mm Half White Pearl Beads", "Pearl Beads", "10 g", 20),
  single("10mm Full White Pearl Beads", "Pearl Beads", "10 g", 20),

  // BRACELET CHAINS
  single("Bracelet Chains", "Bracelet Chains", "1 piece", 15),

  // CHARMS
  single("Peacock Charm", "Charms", "1 piece", 3),
  single("Elephant Charm", "Charms", "1 piece", 3),
  single("Ganesh Charm", "Charms", "1 piece", 3),
  single("Peacock Full Feather Charm", "Charms", "1 piece", 3),
  single("Lakshmi Charm", "Charms", "1 piece", 12),

  // INVISIBLE CHAIN PENDANTS
  single("Lotus Pendant", "Invisible Chain Pendants", "1 piece", 12),
  single("Lakshmi Pendant (4 Colours)", "Invisible Chain Pendants", "1 piece", 30),
  single("Halfmoon Pendant", "Invisible Chain Pendants", "1 piece", 30),
  single("Square Pendant", "Invisible Chain Pendants", "1 piece", 25),
  single("Elephant Pendant", "Invisible Chain Pendants", "1 piece", 30),
  single("Parrot Pendant", "Invisible Chain Pendants", "1 piece", 25),
  single("Small Lotus Pendant", "Invisible Chain Pendants", "1 piece", 25),

  // PACKING MATERIALS
  single("Bangles Wrapping Covers", "Packing Materials", "10 pieces", 12),
  single("Packing Covers", "Packing Materials", "10 pieces", 5),

  // GOLD SEQUINS
  single("20mm Gold Sequins", "Gold Sequins", "10 g", 30),

  // STENCILS
  choice("Parrot Stencil", "Stencils", "Size", ["Big", "Small"], "1 piece", 40),
  choice("Elephant Stencil", "Stencils", "Size", ["Big", "Small"], "1 piece", 40),
  choice("Lotus Stencil Model 1", "Stencils", "Size", ["Big", "Small"], "1 piece", 40),
  choice("Butterfly Stencil", "Stencils", "Size", ["Big", "Small"], "1 piece", 40),
  single("Lotus Stencil Model 2", "Stencils", "1 piece", 40),
  single("Baby Foot Stencil", "Stencils", "1 piece", 40),
  single("Peacock Stencil", "Stencils", "1 piece", 40),

  // GLUE PEN
  single("Sticking Pen", "Glue Pen", "1 piece", 40),
  single("Sticking Pencil", "Glue Pen", "1 piece", 60),

  // JASMINE BUDS
  single("Jasmine Buds 1", "Jasmine Buds", "15 pieces", 10),
  single("Jasmine Buds 2", "Jasmine Buds", "15 pieces", 65),
]
