"use client"
import Link from "next/link"
import { useEffect, useState } from "react"

type Favorite = { slug: string; colors: string[]; createdAt: number }

function loadFavorites(): Favorite[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem("cp:favorites")
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveFavorites(favs: Favorite[]) {
  try {
    localStorage.setItem("cp:favorites", JSON.stringify(favs))
  } catch {}
}

export default function Chrome({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([])

  useEffect(() => { setFavorites(loadFavorites()) }, [])
  useEffect(() => { saveFavorites(favorites) }, [favorites])

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ slug: string; colors: string[] }>
      const { slug, colors } = ce.detail || { slug: "", colors: [] }
      if (!slug || colors.length === 0) return
      setFavorites((prev) => {
        const exists = prev.some((p) => p.slug === slug)
        if (exists) return prev
        return [{ slug, colors, createdAt: Date.now() }, ...prev].slice(0, 100)
      })
    }
    window.addEventListener("save-palette", handler as EventListener)
    return () => window.removeEventListener("save-palette", handler as EventListener)
  }, [])

  return (
    <div>
      <aside className="fixed left-0 top-0 h-screen w-64 bg-zinc-900 text-white border-r border-zinc-800 overflow-auto z-40">
        <div className="px-4 py-3 font-semibold">Favoritos</div>
        <ul className="px-2 space-y-2">
          {favorites.length === 0 && (
            <li className="px-2 text-xs text-zinc-400">Guarda paletas y aparecerán aquí</li>
          )}
          {favorites.map((fav) => (
            <li key={fav.slug} className="flex items-center gap-2 px-2">
              <Link href={`/palette/${fav.slug}`} className="flex-1">
                <div className="flex items-center gap-1">
                  {fav.colors.slice(0,5).map((c, i) => (
                    <span key={i} style={{ backgroundColor: c }} className="h-4 w-4 rounded" />
                  ))}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1 truncate">{fav.slug}</div>
              </Link>
              <button
                aria-label="Eliminar"
                onClick={() => setFavorites((prev) => prev.filter((p) => p.slug !== fav.slug))}
                className="text-xs text-zinc-400 hover:text-red-400"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <nav className="fixed left-64 right-0 top-0 h-12 bg-zinc-950/80 backdrop-blur flex items-center px-4 text-white border-b border-zinc-800 z-50">
        <Link href="/" className="font-semibold">CoolPalettes</Link>
        <div className="ml-auto flex items-center gap-3 overflow-x-auto">
          <input
            placeholder="#34D399 o red o rgb(52,211,153)"
            className="text-xs px-2 py-1 rounded-md bg-white/10 border border-white/15 text-white placeholder:text-white/60"
            onChange={(e) => {
              const ev = new CustomEvent('cp:set-base', { detail: { value: e.target.value } })
              window.dispatchEvent(ev)
            }}
          />
          <select
            className="text-xs px-2 py-1 rounded-md bg-white/10 border border-white/15"
            onChange={(e) => {
              const ev = new CustomEvent('cp:set-mode', { detail: { value: e.target.value } })
              window.dispatchEvent(ev)
            }}
          >
            <option value="analogous">Análoga</option>
            <option value="monochromatic">Monocromática</option>
            <option value="triad">Tríada</option>
            <option value="tetrad">Tétrada</option>
            <option value="splitcomplement">Complementaria dividida</option>
          </select>
          <button type="button"
            className="text-xs px-2 py-1 rounded-md bg-white/10 border border-white/15"
            onClick={() => window.dispatchEvent(new Event('cp:toggle-format'))}
          >
            Formato
          </button>
          <button type="button"
            className="text-xs px-2 py-1 rounded-md bg-white/10 border border-white/15"
            onClick={() => window.dispatchEvent(new Event('cp:generate'))}
          >
            Generar
          </button>
          <button type="button"
            className="text-xs px-2 py-1 rounded-md bg-white/10 border border-white/15"
            onClick={() => window.dispatchEvent(new Event('cp:save'))}
          >
            Guardar
          </button>
          <button type="button"
            className="text-xs px-2 py-1 rounded-md bg-white/10 border border-white/15"
            onClick={() => window.dispatchEvent(new Event('cp:share'))}
          >
            Compartir
          </button>
        </div>
      </nav>
      <main className="relative ml-64 mt-12">{children}</main>
    </div>
  )
}