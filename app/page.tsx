"use client"
import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { generatePalette, cycleFormat, type Fmt, bestText, normalizeColor } from "@/lib/colors"
import tinycolor from "tinycolor2"

export default function Home() {
  const [palette, setPalette] = useState<string[]>(['#000000','#111111','#222222','#333333','#444444'])
  const [locked, setLocked] = useState<Record<number, string>>({})
  const [fmt, setFmt] = useState<Fmt>("hex")
  const [copied, setCopied] = useState<number | null>(null)
  const [mode, setMode] = useState<"analogous" | "monochromatic" | "triad" | "tetrad" | "splitcomplement">("analogous")
  const [baseInput, setBaseInput] = useState<string>("")

  const generate = useCallback(() => {
    const fromInput = normalizeColor(baseInput || "") || undefined
    const base = fromInput || Object.values(locked)[0]
    setPalette(generatePalette({ mode, count: 5, base, locked }))
  }, [locked, baseInput, mode])

  useEffect(() => { generate() }, [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") { e.preventDefault(); generate() }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [generate])

  useEffect(() => {
    const onSetBase = (e: Event) => {
      const ce = e as CustomEvent<{ value: string }>
      setBaseInput(ce.detail?.value || "")
      generate()
    }
    const onSetMode = (e: Event) => {
      const ce = e as CustomEvent<{ value: string }>
      const m = (ce.detail?.value || "analogous") as typeof mode
      setMode(m)
      generate()
    }
    const onToggleFmt = () => setFmt((f) => (f === "hex" ? "rgb" : f === "rgb" ? "hsl" : "hex"))
    const onGenerate = () => generate()
    const onSave = () => {
      const slug = palette.map((c) => c.replace('#','')).join('-')
      const ev = new CustomEvent('save-palette', { detail: { slug, colors: palette } })
      window.dispatchEvent(ev)
    }
    const onShare = () => {
      const slug = palette.map((c) => c.replace('#','')).join('-')
      window.location.href = `/palette/${slug}`
    }
    window.addEventListener('cp:set-base', onSetBase as EventListener)
    window.addEventListener('cp:set-mode', onSetMode as EventListener)
    window.addEventListener('cp:toggle-format', onToggleFmt)
    window.addEventListener('cp:generate', onGenerate)
    window.addEventListener('cp:save', onSave)
    window.addEventListener('cp:share', onShare)
    document.addEventListener('cp:set-base', onSetBase as EventListener)
    document.addEventListener('cp:set-mode', onSetMode as EventListener)
    document.addEventListener('cp:toggle-format', onToggleFmt as EventListener)
    document.addEventListener('cp:generate', onGenerate as EventListener)
    document.addEventListener('cp:save', onSave as EventListener)
    document.addEventListener('cp:share', onShare as EventListener)
    return () => {
      window.removeEventListener('cp:set-base', onSetBase as EventListener)
      window.removeEventListener('cp:set-mode', onSetMode as EventListener)
      window.removeEventListener('cp:toggle-format', onToggleFmt)
      window.removeEventListener('cp:generate', onGenerate)
      window.removeEventListener('cp:save', onSave)
      window.removeEventListener('cp:share', onShare)
      document.removeEventListener('cp:set-base', onSetBase as EventListener)
      document.removeEventListener('cp:set-mode', onSetMode as EventListener)
      document.removeEventListener('cp:toggle-format', onToggleFmt as EventListener)
      document.removeEventListener('cp:generate', onGenerate as EventListener)
      document.removeEventListener('cp:save', onSave as EventListener)
      document.removeEventListener('cp:share', onShare as EventListener)
    }
  }, [generate, palette])

  return (
    <div className="h-[calc(100vh-3rem)] w-full grid grid-cols-5 font-sans overflow-hidden">
      {palette.map((hex, i) => {
        const text = bestText(hex)
        return (
          <button
            key={i}
            className="relative flex items-center justify-center"
            style={{ backgroundColor: hex, color: text }}
            onClick={() => {
              navigator.clipboard.writeText(hex)
              setCopied(i)
              setTimeout(() => setCopied(null), 1000)
            }}
          >
            <span
              onClick={(e) => {
                e.stopPropagation()
                const next = cycleFormat(hex, fmt)
                setFmt(next.fmt)
              }}
              className="px-3 py-1 rounded bg-black/25"
            >
              {fmt === "hex" ? hex : fmt === "rgb" ? tinycolor(hex).toRgbString() : tinycolor(hex).toHslString()}
            </span>
            <label
              className="absolute top-2 right-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                setLocked((prev) => {
                  const next = { ...prev }
                  if (next[i]) delete next[i]
                  else next[i] = hex
                  return next
                })
              }}
            >
              {locked[i] ? "🔒" : "🔓"}
            </label>
            {copied === i && (
              <span className="absolute bottom-2 text-sm">Copiado</span>
            )}
          </button>
        )
      })}
      {/* Controles movidos al nav global */}
    </div>
  )
}
