import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page, context }) => {
  await context.addCookies([
    {
      name: 'accessToken',
      value: 'fake-access-token',
      domain: 'localhost',
      path: '/'
    }
  ]);

  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'fake-refresh-token');
  });

  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false
  });

  await page.routeFromHAR('./tests/hars/user.har', {
    url: '**/auth/user',
    update: false
  });

  await page.routeFromHAR('./tests/hars/order.har', {
    url: '**/api/orders',
    update: false
  });

  await page.goto('/');
});

test.describe('Добавление ингредиентов в конструктор', () => {
  test('добавление ингредиента (булки) в конструктор', async ({ page }) => {
    const bun = page.getByTestId('ingredient-bun').first();
    const bunName = await bun.locator('p.text_type_main-default').innerText();

    await expect(page.getByTestId('constructor-bun-top')).not.toBeVisible();

    await bun.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('constructor-bun-top')).toBeVisible();
    await expect(page.getByTestId('constructor-bun-top')).toContainText(
      bunName
    );
  });

  test('добавление ингредиента (начинки) в конструктор', async ({ page }) => {
    const main = page.getByTestId('ingredient-main').first();
    const mainName = await main.locator('p.text_type_main-default').innerText();

    await expect(page.getByTestId('constructor-ingredients')).not.toContainText(
      mainName
    );

    await main.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('constructor-ingredients')).toContainText(
      mainName
    );
  });
});

test.describe('Модальное окно ингредиента', () => {
  test('открытие модального окна ингредиента', async ({ page }) => {
    const bun = page.getByTestId('ingredient-bun').first();
    const bunName = await bun.locator('p.text_type_main-default').innerText();

    await expect(page.getByTestId('modal')).not.toBeVisible();

    await bun.click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByTestId('ingredient-details-name')).toHaveText(
      bunName
    );
  });

  test('закрытие модального окна по клику на крестик', async ({ page }) => {
    const bun = page.getByTestId('ingredient-bun').first();
    await bun.click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();

    await page.getByTestId('modal-close-button').click();

    await expect(modal).not.toBeVisible();
  });

  test('закрытие модального окна по клику на оверлей', async ({ page }) => {
    const bun = page.getByTestId('ingredient-bun').first();
    await bun.click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();

    await page
      .getByTestId('modal-overlay')
      .click({ position: { x: 10, y: 10 } });

    await expect(modal).not.toBeVisible();
  });
});

test.describe('Оформление заказа', () => {
  test('оформление заказа', async ({ page }) => {
    await expect(page.getByTestId('ingredient-bun').first()).toBeVisible({
      timeout: 10000
    });

    await expect(page.getByTestId('constructor-bun-top')).not.toBeVisible();

    const bun = page.locator('[data-ingredient-id="643d69a5c3f7b9001cfa093d"]');
    await bun.getByRole('button', { name: 'Добавить' }).click();

    const main1 = page.locator(
      '[data-ingredient-id="643d69a5c3f7b9001cfa0949"]'
    );
    await main1.getByRole('button', { name: 'Добавить' }).click();

    const main2 = page.locator(
      '[data-ingredient-id="643d69a5c3f7b9001cfa094a"]'
    );
    await main2.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('constructor-bun-top')).toBeVisible();

    await expect(page.getByTestId('modal')).not.toBeVisible();

    await page.getByTestId('order-button').click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByText('12345')).toBeVisible({ timeout: 15000 });

    await expect(page.getByTestId('constructor-bun-top')).not.toBeVisible();
    await expect(page.getByTestId('constructor-ingredients')).not.toContainText(
      await main1.locator('p.text_type_main-default').innerText()
    );
    await expect(page.getByTestId('constructor-ingredients')).not.toContainText(
      await main2.locator('p.text_type_main-default').innerText()
    );

    await page.getByTestId('modal-close-button').click();
    await expect(modal).not.toBeVisible();
  });
});
