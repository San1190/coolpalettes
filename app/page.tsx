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
