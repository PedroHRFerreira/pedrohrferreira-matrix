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

test('introdução completa chega à Blue sem pular as etapas', async ({ page }) => {
  test.setTimeout(90_000)
  await page.goto('/')
  for (const state of ['static-noise', 'signal-reveal', 'waiting-first-enter']) {
    await expect(page.locator(`main[data-state="${state}"]`)).toBeVisible({ timeout: 40_000 })
  }
  await page.keyboard.press('Enter')
  await expect(page.locator('main[data-state="waiting-second-enter"]')).toBeVisible({
    timeout: 30_000
  })
  await page.keyboard.press('Enter')
  await page.getByRole('button', { name: 'Pílula azul', exact: true }).click()
  await expect(page.locator('[data-reality="blue"]').first()).toBeVisible({ timeout: 10_000 })
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
    'pedro@matrix:~#'
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

test('diálogo red interrompe a digitação quando movimento reduzido é ativado', async ({ page }) => {
  await openReality(page, 'red')
  await page.locator('#dialogue').scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: 'Como ele constrói?' }).click()
  const answer = page.locator('#dialogue [class*="answer"]')
  await expect(answer).toContainText('Com')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(answer).toHaveText(
    'Com sistemas modulares, código testável e escolhas técnicas guiadas pelo problema. Cada camada precisa conversar com a próxima.'
  )
  await answer.evaluate((node) => {
    node.setAttribute('data-text-writes', '0')
    const observer = new MutationObserver(() => node.setAttribute('data-text-writes', '1'))
    observer.observe(node, { characterData: true, childList: true, subtree: true })
  })
  await page.waitForTimeout(250)
  await expect(answer).toHaveAttribute('data-text-writes', '0')
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
  await expect(page.locator('[data-black-cat]')).toHaveAttribute('data-cat-pass', 'arrival')
  await expect(page.locator('[data-black-cat]')).toBeHidden({ timeout: 7000 })
  for (const [id, direction] of [
    ['projects', 'left'],
    ['stack', 'right']
  ] as const) {
    const gallery = page.locator(`#${id}`)
    await expect(gallery).toHaveAttribute('data-enhanced', 'true')
    await gallery.evaluate((node) => node.scrollIntoView({ block: 'start', behavior: 'instant' }))
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

test('blue restaura cards ao alternar movimento reduzido e largura da tela', async ({
  page
}, testInfo) => {
  test.skip(testInfo.project.name === 'mobile')
  await page.setViewportSize({ width: 1440, height: 900 })
  await openReality(page, 'blue')

  const assertVerticalCards = async () => {
    for (const id of ['projects', 'stack']) {
      const gallery = page.locator(`#${id}`)
      await expect(gallery).not.toHaveAttribute('data-enhanced', 'true')
      for (const card of await gallery.locator('article').all()) {
        await card.scrollIntoViewIfNeeded()
        await expect(card).toBeInViewport()
        const rect = await card.boundingBox()
        expect(rect).not.toBeNull()
        expect(rect!.x).toBeGreaterThanOrEqual(0)
        expect(rect!.x + rect!.width).toBeLessThanOrEqual(page.viewportSize()!.width + 1)
      }
    }
  }

  await expect(page.locator('#stack')).toHaveAttribute('data-enhanced', 'true')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await assertVerticalCards()
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(page.locator('#stack')).toHaveAttribute('data-enhanced', 'true')
  await page.setViewportSize({ width: 390, height: 844 })
  await assertVerticalCards()
  await page.setViewportSize({ width: 1440, height: 900 })
  await expect(page.locator('#stack')).toHaveAttribute('data-enhanced', 'true')
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

test('header red não exibe abas em 320 px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 })
  await openReality(page, 'red', 'reduce')
  const header = page.getByRole('navigation', { name: 'Navegação principal' })
  await expect(header.locator('li a')).toHaveCount(0)
  await expect(header.getByText('pedro@matrix:~#')).toBeVisible()
  await expect(header.getByText('SYS: ONLINE', { exact: false })).toBeVisible()
})

test('página inexistente permite reiniciar a experiência', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const response = await page.goto('/rota-inexistente')
  expect(response?.status()).toBe(404)
  await page.getByRole('link', { name: 'Reiniciar experiência' }).click()
  await expect(page.getByRole('button', { name: 'Pílula azul', exact: true })).toBeVisible()
})

test('texto de apresentação red anima apenas na primeira visita', async ({ page }) => {
  await openReality(page, 'red')
  const section = page.locator('#about')
  const panel = section.locator('[data-terminal-type="true"]')
  await section.scrollIntoViewIfNeeded()
  await expect(panel).toHaveAttribute('aria-busy', 'true')
  await expect(panel).toHaveAttribute('aria-busy', 'false')
  const completeText = await panel.textContent()
  await page.evaluate(() =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })
  )
  await expect(section).not.toBeInViewport()
  await panel.evaluate((element) => {
    element.setAttribute('data-replays', '0')
    const observer = new MutationObserver((records) => {
      if (
        records.some(
          (record) =>
            record.type === 'characterData' ||
            (record.attributeName === 'aria-busy' && record.oldValue === 'false')
        )
      ) {
        element.setAttribute('data-replays', '1')
      }
    })
    observer.observe(element, {
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['aria-busy'],
      attributeOldValue: true
    })
  })
  await section.scrollIntoViewIfNeeded()
  await expect(section).toBeInViewport()
  await page.waitForTimeout(500)
  await expect(panel).toHaveAttribute('data-replays', '0')
  expect(await panel.textContent()).toBe(completeText)
})

test('blue reconhece o retorno e permite reconsiderar a pílula', async ({ page }) => {
  await openReality(page, 'blue', 'reduce')
  await expect(page.getByText('Uma prática digital centrada em pessoas')).toBeVisible()
  await page.locator('footer').scrollIntoViewIfNeeded()
  await page.getByRole('link', { name: 'Voltar ao início ↑' }).click()
  await expect(page.getByText('Você já esteve aqui', { exact: true })).toBeVisible()
  await page.locator('footer').scrollIntoViewIfNeeded()
  await page.getByRole('button', { name: /E se você tivesse escolhido diferente/ }).click()
  await expect(page.locator('main[data-state="waiting-return-enter"]')).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'O que é real? Como você define o real?', exact: true })
  ).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(page.locator('main[data-state="return-selection"]')).toBeVisible()
  await expect(
    page.getByRole('heading', {
      name: 'Há uma diferença entre conhecer o caminho e percorrer o caminho.',
      exact: true
    })
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'Pílula vermelha', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Pílula vermelha', exact: true }).click()
  await expect(page.locator('main#main-content')).toBeVisible()
  await expect(page.locator('[data-reality="red"]').first()).toBeVisible()
})

