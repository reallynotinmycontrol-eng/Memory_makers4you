/**
 * Starter catalogue for the craft store.
 * Edit, rename or delete any of these later in Admin → Products / Categories.
 */

export type SeedCategory = {
  name: string
  description?: string
  children: string[]
}

export const CATEGORY_TREE: SeedCategory[] = [
  {
    name: "Silk Thread Materials",
    description: "Everything for silk thread bangles and jewellery.",
    children: [
      "Beginner Kits",
      "Silk Thread",
      "Plain Bangles",
      "Metal Bangles",
      "Glue",
      "Chains",
      "Saree Pins",
      "Jhumka Bases",
      "Flower Caps",
      "Tools",
      "Packing Materials",
    ],
  },
  {
    name: "Kundan Stones",
    description: "Gloss, matt and pearl kundan in every shape.",
    children: [
      "Gloss Kundan",
      "Matt Kundan",
      "Pearl Kundan",
      "White & Gold Kundan",
      "Kundan Combos",
    ],
  },
  {
    name: "Clip Stones",
    description: "Round, square, drop and oval clip stones.",
    children: [
      "Round Clip Stones",
      "Square Clip Stones",
      "Drop Clip Stones",
      "Oval Clip Stones",
      "AD Clip Stones",
    ],
  },
  {
    name: "Jewellery Making",
    description: "Beads, sequins, findings and embellishments.",
    children: [
      "Seed Beads",
      "Crystal Beads",
      "Pearl Beads",
      "Gold Beads",
      "Sequins",
      "Zardosi",
      "Earring Findings",
      "Antique Charms",
    ],
  },
  {
    name: "Bracelet & Necklace",
    description: "Chains, wires, charms and pendants.",
    children: [
      "Bracelet Charms",
      "Necklace Chains",
      "Memory Wire",
      "Evil Eye Beads",
      "Alphabet Beads",
      "Pendants",
    ],
  },
  {
    name: "Resin Art",
    description: "Resin, moulds, pigments and inclusions.",
    children: [
      "Resin & UV Resin",
      "Resin Moulds",
      "Pigments & Mica",
      "Dry Flowers",
      "Bezels & Keychains",
      "Glitter & Flakes",
    ],
  },
  {
    name: "Craft Materials",
    description: "Clay, sheets, paints, ribbons and tools.",
    children: [
      "Air Dry Clay",
      "Foam & Felt Sheets",
      "Acrylic Paints",
      "Ribbons",
      "Glue Guns",
      "Craft Tools",
    ],
  },
]

export type SeedProduct = {
  title: string
  category: string
  description: string
  price: number
  /** Option name and values, e.g. Colour: Red, Green. Omit for single-variant. */
  option?: { title: string; values: string[] }
  weight?: number
}

