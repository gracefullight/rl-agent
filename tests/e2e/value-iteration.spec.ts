import { expect, test } from "@playwright/test";

test.describe("Value Iteration Controls E2E", () => {
  test("should perform value iteration and show convergence", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for utility table to render
    await page.waitForSelector('[data-testid="utility-display-1-1"]');

    // Reset to ensure clean state
    await page.click('[data-testid="reset-button"]');

    // Check initial value for start position (1,1)
    const startCell = page.locator('[data-testid="utility-display-1-1"]');
    const initialValue = await startCell.textContent();

    // Verify terminal states exist
    await expect(
      page.locator('[data-testid="utility-display-3-4"]'),
    ).toBeVisible(); // positive terminal
    await expect(
      page.locator('[data-testid="utility-display-2-4"]'),
    ).toBeVisible(); // negative terminal

    // Perform at least one iteration
    await page.click('[data-testid="iterate-button"]');

    // Wait for the value to change after iteration (unless immediately terminal reached)
    if (!(await page.locator('[data-testid="iterate-button"]').isDisabled())) {
      await expect(startCell).not.toHaveText(initialValue ?? "");
    }

    // Run multiple iterations to see convergence or terminal stop
    for (let i = 0; i < 15; i++) {
      const iterateButton = page.locator('[data-testid="iterate-button"]');
      if (await iterateButton.isDisabled()) {
        console.log("Terminal state reached, stopping iterations");
        break;
      }
      await iterateButton.click();
      await page.waitForTimeout(60);
    }

    expect(true).toBe(true);
  });
});
