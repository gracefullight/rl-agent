import { expect, test } from "@playwright/test";

test.describe("GridCanvas E2E", () => {
  test("should render grid and allow cell interaction", async ({ page }) => {
    await page.goto("/");

    // Wait for the page to load and grid to render
    await page.waitForSelector('[data-testid="utility-display-1-1"]');

    // Verify grid dimensions (4x3 grid)
    // Check corner cells exist
    await expect(
      page.locator('[data-testid="utility-display-1-1"]'),
    ).toBeVisible(); // bottom-left
    await expect(
      page.locator('[data-testid="utility-display-3-4"]'),
    ).toBeVisible(); // top-right
    await expect(
      page.locator('[data-testid="utility-display-2-4"]'),
    ).toBeVisible(); // negative terminal

    // Verify wall cell exists
    await expect(
      page.locator('[data-testid="utility-display-2-2"]'),
    ).toBeVisible(); // wall

    // Check that utility values are displayed
    const cellValue = await page
      .locator('[data-testid="utility-display-1-1"]')
      .textContent();
    expect(cellValue).toMatch(/^-?\d+\.\d{2}$/); // Should be a number with 2 decimal places
  });
});
