import type { Page } from '@playwright/test'

/** Existing journey checks can opt into portrait when hardware rotation is unavailable. */
export async function startTv(page: Page) {
  const mobile = await page.evaluate(
    () => window.matchMedia('(max-width: 48rem), (pointer: coarse)').matches
  )
  if (!mobile) return
  await page.getByRole('button', { name: 'Iniciar', exact: true }).click()
  const continuePortrait = page.getByRole('button', { name: 'Continuar na vertical' })
  if (await continuePortrait.isVisible()) await continuePortrait.click()
}
