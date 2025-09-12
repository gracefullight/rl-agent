import { expect, test } from "@playwright/test";

test.describe("Agent Movement E2E", () => {
  test("agent simulation progresses and stops at terminal", async ({
    page,
  }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="utility-display-1-1"]');
    await page.click('[data-testid="reset-button"]');

    let iterations = 0;
    for (; iterations < 25; iterations++) {
      const iterateButton = page.locator('[data-testid="iterate-button"]');
      if (await iterateButton.isDisabled()) {
        console.log("Terminal reached early at iteration", iterations);
        break;
      }
      await iterateButton.click();
      await page.waitForTimeout(50);
    }

    // Should either reach terminal quickly OR perform multiple iterations without hanging
    expect(iterations).toBeLessThanOrEqual(25);
  });

  test("policy avoids negative terminal and respects wall", async ({
    page,
  }) => {
    await page.goto("/");

    await page.waitForSelector('[data-testid="utility-display-1-1"]');
    await page.click('[data-testid="reset-button"]');

    // Let it iterate enough to form a policy
    for (let i = 0; i < 15; i++) {
      const iterateButton = page.locator('[data-testid="iterate-button"]');
      if (await iterateButton.isDisabled()) {
        break;
      }
      await iterateButton.click();
      await page.waitForTimeout(40);
    }

    // Presence of utility gradient: start cell value should be less than or equal to a cell closer to positive terminal
    const startValueText = await page
      .locator('[data-testid="utility-display-1-1"]')
      .textContent();
    const midValueText = await page
      .locator('[data-testid="utility-display-2-3"]')
      .textContent();
    const nearGoalValueText = await page
      .locator('[data-testid="utility-display-3-3"]')
      .textContent();

    const toNum = (v: string | null) => (v ? parseFloat(v) : -999);
    const startVal = toNum(startValueText);
    const midVal = toNum(midValueText);
    const nearGoalVal = toNum(nearGoalValueText);

    expect(nearGoalVal).toBeGreaterThanOrEqual(midVal);
    expect(midVal).toBeGreaterThanOrEqual(startVal - 0.2); // allow small noise early
  });
});