export const PRODUCTS: SeedProduct[] = [
  {
    title: "Silk Thread Bangle Starter Kit",
    category: "Beginner Kits",
    description:
      "Everything you need for your first silk thread bangles: plain bangles, 10 thread colours, glue, stones and a step-by-step guide.",
    price: 499,
    weight: 400,
  },
  {
    title: "Silk Thread Spool",
    category: "Silk Thread",
    description: "Smooth, shiny silk thread for bangles, earrings and tassels. Approx. 50 m per spool.",
    price: 25,
    option: { title: "Colour", values: ["Red", "Maroon", "Green", "Royal Blue", "Gold", "Pink"] },
    weight: 30,
  },
  {
    title: "Plain Plastic Bangles (Set of 12)",
    category: "Plain Bangles",
    description: "Lightweight base bangles ready to wrap with silk thread.",
    price: 90,
    option: { title: "Size", values: ["2.2", "2.4", "2.6", "2.8"] },
    weight: 200,
  },
  {
    title: "Instant Craft Glue 20 ml",
    category: "Glue",
    description: "Quick-drying, clear glue for stones, kundan and thread work.",
    price: 45,
    weight: 40,
  },
  {
    title: "Gold Flower Caps (Pack of 50)",
    category: "Flower Caps",
    description: "Decorative caps for jhumkas, tassels and bead work.",
    price: 60,
    option: { title: "Size", values: ["6 mm", "8 mm", "10 mm"] },
    weight: 30,
  },
  {
    title: "Jhumka Base – Gold Finish (5 Pairs)",
    category: "Jhumka Bases",
    description: "Dome-shaped jhumka bases for silk thread and kundan earrings.",
    price: 110,
    option: { title: "Size", values: ["Small", "Medium", "Large"] },
    weight: 60,
  },
  {
    title: "Round Gloss Kundan (Pack of 100)",
    category: "Gloss Kundan",
    description: "Glossy flat-back kundan stones for bangles, earrings and rangoli.",
    price: 50,
    option: { title: "Colour", values: ["Red", "Green", "Blue", "Pink", "White", "Multicolour"] },
    weight: 30,
  },
  {
    title: "Eye Shape Matt Kundan (Pack of 50)",
    category: "Matt Kundan",
    description: "Elegant matt-finish eye-shaped kundan.",
    price: 55,
    option: { title: "Colour", values: ["Ruby", "Emerald", "Sapphire", "Pearl White"] },
    weight: 30,
  },
  {
    title: "Pearl Drop Kundan (Pack of 25)",
    category: "Pearl Kundan",
    description: "Pearl-finish drop kundan for a soft, festive look.",
    price: 70,
    weight: 25,
  },
  {
    title: "Kundan Mega Combo Box",
    category: "Kundan Combos",
    description: "Assorted shapes and colours in a reusable compartment box.",
    price: 349,
    weight: 300,
  },
  {
    title: "4 mm Round Clip Stones (Pack of 100)",
    category: "Round Clip Stones",
    description: "Stones set in claw clips, ready to stitch or glue.",
    price: 80,
    option: { title: "Finish", values: ["Gold", "Silver"] },
    weight: 30,
  },
  {
    title: "10x14 Drop Clip Stones (Pack of 20)",
    category: "Drop Clip Stones",
    description: "Drop-shaped clip stones for pendants and earring drops.",
    price: 95,
    option: { title: "Colour", values: ["Red", "Green", "White", "Blue"] },
    weight: 30,
  },
  {
    title: "Glass Seed Beads 100 g",
    category: "Seed Beads",
    description: "Uniform 2 mm glass seed beads for embroidery and bead weaving.",
    price: 65,
    option: { title: "Colour", values: ["Gold", "Silver", "Red", "Green", "Black", "White"] },
    weight: 110,
  },
  {
    title: "Faceted Crystal Beads (Strand)",
    category: "Crystal Beads",
    description: "Sparkling 6 mm faceted crystal beads, approx. 70 per strand.",
    price: 75,
    option: { title: "Colour", values: ["Clear AB", "Pink", "Teal", "Champagne"] },
    weight: 50,
  },
  {
    title: "Zardosi Dabka Wire 10 g",
    category: "Zardosi",
    description: "Traditional zardosi wire for embroidery and bridal work.",
    price: 40,
    option: { title: "Colour", values: ["Antique Gold", "Bright Gold", "Silver"] },
    weight: 15,
  },
  {
    title: "Earring Hooks & Studs Kit",
    category: "Earring Findings",
    description: "Fish hooks, studs, jump rings and backs in one kit.",
    price: 120,
    weight: 60,
  },
  {
    title: "Evil Eye Beads (Pack of 30)",
    category: "Evil Eye Beads",
    description: "Glass evil eye beads for bracelets, keychains and charms.",
    price: 85,
    weight: 40,
  },
  {
    title: "Alphabet Cube Beads (Pack of 300)",
    category: "Alphabet Beads",
    description: "Mixed letter beads for name bracelets.",
    price: 99,
    option: { title: "Colour", values: ["White & Black", "Gold", "Pastel Mix"] },
    weight: 120,
  },
  {
    title: "Memory Wire Bracelet Coil",
    category: "Memory Wire",
    description: "Steel memory wire that holds its round shape, approx. 100 loops.",
    price: 70,
    weight: 60,
  },
  {
    title: "Crystal Clear Epoxy Resin Kit 500 g",
    category: "Resin & UV Resin",
    description: "Low-bubble, non-yellowing resin and hardener, 1:1 mix.",
    price: 649,
    option: { title: "Size", values: ["300 g", "500 g", "1 kg"] },
    weight: 600,
  },
  {
    title: "UV Resin Hard Type 50 g",
    category: "Resin & UV Resin",
    description: "Cures in minutes under a UV lamp. Ideal for small pendants.",
    price: 299,
    weight: 70,
  },
  {
    title: "Silicone Coaster Mould",
    category: "Resin Moulds",
    description: "Flexible, reusable silicone mould with a glossy finish.",
    price: 249,
    option: { title: "Shape", values: ["Round", "Square", "Hexagon"] },
    weight: 150,
  },
  {
    title: "Mica Powder Set (12 Colours)",
    category: "Pigments & Mica",
    description: "Shimmering pigments for resin, soap and slime.",
    price: 299,
    weight: 120,
  },
  {
    title: "Pressed Dry Flowers Box",
    category: "Dry Flowers",
    description: "Assorted real pressed flowers and leaves for resin art.",
    price: 199,
    weight: 80,
  },
  {
    title: "Air Dry Clay 500 g",
    category: "Air Dry Clay",
    description: "Soft, white air-dry clay. No baking required.",
    price: 180,
    weight: 520,
  },
  {
    title: "Acrylic Paint Set (12 x 20 ml)",
    category: "Acrylic Paints",
    description: "Bright, fast-drying acrylic colours for craft and canvas.",
    price: 220,
    weight: 300,
  },
  {
    title: "Satin Ribbon Roll 1 inch",
    category: "Ribbons",
    description: "Smooth satin ribbon, 25 yards per roll.",
    price: 60,
    option: { title: "Colour", values: ["Red", "Gold", "White", "Pink", "Navy"] },
    weight: 80,
  },
  {
    title: "Mini Glue Gun with 10 Sticks",
    category: "Glue Guns",
    description: "20 W mini glue gun for quick craft fixes.",
    price: 249,
    weight: 250,
  },
]
