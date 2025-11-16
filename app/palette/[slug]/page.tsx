import tinycolor from "tinycolor2"

function parseSlug(slug?: string): string[] {
  if (!slug) {
    return new Array(5).fill(0).map(() => tinycolor.random().toHexString())
  }
  const parts = slug.split("-")
  const valid = parts.filter((p) => /^[0-9a-fA-F]{3,6}$/.test(p)).map((p) => `#${p}`)
  if (valid.length === 5) return valid
  const filled = [...valid]
  while (filled.length < 5) {
    const base = tinycolor.random().toHexString()
    filled.push(base)
  }
  return filled.slice(0, 5)
}

export default async function PalettePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const colors = parseSlug(slug)
  return (
    <div className="h-screen w-screen grid grid-cols-5">
      {colors.map((hex, i) => (
        <div key={i} style={{ backgroundColor: hex }} />
      ))}
    </div>
  )
}
