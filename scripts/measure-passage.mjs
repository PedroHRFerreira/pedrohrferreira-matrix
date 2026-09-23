import { chromium, devices } from '@playwright/test'
import { writeFile } from 'node:fs/promises'

const browser = await chromium.launch()
const results = []
try {
  for (const mobile of [false, true])
    for (const reality of ['red', 'blue']) {
      const context = await browser.newContext(
        mobile ? devices['Pixel 7'] : { viewport: { width: 1280, height: 900 } }
      )
      const page = await context.newPage()
      const cdp = await context.newCDPSession(page)
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(process.env.PERF_URL ?? 'http://localhost:3100')
      await page
        .getByRole('button', {
          name: reality === 'blue' ? 'Pílula azul' : 'Pílula vermelha',
          exact: true
        })
        .click({ timeout: 60000 })
      await page.emulateMedia({ reducedMotion: 'no-preference' })
      await page.waitForTimeout(6000)
      if (!mobile)
        await page
          .getByRole('group', { name: /Corredor interativo|Caminho entre nuvens/ })
          .waitFor({ timeout: 60000 })
      await page.evaluate(() =>
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })
      )
      await page.waitForTimeout(2000)
      for (const mode of mobile ? ['button'] : ['idle', 'active']) {
        for (let run = 1; run <= 3; run++) {
          if (mode === 'active') await page.getByRole('button', { name: /Explorar/ }).click()
          const measurement = page.evaluate(
            () =>
              new Promise((resolve) => {
                const frames = [],
                  tasks = []
                const observer = new PerformanceObserver((list) =>
                  tasks.push(...list.getEntries().map((e) => e.duration))
                )
                observer.observe({ type: 'longtask' })
                let start, previous
                function tick(now) {
                  start ??= now
                  if (previous) frames.push(now - previous)
                  previous = now
                  if (now - start < 1200) return requestAnimationFrame(tick)
                  observer.disconnect()
                  frames.sort((a, b) => a - b)
                  resolve({
                    fps: +((1000 * frames.length) / (now - start)).toFixed(1),
                    p95FrameMs: +frames[Math.floor(frames.length * 0.95)].toFixed(1),
                    longTasks: tasks.length,
                    longestTaskMs: Math.max(0, ...tasks)
                  })
                }
                requestAnimationFrame(tick)
              })
          )
          if (mode === 'active') {
            await page.keyboard.down('d')
            await page.waitForTimeout(1200)
            await page.keyboard.up('d')
          }
          const metrics = await measurement
          const active = mobile
            ? null
            : await page
                .getByRole('group', { name: /Corredor interativo|Caminho entre nuvens/ })
                .getAttribute('data-active')
                .catch(() => null)
          const result = { reality, mobile, mode, run, cpuSlowdown: 6, active, ...metrics }
          results.push(result)
          console.log(JSON.stringify(result))
          if (mode === 'active' && active !== 'true')
            throw new Error('Game stopped during active measurement')
          if (mode === 'active') await page.keyboard.press('Escape')
        }
        if (mode === 'active') await page.keyboard.press('Escape')
      }
      await context.close()
    }
} finally {
  await writeFile('/tmp/matrix-passage-performance.json', JSON.stringify(results, null, 2))
  await browser.close()
}
