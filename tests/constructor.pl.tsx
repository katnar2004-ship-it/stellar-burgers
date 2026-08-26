import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false
  });

  await page.routeFromHAR('./tests/hars/user.har', {
    url: '**/auth/user',
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
  test('успешное оформление заказа', async ({ page }) => {
    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { email: 'test@test.com', name: 'Test User' }
        })
      });
    });

    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          name: 'Флюоресцентный бургер',
          order: {
            _id: '662a2580db914001b9f03b42',
            ingredients: [
              '643d69a5c3f7b9001cfa093d',
              '643d69a5c3f7b9001cfa0949',
              '643d69a5c3f7b9001cfa094a'
            ],
            status: 'done',
            name: 'Флюоресцентный бургер',
            createdAt: '2024-04-25T10:00:00.000Z',
            updatedAt: '2024-04-25T10:00:00.000Z',
            number: 109014
          }
        })
      });
    });

    await page.goto('/');
    await expect(page.getByTestId('ingredient-bun').first()).toBeVisible({
      timeout: 10000
    });

    await expect(page.getByTestId('constructor-bun-top')).not.toBeVisible();
    await expect(page.getByTestId('constructor-ingredients')).not.toContainText(
      await page
        .locator('[data-ingredient-id="643d69a5c3f7b9001cfa093d"]')
        .locator('p.text_type_main-default')
        .innerText()
    );

    await page
      .locator('[data-ingredient-id="643d69a5c3f7b9001cfa093d"]')
      .getByRole('button', { name: 'Добавить' })
      .click();
    await page
      .locator('[data-ingredient-id="643d69a5c3f7b9001cfa0949"]')
      .getByRole('button', { name: 'Добавить' })
      .click();
    await page
      .locator('[data-ingredient-id="643d69a5c3f7b9001cfa094a"]')
      .getByRole('button', { name: 'Добавить' })
      .click();

    await expect(page.getByTestId('constructor-bun-top')).toBeVisible();
    await expect(page.getByTestId('constructor-ingredients')).toBeVisible();

    await expect(page.getByTestId('modal')).not.toBeVisible();

    await page.getByTestId('order-button').click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByText('109014')).toBeVisible({ timeout: 15000 });

    await expect(page.getByTestId('constructor-bun-top')).not.toBeVisible();

    await page.getByTestId('modal-close-button').click();

    await expect(modal).not.toBeVisible();
  });
});
