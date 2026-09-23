import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import * as sass from 'sass'
import sharp from 'sharp'

// Bake the existing CSS itself, not a newly designed cloud.
const css = sass.compile('scripts/assets/cloud-source.scss').css
const browser = await chromium.launch()
await mkdir('public/images/blue', { recursive: true })
try {
  for (const [name, ratio] of [['round', 2.7], ['wide', 3.4]]) {
    const width = 752
    const height = Math.round(width / ratio)
    const padding = 48
    const page = await browser.newPage({ viewport: { width: width + padding * 2, height: height + padding * 2 }, deviceScaleFactor: 2 })
    await page.setContent(`<style>${css}html,body{margin:0;background:transparent}.cloudShape{position:absolute;left:${padding}px;top:${padding}px;width:${width}px;height:${height}px;animation:none}</style><div class="cloudShape"></div>`)
    const png = await page.screenshot({ omitBackground: true })
    await sharp(png).webp({ lossless: true }).toFile(`public/images/blue/cloud-${name}.webp`)
    await page.close()
  }
} finally { await browser.close() }
