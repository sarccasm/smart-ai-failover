import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

test.describe("Позитивні сценарії", () => {
  test("Стандартний шлях: Gemini відповідає", async ({ page }) => {
    await page.goto(BASE_URL);

    await page.fill("textarea", "Що таке машинне навчання?");

    const checkbox = page.locator('input[type="checkbox"]');
    await expect(checkbox).not.toBeChecked();

    await page.click('button[type="submit"]');

    await expect(page.locator("text=Відповідь")).toBeVisible({ timeout: 15000 });

    await expect(page.locator("text=✦ Gemini")).toBeVisible();

    await expect(page.locator("text=1")).toBeVisible();
  });

  test("Резервний шлях: Failover до Claude", async ({ page }) => {
    await page.goto(BASE_URL);

    await page.fill("textarea", "Тест failover режиму");

    await page.check('input[type="checkbox"]');

    await page.click('button[type="submit"]');

    await expect(page.locator("text=Відповідь")).toBeVisible({ timeout: 15000 });

    await expect(page.locator("text=◆ Claude")).toBeVisible();
    await expect(page.locator("text=Failover")).toBeVisible();
  });

  test("Запис з'являється в журналі після відповіді", async ({ page }) => {
    await page.goto(BASE_URL);

    await page.fill("textarea", "Запис до журналу");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Відповідь")).toBeVisible({ timeout: 15000 });

    await expect(page.locator("table")).toBeVisible();
    await expect(page.locator("tbody tr")).toHaveCount(1);
  });
});

test.describe("Негативні сценарії", () => {
  test("Кнопка задизейблена якщо textarea порожній", async ({ page }) => {
    await page.goto(BASE_URL);
    const btn = page.locator('button[type="submit"]');
    await expect(btn).toBeDisabled();
  });

  test("Валідація: не відправляє пустий рядок пробілів", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill("textarea", "   ");
    const btn = page.locator('button[type="submit"]');
    await expect(btn).toBeDisabled();
  });

  test("API Outage: показує помилку при недоступному webhook", async ({ page }) => {
    await page.route("**/webhook/**", (route) => route.abort());
    await page.goto(BASE_URL);

    await page.fill("textarea", "Тест помилки мережі");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=⚠️")).toBeVisible({ timeout: 10000 });
  });
});

test("Повний цикл: введення → відправка → відповідь → журнал", async ({ page }) => {
  await page.goto(BASE_URL);

  await page.fill("textarea", "Поясни теорему Піфагора");
  await page.click('button[type="submit"]');

  await expect(page.locator("text=Відповідь")).toBeVisible({ timeout: 15000 });

  await expect(page.locator("tbody tr").first()).toBeVisible();

  await expect(page.locator("text=/ms/")).toBeVisible();

  await expect(page.locator(".grid .text-2xl").first()).toHaveText("1");
});
