import { chromium } from '@playwright/test'
import { readFile, mkdir } from 'node:fs/promises'
import sharp from 'sharp'

const browser = await chromium.launch()
const directory = '/tmp/matrix-cloud-comparison'
await mkdir(directory, { recursive: true })
try {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 720 }]) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' })
    await page.goto(process.env.PERF_URL ?? 'http://127.0.0.1:3100')
    await page.getByRole('button', { name: 'Pílula azul' }).click()
    await page.locator('[data-reality="blue"]').first().waitFor()
    await page.evaluate(() => document.fonts.ready)
    const before = await page.screenshot({ path: `${directory}/${viewport.width}-before.png` })
    const bounds = await page.locator('main').boundingBox()
    await page.addStyleTag({ content: await readFile('/tmp/cloud-raster.css', 'utf8') })
    await page.evaluate(async () => {
      await Promise.all(['/images/blue/cloud-round.webp', '/images/blue/cloud-wide.webp'].map(async (url) => { const image = new Image(); image.src = url; await image.decode() }))
    })
    const after = await page.screenshot({ path: `${directory}/${viewport.width}-after.png` })
    const a = await sharp(before).removeAlpha().raw().toBuffer()
    const b = await sharp(after).removeAlpha().raw().toBuffer()
    let error = 0
    for (let i = 0; i < a.length; i++) error += Math.abs(a[i] - b[i])
    console.log(JSON.stringify({ width: viewport.width, meanPixelDifferencePercent: +(100 * error / (a.length * 255)).toFixed(3), layoutUnchanged: JSON.stringify(bounds) === JSON.stringify(await page.locator('main').boundingBox()) }))
    await page.close()
  }
} finally { await browser.close() }
