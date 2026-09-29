import { expect, test } from '@playwright/test'
import { instant } from '@next/playwright'

test('project page opens instantly from a featured card', async ({ page }) => {
  await page.goto('/pl')
  await page
    .locator('a[href="/pl/project/rozliczkorki"]')
    .scrollIntoViewIfNeeded()

  await instant(page, async () => {
    await page.click('a[href="/pl/project/rozliczkorki"]')
    await expect(
      page.getByRole('link', { name: 'Wszystkie projekty' })
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { level: 1, name: 'RozliczKorki' })
    ).toBeVisible()
  })
})

test('project page opens instantly from the project list', async ({ page }) => {
  await page.goto('/en')
  await page
    .locator('a[href="/en/project/better-usos"]')
    .scrollIntoViewIfNeeded()

  await instant(page, async () => {
    await page.click('a[href="/en/project/better-usos"]')
    await expect(
      page.getByRole('heading', { level: 1, name: 'Better USOS' })
    ).toBeVisible()
  })
})

test('going back to the home page is instant', async ({ page }) => {
  await page.goto('/pl/project/pwr-racing')

  await instant(page, async () => {
    await page.click('a:has-text("Wszystkie projekty")')
    await expect(
      page.getByRole('heading', { name: 'Wybrane projekty' })
    ).toBeVisible()
  })
})

test('an unknown project shows the not found page', async ({ page }) => {
  await page.goto('/pl/project/does-not-exist')
  await expect(page.getByText('404')).toBeVisible()
})

test('the command palette opens a project by its name', async ({ page }) => {
  await page.goto('/pl', { waitUntil: 'networkidle' })
  await page.keyboard.press('ControlOrMeta+k')
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.type('usos')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/pl\/project\/better-usos$/)
  await expect(
    page.getByRole('heading', { level: 1, name: 'Better USOS' })
  ).toBeVisible()
})
