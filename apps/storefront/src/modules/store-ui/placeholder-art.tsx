/**
 * Shown when a product or category has no photo yet: a ring of beads around
 * the item's initials, tinted from the name so neighbouring tiles differ.
 */
const TINTS = [
  { bg: "#EEF7F7", bead: "#0E5E63" },
  { bg: "#FCEEF3", bead: "#B4235A" },
  { bg: "#FBF6E6", bead: "#A8861C" },
  { bg: "#F1EEF8", bead: "#5B4A8B" },
]

export default function PlaceholderArt({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const hash = Array.from(name).reduce((a, c) => a + c.charCodeAt(0), 0)
  const tint = TINTS[hash % TINTS.length]
  const initials = name
    .replace(/[^A-Za-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("")

  const beads = Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2
    const round = (n: number) => Math.round(n * 100) / 100
    return { x: round(50 + Math.cos(a) * 34), y: round(50 + Math.sin(a) * 34), r: i % 3 === 0 ? 3.4 : 2.4 }
  })

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label={`${name} – photo coming soon`}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="100" height="100" fill={tint.bg} />
      {beads.map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={tint.bead} opacity={i % 3 === 0 ? 0.9 : 0.45} />
      ))}
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-display), Georgia, serif"
        fontSize="20"
        fill={tint.bead}
      >
        {initials}
      </text>
    </svg>
  )
}
