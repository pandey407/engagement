import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Smooth scrolling driven by GSAP's ticker so ScrollTrigger stays in sync.
export function startSmoothScroll() {
  const lenis = new Lenis({ lerp: 0.1 })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(tick)
    lenis.destroy()
  }
}

// Fades up every [data-reveal] element inside `root` as it scrolls into view. They start hidden via CSS
// (index.css), so nothing flashes before this runs; elements already on screen animate straight away.
export function revealOnScroll(root: HTMLElement) {
  if (prefersReducedMotion()) return () => {}
  const ctx = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
      gsap.fromTo(
        el,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } },
      )
    })
  }, root)
  return () => ctx.revert()
}

export { gsap, ScrollTrigger }
