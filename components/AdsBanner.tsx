"use client"
import { useEffect } from "react"

export default function AdsBanner() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT
  if (!client || !slot) return null
  useEffect(() => {
    try {
      // @ts-expect-error Adsbygoogle is injected by AdSense script
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [])
  return (
    <div className="fixed left-64 right-0 bottom-0 z-40">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}