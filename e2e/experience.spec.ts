import { expect, test, type Page } from '@playwright/test'

const EXPERIENCE_STORAGE_KEY = 'portfolio:last-reality'
const REALITY_TIMEOUT = 10_000

async function openFreshExperience(page: Page) {
  await page.goto('/')
  await page.evaluate((key) => window.localStorage.removeItem(key), EXPERIENCE_STORAGE_KEY)
  await page.reload()
}

async function chooseReality(page: Page, reality: 'red' | 'blue') {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload()
  await expect(page.locator('main[data-state="pill-selection"]')).toBeVisible({
    timeout: REALITY_TIMEOUT
  })
  const label = reality === 'red' ? 'Pílula vermelha' : 'Pílula azul'
  await page.getByRole('button', { name: label }).click()
  await expect(page.locator(`[data-reality="${reality}"]`).first()).toBeVisible({
    timeout: REALITY_TIMEOUT
  })
}

async function openPersistedReality(page: Page, reality: 'red' | 'blue') {
  await page.addInitScript(
    ([key, value]) => window.localStorage.setItem(key, value),
    [EXPERIENCE_STORAGE_KEY, reality]
  )
  await page.goto('/')
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
  await expect(page.locator('main[data-state="static-noise"]')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Pular introdução' })).toHaveCount(0)
  await chooseReality(page, 'red')

  await expect(
    page.getByRole('heading', { level: 1, name: 'Pedro Henrique Rodrigues', exact: true })
  ).toBeVisible()
  await expect(
    page.locator('[data-section="hero"]').getByText(/Engenheiro de Software Full Stack/)
  ).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toContainText(
    'Projetos'
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

test('restaura a última realidade e permite rever a escolha', async ({ page }) => {
  await openFreshExperience(page)
  await chooseReality(page, 'blue')
  await expect
    .poll(() => page.evaluate((key) => window.localStorage.getItem(key), EXPERIENCE_STORAGE_KEY))
    .toBe('blue')

  await page.reload()
  await expect(page.locator('[data-reality="blue"]').first()).toBeVisible({
    timeout: REALITY_TIMEOUT
  })
  await expect(page.locator('main[data-state="static-noise"]')).toHaveCount(0)

  await page.getByRole('button', { name: 'Rever escolha' }).click()
  await expect(page.locator('main[data-state="pill-selection"]')).toBeVisible()
  await expect
    .poll(() => page.evaluate((key) => window.localStorage.getItem(key), EXPERIENCE_STORAGE_KEY))
    .toBeNull()
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

test('os comandos Matrix trocam o conteúdo em foco', async ({ page }) => {
  await openPersistedReality(page, 'red')

  await page.getByRole('button', { name: /Freelancer/ }).click()
  await expect(page.getByRole('heading', { name: 'Desenvolvedor Full Stack' })).toBeVisible()

  await page.getByRole('button', { name: /Back-end/ }).click()
  await expect(page.getByRole('heading', { name: 'Back-end' })).toBeVisible()
})

test('atalho Enter avança da faixa de projetos para a próxima seção', async ({ page }) => {
  await openPersistedReality(page, 'red')
  await page.locator('#projects').scrollIntoViewIfNeeded()

  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
  const beforeEnter = await page.evaluate(() => window.scrollY)
  await page.keyboard.press('Enter')
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(beforeEnter)
})

test('o scroll percorre os três marcos da timeline antes de liberar projetos', async ({ page }) => {
  await openPersistedReality(page, 'red')
  const timeline = page.locator('#experience [data-workspace-variant="timeline"]')

  for (const [progress, heading] of [
    [0.08, 'Engenheiro de Software'],
    [0.5, 'Desenvolvedor Full Stack'],
    [0.92, 'Curador Front-end']
  ] as const) {
    await timeline.evaluate((element, ratio) => {
      const bounds = element.getBoundingClientRect()
      const top = window.scrollY + bounds.top
      const travel = Math.max(1, bounds.height - window.innerHeight * 0.58)
      window.scrollTo({
        top: top + travel * ratio - window.innerHeight * 0.22,
        behavior: 'instant'
      })
    }, progress)
    await expect(page.getByRole('heading', { name: heading })).toBeVisible()
  }

  await page.locator('#projects').scrollIntoViewIfNeeded()
  await expect(page).toHaveURL(/#projects$/)
})

test('projetos percorrem uma faixa horizontal e liberam o scroll após Rods Themes', async ({
  page
}) => {
  await openPersistedReality(page, 'red')
  await page.locator('#projects').scrollIntoViewIfNeeded()

  const cards = page.locator('#projects [data-project-card]')
  await expect(cards).toHaveCount(4)
  const positions = await cards.evaluateAll((elements) =>
    elements.map((element) => element.getBoundingClientRect().left)
  )
  expect(positions[1]).toBeGreaterThan(positions[0])
  expect(positions[2]).toBeGreaterThan(positions[1])

  const activeCard = page.locator('#projects [data-active="true"] [data-project-card]')
  await expect(activeCard).toBeVisible()

  for (let index = 0; index < 10; index += 1) {
    await page.mouse.wheel(0, 650)
    if ((await activeCard.textContent())?.includes('Rods Themes')) break
  }

  await expect(activeCard).toContainText('Rods Themes')
  await page.mouse.wheel(0, 1800)
  await expect(page).toHaveURL(/#stack$/)
})

test('movimento reduzido mantém os projetos em fluxo vertical legível', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openPersistedReality(page, 'red')
  await page.locator('#projects').scrollIntoViewIfNeeded()
  await expect(page.locator('[data-project-card]')).toHaveCount(4)
  await expect(page.getByRole('heading', { name: 'Rods Themes' })).toBeVisible()
})

test('carrega as duas realidades sem erros de console', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))

  await openPersistedReality(page, 'red')
  await expect(page.getByRole('heading', { name: 'Rods SDK' })).toBeVisible()
  await page.getByRole('button', { name: 'Rever escolha' }).click()
  await page.getByRole('button', { name: 'Pílula azul' }).click()
  await expect(page.locator('[data-reality="blue"]').first()).toBeVisible({
    timeout: REALITY_TIMEOUT
  })
  expect(errors).toEqual([])
})
