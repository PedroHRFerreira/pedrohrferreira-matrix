'use client'

import { useEffect, type RefObject } from 'react'

// Keep the atmospheric layer behind the page. Hit-testing in viewport space lets
// empty sky respond without placing an invisible surface over links or text.
export function useCloudPull(fieldRef: RefObject<HTMLDivElement | null>, reduced: boolean) {
  useEffect(() => {
    const field = fieldRef.current
    if (!field || reduced || !matchMedia('(pointer: fine)').matches) return
    const clouds = Array.from(field.querySelectorAll<HTMLElement>('[data-cloud]')).map((node) => ({
      node,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      tx: 0,
      ty: 0
    }))
    let held: (typeof clouds)[number] | undefined
    let originX = 0
    let originY = 0
    let frame = 0
    let previousTime = 0
    const tick = (time: number) => {
      const dt = Math.min((time - (previousTime || time - 16.67)) / 16.67, 2)
      previousTime = time
      let moving = false
      for (const cloud of clouds) {
        cloud.vx = (cloud.vx + (cloud.tx - cloud.x) * 0.025 * dt) * Math.pow(0.79, dt)
        cloud.vy = (cloud.vy + (cloud.ty - cloud.y) * 0.025 * dt) * Math.pow(0.79, dt)
        cloud.x += cloud.vx * dt
        cloud.y += cloud.vy * dt
        const settling =
          Math.abs(cloud.tx - cloud.x) +
            Math.abs(cloud.ty - cloud.y) +
            Math.abs(cloud.vx) +
            Math.abs(cloud.vy) >
          0.15
        moving ||= settling
        cloud.node.style.setProperty('--pull-x', `${cloud.x.toFixed(2)}px`)
        cloud.node.style.setProperty('--pull-y', `${cloud.y.toFixed(2)}px`)
        if (!settling && cloud !== held) delete cloud.node.dataset.held
      }
      frame = moving ? requestAnimationFrame(tick) : 0
      if (!moving) previousTime = 0
    }
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }
    const hit = (event: PointerEvent) => {
      if (
        !(event.target instanceof Element) ||
        event.target.closest(
          'a, button, input, textarea, select, summary, [role="dialog"], p, h1, h2, h3, article'
        )
      )
        return
      return clouds.find(({ node }) => {
        const rect = node.getBoundingClientRect()
        // Restrict grabbing to the visible, denser center of the cloud.
        return (
          rect.width > 0 &&
          event.clientX > rect.left + rect.width * 0.15 &&
          event.clientX < rect.right - rect.width * 0.15 &&
          event.clientY > rect.top + rect.height * 0.2 &&
          event.clientY < rect.bottom
        )
      })
    }
    const down = (event: PointerEvent) => {
      if (
        event.button !== 0 ||
        event.pointerType === 'touch' ||
        field.closest('[data-fault="active"]')
      )
        return
      held = hit(event)
      if (!held) return
      event.preventDefault()
      originX = event.clientX - held.x
      originY = event.clientY - held.y
      held.node.dataset.held = 'true'
      field.dataset.pulling = 'true'
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      if (held) {
        // Elastic resistance builds as the cloud is stretched away from its path.
        held.tx = 260 * Math.tanh((event.clientX - originX) / 300)
        held.ty = 180 * Math.tanh((event.clientY - originY) / 240)
      } else {
        const near = hit(event)
        for (const cloud of clouds) {
          const rect = cloud.node.getBoundingClientRect()
          cloud.tx = cloud === near ? (event.clientX - rect.left - rect.width / 2) * 0.16 : 0
          cloud.ty = cloud === near ? (event.clientY - rect.top - rect.height / 2) * 0.18 : 0
        }
      }
      wake()
    }
    const release = () => {
      held = undefined
      delete field.dataset.pulling
      for (const cloud of clouds) {
        cloud.tx = 0
        cloud.ty = 0
      }
      wake()
    }
    const visibility = () => {
      if (document.hidden) release()
    }
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    window.addEventListener('blur', release)
    window.addEventListener('scroll', release, { passive: true })
    document.addEventListener('visibilitychange', visibility)
    document.documentElement.addEventListener('mouseleave', release)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
      window.removeEventListener('blur', release)
      window.removeEventListener('scroll', release)
      document.removeEventListener('visibilitychange', visibility)
      document.documentElement.removeEventListener('mouseleave', release)
      delete field.dataset.pulling
      for (const cloud of clouds) {
        delete cloud.node.dataset.held
        cloud.node.style.removeProperty('--pull-x')
        cloud.node.style.removeProperty('--pull-y')
      }
    }
  }, [fieldRef, reduced])
}
