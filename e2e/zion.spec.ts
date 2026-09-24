import { test, expect, type Locator } from '@playwright/test'

test('mundo real: mensagens digitadas, fuga desktop e acesso direto responsivo', async ({
  page
}, testInfo) => {
  test.setTimeout(120_000)
  const touch = testInfo.project.name === 'mobile'
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByRole('button', { name: 'Pílula azul', exact: true }).click()
  const originalViewport = page.viewportSize()!
  const sequence = page.getByTestId('zion-sequence')
  async function snapshot(name: string) {
    if (process.env.ZION_SCREENSHOTS)
      await page.screenshot({ path: `/tmp/world-real-${testInfo.project.name}-${name}.png` })
  }
  async function checkBounds(locator: Locator) {
    for (const [width, height] of [
      [320, 568],
      [390, 844],
      [768, 1024],
      [1024, 768],
      [1440, 900],
      [844, 390]
    ]) {
      await page.setViewportSize({ width, height })
      // Wait for the media query to update before inspecting the responsive branch.
      await expect.poll(() => page.evaluate(() => window.innerWidth)).toBe(width)
      const boxes = await locator.evaluateAll((elements) =>
        elements
          .filter((element) => element.getClientRects().length > 0)
          .map((element) => {
            const { x, y, width, height } = element.getBoundingClientRect()
            return { x, y, width, height }
          })
      )
      for (const box of boxes) {
        expect(box.x).toBeGreaterThanOrEqual(-1)
        expect(box.x + box.width).toBeLessThanOrEqual(width + 1)
        expect(box.y).toBeGreaterThanOrEqual(-1)
        expect(box.y + box.height).toBeLessThanOrEqual(height + 1)
      }
      await snapshot(`${await sequence.getAttribute('data-state')}-${width}`)
    }
    await page.setViewportSize(originalViewport)
  }
  for (let i = 1; i <= 4; i++) {
    if (i === 4) await page.emulateMedia({ reducedMotion: 'no-preference' })
    const start = page.getByRole('button', { name: 'Iniciar minigame' })
    await start.scrollIntoViewIfNeeded()
    await page.waitForTimeout(200)
    await start.click()
    if (i < 4) {
      await expect(page.getByRole('group', { name: 'Caminho entre nuvens' })).toHaveAttribute(
        'data-active',
        'false',
        { timeout: 10000 }
      )
      await expect(page.locator('[data-reality="blue"]').first()).toHaveAttribute(
        'data-corrupted',
        String(i === 3)
      )
    } else
      await expect(sequence).toHaveAttribute('data-state', 'blue-revelation-one', {
        timeout: 10000
      })
  }
  const heading = sequence.getByRole('heading')
  await expect.poll(async () => (await heading.textContent())!.length).toBeGreaterThan(0)
  expect((await heading.textContent())!.length).toBeLessThan(60)
  await snapshot('typing')
  await expect(sequence.getByText('[ PRESSIONE ENTER PARA CONTINUAR ]')).toBeAttached({
    timeout: 20000
  })
  await expect(heading).toHaveText(
    'A realidade pode ser uma coisa assustadora para algumas pessoas.'
  )
  await checkBounds(sequence.locator('h1, button'))
  if (touch) await page.getByRole('button', { name: '[ CONTINUAR ↵ ]', exact: true }).tap()
  else {
    await sequence.focus()
    await page.keyboard.press('Enter')
  }
  const nextAction = page.getByRole('button', { name: '[ IR PARA O MUNDO REAL ↵ ]', exact: true })
  await expect(sequence.getByText('[ PRESSIONE ENTER PARA CONTINUAR ]')).toBeAttached({
    timeout: 20000
  })
  await expect(heading).toHaveText('Isso não é real, e o mundo real fica em algum outro lugar.')
  await checkBounds(sequence.locator('h1, button'))
  if (touch) {
    await expect(page.getByTestId('zion-arena')).toHaveCount(0)
    await snapshot('responsive-button')
    await nextAction.tap()
  } else {
    await sequence.focus()
    await page.keyboard.press('Enter')
    const arena = page.getByTestId('zion-arena')
    await expect(arena).toHaveAttribute('data-paused', 'false')
    await expect(page.getByRole('button', { name: 'Iniciar fuga' })).toHaveCount(0)
    await expect(page.getByTestId('zion-door')).toHaveAttribute('data-open', 'false')
    await snapshot('pixel-game')
    await page.getByRole('button', { name: 'Pausar', exact: true }).click()
    await checkBounds(sequence.locator('h1, button'))
    await expect(arena).toHaveAttribute('data-paused', 'true')
    await expect
      .poll(() =>
        page.evaluate(() => {
          const screen = document
            .querySelector('[data-testid="experience-screen"]')!
            .getBoundingClientRect()
          const arena = document
            .querySelector('[data-testid="zion-arena"]')!
            .getBoundingClientRect()
          return (
            Math.abs(screen.width - arena.width) < 1 && Math.abs(screen.height - arena.height) < 1
          )
        })
      )
      .toBe(true)
    await sequence.focus()
    await page.keyboard.press('Enter')
    // A real capture and keyboard retry exercise the failure state.
    await expect(page.getByRole('button', { name: 'Tentar novamente' })).toBeVisible({
      timeout: 15000
    })
    await snapshot('caught')
    await page.keyboard.press('Enter')
    const player = page.getByTestId('zion-neon')
    async function move(key: string, attr: string, target: number, greater: boolean) {
      await page.keyboard.down(key)
      const position = expect.poll(async () => Number(await player.getAttribute(attr)), {
        intervals: [16],
        timeout: 4000
      })
      if (greater) await position.toBeGreaterThanOrEqual(target)
      else await position.toBeLessThanOrEqual(target)
      await page.keyboard.up(key)
    }
    // Check rendered poses and actual limb motion, not only player coordinates.
    for (const [key, facing, pose] of [
      ['ArrowRight', 'right', 'side'],
      ['ArrowLeft', 'left', 'side'],
      ['ArrowUp', 'up', 'back'],
      ['ArrowDown', 'down', 'front']
    ]) {
      await page.keyboard.down(key)
      await expect(player).toHaveAttribute('data-facing', facing)
      await expect(player).toHaveAttribute('data-moving', 'true')
      const visiblePose = player.locator(`[data-pose="${pose}"]`)
      await expect(visiblePose).toBeVisible()
      await expect(player.locator('[data-pose]:visible')).toHaveCount(1)
      const leg = visiblePose.locator('path[class*="leftLeg"]')
      const initial = await leg.evaluate((node) => getComputedStyle(node).transform)
      await expect
        .poll(() => leg.evaluate((node) => getComputedStyle(node).transform), {
          intervals: [30],
          timeout: 600
        })
        .not.toBe(initial)
      await page.keyboard.up(key)
      await expect(player).toHaveAttribute('data-moving', 'false')
      await expect(player).toHaveAttribute('data-facing', facing)
    }
    await move('ArrowRight', 'data-x', 62, true)
    await move('ArrowUp', 'data-y', 32, false)
    await move('ArrowLeft', 'data-x', 50, false)
    await move('ArrowUp', 'data-y', 17, false)
    await expect(page.getByTestId('zion-door')).toHaveAttribute('data-open', 'true')
    await page.waitForTimeout(350)
    await snapshot('door-open')
    await page.keyboard.down('ArrowUp')
    await expect(sequence).toHaveAttribute('data-state', 'zion-loading', { timeout: 6000 })
    await page.keyboard.up('ArrowUp')
  }
  await expect(sequence).toHaveAttribute('data-state', 'zion-loading')
  await expect(heading).toHaveText(
    'Não sabemos quem deu o primeiro golpe, se fomos nós ou eles. Mas sabemos que fomos nós que manchamos os céus.',
    { timeout: 20000 }
  )
  await snapshot('loading-message')
  await expect(page.locator('[data-reality="zion"]')).toBeVisible({ timeout: 15000 })
  await expect(page.getByRole('link', { name: 'Mundo real — início' })).toBeVisible()
  for (const [width, height] of [
    [320, 740],
    [390, 844],
    [768, 1024],
    [1024, 768],
    [1440, 900],
    [1920, 1080],
    [844, 390]
  ]) {
    await page.setViewportSize({ width, height })
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width
    )
  }
  await expect(page.locator('#projects article')).toHaveCount(4)
  expect(errors).toEqual([])
  await page.reload()
  await expect(page.locator('main[data-state="cold-boot"]')).toBeVisible()
  await expect(page.locator('[data-reality="zion"]')).toHaveCount(0)
})
