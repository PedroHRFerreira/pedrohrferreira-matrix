import { test, expect } from '@playwright/test'

test('Blue accumulates corruption after every capture and retains it while paused', async ({
  page
}, info) => {
  test.setTimeout(90000)
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByRole('button', { name: 'Pílula azul', exact: true }).click()
  const shell = page.locator('[data-corruption-level]')
  await expect(shell).toHaveAttribute('data-corruption-percent', '0')
  for (let level = 1; level <= 3; level++) {
    const start = page.getByRole('button', { name: 'Iniciar minigame' })
    await start.scrollIntoViewIfNeeded()
    // Let scrolling settle: the game intentionally exits on scroll.
    await page.waitForTimeout(300)
    await start.click()
    await expect(shell).toHaveAttribute('data-corruption-level', String(level), { timeout: 15000 })
    await expect(shell).toHaveAttribute('data-corruption-percent', String([0, 15, 40, 85][level]))
    await expect(shell).toHaveAttribute('data-effects-paused', 'true')
    await expect(shell).toHaveAttribute('data-corruption-level', String(level))
    await page.getByRole('button', { name: 'Retomar efeitos' }).click()
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width
      )
    }
    await page.setViewportSize({ width: info.project.name === 'mobile' ? 390 : 1440, height: 900 })
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.screenshot({ path: `/tmp/blue-${info.project.name}-${level}.png` })
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.waitForTimeout(4500)
    await page.screenshot({ path: `/tmp/blue-${info.project.name}-${level}-motion.png` })
    await page.emulateMedia({ reducedMotion: 'reduce' })
  }
  const finalStart = page.getByRole('button', { name: 'Iniciar minigame' })
  await finalStart.scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)
  await finalStart.click()
  await expect(page.getByTestId('zion-sequence')).toHaveAttribute(
    'data-state',
    'blue-revelation-one',
    { timeout: 15000 }
  )
  expect(errors).toEqual([])
  await page.reload()
  await page.getByRole('button', { name: 'Pílula azul', exact: true }).click()
  await expect(page.locator('[data-corruption-level]')).toHaveAttribute(
    'data-corruption-percent',
    '0'
  )
})
