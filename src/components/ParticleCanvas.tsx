import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

interface ParticleCanvasProps {
  theme: 'light' | 'dark'
}

const PARTICLE_COUNT = 80
const CONNECTION_DISTANCE = 120
const SPEED = 0.4

function createParticles(width: number, height: number): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * SPEED * 2,
    vy: (Math.random() - 0.5) * SPEED * 2,
    radius: Math.random() * 1.5 + 1,
  }))
}

export default function ParticleCanvas({ theme }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    // getContext('2d') 对普通 canvas 元素始终返回非 null
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = canvas.offsetWidth
    let height = canvas.offsetHeight
    canvas.width = width
    canvas.height = height

    let particles = createParticles(width, height)
    let rafId = 0

    const particleColor = theme === 'dark' ? 'rgba(167,139,250,' : 'rgba(109,40,217,'
    const lineColor = theme === 'dark' ? 'rgba(167,139,250,' : 'rgba(109,40,217,'

    function draw() {
      ctx.clearRect(0, 0, width, height)

      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = particleColor + '0.7)'
        ctx.fill()
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECTION_DISTANCE) {
            const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.5
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = lineColor + opacity + ')'
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }
    }

    function tick() {
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1
      }
      draw()
      rafId = requestAnimationFrame(tick)
    }

    if (prefersReduced) {
      draw()
    } else {
      rafId = requestAnimationFrame(tick)
    }

    let resizeTimer: ReturnType<typeof setTimeout>
    function onResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        // canvas 在此闭包中已通过外层 null 守卫验证，断言安全
        const el = canvasRef.current
        if (!el) return
        width = el.offsetWidth
        height = el.offsetHeight
        el.width = width
        el.height = height
        particles = createParticles(width, height)
        if (prefersReduced) draw()
      }, 150)
    }

    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      clearTimeout(resizeTimer)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  )
}
