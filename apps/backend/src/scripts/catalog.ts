/**
 * MemoryMakers4U catalogue, taken from the MEMORYMAKERS4U.xlsx price list.
 * Edit, rename or delete any of these later in Admin → Products / Categories.
 * Prices are in rupees and include GST.
 */

export type SeedCategory = {
  name: string
  description?: string
  children: string[]
}

export const CATEGORY_TREE: SeedCategory[] = [
  {
    name: "Kundan Stones",
    description: "Glass, ceramic and colour kundans in every shape.",
    children: ["Glass Kundans", "Ceramic Kundans", "Colour Kundans"],
  },
  {
    name: "Clip Stones",
    description: "Round, rectangle and drop clip stones.",
    children: ["3mm Clip Stones", "Rectangle Clip Stones", "Drop Clip Stones"],
  },
  {
    name: "Beads & Embellishments",
    description: "Beads, sequins, zardosi and finishing touches.",
    children: [
      "Seed Beads",
      "Tube Beads",
      "Loreal Beads",
      "Pearl Beads",
      "Hanging Beads",
      "Sequins",
      "Zardosi",
      "Micro Pollens",
      "Pearl Flowers",
      "Jasmine Buds",
    ],
  },
  {
    name: "Jewellery Findings",
    description: "Earring materials, bases, caps and charms.",
    children: [
      "Earrings Material",
      "Jhumka Bases",
      "Flower Caps",
      "Finger Ring Bases",
      "Charms",
      "MDF Bases",
    ],
  },
  {
    name: "Chains & Necklace",
    description: "Stone chains, link chains and invisible chain materials.",
    children: [
      "Stone Chains",
      "Necklace Chains",
      "Necklace Chain Materials",
      "Invisible Chain Material",
      "Invisible Chain Pendants",
      "Bracelet Chains",
    ],
  },
  {
    name: "Hair & Saree Accessories",
    description: "Clips, bands, pins and saree pins.",
    children: ["Hair Accessories", "Saree Pins"],
  },
  {
    name: "Craft Supplies",
    description: "Silk thread, glue, tools, stencils and packing.",
    children: [
      "Silk Threads",
      "Glue",
      "Glue Pens",
      "Tools",
      "Stencils",
      "OHP & Wax Sheets",
      "Packing Materials",
    ],
  },
]

export type SeedVariant = {
  /** Option title → value, e.g. { Shape: "Heart", Pack: "10 g" } */
  options: Record<string, string>
  price: number
}

