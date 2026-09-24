import { test, expect } from '@playwright/test'

test('minigame has clear start/stop controls and supports focused Enter', async ({
  page
}, info) => {
  for (const reality of info.project.name === 'mobile' ? ['blue'] : ['red', 'blue']) {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page
      .getByRole('button', {
        name: reality === 'red' ? 'Pílula vermelha' : 'Pílula azul',
        exact: true
      })
      .click()
    const start = page.getByRole('button', { name: 'Iniciar minigame', exact: true })
    await start.scrollIntoViewIfNeeded()
    await expect(start).toBeVisible()
    const scene = page.getByRole('group', {
      name: reality === 'blue' ? 'Caminho entre nuvens' : 'Corredor interativo'
    })
    await page.waitForTimeout(300)
    await start.click()
    await expect(scene).toHaveAttribute('data-active', 'true')
    await page.getByRole('button', { name: 'Encerrar minigame', exact: true }).click()
    await expect(scene).toHaveAttribute('data-active', 'false')
    await expect(start).toBeFocused()
    await scene.focus()
    await page.keyboard.press('Enter')
    await expect(scene).toHaveAttribute('data-active', 'true')
    await page.keyboard.press('Escape')
    await expect(scene).toHaveAttribute('data-active', 'false')
  }
})
