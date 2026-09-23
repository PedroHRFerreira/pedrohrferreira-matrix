import { expect, test } from '@playwright/test'

const viewports = [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 820, height: 1180 },
  { width: 844, height: 390 },
  { width: 1024, height: 768 },
  { width: 1280, height: 720 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 }
]

for (const viewport of viewports) {
  test(`azul responsiva ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.getByRole('button', { name: 'Pílula azul' }).click()
    await expect(page.locator('[data-reality="blue"]').first()).toBeVisible()
    const nav = page.getByRole('navigation', { name: 'Navegação principal' })
    const links = nav.getByRole('link')
    for (const link of await links.all()) {
      const box = await link.boundingBox()
      expect(box).not.toBeNull()
      expect(box!.x).toBeGreaterThanOrEqual(0)
      expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width + 1)
    }
    await page.screenshot({ path: testInfo.outputPath('hero.png') })
    for (const section of [
      '[data-section="hero"]',
      '#about',
      '#projects',
      '#experience',
      '#stack',
      '#contact',
      'footer'
    ]) {
      const element = page.locator(section)
      await element.scrollIntoViewIfNeeded()
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        viewport.width
      )
      const clipped = await element.evaluate((root) =>
        Array.from(root.querySelectorAll('h1,h2,h3,p,li,a,button,summary'))
          .filter((node) => {
            const box = node.getBoundingClientRect()
            return (
              box.width > 0 &&
              (box.left < -1 ||
                box.right > innerWidth + 1 ||
                node.scrollWidth > node.clientWidth + 2)
            )
          })
          .map((node) => ({
            text: node.textContent?.slice(0, 80),
            width: node.clientWidth,
            scroll: node.scrollWidth
          }))
      )
      expect(clipped, section).toEqual([])
    }
    await page.locator('#projects').scrollIntoViewIfNeeded()
    await page.screenshot({ path: testInfo.outputPath('projects.png') })
    await page.getByRole('button', { name: 'Ver detalhes de Rods SDK' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    const bounds = await dialog.boundingBox()
    expect(bounds!.x).toBeGreaterThanOrEqual(0)
    expect(bounds!.width).toBeLessThanOrEqual(viewport.width)
    expect(bounds!.height).toBeLessThanOrEqual(viewport.height)
    expect(
      await dialog.evaluate((node) => node.scrollWidth - node.clientWidth)
    ).toBeLessThanOrEqual(1)
    await dialog.getByRole('button', { name: 'Próximo →' }).click()
    await expect(dialog).toContainText('ERP EMPI Autocenter')
    await page.screenshot({ path: testInfo.outputPath('dialog.png') })
    await dialog.getByRole('button', { name: 'Fechar detalhes' }).click()
    await expect(dialog).not.toBeVisible()
  })
}

for (const viewport of [
  { width: 1024, height: 600 },
  { width: 1280, height: 720 },
  { width: 1440, height: 900 }
]) {
  test(`galerias com movimento ${viewport.width}x${viewport.height}`, async ({
    page
  }, testInfo) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.getByRole('button', { name: 'Pílula azul' }).waitFor()
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.getByRole('button', { name: 'Pílula azul' }).click()
    await expect(page.locator('[data-reality="blue"]').first()).toBeVisible()
    await expect(page.locator('[data-black-cat]')).toHaveAttribute('data-cat-pass', 'arrival')
    await expect(page.locator('[data-black-cat]')).toBeHidden({ timeout: 10000 })
    for (const id of ['projects', 'stack']) {
      const section = page.locator(`#${id}`)
      await section.evaluate((node) => node.scrollIntoView({ block: 'start', behavior: 'instant' }))
      const stage = section.locator('[data-horizontal-stage]')
      const stageBox = await stage.boundingBox()
      expect(stageBox!.height, `${id}: altura da galeria`).toBeLessThanOrEqual(viewport.height + 1)
      await expect(stage.getByRole('heading', { level: 2 })).toBeInViewport()
      await expect(stage.locator('article').first()).toBeInViewport()
      await page.screenshot({ path: testInfo.outputPath(`${id}.png`) })
    }
  })
}

for (const viewport of [
  { width: 390, height: 844 },
  { width: 820, height: 1180 },
  { width: 1280, height: 720 }
]) {
  test(`menu alcança seções ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.getByRole('button', { name: 'Pílula azul' }).waitFor()
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.getByRole('button', { name: 'Pílula azul' }).click()
    await expect(page.locator('[data-reality="blue"]').first()).toBeVisible()
    await expect(page.locator('[data-black-cat]')).toHaveAttribute('data-cat-pass', 'arrival')
    await expect(page.locator('[data-black-cat]')).toBeHidden({ timeout: 10000 })
    const nav = page.getByRole('navigation', { name: 'Navegação principal' })
    for (const [id, label] of [
      ['about', 'Sobre'],
      ['projects', 'Projetos'],
      ['experience', 'Trajetória'],
      ['stack', 'Stack'],
      ['contact', 'Contato']
    ]) {
      await nav.getByRole('link', { name: label, exact: true }).click()
      const heading = page.locator(`#${id}`).getByRole('heading', { level: 2 })
      await expect(heading).toBeInViewport({ timeout: 7000 })
      await expect
        .poll(async () => {
          const title = await heading.boundingBox()
          const menu = await nav.boundingBox()
          return title!.y - (menu!.y + menu!.height)
        })
        .toBeGreaterThanOrEqual(0)
    }
  })
}