test('red retorna à TV com as frases do mundo dos sonhos', async ({ page }) => {
  await openReality(page, 'red', 'reduce')
  await page.getByRole('button', { name: /E se você pudesse voltar a sonhar/ }).click()
  await expect(page.locator('main[data-state="waiting-return-enter"]')).toBeVisible()
  await expect(
    page.getByRole('heading', {
      name: 'Você tem a cara de quem aceita o que vê, porque tá esperando acordar?',
      exact: true
    })
  ).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(page.locator('main[data-state="return-selection"]')).toBeVisible()
  await expect(
    page.getByRole('heading', {
      name: 'A ignorância é uma bênção!',
      exact: true
    })
  ).toBeVisible()
  await page.getByRole('button', { name: 'Pílula azul', exact: true }).click()
  await expect(page.locator('[data-reality="blue"]').first()).toBeVisible()
})

test('gato repete a passagem uma vez ao chegar ao footer', async ({ page }) => {
  await openReality(page, 'blue')
  const cat = page.locator('[data-black-cat]')
  await expect(cat).toHaveAttribute('data-cat-pass', 'arrival')
  await expect(cat).toBeHidden({ timeout: 7000 })
  await page.locator('footer').scrollIntoViewIfNeeded()
  await expect(cat).toHaveAttribute('data-cat-pass', 'footer')
  await expect(cat).toBeVisible()
  await expect(cat).toBeHidden({ timeout: 7000 })
  await page.getByRole('link', { name: 'Voltar ao início ↑' }).click()
  await expect(page.getByText('Você já esteve aqui', { exact: true })).toBeVisible()
  await page.locator('footer').scrollIntoViewIfNeeded()
  await expect(cat).toBeHidden()
})

test('animações do footer pausam fora da tela e retomam ao entrar', async ({ page }) => {
  await openReality(page, 'blue')
  const footer = page.locator('footer')
  await expect(footer).toHaveAttribute('data-motion-paused', 'true')
  const button = footer.getByRole('button', { name: /E se você tivesse escolhido diferente/ })
  expect(
    await button.evaluate((node) => getComputedStyle(node, '::after').animationPlayState)
  ).toBe('paused')
  await expect(page.locator('[data-black-cat]')).toBeHidden({ timeout: 7000 })
  await footer.scrollIntoViewIfNeeded()
  await expect(footer).not.toHaveAttribute('data-motion-paused', 'true')
  expect(
    await button.evaluate((node) => getComputedStyle(node, '::after').animationPlayState)
  ).toBe('running')
})

test('rolagem na mesma seção não reescreve o histórico a cada quadro', async ({ page }) => {
  await openReality(page, 'blue', 'reduce')
  const writes = await page.evaluate(async () => {
    const original = history.replaceState
    let count = 0
    history.replaceState = function (...args) {
      count++
      return original.apply(this, args)
    }
    try {
      for (let index = 0; index < 10; index++) {
        window.scrollTo({ top: 30 + index * 4, behavior: 'instant' })
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
        )
      }
      return count
    } finally {
      history.replaceState = original
    }
  })
  expect(writes).toBeLessThanOrEqual(1)
})
