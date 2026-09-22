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

test('carrega as duas realidades sem erros de console', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))

  await openReality(page, 'red')
  await expect(page.getByRole('heading', { name: 'Rods SDK' })).toBeVisible()
  await page.getByRole('button', { name: 'Rever escolha' }).click()
  await page.getByRole('button', { name: 'Pílula azul' }).click()
  await expect(page.locator('[data-reality="blue"]').first()).toBeVisible({
    timeout: REALITY_TIMEOUT
  })
  expect(errors).toEqual([])
})
