"use client"

import { useEffect, useRef } from "react"

interface Vector2D {
  x: number
  y: number
}

class Particle {
  pos: Vector2D = { x: 0, y: 0 }
  vel: Vector2D = { x: 0, y: 0 }
  acc: Vector2D = { x: 0, y: 0 }
  target: Vector2D = { x: 0, y: 0 }

  closeEnoughTarget = 100
  maxSpeed = 1.0
  maxForce = 0.1
  particleSize = 10
  isKilled = false

  startColor = { r: 0, g: 0, b: 0 }
  targetColor = { r: 0, g: 0, b: 0 }
  colorWeight = 0
  colorBlendRate = 0.01

  move() {
    let proximityMult = 1
    const distance = Math.sqrt(
      Math.pow(this.pos.x - this.target.x, 2) + Math.pow(this.pos.y - this.target.y, 2)
    )
    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget
    }

    const towardsTarget = {
      x: this.target.x - this.pos.x,
      y: this.target.y - this.pos.y,
    }
    const magnitude = Math.sqrt(towardsTarget.x ** 2 + towardsTarget.y ** 2)
    if (magnitude > 0) {
      towardsTarget.x = (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult
      towardsTarget.y = (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult
    }

    const steer = { x: towardsTarget.x - this.vel.x, y: towardsTarget.y - this.vel.y }
    const steerMag = Math.sqrt(steer.x ** 2 + steer.y ** 2)
    if (steerMag > 0) {
      steer.x = (steer.x / steerMag) * this.maxForce
      steer.y = (steer.y / steerMag) * this.maxForce
    }

    this.acc.x += steer.x
    this.acc.y += steer.y
    this.vel.x += this.acc.x
    this.vel.y += this.acc.y
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.acc.x = 0
    this.acc.y = 0
  }

  draw(ctx: CanvasRenderingContext2D, drawAsPoints: boolean) {
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0)
    }
    const c = {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
    }
    ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`
    if (drawAsPoints) {
      ctx.fillRect(this.pos.x, this.pos.y, 2, 2)
    } else {
      ctx.beginPath()
      ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  kill(width: number, height: number) {
    if (!this.isKilled) {
      const randomPos = this._randomPos(width / 2, height / 2, (width + height) / 2)
      this.target.x = randomPos.x
      this.target.y = randomPos.y
      this.startColor = {
        r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
      }
      this.targetColor = { r: 0, g: 0, b: 0 }
      this.colorWeight = 0
      this.isKilled = true
    }
  }

  private _randomPos(x: number, y: number, mag: number): Vector2D {
    const rx = Math.random() * 1000
    const ry = Math.random() * 300
    const dir = { x: rx - x, y: ry - y }
    const m = Math.sqrt(dir.x ** 2 + dir.y ** 2)
    if (m > 0) { dir.x = (dir.x / m) * mag; dir.y = (dir.y / m) * mag }
    return { x: x + dir.x, y: y + dir.y }
  }
}

interface ParticleTextEffectProps {
  words?: string[]
  /** Tailwind/CSS color for the canvas background blend — default transparent over dark bg */
  className?: string
}

// ATom's brand gold: hsl(38 33% 70%) ≈ rgb(200,184,154)
const GOLD = { r: 200, g: 184, b: 154 }
// Lighter gold accent
const GOLD_LIGHT = { r: 220, g: 200, b: 160 }
// White for contrast words
const WHITE = { r: 240, g: 238, b: 232 }

const PALETTE = [GOLD, GOLD_LIGHT, WHITE, GOLD]

export function ParticleTextEffect({ words = ["ATOMS"], className = "" }: ParticleTextEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const frameRef = useRef(0)
  const wordIdxRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0, isPressed: false, isRight: false })
  const paletteIdxRef = useRef(0)

  const PIXEL_STEPS = 5
  const DRAW_AS_POINTS = true
  const WORD_INTERVAL = 210 // frames ~3.5s at 60fps

  const randomPos = (x: number, y: number, mag: number): Vector2D => {
    const rx = Math.random() * 1000
    const ry = Math.random() * 300
    const dir = { x: rx - x, y: ry - y }
    const m = Math.sqrt(dir.x ** 2 + dir.y ** 2)
    if (m > 0) { dir.x = (dir.x / m) * mag; dir.y = (dir.y / m) * mag }
    return { x: x + dir.x, y: y + dir.y }
  }

  const showWord = (word: string, canvas: HTMLCanvasElement) => {
    const off = document.createElement("canvas")
    off.width = canvas.width
    off.height = canvas.height
    const octx = off.getContext("2d")!

    // Responsive font size
    const fontSize = Math.min(canvas.width / (word.length * 0.65), canvas.height * 0.55)
    octx.fillStyle = "white"
    octx.font = `700 ${fontSize}px 'Cormorant Garamond', Georgia, serif`
    octx.textAlign = "center"
    octx.textBaseline = "middle"
    octx.fillText(word, canvas.width / 2, canvas.height / 2)

    const imageData = octx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data

    const newColor = PALETTE[paletteIdxRef.current % PALETTE.length]
    paletteIdxRef.current++

    const particles = particlesRef.current
    let pIdx = 0

    const coordsIdx: number[] = []
    for (let i = 0; i < pixels.length; i += PIXEL_STEPS * 4) coordsIdx.push(i)
    // shuffle
    for (let i = coordsIdx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[coordsIdx[i], coordsIdx[j]] = [coordsIdx[j], coordsIdx[i]]
    }

    for (const ci of coordsIdx) {
      if (pixels[ci + 3] > 0) {
        const x = (ci / 4) % canvas.width
        const y = Math.floor(ci / 4 / canvas.width)
        let p: Particle

        if (pIdx < particles.length) {
          p = particles[pIdx]
          p.isKilled = false
          pIdx++
        } else {
          p = new Particle()
          const rp = randomPos(canvas.width / 2, canvas.height / 2, (canvas.width + canvas.height) / 2)
          p.pos.x = rp.x
          p.pos.y = rp.y
          p.maxSpeed = Math.random() * 5 + 3
          p.maxForce = p.maxSpeed * 0.05
          p.particleSize = Math.random() * 4 + 4
          p.colorBlendRate = Math.random() * 0.025 + 0.003
          particles.push(p)
        }

        p.startColor = {
          r: p.startColor.r + (p.targetColor.r - p.startColor.r) * p.colorWeight,
          g: p.startColor.g + (p.targetColor.g - p.startColor.g) * p.colorWeight,
          b: p.startColor.b + (p.targetColor.b - p.startColor.b) * p.colorWeight,
        }
        p.targetColor = newColor
        p.colorWeight = 0
        p.target.x = x
        p.target.y = y
      }
    }

    for (let i = pIdx; i < particles.length; i++) particles[i].kill(canvas.width, canvas.height)
  }

  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    const particles = particlesRef.current

    // Dark fade — matches hsl(0 0% 4%) ≈ #0a0a0a with slight trail
    ctx.fillStyle = "rgba(10, 10, 10, 0.18)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.move()
      p.draw(ctx, DRAW_AS_POINTS)
      if (p.isKilled && (p.pos.x < 0 || p.pos.x > canvas.width || p.pos.y < 0 || p.pos.y > canvas.height)) {
        particles.splice(i, 1)
      }
    }

    if (mouseRef.current.isPressed && mouseRef.current.isRight) {
      particles.forEach(p => {
        const d = Math.sqrt((p.pos.x - mouseRef.current.x) ** 2 + (p.pos.y - mouseRef.current.y) ** 2)
        if (d < 60) p.kill(canvas.width, canvas.height)
      })
    }

    frameRef.current++
    if (frameRef.current % WORD_INTERVAL === 0) {
      wordIdxRef.current = (wordIdxRef.current + 1) % words.length
      showWord(words[wordIdxRef.current], canvas)
    }

    rafRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const setSize = () => {
      const w = canvas.parentElement?.clientWidth || 800
      canvas.width = w
      canvas.height = Math.round(w * 0.3)
      showWord(words[wordIdxRef.current], canvas)
    }

    setSize()
    window.addEventListener("resize", setSize)
    animate()

    const onDown = (e: MouseEvent) => {
      mouseRef.current.isPressed = true
      mouseRef.current.isRight = e.button === 2
      const r = canvas.getBoundingClientRect()
      const scaleX = canvas.width / r.width
      const scaleY = canvas.height / r.height
      mouseRef.current.x = (e.clientX - r.left) * scaleX
      mouseRef.current.y = (e.clientY - r.top) * scaleY
    }
    const onUp = () => { mouseRef.current.isPressed = false; mouseRef.current.isRight = false }
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      const scaleX = canvas.width / r.width
      const scaleY = canvas.height / r.height
      mouseRef.current.x = (e.clientX - r.left) * scaleX
      mouseRef.current.y = (e.clientY - r.top) * scaleY
    }
    const onContext = (e: MouseEvent) => e.preventDefault()

    canvas.addEventListener("mousedown", onDown)
    canvas.addEventListener("mouseup", onUp)
    canvas.addEventListener("mousemove", onMove)
    canvas.addEventListener("contextmenu", onContext)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", setSize)
      canvas.removeEventListener("mousedown", onDown)
      canvas.removeEventListener("mouseup", onUp)
      canvas.removeEventListener("mousemove", onMove)
      canvas.removeEventListener("contextmenu", onContext)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full block ${className}`}
      style={{ background: "transparent" }}
    />
  )
}