export type SeedProduct = {
  title: string
  /** Sub-category name(s) from CATEGORY_TREE */
  categories: string[]
  description: string
  options: { title: string; values: string[] }[]
  variants: SeedVariant[]
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
 * A product where the customer picks one value (colour, shade, size…).
 * `price` is either one price for all values or a price per value.
 */
const choice = (
  title: string,
  category: string,
  optionTitle: string,
  values: string[],
  pack: string,
  price: number | number[]
): SeedProduct => ({
  title,
  categories: [category],
  description: `Sold per ${pack}. Choose your ${optionTitle.toLowerCase()}.`,
  options: [
    { title: optionTitle, values },
    { title: "Pack", values: [pack] },
  ],
  variants: values.map((value, i) => ({
    options: { [optionTitle]: value, Pack: pack },
    price: Array.isArray(price) ? price[i] : price,
  })),
})

/** Kundans: every shape comes in 10 g / 20 g / 50 g packs. */
const kundan = (
  title: string,
  category: string,
  shapes: string[],
  prices: [number, number, number]
): SeedProduct => {
  const packs = ["10 g", "20 g", "50 g"]
  return {
    title,
    categories: [category],
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

// ------------------------------------------------------------ products

export const PRODUCTS: SeedProduct[] = [
  // Kundans
  kundan(
    "White Glass Kundans",
    "Glass Kundans",
    [
      "S", "Square 4x4", "Rectangle 3x7", "Round 3mm", "Round 4mm", "Triangle 6x6",
      "Crown", "Star", "Diamond 8x4", "Eye 6K", "Heart", "Drop", "Half Moon",
    ],
    [15, 30, 70]
  ),
  kundan(
    "Gold Glass Kundans",
    "Glass Kundans",
    [
      "Triangle", "Half Moon", "Heart", "Star", "Tilakam", "Rectangle", "Square",
      "Drop", "Round 3mm", "Round 4mm", "Diamond", "Eye 6K", "Crown",
    ],
    [15, 30, 70]
  ),
  kundan(
    "Ceramic White Kundans",
    "Ceramic Kundans",
    ["Triangle", "Drop", "Heart", "Rectangle", "Eye 6K", "Eye 8K", "Round 3mm", "Round 4mm", "Square"],
    [15, 30, 70]
  ),
  kundan(
    "Ceramic Gold Kundans",
    "Ceramic Kundans",
    ["Triangle", "Drop", "Heart", "Rectangle", "Eye 6K", "Eye 8K", "Round 3mm", "Round 4mm", "Square"],
    [15, 30, 70]
  ),
  kundan(
    "Colour Glass Kundans",
    "Colour Kundans",
    ["Crown", "Half Moon", "Round 4mm", "Drop", "Heart", "Star", "Eye 6K", "Rectangle"],
    [20, 40, 90]
  ),

  // Clip stones
  choice("3mm Clip Stones", "3mm Clip Stones", "Colour",
    ["Red", "Blue", "Green", "Rainbow", "Pink", "Sky Blue"], "5 g", 30),
  choice("10x7mm Rectangle Clip Stone", "Rectangle Clip Stones", "Colour",
    ["Blue", "Pink", "Light Green", "Rainbow"], "1 piece", 6),
  choice("10x8mm Drop Clip Stone", "Drop Clip Stones", "Colour",
    ["Gold", "Pink", "Blue", "Onion Pink"], "1 piece", 5),

  // Beads & embellishments
  single("Micro Seed Beads", "Seed Beads", "10 g", 15),
  single("2mm Gold Glass Seed Beads", "Seed Beads", "10 g", 15),
  single("2mm Pink Glass Seed Beads", "Seed Beads", "10 g", 15),
  choice("Tube Beads", "Tube Beads", "Type",
    ["4mm Gold", "2mm Gold", "2mm Pink", "2mm Green"], "10 g", 20),
  choice("4mm Loreal Beads", "Loreal Beads", "Colour",
    ["White", "Black", "Blue", "Yellow"], "10 g", 50),
  choice("10mm White Pearl Beads", "Pearl Beads", "Type", ["Half", "Full"], "10 g", 20),
  choice("Hanging Beads", "Hanging Beads", "Colour",
    ["Red", "Yellow", "White", "Green", "Purple", "Pink"], "10 pieces", 15),
  choice("Sequins", "Sequins", "Colour",
    ["Baby Pink", "Light Green", "Pink", "Purple", "Orange", "Sky Blue"], "10 g", 15),
  single("20mm Gold Sequins", "Sequins", "10 g", 30),
  choice("Zardosi", "Zardosi", "Colour", ["Gold", "Silver"], "10 g", 20),
  single("Gold Micro Pollens (Kothimeera)", "Micro Pollens", "10 g", 35),
  single("2cm Pearl Flower – Multicolour", "Pearl Flowers", "1 pair", 6),
  choice("Jasmine Buds", "Jasmine Buds", "Model", ["Model 1", "Model 2"], "15 pieces", [10, 65]),

  // Jewellery findings
  single("Jump Rings", ["Earrings Material", "Necklace Chain Materials"], "10 g", 15),
  single("Earring Studs", "Earrings Material", "10 g", 15),
  single("Eye Pins", "Earrings Material", "10 g", 15),
  single("Head Pins", "Earrings Material", "10 g", 15),
  single("Earring Hangings", "Earrings Material", "10 g", 15),
  single("Earring Stoppers", "Earrings Material", "20 pieces", 10),
  single("Lakshmi Kasulu", "Earrings Material", "10 g", 15),
  single("Round Earring Jhumka 2cm", "Jhumka Bases", "10 g", 20),
  choice("Gold Flower Caps", "Flower Caps", "Model", ["Model 1", "Model 2"], "10 g", 15),
  single("Finger Ring Base", "Finger Ring Bases", "1 piece", 3),
  single("Peacock Charm", "Charms", "1 piece", 3),
  single("Elephant Charm", "Charms", "1 piece", 3),
  single("Ganesh Charm", "Charms", "1 piece", 3),
  single("Peacock Full Feather Charm", "Charms", "1 piece", 3),
  single("Lakshmi Charm", "Charms", "1 piece", 12),
  choice("MDF Bases", "MDF Bases", "Shape",
    ["1 Inch Round", "1.5 Inch Round in Round", "Square", "Triangle", "1.5 Inch Round"],
    "1 pair", [5, 10, 8, 8, 8]),

  // Chains & necklace
  single("Loreal Chain", "Stone Chains", "1 metre", 50),
  single("White Stone Chain", "Stone Chains", "1 metre", 20),
  single("Muthyam Chain", "Stone Chains", "1 metre", 20),
  single("Gold Ball Chain", "Stone Chains", "1 metre", 20),
  single("Gold Stone White Muthyam Chain", "Stone Chains", "1 metre", 10),
  single("Multi Colour Stone Chain", "Stone Chains", "1 metre", 20),
  single("Colour Chains", "Stone Chains", "1 metre", 40),
  choice("Gold Metal Link Chain", "Necklace Chains", "Thickness", ["0.7mm", "0.8mm"], "1 metre", 10),
  single("Necklace Hooks", "Necklace Chain Materials", "1 piece", 4),
  single("Lobster Locks", "Necklace Chain Materials", "10 pieces", 15),
  single("Dori", "Necklace Chain Materials", "1 piece", 18),
  single("Gear Wire 0.45mm", "Invisible Chain Material", "1 piece", 50),
  single("Gold Beads", "Invisible Chain Material", "10 g", 20),
  single("Gear Locks / Lock Beads", "Invisible Chain Material", "5 g", 28),
  single("Stone Balls", "Invisible Chain Material", "10 pieces", 20),
  single("Elastic 0.7mm", "Invisible Chain Material", "1 piece", 40),
  single("6mm Rhinestone Spacer Beads", "Invisible Chain Material", "10 pieces", 10),
  single("Lotus Pendant", "Invisible Chain Pendants", "1 piece", 12),
  single("Lakshmi Pendant (4 Colours)", "Invisible Chain Pendants", "1 piece", 30),
  single("Half Moon Pendant", "Invisible Chain Pendants", "1 piece", 30),
  single("Square Pendant", "Invisible Chain Pendants", "1 piece", 25),
  single("Elephant Pendant", "Invisible Chain Pendants", "1 piece", 30),
  single("Parrot Pendant", "Invisible Chain Pendants", "1 piece", 25),
  single("Small Lotus Pendant", "Invisible Chain Pendants", "1 piece", 25),
  single("Bracelet Chain", "Bracelet Chains", "1 piece", 15),

  // Hair & saree accessories
  single("Head Band", "Hair Accessories", "1 piece", 15),
  single("Rubber Bands", "Hair Accessories", "1 pair", 5),
  single("Hair Attacher", "Hair Accessories", "1 piece", 3),
  single("Gold Tik Tok Clips", "Hair Accessories", "1 pair", 14),
  single("Alligator Clips 4.5cm", "Hair Accessories", "1 pair", 8),
  single("Center Clip 8cm", "Hair Accessories", "1 piece", 10),
  single("Center Clip 7cm", "Hair Accessories", "1 piece", 10),
  single("Gold U Pins 6cm", "Hair Accessories", "1 piece", 2),
  single("Black Saree Pin 5.5cm", "Saree Pins", "1 piece", 7),
  single("Gold Brooch Pin 3cm", "Saree Pins", "1 piece", 3),

  // Craft supplies
  choice("KIP Silk Thread", "Silk Threads", "Shade",
    ["Shade 35NL", "Shade 7N", "Shade 24", "Shade 69"], "1 piece", 18),
  choice("Fevicryl", "Glue", "Size", ["18 g", "80 g"], "1 piece", [18, 35]),
  single("Cone Fabric Glue", "Glue", "1 piece", 17),
  choice("B7000 Glue", "Glue", "Size", ["25 ml", "50 ml", "110 ml"], "1 piece", [40, 70, 110]),
  single("Sticking Pen", "Glue Pens", "1 piece", 40),
  single("Sticking Pencil", "Glue Pens", "1 piece", 60),
  single("Cutter", "Tools", "1 piece", 60),
  single("Flat Nose Plier", "Tools", "1 piece", 80),
  single("Round Nose Plier", "Tools", "1 piece", 100),
  single("Thread Cutter", "Tools", "1 piece", 20),
  choice("Parrot Stencil", "Stencils", "Size", ["Big", "Small"], "1 piece", 40),
  choice("Elephant Stencil", "Stencils", "Size", ["Big", "Small"], "1 piece", 40),
  choice("Lotus Stencil Model 1", "Stencils", "Size", ["Big", "Small"], "1 piece", 40),
  choice("Butterfly Stencil", "Stencils", "Size", ["Big", "Small"], "1 piece", 40),
  single("Lotus Stencil Model 2", "Stencils", "1 piece", 40),
  single("Baby Foot Stencil", "Stencils", "1 piece", 40),
  single("Peacock Stencil", "Stencils", "1 piece", 40),
  single("OHP Sheet / Transparent Sheet", "OHP & Wax Sheets", "1 sheet", 5),
  single("Wax Sheet", "OHP & Wax Sheets", "1 sheet", 5),
  single("Bangles Wrapping Covers", "Packing Materials", "10 pieces", 12),
  single("Packing Covers", "Packing Materials", "10 pieces", 5),
]
