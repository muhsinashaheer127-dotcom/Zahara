import { useEffect, useRef } from 'react'

const GoldParticles = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let W = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth)
    let H = (canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight)

    const COLORS = ['#D4AF37', '#F3E5AB', '#B8941F', '#E8C547', '#FFFFFF']
    const count = 50

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.6,
      dx: (Math.random() - 0.5) * 0.35,
      dy: -(Math.random() * 0.45 + 0.15),
      alpha: Math.random() * 0.65 + 0.25,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      pulse: Math.random() * Math.PI * 2,
    }))

    let raf
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      particles.forEach((p) => {
        p.pulse += 0.018
        const alphaMod = p.alpha + Math.sin(p.pulse) * 0.2
        ctx.save()
        ctx.globalAlpha = Math.max(0.1, Math.min(0.95, alphaMod))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.restore()

        p.x += p.dx
        p.y += p.dy
        if (p.y < -10) {
          p.y = H + 10
          p.x = Math.random() * W
        }
        if (p.x < -10) p.x = W + 10
        if (p.x > W + 10) p.x = -10
      })
      raf = requestAnimationFrame(draw)
    }
    draw()

    const onResize = () => {
      if (!canvas || !canvas.parentElement) return
      W = canvas.width = canvas.parentElement.offsetWidth
      H = canvas.height = canvas.parentElement.offsetHeight
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-70"
      aria-hidden="true"
    />
  )
}

export default GoldParticles
