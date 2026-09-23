import { expect, test, type Page } from '@playwright/test'

const REALITY_TIMEOUT = 10_000

async function openFreshExperience(page: Page) {
  await page.goto('/')
}

async function openReality(
  page: Page,
  reality: 'red' | 'blue',
  motionAfterChoice: 'reduce' | 'no-preference' = 'no-preference'
) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('main[data-state="pill-selection"]')).toBeVisible({
    timeout: REALITY_TIMEOUT
  })
  await page.emulateMedia({ reducedMotion: motionAfterChoice })
  const label = reality === 'red' ? 'Pílula vermelha' : 'Pílula azul'
  await page.getByRole('button', { name: label }).click()
  await expect(page.locator(`[data-reality="${reality}"]`).first()).toBeVisible({
    timeout: REALITY_TIMEOUT
  })
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
})

test('mantém a introdução obrigatória e publica o conteúdo profissional em português', async ({
  page
}) => {
  await openFreshExperience(page)
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR')
  await expect(page.locator('main[data-state="cold-boot"]')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Pular introdução' })).toHaveCount(0)
  await openReality(page, 'red')

  await expect(
    page.getByRole('heading', { level: 1, name: 'Pedro Henrique Rodrigues', exact: true })
  ).toBeVisible()
  await expect(
    page
      .locator('[data-section="hero"]')
      .getByText(/Engenheiro de Software Full Stack/)
      .first()
  ).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toContainText(
    'PROJETOS'
  )
  await expect(page.getByRole('button', { name: /^(EN|PT)$/ })).toHaveCount(0)

  const resume = page
    .locator('[data-section="hero"]')
    .getByRole('link', { name: 'Baixar meu currículo' })
  await expect(resume).toHaveAttribute('href', '/curriculo-pedro.pdf')
  const response = await page.request.get('/curriculo-pedro.pdf')
  expect(response.ok()).toBeTruthy()
  expect(response.headers()['content-type']).toContain('application/pdf')
})

test('reinicia toda a experiência após atualizar a página', async ({ page }) => {
  await openReality(page, 'blue')
  await page.reload()
  await expect(page.locator('main[data-state="cold-boot"]')).toBeVisible()
  await expect(page.locator('[data-reality="blue"]')).toHaveCount(0)
})

test('a escolha e o salto para conteúdo funcionam por teclado', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openFreshExperience(page)
  await expect(page.locator('main[data-state="pill-selection"]')).toBeVisible({
    timeout: REALITY_TIMEOUT
  })

  const redPill = page.getByRole('button', { name: 'Pílula vermelha' })
  await redPill.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('[data-reality="red"]').first()).toBeVisible({
    timeout: REALITY_TIMEOUT
  })

  const skipLink = page.getByRole('link', { name: 'Ir para o conteúdo' })
  await expect(skipLink).toHaveCount(1)
  await skipLink.focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#main-content$/)
})

test('a trajetória e os comandos Matrix respondem à navegação', async ({ page }) => {
  await openReality(page, 'red')

  await page.locator('#experience').scrollIntoViewIfNeeded()
  await expect(page.getByRole('heading', { name: 'Desenvolvedor Full Stack' })).toBeVisible()

  await page.getByRole('button', { name: 'Como ele constrói?' }).click()
  await expect(page.locator('[aria-labelledby="dialogue-title"]')).toContainText(
    'sistemas modulares'
  )
})

test('a timeline mostra os três marcos em ordem antes dos projetos', async ({ page }) => {
  await openReality(page, 'red')
  const milestones = page.locator('#experience ol > li')
  await expect(milestones).toHaveCount(3)

  for (const [index, heading] of [
    [0, 'Engenheiro de Software'],
    [1, 'Desenvolvedor Full Stack'],
    [2, 'Curador Front-end']
  ] as const) {
    await milestones.nth(index).scrollIntoViewIfNeeded()
    await expect(milestones.nth(index).getByRole('heading', { name: heading })).toBeVisible()
  }

  await page.locator('#projects').scrollIntoViewIfNeeded()
  await expect(page).toHaveURL(/#projects$/)
})

test('projetos e stack atravessam na horizontal com o scroll vertical', async ({ page }) => {
  await openReality(page, 'red')
  for (const [id, direction] of [
    ['projects', 'left'],
    ['stack', 'right']
  ] as const) {
    const gallery = page.locator(`#${id}`)
    await expect(gallery).toHaveAttribute('data-enhanced', 'true')
    await gallery.scrollIntoViewIfNeeded()
    await expect(gallery.locator('[data-horizontal-stage]')).toBeInViewport()
    const cards = gallery.locator('article')
    await expect(cards).toHaveCount(4)
    const firstLeft = await cards
      .first()
      .evaluate((element) => element.getBoundingClientRect().left)
    await page.mouse.wheel(0, 650)
    if (direction === 'left') {
      await expect
        .poll(() => cards.first().evaluate((element) => element.getBoundingClientRect().left))
        .toBeLessThan(firstLeft)
    } else {
      await expect
        .poll(() => cards.first().evaluate((element) => element.getBoundingClientRect().left))
        .toBeGreaterThan(firstLeft)
    }
  }
})

test('movimento reduzido mantém as duas galerias em fluxo vertical legível', async ({ page }) => {
  await openReality(page, 'red', 'reduce')
  for (const id of ['projects', 'stack']) {
    const gallery = page.locator(`#${id}`)
    await expect(gallery).not.toHaveAttribute('data-enhanced', 'true')
    await expect(gallery.locator('article')).toHaveCount(4)
    await expect(gallery.locator('article').last()).toBeVisible()
  }
})

test('pílula azul mantém nuvens e projetos visíveis em mobile com movimento reduzido', async ({
  page
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openReality(page, 'blue', 'reduce')

  const visibleClouds = await page
    .locator('[data-reality="blue"] [class*="cloudPosition"]')
    .evaluateAll(
      (clouds) =>
        clouds.filter((cloud) => {
          const rect = cloud.getBoundingClientRect()
          return (
            rect.right > 0 && rect.left < innerWidth && rect.bottom > 0 && rect.top < innerHeight
          )
        }).length
    )
  expect(visibleClouds).toBeGreaterThanOrEqual(3)
  await expect(page.locator('#projects article')).toHaveCount(4)
  await expect(page.locator('#projects')).not.toHaveAttribute('data-enhanced', 'true')
  await expect(page.locator('#stack')).not.toHaveAttribute('data-enhanced', 'true')
  expect(
    await page.locator('main#main-content').evaluate((main) => getComputedStyle(main).rowGap)
  ).toBe('48px')
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
})

test('pílula azul alterna leitura vertical e duas travessias horizontais no desktop', async ({
  page
}, testInfo) => {
  test.skip(testInfo.project.name === 'mobile')
  await openReality(page, 'blue')
  for (const [id, direction] of [
    ['projects', 'left'],
    ['stack', 'right']
  ] as const) {
    const gallery = page.locator(`#${id}`)
    await expect(gallery).toHaveAttribute('data-enhanced', 'true')
    await gallery.scrollIntoViewIfNeeded()
    await expect(gallery.locator('[data-horizontal-stage]')).toBeInViewport()
    const first = gallery.locator('article').first()
    const before = await first.evaluate((element) => element.getBoundingClientRect().left)
    await page.mouse.wheel(0, 650)
    if (direction === 'left') {
      await expect
        .poll(() => first.evaluate((element) => element.getBoundingClientRect().left))
        .toBeLessThan(before)
    } else {
      await expect
        .poll(() => first.evaluate((element) => element.getBoundingClientRect().left))
        .toBeGreaterThan(before)
    }
  }
})

test('carrega as duas realidades sem erros de console', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))

  await openReality(page, 'red')
  await expect(page.getByRole('heading', { name: 'Rods SDK' })).toBeVisible()
  await openReality(page, 'blue')
  await expect(
    page.getByRole('heading', { name: 'Pedro Henrique Rodrigues', exact: true })
  ).toBeVisible()
  expect(errors).toEqual([])
})

