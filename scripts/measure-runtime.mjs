import { chromium } from '@playwright/test'
import { readFile, writeFile } from 'node:fs/promises'

// Run against `npm run build` + `npm run start -- --port 3100`.
// CPU throttling is relative to the host; this does not emulate a weak GPU.
const browser = await chromium.launch()
const results = []
try {
  for (const reality of (process.env.PERF_REALITIES ?? 'blue,red').split(',')) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const page = await context.newPage()
    const session = await context.newCDPSession(page)
    await session.send('Emulation.setCPUThrottlingRate', { rate: 6 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(process.env.PERF_URL ?? 'http://127.0.0.1:3100')
    const pill = page.getByRole('button', {
      name: reality === 'blue' ? 'Pílula azul' : 'Pílula vermelha'
    })
    await pill.waitFor()
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await pill.click()
    await page.locator(`[data-reality="${reality}"]`).first().waitFor()
    if (process.env.PERF_CSS) await page.addStyleTag({ content: await readFile(process.env.PERF_CSS, 'utf8') })
    await page.waitForTimeout(5500)
    const metrics = await page.evaluate(
      () =>
        new Promise((resolve) => {
          let start = 0
          let previous = 0
          const frames = []
          const tasks = []
          const observer = new PerformanceObserver((list) =>
            tasks.push(...list.getEntries().map((entry) => entry.duration))
          )
          observer.observe({ type: 'longtask', buffered: false })
          const tick = (time) => {
            if (!start) start = time
            if (previous) frames.push(time - previous)
            previous = time
            const progress = Math.min(1, (time - start) / 10000)
            window.scrollTo({
              top: (document.documentElement.scrollHeight - innerHeight) * progress,
              behavior: 'instant'
            })
            if (progress < 1) requestAnimationFrame(tick)
            else {
              observer.disconnect()
              frames.sort((a, b) => a - b)
              resolve({
                fps: +((1000 * frames.length) / (time - start)).toFixed(1),
                p95FrameMs: +frames[Math.floor(frames.length * 0.95)].toFixed(1),
                longTasks: tasks.length,
                longestTaskMs: +Math.max(0, ...tasks).toFixed(1)
              })
            }
          }
          requestAnimationFrame(tick)
        })
    )
    results.push({ reality, cpuSlowdown: 6, ...metrics })
    console.log(JSON.stringify(results.at(-1)))
    await context.close()
  }
  await writeFile(
    process.env.PERF_OUTPUT ?? '/tmp/matrix-runtime.json',
    JSON.stringify({ measuredAt: new Date().toISOString(), results }, null, 2)
  )
} finally {
  await browser.close()
}
