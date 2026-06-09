'use client'

import { Suspense, lazy, useEffect, useRef, useState } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
  mouseTracking?: boolean
}

export function SplineScene({ scene, className, mouseTracking }: SplineSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [splineReady, setSplineReady] = useState(false)

  useEffect(() => {
    if (!mouseTracking) return

    const forward = (e: PointerEvent) => {
      const container = containerRef.current
      if (!container) return
      const targets = [
        container.querySelector('canvas'),
        container.querySelector('canvas')?.parentElement,
        container,
      ].filter(Boolean) as Element[]

      const evt = new PointerEvent('pointermove', {
        clientX: e.clientX,
        clientY: e.clientY,
        screenX: e.screenX,
        screenY: e.screenY,
        movementX: e.movementX,
        movementY: e.movementY,
        pointerId: e.pointerId ?? 1,
        pointerType: e.pointerType ?? 'mouse',
        isPrimary: true,
        bubbles: false,
        cancelable: true,
      })
      for (const target of targets) {
        if (e.target === target) continue
        target.dispatchEvent(evt)
      }
    }

    window.addEventListener('pointermove', forward, { passive: true })
    return () => window.removeEventListener('pointermove', forward)
  }, [mouseTracking])

  return (
    <div ref={containerRef} className={`relative ${className ?? ''}`}>
      {/* Spline — fade in quando pronto, DPR limitado no mobile */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: splineReady ? 1 : 0 }}
      >
        <Suspense fallback={null}>
          <Spline
            scene={scene}
            onLoad={(app) => {
              // Limita resolução no mobile para economizar GPU
              if (window.innerWidth < 768) {
                try { (app as any).setPixelRatio(0.5); } catch {}
              }
              setSplineReady(true);
            }}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </Suspense>
      </div>
    </div>
  )
}