test('código descendente acompanha a tela e a preferência de movimento em tempo real', async ({
  page
}) => {
  await openReality(page, 'blue')
  const beams = page.locator('[data-reality="blue"] [class*="codeColumn"]:visible')
  for (const [width, count] of [
    [1440, 1],
    [1024, 1],
    [390, 1]
  ] as const) {
    await page.setViewportSize({ width, height: 900 })
    await expect(beams).toHaveCount(count)
  }
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(beams).toHaveCount(0)
  await expect(page.locator('h1')).toBeVisible()
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(beams).toHaveCount(1)
})

test('modal navega entre projetos, contém foco e restaura o acionador', async ({ page }) => {
  await openReality(page, 'blue', 'reduce')
  const trigger = page.getByRole('button', { name: 'Ver detalhes de Rods SDK' })
  await trigger.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('heading', { name: 'Rods SDK', exact: true })).toBeVisible()
  await dialog.getByRole('button', { name: 'Próximo' }).click()
  await expect(dialog.getByRole('heading', { name: 'ERP EMPI Autocenter' })).toBeVisible()
  await page.keyboard.press('Tab')
  await expect
    .poll(() => page.evaluate(() => Boolean(document.activeElement?.closest('dialog'))))
    .toBe(true)
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await trigger.click()
  await dialog.getByRole('button', { name: 'Fechar detalhes' }).click()
  await expect(dialog).toHaveCount(0)
})

test('teclado alcança cards fora da tela na galeria horizontal', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile')
  await openReality(page, 'blue')
  await page.keyboard.press('Tab')
  const details = page.getByRole('button', { name: 'Ver detalhes de Rods Themes' })
  await details.focus()
  await expect(details).toBeInViewport()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('dialog')).toContainText('Rods Themes')
  await page.keyboard.press('Escape')
  await expect(details).toBeFocused()
})

test('visual onírico não mostra filtros, números decorativos ou esferas', async ({ page }) => {
  await openReality(page, 'blue', 'reduce')
  await expect(
    page.locator('#projects input, #projects select, #stack input, #stack select')
  ).toHaveCount(0)
  await expect(page.locator('#projects article')).toHaveCount(4)
  await expect(page.locator('#stack article')).toHaveCount(4)
  await expect(
    page.locator(
      '[class*="sceneNumber"], [class*="projectPlaceholder"], [class*="aboutOrb"], [class*="halo"]'
    )
  ).toHaveCount(0)
  await expect(page.locator('[class*="codeColumn"]').first()).toHaveText(/^[01\s]+$/)
})

test('menu red mostra todos os links em 320 px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 })
  await openReality(page, 'red', 'reduce')
  const links = page.getByRole('navigation', { name: 'Navegação principal' }).locator('li a')
  await expect(links).toHaveCount(4)
  expect(
    await links.evaluateAll((items) =>
      items.every((item) => {
        const rect = item.getBoundingClientRect()
        return rect.left >= 0 && rect.right <= innerWidth
      })
    )
  ).toBe(true)
  await page.getByRole('link', { name: '//DOSSIER' }).click()
  await expect(page).toHaveURL(/#about$/)
})

test('página inexistente permite reiniciar a experiência', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const response = await page.goto('/rota-inexistente')
  expect(response?.status()).toBe(404)
  await page.getByRole('link', { name: 'Reiniciar experiência' }).click()
  await expect(page.getByRole('button', { name: 'Pílula azul', exact: true })).toBeVisible()
})
