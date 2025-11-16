import tinycolor from 'tinycolor2'

export type Mode = 'analogous' | 'monochromatic' | 'triad' | 'tetrad' | 'splitcomplement'

export function randomBase(s = 0.7, l = 0.5) {
  const h = Math.floor(Math.random() * 360)
  return tinycolor({ h, s, l }).toHexString()
}

type TinyColorLike = { toHexString: () => string }

export function generatePalette(opts: {
  mode?: Mode
  count?: number
  base?: string
  locked?: Record<number, string>
}) {
  const count = opts.count ?? 5
  const mode = opts.mode ?? 'analogous'
  const baseTc = tinycolor(opts.base ?? randomBase())
  let colorsTc: TinyColorLike[]
  switch (mode) {
    case 'analogous':
      colorsTc = baseTc.analogous(Math.max(count, 6), 30)
      break
    case 'monochromatic':
      colorsTc = baseTc.monochromatic(Math.max(count, 6))
      break
    case 'triad':
      colorsTc = baseTc.triad()
      break
    case 'tetrad':
      colorsTc = baseTc.tetrad()
      break
    case 'splitcomplement':
      colorsTc = baseTc.splitcomplement()
      break
    default:
      colorsTc = baseTc.analogous(Math.max(count, 6), 30)
  }
  let out = colorsTc.slice(0, count).map((c) => c.toHexString())
  if (mode === 'triad' && count > 3) {
    const a = tinycolor(out[0]).lighten(10).toHexString()
    const b = tinycolor(out[1]).darken(5).toHexString()
    out = out.concat([a, b]).slice(0, count)
  }
  if (mode === 'tetrad' && count > 4) {
    const a = tinycolor(out[0]).lighten(8).toHexString()
    out = out.concat(a).slice(0, count)
  }
  const locked = opts.locked ?? {}
  const result = new Array(count).fill(null)
  for (let i = 0; i < count; i++) {
    if (locked[i]) result[i] = tinycolor(locked[i]).toHexString()
  }
  let idx = 0
  for (let i = 0; i < count; i++) {
    if (!result[i]) {
      result[i] = out[idx++] ?? tinycolor.random().toHexString()
    }
  }
  return result as string[]
}

export type Fmt = 'hex' | 'rgb' | 'hsl'
export function cycleFormat(color: string, fmt: Fmt): { value: string; fmt: Fmt } {
  const tc = tinycolor(color)
  if (fmt === 'hex') return { value: tc.toRgbString(), fmt: 'rgb' }
  if (fmt === 'rgb') return { value: tc.toHslString(), fmt: 'hsl' }
  return { value: tc.toHexString(), fmt: 'hex' }
}

export function bestText(hex: string) {
  const tc = tinycolor(hex)
  return tc.isLight() ? '#000' : '#fff'
}

export function normalizeColor(input: string): string | null {
  const tc = tinycolor(input)
  return tc.isValid() ? tc.toHexString() : null
}
